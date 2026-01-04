// ==UserScript==
// @name         Quick whatsapp action
// @namespace    Violentmonkey Scripts
// @version      0.17
// @match        https://web.whatsapp.com/*
// @description  Double-Click whatsapp to copy text and add emoji
// @author       Eric
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527703/Quick%20whatsapp%20action.user.js
// @updateURL https://update.greasyfork.org/scripts/527703/Quick%20whatsapp%20action.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_TEXT = '[data-testid="selectable-text"]';
    const keyToText = {
        b: "blanket",
        c: "coffee set",
        d: "dental kit",
        f: "floormate",
        m: "mug",
        s: "shaver",
        p: "pillow",
        s: "slipper",
        t: "towel tea set",
    };

    window.addEventListener('keyup', function (e) {
        if (e.altKey) {
            const key = e.key.toLowerCase();
            if (keyToText[key]) {
                //document.querySelectorAll('[contenteditable="true"][data-lexical-editor="true"]')[1].focus()
                document.execCommand('insertText', false, ` ${keyToText[key]}`);
            }
        }
    });

    function handleDoubleClick(message) {
        const react = message.querySelector('[aria-label="React"]');
        if (!react) return;
        react.click();

        const reacted = setInterval(function () {
            const yes = document.querySelector('[alt="🙏"]');
            if (yes) {
                yes.click();
                clearInterval(reacted);

                let msg = message.querySelector(TARGET_TEXT).innerText.replace(/\n\n/g, '\n').replace(/(ext)[^0-9]+/g, '$1 ').toLowerCase();

                if (document.querySelector('#main header span[dir="auto"]').textContent.toLowerCase().includes('housekeeping')) {
                    if (!(msg.includes("gb") || msg.includes("g b") || msg.includes("dnd") || msg.includes("cook"))) {
                        navigator.clipboard.writeText(msg).catch(console.error);
                        message.querySelector(TARGET_TEXT).dispatchEvent(new MouseEvent('mouseover', {
                            bubbles: true
                        })); // requery needed

                        console.log(message);
                        const waitDown = setInterval(function () {
                            const downArrow = message.querySelector('[data-icon="ic-chevron-down-menu"]');
                            if (downArrow) {
                                downArrow.click();
                                message.querySelector(TARGET_TEXT).dispatchEvent(new MouseEvent('mouseout', {
                                    bubbles: true
                                }));
                                clearInterval(waitDown);
                                const forwardT = setInterval(function () {
                                    const forward = document.querySelector('[data-icon="forward-refreshed"]');
                                    if (forward) {
                                        forward.click();
                                        clearInterval(forwardT);
                                        const confirm = setInterval(function () {
                                            const fwd = document.querySelector('[data-icon="forward-refreshed"]');
                                            if (fwd) {
                                                fwd.click();
                                                clearInterval(confirm);
                                                const send = setInterval(function () {
                                                    const fly = document.querySelector('[data-icon="wds-ic-send-filled"]');
                                                    if (fly) {
                                                        fly.click();
                                                        clearInterval(send);
                                                    }
                                                }, 500); // check every 500ms
                                                setTimeout(function () {
                                                    clearInterval(send);
                                                }, 6e4);
                                            }
                                        }, 500); // check every 500ms
                                    }
                                }, 500); // check every 500ms
                            }
                        }, 500); // check every 500ms
                    }
                } else {
                    navigator.clipboard.writeText(msg).catch(console.error);
                }
            }
        }, 500);
    }

    function addDoubleClickListener(container) {
        container.querySelectorAll(".message-in:not(.dblclick-listener)").forEach(message => {
            message.addEventListener("dblclick", function () {
                handleDoubleClick(this);
            });
            message.classList.add("dblclick-listener");
        });
    }

    let observeChatContainerDebounce = null;

    function observeChatContainer() {
        if (observeChatContainerDebounce) {
            clearTimeout(observeChatContainerDebounce);
        }

        observeChatContainerDebounce = setTimeout(() => {
            observeChatContainerDebounce = null;
            const main = document.querySelector("#main");
            if (!main) {
                setTimeout(observeChatContainer, 1000);
                return;
            }
            const chatContainerParent = main.parentElement;

            if (chatContainerParent) {
                addDoubleClickListener(main);

                new MutationObserver(mutations => {
                    for (const mutation of mutations) {
                        if (mutation.addedNodes) {
                            for (const node of mutation.addedNodes) {
                                if (node.id === "main") {
                                    observeChatContainer();
                                    return;
                                }
                                if (node.nodeType === Node.ELEMENT_NODE && (node.classList?.contains('message-in') || node.querySelectorAll)) {
                                    addDoubleClickListener(main);
                                }
                            }
                        }
                    }
                }).observe(chatContainerParent, {
                    childList: true,
                    subtree: true
                });
            } else {
                setTimeout(observeChatContainer, 1000);
            }
        }, 500);
    }

    observeChatContainer();
})();