
// ==UserScript==
// @name        	调整村花论坛列表宽度
// @namespace   	amer0798
// @match        *://*.cunhua.beauty/*
// @include     	https://www.cunhua.beauty/
// @require		https://code.jquery.com/jquery-latest.js
// @version    	1.0
// @icon         https://www.cunhua.beauty/favicon.ico
// @grant       	none
// @run-at		document-end
// @license MIT
// @description 	调整村花论坛 列表宽度为98%
// @downloadURL https://update.greasyfork.org/scripts/458271/%E8%B0%83%E6%95%B4%E6%9D%91%E8%8A%B1%E8%AE%BA%E5%9D%9B%E5%88%97%E8%A1%A8%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/458271/%E8%B0%83%E6%95%B4%E6%9D%91%E8%8A%B1%E8%AE%BA%E5%9D%9B%E5%88%97%E8%A1%A8%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==
     
//调整村花论坛 列表宽度为98%
function Main()
{
	$(".wp").width("98%")
    $(".mn").width("80%")
}
Main()

