// ==UserScript==
// @name         Easy Copy Selected Text - Enhanced
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Automatically copies selected text to clipboard with additional features
// @author       diogoodev
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529764/Easy%20Copy%20Selected%20Text%20-%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/529764/Easy%20Copy%20Selected%20Text%20-%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        enabledByDefault: true,
        copyDelay: 10,             
        selectionDelay: 500,       
        notificationDuration: 2000, 
        toggleKey: 'Alt',          
        middleClickPaste: true     
    };

    let state = {
        enabled: config.enabledByDefault,
        oldSelectedText: "",
        copyInProgress: false,
        clipboard: ""
    };

    function addStyles() {
        const styles = `
            #easy-copy-snackbar {
                visibility: hidden;
                min-width: 250px;
                margin-left: -125px;
                text-align: center;
                border-radius: 8px;
                padding: 12px;
                position: fixed;
                z-index: 999999;
                left: 50%;
                top: 30px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                font-size: 14px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                opacity: 0;
                transition: opacity 0.3s, top 0.3s;
            }

            #easy-copy-snackbar.success {
                background-color: #4CAF50;
                color: white;
            }

            #easy-copy-snackbar.error {
                background-color: #F44336;
                color: white;
            }

            #easy-copy-snackbar.show {
                visibility: visible;
                opacity: 0.9;
                top: 30px;
            }

            .easy-copy-textarea {
                position: fixed;
                top: 0;
                left: 0;
                width: 2em;
                height: 2em;
                padding: 0;
                border: none;
                outline: none;
                box-shadow: none;
                background: transparent;
                opacity: 0;
            }
        `;

        if (typeof GM_addStyle !== "undefined") {
            GM_addStyle(styles);
        } else {
            try {
                const styleElement = document.createElement("style");
                styleElement.textContent = styles;
                if (document.head || document.documentElement) {
                    (document.head || document.documentElement).appendChild(styleElement);
                } else {
                    document.addEventListener('DOMContentLoaded', function() {
                        (document.head || document.documentElement).appendChild(styleElement);
                    });
                }
            } catch (e) {
            }
        }
    }

    function initializeUI() {
        addStyles();

        if (!document.getElementById("easy-copy-snackbar")) {
            const divSnackbar = document.createElement("div");
            divSnackbar.id = "easy-copy-snackbar";
            (document.body || document.documentElement).appendChild(divSnackbar);
        }
    }

    function getSelectionText() {
        let text = "";

        const activeEl = document.activeElement;
        const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;

        if (
            activeElTagName === "textarea" ||
            (activeElTagName === "input" && /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
            (typeof activeEl.selectionStart === "number")
        ) {
            text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
        }
        else if (window.getSelection) {
            text = window.getSelection().toString();
        }

        text = text.trim();

        if (text === state.oldSelectedText || text === "") {
            return "";
        }

        state.oldSelectedText = text;
        return text;
    }

    function showSnackbar(message, isSuccess = true) {
        const snackbar = document.getElementById("easy-copy-snackbar");
        if (!snackbar) return;

        snackbar.textContent = message;
        snackbar.className = isSuccess ? "show success" : "show error";

        setTimeout(() => {
            snackbar.className = snackbar.className.replace("show", "");
        }, config.notificationDuration);
    }

    function copyTextToClipboard(text) {
        if (state.copyInProgress || !text) return;

        state.copyInProgress = true;

        try {
            if (typeof GM_setClipboard !== "undefined") {
                GM_setClipboard(text, "text");
                state.clipboard = text;
                showSnackbar("Text copied");
                state.copyInProgress = false;
                return;
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text)
                    .then(() => {
                        state.clipboard = text;
                        showSnackbar("Text copied");
                    })
                    .catch(err => {
                        fallbackCopyMethod(text);
                    })
                    .finally(() => {
                        state.copyInProgress = false;
                    });
                return;
            }

            fallbackCopyMethod(text);

        } catch (err) {
            state.copyInProgress = false;
        }
    }

    function fallbackCopyMethod(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        textArea.setAttribute("readonly", "");
        textArea.setAttribute("class", "easy-copy-textarea");

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                state.clipboard = text;
                showSnackbar("Text copied");
            } else {
                showSnackbar("Failed to copy text", false);
            }
        } catch (err) {
            showSnackbar("Failed to copy text", false);
        }

        document.body.removeChild(textArea);
        state.copyInProgress = false;
    }

    function pasteText() {
        if (!state.clipboard) return;

        const activeEl = document.activeElement;
        const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;

        if (
            activeElTagName === "textarea" ||
            (activeElTagName === "input" && /^(?:text|search|password|tel|url)$/i.test(activeEl.type))
        ) {
            const start = activeEl.selectionStart || 0;
            const end = activeEl.selectionEnd || 0;
            const textBefore = activeEl.value.substring(0, start);
            const textAfter = activeEl.value.substring(end);

            activeEl.value = textBefore + state.clipboard + textAfter;
            activeEl.selectionStart = activeEl.selectionEnd = start + state.clipboard.length;

            const event = new Event('input', { bubbles: true });
            activeEl.dispatchEvent(event);

            showSnackbar("Text pasted");
        } else if (document.execCommand) {
            try {
                document.execCommand('insertText', false, state.clipboard);
                showSnackbar("Text pasted");
            } catch (err) {
                showSnackbar("Failed to paste text", false);
            }
        }
    }

    function toggleScriptState() {
        state.enabled = !state.enabled;
        showSnackbar(state.enabled ? "Auto copy enabled" : "Auto copy disabled", state.enabled);
    }

    function initializeEvents() {
        document.addEventListener('keydown', function(e) {
            if (e.key === config.toggleKey) {
                toggleScriptState();
            }
        });

        document.addEventListener('mouseup', function(e) {
            if (!state.enabled) return;

            if (e.button === 1 && config.middleClickPaste) {
                e.preventDefault();
                pasteText();
                return;
            }

            setTimeout(() => {
                const textSelected = getSelectionText();
                if (textSelected) {
                    copyTextToClipboard(textSelected);
                }
            }, config.copyDelay);
        });

        document.addEventListener('selectionchange', function() {
            if (!state.enabled) return;

            clearTimeout(this.selectionTimer);
            this.selectionTimer = setTimeout(() => {
                if (!state.copyInProgress) {
                    const textSelected = getSelectionText();
                    if (textSelected) {
                        copyTextToClipboard(textSelected);
                    }
                }
            }, config.selectionDelay);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            initializeUI();
            initializeEvents();
        });
    } else {
        initializeUI();
        initializeEvents();
    }
})();