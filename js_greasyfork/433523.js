// ==UserScript==
// @name         Twitter Go Back with H key
// @namespace    https://gist.github.com/eggbean/ba4daf82f132421c69dbd2c2e0b3e061/raw/twitter_go_back.user.js
// @version      1.1
// @description  Makes the unused H key a browser back button for better H,J,K,L keyboard navigation
// @author       https://github.com/eggbean
// @match        https://x.com/*
// @icon         https://x.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433523/Twitter%20Go%20Back%20with%20H%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/433523/Twitter%20Go%20Back%20with%20H%20key.meta.js
// ==/UserScript==

(function() {
    var gKeyPressed = false;
    addEventListener("keydown", function(e){
        if (document.activeElement.tagName != 'INPUT' && document.activeElement.tagName != 'TEXTAREA' && document.activeElement.contentEditable != 'true') {
            switch (e.keyCode) {
                case 71: //"g"
                    gKeyPressed = true;
                    break;
                case 72: //"h"
                    if (e.keyCode === 72 && gKeyPressed === false) {
                        history.back();
                    }
                    break;
                default:
                    gKeyPressed = false;
                    break;
            }
        }
    });
})();
