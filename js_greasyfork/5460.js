// picMF.user.js
//
// Written by: Michael Devore
// Released to the public domain
//
// This is a Greasemonkey script.
// See http://www.greasespot.net/ for more information on Greasemonkey.
//
// ==UserScript==
// @name			picMF
// @namespace		http://www.devoresoftware.com/gm/picMF
// @description		show MetaFilter profile pictures next to names in posts and comments
// @match			https://*.metafilter.com/*
// @match			http://*.metafilter.com/*
// @grant           GM_xmlhttpRequest
// @run-at document-end
// @version 2.0
// @downloadURL https://update.greasyfork.org/scripts/5460/picMF.user.js
// @updateURL https://update.greasyfork.org/scripts/5460/picMF.meta.js
// ==/UserScript==
//

"use strict";

var theWidth = "64px";
var theHeight = "64px";
var zoomWidth = "256px";
var zoomHeight = "256px";
var secondsToLoad = 1.4;
var serverPrefix = "//s3-us-west-2.amazonaws.com/mefi.profile/";
var noPicLink = "data:image/png;base64,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";

function onLoaded()
{
//	var xpath = "//DIV/SPAN[starts-with(text(),'posted by') and (@class='smallcopy' or @class='smallcopy postbyline' or @class='smallcopy byline')]";
	var xpath = "//DIV/SPAN[starts-with(text(),'posted by') and contains(@class, 'smallcopy')]";
	var postNodes = document.evaluate(
		xpath,
		document,
		null,
		XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
		null
	);
	var total = postNodes.snapshotLength;
	for (var i = 0; i < total; i++)
	{
		// not much validation here, cuts performance overhead by avoiding extra tests against the nodes
		// tighten it down later if it conflicts with other add-ons or Metafilter bling
		var userSpan = postNodes.snapshotItem(i);
		var currentNode = userSpan.firstChild;
		var found = false;
		var userLink;
		var linkNode;
		while (currentNode && !found)
		{
			if (currentNode.nodeName === "A")
			{
				var href_value = currentNode.getAttribute('href');
				var result = href_value.match(/\/user\/(\d+)/);
				if (result && result[1])
				{
					var userNumber = result[1];
					var serverLink = serverPrefix+userNumber+".jpg";
					var img = document.createElement("img");
					img.setAttribute("src", serverLink);
					setTimeout(function(x, y)
						{
							return function() 
							{
								if (x.height <= 0)
								{
									x.setAttribute("src", noPicLink);
								}

								x.setAttribute("height", theHeight);
								x.setAttribute("width", theWidth);
//								y.insertBefore(document.createTextNode(" "), y.firstChild);
//								y.insertBefore(x, y.firstChild);
								y.parentNode.insertBefore(document.createTextNode(" "), y.parentNode.firstChild);
								y.parentNode.insertBefore(x, y.parentNode.firstChild);
								x.addEventListener('mouseover', picHover, false);
								x.addEventListener('mouseout', picRestore, false);
							}; 
						}(img, currentNode), secondsToLoad * 1000);
					break;
				}
			}
			currentNode = currentNode.nextSibling;
		}
	}
}

function picHover(evt)
{
	var picNode = evt['target'];
	picNode.setAttribute("height", zoomHeight);
	picNode.setAttribute("width", zoomWidth);
}

function picRestore(evt)
{
	var picNode = evt['target'];
	picNode.setAttribute("height", theHeight);
	picNode.setAttribute("width", theWidth);
}

document.addEventListener('DOMContentLoaded',onLoaded,true);
