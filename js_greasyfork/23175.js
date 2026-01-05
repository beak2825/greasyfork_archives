// ==UserScript==
// @name         ehentai翻頁
// @namespace    http://somd5.com/
// @version      0.1
// @description  ehentai左右翻页
// @author       C0de
// @match        http://g.e-hentai.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23175/ehentai%E7%BF%BB%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/23175/ehentai%E7%BF%BB%E9%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
document.onkeydown=function(b){
    b=(b)?b:window.event;
	var sn=document.getElementsByClassName("sn")[0];
    if(b.keyCode=="37"){
		if(sn){
			window.location.href=sn.getElementsByTagName("a")[1].href;
         }
    }else if(b.keyCode=="39"){
		if(sn){
			window.location.href=sn.getElementsByTagName("a")[2].href;
        }
    }
};