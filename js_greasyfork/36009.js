// ==UserScript==
// @name         Twitch Tab Completion (compatible with BTTV)
// @namespace    https://openuserjs.org/users/daybreakz
// @version      1.0.9
// @description  Tab completion for emotes (and users) also add chat history. BetterTTV
// @author       Daybr3akz
// @license      MIT
// @copyright 2017, daybreakz (https://openuserjs.org/users/daybreakz)
// @match        https://www.twitch.tv/*
// @require      http://code.jquery.com/jquery-3.2.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36009/Twitch%20Tab%20Completion%20%28compatible%20with%20BTTV%29.user.js
// @updateURL https://update.greasyfork.org/scripts/36009/Twitch%20Tab%20Completion%20%28compatible%20with%20BTTV%29.meta.js
// ==/UserScript==

// // ==OpenUserJS==
// @author daybreakz
// ==/OpenUserJS==




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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getConnectRoot = getConnectRoot;
exports.getChatController = getChatController;
exports.getChatInputController = getChatInputController;
exports.getCurrentChat = getCurrentChat;
exports.setCurrentUser = setCurrentUser;
exports.getCurrentUser = getCurrentUser;
exports.getCurrentChannel = getCurrentChannel;
exports.updateCurrentChannel = updateCurrentChannel;
var REACT_ROOT = '#root div[data-reactroot]';
var CHAT_CONTAINER = '.chat-room__container';
var CHAT_INPUT = '.chat-input';
// const $ = s => document.querySelectorAll(s);
var $ = window.$;

function getReactInstance(element) {
    for (var key in element) {
        if (key.startsWith('__reactInternalInstance$')) {
            return element[key];
        }
    }
    return null;
}

function getReactElement(element) {
    var instance = getReactInstance(element);
    if (!instance) return null;
    return instance._currentElement;
}

function getParentNode(reactElement) {
    try {
        return reactElement._owner._currentElement._owner;
    } catch (_) {
        return null;
    }
}

