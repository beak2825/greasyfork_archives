// ==UserScript==
// @name         Status Icon Attack Link
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Adds a quick attack link on the activity icon on the item market
// @author       ThatJimmyGuy [2924303]
// @license      MIT
// @run-at       document-end
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/526712/Status%20Icon%20Attack%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/526712/Status%20Icon%20Attack%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;


    function addAnchorToRow(node) {
        try
        {
            const attackLinkBase = "https://www.torn.com/loader.php?sid=attack&user2ID="

            console.log(node.querySelectorAll(".linkWrap___ZS6r9"));
            let playerID = node.querySelectorAll(".linkWrap___ZS6r9")[1].getAttribute("href").split("=")[1];
            let userStatusElement = node.querySelector(".userStatusWrap___ljSJG");

            let newAttackAnchorElement = document.createElement("a");
            newAttackAnchorElement.setAttribute("href", attackLinkBase + playerID);
            newAttackAnchorElement.setAttribute("target", "_blank");

            node.insertBefore(newAttackAnchorElement, userStatusElement);
            newAttackAnchorElement.appendChild(userStatusElement);
        }
        catch(error)
        {
            console.error("Error: ", error);
        }
    }

    function checkAddedElements(mutationList, observer)
    {
        for (const mutation of mutationList) {
            if (mutation.type === "childList" && mutation.addedNodes.length) {
                Array.from(mutation.addedNodes).forEach(node => {
                    try
                    {
                        if (node.className.includes("rowWrapper___me3Ox"))
                        {
                            addAnchorToRow(node.querySelector(".userInfoBox___LRjPl"));
                        }
                        if (node.className.includes("sellerList___kgAh_"))
                        {
                            node.childNodes.forEach(listItem => {
                                if (listItem.className.includes("rowWrapper___me3Ox"))
                                {
                                    addAnchorToRow(listItem.querySelector(".userInfoBox___LRjPl"));
                                }
                            })
                        }
                    } catch(error) {
                        console.error("Error: ", error);
                    }
                })
            }
        }
    }

    let observer = new MutationObserver(checkAddedElements);
    observer.observe(document.querySelector(".item-market"), {subtree: true, childList: true});
})();