// ==UserScript==
// @name         Slack user censor
// @version      1.0.0
// @grant        none
// @author       github.com/geezee
// @description  Replace the messages of a special user with a tiny red bar
// @match        https://app.slack.com/*
// @license      GPLv3
// @namespace https://greasyfork.org/users/387744
// @downloadURL https://update.greasyfork.org/scripts/391268/Slack%20user%20censor.user.js
// @updateURL https://update.greasyfork.org/scripts/391268/Slack%20user%20censor.meta.js
// ==/UserScript==

const userId = ""; // user id can be retrieved from data-message-sender attribute on .c-message__sender_link
const targetInstanceName = ""; // the name of the workplace to run this script on

const style = "background:rgba(255,50,50,0.1); padding: 3px 20px; font-size: 8px;"; // the style of the red bar
const blockMsg = "Message blocked";
const hoverMsg = "read"; // if you don't want to read the message when hovering then set this to an empty string


function blockMessage(msg) {
    const bodyContainer = msg.querySelector(".c-message__body");
    if (bodyContainer == null) return;
    const body = bodyContainer.innerHTML;
    msg.innerHTML = '<div style="' + style + '">'
    						+ '<a href="#" data-message-sender="' + userId + '"></a>'
    						+ blockMsg
    					  + ' - <abbrv class="c-message__contents__toblock">' + hoverMsg + '</abbrv></div>';
    msg.querySelector(".c-message__contents__toblock").title = body;
}

function hideMessages() {
    const messages = Array.from(document.querySelectorAll(".c-message"));
    for (var i=0; i<messages.length; i++) {
        var msg = messages[i];
        // make sure the message has an author and it matches the troll's id
        const senderLink = msg.querySelector("a.c-message__sender_link");
        if (senderLink == null) continue;
        const sender = senderLink.dataset.messageSender;
        if (sender != userId) continue;
         
        // replace the message with a block notice
        blockMessage(msg);
        
        // search for adjacent messages
        while (messages[i+1].classList.contains("c-message--adjacent")) {
            i++;
            blockMessage(messages[i]);
        }
    }
}


setTimeout(function() {
    const instanceName = document.querySelector(".p-classic_nav__team_header__team__name").innerHTML;
  	if (instanceName != targetInstanceName) return;
    document.querySelector(".p-workspace__primary_view").addEventListener("DOMSubtreeModified", () => {
        setTimeout(hideMessages, 1000);
    });
    hideMessages();
}, 2000);