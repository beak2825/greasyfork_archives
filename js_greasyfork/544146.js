// ==UserScript==
// @name         Cyclist Ring Enhanced
// @namespace    cazy.torn.ring
// @version      2.5
// @description  Sends browser notifications when targets from the watch list appear in the crimes page, based off Cazy's and Lunara's code!
// @author       Cazylecious and QueenLunara and leonissenbaum
// @match        https://www.torn.com/loader.php?sid=crimes
// @match        https://www.torn.com/page.php?sid=crimes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544146/Cyclist%20Ring%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/544146/Cyclist%20Ring%20Enhanced.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Check if notifications are supported
    if ("Notification" in window) {
        // Request permission if not already granted
        if (Notification.permission === "default") {
            Notification.requestPermission()
        }
    }

    let Testclear = false; // Set to true to clear saved lists on start.

    let savedTargets = GM_getValue('savedTargets', []);
    let selectedTargets = GM_getValue('selectedTargets', []);
    let enableAlerts = GM_getValue('enableAlerts', false);
    let detectedTargets = new Set();
    let audioUnlocked = GM_getValue('audioUnlocked', false);

    function sanitizeText(text) {
        return text.split('(')[0].trim().replace(/[^a-zA-Z0-9\s-]/g, "");
    }

    function isSanitized(text) {
        return /^[a-zA-Z0-9\s-]+$/.test(text);
    }

    function cleanSavedTargets() {
        let cleanedList = savedTargets.map(sanitizeText).filter(isSanitized);
        cleanedList = [...new Set(cleanedList)];

        if (!cleanedList.includes("Cyclist")) {
            cleanedList.push("Cyclist");
        }

        if (JSON.stringify(cleanedList) !== JSON.stringify(savedTargets)) {
            savedTargets = cleanedList;
            GM_setValue('savedTargets', savedTargets);
            console.log("[Cyclist Ring] Cleaned and updated saved targets.");
        }
    }

    function clearSavedLists() {
        if (Testclear) {
            GM_setValue('savedTargets', []);
            GM_setValue('selectedTargets', []);
            console.log("[Cyclist Ring] Cleared saved and selected targets.");
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    GM_addStyle(`
        #cyclist-ring-panel {
            position: fixed;
            top: 50px;
            left: 5px;
            padding: 8px;
            border: 2px solid #444;
            background-color: #1f1f1f;
            color: white;
            width: 250px;
            border-radius: 6px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
            z-index: 999999;
            font-size: 14px;
        }
        #cyclist-ring-panel button {
            padding: 6px;
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
            border: none;
            cursor: pointer;
            width: 100%;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 8px;
        }
        #cyclist-ring-dropdown-menu {
            display: none;
            background-color: #1f1f1f;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 8px;
            margin-top: 4px;
            overflow-y: auto;
            max-height: 200px;
        }
    `);

    function createPanel() {
        console.log("[Cyclist Ring] Creating panel...");
        const panel = document.createElement('div');
        panel.id = 'cyclist-ring-panel';
        panel.innerHTML = `
            <button id="cyclist-ring-minimize-btn">-</button>
            <div id="cyclist-ring-content">
                <button id="cyclist-ring-enable-alerts-btn">${enableAlerts ? "Disable Alerts" : "Enable Alerts"}</button>
                <button id="cyclist-ring-select-targets-btn">Select Targets</button>
                <div id="cyclist-ring-dropdown-menu"></div>
            </div>
        `;
        document.body.appendChild(panel);
        console.log("[Cyclist Ring] Panel created and appended to body.");

        document.getElementById('cyclist-ring-select-targets-btn').addEventListener('click', () => {
            const dropdownMenu = document.getElementById('cyclist-ring-dropdown-menu');
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });

        document.getElementById('cyclist-ring-minimize-btn').addEventListener('click', () => {
            const content = document.getElementById('cyclist-ring-content');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
            document.getElementById('cyclist-ring-minimize-btn').textContent = content.style.display === 'none' ? '+' : '-';
        });

        document.getElementById('cyclist-ring-enable-alerts-btn').addEventListener('click', () => {
            enableAlerts = !enableAlerts;
            GM_setValue('enableAlerts', enableAlerts);
            document.getElementById('cyclist-ring-enable-alerts-btn').textContent = enableAlerts ? "Disable Alerts" : "Enable Alerts";
        });

        updateDropdown();
    }

    function getActiveTargets() {
        const targetElements = document.querySelectorAll('.titleAndProps___DdeVu');
        return Array.from(targetElements).map(el => {
            let mainDiv = el.querySelector('div');
            const parent = el.closest('.crime-option-sections')
            const button = parent.querySelector('.torn-btn')
            const enabled = button.getAttribute('aria-label').includes('5 nerve')
            if (!enabled) {
                return false
            }
            return mainDiv ? sanitizeText(mainDiv.textContent) : null;
        }).filter(Boolean);
    }

    function updateDropdown() {
        cleanSavedTargets();
        const dropdownMenu = document.getElementById('cyclist-ring-dropdown-menu');
        dropdownMenu.innerHTML = '';

        getActiveTargets().forEach(target => {
            let cleanTarget = sanitizeText(target);
            if (!savedTargets.includes(cleanTarget) && isSanitized(cleanTarget)) {
                savedTargets.push(cleanTarget);
                GM_setValue('savedTargets', savedTargets);
            }
        });

        savedTargets.forEach(target => {
            const option = document.createElement('div');
            option.textContent = target;
            option.style.backgroundColor = selectedTargets.includes(target) ? '#4CAF50' : 'transparent';

            option.addEventListener('click', () => {
                if (selectedTargets.includes(target)) {
                    selectedTargets = selectedTargets.filter(t => t !== target);
                } else {
                    selectedTargets.push(target);
                }
                GM_setValue('selectedTargets', selectedTargets);
                updateDropdown();
            });

            dropdownMenu.appendChild(option);
        });
    }

    function checkForTargets() {
        let activeTargets = getActiveTargets();
        let newTargets = []

        selectedTargets.forEach(target => {
            if (activeTargets.includes(target) && !detectedTargets.has(target)) {
                detectedTargets.add(target);
                newTargets.push(target);
            }
        });

        const currentTargets = new Set()
        activeTargets.forEach(target => {
            currentTargets.add(target)
        })

        detectedTargets.forEach(target => {
            if (!currentTargets.has(target)) {
                detectedTargets.delete(target)
            }
        })

        if (newTargets.length > 0) {
            playAlert(newTargets);
        }
    }

    function playAlert(targets) {
        const nerve = Number(document.querySelector('[class*="nerve___"]').querySelector('[class*="bar-value"]').textContent.split('/')[0])
        if (nerve < 5) {
            return
        }

        if (enableAlerts) {
            const notification = new Notification("Pickpocket target", {
                body: `Targets: ${targets.join(", ")}`,
                tag: `Pickpocket ${targets.join(", ")}`,
                renotify: true
            })
            // Add click event listener to focus the window
            notification.onclick = function(event) {
                event.preventDefault()
                window.focus() // Bring the window to the front
                notification.close()
            }
        }

        if (!audioUnlocked) {
            console.log("[Cyclist Ring] Audio alerts are disabled. Please refocus the page and enable them.");
            return;
        }

        var audio = new Audio('https://audio.jukehost.co.uk/gxd2HB9RibSHhr13OiW6ROCaaRbD8103');
        audio.play().catch(error => {
            console.error("[Cyclist Ring] Audio playback failed:", error);
        });


    }

    function observeCrimes() {
        const targetNode = document.querySelector('.pickpocketing-root');
        if (!targetNode) return;

        // Debounce the check to avoid spamming on rapid UI changes
        const debouncedCheck = debounce(checkForTargets, 20)

        const config = { childList: true, subtree: true };
        const observer = new MutationObserver(() => {
            debouncedCheck()
        });

        observer.observe(targetNode, config);
    }

    function waitForElementToExist(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                console.log(`[Cyclist Ring] Element "${selector}" already exists.`);
                return resolve(document.querySelector(selector));
            }
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    console.log(`[Cyclist Ring] Element "${selector}" found.`);
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { subtree: true, childList: true });
        });
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !audioUnlocked) {
            if (confirm("Click OK to enable audio alerts.")) {
                audioUnlocked = true;
                GM_setValue('audioUnlocked', true);
                console.log("[Cyclist Ring] Audio alerts unlocked.");
            }
        }
    });

    if (window.location.href.includes('https://www.torn.com/loader.php?sid=crimes') || window.location.href.includes('https://www.torn.com/page.php?sid=crimes')) {
        console.log("[Cyclist Ring] Crimes page detected. Initializing...");
        waitForElementToExist('.pickpocketing-root').then(() => {
            console.log("[Cyclist Ring] .pickpocketing-root element found. Proceeding to create panel...");
            clearSavedLists();
            cleanSavedTargets();
            createPanel();
            observeCrimes();
        }).catch(error => {
            console.error("[Cyclist Ring] Error waiting for .pickpocketing-root:", error);
        });
    } else {
        console.log("[Cyclist Ring] Not on the crimes page.");
        if (!audioUnlocked) {
            alert("Audio alerts are disabled. Please visit the crimes page to enable them.");
        }
    }
})();
