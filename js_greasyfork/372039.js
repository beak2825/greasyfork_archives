// ==UserScript==
// @name Test
// @namespace https://greasyfork.org/users/92233
// @description Integrates MyAnimeList into various sites, with auto episode tracking.
// @version 0.02.0
// @author lolamtisch@gmail.com
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant GM.xmlHttpRequest
// @grant GM.getValue
// @grant GM.setValue
// @match *://myanimelist.net/anime/*
// @match *://myanimelist.net/manga/*
// @match *://kissanime.ru/Anime/*
// @match *://kissanime.to/Anime/*
// @match *://kissmanga.com/Manga/*
// @match *://*.9anime.to/watch/*
// @match *://*.9anime.is/watch/*
// @match *://*.9anime.ru/watch/*
// @match *://*.9anime.ch/watch/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @resource materialCSS https://code.getmdl.io/1.3.0/material.indigo-pink.min.css
// @resource materialFont https://fonts.googleapis.com/icon?family=Material+Icons
// @resource materialjs https://code.getmdl.io/1.3.0/material.min.js
// @resource simpleBarCSS https://unpkg.com/simplebar@3.0.0-beta.4/dist/simplebar.css
// @resource simpleBarjs https://unpkg.com/simplebar@3.0.0-beta.4/dist/simplebar.js
// @run-at document_start
// @connect myanimelist.net
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/372039/Test.user.js
// @updateURL https://update.greasyfork.org/scripts/372039/Test.meta.js
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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/api/storage/userscriptLegacy.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const userscriptLegacy = {
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            GM_setValue(key, value);
        });
    },
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = GM_getValue(key);
            return value;
        });
    },
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            GM_deleteValue(key);
        });
    },
    addStyle(css) {
        return __awaiter(this, void 0, void 0, function* () {
            GM_addStyle(css);
        });
    },
    version() {
        return GM_info.script.version;
    },
    assetUrl(filename) {
        return 'https://raw.githubusercontent.com/lolamtisch/MALSync/master/assets/assets/' + filename;
    },
    injectCssResource(res, head) {
        head.append($('<style>')
            .attr("rel", "stylesheet")
            .attr("type", "text/css")
            .html(GM_getResourceText(res)));
    },
    injectjsResource(res, head) {
        var s = document.createElement('script');
        s.text = GM_getResourceText(res);
        s.onload = function () {
            this.remove();
        };
        head.get(0).appendChild(s);
    },
    updateDom(head) {
        var s = document.createElement('script');
        s.text = `
        document.getElementsByTagName('head')[0].onclick = function(e){
          try{
            componentHandler.upgradeDom();
          }catch(e){
            console.log(e);
            setTimeout(function(){
              componentHandler.upgradeDom();
            },500);
          }
        }`;
        s.onload = function () {
            this.remove();
        };
        head.get(0).appendChild(s);
    }
};

// CONCATENATED MODULE: ./src/api/request/requestUserscriptLegacy.ts
var requestUserscriptLegacy_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const requestUserscriptLegacy = {
    xhr(method, url) {
        return requestUserscriptLegacy_awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var request = {
                    method: method,
                    url: url,
                    synchronous: false,
                    headers: [],
                    data: null,
                    onload: function (response) {
                        console.log(response);
                        var responseObj = {
                            finalUrl: response.finalUrl,
                            responseText: response.responseText,
                            status: response.status
                        };
                        resolve(responseObj);
                    }
                };
                if (typeof url === 'object') {
                    request.url = url.url;
                    request.headers = url.headers;
                    request.data = url.data;
                }
                GM_xmlhttpRequest(request);
            });
        });
    },
};

// EXTERNAL MODULE: ./src/api/settings.ts
var settings = __webpack_require__(6);

// CONCATENATED MODULE: ./src/api/userscript.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "storage", function() { return storage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "request", function() { return request; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "settings", function() { return userscript_settings; });



