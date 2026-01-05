// ==UserScript==
// @name        EtoEto Dictionary Changer
// @namespace   etoeto_JishoReplacerKK
// @description When reading book episodes, change the Jisho dictionary to Weblio, ALC, Tangorin, or Goo. This script also fixes the rikai browser extension display, and improves copying of Japanese text.
// @author      Kai Krause <kaikrause95@gmail.com>
// @match     	http://etoeto.com/*books/*episodes/*
// @match     	https://etoeto.com/*books/*episodes/*
// @version     1.3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/19546/EtoEto%20Dictionary%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/19546/EtoEto%20Dictionary%20Changer.meta.js
// ==/UserScript==

// Choose a dictionary from a number:
// Weblio: 0 | ALC: 1 | Tangorin 2 | Goo: 3
var dictSelection = 0;

// ----------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------

var body = document.body;

//Fix Rikai Display
body.getElementsByClassName('off-canvas-wrap')[0].style.zIndex = "0";

//Create the CSS coloration for the dictionary on-hover
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "a.highlight:hover{color: red !important;}";
body.appendChild(css);

var pos = body.getElementsByClassName('audio-word-text');
var dictionaries = ['ejje.weblio.jp/content/', 'eow.alc.co.jp/search?q=', 'tangorin.com/general/'];
for (var i = 0; i < pos.length; ++i) {
	body.getElementsByClassName('audio-word-text')[i].outerHTML = pos[i].outerHTML.replace(/audio-word-text/igm, 'audio-word-text highlight');
	if (dictSelection != 3) {
		body.getElementsByClassName('audio-word-text')[i].outerHTML = pos[i].outerHTML.replace(/jisho.org\/search\//igm, dictionaries[dictSelection]);
	} else {
		body.getElementsByClassName('audio-word-text')[i].outerHTML = pos[i].outerHTML.replace(/jisho.org\/search/igm, 'dictionary.goo.ne.jp/srch/jn');
		body.getElementsByClassName('audio-word-text')[i].outerHTML = pos[i].outerHTML.replace(/" target="_blank"/igm, '/m0u/" target="_blank"');
	}
}

//Remove formatting errors (spaces, line breaks) when copying Japanese dialogue
document.oncopy = function(){
	var body = document.body;
	var selection = window.getSelection();
	var text = selection.toString();
	var newText = '';

	for (var i = 0; i < text.length; i++){
		if (text[i].match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/) ){
			newText += text[i];
		}
		else if (text[i].match(/^[a-zA-Z]+$/) ){
			newText += '\n';
			for (var x = i; x < text.length; x++){
				newText += text[x];
			}
			i = text.length;
		}
	}

	var newSelectionContainer = document.createElement('div');
	newSelectionContainer.style.position = 'absolute';
	newSelectionContainer.style.bottom = '-99999px';
	body.appendChild(newSelectionContainer);
	newSelectionContainer.innerHTML = newText;
	selection.selectAllChildren(newSelectionContainer);

	window.setTimeout(function() {
		body.removeChild(newSelectionContainer);
	},4);
};
