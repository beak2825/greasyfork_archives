// ==UserScript==
// @name         Steam 商店小部件价格锁定器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在其乐社区范围内，锁定Steam商店小部件显示的价格区域
// @author       CharRun
// @match        https://keylol.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/424226/Steam%20%E5%95%86%E5%BA%97%E5%B0%8F%E9%83%A8%E4%BB%B6%E4%BB%B7%E6%A0%BC%E9%94%81%E5%AE%9A%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/424226/Steam%20%E5%95%86%E5%BA%97%E5%B0%8F%E9%83%A8%E4%BB%B6%E4%BB%B7%E6%A0%BC%E9%94%81%E5%AE%9A%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const LockedCountry = "cn" //国家代码 应该是 ISO 3166-1 二位字母代码
    document.querySelectorAll("iframe").forEach((node)=>{
      let url = new URL(node.src);
        if(url.hostname == "store.steampowered.com" && url.pathname.startsWith("/widget/")){
            url.searchParams.set("cc",LockedCountry)
            node.src = url.toString()
        }
    })
})();