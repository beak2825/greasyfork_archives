// ==UserScript==
// @name         替换掉京东商品详情的水印图片
// @namespace    https://www.jd.com
// @version      1.0
// @description  因为大图有水印，所以显示成没有水印的图片
// @author       Lennon
// @match        *item.jd.com/*
// @run-at       document-end
// @icon         https://www.jd.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/371508/%E6%9B%BF%E6%8D%A2%E6%8E%89%E4%BA%AC%E4%B8%9C%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E7%9A%84%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/371508/%E6%9B%BF%E6%8D%A2%E6%8E%89%E4%BA%AC%E4%B8%9C%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E7%9A%84%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.zoomImg').live('hover', function() {
        var element = $('.zoomImg');
        var element_src = element.attr('src');
        var replace_string_old = '/n0/';
        var replace_string_new = '/n12/';
        if (element_src && element_src.includes('/n0/')) {
            element.attr('src', element_src.replace(replace_string_old, replace_string_new));
        }
    });
})();