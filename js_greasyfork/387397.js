// ==UserScript==
// @name         Wanikani Anime Edition
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds anime characters to the page. Comments out the ones you don't want.
// @author       Iaro
// @match        https://www.wanikani.com/dashboard
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387397/Wanikani%20Anime%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/387397/Wanikani%20Anime%20Edition.meta.js
// ==/UserScript==

(function() {
		//Does the thing!
		waitForKeyElements('#burned span', function(e) {
				// Haruhi
				$('.one-hour').css('height', '119px');
				$('.one-hour').append('<img src="https://vignette.wikia.nocookie.net/community-plaza/images/6/60/Haruhi14.png/revision/latest?cb=20160314023309" style="position: relative; display: block; height: 115px; left: 75%; bottom: 91px;">');
                //Kanna
                $('#burned').css('height', '104.5px');
				$('#burned').append('<img src="https://cdn.discordapp.com/emojis/295269590219489290.png?v=1" style="position: relative; display: block; height: 40px; bottom: 17px; left: 75%;">');

        });
})();