var storage = userscriptLegacy;
var request = requestUserscriptLegacy;
var userscript_settings = settings["a" /* settingsObj */];


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "log", function() { return log; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "error", function() { return error; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "info", function() { return info; });
var log = function () {
    return Function.prototype.bind.call(console.log, console, "%cMAL-Sync", "background-color: #2e51a2; color: white; padding: 2px 10px; border-radius: 3px;");
}();
var error = function () {
    return Function.prototype.bind.call(console.error, console, "%cMAL-Sync", "background-color: #8f0000; color: white; padding: 2px 10px; border-radius: 3px;");
}();
var info = function () {
    return Function.prototype.bind.call(console.info, console, "%cMAL-Sync", "background-color: wheat; color: black; padding: 2px 10px; border-radius: 3px;");
}();


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(api, con) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "urlPart", function() { return urlPart; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "watching", function() { return watching; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "planTo", function() { return planTo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getselect", function() { return getselect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "absoluteLink", function() { return absoluteLink; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUrlFromTags", function() { return getUrlFromTags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setUrlInTags", function() { return setUrlInTags; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMalToKissArray", function() { return getMalToKissArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTooltip", function() { return getTooltip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUserList", function() { return getUserList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMalUserName", function() { return getMalUserName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flashm", function() { return flashm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flashConfirm", function() { return flashConfirm; });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function urlPart(url, part) {
    try {
        return url.split("/")[part].split("?")[0];
    }
    catch (e) {
        return undefined;
    }
}
function watching(type) {
    if (type == "manga")
        return 'Reading';
    return 'Watching';
}
function planTo(type) {
    if (type == "manga")
        return 'Plan to Read';
    return 'Plan to Watch';
}
function getselect(data, name) {
    var temp = data.split('name="' + name + '"')[1].split('</select>')[0];
    if (temp.indexOf('selected="selected"') > -1) {
        temp = temp.split('<option');
        for (var i = 0; i < temp.length; ++i) {
            if (temp[i].indexOf('selected="selected"') > -1) {
                return temp[i].split('value="')[1].split('"')[0];
            }
        }
    }
    else {
        return '';
    }
}
function absoluteLink(url, domain) {
    if (typeof url === "undefined") {
        return url;
    }
    if (!url.startsWith("http")) {
        url = domain + url;
    }
    return url;
}
;
function getUrlFromTags(tags) {
    if (/last::[\d\D]+::/.test(tags)) {
        return atobURL(tags.split("last::")[1].split("::")[0]);
    }
    if (/malSync::[\d\D]+::/.test(tags)) {
        return atobURL(tags.split("malSync::")[1].split("::")[0]);
    }
    return undefined;
    function atobURL(encoded) {
        try {
            return atob(encoded);
        }
        catch (e) {
            return encoded;
        }
    }
}
function setUrlInTags(url, tags) {
    //if(tagLinks == 0){return current;} TODO
    var addition = "malSync::" + btoa(url) + "::";
    if (/(last|malSync)::[\d\D]+::/.test(tags)) {
        tags = tags.replace(/(last|malSync)::[^\^]*?::/, addition);
    }
    else {
        tags = tags + ',' + addition;
    }
    return tags;
}
function getMalToKissArray(type, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            var url = 'https://kissanimelist.firebaseio.com/Data2/Mal' + type + '/' + id + '/Sites.json';
            api.request.xhr('GET', url).then((response) => __awaiter(this, void 0, void 0, function* () {
                var json = $.parseJSON(response.responseText);
                for (var pageKey in json) {
                    var page = json[pageKey];
                    if (!api.settings.get(pageKey)) {
                        con.log(pageKey + ' is deactivated');
                        delete json[pageKey];
                        continue;
                    }
                    for (var streamKey in page) {
                        var stream = page[streamKey];
                        var streamUrl = 'https://kissanimelist.firebaseio.com/Data2/' + stream + '/' + encodeURIComponent(streamKey) + '.json';
                        var cache = yield api.storage.get('MalToKiss/' + stream + '/' + encodeURIComponent(streamKey), null);
                        if (typeof (cache) != "undefined") {
                            var streamJson = cache;
                        }
                        else {
                            var streamRespose = yield api.request.xhr('GET', streamUrl);
                            var streamJson = $.parseJSON(streamRespose.responseText);
                            api.storage.set('MalToKiss/' + stream + '/' + encodeURIComponent(streamKey), streamJson);
                        }
                        json[pageKey][streamKey] = streamJson;
                    }
                }
                con.log('Mal2Kiss', json);
                resolve(json);
            }));
        });
    });
}
function getTooltip(text, style = '', direction = 'top') {
    var rNumber = Math.floor((Math.random() * 1000) + 1);
    return '<div id="tt' + rNumber + '" class="icon material-icons" style="font-size:16px; line-height: 0; color: #7f7f7f; padding-bottom: 20px; padding-left: 3px; ' + style + '"> &#x1F6C8;</div>\
  <div class="mdl-tooltip mdl-tooltip--' + direction + ' mdl-tooltip--large" for="tt' + rNumber + '">' + text + '</div>';
}
//Status: 1 = watching | 2 = completed | 3 = onhold | 4 = dropped | 6 = plan to watch | 7 = all
function getUserList(status = 1, localListType = 'anime', singleCallback = null, finishCallback = null, fullListCallback = null, continueCall = null, username = null, offset = 0, templist = []) {
    con.log('[UserList]', 'username: ' + username, 'status: ' + status, 'offset: ' + offset);
    if (username == null) {
        getMalUserName(function (usernameTemp) {
            if (usernameTemp == false) {
                flashm("Please log in on <a target='_blank' href='https://myanimelist.net/login.php'>MyAnimeList!<a>");
            }
            else {
                getUserList(status, localListType, singleCallback, finishCallback, fullListCallback, continueCall, usernameTemp, offset, templist);
            }
        });
        return;
    }
    var url = 'https://myanimelist.net/' + localListType + 'list/' + username + '/load.json?offset=' + offset + '&status=' + status;
    api.request.xhr('GET', url).then((response) => {
        var data = $.parseJSON(response.responseText);
        if (singleCallback) {
            // @ts-ignore
            if (!data.length)
                singleCallback(false, 0, 0);
            for (var i = 0; i < data.length; i++) {
                // @ts-ignore
                singleCallback(data[i], i + offset + 1, data.length + offset);
            }
        }
        if (fullListCallback) {
            templist = templist.concat(data);
        }
        if (data.length > 299) {
            if (continueCall) {
                // @ts-ignore
                continueCall(function () {
                    getUserList(status, localListType, singleCallback, finishCallback, fullListCallback, continueCall, username, offset + 300, templist);
                });
            }
            else {
                getUserList(status, localListType, singleCallback, finishCallback, fullListCallback, continueCall, username, offset + 300, templist);
            }
        }
        else {
            // @ts-ignore
            if (fullListCallback)
                fullListCallback(templist);
            // @ts-ignore
            if (finishCallback)
                finishCallback();
        }
    });
}
function getMalUserName(callback) {
    var url = 'https://myanimelist.net/editlist.php?hideLayout';
    api.request.xhr('GET', url).then((response) => {
        var username = false;
        try {
            username = response.responseText.split('USER_NAME = "')[1].split('"')[0];
        }
        catch (e) { }
        con.log('[Username]', username);
        callback(username);
    });
}
//flashm
function flashm(text, options) {
    if (!$('#flash-div-top').length) {
        initflashm();
    }
    con.log("[Flash] Message:", text);
    var colorF = "#323232";
    if (typeof options !== 'undefined' && typeof options.error !== 'undefined' && options.error) {
        var colorF = "#3e0808";
    }
    var flashdiv = '#flash-div-bottom';
    if (typeof options !== 'undefined' && typeof options.position !== 'undefined' && options.position) {
        flashdiv = '#flash-div-' + options.position;
    }
    var messClass = "flash";
    if (typeof options !== 'undefined' && typeof options.type !== 'undefined' && options.type) {
        var tempClass = "type-" + options.type;
        $(flashdiv + ' .' + tempClass)
            .removeClass(tempClass)
            .fadeOut({
            duration: 1000,
            queue: false,
            complete: function () { $(this).remove(); }
        });
        messClass += " " + tempClass;
    }
    var mess = '<div class="' + messClass + '" style="display:none;">\
        <div style="display:table; pointer-events: all; padding: 14px 24px 14px 24px; margin: 0 auto; margin-top: 5px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:' + colorF + '; ">\
          ' + text + '\
        </div>\
      </div>';
    if (typeof options !== 'undefined' && typeof options.hoverInfo !== 'undefined' && options.hoverInfo) {
        messClass += " flashinfo";
        mess = '<div class="' + messClass + '" style="display:none; max-height: 5000px; margin-top: -8px;"><div style="display:table; pointer-events: all; margin: 0 auto; margin-top: -2px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:' + colorF + '; "><div style="max-height: 60vh; overflow-y: auto; padding: 14px 24px 14px 24px;">' + text + '</div></div></div>';
        $('#flashinfo-div').addClass('hover');
        var flashm = $(mess).appendTo('#flashinfo-div');
    }
    else {
        var flashm = $(mess).appendTo(flashdiv);
    }
    if (typeof options !== 'undefined' && typeof options.permanent !== 'undefined' && options.permanent) {
        flashm.slideDown(800);
    }
    else if (typeof options !== 'undefined' && typeof options.hoverInfo !== 'undefined' && options.hoverInfo) {
        flashm.slideDown(800).delay(4000).queue(function () { $('#flashinfo-div').removeClass('hover'); flashm.css('max-height', '8px'); });
    }
    else {
        flashm.slideDown(800).delay(4000).slideUp(800, function () { $(this).remove(); });
    }
    return flashm;
}
function flashConfirm(message, type, yesCall, cancelCall) {
    message = '<div style="text-align: left;">' + message + '</div><div style="display: flex; justify-content: space-around;"><button class="Yes" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px; cursor:pointer;">OK</button><button class="Cancel" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px; cursor:pointer;">CANCEL</button></div>';
    var flasmessage = flashm(message, { permanent: true, position: "top", type: type });
    flasmessage.find('.Yes').click(function () {
        $(this).parentsUntil('.flash').remove();
        yesCall();
    });
    flasmessage.find('.Cancel').click(function () {
        $(this).parentsUntil('.flash').remove();
        cancelCall();
    });
}
function initflashm() {
    api.storage.addStyle('.flashinfo{\
                    transition: max-height 2s;\
                 }\
                 .flashinfo:hover{\
                    max-height:5000px !important;\
                    z-index: 2147483647;\
                 }\
                 .flashinfo .synopsis{\
                    transition: max-height 2s, max-width 2s ease 2s;\
                 }\
                 .flashinfo:hover .synopsis{\
                    max-height:9999px !important;\
                    max-width: 500px !important;\
                    transition: max-height 2s;\
                 }\
                 #flashinfo-div{\
                  z-index: 2;\
                  transition: 2s;\
                 }\
                 #flashinfo-div:hover, #flashinfo-div.hover{\
                  z-index: 2147483647;\
                 }\
                 \
                 #flash-div-top, #flash-div-bottom, #flashinfo-div{\
                    font-family: "Helvetica","Arial",sans-serif;\
                    color: white;\
                    font-size: 14px;\
                    font-weight: 400;\
                    line-height: 17px;\
                 }\
                 #flash-div-top h2, #flash-div-bottom h2, #flashinfo-div h2{\
                    font-family: "Helvetica","Arial",sans-serif;\
                    color: white;\
                    font-size: 14px;\
                    font-weight: 700;\
                    line-height: 17px;\
                    padding: 0;\
                    margin: 0;\
                 }\
                 #flash-div-top a, #flash-div-bottom a, #flashinfo-div a{\
                    color: #DF6300;\
                 }');
    $('body').after('<div id="flash-div-top" style="text-align: center;pointer-events: none;position: fixed;top:-5px;width:100%;z-index: 2147483647;left: 0;"></div>\
        <div id="flash-div-bottom" style="text-align: center;pointer-events: none;position: fixed;bottom:0px;width:100%;z-index: 2147483647;left: 0;"><div id="flash" style="display:none;  background-color: red;padding: 20px; margin: 0 auto;max-width: 60%;          -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 20px;background:rgba(227,0,0,0.6);"></div></div>\
        <div id="flashinfo-div" style="text-align: center;pointer-events: none;position: fixed;bottom:0px;width:100%;left: 0;">');
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return pages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return pageSearch; });
/* harmony import */ var _Kissanime_main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _Kissmanga_main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);


const pages = {
    Kissanime: _Kissanime_main__WEBPACK_IMPORTED_MODULE_0__[/* Kissanime */ "a"],
    Kissmanga: _Kissmanga_main__WEBPACK_IMPORTED_MODULE_1__[/* Kissmanga */ "a"]
};
const pageSearch = {
    Kissanime: {
        name: 'Kissanime',
        type: 'anime',
        domain: 'kissanime.ru/Anime',
        searchUrl: (titleEncoded) => { return ''; },
        completeSearchTag: (title, linkContent) => { return '<form class="mal_links" target="_blank" action="http://kissanime.ru/Search/Anime" style="display: inline;" id="kissanimeSearch" method="post" _lpchecked="1"><a href="#" class="submitKissanimeSearch" onclick="document.getElementById(\'kissanimeSearch\').submit(); return false;">' + linkContent + '</a><input type="hidden" id="keyword" name="keyword" value="' + title + '"/></form>'; }
    },
    crunchyroll: {
        name: 'Crunchyroll',
        type: 'anime',
        domain: 'www.crunchyroll.com',
        searchUrl: (titleEncoded) => { return 'http://www.crunchyroll.com/search?q=' + titleEncoded; }
    }
};


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(utils, con, api) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return mal; });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class mal {
    constructor(url) {
        this.url = url;
        this.name = "";
        this.totalEp = NaN;
        this.addAnime = false;
        this.login = false;
        this.id = utils.urlPart(url, 4);
        this.type = utils.urlPart(url, 3);
    }
    init() {
        return this.update();
    }
    ;
    update() {
        var editUrl = 'https://myanimelist.net/ownlist/' + this.type + '/' + this.id + '/edit?hideLayout';
        con.log('Update MAL info', editUrl);
        return api.request.xhr('GET', editUrl).then((response) => {
            if (response.finalUrl.indexOf("myanimelist.net/login.php") > -1 || response.responseText.indexOf("Unauthorized") > -1) {
                this.login = false;
                con.error("User not logged in");
                return;
            }
            this.login = true;
            this.animeInfo = this.getObject(response.responseText);
        });
    }
    getEpisode() {
        if (this.type == "manga") {
            return this.animeInfo[".add_manga[num_read_chapters]"];
        }
        return this.animeInfo[".add_anime[num_watched_episodes]"];
    }
    setEpisode(ep) {
        if (this.type == "manga") {
            this.animeInfo[".add_manga[num_read_chapters]"] = parseInt(ep + '');
        }
        this.animeInfo[".add_anime[num_watched_episodes]"] = parseInt(ep + '');
    }
    getVolume() {
        if (this.type == "manga") {
            return this.animeInfo[".add_manga[num_read_volumes]"];
        }
        return false;
    }
    setVolume(ep) {
        if (this.type == "manga") {
            this.animeInfo[".add_manga[num_read_volumes]"] = ep;
            return;
        }
        con.error('You cant set Volumes for animes');
    }
    getStatus() {
        if (this.type == "manga") {
            return this.animeInfo[".add_manga[status]"];
        }
        return this.animeInfo[".add_anime[status]"];
    }
    setStatus(status) {
        if (this.type == "manga") {
            this.animeInfo[".add_manga[status]"] = status;
        }
        this.animeInfo[".add_anime[status]"] = status;
    }
    getScore() {
        if (this.type == "manga") {
            return this.animeInfo[".add_manga[score]"];
        }
        return this.animeInfo[".add_anime[score]"];
    }
    setScore(score) {
        if (this.type == "manga") {
            this.animeInfo[".add_manga[score]"] = score;
        }
        this.animeInfo[".add_anime[score]"] = score;
    }
    getStreamingUrl() {
        var tags = this.animeInfo[".add_anime[tags]"];
        if (this.type == "manga") {
            tags = this.animeInfo[".add_manga[tags]"];
        }
        return utils.getUrlFromTags(tags);
    }
    setStreamingUrl(url) {
        var tags = this.animeInfo[".add_anime[tags]"];
        if (this.type == "manga") {
            tags = this.animeInfo[".add_manga[tags]"];
        }
        tags = utils.setUrlInTags(url, tags);
        if (this.type == "manga") {
            this.animeInfo[".add_manga[tags]"] = tags;
        }
        this.animeInfo[".add_anime[tags]"] = tags;
    }
    getRating() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var url = '';
                if (this.type == 'anime') {
                    url = 'https://myanimelist.net/includes/ajax.inc.php?t=64&id=' + this.id;
                }
                else {
                    url = 'https://myanimelist.net/includes/ajax.inc.php?t=65&id=' + this.id;
                }
                api.request.xhr('GET', url).then((response) => {
                    try {
                        resolve(response.responseText.split('Score:</span>')[1].split('<')[0]);
                    }
                    catch (e) {
                        con.error('Could not get rating', e);
                        reject();
                    }
                });
            });
        });
    }
    setResumeWaching(url, ep) {
        return __awaiter(this, void 0, void 0, function* () {
            return api.storage.set('resume/' + this.type + '/' + this.id, { url: url, ep: ep });
        });
    }
    getResumeWaching() {
        return __awaiter(this, void 0, void 0, function* () {
            return api.storage.get('resume/' + this.type + '/' + this.id);
        });
    }
    setContinueWaching(url, ep) {
        return __awaiter(this, void 0, void 0, function* () {
            return api.storage.set('continue/' + this.type + '/' + this.id, { url: url, ep: ep });
        });
    }
    getContinueWaching() {
        return __awaiter(this, void 0, void 0, function* () {
            return api.storage.get('continue/' + this.type + '/' + this.id);
        });
    }
    clone() {
        const copy = new this.constructor();
        Object.assign(copy, this);
        copy.animeInfo = Object.assign({}, this.animeInfo);
        return copy;
    }
    sync() {
        return new Promise((resolve, reject) => {
            var This = this;
            var url = "https://myanimelist.net/ownlist/" + this.type + "/" + this.id + "/edit";
            if (this.addAnime) {
                if (this.type == 'anime') {
                    url = "https://myanimelist.net/ownlist/anime/add?selected_series_id=" + this.id;
                    utils.flashConfirm('Add "' + this.name + '" to MAL?', 'add', function () { continueCall(); }, function () {
                        /*if(change['checkIncrease'] == 1){TODO
                            episodeInfo(change['.add_anime[num_watched_episodes]'], actual['malurl']);
                        }*/
                    });
                    return;
                }
                else {
                    url = "https://myanimelist.net/ownlist/manga/add?selected_manga_id=" + this.id;
                    utils.flashConfirm('Add "' + this.name + '" to MAL?', 'add', function () { continueCall(); }, function () { });
                    return;
                }
            }
            continueCall();
            function continueCall() {
                var parameter = "";
                $.each(This.animeInfo, function (index, value) {
                    if (index.toString().charAt(0) == ".") {
                        if (!((index === '.add_anime[is_rewatching]' || index === '.add_manga[is_rereading]') && parseInt(value) === 0)) {
                            parameter += encodeURIComponent(index.toString().substring(1)) + "=" + encodeURIComponent(value) + "&";
                        }
                    }
                });
                con.log('[SET] URL:', url);
                con.log('[SET] Object:', This.animeInfo);
                api.request.xhr('POST', { url: url, data: parameter, headers: { "Content-Type": "application/x-www-form-urlencoded" } }).then((response) => {
                    if (response.responseText.indexOf('Successfully') >= 0) {
                        alert('Success');
                        resolve();
                    }
                    else {
                        alert('update Failed');
                        reject();
                    }
                    //This.animeInfo = This.getObject(response.responseText);
                });
            }
        });
    }
    getObject(data) {
        var getselect = utils.getselect;
        if (typeof data.split('<form name="')[1] === "undefined" && (this.url.indexOf('/manga/') !== -1 || this.url.indexOf('/anime/') !== -1)) {
            throw new Error("MAL is down or otherwise giving bad data");
        }
        this.addAnime = false;
        if (this.type == 'anime') {
            var anime = {};
            anime['.csrf_token'] = data.split('\'csrf_token\'')[1].split('\'')[1].split('\'')[0];
            if (data.indexOf('Add Anime') > -1) {
                this.addAnime = true;
            }
            data = data.split('<form name="')[1].split('</form>')[0];
            this.totalEp = parseInt(data.split('id="totalEpisodes">')[1].split('<')[0]);
            this.name = data.split('<a href="')[1].split('">')[1].split('<')[0];
            anime['.anime_id'] = parseInt(data.split('name="anime_id"')[1].split('value="')[1].split('"')[0]); //input
            anime['.aeps'] = parseInt(data.split('name="aeps"')[1].split('value="')[1].split('"')[0]);
            anime['.astatus'] = parseInt(data.split('name="astatus"')[1].split('value="')[1].split('"')[0]);
            anime['.add_anime[status]'] = parseInt(getselect(data, 'add_anime[status]'));
            //Rewatching
            if (data.split('name="add_anime[is_rewatching]"')[1].split('>')[0].indexOf('checked="checked"') >= 0) {
                anime['.add_anime[is_rewatching]'] = 1;
            }
            //
            anime['.add_anime[num_watched_episodes]'] = parseInt(data.split('name="add_anime[num_watched_episodes]"')[1].split('value="')[1].split('"')[0]);
            if (isNaN(anime['.add_anime[num_watched_episodes]'])) {
                anime['.add_anime[num_watched_episodes]'] = '';
            }
            anime['.add_anime[score]'] = getselect(data, 'add_anime[score]');
            anime['.add_anime[start_date][month]'] = getselect(data, 'add_anime[start_date][month]');
            anime['.add_anime[start_date][day]'] = getselect(data, 'add_anime[start_date][day]');
            anime['.add_anime[start_date][year]'] = getselect(data, 'add_anime[start_date][year]');
            anime['.add_anime[finish_date][month]'] = getselect(data, 'add_anime[finish_date][month]');
            anime['.add_anime[finish_date][day]'] = getselect(data, 'add_anime[finish_date][day]');
            anime['.add_anime[finish_date][year]'] = getselect(data, 'add_anime[finish_date][year]');
            anime['.add_anime[tags]'] = data.split('name="add_anime[tags]"')[1].split('>')[1].split('<')[0]; //textarea
            anime['.add_anime[priority]'] = getselect(data, 'add_anime[priority]');
            anime['.add_anime[storage_type]'] = getselect(data, 'add_anime[storage_type]');
            anime['.add_anime[storage_value]'] = data.split('name="add_anime[storage_value]"')[1].split('value="')[1].split('"')[0];
            anime['.add_anime[num_watched_times]'] = data.split('name="add_anime[num_watched_times]"')[1].split('value="')[1].split('"')[0];
            anime['.add_anime[rewatch_value]'] = getselect(data, 'add_anime[rewatch_value]');
            anime['.add_anime[comments]'] = data.split('name="add_anime[comments]"')[1].split('>')[1].split('<')[0];
            anime['.add_anime[is_asked_to_discuss]'] = getselect(data, 'add_anime[is_asked_to_discuss]');
            anime['.add_anime[sns_post_type]'] = getselect(data, 'add_anime[sns_post_type]');
            anime['.submitIt'] = data.split('name="submitIt"')[1].split('value="')[1].split('"')[0];
            con.log('[GET] Object:', anime);
            return anime;
        }
        else {
            var anime = {};
            anime['.csrf_token'] = data.split('\'csrf_token\'')[1].split('\'')[1].split('\'')[0];
            if (data.indexOf('Add Manga') > -1) {
                this.addAnime = true;
            }
            data = data.split('<form name="')[1].split('</form>')[0];
            this.totalEp = parseInt(data.split('id="totalChap">')[1].split('<')[0]);
            this.totalVol = parseInt(data.split('id="totalVol">')[1].split('<')[0]);
            this.name = data.split('<a href="')[1].split('">')[1].split('<')[0];
            anime['.entry_id'] = parseInt(data.split('name="entry_id"')[1].split('value="')[1].split('"')[0]);
            anime['.manga_id'] = parseInt(data.split('name="manga_id"')[1].split('value="')[1].split('"')[0]); //input
            anime['volumes'] = parseInt(data.split('id="volumes"')[1].split('value="')[1].split('"')[0]);
            anime['mstatus'] = parseInt(data.split('id="mstatus"')[1].split('value="')[1].split('"')[0]);
            anime['.add_manga[status]'] = parseInt(getselect(data, 'add_manga[status]'));
            //Rewatching
            if (data.split('name="add_manga[is_rereading]"')[1].split('>')[0].indexOf('checked="checked"') >= 0) {
                anime['.add_manga[is_rereading]'] = 1;
            }
            //
            anime['.add_manga[num_read_volumes]'] = parseInt(data.split('name="add_manga[num_read_volumes]"')[1].split('value="')[1].split('"')[0]);
            if (isNaN(anime['.add_manga[num_read_volumes]'])) {
                anime['.add_manga[num_read_volumes]'] = '';
            }
            anime['.add_manga[num_read_chapters]'] = parseInt(data.split('name="add_manga[num_read_chapters]"')[1].split('value="')[1].split('"')[0]);
            if (isNaN(anime['.add_manga[num_read_chapters]'])) {
                anime['.add_manga[num_read_chapters]'] = '';
            }
            anime['.add_manga[score]'] = getselect(data, 'add_manga[score]');
            anime['.add_manga[start_date][month]'] = getselect(data, 'add_manga[start_date][month]');
            anime['.add_manga[start_date][day]'] = getselect(data, 'add_manga[start_date][day]');
            anime['.add_manga[start_date][year]'] = getselect(data, 'add_manga[start_date][year]');
            anime['.add_manga[finish_date][month]'] = getselect(data, 'add_manga[finish_date][month]');
            anime['.add_manga[finish_date][day]'] = getselect(data, 'add_manga[finish_date][day]');
            anime['.add_manga[finish_date][year]'] = getselect(data, 'add_manga[finish_date][year]');
            anime['.add_manga[tags]'] = data.split('name="add_manga[tags]"')[1].split('>')[1].split('<')[0]; //textarea
            anime['.add_manga[priority]'] = getselect(data, 'add_manga[priority]');
            anime['.add_manga[storage_type]'] = getselect(data, 'add_manga[storage_type]');
            anime['.add_manga[num_retail_volumes]'] = data.split('name="add_manga[num_retail_volumes]"')[1].split('value="')[1].split('"')[0];
            anime['.add_manga[num_read_times]'] = data.split('name="add_manga[num_read_times]"')[1].split('value="')[1].split('"')[0];
            anime['.add_manga[reread_value]'] = getselect(data, 'add_manga[reread_value]');
            anime['.add_manga[comments]'] = data.split('name="add_manga[comments]"')[1].split('>')[1].split('<')[0];
            anime['.add_manga[is_asked_to_discuss]'] = getselect(data, 'add_manga[is_asked_to_discuss]');
            anime['.add_manga[sns_post_type]'] = getselect(data, 'add_manga[sns_post_type]');
            anime['.submitIt'] = data.split('name="submitIt"')[1].split('value="')[1].split('"')[0];
            con.log('[GET] Object:', anime);
            return anime;
        }
    }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2), __webpack_require__(1), __webpack_require__(0)))

