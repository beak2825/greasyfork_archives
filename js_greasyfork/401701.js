// ==UserScript==
// @name 地铁族自定义模板
// @description 换一个风格的地铁族
// @namespace Violentmonkey Scripts
// @match *://*.ditiezu.com/*
// @grant none
// @version 1.2
// @downloadURL https://update.greasyfork.org/scripts/401701/%E5%9C%B0%E9%93%81%E6%97%8F%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/401701/%E5%9C%B0%E9%93%81%E6%97%8F%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "body{background:#fbfbfb}#nv,#nv li{background:#607d8b}#nv_userapp .ct2_a .mn,.ct2_a .mn,.ct2_a_r .mn{width:960px}#fastpoststype_1,#fastpoststype_10,#fastpoststype_11,#fastpoststype_12,.md_ctrl,.nav_bd,.xl2{display:none}.wp{width:1120px}.bm_h,.bml .bm_h,.bmw .bm_h{background:#607d8b;color:#fff}.comiis_oneline_middle{background:#fff}.pl .quote,.pl .quote blockquote{background-image:none}.pl .quote{padding-left:10px;border-color:#cdcdcd;border-style:solid;border-width:1px 1px 1px 3px}.favatar>*,table.plhin>tbody:nth-child(1)>tr:nth-child(1n+2),table.plhin>tbody:nth-child(1)>tr:nth-child(4)>td:nth-child(1){display:none}.avt img{overflow:hidden;border-radius:50%}.favatar div:nth-of-type(1),.favatar div:nth-of-type(2),.favatar div:nth-of-type(3){display:block}table.plhin>tbody:nth-child(1)>tr:nth-child(4){display:contents}table.plhin>tbody>tr:nth-child(1){border-color:#cdcdcd;border-style:solid;border-width:1px 0 0}td.pls{background-color:#f9f9f9}.pn{background:#607d8b}.comiis_footer p img{display:none}::selection{background:#607d8b;color:#fff}";
document.head.appendChild(css);