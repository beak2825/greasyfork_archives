// ==UserScript==
// @name         YouTube Playlist Close (YAYTools)
// @namespace    YAYLISTS
// @version      0.0.2
// @description  Allow quick closing of playlists
// @author       Chris
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @match        http*://www.youtube.com/*
// @run-at       document-start
// @resource     buttonDark https://raw.githubusercontent.com/AjaxGb/YouTube-Playlist-Close/master/closeSmall.png
// @resource     buttonLight https://raw.githubusercontent.com/AjaxGb/YouTube-Playlist-Close/master/closeSmall.png
// @grant        GM_getResourceURL
// @license MIT 
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/511226/YouTube%20Playlist%20Close%20%28YAYTools%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511226/YouTube%20Playlist%20Close%20%28YAYTools%29.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function GM_addStyle(css) {
		const style = document.getElementById('GM_addStyleBy8626') || (function() {
			const style = document.createElement('style');
			style.type = 'text/css';
			style.id = 'GM_addStyleBy8626';
			document.head.appendChild(style);
			return style;
		})();
		const sheet = style.sheet;
		sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
	}

	GM_addStyle(`
#YT-Playlist-Close-By-AjaxGb-Close-Button-1234567890 {
	width: 44px;
	height: 40px;
	position: absolute;
	top: 0px;
	right: 0px;
	background-position: center;
	background-repeat: no-repeat;
	cursor: pointer;
	opacity: 0.5;
}`);
	GM_addStyle(`
#YT-Playlist-Close-By-AjaxGb-Close-Button-1234567890:hover {
	opacity: 0.6;
}`);
	GM_addStyle(`
#playlist #YT-Playlist-Close-By-AjaxGb-Close-Button-1234567890 {
	background-image: url("${GM_getResourceURL('buttonDark')}");
}`);
	GM_addStyle(`
#player-playlist #YT-Playlist-Close-By-AjaxGb-Close-Button-1234567890 {
	background-image: url("${GM_getResourceURL('buttonLight')}");
}`);
	GM_addStyle(`
#player-playlist .playlist-header, #playlist .header {
	position: relative;
}`);

	function getQueryArgs(query) {
		query = (query || window.location.search).substring(1);
		if(!query) return {};
		return query.split('&').reduce(function(prev, curr) {
			const p = curr.split('=');
			prev[decodeURIComponent(p[0])] = p[1] ? decodeURIComponent(p[1]) : p[1];
			return prev;
		}, {});
	}

	function setQueryArgs(query) {
		if(!query) return;
		let search = '';
		for(let prop in query){
			if(query[prop] === undefined){
				search += '&'+encodeURIComponent(prop);
			}else{
				search += '&'+encodeURIComponent(prop)+'='+encodeURIComponent(query[prop]);
			}
		}
		return '?' + search.substr(1);
	}

	let q;
	const b = document.createElement('a');
	b.id = 'YT-Playlist-Close-By-AjaxGb-Close-Button-1234567890';
	b.title = 'Close playlist';

	function updateURL() {
		b.href = location.toString();
		q = getQueryArgs(b.search);
		delete q.list;
		delete q.index;
		delete q.t;
		b.search = setQueryArgs(q);
	}

	b.onmouseenter = function() {
		updateURL();
	};

	b.onmouseup = function() {
		updateURL();
		const t = document.getElementById('movie_player').getCurrentTime()|0;
		if (t > 0) {
			q.time_continue = t;
			b.search = setQueryArgs(q);
			setTimeout(resetQuery);
		}
	};

	function resetQuery() {
		delete q.time_continue;
		b.search = setQueryArgs(q);
	}

	function addButton(p) {
		updateURL();
		p.appendChild(b);
	}

	const observer = new MutationObserver(function(mrs) {
		if(document.contains(b)) return;

		const playlistHeader = document.querySelector([
			'#playlist:not(.ytd-miniplayer) .header',
			'#player-playlist .playlist-header',
		].join(','));

		if (playlistHeader) addButton(playlistHeader);
	});
	observer.observe(document.documentElement, {
		childList: true,
		subtree: true
	});
})();
