// ==UserScript==
// @name         acfun表情放大
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  让你拥有更大更清晰的ac娘
// @author       猫猫
// @match        *://www.acfun.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402105/acfun%E8%A1%A8%E6%83%85%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/402105/acfun%E8%A1%A8%E6%83%85%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = document.createElement('style');
    var style ='.ac-comment-root-list .ubb-emotion,.area-comment-top .ubb-emotion{max-width:100px !important;max-height:100px !important;}';
    var node=document.createTextNode(style);
    css.appendChild(node);
    var head = document.querySelector('head');
    head.appendChild(css)
})();