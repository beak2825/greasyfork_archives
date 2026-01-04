// ==UserScript==
// @name         Reverse Controls
// @version      1.2
// @description  Reverse controls for the game agar paper To start press S and it will reverse controls also will change the play button to give an indication, press S again to go back to normal controls
// @namespace    http://tampermonkey.net/
// @author       P_M_9_8_6
// @match       *http://paper-io.com/agar/*
// @match       *http://agarpaper.io/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @compatible   chrome
// @compatible   firefox
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433400/Reverse%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/433400/Reverse%20Controls.meta.js
// ==/UserScript==
$("document").ready(console.log("Script is ready"));
$("body").append("<div id = 'indicatorText' Style ='Color:black; position:absolute; top:33px; left:10px;font-size:25px;opacity:0.2;'><i>Controls Reversed</i></div>")
$("#indicatorText").hide();
//To eject mass at the press of SpaceBar(keyCode = 32) and keep ejecting if SpaceBar is held down
var interval;
var switchy = false;
var count = 0;
var rev_control = 0;

$(document).on('keydown',function(e){
if(e.keyCode == 83){//When S key is pressed

    window.onkeydown = null;
    window.onkeyup = null;

    if(rev_control == 0){
        $(".play").html("PLAY<sub>O</sub>");
        $("#indicatorText").show();
        rev_control = 1;
    }
    else if(rev_control == 1){
        $(".play").html("PLAY");
        $("#indicatorText").hide();
        rev_control = 0;
    }
}
if(rev_control == 1){
    if(e.keyCode == 87){
        Split();
    }

    if(e.keyCode == 32){
        Feed();
    }
}
else if(rev_control == 0){
    if(e.keyCode == 87){
        Feed();
    }

    if(e.keyCode == 32){
        Split();
    }
}
}
);

var global_i = 0;
function Split() {
        if (global_i < 1) {
                global_i++;
                sp(17);
                console.log("Split");
                setTimeout(Split, 170); // Increase this number to make its double split slower dont decrease it the server might not accept the split below this number
        }
        else
            global_i = 0;
}

function Feed() {
        if (global_i < 1) {
                global_i++;
                sp(21);
                console.log("Feed");
                setTimeout(Feed, 170); // Increase this number to make its double split slower dont decrease it the server might not accept the split below this number
        }
        else
            global_i = 0;
}

