// ==UserScript==
// @name           Endless Pixiv Pages
// @namespace      https://greasyfork.org/scripts/3254
// @include        *://www.pixiv.net/*
// @description    Loads more pixiv pages as you scroll down.
// @version        2018.01.28
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/3254/Endless%20Pixiv%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/3254/Endless%20Pixiv%20Pages.meta.js
// ==/UserScript==

var iframeLoader = false;//If true, force all pages to be loaded using a hidden iframe instead of XMLHttpRequest.
var scrollBuffer = 500;//Minimum height remaining to scroll before loading the next page.
var timeToFailure = 30;//Seconds to wait for a response from the next page before attempting to fetch the page again.

//////////////////////////////////////////////////////////////////////////////////////

var mainTable, bottomDoc, nextPage, timeout = 0, pending = false, totalPages = 0, loadAll = false, loadAllLink = null, itemsPerPage = 20;

//Hide the ad for pixiv premium inserted into the middle of tag search results; its thumbnails are broken in the loaded pages anyway.
var pStyle = document.createElement("style");
pStyle.innerHTML = "._premium-lead-popular-d-body{display:none !important}";
document.head.appendChild(pStyle);

if( window != window.top )
    ;//console.debug('Endless Pixiv Pages: Ignoring inner frame');
else if( !(mainTable = getMainTable(document)) )
    console.debug('Endless Pixiv Pages: No main table');
else if( !(bottomDoc = getBottomPager(document)) )
    console.debug('Endless Pixiv Pages: No bottom pager');
else if( !(nextPage = getNextPage(bottomDoc)) )
    console.debug('Endless Pixiv Pages: Next page not found in bottom pager');
else
{
	//Move bottom pager out of where additional content will be loaded
	bottomDoc.parentNode.removeChild(bottomDoc);
	mainTable.parentNode.parentNode.appendChild(bottomDoc);
	
	if( iframeLoader || (mainTable.id || "").indexOf("js-") == 0 )
	{
		//iframe to load pages; required for the 'js-' pages
        console.debug('Endless Pixiv Pages: Loading with iframe');
		iframeLoader = document.createElement("iframe");
		iframeLoader.addEventListener("load", function(){ processPage( iframeLoader.contentDocument ); }, false);
		iframeLoader.width = iframeLoader.height = 0;
		iframeLoader.style.visibility = "hidden";
		document.body.appendChild(iframeLoader);
	}
	else console.debug('Endless Pixiv Pages: Loading with XMLHttpRequest');

    //Calculate total number of items per page.  Only four page types seem to deviate from the default (20), though:
    //  48: https://www.pixiv.net/bookmark.php?id=...&type=user
    //  40: https://www.pixiv.net/search.php?...
    //  12: https://www.pixiv.net/novel/tags.php?...
    //  12: https://www.pixiv.net/group/search_group.php?...
    if( mainTable.parentNode.querySelector('[data-items]') )
        itemsPerPage = JSON.parse( mainTable.parentNode.querySelector('[data-items]').getAttribute('data-items').replace(/&quot;/g,'"') ).length;
    else if( mainTable.tagName == "UL" )
    {
        let i = 0;
        for( itemsPerPage = 0; i < mainTable.childNodes.length; i++ )
            if( mainTable.childNodes[i].tagName == "LI" )
                itemsPerPage++;
    }
    if( itemsPerPage <= 0 )
        itemsPerPage = 20;

    //console.debug('items per page = '+itemsPerPage);

	let resultBadge = document.querySelector(".count-badge");
	let resultMatcher = resultBadge && resultBadge.textContent.match(/^(\d+) *(.*)/);
	if( resultMatcher )
	{
		totalPages = Math.floor( ( parseInt(resultMatcher[1]) + itemsPerPage - 1 ) / itemsPerPage );
		resultBadge.textContent = resultMatcher[1]+" "+resultMatcher[2];//Making sure there's a space between the number and (if present) "results"
		if( totalPages > 1 )
		{
            resultBadge.textContent += " ("+totalPages+" pages)";
            loadAllLink = resultBadge.appendChild( document.createElement("a") );
            loadAllLink.style = 'margin-left:10px; cursor:pointer';
            loadAllLink.textContent = "Load All Pages";
            loadAllLink.onclick = function()
            {
                loadAll = !loadAll;
                loadAllLink.textContent = loadAll ? "Stop Loading Pages" : "Load All Pages";
                testScrollPosition();
            };
		}
	}
	
	//Adjust buffer height
	scrollBuffer += window.innerHeight;

	//Watch scrolling
	window.addEventListener("scroll", testScrollPosition, false);
	testScrollPosition();
}

function getMainTable(source)
{
	let result = null, tableFun =
	[
		//bookmark.php?type=user
		function(src){ src = src.getElementById("search-result"); return src ? src.getElementsByTagName("ul")[0] : null; },
		
		//search.php
		function(src){ return src.getElementById("js-react-search-mid"); },

        //bookmark_new_illust.php
        function(src){ return src.getElementById("js-mount-point-latest-following"); },

		//member_illust.php
        //bookmark.php (except type=user)
        //new_illust.php
		function(src){ src = src.getElementsByClassName("image-item")[0]; return src ? src.parentNode : null; },
		
		//novel/tags.php
        //group/search_group.php
		function(src){ return src.getElementsByClassName("autopagerize_page_element")[0]; },
		
		//search: users
		////function(src){ return src.getElementsByClassName("user-recommendation-items")[0]; },//issue with lazy-loading
		
		//response.php
		function(src){ return src.getElementsByClassName("linkStyleWorks")[0]; }//returning inner list element breaks page separation on https://www.pixiv.net/response.php?mode=all&id=...
	];
	
	for( let i = 0; i < tableFun.length; i++ )
	{
		getMainTable = tableFun[i];
		if( (result = getMainTable(source)) != null )
        {
            //console.debug('Endless Pixiv Pages: main['+i+']');
			return result;
        }
	}
	
	return null;
}

