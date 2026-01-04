// ==UserScript==
// @name             自动聚焦第一个输入框，可自定义快捷键
// @name:en          auto focus on first <input>
// @namespace        @Vinsea
// @version          1.0.0
// @description      进页面聚焦到第一个搜索框中，默认使用ctrl+q可手动触发，可自定义快捷键
// @description:en   auto foucs on first input box
// @author           Vinsea
// @match            *
// @match            http*://*/*
// @run-at           document-idle
// @grant            GM.registerMenuCommand
// @grant            GM.setValue
// @grant            GM.getValue
// @grant            GM.listValues
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/444304/%E8%87%AA%E5%8A%A8%E8%81%9A%E7%84%A6%E7%AC%AC%E4%B8%80%E4%B8%AA%E8%BE%93%E5%85%A5%E6%A1%86%EF%BC%8C%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/444304/%E8%87%AA%E5%8A%A8%E8%81%9A%E7%84%A6%E7%AC%AC%E4%B8%80%E4%B8%AA%E8%BE%93%E5%85%A5%E6%A1%86%EF%BC%8C%E5%8F%AF%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function () {
    'use strict';

    var CONFIG = {
      preventScroll: '0',
      shortcut: ['ctrl', '', 'q']
    };

    var claz = function claz(val) {
      return "".concat(val, "__tampermonkey");
    };

    var addStyle = function addStyle(aCss) {
      var head = document.getElementsByTagName('head')[0];

      if (head) {
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = aCss;
        head.appendChild(style);
        return style;
      }

      return null;
    };

    var store = {
      set: function set(name, value) {
        GM.setValue(name, value);
      },
      get: function get(name) {
        return GM.getValue(name);
      }
    };
    var config = {
      set: function set(conf) {
        for (var _i = 0, _Object$entries = Object.entries(conf); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              k = _Object$entries$_i[0],
              v = _Object$entries$_i[1];

          CONFIG[k] = v;
          store.set(k, v);
        }
      },
      get: function get() {
        return CONFIG;
      }
    };

    var initConfig = function initConfig() {
      var configPromise = Object.keys(CONFIG).map(function (v) {
        return store.get(v);
      });
      return Promise.all(configPromise).then(function (r) {
        if (!r[0]) {
          for (var _i2 = 0, _Object$entries2 = Object.entries(CONFIG); _i2 < _Object$entries2.length; _i2++) {
            var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
                k = _Object$entries2$_i[0],
                v = _Object$entries2$_i[1];

            store.set(k, v);
          }
        } else {
          Object.keys(CONFIG).forEach(function (v, i) {
            CONFIG[v] = r[i];
          });
        }
      });
    };

    var bodyOverflow = document.body.style.overflow;

    var Dialog = /*#__PURE__*/function () {
      function Dialog(opt) {
        _classCallCheck(this, Dialog);

        this.option = Object.assign({
          header: '提示',
          content: '',
          okText: '确认',
          cancelText: '取消',
          onOk: function onOk() {
            return {};
          },
          onCancel: function onCancel() {
            return {};
          }
        }, opt);
        this.init();
      }

      _createClass(Dialog, [{
        key: "init",
        value: function init() {
          var _this = this;

          this.wrapper = document.createElement('div');
          this.wrapper.classList.add(claz('vv-dialog-wrapper'));
          var container = document.createElement('div');
          container.classList.add(claz('vv-dialog'));
          this.wrapper.appendChild(container);
          var header = document.createElement('div');
          header.classList.add(claz('vv-dialog-header'));
          header.textContent = this.option.header;
          container.appendChild(header);
          this.body = document.createElement('div');
          this.body.classList.add(claz('vv-dialog-body'));
          container.appendChild(this.body);

          if (this.option.content) {
            var text = document.createTextNode(this.option.content);
            this.body.appendChild(text);
          }

          this.tip = document.createElement('div');
          this.tip.classList.add(claz('vv-dialog-tip'));
          container.appendChild(this.tip);
          var footer = document.createElement('div');
          footer.classList.add(claz('vv-dialog-footer'));
          container.appendChild(footer);
          var cancel = document.createElement('button');
          cancel.textContent = this.option.cancelText;
          cancel.addEventListener('click', function () {
            _this.option.onCancel();

            _this.close();
          });
          footer.appendChild(cancel);
          var ok = document.createElement('button');
          ok.textContent = this.option.okText;
          ok.addEventListener('click', this.option.onOk);
          footer.appendChild(ok);
        }
      }, {
        key: "showTip",
        value: function showTip(text) {
          this.tip.style.display = 'block';
          this.tip.textContent = text;
        }
      }, {
        key: "hideTip",
        value: function hideTip() {
          this.tip.style.display = 'none';
        }
      }, {
        key: "open",
        value: function open() {
          document.body.style.overflow = 'hidden';
          document.body.appendChild(this.wrapper);
        }
      }, {
        key: "close",
        value: function close() {
          document.body.style.overflow = bodyOverflow;
          document.body.removeChild(this.wrapper);
          this.body = null;
          this.wrapper = null;
        }
      }]);

      return Dialog;
    }();

    var getTitle = function getTitle(text) {
      var p = document.createElement('p');
      p.classList.add(claz('vv-setting-title'));
      p.textContent = text;
      return p;
    };

    var Settings = /*#__PURE__*/function (_Dialog) {
      _inherits(Settings, _Dialog);

      var _super = _createSuper(Settings);

      function Settings() {
        var _this2;

        var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Settings);

        opt.header = '设置';

        opt.onCancel = function () {
          _this2.form = null;
        };

        opt.onOk = function () {
          var data = new FormData(_this2.form);
          var shortcut = [];

          var _iterator = _createForOfIteratorHelper(data),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var entry = _step.value;

              if (entry[0] === 'preventScroll') {
                config.set({
                  'preventScroll': entry[1]
                });
              } else {
                shortcut.push(entry[1]);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          if (shortcut[0] === shortcut[1]) {
            _this2.showTip('不能有重复键位');

            return;
          }

          config.set({
            'shortcut': shortcut
          });

          _this2.hideTip();

          _this2.close();
        };

        _this2 = _super.call(this, opt);

        _this2.initValue();

        _this2.initBody();

        return _this2;
      }

      _createClass(Settings, [{
        key: "initValue",
        value: function initValue() {
          var configTemp = config.get();
          this.preventScroll = configTemp.preventScroll;
          this.shortcut = configTemp.shortcut;
        }
      }, {
        key: "initBody",
        value: function initBody() {
          var _this3 = this;

          this.form = document.createElement('form');
          this.form.appendChild(getTitle('是否自动滚动到聚焦处'));
          var value = document.createElement('div');
          value.classList.add(claz('vv-setting-value'));
          this.form.appendChild(value);
          Object.values(['是', '否']).forEach(function (v, i) {
            var id = String(i);
            var input = document.createElement('input');
            input.type = 'radio';
            input.id = id;
            input.name = 'preventScroll';
            input.value = id;

            if (_this3.preventScroll === id) {
              input.setAttribute('checked', 'checked');
            }

            var label = document.createElement('label');
            label["for"] = input.id;
            label.textContent = v;
            value.appendChild(input);
            value.appendChild(label);
          });
          this.form.appendChild(getTitle('手动聚焦快捷键'));

          for (var index = 0; index < 2; index++) {
            var selectShortcut = document.createElement('select');
            selectShortcut.name = "shortcut".concat(index + 1);
            var data = ['ctrl', 'alt', 'shift'];
            data = index === 1 ? [''].concat(_toConsumableArray(data)) : data;

            var _iterator2 = _createForOfIteratorHelper(data),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var val = _step2.value;
                var option = document.createElement('option');
                option.value = val;
                option.textContent = val || '无';
                selectShortcut.appendChild(option);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            this.form.appendChild(selectShortcut);
          }

          var inputShortcut = document.createElement('input');
          inputShortcut.name = 'shortcut3';
          inputShortcut.setAttribute('readonly', 'readonly');
          inputShortcut.value = this.shortcut[2];
          this.form.appendChild(inputShortcut);
          inputShortcut.addEventListener('keydown', function (e) {
            if (/^[a-zA-Z]+$/.test(e.key)) {
              inputShortcut.value = e.key.toLowerCase();
            }
          });
          this.body.appendChild(this.form);
        }
      }]);

      return Settings;
    }(Dialog);
    /**
     * init styles
     * @returns {undefined}
     */


    function initStyle() {
      addStyle("\n.".concat(claz('vv-dialog-wrapper'), " {\n    position: fixed;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    z-index: 2000;\n    background-color: rgba(0,0,0,0.6);\n}\n.").concat(claz('vv-dialog'), " {\n    width: 500px;\n    position: absolute;\n    right: 20px;\n    top: 100px;\n    background-color: #fff;\n    border-radius: 8px;\n    box-shadow: 0 0 10px 0 rgb(0 0 0 / 20%);\n    box-sizing: border-box;\n}\n.").concat(claz('vv-dialog-header'), " {\n    padding: 10px 24px;\n    font-size: 16px;\n    color: #333;\n    line-height: 30px;\n    font-weight: bold;\n    border-bottom: 1px solid #e9e9e9;\n}\n.").concat(claz('vv-dialog-body'), " {\n    padding: 24px;\n    font-size: 14px;\n    color: #333;\n}\n.").concat(claz('vv-dialog-body'), " form select{\n    margin-right: 10px;\n}\n.").concat(claz('vv-dialog-tip'), " {\n    font-size: 14px;\n    color: #f73131;\n    line-height: 20px;\n    padding: 0 0 10px 24px;\n}\n.").concat(claz('vv-dialog-footer'), " {\n    border-top: 1px solid #e9e9e9;\n    padding: 10px 24px;\n    text-align: center;\n}\n.").concat(claz('vv-dialog-footer'), " button {\n    color: #fff;\n    line-height: 30px;\n    border: none;\n    border-radius: 5px;\n    padding: 0 20px;\n    margin: 0 5px;\n    cursor: pointer;\n    background-color: #5aadf9;\n    box-sizing: border-box;\n    transition: background-color 0.3s;\n}\n.").concat(claz('vv-dialog-footer'), " button:hover {\n    background-color: #349bfa;\n}\n.").concat(claz('vv-dialog-footer'), " button:first-child {\n    color: #333;\n    border-color: #fff;\n    background-color: #fff;\n}\n.").concat(claz('vv-setting-title'), " {\n    margin: 10px 0 5px;\n}\n"));
    }
    /**
     * focus
     * @returns {undefined}
     */


    function doFocus() {
      var preventScroll = config.get().preventScroll === '0';
      var firstInput = document.querySelector('input:not([type=hidden])');

      if (firstInput) {
        var val = firstInput.value;
        firstInput.value = '';
        firstInput.focus({
          preventScroll: preventScroll
        });
        firstInput.value = val;
      }
    }
    /**
     * init events
     * @returns {undefined}
     */


    function initEvents() {
      GM.registerMenuCommand('设置', function () {
        var settings = new Settings();
        settings.open();
      });
      document.addEventListener('keydown', function (e) {
        var _config$get$shortcut = _slicedToArray(config.get().shortcut, 3),
            key1 = _config$get$shortcut[0],
            key2 = _config$get$shortcut[1],
            key3 = _config$get$shortcut[2];

        var hasKey2 = key2 ? e["".concat(key2, "Key")] : true;

        if (e["".concat(key1, "Key")] && hasKey2 && e.key.toLowerCase() === key3) {
          doFocus();
        }
      });
    }
    /**
     * entry
     * @returns {undefined}
     */


    function load() {
      doFocus();
      initConfig();
      initStyle();
      initEvents();
    }

    if (document.readyState === 'loading') {
      var init = function init() {
        load();
        document.removeEventListener('DOMContentLoaded', init);
      };

      document.addEventListener('DOMContentLoaded', init);
    } else {
      load();
    }
})();
