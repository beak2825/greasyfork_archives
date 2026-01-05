// ==UserScript==
// @name DeviantBlocker
// @namespace brandrock.co.za
// @author Peter Brand
// @description DeviantArt gallery - block images from selected artists in Eclipse
// @license GNU GPLv3
// @include http://www.deviantart.com/*
// @include https://www.deviantart.com/*
// @version 4.3
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/14835/DeviantBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/14835/DeviantBlocker.meta.js
// ==/UserScript==

// @grant GM_log
(function() {
	//first time scan on load
	document.addEventListener ('DOMContentLoaded', pageInit);
	
	function buttonAdd(parent, label, title, style, clickEvent){
		var elem = document.createElement('button');
		elem.type = 'button';
		elem.style = style;
		elem.style.zIndex = '99';
		elem.style.position = 'absolute';
		elem.title = title;
		elem.innerHTML = label;
		parent.appendChild(elem);
		elem.addEventListener('click', clickEvent);
		return elem;
	}
	
	function pageInit() {
		//button to reveal blacklist
		var bdiv = document.getElementById('root');
		var blackText = document.createElement('textarea');
		blackText.style = 'position: absolute; display: none; top:100px; right: 0px; z-index: 99;';
		bdiv.appendChild(blackText);
		buttonAdd(bdiv, '?DAB', 'Click to show blacklisted artists'
			, 'top:0px; right: 0px', function(e){
			var blacklist = GM_getValue('DAGbl2', '|');
			blackText.innerHTML = blacklist;
			blackText.style.display='inline-block';
		});
		blackText.addEventListener('change', function (){
			GM_setValue('DAGbl2', blackText.value)
		});
	}
	
	function scanImages() {
		var blacklist = GM_getValue('DAGbl2', '|');
		var artSecs = document.querySelectorAll('._2YkEf');
		GM_setValue('DAGdebug', artSecs.length);
		var count = 0;
		//scan all artists sections
		for(var i = artSecs.length; i--;) {
      var artLink = artSecs[i].querySelector('a[data-username]');
			var artist = artLink.getAttribute('data-username');
			var img = artSecs[i].querySelector('img');
			//quick check to see if src has been specified and haven't done this image already
			if (!img.devblok && img.getAttribute('src')>''){
				img.devblok = true;
				img.setAttribute("data-blocked", -1);
				var elem = buttonAdd(artSecs[i], 'x', 'Click to hide/show images from this artist'
					, 'bottom:0px; right: 0px', function(e){
					artistToggle(e, this);
					});
				elem.img = img;
				img.setAttribute('data-artist', artist);
				img.artist = artist;
				var arto = '|' + artist + '|';
				if (blacklist.indexOf(arto) > -1){
					imgHide(img);
					img.isBlocked = true;
					img.setAttribute('data-blocked', 1);
					count++;
				} else {
					img.isBlocked = false;
					img.setAttribute('data-blocked', 0);
				}
			}
		}
	}

	function artistToggle(e, button) {
		//show or hide the images for this artist
		var i, img;
		var blacklist = GM_getValue('DAGbl2', '|');
		var thumbs = document.querySelectorAll('img[data-artist=\'' + button.img.artist + '\']');
		if (button.img.isBlocked){
			//remove from blacklist string - could have used an array, but string is fast enough
			blacklist = blacklist.replace(button.img.artist + '|', '');
			GM_setValue('DAGbl2', blacklist);
			//scan page for all images for this artist and show them
			for(i = thumbs.length; i--;) imgShow(thumbs[i]);
			button.img.isBlocked = false;
		} else {
			//add to blacklist
			blacklist = blacklist + button.img.artist + '|';
			GM_setValue('DAGbl2', blacklist);
			//scan page for all images for this artist and hide them
			for(i = thumbs.length; i--;) imgHide(thumbs[i]);
			button.img.isBlocked = true;
		}
		var event = e || window.event;
		if (!event) return;
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();
	}
	function imgHide(img){
		//img.style.opacity = '0.05';
		img.style.visibility = 'hidden';
	}
	function imgShow(img){
		//img.style.opacity = '1';
		img.style.visibility = 'visible';
	}
	setInterval(function() {scanImages();}, 1000);
}
)();