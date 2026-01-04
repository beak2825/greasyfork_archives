// ==UserScript==
// @name         删除知乎文章板块
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.zhihu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419854/%E5%88%A0%E9%99%A4%E7%9F%A5%E4%B9%8E%E6%96%87%E7%AB%A0%E6%9D%BF%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/419854/%E5%88%A0%E9%99%A4%E7%9F%A5%E4%B9%8E%E6%96%87%E7%AB%A0%E6%9D%BF%E5%9D%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function deleteArticle(){
        var article = document.getElementsByClassName("ArticleItem");
        for(let i=0;i<article.length;i++){
            article[i].remove();
        }
        setTimeout(deleteArticle,1000);
    }

    deleteArticle();

    // Your code here...
})();