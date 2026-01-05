// ==UserScript==
// @name         InsultBot
// @namespace    http://apvark.netai.net/
// @version      0.9
// @description  Say @insult
// @author       Supervarken + original code by AlexCatch
// @match        https://www.reddit.com/robin
// @include      https://www.reddit.com/robin/
// @grant GM_xmlhttpRequest
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/18469/InsultBot.user.js
// @updateURL https://update.greasyfork.org/scripts/18469/InsultBot.meta.js
// ==/UserScript==

(function() {
   'use strict';
    var websocket;
    var wsUri = r.config.robin_websocket_url;

    websocket = new WebSocket(wsUri);
    websocket.onmessage = function(evt) {onMessage(evt); };
    
    setTimeout(function() {
        sendMessage("I am a bot, send me a message with either !insult, @insult or @insults for an insult!");
    }, 2000);
    
    setInterval(function(){ sendMessage("I am a bot, send me a message with either !insult, @insult or @insults for an insult! [https://github.com/AlexCatch/RobinCatFactsBot]");}, 200000);

    function onMessage(evt)
    {
        //recieved a message
        var jsonObject = JSON.parse(evt.data);
        if (jsonObject.type == "chat") {
            var regex = /^(!|@)in\s?(bot|sult?)/i;
            //recieved message is a chat message, compare contents
            if (regex.test(jsonObject.payload.body.toLowerCase())) {
                console.log("make said request");
                //message was direcxted to us
                makeRequest(function(fact) {
                    console.log(fact);
                    sendMessage(fact);
                });
            }
        }
    }
    
    function sendMessage(message) {
        $("#robinSendMessage > input[type='text']").val("");
        $("#robinSendMessage > input[type='text']").val(message);
        $("#robinSendMessage > input[type='submit']").click();
    }
    function makeRequest(callback) {
        GM_xmlhttpRequest ({
            method: 'GET',
            url:"http://quandyfactory.com/insult/json",
            onload: function (responseDetails) {
                // DO ALL RESPONSE PROCESSING HERE..
                var jsonResponse = JSON.parse(responseDetails.response);
                var fact = jsonResponse.insult;
              
                if (false) {
                    console.log("fact is too long");
                    makeRequest(function(fact){
                        sendMessage(fact);
                    });
                }else {
                    callback(fact + "...");
                }
            }
        });
    }
})();