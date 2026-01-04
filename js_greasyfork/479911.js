// ==UserScript==
// @name         Catbox Loli Remover
// @namespace    http://catbox.moe/
// @version      1.0.0
// @description  Removes the disturbing loli in the bottom right corner.
// @license      MIT
// @author       Urebyq iba'Uhfvaobyig
// @match        https://*.catbox.moe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catbox.moe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479911/Catbox%20Loli%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/479911/Catbox%20Loli%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var imageDiv = document.querySelector('.image');

    if (imageDiv) {
        imageDiv.parentNode.removeChild(imageDiv);
        console.log("disgusting loli shit removed.\nyou're welcome!")
    } else {
        console.warn('disgusting loli shit not found.');
    }

})();