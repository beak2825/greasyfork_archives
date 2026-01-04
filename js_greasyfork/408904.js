// ==UserScript==
// @name         小米社区 - 更换网页字体
// @namespace    https://greasyfork.org/zh-CN/scripts/408904-%E5%B0%8F%E7%B1%B3%E7%A4%BE%E5%8C%BA-%E6%9B%B4%E6%8D%A2%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93
// @version      0.2
// @description  小米社区默认的 mipro 字体在 PC 上效果不好，有毛刺，改为微软雅黑看起来要好很多
// @author       Jie
// @match        https://*.xiaomi.cn/*
// @match        https://xiaomi.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408904/%E5%B0%8F%E7%B1%B3%E7%A4%BE%E5%8C%BA%20-%20%E6%9B%B4%E6%8D%A2%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/408904/%E5%B0%8F%E7%B1%B3%E7%A4%BE%E5%8C%BA%20-%20%E6%9B%B4%E6%8D%A2%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = ".container,.titlePic .pic-name,.detail-content .left-con .detail .main .author-name,.Comment .Comment-author, .Comment .subComment-author,.ant-layout-header,.content-say .say-title,.ant-layout-header .sheName,.ant-layout-header .activeName>a{font-family:'Microsoft YaHei';}";
    var ele = document.createElement("style");
    ele.innerHTML = style;
    document.getElementsByTagName('head')[0].appendChild(ele)
})();