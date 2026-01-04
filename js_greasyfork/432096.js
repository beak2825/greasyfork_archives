// ==UserScript==
// @name         百度文库免费查询0下载券文档
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  直接移除百度文库免费查询页面的遮盖层，可直接搜索0下载券文档，若仍只能显示2条，在免费页面刷新解除限制
// @author       someone
// @match        *://wenku.baidu.com/search?word=*&fd=3*
// @match        *://wenku.baidu.com/search?word=*
// @grant        none
// @license 
// @downloadURL https://update.greasyfork.org/scripts/432096/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8D%E8%B4%B9%E6%9F%A5%E8%AF%A20%E4%B8%8B%E8%BD%BD%E5%88%B8%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/432096/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%85%8D%E8%B4%B9%E6%9F%A5%E8%AF%A20%E4%B8%8B%E8%BD%BD%E5%88%B8%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeCoverDiv(){
        let coverDiv = document.querySelector(".rights-card-new");
        coverDiv.parentNode.removeChild(coverDiv);
    }
    window.onload = removeCoverDiv;
})();