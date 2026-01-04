// ==UserScript==
// @name         SoundCloud Downloader using local copy of youtube-dl
// @namespace    fke9fgjew89gjwe89
// @version      1.1
// @description  Download songs from SoundCloud using youtube-dl
// @author       https://greasyfork.org/en/users/432346-fke9fgjew89gjwe89
// @icon         https://a-v2.sndcdn.com/assets/images/sc-icons/ios.png
// @include      /^https:\/\/soundcloud\.com/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415990/SoundCloud%20Downloader%20using%20local%20copy%20of%20youtube-dl.user.js
// @updateURL https://update.greasyfork.org/scripts/415990/SoundCloud%20Downloader%20using%20local%20copy%20of%20youtube-dl.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var head = document.getElementsByTagName('head')[0];
	var style = document.createElement('style');
	var css = '.sc-button-directdl{text-indent:19px}.sc-button-directdl::before{background-size:16px 16px;background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+UmVjdGFuZ2xlIDMxPC90aXRsZT48cGF0aCBkPSJNMyAxMXYyaDEwdi0ySDN6bTAtN2gxMGwtNSA2LTUtNnptMy0ydjJoNFYySDZ6IiBmaWxsPSIjMjIyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=);content:"";display:block;position:absolute;background-repeat:no-repeat;background-position:center center;width:20px;height:20px;top:0;bottom:0;margin:auto 0;left:4px}';
	style.setAttribute('type', 'text/css');
	if (style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}
	head.appendChild(style);
	String.prototype.mapReplace = function (map) {
		var regex = [];
		for (var key in map)
			regex.push(key.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'));
		return this.replace(new RegExp(regex.join('|'), 'g'), function (word) {
			return map[word];
		});
	};
	var last_sound_title = '1';
	setInterval(function () {
		var sound_title = document.getElementsByClassName('soundTitle__title')[0].children[0].innerText.mapReplace({
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			"'": '&#39;',
			'/': '&#x2F;',
			'`': '&#x60;',
			'=': '&#x3D;',
			'"': '&quot;'
		});
		if (last_sound_title !== sound_title) {
			last_sound_title = sound_title;
			var button_list = document.getElementsByClassName('sc-button-group sc-button-group-medium')[0];
			var directdl = '<a href="ytdl://' + window.location + '" class="sc-button-directdl sc-button sc-button-medium sc-button-responsive" tabindex="0" aria-haspopup="true" role="button" title="Download" aria-label="Download">Download</a>';
			button_list.insertAdjacentHTML('beforeend', directdl);
		}
		if (document.getElementsByClassName('sound streamContext playing')[0] && !document.getElementsByClassName('sound streamContext playing')[0].querySelector('.sc-button-directdl')) {
			var stuff = document.getElementsByClassName('sound streamContext playing')[0];
			var linksr = stuff.querySelector('.soundTitle__title.sc-link-dark').href;
			console.log(linksr);
			var button_list = stuff.querySelector('.sc-button-group.sc-button-group-small');
			var directdl = '<a href="ytdl://' + linksr + '" class="sc-button-directdl sc-button sc-button-small sc-button-responsive" tabindex="0" aria-haspopup="true" role="button" title="Download" aria-label="Download">Download</a>';
			button_list.insertAdjacentHTML('beforeend', directdl);
			var divs = document.getElementsByClassName('sc-button-directdl');
			var lastChild = divs[divs.length - 1];
		}
	}, 3 * 1000);
}());