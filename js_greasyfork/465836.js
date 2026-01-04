// ==UserScript==
// @name         hk ticket auto redirect (normal)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  hk ticket auto redirect script (normal) event
// @author       You
// @match        https://busy.hkticketing.com/*
// @icon         https://www.google.com/s2/favicons?sz=128&domain=hkticketing.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465836/hk%20ticket%20auto%20redirect%20%28normal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465836/hk%20ticket%20auto%20redirect%20%28normal%29.meta.js
// ==/UserScript==


const sleep = ms => new Promise(r => setTimeout(r, ms));

async function autoRedirect() {

    await sleep(2500);// sleep 2.5s

    if( window.location.href.indexOf("busy.hkticketing.com") > -1 ){
        window.location.href = "http://www.hkticketing.com";
    }
}

if( window.location.href.indexOf("busy.hkticketing.com") > -1 ){
    window.location.href = "http://www.hkticketing.com";
}

autoRedirect();