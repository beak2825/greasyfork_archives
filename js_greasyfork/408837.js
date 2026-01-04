// ==UserScript==
// @name         kissanime.nz ad hider
// @version      0.1.0
// @description  Use Adguard adblock, along with adguard's popup blocker, with this script to remove 99% of the ads on kissanime.nz(as far as I know anyways)
// @author       NickTh3m4l4chi
// @match        https://kissanime.nz/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at document-body
// exclude https://kissanime.ru/Special/*
// @noframes
// @namespace https://greasyfork.org/users/582957
// @downloadURL https://update.greasyfork.org/scripts/408837/kissanimenz%20ad%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/408837/kissanimenz%20ad%20hider.meta.js
// ==/UserScript==

// Links to AdGuard extension and the AdGuard popup blocker userscript below

// https://chrome.google.com/webstore/detail/adguard-adblocker/bgnkhhnnamicmpeenaelnjfhikgbkllg
// https://userscripts.adtidy.org/release/popup-blocker/2.5/popupblocker.user.js


var SleepTime = 1; // for easy adjustment of the Ad hiders but in most cases this won't be needed as this script is set to load AFTER the whole page is already loaded. If issues change the 1 to 100
var TimeOut = 10000; // this is to disable all clear all intervals AFTER 10 seconds in MS(1000MS is 1 second). This is because the "Hide" links don't show till after about 5 seconds and the extra 5 is for the sanity of the user

// Extra Notes

// This does not "block" Ads but it "hides" them from your view the second they appear on your screen. Most of the time you shouldn't see it at all.
// I am sure there is an easier way of doing all this with all those god dam repeat IDs but meh its all working for me. :P


// removes notifacations thingy
var NotifCheck1 = setInterval(function() {
    if ($('#onesignal-slidedown-container').length) { // Checking if this element exists
        $('#onesignal-slidedown-container').hide(); // Hides the element if it does exist
        clearInterval(NotifCheck1); // after hiding the Ad it stops the loop from continuing anymore, as it will continue to see the element as it hasn't been removed but hidden from you.
    }
}, SleepTime);

//Removes stupid upgrade thing that gets in the way on video pages. This one will not clear at the end of the script
var UpgradePopupCheck1 = setInterval(function() {
    if ($("#upgrade_pop").length) { // Checking if this element exists
        $("#upgrade_pop").remove(); // Hides the element if it does exist
        clearInterval(UpgradePopupCheck1); // after hiding the Ad it stops the loop from continuing anymore, as it will continue to see the element as it hasn't been removed but hidden from you.
    }
}, SleepTime);


setTimeout(function(){
    // Clearing Notifacations check
    clearInterval(NotifCheck1);
    // Clearing Upgrade Popup Check
    clearInterval(UpgradePopupCheck1);
    console.log('All KissAnime Ad Hider checks have been stopped due to TimeOut.')
}, TimeOut)