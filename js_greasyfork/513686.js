// ==UserScript==
// @name 别动我的字体！
// @namespace 本地字体
// @version  1.0
// @description 在网页中使用本地字体
// @author LWF
// @license MIT
// @grant none
// @match *://*/*
// @exclude *://fanqienovel.com/reader/*
// @exclude *://*.android.google.cn/*
// @exclude *://ai.qaqgpt.com/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/513686/%E5%88%AB%E5%8A%A8%E6%88%91%E7%9A%84%E5%AD%97%E4%BD%93%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/513686/%E5%88%AB%E5%8A%A8%E6%88%91%E7%9A%84%E5%AD%97%E4%BD%93%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    // 创建一个 <style> 元素
    const css = document.createElement('style');
    
    // 为 <style> 元素设置 CSS，使用本地字体
    css.innerHTML = "*{font-family:Arial!important;}";
    
    // 将 <style> 元素添加到页面的 <head> 部分
    document.head.appendChild(css);
})();