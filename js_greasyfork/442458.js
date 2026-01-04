// ==UserScript==
// @name         True Title
// @namespace    https://greasyfork.org/zh-CN/users/1073-hzhbest
// @version      0.1
// @description  获取网页真正的标题，取代页面标题
// @author       hzhbest
// @include      http://*.html
// @include      https://*.html
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/442458/True%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/442458/True%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 寻找当前页面body中第一个出现的类标题元素
    // 例如 H1、H2、*.~title~、*#~title~
    var titleelm = [
        "h1",
        "h2",
        "[class*='title']",
        "[id*='title']"
        ];
    var fsttelm;
    // 排除隐藏的或者页面位置太低或者空的元素
    for (var i=0;i<titleelm.length;i++){
        fsttelm = document.body.querySelector(titleelm[i]); // console.log(titleelm[i] + ", " + fsttelm.textContent);
        if (!!fsttelm) {
            if (fsttelm.offsetHeight == 0 || fsttelm.offsetTop == 0 || fsttelm.offsetTop > 1000 || fsttelm.textContent.length < 2) {
                continue;
            } else {
                break;
            }
        }
    }

    // 提取类标题元素中的字符串，检查字符串的字数，如果少于5个字则忽略
    var titlestr = fsttelm.textContent;
    if (titlestr.length<5) return;
    // 检查document.title中是否已含有该字符串最多前10字，否，则替换其为字符串
    if (document.title.indexOf(titlestr.slice(0,10)) == -1) {
        document.title = titlestr;
    }

})();