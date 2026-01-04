// ==UserScript==
// @name         WME Mobile View
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2015.06.02
// @description  Smartphone freundliches UI
// @author       Hiwi234
// @match        https://www.waze.com/editor*
// @match        https://beta.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535964/WME%20Mobile%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/535964/WME%20Mobile%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let slider = null;
    let valueDisplay = null;
    let sliderStatus = null;
    let tabPaneElement = null;
    let currentWidth = 100;
    let isCtrlPressed = false;

    function applyStreetWidth(value) {
        if (!W || !W.model || !W.model.segments || !W.userscripts) {
            console.warn('WME Script: WME-Objekte nicht verfügbar.');
            if (sliderStatus) {
                sliderStatus.textContent = 'Fehler: WME nicht bereit.';
                sliderStatus.style.color = '#ff6347';
            }
            return;
        }

        try {
            currentWidth = value;
            const segments = W.model.segments.getObjectArray();
            let updatedCount = 0;
            segments.forEach(segment => {
                const element = W.userscripts.getFeatureElementByDataModel(segment);
                if (element) {
                    element.style.strokeWidth = `${value / 100}em`;
                    updatedCount++;
                }
            });

            if (valueDisplay) {
                valueDisplay.textContent = value;
            }
            if (sliderStatus) {
                sliderStatus.style.color = 'green';
                sliderStatus.textContent = `${updatedCount} Segmente aktualisiert.`;
            }
        } catch (error) {
            console.error('WME Script: Fehler beim Anpassen der Straßenbreite:', error);
            if (sliderStatus) {
                sliderStatus.textContent = 'Fehler beim Anpassen.';
                sliderStatus.style.color = 'red';
            }
        }
    }

    function updateAllSegments() {
        if (currentWidth !== 100) {
            applyStreetWidth(currentWidth);
        }
    }

    function handleCtrlKeyEvent(event) {
        if (isCtrlPressed) {
            Object.defineProperty(event, 'ctrlKey', {
                get: function() { return true; }
            });
        }
    }

    function toggleCtrlKey(activate) {
        const ctrlButton = document.getElementById('ctrlHoldBtn');

        if (activate && !isCtrlPressed) {
            // STRG aktivieren
            document.addEventListener('mousedown', handleCtrlKeyEvent, true);
            document.addEventListener('click', handleCtrlKeyEvent, true);
            document.addEventListener('mousemove', handleCtrlKeyEvent, true);
            isCtrlPressed = true;

            if (ctrlButton) {
                ctrlButton.classList.add('waze-btn-active');
                ctrlButton.style.backgroundColor = '#C4C4CC';
                ctrlButton.textContent = 'STRG loslassen';
            }
        } else if (!activate && isCtrlPressed) {
            // STRG deaktivieren
            document.removeEventListener('mousedown', handleCtrlKeyEvent, true);
            document.removeEventListener('click', handleCtrlKeyEvent, true);
            document.removeEventListener('mousemove', handleCtrlKeyEvent, true);
            isCtrlPressed = false;

            if (ctrlButton) {
                ctrlButton.classList.remove('waze-btn-active');
                ctrlButton.style.backgroundColor = '';
                ctrlButton.textContent = 'STRG halten';
            }
        }
    }

    async function initializeScriptFeatures() {
        console.log("WME Script: Initialisierung gestartet.");

        if (!W?.userscripts?.state.isReady) {
            console.error("WME Script: WME nicht bereit. Abbruch.");
            return;
        }

        try {
            const scriptId = "wme-street-width-tab";
            let tabLabel;

            try {
                const registrationResult = W.userscripts.registerSidebarTab(scriptId);
                tabLabel = registrationResult.tabLabel;
                tabPaneElement = registrationResult.tabPane;
            } catch (e) {
                console.warn(`WME Script: Tab-Registrierung fehlgeschlagen: ${e.message}`);
                return;
            }

            tabLabel.innerText = 'Mobile View';
            tabLabel.title = 'Smartphone freundliches UI';

            await W.userscripts.waitForElementConnected(tabPaneElement);

            const container = document.createElement('div');
            container.style.padding = '10px';
            container.innerHTML = `
                <b>Straßenbreiten Auwahl Steuerung</b>
                <div class="control-group" style="margin-top: 15px;">
                    <label for="widthSliderTab">Breite (%): <span id="widthValueTab">100</span></label>
                    <input type="range" id="widthSliderTab" min="100" max="300" value="100" style="width: 100%" />
                    <div id="sliderStatusTab" style="margin-top: 5px; font-size: 12px;">Bereit</div>
                </div>
                <div style="margin-top: 15px;">
                    <button id="selectAllBtn" class="waze-btn waze-btn-small" style="width: 100%; margin-bottom: 10px;">
                        Alles auswählen (STRG+A)
                    </button>
                    <button id="ctrlHoldBtn" class="waze-btn waze-btn-small" style="width: 100%;">
                        STRG halten
                    </button>
                </div>
            `;

            tabPaneElement.appendChild(container);

            slider = document.getElementById('widthSliderTab');
            valueDisplay = document.getElementById('widthValueTab');
            sliderStatus = document.getElementById('sliderStatusTab');

            slider.addEventListener('input', (e) => {
                applyStreetWidth(e.target.value);
            });

            document.getElementById('selectAllBtn').addEventListener('click', () => {
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'a',
                    code: 'KeyA',
                    keyCode: 65,
                    which: 65,
                    ctrlKey: true,
                    bubbles: true,
                    cancelable: true
                }));
            });

            document.getElementById('ctrlHoldBtn').addEventListener('click', function() {
                toggleCtrlKey(!isCtrlPressed);
            });

            document.addEventListener('wme-map-data-loaded', updateAllSegments);
            W.map.events.register("moveend", null, updateAllSegments);
            W.map.events.register("zoomend", null, updateAllSegments);

            window.addEventListener('beforeunload', () => {
                if (isCtrlPressed) {
                    toggleCtrlKey(false);
                }
            });

        } catch (error) {
            console.error('WME Script: Initialisierungsfehler:', error);
        }
    }

    if (W?.userscripts?.state.isReady) {
        initializeScriptFeatures();
    } else {
        document.addEventListener('wme-ready', initializeScriptFeatures, { once: true });
    }
})();