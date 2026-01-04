// ==UserScript==
// @name         Eroscript Enhancements
// @namespace    http://discuss.eroscripts.com/
// @version      2025.05.18.3
// @description  Make Eroscripts look better!
// @author       Dimava
// @match        https://discuss.eroscripts.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eroscripts.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536397/Eroscript%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/536397/Eroscript%20Enhancements.meta.js
// ==/UserScript==

(function() {



    const jsonStorage = new Proxy(localStorage, {
	set: (_, k, v) => (localStorage.setItem(k, JSON.stringify(v)), true),
	get: (_, k) => {
		if (k == 'getItem')
			return (key, def) => {
				let v = localStorage.getItem(k);
				if (v === null) return def;
				return JSON.parse(v);
			};
		return JSON.parse(localStorage.getItem(k) ?? 'null');
	},
	deleteProperty: (_, k) =>
		localStorage.getItem(k) === null
			? false
			: (localStorage.removeItem(k), true),
});

const styleGenerators = {};

function applyStyleGenerators() {
	const style =
		document.querySelector('style#applyDoneStyle') ??
		document.createElement('style');
	style.id = 'applyDoneStyle';
	document.head.append(style);
	style.innerHTML = Object.entries(styleGenerators)
		.map(([k, v]) => `/* styleGenerators.${k} */\n\n${v()}`)
		.join('\n\n\n\n\n');
}
setTimeout(applyStyleGenerators);
addEventListener('visibilitychange', () => applyStyleGenerators());

styleGenerators.doneList = () => {
	const list = jsonStorage.doneList ?? [];

	return `
        ${list.map((e) => `a.fancy-title[href$="/${e}"]::before`).join(',\n')} {
            content: "✅";
        }
        ${list.map((e) => `a.fancy-title[href$="/${e}"]`).join(',\n')} {
            background: #59fc595c;
        }

        ${list.map((e) => `article[data-topic-id="${e}"]#post_1`).join(',\n')} {
            background: #59fc595c;
        }
        ${list.map((e) => `tr[data-topic-id="${e}"]`).join(',\n')} {
            background: #59fc595c;
        }
        ${list.map((e) => `a.topic-link[data-topic-id="${e}"]`).join(',\n')} {
            background: #59fc595c;
        }
    `;
};

function addToDone() {
	const num = location.pathname.match(/^\/t\/[\w-]+\/(?<num>\d+)(\/|$)/).groups
		.num;
	const list = jsonStorage.doneList ?? [];
	if (!list.includes(num)) list.push(num);
	jsonStorage.doneList = list;
}

function removeFromDone() {
	const num = location.pathname.match(/^\/t\/[\w-]+\/(?<num>\d+)(\/|$)/).groups
		.num;
	let list = jsonStorage.doneList ?? [];
	list = list.filter((e) => e != num);
	jsonStorage.doneList = list;
}

const kds = {};
addEventListener('keydown', (e) => {
	const code = `${e.ctrlKey ? 'Ctrl' : ''}${e.shiftKey ? 'Shift' : ''}${e.altKey ? 'Alt' : ''}${e.code}`;
	if (kds[code]) {
		e.preventDefault();
		kds[code]();
	}
});

kds.AltKeyO = () => {
	addToDone();
	applyDoneStyle();
};
kds.ShiftAltKeyO = () => {
	removeFromDone();
	applyDoneStyle();
};

styleGenerators.zoomedAuthor = () => `
	.topic-users > .inline > a:first-child {
	    position: absolute;
	    left: 15px;
	    transform: scale(2);
	    bottom: 0;
	}
	.topic-footer {
	    position: relative;
	}
	.topic-meta {
	    margin-left: 44px;
	}
	.posters a:first-child {
	    zoom: 2;
	}
`;

styleGenerators.tagEmoji = () => {
	const mapping = {
		vr: ['🥽', 20],
		'non-vr': ['👀', 20],
		'len-0-2': ['🕐 0-2', 40],
		'len-2-5': ['🕒 2-5', 40],
		'len-5-10': ['🕔 5-10', 40],
		'len-10-25': ['🕖 10-25', 40],
		'len-25-60': ['🕘 25-60', 40],
		'len-60-plus': ['🕛 60+', 40],
		'len-multiple': ['🕞📚', 40],

		'real': ['🎥', 30],
		'animation': ['🎨', 30],
		'jav': ['👘', 31],
		'jav-vr': ['👘', 31],
		'pmv': ['🎼', 32],
		'hmv': ['🎼', 32]
	};
	let keys = Object.keys(mapping)
	return `

  /* Common styles for all custom tag replacements */
	a.discourse-tag { order: 100 }
	${ keys.map(k => `a.discourse-tag.box[data-tag-name="${k}"]`) } {
	  font-size: 0;
	  position: relative;
	  max-width: unset;
	  margin-right: 0.25rem !important;
	  padding-left: 0;
	  padding-right: 0;
	}
	a.discourse-tag.box[data-tag-name^="len-"] {
	  padding-right: 4px;
	}

	/* Common styles for all ::after pseudo-elements */
	${ keys.map(k => `a.discourse-tag.box[data-tag-name="${k}"]::after`) } {
	  font-size: 14px;
	}

	/* Per-element styles */
	${
		keys.map(k => `
			a.discourse-tag.box[data-tag-name="${k}"] {
			  order: ${ mapping[k][1] };
			}
			a.discourse-tag.box[data-tag-name="${k}"]::after {
			  content: "${ mapping[k][0] }";
			}
		`).join('')
	}
  `;
};

styleGenerators.links = () => {
  const domains = [
      'pixeldrain.com',
      'mega.nz',
      'rule34video.com'
  ]
  return `
	a[href^="https"]:not(.lightbox)::before {
	    display: inline-block;
	    content: "";
	    width: 1em;
	    height: 1em;
	    vertical-align: text-top;
	    margin-right: 0.2em;
	    background-image: url("https://www.google.com/s2/favicons?domain=example.com");
	}
    ${
        domains.map(d => `
    	    a[href^="https://${ d }"]::before {
                background-image: url("https://www.google.com/s2/favicons?domain=${ d }");
            }
        `).join('\n')
    }
    `
}





window.require('discourse/lib/plugin-api').withPluginApi((api) => {
	console.log('[heatmaps enabled]');

	api.decorateCookedElement(async (cookedElement) => {
		console.log(cookedElement);
		decorateCookedWithHeatmap(cookedElement);
	});
});

requestAnimationFrame(() => {
	document.querySelectorAll('.cooked').forEach(decorateCookedWithHeatmap)
})

async function decorateCookedWithHeatmap(cookedElement) {
	let aa = Array.from(cookedElement.querySelectorAll('a[href$=".funscript"]'));

	await Promise.all(
		aa.map(async (a) => {
			if (a.classList.contains('attachment')) a.classList.remove('attachment');

			let spanAContainer = document.createElement('a');
			spanAContainer.setAttribute('href', a.getAttribute('href'))
			spanAContainer.className = 'funscript-link-container';
			spanAContainer.style = 'display: block; line-height: 80%'
			a.replaceWith(spanAContainer);
			spanAContainer.append(a);

			if (spanAContainer.nextSibling.nodeType == 3) {
				spanAContainer.append(spanAContainer.nextSibling);
			}

			const img = document.createElement('img');
			img.style.willChange = 'opacity'; // improve draw perf
			spanAContainer.prepend(img);

			const svgUrl = await generateSvgBlobUrl(a.href);
			img.src = svgUrl;

			await img.decode()
			await new Promise(requestAnimationFrame)

			let targetWidth = spanAContainer.getBoundingClientRect().width
			if (targetWidth > 700) {
				img.src = await generateSvgBlobUrl(a.href, ~~targetWidth);
			}
			console.log(targetWidth)

		})
	);
	if (aa.length) {
		window.ff = await Promise.all([...cookedElement.querySelectorAll('.funscript-link-container a')].map(a => fetchFunscript(a.href)))
	}
}

const CACHE_INFO_VERSION = 1;
const CACHE_CLEAN_DAYS = 1;

async function cleanStorage() {
	const cache = await window.caches.open('funscript-cache');
	let cacheInfo = localStorage.getItem('funscript-cache-info')
	cacheInfo = cacheInfo ? JSON.parse(cacheInfo) : {
		version: CACHE_INFO_VERSION, scripts: {}
	}
	if (cacheInfo.version !== CACHE_INFO_VERSION) {
		cacheInfo = { version: CACHE_INFO_VERSION, scripts: {} };
		window.caches.delete('funscript-cache');
	}
	for (const [url, script] of Object.entries(cacheInfo.scripts)) {
		const age = (Date.now() - script.scriptCachedAt) / 24 / 3600e3;
		if (age > CACHE_CLEAN_DAYS) {
			console.log('removing', script, 'due to age', age);
			cache.delete(url);
			cache.delete(url + '.svg');
			delete cacheInfo.scripts[url];
		}
	}
	localStorage.setItem('funscript-cache-info', JSON.stringify(cacheInfo));
}
cleanStorage();

async function fetchFunscript(url) {
	const cache = await window.caches.open('funscript-cache');
	const cachedResponse = await cache.match(url);
	let response = cachedResponse;
	if (!response) {
		response = await fetch(url);
	}
	if (!response.ok) {
		throw new Error(`Failed to fetch funscript: ${response.statusText}`);
	}
	let filePath = response.headers
		.get('Content-Disposition')
		?.match(/filename\*=UTF-8''([^]+.funscript)$/)?.[1];
	if (!filePath) {
		throw new Error('No file path found');
	}
	filePath = decodeURIComponent(filePath);
	if (!cachedResponse) {
		const cacheInfo = JSON.parse(
			localStorage.getItem('funscript-cache-info') || '{}'
		);
		cacheInfo.version ??= CACHE_INFO_VERSION;
		let scripts = (cacheInfo.scripts ??= {});
		scripts[url] = {
			...scripts[url],
			url,
			filePath,
			scriptCachedAt: Date.now(),
		};
		cacheInfo.version = CACHE_INFO_VERSION;
		localStorage.setItem('funscript-cache-info', JSON.stringify(cacheInfo));

		await cache.put(url, response.clone());
	}
	const json = await response.json();
	return new Fun.Funscript(json, { file: decodeURIComponent(filePath) });
}

async function generateSvgBlobUrl(url, width = 690) {
	console.time('readCache ' + url);
	const cache = await window.caches.open('funscript-cache');
	const svgUrl = url + '.svg'
	   + (width === 690 ? '' : '?width=' + width);
	const cachedResponse = await cache.match(svgUrl);
	console.timeEnd('readCache ' + url);
	if (cachedResponse) {
		return URL.createObjectURL(await cachedResponse.blob());
	}

	console.time('fetchFunscript ' + url);
	const funscript = await fetchFunscript(url);
	console.timeEnd('fetchFunscript ' + url);
	console.time('toSvgElement ' + svgUrl);
	// debugger
	const svg = funscript.toSvgElement({width});
	console.timeEnd('toSvgElement ' + svgUrl);
	const blob = new Blob([svg], { type: 'image/svg+xml' });

	const cacheInfo = JSON.parse(
		localStorage.getItem('funscript-cache-info') || '{}'
	);
	cacheInfo.version ??= CACHE_INFO_VERSION;
	let scripts = (cacheInfo.scripts ??= {});
	scripts[url] = {
		...scripts[url],
		url,
		svgCachedAt: Date.now(),
	};
	cacheInfo.version = CACHE_INFO_VERSION;
	localStorage.setItem('funscript-cache-info', JSON.stringify(cacheInfo));

	await cache.put(svgUrl, new Response(blob));
	return URL.createObjectURL(blob);
}






    (() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {
        get: all[name],
        enumerable: true,
        configurable: true,
        set: (newValue) => all[name] = () => newValue
      });
  };

  // src/index.ts
  var exports_src = {};
  __export(exports_src, {
    speedToOklch: () => speedToOklch,
    handySmooth: () => handySmooth,
    FunscriptFile: () => FunscriptFile,
    Funscript: () => Funscript,
    FunMetadata: () => FunMetadata,
    FunChapter: () => FunChapter,
    FunBookmark: () => FunBookmark,
    FunAction: () => FunAction,
    AxisScript: () => AxisScript
  });

  // node_modules/colorizr/dist/index.mjs
  var __defProp2 = Object.defineProperty;
  var __export2 = (target, all) => {
    for (var name2 in all)
      __defProp2(target, name2, { get: all[name2], enumerable: true });
  };
  function invariant(condition, message) {
    if (condition) {
      return;
    }
    if (true) {
      if (message === undefined) {
        throw new Error("invariant requires an error message argument");
      }
    }
    const error = !message ? new Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.") : new Error(message);
    error.name = "colorizr";
    throw error;
  }
  var COLOR_KEYS = {
    hsl: ["h", "s", "l"],
    oklab: ["l", "a", "b"],
    oklch: ["l", "c", "h"],
    rgb: ["r", "g", "b"]
  };
  var COLOR_MODELS = ["hsl", "oklab", "oklch", "rgb"];
  var DEG2RAD = Math.PI / 180;
  var LAB_TO_LMS = {
    l: [0.3963377773761749, 0.2158037573099136],
    m: [-0.1055613458156586, -0.0638541728258133],
    s: [-0.0894841775298119, -1.2914855480194092]
  };
  var LRGB_TO_LMS = {
    l: [0.4122214708, 0.5363325363, 0.0514459929],
    m: [0.2119034982, 0.6806995451, 0.1073969566],
    s: [0.0883024619, 0.2817188376, 0.6299787005]
  };
  var LSM_TO_LAB = {
    l: [0.2104542553, 0.793617785, 0.0040720468],
    a: [1.9779984951, 2.428592205, 0.4505937099],
    b: [0.0259040371, 0.7827717662, 0.808675766]
  };
  var LSM_TO_RGB = {
    r: [4.076741636075958, -3.307711539258063, 0.2309699031821043],
    g: [-1.2684379732850315, 2.609757349287688, -0.341319376002657],
    b: [-0.0041960761386756, -0.7034186179359362, 1.7076146940746117]
  };
  var PRECISION = 5;
  var RAD2DEG = 180 / Math.PI;
  var MESSAGES = {
    alpha: "amount must be a number between 0 and 1",
    hueRange: "hue must be a number between 0 and 360",
    input: "input is required",
    inputHex: "input is required and must be a hex",
    inputNumber: "input is required and must be a number",
    inputString: "input is required and must be a string",
    invalid: "invalid input",
    invalidCSS: "invalid CSS string",
    left: "left is required and must be a string",
    lightnessRange: "lightness must be a number between 0 and 1",
    options: "invalid options",
    right: "right is required and must be a string",
    threshold: "threshold must be a number between 0 and 255"
  };
  function isNumber(input) {
    return typeof input === "number" && !Number.isNaN(input);
  }
  function isPlainObject(input) {
    if (!input) {
      return false;
    }
    const { toString } = Object.prototype;
    const prototype = Object.getPrototypeOf(input);
    return toString.call(input) === "[object Object]" && (prototype === null || prototype === Object.getPrototypeOf({}));
  }
  function isString(input, validate = true) {
    const isValid = typeof input === "string";
    if (validate) {
      return isValid && !!input.trim().length;
    }
    return isValid;
  }
  function isHex(input) {
    if (!isString(input)) {
      return false;
    }
    return /^#([\da-f]{3,4}|[\da-f]{6,8})$/i.test(input);
  }
  function isHSL(input) {
    if (!isPlainObject(input)) {
      return false;
    }
    const entries = Object.entries(input);
    return !!entries.length && entries.every(([key, value]) => {
      if (key === "h") {
        return value >= 0 && value <= 360;
      }
      if (key === "alpha") {
        return value >= 0 && value <= 1;
      }
      return COLOR_KEYS.hsl.includes(key) && value >= 0 && value <= 100;
    });
  }
  function isLAB(input) {
    if (!isPlainObject(input)) {
      return false;
    }
    const entries = Object.entries(input);
    return !!entries.length && entries.every(([key, value]) => {
      if (key === "l") {
        return value >= 0 && value <= 100;
      }
      if (key === "alpha") {
        return value >= 0 && value <= 1;
      }
      return COLOR_KEYS.oklab.includes(key) && value >= -1 && value <= 1;
    });
  }
  function isLCH(input) {
    if (!isPlainObject(input)) {
      return false;
    }
    const entries = Object.entries(input);
    return !!entries.length && entries.every(([key, value]) => {
      if (key === "l") {
        return value >= 0 && value <= 100;
      }
      if (key === "alpha") {
        return value >= 0 && value <= 1;
      }
      return COLOR_KEYS.oklch.includes(key) && value >= 0 && value <= (key === "h" ? 360 : 1);
    });
  }
  function isRGB(input) {
    if (!isPlainObject(input)) {
      return false;
    }
    const entries = Object.entries(input);
    return !!entries.length && entries.every(([key, value]) => {
      if (key === "alpha") {
        return value >= 0 && value <= 1;
      }
      return COLOR_KEYS.rgb.includes(key) && value >= 0 && value <= 255;
    });
  }
  function clamp(value, min = 0, max = 100) {
    return Math.min(Math.max(value, min), max);
  }
  function limit(input, model, key) {
    invariant(isNumber(input), "Input is not a number");
    invariant(COLOR_MODELS.includes(model), `Invalid model${model ? `: ${model}` : ""}`);
    invariant(COLOR_KEYS[model].includes(key), `Invalid key${key ? `: ${key}` : ""}`);
    switch (model) {
      case "hsl": {
        invariant(COLOR_KEYS.hsl.includes(key), "Invalid key");
        if (["s", "l"].includes(key)) {
          return clamp(input);
        }
        return clamp(input, 0, 360);
      }
      case "rgb": {
        invariant(COLOR_KEYS.rgb.includes(key), "Invalid key");
        return clamp(input, 0, 255);
      }
      default: {
        throw new Error("Invalid inputs");
      }
    }
  }
  function parseInput(input, model) {
    const keys = COLOR_KEYS[model];
    const validator = {
      hsl: isHSL,
      oklab: isLAB,
      oklch: isLCH,
      rgb: isRGB
    };
    invariant(isPlainObject(input) || Array.isArray(input), MESSAGES.invalid);
    const value = Array.isArray(input) ? { [keys[0]]: input[0], [keys[1]]: input[1], [keys[2]]: input[2] } : input;
    invariant(validator[model](value), `invalid ${model} color`);
    return value;
  }
  function restrictValues(input, precision = PRECISION, forcePrecision = true) {
    const output = new Map(Object.entries(input));
    for (const [key, value] of output.entries()) {
      output.set(key, round(value, precision, forcePrecision));
    }
    return Object.fromEntries(output);
  }
  function round(input, precision = 2, forcePrecision = true) {
    if (!isNumber(input) || input === 0) {
      return 0;
    }
    if (forcePrecision) {
      const factor2 = 10 ** precision;
      return Math.round(input * factor2) / factor2;
    }
    const absInput = Math.abs(input);
    let digits = Math.abs(Math.ceil(Math.log(absInput) / Math.LN10));
    if (digits === 0) {
      digits = 2;
    } else if (digits > precision) {
      digits = precision;
    }
    let exponent = precision - (digits < 0 ? 0 : digits);
    if (exponent <= 1 && precision > 1) {
      exponent = 2;
    } else if (exponent > precision || exponent === 0) {
      exponent = precision;
    }
    const factor = 10 ** exponent;
    return Math.round(input * factor) / factor;
  }
  var converters_exports = {};
  __export2(converters_exports, {
    hex2hsl: () => hex2hsl,
    hex2oklab: () => hex2oklab,
    hex2oklch: () => hex2oklch,
    hex2rgb: () => hex2rgb,
    hsl2hex: () => hsl2hex,
    hsl2oklab: () => hsl2oklab,
    hsl2oklch: () => hsl2oklch,
    hsl2rgb: () => hsl2rgb,
    oklab2hex: () => oklab2hex,
    oklab2hsl: () => oklab2hsl,
    oklab2oklch: () => oklab2oklch,
    oklab2rgb: () => oklab2rgb,
    oklch2hex: () => oklch2hex,
    oklch2hsl: () => oklch2hsl,
    oklch2oklab: () => oklch2oklab,
    oklch2rgb: () => oklch2rgb,
    rgb2hex: () => rgb2hex,
    rgb2hsl: () => rgb2hsl,
    rgb2oklab: () => rgb2oklab,
    rgb2oklch: () => rgb2oklch
  });
  function formatHex(input) {
    invariant(isHex(input), MESSAGES.inputHex);
    let color = input.replace("#", "");
    if (color.length === 3 || color.length === 4) {
      const values = [...color];
      color = "";
      values.forEach((d) => {
        color += `${d}${d}`;
      });
    }
    const hex = `#${color}`;
    invariant(isHex(hex), "invalid hex");
    return hex;
  }
  function hex2rgb(input) {
    invariant(isHex(input), MESSAGES.inputHex);
    const hex = formatHex(input).slice(1);
    return {
      r: parseInt(hex.charAt(0) + hex.charAt(1), 16),
      g: parseInt(hex.charAt(2) + hex.charAt(3), 16),
      b: parseInt(hex.charAt(4) + hex.charAt(5), 16)
    };
  }
  function rgb2hsl(input) {
    const value = parseInput(input, "rgb");
    const rLimit = limit(value.r, "rgb", "r") / 255;
    const gLimit = limit(value.g, "rgb", "g") / 255;
    const bLimit = limit(value.b, "rgb", "b") / 255;
    const min = Math.min(rLimit, gLimit, bLimit);
    const max = Math.max(rLimit, gLimit, bLimit);
    const delta = max - min;
    let h = 0;
    let s;
    const l = (max + min) / 2;
    let rate;
    switch (max) {
      case rLimit:
        rate = !delta ? 0 : (gLimit - bLimit) / delta;
        h = 60 * rate;
        break;
      case gLimit:
        rate = (bLimit - rLimit) / delta;
        h = 60 * rate + 120;
        break;
      case bLimit:
        rate = (rLimit - gLimit) / delta;
        h = 60 * rate + 240;
        break;
      default:
        break;
    }
    if (h < 0) {
      h = 360 + h;
    }
    if (min === max) {
      s = 0;
    } else {
      s = l < 0.5 ? delta / (2 * l) : delta / (2 - 2 * l);
    }
    return {
      h: Math.abs(+(h % 360).toFixed(2)),
      s: +(s * 100).toFixed(2),
      l: +(l * 100).toFixed(2)
    };
  }
  function hex2hsl(input) {
    invariant(isHex(input), MESSAGES.inputHex);
    return rgb2hsl(hex2rgb(input));
  }
  var { cbrt, sign } = Math;
  function rgb2lrgb(input) {
    const abs2 = Math.abs(input);
    if (abs2 < 0.04045) {
      return input / 12.92;
    }
    return (sign(input) || 1) * ((abs2 + 0.055) / 1.055) ** 2.4;
  }
  function rgb2oklab(input, precision = PRECISION) {
    const value = parseInput(input, "rgb");
    const [lr, lg, lb] = [rgb2lrgb(value.r / 255), rgb2lrgb(value.g / 255), rgb2lrgb(value.b / 255)];
    const l = cbrt(LRGB_TO_LMS.l[0] * lr + LRGB_TO_LMS.l[1] * lg + LRGB_TO_LMS.l[2] * lb);
    const m = cbrt(LRGB_TO_LMS.m[0] * lr + LRGB_TO_LMS.m[1] * lg + LRGB_TO_LMS.m[2] * lb);
    const s = cbrt(LRGB_TO_LMS.s[0] * lr + LRGB_TO_LMS.s[1] * lg + LRGB_TO_LMS.s[2] * lb);
    const lab = {
      l: LSM_TO_LAB.l[0] * l + LSM_TO_LAB.l[1] * m - LSM_TO_LAB.l[2] * s,
      a: LSM_TO_LAB.a[0] * l - LSM_TO_LAB.a[1] * m + LSM_TO_LAB.a[2] * s,
      b: LSM_TO_LAB.b[0] * l + LSM_TO_LAB.b[1] * m - LSM_TO_LAB.b[2] * s
    };
    return restrictValues(lab, precision);
  }
  function hex2oklab(input, precision) {
    invariant(isHex(input), MESSAGES.inputHex);
    return rgb2oklab(hex2rgb(input), precision);
  }
  var { atan2, sqrt } = Math;
  function oklab2oklch(input, precision) {
    const { l, a, b } = restrictValues(parseInput(input, "oklab"));
    const c = sqrt(a ** 2 + b ** 2);
    let h = (atan2(b, a) * RAD2DEG + 360) % 360;
    if (round(c * 1e4) === 0) {
      h = 0;
    }
    return restrictValues({ l, c, h }, precision);
  }
  function rgb2oklch(input, precision) {
    const value = parseInput(input, "rgb");
    return oklab2oklch(rgb2oklab(value, precision), precision);
  }
  function hex2oklch(input, precision) {
    invariant(isHex(input), MESSAGES.inputHex);
    return rgb2oklch(hex2rgb(input), precision);
  }
  function hue2rgb(point, chroma2, h) {
    invariant(isNumber(point) && isNumber(chroma2) && isNumber(h), "point, chroma and h are required");
    let hue = h;
    if (hue < 0) {
      hue += 1;
    }
    if (hue > 1) {
      hue -= 1;
    }
    if (hue < 1 / 6) {
      return round(point + (chroma2 - point) * 6 * hue, 4);
    }
    if (hue < 1 / 2) {
      return round(chroma2, 4);
    }
    if (hue < 2 / 3) {
      return round(point + (chroma2 - point) * (2 / 3 - hue) * 6, 4);
    }
    return round(point, 4);
  }
  function hsl2rgb(input) {
    const value = parseInput(input, "hsl");
    const h = round(value.h) / 360;
    const s = round(value.s) / 100;
    const l = round(value.l) / 100;
    let r;
    let g;
    let b;
    let point;
    let chroma2;
    if (s === 0) {
      r = l;
      g = l;
      b = l;
    } else {
      chroma2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
      point = 2 * l - chroma2;
      r = hue2rgb(point, chroma2, h + 1 / 3);
      g = hue2rgb(point, chroma2, h);
      b = hue2rgb(point, chroma2, h - 1 / 3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
  function rgb2hex(input) {
    const rgb = parseInput(input, "rgb");
    return `#${Object.values(rgb).map((d) => `0${Math.floor(d).toString(16)}`.slice(-2)).join("")}`;
  }
  function hsl2hex(input) {
    const value = parseInput(input, "hsl");
    return rgb2hex(hsl2rgb(value));
  }
  function hsl2oklab(input, precision) {
    const value = parseInput(input, "hsl");
    return rgb2oklab(hsl2rgb(value), precision);
  }
  function hsl2oklch(input, precision) {
    const value = parseInput(input, "hsl");
    return rgb2oklch(hsl2rgb(value), precision);
  }
  var { abs } = Math;
  function lrgb2rgb(input) {
    const absoluteNumber = abs(input);
    const sign2 = input < 0 ? -1 : 1;
    if (absoluteNumber > 0.0031308) {
      return sign2 * (absoluteNumber ** (1 / 2.4) * 1.055 - 0.055);
    }
    return input * 12.92;
  }
  function oklab2rgb(input, precision = 0) {
    const { l: L, a: A, b: B } = parseInput(input, "oklab");
    const l = (L + LAB_TO_LMS.l[0] * A + LAB_TO_LMS.l[1] * B) ** 3;
    const m = (L + LAB_TO_LMS.m[0] * A + LAB_TO_LMS.m[1] * B) ** 3;
    const s = (L + LAB_TO_LMS.s[0] * A + LAB_TO_LMS.s[1] * B) ** 3;
    const r = 255 * lrgb2rgb(LSM_TO_RGB.r[0] * l + LSM_TO_RGB.r[1] * m + LSM_TO_RGB.r[2] * s);
    const g = 255 * lrgb2rgb(LSM_TO_RGB.g[0] * l + LSM_TO_RGB.g[1] * m + LSM_TO_RGB.g[2] * s);
    const b = 255 * lrgb2rgb(LSM_TO_RGB.b[0] * l + LSM_TO_RGB.b[1] * m + LSM_TO_RGB.b[2] * s);
    return {
      r: clamp(round(r, precision), 0, 255),
      g: clamp(round(g, precision), 0, 255),
      b: clamp(round(b, precision), 0, 255)
    };
  }
  function oklab2hex(input) {
    const value = parseInput(input, "oklab");
    return rgb2hex(oklab2rgb(value));
  }
  function oklab2hsl(input) {
    const value = parseInput(input, "oklab");
    return rgb2hsl(oklab2rgb(value));
  }
  var { sin, cos } = Math;
  function oklch2oklab(input, precision) {
    let { l, c, h } = parseInput(input, "oklch");
    if (Number.isNaN(h) || h < 0) {
      h = 0;
    }
    return restrictValues({ l, a: c * cos(h * DEG2RAD), b: c * sin(h * DEG2RAD) }, precision);
  }
  function oklch2rgb(input, precision = 0) {
    const value = parseInput(input, "oklch");
    return oklab2rgb(oklch2oklab(value), precision);
  }
  function oklch2hex(input) {
    const value = parseInput(input, "oklch");
    return rgb2hex(oklch2rgb(value));
  }
  function oklch2hsl(input) {
    const value = parseInput(input, "oklch");
    return rgb2hsl(oklch2rgb(value));
  }

  // src/misc.ts
  function clamp2(value, left, right) {
    return Math.max(left, Math.min(right, value));
  }
  function lerp(left, right, t) {
    return left * (1 - t) + right * t;
  }
  function unlerp(left, right, value) {
    if (left === right)
      return 0.5;
    return (value - left) / (right - left);
  }
  function clamplerp(value, inMin, inMax, outMin, outMax) {
    return lerp(outMin, outMax, clamp2(unlerp(inMin, inMax, value), 0, 1));
  }
  function listToSum(list) {
    return list.reduce((a, b) => a + b, 0);
  }
  function speedBetween(a, b) {
    if (!a || !b)
      return 0;
    if (a.at === b.at)
      return 0;
    return (b.pos - a.pos) / (b.at - a.at) * 1000;
  }
  function absSpeedBetween(a, b) {
    return Math.abs(speedBetween(a, b));
  }
  function minBy(list, fn) {
    const values = list.map(fn);
    const minIndex = values.reduce((a, b, i) => b < values[a] ? i : a, 0);
    return list[minIndex];
  }
  function compareWithOrder(a, b, order) {
    const N = order.length;
    let aIndex = order.indexOf(a);
    let bIndex = order.indexOf(b);
    aIndex = aIndex > -1 ? aIndex : a ? N : a === "" ? N + 1 : N + 2;
    bIndex = bIndex > -1 ? bIndex : b ? N : b === "" ? N + 1 : N + 2;
    if (aIndex !== bIndex)
      return aIndex - bIndex;
    if (aIndex === N) {
      return a === b ? 0 : a < b ? -1 : 1;
    }
    return 0;
  }

  // src/converter.ts
  function timeSpanToMs(timeSpan) {
    if (typeof timeSpan !== "string") {
      throw new TypeError("timeSpanToMs: timeSpan must be a string");
    }
    const sign2 = timeSpan.startsWith("-") ? -1 : 1;
    if (sign2 < 0)
      timeSpan = timeSpan.slice(1);
    const split = timeSpan.split(":").map((e) => Number.parseFloat(e));
    while (split.length < 3)
      split.unshift(0);
    const [hours, minutes, seconds] = split;
    return Math.round(sign2 * (hours * 60 * 60 + minutes * 60 + seconds) * 1000);
  }
  function msToTimeSpan(ms) {
    const sign2 = ms < 0 ? -1 : 1;
    ms *= sign2;
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 1000 / 60) % 60;
    const hours = Math.floor(ms / 1000 / 60 / 60);
    ms = ms % 1000;
    return `${sign2 < 0 ? "-" : ""}${hours.toFixed(0).padStart(2, "0")}:${minutes.toFixed(0).padStart(2, "0")}:${seconds.toFixed(0).padStart(2, "0")}.${ms.toFixed(0).padStart(3, "0")}`;
  }
  function secondsToDuration(seconds) {
    seconds = Math.round(seconds);
    if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toFixed(0).padStart(2, "0")}`;
    }
    return `${Math.floor(seconds / 60 / 60)}:${Math.floor(seconds / 60 % 60).toFixed(0).padStart(2, "0")}:${Math.floor(seconds % 60).toFixed(0).padStart(2, "0")}`;
  }
  function orderTrimJson(that, order, empty) {
    const copy = { ...order, ...that };
    for (const [k, v] of Object.entries(empty)) {
      if (!(k in copy))
        continue;
      const copyValue = copy[k];
      if (copyValue === v)
        delete copy[k];
      if (Array.isArray(v) && Array.isArray(copyValue) && copyValue.length === 0) {
        delete copy[k];
      } else if (typeof v === "object" && v !== null && Object.keys(v).length === 0 && typeof copyValue === "object" && copyValue !== null && Object.keys(copyValue).length === 0) {
        delete copy[k];
      }
    }
    return copy;
  }
  function fromEntries(a) {
    return Object.fromEntries(a);
  }
  var axisPairs = [
    ["L0", "stroke"],
    ["L1", "surge"],
    ["L2", "sway"],
    ["R0", "twist"],
    ["R1", "roll"],
    ["R2", "pitch"],
    ["A1", "suck"]
  ];
  var axisToNameMap = fromEntries(axisPairs);
  var axisNameToAxisMap = fromEntries(axisPairs.map(([a, b]) => [b, a]));
  var axisIds = axisPairs.map((e) => e[0]);
  var axisNames = axisPairs.map((e) => e[1]);
  var axisLikes = axisPairs.flat();
  function axisToName(axis) {
    if (axis && axis in axisToNameMap)
      return axisToNameMap[axis];
    throw new Error(`axisToName: ${axis} is not supported`);
  }
  function axisLikeToAxis(axisLike) {
    if (!axisLike)
      return "L0";
    if (axisIds.includes(axisLike))
      return axisLike;
    if (axisNames.includes(axisLike))
      return axisNameToAxisMap[axisLike];
    if (axisLike === "singleaxis")
      return "L0";
    throw new Error(`axisLikeToAxis: ${axisLike} is not supported`);
  }
  function orderByAxis(a, b) {
    return compareWithOrder(a.id, b.id, axisIds);
  }
  function formatJson(json, { lineLength = 100, maxPrecision = 1, compress = false } = {}) {
    function removeNewlines(s) {
      return s.replaceAll(/ *\n\s*/g, " ");
    }
    const inArrayRegex = /(?<=\[)([^[\]]+)(?=\])/g;
    json = json.replaceAll(/\{\s*"(at|time|startTime)":[^{}]+\}/g, removeNewlines);
    json = json.replaceAll(inArrayRegex, (s) => {
      s = s.replaceAll(/(?<="(at|pos)":\s*)(-?\d+\.?\d*)/g, (num) => Number(num).toFixed(maxPrecision).replace(/\.?0+$/, ""));
      const atValues = s.match(/(?<="at":\s*)(-?\d+\.?\d*)/g) ?? [];
      if (atValues.length === 0)
        return s;
      const maxAtLength = Math.max(0, ...atValues.map((e) => e.length));
      s = s.replaceAll(/(?<="at":\s*)(-?\d+\.?\d*)/g, (s2) => s2.padStart(maxAtLength, " "));
      const posValues = s.match(/(?<="pos":\s*)(-?\d+\.?\d*)/g) ?? [];
      const posDot = Math.max(0, ...posValues.map((e) => e.split(".")[1]).filter((e) => e).map((e) => e.length + 1));
      s = s.replaceAll(/(?<="pos":\s*)(-?\d+\.?\d*)/g, (s2) => {
        if (!s2.includes("."))
          return s2.padStart(3) + " ".repeat(posDot);
        const [a, b] = s2.split(".");
        return `${a.padStart(3)}.${b.padEnd(posDot - 1, " ")}`;
      });
      const actionLength = '{ "at": , "pos": 100 },'.length + maxAtLength + posDot;
      let actionsPerLine1 = 10;
      while (6 + (actionLength + 1) * actionsPerLine1 - 1 > lineLength)
        actionsPerLine1--;
      let i = 0;
      s = s.replaceAll(/\n(?!\s*$)\s*/g, (s2) => i++ % actionsPerLine1 === 0 ? s2 : " ");
      if (compress) {
        const [, start, , end] = s.match(/^(\s*(?=$|\S))([\s\S]+)((?<=^|\S)\s*)$/) ?? ["", "", "", ""];
        s = start + JSON.stringify(JSON.parse(`[${s}]`)).slice(1, -1) + end;
      }
      return s;
    });
    return json;
  }
  var speedToOklchParams = {
    l: { left: 500, right: 600, from: 0.8, to: 0.4 },
    c: { left: 800, right: 900, from: 0.4, to: 0.1 },
    h: { speed: -2.4, offset: 210 },
    a: { left: 0, right: 100, from: 0, to: 1 }
  };
  function speedToOklch(speed, useAlpha = false) {
    function roll(value, cap) {
      return (value % cap + cap) % cap;
    }
    const l = clamplerp(speed, speedToOklchParams.l.left, speedToOklchParams.l.right, speedToOklchParams.l.from, speedToOklchParams.l.to);
    const c = clamplerp(speed, speedToOklchParams.c.left, speedToOklchParams.c.right, speedToOklchParams.c.from, speedToOklchParams.c.to);
    const h = roll(speedToOklchParams.h.offset + speed / speedToOklchParams.h.speed, 360);
    const a = useAlpha ? clamplerp(speed, speedToOklchParams.a.left, speedToOklchParams.a.right, speedToOklchParams.a.from, speedToOklchParams.a.to) : 1;
    return [l, c, h, a];
  }
  function speedToOklchText(speed, useAlpha = false) {
    const [l, c, h, a] = speedToOklch(speed, useAlpha);
    function toFixed(value, precision) {
      return value.toFixed(precision).replace(/\.?0+$/, "");
    }
    return `oklch(${toFixed(l * 100, 3)}% ${toFixed(c, 3)} ${toFixed(h, 1)}${useAlpha ? ` / ${toFixed(a, 3)}` : ""})`;
  }
  function speedToHex(speed) {
    const [l, c, h] = speedToOklch(speed);
    return oklch2hex({ l, c, h });
  }
  class TCodeAction extends Array {
    static from(a) {
      return new TCodeAction(...a);
    }
    constructor(...a) {
      super();
      this.push(...Array.isArray(a[0]) ? a[0] : a);
    }
    toString(ops) {
      const d = ops?.format ? "_" : "";
      let mantissa = clamp2(this[1] / 100, 0, 1).toFixed(ops?.precision ?? 4);
      if (mantissa.startsWith("1"))
        mantissa = "0.999999999";
      mantissa = mantissa.slice(2).slice(0, ops?.precision ?? 4);
      if (d)
        mantissa = mantissa.padStart(ops?.precision ?? 4, "_");
      else
        mantissa = mantissa.replace(/(?<=.)0+$/, "");
      const target = this[3] ?? 0;
      const speedText = clamp2(target, 0, 9999).toFixed(0);
      const intervalText = clamp2(target, 0, 99999).toFixed(0);
      const postfix = this[2] === "I" ? `${d}I${d}${intervalText.padStart(d ? 3 : 0, "_")}` : this[2] === "S" ? `${d}S${d}${speedText.padStart(d ? 3 : 0, "_")}` : "";
      return `${this[0]}${d}${mantissa}${postfix}`;
    }
  }

  class TCodeList extends Array {
    static from(arrayLike) {
      return new TCodeList(...arrayLike.map((e) => new TCodeAction(e)));
    }
    toString(ops) {
      if (!this.length)
        return "";
      return this.map((e) => e.toString(ops)).join(" ") + `
`;
    }
  }

  // src/manipulations.ts
  function actionsToLines(actions) {
    return actions.map((e, i, a) => {
      const p = a[i - 1];
      if (!p)
        return null;
      const speed = speedBetween(p, e);
      return Object.assign([p, e, Math.abs(speed)], {
        speed,
        absSpeed: Math.abs(speed),
        speedSign: Math.sign(speed),
        dat: e.at - p.at,
        atStart: p.at,
        atEnd: e.at
      });
    }).slice(1).filter((e) => e[0].at < e[1].at);
  }
  function actionsToZigzag(actions) {
    return FunAction.cloneList(actions.filter((e) => e.isPeak), {
      parent: true
    });
  }
  function mergeLinesSpeed(lines, mergeLimit) {
    if (!mergeLimit)
      return lines;
    let j = 0;
    for (let i = 0;i < lines.length - 1; i = j + 1) {
      for (j = i;j < lines.length - 1; j++) {
        if (lines[i].speedSign !== lines[j + 1].speedSign)
          break;
      }
      const f = lines.slice(i, j + 1);
      if (i === j)
        continue;
      if (listToSum(f.map((e) => e.dat)) > mergeLimit)
        continue;
      const avgSpeed = listToSum(f.map((e) => e.absSpeed * e.dat)) / listToSum(f.map((e) => e.dat));
      f.map((e) => e[2] = avgSpeed);
    }
    return lines;
  }
  function actionsAverageSpeed(actions) {
    const zigzag = actionsToZigzag(actions);
    const fast = zigzag.filter((e) => Math.abs(e.speedTo) > 30);
    return listToSum(fast.map((e) => Math.abs(e.speedTo) * e.datNext)) / (listToSum(fast.map((e) => e.datNext)) || 1);
  }
  function actionsRequiredMaxSpeed(actions) {
    if (actions.length < 2)
      return 0;
    const requiredSpeeds = [];
    let nextPeak = actions[0];
    for (const a of actions) {
      if (nextPeak === a) {
        nextPeak = nextPeak.nextAction;
        while (nextPeak && !nextPeak.isPeak)
          nextPeak = nextPeak.nextAction;
      }
      if (!nextPeak)
        break;
      requiredSpeeds.push([Math.abs(speedBetween(a, nextPeak)), nextPeak.at - a.at]);
    }
    const sorted = requiredSpeeds.sort((a, b) => a[0] - b[0]).reverse();
    return sorted.find((e) => e[1] >= 50)?.[0] ?? 0;
  }
  function splitToSegments(actions) {
    const segments = [];
    let prevPeakIndex = -1;
    for (let i = 0;i < actions.length; i++) {
      if (actions[i].isPeak !== 0) {
        if (prevPeakIndex !== -1) {
          segments.push(actions.slice(prevPeakIndex, i + 1));
        }
        prevPeakIndex = i;
      }
    }
    return segments;
  }
  function connectSegments(segments) {
    return FunAction.linkList(segments.flat().filter((e, i, a) => e !== a[i - 1]), { parent: true });
  }
  function simplifyLinearCurve(curve, threshold) {
    if (curve.length <= 2) {
      return FunAction.linkList(curve, { parent: true });
    }
    const segments = splitToSegments(curve);
    const simplifiedSegments = segments.map((segment) => {
      if (lineDeviation(segment) <= threshold) {
        return [segment[0], segment.at(-1)];
      }
      const result = [segment[0]];
      let startIdx = 0;
      while (startIdx < segment.length - 1) {
        let endIdx = startIdx + 2;
        while (endIdx <= segment.length - 1) {
          if (lineDeviation(segment.slice(startIdx, endIdx + 1)) > threshold) {
            break;
          }
          endIdx++;
        }
        endIdx = Math.max(startIdx + 1, endIdx - 1);
        result.push(segment[endIdx]);
        startIdx = endIdx;
      }
      return result;
    });
    return connectSegments(simplifiedSegments);
  }
  var HANDY_MAX_SPEED = 550;
  var HANDY_MIN_INTERVAL = 60;
  var HANDY_MAX_STRAIGHT_THRESHOLD = 3;
  function handySmooth(actions) {
    actions = FunAction.cloneList(actions, { parent: true });
    actions.map((e) => e.pos = Math.round(e.pos));
    const segments = splitToSegments(actions);
    function simplifySegment(segment) {
      if (segment.length <= 2)
        return segment;
      const first = segment[0], last = segment.at(-1);
      let middle = segment.slice(1, -1);
      if (lineDeviation(segment) <= HANDY_MAX_STRAIGHT_THRESHOLD)
        return [first, last];
      if (absSpeedBetween(first, last) > HANDY_MAX_SPEED)
        return [first, last];
      middle = middle.filter((e) => {
        const speed = absSpeedBetween(first, e);
        const restSpeed = absSpeedBetween(e, last);
        return speed < HANDY_MAX_SPEED && restSpeed < HANDY_MAX_SPEED;
      });
      middle = middle.filter((e) => {
        return e.at - first.at >= HANDY_MIN_INTERVAL && last.at - e.at >= HANDY_MIN_INTERVAL;
      });
      if (!middle.length)
        return [first, last];
      if (middle.length === 1) {
        return straigten([first, middle[0], last]);
      }
      const middleDuration = middle.at(-1).at - middle[0].at;
      if (middleDuration < HANDY_MIN_INTERVAL) {
        const middlePoint = minBy(middle, (e) => Math.abs(e.at - middleDuration / 2));
        return straigten([first, middlePoint, last]);
      }
      function straigten(segment2) {
        if (segment2.length <= 2)
          return segment2;
        if (lineDeviation(segment2) <= HANDY_MAX_STRAIGHT_THRESHOLD)
          return [segment2[0], segment2.at(-1)];
        return segment2;
      }
      return [first, ...simplifySegment(middle), last];
    }
    const filteredSegments = segments.map((segment) => {
      return simplifySegment(segment);
    });
    let filteredActions = connectSegments(filteredSegments);
    for (let i = 1;i < filteredActions.length; i++) {
      const current = filteredActions[i];
      const prev = filteredActions[i - 1];
      if (!current.isPeak && !prev.isPeak)
        continue;
      const speed = absSpeedBetween(prev, current);
      if (speed > 10)
        continue;
      prev.pos = lerp(prev.pos, current.pos, 0.5);
      prev.at = lerp(prev.at, current.at, 0.5);
      filteredActions.splice(i, 1);
      i--;
    }
    filteredActions = FunAction.linkList(filteredActions, { parent: true });
    filteredActions = limitPeakSpeed(filteredActions, HANDY_MAX_SPEED);
    filteredActions = simplifyLinearCurve(filteredActions, HANDY_MAX_STRAIGHT_THRESHOLD);
    filteredActions.forEach((e) => {
      e.at = Math.round(e.at);
      e.pos = Math.round(e.pos);
    });
    return FunAction.linkList(filteredActions, { parent: true });
  }
  function lineDeviation(actions) {
    if (actions.length <= 2)
      return 0;
    const first = actions[0];
    const last = actions.at(-1);
    let maxDeviation = 0;
    for (let i = 1;i < actions.length - 1; i++) {
      const t = (actions[i].at - first.at) / (last.at - first.at);
      const expectedPos = first.pos + (last.pos - first.pos) * t;
      const deviation = Math.abs(actions[i].pos - expectedPos);
      if (deviation > maxDeviation)
        maxDeviation = deviation;
    }
    return maxDeviation;
  }
  function limitPeakSpeed(actions, maxSpeed) {
    const peaks = actionsToZigzag(actions);
    const poss = peaks.map((e) => e.pos);
    for (let i = 0;i < 10; i++) {
      let retry = false;
      const lchanges = Array.from({ length: poss.length }, () => 0);
      const rchanges = Array.from({ length: poss.length }, () => 0);
      for (let l = 0, r = 1;r < poss.length; l++, r++) {
        const left = peaks[l], right = peaks[r], absSpeed = Math.abs(left.speedFrom);
        if (absSpeed <= maxSpeed)
          continue;
        const height = right.pos - left.pos;
        const changePercent = (absSpeed - maxSpeed) / absSpeed;
        const totalChange = height * changePercent;
        lchanges[l] += totalChange / 2;
        rchanges[r] -= totalChange / 2;
      }
      const changes = Array.from({ length: poss.length }, (_, i2) => {
        const lchange = lchanges[i2];
        const rchange = rchanges[i2];
        return Math.sign(lchange) === Math.sign(rchange) ? Math.abs(lchange) > Math.abs(rchange) ? lchange : rchange : lchange + rchange;
      });
      for (let i2 = 0;i2 < poss.length; i2++) {
        poss[i2] += changes[i2];
        peaks[i2].pos = poss[i2];
      }
      const speed = Math.max(...peaks.map((peak) => Math.abs(peak.speedFrom)));
      if (speed > maxSpeed) {
        retry = true;
      }
      if (!retry)
        break;
    }
    const segments = splitToSegments(actions);
    for (let i = 0;i < segments.length; i++) {
      const newLeftPos = peaks[i].pos, newRightPos = peaks[i + 1].pos;
      const segment = segments[i];
      const leftAt = segment[0].at, rightAt = segment.at(-1).at;
      for (let j = 0;j < segment.length; j++) {
        segment[j].pos = lerp(newLeftPos, newRightPos, unlerp(leftAt, rightAt, segment[j].at));
      }
    }
    return connectSegments(segments);
  }

  // src/svg.ts
  var speedToHexCache = new Map;
  function speedToHexCached(speed) {
    speed = Math.round(speed);
    if (speedToHexCache.has(speed))
      return speedToHexCache.get(speed);
    const hex = speedToHex(speed);
    speedToHexCache.set(speed, hex);
    return hex;
  }
  var svgDefaultOptions = {
    title: "",
    lineWidth: 0.5,
    midBorderX: 0,
    midBorderY: 0,
    outerBorder: 0,
    bgOpacity: 0.2,
    headerOpacity: 0.7,
    mergeLimit: 500,
    axisCells: 1,
    scriptSpacing: 4,
    normalize: true,
    width: 690
  };
  var isBrowser = typeof document !== "undefined";
  function textToSvgLength(text, font) {
    if (!isBrowser)
      return 0;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const width = context.measureText(text).width;
    return width;
  }
  function textToSvgText(text) {
    if (!isBrowser)
      return text;
    const span = document.createElement("span");
    span.textContent = text;
    return span.innerHTML;
  }
  function toSvgLines(script, { width, height, w = 2, mergeLimit = 500 }) {
    const duration = script.actualDuration;
    function lineToStroke(a, b) {
      const at = (a2) => a2.at / 1000 / duration * (width - 2 * w) + w;
      const pos = (a2) => (100 - a2.pos) * (height - 2 * w) / 100 + w;
      return `M ${at(a)} ${pos(a)} L ${at(b)} ${pos(b)}`;
    }
    const lines = actionsToLines(script.actions);
    mergeLinesSpeed(lines, mergeLimit);
    lines.sort((a, b) => a[2] - b[2]);
    return lines.map(([a, b, speed]) => `<path d="${lineToStroke(a, b)}" stroke="${speedToHexCached(speed)}"></path>`).join(`
`);
  }
  function toSvgBackgroundGradient(script, linearGradientId) {
    const durationMs = script.actualDuration * 1000;
    const lines = actionsToLines(actionsToZigzag(script.actions)).flatMap((e) => {
      const [a, b, s] = e;
      const len = b.at - a.at;
      if (len <= 0)
        return [];
      if (len < 2000)
        return [e];
      const N = ~~((len - 500) / 1000);
      const ra = Array.from({ length: N }, (_, i) => {
        return [
          new FunAction({ at: lerp2(a.at, b.at, i / N), pos: lerp2(a.pos, b.pos, i / N) }),
          new FunAction({ at: lerp2(a.at, b.at, (i + 1) / N), pos: lerp2(a.pos, b.pos, (i + 1) / N) }),
          s
        ];
      });
      return ra;
    });
    for (let i = 0;i < lines.length - 1; i++) {
      const [a, b, ab] = lines[i], [c, d, cd] = lines[i + 1];
      if (d.at - a.at < 1000) {
        const speed = (ab * (b.at - a.at) + cd * (d.at - c.at)) / (b.at - a.at + (d.at - c.at));
        lines.splice(i, 2, [a, d, speed]);
        i--;
      }
    }
    let stops = lines.filter((e, i, a) => {
      const p = a[i - 1], n = a[i + 1];
      if (!p || !n)
        return true;
      if (p[2] === e[2] && e[2] === n[2])
        return false;
      return true;
    }).map(([a, b, speed]) => {
      const at = (a.at + b.at) / 2;
      return { at, speed };
    });
    if (lines.length) {
      const first = lines[0], last = lines.at(-1);
      stops.unshift({ at: first[0].at, speed: first[2] });
      if (first[0].at > 100) {
        stops.unshift({ at: first[0].at - 100, speed: 0 });
      }
      stops.push({ at: last[1].at, speed: last[2] });
      if (last[1].at < durationMs - 100) {
        stops.push({ at: last[1].at + 100, speed: 0 });
      }
    }
    stops = stops.filter((e, i, a) => {
      const p = a[i - 1], n = a[i + 1];
      if (!p || !n)
        return true;
      if (p.speed === e.speed && e.speed === n.speed)
        return false;
      return true;
    });
    return `
      <linearGradient id="${linearGradientId}">
        ${stops.map((s) => `<stop offset="${Math.max(0, Math.min(1, s.at / durationMs))}" stop-color="${speedToHexCached(s.speed)}"${s.speed >= 100 ? "" : ` stop-opacity="${s.speed / 100}"`}></stop>`).join(`
          `)}
      </linearGradient>`;
  }
  function toSvgElement(scripts, ops) {
    const fullOps = { ...svgDefaultOptions, ...ops };
    const pieces = [];
    let y = 2;
    for (const s of scripts) {
      pieces.push(toSvgG(s, {
        ...fullOps,
        transform: `translate(${2}, ${y})`
      }));
      y += 52 + fullOps.midBorderY + fullOps.outerBorder;
      for (const a of s.axes) {
        pieces.push(toSvgG(a, {
          ...fullOps,
          transform: `translate(${2}, ${y})`
        }));
        y += 52 + fullOps.midBorderY + fullOps.outerBorder;
      }
      y += fullOps.scriptSpacing;
    }
    y -= fullOps.scriptSpacing;
    y += 2;
    return `<svg class="funsvg" width="${fullOps.width}" height="${y}" xmlns="http://www.w3.org/2000/svg"
    font-size="14px" font-family="Consolas"
  >
    ${pieces.join(`
`)}
  </svg>`;
  }
  function toSvgG(script, ops) {
    let {
      title,
      lineWidth: w,
      midBorderX: dw,
      midBorderY: dh,
      outerBorder: sw = 0,
      bgOpacity,
      headerOpacity,
      mergeLimit,
      axisCells,
      normalize = true,
      width
    } = ops;
    script = script.clone();
    if (normalize)
      script.normalize();
    const isForHandy = "_isForHandy" in script && script._isForHandy;
    if (!title) {
      if (script.file) {
        title = script.file.filePath;
      } else if (script.parent?.file) {
        title = script.parent.file.filePath + "::" + axisToName(script.id);
      }
    }
    let axis = script.id ?? "L0";
    if (isForHandy)
      axis = "☞";
    const badActions = script.actions.filter((e) => !Number.isFinite(e.pos));
    if (badActions.length) {
      console.log("badActions", badActions);
      badActions.map((e) => e.pos = 120);
      title += "::bad";
      axis = "!!!";
    }
    const stats = script.toStats();
    const graphWidth = width - 50;
    const xx = [0, 46 - dw, 46, width];
    const yy = [0, 20, 20 + dh, 20 + 32 + dh];
    const bgGradientId = `funsvg-grad-${Math.random().toString(26).slice(2)}`;
    const axisTitleTop = axisCells === 1 ? yy[0] : yy[2];
    const color = "transparent";
    const round2 = (x) => +x.toFixed(2);
    return `
    <g transform="${ops.transform}">

      <g class="funsvg-bgs">
        <defs>${toSvgBackgroundGradient(script, bgGradientId)}</defs>
        <rect class="funsvg-bg-axis-drop" x="0" y="${axisTitleTop}" width="${xx[1]}" height="${yy[3] - axisTitleTop}" fill="#ccc" opacity="${round2(bgOpacity * 1.5)}"></rect>
        <rect class="funsvg-bg-title-drop" x="${xx[2]}" width="${graphWidth}" height="${yy[1]}" fill="#ccc" opacity="${round2(bgOpacity * 1.5)}"></rect>
        <rect class="funsvg-bg-axis" x="0" y="${axisTitleTop}" width="${xx[1]}" height="${yy[3] - axisTitleTop}" fill="${speedToHexCached(stats.AvgSpeed)}" opacity="${round2(headerOpacity * Math.max(0.5, Math.min(1, stats.AvgSpeed / 100)))}"></rect>
        <rect class="funsvg-bg-title" x="${xx[2]}" width="${graphWidth}" height="${yy[1]}" fill="url(#${bgGradientId})" opacity="${round2(headerOpacity)}"></rect>
        <rect class="funsvg-bg-graph" x="${xx[2]}" width="${graphWidth}" y="${yy[1]}" height="${yy[3] - yy[1]}" fill="url(#${bgGradientId})" opacity="${round2(bgOpacity)}"></rect>
      </g>


      <g class="funsvg-lines" transform="translate(${xx[2]}, ${yy[2]})" stroke-width="${w}" fill="none" stroke-linecap="round">
        ${toSvgLines(script, { width: graphWidth, height: 32, w, mergeLimit })}
      </g>

      <g class="funsvg-titles">
        <g class="funsvg-titles-drop" stroke="white" opacity="0.5" paint-order="stroke fill markers" stroke-width="3" stroke-dasharray="none" stroke-linejoin="round" fill="transparent">
          <text class="funsvg-axis-drop" opacity="0" x="${xx[1] / 2}" y="${(axisTitleTop + yy[3]) / 2 + (axisTitleTop === yy[2] ? 2 : 4)}" font-size="250%" text-anchor="middle" dominant-baseline="middle"> ${axis} </text>
          <text class="funsvg-title-drop" x="49" y="15" lengthAdjust="spacingAndGlyphs" ${textToSvgLength(title, "14px Consolas") > 450 ? 'textLength="450"' : ""}> ${textToSvgText(title)} </text>
          ${Object.entries(stats).reverse().map(([k, v], i) => `
              <text class="funsvg-stat-label-drop" x="${xx[3] - 7 - i * 46}" y="7" font-weight="bold" font-size="50%" text-anchor="end"> ${k} </text>
              <text class="funsvg-stat-value-drop" x="${xx[3] - 7 - i * 46}" y="17" font-weight="bold" font-size="90%" text-anchor="end"> ${v} </text>
            `).join(`
`)}
        </g>
        <text class="funsvg-axis" x="${xx[1] / 2}" y="${(axisTitleTop + yy[3]) / 2 + (axisTitleTop === yy[2] ? 2 : 4)}" font-size="250%" text-anchor="middle" dominant-baseline="middle"> ${axis} </text>
        <text class="funsvg-title" x="49" y="15" lengthAdjust="spacingAndGlyphs" ${textToSvgLength(title, "14px Consolas") > 450 ? 'textLength="450"' : ""}> ${textToSvgText(title)} </text>
        ${Object.entries(stats).reverse().map(([k, v], i) => `
            <text class="funsvg-stat-label" x="${xx[3] - 7 - i * 46}" y="7" font-weight="bold" font-size="50%" text-anchor="end"> ${k} </text>
            <text class="funsvg-stat-value" x="${xx[3] - 7 - i * 46}" y="17" font-weight="bold" font-size="90%" text-anchor="end"> ${v} </text>
          `).join(`
`)}
      </g>

      <g class="funsvg-borders">
        ${axisTitleTop === yy[0] ? "" : `<rect x="0" y="0" width="${xx[1]}" height="20" stroke="${color}" stroke-width="0.2" fill="none"></rect>`}
        <rect x="0" y="${axisTitleTop}" width="${xx[1]}" height="${yy[3] - axisTitleTop}" stroke="${color}" stroke-width="0.2" fill="none"></rect>
        <rect x="${xx[2]}" y="0" width="${graphWidth}" height="20" stroke="${color}" stroke-width="0.2" fill="none"></rect>
        <rect x="${xx[2]}" y="${yy[2]}" width="${graphWidth}" height="32" stroke="${color}" stroke-width="0.2" fill="none"></rect>
        <rect x="${-sw / 2}" y="${-sw / 2}" width="${xx[3] - 4 + sw}" height="${yy[3] + sw}" stroke="${"#eee"}" stroke-width="${sw}" fill="none"></rect>
      </g>

    </g>
  `;
  }
  function lerp2(min, max, t) {
    return min + t * (max - min);
  }

  // src/index.ts
  class FunAction {
    static linkList(list, extras) {
      if (extras?.parent === true)
        extras.parent = list[0]?.parent;
      for (let i = 1;i < list.length; i++) {
        list[i].#prevAction = list[i - 1];
        list[i - 1].#nextAction = list[i];
        if (extras?.parent)
          list[i].#parent = extras.parent;
      }
      return list;
    }
    at = 0;
    pos = 0;
    #parent;
    #prevAction;
    #nextAction;
    constructor(action, extras) {
      Object.assign(this, action);
      this.#parent = extras && "parent" in extras ? extras.parent : action instanceof FunAction ? action.#parent : undefined;
    }
    get nextAction() {
      return this.#nextAction;
    }
    get prevAction() {
      return this.#prevAction;
    }
    get parent() {
      return this.#parent;
    }
    get speedTo() {
      return speedBetween(this.#prevAction, this);
    }
    get speedFrom() {
      return speedBetween(this, this.#nextAction);
    }
    get isPeak() {
      const { speedTo, speedFrom } = this;
      if (!this.#prevAction && !this.#nextAction)
        return 1;
      if (!this.#prevAction)
        return speedFrom < 0 ? 1 : 1;
      if (!this.#nextAction)
        return speedTo > 0 ? -1 : -1;
      if (Math.sign(speedTo) === Math.sign(speedFrom))
        return 0;
      if (speedTo > speedFrom)
        return 1;
      if (speedTo < speedFrom)
        return -1;
      return 0;
    }
    get datNext() {
      if (!this.#nextAction)
        return 0;
      return this.#nextAction.at - this.at;
    }
    get datPrev() {
      if (!this.#prevAction)
        return 0;
      return this.at - this.#prevAction.at;
    }
    get dposNext() {
      if (!this.#nextAction)
        return 0;
      return this.#nextAction.pos - this.pos;
    }
    get dposPrev() {
      if (!this.#prevAction)
        return 0;
      return this.pos - this.#prevAction.pos;
    }
    clerpAt(at) {
      if (at === this.at)
        return this.pos;
      if (at < this.at) {
        if (!this.#prevAction)
          return this.pos;
        return clamplerp(at, this.#prevAction.at, this.at, this.#prevAction.pos, this.pos);
      }
      if (at > this.at) {
        if (!this.#nextAction)
          return this.pos;
        return clamplerp(at, this.at, this.#nextAction.at, this.pos, this.#nextAction.pos);
      }
      return this.pos;
    }
    static jsonOrder = { at: undefined, pos: undefined };
    static cloneList(list, extras) {
      const parent = extras?.parent === true ? list[0]?.parent : extras?.parent;
      const newList = list.map((e) => new FunAction(e, { parent }));
      return FunAction.linkList(newList, extras);
    }
    toJSON() {
      return orderTrimJson({
        ...this,
        at: +this.at.toFixed(1),
        pos: +this.pos.toFixed(1)
      }, FunAction.jsonOrder, {});
    }
    clone() {
      return new FunAction(this, { parent: this.#parent });
    }
  }

  class FunChapter {
    name = "";
    startTime = "00:00:00.000";
    endTime = "00:00:00.000";
    constructor(chapter) {
      this.name = chapter?.name ?? "";
      this.startTime = chapter?.startTime ?? "00:00:00.000";
      this.endTime = chapter?.endTime ?? "00:00:00.000";
    }
    get startAt() {
      return timeSpanToMs(this.startTime);
    }
    set startAt(v) {
      this.startTime = msToTimeSpan(v);
    }
    get endAt() {
      return timeSpanToMs(this.endTime);
    }
    set endAt(v) {
      this.endTime = msToTimeSpan(v);
    }
    static jsonOrder = { startTime: undefined, endTime: undefined, name: undefined };
    toJSON() {
      return orderTrimJson(this, FunChapter.jsonOrder, {
        name: ""
      });
    }
  }

  class FunBookmark {
    name = "";
    time = "00:00:00.000";
    constructor(bookmark) {
      this.name = bookmark?.name ?? "";
      this.time = bookmark?.time ?? "00:00:00.000";
    }
    get startAt() {
      return timeSpanToMs(this.time);
    }
    set startAt(v) {
      this.time = msToTimeSpan(v);
    }
    static jsonOrder = { time: undefined, name: undefined };
    toJSON() {
      return orderTrimJson(this, FunBookmark.jsonOrder, {
        name: ""
      });
    }
  }

  class FunMetadata {
    duration = 0;
    chapters = [];
    bookmarks = [];
    constructor(metadata, parent) {
      Object.assign(this, metadata);
      if (metadata?.bookmarks)
        this.bookmarks = metadata.bookmarks.map((e) => new FunBookmark(e));
      if (metadata?.chapters)
        this.chapters = metadata.chapters.map((e) => new FunChapter(e));
      if (metadata?.duration)
        this.duration = metadata.duration;
      if (this.duration > 3600) {
        const actionsDuration = parent?.actionsDuraction;
        if (actionsDuration && actionsDuration < 500 * this.duration) {
          this.duration /= 1000;
        }
      }
    }
    static emptyJson = {
      bookmarks: [],
      chapters: [],
      creator: "",
      description: "",
      license: "",
      notes: "",
      performers: [],
      script_url: "",
      tags: [],
      title: "",
      type: "basic",
      video_url: ""
    };
    static jsonOrder = {
      title: undefined,
      creator: undefined,
      description: undefined,
      duration: undefined,
      chapters: undefined,
      bookmarks: undefined
    };
    toJSON() {
      return orderTrimJson({
        ...this,
        duration: +this.duration.toFixed(3)
      }, FunMetadata.jsonOrder, FunMetadata.emptyJson);
    }
    clone() {
      const clonedData = JSON.parse(JSON.stringify(this.toJSON()));
      return new FunMetadata(clonedData);
    }
  }

  class FunscriptFile {
    axisName = "";
    title = "";
    dir = "";
    constructor(filePath) {
      let parts = filePath.split(".");
      if (parts.at(-1) === "funscript")
        parts.pop();
      const axisLike = parts.at(-1);
      if (axisLikes.includes(axisLike)) {
        this.axisName = parts.pop();
      }
      filePath = parts.join(".");
      parts = filePath.split(/[\\/]/);
      this.title = parts.pop();
      this.dir = filePath.slice(0, -this.title.length);
    }
    get id() {
      return !this.axisName ? "L0" : axisLikeToAxis(this.axisName);
    }
    get filePath() {
      return `${this.dir}${this.title}${this.axisName ? `.${this.axisName}` : ""}.funscript`;
    }
    clone() {
      return new FunscriptFile(this.filePath);
    }
  }

  class Funscript {
    static svgDefaultOptions = svgDefaultOptions;
    static toSvgElement(scripts, ops) {
      return toSvgElement(scripts, ops);
    }
    static mergeMultiAxis(scripts) {
      const multiaxisScripts = scripts.filter((e) => e.axes.length);
      const singleaxisScripts = scripts.filter((e) => !e.axes.length);
      const groups = Object.groupBy(singleaxisScripts, (e) => e.#file?.title ?? "[unnamed]");
      const mergedSingleaxisScripts = Object.entries(groups).flatMap(([_title, scripts2]) => {
        if (!scripts2)
          return [];
        const allScripts = scripts2.flatMap((e) => [e, ...e.axes]);
        const axes = [...new Set(allScripts.map((e) => e.id))];
        if (axes.length === allScripts.length) {
          const L0 = allScripts.find((e) => e.id === "L0");
          if (!L0)
            throw new Error("Funscript.mergeMultiAxis: L0 is not defined");
          const base = L0.clone();
          base.axes = allScripts.sort(orderByAxis).filter((e) => e.id !== "L0").map((e) => new AxisScript(e, { parent: base }));
          return base;
        }
        throw new Error("Funscript.mergeMultiAxis: multi-axis scripts are not implemented yet");
      });
      return [...multiaxisScripts, ...mergedSingleaxisScripts];
    }
    id = "L0";
    actions = [];
    axes = [];
    metadata = new FunMetadata;
    #parent;
    #file;
    constructor(funscript, extras) {
      Object.assign(this, funscript);
      if (extras?.file)
        this.#file = new FunscriptFile(extras.file);
      else if (funscript instanceof Funscript)
        this.#file = funscript.#file?.clone();
      this.id = extras?.id ?? this.#file?.id ?? funscript?.id ?? "L0";
      if (funscript?.actions) {
        this.actions = FunAction.cloneList(funscript.actions, { parent: this });
      }
      if (funscript?.metadata !== undefined)
        this.metadata = new FunMetadata(funscript.metadata, this);
      else if (funscript instanceof Funscript)
        this.#file = funscript.#file?.clone();
      if (extras?.axes) {
        if (funscript?.axes?.length)
          throw new Error("FunFunscript: both axes and axes are defined");
        this.axes = extras.axes.map((e) => new AxisScript(e, { parent: this })).sort(orderByAxis);
      } else if (funscript?.axes) {
        this.axes = funscript.axes.map((e) => new AxisScript(e, { parent: this })).sort(orderByAxis);
      }
      if (extras?.parent)
        this.#parent = extras.parent;
    }
    get parent() {
      return this.#parent;
    }
    set parent(v) {
      this.#parent = v;
    }
    get file() {
      return this.#file;
    }
    get duration() {
      if (this.metadata.duration)
        return this.metadata.duration;
      return Math.max(this.actions.at(-1)?.at ?? 0, ...this.axes.map((e) => e.actions.at(-1)?.at ?? 0)) / 1000;
    }
    get actionsDuraction() {
      return Math.max(this.actions.at(-1)?.at ?? 0, ...this.axes.map((e) => e.actions.at(-1)?.at ?? 0)) / 1000;
    }
    get actualDuration() {
      if (!this.metadata.duration)
        return this.actionsDuraction;
      const actionsDuraction = this.actionsDuraction;
      const metadataDuration = this.metadata.duration;
      if (actionsDuraction > metadataDuration)
        return actionsDuraction;
      if (actionsDuraction * 3 < metadataDuration)
        return actionsDuraction;
      return metadataDuration;
    }
    toStats() {
      const MaxSpeed = actionsRequiredMaxSpeed(this.actions);
      const AvgSpeed = actionsAverageSpeed(this.actions);
      return {
        Duration: secondsToDuration(this.actualDuration),
        Actions: this.actions.filter((e) => e.isPeak).length,
        MaxSpeed: Math.round(MaxSpeed),
        AvgSpeed: Math.round(AvgSpeed)
      };
    }
    toSvgElement(ops = {}) {
      return toSvgElement([this], { ...ops });
    }
    normalize() {
      this.axes.forEach((e) => e.normalize());
      this.actions.forEach((e) => {
        e.at = Math.round(e.at) || 0;
        e.pos = clamp2(Math.round(e.pos) || 0, 0, 100);
      });
      this.actions.sort((a, b) => a.at - b.at);
      this.actions = this.actions.filter((e, i, a) => {
        if (!i)
          return true;
        return a[i - 1].at < e.at;
      });
      const negativeActions = this.actions.filter((e) => e.at < 0);
      if (negativeActions.length) {
        this.actions = this.actions.filter((e) => e.at >= 0);
        if (this.actions[0]?.at > 0) {
          const lastNegative = negativeActions.at(-1);
          lastNegative.at = 0;
          this.actions.unshift(lastNegative);
        }
      }
      FunAction.linkList(this.actions, { parent: this });
      const duration = Math.ceil(this.actualDuration);
      this.metadata.duration = duration;
      this.axes.forEach((e) => e.metadata.duration = duration);
      return this;
    }
    getAxes() {
      return [this, ...this.axes].sort(orderByAxis);
    }
    #searchActionIndex = -1;
    getActionAfter(at) {
      const isTarget = (e) => (!e.nextAction || e.at > at) && (!e.prevAction || e.prevAction.at <= at);
      const AROUND_LOOKUP = 5;
      for (let di = -AROUND_LOOKUP;di <= AROUND_LOOKUP; di++) {
        const index = this.#searchActionIndex + di;
        if (!this.actions[index])
          continue;
        if (isTarget(this.actions[index])) {
          this.#searchActionIndex = index;
          break;
        }
      }
      if (!isTarget(this.actions[this.#searchActionIndex])) {
        this.#searchActionIndex = this.actions.findIndex(isTarget);
      }
      return this.actions[this.#searchActionIndex];
    }
    getPosAt(at) {
      const action = this.getActionAfter(at);
      if (!action)
        return 50;
      return action.clerpAt(at);
    }
    getAxesPosAt(at) {
      return Object.fromEntries(this.getAxes().map((e) => [e.id, e.getPosAt(at)]));
    }
    getTCodeAt(at) {
      const apos = this.getAxesPosAt(at);
      const tcode = Object.entries(apos).map(([axis, pos]) => [axis, pos]);
      return TCodeList.from(tcode);
    }
    getTCodeFrom(at, since) {
      at = ~~at;
      since = since && ~~since;
      const tcode = [];
      for (const a of this.getAxes()) {
        const nextAction = a.getActionAfter(at);
        if (!nextAction)
          continue;
        if (since === undefined) {
          if (nextAction.at <= at)
            tcode.push([a.id, nextAction.pos]);
          else
            tcode.push([a.id, nextAction.pos, "I", nextAction.at - at]);
          continue;
        }
        if (nextAction.at <= at)
          continue;
        const prevAt = nextAction.prevAction?.at ?? 0;
        if (prevAt <= since)
          continue;
        tcode.push([a.id, nextAction.pos, "I", nextAction.at - at]);
      }
      return TCodeList.from(tcode);
    }
    static emptyJson = {
      axes: [],
      metadata: {},
      inverted: false,
      range: 100,
      version: "1.0"
    };
    static jsonOrder = {
      id: undefined,
      metadata: undefined,
      actions: undefined,
      axes: undefined
    };
    toJSON() {
      return orderTrimJson({
        ...this,
        axes: this.axes.slice().sort(orderByAxis).map((e) => ({ ...e.toJSON(), metadata: undefined })),
        metadata: {
          ...this.metadata.toJSON(),
          duration: +this.duration.toFixed(3)
        }
      }, Funscript.jsonOrder, Funscript.emptyJson);
    }
    toJsonText(options) {
      return formatJson(JSON.stringify(this, null, 2), options ?? {});
    }
    clone() {
      const clone = new Funscript(this);
      clone.#file = this.#file?.clone();
      return clone;
    }
  }

  class AxisScript extends Funscript {
    constructor(funscript, extras) {
      super(funscript, extras);
      if (!this.id)
        throw new Error("AxisScript: axis is not defined");
      if (!this.parent)
        throw new Error("AxisScript: parent is not defined");
    }
  }

  // src/canvas.ts
  function lerp3(min, max, t) {
    return min + t * (max - min);
  }
  function drawFunscriptGraph(ctx, funscript, options = {}) {
    ctx = ctx instanceof HTMLCanvasElement ? ctx.getContext("2d") : ctx;
    const { width = ctx.canvas.width, height = ctx.canvas.height } = options;
    const { atStart = 0, atEnd = funscript.actualDuration * 1000, lineWidth = 1 } = options;
    const { xScale = width / (atEnd - atStart), yScale = height / 100 } = options;
    const { currentTime } = options;
    ctx.lineWidth = lineWidth;
    const speedLines = [];
    for (const a of funscript.actions) {
      (speedLines[~~Math.abs(a.speedFrom)] ??= []).push(a);
    }
    for (let speed = 0;speed < speedLines.length; speed++) {
      const lines = speedLines[speed];
      if (!lines)
        continue;
      ctx.strokeStyle = speedToOklchText(speed);
      ctx.beginPath();
      for (const l of lines) {
        if (!l.nextAction)
          continue;
        ctx.moveTo((l.at - atStart) * xScale, (100 - l.pos) * yScale);
        ctx.lineTo((l.nextAction.at - atStart) * xScale, (100 - l.nextAction.pos) * yScale);
      }
      ctx.stroke();
    }
    if (currentTime !== undefined) {
      const timeX = (currentTime - atStart) * xScale;
      if (timeX >= 0 && timeX <= width) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(timeX, 0);
        ctx.lineTo(timeX, height);
        ctx.stroke();
      }
    }
  }
  function makeGradient(ctx, funscript, options = {}) {
    const { width = ctx.canvas.width } = options;
    const durationMs = funscript.actualDuration * 1000;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    if (durationMs <= 0 || funscript.actions.length === 0) {
      gradient.addColorStop(0, speedToOklchText(0));
      gradient.addColorStop(1, speedToOklchText(0));
      return gradient;
    }
    const lines = actionsToLines(actionsToZigzag(funscript.actions)).flatMap((e) => {
      const [a, b, s] = e;
      const len = b.at - a.at;
      if (len <= 0)
        return [];
      const N = Math.max(1, Math.floor((len - 500) / 1000));
      if (N === 1 || len < 2000)
        return [e];
      return Array.from({ length: N }, (_, i) => [
        new FunAction({ at: lerp3(a.at, b.at, i / N), pos: lerp3(a.pos, b.pos, i / N) }),
        new FunAction({ at: lerp3(a.at, b.at, (i + 1) / N), pos: lerp3(a.pos, b.pos, (i + 1) / N) }),
        s
      ]);
    });
    for (let i = 0;i < lines.length - 1; i++) {
      const [a, b, ab_speed] = lines[i];
      const [c, d, cd_speed] = lines[i + 1];
      const combinedDuration = d.at - a.at;
      if (combinedDuration < 1000 && combinedDuration > 0) {
        const duration1 = b.at - a.at;
        const duration2 = d.at - c.at;
        const mergedSpeed = (ab_speed * duration1 + cd_speed * duration2) / combinedDuration;
        lines.splice(i, 2, [a, d, mergedSpeed]);
        i--;
      }
    }
    let stops = [];
    if (lines.length > 0) {
      stops = lines.map(([a, b, speed]) => ({
        at: (a.at + b.at) / 2,
        speed
      }));
      const first = lines[0];
      const last = lines.at(-1);
      stops.push({ at: first[0].at, speed: first[2] });
      stops.push({ at: last[1].at, speed: last[2] });
      if (first[0].at > 0) {
        stops.push({ at: 0, speed: first[0].at > 100 ? 0 : first[2] });
      }
      if (last[1].at < durationMs) {
        stops.push({ at: durationMs, speed: durationMs - last[1].at > 100 ? 0 : last[2] });
      }
    } else {
      stops = [{ at: 0, speed: 0 }, { at: durationMs, speed: 0 }];
    }
    stops.sort((a, b) => a.at - b.at);
    stops = stops.filter((stop, index, arr) => index === 0 || stop.at > arr[index - 1].at);
    stops = stops.filter((e, i, a) => {
      const p = a[i - 1];
      const n = a[i + 1];
      if (!p || !n)
        return true;
      return p.speed !== e.speed || e.speed !== n.speed;
    });
    if (!stops.some((s) => s.at === 0)) {
      stops.push({ at: 0, speed: stops[0]?.speed ?? 0 });
    }
    if (!stops.some((s) => s.at === durationMs)) {
      stops.push({ at: durationMs, speed: stops.at(-1)?.speed ?? 0 });
    }
    stops.sort((a, b) => a.at - b.at);
    stops = stops.filter((stop, index, arr) => index === 0 || stop.at > arr[index - 1].at);
    for (const stop of stops) {
      const offset = Math.max(0, Math.min(1, stop.at / durationMs));
      const color = speedToOklchText(stop.speed);
      if (!Number.isNaN(offset)) {
        gradient.addColorStop(offset, color);
      }
    }
    return gradient;
  }
  var canvasDefaultOptions = {
    titleFont: "14px Consolas",
    statFont: "bold 12px Consolas",
    axisFont: "bold 25px Consolas",
    textColor: "black",
    lineWidth: 0.5,
    borderWidth: 0.2,
    borderColor: "#ccc",
    midBorderX: 0,
    midBorderY: 0,
    outerBorder: 2,
    bgOpacity: 0.2,
    headerOpacity: 0.7,
    axisCells: 1,
    scriptSpacing: 4,
    normalize: true
  };
  function drawFunscriptsCanvas(target, scripts, options = {}) {
    const fullOps = { ...canvasDefaultOptions, ...options };
    const {
      lineWidth,
      borderWidth,
      borderColor,
      midBorderX,
      midBorderY,
      outerBorder,
      bgOpacity,
      headerOpacity,
      scriptSpacing,
      normalize,
      titleFont,
      statFont,
      axisFont,
      textColor
    } = fullOps;
    if (typeof document === "undefined") {
      console.error("Canvas creation/manipulation requires a browser environment.");
      return null;
    }
    const AXIS_WIDTH = 46 - midBorderX;
    const TITLE_HEIGHT = 20;
    const GRAPH_HEIGHT = 32;
    const TOTAL_WIDTH = 686 + outerBorder * 2;
    const SCRIPT_BLOCK_HEIGHT = TITLE_HEIGHT + midBorderY + GRAPH_HEIGHT;
    let calculatedHeight = outerBorder;
    for (const script of scripts) {
      const numBlocks = 1 + script.axes.length;
      calculatedHeight += numBlocks * (SCRIPT_BLOCK_HEIGHT + midBorderY + outerBorder * 2);
      calculatedHeight += (numBlocks - 1) * scriptSpacing;
      calculatedHeight += scriptSpacing;
    }
    calculatedHeight = calculatedHeight - scriptSpacing + outerBorder;
    let canvas;
    if (target instanceof HTMLCanvasElement) {
      canvas = target;
    } else if (target instanceof CanvasRenderingContext2D) {
      canvas = target.canvas;
    } else {
      canvas = document.createElement("canvas");
    }
    canvas.width = TOTAL_WIDTH;
    canvas.height = calculatedHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context from canvas.");
      return canvas;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    let currentY = outerBorder;
    for (const script of scripts) {
      const scriptsToDraw = [script, ...script.axes];
      for (const s of scriptsToDraw) {
        const scriptToDraw = normalize ? s.clone().normalize() : s.clone();
        const isForHandy = "_isForHandy" in scriptToDraw && scriptToDraw._isForHandy;
        let title = scriptToDraw.file?.filePath ?? "";
        if (!title && scriptToDraw.parent?.file) {
          title = `${scriptToDraw.parent.file.filePath}::${axisToName(scriptToDraw.id)}`;
        } else if (!title) {
          title = `Script ${scriptToDraw.id ?? "L0"}`;
        }
        let axis = scriptToDraw.id ?? "L0";
        if (isForHandy)
          axis = "☞";
        const stats = scriptToDraw.toStats();
        const axisArea = { x: 0, y: TITLE_HEIGHT + midBorderY, width: AXIS_WIDTH, height: GRAPH_HEIGHT };
        const titleArea = { x: AXIS_WIDTH + midBorderX, y: 0, width: TOTAL_WIDTH - axisArea.width - midBorderX, height: TITLE_HEIGHT };
        const graphArea = { x: titleArea.x, y: axisArea.y, width: titleArea.width, height: GRAPH_HEIGHT };
        const axisTitleArea = { x: 0, y: 0, width: AXIS_WIDTH, height: TITLE_HEIGHT + midBorderY + GRAPH_HEIGHT };
        ctx.save();
        ctx.translate(outerBorder, currentY);
        ctx.globalAlpha = bgOpacity;
        const avgSpeedColor = speedToOklchText(stats.AvgSpeed);
        ctx.fillStyle = avgSpeedColor;
        ctx.globalAlpha = headerOpacity * Math.max(0.5, Math.min(1, stats.AvgSpeed / 100));
        ctx.fillRect(axisArea.x, axisArea.y, axisArea.width, axisArea.height);
        const gradient = makeGradient(ctx, scriptToDraw, { width: graphArea.width });
        ctx.fillStyle = gradient;
        ctx.globalAlpha = headerOpacity;
        ctx.fillRect(titleArea.x, titleArea.y, titleArea.width, titleArea.height);
        ctx.globalAlpha = bgOpacity;
        ctx.fillRect(graphArea.x, graphArea.y, graphArea.width, graphArea.height);
        ctx.globalAlpha = 1;
        ctx.save();
        ctx.translate(graphArea.x, graphArea.y);
        ctx.beginPath();
        ctx.rect(0, 0, graphArea.width, graphArea.height);
        ctx.clip();
        drawFunscriptGraph(ctx, scriptToDraw, {
          width: graphArea.width,
          height: graphArea.height,
          lineWidth
        });
        ctx.restore();
        ctx.fillStyle = textColor;
        ctx.font = axisFont;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(axis, axisTitleArea.x + axisTitleArea.width / 2, axisTitleArea.y + axisTitleArea.height / 2 + 2);
        ctx.font = titleFont;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const maxTitleWidth = titleArea.width - 5;
        const truncatedTitle = ctx.measureText(title).width > maxTitleWidth ? title.substring(0, 50) + "..." : title;
        ctx.fillText(truncatedTitle, titleArea.x + 3, titleArea.y + titleArea.height / 2);
        ctx.font = statFont;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        const statEntries = Object.entries(stats).reverse();
        const statSpacing = 46;
        for (let i = 0;i < statEntries.length; i++) {
          const [key, value] = statEntries[i];
          const statX = titleArea.x + titleArea.width - i * statSpacing - 3;
          ctx.fillText(String(value), statX, titleArea.y + titleArea.height - 2);
          ctx.save();
          ctx.font = "bold 8px Consolas";
          ctx.textBaseline = "top";
          ctx.fillText(key, statX, titleArea.y + 2);
          ctx.restore();
        }
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(axisArea.x, axisArea.y, axisArea.width, axisArea.height);
        ctx.strokeRect(titleArea.x, titleArea.y, titleArea.width, titleArea.height);
        ctx.strokeRect(graphArea.x, graphArea.y, graphArea.width, graphArea.height);
        if (TITLE_HEIGHT > 0 && AXIS_WIDTH > 0) {
          ctx.strokeRect(axisTitleArea.x, axisTitleArea.y, axisTitleArea.width, TITLE_HEIGHT);
        }
        ctx.restore();
        currentY += SCRIPT_BLOCK_HEIGHT + midBorderY + outerBorder * 2 + scriptSpacing;
      }
      currentY -= scriptSpacing;
    }
    ctx.restore();
    return canvas;
  }

  // src/player.ts
  class Ticker {
    ontick = () => {};
    constructor(ontick) {
      this.ontick = ontick ?? (() => {});
    }
    #interval = 0;
    async tick() {
      try {
        await this.ontick();
      } catch (e) {
        console.error(e);
      }
    }
    async start() {
      if (this.#interval)
        clearInterval(this.#interval);
      let int = this.#interval = +setInterval(() => this.tick);
      while (true) {
        await new Promise(requestAnimationFrame);
        if (this.#interval !== int)
          break;
        clearInterval(this.#interval);
        int = this.#interval = +setInterval(() => this.tick);
        this.tick();
      }
    }
    async stop() {
      if (this.#interval)
        clearInterval(this.#interval);
      this.#interval = 0;
    }
  }

  class TCodePlayer {
    video;
    funscript;
    ticker;
    constructor(video, funscript) {
      this.video = video;
      this.funscript = funscript;
      this.ticker = new Ticker;
    }
    port;
    writer;
    async requestPort(disconnect = false) {
      if (this.port && !disconnect)
        return;
      if (disconnect) {
        this.port?.close();
        this.port = undefined;
        this.writer?.close();
        this.writer = undefined;
      }
      this.port = await navigator.serial.requestPort();
      this.port.ondisconnect = () => {
        this.port?.close();
        this.port = undefined;
        this.writer?.close();
        this.writer = undefined;
      };
      await this.port.open({ baudRate: 115200 });
      const encoder = new TextEncoderStream;
      encoder.readable.pipeTo(this.port.writable);
      this.writer = encoder.writable.getWriter();
    }
    write(output) {
      output = output.replaceAll("_", "");
      if (!output.trim())
        return;
      console.log("TCodePlayer: Writing", JSON.stringify(output));
      this.writer?.write(output);
    }
    run() {
      this.ticker.ontick = () => {
        const tcode = this.tCodeForState();
        if (tcode) {
          this.write(tcode);
        }
      };
      this.ticker.start();
    }
    stop() {
      this.ticker.stop();
    }
    tcodeOptions = { format: true, precision: 2 };
    prevState = { paused: true, currentTime: 0, seeking: false };
    tCodeForState() {
      if (!this.video || !this.funscript)
        return "";
      const { paused, currentTime, seeking } = this.video;
      const at = currentTime * 1000;
      let tcode = "";
      if (seeking) {
        tcode = this.funscript.getTCodeAt(at).toString(this.tcodeOptions);
        if (!paused) {
          tcode = tcode.slice(0, -1) + " ";
          tcode += this.funscript.getTCodeFrom(at).toString(this.tcodeOptions);
        }
      } else if (!this.prevState.paused && paused) {
        tcode = this.funscript.getTCodeAt(at).toString(this.tcodeOptions);
      } else if (this.prevState.paused && !paused) {
        tcode = this.funscript.getTCodeFrom(at).toString(this.tcodeOptions);
      } else if (!paused) {
        tcode = this.funscript.getTCodeFrom(at, this.prevState.currentTime * 1000).toString(this.tcodeOptions);
      }
      this.prevState = { paused, currentTime, seeking };
      return tcode;
    }
  }

  // src/iife.ts
  Object.assign(window, {
    Fun: {
      ...exports_src,
      TCodePlayer,
      drawFunscriptGraph,
      makeGradient,
      drawFunscriptsCanvas
    }
  });
})();








})();