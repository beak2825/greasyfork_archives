// ==UserScript==
// @name         евгений octo tanker
// @namespace    http://tampermonkey.net/
// @version      1.337
// @description  было
// @author       Нимбач
// @match        https://diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390532/%D0%B5%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9%20octo%20tanker.user.js
// @updateURL https://update.greasyfork.org/scripts/390532/%D0%B5%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9%20octo%20tanker.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('mousedown', function(e) {
        console.log(e.button)
        if(e.button==2) {
            window.input.keyDown(67);
            window.input.keyUp(67);
        }
    });
})();