/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(api, con) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return settingsObj; });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var settingsObj = {
    options: {
        posLeft: 'left',
        miniMALonMal: false,
        displayFloatButton: true,
        outWay: true,
        miniMalWidth: '30%',
        miniMalHeight: '90%',
        malThumbnail: 100,
        '9anime': true,
        Crunchyroll: true,
        Gogoanime: true,
        Kissanime: true,
        Masterani: true,
        Kissmanga: true,
        Mangadex: true,
    },
    init: function () {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                for (var key in this.options) {
                    var store = yield api.storage.get('settings/' + key);
                    if (typeof store != 'undefined') {
                        this.options[key] = store;
                    }
                }
                con.log('Settings', this.options);
                resolve(this);
            }));
        });
    },
    get: function (name) {
        return this.options[name];
    },
    set: function (name, value) {
        if (this.options.hasOwnProperty(name)) {
            this.options[name] = value;
            api.storage.set('settings/' + name, value);
        }
        else {
            con.error(name + ' is not a defined option');
        }
    }
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(utils, api, con) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return syncPage; });
/* harmony import */ var _pages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _utils_mal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _minimal_iframe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(10);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class syncPage {
    constructor(url) {
        this.url = url;
        this.UILoaded = false;
        this.page = this.getPage(url);
        if (this.page == null) {
            throw new Error('Page could not be recognized');
        }
    }
    init() {
        var This = this;
        $(document).ready(function () {
            Object(_minimal_iframe__WEBPACK_IMPORTED_MODULE_2__[/* initIframeModal */ "a"])(This);
        });
        this.page.init(this);
    }
    getPage(url) {
        for (var key in _pages__WEBPACK_IMPORTED_MODULE_0__[/* pages */ "b"]) {
            var page = _pages__WEBPACK_IMPORTED_MODULE_0__[/* pages */ "b"][key];
            if (url.indexOf(utils.urlPart(page.domain, 2).split('.').slice(-2, -1)[0] + '.') > -1) {
                return page;
            }
        }
        return null;
    }
    handlePage() {
        return __awaiter(this, void 0, void 0, function* () {
            var state;
            this.loadUI();
            if (this.page.isSyncPage(this.url)) {
                state = {
                    title: this.page.sync.getTitle(this.url),
                    identifier: this.page.sync.getIdentifier(this.url)
                };
                this.offset = yield api.storage.get(this.page.name + '/' + state.identifier + '/Offset');
                state.episode = +parseInt(this.page.sync.getEpisode(this.url) + '') + parseInt(this.getOffset());
                if (typeof (this.page.sync.getVolume) != "undefined") {
                    state.volume = this.page.sync.getVolume(this.url);
                }
                con.log('Sync', state);
            }
            else {
                if (typeof (this.page.overview) == "undefined") {
                    con.log('No overview definition');
                    return;
                }
                state = {
                    title: this.page.overview.getTitle(this.url),
                    identifier: this.page.overview.getIdentifier(this.url)
                };
                this.offset = yield api.storage.get(this.page.name + '/' + state.identifier + '/Offset');
                con.log('Overview', state);
            }
            var malUrl = yield this.getMalUrl(state.identifier, state.title, this.page);
            if (malUrl === null) {
                con.error('Not on mal');
            }
            else if (!malUrl) {
                con.error('Nothing found');
            }
            else {
                con.log('MyAnimeList', malUrl);
                this.malObj = new _utils_mal__WEBPACK_IMPORTED_MODULE_1__[/* mal */ "a"](malUrl);
                yield this.malObj.init();
                this.oldMalObj = this.malObj.clone();
                //fillUI
                this.fillUI();
                if (!this.malObj.login) {
                    utils.flashm("Please log in on <a target='_blank' href='https://myanimelist.net/login.php'>MyAnimeList!<a>", { error: true });
                    return;
                }
                //sync
                if (this.page.isSyncPage(this.url)) {
                    if (this.handleAnimeUpdate(state)) {
                        alert('sync');
                        this.malObj.setResumeWaching(this.url, state.episode);
                        this.syncHandling(true);
                    }
                    else {
                        alert('noSync');
                    }
                }
            }
        });
    }
    syncHandling(hoverInfo = false) {
        var This = this;
        return this.malObj.sync()
            .then(function () {
            var message = This.malObj.name;
            var split = '<br>';
            var totalVol = This.malObj.totalVol;
            if (totalVol == 0)
                totalVol = '?';
            var totalEp = This.malObj.totalEp;
            if (totalEp == 0)
                totalEp = '?';
            if (typeof This.oldMalObj == "undefined" || This.malObj.getStatus() != This.oldMalObj.getStatus()) {
                var statusString = "";
                switch (parseInt(This.malObj.getStatus())) {
                    case 1:
                        statusString = utils.watching(This.page.type);
                        break;
                    case 2:
                        statusString = 'Completed';
                        break;
                    case 3:
                        statusString = 'On-Hold';
                        break;
                    case 4:
                        statusString = 'Dropped';
                        break;
                    case 6:
                        statusString = utils.planTo(This.page.type);
                        break;
                }
                message += split + statusString;
                split = ' | ';
            }
            if (This.page.type == 'manga' && (typeof This.oldMalObj == "undefined" || This.malObj.getVolume() != This.oldMalObj.getVolume())) {
                message += split + 'Volume: ' + This.malObj.getVolume() + "/" + totalVol;
                split = ' | ';
            }
            if (typeof This.oldMalObj == "undefined" || This.malObj.getEpisode() != This.oldMalObj.getEpisode()) {
                message += split + 'Episode: ' + This.malObj.getEpisode() + "/" + totalEp;
                split = ' | ';
            }
            if (typeof This.oldMalObj == "undefined" || This.malObj.getScore() != This.oldMalObj.getScore() && This.malObj.getScore() != '') {
                message += split + 'Rating: ' + This.malObj.getScore();
                split = ' | ';
            }
            if (hoverInfo) {
                /*if(episodeInfoBox){//TODO
                    episodeInfo(change['.add_anime[num_watched_episodes]'], actual['malurl'], message, function(){
                        undoAnime['checkIncrease'] = 0;
                        setanime(thisUrl, undoAnime, null, localListType);
                        $('.info-Mal-undo').remove();
                        if($('.flashinfo>div').text() == ''){
                            $('.flashinfo').remove();
                        }
                    });
                }*/
                if (typeof This.oldMalObj != "undefined") {
                    message += '<br><button class="undoButton" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px;cursor: pointer;">Undo</button>';
                }
                utils.flashm(message, { hoverInfo: true }).find('.undoButton').on('click', function () {
                    this.closest('.flash').remove();
                    This.malObj = This.oldMalObj;
                    This.oldMalObj = undefined;
                    This.syncHandling();
                });
            }
            else {
                utils.flashm(message);
            }
            return;
        }).catch(function (e) {
            con.error(e);
            utils.flashm("Anime update failed", { error: true });
            return;
        });
    }
    handleAnimeUpdate(state) {
        if (this.malObj.getEpisode() >= state.episode) {
            return false;
        }
        this.malObj.setEpisode(state.episode);
        this.malObj.setStreamingUrl(this.page.sync.getOverviewUrl(this.url));
        //TODO: Add the Startwatching/Endwatching/Rewatching Handling
        return true;
    }
    fillUI() {
        $('.MalLogin').css("display", "initial");
        $('#AddMalDiv').remove();
        $("#malRating").attr("href", this.malObj.url);
        this.malObj.getRating().then((rating) => { $("#malRating").text(rating); });
        if (!this.malObj.login) {
            $('.MalLogin').css("display", "none");
            $("#MalData").css("display", "flex");
            $("#MalInfo").text("");
            $("#malRating").after("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id='LoginMalDiv'>Please log in on <a target='_blank' id='login' href='https://myanimelist.net/login.php'>MyAnimeList!<a></span>");
            return;
        }
        if (this.malObj.addAnime) {
            $('.MalLogin').css("display", "none");
            $("#malRating").after("<span id='AddMalDiv'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#' id='AddMal' onclick='return false;'>Add to MAL</a></span>");
            var This = this;
            $('#AddMal').click(function () {
                This.malObj.setStatus(6);
                This.syncHandling()
                    .then(() => {
                    return This.malObj.update();
                }).then(() => {
                    This.fillUI();
                });
            });
        }
        else {
            $("#malTotal, #malTotalCha").text(this.malObj.totalEp);
            if (this.malObj.totalEp == 0) {
                $("#malTotal, #malTotalCha").text('?');
            }
            $("#malTotalVol").text(this.malObj.totalVol);
            if (this.malObj.totalVol == 0) {
                $("#malTotalVol").text('?');
            }
            $("#malEpisodes").val(this.malObj.getEpisode());
            $("#malVolumes").val(this.malObj.getVolume());
            $("#malStatus").val(this.malObj.getStatus());
            $("#malUserRating").val(this.malObj.getScore());
        }
        $("#MalData").css("display", "flex");
        $("#MalInfo").text("");
        this.handleList();
    }
    handleList() {
        $('.mal-sync-active').removeClass('mal-sync-active');
        if (typeof (this.page.overview) != "undefined" && typeof (this.page.overview.list) != "undefined") {
            var epList = this.getEpList();
            if (typeof (epList) != "undefined") {
                var elementUrl = this.page.overview.list.elementUrl;
                con.log("Episode List", $.map(epList, function (val, i) { if (typeof (val) != "undefined") {
                    return elementUrl(val);
                } return '-'; }));
                var curEp = epList[this.malObj.getEpisode()];
                if (typeof (curEp) != "undefined" && curEp) {
                    curEp.addClass('mal-sync-active');
                }
            }
        }
    }
    getEpList() {
        var This = this;
        if (typeof (this.page.overview) != "undefined" && typeof (this.page.overview.list) != "undefined") {
            var elementEp = this.page.overview.list.elementEp;
            var elementArray = [];
            this.page.overview.list.elementsSelector().each(function (index, el) {
                try {
                    var elEp = parseInt(elementEp($(el)) + "") + parseInt(This.getOffset());
                    elementArray[elEp] = $(el);
                }
                catch (e) {
                    con.info(e);
                }
            });
            return elementArray;
        }
    }
    getMalUrl(identifier, title, page) {
        return __awaiter(this, void 0, void 0, function* () {
            var This = this;
            var cache = yield api.storage.get(this.page.name + '/' + identifier + '/Mal', null);
            if (typeof (cache) != "undefined") {
                con.log('Cache', this.page.name + '/' + identifier, cache);
                return cache;
            }
            if (typeof page.database != "undefined") {
                var firebaseVal = yield firebase();
                if (firebaseVal !== false) {
                    return firebaseVal;
                }
            }
            var malSearchVal = yield malSearch();
            if (malSearchVal !== false) {
                return malSearchVal;
            }
            return false;
            function firebase() {
                var url = 'https://kissanimelist.firebaseio.com/Data2/' + page.database + '/' + encodeURIComponent(titleToDbKey(identifier)).toLowerCase() + '/Mal.json';
                con.log("Firebase", url);
                return api.request.xhr('GET', url).then((response) => {
                    con.log("Firebase response", response.responseText);
                    if (response.responseText !== 'null' && !(response.responseText.indexOf("error") > -1)) {
                        var returnUrl = '';
                        if (response.responseText.split('"')[1] == 'Not-Found') {
                            returnUrl = null;
                        }
                        else {
                            returnUrl = 'https://myanimelist.net/' + page.type + '/' + response.responseText.split('"')[1] + '/' + response.responseText.split('"')[3];
                        }
                        This.setCache(returnUrl, false, identifier);
                        return returnUrl;
                    }
                    else {
                        return false;
                    }
                });
            }
            function malSearch() {
                var url = "https://myanimelist.net/" + page.type + ".php?q=" + encodeURI(title);
                con.log("malSearch", url);
                return api.request.xhr('GET', url).then((response) => {
                    if (response.responseText !== 'null' && !(response.responseText.indexOf("error") > -1)) {
                        try {
                            var link = response.responseText.split('<a class="hoverinfo_trigger" href="')[1].split('"')[0];
                            This.setCache(link, false, identifier);
                            return link;
                        }
                        catch (e) {
                            con.error(e);
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                });
            }
            //Helper
            function titleToDbKey(title) {
                if (window.location.href.indexOf("crunchyroll.com") > -1) {
                    return encodeURIComponent(title.toLowerCase().split('#')[0]).replace(/\./g, '%2E');
                }
                return title.toLowerCase().split('#')[0].replace(/\./g, '%2E');
            }
            ;
        });
    }
    setCache(url, toDatabase, identifier = null) {
        if (identifier == null)
            identifier = this.page.sync.getIdentifier(this.url);
        api.storage.set(this.page.name + '/' + identifier + '/Mal', url);
    }
    deleteCache() {
        api.storage.remove(this.page.name + '/' + this.page.sync.getIdentifier(this.url) + '/Mal');
    }
    getOffset() {
        if (typeof this.offset == 'undefined')
            return 0;
        return this.offset;
    }
    setOffset(value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.offset = value;
            return api.storage.set(this.page.name + '/' + this.page.sync.getIdentifier(this.url) + '/Offset', value);
        });
    }
    loadUI() {
        if (this.UILoaded)
            return;
        this.UILoaded = true;
        var wrapStart = '<span style="display: inline-block;">';
        var wrapEnd = '</span>';
        var ui = '<p id="malp">';
        ui += '<span id="MalInfo">Loading</span>';
        ui += '<span id="MalData" style="display: none; justify-content: space-between; flex-wrap: wrap;">';
        ui += wrapStart;
        ui += '<span class="info">MAL Score: </span>';
        ui += '<a id="malRating" style="min-width: 30px;display: inline-block;" target="_blank" href="">____</a>';
        ui += wrapEnd;
        //ui += '<span id="MalLogin">';
        wrapStart = '<span style="display: inline-block; display: none;" class="MalLogin">';
        ui += wrapStart;
        ui += '<span class="info">Status: </span>';
        ui += '<select id="malStatus" style="font-size: 12px;background: transparent; border-width: 1px; border-color: grey;  text-decoration: none; outline: medium none;">';
        //ui += '<option value="0" style="background: #111111;"></option>';
        ui += '<option value="1" style="background: #111111;">' + utils.watching(this.page.type) + '</option>';
        ui += '<option value="2" style="background: #111111;">Completed</option>';
        ui += '<option value="3" style="background: #111111;">On-Hold</option>';
        ui += '<option value="4" style="background: #111111;">Dropped</option>';
        ui += '<option value="6" style="background: #111111;">' + utils.planTo(this.page.type) + '</option>';
        ui += '</select>';
        ui += wrapEnd;
        if (this.page.type == 'anime') {
            var middle = '';
            middle += wrapStart;
            middle += '<span class="info">Episodes: </span>';
            middle += '<span style=" text-decoration: none; outline: medium none;">';
            middle += '<input id="malEpisodes" value="0" style="background: transparent; border-width: 1px; border-color: grey; text-align: right;  text-decoration: none; outline: medium none;" type="text" size="1" maxlength="4">';
            middle += '/<span id="malTotal">0</span>';
            middle += '</span>';
            middle += wrapEnd;
        }
        else {
            var middle = '';
            middle += wrapStart;
            middle += '<span class="info">Volumes: </span>';
            middle += '<span style=" text-decoration: none; outline: medium none;">';
            middle += '<input id="malVolumes" value="0" style="background: transparent; border-width: 1px; border-color: grey; text-align: right;  text-decoration: none; outline: medium none;" type="text" size="1" maxlength="4">';
            middle += '/<span id="malTotalVol">0</span>';
            middle += '</span>';
            middle += wrapEnd;
            middle += wrapStart;
            middle += '<span class="info">Chapters: </span>';
            middle += '<span style=" text-decoration: none; outline: medium none;">';
            middle += '<input id="malEpisodes" value="0" style="background: transparent; border-width: 1px; border-color: grey; text-align: right;  text-decoration: none; outline: medium none;" type="text" size="1" maxlength="4">';
            middle += '/<span id="malTotalCha">0</span>';
            middle += '</span>';
            middle += wrapEnd;
        }
        ui += middle;
        ui += wrapStart;
        ui += '<span class="info">Your Score: </span>';
        ui += '<select id="malUserRating" style="font-size: 12px;background: transparent; border-width: 1px; border-color: grey;  text-decoration: none; outline: medium none;"><option value="" style="background: #111111;">Select</option>';
        ui += '<option value="10" style="background: #111111;">(10) Masterpiece</option>';
        ui += '<option value="9" style="background: #111111;">(9) Great</option>';
        ui += '<option value="8" style="background: #111111;">(8) Very Good</option>';
        ui += '<option value="7" style="background: #111111;">(7) Good</option>';
        ui += '<option value="6" style="background: #111111;">(6) Fine</option>';
        ui += '<option value="5" style="background: #111111;">(5) Average</option>';
        ui += '<option value="4" style="background: #111111;">(4) Bad</option>';
        ui += '<option value="3" style="background: #111111;">(3) Very Bad</option>';
        ui += '<option value="2" style="background: #111111;">(2) Horrible</option>';
        ui += '<option value="1" style="background: #111111;">(1) Appalling</option>';
        ui += '</select>';
        ui += wrapEnd;
        //ui += '</span>';
        ui += '</span>';
        ui += '</p>';
        var uihead = '';
        uihead += '<p class="headui" style="float: right; margin: 0; margin-right: 10px">';
        uihead += '';
        uihead += '</p>';
        var uiwrong = '';
        uiwrong += '<button class="open-info-popup mdl-button" style="display:none; margin-left: 6px;">MAL</button>';
        if (this.page.isSyncPage(this.url)) {
            if (typeof (this.page.sync.uiSelector) != "undefined") {
                this.page.sync.uiSelector($(ui));
            }
        }
        else {
            if (typeof (this.page.overview) != "undefined") {
                this.page.overview.uiSelector($(ui));
            }
        }
        var This = this;
        $("#malEpisodes, #malVolumes, #malUserRating, #malStatus").change(function () {
            This.buttonclick();
        });
    }
    buttonclick() {
        this.malObj.setEpisode($("#malEpisodes").val());
        if ($("#malVolumes").length)
            this.malObj.setVolume($("#malVolumes").val());
        this.malObj.setScore($("#malUserRating").val());
        this.malObj.setStatus($("#malStatus").val());
        this.syncHandling()
            .then(() => {
            return this.malObj.update();
        }).then(() => {
            this.fillUI();
        });
    }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2), __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(utils, api) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Kissanime; });
