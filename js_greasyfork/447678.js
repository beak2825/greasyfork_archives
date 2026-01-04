// ==UserScript==
// @name         Нормальное положение кнопки громкости на Пикабу
// @namespace    no
// @version      0.1
// @description  Нормальное положение кнопки громкости на видео для Пикабу в виде скрипта для Tampermonkey⁠
// @author       Komatera & Vadenko
// @match        https://pikabu.ru/story/normalnoe_polozhenie_knopki_gromkosti_na_pikabu_9264775
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @license      MIT
// @grant        none
// @include       http://pikabu.ru/*
// @include       https://pikabu.ru/*
// @downloadURL https://update.greasyfork.org/scripts/447678/%D0%9D%D0%BE%D1%80%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%BF%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B3%D1%80%D0%BE%D0%BC%D0%BA%D0%BE%D1%81%D1%82%D0%B8%20%D0%BD%D0%B0%20%D0%9F%D0%B8%D0%BA%D0%B0%D0%B1%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/447678/%D0%9D%D0%BE%D1%80%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%BF%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B3%D1%80%D0%BE%D0%BC%D0%BA%D0%BE%D1%81%D1%82%D0%B8%20%D0%BD%D0%B0%20%D0%9F%D0%B8%D0%BA%D0%B0%D0%B1%D1%83.meta.js
// ==/UserScript==

(function() {var css = "";
if (false || (document.domain == "pikabu.ru" || document.domain.substring(document.domain.indexOf(".pikabu.ru") + 1) == "pikabu.ru"))
	css += [
		".player__controls-wrapper {",
		"        width: calc(100% - 30px);",
		"        }",
		".player__volume-container {",
		"        top: auto;",
		"        bottom: 6px;",
		"        right: 2px;",
		"}",
		".player__volume-container,",
		".player__volume,",
		".player__volume-amounts {",
		"        transform: rotate(180deg);",
		"}"
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
