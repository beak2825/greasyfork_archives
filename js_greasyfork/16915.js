// ==UserScript==
// @name         SkipButtons
// @namespace    https://greasyfork.org/en/users/29638-guy
// @version      1.2.7-unoffical
// @description  Try to take over the world!
// @author       R.F Geraci, Guy
// @copyright    2014+, RGSoftware (2016+, Guy)
// ============ Video Links Indexers ============
// @include      *projectfree-tv.to/cale*
// @include      *thewatchseries.to/cale*
// @include      *watchseries.li/link/*
// @include      *watchseries.ag/open/cale/*
// @include      *spainseries.lt/open/cale/*
// @include      *watchseries.vc/open/cale/*
// @include      *watchtvseries.vc/open/cale/*
// @include      *watchtvseries.se/open/cale/*
// @include      *primeseries.to/open/cale/*
// @include      *watchseries.lt/open/cale/*
// @include      *.watchseries1.eu/watch/link/*
// ============ Video Hosters ============
// @include      *auroravid.to/video/*
// @include      *bitvid.sx/file/*
// @include      *vodlocker.com/*
// @include      *vidbull.com/*
// @include      *daclips.in/*
// @include      *movpod.in/*
// @include      *vidto.me/*
// @include      *nowvideo.sx/*
// @include      *filehoot.com/*
// @run-at       document-body
// @icon64       http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/64/Apps-clock-icon.png
// @grant        none
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/16915/SkipButtons.user.js
// @updateURL https://update.greasyfork.org/scripts/16915/SkipButtons.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
// Orginal script: https://greasyfork.org/scripts/3948-bypass-button-countdowns/
// No hard feelings, R.F Geraci, I just wanted a more updated version! -Guy

//    *watchtvseries.to/open/cale/* -- under maintence (but also watch-tv-series.to / )

function getVideoURL() {
    // seems to be unnecessary when using $(document).ready() instead of window.onload
    return atob(window.location.search.substr(3)); // decode url from base64 to string
}

function SkipClass(objClass){
    var className = document.getElementsByClassName(objClass)[0];
    if (typeof(className) !== "undefined") {
        //window.location.href = className.href;
        console.log(objClass);
        if (className.className === 'myButton') window.location.href = getVideoURL(); // some pages doesnt like me .click()'ing on stuff..
        className.click();
    }
}

function SkipId(objId){
    var oId = document.getElementById(objId);
    if (oId !== null) {
        console.log(objId);
        oId.disabled = false;
        //window.location.href = oId.href;  
        //oId.value = "Proceed";
        oId.click();
    }
}

$(window).load(function() {
//$(document).ready(function() {
    // Video url Indexers
    SkipClass('btn btn-info btn-lg'); // watchseries1.eu
    SkipClass('push_button blue'); // newer watchseries.to based webpages
    SkipClass('myButton'); // older watchseries based webpages
    SkipClass('btn btn-success btn-lg'); // FileShoot.com
    
    // Video Hosts
    SkipId('submitButton'); // unknown, left it in for w/e reason
    SkipId('btn_download'); // gorillavid / vodlocker / vidbull / daclips / movpod / vidto
    
    // 'btn' is just causing problems becuase search-functions of other webpages has it as class
    if (window.location.href.indexOf('auroravid') > -1 || 
        window.location.href.indexOf('bitvid') > -1 || 
        window.location.href.indexOf('nowvideo') > -1 
    ) {
      SkipClass('btn') // auroravid / bitvid / nowvideo
    }
});