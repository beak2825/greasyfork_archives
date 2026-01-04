// ==UserScript==
// @name         hk ticket auto redirect (queue)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  hk ticket auto redirect script (queue) event
// @author       You
// @match        https://*.hkticketing.com/*
// @icon         https://www.google.com/s2/favicons?sz=128&domain=hkticketing.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456566/hk%20ticket%20auto%20redirect%20%28queue%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456566/hk%20ticket%20auto%20redirect%20%28queue%29.meta.js
// ==/UserScript==


const sleep = ms => new Promise(r => setTimeout(r, ms));

async function autoRedirect() {

    await sleep(2500);// sleep 2.5s

    if( window.location.href.indexOf("queue.hkticketing") > -1 ){
        window.location.href = "http://entry-hotshow.hkticketing.com";
    }
}


autoRedirect();