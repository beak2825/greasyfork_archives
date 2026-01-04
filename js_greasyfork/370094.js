// ==UserScript==
// @name Kurwachuj.ork
// @namespace karachan.org
// @match *://*.karachan.org/*
// @description Dodaje funkcje na forum obrazkowym karachan.org.
// @exclude http://www.karachan.org/*/src/*
// @exclude https://www.karachan.org/*/src/*
// @exclude http://karachan.org/*/src/*
// @exclude https://karachan.org/*/src/*
// @grant none
// @version 0.0.1.20180706184124
// @downloadURL https://update.greasyfork.org/scripts/370094/Kurwachujork.user.js
// @updateURL https://update.greasyfork.org/scripts/370094/Kurwachujork.meta.js
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


var _Settings = __webpack_require__(1);

var _Settings2 = _interopRequireDefault(_Settings);

var _PostsCounter = __webpack_require__(2);

var _PostsCounter2 = _interopRequireDefault(_PostsCounter);

var _HiderSounds = __webpack_require__(3);

var _HiderSounds2 = _interopRequireDefault(_HiderSounds);

var _CatalogHider = __webpack_require__(4);

var _CatalogHider2 = _interopRequireDefault(_CatalogHider);

var _CatalogCSS = __webpack_require__(5);

var _CatalogCSS2 = _interopRequireDefault(_CatalogCSS);

var _CatalogPreview = __webpack_require__(6);

var _CatalogPreview2 = _interopRequireDefault(_CatalogPreview);

var _CatalogLastFifty = __webpack_require__(7);

var _CatalogLastFifty2 = _interopRequireDefault(_CatalogLastFifty);

var _IdHider = __webpack_require__(8);

var _IdHider2 = _interopRequireDefault(_IdHider);

var _Polish = __webpack_require__(9);

var _Polish2 = _interopRequireDefault(_Polish);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settings = new _Settings2.default();
var counter = new _PostsCounter2.default();
var sounds = new _HiderSounds2.default();
var cathider = new _CatalogHider2.default();
var catcss = new _CatalogCSS2.default();
var catprev = new _CatalogPreview2.default();
var catlast = new _CatalogLastFifty2.default();
var idhider = new _IdHider2.default();
var pl = new _Polish2.default();

