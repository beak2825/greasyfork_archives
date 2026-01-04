// ==UserScript==
// @name         V2EX 去除主题帖背景颜色
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  去除主题帖背景颜色
// @author       https://github.com/Femoon
// @match        https://*.v2ex.com/t/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503592/V2EX%20%E5%8E%BB%E9%99%A4%E4%B8%BB%E9%A2%98%E5%B8%96%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/503592/V2EX%20%E5%8E%BB%E9%99%A4%E4%B8%BB%E9%A2%98%E5%B8%96%E8%83%8C%E6%99%AF%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    #Wrapper {
        background-color: #e2e2e2 !important;
        background-image: url(/static/img/shadow_light.png) !important;
    }
    `)
})();