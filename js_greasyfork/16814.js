// ==UserScript==
// @name         Tuvaremotes Z
// @namespace    Tuvaro
// @version      4.01
// @description  New maymays
// @grant        none
// @copyright    2016
// @include     	*://*.instasync.com/r/*
// @include     	*://instasync.com/r/*
// @match       	*://*.instasync.com/r/*
// @match       	*://instasync.com/r/*
// @downloadURL https://update.greasyfork.org/scripts/16814/Tuvaremotes%20Z.user.js
// @updateURL https://update.greasyfork.org/scripts/16814/Tuvaremotes%20Z.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},


var emotes = [
    { src:'http://dl.dropboxusercontent.com/u/13049328/robotnik.png', width:64, height:64, title:'peace' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/lepointy.gif', width:64, height:64, title:'pointy' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/rapetime2.png', width:120, height:80, title:'rapehd' },
    { src:'http://i.imgur.com/MCEZvBi.jpg', width:120, height:80, title:'forhim' },
    { src:'http://i.imgur.com/4aGWEjk.jpg', width:80, height:70, title:'howdareu' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/1414518384612.png', width:80, height:64, title:'harold' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/oil.png', width:64, height:64, title:'oil' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/123jew.jpg', width:87, height:76, title:'123jew' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/6ff.gif', width:100, height:70, title:'getout' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/1367921949649.gif', width:86, height:86, title:'hotdogs' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/diebronyscum.gif', width:96, height:54, title:'brony' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/eggbaby.jpg', width:64, height:64, title:'eggbaby' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/yehaw.jpg', width:90, height:75, title:'yehaw' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/babyjesus.gif', width:96, height:64, title:'babyjesus' },
    { src:'http://i.imgur.com/ZQV1oz3.jpg', width:64, height:50, title:'gamergrill' },
    { src:'http://i.imgur.com/wRyZbgY.jpg', width:63, height:84, title:'loyalty' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tittays.jpg', width:64, height:64, title:'tittays' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/blowit.png', width:90, height:90, title:'blowit' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/cringe2.gif', width:64, height:64, title:'cringehd' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/wimmin.gif', width:80, height:60, title:'wimmin' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/emofdr.png', width:54, height:54, title:'emofdr' },
    { src:'http://i.imgur.com/myhO4eG.png', width:64, height:64, title:'douge' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/ogrelord.png', width:64, height:64, title:'ogrelord' },
    { src:'http://i.imgur.com/WRX3Szn.gif', width:96, height:75, title:'trump' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/feelclub.jpg', width:64, height:77, title:'feelclub' },
    { src:'http://i.imgur.com/zbBp9vY.png', width:64, height:64, title:'killfrog' },
    { src:'http://i.imgur.com/dCpMFGg.png', width:64, height:64, title:'trooperfrog' },
    { src:'http://i.imgur.com/dCpMFGg.png', width:64, height:64, title:'smugtrooper' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/pussyallday.gif', width:100, height:80, title:'dragon' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/doggystyle.jpg', width:96, height:54, title:'doggystyle' },
    { src:'http://i.imgur.com/waG9l0D.jpg', width:64, height:64, title:'ultrafrog' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/gucci.gif', width:99, height:60, title:'gucci' },
    { src:'http://i.imgur.com/DfOXbu3.png', width:64, height:64, title:'tuvaro' },
    { src:'http://i.imgur.com/DfOXbu3.png', width:64, height:64, title:'tuv' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/mlghd.gif', width:86, height:48, title:'mlghd' },
    { src:'http://i.imgur.com/ZOk0BMd.gif', width:100, height:80, title:'moneymoney' },
    { src:'http://i.imgur.com/sn24dxP.png', width:64, height:64, title:'recovery' },
    { src:'http://i.imgur.com/g8MbxmK.png', width:64, height:64, title:'rly?' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/laku.gif', width:80, height:60, title:'laku' },
    { src:'http://i.imgur.com/vv8NIpH.jpg', width:64, height:64, title:'666' },
    { src:'http://i.imgur.com/vv8NIpH.jpg', width:64, height:64, title:'satan' },
    { src:'http://i.imgur.com/r7NjtK3.png', width:45, height:60, title:'trans' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/ggggay.gif', width:80, height:58, title:'gggay' },
    { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/jiggy.gif', width:80, height:60, title:'jiggy' },
    { src:'http://imgur.com/L8an0G7.jpg', width:50, height:45, title:'hiss' },
       { src:'http://imgur.com/LXrXUgg.jpg', width:50, height:64, title:'trashfrog' },
       { src:'http://imgur.com/JF3ftmP.jpg', width:50, height: 50, title:'gamerfrog' },
       { src:'http://imgur.com/73Azsw4.jpg', width:50, height:50, title:'babbyfrog' },
       { src:'http://imgur.com/Oyzniy0.jpg', width:50, height:50, title:'mischief' },
       { src:'http://imgur.com/VR6XnMq.jpg', width:64, height:64, title:'mlgfrog' },
       { src:'http://imgur.com/HjDEo6u.jpg', width:50, height:50, title:'tendies' },
       { src:'http://imgur.com/SZ87ugG.jpg', width:96, height:75, title:'noice' },
       { src:'http://i.imgur.com/mUIPuE0.png', width:62, height:86, title:'believe' },
       { src:'http://i.imgur.com/T018E6k.png', width:62, height:86, title:'51' },
       { src:'http://i.imgur.com/KJTRNde.jpg', width:86, height:62, title:'space' },
       { src:'http://i.imgur.com/ISPO9bw.png', width:64, height:64, title:'alpha' },
       { src:'http://i.imgur.com/fxqNjFU.png', width:64, height:64, title:'beta' },
       { src:'http://i.imgur.com/xj9ke1o.png', width:64, height:64, title:'omega' },
       { src:'http://i.imgur.com/5tMU4EY.gif', width:80, height:64, title:'tomado' },
       { src:'http://i.imgur.com/OxCq0Hb.jpg', width:64, height:64, title:'what' },
       { src:'http://i.imgur.com/ztDVM8f.jpg', width:50, height:50, title:'peppafrog' },
       { src:'http://i.imgur.com/kpN9WE5.gif', width:100, height:80, title:'killit' },
       { src:'http://i.imgur.com/57se64i.png', widht:64, height:77, title:'suparage' },
       { src:'http://i.imgur.com/h2e5kaP.gif', width:87, height:76, title:'toppestkek' },
       { src:'http://i.imgur.com/oSAyM2F.gif', width:64, height:64, title:'shiaclap' },
       { src:'http://i.imgur.com/rYqhu5w.jpg', width:64, height:64, title:'hell' },
       { src:'https://dl.dropboxusercontent.com/u/13049328/tuvaremotes/suck.gif', width:100, height:59, title:'suck' },
       { src:'http://i.imgur.com/BqChvvt.png', width:64, height:64, title:' ' },
       { src:'http://i.imgur.com/BqChvvt.png', width:64, height:64, title:' ' },
       { src:'https://dl.dropboxusercontent.com/u/13049328/tuvaremotes/belt.gif', width:100, height:71, title:'belt' },
       { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/briona.gif', width:100, height:75, title:'briona' },
       { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/goodbye.gif', width:100, height:80, title:'goodbye' },
       { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/japfail.gif', width:100, height:56, title:'japfail' },
       { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/kappy.gif', width:100, height:68, title:'kappy' },
       { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/killbaby.gif', width:80, height:55, title:'killbaby' },
       { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/tint.gif', width:110, height:66, title:'tint' },
       { src:'http://i.imgur.com/G9OPrVO.png', width:120, height:48, title:'salt' },
       { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/gahh.gif', width:139, height:75, title:'gahh' },
       { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/cheesy.gif', width:126, height:85, title:'cheesy' },
       { src:'http://dl.dropboxusercontent.com/u/13049328/tuvaremotes/funwithmiku.gif', width:100, height:75, title:'funwithmiku' },
       { src:'http://i.imgur.com/LwaH5GK.png', width:91, height:66, title:'heyy' },
       { src:'http://i.imgur.com/8u3Drdt.jpg', width:58, height:58, title:'wew' },
       { src:'http://i.imgur.com/WboQ18W.gif', width:100, height:56, title:'ulike' },
       { src:'http://i.imgur.com/BnP4aaq.gif', width:88, height:56, title:'fuckit' },
       { src:'http://i.imgur.com/aaDyOT2.jpg', width:89, height:66, title:'smugdog' },
       { src:'http://i.imgur.com/lcWIeUU.png', width:42, height:50, title:'kappa' },
       { src:'http://i.imgur.com/dew5z90.gif', width:83, height:50, title:'whatswrongwithu' },
       { src:'http://i.imgur.com/SQFGRLa.gif', width:83, height:50, title:'fastur' }
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