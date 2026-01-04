// ==UserScript==
// @name         TW - Correctif luminosité
// @version      0.1
// @description  Meh
// @author       Thathanka Iyothanka
// @include		http*://*.the-west.*/game.php*
// @include		http*://*.the-west.*.*/game.php*
// @grant        none
// @namespace https://greasyfork.org/users/13941
// @downloadURL https://update.greasyfork.org/scripts/40150/TW%20-%20Correctif%20luminosit%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/40150/TW%20-%20Correctif%20luminosit%C3%A9.meta.js
// ==/UserScript==

(function() {
    $('style:contains("brightness"):first').remove();
})();