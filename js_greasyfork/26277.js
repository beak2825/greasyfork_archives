// ==UserScript==
// @id             www.geocaching.com-4010d69e-c851-413d-baee-0c8a36204a48
// @name           Fix Karttapaikka Map Links and add new maps
// @version        1.2
// @namespace      com.6123tampere
// @author         Tommi Rautava, Veli-Pekka Eloranta
// @license        MIT License
// @description    The script fixes Karttapaikka map links and adds Retkikartta and Paikkatietoikkuna
// @include        http://www.geocaching.com/geocache/*
// @include        https://www.geocaching.com/geocache/*
// @include        http://www.geocaching.com/seek/cache_details.aspx*
// @include        https://www.geocaching.com/seek/cache_details.aspx*
// @include        http://www.geocaching.com/hide/wptlist.aspx?*
// @include        https://www.geocaching.com/hide/wptlist.aspx?*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/26277/Fix%20Karttapaikka%20Map%20Links%20and%20add%20new%20maps.user.js
// @updateURL https://update.greasyfork.org/scripts/26277/Fix%20Karttapaikka%20Map%20Links%20and%20add%20new%20maps.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////////
//
//    Fix Old Karttapaikka Map Links
//    Copyright (C) 2016-2017	Tommi Rautava, Veli-Pekka Eloranta
//
//    Permission is hereby granted, free of charge, to any person obtaining a
//    copy of this software and associated documentation files (the
//    "Software"), to deal in the Software without restriction, including
//    without limitation the rights to use, copy, modify, merge, publish,
//    distribute, sublicense, and/or sell copies of the Software, and to
//    permit persons to whom the Software is furnished to do so, subject to
//    the following conditions:
//    
//    The above copyright notice and this
//    permission notice shall be included in all copies or substantial
//    portions of the Software.
//    
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT
//    WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//    THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
//    LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
////////////////////////////////////////////////////////////////////////////////

var SERVER_URL = 'https://www.6123tampere.com/tools/kartta/uudelleen_ohjaa.html';


// Change only in Finnish geocaches
var country = document.getElementById('ctl00_ContentBody_Location').innerHTML;

if (country.indexOf('Finland') === -1 && country.indexOf('Aland Islands') === -1) {
    return;
}


function getNewListItem(url, text) {
	var t = document.createTextNode(text);

	var a = document.createElement('a');
	a.appendChild(t);
	a.href = url;
	a.setAttribute('target', '_blank');
	a.setAttribute('rel', 'noopener noreferer');

	var li = document.createElement('li');
	li.appendChild(a);

	return li;
}

function modifyMapLinks(elemId) {
	var mapLinksSpan = document.getElementById(elemId);

	if (mapLinksSpan) {
		var links = mapLinksSpan.getElementsByTagName('a');

		for (var idx = links.length - 1; idx >= 0; idx--) {
			var kpLink = links.item(idx);
			
			if (kpLink.hostname == 'kansalaisen.karttapaikka.fi') {
				var res = kpLink.search.match(/y=(\d+\.\d+)\&x=(\d+\.\d+)/);
				if (res) {
					var baseUrl = SERVER_URL +'?lat='+ res[1] +'&lon='+ res[2];
					kpLink.href = baseUrl +'&map=kp';

					var kpListItem = kpLink.parentNode;
					var rkListItem = getNewListItem(baseUrl +'&map=rk', 'Retkikartta');
					var ptiListItem = getNewListItem(baseUrl +'&map=pti', 'Paikkatietoikkuna');

					mapLinksSpan.insertBefore(rkListItem, kpListItem.nextSibling);
					mapLinksSpan.insertBefore(ptiListItem, rkListItem.nextSibling);
				}
			}
		}
	}
}

modifyMapLinks('ctl00_ContentBody_MapLinks_MapLinks');