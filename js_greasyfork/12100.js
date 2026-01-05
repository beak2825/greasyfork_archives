// ==UserScript==
// @name         TGSscript
// @namespace    TGS's room
// @version      0.25
// @description  Memes
// @grant        none
// @copyright    2015
// @include     *://*.instasynch.com/*
// @include     *://instasynch.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/12100/TGSscript.user.js
// @updateURL https://update.greasyfork.org/scripts/12100/TGSscript.meta.js
// ==/UserScript==
 
//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},
 
 
var emotes = [
 { src:"http://25.media.tumblr.com/tumblr_ljh7li6E8b1qe13iio1_500.gif", width:120, height:100, title:'pentaface'},
{ src:"http://i323.photobucket.com/albums/nn455/Chuckie_081/779286-th_satanic_gif_01.gif", width:70, height:60, title:'stanmind'},
{ src:"http://38.media.tumblr.com/tumblr_maz1crB53J1qjmycco1_500.gif", width:90, height:75, title:'loading'},
{ src:"http://24.media.tumblr.com/7cc1c4ffe84e7ebf583bb32b21f9911f/tumblr_mvlyesxZKW1qg39ewo1_500.gif", width:70, height:50, title:'666'},
{ src:"http://31.media.tumblr.com/d91cf3c2f9259f68effbcab22b0af5b4/tumblr_nel5010FNP1qajzcfo1_500.gif", width:70, height:70, title:'cross1'},
{ src:"http://i.ytimg.com/vi/p2PbQ989kvA/maxresdefault.jpg", width:85, height:80, title:'DMT'}, 
{ src:"http://i.imgur.com/AMARQO8.png?1", width:65, height:70, title:'frank'}, 
{ src:"http://i.imgur.com/pFbVo4s.jpg?1", width:65, height:70, title:'kevin'},  
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