window.onload = function () {
    settings.render();

    if (settings.getSettingState("ko-postscounter") == true) {
        counter.render();
    }

    if (settings.getSettingState("ko-cataloghider") == true) {
        cathider.render();
    }
    if (settings.getSettingState("ko-hidersounds") == true) {
        sounds.append();
    }
    if (settings.getSettingState("ko-catalogcss") == true) {
        catcss.apply();
    }
    if (settings.getSettingState("ko-catalogpreview") == true) {
        catprev.render();
    }
    if (settings.getSettingState("ko-cataloglastfifty") == true) {
        catlast.render();
    }
    if (settings.getSettingState("ko-idhider") == true) {
        idhider.render();
    }
    if (settings.getSettingState("ko-polish") == true) {
        pl.translate();
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Settings = function () {
    function Settings() {
        _classCallCheck(this, Settings);

        this.loadSettings();

        if (this.userSettings == null) {

            this.userSettings = {
                "ko-postscounter": false,
                "ko-hidersounds": false,
                "ko-cataloghider": false,
                "ko-catalogcss": false,
                "ko-catalogpreview": false,
                "ko-cataloglastfifty": false,
                "ko-idhider": false,
                "ko-polish": false
            };
            this.saveSettings();
        }

        if (this.userSettings["ko-catalogcss"] == undefined) {
            this.userSettings["ko-catalogcss"] = false;
            this.saveSettings();
        }
        if (this.userSettings["ko-catalogpreview"] == undefined) {
            this.userSettings["ko-catalogpreview"] = false;
            this.saveSettings();
        }
        if (this.userSettings["ko-cataloglastfifty"] == undefined) {
            this.userSettings["ko-cataloglastfifty"] = false;
            this.saveSettings();
        }
        if (this.userSettings["ko-idhider"] == undefined) {
            this.userSettings["ko-idhider"] = false;
            this.saveSettings();
        }
        if (this.userSettings["ko-polish"] == undefined) {
            this.userSettings["ko-polish"] = false;
            this.saveSettings();
        }
    }

    _createClass(Settings, [{
        key: "loadSettings",
        value: function loadSettings() {
            this.userSettings = JSON.parse(localStorage.getItem("kurwa_settings"));
        }
    }, {
        key: "saveSettings",
        value: function saveSettings() {
            localStorage.setItem("kurwa_settings", JSON.stringify(this.userSettings));
        }
    }, {
        key: "render",
        value: function render() {

            var modalNav = document.getElementsByClassName("modal-nav")[0];
            var modalCont = document.getElementsByClassName("modal-cont")[0];
            var tabCont = document.getElementsByClassName("tab-content");

            var newTab = document.createElement("li");
            newTab.setAttribute("data-tab-ref", "tab-settings-kurwachuj");
            newTab.innerText = "Kurwachuj.ork";

            newTab.style.color = "#" + ("000000" + Math.floor(Math.random() * 16777216).toString(16)).substr(-6);

            modalNav.appendChild(newTab);

            var newTabContent = document.createElement("div");
            newTabContent.setAttribute("id", "tab-settings-kurwachuj");
            newTabContent.setAttribute("class", "tab-content");
            newTabContent.innerHTML = "<h2>Ustawienia użytkownika</h2>";

            modalCont.insertBefore(newTabContent, document.getElementsByClassName("btn-wrap")[0]);

            newTabContent.innerHTML += "\n            <input type=\"checkbox\" class=\"kurwa-settings\" id=\"ko-postscounter\" checked=\"false\">\n                <label for=\"ko-postscounter\">Licznik post\xF3w</label>\n            <input type=\"checkbox\" class=\"kurwa-settings\" id=\"ko-hidersounds\" checked=\"false\">\n                <label for=\"ko-hidersounds\">Efekty d\u017Awi\u0119kowe kraw\u0119\u017Cnika</label>\n            <input type=\"checkbox\" class=\"kurwa-settings\" id=\"ko-cataloghider\" checked=\"false\">\n                <label for=\"ko-cataloghider\">Kraw\u0119\u017Cnik w katalogu</label>\n            <input type=\"checkbox\" class=\"kurwa-settings\" id=\"ko-catalogcss\" checked=\"false\">\n                <label for=\"ko-catalogcss\">Wyr\xF3wnaj fredy w katalogu</label>\n            <input type=\"checkbox\" class=\"kurwa-settings\" id=\"ko-catalogpreview\" checked=\"false\">\n                <label for=\"ko-catalogpreview\">Podgl\u0105d obrazk\xF3w w katalogu</label>\n            <input type=\"checkbox\" class=\"kurwa-settings\" id=\"ko-cataloglastfifty\" checked=\"false\">\n                <label for=\"ko-cataloglastfifty\">Ostatnie 50 w katalogu</label>\n            <input type=\"checkbox\" class=\"kurwa-settings\" id=\"ko-idhider\" checked=\"false\">\n                <label for=\"ko-idhider\">Kraw\u0119\u017Cnik anon\xF3w po ID</label>\n            <input type=\"checkbox\" class=\"kurwa-settings\" id=\"ko-polish\" checked=\"false\">\n                <label for=\"ko-polish\">Spolszczenie czana</label>";

            var that = this;

            var checkboxes = document.getElementsByClassName("kurwa-settings");
            for (var i = 0; i < Object.keys(this.userSettings).length; i++) {
                checkboxes[i].checked = Object.values(this.userSettings)[i];
            }

            var _loop = function _loop(_i) {
                checkboxes[_i].addEventListener("change", function () {
                    if (checkboxes[_i].checked == true) {
                        that.userSettings[Object.keys(that.userSettings)[_i]] = true;
                    } else if (checkboxes[_i].checked == false) {
                        that.userSettings[Object.keys(that.userSettings)[_i]] = false;
                    }

                    that.saveSettings();
                }, false);
            };

            for (var _i = 0; _i < checkboxes.length; _i++) {
                _loop(_i);
            }

            newTab.addEventListener("click", function () {

                if (newTab.classList.contains("tab-opened") == false) {

                    for (var _i2 = 0; _i2 < modalNav.childElementCount; _i2++) {
                        if (modalNav.children[_i2].classList.contains("tab-opened")) {
                            modalNav.children[_i2].setAttribute("class", "");
                        }
                    }
                    for (var _i3 = 0; _i3 < tabCont.length; _i3++) {
                        if (tabCont[_i3].classList.contains("opened")) {
                            tabCont[_i3].classList.remove("opened");
                        }
                    }

                    newTab.setAttribute("class", "tab-opened");
                    newTabContent.classList.add("opened");
                }
            }, false);
        }
    }, {
        key: "getSettingState",
        value: function getSettingState(setting) {
            return this.userSettings[setting];
        }
    }]);

    return Settings;
}();

exports.default = Settings;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PostsCounter = function () {
    function PostsCounter() {
        _classCallCheck(this, PostsCounter);

        this.loadData();

        this.installDate = localStorage.getItem("kurwa_postscounter_installdate");
        if (this.installDate == null) {
            this.installDate = Date.now();
            localStorage.setItem("kurwa_postscounter_installdate", this.installDate);
        }

        if (this.postsNumber == null || isNaN(this.postsNumber)) {
            this.postsNumber = 0;
            this.saveData();
        }
    }

    _createClass(PostsCounter, [{
        key: "loadData",
        value: function loadData() {
            this.postsNumber = parseInt(localStorage.getItem("kurwa_postscounter_number"));
        }
    }, {
        key: "saveData",
        value: function saveData() {
            localStorage.setItem("kurwa_postscounter_number", this.postsNumber);
        }
    }, {
        key: "render",
        value: function render() {

            var averagePosts = this.postsNumber / ((Date.now() - this.installDate) / 3600000 / 24);
            var rank = this.getRank();

            var registerDate = new Date(parseInt(this.installDate));
            registerDate = ("0" + registerDate.getDate()).slice(-2) + "/" + ("0" + (registerDate.getMonth() + 1)).slice(-2) + "/" + registerDate.getFullYear() + ", " + ("0" + registerDate.getHours()).slice(-2) + ":" + ("0" + registerDate.getMinutes()).slice(-2);

            var counter = document.createElement("li");
            counter.setAttribute("id", "posts-counter");
            counter.setAttribute("title", "Data rejestracji: " + registerDate);

            if (/catalog/.test(window.location.href) || /\*/.test(window.location.href)) {
                document.getElementsByClassName("rules")[0].appendChild(counter);
            } else {
                document.getElementsByClassName("rules")[1].appendChild(counter);
            }
            document.getElementById("posts-counter").innerHTML = "Posty: <a>" + this.postsNumber + "</a> (<b>" + rank + "</b>) | Śr. postów dziennie: <a>" + averagePosts.toFixed(2) + "</a>";

            document.getElementById("posts-counter").style.fontSize = "90%";

            var buttons = document.getElementsByClassName("ladda-button");
            this.update = this.update.bind(this);
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener("click", this.update, false);
            }
        }
    }, {
        key: "update",
        value: function update() {
            var averagePosts = 0;
            var rank = 0;

            var buttons = document.getElementsByClassName("ladda-button");
            var that = this;

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].removeEventListener("click", this.update, false);
            }

            var fillFields_o = fillFields;
            fillFields = function fillFields(arg) {
                if (arg != "body") {
                    that.increment();

                    averagePosts = that.postsNumber / ((Date.now() - that.installDate) / 3600000 / 24);
                    rank = that.getRank();

                    document.getElementById("posts-counter").innerHTML = "Posty: <a>" + that.postsNumber + "</a> (<b>" + rank + "</b>) | Śr. postów dziennie: <a>" + averagePosts.toFixed(2) + "</a>";
                }
                return fillFields_o(arg);
            };
        }
    }, {
        key: "increment",
        value: function increment() {

            this.loadData();

            this.postsNumber += 1;
            this.saveData();
        }
    }, {
        key: "getRank",
        value: function getRank() {
            var n = this.postsNumber;

            if (n >= 0 && n < 100) return "Ekstremalna nowociota";
            if (n >= 100 && n < 500) return "Nowociota";
            if (n >= 500 && n < 1000) return "Jeszcze w folii";
            if (n >= 1000 && n < 2137) return "Anonek";
            if (n >= 2137 && n < 5000) return "Syn tej ziemi";
            if (n >= 5000 && n < 9000) return "Średniociota";
            if (n >= 9000 && n < 15000) return "Anon";
            if (n >= 15000 && n < 20000) return "Antoni";
            if (n >= 20000 && n < 30000) return "SKURWYSYN";
            if (n >= 30000) return "Starociota";
        }
    }]);

    return PostsCounter;
}();