function searchReactChildren(node, predicate) {
    var maxDepth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 15;
    var depth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    try {
        if (predicate(node)) {
            return node;
        }
    } catch (_) {}

    if (!node || depth > maxDepth) {
        return null;
    }

    var children = node._renderedChildren,
        component = node._renderedComponent;


    if (children) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.keys(children)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                var childResult = searchReactChildren(children[key], predicate, maxDepth, depth + 1);
                if (childResult) {
                    return childResult;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    if (component) {
        return searchReactChildren(component, predicate, maxDepth, depth + 1);
    }

    return null;
}

function getConnectRoot() {
    var root = void 0;
    try {
        root = getParentNode(getReactElement($(REACT_ROOT)[0]));
    } catch (_) {}
    return root;
}

function getChatController() {
    var container = $(CHAT_CONTAINER).parent()[0];
    if (!container) return null;

    var controller = searchReactChildren(getReactInstance(container), function (node) {
        return node._instance && node._instance.chatBuffer;
    });

    if (controller) {
        controller = controller._instance;
    }

    return controller;
}

function getChatInputController() {
    var container = $(CHAT_INPUT)[0];
    if (!container) return null;

    var controller = void 0;
    try {
        controller = getParentNode(getReactElement(container))._instance;
    } catch (_) {}

    return controller;
}

function getCurrentChat() {
    var container = $(CHAT_CONTAINER)[0];
    if (!container) return null;
    var controller = void 0;
    try {
        controller = getParentNode(getReactElement(container))._instance;
    } catch (_) {}
    return controller;
}

var currentUser = null;
function setCurrentUser(accessToken, id, name, displayName) {
    // twitchAPI.setAccessToken(accessToken);
    currentUser = {
        id: id.toString(),
        name: name,
        displayName: displayName
    };
}

function getCurrentUser() {
    return currentUser;
}

var currentChannel = void 0;
function getCurrentChannel() {
    return currentChannel;
}

function updateCurrentChannel() {
    var rv = void 0;
    var currentChat = getCurrentChat();
    if (currentChat && currentChat.props && currentChat.props.channelID) {
        var _currentChat$props = currentChat.props,
            channelID = _currentChat$props.channelID,
            channelLogin = _currentChat$props.channelLogin,
            channelDisplayName = _currentChat$props.channelDisplayName;

        rv = {
            id: channelID.toString(),
            name: channelLogin,
            displayName: channelDisplayName
        };
    }
    currentChannel = rv;
    return rv;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
window.customLog = localStorage.getItem('customLog') === 'true';

var console = window.console;
try {
    console = $('iframe')[0].contentWindow.console;
} catch (e) {}

function log(type) {
    if (!console || !window.customLog) return;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    console[type].apply(console, ['SCRIPT:'].concat(args));
}

var debug = {
    log: log.bind(undefined, 'log'),
    error: log.bind(undefined, 'error'),
    warn: log.bind(undefined, 'warn'),
    info: log.bind(undefined, 'info')
};

exports.default = debug;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debug = __webpack_require__(1);

var _debug2 = _interopRequireDefault(_debug);

var _twitch = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API_ENDPOINT = 'https://api.betterttv.net/2/';
var fetchJson = function fetchJson(path) {
    return fetch('' + API_ENDPOINT + path).then(function (r) {
        return r.json();
    });
};

var channel = {};

var EmotesProvider = function () {
    function EmotesProvider() {
        _classCallCheck(this, EmotesProvider);

        this.channelEmotes = new Set();
        this.globalEmotes = new Set();
        this.emojis = new Set();
        this.loadBTTVGlobalEmotes();
        // this.loadEmojis();
    }

    _createClass(EmotesProvider, [{
        key: 'updateChannel',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var currentChannel;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                currentChannel = (0, _twitch.getCurrentChannel)();

                                if (currentChannel) {
                                    _context.next = 3;
                                    break;
                                }

                                return _context.abrupt('return');

                            case 3:
                                if (!(currentChannel.id === channel.id)) {
                                    _context.next = 5;
                                    break;
                                }

                                return _context.abrupt('return');

                            case 5:
                                channel = currentChannel;
                                _context.next = 8;
                                return fetchJson('channels/' + channel.name);

                            case 8:
                                return _context.abrupt('return', _context.sent);

                            case 9:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function updateChannel() {
                return _ref.apply(this, arguments);
            }

            return updateChannel;
        }()
    }, {
        key: 'load',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var channelData;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.updateChannel();

                            case 2:
                                channelData = _context2.sent;

                                if (channelData && channelData.emotes) {
                                    this.loadBTTVChannelEmotes(channelData.emotes);
                                }

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function load() {
                return _ref2.apply(this, arguments);
            }

            return load;
        }()
    }, {
        key: 'loadBTTVGlobalEmotes',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var _this = this;

                var x, emotesJson;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return fetchJson('emotes');

                            case 2:
                                x = _context3.sent;
                                emotesJson = x.emotes;

                                emotesJson.forEach(function (em) {
                                    if (!em || !em.code) return;
                                    _this.globalEmotes.add(em.code);
                                });
                                _debug2.default.log('Got globalEmotes');

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function loadBTTVGlobalEmotes() {
                return _ref3.apply(this, arguments);
            }

            return loadBTTVGlobalEmotes;
        }()
    }, {
        key: 'loadBTTVChannelEmotes',
        value: function loadBTTVChannelEmotes(emotesJson) {
            var _this2 = this;

            this.channelEmotes.clear();
            emotesJson.forEach(function (em) {
                if (!em || !em.code) return;
                _this2.channelEmotes.add(em.code);
            });
            _debug2.default.log('Got channel emotes');
        }
    }, {
        key: 'getEmotes',
        value: function getEmotes() {
            if (!window.BetterTTV) {
                return [];
            }
            var user = (0, _twitch.getCurrentUser)();user;

            var emotes = [].concat(_toConsumableArray(this.globalEmotes))
            // .concat([...this.emojis])
            .concat([].concat(_toConsumableArray(this.channelEmotes)));
            return emotes;
        }
    }]);

    return EmotesProvider;
}();

// let provider = new NopeProvider();
// if (window.BetterTTV) {


var provider = new EmotesProvider();
exports.default = provider;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _routeKeysToPaths;

