// ==UserScript==
// @name         Bedre menu på Lasernet
// @namespace    http://tampermonkey.net/
// @version      0.28
// @description  Forbedrer brugen af Lasernet
// @author       Martin Larsen
// @match        http://*.lasernet.dk/*
// @license      GNU GPLv3
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/462402/Bedre%20menu%20p%C3%A5%20Lasernet.user.js
// @updateURL https://update.greasyfork.org/scripts/462402/Bedre%20menu%20p%C3%A5%20Lasernet.meta.js
// ==/UserScript==

GM_addStyle("a:visited { color: LinkText}");
console.log(document.location.href)
if(document.location.href.match("/ordre/ordre.dna")) {
   document.querySelector("textarea").rows = "20";
}
if(document.location.href=="http://www.lasernet.dk/") {
   document.querySelector("frameset").rows = "30,*";
   window.frames[0].location.href="http://www.lasernet.dk/html/head_ml.dna";
}
else {
   document.querySelectorAll("a[href*=newWindow]").forEach(a => (a.target="_blank", a.href = decodeURI(a.href).replace(/javascript:newWindow\('([^']+)'.*?\);?/i, '$1')));
   document.querySelectorAll("a[href*=newFullWindow]").forEach(a => (a.target="reuse", a.href = decodeURI(a.href).replace(/javascript:newFullWindow\('([^']+)'.*?\);?/i, '$1')));
   document.querySelectorAll("a[href*=openWindow],a[href*=helpOpen]").forEach(a => (a.target="_blank", a.href = decodeURI(a.href).replace(/javascript:(?:openWindow|helpOpen)\('[^']+' *, *'([^']+)'.*?\);?/i,'$1')));
   // document.querySelectorAll("a[href*=newWindow]").forEach(a => console.log(a.href));
}