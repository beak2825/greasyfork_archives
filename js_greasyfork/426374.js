// ==UserScript==
// @name         Attendance Responder (CHILD WINDOW side)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script requires the meeting opener side script in order to function. It detects the teacher saying your name, and when attendance starts. Disable the response by commenting out lines 61 to 83
// @author       Alan Yu
// @grant        none
// @include      https://meet.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/426374/Attendance%20Responder%20%28CHILD%20WINDOW%20side%29.user.js
// @updateURL https://update.greasyfork.org/scripts/426374/Attendance%20Responder%20%28CHILD%20WINDOW%20side%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function detectword(word, action){
        var caption_elements;
        var words;
        word = word.toUpperCase();
        var prev_words;
        var int = setInterval(function(){
            if(((Date.now()/60000)-parseInt(localStorage.getItem("joinedTimestamp")))<15){
                caption_elements = document.getElementsByClassName('CNusmb');
                for(var i = 0; i<caption_elements.length; i++){
                    words = caption_elements[i].innerText.toUpperCase().split(" ");
                    if(!(words == prev_words)){
                        if(words.includes(word)||words.includes(word+",")||words.includes(word+".")||words.includes(word+"!")||words.includes(word+"?")){
                            action();
                            clearInterval(int);
                            return "found";
                            break;
                        }
                    }
                    prev_words = words;
                }
            }
            else{
                clearInterval(int);
            }
        }, 1000);
    }
    function onNameCall(){
        try{
            document.querySelector('[data-tooltip="Turn on microphone (ctrl + d)"]').click();
        }
        catch{}finally{}
            window.opener.postMessage("calledAttendance", "*");
        window.onmessage = function(message){
            if(message.data == "leave"){
                //Don't post message on close
                window.onbeforeunload = function(){}
                //Try closing window
                window.close();
            }
            if(message.data == "audioEnded"){
                document.querySelector('[data-tooltip="Turn off microphone (ctrl + d)"]').click();
            }
            if(message.data == "setJoinTimestamp"){
                localStorage.setItem("joinedTimestamp", Date.now()/60000);
            }
        }
        document.querySelector('[aria-disabled="false"][jsname="r8qRAd"][jscontroller="VXdfxd"][role="button"]').click();
    }
    //Comment out the stuff below to disable
    var attendanceInt = setInterval(function(){
        if(!(document.querySelector('[aria-label="Leave call"]')==null)){
            document.querySelector('[aria-disabled="false"][jsname="r8qRAd"][jscontroller="VXdfxd"][role="button"]').click();
            detectword("here", function(){
                detectword("YOUR NAME", function(){
                    onNameCall();
                })
                detectword("ANOTHER VARIATION", function(){
                    onNameCall();
                })
                detectword("YET ANOTHER", function(){
                    onNameCall();
                })
                detectword("ADD AS MANY AS YOU WANT", function(){
                    onNameCall();
                })
            })
            clearInterval(attendanceInt);
        }
    }, 100);
    //Until here
})();