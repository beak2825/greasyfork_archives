// ==UserScript==
// @name         Blue arXiv
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  更改 arxiv 的主题色以及logo
// @author       Satomi Akane
// @match        *://*.arxiv.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474112/Blue%20arXiv.user.js
// @updateURL https://update.greasyfork.org/scripts/474112/Blue%20arXiv.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 桌面端
    var element = document.getElementById('header');
    if (element){
        element.style.backgroundColor = '#138afa';
    }
    // 移动端
    element = document.getElementsByClassName('mobile-header')[0];
    if (element){
        element.style.backgroundColor = '#138afa';
    }
    // 搜索页面
    element = document.getElementsByClassName('identity')[0];
    if (element){
        element.style.backgroundColor = '#138afa';
    }

    // 删除头框
    element = document.getElementById('cu-identity');
    if(element){
        element.parentElement.removeChild(element);
    }
    element = document.getElementsByClassName('attribution')[0];
    if(element){
        element.parentElement.removeChild(element);
    }
    // 更改logo
    for(let item of document.images){
        if(item.alt == "arxiv logo" || item.alt == "arXiv logo"){
            item.src="https://webcnstatic.yostar.net/ba_cn_web/prod/web/assets/LOGO.4a06cdd2.png";
        }}
})();