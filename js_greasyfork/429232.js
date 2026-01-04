// ==UserScript==
// @name         B站美化计划
// @namespace    bugjun
// @version      0.1
// @description  调整B站样式和隐藏广告区域
// @author       bugjun
// @match        https://www.bilibili.com/*
// @icon         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429232/B%E7%AB%99%E7%BE%8E%E5%8C%96%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/429232/B%E7%AB%99%E7%BE%8E%E5%8C%96%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

//首页Banner
var homeBannerImage = "https://i0.hdslb.com/bfs/album/29b944b460d793c5df699355e9baa4f0dbbe940f.png";

(function() {
    'use strict';

    var homeBanner = setInterval(() => {
        if(window.document.getElementsByClassName("bili-banner")) {
            window.document.getElementsByClassName("bili-banner")[0].style.backgroundImage = "url(" + homeBannerImage + ")"
            clearInterval(homeBanner)
        }
    }, 100);

    var indexAd = setInterval(() => {
        if(window.document.getElementById("reportFirst2")) {
            var p = window.document.getElementsByClassName("first-screen")[0]
            p.removeChild(window.document.getElementById("reportFirst2"))
            clearInterval(indexAd)
        }
    }, 100);

    var indexLive = setInterval(() => {
        if(window.document.getElementById("bili_live")) {
            var p = window.document.getElementsByClassName("proxy-box")[0]
            p.removeChild(window.document.getElementById("bili_live"))
            clearInterval(indexLive)
        }
    }, 100);

    var playAd = setInterval(() => {
        if(window.document.getElementById("live_recommand_report")) {
            var p = window.document.getElementsByClassName("r-con")[0]
            p.removeChild(window.document.getElementById("live_recommand_report"))
            p.removeChild(window.document.getElementById("right-bottom-banner"))
            clearInterval(playAd)
        }
    }, 100);
})();