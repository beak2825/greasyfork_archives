// ==UserScript==
// @name AceStream links open TV Video streaming links in browser
// @namespace https://github.com/ARTEMISPETROV
// @description Replaces acestream://  with 127.0.0.1:6878/webui/player/
// @include http://*
// @include https://*
// @version 1.1
// @author Artem Petrov <petrovartem@protonmail.com> ( https://github.com/ARTEMISPETROV)
// @source https://github.com/ARTEMISPETROV/AceStream-Player-Watch-streaming-TV-Video-in-browser-Userscript.git
// @license MIT
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/374368/AceStream%20links%20open%20TV%20Video%20streaming%20links%20in%20browser.user.js
// @updateURL https://update.greasyfork.org/scripts/374368/AceStream%20links%20open%20TV%20Video%20streaming%20links%20in%20browser.meta.js
// ==/UserScript==

var url1,url2;
url1 = ['acestream://'];
url2 = ['127.0.0.1:6878/webui/player/'];
url3 = ['?autoplay=true'];
var a, links;
var tmp="a";
var p,q;
links = document.getElementsByTagName('a');
for (var i = 0; i < links.length; i++) {
    a = links[i];
    for(var j=0;j<url1.length; j++)
	{
	tmp = a.href+"" ;
	if(tmp.indexOf(url1[j]) != -1)
	{
	p=tmp.indexOf(url1[j]) ;
	q="http://";
	q = q + url2[j] + tmp.substring(p+url1[j].length,tmp.length)+ url3;
	a.href=q ;
	}
	}
    }