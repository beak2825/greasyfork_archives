// Kissanime was shut down this script has no use anymore unless you want to use parts of it in your own script
// ==UserScript==
// @name         KissAnime Ad Hider / Ad Blocker
// @version      0.3.3.0
// @description  Hides most if not all stupid Ads on kissanime.ru
// @author       NickTh3M4l4chi
// @match        https://kissanime.ru/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at document-body
// exclude https://kissanime.ru/Special/*
// @noframes
// @namespace https://greasyfork.org/users/582957
// @downloadURL https://update.greasyfork.org/scripts/404983/KissAnime%20Ad%20Hider%20%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/404983/KissAnime%20Ad%20Hider%20%20Ad%20Blocker.meta.js
// ==/UserScript==



var SleepTime = 1; // for easy adjustment of the Ad hiders but in most cases this won't be needed as this script is set to load AFTER the whole page is already loaded. If issues change the 1 to 100
var TimeOut = 10000; // this is to disable all clear all intervals AFTER 10 seconds in MS(1000MS is 1 second). This is because the "Hide" links don't show till after about 5 seconds and the extra 5 is for the sanity of the user



// Extra Notes

// This does not "block" Ads but it "hides" them from your view the second they appear on your screen. Most of the time you shouldn't see it at all.
// I am sure there is an easier way of doing all this with all those god dam repeat IDs but meh its all working for me. :P
// I Suggest you use this in junction with https://userscripts.adtidy.org/release/popup-blocker/2.5/popupblocker.user.js to block pop up Ads as well.




console.log('KissAnime Ad Hider checks starting now.')

// The Below are for random Iframe ads with roughly the same name. Please do not edit this :)
var AdsIfrme1Check = setInterval(function() {
    if ($('#adsIfrme1').length) { // Checking if this element exists
        $('#adsIfrme1').hide(); // Hides the element if it does exist
        clearInterval(AdsIfrme1Check); // after hiding the Ad it stops the loop from continuing anymore, as it will continue to see the element as it hasn't been removed but hidden from you.
    }
}, SleepTime);

var AdsIfrme2Check = setInterval(function() {
    if ($('#adsIfrme2').length) {
        $('#adsIfrme2').hide();
        clearInterval(AdsIfrme2Check);
    }
}, SleepTime);

var AdsIfrme3Check = setInterval(function() {
    if ($('#adsIfrme3').length) {
        $('#adsIfrme3').hide();
        clearInterval(AdsIfrme3Check);
    }
}, SleepTime);

var AdsIfrme4Check = setInterval(function() {
    if ($('#adsIfrme4').length) {
        $('#adsIfrme4').hide();
        clearInterval(AdsIfrme4Check);
    }
}, SleepTime);

var AdsIfrme5Check = setInterval(function() {
    if ($('#adsIfrme5').length) {
        $('#adsIfrme5').hide();
        clearInterval(AdsIfrme5Check);
    }
}, SleepTime);

var AdsIfrme6Check = setInterval(function() {
    if ($('#adsIfrme6').length) {
        $('#adsIfrme6').hide();
        clearInterval(AdsIfrme6Check);
    }
}, SleepTime);

var AdsIfrme7Check = setInterval(function() {
    if ($('#adsIfrme7').length) {
        $('#adsIfrme7').hide();
        clearInterval(AdsIfrme7Check);
    }
}, SleepTime);

var AdsIfrme8Check = setInterval(function() {
    if ($('#adsIfrme8').length) {
        $('#adsIfrme8').hide();
        clearInterval(AdsIfrme8Check);
    }
}, SleepTime);

var AdsIfrme9Check = setInterval(function() {
    if ($('#adsIfrme9').length) {
        $('#adsIfrme9').hide();
        clearInterval(AdsIfrme9Check);
    }
}, SleepTime);

var AdsIfrme10Check = setInterval(function() {
    if ($('#adsIfrme10').length) {
        $('#adsIfrme10').hide();
        clearInterval(AdsIfrme10Check);
    }
}, SleepTime);

var AdsIfrme11Check = setInterval(function() {
    if ($('#adsIfrme11').length) {
        $('#adsIfrme11').hide();
        clearInterval(AdsIfrme11Check);
    }
}, SleepTime);

var AdsIfrme12Check = setInterval(function() {
    if ($('#adsIfrme12').length) {
        $('#adsIfrme12').hide();
        clearInterval(AdsIfrme12Check);
    }
}, SleepTime);

// This is to "remove" the "Hide" text that will show after like 5 seconds of you loading the page
var divCloseButCheck = setInterval(function() {
    if ($('.divCloseBut').length) {
        $('.divCloseBut').remove(); isClickHide=true; return false; // This is taken right from the site itself
    }
}, SleepTime);


