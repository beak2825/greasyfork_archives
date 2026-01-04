// ==UserScript==
// @name         Drednot Video Player
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  Only works with dropbox and wikimedia links (any site that allows anonymous crossorigin). Kind of shitty as of right now.
// @author       You
// @match        https://test.drednot.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drednot.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448278/Drednot%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/448278/Drednot%20Video%20Player.meta.js
// ==/UserScript==

(function() {
var vidurl = "https://dl.dropbox.com/s/5k69wjzvblaqs44/ezgif.com-gif-maker%20%282%29.mp4"
let framerate = 20
let dithering1 = false
let monospace1 = true
let bottombar = document.getElementById("motd-content");
bottombar.innerHTML += `<textarea id="text" style="z-index:-1" readonly ></textarea>
	<div id="options">
		<div ><a href="https://github.com/505e06b2/Image-to-Braille" target="_blank" hidden>Open Repo</a></div>
		<div ><input id="file" type="file" hidden accept="image/*"></div>

		<div title="Toggle dark theme" ><input type="checkbox" id="darktheme" > Dark Theme</div>
		<div title="Invert black with white" ><input type="checkbox" id="inverted"> Invert</div>
		<div title="Monochrome dithering" ><input type="checkbox" id="dithering"> Dithering</div>
		<div title="Disable placeholder spacing" ><input type="checkbox" id="monospace"> Monospace</div>
		<div title="Greyscale Mode" >
			<select id="greyscale_mode">
				<option value="luminance">Luminance</option>
				<option value="lightness">Lightness</option>
				<option value="average">Average</option>
				<option value="value">Value</option>
			</select>
		</div>
		<div >
			<input type="number" min="2" value="50" step="2" max="500" id="width">
			Width (characters)
		</div>
		<div >
			<button id="clipboard">Copy to clipboard</button>
		</div>
		<div >
			Character Count: <span id="charcount">0</span>
		</div>
	</div>
  <div id="theater">
  <video id="video" src=${vidurl} controls="false" crossOrigin="" width=25 height=25></video>
  <canvas id="canvas1" hidden></canvas>
  <button onclick="video.pause();video.currentTime = 0;video.load();video.play();" class="btn-yellow btn-small last-left"><i class="heeheeheehaw"></i> Restart</button>
<button onclick="video.pause();let a = prompt('Raw video link:');video.src = a;video.currentTime = 0;video.load();video.play();" class ="btn-blue btn-small last-left"><i class="heeheeheehaw"></i> Change video</button>
  <label>
    <br />Dithering code from 505e06b2.github.io. Put together by ibuildcomputers</label>
  <br />
</div>`;

function createImageCanvas(src) {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement("CANVAS");
		const image = new Image();

		image.onload = () => {
			let width = image.width;
			let height = image.height;
			if(image.width != (settings.width * 2)) {
				width = settings.width * 2;
				height = width * image.height / image.width;
			}

			//nearest multiple
			canvas.width = width - (width % 2);
			canvas.height = height - (height % 4);

			ctx = canvas.getContext("2d");
			ctx.fillStyle = "#FFFFFF"; //get rid of alpha
			ctx.fillRect(0,0, canvas.width,canvas.height);

			ctx.mozImageSmoothingEnabled = false;
			ctx.webkitImageSmoothingEnabled = false;
			ctx.msImageSmoothingEnabled = false;
			ctx.imageSmoothingEnabled = false;

			ctx.drawImage(image, 0,0, canvas.width,canvas.height);
			resolve(canvas);
		};

		image.src = src;
	});
}

function pixelsToCharacter(pixels_lo_hi) { //expects an array of 8 bools
	//Codepoint reference - https://www.ssec.wisc.edu/~tomw/java/unicode.html#x2800
	const shift_values = [0, 1, 2, 6, 3, 4, 5, 7]; //correspond to dots in braille chars compared to the given array
	let codepoint_offset = 0;
	for(const i in pixels_lo_hi) {
		codepoint_offset += (+pixels_lo_hi[i]) << shift_values[i];
	}

	if(codepoint_offset === 0 && settings.monospace === false) { //pixels were all blank
		codepoint_offset = 4; //0x2800 is a blank braille char, 0x2804 is a single dot
	}
    return String.fromCharCode(0x2800 + codepoint_offset);
}

