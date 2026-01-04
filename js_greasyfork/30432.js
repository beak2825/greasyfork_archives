'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==UserScript==
// @name         ykh5p
// @namespace    https://github.com/gooyie/ykh5p
// @homepageURL  https://github.com/gooyie/ykh5p
// @supportURL   https://github.com/gooyie/ykh5p/issues
// @version      0.12.5
// @description  改善优酷官方html5播放器播放体验
// @author       gooyie
// @license      MIT License
//
// @include      *://v.youku.com/*
// @include      *://player.youku.com/embed/*
// @grant        GM_info
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/30432/ykh5p.user.js
// @updateURL https://update.greasyfork.org/scripts/30432/ykh5p.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* eslint-disable no-console */

    var Logger = function () {
        function Logger() {
            _classCallCheck(this, Logger);
        }

        _createClass(Logger, null, [{
            key: 'log',
            value: function log() {
                var _console;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                (_console = console).log.apply(_console, ['%c' + this.tag + '%c' + args.shift(), 'color: #fff; background: #2FB3FF', ''].concat(args));
            }
        }, {
            key: 'info',
            value: function info() {
                var _console2;

                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                (_console2 = console).info.apply(_console2, [this.tag + args.shift()].concat(args));
            }
        }, {
            key: 'debug',
            value: function debug() {
                var _console3;

                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = arguments[_key3];
                }

                (_console3 = console).debug.apply(_console3, [this.tag + args.shift()].concat(args));
            }
        }, {
            key: 'warn',
            value: function warn() {
                var _console4;

                for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    args[_key4] = arguments[_key4];
                }

                (_console4 = console).warn.apply(_console4, [this.tag + args.shift()].concat(args));
            }
        }, {
            key: 'error',
            value: function error() {
                var _console5;

                for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                    args[_key5] = arguments[_key5];
                }

                (_console5 = console).error.apply(_console5, [this.tag + args.shift()].concat(args));
            }
        }, {
            key: 'tag',
            get: function get() {
                return '[' + GM_info.script.name + ']';
            }
        }]);

        return Logger;
    }();
    /* eslint-enable no-console */

    var Hooker = function () {
        function Hooker() {
            _classCallCheck(this, Hooker);
        }

        _createClass(Hooker, null, [{
            key: '_hookCall',
            value: function _hookCall(cb) {
                var call = Function.prototype.call;
                Function.prototype.call = function () {
                    for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                        args[_key6] = arguments[_key6];
                    }

                    var ret = call.apply(this, args);
                    try {
                        if (args && cb(args)) {
                            Function.prototype.call = call;
                            cb = function cb() {};
                            Logger.log('restored call');
                        }
                    } catch (err) {
                        Logger.error(err.stack);
                    }
                    return ret;
                };
                this._hookCall = null;
            }
        }, {
            key: '_isEsModule',
            value: function _isEsModule(obj) {
                return obj.__esModule;
            }
        }, {
            key: '_isFuction',
            value: function _isFuction(arg) {
                return 'function' === typeof arg;
            }
        }, {
            key: '_isModuleCall',
            value: function _isModuleCall(args) {
                // module.exports, module, module.exports, require
                return args.length === 4 && args[1] && Object.getPrototypeOf(args[1]) === Object.prototype && args[1].hasOwnProperty('exports');
            }
        }, {
            key: '_hookModuleCall',
            value: function _hookModuleCall(cb, pred) {
                var _this = this;

                var callbacksMap = new Map([[pred, [cb]]]);
                this._hookCall(function (args) {
                    if (!_this._isModuleCall(args)) return;
                    var exports = args[1].exports;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = callbacksMap[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var _step$value = _slicedToArray(_step.value, 2),
                                _pred = _step$value[0],
                                callbacks = _step$value[1];

                            if (!_pred.apply(_this, [exports])) continue;
                            callbacks.forEach(function (cb) {
                                return cb(exports, args);
                            });
                            callbacksMap.delete(_pred);
                            !callbacksMap.size && (_this._hookModuleCall = null);
                            break;
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

                    return !callbacksMap.size;
                });

                this._hookModuleCall = function (cb, pred) {
                    if (callbacksMap.has(pred)) {
                        callbacksMap.get(pred).push(cb);
                    } else {
                        callbacksMap.set(pred, [cb]);
                    }
                };
            }
        }, {
            key: '_isUpsModuleCall',
            value: function _isUpsModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('getServieceUrl') && /\.id\s*=\s*"ups"/.test(exports.default.toString());
            }
        }, {
            key: 'hookUps',
            value: function hookUps(cb) {
                this._hookModuleCall(cb, this._isUpsModuleCall);
            }
        }, {
            key: 'hookUpsOnComplete',
            value: function hookUpsOnComplete(cb) {
                this.hookUps(function (exports) {
                    var onComplete = exports.default.prototype.onComplete;
                    exports.default.prototype.onComplete = function (res) {
                        cb(res);
                        onComplete.apply(this, [res]);
                    };
                });
            }
        }, {
            key: '_isLogoModuleCall',
            value: function _isLogoModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('reset') && /logo\.style\.display/.test(exports.default.prototype.reset.toString());
            }
        }, {
            key: 'hookLogo',
            value: function hookLogo(cb) {
                this._hookModuleCall(cb, this._isLogoModuleCall);
            }
        }, {
            key: '_isQualityIconComponentModuleCall',
            value: function _isQualityIconComponentModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('renderQuality');
            }
        }, {
            key: 'hookQualityIcon',
            value: function hookQualityIcon(cb) {
                this._hookModuleCall(cb, this._isQualityIconComponentModuleCall);
            }
        }, {
            key: 'hookRenderQuality',
            value: function hookRenderQuality(cb) {
                Hooker.hookQualityIcon(function (exports) {
                    var renderQuality = exports.default.prototype.renderQuality;
                    exports.default.prototype.renderQuality = function (langCode) {
                        cb(langCode, this);
                        renderQuality.apply(this, [langCode]);
                    };
                });
            }
        }, {
            key: 'hookSetQuality',
            value: function hookSetQuality(cb) {
                Hooker.hookQualityIcon(function (exports) {
                    var setQuality = exports.default.prototype.setQuality;
                    exports.default.prototype.setQuality = function () {
                        for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                            args[_key7] = arguments[_key7];
                        }

                        // quality, innerText
                        cb(args, this);
                        setQuality.apply(this, args);
                    };
                });
            }
        }, {
            key: '_isManageModuleCall',
            value: function _isManageModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('_resetPlayer');
            }
        }, {
            key: 'hookManage',
            value: function hookManage(cb) {
                this._hookModuleCall(cb, this._isManageModuleCall);
            }
        }, {
            key: 'hookInitPlayerEvent',
            value: function hookInitPlayerEvent(cb) {
                Hooker.hookManage(function (exports) {
                    var _initPlayerEvent = exports.default.prototype._initPlayerEvent;
                    exports.default.prototype._initPlayerEvent = function () {
                        cb(this);
                        _initPlayerEvent.apply(this);
                    };
                });
            }
        }, {
            key: 'hookResetPlayerAfter',
            value: function hookResetPlayerAfter(cb) {
                Hooker.hookManage(function (exports) {
                    var _resetPlayer = exports.default.prototype._resetPlayer;
                    exports.default.prototype._resetPlayer = function () {
                        try {
                            _resetPlayer.apply(this);
                        } catch (err) {
                            // 忽略 ykSDK.destroyAd 异常
                            if (!err.stack.includes('destroyAd')) throw err;
                        }
                        cb(this);
                    };
                });
            }
        }, {
            key: '_isKeyShortcutsModuleCall',
            value: function _isKeyShortcutsModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('registerEvents');
            }
        }, {
            key: 'hookKeyShortcuts',
            value: function hookKeyShortcuts(cb) {
                this._hookModuleCall(cb, this._isKeyShortcutsModuleCall);
            }
        }, {
            key: '_isTipsModuleCall',
            value: function _isTipsModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('showHintTips');
            }
        }, {
            key: 'hookTips',
            value: function hookTips(cb) {
                this._hookModuleCall(cb, this._isTipsModuleCall);
            }
        }, {
            key: '_isAdServiceModuleCall',
            value: function _isAdServiceModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('requestAdData');
            }
        }, {
            key: 'hookAdService',
            value: function hookAdService(cb) {
                this._hookModuleCall(cb, this._isAdServiceModuleCall);
            }
        }, {
            key: '_isTopAreaModuleCall',
            value: function _isTopAreaModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('_timerHandler');
            }
        }, {
            key: 'hookTopArea',
            value: function hookTopArea(cb) {
                this._hookModuleCall(cb, this._isTopAreaModuleCall);
            }
        }, {
            key: 'hookTopAreaAddEvent',
            value: function hookTopAreaAddEvent(cb) {
                Hooker.hookTopArea(function (exports) {
                    var _addEvent = exports.default.prototype._addEvent;
                    exports.default.prototype._addEvent = function () {
                        cb(this);
                        _addEvent.apply(this);
                    };
                });
            }
        }, {
            key: '_isPreviewLayerModuleCall',
            value: function _isPreviewLayerModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('setPreviewShow');
            }
        }, {
            key: 'hookPreviewLayer',
            value: function hookPreviewLayer(cb) {
                this._hookModuleCall(cb, this._isPreviewLayerModuleCall);
            }
        }, {
            key: 'hookPreviewLayerBind',
            value: function hookPreviewLayerBind(cb) {
                Hooker.hookPreviewLayer(function (exports) {
                    var bind = exports.default.prototype.bind;
                    exports.default.prototype.bind = function () {
                        cb(this);
                        bind.apply(this);
                    };
                });
            }
        }, {
            key: '_isSettingSeriesComponentModuleCall',
            value: function _isSettingSeriesComponentModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('_addEvent') && exports.default.prototype._addEvent.toString().includes('seriesliseLayer');
            }
        }, {
            key: 'hookSettingSeries',
            value: function hookSettingSeries(cb) {
                this._hookModuleCall(cb, this._isSettingSeriesComponentModuleCall);
            }
        }, {
            key: '_isSettingsIconComponentModuleCall',
            value: function _isSettingsIconComponentModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('setConfig');
            }
        }, {
            key: 'hookSettingsIcon',
            value: function hookSettingsIcon(cb) {
                this._hookModuleCall(cb, this._isSettingsIconComponentModuleCall);
            }
        }, {
            key: '_isTriggerLayerComponentModuleCall',
            value: function _isTriggerLayerComponentModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('showMenu');
            }
        }, {
            key: 'hookTriggerLayer',
            value: function hookTriggerLayer(cb) {
                this._hookModuleCall(cb, this._isTriggerLayerComponentModuleCall);
            }
        }, {
            key: '_isUtilModuleCall',
            value: function _isUtilModuleCall(exports) {
                return exports.setLocalData && exports.getLocalData;
            }
        }, {
            key: 'hookUtil',
            value: function hookUtil(cb) {
                this._hookModuleCall(cb, this._isUtilModuleCall);
            }
        }, {
            key: '_isGlobalModuleCall',
            value: function _isGlobalModuleCall(exports) {
                return this._isEsModule(exports) && this._isFuction(exports.default) && exports.default.prototype && exports.default.prototype.hasOwnProperty('resetConfig');
            }
        }, {
            key: 'hookGlobal',
            value: function hookGlobal(cb) {
                this._hookModuleCall(cb, this._isGlobalModuleCall);
            }
        }, {
            key: 'hookGlobalConstructorAfter',
            value: function hookGlobalConstructorAfter(cb) {
                Hooker.hookGlobal(function (exports) {
                    var constructor = exports.default;
                    exports.default = function () {
                        for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                            args[_key8] = arguments[_key8];
                        }

                        constructor.apply(this, args);
                        cb(this);
                    };
                    exports.default.prototype = constructor.prototype;
                });
            }
        }, {
            key: 'hookGlobalInit',
            value: function hookGlobalInit(cb) {
                Hooker.hookGlobal(function (exports) {
                    var init = exports.default.prototype.init;
                    exports.default.prototype.init = function (config) {
                        cb(config, this);
                        init.apply(this, [config]);
                    };
                });
            }
        }, {
            key: 'hookGlobalDeal',
            value: function hookGlobalDeal(cb) {
                Hooker.hookGlobal(function (exports) {
                    var deal = exports.default.prototype.deal;
                    exports.default.prototype.deal = function () {
                        cb(this);
                        deal.apply(this);
                    };
                });
            }
        }, {
            key: 'hookGlobalResetAfter',
            value: function hookGlobalResetAfter(cb) {
                Hooker.hookGlobal(function (exports) {
                    var reset = exports.default.prototype.reset;
                    exports.default.prototype.reset = function () {
                        reset.apply(this);
                        cb(this);
                    };
                });
            }
        }, {
            key: '_extractArgsName',
            value: function _extractArgsName(code) {
                return code.slice(code.indexOf('(') + 1, code.indexOf(')')).split(/\s*,\s*/);
            }
        }, {
            key: '_extractFunctionBody',
            value: function _extractFunctionBody(code) {
                return code.slice(code.indexOf('{') + 1, code.lastIndexOf('}'));
            }
        }, {
            key: '_isBaseModuleCall',
            value: function _isBaseModuleCall(exports) {
                return exports.SingleVideoControl && exports.MultiVideoControl;
            }
        }, {
            key: 'hookBase',
            value: function hookBase(cb, mode) {
                var _this2 = this;

                var callbacks = [];
                var codeCallbacks = [];
                (mode === 'code' ? codeCallbacks : callbacks).push(cb);

                this._hookModuleCall(function (exports, args) {
                    if (codeCallbacks.length > 0) {
                        var code = args[3].m[args[1].i].toString();
                        code = codeCallbacks.reduce(function (c, cb) {
                            return cb(c);
                        }, code);
                        var fn = new (Function.prototype.bind.apply(Function, [null].concat(_toConsumableArray(_this2._extractArgsName(code)), [_this2._extractFunctionBody(code)])))();
                        fn.apply(args[0], args.slice(1));
                    }
                    callbacks.forEach(function (cb) {
                        return cb(args[1].exports);
                    });
                    _this2.hookBase = null;
                }, this._isBaseModuleCall);

                this.hookBase = function (cb, mode) {
                    return (mode === 'code' ? codeCallbacks : callbacks).push(cb);
                };
            }
        }, {
            key: 'hookGlobalVariable',
            value: function hookGlobalVariable(name, cb) {
                var window = unsafeWindow;

                var value = window[name];
                Object.defineProperty(window, name, {
                    get: function get() {
                        return value;
                    },
                    set: function set(v) {
                        try {
                            var ret = cb(v);
                            value = ret === undefined ? v : ret;
                        } catch (err) {
                            Logger.error(err.stack);
                        }
                    }
                });
                if (value) window[name] = value;
            }
        }, {
            key: 'hookOz',
            value: function hookOz(cb) {
                var callbacks = [cb];
                this.hookGlobalVariable('oz', function (oz) {
                    callbacks.forEach(function (cb) {
                        return cb(oz);
                    });
                });
                this.hookOz = function (cb) {
                    return callbacks.push(cb);
                };
            }
        }, {
            key: 'hookDefine',
            value: function hookDefine(name, cb) {
                var _this3 = this;

                var callbacksMap = new Map([[name, [cb]]]);
                this.hookOz(function (oz) {
                    var self = _this3;
                    var define = oz.define;
                    oz.define = function (name, deps, block) {
                        if (callbacksMap.has(name)) {
                            var code = block.toString();
                            code = callbacksMap.get(name).reduce(function (c, cb) {
                                return cb(c);
                            }, code);
                            block = new (Function.prototype.bind.apply(Function, [null].concat(_toConsumableArray(self._extractArgsName(code)), [self._extractFunctionBody(code)])))();
                        }
                        define(name, deps, block);
                    };
                });

                this.hookDefine = function (name, cb) {
                    if (callbacksMap.has(name)) {
                        callbacksMap.get(name).push(cb);
                    } else {
                        callbacksMap.set(name, [cb]);
                    }
                };
            }
        }]);

        return Hooker;
    }();

    var Patch = function () {
        function Patch() {
            _classCallCheck(this, Patch);

            this._installed = false;
        }

        _createClass(Patch, [{
            key: 'install',
            value: function install() {
                if (!this._installed) {
                    this._installed = true;
                    this._apply();
                }
            }
        }, {
            key: '_apply',
            value: function _apply() {}
        }]);

        return Patch;
    }();

    var MockAdsPatch = function (_Patch) {
        _inherits(MockAdsPatch, _Patch);

        function MockAdsPatch() {
            _classCallCheck(this, MockAdsPatch);

            return _possibleConstructorReturn(this, (MockAdsPatch.__proto__ || Object.getPrototypeOf(MockAdsPatch)).call(this));
        }

        _createClass(MockAdsPatch, [{
            key: '_apply',
            value: function _apply() {
                var self = this;
                Hooker.hookAdService(function (exports) {
                    exports.default.prototype.requestAdData = function (obj /* , params */) {
                        var _this5 = this;

                        setTimeout(function () {
                            if ('frontad' === obj.adtype) {
                                _this5.success(obj, self._fakeFrontAdData());
                            } else {
                                _this5.fail(obj, { code: '404', message: 'error' });
                            }
                        }, 0);
                    };
                });
                this._hideOppoAds();
            }
        }, {
            key: '_fakeFrontAdData',
            value: function _fakeFrontAdData() {
                var data = {
                    VAL: []
                };
                return data;
            }
        }, {
            key: '_hideOppoAds',
            value: function _hideOppoAds() {
                GM_addStyle('\n                .oppo-ads, .oppinfo {\n                    display: none !important;\n                }\n            ');
            }
        }]);

        return MockAdsPatch;
    }(Patch);

    var WatermarksPatch = function (_Patch2) {
        _inherits(WatermarksPatch, _Patch2);

        function WatermarksPatch() {
            _classCallCheck(this, WatermarksPatch);

            return _possibleConstructorReturn(this, (WatermarksPatch.__proto__ || Object.getPrototypeOf(WatermarksPatch)).call(this));
        }

        _createClass(WatermarksPatch, [{
            key: '_apply',
            value: function _apply() {
                Hooker.hookLogo(function (exports) {
                    exports.default.prototype.reset = function () {};
                });
            }
        }]);

        return WatermarksPatch;
    }(Patch);

    var VipPatch = function (_Patch3) {
        _inherits(VipPatch, _Patch3);

        function VipPatch() {
            _classCallCheck(this, VipPatch);

            return _possibleConstructorReturn(this, (VipPatch.__proto__ || Object.getPrototypeOf(VipPatch)).call(this));
        }

        _createClass(VipPatch, [{
            key: '_apply',
            value: function _apply() {
                Hooker.hookUpsOnComplete(function (res) {
                    var data = res.data;
                    data.user = Object.assign(data.user || {}, { vip: true });
                    data.vip = Object.assign(data.vip || {}, { hd3: true });
                });
            }
        }]);

        return VipPatch;
    }(Patch);

    var QualityPatch = function (_Patch4) {
        _inherits(QualityPatch, _Patch4);

        function QualityPatch() {
            _classCallCheck(this, QualityPatch);

            return _possibleConstructorReturn(this, (QualityPatch.__proto__ || Object.getPrototypeOf(QualityPatch)).call(this));
        }

        _createClass(QualityPatch, [{
            key: '_apply',
            value: function _apply() {
                this._improveAdaptQuality();
            }
        }, {
            key: '_findBestQuality',
            value: function _findBestQuality(qualityList) {
                return ['1080p', '720p', '480p', '320p'].find(function (q) {
                    return qualityList.some(function (v) {
                        return v === q;
                    });
                });
            }
        }, {
            key: '_improveAdaptQuality',
            value: function _improveAdaptQuality() {
                var self = this;
                Hooker.hookGlobal(function (exports) {
                    var adaptQuality = exports.default.prototype.adaptQuality;
                    exports.default.prototype.adaptQuality = function (lang) {
                        var cfg = this._config;
                        var quality = cfg.quality;
                        adaptQuality.apply(this, [lang]);
                        if (!this.qualityList.includes(quality)) {
                            cfg.quality = self._findBestQuality(this.qualityList);
                        }
                    };
                });
            }
        }]);

        return QualityPatch;
    }(Patch);

    var DashboardPatch = function (_Patch5) {
        _inherits(DashboardPatch, _Patch5);

        function DashboardPatch() {
            _classCallCheck(this, DashboardPatch);

            return _possibleConstructorReturn(this, (DashboardPatch.__proto__ || Object.getPrototypeOf(DashboardPatch)).call(this));
        }

        _createClass(DashboardPatch, [{
            key: '_apply',
            value: function _apply() {
                this._prepare();
                this._patch();
            }
        }, {
            key: '_prepare',
            value: function _prepare() {
                this._exposeDashboard();
                Hooker.hookPreviewLayerBind(function (that) {
                    that._el.addEventListener('mouseover', function () {
                        return that.emit('mouseoverpreview');
                    });
                    that._el.addEventListener('mouseleave', function () {
                        return that.emit('mouseleavepreview');
                    });
                });
            }
        }, {
            key: '_findVarName',
            value: function _findVarName(code) {
                return (/"dashboard"\s*,\s*(\w+)/.exec(code)[1]
                );
            }
        }, {
            key: '_exposeDashboard',
            value: function _exposeDashboard() {
                var _this10 = this;

                Hooker.hookBase(function (code) {
                    var varName = _this10._findVarName(code);
                    return code.replace(/\.exports\s*=\s*(\w+)/, '$&;$1.__Dashboard=' + varName + ';');
                }, 'code');
            }
        }, {
            key: '_patch',
            value: function _patch() {
                Hooker.hookBase(function (exports) {
                    var proto = exports.__Dashboard.prototype;

                    proto.bindAutoHide = function () {
                        var _this11 = this;

                        this._args.show = 'function' === typeof this._args.show ? this._args.show : function () {};
                        this._args.hide = 'function' === typeof this._args.hide ? this._args.show : function () {};

                        this._el.addEventListener('mouseover', function () {
                            return _this11._mouseover = true;
                        });
                        this._el.addEventListener('mouseleave', function () {
                            return _this11._mouseover = false;
                        });
                        this.on('mouseoverpreview', function () {
                            return _this11._mouseoverpreview = true;
                        });
                        this.on('mouseleavepreview', function () {
                            return _this11._mouseoverpreview = false;
                        });
                        this._video.on('play', function () {
                            if (!_this11._mouseover && !_this11._mouseoverpreview) _this11._hideTimeout = setTimeout(_this11.hide.bind(_this11), _this11._args.autoHide);
                        });
                        this._video.on('pause', function () {
                            _this11._hideTimeout && clearTimeout(_this11._hideTimeout);
                            _this11.isShow() || _this11.show();
                        });
                        this._parent.addEventListener('mousemove', function () {
                            _this11._hideTimeout && clearTimeout(_this11._hideTimeout);
                            _this11.isShow() || _this11.show();
                            if (!_this11._isPaused() && !_this11._mouseover && !_this11._mouseoverpreview) _this11._hideTimeout = setTimeout(_this11.hide.bind(_this11), _this11._args.autoHide);
                        });
                        this._parent.addEventListener('mouseleave', function () {
                            _this11._hideTimeout && clearTimeout(_this11._hideTimeout);
                            if (!_this11._isPaused()) _this11.hide();
                        });
                    };

                    proto._isPaused = function () {
                        return this._video._videoCore.video.paused;
                    };

                    proto.isShow = function () {
                        return this._el.style.display !== 'none';
                    };

                    proto.show = function () {
                        this.emit('dashboardshow');
                        this._parent.style.cursor = '';
                        this._el.style.display = '';
                        this._args.show();
                    };

                    proto.hide = function () {
                        this.emit('dashboardhide');
                        this._parent.style.cursor = 'none'; // 隐藏鼠标
                        this._el.style.display = 'none';
                        this._args.show();
                    };
                });
            }
        }]);

        return DashboardPatch;
    }(Patch);

    var TopAreaPatch = function (_Patch6) {
        _inherits(TopAreaPatch, _Patch6);

        function TopAreaPatch() {
            _classCallCheck(this, TopAreaPatch);

            return _possibleConstructorReturn(this, (TopAreaPatch.__proto__ || Object.getPrototypeOf(TopAreaPatch)).call(this));
        }

        _createClass(TopAreaPatch, [{
            key: '_apply',
            value: function _apply() {
                Hooker.hookTopAreaAddEvent(function (that) {
                    that.on('webfullscreen', function (isWebFullscreen) {
                        isWebFullscreen ? that._showHideTop(true) : that._hideHideTop();
                    });
                    that.on('dashboardshow', function () {
                        var playerState = that._video.global.playerState;
                        if (playerState.fullscreen || playerState.webfullscreen) {
                            that._showHideTop(true);
                        }
                    });
                    that.on('dashboardhide', function () {
                        var playerState = that._video.global.playerState;
                        if (playerState.fullscreen || playerState.webfullscreen) {
                            that._hideHideTop();
                        }
                    });
                });
                Hooker.hookResetPlayerAfter(function (that) {
                    // 网页全屏播放上下集重置播放器后显示顶部控件
                    if (!that.global.playerState.fullscreen) that._player.control.emit('webfullscreen', that.global.playerState.webfullscreen);
                });
            }
        }]);

        return TopAreaPatch;
    }(Patch);

    var SettingSeriesPatch = function (_Patch7) {
        _inherits(SettingSeriesPatch, _Patch7);

        function SettingSeriesPatch() {
            _classCallCheck(this, SettingSeriesPatch);

            return _possibleConstructorReturn(this, (SettingSeriesPatch.__proto__ || Object.getPrototypeOf(SettingSeriesPatch)).call(this));
        }

        _createClass(SettingSeriesPatch, [{
            key: '_apply',
            value: function _apply() {
                Hooker.hookSettingSeries(function (exports) {
                    // 网页全屏显示选集
                    var _addEvent = exports.default.prototype._addEvent;
                    exports.default.prototype._addEvent = function () {
                        var _this14 = this;

                        _addEvent.apply(this);
                        this.on('webfullscreen', function (isWebFullscreen) {
                            if (isWebFullscreen) {
                                if (_this14.seriesList.length > 1) _this14._el.style.display = 'inline-block';
                            } else {
                                _this14._el.style.display = 'none';
                                _this14._el.classList.remove('cliced');
                                _this14.emit('seriesliseLayer', false);
                            }
                        });
                    };
                });
            }
        }]);

        return SettingSeriesPatch;
    }(Patch);

    var ContinuePlayPatch = function (_Patch8) {
        _inherits(ContinuePlayPatch, _Patch8);

        function ContinuePlayPatch() {
            _classCallCheck(this, ContinuePlayPatch);

            return _possibleConstructorReturn(this, (ContinuePlayPatch.__proto__ || Object.getPrototypeOf(ContinuePlayPatch)).call(this));
        }

        _createClass(ContinuePlayPatch, [{
            key: '_apply',
            value: function _apply() {
                var _this16 = this;

                Hooker.hookInitPlayerEvent(function (that) {
                    // 视频播放结束处理
                    that._player.control.on('ended', that._onEnd.bind(that));
                    that._player.control.on('ended', function () {
                        return _this16._onEnd(that);
                    });
                });
            }
        }, {
            key: '_onEnd',
            value: function _onEnd(that) {
                var config = that.global.config;
                var playerState = that.global.playerState;
                if (config.continuePlay && config.nextVid && !playerState.fullscreen) {
                    if (playerState.webfullscreen) {
                        that.playByVid({ vid: that.global.config.nextVid });
                    } else {
                        that.gotoVideo(that.global.config.nextVid);
                    }
                }
            }
        }]);

        return ContinuePlayPatch;
    }(Patch);

    var FullscreenPatch = function (_Patch9) {
        _inherits(FullscreenPatch, _Patch9);

        function FullscreenPatch() {
            _classCallCheck(this, FullscreenPatch);

            return _possibleConstructorReturn(this, (FullscreenPatch.__proto__ || Object.getPrototypeOf(FullscreenPatch)).call(this));
        }

        _createClass(FullscreenPatch, [{
            key: '_apply',
            value: function _apply() {
                Object.defineProperty(document, 'fullscreen', {});
            }
        }]);

        return FullscreenPatch;
    }(Patch);

    var WebFullscreen = function () {
        function WebFullscreen(elem) {
            _classCallCheck(this, WebFullscreen);

            this._elem = elem;
        }

        _createClass(WebFullscreen, [{
            key: 'isWebFullscreen',
            value: function isWebFullscreen() {
                return this._elem.classList.contains('webfullscreen');
            }
        }, {
            key: 'enter',
            value: function enter() {
                this._elem.classList.add('webfullscreen');
                var body = document.body;
                body.style.overflow = 'hidden';

                var parentElement = this._elem.parentElement;
                while (parentElement && parentElement !== body) {
                    parentElement.classList.add('z-top');
                    parentElement = parentElement.parentElement;
                }
            }
        }, {
            key: 'exit',
            value: function exit() {
                this._elem.classList.remove('webfullscreen');
                var body = document.body;
                body.style.overflow = '';

                var parentElement = this._elem.parentElement;
                while (parentElement && parentElement !== body) {
                    parentElement.classList.remove('z-top');
                    parentElement = parentElement.parentElement;
                }
            }
        }, {
            key: 'toggle',
            value: function toggle() {
                this.isWebFullscreen() ? this.exit() : this.enter();
            }
        }], [{
            key: 'addStyle',
            value: function addStyle() {
                GM_addStyle('\n                .z-top {\n                    position: relative !important;\n                    z-index: 23333333 !important;\n                }\n                .webfullscreen {\n                    display: block !important;\n                    position: fixed !important;\n                    width: 100% !important;\n                    height: 100% !important;\n                    top: 0 !important;\n                    left: 0 !important;\n                    background: #000 !important;\n                    z-index: 23333333 !important;\n                }\n            ');
            }
        }]);

        return WebFullscreen;
    }();

    var ManagePatch = function (_Patch10) {
        _inherits(ManagePatch, _Patch10);

        function ManagePatch() {
            _classCallCheck(this, ManagePatch);

            return _possibleConstructorReturn(this, (ManagePatch.__proto__ || Object.getPrototypeOf(ManagePatch)).call(this));
        }

        _createClass(ManagePatch, [{
            key: '_apply',
            value: function _apply() {
                this._prepare();
                this._hookManage();
            }
        }, {
            key: '_prepare',
            value: function _prepare() {
                this._customTip();
                this._disablePlayAfterSeek();
                this._addPrevInfo();
                this._playAfterPlayerReset();
                this._keepPlaybackRate();
                this._playbackRatePersistence();
                new ContinuePlayPatch().install();
                new FullscreenPatch().install();
            }
        }, {
            key: '_customTip',
            value: function _customTip() {
                Hooker.hookTips(function (exports) {
                    var showHintTips = exports.default.prototype.showHintTips;
                    exports.default.prototype.showHintTips = function (code, info) {
                        if (info.msg) {
                            this._hintLayer.setHintShow(info.msg);
                        } else {
                            showHintTips.apply(this, [code, info]);
                        }
                    };
                });
            }
        }, {
            key: '_disablePlayAfterSeek',
            value: function _disablePlayAfterSeek() {
                // SingleVideoControl seek 后不自动播放
                Hooker.hookBase(function (exports) {
                    var _setCurrentTime = exports.SingleVideoControl.prototype._setCurrentTime;
                    exports.SingleVideoControl.prototype._setCurrentTime = function (time) {
                        var play = this.video.play;
                        this.video.play = function () {};
                        _setCurrentTime.apply(this, [time]);
                        this.video.play = play;
                    };
                });
            }
        }, {
            key: '_keepPlaybackRate',
            value: function _keepPlaybackRate() {
                Hooker.hookBase(function (exports) {
                    var proto = exports.MultiVideoControl.prototype;
                    var _setVideo = proto._setVideo;
                    proto._setVideo = function () {
                        var rate = this.video.playbackRate;

                        for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                            args[_key9] = arguments[_key9];
                        }

                        _setVideo.apply(this, args);
                        this.video.playbackRate = rate;
                    };
                });
            }
        }, {
            key: '_playbackRatePersistence',
            value: function _playbackRatePersistence() {
                var util = void 0;
                Hooker.hookUtil(function (exports) {
                    return util = exports;
                });
                Hooker.hookSettingsIcon(function (exports) {
                    var proto = exports.default.prototype;
                    var setDataUI = proto.setDataUI;
                    proto.setDataUI = function (data) {
                        var _this19 = this;

                        setDataUI.apply(this, [data]);
                        this._video.global.playerState = { playbackRate: data.playbackRate || 1 };
                        this.on('playbackratechange', function (rate) {
                            _this19.data.playbackRate = rate;
                            util.setLocalData('YK_PSL_SETTINGS', _this19.data);
                        });
                    };
                });
            }
        }, {
            key: '_addPrevInfo',
            value: function _addPrevInfo() {
                Hooker.hookGlobalDeal(function (that) {
                    if (that.ups && that.ups.videoData && that.ups.programList && that.ups.programList.videoList) {
                        var list = that.ups.programList.videoList;
                        var currVid = that.ups.videoData.id;
                        var currIdx = list.findIndex(function (item) {
                            return parseInt(item.vid) === currVid;
                        });
                        if (currIdx > 0) {
                            var prevVideo = list[currIdx - 1];
                            that.ups.programList.prevVideo = prevVideo;
                            prevVideo && (that._config.prevVid = prevVideo.encodevid);
                        }
                    }
                });
            }
        }, {
            key: '_playAfterPlayerReset',
            value: function _playAfterPlayerReset() {
                Hooker.hookResetPlayerAfter(function (that) {
                    if (that.global.playerState.state === 'playerreset') that.play();
                });
            }
        }, {
            key: '_hookManage',
            value: function _hookManage() {
                Hooker.hookManage(this._hookManageCallback.bind(this));
            }
        }, {
            key: '_hookManageCallback',
            value: function _hookManageCallback(exports) {
                var proto = exports.default.prototype;

                var _init = proto._init;
                proto._init = function () {
                    _init.apply(this);
                    WebFullscreen.addStyle();
                    this._webfullscreen = new WebFullscreen(this.container);
                };

                proto._showTip = function (msg) {
                    this._emitter.emit('player.showinfo', { type: 'hint', msg: msg });
                };

                proto.play = function () {
                    this._player && this._player.control.play();
                    this._showTip('播放');
                };

                proto._pause = proto.pause;
                proto.pause = function () {
                    this._pause();
                    this._showTip('暂停');
                };

                proto.adjustVolume = function (value) {
                    var volume = this.global.playerState.volume + value;
                    volume = Math.max(0, Math.min(1, volume.toFixed(2)));
                    this._player.control.setVolume(volume);
                    if (volume === 0) {
                        this._emitter.emit('player.showinfo', { type: 'hint', code: 'H0003', volume: volume + '%' });
                    }
                };

                proto.toggleMute = function () {
                    if (this.global.playerState.muted) this._showTip('取消静音');
                    this.setMuted(!this.global.playerState.muted);
                };

                proto.stepSeek = function (stepTime) {
                    var duration = this._player.control.getDuration();
                    var currentTime = this.global.currentTime;
                    var seekTime = Math.max(0, Math.min(duration, currentTime + stepTime));
                    this.seek(seekTime);

                    var msg = void 0;
                    if (Math.abs(stepTime) < 60) {
                        msg = stepTime > 0 ? '\u6B65\u8FDB\uFF1A' + stepTime + '\u79D2' : '\u6B65\u9000\uFF1A' + Math.abs(stepTime) + '\u79D2';
                    } else {
                        msg = stepTime > 0 ? '\u6B65\u8FDB\uFF1A' + stepTime / 60 + '\u5206\u949F' : '\u6B65\u9000\uFF1A' + Math.abs(stepTime) / 60 + '\u5206\u949F';
                    }
                    this._showTip(msg);
                };

                proto.rangeSeek = function (range) {
                    var duration = this._player.control.getDuration();
                    var seekTime = Math.max(0, Math.min(duration, duration * range));
                    this.seek(seekTime);
                    this._showTip('定位：' + (range * 100).toFixed(0) + '%');
                };

                proto.isFullscreen = function () {
                    return this.global.playerState.fullscreen;
                };

                proto.toggleFullscreen = function () {
                    if (this.isFullscreen()) {
                        this.exitFullscreen();
                    } else {
                        this.fullScreen();
                    }
                };

                proto.isWebFullscreen = function () {
                    return this._webfullscreen.isWebFullscreen();
                };

                proto.enterWebFullscreen = function () {
                    this._webfullscreen.enter();
                    this.global.playerState = { webfullscreen: true };
                    this._player.control.emit('webfullscreen', true);
                };

                proto.exitWebFullscreen = function () {
                    this._webfullscreen.exit();
                    this.global.playerState = { webfullscreen: false };
                    this._player.control.emit('webfullscreen', false);
                };

                proto.toggleWebFullscreen = function () {
                    this.isWebFullscreen() ? this.exitWebFullscreen() : this.enterWebFullscreen();
                };

                proto.setRate = function (rate) {
                    var videoCore = this._player.control._videoCore;
                    var video = videoCore.video;
                    if (this._player.config.controlType === 'multi') {
                        videoCore._videoElments.forEach(function (v) {
                            return v.playbackRate = rate;
                        });
                    } else {
                        video.playbackRate = rate;
                    }
                };

                proto.adjustPlaybackRate = function (value) {
                    var video = this._player.control._videoCore.video;
                    var rate = Math.max(0.2, Math.min(5, parseFloat((video.playbackRate + value).toFixed(1))));
                    this.setRate(rate);
                    this.global.playerState = { playbackRate: rate };
                    this._player.control.emit('playbackratechange', rate);
                    this._showTip('\u64AD\u653E\u901F\u7387\uFF1A' + rate);
                };

                proto.turnPlaybackRate = function () {
                    var video = this._player.control._videoCore.video;
                    var rate = video.playbackRate !== 1 ? 1 : this.global.playerState.playbackRate;
                    this.setRate(rate);
                    this._showTip('\u64AD\u653E\u901F\u7387\uFF1A' + rate);
                };

                proto.getFps = function () {
                    return 25; // 标清fps为15，标清以上fps为25。
                };

                proto.prevFrame = function () {
                    var state = this.global.playerState.state;
                    if (state === 'playing') this.pause();
                    var duration = this._player.control.getDuration();
                    var currentTime = this.global.currentTime;
                    var seekTime = Math.max(0, Math.min(duration, currentTime - 1 / this.getFps()));
                    this.seek(seekTime);
                    this._showTip('上一帧');
                };

                proto.nextFrame = function () {
                    var state = this.global.playerState.state;
                    if (state === 'playing') this.pause();
                    var duration = this._player.control.getDuration();
                    var currentTime = this.global.currentTime;
                    var seekTime = Math.max(0, Math.min(duration, currentTime + 1 / this.getFps()));
                    this.seek(seekTime);
                    this._showTip('下一帧');
                };

                proto.playPrev = function () {
                    var prevVid = this.global.config.prevVid;
                    if (prevVid) {
                        if (this.isFullscreen() || this.isWebFullscreen()) {
                            this.playByVid({ vid: prevVid });
                        } else {
                            this.gotoVideo(prevVid);
                        }
                        this._showTip('播放上一集');
                    } else {
                        this._showTip('没有上一集哦');
                    }
                };

                var playNext = proto.playNext;
                proto.playNext = function (data) {
                    if (data) return playNext.apply(this, [data]);
                    var nextVid = this.global.config.nextVid;
                    if (nextVid) {
                        if (this.isFullscreen() || this.isWebFullscreen()) {
                            this.playByVid({ vid: nextVid });
                        } else {
                            this.gotoVideo(nextVid);
                        }
                        this._showTip('播放下一集');
                    } else {
                        this._showTip('没有下一集哦');
                    }
                };

                proto.gotoVideo = function (vid) {
                    location.href = '//v.youku.com/v_show/id_' + vid + '.html';
                };
            }
        }]);

        return ManagePatch;
    }(Patch);

    var managePatch = new ManagePatch();

    var KeyShortcutsPatch = function (_Patch11) {
        _inherits(KeyShortcutsPatch, _Patch11);

        function KeyShortcutsPatch() {
            _classCallCheck(this, KeyShortcutsPatch);

            return _possibleConstructorReturn(this, (KeyShortcutsPatch.__proto__ || Object.getPrototypeOf(KeyShortcutsPatch)).call(this));
        }

        _createClass(KeyShortcutsPatch, [{
            key: '_apply',
            value: function _apply() {
                this._prepare();
                this._addListener();
            }
        }, {
            key: '_prepare',
            value: function _prepare() {
                managePatch.install();
                this._obtainPlayer();
            }
        }, {
            key: '_obtainPlayer',
            value: function _obtainPlayer() {
                var self = this;
                Hooker.hookKeyShortcuts(function (exports) {
                    exports.default.prototype.registerEvents = function () {
                        self._player = this._player;
                    };
                });
            }
        }, {
            key: '_addListener',
            value: function _addListener() {
                document.addEventListener('keydown', this._handler.bind(this));
            }
        }, {
            key: '_handler',
            value: function _handler(event) {
                if (event.target.nodeName !== 'BODY') return;

                switch (event.keyCode) {
                    case 32:
                        // Spacebar
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            var state = this._player.global.playerState.state;
                            if (state === 'paused') {
                                this._player.play();
                            } else if (state === 'ended') {
                                this._player.replay();
                            } else {
                                this._player.pause();
                            }
                        } else {
                            return;
                        }
                        break;
                    case 39: // → Arrow Right
                    case 37:
                        {
                            // ← Arrow Left
                            var stepTime = void 0;
                            if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                                stepTime = 39 === event.keyCode ? 5 : -5;
                            } else if (event.ctrlKey && !event.shiftKey && !event.altKey) {
                                stepTime = 39 === event.keyCode ? 30 : -30;
                            } else if (!event.ctrlKey && event.shiftKey && !event.altKey) {
                                stepTime = 39 === event.keyCode ? 60 : -60;
                            } else if (event.ctrlKey && !event.shiftKey && event.altKey) {
                                stepTime = 39 === event.keyCode ? 3e2 : -3e2; // 5分钟
                            } else {
                                return;
                            }
                            this._player.stepSeek(stepTime);
                            break;
                        }
                    case 38: // ↑ Arrow Up
                    case 40:
                        // ↓ Arrow Down
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this._player.adjustVolume(38 === event.keyCode ? 0.05 : -0.05);
                        } else {
                            return;
                        }
                        break;
                    case 77:
                        // M
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this._player.toggleMute();
                        } else {
                            return;
                        }
                        break;
                    case 13:
                        // Enter
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this._player.toggleFullscreen();
                        } else if (event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this._player.toggleWebFullscreen();
                        } else {
                            return;
                        }
                        break;
                    case 67: // C
                    case 88:
                        // X
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this._player.adjustPlaybackRate(67 === event.keyCode ? 0.1 : -0.1);
                        } else {
                            return;
                        }
                        break;
                    case 90:
                        // Z
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            this._player.turnPlaybackRate();
                        } else {
                            return;
                        }
                        break;
                    case 68: // D
                    case 70:
                        // F
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                            if (event.keyCode === 68) {
                                this._player.prevFrame();
                            } else {
                                this._player.nextFrame();
                            }
                        } else {
                            return;
                        }
                        break;
                    case 80: // P
                    case 78:
                        // N
                        if (!event.ctrlKey && event.shiftKey && !event.altKey) {
                            if (event.keyCode === 78) {
                                this._player.playNext();
                            } else {
                                this._player.playPrev();
                            }
                        } else {
                            return;
                        }
                        break;
                    case 27:
                        // ESC
                        if (!event.ctrlKey && !event.shiftKey && !event.altKey) this._player.isWebFullscreen() && this._player.exitWebFullscreen();
                        return;
                    default:
                        if (event.keyCode >= 48 && event.keyCode <= 57) {
                            // 0 ~ 9
                            if (!event.ctrlKey && !event.shiftKey && !event.altKey) {
                                this._player.rangeSeek((event.keyCode - 48) * 0.1);
                            } else {
                                return;
                            }
                        } else {
                            return;
                        }
                }

                event.preventDefault();
                event.stopPropagation();
            }
        }]);

        return KeyShortcutsPatch;
    }(Patch);

    var MouseShortcutsPatch = function (_Patch12) {
        _inherits(MouseShortcutsPatch, _Patch12);

        function MouseShortcutsPatch() {
            _classCallCheck(this, MouseShortcutsPatch);

            return _possibleConstructorReturn(this, (MouseShortcutsPatch.__proto__ || Object.getPrototypeOf(MouseShortcutsPatch)).call(this));
        }

        _createClass(MouseShortcutsPatch, [{
            key: '_apply',
            value: function _apply() {
                this._prepare();
                this._initEvents();
            }
        }, {
            key: '_prepare',
            value: function _prepare() {
                managePatch.install();
            }
        }, {
            key: '_initEvents',
            value: function _initEvents() {
                Hooker.hookTriggerLayer(function (exports) {
                    var proto = exports.default.prototype;
                    var initEvents = proto.initEvents;
                    proto.initEvents = function () {
                        var _this22 = this;

                        var player = this._video.ykplayer;

                        this._el.addEventListener('dblclick', function (event) {
                            if (event.ctrlKey) {
                                player.toggleWebFullscreen();
                                event.stopImmediatePropagation();
                                _this22._clickTimer.clear();
                            }
                        });
                        this._el.addEventListener('wheel', function (event) {
                            if (player.isFullscreen() || player.isWebFullscreen()) {
                                var delta = event.wheelDelta || event.detail || event.deltaY && -event.deltaY;
                                player.adjustVolume(delta > 0 ? 0.05 : -0.05);
                            }
                        });

                        initEvents.apply(this);
                    };
                });
            }
        }]);

        return MouseShortcutsPatch;
    }(Patch);

    var ShortcutsPatch = function (_Patch13) {
        _inherits(ShortcutsPatch, _Patch13);

        function ShortcutsPatch() {
            _classCallCheck(this, ShortcutsPatch);

            return _possibleConstructorReturn(this, (ShortcutsPatch.__proto__ || Object.getPrototypeOf(ShortcutsPatch)).call(this));
        }

        _createClass(ShortcutsPatch, [{
            key: '_apply',
            value: function _apply() {
                new KeyShortcutsPatch().install();
                Logger.log('添加键盘快捷键');
                new MouseShortcutsPatch().install();
                Logger.log('添加鼠标快捷键');
            }
        }]);

        return ShortcutsPatch;
    }(Patch);

    var TVBH5Patch = function (_Patch14) {
        _inherits(TVBH5Patch, _Patch14);

        function TVBH5Patch() {
            _classCallCheck(this, TVBH5Patch);

            return _possibleConstructorReturn(this, (TVBH5Patch.__proto__ || Object.getPrototypeOf(TVBH5Patch)).call(this));
        }

        _createClass(TVBH5Patch, [{
            key: '_apply',
            value: function _apply() {
                Hooker.hookGlobalVariable('PageConfig', function (cfg) {
                    Object.defineProperty(cfg, 'production', { get: function get() {
                            return '';
                        } });
                });
                Logger.log('H5-player has been enabled at TVB\'s videos.');
            }
        }]);

        return TVBH5Patch;
    }(Patch);

    // class H5Patch extends Patch {

    // constructor() {
    // super();
    // }

    // _apply() {
    // Hooker.hookDefine('page/find/play/player/load', this._forceH5.bind(this));
    // }

    // _forceH5(code) {
    // return code.replace(/(if\s*\().*?(\)\s*\{)/, '$1true$2').replace('window.sessionStorage', 'null');
    // }

    // }

    function ensureH5PlayerEnabled() {
        // (new H5Patch()).install();
        Object.defineProperty(unsafeWindow.navigator, 'plugins', { get: function get() {
                return {};
            } });
        Logger.log('启用html5播放器');
    }

    function mockAds() {
        new MockAdsPatch().install();
        Logger.log('和谐广告');
    }

    function invalidateWatermarks() {
        new WatermarksPatch().install();
        Logger.log('和谐水印');
    }

    function invalidateQualityLimitation() {
        new VipPatch().install();
        Logger.log('解除会员画质限制');
    }

    function improveQualityLogic() {
        new QualityPatch().install();
        Logger.log('改善画质逻辑');
    }

    function improveAutoHide() {
        new DashboardPatch().install();
        new TopAreaPatch().install();
        new SettingSeriesPatch().install();
        Logger.log('改善控件与光标自动隐藏');
    }

    function improveShortcuts() {
        new ShortcutsPatch().install();
    }

    function enableH5ForTVB() {
        new TVBH5Patch().install();
    }

    //=============================================================================

    ensureH5PlayerEnabled();
    mockAds();
    invalidateWatermarks();
    invalidateQualityLimitation();
    improveQualityLogic();
    improveAutoHide();
    improveShortcuts();
    enableH5ForTVB();
})();
