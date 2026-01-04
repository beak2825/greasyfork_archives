/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 300:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// EXTERNAL MODULE: ./utils/src/gm/Store.ts
var Store = __webpack_require__(307);
;// ./utils/src/gm/enum/HttpDataType.ts
var HttpDataType = /*#__PURE__*/function (HttpDataType) {
  HttpDataType["JSON"] = "JSON";
  return HttpDataType;
}({});
;// ./utils/src/gm/Request.ts
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Request = /*#__PURE__*/function () {
  function Request() {
    _classCallCheck(this, Request);
  }
  return _createClass(Request, null, [{
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(option) {
        var onload1;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              option['method'] = 'GET';

              // 同步时返回 Promise
              if (!option.synchronous) {
                _context.n = 1;
                break;
              }
              return _context.a(2, new Promise(function (resolve, reject) {
                GM_xmlhttpRequest(_objectSpread(_objectSpread({}, option), {}, {
                  onload: function onload(response) {
                    resolve(option.dataType === HttpDataType.JSON ? JSON.parse(response.responseText) : response.responseText);
                  },
                  onerror: function onerror(error) {
                    reject(error);
                  }
                }));
              }));
            case 1:
              onload1 = function onload1(details) {
                var response;
                if (option.dataType === HttpDataType.JSON) {
                  response = JSON.parse(details.responseText);
                } else {
                  response = details.response;
                }
                option.onload(response);
              };
              GM_xmlhttpRequest(_objectSpread(_objectSpread({}, option), {}, {
                onload: onload1
              }));
            case 2:
              return _context.a(2);
          }
        }, _callee);
      }));
      function get(_x) {
        return _get.apply(this, arguments);
      }
      return get;
    }()
  }]);
}();