function toGreyscale(r, g, b) {
	switch(settings.greyscale_mode) {
		case "luminance":
			return (0.22 * r) + (0.72 * g) + (0.06 * b);

		case "lightness":
			return (Math.max(r,g,b) + Math.min(r,g,b)) / 2;

		case "average":
			return (r + g + b) / 3;

		case "value":
			return Math.max(r,g,b);

		default:
			console.error("Greyscale mode is not valid");
			return 0;
	}
}

function canvasToText(canvas) {
	const ctx = canvas.getContext("2d");
	const width = canvas.width;
	const height = canvas.height;

	let image_data = [];
	if(settings.dithering) {
		if(settings.last_dithering === null || settings.last_dithering.canvas !== canvas) {
			settings.last_dithering = new Dithering(canvas);
		}
		image_data = settings.last_dithering.image_data;
	} else {
		image_data = new Uint8Array(ctx.getImageData(0,0,width,height).data.buffer);
	}

	let output = "";

	for(let imgy = 0; imgy < height; imgy += 4) {
		for(let imgx = 0; imgx < width; imgx += 2) {
			const braille_info = [0,0,0,0,0,0,0,0];
			let dot_index = 0;
			for(let x = 0; x < 2; x++) {
				for(let y = 0; y < 4; y++) {
					const index = (imgx+x + width * (imgy+y)) * 4;
					const pixel_data = image_data.slice(index, index+4); //ctx.getImageData(imgx+x,imgy+y,1,1).data
					if(pixel_data[3] >= 128) { //account for alpha
						const grey = toGreyscale(pixel_data[0], pixel_data[1], pixel_data[2]);
						if(settings.inverted) {
							if(grey >= 128) braille_info[dot_index] = 1;
						} else {
							if(grey <= 128) braille_info[dot_index] = 1;
						}
					}
					dot_index++;
				}
			}
			output += pixelsToCharacter(braille_info);
		}
		output += "\n";
	}

	return output;
}
// Credit to https://gist.github.com/PhearTheCeal/6443667 for the algorithm
// adding change framerate?
//trying to however it cannot access the variable stated in js as this is basically just something running in the console
function Dithering(canvas) {
	this.canvas = canvas;
	this.image_data = new Uint8Array(canvas.getContext("2d").getImageData(0,0, canvas.width, canvas.height).data); //clone

	let oldpixel;
	let newpixel;
	let quant_error;
	let err_red, err_green, err_blue;

	const _getPixel = (x, y) => {
		const index = (x + y * canvas.width) * 4;
		return [ this.image_data[index+0], this.image_data[index+1], this.image_data[index+2] ];
	};

	const _setPixel = (x, y, colour) => {
		const index = (x + y * canvas.width) * 4;
		this.image_data[index+0] = Math.floor(colour[0]+0.5);
		this.image_data[index+1] = Math.floor(colour[1]+0.5);
		this.image_data[index+2] = Math.floor(colour[2]+0.5);
		this.image_data[index+3] = 255;
	}

	const _closestPalleteColour = (pixel) => {
		return (0.2126*pixel[0] + 0.7152*pixel[1] + 0.0722*pixel[2]) > 128 ? [255,255,255] : [0,0,0];
	};

	const _colourDifference = (one, two) => {
		return [(one[0] - two[0]), (one[1] - two[1]), (one[2] - two[2])];
	};

	const _colourAddError = (x, y, err_red, err_green, err_blue) => {
		const clip = (x) => (x < 0 ? 0 : (x > 255 ? 255 : x));
		const index = (x + y * canvas.width) * 4;
		this.image_data[index+0] = clip(this.image_data[index+0] + err_red);
		this.image_data[index+1] = clip(this.image_data[index+1] + err_green);
		this.image_data[index+2] = clip(this.image_data[index+2] + err_blue);
		this.image_data[index+3] = 255;
	};

	for(let y = 0; y < canvas.height; y++) {
		for(let x = 0; x < canvas.width; x++) {
			oldpixel = _getPixel(x, y);
			newpixel = _closestPalleteColour(oldpixel);
			_setPixel(x, y, newpixel);
			quant_error = _colourDifference(oldpixel, newpixel);

			err_red = quant_error[0];
			err_green = quant_error[1];
			err_blue = quant_error[2];

			if(x+1 < canvas.width)             _colourAddError(x+1, y,   (7/16) * err_red, (7/16) * err_green, (7/16) * err_blue);
			if(x-1 > 0 && y+1 < canvas.height) _colourAddError(x-1, y+1, (3/16) * err_red, (3/16) * err_green, (3/16) * err_blue);
			if(y+1 < canvas.height)            _colourAddError(x,   y+1, (5/16) * err_red, (5/16) * err_green, (5/16) * err_blue);
			if(x+1 < canvas.width)             _colourAddError(x+1, y+1, (1/16) * err_red, (1/16) * err_green, (1/16) * err_blue);
		}
	}
}
const settings = {
	last_canvas: null,
	last_dithering: null,
	last_source: "",

	width: 35,
	greyscale_mode: "luminance",
	inverted: true,
	dithering: dithering1,
	monospace: monospace1
};

