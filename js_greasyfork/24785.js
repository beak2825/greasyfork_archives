// ==UserScript==
// @name         myshows-rarbg
// @description  Adds torrent links from rarbg.to
// @version      1.0.1
// @match        https://myshows.me/profile/
// @match        https://*.myshows.me/profile/
// @grant        GM_xmlhttpRequest
// @connect      rarbg.to
// @connect      rarbgmirror.xyz
// @namespace https://greasyfork.org/users/79557
// @downloadURL https://update.greasyfork.org/scripts/24785/myshows-rarbg.user.js
// @updateURL https://update.greasyfork.org/scripts/24785/myshows-rarbg.meta.js
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
	    return { next: verb(0), "throw": verb(1), "return": verb(2) };
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [0, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var search_1 = __webpack_require__(1);
	var visit_1 = __webpack_require__(4);
	var popup_1 = __webpack_require__(6);
	var dom_helpers_1 = __webpack_require__(7);
	document.addEventListener('click', function (ev) {
	    dom_helpers_1.toArray(document.querySelectorAll('.buttonPopup')).forEach(function (div) {
	        div.classList.remove('_hover');
	    });
	});
	var padLeft = function (n) { return ('00' + n).slice(-2); };
	visit_1.default(function (ep, td) {
	    var popup = new popup_1.default(td, ep);
	    var isLoaded = false;
	    popup.onOpen = function (ep) {
	        return __awaiter(this, void 0, void 0, function () {
	            var query, items;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (isLoaded) {
	                            return [2 /*return*/];
	                        }
	                        isLoaded = true;
	                        query = ep.showTitle + " s" + padLeft(ep.seasonNo) + "e" + padLeft(ep.episodeNo);
	                        return [4 /*yield*/, search_1.default(query + ' 1080p web-dl')];
	                    case 1:
	                        items = _a.sent();
	                        if (!!items.length)
	                            return [3 /*break*/, 3];
	                        return [4 /*yield*/, search_1.default(query + ' 1080p ')];
	                    case 2:
	                        items = _a.sent();
	                        _a.label = 3;
	                    case 3:
	                        if (!!items.length)
	                            return [3 /*break*/, 5];
	                        return [4 /*yield*/, search_1.default(query + ' 720p')];
	                    case 4:
	                        items = _a.sent();
	                        _a.label = 5;
	                    case 5:
	                        if (items.length) {
	                            items.forEach(function (item) {
	                                popup.addResult({
	                                    title: item.title,
	                                    url: item.torrentUrl
	                                });
	                            });
	                        }
	                        else {
	                            popup.noResults();
	                        }
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
	    return { next: verb(0), "throw": verb(1), "return": verb(2) };
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [0, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var torrent_item_1 = __webpack_require__(2);
	var get_1 = __webpack_require__(3);
	function search(query) {
	    return __awaiter(this, void 0, void 0, function () {
	        var url, result, rarbgPage, rows, rowArray, items;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    url = "https://rarbg.to/torrents.php?search=" + query;
	                    return [4 /*yield*/, get_1.default(url)];
	                case 1:
	                    result = _a.sent();
	                    rarbgPage = document.createElement('html');
	                    rarbgPage.innerHTML = result.responseText;
	                    rows = rarbgPage.querySelectorAll('table.lista2t tr.lista2');
	                    rowArray = Array.prototype.slice.call(rows);
	                    items = rowArray.map(createItem);
	                    return [2 /*return*/, items];
	            }
	        });
	    });
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = search;
	function createItem(tr) {
	    var item = new torrent_item_1.default();
	    var anchor = tr.querySelector('a[href^="/torrent/"]');
	    item.id = anchor.getAttribute('href').replace('/torrent/', '');
	    item.title = anchor.textContent;
	    item.size = tr.querySelector('td:nth-child(4)').textContent;
	    item.seeders = parseInt(tr.querySelector('td:nth-child(5)').textContent, 10);
	    item.leechers = parseInt(tr.querySelector('td:nth-child(6)').textContent, 10);
	    item.commentsCount = parseInt(tr.querySelector('td:nth-child(7)').textContent, 10) || 0;
	    item.uploader = tr.querySelector('td:nth-child(8)').textContent;
	    return item;
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var urlRoot = 'https://rarbg.to';
	var TorrentItem = (function () {
	    function TorrentItem() {
	    }
	    Object.defineProperty(TorrentItem.prototype, "infoUrl", {
	        get: function () {
	            return urlRoot + "/torrent/" + this.id;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TorrentItem.prototype, "torrentUrl", {
	        get: function () {
	            return urlRoot + "/download.php?id=" + this.id + "&f=" + this.title + "-[rarbg.com].torrent";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return TorrentItem;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = TorrentItem;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	function get(url) {
	    return new Promise(function (resolve, reject) {
	        GM_xmlhttpRequest({
	            method: 'GET',
	            url: url,
	            onload: resolve,
	            onerror: reject,
	            headers: {
	                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
	            }
	        });
	    });
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = get;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var episode_1 = __webpack_require__(5);
	function visit(visitor) {
	    visitor = visitor || (function () { });
	    var rows = document.querySelectorAll('tr[data-id]'), rowArray = Array.prototype.slice.call(rows), episodes = rowArray.map(function (x) { return ({
	        episode: createEpisode(x),
	        element: x
	    }); });
	    episodes.forEach(function (_a) {
	        var episode = _a.episode, element = _a.element;
	        var td = element.lastElementChild;
	        visitor(episode, td);
	    });
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = visit;
	function createEpisode(tr) {
	    var seasonBody = tr.parentElement.parentElement.parentElement;
	    var seasonHeader = seasonBody.previousElementSibling;
	    var seasonBlock = seasonBody.parentElement;
	    var showId = seasonBlock.dataset['showId'];
	    var showHeader = document.querySelector("h2#s" + showId);
	    var showTitle = showHeader.querySelector('.subHeader').textContent || showHeader.querySelector('a').textContent;
	    var seasonAndEpisodeNo = tr.firstElementChild.textContent.split('x');
	    var ep = new episode_1.default();
	    ep.showTitle = showTitle;
	    ep.seasonNo = parseInt(seasonAndEpisodeNo[0], 10);
	    ep.episodeNo = parseInt(seasonAndEpisodeNo[1], 10);
	    return ep;
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	var Episode = (function () {
	    function Episode() {
	    }
	    Episode.prototype.toString = function () {
	        return this.showTitle + " " + this.seasonNo + "x" + this.episodeNo;
	    };
	    return Episode;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Episode;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var dom_helpers_1 = __webpack_require__(7);
	var Popup = (function () {
	    function Popup(td, episode) {
	        this.td = td;
	        this.episode = episode;
	        this.mount();
	    }
	    Popup.prototype.mount = function () {
	        while (this.td.hasChildNodes()) {
	            this.td.removeChild(this.td.lastChild);
	        }
	        this.popupButton = document.createElement('div');
	        this.popupButton.classList.add('buttonPopup', '_download', '_compact');
	        this.popupButton.addEventListener('click', this.handleClick.bind(this));
	        this.td.appendChild(this.popupButton);
	        this.resultList = document.createElement('ul');
	        this.popupButton.appendChild(this.resultList);
	    };
	    Popup.prototype.handleClick = function (ev) {
	        var _this = this;
	        ev.stopPropagation();
	        var buttons = document.querySelectorAll('.buttonPopup');
	        dom_helpers_1.toArray(buttons).forEach(function (el) {
	            if (el != _this.popupButton) {
	                el.classList.remove('_hover');
	            }
	        });
	        this.popupButton.classList.toggle('_hover');
	        this.onOpen && this.onOpen(this.episode);
	    };
	    Popup.prototype.noResults = function () {
	        var li = document.createElement('li');
	        this.resultList.appendChild(li);
	        var a = document.createElement('a');
	        a.textContent = 'No results';
	        li.appendChild(a);
	    };
	    Popup.prototype.addResult = function (item) {
	        var li = document.createElement('li');
	        this.resultList.appendChild(li);
	        var a = document.createElement('a');
	        a.textContent = item.title;
	        a.href = item.url;
	        li.appendChild(a);
	    };
	    return Popup;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Popup;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	function toArray(nodeList) {
	    return Array.prototype.slice.call(nodeList);
	}
	exports.toArray = toArray;


/***/ }
/******/ ]);