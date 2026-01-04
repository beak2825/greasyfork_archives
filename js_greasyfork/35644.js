// ==UserScript==
// @name         Engagement.TV bot
// @namespace    http://middleout.foximeme.com
// @version      2.1.4
// @description  Best engage script you can currently find; have fun
// @author       foximeme (rewritten)
// @include       http://perk.tv/video/53741d8b-2148-4ab0-8b26-17a025968817/18c0775d-5363-4bce-bf3c-eb4a0403ee69
// @include       http://perk.tv/video/*
// @include       *://perk.TV/video/*
// @include       perk.tv/video/*
// @grant        window.close
// @grant        window.open
// @grant        window.refresh
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35644/EngagementTV%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/35644/EngagementTV%20bot.meta.js
// ==/UserScript==

//jwplayer().setCaptions({"color": "#ffffff", "backgroundColor": "#000000"});




//Finds ads.
var adsearch = document.getElementsByClassName('jw-flag-ads');

//Script.
var interval=13000;
var playing = jwplayer().play(true);
var error = jwplayer().on('adError');
var badad = jwplayer().on('adPause');

//for the whitescreen protection
var vs = jwplayer().stop();
var vi = jwplayer().on('idle');
var ve = jwplayer().on('error');
var pf = jwplayer().play(false);



setInterval(function() {
jwplayer().setVolume(9);
yesiam();
jwplayer().setCurrentQuality(2); //sets quality to 180p
jwplayer().play(true);
jwplayer().addButton(icon("https://i.gyazo.com/7e3254881342d69237889a5d62c48724.png"), label("More Patch Options.."), id("7"));
}, 2000);



setInterval(function() {
interval=Math.round(Math.random()*12000+8000);
if (adsearch.length > 0)  {
    console.log('Searching for bad ads...');
    console.log('No bad ads found! Playing...');
  
}else{
    jwplayer().next();
    console.log(jwplayer().getState());
}
console.log(interval);
}, interval);



//whitescreen temp

if (vs && vi && ve) {
    setTimeout(function() {
        window.location.reload();
    
    }, 2580000);
}


//WhiteScreenRefresh

//setTimeout(function() {
//if (vs) {
   // console.log('White Screen! Restarting Engage..');
    //window.location.reload();
//}else{
    //jwplayer().play(true);
 // }

//}, 1200000)






//memprot - HAS GUI SUPPORT !!!1!1!

(function() {
    var countMe = GM_getValue('countMe', 3);
    var enCount = 0;
    jwplayer().on('adComplete', function(event){
        enCount++;
        console.log(enCount);
        if (enCount == countMe) {
            window.location.reload();
        }
    });
    $('<span style="border: 2px solid #42f489;padding: 4px;" title="# of ads to see before the tab resets to clear memory. I recommend 12-36."><input type="number" style="line-height:1px; width:90px;" size="3" id="countMe" value="" />???? Memprot by Fox</span>').insertBefore('.category-holder');
    $("#countMe").val(countMe);
    $("#countMe").change(function() {
        GM_setValue('countMe', $("#countMe").val());
        if (enCount > countMe) { setTimeout(function() { location.reload();  }, 2000); $('#countMe').html('Resetting'); }
        countMe = $("#countMe" + "ads").val();
    });
})();