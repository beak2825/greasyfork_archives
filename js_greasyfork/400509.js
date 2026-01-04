// ==UserScript==
// @name         MTURK IC3 Speech QA HITs quick play w/hotkey
// @namespace    https://greasyfork.org/en/scripts/400509-mturk-ic3-ai-team-speech-qa
// @version      1.6.12
// @description  Auto play sound clip when clicking on a new tab (hotkeys for tabs 1 - 12 are letters q - p , the '[' key for tab 11, and the ']' key for tab 12 )
// @author       curtidawg
// @match      *mturkcontent.com/*
// @match      *worker.mturk.com/projects/*
// @exclude      https://worker.mturk.com/direct_deposit*
// @exclude      https://worker.mturk.com/payment_schedule*
// @require      http://code.jquery.com/jquery-3.4.1.js
// @downloadURL https://update.greasyfork.org/scripts/400509/MTURK%20IC3%20Speech%20QA%20HITs%20quick%20play%20whotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/400509/MTURK%20IC3%20Speech%20QA%20HITs%20quick%20play%20whotkey.meta.js
// ==/UserScript==


$( "#Q1-tab" ).click(function() { // if Q1-tab is clicked
    document.querySelector("#baudio_q1").click(); // baudio_q1 audio clip will play
});

$( "#Q2-tab" ).click(function() {  // if Q2-tab is clicked
    document.querySelector("#baudio_q2").click(); // baudio q2 audio clip will play
});

$( "#Q3-tab" ).click(function() {
    document.querySelector("#baudio_q3").click();
});

$( "#Q4-tab" ).click(function() {
    document.querySelector("#baudio_q4").click();
});

$( "#Q5-tab" ).click(function() {
    document.querySelector("#baudio_q5").click();
});

$( "#Q6-tab" ).click(function() {
    document.querySelector("#baudio_q6").click();
});

$( "#Q7-tab" ).click(function() {
    document.querySelector("#baudio_q7").click();
});

$( "#Q8-tab" ).click(function() {
    document.querySelector("#baudio_q8").click();
});

$( "#Q9-tab" ).click(function() {
    document.querySelector("#baudio_q9").click();
});

$( "#Q10-tab" ).click(function() {
    document.querySelector("#baudio_q10").click();
});

$( "#Q11-tab" ).click(function() {
    document.querySelector("#baudio_q11").click();
});

$( "#Q12-tab" ).click(function() {
    document.querySelector("#baudio_q12").click();
});



    $(document).keypress(function(event) { //press a keyboard button
        if ( event.which == 113 ) { // 113 is the q key....the keycode number identifies which key... go to "https://www.w3schools.com/charsets/ref_html_8859.asp" to find out which key is which this HIT is using ISO-8859-1 Character Set
            document.querySelector("#Q1-tab").click(); // this will select the tab by Id and click on that tab... replace Q1-tab to change
    }
});

	$(document).keypress(function(event) {
        if ( event.which == 119 ) {
            document.querySelector("#Q2-tab").click();
    }
});

    $(document).keypress(function(event) {
        if ( event.which == 101 ) {
            document.querySelector("#Q3-tab").click();
      }
});
    $(document).keypress(function (event) {
        if ( event.which == 114 ) {
            document.querySelector("#Q4-tab").click();
        }
});

    $(document).keypress(function(event) {
        if ( event.which == 116 ) {
            document.querySelector("#Q5-tab").click();
          }
});

    $(document).keypress(function(event) {
        if ( event.which == 121 ) {
            document.querySelector("#Q6-tab").click();
            }
});

    $(document).keypress(function(event) {
        if ( event.which == 117 ) {
            document.querySelector("#Q7-tab").click();
              }
});

    $(document).keypress(function(event) {
        if ( event.which == 105 ) {
            document.querySelector("#Q8-tab").click();
                }
});

    $(document).keypress(function(event) {
        if ( event.which == 111 ) {
            document.querySelector("#Q9-tab").click();
                  }
});

    $(document).keypress(function(event) {
        if ( event.which == 112 ) {
            document.querySelector("#Q10-tab").click();
                    }
});

    $(document).keypress(function(event) {
        if ( event.which == 91 ) {
            document.querySelector("#Q11-tab").click();
                    }
});

    $(document).keypress(function(event) {
		if ( event.which == 93 ) {
			document.querySelector("#Q12-tab").click();
			                    }
});

	$(document).keypress(function(event) {
		if (event.which == 32 ) { // spacebar
        	document.querySelector("#next-rating").click(); // <--next button
    }
 });


	$(document).keypress(function(event) { // keypress of...
		if (event.which == 13 ) { // keycode 13 or the Enter button....
        	document.querySelector("#submitButton").click(); // submits a finished hit
    }
 });

/**
* TODO  ------------  ===============  ><><><><><><><><><><><><><><  ===============  ------------
* TODO  ------------  ===============  Currently under construction  ===============  ------------
* TODO  ------------  ===============  ><><><><><><><><><><><><><><  ===============  ------------
*?
*? $(document).keypress(function (event) {
*?    if (event.which == 49) { // press the 1 key...
*?	 $('input[name="q1"][value="1"]').click(); } //to select Q1 bad or (1) radio button
*? });
*?
*? $(document).keypress(function (event) {
*?    if (event.which == 50) { // press the 2 key...
*?       $('input[name="q1"][value="2"]').click() } //to select Q1's poor or (2) radio button
*? });
*? $(document).keypress(function (event) {
*?    if (event.which == 51) { // press the 3 key...
*?       $('input[name="q1"][value="3"]').click() } //to select Q1's fair or (3) radio button
*? });
*? $(document).keypress(function (event) {
*?    if (event.which == 52) { // press the 4 key...
*?       $('input[name="q1"][value="4"]').click() } //to select Q1's good or (4) radio button
*? });
*? $(document).keypress(function (event) {
*?    if (event.which == 53) { // press the 5 key...
*?       $('input[name="q1"][value="5"]').click() } //to select Q1's excellent or (5) radio button
*? });

* TODO 	------------  ===============  ><><><><><><><><><><><><><><  ===============  ------------
* TODO 	------------  ===============  Currently under construction  ===============  ------------
* TODO 	------------  ===============  ><><><><><><><><><><><><><><  ===============  ------------
*/