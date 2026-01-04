// ==UserScript==
// @name         WFMU player timestamp link
// @namespace    https://greasyfork.org/en/users/27283-mutationobserver
// @version      2017-10-03--2
// @description  Generates a timestamped link for easy bookmarking.
// @author       MutationObserver
// @match        https://wfmu.org/archiveplayer/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33736/WFMU%20player%20timestamp%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/33736/WFMU%20player%20timestamp%20link.meta.js
// ==/UserScript==

var showPopup = false;

function bookmarkSave(){
	var t = document.querySelector('.mejs-currenttime').innerHTML;
	if (window.location.href.includes("&starttime=")) {
		var url = window.location.href.split("&");
		for (i = 0; i < url.length; i++) {
			if (url[i].includes("starttime=")) { url.splice(i, 1); }
		}
		url = url.join("&");
		url = url + "&starttime=" +t;
	}
	else { var url = window.location.href+"&starttime="+t; }
	url = url.split("#").join("");
	
	document.querySelector(".mejs-playpause-button").click();
	
	if (showPopup) { prompt("Bookmark", url); }
	else {
		butBookmarkLink.setAttribute("href", url);
		butBookmarkLink.classList.remove("unclicked");
		butBookmarkLink.innerHTML = showTitleAbbrev + " " + showDateAbbrev;
		showTimestamp.innerHTML = "(" + t + ")";
	}
}

var injectedHTML = `
<style id="bookmarkstyle">
body { background-color: #f1f1f1; }
#bookmarkGeneratorCont {
    width: 66%;
    margin-left: 15%;
	}
#bookmarkGeneratorCont > * {
    padding-left: .25em;
	padding-right: .25em;
}
#bookmark, #bookmarklink {
	display: flex; height: 50px;
	background-color: #D7EDF9;
	align-items: center;
	justify-content: center;
}
#bookmark {
    border: #a4caec 1px solid;
    border-radius: 7px;
}
#bookmarklink {
    background-color: white;
    float: left;
    display: flex;
    justify-content: left;
	transition: all .2s ease-in-out;
}
#bookmarklink.unclicked {
    color: rgba(0, 0, 0, 0.36);
    text-decoration: none;
}
#bookmarklinkLabel {
    float: left;
    display: grid;
    margin-left: 33%;
    justify-content: right;
    text-align: right;
    align-items: center;
    height: 50px;
}
@media screen and (max-width: 470px) {
	#bookmarklinkLabel { margin-left: 0; }
}
#bookmarklinktime {
	background-color: white;
    float: left;
    display: grid;
    height: 50px;
    align-items: center;
}
</style>
<div id="bookmarkGeneratorCont">
	<a href="#" id="bookmark">generate link</a>
	<div id="bookmarklinkLabel">Bookmark:</div>
	<a href="#" id="bookmarklink" class="unclicked">&nbsp;</a>
	<div id="bookmarklinktime">&nbsp;</div>
</div>
`;
document.querySelector('.container').insertAdjacentHTML("beforeend", injectedHTML);
document.querySelector('#bookmark').addEventListener ("click", bookmarkSave, false);
var butBookmarkLink = document.querySelector("#bookmarklink"); 
var showTimestamp = document.querySelector("#bookmarklinktime"); 
var showTitle = document.querySelector(".show-title");
var showTitleAbbrev = showTitle.innerHTML.match(/(.*) from /)[1].match(/\b(\w)/g).join('');
var tmp = showTitle.innerHTML.match(/ from ([0-9]*\/[0-9]*\/)[0-9]{0,2}([0-9]{2})$/); tmp.shift();
var showDateAbbrev = tmp.join('');

var playlistHeight = document.querySelector('.dropdown-container').offsetHeight;

if (window.innerHeight < (playlistHeight + 100)) {
	window.resizeTo(window.innerWidth, window.innerHeight+ playlistHeight + 150);
}