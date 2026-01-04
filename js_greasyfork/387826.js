// ==UserScript==
// @name         ChordWikiLikeUfret
// @supportURL   https://twitter.com/graphemec1uster
// @version      1.0
// @description  ChordWikiのフレットボード表示をUfretのような表示形式にします。
// @author       ぐらふぃーむ
// @match        *://ja.chordwiki.org/*
// @grant        GM_addStyle
// @grant        GM.addStyle
// @noframes
// @namespace http://surrogatepair.github.io/
// @downloadURL https://update.greasyfork.org/scripts/387826/ChordWikiLikeUfret.user.js
// @updateURL https://update.greasyfork.org/scripts/387826/ChordWikiLikeUfret.meta.js
// ==/UserScript==

(function() {
	if (typeof GM_addStyle == "undefined") GM_addStyle = typeof GM.addStyle == "undefined" ? (function(code) {
		var style = document.createElement("style");
		style.type = "text/css";
		if (style.styleSheet) style.styleSheet.cssText = code;
		else style.innerHTML = code;
		document.getElementsByTagName("head")[0].appendChild(style);
	}) : GM.addStyle;
	GM_addStyle(".likeUfretON span.chord{cursor:initial;pointer-events:none;display:inline-block;line-height:2em;position:relative;left:-10px;text-align:center}.likeUfretON span.chord img{display:block;margin:5px -2px -2px}.likeUfretON span.word{position:relative;left:-2em}.likeUfretON p.line{line-height:3em;text-indent:-40px;margin-left:40px}.likeUfretON p.line.comment{line-height:1em}div.main{margin:0 180px 0 10px}.likeUfretOFF span.chord img,.likeUfretOFF #likeUfretOFF,.likeUfretON #likeUfretON{display:none}");
	[].forEach.call(document.getElementsByClassName("chord"), function(e) {
		e.insertAdjacentHTML("afterbegin", '<img src="' + e.getAttribute("onclick").slice(23, -10) + '">');
	});
	document.getElementById("key").insertAdjacentHTML("afterend", 'フレットボードの常時表示を <button id="likeUfretON" onclick="localStorage.setItem(\'srg_Ufret\',0);document.body.className=\'likeUfretON\'">有効にする</button><button id="likeUfretOFF" onclick="localStorage.setItem(\'srg_Ufret\',1);document.body.className=\'likeUfretOFF\'">無効にする</button> <small>(<a href="https://greasyfork.org/ja/scripts/387826-chordwikilikeufret">ChordWikiLikeUfret</a> ver. 0.5)</small>');
	if (!localStorage.getItem("srg_Ufret")) localStorage.setItem("srg_Ufret", 0);
	document.body.className = localStorage.getItem("srg_Ufret") == 1 ? "likeUfretOFF" : "likeUfretON";
})();