// ==UserScript==
// @name         10FastFingers WPM
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Displays WPM, CPM and Words during typing test test
// @author       You
// @match        https://10fastfingers.com/typing-test/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392814/10FastFingers%20WPM.user.js
// @updateURL https://update.greasyfork.org/scripts/392814/10FastFingers%20WPM.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
$(function ()
{
    $(document).keydown(function (k)
    {
       var realWPM = Math.round((error_keystrokes / 5) / ((60.01 - countdown) / 60));

	if(realWPM < 0 || realWPM > 400)
    	{
        	realWPM = 0;
    	}

        $('#preview').html("<font size='+3'><b>WPM:</b> " + realWPM + "<br><b>Key Strokes:</b> " + error_keystrokes + "<br><b>Words:</b> " + error_correct + "</<font size='+3'>");
        $('#words').before("<div id='preview'></div>");
    });
});
    });
})();