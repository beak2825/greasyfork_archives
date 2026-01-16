// ==UserScript==
// @name         Spotify MP3 Download Button → spotidown.app (Auto-Download) - (by SuchtiOnTour)
// @namespace    Violentmonkey Scripts
// @version      2.1
// @description  Adds a Spotify download button -> Auto-converts & downloads MP3s via spotidown.app
// @author       SuchtiOnTour
// @license      MIT
// @match        https://open.spotify.com/*
// @match        https://spotidown.app/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542495/Spotify%20MP3%20Download%20Button%20%E2%86%92%20spotidownapp%20%28Auto-Download%29%20-%20%28by%20SuchtiOnTour%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542495/Spotify%20MP3%20Download%20Button%20%E2%86%92%20spotidownapp%20%28Auto-Download%29%20-%20%28by%20SuchtiOnTour%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SPOTIDOWN_URL = 'https://spotidown.app';

    /* ---------- Teil 1: Spotify (Button hinzufügen) ---------- */
    if (location.host.includes('spotify.com')) {
        const scanMenus = () => {
            const menus = document.querySelectorAll('[role="menu"]');
            menus.forEach(menu => {
                const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
                const desktopAppBtn = items.find(el =>
                    el.textContent.toLowerCase().includes('in der desktop-app öffnen')
                );
                const copyBtn = items.find(el =>
                    el.textContent.toLowerCase().includes('link zum song kopieren')
                );

                if (desktopAppBtn && copyBtn) {
                    if (menu.querySelector('#download-song-button')) return;

                    const newItem = document.createElement('div');
                    newItem.id = 'download-song-button';
                    newItem.setAttribute('role', 'menuitem');
                    newItem.className = desktopAppBtn.className;
                    newItem.style.cursor = 'pointer';
                    newItem.style.display = 'flex';
                    newItem.style.alignItems = 'center';
                    newItem.style.padding = '8px 16px';

                    newItem.innerHTML = `
                        <div style="display:flex; align-items:center;">
                            <span style="margin-right:12px; opacity:0.7; font-size:16px;">⭳</span>
                            <span>Song MP3 Download</span>
                        </div>
                    `;

                    newItem.addEventListener('mouseenter', () => newItem.style.backgroundColor = 'rgba(255, 255, 255, 0.1)');
                    newItem.addEventListener('mouseleave', () => newItem.style.backgroundColor = 'transparent');

                    newItem.addEventListener('click', async () => {
                        try {
                            copyBtn.click();
                            await new Promise(r => setTimeout(r, 400));
                            const clipboard = await navigator.clipboard.readText();
                            if (!clipboard.includes('spotify.com/')) {
                                alert('❌ Kein gültiger Link im Clipboard.');
                                return;
                            }
                            // Ändere diese Zeile in deinem Spotify-Script:
                            window.open(`${SPOTIDOWN_URL}/#track=${encodeURIComponent(clipboard.trim())}`, '_blank');
                        } catch (err) {
                            alert('⚠️ Clipboard-Fehler.');
                        }
                    });

                    desktopAppBtn.parentNode.insertBefore(newItem, desktopAppBtn.nextSibling);
                }
            });
            requestAnimationFrame(scanMenus);
        };
        requestAnimationFrame(scanMenus);
    }

    /* ---------- Teil 2: SpotiDown (3-Schritte-Automatik) ---------- */
    if (location.host.includes('spotidown.app')) {
        console.log('[SpotiDown] Überwache Workflow...');

        const processWorkflow = () => {
            // Link aus der URL extrahieren
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const trackUrl = hashParams.get('track');
            if (!trackUrl) return;

            // --- SCHRITT 1: Link einfügen & Suchen ---
            const inputField = document.getElementById('url');
            const submitBtn = document.getElementById('send');
            if (inputField && submitBtn && inputField.value !== trackUrl) {
                console.log('[SpotiDown] Schritt 1: Link einfügen...');
                inputField.value = trackUrl;
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => submitBtn.click(), 500);
                return; // Warten auf die Konvertierungs-Ansicht
            }

            // --- SCHRITT 2: Konvertierung starten (Erster grüner Button) ---
            // Wir suchen den Button, der "Download MP3" heißt, aber NICHT die ID "popup" hat
            const convertBtn = Array.from(document.querySelectorAll('button.is-success, .abutton.is-success')).find(el =>
                el.textContent.includes('Download MP3') && el.id !== 'popup'
            );

            if (convertBtn && convertBtn.offsetParent !== null) {
                if (!convertBtn.hasAttribute('data-clicked-by-script')) {
                    console.log('[SpotiDown] Schritt 2: Starte Konvertierung...');
                    convertBtn.setAttribute('data-clicked-by-script', 'true');
                    convertBtn.click();
                }
                return; // Warten auf die finale Button-Liste
            }

            // --- SCHRITT 3: Finaler Download (Button mit ID "popup") ---
            const finalBtn = document.getElementById('popup');
            if (finalBtn && finalBtn.offsetParent !== null) {
                if (!finalBtn.hasAttribute('data-final-clicked')) {
                    console.log('[SpotiDown] Schritt 3: Starte finalen Datei-Download...');
                    finalBtn.setAttribute('data-final-clicked', 'true');
                    finalBtn.click();

                    // Alles erledigt -> Intervall stoppen
                    clearInterval(autoInterval);
                }
            }
        };

        // Prüfe alle 1000ms den Fortschritt
        const autoInterval = setInterval(processWorkflow, 1000);
        setTimeout(() => clearInterval(autoInterval), 60000); // Safety-Timeout
    }
})();