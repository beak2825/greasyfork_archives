// ==UserScript==
// @name         TG WebA User Blocker
// @namespace    https://github.com/scientificworld
// @version      2024-07-29
// @description  Block user in Telegram group
// @author       scientificworld
// @license      Unlicense
// @match        https://web.telegram.org/a/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=telegram.org
// @require      https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@a03933c5e42343b434c7800eb2777575342d8287/waitForKeyElements.js
// @require      https://update.greasyfork.org/scripts/455875/1123973/AkiLib.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/502068/TG%20WebA%20User%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/502068/TG%20WebA%20User%20Blocker.meta.js
// ==/UserScript==

let blocked = aki.createNormalMenu("Blocked user IDs (comma-delimited)");

waitForKeyElements("#MiddleColumn", () => {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    // if (["Message", "MessageList"].some(c => node.classList.contains(c)))
                    if (node.classList) {
                        let elements;
                        if (node.classList.contains("Message")) {
                            elements = [node];
                        } else if (node.classList.contains("MessageList")) {
                            if (node.classList.contains("no-avatars")) {
                                return;
                            }
                            elements = node.querySelectorAll(".Message");
                        }
                        if (elements) {
                            elements.forEach(element => {
                                if (!element.classList.contains("own")) {
                                    let peerId, sibling = element;
                                    while (!peerId && sibling) {
                                        try {
                                            peerId = sibling.querySelector(".Avatar.size-small").dataset.peerId;
                                        } catch (error) {
                                            sibling = sibling.nextElementSibling;
                                        }
                                    }
                                    if (aki.getMenuValue(blocked).split(",").includes(peerId)) {
                                        element.style.display = "none";
                                    }
                                    element.dataset.peerId = peerId;
                                    // console.log(element);
                                }
                            });
                        }
                    }
                });
            }
        });
    });
    observer.observe(document.querySelector("#MiddleColumn"), { subtree: true, childList: true });
});