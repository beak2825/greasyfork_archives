// ==UserScript==
// @name         ChatGPT Auto Prompt Sender
// @namespace    https://userscript.moukaeritai.work/
// @version      0.9.8.20231001
// @description  Automates sending of the next pre-filled prompt in ChatGPT after the current response completion.
// @author       JP Zhang
// @match        https://chat.openai.com/c/*
// @match        https://chat.openai.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @supportURL   https://greasyfork.org/ja/scripts/472713
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490387/ChatGPT%20Auto%20Prompt%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/490387/ChatGPT%20Auto%20Prompt%20Sender.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';

    const observer = new MutationObserver((mutationList) => {
        mutationList.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === "BUTTON" && node.hasAttribute("data-testid") && node.getAttribute("data-testid") === "send-button") {
                        if (!node.disabled) {
                            console.log("Send button found and it is enabled. Clicking...");
                            observer.disconnect();
                            setTimeout(() => node.click(), 100);
                            return;
                        }
                    }
                });
            }
        });
    });

    function executeButtonAction() {
        const dotsDiv = document.querySelector("div.text-2xl");
        if(dotsDiv) {
            dotsDiv.querySelectorAll('span').forEach(span => {
                span.style.background = 'red';
                span.style.color = 'white';
            });
        }

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Adding event listener for the Ctrl+Alt+J keyboard shortcut
    window.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'j') {
            executeButtonAction();
        }
    });

    GM_registerMenuCommand("Schedule Next Prompt After Ongoing Response", executeButtonAction);

}, 1000);
