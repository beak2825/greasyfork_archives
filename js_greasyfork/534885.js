// ==UserScript==
// @name         Eye in the Cloud - A Google AI Studio Focused Experience
// @namespace    https://github.com/soitgoes-again/eyeinthecloud
// @version      0.639
// @description  Get focused by hiding the clutter, hide chat history, lag free text box, VIBE Mode, and themes!
// @author       so it goes...again
// @match        https://aistudio.google.com/*
// @resource     MAIN_CSS https://raw.githubusercontent.com/soitgoes-again/eyeinthecloud/main/css/main.css
// @resource     POPUP_CSS https://raw.githubusercontent.com/soitgoes-again/eyeinthecloud/main/css/modal-popup.css
// @resource     SNIPPETS_CSS https://raw.githubusercontent.com/soitgoes-again/eyeinthecloud/main/css/modal-snippets.css
// @resource     EYE_MODAL_CSS https://raw.githubusercontent.com/soitgoes-again/eyeinthecloud/main/css/modal-eye.css
// @resource     PROMPT_COMPOSER_CSS https://raw.githubusercontent.com/soitgoes-again/eyeinthecloud/main/css/modal-promptcomposer.css
// @resource     GOOGLE_OVERRIDES_CSS https://raw.githubusercontent.com/soitgoes-again/eyeinthecloud/main/css/google-overrides.css
// @resource     DOS_THEME_CSS https://raw.githubusercontent.com/soitgoes-again/eyeinthecloud/main/css/theme.dos.css
// @resource     NATURE_THEME_CSS https://raw.githubusercontent.com/soitgoes-again/eyeinthecloud/main/css/theme.nature.css
// @resource     THEME_TEMPLATE_CSS https://raw.githubusercontent.com/soitgoes-again/eyeinthecloud/main/css/theme.template.css
// @resource     PERSONAL_THEME_CSS https://raw.githubusercontent.com/soitgoes-again/eyeinthecloud/main/css/theme.personal.css
// @resource     PROMPT_TEMPLATES https://raw.githubusercontent.com/soitgoes-again/eyeinthecloud/main/js/prompt_templates.json
// @resource     SNIPPETS_JSON https://raw.githubusercontent.com/soitgoes-again/eyeinthecloud/main/js/snippets.json
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534885/Eye%20in%20the%20Cloud%20-%20A%20Google%20AI%20Studio%20Focused%20Experience.user.js
// @updateURL https://update.greasyfork.org/scripts/534885/Eye%20in%20the%20Cloud%20-%20A%20Google%20AI%20Studio%20Focused%20Experience.meta.js
// ==/UserScript==

