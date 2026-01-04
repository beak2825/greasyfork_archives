// ==UserScript==
// @name         Collapsible NextCloud Music
// @namespace    https://alzarath.dev/
// @description  Show/Collapse Artists and Albums in NextCloud's Music App
// @version      0.1.2
// @require      https://greasyfork.org/scripts/398990-waitforkeyelementsvanilla/code/waitForKeyElementsVanilla.js?version=785857
// @include      */apps/music*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/424726/Collapsible%20NextCloud%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/424726/Collapsible%20NextCloud%20Music.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* jshint multistr: true */

waitForKeyElements("#albums", generateGlobalCollapsers);
waitForKeyElements(".artist-area > h1", generateArtistCollapsers);
waitForKeyElements(".album-area > h2", generateAlbumCollapser);

// Add button and header CSS
var style=document.createElement('style');
style.type='text/css';
cssStyle = " \
	#app-header { \
		margin-top: 8px; \
	} \
	.collapser-button { \
	padding: 5px; \
	min-height: 20px; \
		height: 20px; \
		vertical-align: middle; \
		line-height: 0; \
	} \
	\
	.collapser-button.mini { \
		width: 20px; \
		margin-left: 4px; \
		margin-right: 4px; \
	} \
	.artist-header > button { \
		margin-bottom: 20px; \
	} \
	.album-header > button { \
		margin-bottom: 10px; \
	} \
	.artist-header { \
		height: 36px; \
		overflow: hidden; \
		text-overflow: ellipsis; \
		white-space: nowrap; \
	} \
	.album-header { \
		height: 30px; \overflow: hidden; \
		overflow: hidden; \
		text-overflow: ellipsis; \
		white-space: nowrap; \
	} \
	.artist-header > h1 { \
		display: inline; \
		width: max-content; \
		font-size: 34px; \
		line-height: 36px; \
	} \
	.album-header > h2 { \
		display: inline; \
		font-weight: bold; \
		font-size: 20px; \
		margin-bottom: 12px; \
		line-height: 30px; \
		color: var(--color-text-light); \
	} \
";

if (style.styleSheet) {
		style.styleSheet.cssText=cssStyle;
} else {
		style.appendChild(document.createTextNode(cssStyle));
}

document.getElementsByTagName('head')[0].appendChild(style);

/**
 * Generate a collapser for all artists and albums.
 * @param {Object} element The page's "albums" container
 */
function generateGlobalCollapsers(element) {
	// Create a new container for the app header
	var appHeader = document.createElement("div");
	appHeader.id = "app-header";
	
	// Create the Artists Collapser button
	var allArtistsCollapser = document.createElement("button");
	allArtistsCollapser.innerHTML = "COLLAPSE ALL ARTISTS";
	allArtistsCollapser.title = "COLLAPSE";
	allArtistsCollapser.classList.add("collapser-button");
	
	// Create the Albums Collapser button
	var allAlbumsCollapser = document.createElement("button");
	allAlbumsCollapser.innerHTML = "COLLAPSE ALL ALBUMS";
	allAlbumsCollapser.title = "COLLAPSE";
	allAlbumsCollapser.classList.add("collapser-button");
	
	// Cause the button to toggle the visibility of all artists
	allArtistsCollapser.addEventListener('click', toggleArtistsEvent);
	// Cause the button to toggle the visibility of all artists' child albums
	allAlbumsCollapser.addEventListener('click', toggleAlbumsEvent);
	
	// Event called to toggle each of the artist's items
	function toggleArtistsEvent(event) {
		var artists = element.getElementsByClassName("artist-area");

		var collapse = allArtistsCollapser.title;
 		for (var artist = 0; artist < artists.length; artist++) {
			var artistCollapser = artists[artist].getElementsByClassName("collapser-button")[0];
			toggleArtist(artists[artist], artistCollapser, collapse);
		}
		
		if (collapse === "SHOW") {
			allArtistsCollapser.innerHTML = "COLLAPSE ALL ARTISTS";
			allArtistsCollapser.title = "COLLAPSE";
		} else {
			allArtistsCollapser.innerHTML = "SHOW ALL ARTISTS";
			allArtistsCollapser.title = "SHOW";
		}
	}
	
	// Event called to toggle each of the album's items
	function toggleAlbumsEvent(event) {
		var artists = element.getElementsByClassName("artist-area");
		var collapse = allAlbumsCollapser.title;
		
 		for (var artist = 0; artist < artists.length; artist++) {
			var albums = artists[artist].getElementsByClassName("album-area");
			var albumsCollapser = artists[artist].getElementsByClassName("collapser-button")[1];
			
			// Toggles earch album within each artist section
			for (var album = 0; album < albums.length; album++) {
				var albumCollapser = albums[album].getElementsByClassName("collapser-button")[0];
				toggleAlbum(albums[album], albumCollapser, collapse);
			}
			
			// Update the artist's multi-album collapser
			if (collapse === "SHOW") {
				albumsCollapser.innerHTML = "COLLAPSE ALBUMS";
				albumsCollapser.title = "COLLAPSE";
			} else {
				albumsCollapser.innerHTML = "SHOW ALBUMS";
				albumsCollapser.title = "SHOW";
			}
		}
		
		if (collapse === "SHOW") {
			allAlbumsCollapser.innerHTML = "COLLAPSE ALL ALBUMS";
			allAlbumsCollapser.title = "COLLAPSE";
		} else {
			allAlbumsCollapser.innerHTML = "SHOW ALL ALBUMS";
			allAlbumsCollapser.title = "SHOW";
		}
	}
	
	// Add the new elements to the document
	element.parentElement.insertBefore(appHeader, element);
	appHeader.insertBefore(allAlbumsCollapser, appHeader.firstElementChild);
	appHeader.insertBefore(allArtistsCollapser, appHeader.firstElementChild);
}

