// ==UserScript==
// @name			No YouTube Chat
// @name:fr			No YouTube Chat
// @description		Removes live chat from Youtube lives and videos
// @description:fr	Supprime le chat des videos et lives YouTube
// @author			PsychoPatate
// @license			GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @namespace		https://github.com/PsychoPatate
// @version			1.4
// @source			https://github.com/PsychoPatate/No-YouTube-Chat
// @iconURL			https://raw.githubusercontent.com/PsychoPatate/No-YouTube-Chat/main/icon128.png
// @icon64URL		https://raw.githubusercontent.com/PsychoPatate/No-YouTube-Chat/main/icon64.png
// @supportURL		https://github.com/PsychoPatate/No-YouTube-Chat/issues
// @require			https://code.jquery.com/jquery-3.5.1.min.js
// @run-at 			document-end
// @noframes
// @grant			window.onurlchange
// @match			https://www.youtube.com/watch*
// @downloadURL https://update.greasyfork.org/scripts/416957/No%20YouTube%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/416957/No%20YouTube%20Chat.meta.js
// ==/UserScript==

(function() {
	'use strict';

	function checkChat() {
		var tries = 0;
		var checkExist = setInterval(function() {
			console.log("checking for chat");
			if (tries++ > 3)
				clearInterval(checkExist);
			if ($('#chat').length) {
				$('#chat').remove();
				clearInterval(checkExist);
			}
		}, 500);
	}

	if (window.onurlchange === null){
		window.addEventListener('urlchange', function(){
			checkChat();
		})
	}

	checkChat()
})();
