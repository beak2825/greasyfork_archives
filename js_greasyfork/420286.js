// ==UserScript==
// @name         萌娘-去黑幕-改-Plus
// @namespace    mytreee@qq.com
// @version      0.2.1
// @description  萌娘百科黑幕透明，添加边界框；删除线变下划线
// @author       mytreee
// @match        *://zh.moegirl.org.cn/*
// @match        *://mzh.moegirl.org.cn/*
// @match        *://*.hmoegirl.com/*
// @grant        GM_addStyle
// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/420286/%E8%90%8C%E5%A8%98-%E5%8E%BB%E9%BB%91%E5%B9%95-%E6%94%B9-Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/420286/%E8%90%8C%E5%A8%98-%E5%8E%BB%E9%BB%91%E5%B9%95-%E6%94%B9-Plus.meta.js
// ==/UserScript==

(function () {
    //替换<s>标签效果为下划线
    GM_addStyle('s {text-decoration: underline}');
    //令Decoration样式为下划线
    document.querySelectorAll('del').forEach(e => e.style.textDecoration = 'underline');
    //删除"你知道的太多了"标签
    document.querySelectorAll('.heimu').forEach(e => e.title = '');
})();

(function () {
    //令黑幕BackgroundColor透明
    document.querySelectorAll('.heimu').forEach(e => e.style.backgroundColor = '#ffffff00');
    document.querySelectorAll('.heimu a').forEach(e => e.style.backgroundColor = '#ffffff00');
    document.querySelectorAll('a .heimu').forEach(e => e.style.backgroundColor = '#ffffff00');
})();
    //为黑幕文本添加一个Border框
(function () {
    document.querySelectorAll('.heimu').forEach(e => e.style.border = '1px solid #555');
    document.querySelectorAll('.heimu a').forEach(e => e.style.border = '1px solid #555');
    document.querySelectorAll('a .heimu').forEach(e => e.style.border = '1px solid #555');
})();