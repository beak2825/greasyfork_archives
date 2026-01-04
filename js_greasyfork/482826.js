// ==UserScript==
// @name         自动跳转到leetcode.com
// @namespace    https://gist.github.com/boris1993/5eabcb8d10fcd7fc52cf0dbdd0a7a41b
// @version      2023-12-25
// @description  在访问leetcode.cn时自动跳转到leetcode.com
// @author       boris1993
// @license      WTFPL
// @match        https://leetcode.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482826/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0leetcodecom.user.js
// @updateURL https://update.greasyfork.org/scripts/482826/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0leetcodecom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.hostname === 'leetcode.cn') {
        location.replace(`${location.protocol}//leetcode.com${location.pathname}`);
    }
})();
