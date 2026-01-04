// ==UserScript==
// @name         Imersion Timer
// @namespace    https://gist.github.com/luizbafilho
// @version      0.6
// @description  Tracks japanese time
// @author       luizbafilho
// @match        https://jpdb.io/review*
// @match        https://bunpro.jp/*
// @match        https://zoro.to/*
// @match        https://htpc.luizbafilho.dev/*
// @match        killergerbah.github.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      jp-timer.luizfilho.cloud
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453184/Imersion%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/453184/Imersion%20Timer.meta.js
// ==/UserScript==


function getCategory() {
    switch (window.location.host) {
        case 'bunpro.jp':
            return "grammar";
        case 'jpdb.io':
            return "srs";
        case 'zoro.to':
            return "listening";
        case 'killergerbah.github.io':
            return "listening";
        case 'htpc.luizbafilho.dev':
            return "reading";
        default:
            return "";
    }
}


(function() {
    'use strict';


    var username = "luiz";
    var password = "qwe123@";
    var endpointUrl = "https://jp-timer.luizfilho.cloud/entries.json"


    setInterval(function() {
        if(document.hidden) {
            return
        }

        var date = new Date()
        date.setHours(date.getHours() - 3);

        var d = {
            "day": date.toJSON().slice(0,10).replace(/-/g,'/'),
            "duration": 1,
            "category": getCategory()
        }

        //console.log("Sending...", d)
        GM_xmlhttpRequest ( {
            method:     'POST',
            url:        endpointUrl,
            data: JSON.stringify(d),
            //user: username,
            //password: password,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(username + ":" + password)
            },
            onload: function (responseDetails) {
                if (responseDetails.status != 201) {
                    console.log ( "GM_xmlhttpRequest() response is:\n", responseDetails.responseText.substring (0, 80) + '...');
                }
            },
            onerror:     function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE...
                console.log (
                    "GM_xmlhttpRequest() response is:\n",
                    responseDetails.responseText.substring (0, 80) + '...'
                );
            }
        });
    }, 1000);

    // Your code here...
})();



function getOrPrompt(item) {
    var value = GM_getValue(item, "");
    if (!value) {
        var promptRes = prompt(item + ' not set for ' + location.hostname + '. Please enter it now:','');
        GM_setValue(item, promptRes);
        return value;
    }

    return value;
}


//-- Add menu commands that will allow U and P to be changed.
GM_registerMenuCommand ("Change Username", changeUsername);
GM_registerMenuCommand ("Change Password", changePassword);
GM_registerMenuCommand ("Change Endpoint", changeEndpoint);

function changeUsername (item) {
    promptAndChangeStoredValue ("username");
}

function changePassword () {
    promptAndChangeStoredValue ("password");
}


function changeEndpoint () {
    promptAndChangeStoredValue ("endpoint");
}


function promptAndChangeStoredValue(item) {
    var value = prompt (
        'Change ' + item + ' for ' + location.hostname + ':','');
    GM_setValue (item, value);
}