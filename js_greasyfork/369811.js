// ==UserScript==
// @name         sobooks验证码自动添加
// @namespace    https://sobooks.cc/
// @version      1.3
// @description  自动填写验证码并刷新页面
// @author       Aaron nichola
// @match        https://sobooks.cc/books/*.html
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369811/sobooks%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/369811/sobooks%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0.meta.js
// ==/UserScript==

$(document).ready(function(){
	var checkCode = "201929";
	$('input[name^="e_secret_key"]').val(checkCode);
    $('.euc-y-s').first().click();
})