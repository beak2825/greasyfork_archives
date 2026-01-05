// ==UserScript==
// @name        Agar mods + ad block
// @namespace   kalebdaboss.cf
// @description Agar.io modz
// @include     *://agar.io/*
// @version     OPENbeta-1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12353/Agar%20mods%20%2B%20ad%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/12353/Agar%20mods%20%2B%20ad%20block.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js";
(document.body || document.head || document.documentElement).appendChild(script);

	$("#adbg").hide();
	$(".agario-promo").hide();
	$("div#s300x250").hide();
	$("div.form-group div[style='float: right; margin-top: 10px; height: 40px;']").hide();
	$("div.form-group div h2").html('<a href="www.kalebdaboss.cf"><h2>agar<sub><small>with mods by kalebdaboss</small></sub></h2></a>');