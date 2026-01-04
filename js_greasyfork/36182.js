// ==UserScript==
// @name         YOUTUBE FUCK HTML5
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  just always focus on media player, and keys work correct
// @author       Rederick Asher
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36182/YOUTUBE%20FUCK%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/36182/YOUTUBE%20FUCK%20HTML5.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(function(){
//document.onkeydown = function (e) {alert();return false;};
//document.onkeyup =  function (e) {return false;};
//  ytp-volume-panel
//	if(document.getElementsByClassName("ytp-chrome-bottom")[0].contains(document.activeElement)){
	if(document.activeElement.tagName!="INPUT" && document.documentElement.scrollTop<10 && window.getSelection()==""){
//	   document.activeElement.style.border="2px solid red";
	   document.getElementById("movie_player").focus();
//	 }else{
//		 alert(document.activeElement.tagName);
	 }
},500);
})();