// ==UserScript==
// @name         No-LEB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Creling
// @match        *://www.lowendtalk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391028/No-LEB.user.js
// @updateURL https://update.greasyfork.org/scripts/391028/No-LEB.meta.js
// ==/UserScript==

(function() {
    var block_list = ["LEBFeed"];
    var author_list = document.querySelectorAll(".DiscussionAuthor");
    for ( var i = 0; i < author_list.length; i ++)
    {
        if (block_list.indexOf(author_list[i].innerText) > -1)
        {
            var temp = author_list[i].parentNode.parentNode.parentNode;
            temp.parentNode.removeChild(temp);
        }
    }
})();