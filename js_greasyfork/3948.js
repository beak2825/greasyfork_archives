// ==UserScript==
// @name         Bypass Button Countdowns
// @namespace    http://www.diamonddownload.weebly.com
// @version      1.2.1
// @description  Bypasses the button countdown on various video sites, skips pointless ones and goes straight to actual video host.
// @include      *gorillavid.in/*
// @include      *daclips.in/*
// @include      *movpod.in/*
// @include      *watchtvseries.to/open/cale/*
// @include      *watchseries.lt/open/cale/*
// @include      *watchseries.ag/open/cale/*
// @include      *vodu.ch/file/*
// @copyright    2014+, RGSoftware
// @run-at       document-body
// @author       R.F Geraci 
// @icon64       http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/64/Apps-clock-icon.png
// @downloadURL https://update.greasyfork.org/scripts/3948/Bypass%20Button%20Countdowns.user.js
// @updateURL https://update.greasyfork.org/scripts/3948/Bypass%20Button%20Countdowns.meta.js
// ==/UserScript==



function SkipClass(objClass){
    
    var className = document.getElementsByClassName(objClass)[0];
    if (className != undefined){
        // window.location.href = className.href; 
        className.click();
    }
}

function SkipId(objId){
    
    var oId = document.getElementById(objId);
    if (oId != undefined){
        oId.disabled = null;
        //window.location.href = oId.href;  
        //oId.value = "Proceed";
        oId.click();
    }
}

window.onload = function(){
    
    SkipClass('push_button blue');
    SkipClass('myButton');
    SkipId('submitButton');
    SkipId('btn_download');
    
};