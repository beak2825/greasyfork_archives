// ==UserScript==
// @name         Pixiv Image Searches and Stuff
// @namespace    https://greasyfork.org/scripts/4296
// @description  Searches Danbooru for pixiv IDs, adds IQDB image search links
// @include      *://www.pixiv.net/*
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @version      2018.02.01
// @downloadURL https://update.greasyfork.org/scripts/4296/Pixiv%20Image%20Searches%20and%20Stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/4296/Pixiv%20Image%20Searches%20and%20Stuff.meta.js
// ==/UserScript==

var iqdbURL = "";//Replace with "http://danbooru.iqdb.org/?url=" (Danbooru) or "http://iqdb.org/?url=" (multi-service) to add IQDB search links (replaces bookmark counts)
var addSourceSearch = true;//Danbooru post search (looks for matching pixiv IDs); **Requires GM_xmlhttpRequest**
var danbooruBase = "http://danbooru.donmai.us";//Base URL to use when linking to or querying Danbooru

//Source search options
var danbooruLogin = "";//username
var danbooruApiKey = "";//api key as listed on your profile
var styleSourceFound = "color:green; font-weight: bold;";
var styleSourceMissing = "color:red;";
var sourceTimeout = 20;//seconds to wait before retrying query
var maxAttempts = 10;//# of times to try a query before completely giving up on source searches

//////////////////////////////////////////////////////////////////////////////////////

var anyBookmarks = false, favList = [], jsonData = [];

if( typeof(custom) != "undefined" )
	custom();

if( iqdbURL )
    try{ jsonData = JSON.parse( document.querySelector("[id*='js-'][data-items]").getAttribute("data-items") ); }catch(e) {}

//Source search requires GM_xmlhttpRequest()
if( addSourceSearch && typeof(GM_xmlhttpRequest) == "undefined" )
	addSourceSearch = false;

//Manga images have to be handled specially
if( location.search.indexOf("mode=manga") >= 0 )
{
	let searchID = addSourceSearch && location.search.match(/illust_id=(\d+)/);
	if( searchID )
	{
		function linkManga(stuff)
		{
			let thumbList = [], images = stuff.querySelectorAll(".item-container img");
			for( let i = 0; i < images.length; i++ )
				thumbList.push({ link: images[i].parentNode.appendChild( document.createElement("div") ).appendChild( document.createElement("a") ), pixiv_id: searchID[1], page: i });
			sourceSearch( thumbList );
			return thumbList.length;
		}
		
		if( !linkManga( document ) )
		{
			//Normal manga images not found; set up a mutation observer in case a certain other script executes after this one and adds them.
			new MutationObserver( function(mutationSet)
			{
				mutationSet.forEach( function(mutation)
				{
					for( let x = 0; x < mutation.addedNodes.length; x++ )
						linkManga( mutation.addedNodes[x] );
				} );
			}).observe( document.body, { childList:true, subtree:true } );
		}
	}
}
else if( window == window.top )//Don't run if inside an iframe
{
    if( typeof(GM_deleteValue) != "undefined" )
        GM_deleteValue("minFavs");
	
	//Prevent added links sometimes being hidden for thumbnails with long titles
	let style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = 'li.image-item{ height:auto !important; overflow:visible !important; padding:5px 0px !important } ';
	document.getElementsByTagName('head')[0].appendChild(style);

	processThumbs( [document] );

	//Monitor for changes caused by other scripts
	new MutationObserver( function(mutationSet)
	{
		mutationSet.forEach( function(mutation){ processThumbs( mutation.addedNodes ); } );
	}).observe( document.body, { childList:true, subtree:true } );
}

//====================================== Functions ======================================

