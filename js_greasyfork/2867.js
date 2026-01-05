// ==UserScript==
// @name           SatorinSatorinGo
// @namespace      *
// @description    Replace DuckDuckGo logo with Satorin. Now includes favicon.
// @include        https://duckduckgo.com/*
// @include        http://duckduckgo.com/*
// @grant          none
// @version 0.0.1.20140628062307
// @downloadURL https://update.greasyfork.org/scripts/2867/SatorinSatorinGo.user.js
// @updateURL https://update.greasyfork.org/scripts/2867/SatorinSatorinGo.meta.js
// ==/UserScript==


document.title="Satorin Satorin Go";

var img = document.getElementById('logo_homepage');
var img2 = document.getElementById('header_logo');
var img3 = document.getElementById('logo_internal');

if (img != null) {
	img.setAttribute('style', 'background: url("http://i41.tinypic.com/15xjqd5.png") no-repeat scroll center top transparent; margin-bottom: 40px; padding-bottom: 1px; margin-left: 20%; width: 341px; height: 161px;');
	img.removeAttribute('id');
	img.innerHTML = '';
}

if (img2 != null) {
	img2.setAttribute('style', 'background: url("http://i43.tinypic.com/200r7u9.png") no-repeat scroll 0 0 transparent; float: left; height: 53px; margin: 0 0 -100px -130px; overflow: visible; width: 80px;');
	img2.removeAttribute('id');
}

if (img3 != null) {
	img3.setAttribute('style', 'background: url("http://i41.tinypic.com/211jkfs.png") no-repeat scroll left 10px transparent; height: 63px; margin-left: -8px;');
	img3.removeAttribute('id');
}

var images = document.getElementsByTagName ("img");
var x = 0;

while(x<images.length)
{
	if ((images[x].src == "https://duckduckgo.com/icon16.png") || (images[x].src == "http://duckduckgo.com/icon16.png"))
	{
		images[x].src = "http://i49.tinypic.com/2vigz7q.png";
	}
	
	x=x+1;
}

var head = document.getElementsByTagName('head')[0];
var favicon = document.createElement('link');

favicon.setAttribute('type', 'image/x-icon');
favicon.setAttribute('rel', 'shortcut icon');
favicon.setAttribute('href', "http://i49.tinypic.com/2vigz7q.png");
head.appendChild(favicon);