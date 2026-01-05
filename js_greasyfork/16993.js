// ==UserScript==
// @name         Homotes
// @namespace    Theflyinghobo
// @version      1.18
// @description  Dont Hurt Me
// @grant        none
// @copyright    2016
// @include     	*://*.instasync.com/r/*
// @include     	*://instasync.com/r/*
// @match       	*://*.instasync.com/r/*
// @match       	*://instasync.com/r/*
// @downloadURL https://update.greasyfork.org/scripts/16993/Homotes.user.js
// @updateURL https://update.greasyfork.org/scripts/16993/Homotes.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},


var emotes = [
    { src:'http://i.imgur.com/fORk0Wt.jpg', width:90, height:80, title:'cwap' },
    { src:'http://i.imgur.com/szkGPF1.jpg', width:50, height:70, title:'bapst' },
    { src:'http://i.imgur.com/jrHDBkf.jpg', width:64, height:64, title:'banana' },
    { src:'http://i.imgur.com/r0VQMa6.jpg', width:96, height:64, title:'haram' },
    { src:'http://i.imgur.com/E4EyvAR.jpg', width:64, height:64, title:'noosepepe' },
    { src:'http://i.imgur.com/Ho7VPAN.jpg', width:64, height:64, title:'sharkpepe' },
    { src:'http://i.imgur.com/caAgvj0.jpg', width:64, height:64, title:'sanicpepe' },
    { src:'http://i.imgur.com/SALMjSA.jpg', width:45, height:60, title:'urkel' },
       { src:'http://i.imgur.com/RBrFjDi.jpg', width:64, height:64, title:'bernie' },
    { src:'http://i.imgur.com/wgnHtH0.jpg', width:60, height:80, title:'sike' },
    { src:'http://i.imgur.com/KruUWY4.jpg', width:60, height:36, title:'jeb' },
    { src:'http://i.imgur.com/DdftYf7.jpg', width:60, height:60, title:'gadget' },
    { src:'http://i.imgur.com/9jC8Upu.jpg', width:60, height:60, title:'checkem' },
    { src:'http://i.imgur.com/4c8CXar.jpg', width:60, height:60, title:'moist' },
    { src:'http://i.imgur.com/2Yw8sKo.jpg', width:60, height:60, title:'nemo' },
    { src:'http://i.imgur.com/LIv8ZLK.gif', width:60, height:60, title:'cis' },
    { src:'http://i.imgur.com/Tfi09dN.jpg', width:60, height:45, title:'wonka' },
    { src:'http://i.imgur.com/kbpku7n.gif', width:60, height:60, title:'javert' },
    { src:'http://i.imgur.com/B91p3ZC.jpg', width:69, height:90, title:'skip' },
    { src:'http://i.imgur.com/BfRcyTx.gif', width:70, height:40, title:'mfdoom' },
    { src:'http://i.imgur.com/zuLpFX4.jpg', width:55, height:55, title:'halal' },
    { src:'http://i.imgur.com/rOVG687.jpg', width:55, height:55, title:'zack' },
    { src:'http://i.imgur.com/rMTZNZN.jpg', width:55, height:55, title:'spiderpepe' },
    { src:'http://i.imgur.com/ry3xqAs.png', width:55, height:55, title:'hdpepe' },
    { src:'http://i.imgur.com/otH6mdE.png', width:55, height:55, title:'spongepepe' },
    { src:'http://i.imgur.com/Vsugc3y.jpg', width:55, height:55, title:'tardpepe' },
    { src:'http://i.imgur.com/w2cRn89.jpg', width:55, height:55, title:'firepepe' },
    { src:'http://i.imgur.com/aUKE6mp.jpg', width:55, height:55, title:'corruptpepe' },
    { src:'http://i.imgur.com/fgKD7RK.jpg', width:55, height:55, title:'heisenpepe' },
    { src:'http://i.imgur.com/VAuvmXM.jpg', width:55, height:55, title:'neonpepe' },
    { src:'http://i.imgur.com/lCWOFKI.jpg', width:55, height:40, title:'marco' },
    { src:'http://i.imgur.com/PnBRsJj.jpg', width:55, height:40, title:'carly' },
    { src:'http://i.imgur.com/9NEvEvP.jpg', width:55, height:40, title:'turtle' },
    { src:'http://i.imgur.com/hvscsyR.jpg', width:90, height:90, title:'zach' },
    { src:'http://i.imgur.com/pDXKU7f.jpg', width:90, height:90, title:'crunk' },
    { src:'http://i.imgur.com/vLqhT0w.jpg', width:60, height:80, title:'fred' },
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