// ==UserScript==
// @name         OUTDATED MOD, DO NOT USE
// @namespace    none
// @version      1.3
// @description  uncensored chat
// @author       i30cps
// @match        *://stratums.io/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447052/OUTDATED%20MOD%2C%20DO%20NOT%20USE.user.js
// @updateURL https://update.greasyfork.org/scripts/447052/OUTDATED%20MOD%2C%20DO%20NOT%20USE.meta.js
// ==/UserScript==

var replacer = ['acyoepxusnACEOXKHMBDTI', 'асуоерхᴜꜱꪀАСЕОХКНМВᗪТＩ'];
var chat;
document.addEventListener('keydown', (e) => {
    if (!chat) {
        if (document.activeElement.placeholder.includes('Enter')) chat = document.activeElement;
    }
    else {
        for(let i = 0; i < replacer[0].length; i++){
            chat.value = chat.value.replaceAll(replacer[0].charAt(i), replacer[1].charAt(i));
        }
    }
})