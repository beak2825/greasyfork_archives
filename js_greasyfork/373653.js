// ==UserScript==
// @name Twitch Link Handler Helper
// @namespace Violentmonkey Scripts
// @match https://www.twitch.tv/
// @match https://www.twitch.tv/directory/*
// @grant none
// 
// @version 3
// @description Converts Twitch video url into twitch:// URIs
// @downloadURL https://update.greasyfork.org/scripts/373653/Twitch%20Link%20Handler%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/373653/Twitch%20Link%20Handler%20Helper.meta.js
// ==/UserScript==
// 

function window_open(url){
  location.href = url;  
}
var opened = false;
function main() {
    twitch_urls = document.querySelectorAll('a.tw-interactive.tw-link[data-a-target="preview-card-image-link"]:not(.gm-modified)');
    if(twitch_urls.length > 0){
      twitch_urls.forEach(function(elem){
        var old_href = elem.getAttribute("href");
        if(old_href.indexOf('clips.twitch.tv') == -1 && old_href.indexOf('twitch://') == -1){
          elem_clone = elem.cloneNode(true);
          elem_clone.href='twitch:/'+old_href;
          elem_clone.className += " gm-modified";
          elem.parentNode.prepend(elem_clone);
          elem.parentNode.removeChild(elem);
        }
      });
    }
}

var twitchthumbs = null;
function runmo(){
  var moc = { attributes: false, childList: true, subtree: true };
  var mo = new MutationObserver(function(){
      main();
  });
  mo.observe(twitchthumbs, moc);
}

var checktwitchthumb = setInterval(function(){
  twitchthumbs = document.querySelector(".directory-root-page__content") || document.querySelector(".front-page__recommended-content-container") ;
  if(twitchthumbs){
    runmo();
    clearInterval(checktwitchthumb);
  }
}, 100);