// EXTERNAL MODULE: ./core-socialist-values/src/Options.ts + 2 modules
var Options = __webpack_require__(309);
;// ./core-socialist-values/src/common/Bar.ts
function Bar_typeof(o) { "@babel/helpers - typeof"; return Bar_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Bar_typeof(o); }
function Bar_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return Bar_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (Bar_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, Bar_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, Bar_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), Bar_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", Bar_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), Bar_regeneratorDefine2(u), Bar_regeneratorDefine2(u, o, "Generator"), Bar_regeneratorDefine2(u, n, function () { return this; }), Bar_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (Bar_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function Bar_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } Bar_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { Bar_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, Bar_regeneratorDefine2(e, r, n, t); }
function Bar_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function Bar_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { Bar_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { Bar_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function Bar_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Bar_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Bar_toPropertyKey(o.key), o); } }
function Bar_createClass(e, r, t) { return r && Bar_defineProperties(e.prototype, r), t && Bar_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Bar_defineProperty(e, r, t) { return (r = Bar_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Bar_toPropertyKey(t) { var i = Bar_toPrimitive(t, "string"); return "symbol" == Bar_typeof(i) ? i : i + ""; }
function Bar_toPrimitive(t, r) { if ("object" != Bar_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Bar_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




var Bar = /*#__PURE__*/function () {
  function Bar() {
    Bar_classCallCheck(this, Bar);
  }
  return Bar_createClass(Bar, null, [{
    key: "replace",
    value:
    /**
     * 替换条幅
     * @param options {
     *   barSelector: string,              // 条幅选择器
     *   isObserveBar: boolean,            // 是否监听条幅变化，会监听两次变化，重新替换。配合 followUpObserveSelector 后续监听
     *   followUpObserveSelector?: string, // 后续监听选择器，即条幅替换后有可能会再变回原样，此处就是再监听的父级选择器，isObserveBar 为 true 时生效
     *   hideBarSelector: string,          // 隐藏条幅选择器
     *   isObserveHideBar: boolean,        // 是否监听隐藏条幅变化，会监听两次变化，重新隐藏。
     *   replaceBarCallback?: Function,    // 每次替换后回调
     *   jinrishiciCallback?: Function,    // 每次替换为今日诗词后回调
     *   hideBarCallback? Function         // 隐藏后回调
     * }
     */
    function replace(options) {
      var _this = this;
      if (!$(options.barSelector).text().match(/ukraine|乌克兰|black|黑人|trans rights|human rights/i)) {
        return;
      }
      // 一般隐藏条幅和替换条幅相同
      if (!options.hideBarSelector) {
        options.hideBarSelector = options.barSelector;
      }
      if (!options.isObserveHideBar) {
        options.isObserveHideBar = options.isObserveBar;
      }

      // 隐藏横幅设置勾选
      if (JSON.parse(Store/* default */.A.get(Options/* default */.A.Keys.removeBar)).value) {
        this.hideBar(options);
        return;
      }
      this.storeJinrishiciVal = JSON.parse(Store/* default */.A.get(Options/* default */.A.Keys.jinrishici)).value;
      if (this.storeJinrishiciVal) {
        this.getJinrishici().then(function (data) {
          _this.jinrishiciContent = data;
          _this.replaceObserver(options);
        });
      } else {
        this.replaceObserver(options);
      }
    }

    /**
     * 隐藏条幅
     * @param options
     * @private
     */
  }, {
    key: "hideBar",
    value: function hideBar(options) {
      // 隐藏横幅
      $(options.hideBarSelector).hide();
      if (options.isObserveHideBar) {
        var i = 0;
        // 隐藏条幅首次加载：监听条幅变化，变化后再次执行
        var observer = new MutationObserver(function () {
          $(options.hideBarSelector).hide();
          // 替换两次后结束监听
          if (i >= 1) {
            observer.disconnect();
          }
          i++;
        });
        observer.observe($(options.hideBarSelector)[0], {
          childList: true,
          subtree: true
        });
      }
      if (options.hideBarCallback) {
        options.hideBarCallback();
      }
    }

    /**
     * 替换条幅监听
     * @param options
     * @private
     */
  }, {
    key: "replaceObserver",
    value: function replaceObserver(options) {
      var _this2 = this;
      // 首次替换横幅
      this.replaceBar(options.barSelector, options.replaceBarCallback, options.jinrishiciCallback);
      if (!options.isObserveBar) {
        return;
      }
      var i = 0;
      // 条幅首次加载：监听条幅变化，变化后再次执行
      var observer = new MutationObserver(function () {
        _this2.replaceBar(options.barSelector, options.replaceBarCallback, options.jinrishiciCallback);
        // 替换两次后结束监听
        if (i >= 1) {
          observer.disconnect();
        }
        i++;
      });
      observer.observe($(options.barSelector)[0], {
        childList: true
      });
      if (options.followUpObserveSelector) {
        // 后续变化
        new MutationObserver(function () {
          _this2.replaceBar(options.barSelector, options.replaceBarCallback, options.jinrishiciCallback);
        }).observe($(options.followUpObserveSelector)[0], {
          childList: true
        });
      }
    }

    /**
     * 实际替换条幅
     * @param selector 条幅选择器
     * @param replaceBarCallback 替换后回调
     * @param jinrishiciCallback 替换为今日诗词后回调
     * @private
     */
  }, {
    key: "replaceBar",
    value: function replaceBar(selector, replaceBarCallback, jinrishiciCallback) {
      if ($($(selector)[0]).text().replace(/\s+/g, "") === Bar.txt) {
        return;
      }

      // 替换为今日诗词
      if (this.storeJinrishiciVal) {
        $(selector).css({
          'minHeight': '30px',
          'lineHeight': '30px'
        });
        $(selector).html("\n        <div class=\"csv_bar\">\n          ".concat(this.jinrishiciContent, "\n        </div>"));
        if (jinrishiciCallback) {
          jinrishiciCallback();
        }
      } else {
        // 替换为社会主义核心价值观
        $(selector).css({
          'minHeight': '40px'
        });
        $(selector).html("\n        <div class=\"csv_bar\">\n          <ul class='csv_bar_ul'><li>\u5BCC\u5F3A</li><li>\u6C11\u4E3B</li><li>\u6587\u660E</li><li>\u548C\u8C10</li><li>\u81EA\u7531</li><li>\u5E73\u7B49</li><li>\u516C\u6B63</li><li>\u6CD5\u6CBB</li><li>\u7231\u56FD</li><li>\u656C\u4E1A</li><li>\u8BDA\u4FE1</li><li>\u53CB\u5584</li></ul><br>\n          <ul class='csv_bar_ul'><li>Prosperity</li><li>Democracy</li><li>Civility</li><li>Harmony</li><li>Freedom</li><li>Equality</li><li>Justice</li><li>Rule of law</li><li>Patriotism</li><li>Dedication</li><li>Integrity</li><li>Friendship</li>\n          </ul>\n        </div>");
        // 避免出现多个导致样式添加失败
        var $bar = $(this.replaceBarSelector.bar);
        if ($bar.length == 2) {
          $bar.eq(0).remove();
        }
        var barUlSelector = this.replaceBarSelector.barUl;
        $(barUlSelector).css({
          'display': 'inline-block',
          'listStyle': 'none',
          'margin': 0,
          'padding': 0,
          'width': 'auto'
        });
        $(barUlSelector + ' li').css({
          'color': '#DE2910',
          'fontWeight': 'bold',
          'fontFamily': 'KaiTi',
          'float': 'left',
          'paddingRight': '10px',
          'min-width': '80px',
          'textAlign': 'center'
        });
        $(barUlSelector + ':first').css('verticalAlign', 'bottom');
        $(barUlSelector + ':first li').css('fontSize', '18px');
        $(barUlSelector + ':eq(1) li').css('fontSize', '13px');
      }
      if (replaceBarCallback) {
        replaceBarCallback();
      }
    }

    /**
     * 获取今日诗词
     * @private
     */
  }, {
    key: "getJinrishici",
    value: (function () {
      var _getJinrishici = Bar_asyncToGenerator(/*#__PURE__*/Bar_regenerator().m(function _callee() {
        var jinrishiciOption, response;
        return Bar_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              jinrishiciOption = JSON.parse(Store/* default */.A.get(Options/* default */.A.Keys.jinrishici));
              if (jinrishiciOption.value) {
                _context.n = 1;
                break;
              }
              return _context.a(2);
            case 1:
              _context.n = 2;
              return Request.get({
                url: 'https://v2.jinrishici.com/one.json',
                dataType: HttpDataType.JSON,
                // headers: {
                //   'X-User-Token': jinrishiciOption.token,
                // },
                synchronous: true
              });
            case 2:
              response = _context.v;
              if (!response || response.status !== 'success') {
                console.error('今日诗词获取失败', response);
              }
              // // 存储 Token
              // if (jinrishiciOption.token !== response.data.token) {
              //   jinrishiciOption.token = response.data.token
              //   Store.set(Options.Keys.jinrishici, JSON.stringify(jinrishiciOption))
              // }
              return _context.a(2, response.data.content + ' —— ' + response.data.origin.author + '《' + response.data.origin.title + '》');
          }
        }, _callee);
      }));
      function getJinrishici() {
        return _getJinrishici.apply(this, arguments);
      }
      return getJinrishici;
    }())
  }]);
}();
/**
 * 替换条幅的选择器
 */
Bar_defineProperty(Bar, "replaceBarSelector", {
  bar: '.csv_bar',
  barUl: '.csv_bar .csv_bar_ul'
});
/**
 * 替换后的条幅去除空格换行后的文本
 * @private
 */
Bar_defineProperty(Bar, "txt", '富强民主文明和谐自由平等公正法治爱国敬业诚信友善ProsperityDemocracyCivilityHarmonyFreedomEqualityJusticeRuleoflawPatriotismDedicationIntegrityFriendship');
/**
 * 是否启用今日诗词
 * @private
 */
Bar_defineProperty(Bar, "storeJinrishiciVal", false);
/**
 * 今日诗词内容
 * @private
 */
Bar_defineProperty(Bar, "jinrishiciContent", '');

;// ./core-socialist-values/src/websites/Codecept.ts
function Codecept_typeof(o) { "@babel/helpers - typeof"; return Codecept_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Codecept_typeof(o); }
function Codecept_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Codecept_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Codecept_toPropertyKey(o.key), o); } }
function Codecept_createClass(e, r, t) { return r && Codecept_defineProperties(e.prototype, r), t && Codecept_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Codecept_defineProperty(e, r, t) { return (r = Codecept_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Codecept_toPropertyKey(t) { var i = Codecept_toPrimitive(t, "string"); return "symbol" == Codecept_typeof(i) ? i : i + ""; }
function Codecept_toPrimitive(t, r) { if ("object" != Codecept_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Codecept_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Codecept = /*#__PURE__*/function () {
  function Codecept() {
    Codecept_classCallCheck(this, Codecept);
  }
  return Codecept_createClass(Codecept, null, [{
    key: "replace",
    value: function replace() {
      var _this = this;
      if (location.host !== 'codecept.io') {
        return;
      }
      Bar.replace({
        barSelector: this.selectors.bar,
        isObserveBar: false,
        hideBarSelector: this.selectors.hideBar,
        isObserveHideBar: false,
        jinrishiciCallback: function jinrishiciCallback() {
          $(_this.selectors.bar).css('color', '#edf2f7');
        }
      });
    }
  }]);
}();
Codecept_defineProperty(Codecept, "selectors", {
  bar: '.sub-bar .message',
  hideBar: '.sub-bar'
});

;// ./core-socialist-values/src/websites/Github.ts
function Github_typeof(o) { "@babel/helpers - typeof"; return Github_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Github_typeof(o); }
function Github_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Github_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Github_toPropertyKey(o.key), o); } }
function Github_createClass(e, r, t) { return r && Github_defineProperties(e.prototype, r), t && Github_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Github_defineProperty(e, r, t) { return (r = Github_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Github_toPropertyKey(t) { var i = Github_toPrimitive(t, "string"); return "symbol" == Github_typeof(i) ? i : i + ""; }
function Github_toPrimitive(t, r) { if ("object" != Github_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Github_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Github = /*#__PURE__*/function () {
  function Github() {
    Github_classCallCheck(this, Github);
  }
  return Github_createClass(Github, null, [{
    key: "replace",
    value: function replace() {
      if (location.href !== 'https://github.com/') {
        return;
      }
      var $notice = $(this.selectors.notice);
      if ($notice.length > 0 && $notice.text().toLowerCase().indexOf('ukraine') != -1) {
        $notice.remove();
      }
    }
  }]);
}();
Github_defineProperty(Github, "selectors", {
  notice: '.border.js-notice'
});

;// ./core-socialist-values/src/websites/Ember.ts
function Ember_typeof(o) { "@babel/helpers - typeof"; return Ember_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Ember_typeof(o); }
function Ember_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Ember_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Ember_toPropertyKey(o.key), o); } }
function Ember_createClass(e, r, t) { return r && Ember_defineProperties(e.prototype, r), t && Ember_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Ember_defineProperty(e, r, t) { return (r = Ember_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Ember_toPropertyKey(t) { var i = Ember_toPrimitive(t, "string"); return "symbol" == Ember_typeof(i) ? i : i + ""; }
function Ember_toPrimitive(t, r) { if ("object" != Ember_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Ember_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Ember = /*#__PURE__*/function () {
  function Ember() {
    Ember_classCallCheck(this, Ember);
  }
  return Ember_createClass(Ember, null, [{
    key: "replace",
    value: function replace() {
      var _this = this;
      if (location.host !== 'emberjs.com') {
        return;
      }
      Bar.replace({
        barSelector: this.selectors.bar,
        isObserveBar: false,
        jinrishiciCallback: function jinrishiciCallback() {
          $(_this.selectors.bar).css('color', '#fff');
        }
      });
      $(this.selectors.bar).css({
        'backgroundColor': '#1c1e24',
        'padding': 0
      });
    }
  }]);
}();
Ember_defineProperty(Ember, "selectors", {
  bar: '.callout-banner'
});

;// ./core-socialist-values/src/websites/SvelteMaterialUi.ts
function SvelteMaterialUi_typeof(o) { "@babel/helpers - typeof"; return SvelteMaterialUi_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, SvelteMaterialUi_typeof(o); }
function SvelteMaterialUi_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function SvelteMaterialUi_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, SvelteMaterialUi_toPropertyKey(o.key), o); } }
function SvelteMaterialUi_createClass(e, r, t) { return r && SvelteMaterialUi_defineProperties(e.prototype, r), t && SvelteMaterialUi_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function SvelteMaterialUi_defineProperty(e, r, t) { return (r = SvelteMaterialUi_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function SvelteMaterialUi_toPropertyKey(t) { var i = SvelteMaterialUi_toPrimitive(t, "string"); return "symbol" == SvelteMaterialUi_typeof(i) ? i : i + ""; }
function SvelteMaterialUi_toPrimitive(t, r) { if ("object" != SvelteMaterialUi_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != SvelteMaterialUi_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var SvelteMaterialUi = /*#__PURE__*/function () {
  function SvelteMaterialUi() {
    SvelteMaterialUi_classCallCheck(this, SvelteMaterialUi);
  }
  return SvelteMaterialUi_createClass(SvelteMaterialUi, null, [{
    key: "replace",
    value: function replace() {
      if (location.host !== 'sveltematerialui.com') {
        return;
      }

      // 移除 body 上的相关类（包括 ukraine 和 transrights），隐藏原伪元素条幅
      $('body').removeClass('ukraine transrights');

      // 手动插入一个容器作为 Bar 的挂载点
      // 注意：Bar.replace 内部会检测文本是否包含 ukraine，所以必须预填该文本触发替换逻辑
      if ($(this.selectors.inject).length === 0) {
        $('body').prepend("<div id=\"".concat(this.selectors.inject.substring(1), "\" style=\"text-align: center;\">ukraine</div>"));
      }

      // 调用通用替换逻辑
      Bar.replace({
        barSelector: this.selectors.inject,
        isObserveBar: false // 手动插入的静态节点通常不需要监听变化
      });
    }
  }]);
}();
SvelteMaterialUi_defineProperty(SvelteMaterialUi, "selectors", {
  inject: '#smui-csv-bar'
});

;// ./core-socialist-values/src/websites/Syncthing.ts
function Syncthing_typeof(o) { "@babel/helpers - typeof"; return Syncthing_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Syncthing_typeof(o); }
function Syncthing_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Syncthing_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Syncthing_toPropertyKey(o.key), o); } }
function Syncthing_createClass(e, r, t) { return r && Syncthing_defineProperties(e.prototype, r), t && Syncthing_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Syncthing_defineProperty(e, r, t) { return (r = Syncthing_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Syncthing_toPropertyKey(t) { var i = Syncthing_toPrimitive(t, "string"); return "symbol" == Syncthing_typeof(i) ? i : i + ""; }
function Syncthing_toPrimitive(t, r) { if ("object" != Syncthing_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Syncthing_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Syncthing = /*#__PURE__*/function () {
  function Syncthing() {
    Syncthing_classCallCheck(this, Syncthing);
  }
  return Syncthing_createClass(Syncthing, null, [{
    key: "replace",
    value: function replace() {
      var _this = this;
      if (location.host !== 'syncthing.net') {
        return;
      }
      Bar.replace({
        barSelector: this.selectors.bar,
        isObserveBar: false,
        replaceBarCallback: function replaceBarCallback() {
          $(_this.selectors.bar).css('textAlign', 'center');
        }
      });
    }
  }]);
}();
Syncthing_defineProperty(Syncthing, "selectors", {
  bar: '.alert'
});

;// ./core-socialist-values/src/websites/Vim.ts
function Vim_typeof(o) { "@babel/helpers - typeof"; return Vim_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Vim_typeof(o); }
function Vim_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Vim_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Vim_toPropertyKey(o.key), o); } }
function Vim_createClass(e, r, t) { return r && Vim_defineProperties(e.prototype, r), t && Vim_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Vim_defineProperty(e, r, t) { return (r = Vim_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Vim_toPropertyKey(t) { var i = Vim_toPrimitive(t, "string"); return "symbol" == Vim_typeof(i) ? i : i + ""; }
function Vim_toPrimitive(t, r) { if ("object" != Vim_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Vim_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Vim_SvelteMaterialUi = /*#__PURE__*/function () {
  function SvelteMaterialUi() {
    Vim_classCallCheck(this, SvelteMaterialUi);
  }
  return Vim_createClass(SvelteMaterialUi, null, [{
    key: "replace",
    value: function replace() {
      if (location.host !== 'www.vim.org') {
        return;
      }
      for (var i = 0; i < 5; i++) {
        // 删除蓝
        var lightbg = $(this.selectors.removeEl1);
        if (!lightbg) break;
        lightbg.remove();

        // 删除黄
        lightbg = $(this.selectors.removeEl2);
        if (!lightbg) break;
        lightbg.remove();
      }

      // 空白填充背景色
      $(this.selectors.barRootEl).css('background-color', $(this.selectors.backgroundColorEl).css('background-color'));
    }
  }]);
}();
Vim_defineProperty(Vim_SvelteMaterialUi, "selectors", {
  removeEl1: 'td.lightbg[style="background-color: #0057b7"]',
  removeEl2: 'td.lightbg[style="background-color: #ffd700"]',
  backgroundColorEl: 'td.lightbg[align="left"]',
  barRootEl: 'body > table:nth-child(1)'
});

;// ./core-socialist-values/src/websites/Pandoc.ts
function Pandoc_typeof(o) { "@babel/helpers - typeof"; return Pandoc_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Pandoc_typeof(o); }
function Pandoc_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Pandoc_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Pandoc_toPropertyKey(o.key), o); } }
function Pandoc_createClass(e, r, t) { return r && Pandoc_defineProperties(e.prototype, r), t && Pandoc_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Pandoc_defineProperty(e, r, t) { return (r = Pandoc_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Pandoc_toPropertyKey(t) { var i = Pandoc_toPrimitive(t, "string"); return "symbol" == Pandoc_typeof(i) ? i : i + ""; }
function Pandoc_toPrimitive(t, r) { if ("object" != Pandoc_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Pandoc_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Pandoc = /*#__PURE__*/function () {
  function Pandoc() {
    Pandoc_classCallCheck(this, Pandoc);
  }
  return Pandoc_createClass(Pandoc, null, [{
    key: "replace",
    value: function replace() {
      if (location.host !== 'pandoc.org') {
        return;
      }
      var $headerBtn = $(this.selectors.headerBtn);
      if ($headerBtn.length > 0) {
        $headerBtn.remove();
      }
    }
  }]);
}();
Pandoc_defineProperty(Pandoc, "selectors", {
  headerBtn: '#ukraine'
});

;// ./core-socialist-values/src/websites/Namecheap.ts
function Namecheap_typeof(o) { "@babel/helpers - typeof"; return Namecheap_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Namecheap_typeof(o); }
function Namecheap_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Namecheap_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Namecheap_toPropertyKey(o.key), o); } }
function Namecheap_createClass(e, r, t) { return r && Namecheap_defineProperties(e.prototype, r), t && Namecheap_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function Namecheap_defineProperty(e, r, t) { return (r = Namecheap_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Namecheap_toPropertyKey(t) { var i = Namecheap_toPrimitive(t, "string"); return "symbol" == Namecheap_typeof(i) ? i : i + ""; }
function Namecheap_toPrimitive(t, r) { if ("object" != Namecheap_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Namecheap_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var Namecheap = /*#__PURE__*/function () {
  function Namecheap() {
    Namecheap_classCallCheck(this, Namecheap);
  }
  return Namecheap_createClass(Namecheap, null, [{
    key: "replace",
    value: function replace() {
      var _this = this;
      console.log(location.host);
      if (location.host !== 'www.namecheap.com') {
        return;
      }
      Bar.replace({
        barSelector: this.selectors.footerBanner,
        isObserveBar: false,
        replaceBarCallback: function replaceBarCallback() {
          $(_this.selectors.footerBanner).css({
            padding: '15px 0',
            textAlign: 'center',
            fontWeight: 'bold'
          });
        }
      });
    }
  }]);
}();
Namecheap_defineProperty(Namecheap, "selectors", {
  footerBanner: '.gb-stand-with-ukraine-banner'
});

;// ./core-socialist-values/src/main.ts
// ==UserScript==
// @name         技术远离政治
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  移除政治相关条幅或替换为社会主义核心价值观、今日诗词，替换政治相关 Logo 为原版 Logo，去除政治相关通知，让技术远离政治。
// @author       duanluan
// @copyright    2022, duanluan (https://github.com/duanluan)
// @license      Apache-2.0; https://www.apache.org/licenses/LICENSE-2.0.txt
// @homepage     https://greasyfork.org/zh-CN/scripts/440854
// @supportURL   https://github.com/duanluan/tampermonkey-scripts/issues
// @match        *://greasyfork.org/*
// @match        *://junit.org/*
// @match        *://codecept.io/*
// @match        *://github.com/*
// @match        *://docs.nestjs.com/*
// @match        *://emberjs.com/*
// @match        *://www.jenkins.io/*
// @match        *://sveltematerialui.com/*
// @match        *://syncthing.net/*
// @match        *://www.vim.org/*
// @match        *://pandoc.org/*
// @match        *://www.namecheap.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/440854/%E6%8A%80%E6%9C%AF%E8%BF%9C%E7%A6%BB%E6%94%BF%E6%B2%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/440854/%E6%8A%80%E6%9C%AF%E8%BF%9C%E7%A6%BB%E6%94%BF%E6%B2%BB.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author       duanluan
// @updateURL    https://raw.kkgithub.com/duanluan/tampermonkey-scripts/main/core-socialist-values/dist/core-socialist-values.user.js
// ==/OpenUserJS==










(function () {
  'use strict';

  Options/* default */.A.registerAll();
  Options/* default */.A.loadInGreasyfork();

  // React.replace()
  // Angular.replace()
  // Junit.replace()
  Codecept.replace();
  Github.replace();
  // Nest.replace()
  Ember.replace();
  // Electron.replace()
  // Jenkins.replace()
  // Svelte.replace()
  SvelteMaterialUi.replace();
  Syncthing.replace();
  Vim_SvelteMaterialUi.replace();
  Pandoc.replace();
  Namecheap.replace();
})();

/***/ }),

/***/ 307:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ Store)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 存储
 */
var Store = /*#__PURE__*/function () {
  function Store() {
    _classCallCheck(this, Store);
  }
  return _createClass(Store, null, [{
    key: "get",
    value:
    /**
     * 获取
     * @param key 键
     */
    function get(key) {
      return GM_getValue(key);
    }

    /**
     * 设置
     * @param key 键
     * @param value 值
     */
  }, {
    key: "set",
    value: function set(key, value) {
      GM_setValue(key, value);
    }
  }]);
}();


/***/ }),

/***/ 309:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ Options)
});

// EXTERNAL MODULE: ./utils/src/gm/Store.ts
var Store = __webpack_require__(307);
;// ./utils/src/gm/MenuCmd.ts
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 选项菜单
 */
var MenuCmd = /*#__PURE__*/function () {
  function MenuCmd() {
    _classCallCheck(this, MenuCmd);
  }
  return _createClass(MenuCmd, null, [{
    key: "register",
    value:
    /**
     * 注册
     * @param name 名称
     * @param fn 点击菜单时执行的函数
     */
    function register(name, fn) {
      return GM_registerMenuCommand(name, fn);
    }

    /**
     * 注销
     * @param menuCmdId 注册时返回的 ID
     */
  }, {
    key: "unregister",
    value: function unregister(menuCmdId) {
      GM_unregisterMenuCommand(menuCmdId);
    }
  }]);
}();

;// ./utils/src/CommonOptions.ts
function CommonOptions_typeof(o) { "@babel/helpers - typeof"; return CommonOptions_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, CommonOptions_typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function CommonOptions_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function CommonOptions_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, CommonOptions_toPropertyKey(o.key), o); } }
function CommonOptions_createClass(e, r, t) { return r && CommonOptions_defineProperties(e.prototype, r), t && CommonOptions_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function CommonOptions_toPropertyKey(t) { var i = CommonOptions_toPrimitive(t, "string"); return "symbol" == CommonOptions_typeof(i) ? i : i + ""; }
function CommonOptions_toPrimitive(t, r) { if ("object" != CommonOptions_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != CommonOptions_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



/**
 * 选项菜单
 */
var CommonOptions = /*#__PURE__*/function () {
  function CommonOptions() {
    CommonOptions_classCallCheck(this, CommonOptions);
  }
  return CommonOptions_createClass(CommonOptions, null, [{
    key: "registerBoolOption",
    value:
    /**
     * 注册 bool 类型的选项
     *
     * @param option 选项
     */
    function registerBoolOption(option) {
      var _this = this;
      var val = option.value,
        valIsBool = typeof val === 'boolean';
      if (!valIsBool) {
        return;
      }
      // 注册选项和选项点击事件
      var currentMenuCmdId = MenuCmd.register((val ? '✅ ' : '🔲 ') + option.label, function () {
        // 点击后取反
        option.value = !option.value;
        Store/* default */.A.set(option.name, JSON.stringify(option));

        // 重新注册
        MenuCmd.unregister(currentMenuCmdId);
        _this.registerBoolOption(option);
        // 刷新页面
        window.location.reload();
      });

      // 保存选项 ID
      option.menuCmdId = currentMenuCmdId;
      Store/* default */.A.set(option.name, JSON.stringify(option));
    }

    /**
     * 注册字符串/按钮类型的选项 (无状态)
     *
     * @param option 选项
     */
  }, {
    key: "registerStrOption",
    value: function registerStrOption(option) {
      MenuCmd.register(option.label, function () {
        if (typeof option.callback === 'function') {
          option.callback();
        }
      });
    }

    /**
     * 注册所有选项
     *
     * @param options 选项
     * @param moreOptionsUrl 更多设置页面 URL
     * @param useStore 是否使用存储（默认 true）
     */
  }, {
    key: "registerAll",
    value: function registerAll(options, moreOptionsUrl) {
      var useStore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      if (moreOptionsUrl) {
        // 注册“更多设置”选项，点击后打开新页面到更多设置页面
        MenuCmd.register('更多设置', function () {
          window.open(moreOptionsUrl, '_blank');
        });
      }
      var _iterator = _createForOfIteratorHelper(options),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var option = _step.value;
          // TODO 【调试】不保留选项的值，每次都从 Store 中获取
          // Store.set(option.name, null);

          // 声明最终用于注册的选项变量
          var finalOption = option;

          // useStore 为 true 时，才从 Store 读取或更新
          if (useStore) {
            var storeOption = Store/* default */.A.get(option.name) ? JSON.parse(Store/* default */.A.get(option.name)) : null;
            // 如果选项不存在 || 版本不一致 时重置选项
            if (storeOption === null || !storeOption['version'] || storeOption['version'] < option.version) {
              Store/* default */.A.set(option.name, JSON.stringify(option));
              storeOption = option;
            }
            finalOption = storeOption;
          }

          // 根据类型分发注册方法
          if (typeof finalOption.value === 'boolean') {
            this.registerBoolOption(finalOption);
          } else {
            this.registerStrOption(finalOption);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /**
     * 在 Greasy Fork 脚本详情页中加载选项
     *
     * @param scriptId 脚本 ID
     * @param loadOptionContentFn 加载选项内容的函数
     */
  }, {
    key: "loadInGreasyfork",
    value: function loadInGreasyfork(scriptId, loadOptionContentFn) {
      // 非脚本详情页结束
      if (location.host !== 'greasyfork.org' || location.href.indexOf('/scripts/' + scriptId) == -1) {
        return;
      }
      var selector = {
        scriptLinks: '#script-links',
        scriptOptions: '#script-options',
        scriptContent: '#script-content'
      };
      var $body = $(document.body),
        $scriptLinks = $(selector.scriptLinks),
        $scriptContent = $(selector.scriptContent);

      // 添加“脚本设置”选项卡和点击事件
      $scriptLinks.children('li:eq(0)').after("<li><a href=\"javascript:;\" id=\"script-options\">\u811A\u672C\u8BBE\u7F6E</a></li>");
      $body.on('click', selector.scriptOptions, function () {
        // 移除其他已选中选项的样式
        var $currentLi = $scriptLinks.children('li.current');
        $currentLi.html("<a href=\"".concat(location.href, "\">").concat($currentLi.text(), "</a>"));
        $currentLi.removeClass('current');
        // 给“脚本设置”选项卡添加选中选项的样式
        var $scriptOptions = $(selector.scriptOptions);
        $scriptOptions.parent().addClass('current');
        loadOptionContentFn($scriptContent);
      });
    }
  }]);
}();

;// ./core-socialist-values/src/Options.ts
var _Options;
function Options_typeof(o) { "@babel/helpers - typeof"; return Options_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Options_typeof(o); }
function Options_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = Options_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function Options_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return Options_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Options_arrayLikeToArray(r, a) : void 0; } }
function Options_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function Options_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function Options_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, Options_toPropertyKey(o.key), o); } }
function Options_createClass(e, r, t) { return r && Options_defineProperties(e.prototype, r), t && Options_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = Options_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function Options_toPropertyKey(t) { var i = Options_toPrimitive(t, "string"); return "symbol" == Options_typeof(i) ? i : i + ""; }
function Options_toPrimitive(t, r) { if ("object" != Options_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Options_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var Options = /*#__PURE__*/function () {
  function Options() {
    Options_classCallCheck(this, Options);
  }
  return Options_createClass(Options, null, [{
    key: "registerBoolOption",
    value:
    /**
     * 注册 bool 类型的选项
     * @param option 选项
     */
    function registerBoolOption(option) {
      CommonOptions.registerBoolOption(option);
    }

    /**
     * 注册所有选项
     */
  }, {
    key: "registerAll",
    value: function registerAll() {
      CommonOptions.registerAll(this.options, 'https://greasyfork.org/scripts/' + this.SCRIPT_ID);
    }

    /**
     * 在页面中加载选项
     */
  }, {
    key: "loadInGreasyfork",
    value: function loadInGreasyfork() {
      var _this = this;
      CommonOptions.loadInGreasyfork(this.SCRIPT_ID, function ($scriptContent) {
        // 添加脚本设置的内容
        var scriptContent = '';
        var _iterator = Options_createForOfIteratorHelper(_this.options),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var option = _step.value;
            var storeOption = JSON.parse(Store/* default */.A.get(option.name)),
              optionName = storeOption.name,
              optionVal = storeOption.value;
            scriptContent += "<h3>".concat(option.label, "</h3>");
            switch (optionName) {
              case _this.Keys.removeBar:
                scriptContent += "<label><input type=\"checkbox\" id=\"script-options-".concat(optionName, "\" ").concat(optionVal ? 'checked' : '', "> \u662F\u5426\u9690\u85CF\u6761\u5E45\uFF08\u52FE\u9009\u540E\u5C06\u9690\u85CF\u6761\u5E45\u800C\u4E0D\u662F\u66FF\u6362\u5176\u5185\u5BB9\uFF09</label>");
                break;
              case _this.Keys.jinrishici:
                scriptContent += "<label><input type=\"checkbox\" id=\"script-options-".concat(optionName, "-enabled\" ").concat(optionVal ? 'checked' : '', "> \u542F\u7528<a href=\"https://www.jinrishici.com\" target = \"_blank\">\u4ECA\u65E5\u8BD7\u8BCD</a>\uFF08\u4ECD\u9700\u53D6\u6D88\u52FE\u9009\u201C\u662F\u5426\u9690\u85CF\u6761\u5E45\u201D\u624D\u80FD\u751F\u6548\uFF09</label>");
                break;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        $scriptContent.html(scriptContent);
        var $body = $(document.body);
        // region 添加脚本设置的事件
        // 是否隐藏条幅
        var optionSelector = '#script-options-' + _this.Keys.removeBar;
        $body.on('change', optionSelector, function () {
          var removeBarOption = JSON.parse(Store/* default */.A.get(_this.Keys.removeBar));
          removeBarOption.value = !removeBarOption.value;
          // 重新注册菜单
          MenuCmd.unregister(removeBarOption.menuCmdId);
          _this.registerBoolOption(removeBarOption);
        });

        // 启用今日诗词
        optionSelector = '#script-options-' + _this.Keys.jinrishici + '-enabled';
        $body.on('change', optionSelector, function () {
          var jinrishiciOption = JSON.parse(Store/* default */.A.get(_this.Keys.jinrishici));
          jinrishiciOption.value = !jinrishiciOption.value;
          // 重新注册菜单
          MenuCmd.unregister(jinrishiciOption.menuCmdId);
          _this.registerBoolOption(jinrishiciOption);
        });
        // endregion
      });
    }
  }]);
}();
_Options = Options;
_defineProperty(Options, "SCRIPT_ID", 440854);
/**
 * 选项 Key
 */
_defineProperty(Options, "Keys", {
  removeBar: 'removeBar',
  jinrishici: 'jinrishici'
});
/**
 * 选项
 * @private
 */
_defineProperty(Options, "options", [{
  label: '隐藏条幅',
  name: _Options.Keys.removeBar,
  version: 1,
  value: false,
  menuCmdId: null
}, {
  label: '今日诗词',
  name: _Options.Keys.jinrishici,
  version: 1,
  value: false,
  menuCmdId: null,
  token: ''
}]);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__(309);
/******/ 	var __webpack_exports__ = __webpack_require__(300);
/******/ 	
/******/ })()
;
//# sourceMappingURL=core-socialist-values.user.js.map