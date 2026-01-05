// ==UserScript==
// @name         Goghmotes
// @namespace    Rooms
// @version      0.58
// @description  some alright emotes i guess
// @grant        none
// @copyright    2015
// @include     *http://*.instasynch.com*
// @include     *http://instasynch.com*
// @include     *http://*.instasync.com*
// @include     *http://instasync.com*
// @downloadURL https://update.greasyfork.org/scripts/14989/Goghmotes.user.js
// @updateURL https://update.greasyfork.org/scripts/14989/Goghmotes.meta.js
// ==/UserScript==



//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},


var emotes = [
//old dwarfmemes
    { src:"http://i.imgur.com/xQ7Vewh.jpg", width:100, height:60, title:'topgun'},
    { src:"http://i.imgur.com/uDL1a7E.png", width:80, height:130, title:'shrepepe'},
    { src:"http://i.imgur.com/YvW0tT7.png", width:100, height:100, title:'youdip'},
    { src:"http://i.imgur.com/c1mLwLO.jpg", width:220, height:200, title:'sin'},
    { src:"http://i.imgur.com/h5Tnbt0.jpg", width:220, height:200, title:'sithlord'},
    { src:"http://i.imgur.com/1gSa9FL.gif", width:100, height:100, title:'rockroll'},
    { src:"http://i.imgur.com/fWn9BjI.gif", width:100, height:100, title:'bruh'},
    { src:"http://i.imgur.com/aA1Xbmd.jpg", width:130, height:40, title:'wtfthefuck'},
    { src:"http://i.imgur.com/ov0YP79.jpg", width:200, height:60, title:'sweecool'},
    { src:"http://i.imgur.com/A6V7ia3.jpg", width:200, height:60, title:'sweefuckyou'},
    { src:"http://i.imgur.com/qEiGtmK.gif", width:150, height:150, title:'earthquake'},
    { src:"http://i.imgur.com/CCtYVbW.gif", width:180, height:100, title:'cenawut'},
    { src:"http://i.imgur.com/2hQu2k8.gif", width:100, height:100, title:'squish'},
    { src:"http://i.imgur.com/NFfiDkw.gif", width:100, height:100, title:'sparkle'},
    { src:"http://i.imgur.com/YCbqRIb.gif", width:100, height:100, title:'blush'},
    { src:"http://i.imgur.com/Cl8z9OP.png", width:100, height:100, title:'goghpls'},
    { src:"http://i.imgur.com/LFv765R.png", width:200, height:180, title:'gin'},
    { src:"http://i.imgur.com/0LeCr7I.png", width:100, height:150, title:'dip'},
    { src:"http://i.imgur.com/HPwgg7z.jpg", width:250, height:200, title:'nagi'},
    { src:"http://i.imgur.com/TC8LBXP.png", width:250, height:200, title:'twattruth'},
    { src:"http://i.imgur.com/yOV3RFT.png", width:100, height:100, title:'urdad'},
    { src:"http://i.imgur.com/EMlMmVK.png", width:100, height:100, title:'discord'},
  

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