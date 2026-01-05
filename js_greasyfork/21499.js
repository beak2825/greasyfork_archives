// ==UserScript==
// @name         Travian Style Fix
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  fix class
// @author       iti
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include      http://*.travian.*/dorf1.php*
// @include      http://*.travian.*/dorf2.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21499/Travian%20Style%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/21499/Travian%20Style%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var parent = document.querySelector('#levels') || document.querySelector('#village_map');
    var divs = parent.querySelectorAll('div');
        for(var i=0; i<divs.length; i++){
            divs[i].className += ' colorLayer';
            divs[i].innerHTML = '<div class="labelLayer">'+divs[i].innerText+'</div>';
        }
})();