// ==UserScript==
// @name				webm/mp4 media embed for HKGALDEN v 0.1
// @version				2015 SEP 8th
// @author				Toggi3 , sakura nao
// @namespace			http://hkgalden.com/
// @description			replaces links to .webm & .mp4 content with embedded video
// @include				http://hkgalden.com/*
// @downloadURL https://update.greasyfork.org/scripts/12282/webmmp4%20media%20embed%20for%20HKGALDEN%20v%2001.user.js
// @updateURL https://update.greasyfork.org/scripts/12282/webmmp4%20media%20embed%20for%20HKGALDEN%20v%2001.meta.js
// ==/UserScript==

(function() {

	var page_links = document.links;
	for (var i=0; i<page_links.length; i++){
		if (page_links[i].href.match(/\.webm$/i)) {
			var span = document.createElement("div");
			var width = "640"
            var height = "480"
			code_str = ""
			code_str += " <video \n"
			code_str += "width=\""+width+"\" max-height=\""+height+"\" allowfullscreen controls>\n"
			code_str += "<source \n"
			code_str += "src=\""+page_links[i].href+"\" type=\"video/webm\" />\n"
			code_str += "</video>\n"
			span.innerHTML = code_str
			page_links[i].parentNode.insertBefore(span, page_links[i].nextSibling)
		}
		else if (page_links[i].href.match(/\.mp4$/i)) {
			var span = document.createElement("div");
			var width = "640"
            var height = "480"
			code_str = ""
			code_str += " <video \n"
			code_str += "width=\""+width+"\" max-height=\""+height+"\" allowfullscreen controls>\n"
			code_str += "<source \n"
			code_str += "src=\""+page_links[i].href+"\" type=\"video/mp4\" />\n"
			code_str += "</video>\n"
			span.innerHTML = code_str
			page_links[i].parentNode.insertBefore(span, page_links[i].nextSibling)
		}
	}
}
)();