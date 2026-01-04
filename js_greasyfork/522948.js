// ==UserScript==
// @name         Mavens Hand History Saver
// @namespace    strobe878
// @version      5
// @description  Saves poker hand histories and allows downloading them as ZIP files
// @author       strobe878
// @match        *://<insert-your-mavens-url-here>/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522948/Mavens%20Hand%20History%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/522948/Mavens%20Hand%20History%20Saver.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const dbVersion = 2;

  // Track tables and their current hand histories
  const tables = new Map(); // tableId -> TableHand

  // Global variables
  let username = null;
  let menuItem = null;
  let previousUsername = null;
  const initializedDatabases = new Set();

  // Constants
  const DB_PREFIX = 'PokerHandsDB_';
  const STORE_NAME = 'hands';

  // Check if we're running in a mobile context
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Add error handling for script initialization
  window.addEventListener('error', function(e) {
    console.error('[PHHS] Global error:', e.message, 'at', e.filename, ':', e.lineno);
  });

  // Define the debounce helper before using it
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Main observer for detecting tables and username changes
  const mainObserver = new MutationObserver(
    debounce(async (mutations) => {
      // Try both desktop and mobile selectors for lobby
      let lobbyDiv = isMobile ?
      document.getElementById('SiteMobile') :
      document.querySelector('div#Lobby > div.header > div.title');

      if (!lobbyDiv) {
        return;
      }

      const lobbyTitle = lobbyDiv.textContent;

      // Get username from lobby
      let newUsername = null;
      if (isMobile) {
        // two cases: lobby view or table view
        newUsername = (lobbyTitle.match(/.+ - Logged in as (.+)/) || [])[1]?.trim() ||
        (lobbyTitle.match(/.+ - (.+)/) || [])[1]?.trim() ||
        null;
      } else {
        newUsername = (lobbyTitle.match(/Lobby - (.+) logged in/) || [])[1]?.trim() ||
        null;
      }

      // Update UI if username changed
      if (newUsername !== username) {
        updateUI(newUsername);
        username = newUsername;
      }

      if (!username) {
        for (const [tableId, table] of tables) {
          await saveAndRemoveTable(tableId);
        }
        return;
      }

      // Initialize database if needed
      try {
        await initializeDB(username);
      } catch (error) {
        console.error('[PHHS] Failed to initialize database:', error);
        return;
      }

      // Find active tables
      const tableDivs = Array.from(document.querySelectorAll('div[class="dialog"]:has(> div[class="tablecontent"])'));
      const activeTables = tableDivs
      .map(tableDiv => {
        let currentDiv = tableDiv.nextElementSibling;
        while (currentDiv) {
          if (currentDiv.classList.contains('dialog')) {
            const infotabs = currentDiv.querySelector('div.infotabs');
            if (infotabs) return infotabs;
          }
          currentDiv = currentDiv.nextElementSibling;
        }
        return null;
      })
      .filter(Boolean);

      // Remove closed tables
      for (const [tableId, table] of tables) {
        if (!activeTables.includes(table.div)) {
          await saveAndRemoveTable(tableId);
        }
      }

      // Process active tables
      activeTables.forEach(tableDiv => {
        const infoDiv = tableDiv.querySelector('div.generalinfo > div.memo > pre');
        if (!infoDiv?.textContent) return;

        const tableMatch = infoDiv.textContent.match(/^Table name:\s+(.+)/) ||
              infoDiv.textContent.match(/^Tournament name:\s+(.*)/);

        const typeMatch = infoDiv.textContent.match(/Type:\s+(.+)/);

        if (!tableMatch || !typeMatch) return;

        const tableName = tableMatch[1].trim();
        const tableType = typeMatch[1].trim();
        const tableId = `${tableName} [${tableType}]`;

        // Create new table tracking if it doesn't exist
        if (!tables.has(tableId)) {
          const tableHand = new TableHand(tableId);
          tables.set(tableId, tableHand);
          tableHand.attachTo(tableDiv);
        }
      });
    }, 500)
  );

  // Helper function to save and remove a table
  async function saveAndRemoveTable(tableId) {
    const table = tables.get(tableId);
    if (table) {
      await table.save();
      table.detach();
      tables.delete(tableId);
    }
  }

  // Function to start observing
  const startObserving = () => {
    // Try both desktop and mobile selectors
    const clientDiv = document.getElementById('client_div') ||
    document.getElementById('SiteMobile') ||
    document.querySelector('.site-mobile');

    if (clientDiv) {
      mainObserver.observe(clientDiv, {
        childList: true,
        subtree: true
      });
    } else {
      setTimeout(startObserving, 2000);
    }
  };

  // Start immediately but also retry if needed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving);
  } else {
    startObserving();
  }

  // Get database name for current user
  const getDBName = (username) => `${DB_PREFIX}${username}`;

  // Structure for tracking a table's current hand
  class TableHand {
    constructor(tableId) {
      this.tableId = tableId;
      this.handNumber = null;
      this.lines = [];
      this.div = null;
      this.observer = null;
    }

    async addLines(text) {
      const handMatch = text.match(/Hand #(\d+-\d+)/);
      if (!handMatch) {
        return;
      }

      const handNumber = handMatch[1];

      if (this.handNumber !== handNumber) {
        await this.save();
        this.handNumber = handNumber;
      }

      this.lines = text
        .split('<br>')
        .map(line => line.trim())
        .filter(line => line);
    }

    async save() {
      if (!username || !this.handNumber) {
        return;
      }
      const filename = `${this.tableId}-${this.handNumber}.txt`;

      try {
        await withDB(username, async (db) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);

          await Promise.all([
            new Promise((resolve, reject) => {
              const request = store.put({
                tableId: this.tableId,
                handNumber: this.handNumber,
                content: this.lines.join('\n'),
                contentType: 'text/plain'
              });
              request.onerror = () => reject(request.error);
              request.onsuccess = () => resolve();
            }),
            new Promise((resolve, reject) => {
              transaction.oncomplete = () => resolve();
              transaction.onerror = () => reject(transaction.error);
            })
          ]);
        });
      } catch (error) {
        console.error(`[PHHS] Error saving hand ${filename}:`, error);
      }
      this.handNumber = null;
      this.lines = [];
    }

    attachTo(tableDiv) {
      this.div = tableDiv;
      this.observer = createTableObserver(tableDiv, this.tableId, username);
    }

    detach() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      this.div = null;
    }
  }

  // Create observer for a table's history
  function createTableObserver(tableDiv, tableId, username) {
    const historyDiv = tableDiv.querySelector('div.historyinfo > div.memo');
    if (!historyDiv) {
      console.error(`[PHHS] Could not find history div for table ${tableId}`);
      return null;
    }

    const observer = new MutationObserver(async (mutations) => {
      const historyText = historyDiv.innerHTML;
      const tableHand = tables.get(tableId);
      await tableHand.addLines(historyText);
    });

    observer.observe(historyDiv, {
      childList: true,
      characterData: true,
      subtree: true
    });

    return observer;
  }

  // Helper for creating menu items
  const createMenuItem = (id, text, handler) => {
    const item = document.createElement('li');
    item.id = id;
    item.textContent = text;

    $(item).on("touchstart mousedown", function(e) {
      if (!menuItem) {
        menuItem = this;
        return false;
      }
    });

    $(item).on("touchend mouseup", function(e) {
      if (!menuItem) return;
      const wasMenuItem = (this === menuItem);
      $(this).parent().hide();
      menuItem = null;
      if (wasMenuItem) {
        handler();
      }
      return false;
    });

    return item;
  };

  // Create UI elements
  const createUI = () => {
    const accountSpan = document.querySelector('span#AccountMenu');
    if (!accountSpan) {
      console.error('[PHHS] Account menu span not found');
      return null;
    }

    const accountMenu = accountSpan.nextElementSibling;
    if (!accountMenu || accountMenu.tagName !== 'UL') {
      console.error('[PHHS] Account menu ul not found');
      return null;
    }

    const computedStyle = window.getComputedStyle(accountMenu);
    const defaultColor = computedStyle.color;
    const defaultBgColor = computedStyle.backgroundColor;

    // Create Download Hands menu item
    const downloadItem = createMenuItem('AccountDownloadHands', 'Download hand histories...', handleDownload);
    const clearItem = createMenuItem('AccountClearHands', 'Clear hand histories...', handleClear);

    // Set initial styles and add hover effects
    [downloadItem, clearItem].forEach(item => {
      item.style.color = defaultColor;
      item.style.backgroundColor = defaultBgColor;

      // Add hover effects
      item.addEventListener('mouseenter', () => {
        item.style.color = defaultBgColor;
        item.style.backgroundColor = defaultColor;
      });
      item.addEventListener('mouseleave', () => {
        item.style.color = defaultColor;
        item.style.backgroundColor = defaultBgColor;
      });
    });

    // Add items to menu
    accountMenu.appendChild(downloadItem);
    accountMenu.appendChild(clearItem);

    return { downloadButton: downloadItem, clearButton: clearItem };
  };

  // Remove UI elements
  const removeUI = () => {
    const downloadItem = document.getElementById('AccountDownloadHands');
    const clearItem = document.getElementById('AccountClearHands');

    if (downloadItem) downloadItem.remove();
    if (clearItem) clearItem.remove();
  };

  // Handle download click
  const handleDownload = async () => {
    if (!username) {
      console.error('[PHHS] No username available for download');
      return;
    }

    let db = null;
    try {
      const dbName = getDBName(username);

      // Open database
      db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });

      // Check if store exists
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        alert('No hand histories available.');
        return;
      }

      // Get all hands
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const hands = await new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });

      if (hands.length === 0) {
        alert('No hand histories available.');
        return;
      }

      // Create a file for each table and session.
      // The hand number, e.g., 1234-5, has two parts:
      //   First part: absolute hand number across all tables
      //   Second part: hand number for the current session on a table, starting from 1.
      try {
        const zip = new JSZip();

        // Group hands by table and session
        const sessions = new Map(); // Map<tableId, Map<sessionStart, hands[]>>

        // First pass: Initialize tables and their sessions
        hands.forEach(hand => {
          const { tableId, handNumber } = hand;
          const [absoluteHandNumber, sessionHandNumber] = handNumber.split('-').map(Number);

          if (!sessions.has(tableId)) {
            sessions.set(tableId, new Map());
          }

          if (sessionHandNumber === 1) {
            sessions.get(tableId).set(absoluteHandNumber, []);
          }
        });

        // Second pass: Add hands to their sessions
        hands.forEach(hand => {
          const { tableId, handNumber } = hand;
          const [absoluteHandNumber] = handNumber.split('-').map(Number);
          
          const tableMap = sessions.get(tableId);
          const sessionStarts = [...tableMap.keys()].filter(start => start <= absoluteHandNumber);
          
          let sessionStart;
          if (sessionStarts.length === 0) {
            // If no valid session start found, create a new session starting at this hand
            sessionStart = absoluteHandNumber;
            tableMap.set(sessionStart, []);
          } else {
            sessionStart = Math.max(...sessionStarts);
          }
          
          // Ensure the session array exists
          if (!tableMap.has(sessionStart)) {
            tableMap.set(sessionStart, []);
          }
          
          tableMap.get(sessionStart).push(hand);
        });

        // Sort sessions by start time and create files
        for (const [tableId, tableSessions] of sessions) {
          // Convert to array and sort by session start time
          const sortedSessions = [...tableSessions.entries()].sort(([a], [b]) => a - b);
          
          for (const [sessionStart, sessionHands] of sortedSessions) {
            if (sessionHands.length === 0) continue; // Skip empty sessions

            // Sort hands within session by absolute hand number
            sessionHands.sort((a, b) => {
              const [aAbs] = a.handNumber.split('-').map(Number);
              const [bAbs] = b.handNumber.split('-').map(Number);
              return aAbs - bAbs;
            });

            // Concatenate hands in a session
            const sessionContent = sessionHands.map(hand => hand.content).join('\n\n');
            const filename = `${tableId} - Session starting ${sessionStart}.txt`;
            zip.file(filename, sessionContent);
          }
        }

        const blob = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE"
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poker_hands_${username}_${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (e) {
        console.error('Error creating zip:', e);
      }

    } catch (error) {
      console.error('[PHHS] Error during download:', error);
    } finally {
      if (db) {
        db.close();
      }
    }
  };

  // Handle clear click
  const handleClear = async () => {
    if (!username) {
      return;
    }

    let db = null;
    try {
      const dbName = getDBName(username);

      // Open database
      db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });

      // Check if store exists
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        alert('No hand histories available.');
        return;
      }

      // Get count and size before confirming
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const hands = await new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });

      if (hands.length === 0) {
        alert('No hand histories available.');
        return;
      }

      const totalBytes = hands.reduce((sum, hand) => sum + hand.content.length, 0);
      const size = formatSize(totalBytes);

      if (!confirm(`Are you sure you want to clear all stored hands?\n\nThis will delete ${hands.length} hands (${size}).`)) {
        return;
      }

      // Clear all hands
      const clearTransaction = db.transaction([STORE_NAME], 'readwrite');
      const clearStore = clearTransaction.objectStore(STORE_NAME);
      await new Promise((resolve, reject) => {
        const request = clearStore.clear();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.error('Error clearing hands:', error);
    } finally {
      if (db) {
        db.close();
      }
    }
  };

  // Database helper
  const withDB = async (username, callback) => {
    if (!username) {
      console.error('[PHHS] DB operation attempted without username');
      return null;
    }

    let db = null;
    try {
      const dbName = getDBName(username);
      db = await new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
      return await callback(db);
    } catch (error) {
      console.error('[PHHS] Database error:', error);
      throw error;
    } finally {
      if (db) {
        db.close();
      }
    }
  };

  // Initialize database for a user
  const initializeDB = (username) => {
    return new Promise((resolve, reject) => {
      const dbName = getDBName(username);

      const request = indexedDB.open(dbName, dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (event.oldVersion < 1) {
          db.createObjectStore(STORE_NAME, { keyPath: ['tableId', 'handNumber'] });
          return;
        }

        if (event.oldVersion < 2) {
          const transaction = event.target.transaction;
          const oldStore = transaction.objectStore(STORE_NAME);

          oldStore.getAll().onsuccess = (event) => {
            const records = event.target.result;

            // Delete old store
            db.deleteObjectStore(STORE_NAME);

            // Create new store with composite key
            const newStore = db.createObjectStore(STORE_NAME, {
              keyPath: ['tableId', 'handNumber']
            });

            // Migrate each record
            records.forEach(record => {
              // Split out the tableId and handNumber from the filename
              const match = record.filename.match(/(.*)-([^-]+-[^-]+)\.txt$/);

              if (match) {
                const [_, tableId, handNumber] = match;

                newStore.add({
                  tableId,
                  handNumber,
                  content: record.content,
                  contentType: record.contentType
                });
              }
            });
          };
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        db.close();
        resolve();
      };

      request.onerror = (event) => {
        console.error('Database initialization error:', event.target.error);
        reject(event.target.error);
      };
    });
  };

  // Update UI based on username changes
  const updateUI = async (newUsername) => {
    if (previousUsername !== newUsername) {
      initializedDatabases.clear();
    }

    // Username changed from null to non-null
    if (!previousUsername && newUsername) {
      const elements = createUI();
      if (elements) {
        const { downloadButton, clearButton } = elements;
        await initializeDB(newUsername);
      }
    }
    // Username changed from non-null to null
    else if (previousUsername && !newUsername) {
      removeUI();
    }
    // Username changed to different user
    else if (previousUsername && newUsername && previousUsername !== newUsername) {
      await initializeDB(newUsername);
    }

    previousUsername = newUsername;
  };

  // Helper function to format size
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };
})();