const Kissanime = {
    name: 'kissanime',
    domain: 'http://kissanime.ru',
    database: 'Kissanime',
    type: 'anime',
    isSyncPage: function (url) {
        if (typeof utils.urlPart(url, 5) != 'undefined') {
            if ($('#centerDivVideo').length) {
                return true;
            }
        }
        return false;
    },
    sync: {
        getTitle: function (url) { return Kissanime.sync.getIdentifier(url); },
        getIdentifier: function (url) { return utils.urlPart(url, 4); },
        getOverviewUrl: function (url) { return url.split('/').slice(0, 5).join('/'); },
        getEpisode: function (url) {
            var episodePart = utils.urlPart(url, 5);
            var temp = [];
            temp = episodePart.match(/[e,E][p,P][i,I]?[s,S]?[o,O]?[d,D]?[e,E]?\D?\d{3}/);
            if (temp !== null) {
                episodePart = temp[0];
            }
            temp = episodePart.match(/\d{3}/);
            if (temp === null) {
                temp = episodePart.match(/\d{2,}\-/);
                if (temp === null) {
                    episodePart = 0;
                }
                else {
                    episodePart = temp[0];
                }
            }
            else {
                episodePart = temp[0];
            }
            return episodePart;
        },
    },
    overview: {
        getTitle: function () { return $('.bigChar').first().text(); },
        getIdentifier: function (url) { return Kissanime.sync.getIdentifier(url); },
        uiSelector: function (selector) { selector.insertAfter($(".bigChar").first()); },
        list: {
            elementsSelector: function () { return $(".listing tr").filter(function () { return $(this).find('a').length > 0; }); },
            elementUrl: function (selector) { return utils.absoluteLink(selector.find('a').first().attr('href'), Kissanime.domain); },
            elementEp: function (selector) {
                var url = Kissanime.overview.list.elementUrl(selector);
                if (/_ED/.test(url))
                    return NaN;
                return Kissanime.sync.getEpisode(url);
            },
        }
    },
    init(page) {
        api.storage.addStyle(__webpack_require__(15).toString());
        $(document).ready(function () { page.handlePage(); });
    }
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2), __webpack_require__(0)))

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(utils, api) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Kissmanga; });
const Kissmanga = {
    name: 'kissmanga',
    domain: 'http://kissmanga.com',
    database: 'Kissmanga',
    type: 'manga',
    isSyncPage: function (url) {
        if (typeof utils.urlPart(url, 5) != 'undefined') {
            return true;
        }
        return false;
    },
    sync: {
        getTitle: function (url) { return utils.urlPart(url, 4); },
        getIdentifier: function (url) { return utils.urlPart(url, 4); },
        getOverviewUrl: function (url) { return url.split('/').slice(0, 5).join('/'); },
        getEpisode: function (url) {
            var episodePart = utils.urlPart(url, 5);
            //var temp = [];
            /*try{
              episodePart = episodePart.replace($('.bigChar').attr('href').split('/')[2],'');
            }catch(e){
              episodePart = episodePart.replace(kalUrl.split("/")[4],'');
            }*/
            var temp = episodePart.match(/[c,C][h,H][a,A]?[p,P]?[t,T]?[e,E]?[r,R]?\D?\d+/);
            if (temp === null) {
                episodePart = episodePart.replace(/[V,v][o,O][l,L]\D?\d+/, '');
                temp = episodePart.match(/\d{3}/);
                if (temp === null) {
                    temp = episodePart.match(/\d+/);
                    if (temp === null) {
                        episodePart = 0;
                    }
                    else {
                        episodePart = temp[0];
                    }
                }
                else {
                    episodePart = temp[0];
                }
            }
            else {
                episodePart = temp[0].match(/\d+/)[0];
            }
            return episodePart;
        },
        getVolume: function (url) {
            try {
                url = url.match(/[V,v][o,O][l,L]\D?\d{3}/)[0];
                url = url.match(/\d+/)[0].slice(-3);
            }
            catch (e) {
                return;
            }
            return url;
        },
    },
    overview: {
        getTitle: function () { return $('.bigChar').first().text(); },
        getIdentifier: function (url) { return Kissmanga.sync.getIdentifier(url); },
        uiSelector: function (selector) { selector.insertAfter($(".bigChar").first()); },
        list: {
            elementsSelector: function () { return $(".listing tr").filter(function () { return $(this).find('a').length > 0; }); },
            elementUrl: function (selector) { return utils.absoluteLink(selector.find('a').first().attr('href'), Kissmanga.domain); },
            elementEp: function (selector) {
                var url = Kissmanga.overview.list.elementUrl(selector);
                if (/_ED/.test(url))
                    return NaN;
                return Kissmanga.sync.getEpisode(url);
            },
        }
    },
    init(page) {
        api.storage.addStyle(__webpack_require__(17).toString());
        $(document).ready(function () { page.handlePage(); });
    }
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2), __webpack_require__(0)))

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(api) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return initIframeModal; });
/* harmony import */ var _minimalClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);

