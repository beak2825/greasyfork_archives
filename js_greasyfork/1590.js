// ==UserScript==
// @name No Embed Youtube
// @version 3.0.0
// @description replace embed iframe, object with anchor link.
// @homepageURL https://github.com/eight04/no-embed-youtube
// @supportURL https://github.com/eight04/no-embed-youtube/issues
// @license MIT
// @author eight04 <eight04@gmail.com>
// @namespace eight04.blogspot.com
// @include http*
// @exclude http://www.youtube.com/*
// @exclude https://www.youtube.com/*
// @exclude https://vimeo.com/*
// @run-at document-start
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/1590/No%20Embed%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/1590/No%20Embed%20Youtube.meta.js
// ==/UserScript==

"use strict";

var xpath = `(
	//iframe[
		contains(@src, 'youtube.com/embed/') or
		contains(@src, 'youtube.com/v/') or
		contains(@src, 'youtube-nocookie.com/embed/') or
		contains(@src, 'youtube-nocookie.com/v/') or
		contains(@data-src, 'youtube.com/embed/') or
		contains(@src, 'vimeo.com/video')
	] |
	//object[./param[contains(@value, 'youtube.com/v/')]] |
	//embed[
		contains(@src, 'youtube.com/v/') and
		not(ancestor::object)
	]
)[not(ancestor::*[@id='YTLT-player'])]`;

const patterns = [
	{
    test: /youtube(-nocookie)?\.com\/(embed|v)\/(.+?)(\?|&|$)/,
    repl: match => `https://www.youtube.com/watch?v=${match[3]}`
  },
  {
    test: /vimeo\.com\/video\/(\d+)/,
    repl: match => `https://vimeo.com/${match[1]}`
  }
];

var unEmbed = function(node){

	var result = document.evaluate(
		xpath, node, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	var element = null;
	var i = 0, j;

	while ((element = result.snapshotItem(i++))) {

		// iframe or embed
		var url = element.src || element.dataset.src;

		// object
		if(!url){
			for(j = 0; j < element.childNodes.length; j++){
				var pa = element.childNodes[j];
				if(pa.nodeName == "PARAM" && pa.getAttribute("name") == "movie"){
					url = pa.getAttribute("value");
					break;
				}
			}
		}

		if(!url){
			continue;
		}

    for (const pattern of patterns) {
      const match = url.match(pattern.test);
      if (!match) continue;
      const newUrl = pattern.repl(match);
      var a = document.createElement("a");
      a.textContent = newUrl;
      a.href = newUrl;
      a.target = "_blank";
      a.className = "unembed";
      element.parentNode.replaceChild(a, element);
      break;
    }
	}
};

new MutationObserver(function(){
	if (document.body) {
		unEmbed(document.body);
	}
}).observe(document, {
	childList: true,
	subtree: true
});
