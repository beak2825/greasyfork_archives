// ==UserScript==
// @name         屏蔽 exlg 大图
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  认为 exlg 大图太占空间，刷屏？帮你把这些图屏蔽掉！
// @author       rui_er
// @match        *://*.luogu.com.cn/*
// @match        *://*.luogu.org/*
// @match        *://luogulo.gq/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442803/%E5%B1%8F%E8%94%BD%20exlg%20%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/442803/%E5%B1%8F%E8%94%BD%20exlg%20%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
  setTimeout(function(){
    var css = `
img[src*=".tk/l0"] {
    display: none;
}
img[src*=".tk/l1"] {
    display: none;
}
img[src*=".tk/g1"] {
    display: none;
}
img[src*=".tk/g2"] {
    display: none;
}
img[src*=".tk/g3"] {
    display: none;
}
img[src*=".tk/g4"] {
    display: none;
}
img[src*=".tk/g5"] {
    display: none;
}
img[src*=".tk/g6"] {
    display: none;
}
img[src*=".tk/g7"] {
    display: none;
}
img[src*=".tk/g8"] {
    display: none;
}
img[src*=".tk/g9"] {
    display: none;
}
img[src*=".tk/ga"] {
    display: none;
}
img[src*=".tk/gb"] {
    display: none;
}
img[src*=".tk/gc"] {
    display: none;
}
img[src*=".tk/gd"] {
    display: none;
}
img[src*=".tk/ge"] {
    display: none;
}
img[src*=".tk/gf"] {
    display: none;
}
img[src*=".tk/gg"] {
    display: none;
}
img[src*=".tk/gh"] {
    display: none;
}
`;
if (typeof GM_addStyle != "undefined") { // 插入 CSS，下面同
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
		document.documentElement.appendChild(node);
	}
}
},500)})();