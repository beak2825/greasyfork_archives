// ==UserScript==
// @name        Style Transfer
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     2.1
// @author      Bell
// @license     MIT
// @copyright   2020, Bell
// @description Maps the drawing's colors to the current color palette.
// @downloadURL https://update.greasyfork.org/scripts/406771/Style%20Transfer.user.js
// @updateURL https://update.greasyfork.org/scripts/406771/Style%20Transfer.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

const workerCode = `
	let colorCache = [];
	let palette = [];
	let paletteLab = [];
	let delta00;
	const canvas = {
		width: 800,
		height: 600
	}
	self.onmessage = process;

	function process(e) {
		colorCache = [];
		paletteLab = [];
		let imgData = e.data.imgData;
		let fast = e.data.options.fast;
		let toDither = e.data.options.dither;
		let useWhite = e.data.options.white;
		palette = e.data.palette;
		delta00 = e.data.options.deltaE00;

		let data = imgData.data;

		palette.forEach(rgb => {
			paletteLab.push(rgb2lab(rgb));
		});

		let closestColor;
		for (let y = 0; y < canvas.height; y++) {
			for (let x = 0; x < canvas.width; x++) {
				let i = getIndex(x, y);
				let rgb = data.slice(i, i + 3);
				if (useWhite) {
					if (rgb[0] === 255 && rgb[1] === 255 && rgb[2] === 255) continue;
				}
				closestColor = isCached(rgb) || findClosest(fast, rgb);
				setPixel(data, closestColor, i);
				if (toDither)
					dither(data, rgb, closestColor, x, y);
			}
		}

		postMessage(imgData);
	}

	function dither(data, rgb, closestColor, x, y) {
		let quantError = getQuantError(rgb, closestColor);

		i = getIndex(x + 1, y);
		rgb = data.slice(i, i + 3);
		setPixel(data, getQuantColor(rgb, quantError, 7/16), i);

		i = getIndex(x - 1, y + 1);
		rgb = data.slice(i, i + 3);
		setPixel(data, getQuantColor(rgb, quantError, 3/16), i);

		i = getIndex(x, y + 1);
		rgb = data.slice(i, i + 3);
		setPixel(data, getQuantColor(rgb, quantError, 5/16), i);

		i = getIndex(x + 1, y + 1);
		rgb = data.slice(i, i + 3);
		setPixel(data, getQuantColor(rgb, quantError, 1/16), i);
	}

	function getQuantError(oldColor, newColor) {
		return [
			oldColor[0] - newColor[0],
			oldColor[1] - newColor[1],
			oldColor[2] - newColor[2]
		];
	}

	function getQuantColor(color, error, scale) {
		return [
			color[0] + error[0] * scale,
			color[1] + error[1] * scale,
			color[2] + error[2] * scale
		];
	}

	function setPixel(data, newPixel, index) {
		data[index] = newPixel[0];
		data[index + 1] = newPixel[1];
		data[index + 2] = newPixel[2];
	}

	function rgbValue(data, x, y, c) {
		return data[((y * (4 * canvas.width)) + (4 * x)) + c];
	}

	function getIndex(x, y) {
		return ((y * (4 * canvas.width)) + (4 * x));
	}

	function findClosest(fast, rgb) {
		let closestIndex = fast ? findClosestFast(rgb) : findClosestSlow(rgb);
		cacheColor(rgb, closestIndex);
		return palette[closestIndex];
	}

	function findClosestFast(rgb) {
		let closest = {};
		palette.forEach((color, index) => {
			let distance = ((color[0] - rgb[0]) * 0.30) ** 2 + 
						   ((color[1] - rgb[1]) * 0.59) ** 2+ 
						   ((color[2] - rgb[2]) * 0.11) ** 2;
			if (index === 0 || distance < closest.dist) {
				closest = {
					dist: distance,
					idx: index
				};
			}
		});
		return closest.idx;
	}

	function findClosestSlow(rgb) {
		let closest = {};
		let labColor = rgb2lab(rgb);
		paletteLab.forEach((color, index) => {
			let distance = delta00 ? deltaE00(labColor, color) : 
									 deltaE(labColor, color);
			if (index === 0 || distance < closest.dist) {
				closest = {
					dist: distance,
					idx: index
				};
			}
		});
		return closest.idx;
	}

	function cacheColor(rgb, index) {
		if (colorCache.length > 127) return;
		colorCache.push({
			idx: index,
			color: rgb
		});
	}

	function isCached(rgb) {
		for (let cached of colorCache) {
			if (cached.color[0] === rgb[0] && cached.color[1] === rgb[1] &&
				cached.color[2] === rgb[2]) {
				return palette[cached.idx];
			}
		}
		return false;
	}

	function deltaE(labA, labB) {
		let deltaL = labA[0] - labB[0];
		let deltaA = labA[1] - labB[1];
		let deltaB = labA[2] - labB[2];

		let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
		let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);

		let deltaC = c1 - c2;
		let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
		deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);

		let sc = 1.0 + 0.045 * c1;
		let sh = 1.0 + 0.015 * c1;

		let deltaLKlsl = deltaL / (1.0);
		let deltaCkcsc = deltaC / (sc);
		let deltaHkhsh = deltaH / (sh);

		let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
		return i < 0 ? 0 : Math.sqrt(i);
	}

	function rgb2lab(rgb) {
		let r = rgb[0] / 255,
			g = rgb[1] / 255,
			b = rgb[2] / 255,
			x, y, z;

		r = (r > 0.04045) ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
		g = (g > 0.04045) ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
		b = (b > 0.04045) ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;

		x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
		y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
		z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

		x = (x > 0.008856) ? x ** (1 / 3) : (7.787 * x) + 16 / 116;
		y = (y > 0.008856) ? y ** (1 / 3) : (7.787 * y) + 16 / 116;
		z = (z > 0.008856) ? z ** (1 / 3) : (7.787 * z) + 16 / 116;

		return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)];
	}

	function deltaE00(labA, labB) {
		const [l1, a1, b1] = labA;
		const [l2, a2, b2] = labB;

		Math.rad2deg = function(rad) {
			return 360 * rad / (2 * Math.PI);
		};
		Math.deg2rad = function(deg) {
			return (2 * Math.PI * deg) / 360;
		};

		const avgL = (l1 + l2) / 2;
		const C1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
		const C2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));
		const avgC = (C1 + C2) / 2;
		const G = (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7)))) / 2;

		const A1p = a1 * (1 + G);
		const A2p = a2 * (1 + G);

		const C1p = Math.sqrt(Math.pow(A1p, 2) + Math.pow(b1, 2));
		const C2p = Math.sqrt(Math.pow(A2p, 2) + Math.pow(b2, 2));

		const avgCp = (C1p + C2p) / 2;

		let h1p = Math.rad2deg(Math.atan2(b1, A1p));
		if (h1p < 0) {
			h1p = h1p + 360;
		}

		let h2p = Math.rad2deg(Math.atan2(b2, A2p));
		if (h2p < 0) {
			h2p = h2p + 360;
		}

		const avghp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h1p) / 2;

		const T = 1 - 0.17 * Math.cos(Math.deg2rad(avghp - 30)) + 0.24 * Math.cos(Math.deg2rad(2 * avghp)) + 0.32 * Math.cos(Math.deg2rad(3 * avghp + 6)) - 0.2 * Math.cos(Math.deg2rad(4 * avghp - 63));

		let deltahp = h2p - h1p;
		if (Math.abs(deltahp) > 180) {
			if (h2p <= h1p) {
				deltahp += 360;
			} else {
				deltahp -= 360;
			}
		}

		const delta_lp = l2 - l1;
		const delta_cp = C2p - C1p;

		deltahp = 2 * Math.sqrt(C1p * C2p) * Math.sin(Math.deg2rad(deltahp) / 2);

		const Sl = 1 + ((0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2)));
		const Sc = 1 + 0.045 * avgCp;
		const Sh = 1 + 0.015 * avgCp * T;

		const deltaro = 30 * Math.exp(-(Math.pow((avghp - 275) / 25, 2)));
		const Rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
		const Rt = -Rc * Math.sin(2 * Math.deg2rad(deltaro));

		const kl = 1;
		const kc = 1;
		const kh = 1;

		const deltaE = Math.sqrt(Math.pow(delta_lp / (kl * Sl), 2) + Math.pow(delta_cp / (kc * Sc), 2) + Math.pow(deltahp / (kh * Sh), 2) + Rt * (delta_cp / (kc * Sc)) * (deltahp / (kh * Sh)));

		return deltaE;
	}
`;

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const colorButtons = document.querySelectorAll('.gameToolsColor');
const interfaceBar = document.querySelector('#gameInterface');

