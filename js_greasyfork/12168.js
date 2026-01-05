// ==UserScript==
// @name         Remotes
// @namespace    Intended for Unoeme's
// @version      2.04
// @description  Memes
// @grant        none
// @copyright    2015
// @include     *://*.instasynch.com/*
// @include     *://instasynch.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/12168/Remotes.user.js
// @updateURL https://update.greasyfork.org/scripts/12168/Remotes.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},
//    NEW SYNTAX {"name":"entername","image":"imageurl"}

// http://tinyurl.com/Xx-remotes-xX

var emotes = [
    { src:"http://i.imgur.com/08e85B9.gif", width:67, height:50, title:'10'},
    { src:"http://i.imgur.com/mkZbyMJ.jpg", width:98, height:55, title:'4u'},
    { src:"http://i.imgur.com/8jSkRy4.gif", width:83, height:55, title:'a e s t h e t i c'},
    { src:"http://i.imgur.com/Ueq53IX.jpg", width:60, height:60, title:'aestheticfrog'},
    { src:"http://i.imgur.com/Ueq53IX.jpg", width:60, height:60, title:'aesthetic'},
    { src:"http://i.imgur.com/7lOShaN.jpg", width:50, height:50, title:'bait'},
    { src:"http://i.imgur.com/wooUTgz.png", width:66, height:60, title:'bebe'},
    { src:"http://i.imgur.com/Wqoqu4Y.jpg", width:98, height:55, title:'bigguy'},
    { src:"http://i.imgur.com/6irHkZQ.gif", width:46, height:55, title:'canteven'},
    { src:"http://i.imgur.com/GMPSC9m.jpg", width:70, height:70, title:'crabfeels'},
    { src:"http://i.imgur.com/hIGuhgF.png", width:62, height:50, title:'damagecontrol'},
    { src:"http://i.imgur.com/GpaV0TK.gif", width:48, height:60, title:'delectable'},
    { src:"http://i.imgur.com/90LKGem.gif", width:57, height:50, title:'doit'},
    { src:"http://i.imgur.com/Hz7GJcT.jpg", width:51, height:55, title:'expend'},
    { src:"http://i.imgur.com/H4Eur5e.png", width:40, height:37, title:'feelsbad'},
    { src:"http://i.imgur.com/EVm5q51.gif", width:69, height:50, title:'furrydance'},
    { src:"http://i.imgur.com/ny6U8su.png", width:55, height:55, title:'heyqt'},
    { src:"http://i.imgur.com/swU3vZO.jpg", width:37, height:50, title:'hi'},
    { src:"http://i.imgur.com/Xtf7PYC.gif", width:36, height:26, title:'isis'},
    { src:"http://i.imgur.com/6DlrOFa.gif", width:61, height:50, title:'john'},
    { src:"http://i.imgur.com/o9Mq4pX.gif", width:45, height:50, title:'jonstop'},
    { src:"http://i.imgur.com/p8U2Wxl.gif", width:76, height:50, title:'judenpls'},
    { src:"http://i.imgur.com/jtey67k.gif", width:68, height:50, title:'kick'},
    { src:"http://i.imgur.com/t9TnP2E.png", width:50, height:50, title:'killme'},
    { src:"http://i.imgur.com/HDZAHPF.jpg", width:60, height:60, title:'kys'},
    { src:"http://i.imgur.com/iiuPKtQ.gif", width:81, height:55, title:'leek'},
    { src:"http://i.imgur.com/28tuY4J.gif", width:72, height:50, title:'loafening'},
    { src:"http://i.imgur.com/sYEavuH.gif", width:49, height:50, title:'lolilol'},
    { src:"http://i.imgur.com/PanqfwP.png", width:133, height:45, title:'mystery'},
    { src:"http://i.imgur.com/ntFtGcG.png", width:55, height:55, title:'nagdaddy'},
    { src:"http://i.imgur.com/LYMjTKo.jpg", width:41, height:55, title:'ohfuck'},
    { src:"http://i.imgur.com/KEMGLHb.gif", width:150, height:50, title:'remgenda'},
    { src:"http://i.imgur.com/3KE2Lon.png", width:51, height:55, title:'retract'},
    { src:"http://i.imgur.com/udh484q.jpg", width:63, height:60, title:'rlytho'},
    { src:"http://i.imgur.com/cwk6hiK.png", width:57, height:55, title:'shitnigger'},
    { src:"http://i.imgur.com/gDyQACv.gif", width:73, height:55, title:'sigh'},
    { src:"http://i.imgur.com/mmdFI44.png", width:52, height:50, title:'toplel'},
    { src:"http://i.imgur.com/zOThS9F.jpg", width:68, height:50, title:'trump'},
    { src:"http://i.imgur.com/o9Mo1zk.jpg", width:140, height:45, title:'victory'},
    { src:"http://i.imgur.com/XofU7I9.gif", width:80, height:60, title:'welcome'},
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