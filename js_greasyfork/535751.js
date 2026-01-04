// ==UserScript==
// @name anilist fix
// @include https://anilist.co*
// @run-at document-body
// @grant none
// @description Fixes Anilist by letting you search and browse ""adult content"" without being logged in. To work correctly it requires blocking ||anilist.co/js/main.*.js$script with uBlock Origin or the like.
// @license CC0
// @namespace Archimedes5000
// @version 0.0.1.20250512072504
// @downloadURL https://update.greasyfork.org/scripts/535751/anilist%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/535751/anilist%20fix.meta.js
// ==/UserScript==
var r = /(?:( ?)(?<!\()\$isAdult:Boolean(?: = (?:true|false))* ?(?<!\)))|(?: ?\$isAdult:Boolean(?: = (?:true|false))* ?)|(?:(,?)(?<!\()isAdult:(?:\$isAdult|true|false)(?!\)),?)|(?:,?isAdult:(?:\$isAdult|true|false),?)/g;
var s = document.querySelector('script[src^="/js/main."]');
var src = s.src;
var xhr = new XMLHttpRequest();
xhr.open("GET", src, false);
xhr.send(null);
var t = xhr.responseText;
var ns = document.createElement("script");
ns.innerText = t.replace(r, "$1$2");
document.body.prepend(ns);