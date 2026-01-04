// ==UserScript==
// @name         检测斗鱼平台直播间是否直播
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  检测斗鱼平台直播间是否直播，未直播则刷新页面（默认检测间隔为 1 分钟）
// @author       xilili
// @match        *://www.douyu.com/*
// @icon         https://marketplace.canva.cn/MADRpjbFvPk/1/thumbnail_large/canva-%E9%BB%84%E7%81%B0%E6%96%97%E9%B1%BC%E7%A4%BE%E4%BA%A4%E5%AA%92%E4%BD%93icon-MADRpjbFvPk.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452051/%E6%A3%80%E6%B5%8B%E6%96%97%E9%B1%BC%E5%B9%B3%E5%8F%B0%E7%9B%B4%E6%92%AD%E9%97%B4%E6%98%AF%E5%90%A6%E7%9B%B4%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/452051/%E6%A3%80%E6%B5%8B%E6%96%97%E9%B1%BC%E5%B9%B3%E5%8F%B0%E7%9B%B4%E6%92%AD%E9%97%B4%E6%98%AF%E5%90%A6%E7%9B%B4%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 刷新当前页面
    function reload(){
        location.replace(location.href);
    }

    // 判断当前直播间直播状态，0 为未直播
    setInterval(function(){
        if(document.getElementsByClassName("video-container-dbc7dc ").length===0) {
            reload();
        }
    },1*60*1000)
})();