function createIframe(page) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute("id", "info-iframe");
    iframe.setAttribute("style", "height:100%;width:100%;border:0;display:block;");
    iframe.onload = function () {
        var head = $("#info-iframe").contents().find("head");
        api.storage.injectjsResource('simpleBarjs', head);
        api.storage.injectjsResource('materialjs', head);
        api.storage.updateDom(head);
        api.storage.injectCssResource('materialCSS', head);
        api.storage.injectCssResource('materialFont', head);
        api.storage.injectCssResource('simpleBarCSS', head);
        //TEMP
        var minimalObj = new _minimalClass__WEBPACK_IMPORTED_MODULE_0__[/* minimal */ "a"]($("#info-iframe").contents().find('html'));
        if (typeof (page) != 'undefined') {
            minimalObj.setPageSync(page);
            if (typeof (page.malObj) != 'undefined') {
                minimalObj.fill(page.malObj.url);
            }
            else {
                minimalObj.fill(null);
            }
        }
        //TEMP
    };
    document.getElementById("modal-content").appendChild(iframe);
    $("#modal-content").append('<div class="kal-tempHeader" style="position:  absolute; width: 100%; height:  103px; background-color: rgb(63,81,181); "></div>');
    if ((!$("#info-iframe").length) || ($('#info-iframe').css('display') != 'block')) {
        $('#info-popup').remove();
        alert('The miniMAL iframe could not be loaded.\nThis could be caused by an AdBlocker.');
    }
}
function initIframeModal(page) {
    var posLeft = api.settings.get('posLeft');
    var miniMalWidth = api.settings.get('miniMalWidth');
    var miniMalHeight = api.settings.get('miniMalHeight');
    if (!($('#info-popup').length)) {
        api.storage.addStyle('.modal-content-kal.fullscreen{width: 100% !important;height: 100% !important; bottom: 0 !important;' + posLeft + ': 0 !important;}\
      .modal-content-kal{-webkit-transition: all 0.5s ease; -moz-transition: all 0.5s ease; -o-transition: all 0.5s ease; transition: all 0.5s ease;}\
      .floatbutton:hover {background-color:rgb(63,81,181);}\
      .floatbutton:hover div {background-color:white;}\
      .floatbutton div {background-color:black;-webkit-transition: all 0.5s ease;-moz-transition: all 0.5s ease;-o-transition: all 0.5s ease;transition: all 0.5s ease;}\
      .floatbutton {\
       z-index: 9999;display: none; position:fixed; bottom:40px; right:40px; border-radius: 50%; font-size: 24px; height: 56px; margin: auto; min-width: 56px; width: 56px; padding: 0; overflow: hidden; background: rgba(158,158,158,.2); box-shadow: 0 1px 1.5px 0 rgba(0,0,0,.12), 0 1px 1px 0 rgba(0,0,0,.24); line-height: normal; border: none;\
       font-weight: 500; text-transform: uppercase; letter-spacing: 0; will-change: box-shadow; transition: box-shadow .2s cubic-bezier(.4,0,1,1),background-color .2s cubic-bezier(.4,0,.2,1),color .2s cubic-bezier(.4,0,.2,1); outline: none; cursor: pointer; text-decoration: none; text-align: center; vertical-align: middle; padding: 16px;\
      }\
      .mdl-button{\
       background: #3f51b5; color: #fff;box-shadow: 0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12);\
       border: none; border-radius: 2px;\
      }');
        //var position = 'width: 80%; height: 70%; position: absolute; top: 15%; left: 10%';
        var position = 'max-width: 100%; max-height: 100%; min-width: 500px; min-height: 300px; width: ' + miniMalWidth + '; height: ' + miniMalHeight + '; position: absolute; bottom: 0%; ' + posLeft + ': 0%'; //phone
        // @ts-ignore
        if ($(window).width() < 500) {
            position = 'width: 100vw; height: 100%; position: absolute; top: 0%; ' + posLeft + ': 0%';
        }
        var material = '<dialog class="modal-kal" id="info-popup" style="pointer-events: none;display: none; position: fixed;z-index: 9999;left: 0;top: 0;bottom: 0;width: 100%; height: 100%; background-color: transparent; padding: 0; margin: 0; border: 0;">';
        material += '<div id="modal-content" class="modal-content-kal" Style="pointer-events: all; background-color: #f9f9f9; margin: 0; ' + position + '">';
        material += '</div>';
        material += '</dialog>';
        $('body').after(material);
        var floatbutton = '<button class="open-info-popup floatbutton" style="">';
        floatbutton += '<i class="my-float" style="margin-top:22px;"><div style="width: 100%; height: 4px; margin-bottom: 15%;"></div><div style="width: 100%; height: 4px; margin-bottom: 15%;"></div><div style="width: 100%; height: 4px"></div></i></button>';
        $('#info-popup').after(floatbutton);
        $(".open-info-popup").unbind('click').show().click(function () {
            if ($('#info-popup').css('display') == 'none') {
                document.getElementById('info-popup').style.display = "block";
                //fillIframe(url, currentMalData);
                $('.floatbutton').fadeOut();
                if (!($('#info-iframe').length)) {
                    createIframe(page);
                }
            }
            else {
                document.getElementById('info-popup').style.display = "none";
                $('.floatbutton').fadeIn();
            }
        });
    }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)))

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(utils, con, api) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return minimal; });
/* harmony import */ var _types_anime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);

