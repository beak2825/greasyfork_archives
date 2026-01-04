// ==UserScript==
// @name         leetcode cn 2 com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace leetcode.cn with leetcode.com
// @author       You
// @match        https://leetcode.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446216/leetcode%20cn%202%20com.user.js
// @updateURL https://update.greasyfork.org/scripts/446216/leetcode%20cn%202%20com.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    url = url.replace(".cn", ".com");
    window.open(url,"_self");
})();