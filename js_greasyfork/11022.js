// ==UserScript==
// @name         JudgeZexion's Custom Emotes
// @namespace    Rooms
// @version      1.55
// @description  Custom Emotes!!!
// @grant        none
// @copyright    2015
// @include     *://*.instasynch.com/*
// @include     *://instasynch.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/11022/JudgeZexion%27s%20Custom%20Emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/11022/JudgeZexion%27s%20Custom%20Emotes.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},


var emotes = [
    { src:"https://i.ytimg.com/vi/Z6gG3tKDBlk/maxresdefault.jpg", width:100, height:60, title:'doit'},
    { src:"https://wwcdn.weddingwire.com/wedding/1120001_1125000/1123438/thumbnails/400x400_1346783188237-partyhard.jpg", width:110, height:110, title:'partyhard'},
    { src:"http://i.imgur.com/YqdnTBX.jpg", width:100, height:100, title:'bigblacknigga'},
    { src:"http://i.imgur.com/RFlgdxc.gif", width:90, height:120, title:'lipsuckin'},
    { src:"https://i.imgur.com/e59lUCu.gif", width:220, height:200, title:'bigblackgif'},
    { src:"http://i.imgur.com/c1hMV16.jpg", width:100, height:100, title:'fuckboy'},
    { src: "https://steamcommunity.com//economy/emoticon/:dappershark:", width:18, height:18, title:'dappershark'},
    { src: "http://images-cdn.moviepilot.com/image/upload/c_fill,h_296,w_480/t_mp_quality/screen-shot-2015-02-18-at-4-37-30-pm-the-russian-sleep-experiment-is-the-freakiest-story-ever-told-but-is-it-true-png-267188.jpg", width:120, height:100, title:'sleep'},
    { src:"https://i.imgur.com/Df8bSz6.gif", width:200, height:150, title:'snieg'},
    { src:"https://i.imgur.com/HdzRq4d.gif", width:200, height:125, title:'cut'},
    { src:"https://i.imgur.com/KlabckX.png", width:110, height:110, title:'tramplin'},
    { src: "http://images-cdn.moviepilot.com/image/upload/c_fill,h_296,w_480/t_mp_quality/screen-shot-2015-02-18-at-4-37-30-pm-the-russian-sleep-experiment-is-the-freakiest-story-ever-told-but-is-it-true-png-267188.jpg", width:1920, height:1280, title:'youaskedforthis'},
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