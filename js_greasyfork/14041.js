// ==UserScript==
// @name        Redacted.ch :: Requests Auto-Subscriber (Created/Voted)
// @description Requests will be directly subscribed if created or voted
// @include     https://*redacted.ch/requests.php?action=view&id=*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @icon        https://redacted.ch/favicon.ico
// @version     1.0.3
// @grant       GM_getValue

// @namespace https://greasyfork.org/users/2290
// @downloadURL https://update.greasyfork.org/scripts/14041/Redactedch%20%3A%3A%20Requests%20Auto-Subscriber%20%28CreatedVoted%29.user.js
// @updateURL https://update.greasyfork.org/scripts/14041/Redactedch%20%3A%3A%20Requests%20Auto-Subscriber%20%28CreatedVoted%29.meta.js
// ==/UserScript==
 
/* This should automatically subscribe to your new request once the request is submitted and the resulting page has loaded */
var usernum = document.documentElement.innerHTML.match(/user\.php\?id\=[0-9]+/)[0].split("?")[1];

var pageid = document.URL.split("=")[2];
var page = 'requests';

var str1 = usernum;

// Converting the userid to only numbers from API
var userid = str1.replace(/[^0-9]/g, '');

// We get all people who have voted/created the request
var str2 = $(".layout").html();

// Extraction of all userid's possible
var number = str2.replace(/[^0-9]/g, '');

// Getting the current subscribing status
var status_subscribe = $("#subscribelink_" + page + pageid).text();

// If the userid is found and we can subscribe to the release, let's do it!
if(number.indexOf(userid) > -1 && status_subscribe == "Subscribe"){
    SubscribeComments(page, pageid);
}