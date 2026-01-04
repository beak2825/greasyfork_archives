// ==UserScript==
// @name         csdnUseScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  csdnUseScript1
// @author       nairong.yang
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484506/csdnUseScript.user.js
// @updateURL https://update.greasyfork.org/scripts/484506/csdnUseScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var articleBox = document.querySelector('.hide-article-box.hide-article-pos.text-center');
    if (articleBox) {
        articleBox.style.display = 'none';
    }
    var articleContent = document.getElementById('article_content');
    if (articleContent) {
        articleContent.style.overflow = 'unset';
        articleContent.style.height = 'unset';
    }

    //获取所有代码块
    let codes = document.querySelectorAll("code");
    //循环遍历所有代码块
    codes.forEach(c => {
        //设置代码块可以编辑
        c.contentEditable = "true";
    })
})();