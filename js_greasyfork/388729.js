// ==UserScript==
// @name         TypingClub Ad-free
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the ad div and resize the text container
// @author       LeReverandNox
// @match        https://www.typingclub.com/sportal/program-*/*.play
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388729/TypingClub%20Ad-free.user.js
// @updateURL https://update.greasyfork.org/scripts/388729/TypingClub%20Ad-free.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const checkExist = setInterval(function() {
        const ad = document.getElementById("adslot_1")
        const container = document.getElementsByClassName("container med")[0];
        const textHolder = document.getElementsByClassName("inview")[0];

        if (ad && container && textHolder) {
            for (let i = 1; i < 10; i += 1) {
                let ad = document.getElementById("adslot_" + i);
                if (ad) ad.remove();
            }
            container.style.marginRight = "auto";
            textHolder.style.cursor = "none";
            clearInterval(checkExist);
        }
    }, 100);
})();
