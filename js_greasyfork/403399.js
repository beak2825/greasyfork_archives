// ==UserScript==
// @name         Waitrose slot finder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.waitrose.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/403399/Waitrose%20slot%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/403399/Waitrose%20slot%20finder.meta.js
// ==/UserScript==

function try_find_slot() {
    $('button').each((i,v)=>{
        console.log($(v).attr('aria-label'));
        var has_slot = $(v).attr('aria-label') == 'Available';
        if(has_slot){
            GM_notification ( {
                title: "Waitrose Slot",
                text: $(v).attr('aria-label')
            } );
        }
    });

    $('[data-test=bookslot-later-large-button]').click()
}

(function() {
    'use strict';
    console.log("Script will run in 10 sec...");
    setTimeout(try_find_slot, 1000 * 10);
    setTimeout(try_find_slot, 1000 * 15);
    setTimeout(try_find_slot, 1000 * 20);
    setTimeout(()=>{
        location.reload();
    }, 1000 * 30);
})();