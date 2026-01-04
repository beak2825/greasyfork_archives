// ==UserScript==
// @name         Neopets - Karla's Auto Fill Shop Till
// @namespace    karla@neopointskarla
// @license      GPL3
// @version      0.0.1
// @description  Automatically fills shop till withdraw amount for you
// @author       Karla
// @match        *://*.neopets.com/market.phtml?type=till*
// @icon         https://github.com/karlaneo/neopets-scripts/blob/main/favicon-32x32.png?raw=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546474/Neopets%20-%20Karla%27s%20Auto%20Fill%20Shop%20Till.user.js
// @updateURL https://update.greasyfork.org/scripts/546474/Neopets%20-%20Karla%27s%20Auto%20Fill%20Shop%20Till.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const npInTill = document.querySelector('p b').textContent.replace(/,/g, '').replace(' NP', '');
    document.querySelector('[name="amount"]').value = npInTill;
})();