const container = document.createElement('div');
const fastButton = document.createElement('button');
const slowButton = document.createElement('button');
const ditherText = document.createElement('label');
const ditherCheckbox = document.createElement('input');
const whiteText = document.createElement('label');
const whiteCheckbox = document.createElement('input');
const deltaE00Text = document.createElement('label');
const deltaE00Checkbox = document.createElement('input');
const spinner = document.createElement('img');

let palette = [];
const dataWorker = createWorker(workerCode);

(function init() {
	canvas.save = () => {
		canvas.dispatchEvent(new MouseEvent('pointerup', {
			bubbles: true,
			clientX: 0,
			clientY: 0,
			button: 0
		}));
	};

	initInterface();
	initListeners();
})();

function createWorker(content) {
	const workerBlob = new Blob([content], {
		'type': 'text/javascript'
	});

	const blobURL = window.URL.createObjectURL(workerBlob);

	return new Worker(blobURL);
}

function initListeners() {
	dataWorker.onmessage = (e) => {
		spinner.remove();
		canvas.style.filter = '';
		ctx.putImageData(e.data, 0, 0);
		canvas.save();
	};

	fastButton.onpointerdown = () => {
		transformColor(true);
	};
	slowButton.onpointerdown = () => {
		transformColor(false);
	};
}

