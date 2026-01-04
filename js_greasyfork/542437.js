// ==UserScript==
// @name         Grok Streamer Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blurs sensitive information to protect your privacy on grok.com.
// @author       Ported by Blanklspeaker, Adapted from original plugin by Prism (https://github.com/imjustprism/Grokness)
// @match        https://grok.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542437/Grok%20Streamer%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/542437/Grok%20Streamer%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const logger = {
        error: (...args) => console.error('[StreamerMode]', ...args)
    };

    let styleElement = null;

    const baseStyles = `
.streamer-mode-active img.aspect-square.h-full.w-full[alt="pfp"] {
    filter: blur(8px) !important;
}

.streamer-mode-active .sidebar-user-info .display-name,
.streamer-mode-active [data-sidebar="menu"] .group\\/conversation-item span.flex-1.select-none,
.streamer-mode-active span.flex-1.select-none.text-nowrap.max-w-full.overflow-hidden.inline-block {
    filter: blur(5px) !important;
    padding: 0 4px !important;
    margin: 0 -4px !important;
    display: inline-block !important;
    width: calc(100% + 8px) !important;
    position: relative !important;
}

.streamer-mode-active .p-1.min-w-0.text-sm .text-sm.font-medium,
.streamer-mode-active .p-1.min-w-0.text-sm .text-secondary.truncate {
    filter: blur(5px) !important;
    padding: 0 4px !important;
    margin: 0 -4px !important;
    display: inline-block !important;
    width: calc(100% + 8px) !important;
    position: relative !important;
}

.streamer-mode-active div.text-xs.flex.flex-row.gap-1.p-3.text-secondary.opacity-30 {
    filter: blur(5px) !important;
    padding: 0 4px !important;
    margin: 0 -4px !important;
    display: inline-block !important;
    width: calc(100% + 8px) !important;
    position: relative !important;
}

.streamer-mode-active #grok-feature-flags-menu-item {
    filter: blur(5px) !important;
}
    `;

    function getDynamicStyles(emailOnly) {
        if (emailOnly) {
            return `
html.streamer-mode-active .p-1.min-w-0.text-sm .text-secondary.truncate {
    filter: blur(5px) !important;
    padding: 0 4px !important;
    margin: 0 -4px !important;
    display: inline-block !important;
    width: calc(100% + 8px) !important;
    position: relative !important;
}

html.streamer-mode-active div.text-xs.flex.flex-row.gap-1.p-3.text-secondary.opacity-30 {
    filter: blur(5px) !important;
    padding: 0 4px !important;
    margin: 0 -4px !important;
    display: inline-block !important;
    width: calc(100% + 8px) !important;
    position: relative !important;
}
            `;
        }
        return baseStyles.replace(/\.streamer-mode-active/g, 'html.streamer-mode-active');
    }

    function updateStylesheetAndClass() {
        try {
            const isEnabled = GM_getValue('enabled', true);
            const emailOnly = GM_getValue('emailOnly', false);

            if (styleElement) {
                styleElement.remove();
                styleElement = null;
            }

            document.documentElement.classList.remove('streamer-mode-active');

            let dynamicStyles = '';

            if (emailOnly) {
                dynamicStyles = getDynamicStyles(true);
                document.documentElement.classList.add('streamer-mode-active');
            } else if (isEnabled) {
                dynamicStyles = getDynamicStyles(false);
                document.documentElement.classList.add('streamer-mode-active');
            }

            if (dynamicStyles) {
                styleElement = GM_addStyle(dynamicStyles);
            }
        } catch (err) {
            logger.error('Failed to update stylesheet or class:', err);
        }
    }

    function createToggle(initialChecked, labelId) {
        const button = document.createElement('button');
        button.type = 'button';
        button.role = 'switch';
        button.className = 'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-[1px] border-transparent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ring-card-border ring-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-dove dark:data-[state=checked]:bg-ivory dark:data-[state=unchecked]:bg-button-secondary-selected';
        button.value = 'on';
        if (labelId) {
            button.setAttribute('aria-labelledby', labelId);
        }

        const span = document.createElement('span');
        span.className = 'pointer-events-none block h-4 w-4 rounded-full bg-white dark:bg-background shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 ms-0.5 data-[state=checked]:translate-x-5 rtl:data-[state=checked]:-translate-x-5 dark:data-[state=unchecked]:bg-overlay';

        button.appendChild(span);

        function setChecked(checked) {
            button.setAttribute('aria-checked', checked ? 'true' : 'false');
            button.dataset.state = checked ? 'checked' : 'unchecked';
            span.dataset.state = checked ? 'checked' : 'unchecked';
        }

        setChecked(initialChecked);

        button.addEventListener('click', () => {
            const current = button.getAttribute('aria-checked') === 'true';
            setChecked(!current);
        });

        return button;
    }

    function injectSettings() {
        const targetLabelText = 'Show Conversation Previews in History';
        const observer = new MutationObserver((mutations) => {
            const labels = document.querySelectorAll('div.text-sm.font-medium');
            for (let label of labels) {
                if (label.innerText.trim() === targetLabelText) {
                    const labelWrapper = label.parentElement; // max-w-sm min-w-0
                    const previewRow = labelWrapper.parentElement; // flex flex-row ...
                    if (previewRow && !document.getElementById('streamer-mode-row')) {
                        const container = previewRow.parentElement; // flex-col gap-6

                        // Create row for Streamer Mode
                        const streamerRow = document.createElement('div');
                        streamerRow.className = previewRow.className;
                        streamerRow.id = 'streamer-mode-row';

                        const streamerLabelWrapper = document.createElement('div');
                        streamerLabelWrapper.className = labelWrapper.className;
                        const streamerLabelId = 'streamer-mode-label';
                        streamerLabelWrapper.id = streamerLabelId;

                        const streamerLabel = document.createElement('div');
                        streamerLabel.className = 'text-sm font-medium';
                        streamerLabel.innerText = 'Streamer Mode';

                        streamerLabelWrapper.appendChild(streamerLabel);
                        streamerRow.appendChild(streamerLabelWrapper);

                        const streamerToggleWrapper = document.createElement('div');
                        streamerToggleWrapper.className = 'text-right min-w-24';

                        const streamerToggle = createToggle(GM_getValue('enabled', true), streamerLabelId);
                        streamerToggle.addEventListener('click', () => {
                            const checked = streamerToggle.getAttribute('aria-checked') === 'true';
                            GM_setValue('enabled', checked);
                            updateStylesheetAndClass();
                        });

                        streamerToggleWrapper.appendChild(streamerToggle);
                        streamerRow.appendChild(streamerToggleWrapper);

                        container.insertBefore(streamerRow, previewRow.nextSibling);

                        // Create row for Blur Email Only
                        const emailRow = document.createElement('div');
                        emailRow.className = previewRow.className;
                        emailRow.id = 'email-only-row';

                        const emailLabelWrapper = document.createElement('div');
                        emailLabelWrapper.className = labelWrapper.className;
                        const emailLabelId = 'email-only-label';
                        emailLabelWrapper.id = emailLabelId;

                        const emailLabel = document.createElement('div');
                        emailLabel.className = 'text-sm font-medium';
                        emailLabel.innerText = 'Blur Email Only';

                        emailLabelWrapper.appendChild(emailLabel);
                        emailRow.appendChild(emailLabelWrapper);

                        const emailToggleWrapper = document.createElement('div');
                        emailToggleWrapper.className = 'text-right min-w-24';

                        const emailToggle = createToggle(GM_getValue('emailOnly', false), emailLabelId);
                        emailToggle.addEventListener('click', () => {
                            const checked = emailToggle.getAttribute('aria-checked') === 'true';
                            GM_setValue('emailOnly', checked);
                            updateStylesheetAndClass();
                        });

                        emailToggleWrapper.appendChild(emailToggle);
                        emailRow.appendChild(emailToggleWrapper);

                        container.insertBefore(emailRow, streamerRow.nextSibling);
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run the update function and inject settings
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateStylesheetAndClass();
            injectSettings();
        }, { once: true });
    } else {
        updateStylesheetAndClass();
        injectSettings();
    }

    // Expose functions to toggle and configure via console
    window.toggleStreamerMode = function() {
        const currentEnabled = GM_getValue('enabled', true);
        GM_setValue('enabled', !currentEnabled);
        updateStylesheetAndClass();
        console.log('[StreamerMode] Enabled:', !currentEnabled);
    };

    window.setStreamerModeEmailOnly = function(value) {
        GM_setValue('emailOnly', !!value);
        updateStylesheetAndClass();
        console.log('[StreamerMode] Email Only:', !!value);
    };

    console.log('[StreamerMode] Loaded. Use toggleStreamerMode() in console to toggle on/off. Use setStreamerModeEmailOnly(true/false) to toggle blurring only email.');
})();