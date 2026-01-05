// ==UserScript==
// @name tumblr-megaeditor-tag-fix
// @description unescapes non-ascii chars escaped on tumblr mega-editor's tag edit tab.
// @description:ja Tumblrの複数投稿編集ツール(mega-editor)での日本語タグなどの非Asciiタグが文字化け(エスケープ: %uXXXX形式に変換)されてしまうのを修正します。
// @namespace http://reppets.hatenablog.com/
// @version 1.0.0
// @compatible firefox (verified with 43.0.4)
// @compatible chrome (verified with  47.0.2526.111)
// @license https://raw.githubusercontent.com/reppets/tumblr-megaeditor-tag-fix/master/LICENSE
// @include https://www.tumblr.com/mega-editor/*
// @downloadURL https://update.greasyfork.org/scripts/16493/tumblr-megaeditor-tag-fix.user.js
// @updateURL https://update.greasyfork.org/scripts/16493/tumblr-megaeditor-tag-fix.meta.js
// ==/UserScript==
var observer = new MutationObserver(function(records, observer) {
	var nodeList = document.querySelectorAll('#tags label');
	var nodes = Array.prototype.slice.call(nodeList,0);  // to use forEach() method.
	nodes.forEach(function(elem, index, array){
		elem.textContent = unescape(elem.textContent);
	});
});

observer.observe(document.getElementById('tags'), {childList: true});
