// ==UserScript==
// @name         BOT Omegle learn to talk
// @namespace    *://omegle.com/
// @version      1.4
// @description  bot learn how to talk in omegle text chat 
// @author       iErcan
// @match        *://www.omegle.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32291/BOT%20Omegle%20learn%20to%20talk.user.js
// @updateURL https://update.greasyfork.org/scripts/32291/BOT%20Omegle%20learn%20to%20talk.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var lastMessageTO;
    var lastMessage;
    var lastMessageStranger = "";
    var messageHistory = ["ça va?", "tu fais quoi?"]; // <--- change this 
    document.getElementById('textbtn').click(); // on lance le chat

    setTimeout(function() {
            write(messageHistory[random(0, messageHistory.length)]);
    }, 5000);

    function random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function alreadyInArray(str) {
        for (var i = 0; i < messageHistory.length; i++) {
            if (messageHistory[i] === str)
                return true;
        }
        return false;
    }

    function write(str) {
        // end();
        start();
        setTimeout(function() {
            document.getElementsByClassName("chatmsg ")[0].value = str;
            document.getElementsByClassName("sendbtn")[0].click();
        }, 1000);

    }

    var startTime, endTime, seconds;

    function start() {
        startTime = new Date();
    }

    function end() {
        endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        timeDiff /= 1000;

        seconds = Math.round(timeDiff % 60);
        console.log(seconds + " sec");
    }

    function detectMessage() {
        for (var i = 0; i < lastMessage.length; i++) {
            if (lastMessage[0] === "S" && lastMessage != "Stranger is typing...") {
                lastMessageStranger = lastMessage;
                lastMessageStranger = lastMessageStranger.split('Stranger:').join('');


            }
        }
    }
    setInterval(refreshVar, 1100);

    function refreshVar() {
        if (document.getElementsByClassName("disconnectbtn")[0].textContent === "NewEsc") {
            document.getElementsByClassName('disconnectbtn')[0].click();
            lastMessage = "";
            lastMessageStranger = "";
            start();
            setTimeout(function() {
             write(messageHistory[random(0, messageHistory.length)]);
            }, 5000);
        }
        //!alreadyInArray(lastMessageStranger) <-- deuxième façon de check 
        if (document.getElementsByClassName("logitem")[document.getElementsByClassName("logitem").length - 1].firstChild.firstChild.textContent === "Stranger:" && lastMessage != undefined && lastMessage != "") {

            write(messageHistory[random(0, messageHistory.length)]);
            console.log("DETECT " + lastMessageStranger);
            if (!alreadyInArray(lastMessageStranger)) {
                messageHistory.push(lastMessageStranger);
            }
            console.log(messageHistory);

        }
       if (seconds > 60) { // skip au bout de 60 secondes
            start();
            for (var i = 0; i < 3; i++)
                document.getElementsByClassName('disconnectbtn')[0].click();
        } 
        end();
        lastMessage = document.getElementsByClassName('logitem')[document.getElementsByClassName('logitem').length - 1].textContent;
        detectMessage();
    }

})();