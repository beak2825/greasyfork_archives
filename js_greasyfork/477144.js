// ==UserScript==
// @name         Fix left-aligned laptop
// @namespace    random.tornscripts
// @version      0.2
// @description  Laptop/PC view is broken if torntools left aligned option is enabled
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/pc.php
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477144/Fix%20left-aligned%20laptop.user.js
// @updateURL https://update.greasyfork.org/scripts/477144/Fix%20left-aligned%20laptop.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixLaptopBorder() {
        document.body.getElementsByClassName('content')[0].setAttribute('style', 'width: 976px;');
    }

    // Call the function to pull the border together
    fixLaptopBorder();

})();
