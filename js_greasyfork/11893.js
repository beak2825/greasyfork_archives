// ==UserScript==
// @name         Google Search Terms Highlight
// @namespace    GSTH
// @version      5.0
// @description  Automatically highlights search terms & full phrases in pages opened by Google search results.
// @include      *
// @grant        GM_getValue
// @grant        GM_setValue
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @icon         https://www.google.ca/images/google_favicon_128.png
// @author       drhouse
// @downloadURL https://update.greasyfork.org/scripts/11893/Google%20Search%20Terms%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/11893/Google%20Search%20Terms%20Highlight.meta.js
// ==/UserScript==

$(document).ready(function () {

	var ref = document.referrer;

	if (location.href.toString().indexOf("https://www.google.") == -1 && ref.indexOf("https://www.google.") != -1){	
		var gsearchmark = GM_getValue("googleSearchTerm", "");
		var tokens = [].concat.apply([], gsearchmark.split('"').map(function(v,i){
			return i%2 ? v : v.split(' ');
		})).filter(Boolean);
		var oldre = /(?:^|\b)(xx)(?=\b|$)/;
		//walk(document.body, newre(oldre));
		var keys = $.map( tokens, function( value, key ) {
			function newre(e){
				return RegExp(e.toString().replace(/\//g,"").replace(/xx/g, value), "i");
			}

			function handleText(node, targetRe) {
				var match, targetNode, followingNode, wrapper;
				match = targetRe.exec(node.nodeValue);
				if (match) {
					targetNode = node.splitText(match.index);
					followingNode = targetNode.splitText(match[0].length);
					wrapper = document.createElement('span');
					$(wrapper).css('background-color', 'yellow');
					targetNode.parentNode.insertBefore(wrapper, targetNode);
					wrapper.appendChild(targetNode);

					if (node.nodeValue.length === 0) {
						node.parentNode.removeChild(node);
					}
					if (followingNode.nodeValue.length === 0) {
						followingNode.parentNode.removeChild(followingNode);
					}
					match = followingNode
					? targetRe.exec(followingNode.nodeValue)
					: null;
				}
			}

			function walk(node, targetRe) {
				var child;
				switch (node.nodeType) {
					case 1: // Element
						for (child = node.firstChild;
							 child;
							 child = child.nextSibling) {
							walk(child, targetRe);
						}
						break;

					case 3: // Text node
						handleText(node, targetRe);
						break;
				}
			}
			walk(document.body, newre(oldre));
		});
	}

	if (location.href.toString().indexOf("https://www.google.") != -1 && location.href.toString().indexOf("/search") != -1){	
		var googleSearchTerm = $("#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input").val();
		GM_setValue("googleSearchTerm", googleSearchTerm);
	}	
});
