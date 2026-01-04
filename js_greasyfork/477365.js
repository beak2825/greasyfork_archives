// ==UserScript==
// @name         北京公共图书馆馆藏助手（豆瓣）
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @author       Bubu
// @match        https://book.douban.com/subject/**
// @grant        GM_xmlhttpRequest
// @connect      primo.clcn.net.cn
// @license      AGPL-3.0-or-later
// @homepage     https://github.com/p3psi-boo/beijing-public-library-for-douban-book
// @description  在豆瓣图书的详情页右侧边栏添加北京公共图书馆的馆藏信息
// @downloadURL https://update.greasyfork.org/scripts/477365/%E5%8C%97%E4%BA%AC%E5%85%AC%E5%85%B1%E5%9B%BE%E4%B9%A6%E9%A6%86%E9%A6%86%E8%97%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E8%B1%86%E7%93%A3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/477365/%E5%8C%97%E4%BA%AC%E5%85%AC%E5%85%B1%E5%9B%BE%E4%B9%A6%E9%A6%86%E9%A6%86%E8%97%8F%E5%8A%A9%E6%89%8B%EF%BC%88%E8%B1%86%E7%93%A3%EF%BC%89.meta.js
// ==/UserScript==

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var Constant;
(function (_Constant) {
  var BASE_URL = _Constant.BASE_URL = "https://primo.clcn.net.cn/primo_library/libweb/action/";
  var ICON_EXTERN = _Constant.ICON_EXTERN = "<svg t=\"1697200936413\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"5571\" width=\"16\" height=\"16\"><path d=\"M764.1 871.9h-612v-612h242v100h-142v412h412v-142h100z\" p-id=\"5572\" fill=\"#0b7c2a\"></path><path d=\"M355.736 597.38l350.58-350.58 70.71 70.71-350.58 350.58z\" p-id=\"5573\" fill=\"#0b7c2a\"></path><path d=\"M871.9 500.9l-97 24.3-41.1-164.3-14.2-56.5-56.6-14.2-164.2-41.1 24.4-97 279 69.7z\" p-id=\"5574\" fill=\"#0b7c2a\"></path></svg>";
})(Constant || (Constant = {}));
var baseRequest = function baseRequest(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Promise(function (resolve, reject) {
    var paramsString = Object.entries(params).map(function (pair) {
      return "".concat(encodeURIComponent(pair[0]), "=").concat(encodeURIComponent(pair[1]));
    }).join('&');
    var fullURL = function (url) {
      var result = Constant.BASE_URL + url;
      if (paramsString.length != 0) {
        result += '?';
        result += paramsString;
      }
      return result;
    }(url);

    // @ts-ignore
    GM_xmlhttpRequest({
      headers: {
        'content-type': 'application/json',
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Microsoft Edge\";v=\"117\", \"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"117\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
      },
      responseType: 'xml',
      url: fullURL,
      method: 'GET',
      onload: function onload(res) {
        resolve(res.response);
      },
      onerror: function onerror(response) {
        reject(response);
      }
    });
  });
};
var Bussiness;
(function (_Bussiness) {
  var Search;
  (function (_Search) {
    var getUrl = _Search.getUrl = function (isbn) {
      var params = {
        "fn": "search",
        "ct": "search",
        "initialSearch": "true",
        "mode": "Basic",
        "tab": "default_tab",
        "indx": "1",
        "dum": "true",
        "srt": "rank",
        "vid": "CLCN",
        "frbg": "",
        "vl(freeText0)": isbn,
        "scp.scps": "scope:(CLCN),scope:(CLCN_EBOOK)",
        "vl(26371699UI0)": "isbn"
      };
      var paramsString = Object.entries(params).map(function (pair) {
        return "".concat(encodeURIComponent(pair[0]), "=").concat(encodeURIComponent(pair[1]));
      }).join('&');
      var fullURL = function (url) {
        var result = Constant.BASE_URL + url;
        if (paramsString.length != 0) {
          result += '?';
          result += paramsString;
        }
        return result;
      }("search.do");
      return fullURL;
    };
    var request = _Search.request = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(isbn) {
        var response, dom, idElemList, result, _iterator, _step, el, id;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return baseRequest("search.do", {
                "fn": "search",
                "ct": "search",
                "initialSearch": "true",
                "mode": "Basic",
                "tab": "default_tab",
                "indx": "1",
                "dum": "true",
                "srt": "rank",
                "vid": "CLCN",
                "frbg": "",
                "vl(freeText0)": isbn,
                "scp.scps": "scope:(CLCN),scope:(CLCN_EBOOK)",
                "vl(26371699UI0)": "isbn"
              });
            case 2:
              response = _context.sent;
              dom = new DOMParser().parseFromString(response, "text/html");
              idElemList = dom.getElementsByClassName("EXLResultRecordId");
              result = [];
              _iterator = _createForOfIteratorHelper(idElemList);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  el = _step.value;
                  id = el.getAttribute("name");
                  result.push(id);
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              return _context.abrupt("return", result);
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();
  })(Search || (Search = _Bussiness.Search || (_Bussiness.Search = {})));
  var Library;
  (function (_Library) {
    var getAvailLibraries = _Library.getAvailLibraries = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(id, isbn) {
        var res, result, dom, items;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return baseRequest("display.do", {
                "tabs": "locationsTab",
                "ct": "display",
                "fn": "search",
                "doc": id,
                "indx": "1",
                "recIds": id,
                "recIdxs": "0",
                "elementId": "",
                "renderMode": "poppedOut",
                "displayMode": "full",
                "https://primo.clcn.net.cn:443/primo_library/libweb/action/expand.do?frbg": "",
                "frbrVersion": "2",
                "vl(26371699UI0)": "isbn",
                "gathStatTab": "true",
                "dscnt": "1",
                "scp.scps": "scope:(CLCN),scope:(CLCN_EBOOK)",
                "mode": "Basic",
                "vid": "CLCN",
                "tab": "default_tab",
                "srt": "rank",
                "dum": "true",
                "vl(freeText0)": isbn,
                "fromTabHeaderButtonPopout": "true",
                "dstmp": new Date().valueOf() - 10 * 1000
              });
            case 2:
              res = _context2.sent;
              result = [];
              dom = new DOMParser().parseFromString(res, "text/html");
              items = $(".EXLLocationList", dom);
              items.each(function () {
                var detailURL = $(".EXLLocationsIcon", this).attr("href");
                var libName = $(".EXLLocationsTitleContainer", this).text().trim();
                var metaContainer = $(".EXLLocationInfo", this);
                var area = $("strong", metaContainer).text().trim();
                var cite = $("cite", metaContainer).text().trim();
                result.push({
                  detailURL: detailURL,
                  libName: libName,
                  area: area,
                  cite: cite
                });
              });
              return _context2.abrupt("return", result);
            case 8:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function (_x2, _x3) {
        return _ref2.apply(this, arguments);
      };
    }();
    var GetAvailNum = _Library.GetAvailNum = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(info) {
        var result, res, stateList;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              result = 0;
              _context3.next = 3;
              return baseRequest(info.detailURL);
            case 3:
              res = _context3.sent;
              stateList = $(res).find(".EXLLocationTableColumn3");
              stateList.each(function () {
                if (this.innerText.includes("在架上")) {
                  result++;
                }
              });
              return _context3.abrupt("return", result);
            case 7:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      return function (_x4) {
        return _ref3.apply(this, arguments);
      };
    }();
  })(Library || (Library = _Bussiness.Library || (_Bussiness.Library = {})));
  var Draw;
  (function (_Draw) {
    var drawBase = _Draw.drawBase = function (isbn) {
      var container = $("<div class='gray_ad'></div>");
      var searchUrl = Bussiness.Search.getUrl(isbn);
      container.append($("\n                <h2 style=\"display: inline-flex; justify-content: space-between; width: 100%\">\n                    <span>\u5317\u4EAC\u516C\u5171\u56FE\u4E66\u9986\u9986\u85CF</span>\n                    <span style=\"cursor: pointer\" onclick=\"window.open('".concat(searchUrl, "','_blank');\">").concat(Constant.ICON_EXTERN, "</span>\n                </h2>\n            ")));
      container.append($("<div id='load-label' style='display: flex; justify-content: center;align-items: center; margin: 16px 32px 32px 16px'>加载中...</div>"));
      container.append($("<span id='bj-db-plug-tips' style='color: #666666; font-size: 12px'>检索信息是根据本页的 ISBN 号进行匹配，如遇到没有查询结果可手动根据书名进行<a href='https://primo.clcn.net.cn/primo_library/libweb/action/search.do' target='_blank'>相关查询</a>。</span>"));
      $(".aside").prepend(container);
      return container;
    };
    var draw = _Draw.draw = function (libList) {
      var list = $("<ul class='bs more-after'></ul>");
      libList.forEach(function (item) {
        list.append("\n                <li class=\"mb8 pl\" style=\"border: none; border-bottom: 1px solid rgba(0,0,0,.08); margin-top: 6px\" id=\"".concat(item.libName, "\">\n                    <div class=\"meta-wrapper\">\n                        <div class=\"meta\">\n                            <div style=\"display: flex; justify-content: space-between;\"><span style=\"color: #37a\">").concat(item.libName, "</span><span id=\"avail-label\">\u52A0\u8F7D\u4E2D</span></div>\n                            <div style=\"display: flex; flex-direction: column;\">\n                                <span>\u9986\u85CF\u5730\uFF1A").concat(item.area, " </span>\n                                <span>\u7D22\u4E66\u53F7\uFF1A").concat(item.cite, " </span>\n                            </div>\n                        </div>\n                    </div>\n                </li>\n                "));
      });
      // container.append(list)
      list.insertBefore($("#bj-db-plug-tips"));
    };
  })(Draw || (Draw = _Bussiness.Draw || (_Bussiness.Draw = {})));
})(Bussiness || (Bussiness = {}));
function getISBN() {
  var isbn = $("meta[property='book:isbn']").attr("content");
  return isbn;
}
function main() {
  return _main.apply(this, arguments);
}
function _main() {
  _main = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
    var isbn, container, searchResult, _iterator2, _step2, id, result;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          isbn = getISBN();
          container = Bussiness.Draw.drawBase(isbn);
          _context4.prev = 2;
          _context4.next = 5;
          return Bussiness.Search.request(isbn);
        case 5:
          searchResult = _context4.sent;
          container.children("#load-label").remove();
          _iterator2 = _createForOfIteratorHelper(searchResult);
          _context4.prev = 8;
          _iterator2.s();
        case 10:
          if ((_step2 = _iterator2.n()).done) {
            _context4.next = 19;
            break;
          }
          id = _step2.value;
          _context4.next = 14;
          return Bussiness.Library.getAvailLibraries(id, isbn);
        case 14:
          result = _context4.sent;
          Bussiness.Draw.draw(result);
          result.forEach(function (info) {
            Bussiness.Library.GetAvailNum(info).then(function (res) {
              var parent = $("#".concat(info.libName), container);
              var labelElem = $("#avail-label", parent);
              labelElem.text("\u5728\u67B6".concat(res, "\u672C"));
            })["catch"](function (err) {
              var parent = $("#".concat(info.libName), container);
              var labelElem = $("#avail-label", parent);
              labelElem.text();
            });
          });
        case 17:
          _context4.next = 10;
          break;
        case 19:
          _context4.next = 24;
          break;
        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](8);
          _iterator2.e(_context4.t0);
        case 24:
          _context4.prev = 24;
          _iterator2.f();
          return _context4.finish(24);
        case 27:
          _context4.next = 32;
          break;
        case 29:
          _context4.prev = 29;
          _context4.t1 = _context4["catch"](2);
          $("#load-label").text("获取信息失败");
        case 32:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[2, 29], [8, 21, 24, 27]]);
  }));
  return _main.apply(this, arguments);
}

main()