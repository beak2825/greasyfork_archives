// ==UserScript==
// @name        Volume control
// @namespace   Violentmonkey Scripts
// @match       https://bonk.io/gameframe-release.html
// @run-at      document-idle
// @grant       none
// @version     1.0
// @author      Blu
// @description Adds a volume slider to the settings menu
// @downloadURL https://update.greasyfork.org/scripts/457287/Volume%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/457287/Volume%20control.meta.js
// ==/UserScript==

// create volume HTML
let fpsContainer = document.querySelector('.settings_fps_container');
let volumeContainer = document.createElement('label');
volumeContainer.className = "settings_volume_container";
volumeContainer.innerHTML = `
<div id="settings_fps_label">Volume</div>
<input type="range" class="compactSlider compactSlider_classic" min="0" max="1" value="1" step="0.01" class="slider" id="settings_volume_slider" oninput="Howler.volume(this.value);">`;

// create volume CSS
let volumeCSS = document.createElement("style");
volumeCSS.innerText = `
  .settings_volume_container{
		left: 245px;
		top: 335px;
		width: 130px;
		position: absolute;
	}

	#settings_volume_slider{
		background-color: transparent;
		width: 100px;
	}`;

// add html/css to page
document.head.appendChild(volumeCSS);
fpsContainer.parentNode.insertBefore(volumeContainer, fpsContainer.nextSibling);