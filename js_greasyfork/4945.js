// ==UserScript==
// @name       ddl-warez big hover preview image
// @namespace  http://ddl-warez.in
// @version    1
// @description  Hover with full sized thumbnail
// @match      http://ddl-warez.in/*
// @copyright  2012+, frankred@web.de
// @downloadURL https://update.greasyfork.org/scripts/4945/ddl-warez%20big%20hover%20preview%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/4945/ddl-warez%20big%20hover%20preview%20image.meta.js
// ==/UserScript==

// Big hover thumbnail
console.log("[PLUGIN LOADED]: ddl-warez big hover preview image!");
var tooltips_images = document.querySelectorAll(".tooltip img");
for(var i = 0; i < tooltips_images.length; i++){
    console.log(tooltips_images[i].removeAttribute('width'));
}

// More space for the hover overlay
document.body.innerHTML += '<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>';