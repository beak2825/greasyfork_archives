// ==UserScript==
// @name         valsts kase refresher
// @version      1.1
// @description  Novērš valsts kases izlogošanos dīkstāves gadījumos
// @author       ExpIorer
// @match        https://e1.kase.gov.lv/*
// @grant        none
// @namespace https://greasyfork.org/users/28033
// @downloadURL https://update.greasyfork.org/scripts/21518/valsts%20kase%20refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/21518/valsts%20kase%20refresher.meta.js
// ==/UserScript==

setTimeout(parladet2, 1000*60);   

function parladet2()
{ 
    var r=parseInt((Math.random()+1)*10000000000);
    httpGet('https://e1.kase.gov.lv/ekase/redirector?'+r,'__Action=order_list&param=');
    setTimeout(parladet2, 1000*60);   
}

function httpGet(theUrl,params)
{
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", theUrl, true );
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(params);    
    clearTimeout(logOutMsgLeftTimeoutId);
}