// ==UserScript==
// @name         LeetCode discuss solution automatically filters JS
// @description  Easy-to-edit userscript to filter solution tab for Leetcode solutions. In the example it filters to Javascript
// @namespace    https://github.com/marcodallagatta/userscripts/raw/main/leetcode-filter-solutions
// @version      2022.09.02.20.15
// @author       Marco Dalla Gatta
// @match        https://leetcode.com/problems/*/discuss/*
// @icon         https://icons.duckduckgo.com/ip2/leetcode.com.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450629/LeetCode%20discuss%20solution%20automatically%20filters%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/450629/LeetCode%20discuss%20solution%20automatically%20filters%20JS.meta.js
// ==/UserScript==

(function() {

    const filter = 'javascript';

    'use strict';
    if (!window.location.toString().includes('tag')) {
        window.location += `?currentPage=1&orderBy=most_votes&query=&tag=${filter}`
    }
})();
