// ==UserScript==
// @name         去除隐藏的垃圾代码
// @namespace    https://www.t00ls.net
// @version      1.0
// @description  去除T00ls复制时的垃圾代码
// @author       祖父
// @icon         https://www.t00ls.net/favicon.ico
// @match        *://www.t00ls.net/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383302/%E5%8E%BB%E9%99%A4%E9%9A%90%E8%97%8F%E7%9A%84%E5%9E%83%E5%9C%BE%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/383302/%E5%8E%BB%E9%99%A4%E9%9A%90%E8%97%8F%E7%9A%84%E5%9E%83%E5%9C%BE%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==
(function () {
  	$("div.t_msgfontfix > table > tbody > tr > td > span").remove();
  	$("div.t_msgfontfix > table > tbody > tr > td > font").remove();
})();