// ==UserScript==
// @name         Remove Eurogamer Ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the annoying ads at Eurogamer.net that are loaded via javascript hackery if it detects an adblocker is installed!
// @author       Bubbafatass
// @match        http://www.eurogamer.net/*
// @grant        none
// @run-at       document-begin
// @downloadURL https://update.greasyfork.org/scripts/23008/Remove%20Eurogamer%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/23008/Remove%20Eurogamer%20Ads.meta.js
// ==/UserScript==

(function() {
    var scriptnodes = document.getElementsByTagName("script");
    for( var i = 0; i < scriptnodes.length; ++i )
    {
        if( scriptnodes[i].innerHTML.indexOf("advertContainer") > -1)
        {
            //console.log("Found script node " + scriptnodes[i]);
            scriptnodes[i].parentNode.removeChild(scriptnodes[i]);
        }
    }
    var advcont = document.getElementsByClassName("advertContainer");
    while( advcont !== null && advcont.length > 0 )
    {
        //console.log("Found advert container with length " + advcont.length);
        for( i = advcont.length - 1; i >= 0; --i )
        {
            //console.log(advcont[i]);
            advcont[i].parentNode.removeChild(advcont[i]);
        }
        advcont = document.getElementsByClassName("advertContainer");
    }
    advcont = document.getElementsByClassName("advertContainer");
    //console.log("Found advert container with length " + advcont.length);
    
    var notifbar = document.getElementsByClassName("notif-bar");
    while( notifbar !== null && notifbar.length > 0 )
    {
        //console.log("Found notifbar with length " + notifbar.length);
        for( i = notifbar.length - 1; i >= 0; --i )
        {
            //console.log(notifbar[i]);
            notifbar[i].parentNode.removeChild(notifbar[i]);
        }
        notifbar = document.getElementsByClassName("notif-bar");
    }
    advcont = document.getElementsByClassName("notif-bar");
    //console.log("Found notifbar with length " + advcont.length);
    
    var div = document.getElementById("page-wrapper");
    if( div )
    {
        //console.log("Found " + div + " divs");
        div.removeAttribute("style");
        //console.log("Div style: " + div.style);
    }
    else
    {
       // console.log("Failed to find div");
    }
    // Your code here...
})();