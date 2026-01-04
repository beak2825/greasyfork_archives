// ==UserScript==
// @name        Mangaupdates Manga search
// @namespace   Mangaupdates Manga search
// @match       *://www.mangaupdates.com/series.html?id=*
// @match       *://www.mangaupdates.com/series/*
// @grant       none
// @version     1.10
// @author      henrik9999
// @run-at      document-idle
// @description This simple script adds search links for mangapages on Mangaupdates
// @downloadURL https://update.greasyfork.org/scripts/393306/Mangaupdates%20Manga%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/393306/Mangaupdates%20Manga%20search.meta.js
// ==/UserScript==

var title = document.getElementsByClassName('releasestitle')[0].innerHTML.replace(/\(.+\)\s*$/,"").trim();
var titleEncoded = encodeURI(title);
var div =  document.querySelector("#main_content > div:nth-child(2) > div.row.no-gutters > div:nth-child(1)");

var node = document.createElement('style');
node.innerHTML = 'div#searchscript img{padding:0px 5px 0px 5px;}'
document.body.appendChild(node);

div.innerHTML += `
<div id="searchscript">
<h3>Search</h3>
<a href="https://manga4life.com/search/?name=`+titleEncoded+`"><img src="https://www.google.com/s2/favicons?domain=https://manga4life.com/">Manga4Life</a>
<a href="https://mangadex.org/titles?q=`+titleEncoded+`"><img src="https://www.google.com/s2/favicons?domain=https://mangadex.org">Mangadex</a>
<a href="http://www.mangahere.cc/search?title=`+titleEncoded+`"><img src="https://www.google.com/s2/favicons?domain=http://www.mangahere.cc/">MangaHere</a>
<a href="https://manganelo.net/search/story/`+title.replace(/\s/gm,"_")+`"><img src="https://www.google.com/s2/favicons?domain=https://manganelo.net/">MangaNelo</a>
<a href="https://mangapark.net/search?word=`+titleEncoded+`"><img src="https://www.google.com/s2/favicons?domain=https://mangapark.net">MangaPark</a>
</div>
`;