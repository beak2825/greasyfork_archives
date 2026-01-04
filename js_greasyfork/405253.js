// ==UserScript==
// @name         江湖直播去廣告
// @namespace    https://www.vw.idv.tw/Gbook_Role.asp?title=%E8%A8%B1%E7%91%9E
// @version      1.1.1
// @description  進入江湖直播的時候，下方廣告自動消失，從而看到更廣的畫面。（1.1更新：新增天眼選單恢復為原始排序。）
// @author       許瑞
// @match        https://www.vw.idv.tw/sd_Mobiletvshow.asp
// @grant        none
// @require    https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/405253/%E6%B1%9F%E6%B9%96%E7%9B%B4%E6%92%AD%E5%8E%BB%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/405253/%E6%B1%9F%E6%B9%96%E7%9B%B4%E6%92%AD%E5%8E%BB%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

var $ = window.$;
$("#wrapper > div:nth-child(2) > table > tbody > tr > td").remove();
$("#menu > ul").prepend($("#menu > ul > li:nth-child(11)"));
$("#menu > ul").prepend($("#menu > ul > li:nth-child(5)"));
$("#menu > ul").prepend($("#menu > ul > li:nth-child(5)"));
$("#menu > ul").prepend($("#menu > ul > li:nth-child(11)"));
$("#menu > ul").prepend($("#menu > ul > li:nth-child(11)"));
$("#menu > ul").prepend($("#menu > ul > li:nth-child(11)"));
$("#menu > ul").prepend($("#menu > ul > li:nth-child(11)"));
$("#menu > ul").prepend($("#menu > ul > li:nth-child(11)"));
$("#menu > ul").prepend($("#menu > ul > li:nth-child(11)"));
$("#menu > ul").prepend($("#menu > ul > li:nth-child(11)"));
$("#menu > ul").prepend($("#menu > ul > li:nth-child(11)"));