/**
 * Generate a collapser for an artist and all of its children albums.
 * @param {Object} headerElement The artist's header element
 */
function generateArtistCollapsers(headerElement) {
	// Create a new container for the artist's header
	var artistHeader = document.createElement("div");
	artistHeader.classList.add("artist-header");
	
	// Check whether the artist is already collapsed
	var firstAlbum = headerElement.parentElement.getElementsByClassName("album-area")[0];
	var artistIsCollapsed = (firstAlbum.style.display === "none");
	
	// Create the Artist Collapser button
	var artistCollapser = document.createElement("button");
	if (artistIsCollapsed) { // If the header is collapsed, display the SHOW button
		artistCollapser.innerHTML = "+";
		artistCollapser.title = "SHOW";
	} else { // If the header is not collapsed, display the COLLAPSE button.
		artistCollapser.innerHTML = "-";
		artistCollapser.title = "COLLAPSE";
	}
	artistCollapser.classList.add("collapser-button");
	artistCollapser.classList.add("mini");
	
	// Create the Albums Collapser button
	var allAlbumsCollapser = document.createElement("button");
	allAlbumsCollapser.innerHTML = "COLLAPSE ALBUMS";
	allAlbumsCollapser.title = "COLLAPSE";
	allAlbumsCollapser.classList.add("collapser-button");
	
	// Cause the button to toggle the visibility of the artist
	artistCollapser.addEventListener('click', toggleArtistEvent);
	// Cause the button to toggle the visibility of all child albums
	allAlbumsCollapser.addEventListener('click', toggleAlbumsEvent);
	
	// Event called to toggle the artist's items
	function toggleArtistEvent(event) {
		var element = event.target.parentElement.parentElement;
		
		toggleArtist(element, artistCollapser);
	}
	
	// Event called to toggle each of the album's items
	function toggleAlbumsEvent(event) {
		var element = event.target.parentElement.parentElement;
		var albums = element.getElementsByClassName("album-area");
		var collapse = allAlbumsCollapser.title;
		
 		for (var album = 0; album < albums.length; album++) {
			var albumCollapser = albums[album].getElementsByClassName("collapser-button")[0];
			toggleAlbum(albums[album], albumCollapser, collapse);
		}
		
		if (collapse === "SHOW") {
			allAlbumsCollapser.innerHTML = "COLLAPSE ALBUMS";
			allAlbumsCollapser.title = "COLLAPSE";
		} else {
			allAlbumsCollapser.innerHTML = "SHOW ALBUMS";
			allAlbumsCollapser.title = "SHOW";
		}
	}
	
	// Add the new elements to the document
	headerElement.parentElement.insertBefore(artistHeader, headerElement);
	artistHeader.appendChild(headerElement);
	headerElement.parentElement.insertBefore(artistCollapser, headerElement);
	headerElement.parentElement.insertBefore(allAlbumsCollapser, headerElement.nextSibling);
}

