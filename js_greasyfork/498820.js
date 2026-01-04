// ==UserScript==
// @name         Servicenow draggable width chat box
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Servicenow のworkspaceのチャットBOXの幅をドラッグできる
// @author       Rococo 施
// @match        https://*/now/workspace/agent/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498820/Servicenow%20draggable%20width%20chat%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/498820/Servicenow%20draggable%20width%20chat%20box.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const processedElements = new WeakSet();

    function processChatElements() {
        document.querySelectorAll('sn-workspace-main').forEach(workspaceMain => {
            const mainPane = workspaceMain.shadowRoot?.querySelector('#main-pane');
            if (!mainPane) return;

            mainPane.querySelectorAll('sn-chat').forEach(snChat => {
                const agentChat = snChat.shadowRoot?.querySelector('sn-agent-chat');
                if (!agentChat) return;

                agentChat.shadowRoot?.querySelectorAll('.sn-chat').forEach(chatElement => {
                    if (processedElements.has(chatElement)) return;

                    chatElement.style.resize = 'horizontal';
                    chatElement.style.setProperty('overflow', 'auto', 'important');
                    chatElement.style.maxWidth = '100%';
                    processedElements.add(chatElement);
                });

                agentChat.shadowRoot?.querySelectorAll('.sn-section').forEach(section => {
                    const footer = section.querySelector('.sn-section--footer');
                    if (!footer) return;

                    const inputShell = footer.shadowRoot?.querySelector('.sn-chat-input-shell');
                    inputShell?.querySelectorAll('sn-chat-input').forEach(input => {
                        const textArea = input.shadowRoot?.querySelector('.sn-chat-textarea');
                        if (!textArea || processedElements.has(textArea)) return;

                        textArea.addEventListener('keydown', function(event) {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                event.stopImmediatePropagation();
                            }
                        }, { capture: true, passive: false });

                        processedElements.add(textArea);
                    });
                });
            });
        });
    }

    function init() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    processChatElements();
                }
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        processChatElements();
        window.addEventListener('load', processChatElements);
    }

    init();
})();
