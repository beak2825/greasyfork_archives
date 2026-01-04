// ==UserScript==
// @name        Show All News
// @namespace   https://greasyfork.org/en/users/37676
// @description Show News From All Pages
// @include		/^https?:\/\/.*\.kompas\.com\/.*read\/.*$/
// @match       *://*.detik.com/*
// @exclude     *://*.detik.com/search*
// @match       *://*.tribunnews.com/*
// @match       *://*.grid.id/read/*
// @match       *://*.gridoto.com/read/*
// @match       *://*.inews.id/news/*
// @match       *://*.pikiran-rakyat.com/*
// @match       *://*.viva.co.id/*
// @match       *://*.jatimnetwork.com/*
// @run-at      document-start
// @version     1.1.2
// @grant       none
// @noframes
// @license     Creative Commons Attribution 4.0 International Public License; http://creativecommons.org/licenses/by/4.0/
// @downloadURL https://update.greasyfork.org/scripts/406583/Show%20All%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/406583/Show%20All%20News.meta.js
// ==/UserScript==

var siteInfo = [
    ['kompas.com',[['page','all']],''],
    ['detik.com',[['page','all'],['single','1']],''],
	['tribunnews.com',[['page','all']],''],
	['grid.id',[['page','all']],''],
	['gridoto.com',[['page','all']],''],
    ['inews.id',[],'/all'],
	['pikiran-rakyat.com',[['page','all']],''],
	['viva.co.id',[['page','all']],''],
	['jatimnetwork.com',[['page','all']],''],
];

var siteHost = window.location.hostname;
var siteLength = siteInfo.length;
var siteIndex = -1;

for(var i = 0; i < siteLength; i++)
{
	if (siteHost.indexOf(siteInfo[i][0]) > -1)
	{
		siteIndex = i;
		break;
	}
}

if (siteIndex > -1)
{
	var link = new URL(window.location.href);
	var isRedirect = false;
	
	if (link)
	{
        var urlString = link.toString();
        var lastChar = urlString.charAt(urlString.length-1);

        if (lastChar == '/')
        link.href = urlString.substring(0, urlString.length-1);

        var urlParam = siteInfo[siteIndex][2];
		var arrayInfo = siteInfo[siteIndex][1];
		var infoLength = arrayInfo.length;

        if (urlParam)
        {
            urlString = link.toString();

            if (urlString.indexOf(urlParam) < 0)
            {
                link.href = urlString+urlParam;
                isRedirect = true;
            }
        }

		for(var i = 0; i < infoLength; i++)
		{
			var pageParam = link.searchParams.get(arrayInfo[i][0]);
			
			if (pageParam)
			{
				if (pageParam != arrayInfo[i][1])
				isRedirect = true;
			}
			
			else
			isRedirect = true;
			
			if (isRedirect)
			link.searchParams.set(arrayInfo[i][0], arrayInfo[i][1]);
		}

		if (isRedirect)
		window.location.replace(link.href);
	}
}
