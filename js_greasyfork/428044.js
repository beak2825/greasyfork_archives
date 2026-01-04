// ==UserScript==
// @name       Twitch Regex Chat Filter BTTV
// @namespace   twitchRegexChatFilter
// @include      *twitch.tv*
// @version     0.96
// @description A script to filter out the chat commands by regex
// @downloadURL https://update.greasyfork.org/scripts/428044/Twitch%20Regex%20Chat%20Filter%20BTTV.user.js
// @updateURL https://update.greasyfork.org/scripts/428044/Twitch%20Regex%20Chat%20Filter%20BTTV.meta.js
// ==/UserScript==
//
var interval;
var regex = /^[1-8]$/;

function filterChat(event){
    var chatParent = document.getElementsByClassName("chat-scrollable-area__message-container")[0];
    var msgSpan = event.target.querySelector('.text-fragment');
    try {var message = msgSpan.innerHTML;} catch {return;}

    message = message.toUpperCase().replace(/\s+/g, '');
    if (message == "") {return;}


    if(regex.test(message.replace(/.,!/g, '').trim())){
        if (event.target.parentNode != null) {
            console.log("TRCF - Removing " + event.target + " from " + event.target.parentNode + " as message = " + message);
            if (event.target.style['display'] != 'none') {
                event.target.style["display"] = "none";
            }
        }
    }
}

function checkIfLoaded()
{
    var chatParent = document.getElementsByClassName("chat-scrollable-area__message-container")[0];
	try{chatParent.children}
	catch(err)
	{
	return;
	}
    chatParent.addEventListener("DOMNodeInserted",filterChat);
    window.clearInterval(interval);
}

interval = window.setInterval(checkIfLoaded,20);
console.log("TRCF - Loaded");