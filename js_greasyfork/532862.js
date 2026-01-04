// ==UserScript==
// @name         Milky Way Idle Leaderboard Uploader
// @namespace    http://tampermonkey.net/
// @version      3.0.6
// @description  Uploads character data to a custom private leaderboard server
// @author       Nex
// @match        https://www.milkywayidle.com/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      li-mwi-leaderboard.ngrok.io
// @downloadURL https://update.greasyfork.org/scripts/532862/Milky%20Way%20Idle%20Leaderboard%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/532862/Milky%20Way%20Idle%20Leaderboard%20Uploader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SECRET_KEY = 'CONTACT NEX FOR THIS';
  const API_BASE = 'https://li-mwi-leaderboard.ngrok.io/api';

  const global_url_config = {
    magic_api: {
      PROFILE_SHARED_UPLOAD: `${API_BASE}/profile_shared_upload`,
      REGISTERCHARACTER: `${API_BASE}/register_character`,
      PARTY_INFO: `${API_BASE}/party_info`,
      PROFILE_VIEW_UPLOAD: `${API_BASE}/profile_shared_upload_from_profile_view`,
    },
  };

  const safeConsole = {
    log: function(...args) {
        try {
            // Try Tampermonkey's log first
            if (typeof GM_log !== 'undefined') {
                GM_log('[MWI] ' + args.join(' '));
                return;
            }
            
            // Fallback to creating a new console instance
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            iframe.contentWindow.console.log('[MWI]', ...args);
            setTimeout(() => iframe.remove(), 1000);
        } catch (e) {
            // Absolute fallback - use window.name as a log buffer
            window.name = window.name + '\n[MWI] ' + args.join(' ');
        }
    }
};

