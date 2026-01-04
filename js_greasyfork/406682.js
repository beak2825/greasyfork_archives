// ==UserScript==
// @name         Insert Coins for GridGamingIO on Twitch
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Get some coins!
// @author       Sleepypan
// @match        https://www.twitch.tv/gridgamingio
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/406682/Insert%20Coins%20for%20GridGamingIO%20on%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/406682/Insert%20Coins%20for%20GridGamingIO%20on%20Twitch.meta.js
// ==/UserScript==

var $ = window.$;
var isFirstRun = true;

var latestTime, startTime, waitingToInsert = false;

waitForKeyElements(".simplebar-scrollbar", waitForIt);

function waitForIt() {
    setTimeout(hitIt, 5000);
}

function hitIt() {

    if(isFirstRun) {
        isFirstRun = false;
    }
    else {
        return;
    }

    console.log('go');

    setInterval(checkIt, 10000);
}

function checkIt() {
    console.log('checking');
    if ($(".chat-line__message:contains('tickets to Sleepypan')").length > 0) {
        //cooldown after getting in here
        latestTime = new Date();
        if(waitingToInsert) {
            var diff = latestTime - startTime;
            if(diff > 612345) {
                waitingToInsert = false;
            }
            return;
        }
        startTime = new Date();
        waitingToInsert = true;

        // wait random number of seconds to insert the coins
        var secondsToWait = getRandomInt(5,120) * 1000
        console.log('waiting to insert for ' + secondsToWait + 'ms');
        setTimeout(sendInsertMessage, secondsToWait);
    }
}

function sendInsertMessage() {
    sendChatMessage('!insertall');
}


function sendChatMessage(message) {
    console.log(message);
    $("textarea[data-a-target='chat-input']")[0].focus();
    $("textarea[data-a-target='chat-input']")[0].click();
    var input_field = $("textarea[data-a-target='chat-input']")[0];

    /* Fill Textarea value, Tricks the React listener override */
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeInputValueSetter.call(input_field, message);

    var ev2 = new Event('input', { bubbles: true});
    input_field.dispatchEvent(ev2);

    $("button[data-a-target='chat-send-button']").click();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}