// ==UserScript==
// @name                        AlbumFiend Bypass Ads And Show Download Link
// @version                     0.0.8
// @grant                       none
// @description                 Bypasses the ads and shows the download link instead of an adfly supported link.
// @include                     http://www.albumfiend.com/*
// @author                      Jimmy
// @namespace                   https://greasyfork.org/users/5561
// @downloadURL https://update.greasyfork.org/scripts/5297/AlbumFiend%20Bypass%20Ads%20And%20Show%20Download%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/5297/AlbumFiend%20Bypass%20Ads%20And%20Show%20Download%20Link.meta.js
// ==/UserScript==
var pathArray = window.location.pathname.split( '/' );
var postNumber = pathArray[2];
if(document.getElementById("cboxdiv") != null){
	document.getElementById('fb-root').innerHTML = '<p style="color:red; text-align:center;font-size:34px;">You seem to be logged in. Please <a href="http://www.albumfiend.com/logout.php?youdidtherightthingmate">LOGOUT</a> for this userscript to function properly.</p>'
} else {
	if(postNumber != null){
        document.getElementById('fb-root').innerHTML += '<a href="http://www.albumfiend.com/a.php?' + postNumber + '" style="color:red;position:fixed;" target="_blank">Download</a>'
	} else {
		document.getElementById('fb-root').innerHTML = '<p style="color:red;position:fixed;">Not on a mixtape/album page.</p>'
	}
}