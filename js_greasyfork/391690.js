// ==UserScript==
// @name         ChordWikiShowNotes
// @namespace    https://twitter.com/graphemec1uster
// @version      1.0
// @description  コードの構成音を示すプログラムです。
// @author       ぐらふぃーむ
// @match        *://ja.chordwiki.org/wiki*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/391690/ChordWikiShowNotes.user.js
// @updateURL https://update.greasyfork.org/scripts/391690/ChordWikiShowNotes.meta.js
// ==/UserScript==

var script = document.createElement("script");
script.src = "https://graphemecluster.github.io/ChordNote.js";
script.onload = function() {
	[].forEach.call(document.getElementsByClassName("chord"), function(item) {
		var chord = item.innerText, div = document.createElement("div");
		div.innerText = parseContent(chord);
		div.style.fontSize = "70%";
		div.style.lineHeight = "50%";
		div.style.color = "green";
		div.style.marginTop = "10px";
		item.innerHTML = "";
		item.appendChild(div);
		div = document.createElement("div");
		div.innerText = chord;
		item.appendChild(div);
		item.style.display = "inline-block";
	});
};
document.getElementsByTagName("head")[0].appendChild(script);