function transformColor(fast) {
	getPalette();
	const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	const options = {
		fast: fast,
		dither: ditherCheckbox.checked,
		white: whiteCheckbox.checked,
		deltaE00: deltaE00Checkbox.checked
	};
	canvas.style.filter = 'brightness(0.5)';
	canvas.parentElement.insertBefore(spinner, canvas);
	dataWorker.postMessage({ imgData: imgData, palette: palette, options: options });
}

function getPalette() {
	palette = whiteCheckbox.checked ? [[255, 255, 255]] : [];
	paletteLab = [];
	colorCache = [];
	colorButtons.forEach(color => {
		if (color.style.background === 'rgb(255, 255, 255)') return;
		palette.push(color.style.background.substring(4, color.style.background.length - 1)
			.replace(/ /g, '').split(',').map(x => parseInt(x)));
	});
}

function canvasVisibility() {
	if (isFreeDraw()) container.style.display = '';
	else container.style.display = 'none';
}

const canvasObserver = new MutationObserver(canvasVisibility);

canvasObserver.observe(document.querySelector('body > div.game'), {
	attributes: true
});
canvasObserver.observe(canvas, {
	attributes: true
});

function isFreeDraw() {
	return canvas.style.display !== 'none' &&
        document.querySelector('#gameClock').style.display === 'none' &&
        document.querySelector('#gameSettings').style.display === 'none';
}

function initInterface() {
	container.style.margin = 'auto';
	container.style.color = '#737373';
	container.style.userSelect = 'none';
	container.style.padding = '9px';

	fastButton.setAttribute('class', 'btn btn-sm btn-primary');
	fastButton.style.marginRight = '5px';

	slowButton.setAttribute('class', 'btn btn-sm btn-primary');
	slowButton.style.marginRight = '5px';

	ditherCheckbox.type = 'checkbox';
	ditherCheckbox.style.marginRight = '5px';
	ditherCheckbox.id = 'dither';
	ditherCheckbox.name = 'dither';
	ditherText.textContent = 'spatter';
	ditherText.style.marginRight = '5px';
	ditherText.setAttribute('for', 'dither');

	whiteCheckbox.type = 'checkbox';
	whiteCheckbox.style.marginRight = '5px';
	whiteCheckbox.id = 'white';
	whiteCheckbox.name = 'white';
	whiteText.textContent = 'white';
	whiteText.style.marginRight = '5px';
	whiteText.setAttribute('for', 'white');

	deltaE00Checkbox.type = 'checkbox';
	deltaE00Checkbox.style.marginRight = '5px';
	deltaE00Checkbox.id = 'deltaE00';
	deltaE00Checkbox.name = 'deltaE00';
	deltaE00Text.textContent = 'deltaE00';
	deltaE00Text.style.marginRight = '5px';
	deltaE00Text.setAttribute('for', 'deltaE00');

	fastButton.textContent = 'FAST';
	slowButton.textContent = 'ACCURATE';

	spinner.style.position = 'absolute';
	spinner.style.width = '100px';
	spinner.style.zIndex = '1';
	spinner.src = '/res/svg/spinner.svg';

	container.append(fastButton, slowButton, ditherCheckbox, ditherText,
		whiteCheckbox, whiteText);
	interfaceBar.appendChild(container);
}