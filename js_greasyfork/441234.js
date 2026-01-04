// ==UserScript==
// @name         Link to LeetCode English
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a link to the same problem of the LeetCode English site.
// @author       Ernest
// @match        https://leetcode-cn.com/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode-cn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441234/Link%20to%20LeetCode%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/441234/Link%20to%20LeetCode%20English.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var elemDiv = document.createElement('div');
    elemDiv.style.cssText = 'position: absolute; width: 60px;  left:45%; top:10px;';
    elemDiv.innerHTML += "<a href=" + document.URL.replace("-cn","") + " target='_blank'> English";
    document.body.appendChild(elemDiv);
})();