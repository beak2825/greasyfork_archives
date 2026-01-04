// ==UserScript==
// @name         Spotify MP3 Download Button → spotidown.app (Auto-Download) - (by SuchtiOnTour)
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Adds a Spotify download button → Auto-converts & downloads MP3s via spotidown.app
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

    if (location.href.includes('open.spotify.com')) {
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
                    const alreadyAdded = menu.querySelector('#download-song-button');
                    if (alreadyAdded) return;

                    const newItem = document.createElement('div');
                    newItem.id = 'download-song-button';
                    newItem.setAttribute('role', 'menuitem');
                    newItem.setAttribute('tabindex', '-1');
                    newItem.className = desktopAppBtn.className;
                    newItem.style.cursor = 'pointer';
                    newItem.style.display = 'flex';
                    newItem.style.alignItems = 'center';
                    newItem.style.padding = '8px 16px';
                    newItem.style.borderRadius = '4px';
                    newItem.style.transition = 'background-color 0.2s ease, color 0.2s ease';

                    // Icon + Text
                    const leftSide = document.createElement('div');
                    leftSide.style.display = 'flex';
                    leftSide.style.alignItems = 'center';

                    const icon = document.createElement('span');
                    icon.textContent = '⭳';
                    icon.style.marginRight = '12px';
                    icon.style.opacity = '0.7';
                    icon.style.fontSize = '16px';

                    const span = document.createElement('span');
                    span.className = desktopAppBtn.querySelector('span')?.className || '';
                    span.textContent = 'Song MP3 Download';

                    leftSide.appendChild(icon);
                    leftSide.appendChild(span);

                    newItem.appendChild(leftSide);

                    // Hover-Effekt
                    newItem.addEventListener('mouseenter', () => {
                        newItem.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        icon.style.opacity = '1';
                    });
                    newItem.addEventListener('mouseleave', () => {
                        newItem.style.backgroundColor = 'transparent';
                        icon.style.opacity = '0.7';
                    });

                    // Klick-Aktion
                    newItem.addEventListener('click', async () => {
                        try {
                            copyBtn.click();
                            await new Promise(r => setTimeout(r, 300));
                            const clipboard = await navigator.clipboard.readText();
                            if (!clipboard.includes('/track/')) {
                                alert('❌ Kein gültiger Spotify-Link erkannt.');
                                return;
                            }
                            window.open(`${SPOTIDOWN_URL}/?track=${encodeURIComponent(clipboard.trim())}`, '_blank');
                        } catch (err) {
                            alert('⚠️ Clipboard konnte nicht gelesen werden.');
                        }
                    });

                    desktopAppBtn.parentNode.insertBefore(newItem, desktopAppBtn.nextSibling);
                }
            });

            requestAnimationFrame(scanMenus);
        };

        requestAnimationFrame(scanMenus);
    }

    if (location.href.includes('spotidown.app')) {
        const trackUrl = new URLSearchParams(window.location.search).get('track');
        if (!trackUrl) return;

        let step = 0;

        const interval = setInterval(() => {
            const input = document.querySelector('#url') || document.querySelector('input[type="text"]');

            if (step === 0) {
                const downloadBtn = Array.from(document.querySelectorAll('button')).find(btn =>
                    btn.textContent.toLowerCase().includes('download')
                );
                if (input && downloadBtn) {
                    input.value = trackUrl;
                    input.dispatchEvent(new InputEvent('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    downloadBtn.click();
                    step = 1;
                    return;
                }
            }

            if (step === 1) {
                const firstMp3Btn = Array.from(document.querySelectorAll('a, button')).find(el =>
                    el.textContent.toLowerCase().includes('download mp3')
                );
                if (firstMp3Btn) {
                    firstMp3Btn.click();
                    step = 2;
                    return;
                }
            }

            if (step === 2) {
                const secondMp3Btn = Array.from(document.querySelectorAll('a, button')).find(el =>
                    el.textContent.toLowerCase().includes('download mp3')
                );
                if (secondMp3Btn) {
                    secondMp3Btn.click();
                    clearInterval(interval);
                }
            }
        }, 1000);
    }
})();
