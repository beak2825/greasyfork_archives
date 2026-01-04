// ==UserScript==
// @name         douban-clean
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  try to take over the world!
// @author       You
// @match        *.douban.com/*
// @match        *://www.douban.com/*
// @match        *://book.douban.com/review/*
// @downloadURL https://update.greasyfork.org/scripts/392467/douban-clean.user.js
// @updateURL https://update.greasyfork.org/scripts/392467/douban-clean.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

      /*
    block ad
    */
window.innerWidth = 600;

    var p = document.querySelector(".notify-mod");
    if(p){
        p.style.display = "none";

    }
    p = document.querySelector("#img_wrap");
    if(p){
        p.style.display = "none";

    }

    p = document.querySelector(".top-nav-doubanapp");
    if(p){
        p.style.display = "none";

    }


     p = document.querySelector("#anony-time");
    if(p){
        p.style.display = "none";

    }
    p = document.querySelector("#top-nav-doumail-link");
    if(p.innerHTML.length>2){
    p.style.backgroundColor = "red";
    }



    p = document.querySelector(".aside");
    if(p){
    p.style.display = "none";
    }
    p = document.querySelector(".article");
    if(p){
    p.style.width = "100%";
//p.style.fontSize = "60px";
    }
    p = document.querySelector("html");
    p.style.fontSize = "8px";
    p = document.querySelector("p");
p.style.fontSize = "1.4rem";
/*

html {
  font-size: 8px;
}
p {
  font-size: 1.4rem;
}
*/

p = document.querySelectorAll("blockquote");
var i = 0;

for( i = 0; i < p.length;i++){
    p[i].style.fontSize = "38px";
}

p = document.querySelectorAll("p");

for( i = 0; i < p.length;i++){
    p[i].style.fontSize = "38px";
}

p = document.querySelectorAll("span");

for( i = 0; i < p.length;i++){
    p[i].style.fontSize = "38px";
}
p = document.querySelectorAll("a");

for( i = 0; i < p.length;i++){
    p[i].style.fontSize = "38px";
}



})();