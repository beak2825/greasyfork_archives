// ==UserScript==
// @run-at      document-idle
// @version     1.0.0
// @name        YouTube 404 page monkey replacer
// @namespace   https://github.com/emmaexe/userscripts
// @author      emmaexe
// @description Replaces the YouTube 404 page monkey with a better one made by @dinoboirex1.
// @license     GPL-3.0-only
// @homepageURL https://github.com/emmaexe/userscripts
// @supportURL  https://github.com/emmaexe/userscripts/issues
// @include     *://youtube.*/*
// @include     *://*.youtube.*/*
// @icon        https://raw.githubusercontent.com/emmaexe/userscripts/main/youtube-404-replacer/assets/youtube-ico-32.png
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/454051/YouTube%20404%20page%20monkey%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/454051/YouTube%20404%20page%20monkey%20replacer.meta.js
// ==/UserScript==

youtube_monke_parent = document.getElementsByClassName('not-found-content')[0];
youtube_monke = document.getElementsByClassName('not-found-content__image')[0];
if (youtube_monke === undefined) youtube_monke = document.getElementById('error-page-hh-illustration');
if (youtube_monke != undefined) {
    youtube_monke.src = "https://raw.githubusercontent.com/emmaexe/userscripts/main/youtube-404-replacer/assets/youtube-monkey.png";
    youtube_monke.width = 186;
    youtube_monke.height = 186;
    let newAnchor = document.createElement("a");
  	newAnchor.innerText = "\nArt by @dinoboirex1";
  	newAnchor.href = "https://www.reddit.com/user/DinoRex_Makes_2/";
  	newAnchor.target = "_blank";
  	youtube_monke_parent.insertBefore(newAnchor, youtube_monke_parent.children[1]);
}