// ==UserScript==
// @name         RES filter button
// @version      0.2
// @description  Replaces "Join Subreddit" button on r/all/ with a button that filters the subreddit using Reddit Enhancement Suite (which needs to be installed).
// @author       cosmik_debree
// @include       http://reddit.com/*
// @include       https://reddit.com/*
// @include       http://*.reddit.com/*
// @include       https://*.reddit.com/*
// @namespace https://greasyfork.org/users/830718
// @downloadURL https://update.greasyfork.org/scripts/434748/RES%20filter%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/434748/RES%20filter%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cusid_ele = document.getElementsByClassName("subreddit-subscribe");
    var elems = [].slice.call(cusid_ele);
    // replaces all of the "Join subreddit" buttons with the filter subreddit button
    for (var i = 0; i < elems.length; ++i) { (function(i) {
        elems[i].removeAttribute("class");
        elems[i].removeAttribute("data-success-title");
        elems[i].title = elems[i].title.replace("Join", "Filter");
        elems[i].innerHTML = "➖";
        elems[i].onclick = function(){
            filter(elems[i].title.replace("Filter r/", ''));
        }})(i);
                                           }
}
)();
// somewhat janky, but opens the RES cmd line and pastes the cmd to filter the sub. if RES has an API to filter subs, this would be where it would be called.
async function filter(sub) {
    document.getElementById("RESSettingsButton").click();
    await new Promise(r => setTimeout(r, 200));
    document.getElementsByClassName("RESMenuItemButton res-icon")[1].click();
    var cmdLine = document.getElementById("keyCommandInput");
    cmdLine.value = "f " + sub;
    const ke = new KeyboardEvent('keydown', {
        bubbles: true, cancelable: true, key: "Enter"
    });
    cmdLine.dispatchEvent(ke);
}