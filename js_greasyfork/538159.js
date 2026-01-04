// ==UserScript==
// @name         Torn Kill Stealer
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Works on the Attack page, Gives a sound notification and makes the person being Attacked clickable.
// @author       defend [2683949]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538159/Torn%20Kill%20Stealer.user.js
// @updateURL https://update.greasyfork.org/scripts/538159/Torn%20Kill%20Stealer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & State ---
    let attackerToWatch = null;
    let isAudioNotificationEnabled = GM_getValue("ks_audioNotificationEnabled", true);
    let quickTargetButton = null;
    let attackerPlayerWindowForButton = null; // Renamed: This is now the 'playerWindow' element

    const notificationSoundUrl = 'https://www.myinstants.com/media/sounds/google-pixel-popcorn-notification-sound.mp3';
    let customSound;
    try {
        customSound = new Audio(notificationSoundUrl);
        customSound.volume = 0.7;
    } catch (e) {
        console.error("[KillStealHelper] Could not create Audio object:", e);
        customSound = null;
    }

    // --- Styling ---
    GM_addStyle(`
        .ks-clickable-target { /* For names in the log */
            color: #FFD700 !important;
            font-weight: bold !important;
            text-decoration: underline !important;
            cursor: pointer !important;
        }
        .ks-clickable-target:hover {
            color: #FFA500 !important;
        }

        /* This class is applied to the element that the snipe button should cover (playerWindow___aDeDI) */
        .ks-snipe-button-anchor {
            position: relative !important;
        }

        #ks-quick-target-button { /* The Snipe Button - Full Area Overlay for playerWindow */
            position: absolute !important;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1050 !important; /* High z-index */

            background-color: rgba(220, 20, 60, 0.45); /* Semi-transparent Crimson overlay */
            color: white !important;

            border: 3px dashed #FFFF00; /* Optional: Bright yellow dashed border for visibility */
            box-sizing: border-box;

            border-radius: 0px; /* Usually player windows don't have rounded corners */
            cursor: pointer;

            display: none; /* Initially hidden, flex applied when displayed */
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;

            font-size: 24px !important; /* Adjusted for potentially smaller area */
            font-weight: bold;
            text-shadow: 0 0 5px black, 0 0 8px black;

            padding: 10px; /* Some padding so text isn't flush with edges */
            white-space: normal; /* Allow text to wrap */
            transition: background-color 0.15s ease-in-out;
            overflow: hidden; /* Hide text overflow if area is very small */
        }
        #ks-quick-target-button:hover {
            background-color: rgba(255, 69, 0, 0.60); /* Semi-transparent OrangeRed on hover */
        }

        #ks-audio-toggle-button { /* Sound toggle button, in title bar */
            padding: 5px 10px;
            background-color: #3a3a3a;
            color: white;
            border: 1px solid #555;
            border-radius: 4px;
            cursor: pointer;
            font-size: 11px;
            margin-left: 15px;
            vertical-align: middle;
        }
        #ks-audio-toggle-button:hover {
            background-color: #4a4a4a;
        }
    `);

    // --- Helper Functions ---
    function escapeRegExp(string) {
        if (!string) return '';
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function playNotificationSound() {
        if (isAudioNotificationEnabled && customSound) {
            customSound.currentTime = 0;
            customSound.play().catch(e => console.warn("[KillStealHelper] Audio play failed:", e));
        }
    }

    function updateAudioToggleButtonText(button) {
        if (button) button.textContent = `Sound: ${isAudioNotificationEnabled ? 'ON' : 'OFF'}`;
    }

    async function getOpponentDetailsFromPage() { // Identifies who YOU are attacking
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 25;
            const intervalId = setInterval(() => {
                attempts++;
                // This selector is crucial for identifying the opponent's name element
                const opponentNameElement = document.querySelector('.activeHeader___Ika7F .userName___loAWK');
                if (opponentNameElement && opponentNameElement.textContent.trim()) {
                    clearInterval(intervalId);
                    resolve({ name: opponentNameElement.textContent.trim() });
                    return;
                }
                if (attempts >= maxAttempts) {
                    clearInterval(intervalId);
                    reject("Opponent name element (.activeHeader___Ika7F .userName___loAWK) not found.");
                }
            }, 400);
        });
    }

    function findAttackerPlayerWindow() { // Finds YOUR player model window (playerWindow___aDeDI)
        const playerPanels = document.querySelectorAll('div.player___wiE8R');
        for (const panel of playerPanels) {
            // Primary condition: Your panel is the one that ISN'T the opponent's active header.
            if (!panel.querySelector('.activeHeader___Ika7F')) {
                // Now find the specific playerWindow inside your panel
                const playerWindow = panel.querySelector('div.playerWindow___aDeDI');
                if (playerWindow) {
                    playerWindow.classList.add('ks-snipe-button-anchor'); // Add anchor class for CSS
                    return playerWindow;
                }
            }
        }
        // Fallback: Try to find by the "green" header, though less reliable if colors change.
        // This HTML shows your side often has a green header initially.
        console.log("[KillStealHelper] Trying fallback for attacker player window detection.");
        for (const panel of playerPanels) {
             if (panel.querySelector('div.headerWrapper___p6yrL.green___QtOKw')) {
                const playerWindow = panel.querySelector('div.playerWindow___aDeDI');
                 if (playerWindow) {
                    console.log("[KillStealHelper] Found attacker player window via green header fallback.");
                    playerWindow.classList.add('ks-snipe-button-anchor');
                    return playerWindow;
                }
            }
        }
        console.warn("[KillStealHelper] Could not find the attacker's playerWindow___aDeDI element.");
        return null;
    }

    // --- UI Elements Setup ---
    function setupUI() {
        const titleContainer = document.querySelector('div.titleContainer___QrlWP h4.title___rhtB4');
        let audioButton = document.getElementById('ks-audio-toggle-button');

        if (!audioButton) {
            audioButton = document.createElement('button');
            audioButton.id = 'ks-audio-toggle-button';
            audioButton.type = 'button';
            audioButton.onclick = () => {
                isAudioNotificationEnabled = !isAudioNotificationEnabled;
                GM_setValue("ks_audioNotificationEnabled", isAudioNotificationEnabled);
                updateAudioToggleButtonText(audioButton);
                if (isAudioNotificationEnabled) playNotificationSound(); // Test sound
            };
        }
        updateAudioToggleButtonText(audioButton);

        if (titleContainer && titleContainer.parentElement) {
            if (!titleContainer.parentElement.querySelector('#ks-audio-toggle-button')) {
                 titleContainer.parentElement.appendChild(audioButton);
            }
        } else {
            console.warn("[KillStealHelper] Title container for audio toggle not found. Fallback placement.");
            if (!document.body.querySelector('#ks-audio-toggle-button')) { // Prevent multiple fallbacks
                document.body.appendChild(audioButton);
                Object.assign(audioButton.style, {position:'fixed', top:'10px', right:'10px', zIndex:'10001'});
            }
        }

        // Snipe Button
        if (!quickTargetButton) {
            quickTargetButton = document.createElement('button');
            quickTargetButton.id = 'ks-quick-target-button';
            quickTargetButton.type = 'button';
            // Text content set dynamically
            quickTargetButton.onclick = function() {
                if (this.dataset.profileUrl) {
                    window.open(this.dataset.profileUrl, '_blank');
                }
                this.style.display = 'none'; // Hide after click
            };
        }
    }

    // --- Main Logic ---
    function processLogEntry(logEntryMessageSpan) {
        if (!logEntryMessageSpan || logEntryMessageSpan.dataset.ksProcessed === 'true' || !attackerToWatch) {
            return;
        }

        const logText = logEntryMessageSpan.textContent;
        const pattern = new RegExp(
            `^(${escapeRegExp(attackerToWatch)})\\s+(?:initiated an attack against|.+?\\s(?:fired.+?hitting|hit|kicked|punched|slashed|stabbed)|hospitalized)\\s+([a-zA-Z0-9_]+)(?:\\s.*)?$`
        );
        const match = logText.match(pattern);

        if (match) {
            const actorInLog = match[1];
            const targetPlayerName = match[2];

            if (actorInLog === attackerToWatch && targetPlayerName && targetPlayerName !== attackerToWatch) {
                console.log(`[KillStealHelper] Opponent (${attackerToWatch}) targeted: ${targetPlayerName}.`);
                playNotificationSound();

                const profileLink = `https://www.torn.com/profiles.php?NID=${encodeURIComponent(targetPlayerName)}`;

                // Update log link
                const contentHolder = logEntryMessageSpan.querySelector('span:not([class])') || logEntryMessageSpan;
                const linkHTML = `<a href="${profileLink}" target="_blank" class="ks-clickable-target">${targetPlayerName}</a>`;
                const targetNameRegex = new RegExp(`(?<![a-zA-Z0-9_])${escapeRegExp(targetPlayerName)}(?![a-zA-Z0-9_])`);

                if (contentHolder.innerHTML.match(targetNameRegex)) {
                    contentHolder.innerHTML = contentHolder.innerHTML.replace(targetNameRegex, linkHTML);
                    logEntryMessageSpan.dataset.ksProcessed = 'true';
                }

                // Update and show the Quick Snipe Button on the attacker's player window
                if (quickTargetButton && attackerPlayerWindowForButton) { // Check attackerPlayerWindowForButton
                    quickTargetButton.innerHTML = `SNIPE<br>${targetPlayerName.toUpperCase()}`; // Allow line break
                    quickTargetButton.dataset.profileUrl = profileLink;
                    quickTargetButton.style.display = 'flex'; // Use flex for centering

                     if (!attackerPlayerWindowForButton.contains(quickTargetButton)) { // Append if not already child
                        attackerPlayerWindowForButton.appendChild(quickTargetButton);
                    }
                } else {
                    // console.warn("[KillStealHelper] Snipe button or its anchor element not found.");
                }
            }
        }
        // Consider adding logic here to hide the quickTargetButton if the current log entry
        // isn't a new target opportunity by `attackerToWatch`.
        // For now, it hides on click.
    }

    async function initializeScript() {
        console.log("[KillStealHelper] Initializing v2.6 (Precise Snipe Area)...");
        setupUI();

        try {
            const opponent = await getOpponentDetailsFromPage();
            attackerToWatch = opponent.name;
            if (attackerToWatch) {
                console.log(`[KillStealHelper] Identified opponent: ${attackerToWatch}`);
            } else {
                console.error("[KillStealHelper] Failed to identify opponent. Script may be non-functional.");
                return;
            }
        } catch (error) {
            console.error("[KillStealHelper] Error identifying opponent:", error);
            return;
        }

        // Find the specific player window for placing the snipe button
        attackerPlayerWindowForButton = findAttackerPlayerWindow();
        if (!attackerPlayerWindowForButton) {
            console.warn("[KillStealHelper] Your player model window (playerWindow___aDeDI) not found. Snipe button cannot be placed as an overlay.");
        } else {
             // Ensure the button is a child of the correct element if both exist
             if (quickTargetButton && !attackerPlayerWindowForButton.contains(quickTargetButton)) {
                 attackerPlayerWindowForButton.appendChild(quickTargetButton);
             }
        }


        const logListElement = document.querySelector('ul.list___UZYhA');
        if (!logListElement) {
            console.warn("[KillStealHelper] Attack log list (ul.list___UZYhA) not found. Log observer not set.");
            return;
        }

        logListElement.querySelectorAll('li.row___XdzXz span.message___Z4JCk').forEach(processLogEntry);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches('li.row___XdzXz')) {
                        const messageSpan = node.querySelector('span.message___Z4JCk');
                        if (messageSpan) {
                            processLogEntry(messageSpan);
                        }
                    }
                });
            });
        });

        observer.observe(logListElement, { childList: true });
        console.log("[KillStealHelper] Observer attached to attack log.");
    }

    // ---- Script Start ----
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        initializeScript();
    } else {
        document.addEventListener('DOMContentLoaded', initializeScript, { once: true });
    }

})();