function getBottomPager(source)
{
	let result = null, pagerFun =
	[
		//most things
		function(src){ src = src.getElementsByClassName("pager-container"); return src.length ? src[src.length - 1].parentNode : null; },
		
		//image responses, bookmarked users
		function(src){ src = src.getElementsByClassName("_pager-complex"); return src.length ? src[src.length - 1] : null; }
	];
	
	for( let i = 0; i < pagerFun.length; i++ )
	{
		getBottomPager = pagerFun[i];
		if( (result = getBottomPager(source)) != null )
			return result;
	}
	
	return null;
}

function getNextPage(pager)
{
	let links = pager.getElementsByTagName("a");
	if( links.length == 0 || links[links.length-1].getAttribute("rel") != "next" )
		return null;//No more pages
	else if( links[links.length-1].href.indexOf("//www.pixiv.net/") < 0 )
		return location.protocol+"//www.pixiv.net/"+links[links.length-1].href;
	else
		return links[links.length-1].href;
}

function testScrollPosition()
{
	if( !pending && ( loadAll || window.pageYOffset + scrollBuffer > bottomDoc.offsetTop ) )
	{
		pending = true;
		timeout = setTimeout( function(){ pending = false; testScrollPosition(); }, timeToFailure*1000 );
		
		//If the page about to be loaded is the last, hide the "Load All Pages" link.
		if( loadAllLink && nextPage.replace(/.*(\?|&)p=([0-9]+).*/,'$2') == totalPages )
			loadAllLink.style.display = "none";
		
		if( iframeLoader )
        	iframeLoader.contentDocument.location.replace(nextPage);
        else
		{
			let xhr = new XMLHttpRequest();
			xhr.open( "GET", nextPage );
			xhr.onabort = xhr.onabort = xhr.onerror = function(){ clearTimeout(timeout); pending = false; };
			xhr.onload = function(){ processPage( xhr.responseXML ); };
			xhr.responseType = "document";
			xhr.send();
		}
	}
}

function processPage( newDoc )
{
	clearTimeout(timeout);
	
	let newTable = getMainTable(newDoc);
	
	//Make sure page loaded properly
	if( !newTable )
	{
		pending = false;
		return;
	}

	//Pixiv needs a little time to dynamically populate the 'main table' of tag searches, so if the table is empty, pause for a moment and try again.
	if( newTable.innerHTML.length == 0 )
	{
		setTimeout( function(){ processPage(newDoc); }, 100 );
		return;
	}

    //search.php and bookmark_new_illust.php store image info in JSON string and set the thumbnails as background images
    let rawItems = newTable.getAttribute("data-items") || ( newTable.nextElementSibling && newTable.nextElementSibling.getAttribute("data-items") );
    if( rawItems ) try
    {
        let lazyDivs = newTable.querySelectorAll('div > a > div.js-lazyload, div > a > div.lazyloaded');//Only actually expecting 'js-lazyload'; only the initial page uses 'lazyloaded'.
        let jsonItems = JSON.parse(rawItems);
        if( lazyDivs.length == jsonItems.length )
            for( let i = 0; i < lazyDivs.length; i++ )
                lazyDivs[i].style.backgroundImage = 'url("'+jsonItems[i].url+'")';
    } catch(e) {
        console.log('Endless Pixiv Pages - failed to parse raw items: '+e);
    }

	//Disable lazy loading to fix pages like /new_illust.php
	let image = newTable.getElementsByTagName("img");
	for( let i = 0; i < image.length; i++ )
	  if( image[i].getAttribute("data-src") )
        image[i].src = image[i].getAttribute("data-src");
	
	//Add page link
	mainTable.parentNode.appendChild( document.createElement("div") ).innerHTML = '<hr style="background-color:#e4e7ee; padding:10px;"><hr style = "margin:10px;"><a style="font-size:large; text-align:left; margin: 12px" href="'+nextPage+'">Page '+nextPage.replace(/.*(\?|&)p=([0-9]+).*/,'$2')+( totalPages > 0 ? " of "+totalPages : "")+'</a>';
	
	//Update the visible bottom paginator.
	let bottomPage = getBottomPager( newDoc );
	bottomDoc.innerHTML = bottomPage.innerHTML;
	
	//Append new page
	mainTable.parentNode.appendChild( document.adoptNode(newTable) );
	
	//Check for the next page, and disable the script if there isn't one.
	if( !(nextPage = getNextPage(bottomPage)) )
        mainTable.parentNode.appendChild( document.createElement("div") ).setAttribute("class","clear");
    else
	{
		pending = false;
		testScrollPosition();
	}
}

//So as I pray, Unlimited Pixiv Works.
