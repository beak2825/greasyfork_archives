// ==UserScript==
// @name              Baidu/Google搜索重定向双列优化
// @namespace         zs
// @version           1.0.4
// @description       Baidu/Google搜索界面优化
// @author            zs
// @match             *://ipv6.baidu.com/*
// @match             *://www.baidu.com/*
// @match             *://www1.baidu.com/*
// @match             *://encrypted.google.com/search*
// @match             *://*.google.com/search*
// @match             *://*.google.com/webhp*
// @exclude           *://*.google.com/sorry*
// @exclude           *://zhidao.baidu.com/*
// @exclude           *://*.zhidao.baidu.com/*
// @grant             GM_addStyle
// @license           GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/450257/BaiduGoogle%E6%90%9C%E7%B4%A2%E9%87%8D%E5%AE%9A%E5%90%91%E5%8F%8C%E5%88%97%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/450257/BaiduGoogle%E6%90%9C%E7%B4%A2%E9%87%8D%E5%AE%9A%E5%90%91%E5%8F%8C%E5%88%97%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

    document.querySelectorAll('div.ULSxyf').forEach(it => it.remove());
    document.querySelectorAll('div.TQc1id.hSOk2e.rhstc4').forEach(it => it.remove());
    document.querySelectorAll('div.M8OgIe').forEach(it => it.remove());


    document.querySelectorAll("div[class='_2z1q32z']").forEach(it => it.remove());
    document.querySelectorAll("div[class='result c-container new-pmd']").forEach(it => it.remove());
    document.querySelectorAll("div[class='layout']").forEach(it => it.remove());

window.addEventListener('scroll', () => {
    document.querySelectorAll('div.ULSxyf').forEach(it => it.remove());

    document.querySelectorAll("div[tpl='feed-ad']").forEach(it => it.remove());
    document.querySelectorAll("div[tpl='video']").forEach(it => it.remove());
});



