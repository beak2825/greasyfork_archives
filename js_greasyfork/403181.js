// ==UserScript==
// @name         BeastSaber better song preview
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Allowes you to adjust volume and scrub through BeastSaber song preview (the "Listen to the song in your browser" button)
// @author       Darkrael
// @match        https://bsaber.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/403181/BeastSaber%20better%20song%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/403181/BeastSaber%20better%20song%20preview.meta.js
// ==/UserScript==

function wfeSingleSelector(sel, func, trys)
{
    if(trys > 20) { console.log("%cCoulnd't find an element matching the selector: \"" + sel + "\". Quiting!", "color: #a52525"); return; }
    var elements = [];
	elements = $(sel);
	if(elements === [] || elements.length === 0)
	{
		console.log("%cCoulnd't find an element matching the selector: \"" + sel + "\". Retrying!", "color: #E4A61B");
		setTimeout(function() { wfeSingleSelector(sel,func,++trys); }, 200);
		return;
	}
    func(elements);
}

var slider = document.createElement("input");
var volumeSlider = document.createElement("input");
var seekingBool = false;

$(document).ready(function() {
	wfeSingleSelector(".js-listen", function(listenButton) {
		listenButton.each(function( index ) {
			this.addEventListener("click", function() {
				waitForPlaying(this);
			});
		});

		var divOuter = document.createElement("div");
        var div = document.createElement("div");
		slider.type = "range";
		slider.min = "0";
		slider.max = "0";
		slider.value = 0;
		slider.id = "durationSlider";
        slider.style.setProperty("width", "100%");

		volumeSlider.type = "range";
		volumeSlider.min = "0";
		volumeSlider.max = "100";
		volumeSlider.value = 10;
		volumeSlider.id = "volumeSlider";
        volumeSlider.style.setProperty("width", "100%");

        divOuter.style.setProperty("background-color", "rgba(255, 255, 255, 0.32)");
		divOuter.style.setProperty("border-radius", "0px 0px 10px 0px");
        divOuter.style.setProperty("z-index", "10000");
        divOuter.style.setProperty("width", "8%");
        divOuter.style.setProperty("position", "fixed");
		divOuter.style.setProperty("top", "0");
		divOuter.style.setProperty("left", "0");
        divOuter.style.setProperty("width", "8%");



		div.style.setProperty("display", "grid");
		div.style.setProperty("margin", "10px");
        div.style.setProperty("color", "white");

		var sliderValue = document.createElement("p");
		sliderValue.id = "durationSliderValue";
		sliderValue.style.setProperty("margin", "auto");
		setInterval(function() {
			var minutes = Math.floor(slider.value / 60);
			var seconds = slider.value % 60 + "";
			seconds = seconds.padStart(2, '0');
			sliderValue.innerHTML = minutes + ":" + seconds;;
		}, 50);

		var playbackTimeText = document.createElement("p");
		playbackTimeText.innerHTML = "Playback Time: ";
		var volumeText = document.createElement("p");
		volumeText.innerHTML = "Volume: ";

		div.appendChild(playbackTimeText);
		div.appendChild(slider);
		div.appendChild(sliderValue);
		div.appendChild(volumeText);
		div.appendChild(volumeSlider);
        divOuter.appendChild(div);

		$('body')[0].appendChild(divOuter);



		setInterval(function() {
			if(!seekingBool) {
				slider.value = audio.currentTime;
			}
		}, 50);
		slider.addEventListener("mousedown", function() {
			seekingBool = true;
			slider.addEventListener("mousemove", seeking);
			seeking();
		});
		slider.addEventListener("mouseup", function() {
			seeking();
			seekingBool = false;
			slider.removeEventListener("mousemove", seeking);
		});

		volumeSlider.addEventListener("mousedown", function() {
			volumeSlider.addEventListener("mousemove", seekingVolume);
			seekingVolume();
		});
		volumeSlider.addEventListener("mouseup", function() {
			seekingVolume();
			volumeSlider.removeEventListener("mousemove", seekingVolume);
		});
	}, 0);
});

function seeking() {
	audio.currentTime = slider.value;
}

function seekingVolume() {
	audio.volume = volumeSlider.value / 100;
}

function waitForPlaying(obj) {
	if(obj.dataset.state == "playing") {
		slider.max = audio.duration;
		audio.volume = volumeSlider.value / 100;
	}
	else {
		setTimeout(function() { waitForPlaying(obj) }, 200);
	}
}
