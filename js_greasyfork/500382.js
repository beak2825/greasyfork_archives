// ==UserScript==
// @name         torn-cracking
// @namespace    torn-cracking
// @version      0.9
// @description  Cracking helper with CORS bypass and pattern identification
// @author       swrv [3069664]
// @match        *://www.torn.com/loader.php?sid=crimes*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      mit
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @iconURL data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMTIwIDEyMCA5NjAgOTYwIj4KIDxwYXRoIGZpbGw9IiMzNTg0ZTQiIGQ9Im0xMjAgMzYwaDM2MHY3MjBoMjQwdi03MjBoMzYwdi0yNDBoLTk2MHoiLz4KPC9zdmc+Cg==
// @downloadURL https://update.greasyfork.org/scripts/500382/torn-cracking.user.js
// @updateURL https://update.greasyfork.org/scripts/500382/torn-cracking.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let dbName = 'crackingDatabase';
  let storeName = 'wordsStores';
  let metadataStoreName = 'metadataStore';
  let wordsUrls = [
    'https://github.com/danielmiessler/SecLists/raw/master/Passwords/Common-Credentials/10-million-password-list-top-100000.txt',
    'https://github.com/danielmiessler/SecLists/raw/master/Passwords/Leaked-Databases/rockyou-75.txt',
    'https://github.com/danielmiessler/SecLists/raw/master/Miscellaneous/lang-english.txt',
  ];
  let workerScript = `
    self.onmessage = function(event) {
      let { pattern, words } = event.data;
      let regex = new RegExp('^' + pattern.replace(/\\*/g, '.').toLowerCase() + '$');
      let results = words.filter(word => regex.test(word.toLowerCase()));
      results = Array.from(new Set(results)); // Ensure unique results
      self.postMessage(results);
    };
  `;

  let processedPatterns = {};
  let isProcessing = false;

  function openDatabase() {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = function(event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          let wordStore = db.createObjectStore(storeName, { keyPath: 'length' });
          wordStore.createIndex('words', 'words', { multiEntry: true });
        }
        if (!db.objectStoreNames.contains(metadataStoreName)) {
          db.createObjectStore(metadataStoreName, { keyPath: 'url' });
        }
      };

      request.onsuccess = function(event) {
        resolve(event.target.result);
      };

      request.onerror = function(event) {
        reject(event.target.errorCode);
      };
    });
  }

  function fetchWords() {
    return new Promise((resolve, reject) => {
      openDatabase().then(db => {
        let transaction = db.transaction(metadataStoreName, 'readonly');
        let store = transaction.objectStore(metadataStoreName);
        let metadataRequest = store.getAll();

        metadataRequest.onsuccess = function() {
          let metadata = metadataRequest.result;
          let urlsToFetch = wordsUrls.filter(url => !metadata.some(meta => meta.url === url));

          if (urlsToFetch.length === 0) {
            console.log('Words already cached. No need to fetch.');
            resolve();
            return;
          }

          let wordsByLength = {};
          let completedRequests = 0;

          urlsToFetch.forEach((url, index) => {
            console.log(`Fetching words from URL ${index + 1} of ${urlsToFetch.length}...`);
            GM_xmlhttpRequest({
              method: 'GET',
              url: url,
              onload: function(response) {
                let data = response.responseText;
                let newWords = data.split('\n').map(word => word.trim());
                newWords.forEach(word => {
                  let len = word.length;
                  if (!wordsByLength[len]) {
                    wordsByLength[len] = [];
                  }
                  wordsByLength[len].push(word);
                });
                console.log(`Completed fetching from URL ${index + 1}.`);

                completedRequests++;
                if (completedRequests === urlsToFetch.length) {
                  console.log('All URLs fetched. Storing words in IndexedDB...');
                  storeWords(db, wordsByLength, urlsToFetch).then(resolve).catch(reject);
                }
              },
              onerror: function(error) {
                console.error(`Error fetching URL ${index + 1}: `, error);
                reject(error);
              }
            });
          });
        };

        metadataRequest.onerror = function(event) {
          console.error('Error fetching metadata: ', event.target.errorCode);
          reject(event.target.errorCode);
        };
      }).catch(reject);
    });
  }

  function storeWords(db, wordsByLength, urls) {
    return new Promise((resolve, reject) => {
      let transaction = db.transaction([storeName, metadataStoreName], 'readwrite');
      let wordStore = transaction.objectStore(storeName);
      let metadataStore = transaction.objectStore(metadataStoreName);

      for (let length in wordsByLength) {
        wordStore.put({ length: parseInt(length), words: wordsByLength[length] });
      }
      urls.forEach(url => metadataStore.add({ url }));

      transaction.oncomplete = function() {
        console.log('Words stored in IndexedDB.');
        resolve();
      };

      transaction.onerror = function(event) {
        console.error('Error storing words: ', event.target.errorCode);
        reject(event.target.errorCode);
      };
    });
  }

  function findMatches(pattern, exactLength) {
    return new Promise((resolve, reject) => {
      openDatabase().then(db => {
        let transaction = db.transaction(storeName, 'readonly');
        let store = transaction.objectStore(storeName);
        let index = store.index('words');
        let request = store.get(exactLength);

        request.onsuccess = function(event) {
          let result = event.target.result;
          if (result) {
            let words = result.words;
            let workerBlob = new Blob([workerScript], { type: 'application/javascript' });
            let worker = new Worker(URL.createObjectURL(workerBlob));
            worker.onmessage = function(event) {
              resolve(event.data);
            };
            worker.postMessage({ pattern, words });
          } else {
            resolve([]);
          }
        };

        request.onerror = function(event) {
          reject(event.target.errorCode);
        };
      });
    });
  }

  function displayResults(results, element) {
    let resultsElement = $(element).find('.__results');
    if (resultsElement.length === 0) {
      resultsElement = $('<div class="__results" style="font-family:monospace;font-size:11px;padding:2px;background:black;color:white;text-align:center;position:absolute;z-index:999"></div>');
      $(element).prepend(resultsElement);
    }
    if (!results.length) {
      resultsElement.hide();
    } else {
      resultsElement.show();
      resultsElement.text(`${results.slice(0, 5).join(' ')}`);
    }
  }

  function identifyPatterns() {
    let patterns = [];
    $('.virtualItem___BLyAl').each(function(index) {
      let pattern = '';
      $(this).find('.charSlot___b_S9h').each(function() {
        let char = $(this).find('span').text().trim();
        if (char) {
          pattern += char.toLowerCase();
        } else {
          pattern += '*';
        }
      });
      if (pattern.includes('*') && !processedPatterns[`${pattern}-${index}`]) {
        patterns.push({ pattern, element: this, index });
        processedPatterns[`${pattern}-${index}`] = true;
      }
    });
    return patterns;
  }

  function processPatterns() {
    if (isProcessing) return;

    isProcessing = true;
    let patterns = identifyPatterns();

    (async function() {
      await Promise.all(patterns.map(async ({ pattern, element }) => {
        let results = await findMatches(pattern, pattern.length);
        displayResults(results, element);
      }));
      isProcessing = false;
    })();
  }

  // Initial execution
  (async function() {
    await fetchWords();
    setInterval(processPatterns, 1000);
  })();
})();