exports.default = PostsCounter;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HiderSounds = function () {
    function HiderSounds() {
        _classCallCheck(this, HiderSounds);

        this.hideSounds = ["https://instaud.io/1fm1/download", "https://instaud.io/1fmN/download", "https://instaud.io/1fmP/download", "https://instaud.io/1fmQ/download", "https://instaud.io/1fmR/download", "https://instaud.io/1fmU/download", "https://instaud.io/1fmV/download", "https://instaud.io/1fmW/download", "https://instaud.io/1fmY/download", "https://instaud.io/1fmZ/download", "https://instaud.io/1fn2/download", "https://instaud.io/1fnb/download", "https://instaud.io/1fnd/download", "https://instaud.io/1fne/download", "https://instaud.io/1fn7/download", "https://instaud.io/1fnh/download", "https://instaud.io/1fnk/download", "https://instaud.io/1fnl/download", "https://instaud.io/1fnm/download", "https://instaud.io/1fnn/download", "https://instaud.io/1fns/download", "https://instaud.io/1fnt/download", "https://instaud.io/1fnu/download", "https://instaud.io/1fnx/download", "https://instaud.io/1fny/download"];
        this.showSounds = ["https://instaud.io/1fmY/download", "https://instaud.io/1fmZ/download", "https://instaud.io/1fn0/download", "https://instaud.io/1fn1/download", "https://instaud.io/1fn2/download", "https://instaud.io/1fne/download", "https://instaud.io/1fn7/download", "https://instaud.io/1fnx/download"];

        if (!("contains" in String.prototype)) {
            String.prototype.contains = function (str, startIndex) {
                return -1 !== String.prototype.indexOf.call(this, str, startIndex);
            };
        }

        this.hideAudio = [];
        this.showAudio = [];

        for (var i = 0; i < this.hideSounds.length; i++) {
            this.hideAudio[i] = new Audio(this.hideSounds[i]);
            this.hideAudio[i].volume = 0.4;
        }
        for (var _i = 0; _i < this.showSounds.length; _i++) {
            this.showAudio[_i] = new Audio(this.showSounds[_i]);
            this.showAudio[_i].volume = 0.4;
        }
    }

    _createClass(HiderSounds, [{
        key: "append",
        value: function append() {
            var buttons = 0;
            var that = this;

            if (/catalog/.test(window.location.href)) {
                buttons = document.getElementsByClassName("hide-buttons");
            } else {
                buttons = document.getElementsByClassName("hider");
            }

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener("click", function () {
                    that.playSound(this);
                }, false);
            }
        }
    }, {
        key: "playSound",
        value: function playSound(ctx) {
            if (ctx.innerText.contains("[+]")) {
                this.hideAudio[Math.floor(Math.random() * this.hideAudio.length)].play();
            } else if (ctx.innerText.contains("[–]")) {
                this.showAudio[Math.floor(Math.random() * this.showAudio.length)].play();
            }
        }
    }]);

    return HiderSounds;
}();