var waitForChat = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var abort, currentIsWaiting;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        abort = false;

                        wait(15000).then(function () {
                            return abort = true;
                        });
                        isWaiting = Symbol('waitingForChat');
                        currentIsWaiting = isWaiting;

                    case 4:
                        if (abort) {
                            _context.next = 14;
                            break;
                        }

                        if (!checkChat()) {
                            _context.next = 7;
                            break;
                        }

                        return _context.abrupt('return', true);

                    case 7:
                        if (!(isWaiting !== currentIsWaiting)) {
                            _context.next = 10;
                            break;
                        }

                        _debug2.default.log('waitForChat was cancelled');
                        return _context.abrupt('return', false);

                    case 10:
                        _context.next = 12;
                        return wait(25);

                    case 12:
                        _context.next = 4;
                        break;

                    case 14:
                        return _context.abrupt('return', false);

                    case 15:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function waitForChat() {
        return _ref.apply(this, arguments);
    };
}();

var main = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var router;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return getRouter();

                    case 2:
                        router = _context2.sent;

                        router.history.listen(function (location) {
                            return onRouteChange(location);
                        });
                        onRouteChange(router.history.location);

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function main() {
        return _ref2.apply(this, arguments);
    };
}();

var _debug = __webpack_require__(1);

var _debug2 = _interopRequireDefault(_debug);

var _tab_completion = __webpack_require__(4);

var _tab_completion2 = _interopRequireDefault(_tab_completion);

var _emotes = __webpack_require__(2);

var _emotes2 = _interopRequireDefault(_emotes);

var _twitch = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var currentPath = void 0;

var routes = {
    DIRECTORY_FOLLOWING_LIVE: 'DIRECTORY_FOLLOWING_LIVE',
    DIRECTORY_FOLLOWING: 'DIRECTORY_FOLLOWING',
    DIRECTORY: 'DIRECTORY',
    CHAT: 'CHAT',
    CHANNEL: 'CHANNEL',
    VOD: 'VOD'
};

var routeKeysToPaths = (_routeKeysToPaths = {}, _defineProperty(_routeKeysToPaths, routes.DIRECTORY_FOLLOWING_LIVE, /^\/directory\/following\/live$/i), _defineProperty(_routeKeysToPaths, routes.DIRECTORY_FOLLOWING, /^\/directory\/following$/i), _defineProperty(_routeKeysToPaths, routes.DIRECTORY, /^\/directory/i), _defineProperty(_routeKeysToPaths, routes.CHAT, /^(\/popout)?\/[a-z0-9-_]+\/chat$/i), _defineProperty(_routeKeysToPaths, routes.VOD, /^\/videos\/[0-9]+$/i), _defineProperty(_routeKeysToPaths, routes.CHANNEL, /^\/[a-z0-9-_]+/i), _routeKeysToPaths);

function getRouteFromPath(path) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(routeKeysToPaths)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var name = _step.value;

            var regex = routeKeysToPaths[name];
            if (!regex.test(path)) continue;
            return name;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return null;
}

function getRouter() {
    return new Promise(function (resolve) {
        var loadInterval = setInterval(function () {
            var user = void 0,
                router = void 0;
            try {
                var connectRoot = (0, _twitch.getConnectRoot)();
                if (!connectRoot) return;
                var context = connectRoot._context;
                router = context.router;
                user = context.store.getState().session.user;
            } catch (_) {
                return;
            }

            if (!router || !user) return;
            clearInterval(loadInterval);

            (0, _twitch.setCurrentUser)(user.authToken, user.id, user.login, user.displayName);
            resolve(router);
        }, 25);
    });
}

function makeCheckChat() {
    var currentChatReference = null;
    return function () {
        if (!(0, _twitch.updateCurrentChannel)()) return false;
        var lastReference = currentChatReference;
        var currentChat = (0, _twitch.getCurrentChat)();

        if (currentChat && currentChat === lastReference) {
            return false;
        }
        if (lastReference && currentChat.props.channelID.toString() === lastReference.props.channelID.toString()) {
            return false;
        }

        currentChatReference = currentChat;

        return true;
    };
}
var checkChat = makeCheckChat();

var wait = function wait(t) {
    return new Promise(function (r) {
        return setTimeout(r, t);
    });
};
var isWaiting = false;


function triggerRouteChanged() {}

function triggerChatLoaded() {
    _debug2.default.log('CHAT WAS LOADED');
    _tab_completion2.default.load(true);
    _emotes2.default.load();
}

