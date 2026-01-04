// ==UserScript==
// @name         小狮子提醒！！！
// @namespace    https://www.weilino.gitee.io
// @version      1.0.0
// @description  提醒补休和年假剩余天数
// @author       weilino
// @match        *://oa.cnsuning.com/*
// @icon         http://ps7.cnsuning.com/favicon.ico
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466629/%E5%B0%8F%E7%8B%AE%E5%AD%90%E6%8F%90%E9%86%92%EF%BC%81%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/466629/%E5%B0%8F%E7%8B%AE%E5%AD%90%E6%8F%90%E9%86%92%EF%BC%81%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

	//在特定位置后面嵌入一个页面 在这个页面中查询信息
    $(".soa_nav >div >ul").append('<li><iframe width="40px" height="30px" scrolling="no" frameborder="0" src="http://ps7.cnsuning.com/HRCommonShare"></iframe></li>')

})();
