// ==UserScript==
// @name YouTube Louder and Playback Speed
// @description Make video louder and control playback speed
// @match https://www.youtube.com/watch*
// @icon https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Logo_of_YouTube_%282015-2017%29.svg/2560px-Logo_of_YouTube_%282015-2017%29.svg.png
// @version 2
// @license MIT

// @namespace https://greasyfork.org/users/803889
// @downloadURL https://update.greasyfork.org/scripts/523599/YouTube%20Louder%20and%20Playback%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/523599/YouTube%20Louder%20and%20Playback%20Speed.meta.js
// ==/UserScript==


function louder() {

	const div = document.getElementById("above-the-fold");
	const divAbove = document.createElement("div");
	divAbove.id = "volumeRocker"
	divAbove.className = "slidecontainer"
	div.parentNode.insertBefore(divAbove, div)

	const para = document.createElement("p")
	para.innerText = 'Volume Doubler: '
	const volSpan = document.createElement("span")
	volSpan.id = 'set-volume'
	para.appendChild(volSpan)
	divAbove.appendChild(para)

	const input = document.createElement("input");
	input.className = "slider"
	input.id = "myRange"
	input.type = "range"
	input.min = "1"
	input.max = "20"
	input.value = "1"
	divAbove.appendChild(input);


	const videoElement = document.querySelector("video")
	const audioCtx = new AudioContext()
	const source = audioCtx.createMediaElementSource(videoElement)
	const gainNode = audioCtx.createGain()
	gainNode.gain.value = 1
	source.connect(gainNode)
	gainNode.connect(audioCtx.destination)

	const slider = document.getElementById("myRange");
	const output = document.getElementById("set-volume");
	output.innerHTML = slider.value + 'x';


	slider.addEventListener("input", function () {
		output.innerHTML = this.value + 'x';
		gainNode.gain.value = this.value;
	});

  const volumeRockerAlignment = document.getElementById('volumeRocker');
  volumeRockerAlignment.style.display = 'inline-block';
  volumeRockerAlignment.style.width = '20%';
}

function playbackSpeed() {
  const div = document.getElementById("above-the-fold");
  const divAbove = document.createElement("div");
  divAbove.id = "speedSlider";
  divAbove.className = "slidecontainer";
  div.parentNode.insertBefore(divAbove, div);

  const para = document.createElement("p");
  para.innerText = "Speed Adjuster: ";
  const volSpan = document.createElement("span");
  volSpan.id = "set-speed";
  para.appendChild(volSpan);
  divAbove.appendChild(para);

  const input = document.createElement("input");
  input.className = "slider";
  input.id = "speedAdjuster";
  input.type = "range";
  input.min = "0";
  input.max = "8";
  input.value = "1";
  input.step = ".1";
  divAbove.appendChild(input);

  video = document.getElementsByTagName("video")[0]

  const slider = document.getElementById("speedAdjuster");
  const output = document.getElementById("set-speed");
  output.innerHTML = slider.value + 'x';

  slider.addEventListener("input", function () {
    output.innerHTML = this.value + 'x';
    video.playbackRate = this.value;
  });

  const speedSliderAlignment = document.getElementById('speedSlider');
  speedSliderAlignment.style.display = 'inline-block';
  speedSliderAlignment.style.width = '20%';
}

let counter = 0
try {
	let interval_documentHidden = setInterval(function checker() {
		if (!document.hidden && document.readyState === 'complete' && (document.querySelector('ytd-watch-metadata') !== null)) {
			if (counter <= 15) {
				louder()
        playbackSpeed()
				clearInterval(interval_documentHidden)
			} else {
				counter++
				if (counter <= 15) {
					console.log('YouTube Louder: --Counter limited reached-- Could not like video or setup observer. Try refreshing the page.?')
					clearInterval(interval_documentHidden)
					return
				}
			}
		}
	}, 2000)
} catch (err) {
	console.log('YouTube Louder: Error occured\n######\n\nerr' + err + '\n\n######')
}