// Override the log function
function log(...args) {
    safeConsole.log(...args);
    
    // Also show toast notifications for important events
    if (args[0].includes('✅') || args[0].includes('❌')) {
        try {
            GM_notification({
                title: 'MWI Uploader',
                text: args[0],
                silent: true
            });
        } catch (e) {
            // Ignore if GM_notification fails
        }
    }
}

  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: type === 'success' ? '#4CAF50' : '#f44336',
      color: '#fff',
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      zIndex: 9999,
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      opacity: '0',
      transition: 'opacity 0.3s ease-in-out',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => (toast.style.opacity = '1'));
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function sendRequest({ method, url, data, headers = {}, onload, onerror }) {
    const shortUrl = url.replace(API_BASE, '');
    log(`Sending to ${shortUrl}`);
    
    GM_xmlhttpRequest({
        method,
        url,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        data: JSON.stringify(data),
        onload: function(response) {
            log(`Received response from ${shortUrl} (${response.status})`);
            if (response.status >= 400) {
                log(`Error: ${response.responseText}`);
            }
            onload?.(response);
        },
        onerror: function(error) {
            log(`Request to ${shortUrl} failed`, error);
            onerror?.(error);
        }
    });
}

  function resolveCSSVarDeep(str, element) {
    if (!str || typeof str !== 'string' || !str.includes('var(')) return str;

    const resolveOnce = (input) =>
      input.replace(/var\((--[^),\s]+)(?:,\s*([^)]+))?\)/g, (_, varName, fallback) => {
        let el = element;
        let resolved = '';
        while (el && !resolved) {
          resolved = getComputedStyle(el).getPropertyValue(varName).trim();
          el = el.parentElement;
        }
        if (!resolved) {
          resolved = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        }
        return resolved || fallback?.trim() || `var(${varName})`;
      });

    let previous = str;
    let current = resolveOnce(previous);

    while (current !== previous && current.includes('var(')) {
      previous = current;
      current = resolveOnce(current);
    }

    return current;
  }

  function extractNameStyles(nameElement) {
    if (!nameElement) return {};
    
    // Get computed styles first
    const computed = getComputedStyle(nameElement);
    const styleProps = [
        'background', 'background-image', 'color', 'text-shadow',
        '-webkit-text-fill-color', '-webkit-background-clip', 'background-clip',
        'position', 'width', 'height' // Added for pseudo-element positioning
    ];
    
    const styles = {};
    styleProps.forEach(prop => {
        const value = computed.getPropertyValue(prop);
        if (value && value !== 'none') styles[prop] = value;
    });
    
    // Check for pseudo-elements
    const pseudoStyles = {};
    ['::before', '::after'].forEach(pseudo => {
        try {
            const pseudoComputed = getComputedStyle(nameElement, pseudo);
            if (pseudoComputed.content && pseudoComputed.content !== 'none') {
                pseudoStyles[pseudo] = {
                    content: pseudoComputed.content,
                    background: pseudoComputed.background || pseudoComputed['background-image'],
                    position: pseudoComputed.position,
                    width: pseudoComputed.width,
                    height: pseudoComputed.height
                };
            }
        } catch (e) {
            // Some browsers may throw for invalid pseudo-elements
        }
    });
    
    // Resolve CSS variables
    const resolved = {};
    Object.entries(styles).forEach(([prop, value]) => {
        resolved[prop] = resolveCSSVarDeep(value, nameElement);
    });
    
    // Clean gradient background if present
    if (resolved.background?.includes('linear-gradient')) {
        resolved.background = resolved.background
            .replace(/^[^l]+/, '')
            .replace(/\s*repeat\s+scroll\s+\d+%\s+\d+%\s*\/\s*auto\s+padding-box\s+border-box/, '');
    }
    
    // Handle span inside name element
    const nameSpan = nameElement.querySelector('span');
    let spanStyles = {};
    if (nameSpan) {
        const spanComputed = getComputedStyle(nameSpan);
        const spanStyleProps = [
            'background', 'background-image', 'color', 'text-shadow',
            '-webkit-text-fill-color', '-webkit-background-clip', 'background-clip',
            'position', 'width', 'height'
        ];
        
        spanStyleProps.forEach(prop => {
            const value = spanComputed.getPropertyValue(prop);
            if (value && value !== 'none') spanStyles[prop] = resolveCSSVarDeep(value, nameSpan);
        });
    }
    
    return {
        inlineStyles: {
            background: resolved.background || resolved['background-image'],
            color: resolved.color,
            textShadow: resolved['text-shadow'],
            WebkitTextFillColor: resolved['-webkit-text-fill-color'],
            WebkitBackgroundClip: resolved['-webkit-background-clip'] || resolved['background-clip'],
            backgroundClip: resolved['background-clip'],
            position: resolved.position,
            width: resolved.width,
            height: resolved.height
        },
        spanStyles: Object.keys(spanStyles).length > 0 ? spanStyles : undefined,
        pseudoStyles: Object.keys(pseudoStyles).length > 0 ? pseudoStyles : undefined,
        className: nameElement.className,
        innerText: nameElement.textContent.trim()
    };
}

  function createStaleProfileButton() {
    // Create button element
    const button = document.createElement('button');
    button.textContent = '🔄 Update Profiles';
    button.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 2147483647;
      padding: 6px 12px;
      background-color: rgba(40, 40, 60, 0.9);
      color: #e0e0e0;
      border-left: 3px solid #4CAF50;
      border-radius: 0;
      font-size: 12px;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      border: none;
      outline: none;
    `;
  
    // Hover effects
    button.onmouseenter = () => {
      button.style.backgroundColor = 'rgba(50, 50, 80, 0.95)';
      button.style.borderLeftColor = '#6fcf97';
    };
    button.onmouseleave = () => {
      button.style.backgroundColor = 'rgba(40, 40, 60, 0.9)';
      button.style.borderLeftColor = '#4CAF50';
    };
  
    // Single, robust click handler
    let isProcessing = false;
    let currentRequest = null;

    button.onclick = async (e) => {
      e.preventDefault();
    
      if (isProcessing) return;
    
      isProcessing = true;
      button.style.opacity = '0.7';
      button.style.cursor = 'wait';
    
      try {
        const results = await Promise.allSettled([
          fetchStaleProfiles({ showPopup: true }),   // ← changed!
          fetchLeaderboardProfiles()
        ]);
    
        results.forEach((result, i) => {
          const name = i === 0 ? 'Stale Profiles' : 'Leaderboard';
          if (result.status === 'fulfilled') {
            log(`✅ ${name} success:`, result.value);
          } else {
            log(`❌ ${name} failed:`, result.reason);
          }
        });
      } catch (err) {
        log('Unexpected error:', err);
      } finally {
        isProcessing = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
      }
    };
    
    
  
    // Add to DOM
    document.body.appendChild(button);
    log('Profile update button initialized');
  
    // Self-healing in case button gets removed
    const checkButton = () => {
      if (!document.body.contains(button)) {
        log('Button was removed - recreating');
        document.body.appendChild(button);
      }
    };
    setInterval(checkButton, 5000);
  }


  function waitForModalAndScrapeCustomStyle(maxAttempts = 15, delay = 100, callback) {
    let attempts = 0;

    const interval = setInterval(() => {
      const modalRoot = document.querySelector('[class^="SharableProfile_modalContent"]');
      if (!modalRoot) {
        if (++attempts >= maxAttempts) {
          clearInterval(interval);
          log('❌ Gave up waiting for modal content.');
          callback({});
        }
        return;
      }

      clearInterval(interval);

      const nameElement = modalRoot.querySelector('[class*="CharacterName_name__"]');
      if (!nameElement) return callback({});

      const characterContainer = nameElement.closest('[class*="CharacterName_characterName__"]');

      
      const chatIconDiv = characterContainer?.querySelector('[class^="CharacterName_chatIcon__"]');
      const iconUse = chatIconDiv?.querySelector('use');
      const iconHref = iconUse?.getAttribute('href');

      const customStyle = extractNameStyles(nameElement);
      if (iconHref) {
        customStyle.icon = iconHref;
      }

      
      callback(customStyle);
    }, delay);
  }

  let lastProfileRequestName = null;
  let MWI_SOCKET = null
  function hookOutgoingWebSocket() {
    log('🧷 Installing WebSocket send hook...');
  
    const originalSend = WebSocket.prototype.send;
    
    WebSocket.prototype.send = function (data) {
      MWI_SOCKET = this;
      try {
        if (typeof data === 'string') {
          const parsed = JSON.parse(data);
  
          if (
            parsed?.type === 'view_profile' &&
            parsed?.viewProfileData?.characterName
          ) {
            const name = parsed.viewProfileData.characterName;
            lastProfileRequestName = name;
            log(`👀 Tracking profile lookup: ${name}`);
  
            // 🔥 Dynamically mark as tracked
            // first, clear it from “stale”
          if (staleProfileNames.has(name)) {
            staleProfileNames.delete(name);
          }
           // now mark and redraw all dots (chat + sys‑msg)
          if (!knownProfileNames.has(name)) {
            knownProfileNames.add(name);
          }
          markChatSender(name);
          refreshSystemDots();
          log(`🟢 Marked ${name} as tracked (from profile view)`);
          }
        }
      } catch (e) {
        log('❌ Failed to inspect outgoing WS message:', e);
      }
  
      return originalSend.call(this, data);
    };
  
    log('✅ WebSocket send hook installed!');
  }
  

  function hookWebSocketMessageData() {
    log('🧷 Installing WebSocket hook...');
  
    const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, 'data');
    const originalGetter = dataProperty.get;
  
    dataProperty.get = function hookedGet() {
      const socket = this.currentTarget;
      if (!(socket instanceof WebSocket)) return originalGetter.call(this);
      if (
        !socket.url.includes('api.milkywayidle.com/ws') &&
        !socket.url.includes('api-test.milkywayidle.com/ws')
      ) {
        return originalGetter.call(this);
      }
  
      const message = originalGetter.call(this);
  
      try {
        const parsed = JSON.parse(message);
  
        // ❌ PROFILE NOT FOUND → delete on server
        if (
          parsed?.type === 'error' &&
          parsed?.message === 'errorNotification.characterNameNotFound'
        ) {
          log(`❌ Profile not found: ${lastProfileRequestName}`);
          showToast(`❌ Profile "${lastProfileRequestName}" not found`, 'error');
  
          if (lastProfileRequestName) {
            sendRequest({
              method: 'POST',
              url: `${API_BASE}/delete_profile`,
              data: { name: lastProfileRequestName },
              headers: { 'X-Auth-Key': SECRET_KEY },
              onload: () => log(`🗑️ Profile "${lastProfileRequestName}" deleted from server.`),
              onerror: () => log(`⚠️ Failed to delete profile "${lastProfileRequestName}" from server.`),
            });
            lastProfileRequestName = null;
          }
        }
        // 📥 GOT PROFILE VIEW → scrape & send one combined payload
        else if (parsed?.type === 'profile_shared' && parsed?.profile) {
          const profile = parsed.profile;
          const name = profile.sharableCharacter?.name;
          log('📥 Intercepted profile_shared:', profile);
  
          if (name) {
            knownProfileNames.add(name);
            staleProfileNames.delete(name);
            markChatSender(name);
          }
  
          // 1) assemble gear + abilities (if allowed)
          let wearableItems = [];
          let equippedAbilities = [];

          wearableItems = Object.values(profile.wearableItemMap || {});
          equippedAbilities = profile.equippedAbilities || [];
  
          // 2) wait for modal to appear and scrape name styles
          waitForModalAndScrapeCustomStyle(15, 100, (customStyle) => {
            const styleLines = [];
  
            if (customStyle.inlineStyles) {
              styleLines.push(`.CharacterName_name {`);
              Object.entries(customStyle.inlineStyles).forEach(([prop, val]) => {
                if (val) {
                  styleLines.push(
                    `  ${prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${val};`
                  );
                }
              });
              styleLines.push(`}`);
            }
  
            if (customStyle.spanStyles) {
              styleLines.push(`.CharacterName_name span {`);
              Object.entries(customStyle.spanStyles).forEach(([prop, val]) => {
                if (val) {
                  styleLines.push(
                    `  ${prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${val};`
                  );
                }
              });
              styleLines.push(`}`);
            }
  
            if (customStyle.pseudoStyles) {
              Object.entries(customStyle.pseudoStyles).forEach(([pseudo, styles]) => {
                styleLines.push(`.CharacterName_name${pseudo} {`);
                Object.entries(styles).forEach(([prop, val]) => {
                  if (val && prop !== 'content') {
                    styleLines.push(
                      `  ${prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${val};`
                    );
                  }
                });
                styleLines.push(`}`);
              });
            }
  
            // 3) build a single combined payload
            const fullPayload = {
              ...profile,
              wearableItems,
              equippedAbilities,
              customStyle: {
                ...customStyle,
                cssRules: styleLines.join('\n')
              }
            };
  
            sendRequest({
              method: 'POST',
              url: global_url_config.magic_api.PROFILE_VIEW_UPLOAD,
              data: fullPayload,
              headers: { 'X-Auth-Key': SECRET_KEY },
              onload:  () => log('✅ Profile + gear + style data uploaded!'),
              onerror: () => log('❌ Failed to upload combined profile data.')
            });
          });
        }
      } catch (e) {
        log('❌ Failed to parse WebSocket message:', e);
      }
  
      Object.defineProperty(this, 'data', { value: message });
      return message;
    };
  
    Object.defineProperty(MessageEvent.prototype, 'data', dataProperty);
    log('✅ WebSocket message hook installed!');
  }
  
  

  let staleProfileNames = new Set();

  function fetchStaleProfiles({ showPopup = false } = {}) {
    return fetch(`${API_BASE}/stale_profiles?_=${Date.now()}`, {
      method: 'GET',
      headers: {
        'X-Auth-Key': SECRET_KEY,
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
  
        const allStale = Array.isArray(json.names) ? json.names : (json.names || '').trim().split('\n').filter(Boolean);
  
        staleProfileNames = new Set(allStale);
  
        const shuffled = [...allStale];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
  
        if (showPopup) {
          const top250 = shuffled.slice(0, 250);
          renderStalePopup(top250, json.staleCounts);
        }
  
        return allStale;
      })
      .catch((err) => {
        log('❌ Fetch stale profiles failed:', err);
        showToast('❌ Request failed', 'error');
        throw err;
      });
  }
  

  function pickDot(name) {
    return staleProfileNames.has(name)
      ? '🟡'
      : knownProfileNames.has(name)
        ? '🟢'
        : '🔴';
  }

  function refreshSystemDots() {
    document
      .querySelectorAll('button[data-mwi-sys-name]')
      .forEach(btn => {
        const name = btn.getAttribute('data-mwi-sys-name');
        btn.textContent = pickDot(name);
      });
  }
  
  // ─────────────────────────────────────────────────────────────────────────────
// 4️⃣ Hook in System‑Message tracking
// ─────────────────────────────────────────────────────────────────────────────
function observeSystemMessages() {
  // adjust selector to your chat list container
  const chatContainer = document.querySelector('div[class*="ChatHistory_chatHistory__"]') 
                      || document.body;
  const SYSTEM_CLS = 'ChatMessage_systemMessage__';

  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        // only system messages:
        if (!node.className.includes(SYSTEM_CLS)) continue;

        // find the text span (un‐styled span after timestamp)
        const textSpan = node.querySelector('span:not([class])');
        const txt = textSpan?.textContent?.trim();
        if (!txt) continue;

        // extract the username (before first space or " has ")
        const name = (txt.match(/^(\S+)(?=\s| has )/)||[])[1];
        if (!name) continue;

        // pick dot color
        const dot = staleProfileNames.has(name)
          ? '🟡'
          : knownProfileNames.has(name)
            ? '🟢'
            : '🔴';

        // build the button
        const btn = document.createElement('button');
        btn.setAttribute('data-mwi-sys-name', name);
        btn.textContent = dot;
        btn.title       = `View ${name}`;
        
        // give it the same inline‑block layout and sizing as a chat “mention”
        btn.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.2em;          /* reserve the same space every time */
        min-width: 1.2em;
        margin: 0 0.3ch;       /* small gap on either side */
        padding: 0;
        background: none;
        border: none;
        color: inherit;
        font-size: inherit;
        line-height: 1;
        vertical-align: middle;
        cursor: pointer;
      `;
        btn.onclick = () => {
          if (!MWI_SOCKET) return console.warn('No socket yet');
          MWI_SOCKET.send(JSON.stringify({
            type: 'view_profile',
            viewProfileData: { characterName: name }
          }));
        };

        // inject it just before the message text
        textSpan.parentElement.insertBefore(btn, textSpan);
      }
    }
  });

  mo.observe(chatContainer, {
    childList: true,
    subtree:   true
  });

  log('👁️ SystemMessage MutationObserver installed');
}
  
  
  
