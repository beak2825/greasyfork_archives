// ==UserScript==
// @name         GYING Select-Element-Width-Issue Fix
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  GYING Select-Element-Width-Issue Fix!
// @author       You
// @match        https://www.gying.si/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gying.si
// @grant        MIT
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/524010/GYING%20Select-Element-Width-Issue%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/524010/GYING%20Select-Element-Width-Issue%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const select = document.querySelector('#xle select');
    if(select) {
       select.style = 'width: auto !important'
       console.log('Fix select successfully.')
    }
})();