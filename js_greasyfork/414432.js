// ==UserScript==
// @name         Investment
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  sends money to server
// @author       You
// @match        https://www.torn.com/index.php
// @connect      cloudfunctions.net
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/414432/Investment.user.js
// @updateURL https://update.greasyfork.org/scripts/414432/Investment.meta.js
// ==/UserScript==

$(document).ready(initialise)

function initialise() {
    //sendMessage("At this moment in time Torn citizens have invested a total of $28,172,682,730,411 dollars in off-shore Cayman Island banking accounts.");
    const load = setInterval(function() {
        if(document.getElementsByClassName('inner-popup').length) {
            const info = document.getElementsByClassName('inner-popup')[0];
            console.log(info.innerText);
            if(info.innerText.indexOf('At this moment in time') !== -1) {
                sendMessage(info.innerText.replace(" If you were to split this money evenly and distribute an equal portion to every man, woman and child in Torn City, you'd be a dirty communist.", ''));
            }
            clearInterval(load);
        }
    }, 100);
}

function sendMessage(msg) {
    var params = {
        username: "Investment",
        timestamp: new Date(),
        content: msg
    }

    GM.xmlHttpRequest({
        method: "POST",
        url: "https://europe-west2-assistant-de480.cloudfunctions.net/process ",
        data: JSON.stringify(params),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            console.log(response.response);
        },
        onError: function() {
            console.log('error?');
        }
    });
}
