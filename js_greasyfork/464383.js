// ==UserScript==
// @name         ProtonDB Hide Steam Deck Section
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides Steam Deck section on ProtonDB while viewing games
// @author       DariusLMoore
// @license      MIT
// @match        https://www.protondb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=protondb.com
// @grant        none
// @run-at     document-start
// @downloadURL https://update.greasyfork.org/scripts/464383/ProtonDB%20Hide%20Steam%20Deck%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/464383/ProtonDB%20Hide%20Steam%20Deck%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        setInterval(function(){
            for (let span of document.getElementsByTagName("span")) {
                if (span.textContent == "Steam Deck") {
                    span.parentElement.parentElement.parentElement.style.display = "none"
                }
            }
        }, 1300);
    });

})();