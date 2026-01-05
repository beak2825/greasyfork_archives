// ==UserScript==
// @name           Unlimited Paginator Works
// @namespace      https://greasyfork.org/scripts/5250
// @description    Makes any(?) page with a paginator on various Danbooru clones "bottomless"--blend pages together or separate each with a paginator.
// @include        *://behoimi.org/*
// @include        *://www.behoimi.org/*
// @include        *://*.donmai.us/*
// @include        *://konachan.tld/*
// @include        *://yande.re/*
// @version        2022.06.25
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/5250/Unlimited%20Paginator%20Works.user.js
// @updateURL https://update.greasyfork.org/scripts/5250/Unlimited%20Paginator%20Works.meta.js
// ==/UserScript==

//If true, each added page retains its paginator.  If false, elements are smoothly joined together.
var pageBreak = false;

//Minimum amount of window left to scroll, maintained by loading more pages.
var scrollBuffer = 600;

//Time (in ms) the script will wait for a response from the next page before attempting to fetch the page again.  If the script gets trapped in a loop trying to load the next page, increase this value.
var timeToFailure = 15000;

//============================================================================
//=========================Script initialization==============================
//============================================================================

var nextPage, mainTable, mainParent, pending, timeout, iframe;

if( typeof(customF) != "undefined" )
	customF();

initialize();
function initialize()
{
	//Stop if inside an iframe
	if( window != window.top || scrollBuffer == 0 )
		return;
	
	//Stop if no "table"
	mainTable = getMainTable(document);
	if( !mainTable )
    {
        //console.log("UPW: No main table");
		return;
    }
    
	//Stop if no paginator
	var paginator = getPaginator(document);
	if( !paginator )
    {
        //console.log("UPW: No paginator found");
		return;
    }
    
	//Stop if no more pages
	nextPage = getNextPage(paginator);
	if( !nextPage )
		return;
	
	//Hide the blacklist sidebar, since this script breaks the tag totals and post unhiding.
	var sidebar = document.getElementById("blacklisted-sidebar");
	if( sidebar )
		sidebar.style.display = "none";

	//Other important variables:
	scrollBuffer += window.innerHeight;
	mainParent = mainTable.parentNode;
	pending = false;
	
	iframe = document.createElement("iframe");
	iframe.width = iframe.height = 0;
	iframe.style.visibility = "hidden";
	document.body.appendChild(iframe);

    //Slight delay so that Danbooru's initialize_edit_links() has time to hide all the edit boxes on the Comment index
    iframe.addEventListener("load", function(e){ setTimeout( appendNewContent, 100 ); }, false);
    
	//Stop if empty page
	if( /<p>(Nothing to display.|Nobody here but us chickens!)<.p>/.test(mainTable.innerHTML) )
		return;

	//Add copy of paginator to the top
	mainParent.insertBefore( paginator.cloneNode(true), mainParent.firstChild );

	if( !pageBreak )
		paginator.style.display = "none";//Hide bottom paginator
	else
	{
		//Reposition bottom paginator and add horizontal break
		mainTable.parentNode.insertBefore( document.createElement("hr"), mainTable.nextSibling );
		mainTable.parentNode.insertBefore( paginator, mainTable.nextSibling );
	}
	
	//Listen for scroll events
	window.addEventListener("scroll", testScrollPosition, false);
	testScrollPosition();
}

//============================================================================
//============================Script functions================================
//============================================================================

