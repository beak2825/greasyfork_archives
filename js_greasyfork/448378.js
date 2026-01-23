// ==UserScript==
// @name WME Permalink to several Maps DACH
// @description WME PTSM für Deutschland Österreich Schweiz
// @namespace https://greasyfork.org/de/users/863740-horst-wittlich
// @version 2025.10.23
// @match https://*.waze.com/editor*
// @match https://*.waze.com/*/editor*
// @icon https://i.ibb.co/ckSvk59/waze-icon.png
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448378/WME%20Permalink%20to%20several%20Maps%20DACH.user.js
// @updateURL https://update.greasyfork.org/scripts/448378/WME%20Permalink%20to%20several%20Maps%20DACH.meta.js
// ==/UserScript==

/* global OpenLayers, W, proj4 */

var ptsmVersion = '2025.07.16';
var ptsmInitialized = false;
var ptsmUpdateKey = 'wme-ptsm-update-shown-' + ptsmVersion;

// Einstellungen laden/speichern - MUSS VOR anderen Funktionen definiert werden
function loadSettings() {
    try {
        const saved = localStorage.getItem('wme-ptsm-settings');
        return saved ? JSON.parse(saved) : { freePosition: false };
    } catch (e) {
        return { freePosition: false };
    }
}

function saveSettings(settings) {
    try {
        localStorage.setItem('wme-ptsm-settings', JSON.stringify(settings));
    } catch (e) {
        console.log('PTSM: localStorage not available');
    }
}

function saveDropdownStates() {
    const states = {};
    document.querySelectorAll('.ptsm-category').forEach(category => {
        const className = category.className.match(/ptsm-category-(\w+)/);
        if (className) {
            states[className[1]] = category.classList.contains('open');
        }
    });
    try {
        localStorage.setItem('wme-ptsm-dropdown-states', JSON.stringify(states));
    } catch (e) {
        console.log('PTSM: localStorage not available');
    }
}

function loadDropdownStates() {
    try {
        const saved = localStorage.getItem('wme-ptsm-dropdown-states');
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        return {};
    }
}

function saveCompactMode(isCompact) {
    try {
        localStorage.setItem('wme-ptsm-compact-mode', isCompact ? 'true' : 'false');
    } catch (e) {
        console.log('PTSM: localStorage not available');
    }
}

function loadCompactMode() {
    try {
        const saved = localStorage.getItem('wme-ptsm-compact-mode');
        return saved === 'true';
    } catch (e) {
        return false;
    }
}