function onRouteChange(location) {
    var lastPath = currentPath;
    var path = location.pathname;
    var route = getRouteFromPath(path);
    _debug2.default.log('New route: ' + location.pathname + ' as ' + route);

    // emit load
    triggerRouteChanged();
    currentPath = path;
    if (currentPath === lastPath) return;
    if (route === routes.CHAT || route === routes.CHANNEL) {
        waitForChat().then(function (loaded) {
            return loaded && triggerChatLoaded();
        });
    }
}

main();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// const InputPatcherModule = require('./input-patcher-module');


var _customInputModule = __webpack_require__(5);

var _customInputModule2 = _interopRequireDefault(_customInputModule);

var _chatHistoryModule = __webpack_require__(6);

var _chatHistoryModule2 = _interopRequireDefault(_chatHistoryModule);

var _twitch = __webpack_require__(0);

var _debug = __webpack_require__(1);

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// window.getChatController = getChatController;

var CHAT_INPUT = '.chat-input';
var $ = window.$;

function patchSendMessage(callback) {
    var chatBuffer = (0, _twitch.getChatController)().chatBuffer;
    _debug2.default.log(chatBuffer);

    if (chatBuffer._consumeChatEventPatched === true) {
        return;
    }
    chatBuffer._consumeChatEventPatched = true;
    var twitchConsumeChatEvent = chatBuffer.consumeChatEvent;

    function myConsumeChatEvent(event) {
        if (event && event.type === 0) {
            try {
                callback(event);
            } catch (error) {
                _debug2.default.error(error);
            }
        }
        return twitchConsumeChatEvent.apply(this, arguments);
    }
    chatBuffer.consumeChatEvent = myConsumeChatEvent;
}

var ChatTabCompletionModule = function () {
    function ChatTabCompletionModule() {
        var _this = this;

        _classCallCheck(this, ChatTabCompletionModule);

        this.customInput = new _customInputModule2.default(this);
        this.chatHistory = new _chatHistoryModule2.default(this);
        this.currentInput = null;

        // watcher.on('load.chat', () => this.load());
        // settings.on('changed.tabAutocomplete', () => this.load(false));

        $('body').off('click.tabComplete focus.tabComplete keydown.tabComplete').on('click.tabComplete focus.tabComplete', CHAT_INPUT, function () {
            return _this.onFocus();
        }).on('keydown.tabComplete', CHAT_INPUT, function (e) {
            return _this.onKeydown(e);
        });
    }

    _createClass(ChatTabCompletionModule, [{
        key: 'load',
        value: function load() {
            var _this2 = this;

            var chatLoad = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.customInput.load(chatLoad);
            this.chatHistory.load(chatLoad);
            // if (settings.get('tabAutocomplete')) {
            this.customInput.enable();
            this.currentInput = this.customInput;
            // } else {
            //     this.customInput.disable();
            //     this.currentInput = this.patchedInput;
            // }
            patchSendMessage(function (event) {
                _this2.currentInput.storeUser(event.user);
            });
        }
    }, {
        key: 'onKeydown',
        value: function onKeydown(e) {
            if (this.currentInput) {
                this.currentInput.onKeydown(e);
            }
            this.chatHistory.onKeydown(e);
        }
    }, {
        key: 'onFocus',
        value: function onFocus() {
            if (this.currentInput) {
                this.currentInput.onFocus();
            }
            this.chatHistory.onFocus();
        }
    }, {
        key: 'onSendMessage',
        value: function onSendMessage(message) {
            this.chatHistory.onSendMessage(message);
        }
    }]);

    return ChatTabCompletionModule;
}();

var mod = new ChatTabCompletionModule();
exports.default = mod;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _emotes = __webpack_require__(2);

var _emotes2 = _interopRequireDefault(_emotes);

var _twitch = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = window.$;


var ORIGINAL_TEXTAREA = '.chat-input textarea';

function setReactTextareaValue(txt, msg) {
    txt.value = msg;
    var ev = new Event('input', { target: txt, bubbles: true });
    txt.dispatchEvent(ev);
}

function newTextArea() {
    var $oldText = $(ORIGINAL_TEXTAREA);
    var $text = $oldText.clone().insertBefore(ORIGINAL_TEXTAREA);
    $text.attr('id', 'bttv-chat-input');
    $oldText.attr('id', 'twitch-chat-input');
    $oldText.hide();
    $text.focus();

    $text[0].customSetValue = function (value) {
        $text.val(value);
    };

    $oldText[0].customSetValue = function (value) {
        setReactTextareaValue($oldText[0], value);
    };

    return { $text: $text, $oldText: $oldText };
}

