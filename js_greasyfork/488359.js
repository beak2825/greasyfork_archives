// ==UserScript==
// @name         RYMAlbumYouTubeSearchFromMediaLinks
// @author       dougwritescode
// @description  Creates link to search YouTube for a release at the end of existing RYM media links
// @version      3
// @grant        none
// @include      https://*rateyourmusic.com/release/*
// @icon         https://www.rateyourmusic.com/favicon.ico
// @namespace    dougwritescode
// @license	 MIT
// @downloadURL https://update.greasyfork.org/scripts/488359/RYMAlbumYouTubeSearchFromMediaLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/488359/RYMAlbumYouTubeSearchFromMediaLinks.meta.js
// ==/UserScript==

function addStyleStr (cssStr) {
	var doc = document;
  var newNode = doc.createElement('style');
  newNode.textContent = cssStr;
  var insertPoint = doc.getElementsByTagName('head')[0] || doc.body || doc.documentElement;
  insertPoint.appendChild(newNode);
}

addStyleStr(
`.ui_media_link_btn_youtube_search_overlay {
  inset: 0;
  max-width: 100%;
  max-height: 100%;
  border: none;
  opacity: 0;
  transition: .3s ease-in-out;
}
.ui_media_link_btn_youtube_search {
	background: url('https://vectorified.com/image/youtube-logo-square-vector-30.png');
  background-size: 100%;
  border: none;
}
.ui_media_link_btn_youtube_search_overlay:hover {
	opacity: 1;
}
`);

function setup() {
  var linksContainer = document.querySelectorAll(".ui_media_links");
  if (linksContainer.length == 0) {
    setTimeout(setup, 5);
    return;
  }
  setButton()
}

function setButton() {
  let albumText = document.getElementsByClassName("album_title")[0].innerText;
  let artistText = document.getElementsByClassName("artist")[0].innerText;
  var searchArray = [...artistText.trim().split(" "), ...albumText.trim().split(" ")];
  for (let i in searchArray) {
    searchArray[i] = encodeURIComponent(searchArray[i]);
  }
  var searchString = searchArray.join("+");
  let searchURL = 'https://www.youtube.com/results?search_query=' + searchString;
  var searchButtonOverlayImage = document.createElement("img");
  searchButtonOverlayImage.setAttribute("src", "https://png.pngtree.com/png-vector/20190321/ourlarge/pngtree-vector-find-icon-png-image_854997.jpg");
  searchButtonOverlayImage.setAttribute("class", "ui_media_link_btn_youtube_search_overlay");
  var searchButton = document.createElement("a");
  searchButton.setAttribute("class", "ui_media_link_btn ui_media_link_btn_youtube_search");
  searchButton.setAttribute("target", "_blank");
  searchButton.setAttribute("rel", "noopener nofollow");
  searchButton.setAttribute("title", "Youtube Search");
  searchButton.setAttribute("aria-label", "Search in YouTube by artist and album title");
  searchButton.setAttribute("href", searchURL);
  searchButton.appendChild(searchButtonOverlayImage);
  var tempcollection = document.getElementsByClassName("ui_media_links");
  tempcollection[0].appendChild(searchButton); 
}

setup();