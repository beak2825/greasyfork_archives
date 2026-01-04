// ==UserScript==
// @name         哔哩哔哩收藏夹显示UP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  哔哩哔哩收藏夹显示UP。
// @author       You
// @match        https://space.bilibili.com/*/favlist*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462601/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%94%B6%E8%97%8F%E5%A4%B9%E6%98%BE%E7%A4%BAUP.user.js
// @updateURL https://update.greasyfork.org/scripts/462601/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%94%B6%E8%97%8F%E5%A4%B9%E6%98%BE%E7%A4%BAUP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        var authors = document.getElementsByClassName("author");
        var pubdates = document.getElementsByClassName("meta pubdate");
        var authors_length = authors.length;
        var pubdates_length = pubdates.length;
        console.log("authors length = " + authors_length);
        console.log("pubdates length = " + pubdates_length);
        if(authors_length == pubdates_length)
        {
            for( var i_i = authors.length-1 ; i_i>-1 ; i_i-- )
            {
                pubdates[i_i].style.height="40px";
                pubdates[i_i].style.lineHeight="20px";
                pubdates[i_i].innerHTML = pubdates[i_i].innerHTML + "<br>" + authors[i_i].innerHTML;
            }
        }
    }, 3000);
})();