/**
 * Generate a collapser for an album.
 * @param {Object} headerElement The album's header element
 */
function generateAlbumCollapser(headerElement) {
	var albumSpan = headerElement.parentElement; // Album's containing element (span)
	
	// Create a new container for the album's header
	var albumHeader = document.createElement("div");
	albumHeader.classList.add("album-header");
	
	// Check whether the album is already collapsed
	var albumIsCollapsed = (albumSpan.style.display === "none");
	
	// Create the Album Collapser button
	var albumCollapser = document.createElement("button");
	if (albumIsCollapsed) { // If the header is collapsed, display the SHOW button
		albumCollapser.innerHTML = "+";
		albumCollapser.title = "SHOW";
	} else { // If the header is not collapsed, display the COLLAPSE button.
		albumCollapser.innerHTML = "-";
		albumCollapser.title = "COLLAPSE";
	}
	albumCollapser.classList.add("collapser-button");
	albumCollapser.classList.add("mini");
	
	// Cause the button to toggle the visibility of the album
	albumCollapser.addEventListener('click', toggleAlbumEvent);
	
	// Event called to toggle the album's items
	function toggleAlbumEvent(event) {
		var element = event.target.parentElement.parentElement;
		
		toggleAlbum(element, albumCollapser);
	}
	
	// Add the new elements to the document
	headerElement.parentElement.insertBefore(albumHeader, headerElement);
	albumHeader.appendChild(headerElement);
	headerElement.parentElement.insertBefore(albumCollapser, headerElement);
}

/**
 * Toggles the view of all of the Artist's elements.
 * @param {Object} element	The Artist's container (class: artist-area)
 * @param {Object} button	 The button used to trigger the event
 * @param {String} collapse Whether to toggle, collapse, or show the items.
 */
function toggleArtist(element, button, collapse = "TOGGLE") {
	var albums = element.getElementsByClassName("album-area");
	var headerElement = element.getElementsByTagName("H2")[0];
	collapse = collapse.toUpperCase();
	
	if (collapse !== "TOGGLE" && collapse !== button.title) {
		return;
	}
	
	if (collapse === "TOGGLE") {
		collapse = button.title;
	}
	
	if (collapse === "SHOW") {
		button.innerHTML = "-";
		button.title = "COLLAPSE";
	} else {
		button.innerHTML = "+";
		button.title = "SHOW";
	}
	
	for (var album = 0; album < albums.length; album++) {
		if (collapse === "SHOW") {
			albums[album].style.display = "block";
		}
		else {
			albums[album].style.display = "none";
		}
	}
}

/**
 * Toggles the view of the album's art and track list.
 * @param {Object} element	The Album's container (class: album-area)
 * @param {Object} button	 The button used to trigger the event
 * @param {String} collapse Whether to toggle, collapse, or show the items.
 */
function toggleAlbum(element, button, collapse = "TOGGLE") {
	var affectedItems = [];
	affectedItems.push(element.getElementsByClassName("track-list")[0]);
	affectedItems.push(element.getElementsByClassName("albumart")[0]);
	affectedItems.push(element.getElementsByClassName("play overlay svg")[0]);
	
	collapse = collapse.toUpperCase();
	
	if (collapse !== "TOGGLE" && collapse !== button.title) {
		return;
	}
	
	if (collapse === "TOGGLE") {
		collapse = button.title;
	}
	
	if (collapse === "SHOW") {
		button.innerHTML = "-";
		button.title = "COLLAPSE";
	} else {
		button.innerHTML = "+";
		button.title = "SHOW";
	}
	
	for (var item = 0; item < affectedItems.length; item++) {
		if (collapse === "SHOW") {
			affectedItems[item].style.display = "block";
		}
		else {
			affectedItems[item].style.display = "none";
		}
	}
}