function renderStalePopup(staleNames, staleCounts = {}) {
  let container = document.getElementById('mwi-stale-popup');
  if (!container) {
    container = document.createElement('div');
    container.id = 'mwi-stale-popup';
    container.style.cssText = `
      position: fixed;
      top: 25%;
      left: 2%;
      z-index: 99999;
      background: #1e1e2f;
      border: 2px solid #444;
      border-radius: 8px;
      padding: 16px;
      max-width: 80vw;
      max-height: 80vh;
      overflow: auto;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      cursor: move;
      font-family: inherit;
    `;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    container.addEventListener('mousedown', (e) => {
      // 🛑 Don't drag if clicking inside non-draggable zones
      if (e.target.closest('.non-draggable')) return;

      isDragging = true;
      offsetX = e.clientX - container.offsetLeft;
      offsetY = e.clientY - container.offsetTop;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        container.style.left = `${e.clientX - offsetX}px`;
        container.style.top = `${e.clientY - offsetY}px`;
      }
    });

    document.addEventListener('mouseup', () => isDragging = false);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '× Close';
    closeBtn.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: transparent;
      border: none;
      color: #aaa;
      cursor: pointer;
      font-size: 18px;
    `;
    closeBtn.onclick = () => {
      container.style.display = 'none';
    };
    container.appendChild(closeBtn);

    document.body.appendChild(container);
  } else {
    container.style.display = '';
    [...container.children].forEach(child => {
      if (!child.matches('button') || child.textContent.trim() !== '× Close') {
        container.removeChild(child);
      }
    });
  }

  const title = document.createElement('h3');
  title.textContent = `${staleNames.length} Stale Profiles`;
  title.style.cssText = `margin: 0 0 12px 0; color: #fff;`;
  container.appendChild(title);

  if (staleCounts.over12h != null || staleCounts.over24h != null) {
    const stats = document.createElement('div');
    stats.style.cssText = `color: #aaa; margin-bottom: 10px; font-size: 14px;`;
    stats.innerHTML = `
      ⏱️ Over 12h: <b>${staleCounts.over12h || 0}</b><br>
      🕒 Over 24h: <b>${staleCounts.over24h || 0}</b>
    `;
    container.appendChild(stats);
  }

  const listContainer = document.createElement('div');
  listContainer.className = 'non-draggable';
  listContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 60vh;
    overflow: auto;
    background: #2d2d3a;
    border-radius: 4px;
    padding: 12px;
  `;

  staleNames.forEach(name => {
    const row = document.createElement('div');
    row.style.cssText = 'display: flex; align-items: center; gap: 8px; color: #eee;';

    const dotBtn = document.createElement('button');
    dotBtn.textContent = pickDot(name);
    dotBtn.title = `View ${name}`;
    dotBtn.style.cssText = `
      width: 1.5em;
      height: 1.5em;
      font-size: 1em;
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
    `;
    dotBtn.onclick = () => {
      if (!MWI_SOCKET) return console.warn('No socket yet');
      MWI_SOCKET.send(JSON.stringify({
        type: 'view_profile',
        viewProfileData: { characterName: name }
      }));
      staleProfileNames.delete(name);
      knownProfileNames.add(name);
      dotBtn.textContent = pickDot(name);
    };

    const nameSpan = document.createElement('span');
    nameSpan.textContent = name;
    nameSpan.style.flex = '1';

    row.appendChild(dotBtn);
    row.appendChild(nameSpan);
    listContainer.appendChild(row);
  });

  container.appendChild(listContainer);

  const copyBtn = document.createElement('button');
  copyBtn.textContent = '📋 Copy All';
  copyBtn.style.cssText = `
    display: block;
    margin: 12px 0 0 auto;
    padding: 6px 12px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(staleNames.join('\n'))
      .then(() => {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => copyBtn.textContent = '📋 Copy All', 2000);
      })
      .catch(err => {
        log('Clipboard write failed:', err);
        copyBtn.textContent = '❌ Failed';
      });
  };

  container.appendChild(copyBtn);
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


