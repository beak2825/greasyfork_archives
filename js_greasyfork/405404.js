// ==UserScript==
// @name         Western Progrev
// @namespace    https://www.westernunion.com
// @version      0.1
// @description  try to take over the world!
// @author       F A T H E R
// @match        *://www.westernunion.com/*/*/home.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405404/Western%20Progrev.user.js
// @updateURL https://update.greasyfork.org/scripts/405404/Western%20Progrev.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('div.col-sm-2:nth-child(3) > ul:nth-child(2) > ul:nth-child(1) > li:nth-child(1) > a:nth-child(1)').scrollIntoView()
})();