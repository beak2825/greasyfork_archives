// ==UserScript==
// @name         老娘就是不用百度App，也容不下一丢丢的广告
// @namespace    http://tampermonkey.net/
// @version      4.6.0
// @description  【移动端】禁止百度搜索跳转百度app，关注公众号：OMGA，回复 13 获取更新推送，或者访问：https://3kla.cn/blog/1592.html，获取更换浏览器后的最新教程【本插件仅用来学习Js之用，请勿用于其他违法行为，所有代码均源自网络，本人只进行组合调试。如侵权，请立即联系我，我会立刻删除，vx：qq1475435770，谢谢！】
// @author       Anran
// @match        *://m.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414408/%E8%80%81%E5%A8%98%E5%B0%B1%E6%98%AF%E4%B8%8D%E7%94%A8%E7%99%BE%E5%BA%A6App%EF%BC%8C%E4%B9%9F%E5%AE%B9%E4%B8%8D%E4%B8%8B%E4%B8%80%E4%B8%A2%E4%B8%A2%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/414408/%E8%80%81%E5%A8%98%E5%B0%B1%E6%98%AF%E4%B8%8D%E7%94%A8%E7%99%BE%E5%BA%A6App%EF%BC%8C%E4%B9%9F%E5%AE%B9%E4%B8%8D%E4%B8%8B%E4%B8%80%E4%B8%A2%E4%B8%A2%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //本插件仅用来学习Js之用，请勿用于其他违法行为，所有代码均源自网络，本人只进行组合调试。如侵权，请立即联系我，我会立刻删除，vx：qq1475435770，谢谢！
    if(document.body.contains(document.getElementById("page-relative"))){
                    document.getElementById("page-relative").style.display = "none";
                    document.querySelector("div[srcid='34689']").style.display = "none";
                    var an=document.getElementsByClassName("animation");
                    for(var i=0;i<an.length;i++){
                        an[i].remove();
                    }
                }

    var key = encodeURIComponent('yuandj:killBaiduAd');

    if (window[key]) {
        return;
    };

    window[key] = true;

    /* DOM移除类 */
    class removeDom {
        constructor(classList = []) {
            this.adClassList = classList;
        };

        remove() {
            this.adClassList.forEach((c) => {
                $(`${c}`).length > 0 && $(`${c}`).remove();
                if(document.body.contains(document.getElementById("page-relative"))){
                    document.getElementById("page-relative").style.display = "none";
                    document.querySelector("div[srcid='34689']").style.display = "none";
                    var an=document.getElementsByClassName("animation");
                    for(var i=0;i<an.length;i++){
                        an[i].remove();
                    }
                }
            });
        };
    };

    /* 广告 dom 的 class 类 */
    let adClassList = ['.ec_wise_ad', '.ec_wise_pp', '.na-like-container'];
    let s = 60; /* 打开页面多少秒内循环检测并删除广告 */
    let f = 0.001; /* 广告检测频次(秒) */
    let ad = new removeDom(adClassList);

    window.onload = function () {
        ad.remove();
    };

    /* 指定时间内循环检测广告和相关搜索并删除 */
    let timer = setInterval(() => ad.remove(), f * 1000);
    setTimeout(() => clearInterval(timer), s * 1000);

})();



