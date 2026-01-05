// ==UserScript==
// @name         xdhehehehexdxdxd
// @namespace    http://middleout.foximeme.com
// @version      2.2.2
// @description  Best engage script you can currently find; have fun
// @author       foximeme (rewritten)
// @include       http://*.engageme.tv/*
// @include       http://engageme.tv/*
// @include       https://engageme.tv/*
// @grant        window.close
// @grant        window.open
// @grant        window.refresh
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/27615/xdhehehehexdxdxd.user.js
// @updateURL https://update.greasyfork.org/scripts/27615/xdhehehehexdxdxd.meta.js
// ==/UserScript==

//jwplayer().setCaptions({"color": "#ffffff", "backgroundColor": "#000000"});




//Vars
var adsearch = document.getElementsByClassName('jw-flag-ads');

var interval=3000;
var playing = jwplayer().play(true);
var error = jwplayer().on('adError');
var badad = jwplayer().on('adPause');

//for the whitescreen protection
var vs = jwplayer().stop();
var vi = jwplayer().on('idle');
var ve = jwplayer().on('error');
var pf = jwplayer().play(false);
var before = jwplayer().on('beforePlay');



setInterval(function() {
jwplayer().setVolume(0);
yesiam();
jwplayer().setCurrentQuality(2); //sets quality to 180p
jwplayer().play(true);
//jwplayer().addButton(icon("https://i.gyazo.com/7e3254881342d69237889a5d62c48724.png"), label("More Patch Options.."), id("7"));
}, 2000);



setInterval(function() {
interval=Math.round(Math.random()*12000+8000);
if (adsearch.length > 0)  {
    console.log('Searching for bad ads...');
    console.log('No bad ads found! Playing AD...');
	console.log(jwplayer().on('adImpression'));
  
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
    
    }, 300000);
}


//WhiteScreenRefresh

//setTimeout(function() {
//if (vs) {
   // console.log('White Screen! Restarting Engage..');
    //window.location.reload();
//}else{
    //jwplayer().play(true);
 // }

//}, 300000)


//Force Fetch Ads

if (before) {
	
	jwplayer().playAd('search.spotxchange.com/vast/2.0/155525?VPAID=1&content_page_url=http%3A%2F%2Fengageme.tv%2Fwatchfood.php%3Fclick%3D109689_1089969841%26prof%3D8571%26pub%3D109689%26sub1%3DEARNGG-118355009878484850906&cb=712840649626672400&player_width=1012&player_height=569&token[video_url]=%2F%2Fcontent.jwplatform.com%2Fmanifests%2FLUNA9kkU.m3u8');

}








//memprot - HAS GUI SUPPORT !!!1!1!

(function() {
    var countMe = GM_getValue('countMe', 25);
    var enCount = 0;
    jwplayer().on('adComplete', function(event){
        enCount++;
        console.log(enCount);
        if (enCount == countMe) {
            document.location.reload(true);
        }
    });
    $('<span style="border: 2px solid #42f489;padding: 4px;" title="# of ads to see before the tab resets to clear memory. I recommend 3"><input type="number" style="line-height:1px; width:90px;" size="3" id="countMe" value="" />?? Memprot by Fox 2.2</span>').insertBefore('.category-holder');
    $("#countMe").val(countMe);
    $("#countMe").change(function() {
        GM_setValue('countMe', $("#countMe").val());
        if (enCount > countMe) { setTimeout(function() { location.reload();  }, 2000); $('#countMe').html('Resetting'); }
        countMe = $("#countMe" + 'ads').val();
    });
})();