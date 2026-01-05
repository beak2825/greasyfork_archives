// ==UserScript==
// @name         WereEmotes
// @namespace    Unoeme's Room
// @version      1.1.2
// @description  Memes
// @grant        none
// @copyright    2015
// @include     *://*.instasynch.com/*
// @include     *://instasynch.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @match       *://*.instasync.com/r/*
// @match       *://instasync.com/r/*
// @author       wereyouthere
// @downloadURL https://update.greasyfork.org/scripts/12256/WereEmotes.user.js
// @updateURL https://update.greasyfork.org/scripts/12256/WereEmotes.meta.js
// ==/UserScript==
 
//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},
 
 
var emotes = [
    { src:"http://i.imgur.com/VaIvcfY.gif", width:112, height:90, title:'noice'},
    { src:"http://i.imgur.com/oyI2oVq.jpg", width:80, height:93, title:'triggered'},
    { src:"http://i.imgur.com/nQIygbg.png", width:100, height:100, title:'cancer'},
    { src:"http://i.imgur.com/mgDnfsM.jpg", width:89, height:122, title:'erect'},
    { src:"http://i.imgur.com/5BlHXDA.jpg", width:137, height:92, title:'suicide'},
    { src:"http://i.imgur.com/0vI42E7.jpg", width:88, height:88, title:'thirsty'},
    { src:"http://i.imgur.com/2AO1LuO.jpg", width:112, height:112, title:'disgusting'},
    { src:"http://i.imgur.com/Vyht958.png", width:81, height:81, title:'brutal'},
    { src:"http://i.imgur.com/vdFEsr7.gif", width:120, height:67, title:'whatareyoudoing'},
    { src:"http://i.imgur.com/4cVqGWO.gif", width:123, height:86, title:'chuckle'},
    { src:"http://i.imgur.com/8XUam7p.jpg", width:125, height:83, title:'edgy'},
    { src:"http://i.imgur.com/POyxN1Q.png", width:79, height:75, title:'youtried'},
    { src:"http://i.imgur.com/AoBToLx.jpg", width:100, height:100, title:'intense'},
    { src:"http://i.imgur.com/j9IuYwE.jpg", width:117, height:106, title:'whoputyouontheplanet'},
    { src:"http://i.imgur.com/BNjoJj2.gif", width:88, height:49, title:'10outof10'},
    { src:"http://i.imgur.com/rmaxNOk.jpg", width:87, height:74, title:'gold'},
    { src:"http://i.imgur.com/k7Vhbtc.jpg", width:100, height:54, title:'doubt'},
    { src:"http://i.imgur.com/Ky4C3WR.gif", width:75, height:125, title:'mlady'},
    { src:"http://i.imgur.com/z2vCZpP.jpg", width:125, height:93, title:'shutup'},
    { src:"http://i.imgur.com/snEEwx4.jpg", width:129, height:97, title:'nasty'},
    { src:"http://i.imgur.com/kGD0Hxj.jpg", width:113, height:111, title:'okaythen'},
    { src:"http://i.imgur.com/w7vkmk8.jpg", width:106, height:105, title:'butwhy'},
    { src:"http://i.imgur.com/4YDKb9d.jpg", width:90, height:68, title:'boo'},
    { src:"http://i.imgur.com/lcIeAtG.gif", width:105, height:78, title:'no'},
    { src:"http://i.imgur.com/XUGNTPY.gif", width:103, height:87, title:'orgasm'},
    { src:"http://i.imgur.com/aUhq8te.jpg", width:130, height:106, title:'dissapointment'},
    { src:"http://i.imgur.com/f6SJPGZ.jpg", width:105, height:78, title:'sillywilly'},
    { src:"http://i.imgur.com/6t51S5c.jpg", width:100, height:78, title:'what'},
    { src:"http://i.imgur.com/Qvqiqcn.png", width:100, height:100, title:'alright'},
    { src:"http://i.imgur.com/z7VZb2s.jpg", width:90, height:68, title:'hue'},
    { src:"http://i.imgur.com/MPOTDaA.gif", width:93, height:52, title:'hifive'},
    { src:"http://i.imgur.com/xFOZ4ma.gif", width:120, height:67, title:'rekt'},
    { src:"http://i.imgur.com/bBk4ZWe.png", width:100, height:100, title:'topkek'},
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