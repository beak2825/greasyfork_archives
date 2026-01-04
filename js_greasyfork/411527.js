// ==UserScript==
// @name         WeiboURL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  新浪微博短链接自动跳转
// @author       disksing
// @match        *://t.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411527/WeiboURL.user.js
// @updateURL https://update.greasyfork.org/scripts/411527/WeiboURL.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.match(/^https?:\/\/t.cn\/[a-zA-Z0-9]+(\?.*)?$/) == null) {
        return;
    }
    var link = document.querySelector(".link");
    if (link==null || !link.innerText.startsWith("http")) {
        return;
    }
    console.log("redirecting to "+link.innerText);
    setTimeout(function(){window.location.href=link.innerText}, 500);
})();