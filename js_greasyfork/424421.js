// ==UserScript==
// @name         NPC - Redesign
// @namespace    https://greasyfork.org/users/424421
// @version      v0.0.2
// @description  Redesign Attempt for Neopets Classic
// @author       Harry Shaw (Hazer)
// @include      https://neopetsclassic.com/*
// @include      https://www.neopetsclassic.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/424421/NPC%20-%20Redesign.user.js
// @updateURL https://update.greasyfork.org/scripts/424421/NPC%20-%20Redesign.meta.js
// ==/UserScript==

$(function() {

	// USER CHANGABLE VARIABLES

	let user_change = {
    
	}

	// BE CAREFUL WHEN CHANGING ANYTHING BELOW THIS LINE

	let alarm = localStorage.getItem('alarm', 0);
	let sound = localStorage.getItem('sound', "http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");

	let settingsButton = `<button class="open-settings">Open Settings</button>`;
	let settingsButtonClose = `<button class="close-settings">Close Settings</button>`;

	let modalTest =
	`
	<div class="settings-modal">
		<div class="settings-title">
			RS Clock Settings
		</div>

		<div class="settings-form">
			<div class="seperator"><input type="checkbox" id="alarm" name="alarm" ${alarm == true ? 'checked="checked"' : ''}>
			<label>Annoying Alarm.</label></div>

			<div class="seperator"><label>Sounds</label>
			<select id="sound">
				<option value="http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3">Pop</option>
				<option value="http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/bonus.wav">Bonus Sound</option>
			</select></div>

			<button class="save-settings">Save Settings</button>
		</div>
	</div>
	`;

	$('body').append(settingsButton);
	$('body').append(settingsButtonClose);
	$('body').append(modalTest);
	//$(`#sound option[value="${sound}"]`).attr('selected', true);

	// Append the CSS to the page
	let customCSS = ``;

	$("<style>").prop("type", "text/css").html(customCSS).appendTo("head");
  
});
