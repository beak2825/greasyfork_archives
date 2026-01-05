// ==UserScript==
// @name           Pokec.sk - skrytie bocneho panelu
// @namespace      http://
// @description    Skrytie bocneho panelu
// @include        http://pokec-sklo.azet.sk/miestnost/*
// @include        http://www-pokec.azet.sk/miestnost/*
// @icon           http://s.aimg.sk/pokec_base/css/favicon.ico
// @grant          GM_addStyle
// @author         MaxSVK
// @version        1.1
// @date           2014-July-27
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/3677/Pokecsk%20-%20skrytie%20bocneho%20panelu.user.js
// @updateURL https://update.greasyfork.org/scripts/3677/Pokecsk%20-%20skrytie%20bocneho%20panelu.meta.js
// ==/UserScript==

/* ********** Add new CSS *************************************************** */

GM_addStyle(
	"html, body {width: 100% !important;}" +
	"#sklo {width: 100% !important;}" +
	"#reklama_parapet {display: none !important;}" +
	"#parapet {display: none; height: 100% !important; bottom: 0px !important;}" +
	"#parapetHider {float:right; line-height: 20px; display: block; margin-right: 15px !important;}"
);

/* ************************************************************************** */

var sidebar = document.getElementById("zalozky_sub");

var aElement = document.createElement("a");
	aElement.setAttribute("class", "piskotka vsetko");
	aElement.setAttribute("href", "#");
	aElement.setAttribute("onclick",
		"var sklo=document.getElementById('sklo');" +
		"var vyska=sklo.style.width;" +
		"var parapet=document.getElementById('parapet');" +
		"var cwidth=parseInt(sklo.offsetWidth);" +
		"if(parapet.style.display=='block')" +
		"{cwidth=cwidth+216;sklo.style.setProperty('width', cwidth+'px', 'important');parapet.style.display='none';}" +
		"else" +
		"{cwidth=cwidth-216;sklo.style.setProperty('width', cwidth+'px', 'important');parapet.style.display='block';}");

var divElement = document.createElement("div");
	divElement.setAttribute("id", "parapetHider");

var theText = document.createTextNode("Zobraziť/skryť bočný panel");
	aElement.appendChild(theText);
	divElement.appendChild(aElement);

document.getElementById("miestnostne").appendChild(divElement);