// ==UserScript==
// @name			Sticky Header Steam
// @version			0.1
// @description		A simple script that shrinks the Steam header and makes it sticky
// @match			*://steamcommunity.com/*
// @include			*://steamcommunity.com/*
// @match			*://store.steampowered.com/*
// @include			*://store.steampowered.com/*
// @namespace https://greasyfork.org/users/765759
// @downloadURL https://update.greasyfork.org/scripts/425629/Sticky%20Header%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/425629/Sticky%20Header%20Steam.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.textContent = `#global_header {
	 top: 0;
     display: block;
	 position: fixed !important;
     width : 100%;
     height : 80px;
	 z-index: 10000;
}
div#global_header .content{height : 80px;}
#modalContent{z-index:13001;}
.newmodal{z-index:13001 !important;}
.addme_spacer {height:80px;width:100%;}
`;
document.head.appendChild(style);
var el = document.createElement("div");
el.classList.add("addme_spacer");
document.getElementById('global_header').after(el);