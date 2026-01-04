// ==UserScript==
// @name         万用网页标记器
// @namespace    https://palerock.cn
// @version      2.0.1
// @description  轻松地标记网页任意元素，删除/更改烦人的内容，以及提供更多的快捷功能
// @author       Cangshi
// @include      *
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434795/%E4%B8%87%E7%94%A8%E7%BD%91%E9%A1%B5%E6%A0%87%E8%AE%B0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/434795/%E4%B8%87%E7%94%A8%E7%BD%91%E9%A1%B5%E6%A0%87%E8%AE%B0%E5%99%A8.meta.js
// ==/UserScript==

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.easymark = {}));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var ManagerStatus;

  (function (ManagerStatus) {
    ManagerStatus[ManagerStatus["REST"] = 0] = "REST";
    ManagerStatus[ManagerStatus["STARTING"] = 1] = "STARTING";
    ManagerStatus[ManagerStatus["STOP"] = 2] = "STOP";
  })(ManagerStatus || (ManagerStatus = {}));

  function _createForOfIteratorHelper$3(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$4(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$4(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$4(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$4(o, minLen); }

  function _arrayLikeToArray$4(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var MarkerManager = /*#__PURE__*/function () {
    function MarkerManager() {
      _classCallCheck(this, MarkerManager);

      _defineProperty(this, "markers", []);

      _defineProperty(this, "status", ManagerStatus.REST);
    }

    _createClass(MarkerManager, [{
      key: "registerMarker",
      value: function registerMarker(marker) {
        if (!this.markers.includes(marker)) {
          this.markers.push(marker);
        }
      }
    }, {
      key: "getMarkedItems",
      value: function getMarkedItems() {
        return this.markers.reduce(function (results, marker) {
          var _iterator = _createForOfIteratorHelper$3(marker.getMarkedItems()),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var item = _step.value;

              if (!results.includes(item)) {
                results.push(item);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return results;
        }, []);
      }
    }, {
      key: "removeMarker",
      value: function removeMarker(marker) {
        marker.deactivate();
        this.markers = this.markers.filter(function (m) {
          return m !== marker;
        });
      }
    }, {
      key: "start",
      value: function start() {
        if (this.status !== ManagerStatus.STARTING) {
          var _iterator2 = _createForOfIteratorHelper$3(this.markers),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var marker = _step2.value;
              marker.activate();
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          this.status = ManagerStatus.STARTING;
        }
      }
    }, {
      key: "stop",
      value: function stop() {
        if (this.status === ManagerStatus.STARTING) {
          var _iterator3 = _createForOfIteratorHelper$3(this.markers),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var marker = _step3.value;
              marker.deactivate();
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          this.status = ManagerStatus.STOP;
        }
      }
    }, {
      key: "end",
      value: function end(force) {
        if ([ManagerStatus.STOP, ManagerStatus.REST].includes(this.status)) {
          var _iterator4 = _createForOfIteratorHelper$3(this.markers),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var marker = _step4.value;
              marker.unmarkAll(force);
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }

          this.status = ManagerStatus.REST;
        }
      }
    }, {
      key: "canEnd",
      get: function get() {
        return this.status === ManagerStatus.STOP;
      }
    }]);

    return MarkerManager;
  }();

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var genOrderedId_1 = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.genOrderedId = void 0;
  let initialId = 1;
  function genOrderedId() {
      return initialId++;
  }
  exports.genOrderedId = genOrderedId;
  });

  function _createForOfIteratorHelper$2(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }

  function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  var BasicMarker = /*#__PURE__*/function () {
    function BasicMarker() {
      _classCallCheck(this, BasicMarker);

      _defineProperty(this, "markedList", []);
    }

    _createClass(BasicMarker, [{
      key: "mark",
      value: function mark(origin) {
        var target = origin;

        if (!target.isMarked && !target.preventMark) {
          if (!target.hasMarked) {
            target.uniqueId = String(genOrderedId_1.genOrderedId());
          }

          target.hasMarked = true;
          target.isMarked = true;

          if (!this.markedList.includes(target)) {
            this.markedList.push(target);
          }

          if (target instanceof EventTarget) {
            target.dispatchEvent(new CustomEvent('marked', {
              composed: true,
              bubbles: true
            }));
          }
        }

        return target;
      }
    }, {
      key: "unmark",
      value: function unmark(target, force) {
        if (target.isMarked && (!target.preventUnmark || force)) {
          this.markedList = this.markedList.filter(function (item) {
            return item != target;
          });

          if (target instanceof EventTarget) {
            target.dispatchEvent(new CustomEvent('unmarked', {
              composed: true,
              bubbles: true
            }));
          }

          target.isMarked = false;
        }

        return target;
      }
    }, {
      key: "activate",
      value: function activate() {}
    }, {
      key: "deactivate",
      value: function deactivate() {}
    }, {
      key: "unmarkAll",
      value: function unmarkAll(force) {
        var _iterator = _createForOfIteratorHelper$2(this.markedList),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var item = _step.value;
            this.unmark(item, force);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "getMarkedItems",
      value: function getMarkedItems() {
        return this.markedList || [];
      }
    }]);

    return BasicMarker;
  }();

  function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  var EventMarker = /*#__PURE__*/function (_BasicMarker) {
    _inherits(EventMarker, _BasicMarker);

    var _super = _createSuper$1(EventMarker);

    function EventMarker(host) {
      var _this;

      _classCallCheck(this, EventMarker);

      _this = _super.call(this);
      _this.host = host;

      _defineProperty(_assertThisInitialized(_this), "markEvent", void 0);

      _defineProperty(_assertThisInitialized(_this), "unmarkEvent", void 0);

      _defineProperty(_assertThisInitialized(_this), "onMarked", void 0);

      _defineProperty(_assertThisInitialized(_this), "onUnmarked", void 0);

      _defineProperty(_assertThisInitialized(_this), "isListenMark", false);

      _defineProperty(_assertThisInitialized(_this), "isListenUnmark", false);

      _this.onMarked = function (event) {
        if (event.target) {
          _this.mark(event.target);
        }
      };

      _this.onUnmarked = function (event) {
        if (event.target) {
          _this.unmark(event.target);
        }
      };

      return _this;
    }

    _createClass(EventMarker, [{
      key: "startListenEvent",
      value: function startListenEvent() {
        if (this.markEvent && !this.isListenMark) {
          this.host.addEventListener(this.markEvent, this.onMarked);
          this.isListenMark = true;
        }

        if (this.unmarkEvent && !this.isListenUnmark) {
          this.host.addEventListener(this.unmarkEvent, this.onUnmarked);
          this.isListenUnmark = true;
        }
      }
    }, {
      key: "stopListenEvent",
      value: function stopListenEvent() {
        if (this.markEvent && this.isListenMark) {
          this.host.removeEventListener(this.markEvent, this.onMarked);
          this.isListenMark = false;
        }

        if (this.unmarkEvent && this.isListenUnmark) {
          this.host.removeEventListener(this.unmarkEvent, this.onUnmarked);
          this.isListenUnmark = false;
        }
      }
    }, {
      key: "activate",
      value: function activate() {
        _get(_getPrototypeOf(EventMarker.prototype), "activate", this).call(this);

        this.startListenEvent();
      }
    }, {
      key: "deactivate",
      value: function deactivate() {
        _get(_getPrototypeOf(EventMarker.prototype), "deactivate", this).call(this);

        this.stopListenEvent();
      }
    }]);

    return EventMarker;
  }(BasicMarker);

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  var MouseMoveMarker = /*#__PURE__*/function (_EventMarker) {
    _inherits(MouseMoveMarker, _EventMarker);

    var _super = _createSuper(MouseMoveMarker);

    function MouseMoveMarker() {
      var _this;

      _classCallCheck(this, MouseMoveMarker);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "markEvent", 'mousemove');

      _defineProperty(_assertThisInitialized(_this), "unmarkEvent", 'mouseout');

      return _this;
    }

    return MouseMoveMarker;
  }(EventMarker);

  function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

  function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var EasyMarker = /*#__PURE__*/function () {
    function EasyMarker(managers, host) {
      var _this = this;

      _classCallCheck(this, EasyMarker);

      _defineProperty(this, "host", void 0);

      _defineProperty(this, "events", []);

      _defineProperty(this, "listenedEventNameList", []);

      _defineProperty(this, "markerManagers", void 0);

      _defineProperty(this, "eventHandler", void 0);

      this.host = host || window;
      this.markerManagers = managers || [];

      this.eventHandler = function (e) {
        var eventName = e.type;

        var targetEvents = _this.events.filter(function (e) {
          return e.name === eventName;
        }).sort(function (a, b) {
          return a.priority > b.priority ? -1 : 1;
        });

        var _iterator = _createForOfIteratorHelper$1(targetEvents),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var event = _step.value;
            var target = e.target;

            if (event.global) {
              if (event.single) {
                event.callback({
                  event: e,
                  detail: e.detail,
                  target: target,
                  marker: _this
                });
              } else {
                var _iterator2 = _createForOfIteratorHelper$1(_this.getMarkedItems()),
                    _step2;

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    var item = _step2.value;
                    event.callback({
                      event: e,
                      detail: e.detail,
                      target: item,
                      marker: _this
                    });
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }
              }
            } else if (target.isMarked) {
              event.callback({
                event: e,
                detail: e.detail,
                target: target,
                marker: _this
              });
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };
    }

    _createClass(EasyMarker, [{
      key: "exit",
      value: function exit() {
        var _iterator3 = _createForOfIteratorHelper$1(this.markerManagers),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var manager = _step3.value;
            manager.stop();
            manager.end(true);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }, {
      key: "getMarkedItems",
      value: function getMarkedItems() {
        return this.markerManagers.reduce(function (results, manager) {
          var _iterator4 = _createForOfIteratorHelper$1(manager.getMarkedItems()),
              _step4;

          try {
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var item = _step4.value;

              if (!results.includes(item)) {
                results.push(item);
              }
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }

          return results;
        }, []);
      }
    }, {
      key: "addManager",
      value: function addManager(manager) {
        if (!this.markerManagers.includes(manager)) {
          this.markerManagers.push(manager);
        }
      }
    }, {
      key: "registerEvents",
      value: function registerEvents(events) {
        var _iterator5 = _createForOfIteratorHelper$1(events),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var event = _step5.value;
            this.registerEvent(event);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
    }, {
      key: "registerEvent",
      value: function registerEvent(event) {
        this.events.push(event);
        this.listenEvent(event.name);
      }
    }, {
      key: "listenEvent",
      value: function listenEvent(eventName) {
        if (!eventName) {
          return;
        }

        var eventNameExist = this.listenedEventNameList.includes(eventName);

        if (!eventNameExist) {
          this.host.addEventListener(eventName, this.eventHandler);
          this.listenedEventNameList.push(eventName);
        }
      }
    }, {
      key: "denyEvent",
      value: function denyEvent(eventName) {
        if (!eventName) {
          return;
        }

        var index = this.listenedEventNameList.indexOf(eventName);

        if (index >= 0) {
          this.host.removeEventListener(eventName, this.eventHandler);
          this.listenedEventNameList.splice(index, 0);
        }
      }
    }]);

    return EasyMarker;
  }();

  function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableRest();
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
  }

  var styleMapping = [[[HTMLImageElement, HTMLVideoElement, HTMLCanvasElement, SVGSVGElement, SVGPathElement], 'filter: invert(100%)', '-webkit-filter: invert(100%)'], [[HTMLElement], 'box-shadow: 0 0 0 999px rgba(252,248,118,0.64) inset']];

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  function getStyleList(ele) {
    return styleMapping.filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          _ref2$ = _toArray(_ref2[0]),
          types = _ref2$.slice(0);

      var _iterator = _createForOfIteratorHelper(types),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var type = _step.value;

          if (ele instanceof type) {
            return true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return false;
    }).reduce(function (results, _ref3) {
      var _ref4 = _toArray(_ref3),
          styles = _ref4.slice(1);

      results.push.apply(results, _toConsumableArray(styles));
      return results;
    }, []);
  }
  function addStyle(ele) {
    if (!ele) {
      return;
    }

    var styleList = (ele.getAttribute('style') || '').split(';');
    var hasChanged = false;

    var _iterator2 = _createForOfIteratorHelper(getStyleList(ele)),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var style = _step2.value;

        if (!styleList.includes(style)) {
          styleList.push(style);
          hasChanged = true;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    hasChanged && ele.setAttribute('style', styleList.join(';'));
  }
  function removeStyle(ele) {
    if (!ele) {
      return;
    }

    var styleList = (ele.getAttribute('style') || '').split(';').map(function (s) {
      return s.trim();
    });
    var hasChanged = false;

    var _iterator3 = _createForOfIteratorHelper(getStyleList(ele)),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var style = _step3.value;
        var index = styleList.indexOf(style.trim());

        if (index >= 0) {
          styleList.splice(index, 1);
          hasChanged = true;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    hasChanged && ele.setAttribute('style', styleList.join(';'));
  }
  var ele = document.createElement('span');
  ele.setAttribute('style', 'display: block!important;color: black;position: absolute;background: white;padding: 2px;border-radius: 6px;top: 402.797px;left: 584px;font-size: 10px;border: 1px solid #ddd;min-width: 40px;text-align: center;z-index: 999999');
  ele['preventMark'] = true;
  function showNodeName(node) {
    var _node$getBoundingClie = node.getBoundingClientRect(),
        x = _node$getBoundingClie.left,
        y = _node$getBoundingClie.bottom;

    ele.style.top = y + 1 + document.documentElement.scrollTop + 'px';
    ele.style.left = x + 'px';
    ele.innerText = node.nodeName;
    document.body.appendChild(ele);
  }
  function hideNodeName() {
    if (ele.parentNode) {
      ele.parentNode.removeChild(ele);
    }
  }

  var events = [{
    name: 'marked',
    callback: function callback(_ref) {
      _ref.event;
          _ref.detail;
          var target = _ref.target;
      addStyle(target);
      showNodeName(target);
    },
    priority: -99
  }, {
    name: 'unmarked',
    callback: function callback(_ref2) {
      _ref2.event;
          _ref2.detail;
          var target = _ref2.target;
      removeStyle(target);
      hideNodeName();
    },
    priority: -99
  }];

  function matchShortcutKey(event, shortcutKey) {
    return _matchShortcutKey(event, parseShortcutKeyExpression(shortcutKey));
  }

  function _matchShortcutKey(event, condition) {
    return Object.entries(condition).every(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return event[key] === value;
    });
  }

  function parseShortcutKeyExpression(expression) {
    var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '+';
    var parts = expression.split(separator).map(function (p) {
      return p.trim();
    }).filter(function (p) {
      return p;
    });
    var targetCode = parts.pop() || 'UNKNOWN_KEY';
    var resultCondition = {
      code: targetCode
    };
    parts.forEach(function (p) {
      resultCondition[p + 'Key'] = true;
    });
    return resultCondition;
  }

  var inputEvents = [{
    name: 'keydown',
    callback: function callback(_ref) {
      var event = _ref.event;
          _ref.detail;
          var target = _ref.target;

      if (matchShortcutKey(event, 'shift + KeyT') && target instanceof HTMLInputElement && target.type === 'password') {
        target.type = 'text';
      }
    },
    global: true
  }, {
    name: 'keydown',
    callback: function callback(_ref2) {
      var event = _ref2.event;
          _ref2.detail;
          var target = _ref2.target;

      if (matchShortcutKey(event, 'shift + KeyP') && target instanceof HTMLInputElement) {
        target.type = 'password';
      }
    },
    global: true
  }];

  var deleteHistories = [];
  var removeElementEvents = [{
    name: 'keydown',
    callback: function callback(_ref) {
      var event = _ref.event;
          _ref.detail;
          var target = _ref.target,
          marker = _ref.marker;

      if (matchShortcutKey(event, 'shift + Backspace')) {
        if (target.parentNode) {
          marker.exit();

          var _Array$prototype$slic = Array.prototype.slice.call(target.parentNode.childNodes).map(function (n, i) {
            return [n, i];
          }).find(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 1),
                n = _ref3[0];

            return n === target;
          }),
              _Array$prototype$slic2 = _slicedToArray(_Array$prototype$slic, 2),
              index = _Array$prototype$slic2[1];

          deleteHistories.push([target.parentNode, target, index]);
          target.parentNode.removeChild(target);
        }
      }
    },
    global: true
  }, {
    name: 'keydown',
    callback: function callback(_ref4) {
      var event = _ref4.event;
          _ref4.detail;
          _ref4.target;
          _ref4.marker;

      if (event.code === 'KeyZ' && (event.metaKey || event.ctrlKey)) {
        var _ref5 = deleteHistories.pop() || [],
            _ref6 = _slicedToArray(_ref5, 3),
            parent = _ref6[0],
            node = _ref6[1],
            index = _ref6[2];

        if (parent && node) {
          if (index != null) {
            var beforeNode = parent.childNodes[index];

            if (beforeNode) {
              parent.insertBefore(node, beforeNode);
              return;
            }
          }

          parent.appendChild(node);
        }
      }
    },
    global: true,
    single: true
  }];

  var editableEvents = [{
    name: 'keydown',
    callback: function callback(_ref) {
      var event = _ref.event;
          _ref.detail;
          var target = _ref.target;
          _ref.marker;

      if (matchShortcutKey(event, 'shift + KeyE')) {
        var existEditableValue = target.getAttribute('contenteditable');
        var currentEditable = existEditableValue != null && ['', 'true'].includes(existEditableValue.toLowerCase());
        var isEditable = target.isEditable;

        if (!currentEditable && !isEditable) {
          event.preventDefault();
          target.setAttribute('contenteditable', 'true');
          target.isEditable = true;
          target.preventUnmark = true;
          target.focus();
        }
      }
    },
    global: true
  }, {
    name: 'unmarked',
    callback: function callback(_ref2) {
      _ref2.event;
          _ref2.detail;
          var target = _ref2.target;
          _ref2.marker;

      if (target.isEditable) {
        target.removeAttribute('contenteditable');
        target.isEditable = false;
        target.preventUnmark = false;
      }
    }
  }];

  var focusEvents = [];

  function start() {
    var manager = new MarkerManager();
    manager.registerMarker(new MouseMoveMarker(window));
    var eventManager = new EasyMarker([manager]);
    eventManager.registerEvents(focusEvents);
    eventManager.registerEvents(events);
    eventManager.registerEvents(inputEvents);
    eventManager.registerEvents(removeElementEvents);
    eventManager.registerEvents(editableEvents);
    window.addEventListener('keydown', function (e) {
      if (['MetaLeft', 'ControlLeft'].includes(e.code)) {
        manager.start();
      } else if (e.code === 'Escape') {
        eventManager.exit();
      }
    });
    window.addEventListener('keyup', function (e) {
      if (['MetaLeft', 'ControlLeft'].includes(e.code)) {
        manager.stop();
      }
    });
    window.addEventListener('mouseout', function (e) {
      if (manager.canEnd && e.target['isMarked']) {
        manager.end();
      }
    });
  }

  exports.EasyMarker = EasyMarker;
  exports.start = start;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


if (window.easymark) {
    window.easymark.start();
}