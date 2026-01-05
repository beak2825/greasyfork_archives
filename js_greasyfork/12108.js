// ==UserScript==
// @name         Assmotes
// @namespace    Intended for Unoeme's
// @version      0.52
// @description  Memes
// @grant        none
// @copyright    2015
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @include     *://*.instasync.com/*
// @include     *://instasync.com/*
// @downloadURL https://update.greasyfork.org/scripts/12108/Assmotes.user.js
// @updateURL https://update.greasyfork.org/scripts/12108/Assmotes.meta.js
// ==/UserScript==

//    { src:"", width:, height:, title:''},
//    { src:"", width:, height:, name:''},

var emotes = [
    { src:"http://puu.sh/kiLw2/c5481917fd.jpg", width:99999, height:99999, title:'youaskedforthis'},
    { src:"https://i.imgur.com/e59lUCu.gif", width:99999, height:99999, title:'bigblackgif2'},
    { src:"http://puu.sh/jXcy6/6bfcc921b2.png", width:103, height:18, title:'remtreefiddy'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:1920, height:1080, title:'assassassass1080p'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassass'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassass'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assass'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'ass'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'ass4'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assx4'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'asstothepowerof4'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassass1'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassass2'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassass3'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassass4'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassass5'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassass6'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassass7'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassass8'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassass9'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'thebestblacknameonthissite'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'iloveassassassass'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'ass4lovesass4'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'remlovesass4'},
    { src:"http://puu.sh/kgbsd/79c33616a3.jpg", width:100, height:100, title:'twatlovesass4'},
    { src:"http://puu.sh/kqZnX/cab773b2e2.png", width:40, height:54, title:'twatkek'},
    { src:"http://i.imgur.com/i675pWL.gif", width:240, height:180, title:'tomrtoes'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'dippleslovesass4'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassassislovedbylots'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assx4islovebylots'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'unoemelovesass4'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassassisunoemesfavorite'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassassiseveryonesfavrotie'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'fuckeduplovesass4'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'mesayingthisguyhassomemoms'},
    { src:"http://puu.sh/kbV46/680314b31d.jpg", width:100, height:100, title:'gothictwat'},
    { src:"http://i.imgur.com/xIO0OrU.jpg", width:150, height:100, title:'unotwat'},
    { src:"https://puu.sh/lW4Gz/5f63bc1ec5.jpg", width:90, height:80, title:'gogh'},
    { src:"http://puu.sh/lW4WH/8accf0e81b.jpg", width:509, height:321, title:'secretgogh'},
    { src:"http://puu.sh/kqY1H/6a6fd5e9e4.jpg", width:130, height:100, title:'happytwat'},
    { src:"http://puu.sh/kjMdT/b2f71e7e8a.jpg", width:130, height:100, title:'niggatwat'},
    { src:"http://puu.sh/kovVh/16f65a18d5.jpg", width:120, height:93, title:'twatpussy'},
    { src:"http://i.imgur.com/Kj8YVFX.gif", width:60, height:44, title:'twatfrog'},
    { src:"http://puu.sh/lW76Q/1e3de56113.jpg", width:256, height:233, title:'goghicus'},
    { src:"http://puu.sh/lW76Q/1e3de56113.jpg", width:256, height:233, title:'goghicus'},
    { src:"http://puu.sh/kA2dx/2cbd1d8dee.jpg", width:339, height:804, title:'milk'},
    { src:"http://i.imgur.com/iwHTAak.gif", width:55, height:38, title:'twuane'},
    { src:"http://i.imgur.com/Kdjn5CU.gif", width:50, height:38, title:'gotwat'},
    { src:"http://i.imgur.com/wg2LvlQ.gif", width:40, height:40, title:'otwat'},
    { src:"http://i.imgur.com/QbN2wYy.jpg", width:391, height:697, title:'secrettwat'},
    { src:"http://i.imgur.com/3RPYHKM.jpg", width:619, height:348, title:'youliterallyfuckanimalsyoutwat'},
    { src:"http://i.imgur.com/Fe427e0.gif", width:50, height:49, title:'ooootwat'},
    { src:"http://puu.sh/kFWmG/3c4e0046c7.jpg", width:105, height:172, title:'lewdtwat'},
    { src:"http://puu.sh/jc6Yk.jpg", width:360, height:268, title:'whylive'},
    { src:"https://puu.sh/lW2V7/5941623260.jpg", width:435, height:348, title:'ho'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'blulovesass4'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'scglovesass4alot'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'discordlovesass4'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'twatlovesass4twiceasmuch'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'assassassassisthecoolestusernamebyfar'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'iwouldputeveryuseronherebutthatwouldbehard'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'insertnamelovesass4'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'mfwiwastedagood10minutesdoingallthis'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'hiddenemote'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'secretemote'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'onedayiwillownthisroom'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'oneday'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'ididit'},
    { src:"http://puu.sh/jXcGi/35f0065366.png", width:96, height:18, title:'thebestmodonthissite'},
    
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