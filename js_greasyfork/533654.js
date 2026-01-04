// ==UserScript==
// @name         🪄 YouTube UI Enhancer | Resize Thumbnails & Customize Layout
// @namespace    https://greasyfork.org/users/1461079
// @version      2.0.2
// @description  Get rid of oversized thumbnails, adjust rows, and clean up layout for a more streamlined YouTube experience.
// @author       Michaelsoft
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533654/%F0%9F%AA%84%20YouTube%20UI%20Enhancer%20%7C%20Resize%20Thumbnails%20%20Customize%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/533654/%F0%9F%AA%84%20YouTube%20UI%20Enhancer%20%7C%20Resize%20Thumbnails%20%20Customize%20Layout.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // WARNING: Users should update their preferences through UI - values below will be overwritten every time the script is updated.
    const userSettings = {
        videosPerRow: 6, // Set how many videos per row (e.g., 4, 5, 6, etc.). Default value is 6.
        shortsPerRow: 12, // Set how many Shorts per row (e.g., 7, 8, 9, etc.). Default value is 12.
        disableShorts: false, // Set to true to completely hide the Shorts section. Default value is false.
        enableShowMoreFix: true, // Set to true to auto-expand Shorts ("Show More" fix). Default value is true.
        hideUIButton: false, // Set to true to hide the floating settings button. Default value is false.
        hideUIButtonShortcut: true, // Set to true to allow Alt+Shift+U shortcut to toggle button visibility. Default value is true.
    };

    const settings = {};
    for (const key in userSettings) {
        settings[key] = GM_getValue(key, userSettings[key]);
    }

    function saveSetting(key, value) {
        GM_setValue(key, value);
        settings[key] = value;
        applyCustomizations();
    }

    function resetSettings() {
        for (const key in userSettings) {
            saveSetting(key, userSettings[key]);
        }
        enableShowMoreFix();
    }

    let customStyle = null;

    function applyCustomizations() {
        if (customStyle) customStyle.remove();
        customStyle = GM_addStyle(`
            ytd-rich-grid-renderer {
                --ytd-rich-grid-items-per-row: ${settings.videosPerRow} !important;
                --ytd-rich-grid-posts-per-row: ${settings.videosPerRow} !important;
                --ytd-rich-grid-slim-items-per-row: ${settings.shortsPerRow} !important;
                --ytd-rich-grid-game-cards-per-row: 7 !important;
                --ytd-rich-grid-gutter-margin: 0px !important;
            }
            ytd-rich-shelf-renderer {
                --ytd-rich-grid-items-per-row: ${settings.shortsPerRow} !important;
            }
            ${settings.disableShorts ? `
                ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer {
                    display: none !important;
                }
            ` : ''}
        `);
    }

    applyCustomizations();

    let observer;
    function enableShowMoreFix() {
        if (observer) observer.disconnect();
        if (!settings.enableShowMoreFix) return;

        observer = new MutationObserver(() => {
            document.querySelectorAll('ytd-rich-item-renderer[hidden]').forEach(el => {
                el.removeAttribute('hidden');
            });
            document.querySelectorAll('ytd-rich-shelf-renderer').forEach(el => {
                el.setAttribute('is-show-more-hidden', '');
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    enableShowMoreFix();

    function isDarkTheme() {
        const html = document.querySelector('html');
        return html && html.getAttribute('dark') !== null;
    }

    let uiButton = null;

    function createSettingsButton() {
        uiButton = document.createElement('div');
        uiButton.innerHTML = 'Customize Layout';
        uiButton.style.position = 'fixed';
        uiButton.style.bottom = '20px';
        uiButton.style.right = '20px';
        uiButton.style.zIndex = '9999';
        uiButton.style.padding = '10px 20px';
        uiButton.style.fontSize = '16px';
        uiButton.style.backgroundColor = '#065fd4';
        uiButton.style.color = '#fff';
        uiButton.style.borderRadius = '8px';
        uiButton.style.cursor = 'pointer';
        uiButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        uiButton.style.opacity = '1';
        uiButton.style.transition = 'opacity 0.3s ease';
        uiButton.style.display = settings.hideUIButton ? 'none' : 'block'; // <--- important

        uiButton.onclick = openSettingsMenu;
        document.body.appendChild(uiButton);

        if (settings.hideUIButtonShortcut) {
            window.addEventListener('keydown', (e) => {
                if (e.altKey && e.shiftKey && e.key === 'U') {
                    toggleUIButtonVisibility();
                }
            });
        }
    }

    function toggleUIButtonVisibility() {
        if (uiButton) {
            if (uiButton.style.display === 'none') {
                uiButton.style.display = 'block';
                saveSetting('hideUIButton', false);
            } else {
                uiButton.style.display = 'none';
                saveSetting('hideUIButton', true);
            }
        }
    }

    function openSettingsMenu() {
        const darkMode = isDarkTheme();

        // Disable floating button while modal is open
        uiButton.style.pointerEvents = 'none';
        uiButton.style.opacity = '0.5';

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
        overlay.style.zIndex = '9998';
        overlay.onclick = () => {
            document.body.removeChild(overlay);
            uiButton.style.pointerEvents = 'auto';
            uiButton.style.opacity = '1';
        };

        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = '50%';
        menu.style.left = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
        menu.style.backgroundColor = darkMode ? '#222' : '#fff';
        menu.style.color = darkMode ? '#eee' : '#000';
        menu.style.padding = '20px 20px 20px 20px';
        menu.style.borderRadius = '12px';
        menu.style.boxShadow = '0 8px 24px rgba(0,0,0,0.6)';
        menu.style.width = '320px';
        menu.style.zIndex = '9999';
        menu.style.fontSize = '14px';
        menu.style.lineHeight = '1.5';
        menu.style.textAlign = 'left';
        menu.onclick = e => e.stopPropagation();

        menu.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                <a href="https://greasyfork.org/en/scripts/533654-youtube-ui-enhancer-resize-thumbnails-modify-layout-more" target="_blank" style="text-decoration:none;color:inherit;font-size:20px;font-weight:bold;">
                    🪄 YouTube UI Enhancer
                </a>
                <button id="closeOverlay" style="background:none;border:none;color:${darkMode ? 'white' : 'black'};font-size:26px;line-height:1;cursor:pointer;padding:0;margin-left:10px;padding-bottom:5px;">×</button>
            </div>
            <label style="display:block; margin-bottom:10px;">Videos Per Row: <input id="videosPerRow" type="number" min="1" value="${settings.videosPerRow}" style="width:60px;"/></label>
            <label style="display:block; margin-bottom:20px;">Shorts Per Row: <input id="shortsPerRow" type="number" min="1" value="${settings.shortsPerRow}" style="width:60px;"/></label>
            <label style="display:block; margin-bottom:10px;">
                <input id="disableShorts" type="checkbox" ${settings.disableShorts ? 'checked' : ''} /> Hide Shorts Section
            </label>
            <label style="display:block; margin-bottom:20px;">
                <input id="enableShowMoreFix" type="checkbox" ${settings.enableShowMoreFix ? 'checked' : ''} /> Expand Shorts Automatically
            </label>
            <div style="margin-top:20px; margin-bottom:20px; border-top:1px solid ${darkMode ? 'white' : 'lightgrey'};"></div>

            <label style="display:block; margin-bottom:20px;">
                <input id="hideUIButton" type="checkbox" ${settings.hideUIButton ? 'checked' : ''} /> Hide Script Button (Alt+Shift+U to Show)
            </label>
            <button id="saveSettingsBtn" style="padding:8px 14px;background:#065fd4;color:white;border:none;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;">Save Changes</button>
            <button id="resetSettingsBtn" style="margin-left:10px;padding:8px 14px;background:none;color:${darkMode ? 'white' : 'black'};border:1px solid lightgrey;border-radius:8px;font-size:15px;font-weight:500;cursor:pointer;">Reset to Default</button>
        `;

        overlay.appendChild(menu);
        document.body.appendChild(overlay);

        document.getElementById('closeOverlay').onclick = () => {
            document.body.removeChild(overlay);
            uiButton.style.pointerEvents = 'auto';
            uiButton.style.opacity = '1';
        };

        document.getElementById('saveSettingsBtn').onclick = () => {
            const showMoreBefore = settings.enableShowMoreFix;
            saveSetting('videosPerRow', parseInt(document.getElementById('videosPerRow').value, 10));
            saveSetting('shortsPerRow', parseInt(document.getElementById('shortsPerRow').value, 10));
            saveSetting('disableShorts', document.getElementById('disableShorts').checked);
            saveSetting('enableShowMoreFix', document.getElementById('enableShowMoreFix').checked);
            saveSetting('hideUIButton', document.getElementById('hideUIButton').checked);

            if (document.getElementById('hideUIButton').checked) {
                uiButton.style.display = 'none';
            } else {
                uiButton.style.display = 'block';
            }

            if (showMoreBefore !== document.getElementById('enableShowMoreFix').checked) {
                location.reload();
            }

            enableShowMoreFix();
            document.body.removeChild(overlay);
            uiButton.style.pointerEvents = 'auto';
            uiButton.style.opacity = '1';
        };

        document.getElementById('resetSettingsBtn').onclick = () => {
            resetSettings();
            document.body.removeChild(overlay);
            uiButton.style.pointerEvents = 'auto';
            uiButton.style.opacity = '1';
        };
    }

    createSettingsButton();

    // Hide or show button when navigating to the home or subscriptions page
    function checkPageAndToggleUIButton() {
        const isHomeOrSubscriptions = window.location.pathname === '/' || window.location.pathname === '/feed/subscriptions';
        if (isHomeOrSubscriptions) {
            uiButton.style.display = settings.hideUIButton ? 'none' : 'block';
        } else {
            uiButton.style.display = 'none';
        }
    }

    // Listen for page navigation changes and handle button visibility
    window.addEventListener('yt-navigate-finish', checkPageAndToggleUIButton);
    checkPageAndToggleUIButton();
})();
