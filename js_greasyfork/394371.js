// ==UserScript==
// @name          koolside
// @namespace     https://github.com/toriato/koolside
// @version       1.0.0
// @author        Sangha Lee
// @description   디시인사이드 도우미
// @include       https://*.dcinside.com/*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/394371/koolside.user.js
// @updateURL https://update.greasyfork.org/scripts/394371/koolside.meta.js
// ==/UserScript==
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/decode-uri-component/index.js":
/*!****************************************************!*\
  !*** ./node_modules/decode-uri-component/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var token = '%[a-f0-9]{2}';
var singleMatcher = new RegExp(token, 'gi');
var multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
	try {
		// Try to decode the entire string first
		return decodeURIComponent(components.join(''));
	} catch (err) {
		// Do nothing
	}

	if (components.length === 1) {
		return components;
	}

	split = split || 1;

	// Split the array in 2 parts
	var left = components.slice(0, split);
	var right = components.slice(split);

	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
	try {
		return decodeURIComponent(input);
	} catch (err) {
		var tokens = input.match(singleMatcher);

		for (var i = 1; i < tokens.length; i++) {
			input = decodeComponents(tokens, i).join('');

			tokens = input.match(singleMatcher);
		}

		return input;
	}
}

function customDecodeURIComponent(input) {
	// Keep track of all the replacements and prefill the map with the `BOM`
	var replaceMap = {
		'%FE%FF': '\uFFFD\uFFFD',
		'%FF%FE': '\uFFFD\uFFFD'
	};

	var match = multiMatcher.exec(input);
	while (match) {
		try {
			// Decode as big chunks as possible
			replaceMap[match[0]] = decodeURIComponent(match[0]);
		} catch (err) {
			var result = decode(match[0]);

			if (result !== match[0]) {
				replaceMap[match[0]] = result;
			}
		}

		match = multiMatcher.exec(input);
	}

	// Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
	replaceMap['%C2'] = '\uFFFD';

	var entries = Object.keys(replaceMap);

	for (var i = 0; i < entries.length; i++) {
		// Replace all decoded components
		var key = entries[i];
		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
	}

	return input;
}

module.exports = function (encodedURI) {
	if (typeof encodedURI !== 'string') {
		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
	}

	try {
		encodedURI = encodedURI.replace(/\+/g, ' ');

		// Try the built in decoder first
		return decodeURIComponent(encodedURI);
	} catch (err) {
		// Fallback to a more advanced decoder
		return customDecodeURIComponent(encodedURI);
	}
};


/***/ }),

/***/ "./node_modules/dot-prop/index.js":
/*!****************************************!*\
  !*** ./node_modules/dot-prop/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const isObj = __webpack_require__(/*! is-obj */ "./node_modules/is-obj/index.js");

const disallowedKeys = [
	'__proto__',
	'prototype',
	'constructor'
];

const isValidPath = pathSegments => !pathSegments.some(segment => disallowedKeys.includes(segment));

function getPathSegments(path) {
	const pathArray = path.split('.');
	const parts = [];

	for (let i = 0; i < pathArray.length; i++) {
		let p = pathArray[i];

		while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
			p = p.slice(0, -1) + '.';
			p += pathArray[++i];
		}

		parts.push(p);
	}

	if (!isValidPath(parts)) {
		return [];
	}

	return parts;
}

module.exports = {
	get(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return value === undefined ? object : value;
		}

		const pathArray = getPathSegments(path);
		if (pathArray.length === 0) {
			return;
		}

		for (let i = 0; i < pathArray.length; i++) {
			if (!Object.prototype.propertyIsEnumerable.call(object, pathArray[i])) {
				return value;
			}

			object = object[pathArray[i]];

			if (object === undefined || object === null) {
				// `object` is either `undefined` or `null` so we want to stop the loop, and
				// if this is not the last bit of the path, and
				// if it did't return `undefined`
				// it would return `null` if `object` is `null`
				// but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
				if (i !== pathArray.length - 1) {
					return value;
				}

				break;
			}
		}

		return object;
	},

	set(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return object;
		}

		const root = object;
		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (!isObj(object[p])) {
				object[p] = {};
			}

			if (i === pathArray.length - 1) {
				object[p] = value;
			}

			object = object[p];
		}

		return root;
	},

	delete(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return;
		}

		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (i === pathArray.length - 1) {
				delete object[p];
				return;
			}

			object = object[p];

			if (!isObj(object)) {
				return;
			}
		}
	},

	has(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return false;
		}

		const pathArray = getPathSegments(path);
		if (pathArray.length === 0) {
			return false;
		}

		// eslint-disable-next-line unicorn/no-for-loop
		for (let i = 0; i < pathArray.length; i++) {
			if (isObj(object)) {
				if (!(pathArray[i] in object)) {
					return false;
				}

				object = object[pathArray[i]];
			} else {
				return false;
			}
		}

		return true;
	}
};


/***/ }),

/***/ "./node_modules/is-obj/index.js":
/*!**************************************!*\
  !*** ./node_modules/is-obj/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = value => {
	const type = typeof value;
	return value !== null && (type === 'object' || type === 'function');
};


/***/ }),

/***/ "./node_modules/p-limit/index.js":
/*!***************************************!*\
  !*** ./node_modules/p-limit/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const pTry = __webpack_require__(/*! p-try */ "./node_modules/p-try/index.js");

const pLimit = concurrency => {
	if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) {
		return Promise.reject(new TypeError('Expected `concurrency` to be a number from 1 and up'));
	}

	const queue = [];
	let activeCount = 0;

	const next = () => {
		activeCount--;

		if (queue.length > 0) {
			queue.shift()();
		}
	};

	const run = (fn, resolve, ...args) => {
		activeCount++;

		const result = pTry(fn, ...args);

		resolve(result);

		result.then(next, next);
	};

	const enqueue = (fn, resolve, ...args) => {
		if (activeCount < concurrency) {
			run(fn, resolve, ...args);
		} else {
			queue.push(run.bind(null, fn, resolve, ...args));
		}
	};

	const generator = (fn, ...args) => new Promise(resolve => enqueue(fn, resolve, ...args));
	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount
		},
		pendingCount: {
			get: () => queue.length
		}
	});

	return generator;
};

module.exports = pLimit;
module.exports.default = pLimit;


/***/ }),

/***/ "./node_modules/p-try/index.js":
/*!*************************************!*\
  !*** ./node_modules/p-try/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const pTry = (fn, ...arguments_) => new Promise(resolve => {
	resolve(fn(...arguments_));
});

module.exports = pTry;
// TODO: remove this in the next major version
module.exports.default = pTry;


/***/ }),

/***/ "./node_modules/query-string/index.js":
/*!********************************************!*\
  !*** ./node_modules/query-string/index.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const strictUriEncode = __webpack_require__(/*! strict-uri-encode */ "./node_modules/strict-uri-encode/index.js");
const decodeComponent = __webpack_require__(/*! decode-uri-component */ "./node_modules/decode-uri-component/index.js");
const splitOnFirst = __webpack_require__(/*! split-on-first */ "./node_modules/split-on-first/index.js");

function encoderForArrayFormat(options) {
	switch (options.arrayFormat) {
		case 'index':
			return key => (result, value) => {
				const index = result.length;
				if (value === undefined || (options.skipNull && value === null)) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[', index, ']'].join('')];
				}

				return [
					...result,
					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
				];
			};

		case 'bracket':
			return key => (result, value) => {
				if (value === undefined || (options.skipNull && value === null)) {
					return result;
				}

				if (value === null) {
					return [...result, [encode(key, options), '[]'].join('')];
				}

				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
			};

		case 'comma':
			return key => (result, value) => {
				if (value === null || value === undefined || value.length === 0) {
					return result;
				}

				if (result.length === 0) {
					return [[encode(key, options), '=', encode(value, options)].join('')];
				}

				return [[result, encode(value, options)].join(',')];
			};

		default:
			return key => (result, value) => {
				if (value === undefined || (options.skipNull && value === null)) {
					return result;
				}

				if (value === null) {
					return [...result, encode(key, options)];
				}

				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
			};
	}
}

function parserForArrayFormat(options) {
	let result;

	switch (options.arrayFormat) {
		case 'index':
			return (key, value, accumulator) => {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return (key, value, accumulator) => {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		case 'comma':
			return (key, value, accumulator) => {
				const isArray = typeof value === 'string' && value.split('').indexOf(',') > -1;
				const newValue = isArray ? value.split(',') : value;
				accumulator[key] = newValue;
			};

		default:
			return (key, value, accumulator) => {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, options) {
	if (options.encode) {
		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function decode(value, options) {
	if (options.decode) {
		return decodeComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	}

	if (typeof input === 'object') {
		return keysSorter(Object.keys(input))
			.sort((a, b) => Number(a) - Number(b))
			.map(key => input[key]);
	}

	return input;
}

function removeHash(input) {
	const hashStart = input.indexOf('#');
	if (hashStart !== -1) {
		input = input.slice(0, hashStart);
	}

	return input;
}

function extract(input) {
	input = removeHash(input);
	const queryStart = input.indexOf('?');
	if (queryStart === -1) {
		return '';
	}

	return input.slice(queryStart + 1);
}

function parseValue(value, options) {
	if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === 'string' && value.trim() !== '')) {
		value = Number(value);
	} else if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
		value = value.toLowerCase() === 'true';
	}

	return value;
}

function parse(input, options) {
	options = Object.assign({
		decode: true,
		sort: true,
		arrayFormat: 'none',
		parseNumbers: false,
		parseBooleans: false
	}, options);

	const formatter = parserForArrayFormat(options);

	// Create an object with no prototype
	const ret = Object.create(null);

	if (typeof input !== 'string') {
		return ret;
	}

	input = input.trim().replace(/^[?#&]/, '');

	if (!input) {
		return ret;
	}

	for (const param of input.split('&')) {
		let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, ' ') : param, '=');

		// Missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		value = value === undefined ? null : decode(value, options);
		formatter(decode(key, options), value, ret);
	}

	for (const key of Object.keys(ret)) {
		const value = ret[key];
		if (typeof value === 'object' && value !== null) {
			for (const k of Object.keys(value)) {
				value[k] = parseValue(value[k], options);
			}
		} else {
			ret[key] = parseValue(value, options);
		}
	}

	if (options.sort === false) {
		return ret;
	}

	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
		const value = ret[key];
		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
			// Sort object keys, not values
			result[key] = keysSorter(value);
		} else {
			result[key] = value;
		}

		return result;
	}, Object.create(null));
}

exports.extract = extract;
exports.parse = parse;

exports.stringify = (object, options) => {
	if (!object) {
		return '';
	}

	options = Object.assign({
		encode: true,
		strict: true,
		arrayFormat: 'none'
	}, options);

	const formatter = encoderForArrayFormat(options);

	const objectCopy = Object.assign({}, object);
	if (options.skipNull) {
		for (const key of Object.keys(objectCopy)) {
			if (objectCopy[key] === undefined || objectCopy[key] === null) {
				delete objectCopy[key];
			}
		}
	}

	const keys = Object.keys(objectCopy);

	if (options.sort !== false) {
		keys.sort(options.sort);
	}

	return keys.map(key => {
		const value = object[key];

		if (value === undefined) {
			return '';
		}

		if (value === null) {
			return encode(key, options);
		}

		if (Array.isArray(value)) {
			return value
				.reduce(formatter(key), [])
				.join('&');
		}

		return encode(key, options) + '=' + encode(value, options);
	}).filter(x => x.length > 0).join('&');
};

exports.parseUrl = (input, options) => {
	return {
		url: removeHash(input).split('?')[0] || '',
		query: parse(extract(input), options)
	};
};


/***/ }),

/***/ "./node_modules/split-on-first/index.js":
/*!**********************************************!*\
  !*** ./node_modules/split-on-first/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = (string, separator) => {
	if (!(typeof string === 'string' && typeof separator === 'string')) {
		throw new TypeError('Expected the arguments to be of type `string`');
	}

	if (separator === '') {
		return [string];
	}

	const separatorIndex = string.indexOf(separator);

	if (separatorIndex === -1) {
		return [string];
	}

	return [
		string.slice(0, separatorIndex),
		string.slice(separatorIndex + separator.length)
	];
};


/***/ }),

/***/ "./node_modules/strict-uri-encode/index.js":
/*!*************************************************!*\
  !*** ./node_modules/strict-uri-encode/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);


/***/ }),

