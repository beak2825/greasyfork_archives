// ==UserScript==
// @name         JustEat auto set order note
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto fill order note during just eat order
// @author       Valerio Montieri
// @license MIT
// @match        https://www.justeat.it
// @include      https://www.justeat.it/order/time/?menu=*&basket=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=justeat.it
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452985/JustEat%20auto%20set%20order%20note.user.js
// @updateURL https://update.greasyfork.org/scripts/452985/JustEat%20auto%20set%20order%20note.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let textArea = document.getElementById('Note');
    textArea.value = 'Le tue note qui';

})();