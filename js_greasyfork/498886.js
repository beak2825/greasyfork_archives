// ==UserScript==
// @name        Add "Mute Site" functionality to all websites in Google Chrome
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      enbyte
// @description Make the "Mute Site" button active on every site you visit in Google Chrome
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/498886/Add%20%22Mute%20Site%22%20functionality%20to%20all%20websites%20in%20Google%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/498886/Add%20%22Mute%20Site%22%20functionality%20to%20all%20websites%20in%20Google%20Chrome.meta.js
// ==/UserScript==


// https://www.reddit.com/r/chrome/comments/1de8ukn/right_click_tab_muteunmute_site_greyed_out/
// with swears removed + comments

function toggle_audio() {
	let dummy_audio_element = document.createElement('audio'); // create a sound to be played
	dummy_audio_element.src = 'data:audio/mp3;base64,'; // make it look like an mp3, with no real data
	document.documentElement.appendChild(dummy_audio_element); // add then immediately delete so chrome sees a blank audio mp3 b64 being played
	document.documentElement.removeChild(dummy_audio_element);
}

toggle_audio();