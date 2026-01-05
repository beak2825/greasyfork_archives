// ==UserScript==
// @name         [firstBank] Hack firstBank login for 1password
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  allow right click and set id for loginCustId
// @author       You
// @match        https://ibank.firstbank.com.tw/NetBank/index103.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22192/%5BfirstBank%5D%20Hack%20firstBank%20login%20for%201password.user.js
// @updateURL https://update.greasyfork.org/scripts/22192/%5BfirstBank%5D%20Hack%20firstBank%20login%20for%201password.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.id-num')[0].id='loginCustId';
    document.oncontextmenu = null;

    // Your code here...
})();