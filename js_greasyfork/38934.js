// ==UserScript==
// @name          9gag - darker style and minimalism
// @namespace     9gag_darker_style
// @version       1.02
// @description   Video controls enabled by default and less stuff
// @match         https://9gag.com/*
// @run-at        document-end
// @grant         unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/38934/9gag%20-%20darker%20style%20and%20minimalism.user.js
// @updateURL https://update.greasyfork.org/scripts/38934/9gag%20-%20darker%20style%20and%20minimalism.meta.js
// ==/UserScript==


if (typeof unsafeWindow === "undefined"){unsafeWindow = window;}


var r = document.querySelector(".section-header");
if(r){r.remove();}
r = document.querySelector(".section-nav");
if(r){r.remove();}
r = document.querySelector(".section-sidebar");
if(r){r.remove();}
r = document.querySelector(".featured-tag");
if(r){r.remove();}
r = document.querySelector("#top-nav")
if(r){r.style.position = "absolute";}
r = document.querySelector(".fixed-wrap-post-bar")
if(r){r.remove();}

var style = document.createElement('style');style.type = 'text/css';style.innerHTML = '.background-white {background-color: grey;} article.post-page .post-container {background-color: grey;} .post-afterbar-a.in-post-top {background-color: silver;} ';document.getElementsByTagName('head')[0].appendChild(style); // I like silver


var currentVideo;
document.onmouseover = function(e){
 if (e.target.tagName == 'VIDEO' && e.target != currentVideo){
     currentVideo = e.target;
     e.target.setAttribute("controls", true);
     e.target.parentNode.parentNode.removeAttribute("target");
     e.target.parentNode.parentNode.href = "javascript: void(0)";
     if(e.target.nextElementSibling.className == "sound-toggle off")
     {
       e.target.nextElementSibling.remove();
		 }
 }
};
