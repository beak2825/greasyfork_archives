// ==UserScript==
// @name			Youtube Full Theater
// @name:fr			Youtube Full Theater
// @description		Makes YouTube's theater mode fill the screen
// @description:fr	Fait que le mode cinéma de YouTube remplisse la fenêtre
// @author			PsychoPatate
// @license			GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @namespace		https://github.com/PsychoPatate
// @version			1.1
// @source			https://github.com/PsychoPatate/Youtube-Full-Theater
// @iconURL			https://raw.githubusercontent.com/PsychoPatate/Youtube-Full-Theater/main/icon128.png
// @icon64URL		https://raw.githubusercontent.com/PsychoPatate/Youtube-Full-Theater/main/icon64.png
// @supportURL		https://github.com/PsychoPatate/Youtube-Full-Theater/issues
// @require			https://code.jquery.com/jquery-3.5.1.min.js
// @run-at 			document-end
// @noframes
// @match			https://www.youtube.com/watch*
// @downloadURL https://update.greasyfork.org/scripts/416967/Youtube%20Full%20Theater.user.js
// @updateURL https://update.greasyfork.org/scripts/416967/Youtube%20Full%20Theater.meta.js
// ==/UserScript==


(function() {
	'use strict';

	var fsMode = 0;

	// Resize theatre player as soon as it exists
	var tries = 0;
	var checkExist = setInterval(function() {
		if (tries++ > 3)
			clearInterval(checkExist);
		if ($('#player-theater-container').length) {
			$('#player-theater-container').css("max-height", "calc(100vh - 56px)");
			clearInterval(checkExist);
		}
	}, 500);

	// Restore height when clicking fullscreen button
	$('.ytp-fullscreen-button').click(function() {
		if (fsMode == 0) {
			$('#player-theater-container').css("max-height", "");
			fsMode = 1;
		}
		else if (fsMode == 1) {
			$('#player-theater-container').css("max-height", "calc(100vh - 56px)");
			fsMode = 0;
		}
	});

	// Restore height when double clicking video
	$('#player-theater-container').dblclick(function() {
		if (fsMode == 0) {
			$('#player-theater-container').css("max-height", "");
			fsMode = 1;
		}
		else if (fsMode == 1) {
			$('#player-theater-container').css("max-height", "calc(100vh - 56px)");
			fsMode = 0;
		}
	});

	// Restore height when pressing fullscreen key
	document.addEventListener("keyup",function(event){
		if(event.keyCode === 70) {
			if (fsMode == 0) {
				$('#player-theater-container').css("max-height", "");
				fsMode = 1;
			}
			else if (fsMode == 1) {
				$('#player-theater-container').css("max-height", "calc(100vh - 56px)");
				fsMode = 0;
			}
		}
	});
})();
