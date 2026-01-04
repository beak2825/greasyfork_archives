// ==UserScript==
// @name        ColorHunt dark mode
// @namespace   Violentmonkey Scripts
// @match       https://colorhunt.co/*
// @grant       none
// @version     1.0
// @author      RedTTG
// @description Changes the style of colorhunt to a more eye friendly dark mode
// @downloadURL https://update.greasyfork.org/scripts/457823/ColorHunt%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/457823/ColorHunt%20dark%20mode.meta.js
// ==/UserScript==

var head  = document.getElementsByTagName('head')[0];
var link  = document.createElement('link');
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = 'https://rostshkolo.free.bg/colorhunt.css';
link.media = 'all';
head.appendChild(link);