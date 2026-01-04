// ==UserScript==
// @name         Torn Enhanced Stats Loader
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Loads the Enhanced Stats script for authorized faction members
// @author       ThatJimmyGuy [2924303] & vavi [2224491]
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/joblist.php*
// @match        https://www.torn.com/profiles.php?XID=*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addElement
// @grant        unsafeWindow
// @license      ISC

// @downloadURL https://update.greasyfork.org/scripts/535879/Torn%20Enhanced%20Stats%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/535879/Torn%20Enhanced%20Stats%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration - CHANGE THESE VALUES
    let API_SERVER;
    const isPda = window.GM_info?.scriptHandler?.toLowerCase().includes('tornpda');
    const targetWindow = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;

    function getLocalStorage(key) {
          const value = window.localStorage.getItem(key);
        try {
            return JSON.parse(value) ?? undefined;
        } catch (err) {
            return undefined;
        }
    }

    function setLocalStorage(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    const [GM_getValue, GM_setValue] =
          isPda || typeof window.GM_getValue !== 'function' || typeof window.GM_setValue !== 'function'
    ? [getLocalStorage, setLocalStorage]
    : [window.GM_getValue, window.GM_setValue];

    // Store API key
    async function getApiKey() {
        let key = GM_getValue('tornApiKey');
        if (!key) {
            // If no key is stored, prompt the user
            key = await prompt('Please enter your Torn API key to use Enhanced Stats:\n(This will only be shown once and stored locally)');

            if (key) {
                GM_setValue('tornApiKey', key);
            } else {
                alert('No API key provided. The Enhanced Stats script will not work.');
                return null;
            }
        }

        return key;
    }

    async function getServerAddress() {
        let add = GM_getValue('wseServerAddress');
        if (!add) {
            add = await prompt('Please enter the Workstat Estimator server address:\n(This will only be shown once and stored locally)');
            if (add) {
                GM_setValue('wseServerAddress', add)
            }
            else {
                alert('No server address provided. The Enhanced Stats script will not work.');
                return null
            }
        }

        return add;
    }


    // Verify user with the server
    function verifyUser(apiKey) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${API_SERVER}/api/verify`,
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                },
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (response.status === 200 && data.success) {
                            resolve(data.user);
                        } else {
                            console.error('Verification failed:', data.error);
                            reject(new Error(data.error || 'Verification failed'));
                        }
                    } catch (error) {
                        console.error('Error parsing verification response:', error);
                        reject(error);
                    }
                },
                onerror: function(error) {
                    console.error('Error verifying user:', error);
                    reject(error);
                }
            });
        });
    }

    // Fetch and inject the main script
    function fetchAndInjectScript(apiKey) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${API_SERVER}/api/script`,
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            onload: function(response) {
                if (response.status === 200) {

                    // Create a variable in the global scope to pass the API key to the injected script
                    targetWindow.__TORN_STATS_CONFIG = {
                        apiKey: apiKey,
                        apiServer: API_SERVER
                    };
                    if (isPda) {
                        let metaEl = document.createElement('meta');
                        let scriptEl = document.createElement('script')

                        metaEl.setAttribute("http-equiv", "Content-Security-Policy")
                        metaEl.setAttribute("content", "upgrade-insecure-requests")
                        scriptEl.textContent = response.responseText;

                        document.head.appendChild(metaEl);
                        PDA_evaluateJavascript(response.responseText);
                        return
                    }
                    GM_addElement('meta', {
                        "http-equiv": "Content-Security-Policy",
                        "content": "upgrade-insecure-requests"
                    });
                    // Create a script element and inject the code
                    GM_addElement('script', {
                        textContent: response.responseText
                    });
                    console.log('Enhanced Stats script injected successfully');
                } else {
                    try {
                        const error = JSON.parse(response.responseText);
                        console.error('Failed to load script:', error.error);

                        // If unauthorized, clear stored API key to prompt again next time
                        if (response.status === 401 || response.status === 403) {
                            GM_setValue('tornApiKey', '');
                            alert(`Failed to load Enhanced Stats: ${error.error}\nPlease try again with a different API key.`);
                        }
                    } catch (e) {
                        console.error('Error parsing error response:', e);
                        alert('Failed to load Enhanced Stats script. Please check console for details.');
                    }
                }
            },
            onerror: function(error) {
                console.error('Error fetching script:', error);
                alert('Failed to load Enhanced Stats script. Please check console for details.');
            }
        });
    }

    // Main initialization function
    async function initialize() {
        try {
            const apiKey = await getApiKey();
            if (!apiKey) return;
            API_SERVER = await getServerAddress();
            if (!API_SERVER) return;
            console.log(apiKey);
            // Verify user is allowed to use the script
            await verifyUser(apiKey);
            console.log("Done1")
            // If verification successful, fetch and inject the main script
            fetchAndInjectScript(apiKey);
            console.log("Done2")
        } catch (error) {
            console.error('Initialization error:', error);

            // Show an appropriate error message to the user
            if (error.message.includes('faction is not authorized')) {
                alert('Your faction is not authorized to use Enhanced Stats. Contact the script author for access.');
            } else if (error.message.includes('API key')) {
                GM_setValue('tornApiKey', ''); // Clear invalid API key
                alert('Invalid API key. Please refresh the page and enter a valid key.');
            } else {
                alert('Error initializing Enhanced Stats. Please try again later.');
            }
        }
    }

    // Start the initialization process
    initialize();
    console.log("STARTING");
})();