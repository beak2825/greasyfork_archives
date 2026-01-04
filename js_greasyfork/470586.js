// ==UserScript==
// @name         设置horn编辑区域
// @namespace    http://tampermonkey.net/
// @description  set horn
// @license      MIT
// @version      0.1
// @match        https://horn.sankuai.com/files/edit/*
// @match        https://horn.sankuai.com/new/file/*
// @grant        GM_log
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470586/%E8%AE%BE%E7%BD%AEhorn%E7%BC%96%E8%BE%91%E5%8C%BA%E5%9F%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/470586/%E8%AE%BE%E7%BD%AEhorn%E7%BC%96%E8%BE%91%E5%8C%BA%E5%9F%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_log("Rome+Tampermonkey");
    GM_addStyle('.code-editor{height: 800px !important}');
    GM_addStyle('.editor-container{height: 800px !important}');
    GM_addStyle('.component-content-card{height: 500px !important; width: 800px !important}');

})();