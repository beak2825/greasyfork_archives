// ==UserScript==
// @name         中文维百谷歌重定向
// @version      2.2
// @description  Redirects Wikipedia
// @namespace    https://github.com/JimmyLing233/redirect-zhwiki-google
// @author       Akari
// @include      *://zh.m.wikipedia.org/*
// @include      *://zh.wikipedia.org/*
// @license      MIT
// @grant        none
// @inject-into  auto
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/457721/%E4%B8%AD%E6%96%87%E7%BB%B4%E7%99%BE%E8%B0%B7%E6%AD%8C%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/457721/%E4%B8%AD%E6%96%87%E7%BB%B4%E7%99%BE%E8%B0%B7%E6%AD%8C%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

var url = new URL(location.href);
var hasRedirectedFromMobile = false;
var hasRedirectedFromLanguage = false;

// 第一个重定向条件：从移动版重定向到桌面版
var mobileRe = /^zh\.m\.wikipedia\.org$/;
if (mobileRe.test(url.hostname) && !hasRedirectedFromMobile) {
    url.hostname = 'zh.wikipedia.com';
    location.assign(url.href);
    hasRedirectedFromMobile = true;
}

// 第二个重定向条件：从特定语言版本重定向到默认版本，并添加/wiki/前缀
var languageRe = /^\/zh-[a-z]{2,4}\//;
if (languageRe.test(url.pathname) && !hasRedirectedFromLanguage) {
    url.pathname = '/wiki' + url.pathname.replace(languageRe, '/');
    location.assign(url.href);
    hasRedirectedFromLanguage = true;
}
