// ==UserScript==
// @name         Message Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Highlights comments with the mod's name
// @author       You
// @match        http://csgobattle.com
// @include      http://csgobattle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21179/Message%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/21179/Message%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict'; // Points out some critical information to the browser, and is essential to all JavaScript web scripts
    var delay = 2000; // This stops the script for 5000ms (5s) to account for the time that it takes to load in and avoid an overflow of errors
setTimeout(function() { // Executes the delay above
setInterval(function() { // Checks every 3ms (~300 times a second). This number is specified at the end
    var messages = document.getElementsByClassName("chat-message-text"); // Since all chat messages are given the HTML class of "chat-message-text", we set anything with that class to our variable 'messages'. 'Messages' now contains an array of all the messages + the HTML formatting around it.
    var messageBuild = messages[messages.length - 1]; // This sets variable 'messageBuild' to the second-to-last message on the screen, since the last one is always kept blank by the site.
    messageBuild = messageBuild.innerHTML; // We now turn 'messageBuild' into just the message by removing the HTML formatting around it with .innerHTML
    var searchList = ["banana","bannana","bananna","Banana","Bannana","Bananna","BANANA","BANNANA","BANANNA","for scale","For","Scale","banan","Banan","BANAN"]; // 'searchList' is set to an array of all the values we want to look for
    var i; // Defines variable i
    for (i = 0; i <= searchList.length; i++) { // This executes the code it captures once for every item in 'searchList', increasing variable 'i' by one each time it runs 
    if(messageBuild.indexOf(searchList[i]) > 0) { // The code this surrounds will only be executed if our variable 'messageBuild' contains the word searchlist[i] more than 0 times, where i is a number that goes from 0 to searchlist.length each times it runs and searchList is the arra of words. This means that it looks to see if any of the words are inside our variable, and only executes if true.
        document.getElementsByClassName("chat-message-text")[messages.length - 1].style.color = "gold"; // This selects the second-to-last message and edits its CSS properties to make it gold.
        }
    }
}, 3); // Checks 300 times a second
    }, delay);
})();[]