// ==UserScript==
// @name         RED Discogs Embed
// @version      0.1.3
// @description  Display actual discogs page
// @author       Denlekke
// @include      http*://*redacted.ch/torrents.php*
// @grant        none
// @namespace    https://greasyfork.org/en/users/133827-den-lekke
// @downloadURL https://update.greasyfork.org/scripts/34249/RED%20Discogs%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/34249/RED%20Discogs%20Embed.meta.js
// ==/UserScript==

(function() {
	'use strict';

	//looking for discogs link section
	//get all links
	var links = document.getElementsByTagName("a");
	var link;
	var cogsfound = false;

	//for each link check if it's a discogs link
	for(var i = 0; i < links.length; i++) {
		if( links[i].href.indexOf('discogs') != -1) {
			cogsfound = true;

			link = links[i].href;

			//check if http and convert to https
			if(link.indexOf('http://') != -1){
				link = "https" + link.substring(4);
			}
		}
	}

	//if no discogs link, end
	if(!cogsfound){
		return;
	}
	else{
		//discogs link found
		//first remove torrent description
		var elements = document.getElementsByClassName("box torrent_description");

		for(var j = 0; j <elements.length; j++){
			var element = elements[j];
			element.parentNode.removeChild(element);
		}

		//create a container for the iframe
		var container = document.createElement('div');
		container.setAttribute('id','container');
		container.setAttribute('style','width: 600px;height: 500px;');

        var container2 = document.createElement('div');
		container2.setAttribute('id','discogs link');
		container2.setAttribute('style','width: 600px;height: 20px;');
        container2.innerHTML = "<a href="+link+">"+link+"</a>";


		//create the iframe and put it in the container
		var ifrm = document.createElement('iframe');
		container.appendChild(ifrm);


		ifrm.setAttribute('id', 'ifrm'); // assign an id


		var el = document.getElementById('torrent_comments');
		el.parentNode.insertBefore(container, el);
        container.parentNode.insertBefore(container2, container);


		ifrm.setAttribute('src', link);
		ifrm.setAttribute('scrolling', 'no');
		ifrm.setAttribute('style','width: 1000px;height: 800px; -webkit-transform: scale(.657);-webkit-transform-origin: 0 0;');
		ifrm.setAttribute('frameborder', '0');
	}
})
();
