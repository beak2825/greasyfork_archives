// ==UserScript==
// @name        dapenti
// @namespace   dapenti
// @description 禁止“打喷嚏网”(dapenti.com)当用户禁止广告后，浏览器自动跳转
// @include     http://*dapenti.com/*
// @version     4
// @require     http://code.jquery.com/jquery-1.8.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/11284/dapenti.user.js
// @updateURL https://update.greasyfork.org/scripts/11284/dapenti.meta.js
// ==/UserScript==

$(function(){
	$("ins.adsbygoogle").remove();
        $("body").append("<ins><div class='adsbygoogle' style='display:none;'>gaga</div></ins>");});