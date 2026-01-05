
// ==UserScript==
// @name         Nigmotes
// @namespace    Rooms
// @version      0.58.3
// @description  Giant errect minion penis
// @grant        none
// @copyright    2015
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/16884/Nigmotes.user.js
// @updateURL https://update.greasyfork.org/scripts/16884/Nigmotes.meta.js
// ==/UserScript==


//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},


//emotes organized by date added


var emotes = [

//nigmotes
    { src:"http://i.imgur.com/SUr2EXY.jpg", width:100, height:60, title:'johncena'},
    { src:"http://i.imgur.com/JPyglMD.jpg", width:100, height:70, title:'escape'},
    { src:"http://i.imgur.com/Y8tKvUW.jpg", width:100, height:70, title:'hellosatan'},
    { src:"http://i.imgur.com/0b9cJ1s.jpg", width:190000, height:300000, title:'minion'},
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
