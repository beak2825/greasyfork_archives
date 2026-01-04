// ==UserScript==
// @name         YouTube mix next/previous buttons
// @namespace    https://zachsaucier.com/
// @version      0.6
// @description  Adds next/previous buttons to seek between tracks in a YouTube mix without having to scroll down.
// @author       Zach Saucier
// @include      /^https://www.youtube.com/watch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33023/YouTube%20mix%20nextprevious%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/33023/YouTube%20mix%20nextprevious%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function goToNextTrack() {
        var currTimeString = document.querySelector(".ytp-time-current").innerText,
            currTime = parseTimeString(currTimeString);

        for(var i = 0; i < timeLinks.length; i++) {
            var linkTimeString = timeLinks[i].innerText,
                linkTime = parseTimeString(linkTimeString);

            if(isLaterTime(currTime, linkTime)) {
                timeLinks[i].click();
                return;
            }
        }

        timeLinks[0].click();
    }

    function goToPreviousTrack() {
        var currTimeString = document.querySelector(".ytp-time-current").innerText,
            currTime = parseTimeString(currTimeString);

        for(var i = timeLinks.length - 1; i >= 0; i--) {
            var linkTimeString = timeLinks[i].innerText,
                linkTime = parseTimeString(linkTimeString);

            if(isLaterTime(linkTime, currTime)) {
                timeLinks[i].click();
                return;
            }
        }

        timeLinks[timeLinks.length - 1].click();
    }

    function parseTimeString(timeString) {
        var timeArr = timeString.match(/\d+/g);

        var h = 0,
            m = 0,
            s = 0;

        if(timeArr.length === 3) {
            h = parseInt(timeArr[0]);
            m = parseInt(timeArr[1]);
            s = parseInt(timeArr[2]);
        } else if(timeArr.length == 2) {
            m = parseInt(timeArr[0]);
            s = parseInt(timeArr[1]);
        }

        return [h, m, s];
    }

    function isLaterTime(firstTime, secondTime) {
        if(firstTime[0] < secondTime[0]
           || (firstTime[0] === secondTime[0] && firstTime[1] < secondTime[1])
           || (firstTime[0] === secondTime[0] && firstTime[1] === secondTime[1] && firstTime[2] < secondTime[2])
          )
            return true;

        else
            return false;
    }
    
    var description, 
        timeLinks;
    
    var url = window.location.href;
    var videoid = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
    
    function checkReady() {
        description = document.getElementById("description");
        
        if(description) { 
            timeLinks = description.querySelectorAll("a[href *= '/watch?v=" + videoid[1] + "'");

            // If true, it's (probably) a mix with tracklisting provided
            if(timeLinks.length > 0) {
                // Create the buttons
                var nextButton = document.createElement("button"),
                    prevButton = document.createElement("button"),
                    br = document.createElement("br");

                nextButton.innerText = "Next track";
                prevButton.innerText = "Previous track";
                nextButton.onclick = goToNextTrack;
                prevButton.onclick = goToPreviousTrack;

                nextButton.style = "cursor: pointer; background-color:#444244; color: white; padding: 4px 12px; border: none; margin-right: 5px; margin-bottom: 5px;";
                prevButton.style = "cursor: pointer; background-color:#444244; color: white; padding: 4px 12px; border: none; margin-right: 5px; margin-bottom: 5px;";

                nextButton.title = "Hotkey: u";
                prevButton.title = "Hotkey: i";

                description.insertBefore(br, description.childNodes[0]);
                description.insertBefore(nextButton, description.childNodes[0]);
                description.insertBefore(prevButton, description.childNodes[0]);

                // Create the key listeners
                document.addEventListener("keyup", function(e) {
                    if(e.keyCode === 80
                    && e.srcElement.tagName !== "INPUT"
                    && e.srcElement.tagName !== "TEXTAREA") { // p pressed
                        goToNextTrack();
                    } else if(e.keyCode === 79
                    && e.srcElement.tagName !== "INPUT"
                    && e.srcElement.tagName !== "TEXTAREA") { // o pressed
                        goToPreviousTrack();
                    }
                });
            }
        }
        else {
            setTimeout(checkReady, 100);
        }
    }
    setTimeout(checkReady, 100);

})();