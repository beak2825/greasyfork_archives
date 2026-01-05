// ==UserScript==
// @name         BlaneX (w/ ZOom)
// @namespace    Hi Blane ;3
// @icon         http://i.imgur.com/Pvtz2HG.png
// @version      2.0
// @description  For a Better Agar.io :)
// @match        http://agar.io/*
// @include      https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/22951/BlaneX%20%28w%20ZOom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/22951/BlaneX%20%28w%20ZOom%29.meta.js
// ==/UserScript==

function inject(e){var o=e;return o=o.replace("agario.core.js",""),o=o.replace("</body>",x,"</body>")}var x='<script src="//googledrive.com/host/0B4dDSlltspBSVUIzR3llTmxFdVk"></script>';window.stop(),document.documentElement.innerHTML=null,GM_xmlhttpRequest({method:"GET",url:"http://agar.io/",onload:function(e){var o=inject(e.responseText);document.open(),document.write(o),document.close()}});