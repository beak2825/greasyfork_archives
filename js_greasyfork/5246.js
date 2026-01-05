// ==UserScript==
// @id             www.geocaching.com-784fabe2-287e-4844-bc1b-064db9b63ed6@scriptish
// @name           Show Waypoints on Karttapaikka Map
// @version        1.4
// @namespace      assankassa@gmail.com
// @author         Tommi Rautava
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @description    The script changes the map links to use Karttapaikka map on both the description page and the waypoints page of a geocache on the geocaching.com site.
// @include        http://www.geocaching.com/geocache/*
// @include        https://www.geocaching.com/geocache/*
// @include        http://www.geocaching.com/seek/cache_details.aspx*
// @include        https://www.geocaching.com/seek/cache_details.aspx*
// @include        http://www.geocaching.com/hide/wptlist.aspx?*
// @include        https://www.geocaching.com/hide/wptlist.aspx?*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/5246/Show%20Waypoints%20on%20Karttapaikka%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/5246/Show%20Waypoints%20on%20Karttapaikka%20Map.meta.js
// ==/UserScript==
////////////////////////////////////////////////////////////////////////////////
//
//    Show Waypoints on Karttapaikka Map
//    Copyright (C) 2014, 2015  Tommi Rautava
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
////////////////////////////////////////////////////////////////////////////////

function paddedIndex(i) {
	return (i >= 10) ? i : ("0"+ i);
};

// http://www.geocaching.com/map/default.aspx?lat=61.12345&lng=23.12345
// http://kansalaisen.karttapaikka.fi/kartanhaku/koordinaattihaku.html?y=61.12345&x=23.12345&srsName=EPSG:4258
function redirectToKarttapaikka(url) {
	var res = url.replace("http://www.geocaching.com/map/default.aspx?", "");
	res = res.replace("../map/default.aspx?", "");
	res = res.replace("lat=", "y=");
	res = res.replace("lng=", "x=");
	res = "http://kansalaisen.karttapaikka.fi/kartanhaku/koordinaattihaku.html?" + res + "&srsName=EPSG:4258";
	return res;
};

function fixLinks(id) {
	i = 0;

	while (1) {
		++i;
		idx = id.replace("_ctl01", "_ctl"+ paddedIndex(i));
		aElem = document.getElementById(idx);

		if (aElem) {
			var oldSrc = aElem.getAttribute("href");
			var newSrc = redirectToKarttapaikka(oldSrc);
			aElem.setAttribute("href", newSrc);
		}
		else {
			break;
		}	
	}
};

fixLinks("ctl00_ContentBody_Waypoints_Waypoints_ctl01_uxMap");
fixLinks("ctl00_ContentBody_WaypointList_Waypoints_ctl01_uxMap");

// EOF