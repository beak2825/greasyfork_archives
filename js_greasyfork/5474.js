// ==UserScript==
// @name        Instasynch emotes loader
// @namespace   Bibby
// @description Template for IntsaSync emote userscript
// @version     1.08
// @license     MIT
// @author      Zod-
// @grant       none

// @include     *://*.instasynch.com/*
// @include     *://instasynch.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*

// @downloadURL https://update.greasyfork.org/scripts/5474/Instasynch%20emotes%20loader.user.js
// @updateURL https://update.greasyfork.org/scripts/5474/Instasynch%20emotes%20loader.meta.js
// ==/UserScript==

var emotes = [
    //{ src:"http://i.imgur.com/uWCIsFe.jpg", width:55, height:55, title:'anita'},
    //{ src:"http://i.imgur.com/uWCIsFe.jpg", width:55, height:55, title:'anita'}
    ];
 
function addEmotes(){
    emotes.forEach(function(emote){
        window.$codes[emote.title || emote.name] = $('<img>', emote)[0].outerHTML;
    });
}
 
function main(){
    if(!window.$codes || Object.keys(window.$codes).length === 0){
        setTimeout(main, 75);
    }else{
        addEmotes();    
    }
}
if (window.document.readyState === 'complete') {
  main();
} else {
  window.addEventListener('load', main, false);
}