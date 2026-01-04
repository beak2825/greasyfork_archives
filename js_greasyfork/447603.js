// ==UserScript==
// @name         Ignore Duel Links Adblock Prompt
// @license      GNU
// @namespace    https://github.com/MythicWebsite
// @homepageURL  https://github.com/MythicWebsite/DLLeaveMeAlone
// @version      1.0
// @description  Tampermonkey script to ignore Duel Links Meta adblock prompt
// @author       Mythic
// @match        https://www.duellinksmeta.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duellinksmeta.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447603/Ignore%20Duel%20Links%20Adblock%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/447603/Ignore%20Duel%20Links%20Adblock%20Prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const callback = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // Elements have changed
                var element = document.getElementsByClassName("modal svelte-aeftzs is-active top");
                console.log(element.length);
                if (element.length > 0){
                    console.log('Found it');
                    element[0].remove()
                }
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();