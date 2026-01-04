// ==UserScript==
// @name         ehentai flipping shortcut
// @namespace    none
// @version      0.1.4
// @description  use 'A','D','←','→' to flip page in e-hentai/exhentai, also works in gallery view
// @author       creonly
// @match        exhentai.org/*
// @match        e-hentai.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521107/ehentai%20flipping%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/521107/ehentai%20flipping%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
document.onkeydown=function(b){
    b=(b)?b:window.event;
    var isInput = b?b.srcElement.type == "text":false;
    if(isInput) return;
	var ptt=document.getElementsByClassName("ptt")[0];
    if(ptt){
        ptt = ptt.getElementsByTagName("a")
    }
    var uprev = document.getElementById("uprev");
    var unext = document.getElementById("unext");
    if(b.keyCode=="37"|b.keyCode=="65"){
		if(ptt){
			window.location.href=ptt[0].href;
         }
        if(uprev){
            window.location.href=uprev.href;
        }
    }else if(b.keyCode=="39"|b.keyCode=="68"){
		if(ptt){
			window.location.href=ptt[ptt.length-1].href;
        }
        if(unext){
            window.location.href=unext.href;
        }
    }
};