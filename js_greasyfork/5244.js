// ==UserScript==
// @id             embedgeocachefi@kenmooda@gmail.com
// @name           Embed Geocache.fi
// @version        1.1
// @namespace      assankassa@gmail.com
// @author         Tommi Rautava
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @description    Embed cache info frame from Geocache.fi on a Geocaching.com cache page.
// @include        https://www.geocaching.com/seek/cache_details.aspx*
// @include        https://www.geocaching.com/geocache/*
// @grant          GM_xmlhttpRequest
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/5244/Embed%20Geocachefi.user.js
// @updateURL https://update.greasyfork.org/scripts/5244/Embed%20Geocachefi.meta.js
// ==/UserScript==
////////////////////////////////////////////////////////////////////////////////
//
//    Embed Geocache.fi
//    Copyright (C) 2011, 2013, 2016  Tommi Rautava
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
var gcCodeElem = document.getElementById('ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode');

if (gcCodeElem) {
    var gcCode = gcCodeElem.textContent;

    if (gcCode) {
        var downloadDivElem = document.getElementById('Download');

        if (downloadDivElem) {
            var refNode = document.evaluate("//div[@class='InformationWidget Clear']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (refNode) {
                var gcfiFrame = document.createElement("div");
                gcfiFrame.setAttribute('style', 'width:100%;max-height:200px;border:1px solid #b0b0b0;padding-bottom:1px;overflow-y:scroll;');
                refNode.parentNode.insertBefore(gcfiFrame, refNode.parentNode.firstChild);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://www.geocache.fi/caches/cachetieto.php?printpage=1&wp=" + gcCode,
                    onload: function(res) {
                        gcfiFrame.innerHTML = res.responseText.replace(/img src="\//g, 'img src="http://www.geocache.fi/');
                    }
                });
            } else {
                GM_log("Ref node not found.");
            }
        } else {
            GM_log("Download node not found.");
        }
    } else {
        GM_log("GC code not found.");
    }
} else {
    GM_log("GC code node not found.");
}

// EOF