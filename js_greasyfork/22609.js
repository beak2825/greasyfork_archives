// ==UserScript==
// @name         AlchiCode CSS
// @namespace    http://alchemygame.ru/
// @version      0.1
// @description  Половина кода спёрта откуда-то._.
// @author       Megageorgio
// @match        http://alchemygame.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22609/AlchiCode%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/22609/AlchiCode%20CSS.meta.js
// ==/UserScript==
function replaceStyleSheet(oldCSS, newCSS) {
    document.evaluate('//link[@rel="stylesheet" and @href="'+oldCSS+'"]', document, null, 
		      XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href = newCSS;
}

replaceStyleSheet("/css/alchemy.css", "https://dl.dropboxusercontent.com/s/5kv36xjl37ifnv1/alchemy.css");