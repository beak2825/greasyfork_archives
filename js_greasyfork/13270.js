// ==UserScript==
// @name            autonomnom - VisionTurk - See the Images and Answer Multiple Choice Questions
// @author          mkrobert
// @namespace       mkrobert
// @include         *
// @version         0.01
// @grant           none
// @description:en  Select 
// @icon http://mturkgrind.com/data/avatars/l/8/8874.jpg?1445404860
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @description Select
// @downloadURL https://update.greasyfork.org/scripts/13270/autonomnom%20-%20VisionTurk%20-%20See%20the%20Images%20and%20Answer%20Multiple%20Choice%20Questions.user.js
// @updateURL https://update.greasyfork.org/scripts/13270/autonomnom%20-%20VisionTurk%20-%20See%20the%20Images%20and%20Answer%20Multiple%20Choice%20Questions.meta.js
// ==/UserScript==

if ($("h3:contains(See the Images and Answer Multiple Choice Questions)").length)
    runScript();

function runScript()
{
    $('#start-btn').focus(); //saves you from needing to click on the background at the start
    window.onkeydown = function(e)
    {
        //Press 1 through 4 for Red, Yellow or Green choices.
        if (e.keyCode === 82) {//press the r key for red box
            $('#optionsRadios0').click(); 
            $('#next-btn').click();
        }
        if (e.keyCode === 89) {//press the y key for yellow box
            $('#optionsRadios1').click();
            $('#next-btn').click();
        }
        if (e.keyCode === 71) {//press the g key for green box
            $('#optionsRadios2').click();
            $('#next-btn').click();
        }
        if (e.keyCode === 66) {//press the b key for blue box
            $('#optionsRadios3').click();
            $('#next-btn').click();
        }
        //Start, Continue to the Next, or Go Back

        if (e.keyCode === 81) //press the q key to Start 
            $('#start-btn').click();
        if (e.keyCode === 87) //press the w key for Back 
            $('#prev-btn').click();
        if (e.keyCode === 69) //press the e key for Next 
            $('#next-btn').click();

        //Submit
        if (e.keyCode === 192) // press the grave accent key ` for Submit
            $('#submit-btn').click();
    }
}