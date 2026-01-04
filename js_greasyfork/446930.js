// ==UserScript==
// @name         TreasuryDirect Password Typing Enabler
// @namespace    TreasuryDirect Password Typing Enabler
// @version      0.1
// @license      GPL
// @description  Don't use their thingy lol
// @author       You
// @match        https://www.treasurydirect.gov/RS/PW-Display.do
// @icon         https://www.treasurydirect.gov/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446930/TreasuryDirect%20Password%20Typing%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/446930/TreasuryDirect%20Password%20Typing%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pwordInput = document.querySelector('.pwordinput');
    for (const attribute of ['autocomplete', 'readonly']){
        pwordInput.removeAttribute(attribute);
    };
    pwordInput.style.backgroundColor = '#fff';
})();