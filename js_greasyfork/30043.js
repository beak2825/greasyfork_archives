// ==UserScript==
// @name         FxP Add Quote Bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds quotes
// @copyright    2016+, LOL
// @match        https://www.fxp.co.il/showthread.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30043/FxP%20Add%20Quote%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/30043/FxP%20Add%20Quote%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elems = document.getElementsByTagName('input');
    for(i = 0; i < elems.length; i++) {

        if(elems[i].id.includes('post_imod_checkbox')) {
            elems[i].click();
        }
    }
    document.getElementsByClassName('sp_show showth-next-left')[0].click()

})();