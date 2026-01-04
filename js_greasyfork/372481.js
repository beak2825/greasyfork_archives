// ==UserScript==
// @name         去除各种网站的复制后缀，比如：CSDN，简书
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自用脚本，在pf kong作者的源码基础上，修改成支持去除各种网站的复制后缀，比如：CSDN，简书，知乎
// @author       Louis
// @include      *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/372481/%E5%8E%BB%E9%99%A4%E5%90%84%E7%A7%8D%E7%BD%91%E7%AB%99%E7%9A%84%E5%A4%8D%E5%88%B6%E5%90%8E%E7%BC%80%EF%BC%8C%E6%AF%94%E5%A6%82%EF%BC%9ACSDN%EF%BC%8C%E7%AE%80%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/372481/%E5%8E%BB%E9%99%A4%E5%90%84%E7%A7%8D%E7%BD%91%E7%AB%99%E7%9A%84%E5%A4%8D%E5%88%B6%E5%90%8E%E7%BC%80%EF%BC%8C%E6%AF%94%E5%A6%82%EF%BC%9ACSDN%EF%BC%8C%E7%AE%80%E4%B9%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function addLink(e) {
        e.preventDefault();
        var copytext = window.getSelection();
        var clipdata = e.clipboardData || window.clipboardData;
        if (clipdata) {
            clipdata.setData('Text', copytext);
        }
    }
    document.addEventListener('copy', addLink);
})();