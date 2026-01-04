// ==UserScript==
// @name         JavaScript Weekly Sponsor Marker
// @namespace
// @include      *://javascriptweekly.com/issues/*
// @include      *://frontendfoc.us/issues/*
// @version      0.2.0
// @description  标记sponsor内容，能一眼看出是广告（Reduce the presence of sponsors' content）
// @author       ymzhao
// @namespace 
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/495918/JavaScript%20Weekly%20Sponsor%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/495918/JavaScript%20Weekly%20Sponsor%20Marker.meta.js
// ==/UserScript==
GM_addStyle(`
    table.el-item:has(.tag-sponsor) {
        background-color: #f3f2f5;
        filter: opacity(0.36) !important;
        transition: filter 0.26s ease;
    }
    table.el-item:has(.tag-sponsor):hover {
        filter: opacity(0.88) !important;
    }
`);