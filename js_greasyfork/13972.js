

// ==UserScript==
// @name         Dipmotes
// @namespace    Rooms
// @version      0.46
// @description  Formerly known as DwarfTyrone Shared Script
// @grant        none
// @copyright    2015
// @include     *http://*.instasynch.com*
// @include     *http://instasynch.com*
// @include     *http://*.instasync.com*
// @include     *http://instasync.com*
// @downloadURL https://update.greasyfork.org/scripts/13972/Dipmotes.user.js
// @updateURL https://update.greasyfork.org/scripts/13972/Dipmotes.meta.js
// ==/UserScript==



 /*$$$$$$ /$$$$$$ /$$$$$$                     
| $$__  $|_  $$_//$$__  $$                    
| $$  \ $$ | $$ | $$  \__/                    
| $$$$$$$  | $$ | $$ /$$$$                    
| $$__  $$ | $$ | $$|_  $$                    
| $$  \ $$ | $$ | $$  \ $$                    
| $$$$$$$//$$$$$|  $$$$$$/                    
|_______/|______/\______/                     
                                              
                                              
 /$$$$$$$ /$$       /$$$$$$  /$$$$$$ /$$   /$$
| $$__  $| $$      /$$__  $$/$$__  $| $$  /$$/
| $$  \ $| $$     | $$  \ $| $$  \__| $$ /$$/ 
| $$$$$$$| $$     | $$$$$$$| $$     | $$$$$/  
| $$__  $| $$     | $$__  $| $$     | $$  $$  
| $$  \ $| $$     | $$  | $| $$    $| $$\  $$ 
| $$$$$$$| $$$$$$$| $$  | $|  $$$$$$| $$ \  $$
|_______/|________|__/  |__/\______/|__/  \__/
                                              
                                              
 /$$   /$$/$$$$$$ /$$$$$$  /$$$$$$  /$$$$$$   
| $$$ | $|_  $$_//$$__  $$/$$__  $$/$$__  $$  
| $$$$| $$ | $$ | $$  \__| $$  \__| $$  \ $$  
| $$ $$ $$ | $$ | $$ /$$$| $$ /$$$| $$$$$$$$  
| $$  $$$$ | $$ | $$|_  $| $$|_  $| $$__  $$  
| $$\  $$$ | $$ | $$  \ $| $$  \ $| $$  | $$  
| $$ \  $$/$$$$$|  $$$$$$|  $$$$$$| $$  | $$  
|__/  \__|______/\______/ \______/|__/  |_*/ 



//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},


