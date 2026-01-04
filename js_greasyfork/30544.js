// ==UserScript==
// @name         Edgenuity Master Controller v0.2
// @namespace    http://tampermonkey.net/
// @version      0.2.01
// @description  Edgenuity is killing us. VIVA LA RESISTANCE.
// @author       Hemlck with contributions to this project from: /u/Mrynot88 , /u/Turtlemower.
// @match        *https://r04.core.learn.edgenuity.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30544/Edgenuity%20Master%20Controller%20v02.user.js
// @updateURL https://update.greasyfork.org/scripts/30544/Edgenuity%20Master%20Controller%20v02.meta.js
// ==/UserScript==


// If you want to look at more things like this, go to our subreddit at reddit.com/r/edgenuity.



// ----- User Settings ----- //

var skip_speaking_intros = true;
// Default = true (If problems occur, try turning this off by replacing true with false)
// Description: This will allow the user to check boxes, complete assignments, or skip instructions as the speaker is talking as in the intro buttons.  If problems are occuring, try turning this off
// Bugs:
//
// May cause "Unable to load video file." error (You can change skip_speaking_intros if this problem occurs).  The program as of right now will just turn off the display of the error message that pops up.  I will look into fixing it

var is_auto_clicking = true;
// Default = true (If problems occur, try turning this off by replacing true with false)
// Description: This will automatically click the next button
// Bugs:
//
// Untested if left at false
// MAJOR: After Direct Instructions, it will get stuck in a loop at going to the next assignment.  This must be fixed!

var autodefi = true;
// Default = true (If problems occur, try turning this off by replacing true with false)
// Description: This will fill out textboxes for Vocabulary automatically using an exploit found by /u/Turtlemower.  The code for this part of the script was created by /u/Mrynot88 and has been greatly appreciated.
// Bugs:
//
// Currently, there are no bugs reported!

var e;

function triggerEvent(el, type) {
                    if ('createEvent' in document) {
                        // modern browsers, IE9+
                        e = document.createEvent('HTMLEvents');
                        e.initEvent(type, false, true);
                        el.dispatchEvent(e);
                    } else {
                        // IE 8
                        e = document.createEventObject();
                        e.eventType = type;
                        el.fireEvent('on'+e.eventType, e);
                    }
                }

(function() {
    'use strict';
/*
----- Developer Info -----
Built on top of the "edgenuity next clicker" which can be found at https://greasyfork.org/en/scripts/19842-edgenuity-next-clicker

This is open to anyone and does not have any rights.  It is available for the public as long as it is not sold in any way or form (as well as if it is modified).

Any questions or any contact about this program can be sent to joseph.tortorelli5@gmail.com or you can contact me on reddit with the username /u/hemlck
--- Program Info ---
variable "pageload" is set to an interval every 1 second (1000ms)

variable "current_frame" will only get the current frame if it has been completed.  It will not actually get the current frame.

variable "nextactivity" and "nextactivity_disabled" are for the next button on the bottom of the screen.  It will not only turn to the next acitivty, but also the next lesson if its after a quiz.

variable "alreadyPlayedCheck" is specific to the code for the auto-completion of the vocab.

variable current_page is unused as of right now because of a bug
*/
    var pageload, nextclicker, nextslide_button, nextactivity, nextactivity_disabled;
    var current_frame;
    var current_frame_id;
    var alreadyPlayedCheck;
    var current_page;
    function loadpage() {
        if(skip_speaking_intros){
            var invis = document.getElementById("invis-o-div");
            var error_message_delete = document.getElementById("uid1_errorMessage");
            if(invis){
                invis.parentElement.removeChild(invis);
            }
            if(error_message_delete){
                error_message_delete.parentElement.removeChild(error_message_delete);
            }
        }
        if(is_auto_clicking){
        pageload = setInterval(function() {
           current_page = document.getElementById("activity-title");
           nextactivity = document.getElementsByClassName("footnav goRight")[0];
           nextactivity_disabled = document.getElementsByClassName("footnav goRight disabled")[0];
            if (nextactivity && !nextactivity_disabled) {
                nextactivity.click();
                clearInterval(pageload);
                setTimeout(loadpage, 1000);
            }
            current_frame = document.getElementsByClassName("FrameCurrent FrameComplete")[0];
            //if(current_frame){
            //current_frame_id = current_frame.id;
            //}
            nextslide_button = document.getElementsByClassName("FrameRight")[0];
            if (nextslide_button && current_frame) {
                nextclicker = setInterval(function() {
                    nextslide_button.click();
                    setTimeout(function () {
                        //var invis = document.getElementById("invis-o-div");
                        //if (invis) {
                            //invis.setAttribute("style", "display: none;");
                        //}
                    }, 500);
                }, 500);
                clearInterval(pageload);
            }
        }, 1000);
    }
       //if(current_page.innerhtml == "Vocabulary"){
        if (autodefi){ // This is for the auto-completition of the vocab
            setInterval(function () {
                var normalTextBox = document.getElementsByClassName("word-textbox word-normal")[0];
                var correctTextBox = document.getElementsByClassName("word-textbox word-correct")[0];
                var normalTextButton = document.getElementsByClassName("plainbtn alt blue selected")[0];
                var firstDefButton = document.getElementsByClassName("playbutton vocab-play")[0];
                var nextButton = document.getElementsByClassName("uibtn uibtn-blue uibtn-arrow-next")[0];
                if(normalTextBox && !correctTextBox){
                    normalTextBox.value = normalTextButton.innerHTML;
                    alreadyPlayedCheck = false;
                    triggerEvent(normalTextBox, "keyup");
                }
                if(correctTextBox && !alreadyPlayedCheck){
                    firstDefButton.click();
                    alreadyPlayedCheck = true;
                }
                if(nextButton && correctTextBox){
                    nextButton.click();
                }
            },2000);
    }
       //}
    }
    loadpage();
})();