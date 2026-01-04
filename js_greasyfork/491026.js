// ==UserScript==
// @name       曼孚点云连续帧
// @namespace    http://tampermonkey.net/
// @version      2024.3.28.2
// @description  try to take over the world!
// @author       You
// @match        https://label.mindflow.com.cn/pointCloudPro?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mindflow.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491026/%E6%9B%BC%E5%AD%9A%E7%82%B9%E4%BA%91%E8%BF%9E%E7%BB%AD%E5%B8%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/491026/%E6%9B%BC%E5%AD%9A%E7%82%B9%E4%BA%91%E8%BF%9E%E7%BB%AD%E5%B8%A7.meta.js
// ==/UserScript==


/**==================================

键盘快捷键：
【Tab】      ==>  三视图被放大时，切换三视图；三视图没被放大时，调出个体属性面板
【`】        ==>  向后一帧
【空格】     ==>  向前一帧
【Z】        ==>  向上旋转视角（shift ↑）
【X】        ==>  向下旋转视角（shift ↓）


鼠标快捷键：
- 中键：
  - 关闭个体属性面板（个体属性面板范围内触发）
- 右键：
  - 拖动个体属性面板
  - 缩放三视图

==================================**/

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e5) { throw _e5; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e6) { didErr = true; err = _e6; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
  'use strict';

  var vps, tip, modeWrap, tips, scrollbar, newWrap, mappingImgWrap, clickTrigger, init, Observe, $, $$, setElStyle;
  return _regeneratorRuntime().wrap(function _callee$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        setElStyle = function _setElStyle() {
          var _arguments = arguments;
          [[Map, function () {
            var styleMap = _arguments[0];
            var _iterator = _createForOfIteratorHelper(styleMap),
              _step;
            try {
              var _loop = function _loop() {
                var _step$value = _slicedToArray(_step.value, 2),
                  el = _step$value[0],
                  styleObj = _step$value[1];
                !Array.isArray(el) ? setStyleObj(el, styleObj) : el.forEach(function (el) {
                  return setStyleObj(el, styleObj);
                });
              };
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                _loop();
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
          }]].some(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
              O = _ref3[0],
              fn = _ref3[1];
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
        };
        $$ = function _$$(selector) {
          var _this = Element.prototype.isPrototypeOf(this) ? this : document;
          return Array.from(_this.querySelectorAll(selector));
        };
        $ = function _$(selector) {
          var _exec;
          var _this = Element.prototype.isPrototypeOf(this) ? this : document;
          var sel = String(selector).trim();
          var id = (_exec = /^#([^ +>~\[:]*)$/.exec(sel)) === null || _exec === void 0 ? void 0 : _exec[1];
          return id ? _this.getElementById(id) : _this.querySelector(sel);
        };
        Observe = function _Observe(target, callBack) {
          var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true
          };
          var ob = new MutationObserver(callBack);
          ob.observe(target, options);
          return ob;
        };
        init = function _init() {
          var initObserveList = ['.show-attribute-container'];
          return new Promise(function (res, rej) {
            var observer = new MutationObserver(function (mrs) {
              mrs.some(function (mr) {
                if (mr.type == 'attributes' && mr.target.className === 'task-load-panel' && mr.target.style.display === 'none') res(true);
              });
            });
            observer.observe(document.body, {
              childList: true,
              subtree: true,
              attributes: true
            });
          });
        };
        clickTrigger = function _clickTrigger(el, fn, button) {
          var moveThreshold = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
          var movement = 0;
          var allowTrigger = false;
          var isRightdown = false;
          el.addEventListener('mousedown', function (e) {
            e.preventDefault();
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
        };
        window.$ = Document.prototype.$ = Element.prototype.$ = $;
        window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$;
        _context.next = 10;
        return init();
      case 10:
        if (_context.sent) {
          _context.next = 12;
          break;
        }
        return _context.abrupt("return", console.log('init fail'));
      case 12:
        Observe($('.main'), function (mrs) {
          mrs.forEach(function (mr) {
            _toConsumableArray(mr.addedNodes).some(function (an) {
              if (an.className === 'hotkey-bar-wrapper' && ['三视图微调', '快速放大/缩小视角'].some(function (text) {
                return an.innerText.includes(text);
              })) an.$('.icon-annotation-close').click();
            });
          });
        }, {
          childList: true,
          subtree: true
        });
        vps = $$('.viewport-bottom .box-wrapper');
        vps.some(function (vp) {
          clickTrigger(vp, function () {
            vp.$('.box-scale-icon').click();
          }, 3, 5);
        });
        tip = document.createElement('div');
        setElStyle(tip, {
          margin: '0 -500px 0 35px',
          fontSize: '13px'
        });
        modeWrap = $('.annotation-mode');
        if (modeWrap.textContent.includes('标注')) {
          tips = $$('.pull-frame-wrapper .tool-wrapper .tool-name').map(function (item, idx) {
            return "".concat(++idx, ".").concat(item.textContent);
          }).slice(1);
          tip.innerHTML = tips.reduce(function (counter, tip, idx) {
            return counter += "".concat(tip).concat(idx !== tips.length - 1 ? ' &nbsp;' : '');
          }, '');
        }
        $('.header__left').appendChild(tip);
        scrollbar = $('.map-wrapper .el-scrollbar__view');
        newWrap = document.createElement('div');
        mappingImgWrap = $('.x-image-mapping');
        setElStyle(newWrap, {
          marginLeft: '80px',
          width: '400px'
        });
        $('.mf-resize-container').appendChild(newWrap);
        Observe($('.left-wrapper'), function (mrs) {
          mrs.forEach(function (mr) {
            if (mr.oldValue === 'left-wrapper' && ['left-wrapper', 'left-hide'].every(function (item) {
              return mr.target.classList.contains(item);
            })) {
              newWrap.style.width = "".concat(mappingImgWrap.getBoundingClientRect().width, "px");
              newWrap.appendChild(mappingImgWrap);
            }
            if (mr.oldValue === 'left-wrapper left-hide') {
              scrollbar.appendChild(mappingImgWrap);
            }
          });
        }, {
          childList: true,
          attributes: true,
          attributeOldValue: true,
          attributeFilter: ['class']
        });
        window.addEventListener('keydown', function (e) {
          console.log(e.keyCode, e);
          //【Tab】
          if (e.keyCode == 9) {
            e.preventDefault();
            var _vps = _slicedToArray(vps, 3),
              vpTop = _vps[0],
              vpFront = _vps[1],
              vpLeft = _vps[2];
            var vpSequence = [vpTop, vpLeft, vpFront];
            var isBlow = vpSequence.some(function (vp, idx) {
              //判断是否存在三视图放大状态
              if (vp.className.includes('transform-active')) {
                // console.log('当前处于放大', vp)
                //收起当前视图
                vp.$('.box-scale-icon.box-blow-down').click();
                //放大下一个视图
                var nextVp = vpSequence[idx !== 2 ? ++idx : 0];
                nextVp.dispatchEvent(new Event('mousedown'));
                setTimeout(function () {
                  nextVp.$('.box-scale-icon.box-blow-up').click();
                });
                return true;
              }
            });
            var _modeWrap = $('.annotation-mode');
            if (!isBlow) {
              if (!$('.attribute-container') && _modeWrap && (_modeWrap.textContent.includes('标注') || _modeWrap.$('.el-switch').classList.contains('is-checked'))) {
                $('.engraving-container .modify-attribute').click();
              } else if (_modeWrap && _modeWrap.textContent.includes('审核') && !_modeWrap.$('.el-switch').classList.contains('is-checked')) {
                // focusTarget()
              }
            }
          }

          // 【Z】向上旋转视角（shift ↑）
          if (e.keyCode === 90 && !e.ctrlKey && !e.shifKey) {
            var _e = {
              key: "ArrowUp",
              keyCode: 38,
              shiftKey: true,
              bubbles: true
            };
            document.body.dispatchEvent(new KeyboardEvent("keydown", _e));
            document.body.dispatchEvent(new KeyboardEvent("keyup", _e));
            document.body.dispatchEvent(new KeyboardEvent("keyup", {
              keyCode: 16,
              bubbles: true
            }));
          }

          // 【X】向下旋转视角（shift ↓）
          if (e.keyCode === 88 && !e.ctrlKey && !e.shifKey) {
            var _e2 = {
              key: "ArrowDown",
              keyCode: 40,
              shiftKey: true,
              bubbles: true
            };
            document.body.dispatchEvent(new KeyboardEvent("keydown", _e2));
            document.body.dispatchEvent(new KeyboardEvent("keyup", _e2));
            document.body.dispatchEvent(new KeyboardEvent("keyup", {
              keyCode: 16,
              bubbles: true
            }));
          }

          // 【空格】
          if (e.keyCode === 32) {
            $('.pull-frame-item.select').click();
            var _e3 = {
              key: "d",
              keyCode: 68,
              altKey: true,
              bubbles: true
            };
            document.body.dispatchEvent(new KeyboardEvent("keydown", _e3));
            document.body.dispatchEvent(new KeyboardEvent("keyup", _e3));
            document.body.dispatchEvent(new KeyboardEvent("keyup", {
              keyCode: 18,
              bubbles: true
            }));
          }
          if (e.keyCode === 192) {
            $('.pull-frame-item.select').click();
            var _e4 = {
              key: "a",
              keyCode: 65,
              altKey: true,
              bubbles: true
            };
            document.body.dispatchEvent(new KeyboardEvent("keydown", _e4));
            document.body.dispatchEvent(new KeyboardEvent("keyup", _e4));
            document.body.dispatchEvent(new KeyboardEvent("keyup", {
              keyCode: 18,
              bubbles: true
            }));
          }
        });
      case 27:
      case "end":
        return _context.stop();
    }
  }, _callee);
}))();