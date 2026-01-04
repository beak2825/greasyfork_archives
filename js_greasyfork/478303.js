// ==UserScript==
// @name         Github 主题
// @version      0.3
// @description  更换 github 主题
// @author       xiaoxuan6
// @license      MIT
// @match        https://github.com
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/1038333
// @downloadURL https://update.greasyfork.org/scripts/478303/Github%20%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/478303/Github%20%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==
$(document).ready(function () {
    $('.news > feed-container > div:eq(0)').append('<h3><a target="_blank" href="https://github.com/dashboard-feed">Dashboard-feed</a></h3>')
});