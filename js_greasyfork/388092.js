// ==UserScript==
// @name         github助手
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  解决旧版浏览器github不能能点击授权按钮的问题
// @author       peasshoter
// @include      https://github.com/*
// @match        https://greasyfork.org/zh-CN/scripts/370798/versions/new
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388092/github%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/388092/github%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//$('.btn-danger').click();
$('#js-oauth-authorize-btn').removeAttr('disabled');