// ==UserScript==
// @name         修复简书图片无法显示
// @namespace    http://github.com/idawn520/fix-jianshu-pictures
// @version      0.1
// @description  修复简书出现 “系统维护中，图片暂时无法加载”的问题
// @author       idawn520
// @match        *://*.jianshu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384554/%E4%BF%AE%E5%A4%8D%E7%AE%80%E4%B9%A6%E5%9B%BE%E7%89%87%E6%97%A0%E6%B3%95%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/384554/%E4%BF%AE%E5%A4%8D%E7%AE%80%E4%B9%A6%E5%9B%BE%E7%89%87%E6%97%A0%E6%B3%95%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $.each($(".image-loading"), function (i, obj) {
        var $o = $(obj);
        var link = $o.attr("data-original-src")
        $o.attr("src", link);
        $o.addClass("illustration");
        $o.removeClass("image-loading");
        var $fu = $(obj.parentNode);

    })
    setTimeout(function () {
        $('.image-package .image-container .image-view-maintain').removeClass('image-package image-container image-view-maintain');
        console.log('done');
    }, 100);

})();