window.addEventListener('keydown', (e) => {
  if (e.key === 'F7') toggleStalePopupVisibility();
});

function toggleStalePopupVisibility() {
  const popup = document.getElementById('mwi-stale-popup');
  if (popup) {
    popup.style.display = (popup.style.display === 'none' || popup.style.display === '') ? 'block' : 'none';
  }
}



let knownProfileNames = new Set();

function fetchLeaderboardProfiles() {
  log('📡 Sending leaderboard request (paginated)...');

  const qs = new URLSearchParams({
    sortBy: 'total_xp',
    xpMode: 'raw',
    page: '1',
    limit: '100000' // Get the top 100000 profiles for stale tracking
  });

  return fetch(`${API_BASE}/leaderboard?${qs}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'omit'
  })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return res.json();
    })
    .then(data => {
      log('✅ Got leaderboard data');
      const profiles = data.items || [];
      knownProfileNames = new Set(profiles.map(p => p.characterName));
    })
    .catch(err => {
      log('❌ Fetch leaderboard failed:', err);
    });
}




function markChatSender(name) {
  document
    .querySelectorAll('div[class*="CharacterName_name__"]')
    .forEach(el => {
      if (el.dataset.name !== name) return;
      const container = el.closest('div[class*="CharacterName_characterName__"]');
      if (!container) return;

      // remove old dots/buttons
      container.querySelectorAll('.mwidot').forEach(node => node.remove());

      // build our button
      const btn = document.createElement('button');
      btn.className = 'mwidot';
      btn.setAttribute('data-mwi-chat-name', name);
      btn.style.cssText = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.2em;          /* reserve the same space every time */
      min-width: 1.2em;
      margin: 0 0.3ch;       /* small gap on either side */
      padding: 0;
      background: none;
      border: none;
      color: inherit;
      font-size: inherit;
      line-height: 1;
      vertical-align: middle;
      cursor: pointer;
    `;
      btn.textContent = pickDot(name);
      btn.title = `View ${name}`;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
        if (!MWI_SOCKET) return console.warn('No socket yet');
        MWI_SOCKET.send(JSON.stringify({
          type: 'view_profile',
          viewProfileData: { characterName: name }
        }));
      });

      // find the badge (<div class*=CharacterName_tag__>)
      const badge = container.querySelector('div[class*="CharacterName_tag__"]');
      if (badge && badge.parentNode) {
        // insert *before* the badge
        badge.parentNode.insertBefore(btn, badge);
      } else {
        // fallback: before the chat-icon
        const icon = container.querySelector('div[class*="CharacterName_chatIcon__"]');
        container.insertBefore(btn, icon || container.firstChild);
      }
    });
}