// HYBRIDE Drag & Drop Funktionalität - Desktop-weit ODER Container-intern
function enableDragAndDrop() {
    const container = document.querySelector('.ptsm-container');
    const divs = ['.ptsm-category-allgem', '.ptsm-category-baustell', '.ptsm-category-blitzer', '.ptsm-category-bilder', '.ptsm-category-geoportal', '.ptsm-category-misc', '.ptsm-category-settings'];

    // Gespeicherte Desktop-Positionen laden
    function loadPositions() {
        try {
            const saved = localStorage.getItem('wme-ptsm-drag-positions');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }

    // Desktop-Positionen speichern
    function savePositions() {
        const positions = {};
        divs.forEach(selector => {
            const element = document.querySelector(selector);
            if (element && element.style.position === 'fixed') {
                positions[selector] = {
                    left: element.style.left,
                    top: element.style.top,
                    zIndex: element.style.zIndex
                };
            }
        });
        try {
            localStorage.setItem('wme-ptsm-drag-positions', JSON.stringify(positions));
        } catch (e) {
            console.log('PTSM: localStorage not available');
        }
    }

    // Container-Reihenfolge speichern
    function saveCategoryOrder() {
        if (!container) return;

        const order = Array.from(container.querySelectorAll('.ptsm-category')).map(cat => {
            const className = cat.className.match(/ptsm-category-(\w+)/);
            return className ? className[1] : null;
        }).filter(Boolean);

        try {
            localStorage.setItem('wme-ptsm-category-order', JSON.stringify(order));
        } catch (e) {
            console.log('PTSM: localStorage not available');
        }
    }

    // Gespeicherte Desktop-Positionen wiederherstellen
    function restorePositions() {
        const positions = loadPositions();
        Object.keys(positions).forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                const pos = positions[selector];
                element.style.position = 'fixed';
                element.style.left = pos.left;
                element.style.top = pos.top;
                element.style.zIndex = pos.zIndex || '10000';
                element.style.width = '280px';
                element.style.maxWidth = '280px';

                // Element an document.body anhängen für Tab-Unabhängigkeit
                if (element.parentElement !== document.body) {
                    element.setAttribute('data-original-parent', 'container');
                    document.body.appendChild(element);
                }
            }
        });
    }

    divs.forEach(selector => {
        const element = document.querySelector(selector);
        if (!element) return;

        const header = element.querySelector('.ptsm-category-header');
        if (!header || header.hasAttribute('data-drag-enabled')) return;

        header.setAttribute('data-drag-enabled', 'true');

        let isDragging = false;
        let dragStarted = false;
        let startX, startY, startTime;
        let originalPosition = { left: '', top: '', position: '', width: '', zIndex: '' };
        let placeholder = null;
        let clickBlocked = false; // Neue Variable für Click-Blockierung

        // Ursprüngliche Position merken
        function saveOriginalPosition() {
            originalPosition = {
                left: element.style.left,
                top: element.style.top,
                position: element.style.position,
                width: element.style.width,
                zIndex: element.style.zIndex
            };
        }

        header.addEventListener('mousedown', function(e) {
            // Nur Linksklick
            if (e.button !== 0) return;

            isDragging = true;
            dragStarted = false;
            clickBlocked = false;
            startX = e.clientX;
            startY = e.clientY;
            startTime = Date.now();

            saveOriginalPosition();

            // WICHTIG: preventDefault() IMMER bei mousedown um Click-Konflikte zu vermeiden
            e.preventDefault();
            e.stopPropagation();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;

            const deltaX = Math.abs(e.clientX - startX);
            const deltaY = Math.abs(e.clientY - startY);
            const deltaTime = Date.now() - startTime;

            // Drag erst nach Mindestbewegung oder Zeit starten
            if (!dragStarted && (deltaX > 5 || deltaY > 5 || deltaTime > 200)) {
                dragStarted = true;
                clickBlocked = true; // Click blockieren sobald Drag gestartet wird

                const settings = loadSettings();

                if (settings.freePosition) {
                    // DESKTOP-WEITES DRAG
                    const rect = element.getBoundingClientRect();
                    element.style.position = 'fixed';
                    element.style.left = rect.left + 'px';
                    element.style.top = rect.top + 'px';
                    element.style.zIndex = '10000';
                    element.style.width = '280px';
                    element.style.maxWidth = '280px';
                    element.style.opacity = '0.8';
                    element.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                    element.style.transform = 'rotate(1deg)';

                    // Element an document.body anhängen für Tab-Unabhängigkeit
                    if (element.parentElement !== document.body) {
                        element.setAttribute('data-original-parent', 'container');
                        document.body.appendChild(element);
                    }
                } else {
                    // CONTAINER-INTERNES DRAG
                    if (!container) return;

                    // Element aus normalem Flow nehmen
                    const rect = element.getBoundingClientRect();

                    // Placeholder erstellen
                    placeholder = document.createElement('div');
                    placeholder.className = 'ptsm-drag-placeholder';
                    placeholder.style.cssText = `
                        height: ${element.offsetHeight}px;
                        background: #f0f0f0;
                        border: 2px dashed #ccc;
                        border-radius: 6px;
                        margin-bottom: 8px;
                        opacity: 0.5;
                        transition: all 0.2s ease;
                    `;

                    // Container-Drag-Styling
                    element.style.position = 'fixed';
                    element.style.left = rect.left + 'px';
                    element.style.top = rect.top + 'px';
                    element.style.width = '280px';
                    element.style.maxWidth = '280px';
                    element.style.opacity = '0.8';
                    element.style.transform = 'rotate(1deg)';
                    element.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                    element.style.zIndex = '10000';
                    element.style.pointerEvents = 'none';

                    // Placeholder an der ursprünglichen Position einfügen
                    element.parentNode.insertBefore(placeholder, element);
                }

                // Header für Drag-Zeit blockieren
                header.style.pointerEvents = 'none';
            }

            if (dragStarted) {
                const settings = loadSettings();

                if (settings.freePosition) {
                    // DESKTOP-WEITE BEWEGUNG
                    const newLeft = Math.max(0, Math.min(e.clientX - startX + parseInt(element.style.left), window.innerWidth - 300));
                    const newTop = Math.max(0, Math.min(e.clientY - startY + parseInt(element.style.top), window.innerHeight - 100));

                    element.style.left = newLeft + 'px';
                    element.style.top = newTop + 'px';

                    // Update startX/Y für smooth dragging
                    startX = e.clientX;
                    startY = e.clientY;
                } else {
                    // CONTAINER-INTERNE REORDERING
                    if (!container || !placeholder) return;

                    // Vertikale Mausbewegung für bessere Sortierung
                    const containerRect = container.getBoundingClientRect();
                    const mouseY = e.clientY;

                    // Alle Kategorien außer dem gezogenen Element
                    const allCategories = Array.from(container.querySelectorAll('.ptsm-category')).filter(cat => cat !== element);

                    let insertBefore = null;
                    let minDistance = Infinity;

                    // Finde das Element mit der geringsten Y-Distanz oberhalb der Maus
                    for (let otherCategory of allCategories) {
                        if (otherCategory === placeholder) continue;

                        const otherRect = otherCategory.getBoundingClientRect();
                        const otherCenterY = otherRect.top + otherRect.height / 2;

                        if (mouseY < otherCenterY) {
                            const distance = otherCenterY - mouseY;
                            if (distance < minDistance) {
                                minDistance = distance;
                                insertBefore = otherCategory;
                            }
                        }
                    }

                    // Placeholder neu positionieren
                    if (insertBefore) {
                        container.insertBefore(placeholder, insertBefore);
                    } else {
                        // Ans Ende setzen wenn keine Kategorie oberhalb gefunden
                        container.appendChild(placeholder);
                    }

                    // Element visuell an Mausposition folgen lassen (nur Y-Achse im Container)
                    const constrainedY = Math.max(containerRect.top, Math.min(mouseY - 20, containerRect.bottom - 50));
                    element.style.top = constrainedY + 'px';
                }
            }
        });

        document.addEventListener('mouseup', function(e) {
            if (!isDragging) return;

            isDragging = false;

            if (dragStarted) {
                dragStarted = false;

                const settings = loadSettings();

                if (settings.freePosition) {
                    // DESKTOP-DRAG beenden
                    element.style.opacity = '1';
                    element.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
                    element.style.transform = 'none';
                    element.style.zIndex = '10000'; // Höher für Desktop-Modus

                    // Element dauerhaft an document.body lassen für Tab-Unabhängigkeit
                    if (element.parentElement !== document.body) {
                        element.setAttribute('data-original-parent', 'container');
                        document.body.appendChild(element);
                    }

                    // Desktop-Position speichern
                    savePositions();
                } else {
                    // CONTAINER-DRAG beenden
                    if (placeholder && placeholder.parentNode && container) {
                        // Element an Placeholder-Position einfügen
                        placeholder.parentNode.insertBefore(element, placeholder);
                        placeholder.remove();

                        // Container-Styling KOMPLETT zurücksetzen
                        element.style.position = '';
                        element.style.left = '';
                        element.style.top = '';
                        element.style.width = '';
                        element.style.maxWidth = '';
                        element.style.opacity = '';
                        element.style.transform = '';
                        element.style.boxShadow = '';
                        element.style.zIndex = '';
                        element.style.pointerEvents = '';

                        // Container-Reihenfolge speichern
                        saveCategoryOrder();
                    } else {
                        // Fallback: Element zurück zur ursprünglichen Position
                        element.style.position = originalPosition.position;
                        element.style.left = originalPosition.left;
                        element.style.top = originalPosition.top;
                        element.style.width = originalPosition.width;
                        element.style.zIndex = originalPosition.zIndex;
                        element.style.opacity = '';
                        element.style.transform = '';
                        element.style.boxShadow = '';
                        element.style.pointerEvents = '';

                        if (placeholder && placeholder.parentNode) {
                            placeholder.remove();
                        }
                    }
                }

                placeholder = null;

                // Header wieder aktivieren (mit Verzögerung um Click zu blockieren)
                setTimeout(() => {
                    header.style.pointerEvents = '';
                    // Click-Blockierung nach kurzer Zeit aufheben
                    setTimeout(() => {
                        clickBlocked = false;
                    }, 100);
                }, 50);

                // Event verhindern
                e.preventDefault();
                e.stopPropagation();
            } else {
                // Kein Drag - ursprüngliche Position wiederherstellen + Cleanup
                element.style.left = originalPosition.left;
                element.style.top = originalPosition.top;
                element.style.position = originalPosition.position;
                element.style.width = originalPosition.width;
                element.style.zIndex = originalPosition.zIndex;
                element.style.opacity = '';
                element.style.transform = '';
                element.style.boxShadow = '';
                element.style.pointerEvents = '';

                // Placeholder entfernen falls vorhanden
                if (placeholder && placeholder.parentNode) {
                    placeholder.remove();
                    placeholder = null;
                }

                // Header wieder aktivieren
                header.style.pointerEvents = '';

                // Kurze Verzögerung bevor Click wieder erlaubt wird
                setTimeout(() => {
                    clickBlocked = false;
                }, 10);
            }
        });

        // NEUER Click Event Handler mit Blockierung-Check
        header.addEventListener('click', function(e) {
            // Click blockieren wenn gerade gedraggt wurde oder wird
            if (clickBlocked || isDragging || dragStarted) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }

            // Normaler Toggle nur wenn kein Drag
            const category = element;
            category.classList.toggle('open');
            setTimeout(saveDropdownStates, 100);
        }, true); // useCapture = true für höhere Priorität

// Doppelklick zum Zurücksetzen (nur bei Desktop-Modus)
header.addEventListener('dblclick', function(e) {
    // Click blockieren
    e.preventDefault();
    e.stopPropagation();

    const settings = loadSettings();

    if (settings.freePosition) {
        // Desktop-Position zurücksetzen - KORREKTUR
        element.style.position = '';
        element.style.left = '';
        element.style.top = '';
        element.style.zIndex = '';
        element.style.width = '';
        element.style.maxWidth = '';
        element.style.transform = '';
        element.style.opacity = '';
        element.style.boxShadow = '';

        // WICHTIG: Element zurück in den ursprünglichen Container bringen
        const container = document.querySelector('.ptsm-container');
        if (container && element.parentElement !== container) {
            // Element wieder in Container einfügen
            container.appendChild(element);

            // Falls es eine gespeicherte Reihenfolge gibt, diese wiederherstellen
            setTimeout(() => {
                applyCategoryOrder();
            }, 50);
        }

        // Position aus localStorage entfernen
        const positions = loadPositions();
        delete positions[selector];
        try {
            localStorage.setItem('wme-ptsm-drag-positions', JSON.stringify(positions));
        } catch (e) {
            console.log('PTSM: localStorage not available');
        }
    }
});

        // Cursor-Stil setzen
        function updateCursor() {
            const settings = loadSettings();
            if (settings.freePosition) {
                header.style.cursor = 'move';
                header.title = 'Ziehen zum Verschieben (Doppelklick zum Zurücksetzen)';
            } else {
                header.style.cursor = 'move';
                header.title = 'Ziehen zum Umsortieren';
            }
        }

        updateCursor();

        // Event Listener für Settings-Änderungen
        document.addEventListener('ptsm-settings-changed', updateCursor);
    });

    // Gespeicherte Desktop-Positionen beim Start wiederherstellen (nur wenn freie Position aktiv)
    const settings = loadSettings();
    if (settings.freePosition) {
        setTimeout(restorePositions, 100);
    }
}

