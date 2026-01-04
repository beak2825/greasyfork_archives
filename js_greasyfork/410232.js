// ==UserScript==
// @name         Steam Fix Artwork Thumbnails
// @namespace    WitherOfMc
// @version      1.0.3
// @icon        https://i.imgur.com/UqlUsxD_d.webp?maxwidth=728&fidelity=grand
// @description  This Will fix Steam Artwork Thumbnails
// @author       WitherOfMc
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410232/Steam%20Fix%20Artwork%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/410232/Steam%20Fix%20Artwork%20Thumbnails.meta.js
// ==/UserScript==

var
a=document.createElement("style");a.innerHTML=".publishedfile_popup_screenshot,.publishedfile_popup_screenshot>img,.profile_media_item,.imgWallItem{min-height:100px}",document.head.appendChild(a),[].forEach.call(document.getElementsByTagName("iframe"),function(e){e.contentDocument.head.appendChild(a.cloneNode(true))})