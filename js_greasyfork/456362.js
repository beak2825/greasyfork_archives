// ==UserScript==
// @name         维基百科/MDN自动定向到中文页面
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  en英文维基百科/MDN自动定向到zh中文页面
// @author       CJM
// @match        https://en.wikipedia.org/wiki/**
// @match        https://zh.wikipedia.org/zh-tw/**
// @match        https://developer.mozilla.org/en-US/**
// @match        https://zh.m.wikipedia.org/zh/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456362/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91MDN%E8%87%AA%E5%8A%A8%E5%AE%9A%E5%90%91%E5%88%B0%E4%B8%AD%E6%96%87%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/456362/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91MDN%E8%87%AA%E5%8A%A8%E5%AE%9A%E5%90%91%E5%88%B0%E4%B8%AD%E6%96%87%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const href = window.location.href;
    if (href.includes('https://en.wikipedia.org/wiki/')) {
        window.location.href = href.replace('//en', '//zh')
    }
    else if (href.includes('https://zh.wikipedia.org/zh-tw/')) {
        window.location.href = href.replace('/zh-tw/', '/zh-cn/')
    }
    else if (href.includes('https://zh.m.wikipedia.org/zh/')) {
        window.location.href = href.replace('/zh/', '/zh-cn/')
    }
    else if(href.includes('https://developer.mozilla.org/en-US'))//en-US
    {
        //window.location.href = href.replace('/en-US', '/zh-CN')
        window.open(href.replace('/en-US', '/zh-CN'),'_blank');
    }
}
)();
