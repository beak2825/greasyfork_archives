// ==UserScript==
// @name         Anonmotes
// @namespace    
// @version      0.2
// @description  its stuff 
// @author       AnonSage
// @match        ?
// @grant        none
// @include     *://*.instasynch.com/*
// @include     *://instasynch.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/13734/Anonmotes.user.js
// @updateURL https://update.greasyfork.org/scripts/13734/Anonmotes.meta.js
// ==/UserScript==

// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},

var emotes = [
    { src:"http://i.imgur.com/HD4XXFB.jpg", width:68, height:50, title:'sadbart'},
    { src:"http://i.imgur.com/Dkg0BMN.jpg", width:68, height:50, title:'thisnig'},
    { src:"http://i.imgur.com/8zisOkw.jpg", width:68, height:50, title:'tom'},
    { src:"http://i.imgur.com/jpiWPkf.png", width:68, height:50, title:'britfeel'},
    { src:"http://i.imgur.com/a7R4mFZ.jpg", width:68, height:50, title:'bullshit'},
    { src:"http://i.imgur.com/A66DgBm.jpg", width:68, height:50, title:'nofun'},
    { src:"http://i.imgur.com/n2orC6o.png", width:68, height:50, title:'peels'},
    { src:"http://i.imgur.com/yhXR8QJ.png", width:68, height:50, title:'dreams'},
    { src:"http://i.imgur.com/gzvqlmy.jpg", width:68, height:50, title:'die'},
    { src:"http://i.imgur.com/5iFVWtM.jpg", width:68, height:50, title:'neverends'},
    { src:"http://i.imgur.com/otSQv2C.jpg", width:68, height:50, title:'fucktard'},
    { src:"http://i.imgur.com/NqCvw8A.jpg", width:68, height:50, title:'fuckingcat'},
    { src:"http://i.imgur.com/FkilB3w.png", width:68, height:50, title:'bab'},
    { src:"http://i.imgur.com/7vnwbvh.jpg", width:68, height:50, title:'drpepe'},
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