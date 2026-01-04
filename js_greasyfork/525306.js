// ==UserScript==
// @name         Re-add RainbowPls emote
// @namespace    intercorpse.neoVeryPog
// @version      2025-01-20
// @description  Re-adds RainbowPls as an emote
// @author       intercorpse
// @match        https://www.destiny.gg/embed/chat*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/525306/Re-add%20RainbowPls%20emote.user.js
// @updateURL https://update.greasyfork.org/scripts/525306/Re-add%20RainbowPls%20emote.meta.js
// ==/UserScript==
// With thanks to yuniDev, shamefully lifted and edited PEPE

(function() {
    'use strict';
    GM_addStyle(`.emote.VeryPog_OG { width:32px; height: 30px; background-image: url('https://wikicdn.destiny.gg/0/01/VeryPog.png') }`);
    GM_addStyle(`.msg-chat .emote.VeryPog_OG { margin-top: -30px; top: 7.5px; }`);
    GM_addStyle(`.emote.RainbowPls { width:32px; height: 32px; background-image: url('https://wikicdn.destiny.gg/f/f4/GRainbowPls.png') }`);
    GM_addStyle(`.msg-chat .emote.RainbowPls { margin-top: -30px; top: 7.5px; }`);

    function mutationCallback(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const addedNode of mutation.addedNodes) {
                    const textContainer = addedNode.querySelector(".text");
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)VeryPog_OG(?=\s|$|<)/g, '$1<div class="emote VeryPog_OG">VeryPog_OG</div>');
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)RainbowPls(?=\s|$|<)/g, '$1<div class="emote RainbowPls">RainbowPls</div>');
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