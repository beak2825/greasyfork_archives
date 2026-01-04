// ==UserScript==
// @name         Ügyintézés szabadon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides the banner on magyarorszag.hu
// @author       Domonkos Lezsák
// @match        https://magyarorszag.hu/szuf_fooldal
// @icon         https://www.google.com/s2/favicons?sz=64&domain=magyarorszag.hu
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438355/%C3%9Cgyint%C3%A9z%C3%A9s%20szabadon.user.js
// @updateURL https://update.greasyfork.org/scripts/438355/%C3%9Cgyint%C3%A9z%C3%A9s%20szabadon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const button = document.getElementById('button-1');
    if (button) button.click();
})();