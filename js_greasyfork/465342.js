// ==UserScript==
// @name         APKMirror去广告脚本
// @version      1
// @description  在APKMirror网站上屏蔽广告
// @match        https://www.apkmirror.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/465342/APKMirror%E5%8E%BB%E5%B9%BF%E5%91%8A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/465342/APKMirror%E5%8E%BB%E5%B9%BF%E5%91%8A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement('style');
    style.innerHTML = `ins.adsbygoogle,DIV.ains.ains-has-label,DIV[style$=' display: flex; justify-content: center; font-family: Roboto, Arial;'] {display: none !important;visibility: hidden; opacity: 0; z-index: -999; width: 0; height: 0; pointer-events: none; position: absolute; left: -9999px; top: -9999px;}`;
    document.head.appendChild(style);
})();