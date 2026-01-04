// ==UserScript==
// @name         Better Participants
// @namespace    Youtube
// @version      0.1
// @description  Susan Hate!
// @author       SentientCrab
// @match        https://www.youtube.com/live_chat?is_popout=1&v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-idle
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/448522/Better%20Participants.user.js
// @updateURL https://update.greasyfork.org/scripts/448522/Better%20Participants.meta.js
// ==/UserScript==
var currentFunction = 0;

function collectNames() {
    console.log("run collect names");
    if (currentFunction == 0) {
        var participants = document.getElementById("better-participants-list");
        participants.textContent = participants.textContent.substring(0, participants.textContent.length - 2);
        var participantsArray = participants.textContent.split("\r\n");
        var noChange = true;
        var parts = document.getElementById("participants");
        var realParts = parts.getElementsByClassName("yt-live-chat-author-chip");
        for (const element of realParts) {
            if (element.textContent != "" && !participantsArray.includes(element.textContent) && element.id == "author-name") {
                participantsArray.push(element.textContent);
                noChange = false;
            }
        }
        if (!noChange) {
            participants.textContent = '';
            participantsArray.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
});
            for (const element of participantsArray) {
                participants.textContent += element + "\r\n";
            }
        }
        setTimeout(collectNames, 5000);
    }
    else
    {
        clearTimeout(collectNames);
    }
};

function stopNameCollection() {
    console.log("run stopNameCollection");
    if (currentFunction == 1) {
        var participants = document.getElementById("better-participants-list");
        var participantsArray = participants.textContent.substring(0, participants.textContent.length - 2).split("\r\n");
        var newArray =[];
        var noChange = true;
        var parts = document.getElementById("participants");
        var realParts = parts.getElementsByClassName("yt-live-chat-author-chip");
        for (const element of realParts) {
            if (element.textContent != "" && !participantsArray.includes(element.textContent) && element.id == "author-name") {
                newArray.push(element.textContent);
                noChange = false;
            }
        }
        if (!noChange) {
            for (const element of newArray) {
                participants.textContent += element + "\r\n";
            }
        }
        setTimeout(stopNameCollection, 5000);
    }
    else
    {
        clearTimeout(stopNameCollection);
    }
};

function myStopFunction() {
    var findChat = document.getElementById("contents");
    if (findChat != null) {
        var buttonDiv = document.createElement("div");
        var el = document.createElement("button");
        el.textContent = "Start Collecting Names";
        el.id = "my-special-button";
        el.onclick = function() {
            var sanityCheck = document.getElementById("participants");
            if(sanityCheck!=null)
            {
                var textBox = document.getElementById("contents");
                var el = document.createElement("textarea");
                el.style.width = "99%";
                el.style.height = "160px";
                el.textContent = "";
                el.id = "better-participants-list";
                textBox.insertBefore(el, textBox.firstChild);

                var parts = document.getElementById("participants");
                var realParts = parts.getElementsByClassName("yt-live-chat-author-chip");
                for (const element of realParts) {
                    if (element.textContent != "" && element.id == "author-name") {
                        el.textContent += element.textContent + "\r\n";
                    }
                }
                setTimeout(collectNames, 5000);
                var daButton = document.getElementById("my-special-button");
                daButton.textContent = "Soft Stop (puts new names at bottom)";
                daButton.onclick = function() {
                    clearTimeout(collectNames);
                    currentFunction = 1;
                    stopNameCollection();
                    var daButton = document.getElementById("my-special-button");
                    daButton.textContent = "Full Stop";
                    daButton.onclick = function() {
                        var daButton = document.getElementById("my-special-button");
                        daButton.textContent = "Uhhhhhh haven't thought this far ahead";
                        currentFunction = 10;
                        daButton.onclick = function() {}
                    }
                }
            }
            else
            {
                alert("open participants first yabbit");
            }

        };;
        buttonDiv.appendChild(el);
        findChat.appendChild(buttonDiv);
    } else {
        setTimeout(myStopFunction, 500);
    }

}

(function() {
    const myTimeout = setTimeout(myStopFunction, 500);
})();