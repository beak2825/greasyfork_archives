// ==UserScript==
// @name         eparaksts refresher
// @version      1.0
// @description  Novērš eparaksts.lv izlogošanos dīkstāves gadījumos
// @author       ExpIorer
// @match        https://www.eparaksts.lv/*
// @grant        none
// @namespace https://greasyfork.org/users/28033
// @downloadURL https://update.greasyfork.org/scripts/16445/eparaksts%20refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/16445/eparaksts%20refresher.meta.js
// ==/UserScript==


function httpGet(theUrl)
{
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, true );
    xmlHttp.send( null );
}


{
    setTimeout(parladet2, 60*1000*5);   
}
    
function parladet2()
{ 
    var r=Math.random();
    httpGet('https://www.eparaksts.lv/lv/?r='+r);
    setTimeout(parladet2, 50*1000*5);   
}