var CustomInputModule = function () {
    function CustomInputModule(parentModule) {
        _classCallCheck(this, CustomInputModule);

        this.parentModule = parentModule;
        this.init();
        // watcher.on('input.onSendMessage', () => this.sendMessage());
        // watcher.on('chat.message', ($el, msg) => this.storeUser($el, msg));
    }

    _createClass(CustomInputModule, [{
        key: 'init',
        value: function init() {
            this.userList = new Set();
            this.tabTries = -1;
            this.suggestions = null;
            this.textSplit = ['', '', ''];
        }
    }, {
        key: 'storeUser',
        value: function storeUser(user) {
            this.userList.add(user.userDisplayName || user.userLogin);
        }
    }, {
        key: 'sendMessage',
        value: function sendMessage() {
            var message = this.$text.val();
            if (message.trim().length === 0) {
                return;
            }
            this.chatInputCtrl.props.onSendMessage(message);
            this.parentModule.onSendMessage(message);
            this.$text.val('');
        }
    }, {
        key: 'load',
        value: function load() {
            var createTextarea = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

            this.chatInputCtrl = (0, _twitch.getChatInputController)();
            if (createTextarea) {
                var _newTextArea = newTextArea(),
                    $text = _newTextArea.$text,
                    $oldText = _newTextArea.$oldText;

                this.$text = $text;
                this.$oldText = $oldText;
                this.userList = new Set();
            }
        }
    }, {
        key: 'enable',
        value: function enable() {
            this.$text.show();
            this.$oldText.hide();
        }
    }, {
        key: 'disable',
        value: function disable() {
            this.$text.hide();
            this.$oldText.show();
        }
    }, {
        key: 'getSuggestions',
        value: function getSuggestions(prefix) {
            var includeUsers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var includeEmotes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var userList = [];
            var emoteList = [];

            if (includeEmotes) {
                var _emoteList;

                emoteList = _emotes2.default.getEmotes(); // .map(emote => emote.code);
                (_emoteList = emoteList).push.apply(_emoteList, _toConsumableArray(this.getTwitchEmotes()));
                emoteList = emoteList.filter(function (word) {
                    return word.toLowerCase().indexOf(prefix.toLowerCase()) === 0;
                });
                emoteList = Array.from(new Set(emoteList).values());
                emoteList.sort();
            }

            if (includeUsers) {
                userList = this.getChatMembers().filter(function (word) {
                    return word.toLowerCase().indexOf(prefix.toLowerCase()) === 0;
                });
                userList.sort();
            }

            return [].concat(_toConsumableArray(emoteList), _toConsumableArray(userList));
        }
    }, {
        key: 'onKeydown',
        value: function onKeydown(e, includeUsers) {
            var keyCode = e.key;
            if (e.ctrlKey) {
                return;
            }
            var $inputField = this.$text;

            if (keyCode === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            } else if (keyCode === 'Tab') {
                e.preventDefault();
                this.onAutoComplete(includeUsers, e.shiftKey);
            } else if (keyCode === 'Escape' && this.tabTries >= 0) {
                $inputField.val(this.textSplit.join(''));
            } else if (keyCode !== 'Shift') {
                this.tabTries = -1;
            }
        }
    }, {
        key: 'onFocus',
        value: function onFocus() {
            this.tabTries = -1;
        }
    }, {
        key: 'onAutoComplete',
        value: function onAutoComplete(includeUsers, shiftKey) {
            var $inputField = this.$text;

            // First time pressing tab, split before and after the word
            if (this.tabTries === -1) {
                var caretPos = $inputField[0].selectionStart;
                var text = $inputField.val();

                var start = (/[\:\(\)\w]+$/.exec(text.substr(0, caretPos)) || { index: caretPos }).index;
                var end = caretPos + (/^\w+/.exec(text.substr(caretPos)) || [''])[0].length;
                this.textSplit = [text.substring(0, start), text.substring(start, end), text.substring(end + 1)];

                // If there are no words in front of the caret, exit
                if (this.textSplit[1] === '') return;

                // Get all matching completions
                var includeEmotes = this.textSplit[0].slice(-1) !== '@';
                this.suggestions = this.getSuggestions(this.textSplit[1], includeUsers, includeEmotes);
            }

            if (this.suggestions.length > 0) {
                this.tabTries += shiftKey ? -1 : 1; // shift key iterates backwards
                if (this.tabTries >= this.suggestions.length) this.tabTries = 0;
                if (this.tabTries < 0) this.tabTries = this.suggestions.length - 1;
                if (!this.suggestions[this.tabTries]) return;

                var cursorOffset = 0;
                if (this.textSplit[2].trim() === '') {
                    this.textSplit[2] = ' ';
                    cursorOffset = 1;
                }

                var cursorPos = this.textSplit[0].length + this.suggestions[this.tabTries].length + cursorOffset;
                $inputField.val(this.textSplit[0] + this.suggestions[this.tabTries] + this.textSplit[2]);
                $inputField[0].setSelectionRange(cursorPos, cursorPos);
            }
        }
    }, {
        key: 'getTwitchEmotes',
        value: function getTwitchEmotes() {
            var twEmotes = this.chatInputCtrl.props.emotes;
            if (!twEmotes) {
                return [];
            }
            return twEmotes.reduce(function (accum, v) {
                return accum.concat(v.emotes);
            }, []).map(function (emote) {
                return emote.displayName;
            });
        }
    }, {
        key: 'getChatMembers',
        value: function getChatMembers() {
            var broadcasterName = this.chatInputCtrl.props.channelDisplayName;
            this.userList.add(broadcasterName);
            return Array.from(this.userList.values());
        }
    }]);

    return CustomInputModule;
}();

