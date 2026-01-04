// ==UserScript==
// @name         百度百科/文库/知道/经验等界面广告去除（喜欢就扫一扫打赏作者？？？）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  remove baidu ads
// @author       babybing666
// @match        *://baike.baidu.com/*
// @match        *://jingyan.baidu.com/*
// @match        *://zhidao.baidu.com/*
// @match        *://wenku.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375132/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E6%96%87%E5%BA%93%E7%9F%A5%E9%81%93%E7%BB%8F%E9%AA%8C%E7%AD%89%E7%95%8C%E9%9D%A2%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%EF%BC%88%E5%96%9C%E6%AC%A2%E5%B0%B1%E6%89%AB%E4%B8%80%E6%89%AB%E6%89%93%E8%B5%8F%E4%BD%9C%E8%80%85%EF%BC%9F%EF%BC%9F%EF%BC%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/375132/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%E6%96%87%E5%BA%93%E7%9F%A5%E9%81%93%E7%BB%8F%E9%AA%8C%E7%AD%89%E7%95%8C%E9%9D%A2%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%EF%BC%88%E5%96%9C%E6%AC%A2%E5%B0%B1%E6%89%AB%E4%B8%80%E6%89%AB%E6%89%93%E8%B5%8F%E4%BD%9C%E8%80%85%EF%BC%9F%EF%BC%9F%EF%BC%9F%EF%BC%89.meta.js
// ==/UserScript==
var timeout = 1500;
(function() {
    'use strict';
    var currentURL = window.location.href;
    var baike = /baike/;
    var jingyan = /jingyan/;
    var zhidao = /zhidao/;
    var wenku = /wenku/;
    if(baike.test(currentURL)){
        setTimeout(function () {
            document.getElementsByClassName("side-content")[0].remove();
            document.getElementsByClassName("topA")[0].remove();
            //document.getElementById("side_box_unionAd").remove();
            document.getElementsByClassName("right-ad")[0].remove();
            console.log("removed");
        }, timeout);
    } else if (jingyan.test(currentURL)){
        setTimeout(function () {
            document.getElementsByClassName("main-aside")[0].remove();
            console.log("removed");
        }, timeout);
    } else if (zhidao.test(currentURL)){
        setTimeout(function () {
            document.getElementsByClassName("qb-side")[0].remove();
            document.getElementsByClassName("text-chain-title")[0].remove();
            document.getElementsByClassName("text-chain-content")[0].remove();
            document.getElementsByClassName("last line")[0].remove();
            document.getElementsByClassName("adTopImg")[0].remove();
            document.getElementsByClassName("EC_ads_listborder")[0].remove();
            console.log("removed");
        }, timeout);
    } else if (wenku.test(currentURL)){
        setTimeout(function () {
            document.getElementsByClassName("search-aside-adWrap")[0].remove();
            document.getElementsByClassName("search-aside-newadWrap")[0].remove();
            document.getElementsByClassName("yuedu-recommend-wrap")[0].remove();
            document.getElementById("fengchaoad").remove();
            document.getElementById("lastcell-dialog").remove();
            console.log("removed");
        }, timeout);
    }
})();