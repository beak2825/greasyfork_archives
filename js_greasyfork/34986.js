// ==UserScript==
// @name         微博 手机版跳电脑板
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       zcf0508
// @match        https://m.weibo.cn/status/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34986/%E5%BE%AE%E5%8D%9A%20%E6%89%8B%E6%9C%BA%E7%89%88%E8%B7%B3%E7%94%B5%E8%84%91%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/34986/%E5%BE%AE%E5%8D%9A%20%E6%89%8B%E6%9C%BA%E7%89%88%E8%B7%B3%E7%94%B5%E8%84%91%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';



    // Your code here...

    window.onload=function(){


        var uid=$render_data.status.user.id;
        var bid=$render_data.status.bid;


        window.location.href="https://weibo.com/"+uid+"/"+bid;

    }



})();