// ==UserScript==
// @name         hide douban movie short comments
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏豆瓣电影短评防剧透
// @author       nichijou
// @match        https://movie.douban.com/subject/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451780/hide%20douban%20movie%20short%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/451780/hide%20douban%20movie%20short%20comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interest = document.getElementById("interest_sect_level");
    if (! interest.textContent.includes("我的评价")) {
        var comments = document.getElementById("hot-comments");
        comments.style.display = "none";

        var button = document.createElement("a");
        button.style.color = "#37a";
        button.innerText = "显示短评";
        comments.parentNode.insertBefore(button, comments);

        button.addEventListener("click", () => {
            button.remove();
            comments.style.display = "block";
        });
    }

})();
