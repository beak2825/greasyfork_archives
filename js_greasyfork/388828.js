// ==UserScript==
// @name         TypingClub Skip Premium Games
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically skip the premium games
// @author       LeReverandNox
// @match        https://www.typingclub.com/sportal/program-*/*.play
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388828/TypingClub%20Skip%20Premium%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/388828/TypingClub%20Skip%20Premium%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const checkExist = setInterval(function() {
        const root = document.getElementById("root");

        if (root) {
            const holder = root.firstElementChild.firstElementChild;
            setTimeout(() => {
                if (holder.children.length) {
                    holder.getElementsByClassName("edmodal-x")[0].click();
                }
            }, 250);
            clearInterval(checkExist);
        }
    }, 100);
})();