function setUIElement(selector, value) {
	const elem = document.querySelector(selector);
	switch(elem.getAttribute("type")) { //should all be <input>
		case "checkbox":
			elem.checked = value;
			break;

		default:
			elem.value = value;
	}
	return elem;
}

function initUI() {
	document.body.ondragover = (e) => e.preventDefault();
	document.body.ondrop = (e) => {
		e.preventDefault();
		loadNewImage(URL.createObjectURL(e.dataTransfer.items[0].getAsFile()));
	};
		event.preventDefault();	loadNewImage(URL.createObjectURL(e.clipboardData.items[0].getAsFile()));
	};

	//buttons
	const r = () => parseCanvas(settings.last_canvas); //shorten for compactness

	document.querySelector('input[type="file"]').onchange = (e) => {
		 loadNewImage(URL.createObjectURL(e.target.files[0]));
	};

	setUIElement('#darktheme', settings.inverted).onchange = (e) => {
		const element = document.querySelector('#text');
		if(e.target.checked) element.classList.add("dark");
		else element.classList.remove("dark");
	};

	setUIElement('#inverted', settings.inverted).onchange = (e) => {settings.inverted = e.target.checked; r();};
	setUIElement('#dithering', settings.dithering).onchange = (e) => {settings.dithering = e.target.checked; r();};
	setUIElement('#monospace', settings.monospace).onchange = (e) => {settings.monospace = e.target.checked; r();};

	document.querySelector('#greyscale_mode').onchange = (e) => {
		settings.greyscale_mode = e.target.value;
		parseCanvas(settings.last_canvas);
	};

	setUIElement('#width', settings.width).onchange = (e) => {
		settings.width = e.target.value;
		loadNewImage(settings.last_source);
	};

	document.querySelector('#clipboard').onclick = (e) => {
		 document.querySelector('#text').select();
		 document.execCommand("copy");
	}


async function loadNewImage(src) {
	if(src === undefined) return;

	if(settings.last_source && settings.last_source !== src) URL.revokeObjectURL(settings.last_source);

	settings.last_source = src;
	const canvas = await createImageCanvas(src);
	settings.last_canvas = canvas;
	settings.last_dithering = null;
	await parseCanvas(canvas);
}

async function parseCanvas(canvas) {
	const text = canvasToText(canvas);
	document.querySelector('#text').value = text;
  let btn = document.getElementById("motd-edit-button");
  let box = document.getElementById("motd-edit-text");
  btn.click;
  box.value = text;
  saveMotd(true);
	document.querySelector('#charcount').innerText = text.length;
}

window.onload = () => {
	initUI();
	loadNewImage("select.png");
}

var canvas1 = document.getElementById('canvas1');
var ctx1 = canvas1.getContext('2d');
var video = document.getElementById('video');

// set canvas size = video size when known
video.addEventListener('loadedmetadata', function() {
  canvas1.width = video.videoWidth;
  canvas1.height = video.videoHeight;
  video.play();
  video.style.zIndex = 2147483647;
});

video.addEventListener('play', function() {
  var $this = this; //cache
  (function loop() {
    if (!$this.paused && !$this.ended) {
      ctx1.drawImage($this, 0, 0);
      loadNewImage(canvas1.toDataURL());
      setTimeout(loop, 1000 / framerate);
    }
  })();
}, 0);
})();

//hello
