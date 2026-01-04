// ==UserScript==
// @name              WaniKani Vocab Beyond
// @author            Norman Sue
// @description       Shows WWWJDIC vocab with Forvo audio for each kanji in lessons, reviews, and kanji pages. A paid Forvo API key is required for audio.
// @version           0.6.0
// @update            4/28/2019, 7:24:38 PM
// @grant             GM_xmlhttpRequest
// @include           https://www.wanikani.com/*
// @run-at            document-start
// @namespace         https://greasyfork.org/en/users/56591-normful
// @connect           nihongo.monash.edu
// @connect           apifree.forvo.com
// @license           The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/372737/WaniKani%20Vocab%20Beyond.user.js
// @updateURL https://update.greasyfork.org/scripts/372737/WaniKani%20Vocab%20Beyond.meta.js
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

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gm_http_1 = __webpack_require__(1);
var app_1 = __webpack_require__(2);
// Set `debug: true` to enable GM.xmlHttpRequest logging
gm_http_1.default.setConfig({ debug: true });
var app = new app_1.App();
app.init();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Created by axetroy on 17-6-23.
 */
/// <reference path="./index.d.ts" />
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function isFunction(func) {
    return typeof func === 'function';
}
var Http = (function () {
    function Http(config) {
        if (config === void 0) { config = {}; }
        this.config = config;
    }
    Http.prototype.setConfig = function (config) {
        if (config === void 0) { config = {}; }
        this.config = __assign({}, this.config, config);
    };
    Http.prototype.create = function (config) {
        return new Http(config);
    };
    Http.prototype.request = function (method, url, data, header, config) {
        var _this = this;
        if (data === void 0) { data = ''; }
        if (header === void 0) { header = {}; }
        if (config === void 0) { config = {}; }
        return new Promise(function (resolve, reject) {
            var commonRequestConfig = {
                method: method,
                url: url,
                data: data,
                header: header
            };
            var GM_xmlhttpRequestConfig = __assign({}, commonRequestConfig, config, _this.config);
            var onreadystatechange = GM_xmlhttpRequestConfig.onreadystatechange, onerror = GM_xmlhttpRequestConfig.onerror, onabort = GM_xmlhttpRequestConfig.onabort, ontimeout = GM_xmlhttpRequestConfig.ontimeout;
            GM_xmlhttpRequestConfig.synchronous = true; // async
            GM_xmlhttpRequestConfig.onreadystatechange = function (response) {
                try {
                    isFunction(onreadystatechange) &&
                        onreadystatechange.call(this, response);
                }
                catch (err) {
                    reject(err);
                }
                if (response.readyState !== 4)
                    return;
                response.status >= 200 && response.status < 400
                    ? resolve(response)
                    : reject(response);
            };
            GM_xmlhttpRequestConfig.onerror = function (response) {
                try {
                    isFunction(onerror) && onerror.call(this, response);
                    reject(response);
                }
                catch (err) {
                    reject(err);
                }
            };
            GM_xmlhttpRequestConfig.onabort = function (response) {
                try {
                    isFunction(onabort) && onabort.call(this, response);
                    reject(response);
                }
                catch (err) {
                    reject(err);
                }
            };
            GM_xmlhttpRequestConfig.ontimeout = function (response) {
                try {
                    isFunction(ontimeout) && ontimeout.call(this, response);
                    reject(response);
                }
                catch (err) {
                    reject(err);
                }
            };
            if (_this.config.debug) {
                console.log("%c[" + commonRequestConfig.method.toUpperCase() + "]%c: " + commonRequestConfig.url, 'color: green', 'color: #000;text-style: under-line');
            }
            GM_xmlhttpRequest(__assign({}, GM_xmlhttpRequestConfig));
        });
    };
    Http.prototype.get = function (url, data, header, config) {
        return this.request('GET', url, data, header, config);
    };
    Http.prototype.post = function (url, data, header, config) {
        return this.request('POST', url, data, header, config);
    };
    Http.prototype.put = function (url, data, header, config) {
        return this.request('PUT', url, data, header, config);
    };
    Http.prototype['delete'] = function (url, data, header, config) {
        return this.request('DELETE', url, data, header, config);
    };
    Http.prototype.head = function (url, data, header, config) {
        return this.request('HEAD', url, data, header, config);
    };
    return Http;
}());
exports.Http = Http;
var timeout = 5000;
exports.timeout = timeout;
var http = new Http({ timeout: timeout });
exports.http = http;
exports.default = http;


