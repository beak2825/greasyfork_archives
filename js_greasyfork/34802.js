// ==UserScript==
// @name      BiliBi-Live-HTML5-Edge
// @version   17.11.04.2
// @description Switch UA to Chrome for Edge on bilibili live.
// @author    nftbty
// @match     http://live.bilibili.com/*
// @match     https://live.bilibili.com/*
// @match     http://link.bilibili.com/p/help/*
// @match     https://link.bilibili.com/p/help/*
// @run-at    document-start
// @namespace https://greasyfork.org/users/101499
// @downloadURL https://update.greasyfork.org/scripts/34802/BiliBi-Live-HTML5-Edge.user.js
// @updateURL https://update.greasyfork.org/scripts/34802/BiliBi-Live-HTML5-Edge.meta.js
// ==/UserScript==


Object.defineProperty(navigator, 'plugins', {
  get: function () {
    return { length: 0 };
  }
});
Object.defineProperty(navigator,"userAgent",{
    value:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.75 Safari/537.36",
    writable:false,
    configurable:false,
    enumerable:true
});
