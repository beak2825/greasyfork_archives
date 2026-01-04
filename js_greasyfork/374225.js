// ==UserScript==
// @name Invidious tooltip remover
// @namespace localhost
// @description hide the annoying video title tooltip on mouse hover that overlaps with videos
// @version 1.0
// @match https://invidio.us/watch*
// @downloadURL https://update.greasyfork.org/scripts/374225/Invidious%20tooltip%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/374225/Invidious%20tooltip%20remover.meta.js
// ==/UserScript==

var elements=document.getElementsByClassName('vjs-tech');
for(var i=0;i<elements.length;i++){elements[i].setAttribute('title','');}