// ==UserScript==
// @name     pepper mydealz url detracker
// @version  2
// @grant    none
// @include  https://www.pepper.pl/*
// @include  https://www.mydealz.de/*
// @namespace https://greasyfork.org/users/1079192
// @description Skrypt podmienia URL w komentarzach i treści okazji na link właściwy.
// @downloadURL https://update.greasyfork.org/scripts/469362/pepper%20mydealz%20url%20detracker.user.js
// @updateURL https://update.greasyfork.org/scripts/469362/pepper%20mydealz%20url%20detracker.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
  setTimeout(replaceURLs, 1000);
}, false);

function replaceURLs(){
  var urls = document.getElementsByClassName('link');
  for (let element of urls) {
    if (element.title){
      let repl = element.title;
      if (!repl.startsWith("http")){
        repl = "https://" + repl;
      }
    	element.href = repl;
    }
  }
  setTimeout(replaceURLs, 2000);
}