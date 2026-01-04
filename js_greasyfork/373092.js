// ==UserScript==
// @name           dreye.nav.link
// @description    dreye 
// @namespace      zhang
// @include        http://www.dreye.com.cn/ews/*
// @version 0.0.1.20181010033615
// @downloadURL https://update.greasyfork.org/scripts/373092/dreyenavlink.user.js
// @updateURL https://update.greasyfork.org/scripts/373092/dreyenavlink.meta.js
// ==/UserScript==

/**
 * Returns the escaped form of current word of page.
 * Dr.eye always escape the non-alphanumeric characters, e.g. flaw@1 -> flaw%401
 */
function getCurrentWord() {
	var matchKey = "add_word_note";
	var dicCont = document.getElementById("dic_cont");
	//alert("dic_cont: "+dicCont);
	if (dicCont) {
		var elems = dicCont.getElementsByTagName("img");
		//alert("elems: "+elems);
		for (var i = 0; i < elems.length; i++) {
			var js = elems[i].getAttribute("onclick");
			if (js && js.substring(0, matchKey.length) == matchKey) {
				var params = eval("new Array"+js.substring(matchKey.length));
				return params[0];
			}
		}
	}
	return null;
}

function getWordInfo(word) {
	var fnHistSw = "history_switch";
	var container = document.getElementById("history_dict");
	if (container) {
		var links = container.getElementsByTagName("a");
		for (var i = 0; i < links.length; i++) {
			var mo = links[i].getAttribute("onmouseover");
			if (mo && mo.substring(0, fnHistSw.length) == fnHistSw) {
				var params = eval("new Array"+mo.substring(fnHistSw.length));
				if (params[0] == word) {
					return params; // [word, code-page, word_index, hist_index]
				}
			}
		}
	}
	return null;
}

function createLink(href, text, src) {
	var elemImg = document.createElement("IMG");
	elemImg.setAttribute("border", 0);
	elemImg.setAttribute("src", src);
	elemImg.setAttribute("alt", text);
	var elemA = document.createElement("A");
	elemA.setAttribute("href", href);
	elemA.setAttribute("title", text);
	elemA.appendChild(elemImg);
	var elemTD = document.createElement("TD");
	elemTD.appendChild(elemA);
	return elemTD;
}

function getNavURL(codepage, w_index_id) {
	return "http://www.dreye.com.cn/ews/dict.php?hidden_codepage="+codepage+"&w_index_id="+w_index_id;
}

var word = getCurrentWord();
//alert(word);
if (word) {
	var info = getWordInfo(word);
	//alert(info);
	if (info) {
		var elem = document.getElementById("EXP_HTML");
		if (elem) {
			var elemTR = elem.parentNode.parentNode;
			if (elemTR.tagName == "TR") {
				elemTR.appendChild(createLink(getNavURL(info[1], parseInt(info[2])-1), "上一个单词", "images/ico-1.gif"));
				elemTR.appendChild(createLink(getNavURL(info[1], parseInt(info[2])+1), "下一个单词", "images/ico-2.gif"));
			}
		}
	}
}