/***/ })
/******/ ]);
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var runAllWkofDependentCode_1 = __webpack_require__(3);
var App = /** @class */ (function () {
    function App() {
    }
    App.prototype.init = function () {
        addEventListener("DOMContentLoaded", this.onDomContentLoaded.bind(this));
    };
    App.prototype.onDomContentLoaded = function () {
        runAllWkofDependentCode_1.runAllWkofDependentCode();
    };
    return App;
}());
exports.App = App;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(4);
var appConstants_1 = __webpack_require__(5);
var insertInitialDOMElements_1 = __webpack_require__(6);
var waitForWkof_1 = __webpack_require__(21);
var wkofConstants_1 = __webpack_require__(24);
var Log = new logger_1.Logger();
function runAllWkofDependentCode() {
    waitForWkof_1.waitForWkof(appConstants_1.prettyScriptName, function (wkof) {
        wkof.include("Menu,Settings");
        wkof.ready("Menu,Settings").then(function () {
            wkof.Menu.insert_script_link({
                name: wkofConstants_1.MenuScriptLinkId,
                submenu: "Settings",
                title: "Vocab Beyond",
                on_click: onSettingsMenuLinkClick.bind(null, wkof)
            });
            wkof.Settings.load(wkofConstants_1.SettingsScriptId).then(function (settings) {
                insertInitialDOMElements_1.insertInitialDOMElements(settings);
            });
        });
    });
}
exports.runAllWkofDependentCode = runAllWkofDependentCode;
function onSettingsMenuLinkClick(wkof) {
    var dialog = new wkof.Settings(__assign({}, wkofConstants_1.WkofSettingsMenuConfig, { on_save: onSettingsSave.bind(null, wkof) }));
    dialog.open();
}
function onSettingsSave(wkof) {
    window.location.reload(false);
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-console */
Object.defineProperty(exports, "__esModule", { value: true });
var logPrefix = "[WKVB] ";
var Logger = /** @class */ (function () {
    function Logger() {
        this.prefix = logPrefix;
        this.disableLogging = false; // Set to false for development
    }
    Logger.prototype.debug = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.disableLogging) {
            return;
        }
        console.debug.apply(console, [this.prefix + msg].concat(args));
    };
    Logger.prototype.info = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.disableLogging) {
            return;
        }
        console.log.apply(console, [this.prefix + msg].concat(args));
    };
    Logger.prototype.warn = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.disableLogging) {
            return;
        }
        console.warn.apply(console, [this.prefix + msg].concat(args));
    };
    Logger.prototype.error = function (msg) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this.disableLogging) {
            return;
        }
        console.error.apply(console, [this.prefix + msg].concat(args));
    };
    return Logger;
}());
exports.Logger = Logger;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyScriptName = "WaniKani Vocab Beyond";


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(4);
var determinePageType_1 = __webpack_require__(7);
var domConstants_1 = __webpack_require__(8);
var queryWwwjdicThenInsertParsedResults_1 = __webpack_require__(9);
var Log = new logger_1.Logger();
function insertInitialDOMElements(settings) {
    Log.debug("insertInitialDOMElements called");
    var pageType = determinePageType_1.determinePageType(document.URL);
    if (pageType === determinePageType_1.PageType.kanji && !settings.show_vocab_beyond_first) {
        insertPageListHeaderLink();
    }
    maybeLoadVocabDependingOnPage(pageType, settings);
}
exports.insertInitialDOMElements = insertInitialDOMElements;
var insertedPageListHeaderLink = false;
function insertPageListHeaderLink() {
    Log.debug("insertPageListHeaderLink called");
    if (insertedPageListHeaderLink) {
        return;
    }
    var header = $(".page-list-header");
    var listItem = $("<li>");
    var link = $("<a href='#" + domConstants_1.sectionHeaderID + "''>Vocab Beyond</a>");
    listItem.append(link);
    // Other scripts may have altered this list, so just insert this link at the end
    listItem.insertAfter(header.siblings().last());
    insertedPageListHeaderLink = true;
}
function maybeLoadVocabDependingOnPage(pageType, settings) {
    Log.debug("maybeLoadVocabDependingOnPage called");
    if (pageType === determinePageType_1.PageType.other) {
        Log.debug("maybeLoadVocabDependingOnPage returning early. PageType.other");
        return;
    }
    var optAttrs = { attributes: true };
    var optChildList = { childList: true };
    if (pageType === determinePageType_1.PageType.kanji) {
        Log.debug("maybeLoadVocabDependingOnPage PageType.kanji");
        createSectionAndRunQuery(settings);
    }
    else if (pageType === determinePageType_1.PageType.reviews) {
        Log.debug("maybeLoadVocabDependingOnPage PageType.reviews");
        var ob = new MutationObserver(function (mutationRecords) {
            mutationRecords.forEach(checkReviewMut.bind(null, settings));
        });
        // Observe the element that is mutated after clicking the
        // Item Info icon with the eye on it
        ob.observe(document.getElementById("item-info-col2"), optChildList);
    }
    else if (pageType === determinePageType_1.PageType.lessons) {
        Log.debug("maybeLoadVocabDependingOnPage PageType.lessons");
        var obs = new MutationObserver(function (mutationRecords) {
            if (isKanjiLesson()) {
                createSectionAndRunQuery(settings);
            }
            else {
                Log.debug("not doing anything because not kanji lesson");
            }
        });
        // Observe the 3 elements for the 3 lesson types, that are modified
        // when switching to each new lesson item
        obs.observe(document.getElementById("supplement-rad"), optAttrs);
        obs.observe(document.getElementById("supplement-kan"), optAttrs);
        obs.observe(document.getElementById("supplement-voc"), optAttrs);
    }
}
function createSectionAndRunQuery(settings) {
    var emptySection = maybeInsertEmptyVocabSectionOnce(settings);
    queryWwwjdicThenInsertParsedResults_1.queryWwwjdicThenInsertParsedResults(settings, emptySection);
}
function isKanjiLesson() {
    var mainInfo = document.getElementById("main-info");
    return mainInfo && mainInfo.className === "kanji";
}
var createdSectionForKanjiReview = false;
function checkReviewMut(settings, mutationRecord) {
    var isKanjiReview = $("#question-type")
        .text()
        .toLowerCase()
        .includes("kanji");
    if (mutationRecord.target.id.includes("item-info") &&
        isKanjiReview &&
        !createdSectionForKanjiReview) {
        createdSectionForKanjiReview = true;
        createSectionAndRunQuery(settings);
    }
}
function maybeInsertEmptyVocabSectionOnce(settings) {
    var pageType = determinePageType_1.determinePageType(document.URL);
    Log.debug("maybeInsertEmptyVocabSectionOnce pageType", pageType);
    if ($("#" + domConstants_1.sectionID).length === 0) {
        var sectionHTML = "<section>" +
            '<h2 id="' +
            domConstants_1.sectionHeaderID +
            '">Vocab Beyond</h2>' +
            '<div id="' +
            domConstants_1.sectionID +
            '"></div>' +
            "</section>";
        if (pageType === determinePageType_1.PageType.kanji) {
            Log.debug("maybeInsertEmptyVocabSectionOnce inserting for kanji page");
            var informationSection = $("#information");
            if (settings.show_vocab_beyond_first) {
                $(sectionHTML).insertAfter(informationSection);
            }
            else {
                var lastSection = informationSection.siblings().last();
                $(sectionHTML).insertAfter(lastSection);
            }
        }
        else if (pageType === determinePageType_1.PageType.reviews) {
            Log.debug("maybeInsertEmptyVocabSectionOnce inserting for reviews page");
            if (settings.show_vocab_beyond_first) {
                $("#item-info-col2").prepend(sectionHTML);
            }
            else {
                $("#item-info-col2").append(sectionHTML);
            }
        }
        else if (pageType === determinePageType_1.PageType.lessons) {
            Log.debug("maybeInsertEmptyVocabSectionOnce inserting for lessons page");
            if (settings.show_vocab_beyond_first) {
                $("#supplement-kan-breakdown .col1").append(sectionHTML);
            }
            else {
                $("#supplement-kan-related-vocabulary .col1").append(sectionHTML);
            }
        }
        else {
            Log.debug("maybeInsertEmptyVocabSectionOnce not inserting because page type does not match");
        }
    }
    return $("#" + domConstants_1.sectionID);
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PageType;
(function (PageType) {
    PageType[PageType["other"] = 0] = "other";
    PageType[PageType["radicals"] = 1] = "radicals";
    PageType[PageType["kanji"] = 2] = "kanji";
    PageType[PageType["vocabulary"] = 3] = "vocabulary";
    PageType[PageType["reviews"] = 4] = "reviews";
    PageType[PageType["reviewsSummary"] = 5] = "reviewsSummary";
    PageType[PageType["lessons"] = 6] = "lessons";
    PageType[PageType["lessonsReviews"] = 7] = "lessonsReviews";
})(PageType = exports.PageType || (exports.PageType = {}));
function determinePageType(url) {
    if (/\/radicals\/./.test(url)) {
        return PageType.radicals;
    }
    else if (/com\/kanji\/./.test(url)) {
        return PageType.kanji;
    }
    else if (/com\/vocabulary\/./.test(url)) {
        return PageType.vocabulary;
    }
    else if (/com\/review\/session/.test(url)) {
        return PageType.reviews;
    }
    else if (/com\/review/.test(url)) {
        return PageType.reviewsSummary;
    }
    else if (/com\/lesson\/./.test(url)) {
        return PageType.lessons;
    }
    // TODO: Figure out what URL lessonsReviews is for
    return PageType.other;
}
exports.determinePageType = determinePageType;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionHeaderID = "wanikani_vocab_beyond_section_header";
exports.sectionID = "wanikani_vocab_beyond_section";


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gm_http_1 = __webpack_require__(1);
var logger_1 = __webpack_require__(4);
var determinePageType_1 = __webpack_require__(7);
var getKanji_1 = __webpack_require__(10);
var makeWwwjdicUrl_1 = __webpack_require__(11);
var parsing_1 = __webpack_require__(12);
var insertForvoAudioForWord_1 = __webpack_require__(19);
var Log = new logger_1.Logger();
var cachedSections = {};
var DISABLE_FORVO_DEFAULT = false;
function shouldDisableForvo(settings) {
    var retVal = DISABLE_FORVO_DEFAULT;
    if (!settings.forvo_api_key || settings.forvo_api_key === "") {
        retVal = true;
    }
    Log.debug("shouldDisableForvo", retVal);
    return retVal;
}
function queryWwwjdicThenInsertParsedResults(settings, emptySection) {
    Log.debug("queryWwwjdic");
    if (!emptySection.length) {
        Log.debug("queryWwwjdicThenInsertParsedResults returning early because emptySection has no elements");
        return;
    }
    var pageType = determinePageType_1.determinePageType(document.URL);
    var kanji = getKanji_1.getKanji(pageType);
    if (!kanji) {
        Log.error("queryWwwjdicThenInsertParsedResults could not get kanji");
        return;
    }
    if (cachedSections[kanji]) {
        Log.debug("queryWwwjdicThenInsertParsedResults reusing cachedSection and returning early");
        emptySection.replaceWith(cachedSections[kanji]);
        return;
    }
    var showMessage = function (message) {
        emptySection.html(message);
    };
    showMessage("Loading...");
    Log.debug("Querying WWWJDIC for ", kanji);
    var wwwJdicUrl = makeWwwjdicUrl_1.makeWwwjdicUrl(kanji, settings);
    gm_http_1.default
        .get(wwwJdicUrl)
        .then(function (res) {
        onWwwJdicResponse(res.responseText, emptySection, showMessage, settings, kanji);
    })
        .catch(function (err) {
        Log.error("WWWJDIC error: ", err);
        showMessage("Error contacting WWWJDIC server");
    });
}
exports.queryWwwjdicThenInsertParsedResults = queryWwwjdicThenInsertParsedResults;
var appendedForvoAttribution = false;
function onWwwJdicResponse(res, section, showMessage, settings, kanji) {
    Log.debug("onWwwJdicResponse raw res", res);
    var lines = parsing_1.extractLines(res);
    if (lines.length === 0) {
        showMessage(settings.show_all_wwwjdic_vocab
            ? "No vocabulary found."
            : "No common vocabulary found.");
        return;
    }
    // Clear loading text
    showMessage("");
    var renderables = parsing_1.parseLines(lines);
    var maybeOnlyCommonRenderables = renderables.filter(function (renderable) {
        if (settings.show_all_wwwjdic_vocab) {
            return true;
        }
        var isCommon = renderable.cm;
        return isCommon;
    });
    Log.debug("WWWJDIC maybeOnlyCommonRenderables.length", maybeOnlyCommonRenderables.length);
    var sliceEnd = maybeOnlyCommonRenderables.length;
    var limit = settings.max_wwwjdic_vocab_shown;
    if (limit > 0) {
        sliceEnd = limit;
    }
    var renderablesWithinLimit = maybeOnlyCommonRenderables.slice(0, sliceEnd);
    Log.debug("WWWJDIC renderablesWithinLimit.length", renderablesWithinLimit.length);
    Log.debug("WWWJDIC renderablesWithinLimit", renderablesWithinLimit);
    var disableForvo = shouldDisableForvo(settings);
    if (!disableForvo) {
        insertForvoAudioForWord_1.populateForvoUserWhitelist(settings);
    }
    var promises = renderablesWithinLimit.map(function (renderable) {
        var jpText = renderable.jp;
        var enPOSText = renderable.pos;
        var isCommon = renderable.cm;
        var definitions = renderable.en;
        var vocabForQueryingForvo = renderable.q;
        var listItem = $("<div>");
        listItem.css({ marginBottom: "35px" });
        var jpEl = $("<h3>");
        var _loop_1 = function (codePoint) {
            var span = $("<span>");
            span.text(codePoint);
            var codePointInt = codePoint.codePointAt(0);
            span.css("font-size", shouldRenderBig(codePointInt) ? "45px" : "11px");
            // Clicking on kanji opens page for it
            if (isKanjiCodePoint(codePointInt)) {
                span.on("click", function () {
                    window.open("https://www.wanikani.com/kanji/" + encodeURIComponent(codePoint), "_blank");
                });
                span.hover(function () {
                    $(this).css("cursor", "pointer");
                });
            }
            span.css({
                fontWeight: "normal",
                lineHeight: "45px"
            });
            jpEl.append(span);
        };
        // for...of iterates over Unicode code points
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/@@iterator
        for (var _i = 0, jpText_1 = jpText; _i < jpText_1.length; _i++) {
            var codePoint = jpText_1[_i];
            _loop_1(codePoint);
        }
        if (!isCommon && !settings.hide_uncommon_indicator) {
            // uncommon vocab indicator
            var uc = $("<span>");
            uc.text("稀");
            uc.css({
                position: "absolute",
                display: "block",
                fontSize: "12px",
                height: "22px",
                width: "22px",
                top: "0",
                left: "-25px",
                margin: "0",
                padding: "0",
                boxSizing: "border-box",
                borderRadius: "50%",
                textAlign: "center",
                lineHeight: "22px",
                textShadow: "0.7px 0.2px 4.1px #FFF9DE",
                backgroundColor: "#E38B32",
                boxShadow: "0 -3px 0 rgba(0,0,0,0.2) inset, 0 0 10px rgba(255,255,255,0.5)",
                color: "#F41300",
                zIndex: "999"
            });
            jpEl.append(uc);
        }
        jpEl.css({
            position: "relative",
            marginTop: "20px",
            marginRight: "0",
            marginBottom: "15px",
            marginLeft: "0",
            padding: "0"
        });
        listItem.append(jpEl);
        var enPOSEl = $("<h3>");
        enPOSEl.text(enPOSText);
        enPOSEl.css({
            fontSize: "20px",
            fontWeight: "normal",
            lineHeight: "20px",
            padding: "0"
        });
        listItem.append(enPOSEl);
        definitions.forEach(function (definition) {
            var enDefnEl = $("<p>");
            enDefnEl.text(definition);
            enDefnEl.css({
                margin: "0",
                padding: "0"
            });
            listItem.append(enDefnEl);
        });
        section.append(listItem);
        if (!disableForvo) {
            return insertForvoAudioForWord_1.insertForvoAudioForWord(vocabForQueryingForvo, settings, listItem);
        }
        return Promise.resolve();
    });
    Promise.all(promises).then(function () {
        if (!disableForvo && !appendedForvoAttribution) {
            var forvoAttribution = $('<p><a href="https://forvo.com/" target="_blank">Pronunciations by Forvo</a></p>');
            section.append(forvoAttribution);
            appendedForvoAttribution = true;
        }
        var sectionDeepClone = section.clone(true, true);
        cachedSections[kanji] = sectionDeepClone;
    });
}
function isKanjiCodePoint(codePointInt) {
    return codePointInt >= 19968 && codePointInt <= 40879;
}
function shouldRenderBig(codePointInt) {
    // Determined from "\u3040".codePointAt(0)
    // All other hiragana, katakana, kanji have higher code points
    var firstHiraganaCodePointInt = 12352;
    if (codePointInt > firstHiraganaCodePointInt) {
        return true;
    }
    var punctuationToRenderBig = [
        11816,
        11817,
        12289,
        12293 // repeater
    ];
    if (punctuationToRenderBig.includes(codePointInt)) {
        return true;
    }
    return false;
}
exports.shouldRenderBig = shouldRenderBig;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var determinePageType_1 = __webpack_require__(7);
function getKanji(pageType) {
    switch (pageType) {
        case determinePageType_1.PageType.kanji:
            return document.title[document.title.length - 1];
        case determinePageType_1.PageType.reviews:
            var curItem = $.jStorage.get("currentItem");
            if ("kan" in curItem) {
                return curItem.kan.trim();
            }
            else {
                return null;
            }
        case determinePageType_1.PageType.lessons:
            var kanjiNode = $("#character");
            if (kanjiNode === undefined || kanjiNode === null) {
                return null;
            }
            return kanjiNode.text().trim();
    }
    return null;
}
exports.getKanji = getKanji;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// API Docs: http://www.edrdg.org/wwwjdic/wwwjdicinf.html#backdoor_tag
function makeWwwjdicUrl(kanji, settings) {
    var encodedKanji = encodeURIComponent(kanji);
    var useEDICT = "1";
    var useBackdoorEntryRawOutput = "Z";
    var searchType;
    var dictionaryLookupWithUTF8LookupText = "U";
    searchType = dictionaryLookupWithUTF8LookupText;
    var keyType;
    var lookupKanjiInAnyPosition = "L";
    keyType = lookupKanjiInAnyPosition;
    var queryCode = useEDICT + useBackdoorEntryRawOutput + searchType + keyType;
    return ("http://nihongo.monash.edu/cgi-bin/wwwjdic?" + queryCode + encodedKanji);
}
exports.makeWwwjdicUrl = makeWwwjdicUrl;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vocab_header_1 = __webpack_require__(13);
var part_of_speech_1 = __webpack_require__(17);
var definition_line_1 = __webpack_require__(18);
function extractLines(rawResponseText) {
    if (rawResponseText.indexOf("No matches were found for this key") > -1) {
        return [];
    }
    var noHeader = rawResponseText.slice(rawResponseText.indexOf("<pre>") + 6);
    var preBody = noHeader.slice(0, noHeader.indexOf("</pre>") - 1);
    return preBody.split(/\r?\n/);
}
exports.extractLines = extractLines;
var commonP = /(.*)\/\(P\)$/;
function parseLines(lines) {
    return lines.map(function (untrimmed) {
        var line = untrimmed.trim();
        // Extract vocab header
        var sepIdx = line.indexOf(" /");
        var vocabHeader = line.substring(0, sepIdx);
        var rest = line.substring(sepIdx + 2);
        // Extract part of speech
        var firstRightParen = rest.indexOf(")");
        var partOfSpeech = rest.substring(1, firstRightParen);
        var englishAndMaybeCommonP = rest.substring(firstRightParen + 2, rest.length - 1);
        // Extract common indicator from end of line
        var commonMatches = englishAndMaybeCommonP.match(commonP);
        var isCommon;
        var english;
        if (commonMatches) {
            isCommon = true;
            english = commonMatches[1].replace(/\//g, "; ");
        }
        else {
            isCommon = false;
            english = englishAndMaybeCommonP.replace(/\//g, "; ");
        }
        var definitions = [];
        var thisDefn;
        if (english.indexOf("(1) ") === 0) {
            var nextDefNum = 2;
            var cur = 0; // index of start of current definition text
            var next = 0; // index of start of next definition text
            while (true) {
                next = english.indexOf("(" + nextDefNum + ")", cur);
                if (next > -1) {
                    thisDefn = english.substring(cur, next - 1);
                    definitions.push(definition_line_1.formatDefinitionLine(dottedListItem(thisDefn)));
                    nextDefNum++;
                    cur = next;
                }
                else {
                    thisDefn = english.substring(cur);
                    definitions.push(definition_line_1.formatDefinitionLine(dottedListItem(thisDefn)));
                    break;
                }
            }
        }
        else {
            definitions.push(definition_line_1.formatDefinitionLine(english));
        }
        return {
            jp: vocab_header_1.formatVocabHeader(vocabHeader),
            pos: part_of_speech_1.formatPartOfSpeech(partOfSpeech),
            cm: isCommon,
            en: definitions,
            q: extractVocab(vocabHeader)
        };
    });
}
exports.parseLines = parseLines;
var parenListItemRegExp = /\((\d+)\)(.*)/;
function dottedListItem(text) {
    var matches = text.match(parenListItemRegExp);
    if (!matches) {
        return text;
    }
    return matches[1] + "." + matches[2].replace(/;$/, "");
}
// 3040-309F: hiragana
// 30A0-30FF: katakana
// 4E00-9FAF: common and uncommon kanji
var jpRegex = /([\u3040-\u309F]|[\u30A0-\u30FF]|[\u4E00-\u9FAF])+/;
function extractVocab(jpText) {
    var matches = jpText.match(jpRegex);
    return matches ? matches[0] : jpText;
}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vocab_1 = __webpack_require__(14);
var pronunciation_1 = __webpack_require__(16);
var pronunciationSplitter = /(.*)\[(.+)\]$/;
function formatVocabHeader(text) {
    var m = text.match(pronunciationSplitter);
    if (!m) {
        return text;
    }
    return vocab_1.formatVocab(m[1].trim()) + pronunciation_1.formatPronunciation(m[2]);
}
exports.formatVocabHeader = formatVocabHeader;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dict_codes_1 = __webpack_require__(15);
var dictCodeSplitter = /(.*)\(([a-z,A-Z-,0-9]+)\)$/;
function formatVocab(words) {
    return words
        .replace(/\(P\)/g, "(common)")
        .split(";")
        .map(function (word) {
        var trimmed = word.trim();
        var m = trimmed.trim().match(dictCodeSplitter);
        if (!m) {
            return trimmed;
        }
        return m[1] + "(" + (dict_codes_1.DICT_CODES[m[2]] || m[2]) + ")";
    })
        .join("、");
}
exports.formatVocab = formatVocab;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DICT_CODES = {
    abbr: "abbreviation",
    "adj-f": "noun or verb acting prenominally",
    "adj-i": "i-adjective",
    "adj-kari": "'kari' adjective (archaic)",
    "adj-ku": "'ku' adjective (archaic)",
    "adj-na": "na-adjective",
    "adj-nari": "archaic/formal form of na-adjective",
    "adj-no": "no-adjective",
    "adj-pn": "pre-noun adjectival (rentaishi)",
    "adj-s": "special adjective",
    "adj-shiku": "'shiku' adjective (archaic)",
    "adj-t": "'taru' adjective",
    adv: "adverb",
    "adv-n": "adverbial noun",
    "adv-to": "adverb taking the と particle",
    an: "adjectival noun (keiyoudoushi)",
    anat: "anatomical term",
    arch: "archaism",
    archit: "architecture term",
    astron: "astronomy term",
    ateji: "ateji reading",
    aux: "auxiliary",
    "aux-adj": "auxiliary adjective",
    "aux-v": "auxiliary verb",
    baseb: "baseball term",
    biol: "biology term",
    bot: "botany term",
    Buddh: "Buddhist term",
    bus: "business term",
    c: "company name",
    chem: "chemistry term",
    chn: "children's language",
    col: "colloquialism",
    comp: "computer terminology",
    conj: "conjunction",
    ctr: "counter",
    derog: "derogatory word or expression",
    econ: "economics term",
    eK: "exclusively written in kanji",
    engr: "engineering term",
    exp: "expression",
    f: "female given name",
    fam: "familiar language",
    fem: "female term or language",
    finc: "finance term",
    food: "food term",
    g: "given name, as-yet not classified by sex",
    geol: "geology term",
    geom: "geometry term",
    gikun: "gikun (meaning) reading",
    gram: "grammatical term",
    h: "full (family plus given) name of a person",
    hob: "Hokkaido-ben",
    hon: "honorific language (sonkeigo)",
    hum: "humble language (kenjougo)",
    id: "idiomatic expression",
    ik: "irregular kana",
    iK: "irregular kanji",
    int: "interjection",
    io: "irregular okurigana",
    iv: "irregular verb",
    joc: "jocular, humorous term",
    ksb: "Kansai-ben",
    ktb: "Kantou-ben",
    kyb: "Kyoto-ben",
    kyu: "Kyuushuu-ben",
    law: "law term",
    ling: "linguistics terminology",
    m: "male given name",
    "m-sl": "manga slang",
    MA: "martial arts term",
    male: "male term or language",
    "male-sl": "male slang",
    math: "mathematics",
    med: "medical term",
    mil: "military",
    music: "music term",
    n: "noun",
    "n-adv": "adverbial noun",
    "n-pr": "proper noun",
    "n-pref": "prefix noun",
    "n-suf": "suffix noun",
    "n-t": "temporal noun",
    nab: "Nagano-ben",
    neg: "negative (in a negative sentence, or with negative verb)",
    "neg-v": "negative verb (when used with)",
    num: "numeral",
    o: "organization name",
    obs: "obsolete term",
    obsc: "obscure term",
    ok: "outdated kana",
    oK: "outdated kanji",
    "on-mim": "onomatopoeic or mimetic word",
    osb: "Osaka-ben",
    p: "place-name",
    physics: "physics terminology",
    pn: "pronoun",
    poet: "poetical term",
    pol: "polite language",
    pr: "product name",
    pref: "prefix",
    proverb: "proverb",
    prt: "particle",
    qv: "quod vide (see another entry)",
    rare: "rare",
    rkb: "Ryukyuan language",
    s: "surname",
    sens: "sensitive",
    Shinto: "Shinto term",
    sl: "slang",
    sports: "sports term",
    st: "station name",
    suf: "suffix",
    sumo: "sumo term",
    thb: "Touhoku-ben",
    tsb: "Tosa-ben",
    tsug: "Tsugaru-ben",
    u: "unclassified name",
    uk: "usually written using kana alone",
    uK: "usually written using kanji alone",
    "v-unspec": "verb unspecified",
    v1: "ichidan verb",
    "v2a-s": "nidan verb (archaic)",
    "v2b-k": "nidan verb (archaic)",
    "v2b-s": "nidan verb (archaic)",
    "v2d-k": "nidan verb (archaic)",
    "v2d-s": "nidan verb (archaic)",
    "v2g-k": "nidan verb (archaic)",
    "v2g-s": "nidan verb (archaic)",
    "v2h-k": "nidan verb (archaic)",
    "v2h-s": "nidan verb (archaic)",
    "v2k-k": "nidan verb (archaic)",
    "v2k-s": "nidan verb (archaic)",
    "v2m-k": "nidan verb (archaic)",
    "v2m-s": "nidan verb (archaic)",
    "v2n-s": "nidan verb (archaic)",
    "v2r-k": "nidan verb (archaic)",
    "v2r-s": "nidan verb (archaic)",
    "v2s-s": "nidan verb (archaic)",
    "v2t-k": "nidan verb (archaic)",
    "v2t-s": "nidan verb (archaic)",
    "v2w-s": "nidan verb (archaic)",
    "v2y-k": "nidan verb (archaic)",
    "v2y-s": "nidan verb (archaic)",
    "v2z-s": "nidan verb (archaic)",
    v4b: "yodan verb (archaic)",
    v4g: "yodan verb (archaic)",
    v4h: "yondan verb (archaic)",
    v4k: "yodan verb (archaic)",
    v4m: "yodan verb (archaic)",
    v4n: "yodan verb (archaic)",
    v4r: "yondan verb (archaic)",
    v4s: "yodan verb (archaic)",
    v4t: "yodan verb (archaic)",
    v5aru: "godan verb",
    v5b: "godan verb",
    v5g: "godan verb",
    v5k: "godan verb",
    "v5k-s": "godan verb",
    v5m: "godan verb",
    v5n: "godan verb",
    v5r: "godan verb",
    "v5r-i": "godan verb",
    v5s: "godan verb",
    v5t: "godan verb",
    v5u: "godan verb",
    "v5u-s": "godan verb",
    v5uru: "godan verb",
    v5z: "godan verb",
    vi: "intransitive verb",
    vk: "kuru verb",
    vn: "irregular nu verb",
    vr: "irregular ru verb, plain form ends with -ri",
    vs: "suru verb",
    "vs-c": "su verb - precursor to the modern suru",
    "vs-i": "suru verb - irregular",
    "vs-s": "suru verb - special class",
    vt: "transitive verb",
    vulg: "vulgar expression or word",
    vz: "ichidan verb - -zuru special class (alternative form of -jiru verbs)",
    X: "rude or X-rated term",
    zool: "zoology term"
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-console */
Object.defineProperty(exports, "__esModule", { value: true });
var dict_codes_1 = __webpack_require__(15);
// 3040-309F: hiragana
// 30A0-30FF: katakana
// 4E00-9FAF: common and uncommon kanji
var kanjiAndCodeSplitter = /^(.*)\(([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+)\)\(([a-zA-Z0-9,]+)\)$/;
var codeSplitter = /^(.*)\(([a-zA-Z0-9,]+)\)$/;
var kanjiSplitter = /^(.*)\(([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+)\)$/;
var kanjiAndParenthesizedCsvSplitter = /^([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+)\(([\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF,]+)\)/;
function formatPronunciation(pronunciation) {
    var parts = pronunciation.split(";");
    var mapped = parts
        .map(function (part) {
        var kcm = part.match(kanjiAndCodeSplitter);
        if (kcm) {
            return (kcm[1] +
                "⸨" +
                kcm[2] +
                "⸩" +
                "(" +
                (dict_codes_1.DICT_CODES[kcm[3]] || kcm[3]) +
                ")");
        }
        var kp = part.match(kanjiAndParenthesizedCsvSplitter);
        if (kp) {
            return kp[1] + "⸨" + kp[2].replace(",", "、") + "⸩";
        }
        var cm = part.match(codeSplitter);
        if (cm) {
            var code = cm[2];
            var expandedCode = code;
            if (code === "P") {
                expandedCode = "common";
            }
            else if (dict_codes_1.DICT_CODES[code]) {
                expandedCode = dict_codes_1.DICT_CODES[code];
            }
            return cm[1] + "(" + expandedCode + ")";
        }
        var km = part.match(kanjiSplitter);
        if (km) {
            return km[1] + "⸨" + km[2] + "⸩";
        }
        return part;
    })
        .join("、");
    return "（" + mapped + "）";
}
exports.formatPronunciation = formatPronunciation;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dict_codes_1 = __webpack_require__(15);
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
function formatPartOfSpeech(commaDelimitedPos) {
    if (!commaDelimitedPos) {
        return "";
    }
    return (commaDelimitedPos.split(",") || [])
        .map(function (part) {
        var expandedPos = dict_codes_1.DICT_CODES[part];
        return expandedPos ? capitalize(expandedPos) : capitalize(part);
    })
        .join(", ");
}
exports.formatPartOfSpeech = formatPartOfSpeech;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dict_codes_1 = __webpack_require__(15);
function formatDefinitionLine(line) {
    return replaceAbbreviations(replaceDictCodesAtEnd(replaceDictCodesAtStart(line)));
}
exports.formatDefinitionLine = formatDefinitionLine;
function replaceDictCodesAtStart(text) {
    // Both regexes account for an optional numbered list prefix (e.g. "1. ")
    var dictCodeInParens = /^([0-9]\.\s)?\(([a-z,A-Z,-,0-9]+)\)(.*)/;
    var dictCodeInBraces = /^([0-9]\.\s)?\{([a-z,A-Z,-,0-9]+)\}(.*)/;
    var parenMatches = text.match(dictCodeInParens);
    var braceMatches = text.match(dictCodeInBraces);
    if (parenMatches) {
        var listPrefix = parenMatches[1] ? parenMatches[1] : "";
        return listPrefix + replaceDictCode(parenMatches[2]) + parenMatches[3];
    }
    if (braceMatches) {
        var listPrefix = braceMatches[1] ? braceMatches[1] : "";
        return listPrefix + replaceDictCode(braceMatches[2]) + braceMatches[3];
    }
    return text;
}
function replaceDictCode(maybeDictCode) {
    var longForm = dict_codes_1.DICT_CODES[maybeDictCode];
    if (!longForm) {
        return "(" + maybeDictCode + ")";
    }
    return "[" + longForm + "]";
}
function replaceDictCodesAtEnd(text) {
    var dictCodesInParens = /(.*)\(([a-z,A-Z,0-9\,\-]+)\)$/;
    var m = text.match(dictCodesInParens);
    if (!m) {
        return text;
    }
    var longFormCodes = m[2]
        .split(",")
        .map(function (maybeDictCode) {
        var longForm = dict_codes_1.DICT_CODES[maybeDictCode];
        return longForm ? longForm : maybeDictCode;
    })
        .join(", ");
    return m[1] + "(" + longFormCodes + ")";
}
function replaceAbbreviations(text) {
    return text.replace(/usu\./g, "usually").replace(/esp\./g, "especially");
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __webpack_require__(4);
var getWordPronunciations_1 = __webpack_require__(20);
var Log = new logger_1.Logger();
var forvoUserWhitelist = [""];
var EMPTY_FORVO_USER_WHITELIST = JSON.stringify(forvoUserWhitelist);
function populateForvoUserWhitelist(settings) {
    if (typeof settings.forvo_username_whitelist_csv === "string") {
        forvoUserWhitelist = settings.forvo_username_whitelist_csv
            .trim()
            .replace(/ /g, "")
            .split(",");
    }
}
exports.populateForvoUserWhitelist = populateForvoUserWhitelist;
function insertForvoAudioForWord(jpVocabText, settings, destAppendee) {
    if (!destAppendee) {
        Log.error("destAppendee missing");
        return Promise.reject(new Error());
    }
    Log.debug("Querying Forvo for ", jpVocabText);
    return getWordPronunciations_1.getWordPronunciations(jpVocabText, settings)
        .then(function (responseText) {
        if (!responseText) {
            Log.warn("no Forvo responseText");
            return Promise.resolve();
        }
        return handleForvoSuccess(responseText, settings, destAppendee);
    })
        .catch(function (res) {
        Log.error("Forvo API error: ", res.statusText);
    });
}
exports.insertForvoAudioForWord = insertForvoAudioForWord;
function handleForvoSuccess(responseText, settings, destAppendee) {
    var parsedForvoJson;
    try {
        parsedForvoJson = JSON.parse(responseText);
    }
    catch (parseErr) {
        Log.error("JSON parseErr", parseErr);
    }
    var forvoItems = parsedForvoJson.items;
    if (!forvoItems || forvoItems.length === 0) {
        Log.warn("no forvoItems");
        return Promise.resolve();
    }
    var audioSection = $("<div>");
    audioSection.css("margin-top", "10px");
    forvoItems.forEach(function (forvoItem) {
        if (!forvoItem.pathmp3) {
            Log.error("!forvoItem.pathmp3");
            return;
        }
        if (!forvoItem.username) {
            Log.error("!forvoItem.username");
            return;
        }
        if (JSON.stringify(forvoUserWhitelist) !== EMPTY_FORVO_USER_WHITELIST &&
            !forvoUserWhitelist.includes(forvoItem.username)) {
            Log.debug("skipping pronunciation from " + forvoItem.username);
            return;
        }
        var audioContainer = $("<div>");
        audioContainer.css({
            fontSize: "12px",
            display: "inline-block",
            boxSizing: "border-box",
            width: "250px",
            marginTop: "0",
            marginRight: "5px",
            marginBottom: "5px",
            marginLeft: "0",
            padding: "0"
        });
        var audioEl = document.createElement("audio");
        audioEl.src = forvoItem.pathmp3;
        audioEl.controls = true;
        audioEl.preload = "none";
        audioEl.style.width = "250px";
        if (settings.show_forvo_usernames) {
            var usernameEl = $("<span>");
            usernameEl.text(forvoItem.username);
            usernameEl.css({
                fontSize: "12px",
                color: "#888888",
                margin: "0",
                padding: "0"
            });
            audioContainer.prepend(usernameEl);
        }
        audioContainer.append(audioEl);
        audioSection.append(audioContainer);
    });
    destAppendee.append(audioSection);
    return Promise.resolve();
}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gm_http_1 = __webpack_require__(1);
var logger_1 = __webpack_require__(4);
var Log = new logger_1.Logger();
function getWordPronunciations(jpWord, settings) {
    if (!jpWord) {
        return Promise.reject(new Error("jpWord missing"));
    }
    var forvoApiKey = settings ? settings.forvo_api_key : null;
    if (!forvoApiKey) {
        return Promise.reject(new Error("Forvo api key missing"));
    }
    var forvoUrl = "https://apifree.forvo.com/key/" +
        forvoApiKey +
        "/format/json" +
        "/action/word-pronunciations" +
        "/word/" +
        encodeURIComponent(jpWord) +
        "/language/ja" +
        "/rate/" +
        String(settings.forvo_min_rating || 0) +
        "/country/JPN" +
        "/order/rate-desc";
    return gm_http_1.default
        .get(forvoUrl)
        .then(function (res) {
        return Promise.resolve(res.responseText);
    })
        .catch(function (err) {
        Log.error("Forvo error: ", err);
    });
}
exports.getWordPronunciations = getWordPronunciations;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var windowHelpers_1 = __webpack_require__(22);
var WKOF_POLL_INTERVAL_MS = 10;
var WKOF_WAIT_TIMEOUT_MS = 10000;
var WKOF_INSTALL_PAGE = "https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549";
var prompted = false;
function promptInstall(scriptName, overridingGetWindowFunc) {
    if (prompted) {
        return;
    }
    var win = (overridingGetWindowFunc || windowHelpers_1.getWindow)();
    prompted = true;
    if (win.confirm(scriptName +
        " requires the Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?")) {
        win.location.href = WKOF_INSTALL_PAGE;
    }
}
// waitForWkof calls onLoad with the global wkof object after wkof is loaded
function waitForWkof(scriptName, onLoad) {
    windowHelpers_1.waitUntilWindowPropLoads(windowHelpers_1.getWindow, "wkof", WKOF_POLL_INTERVAL_MS, WKOF_WAIT_TIMEOUT_MS, onLoad, promptInstall.bind(null, scriptName));
}
exports.waitForWkof = waitForWkof;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
function getWindow() {
    return global;
}
exports.getWindow = getWindow;
function waitUntilWindowPropLoads(getWindowFunc, windowProp, pollingIntervalMs, maxWaitMs, onLoad, onTimeout) {
    var startMs = new Date().getTime();
    var intervalID = setInterval(function () {
        if (getWindowFunc()[windowProp]) {
            clearInterval(intervalID);
            onLoad(getWindowFunc()[windowProp]);
            return;
        }
        if (new Date().getTime() - startMs > maxWaitMs) {
            clearInterval(intervalID);
            onTimeout();
        }
    }, pollingIntervalMs);
}
exports.waitUntilWindowPropLoads = waitUntilWindowPropLoads;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(23)))

/***/ }),
/* 23 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsScriptId = "wanikani_vocab_beyond_settings";
exports.MenuScriptLinkId = "wanikani_vocab_beyond_settings_link";
exports.WkofSettingsMenuConfig = {
    script_id: exports.SettingsScriptId,
    title: "WaniKani Vocab Beyond",
    autosave: true,
    background: false,
    content: {
        forvo_page_id: {
            type: "page",
            label: "Audio",
            hover_tip: "Settings for Forvo.com audio pronunciations",
            content: {
                forvo_instructions: {
                    type: "html",
                    html: "<p><a href='https://forvo.com' target='_blank'>Forvo.com</a> has an audio collection of words pronounced by native Japanese speakers.</p>" +
                        "<p>To enable Forvo pronunciations of vocabulary words:</p>" +
                        "<p>1. <a href='https://forvo.com/signup/' target='_blank'>Sign up for a Forvo.com account</a></p>" +
                        "<p>2. <a href='https://api.forvo.com/plans-and-pricing' target='_blank'>Purchase an API key here</a></p>" +
                        "<p>3. Enter your key below</p>"
                },
                forvo_api_key: {
                    type: "text",
                    default: "",
                    label: "Forvo API key",
                    full_width: true,
                    hover_tip: "Your API key from https://api.forvo.com/"
                },
                forvo_caveat: {
                    type: "html",
                    html: "<p>(WaniKani Vocab Beyond will work without a Forvo API key, but audio for vocabulary won't be shown.)</p>"
                },
                forvo_divider_id: {
                    type: "divider"
                },
                forvo_rating_instructions: {
                    type: "html",
                    html: "<p>Forvo pronunciations are voted on by users. Limit displayed audio to at least this overall rating. Zero is the default and recommended value.</p>"
                },
                forvo_min_rating: {
                    type: "number",
                    label: "Minimum Forvo rating",
                    hover_tip: "Only show Forvo pronunciations with at least this rating",
                    placeholder: "0",
                    default: 0,
                    full_width: false
                },
                forvo_divider_id_2: {
                    type: "divider"
                },
                forvo_whitelist_instructions: {
                    type: "html",
                    html: "<p>Comma-separated list of Forvo users whose pronunciations should be shown. If blank, pronunciations from all users are shown.</p>"
                },
                forvo_username_whitelist_csv: {
                    type: "text",
                    label: "Favorite Forvo users",
                    full_width: true,
                    placeholder: "Example: skent, usako_usagiclub, strawberrybrown",
                    default: "",
                    hover_tip: "A comma-separated list of Forvo usernames whose pronunciations should be shown"
                }
            }
        },
        vocab_page_id: {
            type: "page",
            label: "Vocab",
            hover_tip: "Settings for WWWJDIC vocabulary words",
            content: {
                vocab_instructions_1: {
                    type: "html",
                    html: "<p>By default, only common words are retrieved and displayed from <a href='http://nihongo.monash.edu/cgi-bin/wwwjdic' target='_blank'>WWWJDIC</a>. You can also retrieve uncommon words and phrases by checking the box below.</p>"
                },
                show_all_wwwjdic_vocab: {
                    type: "checkbox",
                    label: "Show uncommon vocab",
                    hover_tip: "Show both common and uncommon WWWJDIC vocab",
                    default: false,
                    full_width: false
                },
                vocab_instructions_2: {
                    type: "html",
                    html: "<p>Set the maximum number of WWWJDIC vocab to display per kanji below. 0 means unlimited. (Warning: showing WWWJDIC unlimited results may quickly exhaust your Forvo API key's daily request limits.)</p>"
                },
                max_wwwjdic_vocab_shown: {
                    type: "number",
                    label: "Maximum number of WWWJDIC vocab to display per kanji",
                    hover_tip: "Maximum number of WWWJDIC vocabulary to display per kanji",
                    full_width: true,
                    placeholder: "15",
                    default: 15,
                    min: 0
                }
            }
        },
        appearance_page_id: {
            type: "page",
            label: "Appearance",
            hover_tip: "Appearance settings",
            content: {
                appearance_instructions_1: {
                    type: "html",
                    html: "<p>Check to show Vocab Beyond at top of kanji pages and in the first tab of kanji reviews and lessons.</p>"
                },
                show_vocab_beyond_first: {
                    type: "checkbox",
                    label: "Show Vocab Beyond first",
                    hover_tip: "Show the Vocab Beyond section at the top of kanji pages and in the first tab of kanji reviews and kanji lessons",
                    default: false,
                    full_width: false
                },
                appearance_instructions_2: {
                    type: "html",
                    html: "<p>Check to show Forvo usernames above audio clips.</p>"
                },
                show_forvo_usernames: {
                    type: "checkbox",
                    label: "Show Forvo usernames",
                    hover_tip: "Show Forvo usernames above each audio clip",
                    default: false,
                    full_width: false
                },
                appearance_instructions_3: {
                    type: "html",
                    html: "<p>Check below to hide icon beside uncommon vocab.</p>"
                },
                hide_uncommon_indicator: {
                    type: "checkbox",
                    label: "Hide uncommon icon",
                    hover_tip: "Hide uncommon vocabulary icon",
                    default: false,
                    full_width: false
                }
            }
        }
    }
};


/***/ })
/******/ ]);