/***/ "./node_modules/wait-for-the-element/waitForTheElement.js":
/*!****************************************************************!*\
  !*** ./node_modules/wait-for-the-element/waitForTheElement.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?t(exports):undefined}(this,function(e){"use strict";function c(e,t){var n=e.type,r=e.target,o=e.addedNodes;if("attributes"===n&&r.matches(t))return r;if("childList"!==n)return null;for(var i=0,u=o;i<u.length;i+=1){var a=u[i];if("function"==typeof a.matches&&a.matches(t))return a}return r.querySelector(t)}function n(a,e){void 0===e&&(e={});var n=e.timeout;void 0===n&&(n=2500);var r=e.scope;return void 0===r&&(r=document),new Promise(function(o,e){var t=r.querySelector(a),i=null;if(null===t){var u=new MutationObserver(function(e){for(var t=0,n=e;t<n.length;t+=1){var r=c(n[t],a);if(null!==r){clearTimeout(i),u.disconnect(),o(r);break}}});u.observe(r,{attributes:!0,subtree:!0,childList:!0}),i=setTimeout(function(){u.disconnect(),e(new Error("No element matches the selector "+a+"."))},n)}else o(t)})}var t={waitForTheElement:n,tryAndWaitForTheElement:function(e,t){return n(e,t).catch(function(){return null})}},r=t.waitForTheElement,o=t.tryAndWaitForTheElement;e.default=t,e.tryAndWaitForTheElement=o,e.waitForTheElement=r,Object.defineProperty(e,"__esModule",{value:!0})});


/***/ }),

/***/ "./src/includes/cache.ts":
/*!*******************************!*\
  !*** ./src/includes/cache.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(/*! ./utils */ "./src/includes/utils.ts");
const static_1 = __webpack_require__(/*! ./static */ "./src/includes/static.ts");
const request_1 = __importDefault(__webpack_require__(/*! ./request */ "./src/includes/request.ts"));
class Cache extends Map {
    async fetchPost(gallery, no) {
        const url = `https://m.dcinside.com/board/${gallery}/${no}`;
        const res = await request_1.default({
            url,
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.114 Mobile Safari/537.36'
            }
        });
        // body 태그 속만 불러오기
        const matches = res.responseText.match(static_1.REGEX_BODY);
        const $ = utils_1.createElement(matches.groups.body).parentNode;
        // 필요없는 태그 제거하기
        const content = $.querySelector('.thum-txtin');
        const query = '*:not(img):not(iframe):not(br):empty';
        for (let e of content.querySelectorAll(query)) {
            e.remove();
        }
        // 모든 이미지 원본 주소로 변환하기
        for (let img of content.querySelectorAll('img')) {
            const src = img.dataset.original || img.src;
            while (img.attributes.length) {
                img.removeAttribute(img.attributes[0].name);
            }
            img.src = src;
        }
        // 캐싱하기
        this.set(no, content);
        return content;
    }
    fetchPosts(gallery, posts) {
        return posts.map(no => this.fetchPost(gallery, no));
    }
}
const cache = new Cache();
exports.default = cache;


/***/ }),

/***/ "./src/includes/config.ts":
/*!********************************!*\
  !*** ./src/includes/config.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = __importDefault(__webpack_require__(/*! ./storage */ "./src/includes/storage.ts"));
const config = new storage_1.default('config', {
    defaultValue: {
        hide: {
            logo: true,
            title: true,
            titlebar: true,
            right: {
                all: true,
                login: true,
                recommend: true,
                issuezoom: true,
                news: true,
                realtime: true,
                hit: true,
                sec_recommend: true,
                wiki: true
            }
        }
    },
    onSync() {
        const classes = [];
        const config = this.export();
        if (config.hide.logo)
            classes.push('ks-hide-logo');
        if (config.hide.title)
            classes.push('ks-hide-title');
        if (config.hide.titlebar)
            classes.push('ks-hide-titlebar');
        if (config.hide.right.all) {
            classes.push('ks-hide-right');
        }
        else {
            if (config.hide.right.login)
                classes.push('ks-hide-right-login');
            if (config.hide.right.recommend)
                classes.push('ks-hide-right-recommend');
            if (config.hide.right.issuezoom)
                classes.push('ks-hide-right-issuezoom');
            if (config.hide.right.news)
                classes.push('ks-hide-right-news');
            if (config.hide.right.realtime)
                classes.push('ks-hide-right-realtime');
            if (config.hideElhideement.right.hit)
                classes.push('ks-hide-right-hit');
            if (config.hide.right.sec_recommend)
                classes.push('ks-hide-right-sec-recommend');
            if (config.hide.right.wiki)
                classes.push('ks-hide-right-wiki');
        }
        document.body.setAttribute('class', classes.join(' '));
    }
});
exports.default = config;


/***/ }),

/***/ "./src/includes/request.ts":
/*!*********************************!*\
  !*** ./src/includes/request.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = __importDefault(__webpack_require__(/*! ./cache */ "./src/includes/cache.ts"));
const utils_1 = __webpack_require__(/*! ./utils */ "./src/includes/utils.ts");
const static_1 = __webpack_require__(/*! ./static */ "./src/includes/static.ts");
function request(opts) {
    return new Promise((resolve, reject) => {
        opts.method = opts.method || 'GET';
        const clonedOpts = {
            ...opts,
            onload: res => {
                if (opts.onload) {
                    opts.onload(res);
                }
                if (res.readyState !== 4) {
                    return;
                }
                resolve(res);
            },
            onerror: res => {
                if (opts.onerror) {
                    opts.onerror(res);
                }
                const e = new Error('placeholder request error');
                reject(e);
            }
        };
        GM_xmlhttpRequest(clonedOpts);
    });
}
exports.default = request;
async function fetchList(gallery) {
    const res = await request({
        url: location.href
    });
    // body 태그 속만 불러오기
    const matches = res.responseText.match(static_1.REGEX_BODY);
    const $ = utils_1.createElement(matches.groups.body).parentNode;
    // 필요없는 글은 삭제하기
    const addedPosts = $.querySelectorAll('.us-post');
    const tbody = document.querySelector('.gall_list tbody');
    const numbers = [];
    for (let post of addedPosts) {
        switch (true) {
            case post.dataset.type === 'icon_notice':
                continue;
        }
        const no = parseInt(post.dataset.no, 10);
        // 기존 글 댓글 수, 조회 수 등 업데이트
        const cached = document.querySelector(`.us-post[data-no="${post.dataset.no}"]`);
        if (cached) {
            cached.innerHTML = post.innerHTML;
        }
        // 캐시되지 않은 글이라면 캐시하기 추가하기
        if (!cache_1.default.has(no)) {
            cache_1.default.fetchPost(gallery, no);
            post.classList.add('ks-new');
            tbody.prepend(post);
        }
        numbers.push(no);
    }
    const lowest = Math.min(...numbers);
    for (let post of document.querySelectorAll('.us-post')) {
        const no = parseInt(post.dataset.no, 10);
        if (no < lowest) {
            break;
        }
        if (!numbers.includes(no)) {
            post.classList.add('ks-deleted');
        }
    }
}
exports.fetchList = fetchList;


/***/ }),

/***/ "./src/includes/static.ts":
/*!********************************!*\
  !*** ./src/includes/static.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.REGEX_BODY = /(?<body><body[^>]*>((.|[\n\r])*)<\/body>)/im;
exports.STYLESHEET = `
<style>
  /* 기능 */
  body.ks-hide-logo .dc_logo { opacity: 0 }
  body.ks-hide-title .left_content header { display: none }
  body.ks-hide-titlebar .left_content article:nth-child(2) { display: none }
  
  body.ks-hide-right .left_content {
    float: none;
    width: 100%;
  }
  body.ks-hide-right .issuebox { width: 100% }
  body.ks-hide-right .minor_intro_box { width: calc(100% - 155px) }
  body.ks-hide-right .visit_history { width: 100%; box-sizing: border-box }
  body.ks-hide-right .list_array_option { width: 100% }
  body.ks-hide-right .right_content { display: none }
  body.ks-hide-right .stickyunit { display: none }
  body.ks-hide-right-login .login_box { display: none }
  body.ks-hide-right-recommend .r_recommend { display: none }
  body.ks-hide-right-issuezoom .r_issuezoom { display: none }
  body.ks-hide-right-news .r_news { display: none }
  body.ks-hide-right-realtime .r_realtime_issue { display: none }
  body.ks-hide-right-hit .r_hit { display: none }
  body.ks-hide-right-sec-recommend .r_sec_recommend { display: none }
  body.ks-hide-right-wiki .r_wiki { display: none }
  /* 글꼴 */
  body, .gall_list,
  button, input, select, table,
  textarea { font-family: '맑은 고딕', sans-serif }
  /* 앱 */
  body.ks-prevent-scrolling {
    overflow: hidden;
    height: 100%;
  }
  .ks-preview {
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    overflow-y: auto;
    transition: opacity .25s;
    display: none;
    padding: 1em;
    max-width: 500px;
    max-height: 250px;
    opacity: 0;
    background: black;
    box-shadow: 0 0 5px black;
    border-radius: 5px;
    color: white;
  }
  .ks-preview.active {
    display: inline-block;
    opacity: .85;
  }
  .ks-preview img {
    max-width: 100%;
    max-height: 200px;
    cursor: pointer;
  }
  .ks-preview img.active {
    max-height: 100%;
  }
  .us-post.ks-new {
    animation-name: ks-new;
    animation-duration: .5s;
  }
  .us-post.ks-deleted {
    background: rgb(240, 100, 100)
  }
  @keyframes ks-new {
    from {
      transform: scaleY(0);
      max-height: 0;
      background: rgba(240, 100, 100, 1);
    }
    to {
      transform: scaleY(1);
      max-height: 100%;
      background: rgba(240, 100, 100, 0);
    }
  }
