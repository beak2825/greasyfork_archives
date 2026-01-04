// ==UserScript==
// @name         Leetcode auto delete local submissions
// @version      2023-12-10
// @description  Useful when you try to solve a problem again if you don't want to see your past submission. This script removes the cache and set the leetcode language to python3 (feel free to change it). 
// @author       You
// @match        https://leetcode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// @license MIT 
// @namespace https://greasyfork.org/users/1235671
// @downloadURL https://update.greasyfork.org/scripts/482524/Leetcode%20auto%20delete%20local%20submissions.user.js
// @updateURL https://update.greasyfork.org/scripts/482524/Leetcode%20auto%20delete%20local%20submissions.meta.js
// ==/UserScript==

(function() {
    'use strict';
    localStorage.clear();
    localStorage.setItem("global_lang","python3");
    localStorage.setItem("QD_SHOWN_DYNAMIC_LAYOUT_MODAL","true");
})();