exports.default = CustomInputModule;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = window.$;

function isSuggestionsShowing() {
    return !!$('[data-a-target="autocomplete-balloon"]')[0];
}

var ChatHistoryModule = function () {
    function ChatHistoryModule(parentModule) {
        _classCallCheck(this, ChatHistoryModule);

        this.parentModule = parentModule;
    }

    _createClass(ChatHistoryModule, [{
        key: 'load',
        value: function load(resetHistory) {
            if (resetHistory) {
                this.messageHistory = [];
            }
            this.historyPos = -1;
        }
    }, {
        key: 'onKeydown',
        value: function onKeydown(e) {
            var keyCode = e.key;
            if (e.ctrlKey) {
                return;
            }
            var $inputField = $(e.target);
            var setInputValue = function setInputValue(value) {
                e.target.customSetValue(value);
            };

            if (keyCode === 'ArrowUp') {
                if (isSuggestionsShowing()) return;
                if ($inputField[0].selectionStart > 0) return;
                if (this.historyPos + 1 === this.messageHistory.length) return;
                var prevMsg = this.messageHistory[++this.historyPos];
                setInputValue(prevMsg);
                $inputField[0].setSelectionRange(0, 0);
            } else if (keyCode === 'ArrowDown') {
                if (isSuggestionsShowing()) return;
                if ($inputField[0].selectionStart < $inputField.val().length) return;
                if (this.historyPos > 0) {
                    var _prevMsg = this.messageHistory[--this.historyPos];
                    setInputValue(_prevMsg);
                    $inputField[0].setSelectionRange(_prevMsg.length, _prevMsg.length);
                } else {
                    var draft = $inputField.val().trim();
                    if (this.historyPos < 0 && draft.length > 0) {
                        this.messageHistory.unshift(draft);
                    }
                    this.historyPos = -1;
                    $inputField.val('');
                    setInputValue('');
                }
            } else if (this.historyPos >= 0) {
                this.messageHistory[this.historyPos] = $inputField.val();
            }
        }
    }, {
        key: 'onSendMessage',
        value: function onSendMessage(message) {
            if (message.trim().length === 0) return;
            this.messageHistory.unshift(message);
            this.historyPos = -1;
            // watcher.emit('input.onSendMessage', message);
        }
    }, {
        key: 'onFocus',
        value: function onFocus() {
            this.historyPos = -1;
        }
    }]);

    return ChatHistoryModule;
}();

exports.default = ChatHistoryModule;

/***/ })
/******/ ]);
//# sourceMappingURL=main.bundle.js.map

    