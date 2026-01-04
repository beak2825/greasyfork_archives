// ==UserScript==
// @name         Worldguessr Cheat/Hack 2025
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Always visible tiny "See Location" button in the bottom-left corner for WorldGuessr. Made by DarkShadow44. Updated 2025. Undetected.
// @author       DarkShadow44 & CheatGuessr
// @match        https://www.worldguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worldguessr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537231/Worldguessr%20CheatHack%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/537231/Worldguessr%20CheatHack%202025.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let seeLocationButton = null;
    let loadingIndicator = null;
    let dotInterval = null;
    let blockAdsSetting = true;
    let initMessageElement = null; // Für die Initialisierungsnachricht

    // Funktion zum Anzeigen der Initialisierungsnachricht
    function showInitializationMessage() {
        if (initMessageElement) return; // Nur einmal anzeigen

        initMessageElement = document.createElement('div');
        initMessageElement.id = 'cheat-init-message';
        initMessageElement.innerHTML = `
            WorldGuessr Cheat Initialized, made by DarkShadow44 2025.<br>
            <span class="untdctd">✔</span>Undetected<span class="untdctd">✔</span><br>
            (Small button to see your location is at the bottom left)
        `;
        document.body.appendChild(initMessageElement);

        // Nachricht nach 5 Sekunden ausblenden und entfernen
        setTimeout(() => {
            if (initMessageElement) {
                initMessageElement.style.opacity = '0';
                // Warten bis die Opacity-Transition vorbei ist, bevor das Element entfernt wird
                setTimeout(() => {
                    if (initMessageElement && initMessageElement.parentNode) {
                        initMessageElement.parentNode.removeChild(initMessageElement);
                    }
                    initMessageElement = null; // Zurücksetzen für den Fall eines Neuladens (obwohl das Skript dann neu startet)
                }, 500); // Muss zur CSS-Transition-Dauer passen
            }
        }, 5000); // 5 Sekunden anzeigen
    }


    // Funktion zum Erstellen des "See Location"-Knopfes
    function createSeeLocationButton() {
        if (seeLocationButton) return;

        seeLocationButton = document.createElement('button');
        seeLocationButton.id = 'tiny-see-location-button';
        seeLocationButton.textContent = 'See Location';
        document.body.appendChild(seeLocationButton);

        seeLocationButton.onclick = () => {
            if (window.location.pathname !== '/banned' && window.location.pathname !== '/banned2') {
                const loc = extractLocationFromIframe();
                if (loc) {
                    window.open(`https://www.google.com/maps?q=${loc.lat},${loc.long}&z=18&output=embed`, "_blank");
                } else {
                    alert('Could not determine current location. Please ensure you are in a game round.');
                }
            } else {
                alert("This function is not available on the 'banned' page.");
            }
        };
    }

    // Banned page handler
    if (window.location.pathname === '/banned' || window.location.pathname === '/banned2') {
        const handleBannedPage = () => {
            // ... (Banned Page Code bleibt unverändert) ...
            const backdrop = document.createElement('div');
            backdrop.style.position = 'fixed';
            backdrop.style.top = '0';
            backdrop.style.left = '0';
            backdrop.style.right = '0';
            backdrop.style.bottom = '0';
            backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)';
            backdrop.style.zIndex = '10000';

            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '50%';
            modal.style.left = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.backgroundColor = '#1f2937';
            modal.style.padding = '20px';
            modal.style.borderRadius = '8px';
            modal.style.color = 'white';
            modal.style.zIndex = '10001';

            const message = document.createElement('p');
            message.textContent = 'The Cheat has been detected!\nPlease Enter 10-20 random characters to bypass the anti-cheat.\n\nExample (do not use the example):\ndf89aj3n4r98nd9';
            message.style.margin = '0 0 15px 0';

            const input = document.createElement('input');
            input.type = 'text';
            input.style.width = '100%';
            input.style.marginBottom = '15px';
            input.style.padding = '8px';
            input.style.borderRadius = '4px';
            input.style.border = '1px solid #4b5563';
            input.style.backgroundColor = '#374151';
            input.style.color = 'white';

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.style.padding = '8px 16px';
            submitButton.style.backgroundColor = '#3b82f6';
            submitButton.style.color = 'white';
            submitButton.style.border = 'none';
            submitButton.style.borderRadius = '4px';
            submitButton.style.cursor = 'pointer';
            submitButton.onmouseenter = () => submitButton.style.backgroundColor = '#2563eb';
            submitButton.onmouseleave = () => submitButton.style.backgroundColor = '#3b82f6';

            submitButton.onclick = () => {
                const chars = input.value.trim();
                if (chars) {
                    if (chars === 'df89aj3n4r98nd9') {
                        alert('You cannot use the example!');
                        return;
                    }
                    const history = JSON.parse(localStorage.getItem('mapDivClassHistory') || '[]');
                    if (history.includes(chars)) {
                        alert('You cannot reuse a previous map div name!');
                        return;
                    }
                    localStorage.removeItem('banned');
                    localStorage.setItem('mapDivClass', chars);
                    history.push(chars);
                    localStorage.setItem('mapDivClassHistory', JSON.stringify(history));
                    window.location.href = 'https://www.worldguessr.com/';
                }
            };
            modal.appendChild(message);
            modal.appendChild(input);
            modal.appendChild(submitButton);
            document.body.appendChild(backdrop);
            document.body.appendChild(modal);
        };
        handleBannedPage();
        // Initialisierungsnachricht und Knopf auch auf der Banned-Seite anzeigen
    }

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        #cheat-init-message {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #28a745; /* Grün */
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            border: 2px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10005; /* Sehr hoch */
            text-align: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            opacity: 1;
            transition: opacity 0.5s ease-out;
        }
        #cheat-init-message .untdctd { /* Styling für die Häkchen */
            color: #c3e6cb; /* Helleres Grün für die Häkchen innerhalb des grünen Kastens */
            font-weight: bold;
            margin: 0 2px;
        }

        #tiny-see-location-button {
            position: fixed;
            bottom: 10px;
            left: 10px;
            padding: 5px 10px;
            font-size: 11px;
            background-color: #3b82f6;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10003;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            opacity: 0.9;
            transition: opacity 0.2s, background-color 0.2s;
        }
        #tiny-see-location-button:hover {
            opacity: 1;
            background-color: #2563eb;
        }

        .loading-indicator {
            position: fixed;
            left: 10px;
            bottom: 50px;
            padding: 5px 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            border-radius: 4px;
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
    `;
    document.head.appendChild(style);


    // Nur wenn NICHT auf der Banned-Seite, werden Adblock und Ladeindikator initialisiert
    if (window.location.pathname !== '/banned' && window.location.pathname !== '/banned2') {
        try {
            const savedSettings = JSON.parse(localStorage.getItem('worldGuessrHelperMinimal'));
            if (savedSettings && typeof savedSettings.blockAds === 'boolean') {
                blockAdsSetting = savedSettings.blockAds;
            }
        } catch (e) { /* Ignoriere Fehler, Standardwert wird verwendet */ }

        function blockAdsIfEnabled() {
            // ... (blockAdsIfEnabled Code bleibt unverändert) ...
            if (!blockAdsSetting) return;
            const adSelectors = [
                '[id^="google_ads_iframe"]',
                '[id^="worldguessr-com_"]',
                '.video-ad'
            ];
            const removeAds = () => {
                adSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(ad => ad.remove());
                });
            };
            removeAds();
            const observer = new MutationObserver(removeAds);
            observer.observe(document.body, { childList: true, subtree: true });
        }

        function createLoadingIndicator() {
            // ... (createLoadingIndicator Code bleibt unverändert) ...
            if (loadingIndicator) return;
            loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.style.display = 'none';
            document.body.appendChild(loadingIndicator);

            let dots = 0;
            if (dotInterval) clearInterval(dotInterval);
            dotInterval = setInterval(() => {
                dots = (dots + 1) % 4;
                if (loadingIndicator) {
                    loadingIndicator.textContent = 'Loading location' + '.'.repeat(dots);
                }
            }, 500);
        }

        function showLoadingIndicator() {
            if (loadingIndicator) loadingIndicator.style.display = 'block';
        }

        function hideLoadingIndicator() {
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        }

        window.extractLocationFromIframe = function() {
            // ... (extractLocationFromIframe Code bleibt unverändert) ...
            showLoadingIndicator();
            const iframe = document.querySelector('iframe[src^="/svEmbed"]');
            if (!iframe) {
                hideLoadingIndicator();
                console.warn("WorldGuessr iframe not found.");
                return null;
            }
            try {
                const urlParams = new URLSearchParams(iframe.src.split('?')[1]);
                const lat = parseFloat(urlParams.get('lat'));
                const long = parseFloat(urlParams.get('long'));
                if (!isNaN(lat) && !isNaN(long)) {
                    hideLoadingIndicator();
                    return { lat, long };
                }
            } catch (e) {
                console.error("Error parsing iframe src:", e);
            }
            hideLoadingIndicator();
            console.warn("Could not extract lat/long from iframe.");
            return null;
        };

        createLoadingIndicator();
        blockAdsIfEnabled();
    } else {
        window.extractLocationFromIframe = function() {
            console.warn("extractLocationFromIframe called on banned page. No location to extract.");
            return null;
        };
    }

    // Funktionen und Elemente initialisieren, die immer gebraucht werden
    // (unabhängig von Banned-Status für den Knopf und die Init-Nachricht)
    function initializeUI() {
        createSeeLocationButton();
        showInitializationMessage();
    }

    if (document.body) {
        initializeUI();
    } else {
        window.addEventListener('DOMContentLoaded', initializeUI);
    }

    console.log("CheatGuessr Tiny Location Button Loaded (v2.5 - InitMsg).");

})();