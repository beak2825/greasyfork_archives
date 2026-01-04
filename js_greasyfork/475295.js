// ==UserScript==
// @name         github-proxy-helper
// @namespace    https://github.com/Twtcer
// @version      0.0.2
// @match        *://*.github.com/*
// @description  GitHub 文件加速,支持代码分支、releases等
// @description:zh-CN GitHub 文件加速,支持代码分支、releases等
// @author       Twtcer
// @grant        GM_setClipboard
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/475295/github-proxy-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/475295/github-proxy-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.onkeydown = function(e) {
        // 设置监听按键 alt+A
        if (e.keyCode == 65 && e.altKey) {
           let proxy = 'https://gh.landwind.icu/';
           let url = window.location.href;
           let clone = proxy+url;
           try
           {
                GM_setClipboard(clone);
           }catch(err){
               console.log('GM_setClipboard fail');
           }
        }
    };

})();