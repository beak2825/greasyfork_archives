// ==UserScript==
// @name         blob.io freeze feed refresh Premium (Customer)
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Premium customer controls with optimized self-feed and auto-respawn
// @author       TopG/ x
// @match        custom.client.blobgame.io/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @connect      blobgame.io
// @downloadURL https://update.greasyfork.org/scripts/541999/blobio%20freeze%20feed%20refresh%20Premium%20%28Customer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541999/blobio%20freeze%20feed%20refresh%20Premium%20%28Customer%29.meta.js
// ==/UserScript==

(function(){
    let scriptEnabled = GM_getValue('scriptEnabled', false);
    let autoRefreshEnabled = GM_getValue('autoRefreshEnabled', false);
    let selfFeedEnabled = GM_getValue('selfFeedEnabled', false);
    let autoRespawnEnabled = GM_getValue('autoRespawnEnabled', false);
    let isPanelVisible = true;
    let refreshTimeout;
    let selfFeedInterval;
    let spacebarInterval;
    let lastRefreshTime = 0;

    const keyCodeMap = { 'F': 70, 'W': 87, ' ': 32 };
    const codeMap = { 'F': 'KeyF', 'W': 'KeyW', ' ': 'Space' };

    GM_addStyle(`
        #customer-panel { position: fixed; top: 10px; left: 10px; width: 200px; background: rgba(20, 20, 20, 0.9); padding: 15px; border-radius: 8px; color: white; z-index: 9999; font-family: Arial, sans-serif; box-shadow: 0 0 10px rgba(0,0,0,0.5); }
        .customer-btn { border: none; color: white; padding: 8px 6px; margin: 5px 0; border-radius: 4px; cursor: pointer; transition: all 0.3s ease; width: 100%; font-weight: bold; white-space: normal; word-wrap: break-word; min-height: 40px; display: flex; align-items: center; justify-content: center; text-align: center; line-height: 1.2; }
        .customer-btn:hover { opacity: 0.9; transform: scale(1.02); }
        .save-btn { background: #2196F3 !important; margin-top: 15px; }
        .control-section { background: rgba(255,255,255,0.05); padding: 10px; margin: 10px 0; border-radius: 4px; }
        .control-section h4 { margin: 0 0 8px 0; color: #2196F3; font-size: 14px; }
        #saveNotification { color: #4CAF50; font-size: 12px; text-align: center; margin-top: 5px; display: none; }
        .panel-hint { font-size: 11px; color: #888; text-align: center; margin-top: 10px; }
    `);

    const customerHTML = `
        <div id="customer-panel">
            <h3>Player Controls</h3>
            <div class="control-section">
                <h4>Feed Control</h4>
                <button id="toggleFeedBtn" class="customer-btn" style="background-color: ${scriptEnabled ? '#4CAF50' : '#ff4444'}">
                    ${scriptEnabled ? '⏸️ Stop Feed' : '▶️ Start Feed'}
                </button>
            </div>
            <div class="control-section">
                <h4>Auto-Refresh</h4>
                <button id="toggleRefreshBtn" class="customer-btn" style="background-color: ${autoRefreshEnabled ? '#4CAF50' : '#ff4444'}">
                    ${autoRefreshEnabled ? '🔄 Stop Auto-Refresh' : '▶️ Start Auto-Refresh'}
                </button>
            </div>
            <div class="control-section">
                <h4>Self Feed</h4>
                <button id="toggleSelfFeedBtn" class="customer-btn" style="background-color: ${selfFeedEnabled ? '#4CAF50' : '#ff4444'}">
                    ${selfFeedEnabled ? '⏸️ Stop Self Feed' : '▶️ Start Self Feed'}
                </button>
            </div>
            <div class="control-section">
                <h4>Auto Respawn</h4>
                <button id="toggleAutoRespawnBtn" class="customer-btn" style="background-color: ${autoRespawnEnabled ? '#4CAF50' : '#ff4444'}">
                    ${autoRespawnEnabled ? '🔄 Stop Auto Respawn' : '▶️ Start Auto Respawn'}
                </button>
            </div>
            <button id="saveSettingsBtn" class="customer-btn save-btn">💾 Save Settings</button>
            <div id="saveNotification">Settings saved! ✅</div>
            <div class="panel-hint">Press 'Tab' to toggle panel visibility</div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', customerHTML);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            const panel = document.getElementById('customer-panel');
            isPanelVisible = !isPanelVisible;
            panel.style.display = isPanelVisible ? 'block' : 'none';
        }
    });

    function holdKey(key) {
        const keyDownEvent = new KeyboardEvent('keydown', {
            key: key,
            keyCode: keyCodeMap[key],
            code: codeMap[key],
            which: keyCodeMap[key],
            bubbles: true,
        });
        document.dispatchEvent(keyDownEvent);
    }

    function releaseKey(key) {
        const keyUpEvent = new KeyboardEvent('keyup', {
            key: key,
            keyCode: keyCodeMap[key],
            code: codeMap[key],
            which: keyCodeMap[key],
            bubbles: true,
        });
        document.dispatchEvent(keyUpEvent);
    }

    function checkText() {
        if (!autoRespawnEnabled) return;
        const currentTime = Date.now();
        const timeSinceLastRefresh = currentTime - lastRefreshTime;
        if (document.body.innerText.includes("Can't find a place to spawn") || document.body.innerText.includes("You scored")) {
            if (timeSinceLastRefresh >= 1850) {
                lastRefreshTime = currentTime;
                setTimeout(() => location.reload(), 10);
            } else {
                setTimeout(() => {
                    lastRefreshTime = Date.now();
                    location.reload();
                }, 1850 - timeSinceLastRefresh);
            }
        }
    }

    function saveCustomerSettings() {
        GM_setValue('scriptEnabled', scriptEnabled);
        GM_setValue('autoRefreshEnabled', autoRefreshEnabled);
        GM_setValue('selfFeedEnabled', selfFeedEnabled);
        GM_setValue('autoRespawnEnabled', autoRespawnEnabled);
        const notification = document.getElementById('saveNotification');
        notification.style.display = 'block';
        setTimeout(() => notification.style.display = 'none', 2000);
    }

    function toggleFeed() {
        scriptEnabled = !scriptEnabled;
        const btn = document.getElementById('toggleFeedBtn');
        btn.style.backgroundColor = scriptEnabled ? '#4CAF50' : '#ff4444';
        btn.textContent = scriptEnabled ? '⏸️ Stop Feed' : '▶️ Start Feed';
        if (!scriptEnabled) {
            releaseKey('F');
            releaseKey('W');
        }
        saveCustomerSettings();
    }

    function toggleRefresh() {
        autoRefreshEnabled = !autoRefreshEnabled;
        const btn = document.getElementById('toggleRefreshBtn');
        btn.style.backgroundColor = autoRefreshEnabled ? '#4CAF50' : '#ff4444';
        btn.textContent = autoRefreshEnabled ? '🔄 Stop Auto-Refresh' : '▶️ Start Auto-Refresh';

        if (window.refreshTimeout) clearTimeout(window.refreshTimeout);
        if (autoRefreshEnabled) {
            window.refreshTimeout = setTimeout(() => location.reload(), 6000);
        }
        saveCustomerSettings();
    }

    function toggleSelfFeed() {
        selfFeedEnabled = !selfFeedEnabled;
        const btn = document.getElementById('toggleSelfFeedBtn');
        btn.style.backgroundColor = selfFeedEnabled ? '#4CAF50' : '#ff4444';
        btn.textContent = selfFeedEnabled ? '⏸️ Stop Self Feed' : '▶️ Start Self Feed';

        if (selfFeedEnabled) {
            selfFeedInterval = setInterval(() => {
                holdKey('F');
                holdKey('W');
            }, 50);

            setTimeout(() => {
                spacebarInterval = setInterval(() => {
                    setTimeout(() => {
                        holdKey(' ');
                        setTimeout(() => releaseKey(' '), 100);
                    }, 50);
                }, 50);
            }, 450);

            let lastCheck = performance.now();
            const checkTimer = () => {
                const now = performance.now();
                if (now - lastCheck >= 16) {
                    if ((document.body.textContent || '').includes('left: 1s')) {
                        location.reload();
                    }
                    lastCheck = now;
                }
                if (selfFeedEnabled) requestAnimationFrame(checkTimer);
            };
            requestAnimationFrame(checkTimer);

            setInterval(() => {
                const now = new Date();
                if (now.getSeconds() === 0 && now.getMinutes() === 0) {
                    setTimeout(() => location.reload(), 1000);
                }
            }, 1000);
        } else {
            clearInterval(selfFeedInterval);
            clearInterval(spacebarInterval);
            releaseKey('F');
            releaseKey('W');
            releaseKey(' ');
        }
        saveCustomerSettings();
    }

    function toggleAutoRespawn() {
        autoRespawnEnabled = !autoRespawnEnabled;
        const btn = document.getElementById('toggleAutoRespawnBtn');
        btn.style.backgroundColor = autoRespawnEnabled ? '#4CAF50' : '#ff4444';
        btn.textContent = autoRespawnEnabled ? '🔄 Stop Auto Respawn' : '▶️ Start Auto Respawn';
        saveCustomerSettings();
    }

    function startScript() {
        if (selfFeedEnabled) toggleSelfFeed();
        if (autoRefreshEnabled) window.refreshTimeout = setTimeout(() => location.reload(), 6000);

        setInterval(() => {
            if (scriptEnabled) {
                holdKey('F');
                holdKey('W');
            }
            if (autoRespawnEnabled) {
                holdKey('F');
                checkText();
            }
        }, 100);
    }

    // Hook up buttons after DOM is added
    document.getElementById('toggleFeedBtn').addEventListener('click', toggleFeed);
    document.getElementById('toggleRefreshBtn').addEventListener('click', toggleRefresh);
    document.getElementById('toggleSelfFeedBtn').addEventListener('click', toggleSelfFeed);
    document.getElementById('toggleAutoRespawnBtn').addEventListener('click', toggleAutoRespawn);
    document.getElementById('saveSettingsBtn').addEventListener('click', saveCustomerSettings);

    // Expose to unsafeWindow just in case other scripts call them
    unsafeWindow.toggleFeed = toggleFeed;
    unsafeWindow.toggleRefresh = toggleRefresh;
    unsafeWindow.toggleSelfFeed = toggleSelfFeed;
    unsafeWindow.toggleAutoRespawn = toggleAutoRespawn;
    unsafeWindow.saveSettings = saveCustomerSettings;

    startScript();
})();
