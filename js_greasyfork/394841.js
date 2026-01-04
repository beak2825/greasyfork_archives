// ==UserScript==
// @name              Youtube to Invidio.us Embed
// @description       Forces all embedded Youtube videos to Invidio.us for watch youtube videos with more privacy
// @version           1.2
// @include           http*
// @exclude           *youtube.com/*
// @grant             none
// @namespace         https://greasyfork.org/users/433508
// @downloadURL https://update.greasyfork.org/scripts/394841/Youtube%20to%20Invidious%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/394841/Youtube%20to%20Invidious%20Embed.meta.js
// ==/UserScript==

// Domain of Invidio instance, change by your prefer (Default: invidio.us)
var invidioUrl = 'invidio.us'; 

function noYt() {
	var i, attr, index, video, tag = document.getElementsByTagName('iframe');
					
	for (i = 0; i < tag.length; i++) {
		attr = tag[i].getAttribute('src');
		index = 0;
							
		if (attr.indexOf('youtube.com') !== -1) {						
			if (attr.indexOf('/v/') >= 0) {
				index = attr.indexOf('/v/') + 3;
			} else if(attr.indexOf('?v=') >= 0)  {
				index = attr.indexOf('?v=') + 3;
			} else if (attr.indexOf('/embed/') >= 0) {
				index = attr.indexOf('/embed/') + 7;							
			}
			
			video = attr.substring(index, index + 11);					
		}
			
		if (index > 0) {			
			tag[i].setAttribute('src', 'https://' + invidioUrl + '/embed/' + video);
			tag[i].setAttribute('style', 'min-height:100%; min-width:100%;');
			tag[i].setAttribute('frameborder', '0');
			tag[i].setAttribute('allowfullscreen', '1');
		}
	}
}

noYt();