class minimal {
    constructor(minimal) {
        this.minimal = minimal;
        this.history = [];
        var material = `
      <div id="material" style="height: 100%;">
        <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-tabs">
          <header class="mdl-layout__header" style="min-height: 0;">
            <button class="mdl-layout__drawer-button" id="backbutton" style="display: none;"><i class="material-icons">arrow_back</i></button>
            <div class="mdl-layout__header-row">
              <button class="mdl-button mdl-js-button mdl-button--icon mdl-layout__drawer-button" id="book" style="">
                <i class="material-icons" class="material-icons md-48">book</i>
              </button>
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable" id="SearchButton" style="margin-left: -57px; margin-top: 3px; padding-left: 40px;">
                <label class="mdl-button mdl-js-button mdl-button--icon" for="headMalSearch">
                  <i class="material-icons">search</i>
                </label>
                <div class="mdl-textfield__expandable-holder">
                  <input class="mdl-textfield__input" type="text" id="headMalSearch">
                  <label class="mdl-textfield__label" for="headMalSearch"></label>
                </div>
              </div>
              <button class="mdl-button mdl-js-button mdl-button--icon mdl-layout__drawer-button" id="material-fullscreen" style="left: initial; right: 40px;">
                <i class="material-icons" class="material-icons md-48">fullscreen</i>
              </button>
              <button class="mdl-button mdl-js-button mdl-button--icon mdl-layout__drawer-button" id="close-info-popup" style="left: initial; right: 0;">
                <i class="material-icons close">close</i>
              </button>
            </div>
            <!-- Tabs -->
            <div class="mdl-layout__tab-bar mdl-js-ripple-effect">

              <a href="#fixed-tab-1" class="mdl-layout__tab is-active">Overview</a>
              <a href="#fixed-tab-2" class="mdl-layout__tab reviewsTab">Reviews</a>
              <a href="#fixed-tab-3" class="mdl-layout__tab recommendationTab">Recommendations</a>
              <a href="#fixed-tab-5" class="mdl-layout__tab settingsTab">Settings</a>
            </div>
          </header>
          <main class="mdl-layout__content" data-simplebar style="height:  100%;">
            <section class="mdl-layout__tab-panel is-active" id="fixed-tab-1">
              <div id="loadOverview" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>
              <div class="page-content"></div>
            </section>
            <section class="mdl-layout__tab-panel" id="fixed-tab-2">
              <div id="loadReviews" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>
              <div class="page-content malClear" id="malReviews"></div>
            </section>
            <section class="mdl-layout__tab-panel" id="fixed-tab-3">
              <div id="loadRecommendations" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>
              <div class="page-content malClear" id="malRecommendations"></div>
            </section>
            <section class="mdl-layout__tab-panel" id="fixed-tab-4">
              <div id="loadMalSearchPop" class="mdl-progress mdl-js-progress mdl-progress__indeterminate" style="width: 100%; position: absolute;"></div>
              <div class="page-content malClear" id="malSearchPopInner"></div>
            </section>
            <section class="mdl-layout__tab-panel" id="fixed-tab-5">
              <div class="page-content malClear" id="malConfig"></div>
            </section></main>
          </div>
        </div>
      </div>
    `;
        this.minimal.find("body").append(material);
        this.uiListener();
        this.injectCss();
        this.loadSettings();
        this.updateDom();
    }
    uiListener() {
        var modal = document.getElementById('info-popup');
        var This = this;
        this.minimal.on('click', '.mdl-layout__content a', function (e) {
            e.preventDefault();
            // @ts-ignore
            var url = utils.absoluteLink($(this).attr('href'), 'https://myanimelist.net');
            if (!This.fill(url)) {
                var win = window.open(url, '_blank');
                if (win) {
                    win.focus();
                }
                else {
                    alert('Please allow popups for this website');
                }
            }
        });
        this.minimal.find("#backbutton").click(function () {
            con.log('History', This.history);
            if (This.history.length > 1) {
                This.history.pop(); //Remove current page
                var url = This.history.pop();
                if (typeof url != 'undefined') {
                    This.fill(url);
                    if (This.history.length > 1) {
                        return;
                    }
                }
            }
            This.backbuttonHide();
        });
        this.minimal.find("#close-info-popup").click(function () {
            if (This.isPopup()) {
                window.close();
            }
            else {
                modal.style.display = "none";
                $('.floatbutton').fadeIn();
            }
        });
        this.minimal.find("#material-fullscreen").click(function () {
            if ($('.modal-content-kal.fullscreen').length) {
                $(".modal-content-kal").removeClass('fullscreen');
                // @ts-ignore
                $(this).find('i').text('fullscreen');
            }
            else {
                $(".modal-content-kal").addClass('fullscreen');
                // @ts-ignore
                $(this).find('i').text('fullscreen_exit');
            }
        });
        var timer;
        this.minimal.find("#headMalSearch").on("input", function () {
            var listType = 'anime';
            if (typeof This.pageSync != 'undefined') {
                listType = This.pageSync.page.type;
            }
            This.minimal.find('#fixed-tab-4 #malSearchPopInner').html('');
            This.minimal.find('#loadMalSearchPop').show();
            clearTimeout(timer);
            timer = setTimeout(function () {
                if (This.minimal.find("#headMalSearch").val() == '') {
                    This.minimal.find('#material').removeClass('pop-over');
                }
                else {
                    This.minimal.find('#material').addClass('pop-over');
                    This.searchMal(This.minimal.find("#headMalSearch").val(), listType, '#malSearchPopInner', function () {
                        This.minimal.find('#loadMalSearchPop').hide();
                    });
                }
            }, 300);
        });
        this.minimal.on('click', '.searchItem', function (e) {
            This.minimal.find("#headMalSearch").val('').trigger("input").parent().parent().removeClass('is-dirty');
        });
        this.minimal.find("#book").click(function () {
            if (This.minimal.find("#book.open").length) {
                This.minimal.find("#book").toggleClass('open');
                This.minimal.find('#material').removeClass('pop-over');
            }
            else {
                This.minimal.find("#book").toggleClass('open');
                This.minimal.find('#material').addClass('pop-over');
                This.bookmarks();
            }
        });
    }
    isPopup() {
        if ($('#Mal-Sync-Popup').length)
            return true;
        return false;
    }
    updateDom() {
        this.minimal.find("head").click();
    }
    injectCss() {
        this.minimal.find("head").append($('<style>')
            .html(__webpack_require__(19).toString()));
    }
    fill(url) {
        if (url == null) {
            this.minimal.find('#material').addClass('settings-only');
            return false;
        }
        if (/^https:\/\/myanimelist.net\/(anime|manga)\//i.test(url)) {
            this.loadOverview(new _types_anime__WEBPACK_IMPORTED_MODULE_0__[/* animeType */ "a"](url));
            return true;
        }
        return false;
    }
    setPageSync(page) {
        this.pageSync = page;
        var This = this;
        var malUrl = '';
        var title = 'Not Found';
        if (typeof page.malObj != 'undefined') {
            malUrl = page.malObj.url;
            title = page.malObj.name;
        }
        var html = ` <div class="mdl-card__title mdl-card--border">
        <h2 class="mdl-card__title-text">
          ${title}
        </h2>
      </div>
      <div class="mdl-list__item">
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">
          <input class="mdl-textfield__input" style="padding-right: 18px;" type="number" step="1" id="malOffset" value="${page.getOffset()}">
          <label class="mdl-textfield__label" for="malOffset">Episode Offset</label>
          ${utils.getTooltip('Input the episode offset, if an anime has 12 episodes, but uses the numbers 0-11 rather than 1-12, you simply type " +1 " in the episode offset.', 'float: right; margin-top: -17px;', 'left')}
        </div>
      </div>
      <div class="mdl-list__item" style="padding-bottom: 0;padding-top: 0;">
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">
          <input class="mdl-textfield__input" style="padding-right: 18px;" type="text" id="malUrlInput" value="${malUrl}">
          <label class="mdl-textfield__label" for="malUrlInput">MyAnimeList Url</label>
          ${utils.getTooltip('Only change this URL if it points to the wrong anime page on MAL.', 'float: right; margin-top: -17px;', 'left')}
        </div>
      </div>

      <div class="mdl-list__item" style="padding-bottom: 0;padding-top: 0;">
        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">
          <label class="mdl-textfield__label" for="malSearch">
            Search
          </label>
          <input class="mdl-textfield__input" style="padding-right: 18px;" type="text" id="malSearch">
          ${utils.getTooltip('This field is for finding an anime, when you need to replace the "MyAnimeList Url" shown above.<br>To make a search, simply begin typing the name of an anime, and a list with results will automatically appear as you type.', 'float: right; margin-top: -17px;', 'left')}
        </div>
      </div>
      <div class="mdl-list__item" style="min-height: 0; padding-bottom: 0; padding-top: 0;">
        <div class="malResults" id="malSearchResults"></div>
      </div>

      <div class="mdl-list__item">
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" id="malSubmit">Update</button>
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" id="malReset" style="margin-left: 5px;">Reset</button>
      </div>`;
        this.minimal.find('#page-config').html(html);
        this.minimal.find("#malOffset").on("input", function () {
            var Offset = This.minimal.find("#malOffset").val();
            if (Offset !== null) {
                if (Offset !== '') {
                    page.setOffset(Offset);
                    utils.flashm("New Offset (" + Offset + ") set.");
                }
                else {
                    page.setOffset(0);
                    utils.flashm("Offset reset");
                }
            }
        });
        this.minimal.find("#malReset").click(function () {
            page.deleteCache();
            utils.flashm("MyAnimeList url reset", false);
            page.handlePage();
        });
        this.minimal.find("#malSubmit").click(function () {
            var murl = This.minimal.find("#malUrlInput").val();
            var toDatabase = false;
            if (typeof page.page.database != 'undefined' && confirm('Submit database correction request? \nIf it does not exist on MAL, please leave empty.')) {
                toDatabase = 'correction';
            }
            page.setCache(murl, toDatabase);
            utils.flashm("new url '" + murl + "' set.", false);
            page.handlePage();
        });
        var listType = 'anime';
        if (typeof This.pageSync != 'undefined') {
            listType = This.pageSync.page.type;
        }
        var timer;
        this.minimal.find("#malSearch").on("input", function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                This.searchMal(This.minimal.find("#malSearch").val(), listType, '.malResults', function () {
                    This.minimal.find("#malSearchResults .searchItem").unbind('click').click(function (e) {
                        e.preventDefault();
                        // @ts-ignore
                        This.minimal.find('#malUrlInput').val($(this).attr('href'));
                        This.minimal.find('#malSearch').val('');
                        This.minimal.find('#malSearchResults').html('');
                        This.minimal.find('#malSubmit').click();
                    });
                });
            }, 300);
        });
        this.updateDom();
    }
    loadOverview(overviewObj) {
        this.minimal.find('#material').removeClass('settings-only').removeClass('pop-over');
        this.minimal.find('.mdl-layout__tab:eq(0) span').trigger("click");
        this.history.push(overviewObj.url);
        if (this.history.length > 1)
            this.backbuttonShow();
        this.minimal.find('#loadOverview').show();
        this.minimal.find('#fixed-tab-1 .page-content').html('');
        overviewObj.init()
            .then(() => {
            return overviewObj.overview();
        }).then((html) => {
            this.minimal.find('#fixed-tab-1 .page-content').html(html);
            this.minimal.find('#loadOverview').hide();
        });
    }
    backbuttonShow() {
        this.minimal.find("#backbutton").show();
        this.minimal.find('#SearchButton').css('margin-left', '-17px');
        this.minimal.find('#book').css('left', '40px');
    }
    backbuttonHide() {
        this.minimal.find("#backbutton").hide();
        this.minimal.find('#SearchButton').css('margin-left', '-57px');
        this.minimal.find('#book').css('left', '0px');
    }
    loadSettings() {
        var This = this;
        var listener = [];
        var settingsUI = `
    <ul class="demo-list-control mdl-list" style="margin: 0px; padding: 0px;">
      <div class="mdl-grid">
        <div id="page-config" class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-shadow--4dp"></div>

        <div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-shadow--4dp">
          <div class="mdl-card__title mdl-card--border">
            <h2 class="mdl-card__title-text">Streaming Site Links</h2>
            ${utils.getTooltip('If disabled, the streaming site will no longer appear in an animes sidebar on MAL.')}
          </div>
          ${materialCheckbox('Kissanime', 'KissAnime')}
          ${materialCheckbox('Masterani', 'MasterAnime')}
          ${materialCheckbox('9anime', '9anime')}
          ${materialCheckbox('Crunchyroll', 'Crunchyroll')}
          ${materialCheckbox('Gogoanime', 'Gogoanime')}
          ${materialCheckbox('Kissmanga', 'KissManga')}
          ${materialCheckbox('Mangadex', 'MangaDex')}
        </div>

        <div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-shadow--4dp">
          <div class="mdl-card__title mdl-card--border">
            <h2 class="mdl-card__title-text">MyAnimeList</h2>
          </div>
          <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
              Thumbnails
              ${utils.getTooltip('The option is for resizing the thumbnails on MAL.<br>Like thumbnails for characters, people, recommendations, etc.')}
            </span>
            <span class="mdl-list__item-secondary-action">
              <select name="myinfo_score" id="malThumbnail" class="inputtext mdl-textfield__input" style="outline: none;">
                <option value="144">Large</option>
                <option value="100">Medium</option>
                <option value="60">Small</option>
                <option value="0">MAL Default</option>
              </select>
            </span>
          </li>
        </div>

        <div class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-shadow--4dp">
          <div class="mdl-card__title mdl-card--border">
            <h2 class="mdl-card__title-text">miniMAL</h2>
            <!--<span style="margin-left: auto; color: #7f7f7f;">Shortcut: Ctrl + m</span>-->
          </div>
          <li class="mdl-list__item">
            <span class="mdl-list__item-primary-content">
              Display to the
            </span>
            <span class="mdl-list__item-secondary-action">
              <select name="myinfo_score" id="posLeft" class="inputtext mdl-textfield__input" style="outline: none;">
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </span>
          </li>
          <!--${materialCheckbox('miniMALonMal', 'Display on MyAnimeList') /*TODO*/}
          ${materialCheckbox('displayFloatButton', 'Floating menu button')}
          ${materialCheckbox('outWay', 'Move video out of the way')}-->
          <li class="mdl-list__item" style="display: inline-block; width: 49%;">
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">
              <input class="mdl-textfield__input" type="text" step="1" id="miniMalHeight" value="${api.settings.get('miniMalHeight')}">
              <label class="mdl-textfield__label" for="miniMalHeight">Height (px / %)
              </label>
            </div>
          </li>
          <li class="mdl-list__item" style="display: inline-block; width: 50%;">
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label" style="width: 100%;">
              <input class="mdl-textfield__input" type="text" step="1" id="miniMalWidth" value="${api.settings.get('miniMalWidth')}">
              <label class="mdl-textfield__label" for="miniMalWidth">Width (px / %)</label>
            </div>
          </li>
        </div>

      </div>
    </ul>
    `;
        this.minimal.find('#malConfig').html(settingsUI);
        // Listener
        this.minimal.find("#posLeft").val(api.settings.get('posLeft'));
        this.minimal.find("#posLeft").change(function () {
            // @ts-ignore
            api.settings.set('posLeft', $(this).val());
            // @ts-ignore
            $('#modal-content').css('right', 'auto').css('left', 'auto').css($(this).val(), '0');
        });
        this.minimal.find("#miniMalWidth").on("input", function () {
            var miniMalWidth = This.minimal.find("#miniMalWidth").val();
            if (miniMalWidth !== null) {
                if (miniMalWidth === '') {
                    miniMalWidth = '30%';
                    utils.flashm("Width reset");
                }
                api.settings.set('miniMalWidth', miniMalWidth);
            }
            $("#modal-content").css('width', miniMalWidth);
        });
        this.minimal.find("#miniMalHeight").on("input", function () {
            var miniMalHeight = This.minimal.find("#miniMalHeight").val();
            if (miniMalHeight !== null) {
                if (miniMalHeight === '') {
                    miniMalHeight = '90%';
                    utils.flashm("Height reset");
                }
                api.settings.set('miniMalHeight', miniMalHeight);
            }
            $("#modal-content").css('height', miniMalHeight);
        });
        this.minimal.find("#malThumbnail").val(api.settings.get('malThumbnail'));
        this.minimal.find("#malThumbnail").change(function () {
            api.settings.set('malThumbnail', This.minimal.find("#malThumbnail").val());
        });
        listener.forEach(function (fn) {
            fn();
        });
        //helper
        function materialCheckbox(option, text, header = false) {
            var check = '';
            var sty = '';
            var value = api.settings.get(option);
            if (value)
                check = 'checked';
            if (header)
                sty = 'font-size: 24px; font-weight: 300; line-height: normal;';
            var item = `
      <li class="mdl-list__item">
        <span class="mdl-list__item-primary-content" style="${sty}">
          ${text}
        </span>
        <span class="mdl-list__item-secondary-action">
          <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="${option}">
            <input type="checkbox" id="${option}" class="mdl-switch__input" ${check} />
          </label>
        </span>
      </li>`;
            listener.push(function () {
                This.minimal.find('#' + option).change(function () {
                    if (This.minimal.find('#' + option).is(":checked")) {
                        api.settings.set(option, true);
                    }
                    else {
                        api.settings.set(option, false);
                    }
                });
            });
            return item;
        }
    }
    searchMal(keyword, type = 'all', selector, callback) {
        var This = this;
        this.minimal.find(selector).html('');
        api.request.xhr('GET', 'https://myanimelist.net/search/prefix.json?type=' + type + '&keyword=' + keyword + '&v=1').then((response) => {
            var searchResults = $.parseJSON(response.responseText);
            this.minimal.find(selector).append('<div class="mdl-grid">\
          <select name="myinfo_score" id="searchListType" class="inputtext mdl-textfield__input mdl-cell mdl-cell--12-col" style="outline: none; background-color: white; border: none;">\
            <option value="anime">Anime</option>\
            <option value="manga">Manga</option>\
          </select>\
        </div>');
            this.minimal.find('#searchListType').val(type);
            this.minimal.find('#searchListType').change(function (event) {
                This.searchMal(keyword, This.minimal.find('#searchListType').val(), selector, callback);
            });
            $.each(searchResults, function () {
                $.each(this, function () {
                    $.each(this, function () {
                        if (typeof this !== 'object')
                            return;
                        $.each(this, function () {
                            if (typeof this['name'] != 'undefined') {
                                This.minimal.find(selector + ' > div').append('<a class="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-shadow--2dp mdl-grid searchItem" href="' + this['url'] + '" style="cursor: pointer;">\
                  <img src="' + this['image_url'] + '" style="margin: -8px 0px -8px -8px; height: 100px; width: 64px; background-color: grey;"></img>\
                  <div style="flex-grow: 100; cursor: pointer; margin-top: 0; margin-bottom: 0;" class="mdl-cell">\
                    <span style="font-size: 20px; font-weight: 400; line-height: 1;">' + this['name'] + '</span>\
                    <p style="margin-bottom: 0; line-height: 20px; padding-top: 3px;">Type: ' + this['payload']['media_type'] + '</p>\
                    <p style="margin-bottom: 0; line-height: 20px;">Score: ' + this['payload']['score'] + '</p>\
                    <p style="margin-bottom: 0; line-height: 20px;">Year: ' + this['payload']['start_year'] + '</p>\
                  </div>\
                  </a>');
                            }
                        });
                    });
                });
            });
            callback();
        });
    }
    bookmarks(state = 1, localListType = 'anime') {
        this.minimal.find('#fixed-tab-4 #malSearchPopInner').html('');
        this.minimal.find('#loadMalSearchPop').show();
        var element = this.minimal.find('#malSearchPopInner');
        var This = this;
        var my_watched_episodes = 'num_watched_episodes';
        var series_episodes = 'anime_num_episodes';
        var localPlanTo = 'Plan to Watch';
        var localWatching = 'Watching';
        if (localListType != 'anime') {
            my_watched_episodes = 'num_read_chapters';
            series_episodes = 'manga_num_chapters';
            localPlanTo = 'Plan to Read';
            localWatching = 'Reading';
        }
        var firstEl = 1;
        utils.getUserList(state, localListType, function (el, index, total) {
            if (firstEl) {
                firstEl = 0;
                var bookmarkHtml = '<div class="mdl-grid" id="malList" style="justify-content: space-around;">';
                bookmarkHtml += '<select name="myinfo_score" id="userListType" class="inputtext mdl-textfield__input mdl-cell mdl-cell--12-col" style="outline: none; background-color: white; border: none;">\
                          <option value="anime">Anime</option>\
                          <option value="manga">Manga</option>\
                        </select>';
                bookmarkHtml += '<select name="myinfo_score" id="userListState" class="inputtext mdl-textfield__input mdl-cell mdl-cell--12-col" style="outline: none; background-color: white; border: none;">\
                          <option value="7">All</option>\
                          <option value="1" selected>' + localWatching + '</option>\
                          <option value="2">Completed</option>\
                          <option value="3">On-Hold</option>\
                          <option value="4">Dropped</option>\
                          <option value="6">' + localPlanTo + '</option>\
                        </select>';
                //flexbox placeholder
                for (var i = 0; i < 10; i++) {
                    bookmarkHtml += '<div class="listPlaceholder mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--6-col-phone mdl-shadow--2dp mdl-grid "  style="cursor: pointer; height: 250px; padding: 0; width: 210px; height: 0px; margin-top:0; margin-bottom:0; visibility: hidden;"></div>';
                }
                bookmarkHtml += '</div>';
                element.html(bookmarkHtml);
                This.minimal.find('#malSearchPopInner #userListType').val(localListType);
                This.minimal.find('#malSearchPopInner #userListType').change(function (event) {
                    This.bookmarks(state, This.minimal.find('#malSearchPopInner #userListType').val());
                });
                This.minimal.find('#malSearchPopInner #userListState').val(state);
                This.minimal.find('#malSearchPopInner #userListState').change(function (event) {
                    This.bookmarks(This.minimal.find('#malSearchPopInner #userListState').val(), localListType);
                });
            }
            if (!el) {
                element.find('#malList .listPlaceholder').first().before('<span class="mdl-chip" style="margin: auto; margin-top: 16px; display: table;"><span class="mdl-chip__text">No Entries</span></span>');
                element.find('#malList .listPlaceholder').remove();
                return;
            }
            var bookmarkElement = '';
            var uid = el[localListType + '_id'];
            var malUrl = 'https://myanimelist.net' + el[localListType + '_url'];
            var imageHi = el[localListType + '_image_path'];
            var regexDimensions = /\/r\/\d*x\d*/g;
            if (regexDimensions.test(imageHi)) {
                imageHi = imageHi.replace(/v.jpg$/g, '.jpg').replace(regexDimensions, '');
            }
            var progressProcent = (el[my_watched_episodes] / el[series_episodes]) * 100;
            bookmarkElement += '<div class="mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-cell--6-col-phone mdl-shadow--2dp mdl-grid bookEntry e' + uid + '" malhref="' + malUrl + '" maltitle="' + el[localListType + '_title'] + '" malimage="' + el[localListType + '_image_path'] + '" style="position: relative; cursor: pointer; height: 250px; padding: 0; width: 210px; height: 293px;">';
            bookmarkElement += '<div class="data title" style="background-image: url(' + imageHi + '); background-size: cover; background-position: center center; background-repeat: no-repeat; width: 100%; position: relative; padding-top: 5px;">';
            bookmarkElement += '<span class="mdl-shadow--2dp" style="position: absolute; bottom: 0; display: block; background-color: rgba(255, 255, 255, 0.9); padding-top: 5px; display: inline-flex; align-items: center; justify-content: space-between; left: 0; right: 0; padding-right: 8px; padding-left: 8px; padding-bottom: 8px;">' + el[localListType + '_title'];
            bookmarkElement += '<div id="p1" class="mdl-progress" series_episodes="' + el[series_episodes] + '" style="position: absolute; top: -4px; left: 0;"><div class="progressbar bar bar1" style="width: ' + progressProcent + '%;"></div><div class="bufferbar bar bar2" style="width: 100%;"></div><div class="auxbar bar bar3" style="width: 0%;"></div></div>';
            bookmarkElement += '<div class="data progress mdl-chip mdl-chip--contact mdl-color--indigo-100" style="float: right; line-height: 20px; height: 20px; padding-right: 4px; margin-left: 5px;">';
            bookmarkElement += '<div class="link mdl-chip__contact mdl-color--primary mdl-color-text--white" style="line-height: 20px; height: 20px; margin-right: 0;">' + el[my_watched_episodes] + '</div>';
            bookmarkElement += '</div>';
            bookmarkElement += '</span>';
            bookmarkElement += '<div class="tags" style="display: none;">' + el['tags'] + '</div>';
            bookmarkElement += '</div>';
            bookmarkElement += '</div>';
            element.find('#malList .listPlaceholder').first().before(bookmarkElement);
            var domE = element.find('#malList .e' + uid).first();
            domE.click(function (event) {
                // @ts-ignore
                if (!This.fill($(this).attr('malhref'))) {
                    con.error('Something is wrong');
                }
            });
        }, function () {
            This.minimal.find('#loadMalSearchPop').hide();
        }, null, function (continueCall) {
            if (state == 1) {
                continueCall();
                return;
            }
            var scrollable = This.minimal.find('.simplebar-scroll-content');
            var scrollDone = 0;
            This.minimal.find('#loadMalSearchPop').hide();
            scrollable.scroll(function () {
                if (scrollDone)
                    return;
                // @ts-ignore
                if (scrollable.scrollTop() + scrollable.height() > scrollable.find('.simplebar-content').height() - 100) {
                    scrollDone = 1;
                    con.log('[Bookmarks]', 'Loading next part');
                    This.minimal.find('#loadMalSearchPop').show();
                    continueCall();
                }
            });
        });
    }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2), __webpack_require__(1), __webpack_require__(0)))

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(api) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return animeType; });
class animeType {
    constructor(url) {
        this.url = url;
    }
    init() {
        var This = this;
        return new Promise((resolve, reject) => {
            return api.request.xhr('GET', This.url).then((response) => {
                This.vars = response.responseText;
                resolve();
            });
        });
    }
    overview() {
        return new Promise((resolve, reject) => {
            var data = this.vars;
            var html = '';
            var image = '';
            var title = '';
            var description = '';
            var altTitle = '';
            var stats = '';
            try {
                image = data.split('js-scrollfix-bottom')[1].split('<img src="')[1].split('"')[0];
            }
            catch (e) {
                console.log('[iframeOverview] Error:', e);
            }
            try {
                title = data.split('itemprop="name">')[1].split('<')[0];
            }
            catch (e) {
                console.log('[iframeOverview] Error:', e);
            }
            try {
                description = data.split('itemprop="description">')[1].split('</span')[0];
            }
            catch (e) {
                console.log('[iframeOverview] Error:', e);
            }
            try {
                altTitle = data.split('<h2>Alternative Titles</h2>')[1].split('<h2>')[0];
                altTitle = altTitle.replace(/spaceit_pad/g, 'mdl-chip" style="margin-right: 5px;');
                altTitle = altTitle.replace(/<\/span>/g, '</span><span class="mdl-chip__text">');
                altTitle = altTitle.replace(/<\/div>/g, '</span></div>');
            }
            catch (e) {
                console.log('[iframeOverview] Error:', e);
            }
            try {
                var statsBlock = data.split('<h2>Statistics</h2>')[1].split('<h2>')[0];
                // @ts-ignore
                var tempHtml = $.parseHTML(statsBlock);
                var statsHtml = '<ul class="mdl-list mdl-grid mdl-grid--no-spacing mdl-cell mdl-cell--12-col" style="display: flex; justify-content: space-around;">';
                $.each($(tempHtml).filter('div').slice(0, 5), function (index, value) {
                    statsHtml += '<li class="mdl-list__item mdl-list__item--two-line" style="padding: 0; padding-left: 10px; padding-right: 3px; min-width: 18%;">';
                    statsHtml += '<span class="mdl-list__item-primary-content">';
                    statsHtml += '<span>';
                    statsHtml += $(this).find('.dark_text').text();
                    statsHtml += '</span>';
                    statsHtml += '<span class="mdl-list__item-sub-title">';
                    statsHtml += $(this).find('span[itemprop=ratingValue]').height() != null ? $(this).find('span[itemprop=ratingValue]').text() : $(this).clone().children().remove().end().text();
                    statsHtml += '</span>';
                    statsHtml += '</span>';
                    statsHtml += '</li>';
                });
                statsHtml += '</ul>';
                stats = statsHtml;
            }
            catch (e) {
                console.log('[iframeOverview] Error:', e);
            }
            html += overviewElement(this.url, title, image, description, altTitle, stats);
            try {
                var relatedBlock = data.split('Related ')[1].split('</h2>')[1].split('<h2>')[0];
                var related = $.parseHTML(relatedBlock);
                var relatedHtml = '<ul class="mdl-list">';
                $.each($(related).filter('table').find('tr'), function (index, value) {
                    relatedHtml += '<li class="mdl-list__item mdl-list__item--two-line">';
                    relatedHtml += '<span class="mdl-list__item-primary-content">';
                    relatedHtml += '<span>';
                    relatedHtml += $(this).find('.borderClass').first().text();
                    relatedHtml += '</span>';
                    relatedHtml += '<span class="mdl-list__item-sub-title">';
                    $(this).find('.borderClass').last().each(function () {
                        // @ts-ignore
                        $(this).html($(this).children());
                    });
                    relatedHtml += $(this).find('.borderClass').last().html();
                    relatedHtml += '</span>';
                    relatedHtml += '</span>';
                    relatedHtml += '</li>';
                });
                relatedHtml += '</ul>';
                html += `<div class="mdl-grid mdl-grid--no-spacing mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-shadow--4dp related-block alternative-list mdl-grid malClear">
                  ${relatedHtml}
                </div>`;
            }
            catch (e) {
                console.log('[iframeOverview] Error:', e);
            }
            resolve('<div class="mdl-grid">' + html + '</div>');
        });
    }
}
function overviewElement(url, title, image, description, altTitle, stats) {
    return `
    <div class="mdl-cell mdl-cell--1-col mdl-cell--8-col-tablet mdl-cell--6-col-phone mdl-shadow--4dp stats-block malClear" style="min-width: 120px;">
      ${stats}
    </div>
    <div class="mdl-grid mdl-cell mdl-shadow--4dp coverinfo malClear" style="display:block; flex-grow: 100; min-width: 70%;">
      <div class="mdl-card__media mdl-cell mdl-cell--2-col" style="background-color: transparent; float:left; padding-right: 16px;">
        <img class="malImage malClear" style="width: 100%; height: auto;" src="${image}"></img>
      </div>
      <div class="mdl-cell mdl-cell--12-col">
        <a class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect malClear malLink" href="${url}" style="float: right;" target="_blank"><i class="material-icons">open_in_new</i></a>
        <h1 class="malTitle mdl-card__title-text malClear" style="padding-left: 0px; overflow:visible;">${title}</h1>
        <div class="malAltTitle mdl-card__supporting-text malClear" style="padding: 10px 0 0 0px; overflow:visible;">${altTitle}</div>
      </div>
      <div class="malDescription malClear mdl-cell mdl-cell--10-col" style="overflow: hidden;">
        <p style="color: black;">
          ${description}
        </p>
      </div>
    </div>
  `;
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)))

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(utils, con, api) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return myanimelistClass; });
/* harmony import */ var _pages_pages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _utils_mal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class myanimelistClass {
    constructor(url) {
        this.url = url;
        this.page = null;
        //detail
        this.id = null;
        this.type = null;
        var urlpart = utils.urlPart(url, 3);
        if (urlpart == 'anime' || urlpart == 'manga') {
            this.page = 'detail';
            this.id = utils.urlPart(url, 4);
            this.type = urlpart;
        }
    }
    init() {
        con.log(this);
        switch (this.page) {
            case 'detail':
                this.thumbnails();
                this.streamingUI();
                this.malToKiss();
                this.siteSearch();
                break;
            default:
                con.log('This page has no scipt');
        }
    }
    thumbnails() {
        con.log('Lazyloaded Images');
        if (this.url.indexOf("/pics") > -1) {
            return;
        }
        if (this.url.indexOf("/pictures") > -1) {
            return;
        }
        if (api.settings.get('malThumbnail') == "0") {
            return;
        }
        var height = parseInt(api.settings.get('malThumbnail'));
        var width = Math.floor(height / 144 * 100);
        var surHeight = height + 4;
        var surWidth = width + 4;
        api.storage.addStyle('.picSurround img:not(.noKal){height: ' + height + 'px !important; width: ' + width + 'px !important;}');
        api.storage.addStyle('.picSurround img.lazyloaded.kal{width: auto !important;}');
        api.storage.addStyle('.picSurround:not(.noKal) a{height: ' + surHeight + 'px; width: ' + surWidth + 'px; overflow: hidden; display: flex; justify-content: center;}');
        var loaded = 0;
        try {
            // @ts-ignore
            $(window).load(function () { overrideLazyload(); });
        }
        catch (e) {
            con.info(e);
        }
        try {
            window.onload = function () { overrideLazyload(); };
        }
        catch (e) {
            con.info(e);
        }
        try {
            document.onload = function () { overrideLazyload(); };
        }
        catch (e) {
            con.info(e);
        }
        try {
            $(document).ready(function () { overrideLazyload(); });
        }
        catch (e) {
            con.info(e);
        }
        function overrideLazyload() {
            if (loaded)
                return;
            loaded = 1;
            var tags = document.querySelectorAll(".picSurround img:not(.kal)");
            var url = '';
            for (var i = 0; i < tags.length; i++) {
                var regexDimensions = /\/r\/\d*x\d*/g;
                if (tags[i].hasAttribute("data-src")) {
                    url = tags[i].getAttribute("data-src");
                }
                else {
                    url = tags[i].getAttribute("src");
                }
                if (regexDimensions.test(url) || /voiceactors.*v.jpg$/g.test(url)) {
                    if (!(url.indexOf("100x140") > -1)) {
                        tags[i].setAttribute("data-src", url);
                        url = url.replace(/v.jpg$/g, '.jpg');
                        tags[i].setAttribute("data-srcset", url.replace(regexDimensions, ''));
                        tags[i].classList.add('lazyload');
                    }
                    tags[i].classList.add('kal');
                }
                else {
                    tags[i].closest(".picSurround").classList.add('noKal');
                    tags[i].classList.add('kal');
                    tags[i].classList.add('noKal');
                }
            }
        }
    }
    malToKiss() {
        return __awaiter(this, void 0, void 0, function* () {
            con.log('malToKiss');
            utils.getMalToKissArray(this.type, this.id).then((links) => {
                var html = '';
                for (var pageKey in links) {
                    var page = links[pageKey];
                    var tempHtml = '';
                    var tempUrl = '';
                    for (var streamKey in page) {
                        var stream = page[streamKey];
                        tempHtml += '<div class="mal_links"><a target="_blank" href="' + stream['url'] + '">' + stream['title'] + '</a></div>';
                        tempUrl = stream['url'];
                    }
                    html += '<h2 id="' + pageKey + 'Links" class="mal_links"><img src="https://www.google.com/s2/favicons?domain=' + tempUrl.split('/')[2] + '"> ' + pageKey + '</h2>';
                    html += tempHtml;
                    html += '<br class="mal_links" />';
                }
                $(document).ready(function () {
                    $('h2:contains("Information")').before(html);
                });
            });
        });
    }
    siteSearch() {
        var This = this;
        $(document).ready(function () {
            con.log('Site Search');
            $('h2:contains("Information")').before('<h2 id="mal-sync-search-links" class="mal_links">Search</h2><br class="mal_links" />');
            $('#mal-sync-search-links').one('click', () => {
                var title = $('#contentWrapper > div:first-child span').text();
                var titleEncoded = encodeURI(title);
                var html = '';
                for (var key in _pages_pages__WEBPACK_IMPORTED_MODULE_0__[/* pageSearch */ "a"]) {
                    var page = _pages_pages__WEBPACK_IMPORTED_MODULE_0__[/* pageSearch */ "a"][key];
                    if (page.type !== This.type)
                        continue;
                    var linkContent = `${page.name} <img src="https://www.google.com/s2/favicons?domain=${page.domain}">`;
                    if (typeof page.completeSearchTag === 'undefined') {
                        var link = `<a target="_blank" href="${page.searchUrl(titleEncoded)}">
              ${linkContent}
            </a>`;
                    }
                    else {
                        var link = page.completeSearchTag(title, linkContent);
                    }
                    html +=
                        `<div class="mal_links">
              ${link}
            <a target="_blank" href="https://www.google.com/search?q=${titleEncoded}+site:${page.domain}">
              <img src="https://www.google.com/s2/favicons?domain=google.com">
            </a>
          </div>`;
                }
                $('#mal-sync-search-links').after(html);
            });
        });
    }
    streamingUI() {
        return __awaiter(this, void 0, void 0, function* () {
            con.log('Streaming UI');
            var malObj = new _utils_mal__WEBPACK_IMPORTED_MODULE_1__[/* mal */ "a"](this.url);
            yield malObj.init();
            var streamUrl = malObj.getStreamingUrl();
            if (typeof streamUrl !== 'undefined') {
                $(document).ready(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        $('.h1 span').first().after(`
        <div class="data title progress" id="mal-sync-stream-div" style="display: inline-block; position: relative; top: 2px;">
          <a class="mal-sync-stream" title="${streamUrl.split('/')[2]}" target="_blank" style="margin: 0 0;" href="${streamUrl}">
            <img src="https://www.google.com/s2/favicons?domain=${streamUrl.split('/')[2]}">
          </a>
        </div>`);
                        var resumeUrlObj = yield malObj.getResumeWaching();
                        con.log('resume', resumeUrlObj);
                        if (typeof resumeUrlObj !== 'undefined' && resumeUrlObj.ep === malObj.getEpisode()) {
                            $('#mal-sync-stream-div').append(`<a class="resumeStream" title="Resume watching" target="_blank" style="margin: 0 5px 0 0; color: #BABABA;" href="${resumeUrlObj.url}">
              <img src="${api.storage.assetUrl('arrow-16px.png')}" width="16" height="16">
            </a>`);
                        }
                    });
                });
            }
        });
    }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2), __webpack_require__(1), __webpack_require__(0)))

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(api) {/* harmony import */ var _pages_syncPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _myanimelist_myanimelistClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);


