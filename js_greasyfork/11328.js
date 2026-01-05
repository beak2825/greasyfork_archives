// ==UserScript==
// @name          FuckGyazo v0.1
// @namespace     http://www.example.com/gmscripts
// @description   FUCKING GYAZO FUCK, GIVE ME THE DAMN DIRECT LINK FOR FUCK SAKE
// @include       http://gyazo.com/*
// @exclude       http://i.gyazo.com/*
// @exclude       http://gyazo.com/downloading
// @exclude       http://gyazo.com/signup
// @exclude       http://gyazo.com/login
// @version       0.1
// @icon          http://zizaza.com/cache/big_thumb/iconset/582181/582199/PNG/256/nasty/simple_nasty_line_icon_png_fuck_you_fuck_you_png_fuck_you_icon.png
// @downloadURL https://update.greasyfork.org/scripts/11328/FuckGyazo%20v01.user.js
// @updateURL https://update.greasyfork.org/scripts/11328/FuckGyazo%20v01.meta.js
// ==/UserScript==

var fuckUrl = window.location.href;
var fuckProtocol = fuckUrl.replace(/.*?:\/\//g, "");
var fuckNewUrl = fuckProtocol.replace(/^[^.]*/, 'i.gyazo');
var fuckThat = fuckNewUrl + '.png';
window.location.replace('http://' + fuckThat);