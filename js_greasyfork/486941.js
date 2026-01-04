// ==UserScript==
// @name         Plex web album and artist name swap
// @namespace    http://tampermonkey.net/
// @version      2024-02.6
// @description  Swaps the album and artist names so the album name is on top
// @author       frondonson
// @license      MIT

// @match        https://app.plex.tv/desktop/*
// @match        http://192.168.1.72:32400/web/*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=plex.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486941/Plex%20web%20album%20and%20artist%20name%20swap.user.js
// @updateURL https://update.greasyfork.org/scripts/486941/Plex%20web%20album%20and%20artist%20name%20swap.meta.js
// ==/UserScript==


//Dead simple version to just check every poster and only switch cards where the poster has a 1:1 aspect ratio
//  since plex treats all media libraries and types the same 
//Fixes album names on every tab but is more crude and less performant
setInterval(scanForCards, 100);
function scanForCards()
{	
	let mediaCards = document.querySelectorAll('div[data-testid="cellItem"]:not(.SwapAlbumNameUserScript-swapped):not(.SwapAlbumNameUserScript-checked)');
	
	doSwaps(mediaCards);
	
	let albumPageNameDiv = document.querySelector('div[data-testid="metadata-top-level-items"]>div:first-child>div:first-child:not(.SwapAlbumNameUserScript-swapped)');
	swapAlbumPage(albumPageNameDiv);
}

function doSwaps(nodeList)
{
	for (const albumDiv of nodeList) 
	{
		//Reject non-albums, playlists and artists
		let poster = albumDiv.querySelector('.MetadataPosterListItem-card-BfbXw7.PosterCard-card-BRB1k_')
		if(poster==null || poster.clientHeight != poster.clientWidth)
		{ 
			albumDiv.classList.add('SwapAlbumNameUserScript-checked');
			continue; 
		}
		if(albumDiv.childElementCount < 3 || albumDiv.children[2].nodeName == ('SPAN'))
		{ continue; }
		if(albumDiv.classList.contains('SwapAlbumNameUserScript-swapped'))
		{ continue; }
		
		let artistNode = albumDiv.children[1];
		//Classlist- MetadataPosterCardTitle-centeredSingleLineTitle-EuZHlc MetadataPosterCardTitle-singleLineTitle-lPd1B2 MetadataPosterCardTitle-title-ImAmGu Link-default-bdWb1S Link-isHrefLink-nk7Aiq
		let albumNode = albumDiv.children[2];
		//Classlist- MetadataPosterCardTitle-centeredSingleLineTitle-EuZHlc MetadataPosterCardTitle-singleLineTitle-lPd1B2 MetadataPosterCardTitle-title-ImAmGu MetadataPosterCardTitle-isSecondary-gGuBpd Link-default-bdWb1S Link-isHrefLink-nk7Aiq
		
		artistNode.classList.add('MetadataPosterCardTitle-isSecondary-gGuBpd');
		albumNode.classList.remove('MetadataPosterCardTitle-isSecondary-gGuBpd');
		
		//Swap positions - (x, y) insert node X before node Y
		albumDiv.insertBefore(albumNode, artistNode);
		
		albumDiv.classList.add('SwapAlbumNameUserScript-swapped');
	}
	
}

function swapAlbumPage(parDiv)
{
	if(parDiv == null)
	{ return; }
	
	
	let artistInfoHeader = parDiv.children[0];
	//ineka90 ineka9w ineka96 _1duebfh2m _1duebfh2i _1duebfhfq _1duebfhfn
	
	let albumInfoHeader = parDiv.children[1];
	//ineka90 ineka9v ineka97 _1duebfh2m _1duebfh2i _1duebfhfq _1duebfhfn
	
	
	//Copy info from the artist h1 (1st child)
	const newBottomHeader = document.createElement('h2');
	newBottomHeader.innerHTML = artistInfoHeader.innerHTML;
	Array.from(albumInfoHeader.attributes).forEach( attr => {
		newBottomHeader.setAttribute(attr.nodeName, attr.nodeValue);
	});
	newBottomHeader.classList.remove('ineka9w');
	newBottomHeader.classList.remove('ineka96');
	newBottomHeader.classList.add('ineka9v');
	newBottomHeader.classList.add('ineka97');
	
	//Copy the info from the album title h2 (2nd child)
	const newTopHeader = document.createElement('h1');
	newTopHeader.innerHTML = albumInfoHeader.innerHTML;
	Array.from(artistInfoHeader.attributes).forEach( attr => {
		newTopHeader.setAttribute(attr.nodeName, attr.nodeValue);
	});
	newTopHeader.classList.remove('ineka9v');
	newTopHeader.classList.remove('ineka97');
	newTopHeader.classList.add('ineka9w');
	newTopHeader.classList.add('ineka96');
	
	
	parDiv.replaceChild(newTopHeader, artistInfoHeader); //(X, Y) replace Y with X
	parDiv.replaceChild(newBottomHeader, albumInfoHeader);
	
	parDiv.classList.add('SwapAlbumNameUserScript-swapped');	
}



