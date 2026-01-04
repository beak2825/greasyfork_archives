// ==UserScript==
// @name         Traackr 2.0
// @namespace    kenkwok
// @version      0.4
// @description  Just a simple script
// @author       Ken Kwok
// @match        *://app.traackr.com/influencers/view/*
// @match        *://app.traackr.com/audience/influencer/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447747/Traackr%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/447747/Traackr%2020.meta.js
// ==/UserScript==

function matchInfluencerView() {
    let currentLocation = window.location.href;
    var matches = currentLocation.match(/influencers\/view\/([a-z0-9]+)/);
    var rawDataId;
    if(matches != null)
    {
        rawDataId = matches[1];
    }
    if(rawDataId)
    {
        GM_openInTab ('https://app.traackr.com/audience/influencer/'+rawDataId);
    }
}

async function matchInfluencerAudience()
{
    let currentLocation = window.location.href;
    var matches = currentLocation.match(/audience\/influencer\//);
    var rawDataPage, rawData, win;
    if(matches != null)
    {
        rawDataPage = matches[0] ? true : false;
    }
    if(rawDataPage)
    {
        rawData = await $("pre").text();
        await GM_setClipboard (rawData);
        win = window.open("","_self");
        setTimeout(()=>win.close(), 100);
    }
}

$(document).ready(function(){
    matchInfluencerView();
    matchInfluencerAudience();
});