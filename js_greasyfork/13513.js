// ==UserScript==
// @name        StrangerMeetup next button
// @description Will add a "Next stranger" button
// @namespace   maoistscripter
// @version     1.1
// @grant       none
// @include https://strangermeetup.com/*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/keymaster/1.6.1/keymaster.min.js
// @downloadURL https://update.greasyfork.org/scripts/13513/StrangerMeetup%20next%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/13513/StrangerMeetup%20next%20button.meta.js
// ==/UserScript==
$(document).ready(function() {
    
    var pressed = localStorage.getItem('pressed');
  
    // StrangerMeetup - Chat
    if ($('.container').hasClass("chat-content")) {

        $(".container").append('<button class="next-stranger">Next stranger (ESC)</button>');
        $(".next-stranger").css("background-color", "#49AB99");
        $(".next-stranger").click(next);
        key('esc', next);
        
    // StrangerMeetup - Home
    } else {

        if (pressed !== null) {
            localStorage.removeItem('pressed');
            window.location = 'https://strangermeetup.com/chat';
        }
    }
  
});

function next() {
    $("#text").focusout();
    $(".next-stranger").html('Next stranger ...');
    window.onbeforeunload = null;
    window.location = 'https://strangermeetup.com/chat';
    localStorage.setItem('pressed', "true");
}
