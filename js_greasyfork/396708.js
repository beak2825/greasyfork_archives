// ==UserScript==
// @name         MINECRAFT THEME PARA DUOLINGO
// @namespace    http://tampermonkey.net/
// @version      9.10.2
// @description  Duolingo personalizado para los amantes de minecraft
// @author       Tecno M.C. 99
// @include      https://www.duolingo.com*
// @include      https://forum.duolingo.com*
// @include      https://events.duolingo.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396708/MINECRAFT%20THEME%20PARA%20DUOLINGO.user.js
// @updateURL https://update.greasyfork.org/scripts/396708/MINECRAFT%20THEME%20PARA%20DUOLINGO.meta.js
// ==/UserScript==
    (function() {var css = "";
 (false || (document.location.href.indexOf("https://www.duolingo.com") == 0))
	css += [
        "body {",
		"    background: fixed url(https://wallpaperplay.com/walls/full/7/1/7/241220.jpg);",
		"}",
		"",
        "._2EZRi",
		"{",
		"    background-color: #000000b0;",
		"    border-bottom: 2px solid #000;",
		"}",
		"",
        ".DdXah",
		"{",
		"    background: url(https://vignette.wikia.nocookie.net/glitchpedia/images/0/0e/Textura_bloque_de_tierra_Minecraft.png/revision/latest/scale-to-width-down/340?cb=20161116170928&path-prefix=es;",
		"}",
		"",
		"._2-1wu, ._3Af2O",
		"{",
		"    background: url(https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2020/01/minecraft_2.jpg);",
		"}",
		"",
        "div._34sNg._1sntG._3ZpB4",
		"{",
		"    background: url(https://vignette.wikia.nocookie.net/glitchpedia/images/0/0e/Textura_bloque_de_tierra_Minecraft.png/revision/latest/scale-to-width-down/340?cb=20161116170928&path-prefix=es);",
		"}",
		"",
        "div._1oUqy",
		"{",
		"    background: url(https://1.bp.blogspot.com/-Xjc_Kah6RFQ/XlFySKcAZhI/AAAAAAAAEEU/aiWdTDuBYDYzdmYpbGlT-e2ZuwLLiG8ggCLcBGAsYHQ/s1600/feo.jpg);",
		"}",
		"",
        "h1._1Zqmf",
		"{",
		"    color: #0004FF;",
		"}",
		"",
        ".KRKEd",
		"{",
		"    color: #f7f8fa;",
		"}",
		"",
        "h2.nyHZG",
		"{",
		"    color: #3AC52C;",
		"}",
		"",
        "p._2w5q7",
		"{",
		"    color: #44983B;",
		"}",
		"",
        "._2KZ79",
		"{",
		"    color: #f7f8fa;",
		"}",
		"",
        "._2Pbs9.W32-l",
		"{",
		"    color: #f7f8fa;",
		"}",
		"",
        ".Xfhea._3t4kt",
		"{",
		"    color: #F51103;",
		"}",
		"",
        "h3.qr7ei",
		"{",
		"    color: #F51103;",
		"}",
		"",
    ].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();