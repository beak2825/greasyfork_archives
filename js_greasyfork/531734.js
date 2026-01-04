// ==UserScript==
// @name         Un-genocide some DGG emotes
// @namespace    intercorpse.neodggL
// @version      2025-04-21.2
// @description  Un-warcrimes some of the genocided DGG emotes
// @author       intercorpse
// @match        https://www.destiny.gg/embed/chat*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531734/Un-genocide%20some%20DGG%20emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/531734/Un-genocide%20some%20DGG%20emotes.meta.js
// ==/UserScript==
// With thanks to yuniDev, shamelessly lifted and modified PEPE

(function() {
    'use strict';
    GM_addStyle(`.emote.VeryPog_OG { width:32px; height: 30px; background-image: url('https://wikicdn.destiny.gg/0/01/VeryPog.png') }`);
    GM_addStyle(`.msg-chat .emote.VeryPog_OG { margin-top: -30px; top: 7.5px; }`);

    GM_addStyle(`.emote.nathanBird { width:32px; height: 30px; background-image: url('https://wikicdn.destiny.gg/a/a0/NathanBird.png') }`);
    GM_addStyle(`.msg-chat .emote.nathanBird { margin-top: -30px; top: 7.5px; }`);

    GM_addStyle(`.emote.Okayge { width:32px; height: 30px; background-image: url('https://wikicdn.destiny.gg/3/3a/Okayge.png') }`);
    GM_addStyle(`.msg-chat .emote.Okayge { margin-top: -30px; top: 7.5px; }`);

    GM_addStyle(`.emote.PICKME { width:32px; height: 30px; background-image: url('https://wikicdn.destiny.gg/c/c6/PICKME.png') }`);
    GM_addStyle(`.msg-chat .emote.PICKME { margin-top: -30px; top: 7.5px; }`);

    GM_addStyle(`.emote.BLUBBERS { width:32px; height: 30px; background-image: url('https://wikicdn.destiny.gg/2/2f/BLUBBERS.png') }`);
    GM_addStyle(`.msg-chat .emote.BLUBBERS { margin-top: -30px; top: 7.5px; }`);

    GM_addStyle(`.emote.FREEDGG { width:32px; height: 30px; background-image: url('https://wikicdn.destiny.gg/c/cd/FREEDGG.png') }`);
    GM_addStyle(`.msg-chat .emote.FREEDGG { margin-top: -30px; top: 7.5px; }`);

    GM_addStyle(`.emote.LOLE { width:32px; height: 30px; background-image: url('https://wikicdn.destiny.gg/a/aa/LOLE.png') }`);
    GM_addStyle(`.msg-chat .emote.LOLE { margin-top: -30px; top: 7.5px; }`);

    GM_addStyle(`.emote.comfggL { width:32px; height: 30px; background-image: url('https://wikicdn.destiny.gg/0/09/ComfggL.png') }`);
    GM_addStyle(`.msg-chat .emote.comfggL { margin-top: -30px; top: 7.5px; }`);

    GM_addStyle(`.emote.PepoThink { width:32px; height: 30px; background-image: url('https://wikicdn.destiny.gg/1/16/PepoThink.png') }`);
    GM_addStyle(`.msg-chat .emote.PepoThink { margin-top: -30px; top: 7.5px; }`);

    GM_addStyle(`.emote.NoThanks{ width:32px; height: 30px; background-image: url('https://wikicdn.destiny.gg/e/ea/NoThanks.png') }`);
    GM_addStyle(`.msg-chat .emote.NoThanks { margin-top: -30px; top: 7.5px; }`);

    function mutationCallback(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const addedNode of mutation.addedNodes) {
                    const textContainer = addedNode.querySelector(".text");
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)VeryPog_OG(?=\s|$|<)/g, '$1<div class="emote VeryPog_OG">VeryPog_OG</div>');
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)nathanBird(?=\s|$|<)/g, '$1<div class="emote nathanBird">nathanBird</div>');
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)Okayge(?=\s|$|<)/g, '$1<div class="emote Okayge">Okayge</div>');
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)PICKME(?=\s|$|<)/g, '$1<div class="emote PICKME">vPICKME</div>');
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)BLUBBERS(?=\s|$|<)/g, '$1<div class="emote BLUBBERS">BLUBBERS</div>');
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)FREEDGG(?=\s|$|<)/g, '$1<div class="emote FREEDGG">FREEDGG</div>');
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)LOLE(?=\s|$|<)/g, '$1<div class="emote LOLE">LOLE</div>');
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)comfggL(?=\s|$|<)/g, '$1<div class="emote comfggL">comfggL</div>');
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)PepoThink(?=\s|$|<)/g, '$1<div class="emote PepoThink">PepoThink</div>');
                    textContainer.innerHTML = textContainer.innerHTML.replace(/(^|\s|>)NoThanks(?=\s|$|<)/g, '$1<div class="emote NoThanks">NoThanks</div>');
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