// ==UserScript==
// @name         Sorry, netsolitare
// @namespace    https://www.netsolitaire.com/
// @version      1.000
// @description  try to take over the world!
// @author       Anton
// @match        https://www.netsolitaire.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397560/Sorry%2C%20netsolitare.user.js
// @updateURL https://update.greasyfork.org/scripts/397560/Sorry%2C%20netsolitare.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function deleteAdArea() {
        let adarea = document.getElementById('adarea');
        let gameui = document.getElementById('game-ui');
        if (adarea && gameui) {
            adarea.parentElement.removeChild(adarea);
            gameui.style.left = '0';
        } else {
            setTimeout(deleteAdArea, 300);
        }
    }
    deleteAdArea();
})();