// ==UserScript==
// @name Lightweight Wikiwand
// @namespace https://franklinyu.name
// @description Link to Wikiwand page on Wikipedia (less intrusive than redirection).
// @icon https://upload.wikimedia.org/wikipedia/commons/4/4e/WikiWand_Logo.png
// @author Franklin Yu
// @match https://*.wikipedia.org/*
// @match https://*.wikipedia.org/w/index.php?*
// @grant none
// @version 0.0.1.20180529040752
// @downloadURL https://update.greasyfork.org/scripts/38438/Lightweight%20Wikiwand.user.js
// @updateURL https://update.greasyfork.org/scripts/38438/Lightweight%20Wikiwand.meta.js
// ==/UserScript==

const lang = location.host.split('.')[0];

let title, lang_var;
if (location.pathname === '/w/index.php') {
	title = new URLSearchParams(location.search).get('title');
	lang_var = null;
} else {
	const path_segments = location.pathname.split('/');
	title = path_segments.slice(2).join('/');
	if (path_segments[1] === 'wiki')
		lang_var = null;
	else
		lang_var = path_segments[1];
}

const anchor = document.createElement('a');
anchor.href = `https://www.wikiwand.com/${lang_var || lang}/${title}`;
const image = document.createElement('img');
image.src = 'https://upload.wikimedia.org/wikipedia/commons/4/4e/WikiWand_Logo.png';
image.id = 'wikiwand-image';
anchor.appendChild(image);
document.getElementById('firstHeading').prepend(anchor);

const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode('#wikiwand-image { width: 2em; }'));
document.head.appendChild(style);