!function() {
    "use strict";
    window.Config = {
        selectors: {
            leftSidebar: "ms-navbar",
            rightSidebar: "ms-right-side-panel",
            header: "ms-header-root",
            toolbar: "ms-toolbar",
            chatInput: "ms-prompt-input-wrapper textarea",
            runButton: 'button.run-button[aria-label="Run"]',
            overallLayout: "body > app-root > ms-app > div",
            chatContainer: "ms-autoscroll-container",
            userTurn: 'ms-chat-turn:has([data-turn-role="User"])',
            aiTurn: 'ms-chat-turn:has([data-turn-role="Model"])',
            aiTurnMoreOptionsButton: 'ms-chat-turn-options button[aria-label="Open options"], ms-chat-turn-options button[aria-label="More options"]',
            aiTurnContextMenuItems: 'div.cdk-overlay-pane:not([style*="display: none"]) .mat-mdc-menu-item, div.cdk-overlay-pane:not([style*="display: none"]) .mdc-list-item',
            siteHeading: "h1.gradient-text",
            promptChipsContainer: ".chips-container",
            inputPlaceholderOverlay: ".placeholder-overlay",
            chatTurnFooter: ".turn-footer",
            aiTurnCodeBlock: "pre > code, pre, ms-code-block",
            zeroStateWrapper: ".zero-state-wrapper",
            anyChatTurn: "ms-chat-turn",
            siteDisclaimerText: ".disclaimer-container span.disclaimer",
            promptInputWrapper: ".prompt-input-wrapper-container"
        },
        ids: {
            scriptButton: "advanced-control-toggle-button",
            popup: "advanced-control-popup",
            aiThemeStudioButton: "eic-global-ai-theme-gen-btn",
            aiThemeModalOverlay: "eic-eye-modal-overlay",
            aiThemeModal: "eic-eye-modal",
            aiThemeModalSvgBg: "eic-modal-svg-background",
            aiThemeModalTextarea: "eic-eye-modal-textarea",
            pageOverlay: "eic-modal-overlay"
        },
        classes: {
            layoutHide: "adv-controls-hide-ui",
            aiThemeModalVisible: "eic-eye-modal-animate-in",
            aiThemeTextareaVisible: "eic-textarea-visible"
        },
        settingsKey: "eyeinthecloud",
        defaultSettings: {
            showAllHistory: !0,
            numTurnsToShow: 10,
            historyViewMode: "turns",
            hideLeftSidebar: !1,
            hideRightSidebar: !1,
            hideHeader: !1,
            hideToolbar: !1,
            headingText: "Eye in the Cloud",
            hidePromptChips: !1,
            hideFeedbackButtons: !1,
            activeTheme: "default",
            promptSnippets: JSON.parse(GM_getResourceText("SNIPPETS_JSON")),
            showSnippetToolbarInModal: !0,
            vibeModeActive: !1,
            personalThemePalette: {
                svgDefault: {},
                svgHover: {},
                svgActive: {},
                confirmationMessage: "The Eye sees your vision take form."
            },
            customProfileAssets: {
                colorPalette: {},
                svgDefault: {},
                svgHover: {},
                svgActive: {}
            },
            isCustomProfileActive: !1,
            popupActiveTab: "history"
        },
        icons: {
            visible: "visibility",
            hidden: "visibility_off",
            dos: "dos",
            nature: "nature",
            default: "eyeInTheCloud"
        },
        animationDefaults: {
            modalFadeInScale: "eicModalAppear 0.4s ease-out forwards",
            modalFadeOutScale: "eicModalDisappear 0.3s ease-in forwards",
            elementFadeIn: "eicElementFadeIn 0.3s ease-out forwards",
            elementFadeOut: "eicElementFadeOut 0.2s ease-in forwards"
        },
        vars: {
            avgSnippetButtonWidth: 120,
            moreSnippetsButtonWidth: 60,
            maxRenderedToolbarSnippets: 10
        },
        textStrings: {
            deleteActionMenuItemText: "delete"
        },
        minExchangesForProfileTheme: 3
    };
    window.State = {
        isVibeModeActive: !1,
        activeTheme: "default",
        scriptToggleButton: null,
        popupElement: null,
        aiThemeStudioButton: null,
        aiThemeModalOverlay: null,
        aiThemeModal: null,
        aiThemeModalSvgBg: null,
        aiThemeModalTextarea: null,
        pageOverlay: null,
        chatObserver: null,
        debounceTimer: null,
        uiUpdateDebounceTimer: null,
        waitingForThemeAiTurnAfter: null,
        aiThemeModalState: "idle",
        aiThemeModalCurrentSvgData: {},
        aiThemeModalConfirmationText: ""
    };
    window.Settings = {
        async load() {
            const storedSettings = JSON.parse(await GM_getValue(window.Config.settingsKey) || "{}");
            const defaultSettingsCopy = JSON.parse(JSON.stringify(window.Config.defaultSettings));
            window.State.settings = function mergeDeep(target, source) {
                for (const key in source) {
                    if (Array.isArray(source[key])) {
                        target[key] = source[key]?.length > 0 ? source[key] : target[key];
                    } else if (source[key] && "object" == typeof source[key]) {
                        target[key] = mergeDeep(target[key] || {}, source[key]);
                    } else if (void 0 !== source[key]) {
                        target[key] = source[key];
                    }
                }
                return target;
            }(defaultSettingsCopy, storedSettings);
        },
        async save() {
            try {
                const settingsToSave = {
                    ...window.State.settings,
                    vibeModeActive: window.State.isVibeModeActive
                };
                await GM_setValue(window.Config.settingsKey, JSON.stringify(settingsToSave));
                return !0;
            } catch (error) {
                return !1;
            }
        },
        update(key, value, updateUI = !0) {
            window.State.settings[key] = value;
            this.save();
            if (updateUI && window.UI) {
                if ("numTurnsToShow" === key || "showAllHistory" === key || "historyViewMode" === key) {
                    window.HistoryManager.applyVisibilityRules();
                    if (window.HistoryManager && "function" == typeof window.HistoryManager.updateHistoryControlsState) {
                        window.HistoryManager.updateHistoryControlsState();
                    }
                } else if ([ "hideLeftSidebar", "hideRightSidebar", "hideHeader", "hideToolbar" ].includes(key)) {
                    window.UI.applyLayoutRules();
                }
                if ("headingText" === key) {
                    window.UI.updateHeadingText();
                }
                if ("hidePromptChips" === key) {
                    window.UI.updatePromptChipsVisibility();
                }
                if ("hideFeedbackButtons" === key) {
                    window.UI.updateTurnFooterVisibility();
                }
                if (window.Popup && window.State.popupElement && window.State.popupElement.classList.contains("visible")) {
                    window.Popup.updateUIState();
                }
            }
        },
        batchUpdate(settingsToUpdate, updateUI = !0) {
            let updated = !1;
            for (const key in settingsToUpdate) {
                if (window.State.settings.hasOwnProperty(key) && JSON.stringify(window.State.settings[key]) !== JSON.stringify(settingsToUpdate[key])) {
                    window.State.settings[key] = settingsToUpdate[key];
                    updated = !0;
                }
            }
            if (updated) {
                this.save();
                if (updateUI) {
                    if (window.UI) {
                        window.UI.applyLayoutRules?.();
                        window.HistoryManager.applyVisibilityRules?.();
                        window.UI.updateHeadingText?.();
                        window.UI.updatePromptChipsVisibility?.();
                        window.UI.updateTurnFooterVisibility?.();
                    }
                    if (window.Popup && window.State.popupElement?.classList.contains("visible")) {
                        window.Popup.updateUIState?.();
                    }
                }
            }
        },
        async resetToDefaults() {
            await GM_deleteValue(window.Config.settingsKey);
            await this.load();
            window.ThemeManager.applyTheme("default");
        }
    };
    window.Styles = {
        coreStyles: `\n        /* Basic UI hiding classes - essential structure only */\n        .adv-controls-hide-ui-sidebars ms-navbar,\n        .adv-controls-hide-ui-sidebars ms-right-side-panel {\n            display: none !important;\n        }\n        .adv-controls-hide-ui-header ms-header-root {\n            display: none !important;\n        }\n        .adv-controls-hide-ui-toolbar ms-toolbar {\n            display: none !important;\n        }\n    `,
        addCoreStyles() {
            if (this.coreStyles) {
                GM_addStyle(this.coreStyles);
            }
        },
        addPopupStyles() {}
    };
    window.DOM = {
        createElement(tag, attributes = {}, children = []) {
            const element = document.createElement(tag);
            let svgIconName = null;
            for (const [key, value] of Object.entries(attributes)) {
                if ("className" === key) {
                    element.className = value;
                } else if ("textContent" === key) {
                    element.textContent = value;
                } else if ("events" === key) {
                    for (const [event, handler] of Object.entries(value)) {
                        element.addEventListener(event, handler);
                    }
                } else if ("svgIcon" === key) {
                    svgIconName = value;
                } else {
                    element.setAttribute(key, value);
                }
            }
            if (svgIconName && window.Icons) {
                const svgString = window.Icons.getSvgString(svgIconName);
                if (svgString) {
                    try {
                        const parser = new DOMParser;
                        const doc = parser.parseFromString(svgString, "image/svg+xml");
                        const svgNode = doc.documentElement;
                        if ("parsererror" === svgNode.nodeName || !svgNode) {
                            svgNode.querySelector("parsererror > div");
                        } else {
                            svgNode.classList.add("eic-injected-svg-node");
                            svgNode.classList.add(`eic-svg-${svgIconName}`);
                            if (attributes.textContent || attributes["aria-label"]) {
                                svgNode.setAttribute("aria-hidden", "true");
                            }
                            const svgTitle = svgNode.querySelector("title");
                            if (svgTitle) {
                                svgTitle.remove();
                            }
                            element.classList.add("eic-svg-icon-container");
                            try {
                                element.appendChild(svgNode);
                            } catch (appendError) {}
                        }
                    } catch (e) {}
                }
            }
            if (!Array.isArray(children)) {
                children = [ children ];
            }
            const filteredChildren = children.filter((child => child));
            filteredChildren.forEach((child => {
                try {
                    if ("string" == typeof child) {
                        element.appendChild(document.createTextNode(child));
                    } else {
                        element.appendChild(child);
                    }
                } catch (childError) {}
            }));
            return element;
        },
        createToggle(id, labelText, checked, onChange) {
            const container = this.createElement("div", {
                className: "toggle-setting"
            });
            const label = this.createElement("label", {
                className: "toggle-label",
                htmlFor: id,
                textContent: labelText
            });
            const toggle = this.createElement("input", {
                type: "checkbox",
                className: "basic-slide-toggle",
                id: id,
                events: {
                    change: e => onChange(e.target.checked)
                }
            });
            toggle.checked = checked;
            container.appendChild(label);
            container.appendChild(toggle);
            return container;
        }
    };
    window.NotificationManager = {
        showNotification(message, duration = 3e3) {
            const existingNotification = document.getElementById("eic-notification");
            if (existingNotification) {
                existingNotification.remove();
            }
            const notification = window.DOM.createElement("div", {
                id: "eic-notification",
                className: "eic-notification",
                textContent: message
            });
            document.body.appendChild(notification);
            setTimeout((() => notification.classList.add("show")), 10);
            setTimeout((() => {
                notification.classList.remove("show");
                setTimeout((() => notification.remove()), 300);
            }), duration);
        }
    };
    window.EventBus = {
        events: {},
        subscribe(eventName, callback) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            this.events[eventName].push(callback);
            return () => {
                this.events[eventName] = this.events[eventName].filter((cb => cb !== callback));
            };
        },
        publish(eventName, data) {
            if (this.events[eventName]) {
                this.events[eventName].forEach((callback => {
                    callback(data);
                }));
            }
        }
    };
    window.Icons = {
        defaults: {
            eyeInTheCloudDefault: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        "d": "M12,5C7,5,2.73,8.1,1,13.5c-0.31,0.62-0.31,1.38,0,2C2.73,20.9,7,24,12,24s9.27-3.1,11-8.5c0.31-0.62,0.31-1.38,0-2C21.27,8.1,17,5,12,5z",
                        "fill": "var(--eic-global-on-surface)"
                    }
                }, {
                    type: "path",
                    attrs: {
                        "d": "M12,14m-3,0a3,3 0 1,0 6,0a3,3 0 1,0 -6,0",
                        "fill": "var(--eic-global-on-secondary)"
                    }
                }, {
                    type: "path",
                    attrs: {
                        "d": "M1,13.5 C2.73,8.1 7,5 12,5 C17,5 21.27,8.1 23,13.5 Q17,12 12,12 Q7,12 1,13.5 Z",
                        "fill": "var(--eic-global-surface-variant)"
                    }
                } ]
            },
            eyeInTheCloudHover: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        "d": "M12,5C7,5,2.73,8.1,1,13.5c-0.31,0.62-0.31,1.38,0,2C2.73,20.9,7,24,12,24s9.27-3.1,11-8.5c0.31-0.62,0.31-1.38,0-2C21.27,8.1,17,5,12,5z",
                        "fill": "var(--eic-global-on-surface)"
                    }
                }, {
                    type: "path",
                    attrs: {
                        "d": "M12,14m-4,0a4,4 0 1,0 8,0a4,4 0 1,0 -8,0",
                        "fill": "var(--eic-global-on-secondary)"
                    }
                } ]
            },
            eyeInTheCloudActive: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        "d": "M12,5C7,5,2.73,8.1,1,13.5c-0.31,0.62-0.31,1.38,0,2C2.73,20.9,7,24,12,24s9.27-3.1,11-8.5c0.31-0.62,0.31-1.38,0-2C21.27,8.1,17,5,12,5z",
                        "fill": "var(--eic-global-on-surface)"
                    }
                }, {
                    type: "path",
                    attrs: {
                        "d": "M12,14m-5,0a5,5 0 1,0 10,0a5,5 0 1,0 -10,0",
                        "fill": "var(--eic-global-primary)"
                    }
                } ]
            },
            eyeModalClosed: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        "d": "M12,6C7,6,2.73,9.1,1,14.5c-0.31,0.62-0.31,1.38,0,2C2.73,21.9,7,25,12,25s9.27-3.1,11-8.5c0.31-0.62,0.31-1.38,0-2C21.27,9.1,17,6,12,6z",
                        "fill": "var(--eic-global-surface)",
                        "stroke": "var(--eic-global-outline)",
                        "stroke-width": "0.3"
                    }
                }, {
                    type: "path",
                    attrs: {
                        "d": "M1,14.5 C5,12 19,12 23,14.5 C19,17 5,17 1,14.5 Z",
                        "fill": "var(--eic-global-surface-variant)"
                    }
                } ]
            },
            close: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M0 0h24v24H0V0z",
                        fill: "none"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z",
                        fill: "currentColor"
                    }
                } ]
            },
            bolt: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M0 0h24v24H0V0z",
                        fill: "none"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M7 2v11h3v9l7-12h-4l4-8H7z",
                        fill: "currentColor"
                    }
                } ]
            },
            edit: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M0 0h24v24H0V0z",
                        fill: "none"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
                        fill: "currentColor"
                    }
                } ]
            },
            reset: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M0 0h24v24H0V0z",
                        fill: "none"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z",
                        fill: "currentColor"
                    }
                } ]
            },
            save: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M0 0h24v24H0V0z",
                        fill: "none"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z",
                        fill: "currentColor"
                    }
                } ]
            },
            cancel: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M0 0h24v24H0V0z",
                        fill: "none"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z",
                        fill: "currentColor"
                    }
                } ]
            },
            tune: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M0 0h24v24H0V0z",
                        fill: "none"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z",
                        fill: "currentColor"
                    }
                } ]
            },
            delete: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M0 0h24v24H0V0z",
                        fill: "none"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
                        fill: "currentColor"
                    }
                } ]
            },
            arrow_upward: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M0 0h24v24H0V0z",
                        fill: "none"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z",
                        fill: "currentColor"
                    }
                } ]
            },
            arrow_downward: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M0 0h24v24H0V0z",
                        fill: "none"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z",
                        fill: "currentColor"
                    }
                } ]
            },
            removed: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M0 0h24v24H0V0z",
                        fill: "none"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 10c-2.48 0-4.5-2.02-4.5-4.5S9.52 5.5 12 5.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z",
                        fill: "currentColor"
                    }
                } ]
            },
            vibe: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M12,3.5c-4.7,0-8.5,3.8-8.5,8.5s3.8,8.5,8.5,8.5s8.5-3.8,8.5-8.5S16.7,3.5,12,3.5z",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": 1.5
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M12,7.5c-2.5,0-4.5,2-4.5,4.5s2,4.5,4.5,4.5s4.5-2,4.5-4.5S14.5,7.5,12,7.5z M12,14.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S13.4,14.5,12,14.5z",
                        fill: "currentColor"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M4.5,9L3,10.5 M6,6L4.5,7.5 M9,4.5L7.5,6 M20,10.5L21,9 M19.5,7.5L18,6 M16.5,6L15,4.5 M4.5,15L3,13.5 M6,18L4.5,16.5 M9,19.5L7.5,18 M20,13.5L21,15 M19.5,16.5L18,18 M16.5,18L15,19.5",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": 1.5
                    }
                } ]
            },
            person: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M12,4c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4S14.2,4,12,4z",
                        fill: "currentColor"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M18,20c0-3.3-2.7-6-6-6s-6,2.7-6,6",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": 2
                    }
                } ]
            }
        },
        getIcon(iconNameOrData) {
            if ("object" == typeof iconNameOrData && null !== iconNameOrData) {
                return iconNameOrData;
            }
            if ("string" == typeof iconNameOrData) {
                const iconData = this.defaults[iconNameOrData];
                if (!iconData) {
                    return null;
                } else {
                    return iconData;
                }
            }
            return null;
        },
        createSvgElement: function(iconNameOrData, options = {}) {
            const iconData = "string" == typeof iconNameOrData ? this.getIcon(iconNameOrData) : iconNameOrData;
            if (!iconData) {
                return null;
            }
            if ("string" != typeof iconData.viewBox || !Array.isArray(iconData.elements)) {
                return null;
            }
            try {
                const ns = "http://www.w3.org/2000/svg";
                const svg = document.createElementNS(ns, "svg");
                svg.setAttribute("viewBox", iconData.viewBox);
                if ("background" !== options.mode) {
                    svg.setAttribute("width", options.width || iconData.width || "24px");
                    svg.setAttribute("height", options.height || iconData.height || "24px");
                }
                svg.setAttribute("fill", options.fill || "currentColor");
                if (options.preserveAspectRatio) {
                    svg.setAttribute("preserveAspectRatio", options.preserveAspectRatio);
                }
                if (options.className) {
                    svg.setAttribute("class", options.className);
                }
                if (options.stroke) {
                    svg.setAttribute("stroke", options.stroke);
                }
                if (options.strokeWidth) {
                    svg.setAttribute("stroke-width", options.strokeWidth);
                }
                iconData.elements.forEach((elData => {
                    if (!elData || "string" != typeof elData.type || "object" != typeof elData.attrs) {
                        return;
                    }
                    const element = document.createElementNS(ns, elData.type);
                    Object.entries(elData.attrs).forEach((([attr, value]) => {
                        element.setAttribute(attr, value);
                    }));
                    svg.appendChild(element);
                }));
                return svg;
            } catch (e) {
                return null;
            }
        },
        createAiGeneratedSvg: function(svgData) {
            if (!svgData || "object" != typeof svgData || !svgData.viewBox || !Array.isArray(svgData.elements)) {
                return null;
            }
            const svgElement = this.createSvgElement(svgData);
            if (!svgElement) {
                return null;
            } else {
                return svgElement;
            }
        },
        inject: function(element, iconNameOrData, options = {}) {
            const iconData = this.getIcon(iconNameOrData);
            if (iconData) {
                try {
                    const svgElement = this.createSvgElement(iconData, options);
                    if (!svgElement) {
                        throw new Error("Failed to create SVG element");
                    }
                    for (;element.firstChild; ) {
                        element.removeChild(element.firstChild);
                    }
                    element.appendChild(svgElement);
                } catch (e) {}
            }
        }
    };
    window.EIC_Icons_Personal = {
        buttonStates: {
            Default: {
                name: "Shutter_Default (Closed)",
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "rect",
                    attrs: {
                        "x": "3",
                        "y": "3",
                        "width": "18",
                        "height": "18",
                        "rx": "3",
                        "fill": "var(--eic-global-surface-variant)",
                        "stroke": "var(--eic-global-outline-variant)",
                        "stroke-width": "1"
                    }
                }, {
                    type: "circle",
                    attrs: {
                        "cx": "12",
                        "cy": "12",
                        "r": "5.5",
                        "fill": "var(--eic-global-outline)"
                    }
                }, {
                    type: "path",
                    attrs: {
                        "d": "M12,6.5 L12,17.5 M8,8 L16,16 M8,16 L16,8",
                        "stroke": "var(--eic-global-surface-variant)",
                        "stroke-width": "0.75",
                        "opacity": "0.6"
                    }
                }, {
                    type: "path",
                    attrs: {
                        "d": "M17,7 L16,7 M17,17 L16,17 M7,7 L8,7 M7,17 L8,17",
                        "stroke": "var(--eic-global-outline-variant)",
                        "stroke-width": "0.5",
                        "stroke-linecap": "round",
                        "opacity": "0.5"
                    }
                } ]
            },
            Hover: {
                name: "Shutter_Hover (Open Pupil)",
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "rect",
                    attrs: {
                        "x": "3",
                        "y": "3",
                        "width": "18",
                        "height": "18",
                        "rx": "3",
                        "fill": "var(--eic-global-surface-variant)",
                        "stroke": "var(--eic-global-primary)",
                        "stroke-width": "1.25"
                    }
                }, {
                    type: "circle",
                    attrs: {
                        "cx": "12",
                        "cy": "12",
                        "r": "5.5",
                        "fill": "var(--eic-global-background)"
                    }
                }, {
                    type: "circle",
                    attrs: {
                        "cx": "12",
                        "cy": "12",
                        "r": "2.5",
                        "fill": "var(--eic-global-primary)"
                    }
                }, {
                    type: "circle",
                    attrs: {
                        "cx": "10.8",
                        "cy": "10.8",
                        "r": "0.8",
                        "fill": "var(--eic-global-on-primary)",
                        "opacity": "0.7"
                    }
                }, {
                    type: "path",
                    attrs: {
                        "d": "M18,6 L15.5,6 M18,8.5 L18,6 M6,6 L8.5,6 M6,8.5 L6,6 M18,18 L15.5,18 M18,15.5 L18,18 M6,18 L8.5,18 M6,15.5 L6,18",
                        "stroke": "var(--eic-global-primary)",
                        "stroke-width": "0.75",
                        "stroke-linecap": "round"
                    }
                } ]
            },
            Active: {
                name: "Shutter_Active (Eye Inside)",
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "rect",
                    attrs: {
                        "x": "2.5",
                        "y": "2.5",
                        "width": "19",
                        "height": "19",
                        "rx": "3.5",
                        "fill": "var(--eic-global-primary-container)",
                        "stroke": "var(--eic-global-tertiary)",
                        "stroke-width": "1.5"
                    }
                }, {
                    type: "circle",
                    attrs: {
                        "cx": "12",
                        "cy": "12",
                        "r": "6",
                        "fill": "var(--eic-global-surface)"
                    }
                }, {
                    type: "circle",
                    attrs: {
                        "cx": "12",
                        "cy": "12",
                        "r": "3.5",
                        "fill": "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "circle",
                    attrs: {
                        "cx": "12",
                        "cy": "12",
                        "r": "1.5",
                        "fill": "var(--eic-global-on-tertiary)"
                    }
                }, {
                    type: "circle",
                    attrs: {
                        "cx": "10.5",
                        "cy": "10.5",
                        "r": "1",
                        "fill": "var(--eic-global-on-primary)",
                        "opacity": "0.8"
                    }
                }, {
                    type: "path",
                    attrs: {
                        "d": "M19,5 L17,5 L17,7 M5,5 L7,5 L7,7 M19,19 L17,19 L17,17 M5,19 L7,19 L7,17",
                        "fill": "none",
                        "stroke": "var(--eic-global-tertiary)",
                        "stroke-width": "1",
                        "stroke-linecap": "square"
                    }
                } ]
            }
        }
    };
    window.EIC_Icons_DOS = {
        buttonStates: {
            Default: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "rect",
                    attrs: {
                        x: "2",
                        y: "4",
                        width: "20",
                        height: "16",
                        rx: "1",
                        fill: "var(--eic-global-surface-variant)",
                        stroke: "var(--eic-global-outline)",
                        "stroke-width": "1"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "4",
                        y: "6",
                        width: "16",
                        height: "12",
                        fill: "var(--eic-global-surface)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "9",
                        y: "8",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-on-surface-variant)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "13",
                        y: "9",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-on-surface-variant)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "10",
                        y: "10",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-on-surface-variant)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "14",
                        y: "11",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-on-surface-variant)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "8",
                        y: "12",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-on-surface-variant)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "16",
                        y: "13",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-on-surface-variant)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "11",
                        y: "14",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-on-surface-variant)"
                    }
                } ]
            },
            Hover: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "rect",
                    attrs: {
                        x: "2",
                        y: "4",
                        width: "20",
                        height: "16",
                        rx: "1",
                        fill: "var(--eic-global-surface-variant)",
                        stroke: "var(--eic-global-primary)",
                        "stroke-width": "1.5"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "4",
                        y: "6",
                        width: "16",
                        height: "12",
                        fill: "var(--eic-global-surface)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "9",
                        y: "9",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "10",
                        y: "9",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "11",
                        y: "9",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "12",
                        y: "9",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "13",
                        y: "9",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "14",
                        y: "9",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "8",
                        y: "10",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "15",
                        y: "10",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "8",
                        y: "11",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "15",
                        y: "11",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "9",
                        y: "12",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "10",
                        y: "12",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "11",
                        y: "12",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "12",
                        y: "12",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "13",
                        y: "12",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "14",
                        y: "12",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-primary)"
                    }
                } ]
            },
            Active: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "rect",
                    attrs: {
                        x: "2",
                        y: "4",
                        width: "20",
                        height: "16",
                        rx: "1",
                        fill: "var(--eic-global-surface-variant)",
                        stroke: "var(--eic-global-tertiary)",
                        "stroke-width": "2"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "4",
                        y: "6",
                        width: "16",
                        height: "12",
                        fill: "var(--eic-global-surface)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "9",
                        y: "9",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "10",
                        y: "8",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "11",
                        y: "8",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "12",
                        y: "8",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "13",
                        y: "8",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "14",
                        y: "9",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "15",
                        y: "10",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "15",
                        y: "11",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "14",
                        y: "12",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "13",
                        y: "13",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "12",
                        y: "13",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "11",
                        y: "13",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "10",
                        y: "13",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "9",
                        y: "12",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "8",
                        y: "11",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "8",
                        y: "10",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-tertiary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "11",
                        y: "10",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-on-surface-variant)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "12",
                        y: "10",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-on-surface-variant)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "11",
                        y: "11",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-on-surface-variant)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "12",
                        y: "11",
                        width: "1",
                        height: "1",
                        fill: "var(--eic-global-on-surface-variant)"
                    }
                } ]
            }
        }
    };
    window.EIC_Icons_Nature = {
        buttonStates: {
            Default: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "rect",
                    attrs: {
                        x: "0",
                        y: "0",
                        width: "24",
                        height: "12",
                        fill: "var(--eic-global-secondary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "0",
                        y: "12",
                        width: "24",
                        height: "12",
                        fill: "var(--eic-global-surface-variant)"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M8,12 a4,4 0 0,1 8,0",
                        fill: "var(--eic-global-primary)",
                        stroke: "var(--eic-global-on-primary)",
                        "stroke-width": "0.5"
                    }
                }, {
                    type: "line",
                    attrs: {
                        x1: "0",
                        y1: "12",
                        x2: "24",
                        y2: "12",
                        stroke: "var(--eic-global-outline)",
                        "stroke-width": "1"
                    }
                } ]
            },
            Hover: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "rect",
                    attrs: {
                        x: "0",
                        y: "0",
                        width: "24",
                        height: "12",
                        fill: "var(--eic-global-secondary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "0",
                        y: "12",
                        width: "24",
                        height: "12",
                        fill: "var(--eic-global-surface-variant)"
                    }
                }, {
                    type: "circle",
                    attrs: {
                        cx: "12",
                        cy: "10",
                        r: "3.5",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "circle",
                    attrs: {
                        cx: "12",
                        cy: "10",
                        r: "1.5",
                        fill: "var(--eic-global-on-primary)"
                    }
                }, {
                    type: "line",
                    attrs: {
                        x1: "0",
                        y1: "12",
                        x2: "24",
                        y2: "12",
                        stroke: "var(--eic-global-outline)",
                        "stroke-width": "1"
                    }
                } ]
            },
            Active: {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "rect",
                    attrs: {
                        x: "0",
                        y: "0",
                        width: "24",
                        height: "12",
                        fill: "var(--eic-global-secondary)"
                    }
                }, {
                    type: "rect",
                    attrs: {
                        x: "0",
                        y: "12",
                        width: "24",
                        height: "12",
                        fill: "var(--eic-global-surface-variant)"
                    }
                }, {
                    type: "circle",
                    attrs: {
                        cx: "12",
                        cy: "9",
                        r: "4",
                        fill: "var(--eic-global-primary)"
                    }
                }, {
                    type: "circle",
                    attrs: {
                        cx: "12",
                        cy: "9",
                        r: "2",
                        fill: "var(--eic-global-on-primary)"
                    }
                }, {
                    type: "path",
                    attrs: {
                        d: "M12,3 L12,0 M12,15 L12,18 M7,4.5 L5,3 M17,4.5 L19,3 M7,13.5 L5,15 M17,13.5 L19,15",
                        stroke: "var(--eic-global-primary)",
                        "stroke-width": "1",
                        "stroke-linecap": "round"
                    }
                }, {
                    type: "line",
                    attrs: {
                        x1: "0",
                        y1: "12",
                        x2: "24",
                        y2: "12",
                        stroke: "var(--eic-global-outline)",
                        "stroke-width": "1"
                    }
                } ]
            }
        }
    };
    window.ThemeManager = {
        staticThemeStyleElements: {
            personal: null,
            dos: null,
            nature: null
        },
        events: {
            THEME_CHANGED: "themeChanged"
        },
        loadThemes() {
            this.staticThemeStyleElements.personal = document.getElementById("eic-theme-personal-css");
            this.staticThemeStyleElements.dos = document.getElementById("eic-theme-dos-css");
            this.staticThemeStyleElements.nature = document.getElementById("eic-theme-nature-css");
        },
        applyTheme(themeName) {
            const effectiveThemeName = !themeName ? "default" : themeName;
            const classesToRemove = Array.from(document.body.classList).filter((cls => cls.startsWith("theme-") || "eic-theme-active" === cls));
            document.body.classList.remove(...classesToRemove);
            this.staticThemeStyleElements.personal.disabled = !0;
            this.staticThemeStyleElements.dos.disabled = !0;
            this.staticThemeStyleElements.nature.disabled = !0;
            let dynamicStyleTag = document.getElementById("eic-customized-palette-styles");
            if (dynamicStyleTag) {
                dynamicStyleTag.disabled = !0;
            }
            if (effectiveThemeName && "default" !== effectiveThemeName) {
                document.body.classList.add("eic-theme-active");
                document.body.classList.add(`theme-${effectiveThemeName}-applied`);
                const customProfileIsActive = window.State.settings.isCustomProfileActive;
                if ("personal" === effectiveThemeName && customProfileIsActive) {
                    if (!dynamicStyleTag) {
                        dynamicStyleTag = document.createElement("style");
                        dynamicStyleTag.id = "eic-customized-palette-styles";
                        document.head.appendChild(dynamicStyleTag);
                    }
                    let cssPaletteText = `body.eic-theme-active.theme-personal-applied {\n`;
                    for (const [key, value] of Object.entries(window.State.settings.customProfileAssets.colorPalette)) {
                        if (key.startsWith("--eic-global-")) {
                            cssPaletteText += `  ${key}: ${String(value).replace("!important", "").trim()} !important;\n`;
                        }
                    }
                    cssPaletteText += "}\n";
                    dynamicStyleTag.textContent = cssPaletteText;
                    dynamicStyleTag.disabled = !1;
                } else if ("personal" === effectiveThemeName) {
                    this.staticThemeStyleElements.personal.disabled = !1;
                } else if ("dos" === effectiveThemeName) {
                    this.staticThemeStyleElements.dos.disabled = !1;
                } else if ("nature" === effectiveThemeName) {
                    this.staticThemeStyleElements.nature.disabled = !1;
                }
            }
            if (window.State.activeTheme !== effectiveThemeName) {
                const previousTheme = window.State.activeTheme;
                window.State.activeTheme = effectiveThemeName;
                window.Settings.update("activeTheme", effectiveThemeName, !1);
                if (window.EventBus) {
                    window.EventBus.publish(this.events.THEME_CHANGED, {
                        previousTheme: previousTheme,
                        newTheme: effectiveThemeName
                    });
                }
            }
        },
        removeActiveTheme() {
            this.applyTheme("default");
        },
        getSvgIconData(stateKey) {
            const activeTheme = window.State.activeTheme;
            const customProfileIsActive = window.State.settings.isCustomProfileActive;
            let iconData;
            if ("personal" === activeTheme) {
                if (customProfileIsActive) {
                    iconData = window.State.settings.customProfileAssets[`svg${stateKey}`];
                } else {
                    iconData = window.EIC_Icons_Personal.buttonStates[stateKey];
                }
            } else if ("dos" === activeTheme) {
                iconData = window.EIC_Icons_DOS.buttonStates[stateKey];
            } else if ("nature" === activeTheme) {
                iconData = window.EIC_Icons_Nature.buttonStates[stateKey];
            } else if ("default" === activeTheme) {
                iconData = window.Icons.defaults[`eyeInTheCloud${stateKey}`];
            } else {
                iconData = window.Icons.defaults[`eyeInTheCloud${stateKey}`];
            }
            return iconData;
        }
    };
    window.HistoryManager = {
        calculateSliderFillPercentage(value, min, max) {
            if (max > min) {
                return (value - min) / (max - min) * 100;
            } else {
                return max === min && value >= min ? 100 : 0;
            }
        },
        updateSliderState(slider, numTurnsValue, sliderLabel, isVibeModeActive) {
            const isShowingAll = window.State.settings.showAllHistory;
            slider.disabled = isShowingAll || isVibeModeActive;
            slider.style.opacity = isShowingAll || isVibeModeActive ? "0.5" : "1";
            if (sliderLabel) {
                let labelTextContent;
                if (isVibeModeActive) {
                    labelTextContent = "Exchanges Shown: ";
                } else {
                    labelTextContent = "exchanges" === window.State.settings.historyViewMode ? "Exchanges Shown: " : "Turns Shown: ";
                }
                sliderLabel.textContent = labelTextContent;
            }
            if (isVibeModeActive) {
                numTurnsValue.textContent = "1";
            } else {
                numTurnsValue.textContent = isShowingAll ? "All" : slider.value;
            }
            let fillPercentage;
            if (isVibeModeActive) {
                fillPercentage = this.calculateSliderFillPercentage(1, parseInt(slider.min), parseInt(slider.max));
            } else if (isShowingAll) {
                fillPercentage = 0;
            } else {
                fillPercentage = this.calculateSliderFillPercentage(parseInt(slider.value), parseInt(slider.min), parseInt(slider.max));
            }
            slider.style.setProperty("--_slider-fill-percent", `${fillPercentage}%`);
        },
        applyVisibilityRules() {
            const visibilityPlan = this.getHistoryVisibilityPlan();
            window.UI.applyChatVisibilityDOM(visibilityPlan);
        },
        getHistoryVisibilityPlan() {
            const chatContainer = document.querySelector(window.Config.selectors.chatContainer);
            if (!chatContainer) {
                return new Set;
            }
            const isVibe = window.State.isVibeModeActive;
            let showAll, limitCount, effectiveViewMode;
            if (isVibe) {
                showAll = !1;
                limitCount = 1;
                effectiveViewMode = "exchanges";
            } else {
                showAll = window.State.settings.showAllHistory;
                limitCount = window.State.settings.numTurnsToShow;
                effectiveViewMode = window.State.settings.historyViewMode;
            }
            const allTurns = Array.from(chatContainer.querySelectorAll(`${window.Config.selectors.userTurn}, ${window.Config.selectors.aiTurn}`));
            const visibleTurnsSet = new Set;
            if (showAll) {
                allTurns.forEach((turn => visibleTurnsSet.add(turn)));
            } else if ("exchanges" === effectiveViewMode) {
                const aiTurns = Array.from(chatContainer.querySelectorAll(window.Config.selectors.aiTurn));
                const recentAiTurns = aiTurns.slice(-limitCount);
                recentAiTurns.forEach((aiTurn => {
                    visibleTurnsSet.add(aiTurn);
                    let previousElement = aiTurn.previousElementSibling;
                    for (;previousElement && !previousElement.matches(window.Config.selectors.userTurn) && !previousElement.matches(window.Config.selectors.aiTurn); ) {
                        previousElement = previousElement.previousElementSibling;
                    }
                    if (previousElement && previousElement.matches(window.Config.selectors.userTurn)) {
                        visibleTurnsSet.add(previousElement);
                    }
                }));
                if (0 === aiTurns.length && limitCount >= 1) {
                    const userTurns = Array.from(chatContainer.querySelectorAll(window.Config.selectors.userTurn));
                    if (userTurns.length > 0) {
                        visibleTurnsSet.add(userTurns[userTurns.length - 1]);
                    }
                }
            } else {
                const recentTurns = allTurns.slice(-limitCount);
                recentTurns.forEach((turn => visibleTurnsSet.add(turn)));
            }
            return visibleTurnsSet;
        },
        createHistoryPanel(panelElement) {
            if (!panelElement) {
                return;
            }
            for (;panelElement.firstChild; ) {
                panelElement.removeChild(panelElement.firstChild);
            }
            const DOM = window.DOM;
            const historyFieldset = DOM.createElement("fieldset", {
                className: "popup-section"
            });
            const showAllToggle = DOM.createToggle("show-all-history-toggle", "Show All History", window.State.settings.showAllHistory, (checked => {
                window.Settings.update("showAllHistory", checked);
                window.HistoryManager.applyVisibilityRules();
                window.HistoryManager.updateHistoryControlsState();
            }));
            showAllToggle.addEventListener("mouseover", (() => window.Popup?.updateTooltip("Toggle between showing all history or limiting it.")));
            showAllToggle.addEventListener("mouseout", (() => window.Popup?.updateTooltip()));
            historyFieldset.appendChild(showAllToggle);
            const sliderContainer = DOM.createElement("div", {
                className: "slider-container"
            });
            const sliderLabel = DOM.createElement("label", {
                htmlFor: "num-turns-slider"
            });
            const labelTextSpan = DOM.createElement("span", {
                textContent: "Currently Showing: "
            });
            const valueSpan = DOM.createElement("span", {
                id: "num-turns-value"
            });
            sliderLabel.appendChild(labelTextSpan);
            sliderLabel.appendChild(valueSpan);
            sliderContainer.appendChild(sliderLabel);
            const slider = DOM.createElement("input", {
                id: "num-turns-slider",
                type: "range",
                min: "1",
                max: "10",
                value: window.State.settings.numTurnsToShow,
                events: {
                    input: e => {
                        if (!window.State.settings.showAllHistory) {
                            const value = parseInt(e.target.value);
                            window.Settings.update("numTurnsToShow", value);
                            this.updateSliderState(e.target, document.getElementById("num-turns-value"), document.querySelector('label[for="num-turns-slider"] span:first-child'), window.State.isVibeModeActive);
                            window.HistoryManager.applyVisibilityRules();
                        }
                    }
                }
            });
            sliderContainer.appendChild(slider);
            historyFieldset.appendChild(sliderContainer);
            this.updateSliderState(slider, valueSpan, labelTextSpan, window.State.isVibeModeActive);
            const viewModeToggle = DOM.createToggle("history-view-mode-toggle", "View as Exchanges", "exchanges" === window.State.settings.historyViewMode, (checked => {
                window.Settings.update("historyViewMode", checked ? "exchanges" : "turns");
                window.HistoryManager.applyVisibilityRules();
                window.HistoryManager.updateHistoryControlsState();
            }));
            viewModeToggle.addEventListener("mouseover", (() => {
                const currentMode = window.State.settings.historyViewMode;
                const tooltipText = "exchanges" === currentMode ? "Currently viewing history as conversational exchanges" : "Switch to view history as conversational exchanges";
                window.Popup?.updateTooltip(tooltipText);
            }));
            viewModeToggle.addEventListener("mouseout", (() => window.Popup?.updateTooltip()));
            historyFieldset.appendChild(viewModeToggle);
            panelElement.appendChild(historyFieldset);
        },
        updateHistoryControlsState() {
            const showAllToggle = document.getElementById("show-all-history-toggle");
            const slider = document.getElementById("num-turns-slider");
            const numTurnsValue = document.getElementById("num-turns-value");
            const viewModeToggle = document.getElementById("history-view-mode-toggle");
            const sliderLabelTextSpan = document.querySelector('label[for="num-turns-slider"] > span:first-child');
            const isShowAll = window.State.settings.showAllHistory;
            const isVibe = window.State.isVibeModeActive;
            if (showAllToggle) {
                showAllToggle.checked = isShowAll;
                showAllToggle.disabled = isVibe;
                showAllToggle.style.opacity = isVibe ? "0.5" : "1";
                if (showAllToggle.parentElement && "LABEL" === showAllToggle.parentElement.tagName) {
                    showAllToggle.parentElement.style.opacity = isVibe ? "0.7" : "1";
                } else if (showAllToggle.closest(".toggle-setting")) {
                    showAllToggle.closest(".toggle-setting").style.opacity = isVibe ? "0.7" : "1";
                }
            }
            if (viewModeToggle) {
                viewModeToggle.checked = "exchanges" === window.State.settings.historyViewMode;
                viewModeToggle.disabled = isVibe || isShowAll;
                viewModeToggle.style.opacity = isVibe || isShowAll ? "0.5" : "1";
                if (viewModeToggle.parentElement && "LABEL" === viewModeToggle.parentElement.tagName) {
                    viewModeToggle.parentElement.style.opacity = isVibe || isShowAll ? "0.7" : "1";
                } else if (viewModeToggle.closest(".toggle-setting")) {
                    viewModeToggle.closest(".toggle-setting").style.opacity = isVibe || isShowAll ? "0.7" : "1";
                }
            }
            if (slider && numTurnsValue) {
                this.updateSliderState(slider, numTurnsValue, sliderLabelTextSpan, isVibe);
            }
        },
        updateSliderMax(newMaxFromHistory) {
            const slider = document.getElementById("num-turns-slider");
            const numTurnsValue = document.getElementById("num-turns-value");
            const sliderLabel = document.querySelector('label[for="num-turns-slider"] span:first-child');
            const newMax = Math.min(parseInt(newMaxFromHistory), 10);
            if (parseInt(slider.max) !== newMax) {
                slider.max = newMax;
            }
            slider.value = Math.min(window.State.settings.numTurnsToShow, newMax);
            this.updateSliderState(slider, numTurnsValue, sliderLabel, window.State.isVibeModeActive);
        },
        initialize() {}
    };
    window.UI = {
        init() {
            window.EventBus.subscribe(window.ThemeManager.events.THEME_CHANGED, (data => {
                this.updateThemeRelatedUI(data);
            }));
        },
        updateThemeRelatedUI(data) {
            this._updateColorBasedElements();
            this._updateIconsAndSVGs();
            this._updateComponentSpecificThemeElements();
            this._notifyComponentsOfThemeChange();
        },
        _updateColorBasedElements() {
            this.applyLayoutRules();
            this.updateHeadingText();
            this.updatePromptChipsVisibility();
            this.updateTurnFooterVisibility();
            this.updateInputPlaceholder();
        },
        _updateIconsAndSVGs() {
            window.EICButtonManager.update();
        },
        _updateComponentSpecificThemeElements() {
            if (window.ModalEye && window.ModalEye.updateThemeVisuals) {
                window.ModalEye.updateThemeVisuals();
            }
        },
        _notifyComponentsOfThemeChange() {
            if (window.Popup && window.State.popupElement?.classList.contains("visible")) {
                window.Popup.updateUIState();
            }
        },
        updateInterface() {
            this.updateThemeRelatedUI({
                previousTheme: "default",
                newTheme: window.State.activeTheme
            });
        },
        updateHeadingText() {
            const heading = document.querySelector(window.Config.selectors.siteHeading);
            if (heading && window.State?.settings) {
                heading.textContent = window.State.settings.headingText;
            }
        },
        updatePromptChipsVisibility() {
            const chips = document.querySelector(window.Config.selectors.promptChipsContainer);
            if (chips && window.State?.settings) {
                chips.style.display = window.State.isVibeModeActive || window.State.settings.hidePromptChips ? "none" : "";
            }
        },
        updateInputPlaceholder() {
            const overlay = document.querySelector(window.Config.selectors.inputPlaceholderOverlay);
            if (overlay) {
                overlay.textContent = "If I tried to write a million words a day...";
            }
        },
        updateTurnFooterVisibility() {
            if (!window.State?.settings) {
                return;
            }
            const footers = document.querySelectorAll(window.Config.selectors.chatTurnFooter);
            if (0 === footers.length) {
                return;
            }
            const shouldHide = window.State.isVibeModeActive || window.State.settings.hideFeedbackButtons;
            footers.forEach((footer => {
                footer.style.display = shouldHide ? "none" : "";
            }));
        },
        applyLayoutRules() {
            const layoutContainer = document.querySelector(window.Config.selectors.overallLayout);
            if (!layoutContainer || !window.State?.settings) {
                return;
            }
            const shouldHideLeftSidebar = window.State.isVibeModeActive ? !0 : window.State.settings.hideLeftSidebar;
            const shouldHideRightSidebar = window.State.isVibeModeActive ? !0 : window.State.settings.hideRightSidebar;
            const shouldHideHeader = window.State.isVibeModeActive ? !0 : window.State.settings.hideHeader;
            const shouldHideToolbar = window.State.isVibeModeActive ? !0 : window.State.settings.hideToolbar;
            const leftSidebarElement = document.querySelector(window.Config.selectors.leftSidebar);
            const rightSidebarElement = document.querySelector(window.Config.selectors.rightSidebar);
            if (leftSidebarElement) {
                leftSidebarElement.style.display = shouldHideLeftSidebar ? "none" : "";
            }
            if (rightSidebarElement) {
                rightSidebarElement.style.display = shouldHideRightSidebar ? "none" : "";
            }
            layoutContainer.classList.remove(`${window.Config.classes.layoutHide}-sidebars`);
            layoutContainer.classList.toggle(`${window.Config.classes.layoutHide}-header`, shouldHideHeader);
            layoutContainer.classList.toggle(`${window.Config.classes.layoutHide}-toolbar`, shouldHideToolbar);
        },
        applyChatVisibilityDOM(visibleElementsSet) {
            const chatContainer = document.querySelector(window.Config.selectors.chatContainer);
            if (!chatContainer) {
                return;
            }
            const allTurns = Array.from(chatContainer.querySelectorAll(`${window.Config.selectors.userTurn}, ${window.Config.selectors.aiTurn}`));
            let localDidHideSomething = !1;
            allTurns.forEach((turn => {
                const shouldBeVisible = visibleElementsSet.has(turn);
                const targetDisplay = shouldBeVisible ? "" : "none";
                if (turn.style.display !== targetDisplay) {
                    turn.style.display = targetDisplay;
                }
                if (!shouldBeVisible) {
                    localDidHideSomething = !0;
                }
            }));
            if (window.State.isCurrentlyHidden !== localDidHideSomething) {
                window.State.isCurrentlyHidden = localDidHideSomething;
                if (window.EICButtonManager && "function" == typeof window.EICButtonManager.update) {
                    window.EICButtonManager.update();
                }
            }
        }
    };
    window.promptcomposer = {
        modalElement: null,
        modalTextarea: null,
        modalContent: null,
        triggerButton: null,
        persistentModalText: "",
        isInitialized: !1,
        placeholderText: [ "Shortcuts:", "Ctrl+Shift+Enter (send)", "Alt+1…0 (insert snippet)", "Alt+M (more snippets)", "Tab/Shift+Tab (move focus)", "Esc (close composer)" ].join("\n"),
        clearButton: null,
        addButton: null,
        sendButton: null,
        snippetToolbarElement: null,
        moreSnippetsTriggerButton: null,
        renderedSnippetButtons: [],
        slidePanelElement: null,
        isSlidePanelOpen: !1,
        showModalBound: null,
        handleEscKeyBound: null,
        debouncedUpdateToolbarVisibilityBound: null,
        closeSlidePanelOnClickOutsideBound: null,
        init() {
            if (!this.isInitialized) {
                this.createModal();
                this.isInitialized = !0;
            }
            this.createTriggerButton();
            this.showModalBound = this.showModalBound || this.showModal.bind(this);
            this.handleEscKeyBound = this.handleEscKeyBound || this.handleEscKey.bind(this);
            this.debouncedUpdateToolbarVisibilityBound = this.debouncedUpdateToolbarVisibilityBound || ((func, delay) => {
                let timeout;
                return function(...args) {
                    const context = this;
                    clearTimeout(timeout);
                    timeout = setTimeout((() => func.apply(context, args)), delay);
                };
            })(this.updateToolbarButtonVisibility?.bind(this) || (() => {}), 200);
            this.closeSlidePanelOnClickOutsideBound = this.closeSlidePanelOnClickOutsideBound || this.closeSlidePanelOnClickOutside?.bind(this);
            window.removeEventListener("resize", this.debouncedUpdateToolbarVisibilityBound);
            window.addEventListener("resize", this.debouncedUpdateToolbarVisibilityBound);
            document.removeEventListener("eic-snippets-updated", this.updateSnippetToolbar.bind(this));
            document.addEventListener("eic-snippets-updated", (() => {
                if (this.modalElement?.classList.contains("visible")) {
                    this.updateSnippetToolbar();
                }
            }));
        },
        createTriggerButton() {
            const buttonId = "adv-modal-trigger-btn";
            const targetContainerSelector = window.Config.selectors.promptInputWrapper;
            const existingButton = document.getElementById(buttonId);
            if (!existingButton || !document.body.contains(existingButton)) {
                if (this.triggerButton && !document.body.contains(this.triggerButton)) {
                    this.triggerButton = null;
                }
                if (!this.triggerButton) {
                    const parentContainer = document.querySelector(targetContainerSelector);
                    if (!parentContainer) {
                        return;
                    }
                    const button = window.DOM.createElement("button", {
                        id: buttonId,
                        className: "mdc-icon-button mat-mdc-icon-button mat-unthemed mat-mdc-button-base gmat-mdc-button adv-modal-trigger eic-hidden-by-default",
                        attributes: {
                            "mat-icon-button": "",
                            "aria-label": "Open Prompt Composer",
                            "mattooltip": "Open Prompt Composer"
                        }
                    });
                    const iconSpan = window.DOM.createElement("span", {
                        className: "material-symbols-outlined notranslate",
                        textContent: "chat_bubble"
                    });
                    button.appendChild(iconSpan);
                    button.appendChild(window.DOM.createElement("span", {
                        className: "mat-mdc-button-persistent-ripple mdc-icon-button__ripple"
                    }));
                    button.appendChild(window.DOM.createElement("span", {
                        className: "mat-focus-indicator"
                    }));
                    button.appendChild(window.DOM.createElement("span", {
                        className: "mat-mdc-button-touch-target"
                    }));
                    const buttonWrapper = window.DOM.createElement("div", {
                        className: "button-wrapper"
                    });
                    buttonWrapper.appendChild(button);
                    parentContainer.appendChild(buttonWrapper);
                    this.triggerButton = button;
                }
            } else {
                this.triggerButton = existingButton;
                existingButton.removeEventListener("click", this.showModalBound);
                this.showModalBound = this.showModalBound || this.showModal.bind(this);
                existingButton.addEventListener("click", this.showModalBound);
            }
        },
        createModal() {
            if (document.getElementById("adv-input-modal-overlay")) {
                this.modalElement = document.getElementById("adv-input-modal-overlay");
                this.modalContent = document.getElementById("adv-input-modal-content");
                this.modalTextarea = document.getElementById("adv-input-modal-textarea");
                this.clearButton = this.modalContent.querySelector(".clear-textarea-btn");
                this.addButton = this.modalContent.querySelector(".add-to-input-btn");
                this.sendButton = this.modalContent.querySelector(".send-prompt-btn");
                this.updateSnippetToolbar();
                return;
            }
            this.modalElement = window.DOM.createElement("div", {
                id: "adv-input-modal-overlay",
                className: "eic-modal-overlay",
                events: {
                    click: event => {
                        if (event.target === this.modalElement) {
                            this.handleCancel();
                        }
                    }
                }
            });
            this.modalContent = window.DOM.createElement("div", {
                id: "adv-input-modal-content"
            });
            this.snippetToolbarElement = this.buildAndAttachSnippetToolbar();
            this.slidePanelElement = this.buildAndAttachSlidePanel();
            this.modalTextarea = window.DOM.createElement("textarea", {
                id: "adv-input-modal-textarea",
                placeholder: this.placeholderText,
                events: {
                    click: event => event.stopPropagation(),
                    keydown: this.handleTextareaKeyDown.bind(this)
                }
            });
            this.modalContent.appendChild(this.modalTextarea);
            const buttonContainer = window.DOM.createElement("div", {
                className: "adv-modal-buttons"
            });
            buttonContainer.addEventListener("click", (event => event.stopPropagation()));
            const createModalButton = (text, className, onClick, id = null) => {
                const button = window.DOM.createElement("button", {
                    textContent: text,
                    className: className,
                    id: id,
                    events: {
                        click: onClick
                    }
                });
                return button;
            };
            this.clearButton = createModalButton("Clear Text", "eic-modal-button clear-textarea-btn", this.handleClearText.bind(this), "eic-composer-clear-btn");
            this.addButton = createModalButton("Add to Input", "eic-modal-button add-to-input-btn", this.handleAdd.bind(this), "eic-composer-add-btn");
            this.sendButton = createModalButton("Send", "eic-modal-button send-prompt-btn eic-button-primary", this.handleSend.bind(this), "eic-composer-send-btn");
            this.sendButton.addEventListener("keydown", (event => {
                if ("Tab" === event.key && event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
                    event.preventDefault();
                    this.modalTextarea.focus();
                }
            }));
            this.addButton.addEventListener("keydown", (event => {
                if (!("Tab" !== event.key || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey)) {
                    event.preventDefault();
                    this.modalTextarea.focus();
                }
            }));
            buttonContainer.appendChild(this.clearButton);
            buttonContainer.appendChild(this.addButton);
            buttonContainer.appendChild(this.sendButton);
            this.modalContent.appendChild(buttonContainer);
            this.modalElement.appendChild(this.modalContent);
            document.body.appendChild(this.modalElement);
        },
        buildAndAttachSnippetToolbar() {
            const existingToolbar = document.getElementById("eic-snippet-toolbar-container");
            if (existingToolbar) {
                existingToolbar.remove();
            }
            this.renderedSnippetButtons = [];
            if (!window.State.settings.showSnippetToolbarInModal || !window.State.settings.promptSnippets || 0 === window.State.settings.promptSnippets.length) {
                return null;
            }
            const toolbarContainerDiv = window.DOM.createElement("div", {
                id: "eic-snippet-toolbar-container",
                className: "snippet-toolbar-container"
            });
            const mainButtonsBarDiv = window.DOM.createElement("div", {
                className: "snippet-main-toolbar-bar"
            });
            const maxButtons = window.Config?.vars?.maxRenderedToolbarSnippets || 4;
            const snippets = window.State.settings.promptSnippets;
            for (let i = 0; i < Math.min(snippets.length, maxButtons); i++) {
                const snippet = snippets[i];
                const shortcutKey = i < 9 ? i + 1 : 9 === i ? 0 : null;
                const shortcutHint = null !== shortcutKey ? ` (Alt+${shortcutKey})` : "";
                const button = window.DOM.createElement("button", {
                    className: "snippet-button eic-snippet-btn-hidden",
                    textContent: snippet.name,
                    attributes: {
                        "data-snippet-index": i,
                        title: snippet.content.substring(0, 100) + (snippet.content.length > 100 ? "..." : "") + shortcutHint,
                        "aria-label": `${snippet.name}${shortcutHint}`
                    },
                    events: {
                        click: () => this.insertSnippetContent(snippet.content)
                    }
                });
                this.renderedSnippetButtons.push(button);
                mainButtonsBarDiv.appendChild(button);
            }
            const separatorDiv = window.DOM.createElement("div", {
                className: "snippet-toolbar-separator"
            });
            mainButtonsBarDiv.appendChild(separatorDiv);
            toolbarContainerDiv.appendChild(mainButtonsBarDiv);
            this.moreSnippetsTriggerButton = window.DOM.createElement("button", {
                className: "more-snippets-panel-trigger eic-snippet-btn-hidden",
                textContent: "...",
                attributes: {
                    title: "More snippets (Alt+M)",
                    "aria-label": "More snippets (Alt+M)"
                },
                events: {
                    click: event => this.toggleMoreSnippetsPanel(event)
                }
            });
            toolbarContainerDiv.appendChild(this.moreSnippetsTriggerButton);
            if (this.modalContent && this.modalContent.firstChild) {
                this.modalContent.insertBefore(toolbarContainerDiv, this.modalContent.firstChild);
            } else if (this.modalContent) {
                this.modalContent.appendChild(toolbarContainerDiv);
            }
            this.updateToolbarButtonVisibility();
            return toolbarContainerDiv;
        },
        buildAndAttachSlidePanel() {
            const existingPanel = document.getElementById("eic-snippet-slide-panel");
            if (existingPanel) {
                existingPanel.remove();
            }
            const panel = window.DOM.createElement("div", {
                id: "eic-snippet-slide-panel",
                className: "snippet-slide-panel",
                attributes: {
                    "aria-hidden": "false"
                }
            });
            const panelListDiv = window.DOM.createElement("div", {
                className: "slide-panel-list"
            });
            const emptyMessageDiv = window.DOM.createElement("div", {
                className: "slide-panel-empty-message",
                textContent: "Add snippets from library"
            });
            panel.appendChild(panelListDiv);
            panel.appendChild(emptyMessageDiv);
            if (this.modalContent) {
                this.modalContent.appendChild(panel);
            }
            this.slidePanelElement = panel;
            return panel;
        },
        populateSlidePanelContent() {
            if (!this.slidePanelElement) {
                return;
            }
            const panelList = this.slidePanelElement.querySelector(".slide-panel-list");
            const emptyMessage = this.slidePanelElement.querySelector(".slide-panel-empty-message");
            if (!panelList || !emptyMessage) {
                return;
            }
            for (;panelList.firstChild; ) {
                panelList.removeChild(panelList.firstChild);
            }
            const numVisible = this.renderedSnippetButtons.filter((btn => !btn.classList.contains("eic-snippet-btn-hidden"))).length;
            let added = 0;
            const snippets = window.State.settings.promptSnippets || [];
            for (let i = 0; i < snippets.length; i++) {
                if (i >= numVisible || i >= (window.Config?.vars?.maxRenderedToolbarSnippets || 4)) {
                    const snippet = snippets[i];
                    const shortcutKey = i < 9 ? i + 1 : 9 === i ? 0 : null;
                    const shortcutHint = null !== shortcutKey ? ` (Alt+${shortcutKey})` : "";
                    const item = document.createElement("div");
                    item.className = "slide-panel-snippet-item";
                    item.setAttribute("data-snippet-index", i);
                    item.setAttribute("title", `${snippet.content.substring(0, 100)}${snippet.content.length > 100 ? "..." : ""}${shortcutHint}`);
                    item.textContent = snippet.name;
                    item.addEventListener("click", (() => {
                        this.insertSnippetContent(snippet.content);
                        this.toggleMoreSnippetsPanel(null, !1);
                    }));
                    panelList.appendChild(item);
                    added++;
                }
            }
            emptyMessage.style.display = 0 === added ? "" : "none";
        },
        toggleMoreSnippetsPanel(event, forceState) {
            if (event) {
                event.stopPropagation();
            }
            if (!this.slidePanelElement) {
                this.slidePanelElement = this.buildAndAttachSlidePanel();
            }
            const shouldBeOpen = "boolean" == typeof forceState ? forceState : !this.isSlidePanelOpen;
            if (shouldBeOpen) {
                this.populateSlidePanelContent();
                this.slidePanelElement.classList.add("visible");
                this.slidePanelElement.setAttribute("aria-hidden", "false");
                this.isSlidePanelOpen = !0;
                document.addEventListener("click", this.closeSlidePanelOnClickOutsideBound, !0);
            } else {
                this.slidePanelElement.classList.remove("visible");
                this.slidePanelElement.setAttribute("aria-hidden", "true");
                this.isSlidePanelOpen = !1;
                document.removeEventListener("click", this.closeSlidePanelOnClickOutsideBound, !0);
                this.modalTextarea?.focus();
            }
        },
        closeDropdownOnClickOutside(event) {
            const dropdown = document.getElementById("snippets-dropdown");
            const moreButton = this.modalContent?.querySelector(".more-snippets-btn");
            if (dropdown && dropdown.classList.contains("visible") && !dropdown.contains(event.target) && (!moreButton || !moreButton.contains(event.target))) {
                dropdown.classList.remove("visible");
            }
        },
        updateSnippetToolbar() {
            const existingToolbar = document.getElementById("snippet-toolbar-container");
            if (existingToolbar) {
                existingToolbar.remove();
            }
            if (window.State.settings.showSnippetToolbarInModal) {
                this.buildAndAttachSnippetToolbar();
            }
        },
        toggleSnippetsDropdown(event) {
            event.stopPropagation();
            const dropdown = document.getElementById("snippets-dropdown");
            if (dropdown) {
                dropdown.classList.toggle("visible");
            }
        },
        insertSnippetContent(content) {
            if (!this.modalTextarea) {
                return;
            }
            const startPos = this.modalTextarea.selectionStart;
            const endPos = this.modalTextarea.selectionEnd;
            const textBefore = this.modalTextarea.value.substring(0, startPos);
            const textAfter = this.modalTextarea.value.substring(endPos);
            this.modalTextarea.value = textBefore + content + textAfter;
            this.persistentModalText = this.modalTextarea.value;
            const newCursorPos = startPos + content.length;
            this.modalTextarea.setSelectionRange(newCursorPos, newCursorPos);
            this.modalTextarea.dispatchEvent(new Event("input", {
                bubbles: !0,
                cancelable: !0
            }));
            this.modalTextarea.focus();
        },
        handleClearText() {
            if (this.modalTextarea) {
                this.modalTextarea.value = "";
                this.persistentModalText = "";
                this.modalTextarea.dispatchEvent(new Event("input", {
                    bubbles: !0,
                    cancelable: !0
                }));
                this.modalTextarea.focus();
            }
        },
        showModal() {
            if (!this.modalElement && this.isInitialized) {
                this.createModal();
            } else if (!this.isInitialized) {
                this.init();
            }
            if (this.modalElement) {
                this.modalTextarea.value = this.persistentModalText;
                this.modalElement.classList.add("visible");
                this.updateToolbarButtonVisibility();
                this.modalTextarea.focus();
                this.handleEscKeyBound = this.handleEscKeyBound || this.handleEscKey.bind(this);
                document.addEventListener("keydown", this.handleEscKeyBound);
            }
        },
        hideModal() {
            if (this.isSlidePanelOpen) {
                this.toggleMoreSnippetsPanel(null, !1);
            }
            if (this.modalElement) {
                this.modalElement.classList.remove("visible");
            }
            if (this.handleEscKeyBound) {
                document.removeEventListener("keydown", this.handleEscKeyBound);
            }
            if (this.closeSlidePanelOnClickOutsideBound) {
                document.removeEventListener("click", this.closeSlidePanelOnClickOutsideBound, !0);
            }
        },
        handleEscKey(event) {
            if ("Escape" === event.key) {
                if (this.isSlidePanelOpen) {
                    this.toggleMoreSnippetsPanel(null, !1);
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }
                if (this.modalElement?.classList.contains("visible")) {
                    this.handleCancel();
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        },
        handleCancel() {
            if (this.modalTextarea) {
                this.persistentModalText = this.modalTextarea.value;
                this.hideModal();
            }
        },
        handleAdd() {
            if (!this.modalTextarea) {
                return;
            }
            const realInput = document.querySelector(window.Config.selectors.chatInput);
            if (!realInput) {
                this.hideModal();
                return;
            }
            const textToAdd = this.modalTextarea.value;
            this.persistentModalText = "";
            this.modalTextarea.value = "";
            realInput.value += (realInput.value.trim() ? "\n" : "") + textToAdd;
            realInput.dispatchEvent(new Event("input", {
                bubbles: !0,
                cancelable: !0
            }));
            realInput.dispatchEvent(new Event("change", {
                bubbles: !0,
                cancelable: !0
            }));
            this.hideModal();
        },
        handleSend() {
            if (!this.modalTextarea) {
                return;
            }
            const realInput = document.querySelector(window.Config.selectors.chatInput);
            const realRunButton = document.querySelector(window.Config.selectors.runButton);
            if (!realInput || !realRunButton) {
                this.hideModal();
                return;
            }
            const textToSend = this.modalTextarea.value;
            if (textToSend.trim()) {
                realInput.value += (realInput.value.trim() ? "\n" : "") + textToSend;
                realInput.dispatchEvent(new Event("input", {
                    bubbles: !0,
                    cancelable: !0
                }));
                realInput.dispatchEvent(new Event("change", {
                    bubbles: !0,
                    cancelable: !0
                }));
                setTimeout((() => {
                    if (realRunButton && !realRunButton.disabled) {
                        realRunButton.click();
                        this.persistentModalText = "";
                        if (this.modalTextarea) {
                            this.modalTextarea.value = "";
                        }
                    } else {
                        this.persistentModalText = textToSend;
                    }
                    this.hideModal();
                }), 150);
            }
        },
        toggleModalVisibility() {
            if (!this.modalElement && this.isInitialized) {
                this.createModal();
            } else if (!this.isInitialized) {
                this.init();
            }
            if (this.modalElement) {
                if (this.modalElement.classList.contains("visible")) {
                    this.handleCancel();
                } else {
                    this.showModal();
                }
            }
        },
        updateToolbarButtonVisibility() {
            if (!this.snippetToolbarElement || !window.State.settings.showSnippetToolbarInModal) {
                if (this.snippetToolbarElement) {
                    this.snippetToolbarElement.style.display = "none";
                }
                return;
            }
            this.snippetToolbarElement.style.display = "";
            const containerWidth = this.snippetToolbarElement.offsetWidth;
            const avgButtonWidth = window.Config?.vars?.avgSnippetButtonWidth || 80;
            const moreButtonWidth = window.Config?.vars?.moreSnippetsButtonWidth || 40;
            const totalSnippets = window.State.settings.promptSnippets.length;
            let availableWidthForSnippets = containerWidth;
            if (totalSnippets > 0) {
                availableWidthForSnippets -= moreButtonWidth;
            }
            let numButtonsToMakeVisible = Math.floor(availableWidthForSnippets / avgButtonWidth);
            numButtonsToMakeVisible = Math.min(numButtonsToMakeVisible, totalSnippets, window.Config?.vars?.maxRenderedToolbarSnippets || 4);
            numButtonsToMakeVisible = Math.max(numButtonsToMakeVisible, 0);
            for (let i = 0; i < this.renderedSnippetButtons.length; i++) {
                if (i < numButtonsToMakeVisible) {
                    this.renderedSnippetButtons[i].classList.remove("eic-snippet-btn-hidden");
                } else {
                    this.renderedSnippetButtons[i].classList.add("eic-snippet-btn-hidden");
                }
            }
            this.moreSnippetsTriggerButton.classList.remove("eic-snippet-btn-hidden");
            if (0 === totalSnippets && this.isSlidePanelOpen) {
                this.toggleMoreSnippetsPanel(null, !1);
            }
        },
        handleTextareaKeyDown(event) {
            if (!event.ctrlKey || !event.shiftKey || "Enter" !== event.key) {
                if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                    const keyNumber = parseInt(event.key);
                    if (!isNaN(keyNumber) && keyNumber >= 0 && keyNumber <= 9) {
                        event.preventDefault();
                        const snippetIndex = 0 === keyNumber ? 9 : keyNumber - 1;
                        if (window.State.settings.promptSnippets && window.State.settings.promptSnippets.length > snippetIndex && window.State.settings.promptSnippets[snippetIndex]) {
                            this.insertSnippetContent(window.State.settings.promptSnippets[snippetIndex].content);
                        }
                        return;
                    }
                }
                if ("Tab" === event.key) {
                    if (event.shiftKey) {
                        if (this.addButton) {
                            event.preventDefault();
                            this.addButton.focus();
                        }
                    } else if (this.sendButton) {
                        event.preventDefault();
                        this.sendButton.focus();
                    }
                }
            } else {
                event.preventDefault();
                this.handleSend();
            }
        }
    };
    window.ModalEye = {
        _modalStateToSvgState: {
            "idle": "Default",
            "startOpening": "Default",
            "finishOpeningDefaultSvgFadeOut": "Default",
            "hoverSvgFadingIn": "Hover",
            "textareaFadingIn": "Hover",
            "awaitingInput": "Hover",
            "inputSentTextareaFadingOut": "Hover",
            "activeSvgFadingIn": "Active",
            "processing": "Active",
            "confirmationTextFadingIn": "Hover",
            "startClosingFromConfirmation": "Default",
            "startClosingFromInput": "Default",
            "closingToDefaultSvg": "Default",
            "modalZoomFadingOut": "Default"
        },
        _currentState: "idle",
        _confirmationText: "",
        _modalElement: null,
        _overlayElement: null,
        _svgBgElement: null,
        _textareaElement: null,
        _animationDuration: 500,
        _shortDelay: 400,
        _init() {
            this._overlayElement = window.DOM.createElement("div", {
                id: window.Config.ids.aiThemeModalOverlay,
                className: "eic-modal-overlay"
            });
            this._modalElement = window.DOM.createElement("div", {
                id: window.Config.ids.aiThemeModal,
                className: "eic-eye-modal"
            });
            this._svgBgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this._svgBgElement.id = window.Config.ids.aiThemeModalSvgBg;
            this._svgBgElement.classList.add("eic-modal-svg-background");
            this._textareaElement = window.DOM.createElement("textarea", {
                id: window.Config.ids.aiThemeModalTextarea,
                className: "eic-textarea"
            });
            this._modalElement.appendChild(this._svgBgElement);
            this._modalElement.appendChild(this._textareaElement);
            this._overlayElement.appendChild(this._modalElement);
            document.body.appendChild(this._overlayElement);
            this._overlayElement.addEventListener("click", (e => {
                if (e.target === this._overlayElement) {
                    this._handleExitAttempt();
                }
            }));
            document.addEventListener("keydown", (e => {
                if ("Escape" === e.key) {
                    this._handleExitAttempt();
                }
            }));
            this._textareaElement.addEventListener("keydown", (e => {
                if ("awaitingInput" === this._currentState && "Enter" === e.key && !e.shiftKey) {
                    e.preventDefault();
                    this.handleInputSend();
                }
            }));
            this._textareaElement.addEventListener("input", (() => {
                if (this._textareaElement.value.trim().startsWith("/")) {
                    this._textareaElement.classList.add("command-mode");
                } else {
                    this._textareaElement.classList.remove("command-mode");
                }
            }));
        },
        _getSvgForTheme: svgState => window.ThemeManager.getSvgIconData(svgState),
        _renderSvg(svgData) {
            for (;this._svgBgElement.firstChild; ) {
                this._svgBgElement.removeChild(this._svgBgElement.firstChild);
            }
            const svgElement = window.Icons.createSvgElement(svgData, {
                mode: "background",
                preserveAspectRatio: "xMidYMid meet"
            });
            this._svgBgElement.appendChild(svgElement);
        },
        _setModalAnimation(animationClass, makeVisible) {
            this._modalElement.classList.remove(window.Config.classes.aiThemeModalVisible, window.Config.classes.aiThemeModalAnimateOut, "visible", "eic-modal-active-state", "eic-ai-modal-zoom-fade-in", "eic-ai-modal-zoom-fade-out");
            if (animationClass) {
                this._modalElement.classList.add(animationClass);
            } else if (makeVisible) {
                this._modalElement.classList.add("visible");
            }
        },
        _setTextareaVisible(visible) {
            this._textareaElement.classList.toggle("eic-textarea-visible", visible);
        },
        _setSvgWithFade(svgData, fadeOutFirst = !1) {
            if (fadeOutFirst) {
                this._svgBgElement.style.opacity = "0";
                setTimeout((() => {
                    this._renderSvg(svgData);
                    this._svgBgElement.style.opacity = "1";
                }), this._animationDuration / 2);
            } else {
                this._renderSvg(svgData);
                this._svgBgElement.style.opacity = "1";
            }
        },
        _handleExitAttempt() {
            if ("processing" === this._currentState) {
                const confirmed = confirm("Theme generation in progress. Are you sure you want to cancel?");
                if (confirmed) {
                    this.setState("startClosingFromInput");
                }
            } else {
                this.setState("startClosingFromInput");
            }
        },
        setState(newState) {
            this._currentState = newState;
            switch (newState) {
              case "idle":
                this._overlayElement.classList.remove("visible");
                this._setModalAnimation(null, !1);
                this._setTextareaVisible(!1);
                this._textareaElement.value = "";
                this._textareaElement.readOnly = !1;
                this._textareaElement.disabled = !1;
                this._confirmationText = "";
                if (window.State?.pageOverlay?.classList.contains("visible")) {
                    window.State.pageOverlay.classList.remove("visible");
                    window.State.pageOverlay.style.pointerEvents = "none";
                }
                this._svgBgElement.style.opacity = "0";
                break;

              case "startOpening":
                this._overlayElement.classList.add("visible");
                this._setModalAnimation(window.Config.classes.aiThemeModalVisible, !0);
                this._setSvgWithFade(this._getSvgForTheme("Default"));
                setTimeout((() => this.setState("finishOpeningDefaultSvgFadeOut")), this._animationDuration);
                break;

              case "finishOpeningDefaultSvgFadeOut":
                this._svgBgElement.style.opacity = "0";
                setTimeout((() => this.setState("hoverSvgFadingIn")), this._shortDelay);
                break;

              case "hoverSvgFadingIn":
                this._setSvgWithFade(this._getSvgForTheme("Hover"));
                setTimeout((() => this.setState("textareaFadingIn")), this._animationDuration);
                break;

              case "textareaFadingIn":
                this._textareaElement.value = "";
                this._textareaElement.placeholder = "Describe the theme you desire or use commands:\n\n/eye: Theme based on AI's communication style\n/i: Theme tailored to YOUR communication style\n/reset: Restore default theme settings";
                this._textareaElement.readOnly = !1;
                this._textareaElement.disabled = !1;
                this._setTextareaVisible(!0);
                this._textareaElement.focus();
                this._currentState = "awaitingInput";
                break;

              case "inputSentTextareaFadingOut":
                this._setTextareaVisible(!1);
                this._textareaElement.disabled = !0;
                setTimeout((() => this.setState("activeSvgFadingIn")), this._animationDuration);
                break;

              case "activeSvgFadingIn":
                this._setSvgWithFade(this._getSvgForTheme("Active"), !0);
                setTimeout((() => this.setState("processing")), this._animationDuration);
                break;

              case "processing":
                window.State?.pageOverlay?.classList.add("visible");
                window.State.pageOverlay.style.pointerEvents = "auto";
                if (this._pendingUserInput) {
                    window.EyeCommands.processInputAndExecute(this._pendingUserInput);
                    this._pendingUserInput = null;
                }
                break;

              case "confirmationTextFadingIn":
                window.State?.pageOverlay?.classList.remove("visible");
                window.State.pageOverlay.style.pointerEvents = "none";
                this._textareaElement.value = this._confirmationText || "Theme applied successfully!";
                this._textareaElement.readOnly = !0;
                this._textareaElement.disabled = !0;
                this._setTextareaVisible(!0);
                this._svgBgElement.style.opacity = "0";
                setTimeout((() => {
                    this._setSvgWithFade(this._getSvgForTheme("Hover"));
                }), this._shortDelay);
                break;

              case "startClosingFromInput":
              case "startClosingFromConfirmation":
                this._setTextareaVisible(!1);
                setTimeout((() => this.setState("closingToDefaultSvg")), this._animationDuration / 2);
                break;

              case "closingToDefaultSvg":
                this._setSvgWithFade(this._getSvgForTheme("Default"), !0);
                setTimeout((() => this.setState("modalZoomFadingOut")), this._animationDuration);
                break;

              case "modalZoomFadingOut":
                this._setModalAnimation(window.Config.classes.aiThemeModalAnimateOut, !1);
                setTimeout((() => this.setState("idle")), this._animationDuration);
                break;

              default:
                this.setState("idle");
            }
        },
        open() {
            if (window.State?.popupElement?.classList.contains("visible") && window.Popup?.hide) {
                window.Popup.hide();
            }
            this.setState("startOpening");
        },
        handleInputSend() {
            const rawUserInput = this._textareaElement.value;
            const trimmedInput = rawUserInput.trim();
            const commandInput = trimmedInput.toLowerCase();
            if (trimmedInput) {
                if ("/eye" !== commandInput && "/i" !== commandInput || !(this._getChatTurnCount() < window.Config.minExchangesForProfileTheme)) {
                    if (!commandInput.startsWith("/") || "/eye" === commandInput || "/i" === commandInput || "/reset" === commandInput) {
                        this.setState("inputSentTextareaFadingOut");
                        this._pendingUserInput = rawUserInput;
                    } else {
                        window.NotificationManager.showNotification(`Unknown command: ${commandInput.split(" ")[0]}`);
                    }
                } else {
                    window.NotificationManager.showNotification("Chat more to unlock this insight!");
                }
            } else {
                window.NotificationManager.showNotification("Please enter a theme description or command.");
            }
        },
        processingComplete() {
            this._confirmationText = window.State.aiThemeModalConfirmationText || "Theme applied successfully!";
            this.setState("confirmationTextFadingIn");
        },
        _getChatTurnCount() {
            const userTurns = document.querySelectorAll(window.Config.selectors.userTurn).length;
            const aiTurns = document.querySelectorAll(window.Config.selectors.aiTurn).length;
            return userTurns + aiTurns;
        },
        updateThemeVisuals() {
            const fsmSvgState = this._modalStateToSvgState[this._currentState] || "Default";
            const svgDataToRender = this._getSvgForTheme(fsmSvgState);
            if (svgDataToRender) {
                this._renderSvg(svgDataToRender);
                this._svgBgElement.style.opacity = "idle" === this._currentState ? "0" : "1";
            }
        }
    };
    window.Popup = {
        _personalThemeVarLabels: {
            "--eic-global-background": "Overall Page Background",
            "--eic-global-surface": "Panel & Popup Background",
            "--eic-global-surface-variant": "Chat Bubble & Button Background",
            "--eic-global-surface-variant-alt": "Modal Input Area Background",
            "--eic-global-on-surface": "Main Text Color",
            "--eic-global-on-surface-variant": "Subtle & Button Text Color",
            "--eic-global-primary": "Main Action & Highlight Color",
            "--eic-global-on-primary": "Text on Main Action/Highlights",
            "--eic-global-outline": "Borders & Lines",
            "--eic-global-outline-variant": "Subtle Lines & Dividers",
            "--eic-global-tertiary": "Notification & Editor Header Color",
            "--eic-global-on-tertiary": "Text on Notifications/Editor Headers",
            "--eic-global-error": "Error Message Color",
            "--eic-global-on-error": "Text on Error Messages",
            "--eic-global-font-family": "Font Style",
            "--eic-global-font-size": "Overall Text Size",
            "--eic-global-shape-radius-small": "Button Corner Rounding",
            "--eic-global-shape-radius-medium": "Panel & Card Corner Rounding",
            "--eic-global-shape-radius-large": "Large Modal Corner Rounding",
            "--eic-global-shadow": "Shadow Effect",
            "--eic-global-scrim": "Dimming Overlay (Behind Popups)",
            "--eic-global-modal-overlay-bg": "Modal Background Overlay",
            "--eic-global-secondary": "Secondary Accent Color",
            "--eic-global-on-secondary": "Text on Secondary Accent"
        },
        _personalThemeVarTooltips: {
            "--eic-global-background": "Variable: --eic-global-background\nThe main background color of the entire AI Studio page.",
            "--eic-global-surface": "Variable: --eic-global-surface\nBackground for main content areas like sidebars, the main EIC settings popup, and similar panels.",
            "--eic-global-surface-variant": "Variable: --eic-global-surface-variant\nBackground for AI Studio chat bubbles, some EIC buttons (like theme editor controls), and hover states.",
            "--eic-global-surface-variant-alt": "Variable: --eic-global-surface-variant-alt\nBackground for larger text input areas within EIC modals (e.g., Input Lag Fix, Personal Theme Editor inputs).",
            "--eic-global-on-surface": "Variable: --eic-global-on-surface\nDefault text color on panels, popups, and chat bubbles.",
            "--eic-global-on-surface-variant": "Variable: --eic-global-on-surface-variant\nFor less prominent text, and text on some EIC buttons (like theme editor controls).",
            "--eic-global-primary": "Variable: --eic-global-primary\nImpacts: Run button, Model temperature sliders, active EIC theme buttons.",
            "--eic-global-on-primary": "Variable: --eic-global-on-primary\nImpacts: Text/icons inside the Run button and active EIC theme buttons.",
            "--eic-global-outline": "Variable: --eic-global-outline\nMain borders around input fields, panels, and dividing lines.",
            "--eic-global-outline-variant": "Variable: --eic-global-outline-variant\nFainter lines, like those within menus or for less distinct separation.",
            "--eic-global-tertiary": "Variable: --eic-global-tertiary\nImpacts: EIC notification popups, EIC Personal Theme Editor header background.",
            "--eic-global-on-tertiary": "Variable: --eic-global-on-tertiary\nImpacts: Text on EIC notification popups and the EIC Personal Theme Editor header.",
            "--eic-global-error": "Variable: --eic-global-error\nColor for error messages and warning indicators.",
            "--eic-global-on-error": "Variable: --eic-global-on-error\nText color on error message backgrounds.",
            "--eic-global-font-family": 'Variable: --eic-global-font-family\nExamples: "Arial, sans-serif", "Courier New, monospace".',
            "--eic-global-font-size": 'Variable: --eic-global-font-size\nExamples: "16px", "1rem", "0.9em".',
            "--eic-global-shape-radius-small": 'Variable: --eic-global-shape-radius-small\nExamples: "4px", "20px", "0px" (for square).',
            "--eic-global-shape-radius-medium": 'Variable: --eic-global-shape-radius-medium\nImpacts: Chat bubbles, EIC popups, etc. Examples: "8px", "0px".',
            "--eic-global-shape-radius-large": 'Variable: --eic-global-shape-radius-large\nImpacts: Larger EIC modals (e.g., Input Lag Fix editor). Examples: "12px", "0px".',
            "--eic-global-shadow": 'Variable: --eic-global-shadow\nDefines shadow color & properties. Example: "rgba(0,0,0,0.2) 0px 2px 5px".',
            "--eic-global-scrim": 'Variable: --eic-global-scrim\nColor for semi-transparent overlays that dim the main page when a popup is active. Example: "rgba(0,0,0,0.4)".',
            "--eic-global-modal-overlay-bg": 'Variable: --eic-global-modal-overlay-bg\nBackground for the full-screen overlay behind EIC modals (e.g., Input Lag Fix). Example: "rgba(50,50,50,0.6)".',
            "--eic-global-secondary": "Variable: --eic-global-secondary\nWe haven't spotted where AI Studio uses this yet! Could be used by EIC themes.",
            "--eic-global-on-secondary": "Variable: --eic-global-on-secondary\nText color for the Secondary Accent Color above."
        },
        activeTab: "history",
        showAiThemeInputModal() {
            if (window.ModalEye && "function" == typeof window.ModalEye.open) {
                window.ModalEye.open();
            }
        },
        togglePersonalThemeEditor() {
            const editor = document.getElementById("eic-personal-theme-editor");
            if (editor) {
                editor.style.display = "none" === editor.style.display || !editor.style.display ? "flex" : "none";
                if ("flex" === editor.style.display) {
                    this.loadPersonalPaletteToEditor();
                }
            }
        },
        loadPersonalPaletteToEditor() {
            const customActive = window.State.settings.isCustomProfileActive;
            const palette = customActive && window.State.settings.customProfileAssets.colorPalette ? window.State.settings.customProfileAssets.colorPalette : this._getComputedThemeVariables();
            Object.entries(palette).forEach((([varName, value]) => {
                const input = document.querySelector(`#eic-personal-theme-editor input[data-varname="${varName}"]`);
                if (input) {
                    input.value = value;
                    if ("color" === input.type) {
                        const preview = input.previousElementSibling;
                        if (preview && preview.classList.contains("color-preview")) {
                            preview.style.backgroundColor = value;
                        }
                    }
                }
            }));
        },
        savePersonalPalette() {
            const editor = document.getElementById("eic-personal-theme-editor");
            if (!editor) {
                return;
            }
            const editedColors = {};
            const inputs = editor.querySelectorAll("input[data-varname]");
            inputs.forEach((input => {
                if (input.getAttribute("data-varname").startsWith("--eic-global-")) {
                    editedColors[input.getAttribute("data-varname")] = input.value;
                }
            }));
            const currentProfileActive = window.State.settings.isCustomProfileActive;
            if (!currentProfileActive) {
                if (window.EIC_Icons_Personal && window.EIC_Icons_Personal.buttonStates) {
                    window.State.settings.customProfileAssets.svgDefault = JSON.parse(JSON.stringify(window.EIC_Icons_Personal.buttonStates.Default));
                    window.State.settings.customProfileAssets.svgHover = JSON.parse(JSON.stringify(window.EIC_Icons_Personal.buttonStates.Hover));
                    window.State.settings.customProfileAssets.svgActive = JSON.parse(JSON.stringify(window.EIC_Icons_Personal.buttonStates.Active));
                }
            }
            window.State.settings.customProfileAssets.colorPalette = editedColors;
            window.Settings.update("customProfileAssets", window.State.settings.customProfileAssets);
            window.Settings.update("isCustomProfileActive", !0);
            if ("personal" === window.State.activeTheme && window.ThemeManager) {
                window.ThemeManager.applyTheme("personal");
            }
            this.togglePersonalThemeEditor();
            this.showNotification("Personal theme customized and saved!");
        },
        handleCancelPersonalThemeEdit() {
            this.togglePersonalThemeEditor();
        },
        resetPersonalPalette() {
            if (confirm("Are you sure you want to reset your personal theme to its factory default settings? This will clear any AI-generated or manually edited personal themes.")) {
                window.Settings.update("isCustomProfileActive", !1);
                if ("personal" === window.State.activeTheme && window.ThemeManager) {
                    window.ThemeManager.applyTheme("personal");
                }
                if ("flex" === document.getElementById("eic-personal-theme-editor")?.style.display) {
                    this.loadPersonalPaletteToEditor();
                }
                this.showNotification("Personal theme reset to factory defaults.");
            }
        },
        showNotification(message, duration = 3e3) {
            const existingNotification = document.getElementById("eic-notification");
            if (existingNotification) {
                existingNotification.remove();
            }
            const notification = window.DOM.createElement("div", {
                id: "eic-notification",
                className: "eic-notification",
                textContent: message
            });
            document.body.appendChild(notification);
            setTimeout((() => notification.classList.add("show")), 10);
            setTimeout((() => {
                notification.classList.remove("show");
                setTimeout((() => notification.remove()), 300);
            }), duration);
        },
        _ensurePageOverlay() {
            if (!window.State.pageOverlay || !document.body.contains(window.State.pageOverlay)) {
                window.State.pageOverlay = document.getElementById(window.Config.ids.pageOverlay);
                if (!window.State.pageOverlay) {
                    window.State.pageOverlay = window.DOM.createElement("div", {
                        id: window.Config.ids.pageOverlay,
                        className: "eic-modal-overlay"
                    });
                    document.body.appendChild(window.State.pageOverlay);
                }
                if (!window.State.pageOverlay._eicClickHandler) {
                    window.State.pageOverlay.addEventListener("click", (e => {
                        const editor = document.getElementById("eic-personal-theme-editor");
                        if (!editor || "flex" !== editor.style.display) {
                            window.Popup.hide();
                        } else {
                            editor.style.display = "none";
                        }
                    }));
                    window.State.pageOverlay._eicClickHandler = !0;
                }
            }
            window.State.pageOverlay.style.background = "transparent";
        },
        create() {
            if (document.getElementById(window.Config.ids.popup)) {
                return !0;
            }
            window.State.popupElement = window.DOM.createElement("div", {
                id: window.Config.ids.popup
            });
            document.body.appendChild(window.State.popupElement);
            const headerDiv = window.DOM.createElement("div", {
                className: "popup-header"
            });
            const titleDisplay = window.DOM.createElement("div", {
                id: "popup-editable-title",
                className: "popup-title popup-editable-title",
                textContent: window.State.settings.headingText || "Eye in the Cloud",
                title: "Click to edit title",
                tabindex: "0",
                events: {
                    click: e => this.enterEditTitleMode(e.target),
                    focus: e => this.enterEditTitleMode(e.target)
                }
            });
            const closeButton = window.DOM.createElement("button", {
                className: "eic-button eic-button-icon-only close-popup-button",
                events: {
                    click: this.hide
                }
            });
            window.Icons.inject(closeButton, "close");
            headerDiv.appendChild(titleDisplay);
            headerDiv.appendChild(closeButton);
            window.State.popupElement.appendChild(headerDiv);
            const popupTopControls = window.DOM.createElement("div", {
                className: "popup-top-controls"
            });
            const vibeSection = window.DOM.createElement("div", {
                className: "popup-section vibe-section"
            });
            const vibeButton = window.DOM.createElement("button", {
                id: "vibe-mode-toggle",
                className: "eic-button vibe-button",
                events: {
                    click: this.toggleVibeMode.bind(this),
                    mouseover: () => this.updateTooltip("VIBE Mode: Minimal distraction interface."),
                    mouseout: () => this.updateTooltip()
                }
            });
            window.Icons.inject(vibeButton, "bolt", {
                addContainerClass: !1
            });
            vibeButton.appendChild(window.DOM.createElement("span", {
                textContent: "VIBE"
            }));
            vibeSection.appendChild(vibeButton);
            popupTopControls.appendChild(vibeSection);
            const aiThemeGenButton = window.DOM.createElement("button", {
                id: window.Config.ids.aiThemeStudioButton,
                className: "eic-button ai-theme-studio-button",
                style: "width: 100%; justify-content: center;",
                events: {
                    click: () => {
                        this.showAiThemeInputModal();
                    },
                    mouseover: () => this.updateTooltip("Launch The Eye: AI-Powered Theme Studio to generate and customize your visual experience."),
                    mouseout: () => this.updateTooltip()
                }
            });
            const eyeButtonIconSlot = window.DOM.createElement("span", {
                className: "eic-button-icon-svg-slot"
            });
            const eyeIconData = window.ThemeManager.getSvgIconData("Default");
            if (eyeIconData && "function" == typeof window.Icons?.createSvgElement) {
                const svgElement = window.Icons.createSvgElement(eyeIconData);
                if (svgElement) {
                    eyeButtonIconSlot.appendChild(svgElement);
                }
            }
            aiThemeGenButton.insertBefore(eyeButtonIconSlot, aiThemeGenButton.firstChild);
            aiThemeGenButton.appendChild(document.createTextNode("The Eye"));
            popupTopControls.appendChild(aiThemeGenButton);
            window.State.aiThemeStudioButton = aiThemeGenButton;
            window.State.popupElement.appendChild(popupTopControls);
            const contentDiv = window.DOM.createElement("div", {
                className: "popup-content"
            });
            const tabButtonsContainer = window.DOM.createElement("div", {
                className: "eic-tab-buttons"
            });
            const tabContentContainer = window.DOM.createElement("div", {
                className: "eic-tab-content-panels"
            });
            contentDiv.appendChild(tabButtonsContainer);
            contentDiv.appendChild(tabContentContainer);
            [ {
                id: "history",
                label: "History",
                tooltip: "View and configure conversation history settings."
            }, {
                id: "hide",
                label: "Hide",
                tooltip: "Configure which UI elements to hide."
            }, {
                id: "themes",
                label: "Themes",
                tooltip: "Select and customize appearance themes."
            }, {
                id: "snippets",
                label: "Snippets",
                tooltip: "Manage your saved prompt snippets."
            } ].forEach((tabInfo => {
                const tabBtn = window.DOM.createElement("button", {
                    id: `tab-btn-${tabInfo.id}`,
                    className: "eic-tab-button",
                    textContent: tabInfo.label,
                    "data-tab-target": `tab-content-${tabInfo.id}`,
                    events: {
                        click: e => this.handleTabClick(e),
                        mouseover: () => this.updateTooltip(tabInfo.tooltip),
                        mouseout: () => this.updateTooltip()
                    }
                });
                tabButtonsContainer.appendChild(tabBtn);
                const tabPanel = window.DOM.createElement("div", {
                    id: `tab-content-${tabInfo.id}`,
                    className: "eic-tab-panel",
                    style: "display:none;"
                });
                tabContentContainer.appendChild(tabPanel);
            }));
            contentDiv.appendChild(tabButtonsContainer);
            contentDiv.appendChild(tabContentContainer);
            const historyPanel = tabContentContainer.querySelector("#tab-content-history");
            window.HistoryManager.createHistoryPanel(historyPanel);
            const hidePanel = tabContentContainer.querySelector("#tab-content-hide");
            const uiFieldset = window.DOM.createElement("fieldset", {
                className: "popup-section"
            });
            [ {
                key: "hideLeftSidebar",
                label: "Left Sidebar",
                tip: "Hide the left navigation panel."
            }, {
                key: "hideRightSidebar",
                label: "Right Sidebar",
                tip: "Hide the right info panel."
            }, {
                key: "hideHeader",
                label: "Header",
                tip: "Hide the main top header."
            }, {
                key: "hideToolbar",
                label: "Toolbar",
                tip: "Hide the prompt input formatting toolbar."
            }, {
                key: "hidePromptChips",
                label: "Prompt Chips",
                tip: "Hide suggested prompt chips."
            }, {
                key: "hideFeedbackButtons",
                label: "Feedback Buttons",
                tip: "Hide thumbs up/down on chat turns."
            } ].forEach((item => {
                const toggle = window.DOM.createToggle(`${item.key}-toggle`, item.label, window.State.settings[item.key], (checked => window.Settings.update(item.key, checked)));
                toggle.addEventListener("mouseover", (() => this.updateTooltip(item.tip)));
                toggle.addEventListener("mouseout", (() => this.updateTooltip()));
                uiFieldset.appendChild(toggle);
            }));
            hidePanel.appendChild(uiFieldset);
            const themesPanel = tabContentContainer.querySelector("#tab-content-themes");
            const themeSection = window.DOM.createElement("fieldset", {
                className: "popup-section theme-section"
            });
            const themeButtonsContainer = window.DOM.createElement("div", {
                className: "theme-buttons-container"
            });
            [ {
                name: "dos",
                iconKey: "dosDefault",
                tip: "Apply DOS-style retro theme."
            }, {
                name: "nature",
                iconKey: "natureDefault",
                tip: "Apply nature-inspired theme."
            }, {
                name: "personal",
                iconKey: "personalDefault",
                tip: "Apply and customize your personal theme."
            } ].forEach((theme => {
                const themeButton = window.DOM.createElement("button", {
                    className: "eic-button eic-button-icon-only theme-select-button",
                    id: `theme-btn-${theme.name}`,
                    events: {
                        click: () => this.handleThemeButtonClick(theme.name),
                        mouseover: () => this.updateTooltip(theme.tip),
                        mouseout: () => this.updateTooltip()
                    }
                });
                themeButtonsContainer.appendChild(themeButton);
            }));
            themeSection.appendChild(themeButtonsContainer);
            const personalThemeContainer = window.DOM.createElement("div", {
                id: "personal-theme-container",
                className: "personal-theme-container",
                style: "display: none;"
            });
            const personalThemeHeader = window.DOM.createElement("div", {
                className: "personal-theme-header"
            });
            personalThemeHeader.textContent = "Personal Theme Controls";
            personalThemeContainer.appendChild(personalThemeHeader);
            const personalThemeControls = window.DOM.createElement("div", {
                className: "personal-theme-controls"
            });
            const editColorsButton = window.DOM.createElement("button", {
                className: "eic-button edit-colors-button",
                textContent: "Edit Colors",
                events: {
                    click: () => this.togglePersonalThemeEditor()
                }
            });
            const resetButton = window.DOM.createElement("button", {
                className: "eic-button reset-theme-button",
                textContent: "Reset",
                events: {
                    click: () => this.resetPersonalPalette()
                }
            });
            personalThemeControls.appendChild(editColorsButton);
            personalThemeControls.appendChild(resetButton);
            personalThemeContainer.appendChild(personalThemeControls);
            themeSection.appendChild(personalThemeContainer);
            themesPanel.appendChild(themeSection);
            const tooltipArea = window.DOM.createElement("div", {
                id: "eic-tooltip-area",
                className: "eic-tooltip-area"
            });
            window.State.popupElement.appendChild(tooltipArea);
            window.State.popupElement.appendChild(contentDiv);
            window.State.popupElement.appendChild(tooltipArea);
            this.createPersonalThemeEditorModal();
            this.updateUIState();
            return !0;
        },
        createPersonalThemeEditorModal() {
            if (document.getElementById("eic-personal-theme-editor")) {
                return;
            }
            const editorModal = window.DOM.createElement("div", {
                id: "eic-personal-theme-editor",
                className: "eic-personal-theme-editor",
                style: "display:none; flex-direction:column;"
            });
            const editorHeader = window.DOM.createElement("div", {
                className: "editor-header"
            });
            editorHeader.appendChild(window.DOM.createElement("h3", {
                textContent: "Personal Theme Editor"
            }));
            const editorCloseBtn = window.DOM.createElement("button", {
                className: "eic-button eic-button-icon-only editor-close-btn",
                events: {
                    click: () => this.togglePersonalThemeEditor()
                }
            });
            window.Icons.inject(editorCloseBtn, "close");
            editorHeader.appendChild(editorCloseBtn);
            editorModal.appendChild(editorHeader);
            const editorContent = window.DOM.createElement("div", {
                className: "editor-content"
            });
            const palette = this._getComputedThemeVariables();
            Object.keys(this._personalThemeVarLabels).forEach((varName => {
                if (!this._personalThemeVarLabels.hasOwnProperty(varName)) {
                    return;
                }
                const value = palette[varName] || "";
                const row = window.DOM.createElement("div", {
                    className: "personal-theme-row"
                });
                const labelText = this._personalThemeVarLabels[varName] || varName;
                const tooltipText = this._personalThemeVarTooltips[varName] || `CSS Variable: ${varName}`;
                const label = window.DOM.createElement("label", {
                    textContent: labelText,
                    htmlFor: `pte-input-${varName}`,
                    title: tooltipText
                });
                const inputContainer = window.DOM.createElement("div", {
                    className: "color-input-container"
                });
                const isColor = varName.includes("color") || value.startsWith("#") || value.startsWith("rgb");
                if (isColor) {
                    const colorPreview = window.DOM.createElement("div", {
                        className: "color-preview",
                        style: `background-color: ${value};`,
                        "data-for": `pte-input-${varName}`,
                        events: {
                            click: e => document.getElementById(e.target.dataset.for)?.click()
                        }
                    });
                    inputContainer.appendChild(colorPreview);
                }
                const input = window.DOM.createElement("input", {
                    id: `pte-input-${varName}`,
                    className: "personal-theme-input",
                    type: isColor ? "color" : "text",
                    value: value,
                    "data-varname": varName,
                    events: {
                        input: e => {
                            if (isColor) {
                                const preview = e.target.previousElementSibling;
                                if (preview && preview.classList.contains("color-preview")) {
                                    preview.style.backgroundColor = e.target.value;
                                }
                            }
                        }
                    }
                });
                inputContainer.appendChild(input);
                row.appendChild(label);
                row.appendChild(inputContainer);
                editorContent.appendChild(row);
            }));
            editorModal.appendChild(editorContent);
            const editorFooter = window.DOM.createElement("div", {
                className: "editor-footer"
            });
            const cancelBtn = window.DOM.createElement("button", {
                id: "cancel-personal-theme-btn",
                className: "eic-button eic-button-secondary",
                events: {
                    click: () => this.handleCancelPersonalThemeEdit()
                }
            });
            window.Icons.inject(cancelBtn, "cancel", {
                addContainerClass: !1
            });
            cancelBtn.appendChild(document.createTextNode(" Cancel"));
            const saveBtn = window.DOM.createElement("button", {
                id: "save-personal-palette-btn",
                className: "eic-button eic-button-primary",
                events: {
                    click: () => this.savePersonalPalette()
                }
            });
            window.Icons.inject(saveBtn, "save", {
                addContainerClass: !1
            });
            saveBtn.appendChild(document.createTextNode(" Save"));
            editorFooter.appendChild(cancelBtn);
            editorFooter.appendChild(saveBtn);
            editorModal.appendChild(editorFooter);
            document.body.appendChild(editorModal);
        },
        enterEditTitleMode(displayElement) {
            if (!displayElement || "INPUT" === displayElement.tagName) {
                return;
            }
            const currentText = displayElement.textContent;
            const headerDiv = displayElement.parentNode;
            const inputField = window.DOM.createElement("input", {
                type: "text",
                id: "popup-title-input",
                className: "popup-title popup-title-input",
                value: currentText,
                "data-original-value": currentText,
                events: {
                    blur: e => this.exitEditTitleMode(e.target),
                    keydown: e => {
                        if ("Enter" === e.key) {
                            e.target.blur();
                        } else if ("Escape" === e.key) {
                            this.exitEditTitleMode(e.target, !1);
                        }
                    }
                }
            });
            headerDiv.replaceChild(inputField, displayElement);
            inputField.focus();
            inputField.select();
        },
        exitEditTitleMode(inputField, shouldSave = !0) {
            if (!inputField || "INPUT" !== inputField.tagName) {
                return;
            }
            const headerDiv = inputField.parentNode;
            let finalValue = inputField.getAttribute("data-original-value");
            if (shouldSave) {
                const newValue = inputField.value.trim();
                if (newValue && newValue !== finalValue) {
                    window.Settings.update("headingText", newValue);
                    finalValue = newValue;
                }
            }
            if (!finalValue) {
                finalValue = "Eye in the Cloud";
            }
            const titleDisplay = window.DOM.createElement("div", {
                id: "popup-editable-title",
                className: "popup-title popup-editable-title",
                textContent: finalValue,
                title: "Click to edit title",
                tabindex: "0",
                events: {
                    click: e => this.enterEditTitleMode(e.target),
                    focus: e => this.enterEditTitleMode(e.target)
                }
            });
            if (headerDiv && inputField.parentNode === headerDiv) {
                headerDiv.replaceChild(titleDisplay, inputField);
            }
        },
        show() {
            if (!window.State.popupElement || !document.body.contains(window.State.popupElement)) {
                return;
            }
            this.updateUIState();
            window.State.popupElement.classList.add("visible");
            const activeTabButton = window.State.popupElement.querySelector(".eic-tab-button.active");
            if (!activeTabButton) {
                const tabId = window.State.settings.popupActiveTab || this.activeTab;
                const defaultTabButton = window.State.popupElement.querySelector(`[data-tab-target="tab-content-${tabId}"]`);
                if (defaultTabButton) {
                    this.handleTabClick({
                        currentTarget: defaultTabButton
                    });
                }
            }
            this._ensurePageOverlay();
            if (window.State.pageOverlay) {
                window.State.pageOverlay.classList.add("visible");
            }
        },
        hide() {
            if (window.State.popupElement) {
                window.State.popupElement.classList.remove("visible");
            }
            if (window.State.pageOverlay) {
                window.State.pageOverlay.classList.remove("visible");
            }
            const pte = document.getElementById("eic-personal-theme-editor");
            if (pte) {
                pte.style.display = "none";
            }
            window.Settings.save();
        },
        toggle(event) {
            if (event) {
                event.stopPropagation();
            }
            if (window.State.popupElement) {
                if (!window.State.popupElement.classList.contains("visible")) {
                    this.show();
                } else {
                    this.hide();
                }
            }
        },
        toggleVibeMode() {
            window.State.isVibeModeActive = !window.State.isVibeModeActive;
            window.Settings.update("vibeModeActive", window.State.isVibeModeActive);
            window.EICButtonManager.update();
        },
        handleThemeButtonClick(themeName) {
            if (window.State.activeTheme === themeName) {
                window.ThemeManager.removeActiveTheme();
            } else {
                window.ThemeManager.applyTheme(themeName);
            }
        },
        updateUIState() {
            if (!window.State.popupElement) {
                return;
            }
            const vibeButton = document.getElementById("vibe-mode-toggle");
            if (vibeButton) {
                if (window.State.isVibeModeActive) {
                    vibeButton.classList.add("active");
                    vibeButton.removeAttribute("title");
                } else {
                    vibeButton.classList.remove("active");
                    vibeButton.removeAttribute("title");
                }
            }
            window.HistoryManager.updateHistoryControlsState();
            const hidePanel = document.getElementById("tab-content-hide");
            if (hidePanel) {
                const toggles = hidePanel.querySelectorAll('input[type="checkbox"]');
                toggles.forEach((toggle => {
                    toggle.disabled = !!window.State.isVibeModeActive;
                    toggle.parentElement.style.opacity = window.State.isVibeModeActive ? "0.5" : "1";
                }));
            }
            const tabButtons = window.State.popupElement.querySelectorAll(".eic-tab-button");
            const tabPanels = window.State.popupElement.querySelectorAll(".eic-tab-panel");
            tabButtons.forEach((btn => {
                if (btn.dataset.tabTarget === `tab-content-${this.activeTab}`) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            }));
            tabPanels.forEach((panel => {
                if (panel.id === `tab-content-${this.activeTab}`) {
                    panel.style.display = "block";
                } else {
                    panel.style.display = "none";
                }
            }));
            this._updateThemeButtonsState();
            this._updatePopupTitleAndIcons();
        },
        _updateThemeButtonsState() {
            const themeButtons = window.State.popupElement.querySelectorAll(".theme-select-button");
            const personalThemeContainer = document.getElementById("personal-theme-container");
            themeButtons.forEach((btn => {
                const themeName = btn.id.replace("theme-btn-", "");
                const currentActiveTheme = window.State.activeTheme;
                window.State.activeTheme = themeName;
                const iconData = window.ThemeManager.getSvgIconData("Default");
                window.State.activeTheme = currentActiveTheme;
                if (iconData && "function" == typeof window.Icons?.createSvgElement) {
                    for (;btn.firstChild && !(btn.firstChild instanceof Text); ) {
                        btn.removeChild(btn.firstChild);
                    }
                    const svgIcon = window.Icons.createSvgElement(iconData);
                    if (btn.firstChild && btn.firstChild instanceof Text) {
                        btn.insertBefore(svgIcon, btn.firstChild);
                    } else {
                        btn.appendChild(svgIcon);
                    }
                }
                if (themeName === window.State.settings.activeTheme) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            }));
            if (personalThemeContainer) {
                personalThemeContainer.style.display = "personal" === window.State.settings.activeTheme ? "block" : "none";
            }
        },
        _updatePopupTitleAndIcons() {
            const titleDisplay = document.getElementById("popup-editable-title");
            if (titleDisplay && titleDisplay.textContent !== window.State.settings.headingText) {
                titleDisplay.textContent = window.State.settings.headingText || "Eye in the Cloud";
            }
            if (window.State.aiThemeStudioButton) {
                const eyeButtonIconSlot = window.State.aiThemeStudioButton.querySelector(".eic-button-icon-svg-slot");
                if (eyeButtonIconSlot) {
                    const eyeIconData = window.ThemeManager.getSvgIconData("Default");
                    if (eyeIconData) {
                        for (;eyeButtonIconSlot.firstChild; ) {
                            eyeButtonIconSlot.removeChild(eyeButtonIconSlot.firstChild);
                        }
                        const eyeIconSvg = window.Icons.createSvgElement(eyeIconData);
                        eyeButtonIconSlot.appendChild(eyeIconSvg);
                    }
                }
            }
        },
        handleTabClick(event) {
            const targetButton = event.currentTarget;
            const targetPanelId = targetButton.getAttribute("data-tab-target");
            const isCurrentlyActive = targetButton.classList.contains("active");
            if (isCurrentlyActive) {
                targetButton.classList.remove("active");
                const targetPanel = document.getElementById(targetPanelId);
                if (targetPanel) {
                    targetPanel.style.display = "none";
                    targetPanel.classList.remove("active-panel");
                }
                return;
            }
            if ("tab-content-history" === targetPanelId) {}
            const tabButtons = window.State.popupElement.querySelectorAll(".eic-tab-button");
            tabButtons.forEach((btn => btn.classList.remove("active")));
            targetButton.classList.add("active");
            const tabPanels = window.State.popupElement.querySelectorAll(".eic-tab-panel");
            tabPanels.forEach((panel => {
                panel.style.display = "none";
                panel.classList.remove("active-panel");
            }));
            const targetPanel = document.getElementById(targetPanelId);
            if (targetPanel) {
                targetPanel.style.display = "block";
                targetPanel.classList.add("active-panel");
                if ("tab-content-snippets" === targetPanelId) {
                    if (window.Snippets && window.Snippets.createSnippetsPanel) {
                        window.Snippets.createSnippetsPanel();
                    }
                }
            }
            try {
                const storeValue = isCurrentlyActive ? "default" : targetPanelId.replace("tab-content-", "");
                window.Settings.update("popupActiveTab", storeValue);
            } catch (e) {}
            this.activeTab = isCurrentlyActive ? "default" : targetPanelId.replace("tab-content-", "");
            this.updateUIState();
        },
        showAiThemeInputModal() {
            if (window.ModalEye && "function" == typeof window.ModalEye.open) {
                window.ModalEye.open();
            }
        },
        updateTooltip(message) {
            const tooltipArea = document.getElementById("eic-tooltip-area");
            if (tooltipArea) {
                if ("string" == typeof message && message.trim()) {
                    tooltipArea.textContent = message;
                } else {
                    tooltipArea.textContent = "Hover over an item for details.";
                }
            }
        },
        _getComputedThemeVariables() {
            const computedVariables = {};
            Object.keys(this._personalThemeVarLabels).forEach((varName => {
                if (varName.startsWith("--eic-global-")) {
                    const value = getComputedStyle(document.body).getPropertyValue(varName).trim();
                    if (value) {
                        computedVariables[varName] = value;
                    }
                }
            }));
            return computedVariables;
        }
    };
    document.addEventListener("DOMContentLoaded", (() => {}));
    window.EyeBot = {
        init() {
            document.addEventListener("eic:geminiThemeDataReceived", (event => {
                if (event.detail && event.detail.rawText) {
                    this.processReceivedThemeData(event.detail.rawText);
                }
            }));
        },
        submitPreparedPromptToAI: function(promptString) {
            const realInput = document.querySelector(window.Config.selectors.chatInput);
            const realRunButton = document.querySelector(window.Config.selectors.runButton);
            if (realInput && realRunButton) {
                const aiSelector = window.Config.selectors.aiTurn;
                const currentAiTurns = document.querySelectorAll(aiSelector);
                window.State.waitingForThemeAiTurnAfter = currentAiTurns.length;
                realInput.value = promptString;
                realInput.dispatchEvent(new Event("input", {
                    bubbles: !0,
                    cancelable: !0
                }));
                realInput.dispatchEvent(new Event("change", {
                    bubbles: !0,
                    cancelable: !0
                }));
                setTimeout((() => {
                    realRunButton.click();
                    if (window.ModalEye && window.ModalEye.setState) {
                        window.ModalEye.setState("processing");
                    }
                    window.NotificationManager.showNotification("Your request has been sent to the Eye...", 3e3);
                }), 150);
            }
        },
        processReceivedThemeData(rawText) {
            window.NotificationManager.showNotification("The Eye is looking for a theme pattern...", 3e3);
            let processedText = rawText.trim();
            try {
                const parsedJson = JSON.parse(processedText);
                this.processAndStoreGeneratedTheme(parsedJson);
                this.cleanupAiTurns();
            } catch (e) {
                this.cleanupAiTurns();
                window.State.aiThemeModalConfirmationText = "The Eye gazed into the void, but found only chaos. Nothing has been applied.";
                window.ModalEye.processingComplete();
            }
        },
        processAndStoreGeneratedTheme(generatedData) {
            const {colorPalette: colorPalette, svgDefault: svgDefault, svgHover: svgHover, svgActive: svgActive, confirmationMessage: confirmationMessage} = generatedData;
            const themeColors = {};
            for (const [key, value] of Object.entries(colorPalette || {})) {
                if (key.startsWith("--eic-global-") && "string" == typeof value && value.trim().length > 0) {
                    themeColors[key] = value.trim();
                }
            }
            const finalSvgDefault = null === svgDefault || this.isValidSvgData(svgDefault) ? svgDefault : null;
            const finalSvgHover = null === svgHover || this.isValidSvgData(svgHover) ? svgHover : null;
            const finalSvgActive = null === svgActive || this.isValidSvgData(svgActive) ? svgActive : null;
            const finalConfirmationMessage = "string" == typeof confirmationMessage ? confirmationMessage : "Theme processed by The Eye!";
            window.State.settings.customProfileAssets.colorPalette = themeColors;
            window.State.settings.customProfileAssets.svgDefault = finalSvgDefault;
            window.State.settings.customProfileAssets.svgHover = finalSvgHover;
            window.State.settings.customProfileAssets.svgActive = finalSvgActive;
            window.Settings.update("customProfileAssets", window.State.settings.customProfileAssets);
            window.Settings.update("isCustomProfileActive", !0);
            window.ThemeManager.applyTheme("personal");
            window.State.aiThemeModalConfirmationText = finalConfirmationMessage;
            window.ModalEye.processingComplete();
        },
        isValidSvgData: svgData => svgData && "object" == typeof svgData && "0 0 24 24" === svgData.viewBox && Array.isArray(svgData.elements),
        resetPersonalThemeToDefaults() {
            window.Settings.resetToDefaults();
            window.ThemeManager.applyTheme("personal");
            window.NotificationManager.showNotification("Personal theme reset to factory defaults.", 3e3);
        },
        cleanupAiTurns() {
            window.NotificationManager.showNotification("Starting cleanup of the received code...", 3e3);
            const turnsGeneratedByThemeBot = null !== window.State.waitingForThemeAiTurnAfter ? (() => {
                const aiSelector = window.Config.selectors.aiTurn;
                const aiTurns = document.querySelectorAll(aiSelector);
                const currentCount = aiTurns.length;
                const startIdx = window.State.waitingForThemeAiTurnAfter;
                return "number" == typeof startIdx && startIdx >= 0 && currentCount > startIdx ? currentCount - startIdx : 0;
            })() : 0;
            if (turnsGeneratedByThemeBot > 0) {
                this.deleteLastAiTurns(turnsGeneratedByThemeBot);
            }
            window.State.waitingForThemeAiTurnAfter = null;
        },
        async deleteLastAiTurns(countToDelete) {
            try {
                const chatContainer = document.querySelector(window.Config.selectors.chatContainer);
                const aiTurns = Array.from(chatContainer.querySelectorAll(window.Config.selectors.aiTurn));
                const turnsToDelete = aiTurns.slice(-countToDelete);
                for (const turnElement of turnsToDelete.reverse()) {
                    await this.deleteSingleTurn(turnElement);
                }
                const userTurn = chatContainer.querySelector(".user");
                if (userTurn) {
                    await this.deleteSingleTurn(userTurn);
                }
                window.NotificationManager.showNotification("Cleanup complete. The Eye has processed your request.", 3e3);
            } catch (err) {}
        },
        async deleteSingleTurn(turnElement) {
            const moreBtn = turnElement.querySelector(window.Config.selectors.aiTurnMoreOptionsButton);
            moreBtn.click();
            await new Promise((resolve => setTimeout(resolve, 350)));
            const menuItems = Array.from(document.querySelectorAll(window.Config.selectors.aiTurnContextMenuItems));
            let deleteBtn = null;
            for (const item of menuItems) {
                const itemText = item.textContent?.toLowerCase() || "";
                const iconText = item.querySelector(".material-symbols-outlined, .material-icons")?.textContent?.toLowerCase() || "";
                if (itemText.includes(window.Config.textStrings.deleteActionMenuItemText) || iconText.includes(window.Config.textStrings.deleteActionMenuItemText)) {
                    deleteBtn = item;
                    break;
                }
            }
            deleteBtn.click();
            await new Promise((resolve => setTimeout(resolve, 700)));
        }
    };
    window.EICButtonManager = {
        scriptToggleButton: null,
        currentMainButtonState: "default",
        hitboxElement: null,
        updateHitboxPositionCallback: null,
        aiThemeStudioButton: null,
        create() {
            if (!this.scriptToggleButton || !document.body.contains(this.scriptToggleButton)) {
                this.scriptToggleButton = window.DOM.createElement("button", {
                    id: window.Config.ids.scriptButton,
                    title: "Eye in the Cloud Controls",
                    className: "eic-button eic-button-icon-only"
                });
                document.body.appendChild(this.scriptToggleButton);
                this.createOrUpdateHitbox();
                this.positionButton();
                this.updateMainButtonVisual();
            }
        },
        createOrUpdateHitbox() {
            if (this.scriptToggleButton) {
                if (!this.hitboxElement) {
                    this.hitboxElement = document.createElement("div");
                    this.hitboxElement.id = "eic-main-button-hitbox";
                    this.hitboxElement.addEventListener("click", (e => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.Popup.toggle(e);
                    }));
                    this.hitboxElement.addEventListener("mouseover", (() => {
                        if ("active" !== this.currentMainButtonState || !window.State.isVibeModeActive) {
                            this.currentMainButtonState = "hover";
                            this.updateMainButtonVisual();
                        }
                    }));
                    this.hitboxElement.addEventListener("mouseout", (() => {
                        this.currentMainButtonState = window.State.isVibeModeActive ? "active" : "default";
                        this.updateMainButtonVisual();
                    }));
                    document.body.appendChild(this.hitboxElement);
                }
                this.updateHitboxPositionCallback = () => {
                    if (!this.scriptToggleButton || !this.hitboxElement || !document.body.contains(this.hitboxElement)) {
                        return;
                    }
                    const rect = this.scriptToggleButton.getBoundingClientRect();
                    const padding = 0;
                    Object.assign(this.hitboxElement.style, {
                        position: "fixed",
                        top: `${rect.top - padding}px`,
                        left: `${rect.left - padding}px`,
                        width: `${rect.width + 2 * padding}px`,
                        height: `${rect.height + 2 * padding}px`,
                        zIndex: "10002",
                        cursor: "pointer",
                        pointerEvents: "auto"
                    });
                };
                this.updateHitboxPositionCallback();
            }
        },
        updateMainButtonVisual() {
            if (!this.scriptToggleButton) {
                this.scriptToggleButton = document.getElementById(window.Config.ids.scriptButton);
                if (!this.scriptToggleButton) {
                    return;
                }
            }
            let svgStateToFetch = "Default";
            if (window.State.isVibeModeActive) {
                svgStateToFetch = "Active";
            } else {
                svgStateToFetch = "active" === this.currentMainButtonState ? "Active" : "hover" === this.currentMainButtonState ? "Hover" : "Default";
            }
            if (![ "Default", "Hover", "Active" ].includes(svgStateToFetch) && !window.State.isVibeModeActive) {
                svgStateToFetch = "Default";
            }
            let elementToRender = null;
            const themeSvgData = window.ThemeManager.getSvgIconData(svgStateToFetch);
            if (themeSvgData) {
                const createdElement = window.Icons.createSvgElement(themeSvgData);
                if (createdElement) {
                    elementToRender = createdElement;
                }
            }
            if (!elementToRender) {
                let fallbackSvgData = null;
                if (window.Icons && window.Icons.defaults) {
                    if (window.Icons.defaults.buttonStates && window.Icons.defaults.buttonStates[svgStateToFetch]) {
                        fallbackSvgData = window.Icons.defaults.buttonStates[svgStateToFetch];
                    } else if (window.Icons.defaults.eyeInTheCloudDefault) {
                        fallbackSvgData = window.Icons.defaults.eyeInTheCloudDefault;
                    }
                }
                if (fallbackSvgData) {
                    const fallbackElement = window.Icons.createSvgElement(fallbackSvgData);
                    if (fallbackElement) {
                        elementToRender = fallbackElement;
                    }
                }
            }
            if (elementToRender) {
                this._applySvgToButton(this.scriptToggleButton, elementToRender);
            } else {
                this._clearButtonIcon(this.scriptToggleButton);
            }
        },
        updateAiThemeStudioButtonVisual() {
            if (!this.aiThemeStudioButton) {
                this.aiThemeStudioButton = document.getElementById(window.Config.ids.aiThemeStudioButton);
                if (!this.aiThemeStudioButton) {
                    return;
                }
            }
            const svgData = window.ThemeManager.getSvgIconData("Default");
            if (svgData) {
                const svgElementToApply = window.Icons.createSvgElement(svgData);
                if (svgElementToApply) {
                    let iconSlot = this.aiThemeStudioButton.querySelector(".eic-button-icon-svg-slot");
                    if (!iconSlot) {
                        iconSlot = document.createElement("span");
                        iconSlot.className = "eic-button-icon-svg-slot";
                        this.aiThemeStudioButton.insertBefore(iconSlot, this.aiThemeStudioButton.firstChild);
                    }
                    for (;iconSlot.firstChild; ) {
                        iconSlot.removeChild(iconSlot.firstChild);
                    }
                    svgElementToApply.classList.add("eic-button-icon-svg");
                    iconSlot.appendChild(svgElementToApply);
                }
            }
        },
        update() {
            if (!this.scriptToggleButton) {
                this.scriptToggleButton = document.getElementById(window.Config.ids.scriptButton);
                if (!this.scriptToggleButton) {
                    return;
                }
            }
            this._updateButtonVisuals();
            this._updateButtonPosition();
        },
        _clearButtonIcon(buttonElement) {
            if (!buttonElement) {
                return;
            }
            const childrenSnapshot = Array.from(buttonElement.childNodes);
            childrenSnapshot.forEach((child => {
                buttonElement.removeChild(child);
            }));
        },
        _updateButtonVisuals() {
            this.updateMainButtonVisual();
            this.updateAiThemeStudioButtonVisual();
        },
        _updateButtonPosition() {
            const vibeStateString = String(window.State.isVibeModeActive);
            if (this.scriptToggleButton.dataset.lastVibeState !== vibeStateString) {
                this.positionButton();
                this.scriptToggleButton.dataset.lastVibeState = vibeStateString;
            }
        },
        _applySvgToButton(buttonElement, svgElement) {
            const childrenSnapshot = Array.from(buttonElement.childNodes);
            if (childrenSnapshot.length > 0) {
                childrenSnapshot.forEach((child => {
                    buttonElement.removeChild(child);
                }));
            }
            buttonElement.appendChild(svgElement);
        },
        positionButton() {
            if (this.scriptToggleButton) {
                this.scriptToggleButton.style.setProperty("position", "fixed", "important");
                this.scriptToggleButton.style.top = "2%";
                this.scriptToggleButton.style.left = "50%";
                this.scriptToggleButton.style.transform = "translateX(-50%)";
                this.updateHitboxPositionCallback();
            }
        },
        destroy() {
            if (this.scriptToggleButton && document.body.contains(this.scriptToggleButton)) {
                document.body.removeChild(this.scriptToggleButton);
            }
            if (this.hitboxElement && document.body.contains(this.hitboxElement)) {
                document.body.removeChild(this.hitboxElement);
            }
            this.scriptToggleButton = null;
            this.hitboxElement = null;
        }
    };
    window.ElementWatcher = {
        observer: null,
        debounceTimer: null,
        _hasStarted: !1,
        uiUpdateFunctions: {
            layout: () => window.UI?.applyLayoutRules(),
            heading: () => window.UI?.updateHeadingText(),
            promptChips: () => window.UI?.updatePromptChipsVisibility(),
            turnFooters: () => window.UI?.updateTurnFooterVisibility(),
            placeholder: () => window.UI?.updateInputPlaceholder()
        },
        logClipboardContent: content => content,
        attemptClipboardCopyAndRead(button) {
            return new Promise(((resolve, reject) => {
                try {
                    button.click();
                    setTimeout((() => {
                        navigator.clipboard.readText().then((text => {
                            resolve(this.logClipboardContent(text));
                        })).catch((err => {
                            reject(err);
                        }));
                    }), 100);
                } catch (err) {
                    reject(err);
                }
            }));
        },
        processPotentialThemeTurn(turnElement) {
            if (!turnElement) {
                return;
            }
            const codeBlocks = turnElement.querySelectorAll("pre > code");
            if (codeBlocks && 0 !== codeBlocks.length) {
                codeBlocks.forEach((async (codeBlock, index) => {
                    try {
                        const preElement = codeBlock.closest("pre");
                        if (!preElement) {
                            return;
                        }
                        const copyButton = preElement.querySelector('button[aria-label="Copy code"], button.copy-button');
                        if (!copyButton) {
                            return;
                        }
                        this.attemptClipboardCopyAndRead(copyButton).then((clipboardContent => {
                            if (clipboardContent.includes(".dark-theme") || clipboardContent.includes(":root") || clipboardContent.includes("--background") || clipboardContent.includes("@media")) {
                                const themeEvent = new CustomEvent("eic-theme-generated", {
                                    detail: {
                                        content: clipboardContent
                                    }
                                });
                                document.dispatchEvent(themeEvent);
                                window.Popup?.showNotification("Theme CSS detected! Processing...", 3e3);
                            }
                        })).catch((err => {}));
                    } catch (error) {}
                }));
            }
        },
        processAiTurnForThemeData(aiTurnElement) {
            const codeBlocks = aiTurnElement.querySelectorAll(window.Config.selectors.aiTurnCodeBlock);
            if (0 === codeBlocks.length) {
                return;
            }
            const lastCodeBlock = codeBlocks[codeBlocks.length - 1];
            let codeContent = lastCodeBlock.textContent || "";
            const mightBeThemeData = codeContent.includes("--eic-") || codeContent.includes(":root") || codeContent.includes(".dark-theme") || codeContent.startsWith("{") && codeContent.includes(":") || codeContent.includes('"') && codeContent.includes("}") || codeContent.includes("svgDefault") || codeContent.includes("svgHover") || codeContent.includes("svgActive");
            if (!mightBeThemeData) {
                return;
            }
            const themeDataEvent = new CustomEvent("eic:geminiThemeDataReceived", {
                detail: {
                    rawText: codeContent
                }
            });
            document.dispatchEvent(themeDataEvent);
        },
        handleDomChange(mutations = []) {
            if (!window.State || !window.Config?.selectors?.aiTurn) {
                return;
            }
            if (null !== window.State.waitingForThemeAiTurnAfter) {
                const aiSelector = window.Config.selectors.aiTurn;
                const currentAiTurns = document.querySelectorAll(aiSelector);
                const currentCount = currentAiTurns.length;
                const startIdx = window.State.waitingForThemeAiTurnAfter;
                const runBtn = document.querySelector(window.Config.selectors.runButton);
                const isLoading = runBtn && ("stop" === runBtn.textContent.trim().toLowerCase() || runBtn.className.includes("stoppable"));
                if (isLoading) {
                    return;
                }
                if (currentCount <= startIdx) {
                    return;
                }
                const newTurns = [];
                for (let i = startIdx; i < currentCount; i++) {
                    newTurns.push(currentAiTurns[i]);
                }
                for (const turn of newTurns) {
                    if (!turn) {
                        continue;
                    }
                    const codeBlocks = turn.querySelectorAll(window.Config.selectors.aiTurnCodeBlock);
                    if (codeBlocks.length > 0) {
                        this.processAiTurnForThemeData(turn);
                    }
                }
                window.State.waitingForThemeAiTurnAfter = null;
            }
            window.promptcomposer.init();
            try {
                const triggerButton = document.getElementById("adv-modal-trigger-btn");
                if (triggerButton) {
                    triggerButton.classList.add("eic-visible");
                    triggerButton.classList.remove("eic-hidden-by-default");
                    const buttonWrapper = triggerButton.closest(".button-wrapper");
                    const parentContainer = buttonWrapper?.parentElement;
                    if (buttonWrapper && parentContainer && parentContainer.children[0] !== buttonWrapper) {
                        parentContainer.insertBefore(buttonWrapper, parentContainer.firstChild);
                    }
                } else {
                    window.promptcomposer.init();
                }
            } catch (error) {}
            window.UI.applyLayoutRules();
            window.UI.updateHeadingText();
            window.UI.updatePromptChipsVisibility();
            window.UI.updateTurnFooterVisibility();
            window.UI.updateInputPlaceholder();
            window.HistoryManager.applyVisibilityRules();
            if (window.State.popupElement?.classList.contains("visible")) {
                try {
                    const chatContainerForSlider = document.querySelector(window.Config.selectors.chatContainer);
                    if (chatContainerForSlider) {
                        const aiTurns = chatContainerForSlider.querySelectorAll(window.Config.selectors.aiTurn);
                        const maxExchanges = aiTurns.length > 0 ? aiTurns.length : 1;
                        window.HistoryManager.updateSliderMax(maxExchanges);
                    }
                } catch (error) {}
            }
            try {
                const disclaimerSpan = document.querySelector(window.Config.selectors.siteDisclaimerText);
                if (disclaimerSpan) {
                    const newDisclaimerText = "This reality is for testing only. No production use.";
                    if (disclaimerSpan.textContent.trim() !== newDisclaimerText) {
                        disclaimerSpan.textContent = newDisclaimerText;
                    }
                }
            } catch (error) {}
        },
        start() {
            if (!window.__EIC_WATCHER_STARTED) {
                window.__EIC_WATCHER_STARTED = !0;
                if (!this._hasStarted) {
                    this._hasStarted = !0;
                    this.observer = new MutationObserver((mutations => {
                        clearTimeout(this.debounceTimer);
                        this.debounceTimer = setTimeout((() => {
                            this.handleDomChange(mutations);
                        }), 250);
                    }));
                    this.observer.observe(document.body, {
                        childList: !0,
                        subtree: !0
                    });
                    this.handleDomChange([]);
                }
            }
        },
        stop() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
                this.debounceTimer = null;
            }
            this._hasStarted = !1;
        }
    };
    window.Snippets = {
        init() {
            this.createSnippetsPanel();
            document.addEventListener("eic-snippets-updated", (() => {
                this.renderSnippetList();
            }));
        },
        createSnippetsPanel() {
            const tabContentSnippetsPanel = document.getElementById("tab-content-snippets");
            if (!tabContentSnippetsPanel) {
                return;
            }
            for (;tabContentSnippetsPanel.firstChild; ) {
                tabContentSnippetsPanel.removeChild(tabContentSnippetsPanel.firstChild);
            }
            const toggleContainer = window.DOM.createToggle("show-snippet-toolbar-toggle", "Show Snippet Toolbar in Prompt Composer", window.State.settings.showSnippetToolbarInModal, (checked => {
                window.Settings.update("showSnippetToolbarInModal", checked);
            }));
            const toggleInput = toggleContainer.querySelector('input[type="checkbox"]');
            if (toggleInput) {
                toggleInput.checked = !!window.State.settings.showSnippetToolbarInModal;
            }
            toggleContainer.addEventListener("mouseover", (() => window.Popup.updateTooltip("Control visibility of snippet toolbar in the Prompt Composer modal")));
            toggleContainer.addEventListener("mouseout", (() => window.Popup.updateTooltip()));
            tabContentSnippetsPanel.appendChild(toggleContainer);
            const snippetsContainer = window.DOM.createElement("div", {
                className: "snippet-list-area",
                id: "snippet-list-area"
            });
            tabContentSnippetsPanel.appendChild(snippetsContainer);
            const addSnippetButton = window.DOM.createElement("button", {
                className: "add-snippet-btn",
                textContent: "+ Add Snippet",
                events: {
                    click: () => this.openSnippetForm(),
                    mouseover: () => window.Popup.updateTooltip("Create a new reusable snippet"),
                    mouseout: () => window.Popup.updateTooltip()
                }
            });
            tabContentSnippetsPanel.appendChild(addSnippetButton);
            this.renderSnippetList();
        },
        renderSnippetList() {
            const snippetList = document.getElementById("snippet-list-area");
            if (!snippetList) {
                return;
            }
            for (;snippetList.firstChild; ) {
                snippetList.removeChild(snippetList.firstChild);
            }
            const snippets = window.State.settings.promptSnippets || [];
            if (0 !== snippets.length) {
                snippets.forEach(((snippet, index) => {
                    const snippetItem = this.createSnippetListItem(snippet, index);
                    snippetList.appendChild(snippetItem);
                }));
            } else {
                const emptyMessage = window.DOM.createElement("div", {
                    style: "padding: 20px; text-align: center; color: var(--eic-global-on-surface-variant);",
                    textContent: "No snippets yet. Add your first one!"
                });
                snippetList.appendChild(emptyMessage);
            }
        },
        createSnippetListItem(snippet, index) {
            const item = window.DOM.createElement("div", {
                className: "snippet-list-item",
                events: {
                    mouseover: () => window.Popup.updateTooltip(snippet.content),
                    mouseout: () => window.Popup.updateTooltip()
                }
            });
            const snippetName = window.DOM.createElement("div", {
                className: "snippet-name",
                textContent: snippet.name
            });
            const actionButtons = window.DOM.createElement("div", {
                className: "snippet-actions"
            });
            const editButton = window.DOM.createElement("button", {
                className: "snippet-action-btn",
                events: {
                    click: () => this.openSnippetForm(snippet, index),
                    mouseover: () => window.Popup?.updateTooltip?.("Edit this snippet"),
                    mouseout: () => window.Popup?.updateTooltip?.()
                }
            });
            window.Icons.inject(editButton, {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
                        fill: "currentColor"
                    }
                } ]
            });
            const deleteButton = window.DOM.createElement("button", {
                className: "snippet-action-btn",
                events: {
                    click: () => this.deleteSnippet(index),
                    mouseover: () => window.Popup?.updateTooltip?.("Delete this snippet"),
                    mouseout: () => window.Popup?.updateTooltip?.()
                }
            });
            window.Icons.inject(deleteButton, {
                viewBox: "0 0 24 24",
                elements: [ {
                    type: "path",
                    attrs: {
                        d: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
                        fill: "currentColor"
                    }
                } ]
            });
            const moveUpButton = window.DOM.createElement("button", {
                className: "snippet-action-btn",
                events: {
                    click: () => this.moveSnippet(index, index - 1),
                    mouseover: () => window.Popup?.updateTooltip?.("Move this snippet up"),
                    mouseout: () => window.Popup?.updateTooltip?.()
                }
            });
            window.Icons.inject(moveUpButton, "arrow_upward");
            if (0 === index) {
                moveUpButton.disabled = !0;
                moveUpButton.style.opacity = "0.5";
            }
            const moveDownButton = window.DOM.createElement("button", {
                className: "snippet-action-btn",
                events: {
                    click: () => this.moveSnippet(index, index + 1),
                    mouseover: () => window.Popup?.updateTooltip?.("Move this snippet down"),
                    mouseout: () => window.Popup?.updateTooltip?.()
                }
            });
            window.Icons.inject(moveDownButton, "arrow_downward");
            const snippets = window.State.settings.promptSnippets || [];
            if (index === snippets.length - 1) {
                moveDownButton.disabled = !0;
                moveDownButton.style.opacity = "0.5";
            }
            actionButtons.appendChild(moveUpButton);
            actionButtons.appendChild(moveDownButton);
            actionButtons.appendChild(editButton);
            actionButtons.appendChild(deleteButton);
            item.appendChild(snippetName);
            item.appendChild(actionButtons);
            return item;
        },
        moveSnippet(fromIndex, toIndex) {
            const snippets = window.State.settings.promptSnippets || [];
            if (toIndex < 0 || toIndex >= snippets.length) {
                return;
            }
            const snippet = snippets[fromIndex];
            snippets.splice(fromIndex, 1);
            snippets.splice(toIndex, 0, snippet);
            window.Settings.update("promptSnippets", [ ...snippets ]);
            this.renderSnippetList();
        },
        deleteSnippet(index) {
            if (!confirm("Are you sure you want to delete this snippet?")) {
                return;
            }
            const snippets = window.State.settings.promptSnippets || [];
            snippets.splice(index, 1);
            window.Settings.update("promptSnippets", [ ...snippets ]);
            this.renderSnippetList();
            window.NotificationManager.showNotification("Snippet deleted");
        },
        openSnippetForm(snippet = null, index = null) {
            const existingForm = document.getElementById("snippet-form-container");
            if (existingForm) {
                existingForm.remove();
            }
            const isEdit = null !== snippet;
            const formContainer = window.DOM.createElement("div", {
                id: "snippet-form-container",
                style: "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10002;"
            });
            const form = window.DOM.createElement("form", {
                className: "snippet-form",
                id: "snippet-form",
                events: {
                    submit: e => {
                        e.preventDefault();
                        this.saveSnippet(isEdit, index);
                    }
                }
            });
            const nameField = window.DOM.createElement("div", {
                className: "snippet-form-field"
            });
            const nameLabel = window.DOM.createElement("label", {
                htmlFor: "snippet-name-input",
                textContent: "Snippet Name"
            });
            const nameInput = window.DOM.createElement("input", {
                id: "snippet-name-input",
                type: "text",
                value: isEdit ? snippet.name : "",
                required: "required",
                placeholder: "Enter a name for this snippet"
            });
            nameField.appendChild(nameLabel);
            nameField.appendChild(nameInput);
            const contentField = window.DOM.createElement("div", {
                className: "snippet-form-field"
            });
            const contentLabel = window.DOM.createElement("label", {
                htmlFor: "snippet-content-input",
                textContent: "Snippet Content"
            });
            const contentInput = window.DOM.createElement("textarea", {
                id: "snippet-content-input",
                required: "required",
                placeholder: "Enter the content of your snippet",
                value: isEdit ? snippet.content : ""
            });
            contentField.appendChild(contentLabel);
            contentField.appendChild(contentInput);
            const buttons = window.DOM.createElement("div", {
                className: "snippet-form-buttons"
            });
            const cancelButton = window.DOM.createElement("button", {
                type: "button",
                textContent: "Cancel",
                className: "clear-textarea-btn",
                events: {
                    click: () => formContainer.remove()
                }
            });
            const saveButton = window.DOM.createElement("button", {
                type: "submit",
                textContent: isEdit ? "Save Changes" : "Save Snippet",
                style: "background-color: var(--eic-global-primary); color: var(--eic-global-on-primary);"
            });
            buttons.appendChild(cancelButton);
            buttons.appendChild(saveButton);
            form.appendChild(nameField);
            form.appendChild(contentField);
            form.appendChild(buttons);
            formContainer.appendChild(form);
            document.body.appendChild(formContainer);
            nameInput.focus();
            const outsideClickHandler = e => {
                if (!form.contains(e.target) && document.body.contains(formContainer)) {
                    formContainer.remove();
                    document.removeEventListener("click", outsideClickHandler);
                }
            };
            setTimeout((() => {
                document.addEventListener("click", outsideClickHandler);
            }), 100);
        },
        saveSnippet(isEdit, index) {
            const nameInput = document.getElementById("snippet-name-input");
            const contentInput = document.getElementById("snippet-content-input");
            if (!nameInput || !contentInput) {
                return;
            }
            const name = nameInput.value.trim();
            const content = contentInput.value.trim();
            if (!name || !content) {
                return;
            }
            const snippets = window.State.settings.promptSnippets || [];
            if (isEdit) {
                snippets[index] = {
                    id: snippets[index].id,
                    name: name,
                    content: content
                };
            } else {
                const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
                snippets.push({
                    id: id,
                    name: name,
                    content: content
                });
            }
            window.Settings.update("promptSnippets", [ ...snippets ]);
            const formContainer = document.getElementById("snippet-form-container");
            if (formContainer) {
                formContainer.remove();
            }
            this.renderSnippetList();
            window.NotificationManager.showNotification(isEdit ? "Snippet updated" : "Snippet added");
        },
        createSnippetButton(snippet) {
            return window.DOM.createElement("button", {
                className: "eic-button eic-button-icon-only snippet-button",
                textContent: snippet.label,
                events: {
                    click: () => {
                        this.insertSnippet(snippet);
                    },
                    mouseover: () => window.Popup?.updateTooltip?.(`Insert snippet: ${snippet.label}`),
                    mouseout: () => window.Popup?.updateTooltip?.()
                }
            });
        },
        createSnippetInput() {
            return window.DOM.createElement("input", {
                className: "eic-input snippet-input",
                type: "text",
                placeholder: "Enter snippet text...",
                events: {
                    input: event => {
                        this.handleSnippetInput(event.target.value);
                    }
                }
            });
        }
    };
    window.Snippets.initialize = function() {
        window.Snippets.init();
        window.State.settings.promptSnippets;
    };
    window.PromptTemplates = {};
    !function(PT) {
        try {
            const rawJsonString = GM_getResourceText("PROMPT_TEMPLATES");
            if ("string" != typeof rawJsonString || "" === rawJsonString.trim()) {
                return;
            }
            const templates = JSON.parse(rawJsonString);
            function buildFinalPrompt(masterTemplateArray, taskInstructionsArray, userTriggerInput) {
                const masterTemplateString = masterTemplateArray.join("\n");
                const taskInstructionsString = taskInstructionsArray.join("\n");
                let finalPrompt = masterTemplateString.replace("{{SPECIFIC_ANALYSIS_AND_CONCEPTUALIZATION_TASK}}", taskInstructionsString);
                finalPrompt = finalPrompt.replace(/\{\{USER_TRIGGER_INPUT\}\}/g, userTriggerInput);
                return finalPrompt;
            }
            PT.buildUserThemePrompt = function(userThemeDescription) {
                return buildFinalPrompt(templates.master_theme_prompt_template, templates.user_theme_task, userThemeDescription);
            };
            PT.buildEyeThemePrompt = function(triggerCommand) {
                return buildFinalPrompt(templates.master_theme_prompt_template, templates.eye_theme_task, triggerCommand);
            };
            PT.buildIThemePrompt = function(triggerCommand) {
                return buildFinalPrompt(templates.master_theme_prompt_template, templates.i_theme_task, triggerCommand);
            };
        } catch (e) {
            return;
        }
    }(window.PromptTemplates);
    window.EyeCommands = {
        resetSettingsToDefault: async function() {
            await window.Settings.resetToDefaults();
        },
        processInputAndExecute: async function(rawUserInput) {
            let finalPromptString = null;
            try {
                const commandInput = rawUserInput.trim().toLowerCase();
                const fullInputText = rawUserInput.trim();
                if ("/reset" === commandInput) {
                    await this.resetSettingsToDefault();
                    window.State.aiThemeModalConfirmationText = "All settings have been reset to defaults.";
                    window.ModalEye.processingComplete();
                } else if ("/eye" === commandInput) {
                    window.commandType = "/eye command";
                    finalPromptString = window.PromptTemplates.buildEyeThemePrompt(fullInputText);
                    window.EyeBot.submitPreparedPromptToAI(finalPromptString);
                } else if ("/i" === commandInput) {
                    window.commandType = "/i command";
                    finalPromptString = window.PromptTemplates.buildIThemePrompt(fullInputText);
                    window.EyeBot.submitPreparedPromptToAI(finalPromptString);
                } else {
                    window.commandType = "theme_description";
                    finalPromptString = window.PromptTemplates.buildUserThemePrompt(rawUserInput);
                    window.EyeBot.submitPreparedPromptToAI(finalPromptString);
                }
            } catch (error) {
                window.State.aiThemeModalConfirmationText = `Error processing command: ${error.message}`;
                window.ModalEye.processingComplete();
            }
        }
    };
    window.App = {
        async init() {
            await window.Settings.load();
            if (window.State.settings.vibeModeActive) {
                window.State.isVibeModeActive = !0;
            }
            const injectCss = (resourceName, styleId) => {
                const cssText = GM_getResourceText(resourceName);
                const styleEl = GM_addStyle(cssText);
                if (styleId) {
                    styleEl.id = styleId;
                }
                if (styleId) {
                    styleEl.disabled = !0;
                }
            };
            GM_addStyle(GM_getResourceText("MAIN_CSS"));
            GM_addStyle(GM_getResourceText("POPUP_CSS"));
            GM_addStyle(GM_getResourceText("SNIPPETS_CSS"));
            GM_addStyle(GM_getResourceText("EYE_MODAL_CSS"));
            GM_addStyle(GM_getResourceText("PROMPT_COMPOSER_CSS"));
            GM_addStyle(GM_getResourceText("GOOGLE_OVERRIDES_CSS"));
            GM_addStyle(GM_getResourceText("THEME_TEMPLATE_CSS"));
            injectCss("PERSONAL_THEME_CSS", "eic-theme-personal-css");
            injectCss("DOS_THEME_CSS", "eic-theme-dos-css");
            injectCss("NATURE_THEME_CSS", "eic-theme-nature-css");
            window.Styles.addCoreStyles();
            window.UI.init();
            window.Popup.create();
            GM_registerMenuCommand("Adv. Control Settings (AI Studio)", window.Popup.toggle);
            window.ThemeManager.loadThemes();
            window.ModalEye._init();
            window.ThemeManager.applyTheme(window.State.settings.activeTheme);
            window.EICButtonManager.create();
            window.EyeBot.init();
            window.Snippets.initialize();
            window.ElementWatcher.start();
            window.HistoryManager.initialize();
            window.HistoryManager.applyVisibilityRules();
            window.UI.applyLayoutRules();
        },
        initializeProgressively() {
            const layoutContainer = document.querySelector(window.Config.selectors.overallLayout);
            if (layoutContainer && !layoutContainer.dataset.eicLayoutRulesApplied) {
                window.UI.applyLayoutRules();
                layoutContainer.dataset.eicLayoutRulesApplied = "true";
            }
        }
    };
    if ("complete" === document.readyState || "interactive" === document.readyState) {
        window.App.init();
    } else {
        document.addEventListener("DOMContentLoaded", (() => window.App.init()));
    }
}();