exports.default = HiderSounds;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CatalogHider = function () {
    function CatalogHider() {
        _classCallCheck(this, CatalogHider);

        this.board = window.location.href.split("/")[3];

        this.hiddenThreads = [];
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).substring(0, 2) == "h_" + this.board) {
                this.hiddenThreads.push(localStorage.key(i));
            }
        }
    }

    _createClass(CatalogHider, [{
        key: "render",
        value: function render() {

            if (/catalog/.test(window.location.href) == false) return;

            var threads = document.getElementsByClassName("thread");

            for (var i = 0; i < threads.length; i++) {
                threads[i].innerHTML += "<a href=\"javascript:;\" class=\"hide-buttons\" id=\"hide-btn-" + threads[i].id.replace(/[^0-9]/g, "") + "\">[–]</a>";
            }

            var buttons = document.getElementsByClassName("hide-buttons");
            var that = this;
            for (var _i = 0; _i < buttons.length; _i++) {
                buttons[_i].addEventListener("click", function () {
                    that.toggleThread(this);
                }, false);
            }

            for (var _i2 = 0; _i2 < threads.length; _i2++) {
                var thread = threads[_i2];
                if (localStorage.getItem("h_" + that.board + "_" + thread.id.replace(/[^0-9]/g, ""))) {
                    thread.style.height = "32px";
                    thread.getElementsByClassName("thumb")[0].style.display = "none";
                    thread.getElementsByClassName("teaser")[0].style.display = "none";
                    thread.getElementsByClassName("hide-buttons")[0].innerText = "[+]";
                    var parentNode = thread.parentNode;
                    var nextSibiling = document.getElementsByClassName("thread").nextSibiling;
                    thread = parentNode.insertBefore(thread, nextSibiling);
                }
            }
        }
    }, {
        key: "toggleThread",
        value: function toggleThread(ctx) {
            var thread = document.getElementById("thread-" + ctx.id.replace(/[^0-9]/g, ""));
            var thumb = thread.getElementsByClassName("thumb")[0];
            var teaser = thread.getElementsByClassName("teaser")[0];
            var id = "h_" + window.location.href.split("/")[3] + "_" + ctx.id.replace(/[^0-9]/g, "");

            if (ctx.innerText.contains("[–]")) {

                thread.style.height = "32px";
                thumb.style.display = "none";
                teaser.style.display = "none";
                ctx.innerText = "[+]";

                var parentNode = thread.parentNode;
                var nextSibiling = document.getElementsByClassName("thread").nextSibiling;
                thread = parentNode.insertBefore(thread, nextSibiling);

                localStorage.setItem(id, teaser.innerText.replace(/https*:\/\/\S+/g, "[url]").replace(/>>\S+/, "").replace(/\s+/g, " ").slice(0, 60));
            } else if (ctx.innerText.contains("[+]")) {

                thread.style.height = "320px";
                thumb.style.display = "block";
                teaser.style.display = "";
                ctx.innerText = "[–]";

                localStorage.removeItem(id);
            }
        }
    }]);

    return CatalogHider;
}();

