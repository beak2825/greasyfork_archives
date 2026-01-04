// ==UserScript==
// @name         电脑端淘宝修正详情图片比例
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fxxk 996
// @author       Hanayo
// @match        https://item.taobao.com/item.htm*
// @match        https://detail.tmall.com/item.htm*
// @icon         https://www.google.com/s2/favicons?domain=taobao.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-mousewheel/3.1.9/jquery.mousewheel.min.js
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437020/%E7%94%B5%E8%84%91%E7%AB%AF%E6%B7%98%E5%AE%9D%E4%BF%AE%E6%AD%A3%E8%AF%A6%E6%83%85%E5%9B%BE%E7%89%87%E6%AF%94%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/437020/%E7%94%B5%E8%84%91%E7%AB%AF%E6%B7%98%E5%AE%9D%E4%BF%AE%E6%AD%A3%E8%AF%A6%E6%83%85%E5%9B%BE%E7%89%87%E6%AF%94%E4%BE%8B.meta.js
// ==/UserScript==

(function() {
    //弱智CSS
    'use strict';
    $('body').on('mousewheel', function(event) {
        const box = $("#J_DivItemDesc").find("img")
        box.each(function(index,element){
            element.removeAttribute("width");
            element.removeAttribute("height");
        })
    });
})();