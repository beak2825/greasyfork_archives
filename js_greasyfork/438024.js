// ==UserScript==
// @name         百度搜索去广告
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  去除百度搜索前面相关广告内容，让搜索更纯净
// @author       wll
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @match        https://www.baidu.com/s*
// @grant        none
// @note         版本更新	2022-01-04 0.0.1	去除百度搜索前面相关广告内容，让搜索更纯净

// @downloadURL https://update.greasyfork.org/scripts/438024/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/438024/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init(){
        $("._2z1q32z").remove().length>0?$("._2z1q32z").remove().length:"";
        //$(".result.c-container.new-pmd").remove().length>0?$(".result.c-container.new-pmd").remove():"";
    }
    window.setInterval(function() {init();}, 1000);

})();