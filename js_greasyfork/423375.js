// ==UserScript==
// @name         Trade expiring
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Notify when trade is expiring
// @author       Natty_Boh[1651049]
// @match        https://www.torn.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_notification
// @grant        GM.getValue
// @grant        GM.setValue
// @connect      torn.com
// @downloadURL https://update.greasyfork.org/scripts/423375/Trade%20expiring.user.js
// @updateURL https://update.greasyfork.org/scripts/423375/Trade%20expiring.meta.js
// ==/UserScript==

'use strict';

var key = "ENTER API KEY HERE"

setTimeout(getStats, 300);
function getStats(){
        let url = 'https://api.torn.com/user/?selections=events&key=' + key;
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: async function (response) {
                const data = JSON.parse(response.responseText);
                var events = data.events
                for (var key in events) {
                   if (events[key].event.includes("has initiated a trade titled")) {
                       var now = Date.now()/1000
                       var expiration = events[key].timestamp + 21600
                       var diff = now-expiration
                       var prev = await GM.getValue("notifiedTrade", 0)
                       if (diff <= 60 && diff >= 0 && key != prev) {
                           GM_notification ( {title: 'Trade Expiring!', text: 'A trade someone set with you is about to expire.'} );
                           await GM.setValue("notifiedTrade", key)
                       }
                   }
                }
            },
            onerror: function (error) {
                console.log(error);
            }
        })
    setTimeout(getStats, 60000);
}



