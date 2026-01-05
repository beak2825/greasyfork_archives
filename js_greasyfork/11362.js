// ==UserScript==
// @name         Additional imgur links
// @namespace    http://heyisthisusernametaken.com/imgur/user_links
// @version      0.1
// @description  Adds links to the user homepages on imgur, for "all images" and "albums"
// @author       heyisthisusernametaken
// @match        http://imgur.com/user/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/jquery-ui.min.js
// @grant    GM_addStyle
// @grant    GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/11362/Additional%20imgur%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/11362/Additional%20imgur%20links.meta.js
// ==/UserScript==

// --- Get username and set up URLs
var url = document.URL;
var uname = url.split("/")[4];
var allUrl = "http://" + uname + ".imgur.com/all";
var albumUrl = "http://" + uname + ".imgur.com";

// --- Create the clickable areas and set up attributes
var allImgBtn   = document.createElement ('div');
allImgBtn.innerHTML = '<h2>All Images</h2>';
allImgBtn.setAttribute('id', 'allImgBtn');

var albumBtn      = document.createElement ('div');
albumBtn.innerHTML = '<h2>Albums</h2>';
albumBtn.setAttribute('id', 'albumBtn');

allImgBtn.setAttribute ('class', 'textbox button');
albumBtn.setAttribute('class', 'textbox button');

// --- Add clickable areas to the side menu
var elems = document.getElementsByClassName('panel menu');
menuNode = elems[0];
var pmBtn = document.getElementById('pm-button');
menuNode.insertBefore(allImgBtn, pmBtn);
menuNode.insertBefore(albumBtn, pmBtn);

//--- add event listeners to buttons.
document.getElementById ("allImgBtn").addEventListener  (
    "click", showAllImages, false
);
function showAllImages (zEvent) {
    window.location.href = allUrl;
}
document.getElementById("albumBtn").addEventListener  (
    "click", showAlbums, false
);
function showAlbums (zEvent) {
    window.location.href = albumUrl;
}