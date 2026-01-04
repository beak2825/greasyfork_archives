// ==UserScript==
// @name         网站高分屏优化(By HWlabs)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  几个 AI 网站的高分屏优化
// @author       HWlabs
// @match        https://smartwritegpt.com/*
// @match        https://kimi.moonshot.cn/*
// @match        https://tongyi.aliyun.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494790/%E7%BD%91%E7%AB%99%E9%AB%98%E5%88%86%E5%B1%8F%E4%BC%98%E5%8C%96%28By%20HWlabs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494790/%E7%BD%91%E7%AB%99%E9%AB%98%E5%88%86%E5%B1%8F%E4%BC%98%E5%8C%96%28By%20HWlabs%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var style = document.createElement('style');
    if (window.location.hostname === 'smartwritegpt.com'){
        style.innerHTML = `
            body {
                font-size: inherit !important;
            }
            .markdown-it-container .markdown-body {
                font-size: inherit;
            }
            .session[data-v-82258242]{
                width: inherit;
            }
        `;
    }else if (window.location.hostname === 'kimi.moonshot.cn'){
        style.innerHTML = `
            body {
                font-size: inherit !important;
            }
            .css-p94avn{
                font-size: inherit !important;
            }
            .markdown___BV5oI{
                font-size: inherit !important;
            }
            .markdown___Ho3m0{
                font-size: inherit !important;
            }
            .css-1x6e6a7{
                max-width: 60% !important;
            }
            `;
    }else if (window.location.hostname === 'tongyi.aliyun.com'){
        style.innerHTML = `
            body {
                font-size: inherit !important;
            }
            .side--ZR10Ab5M{
                width: inherit !important;
            }
            `;
    }
    document.head.appendChild(style);
})();
