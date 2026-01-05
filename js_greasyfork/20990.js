// ==UserScript==
// @name         WhatsApp Web - Chat Bot
// @namespace    WACB
// @version      0.1
// @description  A chat bot for WhatsApp Web, with some basic commands. Check console for log.
// @author       Royalgamer06
// @match        https://web.whatsapp.com/
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/20990/WhatsApp%20Web%20-%20Chat%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/20990/WhatsApp%20Web%20-%20Chat%20Bot.meta.js
// ==/UserScript==

var jq = document.createElement('script');
jq.onload = function() {
    jQuery.noConflict();
    console.log('jQuery loaded');
    setTimeout(Main, 3500);
};
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

function Main() {
    console.log("[WACB] Waiting for chat to load");
    jQuery("#pane-side").on("click", function() {
        setTimeout(listenToChat, 350);
    });
}

function listenToChat() {
    console.log("[WACB] Listening to chat");
    /*jQuery(".message-list").bind("DOMSubtreeModified", function() {
        var new_msg = jQuery(".selectable-text").last().text();
        console.log("[WACB] New chat message: \n" + new_msg);
        if (new_msg.indexOf("!") === 0) {
            var cmd_line = new_msg.substring(1);
            var cmd = cmd_line.split(" ")[0];
            var args = cmd_line.split(" ").shift();
            if (cmd == "about") {
                sendMsg("I am a chat bot, made by Roy van Dijk.");
            }
        }
    });*/
    unsafeWindow.sendMsg = function(msg) {
        console.log("[WACB] Sending message: \n" + msg);
        var target = document.getElementsByClassName("input")[1];
        var eventType = "textInput";
        var evt = document.createEvent("TextEvent");
        evt.initTextEvent(eventType, true, true, unsafeWindow, msg, 0, "en-US");
        target.focus();
        target.dispatchEvent(evt);
        jQuery(".send-container").click();
    };
    var last_msg = jQuery(".selectable-text").last().text();
    setInterval(function() {
        var new_msg = jQuery(".selectable-text").last().text();
        if (new_msg !== last_msg) {
            console.log("[WACB] New chat message: \n" + new_msg);
            last_msg = new_msg;
            if (new_msg.indexOf("!") === 0) {
                var cmd_line = new_msg.substring(1);
                var cmd = cmd_line.split(" ")[0];
                var args = cmd_line.split(" ").slice(1);
                if (cmd == "help") {
                    sendMsg("I can do the following commands:");
                    sendMsg("*!about*: Returns who I am.");
                    sendMsg("*!joke*: Returns a random joke (about Chuck Norris).");
                    sendMsg("*!weather*: Returns the current weather in Eindhoven.");
                    sendMsg("*!weather <LOCATION>*: Returns the current weather in <LOCATION>.");
                    sendMsg("*!gewis*: Returns the agenda of GEWIS.");
                    sendMsg("(Work in progress)");
                }
                if (cmd == "about") {
                    sendMsg("I am a chat bot.");
                }
                if (cmd == "joke") {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://api.icndb.com/jokes/random?escape=javascript",
                        onload: function(response) {
                            var json = JSON.parse(response.responseText);
                            sendMsg(json.value.joke);
                        }
                    });
                }
                if (cmd == "weather") {
                    var url = "http://api.apixu.com/v1/current.json?key=d0c5d252848043d6af4210418162706&q=Eindhoven";
                    if (args.length > 0) {
                        url = "http://api.apixu.com/v1/current.json?key=d0c5d252848043d6af4210418162706&q=" + args[0];
                    }
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function(response) {
                            var json = JSON.parse(response.responseText);
                            if (args.length > 0) {
                                if (json.error) {
                                    sendMsg("ERROR: Couldn't find location.");
                                } else {
                                    sendMsg("It is currently " + json.current.temp_c + "°C in " + args[0]);
                                }
                            } else {
                                sendMsg("It is currently " + json.current.temp_c + "°C in Eindhoven.");
                            }
                        }
                    });
                }
                if (cmd == "gewis") {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://www.gewis.nl/activity",
                        onload: function(response) {
                            var acts = jQuery(".agenda-item-body", response.responseText);
                            for (var i = 0; i < acts.length; i++) {
                                sendMsg(jQuery("h4 > a", acts[i]).text().trim() + " - " + jQuery("div.col-md-4 > dl > dd:nth-child(2)", acts[i]).text().trim() + " @ " + jQuery("div.col-md-4 > dl > dd:nth-child(6)", acts[i]).text().trim());
                            }
                        }
                    });
                }
            }
        }
    }, 100);
}