function main() {
    if (window.location.href.indexOf("myanimelist.net") > -1) {
        var mal = new _myanimelist_myanimelistClass__WEBPACK_IMPORTED_MODULE_1__[/* myanimelistClass */ "a"](window.location.href);
        mal.init();
    }
    else {
        var page = new _pages_syncPage__WEBPACK_IMPORTED_MODULE_0__[/* syncPage */ "a"](window.location.href);
        page.init();
    }
}
var css = "font-size: 40px; padding-bottom: 3px; color: white; text-shadow: -1px -1px #2e51a2, 1px -1px #2e51a2, -1px 1px #2e51a2, 1px 1px #2e51a2, 2px 2px #2e51a2, 3px 3px #2e51a2;";
console.log("%cMAL-Sync", css, "Version: " + api.storage.version());
api.settings.init()
    .then(() => {
    main();
});
//temp
/*con.log('log');
con.error('error');
con.info('info');
con.log(utils.urlPart('https://greasyfork.org/de/scripts/27564-kissanimelist/code', 5));

api.storage.set('test', 'test123').then(() => {
  return api.storage.get('test');
}).then((value) => {
  con.log(value);
});

api.request.xhr('GET', 'https://myanimelist.net/').then((response) => {
  con.log(response);
});

const style = require('./style.less').toString();
api.storage.addStyle(style);

$(document).ready(function(){
  utils.flashm('test');
  utils.flashm('test', {type: "test", error: true});
  utils.flashm('permanent', {type: "permanent", permanent: true, position: "top"});
  utils.flashm('permanent hover', {hoverInfo: true});
  setTimeout(function(){
    utils.flashm('test');
    utils.flashm('test', {type: "test", error: true});
    utils.flashm('test', {type: "test", error: true});
    utils.flashm('test', {type: "test", error: true, position: "top"});
    utils.flashm('test', {type: "test", error: true, position: "top"});
    utils.flashm('permanent2', {type: "permanent", permanent: true});
    utils.flashConfirm('Add?', 'add', function(){alert('yes')}, function(){alert('no')});
  }, 3000)
  utils.flashConfirm('Add?', 'add', function(){alert('yes')}, function(){alert('no')});
});*/

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(0)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(16);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, "#malStatus,\n#malTotal,\n#malEpisodes,\n#malUserRating,\n#malRating,\n#malVolumes,\n#malTotalVol,\n#malTotalCha {\n  color: #d5f406;\n}\n.mal-sync-active {\n  background-color: #002966;\n}\n", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(18);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, "#malStatus,\n#malTotal,\n#malEpisodes,\n#malUserRating,\n#malRating,\n#malVolumes,\n#malTotalVol,\n#malTotalCha {\n  color: #72cefe;\n}\n.mal-sync-active {\n  background-color: #002966;\n}\n", ""]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(20);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)(false);
// imports


