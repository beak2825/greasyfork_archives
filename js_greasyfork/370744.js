// ==UserScript==
// @name         VidLii Video Downloader
// @version      0.2
// @description  Getting raw link from videos from VidLii
// @author       TotoDude21902
// @include      http://*.vidlii.com/*
// @include      https://*.vidlii.com/*
// @include      http://vidlii.com/*
// @include      https://vidlii.com/*
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/199852
// @downloadURL https://update.greasyfork.org/scripts/370744/VidLii%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/370744/VidLii%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var get = function () {
   		if (typeof vlp !== undefined) {
   			try {
    			window.prompt("Successfully got video raw link", vlp.videoObj.attributes["src"].nodeValue);
    		} catch(e) {
    			alert("Couldn't get the video, Try playing the video");
    		}
    	} else {
    		alert("Video not found");
    	}
    }
    GM_registerMenuCommand("Get Video", get);
})();