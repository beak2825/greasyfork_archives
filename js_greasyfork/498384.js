// ==UserScript==
// @name         timeclock remember me
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remembers you so you don't have to remember your badge
// @author       Eric Stanard
// @match        https://secure7.saashr.com/ta/6201879*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498384/timeclock%20remember%20me.user.js
// @updateURL https://update.greasyfork.org/scripts/498384/timeclock%20remember%20me.meta.js
// ==/UserScript==   

(function() {
    'use strict';

 
    function addAutocomplete() {
        const inputElement = document.querySelector('input.editFormText[name="Badge"]');
        if (inputElement) {
            console.log('Input element found:', inputElement);
            inputElement.setAttribute('autocomplete', 'on');
        }
    }
    addAutocomplete();
})();