// Kategorie-Reihenfolge speichern und laden
function saveCategoryOrder() {
    const container = document.querySelector('.ptsm-container');
    if (!container) return;

    const order = Array.from(container.querySelectorAll('.ptsm-category')).map(cat => {
        const className = cat.className.match(/ptsm-category-(\w+)/);
        return className ? className[1] : null;
    }).filter(Boolean);

    try {
        localStorage.setItem('wme-ptsm-category-order', JSON.stringify(order));
    } catch (e) {
        console.log('PTSM: localStorage not available');
    }
}

function loadCategoryOrder() {
    try {
        const saved = localStorage.getItem('wme-ptsm-category-order');
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
}

function applyCategoryOrder() {
    const savedOrder = loadCategoryOrder();
    if (!savedOrder) return;

    const container = document.querySelector('.ptsm-container');
    if (!container) return;

    // Kategorien nach gespeicherter Reihenfolge sortieren
    savedOrder.forEach(categoryKey => {
        const category = container.querySelector('.ptsm-category-' + categoryKey);
        if (category) {
            container.appendChild(category);
        }
    });
}

function showUpdatePopup() {
    try {
        // Prüfen ob Update-Info bereits angezeigt wurde
        if (localStorage.getItem(ptsmUpdateKey) === 'true') {
            return;
        }
    } catch (e) {
        // Falls localStorage nicht verfügbar, trotzdem anzeigen
    }

    // Popup erstellen
    var overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    `;

    var popup = document.createElement('div');
    popup.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 400px;
        margin: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        text-align: center;
        position: relative;
    `;

    popup.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 16px;">🎉 PTSM DACH Update! 🗺️</div>
        <div style="font-size: 18px; font-weight: bold; color: #007bff; margin-bottom: 16px;">
            Version ${ptsmVersion}
        </div>
        <div style="text-align: left; margin-bottom: 20px; line-height: 1.6;">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 12px; color: #333;">
                ✨ Was ist neu: ✨
            </div>
            <div style="margin-bottom: 8px;">
                📍 <strong>Neu Drag & Drop Funktionalität</strong><br>
Sortiere und Löse die Buttons so wie du sie brauchst. Du kannst sie nun auch auf dein Desktop ziehen.<br><br>
🗺️ <strong>Geoportal Update</strong><br>
Bayern Info und Atlas klappen nun noch besser. Bayern Info zeigt nun wieder die Baustellen der nächsten 4 Wochen an als vorschau an.
            </div>
        </div>
        <button id="ptsm-close-popup" style="
            background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 2px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        ">🚀 Los geht's!
        </button>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Close button event
    var closeBtn = popup.querySelector('#ptsm-close-popup');
    closeBtn.addEventListener('click', function() {
        overlay.remove();
        try {
            localStorage.setItem(ptsmUpdateKey, 'true');
        } catch (e) {
            // localStorage not available
        }
    });

    closeBtn.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
    });

    closeBtn.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });

    // Schließen bei Klick auf Overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
            try {
                localStorage.setItem(ptsmUpdateKey, 'true');
            } catch (e) {
                // localStorage not available
            }
        }
    });
}

function getCenterZoom() {
    var map = W.map.getOLMap();
    var zoom = map.getZoom();
    var center = map.getCenter().transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
    center.zoom = zoom;
    return center;
}

function createCategory(title, className, defaultOpen = false) {
    const savedStates = loadDropdownStates();
    const categoryKey = className.replace('ptsm-category-', '');
    const isOpen = savedStates.hasOwnProperty(categoryKey) ? savedStates[categoryKey] : defaultOpen;

    var category = document.createElement('div');
    category.className = 'ptsm-category ' + className + (isOpen ? ' open' : '');

    var header = document.createElement('button');
    header.className = 'ptsm-category-header';
    header.innerHTML = title + '<div class="ptsm-dropdown-arrow"></div>';

    var content = document.createElement('div');
    content.className = 'ptsm-category-content';

    // ENTFERNT: Der alte click handler wird durch den neuen in enableDragAndDrop ersetzt

    category.appendChild(header);
    category.appendChild(content);

    return { category, content };
}

function createMapButton(text, className, clickHandler) {
    var btn = document.createElement('button');
    btn.textContent = text;
    btn.className = 'ptsm-map-btn ' + className;
    btn.addEventListener('click', clickHandler);
    return btn;
}

function createCompactButton() {
    var btn = document.createElement('button');
    btn.className = 'ptsm-compact-btn';
    btn.innerHTML = '🔧 Kompakt-Modus';

    const isCompact = loadCompactMode();
    if (isCompact) {
        btn.innerHTML = '🔧 Normal-Modus';
        btn.classList.add('active');
    }

    btn.addEventListener('click', function() {
        const container = document.querySelector('.ptsm-container');
        const isCurrentlyCompact = container.classList.contains('compact');

        if (isCurrentlyCompact) {
            container.classList.remove('compact');
            btn.innerHTML = '🔧 Kompakt-Modus';
            btn.classList.remove('active');
            saveCompactMode(false);
        } else {
            container.classList.add('compact');
            btn.innerHTML = '🔧 Normal-Modus';
            btn.classList.add('active');
            saveCompactMode(true);
        }
    });

    return btn;
}

