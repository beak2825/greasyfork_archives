// ==UserScript==
// @name         Remove Clouds in Torn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove clouds when traveling
// @author       Latinobull14 2881384
// @match        https://www.torn.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464257/Remove%20Clouds%20in%20Torn.user.js
// @updateURL https://update.greasyfork.org/scripts/464257/Remove%20Clouds%20in%20Torn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const cloudsEl = document.querySelectorAll('.clouds')
    cloudsEl.forEach( cloud => {
    cloud.remove()
    })
})();