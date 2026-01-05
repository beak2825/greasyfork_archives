// ==UserScript==
// @name MiniatureSansBlanc
// @namespace Violentmonkey Scripts
// @grant none
// @version 1.0
// @description:en  User stickers
// @match http://*.jeuxvideo.com/*
// @description User stickers
// @downloadURL https://update.greasyfork.org/scripts/20499/MiniatureSansBlanc.user.js
// @updateURL https://update.greasyfork.org/scripts/20499/MiniatureSansBlanc.meta.js
// ==/UserScript==

var x = document.getElementsByClassName("img-shack");
var i;
for(i=0;i<x.length;i++)
  {
   		var z = x[i].alt;
    	if(z.includes("/fichiers/"))
          {
    		  if(z.endsWith(".png"))
        	  {
    			x[i].src =  x[i].alt;
        	  }
          }
  }
