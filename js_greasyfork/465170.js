// ==UserScript==
// @name        TwitchFunFacts
// @version     BETA
// @description Fun Facts Twitch
// @author      elaw
// @url         https://twitch.com/dsgb1202
// @Instagram   https://www.twitter.com/dsgb1202/
// @license     Copyright (C) DSGB1202
// @icon        https://i.imgur.com/0qNzA6A.png
// @match       https://www.twitch.tv/dsgb1202
// @grant       none
// @run-at      document-start
// @jsversion   jshint esversion: 6
// @namespace https://greasyfork.org/en/users/153402
// @downloadURL https://update.greasyfork.org/scripts/465170/TwitchFunFacts.user.js
// @updateURL https://update.greasyfork.org/scripts/465170/TwitchFunFacts.meta.js
// ==/UserScript==

       
var limit = 3;
$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/facts?limit=' + limit,
    headers: { 'X-Api-Key': 'ZVpWh7oi0eCFW35DGlXgMQ==DCaFrFPVzEHGSUPT'},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});
