// ==UserScript==
// @name         FE War Timer Notifier
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Notify when war timer is up
// @author       Natty_Boh
// @include      https://www.finalearth.com/*
// @include      https://finalearth.com/*
// @grant        GM_notification
// @grant        GM.xmlHttpRequest
// @connect      finalearth.com
// @downloadURL https://update.greasyfork.org/scripts/418477/FE%20War%20Timer%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/418477/FE%20War%20Timer%20Notifier.meta.js
// ==/UserScript==


/**
ADD YOUR API KEY BELOW (between the quotes) AND SAVE SCRIPT
**/

var api = ""

/**
ADD YOUR API KEY ABOVE
**/


'use strict';
setTimeout(check, 5000);
var warTimerNotified = false
var warTimer = 0;

function check(){
    if(api != "") {
        let url = 'https://finalearth.com/api/notifications?key=' + api
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status == '200') {
                    var json = JSON.parse(response.responseText)
                    if (json.reason === "invalid-api-key") {
                        console.log("Invalid api key, please add correct api key to script")
                    }
                    else if(json.data.timers.war != warTimer) {
                        warTimer = json.data.timers.war;
                        warTimerNotified = false;
                    }
                } else {
                    console.log("Something went wrong")
                }
            },
            onerror: function (error) {
                console.log('Something went wrong, please let Natty_Boh know')
            }
        })
        if (warTimer != 0 && parseInt(warTimer) <= parseInt(Date.now()/1000) && warTimerNotified == false) {
            notify()
        }
        setTimeout(check, 30000);
    } else {
        console.log("No api key provided, please add correct api key to script")
    }
}

function notify() {
    GM_notification ( {title: 'War timer up!', text: 'Your Final Earth war timer is over.'} );
    console.log("Notifcation Sent!")
    warTimerNotified = true;
}

