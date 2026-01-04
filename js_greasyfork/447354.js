// ==UserScript==
// @name                Idealista Enhancer
// @description         Just some information for idealista.com
// @version             0.2.21
// @author              Midefos
// @namespace           https://git.midefos.com/midefos
// @match               https://www.idealista.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447354/Idealista%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/447354/Idealista%20Enhancer.meta.js
// ==/UserScript==

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _App = _interopRequireDefault(require("./src/App.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function init() {
  _App["default"].init();
}
init();

},{"./src/App.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Preferences = _interopRequireDefault(require("./Preferences.js"));
var _Styles = _interopRequireDefault(require("./Styles.js"));
var _Menu = _interopRequireDefault(require("./Menu.js"));
var _Configuration = _interopRequireDefault(require("./Configuration.js"));
var _Information = _interopRequireDefault(require("./Information.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var App = /*#__PURE__*/function () {
  function App() {
    _classCallCheck(this, App);
  }
  _createClass(App, null, [{
    key: "init",
    value: function init() {
      _Preferences["default"].init();
      _Styles["default"].add(_Styles["default"].APP_STYLES, 'midefos-idealista-app-styles');
      new _Menu["default"]();
      new _Configuration["default"]();
      _Information["default"].create();
    }
  }]);
  return App;
}();
exports["default"] = App;

},{"./Configuration.js":5,"./Information.js":11,"./Menu.js":18,"./Preferences.js":20,"./Styles.js":22}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var ButtonClass = /*#__PURE__*/_createClass(function ButtonClass() {
  _classCallCheck(this, ButtonClass);
});
exports["default"] = ButtonClass;
_defineProperty(ButtonClass, "IDEALISTA_BUTTON_CLASS", 'btn regular smaller');

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Log = _interopRequireDefault(require("./Log.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var CheckboxHTML = /*#__PURE__*/function () {
  function CheckboxHTML() {
    _classCallCheck(this, CheckboxHTML);
  }
  _createClass(CheckboxHTML, null, [{
    key: "create",
    value: function create(id, value) {
      var inputElement = document.createElement('input');
      if (value) {
        _Log["default"].debug("Creating checkbox ".concat(id, ", value: ").concat(value));
        inputElement.setAttribute('checked', true);
      }
      inputElement.id = id;
      inputElement.type = 'checkbox';
      return inputElement.outerHTML;
    }
  }]);
  return CheckboxHTML;
}();
exports["default"] = CheckboxHTML;

},{"./Log.js":17}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ConfigurationHTML = _interopRequireDefault(require("./ConfigurationHTML.js"));
var _DarkMode = _interopRequireDefault(require("./DarkMode.js"));
var _EnlargeImages = _interopRequireDefault(require("./EnlargeImages.js"));
var _Event = _interopRequireDefault(require("./Event.js"));
var _Information = _interopRequireDefault(require("./Information.js"));
var _Log = _interopRequireDefault(require("./Log.js"));
var _Preferences = _interopRequireDefault(require("./Preferences.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Configuration = /*#__PURE__*/function () {
  function Configuration() {
    _classCallCheck(this, Configuration);
    document.querySelector('#main-header').innerHTML += _ConfigurationHTML["default"].create();
    this._bindEvents();
    this._init();
  }
  _createClass(Configuration, [{
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this = this;
      _Event["default"].click(_ConfigurationHTML["default"].SAVE_CONFIG_SELECTOR, function () {
        _Preferences["default"].save(_this._extractConfiguration());
        _Information["default"].create();
        Configuration.toggle();
        Configuration.update();
      });
      _Event["default"].change('#max-price-per-meter', function (element) {
        var pricePerMeter = element.value;
        _this._updateItemMeterPrices(pricePerMeter);
      });
    }
  }, {
    key: "_init",
    value: function _init() {
      var maxPricePerMeter = document.querySelector('#max-price-per-meter');
      this._updateItemMeterPrices(maxPricePerMeter.value);
      Configuration.update();
    }
  }, {
    key: "_updateItemMeterPrices",
    value: function _updateItemMeterPrices(pricePerMeter) {
      if (!pricePerMeter) return;
      document.querySelector('#fiftyMetersPrice').textContent = pricePerMeter * 50;
      document.querySelector('#seventyFiveMetersPrice').textContent = pricePerMeter * 75;
      document.querySelector('#hundredMetersPrice').textContent = pricePerMeter * 100;
    }
  }, {
    key: "_extractConfiguration",
    value: function _extractConfiguration() {
      var container = document.querySelector(_ConfigurationHTML["default"].CONTAINER_SELECTOR);
      return {
        enabled: container.querySelector('#enabled').checked,
        darkMode: container.querySelector('#darkMode').checked,
        enlargeImages: container.querySelector('#enlargeImages').checked,
        currentMoney: container.querySelector('#currentMoney').value,
        'max-price': container.querySelector('#max-price').value,
        'max-price-per-meter': container.querySelector('#max-price-per-meter').value,
        percentages: container.querySelector('#percentages').checked,
        percentages_20: container.querySelector('#percentages_20').checked,
        percentages_30: container.querySelector('#percentages_30').checked,
        percentages_50: container.querySelector('#percentages_50').checked,
        garage: container.querySelector('#garage').checked,
        exterior: container.querySelector('#exterior').checked,
        lift: container.querySelector('#lift').checked,
        bus: container.querySelector('#bus').checked,
        train: container.querySelector('#train').checked,
        supermarket: container.querySelector('#supermarket').checked,
        smoke: container.querySelector('#smoke').checked,
        pharmacy: container.querySelector('#pharmacy').checked,
        gym: container.querySelector('#gym').checked,
        pool: container.querySelector('#pool').checked
      };
    }
  }], [{
    key: "toggle",
    value: function toggle() {
      var container = document.querySelector(_ConfigurationHTML["default"].CONTAINER_SELECTOR);
      if (getComputedStyle(container).display === 'none') {
        container.style.display = 'block';
        _Log["default"].debug("Opened configuration");
      } else {
        container.style.display = 'none';
        _Log["default"].debug("Closed configuration");
      }
    }
  }, {
    key: "update",
    value: function update() {
      _DarkMode["default"].apply();
      _EnlargeImages["default"].apply();
    }
  }]);
  return Configuration;
}();
exports["default"] = Configuration;

},{"./ConfigurationHTML.js":6,"./DarkMode.js":7,"./EnlargeImages.js":8,"./Event.js":9,"./Information.js":11,"./Log.js":17,"./Preferences.js":20}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ButtonClass = _interopRequireDefault(require("./ButtonClass.js"));
var _CheckboxHTML = _interopRequireDefault(require("./CheckboxHTML.js"));
var _Preferences = _interopRequireDefault(require("./Preferences.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var ConfigurationHTML = /*#__PURE__*/function () {
  function ConfigurationHTML() {
    _classCallCheck(this, ConfigurationHTML);
  }
  _createClass(ConfigurationHTML, null, [{
    key: "CONTAINER_SELECTOR",
    get: function get() {
      return ".".concat(this.CONTAINER_CLASS_NAME);
    }
  }, {
    key: "OPEN_CONFIG_SELECTOR",
    get: function get() {
      return ".".concat(this.OPEN_CONFIG_CLASS_NAME);
    }
  }, {
    key: "SAVE_CONFIG_SELECTOR",
    get: function get() {
      return ".".concat(this.SAVE_CONFIG_CLASS_NAME);
    }
  }, {
    key: "create",
    value: function create() {
      return "\n        <div class='".concat(this.CONTAINER_CLASS_NAME, "'>\n            <h2>Midefos Idealista</h2>\n    \n            <div class='midefos-idealista-card'>\n                <h3>Configuraci\xF3n global</h3>\n                <label>\n                    ").concat(_CheckboxHTML["default"].create('enabled', _Preferences["default"].get('enabled')), "\n                    <span>Habilitado</span>\n                </label>\n\n                <label>\n                    ").concat(_CheckboxHTML["default"].create('darkMode', _Preferences["default"].get('darkMode')), "\n                    <span>Modo oscuro</span>\n                </label>\n\n                <label>\n                    ").concat(_CheckboxHTML["default"].create('enlargeImages', _Preferences["default"].get('enlargeImages')), "\n                    <span>Modo imagen grande</span>\n            </label>\n\n            </div>\n            \n            <div class='midefos-idealista-card'>\n                <h3>Precios</h3>\n                <label>\n                    <span>Dinero actual: </span>\n                    <input type='number' id='currentMoney' value='").concat(_Preferences["default"].get('currentMoney'), "' placeholder='0'>\n                </label>\n        \n        \n                <label>\n                    <span>Precio m\xE1ximo: </span>\n                    <input type='number' id='max-price' value='").concat(_Preferences["default"].get('max-price'), "' placeholder='0'>\n                </label>\n        \n                <label>\n                    <span>Precio m\xE1ximo por metro: </span>\n                    <input type='number' id='max-price-per-meter' value='").concat(_Preferences["default"].get('max-price-per-meter'), "' placeholder='0'>\n                </label>\n\n\n                <ul>\n                    <li><strong>50 metros: </strong><span id='fiftyMetersPrice'>150000</span></li>\n                    <li><strong>75 metros: </strong><span id='seventyFiveMetersPrice'>150000</span></li>\n                    <li><strong>100 metros: </strong><span id='hundredMetersPrice'> 150000 </span></li>\n                </ul>\n\n                <label>\n                    ").concat(_CheckboxHTML["default"].create('percentages', _Preferences["default"].get('percentages')), "\n                    <span>Calcular porcentajes</span>\n                </label>\n                \n                <label>\n                    ").concat(_CheckboxHTML["default"].create('percentages_20', _Preferences["default"].get('percentages_20')), "\n                    <span>20%</span>\n                </label>\n                \n                <label>\n                    ").concat(_CheckboxHTML["default"].create('percentages_30', _Preferences["default"].get('percentages_30')), "\n                    <span>30%</span>\n                </label>\n                \n                <label>\n                    ").concat(_CheckboxHTML["default"].create('percentages_50', _Preferences["default"].get('percentages_50')), "\n                    <span>50%</span>\n                </label>\n            </div>\n            \n            <div class='midefos-idealista-card'>\n                <h3>Dispone de:</h3>\n                <label>\n                    ").concat(_CheckboxHTML["default"].create('garage', _Preferences["default"].get('garage')), "\n                    <span>Garaje</span>\n                </label>\n        \n                <label>\n                    ").concat(_CheckboxHTML["default"].create('exterior', _Preferences["default"].get('exterior')), "\n                    <span>Exterior</span>\n                </label>\n        \n                <label>\n                    ").concat(_CheckboxHTML["default"].create('lift', _Preferences["default"].get('lift')), "\n                    <span>Ascensor</span>\n                </label>\n            </div>\n\n            <div class='midefos-idealista-card'>\n                <h3>Lugar dispone de:</h3>\n                \n                <h4>Transporte p\xFAblico:</h4>\n                <label>\n                    ").concat(_CheckboxHTML["default"].create('bus', _Preferences["default"].get('bus')), "\n                    <span>Bus</span>\n                </label>\n\n                <label>\n                    ").concat(_CheckboxHTML["default"].create('train', _Preferences["default"].get('train')), "\n                    <span>Tren</span>\n                </label>\n\n                <h4>Comercio:</h4>\n                <label>\n                    ").concat(_CheckboxHTML["default"].create('supermarket', _Preferences["default"].get('supermarket')), "\n                    <span>Supermercado</span>\n                </label>\n\n                <label>\n                    ").concat(_CheckboxHTML["default"].create('smoke', _Preferences["default"].get('smoke')), "\n                    <span>Estanco</span>\n                </label>\n\n                <label>\n                    ").concat(_CheckboxHTML["default"].create('pharmacy', _Preferences["default"].get('pharmacy')), "\n                    <span>Farmacia</span>\n                </label>\n\n                <h4>Deporte:</h4>\n                <label>\n                    ").concat(_CheckboxHTML["default"].create('gym', _Preferences["default"].get('gym')), "\n                    <span>Gimnasio</span>\n                </label>\n\n                <label>\n                    ").concat(_CheckboxHTML["default"].create('pool', _Preferences["default"].get('pool')), "\n                    <span>Piscina</span>\n                </label>\n            </div>\n            \n            <div>\n                <button class='").concat(_ButtonClass["default"].IDEALISTA_BUTTON_CLASS, " ").concat(this.SAVE_CONFIG_CLASS_NAME, "'>Guardar</button>\n                <button class='").concat(_ButtonClass["default"].IDEALISTA_BUTTON_CLASS, " ").concat(this.OPEN_CONFIG_CLASS_NAME, "'>Cerrar</button>\n            </div>\n        </div>");
    }
  }]);
  return ConfigurationHTML;
}();
exports["default"] = ConfigurationHTML;
_defineProperty(ConfigurationHTML, "CONTAINER_CLASS_NAME", 'midefos-idealista-config');
_defineProperty(ConfigurationHTML, "OPEN_CONFIG_CLASS_NAME", 'open-config');
_defineProperty(ConfigurationHTML, "SAVE_CONFIG_CLASS_NAME", 'save-config');

},{"./ButtonClass.js":3,"./CheckboxHTML.js":4,"./Preferences.js":20}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Preferences = _interopRequireDefault(require("./Preferences.js"));
var _Styles = _interopRequireDefault(require("./Styles.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var DarkMode = /*#__PURE__*/function () {
  function DarkMode() {
    _classCallCheck(this, DarkMode);
  }
  _createClass(DarkMode, null, [{
    key: "apply",
    value: function apply() {
      if (_Preferences["default"].get('darkMode')) {
        this._addDarkMode();
      } else {
        _Styles["default"].remove(this.STYLES_KEY);
      }
    }
  }, {
    key: "_addDarkMode",
    value: function _addDarkMode() {
      _Styles["default"].add(_Styles["default"].DARK_MODE, this.STYLES_KEY);
    }
  }]);
  return DarkMode;
}();
exports["default"] = DarkMode;
_defineProperty(DarkMode, "STYLES_KEY", 'midefos-idealista-dark-mode');

},{"./Preferences.js":20,"./Styles.js":22}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Preferences = _interopRequireDefault(require("./Preferences.js"));
var _Styles = _interopRequireDefault(require("./Styles.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var EnlargeImages = /*#__PURE__*/function () {
  function EnlargeImages() {
    _classCallCheck(this, EnlargeImages);
  }
  _createClass(EnlargeImages, null, [{
    key: "apply",
    value: function apply() {
      if (_Preferences["default"].get('enlargeImages')) {
        this._addEnlargeImages();
      } else {
        _Styles["default"].remove(this.STYLES_KEY);
      }
    }
  }, {
    key: "_addEnlargeImages",
    value: function _addEnlargeImages() {
      _Styles["default"].add(_Styles["default"].ENLARGE_IMAGES, this.STYLES_KEY);
    }
  }]);
  return EnlargeImages;
}();
exports["default"] = EnlargeImages;
_defineProperty(EnlargeImages, "STYLES_KEY", 'midefos-idealista-enlarge-images');

},{"./Preferences.js":20,"./Styles.js":22}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Log = _interopRequireDefault(require("./Log.js"));
var _StringUtil = _interopRequireDefault(require("./StringUtil.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Event = /*#__PURE__*/function () {
  function Event() {
    _classCallCheck(this, Event);
  }
  _createClass(Event, null, [{
    key: "click",
    value: function click(selector, callback) {
      this._addEvent('click', selector, callback);
    }
  }, {
    key: "change",
    value: function change(selector, callback) {
      this._addEvent('change', selector, callback);
    }
  }, {
    key: "_addEvent",
    value: function _addEvent(eventName, selector, callback) {
      _Log["default"].debug("Adding event: ".concat(eventName, " to: ").concat(selector));
      document.addEventListener(eventName, function (event) {
        if (!event.target.matches(selector)) return;
        _Log["default"].debug("".concat(_StringUtil["default"].capitalizeFirstLetter(eventName), " on: ").concat(selector));
        callback(event.target);
      });
    }
  }]);
  return Event;
}();
exports["default"] = Event;

},{"./Log.js":17,"./StringUtil.js":21}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var IconSvg = /*#__PURE__*/_createClass(function IconSvg() {
  _classCallCheck(this, IconSvg);
});
exports["default"] = IconSvg;
_defineProperty(IconSvg, "TICK", "<svg style=\"color: rgb(51, 209, 122);\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"16\" zoomAndPan=\"magnify\" viewBox=\"0 0 30 30.000001\" preserveAspectRatio=\"xMidYMid meet\" version=\"1.0\"><defs><clipPath id=\"id1\"><path d=\"M 2.328125 4.222656 L 27.734375 4.222656 L 27.734375 24.542969 L 2.328125 24.542969 Z M 2.328125 4.222656 \" clip-rule=\"nonzero\" fill=\"#33d17a\"></path></clipPath></defs><g clip-path=\"url(#id1)\"><path fill=\"#33d17a\" d=\"M 27.5 7.53125 L 24.464844 4.542969 C 24.15625 4.238281 23.65625 4.238281 23.347656 4.542969 L 11.035156 16.667969 L 6.824219 12.523438 C 6.527344 12.230469 6 12.230469 5.703125 12.523438 L 2.640625 15.539062 C 2.332031 15.84375 2.332031 16.335938 2.640625 16.640625 L 10.445312 24.324219 C 10.59375 24.472656 10.796875 24.554688 11.007812 24.554688 C 11.214844 24.554688 11.417969 24.472656 11.566406 24.324219 L 27.5 8.632812 C 27.648438 8.488281 27.734375 8.289062 27.734375 8.082031 C 27.734375 7.875 27.648438 7.679688 27.5 7.53125 Z M 27.5 7.53125 \" fill-opacity=\"1\" fill-rule=\"nonzero\"></path></g></svg>");

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Item = _interopRequireDefault(require("./Item.js"));
var _Log = _interopRequireDefault(require("./Log.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Information = /*#__PURE__*/function () {
  function Information() {
    _classCallCheck(this, Information);
  }
  _createClass(Information, null, [{
    key: "create",
    value: function create() {
      var items = document.querySelectorAll(this.ITEM_SELECTOR);
      _Log["default"].debug("Creating information for ".concat(items.length, " items..."));
      var _iterator = _createForOfIteratorHelper(items),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var itemNode = _step.value;
          var item = new _Item["default"](itemNode);
          item.extractAsyncData();
          item.refreshData();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);
  return Information;
}();
exports["default"] = Information;
_defineProperty(Information, "CLASS_NAME", 'midefos-idealista-container');
_defineProperty(Information, "ITEM_SELECTOR", 'article.item');

},{"./Item.js":12,"./Log.js":17}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ItemHTML = _interopRequireDefault(require("./ItemHTML.js"));
var _Locations = _interopRequireDefault(require("./Locations.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Item = /*#__PURE__*/function () {
  function Item(htmlNode) {
    _classCallCheck(this, Item);
    this._node = htmlNode;
    this.name = this._extractName();
    this.description = this._extractDescription();
    this.locationName = this._extractLocationName();
    this.price = this._extractPrice();
    this.meters = this._extractMeters();
    this.priceMeter = this._extractPriceMeter();
    this.additionalInfo = this._extractAdditionalInfo();
    this.hasGarage = this._extractGarage();
    this.hasLift = this._extractLift();
    this.isNoLift = this._extractIsNoLift();
    this.isExterior = this._extractExterior();
    this.isInterior = this._extractInterior();
  }
  _createClass(Item, [{
    key: "_data",
    get: function get() {
      return this._node.nextElementSibling;
    }
  }, {
    key: "extractAsyncData",
    value: function () {
      var _extractAsyncData = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this._extractLocation();
            case 2:
              this.location = _context.sent;
              this.refreshData();
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function extractAsyncData() {
        return _extractAsyncData.apply(this, arguments);
      }
      return extractAsyncData;
    }()
  }, {
    key: "refreshData",
    value: function refreshData() {
      this.removeData();
      this.addData();
    }
  }, {
    key: "isDataRendered",
    value: function isDataRendered() {
      var nextElement = this._data;
      return nextElement.className && nextElement.className.includes(_ItemHTML["default"].CONTAINER_CLASS_NAME);
    }
  }, {
    key: "isProperPrice",
    value: function isProperPrice(price) {
      return this.price <= price;
    }
  }, {
    key: "isProperPriceMeter",
    value: function isProperPriceMeter(priceMeter) {
      return this.priceMeter <= priceMeter;
    }
  }, {
    key: "removeData",
    value: function removeData() {
      if (!this.isDataRendered()) return;
      this._data.remove();
    }
  }, {
    key: "addData",
    value: function addData() {
      this._node.insertAdjacentHTML('afterend', _ItemHTML["default"].createInformation(this));
    }
  }, {
    key: "isFlat",
    value: function isFlat() {
      return this._nameIncludes('Piso');
    }
  }, {
    key: "isHouse",
    value: function isHouse() {
      return this._nameIncludes('Casa') || this._nameIncludes('Chalet') || this._nameIncludes('Finca');
    }

    // TODO: This may be included in isFlat.
  }, {
    key: "isGround",
    value: function isGround() {
      return this._nameIncludes('Bajo');
    }
  }, {
    key: "_nameIncludes",
    value: function _nameIncludes(name) {
      return this.name.toLowerCase().includes(name.toLowerCase());
    }
  }, {
    key: "_descriptionIncludes",
    value: function _descriptionIncludes(description) {
      return this.description.toLowerCase().includes(description.toLowerCase());
    }
  }, {
    key: "_extractName",
    value: function _extractName() {
      return this._node.querySelector(Item.NAME_SELECTOR).textContent;
    }
  }, {
    key: "_extractDescription",
    value: function _extractDescription() {
      return this._node.querySelector(Item.DESCRIPTION_SELECTOR).textContent;
    }
  }, {
    key: "_extractLocationName",
    value: function _extractLocationName() {
      if (this.name.lastIndexOf(',') != -1) {
        return this.name.substring(this.name.lastIndexOf(','), this.name.length).replaceAll('\n', '').replaceAll('.', '').replaceAll(',', '').replaceAll(' ', '');
      }
      return this.name.substring(this.name.lastIndexOf(' en ') + ' en '.length, this.name.length).replaceAll('\n', '').replaceAll('.', '').replaceAll(' ', '');
    }
  }, {
    key: "_extractLocation",
    value: function () {
      var _extractLocation2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", _Locations["default"].get(this.locationName));
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function _extractLocation() {
        return _extractLocation2.apply(this, arguments);
      }
      return _extractLocation;
    }()
  }, {
    key: "_extractPrice",
    value: function _extractPrice() {
      var priceText = this._node.querySelector(Item.PRICE_SELECTOR).textContent;
      return Number(priceText.replace('€', '').replaceAll('.', '').replaceAll(',', ''));
    }
  }, {
    key: "_extractMeters",
    value: function _extractMeters() {
      var metersNode = this._node.querySelector(Item.METERS_SELECTOR);
      var metersText;
      if (!metersNode || !metersNode.textContent.includes('m²')) {
        metersText = this._node.querySelector(Item.ROOM_SELECTOR).textContent;
      } else {
        metersText = metersNode.textContent;
      }
      return Number(metersText.replace('m²', '').replaceAll('.', ''));
    }
  }, {
    key: "_extractPriceMeter",
    value: function _extractPriceMeter() {
      return Math.round(this.price / this.meters);
    }
  }, {
    key: "_extractAdditionalInfo",
    value: function _extractAdditionalInfo() {
      var additionalInfo = this._node.querySelector(Item.ADDITIONAL_INFORMATION_SELECTOR);
      if (!additionalInfo) {
        additionalInfo = this._node.querySelector(Item.METERS_SELECTOR);
      }
      if (!additionalInfo) return null;
      return additionalInfo.textContent;
    }
  }, {
    key: "_extractLift",
    value: function _extractLift() {
      if (!this.additionalInfo) return false;
      return this.additionalInfo.includes('con ascensor');
    }
  }, {
    key: "_extractIsNoLift",
    value: function _extractIsNoLift() {
      if (!this.additionalInfo) return false;
      return this.additionalInfo.includes('sin ascensor');
    }
  }, {
    key: "_extractExterior",
    value: function _extractExterior() {
      var text = 'exterior';
      if (this.additionalInfo && this.additionalInfo.includes(text)) return true;
      if (this._descriptionIncludes(text)) return true;
      return false;
    }
  }, {
    key: "_extractInterior",
    value: function _extractInterior() {
      var text = 'interior';
      if (this.additionalInfo && this.additionalInfo.includes(text)) return true;
      if (this._descriptionIncludes(text)) return true;
      return false;
    }
  }, {
    key: "_extractGarage",
    value: function _extractGarage() {
      return this._node.querySelector(Item.GARAGE_SELECTOR) !== null;
    }
  }]);
  return Item;
}();
exports["default"] = Item;
_defineProperty(Item, "NAME_SELECTOR", '.item-link');
_defineProperty(Item, "DESCRIPTION_SELECTOR", '.item-description');
_defineProperty(Item, "PRICE_SELECTOR", '.item-price');
_defineProperty(Item, "GARAGE_SELECTOR", '.item-parking');
_defineProperty(Item, "ROOM_SELECTOR", '.item-detail-char .item-detail:nth-child(1)');
_defineProperty(Item, "METERS_SELECTOR", '.item-detail-char .item-detail:nth-child(2)');
_defineProperty(Item, "ADDITIONAL_INFORMATION_SELECTOR", '.item-detail-char .item-detail:nth-child(3)');

},{"./ItemHTML.js":13,"./Locations.js":16}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _IconSvg = _interopRequireDefault(require("./IconSvg.js"));
var _Preferences = _interopRequireDefault(require("./Preferences.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var ItemHTML = /*#__PURE__*/function () {
  function ItemHTML() {
    _classCallCheck(this, ItemHTML);
  }
  _createClass(ItemHTML, null, [{
    key: "CONTAINER_SELECTOR",
    get: function get() {
      return ".".concat(this.CONTAINER_CLASS_NAME);
    }
  }, {
    key: "INFORMATION_SELECTOR",
    get: function get() {
      return ".".concat(this.INFORMATION_CLASS_NAME);
    }
  }, {
    key: "ITEM_STATE_CLASS_NAME",
    value: function ITEM_STATE_CLASS_NAME(item) {
      var desiredPrice = _Preferences["default"].get('max-price');
      if (desiredPrice && !item.isProperPrice(desiredPrice)) {
        return this.ERROR_CLASS_NAME;
      }
      var desiredPricePerMeter = _Preferences["default"].get('max-price-per-meter');
      if (desiredPricePerMeter && !item.isProperPriceMeter(desiredPricePerMeter)) {
        return this.ERROR_CLASS_NAME;
      }
      if (this._shouldCheckGarage() && !item.hasGarage) {
        return this.ERROR_CLASS_NAME;
      }
      if (this._shouldCheckLift(item) && item.isNoLift) {
        return this.ERROR_CLASS_NAME;
      }
      if (this._shouldCheckExterior(item) && item.isInterior) {
        return this.ERROR_CLASS_NAME;
      }
      return this.SUCCESS_CLASS_NAME;
    }
  }, {
    key: "createInformation",
    value: function createInformation(item) {
      var html = "<div class='".concat(this.CONTAINER_CLASS_NAME, " ").concat(this.ITEM_STATE_CLASS_NAME(item), "'>");
      html += "<div class='".concat(this.INFORMATION_CONTAINER_CLASS_NAME, "'>");
      html += this._createPercentagesPriceHTML(item);
      html += this._createPriceHTML(item);
      html += this._createPriceMeterHTML(item);
      html += "</div>";
      html += "<div class='".concat(this.INFORMATION_CONTAINER_CLASS_NAME, "'>");
      html += this._createGarageHTML(item);
      html += this._createLiftHTML(item);
      html += this._createExteriorHTML(item);
      html += "</div>";
      html += "<div class='".concat(this.INFORMATION_CONTAINER_CLASS_NAME, "'>");
      html += this._createLocationName(item);
      if (item.location && !item.location.errorMessage) {
        html += this._createLocationTrain(item);
        html += this._createLocationBus(item);
        html += this._createLocationGym(item);
        html += this._createLocationPool(item);
        html += this._createLocationSupermarket(item);
        html += this._createLocationSmoke(item);
        html += this._createLocationPharmacy(item);
      } else if (item.location && item.location.errorMessage) {
        html += this._createError(item.location.errorMessage);
      } else {
        html += this._createNeutral("Cargando datos...");
      }
      html += "</div>";
      html += "</div>";
      return html;
    }
  }, {
    key: "_createPercentagesPriceHTML",
    value: function _createPercentagesPriceHTML(item) {
      if (!_Preferences["default"].get('percentages')) return "";
      var html = "<div class='".concat(this.INFORMATION_CLASS_NAME, "'>");
      if (_Preferences["default"].get('percentages_20')) {
        html += this._createPercentagePriceHTML(item, 20);
      }
      if (_Preferences["default"].get('percentages_30')) {
        html += this._createPercentagePriceHTML(item, 30);
      }
      if (_Preferences["default"].get('percentages_50')) {
        html += this._createPercentagePriceHTML(item, 50);
      }
      html += "</div>";
      return html;
    }
  }, {
    key: "_createPercentagePriceHTML",
    value: function _createPercentagePriceHTML(item, percent) {
      var calculation = Math.round(item.price * percent / 100);
      var currentMoney = _Preferences["default"].get('currentMoney');
      var percentText = "".concat(percent, "%");
      if (currentMoney === 0) {
        return this._createIndividual(percentText, calculation);
      }
      if (currentMoney >= calculation) {
        return this._createTextSuccess(percentText, calculation);
      }
      return this._createTextError(percentText, calculation);
    }
  }, {
    key: "_createPriceHTML",
    value: function _createPriceHTML(item) {
      var desiredPrice = _Preferences["default"].get('max-price');
      if (!desiredPrice) return "";
      var desiredTwentyFivePercentMore = Math.round(desiredPrice * 1.25);
      if (item.isProperPrice(desiredPrice)) {
        return this._createSuccess('Precio');
      } else if (item.isProperPrice(desiredTwentyFivePercentMore)) {
        return this._createWarning('Precio');
      }
      return this._createError('Precio');
    }
  }, {
    key: "_createPriceMeterHTML",
    value: function _createPriceMeterHTML(item) {
      var desiredPricePerMeter = _Preferences["default"].get('max-price-per-meter');
      if (!desiredPricePerMeter) return this._createIndividual('m²', item.priceMeter);
      var desiredTwentyFivePercentMore = Math.round(desiredPricePerMeter * 1.25);
      if (item.priceMeter <= desiredPricePerMeter) {
        return this._createTextSuccess('m²', item.priceMeter);
      } else if (item.priceMeter <= desiredTwentyFivePercentMore) {
        return this._createTextWarning('m²', item.priceMeter);
      }
      return this._createTextError('m²', item.priceMeter);
    }
  }, {
    key: "_createGarageHTML",
    value: function _createGarageHTML(item) {
      if (!this._shouldCheckGarage()) {
        return "";
      }
      if (item.hasGarage) {
        return this._createSuccess('Garaje');
      }
      return this._createError('Garaje');
    }
  }, {
    key: "_shouldCheckGarage",
    value: function _shouldCheckGarage() {
      return _Preferences["default"].get('garage');
    }
  }, {
    key: "_createLiftHTML",
    value: function _createLiftHTML(item) {
      if (!this._shouldCheckLift(item)) {
        return "";
      }
      if (item.isNoLift) {
        return this._createError('Ascensor');
      } else if (item.hasLift) {
        return this._createSuccess('Ascensor');
      }
      return this._createMissing('Ascensor');
    }
  }, {
    key: "_shouldCheckLift",
    value: function _shouldCheckLift(item) {
      return _Preferences["default"].get('lift') && !item.isHouse() && !item.isGround();
    }
  }, {
    key: "_createExteriorHTML",
    value: function _createExteriorHTML(item) {
      if (!this._shouldCheckExterior(item)) {
        return "";
      }
      if (item.isExterior) {
        return this._createSuccess('Exterior');
      }
      if (item.isInterior) {
        return this._createError('Exterior');
      }
      return this._createMissing('Exterior');
    }
  }, {
    key: "_createLocationName",
    value: function _createLocationName(item) {
      var _item$location, _item$location2;
      var html = "<div class='information'>";
      if ((_item$location = item.location) !== null && _item$location !== void 0 && _item$location.name) {
        html += this._createNeutral(item.location.name);
      } else {
        html += this._createNeutral(item.locationName);
      }
      if ((_item$location2 = item.location) !== null && _item$location2 !== void 0 && _item$location2.altitude) html += this._createIndividual('Altitud (m):', item.location.altitude);
      html += "</div>";
      return html;
    }
  }, {
    key: "_createLocationTrain",
    value: function _createLocationTrain(item) {
      var _item$location3;
      if (!_Preferences["default"].get('train')) return "";
      if ((_item$location3 = item.location) !== null && _item$location3 !== void 0 && _item$location3.train) {
        return this._createSuccess('Tren');
      }
      return this._createError('Tren');
    }
  }, {
    key: "_createLocationBus",
    value: function _createLocationBus(item) {
      var _item$location4;
      if (!_Preferences["default"].get('bus')) return "";
      if ((_item$location4 = item.location) !== null && _item$location4 !== void 0 && _item$location4.bus) {
        return this._createSuccess('Bus');
      }
      return this._createError('Bus');
    }
  }, {
    key: "_createLocationGym",
    value: function _createLocationGym(item) {
      var _item$location5;
      if (!_Preferences["default"].get('gym')) return "";
      if ((_item$location5 = item.location) !== null && _item$location5 !== void 0 && _item$location5.gym) {
        return this._createSuccess('Gimnasio');
      }
      return this._createError('Gimnasio');
    }
  }, {
    key: "_createLocationPool",
    value: function _createLocationPool(item) {
      var _item$location6;
      if (!_Preferences["default"].get('pool')) return "";
      if ((_item$location6 = item.location) !== null && _item$location6 !== void 0 && _item$location6.pool) {
        return this._createSuccess('Piscina');
      }
      return this._createError('Piscina');
    }
  }, {
    key: "_createLocationSupermarket",
    value: function _createLocationSupermarket(item) {
      var _item$location7;
      if (!_Preferences["default"].get('supermarket')) return "";
      var html = "<div>";
      if ((_item$location7 = item.location) !== null && _item$location7 !== void 0 && _item$location7.supermarkets.length) {
        html += this._createSuccess("".concat(item.location.supermarkets.length, " supermercados"));
      } else {
        html += this._createError('Supermercado');
      }
      html += "</div>";
      return html;
    }
  }, {
    key: "_createLocationSmoke",
    value: function _createLocationSmoke(item) {
      var _item$location8;
      if (!_Preferences["default"].get('smoke')) return "";
      if ((_item$location8 = item.location) !== null && _item$location8 !== void 0 && _item$location8.smoke) {
        return this._createSuccess('Estanco');
      }
      return this._createError('Estanco');
    }
  }, {
    key: "_createLocationPharmacy",
    value: function _createLocationPharmacy(item) {
      var _item$location9;
      if (!_Preferences["default"].get('pharmacy')) return "";
      if ((_item$location9 = item.location) !== null && _item$location9 !== void 0 && _item$location9.pharmacy) {
        return this._createSuccess('Farmacia');
      }
      return this._createError('Farmacia');
    }
  }, {
    key: "_shouldCheckExterior",
    value: function _shouldCheckExterior(item) {
      return _Preferences["default"].get('exterior') && !item.isHouse();
    }
  }, {
    key: "_createSuccess",
    value: function _createSuccess(infoText) {
      return this._createTextSuccess(_IconSvg["default"].TICK, infoText);
    }
  }, {
    key: "_createTextSuccess",
    value: function _createTextSuccess(strongText, infoText) {
      return this._createIndividual(strongText, infoText, this.SUCCESS_CLASS_NAME);
    }
  }, {
    key: "_createWarning",
    value: function _createWarning(infoText) {
      return this._createTextWarning('⚠️', infoText);
    }
  }, {
    key: "_createMissing",
    value: function _createMissing(infoText) {
      return this._createTextWarning('?', infoText);
    }
  }, {
    key: "_createTextWarning",
    value: function _createTextWarning(strongText, infoText) {
      return this._createIndividual(strongText, infoText, this.WARNING_CLASS_NAME);
    }
  }, {
    key: "_createError",
    value: function _createError(infoText) {
      return this._createTextError('🚫', infoText);
    }
  }, {
    key: "_createTextError",
    value: function _createTextError(strongText, infoText) {
      return this._createIndividual(strongText, infoText, this.ERROR_CLASS_NAME);
    }
  }, {
    key: "_createNeutral",
    value: function _createNeutral(infoText) {
      return this._createIndividual('ⓘ', infoText);
    }
  }, {
    key: "_createIndividual",
    value: function _createIndividual(strongText, infoText) {
      var className = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      return "<span class='".concat(className, "'><strong>").concat(strongText, "</strong> ").concat(infoText, "</span>");
    }
  }]);
  return ItemHTML;
}();
exports["default"] = ItemHTML;
_defineProperty(ItemHTML, "SUCCESS_CLASS_NAME", 'success');
_defineProperty(ItemHTML, "WARNING_CLASS_NAME", 'warning');
_defineProperty(ItemHTML, "ERROR_CLASS_NAME", 'error');
_defineProperty(ItemHTML, "CONTAINER_CLASS_NAME", 'midefos-idealista-container');
_defineProperty(ItemHTML, "INFORMATION_CONTAINER_CLASS_NAME", 'midefos-idealista-information-container');
_defineProperty(ItemHTML, "INFORMATION_CLASS_NAME", 'information');

},{"./IconSvg.js":10,"./Preferences.js":20}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Supermarket = _interopRequireDefault(require("./Supermarket.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Location = /*#__PURE__*/function () {
  function Location() {
    _classCallCheck(this, Location);
    _defineProperty(this, "name", void 0);
    _defineProperty(this, "altitude", void 0);
    _defineProperty(this, "train", void 0);
    _defineProperty(this, "bus", void 0);
    _defineProperty(this, "pool", void 0);
    _defineProperty(this, "gym", void 0);
    _defineProperty(this, "supermarkets", void 0);
    _defineProperty(this, "smoke", void 0);
  }
  _createClass(Location, null, [{
    key: "empty",
    value: function empty() {
      return this.fromRaw(null);
    }
  }, {
    key: "fromRaw",
    value: function fromRaw(raw) {
      var location = new Location();
      location.name = (raw === null || raw === void 0 ? void 0 : raw.name) || '';
      location.altitude = (raw === null || raw === void 0 ? void 0 : raw.altitude) || 0;
      location.train = (raw === null || raw === void 0 ? void 0 : raw.train) || false;
      location.bus = (raw === null || raw === void 0 ? void 0 : raw.bus) || true;
      location.gym = (raw === null || raw === void 0 ? void 0 : raw.gym) || false;
      location.pool = (raw === null || raw === void 0 ? void 0 : raw.pool) || false;
      location.pharmacy = (raw === null || raw === void 0 ? void 0 : raw.pharmacy) || true;
      location.smoke = (raw === null || raw === void 0 ? void 0 : raw.smoke) || false;
      location.supermarkets = [];
      if (raw.supermarkets) {
        var _iterator = _createForOfIteratorHelper(raw.supermarkets),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var rawSupermarket = _step.value;
            var supermarket = new _Supermarket["default"]();
            supermarket.name = rawSupermarket === null || rawSupermarket === void 0 ? void 0 : rawSupermarket.type;
            supermarket.url = rawSupermarket === null || rawSupermarket === void 0 ? void 0 : rawSupermarket.url;
            location.supermarkets.push(supermarket);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      return location;
    }
  }]);
  return Location;
}();
exports["default"] = Location;

},{"./Supermarket.js":23}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Log = _interopRequireDefault(require("./Log.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var LocationStorage = /*#__PURE__*/function () {
  function LocationStorage() {
    _classCallCheck(this, LocationStorage);
  }
  _createClass(LocationStorage, null, [{
    key: "storage",
    get: function get() {
      return window.localStorage;
    }
  }, {
    key: "data",
    get: function get() {
      if (!this._data) {
        this._init();
      }
      return JSON.parse(this._data);
    }
  }, {
    key: "_data",
    get: function get() {
      return this.storage.getItem(this.KEY);
    }
  }, {
    key: "get",
    value: function get(name) {
      var locations = this.data;
      return locations[name];
    }
  }, {
    key: "save",
    value: function save(location) {
      var locations = this.data;
      locations[location.name] = location;
      this._save(locations);
    }
  }, {
    key: "_init",
    value: function _init() {
      _Log["default"].debug("Init location storage");
      this._save({});
    }
  }, {
    key: "_save",
    value: function _save(data) {
      var json = JSON.stringify(data);
      this.storage.setItem(this.KEY, json);
    }
  }]);
  return LocationStorage;
}();
exports["default"] = LocationStorage;
_defineProperty(LocationStorage, "KEY", 'midefos-idealista-location-storage');

},{"./Log.js":17}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Location = _interopRequireDefault(require("./Location.js"));
var _LocationStorage = _interopRequireDefault(require("./LocationStorage.js"));
var _Log = _interopRequireDefault(require("./Log.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Locations = /*#__PURE__*/function () {
  function Locations() {
    _classCallCheck(this, Locations);
  }
  _createClass(Locations, null, [{
    key: "get",
    value: function () {
      var _get = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(name) {
        var storageLocation, response, data, errorLocation, location;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              storageLocation = _LocationStorage["default"].get(name);
              if (!storageLocation) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return", storageLocation);
            case 3:
              _context.next = 5;
              return fetch("https://main.midefos.com/api/town/".concat(name));
            case 5:
              response = _context.sent;
              _Log["default"].debug("Requested location '".concat(name, "'"));
              _context.next = 9;
              return response.json();
            case 9:
              data = _context.sent;
              if (data) {
                _context.next = 15;
                break;
              }
              _Log["default"].debug("Missing information for location: '".concat(name, "'"));
              errorLocation = {
                name: name,
                errorMessage: 'Datos no disponibles...'
              };
              _LocationStorage["default"].save(errorLocation);
              return _context.abrupt("return", errorLocation);
            case 15:
              location = _Location["default"].fromRaw(data);
              _LocationStorage["default"].save(location);
              return _context.abrupt("return", location);
            case 18:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      function get(_x) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }]);
  return Locations;
}();
exports["default"] = Locations;

},{"./Location.js":14,"./LocationStorage.js":15,"./Log.js":17}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Log = /*#__PURE__*/function () {
  function Log() {
    _classCallCheck(this, Log);
  }
  _createClass(Log, null, [{
    key: "debug",
    value: function debug(message) {
      console.log("%c [DEBUG] ".concat(message, " "), 'background: blue; color: white; font-size: 13px;');
    }
  }]);
  return Log;
}();
exports["default"] = Log;

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Configuration = _interopRequireDefault(require("./Configuration.js"));
var _ConfigurationHTML = _interopRequireDefault(require("./ConfigurationHTML.js"));
var _Event = _interopRequireDefault(require("./Event.js"));
var _Information = _interopRequireDefault(require("./Information.js"));
var _MenuHTML = _interopRequireDefault(require("./MenuHTML.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Menu = /*#__PURE__*/function () {
  function Menu() {
    _classCallCheck(this, Menu);
    if (this._shouldNotLoad()) return;
    this._createMenu();
    this._initEvents();
  }
  _createClass(Menu, [{
    key: "_createMenu",
    value: function _createMenu() {
      var listNode = document.querySelector(Menu.LIST_SELECTOR);
      if (listNode) {
        listNode.innerHTML = _MenuHTML["default"].create() + listNode.innerHTML;
      } else {
        this._createSimpleMenu();
      }
    }
  }, {
    key: "_createSimpleMenu",
    value: function _createSimpleMenu() {
      var locationNode = document.querySelector(Menu.OTHER_LOCATIONS_SELECTORS);
      if (locationNode) {
        locationNode.innerHTML = _MenuHTML["default"].createSimple() + locationNode.innerHTML;
      }
    }
  }, {
    key: "_initEvents",
    value: function _initEvents() {
      _Event["default"].click(_MenuHTML["default"].RELOAD_INFORMATION_SELECTOR, function () {
        _Information["default"].create();
      });
      _Event["default"].click(_ConfigurationHTML["default"].OPEN_CONFIG_SELECTOR, function () {
        _Configuration["default"].toggle();
      });
    }
  }, {
    key: "_shouldNotLoad",
    value: function _shouldNotLoad() {
      return window.location.href.includes('mapa-google');
    }
  }]);
  return Menu;
}();
exports["default"] = Menu;
_defineProperty(Menu, "LIST_SELECTOR", '#main-content');
_defineProperty(Menu, "OTHER_LOCATIONS_SELECTORS", "#side-content, \n        .home-boxes-container.new-home");

},{"./Configuration.js":5,"./ConfigurationHTML.js":6,"./Event.js":9,"./Information.js":11,"./MenuHTML.js":19}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ButtonClass = _interopRequireDefault(require("./ButtonClass.js"));
var _ConfigurationHTML = _interopRequireDefault(require("./ConfigurationHTML.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var MenuHTML = /*#__PURE__*/function () {
  function MenuHTML() {
    _classCallCheck(this, MenuHTML);
  }
  _createClass(MenuHTML, null, [{
    key: "CONTAINER_SELECTOR",
    get: function get() {
      return ".".concat(this.CONTAINER_CLASS_NAME);
    }
  }, {
    key: "RELOAD_INFORMATION_SELECTOR",
    get: function get() {
      return ".".concat(this.RELOAD_INFORMATION_CLASS_NAME);
    }
  }, {
    key: "create",
    value: function create() {
      return "\n        <div class='".concat(this.CONTAINER_CLASS_NAME, "'>\n            ").concat(this._openConfigButton(), "\n            ").concat(this._refreshDataButton(), "\n        </div>");
    }
  }, {
    key: "createSimple",
    value: function createSimple() {
      return "\n        <div class='".concat(this.CONTAINER_CLASS_NAME, "'>\n            ").concat(this._openConfigButton(), "\n        </div>");
    }
  }, {
    key: "_openConfigButton",
    value: function _openConfigButton() {
      return "<button class='".concat(_ButtonClass["default"].IDEALISTA_BUTTON_CLASS, " ").concat(_ConfigurationHTML["default"].OPEN_CONFIG_CLASS_NAME, "' title='Abrir configuraci\xF3n'>\u2699 Configuraci\xF3n</button>");
    }
  }, {
    key: "_refreshDataButton",
    value: function _refreshDataButton() {
      return "<button class='".concat(_ButtonClass["default"].IDEALISTA_BUTTON_CLASS, " ").concat(this.RELOAD_INFORMATION_CLASS_NAME, "' title='Refrescar informaci\xF3n'>\u27F3 Refrescar</button>");
    }
  }]);
  return MenuHTML;
}();
exports["default"] = MenuHTML;
_defineProperty(MenuHTML, "CONTAINER_CLASS_NAME", 'midefos-idealista-menu');
_defineProperty(MenuHTML, "RELOAD_INFORMATION_CLASS_NAME", 'reload-information');

},{"./ButtonClass.js":3,"./ConfigurationHTML.js":6}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _Log = _interopRequireDefault(require("./Log.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Preferences = /*#__PURE__*/function () {
  function Preferences() {
    _classCallCheck(this, Preferences);
  }
  _createClass(Preferences, null, [{
    key: "init",
    value: function init() {
      this._current = this._getConfig();
    }
  }, {
    key: "get",
    value: function get(key) {
      var config = this._getConfig();
      var value = config[key];
      if (value === undefined) return this._getFromDefault(key);
      return value;
    }
  }, {
    key: "save",
    value: function save(config) {
      window.localStorage.setItem(this.NAME, JSON.stringify(config));
      this._current = config;
      _Log["default"].debug('Saved preferences');
    }
  }, {
    key: "_getConfig",
    value: function _getConfig() {
      var storageConfig = this._getFromLocalStorage();
      if (!storageConfig) return this._default();
      return storageConfig;
    }
  }, {
    key: "_getFromLocalStorage",
    value: function _getFromLocalStorage() {
      var storageConfig = window.localStorage.getItem(this.NAME);
      if (!storageConfig) return null;
      return JSON.parse(storageConfig);
    }
  }, {
    key: "_getFromDefault",
    value: function _getFromDefault(key) {
      var defaultPreferences = this._default();
      return defaultPreferences[key];
    }
  }, {
    key: "_default",
    value: function _default() {
      return {
        enabled: true,
        darkMode: true,
        enlargeImages: false,
        currentMoney: 0,
        'max-price': 120000,
        'max-price-per-meter': 1500,
        percentages: true,
        percentages_20: true,
        percentages_30: true,
        percentages_50: false,
        garage: false,
        exterior: true,
        lift: true,
        bus: false,
        train: false,
        supermarket: true,
        smoke: false,
        pharmacy: true,
        gym: false,
        pool: true
      };
    }
  }]);
  return Preferences;
}();
exports["default"] = Preferences;
_defineProperty(Preferences, "NAME", 'midefos-idealista');
_defineProperty(Preferences, "_current", void 0);

},{"./Log.js":17}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var StringUtil = /*#__PURE__*/function () {
  function StringUtil() {
    _classCallCheck(this, StringUtil);
  }
  _createClass(StringUtil, null, [{
    key: "capitalizeFirstLetter",
    value: function capitalizeFirstLetter(string) {
      return string[0].toUpperCase() + string.slice(1);
    }
  }]);
  return StringUtil;
}();
exports["default"] = StringUtil;

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ConfigurationHTML = _interopRequireDefault(require("./ConfigurationHTML.js"));
var _ItemHTML = _interopRequireDefault(require("./ItemHTML.js"));
var _MenuHTML = _interopRequireDefault(require("./MenuHTML.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Styles = /*#__PURE__*/function () {
  function Styles() {
    _classCallCheck(this, Styles);
  }
  _createClass(Styles, null, [{
    key: "add",
    value: function add(style) {
      var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (id && document.querySelector("#".concat(id))) return;
      var styleNode = document.createElement('style');
      styleNode.textContent = style;
      if (id) styleNode.id = id;
      document.head.appendChild(styleNode);
    }
  }, {
    key: "remove",
    value: function remove(id) {
      var style = document.querySelector("#".concat(id));
      if (style) style.remove();
    }
  }]);
  return Styles;
}();
exports["default"] = Styles;
_defineProperty(Styles, "APP_STYLES", "\n\n        .midefos-idealista-card {\n            box-shadow: 0px 0px 8px -1px rgba(0,0,0,0.35);\n            background-color: white;\n            border-radius: 8px;\n            \n            padding: 1rem;\n            margin-bottom: 1rem;\n        }\n\n        .".concat(_ItemHTML["default"].CONTAINER_CLASS_NAME, " {\n            display: flex;\n            flex-direction: column;\n\n            width: 100%;\n            margin-top: -10px;\n            margin-bottom: 10px;\n\n            background-color: white;\n            box-shadow: 0 3px 6px rgba(225, 245, 110, 0.16), 0 3px 6px rgba(225, 245, 110, 0.23);\n            border: 3px solid transparent;\n        }\n\n        .").concat(_ItemHTML["default"].INFORMATION_CONTAINER_CLASS_NAME, " {\n            display: flex;\n            align-items: center;\n            justify-content: space-around;\n\n            width: 100%;\n            padding: 0.5rem 0;\n            border-bottom: 1px solid gray;\n        }\n\n        .").concat(_ItemHTML["default"].INFORMATION_CONTAINER_CLASS_NAME, ":last-of-type {\n            border-bottom: none;\n        }\n\n        .").concat(_ItemHTML["default"].INFORMATION_CONTAINER_CLASS_NAME, " svg {\n            position: relative;\n            top: 2px;            \n        }\n\n        .").concat(_ItemHTML["default"].INFORMATION_CLASS_NAME, " {\n            display: flex;\n            flex-direction: column;\n        }\n\n        span.").concat(_ItemHTML["default"].SUCCESS_CLASS_NAME, " {\n            color: lightgreen;\n        }\n\n        .").concat(_ItemHTML["default"].CONTAINER_CLASS_NAME, ".").concat(_ItemHTML["default"].SUCCESS_CLASS_NAME, " {\n            border-color: lightgreen;\n        }\n\n        span.").concat(_ItemHTML["default"].WARNING_CLASS_NAME, " {\n            color: darkorange;\n        }\n\n        span.").concat(_ItemHTML["default"].ERROR_CLASS_NAME, " {\n            color: lightcoral;\n        }\n\n        .").concat(_ItemHTML["default"].CONTAINER_CLASS_NAME, ".").concat(_ItemHTML["default"].ERROR_CLASS_NAME, " {\n            border-color: lightcoral;\n        }\n\n        .").concat(_MenuHTML["default"].CONTAINER_CLASS_NAME, " {\n            display: flex;\n            align-items: center;\n            justify-content: space-around;\n\n            width: 100%;\n            padding: 10px 0;\n\n            background-color: white;\n            box-shadow: 0 3px 6px rgba(225, 245, 110, 0.16), 0 3px 6px rgba(225, 245, 110, 0.23);\n        }\n        .").concat(_ConfigurationHTML["default"].CONTAINER_CLASS_NAME, " {\n            display: none;\n            position: fixed;\n            overflow: auto;\n            z-index: 3;\n        \n            width: 95%;\n            height: 95%;\n            top: 2.5%;\n            left: 2.5%;\n            \n            padding: 2rem;\n\n            background-color: rgba(255, 255, 255, 0.90);  \n            border: 5px solid rgb(225, 245, 110);\n            border-radius: 8px;\n        }\n\n        .").concat(_ConfigurationHTML["default"].CONTAINER_CLASS_NAME, " label {\n            display: block;\n        }\n\n        /* Ads */\n        .adv {\n            display: none;\n        }\n    "));
_defineProperty(Styles, "DARK_MODE", "\n        div.listing-top,\n        div.item-info-container,\n        .items-container:not(.items-list) .item-info-container,\n        section.links-block-home,\n        div.item-toolbar,\n        .links-block-home div.content,\n        div.wrapper,\n        picture.main-image,\n        .placeholder-multimedia,\n        section.module-contact,\n        .side-content .module-contact-gray,\n        .detail-pagination,\n        .rs-gallery-hud, .rs-gallery-header,\n        .rs-gallery-container .image-gallery .image-gallery-content,\n        .rs-gallery-footer,\n        .ide-box-detail,\n        section.ide-box-detail-first-picture,\n        .pagination li a,\n        .btn.regular,\n        .dropdown-wrapper, .dropdown-wrapper .dropdown,\n        .new-radio-button input:checked + label, .new-radio-button label, \n        .new-search-box #campoBus, .result-list, .text-image-component_texts,\n        .rs-light-adcard_info,\n        .sticky-bar-detail,\n        .home,\n        .".concat(_ItemHTML["default"].CONTAINER_CLASS_NAME, ",\n        .").concat(_MenuHTML["default"].CONTAINER_CLASS_NAME, ",\n        .midefos-idealista-card {\n            background-color: #060703;\n            color: white;\n        }\n\n        body,\n        #wrapper,\n        .new-listing-filter,\n        footer,\n        .").concat(_ConfigurationHTML["default"].CONTAINER_CLASS_NAME, " {\n            background-color: #181B0B;\n            color: white;\n        }\n\n        .description,\n        .new-listing-filter a,\n        :root .input-radio > span > span,\n        :root .input-checkbox > span > span,\n        .home-boxes-container .draw-search, .home-boxes-container .put-property, .home-boxes-container .solidary-module,\n        .dropdown-wrapper .placeholder, .dropdown-wrapper .dropdown li, .dropdown-wrapper .dropdown li > :first-child,\n        .ide-main-menu li a, .ide-main-menu li > span,\n        .new-search-box .dropdown-wrapper .placeholder {\n            color: white;\n        }\n\n        .id-logo, .id-logo img {\n            filter: invert();\n        }\n        \n        .save-search-box {\n            color: black;\n        }\n\n        .description::before {\n            display: none;\n        }\n    "));
_defineProperty(Styles, "ENLARGE_IMAGES", "\n        .item-multimedia {\n            width: 100% !important;\n        }\n\n        .item-info-container {\n            width: 100% !important;\n        }\n\n        .item-multimedia,\n        .item-gallery,\n        .item-gallery .mask-wrapper {\n            height: 400px !important;\n        }\n\n        .rs-gallery .item-gallery {\n            height: unset !important;\n        }\n\n        .description {\n            height: auto !important;\n        }\n\n        .description p.ellipsis {\n            display: block !important;\n            position: unset !important;\n        }\n\n        .logo-branding,\n        .items-container:not(.items-list) .item-toolbar,\n        .items-container:not(.items-list) .description::before,\n        .items-container:not(.items-list) .listing-tags-container, \n        .items-container:not(.items-list) .listing-tags-no-toggle-container {\n            display: none;\n        }\n    ");

},{"./ConfigurationHTML.js":6,"./ItemHTML.js":13,"./MenuHTML.js":19}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Supermarket = /*#__PURE__*/_createClass(function Supermarket() {
  _classCallCheck(this, Supermarket);
  _defineProperty(this, "name", void 0);
  _defineProperty(this, "url", void 0);
});
exports["default"] = Supermarket;

},{}]},{},[1]);
