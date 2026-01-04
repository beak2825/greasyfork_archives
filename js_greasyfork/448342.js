// ==UserScript==
// @name         [Neopets] Wishing Well Autofill (Useless Utility Script)
// @namespace    https://greasyfork.org/en/scripts/448342
// @version      0.23
// @description  Yes, I'm that lazy.
// @author       Piotr Kardovsky
// @match        http*://www.neopets.com/wishing.phtml*
// @icon         https://neopets.com//favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448342/%5BNeopets%5D%20Wishing%20Well%20Autofill%20%28Useless%20Utility%20Script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/448342/%5BNeopets%5D%20Wishing%20Well%20Autofill%20%28Useless%20Utility%20Script%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Amount of NP to donate
    const donation = 21;
    // Item name (make sure it's exact). If you don't want the item autofilled, have it say:
    // const wish = ''; // or just uncomment this line and comment out the line below.
    const wish = 'Neopets 23rd Birthday Goodie Bag';

//    window.addEventListener('load', () => {
        document.querySelector('input[name="donation"]').value = donation;
        document.querySelector('input[name="wish"]').value = wish;
//    });

})();