exports.default = CatalogHider;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CatalogCSS = function () {
    function CatalogCSS() {
        _classCallCheck(this, CatalogCSS);
    }

    _createClass(CatalogCSS, [{
        key: "apply",
        value: function apply() {
            if (/catalog/.test(window.location.href) == false) return;
            var threads = document.getElementsByClassName("thread");

            for (var i = 0; i < threads.length; i++) {
                threads[i].style.width = "160px";
                if (threads[i].getElementsByClassName("hide-buttons")[0].innerText == "[–]") {
                    threads[i].style.height = "320px";
                }
                threads[i].style.marginLeft = "3px";
                threads[i].style.marginRight = "3px";
                threads[i].style.padding = "3px";
            }
        }
    }]);

    return CatalogCSS;
}();

exports.default = CatalogCSS;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CatalogPreview = function () {
    function CatalogPreview() {
        _classCallCheck(this, CatalogPreview);
    }

    _createClass(CatalogPreview, [{
        key: "render",
        value: function render() {
            if (/catalog/.test(window.location.href) == false) return;

            document.styleSheets[25].insertRule(".img-preview { display: none; position: absolute; }", 0);

            var thumbs = document.getElementsByClassName("thumb");
            var that = this;
            for (var i = 0; i < thumbs.length; i++) {
                thumbs[i].addEventListener("mousemove", function (e) {
                    that.preview(this, e);
                }, false);
            }
        }
    }, {
        key: "preview",
        value: function preview(ctx, e) {
            var src = ctx.src;

            var previewNode = document.createElement("div");
            var img = document.createElement("img");
            previewNode.setAttribute("class", "img-preview");
            img.setAttribute("src", "./src/" + src.replace(/[^0-9]/g, "") + "." + src.substring(src.lastIndexOf(".") + 1));
            previewNode.appendChild(img);

            var clientWindow = {
                "x": document.documentElement.getBoundingClientRect().left,
                "y": document.documentElement.getBoundingClientRect().top * -1,
                "w": document.documentElement.getBoundingClientRect().width,
                "h": window.innerHeight
            };

            var cursor = {
                "x": e.pageX,
                "y": e.pageY - clientWindow.y
            };

            var spaceLeft = {
                "w": Math.max(clientWindow.w - cursor.x, cursor.x),
                "h": clientWindow.h
            };

            document.getElementsByTagName("body")[0].appendChild(previewNode);

            var preview = document.getElementsByClassName("img-preview")[0];
            var previewImg = preview.children[0];

            var imgSize = {
                "w": previewImg.width,
                "h": previewImg.height,
                "scale": Math.min(1, spaceLeft.w / previewImg.width, spaceLeft.h / previewImg.height)
            };

            if (imgSize.w != 0 && imgSize.h != 0) {
                previewImg.maxWidth = imgSize.scale * imgSize.w;
                previewImg.maxHeight = imgSize.scale * imgSize.h;
                previewImg.height = imgSize.scale * imgSize.h;
                preview.style.left = cursor.x > clientWindow.w / 2 ? cursor.x - imgSize.w - 32 + "px" : cursor.x + 32 + "px";
                preview.style.top = clientWindow.y + (clientWindow.h - imgSize.h) / 2 + "px";
            }
            preview.style.display = "block";
            preview.style.position = "absolute";
            preview.style.zIndex = 2137;

            var previews = document.getElementsByClassName("img-preview");
            ctx.addEventListener("mouseleave", function () {
                for (var i = 0; i < previews.length; i++) {
                    previews[i].parentNode.removeChild(previews[i]);
                }
            }, false);
        }
    }]);

    return CatalogPreview;
}();

