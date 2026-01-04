// ==UserScript==
// @name         lzbc
// @namespace    http://tampermonkey.net/
// @version      2024.12.25.1
// @description  try it!
// @author       You
// @match        http://39.104.65.87:8778/editor/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=65.87
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512306/lzbc.user.js
// @updateURL https://update.greasyfork.org/scripts/512306/lzbc.meta.js
// ==/UserScript==
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
window.$ = Document.prototype.$ = Element.prototype.$ = $;
window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$;
(function () {
  'use strict';

  var _this2 = this;
  window._ds = {
    job_id: getParamValue('job_id'),
    task_id: getParamValue('task_id'),
    process_id: getParamValue('process_id'),
    taskInfo: {},
    logAn: true,
    logKeydown: false,
    resultDir: {
      all: 0,
      all_2D: 0,
      all_3D: 0,
      list_2D: [],
      list_3D: []
    },
    isSendTime: true,
    isDebug: true,
    baseURL: 'http://39.104.65.87:8778/api'
  };
  var _ds = new Proxy(window._ds, {
    get: function get(target, prop) {
      return Reflect.get(target, prop);
    },
    set: function set(target, prop, value) {
      if (prop in trigger) {
        trigger[prop](value);
      } else {
        Reflect.set(target, prop, value);
      }
      return true;
    }
  });
  var trigger = {
    resultDir: function resultDir(newVal) {
      window._ds.resultDir = newVal;
      var modeSwitch = $('.mode-switch');
      var _ds$resultDir = _ds.resultDir,
        all = _ds$resultDir.all,
        all_2D = _ds$resultDir.all_2D,
        all_3D = _ds$resultDir.all_3D,
        notManual_2D = _ds$resultDir.notManual_2D,
        accuracy = _ds$resultDir.accuracy;
      var statisticBar = $('.statistic-bar');
      var newText = "3D\uFF1A".concat(all_3D).concat('&nbsp;'.repeat(4), "2D\uFF1A").concat(all_2D).concat('&nbsp;'.repeat(4), "\u603B\uFF1A").concat(all, " \uFF08").concat(accuracy, "\uFF09");
      var newTitle = notManual_2D.reduce(function (counter, _ref, idx) {
        var track_id = _ref.track_id,
          camera_name = _ref.camera_name;
        return counter + "id\uFF1A".concat(track_id, "\t\u89C6\u89D2\uFF1A").concat(camera_name, "\n");
      }, '');
      if (!statisticBar) {
        statisticBar = createEl('div', {
          className: 'statistic-bar',
          innerHTML: newText,
          title: newTitle,
          style: {
            marginLeft: '150px',
            color: notManual_2D.length ? 'red' : '#ccc',
            fontSize: '19px',
            fontWeight: '600',
            cursor: 'pointer',
            position: 'absolute',
            left: '50%'
          },
          onclick: function onclick() {
            var _ds$resultDir2 = _ds.resultDir,
              all = _ds$resultDir2.all,
              all_2D = _ds$resultDir2.all_2D,
              all_3D = _ds$resultDir2.all_3D;
            copyToClipboard("".concat(all_3D, "\t").concat(all_2D, "\t").concat(all)).then(function (resolve) {
              showMessage('复制成功', {
                type: 'success',
                showTime: 1000
              });
            });
          }
        });
        modeSwitch.insertAdjacentElement('afterend', statisticBar);
      } else {
        statisticBar.innerHTML = newText;
        statisticBar.style.color = notManual_2D.length ? 'red' : '#ccc';
        statisticBar.title = newTitle;
      }
    }
  };
  hijackWS();
  hijackXHR(function () {
    var xhr = this;
    if (xhr.responseURL == 'http://39.104.65.87:8778/api/job/annotation') statistic();
  });
  var init = {};
  var isSelShape = false;
  var selType_scheme = null;
  var attrScheme_switch = null;
  var attrScheme_checkbox = null;
  var roundCount = 1;
  Obs(document.body, function (mrs) {
    var _firstAddedNode$match;
    var firstAddedNode = mrs[0].addedNodes[0];
    if (firstAddedNode !== null && firstAddedNode !== void 0 && (_firstAddedNode$match = firstAddedNode.matches) !== null && _firstAddedNode$match !== void 0 && _firstAddedNode$match.call(firstAddedNode, '.ant-checkbox-wrapper') && firstAddedNode.textContent == '不贴合') {
      var commentDialog = $$('.ant-modal-content').find(function (item) {
        return item.textContent.startsWith('批注');
      });
      var checkboxWrap = commentDialog.$('.mb-4.relative');
      var checkboxLabels = commentDialog.$$('.ant-checkbox-group label');
      var textarea = commentDialog.$('textarea');
      commentDialog.onmousedown = function (e) {
        var _e$target$matches, _e$target;
        if (e.button !== 2 || (_e$target$matches = (_e$target = e.target).matches) !== null && _e$target$matches !== void 0 && _e$target$matches.call(_e$target, '.phrase-btn')) return;
        commentDialog.$('.ant-modal-close').click();
      };
      var quickPhraseWrap = createEl('div', {
        className: 'quickPhrase-wrap'
      });
      var scheme = {
        '方位': {
          '←': '左边框',
          '↑': '上边框',
          '→': '右边框',
          '↓': '下边框',
          '角度': '角度',
          '顶视': '顶视图',
          '侧视': '侧视图',
          '后视': '后视图'
        },
        '贴合': {
          '收': '往里收',
          '扩': '往外扩',
          '上移': '整体上移',
          '下移': '整体下移',
          '左移': '整体左移',
          '右移': '整体右移',
          '↶': '逆时针旋转（左旋）',
          '↷': '顺时针旋转（右旋）',
          '飘空': '3D框飘空',
          '下陷': '3D框下陷',
          '稳定边': '贴合稳定边',
          '地线': '检查地线'
        },
        '尺寸': {
          '长': '长度',
          '宽': '宽度',
          '高': '高度',
          '脑补': '脑补'
        },
        '类型': {
          '6v': '6v',
          '不给6v': '不给6v',
          '面包': '面包车',
          '依维柯': '依维柯',
          '不带厢': '不带厢的货车',
          '箱货': '厢式货车',
          '巴士': '巴士',
          '轿车': '轿车',
          '皮卡': '皮卡',
          '骑行': '骑行'
        },
        '可见': {
          '可见': '可见',
          '不可见': '不可见'
        },
        '遮挡': {
          '0-30': '遮挡0-30',
          '30-50': '遮挡30-50',
          '>50': '遮挡>50'
        },
        '截断': {
          '0-30': '截断0-30',
          '30-80': '截断30-80',
          '>80': '截断>80'
        },
        '隔离': {
          '无隔离': '无隔离',
          '可跨越': '可跨越隔离',
          '不可跨越': '不可跨越隔离'
        },
        '其他': {
          '漏标': '漏标',
          '漏点': '漏点',
          '没框全': '没框全',
          '舍弃点云': '适当舍弃点云'
        },
        '补充': {
          '前后帧检查': '前后帧检查',
          '伪3D': '参照伪3D'
        }
      };
      var checkboxMap = {
        '不贴合': ['贴合', '方位'],
        '标签&属性错误': ['类型', '可见', '遮挡', '截断', '隔离'],
        '尺寸偏差': ['尺寸'],
        '方向错误': [],
        '多标': [],
        '其它': ['其他']
      };
      var _loop = function _loop(k1) {
        var btnWrap = createEl('div', {
          className: 'btn-wrap',
          style: {
            display: 'flex',
            marginBottom: '12px'
          }
        });
        var title = createEl('div', {
          className: 'btn-title',
          innerText: "".concat(k1, "\uFF1A"),
          style: {
            fontSize: '13px'
          }
        });
        btnWrap.append(title);
        var _loop2 = function _loop2() {
          var phrase = scheme[k1][k2];
          var btn_style = {
            padding: '0px 5px',
            height: '20px',
            lineHeight: '20px',
            margin: '0 5px 0 0',
            backgroundColor: 'rgb(136, 136, 136)',
            color: 'rgb(255, 255, 255)',
            fontSize: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          };
          var btn = createEl('div', {
            className: 'phrase-btn',
            innerText: k2,
            style: btn_style,
            onmousedown: function onmousedown(e) {
              var findIdx = Object.values(checkboxMap).findIndex(function (arr) {
                return arr.includes(k1);
              });
              if (findIdx !== -1) {
                checkboxLabels.forEach(function (label) {
                  var checkbox = label.$('input');
                  if (label.textContent === Object.keys(checkboxMap)[findIdx] && !checkbox.checked) checkbox.click();
                });
                if (e.button === 2) {
                  setTimeout(function () {
                    checkboxLabels.forEach(function (label, idx) {
                      var checkbox = label.$('input');
                      if (label.textContent !== Object.keys(checkboxMap)[findIdx] && checkbox.checked) setTimeout(function () {
                        return checkbox.click();
                      }, idx * 100);
                    });
                  });
                }
              }
              var value = textarea.value;
              if (e.button === 0) {
                setTextAreaValue(textarea, "".concat(value).concat(value ? '；' : '').concat(phrase));
              } else if (e.button === 2) {
                setTextAreaValue(textarea, "".concat(phrase));
              }
            }
          });
          btnWrap.append(btn);
        };
        for (var k2 in scheme[k1]) {
          _loop2();
        }
        quickPhraseWrap.append(btnWrap);
      };
      for (var k1 in scheme) {
        _loop(k1);
      }
      checkboxWrap.insertAdjacentElement('afterend', quickPhraseWrap);
      quickPhraseWrap.insertAdjacentElement('afterend', commentDialog.$('.flex.items-center.justify-between.mt-4'));
    }
    mrs.forEach(function (mr) {
      _toConsumableArray(mr.addedNodes).forEach(function (an) {
        var _an$matches, _an$firstChild, _an$firstChild$matche, _an$matches3, _an$matches4, _an$matches5, _an$matches6, _an$matches7, _an$matches8, _an$matches9, _an$matches10, _an$textContent, _an$matches11, _an$matches12, _an$matches13, _an$matches15, _an$matches16, _an$matches17, _an$firstChild2, _an$firstChild2$match, _an$matches18, _an$matches19;
        _ds.logAn && console.log(roundCount, an);
        if ((_an$matches = an.matches) !== null && _an$matches !== void 0 && _an$matches.call(an, '.cvpc-fusion-image-view')) {
          Obs(an, function (mrs) {
            // console.log(mrs)
            mrs.forEach(function (mr) {
              _toConsumableArray(mr.addedNodes).forEach(function (an) {
                var _an$matches2;
                if ((_an$matches2 = an.matches) !== null && _an$matches2 !== void 0 && _an$matches2.call(an, '.fusion-image-view-card')) {
                  var imgs = $$('.fusion-image-view-card');
                  if (['front', '后'].some(function (str, idx) {
                    return imgs[idx].$('.fusion-camera-name').textContent !== str;
                  })) {
                    adjustImg();
                  }
                }
              });
            });
          }, {
            childList: true,
            subtree: true
          });
        }
        if ((_an$firstChild = an.firstChild) !== null && _an$firstChild !== void 0 && (_an$firstChild = _an$firstChild.firstChild) !== null && _an$firstChild !== void 0 && (_an$firstChild$matche = _an$firstChild.matches) !== null && _an$firstChild$matche !== void 0 && _an$firstChild$matche.call(_an$firstChild, '.fusion-image-view-card')) {
          adjustImg();
        }
        if ((_an$matches3 = an.matches) !== null && _an$matches3 !== void 0 && _an$matches3.call(an, '.comment-edit-dialog')) {
          an.onmousedown = function (e) {
            var _e$target$matches2, _e$target2, _an$$;
            if (e.button !== 2 || (_e$target$matches2 = (_e$target2 = e.target).matches) !== null && _e$target$matches2 !== void 0 && _e$target$matches2.call(_e$target2, '.phrase-btn')) return;
            (_an$$ = an.$('.common-icon-button')) === null || _an$$ === void 0 || _an$$.click();
          };
        }
        if ((_an$matches4 = an.matches) !== null && _an$matches4 !== void 0 && _an$matches4.call(an, '.comment-edit-dialog')) {
          var operatorBar = an.$('.comment-card__footer');
          if (operatorBar) {
            var tip = '前后帧检查';
            var btn = createEl('div', {
              className: 'phrase-btn',
              innerText: tip,
              style: {
                padding: '0px 5px',
                width: '75px',
                height: '20px',
                lineHeight: '20px',
                margin: '10px 0 0 278px',
                backgroundColor: 'rgb(136, 136, 136, .3)',
                color: 'rgb(255, 255, 255)',
                fontSize: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                userSelect: 'none'
              },
              onmousedown: function onmousedown(e) {
                var textarea = an.$('textarea');
                if (!textarea) an.$('.mr-1.comment-icon-btn').click();
                setTimeout(function () {
                  textarea = an.$('textarea');
                  var value = textarea.value;
                  if (e.button === 0) {
                    setTextAreaValue(textarea, "".concat(value).concat(value ? '；' : '').concat(tip));
                  } else if (e.button === 2) {
                    setTextAreaValue(textarea, "".concat(tip));
                  }
                });
              }
            });
            operatorBar.insertAdjacentElement('beforebegin', btn);
          }
        }
        if ((_an$matches5 = an.matches) !== null && _an$matches5 !== void 0 && _an$matches5.call(an, '.ant-radio-wrapper') && an.textContent === '矩形') {
          var _commentDialog$matche;
          var _commentDialog = new Array(5).fill(1).reduce(function (res, item) {
            return res === null || res === void 0 ? void 0 : res.parentElement;
          }, an);
          if (_commentDialog !== null && _commentDialog !== void 0 && (_commentDialog$matche = _commentDialog.matches) !== null && _commentDialog$matche !== void 0 && _commentDialog$matche.call(_commentDialog, '.ant-modal-content')) {
            var _operatorBar = createEl('div', {
              className: 'operator-bar',
              style: {
                display: 'flex',
                margin: '-8px 0 15px 0',
                userSelect: 'none'
              }
            });
            ['可见车身', '车头', '车尾', '车轮', '人头'].forEach(function (tip) {
              var btn = createEl('div', {
                className: 'phrase-btn',
                innerText: tip,
                style: {
                  padding: '0px 5px',
                  height: '20px',
                  lineHeight: '20px',
                  margin: '0 5px 0 0',
                  backgroundColor: 'rgb(136, 136, 136)',
                  color: 'rgb(255, 255, 255)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  userSelect: 'none'
                },
                onmousedown: function onmousedown(e) {
                  var textarea = _commentDialog.$('textarea');
                  var value = textarea.value;
                  if (e.button === 0) {
                    setTextAreaValue(textarea, "".concat(value).concat(value ? '；' : '').concat(tip));
                  } else if (e.button === 2) {
                    setTextAreaValue(textarea, "".concat(tip));
                  }
                }
              });
              _operatorBar.append(btn);
            });
            _commentDialog.$('.mb-4.relative').insertAdjacentElement('afterend', _operatorBar);
          }
        }
        if (an !== null && an !== void 0 && (_an$matches6 = an.matches) !== null && _an$matches6 !== void 0 && _an$matches6.call(an, '.theme-dark') && an !== null && an !== void 0 && an.textContent.startsWith('高级显示过滤')) {
          var shapeSelect_callback = function shapeSelect_callback() {
            an.$$('.custom-switch').forEach(function (item) {
              if (item.parentElement.parentElement.textContent == '形状筛选') {
                if (!item.matches('.checked')) {
                  item.click();
                  isSelShape = true;
                } else {
                  var typePanel = $$('.MuiBox-root.css-by4vme').find(function (item) {
                    return item.textContent.startsWith('立方体');
                  });
                  if (typePanel) shapeSelect();
                }
              } else if (item.matches('.checked')) {
                item.click();
              }
            });
          };
          var typeSelect_callback = function typeSelect_callback(scheme) {
            an.$$('.custom-switch').forEach(function (item) {
              if (item.parentElement.parentElement.textContent == '标签筛选') {
                if (!item.matches('.checked')) {
                  item.click();
                  selType_scheme = scheme;
                } else {
                  var typePanel = $$('.MuiBox-root.css-by4vme').find(function (item) {
                    return item.textContent.startsWith('障碍物');
                  });
                  if (typePanel) typeSelect(scheme);
                }
              } else if (item.matches('.checked')) {
                item.click();
              }
            });
          };
          var attributeSelect_callback = function attributeSelect_callback(scheme_switch, scheme_checkbox) {
            var switchNames = ['标签筛选', '属性筛选', '批注筛选', '形状筛选', '通道筛选'];
            an.$$('.custom-switch').forEach(function (item) {
              var text = item.parentElement.parentElement.children[0].textContent;
              if (text == '属性筛选') {
                if (!item.matches('.checked')) {
                  item.click();
                  attrScheme_switch = scheme_switch;
                  attrScheme_checkbox = scheme_checkbox;
                } else {
                  var attrPanel = $$('.MuiBox-root.css-by4vme').find(function (item) {
                    return item.textContent.startsWith('可见度');
                  });
                  if (attrPanel) attrSelect(scheme_switch, scheme_checkbox);
                }
              } else if (item.matches('.checked') && switchNames.includes(text)) {
                item.click();
              }
            });
          };
          var takeBack = function takeBack() {
            an.$$('.custom-switch').forEach(function (item) {
              if (item.matches('.checked')) item.click();
            });
          };
          an.onmousedown = function (e) {
            if (e.button !== 2) return;
            var btn_scaleUp = an.$$('.mini-icon-button').find(function (btn) {
              var svg = btn.$('svg');
              if (!svg) return;
              return svg.getAttribute('xmlns') == 'http://www.w3.org/2000/svg';
            });
            btn_scaleUp.click();
          };
          var _operatorBar2 = createEl('div', {
            className: 'operator-bar',
            style: {
              margin: '10px 20px 0',
              width: '210px',
              userSelect: 'none'
            }
          });
          var _scheme = [{
            '收起': takeBack,
            '3D框': shapeSelect_callback,
            '主框': typeSelect_callback.bind(_this2, {
              '障碍物': true,
              '人': true,
              '车头车尾车身': false,
              '车轮': false,
              '交通标识': true,
              '静态障碍物': true,
              '6v标注': true
            }),
            '附属框': typeSelect_callback.bind(_this2, {
              '障碍物': false,
              '人': false,
              '车头车尾车身': true,
              '车轮': true,
              '交通标识': false,
              '静态障碍物': false,
              '6v标注': true
            }),
            '6v': typeSelect_callback.bind(_this2, {
              '障碍物': false,
              '人': false,
              '车头车尾车身': false,
              '车轮': false,
              '交通标识': false,
              '静态障碍物': false,
              '6v标注': true
            })
          }, {
            '可见': attributeSelect_callback.bind(_this2, '可见度_6v', '可见'),
            '不可见': attributeSelect_callback.bind(_this2, '可见度_6v', '不可见')
          }, {
            '遮挡0~30': attributeSelect_callback.bind(_this2, '遮挡', '0~30%'),
            '遮挡30~50': attributeSelect_callback.bind(_this2, '遮挡', ' 30%-50%'),
            '遮挡>50': attributeSelect_callback.bind(_this2, '遮挡', '超过 50%')
          }, {
            '无隔离': attributeSelect_callback.bind(_this2, '隔离', '无隔离'),
            '可跨越': attributeSelect_callback.bind(_this2, '隔离', '可跨越隔离'),
            '不可跨越': attributeSelect_callback.bind(_this2, '隔离', '不可跨越隔离')
          }, {
            '正常曝光': attributeSelect_callback.bind(_this2, '车灯曝光', '正常曝光'),
            '过曝': attributeSelect_callback.bind(_this2, '车灯曝光', '过爆')
          }];
          _scheme.forEach(function (subScheme) {
            var operatorWrap = createEl('div', {
              className: 'operator-wrap',
              style: {
                display: 'flex',
                marginBottom: '12px'
              }
            });
            for (var btnName in subScheme) {
              var _btn = createEl('div', {
                innerText: btnName,
                style: {
                  padding: '0px 5px',
                  height: '20px',
                  lineHeight: '20px',
                  margin: '0 5px 0 0',
                  backgroundColor: 'rgb(136, 136, 136)',
                  color: 'rgb(255, 255, 255)',
                  fontSize: '12px',
                  cursor: 'pointer'
                },
                onclick: subScheme[btnName]
              });
              operatorWrap.append(_btn);
            }
            _operatorBar2.append(operatorWrap);
          });
          an.$('.handle').insertAdjacentElement('afterend', _operatorBar2);
        }
        if (isSelShape && an !== null && an !== void 0 && (_an$matches7 = an.matches) !== null && _an$matches7 !== void 0 && _an$matches7.call(an, '.MuiBox-root.css-by4vme') && an.textContent.startsWith('立方体')) {
          shapeSelect();
          isSelShape = false;
        }
        if (selType_scheme && an !== null && an !== void 0 && (_an$matches8 = an.matches) !== null && _an$matches8 !== void 0 && _an$matches8.call(an, '.MuiBox-root.css-by4vme') && an.textContent.startsWith('障碍物')) {
          typeSelect(selType_scheme);
          selType_scheme = null;
        }
        if (attrScheme_switch && an !== null && an !== void 0 && (_an$matches9 = an.matches) !== null && _an$matches9 !== void 0 && _an$matches9.call(an, '.MuiBox-root.css-by4vme') && an.textContent.startsWith('可见度')) {
          attrSelect(attrScheme_switch, attrScheme_checkbox);
          attrScheme_switch = void 0;
          attrScheme_checkbox = void 0;
        }
        function shapeSelect() {
          var typePanel = $$('.MuiBox-root.css-by4vme').find(function (item) {
            return item.textContent.startsWith('立方体');
          });
          typePanel.$$('label').forEach(function (item) {
            var checkbox = item.$('input[type="checkbox"]');
            var text = item.textContent;
            if (text == '立方体') {
              if (!checkbox.checked) checkbox.click();
            } else if (checkbox.checked) {
              checkbox.click();
            }
          });
        }
        function typeSelect(scheme) {
          var typePanel = $$('.MuiBox-root.css-by4vme').find(function (item) {
            return item.textContent.startsWith('障碍物');
          });
          typePanel.$$('label').forEach(function (item) {
            var checkbox = item.$('input[type="checkbox"]');
            var text = item.textContent;
            var schemeKeys = Object.keys(scheme);
            if (schemeKeys.includes(text)) {
              if (scheme[text] && !checkbox.checked || !scheme[text] && checkbox.checked) checkbox.click();
            } else if (schemeKeys.filter(function (key) {
              return !scheme[key];
            }).includes(item.parentElement.previousElementSibling.textContent) && checkbox.checked) {
              checkbox.click();
            }
          });
        }
        function attrSelect(scheme_switch, scheme_checkbox) {
          var attrPanel = $$('.MuiBox-root.css-by4vme').find(function (item) {
            return item.textContent.startsWith('可见度');
          });
          attrPanel.$$('.MuiBox-root.css-feywyu').forEach(function (header) {
            var btn_swich = header.$('.custom-switch');
            if (scheme_switch === header.textContent) {
              header.scrollIntoView({
                behavior: "smooth",
                block: "center"
              });
              if (!btn_swich.matches('.checked')) setTimeout(function () {
                return btn_swich.click();
              });
            } else if (btn_swich.matches('.checked')) {
              setTimeout(function () {
                return btn_swich.click();
              });
            }
          });
          setTimeout(function () {
            attrPanel.$$('input[type="checkbox"]').filter(function (checkbox) {
              return !checkbox.disabled;
            }).forEach(function (checkbox) {
              if (scheme_checkbox === checkbox.value) {
                if (!checkbox.checked) checkbox.click();
              } else if (checkbox.checked) {
                checkbox.click();
              }
            });
          });
        }
        if (an !== null && an !== void 0 && (_an$matches10 = an.matches) !== null && _an$matches10 !== void 0 && _an$matches10.call(an, 'canvas[data-engine="three.js r139"]')) {
          [an, document.body].forEach(function (target) {
            target.addEventListener('mousedown', function (e) {
              if (e.button !== 1) return;
              setTimeout(function () {
                ['keydown', 'keyup'].some(function (event) {
                  document.body.dispatchEvent(new KeyboardEvent(event, {
                    code: "KeyH",
                    key: "h",
                    keyCode: 72,
                    bubbles: true
                  }));
                });
              });
            });
          });
        }
        if (!init.moreTrigger) {
          var moreTrigger = $('.bb-toolbar-item .more-trigger');
          if (moreTrigger) {
            moreTrigger.click();
            init.moreTrigger = true;
          }
        }
        if (!init.popover_anno && (_an$textContent = an.textContent) !== null && _an$textContent !== void 0 && _an$textContent.startsWith('基础工具')) {
          an.style.opacity = '0';
          setTimeout(function () {
            an.style.opacity = null;
          }, 2000);
          an.$$('.float-menu-item').find(function (item) {
            return item.textContent.includes('障碍物 / 轿车(轿车)');
          }).click();
          var _moreTrigger = $('.bb-toolbar-item .more-trigger');
          _moreTrigger.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true
          }));
          _moreTrigger.click();
          init.popover_anno = true;
        }
        if (!init.btn_asideview_set) {
          var btn_asideview_set = $$('.cvpc-fusion-image-view .cvpc-editor-window__header .common-icon-button').find(function (btn) {
            var use = btn.$('use');
            if (!use) return;
            return use.getAttribute('xlink:href') == '#gear';
          });
          if (btn_asideview_set) {
            btn_asideview_set.click();
            init.btn_asideview_set = true;
          }
        }
        if (!init.asideview_setting && (_an$matches11 = an.matches) !== null && _an$matches11 !== void 0 && _an$matches11.call(an, '.ant-modal-root') && an.textContent.startsWith('设置缩放')) {
          an.style.opacity = '0';
          var setting = {
            '2D滚轮缩放比例': 1.8,
            '相机投影视距': 500
          };
          an.$$('.settings-panel__block-content-item').forEach(function (item) {
            Object.entries(setting).find(function (_ref2) {
              var _ref3 = _slicedToArray(_ref2, 2),
                k = _ref3[0],
                v = _ref3[1];
              if (item.textContent.startsWith(k)) setInputValue(item.$('.settings-panel__block input'), v);
            });
          });
          an.$('button.ant-modal-close').click();
          init.asideview_setting = true;
        }
        if (!init.btn_mainview_set) {
          var _$$$find;
          var btn_mainview_set = (_$$$find = $$('.cvpc-editor-layout__mainview .bb-panel .adv-menu-item').find(function (item) {
            return item.textContent.startsWith('设置');
          })) === null || _$$$find === void 0 ? void 0 : _$$$find.$('.adv-menu-item__icon');
          if (btn_mainview_set) {
            btn_mainview_set.click();
            init.btn_mainview_set = true;
          }
        }
        if (!init.mainview_setting && (_an$matches12 = an.matches) !== null && _an$matches12 !== void 0 && _an$matches12.call(an, '.comment-edit-dialog') && an.textContent.startsWith('设置结果显示')) {
          var _an$$$$find;
          var mouseConfig = an.$$('.swiper-slide').find(function (item) {
            return item.textContent.startsWith('操作');
          });
          var configs = mouseConfig.$$('.MuiStack-root.css-19gmnzb');
          var dic = {
            '3D右键拖拽速度': 100,
            'QE旋转角度': 0.1,
            'WASD单次移动距离': 0.01
          };
          configs.forEach(function (item) {
            var tit = item.$('.MuiTypography-body-sm').textContent;
            if (Object.keys(dic).includes(tit)) {
              setInputValue(item.$('input'), dic[tit]);
            }
          });
          (_an$$$$find = an.$$('.mini-icon-button').find(function (btn) {
            var svg = btn.$('svg');
            if (!svg) return;
            return svg.getAttribute('xmlns') == 'http://www.w3.org/2000/svg';
          })) === null || _an$$$$find === void 0 || _an$$$$find.click();
          init.mainview_setting = true;
        }
        if ((_an$matches13 = an.matches) !== null && _an$matches13 !== void 0 && _an$matches13.call(an, '.MuiBox-root')) {
          var btn_group_break = an.$$('.common-icon-button__icon').find(function (btn) {
            var use = btn.$('use');
            if (!use) return;
            return use.getAttribute('xlink:href') == '#group-break';
          });
          if (btn_group_break) {
            btn_group_break.addEventListener('click', function () {
              requestAnimationFrame(function () {
                new Array(2).fill(1).forEach(function () {
                  return $('.bb-row-tmpl--group-active-2 .bb-row-tmpl__content').click();
                });
              });
            });
          }
        }
        if (['.cvpc-float-toolbar', '.fusion-image-view-editor__toolbar2'].some(function (sel) {
          var _an$matches14;
          return (_an$matches14 = an.matches) === null || _an$matches14 === void 0 ? void 0 : _an$matches14.call(an, sel);
        })) {
          ['#group-make', '#group-break'].forEach(function (xlink) {
            var btn = an.$$('.common-icon-button__icon').find(function (btn) {
              var use = btn.$('use');
              if (!use) return;
              return use.getAttribute('xlink:href') == xlink;
            });
            if (btn) {
              btn.addEventListener('click', function () {
                requestAnimationFrame(function () {
                  new Array(2).fill(1).forEach(function () {
                    return $('.bb-row-tmpl--group-active-2 .bb-row-tmpl__content').click();
                  });
                });
              });
            }
          });
        }
        if ((_an$matches15 = an.matches) !== null && _an$matches15 !== void 0 && _an$matches15.call(an, '.MuiBox-root.css-15oc3w2') && an.textContent.includes('暂停状态')) {
          an.style.opacity = '0';
          _ds.isSendTime = false;
          an.addEventListener('mousemove', function () {
            an.$('button').click();
            _ds.isSendTime = true;
          });
        }
        if ((_an$matches16 = an.matches) !== null && _an$matches16 !== void 0 && _an$matches16.call(an, '.comment-edit-dialog') && an.textContent.startsWith('编辑')) {
          var _selectType = function selectType(type) {
            var _menu$, _menu$2;
            var selectorWrap = $('.ant-select-dropdown');
            if (!selectorWrap) return setTimeout(function () {
              return _selectType(type);
            });
            var menu = selectorWrap.getElementsByClassName('ant-cascader-menu');
            var _exec = /(.*) \/ (.*)/.exec(type),
              _exec2 = _slicedToArray(_exec, 3),
              e1 = _exec2[0],
              tit_l1 = _exec2[1],
              tit_l2 = _exec2[2];
            (_menu$ = menu[0]) === null || _menu$ === void 0 || (_menu$ = _menu$.$("li[title=\"".concat(tit_l1, "\"]"))) === null || _menu$ === void 0 || _menu$.click(); //一级

            var target = (_menu$2 = menu[1]) === null || _menu$2 === void 0 ? void 0 : _menu$2.$("li[title=\"".concat(tit_l2, "\"]"));
            if (!target) return setTimeout(function () {
              return _selectType(type);
            }), true;
            target.click();
          };
          an.style.opacity = '.92';
          clickTrigger(an, function (e) {
            var btn_scaleDown = an.$$('.mini-icon-button').find(function (btn) {
              var svg = btn.$('svg');
              if (!svg) return;
              return svg.getAttribute('xmlns') == 'http://www.w3.org/2000/svg';
            });
            btn_scaleDown.click();
          }, 3, 0);
          var btnStyle = {
            padding: '0px 5px',
            height: '20px',
            lineHeight: '20px',
            margin: '0 5px 0 0',
            backgroundColor: 'rgb(136, 136, 136)',
            color: 'rgb(255, 255, 255)',
            fontSize: '12px',
            cursor: 'pointer',
            userSelect: 'none'
          };
          var btn_simplify = createEl('div', {
            className: 'btn_simplify',
            style: Object.assign(_objectSpread({}, btnStyle), {
              fontSize: '10px',
              borderRadius: '4px',
              transform: 'scale(.8)',
              opacity: '.8'
            }),
            innerText: '简化',
            onclick: function onclick() {
              var els = [$$('p.MuiTypography-title-sm').find(function (tit) {
                return tit.textContent == '标签';
              }),
              //label
              $$('.MuiBox-root.css-1rr4qq7')[2].$('.css-0'),
              //geometry
              $('.attr-card__footer') //footer
              ];
              els.forEach(function (el) {
                var display = el.style.display;
                el.style.display = display === '' ? 'none' : null;
              });
            }
          });
          an.$('.handle .css-50pc0k').insertAdjacentElement('afterbegin', btn_simplify);
          var operatorWrap = createEl('div', {});
          var _scheme2 = [[
          // ['障碍物 / 轿车', '轿车'],
          // ['障碍物 / 皮卡&面包车', '面'],
          // ['障碍物 / 依维柯', '依'],
          // ['障碍物 / 巴士', '巴'],
          // ['障碍物 / 厢式货车', '箱'],
          // ['障碍物 / 不带车厢货车', '不带箱'],
          ['人 / 行人', '人'], ['障碍物 / 摩托&电动车', '二轮'],
          // ['障碍物 / 自行车', '自行'],
          ['障碍物 / 电动三轮车', '三轮'], ['人 / 骑电动&摩托车的人', '二轮骑行'], ['人 / 骑三轮车的人', '三轮骑行'], ['人 / 骑自行车的人', '自行车骑行']],
          // [
          // ],
          [['车头车尾车身 / 车头', '车头'], ['车头车尾车身 / 车尾', '车尾'], ['车头车尾车身 / 可见车身', '可见车身'], ['车轮 / 前车轮', '前轮'], ['车轮 / 后车轮', '后轮'], ['障碍物 / 忽略框', '忽略']
          // ['车轮 / 中轮', '中轮'],
          // ['人 / 人头', '人头'],
          ], [['6v标注 / 轿车', '6v轿'], ['6v标注 / 客车', '客'], ['6v标注 / 货车', '货'], ['6v标注 / 人力两轮车（无人骑行））', '人力二轮'], ['6v标注 / 非人力两轮车（无人骑行）', '非人力二轮'], ['6v标注 / 三轮车', '三轮'], ['6v标注 / 行人', '行人'], ['6v标注 / 骑行的人', '骑行']]
          // [
          //     ['交通标识 / 标识牌', '标识牌'],
          //     ['交通标识 / 交通灯', '交通灯'],
          //     ['交通标识 / 斑马线', '斑马线'],
          //     ['交通标识 / 路面箭头', '箭头'],
          //     ['交通标识 / 路面限速字符', '限速字符'],
          // ],
          // [
          //     ['静态障碍物 / 锥桶', '锥桶'],
          //     ['静态障碍物 / 交通柱', '交通柱'],
          //     ['静态障碍物 / 防撞桶', '防撞桶'],
          //     ['静态障碍物 / 水马/隔离墩', '水马'],
          // ],
          ];
          _scheme2.forEach(function (group, idx) {
            var groupWrap = createEl('div', {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                marginTop: "".concat(idx ? '8px' : null)
              }
            });
            group.forEach(function (_ref4) {
              var _ref5 = _slicedToArray(_ref4, 2),
                type = _ref5[0],
                text = _ref5[1];
              var btn = createEl('div', {
                style: btnStyle,
                innerText: text,
                onclick: function onclick() {
                  an.$$('.ant-select-selector')[1].dispatchEvent(new MouseEvent('mousedown', {
                    bubbles: true
                  }));
                  _selectType(type);
                  if (type.startsWith('6v标注')) showMessage('你选择了6v，注意视情况赋予新id');
                }
              });
              groupWrap.append(btn);
            });
            operatorWrap.append(groupWrap);
          });
          an.$('.MuiGrid-root.MuiGrid-container').insertAdjacentElement('afterend', operatorWrap);
        }
        if ((_an$matches17 = an.matches) !== null && _an$matches17 !== void 0 && _an$matches17.call(an, '.MuiStack-root.css-1afers6')) {
          $('.btn_simplify').click();
        }
        if ((_an$firstChild2 = an.firstChild) !== null && _an$firstChild2 !== void 0 && (_an$firstChild2$match = _an$firstChild2.matches) !== null && _an$firstChild2$match !== void 0 && _an$firstChild2$match.call(_an$firstChild2, '.ant-tooltip')) {
          ['点云3D结果', '2D结果'].some(function (text) {
            return an.textContent.startsWith(text);
          }) && (an.style.display = 'none');
        }
        if ((_an$matches18 = an.matches) !== null && _an$matches18 !== void 0 && _an$matches18.call(an, '.MuiStack-root.css-1afers6')) {
          var checkbox = createEl('input', {
            type: 'checkbox',
            checked: localStorage.getItem('select_auto') === 'true',
            oninput: function oninput() {
              localStorage.setItem('select_auto', this.checked);
            },
            style: {
              marginLeft: '6px'
            }
          });
          var attrWrap = $$('.MuiStack-root.css-19gmnzb').find(function (attrWrap) {
            return attrWrap.textContent.startsWith('可见度_6v');
          });
          attrWrap === null || attrWrap === void 0 || attrWrap.$('.MuiStack-root.css-j33zza').append(checkbox);
          if (attrWrap !== null && attrWrap !== void 0 && attrWrap.$$('input[type="radio"]').every(function (input) {
            return !input.checked;
          }) && checkbox.checked) {
            attrWrap.$('input[value="可见"]').click();
            var row = attrWrap.$('.MuiBox-root.css-0');
            row.style.background = 'rgba(82, 106, 255, .6)';
          }
        }
        if (!init.header && $('.cvpc-editor-layout__header')) {
          statistic();
          taskInfo().then(function (res) {
            var isHoverBtn = false;
            var shareWrap = createEl('div', {
              className: 'share-wrap',
              style: _defineProperty(_defineProperty(_defineProperty({
                overflow: 'hidden',
                position: 'absolute',
                display: 'flex',
                height: '19px',
                borderRadius: '9.5px'
              }, "position", 'absolute'), "left", '610px'), "color", '#fff'),
              onmouseenter: function onmouseenter() {
                var redirectInput = $('.redirect-input');
                redirectInput.style.width = '70px';
                redirectInput.focus();
              }
            });
            var redirect_input = createEl('input', {
              className: 'redirect-input',
              style: {
                width: '0',
                padding: '0',
                color: '#333',
                fontSize: '12px',
                outline: 'none',
                border: 'none',
                textIndent: '8px',
                transition: '.3s'
              },
              onblur: function onblur() {
                if (!isHoverBtn) {
                  $('.redirect-input').style.width = 0;
                }
              },
              onmouseenter: function onmouseenter() {
                this.focus();
              }
            });
            var btn_redirect = createEl('div', {
              className: 'redirect-btn',
              innerText: '切换',
              style: {
                padding: '0 5px',
                height: '19px',
                lineHeight: '19px',
                backgroundColor: '#888',
                color: '#fff',
                fontSize: '12px',
                cursor: 'pointer'
              },
              onmouseenter: function onmouseenter() {
                isHoverBtn = true;
              },
              onmouseleave: function onmouseleave() {
                var _document$activeEleme;
                isHoverBtn = false;
                if (!((_document$activeEleme = document.activeElement) !== null && _document$activeEleme !== void 0 && _document$activeEleme.matches('.redirect-input'))) {
                  $('.redirect-input').style.width = 0;
                }
              },
              onclick: function onclick() {
                $('.redirect-input').focus();
                var inputVal = $('.redirect-input').value;
                var inputVal_split = inputVal.split('\t');
                if (inputVal_split.length !== 2) {
                  return showMessage('内容不合法', {
                    type: 'warning'
                  });
                } else {
                  var _inputVal_split = _slicedToArray(inputVal_split, 2),
                    href = _inputVal_split[0],
                    userInfo = _inputVal_split[1];
                  try {
                    if (JSON.parse(userInfo)) {
                      localStorage.setItem('cvpc-user-info', userInfo);
                      location.href = href;
                    }
                  } catch (e) {
                    return showMessage('内容不合法', {
                      type: 'warning'
                    });
                  }
                }
              }
            });
            shareWrap.append(redirect_input, btn_redirect);
            $('.cvpc-editor-layout__header .mode-switch').insertAdjacentElement('beforebegin', shareWrap);
          });
          init.header = true;
        }
        if (!init.viewCard && $('.fusion-image-view-card')) {
          var allCard = $$('.fusion-image-view-card');
          allCard.forEach(function (card) {
            card.onmousedown = function (e) {
              if (e.button !== 2) return;
              var btn_scaleUp = card.$$('.mini-icon-button').find(function (btn) {
                var use = btn.$('use');
                if (!use) return;
                return use.getAttribute('xlink:href') == '#scale-up';
              });
              btn_scaleUp.click();
            };
          });
          init.viewCard = true;
        }
        if ((_an$matches19 = an.matches) !== null && _an$matches19 !== void 0 && _an$matches19.call(an, '.bb-flex-modal-anchor')) {
          clickTrigger(an, function (e) {
            var btn_scaleDown = an.$$('.mini-icon-button').find(function (btn) {
              var use = btn.$('use');
              if (!use) return;
              return use.getAttribute('xlink:href') == '#scale-down';
            });
            btn_scaleDown.click();
          }, 3, 0);
        }
        var btn_menu = $('.szh-menu-button.w-full');
        if (!init.btn_menu && btn_menu) {
          console.log(btn_menu);
          btn_menu.click();
          init.btn_menu = true;
        }
        var szh_menu = $('.szh-menu');
        if (!init.szh_menu && szh_menu) {
          //分组菜单
          szh_menu.$$('.ant-radio-wrapper').find(function (radio) {
            return radio.textContent.includes('按组');
          }).click();
          szh_menu.style.display = 'none';
          init.szh_menu = true;
        }
        function getIconBtn(xlink) {
          return $$('.mini-icon-button').filter(function (btn) {
            var use = btn.$('use');
            if (!use) return;
            return use.getAttribute('xlink:href') == xlink;
          });
        }
      });
      _toConsumableArray(mr.removedNodes).forEach(function (rn) {
        var _rn$matches;
        if ((_rn$matches = rn.matches) !== null && _rn$matches !== void 0 && _rn$matches.call(rn, '.MuiBox-root.css-15oc3w2') && rn.textContent.includes('暂停状态') && !_ds.isDebug) _ds.isSendTime = true;
      });
    });
    ++roundCount;
  });
  function adjustImg() {
    var imgs = document.getElementsByClassName('fusion-image-view-card');
    ['front', '后'].forEach(function (direction, idx) {
      _toConsumableArray(imgs).some(function (img) {
        if (img.$('.fusion-camera-name').textContent === direction) {
          imgs[idx].insertAdjacentElement('beforebegin', img);
          return true;
        }
      });
    });
  }
  document.body.addEventListener('keydown', function (e) {
    var keyCode = e.keyCode;
    _ds.logKeydown && console.log(keyCode, e);
    var isInput = ['input', 'textarea'].find(function (sel) {
      var activeEl = document.activeElement;
      if (!(activeEl !== null && activeEl !== void 0 && activeEl.matches(sel))) return;
      if (sel == 'input' && activeEl.type !== 'text') return false;
      return true;
    });
    if (isInput) return;
    var kcMap_display2D = {
      51: 0,
      52: 1
    };
    var map = [[function () {
      return keyCode == 67 && (e.altKey || e.shiftKey && !e.ctrlKey);
    }, function () {
      ['keydown', 'keyup'].forEach(function (event) {
        document.body.dispatchEvent(new KeyboardEvent(event, {
          code: "KeyC",
          key: "c",
          keyCode: 67,
          ctrlKey: event == 'keydown',
          bubbles: true
        }));
      });
      setTimeout(function () {
        ['keydown', 'keyup'].forEach(function (event) {
          document.body.dispatchEvent(new KeyboardEvent(event, {
            code: "KeyV",
            key: "v",
            keyCode: 86,
            ctrlKey: event == 'keydown',
            bubbles: true
          }));
        });
      });
      showMessage('触发复制粘贴');
    }], [function () {
      return keyCode == 9;
    }, function (e) {
      e.preventDefault();
      var modal2D = $('.bb-flex-modal-anchor .bb-flex-modal-wrapper');
      var box_fake = modal2D.$$('.mini-icon-button').find(function (btn) {
        var use = btn.$('use');
        if (!use) return;
        return use.getAttribute('xlink:href') == '#box';
      });
      box_fake === null || box_fake === void 0 || box_fake.click();
    }], [function () {
      return keyCode == 71;
    }, function () {
      var grouping = $$('.common-icon-button__icon').find(function (btn) {
        var use = btn.$('use');
        if (!use) return;
        return use.getAttribute('xlink:href') == '#group-make';
      });
      if (!grouping) return;
      grouping.click();
      showMessage('触发编组');
      new Array(2).fill(1).forEach(function () {
        return $('.bb-row-tmpl--group-active-2 .bb-row-tmpl__content').click();
      });
    }], [function () {
      return keyCode == 49;
    }, function () {
      ['keydown', 'keyup'].forEach(function (event) {
        document.body.dispatchEvent(new KeyboardEvent(event, {
          code: "ArrowLeft",
          key: "ArrowLeft",
          keyCode: 37,
          bubbles: true
        }));
      });
    }], [function () {
      return keyCode == 50;
    }, function () {
      ['keydown', 'keyup'].forEach(function (event) {
        document.body.dispatchEvent(new KeyboardEvent(event, {
          code: "ArrowRight",
          key: "ArrowRight",
          keyCode: 39,
          bubbles: true
        }));
      });
    }], [function () {
      return Object.keys(kcMap_display2D).some(function (kc) {
        return keyCode == kc;
      });
    }, function () {
      var btn_scale_all = $$('.mini-icon-button').filter(function (btn) {
        var use = btn.$('use');
        if (!use) return;
        return ['#scale-up', '#scale-down'].some(function (attr) {
          return use.getAttribute('xlink:href') == attr;
        });
      });
      btn_scale_all[kcMap_display2D[keyCode]].click();
    }]];
    map.forEach(function (item) {
      item[0]() && item[1](e);
    });
  });
  function taskInfo() {
    return _taskInfo.apply(this, arguments);
  }
  function _taskInfo() {
    _taskInfo = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var job_id, task_id, process_id;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            job_id = _ds.job_id, task_id = _ds.task_id, process_id = _ds.process_id;
            return _context.abrupt("return", fetch("http://39.104.65.87:8778/api/job/top_detail?job_id=".concat(job_id, "&task_id=").concat(task_id, "&process_id=").concat(process_id), {
              "headers": {
                "authorization": "".concat(localStorage.getItem('cvpc-editor-token'))
              },
              "body": null,
              "mode": "cors",
              "credentials": "include"
            }).then(function (res) {
              return res.json();
            }).then(function (res) {
              try {
                var task_name = res.task_name,
                  _task_id = res.task_id,
                  job_index = res.job_index;
                var taskInfoBar = createEl('div', {
                  className: 'taskInfo-bar',
                  innerHTML: "".concat(task_name).concat('&nbsp;'.repeat(2)).concat(_task_id, "-").concat(job_index),
                  style: {
                    position: 'absolute',
                    left: '400px',
                    fontSize: '12px',
                    color: '#fff',
                    cursor: 'pointer'
                  },
                  onclick: function onclick() {
                    copyToClipboard("".concat(location.href, "\t").concat(localStorage.getItem('cvpc-user-info')));
                    showMessage('复制成功', {
                      type: 'success'
                    });
                  }
                });
                $('.cvpc-editor-layout__header .bb-panel').insertAdjacentElement('afterend', taskInfoBar);
              } catch (e) {
                console.err('request error');
              }
            }));
          case 2:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _taskInfo.apply(this, arguments);
  }
  function statistic() {
    return _statistic.apply(this, arguments);
  }
  function _statistic() {
    _statistic = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var job_id, task_id, process_id;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            job_id = _ds.job_id, task_id = _ds.task_id, process_id = _ds.process_id;
            return _context2.abrupt("return", fetch("".concat(_ds.baseURL, "/ann_statistics/postil_detail?job_id=").concat(job_id, "&task_id=").concat(task_id, "&process_id=").concat(process_id), {
              "headers": {
                "authorization": "".concat(localStorage.getItem('cvpc-editor-token'))
              },
              "body": null,
              "mode": "cors",
              "credentials": "include"
            }).then(function (res) {
              return res.json();
            }).then(function (res) {
              var resultDir = {
                all: 0,
                all_real: 0,
                all_2D: 0,
                all_2D_real: 0,
                all_3D: 0,
                list_2D: [],
                list_3D: []
              };
              resultDir.all = resultDir.all_real = res[1][3];
              res.forEach(function (item) {
                var type = item[1];
                var count = item[3];
                type == '2D' ? (resultDir.all_2D += count, resultDir.all_2D_real += count, resultDir.list_2D.push(count)) : type == '3D' ? (resultDir.all_3D += count, resultDir.list_3D.push(count)) : void 0;
              });
              _ds.resultDir_draft = resultDir;
            }).then(function (res) {
              return fetch("http://39.104.65.87:8778/api/job/annotation?job_id=".concat(job_id, "&task_id=").concat(task_id, "&process_id=").concat(process_id), {
                "headers": {
                  "authorization": "".concat(localStorage.getItem('cvpc-editor-token'))
                },
                "mode": "cors",
                "credentials": "include"
              }).then(function (res) {
                return res.json();
              }).then(function (res) {
                if (!Array.isArray(res)) return;
                var data_parse = res.filter(function (item) {
                  return item.type == '2D';
                }).filter(function (item) {
                  var _JSON$parse = JSON.parse(item.shape_data),
                    width = _JSON$parse.width,
                    height = _JSON$parse.height;
                  if (width == 0 && height == 0) return;
                  return item;
                });
                console.log('data_parse', data_parse);
                var o = {
                  front: [],
                  后: [],
                  not_value: []
                };
                data_parse.forEach(function (item) {
                  var camera_name = item.camera_name;
                  if (camera_name) {
                    if (o[camera_name]) {
                      o[camera_name].push(item);
                    } else {
                      o[camera_name] = [item];
                    }
                  } else {
                    o.not_value.push(item);
                  }
                });
                var all_valid_camera = [].concat(_toConsumableArray(o.front), _toConsumableArray(o['后']));
                // console.log('all_valid_camera', all_valid_camera)

                var not_6v = all_valid_camera.filter(function (item) {
                  return item.label2[0].unique_id !== 'WVYXbf4Ilf23GGSv9Lw5J'; //6v
                });
                var notManual_2D = not_6v.filter(function (item) {
                  return !JSON.parse(item.shape_data)._isManual;
                });
                console.log('not_6v', not_6v);
                var resultDir = _ds.resultDir_draft;
                resultDir.all_2D_not6v = not_6v.length;
                resultDir.all_2D = not_6v.length;
                resultDir.all = resultDir.all_3D + resultDir.all_2D_not6v;
                resultDir.loss_2D = ((resultDir.all_2D_real - not_6v.length) / resultDir.all_2D_real).toFixed(2);
                resultDir.notManual_2D = notManual_2D;

                // console.log(_ds.resultDir)
              });
            }).then(function (res) {
              fetch("".concat(_ds.baseURL, "/postil/lists?job_id=").concat(job_id, "&task_id=").concat(task_id, "&process_id=").concat(process_id), {
                "headers": {
                  "authorization": "".concat(localStorage.getItem('cvpc-editor-token'))
                }
              }).then(function (res) {
                return res.json();
              }).then(function (res) {
                var mistakeList = res.data;
                _ds.resultDir_draft.mistakeList = mistakeList;
                _ds.resultDir_draft.accuracy = ((_ds.resultDir_draft.all - mistakeList.length) / _ds.resultDir_draft.all * 100).toFixed(2) + '%';
                _ds.resultDir = _ds.resultDir_draft;
              });
            }));
          case 2:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return _statistic.apply(this, arguments);
  }
})();
function Obs(target, callBack) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    childList: true,
    subtree: true,
    attributes: true,
    attributeOldValue: true
  };
  if (!target) return console.error('目标不存在');
  var ob = new MutationObserver(callBack);
  ob.observe(target, options);
  return ob;
}
function setStyle() {
  var _arguments = arguments;
  [[Map, function () {
    var styleMap = _arguments[0];
    var _iterator = _createForOfIteratorHelper(styleMap),
      _step;
    try {
      var _loop3 = function _loop3() {
        var _step$value = _slicedToArray(_step.value, 2),
          el = _step$value[0],
          styleObj = _step$value[1];
        !Array.isArray(el) ? setStyleObj(el, styleObj) : el.forEach(function (el) {
          return setStyleObj(el, styleObj);
        });
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop3();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }], [Element, function () {
    var _arguments2 = _slicedToArray(_arguments, 2),
      el = _arguments2[0],
      styleObj = _arguments2[1];
    setStyleObj(el, styleObj);
  }], [Array, function () {
    var _arguments3 = _slicedToArray(_arguments, 2),
      els = _arguments3[0],
      styleObj = _arguments3[1];
    els.forEach(function (el) {
      return setStyleObj(el, styleObj);
    });
  }]].some(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
      O = _ref7[0],
      fn = _ref7[1];
    return O.prototype.isPrototypeOf(_arguments[0]) ? (fn(), true) : false;
  });
  function setStyleObj(el, styleObj) {
    for (var attr in styleObj) {
      if (el.style[attr] !== undefined) {
        el.style[attr] = styleObj[attr];
      } else {
        //将key转为标准css属性名
        var formatAttr = attr.replace(/[A-Z]/, function (match) {
          return "-".concat(match.toLowerCase());
        });
        console.error(el, "\u7684 ".concat(formatAttr, " CSS\u5C5E\u6027\u8BBE\u7F6E\u5931\u8D25!"));
      }
    }
  }
}
function createEl(elName, options) {
  var el = document.createElement(elName);
  for (var opt in options) {
    if (opt !== 'style') {
      el[opt] = options[opt];
    } else {
      var styles = options[opt];
      setStyle(el, styles);
    }
  }
  return el;
}
function $(selector) {
  var _exec3;
  var _this = Element.prototype.isPrototypeOf(this) ? this : document;
  var sel = String(selector).trim();
  var id = (_exec3 = /^#([^ +>~\[:]*)$/.exec(sel)) === null || _exec3 === void 0 ? void 0 : _exec3[1];
  return id && _this === document ? _this.getElementById(id) : _this.querySelector(sel);
}
function $$(selector) {
  var _this = Element.prototype.isPrototypeOf(this) ? this : document;
  return Array.from(_this.querySelectorAll(selector));
}
function getParamValue(param) {
  var r;
  location.href.split('?')[1].split('&').some(function (item) {
    var param_value = item.split('=');
    if (param_value[0] == param) {
      r = param_value[1];
      return true;
    }
  });
  return r;
}
function showMessage(message, config) {
  //type = 'default', showTime = 3000, direction
  var oldMessageWrap = document.querySelector(".messageWrap-".concat(config !== null && config !== void 0 && config.direction ? config.direction : 'top'));
  var MessageWrap;
  if (!oldMessageWrap) {
    MessageWrap = document.createElement('div');
    MessageWrap.className = 'messageWrap';
    setStyle(MessageWrap, {
      position: 'absolute',
      zIndex: '9999'
    });
  } else {
    MessageWrap = oldMessageWrap;
  }
  var MessageBox = document.createElement('div');
  MessageBox.innerText = message;
  var closeBtn = document.createElement('div');
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', MessageBox.remove.bind(MessageBox)); //关闭消息提示

  setStyle(MessageBox, {
    position: 'relative',
    minWidth: '200px',
    marginTop: '5px',
    padding: '6px 50px',
    lineHeight: '25px',
    backgroundColor: 'pink',
    textAlign: 'center',
    fontSize: '16px',
    borderRadius: '5px',
    transition: 'all 1s'
  });
  setStyle(closeBtn, {
    position: 'absolute',
    top: '-3px',
    right: '3px',
    width: '15px',
    height: '15px',
    zIndex: '999',
    fontWeight: '800',
    fontSize: '15px',
    borderRadius: '5px',
    cursor: 'pointer',
    userSelect: 'none'
  });
  //控制方向
  switch (config === null || config === void 0 ? void 0 : config.direction) {
    case 'top':
      setStyle(MessageWrap, {
        top: '1%',
        left: '50%',
        transform: 'translateX(-50%)'
      });
      break;
    case 'top left':
      setStyle(MessageWrap, {
        top: '1%',
        left: '.5%'
      });
      break;
    case 'left':
      setStyle(MessageWrap, {
        top: '50%',
        left: '1%',
        transform: 'translateY(-50%)'
      });
      break;
    case 'top right':
      setStyle(MessageWrap, {
        top: '1%',
        right: '.5%'
      });
      break;
    case 'right':
      setStyle(MessageWrap, {
        top: '50%',
        right: '.5%',
        transform: 'translateY(-50%)'
      });
      break;
    case 'center':
      setStyle(MessageWrap, {
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      });
      break;
    case 'bottom':
      setStyle(MessageWrap, {
        bottom: '1%',
        left: '50%',
        transform: 'translateX(-50%)'
      });
      break;
    case 'bottom8':
      setStyle(MessageWrap, {
        bottom: '8%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      });
      break;
    case 'bottom left':
      setStyle(MessageWrap, {
        bottom: '1%'
      });
      break;
    case 'bottom right':
      setStyle(MessageWrap, {
        bottom: '1%',
        right: '.5%'
      });
      break;
    default:
      setStyle(MessageWrap, {
        top: '1%',
        left: '50%',
        transform: 'translateX(-50%)'
      });
      break;
  }
  switch (config === null || config === void 0 ? void 0 : config.type) {
    case 'success':
      setStyle(MessageBox, {
        border: '1.5px solid rgb(225, 243, 216)',
        backgroundColor: 'rgb(240, 249, 235)',
        color: 'rgb(103, 194, 58)'
      });
      break;
    case 'warning':
      setStyle(MessageBox, {
        border: '1.5px solid rgb(250, 236, 216)',
        backgroundColor: 'rgb(253, 246, 236)',
        color: 'rgb(230, 162, 60)'
      });
      break;
    case 'error':
      setStyle(MessageBox, {
        border: '1.5px solid rgb(253, 226, 226)',
        backgroundColor: 'rgb(254, 240, 240)',
        color: 'rgb(245, 108, 108)'
      });
      break;
    default:
      setStyle(MessageBox, {
        border: '1.5px solid rgba(202, 228, 255) ',
        backgroundColor: 'rgba(236, 245, 255)',
        color: 'rgb(64, 158, 255)'
      });
      break;
  }
  MessageBox.appendChild(closeBtn);
  if (oldMessageWrap) {
    oldMessageWrap.appendChild(MessageBox);
  } else {
    MessageWrap.appendChild(MessageBox);
    document.body.appendChild(MessageWrap);
  }
  var ani = MessageBox.animate([{
    transform: "translate(0, -100%)",
    opacity: 0.3
  }, {
    transform: "translate(0, 18px)",
    opacity: 0.7,
    offset: 0.9
  }, {
    transform: "translate(0, 15px)",
    opacity: 1,
    offset: 1
  }], {
    duration: 300,
    fill: 'forwards',
    easing: 'ease-out'
  });

  //控制消失
  var timer = setTimeout(function () {
    ani.onfinish = function () {
      MessageBox.remove();
    };
    ani.reverse();
  }, (config === null || config === void 0 ? void 0 : config.showTime) || 3000);

  //鼠标悬停时不清除，离开时重新计时
  MessageBox.addEventListener('mouseenter', function () {
    return clearTimeout(timer);
  });
  MessageBox.addEventListener('mouseleave', function () {
    timer = setTimeout(function () {
      ani.reverse();
      ani.onfinish = function () {
        MessageBox.remove();
      };
    }, (config === null || config === void 0 ? void 0 : config.showTime) || 3000);
  });
}
function hijackXHR(change, send) {
  var realXMLHttpRequest = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
    var xhr = new realXMLHttpRequest();
    xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState !== 4) return;
      change.call(this);
    });
    send && (xhr.send = send.bind(xhr));
    return xhr;
  };
}
function hijackWS() {
  var OriginalWebSocket = WebSocket;
  window.WebSocket = function (url, protocols) {
    var ws = new OriginalWebSocket(url, protocols);
    ws.addEventListener('open', function (event) {
      console.log('WebSocket opened:', event);
    });
    var originalOnMessage = ws.onmessage;
    ws.onmessage = function (event) {
      originalOnMessage.call(ws, event);
    };
    var originalSend = ws.send;
    ws.send = function (data) {
      var data_parse = JSON.parse(data);
      if (url === 'ws://39.104.65.87:8778/api/msg/ws' && data_parse.event_type === 'report_working_time' && !window._ds.isSendTime) return;
      originalSend.call(ws, JSON.stringify(data_parse));
    };
    ws.addEventListener('close', function (event) {
      console.log('WebSocket closed:', event);
    });
    ws.addEventListener('error', function (event) {
      console.log('WebSocket error:', event);
    });
    return ws;
  };
}
function copyToClipboard(textToCopy) {
  // navigator clipboard 需要https等安全上下文
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(textToCopy);
  } else {
    var textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    textArea.style.position = "absolute";
    textArea.style.opacity = 0;
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise(function (res, rej) {
      document.execCommand('copy') ? res() : rej();
      textArea.remove();
    });
  }
}
function clickTrigger(el, fn, button) {
  var moveThreshold = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var movement = 0;
  var allowTrigger = false;
  var isRightdown = false;
  el.addEventListener('mousedown', function (e) {
    e.preventDefault();
    if (['.svg-line.svg-face-fill', '.fusion-shape-drag-face'].some(function (sel) {
      return e.target.matches(sel);
    })) return;
    if (e.which !== button) return;
    movement = 0;
    isRightdown = true;
    allowTrigger = true;
  });
  el.addEventListener('mousemove', function (e) {
    if (!isRightdown || isRightdown && (movement += Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2))) <= moveThreshold) return;
    allowTrigger && (allowTrigger = false);
  });
  el.addEventListener('mouseup', function (e) {
    if (e.which !== button) return;
    if (allowTrigger) fn(e);
    isRightdown = false;
  });
}
function setInputValue(input, value) {
  var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeInputValueSetter.call(input, value);
  ['input', 'change'].forEach(function (event) {
    return input.dispatchEvent(new Event(event, {
      bubbles: true
    }));
  });
}
;
function setTextAreaValue(textarea, value) {
  var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  nativeInputValueSetter.call(textarea, value);
  ['input', 'change'].forEach(function (event) {
    return textarea.dispatchEvent(new Event(event, {
      bubbles: true
    }));
  });
}
;
/**
2024/10/11:
- 新增：初始化设置展示方式为【按组展示】
- 新增：统计结果，点击复制结果
- 新增：【1】后退1帧
- 新增：【2】前进1帧
- 新增：【4】显隐 2D窗口-第1帧
- 新增：【5】显隐 2D窗口-第2帧
- 新增：鼠标右键 打开/关闭 2D窗口

2024/10/12:
- 新增：右键关闭属性面板
- 修复：快捷键切帧引起的ctrl切帧问题

2024/10/13：
- 新增：【G】编组
- 新增：点击编组/取消编组，更新个体列表
- 新增：去除暂停。
- 修复：点击复制的框数与当前更新的框数不一致。
- 新增：可见属性为空时，自动勾选【可见】。

2024/10/14：
- 修复：设置项无法修改的问题。
- 新增：自定义配置 自动勾选【可见】
- 修复：输入模式下触发快捷键

2024/10/17：
- 修复：输入模式下触发快捷键

2024/10/22:
- 新增：初始化配置（2D滚轮缩放比、3D拖拽速度、三视图角度旋转、三视图移动距离）

2024/10/25：
- 调整：框数统计方式（除掉前后视角以外的框+前后视角的 6v 2D框）

2024/11/6：
- 新增：初始化配置新增【相机投影视距】的配置

2024/11/8：
- 新增：展示任务信息
- 新增：链接跳转

2024/11/10
- 完善：链接跳转
- 调整：暂停提示隐藏逻辑
- 修复：平台显示暂停时依旧计时的问题

2024/11/12
- 新增：在2D图窗口中鼠标中键 开启/关闭 独显

2024/11/22
- 新增：【Tab】显隐伪3D框
- 新增：【Alt C】或【Shift C】触发复制粘贴

2024/11/25
- 新增：统计识别未调整的2D框
- 修复：鼠标中键点云图不触发独显的问题

2024/11/26
- 新增：筛选按钮组

2024/11/27
- 新增：鼠标右键关闭筛选对话框
- 新增：批注面板加入快捷短语

2024/12/6
- 修复：暂停提示关闭后没有恢复计时
- 新增：批注面板快捷语句
- 新增：鼠标右键关闭批注面板

2024/12/9
- 新增：正确率统计
- 新增：鼠标右键关闭[批注追加编辑面板]
- 新增：[批注追加编辑面板]新增快捷语
- 新增：2D框漏标批注面板新增快捷语

2024/12/18
- 新增：锁定前视图和后视图的位置

2024/12/19
- 新增：个体属性面板新增 标注类型按钮组

2024/12/25
- 新增：对个体属性面板简化处理
*/