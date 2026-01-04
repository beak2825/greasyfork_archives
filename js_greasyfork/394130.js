// ==UserScript==
// @name         青苹果教务系统自动评教
// @namespace    Anubis Ja
// @version      0.1
// @description  针对“提交教学评价表”，自动选定全部为“优”，并提交
// @author       Anubis Ja
// @match        *://*/jxkp/Stu_WSKP_pj.aspx*
// @match        *://*/jxkp/*
// @require      https://cdn.staticfile.org/jquery/1.7.2/jquery.min.js
// @supportURL   https://greasyfork.org/zh-CN/scripts/394130/feedback
// @downloadURL https://update.greasyfork.org/scripts/394130/%E9%9D%92%E8%8B%B9%E6%9E%9C%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/394130/%E9%9D%92%E8%8B%B9%E6%9E%9C%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

$(document).ready(function(){
 $("[djdm='01']").click();
  setTimeout(function () {
go_12735();
}, 500);
})