function hookChatTracking() {
  const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, 'data');
  const originalGetter = dataProperty.get;

  dataProperty.get = function hookedGet() {
    const socket = this.currentTarget;
    if (!(socket instanceof WebSocket)) return originalGetter.call(this);

    const raw = originalGetter.call(this);
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.type === 'chat_message_received' && parsed.message?.senderName) {
        const sender = parsed.message.senderName;
        // log(`[Chat] Message from ${sender}`);
        setTimeout(() => markChatSender(sender), 100); // Delay to ensure DOM insertion
      }
    } catch (e) {
      // silently ignore parse errors
    }

    Object.defineProperty(this, 'data', { value: raw });
    return raw;
  };

  Object.defineProperty(MessageEvent.prototype, 'data', dataProperty);
  log('✅ Chat hook installed!');
}

function observeChatNameMutations() {
  const chatContainer = document.body;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        // Re-mark any new or replaced names
        const nameEls = node.querySelectorAll?.('div[class*="CharacterName_name__"]') || [];
        nameEls.forEach(el => {
          const name = el.dataset.name;
          if (name) markChatSender(name);
        });
      }
    }
  });

  observer.observe(chatContainer, {
    childList: true,
    subtree: true,
  });

  log('👁️ Chat mutation observer initialized');
}


// Modify your init or button to also call these:
function init() {
  log('Script starting initialization…');
  setTimeout(() => {
    // 1) create the button UI
    createStaleProfileButton();
    // 2) preload both stale and leaderboard data
    Promise.all([
      fetchStaleProfiles({ showPopup: false }), // ← changed!
      fetchLeaderboardProfiles()
    ])    
      .then(([allStale]) => {
        // 3) now we have staleProfileNames & knownProfileNames populated
        refreshSystemDots();
        // 4) install all hooks & observers
        hookOutgoingWebSocket();
        hookWebSocketMessageData();
        hookChatTracking();
        observeChatNameMutations();
        observeSystemMessages();
        log('✅ Script initialized successfully');
      })
      .catch(err => {
        log('❌ Initialization failed:', err);
      });
  }, 3000);
}



if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 1000);
} else {
    document.addEventListener('DOMContentLoaded', init);
}
})();