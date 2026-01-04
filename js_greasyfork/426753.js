(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.$hookAjax = {}));
}(this, (function (exports) { 'use strict';

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
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

  function _arrayLikeToArray$2(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _unsupportedIterableToArray$2(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$2(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$2(arr, i) || _nonIterableRest();
  }

  function _assertThisInitialized$1(self) {
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

  function _inherits$1(subClass, superClass) {
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

  function _possibleConstructorReturn$1(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized$1(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$1(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function createCommonjsModule(fn, module) {
    return module = {
      exports: {}
    }, fn(module, module.exports), module.exports;
  }

  var setPrototypeOf = createCommonjsModule(function (module) {
    function _setPrototypeOf(o, p) {
      module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    module.exports = _setPrototypeOf;
  });

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
    if (superClass) setPrototypeOf(subClass, superClass);
  }

  var inherits = _inherits;

  var _typeof_1 = createCommonjsModule(function (module) {
    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        module.exports = _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        module.exports = _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    module.exports = _typeof;
  });

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var assertThisInitialized = _assertThisInitialized;

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
      return call;
    }

    return assertThisInitialized(self);
  }

  var possibleConstructorReturn = _possibleConstructorReturn;
  var getPrototypeOf = createCommonjsModule(function (module) {
    function _getPrototypeOf(o) {
      module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    module.exports = _getPrototypeOf;
  });

  function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var arrayLikeToArray = _arrayLikeToArray$1;

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return arrayLikeToArray(arr);
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
  }

  var unsupportedIterableToArray = _unsupportedIterableToArray$1;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

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

  var createClass = _createClass;

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  var superPropBase = _superPropBase;
  var get = createCommonjsModule(function (module) {
    function _get(target, property, receiver) {
      if (typeof Reflect !== "undefined" && Reflect.get) {
        module.exports = _get = Reflect.get;
      } else {
        module.exports = _get = function _get(target, property, receiver) {
          var base = superPropBase(target, property);
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

    module.exports = _get;
  });

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  var isNativeFunction = _isNativeFunction;

  function _isNativeReflectConstruct$1() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  var isNativeReflectConstruct = _isNativeReflectConstruct$1;
  var construct = createCommonjsModule(function (module) {
    function _construct(Parent, args, Class) {
      if (isNativeReflectConstruct()) {
        module.exports = _construct = Reflect.construct;
      } else {
        module.exports = _construct = function _construct(Parent, args, Class) {
          var a = [null];
          a.push.apply(a, args);
          var Constructor = Function.bind.apply(Parent, a);
          var instance = new Constructor();
          if (Class) setPrototypeOf(instance, Class.prototype);
          return instance;
        };
      }

      return _construct.apply(null, arguments);
    }

    module.exports = _construct;
  });
  var wrapNativeSuper = createCommonjsModule(function (module) {
    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? new Map() : undefined;

      module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !isNativeFunction(Class)) return Class;

        if (typeof Class !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }

        if (typeof _cache !== "undefined") {
          if (_cache.has(Class)) return _cache.get(Class);

          _cache.set(Class, Wrapper);
        }

        function Wrapper() {
          return construct(Class, arguments, getPrototypeOf(this).constructor);
        }

        Wrapper.prototype = Object.create(Class.prototype, {
          constructor: {
            value: Wrapper,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        return setPrototypeOf(Wrapper, Class);
      };

      return _wrapNativeSuper(Class);
    }

    module.exports = _wrapNativeSuper;
  });
  /**
   * Assign the target's prototype to the origin object
   * @param origin{Object}        The origin object
   * @param target{Object}        The target object
   * @param initMethod{string=}   The method name will be called from origin while assigned, default to be 'initAssign'
   * @return {*}                  The origin object assigned
   */

  function assignInstance(origin, target) {
    var initMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'initAssign';
    var prototype = Object.getPrototypeOf(target);
    Object.setPrototypeOf(origin, prototype);

    if (typeof prototype[initMethod] === 'function') {
      prototype[initMethod].call(origin, target);
    }

    return origin;
  }
  /**
   * Assign the target class prototype to the origin object
   * @param origin{Object}        The origin object
   * @param targetType{Function}  The target class object
   * @param initMethod{string=}   The method name will be called from origin while assigned, default to be 'initAssign'
   * @return {*}                  The origin object assigned
   */


  function assignPrototype(origin, targetType) {
    var initMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'initAssign';
    var prototype = targetType.prototype;
    Object.setPrototypeOf(origin, prototype);

    if (typeof prototype[initMethod] === 'function') {
      prototype[initMethod].call(origin);
    }

    return origin;
  }

  function createCommonjsModule$1(fn, module) {
    return module = {
      exports: {}
    }, fn(module, module.exports), module.exports;
  }

  createCommonjsModule$1(function (module) {
    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        module.exports = _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        module.exports = _typeof = function _typeof(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
      }

      return _typeof(obj);
    }

    module.exports = _typeof;
  });
  /**
   * Get an unique id
   * @param length{number=} the id length
   * @return {string} the unique id
   */

  function genID(length) {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
  }
  /**
   * Assign the origin's property to target object by property key.
   * @param target            The target object
   * @param origin            The origin object
   * @param key               The property key
   * @param defaultValue{*=}  If there's not existing value from origin object, the default
   */


  function assignProperty(target, origin, key, defaultValue) {
    if (origin && origin[key] !== undefined) {
      target[key] = origin[key];
    } else if (typeof defaultValue === 'function') {
      target[key] = defaultValue();
    }
  }

  function _createSuper$1(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct$1$1();

    return function _createSuperInternal() {
      var Super = getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return possibleConstructorReturn(this, result);
    };
  }

  function _isNativeReflectConstruct$1$1() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  /**
   * @class The class included the function's extra methods
   * @augments Function
   * @property id {string}        the id only for this instance
   * @property uniqueId {string}  the id for the chain of method called
   */


  var FuncInstance = /*#__PURE__*/function (_Function) {
    inherits(FuncInstance, _Function);

    var _super = _createSuper$1(FuncInstance);

    function FuncInstance() {
      classCallCheck(this, FuncInstance);
      return _super.apply(this, arguments);
    }

    createClass(FuncInstance, [{
      key: "initAssign",

      /**
       * Just a callback with the resolve params
       * @callback resolveCallback
       * @param res{*=}   the callback param
       */

      /**
       * Callback when using before method
       * @callback beforeCallback
       * @param params{Object=}                   Params for before callback
       * @param params.origin{Function=}          The origin method of the AOP method
       * @param params.args{Array<*>=}            The args of the AOP method
       * @param params.preventDefault{Function=}  The method if called will prevent method executing,
       *                                          and using this callback return value instead of APO method return value
       * @param params.trans{Object=}             The temp storage place from the APO method, you can set the property in the before method
       * @return {*}                              If preventDefault event called, the return value will be the AOP method's return value
       */

      /**
       * Callback when using after method
       * @callback afterCallback
       * @param params{Object=}           Params for after callback
       * @param params.origin{Function=}  The origin method of the AOP method
       * @param params.args{Array<*>=}    The args of the AOP method
       * @param params.lastValue{*=}      The value returned from AOP method by default
       * @param params.trans{Object=}     The temp storage place from the APO method,
       *                                  you can get the property from before method, or set the property
       */

      /**
       * Callback when using error method
       * @callback errorCallback
       * @param params{Object=}                   Params for error callback
       * @param params.origin{Function=}          The origin method of the AOP method
       * @param params.args{Array<*>=}            The args of the AOP method
       * @param params.error{*=}                  The error object | error message
       * @param params.resolve{resolveCallback=}  When this method called the AOP method will use the params as return value
       * @param params.trans{Object=}             The temp storage place from the APO method,
       *                                          you can get the property from before or after method
       */

      /**
       * @private
       * @param target{FuncInstance}
       */
      value: function initAssign(target) {
        this.id = genID(7); // all func from FuncInstance has the uniqueId

        assignProperty(this, target, 'uniqueId', function () {
          return genID(7);
        });
      }
      /**
       * For a given function, creates a bound function that has the same body as the original function.
       * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
       * @param context               An object to which the this keyword can refer inside the new function.
       * @param argArray {Array=}     A list of arguments to be passed to the new function.
       * @return {FuncInstance | Function}
       */

    }, {
      key: "bind",
      value: function bind(context) {
        var _get2;

        var argArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        return assignInstance((_get2 = get(getPrototypeOf(FuncInstance.prototype), "bind", this)).call.apply(_get2, [this, context].concat(toConsumableArray(argArray))), this);
      }
      /**
       * Making something called before the AOP method
       * @param cb{beforeCallback}    The callback called before the AOP method calling
       * @param adaptAsync{boolean=}  If equals true & callback returned a Promise result,
       *                              the AOP method will called after the Promise finished.
       * @return {FuncInstance|Function}
       */

    }, {
      key: "before",
      value: function before(cb) {
        var adaptAsync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return this.surround({
          before: cb,
          adaptAsync: adaptAsync
        });
      }
      /**
       * Making something called after the AOP method
       * @param cb{afterCallback}     The callback called after the AOP method calling
       * @param adaptAsync{boolean=}  If equals true & AOP method returned a Promise result,
       *                              the after method will called after the Promise finished.
       * @return {FuncInstance|Function}
       */

    }, {
      key: "after",
      value: function after(cb) {
        var adaptAsync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return this.surround({
          after: cb,
          adaptAsync: adaptAsync
        });
      }
      /**
       * Making something called surround the APO method
       * @param options{Object} options for surround method
       * @param options.before{beforeCallback=}   The callback called before the AOP method calling
       * @param options.after{afterCallback=}     The callback called after the AOP method calling
       * @param options.onError{errorCallback=}   The callback called while an error happening from the AOP method calling
       * @param options.adaptAsync{boolean=}      If equals TRUE, all surround methods will waiting the last Promise result
       * @return {FuncInstance|Function}
       */

    }, {
      key: "surround",
      value: function surround(_ref) {
        var _ref$before = _ref.before,
            before = _ref$before === void 0 ? undefined : _ref$before,
            _ref$after = _ref.after,
            after = _ref$after === void 0 ? undefined : _ref$after,
            _ref$onError = _ref.onError,
            onError = _ref$onError === void 0 ? undefined : _ref$onError,
            _ref$adaptAsync = _ref.adaptAsync,
            adaptAsync = _ref$adaptAsync === void 0 ? false : _ref$adaptAsync;
        var lastOrigin = this;

        if (typeof lastOrigin !== 'function') {
          return lastOrigin;
        }

        return assignInstance(function () {
          var _this2 = this;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var trans = {};
          var baseParams = {
            origin: lastOrigin,
            args: args,
            trans: trans
          };
          var validErrorMethod = typeof onError === 'function';

          try {
            var _preventDefault = false; // parsing before

            var beforeResult;

            if (typeof before === 'function') {
              beforeResult = before.call(this, Object.assign({}, baseParams, {
                preventDefault: function preventDefault() {
                  _preventDefault = true;
                }
              }));

              if (_preventDefault) {
                return beforeResult;
              }
            }

            var returnValue;

            if (beforeResult instanceof Promise && adaptAsync) {
              returnValue = beforeResult.then(function () {
                return lastOrigin.apply(_this2, args);
              });
            } else {
              returnValue = lastOrigin.apply(this, args);
            } // parsing origin


            if (typeof after === 'function') {
              if (returnValue instanceof Promise && adaptAsync) {
                returnValue = returnValue.then(function (value) {
                  return after.call(_this2, Object.assign({}, baseParams, {
                    lastValue: value
                  }));
                });
              } else {
                returnValue = after.call(this, Object.assign({}, baseParams, {
                  lastValue: returnValue
                }));
              }
            }

            if (returnValue instanceof Promise && adaptAsync && validErrorMethod) {
              return returnValue["catch"](function (error) {
                var isSolved = false;
                var message = '';

                var resolve = function resolve(msg) {
                  message = msg;
                  isSolved = true;
                };

                return Promise.resolve(onError.call(_this2, Object.assign({}, baseParams, {
                  error: error,
                  resolve: resolve
                }))).then(function (solution) {
                  if (!isSolved) {
                    throw error;
                  }

                  return message || solution;
                });
              });
            }

            return returnValue;
          } catch (error) {
            if (!validErrorMethod) {
              throw error;
            }

            var isSolved = false;
            var message = '';

            var resolve = function resolve(msg) {
              message = msg;
              isSolved = true;
            };

            var result = onError.call(this, Object.assign({}, baseParams, {
              error: error,
              resolve: resolve
            }));

            if (!isSolved) {
              throw error;
            }

            return message || result;
          }
        }, this);
      }
      /**
       * Making an async method call then method
       * @param cb{resolveCallback=}
       * @return {FuncInstance|Function}
       */

    }, {
      key: "then",
      value: function then(cb) {
        var _this = this;

        return assignInstance(function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          var result = _this.apply(this, args);

          return Promise.resolve(result).then(cb);
        }, this);
      }
      /**
       * Making an async method call catch method
       * @param cb{resolveCallback=}
       * @return {FuncInstance|Function}
       */

    }, {
      key: "catch",
      value: function _catch(cb) {
        var _this = this;

        return assignInstance(function () {
          var result;

          try {
            for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              args[_key3] = arguments[_key3];
            }

            result = _this.apply(this, args);

            if (result instanceof Promise) {
              return result["catch"](cb);
            }
          } catch (e) {
            result = cb.call(this, e);
          }

          return result;
        }, this);
      }
      /**
       * Making an async method call finally method
       * @param cb{resolveCallback=}
       * @return {FuncInstance|Function}
       */

    }, {
      key: "finally",
      value: function _finally(cb) {
        var _this = this;

        return assignInstance(function () {
          var doIgnoreCallback = function doIgnoreCallback() {
            try {
              cb.call(this);
            } catch (e) {// ignore
            }
          };

          try {
            for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
              args[_key4] = arguments[_key4];
            }

            var result = _this.apply(this, args);

            if (result instanceof Promise) {
              if (typeof result["finally"] === 'function') {
                return result["finally"](function () {
                  return doIgnoreCallback();
                });
              }

              return result["catch"](function (e) {
                return e;
              }).then(function (e) {
                doIgnoreCallback();

                if (e instanceof Error) {
                  throw e;
                }
              });
            } else {
              doIgnoreCallback();
            }

            return result;
          } catch (e) {
            doIgnoreCallback();
            throw e;
          }
        }, this);
      }
      /**
       * Making result method could using all of registered functions
       * @param funcMap {Object}  An object with function property, those function will be used as callable method for FuncInstance
       * @return {FuncInstance|Function}
       */

    }, {
      key: "register",
      value: function register() {
        var funcMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return this.registerClass(function (instance) {
          var result = /*#__PURE__*/function (_instance) {
            inherits(result, _instance);

            var _super2 = _createSuper$1(result);

            function result() {
              classCallCheck(this, result);
              return _super2.apply(this, arguments);
            }

            return result;
          }(instance);

          Object.assign(result.prototype, funcMap);
          return result;
        });
      }
      /**
       * Register for registerClass function
       * @callback funcInstanceRegister
       * @param instanceType {FuncInstance|Function=} Latest one class extends @link{FuncInstance}
       * @return {FuncInstance|Function}              Result func instance, must extends params - `instanceType`
       */

      /**
       * Making result method could using all of registered functions
       * @param register{funcInstanceRegister}
       * @return {FuncInstance|Function}
       */

    }, {
      key: "registerClass",
      value: function registerClass(register) {
        var instanceType = register(this.constructor);
        var resultFunc = this.bind(this);
        Object.setPrototypeOf(resultFunc, instanceType.prototype);

        if (typeof instanceType !== 'function' || !(resultFunc instanceof this.constructor)) {
          throw new Error('Registered class must extend FunctionInstance');
        }

        return resultFunc;
      }
    }]);
    return FuncInstance;
  }( /*#__PURE__*/wrapNativeSuper(Function));

  var defaultOptions = {
    instanceType: FuncInstance
  };
  /**
   * Making the function to be FuncInstance
   * @param func {Function}                   The function to convert
   * @param options {Object=}                 The options for this giving
   * @param options.instanceType {Function=}  The class type of instance default to be FuncInstance
   * @return {FuncInstance | Function}
   */

  function give(func, options) {
    options = Object.assign({}, defaultOptions, options);

    var resultFunc = function resultFunc() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (func || function () {
        return undefined;
      }).apply(this, args);
    };

    assignPrototype(resultFunc, options.instanceType);
    return resultFunc;
  }
  /**
   * How to hook method
   * @callback doHookThings
   * @param method {FuncInstance}
   * @return {Function} result function
   */

  /**
   * @typedef HookOptions
   * @type {{protect: boolean, syncDesc: boolean, native: boolean}}
   */


  var defaultHookOptions = {
    protect: false,
    syncDesc: true,
    "native": false
  };
  var defineProperty = Object.defineProperty;
  var defineProperties = Object.defineProperties;
  /**
   * Hook a method
   * @param parent        {Object}
   * @param methodName    {string|Symbol}
   * @param doHookThings  {doHookThings}
   * @param options       {HookOptions=}
   * @return {void}
   */

  function hook(parent, methodName, doHookThings) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var origin = parent[methodName];

    if (typeof origin !== 'function') {
      return;
    }

    var hookOptions = Object.assign({}, defaultHookOptions, options);
    var _native = hookOptions["native"];
    var targetMethod = doHookThings(_native ? origin : give(origin));
    parent[methodName] = _native ? targetMethod : function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      try {
        return targetMethod.apply(this, args);
      } catch (e) {
        console.warn('[Hook JS]', 'Hooks  running lost once.');
        return origin.apply(this, args);
      }
    };
    var protect = hookOptions.protect,
        syncDesc = hookOptions.syncDesc;

    if (protect) {
      protectMethod(parent, methodName);
    }

    if (syncDesc) {
      syncToString(origin, parent[methodName]);
    }
  }
  /**
   * Hook target function to replace, not to using func-js instance
   * @param parent {object}                   Parent object
   * @param methodName {string | symbol}      Target method name to replace
   * @param replace {function}                To return a new function to replace origin method
   * @param options
   * @return {void}
   */


  function hookReplace(parent, methodName, replace) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    return hook(parent, methodName, replace, Object.assign({}, options, {
      "native": true
    }));
  }
  /**
   * Protect method from modified
   * @param parent {object}
   * @param methodName {string}
   */


  function protectMethod(parent, methodName) {
    defineProperty.call(Object, parent, methodName, {
      writable: false
    });
  }
  /**
   * Sync the toString method from origin to target
   * @param from {any}
   * @param to {any}
   */


  function syncToString(from, to) {
    defineProperties.call(Object, to, {
      toString: {
        enumerable: false,
        writable: true,
        value: function value() {
          return from.toString();
        }
      },
      toLocaleString: {
        enumerable: false,
        writable: true,
        value: function value() {
          return from.toLocaleString();
        }
      }
    });
  }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$1(this, result); }; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  var id = 0;

  function getUniqueId() {
    return id++;
  }

  /**
   * Using to intercept ajax request, new Instance to start hook
   */
  var AjaxInterceptor = /*#__PURE__*/function () {
    function AjaxInterceptor() {
      _classCallCheck$1(this, AjaxInterceptor);

      _defineProperty(this, "urlHooks", {});

      _defineProperty(this, "responseHooks", {});

      _defineProperty(this, "sendHooks", {});

      var _this = this;

      hookReplace(window, 'XMLHttpRequest', function (D) {
        return /*#__PURE__*/function (_D) {
          _inherits$1(XMLHttpRequest, _D);

          var _super = _createSuper(XMLHttpRequest);

          function XMLHttpRequest() {
            var _this2;

            _classCallCheck$1(this, XMLHttpRequest);

            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            _this2 = _super.call.apply(_super, [this].concat(args));

            _defineProperty(_assertThisInitialized$1(_this2), "id", void 0);

            _this2.id = getUniqueId();

            _this2.addEventListener('readystatechange', function () {
              if (_this2.readyState == 4 || [200, 304, 201, 202, 203].includes(_this2.state)) {
                _this.onResponse(_assertThisInitialized$1(_this2));
              }
            });

            return _this2;
          }

          return XMLHttpRequest;
        }(D);
      });
      hook(window.XMLHttpRequest.prototype, 'open', this.getHookedRequestHandler());
      hook(window.XMLHttpRequest.prototype, 'send', function (origin) {
        return origin.before(function (_ref) {
          var args = _ref.args,
              prevent = _ref.preventDefault;
          return _this.onSend(this, args, prevent);
        });
      });
    }

    _createClass$1(AjaxInterceptor, [{
      key: "getHookedRequestHandler",
      value: function getHookedRequestHandler() {
        var _this = this;

        return function (origin) {
          return origin.before(function (_ref2) {
            var args = _ref2.args,
                prevent = _ref2.preventDefault;
            return _this.onRequest(this, args, prevent);
          });
        };
      }
    }, {
      key: "onSend",
      value: function onSend(xhr, args, prevent) {
        var sendHandlers = this.sendHooks[xhr.id] || [];
        var result;

        var _iterator = _createForOfIteratorHelper(sendHandlers),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var sendHandler = _step.value;

            if (typeof sendHandler === 'function') {
              var _params = {
                args: args,
                prevent: prevent
              };
              result = sendHandler.call(xhr, _params) || result;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this.clearSendHooks(xhr.id);
        return result;
      }
    }, {
      key: "onRequest",
      value: function onRequest(xhr, args, prevent) {
        var _args = _slicedToArray(args, 2),
            url = _args[1];

        var result;

        for (var hookUrl in this.urlHooks) {
          if (new RegExp(hookUrl).test(url)) {
            var _params2 = {
              args: args,
              prevent: prevent
            };
            var hooks = this.urlHooks[hookUrl];

            if (typeof hooks.onRequest === 'function') {
              result = hooks.onRequest.call(xhr, _params2) || result;
            }

            this.signResponseHooks(xhr.id, hooks);
            this.signSendHooks(xhr.id, hooks);
          }
        }

        return result;
      }
    }, {
      key: "onResponse",
      value: function onResponse(xhr) {
        if (xhr.readyState === 4 || [200, 201, 202, 304].includes(xhr.status)) {
          var _replace = function _replace(response) {
            if (typeof response !== 'string') {
              response = JSON.stringify(response);
            }

            Object.defineProperties(xhr, {
              response: {
                writable: false,
                configurable: true,
                value: response
              },
              responseText: {
                writable: false,
                configurable: true,
                value: response
              }
            });
          };

          var originResponse = ['', 'text'].includes(xhr.responseType) ? xhr.responseText : xhr.response;

          var _response;

          try {
            _response = JSON.parse(originResponse);
          } catch (e) {
            _response = originResponse;
          }

          var _params3 = {
            response: _response,
            originResponse: originResponse,
            replace: function replace(response) {
              _params3.response = response;
            },
            define: function define(property, value) {
              Object.defineProperty(xhr, property, {
                writable: false,
                configurable: true,
                value: value
              });
            }
          };
          var _id = xhr.id;
          var targetResponseHooks = this.responseHooks[_id] || [];

          var _iterator2 = _createForOfIteratorHelper(targetResponseHooks),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var targetResponseHook = _step2.value;

              if (targetResponseHook && typeof targetResponseHook === 'function') {
                targetResponseHook.call(xhr, _params3);

                _replace(_params3.response);
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          this.clearResponseHooks(_id);
        }
      }
    }, {
      key: "signResponseHooks",
      value: function signResponseHooks(id, hooks) {
        if (hooks.onResponse && typeof hooks.onResponse === 'function') {
          var exists = this.responseHooks[id] || [];
          exists.push(hooks.onResponse);
          this.responseHooks[id] = exists;
        }
      }
    }, {
      key: "signSendHooks",
      value: function signSendHooks(id, hooks) {
        if (hooks.onSend && typeof hooks.onSend === 'function') {
          var exists = this.sendHooks[id] || [];
          exists.push(hooks.onSend);
          this.sendHooks[id] = exists;
        }
      }
    }, {
      key: "clearResponseHooks",
      value: function clearResponseHooks(id) {
        this.responseHooks[id] = [];
      }
    }, {
      key: "clearSendHooks",
      value: function clearSendHooks(id) {
        this.sendHooks[id] = [];
      }
      /**
       * Register from url RegExp
       * @param url
       * @param hooks
       */

    }, {
      key: "register",
      value: function register(url, hooks) {
        this.urlHooks[url] = hooks;
      }
    }]);

    return AjaxInterceptor;
  }();

  exports.AjaxInterceptor = AjaxInterceptor;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
