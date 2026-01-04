// ==UserScript==
// @name         知乎、简书、csdn、实验楼剪切板消毒
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  复制一些网站文字时，会在你剪切板的最后加上链接什么的信息，很讨厌。把这些额外的东西全干掉
// @author       You
// @match        *://*.shiyanlou.com/*
// @match        *://*.jianshu.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.csdn.net/*
// @match        *://*.imooc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367724/%E7%9F%A5%E4%B9%8E%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81csdn%E3%80%81%E5%AE%9E%E9%AA%8C%E6%A5%BC%E5%89%AA%E5%88%87%E6%9D%BF%E6%B6%88%E6%AF%92.user.js
// @updateURL https://update.greasyfork.org/scripts/367724/%E7%9F%A5%E4%B9%8E%E3%80%81%E7%AE%80%E4%B9%A6%E3%80%81csdn%E3%80%81%E5%AE%9E%E9%AA%8C%E6%A5%BC%E5%89%AA%E5%88%87%E6%9D%BF%E6%B6%88%E6%AF%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function addLink(e) {
    e.preventDefault();
    var pagelink = '\nRead more: ' + document.location.href,
    copytext = window.getSelection();
    var clipdata = e.clipboardData || window.clipboardData;
    if (clipdata) {
        clipdata.setData('Text', copytext);
    }
}
document.addEventListener('copy', addLink);
})();