//Some pages match multiple "tables", so order is important.
function getMainTable(source)
{
	var xpath =
	[
		 ".//div[contains(@class,'posts-container') or contains(@class,'media-assets-container')]"   // Danbooru (posts, ai_tags, uploads)
		,".//div[@id='a-index']/table[not(contains(@class,'search'))]"	// Danbooru (/forum_topics, ...), take care that this doesn't catch comments containing tables
		,".//div[@id='a-index']"						// Danbooru (/comments, ...)
		
		,".//table[contains(@class,'highlight')]"		// large number of pages
		,".//div[contains(@id,'comment-list')]/div/.."	// comment index
		,".//*[not(contains(@id,'popular'))]/span[contains(@class,'thumb')]/a/../.."	// post/index, pool/show, note/index
		,".//li/div/a[contains(@class,'thumb')]/../../.."	// post/index, note/index
		,".//div[@id='content']//table/tbody/tr[contains(@class,'even')]/../.."	// user/index, wiki/history
		,".//div[@id='content']/div/table"				// 3dbooru user records
		,".//div[@id='forum']"							// forum/show
	];
	
	for( var i = 0; i < xpath.length; i++ )
	{
		getMainTable = (function(query){ return function(source)
		{
			return new XPathEvaluator().evaluate(query, source, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		}; })( xpath[i] );
		
		var result = getMainTable(source);
		if( result )
		{
			//console.log("UPW main table: "+xpath[i]+"\n\n"+location.pathname);
			return result;
		}
	}
	
	return null;
}

function getPaginator( source )
{
	var pager = new XPathEvaluator().evaluate("descendant-or-self::div[@id='paginator' or contains(@class,'paginator') or @id='paginater']", source, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	
	// Need clear:none to prevent the 2nd page from being pushed to below the sidebar on the Post index... but we don't want this when viewing a specific pool,
	// because then the paginator is shoved to the right of the last images on a page.  Other sites have issues with clear:none as well, like //yande.re/post.
	if( pager && location.host.indexOf("donmai.") >= 0 && document.getElementById("sidebar") )
		pager.style.clear = "none";
	
	return pager;
}

function getNextPage( source )
{
	let page = getPaginator(source);
	if( page )
		page = new XPathEvaluator().evaluate(".//a[@alt='next' or @rel='next' or contains(text(),'>') or contains(text(),'Next')]", page, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
	return( page && page.href );
}

function testScrollPosition()
{
	if( !nextPage )
		testScrollPosition = function(){};
	
	//Take the max of the two heights for browser compatibility
	else if( !pending && window.pageYOffset + scrollBuffer > Math.max( document.documentElement.scrollHeight, document.documentElement.offsetHeight ) )
	{
		pending = true;
		timeout = setTimeout( function(){pending=false;testScrollPosition();}, timeToFailure );
		iframe.contentDocument.location.replace(nextPage);
	}
}

function appendNewContent()
{
	//Make sure page is correct.  Using 'indexOf' instead of '!=' because links like "https://danbooru.donmai.us/pools?page=2&search%5Border%5D=" become "https://danbooru.donmai.us/pools?page=2" in the iframe href.
	clearTimeout(timeout);
	if( nextPage.indexOf(iframe.contentDocument.location.href) < 0 )
	{
		setTimeout( function(){ pending = false; }, 1000 );
		return;
	}
    
	//Copy content from retrived page to current page, but leave off certain headers, labels, etc...
    var sourcePaginator = document.adoptNode( getPaginator(iframe.contentDocument) );
	var nextElem, deleteMe, source = document.adoptNode( getMainTable(iframe.contentDocument) );
	
	if( /<p>(Nothing to display.|Nobody here but us chickens!)<.p>/.test(source.innerHTML) )
		nextPage = null;
	else
	{
		nextPage = getNextPage(sourcePaginator);

		if( pageBreak )
			mainParent.appendChild(source);
		else
		{
			//Hide elements separating one table from the next (h1 is used for user names on comment index)
			var rems = source.querySelectorAll("h2, h3, h4, thead, tfood");
			for( var i = 0; i < rems.length; i++ )
				rems[i].style.display = "none";
			
			//Move contents of next table into current one
			var fragment = document.createDocumentFragment();
			while( (nextElem = source.firstChild) )
				fragment.appendChild(nextElem);
			mainTable.appendChild(fragment);
		}
	}

	//Add the paginator at the bottom if needed.
	if( !nextPage || pageBreak )
		mainParent.appendChild( sourcePaginator );
	if( pageBreak && nextPage )
		mainParent.appendChild( document.createElement("hr") );
	
	//Clear the pending request marker and check position again
	pending = false;
	testScrollPosition();
}

// I am the code of my script.
// HTML is my body, and JavaScript is my blood.
// I have incorporated over a thousand paginators.
// Unaware of loss.
// Nor aware of gain.
// Withstood boredom to include many pages,
// Striving for the script's completion.
// I have no regrets, this is the only path.
// My whole life was "Unlimited Paginator Works."
