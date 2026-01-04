// ==UserScript==
// @name         Attendance Responder (MEETING OPENER side)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script requires the child window side script to function. It plays the "here" audio on the meeting opener side, and is the recieving end to messages for the child window side attendance responder.
// @author       Alan Yu
// @grant        none
// @match        none
// @downloadURL https://update.greasyfork.org/scripts/426375/Attendance%20Responder%20%28MEETING%20OPENER%20side%29.user.js
// @updateURL https://update.greasyfork.org/scripts/426375/Attendance%20Responder%20%28MEETING%20OPENER%20side%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Check if user is in meeting
    if(localStorage.getItem("inMeeting") == "true"){
        //Get the window.child variable again
        window.child = window.open("", (parseInt(localStorage.getItem("name"))-1).toString());
    }
    //Create invisible element of audio
    document.documentElement.innerHTML=document.documentElement.innerHTML+('<div style="opacity: 0;"><audio id="audio_player_for_attendance"></audio></div>');
    //Array with data URL's
    var audio_data_urls = ["ADD IN HERE AS MANY URLS AS YOU WANT FOR YOUR HERE AUDIO"];
    //Get audio_player variable
    var audio_player = document.querySelector('audio#audio_player_for_attendance');
    //Reset it in case anything goes wrong
    while(!(audio_data_urls.includes(audio_player.src))){
        //Source of audio player is a data URL
        audio_player.src = audio_data_urls[Math.round(Math.random()*(audio_data_urls.length-1))];
    }
    //If meeting was closed, message will be recieved
    window.onmessage = function(message){
        //For the attendance responder
        if(message.data == "calledAttendance"){
            audio_player.play();
        }
    }
    //When audio player has ended
    audio_player.onended = function(){
        window.child.postMessage("audioEnded", "*")
    }
})();