// ==UserScript==
// @name         no more g*re accounts
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2024-03-06
// @description  remove 'cool new people' from spacehey
// @author       bibbs
// @match        https://spacehey.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spacehey.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489110/no%20more%20g%2Are%20accounts.user.js
// @updateURL https://update.greasyfork.org/scripts/489110/no%20more%20g%2Are%20accounts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var divs = document.getElementsByTagName('div');
    var i;
    for (i in divs) {
        if (divs[i].className && divs[i].className.match(".*new-people.*")) {
            divs[i].parentNode.removeChild(divs[i]);
        }
    }
})();