// ==UserScript==
// @name         Meeting Opener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically open google meet tab on scheduled time and close on scheduled time
// @author       Alan Yu
// @grant        none
// @match        none
// @downloadURL https://update.greasyfork.org/scripts/426371/Meeting%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/426371/Meeting%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';
function MeetBot(code, join, leave){
    //Set local storage, and get from it
    var cname = localStorage.getItem("name");
    //Check if user is in meeting
    if(localStorage.getItem("inMeeting") == "true"){
        //Get the window.child variable again
        window.child = window.open("", (parseInt(localStorage.getItem("name"))-1).toString());
    }
    //Check if first time
    if(cname == undefined){
        //Set name to 0
        cname = 0;
        //Put name in local storage, so each window has a unique name
        localStorage.setItem("name", cname);
    }
    //If meeting was closed, message will be recieved
    window.onmessage = function(message){
        //For the attendance responder
        if(message.data == "calledAttendance"){
            audio_player.play();
        }
    }
    //Get audio_player variable
    var audio_player = document.querySelector('audio#audio_player_for_attendance');
    //When audio player has ended
    audio_player.onended = function(){
        window.child.postMessage("audioEnded", "*")
    }
    //Make date var
    var today = new Date();
    //Get time from Sunday 12 am in miliseconds
    var time = today.getDay()*86400000 + today.getHours()*3600000 + today.getMinutes()*60000 + today.getSeconds()*1000 + today.getMilliseconds();
    //Convert join time to milliseconds from Sunday 12 am
    var joinmil = join[0]*86400000 + join[1]*3600000 + join[2]*60000 + join[3]*1000;
    //Convert leave time to milliseconds from Sunday 12 am
    var leavemil = leave[0]*86400000 + leave[1]*3600000 + leave[2]*60000 + leave[3]*1000;
    //Subtract them, for setTimeout loop, also regrouping calculations
    if(joinmil-time<0){
        var joindelay = (joinmil-time)+604800000;
    }
    else{
        //Ignore this error
        var joindelay = joinmil-time;
    }
    if(leavemil-time<0){
        var leavedelay = (leavemil-time)+604800000;
    }
    else{
        //Ignore this error
        var leavedelay = leavemil-time;
    }
    //setTimeout for open
    setTimeout(function(){
        //Set local storage that person is in meeting
        localStorage.setItem("inMeeting", true);
        //Open tab
        window.child = window.open("https://meet.google.com/lookup/".concat(code), cname);
        //Wait a while
        setTimeout(function(){
            //Tell child to put timestamp
            window.child.postMessage("setJoinTimestamp", "*");
        }, 1000);
        //Set the name variable
        localStorage.setItem("name", parseInt(cname)+1);
    }, joindelay);
    //Make a setTimeout for when to close it
    setTimeout(function(){
        //Get window.child variable from local storage
        window.child = window.open("", (parseInt(localStorage.getItem("name"))-1).toString());
        //Remove detectClose interval
        clearInterval(parseInt(localStorage.getItem("detectClose")));
        //Remove detectClose from localStorage
        localStorage.removeItem("detectClose");
        //Remove onmessage
        window.onmessage = function(){}
        //Tell child window to not send a message on onbeforeunload
        window.child.postMessage("leave", "*");
        //Set local storage that person has exited meeting
        localStorage.setItem("inMeeting", false);
        //Close tab
        window.child.close();
        //Reload and refresh!
        window.location.reload();
    }, leavedelay);
}
//Add tasks here. Time format is [Day, Hour, Minute, Seconds] in 24 hour time.

})();