// ==UserScript==
// @name         慢慢买-手机端转电脑端
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加按钮，支持手机端转电脑端
// @author       xiantong.zou
// @match        https://m.manmanbuy.com/d.aspx?id=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439799/%E6%85%A2%E6%85%A2%E4%B9%B0-%E6%89%8B%E6%9C%BA%E7%AB%AF%E8%BD%AC%E7%94%B5%E8%84%91%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/439799/%E6%85%A2%E6%85%A2%E4%B9%B0-%E6%89%8B%E6%9C%BA%E7%AB%AF%E8%BD%AC%E7%94%B5%E8%84%91%E7%AB%AF.meta.js
// ==/UserScript==


//// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
(function () {
    'use strict';
    console.log("manmanbuy to pc run!");

    // 域名跳转
    //https://m.manmanbuy.com/d.aspx?id=4199210&
    var url = document.location.href;
    var flag = "d.aspx?id="
    var ia = url.indexOf(flag)
    var ib = url.indexOf("&" ,ia)
    var pId = url.substring(ia + flag.length ,ib)

    var newUrl = "http://cu.manmanbuy.com/discuxiao_" + pId + ".aspx"
    console.log("newUrl:" + newUrl);

    document.location.href = newUrl;
    //if (document.location.href.indexOf("nga.178.com") > -1 || document.location.href.indexOf("ngacn.cc") > -1 || document.location.href.indexOf("ngabbs.com") > -1 || document.location.href.indexOf("g.nga.cn") > -1) {
      //  document.location.href = document.location.href.replace('nga.178.com', 'bbs.nga.cn').replace('ngabbs.com', 'bbs.nga.cn').replace('g.nga', 'bbs.nga').replace('ngacn.cc', 'nga.cn');
    //}

})();