var emotes = [
//old dwarfmemes
    { src:"http://i.imgur.com/YAXiqfx.jpg", width:100, height:60, title:'doit'},
    { src:"http://i.imgur.com/5N9WvCX.jpg", width:110, height:110, title:'partyhard'},
    { src:"http://i.imgur.com/YqdnTBX.jpg", width:100, height:100, title:'bigblacknigga'},
    { src:"http://i.imgur.com/RFlgdxc.gif", width:90, height:120, title:'lipsuckin'},
    { src:"http://i.imgur.com/e59lUCu.gif", width:220, height:200, title:'bigblackgif'},
    { src:"http://i.imgur.com/c1hMV16.jpg", width:100, height:100, title:'fuckboy'},
    { src:"http://i.imgur.com/utG6MDy.png", width:18, height:18, title:'dappershark'},
    { src:"http://i.imgur.com/dvTegQX.jpg", width:120, height:100, title:'sleep'},
    { src:"http://i.imgur.com/Df8bSz6.gif", width:150, height:115, title:'snieg'},
    { src:"http://i.imgur.com/pm2jbj7.gif", width:150, height:94, title:'sack'},
    { src:"http://i.imgur.com/HdzRq4d.gif", width:125, height:100, title:'cut'},
    { src:"http://i.imgur.com/KlabckX.png", width:85, height:85, title:'tramplin'},
    { src:"http://i.imgur.com/dvTegQX.jpg", width:1920, height:1280, title:'youaskedforthis'},
    { src:"https://i.imgur.com/09J9qW6.gif", width:80, height:60, title:'hikevin'},
    { src:"http://i.imgur.com/mqgeVyb.png", width:50, height:65, title:'hi'},
//dipmotes
    { src:"http://i.imgur.com/wAYlycr.gif", width:50, height:49, title:'oooo'},
    { src:"http://i.imgur.com/ElR7zjL.png", width:50, height:50, title:'fsjal'},
    { src:"http://i.imgur.com/KXuKlX1.png", width:50, height:50, title:'post'},
    { src:"http://i.imgur.com/PCnx2sN.jpg", width:55, height:50, title:'uoykcuf'},
    { src:"http://i.imgur.com/GGzDb9a.jpg", width:55, height:50, title:'?'},
    { src:"http://i.imgur.com/4SbH0Ae.jpg", width:55, height:50, title:'??'},
    { src:"http://i.imgur.com/vroyEA4.png", width:55, height:50, title:'???'},
//twat
    { src:"http://i.imgur.com/aXTehuF.jpg", width:185, height:250, title:'nagitwat'},
    { src:"http://i.imgur.com/o80OvsD.jpg", width:75, height:75, title:'danktwat'},
    { src:"http://i.imgur.com/NzfzPWG.png", width:50, height:50, title:'raretwat'},
    { src:"http://i.imgur.com/Y1nceBb.png", width:50, height:50, title:'twatpepe'},
    { src:"http://puu.sh/k9u2g/1e787e099e.jpg", width:68, height:50, title:'ayytwat'},
    { src:"http://i.imgur.com/ipBzsZg.png", width:75, height:90, title:'animetwat'},
    { src:"http://i.imgur.com/wG00mfu.jpg", width:55, height:50, title:'hightwat'},
    { src:"http://i.imgur.com/WCd79wo.jpg", width:75, height:75, title:'snaptwat'},
    { src:"http://i.imgur.com/8lJAiIX.png", width:60, height:85, title:'sadtwat'},
    { src:"http://i.imgur.com/MgfvUcv.gif", width:50, height:49, title:'ootwat'},
    { src:"http://i.imgur.com/5puOLuI.gif", width:50, height:49, title:'oootwat'},


//clonemotes
    //i'll do this later maybe
//retired remotes
    //{ src:"http://i.imgur.com/k9xpUve.gif", width:100, height:100, title:'thefuck'},
    //{ src:"http://i.imgur.com/llw7y4f.gif", width:100, height:100, title:'canteven'},
    //{ src:"http://i.imgur.com/5MHy4wV.gif", width:95, height:70, title:'drunktwat'},
    //{ src:"http://i.imgur.com/y5vqwSl.jpg", width:56, height:75, title:'ohfuck'},
    //{ src:"http://i.imgur.com/L1ydcJP.gif", width:70, height:70, title:'lolilol'},
    //{ src:"http://i.imgur.com/8bGGKJL.gif", width:100, height:70, title:'loafening'},
    //{ src:"http://i.imgur.com/qVMBTzs.jpg", width:70, height:70, title:'bait'},
    //{ src:"http://i.imgur.com/wokwDxH.jpg", width:74, height:70, title:'rlytho'},
    //{ src:"hhttp://i.imgur.com/siA1Cve.gif", width:63, height:70, title:'jonstop'},
    //{ src:"http://i.imgur.com/E8Es0xC.jpg", width:217, height:70, title:'victory'},
    //{ src:"http://i.imgur.com/ELNtniv.png", width:70, height:68, title:'toplol'},
    //{ src:"http://i.imgur.com/m2jM85j.png", width:72, height:70, title:'toplel'},
    //{ src:"http://i.imgur.com/tQUFueD.gif", width:67, height:70, title:'delectable'},
    //{ src:"http://i.imgur.com/belpqK0.gif", width:250, height:250, title:'mindcrush'},
    //{ src:"http://i.imgur.com/2YOG5cO.gif", width:60, height:90, title:'judenpls'},
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