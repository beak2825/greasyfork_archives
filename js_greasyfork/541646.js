// ==UserScript==
// @name         Torn War Timer
// @namespace    https://www.torn.com/
// @version      1.2
// @description  Display live ranked war timer in the sidebar using Torn API v2, with smart polling
// @author       Cypher-[2641265]
// @license      MIT
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/541646/Torn%20War%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/541646/Torn%20War%20Timer.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    function getApiKey() {
        return localStorage.getItem('rw_api_key') || '';
    }

    const timerContainerID = 'warTimerSidebar';
    const LS_KEY = 'rw_last_war_info'; // localStorage key

    function getStoredWarInfo() {
        try {
            return JSON.parse(localStorage.getItem(LS_KEY)) || {};
        } catch {
            return {};
        }
    }

    function setStoredWarInfo(obj) {
        localStorage.setItem(LS_KEY, JSON.stringify(obj));
    }

    function fetchRankedWars() {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/v2/faction/rankedwars?sort=DESC&key=${getApiKey()}`,
            onload: function (response) {
                let data;
                try {
                    data = JSON.parse(response.responseText);
                } catch (e) {
                    return;
                }
                if (!data?.rankedwars || !Array.isArray(data.rankedwars)) return;

                const now = Math.floor(Date.now() / 1000);

                // Find the first war with "end": 0 and "start" in the future (pending war)
                const pendingWar = data.rankedwars.find(war => war.end === 0 && war.start > now);
                if (pendingWar) {
                    setStoredWarInfo({
                        warId: pendingWar.id,
                        start: pendingWar.start,
                        nextCheck: pendingWar.start + 5 // check again 5s after start
                    });
                    const left = Math.max(0, pendingWar.start - now);
                    updateSidebar(formatTimer(left));
                    scheduleNextCheck(pendingWar.start - now + 5); // run again just after war starts
                    return;
                }

                // If no pending war, show active war timer as zeros and wait 48 hours
                const activeWar = data.rankedwars.find(war => war.end === 0 && war.start <= now);
                if (activeWar) {
                    setStoredWarInfo({
                        warId: activeWar.id,
                        start: activeWar.start,
                        nextCheck: now + 48 * 3600 // check again in 48 hours
                    });
                    updateSidebar("0d 0h 0m");
                    scheduleNextCheck(48 * 3600);
                    return;
                }

                // If no war, set next check for 6 hours later
                setStoredWarInfo({
                    warId: null,
                    start: null,
                    nextCheck: now + 6 * 3600
                });
                updateSidebar("0d 0h 0m");
                scheduleNextCheck(6 * 3600); // 6 hours
            }
        });
    }

    function formatTimer(secs, showSeconds = false) {
        if (typeof secs !== "number" || isNaN(secs) || secs < 0) return "0d 0h 0m";
        if (showSeconds) {
            const m = Math.floor(secs / 60);
            const s = secs % 60;
            return `${m}:${s.toString().padStart(2, '0')}`;
        }
        const d = Math.floor(secs / 86400);
        const h = Math.floor((secs % 86400) / 3600);
        const m = Math.floor((secs % 3600) / 60);
        let out = "";
        if (d > 0) out += `${d}d `;
        if (h > 0 || d > 0) out += `${h}h `;
        out += `${m}m`;
        return out.trim();
    }

    function showApiKeyPopup(callback) {
        if (document.getElementById('rw_api_input')) return; // Prevent multiple popups
        let popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = '#222';
        popup.style.color = '#fff';
        popup.style.padding = '20px';
        popup.style.border = '2px solid #888';
        popup.style.zIndex = 9999;
        popup.style.borderRadius = '8px';
        popup.innerHTML = `
            <div style="margin-bottom:10px;">Enter your Torn public API key:</div>
            <input type="text" id="rw_api_input" style="width:300px;" maxlength="16" value="${getApiKey() || ''}">
            <div style="margin-top:10px;">
                <button id="rw_api_save" style="background:#444;color:#fff;border:1px solid #aaa;padding:6px 18px;margin-right:10px;border-radius:4px;cursor:pointer;">Save</button>
                <button id="rw_api_cancel" style="background:#444;color:#fff;border:1px solid #aaa;padding:6px 18px;border-radius:4px;cursor:pointer;">Cancel</button>
            </div>
        `;
        document.body.appendChild(popup);
        document.getElementById('rw_api_input').focus();

        document.getElementById('rw_api_save').onclick = function() {
            let key = document.getElementById('rw_api_input').value.trim();
            if (key.length === 16) {
                localStorage.setItem('rw_api_key', key);
                document.body.removeChild(popup);
                if (callback) callback(key);
            } else {
                alert('Please enter a valid 16-character Torn public API key.');
            }
        };
        document.getElementById('rw_api_cancel').onclick = function() {
            document.body.removeChild(popup);
        };
    }

    function findSidebar() {
        // Only look for Torn Tools sidebar
        const element = document.querySelector('.tt-sidebar-information');
        if (element) {
            return element;
        }
        return null;
    }

    function waitForSidebar(callback, maxAttempts = 20, attempt = 1) {
        const sidebar = findSidebar();
        if (sidebar) {
            callback();
            return;
        }
        
        if (attempt >= maxAttempts) {
            return;
        }
        
        // Exponential backoff: 100ms, 200ms, 400ms, 800ms, etc.
        const delay = Math.min(100 * Math.pow(2, attempt - 1), 5000);
        setTimeout(() => waitForSidebar(callback, maxAttempts, attempt + 1), delay);
    }

    function updateSidebar(timerText) {
        // Only use Torn Tools sidebar
        let sidebar = findSidebar();
        if (!sidebar) {
            return;
        }

        let section = document.getElementById(timerContainerID);
        if (!section) {
            section = document.createElement('section');
            section.id = timerContainerID;
            section.style.order = 2;
            // Add a wrapper span for hover effect
            section.innerHTML = `
                <style>
                    #${timerContainerID}:hover #rw-reset-link { opacity: 1; pointer-events: auto; }
                    #rw-reset-link { opacity: 0; transition: opacity 0.2s; pointer-events: none; }
                </style>
                <a class="title" href="https://www.torn.com/factions.php?step=your&type=1#/war/rank" target="_blank">RW:</a>
                <span id="war-timer-value" class="countdown"></span>
                <a id="rw-reset-link" title="Reset War Timer Settings" style="margin-left:8px;cursor:pointer;color:#b48aff;text-decoration:none;font-size:16px;">⟲</a>
            `;
            
            // Only append to Torn Tools sidebar
            sidebar.appendChild(section);
        }
        const timerSpan = section.querySelector('#war-timer-value');
        const resetLink = section.querySelector('#rw-reset-link');
        if (resetLink) {
            resetLink.onclick = function(e) {
                e.preventDefault();
                if (confirm("Reset War Timer settings? This will reset your timer data.")) {
                    localStorage.removeItem('rw_last_war_info');
                    location.reload();
                }
            };
        }
        if (timerSpan) {
            if (!getApiKey()) {
                timerSpan.textContent = "Enter public key";
                timerSpan.style.cursor = "pointer";
                timerSpan.onclick = function(e) {
                    showApiKeyPopup(() => {
                        timerSpan.onclick = null;
                        runCheck();
                    });
                };
            } else {
                timerSpan.textContent = timerText;
                timerSpan.style.cursor = "";
                timerSpan.onclick = null;
            }
        }
    }

    let nextTimeout = null;
    function scheduleNextCheck(seconds) {
        if (nextTimeout) clearTimeout(nextTimeout);
        nextTimeout = setTimeout(runCheck, Math.max(1000, seconds * 1000));
    }

    function runCheck() {
        if (!getApiKey()) {
            updateSidebar("Enter public key");
            return;
        }
        const now = Math.floor(Date.now() / 1000);
        const info = getStoredWarInfo();
        if (info.nextCheck && now < info.nextCheck) {
            scheduleNextCheck(info.nextCheck - now);
            return;
        }
        fetchRankedWars();
    }

    let liveCountdownInterval = null;

    function startLiveCountdown(secsLeft) {
        clearInterval(liveCountdownInterval);
        function tick() {
            if (secsLeft <= 0) {
                clearInterval(liveCountdownInterval);
                updateSidebar("0d 0h 0m");
                runCheck();
                return;
            }
            updateSidebar(formatTimer(secsLeft, true));
            secsLeft--;
        }
        tick();
        liveCountdownInterval = setInterval(tick, 1000);
    }

    // Show stored timer immediately if available
    (function showStoredTimer() {
        const info = getStoredWarInfo();
        let timerText = "0d 0h 0m";
        if (info.start && info.nextCheck && info.start > Math.floor(Date.now() / 1000)) {
            // Pending war
            const left = Math.max(0, info.start - Math.floor(Date.now() / 1000));
            timerText = formatTimer(left);
        } else if (info.start && info.nextCheck && info.start <= Math.floor(Date.now() / 1000)) {
            // Active war (just show zeros)
            timerText = "0d 0h 0m";
        }
        updateSidebar(timerText);
    })();

    // Add MutationObserver to detect when sidebar is added to DOM
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if any added nodes contain sidebar elements
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the node itself is a sidebar
                            if (node.classList && (node.classList.contains('tt-sidebar-information') || node.classList.contains('sidebar-information'))) {
                                setTimeout(() => {
                                    initializeTimer(); // This will now move the timer if needed
                                }, 100);
                            }
                            // Check if the node contains a sidebar
                            const foundSidebar = node.querySelector && (node.querySelector('.tt-sidebar-information') || node.querySelector('.sidebar-information'));
                            if (foundSidebar) {
                                setTimeout(() => {
                                    initializeTimer(); // This will now move the timer if needed
                                }, 100);
                            }
                        }
                    });
                    
                    // Also check if sidebar exists now and timer doesn't exist or is in wrong place
                    const sidebar = findSidebar();
                    const existingTimer = document.getElementById(timerContainerID);
                    
                    if (sidebar && (!existingTimer || existingTimer.parentElement !== sidebar)) {
                        // Give it a moment to settle
                        setTimeout(() => {
                            initializeTimer(); // This will now move the timer if needed
                        }, 100);
                    }
                }
            });
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Stop observing after 30 seconds to prevent memory leaks
        setTimeout(() => {
            observer.disconnect();
        }, 30000);
    }

    function initializeTimer() {
        const info = getStoredWarInfo();
        let timerText = "0d 0h 0m";
        if (info.start && info.nextCheck && info.start > Math.floor(Date.now() / 1000)) {
            // Pending war
            const left = Math.max(0, info.start - Math.floor(Date.now() / 1000));
            timerText = formatTimer(left);
        } else if (info.start && info.nextCheck && info.start <= Math.floor(Date.now() / 1000)) {
            // Active war (just show zeros)
            timerText = "0d 0h 0m";
        }
        
        // Check if timer already exists in wrong location
        const existingTimer = document.getElementById(timerContainerID);
        const currentSidebar = findSidebar();
        
        if (existingTimer && currentSidebar) {
            // If timer exists but is in wrong sidebar, move it
            const timerParent = existingTimer.parentElement;
            if (timerParent !== currentSidebar) {
                existingTimer.remove();
                // Force recreation by removing the element
            }
        }
        
        updateSidebar(timerText);
        runCheck();
    }

    // Try to initialize immediately
    waitForSidebar(initializeTimer);
    
    // Also setup mutation observer for dynamic content
    setupMutationObserver();
    
    // Fallback: Try again after a longer delay in case extensions are slow to load
    setTimeout(() => {
        if (!document.getElementById(timerContainerID)) {
            waitForSidebar(initializeTimer);
        }
    }, 5000);
})();