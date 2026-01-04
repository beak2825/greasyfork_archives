// ==UserScript==
// @author craftwar
// @name NightBot-AutoDJ song-name helper
// @description Make craftwar's obs plugin (https://craftwarblog.blogspot.com/2018/01/obs-plugin-playing-song.html) able to get NightBot-AutoDJ song name.
// @copyright 2020, craftwar (https://craftwarblog.blogspot.com/)
// @license GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @homepageURL https://github.com/craftwar/userscript/tree/master/NightBot-song-name-helper
// @version 0.1.20201005
// @namespace github.com.craftwar
// @match https://beta.nightbot.tv/song_requests*
// @match https://nightbot.tv/song_requests*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/37311/NightBot-AutoDJ%20song-name%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/37311/NightBot-AutoDJ%20song-name%20helper.meta.js
// ==/UserScript==

'use strict';
(() => {
const body_observer = new MutationObserver( (record, observer)=> {
	const element = document.querySelector(".current-track > h4:first-child > strong:first-child").childNodes[0];
	if (element) {
		observer.disconnect();

		const song_observer = new MutationObserver( ()=> {
			document.title = element.wholeText + " - YouTube";
		});
		song_observer.observe(element, { characterData: true });
	}
});

const body_element = document.querySelector("body");
body_observer.observe(body_element, { subtree: true, childList: true });
})();
