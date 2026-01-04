// ==UserScript==
// @name         Temporary fix aniwave
// @namespace    http://tampermonkey.net/
// @version      2024-01-18
// @description  Temporary fix aniwave by loading in the CSS and JS files that are currently unable to load from external sources.
// @author       You
// @match        https://aniwave.to/watch/majo-to-yaijuu.m2v17/ep-2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aniwave.to
// @grant        none
// @include      https://aniwave.*/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485183/Temporary%20fix%20aniwave.user.js
// @updateURL https://update.greasyfork.org/scripts/485183/Temporary%20fix%20aniwave.meta.js
// ==/UserScript==

var src = document.createElement('link');
src.setAttribute('rel', 'stylesheet');
src.setAttribute('href', 'https://cdn.gls.cx/aniwaveall.css');
src.setAttribute('id', 'aAaA010101');

var scr2 = document.createElement('script');
scr2.setAttribute('type', 'text/javascript');
scr2.setAttribute('charset', 'utf-8');
scr2.setAttribute('src', 'https://cdn.gls.cx/aniwaveall.js');
scr2.setAttribute('id', 'aAaA010101');

document.head.appendChild(src);
document.head.appendChild(scr2);