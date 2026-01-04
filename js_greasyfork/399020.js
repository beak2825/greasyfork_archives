// ==UserScript==
// @name         Le Show Enhancements
// @author       Than
// @version      0.03
// @description  Enhancements for Le Show
// @match        https://harryshearer.com*
// @include      https://harryshearer.com*
// @connect      harryshearer.com
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @namespace https://greasyfork.org/users/288098
// @downloadURL https://update.greasyfork.org/scripts/399020/Le%20Show%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/399020/Le%20Show%20Enhancements.meta.js
// ==/UserScript==

//0.3 - Added skip forward and skip back. And hopefully fixed a bug where my phone keeps the volume too quiet after skipping a song.
//0.2 - published script

(function() {
    'use strict';
    /*--------------------------------------------------------------------------------------------------------------------
    ------------------------------------------- General functions --------------------------------------------------
    --------------------------------------------------------------------------------------------------------------------*/

    // not currently using anything here

    /*--------------------------------------------------------------------------------------------------------------------
    ------------------------------------------- Init functions --------------------------------------------------
    --------------------------------------------------------------------------------------------------------------------*/
    init(); // kick things off
    function init(){
        enhanceIndividualShowPage(); // fixes audio stuff on individual le show pages. Skips songs, prevents looping.
    }
    function enhanceIndividualShowPage(){
        if (!document.URL.includes("/le-shows/")){return} // if it's not an individual show page, return
        var audio = document.querySelector("audio"); // grab the audio tag from the page
        var goodTimestampArray = getTimestampArr(); // make an array of "good" timestamps - a list full of seconds where harry is talking and not playing music
        //  console.log(goodTimestampArray);
        audio.addEventListener("timeupdate",progressUpdated); // as the progress bar
        var currentTime; // global variable to store the current progress of the episode
        var gracePeriod = false; // if set to true, the script won't skip the song (assuming it's the grace period, last 30 seconds of the song.
        addSkipButtons();
        function addSkipButtons(){ // adds buttons to skip forward & back ten seconds
            var skipDiv = document.createElement("div");
            skipDiv.innerHTML = `<button id="rewind">⏪</button><button id="fast_forward">⏩</button>`; // creating our skip buttons
            var container = document.querySelector(".jp-type-playlist"); // choosing which container they'll go in
            var insertBeforeThis = container.querySelector("h3"); // we'll put our buttons above the "Music & Segments" H3 element
            container.insertBefore(skipDiv, insertBeforeThis); // insert the buttons
            skipDiv.addEventListener("click",skipClickHandler); // add their click logic
            function skipClickHandler(e){
                if (e.target == e.currentTarget){return} // ignores any clicks on the skipDiv itself
                var clicked = e.target; // what did the user click?
               // console.log(clicked);
                if (clicked.id === "rewind" || clicked.parentNode.id === "rewind"){ // user clicked the rewind button
                    audio.currentTime = audio.currentTime - 10; // skip back 10 seconds
                }
                else if (clicked.id === "fast_forward" || clicked.parentNode.id === "fast_forward"){ // user clicked the fast forward button
                    audio.currentTime = audio.currentTime + 20; // skip forward 20 seconds
                }
            }
        }
        async function fadeAudioOut(skipTo) {
            gracePeriod = true;
            var audio = document.querySelector("audio");
            var fadeOut = setInterval(volDown, 200);
            function volDown() {
                if (audio.volume <= 0.1) {
                    console.log("cancelling fade out")
                    clearInterval(fadeOut);
                    audio.currentTime = skipTo;
                    fadeAudioIn();
                } else {
                    console.log("ducking audio")
                    audio.volume = audio.volume - 0.03;
                }
            }
        }
        async function fadeAudioIn() {
            var audio = document.querySelector("audio");
            var fadeIn = setInterval(volUp, 400);
            function volUp() {
                if (audio.volume >= 0.8) {
                    console.log("finished fading in");
                    audio.volume = 1; // set volume to max
                    clearInterval(fadeIn);
                    // gracePeriod = false;
                } else {
                    console.log("upping audio")
                    audio.volume = audio.volume + 0.1;
                }
            }
        }
        async function progressUpdated(){
            var timestamp = Math.floor(audio.currentTime); // grab the current progress of the episode
            if (currentTime > 3300 && timestamp == 0){audio.pause()} // If the previous second was at the end of the episode, and the current second is at the beginning, pause so it doesn't loop
            if (currentTime == timestamp){return} // this whole function runs every time the event handler updates, which is 4 times per second. We don't want to iterate through the goodTimestampArray 4 times per second, so we do it once per second
            currentTime = timestamp; // now it's ok to update the time
            //   console.log(timestamp);
            if (goodTimestampArray.includes(timestamp)){
                gracePeriod = false;
                return} // if the current second is in the "good" timestamp array, never mind we're all good
            if (gracePeriod){return} // we're in the grace period part of the song. Return.
            for (var i=0,j = goodTimestampArray.length;i<j;i++){ // otherwise, loop through the array
                if (goodTimestampArray[i] > timestamp){ // look for the first array value which is bigger than the current time
                    fadeAudioOut(goodTimestampArray[i] - 30);
                    //   audio.currentTime = goodTimestampArray[i]-30; // skip to that value
                    break; // no need to loop any more
                }
            }
        }
        function getTimestampArr(){ // make an array of "good" timestamps, where harry is talking and not playing music
            var timestampDomElements = document.querySelector(".jp-playlist").querySelectorAll(".time"); // all timestamps for the episode
            var musicTimestampDomElements = document.querySelector(".other-list").querySelectorAll(".time"); // just the music timestamps
            var musicStartTimeArray = []; // this will be populated with the timestamps of the music we want to skip
            for (var i=0,j = musicTimestampDomElements.length-1;i<j;i++){ // -1 so as to allow the instrumental at the end of the broadcast to play. For each music timestamp
                if (musicTimestampDomElements[i].nextElementSibling.textContent.includes("Harry Shearer")){continue} // if it's Harry's own song, don't skip it
                var musicStartTime = convertTimeToSeconds(musicTimestampDomElements[i].textContent); // convert the time to seconds
                musicStartTimeArray.push(musicStartTime); // push the timestamp into our array of music to skip
            }
            //   console.log(musicStartTimeArray);
            var goodTimeArray = []; // this will be populated with a list of seconds which don't contain music
            for (var k=0,l = timestampDomElements.length;k<l;k++){ // for each timestamp dom element
                var startTime = convertTimeToSeconds(timestampDomElements[k].textContent); // convert the timestamp to seconds
                var endTime; // populate this with the end time, which depends on a couple of factors
                if (timestampDomElements[k+1]){ // if there's a next timestamp in the dom
                    endTime = convertTimeToSeconds(timestampDomElements[k+1].textContent); // make that the end time
                }
                else { // otherwise
                    endTime = 3900; // no more timestamps, it's the end of the podcast. Hard coded 3900 cos that's the absolute max duration of the show
                }
                if (musicStartTimeArray.includes(startTime)){ // if the start time of this element is the same as a music start time
                    continue; // don't add this chunk of seconds to the array
                }
                addGoodTimestampsToArr(goodTimeArray,startTime,endTime); // add this timestamp & all the seconds up to & including its endtime to the goodTimeArray
                //addGoodTimestampsToArray(array,startTime,endTime);
            }
            return goodTimeArray; // send this array back
        }
        function convertTimeToSeconds(timestamp){ // simple function to convert a timestamp to seconds (taken from the website's own code!)
            var timeSplit = timestamp.split(":");
            var timeInSeconds = (parseFloat(timeSplit[0]) * 60) + parseFloat(timeSplit[1]);
            return timeInSeconds;
        }
        function addGoodTimestampsToArr(array,startTime,endTime){ // feed this function the array you wan to update, the start time & the end time
            for (var i = parseInt(startTime); i <= parseInt(endTime); i++) { // for every number from start time to end time
                array.push(i); // push those numbers to the array
            }
        }
    }

    // not currently setting styles, but we might!
    var globalStyle = `
#rewind,#fast_forward{
  width: 60px;
  height: 50px;
  padding: 5px;
  margin: 5px;
  font-size: 30px;
  background-color: #fda732;
}
`
    GM_addStyle(globalStyle)
    // Your code here...
})();