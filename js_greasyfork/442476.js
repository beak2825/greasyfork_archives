// ==UserScript==
// @name         樱花动漫去广告(网页加载完毕广告自动消失）
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  樱花动漫去广告
// @author       ToiletLaoba
// @match        http://www.imomoe.live/*
// @match        http://imomoe.live/*
// @license      MIT
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442476/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A%28%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E5%AE%8C%E6%AF%95%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E6%B6%88%E5%A4%B1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/442476/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E5%8E%BB%E5%B9%BF%E5%91%8A%28%E7%BD%91%E9%A1%B5%E5%8A%A0%E8%BD%BD%E5%AE%8C%E6%AF%95%E5%B9%BF%E5%91%8A%E8%87%AA%E5%8A%A8%E6%B6%88%E5%A4%B1%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict'
    window.onload=function(){

        $("#hbidbox").remove();
        $("#fix_bottom_dom").remove();
        $("#HMRichBox").remove();


    }

})();