// ==UserScript==
// @name         Torn Custom Race Simplifier
// @version      0.5
// @description  Make it easier and faster to make custom races.
// @author       Xiphias[187717]
// @match        *www.torn.com/loader.php?sid=racing*
// @grant        none
// @namespace https://greasyfork.org/users/3898
// @downloadURL https://update.greasyfork.org/scripts/371341/Torn%20Custom%20Race%20Simplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/371341/Torn%20Custom%20Race%20Simplifier.meta.js
// ==/UserScript==
var numberOfLaps = "1"; // Change this value to set number of laps.
var maxDrivers = "2"; // Change this value to set the number of maximum drivers.
var trackName = "Uptown"; // Change to desired track name

(function() {
    'use strict';
	$('body').ajaxComplete(function (e, xhr, settings) {
        var createCustomRaceSection = "section=createCustomRace";
		var url = settings.url;
		if (url.indexOf(createCustomRaceSection) >= 0) {
            var lapsInput = $('.laps-wrap > .input-wrap > input');
            lapsInput.attr('value', numberOfLaps);

            var maxDriversInput = $('.drivers-max-wrap div.input-wrap input');
            maxDriversInput.attr('value', maxDrivers);

            $('#select-racing-track').selectmenu();
            $('#select-racing-track-menu > li:contains(' + trackName+ ')').mouseup();
        }
    });
})();