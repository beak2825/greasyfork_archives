// ==UserScript==
// @name	DC - Object_found
// @author	Unknow
// @version	1.2
// @grant       none
// @description	Play song if object is found
// @match	https://www.dreadcast.net/Main
// @namespace	InGame
// @downloadURL https://update.greasyfork.org/scripts/457380/DC%20-%20Object_found.user.js
// @updateURL https://update.greasyfork.org/scripts/457380/DC%20-%20Object_found.meta.js
// ==/UserScript==

var audioElement = new Audio("https://www.thesoundarchive.com/email/tarzan-screaming.mp3");
$('body').append(audioElement);
$("#DC_object_found").prop('volume', '1');

let barreAction = $('span.action.inlineBlock')[0];

$(document).ready( function() {
	function alert_user() {



        const string = barreAction.innerText;
        const regex = /Objet trouvé/i


        if (regex.test(string)) {

            audioElement.load();
            audioElement.play();

            const Timeout = setTimeout(audioElement.stop(), 3000);
        }
	}


	$(document).ajaxComplete( function(a,b,c) {
		if(/Check/.test(c.url)) {
			alert_user();
		}
	});
});
console.log('DC - Object found started');