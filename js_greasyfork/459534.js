// ==UserScript==
// @name       微软积分自动搜索
// @namespace  http://tampermonkey.net/
// @version    1.1
// @description  自动进行搜索任务
// @author     awslnotbad
// @match      *://*.bing.com/*
// @grant      none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459534/%E5%BE%AE%E8%BD%AF%E7%A7%AF%E5%88%86%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/459534/%E5%BE%AE%E8%BD%AF%E7%A7%AF%E5%88%86%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

        setInterval(function() {
            // Generate a random search query
            var search = generateRandomSearch();
            // Enter the search query into the Bing search bar
            document.getElementById("sb_form_q").value = search;
            // Submit the search
            document.getElementById("sb_form").submit();
        }, 500); // .5 seconds

    function generateRandomSearch() {
        var search = "";
        // Generate a random string of 8 characters
        for (var i = 0; i < 5; i++) {
            // Generate a random number between 0 and 1
            var r = Math.random();
            // 如果数字小于0.5，随机添加字母
            if (r < 0.5) {
                search += String.fromCharCode(Math.floor(Math.random() * 26) + 65);
            }
            // Otherwise, add a random number (0-9) to the search string
            else {
                search += Math.floor(Math.random() * 10);
            }
        }
        return search;
    }
})();