// ==UserScript==
// @name         萌娘百科第三方评论插件
// @namespace    https://github.com/azumwatson
// @version      0.3
// @description  为 萌娘百科 添加上评论功能
// @author       AzumWatson
// @match        zh.moegirl.org.cn/*
// @match        mzh.moegirl.org.cn/*
// @icon         https://img.moegirl.org.cn/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454792/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E7%AC%AC%E4%B8%89%E6%96%B9%E8%AF%84%E8%AE%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/454792/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E7%AC%AC%E4%B8%89%E6%96%B9%E8%AF%84%E8%AE%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const moeComment = document.createElement('script');
    const br = document.createElement('br');
    moeComment.setAttribute("src","https://giscus.app/client.js");
    moeComment.setAttribute("data-repo","AzumWatson/moegirl-comment");
    moeComment.setAttribute("data-repo-id","R_kgDOIbhAlg");
    moeComment.setAttribute("data-category","萌娘百科评论");
    moeComment.setAttribute("data-category-id","DIC_kwDOIbhAls4CSinQ");
    moeComment.setAttribute("data-mapping","title");
    moeComment.setAttribute("data-strict","0");
    moeComment.setAttribute("data-reactions-enabled","1");
    moeComment.setAttribute("data-emit-metadata","0");
    moeComment.setAttribute("data-input-position","bottom");
    moeComment.setAttribute("data-theme","light");
    moeComment.setAttribute("data-lang","zh-CN");
    moeComment.setAttribute("crossorigin","anonymous");
    if(document.getElementById('mw-body')){
        document.getElementById('mw-body').appendChild(br);
        document.getElementById('mw-body').appendChild(moeComment);
    }
    document.getElementById('bodyContent').appendChild(br);
    document.getElementById('bodyContent').appendChild(moeComment);
})();