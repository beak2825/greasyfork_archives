// ==UserScript==
// @name         Transparent Play Button Ilias
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ilias.studium.kit.edu/ilias.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402310/Transparent%20Play%20Button%20Ilias.user.js
// @updateURL https://update.greasyfork.org/scripts/402310/Transparent%20Play%20Button%20Ilias.meta.js
// ==/UserScript==

function transparentPlayButton() {
    var sheet = window.document.styleSheets[0];
    sheet.insertRule('.playButtonOnScreenIcon { opacity : 20%;}', sheet.cssRules.length);

}

(function() {
    'use strict';
    window.addEventListener("load", transparentPlayButton);
})();