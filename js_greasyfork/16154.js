// ==UserScript==
// @name           ikarma's Penny PandAs (A9)
// @author         bottles
// @icon           http://i.imgur.com/7A20YB2.png
// @include        https://www.mturk.com/mturk/previewandaccept*
// @include        https://www.mturk.com/mturk/accept*
// @grant          GM_addStyle
// @description:en panda script
// @version        0.0.9
// @namespace      https://greasyfork.org/users/9054
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @description panda script
// @downloadURL https://update.greasyfork.org/scripts/16154/ikarma%27s%20Penny%20PandAs%20%28A9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/16154/ikarma%27s%20Penny%20PandAs%20%28A9%29.meta.js
// ==/UserScript==

//===[Settings]===\\
mCoinSound = new Audio("http://www.denhaku.com/r_box/sr16/sr16perc/histicks.wav"); //==[This is the path to the mp3 used for the alert]==\\//===[Settings]===\\ //==[Just change the url to use whatever sound you want]==\\

var urlsToLoad  = [
    'https://www.mturk.com/mturk/previewandaccept?groupId=3TM075AKEJMH8ZD2JEA4Y30XTRV2C3' // A9: apple slicer 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FQJF6D1R13FA16Z7U0DWDZPO3N29C' // A9: baster 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=33PEMSEYX7FW5XXGF5GZOR00E452EV' // A9: beer glass 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FQJF6D1R13FA16Z7U0DWDZPN7P29L' // A9: bottle brush 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3I7I3OEKSO5RDRJGJA5FI9IFER92D5' // A9: bottle opener 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9VG92AM' // A9: cake stencil 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3LLXQSS3GHKOBBXCAG0569L0Q5P2FI' // A9: cake topper 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9UKD2AX' // A9: chopsticks 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9TPE2A7' // A9: cocktail shaker 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MXFP9RGE5HYYULW5EE9NJUFC0W2BM' // A9: colander 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FQJF6D1R13FA16Z7U0DWDZPN7V29R' // A9: dish brush (palm size) 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FQJF6D1R13FA16Z7U0DWDZPN7W29S' // A9: dish rack 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MXFP9RGE5HYYULW5EE9NJUFB7X2B0' // A9: disposable cone coffee filter 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9TO92A0' // A9: dutch oven w/o lid 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MXFP9RGE5HYYULW5EE9NJUFB7U2BX' // A9: electric can opener 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MXFP9RGE5HYYULW5EE9NJUFB7Q2BT' // A9: flask 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FQJF6D1R13FA16Z7U0DWDZPN7U29Q' // A9: funnel 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TM075AKEJMH8ZD2JEA4Y30XTRW2C4' // A9: garlic press 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TM075AKEJMH8ZD2JEA4Y30XTRZ2C7' // A9: glass beer mug 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FQJF6D1R13FA16Z7U0DWDZPN7N29J' // A9: glass measuring cup 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30814BGWVEI8P7OI56O59UXD6KW2HA' // A9: ice cream scoop 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9TP72A0' // A9: ice cube tray 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9UGA2AM' // A9: icing dispenser tips 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TM075AKEJMH8ZD2JEA4Y30XUJR2CK' // A9: kitchen shears 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=33PEMSEYX7FW5XXGF5GZOR00E492EZ' // A9: knife sharpener machine 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9UKE2AY' // A9: mandoline 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TM075AKEJMH8ZD2JEA4Y30XTST2C3' // A9: martini glass 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9UK82AS' // A9: meat cleaver 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30814BGWVEI8P7OI56O59UXD6KV2H9' // A9: meat thermometer 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TM075AKEJMH8ZD2JEA4Y30XTSZ2C9' // A9: metal measuring cup (for dry ingredients) 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3I7I3OEKSO5RDRJGJA5FI9IFESB2D9' // A9: metal or ceramic beer stein 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MXFP9RGE5HYYULW5EE9NJUFB6X2BY' // A9: nutcracker 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FQJF6D1R13FA16Z7U0DWDZPOYO293' // A9: peeler 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=33PEMSEYX7FW5XXGF5GZOR00E462EW' // A9: pizza cutter 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9TP52AY' // A9: potato masher 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TM075AKEJMH8ZD2JEA4Y30XVRR2C1' // A9: sake cup 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FQJF6D1R13FA16Z7U0DWDZPO0V29E' // A9: saute pan (straight sides) 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3I7I3OEKSO5RDRJGJA5FI9IFES22D0' // A9: shot glass 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9TPA2A3' // A9: spatula 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9TPD2A6' // A9: splatter screen 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MXFP9RGE5HYYULW5EE9NJUFC3Y2BU' // A9: stockpot w/o lid 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FQJF6D1R13FA16Z7U0DWDZPO4P29G' // A9: tea cup and saucer 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3FQJF6D1R13FA16Z7U0DWDZPN7S29O' // A9: toaster oven 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9TPB2A4' // A9: tongs 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=33PEMSEYX7FW5XXGF5GZOR00E442EU' // A9: tumbler 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3I7I3OEKSO5RDRJGJA5FI9IFERA2D6' // A9: whisk 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9TOC2A3' // A9: wine glass 0.03
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MQQ4RVXA53TFKG4Z0EDS8A9TPC2A5' // A9: wine stopper (not vacuum type) 0.03
];

if ((urlsToLoad.indexOf(document.referrer) > -1 ) && (!(urlsToLoad.indexOf(window.location.href) > -1 ))) { // If cleared captcha, back button is pressed to continue reloading.
    window.history.back();
}

if ((urlsToLoad.indexOf(window.location.href) > -1 ) && (!($('input[name="userCaptchaResponse"]').length > 0))) { // Checks if url is above and if not captcha.
    FireTimer ();
}

if ((urlsToLoad.indexOf(window.location.href) > -1 ) && ($('input[name="userCaptchaResponse"]').length > 0)) { // Do something on captcha such as an alert.
    alert("Captcha Alert!"); //alert
    window.open('https://www.mturk.com/mturk/preview?groupId=3T4QHDVBXBLD2A4YZC57CBG4IE9ZWF'); // -Stop the CAPTCHA madness!!! Opens Copytext, change this if you want different captcha to open
    window.location.href = 'http://www.google.com'; // Stop the CAPTCHA madness!!!
}

//--- Catch new pages loaded by WELL BEHAVED ajax.
window.addEventListener ("hashchange", FireTimer,  false);

// Current link will reload if it accepts a HIT, if you have a full queue or if you hit page request error.
function FireTimer () {
    if ((document.getElementsByName("autoAcceptEnabled")[0]) || ($('span:contains("You have accepted the maximum number of HITs allowed.")').length > 0) || ($('td:contains("You have exceeded the maximum allowed page request rate for this website.")').length > 0)) {
        setTimeout(function() { location.reload(true); }, 1500); // 1000 == 1 second
        mCoinSound.play();
    } else {
        setTimeout(function() { GotoNextURL(); }, 2000); // 1000 == 1 second
    }
}

function GotoNextURL () {
    var numUrls     = urlsToLoad.length;
    var urlIdx     = urlsToLoad.indexOf (location.href);
    urlIdx++;
    if (urlIdx >= numUrls)
        urlIdx = 0;
    location.href   = urlsToLoad[urlIdx];
}