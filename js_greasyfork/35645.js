// ==UserScript==
// @name          Inline Mp3 Player (HTML5)
// @description	  Adds an inline WordPress mp3 with Play and Pause controls to every link to an mp3 file.
// @namespace     http://musicplayer.sourceforge.net/greasemonkey
// @version       1.0
// @include       *

//by Fabricio Zuardi (http://www.hideout.com.br)
// @downloadURL https://update.greasyfork.org/scripts/35645/Inline%20Mp3%20Player%20%28HTML5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/35645/Inline%20Mp3%20Player%20%28HTML5%29.meta.js
// ==/UserScript==

(function() {

	var page_links = document.links;
	for (var i=0; i<page_links.length; i++){
		if (page_links[i].href.match(/\.mp3$/i)) {
			var span = document.createElement("span");
			//var url = "https://www.admongo.gov/_flash/playerqo9.swf?&amp;bg=0xCDDFF3&amp;leftbg=0x357DCE&amp;lefticon=0xF2F2F2&amp;rightbg=0xF06A51&amp;rightbghover=0xAF2910&amp;righticon=0xF2F2F2&amp;righticonhover=0xFFFFFF&amp;text=0x357DCE&amp;slider=0x357DCE&amp;track=0xFFFFFF&amp;border=0xFFFFFF&amp;loader=0xAF2910&amp;soundFile="+escape(page_links[i].href)
			var width = 290
			var height = 20
			code_str = ""
			code_str += " <audio controls>\n"
			code_str += "<source src=\""+page_links[i].href+"\" \n"
			code_str += "type=\"audio/mpeg\">\n"
			code_str += "</audio>\n"
			span.innerHTML = code_str
			page_links[i].parentNode.insertBefore(span, page_links[i].nextSibling)
		}
	}

})();

(function() {

	var page_links = document.links;
	for (var i=0; i<page_links.length; i++){
		if (page_links[i].href.match(/view128\.php/i)) {
			var span = document.createElement("span");
			//var url = "https://www.admongo.gov/_flash/playerqo9.swf?&amp;bg=0xCDDFF3&amp;leftbg=0x357DCE&amp;lefticon=0xF2F2F2&amp;rightbg=0xF06A51&amp;rightbghover=0xAF2910&amp;righticon=0xF2F2F2&amp;righticonhover=0xFFFFFF&amp;text=0x357DCE&amp;slider=0x357DCE&amp;track=0xFFFFFF&amp;border=0xFFFFFF&amp;loader=0xAF2910&amp;soundFile="+escape(page_links[i].href)
			var width = 290
			var height = 20
			code_str = ""
			code_str += " <audio controls>\n"
			code_str += "<source src=\""+page_links[i].href+"\" \n"
			code_str += "type=\"audio/mpeg\">\n"
			code_str += "</audio>\n"
			span.innerHTML = code_str
			page_links[i].parentNode.insertBefore(span, page_links[i].nextSibling)
		}
	}

})();