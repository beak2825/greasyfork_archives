// ==UserScript==
// @name         FreeGOGPcGames timer bypass
// @name:pt-BR   Burlar timer do freegogpcgames
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to bypass the timer on the FreeGogPcGames website.
// @description:pt-BR  Script para burlar o timer no site freegogpcgames
// @author       ElSopo
// @match        http*://gdl.freegogpcgames.xyz/download-gen.php?url=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freegogpcgames.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452288/FreeGOGPcGames%20timer%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/452288/FreeGOGPcGames%20timer%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var magnet;
    var dLink = document.getElementById('DLINK');
    for (var i = 0; i < dLink.children.length; i++) {
        if (dLink.children[i].tagName === 'INPUT') {
            magnet = dLink.children[i].value;
        }
    }
    if (typeof(magnet) == 'string') {
        window.location = magnet;
    }
})();