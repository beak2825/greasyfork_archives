// ==UserScript==
// @name         Adblock-Agar-Mods
// @namespace    Online
// @version      3.4
// @description  enter something useful
// @author       You
// @match        http://agar.io/
// @match        http://agar.io/?ip=127.0.0.1:443
// @match        http://agario.ovh/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12511/Adblock-Agar-Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/12511/Adblock-Agar-Mods.meta.js
// ==/UserScript==

var script = document.createElement('script');
script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js";
(document.body || document.head || document.documentElement).appendChild(script);

	$("#adbg").hide();
	$(".agario-promo").hide();
	$("div#s250x250").hide();
	$("div.form-group div[style='float: right; margin-top: 10px; height: 40px;']").hide();
	$("div.form-group div h2").html('<a href="https://agariomods.com/"><h2>Agario<sub><small>Mods</small></sub></h2></a>');