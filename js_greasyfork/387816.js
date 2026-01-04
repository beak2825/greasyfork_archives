// ==UserScript==
// @name         ChordWikiGetExternalChord
// @namespace    https://twitter.com/graphemec1uster
// @version      2.1
// @description  ChordWikiのコードブックにないフレットボードをJGuitarから取得します。また、矢印や括弧、全角の♯や♭が使われている場合のフレットボード表示にも対応しています。付加機能として、フレットボードの表示速度の改善も行っています。
// @author       ぐらふぃーむ
// @match        *://ja.chordwiki.org/wiki*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlhttpRequest
// @connect      jguitar.com
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/387816/ChordWikiGetExternalChord.user.js
// @updateURL https://update.greasyfork.org/scripts/387816/ChordWikiGetExternalChord.meta.js
// ==/UserScript==

if (typeof GM_xmlhttpRequest == "undefined") GM_xmlhttpRequest = GM.xmlHttpRequest;
document.body.onload = function() {
	new Image().src = "/cd/N.C..png";
	[].forEach.call(document.getElementsByClassName("chord"), function(e) {
		var path = e.getAttribute("onclick").slice(27, -14);
		var replaced = path.replace(/^[(（](.*)[)）]$/, "$1");
		if (replaced == ">" || replaced == "＞") {
			e.setAttribute("onclick", "");
			e.style.cursor = "initial";
			e.style.color = "orange";
			return;
		}
		if (replaced == "N.C.") {
			e.style.color = "brown";
			if (path != replaced) e.setAttribute("onclick", "javascript:popupImage('/cd/N.C..png', event);");
			return;
		}
		replaced = replaced.replace(/♭/g, "b").replace(/♯/g, "s").replace(/𝄪/g, "ss").replace(/𝄫/g, "bb").replace(/[^!-~]/g, "");
		if (path != replaced) e.setAttribute("onclick", "javascript:popupImage('/cd/" + replaced + ".png', event);");
		var request = new XMLHttpRequest();
		request.open("GET", "/cd/" + replaced + ".png");
		request.onload = function() {
			if (request.status == 404) {
				e.style.color = "red";
				GM_xmlhttpRequest({
					method: "GET",
					url: "https://jguitar.com/chordsearch/" + encodeURIComponent(e.innerText.replace(/^[(（](.*)[)）]$/, "$1").replace(/♭/g, "b").replace(/♯/g, "#").replace(/𝄪/g, "##").replace(/𝄫/g, "bb").replace(/\(?単音\)?(.*)/, "$15omit5").replace(/[^!-~]/g, "").replace("on", "/").replace(/\((add|omit|sus)/g, "$1").replace(/[(,]/g, "add").replace(/\)/g, "").replace("sus24", "sus2sus4")),
					onload: function(response) {
						if (response.responseText) {
							var match = response.responseText.match(/src="(\/images\/chordshape\/.+?)"/);
							if (match) {
								e.style.color = "green";
								e.setAttribute("onclick", "javascript:popupImage('" + (new Image().src = "https://jguitar.com" + match[1]) + "', event);");
							}
						}
					}
				});
			}
		};
		request.send();
	});
	var addMouseout;
	var imgNode = document.createElement("img");
	if (document.all && _ie10) {
		imgNode.attachEvent("onclick", closeImage);
		imgNode.attachEvent("onmouseout", closeImage);
		addMouseout = function(e) {
			e.attachEvent("onmouseout", closeImage);
		};
	} else if (document.implementation) {
		imgNode.addEventListener("click", closeImage, true);
		imgNode.addEventListener("mouseout", closeImage, true);
		addMouseout = function(e) {
			e.addEventListener("mouseout", closeImage, true);
		};
	}
	imgNode.style.position = "absolute";
	imgNode.style.borderColor = "#0099FF";
	imgNode.style.backgroundColor = "#FFFFFF";
	imgNode.style.borderWidth = "2px";
	imgNode.style.borderStyle = "solid";
	imgNode.style.margin = "0";
	var removed = false;
	popupImage = function(filepath, e) {
		addMouseout(e.target);
		imgNode.src = filepath;
		imgNode.style.left = getLeftFromEvent(e) + "px";
		imgNode.style.top = getTopFromEvent(e) - 80 + "px";
		imgNode.style.width = imgNode.style.height = filepath.charAt(0) == "h" ? "72px" : "";
		document.body.appendChild(imgNode);
		removed = false;
	};
	function closeImage() {
		if (!removed) {
			document.body.removeChild(imgNode);
			removed = true;
		}
	}
};