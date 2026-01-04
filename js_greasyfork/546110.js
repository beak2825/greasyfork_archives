// ==UserScript==
// @name         kici.moe+
// @namespace    http://tampermonkey.net/
// @version      4.9
// @description  Redirects homestuck.com and enhances homestuck.kici.moe with a settings menu.
// @author       StafkiGTN, Cascade, chris_pie, Unknown
// @license MIT
// @match        *://*.homestuck.com/*
// @match        *://homestuck.kici.moe/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546110/kicimoe%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/546110/kicimoe%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KICI_HOSTNAME = 'homestuck.kici.moe';
    const OFFICIAL_DOMAIN_PART = 'homestuck.com';

    // --- Script Mode Router ---
    // This is the most important part of the script. It cleanly separates the two main functions.

    if (window.location.hostname.includes(OFFICIAL_DOMAIN_PART)) {
        // MODE 1: REDIRECTOR
        // If we are on any homestuck.com page, do nothing but redirect.
        const redirectEnabled = GM_getValue('redirector_enabled', true);
        if (redirectEnabled) {
            const currentPath = window.location.pathname + window.location.search;
            window.location.replace(`https://${KICI_HOSTNAME}${currentPath}`);
        }
        // No other code runs in this mode.

    } else if (window.location.hostname.includes(KICI_HOSTNAME)) {
        // MODE 2: ENHANCER
        // If we are on kici.moe, load all the enhancement modules and the settings UI.

        // --- MODULE DEFINITIONS ---
        const modules = {
            'redirector': {
                name: 'Enable Redirection',
                author: 'StafkiGTN',
                description: 'Automatically redirect from homestuck.com to here.',
                enabled: GM_getValue('redirector_enabled', true),
                init: () => {} // This module only affects the other domain.
           },
            'keyboardNav': {
                name: 'Keyboard Navigation',
                author: 'Cascade',
                description: 'Use left/right arrow keys to navigate between pages.',
                enabled: GM_getValue('keyboardNav_enabled', true),
                init: () => {
                    // Pages where keyboard navigation should be disabled
                    const disabledPages = [
                        '/story/2792', '/story/5263', '/story/5368', '/story/3438',
                        '/story/5398', '/story/5427', '/story/8127', '/story/5309',
                    ];

                    // Check if current page is in the disabled list
                    const currentPath = window.location.pathname;
                    if (disabledPages.some(page => currentPath.endsWith(page))) {
                        return; // Don't enable keyboard navigation on these pages
                    }

                    document.addEventListener('keydown', function(e) {
                        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                            return;
                        }
                        let navButton;
                        if (e.key === 'ArrowLeft') {
                            navButton = document.querySelector('a[href*="/story/"][title="Previous page"]');
                            if (!navButton) {
                                navButton = document.querySelector('a[href*="/story/"] > img[alt="Previous page"]');
                                if(navButton) navButton = navButton.parentElement;
                            }
                        } else if (e.key === 'ArrowRight') {
                            navButton = document.querySelector('a[href*="/story/"][title="Next page"]');
                            if (!navButton) {
                                navButton = document.querySelector('a[href*="/story/"] > img[alt="Next page"]');
                                if(navButton) navButton = navButton.parentElement;
                            }
                        }
                        if (navButton && navButton.href) {
                            window.location.href = navButton.href;
                        }
                    });
                }
            },
            'textSizer': {
                name: 'Text Size & Layout',
                author: 'Unknown',
                description: 'Increases text size and readability.',
                enabled: GM_getValue('textSizer_enabled', true),
                init: () => {
                    GM_addStyle(`
                        .o_story-container { max-width: 800px !important; }
                        .type-hs-small--md { font-size: 18px !important; }
                    `);
                }
            },
            'linkFixer': {
                name: 'Fix homestuck.com Links',
                author: 'Cascade & StafkiGTN',
                description: 'Rewrites old links to point to kici.moe.',
                enabled: GM_getValue('linkFixer_enabled', true),
                init: () => {
                    const observer = new MutationObserver(() => {
                        document.querySelectorAll(`a[href*="${OFFICIAL_DOMAIN_PART}"]`).forEach(link => {
                            link.href = link.href.replace(OFFICIAL_DOMAIN_PART, KICI_HOSTNAME);
                        });
                    });
                    observer.observe(document.documentElement, { childList: true, subtree: true });
                }
            },
            'dyslexicFont': {
                name: 'OpenDyslexic Font',
                author: 'StafkiGTN',
                description: 'Uses OpenDyslexic font for all text. (Warning: may ruin immersion in some parts)',
                enabled: GM_getValue('dyslexicFont_enabled', false),
                init: () => {
                    GM_addStyle(`
                        @font-face {
                            font-family: 'OpenDyslexic';
                            src: url('https://file.garden/Zlu9wAzAvyz0wKHn/opendyslexic/OpenDyslexic-Regular.otf') format('opentype');
                        }
                        body, * { font-family: 'OpenDyslexic', sans-serif !important; }
                    `);
                }
            }
        };

        // --- SETTINGS PANEL UI ---
        function createSettingsPanel() {
            GM_addStyle(`
                #kici-plus-settings-panel, .kici-plus-settings-btn-replacement {
                    font-family: 'Courier New', Courier, monospace;
                    font-weight: bold;
                    border-radius: 0 !important;
                }
                #kici-plus-settings-panel { display: none; position: fixed; top: 10px; left: 10px; z-index: 99999; background: #333; color: white; border: 1px solid #666; padding: 15px; max-width: 320px; max-height: 90vh; overflow-y: auto; }
                #kici-plus-settings-panel h3 { margin-top: 0; border-bottom: 1px solid #555; padding-bottom: 5px; }
                #kici-plus-settings-panel label { display: block; margin: 15px 0; cursor: pointer; }
                #kici-plus-settings-panel input { margin-right: 10px; vertical-align: middle; }
                #kici-plus-settings-panel .mod-name { font-weight: bold; }
                #kici-plus-settings-panel .mod-author { font-size: 0.8em; font-weight: normal; color: #ccc; margin-left: 8px; }
                #kici-plus-settings-panel .mod-desc { font-size: 0.9em; color: #ccc; display: block; margin-top: 4px; font-weight: normal; }
                .kici-plus-settings-btn-replacement { background: #B8B8B8; color: white; border: none; padding: 8px 12px; cursor: pointer; font-size: 14px; }
            `);

            const settingsPanel = document.createElement('div');
            settingsPanel.id = 'kici-plus-settings-panel';

            let panelContent = '<h3>kici.moe+ Settings</h3>';
            for (const key in modules) {
                const mod = modules[key];
                panelContent += `
                    <label>
                        <input type="checkbox" id="${key}_cb" ${mod.enabled ? 'checked' : ''}/>
                        <span class="mod-name">${mod.name}</span><span class="mod-author">by ${mod.author}</span>
                        <span class="mod-desc">${mod.description}</span>
                    </label>`;
            }
            settingsPanel.innerHTML = panelContent;
            document.body.appendChild(settingsPanel);

            for (const key in modules) {
                document.getElementById(`${key}_cb`).addEventListener('change', (e) => {
                    GM_setValue(`${key}_enabled`, e.target.checked);
                    window.location.reload();
                });
            }

            const observer = new MutationObserver((mutations, obs) => {
                const footerLogo = document.querySelector('img[src*="footer_logo"]');
                if (footerLogo && !document.querySelector('.kici-plus-settings-btn-replacement')) {
                    const settingsBtn = document.createElement('button');
                    settingsBtn.textContent = 'kici.moe+ Settings';
                    settingsBtn.className = 'kici-plus-settings-btn-replacement';

                    settingsBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
                    });
                    footerLogo.parentNode.replaceChild(settingsBtn, footerLogo);
                    obs.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }

        // --- INITIALIZATION ---
        function initialize() {
            createSettingsPanel();
            for (const key in modules) {
                if (modules[key].enabled) {
                    modules[key].init();
                }
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }
})();