// ==UserScript==
// @name         SomeCanadianScript
// @namespace    SomeCanadianEmotes
// @version      1.3.3
// @description  memes for the cool kids
// @grant        none
// @copyright    2015
// @include     *://*.instasynch.com/*
// @include     *://instasynch.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/12264/SomeCanadianScript.user.js
// @updateURL https://update.greasyfork.org/scripts/12264/SomeCanadianScript.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},


var emotes = [
    { src:"http://i.imgur.com/LgMX7Qd.gif", width:70, height:70, title:'myboy'},
    { src:"http://i.imgur.com/hv9pLeN.gif", width:65, height:65, title:'jose'},
    { src:"http://i.imgur.com/VBSo8yR.gif", width:70, height:70, title:'ballpark'},
    { src:"http://i.imgur.com/QOVenhw.gif", width:70, height:70, title:'nochance'},
    { src:"http://i.imgur.com/PLqvAyg.gif", width:65, height:65, title:'noway'},
    { src:"http://i.imgur.com/DRJmmtY.gif", width:60, height:80, title:'coolguy'},
    { src:"http://i.imgur.com/iFxNlWs.gif", width:65, height:70, title:'goforit'},
    { src:"http://i.imgur.com/qjKvhfL.png", width:60, height:60, title:'shake'},
    { src:"http://i.imgur.com/F96U5vU.png", width:65, height:65, title:'diklife'},
    { src:"http://i.imgur.com/7pHwlun.gif", width:60, height:80, title:'stripe'},
    { src:"http://i.imgur.com/3v9H4jN.gif", width:70, height:70, title:'sickbeat'},
    { src:"http://i.imgur.com/ZAcJ8AM.gif", width:60, height:80, title:'heart'},
    { src:"http://i.imgur.com/uYPQZfJ.gif", width:65, height:70, title:'fingerwag'},
    { src:"http://i.imgur.com/08o1MVJ.gif", width:60, height:70, title:'buzzkill'},
    { src:"http://i.imgur.com/eKELHpX.gif", width:60, height:70, title:'laugh'},
    { src:"http://i.imgur.com/1UIV3t1.gif", width:60, height:60, title:'midge'},
    { src:"http://i.imgur.com/Z7DcSVF.gif", width:60, height:70, title:'fish'},
    { src:"http://i.imgur.com/DjoziBB.gif", width:60, height:60, title:'alrighty'},
    { src:"http://i.imgur.com/nWA3DIz.gif", width:65, height:60, title:'ooh'},
    { src:"http://i.imgur.com/JKlbFoY.gif", width:65, height:60, title:'turnup'},
    { src:"http://i.imgur.com/OaZYsEx.gif", width:60, height:60, title:'runbow'},
    { src:"http://i.imgur.com/FIy3qY5.gif", width:60, height:60, title:'shake2'},
    { src:"http://i.imgur.com/2gdC6CL.gif", width:65, height:65, title:'charlie'},
    { src:"http://i.imgur.com/Cp8852C.png", width:70, height:75, title:'mademefeel'},
    { src:"http://i.imgur.com/68753q8.jpg", width:65, height:70, title:'body'},
    { src:"http://i.imgur.com/1pm8gnF.gif", width:65, height:65, title:'nice2'},
    { src:"http://i.imgur.com/VTV9Wt2.gif", width:80, height:65, title:'hotdog'},
    { src:"http://i.imgur.com/0kJ36w4.gif", width:64, height:65, title:'scream'},
    { src:"http://i.imgur.com/qy9ors9.jpg", width:55, height:55, title:'babby2'},
    { src:"http://i.imgur.com/z8dXP3f.jpg", width:60, height:65, title:'offended'},
    { src:"http://i.imgur.com/yXt1mhk.jpg", width:60, height:60, title:'idk2'},
    { src:"http://i.imgur.com/UoSAkON.gif", width:65, height:65, title:'red'},
    { src:"http://i.imgur.com/mtoHiSp.jpg", width:75, height:65, title:'scg'},
    { src:"https://i.imgur.com/Ex6EnHS.gif", width:75, height:65, title:'windy'},
    { src:"https://i.imgur.com/DGcBPyJ.gif", width:100, height:70, title:'sickriff'},
    { src:"http://i.imgur.com/s1oYd0B.gif", width:65, height:65, title:'exislayer'},
    { src:"http://i.imgur.com/RabAYe3.gif", width:65, height:70, title:'michellenice'},
    { src:"http://i.imgur.com/QVchr9p.jpg", width:65, height:70, title:'kawaiitwat'},
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