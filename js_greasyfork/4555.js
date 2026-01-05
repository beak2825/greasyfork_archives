// ==UserScript==
// @name           Pixiv Direct Links
// @namespace      https://greasyfork.org/scripts/4555
// @description    Turns thumbnail titles into direct links and disables lazy-loading on ranking pages.
// @include        *://www.pixiv.net/*
// @grant          none
// @version        2019.10.13
// @downloadURL https://update.greasyfork.org/scripts/4555/Pixiv%20Direct%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/4555/Pixiv%20Direct%20Links.meta.js
// ==/UserScript==

//Disable lazy loading images.  These appear on ranking pages and the "Recommended" section of the bookmarks page.
var dontSayLazy = true;

//----------------------------------------------------------------//

if( window == window.top )//not inside iframe
{
    //Link dem titles.
    linkThumbTitles(document);
    new MutationObserver( function(mutationSet)
    {
        mutationSet.forEach( function(mutation)
        {
            for( let i = 0; i < mutation.addedNodes.length; i++ )
                if( mutation.addedNodes[i].nodeType == Node.ELEMENT_NODE )
                    linkThumbTitles( mutation.addedNodes[i] );
        } );
    }).observe( document.body, { childList:true, subtree:true } );

    if( dontSayLazy && unlazyImage() )
    {
        //Initial page has lazy images; listen for more images added later
        new MutationObserver( function(mutationSet)
        {
            mutationSet.forEach( function(mutation)
            {
                for( let i = 0; i < mutation.addedNodes; i++ )
                    if( mutation.addedNodes[i].nodeType == Node.ELEMENT_NODE )
                        unlazyImage( mutation.addedNodes[i] );
            } );
        }).observe( document.body, { childList:true, subtree:true } );
    }
}

//----------------------------------------------------------------//

function unlazyImage(target)
{
	let images = ( target || document ).querySelectorAll("img[data-src]");
	for( let i = 0; i < images.length; i++ )
		images[i].src = images[i].getAttribute("data-src");
	return images.length;
}

function linkThumbTitles(target)
{
    //bookmark_new_illust.php, discovery, search.php
    let foundTitle = target.querySelectorAll("li a[href*='/artworks/'][title]");
    for( let j = 0; j < foundTitle.length; j++ )
        directLinkSingle( foundTitle[j] );
    
    //member.php, member_illust.php, new_illust.php, artworks (related works)
    foundTitle = target.querySelectorAll("li > div > a[href*='/artworks/']");
    for( let j = 0; j < foundTitle.length; j++ )
        directLinkSingle( foundTitle[j] );
    
    //main page
    foundTitle = target.querySelectorAll("li > a[href*='/artworks/'] > .title");
    for( let j = 0; j < foundTitle.length; j++ )
        directLinkSingle( foundTitle[j].parentNode );
    
    //bookmark.php
    foundTitle = target.querySelectorAll("li > a[href*='mode=medium'][href*='illust_id='] > .title");
    for( let j = 0; j < foundTitle.length; j++ )
        directLinkSingle( foundTitle[j].parentNode );

    //ranking.php
    foundTitle = target.querySelectorAll("a.title[href*='/artworks/']");
    for( let j = 0; j < foundTitle.length; j++ )
        directLinkSingle( foundTitle[j] );
    
    //response.php
    let image = target.querySelectorAll("li a[href*='mode=medium'][href*='illust_id='] img");
    for( let j = 0; j < image.length; j++ )
    {
        let page, title;
        for( page = image[j].parentNode; page.tagName != "A"; page = page.parentNode );

        //The prev/next thumbnails on mode=medium pages have text before/after the image.  Text also follows the image on image responses listings.
        if( !(title = page.getElementsByClassName("title")[0]) && (title = page.lastChild).nodeName != '#text' && (title = page.firstChild).nodeName != '#text' )
            continue;//Can't find title element

        //Start title link at mode=medium and change later.
        let titleLink = document.createElement("a");
        titleLink.href = page.href;
        titleLink.style.color = "#333333";//Style used on some pages

        //Move the title out of the thumbnail link
        page.removeChild(title);
        titleLink.appendChild(title);
        page.parentNode.insertBefore( titleLink, page.nextSibling );

        directLinkSingle( titleLink );
    }
}

function directLinkSingle(titleLink)
{
	let illustID;
	if( !titleLink || !titleLink.href )
		return;
    if( !(illustID = titleLink.href.match(/\/artworks\/(\d+)/)) && !(illustID = titleLink.href.match(/illust_id=(\d+)/)) )
        return;
    
	let req = new XMLHttpRequest();
	req.open( "GET", location.protocol+"//www.pixiv.net/artworks/"+illustID[1], true );
	req.onload = function()
	{
        let scripts = req.responseXML.head.getElementsByTagName("script");
        for( let i = 0; i < scripts.length; i++ )
        {
            //JSON requires double quotes around property names, forbids trailing commas, etc...  The illust info can't be simply parsed as a raw JSON object, so just grab the values we need.
            let originalURL = scripts[i].textContent.match(/"original":"(http[^"]+)"/);
            if( !originalURL )
                continue;
            
            //Do nothing for ugoira (animated) images
            if( originalURL.indexOf("ugoira") > 0 )
                return;
            
            //There are several pageCount properties; we just want the last one.
            let pageCount = 0, rCount = RegExp( '"pageCount": *(\\d+)', 'g' ), search;
            while( (search = rCount.exec( scripts[i].textContent )) !== null )
                pageCount = parseInt(search[1]);

            //Only link single images
            if( pageCount <= 1 )
                titleLink.href = originalURL[1].replace(/\\\//g,'/');

            return;
        }
        //console.log("Unable to find direct image link for illust #"+illustID[1]);
	};
	req.responseType = "document";
	req.send(null);
}
