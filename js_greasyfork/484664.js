// ==UserScript==
// @name         goNextVideo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Completare la % di visione dei video
// @author       You
// @match    https://lms.pegaso.multiversity.click/videolezione/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at      document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/484664/goNextVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/484664/goNextVideo.meta.js
// ==/UserScript==
/* global $ */
(function () {
    function loopInteractive() {


        if (document.getElementById('video')) {
            var mioVideo = document.getElementById('video');
            mioVideo.muted = true;
        }
        var refreshIntervalId = setInterval(() => {
            if (document.querySelectorAll('.bg-platform-hover-light')[0].innerText === "Test di fine lezione\nEsegui") {

                var startingParent = document.querySelectorAll('.bg-platform-hover-light')[0].parentElement.parentNode.parentNode.parentNode;
                var childNodes = Array.from(startingParent.parentNode.childNodes);
                var currentIndex = childNodes.indexOf(startingParent);
                console.log(currentIndex);
                console.log("childNodes", childNodes);
                console.log(childNodes[currentIndex + 1].childNodes[0].childNodes[0]);
                if (startingParent.parentNode.childNodes[currentIndex + 1].childNodes[0].childNodes.length === 2) {
                    var nextModule = childNodes[currentIndex + 1].childNodes[0].childNodes[0].childNodes[0];
                    nextModule.click();
                    if (startingParent.parentNode.childNodes[currentIndex + 1].childNodes[0].childNodes[1].childNodes[1].children[1].children[0]) {
                        var nextLessonToClick = startingParent.parentNode.childNodes[currentIndex + 1].childNodes[0].childNodes[1].childNodes[1].children[1].children[0]
                        nextLessonToClick.click();
                        nextModule.click();
                        if (document.getElementById('video')) {
                            var mioVideo = document.getElementById('video');
                            mioVideo.muted = true;
                        }
                    }


                }

            }
            var elementSelector = document.querySelectorAll('.bg-platform-hover-light')[0];
            var matches = elementSelector.innerText.match(/(\d+)%/);
            console.log("Percentage is: ->", matches[1]);

            if (matches[1] === "100") {
                console.log("### STEP 1 ### Next video triggered")
                arrowClick = document.querySelector('#video').parentNode.childNodes[5].childNodes[0].childNodes[1].childNodes[2].childNodes[1];
                arrowClick.click();
                clearInterval(refreshIntervalId);
                console.log("### STEP 2 ### CLEANED INTERVAL")
                setTimeout(() => {
                    console.log("### STEP 3 ### TIMEOUT TRIGGERED")
                    if (document.getElementById('video')) {
                        var mioVideo = document.getElementById('video');
                        mioVideo.muted = true;
                    }
                    loopInteractive();
                }, "10000");
            }

        }, "5000");
    };
    loopInteractive();
})();

