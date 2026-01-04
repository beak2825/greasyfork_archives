// ==UserScript==
// @name         禁漫去除跳动元素(安卓端M浏览器)
// @namespace    https://18comic.vip/
// @version      1.0
// @description  适用于安卓端,本人亲测安卓端M浏览器可用,注入时机选body,自动执行地址写https://18comic.vip/,只是去掉影响看漫画体验的跳动广告,别的没动,毕竟大家都要赚钱
// @author       ldsoy
// @license      下面写好了三个元素删除的语句,不想用那个就注释掉语句就行了
// @match        https://18comic.vip/*
// @match        https://18comic.org/*
// @downloadURL https://update.greasyfork.org/scripts/448916/%E7%A6%81%E6%BC%AB%E5%8E%BB%E9%99%A4%E8%B7%B3%E5%8A%A8%E5%85%83%E7%B4%A0%28%E5%AE%89%E5%8D%93%E7%AB%AFM%E6%B5%8F%E8%A7%88%E5%99%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/448916/%E7%A6%81%E6%BC%AB%E5%8E%BB%E9%99%A4%E8%B7%B3%E5%8A%A8%E5%85%83%E7%B4%A0%28%E5%AE%89%E5%8D%93%E7%AB%AFM%E6%B5%8F%E8%A7%88%E5%99%A8%29.meta.js
// ==/UserScript==

//等待界面元素加载完成
(window.onload = function(){

    //隐藏并禁用广告
    document.querySelector(".e8c78e-4_b_sticky2").style.display = "none";

    //删除碍眼广告
    //document.querySelector(".e8c78e-4_b_sticky2").remove();

    //获取到广告元素,并删除
    //document.getElementsByClassName("bot-per visible-xs visible-sm")[0].remove();

    //去除深夜食堂什么的,这个去不去的自己看着办,有人可能会需要
    //document.getElementsByClassName("col-lg-12 col-md-12")[1].getElementsByClassName("row")[0].remove();

});