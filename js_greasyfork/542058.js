// ==UserScript==
// @name         DGG chat Re-add lost emotes RainbowPls, pokiKick, melW, nathanW emotes
// @namespace    FishVernanda
// @version      2025-08-01
// @description  Re-adds RainbowPls, pokiKick, melW, and nathanW as emotes
// @author       FishVernanda
// @match        https://www.destiny.gg/embed/chat*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542058/DGG%20chat%20Re-add%20lost%20emotes%20RainbowPls%2C%20pokiKick%2C%20melW%2C%20nathanW%20emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/542058/DGG%20chat%20Re-add%20lost%20emotes%20RainbowPls%2C%20pokiKick%2C%20melW%2C%20nathanW%20emotes.meta.js
// ==/UserScript==
// With thanks to yuniDev and intercropse shamefully lifted and edited PEPE

// ==UserScript==
// @name         Re-add RainbowPls, pokiKick, melW, nathanW emotes
// @namespace    FishVernanda
// @version      2025-07-08
// @description  Re-adds RainbowPls, pokiKick, melW, and nathanW as emotes
// @author       FishVernanda
// @match        https://www.destiny.gg/embed/chat*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL  na
// @updateURL    na
// ==/UserScript==
// With thanks to yuniDev and intercropse shamefully lifted and edited PEPE

(function() {
    'use strict';

    GM_addStyle(`.emote.RainbowPls { width:32px; height: 32px; background-image: url('https://wikicdn.destiny.gg/f/f4/GRainbowPls.png') }`);
    GM_addStyle(`.msg-chat .emote.RainbowPls { margin-top: -30px; top: 7.5px; }`);

    GM_addStyle(`.emote.pokiKick { width:61px; height: 32px; background-image: url('https://wikicdn.destiny.gg/b/b1/Pokikick.gif') }`);
    GM_addStyle(`.msg-chat .emote.pokiKick { margin-top: -32px; top: 8px; }`);

    GM_addStyle(`.emote.melW { width:28px; height: 28px; background-image: url('https://wikicdn.destiny.gg/2/2e/MelWemote.png') }`);
    GM_addStyle(`.msg-chat .emote.melW { margin-top: -28px; top: 7px; }`);

    GM_addStyle(`.emote.nathanW { width:28px; height: 28px; background-image: url('https://wikicdn.destiny.gg/e/ef/NathanW.png') }`);
    GM_addStyle(`.msg-chat .emote.nathanW { margin-top: -28px; top: 7px; }`);

    function replaceCaseInsensitive(text, emoteName, className) {
        const regex = new RegExp(`(^|\\s|>)(${emoteName})(?=\\s|$|<)`, 'gi');
        return text.replace(regex, `$1<div class="emote ${className}">${emoteName}</div>`);
    }

    function mutationCallback(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const addedNode of mutation.addedNodes) {
                    const textContainer = addedNode.querySelector(".text");
                    if (!textContainer) continue;

                    let html = textContainer.innerHTML;
                    html = replaceCaseInsensitive(html, "RainbowPls", "RainbowPls");
                    html = replaceCaseInsensitive(html, "pokiKick", "pokiKick");
                    html = replaceCaseInsensitive(html, "melW", "melW");
                    html = replaceCaseInsensitive(html, "nathanW", "nathanW");
                    textContainer.innerHTML = html;
                }
            }
        }
    }

    const targetElement = document.getElementById("chat-win-main")?.querySelector(".chat-lines");

    if (targetElement) {
        const observer = new MutationObserver(mutationCallback);
        observer.observe(targetElement, { childList: true });
    }
})();
