// ==UserScript==
// @name         page view optimize - "iconfont"
// @namespace    https://xianghongai.github.io
// @version      0.1.3
// @description  响应式布局、调整分页、栅格
// @author       Nicholas Hsiang
// @icon         https://xinlu.ink/favicon.ico
// @match        http*://*.iconfont.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374162/page%20view%20optimize%20-%20%22iconfont%22.user.js
// @updateURL https://update.greasyfork.org/scripts/374162/page%20view%20optimize%20-%20%22iconfont%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = '.wrap { width: 100% !important; } .block-sidebar { left: 100%; margin-left: 0; top: auto; bottom: 0; transform: translateX(-100%); } .footer { padding-right: 20px; padding-left: 20px; } .page-collections-wrap { width: 100%; } .page-collections-wrap .block-collection { margin: 20px 20px 20px 12px } .block-pagination-wrap { padding-right: 20px; } .block-bar .block-bar-container .block-bar-right { right: 20px; } .project-manage-bar a.bar-text { right: 20px !important; } .page-manage-project .project-top .users-container { right: 20px; } .page-manage-container .page-manage-left { width: 168px; } .page-manage-container { overflow: visible; } .block-pagination-wrap { position: absolute; top: 0; left: 50%; z-index: 9; padding: 0; transform: translate(-50%, -100%); } .block-pagination { padding: .5em .3em; height: auto; line-height: 100%; margin: 0 !important; background: white; display: flex; align-items: center; flex-wrap: nowrap; justify-content: flex-start; } .block-pagination .total { order: 1; } .collections-lists{ position: relative; overflow: visible; } .collections-lists .block-pagination{ position: absolute; top: 0; left: 50%; z-index: 9; padding: .5em .3em; width: auto !important; transform: translate(-50%, -100%); }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
})();