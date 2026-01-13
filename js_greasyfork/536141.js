// ==UserScript==
// @name         WME Chat Plus
// @name:en      WME Chat Plus
// @version      2026.01.11
// @description  Fügt einen Button für temporären Zoom hinzu für bessere Chat sichtbarkeit und Auto-Sichtbarkeit
// @description:en  Adds a button for temporary zoom for better chat visibility and auto-visibility
// @description:es  Agrega un botón para zoom temporal para una mejor visibilidad del chat y auto-visibilidad
// @author       Hiwi234
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @downloadURL https://update.greasyfork.org/scripts/536141/WME%20Chat%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/536141/WME%20Chat%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = {
        AUTO: 'wme-quick-zoom-auto',
        ZOOM: 'wme-quick-zoom-level',
        VISIBILITY: 'wme-auto-visibility'
    };

    const translations = {
        'de': {
            buttonText: 'Quick Zoom',
            buttonTooltip: 'Temporär auf Zoomstufe zoomen',
            sliderLabel: 'Maximale Zoomstufe:',
            autoLoadLabel: 'Automatisch beim Laden',
            visibilityLabel: 'Immer sichtbar bleiben'
        },
        'en': {
            buttonText: 'Quick Zoom',
            buttonTooltip: 'Temporarily zoom to level',
            sliderLabel: 'Maximum zoom level:',
            autoLoadLabel: 'Automatic on load',
            visibilityLabel: 'Always stay visible'
        },
        'es': {
            buttonText: 'Zoom Rápido',
            buttonTooltip: 'Zoom temporal al nivel',
            sliderLabel: 'Nivel máximo de zoom:',
            autoLoadLabel: 'Automático al cargar',
            visibilityLabel: 'Permanecer siempre visible'
        }
    };

    // State management
    let isZooming = false;
    let visibilityObserver = null;
    let visibilityInterval = null;

    function getLanguage() {
        const lang = navigator.language.split('-')[0];
        return translations[lang] ? lang : 'en';
    }

    function getAutoZoomSetting() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY.AUTO);
            // Standardmäßig AKTIV wenn noch nicht gesetzt
            return stored === null ? true : stored === 'true';
        } catch (e) {
            console.warn('[WME Quick Zoom] localStorage access failed:', e);
            return true; // Standard: aktiv
        }
    }

    function setAutoZoomSetting(value) {
        try {
            localStorage.setItem(STORAGE_KEY.AUTO, String(value));
        } catch (e) {
            console.warn('[WME Quick Zoom] localStorage write failed:', e);
        }
    }

    function getVisibilitySetting() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY.VISIBILITY);
            // Standardmäßig AKTIV wenn noch nicht gesetzt (wie in der alten Version)
            return stored === null ? true : stored === 'true';
        } catch (e) {
            console.warn('[WME Quick Zoom] localStorage access failed:', e);
            return true; // Standard: aktiv
        }
    }

    function setVisibilitySetting(value) {
        try {
            localStorage.setItem(STORAGE_KEY.VISIBILITY, String(value));
        } catch (e) {
            console.warn('[WME Quick Zoom] localStorage write failed:', e);
        }
    }

    function getZoomLevel() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY.ZOOM);
            return stored ? parseInt(stored) : 7;
        } catch (e) {
            console.warn('[WME Quick Zoom] localStorage access failed:', e);
            return 7;
        }
    }

    function setZoomLevel(value) {
        try {
            localStorage.setItem(STORAGE_KEY.ZOOM, String(value));
        } catch (e) {
            console.warn('[WME Quick Zoom] localStorage write failed:', e);
        }
    }

    function ensureVisibility() {
        if (!getVisibilitySetting()) return;

        try {
            console.log('[WME Quick Zoom] Prüfe Sichtbarkeit...');
            
            // Haupt-Strategie: Suche nach dem Sichtbarkeits-Element im Online-Editoren Bereich (wie in der alten Version)
            const visibilityLabel = document.querySelector('span.editor-visibility.label');

            if (visibilityLabel) {
                const labelText = visibilityLabel.textContent.toLowerCase().trim();
                console.log('[WME Quick Zoom] Aktueller Sichtbarkeitsstatus:', labelText);

                // Prüfe ob der Status "unsichtbar" oder "invisible" ist
                if (labelText.includes('unsichtbar') || labelText.includes('invisible')) {
                    // Suche nach dem zugehörigen Button
                    const tooltipButton = visibilityLabel.closest('wz-list-item')?.querySelector('wz-button[color="clear-icon"]');

                    if (tooltipButton) {
                        console.log('[WME Quick Zoom] Unsichtbar erkannt, klicke Button...');
                        tooltipButton.click();
                        console.log('[WME Quick Zoom] Automatisch auf sichtbar gestellt');
                        return true;
                    }
                }
            }

            // Alternative Suche nach dem Button über verschiedene Selektoren (wie in der alten Version)
            const alternativeSelectors = [
                'wz-button[color="clear-icon"][size="md"]',
                'button.wz-button.clear-icon.md.icon-only',
                'wz-button button[type="button"]',
                '.editor-visibility.label'
            ];

            for (const selector of alternativeSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    // Prüfe verschiedene Text-Inhalte und Attribute
                    const elementText = element.textContent?.toLowerCase() || '';
                    const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || '';
                    const title = element.getAttribute('title')?.toLowerCase() || '';
                    const parentText = element.parentElement?.textContent?.toLowerCase() || '';

                    if (elementText.includes('unsichtbar') || elementText.includes('invisible') ||
                        ariaLabel.includes('unsichtbar') || ariaLabel.includes('invisible') ||
                        title.includes('unsichtbar') || title.includes('invisible') ||
                        parentText.includes('unsichtbar') || parentText.includes('invisible')) {

                        console.log('[WME Quick Zoom] Unsichtbar-Element gefunden, klicke...', selector);
                        element.click();
                        console.log('[WME Quick Zoom] Automatisch auf sichtbar gestellt');
                        return true;
                    }
                }
            }

            // Suche nach Icon-Namen (wie in der alten Version)
            const iconElements = document.querySelectorAll('wz-icon, i[class*="icon"]');
            for (const icon of iconElements) {
                const iconName = icon.getAttribute('name') || icon.className;
                if (iconName && (iconName.includes('invisible') || iconName.includes('unsichtbar'))) {
                    const clickableParent = icon.closest('button, wz-button, [clickable="true"]');
                    if (clickableParent) {
                        console.log('[WME Quick Zoom] Unsichtbar-Icon gefunden, klicke Parent...');
                        clickableParent.click();
                        console.log('[WME Quick Zoom] Automatisch auf sichtbar gestellt');
                        return true;
                    }
                }
            }

            console.log('[WME Quick Zoom] Keine Sichtbarkeits-Einstellung gefunden');
            return false;

        } catch (error) {
            console.warn('[WME Quick Zoom] Fehler beim Setzen der Sichtbarkeit:', error);
            return false;
        }
    }

    function stopVisibilityMonitoring() {
        if (visibilityObserver) {
            visibilityObserver.disconnect();
            visibilityObserver = null;
            console.log('[WME Quick Zoom] MutationObserver gestoppt');
        }
        
        if (visibilityInterval) {
            clearInterval(visibilityInterval);
            visibilityInterval = null;
            console.log('[WME Quick Zoom] Interval gestoppt');
        }
    }

    function startVisibilityMonitoring() {
        if (!getVisibilitySetting()) return;

        // Stoppe vorherige Überwachung
        stopVisibilityMonitoring();

        console.log('[WME Quick Zoom] Starte Sichtbarkeits-Überwachung...');

        // MutationObserver wie in der alten Version
        visibilityObserver = new MutationObserver((mutations) => {
            let shouldCheck = false;

            mutations.forEach((mutation) => {
                // Prüfe auf Änderungen in relevanten Bereichen
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    const removedNodes = Array.from(mutation.removedNodes);

                    const relevantChanges = [...addedNodes, ...removedNodes].some(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const element = node;
                            return element.classList && (element.classList.contains('online-editors-list') ||
                                   element.classList.contains('editor-visibility')) ||
                                   element.tagName === 'WZ-BUTTON' ||
                                   (element.querySelector && element.querySelector('.editor-visibility, wz-button, .online-editors-list'));
                        }
                        return false;
                    });

                    if (relevantChanges) shouldCheck = true;
                }

                // Prüfe auf Attribut-Änderungen
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'aria-label' ||
                     mutation.attributeName === 'title' ||
                     mutation.attributeName === 'class' ||
                     mutation.attributeName === 'name')) {

                    const target = mutation.target;
                    if (target.closest && (target.closest('.online-editors-list') ||
                        (target.classList && target.classList.contains('editor-visibility')) ||
                        target.tagName === 'WZ-BUTTON')) {
                        shouldCheck = true;
                    }
                }
            });

            if (shouldCheck) {
                setTimeout(ensureVisibility, 100); // Kurze Verzögerung für DOM-Updates
            }
        });

        // Überwache das gesamte Online-Editoren Element
        const onlineEditorsContainer = document.getElementById('online-editors');
        if (onlineEditorsContainer) {
            visibilityObserver.observe(onlineEditorsContainer, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['aria-label', 'title', 'class', 'name']
            });
        } else {
            // Fallback: Überwache den gesamten Body
            visibilityObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['aria-label', 'title', 'class', 'name']
            });
        }

        // Überprüfe alle 15 Sekunden (wie in der alten Version)
        visibilityInterval = setInterval(ensureVisibility, 15000);

        // Erste Überprüfung nach 3 Sekunden
        setTimeout(ensureVisibility, 3000);

        // Zusätzliche Überprüfung beim Fokus-Wechsel
        window.addEventListener('focus', () => {
            setTimeout(ensureVisibility, 1000);
        }, { passive: true });
    }

    async function performQuickZoom() {
        if (isZooming) {
            console.log('[WME Quick Zoom] Zoom bereits aktiv, überspringe...');
            return;
        }

        try {
            if (!window.W?.map?.olMap) {
                console.warn('[WME Quick Zoom] WME map nicht verfügbar');
                return;
            }

            isZooming = true;
            const originalZoom = W.map.olMap.getZoom();
            const targetZoom = getZoomLevel();
            
            console.log(`[WME Quick Zoom] Zooming from ${originalZoom} to ${targetZoom}`);
            W.map.olMap.zoomTo(targetZoom);

            // Promise für verzögerte Rückkehr zum ursprünglichen Zoom
            return new Promise(resolve => {
                setTimeout(() => {
                    try {
                        if (window.W?.map?.olMap) {
                            W.map.olMap.zoomTo(originalZoom);
                            console.log(`[WME Quick Zoom] Restored zoom to ${originalZoom}`);
                        }
                    } catch (error) {
                        console.error('[WME Quick Zoom] Error restoring zoom:', error);
                    } finally {
                        isZooming = false;
                        resolve();
                    }
                }, 2000);
            });

        } catch (error) {
            console.error('[WME Quick Zoom] Error in performQuickZoom:', error);
            isZooming = false;
        }
    }

    function createStyles() {
        // Prüfe ob Styles bereits existieren
        if (document.getElementById('wme-quick-zoom-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'wme-quick-zoom-styles';
        style.textContent = `
            .quick-zoom-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 10px;
            }
            .quick-zoom-slider-container {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            .quick-zoom-checkbox-container {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .quick-zoom-label {
                font-size: 12px;
                color: inherit;
            }
            .quick-zoom-slider {
                width: 100%;
            }
            .quick-zoom-floating-button {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 1000;
                background-color: #ffffff;
                border: 1px solid #cccccc;
                padding: 8px 15px;
                border-radius: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                cursor: pointer;
                font-weight: bold;
                font-family: inherit;
                font-size: 12px;
                transition: background-color 0.3s ease, box-shadow 0.3s ease;
            }
            .quick-zoom-floating-button:hover {
                background-color: #f0f0f0;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }
            .quick-zoom-floating-button:active {
                background-color: #e0e0e0;
                transform: translateY(1px);
            }
        `;
        
        document.head.appendChild(style);
    }

    async function initializeQuickZoom() {
        try {
            // Warte bis WME vollständig geladen ist
            if (!window.W?.userscripts?.registerSidebarTab) {
                console.warn('[WME Quick Zoom] WME userscripts nicht verfügbar, warte...');
                setTimeout(initializeQuickZoom, 1000);
                return;
            }

            console.log('[WME Quick Zoom] Initialisiere...');

            const i18n = translations[getLanguage()];
            
            // Erstelle CSS-Styles
            createStyles();

            // Registriere Sidebar-Tab
            const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("quick-zoom-script");
            tabLabel.innerText = 'QZ';
            tabLabel.title = i18n.buttonText;

            // Erstelle Container
            const container = document.createElement('div');
            container.className = 'quick-zoom-container';

            // Sidebar Button
            const sidebarButton = document.createElement('button');
            sidebarButton.className = 'waze-btn waze-btn-small';
            sidebarButton.innerText = i18n.buttonText;
            sidebarButton.title = `${i18n.buttonTooltip} ${getZoomLevel()}`;
            sidebarButton.type = 'button';

            // Floating Button
            const floatingButton = document.createElement('button');
            floatingButton.innerText = 'QZ';
            floatingButton.title = `${i18n.buttonTooltip} ${getZoomLevel()}`;
            floatingButton.className = 'quick-zoom-floating-button';
            floatingButton.type = 'button';

            // Slider Container
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'quick-zoom-slider-container';

            const sliderLabel = document.createElement('label');
            sliderLabel.textContent = i18n.sliderLabel;
            sliderLabel.className = 'quick-zoom-label';

            const sliderValue = document.createElement('span');
            sliderValue.className = 'quick-zoom-label';
            sliderValue.textContent = getZoomLevel();

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '4';
            slider.max = '12';
            slider.value = getZoomLevel();
            slider.className = 'quick-zoom-slider';

            // Event Handlers
            const zoomHandler = (event) => {
                event.preventDefault();
                if (!isZooming) {
                    performQuickZoom().catch(error => {
                        console.error('[WME Quick Zoom] Zoom-Fehler:', error);
                    });
                }
            };

            const sliderHandler = (event) => {
                const value = event.target.value;
                sliderValue.textContent = value;
                setZoomLevel(value);
                const tooltip = `${i18n.buttonTooltip} ${value}`;
                sidebarButton.title = tooltip;
                floatingButton.title = tooltip;
            };

            // Event Listeners hinzufügen
            slider.addEventListener('input', sliderHandler, { passive: true });
            sidebarButton.addEventListener('click', zoomHandler);
            floatingButton.addEventListener('click', zoomHandler);

            // Auto-Zoom Checkbox
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'quick-zoom-checkbox-container';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'auto-quick-zoom-' + Date.now();
            checkbox.checked = getAutoZoomSetting();

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = i18n.autoLoadLabel;
            label.className = 'quick-zoom-label';

            checkbox.addEventListener('change', (event) => {
                setAutoZoomSetting(event.target.checked);
            }, { passive: true });

            // Visibility Checkbox
            const visibilityCheckboxContainer = document.createElement('div');
            visibilityCheckboxContainer.className = 'quick-zoom-checkbox-container';

            const visibilityCheckbox = document.createElement('input');
            visibilityCheckbox.type = 'checkbox';
            visibilityCheckbox.id = 'auto-visibility-' + Date.now();
            visibilityCheckbox.checked = getVisibilitySetting();

            const visibilityLabel = document.createElement('label');
            visibilityLabel.htmlFor = visibilityCheckbox.id;
            visibilityLabel.textContent = i18n.visibilityLabel;
            visibilityLabel.className = 'quick-zoom-label';

            visibilityCheckbox.addEventListener('change', (event) => {
                setVisibilitySetting(event.target.checked);
                if (event.target.checked) {
                    setTimeout(() => {
                        startVisibilityMonitoring();
                        ensureVisibility();
                    }, 500);
                } else {
                    stopVisibilityMonitoring();
                }
            }, { passive: true });

            // DOM aufbauen
            sliderContainer.appendChild(sliderLabel);
            sliderContainer.appendChild(slider);
            sliderContainer.appendChild(sliderValue);
            
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            
            visibilityCheckboxContainer.appendChild(visibilityCheckbox);
            visibilityCheckboxContainer.appendChild(visibilityLabel);
            
            container.appendChild(sidebarButton);
            container.appendChild(sliderContainer);
            container.appendChild(checkboxContainer);
            container.appendChild(visibilityCheckboxContainer);
            
            tabPane.appendChild(container);
            document.body.appendChild(floatingButton);

            // Warte bis Tab verbunden ist
            await W.userscripts.waitForElementConnected(tabPane);

            // Auto-Zoom ausführen wenn aktiviert
            if (getAutoZoomSetting()) {
                setTimeout(() => {
                    performQuickZoom().catch(error => {
                        console.error('[WME Quick Zoom] Auto-Zoom Fehler:', error);
                    });
                }, 2000);
            }

            // Visibility Monitoring STANDARDMÄSSIG starten (wie in der ursprünglichen Version)
            setTimeout(() => {
                console.log('[WME Quick Zoom] Starte Standard-Visibility-Monitoring...');
                startVisibilityMonitoring();
            }, 1000);

            console.log('[WME Quick Zoom] Erfolgreich initialisiert');

        } catch (error) {
            console.error('[WME Quick Zoom] Initialisierungs-Fehler:', error);
        }
    }

    // Cleanup beim Verlassen der Seite
    window.addEventListener('beforeunload', () => {
        stopVisibilityMonitoring();
    }, { passive: true });

    // Verbesserte Initialisierung
    function initialize() {
        try {
            if (window.W?.userscripts?.state?.isReady) {
                initializeQuickZoom();
            } else if (window.W?.userscripts) {
                document.addEventListener("wme-ready", initializeQuickZoom, { 
                    once: true, 
                    passive: true 
                });
            } else {
                // Warte auf WME
                let attempts = 0;
                const maxAttempts = 60; // 30 Sekunden maximum
                
                const checkWME = () => {
                    attempts++;
                    
                    if (window.W?.userscripts) {
                        if (window.W.userscripts.state?.isReady) {
                            initializeQuickZoom();
                        } else {
                            document.addEventListener("wme-ready", initializeQuickZoom, { 
                                once: true, 
                                passive: true 
                            });
                        }
                    } else if (attempts < maxAttempts) {
                        setTimeout(checkWME, 500);
                    } else {
                        console.error('[WME Quick Zoom] WME konnte nicht geladen werden nach', maxAttempts * 500, 'ms');
                    }
                };
                
                checkWME();
            }
        } catch (error) {
            console.error('[WME Quick Zoom] Initialisierungs-Setup-Fehler:', error);
        }
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { 
            once: true, 
            passive: true 
        });
    } else {
        initialize();
    }

})();