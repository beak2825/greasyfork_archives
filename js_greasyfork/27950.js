// ==UserScript==
// @name         PT Auto Sign In
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  PT站自动签到
// @author       Mumumi
// @match        *://pt.*
// @match        *://tp.*
// @match        */torrents.php*
// @match        */browse.php*
// @match        */messages.php*
// @match        */details.php?id=*
// @match        */userdetails.php?id=*
// @match        *u2.dmhy.org/showup.php*
// @exclude      *chdbits.co/*
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/27950/PT%20Auto%20Sign%20In.user.js
// @updateURL https://update.greasyfork.org/scripts/27950/PT%20Auto%20Sign%20In.meta.js
// ==/UserScript==

function MMLeft(hour, min = 0, sec = 0) {
    var date=new Date();
    var nowh = date.getHours();
    var nowm = date.getMinutes();
    var nows = date.getSeconds();
    if (nowh > hour || (nowh == hour && nowm > min) || (nowh == hour && nowm == min && nows >= sec)) {
        date.setDate(date.getDate() + 1);
    }
    date.setHours(hour);
    date.setMinutes(min);
    date.setSeconds(sec);
    return date - (new Date());
}
function ClickByXPath(xpath){
    try {
        var evl = GetByXPath(xpath);
        if (evl != false && evl.snapshotLength > 0) {
            var elem = evl.snapshotItem(0);
            if (elem.style.visibility != "hidden"){elem.click();}
            if ($(elem).is(":visible")){elem.click();}
        }
    } catch (e) {
        console.log('ASclk'+e);
    }
}
function GetByXPath(xpath){
    try {
        return document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    } catch (e) {
        console.log('ASget'+e);
    }
    return false;
}
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}
window.onload = function() {
    'use strict';

    // Your code here...
    if (location.href.indexOf('u2.dmhy.org/showup.php') == -1) {
        ClickByXPath("//a[boolean(contains(.,\"签\") or contains(.,\"簽\")) and not(contains(.,\"已\")) and not(contains(.,\"查看\"))]");
    } else {
        var ta=GetByXPath("//textarea[@name='message']").snapshotItem(0);
        if ($(ta).is(":visible")){
            var elem=GetByXPath("//table[3]//fieldset").snapshotItem(Math.floor(Math.random()*30 + 1));
            ta.value=elem.parentNode.innerText.split(elem.innerText)[0].trim();
        }
        sleep(10000);
        ClickByXPath("//div[@id='showup']//input[@type='submit']");
    }

    setTimeout(function(){window.location.reload();}, MMLeft(6));
};