function processThumbs(target)
{
    //Take care not to match on profile images, like those shown in the "Following" box on user profiles...
    var xPattern = [ "descendant-or-self::li/a[contains(@href,'mode=medium')]//img[not(@pisas)]",//member_illust.php, response.php, bookmark.php, new_illust.php, member.php...
                     "descendant-or-self::div/figure/div/a/div[contains(@class,'lazy') and not(span) and not(@pisas)]",//search.php, bookmark_new_illust.php -- "contains(@class,'lazy')" prevents double matching on ugoira
                     "descendant-or-self::div/a[contains(@href,'mode=medium')]//img[not(@pisas)]",//response.php (image being responded to), front page, ranking.php
                     "descendant-or-self::div[@class='works_display']//a[contains(@href,'mode=ugoira_view') and not(@pisas)]", //member_illust.php (ugoira image)
                     "descendant-or-self::div[@class='works_display']/a//img[not(@pisas)]"//member_illust.php (single image)

                    //"descendant-or-self::div[@class='works_display']/div/img[not(@pisas)]"
                    //"descendant-or-self::li[@class='image-item']/a//img[not(@pisas)]",//bad hits on front page
                    //"descendant-or-self::section/a[contains(@href,'mode=medium')]//img[not(@pisas)]"
                   ];

	let thumbSearch = [], thumbList = [];
	
	//Combine the results over all targets to minimize queries by source search
	for( let i = 0; i < target.length; i++ )
	{
        for( let j = 0; j < xPattern.length; j++ )
        {
            let xSearch = document.evaluate( xPattern[j], target[i], null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            if( xSearch.snapshotLength > 0 )
            {
                for( let k = 0; k < xSearch.snapshotLength; k++ )
                {
                    (thumbSearch[thumbSearch.length] = xSearch.snapshotItem(k)).setAttribute("pisas","done");
                    //console.debug( pixivIllustID( xSearch.snapshotItem(k).src ) );
                }
                //console.debug( "PISAS - "+xSearch.snapshotLength+" hit(s) for xPattern["+j+"]: "+xPattern[j] );
            }
        }
	}
	
	for( let i = 0; i < thumbSearch.length; i++ )
	{
		let thumbCont, thumbPage = null, thumbImg = thumbSearch[i];
		
		for( thumbCont = thumbImg.parentNode; !thumbCont.classList.contains("works_display"); thumbCont = thumbCont.parentNode )
			if( thumbCont.tagName == "A" )
			{
				thumbPage = thumbCont;
				thumbCont = thumbPage.parentNode;
                if( thumbCont.parentNode.tagName == "FIGURE" )
                    thumbCont = thumbCont.parentNode.parentNode;//search.php
				break;
			}
		
		let bookmarkCount = 0, bookmarkLink = thumbCont.querySelector("a[href*='bookmark_detail.php']");
		let sourceContainer = thumbCont;

		if( thumbImg.tagName == "IMG" )
		{
			//Disable lazy loading
			if( thumbImg.getAttribute("data-src") )
				thumbImg.src = thumbImg.getAttribute("data-src");
			
			//Skip generic restricted thumbs
			if( thumbImg.src.indexOf("//source.pixiv.net/") >= 0 )
				continue;
			
			//Skip special thumbs except on image pages (daily rankings on main page, ...)
			if( location.search.indexOf("mode=") < 0 && thumbPage && ( thumbImg.src.indexOf("_100.") > 0 || thumbPage.href.indexOf("_ranking") > 0 ) )
				continue;
		}

		if( bookmarkLink )
		{
			//Thumb has bookmark info
			bookmarkCount = parseInt( bookmarkLink.getAttribute("data-tooltip","x").replace(/([^\d]+)/g,'') ) || 1;
			sourceContainer = bookmarkLink.parentNode;
		}
		else if( iqdbURL )
		{
			//Thumb doesn't have bookmark info.  Add a fake bookmark link to link with the IQDB.
			bookmarkLink = document.createElement("a");
			bookmarkLink.className = "bookmark-count";
			if( anyBookmarks )
			{
				bookmarkLink.className += " ui-tooltip";
				bookmarkLink.setAttribute("data-tooltip", "0 bookmarks");
			}
			
			//Dummy div to force new line when needed
			thumbCont.appendChild( document.createElement("div") );
			thumbCont.appendChild( bookmarkLink );
		}
		else
		{
			//Dummy div to force new line when needed
			thumbCont.appendChild( document.createElement("div") );
		}

		if( anyBookmarks )
		{
			favList.push({ thumb: thumbCont, favcount: bookmarkCount });
		}

        if( iqdbURL )
        {
            //For search.php: Check the JSON data to get the thumb URLs.
            let directURL = thumbImg.src || thumbImg.style.backgroundImage.replace(/.*(http[^"]+).*/,'$1');
            if( !directURL )
            {
                let pid = pixivIllustID( thumbPage.href );
                for( let j = 0; j < jsonData.length; j++ )
                    if( pid == jsonData[j].illustId )
                    {
                        directURL = jsonData[j].url;
                        break;
                    }
            }
            if( directURL )
            {
                bookmarkLink.href = iqdbURL+directURL+(thumbPage ? "&fullimage="+thumbPage.href : "");
                bookmarkLink.innerHTML = "(IQDB)";
            }
        }

		if( addSourceSearch && ( !thumbImg.src || thumbImg.src.indexOf("/novel/") < 0 ) && pixivIllustID( thumbImg.src || thumbImg.href || thumbPage.href ) )
		{
			sourceContainer.appendChild( document.createTextNode(" ") );
			thumbList.push({ link: sourceContainer.appendChild( document.createElement("a") ), pixiv_id: pixivIllustID( thumbImg.src || thumbImg.href || thumbPage.href ), page: -1 });
		}
	}
	
	sourceSearch( thumbList );
}

function pixivIllustID(url)
{
    try{
        return ( url.match(/\/(\d+)(_|\.)[^\/]+$/) || url.match(/illust_id=(\d+)/) )[1];
    }catch(e){
        console.warn("PISAS - pixivIllustID(): Unable to parse ID from URL - " + url);
        return 0;
    }
}

function pixivPageNumber(url)
{
    try{
        return url.match(/_p(\d+)(_master\d+)?\./)[1];
    }catch(e){
        return "x";
    }
}

function sourceSearch( thumbList, attempt, page )
{
	//thumbList[index] = { link, id, page? }
	
	if( page === undefined )
	{
		//First call.  Finish initialization
		attempt = page = 1;
		
		for( let i = 0; i < thumbList.length; i++ )
		{
			if( !thumbList[i].status )
				thumbList[i].status = thumbList[i].link.parentNode.appendChild( document.createElement("span") );
			thumbList[i].link.textContent = "Searching...";
			thumbList[i].posts = [];
		}
	}
	
	if( attempt >= maxAttempts )
	{
		//Too many failures (or Downbooru); give up. :(
		for( let i = 0; i < thumbList.length; i++ )
		{
			thumbList[i].status.style.display = "none";
			if( thumbList[i].link.textContent[0] != '(' )
				thumbList[i].link.textContent = "(error)";
			thumbList[i].link.setAttribute("style","color:blue; font-weight: bold;");
		}
		return;
	}
	
	//Is there actually anything to process?
	if( thumbList.length == 0 )
		return;
	
	//Retry this call if timeout
	var retry = (function(a,b,c){ return function(){ setTimeout( function(){ sourceSearch(a,b,c); }, maxAttempts == 0 ? 0 : 1000 ); }; })( thumbList, attempt + 1, page );
	var sourceTimer = setTimeout( retry, sourceTimeout*1000 );
	
	var idList = [];
	for( let i = 0; i < thumbList.length; i++ )
	{
		thumbList[i].status.textContent = " ["+attempt+"]";
		if( idList.indexOf( thumbList[i].pixiv_id ) < 0 )
			idList.push( thumbList[i].pixiv_id );
	}
	
	GM_xmlhttpRequest(
	{
		method: "GET",
		url: danbooruBase+'/posts.json?limit=100&tags=status:any+pixiv:'+idList.join()+'&login='+danbooruLogin+'&api_key='+danbooruApiKey+'&page='+page,
		onload: function(responseDetails)
		{
			clearTimeout(sourceTimer);
			
			//Check server response for errors
			let result = false, status = null;
			
			if( /^ *$/.test(responseDetails.responseText) )
				status = "(error)";//No content
			else if( responseDetails.responseText.indexOf("<title>Downbooru</title>") > 0 )
			{
				addSourceSearch = maxAttempts = 0;//Give up
				status = "(Downbooru)";
			}
			else if( responseDetails.responseText.indexOf("<title>Failbooru</title>") > 0 )
				status = "(Failbooru)";
			else try
			{
				result = JSON.parse(responseDetails.responseText);
				if( result.success !== false )
					status = "Searching...";
				else
				{
					status = "(" + ( result.message || "error" ) + ")";
					addSourceSearch = maxAttempts = 0;//Give up
					result = false;
				}
			}
			catch(err) {
				result = false;
				status = "(parse error)";
			}
			
			//Update thumbnail messages
			for( let i = 0; i < thumbList.length; i++ )
				thumbList[i].link.textContent = status;
			
			if( result === false )
				return retry();//Hit an error; try again?
			
			for( let i = 0; i < thumbList.length; i++ )
			{
				//Collect the IDs of every post with the same pixiv_id/page as the pixiv image
				for( let j = 0; j < result.length; j++ )
					if( thumbList[i].pixiv_id == result[j].pixiv_id && thumbList[i].posts.indexOf( result[j].id ) < 0 && ( thumbList[i].page < 0 || thumbList[i].page == pixivPageNumber( result[j].source ) ) )
					{
						thumbList[i].link.title = result[j].tag_string+" user:"+result[j].uploader_name+" rating:"+result[j].rating+" score:"+result[j].score;
						thumbList[i].posts.push( result[j].id );
					}
				
				if( thumbList[i].posts.length == 1 )
				{
					//Found one post; link directly to it
					thumbList[i].link.textContent = "post #"+thumbList[i].posts[0];
					thumbList[i].link.href = danbooruBase+"/posts/"+thumbList[i].posts[0];
					thumbList[i].link.setAttribute("style",styleSourceFound);
				}
				else if( thumbList[i].posts.length > 1 )
				{
					//Found multiple posts; link to tag search
					thumbList[i].link.textContent = "("+thumbList[i].posts.length+" sources)";
					
					if( location.href.indexOf("mode=manga") > 0 )
						thumbList[i].link.href = danbooruBase+"/posts?tags=status:any+id:"+thumbList[i].posts;
					else
						thumbList[i].link.href = danbooruBase+"/posts?tags=status:any+pixiv:"+thumbList[i].pixiv_id;
					
					thumbList[i].link.setAttribute("style",styleSourceFound);
					thumbList[i].link.removeAttribute("title");
				}
			}
			
			if( result.length == 100 )
				sourceSearch( thumbList, attempt + 1, page + 1 );//Max results returned, so fetch the next page
			else for( let i = 0; i < thumbList.length; i++ )
			{
				//No more results will be forthcoming; hide the status counter and set the links for the images without any posts
				thumbList[i].status.style.display = "none";
				if( thumbList[i].posts.length == 0 )
				{
					thumbList[i].link.textContent = "(no sources)";
					thumbList[i].link.setAttribute("style",styleSourceMissing);
				}
			}
		},
		onerror: retry,
		onabort: retry
	});
}
