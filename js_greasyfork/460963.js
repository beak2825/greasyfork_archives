// ==UserScript==
// @name        Shadow Hibeams
// @namespace   Astraltoremail@gmail.com
// @author      Tsunders
// @description Shines a light on shadows so you don't miss them.
// @include     http*://*.pardus.at/main.php*
// @version     1.1
// @grant       none
// @icon 		http://static.pardus.at/img/std/opponents/shadow.png
// @downloadURL https://update.greasyfork.org/scripts/460963/Shadow%20Hibeams.user.js
// @updateURL https://update.greasyfork.org/scripts/460963/Shadow%20Hibeams.meta.js
// ==/UserScript==

// 1.1 2018 november 28 download migration
// 1.0 2018 november 08 initial creation

function HighlightShadows() {
    var shadows = document.querySelectorAll('#navarea a > img[src*=shadow]');
    for (var i = 0; i < shadows.length; i++) {
        shadows[i].parentNode.setAttribute('style', 'background:#00B448');
    }
}

HighlightShadows();