// ==UserScript==
// @name  Getlink GIF
// @namespace  PvP Nguyen Phat
// @description  Getlink ảnh gif từ các web gif
// @version  1.0.0
// @author  PvP Nguyen Phat
// @match  https://www.gif-vif.com/*
// @require https://code.jquery.com/jquery-latest.js
// @run-at  document-idle
// @downloadURL https://update.greasyfork.org/scripts/405995/Getlink%20GIF.user.js
// @updateURL https://update.greasyfork.org/scripts/405995/Getlink%20GIF.meta.js
// ==/UserScript==


var $ = window.jQuery;
//console.log('Test jQuery loaded 1: ', $('head meta'));
async function getlink_gif() {
	function wait(ms) { return new Promise(r => setTimeout(r, ms)); } // Chờ đợi.
	setTimeout(async function () {
		if (location.hostname.includes('gif-vif.com') && location.pathname != '/') {
			var link_gif = document.querySelector("meta[property='og:url']").content;
			document.getElementById('share_buttons').insertAdjacentHTML('beforeend', '<a href="' + link_gif + '" target="_blank"><img src="https://i.imgur.com/wcOMrHv.png"></a>');
		}
		await wait(200);
	});
}

//var jquery_ = document.createElement('script');
//jquery_.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';
//(document.body || document.head || document.documentElement).appendChild(jquery_);
//var script_ = document.createElement('script');
//script_.appendChild(document.createTextNode(`atob(${abc});`));
//(document.body || document.head || document.documentElement).appendChild(script_);
var script = document.createElement('script');
script.appendChild(document.createTextNode('!' + getlink_gif + '();'));
(document.body || document.head || document.documentElement).appendChild(script);