// ==UserScript==
// @name         RSSHelper
// @version      0.1.0
// @description  A way to add a rss feed button on webpage
// @author       SettingDust
//
// @include      http*://*
// @license      MIT
//
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.slim.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.1/clipboard.min.js
//
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/149095
// @downloadURL https://update.greasyfork.org/scripts/374570/RSSHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/374570/RSSHelper.meta.js
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);

const router = __webpack_require__(2);
router();

new ClipboardJS('#rss-helper');


/***/ }),
/* 1 */
/***/ (function(module, exports) {

$.fn.feedInit = function() {
    this.attr('target', '_blank');
    this.attr('id', 'rss-helper');
    return this;
};

$.fn.href = function(href) {
    this.attr('href', href);
    this.attr('data-clipboard-text', href);
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Route = __webpack_require__(3);

const Router = __webpack_require__(4);
const router = new Router();

module.exports = () => {
    router.push(new Route(/yande\.re\/.*/, __webpack_require__(7)));
    router.push(new Route(/\/?.*\.?bilibili\.com\/.*/, __webpack_require__(17)));
    router.push(new Route(/\/?.*\.?weibo\.com\/.*/, __webpack_require__(28)));
    router.push(new Route(/\/?.*\.?pixiv\.net\/.*/, __webpack_require__(29)));

    router.push(new Route(/.+/, __webpack_require__(33)));

    router.load(location.href);
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = class Route {
    constructor(url, route) {
        this._url = url;
        this._route = route;
    }

    get url() {
        return this._url;
    }

    get route() {
        return this._route;
    }

    test(link) {
        let regex = new RegExp(this.url);
        if (link.input) return regex.test(link.input);
        else return regex.test(link);
    }

    match(link) {
        let regex = new RegExp(this.url);
        if (link.input) return regex.exec(link.input);
        else return regex.exec(link);
    }

    call(args) {
        this.route(args);
    }
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const logger = __webpack_require__(5);
module.exports = class Router {
    constructor() {
        this._routes = [];
    }

    push(router) {
        this.routes.push(router);
    }

    get routes() {
        return this._routes;
    }

    load(href) {
        logger.debug(this.routes);
        this.routes.some((route) => {
            if (route.test(href)) {
                route.call(route.match(href));
                return true;
            }
        });
    }
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const monkey = __webpack_require__(6);
module.exports = {
    info: (message) => {
        console.info(`[${monkey.header.name}]`, message);
    },
    debug: (message) => {
        console.debug(`[${monkey.header.name}]`, message);
    },
    warn: (message) => {
        console.warn(`[${monkey.header.name}]`, message);
    }
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

let name = 'RSSHelper';
let version = '0.1.0';
let description = 'A way to add a rss feed button on webpage';

const config = {
    entry: './src/javascript/index.js'
};

const header = {
    name: name,
    version: version,
    description: description,
    author: 'SettingDust',
    include: ['http*://*'],
    license: 'MIT',
    require: [
        'https://cdn.bootcss.com/jquery/3.3.1/jquery.slim.min.js',
        'https://cdn.bootcss.com/clipboard.js/2.0.1/clipboard.min.js'
    ],
    grant: [
        //https://tampermonkey.net/documentation.php#GM_addStyle
        'GM_addStyle', //GM_addStyle(require('file').toString())
        'GM_setValue',
        'GM_getValue'
    ]
};

module.exports.config = config;
module.exports.header = header;
module.exports.buildedHeader = () => {
    let headerString = [];
    headerString.push('// ==UserScript==');
    for (let headerKey in header) {
        if (Array.isArray(header[headerKey])) {
            if (header[headerKey].length > 0) headerString.push('//');
            for (let p in header[headerKey]) {
                headerString.push('// @' + headerKey.padEnd(13) + header[headerKey][p]);
            }
        } else {
            headerString.push('// @' + headerKey.padEnd(13) + header[headerKey]);
        }
    }
    headerString.push('// ==/UserScript==');
    headerString.push('');
    return headerString.join('\n');
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

const Route = __webpack_require__(3);
const logger = __webpack_require__(5);

const Router = __webpack_require__(4);
const router = new Router();

router.push(new Route(/tags=(?:(.+))?/, __webpack_require__(8)));
router.push(new Route(/post/, __webpack_require__(14)));

module.exports = async (args) => {
    router.load(args);
    GM_addStyle(__webpack_require__(15).toString());
    logger.debug(__webpack_require__(15).toString());
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const rssPrefix = 'https://yande.re/post/piclens?tags=';
const variable = __webpack_require__(9);
const { language } = variable;

const rssElem = $('<a\>').feedInit();
rssElem.attr('title', language.feed);
rssElem.text(language.feed);

module.exports = async (args) => {
    rssElem.href(`${rssPrefix}${args[1]}`);
    $('#post-list > div.sidebar > div:nth-child(1) > form > div').append(rssElem);
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(10);
const { rsshub, language } = config;

module.exports = {
    language: __webpack_require__(11)(`./${language}`),
    rsshub
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = {
    language: 'en_US',
    rsshub: 'https://rsshub.app'
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./en_US": 12,
	"./en_US.json": 12,
	"./zh_CN": 13,
	"./zh_CN.json": 13
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 11;

/***/ }),
/* 12 */
/***/ (function(module) {

module.exports = {"feed":"RSS Feed"};

/***/ }),
/* 13 */
/***/ (function(module) {

module.exports = {"feed":"RSS订阅"};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

const rssPrefix = 'https://yande.re/post/piclens';
const variable = __webpack_require__(9);
const { language } = variable;

const rssElem = $('<a\>').feedInit();
rssElem.attr('title', language.feed);
rssElem.text(language.feed);

module.exports = async () => {
    rssElem.href(rssPrefix);
    $('#post-list > div.sidebar > div:nth-child(1) > form > div').append(rssElem);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(16)(false);
// imports


// module
exports.push([module.i, "#post-list>div.sidebar>div:first-child>form>div{display:-webkit-box;display:-webkit-flex;display:flex;line-height:20px}#post-list>div.sidebar>div:first-child>form>div #rss-helper{margin-left:4px}", ""]);

// exports


/***/ }),
/* 16 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const Route = __webpack_require__(3);

const Router = __webpack_require__(4);
const router = new Router();

router.push(new Route(/video\/av\d+/, __webpack_require__(18)));
router.push(new Route(/space\.bilibili\.com\/\d+/, __webpack_require__(20)));
router.push(new Route(/live\.bilibili\.com\/\d+/, __webpack_require__(21)));
router.push(new Route(/bangumi/, __webpack_require__(23)));

module.exports = async (args) => {
    router.load(args);
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

const variable = __webpack_require__(9);
const { language, rsshub } = variable;
const rssPrefix = `${rsshub}/bilibili/user/video/`;

const rssElem = $('<a\>').feedInit();
rssElem.addClass('btn');
rssElem.addClass('default-btn');
rssElem.addClass('bi-btn');
rssElem.attr('title', language.feed);
rssElem.text(language.feed);

module.exports = async () => {
    let mid = $('#v_upinfo .u-face>a')
        .attr('href')
        .match(/\d+/)[0];
    rssElem.href(`${rssPrefix}${mid}`);
    let task = setInterval(() => {
        if ($('.trynew-btn').length) {
            rssElem.addClass('old');
            $('.followe.btn').append(rssElem);
            clearInterval(task);
        }
        if ($('.more-ops-list').length) {
            $('.btn-panel').append(rssElem);
            clearInterval(task);
        }
    }, 100);
    GM_addStyle(__webpack_require__(19).toString());
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(16)(false);
// imports


// module
exports.push([module.i, "#v_upinfo .followe{margin-left:-89px}#v_upinfo .btn-panel{margin-left:0;top:8px;position:relative;-webkit-box-pack:end;-webkit-justify-content:flex-end;justify-content:flex-end}#rss-helper{padding:4px 16px;margin-left:12px;margin-top:0}#rss-helper.old{height:20px;line-height:20px}", ""]);

// exports


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

const variable = __webpack_require__(9);
const { language, rsshub } = variable;
const rssPrefix = `${rsshub}/bilibili/user/dynamic/`;

const rssElem = $('<a\>').feedInit();
rssElem.addClass('h-f-btn');
rssElem.attr('title', language.feed);
rssElem.text(language.feed);

module.exports = async (args) => {
    rssElem.href(`${rssPrefix}${args[1]}`);
    let task = setInterval(() => {
        let elem = $('.h-action .h-message');
        if (elem.length) {
            elem.after(rssElem);
            clearInterval(task);
        }
    }, 500);
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

const variable = __webpack_require__(9);
const { language, rsshub } = variable;
const rssPrefix = `${rsshub}/bilibili/live/room/`;

const rssElem = $('<a\>').feedInit();
rssElem.addClass('p-absolute');
rssElem.attr('title', language.feed);
rssElem.text(language.feed);

module.exports = async (args) => {
    rssElem.href(`${rssPrefix}${args[1]}`);
    let task = setInterval(() => {
        let elem = $('.room-info-down-row .attention-btn-ctnr');
        if (elem.length) {
            elem.after(rssElem);
            clearInterval(task);
        }
    }, 500);
    GM_addStyle(__webpack_require__(22).toString());
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(16)(false);
// imports


// module
exports.push([module.i, ".room-info-down-row #rss-helper{height:22px;line-height:22px;padding-left:16px;padding-right:16px;background-color:#23ade5;color:#fff!important;border-radius:4px;right:130px;top:50%;-webkit-transform:translateY(-50%);-ms-transform:translateY(-50%);transform:translateY(-50%);-webkit-transition:125ms ease-in-out;transition:125ms ease-in-out}.room-info-down-row #rss-helper:hover{background-color:#23b9f1}", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

const Route = __webpack_require__(3);

const Router = __webpack_require__(4);
const router = new Router();

router.push(new Route(/media\/md(\d+)/, __webpack_require__(24)));
router.push(new Route(/play\/ep\d+/, __webpack_require__(26)));

module.exports = async (args) => {
    router.load(args);
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const variable = __webpack_require__(9);
const { language, rsshub } = variable;
const rssPrefix = `${rsshub}/bilibili/bangumi/media/`;

const rssElem = $('<a\>').feedInit();
rssElem.addClass('bangumi-btn');
rssElem.attr('title', language.feed);
rssElem.text(language.feed);

module.exports = async (ctx) => {
    rssElem.href(`${rssPrefix}${ctx[1]}`);
    $('.bangumi-btn').after(rssElem);
    GM_addStyle(__webpack_require__(25).toString());
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(16)(false);
// imports


// module
exports.push([module.i, "#rss-helper{width:128px;height:48px;line-height:48px;background-color:#f36392;border-radius:8px;text-align:center;color:#fff;font-size:18px;-webkit-transition:all .3s ease;transition:all .3s ease}", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

const variable = __webpack_require__(9);
const { language, rsshub } = variable;
const rssPrefix = `${rsshub}/bilibili/bangumi/media/`;

const rssElem = $('<a\>').feedInit();
rssElem.addClass('bangumi-btn');
rssElem.attr('title', language.feed);
rssElem.text(language.feed);

module.exports = async () => {
    const mdid = $('.info-title>a').attr('href').match(/(\d+)/);
    rssElem.href(`${rssPrefix}${mdid}`);
    $('.bangumi-btn').after(rssElem);
    GM_addStyle(__webpack_require__(27).toString());
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(16)(false);
// imports


// module
exports.push([module.i, "#rss-helper{width:80px;height:28px;line-height:28px;background-color:#f36392;border:1px solid #f36392;border-radius:4px;text-align:center;color:#fff;font-size:14px}.bangumi-info .info-right .info-title h2{width:500px}", ""]);

// exports


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

const variable = __webpack_require__(9);
const { language, rsshub } = variable;
const rssPrefix = `${rsshub}/weibo/user/`;

const rssElem = $('<a\>').feedInit();

module.exports = async () => {
    window.onload = () => {
        if ($('.opt_box.clearfix').length) {
            rssElem.addClass('W_btn_d');
            rssElem.addClass('btn_34px');

            rssElem.attr('title', language.feed);
            rssElem.text(language.feed);
            rssElem.href(rssPrefix + $oid);

            $('div.pf_opt > .opt_box').append(rssElem);
        }
    };
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const Route = __webpack_require__(3);
const logger = __webpack_require__(5);

const Router = __webpack_require__(4);
const router = new Router();

router.push(new Route(/member\.php\?id=\d+/, __webpack_require__(30)));
router.push(new Route(/member_illust\.php\?.*illust_id=\d+/, __webpack_require__(31)));

module.exports = async (args) => {
    router.load(args);
    GM_addStyle(__webpack_require__(32).toString());
    logger.debug(__webpack_require__(32).toString());
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

const variable = __webpack_require__(9);
const { language, rsshub } = variable;
const rssPrefix = `${rsshub}/pixiv/user/`;

const rssElem = $('<a\>').feedInit();
rssElem.addClass('YryPnZn _30SjOFD');
rssElem.attr('title', language.feed);
rssElem.text(language.feed);

module.exports = async () => {
    rssElem.href(rssPrefix + Object.keys(globalInitData.preload.user)[0]);
    let task = setInterval(() => {
        let elem = $('div._3yalhqB');
        if (elem.length) {
            elem.append(rssElem);
            clearInterval(task);
        }
    }, 500);
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const variable = __webpack_require__(9);
const { language, rsshub } = variable;
const rssPrefix = `${rsshub}/pixiv/user/`;

const rssElem = $('<a\>').feedInit();
rssElem.addClass('YryPnZn');
rssElem.attr('title', language.feed);
rssElem.text(language.feed);

module.exports = async () => {
    rssElem.href(rssPrefix + Object.keys(globalInitData.preload.user)[0]);
    let task = setInterval(() => {
        let elem = $('.sc-dRCTWM.cRuxjo');
        if (elem.length) {
            elem.append(rssElem);
            clearInterval(task);
        }
    }, 500);
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(16)(false);
// imports


// module
exports.push([module.i, "#rss-helper{text-decoration:none}._3yalhqB{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;flex-direction:row;width:auto}._3yalhqB #rss-helper{margin-left:12px}.sc-dRCTWM.cRuxjo #rss-helper{margin-top:12px}", ""]);

// exports


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

const variable = __webpack_require__(9);
const { language } = variable;
const logger = __webpack_require__(5);

const rssContainer = $('<div\>').feedInit();

const rssElem = $('<a\>');
rssElem.attr('target', '_blank');
rssElem.addClass('rss-item');
rssElem.append('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><circle cx="6.18" cy="17.82" r="2.18"/><path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/></svg>');

const rssElemText = $('<span\>');
rssElemText.text(language.feed);
rssElem.append(rssElemText);

module.exports = async () => {
    const types = [
        'application/rss+xml',
        'application/atom+xml',
        'application/rdf+xml',
        'application/rss',
        'application/atom',
        'application/rdf',
        'text/rss+xml',
        'text/atom+xml',
        'text/rdf+xml',
        'text/rss',
        'text/atom',
        'text/rdf'
    ];
    const links = [
        '/feed',
        '/rss',
        '/rss.xml',
        '/atom.xml',
        '/feed.xml'
    ];
    let feeds = [];
    $(async () => {
        $('link[type]').each(function() {
            if (types.includes($(this).attr('type'))) {
                let feed = {
                    href: $(this).attr('href'),
                    name: $(this).attr('title')
                };
                feeds.push(feed);
            }
        });
        logger.debug(feeds);
        if (feeds.length) {
            for (const feed of feeds) {
                const rssElemClone = rssElem.clone();
                rssElemClone.href(feed.href.startsWith('/') ? `${location.protocol}//${location.host}${feed.href}` : feed.href);
                rssElemClone.find('span').text(feed.name);
                rssContainer.append(rssElemClone);
                rssElemClone.mouseenter(() => {
                    rssElemClone.css('width', rssElemClone.find('span').width() + 30 + 8);
                });
                rssElemClone.mouseleave(() => {
                    rssElemClone.css('width', 30);
                });
            }
            $('body').append(rssContainer);
        } else {
            for (const link of links) {
                fetch(link, {
                    headers: {
                        'User-Agent': 'curl/7.19.7 (x86_64-redhat-linux-gnu) libcurl/7.19.7 NSS/3.14.0.0 zlib/1.2.3'
                    }
                }).then(async (data) => {
                    if (data.ok) {
                        const html = await data.text();
                        logger.debug(link);
                        if (html.startsWith('<rss') || html.includes('\n<feed xmlns=')) {
                            const rssElemClone = rssElem.clone();
                            rssElemClone.href(data.url);
                            rssElemClone.find('span').text(html.match(/title>(.+)<\/title/)[1]);
                            rssContainer.append(rssElemClone);
                            rssElemClone.mouseenter(() => {
                                rssElemClone.css('width', rssElemClone.find('span').width() + 30 + 8);
                            });
                            rssElemClone.mouseleave(() => {
                                rssElemClone.css('width', 30);
                            });
                        }
                    }
                }).catch((data) => {
                    logger.debug(data);
                });
                $('body').append(rssContainer);
            }
        }
    });
    GM_addStyle(__webpack_require__(34).toString());
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(16)(false);
// imports


// module
exports.push([module.i, "#rss-helper{display:grid;justify-items:end;grid-gap:8px;position:fixed;bottom:128px;z-index:12000;right:0;font-size:14px;color:#212121!important;line-height:24px}#rss-helper .rss-item{display:-webkit-box;display:-webkit-flex;display:flex;width:30px;box-sizing:border-box;border-bottom-left-radius:4px;border-top-left-radius:4px;background-color:#f8f8f8;overflow:hidden;padding:3px 4px;box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);-webkit-transition:125ms ease-in-out;transition:125ms ease-in-out}#rss-helper .rss-item svg{min-width:24px}#rss-helper .rss-item span{margin-left:4px;white-space:nowrap;opacity:0;-webkit-transition:125ms ease-in-out;transition:125ms ease-in-out}#rss-helper .rss-item:hover{box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)}#rss-helper .rss-item:hover span{opacity:1}", ""]);

// exports


/***/ })
/******/ ]);