</style>
`;


/***/ }),

/***/ "./src/includes/storage.ts":
/*!*********************************!*\
  !*** ./src/includes/storage.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dot_prop_1 = __importDefault(__webpack_require__(/*! dot-prop */ "./node_modules/dot-prop/index.js"));
class Storage {
    constructor(key, opts) {
        this.key = key;
        this.opts = opts;
        this.storage = GM_getValue(key, opts.defaultValue);
    }
    sync() {
        GM_setValue(this.key, this.storage);
        if (this.opts.onSync) {
            this.opts.onSync.apply(this);
        }
    }
    get(key) {
        return dot_prop_1.default.get(this.storage, key);
    }
    set(key, value) {
        dot_prop_1.default.set(this.storage, key, value);
        this.sync();
    }
    export() {
        return this.storage;
    }
    import(value) {
        this.storage = value;
        this.sync();
    }
}
exports.default = Storage;


/***/ }),

/***/ "./src/includes/utils.ts":
/*!*******************************!*\
  !*** ./src/includes/utils.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_string_1 = __importDefault(__webpack_require__(/*! query-string */ "./node_modules/query-string/index.js"));
function createElement(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}
exports.createElement = createElement;
function getParameter(key) {
    const params = query_string_1.default.parse(location.search);
    return params[key];
}
exports.getParameter = getParameter;
// eslint-disable-next-line
// export interface LooseObject<T = any> {
//   [k: string]: T;
// }


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p_limit_1 = __importDefault(__webpack_require__(/*! p-limit */ "./node_modules/p-limit/index.js"));
const wait_for_the_element_1 = __webpack_require__(/*! wait-for-the-element */ "./node_modules/wait-for-the-element/waitForTheElement.js");
const request_1 = __webpack_require__(/*! ./includes/request */ "./src/includes/request.ts");
const utils_1 = __webpack_require__(/*! ./includes/utils */ "./src/includes/utils.ts");
const cache_1 = __importDefault(__webpack_require__(/*! ./includes/cache */ "./src/includes/cache.ts"));
const static_1 = __webpack_require__(/*! ./includes/static */ "./src/includes/static.ts");
const config_1 = __importDefault(__webpack_require__(/*! ./includes/config */ "./src/includes/config.ts"));
const gallery = utils_1.getParameter('id');
async function main() {
    // 설정 맞추기
    config_1.default.sync();
    // 앱에서 사용할 요소와 스타일 시트 추가하기
    const stylesheet = utils_1.createElement(static_1.STYLESHEET);
    const preview = utils_1.createElement('<div class="ks-preview"></div>');
    function onMouseEvent(e) {
        let el = e.target;
        // 게시글 목록 요소인지 확인하기
        while (el !== null) {
            // 프리뷰 객체라면 프리뷰 박스 내에서 스크롤 해야하므로 무시하기
            if (el === preview) {
                document.body.classList.add('ks-prevent-scrolling');
                break;
            }
            else {
                document.body.classList.remove('ks-prevent-scrolling');
            }
            if (el.classList && el.classList.contains('us-post')) {
                break;
            }
            el = el.parentNode;
        }
        if (el) {
            // 현재 프리뷰가 선택한 게시글이 아니라면 업데이트하기
            if (preview.dataset.no !== el.dataset.no) {
                const scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
                const clientTop = document.body.clientTop || document.documentElement.clientTop || 0;
                const rect = el.getBoundingClientRect();
                const top = rect.top + scrollTop - clientTop;
                preview.style.top = `${top}px`;
                preview.style.left = `${e.pageX + 25}px`;
                preview.dataset.no = el.dataset.no;
                preview.innerHTML = cache_1.default.get(parseInt(el.dataset.no, 10)).innerHTML;
                preview.classList.add('active');
                for (let img of preview.querySelectorAll('img')) {
                    img.addEventListener('click', function () {
                        this.classList.toggle('active');
                    });
                }
            }
        }
        else {
            // 프리뷰 박스 초기화
            preview.classList.remove('active');
            preview.innerHTML = '';
            delete preview.dataset.no;
        }
    }
    document.head.append(stylesheet);
    document.body.prepend(preview);
    document.addEventListener('mousemove', onMouseEvent);
    // document.addEventListener('mousewheel', onMouseEvent)
    // document.addEventListener('DOMMouseScroll', onMouseEvent) // for our firefox friends :)
    const promises = [];
    const limit = p_limit_1.default(10);
    for (let el of document.querySelectorAll('.us-post')) {
        // 번호 없는 글은 무시하기
        if (!el.dataset.no) {
            console.log(el);
            continue;
        }
        // 공지 게시글은 무시하기
        if (el.dataset.type === 'icon_notice') {
            continue;
        }
        const no = parseInt(el.dataset.no, 10);
        try {
            const promise = limit(() => cache_1.default.fetchPost(gallery, no));
            promises.push(promise);
        }
        catch (e) {
            console.error(e);
        }
    }
    // 현재 불러온 게시글 전체 캐싱하기
    await Promise.all(promises);
    // 게시글 실시간 업데이트 시작하기
    setInterval(() => request_1.fetchList(gallery), 1000);
}
// 최상단 페이지에서만 스크립트 실행하기
if (window.top === window.self) {
    // 갤러리 테이블 요소 대기 후 main() 실행하기
    wait_for_the_element_1.tryAndWaitForTheElement('.copyright')
        .catch(() => console.error('페이지에서 게시글 테이블 요소를 불러올 수 없습니다'))
        .then(() => main())
        .catch(console.error);
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2RlY29kZS11cmktY29tcG9uZW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kb3QtcHJvcC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaXMtb2JqL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wLWxpbWl0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wLXRyeS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcXVlcnktc3RyaW5nL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zcGxpdC1vbi1maXJzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3RyaWN0LXVyaS1lbmNvZGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dhaXQtZm9yLXRoZS1lbGVtZW50L3dhaXRGb3JUaGVFbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9pbmNsdWRlcy9jYWNoZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5jbHVkZXMvY29uZmlnLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmNsdWRlcy9yZXF1ZXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9pbmNsdWRlcy9zdGF0aWMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luY2x1ZGVzL3N0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luY2x1ZGVzL3V0aWxzLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7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QztBQUVELHVCQUF1QjtBQUN2QixJQUFJLE1BQU0sQ0FBQyxHQUFHLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRTtJQUU5Qiw4QkFBOEI7SUFDOUIsOENBQXVCLENBQUMsWUFBWSxDQUFDO1NBQ2xDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDhCQUE4QixDQUFDLENBQUM7U0FDMUQsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2xCLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0NBQ3hCIiwiZmlsZSI6ImxpYi51c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9rZW4gPSAnJVthLWYwLTldezJ9JztcbnZhciBzaW5nbGVNYXRjaGVyID0gbmV3IFJlZ0V4cCh0b2tlbiwgJ2dpJyk7XG52YXIgbXVsdGlNYXRjaGVyID0gbmV3IFJlZ0V4cCgnKCcgKyB0b2tlbiArICcpKycsICdnaScpO1xuXG5mdW5jdGlvbiBkZWNvZGVDb21wb25lbnRzKGNvbXBvbmVudHMsIHNwbGl0KSB7XG5cdHRyeSB7XG5cdFx0Ly8gVHJ5IHRvIGRlY29kZSB0aGUgZW50aXJlIHN0cmluZyBmaXJzdFxuXHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoY29tcG9uZW50cy5qb2luKCcnKSk7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIERvIG5vdGhpbmdcblx0fVxuXG5cdGlmIChjb21wb25lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHRcdHJldHVybiBjb21wb25lbnRzO1xuXHR9XG5cblx0c3BsaXQgPSBzcGxpdCB8fCAxO1xuXG5cdC8vIFNwbGl0IHRoZSBhcnJheSBpbiAyIHBhcnRzXG5cdHZhciBsZWZ0ID0gY29tcG9uZW50cy5zbGljZSgwLCBzcGxpdCk7XG5cdHZhciByaWdodCA9IGNvbXBvbmVudHMuc2xpY2Uoc3BsaXQpO1xuXG5cdHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmNhbGwoW10sIGRlY29kZUNvbXBvbmVudHMobGVmdCksIGRlY29kZUNvbXBvbmVudHMocmlnaHQpKTtcbn1cblxuZnVuY3Rpb24gZGVjb2RlKGlucHV0KSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChpbnB1dCk7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdHZhciB0b2tlbnMgPSBpbnB1dC5tYXRjaChzaW5nbGVNYXRjaGVyKTtcblxuXHRcdGZvciAodmFyIGkgPSAxOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpbnB1dCA9IGRlY29kZUNvbXBvbmVudHModG9rZW5zLCBpKS5qb2luKCcnKTtcblxuXHRcdFx0dG9rZW5zID0gaW5wdXQubWF0Y2goc2luZ2xlTWF0Y2hlcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGlucHV0O1xuXHR9XG59XG5cbmZ1bmN0aW9uIGN1c3RvbURlY29kZVVSSUNvbXBvbmVudChpbnB1dCkge1xuXHQvLyBLZWVwIHRyYWNrIG9mIGFsbCB0aGUgcmVwbGFjZW1lbnRzIGFuZCBwcmVmaWxsIHRoZSBtYXAgd2l0aCB0aGUgYEJPTWBcblx0dmFyIHJlcGxhY2VNYXAgPSB7XG5cdFx0JyVGRSVGRic6ICdcXHVGRkZEXFx1RkZGRCcsXG5cdFx0JyVGRiVGRSc6ICdcXHVGRkZEXFx1RkZGRCdcblx0fTtcblxuXHR2YXIgbWF0Y2ggPSBtdWx0aU1hdGNoZXIuZXhlYyhpbnB1dCk7XG5cdHdoaWxlIChtYXRjaCkge1xuXHRcdHRyeSB7XG5cdFx0XHQvLyBEZWNvZGUgYXMgYmlnIGNodW5rcyBhcyBwb3NzaWJsZVxuXHRcdFx0cmVwbGFjZU1hcFttYXRjaFswXV0gPSBkZWNvZGVVUklDb21wb25lbnQobWF0Y2hbMF0pO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0dmFyIHJlc3VsdCA9IGRlY29kZShtYXRjaFswXSk7XG5cblx0XHRcdGlmIChyZXN1bHQgIT09IG1hdGNoWzBdKSB7XG5cdFx0XHRcdHJlcGxhY2VNYXBbbWF0Y2hbMF1dID0gcmVzdWx0O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdG1hdGNoID0gbXVsdGlNYXRjaGVyLmV4ZWMoaW5wdXQpO1xuXHR9XG5cblx0Ly8gQWRkIGAlQzJgIGF0IHRoZSBlbmQgb2YgdGhlIG1hcCB0byBtYWtlIHN1cmUgaXQgZG9lcyBub3QgcmVwbGFjZSB0aGUgY29tYmluYXRvciBiZWZvcmUgZXZlcnl0aGluZyBlbHNlXG5cdHJlcGxhY2VNYXBbJyVDMiddID0gJ1xcdUZGRkQnO1xuXG5cdHZhciBlbnRyaWVzID0gT2JqZWN0LmtleXMocmVwbGFjZU1hcCk7XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Ly8gUmVwbGFjZSBhbGwgZGVjb2RlZCBjb21wb25lbnRzXG5cdFx0dmFyIGtleSA9IGVudHJpZXNbaV07XG5cdFx0aW5wdXQgPSBpbnB1dC5yZXBsYWNlKG5ldyBSZWdFeHAoa2V5LCAnZycpLCByZXBsYWNlTWFwW2tleV0pO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChlbmNvZGVkVVJJKSB7XG5cdGlmICh0eXBlb2YgZW5jb2RlZFVSSSAhPT0gJ3N0cmluZycpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBgZW5jb2RlZFVSSWAgdG8gYmUgb2YgdHlwZSBgc3RyaW5nYCwgZ290IGAnICsgdHlwZW9mIGVuY29kZWRVUkkgKyAnYCcpO1xuXHR9XG5cblx0dHJ5IHtcblx0XHRlbmNvZGVkVVJJID0gZW5jb2RlZFVSSS5yZXBsYWNlKC9cXCsvZywgJyAnKTtcblxuXHRcdC8vIFRyeSB0aGUgYnVpbHQgaW4gZGVjb2RlciBmaXJzdFxuXHRcdHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZW5jb2RlZFVSSSk7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIEZhbGxiYWNrIHRvIGEgbW9yZSBhZHZhbmNlZCBkZWNvZGVyXG5cdFx0cmV0dXJuIGN1c3RvbURlY29kZVVSSUNvbXBvbmVudChlbmNvZGVkVVJJKTtcblx0fVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGlzT2JqID0gcmVxdWlyZSgnaXMtb2JqJyk7XG5cbmNvbnN0IGRpc2FsbG93ZWRLZXlzID0gW1xuXHQnX19wcm90b19fJyxcblx0J3Byb3RvdHlwZScsXG5cdCdjb25zdHJ1Y3Rvcidcbl07XG5cbmNvbnN0IGlzVmFsaWRQYXRoID0gcGF0aFNlZ21lbnRzID0+ICFwYXRoU2VnbWVudHMuc29tZShzZWdtZW50ID0+IGRpc2FsbG93ZWRLZXlzLmluY2x1ZGVzKHNlZ21lbnQpKTtcblxuZnVuY3Rpb24gZ2V0UGF0aFNlZ21lbnRzKHBhdGgpIHtcblx0Y29uc3QgcGF0aEFycmF5ID0gcGF0aC5zcGxpdCgnLicpO1xuXHRjb25zdCBwYXJ0cyA9IFtdO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0bGV0IHAgPSBwYXRoQXJyYXlbaV07XG5cblx0XHR3aGlsZSAocFtwLmxlbmd0aCAtIDFdID09PSAnXFxcXCcgJiYgcGF0aEFycmF5W2kgKyAxXSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRwID0gcC5zbGljZSgwLCAtMSkgKyAnLic7XG5cdFx0XHRwICs9IHBhdGhBcnJheVsrK2ldO1xuXHRcdH1cblxuXHRcdHBhcnRzLnB1c2gocCk7XG5cdH1cblxuXHRpZiAoIWlzVmFsaWRQYXRoKHBhcnRzKSkge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdHJldHVybiBwYXJ0cztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGdldChvYmplY3QsIHBhdGgsIHZhbHVlKSB7XG5cdFx0aWYgKCFpc09iaihvYmplY3QpIHx8IHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyBvYmplY3QgOiB2YWx1ZTtcblx0XHR9XG5cblx0XHRjb25zdCBwYXRoQXJyYXkgPSBnZXRQYXRoU2VnbWVudHMocGF0aCk7XG5cdFx0aWYgKHBhdGhBcnJheS5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBhdGhBcnJheS5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKCFPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwob2JqZWN0LCBwYXRoQXJyYXlbaV0pKSB7XG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0b2JqZWN0ID0gb2JqZWN0W3BhdGhBcnJheVtpXV07XG5cblx0XHRcdGlmIChvYmplY3QgPT09IHVuZGVmaW5lZCB8fCBvYmplY3QgPT09IG51bGwpIHtcblx0XHRcdFx0Ly8gYG9iamVjdGAgaXMgZWl0aGVyIGB1bmRlZmluZWRgIG9yIGBudWxsYCBzbyB3ZSB3YW50IHRvIHN0b3AgdGhlIGxvb3AsIGFuZFxuXHRcdFx0XHQvLyBpZiB0aGlzIGlzIG5vdCB0aGUgbGFzdCBiaXQgb2YgdGhlIHBhdGgsIGFuZFxuXHRcdFx0XHQvLyBpZiBpdCBkaWQndCByZXR1cm4gYHVuZGVmaW5lZGBcblx0XHRcdFx0Ly8gaXQgd291bGQgcmV0dXJuIGBudWxsYCBpZiBgb2JqZWN0YCBpcyBgbnVsbGBcblx0XHRcdFx0Ly8gYnV0IHdlIHdhbnQgYGdldCh7Zm9vOiBudWxsfSwgJ2Zvby5iYXInKWAgdG8gZXF1YWwgYHVuZGVmaW5lZGAsIG9yIHRoZSBzdXBwbGllZCB2YWx1ZSwgbm90IGBudWxsYFxuXHRcdFx0XHRpZiAoaSAhPT0gcGF0aEFycmF5Lmxlbmd0aCAtIDEpIHtcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gb2JqZWN0O1xuXHR9LFxuXG5cdHNldChvYmplY3QsIHBhdGgsIHZhbHVlKSB7XG5cdFx0aWYgKCFpc09iaihvYmplY3QpIHx8IHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIG9iamVjdDtcblx0XHR9XG5cblx0XHRjb25zdCByb290ID0gb2JqZWN0O1xuXHRcdGNvbnN0IHBhdGhBcnJheSA9IGdldFBhdGhTZWdtZW50cyhwYXRoKTtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb25zdCBwID0gcGF0aEFycmF5W2ldO1xuXG5cdFx0XHRpZiAoIWlzT2JqKG9iamVjdFtwXSkpIHtcblx0XHRcdFx0b2JqZWN0W3BdID0ge307XG5cdFx0XHR9XG5cblx0XHRcdGlmIChpID09PSBwYXRoQXJyYXkubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRvYmplY3RbcF0gPSB2YWx1ZTtcblx0XHRcdH1cblxuXHRcdFx0b2JqZWN0ID0gb2JqZWN0W3BdO1xuXHRcdH1cblxuXHRcdHJldHVybiByb290O1xuXHR9LFxuXG5cdGRlbGV0ZShvYmplY3QsIHBhdGgpIHtcblx0XHRpZiAoIWlzT2JqKG9iamVjdCkgfHwgdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgcGF0aEFycmF5ID0gZ2V0UGF0aFNlZ21lbnRzKHBhdGgpO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoQXJyYXkubGVuZ3RoOyBpKyspIHtcblx0XHRcdGNvbnN0IHAgPSBwYXRoQXJyYXlbaV07XG5cblx0XHRcdGlmIChpID09PSBwYXRoQXJyYXkubGVuZ3RoIC0gMSkge1xuXHRcdFx0XHRkZWxldGUgb2JqZWN0W3BdO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdG9iamVjdCA9IG9iamVjdFtwXTtcblxuXHRcdFx0aWYgKCFpc09iaihvYmplY3QpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0aGFzKG9iamVjdCwgcGF0aCkge1xuXHRcdGlmICghaXNPYmoob2JqZWN0KSB8fCB0eXBlb2YgcGF0aCAhPT0gJ3N0cmluZycpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRjb25zdCBwYXRoQXJyYXkgPSBnZXRQYXRoU2VnbWVudHMocGF0aCk7XG5cdFx0aWYgKHBhdGhBcnJheS5sZW5ndGggPT09IDApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1mb3ItbG9vcFxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGF0aEFycmF5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAoaXNPYmoob2JqZWN0KSkge1xuXHRcdFx0XHRpZiAoIShwYXRoQXJyYXlbaV0gaW4gb2JqZWN0KSkge1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG9iamVjdCA9IG9iamVjdFtwYXRoQXJyYXlbaV1dO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlID0+IHtcblx0Y29uc3QgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcblx0cmV0dXJuIHZhbHVlICE9PSBudWxsICYmICh0eXBlID09PSAnb2JqZWN0JyB8fCB0eXBlID09PSAnZnVuY3Rpb24nKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBwVHJ5ID0gcmVxdWlyZSgncC10cnknKTtcblxuY29uc3QgcExpbWl0ID0gY29uY3VycmVuY3kgPT4ge1xuXHRpZiAoISgoTnVtYmVyLmlzSW50ZWdlcihjb25jdXJyZW5jeSkgfHwgY29uY3VycmVuY3kgPT09IEluZmluaXR5KSAmJiBjb25jdXJyZW5jeSA+IDApKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGBjb25jdXJyZW5jeWAgdG8gYmUgYSBudW1iZXIgZnJvbSAxIGFuZCB1cCcpKTtcblx0fVxuXG5cdGNvbnN0IHF1ZXVlID0gW107XG5cdGxldCBhY3RpdmVDb3VudCA9IDA7XG5cblx0Y29uc3QgbmV4dCA9ICgpID0+IHtcblx0XHRhY3RpdmVDb3VudC0tO1xuXG5cdFx0aWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcblx0XHRcdHF1ZXVlLnNoaWZ0KCkoKTtcblx0XHR9XG5cdH07XG5cblx0Y29uc3QgcnVuID0gKGZuLCByZXNvbHZlLCAuLi5hcmdzKSA9PiB7XG5cdFx0YWN0aXZlQ291bnQrKztcblxuXHRcdGNvbnN0IHJlc3VsdCA9IHBUcnkoZm4sIC4uLmFyZ3MpO1xuXG5cdFx0cmVzb2x2ZShyZXN1bHQpO1xuXG5cdFx0cmVzdWx0LnRoZW4obmV4dCwgbmV4dCk7XG5cdH07XG5cblx0Y29uc3QgZW5xdWV1ZSA9IChmbiwgcmVzb2x2ZSwgLi4uYXJncykgPT4ge1xuXHRcdGlmIChhY3RpdmVDb3VudCA8IGNvbmN1cnJlbmN5KSB7XG5cdFx0XHRydW4oZm4sIHJlc29sdmUsIC4uLmFyZ3MpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRxdWV1ZS5wdXNoKHJ1bi5iaW5kKG51bGwsIGZuLCByZXNvbHZlLCAuLi5hcmdzKSk7XG5cdFx0fVxuXHR9O1xuXG5cdGNvbnN0IGdlbmVyYXRvciA9IChmbiwgLi4uYXJncykgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBlbnF1ZXVlKGZuLCByZXNvbHZlLCAuLi5hcmdzKSk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGdlbmVyYXRvciwge1xuXHRcdGFjdGl2ZUNvdW50OiB7XG5cdFx0XHRnZXQ6ICgpID0+IGFjdGl2ZUNvdW50XG5cdFx0fSxcblx0XHRwZW5kaW5nQ291bnQ6IHtcblx0XHRcdGdldDogKCkgPT4gcXVldWUubGVuZ3RoXG5cdFx0fVxuXHR9KTtcblxuXHRyZXR1cm4gZ2VuZXJhdG9yO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwTGltaXQ7XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gcExpbWl0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBwVHJ5ID0gKGZuLCAuLi5hcmd1bWVudHNfKSA9PiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcblx0cmVzb2x2ZShmbiguLi5hcmd1bWVudHNfKSk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBwVHJ5O1xuLy8gVE9ETzogcmVtb3ZlIHRoaXMgaW4gdGhlIG5leHQgbWFqb3IgdmVyc2lvblxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IHBUcnk7XG4iLCIndXNlIHN0cmljdCc7XG5jb25zdCBzdHJpY3RVcmlFbmNvZGUgPSByZXF1aXJlKCdzdHJpY3QtdXJpLWVuY29kZScpO1xuY29uc3QgZGVjb2RlQ29tcG9uZW50ID0gcmVxdWlyZSgnZGVjb2RlLXVyaS1jb21wb25lbnQnKTtcbmNvbnN0IHNwbGl0T25GaXJzdCA9IHJlcXVpcmUoJ3NwbGl0LW9uLWZpcnN0Jyk7XG5cbmZ1bmN0aW9uIGVuY29kZXJGb3JBcnJheUZvcm1hdChvcHRpb25zKSB7XG5cdHN3aXRjaCAob3B0aW9ucy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzpcblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0Y29uc3QgaW5kZXggPSByZXN1bHQubGVuZ3RoO1xuXHRcdFx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCAob3B0aW9ucy5za2lwTnVsbCAmJiB2YWx1ZSA9PT0gbnVsbCkpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFsuLi5yZXN1bHQsIFtlbmNvZGUoa2V5LCBvcHRpb25zKSwgJ1snLCBpbmRleCwgJ10nXS5qb2luKCcnKV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdC4uLnJlc3VsdCxcblx0XHRcdFx0XHRbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbJywgZW5jb2RlKGluZGV4LCBvcHRpb25zKSwgJ109JywgZW5jb2RlKHZhbHVlLCBvcHRpb25zKV0uam9pbignJylcblx0XHRcdFx0XTtcblx0XHRcdH07XG5cblx0XHRjYXNlICdicmFja2V0Jzpcblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbLi4ucmVzdWx0LCBbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbXSddLmpvaW4oJycpXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbLi4ucmVzdWx0LCBbZW5jb2RlKGtleSwgb3B0aW9ucyksICdbXT0nLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKV07XG5cdFx0XHR9O1xuXG5cdFx0Y2FzZSAnY29tbWEnOlxuXHRcdFx0cmV0dXJuIGtleSA9PiAocmVzdWx0LCB2YWx1ZSkgPT4ge1xuXHRcdFx0XHRpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZS5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHJlc3VsdC5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gW1tlbmNvZGUoa2V5LCBvcHRpb25zKSwgJz0nLCBlbmNvZGUodmFsdWUsIG9wdGlvbnMpXS5qb2luKCcnKV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gW1tyZXN1bHQsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJywnKV07XG5cdFx0XHR9O1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBrZXkgPT4gKHJlc3VsdCwgdmFsdWUpID0+IHtcblx0XHRcdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgKG9wdGlvbnMuc2tpcE51bGwgJiYgdmFsdWUgPT09IG51bGwpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRcdHJldHVybiBbLi4ucmVzdWx0LCBlbmNvZGUoa2V5LCBvcHRpb25zKV07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gWy4uLnJlc3VsdCwgW2VuY29kZShrZXksIG9wdGlvbnMpLCAnPScsIGVuY29kZSh2YWx1ZSwgb3B0aW9ucyldLmpvaW4oJycpXTtcblx0XHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gcGFyc2VyRm9yQXJyYXlGb3JtYXQob3B0aW9ucykge1xuXHRsZXQgcmVzdWx0O1xuXG5cdHN3aXRjaCAob3B0aW9ucy5hcnJheUZvcm1hdCkge1xuXHRcdGNhc2UgJ2luZGV4Jzpcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0cmVzdWx0ID0gL1xcWyhcXGQqKVxcXSQvLmV4ZWMoa2V5KTtcblxuXHRcdFx0XHRrZXkgPSBrZXkucmVwbGFjZSgvXFxbXFxkKlxcXSQvLCAnJyk7XG5cblx0XHRcdFx0aWYgKCFyZXN1bHQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gdmFsdWU7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGFjY3VtdWxhdG9yW2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB7fTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFjY3VtdWxhdG9yW2tleV1bcmVzdWx0WzFdXSA9IHZhbHVlO1xuXHRcdFx0fTtcblxuXHRcdGNhc2UgJ2JyYWNrZXQnOlxuXHRcdFx0cmV0dXJuIChrZXksIHZhbHVlLCBhY2N1bXVsYXRvcikgPT4ge1xuXHRcdFx0XHRyZXN1bHQgPSAvKFxcW1xcXSkkLy5leGVjKGtleSk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9cXFtcXF0kLywgJycpO1xuXG5cdFx0XHRcdGlmICghcmVzdWx0KSB7XG5cdFx0XHRcdFx0YWNjdW11bGF0b3Jba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChhY2N1bXVsYXRvcltrZXldID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW3ZhbHVlXTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW10uY29uY2F0KGFjY3VtdWxhdG9yW2tleV0sIHZhbHVlKTtcblx0XHRcdH07XG5cblx0XHRjYXNlICdjb21tYSc6XG5cdFx0XHRyZXR1cm4gKGtleSwgdmFsdWUsIGFjY3VtdWxhdG9yKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGlzQXJyYXkgPSB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLnNwbGl0KCcnKS5pbmRleE9mKCcsJykgPiAtMTtcblx0XHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBpc0FycmF5ID8gdmFsdWUuc3BsaXQoJywnKSA6IHZhbHVlO1xuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gbmV3VmFsdWU7XG5cdFx0XHR9O1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiAoa2V5LCB2YWx1ZSwgYWNjdW11bGF0b3IpID0+IHtcblx0XHRcdFx0aWYgKGFjY3VtdWxhdG9yW2tleV0gPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGFjY3VtdWxhdG9yW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRhY2N1bXVsYXRvcltrZXldID0gW10uY29uY2F0KGFjY3VtdWxhdG9yW2tleV0sIHZhbHVlKTtcblx0XHRcdH07XG5cdH1cbn1cblxuZnVuY3Rpb24gZW5jb2RlKHZhbHVlLCBvcHRpb25zKSB7XG5cdGlmIChvcHRpb25zLmVuY29kZSkge1xuXHRcdHJldHVybiBvcHRpb25zLnN0cmljdCA/IHN0cmljdFVyaUVuY29kZSh2YWx1ZSkgOiBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBkZWNvZGUodmFsdWUsIG9wdGlvbnMpIHtcblx0aWYgKG9wdGlvbnMuZGVjb2RlKSB7XG5cdFx0cmV0dXJuIGRlY29kZUNvbXBvbmVudCh2YWx1ZSk7XG5cdH1cblxuXHRyZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGtleXNTb3J0ZXIoaW5wdXQpIHtcblx0aWYgKEFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XG5cdFx0cmV0dXJuIGlucHV0LnNvcnQoKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgaW5wdXQgPT09ICdvYmplY3QnKSB7XG5cdFx0cmV0dXJuIGtleXNTb3J0ZXIoT2JqZWN0LmtleXMoaW5wdXQpKVxuXHRcdFx0LnNvcnQoKGEsIGIpID0+IE51bWJlcihhKSAtIE51bWJlcihiKSlcblx0XHRcdC5tYXAoa2V5ID0+IGlucHV0W2tleV0pO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0O1xufVxuXG5mdW5jdGlvbiByZW1vdmVIYXNoKGlucHV0KSB7XG5cdGNvbnN0IGhhc2hTdGFydCA9IGlucHV0LmluZGV4T2YoJyMnKTtcblx0aWYgKGhhc2hTdGFydCAhPT0gLTEpIHtcblx0XHRpbnB1dCA9IGlucHV0LnNsaWNlKDAsIGhhc2hTdGFydCk7XG5cdH1cblxuXHRyZXR1cm4gaW5wdXQ7XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3QoaW5wdXQpIHtcblx0aW5wdXQgPSByZW1vdmVIYXNoKGlucHV0KTtcblx0Y29uc3QgcXVlcnlTdGFydCA9IGlucHV0LmluZGV4T2YoJz8nKTtcblx0aWYgKHF1ZXJ5U3RhcnQgPT09IC0xKSB7XG5cdFx0cmV0dXJuICcnO1xuXHR9XG5cblx0cmV0dXJuIGlucHV0LnNsaWNlKHF1ZXJ5U3RhcnQgKyAxKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWx1ZSwgb3B0aW9ucykge1xuXHRpZiAob3B0aW9ucy5wYXJzZU51bWJlcnMgJiYgIU51bWJlci5pc05hTihOdW1iZXIodmFsdWUpKSAmJiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS50cmltKCkgIT09ICcnKSkge1xuXHRcdHZhbHVlID0gTnVtYmVyKHZhbHVlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLnBhcnNlQm9vbGVhbnMgJiYgdmFsdWUgIT09IG51bGwgJiYgKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJyB8fCB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAnZmFsc2UnKSkge1xuXHRcdHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBwYXJzZShpbnB1dCwgb3B0aW9ucykge1xuXHRvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cdFx0ZGVjb2RlOiB0cnVlLFxuXHRcdHNvcnQ6IHRydWUsXG5cdFx0YXJyYXlGb3JtYXQ6ICdub25lJyxcblx0XHRwYXJzZU51bWJlcnM6IGZhbHNlLFxuXHRcdHBhcnNlQm9vbGVhbnM6IGZhbHNlXG5cdH0sIG9wdGlvbnMpO1xuXG5cdGNvbnN0IGZvcm1hdHRlciA9IHBhcnNlckZvckFycmF5Rm9ybWF0KG9wdGlvbnMpO1xuXG5cdC8vIENyZWF0ZSBhbiBvYmplY3Qgd2l0aCBubyBwcm90b3R5cGVcblx0Y29uc3QgcmV0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuXHRpZiAodHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJykge1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRpbnB1dCA9IGlucHV0LnRyaW0oKS5yZXBsYWNlKC9eWz8jJl0vLCAnJyk7XG5cblx0aWYgKCFpbnB1dCkge1xuXHRcdHJldHVybiByZXQ7XG5cdH1cblxuXHRmb3IgKGNvbnN0IHBhcmFtIG9mIGlucHV0LnNwbGl0KCcmJykpIHtcblx0XHRsZXQgW2tleSwgdmFsdWVdID0gc3BsaXRPbkZpcnN0KG9wdGlvbnMuZGVjb2RlID8gcGFyYW0ucmVwbGFjZSgvXFwrL2csICcgJykgOiBwYXJhbSwgJz0nKTtcblxuXHRcdC8vIE1pc3NpbmcgYD1gIHNob3VsZCBiZSBgbnVsbGA6XG5cdFx0Ly8gaHR0cDovL3czLm9yZy9UUi8yMDEyL1dELXVybC0yMDEyMDUyNC8jY29sbGVjdC11cmwtcGFyYW1ldGVyc1xuXHRcdHZhbHVlID0gdmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBkZWNvZGUodmFsdWUsIG9wdGlvbnMpO1xuXHRcdGZvcm1hdHRlcihkZWNvZGUoa2V5LCBvcHRpb25zKSwgdmFsdWUsIHJldCk7XG5cdH1cblxuXHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhyZXQpKSB7XG5cdFx0Y29uc3QgdmFsdWUgPSByZXRba2V5XTtcblx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuXHRcdFx0Zm9yIChjb25zdCBrIG9mIE9iamVjdC5rZXlzKHZhbHVlKSkge1xuXHRcdFx0XHR2YWx1ZVtrXSA9IHBhcnNlVmFsdWUodmFsdWVba10sIG9wdGlvbnMpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXRba2V5XSA9IHBhcnNlVmFsdWUodmFsdWUsIG9wdGlvbnMpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNvcnQgPT09IGZhbHNlKSB7XG5cdFx0cmV0dXJuIHJldDtcblx0fVxuXG5cdHJldHVybiAob3B0aW9ucy5zb3J0ID09PSB0cnVlID8gT2JqZWN0LmtleXMocmV0KS5zb3J0KCkgOiBPYmplY3Qua2V5cyhyZXQpLnNvcnQob3B0aW9ucy5zb3J0KSkucmVkdWNlKChyZXN1bHQsIGtleSkgPT4ge1xuXHRcdGNvbnN0IHZhbHVlID0gcmV0W2tleV07XG5cdFx0aWYgKEJvb2xlYW4odmFsdWUpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHQvLyBTb3J0IG9iamVjdCBrZXlzLCBub3QgdmFsdWVzXG5cdFx0XHRyZXN1bHRba2V5XSA9IGtleXNTb3J0ZXIodmFsdWUpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXN1bHRba2V5XSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sIE9iamVjdC5jcmVhdGUobnVsbCkpO1xufVxuXG5leHBvcnRzLmV4dHJhY3QgPSBleHRyYWN0O1xuZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuXG5leHBvcnRzLnN0cmluZ2lmeSA9IChvYmplY3QsIG9wdGlvbnMpID0+IHtcblx0aWYgKCFvYmplY3QpIHtcblx0XHRyZXR1cm4gJyc7XG5cdH1cblxuXHRvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG5cdFx0ZW5jb2RlOiB0cnVlLFxuXHRcdHN0cmljdDogdHJ1ZSxcblx0XHRhcnJheUZvcm1hdDogJ25vbmUnXG5cdH0sIG9wdGlvbnMpO1xuXG5cdGNvbnN0IGZvcm1hdHRlciA9IGVuY29kZXJGb3JBcnJheUZvcm1hdChvcHRpb25zKTtcblxuXHRjb25zdCBvYmplY3RDb3B5ID0gT2JqZWN0LmFzc2lnbih7fSwgb2JqZWN0KTtcblx0aWYgKG9wdGlvbnMuc2tpcE51bGwpIHtcblx0XHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmplY3RDb3B5KSkge1xuXHRcdFx0aWYgKG9iamVjdENvcHlba2V5XSA9PT0gdW5kZWZpbmVkIHx8IG9iamVjdENvcHlba2V5XSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkZWxldGUgb2JqZWN0Q29weVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3RDb3B5KTtcblxuXHRpZiAob3B0aW9ucy5zb3J0ICE9PSBmYWxzZSkge1xuXHRcdGtleXMuc29ydChvcHRpb25zLnNvcnQpO1xuXHR9XG5cblx0cmV0dXJuIGtleXMubWFwKGtleSA9PiB7XG5cdFx0Y29uc3QgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuXHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXG5cdFx0aWYgKHZhbHVlID09PSBudWxsKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKGtleSwgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRyZXR1cm4gdmFsdWVcblx0XHRcdFx0LnJlZHVjZShmb3JtYXR0ZXIoa2V5KSwgW10pXG5cdFx0XHRcdC5qb2luKCcmJyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVuY29kZShrZXksIG9wdGlvbnMpICsgJz0nICsgZW5jb2RlKHZhbHVlLCBvcHRpb25zKTtcblx0fSkuZmlsdGVyKHggPT4geC5sZW5ndGggPiAwKS5qb2luKCcmJyk7XG59O1xuXG5leHBvcnRzLnBhcnNlVXJsID0gKGlucHV0LCBvcHRpb25zKSA9PiB7XG5cdHJldHVybiB7XG5cdFx0dXJsOiByZW1vdmVIYXNoKGlucHV0KS5zcGxpdCgnPycpWzBdIHx8ICcnLFxuXHRcdHF1ZXJ5OiBwYXJzZShleHRyYWN0KGlucHV0KSwgb3B0aW9ucylcblx0fTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKHN0cmluZywgc2VwYXJhdG9yKSA9PiB7XG5cdGlmICghKHR5cGVvZiBzdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBzZXBhcmF0b3IgPT09ICdzdHJpbmcnKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHRoZSBhcmd1bWVudHMgdG8gYmUgb2YgdHlwZSBgc3RyaW5nYCcpO1xuXHR9XG5cblx0aWYgKHNlcGFyYXRvciA9PT0gJycpIHtcblx0XHRyZXR1cm4gW3N0cmluZ107XG5cdH1cblxuXHRjb25zdCBzZXBhcmF0b3JJbmRleCA9IHN0cmluZy5pbmRleE9mKHNlcGFyYXRvcik7XG5cblx0aWYgKHNlcGFyYXRvckluZGV4ID09PSAtMSkge1xuXHRcdHJldHVybiBbc3RyaW5nXTtcblx0fVxuXG5cdHJldHVybiBbXG5cdFx0c3RyaW5nLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KSxcblx0XHRzdHJpbmcuc2xpY2Uoc2VwYXJhdG9ySW5kZXggKyBzZXBhcmF0b3IubGVuZ3RoKVxuXHRdO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gc3RyID0+IGVuY29kZVVSSUNvbXBvbmVudChzdHIpLnJlcGxhY2UoL1shJygpKl0vZywgeCA9PiBgJSR7eC5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpfWApO1xuIiwiIWZ1bmN0aW9uKGUsdCl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/dChleHBvcnRzKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKFtcImV4cG9ydHNcIl0sdCk6dCgoZT1lfHxzZWxmKS53YWl0Rm9yVGhlRWxlbWVudD17fSl9KHRoaXMsZnVuY3Rpb24oZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYyhlLHQpe3ZhciBuPWUudHlwZSxyPWUudGFyZ2V0LG89ZS5hZGRlZE5vZGVzO2lmKFwiYXR0cmlidXRlc1wiPT09biYmci5tYXRjaGVzKHQpKXJldHVybiByO2lmKFwiY2hpbGRMaXN0XCIhPT1uKXJldHVybiBudWxsO2Zvcih2YXIgaT0wLHU9bztpPHUubGVuZ3RoO2krPTEpe3ZhciBhPXVbaV07aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgYS5tYXRjaGVzJiZhLm1hdGNoZXModCkpcmV0dXJuIGF9cmV0dXJuIHIucXVlcnlTZWxlY3Rvcih0KX1mdW5jdGlvbiBuKGEsZSl7dm9pZCAwPT09ZSYmKGU9e30pO3ZhciBuPWUudGltZW91dDt2b2lkIDA9PT1uJiYobj0yNTAwKTt2YXIgcj1lLnNjb3BlO3JldHVybiB2b2lkIDA9PT1yJiYocj1kb2N1bWVudCksbmV3IFByb21pc2UoZnVuY3Rpb24obyxlKXt2YXIgdD1yLnF1ZXJ5U2VsZWN0b3IoYSksaT1udWxsO2lmKG51bGw9PT10KXt2YXIgdT1uZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihlKXtmb3IodmFyIHQ9MCxuPWU7dDxuLmxlbmd0aDt0Kz0xKXt2YXIgcj1jKG5bdF0sYSk7aWYobnVsbCE9PXIpe2NsZWFyVGltZW91dChpKSx1LmRpc2Nvbm5lY3QoKSxvKHIpO2JyZWFrfX19KTt1Lm9ic2VydmUocix7YXR0cmlidXRlczohMCxzdWJ0cmVlOiEwLGNoaWxkTGlzdDohMH0pLGk9c2V0VGltZW91dChmdW5jdGlvbigpe3UuZGlzY29ubmVjdCgpLGUobmV3IEVycm9yKFwiTm8gZWxlbWVudCBtYXRjaGVzIHRoZSBzZWxlY3RvciBcIithK1wiLlwiKSl9LG4pfWVsc2Ugbyh0KX0pfXZhciB0PXt3YWl0Rm9yVGhlRWxlbWVudDpuLHRyeUFuZFdhaXRGb3JUaGVFbGVtZW50OmZ1bmN0aW9uKGUsdCl7cmV0dXJuIG4oZSx0KS5jYXRjaChmdW5jdGlvbigpe3JldHVybiBudWxsfSl9fSxyPXQud2FpdEZvclRoZUVsZW1lbnQsbz10LnRyeUFuZFdhaXRGb3JUaGVFbGVtZW50O2UuZGVmYXVsdD10LGUudHJ5QW5kV2FpdEZvclRoZUVsZW1lbnQ9byxlLndhaXRGb3JUaGVFbGVtZW50PXIsT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9KTtcbiIsImltcG9ydCB7IGNyZWF0ZUVsZW1lbnQgfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQgeyBSRUdFWF9CT0RZIH0gZnJvbSAnLi9zdGF0aWMnXHJcbmltcG9ydCByZXF1ZXN0IGZyb20gJy4vcmVxdWVzdCdcclxuXHJcbmNsYXNzIENhY2hlIGV4dGVuZHMgTWFwPG51bWJlciwgRWxlbWVudD4ge1xyXG4gIGFzeW5jIGZldGNoUG9zdCAoZ2FsbGVyeTogc3RyaW5nLCBubzogbnVtYmVyKSB7XHJcbiAgICBjb25zdCB1cmwgPSBgaHR0cHM6Ly9tLmRjaW5zaWRlLmNvbS9ib2FyZC8ke2dhbGxlcnl9LyR7bm99YFxyXG4gICAgY29uc3QgcmVzID0gYXdhaXQgcmVxdWVzdCh7XHJcbiAgICAgIHVybCxcclxuICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICd1c2VyLWFnZW50JzogJ01vemlsbGEvNS4wIChMaW51eDsgQW5kcm9pZCA0LjQuMjsgTmV4dXMgNCBCdWlsZC9LT1Q0OUgpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8zNC4wLjE4NDcuMTE0IE1vYmlsZSBTYWZhcmkvNTM3LjM2J1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIFxyXG4gICAgLy8gYm9keSDtg5zqt7gg7IaN66eMIOu2iOufrOyYpOq4sFxyXG4gICAgY29uc3QgbWF0Y2hlcyA9IHJlcy5yZXNwb25zZVRleHQubWF0Y2goUkVHRVhfQk9EWSlcclxuICAgIGNvbnN0ICQgPSBjcmVhdGVFbGVtZW50KG1hdGNoZXMuZ3JvdXBzLmJvZHkpLnBhcmVudE5vZGVcclxuICBcclxuICAgIC8vIO2VhOyalOyXhuuKlCDtg5zqt7gg7KCc6rGw7ZWY6riwXHJcbiAgICBjb25zdCBjb250ZW50ID0gJC5xdWVyeVNlbGVjdG9yKCcudGh1bS10eHRpbicpXHJcbiAgICBjb25zdCBxdWVyeSA9ICcqOm5vdChpbWcpOm5vdChpZnJhbWUpOm5vdChicik6ZW1wdHknXHJcbiAgXHJcbiAgICBmb3IgKGxldCBlIG9mIGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbChxdWVyeSkpIHtcclxuICAgICAgZS5yZW1vdmUoKVxyXG4gICAgfVxyXG4gIFxyXG4gICAgLy8g66qo65OgIOydtOuvuOyngCDsm5Drs7gg7KO87IaM66GcIOuzgO2ZmO2VmOq4sFxyXG4gICAgZm9yIChsZXQgaW1nIG9mIGNvbnRlbnQucXVlcnlTZWxlY3RvckFsbCgnaW1nJykpIHtcclxuICAgICAgY29uc3Qgc3JjID0gaW1nLmRhdGFzZXQub3JpZ2luYWwgfHwgaW1nLnNyY1xyXG4gIFxyXG4gICAgICB3aGlsZSAoaW1nLmF0dHJpYnV0ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgaW1nLnJlbW92ZUF0dHJpYnV0ZShpbWcuYXR0cmlidXRlc1swXS5uYW1lKVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGltZy5zcmMgPSBzcmNcclxuICAgIH1cclxuIFxyXG4gICAgLy8g7LqQ7Iux7ZWY6riwXHJcbiAgICB0aGlzLnNldChubywgY29udGVudClcclxuICBcclxuICAgIHJldHVybiBjb250ZW50XHJcbiAgfVxyXG5cclxuICBmZXRjaFBvc3RzIChnYWxsZXJ5OiBzdHJpbmcsIHBvc3RzOiBudW1iZXJbXSkge1xyXG4gICAgcmV0dXJuIHBvc3RzLm1hcChubyA9PiB0aGlzLmZldGNoUG9zdChnYWxsZXJ5LCBubykpXHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBjYWNoZSA9IG5ldyBDYWNoZSgpXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYWNoZVxyXG4iLCJpbXBvcnQgU3RvcmFnZSBmcm9tICcuL3N0b3JhZ2UnXHJcblxyXG5jb25zdCBjb25maWcgPSBuZXcgU3RvcmFnZSgnY29uZmlnJywge1xyXG4gIGRlZmF1bHRWYWx1ZToge1xyXG4gICAgaGlkZToge1xyXG4gICAgICBsb2dvOiB0cnVlLFxyXG4gICAgICB0aXRsZTogdHJ1ZSxcclxuICAgICAgdGl0bGViYXI6IHRydWUsXHJcbiAgICAgIHJpZ2h0OiB7XHJcbiAgICAgICAgYWxsOiB0cnVlLFxyXG4gICAgICAgIGxvZ2luOiB0cnVlLFxyXG4gICAgICAgIHJlY29tbWVuZDogdHJ1ZSxcclxuICAgICAgICBpc3N1ZXpvb206IHRydWUsXHJcbiAgICAgICAgbmV3czogdHJ1ZSxcclxuICAgICAgICByZWFsdGltZTogdHJ1ZSxcclxuICAgICAgICBoaXQ6IHRydWUsXHJcbiAgICAgICAgc2VjX3JlY29tbWVuZDogdHJ1ZSxcclxuICAgICAgICB3aWtpOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIG9uU3luYyAoKSB7XHJcbiAgICBjb25zdCBjbGFzc2VzID0gW11cclxuICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZXhwb3J0KClcclxuXHJcbiAgICBpZiAoY29uZmlnLmhpZGUubG9nbykgY2xhc3Nlcy5wdXNoKCdrcy1oaWRlLWxvZ28nKVxyXG5cclxuICAgIGlmIChjb25maWcuaGlkZS50aXRsZSkgY2xhc3Nlcy5wdXNoKCdrcy1oaWRlLXRpdGxlJylcclxuICAgIGlmIChjb25maWcuaGlkZS50aXRsZWJhcikgY2xhc3Nlcy5wdXNoKCdrcy1oaWRlLXRpdGxlYmFyJylcclxuXHJcbiAgICBpZiAoY29uZmlnLmhpZGUucmlnaHQuYWxsKSB7XHJcbiAgICAgIGNsYXNzZXMucHVzaCgna3MtaGlkZS1yaWdodCcpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoY29uZmlnLmhpZGUucmlnaHQubG9naW4pIGNsYXNzZXMucHVzaCgna3MtaGlkZS1yaWdodC1sb2dpbicpXHJcbiAgICAgIGlmIChjb25maWcuaGlkZS5yaWdodC5yZWNvbW1lbmQpIGNsYXNzZXMucHVzaCgna3MtaGlkZS1yaWdodC1yZWNvbW1lbmQnKVxyXG4gICAgICBpZiAoY29uZmlnLmhpZGUucmlnaHQuaXNzdWV6b29tKSBjbGFzc2VzLnB1c2goJ2tzLWhpZGUtcmlnaHQtaXNzdWV6b29tJylcclxuICAgICAgaWYgKGNvbmZpZy5oaWRlLnJpZ2h0Lm5ld3MpIGNsYXNzZXMucHVzaCgna3MtaGlkZS1yaWdodC1uZXdzJylcclxuICAgICAgaWYgKGNvbmZpZy5oaWRlLnJpZ2h0LnJlYWx0aW1lKSBjbGFzc2VzLnB1c2goJ2tzLWhpZGUtcmlnaHQtcmVhbHRpbWUnKVxyXG4gICAgICBpZiAoY29uZmlnLmhpZGVFbGhpZGVlbWVudC5yaWdodC5oaXQpIGNsYXNzZXMucHVzaCgna3MtaGlkZS1yaWdodC1oaXQnKVxyXG4gICAgICBpZiAoY29uZmlnLmhpZGUucmlnaHQuc2VjX3JlY29tbWVuZCkgY2xhc3Nlcy5wdXNoKCdrcy1oaWRlLXJpZ2h0LXNlYy1yZWNvbW1lbmQnKVxyXG4gICAgICBpZiAoY29uZmlnLmhpZGUucmlnaHQud2lraSkgY2xhc3Nlcy5wdXNoKCdrcy1oaWRlLXJpZ2h0LXdpa2knKVxyXG4gICAgfVxyXG5cclxuICAgIGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzZXMuam9pbignICcpKVxyXG4gIH1cclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbmZpZ1xyXG4iLCJpbXBvcnQgY2FjaGUgZnJvbSAnLi9jYWNoZSdcclxuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCB9IGZyb20gJy4vdXRpbHMnXHJcbmltcG9ydCB7IFJFR0VYX0JPRFkgfSBmcm9tICcuL3N0YXRpYydcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlcXVlc3QgKG9wdHM6IEdNX1JlcXVlc3RJbmZvKSB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlPEdNX1Jlc3BvbnNlPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgb3B0cy5tZXRob2QgPSBvcHRzLm1ldGhvZCB8fCAnR0VUJ1xyXG5cclxuICAgIGNvbnN0IGNsb25lZE9wdHM6IEdNX1JlcXVlc3RJbmZvID0ge1xyXG4gICAgICAuLi5vcHRzLFxyXG4gICAgICBvbmxvYWQ6IHJlcyA9PiB7XHJcbiAgICAgICAgaWYgKG9wdHMub25sb2FkKSB7XHJcbiAgICAgICAgICBvcHRzLm9ubG9hZChyZXMpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVzLnJlYWR5U3RhdGUgIT09IDQpIHtcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzb2x2ZShyZXMpXHJcbiAgICAgIH0sXHJcbiAgICAgIG9uZXJyb3I6IHJlcyA9PiB7XHJcbiAgICAgICAgaWYgKG9wdHMub25lcnJvcikge1xyXG4gICAgICAgICAgb3B0cy5vbmVycm9yKHJlcylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGUgPSBuZXcgRXJyb3IoJ3BsYWNlaG9sZGVyIHJlcXVlc3QgZXJyb3InKVxyXG4gICAgICAgIHJlamVjdChlKVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgR01feG1saHR0cFJlcXVlc3QoY2xvbmVkT3B0cylcclxuICB9KVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hMaXN0IChnYWxsZXJ5OiBzdHJpbmcpIHtcclxuICBjb25zdCByZXMgPSBhd2FpdCByZXF1ZXN0KHtcclxuICAgIHVybDogbG9jYXRpb24uaHJlZlxyXG4gIH0pXHJcblxyXG4gIC8vIGJvZHkg7YOc6re4IOyGjeunjCDrtojrn6zsmKTquLBcclxuICBjb25zdCBtYXRjaGVzID0gcmVzLnJlc3BvbnNlVGV4dC5tYXRjaChSRUdFWF9CT0RZKVxyXG4gIGNvbnN0ICQgPSBjcmVhdGVFbGVtZW50KG1hdGNoZXMuZ3JvdXBzLmJvZHkpLnBhcmVudE5vZGVcclxuXHJcbiAgLy8g7ZWE7JqU7JeG64qUIOq4gOydgCDsgq3soJztlZjquLBcclxuICBjb25zdCBhZGRlZFBvc3RzID0gJC5xdWVyeVNlbGVjdG9yQWxsKCcudXMtcG9zdCcpIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+XHJcblxyXG4gIGNvbnN0IHRib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbGxfbGlzdCB0Ym9keScpXHJcbiAgY29uc3QgbnVtYmVycyA9IFtdXHJcblxyXG4gIGZvciAobGV0IHBvc3Qgb2YgYWRkZWRQb3N0cykge1xyXG4gICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgIGNhc2UgcG9zdC5kYXRhc2V0LnR5cGUgPT09ICdpY29uX25vdGljZSc6XHJcbiAgICAgICAgY29udGludWVcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBubyA9IHBhcnNlSW50KHBvc3QuZGF0YXNldC5ubywgMTApXHJcblxyXG4gICAgLy8g6riw7KG0IOq4gCDrjJPquIAg7IiYLCDsobDtmowg7IiYIOuTsSDsl4XrjbDsnbTtirhcclxuICAgIGNvbnN0IGNhY2hlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC51cy1wb3N0W2RhdGEtbm89XCIke3Bvc3QuZGF0YXNldC5ub31cIl1gKSBcclxuICAgIGlmIChjYWNoZWQpIHtcclxuICAgICAgY2FjaGVkLmlubmVySFRNTCA9IHBvc3QuaW5uZXJIVE1MXHJcbiAgICB9XHJcblxyXG4gICAgLy8g7LqQ7Iuc65CY7KeAIOyViuydgCDquIDsnbTrnbzrqbQg7LqQ7Iuc7ZWY6riwIOy2lOqwgO2VmOq4sFxyXG4gICAgaWYgKCFjYWNoZS5oYXMobm8pKSB7XHJcbiAgICAgIGNhY2hlLmZldGNoUG9zdChnYWxsZXJ5LCBubylcclxuICAgICAgcG9zdC5jbGFzc0xpc3QuYWRkKCdrcy1uZXcnKVxyXG4gICAgICB0Ym9keS5wcmVwZW5kKHBvc3QpXHJcbiAgICB9XHJcblxyXG4gICAgbnVtYmVycy5wdXNoKG5vKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgbG93ZXN0ID0gTWF0aC5taW4oLi4ubnVtYmVycylcclxuXHJcbiAgZm9yIChsZXQgcG9zdCBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudXMtcG9zdCcpIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+KSB7XHJcbiAgICBjb25zdCBubyA9IHBhcnNlSW50KHBvc3QuZGF0YXNldC5ubywgMTApXHJcblxyXG4gICAgaWYgKG5vIDwgbG93ZXN0KSB7XHJcbiAgICAgIGJyZWFrXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFudW1iZXJzLmluY2x1ZGVzKG5vKSkge1xyXG4gICAgICBwb3N0LmNsYXNzTGlzdC5hZGQoJ2tzLWRlbGV0ZWQnKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgY29uc3QgUkVHRVhfQk9EWSA9IC8oPzxib2R5Pjxib2R5W14+XSo+KCgufFtcXG5cXHJdKSopPFxcL2JvZHk+KS9pbVxyXG5cclxuZXhwb3J0IGNvbnN0IFNUWUxFU0hFRVQgPSBgXHJcbjxzdHlsZT5cclxuICAvKiDquLDriqUgKi9cclxuICBib2R5LmtzLWhpZGUtbG9nbyAuZGNfbG9nbyB7IG9wYWNpdHk6IDAgfVxyXG5cclxuICBib2R5LmtzLWhpZGUtdGl0bGUgLmxlZnRfY29udGVudCBoZWFkZXIgeyBkaXNwbGF5OiBub25lIH1cclxuICBib2R5LmtzLWhpZGUtdGl0bGViYXIgLmxlZnRfY29udGVudCBhcnRpY2xlOm50aC1jaGlsZCgyKSB7IGRpc3BsYXk6IG5vbmUgfVxyXG4gIFxyXG4gIGJvZHkua3MtaGlkZS1yaWdodCAubGVmdF9jb250ZW50IHtcclxuICAgIGZsb2F0OiBub25lO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgfVxyXG5cclxuICBib2R5LmtzLWhpZGUtcmlnaHQgLmlzc3VlYm94IHsgd2lkdGg6IDEwMCUgfVxyXG4gIGJvZHkua3MtaGlkZS1yaWdodCAubWlub3JfaW50cm9fYm94IHsgd2lkdGg6IGNhbGMoMTAwJSAtIDE1NXB4KSB9XHJcbiAgYm9keS5rcy1oaWRlLXJpZ2h0IC52aXNpdF9oaXN0b3J5IHsgd2lkdGg6IDEwMCU7IGJveC1zaXppbmc6IGJvcmRlci1ib3ggfVxyXG4gIGJvZHkua3MtaGlkZS1yaWdodCAubGlzdF9hcnJheV9vcHRpb24geyB3aWR0aDogMTAwJSB9XHJcbiAgYm9keS5rcy1oaWRlLXJpZ2h0IC5yaWdodF9jb250ZW50IHsgZGlzcGxheTogbm9uZSB9XHJcblxyXG4gIGJvZHkua3MtaGlkZS1yaWdodCAuc3RpY2t5dW5pdCB7IGRpc3BsYXk6IG5vbmUgfVxyXG5cclxuICBib2R5LmtzLWhpZGUtcmlnaHQtbG9naW4gLmxvZ2luX2JveCB7IGRpc3BsYXk6IG5vbmUgfVxyXG4gIGJvZHkua3MtaGlkZS1yaWdodC1yZWNvbW1lbmQgLnJfcmVjb21tZW5kIHsgZGlzcGxheTogbm9uZSB9XHJcbiAgYm9keS5rcy1oaWRlLXJpZ2h0LWlzc3Vlem9vbSAucl9pc3N1ZXpvb20geyBkaXNwbGF5OiBub25lIH1cclxuICBib2R5LmtzLWhpZGUtcmlnaHQtbmV3cyAucl9uZXdzIHsgZGlzcGxheTogbm9uZSB9XHJcbiAgYm9keS5rcy1oaWRlLXJpZ2h0LXJlYWx0aW1lIC5yX3JlYWx0aW1lX2lzc3VlIHsgZGlzcGxheTogbm9uZSB9XHJcbiAgYm9keS5rcy1oaWRlLXJpZ2h0LWhpdCAucl9oaXQgeyBkaXNwbGF5OiBub25lIH1cclxuICBib2R5LmtzLWhpZGUtcmlnaHQtc2VjLXJlY29tbWVuZCAucl9zZWNfcmVjb21tZW5kIHsgZGlzcGxheTogbm9uZSB9XHJcbiAgYm9keS5rcy1oaWRlLXJpZ2h0LXdpa2kgLnJfd2lraSB7IGRpc3BsYXk6IG5vbmUgfVxyXG5cclxuICAvKiDquIDqvLQgKi9cclxuICBib2R5LCAuZ2FsbF9saXN0LFxyXG4gIGJ1dHRvbiwgaW5wdXQsIHNlbGVjdCwgdGFibGUsXHJcbiAgdGV4dGFyZWEgeyBmb250LWZhbWlseTogJ+unkeydgCDqs6DrlJUnLCBzYW5zLXNlcmlmIH1cclxuXHJcbiAgLyog7JWxICovXHJcbiAgYm9keS5rcy1wcmV2ZW50LXNjcm9sbGluZyB7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gIH1cclxuXHJcbiAgLmtzLXByZXZpZXcge1xyXG4gICAgei1pbmRleDogMTAwMDtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHRvcDogMDtcclxuICAgIGxlZnQ6IDA7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgb3ZlcmZsb3cteTogYXV0bztcclxuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgLjI1cztcclxuICAgIGRpc3BsYXk6IG5vbmU7XHJcbiAgICBwYWRkaW5nOiAxZW07XHJcbiAgICBtYXgtd2lkdGg6IDUwMHB4O1xyXG4gICAgbWF4LWhlaWdodDogMjUwcHg7XHJcbiAgICBvcGFjaXR5OiAwO1xyXG4gICAgYmFja2dyb3VuZDogYmxhY2s7XHJcbiAgICBib3gtc2hhZG93OiAwIDAgNXB4IGJsYWNrO1xyXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgY29sb3I6IHdoaXRlO1xyXG4gIH1cclxuICAua3MtcHJldmlldy5hY3RpdmUge1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgb3BhY2l0eTogLjg1O1xyXG4gIH1cclxuXHJcbiAgLmtzLXByZXZpZXcgaW1nIHtcclxuICAgIG1heC13aWR0aDogMTAwJTtcclxuICAgIG1heC1oZWlnaHQ6IDIwMHB4O1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIH1cclxuICAua3MtcHJldmlldyBpbWcuYWN0aXZlIHtcclxuICAgIG1heC1oZWlnaHQ6IDEwMCU7XHJcbiAgfVxyXG5cclxuICAudXMtcG9zdC5rcy1uZXcge1xyXG4gICAgYW5pbWF0aW9uLW5hbWU6IGtzLW5ldztcclxuICAgIGFuaW1hdGlvbi1kdXJhdGlvbjogLjVzO1xyXG4gIH1cclxuICAudXMtcG9zdC5rcy1kZWxldGVkIHtcclxuICAgIGJhY2tncm91bmQ6IHJnYigyNDAsIDEwMCwgMTAwKVxyXG4gIH1cclxuXHJcbiAgQGtleWZyYW1lcyBrcy1uZXcge1xyXG4gICAgZnJvbSB7XHJcbiAgICAgIHRyYW5zZm9ybTogc2NhbGVZKDApO1xyXG4gICAgICBtYXgtaGVpZ2h0OiAwO1xyXG4gICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0MCwgMTAwLCAxMDAsIDEpO1xyXG4gICAgfVxyXG4gICAgdG8ge1xyXG4gICAgICB0cmFuc2Zvcm06IHNjYWxlWSgxKTtcclxuICAgICAgbWF4LWhlaWdodDogMTAwJTtcclxuICAgICAgYmFja2dyb3VuZDogcmdiYSgyNDAsIDEwMCwgMTAwLCAwKTtcclxuICAgIH1cclxuICB9XHJcbjwvc3R5bGU+XHJcbmBcclxuIiwiaW1wb3J0IGRvdFByb3AgZnJvbSAnZG90LXByb3AnXHJcblxyXG5pbnRlcmZhY2UgU3RvcmFnZU9wdGlvbnMge1xyXG4gIGRlZmF1bHRWYWx1ZT86IExvb3NlT2JqZWN0O1xyXG4gIG9uU3luYz8odGhpczogU3RvcmFnZSk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0b3JhZ2Uge1xyXG4gIHByaXZhdGUgcmVhZG9ubHkga2V5OiBzdHJpbmdcclxuICBwcml2YXRlIHJlYWRvbmx5IG9wdHM6IFN0b3JhZ2VPcHRpb25zXHJcbiAgcHJpdmF0ZSBzdG9yYWdlOiBMb29zZU9iamVjdFxyXG5cclxuICBjb25zdHJ1Y3RvciAoa2V5OiBzdHJpbmcsIG9wdHM6IFN0b3JhZ2VPcHRpb25zKSB7XHJcbiAgICB0aGlzLmtleSA9IGtleVxyXG4gICAgdGhpcy5vcHRzID0gb3B0c1xyXG4gICAgdGhpcy5zdG9yYWdlID0gR01fZ2V0VmFsdWU8TG9vc2VPYmplY3Q+KGtleSwgb3B0cy5kZWZhdWx0VmFsdWUpXHJcbiAgfVxyXG5cclxuICBzeW5jICgpIHtcclxuICAgIEdNX3NldFZhbHVlKHRoaXMua2V5LCB0aGlzLnN0b3JhZ2UpXHJcblxyXG4gICAgaWYgKHRoaXMub3B0cy5vblN5bmMpIHtcclxuICAgICAgdGhpcy5vcHRzLm9uU3luYy5hcHBseSh0aGlzKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0PFQgPSBTdG9yYWJsZT4gKGtleTogc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gZG90UHJvcC5nZXQ8VD4odGhpcy5zdG9yYWdlLCBrZXkpXHJcbiAgfVxyXG5cclxuICBzZXQgKGtleTogc3RyaW5nLCB2YWx1ZTogU3RvcmFibGUpIHtcclxuICAgIGRvdFByb3Auc2V0KHRoaXMuc3RvcmFnZSwga2V5LCB2YWx1ZSlcclxuICAgIHRoaXMuc3luYygpXHJcbiAgfVxyXG5cclxuICBleHBvcnQgKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZVxyXG4gIH1cclxuXHJcbiAgaW1wb3J0ICh2YWx1ZTogTG9vc2VPYmplY3QpIHtcclxuICAgIHRoaXMuc3RvcmFnZSA9IHZhbHVlXHJcbiAgICB0aGlzLnN5bmMoKVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgcXMgZnJvbSAncXVlcnktc3RyaW5nJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQ8VCA9IEhUTUxFbGVtZW50PiAoaHRtbDogc3RyaW5nKSB7XHJcbiAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpXHJcbiAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbC50cmltKClcclxuICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkIGFzIHVua25vd24gYXMgVFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyYW1ldGVyIChrZXk6IHN0cmluZykge1xyXG4gIGNvbnN0IHBhcmFtcyA9IHFzLnBhcnNlKGxvY2F0aW9uLnNlYXJjaClcclxuICByZXR1cm4gcGFyYW1zW2tleV0gYXMgc3RyaW5nXHJcbn1cclxuXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG4vLyBleHBvcnQgaW50ZXJmYWNlIExvb3NlT2JqZWN0PFQgPSBhbnk+IHtcclxuLy8gICBbazogc3RyaW5nXTogVDtcclxuLy8gfVxyXG4iLCJpbXBvcnQgcExpbWl0IGZyb20gJ3AtbGltaXQnXHJcbmltcG9ydCB7IHRyeUFuZFdhaXRGb3JUaGVFbGVtZW50IH0gZnJvbSAnd2FpdC1mb3ItdGhlLWVsZW1lbnQnXHJcbmltcG9ydCB7IGZldGNoTGlzdCB9IGZyb20gJy4vaW5jbHVkZXMvcmVxdWVzdCdcclxuaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgZ2V0UGFyYW1ldGVyIH0gZnJvbSAnLi9pbmNsdWRlcy91dGlscydcclxuaW1wb3J0IGNhY2hlIGZyb20gJy4vaW5jbHVkZXMvY2FjaGUnXHJcbmltcG9ydCB7IFNUWUxFU0hFRVQgfSBmcm9tICcuL2luY2x1ZGVzL3N0YXRpYydcclxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2luY2x1ZGVzL2NvbmZpZydcclxuXHJcbmNvbnN0IGdhbGxlcnkgPSBnZXRQYXJhbWV0ZXIoJ2lkJylcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIG1haW4gKCkge1xyXG4gIC8vIOyEpOyglSDrp57stpTquLBcclxuICBjb25maWcuc3luYygpXHJcblxyXG4gIC8vIOyVseyXkOyEnCDsgqzsmqntlaAg7JqU7IaM7JmAIOyKpO2DgOydvCDsi5ztirgg7LaU6rCA7ZWY6riwXHJcbiAgY29uc3Qgc3R5bGVzaGVldCA9IGNyZWF0ZUVsZW1lbnQoU1RZTEVTSEVFVClcclxuICBjb25zdCBwcmV2aWV3ID0gY3JlYXRlRWxlbWVudCgnPGRpdiBjbGFzcz1cImtzLXByZXZpZXdcIj48L2Rpdj4nKVxyXG5cclxuICBmdW5jdGlvbiBvbk1vdXNlRXZlbnQgKGU6IE1vdXNlRXZlbnQpIHtcclxuICAgIGxldCBlbCA9IGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50XHJcblxyXG4gICAgLy8g6rKM7Iuc6riAIOuqqeuhnSDsmpTshozsnbjsp4Ag7ZmV7J247ZWY6riwXHJcbiAgICB3aGlsZSAoZWwgIT09IG51bGwpIHtcclxuICAgICAgLy8g7ZSE66as67ewIOqwneyytOudvOuptCDtlITrpqzrt7Ag67CV7IqkIOuCtOyXkOyEnCDsiqTtgazroaQg7ZW07JW87ZWY66+A66GcIOustOyLnO2VmOq4sFxyXG4gICAgICBpZiAoZWwgPT09IHByZXZpZXcpIHtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2tzLXByZXZlbnQtc2Nyb2xsaW5nJylcclxuICAgICAgICBicmVha1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgna3MtcHJldmVudC1zY3JvbGxpbmcnKVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZWwuY2xhc3NMaXN0ICYmIGVsLmNsYXNzTGlzdC5jb250YWlucygndXMtcG9zdCcpKSB7XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG5cclxuICAgICAgZWwgPSBlbC5wYXJlbnROb2RlIGFzIEhUTUxFbGVtZW50XHJcbiAgICB9XHJcbiAgXHJcbiAgICBpZiAoZWwpIHtcclxuICAgICAgLy8g7ZiE7J6sIO2UhOumrOu3sOqwgCDshKDtg53tlZwg6rKM7Iuc6riA7J20IOyVhOuLiOudvOuptCDsl4XrjbDsnbTtirjtlZjquLBcclxuICAgICAgaWYgKHByZXZpZXcuZGF0YXNldC5ubyAhPT0gZWwuZGF0YXNldC5ubykge1xyXG4gICAgICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wXHJcbiAgICAgICAgY29uc3QgY2xpZW50VG9wID0gZG9jdW1lbnQuYm9keS5jbGllbnRUb3AgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFRvcCB8fCAwXHJcblxyXG4gICAgICAgIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICAgIGNvbnN0IHRvcCA9IHJlY3QudG9wICsgc2Nyb2xsVG9wIC0gY2xpZW50VG9wXHJcblxyXG4gICAgICAgIHByZXZpZXcuc3R5bGUudG9wID0gYCR7dG9wfXB4YFxyXG4gICAgICAgIHByZXZpZXcuc3R5bGUubGVmdCA9IGAke2UucGFnZVggKyAyNX1weGBcclxuICAgICAgICBwcmV2aWV3LmRhdGFzZXQubm8gPSBlbC5kYXRhc2V0Lm5vXHJcbiAgICAgICAgcHJldmlldy5pbm5lckhUTUwgPSBjYWNoZS5nZXQocGFyc2VJbnQoZWwuZGF0YXNldC5ubywgMTApKS5pbm5lckhUTUxcclxuICAgICAgICBwcmV2aWV3LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXHJcblxyXG4gICAgICAgIGZvciAobGV0IGltZyBvZiBwcmV2aWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpKSB7XHJcbiAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJylcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyDtlITrpqzrt7Ag67CV7IqkIOy0iOq4sO2ZlFxyXG4gICAgICBwcmV2aWV3LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXHJcbiAgICAgIHByZXZpZXcuaW5uZXJIVE1MID0gJydcclxuICAgICAgZGVsZXRlIHByZXZpZXcuZGF0YXNldC5ub1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZG9jdW1lbnQuaGVhZC5hcHBlbmQoc3R5bGVzaGVldClcclxuICBkb2N1bWVudC5ib2R5LnByZXBlbmQocHJldmlldylcclxuXHJcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgb25Nb3VzZUV2ZW50KVxyXG4gIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBvbk1vdXNlRXZlbnQpXHJcbiAgLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLCBvbk1vdXNlRXZlbnQpIC8vIGZvciBvdXIgZmlyZWZveCBmcmllbmRzIDopXHJcblxyXG4gIGNvbnN0IHByb21pc2VzID0gW11cclxuICBjb25zdCBsaW1pdCA9IHBMaW1pdCgxMClcclxuXHJcbiAgZm9yIChsZXQgZWwgb2YgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oJy51cy1wb3N0JykpIHtcclxuICAgIC8vIOuyiO2YuCDsl4bripQg6riA7J2AIOustOyLnO2VmOq4sFxyXG4gICAgaWYgKCFlbC5kYXRhc2V0Lm5vKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVsKVxyXG4gICAgICBjb250aW51ZVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOqzteyngCDqsozsi5zquIDsnYAg66y07Iuc7ZWY6riwXHJcbiAgICBpZiAoZWwuZGF0YXNldC50eXBlID09PSAnaWNvbl9ub3RpY2UnKSB7XHJcbiAgICAgIGNvbnRpbnVlXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgbm8gPSBwYXJzZUludChlbC5kYXRhc2V0Lm5vLCAxMClcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBwcm9taXNlID0gbGltaXQoKCkgPT4gY2FjaGUuZmV0Y2hQb3N0KGdhbGxlcnksIG5vKSlcclxuICAgICAgcHJvbWlzZXMucHVzaChwcm9taXNlKVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGUpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyDtmITsnqwg67aI65+s7JioIOqyjOyLnOq4gCDsoITssrQg7LqQ7Iux7ZWY6riwXHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpXHJcblxyXG4gIC8vIOqyjOyLnOq4gCDsi6Tsi5zqsIQg7JeF642w7J207Yq4IOyLnOyeke2VmOq4sFxyXG4gIHNldEludGVydmFsKCgpID0+IGZldGNoTGlzdChnYWxsZXJ5KSwgMTAwMClcclxufVxyXG5cclxuLy8g7LWc7IOB64uoIO2OmOydtOyngOyXkOyEnOunjCDsiqTtgazrpr3tirgg7Iuk7ZaJ7ZWY6riwXHJcbmlmICh3aW5kb3cudG9wID09PSB3aW5kb3cuc2VsZikge1xyXG5cclxuICAvLyDqsKTrn6zrpqwg7YWM7J2067iUIOyalOyGjCDrjIDquLAg7ZuEIG1haW4oKSDsi6TtlontlZjquLBcclxuICB0cnlBbmRXYWl0Rm9yVGhlRWxlbWVudCgnLmNvcHlyaWdodCcpXHJcbiAgICAuY2F0Y2goKCkgPT4gY29uc29sZS5lcnJvcign7Y6Y7J207KeA7JeQ7IScIOqyjOyLnOq4gCDthYzsnbTruJQg7JqU7IaM66W8IOu2iOufrOyYrCDsiJgg7JeG7Iq164uI64ukJykpXHJcbiAgICAudGhlbigoKSA9PiBtYWluKCkpXHJcbiAgICAuY2F0Y2goY29uc29sZS5lcnJvcilcclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9