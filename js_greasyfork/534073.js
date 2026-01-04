// ==UserScript==
// @name        Zlv Search
// @namespace   Violentmonkey Scripts
// @match       https://outfox.online/scores/song/*
// @grant       none
// @version     1.0
// @author      SpacyBeanie
// @description 4/26/2025, 3:21:24 PM
// @run-at      document-end
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/534073/Zlv%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/534073/Zlv%20Search.meta.js
// ==/UserScript==


var songname = document.getElementById("song-name").innerHTML
var artistname = document.getElementById("artist-name").innerHTML

console.log("ZLVS: "+songname)
console.log("ZLVS: "+artistname)

function search(song,artist){
  return 'https://zenius-i-vanisher.com/v5.2/simfiles_search_ajax.php?songtitle='+song+'&songartist='+artist
}

document.getElementById("song-name").insertAdjacentHTML('beforeend','<a  target="_blank" href="'+search(songname,artistname)+'"><img style="padding-left: 4px" src="https://zenius-i-vanisher.com/v5.2/favicon.gif" title="Look up in Zenius I Vanisher" alt="Zenius I Vanisher\'s Logo"><//a>')