exports.default = CatalogPreview;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CatalogLastFifty = function () {
    function CatalogLastFifty() {
        _classCallCheck(this, CatalogLastFifty);
    }

    _createClass(CatalogLastFifty, [{
        key: "render",
        value: function render() {
            if (/catalog/.test(window.location.href) == false) return;

            var buttons = [];
            var threads = document.getElementsByClassName("thread");
            for (var i = 0; i < threads.length; i++) {

                if (threads[i].dataset.replycount >= 50) {

                    buttons[i] = document.createElement("a");
                    buttons[i].setAttribute("class", "last-fifty-buttons");
                    buttons[i].setAttribute("href", "./res/" + threads[i].id.replace(/[^0-9]/g, "") + "-50.html");
                    buttons[i].innerText = "50";
                } else {
                    buttons[i] = null;
                }
            }

            var hider = threads[0].children[3].classList == "hide-buttons";

            for (var _i = 0; _i < threads.length; _i++) {
                if (buttons[_i] != null) {
                    if (hider == true) {
                        var separator = document.createElement("b");
                        separator.innerText = " | ";
                        threads[_i].appendChild(separator);
                    }
                    threads[_i].appendChild(buttons[_i]);
                }
            }
        }
    }]);

    return CatalogLastFifty;
}();

exports.default = CatalogLastFifty;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IdHider = function () {
    function IdHider() {
        _classCallCheck(this, IdHider);

        this.loadIds();

        if (this.hiddenIds == null || this.hiddenIds == undefined) {
            this.hiddenIds = {};
            this.saveIds();
        }
    }

    _createClass(IdHider, [{
        key: "loadIds",
        value: function loadIds() {
            this.hiddenIds = JSON.parse(localStorage.getItem("kurwa_idhider"));
        }
    }, {
        key: "saveIds",
        value: function saveIds() {
            localStorage.setItem("kurwa_idhider", JSON.stringify(this.hiddenIds));
        }
    }, {
        key: "render",
        value: function render() {
            if (/res/.test(window.location.href) == false) return;

            var posts = document.getElementsByClassName("post reply");
            for (var i = 0; i < posts.length; i++) {

                if (window.location.href.indexOf("-50.html") > -1 && i == 0) {
                    continue;
                }
                var button = document.createElement("a");
                button.setAttribute("class", "hideid-buttons");
                var id = posts[i].getElementsByClassName("posteruid")[0].title;
                button.classList.add("hideid-" + id);
                button.innerText = "[Ukryj]";
                posts[i].getElementsByClassName("nameBlock")[0].appendChild(button);
            }

            var buttons = document.getElementsByClassName("hideid-buttons");
            var that = this;
            for (var _i = 0; _i < buttons.length; _i++) {
                buttons[_i].addEventListener("click", function () {
                    that.togglePosts(this);
                }, false);
            }

            var target = document.getElementsByClassName("thread")[0];
            var config = {
                attributes: true,
                childList: true,
                characterData: true
            };
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    var post = mutation.addedNodes[0].getElementsByClassName("post reply")[0];

                    var button = document.createElement("a");
                    button.setAttribute("class", "hideid-buttons");
                    var id = post.getElementsByClassName("posteruid")[0].title;
                    button.classList.add("hideid-" + id);
                    button.innerText = "[Ukryj]";
                    post.getElementsByClassName("nameBlock")[0].appendChild(button);

                    button.addEventListener("click", function () {
                        that.togglePosts(button);
                    }, false);

                    var thread = document.getElementsByClassName("thread")[0].id.replace(/[^0-9]/g, "");
                    if (that.hiddenIds[thread.toString()] == undefined) return;
                    if (that.hiddenIds[thread.toString()].indexOf(id) >= 0) {
                        that.togglePosts(button);
                    }
                });
            });
            observer.observe(target, config);

            var thread = document.getElementsByClassName("thread")[0].id.replace(/[^0-9]/g, "");
            if (that.hiddenIds[thread.toString()] == undefined) return;

            for (var _i2 = 0; _i2 < posts.length; _i2++) {
                var _id = posts[_i2].getElementsByClassName("posteruid")[0].title;
                if (that.hiddenIds[thread.toString()].indexOf(_id) >= 0) {

                    var _button = posts[_i2].getElementsByClassName("hideid-buttons")[0];
                    if (_button.innerText == "[Ukryj]") {
                        that.togglePosts(_button);
                    } else {
                        continue;
                    }
                }
            }
        }
    }, {
        key: "togglePosts",
        value: function togglePosts(ctx) {
            var thread = document.getElementsByClassName("thread")[0].id.replace(/[^0-9]/g, "");
            var posts = document.getElementsByClassName(ctx.className);
            var id = ctx.classList[1].slice(7, 16);

            if (this.hiddenIds[thread] == null || this.hiddenIds[thread] == undefined) {
                this.hiddenIds[thread] = [];
                this.saveIds();
            }

            if (ctx.innerText == "[Ukryj]") {

                for (var i = 0; i < posts.length; i++) {
                    posts[i].innerText = "[Pokaż]";
                    var post = posts[i].parentNode.parentNode.parentNode;
                    post.getElementsByClassName("postMessage")[0].style.display = "none";

                    if (post.getElementsByClassName("file")[0]) {
                        post.getElementsByClassName("file")[0].style.display = "none";
                    }
                }

                if (this.hiddenIds[thread].indexOf(id) < 0) {
                    this.hiddenIds[thread].push(id);
                }
                this.saveIds();
            } else if (ctx.innerText == "[Pokaż]") {

                for (var _i3 = 0; _i3 < posts.length; _i3++) {
                    posts[_i3].innerText = "[Ukryj]";
                    var _post = posts[_i3].parentNode.parentNode.parentNode;
                    _post.getElementsByClassName("postMessage")[0].style.display = "block";
                    if (_post.getElementsByClassName("file")[0]) {
                        _post.getElementsByClassName("file")[0].style.display = "block";
                    }
                }
                this.hiddenIds[thread].splice(this.hiddenIds[thread].indexOf(id), 1);

                for (var _i4 = 0; _i4 < Object.keys(this.hiddenIds).length; _i4++) {
                    if (this.hiddenIds[Object.keys(this.hiddenIds)[_i4]].length == 0) {
                        delete this.hiddenIds[parseInt(Object.keys(this.hiddenIds)[_i4])];
                    }
                }
                this.saveIds();
            }
        }
    }]);

    return IdHider;
}();

exports.default = IdHider;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Polish = function () {
    function Polish() {
        _classCallCheck(this, Polish);
    }

    _createClass(Polish, [{
        key: "translate",
        value: function translate() {

            if (/catalog/.test(window.location.href) == true) {
                var threads = document.getElementsByClassName("thread");
                for (var i = 0; i < threads.length; i++) {

                    if (threads[i].children[0].children[0].innerText == "No file") {
                        threads[i].children[0].children[0].innerText = "Brak pliku";
                    }

                    threads[i].children[1].innerText = threads[i].children[1].innerText.replace(/R/g, "O");
                    threads[i].children[1].title = "(O)dpowiedzi";
                }
            }
        }
    }]);

    return Polish;
}();

exports.default = Polish;

/***/ })
/******/ ]);