// module
exports.push([module.i, "#material .mdl-card__supporting-text {\n  width: initial;\n}\n.mdl-layout__header .mdl-textfield__label:after {\n  background-color: red !important;\n}\n.alternative-list .mdl-list {\n  max-width: 100%;\n  margin: 0;\n  padding: 0;\n}\n.alternative-list .mdl-list__item {\n  height: auto;\n}\n.alternative-list .mdl-list__item-primary-content {\n  height: auto !important;\n}\n.alternative-list .mdl-list__item-primary-content a {\n  display: block;\n}\n.alternative-list .mdl-list__item-text-body {\n  height: auto !important;\n}\n.coverinfo .mdl-chip {\n  height: auto;\n}\n.coverinfo .mdl-chip .mdl-chip__text {\n  white-space: normal;\n  line-height: 24px;\n}\n.mdl-layout__content::-webkit-scrollbar {\n  width: 10px !important;\n  background-color: #F5F5F5;\n}\n.mdl-layout__content::-webkit-scrollbar-thumb {\n  background-color: #c1c1c1 !important;\n}\n.simplebar-track {\n  width: 10px !important;\n  background-color: #F5F5F5;\n}\n.simplebar-scrollbar {\n  background-color: #c1c1c1 !important;\n}\n.simplebar-track.horizontal {\n  display: none;\n}\n.simplebar-scrollbar {\n  border-radius: 0px !important;\n  right: 0 !important;\n  width: 100% !important;\n  opacity: 1 !important;\n}\n.simplebar-scrollbar.visible:before {\n  display: none;\n}\n.simplebar-content {\n  margin-right: -7px !important;\n}\n.simplebar-track {\n  margin-top: -2px;\n  margin-bottom: -2px;\n}\na {\n  text-decoration: none;\n}\n.mdl-layout__tab-panel a:hover {\n  text-decoration: underline;\n}\n.mdl-cell {\n  background-color: #fefefe;\n}\n#material.simple-header .mdl-layout__header .mdl-layout__tab-bar-container {\n  display: none;\n}\n.newEp {\n  position: absolute;\n  background-color: #dedede;\n  height: 25px;\n  width: 29px;\n  top: 3px;\n  right: -4px;\n  background-repeat: no-repeat;\n  background-position: 4px 3px;\n  background-image: url(https://github.com/google/material-design-icons/blob/master/social/1x_web/ic_notifications_none_black_18dp.png?raw=true);\n}\n.searchItem {\n  text-decoration: none !important;\n  color: black;\n}\n#material.settings-only .mdl-layout__header .mdl-layout__tab-bar-container,\n#material.pop-over .mdl-layout__header .mdl-layout__tab-bar-container {\n  display: none;\n}\n#material.settings-only .mdl-layout__tab-panel,\n#material.pop-over .mdl-layout__tab-panel {\n  display: none !important;\n}\n#material.settings-only #fixed-tab-5.mdl-layout__tab-panel {\n  display: block !important;\n}\n#material.pop-over #fixed-tab-5.mdl-layout__tab-panel {\n  display: none !important;\n}\n#material.pop-over #fixed-tab-4.mdl-layout__tab-panel {\n  display: block !important;\n}\n#Mal-Sync-Popup #material-fullscreen {\n  display: none !important;\n}\n", ""]);

// exports


/***/ })
/******/ ]);