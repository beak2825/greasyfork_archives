// ==UserScript==
// @name         TwinHello
// @namespace    http://alphaoverall.com
// @version      0.4
// @description  Auto reply to hello
// @author       AlphaOverall
// @include      http://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14138/TwinHello.user.js
// @updateURL https://update.greasyfork.org/scripts/14138/TwinHello.meta.js
// ==/UserScript==
/* jshint -W097 */

// This check function just makes sure the chat is loaded, you don't need to understand this.
function check() {
    if (!holodeck || !ChatDialogue) { setTimeout(check, 1000);}
    else {
        console.log("[Twin Bot]: Holodeck loaded"); 
        init();
    }
} check();

// This is the function where stuff actually happens
function init() {
    // Get random messages
    function randomResponse(str) {
        var rand = Math.floor(Math.random() * (str.length - 0));
        return str[rand];
    }
    // Message to choose from
    var responses = ["Hey, how's it going?", "Yo, wassup bro.", "Hey man, how're you?", "Hi, how's life?"];
    // This captures all incoming messages
    holodeck.addIncomingMessageFilter(function(message, nextFunction){
        var msg = message.toLowerCase(); // Make message lowercase (not entirely necessary with my regex)
        // This if statement uses regex to check for hello, hi, hey twin... it's good to know regex
        if (msg.match(/(h(ello|i|ey)|(yo)|(sup)).?twin/gi)) {
            holodeck._chat_window._active_room.sendRoomMessage(randomResponse(responses)); // This sends the message
        }
        nextFunction(message, nextFunction); // This displays the message in chat, don't worry about this
    });
}