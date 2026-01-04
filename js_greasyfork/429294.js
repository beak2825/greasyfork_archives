// ==UserScript==
// @name         地址精简
// @namespace    http://domain.com/directory
// @version      0.3.7
// @author       幸福的赢得
// @match        *://*.douyin.com/*
// @exclude      *://so.douyin.com/*
// @match        *://*.iesdouyin.com/*
// @match        *://*.bilibili.com/*
// @exclude      *://m.bilibili.com/search*
// @exclude      *://search.bilibili.com/*
// @match        *://*.ixigua.com/*
// @match        *://*.inews.qq.com/*
// @include      /^https?:\/\/(greasy|sleazy)fork\.org\/[^/]+\/scripts\/\d+-/
// @match        *://*.zhihu.com/*
// @exclude      *://www.zhihu.com/search?*
// @grant        none
// @description 去掉 抖音、bilibili、西瓜、腾讯新闻 网址的多余部分，减小长度。
// @downloadURL https://update.greasyfork.org/scripts/429294/%E5%9C%B0%E5%9D%80%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/429294/%E5%9C%B0%E5%9D%80%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==
 
if (/:\/\/greasyfork/.test (location.href) ) {
    const m =
    /(\/[^/]+\/scripts\/\d+)-[^/]+(\/.*)?/.exec(location.pathname)
    history.replaceState({}, null, `${location.origin}${m[1]}${m[2] ?? ''}${location.search}${location.hash}`)
    return
}
 
 
if (/\?/.test (location.href) ) {
    var plainPath =
    location.href.replace (/\?.*/, "")
    history.pushState({}, '', plainPath);
}
 
 