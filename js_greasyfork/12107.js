// ==UserScript==
// @name         Assmotes
// @namespace    Intended for Unoeme's
// @version      0.10
// @description  Memes
// @grant        none
// @copyright    2015
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/12107/Assmotes.user.js
// @updateURL https://update.greasyfork.org/scripts/12107/Assmotes.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},

var emotes = [
    { src:"http://i.imgur.com/4cGasFZ.jpg", width:50, height:50, title:'bait'},
    { src:"http://i.imgur.com/VozZp9a.jpg", width:98, height:55, title:'bigguy'},
    { src:"http://i.imgur.com/mQlmx4o.gif", width:46, height:55, title:'canteven'},
    { src:"http://i.imgur.com/ObIFFbr.gif", width:61, height:50, title:'cena'},
    { src:"http://i.imgur.com/09bHA1f.png", width:62, height:50, title:'damagecontrol'},
    { src:"http://i.imgur.com/sHJfV20.gif", width:48, height:60, title:'delectable'},
    { src:"http://i.imgur.com/8AlFMQY.gif", width:75, height:55, title:'drunktwat'},
    { src:"http://i.imgur.com/7Tocjvz.jpg", width:37, height:50, title:'hi'},
    { src:"http://i.imgur.com/3Lft6v7.gif", width:45, height:50, title:'jonstop'},
    { src:"http://i.imgur.com/vU13Hgh.gif", width:76, height:50, title:'judenpls'},
    { src:"http://i.imgur.com/pmrrYag.gif", width:68, height:50, title:'kick'},
    { src:"http://i.imgur.com/vVIMrEM.gif", width:72, height:50, title:'loafening'},
    { src:"http://i.imgur.com/5tRLBC4.gif", width:49, height:50, title:'lolilol'},
    { src:"http://i.imgur.com/1tR8UGZ.png", width:133, height:45, title:'mystery'},
    { src:"http://i.imgur.com/iilzWxx.jpg", width:41, height:55, title:'ohfuck'},
    { src:"http://i.imgur.com/i2rfbNJ.jpg", width:63, height:60, title:'rlytho'},
    { src:"http://i.imgur.com/X7rYeEX.png", width:57, height:55, title:'shitnigger'},
    { src:"http://i.imgur.com/uWJZKZa.png", width:52, height:50, title:'toplel'},
    { src:"http://i.imgur.com/XEmrnog.jpg", width:68, height:50, title:'trump'},
    { src:"http://i.imgur.com/hypI7ad.jpg", width:140, height:45, title:'victory'},
    { src:"http://i.imgur.com/2hlSZv7.jpg", width:75, height:55, title:'wowremyourehuge'},
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