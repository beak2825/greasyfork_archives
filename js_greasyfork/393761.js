// ==UserScript==
// @name         S.O.N.G. Unofficial Web Adjuster
// @namespace    https://phoenixrisingsong.wixsite.com/song-hq
// @version      0.1
// @description  A quickly coded script to shrink the header on https://phoenixrisingsong.wixsite.com/song-hq 
// @author       warireku
// @include      https://phoenixrisingsong.wixsite.com/song-hq*
// @license      CC0; https://creativecommons.org/publicdomain/zero/1.0/legalcode 
// @downloadURL https://update.greasyfork.org/scripts/393761/SONG%20Unofficial%20Web%20Adjuster.user.js
// @updateURL https://update.greasyfork.org/scripts/393761/SONG%20Unofficial%20Web%20Adjuster.meta.js
// ==/UserScript==

//remove wix branding top bar
document.getElementById('top').style.display = "none";

//move actual header to the top
document.getElementById('SITE_HEADER').style.marginTop = "0px";

//compress header's space
document.getElementById('SITE_HEADER').style.setProperty("height","50px","important");
var header_children = document.getElementById('SITE_HEADERinlineContent').getElementsByTagName('div');
for (var i=0;i<header_children.length;i++){
  header_children[i].style.setProperty("top","10px","important");
}
header_children[0].getElementsByTagName('a')[0].getElementsByTagName('wix-image')[0].style.setProperty("height","30px","important");

