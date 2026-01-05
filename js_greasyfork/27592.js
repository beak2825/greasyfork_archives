// ==UserScript==
// @name        YouTube - Channel Link Converter
// @namespace   hapCodeJS
// @description Changes all links to channels to the Videos tab for that channel
// @include     https://www.youtube.com/*
// @include     http://www.youtube.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27592/YouTube%20-%20Channel%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/27592/YouTube%20-%20Channel%20Link%20Converter.meta.js
// ==/UserScript==
var pattern=new RegExp('^https://www.youtube.com/(user|channel)/[^/]*(?!/videos)$','i');
var links=document.getElementsByClassName('g-hovercard yt-uix-sessionlink       spf-link ');
function main(){
  for(var link=0;link<links.length;link++){
    if(pattern.test(links[link].href)){
      links[link].href+='/videos';
    }
  }
}
main();
