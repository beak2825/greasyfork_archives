// ==UserScript==
// @name         Input Guardian
// @namespace    https://spin.rip/
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @version      2.0
// @author       Spinfal
// @description  Enhanced input preservation with security checks, performance optimizations, and user controls.
// @license      AGPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/530764/Input%20Guardian.user.js
// @updateURL https://update.greasyfork.org/scripts/530764/Input%20Guardian.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const dbName = "InputGuardianDB";
    const storeName = "inputs";
    const dbVersion = 2;
    const DEBOUNCE_TIME = 500; // ms
    const CLEANUP_DAYS = 30;
    const SENSITIVE_NAMES = /(ccnum|creditcard|cvv|ssn|sin|securitycode)/i;

    const cache = new Map();

    const isSensitiveField = (input) => {
        return SENSITIVE_NAMES.test(input.id) ||
               SENSITIVE_NAMES.test(input.name) ||
               input.closest('[data-sensitive="true"]');
    };

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    const openDatabase = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                let store;
                if (!db.objectStoreNames.contains(storeName)) {
                    store = db.createObjectStore(storeName, { keyPath: "id" });
                } else {
                    store = request.transaction.objectStore(storeName);
                }
                if (!store.indexNames.contains("timestamp")) {
                    store.createIndex("timestamp", "timestamp", { unique: false });
                }
            };

            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.error);
        });
    };

    const cleanupOldEntries = async () => {
        try {
            const db = await openDatabase();
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const index = store.index("timestamp");
            const threshold = Date.now() - (CLEANUP_DAYS * 86400000);

            return new Promise((resolve, reject) => {
                const request = index.openCursor(IDBKeyRange.upperBound(threshold));
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        cursor.delete();
                        cursor.continue();
                    } else {
                        resolve();
                    }
                };
                request.onerror = reject;
            });
        } catch (error) {
            console.error("Cleanup failed:", error);
        }
    };

    const saveInput = debounce(async (id, value) => {
        cache.set(id, value);
        try {
            const db = await openDatabase();
            const transaction = db.transaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            store.put({
                id,
                value,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error("Error saving input:", error);
        }
    }, DEBOUNCE_TIME);

    const handleRichText = (element) => {
        const id = element.id || element.dataset.guardianId ||
                 Math.random().toString(36).substr(2, 9);
        element.dataset.guardianId = id;
        return id;
    };

    const addControls = () => {
        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand("Clear Saved Inputs", async () => {
                try {
                    const db = await openDatabase();
                    const transaction = db.transaction(storeName, "readwrite");
                    const store = transaction.objectStore(storeName);
                    await store.clear();
                    cache.clear();
                    showFeedback('Cleared all saved inputs!');
                } catch (error) {
                    console.error("Clear failed:", error);
                    showFeedback('Failed to clear inputs');
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
                indexedDB.deleteDatabase(dbName);
                cache.clear();
                showFeedback('Database reset! Please reload the page.');
            }
        });
    };

    const showFeedback = (message) => {
        const existing = document.getElementById('guardian-feedback');
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.id = 'guardian-feedback';
        div.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border-radius: 5px;
            z-index: 9999;
            opacity: 1;
            transition: opacity 0.5s ease-in-out;
        `;
        div.textContent = message;
        document.body.appendChild(div);

        setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 500);
        }, 2000);
    };

    const isValidInput = (input) => {
        const isHidden = input.offsetParent === null ||
                       window.getComputedStyle(input).visibility === 'hidden';

        return !isHidden &&
               input.type !== 'password' &&
               input.autocomplete !== 'off' &&
               !isSensitiveField(input);
    };

    document.addEventListener('input', (event) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) || event.target.isContentEditable) {
            const target = event.target;
            let id, value;

            if (target.isContentEditable) {
                id = handleRichText(target);
                value = target.innerHTML;
            } else {
                id = target.id || target.name;
                value = target.value;
            }

            if (id && isValidInput(target)) {
                saveInput(id, value);
            }
        }
    });

    window.addEventListener('load', () => {
        restoreInputs();
        addControls();
        setTimeout(cleanupOldEntries, 5000); // Defer cleanup
    });

    const restoreInputs = async () => {
        try {
            const inputs = document.querySelectorAll('input, textarea, select, [contenteditable]');
            const inputMap = new Map(Array.from(inputs).map(input => [input.id || input.name, input]));

            // First restore from cache
            for (const [id, value] of cache.entries()) {
                const input = inputMap.get(id);
                if (input && isValidInput(input)) {
                    if (input.isContentEditable) {
                        input.innerHTML = value;
                    } else {
                        input.value = value;
                    }
                }
            }

            // Then restore from IndexedDB
            const db = await openDatabase();
            const transaction = db.transaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                let restoredCount = 0;
                request.result.forEach(({ id, value }) => {
                    if (!cache.has(id)) {
                        const input = inputMap.get(id);
                        if (input && isValidInput(input)) {
                            if (input.isContentEditable) {
                                input.innerHTML = value;
                            } else {
                                input.value = value;
                            }
                            cache.set(id, value);
                            restoredCount++;
                        }
                    }
                });
                if (restoredCount > 0) {
                    showFeedback(`Restored ${restoredCount} input${restoredCount !== 1 ? 's' : ''}!`);
                }
            };
        } catch (error) {
            console.error("Restore failed:", error);
        }
    };

})();