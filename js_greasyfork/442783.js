// ==UserScript==
// @name         Jump to Another Music Service
// @description  Jump to Another Music Service.
// @author       to
// @namespace    https://github.com/to
// @license      MIT
// @version      0.3
//
// @match        https://music.amazon.co.jp/*
// @match        https://music.apple.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=odesli.co
// @connect      song.link
//
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/442783/Jump%20to%20Another%20Music%20Service.user.js
// @updateURL https://update.greasyfork.org/scripts/442783/Jump%20to%20Another%20Music%20Service.meta.js
// ==/UserScript==

const MARKET = 'JP';
const PLATFORM = 'spotify';
const OPEN_IN_TAB = true;

GM_xmlhttpRequest({
	url: `https://api.song.link/v1-alpha.1/links?userCountry=${MARKET}&url=${encodeURIComponent(location.href)}`,
	onload: function(r){
		r = JSON.parse(r.responseText);
		try{
			let url = r.linksByPlatform[PLATFORM].url;
			OPEN_IN_TAB?
				GM_openInTab(url) :
				(location.href = url);
		}catch{
			alert('NOT FOUND;;');
		}
	}});
