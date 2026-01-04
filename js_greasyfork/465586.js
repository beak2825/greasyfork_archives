// ==UserScript==
// @name         上学吧免费查答案，答案搜索工具
// @namespace    sxb
// @version      1.0
// @description  上学问题答案一键查询，免费查答案!
// @match        *://*.shangxueba.com/*
// @icon         https://www.shangxueba.com/favicon.ico
// @grant        none
// @license           LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/465586/%E4%B8%8A%E5%AD%A6%E5%90%A7%E5%85%8D%E8%B4%B9%E6%9F%A5%E7%AD%94%E6%A1%88%EF%BC%8C%E7%AD%94%E6%A1%88%E6%90%9C%E7%B4%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/465586/%E4%B8%8A%E5%AD%A6%E5%90%A7%E5%85%8D%E8%B4%B9%E6%9F%A5%E7%AD%94%E6%A1%88%EF%BC%8C%E7%AD%94%E6%A1%88%E6%90%9C%E7%B4%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
	var tit=document.title;
    tit=tit.replace(" - 上学吧找答案","");
    tit=tit.replace(" - 上学吧继续教育考试","");
    tit=tit.replace("（）","");
	var wturl='http://www.shangxueba365.com/?q=';
	var	p_html='<button  style="position:absolute;bottom:50%;left:2%;z-index:3;width:50px;position:fixed;"><a href="'+wturl+tit+'" target="_blank">免费查看答案</a>';
    $("body").append(p_html);
})();