// This is to "remove" the left and right Ads
var RightAdCheck = setInterval(function() {
    if ($('#a2mdn_1034_r').length) {
        $('#a2mdn_1034_r').hide();
        clearInterval(RightAdCheck);
    }
    if ($("div[style='visibility:visible;width:336px;position:absolute;height:768px;left:50%;margin-left:500px;top:0;z-index:0;']").length) {
        $("div[style='visibility:visible;width:336px;position:absolute;height:768px;left:50%;margin-left:500px;top:0;z-index:0;']").hide();
        clearInterval(RightAdCheck);
    }
}, 10); // check every 10ms

var LeftAdCheck = setInterval(function() {
    if ($('#a2mdn_1034_l').length) {
        $('#a2mdn_1034_l').hide();
        clearInterval(LeftAdCheck);
    }
    if ($("div[style='visibility:visible;height:768px;width:336px;position:absolute;left:50%;margin-left:-836px;top:0;z-index:0;']").length) {
        $("div[style='visibility:visible;height:768px;width:336px;position:absolute;left:50%;margin-left:-836px;top:0;z-index:0;']").hide();
        clearInterval(LeftAdCheck);
    }
}, 10); // check every 10ms

// This targets the element containing the left and right Ads
var LeftAndRightAdsCheck = setInterval(function() {
    if ($("body > div:nth-child(8)").length) {
        $("body > div:nth-child(8)").hide()
        clearInterval(LeftAndRightAdsCheck);
    }
}, 10);


// This is to remove both of the upper Ads
var TopAdsCheck1 = setInterval(function() {
    if ($('#divAds').length) {
        $('#divAds').hide();
        clearInterval(TopAdsCheck1);
    }
}, 10); // check every 10ms

var TopAdsCheck2 = setInterval(function() {
    if ($('#divAds2').length) {
        $('#divAds2').hide();
        clearInterval(TopAdsCheck2);
    }
}, 10); // check every 10ms




// This is just for testing purposses you can 100% ignore it
var RandomNewAdsCheck = setInterval(function() {
    clearInterval(RandomNewAdsCheck);
}, 10);



// The below set is just for the Video Ads on the beta server. This needs 0 modification for now
var VideoAdCheck = setInterval(function() {
    if ($('.glx-iframe').length) {
        $('.glx-iframe').hide();
        console.log('Video Ad Cleared.')
        clearInterval(VideoAdCheck);
    }
}, 10); // check every 10ms



// This is for the new stupid Ads they have that covers the whole web page
// This interval does not clear as the popup does come back if you leave a page open long enough
var HomePageFullAd = setInterval(function() {
    if ($('._8gbs8j').length) {
        $('._8gbs8j').click();
        console.log('CLEARED 1')
    }
    if ($('._hpwhd9d').length) {
        $('._hpwhd9d').click();
        console.log('CLEARED 2')
    }
    // just remove the "//" below to enable this function if you are having issues with the popup
    //if ($('#_hevs2tr').length) {
    //    $('#_hevs2tr').hide();
    //    $('#p_3345130').hide();
    //    $("body").css({"overflow":"visible"}); // This will make it so you can scroll again
    //}
    if ($('._7e6wwq ').length) {
        $('._7e6wwq ').click();
        console.log('CLEARED 3')
    }
}, 10); // check every 10ms


// Right now these couple of lines dont actually do anything
var x = localStorage.getItem("NickLoaded");
if (x = "Loaded") {
  console.log("Already loaded anti Ad screen profile.")
}
else {
    localStorage.setItem("_NATIVE_3345130","1;1592507301802;9592507337328;9592503737328;0")
    localStorage.setItem("NickLoaded","Loaded");
}




console.log('All KissAnime Ad Hider checks are now running.')

// Below just clears MOST intervals after a set amount of time set at the top of the script
setTimeout(function(){
    // Clearing out all AdsIfrme# Checks
    clearInterval(AdsIfrme1Check)
    clearInterval(AdsIfrme2Check)
    clearInterval(AdsIfrme3Check)
    clearInterval(AdsIfrme4Check)
    clearInterval(AdsIfrme5Check)
    clearInterval(AdsIfrme6Check)
    clearInterval(AdsIfrme7Check)
    clearInterval(AdsIfrme8Check)
    clearInterval(AdsIfrme9Check)
    clearInterval(AdsIfrme10Check)
    clearInterval(AdsIfrme11Check)
    clearInterval(AdsIfrme12Check)
    // Clearing Hide Check
    clearInterval(divCloseButCheck)
    //Clearing Left and Right checks
    clearInterval(LeftAdCheck)
    clearInterval(RightAdCheck)
    clearInterval(LeftAndRightAdsCheck)
    // Just clearing my little testing checker
    clearInterval(RandomNewAdsCheck);
    // Clearing out Top Checks
    clearInterval(TopAdsCheck1)
    clearInterval(TopAdsCheck2)
    // Clearing out Video Check
    clearInterval(VideoAdCheck)
    console.log('All KissAnime Ad Hider checks have been stopped due to TimeOut.')
}, TimeOut)