// ==UserScript==
// @name         免费使用百度0下载券查询
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  直接移除百度0下载券查询页面的遮盖层，可以直接搜索0下载券文档
// @author       someone
// @match        *://wenku.baidu.com/search?word=*&wl=3*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386447/%E5%85%8D%E8%B4%B9%E4%BD%BF%E7%94%A8%E7%99%BE%E5%BA%A60%E4%B8%8B%E8%BD%BD%E5%88%B8%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/386447/%E5%85%8D%E8%B4%B9%E4%BD%BF%E7%94%A8%E7%99%BE%E5%BA%A60%E4%B8%8B%E8%BD%BD%E5%88%B8%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeCoverDiv(){
        let coverDiv = document.querySelector(".coverImg");
        coverDiv.parentNode.removeChild(coverDiv);
    }
    window.onload = removeCoverDiv;
})();