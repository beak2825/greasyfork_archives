// ==UserScript==
// @name         RED Discogs Embedv2.leftside
// @version      0.1.3
// @description  Display actual discogs page
// @author       Denlekke
// @include      http*://*redacted.ch/torrents.php*
// @include      http*://*redacted.ch/requests.php*
// @grant        none
// @namespace    https://greasyfork.org/en/users/133827-den-lekke
// @downloadURL https://update.greasyfork.org/scripts/370280/RED%20Discogs%20Embedv2leftside.user.js
// @updateURL https://update.greasyfork.org/scripts/370280/RED%20Discogs%20Embedv2leftside.meta.js
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

        var row = document.createElement('div');
        row.setAttribute('id', 'row');
        row.setAttribute('class', 'row');
        var colR = document.createElement('div');
        colR.setAttribute('id', 'colR');
        colR.setAttribute('class', 'colR');
        colR.setAttribute('style','float:right; width: 50%;height: 100%; overflow:hidden;');
        colR.apprendChild;
        var colL = document.createElement('div');
        colL.setAttribute('id', 'colL');
        colL.setAttribute('class', 'colL');
        colL.setAttribute('style','float:left; width: 50%;height: 1500px; margin-top:0px; overflow:hidden;');
        colL.setAttribute('overflow', 'hidden');


        row.appendChild(colR);
        row.appendChild(colL);


        //place entire row
        var header = document.getElementById('torrents');
        var headParent = header.parentNode;
        //alert(header.childNodes.length);
        //alert(row.childNodes.length);
        headParent.insertBefore(row, header);

        //stuff to put in left
        var iFrameBig = document.createElement('iframe');
        var linkForiFreame = link+"?"+window.location.href.split("?")[1]
        iFrameBig.setAttribute('src', linkForiFreame);
        iFrameBig.setAttribute('style','width: 100%; height: 100%; margin-top:0px; margin-left:0px;');
        iFrameBig.setAttribute('frameborder', '0');
        iFrameBig.setAttribute('scrolling', 'no');
        iFrameBig.setAttribute('overflow', 'hidden');
        colL.appendChild(iFrameBig, colL);

        //stuff to put in right

            colR.appendChild(header, colR);






	}
})
();
