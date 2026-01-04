// ==UserScript==
// @name         修复NGA海外图片
// @namespace    https://greasyfork.org/zh-CN/scripts/382978-%E4%BF%AE%E5%A4%8Dnga%E6%B5%B7%E5%A4%96%E5%9B%BE%E7%89%87
// @version      0.5
// @author       SkywalkerJi
// @include      *://bbs.nga.cn/*
// @include      *://*.ngacn.cc/*
// @include      *://nga.178.com/*
// @description  重定向图片
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382978/%E4%BF%AE%E5%A4%8DNGA%E6%B5%B7%E5%A4%96%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/382978/%E4%BF%AE%E5%A4%8DNGA%E6%B5%B7%E5%A4%96%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';

    var imgsReg = new RegExp("img.nga.178.com");
    var sinaImgsReg = new RegExp("sinaimg.cn");
    var replaceImgUrl = function() {
        var url = $(this).attr("src");
        if (undefined !== url && "" !== url) {
            $(this).attr("src", url.replace(imgsReg, "img7.nga.178.com"));
        }
    };

    $(document).ready(function() {
        $("img").each(replaceImgUrl);
    });
}, 1000) ;