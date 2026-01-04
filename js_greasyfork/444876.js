// ==UserScript==
// @name         Twitch Clip Downloader
// @namespace    http://oxcakmak.com/
// @version      3.5
// @description  Twitch Clip Download Easily
// @author       You
// @include       *://clips.twitch.tv/*
// @include       *://*twitch.tv/*/clip/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444876/Twitch%20Clip%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/444876/Twitch%20Clip%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addButton(){
    	var el = document.getElementsByClassName("channel-info-content")[0],
    		html = '<strong><a href="'+document.querySelector('video').src+'" target="_blank">Click To Download Clip</a></strong>';
    	// Internet Explorer, Opera, Chrome, Firefox 8+ and Safari
    	if (el.insertAdjacentHTML)
    		el.insertAdjacentHTML ("beforebegin", html);
    	else {
    		var range = document.createRange();
    		var frag = range.createContextualFragment(html);
    		el.parentNode.insertBefore(frag, el);
    	}
    }
    let loadDownloadButton = setInterval(() => {
      if (document.querySelector('.player-controls__right-control-group')) {
        if (location.pathname.includes('/clip/') || document.querySelector('[data-a-page-loaded-name="ClipsViewPage"]') ){
          addButton();
        }
      }
      clearInterval(loadDownloadButton);
    }, 1000);
})();