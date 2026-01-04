// ==UserScript==
// @name         block baidu search news
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       TSO
// @match        https://www.baidu.com/s*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398665/block%20baidu%20search%20news.user.js
// @updateURL https://update.greasyfork.org/scripts/398665/block%20baidu%20search%20news.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('fuck bd')
    document.getElementById('content_right').style.display = 'none';
    // Your code here...
})();