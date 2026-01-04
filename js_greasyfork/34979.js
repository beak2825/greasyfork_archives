// ==UserScript==
// @name         FBX系统表格对于fixed thead去抖
// @namespace    https://greasyfork.org/users/155548
// @version      0.1
// @description  由于错误代码造成抖动导致每日截长预警图会缺失一条预警，在tbody补充一条tr撑起高度，达到去抖
// @author       QHS
// @include      http://fba.valsun.cn/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34979/FBX%E7%B3%BB%E7%BB%9F%E8%A1%A8%E6%A0%BC%E5%AF%B9%E4%BA%8Efixed%20thead%E5%8E%BB%E6%8A%96.user.js
// @updateURL https://update.greasyfork.org/scripts/34979/FBX%E7%B3%BB%E7%BB%9F%E8%A1%A8%E6%A0%BC%E5%AF%B9%E4%BA%8Efixed%20thead%E5%8E%BB%E6%8A%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
GM_addStyle("html{overflow: auto;}");
})();