function addButtons() {
    if (ptsmInitialized) {
        return;
    }

    if (!document.getElementById('user-info')) {
        setTimeout(addButtons, 500);
        return;
    }

    if (!W.loginManager.user) {
        if (!ptsmInitialized) {
            W.loginManager.events.register('login', null, function() {
                if (!ptsmInitialized) addButtons();
            });
            W.loginManager.events.register('loginStatus', null, function() {
                if (!ptsmInitialized) addButtons();
            });
        }
        if (!W.loginManager.user) {
            return;
        }
    }

    ptsmInitialized = true;

    if (typeof proj4 === "undefined") {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js';
        document.head.appendChild(script);
    }

    // Add CSS
    var style = document.createElement('style');
    style.textContent = `
        .ptsm-container {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            padding: 8px;
            background: #fff;
            font-size: 12px;
            position: relative;
            overflow: hidden;
        }

        .ptsm-category {
            margin-bottom: 8px;
            border-radius: 6px;
            overflow: hidden;
            background: #fff;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08);
            border: 1px solid #e1e5e9;
            position: relative;
        }

        .ptsm-category-header {
            width: 100%;
            padding: 8px 12px;
            background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
            color: white;
            border: none;
            cursor: pointer;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.2s ease;
            user-select: none;
        }

        .ptsm-category-header:hover {
            background: linear-gradient(135deg, #5a6268 0%, #343a40 100%);
        }

        .ptsm-dropdown-arrow {
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 6px solid white;
            transition: transform 0.2s ease;
        }

        .ptsm-category.open .ptsm-dropdown-arrow {
            transform: rotate(180deg);
        }

        .ptsm-category-content {
            max-height: 0;
            overflow: hidden;
            padding: 0 8px;
            transition: max-height 0.3s ease, padding 0.2s ease;
        }

        .ptsm-category.open .ptsm-category-content {
            max-height: 500px;
            padding: 8px;
        }

        .ptsm-map-btn {
            width: calc(33.333% - 4px);
            height: 28px;
            margin: 2px;
            padding: 4px 6px 4px 24px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
            color: #495057;
            cursor: pointer;
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: flex-start;
            transition: all 0.15s ease;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .ptsm-map-btn::before {
            content: '';
            position: absolute;
            left: 4px;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            flex-shrink: 0;
        }

        .ptsm-map-btn:hover {
            transform: translateY(-1px);
            background: linear-gradient(145deg, #ffffff 0%, #f1f3f4 100%);
            border-color: #007bff;
            color: #0056b3;
            box-shadow: 0 2px 8px rgba(0, 123, 255, 0.12);
        }

        .ptsm-compact-btn {
            width: calc(100% - 4px);
            height: 32px;
            margin: 2px;
            padding: 8px 12px;
            background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
            border: none;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s ease;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .ptsm-compact-btn:hover {
            transform: translateY(-1px);
            background: linear-gradient(135deg, #1e7e34 0%, #155724 100%);
            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.25);
        }

        .ptsm-compact-btn.active {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }

        .ptsm-compact-btn.active:hover {
            background: linear-gradient(135deg, #c82333 0%, #a02834 100%);
            box-shadow: 0 2px 8px rgba(220, 53, 69, 0.25);
        }

        /* Kompakt-Modus Styles */
        .ptsm-container.compact .ptsm-category {
            margin-bottom: 4px;
        }

        .ptsm-container.compact .ptsm-category-header {
            padding: 6px 10px;
            font-size: 10px;
        }

        .ptsm-container.compact .ptsm-category.open .ptsm-category-content {
            padding: 4px;
        }

        .ptsm-container.compact .ptsm-map-btn {
            width: calc(33.333% - 3px);
            height: 24px;
            margin: 1.5px;
            padding: 3px 5px 3px 20px;
            font-size: 9px;
        }

        .ptsm-container.compact .ptsm-map-btn::before {
            width: 10px;
            height: 10px;
            left: 3px;
        }

        .ptsm-container.compact .ptsm-compact-btn {
            height: 28px;
            font-size: 10px;
            padding: 6px 10px;
        }

        /* Drag Placeholder */
        .ptsm-drag-placeholder {
            background: #f0f0f0;
            border: 2px dashed #ccc;
            border-radius: 6px;
            margin-bottom: 8px;
            opacity: 0.5;
        }

        /* Category colors */
        .ptsm-category-allgem .ptsm-category-header { background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); }
        .ptsm-category-allgem .ptsm-category-header:hover { background: linear-gradient(135deg, #0056b3 0%, #004085 100%); }
        .ptsm-category-baustell .ptsm-category-header { background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); }
        .ptsm-category-baustell .ptsm-category-header:hover { background: linear-gradient(135deg, #1e7e34 0%, #155724 100%); }
        .ptsm-category-blitzer .ptsm-category-header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); }
        .ptsm-category-blitzer .ptsm-category-header:hover { background: linear-gradient(135deg, #c82333 0%, #a02834 100%); }
        .ptsm-category-bilder .ptsm-category-header { background: linear-gradient(135deg, #17a2b8 0%, #138496 100%); }
        .ptsm-category-bilder .ptsm-category-header:hover { background: linear-gradient(135deg, #138496 0%, #0f6674 100%); }
        .ptsm-category-geoportal .ptsm-category-header { background: linear-gradient(135deg, #6f42c1 0%, #59359a 100%); }
        .ptsm-category-geoportal .ptsm-category-header:hover { background: linear-gradient(135deg, #59359a 0%, #4c2c85 100%); }
        .ptsm-category-misc .ptsm-category-header { background: linear-gradient(135deg, #fd7e14 0%, #e65100 100%); }
        .ptsm-category-misc .ptsm-category-header:hover { background: linear-gradient(135deg, #e65100 0%, #bf360c 100%); }
        .ptsm-category-settings .ptsm-category-header { background: linear-gradient(135deg, #6c757d 0%, #495057 100%); }
        .ptsm-category-settings .ptsm-category-header:hover { background: linear-gradient(135deg, #5a6268 0%, #343a40 100%); }

        /* Icons */
        .ptsm-google::before { background-image: url(https://i.ibb.co/d0zx6Pdt/google-maps.png); }
        .ptsm-f4map::before { background-image: url(https://i.ibb.co/5WxjKkLp/F-Logo.png); }
        .ptsm-apple::before { background-image: url(https://i.ibb.co/WsH15zC/Apple-Jetzt.png); }
        .ptsm-bing::before { background-image: url(https://i.ibb.co/0LF74p6/bing.png); }
        .ptsm-nrw::before { background-image: url(https://i.ibb.co/37q7H37/nrw.png); }
        .ptsm-osm::before { background-image: url(https://i.ibb.co/20wtGrsL/osm.png); }
        .ptsm-autobahn::before { background-image: url(https://i.ibb.co/2Y3pT8v2/Autobahn-Logo.png); }
        .ptsm-poi-karte::before { background-image: url(https://i.ibb.co/nMRSSKKp/POI-Karte.jpg); }
        .ptsm-poi-base::before { background-image: url(https://i.ibb.co/xS7vJQr8/POI-Base.jpg); }
        .ptsm-viamichelin::before { background-image: url(https://i.ibb.co/RTzJP87C/viamichelin.png); }
        .ptsm-here::before { background-image: url(https://i.ibb.co/MC9JF7T/h-logo.png); }
        .ptsm-mapillary::before { background-image: url(https://i.ibb.co/JWkZnh0X/mapillary.png); }
        .ptsm-osbrowser::before { background-image: url(https://i.ibb.co/RdQSgsY/osb.png); }
        .ptsm-mappy::before { background-image: url(https://i.ibb.co/wrhH7H95/mappy.png); }
        .ptsm-blitzer::before { background-image: url(https://i.ibb.co/gVKMwKS/blitzer.png); }
        .ptsm-bayernatlas::before { background-image: url(https://i.ibb.co/KxnBpv7J/bayernatlas.png); }
        .ptsm-tomtom::before { background-image: url(https://i.ibb.co/hDq5bys/tomtom-icon2.png); }
        .ptsm-basemap-de::before { background-image: url(https://i.ibb.co/V3jJJrb/de-map.png); }
        .ptsm-reporting::before { background-image: url(https://i.ibb.co/rZb76j2/pin.png); }
        .ptsm-kartaview::before { background-image: url(https://i.ibb.co/xgnTMFf/kartaview.png); }
        .ptsm-bayerninfo::before { background-image: url(https://i.ibb.co/R0K3SSs/bayerninfo.png); }
        .ptsm-timonline::before { background-image: url(https://i.ibb.co/bPJ4qRy/das-da2.png); }
        .ptsm-geoadmin::before { background-image: url(https://i.ibb.co/Np5chv4/CH-Icon-20.png); }
        .ptsm-basemap-at::before { background-image: url(https://i.ibb.co/MCKhDSH/AT-Icon.png); }
        .ptsm-adac::before { background-image: url(https://i.ibb.co/6YsGCFy/adac.png); }
        .ptsm-here-edit::before { background-image: url(https://i.ibb.co/VghMgy8/here.png); }
        .ptsm-umsehen::before { background-image: url(https://i.ibb.co/XYqjkYX/umsehen-icon.png); }
        .ptsm-hackintosh::before { background-image: url(https://i.ibb.co/8xP5RyC/Hackintosh.png); }
        .ptsm-archive::before { background-image: url(https://i.ibb.co/QHpvd85/Das-Logo.png); }
        .ptsm-w3w::before { background-image: url('https://i.ibb.co/6R0Lggmz/W3S-Logo.png'); }

        .ptsm-state-info {
            font-size: 9px;
            color: #6c757d;
            font-style: italic;
            text-align: center;
            margin-top: 6px;
            margin-bottom: 4px;
        }

        .ptsm-warning {
            background: #fff8e1;
            border: 1px solid #ffcc02;
            border-radius: 4px;
            padding: 8px;
            margin-top: 8px;
            margin-bottom: 8px;
            display: flex;
            align-items: flex-start;
        }

        .ptsm-warning .w-icon {
            font-size: 14px;
            color: #f57c00;
            margin-right: 6px;
            flex-shrink: 0;
        }

        .ptsm-warning-text {
            font-size: 9px;
            color: #e65100;
            line-height: 1.3;
        }

        @media (max-width: 768px) {
            .ptsm-map-btn { width: calc(50% - 4px); }
        }
        @media (max-width: 480px) {
            .ptsm-map-btn { width: calc(100% - 4px); }
        }
    `;
    document.head.appendChild(style);

    // Create all map buttons
    var btn1 = createMapButton('Google', 'ptsm-google', () => {
        var cz = getCenterZoom();
        // Bessere Google Maps Zoom-Level Umrechnung
        var googleZoom;
        if (cz.zoom >= 20) googleZoom = 19;      // Sehr nah
        else if (cz.zoom >= 18) googleZoom = 17; // Nah
        else if (cz.zoom >= 16) googleZoom = 15; // Mittel-nah
        else if (cz.zoom >= 14) googleZoom = 13; // Mittel
        else if (cz.zoom >= 12) googleZoom = 11; // Mittel-weit
        else if (cz.zoom >= 10) googleZoom = 9;  // Weit
        else googleZoom = Math.max(1, cz.zoom - 2); // Sehr weit

        window.open('https://www.google.com/maps/@' + cz.lat + ',' + cz.lon + ',' + googleZoom + 'z/data=!5m1!1e1', '_blank');
    });

    var btn2 = createMapButton('Bing', 'ptsm-bing', () => {
        var cz = getCenterZoom();
        cz.zoom -= 1;
        window.open('https://www.bing.com/maps/traffic?cp=' + cz.lat + '~' + cz.lon + '&lvl=' + cz.zoom, '_blank');
    });

    var btn3 = createMapButton('Ver. NRW', 'ptsm-nrw', () => {
        var cz = getCenterZoom();
        window.open('https://www.verkehr.nrw/?center=' + cz.lat + ',' + cz.lon + '&zoom=' + cz.zoom + '&layer=Verkehrslage,Baustellen,Haltestellen,Parken,Webcams,Verkehrsmeldungen,ELadesaeulen,Tankstellen&highlightRoute=false', '_blank');
    });

    var btn3a = createMapButton('OSM', 'ptsm-osm', () => {
        var cz = getCenterZoom();
        window.open('https://www.openstreetmap.org/#map=' + cz.zoom + '/' + cz.lat + '/' + cz.lon, '_blank');
    });

    var btn4 = createMapButton('F4 3D Map', 'ptsm-f4map', () => {
        var cz = getCenterZoom();
        window.open('https://demo.f4map.com/#lat=' + cz.lat + '&lon=' + cz.lon + '&zoom=' + cz.zoom, '_blank');
    });

    var btn5 = createMapButton('Apple', 'ptsm-apple', () => {
        var cz = getCenterZoom();
        window.open('https://maps.apple.com/look-around?coordinate=' + cz.lat + '%2C' + cz.lon, '_blank');
    });

    var btn6 = createMapButton('Autobahn', 'ptsm-autobahn', () => {
        var cz = getCenterZoom();
        window.open('https://verkehr.vz-deutschland.de/?layer=raststellen,baustellen,stau,verkehrsmeldungen&zoom=' + cz.zoom + '&lat=' + cz.lat + '&lon=' + cz.lon, '_blank');
    });

    var btn7 = createMapButton('POI Karte', 'ptsm-poi-karte', () => {
        var cz = getCenterZoom();
        // Bessere Zoom-Level-Übertragung: Je höher das Waze-Zoom, desto kleiner der Radius
        var radius;
        if (cz.zoom >= 18) radius = 500;        // Sehr nah - 500m Radius
        else if (cz.zoom >= 16) radius = 1000;   // Nah - 1km Radius
        else if (cz.zoom >= 14) radius = 2500;   // Mittel - 2.5km Radius
        else if (cz.zoom >= 12) radius = 5000;   // Weit - 5km Radius
        else if (cz.zoom >= 10) radius = 10000;  // Sehr weit - 10km Radius
        else radius = 25000;                     // Maximum - 25km Radius

        window.open('https://www.flosm.org/de/POI-Karte.html?lat=' + cz.lat + '&lon=' + cz.lon + '&r=' + radius + '&st=0&sw=speedcamera', '_blank');
    });

    var btn8 = createMapButton('POI Base', 'ptsm-poi-base', () => {
        var cz = getCenterZoom();
        window.open('https://www.poibase.com/de/karte/#/map/coords-' + cz.lon + ',' + cz.lat + '/zoom-' + cz.zoom, '_blank');
    });

    var btn9 = createMapButton('ViaM', 'ptsm-viamichelin', () => {
        var cz = getCenterZoom();
        // ViaMichelin moderne URL-Struktur mit bounds und center
        // Zoom-abhängige Bounds-Berechnung für bessere Darstellung
        var zoomFactor;
        if (cz.zoom >= 18) zoomFactor = 0.001;       // Sehr nah
        else if (cz.zoom >= 16) zoomFactor = 0.002;  // Nah
        else if (cz.zoom >= 14) zoomFactor = 0.005;  // Mittel-nah
        else if (cz.zoom >= 12) zoomFactor = 0.01;   // Mittel
        else if (cz.zoom >= 10) zoomFactor = 0.02;   // Mittel-weit
        else if (cz.zoom >= 8) zoomFactor = 0.05;    // Weit
        else zoomFactor = 0.1;                       // Sehr weit

        // Bounds berechnen (Rechteck um den Mittelpunkt)
        var latMin = (cz.lat - zoomFactor).toFixed(6);
        var latMax = (cz.lat + zoomFactor).toFixed(6);
        var lonMin = (cz.lon - zoomFactor).toFixed(6);
        var lonMax = (cz.lon + zoomFactor).toFixed(6);

        var viaMichelinUrl = 'https://www.viamichelin.de/karten-stadtplan/verkehr?bounds=' +
                            lonMin + '%7E' + latMin + '%7E' + lonMax + '%7E' + latMax +
                            '&center=' + cz.lon.toFixed(6) + '%7E' + cz.lat.toFixed(6) +
                            '&page=1&poiCategories=0&showPolandModal=false';

        window.open(viaMichelinUrl, '_blank');
    });

    var btn10 = createMapButton('Here', 'ptsm-here', () => {
        var cz = getCenterZoom();
        window.open('https://wego.here.com/?map=' + cz.lat + ',' + cz.lon + ',' + cz.zoom + ',normal', '_blank');
    });

    var btn11 = createMapButton('Mapillary', 'ptsm-mapillary', () => {
        var cz = getCenterZoom();
        cz.zoom -= 1;
        window.open('https://www.mapillary.com/app/?lat=' + cz.lat + '&lng=' + cz.lon + '&z=' + cz.zoom, '_blank');
    });

    var btn12 = createMapButton('OSBrowser', 'ptsm-osbrowser', () => {
        var cz = getCenterZoom();
        window.open('https://www.openstreetbrowser.org/#map=' + cz.zoom + '/' + cz.lat + '/' + cz.lon + '&categories=car_maxspeed', '_blank');
    });

    var btn13 = createMapButton('Mappy', 'ptsm-mappy', () => {
        var cz = getCenterZoom();
        window.open('https://en.mappy.com/plan#/' + cz.lat + ',' + cz.lon, '_blank');
    });

    var btn14 = createMapButton('Blitzer.de', 'ptsm-blitzer', () => {
        var cz = getCenterZoom();
        window.open('https://map.atudo.com/v5/?lat=' + cz.lat + '&lng=' + cz.lon + '&zoom=' + cz.zoom, '_blank');
    });

    var btn16 = createMapButton('BY Atlas', 'ptsm-bayernatlas', () => {
        var cz = getCenterZoom();
        cz.zoom -= 5;
        if (typeof proj4 === "undefined") {
            alert('proj4 library not loaded');
            return;
        }
        var firstProj = '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
        var utm = proj4(firstProj, [cz.lon, cz.lat]);
        window.open('https://atlas.bayern.de/bayernatlas/index.html?zoom=' + cz.zoom + '&E=' + utm[0] + '&N=' + utm[1], '_blank');
    });

    var btn18 = createMapButton('TomTom', 'ptsm-tomtom', () => {
        var cz = getCenterZoom();
        cz.zoom -= 1;
        window.open('https://plan.tomtom.com/de?p=' + cz.lat + ',' + cz.lon + ',' + cz.zoom + 'z', '_blank');
    });

    var btn19 = createMapButton('Basemap.de', 'ptsm-basemap-de', () => {
        var cz = getCenterZoom();
        cz.zoom = 0.985 * cz.zoom - 1.05;
        window.open('https://basemap.de/viewer?config=' + btoa('{"lat":' + cz.lat + ',"lon":' + cz.lon + ',"zoom":' + cz.zoom + ',"styleID":0,"pitch":0,"bearing":0,"saturation":0,"brightness":0,"hiddenControls":[],"hiddenLayers":[],"changedLayers":[],"hiddenSubGroups":[],"changedSubGroups":[],"externalStyleURL":""}'), '_blank');
    });

    var btn20 = createMapButton('Reporting', 'ptsm-reporting', () => {
        var cz = getCenterZoom();
        cz.zoom -= 1;
        window.open('https://www.waze.com/partnerhub/map-tool?lat=' + cz.lat + '&lon=' + cz.lon + '&zoom=' + cz.zoom, '_blank');
    });

    var btn21 = createMapButton('KartaView', 'ptsm-kartaview', () => {
        var cz = getCenterZoom();
        cz.zoom -= 1;
        window.open('https://kartaview.org/map/@' + cz.lat + ',' + cz.lon + ',' + cz.zoom + 'z', '_blank');
    });

    var btn22 = createMapButton('Bayerninfo', 'ptsm-bayerninfo', () => {
    var cz = getCenterZoom();
    var latOffset = 0.01;
    var lonOffset = 0.01;
    var northLat = cz.lat + latOffset;
    var southLat = cz.lat - latOffset;
    var eastLon = cz.lon + lonOffset;
    var westLon = cz.lon - lonOffset;
    var bounds = southLat + '%2C' + westLon + '%2C' + northLat + '%2C' + eastLon;
    var now = new Date();
    var fourWeeksLater = new Date();
    fourWeeksLater.setDate(now.getDate() + 28);
    var fromDate = now.toISOString().replace(/:/g, '%3A');
    var toDate = fourWeeksLater.toISOString().replace(/:/g, '%3A');
    var mapsUrl = 'https://www.bayerninfo.de/de/baustellenkalender?bounds=' + bounds;
    mapsUrl += '&datetimeFrom=' + fromDate + '&datetimeTo=' + toDate;
    window.open(mapsUrl, '_blank');
});

    var btn30 = createMapButton('TimOnline', 'ptsm-timonline', () => {
        var cz = getCenterZoom();
        cz.zoom = 454959671.96858*Math.exp(-0.693*cz.zoom);
        window.open('https://www.tim-online.nrw.de/tim-online2/?center=' + cz.lat + ',' + cz.lon + '&scale=' + cz.zoom, '_blank');
    });

    var btn31 = createMapButton('GeoAdmin', 'ptsm-geoadmin', () => {
        var cz = getCenterZoom();
        cz.zoom -= 7.2;
        var phi1 = ((cz.lat * 3600) - 169028.66) / 10000;
        var lmd1 = ((cz.lon * 3600) - 26782.5) / 10000;
        var x = 200147.07 + 308807.95 * phi1 + 3745.25 * lmd1 * lmd1 + 76.63 * phi1 * phi1 + 119.79 * phi1 * phi1 * phi1 - 194.56 * lmd1 * lmd1 * phi1;
        var y = 600072.37 + 211455.93 * lmd1 - 10938.51 * lmd1 * phi1 - 0.36 * lmd1 * phi1 * phi1 - 44.54 * lmd1 * lmd1 * lmd1;
        window.open('https://map.geo.admin.ch/?Y=' + y.toFixed(0) + '&X=' + x.toFixed(0) + '&zoom=' + cz.zoom + '&topic=ech&lang=de&bgLayer=ch.swisstopo.pixelkarte-farbe&layers=ch.bfs.gebaeude_wohnungs_register,ch.kantone.cadastralwebmap-farbe,ch.swisstopo.swissimage-product,ch.bfe.ladestellen-elektromobilitaet,ch.swisstopo.swissimage-product,ch.bfe.ladestellen-elektromobilitaet,ch.swisstopo.swissimage-product,ch.bfe.ladestellen-elektromobilitaet&catalogNodes=457,532,687,458,477,485,491,510,527,1743&layers_visibility=false,false,true,true&layers_timestamp=,,current', '_blank');
    });

    var btn32 = createMapButton('Basemap', 'ptsm-basemap-at', () => {
        var cz = getCenterZoom();
        var x = cz.lon / 180 * 20037508.34;
        var y = Math.log(Math.tan((90 + cz.lat * 1) * Math.PI / 360)) / Math.PI;
        y *= 20037508.34;
        window.open('https://basemap.at/bmapp/index.html#{"center":[' + x.toFixed(10) + ',' + y.toFixed(10) + '],"zoom":' + cz.zoom + ',"rotation":0,"layers":"1000000000"}', '_blank');
    });

    var btn34 = createMapButton('ADAC', 'ptsm-adac', () => {
        var cz = getCenterZoom();
        // ADAC Maps präzise Bounds-Berechnung basierend auf Bildvergleich
        var zoomFactor;
        if (cz.zoom >= 19) zoomFactor = 0.002;       // Extrem nah - größerer Bereich
        else if (cz.zoom >= 18) zoomFactor = 0.003;  // Sehr nah
        else if (cz.zoom >= 17) zoomFactor = 0.004;  // Nah+
        else if (cz.zoom >= 16) zoomFactor = 0.006;  // Nah
        else if (cz.zoom >= 15) zoomFactor = 0.008;  // Mittel-nah+
        else if (cz.zoom >= 14) zoomFactor = 0.012;  // Mittel-nah
        else if (cz.zoom >= 13) zoomFactor = 0.016;  // Mittel+
        else if (cz.zoom >= 12) zoomFactor = 0.022;  // Mittel
        else if (cz.zoom >= 11) zoomFactor = 0.030;  // Mittel-weit+
        else if (cz.zoom >= 10) zoomFactor = 0.040;  // Mittel-weit
        else if (cz.zoom >= 9) zoomFactor = 0.060;   // Weit+
        else if (cz.zoom >= 8) zoomFactor = 0.080;   // Weit
        else zoomFactor = 0.120;                     // Sehr weit

        // Korrektur der Verschiebung: ADAC zeigt zu weit östlich und leicht nördlich
        var correctedLat = cz.lat - (zoomFactor * 0.05); // Leichte Südverschiebung
        var correctedLon = cz.lon - (zoomFactor * 0.15); // Leichte Westverschiebung

        var latMin = (correctedLat - zoomFactor).toFixed(6);
        var latMax = (correctedLat + zoomFactor).toFixed(6);
        var lonMin = (correctedLon - zoomFactor).toFixed(6);
        var lonMax = (correctedLon + zoomFactor).toFixed(6);

        var adacUrl = 'https://maps.adac.de/?bounds=' +
                     latMin + ',' + lonMin + '-' + latMax + ',' + lonMax +
                     '&traffic=construction,announcements,flow';

        window.open(adacUrl, '_blank');
    });

    var btn36 = createMapButton('Here Edit', 'ptsm-here-edit', () => {
        var cz = getCenterZoom();
        window.open('https://mapcreator.here.com/?l=' + cz.lat + ',' + cz.lon + ',' + cz.zoom + ',autoselect', '_blank');
    });

    var btn37 = createMapButton('Umsehen', 'ptsm-umsehen', () => {
        var cz = getCenterZoom();
        cz.zoom += 1.0;
        window.open('https://maps.apple.com/?ll=' + cz.lat + ',' + cz.lon + '&z=' + cz.zoom + '&t=m', '_blank');
    });

    var btn39 = createMapButton('Hackintosh', 'ptsm-hackintosh', () => {
        var cz = getCenterZoom();
        window.open('https://lookmap.eu.pythonanywhere.com/#c=' + cz.zoom + '/' + cz.lat + '/' + cz.lon + '/', '_blank');
    });

    var btn40 = createMapButton('Archive', 'ptsm-archive', () => {
        window.open('https://archive.is/', '_blank');
    });

    var btn41 = createMapButton('W3W', 'ptsm-w3w', () => {
        var map = W.map.getOLMap();
        var center = map.getCenter().transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
        var url = `https://what3words.com/${center.lat},${center.lon}`;
        window.open(url, '_blank');
    });

    // Create container
    var container = document.createElement('div');
    container.className = 'ptsm-container';

    // Kompakt-Modus beim Laden anwenden falls gespeichert
    if (loadCompactMode()) {
        container.classList.add('compact');
    }

    // Create categories
    var allgemCategory = createCategory('Allgemeine Karten', 'ptsm-category-allgem', true);
    var baustellCategory = createCategory('Baustellen & Verkehr', 'ptsm-category-baustell', false);
    var blitzerCategory = createCategory('Blitzer & Geschwindigkeit', 'ptsm-category-blitzer', false);
    var bilderCategory = createCategory('Straßenbilder', 'ptsm-category-bilder', false);
    var geoportalCategory = createCategory('Geoportale', 'ptsm-category-geoportal', false);
    var miscCategory = createCategory('Sonstiges', 'ptsm-category-misc', false);

    // Add buttons to categories
    // Allgemeine Karten
    allgemCategory.content.appendChild(btn1);  // Google
    allgemCategory.content.appendChild(btn2);  // Bing
    allgemCategory.content.appendChild(btn3a); // OSM
    allgemCategory.content.appendChild(btn4);  // F4 3D
    allgemCategory.content.appendChild(btn5);  // Apple
    allgemCategory.content.appendChild(btn10); // Here
    allgemCategory.content.appendChild(btn13); // Mappy
    allgemCategory.content.appendChild(btn18); // TomTom
    allgemCategory.content.appendChild(btn9);  // ViaM

    // Baustellen & Verkehr
    baustellCategory.content.appendChild(btn3);  // Ver. NRW
    baustellCategory.content.appendChild(btn6);  // Autobahn
    baustellCategory.content.appendChild(btn34); // ADAC

    // Blitzer & Geschwindigkeit
    blitzerCategory.content.appendChild(btn14); // Blitzer.de
    blitzerCategory.content.appendChild(btn7);  // POI Karte
    blitzerCategory.content.appendChild(btn8);  // POI Base

    // Straßenbilder
    bilderCategory.content.appendChild(btn11); // Mapillary
    bilderCategory.content.appendChild(btn21); // KartaView
    bilderCategory.content.appendChild(btn12); // OSBrowser

    // Geoportale
    geoportalCategory.content.appendChild(btn19); // Basemap DE
    geoportalCategory.content.appendChild(btn31); // GeoAdmin
    geoportalCategory.content.appendChild(btn32); // Basemap AT
    geoportalCategory.content.appendChild(btn30); // TimOnline
    geoportalCategory.content.appendChild(btn16); // BY Atlas
    geoportalCategory.content.appendChild(btn22); // Bayerninfo

    // Einstellungen-Kategorie erstellen
    var settingsCategory = createCategory('Einstellungen', 'ptsm-category-settings', false);

    // Settings-Inhalte erstellen
    function createSettingsContent() {
        const settings = loadSettings();

        var settingsContent = document.createElement('div');
        settingsContent.className = 'ptsm-settings-content';
        settingsContent.style.cssText = 'padding: 8px;';

        // Freie Position Checkbox
        var freePositionContainer = document.createElement('div');
        freePositionContainer.style.cssText = `
            margin-bottom: 12px;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
            display: flex;
            align-items: center;
            border: 1px solid #e9ecef;
        `;

        var freePositionCheckbox = document.createElement('input');
        freePositionCheckbox.type = 'checkbox';
        freePositionCheckbox.id = 'ptsm-free-position';
        freePositionCheckbox.checked = settings.freePosition;
        freePositionCheckbox.style.cssText = 'margin-right: 10px; transform: scale(1.2);';

        var freePositionLabel = document.createElement('label');
        freePositionLabel.htmlFor = 'ptsm-free-position';
        freePositionLabel.innerHTML = '📌 Freie Position (Desktop-weit)';
        freePositionLabel.style.cssText = `
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            flex: 1;
            user-select: none;
        `;

        freePositionContainer.appendChild(freePositionCheckbox);
        freePositionContainer.appendChild(freePositionLabel);

        // Kompakt-Modus Checkbox
        var compactContainer = document.createElement('div');
        compactContainer.style.cssText = `
            margin-bottom: 12px;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 4px;
            display: flex;
            align-items: center;
            border: 1px solid #e9ecef;
        `;

        var compactCheckbox = document.createElement('input');
        compactCheckbox.type = 'checkbox';
        compactCheckbox.id = 'ptsm-compact-mode';
        compactCheckbox.checked = loadCompactMode();
        compactCheckbox.style.cssText = 'margin-right: 10px; transform: scale(1.2);';

        var compactLabel = document.createElement('label');
        compactLabel.htmlFor = 'ptsm-compact-mode';
        compactLabel.innerHTML = '🔧 Kompakt-Modus';
        compactLabel.style.cssText = `
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            flex: 1;
            user-select: none;
        `;

        compactContainer.appendChild(compactCheckbox);
        compactContainer.appendChild(compactLabel);

        // Reset Button
        var resetButton = document.createElement('button');
        resetButton.className = 'ptsm-reset-settings-btn';
        resetButton.innerHTML = '🔄 Einstellungen zurücksetzen';
        resetButton.style.cssText = `
            width: 100%;
            height: 36px;
            padding: 8px 12px;
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            border: none;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 4px;
        `;

        // Event Listeners
        freePositionCheckbox.addEventListener('change', function() {
            toggleFreePosition(this.checked);
            // Event für Cursor-Update senden
            document.dispatchEvent(new Event('ptsm-settings-changed'));
        });

        compactCheckbox.addEventListener('change', function() {
            const container = document.querySelector('.ptsm-container');
            if (this.checked) {
                container.classList.add('compact');
                saveCompactMode(true);
            } else {
                container.classList.remove('compact');
                saveCompactMode(false);
            }
        });

        resetButton.addEventListener('click', resetAllSettings);

        resetButton.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-1px)';
            this.style.background = 'linear-gradient(135deg, #c82333 0%, #a02834 100%)';
            this.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.25)';
        });

        resetButton.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
            this.style.boxShadow = 'none';
        });

        settingsContent.appendChild(freePositionContainer);
        settingsContent.appendChild(compactContainer);
        settingsContent.appendChild(resetButton);

        return settingsContent;
    }

    // Settings-Inhalt zur Kategorie hinzufügen
    var settingsContent = createSettingsContent();
    settingsCategory.content.appendChild(settingsContent);

    // Sonstiges
    miscCategory.content.appendChild(btn20); // Reporting
    miscCategory.content.appendChild(btn36); // Here Edit
    miscCategory.content.appendChild(btn37); // Umsehen
    miscCategory.content.appendChild(btn39); // Hackintosh
    miscCategory.content.appendChild(btn40); // Archive
    miscCategory.content.appendChild(btn41); // W3W

    // Add categories to container
    container.appendChild(allgemCategory.category);
    container.appendChild(baustellCategory.category);
    container.appendChild(blitzerCategory.category);
    container.appendChild(bilderCategory.category);
    container.appendChild(geoportalCategory.category);
    container.appendChild(miscCategory.category);
    container.appendChild(settingsCategory.category);

    // Add version info with update link
    var versionInfo = document.createElement('div');
    versionInfo.className = 'ptsm-state-info';

    var updateLink = document.createElement('a');
    updateLink.href = 'https://greasyfork.org/de/scripts/448378-wme-permalink-to-several-maps-dach';
    updateLink.target = '_blank';
    updateLink.textContent = 'Auf Updates überprüfen / V' + ptsmVersion;
    updateLink.style.cssText = 'color: #007bff; text-decoration: none; font-size: 9px;';
    updateLink.addEventListener('mouseover', function() {
        this.style.textDecoration = 'underline';
    });
    updateLink.addEventListener('mouseout', function() {
        this.style.textDecoration = 'none';
    });

    versionInfo.appendChild(updateLink);
    container.appendChild(versionInfo);

    // Add warning about external services
    var warning = document.createElement('div');
    warning.className = 'ptsm-warning';
    warning.innerHTML = '<div class="w-icon">⚠</div><div class="ptsm-warning-text">Hinweis: Einige der externen Karten sind als Informationsquelle zur Kartenbearbeitung nicht zulässig!</div>';
    container.appendChild(warning);

    // Try to use WME Userscript API first, fallback to manual insertion
    try {
        if (W.userscripts && W.userscripts.registerSidebarTab) {
            const result = W.userscripts.registerSidebarTab('wme-ptsm-dach');
            var tabLabel = result.tabLabel;
            var tabPane = result.tabPane;

            tabLabel.textContent = 'PTSM';
            tabLabel.title = 'WME Permalink to several Maps DACH';

            tabPane.appendChild(container);
        } else {
            // Fallback: Try to add to existing sidebar
            var sidebar = document.querySelector('#sidebar') || document.querySelector('.sidebar');
            if (sidebar) {
                // Create a collapsible section
                var section = document.createElement('div');
                section.style.cssText = 'border: 1px solid #ccc; margin: 10px 0; border-radius: 5px;';

                var header = document.createElement('div');
                header.style.cssText = 'background: #f5f5f5; padding: 10px; cursor: pointer; font-weight: bold; user-select: none;';
                header.textContent = 'PTSM DACH';

                var content = document.createElement('div');
                content.style.display = 'none';
                content.appendChild(container);

                header.addEventListener('click', function() {
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                });

                section.appendChild(header);
                section.appendChild(content);
                sidebar.appendChild(section);
            } else {
                // Last resort: Create floating panel
                var floatingPanel = document.createElement('div');
                floatingPanel.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 10px;
                    width: 300px;
                    max-height: 70vh;
                    overflow-y: auto;
                    background: white;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    resize: both;
                `;

                var panelHeader = document.createElement('div');
                panelHeader.style.cssText = `
                    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                    color: white;
                    padding: 10px;
                    font-weight: bold;
                    cursor: move;
                    user-select: none;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `;
                panelHeader.innerHTML = 'PTSM DACH <span style="cursor: pointer; font-size: 18px;">&times;</span>';

                var closeBtn = panelHeader.querySelector('span');
                closeBtn.addEventListener('click', function() {
                    floatingPanel.style.display = 'none';
                });

                // Make panel draggable
                var isDragging = false;
                var startX, startY, startLeft, startTop;

                panelHeader.addEventListener('mousedown', function(e) {
                    if (e.target === closeBtn) return;
                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    startLeft = parseInt(window.getComputedStyle(floatingPanel).left, 10);
                    startTop = parseInt(window.getComputedStyle(floatingPanel).top, 10);
                    document.addEventListener('mousemove', drag);
                    document.addEventListener('mouseup', stopDrag);
                });

                function drag(e) {
                    if (!isDragging) return;
                    var newLeft = startLeft + e.clientX - startX;
                    var newTop = startTop + e.clientY - startY;
                    floatingPanel.style.left = newLeft + 'px';
                    floatingPanel.style.top = newTop + 'px';
                }

                function stopDrag() {
                    isDragging = false;
                    document.removeEventListener('mousemove', drag);
                    document.removeEventListener('mouseup', stopDrag);
                }

                floatingPanel.appendChild(panelHeader);
                floatingPanel.appendChild(container);
                document.body.appendChild(floatingPanel);
            }
        }
    } catch (e) {
        console.error('PTSM: Error adding to sidebar:', e);
    }

    // Alle PTSM-Daten zurücksetzen
    function resetAllSettings() {
        if (confirm('Alle PTSM-Einstellungen zurücksetzen?\n\n- Menü-Positionen\n- Dropdown-Zustände\n- Kompakt-Modus\n- Freie Position\n\nSeite wird neu geladen.')) {
            try {
                // Alle PTSM localStorage Keys entfernen
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('wme-ptsm-')) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));

                // Seite neu laden
                location.reload();
            } catch (e) {
                alert('Fehler beim Zurücksetzen der Einstellungen');
            }
        }
    }

    // Freie Position ein/ausschalten
    function toggleFreePosition(enabled) {
        const settings = loadSettings();
        settings.freePosition = enabled;
        saveSettings(settings);

        const container = document.querySelector('.ptsm-container');
        if (!container) return;

        const categoryOrder = [
            '.ptsm-category-allgem',
            '.ptsm-category-baustell',
            '.ptsm-category-blitzer',
            '.ptsm-category-bilder',
            '.ptsm-category-geoportal',
            '.ptsm-category-misc',
            '.ptsm-category-settings'
        ];

        if (enabled) {
            // Freier Modus: Menüs können Desktop-weit gezogen werden
            categoryOrder.forEach(selector => {
                const category = document.querySelector(selector);
                if (category) {
                    // Menüs für Desktop-weites Drag vorbereiten
                    category.style.position = 'relative';
                    category.style.zIndex = '1';
                }
            });
        } else {
            // Normaler Modus: Nur Desktop-Positionierung zurücksetzen
            categoryOrder.forEach(selector => {
                const category = document.querySelector(selector);
                if (category) {
                    // Nur Desktop-Drag-Eigenschaften entfernen (wenn fixed positioniert)
                    if (category.style.position === 'fixed') {
                        category.style.position = '';
                        category.style.left = '';
                        category.style.top = '';
                        category.style.zIndex = '';
                        category.style.width = '';
                        category.style.maxWidth = '';
                        category.style.transform = '';
                        category.style.opacity = '';
                        category.style.boxShadow = '';

                        // Nur zurück in Container wenn es außerhalb ist
                        if (category.parentElement !== container) {
                            container.appendChild(category);
                        }
                    }
                }
            });

            // Nur Version-Info und Warnung korrigieren falls sie verschoben wurden
            const versionInfo = container.querySelector('.ptsm-state-info');
            const warning = container.querySelector('.ptsm-warning');

            // Prüfen ob Version-Info nicht am Ende ist
            if (versionInfo && versionInfo.parentElement === container) {
                const allElements = Array.from(container.children);
                const versionIndex = allElements.indexOf(versionInfo);
                const warningIndex = warning ? allElements.indexOf(warning) : -1;

                // Nur neu positionieren wenn Version-Info nicht an vorletzter Stelle ist
                // (oder letzter Stelle wenn keine Warnung da ist)
                const shouldBeAtIndex = warning ? allElements.length - 2 : allElements.length - 1;

                if (versionIndex !== shouldBeAtIndex) {
                    versionInfo.parentElement.removeChild(versionInfo);
                    if (warning && warning.parentElement === container) {
                        container.insertBefore(versionInfo, warning);
                    } else {
                        container.appendChild(versionInfo);
                    }
                }
            }

            // Prüfen ob Warnung nicht am Ende ist
            if (warning && warning.parentElement === container) {
                const allElements = Array.from(container.children);
                const warningIndex = allElements.indexOf(warning);

                // Warnung sollte immer ganz am Ende sein
                if (warningIndex !== allElements.length - 1) {
                    warning.parentElement.removeChild(warning);
                    container.appendChild(warning);
                }
            }

            // Gespeicherte Desktop-Positionen löschen
            try {
                localStorage.removeItem('wme-ptsm-drag-positions');
            } catch (e) {
                console.log('PTSM: localStorage not available');
            }
        }

        // Drag & Drop Funktionalität neu initialisieren
        setTimeout(() => {
            enableDragAndDrop();
            // Event für Cursor-Update senden
            document.dispatchEvent(new Event('ptsm-settings-changed'));
        }, 100);
    }

    console.log('PTSM DACH v' + ptsmVersion + ' loaded successfully');

    // Update-Popup anzeigen (einmalig pro Version)
    setTimeout(showUpdatePopup, 1000);

    // Gespeicherte Kategorie-Reihenfolge wiederherstellen
    setTimeout(applyCategoryOrder, 100);

    // Drag & Drop aktivieren
    setTimeout(enableDragAndDrop, 500);

    // Initiale Einstellungen anwenden
    setTimeout(() => {
        const settings = loadSettings();
        if (settings.freePosition) {
            toggleFreePosition(true);
        }
    }, 1000);
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addButtons);
} else {
    setTimeout(addButtons, 1000);
}

// Also try to initialize when Waze editor loads
if (typeof W !== 'undefined') {
    if (W.loginManager && W.loginManager.events) {
        W.loginManager.events.register('loginStateChanged', null, addButtons);
    }
    setTimeout(addButtons, 2000);
} else {
    // Wait for Waze object to be available
    var checkForWaze = setInterval(function() {
        if (typeof W !== 'undefined' && W.loginManager) {
            clearInterval(checkForWaze);
            setTimeout(addButtons, 1000);
        }
    }, 500);
}