// ==UserScript==
// @name         每日排查昵称关键词
// @namespace    wjddd
// @version      0.2
// @description  打开网址
// @author       meiling
// @match        https://docs.qq.com/doc/p/c35d3700edf2006b52435cb979c3d5358d3c9094?dver=3.0.27516444
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444457/%E6%AF%8F%E6%97%A5%E6%8E%92%E6%9F%A5%E6%98%B5%E7%A7%B0%E5%85%B3%E9%94%AE%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/444457/%E6%AF%8F%E6%97%A5%E6%8E%92%E6%9F%A5%E6%98%B5%E7%A7%B0%E5%85%B3%E9%94%AE%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var arr = ['官方','客服','工作','快爆','管理','官网','助手','盒子','版主','编辑',];
    var brr = ['认证','商店','平台','头像','快报','小爆哥','小爆妹','bin叔',"好游快"];

    //通过：http://admin.newsapp.5054399.com/ucenter/ucenter.nickname.list.php?ac=progress&bid=48805349&uid=&nickname=[]&lock=0&admin=0&state=1&b_time=&e_time=&identify=0
    //失败：http://admin.newsapp.5054399.com/ucenter/ucenter.nickname.list.php?ac=progress&bid=50722997&uid=&nickname=[]&lock=0&admin=0&state=2&b_time=&e_time=&identify=0
    for (var a=0;a<arr.length;a++) {
        var tongguo ="http://admin.newsapp.5054399.com/ucenter/ucenter.nickname.list.php?ac=progress&bid=48805349&uid=&nickname="+arr[a]+"&lock=0&admin=0&state=1&b_time=&e_time=&identify=0";
        //var Xtongguo ="http://admin.newsapp.5054399.com/ucenter/ucenter.nickname.list.php?ac=progress&bid=50722997&uid=&nickname="+arr[a]+"&lock=0&admin=0&state=2&b_time=&e_time=&identify=0";
        window.open(tongguo);
        //window.open(Xtongguo);
    };

    for (var b=0;b<brr.length;b++) {
        var btongguo ="http://admin.newsapp.5054399.com/ucenter/ucenter.nickname.list.php?ac=progress&bid=48805349&uid=&nickname="+brr[b]+"&lock=0&admin=0&state=1&b_time=&e_time=&identify=0";
        //var bXtongguo ="http://admin.newsapp.5054399.com/ucenter/ucenter.nickname.list.php?ac=progress&bid=50722997&uid=&nickname="+brr[b]+"&lock=0&admin=0&state=2&b_time=&e_time=&identify=0";
        window.open(btongguo);
        //window.open(bXtongguo);
    };
})();