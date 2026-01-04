// ==UserScript==
// @name         POGPLANT FOR ALL
// @namespace    yuniDev.pogplant-for-all
// @version      1.0
// @author       yuniDev
// @match        https://www.destiny.gg/embed/chat
// @grant        GM_addStyle
// @description  Adds POGPLANT for everyone
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531534/POGPLANT%20FOR%20ALL.user.js
// @updateURL https://update.greasyfork.org/scripts/531534/POGPLANT%20FOR%20ALL.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const css = `
      .emote.POGPLANT {
          background-image: url("https://cdn.destiny.gg/emotes/660a88af97d26.png"); /* Assuming this is the full URL */
          height: 28px;
          width: 28px;
      }

      .msg-chat .emote.POGPLANT {
          margin-top: -28px;
          top: 7px;
      }
    `;

    GM_addStyle(css);

    function mutationCallback(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const addedNode of mutation.addedNodes) {
                    const textContainer = addedNode.querySelector(".text");
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)POGPLANT(?=\s|$|<)/g, '$1<div class="emote POGPLANT">POGPLANT</div>');
                }
            }
        }
    }

    const targetElement = document.getElementById("chat-win-main").querySelector(".chat-lines");

    if (targetElement) {
        const observer = new MutationObserver(mutationCallback);
        observer.observe(targetElement, { childList: true });
    }
})();
