// ==UserScript==
// @name         微博文章 手机版跳电脑板
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       zcf0508
// @match        https://media.weibo.cn/article?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34958/%E5%BE%AE%E5%8D%9A%E6%96%87%E7%AB%A0%20%E6%89%8B%E6%9C%BA%E7%89%88%E8%B7%B3%E7%94%B5%E8%84%91%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/34958/%E5%BE%AE%E5%8D%9A%E6%96%87%E7%AB%A0%20%E6%89%8B%E6%9C%BA%E7%89%88%E8%B7%B3%E7%94%B5%E8%84%91%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // Your code here...



    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

    var id=GetQueryString("id");

    window.location.href="https://weibo.com/ttarticle/p/show?id="+id;


})();