// ==UserScript==
// @name     PPM Drawer
// @namespace https://github.com/siefkenj/react-userscripts
// @version  1.5
// @description A sample userscript built using react
// @include https://*.popmundo.com/World/Popmundo.aspx/*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/517078/PPM%20Drawer.user.js
// @updateURL https://update.greasyfork.org/scripts/517078/PPM%20Drawer.meta.js
// ==/UserScript==


var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function() {
  "use strict";
  function _mergeNamespaces(n2, m2) {
    for (var i = 0; i < m2.length; i++) {
      const e2 = m2[i];
      if (typeof e2 !== "string" && !Array.isArray(e2)) {
        for (const k2 in e2) {
          if (k2 !== "default" && !(k2 in n2)) {
            const d2 = Object.getOwnPropertyDescriptor(e2, k2);
            if (d2) {
              Object.defineProperty(n2, k2, d2.get ? d2 : {
                enumerable: true,
                get: () => e2[k2]
              });
            }
          }
        }
      }
    }
    return Object.freeze(Object.defineProperty(n2, Symbol.toStringTag, { value: "Module" }));
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  var react = { exports: {} };
  var react_production_min = {};
  /**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var l$2 = Symbol.for("react.element"), n$3 = Symbol.for("react.portal"), p$4 = Symbol.for("react.fragment"), q$3 = Symbol.for("react.strict_mode"), r$3 = Symbol.for("react.profiler"), t$2 = Symbol.for("react.provider"), u$1 = Symbol.for("react.context"), v$3 = Symbol.for("react.forward_ref"), w$1 = Symbol.for("react.suspense"), x$1 = Symbol.for("react.memo"), y$1 = Symbol.for("react.lazy"), z$2 = Symbol.iterator;
  function A$2(a) {
    if (null === a || "object" !== typeof a) return null;
    a = z$2 && a[z$2] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  var B$1 = { isMounted: function() {
    return false;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, C$1 = Object.assign, D$1 = {};
  function E$1(a, b2, e2) {
    this.props = a;
    this.context = b2;
    this.refs = D$1;
    this.updater = e2 || B$1;
  }
  E$1.prototype.isReactComponent = {};
  E$1.prototype.setState = function(a, b2) {
    if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, b2, "setState");
  };
  E$1.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
  };
  function F() {
  }
  F.prototype = E$1.prototype;
  function G$1(a, b2, e2) {
    this.props = a;
    this.context = b2;
    this.refs = D$1;
    this.updater = e2 || B$1;
  }
  var H$1 = G$1.prototype = new F();
  H$1.constructor = G$1;
  C$1(H$1, E$1.prototype);
  H$1.isPureReactComponent = true;
  var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
  function M$1(a, b2, e2) {
    var d2, c2 = {}, k2 = null, h2 = null;
    if (null != b2) for (d2 in void 0 !== b2.ref && (h2 = b2.ref), void 0 !== b2.key && (k2 = "" + b2.key), b2) J.call(b2, d2) && !L$1.hasOwnProperty(d2) && (c2[d2] = b2[d2]);
    var g2 = arguments.length - 2;
    if (1 === g2) c2.children = e2;
    else if (1 < g2) {
      for (var f2 = Array(g2), m2 = 0; m2 < g2; m2++) f2[m2] = arguments[m2 + 2];
      c2.children = f2;
    }
    if (a && a.defaultProps) for (d2 in g2 = a.defaultProps, g2) void 0 === c2[d2] && (c2[d2] = g2[d2]);
    return { $$typeof: l$2, type: a, key: k2, ref: h2, props: c2, _owner: K$1.current };
  }
  function N$1(a, b2) {
    return { $$typeof: l$2, type: a.type, key: b2, ref: a.ref, props: a.props, _owner: a._owner };
  }
  function O$1(a) {
    return "object" === typeof a && null !== a && a.$$typeof === l$2;
  }
  function escape(a) {
    var b2 = { "=": "=0", ":": "=2" };
    return "$" + a.replace(/[=:]/g, function(a2) {
      return b2[a2];
    });
  }
  var P$1 = /\/+/g;
  function Q$1(a, b2) {
    return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b2.toString(36);
  }
  function R$1(a, b2, e2, d2, c2) {
    var k2 = typeof a;
    if ("undefined" === k2 || "boolean" === k2) a = null;
    var h2 = false;
    if (null === a) h2 = true;
    else switch (k2) {
      case "string":
      case "number":
        h2 = true;
        break;
      case "object":
        switch (a.$$typeof) {
          case l$2:
          case n$3:
            h2 = true;
        }
    }
    if (h2) return h2 = a, c2 = c2(h2), a = "" === d2 ? "." + Q$1(h2, 0) : d2, I$1(c2) ? (e2 = "", null != a && (e2 = a.replace(P$1, "$&/") + "/"), R$1(c2, b2, e2, "", function(a2) {
      return a2;
    })) : null != c2 && (O$1(c2) && (c2 = N$1(c2, e2 + (!c2.key || h2 && h2.key === c2.key ? "" : ("" + c2.key).replace(P$1, "$&/") + "/") + a)), b2.push(c2)), 1;
    h2 = 0;
    d2 = "" === d2 ? "." : d2 + ":";
    if (I$1(a)) for (var g2 = 0; g2 < a.length; g2++) {
      k2 = a[g2];
      var f2 = d2 + Q$1(k2, g2);
      h2 += R$1(k2, b2, e2, f2, c2);
    }
    else if (f2 = A$2(a), "function" === typeof f2) for (a = f2.call(a), g2 = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d2 + Q$1(k2, g2++), h2 += R$1(k2, b2, e2, f2, c2);
    else if ("object" === k2) throw b2 = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b2 ? "object with keys {" + Object.keys(a).join(", ") + "}" : b2) + "). If you meant to render a collection of children, use an array instead.");
    return h2;
  }
  function S$1(a, b2, e2) {
    if (null == a) return a;
    var d2 = [], c2 = 0;
    R$1(a, d2, "", "", function(a2) {
      return b2.call(e2, a2, c2++);
    });
    return d2;
  }
  function T$1(a) {
    if (-1 === a._status) {
      var b2 = a._result;
      b2 = b2();
      b2.then(function(b3) {
        if (0 === a._status || -1 === a._status) a._status = 1, a._result = b3;
      }, function(b3) {
        if (0 === a._status || -1 === a._status) a._status = 2, a._result = b3;
      });
      -1 === a._status && (a._status = 0, a._result = b2);
    }
    if (1 === a._status) return a._result.default;
    throw a._result;
  }
  var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
  function X$1() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  react_production_min.Children = { map: S$1, forEach: function(a, b2, e2) {
    S$1(a, function() {
      b2.apply(this, arguments);
    }, e2);
  }, count: function(a) {
    var b2 = 0;
    S$1(a, function() {
      b2++;
    });
    return b2;
  }, toArray: function(a) {
    return S$1(a, function(a2) {
      return a2;
    }) || [];
  }, only: function(a) {
    if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
    return a;
  } };
  react_production_min.Component = E$1;
  react_production_min.Fragment = p$4;
  react_production_min.Profiler = r$3;
  react_production_min.PureComponent = G$1;
  react_production_min.StrictMode = q$3;
  react_production_min.Suspense = w$1;
  react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
  react_production_min.act = X$1;
  react_production_min.cloneElement = function(a, b2, e2) {
    if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
    var d2 = C$1({}, a.props), c2 = a.key, k2 = a.ref, h2 = a._owner;
    if (null != b2) {
      void 0 !== b2.ref && (k2 = b2.ref, h2 = K$1.current);
      void 0 !== b2.key && (c2 = "" + b2.key);
      if (a.type && a.type.defaultProps) var g2 = a.type.defaultProps;
      for (f2 in b2) J.call(b2, f2) && !L$1.hasOwnProperty(f2) && (d2[f2] = void 0 === b2[f2] && void 0 !== g2 ? g2[f2] : b2[f2]);
    }
    var f2 = arguments.length - 2;
    if (1 === f2) d2.children = e2;
    else if (1 < f2) {
      g2 = Array(f2);
      for (var m2 = 0; m2 < f2; m2++) g2[m2] = arguments[m2 + 2];
      d2.children = g2;
    }
    return { $$typeof: l$2, type: a.type, key: c2, ref: k2, props: d2, _owner: h2 };
  };
  react_production_min.createContext = function(a) {
    a = { $$typeof: u$1, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
    a.Provider = { $$typeof: t$2, _context: a };
    return a.Consumer = a;
  };
  react_production_min.createElement = M$1;
  react_production_min.createFactory = function(a) {
    var b2 = M$1.bind(null, a);
    b2.type = a;
    return b2;
  };
  react_production_min.createRef = function() {
    return { current: null };
  };
  react_production_min.forwardRef = function(a) {
    return { $$typeof: v$3, render: a };
  };
  react_production_min.isValidElement = O$1;
  react_production_min.lazy = function(a) {
    return { $$typeof: y$1, _payload: { _status: -1, _result: a }, _init: T$1 };
  };
  react_production_min.memo = function(a, b2) {
    return { $$typeof: x$1, type: a, compare: void 0 === b2 ? null : b2 };
  };
  react_production_min.startTransition = function(a) {
    var b2 = V$1.transition;
    V$1.transition = {};
    try {
      a();
    } finally {
      V$1.transition = b2;
    }
  };
  react_production_min.unstable_act = X$1;
  react_production_min.useCallback = function(a, b2) {
    return U$1.current.useCallback(a, b2);
  };
  react_production_min.useContext = function(a) {
    return U$1.current.useContext(a);
  };
  react_production_min.useDebugValue = function() {
  };
  react_production_min.useDeferredValue = function(a) {
    return U$1.current.useDeferredValue(a);
  };
  react_production_min.useEffect = function(a, b2) {
    return U$1.current.useEffect(a, b2);
  };
  react_production_min.useId = function() {
    return U$1.current.useId();
  };
  react_production_min.useImperativeHandle = function(a, b2, e2) {
    return U$1.current.useImperativeHandle(a, b2, e2);
  };
  react_production_min.useInsertionEffect = function(a, b2) {
    return U$1.current.useInsertionEffect(a, b2);
  };
  react_production_min.useLayoutEffect = function(a, b2) {
    return U$1.current.useLayoutEffect(a, b2);
  };
  react_production_min.useMemo = function(a, b2) {
    return U$1.current.useMemo(a, b2);
  };
  react_production_min.useReducer = function(a, b2, e2) {
    return U$1.current.useReducer(a, b2, e2);
  };
  react_production_min.useRef = function(a) {
    return U$1.current.useRef(a);
  };
  react_production_min.useState = function(a) {
    return U$1.current.useState(a);
  };
  react_production_min.useSyncExternalStore = function(a, b2, e2) {
    return U$1.current.useSyncExternalStore(a, b2, e2);
  };
  react_production_min.useTransition = function() {
    return U$1.current.useTransition();
  };
  react_production_min.version = "18.3.1";
  {
    react.exports = react_production_min;
  }
  var reactExports = react.exports;
  const React$1 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
  const ReactOriginal = /* @__PURE__ */ _mergeNamespaces({
    __proto__: null,
    default: React$1
  }, [reactExports]);
  var reactDom = { exports: {} };
  var reactDom_production_min = {};
  var scheduler = { exports: {} };
  var scheduler_production_min = {};
  /**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  (function(exports) {
    function f2(a, b2) {
      var c2 = a.length;
      a.push(b2);
      a: for (; 0 < c2; ) {
        var d2 = c2 - 1 >>> 1, e2 = a[d2];
        if (0 < g2(e2, b2)) a[d2] = b2, a[c2] = e2, c2 = d2;
        else break a;
      }
    }
    function h2(a) {
      return 0 === a.length ? null : a[0];
    }
    function k2(a) {
      if (0 === a.length) return null;
      var b2 = a[0], c2 = a.pop();
      if (c2 !== b2) {
        a[0] = c2;
        a: for (var d2 = 0, e2 = a.length, w2 = e2 >>> 1; d2 < w2; ) {
          var m2 = 2 * (d2 + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
          if (0 > g2(C2, c2)) n2 < e2 && 0 > g2(x2, C2) ? (a[d2] = x2, a[n2] = c2, d2 = n2) : (a[d2] = C2, a[m2] = c2, d2 = m2);
          else if (n2 < e2 && 0 > g2(x2, c2)) a[d2] = x2, a[n2] = c2, d2 = n2;
          else break a;
        }
      }
      return b2;
    }
    function g2(a, b2) {
      var c2 = a.sortIndex - b2.sortIndex;
      return 0 !== c2 ? c2 : a.id - b2.id;
    }
    if ("object" === typeof performance && "function" === typeof performance.now) {
      var l2 = performance;
      exports.unstable_now = function() {
        return l2.now();
      };
    } else {
      var p2 = Date, q2 = p2.now();
      exports.unstable_now = function() {
        return p2.now() - q2;
      };
    }
    var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
    "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function G2(a) {
      for (var b2 = h2(t2); null !== b2; ) {
        if (null === b2.callback) k2(t2);
        else if (b2.startTime <= a) k2(t2), b2.sortIndex = b2.expirationTime, f2(r2, b2);
        else break;
        b2 = h2(t2);
      }
    }
    function H2(a) {
      B2 = false;
      G2(a);
      if (!A2) if (null !== h2(r2)) A2 = true, I2(J2);
      else {
        var b2 = h2(t2);
        null !== b2 && K2(H2, b2.startTime - a);
      }
    }
    function J2(a, b2) {
      A2 = false;
      B2 && (B2 = false, E2(L2), L2 = -1);
      z2 = true;
      var c2 = y2;
      try {
        G2(b2);
        for (v2 = h2(r2); null !== v2 && (!(v2.expirationTime > b2) || a && !M2()); ) {
          var d2 = v2.callback;
          if ("function" === typeof d2) {
            v2.callback = null;
            y2 = v2.priorityLevel;
            var e2 = d2(v2.expirationTime <= b2);
            b2 = exports.unstable_now();
            "function" === typeof e2 ? v2.callback = e2 : v2 === h2(r2) && k2(r2);
            G2(b2);
          } else k2(r2);
          v2 = h2(r2);
        }
        if (null !== v2) var w2 = true;
        else {
          var m2 = h2(t2);
          null !== m2 && K2(H2, m2.startTime - b2);
          w2 = false;
        }
        return w2;
      } finally {
        v2 = null, y2 = c2, z2 = false;
      }
    }
    var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
    function M2() {
      return exports.unstable_now() - Q2 < P2 ? false : true;
    }
    function R2() {
      if (null !== O2) {
        var a = exports.unstable_now();
        Q2 = a;
        var b2 = true;
        try {
          b2 = O2(true, a);
        } finally {
          b2 ? S2() : (N2 = false, O2 = null);
        }
      } else N2 = false;
    }
    var S2;
    if ("function" === typeof F2) S2 = function() {
      F2(R2);
    };
    else if ("undefined" !== typeof MessageChannel) {
      var T2 = new MessageChannel(), U2 = T2.port2;
      T2.port1.onmessage = R2;
      S2 = function() {
        U2.postMessage(null);
      };
    } else S2 = function() {
      D2(R2, 0);
    };
    function I2(a) {
      O2 = a;
      N2 || (N2 = true, S2());
    }
    function K2(a, b2) {
      L2 = D2(function() {
        a(exports.unstable_now());
      }, b2);
    }
    exports.unstable_IdlePriority = 5;
    exports.unstable_ImmediatePriority = 1;
    exports.unstable_LowPriority = 4;
    exports.unstable_NormalPriority = 3;
    exports.unstable_Profiling = null;
    exports.unstable_UserBlockingPriority = 2;
    exports.unstable_cancelCallback = function(a) {
      a.callback = null;
    };
    exports.unstable_continueExecution = function() {
      A2 || z2 || (A2 = true, I2(J2));
    };
    exports.unstable_forceFrameRate = function(a) {
      0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
    };
    exports.unstable_getCurrentPriorityLevel = function() {
      return y2;
    };
    exports.unstable_getFirstCallbackNode = function() {
      return h2(r2);
    };
    exports.unstable_next = function(a) {
      switch (y2) {
        case 1:
        case 2:
        case 3:
          var b2 = 3;
          break;
        default:
          b2 = y2;
      }
      var c2 = y2;
      y2 = b2;
      try {
        return a();
      } finally {
        y2 = c2;
      }
    };
    exports.unstable_pauseExecution = function() {
    };
    exports.unstable_requestPaint = function() {
    };
    exports.unstable_runWithPriority = function(a, b2) {
      switch (a) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          a = 3;
      }
      var c2 = y2;
      y2 = a;
      try {
        return b2();
      } finally {
        y2 = c2;
      }
    };
    exports.unstable_scheduleCallback = function(a, b2, c2) {
      var d2 = exports.unstable_now();
      "object" === typeof c2 && null !== c2 ? (c2 = c2.delay, c2 = "number" === typeof c2 && 0 < c2 ? d2 + c2 : d2) : c2 = d2;
      switch (a) {
        case 1:
          var e2 = -1;
          break;
        case 2:
          e2 = 250;
          break;
        case 5:
          e2 = 1073741823;
          break;
        case 4:
          e2 = 1e4;
          break;
        default:
          e2 = 5e3;
      }
      e2 = c2 + e2;
      a = { id: u2++, callback: b2, priorityLevel: a, startTime: c2, expirationTime: e2, sortIndex: -1 };
      c2 > d2 ? (a.sortIndex = c2, f2(t2, a), null === h2(r2) && a === h2(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c2 - d2))) : (a.sortIndex = e2, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
      return a;
    };
    exports.unstable_shouldYield = M2;
    exports.unstable_wrapCallback = function(a) {
      var b2 = y2;
      return function() {
        var c2 = y2;
        y2 = b2;
        try {
          return a.apply(this, arguments);
        } finally {
          y2 = c2;
        }
      };
    };
  })(scheduler_production_min);
  {
    scheduler.exports = scheduler_production_min;
  }
  var schedulerExports = scheduler.exports;
  /**
   * @license React
   * react-dom.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var aa = reactExports, ca = schedulerExports;
  function p$3(a) {
    for (var b2 = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c2 = 1; c2 < arguments.length; c2++) b2 += "&args[]=" + encodeURIComponent(arguments[c2]);
    return "Minified React error #" + a + "; visit " + b2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var da = /* @__PURE__ */ new Set(), ea = {};
  function fa(a, b2) {
    ha(a, b2);
    ha(a + "Capture", b2);
  }
  function ha(a, b2) {
    ea[a] = b2;
    for (a = 0; a < b2.length; a++) da.add(b2[a]);
  }
  var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
  function oa(a) {
    if (ja.call(ma, a)) return true;
    if (ja.call(la, a)) return false;
    if (ka.test(a)) return ma[a] = true;
    la[a] = true;
    return false;
  }
  function pa(a, b2, c2, d2) {
    if (null !== c2 && 0 === c2.type) return false;
    switch (typeof b2) {
      case "function":
      case "symbol":
        return true;
      case "boolean":
        if (d2) return false;
        if (null !== c2) return !c2.acceptsBooleans;
        a = a.toLowerCase().slice(0, 5);
        return "data-" !== a && "aria-" !== a;
      default:
        return false;
    }
  }
  function qa(a, b2, c2, d2) {
    if (null === b2 || "undefined" === typeof b2 || pa(a, b2, c2, d2)) return true;
    if (d2) return false;
    if (null !== c2) switch (c2.type) {
      case 3:
        return !b2;
      case 4:
        return false === b2;
      case 5:
        return isNaN(b2);
      case 6:
        return isNaN(b2) || 1 > b2;
    }
    return false;
  }
  function v$2(a, b2, c2, d2, e2, f2, g2) {
    this.acceptsBooleans = 2 === b2 || 3 === b2 || 4 === b2;
    this.attributeName = d2;
    this.attributeNamespace = e2;
    this.mustUseProperty = c2;
    this.propertyName = a;
    this.type = b2;
    this.sanitizeURL = f2;
    this.removeEmptyString = g2;
  }
  var z$1 = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
    z$1[a] = new v$2(a, 0, false, a, null, false, false);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
    var b2 = a[0];
    z$1[b2] = new v$2(b2, 1, false, a[1], null, false, false);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
    z$1[a] = new v$2(a, 2, false, a.toLowerCase(), null, false, false);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
    z$1[a] = new v$2(a, 2, false, a, null, false, false);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
    z$1[a] = new v$2(a, 3, false, a.toLowerCase(), null, false, false);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function(a) {
    z$1[a] = new v$2(a, 3, true, a, null, false, false);
  });
  ["capture", "download"].forEach(function(a) {
    z$1[a] = new v$2(a, 4, false, a, null, false, false);
  });
  ["cols", "rows", "size", "span"].forEach(function(a) {
    z$1[a] = new v$2(a, 6, false, a, null, false, false);
  });
  ["rowSpan", "start"].forEach(function(a) {
    z$1[a] = new v$2(a, 5, false, a.toLowerCase(), null, false, false);
  });
  var ra = /[\-:]([a-z])/g;
  function sa(a) {
    return a[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
    var b2 = a.replace(
      ra,
      sa
    );
    z$1[b2] = new v$2(b2, 1, false, a, null, false, false);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
    var b2 = a.replace(ra, sa);
    z$1[b2] = new v$2(b2, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
    var b2 = a.replace(ra, sa);
    z$1[b2] = new v$2(b2, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
  });
  ["tabIndex", "crossOrigin"].forEach(function(a) {
    z$1[a] = new v$2(a, 1, false, a.toLowerCase(), null, false, false);
  });
  z$1.xlinkHref = new v$2("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
  ["src", "href", "action", "formAction"].forEach(function(a) {
    z$1[a] = new v$2(a, 1, false, a.toLowerCase(), null, true, true);
  });
  function ta(a, b2, c2, d2) {
    var e2 = z$1.hasOwnProperty(b2) ? z$1[b2] : null;
    if (null !== e2 ? 0 !== e2.type : d2 || !(2 < b2.length) || "o" !== b2[0] && "O" !== b2[0] || "n" !== b2[1] && "N" !== b2[1]) qa(b2, c2, e2, d2) && (c2 = null), d2 || null === e2 ? oa(b2) && (null === c2 ? a.removeAttribute(b2) : a.setAttribute(b2, "" + c2)) : e2.mustUseProperty ? a[e2.propertyName] = null === c2 ? 3 === e2.type ? false : "" : c2 : (b2 = e2.attributeName, d2 = e2.attributeNamespace, null === c2 ? a.removeAttribute(b2) : (e2 = e2.type, c2 = 3 === e2 || 4 === e2 && true === c2 ? "" : "" + c2, d2 ? a.setAttributeNS(d2, b2, c2) : a.setAttribute(b2, c2)));
  }
  var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
  var Ia = Symbol.for("react.offscreen");
  var Ja = Symbol.iterator;
  function Ka(a) {
    if (null === a || "object" !== typeof a) return null;
    a = Ja && a[Ja] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  var A$1 = Object.assign, La;
  function Ma(a) {
    if (void 0 === La) try {
      throw Error();
    } catch (c2) {
      var b2 = c2.stack.trim().match(/\n( *(at )?)/);
      La = b2 && b2[1] || "";
    }
    return "\n" + La + a;
  }
  var Na = false;
  function Oa(a, b2) {
    if (!a || Na) return "";
    Na = true;
    var c2 = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (b2) if (b2 = function() {
        throw Error();
      }, Object.defineProperty(b2.prototype, "props", { set: function() {
        throw Error();
      } }), "object" === typeof Reflect && Reflect.construct) {
        try {
          Reflect.construct(b2, []);
        } catch (l2) {
          var d2 = l2;
        }
        Reflect.construct(a, [], b2);
      } else {
        try {
          b2.call();
        } catch (l2) {
          d2 = l2;
        }
        a.call(b2.prototype);
      }
      else {
        try {
          throw Error();
        } catch (l2) {
          d2 = l2;
        }
        a();
      }
    } catch (l2) {
      if (l2 && d2 && "string" === typeof l2.stack) {
        for (var e2 = l2.stack.split("\n"), f2 = d2.stack.split("\n"), g2 = e2.length - 1, h2 = f2.length - 1; 1 <= g2 && 0 <= h2 && e2[g2] !== f2[h2]; ) h2--;
        for (; 1 <= g2 && 0 <= h2; g2--, h2--) if (e2[g2] !== f2[h2]) {
          if (1 !== g2 || 1 !== h2) {
            do
              if (g2--, h2--, 0 > h2 || e2[g2] !== f2[h2]) {
                var k2 = "\n" + e2[g2].replace(" at new ", " at ");
                a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
                return k2;
              }
            while (1 <= g2 && 0 <= h2);
          }
          break;
        }
      }
    } finally {
      Na = false, Error.prepareStackTrace = c2;
    }
    return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
  }
  function Pa(a) {
    switch (a.tag) {
      case 5:
        return Ma(a.type);
      case 16:
        return Ma("Lazy");
      case 13:
        return Ma("Suspense");
      case 19:
        return Ma("SuspenseList");
      case 0:
      case 2:
      case 15:
        return a = Oa(a.type, false), a;
      case 11:
        return a = Oa(a.type.render, false), a;
      case 1:
        return a = Oa(a.type, true), a;
      default:
        return "";
    }
  }
  function Qa(a) {
    if (null == a) return null;
    if ("function" === typeof a) return a.displayName || a.name || null;
    if ("string" === typeof a) return a;
    switch (a) {
      case ya:
        return "Fragment";
      case wa:
        return "Portal";
      case Aa:
        return "Profiler";
      case za:
        return "StrictMode";
      case Ea:
        return "Suspense";
      case Fa:
        return "SuspenseList";
    }
    if ("object" === typeof a) switch (a.$$typeof) {
      case Ca:
        return (a.displayName || "Context") + ".Consumer";
      case Ba:
        return (a._context.displayName || "Context") + ".Provider";
      case Da:
        var b2 = a.render;
        a = a.displayName;
        a || (a = b2.displayName || b2.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        return a;
      case Ga:
        return b2 = a.displayName || null, null !== b2 ? b2 : Qa(a.type) || "Memo";
      case Ha:
        b2 = a._payload;
        a = a._init;
        try {
          return Qa(a(b2));
        } catch (c2) {
        }
    }
    return null;
  }
  function Ra(a) {
    var b2 = a.type;
    switch (a.tag) {
      case 24:
        return "Cache";
      case 9:
        return (b2.displayName || "Context") + ".Consumer";
      case 10:
        return (b2._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return a = b2.render, a = a.displayName || a.name || "", b2.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return b2;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return Qa(b2);
      case 8:
        return b2 === za ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if ("function" === typeof b2) return b2.displayName || b2.name || null;
        if ("string" === typeof b2) return b2;
    }
    return null;
  }
  function Sa(a) {
    switch (typeof a) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return a;
      case "object":
        return a;
      default:
        return "";
    }
  }
  function Ta(a) {
    var b2 = a.type;
    return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b2 || "radio" === b2);
  }
  function Ua(a) {
    var b2 = Ta(a) ? "checked" : "value", c2 = Object.getOwnPropertyDescriptor(a.constructor.prototype, b2), d2 = "" + a[b2];
    if (!a.hasOwnProperty(b2) && "undefined" !== typeof c2 && "function" === typeof c2.get && "function" === typeof c2.set) {
      var e2 = c2.get, f2 = c2.set;
      Object.defineProperty(a, b2, { configurable: true, get: function() {
        return e2.call(this);
      }, set: function(a2) {
        d2 = "" + a2;
        f2.call(this, a2);
      } });
      Object.defineProperty(a, b2, { enumerable: c2.enumerable });
      return { getValue: function() {
        return d2;
      }, setValue: function(a2) {
        d2 = "" + a2;
      }, stopTracking: function() {
        a._valueTracker = null;
        delete a[b2];
      } };
    }
  }
  function Va(a) {
    a._valueTracker || (a._valueTracker = Ua(a));
  }
  function Wa(a) {
    if (!a) return false;
    var b2 = a._valueTracker;
    if (!b2) return true;
    var c2 = b2.getValue();
    var d2 = "";
    a && (d2 = Ta(a) ? a.checked ? "true" : "false" : a.value);
    a = d2;
    return a !== c2 ? (b2.setValue(a), true) : false;
  }
  function Xa(a) {
    a = a || ("undefined" !== typeof document ? document : void 0);
    if ("undefined" === typeof a) return null;
    try {
      return a.activeElement || a.body;
    } catch (b2) {
      return a.body;
    }
  }
  function Ya(a, b2) {
    var c2 = b2.checked;
    return A$1({}, b2, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c2 ? c2 : a._wrapperState.initialChecked });
  }
  function Za(a, b2) {
    var c2 = null == b2.defaultValue ? "" : b2.defaultValue, d2 = null != b2.checked ? b2.checked : b2.defaultChecked;
    c2 = Sa(null != b2.value ? b2.value : c2);
    a._wrapperState = { initialChecked: d2, initialValue: c2, controlled: "checkbox" === b2.type || "radio" === b2.type ? null != b2.checked : null != b2.value };
  }
  function ab(a, b2) {
    b2 = b2.checked;
    null != b2 && ta(a, "checked", b2, false);
  }
  function bb(a, b2) {
    ab(a, b2);
    var c2 = Sa(b2.value), d2 = b2.type;
    if (null != c2) if ("number" === d2) {
      if (0 === c2 && "" === a.value || a.value != c2) a.value = "" + c2;
    } else a.value !== "" + c2 && (a.value = "" + c2);
    else if ("submit" === d2 || "reset" === d2) {
      a.removeAttribute("value");
      return;
    }
    b2.hasOwnProperty("value") ? cb(a, b2.type, c2) : b2.hasOwnProperty("defaultValue") && cb(a, b2.type, Sa(b2.defaultValue));
    null == b2.checked && null != b2.defaultChecked && (a.defaultChecked = !!b2.defaultChecked);
  }
  function db(a, b2, c2) {
    if (b2.hasOwnProperty("value") || b2.hasOwnProperty("defaultValue")) {
      var d2 = b2.type;
      if (!("submit" !== d2 && "reset" !== d2 || void 0 !== b2.value && null !== b2.value)) return;
      b2 = "" + a._wrapperState.initialValue;
      c2 || b2 === a.value || (a.value = b2);
      a.defaultValue = b2;
    }
    c2 = a.name;
    "" !== c2 && (a.name = "");
    a.defaultChecked = !!a._wrapperState.initialChecked;
    "" !== c2 && (a.name = c2);
  }
  function cb(a, b2, c2) {
    if ("number" !== b2 || Xa(a.ownerDocument) !== a) null == c2 ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c2 && (a.defaultValue = "" + c2);
  }
  var eb = Array.isArray;
  function fb(a, b2, c2, d2) {
    a = a.options;
    if (b2) {
      b2 = {};
      for (var e2 = 0; e2 < c2.length; e2++) b2["$" + c2[e2]] = true;
      for (c2 = 0; c2 < a.length; c2++) e2 = b2.hasOwnProperty("$" + a[c2].value), a[c2].selected !== e2 && (a[c2].selected = e2), e2 && d2 && (a[c2].defaultSelected = true);
    } else {
      c2 = "" + Sa(c2);
      b2 = null;
      for (e2 = 0; e2 < a.length; e2++) {
        if (a[e2].value === c2) {
          a[e2].selected = true;
          d2 && (a[e2].defaultSelected = true);
          return;
        }
        null !== b2 || a[e2].disabled || (b2 = a[e2]);
      }
      null !== b2 && (b2.selected = true);
    }
  }
  function gb(a, b2) {
    if (null != b2.dangerouslySetInnerHTML) throw Error(p$3(91));
    return A$1({}, b2, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
  }
  function hb(a, b2) {
    var c2 = b2.value;
    if (null == c2) {
      c2 = b2.children;
      b2 = b2.defaultValue;
      if (null != c2) {
        if (null != b2) throw Error(p$3(92));
        if (eb(c2)) {
          if (1 < c2.length) throw Error(p$3(93));
          c2 = c2[0];
        }
        b2 = c2;
      }
      null == b2 && (b2 = "");
      c2 = b2;
    }
    a._wrapperState = { initialValue: Sa(c2) };
  }
  function ib(a, b2) {
    var c2 = Sa(b2.value), d2 = Sa(b2.defaultValue);
    null != c2 && (c2 = "" + c2, c2 !== a.value && (a.value = c2), null == b2.defaultValue && a.defaultValue !== c2 && (a.defaultValue = c2));
    null != d2 && (a.defaultValue = "" + d2);
  }
  function jb(a) {
    var b2 = a.textContent;
    b2 === a._wrapperState.initialValue && "" !== b2 && null !== b2 && (a.value = b2);
  }
  function kb(a) {
    switch (a) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function lb(a, b2) {
    return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b2) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b2 ? "http://www.w3.org/1999/xhtml" : a;
  }
  var mb, nb = function(a) {
    return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b2, c2, d2, e2) {
      MSApp.execUnsafeLocalFunction(function() {
        return a(b2, c2, d2, e2);
      });
    } : a;
  }(function(a, b2) {
    if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b2;
    else {
      mb = mb || document.createElement("div");
      mb.innerHTML = "<svg>" + b2.valueOf().toString() + "</svg>";
      for (b2 = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
      for (; b2.firstChild; ) a.appendChild(b2.firstChild);
    }
  });
  function ob(a, b2) {
    if (b2) {
      var c2 = a.firstChild;
      if (c2 && c2 === a.lastChild && 3 === c2.nodeType) {
        c2.nodeValue = b2;
        return;
      }
    }
    a.textContent = b2;
  }
  var pb = {
    animationIterationCount: true,
    aspectRatio: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridArea: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
  }, qb = ["Webkit", "ms", "Moz", "O"];
  Object.keys(pb).forEach(function(a) {
    qb.forEach(function(b2) {
      b2 = b2 + a.charAt(0).toUpperCase() + a.substring(1);
      pb[b2] = pb[a];
    });
  });
  function rb(a, b2, c2) {
    return null == b2 || "boolean" === typeof b2 || "" === b2 ? "" : c2 || "number" !== typeof b2 || 0 === b2 || pb.hasOwnProperty(a) && pb[a] ? ("" + b2).trim() : b2 + "px";
  }
  function sb(a, b2) {
    a = a.style;
    for (var c2 in b2) if (b2.hasOwnProperty(c2)) {
      var d2 = 0 === c2.indexOf("--"), e2 = rb(c2, b2[c2], d2);
      "float" === c2 && (c2 = "cssFloat");
      d2 ? a.setProperty(c2, e2) : a[c2] = e2;
    }
  }
  var tb = A$1({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
  function ub(a, b2) {
    if (b2) {
      if (tb[a] && (null != b2.children || null != b2.dangerouslySetInnerHTML)) throw Error(p$3(137, a));
      if (null != b2.dangerouslySetInnerHTML) {
        if (null != b2.children) throw Error(p$3(60));
        if ("object" !== typeof b2.dangerouslySetInnerHTML || !("__html" in b2.dangerouslySetInnerHTML)) throw Error(p$3(61));
      }
      if (null != b2.style && "object" !== typeof b2.style) throw Error(p$3(62));
    }
  }
  function vb(a, b2) {
    if (-1 === a.indexOf("-")) return "string" === typeof b2.is;
    switch (a) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return false;
      default:
        return true;
    }
  }
  var wb = null;
  function xb(a) {
    a = a.target || a.srcElement || window;
    a.correspondingUseElement && (a = a.correspondingUseElement);
    return 3 === a.nodeType ? a.parentNode : a;
  }
  var yb = null, zb = null, Ab = null;
  function Bb(a) {
    if (a = Cb(a)) {
      if ("function" !== typeof yb) throw Error(p$3(280));
      var b2 = a.stateNode;
      b2 && (b2 = Db(b2), yb(a.stateNode, a.type, b2));
    }
  }
  function Eb(a) {
    zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
  }
  function Fb() {
    if (zb) {
      var a = zb, b2 = Ab;
      Ab = zb = null;
      Bb(a);
      if (b2) for (a = 0; a < b2.length; a++) Bb(b2[a]);
    }
  }
  function Gb(a, b2) {
    return a(b2);
  }
  function Hb() {
  }
  var Ib = false;
  function Jb(a, b2, c2) {
    if (Ib) return a(b2, c2);
    Ib = true;
    try {
      return Gb(a, b2, c2);
    } finally {
      if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
    }
  }
  function Kb(a, b2) {
    var c2 = a.stateNode;
    if (null === c2) return null;
    var d2 = Db(c2);
    if (null === d2) return null;
    c2 = d2[b2];
    a: switch (b2) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (d2 = !d2.disabled) || (a = a.type, d2 = !("button" === a || "input" === a || "select" === a || "textarea" === a));
        a = !d2;
        break a;
      default:
        a = false;
    }
    if (a) return null;
    if (c2 && "function" !== typeof c2) throw Error(p$3(231, b2, typeof c2));
    return c2;
  }
  var Lb = false;
  if (ia) try {
    var Mb = {};
    Object.defineProperty(Mb, "passive", { get: function() {
      Lb = true;
    } });
    window.addEventListener("test", Mb, Mb);
    window.removeEventListener("test", Mb, Mb);
  } catch (a) {
    Lb = false;
  }
  function Nb(a, b2, c2, d2, e2, f2, g2, h2, k2) {
    var l2 = Array.prototype.slice.call(arguments, 3);
    try {
      b2.apply(c2, l2);
    } catch (m2) {
      this.onError(m2);
    }
  }
  var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
    Ob = true;
    Pb = a;
  } };
  function Tb(a, b2, c2, d2, e2, f2, g2, h2, k2) {
    Ob = false;
    Pb = null;
    Nb.apply(Sb, arguments);
  }
  function Ub(a, b2, c2, d2, e2, f2, g2, h2, k2) {
    Tb.apply(this, arguments);
    if (Ob) {
      if (Ob) {
        var l2 = Pb;
        Ob = false;
        Pb = null;
      } else throw Error(p$3(198));
      Qb || (Qb = true, Rb = l2);
    }
  }
  function Vb(a) {
    var b2 = a, c2 = a;
    if (a.alternate) for (; b2.return; ) b2 = b2.return;
    else {
      a = b2;
      do
        b2 = a, 0 !== (b2.flags & 4098) && (c2 = b2.return), a = b2.return;
      while (a);
    }
    return 3 === b2.tag ? c2 : null;
  }
  function Wb(a) {
    if (13 === a.tag) {
      var b2 = a.memoizedState;
      null === b2 && (a = a.alternate, null !== a && (b2 = a.memoizedState));
      if (null !== b2) return b2.dehydrated;
    }
    return null;
  }
  function Xb(a) {
    if (Vb(a) !== a) throw Error(p$3(188));
  }
  function Yb(a) {
    var b2 = a.alternate;
    if (!b2) {
      b2 = Vb(a);
      if (null === b2) throw Error(p$3(188));
      return b2 !== a ? null : a;
    }
    for (var c2 = a, d2 = b2; ; ) {
      var e2 = c2.return;
      if (null === e2) break;
      var f2 = e2.alternate;
      if (null === f2) {
        d2 = e2.return;
        if (null !== d2) {
          c2 = d2;
          continue;
        }
        break;
      }
      if (e2.child === f2.child) {
        for (f2 = e2.child; f2; ) {
          if (f2 === c2) return Xb(e2), a;
          if (f2 === d2) return Xb(e2), b2;
          f2 = f2.sibling;
        }
        throw Error(p$3(188));
      }
      if (c2.return !== d2.return) c2 = e2, d2 = f2;
      else {
        for (var g2 = false, h2 = e2.child; h2; ) {
          if (h2 === c2) {
            g2 = true;
            c2 = e2;
            d2 = f2;
            break;
          }
          if (h2 === d2) {
            g2 = true;
            d2 = e2;
            c2 = f2;
            break;
          }
          h2 = h2.sibling;
        }
        if (!g2) {
          for (h2 = f2.child; h2; ) {
            if (h2 === c2) {
              g2 = true;
              c2 = f2;
              d2 = e2;
              break;
            }
            if (h2 === d2) {
              g2 = true;
              d2 = f2;
              c2 = e2;
              break;
            }
            h2 = h2.sibling;
          }
          if (!g2) throw Error(p$3(189));
        }
      }
      if (c2.alternate !== d2) throw Error(p$3(190));
    }
    if (3 !== c2.tag) throw Error(p$3(188));
    return c2.stateNode.current === c2 ? a : b2;
  }
  function Zb(a) {
    a = Yb(a);
    return null !== a ? $b(a) : null;
  }
  function $b(a) {
    if (5 === a.tag || 6 === a.tag) return a;
    for (a = a.child; null !== a; ) {
      var b2 = $b(a);
      if (null !== b2) return b2;
      a = a.sibling;
    }
    return null;
  }
  var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
  function mc(a) {
    if (lc && "function" === typeof lc.onCommitFiberRoot) try {
      lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
    } catch (b2) {
    }
  }
  var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
  function nc(a) {
    a >>>= 0;
    return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
  }
  var rc = 64, sc = 4194304;
  function tc(a) {
    switch (a & -a) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return a & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return a & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return a;
    }
  }
  function uc(a, b2) {
    var c2 = a.pendingLanes;
    if (0 === c2) return 0;
    var d2 = 0, e2 = a.suspendedLanes, f2 = a.pingedLanes, g2 = c2 & 268435455;
    if (0 !== g2) {
      var h2 = g2 & ~e2;
      0 !== h2 ? d2 = tc(h2) : (f2 &= g2, 0 !== f2 && (d2 = tc(f2)));
    } else g2 = c2 & ~e2, 0 !== g2 ? d2 = tc(g2) : 0 !== f2 && (d2 = tc(f2));
    if (0 === d2) return 0;
    if (0 !== b2 && b2 !== d2 && 0 === (b2 & e2) && (e2 = d2 & -d2, f2 = b2 & -b2, e2 >= f2 || 16 === e2 && 0 !== (f2 & 4194240))) return b2;
    0 !== (d2 & 4) && (d2 |= c2 & 16);
    b2 = a.entangledLanes;
    if (0 !== b2) for (a = a.entanglements, b2 &= d2; 0 < b2; ) c2 = 31 - oc(b2), e2 = 1 << c2, d2 |= a[c2], b2 &= ~e2;
    return d2;
  }
  function vc(a, b2) {
    switch (a) {
      case 1:
      case 2:
      case 4:
        return b2 + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return b2 + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function wc(a, b2) {
    for (var c2 = a.suspendedLanes, d2 = a.pingedLanes, e2 = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
      var g2 = 31 - oc(f2), h2 = 1 << g2, k2 = e2[g2];
      if (-1 === k2) {
        if (0 === (h2 & c2) || 0 !== (h2 & d2)) e2[g2] = vc(h2, b2);
      } else k2 <= b2 && (a.expiredLanes |= h2);
      f2 &= ~h2;
    }
  }
  function xc(a) {
    a = a.pendingLanes & -1073741825;
    return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
  }
  function yc() {
    var a = rc;
    rc <<= 1;
    0 === (rc & 4194240) && (rc = 64);
    return a;
  }
  function zc(a) {
    for (var b2 = [], c2 = 0; 31 > c2; c2++) b2.push(a);
    return b2;
  }
  function Ac(a, b2, c2) {
    a.pendingLanes |= b2;
    536870912 !== b2 && (a.suspendedLanes = 0, a.pingedLanes = 0);
    a = a.eventTimes;
    b2 = 31 - oc(b2);
    a[b2] = c2;
  }
  function Bc(a, b2) {
    var c2 = a.pendingLanes & ~b2;
    a.pendingLanes = b2;
    a.suspendedLanes = 0;
    a.pingedLanes = 0;
    a.expiredLanes &= b2;
    a.mutableReadLanes &= b2;
    a.entangledLanes &= b2;
    b2 = a.entanglements;
    var d2 = a.eventTimes;
    for (a = a.expirationTimes; 0 < c2; ) {
      var e2 = 31 - oc(c2), f2 = 1 << e2;
      b2[e2] = 0;
      d2[e2] = -1;
      a[e2] = -1;
      c2 &= ~f2;
    }
  }
  function Cc(a, b2) {
    var c2 = a.entangledLanes |= b2;
    for (a = a.entanglements; c2; ) {
      var d2 = 31 - oc(c2), e2 = 1 << d2;
      e2 & b2 | a[d2] & b2 && (a[d2] |= b2);
      c2 &= ~e2;
    }
  }
  var C = 0;
  function Dc(a) {
    a &= -a;
    return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
  }
  var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Sc(a, b2) {
    switch (a) {
      case "focusin":
      case "focusout":
        Lc = null;
        break;
      case "dragenter":
      case "dragleave":
        Mc = null;
        break;
      case "mouseover":
      case "mouseout":
        Nc = null;
        break;
      case "pointerover":
      case "pointerout":
        Oc.delete(b2.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Pc.delete(b2.pointerId);
    }
  }
  function Tc(a, b2, c2, d2, e2, f2) {
    if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b2, domEventName: c2, eventSystemFlags: d2, nativeEvent: f2, targetContainers: [e2] }, null !== b2 && (b2 = Cb(b2), null !== b2 && Fc(b2)), a;
    a.eventSystemFlags |= d2;
    b2 = a.targetContainers;
    null !== e2 && -1 === b2.indexOf(e2) && b2.push(e2);
    return a;
  }
  function Uc(a, b2, c2, d2, e2) {
    switch (b2) {
      case "focusin":
        return Lc = Tc(Lc, a, b2, c2, d2, e2), true;
      case "dragenter":
        return Mc = Tc(Mc, a, b2, c2, d2, e2), true;
      case "mouseover":
        return Nc = Tc(Nc, a, b2, c2, d2, e2), true;
      case "pointerover":
        var f2 = e2.pointerId;
        Oc.set(f2, Tc(Oc.get(f2) || null, a, b2, c2, d2, e2));
        return true;
      case "gotpointercapture":
        return f2 = e2.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b2, c2, d2, e2)), true;
    }
    return false;
  }
  function Vc(a) {
    var b2 = Wc(a.target);
    if (null !== b2) {
      var c2 = Vb(b2);
      if (null !== c2) {
        if (b2 = c2.tag, 13 === b2) {
          if (b2 = Wb(c2), null !== b2) {
            a.blockedOn = b2;
            Ic(a.priority, function() {
              Gc(c2);
            });
            return;
          }
        } else if (3 === b2 && c2.stateNode.current.memoizedState.isDehydrated) {
          a.blockedOn = 3 === c2.tag ? c2.stateNode.containerInfo : null;
          return;
        }
      }
    }
    a.blockedOn = null;
  }
  function Xc(a) {
    if (null !== a.blockedOn) return false;
    for (var b2 = a.targetContainers; 0 < b2.length; ) {
      var c2 = Yc(a.domEventName, a.eventSystemFlags, b2[0], a.nativeEvent);
      if (null === c2) {
        c2 = a.nativeEvent;
        var d2 = new c2.constructor(c2.type, c2);
        wb = d2;
        c2.target.dispatchEvent(d2);
        wb = null;
      } else return b2 = Cb(c2), null !== b2 && Fc(b2), a.blockedOn = c2, false;
      b2.shift();
    }
    return true;
  }
  function Zc(a, b2, c2) {
    Xc(a) && c2.delete(b2);
  }
  function $c() {
    Jc = false;
    null !== Lc && Xc(Lc) && (Lc = null);
    null !== Mc && Xc(Mc) && (Mc = null);
    null !== Nc && Xc(Nc) && (Nc = null);
    Oc.forEach(Zc);
    Pc.forEach(Zc);
  }
  function ad(a, b2) {
    a.blockedOn === b2 && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
  }
  function bd(a) {
    function b2(b3) {
      return ad(b3, a);
    }
    if (0 < Kc.length) {
      ad(Kc[0], a);
      for (var c2 = 1; c2 < Kc.length; c2++) {
        var d2 = Kc[c2];
        d2.blockedOn === a && (d2.blockedOn = null);
      }
    }
    null !== Lc && ad(Lc, a);
    null !== Mc && ad(Mc, a);
    null !== Nc && ad(Nc, a);
    Oc.forEach(b2);
    Pc.forEach(b2);
    for (c2 = 0; c2 < Qc.length; c2++) d2 = Qc[c2], d2.blockedOn === a && (d2.blockedOn = null);
    for (; 0 < Qc.length && (c2 = Qc[0], null === c2.blockedOn); ) Vc(c2), null === c2.blockedOn && Qc.shift();
  }
  var cd = ua.ReactCurrentBatchConfig, dd = true;
  function ed(a, b2, c2, d2) {
    var e2 = C, f2 = cd.transition;
    cd.transition = null;
    try {
      C = 1, fd(a, b2, c2, d2);
    } finally {
      C = e2, cd.transition = f2;
    }
  }
  function gd(a, b2, c2, d2) {
    var e2 = C, f2 = cd.transition;
    cd.transition = null;
    try {
      C = 4, fd(a, b2, c2, d2);
    } finally {
      C = e2, cd.transition = f2;
    }
  }
  function fd(a, b2, c2, d2) {
    if (dd) {
      var e2 = Yc(a, b2, c2, d2);
      if (null === e2) hd(a, b2, d2, id, c2), Sc(a, d2);
      else if (Uc(e2, a, b2, c2, d2)) d2.stopPropagation();
      else if (Sc(a, d2), b2 & 4 && -1 < Rc.indexOf(a)) {
        for (; null !== e2; ) {
          var f2 = Cb(e2);
          null !== f2 && Ec(f2);
          f2 = Yc(a, b2, c2, d2);
          null === f2 && hd(a, b2, d2, id, c2);
          if (f2 === e2) break;
          e2 = f2;
        }
        null !== e2 && d2.stopPropagation();
      } else hd(a, b2, d2, null, c2);
    }
  }
  var id = null;
  function Yc(a, b2, c2, d2) {
    id = null;
    a = xb(d2);
    a = Wc(a);
    if (null !== a) if (b2 = Vb(a), null === b2) a = null;
    else if (c2 = b2.tag, 13 === c2) {
      a = Wb(b2);
      if (null !== a) return a;
      a = null;
    } else if (3 === c2) {
      if (b2.stateNode.current.memoizedState.isDehydrated) return 3 === b2.tag ? b2.stateNode.containerInfo : null;
      a = null;
    } else b2 !== a && (a = null);
    id = a;
    return null;
  }
  function jd(a) {
    switch (a) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (ec()) {
          case fc:
            return 1;
          case gc:
            return 4;
          case hc:
          case ic:
            return 16;
          case jc:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var kd = null, ld = null, md = null;
  function nd() {
    if (md) return md;
    var a, b2 = ld, c2 = b2.length, d2, e2 = "value" in kd ? kd.value : kd.textContent, f2 = e2.length;
    for (a = 0; a < c2 && b2[a] === e2[a]; a++) ;
    var g2 = c2 - a;
    for (d2 = 1; d2 <= g2 && b2[c2 - d2] === e2[f2 - d2]; d2++) ;
    return md = e2.slice(a, 1 < d2 ? 1 - d2 : void 0);
  }
  function od(a) {
    var b2 = a.keyCode;
    "charCode" in a ? (a = a.charCode, 0 === a && 13 === b2 && (a = 13)) : a = b2;
    10 === a && (a = 13);
    return 32 <= a || 13 === a ? a : 0;
  }
  function pd() {
    return true;
  }
  function qd() {
    return false;
  }
  function rd(a) {
    function b2(b3, d2, e2, f2, g2) {
      this._reactName = b3;
      this._targetInst = e2;
      this.type = d2;
      this.nativeEvent = f2;
      this.target = g2;
      this.currentTarget = null;
      for (var c2 in a) a.hasOwnProperty(c2) && (b3 = a[c2], this[c2] = b3 ? b3(f2) : f2[c2]);
      this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
      this.isPropagationStopped = qd;
      return this;
    }
    A$1(b2.prototype, { preventDefault: function() {
      this.defaultPrevented = true;
      var a2 = this.nativeEvent;
      a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
    }, stopPropagation: function() {
      var a2 = this.nativeEvent;
      a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
    }, persist: function() {
    }, isPersistent: pd });
    return b2;
  }
  var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
    return a.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A$1({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A$1({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
    return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
  }, movementX: function(a) {
    if ("movementX" in a) return a.movementX;
    a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
    return wd;
  }, movementY: function(a) {
    return "movementY" in a ? a.movementY : xd;
  } }), Bd = rd(Ad), Cd = A$1({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A$1({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A$1({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A$1({}, sd, { clipboardData: function(a) {
    return "clipboardData" in a ? a.clipboardData : window.clipboardData;
  } }), Jd = rd(Id), Kd = A$1({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Nd = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Pd(a) {
    var b2 = this.nativeEvent;
    return b2.getModifierState ? b2.getModifierState(a) : (a = Od[a]) ? !!b2[a] : false;
  }
  function zd() {
    return Pd;
  }
  var Qd = A$1({}, ud, { key: function(a) {
    if (a.key) {
      var b2 = Md[a.key] || a.key;
      if ("Unidentified" !== b2) return b2;
    }
    return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
    return "keypress" === a.type ? od(a) : 0;
  }, keyCode: function(a) {
    return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
  }, which: function(a) {
    return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
  } }), Rd = rd(Qd), Sd = A$1({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A$1({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A$1({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A$1({}, Ad, {
    deltaX: function(a) {
      return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
    },
    deltaY: function(a) {
      return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
  ia && "documentMode" in document && (be = document.documentMode);
  var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
  function ge(a, b2) {
    switch (a) {
      case "keyup":
        return -1 !== $d.indexOf(b2.keyCode);
      case "keydown":
        return 229 !== b2.keyCode;
      case "keypress":
      case "mousedown":
      case "focusout":
        return true;
      default:
        return false;
    }
  }
  function he(a) {
    a = a.detail;
    return "object" === typeof a && "data" in a ? a.data : null;
  }
  var ie = false;
  function je(a, b2) {
    switch (a) {
      case "compositionend":
        return he(b2);
      case "keypress":
        if (32 !== b2.which) return null;
        fe = true;
        return ee;
      case "textInput":
        return a = b2.data, a === ee && fe ? null : a;
      default:
        return null;
    }
  }
  function ke(a, b2) {
    if (ie) return "compositionend" === a || !ae && ge(a, b2) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
    switch (a) {
      case "paste":
        return null;
      case "keypress":
        if (!(b2.ctrlKey || b2.altKey || b2.metaKey) || b2.ctrlKey && b2.altKey) {
          if (b2.char && 1 < b2.char.length) return b2.char;
          if (b2.which) return String.fromCharCode(b2.which);
        }
        return null;
      case "compositionend":
        return de && "ko" !== b2.locale ? null : b2.data;
      default:
        return null;
    }
  }
  var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
  function me(a) {
    var b2 = a && a.nodeName && a.nodeName.toLowerCase();
    return "input" === b2 ? !!le[a.type] : "textarea" === b2 ? true : false;
  }
  function ne(a, b2, c2, d2) {
    Eb(d2);
    b2 = oe(b2, "onChange");
    0 < b2.length && (c2 = new td("onChange", "change", null, c2, d2), a.push({ event: c2, listeners: b2 }));
  }
  var pe = null, qe = null;
  function re(a) {
    se(a, 0);
  }
  function te(a) {
    var b2 = ue(a);
    if (Wa(b2)) return a;
  }
  function ve(a, b2) {
    if ("change" === a) return b2;
  }
  var we = false;
  if (ia) {
    var xe;
    if (ia) {
      var ye = "oninput" in document;
      if (!ye) {
        var ze = document.createElement("div");
        ze.setAttribute("oninput", "return;");
        ye = "function" === typeof ze.oninput;
      }
      xe = ye;
    } else xe = false;
    we = xe && (!document.documentMode || 9 < document.documentMode);
  }
  function Ae() {
    pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
  }
  function Be(a) {
    if ("value" === a.propertyName && te(qe)) {
      var b2 = [];
      ne(b2, qe, a, xb(a));
      Jb(re, b2);
    }
  }
  function Ce(a, b2, c2) {
    "focusin" === a ? (Ae(), pe = b2, qe = c2, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
  }
  function De(a) {
    if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
  }
  function Ee(a, b2) {
    if ("click" === a) return te(b2);
  }
  function Fe(a, b2) {
    if ("input" === a || "change" === a) return te(b2);
  }
  function Ge(a, b2) {
    return a === b2 && (0 !== a || 1 / a === 1 / b2) || a !== a && b2 !== b2;
  }
  var He = "function" === typeof Object.is ? Object.is : Ge;
  function Ie(a, b2) {
    if (He(a, b2)) return true;
    if ("object" !== typeof a || null === a || "object" !== typeof b2 || null === b2) return false;
    var c2 = Object.keys(a), d2 = Object.keys(b2);
    if (c2.length !== d2.length) return false;
    for (d2 = 0; d2 < c2.length; d2++) {
      var e2 = c2[d2];
      if (!ja.call(b2, e2) || !He(a[e2], b2[e2])) return false;
    }
    return true;
  }
  function Je(a) {
    for (; a && a.firstChild; ) a = a.firstChild;
    return a;
  }
  function Ke(a, b2) {
    var c2 = Je(a);
    a = 0;
    for (var d2; c2; ) {
      if (3 === c2.nodeType) {
        d2 = a + c2.textContent.length;
        if (a <= b2 && d2 >= b2) return { node: c2, offset: b2 - a };
        a = d2;
      }
      a: {
        for (; c2; ) {
          if (c2.nextSibling) {
            c2 = c2.nextSibling;
            break a;
          }
          c2 = c2.parentNode;
        }
        c2 = void 0;
      }
      c2 = Je(c2);
    }
  }
  function Le(a, b2) {
    return a && b2 ? a === b2 ? true : a && 3 === a.nodeType ? false : b2 && 3 === b2.nodeType ? Le(a, b2.parentNode) : "contains" in a ? a.contains(b2) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b2) & 16) : false : false;
  }
  function Me() {
    for (var a = window, b2 = Xa(); b2 instanceof a.HTMLIFrameElement; ) {
      try {
        var c2 = "string" === typeof b2.contentWindow.location.href;
      } catch (d2) {
        c2 = false;
      }
      if (c2) a = b2.contentWindow;
      else break;
      b2 = Xa(a.document);
    }
    return b2;
  }
  function Ne(a) {
    var b2 = a && a.nodeName && a.nodeName.toLowerCase();
    return b2 && ("input" === b2 && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b2 || "true" === a.contentEditable);
  }
  function Oe(a) {
    var b2 = Me(), c2 = a.focusedElem, d2 = a.selectionRange;
    if (b2 !== c2 && c2 && c2.ownerDocument && Le(c2.ownerDocument.documentElement, c2)) {
      if (null !== d2 && Ne(c2)) {
        if (b2 = d2.start, a = d2.end, void 0 === a && (a = b2), "selectionStart" in c2) c2.selectionStart = b2, c2.selectionEnd = Math.min(a, c2.value.length);
        else if (a = (b2 = c2.ownerDocument || document) && b2.defaultView || window, a.getSelection) {
          a = a.getSelection();
          var e2 = c2.textContent.length, f2 = Math.min(d2.start, e2);
          d2 = void 0 === d2.end ? f2 : Math.min(d2.end, e2);
          !a.extend && f2 > d2 && (e2 = d2, d2 = f2, f2 = e2);
          e2 = Ke(c2, f2);
          var g2 = Ke(
            c2,
            d2
          );
          e2 && g2 && (1 !== a.rangeCount || a.anchorNode !== e2.node || a.anchorOffset !== e2.offset || a.focusNode !== g2.node || a.focusOffset !== g2.offset) && (b2 = b2.createRange(), b2.setStart(e2.node, e2.offset), a.removeAllRanges(), f2 > d2 ? (a.addRange(b2), a.extend(g2.node, g2.offset)) : (b2.setEnd(g2.node, g2.offset), a.addRange(b2)));
        }
      }
      b2 = [];
      for (a = c2; a = a.parentNode; ) 1 === a.nodeType && b2.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
      "function" === typeof c2.focus && c2.focus();
      for (c2 = 0; c2 < b2.length; c2++) a = b2[c2], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
    }
  }
  var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
  function Ue(a, b2, c2) {
    var d2 = c2.window === c2 ? c2.document : 9 === c2.nodeType ? c2 : c2.ownerDocument;
    Te || null == Qe || Qe !== Xa(d2) || (d2 = Qe, "selectionStart" in d2 && Ne(d2) ? d2 = { start: d2.selectionStart, end: d2.selectionEnd } : (d2 = (d2.ownerDocument && d2.ownerDocument.defaultView || window).getSelection(), d2 = { anchorNode: d2.anchorNode, anchorOffset: d2.anchorOffset, focusNode: d2.focusNode, focusOffset: d2.focusOffset }), Se && Ie(Se, d2) || (Se = d2, d2 = oe(Re, "onSelect"), 0 < d2.length && (b2 = new td("onSelect", "select", null, b2, c2), a.push({ event: b2, listeners: d2 }), b2.target = Qe)));
  }
  function Ve(a, b2) {
    var c2 = {};
    c2[a.toLowerCase()] = b2.toLowerCase();
    c2["Webkit" + a] = "webkit" + b2;
    c2["Moz" + a] = "moz" + b2;
    return c2;
  }
  var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
  ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
  function Ze(a) {
    if (Xe[a]) return Xe[a];
    if (!We[a]) return a;
    var b2 = We[a], c2;
    for (c2 in b2) if (b2.hasOwnProperty(c2) && c2 in Ye) return Xe[a] = b2[c2];
    return a;
  }
  var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function ff(a, b2) {
    df.set(a, b2);
    fa(b2, [a]);
  }
  for (var gf = 0; gf < ef.length; gf++) {
    var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
    ff(jf, "on" + kf);
  }
  ff($e, "onAnimationEnd");
  ff(af, "onAnimationIteration");
  ff(bf, "onAnimationStart");
  ff("dblclick", "onDoubleClick");
  ff("focusin", "onFocus");
  ff("focusout", "onBlur");
  ff(cf, "onTransitionEnd");
  ha("onMouseEnter", ["mouseout", "mouseover"]);
  ha("onMouseLeave", ["mouseout", "mouseover"]);
  ha("onPointerEnter", ["pointerout", "pointerover"]);
  ha("onPointerLeave", ["pointerout", "pointerover"]);
  fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
  function nf(a, b2, c2) {
    var d2 = a.type || "unknown-event";
    a.currentTarget = c2;
    Ub(d2, b2, void 0, a);
    a.currentTarget = null;
  }
  function se(a, b2) {
    b2 = 0 !== (b2 & 4);
    for (var c2 = 0; c2 < a.length; c2++) {
      var d2 = a[c2], e2 = d2.event;
      d2 = d2.listeners;
      a: {
        var f2 = void 0;
        if (b2) for (var g2 = d2.length - 1; 0 <= g2; g2--) {
          var h2 = d2[g2], k2 = h2.instance, l2 = h2.currentTarget;
          h2 = h2.listener;
          if (k2 !== f2 && e2.isPropagationStopped()) break a;
          nf(e2, h2, l2);
          f2 = k2;
        }
        else for (g2 = 0; g2 < d2.length; g2++) {
          h2 = d2[g2];
          k2 = h2.instance;
          l2 = h2.currentTarget;
          h2 = h2.listener;
          if (k2 !== f2 && e2.isPropagationStopped()) break a;
          nf(e2, h2, l2);
          f2 = k2;
        }
      }
    }
    if (Qb) throw a = Rb, Qb = false, Rb = null, a;
  }
  function D(a, b2) {
    var c2 = b2[of];
    void 0 === c2 && (c2 = b2[of] = /* @__PURE__ */ new Set());
    var d2 = a + "__bubble";
    c2.has(d2) || (pf(b2, a, 2, false), c2.add(d2));
  }
  function qf(a, b2, c2) {
    var d2 = 0;
    b2 && (d2 |= 4);
    pf(c2, a, d2, b2);
  }
  var rf = "_reactListening" + Math.random().toString(36).slice(2);
  function sf(a) {
    if (!a[rf]) {
      a[rf] = true;
      da.forEach(function(b3) {
        "selectionchange" !== b3 && (mf.has(b3) || qf(b3, false, a), qf(b3, true, a));
      });
      var b2 = 9 === a.nodeType ? a : a.ownerDocument;
      null === b2 || b2[rf] || (b2[rf] = true, qf("selectionchange", false, b2));
    }
  }
  function pf(a, b2, c2, d2) {
    switch (jd(b2)) {
      case 1:
        var e2 = ed;
        break;
      case 4:
        e2 = gd;
        break;
      default:
        e2 = fd;
    }
    c2 = e2.bind(null, b2, c2, a);
    e2 = void 0;
    !Lb || "touchstart" !== b2 && "touchmove" !== b2 && "wheel" !== b2 || (e2 = true);
    d2 ? void 0 !== e2 ? a.addEventListener(b2, c2, { capture: true, passive: e2 }) : a.addEventListener(b2, c2, true) : void 0 !== e2 ? a.addEventListener(b2, c2, { passive: e2 }) : a.addEventListener(b2, c2, false);
  }
  function hd(a, b2, c2, d2, e2) {
    var f2 = d2;
    if (0 === (b2 & 1) && 0 === (b2 & 2) && null !== d2) a: for (; ; ) {
      if (null === d2) return;
      var g2 = d2.tag;
      if (3 === g2 || 4 === g2) {
        var h2 = d2.stateNode.containerInfo;
        if (h2 === e2 || 8 === h2.nodeType && h2.parentNode === e2) break;
        if (4 === g2) for (g2 = d2.return; null !== g2; ) {
          var k2 = g2.tag;
          if (3 === k2 || 4 === k2) {
            if (k2 = g2.stateNode.containerInfo, k2 === e2 || 8 === k2.nodeType && k2.parentNode === e2) return;
          }
          g2 = g2.return;
        }
        for (; null !== h2; ) {
          g2 = Wc(h2);
          if (null === g2) return;
          k2 = g2.tag;
          if (5 === k2 || 6 === k2) {
            d2 = f2 = g2;
            continue a;
          }
          h2 = h2.parentNode;
        }
      }
      d2 = d2.return;
    }
    Jb(function() {
      var d3 = f2, e3 = xb(c2), g3 = [];
      a: {
        var h3 = df.get(a);
        if (void 0 !== h3) {
          var k3 = td, n2 = a;
          switch (a) {
            case "keypress":
              if (0 === od(c2)) break a;
            case "keydown":
            case "keyup":
              k3 = Rd;
              break;
            case "focusin":
              n2 = "focus";
              k3 = Fd;
              break;
            case "focusout":
              n2 = "blur";
              k3 = Fd;
              break;
            case "beforeblur":
            case "afterblur":
              k3 = Fd;
              break;
            case "click":
              if (2 === c2.button) break a;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              k3 = Bd;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              k3 = Dd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              k3 = Vd;
              break;
            case $e:
            case af:
            case bf:
              k3 = Hd;
              break;
            case cf:
              k3 = Xd;
              break;
            case "scroll":
              k3 = vd;
              break;
            case "wheel":
              k3 = Zd;
              break;
            case "copy":
            case "cut":
            case "paste":
              k3 = Jd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              k3 = Td;
          }
          var t2 = 0 !== (b2 & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h3 ? h3 + "Capture" : null : h3;
          t2 = [];
          for (var w2 = d3, u2; null !== w2; ) {
            u2 = w2;
            var F2 = u2.stateNode;
            5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
            if (J2) break;
            w2 = w2.return;
          }
          0 < t2.length && (h3 = new k3(h3, n2, null, c2, e3), g3.push({ event: h3, listeners: t2 }));
        }
      }
      if (0 === (b2 & 7)) {
        a: {
          h3 = "mouseover" === a || "pointerover" === a;
          k3 = "mouseout" === a || "pointerout" === a;
          if (h3 && c2 !== wb && (n2 = c2.relatedTarget || c2.fromElement) && (Wc(n2) || n2[uf])) break a;
          if (k3 || h3) {
            h3 = e3.window === e3 ? e3 : (h3 = e3.ownerDocument) ? h3.defaultView || h3.parentWindow : window;
            if (k3) {
              if (n2 = c2.relatedTarget || c2.toElement, k3 = d3, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
            } else k3 = null, n2 = d3;
            if (k3 !== n2) {
              t2 = Bd;
              F2 = "onMouseLeave";
              x2 = "onMouseEnter";
              w2 = "mouse";
              if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
              J2 = null == k3 ? h3 : ue(k3);
              u2 = null == n2 ? h3 : ue(n2);
              h3 = new t2(F2, w2 + "leave", k3, c2, e3);
              h3.target = J2;
              h3.relatedTarget = u2;
              F2 = null;
              Wc(e3) === d3 && (t2 = new t2(x2, w2 + "enter", n2, c2, e3), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
              J2 = F2;
              if (k3 && n2) b: {
                t2 = k3;
                x2 = n2;
                w2 = 0;
                for (u2 = t2; u2; u2 = vf(u2)) w2++;
                u2 = 0;
                for (F2 = x2; F2; F2 = vf(F2)) u2++;
                for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
                for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
                for (; w2--; ) {
                  if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                  t2 = vf(t2);
                  x2 = vf(x2);
                }
                t2 = null;
              }
              else t2 = null;
              null !== k3 && wf(g3, h3, k3, t2, false);
              null !== n2 && null !== J2 && wf(g3, J2, n2, t2, true);
            }
          }
        }
        a: {
          h3 = d3 ? ue(d3) : window;
          k3 = h3.nodeName && h3.nodeName.toLowerCase();
          if ("select" === k3 || "input" === k3 && "file" === h3.type) var na = ve;
          else if (me(h3)) if (we) na = Fe;
          else {
            na = De;
            var xa = Ce;
          }
          else (k3 = h3.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h3.type || "radio" === h3.type) && (na = Ee);
          if (na && (na = na(a, d3))) {
            ne(g3, na, c2, e3);
            break a;
          }
          xa && xa(a, h3, d3);
          "focusout" === a && (xa = h3._wrapperState) && xa.controlled && "number" === h3.type && cb(h3, "number", h3.value);
        }
        xa = d3 ? ue(d3) : window;
        switch (a) {
          case "focusin":
            if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d3, Se = null;
            break;
          case "focusout":
            Se = Re = Qe = null;
            break;
          case "mousedown":
            Te = true;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Te = false;
            Ue(g3, c2, e3);
            break;
          case "selectionchange":
            if (Pe) break;
          case "keydown":
          case "keyup":
            Ue(g3, c2, e3);
        }
        var $a;
        if (ae) b: {
          switch (a) {
            case "compositionstart":
              var ba = "onCompositionStart";
              break b;
            case "compositionend":
              ba = "onCompositionEnd";
              break b;
            case "compositionupdate":
              ba = "onCompositionUpdate";
              break b;
          }
          ba = void 0;
        }
        else ie ? ge(a, c2) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c2.keyCode && (ba = "onCompositionStart");
        ba && (de && "ko" !== c2.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e3, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d3, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c2, e3), g3.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c2), null !== $a && (ba.data = $a))));
        if ($a = ce ? je(a, c2) : ke(a, c2)) d3 = oe(d3, "onBeforeInput"), 0 < d3.length && (e3 = new Ld("onBeforeInput", "beforeinput", null, c2, e3), g3.push({ event: e3, listeners: d3 }), e3.data = $a);
      }
      se(g3, b2);
    });
  }
  function tf(a, b2, c2) {
    return { instance: a, listener: b2, currentTarget: c2 };
  }
  function oe(a, b2) {
    for (var c2 = b2 + "Capture", d2 = []; null !== a; ) {
      var e2 = a, f2 = e2.stateNode;
      5 === e2.tag && null !== f2 && (e2 = f2, f2 = Kb(a, c2), null != f2 && d2.unshift(tf(a, f2, e2)), f2 = Kb(a, b2), null != f2 && d2.push(tf(a, f2, e2)));
      a = a.return;
    }
    return d2;
  }
  function vf(a) {
    if (null === a) return null;
    do
      a = a.return;
    while (a && 5 !== a.tag);
    return a ? a : null;
  }
  function wf(a, b2, c2, d2, e2) {
    for (var f2 = b2._reactName, g2 = []; null !== c2 && c2 !== d2; ) {
      var h2 = c2, k2 = h2.alternate, l2 = h2.stateNode;
      if (null !== k2 && k2 === d2) break;
      5 === h2.tag && null !== l2 && (h2 = l2, e2 ? (k2 = Kb(c2, f2), null != k2 && g2.unshift(tf(c2, k2, h2))) : e2 || (k2 = Kb(c2, f2), null != k2 && g2.push(tf(c2, k2, h2))));
      c2 = c2.return;
    }
    0 !== g2.length && a.push({ event: b2, listeners: g2 });
  }
  var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
  function zf(a) {
    return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
  }
  function Af(a, b2, c2) {
    b2 = zf(b2);
    if (zf(a) !== b2 && c2) throw Error(p$3(425));
  }
  function Bf() {
  }
  var Cf = null, Df = null;
  function Ef(a, b2) {
    return "textarea" === a || "noscript" === a || "string" === typeof b2.children || "number" === typeof b2.children || "object" === typeof b2.dangerouslySetInnerHTML && null !== b2.dangerouslySetInnerHTML && null != b2.dangerouslySetInnerHTML.__html;
  }
  var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
    return Hf.resolve(null).then(a).catch(If);
  } : Ff;
  function If(a) {
    setTimeout(function() {
      throw a;
    });
  }
  function Kf(a, b2) {
    var c2 = b2, d2 = 0;
    do {
      var e2 = c2.nextSibling;
      a.removeChild(c2);
      if (e2 && 8 === e2.nodeType) if (c2 = e2.data, "/$" === c2) {
        if (0 === d2) {
          a.removeChild(e2);
          bd(b2);
          return;
        }
        d2--;
      } else "$" !== c2 && "$?" !== c2 && "$!" !== c2 || d2++;
      c2 = e2;
    } while (c2);
    bd(b2);
  }
  function Lf(a) {
    for (; null != a; a = a.nextSibling) {
      var b2 = a.nodeType;
      if (1 === b2 || 3 === b2) break;
      if (8 === b2) {
        b2 = a.data;
        if ("$" === b2 || "$!" === b2 || "$?" === b2) break;
        if ("/$" === b2) return null;
      }
    }
    return a;
  }
  function Mf(a) {
    a = a.previousSibling;
    for (var b2 = 0; a; ) {
      if (8 === a.nodeType) {
        var c2 = a.data;
        if ("$" === c2 || "$!" === c2 || "$?" === c2) {
          if (0 === b2) return a;
          b2--;
        } else "/$" === c2 && b2++;
      }
      a = a.previousSibling;
    }
    return null;
  }
  var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
  function Wc(a) {
    var b2 = a[Of];
    if (b2) return b2;
    for (var c2 = a.parentNode; c2; ) {
      if (b2 = c2[uf] || c2[Of]) {
        c2 = b2.alternate;
        if (null !== b2.child || null !== c2 && null !== c2.child) for (a = Mf(a); null !== a; ) {
          if (c2 = a[Of]) return c2;
          a = Mf(a);
        }
        return b2;
      }
      a = c2;
      c2 = a.parentNode;
    }
    return null;
  }
  function Cb(a) {
    a = a[Of] || a[uf];
    return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
  }
  function ue(a) {
    if (5 === a.tag || 6 === a.tag) return a.stateNode;
    throw Error(p$3(33));
  }
  function Db(a) {
    return a[Pf] || null;
  }
  var Sf = [], Tf = -1;
  function Uf(a) {
    return { current: a };
  }
  function E(a) {
    0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
  }
  function G(a, b2) {
    Tf++;
    Sf[Tf] = a.current;
    a.current = b2;
  }
  var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
  function Yf(a, b2) {
    var c2 = a.type.contextTypes;
    if (!c2) return Vf;
    var d2 = a.stateNode;
    if (d2 && d2.__reactInternalMemoizedUnmaskedChildContext === b2) return d2.__reactInternalMemoizedMaskedChildContext;
    var e2 = {}, f2;
    for (f2 in c2) e2[f2] = b2[f2];
    d2 && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b2, a.__reactInternalMemoizedMaskedChildContext = e2);
    return e2;
  }
  function Zf(a) {
    a = a.childContextTypes;
    return null !== a && void 0 !== a;
  }
  function $f() {
    E(Wf);
    E(H);
  }
  function ag(a, b2, c2) {
    if (H.current !== Vf) throw Error(p$3(168));
    G(H, b2);
    G(Wf, c2);
  }
  function bg(a, b2, c2) {
    var d2 = a.stateNode;
    b2 = b2.childContextTypes;
    if ("function" !== typeof d2.getChildContext) return c2;
    d2 = d2.getChildContext();
    for (var e2 in d2) if (!(e2 in b2)) throw Error(p$3(108, Ra(a) || "Unknown", e2));
    return A$1({}, c2, d2);
  }
  function cg(a) {
    a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
    Xf = H.current;
    G(H, a);
    G(Wf, Wf.current);
    return true;
  }
  function dg(a, b2, c2) {
    var d2 = a.stateNode;
    if (!d2) throw Error(p$3(169));
    c2 ? (a = bg(a, b2, Xf), d2.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
    G(Wf, c2);
  }
  var eg = null, fg = false, gg = false;
  function hg(a) {
    null === eg ? eg = [a] : eg.push(a);
  }
  function ig(a) {
    fg = true;
    hg(a);
  }
  function jg() {
    if (!gg && null !== eg) {
      gg = true;
      var a = 0, b2 = C;
      try {
        var c2 = eg;
        for (C = 1; a < c2.length; a++) {
          var d2 = c2[a];
          do
            d2 = d2(true);
          while (null !== d2);
        }
        eg = null;
        fg = false;
      } catch (e2) {
        throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e2;
      } finally {
        C = b2, gg = false;
      }
    }
    return null;
  }
  var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
  function tg(a, b2) {
    kg[lg++] = ng;
    kg[lg++] = mg;
    mg = a;
    ng = b2;
  }
  function ug(a, b2, c2) {
    og[pg++] = rg;
    og[pg++] = sg;
    og[pg++] = qg;
    qg = a;
    var d2 = rg;
    a = sg;
    var e2 = 32 - oc(d2) - 1;
    d2 &= ~(1 << e2);
    c2 += 1;
    var f2 = 32 - oc(b2) + e2;
    if (30 < f2) {
      var g2 = e2 - e2 % 5;
      f2 = (d2 & (1 << g2) - 1).toString(32);
      d2 >>= g2;
      e2 -= g2;
      rg = 1 << 32 - oc(b2) + e2 | c2 << e2 | d2;
      sg = f2 + a;
    } else rg = 1 << f2 | c2 << e2 | d2, sg = a;
  }
  function vg(a) {
    null !== a.return && (tg(a, 1), ug(a, 1, 0));
  }
  function wg(a) {
    for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
    for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
  }
  var xg = null, yg = null, I = false, zg = null;
  function Ag(a, b2) {
    var c2 = Bg(5, null, null, 0);
    c2.elementType = "DELETED";
    c2.stateNode = b2;
    c2.return = a;
    b2 = a.deletions;
    null === b2 ? (a.deletions = [c2], a.flags |= 16) : b2.push(c2);
  }
  function Cg(a, b2) {
    switch (a.tag) {
      case 5:
        var c2 = a.type;
        b2 = 1 !== b2.nodeType || c2.toLowerCase() !== b2.nodeName.toLowerCase() ? null : b2;
        return null !== b2 ? (a.stateNode = b2, xg = a, yg = Lf(b2.firstChild), true) : false;
      case 6:
        return b2 = "" === a.pendingProps || 3 !== b2.nodeType ? null : b2, null !== b2 ? (a.stateNode = b2, xg = a, yg = null, true) : false;
      case 13:
        return b2 = 8 !== b2.nodeType ? null : b2, null !== b2 ? (c2 = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b2, treeContext: c2, retryLane: 1073741824 }, c2 = Bg(18, null, null, 0), c2.stateNode = b2, c2.return = a, a.child = c2, xg = a, yg = null, true) : false;
      default:
        return false;
    }
  }
  function Dg(a) {
    return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
  }
  function Eg(a) {
    if (I) {
      var b2 = yg;
      if (b2) {
        var c2 = b2;
        if (!Cg(a, b2)) {
          if (Dg(a)) throw Error(p$3(418));
          b2 = Lf(c2.nextSibling);
          var d2 = xg;
          b2 && Cg(a, b2) ? Ag(d2, c2) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
        }
      } else {
        if (Dg(a)) throw Error(p$3(418));
        a.flags = a.flags & -4097 | 2;
        I = false;
        xg = a;
      }
    }
  }
  function Fg(a) {
    for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
    xg = a;
  }
  function Gg(a) {
    if (a !== xg) return false;
    if (!I) return Fg(a), I = true, false;
    var b2;
    (b2 = 3 !== a.tag) && !(b2 = 5 !== a.tag) && (b2 = a.type, b2 = "head" !== b2 && "body" !== b2 && !Ef(a.type, a.memoizedProps));
    if (b2 && (b2 = yg)) {
      if (Dg(a)) throw Hg(), Error(p$3(418));
      for (; b2; ) Ag(a, b2), b2 = Lf(b2.nextSibling);
    }
    Fg(a);
    if (13 === a.tag) {
      a = a.memoizedState;
      a = null !== a ? a.dehydrated : null;
      if (!a) throw Error(p$3(317));
      a: {
        a = a.nextSibling;
        for (b2 = 0; a; ) {
          if (8 === a.nodeType) {
            var c2 = a.data;
            if ("/$" === c2) {
              if (0 === b2) {
                yg = Lf(a.nextSibling);
                break a;
              }
              b2--;
            } else "$" !== c2 && "$!" !== c2 && "$?" !== c2 || b2++;
          }
          a = a.nextSibling;
        }
        yg = null;
      }
    } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
    return true;
  }
  function Hg() {
    for (var a = yg; a; ) a = Lf(a.nextSibling);
  }
  function Ig() {
    yg = xg = null;
    I = false;
  }
  function Jg(a) {
    null === zg ? zg = [a] : zg.push(a);
  }
  var Kg = ua.ReactCurrentBatchConfig;
  function Lg(a, b2, c2) {
    a = c2.ref;
    if (null !== a && "function" !== typeof a && "object" !== typeof a) {
      if (c2._owner) {
        c2 = c2._owner;
        if (c2) {
          if (1 !== c2.tag) throw Error(p$3(309));
          var d2 = c2.stateNode;
        }
        if (!d2) throw Error(p$3(147, a));
        var e2 = d2, f2 = "" + a;
        if (null !== b2 && null !== b2.ref && "function" === typeof b2.ref && b2.ref._stringRef === f2) return b2.ref;
        b2 = function(a2) {
          var b3 = e2.refs;
          null === a2 ? delete b3[f2] : b3[f2] = a2;
        };
        b2._stringRef = f2;
        return b2;
      }
      if ("string" !== typeof a) throw Error(p$3(284));
      if (!c2._owner) throw Error(p$3(290, a));
    }
    return a;
  }
  function Mg(a, b2) {
    a = Object.prototype.toString.call(b2);
    throw Error(p$3(31, "[object Object]" === a ? "object with keys {" + Object.keys(b2).join(", ") + "}" : a));
  }
  function Ng(a) {
    var b2 = a._init;
    return b2(a._payload);
  }
  function Og(a) {
    function b2(b3, c3) {
      if (a) {
        var d3 = b3.deletions;
        null === d3 ? (b3.deletions = [c3], b3.flags |= 16) : d3.push(c3);
      }
    }
    function c2(c3, d3) {
      if (!a) return null;
      for (; null !== d3; ) b2(c3, d3), d3 = d3.sibling;
      return null;
    }
    function d2(a2, b3) {
      for (a2 = /* @__PURE__ */ new Map(); null !== b3; ) null !== b3.key ? a2.set(b3.key, b3) : a2.set(b3.index, b3), b3 = b3.sibling;
      return a2;
    }
    function e2(a2, b3) {
      a2 = Pg(a2, b3);
      a2.index = 0;
      a2.sibling = null;
      return a2;
    }
    function f2(b3, c3, d3) {
      b3.index = d3;
      if (!a) return b3.flags |= 1048576, c3;
      d3 = b3.alternate;
      if (null !== d3) return d3 = d3.index, d3 < c3 ? (b3.flags |= 2, c3) : d3;
      b3.flags |= 2;
      return c3;
    }
    function g2(b3) {
      a && null === b3.alternate && (b3.flags |= 2);
      return b3;
    }
    function h2(a2, b3, c3, d3) {
      if (null === b3 || 6 !== b3.tag) return b3 = Qg(c3, a2.mode, d3), b3.return = a2, b3;
      b3 = e2(b3, c3);
      b3.return = a2;
      return b3;
    }
    function k2(a2, b3, c3, d3) {
      var f3 = c3.type;
      if (f3 === ya) return m2(a2, b3, c3.props.children, d3, c3.key);
      if (null !== b3 && (b3.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b3.type)) return d3 = e2(b3, c3.props), d3.ref = Lg(a2, b3, c3), d3.return = a2, d3;
      d3 = Rg(c3.type, c3.key, c3.props, null, a2.mode, d3);
      d3.ref = Lg(a2, b3, c3);
      d3.return = a2;
      return d3;
    }
    function l2(a2, b3, c3, d3) {
      if (null === b3 || 4 !== b3.tag || b3.stateNode.containerInfo !== c3.containerInfo || b3.stateNode.implementation !== c3.implementation) return b3 = Sg(c3, a2.mode, d3), b3.return = a2, b3;
      b3 = e2(b3, c3.children || []);
      b3.return = a2;
      return b3;
    }
    function m2(a2, b3, c3, d3, f3) {
      if (null === b3 || 7 !== b3.tag) return b3 = Tg(c3, a2.mode, d3, f3), b3.return = a2, b3;
      b3 = e2(b3, c3);
      b3.return = a2;
      return b3;
    }
    function q2(a2, b3, c3) {
      if ("string" === typeof b3 && "" !== b3 || "number" === typeof b3) return b3 = Qg("" + b3, a2.mode, c3), b3.return = a2, b3;
      if ("object" === typeof b3 && null !== b3) {
        switch (b3.$$typeof) {
          case va:
            return c3 = Rg(b3.type, b3.key, b3.props, null, a2.mode, c3), c3.ref = Lg(a2, null, b3), c3.return = a2, c3;
          case wa:
            return b3 = Sg(b3, a2.mode, c3), b3.return = a2, b3;
          case Ha:
            var d3 = b3._init;
            return q2(a2, d3(b3._payload), c3);
        }
        if (eb(b3) || Ka(b3)) return b3 = Tg(b3, a2.mode, c3, null), b3.return = a2, b3;
        Mg(a2, b3);
      }
      return null;
    }
    function r2(a2, b3, c3, d3) {
      var e3 = null !== b3 ? b3.key : null;
      if ("string" === typeof c3 && "" !== c3 || "number" === typeof c3) return null !== e3 ? null : h2(a2, b3, "" + c3, d3);
      if ("object" === typeof c3 && null !== c3) {
        switch (c3.$$typeof) {
          case va:
            return c3.key === e3 ? k2(a2, b3, c3, d3) : null;
          case wa:
            return c3.key === e3 ? l2(a2, b3, c3, d3) : null;
          case Ha:
            return e3 = c3._init, r2(
              a2,
              b3,
              e3(c3._payload),
              d3
            );
        }
        if (eb(c3) || Ka(c3)) return null !== e3 ? null : m2(a2, b3, c3, d3, null);
        Mg(a2, c3);
      }
      return null;
    }
    function y2(a2, b3, c3, d3, e3) {
      if ("string" === typeof d3 && "" !== d3 || "number" === typeof d3) return a2 = a2.get(c3) || null, h2(b3, a2, "" + d3, e3);
      if ("object" === typeof d3 && null !== d3) {
        switch (d3.$$typeof) {
          case va:
            return a2 = a2.get(null === d3.key ? c3 : d3.key) || null, k2(b3, a2, d3, e3);
          case wa:
            return a2 = a2.get(null === d3.key ? c3 : d3.key) || null, l2(b3, a2, d3, e3);
          case Ha:
            var f3 = d3._init;
            return y2(a2, b3, c3, f3(d3._payload), e3);
        }
        if (eb(d3) || Ka(d3)) return a2 = a2.get(c3) || null, m2(b3, a2, d3, e3, null);
        Mg(b3, d3);
      }
      return null;
    }
    function n2(e3, g3, h3, k3) {
      for (var l3 = null, m3 = null, u2 = g3, w2 = g3 = 0, x2 = null; null !== u2 && w2 < h3.length; w2++) {
        u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
        var n3 = r2(e3, u2, h3[w2], k3);
        if (null === n3) {
          null === u2 && (u2 = x2);
          break;
        }
        a && u2 && null === n3.alternate && b2(e3, u2);
        g3 = f2(n3, g3, w2);
        null === m3 ? l3 = n3 : m3.sibling = n3;
        m3 = n3;
        u2 = x2;
      }
      if (w2 === h3.length) return c2(e3, u2), I && tg(e3, w2), l3;
      if (null === u2) {
        for (; w2 < h3.length; w2++) u2 = q2(e3, h3[w2], k3), null !== u2 && (g3 = f2(u2, g3, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
        I && tg(e3, w2);
        return l3;
      }
      for (u2 = d2(e3, u2); w2 < h3.length; w2++) x2 = y2(u2, e3, w2, h3[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g3 = f2(x2, g3, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
      a && u2.forEach(function(a2) {
        return b2(e3, a2);
      });
      I && tg(e3, w2);
      return l3;
    }
    function t2(e3, g3, h3, k3) {
      var l3 = Ka(h3);
      if ("function" !== typeof l3) throw Error(p$3(150));
      h3 = l3.call(h3);
      if (null == h3) throw Error(p$3(151));
      for (var u2 = l3 = null, m3 = g3, w2 = g3 = 0, x2 = null, n3 = h3.next(); null !== m3 && !n3.done; w2++, n3 = h3.next()) {
        m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
        var t3 = r2(e3, m3, n3.value, k3);
        if (null === t3) {
          null === m3 && (m3 = x2);
          break;
        }
        a && m3 && null === t3.alternate && b2(e3, m3);
        g3 = f2(t3, g3, w2);
        null === u2 ? l3 = t3 : u2.sibling = t3;
        u2 = t3;
        m3 = x2;
      }
      if (n3.done) return c2(
        e3,
        m3
      ), I && tg(e3, w2), l3;
      if (null === m3) {
        for (; !n3.done; w2++, n3 = h3.next()) n3 = q2(e3, n3.value, k3), null !== n3 && (g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
        I && tg(e3, w2);
        return l3;
      }
      for (m3 = d2(e3, m3); !n3.done; w2++, n3 = h3.next()) n3 = y2(m3, e3, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      a && m3.forEach(function(a2) {
        return b2(e3, a2);
      });
      I && tg(e3, w2);
      return l3;
    }
    function J2(a2, d3, f3, h3) {
      "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
      if ("object" === typeof f3 && null !== f3) {
        switch (f3.$$typeof) {
          case va:
            a: {
              for (var k3 = f3.key, l3 = d3; null !== l3; ) {
                if (l3.key === k3) {
                  k3 = f3.type;
                  if (k3 === ya) {
                    if (7 === l3.tag) {
                      c2(a2, l3.sibling);
                      d3 = e2(l3, f3.props.children);
                      d3.return = a2;
                      a2 = d3;
                      break a;
                    }
                  } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                    c2(a2, l3.sibling);
                    d3 = e2(l3, f3.props);
                    d3.ref = Lg(a2, l3, f3);
                    d3.return = a2;
                    a2 = d3;
                    break a;
                  }
                  c2(a2, l3);
                  break;
                } else b2(a2, l3);
                l3 = l3.sibling;
              }
              f3.type === ya ? (d3 = Tg(f3.props.children, a2.mode, h3, f3.key), d3.return = a2, a2 = d3) : (h3 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h3), h3.ref = Lg(a2, d3, f3), h3.return = a2, a2 = h3);
            }
            return g2(a2);
          case wa:
            a: {
              for (l3 = f3.key; null !== d3; ) {
                if (d3.key === l3) if (4 === d3.tag && d3.stateNode.containerInfo === f3.containerInfo && d3.stateNode.implementation === f3.implementation) {
                  c2(a2, d3.sibling);
                  d3 = e2(d3, f3.children || []);
                  d3.return = a2;
                  a2 = d3;
                  break a;
                } else {
                  c2(a2, d3);
                  break;
                }
                else b2(a2, d3);
                d3 = d3.sibling;
              }
              d3 = Sg(f3, a2.mode, h3);
              d3.return = a2;
              a2 = d3;
            }
            return g2(a2);
          case Ha:
            return l3 = f3._init, J2(a2, d3, l3(f3._payload), h3);
        }
        if (eb(f3)) return n2(a2, d3, f3, h3);
        if (Ka(f3)) return t2(a2, d3, f3, h3);
        Mg(a2, f3);
      }
      return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d3 && 6 === d3.tag ? (c2(a2, d3.sibling), d3 = e2(d3, f3), d3.return = a2, a2 = d3) : (c2(a2, d3), d3 = Qg(f3, a2.mode, h3), d3.return = a2, a2 = d3), g2(a2)) : c2(a2, d3);
    }
    return J2;
  }
  var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
  function $g() {
    Zg = Yg = Xg = null;
  }
  function ah(a) {
    var b2 = Wg.current;
    E(Wg);
    a._currentValue = b2;
  }
  function bh(a, b2, c2) {
    for (; null !== a; ) {
      var d2 = a.alternate;
      (a.childLanes & b2) !== b2 ? (a.childLanes |= b2, null !== d2 && (d2.childLanes |= b2)) : null !== d2 && (d2.childLanes & b2) !== b2 && (d2.childLanes |= b2);
      if (a === c2) break;
      a = a.return;
    }
  }
  function ch(a, b2) {
    Xg = a;
    Zg = Yg = null;
    a = a.dependencies;
    null !== a && null !== a.firstContext && (0 !== (a.lanes & b2) && (dh = true), a.firstContext = null);
  }
  function eh(a) {
    var b2 = a._currentValue;
    if (Zg !== a) if (a = { context: a, memoizedValue: b2, next: null }, null === Yg) {
      if (null === Xg) throw Error(p$3(308));
      Yg = a;
      Xg.dependencies = { lanes: 0, firstContext: a };
    } else Yg = Yg.next = a;
    return b2;
  }
  var fh = null;
  function gh(a) {
    null === fh ? fh = [a] : fh.push(a);
  }
  function hh(a, b2, c2, d2) {
    var e2 = b2.interleaved;
    null === e2 ? (c2.next = c2, gh(b2)) : (c2.next = e2.next, e2.next = c2);
    b2.interleaved = c2;
    return ih(a, d2);
  }
  function ih(a, b2) {
    a.lanes |= b2;
    var c2 = a.alternate;
    null !== c2 && (c2.lanes |= b2);
    c2 = a;
    for (a = a.return; null !== a; ) a.childLanes |= b2, c2 = a.alternate, null !== c2 && (c2.childLanes |= b2), c2 = a, a = a.return;
    return 3 === c2.tag ? c2.stateNode : null;
  }
  var jh = false;
  function kh(a) {
    a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function lh(a, b2) {
    a = a.updateQueue;
    b2.updateQueue === a && (b2.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
  }
  function mh(a, b2) {
    return { eventTime: a, lane: b2, tag: 0, payload: null, callback: null, next: null };
  }
  function nh(a, b2, c2) {
    var d2 = a.updateQueue;
    if (null === d2) return null;
    d2 = d2.shared;
    if (0 !== (K & 2)) {
      var e2 = d2.pending;
      null === e2 ? b2.next = b2 : (b2.next = e2.next, e2.next = b2);
      d2.pending = b2;
      return ih(a, c2);
    }
    e2 = d2.interleaved;
    null === e2 ? (b2.next = b2, gh(d2)) : (b2.next = e2.next, e2.next = b2);
    d2.interleaved = b2;
    return ih(a, c2);
  }
  function oh(a, b2, c2) {
    b2 = b2.updateQueue;
    if (null !== b2 && (b2 = b2.shared, 0 !== (c2 & 4194240))) {
      var d2 = b2.lanes;
      d2 &= a.pendingLanes;
      c2 |= d2;
      b2.lanes = c2;
      Cc(a, c2);
    }
  }
  function ph(a, b2) {
    var c2 = a.updateQueue, d2 = a.alternate;
    if (null !== d2 && (d2 = d2.updateQueue, c2 === d2)) {
      var e2 = null, f2 = null;
      c2 = c2.firstBaseUpdate;
      if (null !== c2) {
        do {
          var g2 = { eventTime: c2.eventTime, lane: c2.lane, tag: c2.tag, payload: c2.payload, callback: c2.callback, next: null };
          null === f2 ? e2 = f2 = g2 : f2 = f2.next = g2;
          c2 = c2.next;
        } while (null !== c2);
        null === f2 ? e2 = f2 = b2 : f2 = f2.next = b2;
      } else e2 = f2 = b2;
      c2 = { baseState: d2.baseState, firstBaseUpdate: e2, lastBaseUpdate: f2, shared: d2.shared, effects: d2.effects };
      a.updateQueue = c2;
      return;
    }
    a = c2.lastBaseUpdate;
    null === a ? c2.firstBaseUpdate = b2 : a.next = b2;
    c2.lastBaseUpdate = b2;
  }
  function qh(a, b2, c2, d2) {
    var e2 = a.updateQueue;
    jh = false;
    var f2 = e2.firstBaseUpdate, g2 = e2.lastBaseUpdate, h2 = e2.shared.pending;
    if (null !== h2) {
      e2.shared.pending = null;
      var k2 = h2, l2 = k2.next;
      k2.next = null;
      null === g2 ? f2 = l2 : g2.next = l2;
      g2 = k2;
      var m2 = a.alternate;
      null !== m2 && (m2 = m2.updateQueue, h2 = m2.lastBaseUpdate, h2 !== g2 && (null === h2 ? m2.firstBaseUpdate = l2 : h2.next = l2, m2.lastBaseUpdate = k2));
    }
    if (null !== f2) {
      var q2 = e2.baseState;
      g2 = 0;
      m2 = l2 = k2 = null;
      h2 = f2;
      do {
        var r2 = h2.lane, y2 = h2.eventTime;
        if ((d2 & r2) === r2) {
          null !== m2 && (m2 = m2.next = {
            eventTime: y2,
            lane: 0,
            tag: h2.tag,
            payload: h2.payload,
            callback: h2.callback,
            next: null
          });
          a: {
            var n2 = a, t2 = h2;
            r2 = b2;
            y2 = c2;
            switch (t2.tag) {
              case 1:
                n2 = t2.payload;
                if ("function" === typeof n2) {
                  q2 = n2.call(y2, q2, r2);
                  break a;
                }
                q2 = n2;
                break a;
              case 3:
                n2.flags = n2.flags & -65537 | 128;
              case 0:
                n2 = t2.payload;
                r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
                if (null === r2 || void 0 === r2) break a;
                q2 = A$1({}, q2, r2);
                break a;
              case 2:
                jh = true;
            }
          }
          null !== h2.callback && 0 !== h2.lane && (a.flags |= 64, r2 = e2.effects, null === r2 ? e2.effects = [h2] : r2.push(h2));
        } else y2 = { eventTime: y2, lane: r2, tag: h2.tag, payload: h2.payload, callback: h2.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g2 |= r2;
        h2 = h2.next;
        if (null === h2) if (h2 = e2.shared.pending, null === h2) break;
        else r2 = h2, h2 = r2.next, r2.next = null, e2.lastBaseUpdate = r2, e2.shared.pending = null;
      } while (1);
      null === m2 && (k2 = q2);
      e2.baseState = k2;
      e2.firstBaseUpdate = l2;
      e2.lastBaseUpdate = m2;
      b2 = e2.shared.interleaved;
      if (null !== b2) {
        e2 = b2;
        do
          g2 |= e2.lane, e2 = e2.next;
        while (e2 !== b2);
      } else null === f2 && (e2.shared.lanes = 0);
      rh |= g2;
      a.lanes = g2;
      a.memoizedState = q2;
    }
  }
  function sh(a, b2, c2) {
    a = b2.effects;
    b2.effects = null;
    if (null !== a) for (b2 = 0; b2 < a.length; b2++) {
      var d2 = a[b2], e2 = d2.callback;
      if (null !== e2) {
        d2.callback = null;
        d2 = c2;
        if ("function" !== typeof e2) throw Error(p$3(191, e2));
        e2.call(d2);
      }
    }
  }
  var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
  function xh(a) {
    if (a === th) throw Error(p$3(174));
    return a;
  }
  function yh(a, b2) {
    G(wh, b2);
    G(vh, a);
    G(uh, th);
    a = b2.nodeType;
    switch (a) {
      case 9:
      case 11:
        b2 = (b2 = b2.documentElement) ? b2.namespaceURI : lb(null, "");
        break;
      default:
        a = 8 === a ? b2.parentNode : b2, b2 = a.namespaceURI || null, a = a.tagName, b2 = lb(b2, a);
    }
    E(uh);
    G(uh, b2);
  }
  function zh() {
    E(uh);
    E(vh);
    E(wh);
  }
  function Ah(a) {
    xh(wh.current);
    var b2 = xh(uh.current);
    var c2 = lb(b2, a.type);
    b2 !== c2 && (G(vh, a), G(uh, c2));
  }
  function Bh(a) {
    vh.current === a && (E(uh), E(vh));
  }
  var L = Uf(0);
  function Ch(a) {
    for (var b2 = a; null !== b2; ) {
      if (13 === b2.tag) {
        var c2 = b2.memoizedState;
        if (null !== c2 && (c2 = c2.dehydrated, null === c2 || "$?" === c2.data || "$!" === c2.data)) return b2;
      } else if (19 === b2.tag && void 0 !== b2.memoizedProps.revealOrder) {
        if (0 !== (b2.flags & 128)) return b2;
      } else if (null !== b2.child) {
        b2.child.return = b2;
        b2 = b2.child;
        continue;
      }
      if (b2 === a) break;
      for (; null === b2.sibling; ) {
        if (null === b2.return || b2.return === a) return null;
        b2 = b2.return;
      }
      b2.sibling.return = b2.return;
      b2 = b2.sibling;
    }
    return null;
  }
  var Dh = [];
  function Eh() {
    for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
    Dh.length = 0;
  }
  var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
  function P() {
    throw Error(p$3(321));
  }
  function Mh(a, b2) {
    if (null === b2) return false;
    for (var c2 = 0; c2 < b2.length && c2 < a.length; c2++) if (!He(a[c2], b2[c2])) return false;
    return true;
  }
  function Nh(a, b2, c2, d2, e2, f2) {
    Hh = f2;
    M = b2;
    b2.memoizedState = null;
    b2.updateQueue = null;
    b2.lanes = 0;
    Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
    a = c2(d2, e2);
    if (Jh) {
      f2 = 0;
      do {
        Jh = false;
        Kh = 0;
        if (25 <= f2) throw Error(p$3(301));
        f2 += 1;
        O = N = null;
        b2.updateQueue = null;
        Fh.current = Qh;
        a = c2(d2, e2);
      } while (Jh);
    }
    Fh.current = Rh;
    b2 = null !== N && null !== N.next;
    Hh = 0;
    O = N = M = null;
    Ih = false;
    if (b2) throw Error(p$3(300));
    return a;
  }
  function Sh() {
    var a = 0 !== Kh;
    Kh = 0;
    return a;
  }
  function Th() {
    var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
    return O;
  }
  function Uh() {
    if (null === N) {
      var a = M.alternate;
      a = null !== a ? a.memoizedState : null;
    } else a = N.next;
    var b2 = null === O ? M.memoizedState : O.next;
    if (null !== b2) O = b2, N = a;
    else {
      if (null === a) throw Error(p$3(310));
      N = a;
      a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
      null === O ? M.memoizedState = O = a : O = O.next = a;
    }
    return O;
  }
  function Vh(a, b2) {
    return "function" === typeof b2 ? b2(a) : b2;
  }
  function Wh(a) {
    var b2 = Uh(), c2 = b2.queue;
    if (null === c2) throw Error(p$3(311));
    c2.lastRenderedReducer = a;
    var d2 = N, e2 = d2.baseQueue, f2 = c2.pending;
    if (null !== f2) {
      if (null !== e2) {
        var g2 = e2.next;
        e2.next = f2.next;
        f2.next = g2;
      }
      d2.baseQueue = e2 = f2;
      c2.pending = null;
    }
    if (null !== e2) {
      f2 = e2.next;
      d2 = d2.baseState;
      var h2 = g2 = null, k2 = null, l2 = f2;
      do {
        var m2 = l2.lane;
        if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d2 = l2.hasEagerState ? l2.eagerState : a(d2, l2.action);
        else {
          var q2 = {
            lane: m2,
            action: l2.action,
            hasEagerState: l2.hasEagerState,
            eagerState: l2.eagerState,
            next: null
          };
          null === k2 ? (h2 = k2 = q2, g2 = d2) : k2 = k2.next = q2;
          M.lanes |= m2;
          rh |= m2;
        }
        l2 = l2.next;
      } while (null !== l2 && l2 !== f2);
      null === k2 ? g2 = d2 : k2.next = h2;
      He(d2, b2.memoizedState) || (dh = true);
      b2.memoizedState = d2;
      b2.baseState = g2;
      b2.baseQueue = k2;
      c2.lastRenderedState = d2;
    }
    a = c2.interleaved;
    if (null !== a) {
      e2 = a;
      do
        f2 = e2.lane, M.lanes |= f2, rh |= f2, e2 = e2.next;
      while (e2 !== a);
    } else null === e2 && (c2.lanes = 0);
    return [b2.memoizedState, c2.dispatch];
  }
  function Xh(a) {
    var b2 = Uh(), c2 = b2.queue;
    if (null === c2) throw Error(p$3(311));
    c2.lastRenderedReducer = a;
    var d2 = c2.dispatch, e2 = c2.pending, f2 = b2.memoizedState;
    if (null !== e2) {
      c2.pending = null;
      var g2 = e2 = e2.next;
      do
        f2 = a(f2, g2.action), g2 = g2.next;
      while (g2 !== e2);
      He(f2, b2.memoizedState) || (dh = true);
      b2.memoizedState = f2;
      null === b2.baseQueue && (b2.baseState = f2);
      c2.lastRenderedState = f2;
    }
    return [f2, d2];
  }
  function Yh() {
  }
  function Zh(a, b2) {
    var c2 = M, d2 = Uh(), e2 = b2(), f2 = !He(d2.memoizedState, e2);
    f2 && (d2.memoizedState = e2, dh = true);
    d2 = d2.queue;
    $h(ai.bind(null, c2, d2, a), [a]);
    if (d2.getSnapshot !== b2 || f2 || null !== O && O.memoizedState.tag & 1) {
      c2.flags |= 2048;
      bi(9, ci.bind(null, c2, d2, e2, b2), void 0, null);
      if (null === Q) throw Error(p$3(349));
      0 !== (Hh & 30) || di(c2, b2, e2);
    }
    return e2;
  }
  function di(a, b2, c2) {
    a.flags |= 16384;
    a = { getSnapshot: b2, value: c2 };
    b2 = M.updateQueue;
    null === b2 ? (b2 = { lastEffect: null, stores: null }, M.updateQueue = b2, b2.stores = [a]) : (c2 = b2.stores, null === c2 ? b2.stores = [a] : c2.push(a));
  }
  function ci(a, b2, c2, d2) {
    b2.value = c2;
    b2.getSnapshot = d2;
    ei(b2) && fi(a);
  }
  function ai(a, b2, c2) {
    return c2(function() {
      ei(b2) && fi(a);
    });
  }
  function ei(a) {
    var b2 = a.getSnapshot;
    a = a.value;
    try {
      var c2 = b2();
      return !He(a, c2);
    } catch (d2) {
      return true;
    }
  }
  function fi(a) {
    var b2 = ih(a, 1);
    null !== b2 && gi(b2, a, 1, -1);
  }
  function hi(a) {
    var b2 = Th();
    "function" === typeof a && (a = a());
    b2.memoizedState = b2.baseState = a;
    a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
    b2.queue = a;
    a = a.dispatch = ii.bind(null, M, a);
    return [b2.memoizedState, a];
  }
  function bi(a, b2, c2, d2) {
    a = { tag: a, create: b2, destroy: c2, deps: d2, next: null };
    b2 = M.updateQueue;
    null === b2 ? (b2 = { lastEffect: null, stores: null }, M.updateQueue = b2, b2.lastEffect = a.next = a) : (c2 = b2.lastEffect, null === c2 ? b2.lastEffect = a.next = a : (d2 = c2.next, c2.next = a, a.next = d2, b2.lastEffect = a));
    return a;
  }
  function ji() {
    return Uh().memoizedState;
  }
  function ki(a, b2, c2, d2) {
    var e2 = Th();
    M.flags |= a;
    e2.memoizedState = bi(1 | b2, c2, void 0, void 0 === d2 ? null : d2);
  }
  function li(a, b2, c2, d2) {
    var e2 = Uh();
    d2 = void 0 === d2 ? null : d2;
    var f2 = void 0;
    if (null !== N) {
      var g2 = N.memoizedState;
      f2 = g2.destroy;
      if (null !== d2 && Mh(d2, g2.deps)) {
        e2.memoizedState = bi(b2, c2, f2, d2);
        return;
      }
    }
    M.flags |= a;
    e2.memoizedState = bi(1 | b2, c2, f2, d2);
  }
  function mi(a, b2) {
    return ki(8390656, 8, a, b2);
  }
  function $h(a, b2) {
    return li(2048, 8, a, b2);
  }
  function ni(a, b2) {
    return li(4, 2, a, b2);
  }
  function oi(a, b2) {
    return li(4, 4, a, b2);
  }
  function pi(a, b2) {
    if ("function" === typeof b2) return a = a(), b2(a), function() {
      b2(null);
    };
    if (null !== b2 && void 0 !== b2) return a = a(), b2.current = a, function() {
      b2.current = null;
    };
  }
  function qi(a, b2, c2) {
    c2 = null !== c2 && void 0 !== c2 ? c2.concat([a]) : null;
    return li(4, 4, pi.bind(null, b2, a), c2);
  }
  function ri() {
  }
  function si(a, b2) {
    var c2 = Uh();
    b2 = void 0 === b2 ? null : b2;
    var d2 = c2.memoizedState;
    if (null !== d2 && null !== b2 && Mh(b2, d2[1])) return d2[0];
    c2.memoizedState = [a, b2];
    return a;
  }
  function ti(a, b2) {
    var c2 = Uh();
    b2 = void 0 === b2 ? null : b2;
    var d2 = c2.memoizedState;
    if (null !== d2 && null !== b2 && Mh(b2, d2[1])) return d2[0];
    a = a();
    c2.memoizedState = [a, b2];
    return a;
  }
  function ui(a, b2, c2) {
    if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c2;
    He(c2, b2) || (c2 = yc(), M.lanes |= c2, rh |= c2, a.baseState = true);
    return b2;
  }
  function vi(a, b2) {
    var c2 = C;
    C = 0 !== c2 && 4 > c2 ? c2 : 4;
    a(true);
    var d2 = Gh.transition;
    Gh.transition = {};
    try {
      a(false), b2();
    } finally {
      C = c2, Gh.transition = d2;
    }
  }
  function wi() {
    return Uh().memoizedState;
  }
  function xi(a, b2, c2) {
    var d2 = yi(a);
    c2 = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
    if (zi(a)) Ai(b2, c2);
    else if (c2 = hh(a, b2, c2, d2), null !== c2) {
      var e2 = R();
      gi(c2, a, d2, e2);
      Bi(c2, b2, d2);
    }
  }
  function ii(a, b2, c2) {
    var d2 = yi(a), e2 = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
    if (zi(a)) Ai(b2, e2);
    else {
      var f2 = a.alternate;
      if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b2.lastRenderedReducer, null !== f2)) try {
        var g2 = b2.lastRenderedState, h2 = f2(g2, c2);
        e2.hasEagerState = true;
        e2.eagerState = h2;
        if (He(h2, g2)) {
          var k2 = b2.interleaved;
          null === k2 ? (e2.next = e2, gh(b2)) : (e2.next = k2.next, k2.next = e2);
          b2.interleaved = e2;
          return;
        }
      } catch (l2) {
      } finally {
      }
      c2 = hh(a, b2, e2, d2);
      null !== c2 && (e2 = R(), gi(c2, a, d2, e2), Bi(c2, b2, d2));
    }
  }
  function zi(a) {
    var b2 = a.alternate;
    return a === M || null !== b2 && b2 === M;
  }
  function Ai(a, b2) {
    Jh = Ih = true;
    var c2 = a.pending;
    null === c2 ? b2.next = b2 : (b2.next = c2.next, c2.next = b2);
    a.pending = b2;
  }
  function Bi(a, b2, c2) {
    if (0 !== (c2 & 4194240)) {
      var d2 = b2.lanes;
      d2 &= a.pendingLanes;
      c2 |= d2;
      b2.lanes = c2;
      Cc(a, c2);
    }
  }
  var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b2) {
    Th().memoizedState = [a, void 0 === b2 ? null : b2];
    return a;
  }, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b2, c2) {
    c2 = null !== c2 && void 0 !== c2 ? c2.concat([a]) : null;
    return ki(
      4194308,
      4,
      pi.bind(null, b2, a),
      c2
    );
  }, useLayoutEffect: function(a, b2) {
    return ki(4194308, 4, a, b2);
  }, useInsertionEffect: function(a, b2) {
    return ki(4, 2, a, b2);
  }, useMemo: function(a, b2) {
    var c2 = Th();
    b2 = void 0 === b2 ? null : b2;
    a = a();
    c2.memoizedState = [a, b2];
    return a;
  }, useReducer: function(a, b2, c2) {
    var d2 = Th();
    b2 = void 0 !== c2 ? c2(b2) : b2;
    d2.memoizedState = d2.baseState = b2;
    a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b2 };
    d2.queue = a;
    a = a.dispatch = xi.bind(null, M, a);
    return [d2.memoizedState, a];
  }, useRef: function(a) {
    var b2 = Th();
    a = { current: a };
    return b2.memoizedState = a;
  }, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
    return Th().memoizedState = a;
  }, useTransition: function() {
    var a = hi(false), b2 = a[0];
    a = vi.bind(null, a[1]);
    Th().memoizedState = a;
    return [b2, a];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(a, b2, c2) {
    var d2 = M, e2 = Th();
    if (I) {
      if (void 0 === c2) throw Error(p$3(407));
      c2 = c2();
    } else {
      c2 = b2();
      if (null === Q) throw Error(p$3(349));
      0 !== (Hh & 30) || di(d2, b2, c2);
    }
    e2.memoizedState = c2;
    var f2 = { value: c2, getSnapshot: b2 };
    e2.queue = f2;
    mi(ai.bind(
      null,
      d2,
      f2,
      a
    ), [a]);
    d2.flags |= 2048;
    bi(9, ci.bind(null, d2, f2, c2, b2), void 0, null);
    return c2;
  }, useId: function() {
    var a = Th(), b2 = Q.identifierPrefix;
    if (I) {
      var c2 = sg;
      var d2 = rg;
      c2 = (d2 & ~(1 << 32 - oc(d2) - 1)).toString(32) + c2;
      b2 = ":" + b2 + "R" + c2;
      c2 = Kh++;
      0 < c2 && (b2 += "H" + c2.toString(32));
      b2 += ":";
    } else c2 = Lh++, b2 = ":" + b2 + "r" + c2.toString(32) + ":";
    return a.memoizedState = b2;
  }, unstable_isNewReconciler: false }, Ph = {
    readContext: eh,
    useCallback: si,
    useContext: eh,
    useEffect: $h,
    useImperativeHandle: qi,
    useInsertionEffect: ni,
    useLayoutEffect: oi,
    useMemo: ti,
    useReducer: Wh,
    useRef: ji,
    useState: function() {
      return Wh(Vh);
    },
    useDebugValue: ri,
    useDeferredValue: function(a) {
      var b2 = Uh();
      return ui(b2, N.memoizedState, a);
    },
    useTransition: function() {
      var a = Wh(Vh)[0], b2 = Uh().memoizedState;
      return [a, b2];
    },
    useMutableSource: Yh,
    useSyncExternalStore: Zh,
    useId: wi,
    unstable_isNewReconciler: false
  }, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
    return Xh(Vh);
  }, useDebugValue: ri, useDeferredValue: function(a) {
    var b2 = Uh();
    return null === N ? b2.memoizedState = a : ui(b2, N.memoizedState, a);
  }, useTransition: function() {
    var a = Xh(Vh)[0], b2 = Uh().memoizedState;
    return [a, b2];
  }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
  function Ci(a, b2) {
    if (a && a.defaultProps) {
      b2 = A$1({}, b2);
      a = a.defaultProps;
      for (var c2 in a) void 0 === b2[c2] && (b2[c2] = a[c2]);
      return b2;
    }
    return b2;
  }
  function Di(a, b2, c2, d2) {
    b2 = a.memoizedState;
    c2 = c2(d2, b2);
    c2 = null === c2 || void 0 === c2 ? b2 : A$1({}, b2, c2);
    a.memoizedState = c2;
    0 === a.lanes && (a.updateQueue.baseState = c2);
  }
  var Ei = { isMounted: function(a) {
    return (a = a._reactInternals) ? Vb(a) === a : false;
  }, enqueueSetState: function(a, b2, c2) {
    a = a._reactInternals;
    var d2 = R(), e2 = yi(a), f2 = mh(d2, e2);
    f2.payload = b2;
    void 0 !== c2 && null !== c2 && (f2.callback = c2);
    b2 = nh(a, f2, e2);
    null !== b2 && (gi(b2, a, e2, d2), oh(b2, a, e2));
  }, enqueueReplaceState: function(a, b2, c2) {
    a = a._reactInternals;
    var d2 = R(), e2 = yi(a), f2 = mh(d2, e2);
    f2.tag = 1;
    f2.payload = b2;
    void 0 !== c2 && null !== c2 && (f2.callback = c2);
    b2 = nh(a, f2, e2);
    null !== b2 && (gi(b2, a, e2, d2), oh(b2, a, e2));
  }, enqueueForceUpdate: function(a, b2) {
    a = a._reactInternals;
    var c2 = R(), d2 = yi(a), e2 = mh(c2, d2);
    e2.tag = 2;
    void 0 !== b2 && null !== b2 && (e2.callback = b2);
    b2 = nh(a, e2, d2);
    null !== b2 && (gi(b2, a, d2, c2), oh(b2, a, d2));
  } };
  function Fi(a, b2, c2, d2, e2, f2, g2) {
    a = a.stateNode;
    return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d2, f2, g2) : b2.prototype && b2.prototype.isPureReactComponent ? !Ie(c2, d2) || !Ie(e2, f2) : true;
  }
  function Gi(a, b2, c2) {
    var d2 = false, e2 = Vf;
    var f2 = b2.contextType;
    "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e2 = Zf(b2) ? Xf : H.current, d2 = b2.contextTypes, f2 = (d2 = null !== d2 && void 0 !== d2) ? Yf(a, e2) : Vf);
    b2 = new b2(c2, f2);
    a.memoizedState = null !== b2.state && void 0 !== b2.state ? b2.state : null;
    b2.updater = Ei;
    a.stateNode = b2;
    b2._reactInternals = a;
    d2 && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e2, a.__reactInternalMemoizedMaskedChildContext = f2);
    return b2;
  }
  function Hi(a, b2, c2, d2) {
    a = b2.state;
    "function" === typeof b2.componentWillReceiveProps && b2.componentWillReceiveProps(c2, d2);
    "function" === typeof b2.UNSAFE_componentWillReceiveProps && b2.UNSAFE_componentWillReceiveProps(c2, d2);
    b2.state !== a && Ei.enqueueReplaceState(b2, b2.state, null);
  }
  function Ii(a, b2, c2, d2) {
    var e2 = a.stateNode;
    e2.props = c2;
    e2.state = a.memoizedState;
    e2.refs = {};
    kh(a);
    var f2 = b2.contextType;
    "object" === typeof f2 && null !== f2 ? e2.context = eh(f2) : (f2 = Zf(b2) ? Xf : H.current, e2.context = Yf(a, f2));
    e2.state = a.memoizedState;
    f2 = b2.getDerivedStateFromProps;
    "function" === typeof f2 && (Di(a, b2, f2, c2), e2.state = a.memoizedState);
    "function" === typeof b2.getDerivedStateFromProps || "function" === typeof e2.getSnapshotBeforeUpdate || "function" !== typeof e2.UNSAFE_componentWillMount && "function" !== typeof e2.componentWillMount || (b2 = e2.state, "function" === typeof e2.componentWillMount && e2.componentWillMount(), "function" === typeof e2.UNSAFE_componentWillMount && e2.UNSAFE_componentWillMount(), b2 !== e2.state && Ei.enqueueReplaceState(e2, e2.state, null), qh(a, c2, e2, d2), e2.state = a.memoizedState);
    "function" === typeof e2.componentDidMount && (a.flags |= 4194308);
  }
  function Ji(a, b2) {
    try {
      var c2 = "", d2 = b2;
      do
        c2 += Pa(d2), d2 = d2.return;
      while (d2);
      var e2 = c2;
    } catch (f2) {
      e2 = "\nError generating stack: " + f2.message + "\n" + f2.stack;
    }
    return { value: a, source: b2, stack: e2, digest: null };
  }
  function Ki(a, b2, c2) {
    return { value: a, source: null, stack: null != c2 ? c2 : null, digest: null != b2 ? b2 : null };
  }
  function Li(a, b2) {
    try {
      console.error(b2.value);
    } catch (c2) {
      setTimeout(function() {
        throw c2;
      });
    }
  }
  var Mi = "function" === typeof WeakMap ? WeakMap : Map;
  function Ni(a, b2, c2) {
    c2 = mh(-1, c2);
    c2.tag = 3;
    c2.payload = { element: null };
    var d2 = b2.value;
    c2.callback = function() {
      Oi || (Oi = true, Pi = d2);
      Li(a, b2);
    };
    return c2;
  }
  function Qi(a, b2, c2) {
    c2 = mh(-1, c2);
    c2.tag = 3;
    var d2 = a.type.getDerivedStateFromError;
    if ("function" === typeof d2) {
      var e2 = b2.value;
      c2.payload = function() {
        return d2(e2);
      };
      c2.callback = function() {
        Li(a, b2);
      };
    }
    var f2 = a.stateNode;
    null !== f2 && "function" === typeof f2.componentDidCatch && (c2.callback = function() {
      Li(a, b2);
      "function" !== typeof d2 && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
      var c3 = b2.stack;
      this.componentDidCatch(b2.value, { componentStack: null !== c3 ? c3 : "" });
    });
    return c2;
  }
  function Si(a, b2, c2) {
    var d2 = a.pingCache;
    if (null === d2) {
      d2 = a.pingCache = new Mi();
      var e2 = /* @__PURE__ */ new Set();
      d2.set(b2, e2);
    } else e2 = d2.get(b2), void 0 === e2 && (e2 = /* @__PURE__ */ new Set(), d2.set(b2, e2));
    e2.has(c2) || (e2.add(c2), a = Ti.bind(null, a, b2, c2), b2.then(a, a));
  }
  function Ui(a) {
    do {
      var b2;
      if (b2 = 13 === a.tag) b2 = a.memoizedState, b2 = null !== b2 ? null !== b2.dehydrated ? true : false : true;
      if (b2) return a;
      a = a.return;
    } while (null !== a);
    return null;
  }
  function Vi(a, b2, c2, d2, e2) {
    if (0 === (a.mode & 1)) return a === b2 ? a.flags |= 65536 : (a.flags |= 128, c2.flags |= 131072, c2.flags &= -52805, 1 === c2.tag && (null === c2.alternate ? c2.tag = 17 : (b2 = mh(-1, 1), b2.tag = 2, nh(c2, b2, 1))), c2.lanes |= 1), a;
    a.flags |= 65536;
    a.lanes = e2;
    return a;
  }
  var Wi = ua.ReactCurrentOwner, dh = false;
  function Xi(a, b2, c2, d2) {
    b2.child = null === a ? Vg(b2, null, c2, d2) : Ug(b2, a.child, c2, d2);
  }
  function Yi(a, b2, c2, d2, e2) {
    c2 = c2.render;
    var f2 = b2.ref;
    ch(b2, e2);
    d2 = Nh(a, b2, c2, d2, f2, e2);
    c2 = Sh();
    if (null !== a && !dh) return b2.updateQueue = a.updateQueue, b2.flags &= -2053, a.lanes &= ~e2, Zi(a, b2, e2);
    I && c2 && vg(b2);
    b2.flags |= 1;
    Xi(a, b2, d2, e2);
    return b2.child;
  }
  function $i(a, b2, c2, d2, e2) {
    if (null === a) {
      var f2 = c2.type;
      if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c2.compare && void 0 === c2.defaultProps) return b2.tag = 15, b2.type = f2, bj(a, b2, f2, d2, e2);
      a = Rg(c2.type, null, d2, b2, b2.mode, e2);
      a.ref = b2.ref;
      a.return = b2;
      return b2.child = a;
    }
    f2 = a.child;
    if (0 === (a.lanes & e2)) {
      var g2 = f2.memoizedProps;
      c2 = c2.compare;
      c2 = null !== c2 ? c2 : Ie;
      if (c2(g2, d2) && a.ref === b2.ref) return Zi(a, b2, e2);
    }
    b2.flags |= 1;
    a = Pg(f2, d2);
    a.ref = b2.ref;
    a.return = b2;
    return b2.child = a;
  }
  function bj(a, b2, c2, d2, e2) {
    if (null !== a) {
      var f2 = a.memoizedProps;
      if (Ie(f2, d2) && a.ref === b2.ref) if (dh = false, b2.pendingProps = d2 = f2, 0 !== (a.lanes & e2)) 0 !== (a.flags & 131072) && (dh = true);
      else return b2.lanes = a.lanes, Zi(a, b2, e2);
    }
    return cj(a, b2, c2, d2, e2);
  }
  function dj(a, b2, c2) {
    var d2 = b2.pendingProps, e2 = d2.children, f2 = null !== a ? a.memoizedState : null;
    if ("hidden" === d2.mode) if (0 === (b2.mode & 1)) b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c2;
    else {
      if (0 === (c2 & 1073741824)) return a = null !== f2 ? f2.baseLanes | c2 : c2, b2.lanes = b2.childLanes = 1073741824, b2.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b2.updateQueue = null, G(ej, fj), fj |= a, null;
      b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
      d2 = null !== f2 ? f2.baseLanes : c2;
      G(ej, fj);
      fj |= d2;
    }
    else null !== f2 ? (d2 = f2.baseLanes | c2, b2.memoizedState = null) : d2 = c2, G(ej, fj), fj |= d2;
    Xi(a, b2, e2, c2);
    return b2.child;
  }
  function gj(a, b2) {
    var c2 = b2.ref;
    if (null === a && null !== c2 || null !== a && a.ref !== c2) b2.flags |= 512, b2.flags |= 2097152;
  }
  function cj(a, b2, c2, d2, e2) {
    var f2 = Zf(c2) ? Xf : H.current;
    f2 = Yf(b2, f2);
    ch(b2, e2);
    c2 = Nh(a, b2, c2, d2, f2, e2);
    d2 = Sh();
    if (null !== a && !dh) return b2.updateQueue = a.updateQueue, b2.flags &= -2053, a.lanes &= ~e2, Zi(a, b2, e2);
    I && d2 && vg(b2);
    b2.flags |= 1;
    Xi(a, b2, c2, e2);
    return b2.child;
  }
  function hj(a, b2, c2, d2, e2) {
    if (Zf(c2)) {
      var f2 = true;
      cg(b2);
    } else f2 = false;
    ch(b2, e2);
    if (null === b2.stateNode) ij(a, b2), Gi(b2, c2, d2), Ii(b2, c2, d2, e2), d2 = true;
    else if (null === a) {
      var g2 = b2.stateNode, h2 = b2.memoizedProps;
      g2.props = h2;
      var k2 = g2.context, l2 = c2.contextType;
      "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c2) ? Xf : H.current, l2 = Yf(b2, l2));
      var m2 = c2.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g2.getSnapshotBeforeUpdate;
      q2 || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== d2 || k2 !== l2) && Hi(b2, g2, d2, l2);
      jh = false;
      var r2 = b2.memoizedState;
      g2.state = r2;
      qh(b2, d2, g2, e2);
      k2 = b2.memoizedState;
      h2 !== d2 || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b2, c2, m2, d2), k2 = b2.memoizedState), (h2 = jh || Fi(b2, c2, h2, d2, r2, k2, l2)) ? (q2 || "function" !== typeof g2.UNSAFE_componentWillMount && "function" !== typeof g2.componentWillMount || ("function" === typeof g2.componentWillMount && g2.componentWillMount(), "function" === typeof g2.UNSAFE_componentWillMount && g2.UNSAFE_componentWillMount()), "function" === typeof g2.componentDidMount && (b2.flags |= 4194308)) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), b2.memoizedProps = d2, b2.memoizedState = k2), g2.props = d2, g2.state = k2, g2.context = l2, d2 = h2) : ("function" === typeof g2.componentDidMount && (b2.flags |= 4194308), d2 = false);
    } else {
      g2 = b2.stateNode;
      lh(a, b2);
      h2 = b2.memoizedProps;
      l2 = b2.type === b2.elementType ? h2 : Ci(b2.type, h2);
      g2.props = l2;
      q2 = b2.pendingProps;
      r2 = g2.context;
      k2 = c2.contextType;
      "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c2) ? Xf : H.current, k2 = Yf(b2, k2));
      var y2 = c2.getDerivedStateFromProps;
      (m2 = "function" === typeof y2 || "function" === typeof g2.getSnapshotBeforeUpdate) || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== q2 || r2 !== k2) && Hi(b2, g2, d2, k2);
      jh = false;
      r2 = b2.memoizedState;
      g2.state = r2;
      qh(b2, d2, g2, e2);
      var n2 = b2.memoizedState;
      h2 !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b2, c2, y2, d2), n2 = b2.memoizedState), (l2 = jh || Fi(b2, c2, l2, d2, r2, n2, k2) || false) ? (m2 || "function" !== typeof g2.UNSAFE_componentWillUpdate && "function" !== typeof g2.componentWillUpdate || ("function" === typeof g2.componentWillUpdate && g2.componentWillUpdate(d2, n2, k2), "function" === typeof g2.UNSAFE_componentWillUpdate && g2.UNSAFE_componentWillUpdate(d2, n2, k2)), "function" === typeof g2.componentDidUpdate && (b2.flags |= 4), "function" === typeof g2.getSnapshotBeforeUpdate && (b2.flags |= 1024)) : ("function" !== typeof g2.componentDidUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b2.flags |= 1024), b2.memoizedProps = d2, b2.memoizedState = n2), g2.props = d2, g2.state = n2, g2.context = k2, d2 = l2) : ("function" !== typeof g2.componentDidUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b2.flags |= 1024), d2 = false);
    }
    return jj(a, b2, c2, d2, f2, e2);
  }
  function jj(a, b2, c2, d2, e2, f2) {
    gj(a, b2);
    var g2 = 0 !== (b2.flags & 128);
    if (!d2 && !g2) return e2 && dg(b2, c2, false), Zi(a, b2, f2);
    d2 = b2.stateNode;
    Wi.current = b2;
    var h2 = g2 && "function" !== typeof c2.getDerivedStateFromError ? null : d2.render();
    b2.flags |= 1;
    null !== a && g2 ? (b2.child = Ug(b2, a.child, null, f2), b2.child = Ug(b2, null, h2, f2)) : Xi(a, b2, h2, f2);
    b2.memoizedState = d2.state;
    e2 && dg(b2, c2, true);
    return b2.child;
  }
  function kj(a) {
    var b2 = a.stateNode;
    b2.pendingContext ? ag(a, b2.pendingContext, b2.pendingContext !== b2.context) : b2.context && ag(a, b2.context, false);
    yh(a, b2.containerInfo);
  }
  function lj(a, b2, c2, d2, e2) {
    Ig();
    Jg(e2);
    b2.flags |= 256;
    Xi(a, b2, c2, d2);
    return b2.child;
  }
  var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
  function nj(a) {
    return { baseLanes: a, cachePool: null, transitions: null };
  }
  function oj(a, b2, c2) {
    var d2 = b2.pendingProps, e2 = L.current, f2 = false, g2 = 0 !== (b2.flags & 128), h2;
    (h2 = g2) || (h2 = null !== a && null === a.memoizedState ? false : 0 !== (e2 & 2));
    if (h2) f2 = true, b2.flags &= -129;
    else if (null === a || null !== a.memoizedState) e2 |= 1;
    G(L, e2 & 1);
    if (null === a) {
      Eg(b2);
      a = b2.memoizedState;
      if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b2.mode & 1) ? b2.lanes = 1 : "$!" === a.data ? b2.lanes = 8 : b2.lanes = 1073741824, null;
      g2 = d2.children;
      a = d2.fallback;
      return f2 ? (d2 = b2.mode, f2 = b2.child, g2 = { mode: "hidden", children: g2 }, 0 === (d2 & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g2) : f2 = pj(g2, d2, 0, null), a = Tg(a, d2, c2, null), f2.return = b2, a.return = b2, f2.sibling = a, b2.child = f2, b2.child.memoizedState = nj(c2), b2.memoizedState = mj, a) : qj(b2, g2);
    }
    e2 = a.memoizedState;
    if (null !== e2 && (h2 = e2.dehydrated, null !== h2)) return rj(a, b2, g2, d2, h2, e2, c2);
    if (f2) {
      f2 = d2.fallback;
      g2 = b2.mode;
      e2 = a.child;
      h2 = e2.sibling;
      var k2 = { mode: "hidden", children: d2.children };
      0 === (g2 & 1) && b2.child !== e2 ? (d2 = b2.child, d2.childLanes = 0, d2.pendingProps = k2, b2.deletions = null) : (d2 = Pg(e2, k2), d2.subtreeFlags = e2.subtreeFlags & 14680064);
      null !== h2 ? f2 = Pg(h2, f2) : (f2 = Tg(f2, g2, c2, null), f2.flags |= 2);
      f2.return = b2;
      d2.return = b2;
      d2.sibling = f2;
      b2.child = d2;
      d2 = f2;
      f2 = b2.child;
      g2 = a.child.memoizedState;
      g2 = null === g2 ? nj(c2) : { baseLanes: g2.baseLanes | c2, cachePool: null, transitions: g2.transitions };
      f2.memoizedState = g2;
      f2.childLanes = a.childLanes & ~c2;
      b2.memoizedState = mj;
      return d2;
    }
    f2 = a.child;
    a = f2.sibling;
    d2 = Pg(f2, { mode: "visible", children: d2.children });
    0 === (b2.mode & 1) && (d2.lanes = c2);
    d2.return = b2;
    d2.sibling = null;
    null !== a && (c2 = b2.deletions, null === c2 ? (b2.deletions = [a], b2.flags |= 16) : c2.push(a));
    b2.child = d2;
    b2.memoizedState = null;
    return d2;
  }
  function qj(a, b2) {
    b2 = pj({ mode: "visible", children: b2 }, a.mode, 0, null);
    b2.return = a;
    return a.child = b2;
  }
  function sj(a, b2, c2, d2) {
    null !== d2 && Jg(d2);
    Ug(b2, a.child, null, c2);
    a = qj(b2, b2.pendingProps.children);
    a.flags |= 2;
    b2.memoizedState = null;
    return a;
  }
  function rj(a, b2, c2, d2, e2, f2, g2) {
    if (c2) {
      if (b2.flags & 256) return b2.flags &= -257, d2 = Ki(Error(p$3(422))), sj(a, b2, g2, d2);
      if (null !== b2.memoizedState) return b2.child = a.child, b2.flags |= 128, null;
      f2 = d2.fallback;
      e2 = b2.mode;
      d2 = pj({ mode: "visible", children: d2.children }, e2, 0, null);
      f2 = Tg(f2, e2, g2, null);
      f2.flags |= 2;
      d2.return = b2;
      f2.return = b2;
      d2.sibling = f2;
      b2.child = d2;
      0 !== (b2.mode & 1) && Ug(b2, a.child, null, g2);
      b2.child.memoizedState = nj(g2);
      b2.memoizedState = mj;
      return f2;
    }
    if (0 === (b2.mode & 1)) return sj(a, b2, g2, null);
    if ("$!" === e2.data) {
      d2 = e2.nextSibling && e2.nextSibling.dataset;
      if (d2) var h2 = d2.dgst;
      d2 = h2;
      f2 = Error(p$3(419));
      d2 = Ki(f2, d2, void 0);
      return sj(a, b2, g2, d2);
    }
    h2 = 0 !== (g2 & a.childLanes);
    if (dh || h2) {
      d2 = Q;
      if (null !== d2) {
        switch (g2 & -g2) {
          case 4:
            e2 = 2;
            break;
          case 16:
            e2 = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            e2 = 32;
            break;
          case 536870912:
            e2 = 268435456;
            break;
          default:
            e2 = 0;
        }
        e2 = 0 !== (e2 & (d2.suspendedLanes | g2)) ? 0 : e2;
        0 !== e2 && e2 !== f2.retryLane && (f2.retryLane = e2, ih(a, e2), gi(d2, a, e2, -1));
      }
      tj();
      d2 = Ki(Error(p$3(421)));
      return sj(a, b2, g2, d2);
    }
    if ("$?" === e2.data) return b2.flags |= 128, b2.child = a.child, b2 = uj.bind(null, a), e2._reactRetry = b2, null;
    a = f2.treeContext;
    yg = Lf(e2.nextSibling);
    xg = b2;
    I = true;
    zg = null;
    null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b2);
    b2 = qj(b2, d2.children);
    b2.flags |= 4096;
    return b2;
  }
  function vj(a, b2, c2) {
    a.lanes |= b2;
    var d2 = a.alternate;
    null !== d2 && (d2.lanes |= b2);
    bh(a.return, b2, c2);
  }
  function wj(a, b2, c2, d2, e2) {
    var f2 = a.memoizedState;
    null === f2 ? a.memoizedState = { isBackwards: b2, rendering: null, renderingStartTime: 0, last: d2, tail: c2, tailMode: e2 } : (f2.isBackwards = b2, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d2, f2.tail = c2, f2.tailMode = e2);
  }
  function xj(a, b2, c2) {
    var d2 = b2.pendingProps, e2 = d2.revealOrder, f2 = d2.tail;
    Xi(a, b2, d2.children, c2);
    d2 = L.current;
    if (0 !== (d2 & 2)) d2 = d2 & 1 | 2, b2.flags |= 128;
    else {
      if (null !== a && 0 !== (a.flags & 128)) a: for (a = b2.child; null !== a; ) {
        if (13 === a.tag) null !== a.memoizedState && vj(a, c2, b2);
        else if (19 === a.tag) vj(a, c2, b2);
        else if (null !== a.child) {
          a.child.return = a;
          a = a.child;
          continue;
        }
        if (a === b2) break a;
        for (; null === a.sibling; ) {
          if (null === a.return || a.return === b2) break a;
          a = a.return;
        }
        a.sibling.return = a.return;
        a = a.sibling;
      }
      d2 &= 1;
    }
    G(L, d2);
    if (0 === (b2.mode & 1)) b2.memoizedState = null;
    else switch (e2) {
      case "forwards":
        c2 = b2.child;
        for (e2 = null; null !== c2; ) a = c2.alternate, null !== a && null === Ch(a) && (e2 = c2), c2 = c2.sibling;
        c2 = e2;
        null === c2 ? (e2 = b2.child, b2.child = null) : (e2 = c2.sibling, c2.sibling = null);
        wj(b2, false, e2, c2, f2);
        break;
      case "backwards":
        c2 = null;
        e2 = b2.child;
        for (b2.child = null; null !== e2; ) {
          a = e2.alternate;
          if (null !== a && null === Ch(a)) {
            b2.child = e2;
            break;
          }
          a = e2.sibling;
          e2.sibling = c2;
          c2 = e2;
          e2 = a;
        }
        wj(b2, true, c2, null, f2);
        break;
      case "together":
        wj(b2, false, null, null, void 0);
        break;
      default:
        b2.memoizedState = null;
    }
    return b2.child;
  }
  function ij(a, b2) {
    0 === (b2.mode & 1) && null !== a && (a.alternate = null, b2.alternate = null, b2.flags |= 2);
  }
  function Zi(a, b2, c2) {
    null !== a && (b2.dependencies = a.dependencies);
    rh |= b2.lanes;
    if (0 === (c2 & b2.childLanes)) return null;
    if (null !== a && b2.child !== a.child) throw Error(p$3(153));
    if (null !== b2.child) {
      a = b2.child;
      c2 = Pg(a, a.pendingProps);
      b2.child = c2;
      for (c2.return = b2; null !== a.sibling; ) a = a.sibling, c2 = c2.sibling = Pg(a, a.pendingProps), c2.return = b2;
      c2.sibling = null;
    }
    return b2.child;
  }
  function yj(a, b2, c2) {
    switch (b2.tag) {
      case 3:
        kj(b2);
        Ig();
        break;
      case 5:
        Ah(b2);
        break;
      case 1:
        Zf(b2.type) && cg(b2);
        break;
      case 4:
        yh(b2, b2.stateNode.containerInfo);
        break;
      case 10:
        var d2 = b2.type._context, e2 = b2.memoizedProps.value;
        G(Wg, d2._currentValue);
        d2._currentValue = e2;
        break;
      case 13:
        d2 = b2.memoizedState;
        if (null !== d2) {
          if (null !== d2.dehydrated) return G(L, L.current & 1), b2.flags |= 128, null;
          if (0 !== (c2 & b2.child.childLanes)) return oj(a, b2, c2);
          G(L, L.current & 1);
          a = Zi(a, b2, c2);
          return null !== a ? a.sibling : null;
        }
        G(L, L.current & 1);
        break;
      case 19:
        d2 = 0 !== (c2 & b2.childLanes);
        if (0 !== (a.flags & 128)) {
          if (d2) return xj(a, b2, c2);
          b2.flags |= 128;
        }
        e2 = b2.memoizedState;
        null !== e2 && (e2.rendering = null, e2.tail = null, e2.lastEffect = null);
        G(L, L.current);
        if (d2) break;
        else return null;
      case 22:
      case 23:
        return b2.lanes = 0, dj(a, b2, c2);
    }
    return Zi(a, b2, c2);
  }
  var zj, Aj, Bj, Cj;
  zj = function(a, b2) {
    for (var c2 = b2.child; null !== c2; ) {
      if (5 === c2.tag || 6 === c2.tag) a.appendChild(c2.stateNode);
      else if (4 !== c2.tag && null !== c2.child) {
        c2.child.return = c2;
        c2 = c2.child;
        continue;
      }
      if (c2 === b2) break;
      for (; null === c2.sibling; ) {
        if (null === c2.return || c2.return === b2) return;
        c2 = c2.return;
      }
      c2.sibling.return = c2.return;
      c2 = c2.sibling;
    }
  };
  Aj = function() {
  };
  Bj = function(a, b2, c2, d2) {
    var e2 = a.memoizedProps;
    if (e2 !== d2) {
      a = b2.stateNode;
      xh(uh.current);
      var f2 = null;
      switch (c2) {
        case "input":
          e2 = Ya(a, e2);
          d2 = Ya(a, d2);
          f2 = [];
          break;
        case "select":
          e2 = A$1({}, e2, { value: void 0 });
          d2 = A$1({}, d2, { value: void 0 });
          f2 = [];
          break;
        case "textarea":
          e2 = gb(a, e2);
          d2 = gb(a, d2);
          f2 = [];
          break;
        default:
          "function" !== typeof e2.onClick && "function" === typeof d2.onClick && (a.onclick = Bf);
      }
      ub(c2, d2);
      var g2;
      c2 = null;
      for (l2 in e2) if (!d2.hasOwnProperty(l2) && e2.hasOwnProperty(l2) && null != e2[l2]) if ("style" === l2) {
        var h2 = e2[l2];
        for (g2 in h2) h2.hasOwnProperty(g2) && (c2 || (c2 = {}), c2[g2] = "");
      } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
      for (l2 in d2) {
        var k2 = d2[l2];
        h2 = null != e2 ? e2[l2] : void 0;
        if (d2.hasOwnProperty(l2) && k2 !== h2 && (null != k2 || null != h2)) if ("style" === l2) if (h2) {
          for (g2 in h2) !h2.hasOwnProperty(g2) || k2 && k2.hasOwnProperty(g2) || (c2 || (c2 = {}), c2[g2] = "");
          for (g2 in k2) k2.hasOwnProperty(g2) && h2[g2] !== k2[g2] && (c2 || (c2 = {}), c2[g2] = k2[g2]);
        } else c2 || (f2 || (f2 = []), f2.push(
          l2,
          c2
        )), c2 = k2;
        else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h2 = h2 ? h2.__html : void 0, null != k2 && h2 !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h2 === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
      }
      c2 && (f2 = f2 || []).push("style", c2);
      var l2 = f2;
      if (b2.updateQueue = l2) b2.flags |= 4;
    }
  };
  Cj = function(a, b2, c2, d2) {
    c2 !== d2 && (b2.flags |= 4);
  };
  function Dj(a, b2) {
    if (!I) switch (a.tailMode) {
      case "hidden":
        b2 = a.tail;
        for (var c2 = null; null !== b2; ) null !== b2.alternate && (c2 = b2), b2 = b2.sibling;
        null === c2 ? a.tail = null : c2.sibling = null;
        break;
      case "collapsed":
        c2 = a.tail;
        for (var d2 = null; null !== c2; ) null !== c2.alternate && (d2 = c2), c2 = c2.sibling;
        null === d2 ? b2 || null === a.tail ? a.tail = null : a.tail.sibling = null : d2.sibling = null;
    }
  }
  function S(a) {
    var b2 = null !== a.alternate && a.alternate.child === a.child, c2 = 0, d2 = 0;
    if (b2) for (var e2 = a.child; null !== e2; ) c2 |= e2.lanes | e2.childLanes, d2 |= e2.subtreeFlags & 14680064, d2 |= e2.flags & 14680064, e2.return = a, e2 = e2.sibling;
    else for (e2 = a.child; null !== e2; ) c2 |= e2.lanes | e2.childLanes, d2 |= e2.subtreeFlags, d2 |= e2.flags, e2.return = a, e2 = e2.sibling;
    a.subtreeFlags |= d2;
    a.childLanes = c2;
    return b2;
  }
  function Ej(a, b2, c2) {
    var d2 = b2.pendingProps;
    wg(b2);
    switch (b2.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return S(b2), null;
      case 1:
        return Zf(b2.type) && $f(), S(b2), null;
      case 3:
        d2 = b2.stateNode;
        zh();
        E(Wf);
        E(H);
        Eh();
        d2.pendingContext && (d2.context = d2.pendingContext, d2.pendingContext = null);
        if (null === a || null === a.child) Gg(b2) ? b2.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b2.flags & 256) || (b2.flags |= 1024, null !== zg && (Fj(zg), zg = null));
        Aj(a, b2);
        S(b2);
        return null;
      case 5:
        Bh(b2);
        var e2 = xh(wh.current);
        c2 = b2.type;
        if (null !== a && null != b2.stateNode) Bj(a, b2, c2, d2, e2), a.ref !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
        else {
          if (!d2) {
            if (null === b2.stateNode) throw Error(p$3(166));
            S(b2);
            return null;
          }
          a = xh(uh.current);
          if (Gg(b2)) {
            d2 = b2.stateNode;
            c2 = b2.type;
            var f2 = b2.memoizedProps;
            d2[Of] = b2;
            d2[Pf] = f2;
            a = 0 !== (b2.mode & 1);
            switch (c2) {
              case "dialog":
                D("cancel", d2);
                D("close", d2);
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", d2);
                break;
              case "video":
              case "audio":
                for (e2 = 0; e2 < lf.length; e2++) D(lf[e2], d2);
                break;
              case "source":
                D("error", d2);
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  d2
                );
                D("load", d2);
                break;
              case "details":
                D("toggle", d2);
                break;
              case "input":
                Za(d2, f2);
                D("invalid", d2);
                break;
              case "select":
                d2._wrapperState = { wasMultiple: !!f2.multiple };
                D("invalid", d2);
                break;
              case "textarea":
                hb(d2, f2), D("invalid", d2);
            }
            ub(c2, f2);
            e2 = null;
            for (var g2 in f2) if (f2.hasOwnProperty(g2)) {
              var h2 = f2[g2];
              "children" === g2 ? "string" === typeof h2 ? d2.textContent !== h2 && (true !== f2.suppressHydrationWarning && Af(d2.textContent, h2, a), e2 = ["children", h2]) : "number" === typeof h2 && d2.textContent !== "" + h2 && (true !== f2.suppressHydrationWarning && Af(
                d2.textContent,
                h2,
                a
              ), e2 = ["children", "" + h2]) : ea.hasOwnProperty(g2) && null != h2 && "onScroll" === g2 && D("scroll", d2);
            }
            switch (c2) {
              case "input":
                Va(d2);
                db(d2, f2, true);
                break;
              case "textarea":
                Va(d2);
                jb(d2);
                break;
              case "select":
              case "option":
                break;
              default:
                "function" === typeof f2.onClick && (d2.onclick = Bf);
            }
            d2 = e2;
            b2.updateQueue = d2;
            null !== d2 && (b2.flags |= 4);
          } else {
            g2 = 9 === e2.nodeType ? e2 : e2.ownerDocument;
            "http://www.w3.org/1999/xhtml" === a && (a = kb(c2));
            "http://www.w3.org/1999/xhtml" === a ? "script" === c2 ? (a = g2.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d2.is ? a = g2.createElement(c2, { is: d2.is }) : (a = g2.createElement(c2), "select" === c2 && (g2 = a, d2.multiple ? g2.multiple = true : d2.size && (g2.size = d2.size))) : a = g2.createElementNS(a, c2);
            a[Of] = b2;
            a[Pf] = d2;
            zj(a, b2, false, false);
            b2.stateNode = a;
            a: {
              g2 = vb(c2, d2);
              switch (c2) {
                case "dialog":
                  D("cancel", a);
                  D("close", a);
                  e2 = d2;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  D("load", a);
                  e2 = d2;
                  break;
                case "video":
                case "audio":
                  for (e2 = 0; e2 < lf.length; e2++) D(lf[e2], a);
                  e2 = d2;
                  break;
                case "source":
                  D("error", a);
                  e2 = d2;
                  break;
                case "img":
                case "image":
                case "link":
                  D(
                    "error",
                    a
                  );
                  D("load", a);
                  e2 = d2;
                  break;
                case "details":
                  D("toggle", a);
                  e2 = d2;
                  break;
                case "input":
                  Za(a, d2);
                  e2 = Ya(a, d2);
                  D("invalid", a);
                  break;
                case "option":
                  e2 = d2;
                  break;
                case "select":
                  a._wrapperState = { wasMultiple: !!d2.multiple };
                  e2 = A$1({}, d2, { value: void 0 });
                  D("invalid", a);
                  break;
                case "textarea":
                  hb(a, d2);
                  e2 = gb(a, d2);
                  D("invalid", a);
                  break;
                default:
                  e2 = d2;
              }
              ub(c2, e2);
              h2 = e2;
              for (f2 in h2) if (h2.hasOwnProperty(f2)) {
                var k2 = h2[f2];
                "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c2 || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g2));
              }
              switch (c2) {
                case "input":
                  Va(a);
                  db(a, d2, false);
                  break;
                case "textarea":
                  Va(a);
                  jb(a);
                  break;
                case "option":
                  null != d2.value && a.setAttribute("value", "" + Sa(d2.value));
                  break;
                case "select":
                  a.multiple = !!d2.multiple;
                  f2 = d2.value;
                  null != f2 ? fb(a, !!d2.multiple, f2, false) : null != d2.defaultValue && fb(
                    a,
                    !!d2.multiple,
                    d2.defaultValue,
                    true
                  );
                  break;
                default:
                  "function" === typeof e2.onClick && (a.onclick = Bf);
              }
              switch (c2) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  d2 = !!d2.autoFocus;
                  break a;
                case "img":
                  d2 = true;
                  break a;
                default:
                  d2 = false;
              }
            }
            d2 && (b2.flags |= 4);
          }
          null !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
        }
        S(b2);
        return null;
      case 6:
        if (a && null != b2.stateNode) Cj(a, b2, a.memoizedProps, d2);
        else {
          if ("string" !== typeof d2 && null === b2.stateNode) throw Error(p$3(166));
          c2 = xh(wh.current);
          xh(uh.current);
          if (Gg(b2)) {
            d2 = b2.stateNode;
            c2 = b2.memoizedProps;
            d2[Of] = b2;
            if (f2 = d2.nodeValue !== c2) {
              if (a = xg, null !== a) switch (a.tag) {
                case 3:
                  Af(d2.nodeValue, c2, 0 !== (a.mode & 1));
                  break;
                case 5:
                  true !== a.memoizedProps.suppressHydrationWarning && Af(d2.nodeValue, c2, 0 !== (a.mode & 1));
              }
            }
            f2 && (b2.flags |= 4);
          } else d2 = (9 === c2.nodeType ? c2 : c2.ownerDocument).createTextNode(d2), d2[Of] = b2, b2.stateNode = d2;
        }
        S(b2);
        return null;
      case 13:
        E(L);
        d2 = b2.memoizedState;
        if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
          if (I && null !== yg && 0 !== (b2.mode & 1) && 0 === (b2.flags & 128)) Hg(), Ig(), b2.flags |= 98560, f2 = false;
          else if (f2 = Gg(b2), null !== d2 && null !== d2.dehydrated) {
            if (null === a) {
              if (!f2) throw Error(p$3(318));
              f2 = b2.memoizedState;
              f2 = null !== f2 ? f2.dehydrated : null;
              if (!f2) throw Error(p$3(317));
              f2[Of] = b2;
            } else Ig(), 0 === (b2.flags & 128) && (b2.memoizedState = null), b2.flags |= 4;
            S(b2);
            f2 = false;
          } else null !== zg && (Fj(zg), zg = null), f2 = true;
          if (!f2) return b2.flags & 65536 ? b2 : null;
        }
        if (0 !== (b2.flags & 128)) return b2.lanes = c2, b2;
        d2 = null !== d2;
        d2 !== (null !== a && null !== a.memoizedState) && d2 && (b2.child.flags |= 8192, 0 !== (b2.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
        null !== b2.updateQueue && (b2.flags |= 4);
        S(b2);
        return null;
      case 4:
        return zh(), Aj(a, b2), null === a && sf(b2.stateNode.containerInfo), S(b2), null;
      case 10:
        return ah(b2.type._context), S(b2), null;
      case 17:
        return Zf(b2.type) && $f(), S(b2), null;
      case 19:
        E(L);
        f2 = b2.memoizedState;
        if (null === f2) return S(b2), null;
        d2 = 0 !== (b2.flags & 128);
        g2 = f2.rendering;
        if (null === g2) if (d2) Dj(f2, false);
        else {
          if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b2.child; null !== a; ) {
            g2 = Ch(a);
            if (null !== g2) {
              b2.flags |= 128;
              Dj(f2, false);
              d2 = g2.updateQueue;
              null !== d2 && (b2.updateQueue = d2, b2.flags |= 4);
              b2.subtreeFlags = 0;
              d2 = c2;
              for (c2 = b2.child; null !== c2; ) f2 = c2, a = d2, f2.flags &= 14680066, g2 = f2.alternate, null === g2 ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g2.childLanes, f2.lanes = g2.lanes, f2.child = g2.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g2.memoizedProps, f2.memoizedState = g2.memoizedState, f2.updateQueue = g2.updateQueue, f2.type = g2.type, a = g2.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c2 = c2.sibling;
              G(L, L.current & 1 | 2);
              return b2.child;
            }
            a = a.sibling;
          }
          null !== f2.tail && B() > Gj && (b2.flags |= 128, d2 = true, Dj(f2, false), b2.lanes = 4194304);
        }
        else {
          if (!d2) if (a = Ch(g2), null !== a) {
            if (b2.flags |= 128, d2 = true, c2 = a.updateQueue, null !== c2 && (b2.updateQueue = c2, b2.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g2.alternate && !I) return S(b2), null;
          } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c2 && (b2.flags |= 128, d2 = true, Dj(f2, false), b2.lanes = 4194304);
          f2.isBackwards ? (g2.sibling = b2.child, b2.child = g2) : (c2 = f2.last, null !== c2 ? c2.sibling = g2 : b2.child = g2, f2.last = g2);
        }
        if (null !== f2.tail) return b2 = f2.tail, f2.rendering = b2, f2.tail = b2.sibling, f2.renderingStartTime = B(), b2.sibling = null, c2 = L.current, G(L, d2 ? c2 & 1 | 2 : c2 & 1), b2;
        S(b2);
        return null;
      case 22:
      case 23:
        return Hj(), d2 = null !== b2.memoizedState, null !== a && null !== a.memoizedState !== d2 && (b2.flags |= 8192), d2 && 0 !== (b2.mode & 1) ? 0 !== (fj & 1073741824) && (S(b2), b2.subtreeFlags & 6 && (b2.flags |= 8192)) : S(b2), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(p$3(156, b2.tag));
  }
  function Ij(a, b2) {
    wg(b2);
    switch (b2.tag) {
      case 1:
        return Zf(b2.type) && $f(), a = b2.flags, a & 65536 ? (b2.flags = a & -65537 | 128, b2) : null;
      case 3:
        return zh(), E(Wf), E(H), Eh(), a = b2.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b2.flags = a & -65537 | 128, b2) : null;
      case 5:
        return Bh(b2), null;
      case 13:
        E(L);
        a = b2.memoizedState;
        if (null !== a && null !== a.dehydrated) {
          if (null === b2.alternate) throw Error(p$3(340));
          Ig();
        }
        a = b2.flags;
        return a & 65536 ? (b2.flags = a & -65537 | 128, b2) : null;
      case 19:
        return E(L), null;
      case 4:
        return zh(), null;
      case 10:
        return ah(b2.type._context), null;
      case 22:
      case 23:
        return Hj(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
  function Lj(a, b2) {
    var c2 = a.ref;
    if (null !== c2) if ("function" === typeof c2) try {
      c2(null);
    } catch (d2) {
      W(a, b2, d2);
    }
    else c2.current = null;
  }
  function Mj(a, b2, c2) {
    try {
      c2();
    } catch (d2) {
      W(a, b2, d2);
    }
  }
  var Nj = false;
  function Oj(a, b2) {
    Cf = dd;
    a = Me();
    if (Ne(a)) {
      if ("selectionStart" in a) var c2 = { start: a.selectionStart, end: a.selectionEnd };
      else a: {
        c2 = (c2 = a.ownerDocument) && c2.defaultView || window;
        var d2 = c2.getSelection && c2.getSelection();
        if (d2 && 0 !== d2.rangeCount) {
          c2 = d2.anchorNode;
          var e2 = d2.anchorOffset, f2 = d2.focusNode;
          d2 = d2.focusOffset;
          try {
            c2.nodeType, f2.nodeType;
          } catch (F2) {
            c2 = null;
            break a;
          }
          var g2 = 0, h2 = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
          b: for (; ; ) {
            for (var y2; ; ) {
              q2 !== c2 || 0 !== e2 && 3 !== q2.nodeType || (h2 = g2 + e2);
              q2 !== f2 || 0 !== d2 && 3 !== q2.nodeType || (k2 = g2 + d2);
              3 === q2.nodeType && (g2 += q2.nodeValue.length);
              if (null === (y2 = q2.firstChild)) break;
              r2 = q2;
              q2 = y2;
            }
            for (; ; ) {
              if (q2 === a) break b;
              r2 === c2 && ++l2 === e2 && (h2 = g2);
              r2 === f2 && ++m2 === d2 && (k2 = g2);
              if (null !== (y2 = q2.nextSibling)) break;
              q2 = r2;
              r2 = q2.parentNode;
            }
            q2 = y2;
          }
          c2 = -1 === h2 || -1 === k2 ? null : { start: h2, end: k2 };
        } else c2 = null;
      }
      c2 = c2 || { start: 0, end: 0 };
    } else c2 = null;
    Df = { focusedElem: a, selectionRange: c2 };
    dd = false;
    for (V = b2; null !== V; ) if (b2 = V, a = b2.child, 0 !== (b2.subtreeFlags & 1028) && null !== a) a.return = b2, V = a;
    else for (; null !== V; ) {
      b2 = V;
      try {
        var n2 = b2.alternate;
        if (0 !== (b2.flags & 1024)) switch (b2.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (null !== n2) {
              var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b2.stateNode, w2 = x2.getSnapshotBeforeUpdate(b2.elementType === b2.type ? t2 : Ci(b2.type, t2), J2);
              x2.__reactInternalSnapshotBeforeUpdate = w2;
            }
            break;
          case 3:
            var u2 = b2.stateNode.containerInfo;
            1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(p$3(163));
        }
      } catch (F2) {
        W(b2, b2.return, F2);
      }
      a = b2.sibling;
      if (null !== a) {
        a.return = b2.return;
        V = a;
        break;
      }
      V = b2.return;
    }
    n2 = Nj;
    Nj = false;
    return n2;
  }
  function Pj(a, b2, c2) {
    var d2 = b2.updateQueue;
    d2 = null !== d2 ? d2.lastEffect : null;
    if (null !== d2) {
      var e2 = d2 = d2.next;
      do {
        if ((e2.tag & a) === a) {
          var f2 = e2.destroy;
          e2.destroy = void 0;
          void 0 !== f2 && Mj(b2, c2, f2);
        }
        e2 = e2.next;
      } while (e2 !== d2);
    }
  }
  function Qj(a, b2) {
    b2 = b2.updateQueue;
    b2 = null !== b2 ? b2.lastEffect : null;
    if (null !== b2) {
      var c2 = b2 = b2.next;
      do {
        if ((c2.tag & a) === a) {
          var d2 = c2.create;
          c2.destroy = d2();
        }
        c2 = c2.next;
      } while (c2 !== b2);
    }
  }
  function Rj(a) {
    var b2 = a.ref;
    if (null !== b2) {
      var c2 = a.stateNode;
      switch (a.tag) {
        case 5:
          a = c2;
          break;
        default:
          a = c2;
      }
      "function" === typeof b2 ? b2(a) : b2.current = a;
    }
  }
  function Sj(a) {
    var b2 = a.alternate;
    null !== b2 && (a.alternate = null, Sj(b2));
    a.child = null;
    a.deletions = null;
    a.sibling = null;
    5 === a.tag && (b2 = a.stateNode, null !== b2 && (delete b2[Of], delete b2[Pf], delete b2[of], delete b2[Qf], delete b2[Rf]));
    a.stateNode = null;
    a.return = null;
    a.dependencies = null;
    a.memoizedProps = null;
    a.memoizedState = null;
    a.pendingProps = null;
    a.stateNode = null;
    a.updateQueue = null;
  }
  function Tj(a) {
    return 5 === a.tag || 3 === a.tag || 4 === a.tag;
  }
  function Uj(a) {
    a: for (; ; ) {
      for (; null === a.sibling; ) {
        if (null === a.return || Tj(a.return)) return null;
        a = a.return;
      }
      a.sibling.return = a.return;
      for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
        if (a.flags & 2) continue a;
        if (null === a.child || 4 === a.tag) continue a;
        else a.child.return = a, a = a.child;
      }
      if (!(a.flags & 2)) return a.stateNode;
    }
  }
  function Vj(a, b2, c2) {
    var d2 = a.tag;
    if (5 === d2 || 6 === d2) a = a.stateNode, b2 ? 8 === c2.nodeType ? c2.parentNode.insertBefore(a, b2) : c2.insertBefore(a, b2) : (8 === c2.nodeType ? (b2 = c2.parentNode, b2.insertBefore(a, c2)) : (b2 = c2, b2.appendChild(a)), c2 = c2._reactRootContainer, null !== c2 && void 0 !== c2 || null !== b2.onclick || (b2.onclick = Bf));
    else if (4 !== d2 && (a = a.child, null !== a)) for (Vj(a, b2, c2), a = a.sibling; null !== a; ) Vj(a, b2, c2), a = a.sibling;
  }
  function Wj(a, b2, c2) {
    var d2 = a.tag;
    if (5 === d2 || 6 === d2) a = a.stateNode, b2 ? c2.insertBefore(a, b2) : c2.appendChild(a);
    else if (4 !== d2 && (a = a.child, null !== a)) for (Wj(a, b2, c2), a = a.sibling; null !== a; ) Wj(a, b2, c2), a = a.sibling;
  }
  var X = null, Xj = false;
  function Yj(a, b2, c2) {
    for (c2 = c2.child; null !== c2; ) Zj(a, b2, c2), c2 = c2.sibling;
  }
  function Zj(a, b2, c2) {
    if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
      lc.onCommitFiberUnmount(kc, c2);
    } catch (h2) {
    }
    switch (c2.tag) {
      case 5:
        U || Lj(c2, b2);
      case 6:
        var d2 = X, e2 = Xj;
        X = null;
        Yj(a, b2, c2);
        X = d2;
        Xj = e2;
        null !== X && (Xj ? (a = X, c2 = c2.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c2) : a.removeChild(c2)) : X.removeChild(c2.stateNode));
        break;
      case 18:
        null !== X && (Xj ? (a = X, c2 = c2.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c2) : 1 === a.nodeType && Kf(a, c2), bd(a)) : Kf(X, c2.stateNode));
        break;
      case 4:
        d2 = X;
        e2 = Xj;
        X = c2.stateNode.containerInfo;
        Xj = true;
        Yj(a, b2, c2);
        X = d2;
        Xj = e2;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!U && (d2 = c2.updateQueue, null !== d2 && (d2 = d2.lastEffect, null !== d2))) {
          e2 = d2 = d2.next;
          do {
            var f2 = e2, g2 = f2.destroy;
            f2 = f2.tag;
            void 0 !== g2 && (0 !== (f2 & 2) ? Mj(c2, b2, g2) : 0 !== (f2 & 4) && Mj(c2, b2, g2));
            e2 = e2.next;
          } while (e2 !== d2);
        }
        Yj(a, b2, c2);
        break;
      case 1:
        if (!U && (Lj(c2, b2), d2 = c2.stateNode, "function" === typeof d2.componentWillUnmount)) try {
          d2.props = c2.memoizedProps, d2.state = c2.memoizedState, d2.componentWillUnmount();
        } catch (h2) {
          W(c2, b2, h2);
        }
        Yj(a, b2, c2);
        break;
      case 21:
        Yj(a, b2, c2);
        break;
      case 22:
        c2.mode & 1 ? (U = (d2 = U) || null !== c2.memoizedState, Yj(a, b2, c2), U = d2) : Yj(a, b2, c2);
        break;
      default:
        Yj(a, b2, c2);
    }
  }
  function ak(a) {
    var b2 = a.updateQueue;
    if (null !== b2) {
      a.updateQueue = null;
      var c2 = a.stateNode;
      null === c2 && (c2 = a.stateNode = new Kj());
      b2.forEach(function(b3) {
        var d2 = bk.bind(null, a, b3);
        c2.has(b3) || (c2.add(b3), b3.then(d2, d2));
      });
    }
  }
  function ck(a, b2) {
    var c2 = b2.deletions;
    if (null !== c2) for (var d2 = 0; d2 < c2.length; d2++) {
      var e2 = c2[d2];
      try {
        var f2 = a, g2 = b2, h2 = g2;
        a: for (; null !== h2; ) {
          switch (h2.tag) {
            case 5:
              X = h2.stateNode;
              Xj = false;
              break a;
            case 3:
              X = h2.stateNode.containerInfo;
              Xj = true;
              break a;
            case 4:
              X = h2.stateNode.containerInfo;
              Xj = true;
              break a;
          }
          h2 = h2.return;
        }
        if (null === X) throw Error(p$3(160));
        Zj(f2, g2, e2);
        X = null;
        Xj = false;
        var k2 = e2.alternate;
        null !== k2 && (k2.return = null);
        e2.return = null;
      } catch (l2) {
        W(e2, b2, l2);
      }
    }
    if (b2.subtreeFlags & 12854) for (b2 = b2.child; null !== b2; ) dk(b2, a), b2 = b2.sibling;
  }
  function dk(a, b2) {
    var c2 = a.alternate, d2 = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ck(b2, a);
        ek(a);
        if (d2 & 4) {
          try {
            Pj(3, a, a.return), Qj(3, a);
          } catch (t2) {
            W(a, a.return, t2);
          }
          try {
            Pj(5, a, a.return);
          } catch (t2) {
            W(a, a.return, t2);
          }
        }
        break;
      case 1:
        ck(b2, a);
        ek(a);
        d2 & 512 && null !== c2 && Lj(c2, c2.return);
        break;
      case 5:
        ck(b2, a);
        ek(a);
        d2 & 512 && null !== c2 && Lj(c2, c2.return);
        if (a.flags & 32) {
          var e2 = a.stateNode;
          try {
            ob(e2, "");
          } catch (t2) {
            W(a, a.return, t2);
          }
        }
        if (d2 & 4 && (e2 = a.stateNode, null != e2)) {
          var f2 = a.memoizedProps, g2 = null !== c2 ? c2.memoizedProps : f2, h2 = a.type, k2 = a.updateQueue;
          a.updateQueue = null;
          if (null !== k2) try {
            "input" === h2 && "radio" === f2.type && null != f2.name && ab(e2, f2);
            vb(h2, g2);
            var l2 = vb(h2, f2);
            for (g2 = 0; g2 < k2.length; g2 += 2) {
              var m2 = k2[g2], q2 = k2[g2 + 1];
              "style" === m2 ? sb(e2, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e2, q2) : "children" === m2 ? ob(e2, q2) : ta(e2, m2, q2, l2);
            }
            switch (h2) {
              case "input":
                bb(e2, f2);
                break;
              case "textarea":
                ib(e2, f2);
                break;
              case "select":
                var r2 = e2._wrapperState.wasMultiple;
                e2._wrapperState.wasMultiple = !!f2.multiple;
                var y2 = f2.value;
                null != y2 ? fb(e2, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                  e2,
                  !!f2.multiple,
                  f2.defaultValue,
                  true
                ) : fb(e2, !!f2.multiple, f2.multiple ? [] : "", false));
            }
            e2[Pf] = f2;
          } catch (t2) {
            W(a, a.return, t2);
          }
        }
        break;
      case 6:
        ck(b2, a);
        ek(a);
        if (d2 & 4) {
          if (null === a.stateNode) throw Error(p$3(162));
          e2 = a.stateNode;
          f2 = a.memoizedProps;
          try {
            e2.nodeValue = f2;
          } catch (t2) {
            W(a, a.return, t2);
          }
        }
        break;
      case 3:
        ck(b2, a);
        ek(a);
        if (d2 & 4 && null !== c2 && c2.memoizedState.isDehydrated) try {
          bd(b2.containerInfo);
        } catch (t2) {
          W(a, a.return, t2);
        }
        break;
      case 4:
        ck(b2, a);
        ek(a);
        break;
      case 13:
        ck(b2, a);
        ek(a);
        e2 = a.child;
        e2.flags & 8192 && (f2 = null !== e2.memoizedState, e2.stateNode.isHidden = f2, !f2 || null !== e2.alternate && null !== e2.alternate.memoizedState || (fk = B()));
        d2 & 4 && ak(a);
        break;
      case 22:
        m2 = null !== c2 && null !== c2.memoizedState;
        a.mode & 1 ? (U = (l2 = U) || m2, ck(b2, a), U = l2) : ck(b2, a);
        ek(a);
        if (d2 & 8192) {
          l2 = null !== a.memoizedState;
          if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
            for (q2 = V = m2; null !== V; ) {
              r2 = V;
              y2 = r2.child;
              switch (r2.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Pj(4, r2, r2.return);
                  break;
                case 1:
                  Lj(r2, r2.return);
                  var n2 = r2.stateNode;
                  if ("function" === typeof n2.componentWillUnmount) {
                    d2 = r2;
                    c2 = r2.return;
                    try {
                      b2 = d2, n2.props = b2.memoizedProps, n2.state = b2.memoizedState, n2.componentWillUnmount();
                    } catch (t2) {
                      W(d2, c2, t2);
                    }
                  }
                  break;
                case 5:
                  Lj(r2, r2.return);
                  break;
                case 22:
                  if (null !== r2.memoizedState) {
                    gk(q2);
                    continue;
                  }
              }
              null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
            }
            m2 = m2.sibling;
          }
          a: for (m2 = null, q2 = a; ; ) {
            if (5 === q2.tag) {
              if (null === m2) {
                m2 = q2;
                try {
                  e2 = q2.stateNode, l2 ? (f2 = e2.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h2 = q2.stateNode, k2 = q2.memoizedProps.style, g2 = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h2.style.display = rb("display", g2));
                } catch (t2) {
                  W(a, a.return, t2);
                }
              }
            } else if (6 === q2.tag) {
              if (null === m2) try {
                q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
              } catch (t2) {
                W(a, a.return, t2);
              }
            } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
              q2.child.return = q2;
              q2 = q2.child;
              continue;
            }
            if (q2 === a) break a;
            for (; null === q2.sibling; ) {
              if (null === q2.return || q2.return === a) break a;
              m2 === q2 && (m2 = null);
              q2 = q2.return;
            }
            m2 === q2 && (m2 = null);
            q2.sibling.return = q2.return;
            q2 = q2.sibling;
          }
        }
        break;
      case 19:
        ck(b2, a);
        ek(a);
        d2 & 4 && ak(a);
        break;
      case 21:
        break;
      default:
        ck(
          b2,
          a
        ), ek(a);
    }
  }
  function ek(a) {
    var b2 = a.flags;
    if (b2 & 2) {
      try {
        a: {
          for (var c2 = a.return; null !== c2; ) {
            if (Tj(c2)) {
              var d2 = c2;
              break a;
            }
            c2 = c2.return;
          }
          throw Error(p$3(160));
        }
        switch (d2.tag) {
          case 5:
            var e2 = d2.stateNode;
            d2.flags & 32 && (ob(e2, ""), d2.flags &= -33);
            var f2 = Uj(a);
            Wj(a, f2, e2);
            break;
          case 3:
          case 4:
            var g2 = d2.stateNode.containerInfo, h2 = Uj(a);
            Vj(a, h2, g2);
            break;
          default:
            throw Error(p$3(161));
        }
      } catch (k2) {
        W(a, a.return, k2);
      }
      a.flags &= -3;
    }
    b2 & 4096 && (a.flags &= -4097);
  }
  function hk(a, b2, c2) {
    V = a;
    ik(a);
  }
  function ik(a, b2, c2) {
    for (var d2 = 0 !== (a.mode & 1); null !== V; ) {
      var e2 = V, f2 = e2.child;
      if (22 === e2.tag && d2) {
        var g2 = null !== e2.memoizedState || Jj;
        if (!g2) {
          var h2 = e2.alternate, k2 = null !== h2 && null !== h2.memoizedState || U;
          h2 = Jj;
          var l2 = U;
          Jj = g2;
          if ((U = k2) && !l2) for (V = e2; null !== V; ) g2 = V, k2 = g2.child, 22 === g2.tag && null !== g2.memoizedState ? jk(e2) : null !== k2 ? (k2.return = g2, V = k2) : jk(e2);
          for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
          V = e2;
          Jj = h2;
          U = l2;
        }
        kk(a);
      } else 0 !== (e2.subtreeFlags & 8772) && null !== f2 ? (f2.return = e2, V = f2) : kk(a);
    }
  }
  function kk(a) {
    for (; null !== V; ) {
      var b2 = V;
      if (0 !== (b2.flags & 8772)) {
        var c2 = b2.alternate;
        try {
          if (0 !== (b2.flags & 8772)) switch (b2.tag) {
            case 0:
            case 11:
            case 15:
              U || Qj(5, b2);
              break;
            case 1:
              var d2 = b2.stateNode;
              if (b2.flags & 4 && !U) if (null === c2) d2.componentDidMount();
              else {
                var e2 = b2.elementType === b2.type ? c2.memoizedProps : Ci(b2.type, c2.memoizedProps);
                d2.componentDidUpdate(e2, c2.memoizedState, d2.__reactInternalSnapshotBeforeUpdate);
              }
              var f2 = b2.updateQueue;
              null !== f2 && sh(b2, f2, d2);
              break;
            case 3:
              var g2 = b2.updateQueue;
              if (null !== g2) {
                c2 = null;
                if (null !== b2.child) switch (b2.child.tag) {
                  case 5:
                    c2 = b2.child.stateNode;
                    break;
                  case 1:
                    c2 = b2.child.stateNode;
                }
                sh(b2, g2, c2);
              }
              break;
            case 5:
              var h2 = b2.stateNode;
              if (null === c2 && b2.flags & 4) {
                c2 = h2;
                var k2 = b2.memoizedProps;
                switch (b2.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k2.autoFocus && c2.focus();
                    break;
                  case "img":
                    k2.src && (c2.src = k2.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (null === b2.memoizedState) {
                var l2 = b2.alternate;
                if (null !== l2) {
                  var m2 = l2.memoizedState;
                  if (null !== m2) {
                    var q2 = m2.dehydrated;
                    null !== q2 && bd(q2);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(p$3(163));
          }
          U || b2.flags & 512 && Rj(b2);
        } catch (r2) {
          W(b2, b2.return, r2);
        }
      }
      if (b2 === a) {
        V = null;
        break;
      }
      c2 = b2.sibling;
      if (null !== c2) {
        c2.return = b2.return;
        V = c2;
        break;
      }
      V = b2.return;
    }
  }
  function gk(a) {
    for (; null !== V; ) {
      var b2 = V;
      if (b2 === a) {
        V = null;
        break;
      }
      var c2 = b2.sibling;
      if (null !== c2) {
        c2.return = b2.return;
        V = c2;
        break;
      }
      V = b2.return;
    }
  }
  function jk(a) {
    for (; null !== V; ) {
      var b2 = V;
      try {
        switch (b2.tag) {
          case 0:
          case 11:
          case 15:
            var c2 = b2.return;
            try {
              Qj(4, b2);
            } catch (k2) {
              W(b2, c2, k2);
            }
            break;
          case 1:
            var d2 = b2.stateNode;
            if ("function" === typeof d2.componentDidMount) {
              var e2 = b2.return;
              try {
                d2.componentDidMount();
              } catch (k2) {
                W(b2, e2, k2);
              }
            }
            var f2 = b2.return;
            try {
              Rj(b2);
            } catch (k2) {
              W(b2, f2, k2);
            }
            break;
          case 5:
            var g2 = b2.return;
            try {
              Rj(b2);
            } catch (k2) {
              W(b2, g2, k2);
            }
        }
      } catch (k2) {
        W(b2, b2.return, k2);
      }
      if (b2 === a) {
        V = null;
        break;
      }
      var h2 = b2.sibling;
      if (null !== h2) {
        h2.return = b2.return;
        V = h2;
        break;
      }
      V = b2.return;
    }
  }
  var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
  function R() {
    return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
  }
  function yi(a) {
    if (0 === (a.mode & 1)) return 1;
    if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
    if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
    a = C;
    if (0 !== a) return a;
    a = window.event;
    a = void 0 === a ? 16 : jd(a.type);
    return a;
  }
  function gi(a, b2, c2, d2) {
    if (50 < yk) throw yk = 0, zk = null, Error(p$3(185));
    Ac(a, c2, d2);
    if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c2), 4 === T && Ck(a, Z)), Dk(a, d2), 1 === c2 && 0 === K && 0 === (b2.mode & 1) && (Gj = B() + 500, fg && jg());
  }
  function Dk(a, b2) {
    var c2 = a.callbackNode;
    wc(a, b2);
    var d2 = uc(a, a === Q ? Z : 0);
    if (0 === d2) null !== c2 && bc(c2), a.callbackNode = null, a.callbackPriority = 0;
    else if (b2 = d2 & -d2, a.callbackPriority !== b2) {
      null != c2 && bc(c2);
      if (1 === b2) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
        0 === (K & 6) && jg();
      }), c2 = null;
      else {
        switch (Dc(d2)) {
          case 1:
            c2 = fc;
            break;
          case 4:
            c2 = gc;
            break;
          case 16:
            c2 = hc;
            break;
          case 536870912:
            c2 = jc;
            break;
          default:
            c2 = hc;
        }
        c2 = Fk(c2, Gk.bind(null, a));
      }
      a.callbackPriority = b2;
      a.callbackNode = c2;
    }
  }
  function Gk(a, b2) {
    Ak = -1;
    Bk = 0;
    if (0 !== (K & 6)) throw Error(p$3(327));
    var c2 = a.callbackNode;
    if (Hk() && a.callbackNode !== c2) return null;
    var d2 = uc(a, a === Q ? Z : 0);
    if (0 === d2) return null;
    if (0 !== (d2 & 30) || 0 !== (d2 & a.expiredLanes) || b2) b2 = Ik(a, d2);
    else {
      b2 = d2;
      var e2 = K;
      K |= 2;
      var f2 = Jk();
      if (Q !== a || Z !== b2) uk = null, Gj = B() + 500, Kk(a, b2);
      do
        try {
          Lk();
          break;
        } catch (h2) {
          Mk(a, h2);
        }
      while (1);
      $g();
      mk.current = f2;
      K = e2;
      null !== Y ? b2 = 0 : (Q = null, Z = 0, b2 = T);
    }
    if (0 !== b2) {
      2 === b2 && (e2 = xc(a), 0 !== e2 && (d2 = e2, b2 = Nk(a, e2)));
      if (1 === b2) throw c2 = pk, Kk(a, 0), Ck(a, d2), Dk(a, B()), c2;
      if (6 === b2) Ck(a, d2);
      else {
        e2 = a.current.alternate;
        if (0 === (d2 & 30) && !Ok(e2) && (b2 = Ik(a, d2), 2 === b2 && (f2 = xc(a), 0 !== f2 && (d2 = f2, b2 = Nk(a, f2))), 1 === b2)) throw c2 = pk, Kk(a, 0), Ck(a, d2), Dk(a, B()), c2;
        a.finishedWork = e2;
        a.finishedLanes = d2;
        switch (b2) {
          case 0:
          case 1:
            throw Error(p$3(345));
          case 2:
            Pk(a, tk, uk);
            break;
          case 3:
            Ck(a, d2);
            if ((d2 & 130023424) === d2 && (b2 = fk + 500 - B(), 10 < b2)) {
              if (0 !== uc(a, 0)) break;
              e2 = a.suspendedLanes;
              if ((e2 & d2) !== d2) {
                R();
                a.pingedLanes |= a.suspendedLanes & e2;
                break;
              }
              a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b2);
              break;
            }
            Pk(a, tk, uk);
            break;
          case 4:
            Ck(a, d2);
            if ((d2 & 4194240) === d2) break;
            b2 = a.eventTimes;
            for (e2 = -1; 0 < d2; ) {
              var g2 = 31 - oc(d2);
              f2 = 1 << g2;
              g2 = b2[g2];
              g2 > e2 && (e2 = g2);
              d2 &= ~f2;
            }
            d2 = e2;
            d2 = B() - d2;
            d2 = (120 > d2 ? 120 : 480 > d2 ? 480 : 1080 > d2 ? 1080 : 1920 > d2 ? 1920 : 3e3 > d2 ? 3e3 : 4320 > d2 ? 4320 : 1960 * lk(d2 / 1960)) - d2;
            if (10 < d2) {
              a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d2);
              break;
            }
            Pk(a, tk, uk);
            break;
          case 5:
            Pk(a, tk, uk);
            break;
          default:
            throw Error(p$3(329));
        }
      }
    }
    Dk(a, B());
    return a.callbackNode === c2 ? Gk.bind(null, a) : null;
  }
  function Nk(a, b2) {
    var c2 = sk;
    a.current.memoizedState.isDehydrated && (Kk(a, b2).flags |= 256);
    a = Ik(a, b2);
    2 !== a && (b2 = tk, tk = c2, null !== b2 && Fj(b2));
    return a;
  }
  function Fj(a) {
    null === tk ? tk = a : tk.push.apply(tk, a);
  }
  function Ok(a) {
    for (var b2 = a; ; ) {
      if (b2.flags & 16384) {
        var c2 = b2.updateQueue;
        if (null !== c2 && (c2 = c2.stores, null !== c2)) for (var d2 = 0; d2 < c2.length; d2++) {
          var e2 = c2[d2], f2 = e2.getSnapshot;
          e2 = e2.value;
          try {
            if (!He(f2(), e2)) return false;
          } catch (g2) {
            return false;
          }
        }
      }
      c2 = b2.child;
      if (b2.subtreeFlags & 16384 && null !== c2) c2.return = b2, b2 = c2;
      else {
        if (b2 === a) break;
        for (; null === b2.sibling; ) {
          if (null === b2.return || b2.return === a) return true;
          b2 = b2.return;
        }
        b2.sibling.return = b2.return;
        b2 = b2.sibling;
      }
    }
    return true;
  }
  function Ck(a, b2) {
    b2 &= ~rk;
    b2 &= ~qk;
    a.suspendedLanes |= b2;
    a.pingedLanes &= ~b2;
    for (a = a.expirationTimes; 0 < b2; ) {
      var c2 = 31 - oc(b2), d2 = 1 << c2;
      a[c2] = -1;
      b2 &= ~d2;
    }
  }
  function Ek(a) {
    if (0 !== (K & 6)) throw Error(p$3(327));
    Hk();
    var b2 = uc(a, 0);
    if (0 === (b2 & 1)) return Dk(a, B()), null;
    var c2 = Ik(a, b2);
    if (0 !== a.tag && 2 === c2) {
      var d2 = xc(a);
      0 !== d2 && (b2 = d2, c2 = Nk(a, d2));
    }
    if (1 === c2) throw c2 = pk, Kk(a, 0), Ck(a, b2), Dk(a, B()), c2;
    if (6 === c2) throw Error(p$3(345));
    a.finishedWork = a.current.alternate;
    a.finishedLanes = b2;
    Pk(a, tk, uk);
    Dk(a, B());
    return null;
  }
  function Qk(a, b2) {
    var c2 = K;
    K |= 1;
    try {
      return a(b2);
    } finally {
      K = c2, 0 === K && (Gj = B() + 500, fg && jg());
    }
  }
  function Rk(a) {
    null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
    var b2 = K;
    K |= 1;
    var c2 = ok.transition, d2 = C;
    try {
      if (ok.transition = null, C = 1, a) return a();
    } finally {
      C = d2, ok.transition = c2, K = b2, 0 === (K & 6) && jg();
    }
  }
  function Hj() {
    fj = ej.current;
    E(ej);
  }
  function Kk(a, b2) {
    a.finishedWork = null;
    a.finishedLanes = 0;
    var c2 = a.timeoutHandle;
    -1 !== c2 && (a.timeoutHandle = -1, Gf(c2));
    if (null !== Y) for (c2 = Y.return; null !== c2; ) {
      var d2 = c2;
      wg(d2);
      switch (d2.tag) {
        case 1:
          d2 = d2.type.childContextTypes;
          null !== d2 && void 0 !== d2 && $f();
          break;
        case 3:
          zh();
          E(Wf);
          E(H);
          Eh();
          break;
        case 5:
          Bh(d2);
          break;
        case 4:
          zh();
          break;
        case 13:
          E(L);
          break;
        case 19:
          E(L);
          break;
        case 10:
          ah(d2.type._context);
          break;
        case 22:
        case 23:
          Hj();
      }
      c2 = c2.return;
    }
    Q = a;
    Y = a = Pg(a.current, null);
    Z = fj = b2;
    T = 0;
    pk = null;
    rk = qk = rh = 0;
    tk = sk = null;
    if (null !== fh) {
      for (b2 = 0; b2 < fh.length; b2++) if (c2 = fh[b2], d2 = c2.interleaved, null !== d2) {
        c2.interleaved = null;
        var e2 = d2.next, f2 = c2.pending;
        if (null !== f2) {
          var g2 = f2.next;
          f2.next = e2;
          d2.next = g2;
        }
        c2.pending = d2;
      }
      fh = null;
    }
    return a;
  }
  function Mk(a, b2) {
    do {
      var c2 = Y;
      try {
        $g();
        Fh.current = Rh;
        if (Ih) {
          for (var d2 = M.memoizedState; null !== d2; ) {
            var e2 = d2.queue;
            null !== e2 && (e2.pending = null);
            d2 = d2.next;
          }
          Ih = false;
        }
        Hh = 0;
        O = N = M = null;
        Jh = false;
        Kh = 0;
        nk.current = null;
        if (null === c2 || null === c2.return) {
          T = 1;
          pk = b2;
          Y = null;
          break;
        }
        a: {
          var f2 = a, g2 = c2.return, h2 = c2, k2 = b2;
          b2 = Z;
          h2.flags |= 32768;
          if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
            var l2 = k2, m2 = h2, q2 = m2.tag;
            if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
              var r2 = m2.alternate;
              r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
            }
            var y2 = Ui(g2);
            if (null !== y2) {
              y2.flags &= -257;
              Vi(y2, g2, h2, f2, b2);
              y2.mode & 1 && Si(f2, l2, b2);
              b2 = y2;
              k2 = l2;
              var n2 = b2.updateQueue;
              if (null === n2) {
                var t2 = /* @__PURE__ */ new Set();
                t2.add(k2);
                b2.updateQueue = t2;
              } else n2.add(k2);
              break a;
            } else {
              if (0 === (b2 & 1)) {
                Si(f2, l2, b2);
                tj();
                break a;
              }
              k2 = Error(p$3(426));
            }
          } else if (I && h2.mode & 1) {
            var J2 = Ui(g2);
            if (null !== J2) {
              0 === (J2.flags & 65536) && (J2.flags |= 256);
              Vi(J2, g2, h2, f2, b2);
              Jg(Ji(k2, h2));
              break a;
            }
          }
          f2 = k2 = Ji(k2, h2);
          4 !== T && (T = 2);
          null === sk ? sk = [f2] : sk.push(f2);
          f2 = g2;
          do {
            switch (f2.tag) {
              case 3:
                f2.flags |= 65536;
                b2 &= -b2;
                f2.lanes |= b2;
                var x2 = Ni(f2, k2, b2);
                ph(f2, x2);
                break a;
              case 1:
                h2 = k2;
                var w2 = f2.type, u2 = f2.stateNode;
                if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                  f2.flags |= 65536;
                  b2 &= -b2;
                  f2.lanes |= b2;
                  var F2 = Qi(f2, h2, b2);
                  ph(f2, F2);
                  break a;
                }
            }
            f2 = f2.return;
          } while (null !== f2);
        }
        Sk(c2);
      } catch (na) {
        b2 = na;
        Y === c2 && null !== c2 && (Y = c2 = c2.return);
        continue;
      }
      break;
    } while (1);
  }
  function Jk() {
    var a = mk.current;
    mk.current = Rh;
    return null === a ? Rh : a;
  }
  function tj() {
    if (0 === T || 3 === T || 2 === T) T = 4;
    null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
  }
  function Ik(a, b2) {
    var c2 = K;
    K |= 2;
    var d2 = Jk();
    if (Q !== a || Z !== b2) uk = null, Kk(a, b2);
    do
      try {
        Tk();
        break;
      } catch (e2) {
        Mk(a, e2);
      }
    while (1);
    $g();
    K = c2;
    mk.current = d2;
    if (null !== Y) throw Error(p$3(261));
    Q = null;
    Z = 0;
    return T;
  }
  function Tk() {
    for (; null !== Y; ) Uk(Y);
  }
  function Lk() {
    for (; null !== Y && !cc(); ) Uk(Y);
  }
  function Uk(a) {
    var b2 = Vk(a.alternate, a, fj);
    a.memoizedProps = a.pendingProps;
    null === b2 ? Sk(a) : Y = b2;
    nk.current = null;
  }
  function Sk(a) {
    var b2 = a;
    do {
      var c2 = b2.alternate;
      a = b2.return;
      if (0 === (b2.flags & 32768)) {
        if (c2 = Ej(c2, b2, fj), null !== c2) {
          Y = c2;
          return;
        }
      } else {
        c2 = Ij(c2, b2);
        if (null !== c2) {
          c2.flags &= 32767;
          Y = c2;
          return;
        }
        if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
        else {
          T = 6;
          Y = null;
          return;
        }
      }
      b2 = b2.sibling;
      if (null !== b2) {
        Y = b2;
        return;
      }
      Y = b2 = a;
    } while (null !== b2);
    0 === T && (T = 5);
  }
  function Pk(a, b2, c2) {
    var d2 = C, e2 = ok.transition;
    try {
      ok.transition = null, C = 1, Wk(a, b2, c2, d2);
    } finally {
      ok.transition = e2, C = d2;
    }
    return null;
  }
  function Wk(a, b2, c2, d2) {
    do
      Hk();
    while (null !== wk);
    if (0 !== (K & 6)) throw Error(p$3(327));
    c2 = a.finishedWork;
    var e2 = a.finishedLanes;
    if (null === c2) return null;
    a.finishedWork = null;
    a.finishedLanes = 0;
    if (c2 === a.current) throw Error(p$3(177));
    a.callbackNode = null;
    a.callbackPriority = 0;
    var f2 = c2.lanes | c2.childLanes;
    Bc(a, f2);
    a === Q && (Y = Q = null, Z = 0);
    0 === (c2.subtreeFlags & 2064) && 0 === (c2.flags & 2064) || vk || (vk = true, Fk(hc, function() {
      Hk();
      return null;
    }));
    f2 = 0 !== (c2.flags & 15990);
    if (0 !== (c2.subtreeFlags & 15990) || f2) {
      f2 = ok.transition;
      ok.transition = null;
      var g2 = C;
      C = 1;
      var h2 = K;
      K |= 4;
      nk.current = null;
      Oj(a, c2);
      dk(c2, a);
      Oe(Df);
      dd = !!Cf;
      Df = Cf = null;
      a.current = c2;
      hk(c2);
      dc();
      K = h2;
      C = g2;
      ok.transition = f2;
    } else a.current = c2;
    vk && (vk = false, wk = a, xk = e2);
    f2 = a.pendingLanes;
    0 === f2 && (Ri = null);
    mc(c2.stateNode);
    Dk(a, B());
    if (null !== b2) for (d2 = a.onRecoverableError, c2 = 0; c2 < b2.length; c2++) e2 = b2[c2], d2(e2.value, { componentStack: e2.stack, digest: e2.digest });
    if (Oi) throw Oi = false, a = Pi, Pi = null, a;
    0 !== (xk & 1) && 0 !== a.tag && Hk();
    f2 = a.pendingLanes;
    0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
    jg();
    return null;
  }
  function Hk() {
    if (null !== wk) {
      var a = Dc(xk), b2 = ok.transition, c2 = C;
      try {
        ok.transition = null;
        C = 16 > a ? 16 : a;
        if (null === wk) var d2 = false;
        else {
          a = wk;
          wk = null;
          xk = 0;
          if (0 !== (K & 6)) throw Error(p$3(331));
          var e2 = K;
          K |= 4;
          for (V = a.current; null !== V; ) {
            var f2 = V, g2 = f2.child;
            if (0 !== (V.flags & 16)) {
              var h2 = f2.deletions;
              if (null !== h2) {
                for (var k2 = 0; k2 < h2.length; k2++) {
                  var l2 = h2[k2];
                  for (V = l2; null !== V; ) {
                    var m2 = V;
                    switch (m2.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Pj(8, m2, f2);
                    }
                    var q2 = m2.child;
                    if (null !== q2) q2.return = m2, V = q2;
                    else for (; null !== V; ) {
                      m2 = V;
                      var r2 = m2.sibling, y2 = m2.return;
                      Sj(m2);
                      if (m2 === l2) {
                        V = null;
                        break;
                      }
                      if (null !== r2) {
                        r2.return = y2;
                        V = r2;
                        break;
                      }
                      V = y2;
                    }
                  }
                }
                var n2 = f2.alternate;
                if (null !== n2) {
                  var t2 = n2.child;
                  if (null !== t2) {
                    n2.child = null;
                    do {
                      var J2 = t2.sibling;
                      t2.sibling = null;
                      t2 = J2;
                    } while (null !== t2);
                  }
                }
                V = f2;
              }
            }
            if (0 !== (f2.subtreeFlags & 2064) && null !== g2) g2.return = f2, V = g2;
            else b: for (; null !== V; ) {
              f2 = V;
              if (0 !== (f2.flags & 2048)) switch (f2.tag) {
                case 0:
                case 11:
                case 15:
                  Pj(9, f2, f2.return);
              }
              var x2 = f2.sibling;
              if (null !== x2) {
                x2.return = f2.return;
                V = x2;
                break b;
              }
              V = f2.return;
            }
          }
          var w2 = a.current;
          for (V = w2; null !== V; ) {
            g2 = V;
            var u2 = g2.child;
            if (0 !== (g2.subtreeFlags & 2064) && null !== u2) u2.return = g2, V = u2;
            else b: for (g2 = w2; null !== V; ) {
              h2 = V;
              if (0 !== (h2.flags & 2048)) try {
                switch (h2.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Qj(9, h2);
                }
              } catch (na) {
                W(h2, h2.return, na);
              }
              if (h2 === g2) {
                V = null;
                break b;
              }
              var F2 = h2.sibling;
              if (null !== F2) {
                F2.return = h2.return;
                V = F2;
                break b;
              }
              V = h2.return;
            }
          }
          K = e2;
          jg();
          if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
            lc.onPostCommitFiberRoot(kc, a);
          } catch (na) {
          }
          d2 = true;
        }
        return d2;
      } finally {
        C = c2, ok.transition = b2;
      }
    }
    return false;
  }
  function Xk(a, b2, c2) {
    b2 = Ji(c2, b2);
    b2 = Ni(a, b2, 1);
    a = nh(a, b2, 1);
    b2 = R();
    null !== a && (Ac(a, 1, b2), Dk(a, b2));
  }
  function W(a, b2, c2) {
    if (3 === a.tag) Xk(a, a, c2);
    else for (; null !== b2; ) {
      if (3 === b2.tag) {
        Xk(b2, a, c2);
        break;
      } else if (1 === b2.tag) {
        var d2 = b2.stateNode;
        if ("function" === typeof b2.type.getDerivedStateFromError || "function" === typeof d2.componentDidCatch && (null === Ri || !Ri.has(d2))) {
          a = Ji(c2, a);
          a = Qi(b2, a, 1);
          b2 = nh(b2, a, 1);
          a = R();
          null !== b2 && (Ac(b2, 1, a), Dk(b2, a));
          break;
        }
      }
      b2 = b2.return;
    }
  }
  function Ti(a, b2, c2) {
    var d2 = a.pingCache;
    null !== d2 && d2.delete(b2);
    b2 = R();
    a.pingedLanes |= a.suspendedLanes & c2;
    Q === a && (Z & c2) === c2 && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c2);
    Dk(a, b2);
  }
  function Yk(a, b2) {
    0 === b2 && (0 === (a.mode & 1) ? b2 = 1 : (b2 = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
    var c2 = R();
    a = ih(a, b2);
    null !== a && (Ac(a, b2, c2), Dk(a, c2));
  }
  function uj(a) {
    var b2 = a.memoizedState, c2 = 0;
    null !== b2 && (c2 = b2.retryLane);
    Yk(a, c2);
  }
  function bk(a, b2) {
    var c2 = 0;
    switch (a.tag) {
      case 13:
        var d2 = a.stateNode;
        var e2 = a.memoizedState;
        null !== e2 && (c2 = e2.retryLane);
        break;
      case 19:
        d2 = a.stateNode;
        break;
      default:
        throw Error(p$3(314));
    }
    null !== d2 && d2.delete(b2);
    Yk(a, c2);
  }
  var Vk;
  Vk = function(a, b2, c2) {
    if (null !== a) if (a.memoizedProps !== b2.pendingProps || Wf.current) dh = true;
    else {
      if (0 === (a.lanes & c2) && 0 === (b2.flags & 128)) return dh = false, yj(a, b2, c2);
      dh = 0 !== (a.flags & 131072) ? true : false;
    }
    else dh = false, I && 0 !== (b2.flags & 1048576) && ug(b2, ng, b2.index);
    b2.lanes = 0;
    switch (b2.tag) {
      case 2:
        var d2 = b2.type;
        ij(a, b2);
        a = b2.pendingProps;
        var e2 = Yf(b2, H.current);
        ch(b2, c2);
        e2 = Nh(null, b2, d2, a, e2, c2);
        var f2 = Sh();
        b2.flags |= 1;
        "object" === typeof e2 && null !== e2 && "function" === typeof e2.render && void 0 === e2.$$typeof ? (b2.tag = 1, b2.memoizedState = null, b2.updateQueue = null, Zf(d2) ? (f2 = true, cg(b2)) : f2 = false, b2.memoizedState = null !== e2.state && void 0 !== e2.state ? e2.state : null, kh(b2), e2.updater = Ei, b2.stateNode = e2, e2._reactInternals = b2, Ii(b2, d2, a, c2), b2 = jj(null, b2, d2, true, f2, c2)) : (b2.tag = 0, I && f2 && vg(b2), Xi(null, b2, e2, c2), b2 = b2.child);
        return b2;
      case 16:
        d2 = b2.elementType;
        a: {
          ij(a, b2);
          a = b2.pendingProps;
          e2 = d2._init;
          d2 = e2(d2._payload);
          b2.type = d2;
          e2 = b2.tag = Zk(d2);
          a = Ci(d2, a);
          switch (e2) {
            case 0:
              b2 = cj(null, b2, d2, a, c2);
              break a;
            case 1:
              b2 = hj(null, b2, d2, a, c2);
              break a;
            case 11:
              b2 = Yi(null, b2, d2, a, c2);
              break a;
            case 14:
              b2 = $i(null, b2, d2, Ci(d2.type, a), c2);
              break a;
          }
          throw Error(p$3(
            306,
            d2,
            ""
          ));
        }
        return b2;
      case 0:
        return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), cj(a, b2, d2, e2, c2);
      case 1:
        return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), hj(a, b2, d2, e2, c2);
      case 3:
        a: {
          kj(b2);
          if (null === a) throw Error(p$3(387));
          d2 = b2.pendingProps;
          f2 = b2.memoizedState;
          e2 = f2.element;
          lh(a, b2);
          qh(b2, d2, null, c2);
          var g2 = b2.memoizedState;
          d2 = g2.element;
          if (f2.isDehydrated) if (f2 = { element: d2, isDehydrated: false, cache: g2.cache, pendingSuspenseBoundaries: g2.pendingSuspenseBoundaries, transitions: g2.transitions }, b2.updateQueue.baseState = f2, b2.memoizedState = f2, b2.flags & 256) {
            e2 = Ji(Error(p$3(423)), b2);
            b2 = lj(a, b2, d2, c2, e2);
            break a;
          } else if (d2 !== e2) {
            e2 = Ji(Error(p$3(424)), b2);
            b2 = lj(a, b2, d2, c2, e2);
            break a;
          } else for (yg = Lf(b2.stateNode.containerInfo.firstChild), xg = b2, I = true, zg = null, c2 = Vg(b2, null, d2, c2), b2.child = c2; c2; ) c2.flags = c2.flags & -3 | 4096, c2 = c2.sibling;
          else {
            Ig();
            if (d2 === e2) {
              b2 = Zi(a, b2, c2);
              break a;
            }
            Xi(a, b2, d2, c2);
          }
          b2 = b2.child;
        }
        return b2;
      case 5:
        return Ah(b2), null === a && Eg(b2), d2 = b2.type, e2 = b2.pendingProps, f2 = null !== a ? a.memoizedProps : null, g2 = e2.children, Ef(d2, e2) ? g2 = null : null !== f2 && Ef(d2, f2) && (b2.flags |= 32), gj(a, b2), Xi(a, b2, g2, c2), b2.child;
      case 6:
        return null === a && Eg(b2), null;
      case 13:
        return oj(a, b2, c2);
      case 4:
        return yh(b2, b2.stateNode.containerInfo), d2 = b2.pendingProps, null === a ? b2.child = Ug(b2, null, d2, c2) : Xi(a, b2, d2, c2), b2.child;
      case 11:
        return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), Yi(a, b2, d2, e2, c2);
      case 7:
        return Xi(a, b2, b2.pendingProps, c2), b2.child;
      case 8:
        return Xi(a, b2, b2.pendingProps.children, c2), b2.child;
      case 12:
        return Xi(a, b2, b2.pendingProps.children, c2), b2.child;
      case 10:
        a: {
          d2 = b2.type._context;
          e2 = b2.pendingProps;
          f2 = b2.memoizedProps;
          g2 = e2.value;
          G(Wg, d2._currentValue);
          d2._currentValue = g2;
          if (null !== f2) if (He(f2.value, g2)) {
            if (f2.children === e2.children && !Wf.current) {
              b2 = Zi(a, b2, c2);
              break a;
            }
          } else for (f2 = b2.child, null !== f2 && (f2.return = b2); null !== f2; ) {
            var h2 = f2.dependencies;
            if (null !== h2) {
              g2 = f2.child;
              for (var k2 = h2.firstContext; null !== k2; ) {
                if (k2.context === d2) {
                  if (1 === f2.tag) {
                    k2 = mh(-1, c2 & -c2);
                    k2.tag = 2;
                    var l2 = f2.updateQueue;
                    if (null !== l2) {
                      l2 = l2.shared;
                      var m2 = l2.pending;
                      null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                      l2.pending = k2;
                    }
                  }
                  f2.lanes |= c2;
                  k2 = f2.alternate;
                  null !== k2 && (k2.lanes |= c2);
                  bh(
                    f2.return,
                    c2,
                    b2
                  );
                  h2.lanes |= c2;
                  break;
                }
                k2 = k2.next;
              }
            } else if (10 === f2.tag) g2 = f2.type === b2.type ? null : f2.child;
            else if (18 === f2.tag) {
              g2 = f2.return;
              if (null === g2) throw Error(p$3(341));
              g2.lanes |= c2;
              h2 = g2.alternate;
              null !== h2 && (h2.lanes |= c2);
              bh(g2, c2, b2);
              g2 = f2.sibling;
            } else g2 = f2.child;
            if (null !== g2) g2.return = f2;
            else for (g2 = f2; null !== g2; ) {
              if (g2 === b2) {
                g2 = null;
                break;
              }
              f2 = g2.sibling;
              if (null !== f2) {
                f2.return = g2.return;
                g2 = f2;
                break;
              }
              g2 = g2.return;
            }
            f2 = g2;
          }
          Xi(a, b2, e2.children, c2);
          b2 = b2.child;
        }
        return b2;
      case 9:
        return e2 = b2.type, d2 = b2.pendingProps.children, ch(b2, c2), e2 = eh(e2), d2 = d2(e2), b2.flags |= 1, Xi(a, b2, d2, c2), b2.child;
      case 14:
        return d2 = b2.type, e2 = Ci(d2, b2.pendingProps), e2 = Ci(d2.type, e2), $i(a, b2, d2, e2, c2);
      case 15:
        return bj(a, b2, b2.type, b2.pendingProps, c2);
      case 17:
        return d2 = b2.type, e2 = b2.pendingProps, e2 = b2.elementType === d2 ? e2 : Ci(d2, e2), ij(a, b2), b2.tag = 1, Zf(d2) ? (a = true, cg(b2)) : a = false, ch(b2, c2), Gi(b2, d2, e2), Ii(b2, d2, e2, c2), jj(null, b2, d2, true, a, c2);
      case 19:
        return xj(a, b2, c2);
      case 22:
        return dj(a, b2, c2);
    }
    throw Error(p$3(156, b2.tag));
  };
  function Fk(a, b2) {
    return ac(a, b2);
  }
  function $k(a, b2, c2, d2) {
    this.tag = a;
    this.key = c2;
    this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
    this.index = 0;
    this.ref = null;
    this.pendingProps = b2;
    this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
    this.mode = d2;
    this.subtreeFlags = this.flags = 0;
    this.deletions = null;
    this.childLanes = this.lanes = 0;
    this.alternate = null;
  }
  function Bg(a, b2, c2, d2) {
    return new $k(a, b2, c2, d2);
  }
  function aj(a) {
    a = a.prototype;
    return !(!a || !a.isReactComponent);
  }
  function Zk(a) {
    if ("function" === typeof a) return aj(a) ? 1 : 0;
    if (void 0 !== a && null !== a) {
      a = a.$$typeof;
      if (a === Da) return 11;
      if (a === Ga) return 14;
    }
    return 2;
  }
  function Pg(a, b2) {
    var c2 = a.alternate;
    null === c2 ? (c2 = Bg(a.tag, b2, a.key, a.mode), c2.elementType = a.elementType, c2.type = a.type, c2.stateNode = a.stateNode, c2.alternate = a, a.alternate = c2) : (c2.pendingProps = b2, c2.type = a.type, c2.flags = 0, c2.subtreeFlags = 0, c2.deletions = null);
    c2.flags = a.flags & 14680064;
    c2.childLanes = a.childLanes;
    c2.lanes = a.lanes;
    c2.child = a.child;
    c2.memoizedProps = a.memoizedProps;
    c2.memoizedState = a.memoizedState;
    c2.updateQueue = a.updateQueue;
    b2 = a.dependencies;
    c2.dependencies = null === b2 ? null : { lanes: b2.lanes, firstContext: b2.firstContext };
    c2.sibling = a.sibling;
    c2.index = a.index;
    c2.ref = a.ref;
    return c2;
  }
  function Rg(a, b2, c2, d2, e2, f2) {
    var g2 = 2;
    d2 = a;
    if ("function" === typeof a) aj(a) && (g2 = 1);
    else if ("string" === typeof a) g2 = 5;
    else a: switch (a) {
      case ya:
        return Tg(c2.children, e2, f2, b2);
      case za:
        g2 = 8;
        e2 |= 8;
        break;
      case Aa:
        return a = Bg(12, c2, b2, e2 | 2), a.elementType = Aa, a.lanes = f2, a;
      case Ea:
        return a = Bg(13, c2, b2, e2), a.elementType = Ea, a.lanes = f2, a;
      case Fa:
        return a = Bg(19, c2, b2, e2), a.elementType = Fa, a.lanes = f2, a;
      case Ia:
        return pj(c2, e2, f2, b2);
      default:
        if ("object" === typeof a && null !== a) switch (a.$$typeof) {
          case Ba:
            g2 = 10;
            break a;
          case Ca:
            g2 = 9;
            break a;
          case Da:
            g2 = 11;
            break a;
          case Ga:
            g2 = 14;
            break a;
          case Ha:
            g2 = 16;
            d2 = null;
            break a;
        }
        throw Error(p$3(130, null == a ? a : typeof a, ""));
    }
    b2 = Bg(g2, c2, b2, e2);
    b2.elementType = a;
    b2.type = d2;
    b2.lanes = f2;
    return b2;
  }
  function Tg(a, b2, c2, d2) {
    a = Bg(7, a, d2, b2);
    a.lanes = c2;
    return a;
  }
  function pj(a, b2, c2, d2) {
    a = Bg(22, a, d2, b2);
    a.elementType = Ia;
    a.lanes = c2;
    a.stateNode = { isHidden: false };
    return a;
  }
  function Qg(a, b2, c2) {
    a = Bg(6, a, null, b2);
    a.lanes = c2;
    return a;
  }
  function Sg(a, b2, c2) {
    b2 = Bg(4, null !== a.children ? a.children : [], a.key, b2);
    b2.lanes = c2;
    b2.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
    return b2;
  }
  function al(a, b2, c2, d2, e2) {
    this.tag = b2;
    this.containerInfo = a;
    this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
    this.timeoutHandle = -1;
    this.callbackNode = this.pendingContext = this.context = null;
    this.callbackPriority = 0;
    this.eventTimes = zc(0);
    this.expirationTimes = zc(-1);
    this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
    this.entanglements = zc(0);
    this.identifierPrefix = d2;
    this.onRecoverableError = e2;
    this.mutableSourceEagerHydrationData = null;
  }
  function bl(a, b2, c2, d2, e2, f2, g2, h2, k2) {
    a = new al(a, b2, c2, h2, k2);
    1 === b2 ? (b2 = 1, true === f2 && (b2 |= 8)) : b2 = 0;
    f2 = Bg(3, null, null, b2);
    a.current = f2;
    f2.stateNode = a;
    f2.memoizedState = { element: d2, isDehydrated: c2, cache: null, transitions: null, pendingSuspenseBoundaries: null };
    kh(f2);
    return a;
  }
  function cl(a, b2, c2) {
    var d2 = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return { $$typeof: wa, key: null == d2 ? null : "" + d2, children: a, containerInfo: b2, implementation: c2 };
  }
  function dl(a) {
    if (!a) return Vf;
    a = a._reactInternals;
    a: {
      if (Vb(a) !== a || 1 !== a.tag) throw Error(p$3(170));
      var b2 = a;
      do {
        switch (b2.tag) {
          case 3:
            b2 = b2.stateNode.context;
            break a;
          case 1:
            if (Zf(b2.type)) {
              b2 = b2.stateNode.__reactInternalMemoizedMergedChildContext;
              break a;
            }
        }
        b2 = b2.return;
      } while (null !== b2);
      throw Error(p$3(171));
    }
    if (1 === a.tag) {
      var c2 = a.type;
      if (Zf(c2)) return bg(a, c2, b2);
    }
    return b2;
  }
  function el(a, b2, c2, d2, e2, f2, g2, h2, k2) {
    a = bl(c2, d2, true, a, e2, f2, g2, h2, k2);
    a.context = dl(null);
    c2 = a.current;
    d2 = R();
    e2 = yi(c2);
    f2 = mh(d2, e2);
    f2.callback = void 0 !== b2 && null !== b2 ? b2 : null;
    nh(c2, f2, e2);
    a.current.lanes = e2;
    Ac(a, e2, d2);
    Dk(a, d2);
    return a;
  }
  function fl(a, b2, c2, d2) {
    var e2 = b2.current, f2 = R(), g2 = yi(e2);
    c2 = dl(c2);
    null === b2.context ? b2.context = c2 : b2.pendingContext = c2;
    b2 = mh(f2, g2);
    b2.payload = { element: a };
    d2 = void 0 === d2 ? null : d2;
    null !== d2 && (b2.callback = d2);
    a = nh(e2, b2, g2);
    null !== a && (gi(a, e2, g2, f2), oh(a, e2, g2));
    return g2;
  }
  function gl(a) {
    a = a.current;
    if (!a.child) return null;
    switch (a.child.tag) {
      case 5:
        return a.child.stateNode;
      default:
        return a.child.stateNode;
    }
  }
  function hl(a, b2) {
    a = a.memoizedState;
    if (null !== a && null !== a.dehydrated) {
      var c2 = a.retryLane;
      a.retryLane = 0 !== c2 && c2 < b2 ? c2 : b2;
    }
  }
  function il(a, b2) {
    hl(a, b2);
    (a = a.alternate) && hl(a, b2);
  }
  function jl() {
    return null;
  }
  var kl = "function" === typeof reportError ? reportError : function(a) {
    console.error(a);
  };
  function ll(a) {
    this._internalRoot = a;
  }
  ml.prototype.render = ll.prototype.render = function(a) {
    var b2 = this._internalRoot;
    if (null === b2) throw Error(p$3(409));
    fl(a, b2, null, null);
  };
  ml.prototype.unmount = ll.prototype.unmount = function() {
    var a = this._internalRoot;
    if (null !== a) {
      this._internalRoot = null;
      var b2 = a.containerInfo;
      Rk(function() {
        fl(null, a, null, null);
      });
      b2[uf] = null;
    }
  };
  function ml(a) {
    this._internalRoot = a;
  }
  ml.prototype.unstable_scheduleHydration = function(a) {
    if (a) {
      var b2 = Hc();
      a = { blockedOn: null, target: a, priority: b2 };
      for (var c2 = 0; c2 < Qc.length && 0 !== b2 && b2 < Qc[c2].priority; c2++) ;
      Qc.splice(c2, 0, a);
      0 === c2 && Vc(a);
    }
  };
  function nl(a) {
    return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
  }
  function ol(a) {
    return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
  }
  function pl() {
  }
  function ql(a, b2, c2, d2, e2) {
    if (e2) {
      if ("function" === typeof d2) {
        var f2 = d2;
        d2 = function() {
          var a2 = gl(g2);
          f2.call(a2);
        };
      }
      var g2 = el(b2, d2, a, 0, null, false, false, "", pl);
      a._reactRootContainer = g2;
      a[uf] = g2.current;
      sf(8 === a.nodeType ? a.parentNode : a);
      Rk();
      return g2;
    }
    for (; e2 = a.lastChild; ) a.removeChild(e2);
    if ("function" === typeof d2) {
      var h2 = d2;
      d2 = function() {
        var a2 = gl(k2);
        h2.call(a2);
      };
    }
    var k2 = bl(a, 0, false, null, null, false, false, "", pl);
    a._reactRootContainer = k2;
    a[uf] = k2.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk(function() {
      fl(b2, k2, c2, d2);
    });
    return k2;
  }
  function rl(a, b2, c2, d2, e2) {
    var f2 = c2._reactRootContainer;
    if (f2) {
      var g2 = f2;
      if ("function" === typeof e2) {
        var h2 = e2;
        e2 = function() {
          var a2 = gl(g2);
          h2.call(a2);
        };
      }
      fl(b2, g2, a, e2);
    } else g2 = ql(c2, b2, a, e2, d2);
    return gl(g2);
  }
  Ec = function(a) {
    switch (a.tag) {
      case 3:
        var b2 = a.stateNode;
        if (b2.current.memoizedState.isDehydrated) {
          var c2 = tc(b2.pendingLanes);
          0 !== c2 && (Cc(b2, c2 | 1), Dk(b2, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
        }
        break;
      case 13:
        Rk(function() {
          var b3 = ih(a, 1);
          if (null !== b3) {
            var c3 = R();
            gi(b3, a, 1, c3);
          }
        }), il(a, 1);
    }
  };
  Fc = function(a) {
    if (13 === a.tag) {
      var b2 = ih(a, 134217728);
      if (null !== b2) {
        var c2 = R();
        gi(b2, a, 134217728, c2);
      }
      il(a, 134217728);
    }
  };
  Gc = function(a) {
    if (13 === a.tag) {
      var b2 = yi(a), c2 = ih(a, b2);
      if (null !== c2) {
        var d2 = R();
        gi(c2, a, b2, d2);
      }
      il(a, b2);
    }
  };
  Hc = function() {
    return C;
  };
  Ic = function(a, b2) {
    var c2 = C;
    try {
      return C = a, b2();
    } finally {
      C = c2;
    }
  };
  yb = function(a, b2, c2) {
    switch (b2) {
      case "input":
        bb(a, c2);
        b2 = c2.name;
        if ("radio" === c2.type && null != b2) {
          for (c2 = a; c2.parentNode; ) c2 = c2.parentNode;
          c2 = c2.querySelectorAll("input[name=" + JSON.stringify("" + b2) + '][type="radio"]');
          for (b2 = 0; b2 < c2.length; b2++) {
            var d2 = c2[b2];
            if (d2 !== a && d2.form === a.form) {
              var e2 = Db(d2);
              if (!e2) throw Error(p$3(90));
              Wa(d2);
              bb(d2, e2);
            }
          }
        }
        break;
      case "textarea":
        ib(a, c2);
        break;
      case "select":
        b2 = c2.value, null != b2 && fb(a, !!c2.multiple, b2, false);
    }
  };
  Gb = Qk;
  Hb = Rk;
  var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
  var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
    a = Zb(a);
    return null === a ? null : a.stateNode;
  }, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
    var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!vl.isDisabled && vl.supportsFiber) try {
      kc = vl.inject(ul), lc = vl;
    } catch (a) {
    }
  }
  reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
  reactDom_production_min.createPortal = function(a, b2) {
    var c2 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    if (!nl(b2)) throw Error(p$3(200));
    return cl(a, b2, null, c2);
  };
  reactDom_production_min.createRoot = function(a, b2) {
    if (!nl(a)) throw Error(p$3(299));
    var c2 = false, d2 = "", e2 = kl;
    null !== b2 && void 0 !== b2 && (true === b2.unstable_strictMode && (c2 = true), void 0 !== b2.identifierPrefix && (d2 = b2.identifierPrefix), void 0 !== b2.onRecoverableError && (e2 = b2.onRecoverableError));
    b2 = bl(a, 1, false, null, null, c2, false, d2, e2);
    a[uf] = b2.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    return new ll(b2);
  };
  reactDom_production_min.findDOMNode = function(a) {
    if (null == a) return null;
    if (1 === a.nodeType) return a;
    var b2 = a._reactInternals;
    if (void 0 === b2) {
      if ("function" === typeof a.render) throw Error(p$3(188));
      a = Object.keys(a).join(",");
      throw Error(p$3(268, a));
    }
    a = Zb(b2);
    a = null === a ? null : a.stateNode;
    return a;
  };
  reactDom_production_min.flushSync = function(a) {
    return Rk(a);
  };
  reactDom_production_min.hydrate = function(a, b2, c2) {
    if (!ol(b2)) throw Error(p$3(200));
    return rl(null, a, b2, true, c2);
  };
  reactDom_production_min.hydrateRoot = function(a, b2, c2) {
    if (!nl(a)) throw Error(p$3(405));
    var d2 = null != c2 && c2.hydratedSources || null, e2 = false, f2 = "", g2 = kl;
    null !== c2 && void 0 !== c2 && (true === c2.unstable_strictMode && (e2 = true), void 0 !== c2.identifierPrefix && (f2 = c2.identifierPrefix), void 0 !== c2.onRecoverableError && (g2 = c2.onRecoverableError));
    b2 = el(b2, null, a, 1, null != c2 ? c2 : null, e2, false, f2, g2);
    a[uf] = b2.current;
    sf(a);
    if (d2) for (a = 0; a < d2.length; a++) c2 = d2[a], e2 = c2._getVersion, e2 = e2(c2._source), null == b2.mutableSourceEagerHydrationData ? b2.mutableSourceEagerHydrationData = [c2, e2] : b2.mutableSourceEagerHydrationData.push(
      c2,
      e2
    );
    return new ml(b2);
  };
  reactDom_production_min.render = function(a, b2, c2) {
    if (!ol(b2)) throw Error(p$3(200));
    return rl(null, a, b2, false, c2);
  };
  reactDom_production_min.unmountComponentAtNode = function(a) {
    if (!ol(a)) throw Error(p$3(40));
    return a._reactRootContainer ? (Rk(function() {
      rl(null, null, a, false, function() {
        a._reactRootContainer = null;
        a[uf] = null;
      });
    }), true) : false;
  };
  reactDom_production_min.unstable_batchedUpdates = Qk;
  reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b2, c2, d2) {
    if (!ol(c2)) throw Error(p$3(200));
    if (null == a || void 0 === a._reactInternals) throw Error(p$3(38));
    return rl(a, b2, c2, false, d2);
  };
  reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    reactDom.exports = reactDom_production_min;
  }
  var reactDomExports = reactDom.exports;
  const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports);
  var createRoot;
  var m$2 = reactDomExports;
  {
    createRoot = m$2.createRoot;
    m$2.hydrateRoot;
  }
  function r$2(e2) {
    var t2, f2, n2 = "";
    if ("string" == typeof e2 || "number" == typeof e2) n2 += e2;
    else if ("object" == typeof e2) if (Array.isArray(e2)) {
      var o = e2.length;
      for (t2 = 0; t2 < o; t2++) e2[t2] && (f2 = r$2(e2[t2])) && (n2 && (n2 += " "), n2 += f2);
    } else for (f2 in e2) e2[f2] && (n2 && (n2 += " "), n2 += f2);
    return n2;
  }
  function clsx() {
    for (var e2, t2, f2 = 0, n2 = "", o = arguments.length; f2 < o; f2++) (e2 = arguments[f2]) && (t2 = r$2(e2)) && (n2 && (n2 += " "), n2 += t2);
    return n2;
  }
  function composeClasses(slots, getUtilityClass, classes = void 0) {
    const output = {};
    for (const slotName in slots) {
      const slot = slots[slotName];
      let buffer = "";
      let start = true;
      for (let i = 0; i < slot.length; i += 1) {
        const value = slot[i];
        if (value) {
          buffer += (start === true ? "" : " ") + getUtilityClass(value);
          start = false;
          if (classes && classes[value]) {
            buffer += " " + classes[value];
          }
        }
      }
      output[slotName] = buffer;
    }
    return output;
  }
  function formatMuiErrorMessage(code, ...args) {
    const url = new URL(`https://mui.com/production-error/?code=${code}`);
    args.forEach((arg2) => url.searchParams.append("args[]", arg2));
    return `Minified MUI error #${code}; visit ${url} for the full message.`;
  }
  function clamp(val, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
    return Math.max(min, Math.min(val, max));
  }
  function clampWrapper(value, min = 0, max = 1) {
    return clamp(value, min, max);
  }
  function hexToRgb(color2) {
    color2 = color2.slice(1);
    const re2 = new RegExp(`.{1,${color2.length >= 6 ? 2 : 1}}`, "g");
    let colors = color2.match(re2);
    if (colors && colors[0].length === 1) {
      colors = colors.map((n2) => n2 + n2);
    }
    return colors ? `rgb${colors.length === 4 ? "a" : ""}(${colors.map((n2, index) => {
      return index < 3 ? parseInt(n2, 16) : Math.round(parseInt(n2, 16) / 255 * 1e3) / 1e3;
    }).join(", ")})` : "";
  }
  function decomposeColor(color2) {
    if (color2.type) {
      return color2;
    }
    if (color2.charAt(0) === "#") {
      return decomposeColor(hexToRgb(color2));
    }
    const marker = color2.indexOf("(");
    const type = color2.substring(0, marker);
    if (!["rgb", "rgba", "hsl", "hsla", "color"].includes(type)) {
      throw new Error(formatMuiErrorMessage(9, color2));
    }
    let values2 = color2.substring(marker + 1, color2.length - 1);
    let colorSpace;
    if (type === "color") {
      values2 = values2.split(" ");
      colorSpace = values2.shift();
      if (values2.length === 4 && values2[3].charAt(0) === "/") {
        values2[3] = values2[3].slice(1);
      }
      if (!["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].includes(colorSpace)) {
        throw new Error(formatMuiErrorMessage(10, colorSpace));
      }
    } else {
      values2 = values2.split(",");
    }
    values2 = values2.map((value) => parseFloat(value));
    return {
      type,
      values: values2,
      colorSpace
    };
  }
  const colorChannel = (color2) => {
    const decomposedColor = decomposeColor(color2);
    return decomposedColor.values.slice(0, 3).map((val, idx) => decomposedColor.type.includes("hsl") && idx !== 0 ? `${val}%` : val).join(" ");
  };
  const private_safeColorChannel = (color2, warning) => {
    try {
      return colorChannel(color2);
    } catch (error) {
      if (warning && false) {
        console.warn(warning);
      }
      return color2;
    }
  };
  function recomposeColor(color2) {
    const {
      type,
      colorSpace
    } = color2;
    let {
      values: values2
    } = color2;
    if (type.includes("rgb")) {
      values2 = values2.map((n2, i) => i < 3 ? parseInt(n2, 10) : n2);
    } else if (type.includes("hsl")) {
      values2[1] = `${values2[1]}%`;
      values2[2] = `${values2[2]}%`;
    }
    if (type.includes("color")) {
      values2 = `${colorSpace} ${values2.join(" ")}`;
    } else {
      values2 = `${values2.join(", ")}`;
    }
    return `${type}(${values2})`;
  }
  function hslToRgb(color2) {
    color2 = decomposeColor(color2);
    const {
      values: values2
    } = color2;
    const h2 = values2[0];
    const s = values2[1] / 100;
    const l2 = values2[2] / 100;
    const a = s * Math.min(l2, 1 - l2);
    const f2 = (n2, k2 = (n2 + h2 / 30) % 12) => l2 - a * Math.max(Math.min(k2 - 3, 9 - k2, 1), -1);
    let type = "rgb";
    const rgb = [Math.round(f2(0) * 255), Math.round(f2(8) * 255), Math.round(f2(4) * 255)];
    if (color2.type === "hsla") {
      type += "a";
      rgb.push(values2[3]);
    }
    return recomposeColor({
      type,
      values: rgb
    });
  }
  function getLuminance(color2) {
    color2 = decomposeColor(color2);
    let rgb = color2.type === "hsl" || color2.type === "hsla" ? decomposeColor(hslToRgb(color2)).values : color2.values;
    rgb = rgb.map((val) => {
      if (color2.type !== "color") {
        val /= 255;
      }
      return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
    });
    return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3));
  }
  function getContrastRatio(foreground, background) {
    const lumA = getLuminance(foreground);
    const lumB = getLuminance(background);
    return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
  }
  function alpha(color2, value) {
    color2 = decomposeColor(color2);
    value = clampWrapper(value);
    if (color2.type === "rgb" || color2.type === "hsl") {
      color2.type += "a";
    }
    if (color2.type === "color") {
      color2.values[3] = `/${value}`;
    } else {
      color2.values[3] = value;
    }
    return recomposeColor(color2);
  }
  function private_safeAlpha(color2, value, warning) {
    try {
      return alpha(color2, value);
    } catch (error) {
      return color2;
    }
  }
  function darken(color2, coefficient) {
    color2 = decomposeColor(color2);
    coefficient = clampWrapper(coefficient);
    if (color2.type.includes("hsl")) {
      color2.values[2] *= 1 - coefficient;
    } else if (color2.type.includes("rgb") || color2.type.includes("color")) {
      for (let i = 0; i < 3; i += 1) {
        color2.values[i] *= 1 - coefficient;
      }
    }
    return recomposeColor(color2);
  }
  function private_safeDarken(color2, coefficient, warning) {
    try {
      return darken(color2, coefficient);
    } catch (error) {
      return color2;
    }
  }
  function lighten(color2, coefficient) {
    color2 = decomposeColor(color2);
    coefficient = clampWrapper(coefficient);
    if (color2.type.includes("hsl")) {
      color2.values[2] += (100 - color2.values[2]) * coefficient;
    } else if (color2.type.includes("rgb")) {
      for (let i = 0; i < 3; i += 1) {
        color2.values[i] += (255 - color2.values[i]) * coefficient;
      }
    } else if (color2.type.includes("color")) {
      for (let i = 0; i < 3; i += 1) {
        color2.values[i] += (1 - color2.values[i]) * coefficient;
      }
    }
    return recomposeColor(color2);
  }
  function private_safeLighten(color2, coefficient, warning) {
    try {
      return lighten(color2, coefficient);
    } catch (error) {
      return color2;
    }
  }
  function emphasize(color2, coefficient = 0.15) {
    return getLuminance(color2) > 0.5 ? darken(color2, coefficient) : lighten(color2, coefficient);
  }
  function private_safeEmphasize(color2, coefficient, warning) {
    try {
      return emphasize(color2, coefficient);
    } catch (error) {
      return color2;
    }
  }
  function capitalize(string) {
    if (typeof string !== "string") {
      throw new Error(formatMuiErrorMessage(7));
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  function isPlainObject$2(item) {
    if (typeof item !== "object" || item === null) {
      return false;
    }
    const prototype = Object.getPrototypeOf(item);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in item) && !(Symbol.iterator in item);
  }
  function deepClone(source) {
    if (!isPlainObject$2(source)) {
      return source;
    }
    const output = {};
    Object.keys(source).forEach((key) => {
      output[key] = deepClone(source[key]);
    });
    return output;
  }
  function deepmerge(target, source, options = {
    clone: true
  }) {
    const output = options.clone ? {
      ...target
    } : target;
    if (isPlainObject$2(target) && isPlainObject$2(source)) {
      Object.keys(source).forEach((key) => {
        if (isPlainObject$2(source[key]) && // Avoid prototype pollution
        Object.prototype.hasOwnProperty.call(target, key) && isPlainObject$2(target[key])) {
          output[key] = deepmerge(target[key], source[key], options);
        } else if (options.clone) {
          output[key] = isPlainObject$2(source[key]) ? deepClone(source[key]) : source[key];
        } else {
          output[key] = source[key];
        }
      });
    }
    return output;
  }
  function merge(acc, item) {
    if (!item) {
      return acc;
    }
    return deepmerge(acc, item, {
      clone: false
      // No need to clone deep, it's way faster.
    });
  }
  function sortContainerQueries(theme, css2) {
    if (!theme.containerQueries) {
      return css2;
    }
    const sorted = Object.keys(css2).filter((key) => key.startsWith("@container")).sort((a, b2) => {
      var _a, _b;
      const regex = /min-width:\s*([0-9.]+)/;
      return +(((_a = a.match(regex)) == null ? void 0 : _a[1]) || 0) - +(((_b = b2.match(regex)) == null ? void 0 : _b[1]) || 0);
    });
    if (!sorted.length) {
      return css2;
    }
    return sorted.reduce((acc, key) => {
      const value = css2[key];
      delete acc[key];
      acc[key] = value;
      return acc;
    }, {
      ...css2
    });
  }
  function isCqShorthand(breakpointKeys, value) {
    return value === "@" || value.startsWith("@") && (breakpointKeys.some((key) => value.startsWith(`@${key}`)) || !!value.match(/^@\d/));
  }
  function getContainerQuery(theme, shorthand) {
    const matches = shorthand.match(/^@([^/]+)?\/?(.+)?$/);
    if (!matches) {
      return null;
    }
    const [, containerQuery, containerName] = matches;
    const value = Number.isNaN(+containerQuery) ? containerQuery || 0 : +containerQuery;
    return theme.containerQueries(containerName).up(value);
  }
  function cssContainerQueries(themeInput) {
    const toContainerQuery = (mediaQuery, name) => mediaQuery.replace("@media", name ? `@container ${name}` : "@container");
    function attachCq(node22, name) {
      node22.up = (...args) => toContainerQuery(themeInput.breakpoints.up(...args), name);
      node22.down = (...args) => toContainerQuery(themeInput.breakpoints.down(...args), name);
      node22.between = (...args) => toContainerQuery(themeInput.breakpoints.between(...args), name);
      node22.only = (...args) => toContainerQuery(themeInput.breakpoints.only(...args), name);
      node22.not = (...args) => {
        const result = toContainerQuery(themeInput.breakpoints.not(...args), name);
        if (result.includes("not all and")) {
          return result.replace("not all and ", "").replace("min-width:", "width<").replace("max-width:", "width>").replace("and", "or");
        }
        return result;
      };
    }
    const node2 = {};
    const containerQueries = (name) => {
      attachCq(node2, name);
      return node2;
    };
    attachCq(containerQueries);
    return {
      ...themeInput,
      containerQueries
    };
  }
  const values$1 = {
    xs: 0,
    // phone
    sm: 600,
    // tablet
    md: 900,
    // small laptop
    lg: 1200,
    // desktop
    xl: 1536
    // large screen
  };
  const defaultBreakpoints = {
    // Sorted ASC by size. That's important.
    // It can't be configured as it's used statically for propTypes.
    keys: ["xs", "sm", "md", "lg", "xl"],
    up: (key) => `@media (min-width:${values$1[key]}px)`
  };
  const defaultContainerQueries = {
    containerQueries: (containerName) => ({
      up: (key) => {
        let result = typeof key === "number" ? key : values$1[key] || key;
        if (typeof result === "number") {
          result = `${result}px`;
        }
        return containerName ? `@container ${containerName} (min-width:${result})` : `@container (min-width:${result})`;
      }
    })
  };
  function handleBreakpoints(props, propValue, styleFromPropValue) {
    const theme = props.theme || {};
    if (Array.isArray(propValue)) {
      const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
      return propValue.reduce((acc, item, index) => {
        acc[themeBreakpoints.up(themeBreakpoints.keys[index])] = styleFromPropValue(propValue[index]);
        return acc;
      }, {});
    }
    if (typeof propValue === "object") {
      const themeBreakpoints = theme.breakpoints || defaultBreakpoints;
      return Object.keys(propValue).reduce((acc, breakpoint) => {
        if (isCqShorthand(themeBreakpoints.keys, breakpoint)) {
          const containerKey = getContainerQuery(theme.containerQueries ? theme : defaultContainerQueries, breakpoint);
          if (containerKey) {
            acc[containerKey] = styleFromPropValue(propValue[breakpoint], breakpoint);
          }
        } else if (Object.keys(themeBreakpoints.values || values$1).includes(breakpoint)) {
          const mediaKey = themeBreakpoints.up(breakpoint);
          acc[mediaKey] = styleFromPropValue(propValue[breakpoint], breakpoint);
        } else {
          const cssKey = breakpoint;
          acc[cssKey] = propValue[cssKey];
        }
        return acc;
      }, {});
    }
    const output = styleFromPropValue(propValue);
    return output;
  }
  function createEmptyBreakpointObject(breakpointsInput = {}) {
    var _a;
    const breakpointsInOrder = (_a = breakpointsInput.keys) == null ? void 0 : _a.reduce((acc, key) => {
      const breakpointStyleKey = breakpointsInput.up(key);
      acc[breakpointStyleKey] = {};
      return acc;
    }, {});
    return breakpointsInOrder || {};
  }
  function removeUnusedBreakpoints(breakpointKeys, style2) {
    return breakpointKeys.reduce((acc, key) => {
      const breakpointOutput = acc[key];
      const isBreakpointUnused = !breakpointOutput || Object.keys(breakpointOutput).length === 0;
      if (isBreakpointUnused) {
        delete acc[key];
      }
      return acc;
    }, style2);
  }
  function getPath(obj, path, checkVars = true) {
    if (!path || typeof path !== "string") {
      return null;
    }
    if (obj && obj.vars && checkVars) {
      const val = `vars.${path}`.split(".").reduce((acc, item) => acc && acc[item] ? acc[item] : null, obj);
      if (val != null) {
        return val;
      }
    }
    return path.split(".").reduce((acc, item) => {
      if (acc && acc[item] != null) {
        return acc[item];
      }
      return null;
    }, obj);
  }
  function getStyleValue(themeMapping, transform, propValueFinal, userValue = propValueFinal) {
    let value;
    if (typeof themeMapping === "function") {
      value = themeMapping(propValueFinal);
    } else if (Array.isArray(themeMapping)) {
      value = themeMapping[propValueFinal] || userValue;
    } else {
      value = getPath(themeMapping, propValueFinal) || userValue;
    }
    if (transform) {
      value = transform(value, userValue, themeMapping);
    }
    return value;
  }
  function style$1(options) {
    const {
      prop,
      cssProperty = options.prop,
      themeKey,
      transform
    } = options;
    const fn = (props) => {
      if (props[prop] == null) {
        return null;
      }
      const propValue = props[prop];
      const theme = props.theme;
      const themeMapping = getPath(theme, themeKey) || {};
      const styleFromPropValue = (propValueFinal) => {
        let value = getStyleValue(themeMapping, transform, propValueFinal);
        if (propValueFinal === value && typeof propValueFinal === "string") {
          value = getStyleValue(themeMapping, transform, `${prop}${propValueFinal === "default" ? "" : capitalize(propValueFinal)}`, propValueFinal);
        }
        if (cssProperty === false) {
          return value;
        }
        return {
          [cssProperty]: value
        };
      };
      return handleBreakpoints(props, propValue, styleFromPropValue);
    };
    fn.propTypes = {};
    fn.filterProps = [prop];
    return fn;
  }
  function memoize$1(fn) {
    const cache = {};
    return (arg2) => {
      if (cache[arg2] === void 0) {
        cache[arg2] = fn(arg2);
      }
      return cache[arg2];
    };
  }
  const properties = {
    m: "margin",
    p: "padding"
  };
  const directions = {
    t: "Top",
    r: "Right",
    b: "Bottom",
    l: "Left",
    x: ["Left", "Right"],
    y: ["Top", "Bottom"]
  };
  const aliases = {
    marginX: "mx",
    marginY: "my",
    paddingX: "px",
    paddingY: "py"
  };
  const getCssProperties = memoize$1((prop) => {
    if (prop.length > 2) {
      if (aliases[prop]) {
        prop = aliases[prop];
      } else {
        return [prop];
      }
    }
    const [a, b2] = prop.split("");
    const property = properties[a];
    const direction = directions[b2] || "";
    return Array.isArray(direction) ? direction.map((dir) => property + dir) : [property + direction];
  });
  const marginKeys = ["m", "mt", "mr", "mb", "ml", "mx", "my", "margin", "marginTop", "marginRight", "marginBottom", "marginLeft", "marginX", "marginY", "marginInline", "marginInlineStart", "marginInlineEnd", "marginBlock", "marginBlockStart", "marginBlockEnd"];
  const paddingKeys = ["p", "pt", "pr", "pb", "pl", "px", "py", "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "paddingX", "paddingY", "paddingInline", "paddingInlineStart", "paddingInlineEnd", "paddingBlock", "paddingBlockStart", "paddingBlockEnd"];
  [...marginKeys, ...paddingKeys];
  function createUnaryUnit(theme, themeKey, defaultValue, propName) {
    const themeSpacing = getPath(theme, themeKey, true) ?? defaultValue;
    if (typeof themeSpacing === "number" || typeof themeSpacing === "string") {
      return (val) => {
        if (typeof val === "string") {
          return val;
        }
        if (typeof themeSpacing === "string") {
          return `calc(${val} * ${themeSpacing})`;
        }
        return themeSpacing * val;
      };
    }
    if (Array.isArray(themeSpacing)) {
      return (val) => {
        if (typeof val === "string") {
          return val;
        }
        const abs2 = Math.abs(val);
        const transformed = themeSpacing[abs2];
        if (val >= 0) {
          return transformed;
        }
        if (typeof transformed === "number") {
          return -transformed;
        }
        return `-${transformed}`;
      };
    }
    if (typeof themeSpacing === "function") {
      return themeSpacing;
    }
    return () => void 0;
  }
  function createUnarySpacing(theme) {
    return createUnaryUnit(theme, "spacing", 8);
  }
  function getValue(transformer, propValue) {
    if (typeof propValue === "string" || propValue == null) {
      return propValue;
    }
    return transformer(propValue);
  }
  function getStyleFromPropValue(cssProperties, transformer) {
    return (propValue) => cssProperties.reduce((acc, cssProperty) => {
      acc[cssProperty] = getValue(transformer, propValue);
      return acc;
    }, {});
  }
  function resolveCssProperty(props, keys, prop, transformer) {
    if (!keys.includes(prop)) {
      return null;
    }
    const cssProperties = getCssProperties(prop);
    const styleFromPropValue = getStyleFromPropValue(cssProperties, transformer);
    const propValue = props[prop];
    return handleBreakpoints(props, propValue, styleFromPropValue);
  }
  function style(props, keys) {
    const transformer = createUnarySpacing(props.theme);
    return Object.keys(props).map((prop) => resolveCssProperty(props, keys, prop, transformer)).reduce(merge, {});
  }
  function margin(props) {
    return style(props, marginKeys);
  }
  margin.propTypes = {};
  margin.filterProps = marginKeys;
  function padding(props) {
    return style(props, paddingKeys);
  }
  padding.propTypes = {};
  padding.filterProps = paddingKeys;
  function compose$1(...styles2) {
    const handlers = styles2.reduce((acc, style2) => {
      style2.filterProps.forEach((prop) => {
        acc[prop] = style2;
      });
      return acc;
    }, {});
    const fn = (props) => {
      return Object.keys(props).reduce((acc, prop) => {
        if (handlers[prop]) {
          return merge(acc, handlers[prop](props));
        }
        return acc;
      }, {});
    };
    fn.propTypes = {};
    fn.filterProps = styles2.reduce((acc, style2) => acc.concat(style2.filterProps), []);
    return fn;
  }
  function borderTransform(value) {
    if (typeof value !== "number") {
      return value;
    }
    return `${value}px solid`;
  }
  function createBorderStyle(prop, transform) {
    return style$1({
      prop,
      themeKey: "borders",
      transform
    });
  }
  const border = createBorderStyle("border", borderTransform);
  const borderTop = createBorderStyle("borderTop", borderTransform);
  const borderRight = createBorderStyle("borderRight", borderTransform);
  const borderBottom = createBorderStyle("borderBottom", borderTransform);
  const borderLeft = createBorderStyle("borderLeft", borderTransform);
  const borderColor = createBorderStyle("borderColor");
  const borderTopColor = createBorderStyle("borderTopColor");
  const borderRightColor = createBorderStyle("borderRightColor");
  const borderBottomColor = createBorderStyle("borderBottomColor");
  const borderLeftColor = createBorderStyle("borderLeftColor");
  const outline = createBorderStyle("outline", borderTransform);
  const outlineColor = createBorderStyle("outlineColor");
  const borderRadius = (props) => {
    if (props.borderRadius !== void 0 && props.borderRadius !== null) {
      const transformer = createUnaryUnit(props.theme, "shape.borderRadius", 4);
      const styleFromPropValue = (propValue) => ({
        borderRadius: getValue(transformer, propValue)
      });
      return handleBreakpoints(props, props.borderRadius, styleFromPropValue);
    }
    return null;
  };
  borderRadius.propTypes = {};
  borderRadius.filterProps = ["borderRadius"];
  compose$1(border, borderTop, borderRight, borderBottom, borderLeft, borderColor, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderRadius, outline, outlineColor);
  const gap = (props) => {
    if (props.gap !== void 0 && props.gap !== null) {
      const transformer = createUnaryUnit(props.theme, "spacing", 8);
      const styleFromPropValue = (propValue) => ({
        gap: getValue(transformer, propValue)
      });
      return handleBreakpoints(props, props.gap, styleFromPropValue);
    }
    return null;
  };
  gap.propTypes = {};
  gap.filterProps = ["gap"];
  const columnGap = (props) => {
    if (props.columnGap !== void 0 && props.columnGap !== null) {
      const transformer = createUnaryUnit(props.theme, "spacing", 8);
      const styleFromPropValue = (propValue) => ({
        columnGap: getValue(transformer, propValue)
      });
      return handleBreakpoints(props, props.columnGap, styleFromPropValue);
    }
    return null;
  };
  columnGap.propTypes = {};
  columnGap.filterProps = ["columnGap"];
  const rowGap = (props) => {
    if (props.rowGap !== void 0 && props.rowGap !== null) {
      const transformer = createUnaryUnit(props.theme, "spacing", 8);
      const styleFromPropValue = (propValue) => ({
        rowGap: getValue(transformer, propValue)
      });
      return handleBreakpoints(props, props.rowGap, styleFromPropValue);
    }
    return null;
  };
  rowGap.propTypes = {};
  rowGap.filterProps = ["rowGap"];
  const gridColumn = style$1({
    prop: "gridColumn"
  });
  const gridRow = style$1({
    prop: "gridRow"
  });
  const gridAutoFlow = style$1({
    prop: "gridAutoFlow"
  });
  const gridAutoColumns = style$1({
    prop: "gridAutoColumns"
  });
  const gridAutoRows = style$1({
    prop: "gridAutoRows"
  });
  const gridTemplateColumns = style$1({
    prop: "gridTemplateColumns"
  });
  const gridTemplateRows = style$1({
    prop: "gridTemplateRows"
  });
  const gridTemplateAreas = style$1({
    prop: "gridTemplateAreas"
  });
  const gridArea = style$1({
    prop: "gridArea"
  });
  compose$1(gap, columnGap, rowGap, gridColumn, gridRow, gridAutoFlow, gridAutoColumns, gridAutoRows, gridTemplateColumns, gridTemplateRows, gridTemplateAreas, gridArea);
  function paletteTransform(value, userValue) {
    if (userValue === "grey") {
      return userValue;
    }
    return value;
  }
  const color = style$1({
    prop: "color",
    themeKey: "palette",
    transform: paletteTransform
  });
  const bgcolor = style$1({
    prop: "bgcolor",
    cssProperty: "backgroundColor",
    themeKey: "palette",
    transform: paletteTransform
  });
  const backgroundColor = style$1({
    prop: "backgroundColor",
    themeKey: "palette",
    transform: paletteTransform
  });
  compose$1(color, bgcolor, backgroundColor);
  function sizingTransform(value) {
    return value <= 1 && value !== 0 ? `${value * 100}%` : value;
  }
  const width = style$1({
    prop: "width",
    transform: sizingTransform
  });
  const maxWidth = (props) => {
    if (props.maxWidth !== void 0 && props.maxWidth !== null) {
      const styleFromPropValue = (propValue) => {
        var _a, _b, _c, _d, _e;
        const breakpoint = ((_c = (_b = (_a = props.theme) == null ? void 0 : _a.breakpoints) == null ? void 0 : _b.values) == null ? void 0 : _c[propValue]) || values$1[propValue];
        if (!breakpoint) {
          return {
            maxWidth: sizingTransform(propValue)
          };
        }
        if (((_e = (_d = props.theme) == null ? void 0 : _d.breakpoints) == null ? void 0 : _e.unit) !== "px") {
          return {
            maxWidth: `${breakpoint}${props.theme.breakpoints.unit}`
          };
        }
        return {
          maxWidth: breakpoint
        };
      };
      return handleBreakpoints(props, props.maxWidth, styleFromPropValue);
    }
    return null;
  };
  maxWidth.filterProps = ["maxWidth"];
  const minWidth = style$1({
    prop: "minWidth",
    transform: sizingTransform
  });
  const height = style$1({
    prop: "height",
    transform: sizingTransform
  });
  const maxHeight = style$1({
    prop: "maxHeight",
    transform: sizingTransform
  });
  const minHeight = style$1({
    prop: "minHeight",
    transform: sizingTransform
  });
  style$1({
    prop: "size",
    cssProperty: "width",
    transform: sizingTransform
  });
  style$1({
    prop: "size",
    cssProperty: "height",
    transform: sizingTransform
  });
  const boxSizing = style$1({
    prop: "boxSizing"
  });
  compose$1(width, maxWidth, minWidth, height, maxHeight, minHeight, boxSizing);
  const defaultSxConfig = {
    // borders
    border: {
      themeKey: "borders",
      transform: borderTransform
    },
    borderTop: {
      themeKey: "borders",
      transform: borderTransform
    },
    borderRight: {
      themeKey: "borders",
      transform: borderTransform
    },
    borderBottom: {
      themeKey: "borders",
      transform: borderTransform
    },
    borderLeft: {
      themeKey: "borders",
      transform: borderTransform
    },
    borderColor: {
      themeKey: "palette"
    },
    borderTopColor: {
      themeKey: "palette"
    },
    borderRightColor: {
      themeKey: "palette"
    },
    borderBottomColor: {
      themeKey: "palette"
    },
    borderLeftColor: {
      themeKey: "palette"
    },
    outline: {
      themeKey: "borders",
      transform: borderTransform
    },
    outlineColor: {
      themeKey: "palette"
    },
    borderRadius: {
      themeKey: "shape.borderRadius",
      style: borderRadius
    },
    // palette
    color: {
      themeKey: "palette",
      transform: paletteTransform
    },
    bgcolor: {
      themeKey: "palette",
      cssProperty: "backgroundColor",
      transform: paletteTransform
    },
    backgroundColor: {
      themeKey: "palette",
      transform: paletteTransform
    },
    // spacing
    p: {
      style: padding
    },
    pt: {
      style: padding
    },
    pr: {
      style: padding
    },
    pb: {
      style: padding
    },
    pl: {
      style: padding
    },
    px: {
      style: padding
    },
    py: {
      style: padding
    },
    padding: {
      style: padding
    },
    paddingTop: {
      style: padding
    },
    paddingRight: {
      style: padding
    },
    paddingBottom: {
      style: padding
    },
    paddingLeft: {
      style: padding
    },
    paddingX: {
      style: padding
    },
    paddingY: {
      style: padding
    },
    paddingInline: {
      style: padding
    },
    paddingInlineStart: {
      style: padding
    },
    paddingInlineEnd: {
      style: padding
    },
    paddingBlock: {
      style: padding
    },
    paddingBlockStart: {
      style: padding
    },
    paddingBlockEnd: {
      style: padding
    },
    m: {
      style: margin
    },
    mt: {
      style: margin
    },
    mr: {
      style: margin
    },
    mb: {
      style: margin
    },
    ml: {
      style: margin
    },
    mx: {
      style: margin
    },
    my: {
      style: margin
    },
    margin: {
      style: margin
    },
    marginTop: {
      style: margin
    },
    marginRight: {
      style: margin
    },
    marginBottom: {
      style: margin
    },
    marginLeft: {
      style: margin
    },
    marginX: {
      style: margin
    },
    marginY: {
      style: margin
    },
    marginInline: {
      style: margin
    },
    marginInlineStart: {
      style: margin
    },
    marginInlineEnd: {
      style: margin
    },
    marginBlock: {
      style: margin
    },
    marginBlockStart: {
      style: margin
    },
    marginBlockEnd: {
      style: margin
    },
    // display
    displayPrint: {
      cssProperty: false,
      transform: (value) => ({
        "@media print": {
          display: value
        }
      })
    },
    display: {},
    overflow: {},
    textOverflow: {},
    visibility: {},
    whiteSpace: {},
    // flexbox
    flexBasis: {},
    flexDirection: {},
    flexWrap: {},
    justifyContent: {},
    alignItems: {},
    alignContent: {},
    order: {},
    flex: {},
    flexGrow: {},
    flexShrink: {},
    alignSelf: {},
    justifyItems: {},
    justifySelf: {},
    // grid
    gap: {
      style: gap
    },
    rowGap: {
      style: rowGap
    },
    columnGap: {
      style: columnGap
    },
    gridColumn: {},
    gridRow: {},
    gridAutoFlow: {},
    gridAutoColumns: {},
    gridAutoRows: {},
    gridTemplateColumns: {},
    gridTemplateRows: {},
    gridTemplateAreas: {},
    gridArea: {},
    // positions
    position: {},
    zIndex: {
      themeKey: "zIndex"
    },
    top: {},
    right: {},
    bottom: {},
    left: {},
    // shadows
    boxShadow: {
      themeKey: "shadows"
    },
    // sizing
    width: {
      transform: sizingTransform
    },
    maxWidth: {
      style: maxWidth
    },
    minWidth: {
      transform: sizingTransform
    },
    height: {
      transform: sizingTransform
    },
    maxHeight: {
      transform: sizingTransform
    },
    minHeight: {
      transform: sizingTransform
    },
    boxSizing: {},
    // typography
    font: {
      themeKey: "font"
    },
    fontFamily: {
      themeKey: "typography"
    },
    fontSize: {
      themeKey: "typography"
    },
    fontStyle: {
      themeKey: "typography"
    },
    fontWeight: {
      themeKey: "typography"
    },
    letterSpacing: {},
    textTransform: {},
    lineHeight: {},
    textAlign: {},
    typography: {
      cssProperty: false,
      themeKey: "typography"
    }
  };
  function objectsHaveSameKeys(...objects) {
    const allKeys = objects.reduce((keys, object) => keys.concat(Object.keys(object)), []);
    const union = new Set(allKeys);
    return objects.every((object) => union.size === Object.keys(object).length);
  }
  function callIfFn(maybeFn, arg2) {
    return typeof maybeFn === "function" ? maybeFn(arg2) : maybeFn;
  }
  function unstable_createStyleFunctionSx() {
    function getThemeValue(prop, val, theme, config2) {
      const props = {
        [prop]: val,
        theme
      };
      const options = config2[prop];
      if (!options) {
        return {
          [prop]: val
        };
      }
      const {
        cssProperty = prop,
        themeKey,
        transform,
        style: style2
      } = options;
      if (val == null) {
        return null;
      }
      if (themeKey === "typography" && val === "inherit") {
        return {
          [prop]: val
        };
      }
      const themeMapping = getPath(theme, themeKey) || {};
      if (style2) {
        return style2(props);
      }
      const styleFromPropValue = (propValueFinal) => {
        let value = getStyleValue(themeMapping, transform, propValueFinal);
        if (propValueFinal === value && typeof propValueFinal === "string") {
          value = getStyleValue(themeMapping, transform, `${prop}${propValueFinal === "default" ? "" : capitalize(propValueFinal)}`, propValueFinal);
        }
        if (cssProperty === false) {
          return value;
        }
        return {
          [cssProperty]: value
        };
      };
      return handleBreakpoints(props, val, styleFromPropValue);
    }
    function styleFunctionSx2(props) {
      const {
        sx,
        theme = {}
      } = props || {};
      if (!sx) {
        return null;
      }
      const config2 = theme.unstable_sxConfig ?? defaultSxConfig;
      function traverse(sxInput) {
        let sxObject = sxInput;
        if (typeof sxInput === "function") {
          sxObject = sxInput(theme);
        } else if (typeof sxInput !== "object") {
          return sxInput;
        }
        if (!sxObject) {
          return null;
        }
        const emptyBreakpoints = createEmptyBreakpointObject(theme.breakpoints);
        const breakpointsKeys = Object.keys(emptyBreakpoints);
        let css2 = emptyBreakpoints;
        Object.keys(sxObject).forEach((styleKey) => {
          const value = callIfFn(sxObject[styleKey], theme);
          if (value !== null && value !== void 0) {
            if (typeof value === "object") {
              if (config2[styleKey]) {
                css2 = merge(css2, getThemeValue(styleKey, value, theme, config2));
              } else {
                const breakpointsValues = handleBreakpoints({
                  theme
                }, value, (x2) => ({
                  [styleKey]: x2
                }));
                if (objectsHaveSameKeys(breakpointsValues, value)) {
                  css2[styleKey] = styleFunctionSx2({
                    sx: value,
                    theme
                  });
                } else {
                  css2 = merge(css2, breakpointsValues);
                }
              }
            } else {
              css2 = merge(css2, getThemeValue(styleKey, value, theme, config2));
            }
          }
        });
        return sortContainerQueries(theme, removeUnusedBreakpoints(breakpointsKeys, css2));
      }
      return Array.isArray(sx) ? sx.map(traverse) : traverse(sx);
    }
    return styleFunctionSx2;
  }
  const styleFunctionSx = unstable_createStyleFunctionSx();
  styleFunctionSx.filterProps = ["sx"];
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function(n2) {
      for (var e2 = 1; e2 < arguments.length; e2++) {
        var t2 = arguments[e2];
        for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
      }
      return n2;
    }, _extends.apply(null, arguments);
  }
  function memoize(fn) {
    var cache = /* @__PURE__ */ Object.create(null);
    return function(arg2) {
      if (cache[arg2] === void 0) cache[arg2] = fn(arg2);
      return cache[arg2];
    };
  }
  var reactPropsRegex = /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/;
  var isPropValid = /* @__PURE__ */ memoize(
    function(prop) {
      return reactPropsRegex.test(prop) || prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110 && prop.charCodeAt(2) < 91;
    }
    /* Z+1 */
  );
  var isDevelopment$2 = false;
  function sheetForTag(tag) {
    if (tag.sheet) {
      return tag.sheet;
    }
    for (var i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].ownerNode === tag) {
        return document.styleSheets[i];
      }
    }
    return void 0;
  }
  function createStyleElement(options) {
    var tag = document.createElement("style");
    tag.setAttribute("data-emotion", options.key);
    if (options.nonce !== void 0) {
      tag.setAttribute("nonce", options.nonce);
    }
    tag.appendChild(document.createTextNode(""));
    tag.setAttribute("data-s", "");
    return tag;
  }
  var StyleSheet = /* @__PURE__ */ function() {
    function StyleSheet2(options) {
      var _this = this;
      this._insertTag = function(tag) {
        var before;
        if (_this.tags.length === 0) {
          if (_this.insertionPoint) {
            before = _this.insertionPoint.nextSibling;
          } else if (_this.prepend) {
            before = _this.container.firstChild;
          } else {
            before = _this.before;
          }
        } else {
          before = _this.tags[_this.tags.length - 1].nextSibling;
        }
        _this.container.insertBefore(tag, before);
        _this.tags.push(tag);
      };
      this.isSpeedy = options.speedy === void 0 ? !isDevelopment$2 : options.speedy;
      this.tags = [];
      this.ctr = 0;
      this.nonce = options.nonce;
      this.key = options.key;
      this.container = options.container;
      this.prepend = options.prepend;
      this.insertionPoint = options.insertionPoint;
      this.before = null;
    }
    var _proto = StyleSheet2.prototype;
    _proto.hydrate = function hydrate(nodes) {
      nodes.forEach(this._insertTag);
    };
    _proto.insert = function insert(rule) {
      if (this.ctr % (this.isSpeedy ? 65e3 : 1) === 0) {
        this._insertTag(createStyleElement(this));
      }
      var tag = this.tags[this.tags.length - 1];
      if (this.isSpeedy) {
        var sheet = sheetForTag(tag);
        try {
          sheet.insertRule(rule, sheet.cssRules.length);
        } catch (e2) {
        }
      } else {
        tag.appendChild(document.createTextNode(rule));
      }
      this.ctr++;
    };
    _proto.flush = function flush() {
      this.tags.forEach(function(tag) {
        var _tag$parentNode;
        return (_tag$parentNode = tag.parentNode) == null ? void 0 : _tag$parentNode.removeChild(tag);
      });
      this.tags = [];
      this.ctr = 0;
    };
    return StyleSheet2;
  }();
  var MS = "-ms-";
  var MOZ = "-moz-";
  var WEBKIT = "-webkit-";
  var COMMENT = "comm";
  var RULESET = "rule";
  var DECLARATION = "decl";
  var IMPORT = "@import";
  var KEYFRAMES = "@keyframes";
  var LAYER = "@layer";
  var abs = Math.abs;
  var from = String.fromCharCode;
  var assign = Object.assign;
  function hash(value, length2) {
    return charat(value, 0) ^ 45 ? (((length2 << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
  }
  function trim(value) {
    return value.trim();
  }
  function match(value, pattern) {
    return (value = pattern.exec(value)) ? value[0] : value;
  }
  function replace(value, pattern, replacement) {
    return value.replace(pattern, replacement);
  }
  function indexof(value, search) {
    return value.indexOf(search);
  }
  function charat(value, index) {
    return value.charCodeAt(index) | 0;
  }
  function substr(value, begin, end) {
    return value.slice(begin, end);
  }
  function strlen(value) {
    return value.length;
  }
  function sizeof(value) {
    return value.length;
  }
  function append(value, array) {
    return array.push(value), value;
  }
  function combine(array, callback) {
    return array.map(callback).join("");
  }
  var line = 1;
  var column = 1;
  var length = 0;
  var position = 0;
  var character = 0;
  var characters = "";
  function node(value, root, parent, type, props, children, length2) {
    return { value, root, parent, type, props, children, line, column, length: length2, return: "" };
  }
  function copy(root, props) {
    return assign(node("", null, null, "", null, null, 0), root, { length: -root.length }, props);
  }
  function char() {
    return character;
  }
  function prev() {
    character = position > 0 ? charat(characters, --position) : 0;
    if (column--, character === 10)
      column = 1, line--;
    return character;
  }
  function next() {
    character = position < length ? charat(characters, position++) : 0;
    if (column++, character === 10)
      column = 1, line++;
    return character;
  }
  function peek$1() {
    return charat(characters, position);
  }
  function caret() {
    return position;
  }
  function slice(begin, end) {
    return substr(characters, begin, end);
  }
  function token(type) {
    switch (type) {
      case 0:
      case 9:
      case 10:
      case 13:
      case 32:
        return 5;
      case 33:
      case 43:
      case 44:
      case 47:
      case 62:
      case 64:
      case 126:
      case 59:
      case 123:
      case 125:
        return 4;
      case 58:
        return 3;
      case 34:
      case 39:
      case 40:
      case 91:
        return 2;
      case 41:
      case 93:
        return 1;
    }
    return 0;
  }
  function alloc(value) {
    return line = column = 1, length = strlen(characters = value), position = 0, [];
  }
  function dealloc(value) {
    return characters = "", value;
  }
  function delimit(type) {
    return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
  }
  function whitespace(type) {
    while (character = peek$1())
      if (character < 33)
        next();
      else
        break;
    return token(type) > 2 || token(character) > 3 ? "" : " ";
  }
  function escaping(index, count) {
    while (--count && next())
      if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
        break;
    return slice(index, caret() + (count < 6 && peek$1() == 32 && next() == 32));
  }
  function delimiter(type) {
    while (next())
      switch (character) {
        case type:
          return position;
        case 34:
        case 39:
          if (type !== 34 && type !== 39)
            delimiter(character);
          break;
        case 40:
          if (type === 41)
            delimiter(type);
          break;
        case 92:
          next();
          break;
      }
    return position;
  }
  function commenter(type, index) {
    while (next())
      if (type + character === 47 + 10)
        break;
      else if (type + character === 42 + 42 && peek$1() === 47)
        break;
    return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
  }
  function identifier(index) {
    while (!token(peek$1()))
      next();
    return slice(index, position);
  }
  function compile(value) {
    return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
  }
  function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
    var index = 0;
    var offset = 0;
    var length2 = pseudo;
    var atrule = 0;
    var property = 0;
    var previous = 0;
    var variable = 1;
    var scanning = 1;
    var ampersand = 1;
    var character2 = 0;
    var type = "";
    var props = rules;
    var children = rulesets;
    var reference = rule;
    var characters2 = type;
    while (scanning)
      switch (previous = character2, character2 = next()) {
        case 40:
          if (previous != 108 && charat(characters2, length2 - 1) == 58) {
            if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f") != -1)
              ampersand = -1;
            break;
          }
        case 34:
        case 39:
        case 91:
          characters2 += delimit(character2);
          break;
        case 9:
        case 10:
        case 13:
        case 32:
          characters2 += whitespace(previous);
          break;
        case 92:
          characters2 += escaping(caret() - 1, 7);
          continue;
        case 47:
          switch (peek$1()) {
            case 42:
            case 47:
              append(comment(commenter(next(), caret()), root, parent), declarations);
              break;
            default:
              characters2 += "/";
          }
          break;
        case 123 * variable:
          points[index++] = strlen(characters2) * ampersand;
        case 125 * variable:
        case 59:
        case 0:
          switch (character2) {
            case 0:
            case 125:
              scanning = 0;
            case 59 + offset:
              if (ampersand == -1) characters2 = replace(characters2, /\f/g, "");
              if (property > 0 && strlen(characters2) - length2)
                append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2), declarations);
              break;
            case 59:
              characters2 += ";";
            default:
              append(reference = ruleset(characters2, root, parent, index, offset, rules, points, type, props = [], children = [], length2), rulesets);
              if (character2 === 123)
                if (offset === 0)
                  parse(characters2, root, reference, reference, props, rulesets, length2, points, children);
                else
                  switch (atrule === 99 && charat(characters2, 3) === 110 ? 100 : atrule) {
                    case 100:
                    case 108:
                    case 109:
                    case 115:
                      parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2), children), rules, children, length2, points, rule ? props : children);
                      break;
                    default:
                      parse(characters2, reference, reference, reference, [""], children, 0, points, children);
                  }
          }
          index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
          break;
        case 58:
          length2 = 1 + strlen(characters2), property = previous;
        default:
          if (variable < 1) {
            if (character2 == 123)
              --variable;
            else if (character2 == 125 && variable++ == 0 && prev() == 125)
              continue;
          }
          switch (characters2 += from(character2), character2 * variable) {
            case 38:
              ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
              break;
            case 44:
              points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
              break;
            case 64:
              if (peek$1() === 45)
                characters2 += delimit(next());
              atrule = peek$1(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
              break;
            case 45:
              if (previous === 45 && strlen(characters2) == 2)
                variable = 0;
          }
      }
    return rulesets;
  }
  function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length2) {
    var post = offset - 1;
    var rule = offset === 0 ? rules : [""];
    var size = sizeof(rule);
    for (var i = 0, j = 0, k2 = 0; i < index; ++i)
      for (var x2 = 0, y2 = substr(value, post + 1, post = abs(j = points[i])), z2 = value; x2 < size; ++x2)
        if (z2 = trim(j > 0 ? rule[x2] + " " + y2 : replace(y2, /&\f/g, rule[x2])))
          props[k2++] = z2;
    return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length2);
  }
  function comment(value, root, parent) {
    return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0);
  }
  function declaration(value, root, parent, length2) {
    return node(value, root, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2);
  }
  function serialize(children, callback) {
    var output = "";
    var length2 = sizeof(children);
    for (var i = 0; i < length2; i++)
      output += callback(children[i], i, children, callback) || "";
    return output;
  }
  function stringify(element, index, children, callback) {
    switch (element.type) {
      case LAYER:
        if (element.children.length) break;
      case IMPORT:
      case DECLARATION:
        return element.return = element.return || element.value;
      case COMMENT:
        return "";
      case KEYFRAMES:
        return element.return = element.value + "{" + serialize(element.children, callback) + "}";
      case RULESET:
        element.value = element.props.join(",");
    }
    return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
  }
  function middleware(collection) {
    var length2 = sizeof(collection);
    return function(element, index, children, callback) {
      var output = "";
      for (var i = 0; i < length2; i++)
        output += collection[i](element, index, children, callback) || "";
      return output;
    };
  }
  function rulesheet(callback) {
    return function(element) {
      if (!element.root) {
        if (element = element.return)
          callback(element);
      }
    };
  }
  var identifierWithPointTracking = function identifierWithPointTracking2(begin, points, index) {
    var previous = 0;
    var character2 = 0;
    while (true) {
      previous = character2;
      character2 = peek$1();
      if (previous === 38 && character2 === 12) {
        points[index] = 1;
      }
      if (token(character2)) {
        break;
      }
      next();
    }
    return slice(begin, position);
  };
  var toRules = function toRules2(parsed, points) {
    var index = -1;
    var character2 = 44;
    do {
      switch (token(character2)) {
        case 0:
          if (character2 === 38 && peek$1() === 12) {
            points[index] = 1;
          }
          parsed[index] += identifierWithPointTracking(position - 1, points, index);
          break;
        case 2:
          parsed[index] += delimit(character2);
          break;
        case 4:
          if (character2 === 44) {
            parsed[++index] = peek$1() === 58 ? "&\f" : "";
            points[index] = parsed[index].length;
            break;
          }
        default:
          parsed[index] += from(character2);
      }
    } while (character2 = next());
    return parsed;
  };
  var getRules = function getRules2(value, points) {
    return dealloc(toRules(alloc(value), points));
  };
  var fixedElements = /* @__PURE__ */ new WeakMap();
  var compat = function compat2(element) {
    if (element.type !== "rule" || !element.parent || // positive .length indicates that this rule contains pseudo
    // negative .length indicates that this rule has been already prefixed
    element.length < 1) {
      return;
    }
    var value = element.value, parent = element.parent;
    var isImplicitRule = element.column === parent.column && element.line === parent.line;
    while (parent.type !== "rule") {
      parent = parent.parent;
      if (!parent) return;
    }
    if (element.props.length === 1 && value.charCodeAt(0) !== 58 && !fixedElements.get(parent)) {
      return;
    }
    if (isImplicitRule) {
      return;
    }
    fixedElements.set(element, true);
    var points = [];
    var rules = getRules(value, points);
    var parentRules = parent.props;
    for (var i = 0, k2 = 0; i < rules.length; i++) {
      for (var j = 0; j < parentRules.length; j++, k2++) {
        element.props[k2] = points[i] ? rules[i].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i];
      }
    }
  };
  var removeLabel = function removeLabel2(element) {
    if (element.type === "decl") {
      var value = element.value;
      if (
        // charcode for l
        value.charCodeAt(0) === 108 && // charcode for b
        value.charCodeAt(2) === 98
      ) {
        element["return"] = "";
        element.value = "";
      }
    }
  };
  function prefix(value, length2) {
    switch (hash(value, length2)) {
      case 5103:
        return WEBKIT + "print-" + value + value;
      case 5737:
      case 4201:
      case 3177:
      case 3433:
      case 1641:
      case 4457:
      case 2921:
      case 5572:
      case 6356:
      case 5844:
      case 3191:
      case 6645:
      case 3005:
      case 6391:
      case 5879:
      case 5623:
      case 6135:
      case 4599:
      case 4855:
      case 4215:
      case 6389:
      case 5109:
      case 5365:
      case 5621:
      case 3829:
        return WEBKIT + value + value;
      case 5349:
      case 4246:
      case 4810:
      case 6968:
      case 2756:
        return WEBKIT + value + MOZ + value + MS + value + value;
      case 6828:
      case 4268:
        return WEBKIT + value + MS + value + value;
      case 6165:
        return WEBKIT + value + MS + "flex-" + value + value;
      case 5187:
        return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
      case 5443:
        return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/, "") + value;
      case 4675:
        return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/, "") + value;
      case 5548:
        return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
      case 5292:
        return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
      case 6060:
        return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
      case 4554:
        return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
      case 6187:
        return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
      case 5495:
      case 3959:
        return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
      case 4968:
        return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
      case 4095:
      case 3583:
      case 4068:
      case 2532:
        return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
      case 8116:
      case 7059:
      case 5753:
      case 5535:
      case 5445:
      case 5701:
      case 4933:
      case 4677:
      case 5533:
      case 5789:
      case 5021:
      case 4765:
        if (strlen(value) - 1 - length2 > 6) switch (charat(value, length2 + 1)) {
          case 109:
            if (charat(value, length2 + 4) !== 45) break;
          case 102:
            return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length2 + 3) == 108 ? "$3" : "$2-$3")) + value;
          case 115:
            return ~indexof(value, "stretch") ? prefix(replace(value, "stretch", "fill-available"), length2) + value : value;
        }
        break;
      case 4949:
        if (charat(value, length2 + 1) !== 115) break;
      case 6444:
        switch (charat(value, strlen(value) - 3 - (~indexof(value, "!important") && 10))) {
          case 107:
            return replace(value, ":", ":" + WEBKIT) + value;
          case 101:
            return replace(value, /(.+:)([^;!]+)(;|!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
        }
        break;
      case 5936:
        switch (charat(value, length2 + 11)) {
          case 114:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
          case 108:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
          case 45:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
        }
        return WEBKIT + value + MS + value + value;
    }
    return value;
  }
  var prefixer = function prefixer2(element, index, children, callback) {
    if (element.length > -1) {
      if (!element["return"]) switch (element.type) {
        case DECLARATION:
          element["return"] = prefix(element.value, element.length);
          break;
        case KEYFRAMES:
          return serialize([copy(element, {
            value: replace(element.value, "@", "@" + WEBKIT)
          })], callback);
        case RULESET:
          if (element.length) return combine(element.props, function(value) {
            switch (match(value, /(::plac\w+|:read-\w+)/)) {
              case ":read-only":
              case ":read-write":
                return serialize([copy(element, {
                  props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")]
                })], callback);
              case "::placeholder":
                return serialize([copy(element, {
                  props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")]
                }), copy(element, {
                  props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")]
                }), copy(element, {
                  props: [replace(value, /:(plac\w+)/, MS + "input-$1")]
                })], callback);
            }
            return "";
          });
      }
    }
  };
  var defaultStylisPlugins = [prefixer];
  var createCache = function createCache2(options) {
    var key = options.key;
    if (key === "css") {
      var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])");
      Array.prototype.forEach.call(ssrStyles, function(node2) {
        var dataEmotionAttribute = node2.getAttribute("data-emotion");
        if (dataEmotionAttribute.indexOf(" ") === -1) {
          return;
        }
        document.head.appendChild(node2);
        node2.setAttribute("data-s", "");
      });
    }
    var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;
    var inserted = {};
    var container;
    var nodesToHydrate = [];
    {
      container = options.container || document.head;
      Array.prototype.forEach.call(
        // this means we will ignore elements which don't have a space in them which
        // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
        document.querySelectorAll('style[data-emotion^="' + key + ' "]'),
        function(node2) {
          var attrib = node2.getAttribute("data-emotion").split(" ");
          for (var i = 1; i < attrib.length; i++) {
            inserted[attrib[i]] = true;
          }
          nodesToHydrate.push(node2);
        }
      );
    }
    var _insert;
    var omnipresentPlugins = [compat, removeLabel];
    {
      var currentSheet;
      var finalizingPlugins = [stringify, rulesheet(function(rule) {
        currentSheet.insert(rule);
      })];
      var serializer = middleware(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));
      var stylis = function stylis2(styles2) {
        return serialize(compile(styles2), serializer);
      };
      _insert = function insert(selector, serialized, sheet, shouldCache) {
        currentSheet = sheet;
        stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);
        if (shouldCache) {
          cache.inserted[serialized.name] = true;
        }
      };
    }
    var cache = {
      key,
      sheet: new StyleSheet({
        key,
        container,
        nonce: options.nonce,
        speedy: options.speedy,
        prepend: options.prepend,
        insertionPoint: options.insertionPoint
      }),
      nonce: options.nonce,
      inserted,
      registered: {},
      insert: _insert
    };
    cache.sheet.hydrate(nodesToHydrate);
    return cache;
  };
  var reactIs$1 = { exports: {} };
  var reactIs_production_min = {};
  /** @license React v16.13.1
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var b = "function" === typeof Symbol && Symbol.for, c = b ? Symbol.for("react.element") : 60103, d = b ? Symbol.for("react.portal") : 60106, e = b ? Symbol.for("react.fragment") : 60107, f$1 = b ? Symbol.for("react.strict_mode") : 60108, g$1 = b ? Symbol.for("react.profiler") : 60114, h = b ? Symbol.for("react.provider") : 60109, k$1 = b ? Symbol.for("react.context") : 60110, l$1 = b ? Symbol.for("react.async_mode") : 60111, m$1 = b ? Symbol.for("react.concurrent_mode") : 60111, n$2 = b ? Symbol.for("react.forward_ref") : 60112, p$2 = b ? Symbol.for("react.suspense") : 60113, q$2 = b ? Symbol.for("react.suspense_list") : 60120, r$1 = b ? Symbol.for("react.memo") : 60115, t$1 = b ? Symbol.for("react.lazy") : 60116, v$1 = b ? Symbol.for("react.block") : 60121, w = b ? Symbol.for("react.fundamental") : 60117, x = b ? Symbol.for("react.responder") : 60118, y = b ? Symbol.for("react.scope") : 60119;
  function z(a) {
    if ("object" === typeof a && null !== a) {
      var u2 = a.$$typeof;
      switch (u2) {
        case c:
          switch (a = a.type, a) {
            case l$1:
            case m$1:
            case e:
            case g$1:
            case f$1:
            case p$2:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case k$1:
                case n$2:
                case t$1:
                case r$1:
                case h:
                  return a;
                default:
                  return u2;
              }
          }
        case d:
          return u2;
      }
    }
  }
  function A(a) {
    return z(a) === m$1;
  }
  reactIs_production_min.AsyncMode = l$1;
  reactIs_production_min.ConcurrentMode = m$1;
  reactIs_production_min.ContextConsumer = k$1;
  reactIs_production_min.ContextProvider = h;
  reactIs_production_min.Element = c;
  reactIs_production_min.ForwardRef = n$2;
  reactIs_production_min.Fragment = e;
  reactIs_production_min.Lazy = t$1;
  reactIs_production_min.Memo = r$1;
  reactIs_production_min.Portal = d;
  reactIs_production_min.Profiler = g$1;
  reactIs_production_min.StrictMode = f$1;
  reactIs_production_min.Suspense = p$2;
  reactIs_production_min.isAsyncMode = function(a) {
    return A(a) || z(a) === l$1;
  };
  reactIs_production_min.isConcurrentMode = A;
  reactIs_production_min.isContextConsumer = function(a) {
    return z(a) === k$1;
  };
  reactIs_production_min.isContextProvider = function(a) {
    return z(a) === h;
  };
  reactIs_production_min.isElement = function(a) {
    return "object" === typeof a && null !== a && a.$$typeof === c;
  };
  reactIs_production_min.isForwardRef = function(a) {
    return z(a) === n$2;
  };
  reactIs_production_min.isFragment = function(a) {
    return z(a) === e;
  };
  reactIs_production_min.isLazy = function(a) {
    return z(a) === t$1;
  };
  reactIs_production_min.isMemo = function(a) {
    return z(a) === r$1;
  };
  reactIs_production_min.isPortal = function(a) {
    return z(a) === d;
  };
  reactIs_production_min.isProfiler = function(a) {
    return z(a) === g$1;
  };
  reactIs_production_min.isStrictMode = function(a) {
    return z(a) === f$1;
  };
  reactIs_production_min.isSuspense = function(a) {
    return z(a) === p$2;
  };
  reactIs_production_min.isValidElementType = function(a) {
    return "string" === typeof a || "function" === typeof a || a === e || a === m$1 || a === g$1 || a === f$1 || a === p$2 || a === q$2 || "object" === typeof a && null !== a && (a.$$typeof === t$1 || a.$$typeof === r$1 || a.$$typeof === h || a.$$typeof === k$1 || a.$$typeof === n$2 || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v$1);
  };
  reactIs_production_min.typeOf = z;
  {
    reactIs$1.exports = reactIs_production_min;
  }
  var reactIsExports = reactIs$1.exports;
  var reactIs = reactIsExports;
  var FORWARD_REF_STATICS = {
    "$$typeof": true,
    render: true,
    defaultProps: true,
    displayName: true,
    propTypes: true
  };
  var MEMO_STATICS = {
    "$$typeof": true,
    compare: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
    type: true
  };
  var TYPE_STATICS = {};
  TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
  TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
  var isBrowser = true;
  function getRegisteredStyles(registered, registeredStyles, classNames) {
    var rawClassName = "";
    classNames.split(" ").forEach(function(className) {
      if (registered[className] !== void 0) {
        registeredStyles.push(registered[className] + ";");
      } else if (className) {
        rawClassName += className + " ";
      }
    });
    return rawClassName;
  }
  var registerStyles = function registerStyles2(cache, serialized, isStringTag2) {
    var className = cache.key + "-" + serialized.name;
    if (
      // we only need to add the styles to the registered cache if the
      // class name could be used further down
      // the tree but if it's a string tag, we know it won't
      // so we don't have to add it to registered cache.
      // this improves memory usage since we can avoid storing the whole style string
      (isStringTag2 === false || // we need to always store it if we're in compat mode and
      // in node since emotion-server relies on whether a style is in
      // the registered cache to know whether a style is global or not
      // also, note that this check will be dead code eliminated in the browser
      isBrowser === false) && cache.registered[className] === void 0
    ) {
      cache.registered[className] = serialized.styles;
    }
  };
  var insertStyles = function insertStyles2(cache, serialized, isStringTag2) {
    registerStyles(cache, serialized, isStringTag2);
    var className = cache.key + "-" + serialized.name;
    if (cache.inserted[serialized.name] === void 0) {
      var current2 = serialized;
      do {
        cache.insert(serialized === current2 ? "." + className : "", current2, cache.sheet, true);
        current2 = current2.next;
      } while (current2 !== void 0);
    }
  };
  function murmur2(str) {
    var h2 = 0;
    var k2, i = 0, len = str.length;
    for (; len >= 4; ++i, len -= 4) {
      k2 = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
      k2 = /* Math.imul(k, m): */
      (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16);
      k2 ^= /* k >>> r: */
      k2 >>> 24;
      h2 = /* Math.imul(k, m): */
      (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
      (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    }
    switch (len) {
      case 3:
        h2 ^= (str.charCodeAt(i + 2) & 255) << 16;
      case 2:
        h2 ^= (str.charCodeAt(i + 1) & 255) << 8;
      case 1:
        h2 ^= str.charCodeAt(i) & 255;
        h2 = /* Math.imul(h, m): */
        (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    }
    h2 ^= h2 >>> 13;
    h2 = /* Math.imul(h, m): */
    (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    return ((h2 ^ h2 >>> 15) >>> 0).toString(36);
  }
  var unitlessKeys = {
    animationIterationCount: 1,
    aspectRatio: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    scale: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    // SVG-related properties
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
  };
  var isDevelopment$1 = false;
  var hyphenateRegex = /[A-Z]|^ms/g;
  var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
  var isCustomProperty = function isCustomProperty2(property) {
    return property.charCodeAt(1) === 45;
  };
  var isProcessableValue = function isProcessableValue2(value) {
    return value != null && typeof value !== "boolean";
  };
  var processStyleName = /* @__PURE__ */ memoize(function(styleName) {
    return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, "-$&").toLowerCase();
  });
  var processStyleValue = function processStyleValue2(key, value) {
    switch (key) {
      case "animation":
      case "animationName": {
        if (typeof value === "string") {
          return value.replace(animationRegex, function(match2, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
    }
    if (unitlessKeys[key] !== 1 && !isCustomProperty(key) && typeof value === "number" && value !== 0) {
      return value + "px";
    }
    return value;
  };
  var noComponentSelectorMessage = "Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.";
  function handleInterpolation(mergedProps, registered, interpolation) {
    if (interpolation == null) {
      return "";
    }
    var componentSelector = interpolation;
    if (componentSelector.__emotion_styles !== void 0) {
      return componentSelector;
    }
    switch (typeof interpolation) {
      case "boolean": {
        return "";
      }
      case "object": {
        var keyframes2 = interpolation;
        if (keyframes2.anim === 1) {
          cursor = {
            name: keyframes2.name,
            styles: keyframes2.styles,
            next: cursor
          };
          return keyframes2.name;
        }
        var serializedStyles = interpolation;
        if (serializedStyles.styles !== void 0) {
          var next2 = serializedStyles.next;
          if (next2 !== void 0) {
            while (next2 !== void 0) {
              cursor = {
                name: next2.name,
                styles: next2.styles,
                next: cursor
              };
              next2 = next2.next;
            }
          }
          var styles2 = serializedStyles.styles + ";";
          return styles2;
        }
        return createStringFromObject(mergedProps, registered, interpolation);
      }
      case "function": {
        if (mergedProps !== void 0) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result);
        }
        break;
      }
    }
    var asString = interpolation;
    if (registered == null) {
      return asString;
    }
    var cached = registered[asString];
    return cached !== void 0 ? cached : asString;
  }
  function createStringFromObject(mergedProps, registered, obj) {
    var string = "";
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        string += handleInterpolation(mergedProps, registered, obj[i]) + ";";
      }
    } else {
      for (var key in obj) {
        var value = obj[key];
        if (typeof value !== "object") {
          var asString = value;
          if (registered != null && registered[asString] !== void 0) {
            string += key + "{" + registered[asString] + "}";
          } else if (isProcessableValue(asString)) {
            string += processStyleName(key) + ":" + processStyleValue(key, asString) + ";";
          }
        } else {
          if (key === "NO_COMPONENT_SELECTOR" && isDevelopment$1) {
            throw new Error(noComponentSelectorMessage);
          }
          if (Array.isArray(value) && typeof value[0] === "string" && (registered == null || registered[value[0]] === void 0)) {
            for (var _i = 0; _i < value.length; _i++) {
              if (isProcessableValue(value[_i])) {
                string += processStyleName(key) + ":" + processStyleValue(key, value[_i]) + ";";
              }
            }
          } else {
            var interpolated = handleInterpolation(mergedProps, registered, value);
            switch (key) {
              case "animation":
              case "animationName": {
                string += processStyleName(key) + ":" + interpolated + ";";
                break;
              }
              default: {
                string += key + "{" + interpolated + "}";
              }
            }
          }
        }
      }
    }
    return string;
  }
  var labelPattern = /label:\s*([^\s;{]+)\s*(;|$)/g;
  var cursor;
  function serializeStyles(args, registered, mergedProps) {
    if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && args[0].styles !== void 0) {
      return args[0];
    }
    var stringMode = true;
    var styles2 = "";
    cursor = void 0;
    var strings = args[0];
    if (strings == null || strings.raw === void 0) {
      stringMode = false;
      styles2 += handleInterpolation(mergedProps, registered, strings);
    } else {
      var asTemplateStringsArr = strings;
      styles2 += asTemplateStringsArr[0];
    }
    for (var i = 1; i < args.length; i++) {
      styles2 += handleInterpolation(mergedProps, registered, args[i]);
      if (stringMode) {
        var templateStringsArr = strings;
        styles2 += templateStringsArr[i];
      }
    }
    labelPattern.lastIndex = 0;
    var identifierName = "";
    var match2;
    while ((match2 = labelPattern.exec(styles2)) !== null) {
      identifierName += "-" + match2[1];
    }
    var name = murmur2(styles2) + identifierName;
    return {
      name,
      styles: styles2,
      next: cursor
    };
  }
  var syncFallback = function syncFallback2(create) {
    return create();
  };
  var useInsertionEffect = ReactOriginal["useInsertionEffect"] ? ReactOriginal["useInsertionEffect"] : false;
  var useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect || syncFallback;
  var EmotionCacheContext = /* @__PURE__ */ reactExports.createContext(
    // we're doing this to avoid preconstruct's dead code elimination in this one case
    // because this module is primarily intended for the browser and node
    // but it's also required in react native and similar environments sometimes
    // and we could have a special build just for that
    // but this is much easier and the native packages
    // might use a different theme context in the future anyway
    typeof HTMLElement !== "undefined" ? /* @__PURE__ */ createCache({
      key: "css"
    }) : null
  );
  EmotionCacheContext.Provider;
  var withEmotionCache = function withEmotionCache2(func) {
    return /* @__PURE__ */ reactExports.forwardRef(function(props, ref) {
      var cache = reactExports.useContext(EmotionCacheContext);
      return func(props, cache, ref);
    });
  };
  var ThemeContext = /* @__PURE__ */ reactExports.createContext({});
  function css() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return serializeStyles(args);
  }
  var keyframes = function keyframes2() {
    var insertable = css.apply(void 0, arguments);
    var name = "animation-" + insertable.name;
    return {
      name,
      styles: "@keyframes " + name + "{" + insertable.styles + "}",
      anim: 1,
      toString: function toString() {
        return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
      }
    };
  };
  var testOmitPropsOnStringTag = isPropValid;
  var testOmitPropsOnComponent = function testOmitPropsOnComponent2(key) {
    return key !== "theme";
  };
  var getDefaultShouldForwardProp = function getDefaultShouldForwardProp2(tag) {
    return typeof tag === "string" && // 96 is one less than the char code
    // for "a" so this is checking that
    // it's a lowercase character
    tag.charCodeAt(0) > 96 ? testOmitPropsOnStringTag : testOmitPropsOnComponent;
  };
  var composeShouldForwardProps = function composeShouldForwardProps2(tag, options, isReal) {
    var shouldForwardProp2;
    if (options) {
      var optionsShouldForwardProp = options.shouldForwardProp;
      shouldForwardProp2 = tag.__emotion_forwardProp && optionsShouldForwardProp ? function(propName) {
        return tag.__emotion_forwardProp(propName) && optionsShouldForwardProp(propName);
      } : optionsShouldForwardProp;
    }
    if (typeof shouldForwardProp2 !== "function" && isReal) {
      shouldForwardProp2 = tag.__emotion_forwardProp;
    }
    return shouldForwardProp2;
  };
  var isDevelopment = false;
  var Insertion = function Insertion2(_ref) {
    var cache = _ref.cache, serialized = _ref.serialized, isStringTag2 = _ref.isStringTag;
    registerStyles(cache, serialized, isStringTag2);
    useInsertionEffectAlwaysWithSyncFallback(function() {
      return insertStyles(cache, serialized, isStringTag2);
    });
    return null;
  };
  var createStyled$1 = function createStyled2(tag, options) {
    var isReal = tag.__emotion_real === tag;
    var baseTag = isReal && tag.__emotion_base || tag;
    var identifierName;
    var targetClassName;
    if (options !== void 0) {
      identifierName = options.label;
      targetClassName = options.target;
    }
    var shouldForwardProp2 = composeShouldForwardProps(tag, options, isReal);
    var defaultShouldForwardProp = shouldForwardProp2 || getDefaultShouldForwardProp(baseTag);
    var shouldUseAs = !defaultShouldForwardProp("as");
    return function() {
      var args = arguments;
      var styles2 = isReal && tag.__emotion_styles !== void 0 ? tag.__emotion_styles.slice(0) : [];
      if (identifierName !== void 0) {
        styles2.push("label:" + identifierName + ";");
      }
      if (args[0] == null || args[0].raw === void 0) {
        styles2.push.apply(styles2, args);
      } else {
        styles2.push(args[0][0]);
        var len = args.length;
        var i = 1;
        for (; i < len; i++) {
          styles2.push(args[i], args[0][i]);
        }
      }
      var Styled = withEmotionCache(function(props, cache, ref) {
        var FinalTag = shouldUseAs && props.as || baseTag;
        var className = "";
        var classInterpolations = [];
        var mergedProps = props;
        if (props.theme == null) {
          mergedProps = {};
          for (var key in props) {
            mergedProps[key] = props[key];
          }
          mergedProps.theme = reactExports.useContext(ThemeContext);
        }
        if (typeof props.className === "string") {
          className = getRegisteredStyles(cache.registered, classInterpolations, props.className);
        } else if (props.className != null) {
          className = props.className + " ";
        }
        var serialized = serializeStyles(styles2.concat(classInterpolations), cache.registered, mergedProps);
        className += cache.key + "-" + serialized.name;
        if (targetClassName !== void 0) {
          className += " " + targetClassName;
        }
        var finalShouldForwardProp = shouldUseAs && shouldForwardProp2 === void 0 ? getDefaultShouldForwardProp(FinalTag) : defaultShouldForwardProp;
        var newProps = {};
        for (var _key in props) {
          if (shouldUseAs && _key === "as") continue;
          if (finalShouldForwardProp(_key)) {
            newProps[_key] = props[_key];
          }
        }
        newProps.className = className;
        if (ref) {
          newProps.ref = ref;
        }
        return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(Insertion, {
          cache,
          serialized,
          isStringTag: typeof FinalTag === "string"
        }), /* @__PURE__ */ reactExports.createElement(FinalTag, newProps));
      });
      Styled.displayName = identifierName !== void 0 ? identifierName : "Styled(" + (typeof baseTag === "string" ? baseTag : baseTag.displayName || baseTag.name || "Component") + ")";
      Styled.defaultProps = tag.defaultProps;
      Styled.__emotion_real = Styled;
      Styled.__emotion_base = baseTag;
      Styled.__emotion_styles = styles2;
      Styled.__emotion_forwardProp = shouldForwardProp2;
      Object.defineProperty(Styled, "toString", {
        value: function value() {
          if (targetClassName === void 0 && isDevelopment) {
            return "NO_COMPONENT_SELECTOR";
          }
          return "." + targetClassName;
        }
      });
      Styled.withComponent = function(nextTag, nextOptions) {
        return createStyled2(nextTag, _extends({}, options, nextOptions, {
          shouldForwardProp: composeShouldForwardProps(Styled, nextOptions, true)
        })).apply(void 0, styles2);
      };
      return Styled;
    };
  };
  var tags = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
    // SVG
    "circle",
    "clipPath",
    "defs",
    "ellipse",
    "foreignObject",
    "g",
    "image",
    "line",
    "linearGradient",
    "mask",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "stop",
    "svg",
    "text",
    "tspan"
  ];
  var newStyled = createStyled$1.bind();
  tags.forEach(function(tagName) {
    newStyled[tagName] = newStyled(tagName);
  });
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n$1 = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
  function q$1(c2, a, g2) {
    var b2, d2 = {}, e2 = null, h2 = null;
    void 0 !== g2 && (e2 = "" + g2);
    void 0 !== a.key && (e2 = "" + a.key);
    void 0 !== a.ref && (h2 = a.ref);
    for (b2 in a) m.call(a, b2) && !p$1.hasOwnProperty(b2) && (d2[b2] = a[b2]);
    if (c2 && c2.defaultProps) for (b2 in a = c2.defaultProps, a) void 0 === d2[b2] && (d2[b2] = a[b2]);
    return { $$typeof: k, type: c2, key: e2, ref: h2, props: d2, _owner: n$1.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q$1;
  reactJsxRuntime_production_min.jsxs = q$1;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  /**
   * @mui/styled-engine v6.1.6
   *
   * @license MIT
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  function styled$1(tag, options) {
    const stylesFactory = newStyled(tag, options);
    return stylesFactory;
  }
  function internal_mutateStyles(tag, processor) {
    if (Array.isArray(tag.__emotion_styles)) {
      tag.__emotion_styles = processor(tag.__emotion_styles);
    }
  }
  const wrapper = [];
  function internal_serializeStyles(styles2) {
    wrapper[0] = styles2;
    return serializeStyles(wrapper);
  }
  const sortBreakpointsValues = (values2) => {
    const breakpointsAsArray = Object.keys(values2).map((key) => ({
      key,
      val: values2[key]
    })) || [];
    breakpointsAsArray.sort((breakpoint1, breakpoint2) => breakpoint1.val - breakpoint2.val);
    return breakpointsAsArray.reduce((acc, obj) => {
      return {
        ...acc,
        [obj.key]: obj.val
      };
    }, {});
  };
  function createBreakpoints(breakpoints) {
    const {
      // The breakpoint **start** at this value.
      // For instance with the first breakpoint xs: [xs, sm).
      values: values2 = {
        xs: 0,
        // phone
        sm: 600,
        // tablet
        md: 900,
        // small laptop
        lg: 1200,
        // desktop
        xl: 1536
        // large screen
      },
      unit = "px",
      step = 5,
      ...other
    } = breakpoints;
    const sortedValues = sortBreakpointsValues(values2);
    const keys = Object.keys(sortedValues);
    function up(key) {
      const value = typeof values2[key] === "number" ? values2[key] : key;
      return `@media (min-width:${value}${unit})`;
    }
    function down(key) {
      const value = typeof values2[key] === "number" ? values2[key] : key;
      return `@media (max-width:${value - step / 100}${unit})`;
    }
    function between(start, end) {
      const endIndex = keys.indexOf(end);
      return `@media (min-width:${typeof values2[start] === "number" ? values2[start] : start}${unit}) and (max-width:${(endIndex !== -1 && typeof values2[keys[endIndex]] === "number" ? values2[keys[endIndex]] : end) - step / 100}${unit})`;
    }
    function only(key) {
      if (keys.indexOf(key) + 1 < keys.length) {
        return between(key, keys[keys.indexOf(key) + 1]);
      }
      return up(key);
    }
    function not(key) {
      const keyIndex = keys.indexOf(key);
      if (keyIndex === 0) {
        return up(keys[1]);
      }
      if (keyIndex === keys.length - 1) {
        return down(keys[keyIndex]);
      }
      return between(key, keys[keys.indexOf(key) + 1]).replace("@media", "@media not all and");
    }
    return {
      keys,
      values: sortedValues,
      up,
      down,
      between,
      only,
      not,
      unit,
      ...other
    };
  }
  const shape = {
    borderRadius: 4
  };
  function createSpacing(spacingInput = 8, transform = createUnarySpacing({
    spacing: spacingInput
  })) {
    if (spacingInput.mui) {
      return spacingInput;
    }
    const spacing = (...argsInput) => {
      const args = argsInput.length === 0 ? [1] : argsInput;
      return args.map((argument) => {
        const output = transform(argument);
        return typeof output === "number" ? `${output}px` : output;
      }).join(" ");
    };
    spacing.mui = true;
    return spacing;
  }
  function applyStyles(key, styles2) {
    var _a;
    const theme = this;
    if (theme.vars) {
      if (!((_a = theme.colorSchemes) == null ? void 0 : _a[key]) || typeof theme.getColorSchemeSelector !== "function") {
        return {};
      }
      let selector = theme.getColorSchemeSelector(key);
      if (selector === "&") {
        return styles2;
      }
      if (selector.includes("data-") || selector.includes(".")) {
        selector = `*:where(${selector.replace(/\s*&$/, "")}) &`;
      }
      return {
        [selector]: styles2
      };
    }
    if (theme.palette.mode === key) {
      return styles2;
    }
    return {};
  }
  function createTheme$1(options = {}, ...args) {
    const {
      breakpoints: breakpointsInput = {},
      palette: paletteInput = {},
      spacing: spacingInput,
      shape: shapeInput = {},
      ...other
    } = options;
    const breakpoints = createBreakpoints(breakpointsInput);
    const spacing = createSpacing(spacingInput);
    let muiTheme = deepmerge({
      breakpoints,
      direction: "ltr",
      components: {},
      // Inject component definitions.
      palette: {
        mode: "light",
        ...paletteInput
      },
      spacing,
      shape: {
        ...shape,
        ...shapeInput
      }
    }, other);
    muiTheme = cssContainerQueries(muiTheme);
    muiTheme.applyStyles = applyStyles;
    muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme);
    muiTheme.unstable_sxConfig = {
      ...defaultSxConfig,
      ...other == null ? void 0 : other.unstable_sxConfig
    };
    muiTheme.unstable_sx = function sx(props) {
      return styleFunctionSx({
        sx: props,
        theme: this
      });
    };
    return muiTheme;
  }
  function isObjectEmpty$1(obj) {
    return Object.keys(obj).length === 0;
  }
  function useTheme$2(defaultTheme2 = null) {
    const contextTheme = reactExports.useContext(ThemeContext);
    return !contextTheme || isObjectEmpty$1(contextTheme) ? defaultTheme2 : contextTheme;
  }
  const systemDefaultTheme$1 = createTheme$1();
  function useTheme$1(defaultTheme2 = systemDefaultTheme$1) {
    return useTheme$2(defaultTheme2);
  }
  const defaultGenerator = (componentName) => componentName;
  const createClassNameGenerator = () => {
    let generate = defaultGenerator;
    return {
      configure(generator) {
        generate = generator;
      },
      generate(componentName) {
        return generate(componentName);
      },
      reset() {
        generate = defaultGenerator;
      }
    };
  };
  const ClassNameGenerator = createClassNameGenerator();
  const globalStateClasses = {
    active: "active",
    checked: "checked",
    completed: "completed",
    disabled: "disabled",
    error: "error",
    expanded: "expanded",
    focused: "focused",
    focusVisible: "focusVisible",
    open: "open",
    readOnly: "readOnly",
    required: "required",
    selected: "selected"
  };
  function generateUtilityClass(componentName, slot, globalStatePrefix = "Mui") {
    const globalStateClass = globalStateClasses[slot];
    return globalStateClass ? `${globalStatePrefix}-${globalStateClass}` : `${ClassNameGenerator.generate(componentName)}-${slot}`;
  }
  function generateUtilityClasses(componentName, slots, globalStatePrefix = "Mui") {
    const result = {};
    slots.forEach((slot) => {
      result[slot] = generateUtilityClass(componentName, slot, globalStatePrefix);
    });
    return result;
  }
  function preprocessStyles(input) {
    const {
      variants,
      ...style2
    } = input;
    const result = {
      variants,
      style: internal_serializeStyles(style2),
      isProcessed: true
    };
    if (result.style === style2) {
      return result;
    }
    if (variants) {
      variants.forEach((variant) => {
        if (typeof variant.style !== "function") {
          variant.style = internal_serializeStyles(variant.style);
        }
      });
    }
    return result;
  }
  const systemDefaultTheme = createTheme$1();
  function shouldForwardProp(prop) {
    return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
  }
  function defaultOverridesResolver(slot) {
    if (!slot) {
      return null;
    }
    return (_props, styles2) => styles2[slot];
  }
  function attachTheme(props, themeId, defaultTheme2) {
    props.theme = isObjectEmpty(props.theme) ? defaultTheme2 : props.theme[themeId] || props.theme;
  }
  function processStyle(props, style2) {
    const resolvedStyle = typeof style2 === "function" ? style2(props) : style2;
    if (Array.isArray(resolvedStyle)) {
      return resolvedStyle.flatMap((subStyle) => processStyle(props, subStyle));
    }
    if (Array.isArray(resolvedStyle == null ? void 0 : resolvedStyle.variants)) {
      let rootStyle;
      if (resolvedStyle.isProcessed) {
        rootStyle = resolvedStyle.style;
      } else {
        const {
          variants,
          ...otherStyles
        } = resolvedStyle;
        rootStyle = otherStyles;
      }
      return processStyleVariants(props, resolvedStyle.variants, [rootStyle]);
    }
    if (resolvedStyle == null ? void 0 : resolvedStyle.isProcessed) {
      return resolvedStyle.style;
    }
    return resolvedStyle;
  }
  function processStyleVariants(props, variants, results = []) {
    var _a;
    let mergedState;
    variantLoop: for (let i = 0; i < variants.length; i += 1) {
      const variant = variants[i];
      if (typeof variant.props === "function") {
        mergedState ?? (mergedState = {
          ...props,
          ...props.ownerState,
          ownerState: props.ownerState
        });
        if (!variant.props(mergedState)) {
          continue;
        }
      } else {
        for (const key in variant.props) {
          if (props[key] !== variant.props[key] && ((_a = props.ownerState) == null ? void 0 : _a[key]) !== variant.props[key]) {
            continue variantLoop;
          }
        }
      }
      if (typeof variant.style === "function") {
        mergedState ?? (mergedState = {
          ...props,
          ...props.ownerState,
          ownerState: props.ownerState
        });
        results.push(variant.style(mergedState));
      } else {
        results.push(variant.style);
      }
    }
    return results;
  }
  function createStyled(input = {}) {
    const {
      themeId,
      defaultTheme: defaultTheme2 = systemDefaultTheme,
      rootShouldForwardProp: rootShouldForwardProp2 = shouldForwardProp,
      slotShouldForwardProp: slotShouldForwardProp2 = shouldForwardProp
    } = input;
    function styleAttachTheme(props) {
      attachTheme(props, themeId, defaultTheme2);
    }
    const styled2 = (tag, inputOptions = {}) => {
      internal_mutateStyles(tag, (styles2) => styles2.filter((style2) => style2 !== styleFunctionSx));
      const {
        name: componentName,
        slot: componentSlot,
        skipVariantsResolver: inputSkipVariantsResolver,
        skipSx: inputSkipSx,
        // TODO v6: remove `lowercaseFirstLetter()` in the next major release
        // For more details: https://github.com/mui/material-ui/pull/37908
        overridesResolver: overridesResolver2 = defaultOverridesResolver(lowercaseFirstLetter(componentSlot)),
        ...options
      } = inputOptions;
      const skipVariantsResolver = inputSkipVariantsResolver !== void 0 ? inputSkipVariantsResolver : (
        // TODO v6: remove `Root` in the next major release
        // For more details: https://github.com/mui/material-ui/pull/37908
        componentSlot && componentSlot !== "Root" && componentSlot !== "root" || false
      );
      const skipSx = inputSkipSx || false;
      let shouldForwardPropOption = shouldForwardProp;
      if (componentSlot === "Root" || componentSlot === "root") {
        shouldForwardPropOption = rootShouldForwardProp2;
      } else if (componentSlot) {
        shouldForwardPropOption = slotShouldForwardProp2;
      } else if (isStringTag(tag)) {
        shouldForwardPropOption = void 0;
      }
      const defaultStyledResolver = styled$1(tag, {
        shouldForwardProp: shouldForwardPropOption,
        label: generateStyledLabel(),
        ...options
      });
      const transformStyle = (style2) => {
        if (typeof style2 === "function" && style2.__emotion_real !== style2) {
          return function styleFunctionProcessor(props) {
            return processStyle(props, style2);
          };
        }
        if (isPlainObject$2(style2)) {
          const serialized = preprocessStyles(style2);
          if (!serialized.variants) {
            return serialized.style;
          }
          return function styleObjectProcessor(props) {
            return processStyle(props, serialized);
          };
        }
        return style2;
      };
      const muiStyledResolver = (...expressionsInput) => {
        const expressionsHead = [];
        const expressionsBody = expressionsInput.map(transformStyle);
        const expressionsTail = [];
        expressionsHead.push(styleAttachTheme);
        if (componentName && overridesResolver2) {
          expressionsTail.push(function styleThemeOverrides(props) {
            var _a, _b;
            const theme = props.theme;
            const styleOverrides = (_b = (_a = theme.components) == null ? void 0 : _a[componentName]) == null ? void 0 : _b.styleOverrides;
            if (!styleOverrides) {
              return null;
            }
            const resolvedStyleOverrides = {};
            for (const slotKey in styleOverrides) {
              resolvedStyleOverrides[slotKey] = processStyle(props, styleOverrides[slotKey]);
            }
            return overridesResolver2(props, resolvedStyleOverrides);
          });
        }
        if (componentName && !skipVariantsResolver) {
          expressionsTail.push(function styleThemeVariants(props) {
            var _a, _b;
            const theme = props.theme;
            const themeVariants = (_b = (_a = theme == null ? void 0 : theme.components) == null ? void 0 : _a[componentName]) == null ? void 0 : _b.variants;
            if (!themeVariants) {
              return null;
            }
            return processStyleVariants(props, themeVariants);
          });
        }
        if (!skipSx) {
          expressionsTail.push(styleFunctionSx);
        }
        if (Array.isArray(expressionsBody[0])) {
          const inputStrings = expressionsBody.shift();
          const placeholdersHead = new Array(expressionsHead.length).fill("");
          const placeholdersTail = new Array(expressionsTail.length).fill("");
          let outputStrings;
          {
            outputStrings = [...placeholdersHead, ...inputStrings, ...placeholdersTail];
            outputStrings.raw = [...placeholdersHead, ...inputStrings.raw, ...placeholdersTail];
          }
          expressionsHead.unshift(outputStrings);
        }
        const expressions = [...expressionsHead, ...expressionsBody, ...expressionsTail];
        const Component = defaultStyledResolver(...expressions);
        if (tag.muiName) {
          Component.muiName = tag.muiName;
        }
        return Component;
      };
      if (defaultStyledResolver.withConfig) {
        muiStyledResolver.withConfig = defaultStyledResolver.withConfig;
      }
      return muiStyledResolver;
    };
    return styled2;
  }
  function generateStyledLabel(componentName, componentSlot) {
    let label;
    return label;
  }
  function isObjectEmpty(object) {
    for (const _ in object) {
      return false;
    }
    return true;
  }
  function isStringTag(tag) {
    return typeof tag === "string" && // 96 is one less than the char code
    // for "a" so this is checking that
    // it's a lowercase character
    tag.charCodeAt(0) > 96;
  }
  function lowercaseFirstLetter(string) {
    if (!string) {
      return string;
    }
    return string.charAt(0).toLowerCase() + string.slice(1);
  }
  function resolveProps(defaultProps2, props) {
    const output = {
      ...props
    };
    for (const key in defaultProps2) {
      if (Object.prototype.hasOwnProperty.call(defaultProps2, key)) {
        const propName = key;
        if (propName === "components" || propName === "slots") {
          output[propName] = {
            ...defaultProps2[propName],
            ...output[propName]
          };
        } else if (propName === "componentsProps" || propName === "slotProps") {
          const defaultSlotProps = defaultProps2[propName];
          const slotProps = props[propName];
          if (!slotProps) {
            output[propName] = defaultSlotProps || {};
          } else if (!defaultSlotProps) {
            output[propName] = slotProps;
          } else {
            output[propName] = {
              ...slotProps
            };
            for (const slotKey in defaultSlotProps) {
              if (Object.prototype.hasOwnProperty.call(defaultSlotProps, slotKey)) {
                const slotPropName = slotKey;
                output[propName][slotPropName] = resolveProps(defaultSlotProps[slotPropName], slotProps[slotPropName]);
              }
            }
          }
        } else if (output[propName] === void 0) {
          output[propName] = defaultProps2[propName];
        }
      }
    }
    return output;
  }
  const useEnhancedEffect = typeof window !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
  function createChainedFunction(...funcs) {
    return funcs.reduce((acc, func) => {
      if (func == null) {
        return acc;
      }
      return function chainedFunction(...args) {
        acc.apply(this, args);
        func.apply(this, args);
      };
    }, () => {
    });
  }
  function debounce(func, wait = 166) {
    let timeout;
    function debounced(...args) {
      const later = () => {
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }
    debounced.clear = () => {
      clearTimeout(timeout);
    };
    return debounced;
  }
  function ownerDocument(node2) {
    return node2 && node2.ownerDocument || document;
  }
  function ownerWindow(node2) {
    const doc = ownerDocument(node2);
    return doc.defaultView || window;
  }
  function setRef(ref, value) {
    if (typeof ref === "function") {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
  }
  function useEventCallback(fn) {
    const ref = reactExports.useRef(fn);
    useEnhancedEffect(() => {
      ref.current = fn;
    });
    return reactExports.useRef((...args) => (
      // @ts-expect-error hide `this`
      (0, ref.current)(...args)
    )).current;
  }
  function useForkRef(...refs) {
    return reactExports.useMemo(() => {
      if (refs.every((ref) => ref == null)) {
        return null;
      }
      return (instance) => {
        refs.forEach((ref) => {
          setRef(ref, instance);
        });
      };
    }, refs);
  }
  const UNINITIALIZED = {};
  function useLazyRef(init, initArg) {
    const ref = reactExports.useRef(UNINITIALIZED);
    if (ref.current === UNINITIALIZED) {
      ref.current = init(initArg);
    }
    return ref;
  }
  const EMPTY = [];
  function useOnMount(fn) {
    reactExports.useEffect(fn, EMPTY);
  }
  class Timeout {
    constructor() {
      __publicField(this, "currentId", null);
      __publicField(this, "clear", () => {
        if (this.currentId !== null) {
          clearTimeout(this.currentId);
          this.currentId = null;
        }
      });
      __publicField(this, "disposeEffect", () => {
        return this.clear;
      });
    }
    static create() {
      return new Timeout();
    }
    /**
     * Executes `fn` after `delay`, clearing any previously scheduled call.
     */
    start(delay, fn) {
      this.clear();
      this.currentId = setTimeout(() => {
        this.currentId = null;
        fn();
      }, delay);
    }
  }
  function useTimeout() {
    const timeout = useLazyRef(Timeout.create).current;
    useOnMount(timeout.disposeEffect);
    return timeout;
  }
  function isFocusVisible(element) {
    try {
      return element.matches(":focus-visible");
    } catch (error) {
    }
    return false;
  }
  function getScrollbarSize(win = window) {
    const documentWidth = win.document.documentElement.clientWidth;
    return win.innerWidth - documentWidth;
  }
  function isHostComponent(element) {
    return typeof element === "string";
  }
  function appendOwnerState(elementType, otherProps, ownerState) {
    if (elementType === void 0 || isHostComponent(elementType)) {
      return otherProps;
    }
    return {
      ...otherProps,
      ownerState: {
        ...otherProps.ownerState,
        ...ownerState
      }
    };
  }
  function extractEventHandlers(object, excludeKeys = []) {
    if (object === void 0) {
      return {};
    }
    const result = {};
    Object.keys(object).filter((prop) => prop.match(/^on[A-Z]/) && typeof object[prop] === "function" && !excludeKeys.includes(prop)).forEach((prop) => {
      result[prop] = object[prop];
    });
    return result;
  }
  function omitEventHandlers(object) {
    if (object === void 0) {
      return {};
    }
    const result = {};
    Object.keys(object).filter((prop) => !(prop.match(/^on[A-Z]/) && typeof object[prop] === "function")).forEach((prop) => {
      result[prop] = object[prop];
    });
    return result;
  }
  function mergeSlotProps(parameters) {
    const {
      getSlotProps,
      additionalProps,
      externalSlotProps,
      externalForwardedProps,
      className
    } = parameters;
    if (!getSlotProps) {
      const joinedClasses2 = clsx(additionalProps == null ? void 0 : additionalProps.className, className, externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className);
      const mergedStyle2 = {
        ...additionalProps == null ? void 0 : additionalProps.style,
        ...externalForwardedProps == null ? void 0 : externalForwardedProps.style,
        ...externalSlotProps == null ? void 0 : externalSlotProps.style
      };
      const props2 = {
        ...additionalProps,
        ...externalForwardedProps,
        ...externalSlotProps
      };
      if (joinedClasses2.length > 0) {
        props2.className = joinedClasses2;
      }
      if (Object.keys(mergedStyle2).length > 0) {
        props2.style = mergedStyle2;
      }
      return {
        props: props2,
        internalRef: void 0
      };
    }
    const eventHandlers = extractEventHandlers({
      ...externalForwardedProps,
      ...externalSlotProps
    });
    const componentsPropsWithoutEventHandlers = omitEventHandlers(externalSlotProps);
    const otherPropsWithoutEventHandlers = omitEventHandlers(externalForwardedProps);
    const internalSlotProps = getSlotProps(eventHandlers);
    const joinedClasses = clsx(internalSlotProps == null ? void 0 : internalSlotProps.className, additionalProps == null ? void 0 : additionalProps.className, className, externalForwardedProps == null ? void 0 : externalForwardedProps.className, externalSlotProps == null ? void 0 : externalSlotProps.className);
    const mergedStyle = {
      ...internalSlotProps == null ? void 0 : internalSlotProps.style,
      ...additionalProps == null ? void 0 : additionalProps.style,
      ...externalForwardedProps == null ? void 0 : externalForwardedProps.style,
      ...externalSlotProps == null ? void 0 : externalSlotProps.style
    };
    const props = {
      ...internalSlotProps,
      ...additionalProps,
      ...otherPropsWithoutEventHandlers,
      ...componentsPropsWithoutEventHandlers
    };
    if (joinedClasses.length > 0) {
      props.className = joinedClasses;
    }
    if (Object.keys(mergedStyle).length > 0) {
      props.style = mergedStyle;
    }
    return {
      props,
      internalRef: internalSlotProps.ref
    };
  }
  function resolveComponentProps(componentProps, ownerState, slotState) {
    if (typeof componentProps === "function") {
      return componentProps(ownerState, slotState);
    }
    return componentProps;
  }
  function getReactElementRef(element) {
    var _a;
    if (parseInt(reactExports.version, 10) >= 19) {
      return ((_a = element == null ? void 0 : element.props) == null ? void 0 : _a.ref) || null;
    }
    return (element == null ? void 0 : element.ref) || null;
  }
  const RtlContext = /* @__PURE__ */ reactExports.createContext();
  const useRtl = () => {
    const value = reactExports.useContext(RtlContext);
    return value ?? false;
  };
  const PropsContext = /* @__PURE__ */ reactExports.createContext(void 0);
  function getThemeProps(params) {
    const {
      theme,
      name,
      props
    } = params;
    if (!theme || !theme.components || !theme.components[name]) {
      return props;
    }
    const config2 = theme.components[name];
    if (config2.defaultProps) {
      return resolveProps(config2.defaultProps, props);
    }
    if (!config2.styleOverrides && !config2.variants) {
      return resolveProps(config2, props);
    }
    return props;
  }
  function useDefaultProps$1({
    props,
    name
  }) {
    const ctx = reactExports.useContext(PropsContext);
    return getThemeProps({
      props,
      name,
      theme: {
        components: ctx
      }
    });
  }
  const arg = {
    theme: void 0
  };
  function unstable_memoTheme(styleFn) {
    let lastValue;
    let lastTheme;
    return function styleMemoized(props) {
      let value = lastValue;
      if (value === void 0 || props.theme !== lastTheme) {
        arg.theme = props.theme;
        value = preprocessStyles(styleFn(arg));
        lastValue = value;
        lastTheme = props.theme;
      }
      return value;
    };
  }
  function createGetCssVar$1(prefix2 = "") {
    function appendVar(...vars) {
      if (!vars.length) {
        return "";
      }
      const value = vars[0];
      if (typeof value === "string" && !value.match(/(#|\(|\)|(-?(\d*\.)?\d+)(px|em|%|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc))|^(-?(\d*\.)?\d+)$|(\d+ \d+ \d+)/)) {
        return `, var(--${prefix2 ? `${prefix2}-` : ""}${value}${appendVar(...vars.slice(1))})`;
      }
      return `, ${value}`;
    }
    const getCssVar = (field, ...fallbacks) => {
      return `var(--${prefix2 ? `${prefix2}-` : ""}${field}${appendVar(...fallbacks)})`;
    };
    return getCssVar;
  }
  const assignNestedKeys = (obj, keys, value, arrayKeys = []) => {
    let temp = obj;
    keys.forEach((k2, index) => {
      if (index === keys.length - 1) {
        if (Array.isArray(temp)) {
          temp[Number(k2)] = value;
        } else if (temp && typeof temp === "object") {
          temp[k2] = value;
        }
      } else if (temp && typeof temp === "object") {
        if (!temp[k2]) {
          temp[k2] = arrayKeys.includes(k2) ? [] : {};
        }
        temp = temp[k2];
      }
    });
  };
  const walkObjectDeep = (obj, callback, shouldSkipPaths) => {
    function recurse(object, parentKeys = [], arrayKeys = []) {
      Object.entries(object).forEach(([key, value]) => {
        if (!shouldSkipPaths || shouldSkipPaths && !shouldSkipPaths([...parentKeys, key])) {
          if (value !== void 0 && value !== null) {
            if (typeof value === "object" && Object.keys(value).length > 0) {
              recurse(value, [...parentKeys, key], Array.isArray(value) ? [...arrayKeys, key] : arrayKeys);
            } else {
              callback([...parentKeys, key], value, arrayKeys);
            }
          }
        }
      });
    }
    recurse(obj);
  };
  const getCssValue = (keys, value) => {
    if (typeof value === "number") {
      if (["lineHeight", "fontWeight", "opacity", "zIndex"].some((prop) => keys.includes(prop))) {
        return value;
      }
      const lastKey = keys[keys.length - 1];
      if (lastKey.toLowerCase().includes("opacity")) {
        return value;
      }
      return `${value}px`;
    }
    return value;
  };
  function cssVarsParser(theme, options) {
    const {
      prefix: prefix2,
      shouldSkipGeneratingVar: shouldSkipGeneratingVar2
    } = options || {};
    const css2 = {};
    const vars = {};
    const varsWithDefaults = {};
    walkObjectDeep(
      theme,
      (keys, value, arrayKeys) => {
        if (typeof value === "string" || typeof value === "number") {
          if (!shouldSkipGeneratingVar2 || !shouldSkipGeneratingVar2(keys, value)) {
            const cssVar = `--${prefix2 ? `${prefix2}-` : ""}${keys.join("-")}`;
            const resolvedValue = getCssValue(keys, value);
            Object.assign(css2, {
              [cssVar]: resolvedValue
            });
            assignNestedKeys(vars, keys, `var(${cssVar})`, arrayKeys);
            assignNestedKeys(varsWithDefaults, keys, `var(${cssVar}, ${resolvedValue})`, arrayKeys);
          }
        }
      },
      (keys) => keys[0] === "vars"
      // skip 'vars/*' paths
    );
    return {
      css: css2,
      vars,
      varsWithDefaults
    };
  }
  function prepareCssVars(theme, parserConfig = {}) {
    const {
      getSelector = defaultGetSelector2,
      disableCssColorScheme,
      colorSchemeSelector: selector
    } = parserConfig;
    const {
      colorSchemes = {},
      components,
      defaultColorScheme = "light",
      ...otherTheme
    } = theme;
    const {
      vars: rootVars,
      css: rootCss,
      varsWithDefaults: rootVarsWithDefaults
    } = cssVarsParser(otherTheme, parserConfig);
    let themeVars = rootVarsWithDefaults;
    const colorSchemesMap = {};
    const {
      [defaultColorScheme]: defaultScheme,
      ...otherColorSchemes
    } = colorSchemes;
    Object.entries(otherColorSchemes || {}).forEach(([key, scheme]) => {
      const {
        vars,
        css: css2,
        varsWithDefaults
      } = cssVarsParser(scheme, parserConfig);
      themeVars = deepmerge(themeVars, varsWithDefaults);
      colorSchemesMap[key] = {
        css: css2,
        vars
      };
    });
    if (defaultScheme) {
      const {
        css: css2,
        vars,
        varsWithDefaults
      } = cssVarsParser(defaultScheme, parserConfig);
      themeVars = deepmerge(themeVars, varsWithDefaults);
      colorSchemesMap[defaultColorScheme] = {
        css: css2,
        vars
      };
    }
    function defaultGetSelector2(colorScheme, cssObject) {
      var _a, _b;
      let rule = selector;
      if (selector === "class") {
        rule = ".%s";
      }
      if (selector === "data") {
        rule = "[data-%s]";
      }
      if ((selector == null ? void 0 : selector.startsWith("data-")) && !selector.includes("%s")) {
        rule = `[${selector}="%s"]`;
      }
      if (colorScheme) {
        if (rule === "media") {
          if (theme.defaultColorScheme === colorScheme) {
            return ":root";
          }
          const mode = ((_b = (_a = colorSchemes[colorScheme]) == null ? void 0 : _a.palette) == null ? void 0 : _b.mode) || colorScheme;
          return {
            [`@media (prefers-color-scheme: ${mode})`]: {
              ":root": cssObject
            }
          };
        }
        if (rule) {
          if (theme.defaultColorScheme === colorScheme) {
            return `:root, ${rule.replace("%s", String(colorScheme))}`;
          }
          return rule.replace("%s", String(colorScheme));
        }
      }
      return ":root";
    }
    const generateThemeVars = () => {
      let vars = {
        ...rootVars
      };
      Object.entries(colorSchemesMap).forEach(([, {
        vars: schemeVars
      }]) => {
        vars = deepmerge(vars, schemeVars);
      });
      return vars;
    };
    const generateStyleSheets = () => {
      var _a, _b;
      const stylesheets = [];
      const colorScheme = theme.defaultColorScheme || "light";
      function insertStyleSheet(key, css2) {
        if (Object.keys(css2).length) {
          stylesheets.push(typeof key === "string" ? {
            [key]: {
              ...css2
            }
          } : key);
        }
      }
      insertStyleSheet(getSelector(void 0, {
        ...rootCss
      }), rootCss);
      const {
        [colorScheme]: defaultSchemeVal,
        ...other
      } = colorSchemesMap;
      if (defaultSchemeVal) {
        const {
          css: css2
        } = defaultSchemeVal;
        const cssColorSheme = (_b = (_a = colorSchemes[colorScheme]) == null ? void 0 : _a.palette) == null ? void 0 : _b.mode;
        const finalCss = !disableCssColorScheme && cssColorSheme ? {
          colorScheme: cssColorSheme,
          ...css2
        } : {
          ...css2
        };
        insertStyleSheet(getSelector(colorScheme, {
          ...finalCss
        }), finalCss);
      }
      Object.entries(other).forEach(([key, {
        css: css2
      }]) => {
        var _a2, _b2;
        const cssColorSheme = (_b2 = (_a2 = colorSchemes[key]) == null ? void 0 : _a2.palette) == null ? void 0 : _b2.mode;
        const finalCss = !disableCssColorScheme && cssColorSheme ? {
          colorScheme: cssColorSheme,
          ...css2
        } : {
          ...css2
        };
        insertStyleSheet(getSelector(key, {
          ...finalCss
        }), finalCss);
      });
      return stylesheets;
    };
    return {
      vars: themeVars,
      generateThemeVars,
      generateStyleSheets
    };
  }
  function createGetColorSchemeSelector(selector) {
    return function getColorSchemeSelector(colorScheme) {
      if (selector === "media") {
        return `@media (prefers-color-scheme: ${colorScheme})`;
      }
      if (selector) {
        if (selector.startsWith("data-") && !selector.includes("%s")) {
          return `[${selector}="${colorScheme}"] &`;
        }
        if (selector === "class") {
          return `.${colorScheme} &`;
        }
        if (selector === "data") {
          return `[data-${colorScheme}] &`;
        }
        return `${selector.replace("%s", colorScheme)} &`;
      }
      return "&";
    };
  }
  const common = {
    black: "#000",
    white: "#fff"
  };
  const grey = {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#eeeeee",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
    A100: "#f5f5f5",
    A200: "#eeeeee",
    A400: "#bdbdbd",
    A700: "#616161"
  };
  const purple = {
    50: "#f3e5f5",
    100: "#e1bee7",
    200: "#ce93d8",
    300: "#ba68c8",
    400: "#ab47bc",
    500: "#9c27b0",
    600: "#8e24aa",
    700: "#7b1fa2",
    800: "#6a1b9a",
    900: "#4a148c",
    A100: "#ea80fc",
    A200: "#e040fb",
    A400: "#d500f9",
    A700: "#aa00ff"
  };
  const red = {
    50: "#ffebee",
    100: "#ffcdd2",
    200: "#ef9a9a",
    300: "#e57373",
    400: "#ef5350",
    500: "#f44336",
    600: "#e53935",
    700: "#d32f2f",
    800: "#c62828",
    900: "#b71c1c",
    A100: "#ff8a80",
    A200: "#ff5252",
    A400: "#ff1744",
    A700: "#d50000"
  };
  const orange = {
    50: "#fff3e0",
    100: "#ffe0b2",
    200: "#ffcc80",
    300: "#ffb74d",
    400: "#ffa726",
    500: "#ff9800",
    600: "#fb8c00",
    700: "#f57c00",
    800: "#ef6c00",
    900: "#e65100",
    A100: "#ffd180",
    A200: "#ffab40",
    A400: "#ff9100",
    A700: "#ff6d00"
  };
  const blue = {
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9",
    300: "#64b5f6",
    400: "#42a5f5",
    500: "#2196f3",
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
    A100: "#82b1ff",
    A200: "#448aff",
    A400: "#2979ff",
    A700: "#2962ff"
  };
  const lightBlue = {
    50: "#e1f5fe",
    100: "#b3e5fc",
    200: "#81d4fa",
    300: "#4fc3f7",
    400: "#29b6f6",
    500: "#03a9f4",
    600: "#039be5",
    700: "#0288d1",
    800: "#0277bd",
    900: "#01579b",
    A100: "#80d8ff",
    A200: "#40c4ff",
    A400: "#00b0ff",
    A700: "#0091ea"
  };
  const green = {
    50: "#e8f5e9",
    100: "#c8e6c9",
    200: "#a5d6a7",
    300: "#81c784",
    400: "#66bb6a",
    500: "#4caf50",
    600: "#43a047",
    700: "#388e3c",
    800: "#2e7d32",
    900: "#1b5e20",
    A100: "#b9f6ca",
    A200: "#69f0ae",
    A400: "#00e676",
    A700: "#00c853"
  };
  function getLight() {
    return {
      // The colors used to style the text.
      text: {
        // The most important text.
        primary: "rgba(0, 0, 0, 0.87)",
        // Secondary text.
        secondary: "rgba(0, 0, 0, 0.6)",
        // Disabled text have even lower visual prominence.
        disabled: "rgba(0, 0, 0, 0.38)"
      },
      // The color used to divide different elements.
      divider: "rgba(0, 0, 0, 0.12)",
      // The background colors used to style the surfaces.
      // Consistency between these values is important.
      background: {
        paper: common.white,
        default: common.white
      },
      // The colors used to style the action elements.
      action: {
        // The color of an active action like an icon button.
        active: "rgba(0, 0, 0, 0.54)",
        // The color of an hovered action.
        hover: "rgba(0, 0, 0, 0.04)",
        hoverOpacity: 0.04,
        // The color of a selected action.
        selected: "rgba(0, 0, 0, 0.08)",
        selectedOpacity: 0.08,
        // The color of a disabled action.
        disabled: "rgba(0, 0, 0, 0.26)",
        // The background color of a disabled action.
        disabledBackground: "rgba(0, 0, 0, 0.12)",
        disabledOpacity: 0.38,
        focus: "rgba(0, 0, 0, 0.12)",
        focusOpacity: 0.12,
        activatedOpacity: 0.12
      }
    };
  }
  const light = getLight();
  function getDark() {
    return {
      text: {
        primary: common.white,
        secondary: "rgba(255, 255, 255, 0.7)",
        disabled: "rgba(255, 255, 255, 0.5)",
        icon: "rgba(255, 255, 255, 0.5)"
      },
      divider: "rgba(255, 255, 255, 0.12)",
      background: {
        paper: "#121212",
        default: "#121212"
      },
      action: {
        active: common.white,
        hover: "rgba(255, 255, 255, 0.08)",
        hoverOpacity: 0.08,
        selected: "rgba(255, 255, 255, 0.16)",
        selectedOpacity: 0.16,
        disabled: "rgba(255, 255, 255, 0.3)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
        disabledOpacity: 0.38,
        focus: "rgba(255, 255, 255, 0.12)",
        focusOpacity: 0.12,
        activatedOpacity: 0.24
      }
    };
  }
  const dark = getDark();
  function addLightOrDark(intent, direction, shade, tonalOffset) {
    const tonalOffsetLight = tonalOffset.light || tonalOffset;
    const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5;
    if (!intent[direction]) {
      if (intent.hasOwnProperty(shade)) {
        intent[direction] = intent[shade];
      } else if (direction === "light") {
        intent.light = lighten(intent.main, tonalOffsetLight);
      } else if (direction === "dark") {
        intent.dark = darken(intent.main, tonalOffsetDark);
      }
    }
  }
  function getDefaultPrimary(mode = "light") {
    if (mode === "dark") {
      return {
        main: blue[200],
        light: blue[50],
        dark: blue[400]
      };
    }
    return {
      main: blue[700],
      light: blue[400],
      dark: blue[800]
    };
  }
  function getDefaultSecondary(mode = "light") {
    if (mode === "dark") {
      return {
        main: purple[200],
        light: purple[50],
        dark: purple[400]
      };
    }
    return {
      main: purple[500],
      light: purple[300],
      dark: purple[700]
    };
  }
  function getDefaultError(mode = "light") {
    if (mode === "dark") {
      return {
        main: red[500],
        light: red[300],
        dark: red[700]
      };
    }
    return {
      main: red[700],
      light: red[400],
      dark: red[800]
    };
  }
  function getDefaultInfo(mode = "light") {
    if (mode === "dark") {
      return {
        main: lightBlue[400],
        light: lightBlue[300],
        dark: lightBlue[700]
      };
    }
    return {
      main: lightBlue[700],
      light: lightBlue[500],
      dark: lightBlue[900]
    };
  }
  function getDefaultSuccess(mode = "light") {
    if (mode === "dark") {
      return {
        main: green[400],
        light: green[300],
        dark: green[700]
      };
    }
    return {
      main: green[800],
      light: green[500],
      dark: green[900]
    };
  }
  function getDefaultWarning(mode = "light") {
    if (mode === "dark") {
      return {
        main: orange[400],
        light: orange[300],
        dark: orange[700]
      };
    }
    return {
      main: "#ed6c02",
      // closest to orange[800] that pass 3:1.
      light: orange[500],
      dark: orange[900]
    };
  }
  function createPalette(palette) {
    const {
      mode = "light",
      contrastThreshold = 3,
      tonalOffset = 0.2,
      ...other
    } = palette;
    const primary = palette.primary || getDefaultPrimary(mode);
    const secondary = palette.secondary || getDefaultSecondary(mode);
    const error = palette.error || getDefaultError(mode);
    const info = palette.info || getDefaultInfo(mode);
    const success = palette.success || getDefaultSuccess(mode);
    const warning = palette.warning || getDefaultWarning(mode);
    function getContrastText(background) {
      const contrastText = getContrastRatio(background, dark.text.primary) >= contrastThreshold ? dark.text.primary : light.text.primary;
      return contrastText;
    }
    const augmentColor = ({
      color: color2,
      name,
      mainShade = 500,
      lightShade = 300,
      darkShade = 700
    }) => {
      color2 = {
        ...color2
      };
      if (!color2.main && color2[mainShade]) {
        color2.main = color2[mainShade];
      }
      if (!color2.hasOwnProperty("main")) {
        throw new Error(formatMuiErrorMessage(11, name ? ` (${name})` : "", mainShade));
      }
      if (typeof color2.main !== "string") {
        throw new Error(formatMuiErrorMessage(12, name ? ` (${name})` : "", JSON.stringify(color2.main)));
      }
      addLightOrDark(color2, "light", lightShade, tonalOffset);
      addLightOrDark(color2, "dark", darkShade, tonalOffset);
      if (!color2.contrastText) {
        color2.contrastText = getContrastText(color2.main);
      }
      return color2;
    };
    let modeHydrated;
    if (mode === "light") {
      modeHydrated = getLight();
    } else if (mode === "dark") {
      modeHydrated = getDark();
    }
    const paletteOutput = deepmerge({
      // A collection of common colors.
      common: {
        ...common
      },
      // prevent mutable object.
      // The palette mode, can be light or dark.
      mode,
      // The colors used to represent primary interface elements for a user.
      primary: augmentColor({
        color: primary,
        name: "primary"
      }),
      // The colors used to represent secondary interface elements for a user.
      secondary: augmentColor({
        color: secondary,
        name: "secondary",
        mainShade: "A400",
        lightShade: "A200",
        darkShade: "A700"
      }),
      // The colors used to represent interface elements that the user should be made aware of.
      error: augmentColor({
        color: error,
        name: "error"
      }),
      // The colors used to represent potentially dangerous actions or important messages.
      warning: augmentColor({
        color: warning,
        name: "warning"
      }),
      // The colors used to present information to the user that is neutral and not necessarily important.
      info: augmentColor({
        color: info,
        name: "info"
      }),
      // The colors used to indicate the successful completion of an action that user triggered.
      success: augmentColor({
        color: success,
        name: "success"
      }),
      // The grey colors.
      grey,
      // Used by `getContrastText()` to maximize the contrast between
      // the background and the text.
      contrastThreshold,
      // Takes a background color and returns the text color that maximizes the contrast.
      getContrastText,
      // Generate a rich color object.
      augmentColor,
      // Used by the functions below to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset,
      // The light and dark mode object.
      ...modeHydrated
    }, other);
    return paletteOutput;
  }
  function prepareTypographyVars(typography) {
    const vars = {};
    const entries = Object.entries(typography);
    entries.forEach((entry) => {
      const [key, value] = entry;
      if (typeof value === "object") {
        vars[key] = `${value.fontStyle ? `${value.fontStyle} ` : ""}${value.fontVariant ? `${value.fontVariant} ` : ""}${value.fontWeight ? `${value.fontWeight} ` : ""}${value.fontStretch ? `${value.fontStretch} ` : ""}${value.fontSize || ""}${value.lineHeight ? `/${value.lineHeight} ` : ""}${value.fontFamily || ""}`;
      }
    });
    return vars;
  }
  function createMixins(breakpoints, mixins) {
    return {
      toolbar: {
        minHeight: 56,
        [breakpoints.up("xs")]: {
          "@media (orientation: landscape)": {
            minHeight: 48
          }
        },
        [breakpoints.up("sm")]: {
          minHeight: 64
        }
      },
      ...mixins
    };
  }
  function round(value) {
    return Math.round(value * 1e5) / 1e5;
  }
  const caseAllCaps = {
    textTransform: "uppercase"
  };
  const defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
  function createTypography(palette, typography) {
    const {
      fontFamily = defaultFontFamily,
      // The default font size of the Material Specification.
      fontSize = 14,
      // px
      fontWeightLight = 300,
      fontWeightRegular = 400,
      fontWeightMedium = 500,
      fontWeightBold = 700,
      // Tell MUI what's the font-size on the html element.
      // 16px is the default font-size used by browsers.
      htmlFontSize = 16,
      // Apply the CSS properties to all the variants.
      allVariants,
      pxToRem: pxToRem2,
      ...other
    } = typeof typography === "function" ? typography(palette) : typography;
    const coef = fontSize / 14;
    const pxToRem = pxToRem2 || ((size) => `${size / htmlFontSize * coef}rem`);
    const buildVariant = (fontWeight, size, lineHeight, letterSpacing, casing) => ({
      fontFamily,
      fontWeight,
      fontSize: pxToRem(size),
      // Unitless following https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/
      lineHeight,
      // The letter spacing was designed for the Roboto font-family. Using the same letter-spacing
      // across font-families can cause issues with the kerning.
      ...fontFamily === defaultFontFamily ? {
        letterSpacing: `${round(letterSpacing / size)}em`
      } : {},
      ...casing,
      ...allVariants
    });
    const variants = {
      h1: buildVariant(fontWeightLight, 96, 1.167, -1.5),
      h2: buildVariant(fontWeightLight, 60, 1.2, -0.5),
      h3: buildVariant(fontWeightRegular, 48, 1.167, 0),
      h4: buildVariant(fontWeightRegular, 34, 1.235, 0.25),
      h5: buildVariant(fontWeightRegular, 24, 1.334, 0),
      h6: buildVariant(fontWeightMedium, 20, 1.6, 0.15),
      subtitle1: buildVariant(fontWeightRegular, 16, 1.75, 0.15),
      subtitle2: buildVariant(fontWeightMedium, 14, 1.57, 0.1),
      body1: buildVariant(fontWeightRegular, 16, 1.5, 0.15),
      body2: buildVariant(fontWeightRegular, 14, 1.43, 0.15),
      button: buildVariant(fontWeightMedium, 14, 1.75, 0.4, caseAllCaps),
      caption: buildVariant(fontWeightRegular, 12, 1.66, 0.4),
      overline: buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps),
      // TODO v6: Remove handling of 'inherit' variant from the theme as it is already handled in Material UI's Typography component. Also, remember to remove the associated types.
      inherit: {
        fontFamily: "inherit",
        fontWeight: "inherit",
        fontSize: "inherit",
        lineHeight: "inherit",
        letterSpacing: "inherit"
      }
    };
    return deepmerge({
      htmlFontSize,
      pxToRem,
      fontFamily,
      fontSize,
      fontWeightLight,
      fontWeightRegular,
      fontWeightMedium,
      fontWeightBold,
      ...variants
    }, other, {
      clone: false
      // No need to clone deep
    });
  }
  const shadowKeyUmbraOpacity = 0.2;
  const shadowKeyPenumbraOpacity = 0.14;
  const shadowAmbientShadowOpacity = 0.12;
  function createShadow(...px) {
    return [`${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`, `${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`, `${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`].join(",");
  }
  const shadows = ["none", createShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), createShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), createShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)];
  const easing = {
    // This is the most common easing curve.
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    // Objects enter the screen at full velocity from off-screen and
    // slowly decelerate to a resting point.
    easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
    // Objects leave the screen at full velocity. They do not decelerate when off-screen.
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    // The sharp curve is used by objects that may return to the screen at any time.
    sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
  };
  const duration = {
    shortest: 150,
    shorter: 200,
    short: 250,
    // most basic recommended timing
    standard: 300,
    // this is to be used in complex animations
    complex: 375,
    // recommended when something is entering screen
    enteringScreen: 225,
    // recommended when something is leaving screen
    leavingScreen: 195
  };
  function formatMs(milliseconds) {
    return `${Math.round(milliseconds)}ms`;
  }
  function getAutoHeightDuration(height2) {
    if (!height2) {
      return 0;
    }
    const constant = height2 / 36;
    return Math.min(Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10), 3e3);
  }
  function createTransitions(inputTransitions) {
    const mergedEasing = {
      ...easing,
      ...inputTransitions.easing
    };
    const mergedDuration = {
      ...duration,
      ...inputTransitions.duration
    };
    const create = (props = ["all"], options = {}) => {
      const {
        duration: durationOption = mergedDuration.standard,
        easing: easingOption = mergedEasing.easeInOut,
        delay = 0,
        ...other
      } = options;
      return (Array.isArray(props) ? props : [props]).map((animatedProp) => `${animatedProp} ${typeof durationOption === "string" ? durationOption : formatMs(durationOption)} ${easingOption} ${typeof delay === "string" ? delay : formatMs(delay)}`).join(",");
    };
    return {
      getAutoHeightDuration,
      create,
      ...inputTransitions,
      easing: mergedEasing,
      duration: mergedDuration
    };
  }
  const zIndex = {
    mobileStepper: 1e3,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500
  };
  function isSerializable(val) {
    return isPlainObject$2(val) || typeof val === "undefined" || typeof val === "string" || typeof val === "boolean" || typeof val === "number" || Array.isArray(val);
  }
  function stringifyTheme(baseTheme = {}) {
    const serializableTheme = {
      ...baseTheme
    };
    function serializeTheme(object) {
      const array = Object.entries(object);
      for (let index = 0; index < array.length; index++) {
        const [key, value] = array[index];
        if (!isSerializable(value) || key.startsWith("unstable_")) {
          delete object[key];
        } else if (isPlainObject$2(value)) {
          object[key] = {
            ...value
          };
          serializeTheme(object[key]);
        }
      }
    }
    serializeTheme(serializableTheme);
    return `import { unstable_createBreakpoints as createBreakpoints, createTransitions } from '@mui/material/styles';

const theme = ${JSON.stringify(serializableTheme, null, 2)};

theme.breakpoints = createBreakpoints(theme.breakpoints || {});
theme.transitions = createTransitions(theme.transitions || {});

export default theme;`;
  }
  function createThemeNoVars(options = {}, ...args) {
    const {
      breakpoints: breakpointsInput,
      mixins: mixinsInput = {},
      spacing: spacingInput,
      palette: paletteInput = {},
      transitions: transitionsInput = {},
      typography: typographyInput = {},
      shape: shapeInput,
      ...other
    } = options;
    if (options.vars) {
      throw new Error(formatMuiErrorMessage(20));
    }
    const palette = createPalette(paletteInput);
    const systemTheme = createTheme$1(options);
    let muiTheme = deepmerge(systemTheme, {
      mixins: createMixins(systemTheme.breakpoints, mixinsInput),
      palette,
      // Don't use [...shadows] until you've verified its transpiled code is not invoking the iterator protocol.
      shadows: shadows.slice(),
      typography: createTypography(palette, typographyInput),
      transitions: createTransitions(transitionsInput),
      zIndex: {
        ...zIndex
      }
    });
    muiTheme = deepmerge(muiTheme, other);
    muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme);
    muiTheme.unstable_sxConfig = {
      ...defaultSxConfig,
      ...other == null ? void 0 : other.unstable_sxConfig
    };
    muiTheme.unstable_sx = function sx(props) {
      return styleFunctionSx({
        sx: props,
        theme: this
      });
    };
    muiTheme.toRuntimeSource = stringifyTheme;
    return muiTheme;
  }
  function getOverlayAlpha(elevation) {
    let alphaValue;
    if (elevation < 1) {
      alphaValue = 5.11916 * elevation ** 2;
    } else {
      alphaValue = 4.5 * Math.log(elevation + 1) + 2;
    }
    return Math.round(alphaValue * 10) / 1e3;
  }
  const defaultDarkOverlays = [...Array(25)].map((_, index) => {
    if (index === 0) {
      return "none";
    }
    const overlay = getOverlayAlpha(index);
    return `linear-gradient(rgba(255 255 255 / ${overlay}), rgba(255 255 255 / ${overlay}))`;
  });
  function getOpacity(mode) {
    return {
      inputPlaceholder: mode === "dark" ? 0.5 : 0.42,
      inputUnderline: mode === "dark" ? 0.7 : 0.42,
      switchTrackDisabled: mode === "dark" ? 0.2 : 0.12,
      switchTrack: mode === "dark" ? 0.3 : 0.38
    };
  }
  function getOverlays(mode) {
    return mode === "dark" ? defaultDarkOverlays : [];
  }
  function createColorScheme(options) {
    const {
      palette: paletteInput = {
        mode: "light"
      },
      // need to cast to avoid module augmentation test
      opacity,
      overlays,
      ...rest
    } = options;
    const palette = createPalette(paletteInput);
    return {
      palette,
      opacity: {
        ...getOpacity(palette.mode),
        ...opacity
      },
      overlays: overlays || getOverlays(palette.mode),
      ...rest
    };
  }
  function shouldSkipGeneratingVar(keys) {
    var _a;
    return !!keys[0].match(/(cssVarPrefix|colorSchemeSelector|rootSelector|typography|mixins|breakpoints|direction|transitions)/) || !!keys[0].match(/sxConfig$/) || // ends with sxConfig
    keys[0] === "palette" && !!((_a = keys[1]) == null ? void 0 : _a.match(/(mode|contrastThreshold|tonalOffset)/));
  }
  const excludeVariablesFromRoot = (cssVarPrefix) => [...[...Array(25)].map((_, index) => `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}overlays-${index}`), `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}palette-AppBar-darkBg`, `--${cssVarPrefix ? `${cssVarPrefix}-` : ""}palette-AppBar-darkColor`];
  const defaultGetSelector = (theme) => (colorScheme, css2) => {
    const root = theme.rootSelector || ":root";
    const selector = theme.colorSchemeSelector;
    let rule = selector;
    if (selector === "class") {
      rule = ".%s";
    }
    if (selector === "data") {
      rule = "[data-%s]";
    }
    if ((selector == null ? void 0 : selector.startsWith("data-")) && !selector.includes("%s")) {
      rule = `[${selector}="%s"]`;
    }
    if (theme.defaultColorScheme === colorScheme) {
      if (colorScheme === "dark") {
        const excludedVariables = {};
        excludeVariablesFromRoot(theme.cssVarPrefix).forEach((cssVar) => {
          excludedVariables[cssVar] = css2[cssVar];
          delete css2[cssVar];
        });
        if (rule === "media") {
          return {
            [root]: css2,
            [`@media (prefers-color-scheme: dark)`]: {
              [root]: excludedVariables
            }
          };
        }
        if (rule) {
          return {
            [rule.replace("%s", colorScheme)]: excludedVariables,
            [`${root}, ${rule.replace("%s", colorScheme)}`]: css2
          };
        }
        return {
          [root]: {
            ...css2,
            ...excludedVariables
          }
        };
      }
      if (rule && rule !== "media") {
        return `${root}, ${rule.replace("%s", String(colorScheme))}`;
      }
    } else if (colorScheme) {
      if (rule === "media") {
        return {
          [`@media (prefers-color-scheme: ${String(colorScheme)})`]: {
            [root]: css2
          }
        };
      }
      if (rule) {
        return rule.replace("%s", String(colorScheme));
      }
    }
    return root;
  };
  function assignNode(obj, keys) {
    keys.forEach((k2) => {
      if (!obj[k2]) {
        obj[k2] = {};
      }
    });
  }
  function setColor(obj, key, defaultValue) {
    if (!obj[key] && defaultValue) {
      obj[key] = defaultValue;
    }
  }
  function toRgb(color2) {
    if (!color2 || !color2.startsWith("hsl")) {
      return color2;
    }
    return hslToRgb(color2);
  }
  function setColorChannel(obj, key) {
    if (!(`${key}Channel` in obj)) {
      obj[`${key}Channel`] = private_safeColorChannel(toRgb(obj[key]), `MUI: Can't create \`palette.${key}Channel\` because \`palette.${key}\` is not one of these formats: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().
To suppress this warning, you need to explicitly provide the \`palette.${key}Channel\` as a string (in rgb format, for example "12 12 12") or undefined if you want to remove the channel token.`);
    }
  }
  function getSpacingVal(spacingInput) {
    if (typeof spacingInput === "number") {
      return `${spacingInput}px`;
    }
    if (typeof spacingInput === "string" || typeof spacingInput === "function" || Array.isArray(spacingInput)) {
      return spacingInput;
    }
    return "8px";
  }
  const silent = (fn) => {
    try {
      return fn();
    } catch (error) {
    }
    return void 0;
  };
  const createGetCssVar = (cssVarPrefix = "mui") => createGetCssVar$1(cssVarPrefix);
  function attachColorScheme$1(colorSchemes, scheme, restTheme, colorScheme) {
    if (!scheme) {
      return void 0;
    }
    scheme = scheme === true ? {} : scheme;
    const mode = colorScheme === "dark" ? "dark" : "light";
    if (!restTheme) {
      colorSchemes[colorScheme] = createColorScheme({
        ...scheme,
        palette: {
          mode,
          ...scheme == null ? void 0 : scheme.palette
        }
      });
      return void 0;
    }
    const {
      palette,
      ...muiTheme
    } = createThemeNoVars({
      ...restTheme,
      palette: {
        mode,
        ...scheme == null ? void 0 : scheme.palette
      }
    });
    colorSchemes[colorScheme] = {
      ...scheme,
      palette,
      opacity: {
        ...getOpacity(mode),
        ...scheme == null ? void 0 : scheme.opacity
      },
      overlays: (scheme == null ? void 0 : scheme.overlays) || getOverlays(mode)
    };
    return muiTheme;
  }
  function createThemeWithVars(options = {}, ...args) {
    const {
      colorSchemes: colorSchemesInput = {
        light: true
      },
      defaultColorScheme: defaultColorSchemeInput,
      disableCssColorScheme = false,
      cssVarPrefix = "mui",
      shouldSkipGeneratingVar: shouldSkipGeneratingVar$1 = shouldSkipGeneratingVar,
      colorSchemeSelector: selector = colorSchemesInput.light && colorSchemesInput.dark ? "media" : void 0,
      rootSelector = ":root",
      ...input
    } = options;
    const firstColorScheme = Object.keys(colorSchemesInput)[0];
    const defaultColorScheme = defaultColorSchemeInput || (colorSchemesInput.light && firstColorScheme !== "light" ? "light" : firstColorScheme);
    const getCssVar = createGetCssVar(cssVarPrefix);
    const {
      [defaultColorScheme]: defaultSchemeInput,
      light: builtInLight,
      dark: builtInDark,
      ...customColorSchemes
    } = colorSchemesInput;
    const colorSchemes = {
      ...customColorSchemes
    };
    let defaultScheme = defaultSchemeInput;
    if (defaultColorScheme === "dark" && !("dark" in colorSchemesInput) || defaultColorScheme === "light" && !("light" in colorSchemesInput)) {
      defaultScheme = true;
    }
    if (!defaultScheme) {
      throw new Error(formatMuiErrorMessage(21, defaultColorScheme));
    }
    const muiTheme = attachColorScheme$1(colorSchemes, defaultScheme, input, defaultColorScheme);
    if (builtInLight && !colorSchemes.light) {
      attachColorScheme$1(colorSchemes, builtInLight, void 0, "light");
    }
    if (builtInDark && !colorSchemes.dark) {
      attachColorScheme$1(colorSchemes, builtInDark, void 0, "dark");
    }
    let theme = {
      defaultColorScheme,
      ...muiTheme,
      cssVarPrefix,
      colorSchemeSelector: selector,
      rootSelector,
      getCssVar,
      colorSchemes,
      font: {
        ...prepareTypographyVars(muiTheme.typography),
        ...muiTheme.font
      },
      spacing: getSpacingVal(input.spacing)
    };
    Object.keys(theme.colorSchemes).forEach((key) => {
      const palette = theme.colorSchemes[key].palette;
      const setCssVarColor = (cssVar) => {
        const tokens = cssVar.split("-");
        const color2 = tokens[1];
        const colorToken = tokens[2];
        return getCssVar(cssVar, palette[color2][colorToken]);
      };
      if (palette.mode === "light") {
        setColor(palette.common, "background", "#fff");
        setColor(palette.common, "onBackground", "#000");
      }
      if (palette.mode === "dark") {
        setColor(palette.common, "background", "#000");
        setColor(palette.common, "onBackground", "#fff");
      }
      assignNode(palette, ["Alert", "AppBar", "Avatar", "Button", "Chip", "FilledInput", "LinearProgress", "Skeleton", "Slider", "SnackbarContent", "SpeedDialAction", "StepConnector", "StepContent", "Switch", "TableCell", "Tooltip"]);
      if (palette.mode === "light") {
        setColor(palette.Alert, "errorColor", private_safeDarken(palette.error.light, 0.6));
        setColor(palette.Alert, "infoColor", private_safeDarken(palette.info.light, 0.6));
        setColor(palette.Alert, "successColor", private_safeDarken(palette.success.light, 0.6));
        setColor(palette.Alert, "warningColor", private_safeDarken(palette.warning.light, 0.6));
        setColor(palette.Alert, "errorFilledBg", setCssVarColor("palette-error-main"));
        setColor(palette.Alert, "infoFilledBg", setCssVarColor("palette-info-main"));
        setColor(palette.Alert, "successFilledBg", setCssVarColor("palette-success-main"));
        setColor(palette.Alert, "warningFilledBg", setCssVarColor("palette-warning-main"));
        setColor(palette.Alert, "errorFilledColor", silent(() => palette.getContrastText(palette.error.main)));
        setColor(palette.Alert, "infoFilledColor", silent(() => palette.getContrastText(palette.info.main)));
        setColor(palette.Alert, "successFilledColor", silent(() => palette.getContrastText(palette.success.main)));
        setColor(palette.Alert, "warningFilledColor", silent(() => palette.getContrastText(palette.warning.main)));
        setColor(palette.Alert, "errorStandardBg", private_safeLighten(palette.error.light, 0.9));
        setColor(palette.Alert, "infoStandardBg", private_safeLighten(palette.info.light, 0.9));
        setColor(palette.Alert, "successStandardBg", private_safeLighten(palette.success.light, 0.9));
        setColor(palette.Alert, "warningStandardBg", private_safeLighten(palette.warning.light, 0.9));
        setColor(palette.Alert, "errorIconColor", setCssVarColor("palette-error-main"));
        setColor(palette.Alert, "infoIconColor", setCssVarColor("palette-info-main"));
        setColor(palette.Alert, "successIconColor", setCssVarColor("palette-success-main"));
        setColor(palette.Alert, "warningIconColor", setCssVarColor("palette-warning-main"));
        setColor(palette.AppBar, "defaultBg", setCssVarColor("palette-grey-100"));
        setColor(palette.Avatar, "defaultBg", setCssVarColor("palette-grey-400"));
        setColor(palette.Button, "inheritContainedBg", setCssVarColor("palette-grey-300"));
        setColor(palette.Button, "inheritContainedHoverBg", setCssVarColor("palette-grey-A100"));
        setColor(palette.Chip, "defaultBorder", setCssVarColor("palette-grey-400"));
        setColor(palette.Chip, "defaultAvatarColor", setCssVarColor("palette-grey-700"));
        setColor(palette.Chip, "defaultIconColor", setCssVarColor("palette-grey-700"));
        setColor(palette.FilledInput, "bg", "rgba(0, 0, 0, 0.06)");
        setColor(palette.FilledInput, "hoverBg", "rgba(0, 0, 0, 0.09)");
        setColor(palette.FilledInput, "disabledBg", "rgba(0, 0, 0, 0.12)");
        setColor(palette.LinearProgress, "primaryBg", private_safeLighten(palette.primary.main, 0.62));
        setColor(palette.LinearProgress, "secondaryBg", private_safeLighten(palette.secondary.main, 0.62));
        setColor(palette.LinearProgress, "errorBg", private_safeLighten(palette.error.main, 0.62));
        setColor(palette.LinearProgress, "infoBg", private_safeLighten(palette.info.main, 0.62));
        setColor(palette.LinearProgress, "successBg", private_safeLighten(palette.success.main, 0.62));
        setColor(palette.LinearProgress, "warningBg", private_safeLighten(palette.warning.main, 0.62));
        setColor(palette.Skeleton, "bg", `rgba(${setCssVarColor("palette-text-primaryChannel")} / 0.11)`);
        setColor(palette.Slider, "primaryTrack", private_safeLighten(palette.primary.main, 0.62));
        setColor(palette.Slider, "secondaryTrack", private_safeLighten(palette.secondary.main, 0.62));
        setColor(palette.Slider, "errorTrack", private_safeLighten(palette.error.main, 0.62));
        setColor(palette.Slider, "infoTrack", private_safeLighten(palette.info.main, 0.62));
        setColor(palette.Slider, "successTrack", private_safeLighten(palette.success.main, 0.62));
        setColor(palette.Slider, "warningTrack", private_safeLighten(palette.warning.main, 0.62));
        const snackbarContentBackground = private_safeEmphasize(palette.background.default, 0.8);
        setColor(palette.SnackbarContent, "bg", snackbarContentBackground);
        setColor(palette.SnackbarContent, "color", silent(() => palette.getContrastText(snackbarContentBackground)));
        setColor(palette.SpeedDialAction, "fabHoverBg", private_safeEmphasize(palette.background.paper, 0.15));
        setColor(palette.StepConnector, "border", setCssVarColor("palette-grey-400"));
        setColor(palette.StepContent, "border", setCssVarColor("palette-grey-400"));
        setColor(palette.Switch, "defaultColor", setCssVarColor("palette-common-white"));
        setColor(palette.Switch, "defaultDisabledColor", setCssVarColor("palette-grey-100"));
        setColor(palette.Switch, "primaryDisabledColor", private_safeLighten(palette.primary.main, 0.62));
        setColor(palette.Switch, "secondaryDisabledColor", private_safeLighten(palette.secondary.main, 0.62));
        setColor(palette.Switch, "errorDisabledColor", private_safeLighten(palette.error.main, 0.62));
        setColor(palette.Switch, "infoDisabledColor", private_safeLighten(palette.info.main, 0.62));
        setColor(palette.Switch, "successDisabledColor", private_safeLighten(palette.success.main, 0.62));
        setColor(palette.Switch, "warningDisabledColor", private_safeLighten(palette.warning.main, 0.62));
        setColor(palette.TableCell, "border", private_safeLighten(private_safeAlpha(palette.divider, 1), 0.88));
        setColor(palette.Tooltip, "bg", private_safeAlpha(palette.grey[700], 0.92));
      }
      if (palette.mode === "dark") {
        setColor(palette.Alert, "errorColor", private_safeLighten(palette.error.light, 0.6));
        setColor(palette.Alert, "infoColor", private_safeLighten(palette.info.light, 0.6));
        setColor(palette.Alert, "successColor", private_safeLighten(palette.success.light, 0.6));
        setColor(palette.Alert, "warningColor", private_safeLighten(palette.warning.light, 0.6));
        setColor(palette.Alert, "errorFilledBg", setCssVarColor("palette-error-dark"));
        setColor(palette.Alert, "infoFilledBg", setCssVarColor("palette-info-dark"));
        setColor(palette.Alert, "successFilledBg", setCssVarColor("palette-success-dark"));
        setColor(palette.Alert, "warningFilledBg", setCssVarColor("palette-warning-dark"));
        setColor(palette.Alert, "errorFilledColor", silent(() => palette.getContrastText(palette.error.dark)));
        setColor(palette.Alert, "infoFilledColor", silent(() => palette.getContrastText(palette.info.dark)));
        setColor(palette.Alert, "successFilledColor", silent(() => palette.getContrastText(palette.success.dark)));
        setColor(palette.Alert, "warningFilledColor", silent(() => palette.getContrastText(palette.warning.dark)));
        setColor(palette.Alert, "errorStandardBg", private_safeDarken(palette.error.light, 0.9));
        setColor(palette.Alert, "infoStandardBg", private_safeDarken(palette.info.light, 0.9));
        setColor(palette.Alert, "successStandardBg", private_safeDarken(palette.success.light, 0.9));
        setColor(palette.Alert, "warningStandardBg", private_safeDarken(palette.warning.light, 0.9));
        setColor(palette.Alert, "errorIconColor", setCssVarColor("palette-error-main"));
        setColor(palette.Alert, "infoIconColor", setCssVarColor("palette-info-main"));
        setColor(palette.Alert, "successIconColor", setCssVarColor("palette-success-main"));
        setColor(palette.Alert, "warningIconColor", setCssVarColor("palette-warning-main"));
        setColor(palette.AppBar, "defaultBg", setCssVarColor("palette-grey-900"));
        setColor(palette.AppBar, "darkBg", setCssVarColor("palette-background-paper"));
        setColor(palette.AppBar, "darkColor", setCssVarColor("palette-text-primary"));
        setColor(palette.Avatar, "defaultBg", setCssVarColor("palette-grey-600"));
        setColor(palette.Button, "inheritContainedBg", setCssVarColor("palette-grey-800"));
        setColor(palette.Button, "inheritContainedHoverBg", setCssVarColor("palette-grey-700"));
        setColor(palette.Chip, "defaultBorder", setCssVarColor("palette-grey-700"));
        setColor(palette.Chip, "defaultAvatarColor", setCssVarColor("palette-grey-300"));
        setColor(palette.Chip, "defaultIconColor", setCssVarColor("palette-grey-300"));
        setColor(palette.FilledInput, "bg", "rgba(255, 255, 255, 0.09)");
        setColor(palette.FilledInput, "hoverBg", "rgba(255, 255, 255, 0.13)");
        setColor(palette.FilledInput, "disabledBg", "rgba(255, 255, 255, 0.12)");
        setColor(palette.LinearProgress, "primaryBg", private_safeDarken(palette.primary.main, 0.5));
        setColor(palette.LinearProgress, "secondaryBg", private_safeDarken(palette.secondary.main, 0.5));
        setColor(palette.LinearProgress, "errorBg", private_safeDarken(palette.error.main, 0.5));
        setColor(palette.LinearProgress, "infoBg", private_safeDarken(palette.info.main, 0.5));
        setColor(palette.LinearProgress, "successBg", private_safeDarken(palette.success.main, 0.5));
        setColor(palette.LinearProgress, "warningBg", private_safeDarken(palette.warning.main, 0.5));
        setColor(palette.Skeleton, "bg", `rgba(${setCssVarColor("palette-text-primaryChannel")} / 0.13)`);
        setColor(palette.Slider, "primaryTrack", private_safeDarken(palette.primary.main, 0.5));
        setColor(palette.Slider, "secondaryTrack", private_safeDarken(palette.secondary.main, 0.5));
        setColor(palette.Slider, "errorTrack", private_safeDarken(palette.error.main, 0.5));
        setColor(palette.Slider, "infoTrack", private_safeDarken(palette.info.main, 0.5));
        setColor(palette.Slider, "successTrack", private_safeDarken(palette.success.main, 0.5));
        setColor(palette.Slider, "warningTrack", private_safeDarken(palette.warning.main, 0.5));
        const snackbarContentBackground = private_safeEmphasize(palette.background.default, 0.98);
        setColor(palette.SnackbarContent, "bg", snackbarContentBackground);
        setColor(palette.SnackbarContent, "color", silent(() => palette.getContrastText(snackbarContentBackground)));
        setColor(palette.SpeedDialAction, "fabHoverBg", private_safeEmphasize(palette.background.paper, 0.15));
        setColor(palette.StepConnector, "border", setCssVarColor("palette-grey-600"));
        setColor(palette.StepContent, "border", setCssVarColor("palette-grey-600"));
        setColor(palette.Switch, "defaultColor", setCssVarColor("palette-grey-300"));
        setColor(palette.Switch, "defaultDisabledColor", setCssVarColor("palette-grey-600"));
        setColor(palette.Switch, "primaryDisabledColor", private_safeDarken(palette.primary.main, 0.55));
        setColor(palette.Switch, "secondaryDisabledColor", private_safeDarken(palette.secondary.main, 0.55));
        setColor(palette.Switch, "errorDisabledColor", private_safeDarken(palette.error.main, 0.55));
        setColor(palette.Switch, "infoDisabledColor", private_safeDarken(palette.info.main, 0.55));
        setColor(palette.Switch, "successDisabledColor", private_safeDarken(palette.success.main, 0.55));
        setColor(palette.Switch, "warningDisabledColor", private_safeDarken(palette.warning.main, 0.55));
        setColor(palette.TableCell, "border", private_safeDarken(private_safeAlpha(palette.divider, 1), 0.68));
        setColor(palette.Tooltip, "bg", private_safeAlpha(palette.grey[700], 0.92));
      }
      setColorChannel(palette.background, "default");
      setColorChannel(palette.background, "paper");
      setColorChannel(palette.common, "background");
      setColorChannel(palette.common, "onBackground");
      setColorChannel(palette, "divider");
      Object.keys(palette).forEach((color2) => {
        const colors = palette[color2];
        if (colors && typeof colors === "object") {
          if (colors.main) {
            setColor(palette[color2], "mainChannel", private_safeColorChannel(toRgb(colors.main)));
          }
          if (colors.light) {
            setColor(palette[color2], "lightChannel", private_safeColorChannel(toRgb(colors.light)));
          }
          if (colors.dark) {
            setColor(palette[color2], "darkChannel", private_safeColorChannel(toRgb(colors.dark)));
          }
          if (colors.contrastText) {
            setColor(palette[color2], "contrastTextChannel", private_safeColorChannel(toRgb(colors.contrastText)));
          }
          if (color2 === "text") {
            setColorChannel(palette[color2], "primary");
            setColorChannel(palette[color2], "secondary");
          }
          if (color2 === "action") {
            if (colors.active) {
              setColorChannel(palette[color2], "active");
            }
            if (colors.selected) {
              setColorChannel(palette[color2], "selected");
            }
          }
        }
      });
    });
    theme = args.reduce((acc, argument) => deepmerge(acc, argument), theme);
    const parserConfig = {
      prefix: cssVarPrefix,
      disableCssColorScheme,
      shouldSkipGeneratingVar: shouldSkipGeneratingVar$1,
      getSelector: defaultGetSelector(theme)
    };
    const {
      vars,
      generateThemeVars,
      generateStyleSheets
    } = prepareCssVars(theme, parserConfig);
    theme.vars = vars;
    Object.entries(theme.colorSchemes[theme.defaultColorScheme]).forEach(([key, value]) => {
      theme[key] = value;
    });
    theme.generateThemeVars = generateThemeVars;
    theme.generateStyleSheets = generateStyleSheets;
    theme.generateSpacing = function generateSpacing() {
      return createSpacing(input.spacing, createUnarySpacing(this));
    };
    theme.getColorSchemeSelector = createGetColorSchemeSelector(selector);
    theme.spacing = theme.generateSpacing();
    theme.shouldSkipGeneratingVar = shouldSkipGeneratingVar$1;
    theme.unstable_sxConfig = {
      ...defaultSxConfig,
      ...input == null ? void 0 : input.unstable_sxConfig
    };
    theme.unstable_sx = function sx(props) {
      return styleFunctionSx({
        sx: props,
        theme: this
      });
    };
    theme.toRuntimeSource = stringifyTheme;
    return theme;
  }
  function attachColorScheme(theme, scheme, colorScheme) {
    if (!theme.colorSchemes) {
      return void 0;
    }
    if (colorScheme) {
      theme.colorSchemes[scheme] = {
        ...colorScheme !== true && colorScheme,
        palette: createPalette({
          ...colorScheme === true ? {} : colorScheme.palette,
          mode: scheme
        })
        // cast type to skip module augmentation test
      };
    }
  }
  function createTheme(options = {}, ...args) {
    const {
      palette,
      cssVariables = false,
      colorSchemes: initialColorSchemes = !palette ? {
        light: true
      } : void 0,
      defaultColorScheme: initialDefaultColorScheme = palette == null ? void 0 : palette.mode,
      ...rest
    } = options;
    const defaultColorSchemeInput = initialDefaultColorScheme || "light";
    const defaultScheme = initialColorSchemes == null ? void 0 : initialColorSchemes[defaultColorSchemeInput];
    const colorSchemesInput = {
      ...initialColorSchemes,
      ...palette ? {
        [defaultColorSchemeInput]: {
          ...typeof defaultScheme !== "boolean" && defaultScheme,
          palette
        }
      } : void 0
    };
    if (cssVariables === false) {
      if (!("colorSchemes" in options)) {
        return createThemeNoVars(options, ...args);
      }
      let paletteOptions = palette;
      if (!("palette" in options)) {
        if (colorSchemesInput[defaultColorSchemeInput]) {
          if (colorSchemesInput[defaultColorSchemeInput] !== true) {
            paletteOptions = colorSchemesInput[defaultColorSchemeInput].palette;
          } else if (defaultColorSchemeInput === "dark") {
            paletteOptions = {
              mode: "dark"
            };
          }
        }
      }
      const theme = createThemeNoVars({
        ...options,
        palette: paletteOptions
      }, ...args);
      theme.defaultColorScheme = defaultColorSchemeInput;
      theme.colorSchemes = colorSchemesInput;
      if (theme.palette.mode === "light") {
        theme.colorSchemes.light = {
          ...colorSchemesInput.light !== true && colorSchemesInput.light,
          palette: theme.palette
        };
        attachColorScheme(theme, "dark", colorSchemesInput.dark);
      }
      if (theme.palette.mode === "dark") {
        theme.colorSchemes.dark = {
          ...colorSchemesInput.dark !== true && colorSchemesInput.dark,
          palette: theme.palette
        };
        attachColorScheme(theme, "light", colorSchemesInput.light);
      }
      return theme;
    }
    if (!palette && !("light" in colorSchemesInput) && defaultColorSchemeInput === "light") {
      colorSchemesInput.light = true;
    }
    return createThemeWithVars({
      ...rest,
      colorSchemes: colorSchemesInput,
      defaultColorScheme: defaultColorSchemeInput,
      ...typeof cssVariables !== "boolean" && cssVariables
    }, ...args);
  }
  const defaultTheme = createTheme();
  const THEME_ID = "$$material";
  function useTheme() {
    const theme = useTheme$1(defaultTheme);
    return theme[THEME_ID] || theme;
  }
  function slotShouldForwardProp(prop) {
    return prop !== "ownerState" && prop !== "theme" && prop !== "sx" && prop !== "as";
  }
  const rootShouldForwardProp = (prop) => slotShouldForwardProp(prop) && prop !== "classes";
  const styled = createStyled({
    themeId: THEME_ID,
    defaultTheme,
    rootShouldForwardProp
  });
  const memoTheme = unstable_memoTheme;
  function hasCorrectMainProperty(obj) {
    return typeof obj.main === "string";
  }
  function checkSimplePaletteColorValues(obj, additionalPropertiesToCheck = []) {
    if (!hasCorrectMainProperty(obj)) {
      return false;
    }
    for (const value of additionalPropertiesToCheck) {
      if (!obj.hasOwnProperty(value) || typeof obj[value] !== "string") {
        return false;
      }
    }
    return true;
  }
  function createSimplePaletteValueFilter(additionalPropertiesToCheck = []) {
    return ([, value]) => value && checkSimplePaletteColorValues(value, additionalPropertiesToCheck);
  }
  function useDefaultProps(params) {
    return useDefaultProps$1(params);
  }
  class LazyRipple {
    constructor() {
      __publicField(this, "mountEffect", () => {
        if (this.shouldMount && !this.didMount) {
          if (this.ref.current !== null) {
            this.didMount = true;
            this.mounted.resolve();
          }
        }
      });
      this.ref = {
        current: null
      };
      this.mounted = null;
      this.didMount = false;
      this.shouldMount = false;
      this.setShouldMount = null;
    }
    /** React ref to the ripple instance */
    /** If the ripple component should be mounted */
    /** Promise that resolves when the ripple component is mounted */
    /** If the ripple component has been mounted */
    /** React state hook setter */
    static create() {
      return new LazyRipple();
    }
    static use() {
      const ripple = useLazyRef(LazyRipple.create).current;
      const [shouldMount, setShouldMount] = reactExports.useState(false);
      ripple.shouldMount = shouldMount;
      ripple.setShouldMount = setShouldMount;
      reactExports.useEffect(ripple.mountEffect, [shouldMount]);
      return ripple;
    }
    mount() {
      if (!this.mounted) {
        this.mounted = createControlledPromise();
        this.shouldMount = true;
        this.setShouldMount(this.shouldMount);
      }
      return this.mounted;
    }
    /* Ripple API */
    start(...args) {
      this.mount().then(() => {
        var _a;
        return (_a = this.ref.current) == null ? void 0 : _a.start(...args);
      });
    }
    stop(...args) {
      this.mount().then(() => {
        var _a;
        return (_a = this.ref.current) == null ? void 0 : _a.stop(...args);
      });
    }
    pulsate(...args) {
      this.mount().then(() => {
        var _a;
        return (_a = this.ref.current) == null ? void 0 : _a.pulsate(...args);
      });
    }
  }
  function useLazyRipple() {
    return LazyRipple.use();
  }
  function createControlledPromise() {
    let resolve;
    let reject;
    const p2 = new Promise((resolveFn, rejectFn) => {
      resolve = resolveFn;
      reject = rejectFn;
    });
    p2.resolve = resolve;
    p2.reject = reject;
    return p2;
  }
  function _objectWithoutPropertiesLoose(r2, e2) {
    if (null == r2) return {};
    var t2 = {};
    for (var n2 in r2) if ({}.hasOwnProperty.call(r2, n2)) {
      if (e2.includes(n2)) continue;
      t2[n2] = r2[n2];
    }
    return t2;
  }
  function _setPrototypeOf(t2, e2) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e3) {
      return t3.__proto__ = e3, t3;
    }, _setPrototypeOf(t2, e2);
  }
  function _inheritsLoose(t2, o) {
    t2.prototype = Object.create(o.prototype), t2.prototype.constructor = t2, _setPrototypeOf(t2, o);
  }
  const config = {
    disabled: false
  };
  const TransitionGroupContext = React$1.createContext(null);
  var forceReflow = function forceReflow2(node2) {
    return node2.scrollTop;
  };
  var UNMOUNTED = "unmounted";
  var EXITED = "exited";
  var ENTERING = "entering";
  var ENTERED = "entered";
  var EXITING = "exiting";
  var Transition = /* @__PURE__ */ function(_React$Component) {
    _inheritsLoose(Transition2, _React$Component);
    function Transition2(props, context) {
      var _this;
      _this = _React$Component.call(this, props, context) || this;
      var parentGroup = context;
      var appear = parentGroup && !parentGroup.isMounting ? props.enter : props.appear;
      var initialStatus;
      _this.appearStatus = null;
      if (props.in) {
        if (appear) {
          initialStatus = EXITED;
          _this.appearStatus = ENTERING;
        } else {
          initialStatus = ENTERED;
        }
      } else {
        if (props.unmountOnExit || props.mountOnEnter) {
          initialStatus = UNMOUNTED;
        } else {
          initialStatus = EXITED;
        }
      }
      _this.state = {
        status: initialStatus
      };
      _this.nextCallback = null;
      return _this;
    }
    Transition2.getDerivedStateFromProps = function getDerivedStateFromProps(_ref, prevState) {
      var nextIn = _ref.in;
      if (nextIn && prevState.status === UNMOUNTED) {
        return {
          status: EXITED
        };
      }
      return null;
    };
    var _proto = Transition2.prototype;
    _proto.componentDidMount = function componentDidMount() {
      this.updateStatus(true, this.appearStatus);
    };
    _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
      var nextStatus = null;
      if (prevProps !== this.props) {
        var status = this.state.status;
        if (this.props.in) {
          if (status !== ENTERING && status !== ENTERED) {
            nextStatus = ENTERING;
          }
        } else {
          if (status === ENTERING || status === ENTERED) {
            nextStatus = EXITING;
          }
        }
      }
      this.updateStatus(false, nextStatus);
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      this.cancelNextCallback();
    };
    _proto.getTimeouts = function getTimeouts() {
      var timeout2 = this.props.timeout;
      var exit, enter, appear;
      exit = enter = appear = timeout2;
      if (timeout2 != null && typeof timeout2 !== "number") {
        exit = timeout2.exit;
        enter = timeout2.enter;
        appear = timeout2.appear !== void 0 ? timeout2.appear : enter;
      }
      return {
        exit,
        enter,
        appear
      };
    };
    _proto.updateStatus = function updateStatus(mounting, nextStatus) {
      if (mounting === void 0) {
        mounting = false;
      }
      if (nextStatus !== null) {
        this.cancelNextCallback();
        if (nextStatus === ENTERING) {
          if (this.props.unmountOnExit || this.props.mountOnEnter) {
            var node2 = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM.findDOMNode(this);
            if (node2) forceReflow(node2);
          }
          this.performEnter(mounting);
        } else {
          this.performExit();
        }
      } else if (this.props.unmountOnExit && this.state.status === EXITED) {
        this.setState({
          status: UNMOUNTED
        });
      }
    };
    _proto.performEnter = function performEnter(mounting) {
      var _this2 = this;
      var enter = this.props.enter;
      var appearing = this.context ? this.context.isMounting : mounting;
      var _ref2 = this.props.nodeRef ? [appearing] : [ReactDOM.findDOMNode(this), appearing], maybeNode = _ref2[0], maybeAppearing = _ref2[1];
      var timeouts = this.getTimeouts();
      var enterTimeout = appearing ? timeouts.appear : timeouts.enter;
      if (!mounting && !enter || config.disabled) {
        this.safeSetState({
          status: ENTERED
        }, function() {
          _this2.props.onEntered(maybeNode);
        });
        return;
      }
      this.props.onEnter(maybeNode, maybeAppearing);
      this.safeSetState({
        status: ENTERING
      }, function() {
        _this2.props.onEntering(maybeNode, maybeAppearing);
        _this2.onTransitionEnd(enterTimeout, function() {
          _this2.safeSetState({
            status: ENTERED
          }, function() {
            _this2.props.onEntered(maybeNode, maybeAppearing);
          });
        });
      });
    };
    _proto.performExit = function performExit() {
      var _this3 = this;
      var exit = this.props.exit;
      var timeouts = this.getTimeouts();
      var maybeNode = this.props.nodeRef ? void 0 : ReactDOM.findDOMNode(this);
      if (!exit || config.disabled) {
        this.safeSetState({
          status: EXITED
        }, function() {
          _this3.props.onExited(maybeNode);
        });
        return;
      }
      this.props.onExit(maybeNode);
      this.safeSetState({
        status: EXITING
      }, function() {
        _this3.props.onExiting(maybeNode);
        _this3.onTransitionEnd(timeouts.exit, function() {
          _this3.safeSetState({
            status: EXITED
          }, function() {
            _this3.props.onExited(maybeNode);
          });
        });
      });
    };
    _proto.cancelNextCallback = function cancelNextCallback() {
      if (this.nextCallback !== null) {
        this.nextCallback.cancel();
        this.nextCallback = null;
      }
    };
    _proto.safeSetState = function safeSetState(nextState, callback) {
      callback = this.setNextCallback(callback);
      this.setState(nextState, callback);
    };
    _proto.setNextCallback = function setNextCallback(callback) {
      var _this4 = this;
      var active = true;
      this.nextCallback = function(event) {
        if (active) {
          active = false;
          _this4.nextCallback = null;
          callback(event);
        }
      };
      this.nextCallback.cancel = function() {
        active = false;
      };
      return this.nextCallback;
    };
    _proto.onTransitionEnd = function onTransitionEnd(timeout2, handler) {
      this.setNextCallback(handler);
      var node2 = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM.findDOMNode(this);
      var doesNotHaveTimeoutOrListener = timeout2 == null && !this.props.addEndListener;
      if (!node2 || doesNotHaveTimeoutOrListener) {
        setTimeout(this.nextCallback, 0);
        return;
      }
      if (this.props.addEndListener) {
        var _ref3 = this.props.nodeRef ? [this.nextCallback] : [node2, this.nextCallback], maybeNode = _ref3[0], maybeNextCallback = _ref3[1];
        this.props.addEndListener(maybeNode, maybeNextCallback);
      }
      if (timeout2 != null) {
        setTimeout(this.nextCallback, timeout2);
      }
    };
    _proto.render = function render() {
      var status = this.state.status;
      if (status === UNMOUNTED) {
        return null;
      }
      var _this$props = this.props, children = _this$props.children;
      _this$props.in;
      _this$props.mountOnEnter;
      _this$props.unmountOnExit;
      _this$props.appear;
      _this$props.enter;
      _this$props.exit;
      _this$props.timeout;
      _this$props.addEndListener;
      _this$props.onEnter;
      _this$props.onEntering;
      _this$props.onEntered;
      _this$props.onExit;
      _this$props.onExiting;
      _this$props.onExited;
      _this$props.nodeRef;
      var childProps = _objectWithoutPropertiesLoose(_this$props, ["children", "in", "mountOnEnter", "unmountOnExit", "appear", "enter", "exit", "timeout", "addEndListener", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"]);
      return (
        // allows for nested Transitions
        /* @__PURE__ */ React$1.createElement(TransitionGroupContext.Provider, {
          value: null
        }, typeof children === "function" ? children(status, childProps) : React$1.cloneElement(React$1.Children.only(children), childProps))
      );
    };
    return Transition2;
  }(React$1.Component);
  Transition.contextType = TransitionGroupContext;
  Transition.propTypes = {};
  function noop() {
  }
  Transition.defaultProps = {
    in: false,
    mountOnEnter: false,
    unmountOnExit: false,
    appear: false,
    enter: true,
    exit: true,
    onEnter: noop,
    onEntering: noop,
    onEntered: noop,
    onExit: noop,
    onExiting: noop,
    onExited: noop
  };
  Transition.UNMOUNTED = UNMOUNTED;
  Transition.EXITED = EXITED;
  Transition.ENTERING = ENTERING;
  Transition.ENTERED = ENTERED;
  Transition.EXITING = EXITING;
  function _assertThisInitialized(e2) {
    if (void 0 === e2) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e2;
  }
  function getChildMapping(children, mapFn) {
    var mapper = function mapper2(child) {
      return mapFn && reactExports.isValidElement(child) ? mapFn(child) : child;
    };
    var result = /* @__PURE__ */ Object.create(null);
    if (children) reactExports.Children.map(children, function(c2) {
      return c2;
    }).forEach(function(child) {
      result[child.key] = mapper(child);
    });
    return result;
  }
  function mergeChildMappings(prev2, next2) {
    prev2 = prev2 || {};
    next2 = next2 || {};
    function getValueForKey(key) {
      return key in next2 ? next2[key] : prev2[key];
    }
    var nextKeysPending = /* @__PURE__ */ Object.create(null);
    var pendingKeys = [];
    for (var prevKey in prev2) {
      if (prevKey in next2) {
        if (pendingKeys.length) {
          nextKeysPending[prevKey] = pendingKeys;
          pendingKeys = [];
        }
      } else {
        pendingKeys.push(prevKey);
      }
    }
    var i;
    var childMapping = {};
    for (var nextKey in next2) {
      if (nextKeysPending[nextKey]) {
        for (i = 0; i < nextKeysPending[nextKey].length; i++) {
          var pendingNextKey = nextKeysPending[nextKey][i];
          childMapping[nextKeysPending[nextKey][i]] = getValueForKey(pendingNextKey);
        }
      }
      childMapping[nextKey] = getValueForKey(nextKey);
    }
    for (i = 0; i < pendingKeys.length; i++) {
      childMapping[pendingKeys[i]] = getValueForKey(pendingKeys[i]);
    }
    return childMapping;
  }
  function getProp(child, prop, props) {
    return props[prop] != null ? props[prop] : child.props[prop];
  }
  function getInitialChildMapping(props, onExited) {
    return getChildMapping(props.children, function(child) {
      return reactExports.cloneElement(child, {
        onExited: onExited.bind(null, child),
        in: true,
        appear: getProp(child, "appear", props),
        enter: getProp(child, "enter", props),
        exit: getProp(child, "exit", props)
      });
    });
  }
  function getNextChildMapping(nextProps, prevChildMapping, onExited) {
    var nextChildMapping = getChildMapping(nextProps.children);
    var children = mergeChildMappings(prevChildMapping, nextChildMapping);
    Object.keys(children).forEach(function(key) {
      var child = children[key];
      if (!reactExports.isValidElement(child)) return;
      var hasPrev = key in prevChildMapping;
      var hasNext = key in nextChildMapping;
      var prevChild = prevChildMapping[key];
      var isLeaving = reactExports.isValidElement(prevChild) && !prevChild.props.in;
      if (hasNext && (!hasPrev || isLeaving)) {
        children[key] = reactExports.cloneElement(child, {
          onExited: onExited.bind(null, child),
          in: true,
          exit: getProp(child, "exit", nextProps),
          enter: getProp(child, "enter", nextProps)
        });
      } else if (!hasNext && hasPrev && !isLeaving) {
        children[key] = reactExports.cloneElement(child, {
          in: false
        });
      } else if (hasNext && hasPrev && reactExports.isValidElement(prevChild)) {
        children[key] = reactExports.cloneElement(child, {
          onExited: onExited.bind(null, child),
          in: prevChild.props.in,
          exit: getProp(child, "exit", nextProps),
          enter: getProp(child, "enter", nextProps)
        });
      }
    });
    return children;
  }
  var values = Object.values || function(obj) {
    return Object.keys(obj).map(function(k2) {
      return obj[k2];
    });
  };
  var defaultProps = {
    component: "div",
    childFactory: function childFactory(child) {
      return child;
    }
  };
  var TransitionGroup = /* @__PURE__ */ function(_React$Component) {
    _inheritsLoose(TransitionGroup2, _React$Component);
    function TransitionGroup2(props, context) {
      var _this;
      _this = _React$Component.call(this, props, context) || this;
      var handleExited = _this.handleExited.bind(_assertThisInitialized(_this));
      _this.state = {
        contextValue: {
          isMounting: true
        },
        handleExited,
        firstRender: true
      };
      return _this;
    }
    var _proto = TransitionGroup2.prototype;
    _proto.componentDidMount = function componentDidMount() {
      this.mounted = true;
      this.setState({
        contextValue: {
          isMounting: false
        }
      });
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      this.mounted = false;
    };
    TransitionGroup2.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, _ref) {
      var prevChildMapping = _ref.children, handleExited = _ref.handleExited, firstRender = _ref.firstRender;
      return {
        children: firstRender ? getInitialChildMapping(nextProps, handleExited) : getNextChildMapping(nextProps, prevChildMapping, handleExited),
        firstRender: false
      };
    };
    _proto.handleExited = function handleExited(child, node2) {
      var currentChildMapping = getChildMapping(this.props.children);
      if (child.key in currentChildMapping) return;
      if (child.props.onExited) {
        child.props.onExited(node2);
      }
      if (this.mounted) {
        this.setState(function(state) {
          var children = _extends({}, state.children);
          delete children[child.key];
          return {
            children
          };
        });
      }
    };
    _proto.render = function render() {
      var _this$props = this.props, Component = _this$props.component, childFactory2 = _this$props.childFactory, props = _objectWithoutPropertiesLoose(_this$props, ["component", "childFactory"]);
      var contextValue = this.state.contextValue;
      var children = values(this.state.children).map(childFactory2);
      delete props.appear;
      delete props.enter;
      delete props.exit;
      if (Component === null) {
        return /* @__PURE__ */ React$1.createElement(TransitionGroupContext.Provider, {
          value: contextValue
        }, children);
      }
      return /* @__PURE__ */ React$1.createElement(TransitionGroupContext.Provider, {
        value: contextValue
      }, /* @__PURE__ */ React$1.createElement(Component, props, children));
    };
    return TransitionGroup2;
  }(React$1.Component);
  TransitionGroup.propTypes = {};
  TransitionGroup.defaultProps = defaultProps;
  function Ripple(props) {
    const {
      className,
      classes,
      pulsate = false,
      rippleX,
      rippleY,
      rippleSize,
      in: inProp,
      onExited,
      timeout
    } = props;
    const [leaving, setLeaving] = reactExports.useState(false);
    const rippleClassName = clsx(className, classes.ripple, classes.rippleVisible, pulsate && classes.ripplePulsate);
    const rippleStyles = {
      width: rippleSize,
      height: rippleSize,
      top: -(rippleSize / 2) + rippleY,
      left: -(rippleSize / 2) + rippleX
    };
    const childClassName = clsx(classes.child, leaving && classes.childLeaving, pulsate && classes.childPulsate);
    if (!inProp && !leaving) {
      setLeaving(true);
    }
    reactExports.useEffect(() => {
      if (!inProp && onExited != null) {
        const timeoutId = setTimeout(onExited, timeout);
        return () => {
          clearTimeout(timeoutId);
        };
      }
      return void 0;
    }, [onExited, inProp, timeout]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
      className: rippleClassName,
      style: rippleStyles,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
        className: childClassName
      })
    });
  }
  const touchRippleClasses = generateUtilityClasses("MuiTouchRipple", ["root", "ripple", "rippleVisible", "ripplePulsate", "child", "childLeaving", "childPulsate"]);
  const DURATION = 550;
  const DELAY_RIPPLE = 80;
  const enterKeyframe = keyframes`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`;
  const exitKeyframe = keyframes`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;
  const pulsateKeyframe = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`;
  const TouchRippleRoot = styled("span", {
    name: "MuiTouchRipple",
    slot: "Root"
  })({
    overflow: "hidden",
    pointerEvents: "none",
    position: "absolute",
    zIndex: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: "inherit"
  });
  const TouchRippleRipple = styled(Ripple, {
    name: "MuiTouchRipple",
    slot: "Ripple"
  })`
  opacity: 0;
  position: absolute;

  &.${touchRippleClasses.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${enterKeyframe};
    animation-duration: ${DURATION}ms;
    animation-timing-function: ${({
    theme
  }) => theme.transitions.easing.easeInOut};
  }

  &.${touchRippleClasses.ripplePulsate} {
    animation-duration: ${({
    theme
  }) => theme.transitions.duration.shorter}ms;
  }

  & .${touchRippleClasses.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${touchRippleClasses.childLeaving} {
    opacity: 0;
    animation-name: ${exitKeyframe};
    animation-duration: ${DURATION}ms;
    animation-timing-function: ${({
    theme
  }) => theme.transitions.easing.easeInOut};
  }

  & .${touchRippleClasses.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${pulsateKeyframe};
    animation-duration: 2500ms;
    animation-timing-function: ${({
    theme
  }) => theme.transitions.easing.easeInOut};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`;
  const TouchRipple = /* @__PURE__ */ reactExports.forwardRef(function TouchRipple2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiTouchRipple"
    });
    const {
      center: centerProp = false,
      classes = {},
      className,
      ...other
    } = props;
    const [ripples, setRipples] = reactExports.useState([]);
    const nextKey = reactExports.useRef(0);
    const rippleCallback = reactExports.useRef(null);
    reactExports.useEffect(() => {
      if (rippleCallback.current) {
        rippleCallback.current();
        rippleCallback.current = null;
      }
    }, [ripples]);
    const ignoringMouseDown = reactExports.useRef(false);
    const startTimer = useTimeout();
    const startTimerCommit = reactExports.useRef(null);
    const container = reactExports.useRef(null);
    const startCommit = reactExports.useCallback((params) => {
      const {
        pulsate: pulsate2,
        rippleX,
        rippleY,
        rippleSize,
        cb: cb2
      } = params;
      setRipples((oldRipples) => [...oldRipples, /* @__PURE__ */ jsxRuntimeExports.jsx(TouchRippleRipple, {
        classes: {
          ripple: clsx(classes.ripple, touchRippleClasses.ripple),
          rippleVisible: clsx(classes.rippleVisible, touchRippleClasses.rippleVisible),
          ripplePulsate: clsx(classes.ripplePulsate, touchRippleClasses.ripplePulsate),
          child: clsx(classes.child, touchRippleClasses.child),
          childLeaving: clsx(classes.childLeaving, touchRippleClasses.childLeaving),
          childPulsate: clsx(classes.childPulsate, touchRippleClasses.childPulsate)
        },
        timeout: DURATION,
        pulsate: pulsate2,
        rippleX,
        rippleY,
        rippleSize
      }, nextKey.current)]);
      nextKey.current += 1;
      rippleCallback.current = cb2;
    }, [classes]);
    const start = reactExports.useCallback((event = {}, options = {}, cb2 = () => {
    }) => {
      const {
        pulsate: pulsate2 = false,
        center = centerProp || options.pulsate,
        fakeElement = false
        // For test purposes
      } = options;
      if ((event == null ? void 0 : event.type) === "mousedown" && ignoringMouseDown.current) {
        ignoringMouseDown.current = false;
        return;
      }
      if ((event == null ? void 0 : event.type) === "touchstart") {
        ignoringMouseDown.current = true;
      }
      const element = fakeElement ? null : container.current;
      const rect = element ? element.getBoundingClientRect() : {
        width: 0,
        height: 0,
        left: 0,
        top: 0
      };
      let rippleX;
      let rippleY;
      let rippleSize;
      if (center || event === void 0 || event.clientX === 0 && event.clientY === 0 || !event.clientX && !event.touches) {
        rippleX = Math.round(rect.width / 2);
        rippleY = Math.round(rect.height / 2);
      } else {
        const {
          clientX,
          clientY
        } = event.touches && event.touches.length > 0 ? event.touches[0] : event;
        rippleX = Math.round(clientX - rect.left);
        rippleY = Math.round(clientY - rect.top);
      }
      if (center) {
        rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);
        if (rippleSize % 2 === 0) {
          rippleSize += 1;
        }
      } else {
        const sizeX = Math.max(Math.abs((element ? element.clientWidth : 0) - rippleX), rippleX) * 2 + 2;
        const sizeY = Math.max(Math.abs((element ? element.clientHeight : 0) - rippleY), rippleY) * 2 + 2;
        rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
      }
      if (event == null ? void 0 : event.touches) {
        if (startTimerCommit.current === null) {
          startTimerCommit.current = () => {
            startCommit({
              pulsate: pulsate2,
              rippleX,
              rippleY,
              rippleSize,
              cb: cb2
            });
          };
          startTimer.start(DELAY_RIPPLE, () => {
            if (startTimerCommit.current) {
              startTimerCommit.current();
              startTimerCommit.current = null;
            }
          });
        }
      } else {
        startCommit({
          pulsate: pulsate2,
          rippleX,
          rippleY,
          rippleSize,
          cb: cb2
        });
      }
    }, [centerProp, startCommit, startTimer]);
    const pulsate = reactExports.useCallback(() => {
      start({}, {
        pulsate: true
      });
    }, [start]);
    const stop = reactExports.useCallback((event, cb2) => {
      startTimer.clear();
      if ((event == null ? void 0 : event.type) === "touchend" && startTimerCommit.current) {
        startTimerCommit.current();
        startTimerCommit.current = null;
        startTimer.start(0, () => {
          stop(event, cb2);
        });
        return;
      }
      startTimerCommit.current = null;
      setRipples((oldRipples) => {
        if (oldRipples.length > 0) {
          return oldRipples.slice(1);
        }
        return oldRipples;
      });
      rippleCallback.current = cb2;
    }, [startTimer]);
    reactExports.useImperativeHandle(ref, () => ({
      pulsate,
      start,
      stop
    }), [pulsate, start, stop]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TouchRippleRoot, {
      className: clsx(touchRippleClasses.root, classes.root, className),
      ref: container,
      ...other,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionGroup, {
        component: null,
        exit: true,
        children: ripples
      })
    });
  });
  function getButtonBaseUtilityClass(slot) {
    return generateUtilityClass("MuiButtonBase", slot);
  }
  const buttonBaseClasses = generateUtilityClasses("MuiButtonBase", ["root", "disabled", "focusVisible"]);
  const useUtilityClasses$6 = (ownerState) => {
    const {
      disabled,
      focusVisible,
      focusVisibleClassName,
      classes
    } = ownerState;
    const slots = {
      root: ["root", disabled && "disabled", focusVisible && "focusVisible"]
    };
    const composedClasses = composeClasses(slots, getButtonBaseUtilityClass, classes);
    if (focusVisible && focusVisibleClassName) {
      composedClasses.root += ` ${focusVisibleClassName}`;
    }
    return composedClasses;
  };
  const ButtonBaseRoot = styled("button", {
    name: "MuiButtonBase",
    slot: "Root",
    overridesResolver: (props, styles2) => styles2.root
  })({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxSizing: "border-box",
    WebkitTapHighlightColor: "transparent",
    backgroundColor: "transparent",
    // Reset default value
    // We disable the focus ring for mouse, touch and keyboard users.
    outline: 0,
    border: 0,
    margin: 0,
    // Remove the margin in Safari
    borderRadius: 0,
    padding: 0,
    // Remove the padding in Firefox
    cursor: "pointer",
    userSelect: "none",
    verticalAlign: "middle",
    MozAppearance: "none",
    // Reset
    WebkitAppearance: "none",
    // Reset
    textDecoration: "none",
    // So we take precedent over the style of a native <a /> element.
    color: "inherit",
    "&::-moz-focus-inner": {
      borderStyle: "none"
      // Remove Firefox dotted outline.
    },
    [`&.${buttonBaseClasses.disabled}`]: {
      pointerEvents: "none",
      // Disable link interactions
      cursor: "default"
    },
    "@media print": {
      colorAdjust: "exact"
    }
  });
  const ButtonBase = /* @__PURE__ */ reactExports.forwardRef(function ButtonBase2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiButtonBase"
    });
    const {
      action,
      centerRipple = false,
      children,
      className,
      component = "button",
      disabled = false,
      disableRipple = false,
      disableTouchRipple = false,
      focusRipple = false,
      focusVisibleClassName,
      LinkComponent = "a",
      onBlur,
      onClick,
      onContextMenu,
      onDragLeave,
      onFocus,
      onFocusVisible,
      onKeyDown,
      onKeyUp,
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onTouchEnd,
      onTouchMove,
      onTouchStart,
      tabIndex = 0,
      TouchRippleProps,
      touchRippleRef,
      type,
      ...other
    } = props;
    const buttonRef = reactExports.useRef(null);
    const ripple = useLazyRipple();
    const handleRippleRef = useForkRef(ripple.ref, touchRippleRef);
    const [focusVisible, setFocusVisible] = reactExports.useState(false);
    if (disabled && focusVisible) {
      setFocusVisible(false);
    }
    reactExports.useImperativeHandle(action, () => ({
      focusVisible: () => {
        setFocusVisible(true);
        buttonRef.current.focus();
      }
    }), []);
    const enableTouchRipple = ripple.shouldMount && !disableRipple && !disabled;
    reactExports.useEffect(() => {
      if (focusVisible && focusRipple && !disableRipple) {
        ripple.pulsate();
      }
    }, [disableRipple, focusRipple, focusVisible, ripple]);
    function useRippleHandler(rippleAction, eventCallback, skipRippleAction = disableTouchRipple) {
      return useEventCallback((event) => {
        if (eventCallback) {
          eventCallback(event);
        }
        const ignore = skipRippleAction;
        if (!ignore) {
          ripple[rippleAction](event);
        }
        return true;
      });
    }
    const handleMouseDown = useRippleHandler("start", onMouseDown);
    const handleContextMenu = useRippleHandler("stop", onContextMenu);
    const handleDragLeave = useRippleHandler("stop", onDragLeave);
    const handleMouseUp = useRippleHandler("stop", onMouseUp);
    const handleMouseLeave = useRippleHandler("stop", (event) => {
      if (focusVisible) {
        event.preventDefault();
      }
      if (onMouseLeave) {
        onMouseLeave(event);
      }
    });
    const handleTouchStart = useRippleHandler("start", onTouchStart);
    const handleTouchEnd = useRippleHandler("stop", onTouchEnd);
    const handleTouchMove = useRippleHandler("stop", onTouchMove);
    const handleBlur = useRippleHandler("stop", (event) => {
      if (!isFocusVisible(event.target)) {
        setFocusVisible(false);
      }
      if (onBlur) {
        onBlur(event);
      }
    }, false);
    const handleFocus = useEventCallback((event) => {
      if (!buttonRef.current) {
        buttonRef.current = event.currentTarget;
      }
      if (isFocusVisible(event.target)) {
        setFocusVisible(true);
        if (onFocusVisible) {
          onFocusVisible(event);
        }
      }
      if (onFocus) {
        onFocus(event);
      }
    });
    const isNonNativeButton = () => {
      const button = buttonRef.current;
      return component && component !== "button" && !(button.tagName === "A" && button.href);
    };
    const handleKeyDown = useEventCallback((event) => {
      if (focusRipple && !event.repeat && focusVisible && event.key === " ") {
        ripple.stop(event, () => {
          ripple.start(event);
        });
      }
      if (event.target === event.currentTarget && isNonNativeButton() && event.key === " ") {
        event.preventDefault();
      }
      if (onKeyDown) {
        onKeyDown(event);
      }
      if (event.target === event.currentTarget && isNonNativeButton() && event.key === "Enter" && !disabled) {
        event.preventDefault();
        if (onClick) {
          onClick(event);
        }
      }
    });
    const handleKeyUp = useEventCallback((event) => {
      if (focusRipple && event.key === " " && focusVisible && !event.defaultPrevented) {
        ripple.stop(event, () => {
          ripple.pulsate(event);
        });
      }
      if (onKeyUp) {
        onKeyUp(event);
      }
      if (onClick && event.target === event.currentTarget && isNonNativeButton() && event.key === " " && !event.defaultPrevented) {
        onClick(event);
      }
    });
    let ComponentProp = component;
    if (ComponentProp === "button" && (other.href || other.to)) {
      ComponentProp = LinkComponent;
    }
    const buttonProps = {};
    if (ComponentProp === "button") {
      buttonProps.type = type === void 0 ? "button" : type;
      buttonProps.disabled = disabled;
    } else {
      if (!other.href && !other.to) {
        buttonProps.role = "button";
      }
      if (disabled) {
        buttonProps["aria-disabled"] = disabled;
      }
    }
    const handleRef = useForkRef(ref, buttonRef);
    const ownerState = {
      ...props,
      centerRipple,
      component,
      disabled,
      disableRipple,
      disableTouchRipple,
      focusRipple,
      tabIndex,
      focusVisible
    };
    const classes = useUtilityClasses$6(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonBaseRoot, {
      as: ComponentProp,
      className: clsx(classes.root, className),
      ownerState,
      onBlur: handleBlur,
      onClick,
      onContextMenu: handleContextMenu,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp,
      onMouseDown: handleMouseDown,
      onMouseLeave: handleMouseLeave,
      onMouseUp: handleMouseUp,
      onDragLeave: handleDragLeave,
      onTouchEnd: handleTouchEnd,
      onTouchMove: handleTouchMove,
      onTouchStart: handleTouchStart,
      ref: handleRef,
      tabIndex: disabled ? -1 : tabIndex,
      type,
      ...buttonProps,
      ...other,
      children: [children, enableTouchRipple ? /* @__PURE__ */ jsxRuntimeExports.jsx(TouchRipple, {
        ref: handleRippleRef,
        center: centerRipple,
        ...TouchRippleProps
      }) : null]
    });
  });
  function getIconButtonUtilityClass(slot) {
    return generateUtilityClass("MuiIconButton", slot);
  }
  const iconButtonClasses = generateUtilityClasses("MuiIconButton", ["root", "disabled", "colorInherit", "colorPrimary", "colorSecondary", "colorError", "colorInfo", "colorSuccess", "colorWarning", "edgeStart", "edgeEnd", "sizeSmall", "sizeMedium", "sizeLarge"]);
  const useUtilityClasses$5 = (ownerState) => {
    const {
      classes,
      disabled,
      color: color2,
      edge,
      size
    } = ownerState;
    const slots = {
      root: ["root", disabled && "disabled", color2 !== "default" && `color${capitalize(color2)}`, edge && `edge${capitalize(edge)}`, `size${capitalize(size)}`]
    };
    return composeClasses(slots, getIconButtonUtilityClass, classes);
  };
  const IconButtonRoot = styled(ButtonBase, {
    name: "MuiIconButton",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.color !== "default" && styles2[`color${capitalize(ownerState.color)}`], ownerState.edge && styles2[`edge${capitalize(ownerState.edge)}`], styles2[`size${capitalize(ownerState.size)}`]];
    }
  })(memoTheme(({
    theme
  }) => ({
    textAlign: "center",
    flex: "0 0 auto",
    fontSize: theme.typography.pxToRem(24),
    padding: 8,
    borderRadius: "50%",
    color: (theme.vars || theme).palette.action.active,
    transition: theme.transitions.create("background-color", {
      duration: theme.transitions.duration.shortest
    }),
    variants: [{
      props: (props) => !props.disableRipple,
      style: {
        "--IconButton-hoverBg": theme.vars ? `rgba(${theme.vars.palette.action.activeChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
        "&:hover": {
          backgroundColor: "var(--IconButton-hoverBg)",
          // Reset on touch devices, it doesn't add specificity
          "@media (hover: none)": {
            backgroundColor: "transparent"
          }
        }
      }
    }, {
      props: {
        edge: "start"
      },
      style: {
        marginLeft: -12
      }
    }, {
      props: {
        edge: "start",
        size: "small"
      },
      style: {
        marginLeft: -3
      }
    }, {
      props: {
        edge: "end"
      },
      style: {
        marginRight: -12
      }
    }, {
      props: {
        edge: "end",
        size: "small"
      },
      style: {
        marginRight: -3
      }
    }]
  })), memoTheme(({
    theme
  }) => ({
    variants: [{
      props: {
        color: "inherit"
      },
      style: {
        color: "inherit"
      }
    }, ...Object.entries(theme.palette).filter(createSimplePaletteValueFilter()).map(([color2]) => ({
      props: {
        color: color2
      },
      style: {
        color: (theme.vars || theme).palette[color2].main
      }
    })), ...Object.entries(theme.palette).filter(createSimplePaletteValueFilter()).map(([color2]) => ({
      props: {
        color: color2
      },
      style: {
        "--IconButton-hoverBg": theme.vars ? `rgba(${(theme.vars || theme).palette[color2].mainChannel} / ${theme.vars.palette.action.hoverOpacity})` : alpha((theme.vars || theme).palette[color2].main, theme.palette.action.hoverOpacity)
      }
    })), {
      props: {
        size: "small"
      },
      style: {
        padding: 5,
        fontSize: theme.typography.pxToRem(18)
      }
    }, {
      props: {
        size: "large"
      },
      style: {
        padding: 12,
        fontSize: theme.typography.pxToRem(28)
      }
    }],
    [`&.${iconButtonClasses.disabled}`]: {
      backgroundColor: "transparent",
      color: (theme.vars || theme).palette.action.disabled
    }
  })));
  const IconButton = /* @__PURE__ */ reactExports.forwardRef(function IconButton2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiIconButton"
    });
    const {
      edge = false,
      children,
      className,
      color: color2 = "default",
      disabled = false,
      disableFocusRipple = false,
      size = "medium",
      ...other
    } = props;
    const ownerState = {
      ...props,
      edge,
      color: color2,
      disabled,
      disableFocusRipple,
      size
    };
    const classes = useUtilityClasses$5(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(IconButtonRoot, {
      className: clsx(classes.root, className),
      centerRipple: true,
      focusRipple: !disableFocusRipple,
      disabled,
      ref,
      ...other,
      ownerState,
      children
    });
  });
  function getSvgIconUtilityClass(slot) {
    return generateUtilityClass("MuiSvgIcon", slot);
  }
  generateUtilityClasses("MuiSvgIcon", ["root", "colorPrimary", "colorSecondary", "colorAction", "colorError", "colorDisabled", "fontSizeInherit", "fontSizeSmall", "fontSizeMedium", "fontSizeLarge"]);
  const useUtilityClasses$4 = (ownerState) => {
    const {
      color: color2,
      fontSize,
      classes
    } = ownerState;
    const slots = {
      root: ["root", color2 !== "inherit" && `color${capitalize(color2)}`, `fontSize${capitalize(fontSize)}`]
    };
    return composeClasses(slots, getSvgIconUtilityClass, classes);
  };
  const SvgIconRoot = styled("svg", {
    name: "MuiSvgIcon",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.color !== "inherit" && styles2[`color${capitalize(ownerState.color)}`], styles2[`fontSize${capitalize(ownerState.fontSize)}`]];
    }
  })(memoTheme(({
    theme
  }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    return {
      userSelect: "none",
      width: "1em",
      height: "1em",
      display: "inline-block",
      flexShrink: 0,
      transition: (_d = (_a = theme.transitions) == null ? void 0 : _a.create) == null ? void 0 : _d.call(_a, "fill", {
        duration: (_c = (_b = (theme.vars ?? theme).transitions) == null ? void 0 : _b.duration) == null ? void 0 : _c.shorter
      }),
      variants: [
        {
          props: (props) => !props.hasSvgAsChild,
          style: {
            // the <svg> will define the property that has `currentColor`
            // for example heroicons uses fill="none" and stroke="currentColor"
            fill: "currentColor"
          }
        },
        {
          props: {
            fontSize: "inherit"
          },
          style: {
            fontSize: "inherit"
          }
        },
        {
          props: {
            fontSize: "small"
          },
          style: {
            fontSize: ((_f = (_e = theme.typography) == null ? void 0 : _e.pxToRem) == null ? void 0 : _f.call(_e, 20)) || "1.25rem"
          }
        },
        {
          props: {
            fontSize: "medium"
          },
          style: {
            fontSize: ((_h = (_g = theme.typography) == null ? void 0 : _g.pxToRem) == null ? void 0 : _h.call(_g, 24)) || "1.5rem"
          }
        },
        {
          props: {
            fontSize: "large"
          },
          style: {
            fontSize: ((_j = (_i = theme.typography) == null ? void 0 : _i.pxToRem) == null ? void 0 : _j.call(_i, 35)) || "2.1875rem"
          }
        },
        // TODO v5 deprecate color prop, v6 remove for sx
        ...Object.entries((theme.vars ?? theme).palette).filter(([, value]) => value && value.main).map(([color2]) => {
          var _a2, _b2;
          return {
            props: {
              color: color2
            },
            style: {
              color: (_b2 = (_a2 = (theme.vars ?? theme).palette) == null ? void 0 : _a2[color2]) == null ? void 0 : _b2.main
            }
          };
        }),
        {
          props: {
            color: "action"
          },
          style: {
            color: (_l = (_k = (theme.vars ?? theme).palette) == null ? void 0 : _k.action) == null ? void 0 : _l.active
          }
        },
        {
          props: {
            color: "disabled"
          },
          style: {
            color: (_n = (_m = (theme.vars ?? theme).palette) == null ? void 0 : _m.action) == null ? void 0 : _n.disabled
          }
        },
        {
          props: {
            color: "inherit"
          },
          style: {
            color: void 0
          }
        }
      ]
    };
  }));
  const SvgIcon = /* @__PURE__ */ reactExports.forwardRef(function SvgIcon2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiSvgIcon"
    });
    const {
      children,
      className,
      color: color2 = "inherit",
      component = "svg",
      fontSize = "medium",
      htmlColor,
      inheritViewBox = false,
      titleAccess,
      viewBox = "0 0 24 24",
      ...other
    } = props;
    const hasSvgAsChild = /* @__PURE__ */ reactExports.isValidElement(children) && children.type === "svg";
    const ownerState = {
      ...props,
      color: color2,
      component,
      fontSize,
      instanceFontSize: inProps.fontSize,
      inheritViewBox,
      viewBox,
      hasSvgAsChild
    };
    const more = {};
    if (!inheritViewBox) {
      more.viewBox = viewBox;
    }
    const classes = useUtilityClasses$4(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SvgIconRoot, {
      as: component,
      className: clsx(classes.root, className),
      focusable: "false",
      color: htmlColor,
      "aria-hidden": titleAccess ? void 0 : true,
      role: titleAccess ? "img" : void 0,
      ref,
      ...more,
      ...other,
      ...hasSvgAsChild && children.props,
      ownerState,
      children: [hasSvgAsChild ? children.props.children : children, titleAccess ? /* @__PURE__ */ jsxRuntimeExports.jsx("title", {
        children: titleAccess
      }) : null]
    });
  });
  if (SvgIcon) {
    SvgIcon.muiName = "SvgIcon";
  }
  function createSvgIcon(path, displayName) {
    function Component(props, ref) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SvgIcon, {
        "data-testid": `${displayName}Icon`,
        ref,
        ...props,
        children: path
      });
    }
    Component.muiName = SvgIcon.muiName;
    return /* @__PURE__ */ reactExports.memo(/* @__PURE__ */ reactExports.forwardRef(Component));
  }
  const ReadMoreIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
    d: "M13 7h9v2h-9zm0 8h9v2h-9zm3-4h6v2h-6zm-3 1L8 7v4H2v2h6v4z"
  }), "ReadMore");
  function isOverflowing(container) {
    const doc = ownerDocument(container);
    if (doc.body === container) {
      return ownerWindow(container).innerWidth > doc.documentElement.clientWidth;
    }
    return container.scrollHeight > container.clientHeight;
  }
  function ariaHidden(element, hide) {
    if (hide) {
      element.setAttribute("aria-hidden", "true");
    } else {
      element.removeAttribute("aria-hidden");
    }
  }
  function getPaddingRight(element) {
    return parseInt(ownerWindow(element).getComputedStyle(element).paddingRight, 10) || 0;
  }
  function isAriaHiddenForbiddenOnElement(element) {
    const forbiddenTagNames = ["TEMPLATE", "SCRIPT", "STYLE", "LINK", "MAP", "META", "NOSCRIPT", "PICTURE", "COL", "COLGROUP", "PARAM", "SLOT", "SOURCE", "TRACK"];
    const isForbiddenTagName = forbiddenTagNames.includes(element.tagName);
    const isInputHidden = element.tagName === "INPUT" && element.getAttribute("type") === "hidden";
    return isForbiddenTagName || isInputHidden;
  }
  function ariaHiddenSiblings(container, mountElement, currentElement, elementsToExclude, hide) {
    const blacklist = [mountElement, currentElement, ...elementsToExclude];
    [].forEach.call(container.children, (element) => {
      const isNotExcludedElement = !blacklist.includes(element);
      const isNotForbiddenElement = !isAriaHiddenForbiddenOnElement(element);
      if (isNotExcludedElement && isNotForbiddenElement) {
        ariaHidden(element, hide);
      }
    });
  }
  function findIndexOf(items, callback) {
    let idx = -1;
    items.some((item, index) => {
      if (callback(item)) {
        idx = index;
        return true;
      }
      return false;
    });
    return idx;
  }
  function handleContainer(containerInfo, props) {
    const restoreStyle = [];
    const container = containerInfo.container;
    if (!props.disableScrollLock) {
      if (isOverflowing(container)) {
        const scrollbarSize = getScrollbarSize(ownerWindow(container));
        restoreStyle.push({
          value: container.style.paddingRight,
          property: "padding-right",
          el: container
        });
        container.style.paddingRight = `${getPaddingRight(container) + scrollbarSize}px`;
        const fixedElements2 = ownerDocument(container).querySelectorAll(".mui-fixed");
        [].forEach.call(fixedElements2, (element) => {
          restoreStyle.push({
            value: element.style.paddingRight,
            property: "padding-right",
            el: element
          });
          element.style.paddingRight = `${getPaddingRight(element) + scrollbarSize}px`;
        });
      }
      let scrollContainer;
      if (container.parentNode instanceof DocumentFragment) {
        scrollContainer = ownerDocument(container).body;
      } else {
        const parent = container.parentElement;
        const containerWindow = ownerWindow(container);
        scrollContainer = (parent == null ? void 0 : parent.nodeName) === "HTML" && containerWindow.getComputedStyle(parent).overflowY === "scroll" ? parent : container;
      }
      restoreStyle.push({
        value: scrollContainer.style.overflow,
        property: "overflow",
        el: scrollContainer
      }, {
        value: scrollContainer.style.overflowX,
        property: "overflow-x",
        el: scrollContainer
      }, {
        value: scrollContainer.style.overflowY,
        property: "overflow-y",
        el: scrollContainer
      });
      scrollContainer.style.overflow = "hidden";
    }
    const restore = () => {
      restoreStyle.forEach(({
        value,
        el: el2,
        property
      }) => {
        if (value) {
          el2.style.setProperty(property, value);
        } else {
          el2.style.removeProperty(property);
        }
      });
    };
    return restore;
  }
  function getHiddenSiblings(container) {
    const hiddenSiblings = [];
    [].forEach.call(container.children, (element) => {
      if (element.getAttribute("aria-hidden") === "true") {
        hiddenSiblings.push(element);
      }
    });
    return hiddenSiblings;
  }
  class ModalManager {
    constructor() {
      this.modals = [];
      this.containers = [];
    }
    add(modal, container) {
      let modalIndex = this.modals.indexOf(modal);
      if (modalIndex !== -1) {
        return modalIndex;
      }
      modalIndex = this.modals.length;
      this.modals.push(modal);
      if (modal.modalRef) {
        ariaHidden(modal.modalRef, false);
      }
      const hiddenSiblings = getHiddenSiblings(container);
      ariaHiddenSiblings(container, modal.mount, modal.modalRef, hiddenSiblings, true);
      const containerIndex = findIndexOf(this.containers, (item) => item.container === container);
      if (containerIndex !== -1) {
        this.containers[containerIndex].modals.push(modal);
        return modalIndex;
      }
      this.containers.push({
        modals: [modal],
        container,
        restore: null,
        hiddenSiblings
      });
      return modalIndex;
    }
    mount(modal, props) {
      const containerIndex = findIndexOf(this.containers, (item) => item.modals.includes(modal));
      const containerInfo = this.containers[containerIndex];
      if (!containerInfo.restore) {
        containerInfo.restore = handleContainer(containerInfo, props);
      }
    }
    remove(modal, ariaHiddenState = true) {
      const modalIndex = this.modals.indexOf(modal);
      if (modalIndex === -1) {
        return modalIndex;
      }
      const containerIndex = findIndexOf(this.containers, (item) => item.modals.includes(modal));
      const containerInfo = this.containers[containerIndex];
      containerInfo.modals.splice(containerInfo.modals.indexOf(modal), 1);
      this.modals.splice(modalIndex, 1);
      if (containerInfo.modals.length === 0) {
        if (containerInfo.restore) {
          containerInfo.restore();
        }
        if (modal.modalRef) {
          ariaHidden(modal.modalRef, ariaHiddenState);
        }
        ariaHiddenSiblings(containerInfo.container, modal.mount, modal.modalRef, containerInfo.hiddenSiblings, false);
        this.containers.splice(containerIndex, 1);
      } else {
        const nextTop = containerInfo.modals[containerInfo.modals.length - 1];
        if (nextTop.modalRef) {
          ariaHidden(nextTop.modalRef, false);
        }
      }
      return modalIndex;
    }
    isTopModal(modal) {
      return this.modals.length > 0 && this.modals[this.modals.length - 1] === modal;
    }
  }
  const candidatesSelector = ["input", "select", "textarea", "a[href]", "button", "[tabindex]", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])'].join(",");
  function getTabIndex(node2) {
    const tabindexAttr = parseInt(node2.getAttribute("tabindex") || "", 10);
    if (!Number.isNaN(tabindexAttr)) {
      return tabindexAttr;
    }
    if (node2.contentEditable === "true" || (node2.nodeName === "AUDIO" || node2.nodeName === "VIDEO" || node2.nodeName === "DETAILS") && node2.getAttribute("tabindex") === null) {
      return 0;
    }
    return node2.tabIndex;
  }
  function isNonTabbableRadio(node2) {
    if (node2.tagName !== "INPUT" || node2.type !== "radio") {
      return false;
    }
    if (!node2.name) {
      return false;
    }
    const getRadio = (selector) => node2.ownerDocument.querySelector(`input[type="radio"]${selector}`);
    let roving = getRadio(`[name="${node2.name}"]:checked`);
    if (!roving) {
      roving = getRadio(`[name="${node2.name}"]`);
    }
    return roving !== node2;
  }
  function isNodeMatchingSelectorFocusable(node2) {
    if (node2.disabled || node2.tagName === "INPUT" && node2.type === "hidden" || isNonTabbableRadio(node2)) {
      return false;
    }
    return true;
  }
  function defaultGetTabbable(root) {
    const regularTabNodes = [];
    const orderedTabNodes = [];
    Array.from(root.querySelectorAll(candidatesSelector)).forEach((node2, i) => {
      const nodeTabIndex = getTabIndex(node2);
      if (nodeTabIndex === -1 || !isNodeMatchingSelectorFocusable(node2)) {
        return;
      }
      if (nodeTabIndex === 0) {
        regularTabNodes.push(node2);
      } else {
        orderedTabNodes.push({
          documentOrder: i,
          tabIndex: nodeTabIndex,
          node: node2
        });
      }
    });
    return orderedTabNodes.sort((a, b2) => a.tabIndex === b2.tabIndex ? a.documentOrder - b2.documentOrder : a.tabIndex - b2.tabIndex).map((a) => a.node).concat(regularTabNodes);
  }
  function defaultIsEnabled() {
    return true;
  }
  function FocusTrap(props) {
    const {
      children,
      disableAutoFocus = false,
      disableEnforceFocus = false,
      disableRestoreFocus = false,
      getTabbable = defaultGetTabbable,
      isEnabled = defaultIsEnabled,
      open
    } = props;
    const ignoreNextEnforceFocus = reactExports.useRef(false);
    const sentinelStart = reactExports.useRef(null);
    const sentinelEnd = reactExports.useRef(null);
    const nodeToRestore = reactExports.useRef(null);
    const reactFocusEventTarget = reactExports.useRef(null);
    const activated = reactExports.useRef(false);
    const rootRef = reactExports.useRef(null);
    const handleRef = useForkRef(getReactElementRef(children), rootRef);
    const lastKeydown = reactExports.useRef(null);
    reactExports.useEffect(() => {
      if (!open || !rootRef.current) {
        return;
      }
      activated.current = !disableAutoFocus;
    }, [disableAutoFocus, open]);
    reactExports.useEffect(() => {
      if (!open || !rootRef.current) {
        return;
      }
      const doc = ownerDocument(rootRef.current);
      if (!rootRef.current.contains(doc.activeElement)) {
        if (!rootRef.current.hasAttribute("tabIndex")) {
          rootRef.current.setAttribute("tabIndex", "-1");
        }
        if (activated.current) {
          rootRef.current.focus();
        }
      }
      return () => {
        if (!disableRestoreFocus) {
          if (nodeToRestore.current && nodeToRestore.current.focus) {
            ignoreNextEnforceFocus.current = true;
            nodeToRestore.current.focus();
          }
          nodeToRestore.current = null;
        }
      };
    }, [open]);
    reactExports.useEffect(() => {
      if (!open || !rootRef.current) {
        return;
      }
      const doc = ownerDocument(rootRef.current);
      const loopFocus = (nativeEvent) => {
        lastKeydown.current = nativeEvent;
        if (disableEnforceFocus || !isEnabled() || nativeEvent.key !== "Tab") {
          return;
        }
        if (doc.activeElement === rootRef.current && nativeEvent.shiftKey) {
          ignoreNextEnforceFocus.current = true;
          if (sentinelEnd.current) {
            sentinelEnd.current.focus();
          }
        }
      };
      const contain = () => {
        var _a, _b;
        const rootElement = rootRef.current;
        if (rootElement === null) {
          return;
        }
        if (!doc.hasFocus() || !isEnabled() || ignoreNextEnforceFocus.current) {
          ignoreNextEnforceFocus.current = false;
          return;
        }
        if (rootElement.contains(doc.activeElement)) {
          return;
        }
        if (disableEnforceFocus && doc.activeElement !== sentinelStart.current && doc.activeElement !== sentinelEnd.current) {
          return;
        }
        if (doc.activeElement !== reactFocusEventTarget.current) {
          reactFocusEventTarget.current = null;
        } else if (reactFocusEventTarget.current !== null) {
          return;
        }
        if (!activated.current) {
          return;
        }
        let tabbable = [];
        if (doc.activeElement === sentinelStart.current || doc.activeElement === sentinelEnd.current) {
          tabbable = getTabbable(rootRef.current);
        }
        if (tabbable.length > 0) {
          const isShiftTab = Boolean(((_a = lastKeydown.current) == null ? void 0 : _a.shiftKey) && ((_b = lastKeydown.current) == null ? void 0 : _b.key) === "Tab");
          const focusNext = tabbable[0];
          const focusPrevious = tabbable[tabbable.length - 1];
          if (typeof focusNext !== "string" && typeof focusPrevious !== "string") {
            if (isShiftTab) {
              focusPrevious.focus();
            } else {
              focusNext.focus();
            }
          }
        } else {
          rootElement.focus();
        }
      };
      doc.addEventListener("focusin", contain);
      doc.addEventListener("keydown", loopFocus, true);
      const interval = setInterval(() => {
        if (doc.activeElement && doc.activeElement.tagName === "BODY") {
          contain();
        }
      }, 50);
      return () => {
        clearInterval(interval);
        doc.removeEventListener("focusin", contain);
        doc.removeEventListener("keydown", loopFocus, true);
      };
    }, [disableAutoFocus, disableEnforceFocus, disableRestoreFocus, isEnabled, open, getTabbable]);
    const onFocus = (event) => {
      if (nodeToRestore.current === null) {
        nodeToRestore.current = event.relatedTarget;
      }
      activated.current = true;
      reactFocusEventTarget.current = event.target;
      const childrenPropsHandler = children.props.onFocus;
      if (childrenPropsHandler) {
        childrenPropsHandler(event);
      }
    };
    const handleFocusSentinel = (event) => {
      if (nodeToRestore.current === null) {
        nodeToRestore.current = event.relatedTarget;
      }
      activated.current = true;
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        tabIndex: open ? 0 : -1,
        onFocus: handleFocusSentinel,
        ref: sentinelStart,
        "data-testid": "sentinelStart"
      }), /* @__PURE__ */ reactExports.cloneElement(children, {
        ref: handleRef,
        onFocus
      }), /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        tabIndex: open ? 0 : -1,
        onFocus: handleFocusSentinel,
        ref: sentinelEnd,
        "data-testid": "sentinelEnd"
      })]
    });
  }
  function getContainer$1(container) {
    return typeof container === "function" ? container() : container;
  }
  const Portal = /* @__PURE__ */ reactExports.forwardRef(function Portal2(props, forwardedRef) {
    const {
      children,
      container,
      disablePortal = false
    } = props;
    const [mountNode, setMountNode] = reactExports.useState(null);
    const handleRef = useForkRef(/* @__PURE__ */ reactExports.isValidElement(children) ? getReactElementRef(children) : null, forwardedRef);
    useEnhancedEffect(() => {
      if (!disablePortal) {
        setMountNode(getContainer$1(container) || document.body);
      }
    }, [container, disablePortal]);
    useEnhancedEffect(() => {
      if (mountNode && !disablePortal) {
        setRef(forwardedRef, mountNode);
        return () => {
          setRef(forwardedRef, null);
        };
      }
      return void 0;
    }, [forwardedRef, mountNode, disablePortal]);
    if (disablePortal) {
      if (/* @__PURE__ */ reactExports.isValidElement(children)) {
        const newProps = {
          ref: handleRef
        };
        return /* @__PURE__ */ reactExports.cloneElement(children, newProps);
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Fragment, {
        children
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Fragment, {
      children: mountNode ? /* @__PURE__ */ reactDomExports.createPortal(children, mountNode) : mountNode
    });
  });
  function useSlot(name, parameters) {
    const {
      className,
      elementType: initialElementType,
      ownerState,
      externalForwardedProps,
      getSlotOwnerState,
      internalForwardedProps,
      ...useSlotPropsParams
    } = parameters;
    const {
      component: rootComponent,
      slots = {
        [name]: void 0
      },
      slotProps = {
        [name]: void 0
      },
      ...other
    } = externalForwardedProps;
    const elementType = slots[name] || initialElementType;
    const resolvedComponentsProps = resolveComponentProps(slotProps[name], ownerState);
    const {
      props: {
        component: slotComponent,
        ...mergedProps
      },
      internalRef
    } = mergeSlotProps({
      className,
      ...useSlotPropsParams,
      externalForwardedProps: name === "root" ? other : void 0,
      externalSlotProps: resolvedComponentsProps
    });
    const ref = useForkRef(internalRef, resolvedComponentsProps == null ? void 0 : resolvedComponentsProps.ref, parameters.ref);
    const slotOwnerState = getSlotOwnerState ? getSlotOwnerState(mergedProps) : {};
    const finalOwnerState = {
      ...ownerState,
      ...slotOwnerState
    };
    const LeafComponent = name === "root" ? slotComponent || rootComponent : slotComponent;
    const props = appendOwnerState(elementType, {
      ...name === "root" && !rootComponent && !slots[name] && internalForwardedProps,
      ...name !== "root" && !slots[name] && internalForwardedProps,
      ...mergedProps,
      ...LeafComponent && {
        as: LeafComponent
      },
      ref
    }, finalOwnerState);
    Object.keys(slotOwnerState).forEach((propName) => {
      delete props[propName];
    });
    return [elementType, props];
  }
  const reflow = (node2) => node2.scrollTop;
  function getTransitionProps(props, options) {
    const {
      timeout,
      easing: easing2,
      style: style2 = {}
    } = props;
    return {
      duration: style2.transitionDuration ?? (typeof timeout === "number" ? timeout : timeout[options.mode] || 0),
      easing: style2.transitionTimingFunction ?? (typeof easing2 === "object" ? easing2[options.mode] : easing2),
      delay: style2.transitionDelay
    };
  }
  const styles = {
    entering: {
      opacity: 1
    },
    entered: {
      opacity: 1
    }
  };
  const Fade = /* @__PURE__ */ reactExports.forwardRef(function Fade2(props, ref) {
    const theme = useTheme();
    const defaultTimeout = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen
    };
    const {
      addEndListener,
      appear = true,
      children,
      easing: easing2,
      in: inProp,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      style: style2,
      timeout = defaultTimeout,
      // eslint-disable-next-line react/prop-types
      TransitionComponent = Transition,
      ...other
    } = props;
    const nodeRef = reactExports.useRef(null);
    const handleRef = useForkRef(nodeRef, getReactElementRef(children), ref);
    const normalizedTransitionCallback = (callback) => (maybeIsAppearing) => {
      if (callback) {
        const node2 = nodeRef.current;
        if (maybeIsAppearing === void 0) {
          callback(node2);
        } else {
          callback(node2, maybeIsAppearing);
        }
      }
    };
    const handleEntering = normalizedTransitionCallback(onEntering);
    const handleEnter = normalizedTransitionCallback((node2, isAppearing) => {
      reflow(node2);
      const transitionProps = getTransitionProps({
        style: style2,
        timeout,
        easing: easing2
      }, {
        mode: "enter"
      });
      node2.style.webkitTransition = theme.transitions.create("opacity", transitionProps);
      node2.style.transition = theme.transitions.create("opacity", transitionProps);
      if (onEnter) {
        onEnter(node2, isAppearing);
      }
    });
    const handleEntered = normalizedTransitionCallback(onEntered);
    const handleExiting = normalizedTransitionCallback(onExiting);
    const handleExit = normalizedTransitionCallback((node2) => {
      const transitionProps = getTransitionProps({
        style: style2,
        timeout,
        easing: easing2
      }, {
        mode: "exit"
      });
      node2.style.webkitTransition = theme.transitions.create("opacity", transitionProps);
      node2.style.transition = theme.transitions.create("opacity", transitionProps);
      if (onExit) {
        onExit(node2);
      }
    });
    const handleExited = normalizedTransitionCallback(onExited);
    const handleAddEndListener = (next2) => {
      if (addEndListener) {
        addEndListener(nodeRef.current, next2);
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, {
      appear,
      in: inProp,
      nodeRef,
      onEnter: handleEnter,
      onEntered: handleEntered,
      onEntering: handleEntering,
      onExit: handleExit,
      onExited: handleExited,
      onExiting: handleExiting,
      addEndListener: handleAddEndListener,
      timeout,
      ...other,
      children: (state, childProps) => {
        return /* @__PURE__ */ reactExports.cloneElement(children, {
          style: {
            opacity: 0,
            visibility: state === "exited" && !inProp ? "hidden" : void 0,
            ...styles[state],
            ...style2,
            ...children.props.style
          },
          ref: handleRef,
          ...childProps
        });
      }
    });
  });
  function getBackdropUtilityClass(slot) {
    return generateUtilityClass("MuiBackdrop", slot);
  }
  generateUtilityClasses("MuiBackdrop", ["root", "invisible"]);
  const removeOwnerState = (props) => {
    const {
      ownerState,
      ...rest
    } = props;
    return rest;
  };
  const useUtilityClasses$3 = (ownerState) => {
    const {
      classes,
      invisible
    } = ownerState;
    const slots = {
      root: ["root", invisible && "invisible"]
    };
    return composeClasses(slots, getBackdropUtilityClass, classes);
  };
  const BackdropRoot = styled("div", {
    name: "MuiBackdrop",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, ownerState.invisible && styles2.invisible];
    }
  })({
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    WebkitTapHighlightColor: "transparent",
    variants: [{
      props: {
        invisible: true
      },
      style: {
        backgroundColor: "transparent"
      }
    }]
  });
  const Backdrop = /* @__PURE__ */ reactExports.forwardRef(function Backdrop2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiBackdrop"
    });
    const {
      children,
      className,
      component = "div",
      invisible = false,
      open,
      components = {},
      componentsProps = {},
      slotProps = {},
      slots = {},
      TransitionComponent: TransitionComponentProp,
      transitionDuration,
      ...other
    } = props;
    const ownerState = {
      ...props,
      component,
      invisible
    };
    const classes = useUtilityClasses$3(ownerState);
    const backwardCompatibleSlots = {
      transition: TransitionComponentProp,
      root: components.Root,
      ...slots
    };
    const backwardCompatibleSlotProps = {
      ...componentsProps,
      ...slotProps
    };
    const externalForwardedProps = {
      slots: backwardCompatibleSlots,
      slotProps: backwardCompatibleSlotProps
    };
    const [RootSlot, rootProps] = useSlot("root", {
      elementType: BackdropRoot,
      externalForwardedProps,
      className: clsx(classes.root, className),
      ownerState
    });
    const [TransitionSlot, transitionProps] = useSlot("transition", {
      elementType: Fade,
      externalForwardedProps,
      ownerState
    });
    const transitionPropsRemoved = removeOwnerState(transitionProps);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionSlot, {
      in: open,
      timeout: transitionDuration,
      ...other,
      ...transitionPropsRemoved,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(RootSlot, {
        "aria-hidden": true,
        ...rootProps,
        classes,
        ref,
        children
      })
    });
  });
  function getContainer(container) {
    return typeof container === "function" ? container() : container;
  }
  function getHasTransition(children) {
    return children ? children.props.hasOwnProperty("in") : false;
  }
  const manager = new ModalManager();
  function useModal(parameters) {
    const {
      container,
      disableEscapeKeyDown = false,
      disableScrollLock = false,
      closeAfterTransition = false,
      onTransitionEnter,
      onTransitionExited,
      children,
      onClose,
      open,
      rootRef
    } = parameters;
    const modal = reactExports.useRef({});
    const mountNodeRef = reactExports.useRef(null);
    const modalRef = reactExports.useRef(null);
    const handleRef = useForkRef(modalRef, rootRef);
    const [exited, setExited] = reactExports.useState(!open);
    const hasTransition = getHasTransition(children);
    let ariaHiddenProp = true;
    if (parameters["aria-hidden"] === "false" || parameters["aria-hidden"] === false) {
      ariaHiddenProp = false;
    }
    const getDoc = () => ownerDocument(mountNodeRef.current);
    const getModal = () => {
      modal.current.modalRef = modalRef.current;
      modal.current.mount = mountNodeRef.current;
      return modal.current;
    };
    const handleMounted = () => {
      manager.mount(getModal(), {
        disableScrollLock
      });
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
    };
    const handleOpen = useEventCallback(() => {
      const resolvedContainer = getContainer(container) || getDoc().body;
      manager.add(getModal(), resolvedContainer);
      if (modalRef.current) {
        handleMounted();
      }
    });
    const isTopModal = () => manager.isTopModal(getModal());
    const handlePortalRef = useEventCallback((node2) => {
      mountNodeRef.current = node2;
      if (!node2) {
        return;
      }
      if (open && isTopModal()) {
        handleMounted();
      } else if (modalRef.current) {
        ariaHidden(modalRef.current, ariaHiddenProp);
      }
    });
    const handleClose = reactExports.useCallback(() => {
      manager.remove(getModal(), ariaHiddenProp);
    }, [ariaHiddenProp]);
    reactExports.useEffect(() => {
      return () => {
        handleClose();
      };
    }, [handleClose]);
    reactExports.useEffect(() => {
      if (open) {
        handleOpen();
      } else if (!hasTransition || !closeAfterTransition) {
        handleClose();
      }
    }, [open, handleClose, hasTransition, closeAfterTransition, handleOpen]);
    const createHandleKeyDown = (otherHandlers) => (event) => {
      var _a;
      (_a = otherHandlers.onKeyDown) == null ? void 0 : _a.call(otherHandlers, event);
      if (event.key !== "Escape" || event.which === 229 || // Wait until IME is settled.
      !isTopModal()) {
        return;
      }
      if (!disableEscapeKeyDown) {
        event.stopPropagation();
        if (onClose) {
          onClose(event, "escapeKeyDown");
        }
      }
    };
    const createHandleBackdropClick = (otherHandlers) => (event) => {
      var _a;
      (_a = otherHandlers.onClick) == null ? void 0 : _a.call(otherHandlers, event);
      if (event.target !== event.currentTarget) {
        return;
      }
      if (onClose) {
        onClose(event, "backdropClick");
      }
    };
    const getRootProps = (otherHandlers = {}) => {
      const propsEventHandlers = extractEventHandlers(parameters);
      delete propsEventHandlers.onTransitionEnter;
      delete propsEventHandlers.onTransitionExited;
      const externalEventHandlers = {
        ...propsEventHandlers,
        ...otherHandlers
      };
      return {
        /*
         * Marking an element with the role presentation indicates to assistive technology
         * that this element should be ignored; it exists to support the web application and
         * is not meant for humans to interact with directly.
         * https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
         */
        role: "presentation",
        ...externalEventHandlers,
        onKeyDown: createHandleKeyDown(externalEventHandlers),
        ref: handleRef
      };
    };
    const getBackdropProps = (otherHandlers = {}) => {
      const externalEventHandlers = otherHandlers;
      return {
        "aria-hidden": true,
        ...externalEventHandlers,
        onClick: createHandleBackdropClick(externalEventHandlers),
        open
      };
    };
    const getTransitionProps2 = () => {
      const handleEnter = () => {
        setExited(false);
        if (onTransitionEnter) {
          onTransitionEnter();
        }
      };
      const handleExited = () => {
        setExited(true);
        if (onTransitionExited) {
          onTransitionExited();
        }
        if (closeAfterTransition) {
          handleClose();
        }
      };
      return {
        onEnter: createChainedFunction(handleEnter, children == null ? void 0 : children.props.onEnter),
        onExited: createChainedFunction(handleExited, children == null ? void 0 : children.props.onExited)
      };
    };
    return {
      getRootProps,
      getBackdropProps,
      getTransitionProps: getTransitionProps2,
      rootRef: handleRef,
      portalRef: handlePortalRef,
      isTopModal,
      exited,
      hasTransition
    };
  }
  function getModalUtilityClass(slot) {
    return generateUtilityClass("MuiModal", slot);
  }
  generateUtilityClasses("MuiModal", ["root", "hidden", "backdrop"]);
  const useUtilityClasses$2 = (ownerState) => {
    const {
      open,
      exited,
      classes
    } = ownerState;
    const slots = {
      root: ["root", !open && exited && "hidden"],
      backdrop: ["backdrop"]
    };
    return composeClasses(slots, getModalUtilityClass, classes);
  };
  const ModalRoot = styled("div", {
    name: "MuiModal",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, !ownerState.open && ownerState.exited && styles2.hidden];
    }
  })(memoTheme(({
    theme
  }) => ({
    position: "fixed",
    zIndex: (theme.vars || theme).zIndex.modal,
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    variants: [{
      props: ({
        ownerState
      }) => !ownerState.open && ownerState.exited,
      style: {
        visibility: "hidden"
      }
    }]
  })));
  const ModalBackdrop = styled(Backdrop, {
    name: "MuiModal",
    slot: "Backdrop",
    overridesResolver: (props, styles2) => {
      return styles2.backdrop;
    }
  })({
    zIndex: -1
  });
  const Modal = /* @__PURE__ */ reactExports.forwardRef(function Modal2(inProps, ref) {
    const props = useDefaultProps({
      name: "MuiModal",
      props: inProps
    });
    const {
      BackdropComponent = ModalBackdrop,
      BackdropProps,
      classes: classesProp,
      className,
      closeAfterTransition = false,
      children,
      container,
      component,
      components = {},
      componentsProps = {},
      disableAutoFocus = false,
      disableEnforceFocus = false,
      disableEscapeKeyDown = false,
      disablePortal = false,
      disableRestoreFocus = false,
      disableScrollLock = false,
      hideBackdrop = false,
      keepMounted = false,
      onBackdropClick,
      onClose,
      onTransitionEnter,
      onTransitionExited,
      open,
      slotProps = {},
      slots = {},
      // eslint-disable-next-line react/prop-types
      theme,
      ...other
    } = props;
    const propsWithDefaults = {
      ...props,
      closeAfterTransition,
      disableAutoFocus,
      disableEnforceFocus,
      disableEscapeKeyDown,
      disablePortal,
      disableRestoreFocus,
      disableScrollLock,
      hideBackdrop,
      keepMounted
    };
    const {
      getRootProps,
      getBackdropProps,
      getTransitionProps: getTransitionProps2,
      portalRef,
      isTopModal,
      exited,
      hasTransition
    } = useModal({
      ...propsWithDefaults,
      rootRef: ref
    });
    const ownerState = {
      ...propsWithDefaults,
      exited
    };
    const classes = useUtilityClasses$2(ownerState);
    const childProps = {};
    if (children.props.tabIndex === void 0) {
      childProps.tabIndex = "-1";
    }
    if (hasTransition) {
      const {
        onEnter,
        onExited
      } = getTransitionProps2();
      childProps.onEnter = onEnter;
      childProps.onExited = onExited;
    }
    const externalForwardedProps = {
      ...other,
      slots: {
        root: components.Root,
        backdrop: components.Backdrop,
        ...slots
      },
      slotProps: {
        ...componentsProps,
        ...slotProps
      }
    };
    const [RootSlot, rootProps] = useSlot("root", {
      elementType: ModalRoot,
      externalForwardedProps,
      getSlotProps: getRootProps,
      additionalProps: {
        ref,
        as: component
      },
      ownerState,
      className: clsx(className, classes == null ? void 0 : classes.root, !ownerState.open && ownerState.exited && (classes == null ? void 0 : classes.hidden))
    });
    const [BackdropSlot, backdropProps] = useSlot("backdrop", {
      elementType: BackdropComponent,
      externalForwardedProps,
      additionalProps: BackdropProps,
      getSlotProps: (otherHandlers) => {
        return getBackdropProps({
          ...otherHandlers,
          onClick: (event) => {
            if (onBackdropClick) {
              onBackdropClick(event);
            }
            if (otherHandlers == null ? void 0 : otherHandlers.onClick) {
              otherHandlers.onClick(event);
            }
          }
        });
      },
      className: clsx(BackdropProps == null ? void 0 : BackdropProps.className, classes == null ? void 0 : classes.backdrop),
      ownerState
    });
    const backdropRef = useForkRef(BackdropProps == null ? void 0 : BackdropProps.ref, backdropProps.ref);
    if (!keepMounted && !open && (!hasTransition || exited)) {
      return null;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, {
      ref: portalRef,
      container,
      disablePortal,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(RootSlot, {
        ...rootProps,
        children: [!hideBackdrop && BackdropComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(BackdropSlot, {
          ...backdropProps,
          ref: backdropRef
        }) : null, /* @__PURE__ */ jsxRuntimeExports.jsx(FocusTrap, {
          disableEnforceFocus,
          disableAutoFocus,
          disableRestoreFocus,
          isEnabled: isTopModal,
          open,
          children: /* @__PURE__ */ reactExports.cloneElement(children, childProps)
        })]
      })
    });
  });
  function getTranslateValue(direction, node2, resolvedContainer) {
    const rect = node2.getBoundingClientRect();
    const containerRect = resolvedContainer && resolvedContainer.getBoundingClientRect();
    const containerWindow = ownerWindow(node2);
    let transform;
    if (node2.fakeTransform) {
      transform = node2.fakeTransform;
    } else {
      const computedStyle = containerWindow.getComputedStyle(node2);
      transform = computedStyle.getPropertyValue("-webkit-transform") || computedStyle.getPropertyValue("transform");
    }
    let offsetX = 0;
    let offsetY = 0;
    if (transform && transform !== "none" && typeof transform === "string") {
      const transformValues = transform.split("(")[1].split(")")[0].split(",");
      offsetX = parseInt(transformValues[4], 10);
      offsetY = parseInt(transformValues[5], 10);
    }
    if (direction === "left") {
      if (containerRect) {
        return `translateX(${containerRect.right + offsetX - rect.left}px)`;
      }
      return `translateX(${containerWindow.innerWidth + offsetX - rect.left}px)`;
    }
    if (direction === "right") {
      if (containerRect) {
        return `translateX(-${rect.right - containerRect.left - offsetX}px)`;
      }
      return `translateX(-${rect.left + rect.width - offsetX}px)`;
    }
    if (direction === "up") {
      if (containerRect) {
        return `translateY(${containerRect.bottom + offsetY - rect.top}px)`;
      }
      return `translateY(${containerWindow.innerHeight + offsetY - rect.top}px)`;
    }
    if (containerRect) {
      return `translateY(-${rect.top - containerRect.top + rect.height - offsetY}px)`;
    }
    return `translateY(-${rect.top + rect.height - offsetY}px)`;
  }
  function resolveContainer(containerPropProp) {
    return typeof containerPropProp === "function" ? containerPropProp() : containerPropProp;
  }
  function setTranslateValue(direction, node2, containerProp) {
    const resolvedContainer = resolveContainer(containerProp);
    const transform = getTranslateValue(direction, node2, resolvedContainer);
    if (transform) {
      node2.style.webkitTransform = transform;
      node2.style.transform = transform;
    }
  }
  const Slide = /* @__PURE__ */ reactExports.forwardRef(function Slide2(props, ref) {
    const theme = useTheme();
    const defaultEasing = {
      enter: theme.transitions.easing.easeOut,
      exit: theme.transitions.easing.sharp
    };
    const defaultTimeout = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen
    };
    const {
      addEndListener,
      appear = true,
      children,
      container: containerProp,
      direction = "down",
      easing: easingProp = defaultEasing,
      in: inProp,
      onEnter,
      onEntered,
      onEntering,
      onExit,
      onExited,
      onExiting,
      style: style2,
      timeout = defaultTimeout,
      // eslint-disable-next-line react/prop-types
      TransitionComponent = Transition,
      ...other
    } = props;
    const childrenRef = reactExports.useRef(null);
    const handleRef = useForkRef(getReactElementRef(children), childrenRef, ref);
    const normalizedTransitionCallback = (callback) => (isAppearing) => {
      if (callback) {
        if (isAppearing === void 0) {
          callback(childrenRef.current);
        } else {
          callback(childrenRef.current, isAppearing);
        }
      }
    };
    const handleEnter = normalizedTransitionCallback((node2, isAppearing) => {
      setTranslateValue(direction, node2, containerProp);
      reflow(node2);
      if (onEnter) {
        onEnter(node2, isAppearing);
      }
    });
    const handleEntering = normalizedTransitionCallback((node2, isAppearing) => {
      const transitionProps = getTransitionProps({
        timeout,
        style: style2,
        easing: easingProp
      }, {
        mode: "enter"
      });
      node2.style.webkitTransition = theme.transitions.create("-webkit-transform", {
        ...transitionProps
      });
      node2.style.transition = theme.transitions.create("transform", {
        ...transitionProps
      });
      node2.style.webkitTransform = "none";
      node2.style.transform = "none";
      if (onEntering) {
        onEntering(node2, isAppearing);
      }
    });
    const handleEntered = normalizedTransitionCallback(onEntered);
    const handleExiting = normalizedTransitionCallback(onExiting);
    const handleExit = normalizedTransitionCallback((node2) => {
      const transitionProps = getTransitionProps({
        timeout,
        style: style2,
        easing: easingProp
      }, {
        mode: "exit"
      });
      node2.style.webkitTransition = theme.transitions.create("-webkit-transform", transitionProps);
      node2.style.transition = theme.transitions.create("transform", transitionProps);
      setTranslateValue(direction, node2, containerProp);
      if (onExit) {
        onExit(node2);
      }
    });
    const handleExited = normalizedTransitionCallback((node2) => {
      node2.style.webkitTransition = "";
      node2.style.transition = "";
      if (onExited) {
        onExited(node2);
      }
    });
    const handleAddEndListener = (next2) => {
      if (addEndListener) {
        addEndListener(childrenRef.current, next2);
      }
    };
    const updatePosition = reactExports.useCallback(() => {
      if (childrenRef.current) {
        setTranslateValue(direction, childrenRef.current, containerProp);
      }
    }, [direction, containerProp]);
    reactExports.useEffect(() => {
      if (inProp || direction === "down" || direction === "right") {
        return void 0;
      }
      const handleResize = debounce(() => {
        if (childrenRef.current) {
          setTranslateValue(direction, childrenRef.current, containerProp);
        }
      });
      const containerWindow = ownerWindow(childrenRef.current);
      containerWindow.addEventListener("resize", handleResize);
      return () => {
        handleResize.clear();
        containerWindow.removeEventListener("resize", handleResize);
      };
    }, [direction, inProp, containerProp]);
    reactExports.useEffect(() => {
      if (!inProp) {
        updatePosition();
      }
    }, [inProp, updatePosition]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, {
      nodeRef: childrenRef,
      onEnter: handleEnter,
      onEntered: handleEntered,
      onEntering: handleEntering,
      onExit: handleExit,
      onExited: handleExited,
      onExiting: handleExiting,
      addEndListener: handleAddEndListener,
      appear,
      in: inProp,
      timeout,
      ...other,
      children: (state, childProps) => {
        return /* @__PURE__ */ reactExports.cloneElement(children, {
          ref: handleRef,
          style: {
            visibility: state === "exited" && !inProp ? "hidden" : void 0,
            ...style2,
            ...children.props.style
          },
          ...childProps
        });
      }
    });
  });
  function getPaperUtilityClass(slot) {
    return generateUtilityClass("MuiPaper", slot);
  }
  generateUtilityClasses("MuiPaper", ["root", "rounded", "outlined", "elevation", "elevation0", "elevation1", "elevation2", "elevation3", "elevation4", "elevation5", "elevation6", "elevation7", "elevation8", "elevation9", "elevation10", "elevation11", "elevation12", "elevation13", "elevation14", "elevation15", "elevation16", "elevation17", "elevation18", "elevation19", "elevation20", "elevation21", "elevation22", "elevation23", "elevation24"]);
  const useUtilityClasses$1 = (ownerState) => {
    const {
      square,
      elevation,
      variant,
      classes
    } = ownerState;
    const slots = {
      root: ["root", variant, !square && "rounded", variant === "elevation" && `elevation${elevation}`]
    };
    return composeClasses(slots, getPaperUtilityClass, classes);
  };
  const PaperRoot = styled("div", {
    name: "MuiPaper",
    slot: "Root",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.root, styles2[ownerState.variant], !ownerState.square && styles2.rounded, ownerState.variant === "elevation" && styles2[`elevation${ownerState.elevation}`]];
    }
  })(memoTheme(({
    theme
  }) => ({
    backgroundColor: (theme.vars || theme).palette.background.paper,
    color: (theme.vars || theme).palette.text.primary,
    transition: theme.transitions.create("box-shadow"),
    variants: [{
      props: ({
        ownerState
      }) => !ownerState.square,
      style: {
        borderRadius: theme.shape.borderRadius
      }
    }, {
      props: {
        variant: "outlined"
      },
      style: {
        border: `1px solid ${(theme.vars || theme).palette.divider}`
      }
    }, {
      props: {
        variant: "elevation"
      },
      style: {
        boxShadow: "var(--Paper-shadow)",
        backgroundImage: "var(--Paper-overlay)"
      }
    }]
  })));
  const Paper = /* @__PURE__ */ reactExports.forwardRef(function Paper2(inProps, ref) {
    var _a;
    const props = useDefaultProps({
      props: inProps,
      name: "MuiPaper"
    });
    const theme = useTheme();
    const {
      className,
      component = "div",
      elevation = 1,
      square = false,
      variant = "elevation",
      ...other
    } = props;
    const ownerState = {
      ...props,
      component,
      elevation,
      square,
      variant
    };
    const classes = useUtilityClasses$1(ownerState);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PaperRoot, {
      as: component,
      ownerState,
      className: clsx(classes.root, className),
      ref,
      ...other,
      style: {
        ...variant === "elevation" && {
          "--Paper-shadow": (theme.vars || theme).shadows[elevation],
          ...theme.vars && {
            "--Paper-overlay": (_a = theme.vars.overlays) == null ? void 0 : _a[elevation]
          },
          ...!theme.vars && theme.palette.mode === "dark" && {
            "--Paper-overlay": `linear-gradient(${alpha("#fff", getOverlayAlpha(elevation))}, ${alpha("#fff", getOverlayAlpha(elevation))})`
          }
        },
        ...other.style
      }
    });
  });
  function getDrawerUtilityClass(slot) {
    return generateUtilityClass("MuiDrawer", slot);
  }
  generateUtilityClasses("MuiDrawer", ["root", "docked", "paper", "paperAnchorLeft", "paperAnchorRight", "paperAnchorTop", "paperAnchorBottom", "paperAnchorDockedLeft", "paperAnchorDockedRight", "paperAnchorDockedTop", "paperAnchorDockedBottom", "modal"]);
  const overridesResolver = (props, styles2) => {
    const {
      ownerState
    } = props;
    return [styles2.root, (ownerState.variant === "permanent" || ownerState.variant === "persistent") && styles2.docked, styles2.modal];
  };
  const useUtilityClasses = (ownerState) => {
    const {
      classes,
      anchor,
      variant
    } = ownerState;
    const slots = {
      root: ["root"],
      docked: [(variant === "permanent" || variant === "persistent") && "docked"],
      modal: ["modal"],
      paper: ["paper", `paperAnchor${capitalize(anchor)}`, variant !== "temporary" && `paperAnchorDocked${capitalize(anchor)}`]
    };
    return composeClasses(slots, getDrawerUtilityClass, classes);
  };
  const DrawerRoot = styled(Modal, {
    name: "MuiDrawer",
    slot: "Root",
    overridesResolver
  })(memoTheme(({
    theme
  }) => ({
    zIndex: (theme.vars || theme).zIndex.drawer
  })));
  const DrawerDockedRoot = styled("div", {
    shouldForwardProp: rootShouldForwardProp,
    name: "MuiDrawer",
    slot: "Docked",
    skipVariantsResolver: false,
    overridesResolver
  })({
    flex: "0 0 auto"
  });
  const DrawerPaper = styled(Paper, {
    name: "MuiDrawer",
    slot: "Paper",
    overridesResolver: (props, styles2) => {
      const {
        ownerState
      } = props;
      return [styles2.paper, styles2[`paperAnchor${capitalize(ownerState.anchor)}`], ownerState.variant !== "temporary" && styles2[`paperAnchorDocked${capitalize(ownerState.anchor)}`]];
    }
  })(memoTheme(({
    theme
  }) => ({
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flex: "1 0 auto",
    zIndex: (theme.vars || theme).zIndex.drawer,
    // Add iOS momentum scrolling for iOS < 13.0
    WebkitOverflowScrolling: "touch",
    // temporary style
    position: "fixed",
    top: 0,
    // We disable the focus ring for mouse, touch and keyboard users.
    // At some point, it would be better to keep it for keyboard users.
    // :focus-ring CSS pseudo-class will help.
    outline: 0,
    variants: [{
      props: {
        anchor: "left"
      },
      style: {
        left: 0
      }
    }, {
      props: {
        anchor: "top"
      },
      style: {
        top: 0,
        left: 0,
        right: 0,
        height: "auto",
        maxHeight: "100%"
      }
    }, {
      props: {
        anchor: "right"
      },
      style: {
        right: 0
      }
    }, {
      props: {
        anchor: "bottom"
      },
      style: {
        top: "auto",
        left: 0,
        bottom: 0,
        right: 0,
        height: "auto",
        maxHeight: "100%"
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.anchor === "left" && ownerState.variant !== "temporary",
      style: {
        borderRight: `1px solid ${(theme.vars || theme).palette.divider}`
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.anchor === "top" && ownerState.variant !== "temporary",
      style: {
        borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.anchor === "right" && ownerState.variant !== "temporary",
      style: {
        borderLeft: `1px solid ${(theme.vars || theme).palette.divider}`
      }
    }, {
      props: ({
        ownerState
      }) => ownerState.anchor === "bottom" && ownerState.variant !== "temporary",
      style: {
        borderTop: `1px solid ${(theme.vars || theme).palette.divider}`
      }
    }]
  })));
  const oppositeDirection = {
    left: "right",
    right: "left",
    top: "down",
    bottom: "up"
  };
  function isHorizontal(anchor) {
    return ["left", "right"].includes(anchor);
  }
  function getAnchor({
    direction
  }, anchor) {
    return direction === "rtl" && isHorizontal(anchor) ? oppositeDirection[anchor] : anchor;
  }
  const Drawer = /* @__PURE__ */ reactExports.forwardRef(function Drawer2(inProps, ref) {
    const props = useDefaultProps({
      props: inProps,
      name: "MuiDrawer"
    });
    const theme = useTheme();
    const isRtl = useRtl();
    const defaultTransitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen
    };
    const {
      anchor: anchorProp = "left",
      BackdropProps,
      children,
      className,
      elevation = 16,
      hideBackdrop = false,
      ModalProps: {
        BackdropProps: BackdropPropsProp,
        ...ModalProps
      } = {},
      onClose,
      open = false,
      PaperProps = {},
      SlideProps,
      // eslint-disable-next-line react/prop-types
      TransitionComponent = Slide,
      transitionDuration = defaultTransitionDuration,
      variant = "temporary",
      ...other
    } = props;
    const mounted = reactExports.useRef(false);
    reactExports.useEffect(() => {
      mounted.current = true;
    }, []);
    const anchorInvariant = getAnchor({
      direction: isRtl ? "rtl" : "ltr"
    }, anchorProp);
    const anchor = anchorProp;
    const ownerState = {
      ...props,
      anchor,
      elevation,
      open,
      variant,
      ...other
    };
    const classes = useUtilityClasses(ownerState);
    const drawer = /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerPaper, {
      elevation: variant === "temporary" ? elevation : 0,
      square: true,
      ...PaperProps,
      className: clsx(classes.paper, PaperProps.className),
      ownerState,
      children
    });
    if (variant === "permanent") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerDockedRoot, {
        className: clsx(classes.root, classes.docked, className),
        ownerState,
        ref,
        ...other,
        children: drawer
      });
    }
    const slidingDrawer = /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionComponent, {
      in: open,
      direction: oppositeDirection[anchorInvariant],
      timeout: transitionDuration,
      appear: mounted.current,
      ...SlideProps,
      children: drawer
    });
    if (variant === "persistent") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerDockedRoot, {
        className: clsx(classes.root, classes.docked, className),
        ownerState,
        ref,
        ...other,
        children: slidingDrawer
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DrawerRoot, {
      BackdropProps: {
        ...BackdropProps,
        ...BackdropPropsProp,
        transitionDuration
      },
      className: clsx(classes.root, classes.modal, className),
      open,
      ownerState,
      onClose,
      hideBackdrop,
      ref,
      ...other,
      ...ModalProps,
      children: slidingDrawer
    });
  });
  var jquery = { exports: {} };
  /*!
   * jQuery JavaScript Library v3.7.1
   * https://jquery.com/
   *
   * Copyright OpenJS Foundation and other contributors
   * Released under the MIT license
   * https://jquery.org/license
   *
   * Date: 2023-08-28T13:37Z
   */
  (function(module) {
    (function(global2, factory) {
      {
        module.exports = global2.document ? factory(global2, true) : function(w2) {
          if (!w2.document) {
            throw new Error("jQuery requires a window with a document");
          }
          return factory(w2);
        };
      }
    })(typeof window !== "undefined" ? window : commonjsGlobal, function(window2, noGlobal) {
      var arr = [];
      var getProto = Object.getPrototypeOf;
      var slice2 = arr.slice;
      var flat = arr.flat ? function(array) {
        return arr.flat.call(array);
      } : function(array) {
        return arr.concat.apply([], array);
      };
      var push = arr.push;
      var indexOf = arr.indexOf;
      var class2type = {};
      var toString = class2type.toString;
      var hasOwn = class2type.hasOwnProperty;
      var fnToString = hasOwn.toString;
      var ObjectFunctionString = fnToString.call(Object);
      var support = {};
      var isFunction = function isFunction2(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
      };
      var isWindow = function isWindow2(obj) {
        return obj != null && obj === obj.window;
      };
      var document2 = window2.document;
      var preservedScriptAttributes = {
        type: true,
        src: true,
        nonce: true,
        noModule: true
      };
      function DOMEval(code, node2, doc) {
        doc = doc || document2;
        var i, val, script = doc.createElement("script");
        script.text = code;
        if (node2) {
          for (i in preservedScriptAttributes) {
            val = node2[i] || node2.getAttribute && node2.getAttribute(i);
            if (val) {
              script.setAttribute(i, val);
            }
          }
        }
        doc.head.appendChild(script).parentNode.removeChild(script);
      }
      function toType(obj) {
        if (obj == null) {
          return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
      }
      var version = "3.7.1", rhtmlSuffix = /HTML$/i, jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context);
      };
      jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: version,
        constructor: jQuery,
        // The default length of a jQuery object is 0
        length: 0,
        toArray: function() {
          return slice2.call(this);
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function(num) {
          if (num == null) {
            return slice2.call(this);
          }
          return num < 0 ? this[num + this.length] : this[num];
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function(elems) {
          var ret = jQuery.merge(this.constructor(), elems);
          ret.prevObject = this;
          return ret;
        },
        // Execute a callback for every element in the matched set.
        each: function(callback) {
          return jQuery.each(this, callback);
        },
        map: function(callback) {
          return this.pushStack(jQuery.map(this, function(elem, i) {
            return callback.call(elem, i, elem);
          }));
        },
        slice: function() {
          return this.pushStack(slice2.apply(this, arguments));
        },
        first: function() {
          return this.eq(0);
        },
        last: function() {
          return this.eq(-1);
        },
        even: function() {
          return this.pushStack(jQuery.grep(this, function(_elem, i) {
            return (i + 1) % 2;
          }));
        },
        odd: function() {
          return this.pushStack(jQuery.grep(this, function(_elem, i) {
            return i % 2;
          }));
        },
        eq: function(i) {
          var len = this.length, j = +i + (i < 0 ? len : 0);
          return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        end: function() {
          return this.prevObject || this.constructor();
        },
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push,
        sort: arr.sort,
        splice: arr.splice
      };
      jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy2, copyIsArray, clone, target = arguments[0] || {}, i = 1, length2 = arguments.length, deep = false;
        if (typeof target === "boolean") {
          deep = target;
          target = arguments[i] || {};
          i++;
        }
        if (typeof target !== "object" && !isFunction(target)) {
          target = {};
        }
        if (i === length2) {
          target = this;
          i--;
        }
        for (; i < length2; i++) {
          if ((options = arguments[i]) != null) {
            for (name in options) {
              copy2 = options[name];
              if (name === "__proto__" || target === copy2) {
                continue;
              }
              if (deep && copy2 && (jQuery.isPlainObject(copy2) || (copyIsArray = Array.isArray(copy2)))) {
                src = target[name];
                if (copyIsArray && !Array.isArray(src)) {
                  clone = [];
                } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                  clone = {};
                } else {
                  clone = src;
                }
                copyIsArray = false;
                target[name] = jQuery.extend(deep, clone, copy2);
              } else if (copy2 !== void 0) {
                target[name] = copy2;
              }
            }
          }
        }
        return target;
      };
      jQuery.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
        // Assume jQuery is ready without the ready module
        isReady: true,
        error: function(msg) {
          throw new Error(msg);
        },
        noop: function() {
        },
        isPlainObject: function(obj) {
          var proto, Ctor;
          if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
          }
          proto = getProto(obj);
          if (!proto) {
            return true;
          }
          Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
          return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
        },
        isEmptyObject: function(obj) {
          var name;
          for (name in obj) {
            return false;
          }
          return true;
        },
        // Evaluates a script in a provided context; falls back to the global one
        // if not specified.
        globalEval: function(code, options, doc) {
          DOMEval(code, { nonce: options && options.nonce }, doc);
        },
        each: function(obj, callback) {
          var length2, i = 0;
          if (isArrayLike(obj)) {
            length2 = obj.length;
            for (; i < length2; i++) {
              if (callback.call(obj[i], i, obj[i]) === false) {
                break;
              }
            }
          } else {
            for (i in obj) {
              if (callback.call(obj[i], i, obj[i]) === false) {
                break;
              }
            }
          }
          return obj;
        },
        // Retrieve the text value of an array of DOM nodes
        text: function(elem) {
          var node2, ret = "", i = 0, nodeType = elem.nodeType;
          if (!nodeType) {
            while (node2 = elem[i++]) {
              ret += jQuery.text(node2);
            }
          }
          if (nodeType === 1 || nodeType === 11) {
            return elem.textContent;
          }
          if (nodeType === 9) {
            return elem.documentElement.textContent;
          }
          if (nodeType === 3 || nodeType === 4) {
            return elem.nodeValue;
          }
          return ret;
        },
        // results is for internal usage only
        makeArray: function(arr2, results) {
          var ret = results || [];
          if (arr2 != null) {
            if (isArrayLike(Object(arr2))) {
              jQuery.merge(
                ret,
                typeof arr2 === "string" ? [arr2] : arr2
              );
            } else {
              push.call(ret, arr2);
            }
          }
          return ret;
        },
        inArray: function(elem, arr2, i) {
          return arr2 == null ? -1 : indexOf.call(arr2, elem, i);
        },
        isXMLDoc: function(elem) {
          var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
          return !rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
        },
        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        merge: function(first, second) {
          var len = +second.length, j = 0, i = first.length;
          for (; j < len; j++) {
            first[i++] = second[j];
          }
          first.length = i;
          return first;
        },
        grep: function(elems, callback, invert) {
          var callbackInverse, matches = [], i = 0, length2 = elems.length, callbackExpect = !invert;
          for (; i < length2; i++) {
            callbackInverse = !callback(elems[i], i);
            if (callbackInverse !== callbackExpect) {
              matches.push(elems[i]);
            }
          }
          return matches;
        },
        // arg is for internal usage only
        map: function(elems, callback, arg2) {
          var length2, value, i = 0, ret = [];
          if (isArrayLike(elems)) {
            length2 = elems.length;
            for (; i < length2; i++) {
              value = callback(elems[i], i, arg2);
              if (value != null) {
                ret.push(value);
              }
            }
          } else {
            for (i in elems) {
              value = callback(elems[i], i, arg2);
              if (value != null) {
                ret.push(value);
              }
            }
          }
          return flat(ret);
        },
        // A global GUID counter for objects
        guid: 1,
        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support
      });
      if (typeof Symbol === "function") {
        jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
      }
      jQuery.each(
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(_i, name) {
          class2type["[object " + name + "]"] = name.toLowerCase();
        }
      );
      function isArrayLike(obj) {
        var length2 = !!obj && "length" in obj && obj.length, type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) {
          return false;
        }
        return type === "array" || length2 === 0 || typeof length2 === "number" && length2 > 0 && length2 - 1 in obj;
      }
      function nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
      }
      var pop = arr.pop;
      var sort = arr.sort;
      var splice = arr.splice;
      var whitespace2 = "[\\x20\\t\\r\\n\\f]";
      var rtrimCSS = new RegExp(
        "^" + whitespace2 + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace2 + "+$",
        "g"
      );
      jQuery.contains = function(a, b2) {
        var bup = b2 && b2.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && // Support: IE 9 - 11+
        // IE doesn't have `contains` on SVG.
        (a.contains ? a.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
      };
      var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
      function fcssescape(ch2, asCodePoint) {
        if (asCodePoint) {
          if (ch2 === "\0") {
            return "�";
          }
          return ch2.slice(0, -1) + "\\" + ch2.charCodeAt(ch2.length - 1).toString(16) + " ";
        }
        return "\\" + ch2;
      }
      jQuery.escapeSelector = function(sel) {
        return (sel + "").replace(rcssescape, fcssescape);
      };
      var preferredDoc = document2, pushNative = push;
      (function() {
        var i, Expr, outermostContext, sortInput, hasDuplicate, push2 = pushNative, document3, documentElement2, documentIsHTML, rbuggyQSA, matches, expando = jQuery.expando, dirruns = 0, done = 0, classCache = createCache2(), tokenCache = createCache2(), compilerCache = createCache2(), nonnativeSelectorCache = createCache2(), sortOrder = function(a, b2) {
          if (a === b2) {
            hasDuplicate = true;
          }
          return 0;
        }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", identifier2 = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace2 + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace2 + "*(" + identifier2 + ")(?:" + whitespace2 + // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace2 + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier2 + "))|)" + whitespace2 + "*\\]", pseudos = ":(" + identifier2 + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace2 + "+", "g"), rcomma = new RegExp("^" + whitespace2 + "*," + whitespace2 + "*"), rleadingCombinator = new RegExp("^" + whitespace2 + "*([>+~]|" + whitespace2 + ")" + whitespace2 + "*"), rdescend = new RegExp(whitespace2 + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier2 + "$"), matchExpr = {
          ID: new RegExp("^#(" + identifier2 + ")"),
          CLASS: new RegExp("^\\.(" + identifier2 + ")"),
          TAG: new RegExp("^(" + identifier2 + "|[*])"),
          ATTR: new RegExp("^" + attributes),
          PSEUDO: new RegExp("^" + pseudos),
          CHILD: new RegExp(
            "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace2 + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace2 + "*(?:([+-]|)" + whitespace2 + "*(\\d+)|))" + whitespace2 + "*\\)|)",
            "i"
          ),
          bool: new RegExp("^(?:" + booleans + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + whitespace2 + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace2 + "*((?:-\\d)?\\d*)" + whitespace2 + "*\\)|)(?=[^-]|$)", "i")
        }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace2 + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape2, nonHex) {
          var high = "0x" + escape2.slice(1) - 65536;
          if (nonHex) {
            return nonHex;
          }
          return high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
        }, unloadHandler = function() {
          setDocument();
        }, inDisabledFieldset = addCombinator(
          function(elem) {
            return elem.disabled === true && nodeName(elem, "fieldset");
          },
          { dir: "parentNode", next: "legend" }
        );
        function safeActiveElement() {
          try {
            return document3.activeElement;
          } catch (err) {
          }
        }
        try {
          push2.apply(
            arr = slice2.call(preferredDoc.childNodes),
            preferredDoc.childNodes
          );
          arr[preferredDoc.childNodes.length].nodeType;
        } catch (e2) {
          push2 = {
            apply: function(target, els) {
              pushNative.apply(target, slice2.call(els));
            },
            call: function(target) {
              pushNative.apply(target, slice2.call(arguments, 1));
            }
          };
        }
        function find(selector, context, results, seed) {
          var m2, i2, elem, nid, match2, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
          results = results || [];
          if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
            return results;
          }
          if (!seed) {
            setDocument(context);
            context = context || document3;
            if (documentIsHTML) {
              if (nodeType !== 11 && (match2 = rquickExpr2.exec(selector))) {
                if (m2 = match2[1]) {
                  if (nodeType === 9) {
                    if (elem = context.getElementById(m2)) {
                      if (elem.id === m2) {
                        push2.call(results, elem);
                        return results;
                      }
                    } else {
                      return results;
                    }
                  } else {
                    if (newContext && (elem = newContext.getElementById(m2)) && find.contains(context, elem) && elem.id === m2) {
                      push2.call(results, elem);
                      return results;
                    }
                  }
                } else if (match2[2]) {
                  push2.apply(results, context.getElementsByTagName(selector));
                  return results;
                } else if ((m2 = match2[3]) && context.getElementsByClassName) {
                  push2.apply(results, context.getElementsByClassName(m2));
                  return results;
                }
              }
              if (!nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                newSelector = selector;
                newContext = context;
                if (nodeType === 1 && (rdescend.test(selector) || rleadingCombinator.test(selector))) {
                  newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                  if (newContext != context || !support.scope) {
                    if (nid = context.getAttribute("id")) {
                      nid = jQuery.escapeSelector(nid);
                    } else {
                      context.setAttribute("id", nid = expando);
                    }
                  }
                  groups = tokenize(selector);
                  i2 = groups.length;
                  while (i2--) {
                    groups[i2] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i2]);
                  }
                  newSelector = groups.join(",");
                }
                try {
                  push2.apply(
                    results,
                    newContext.querySelectorAll(newSelector)
                  );
                  return results;
                } catch (qsaError) {
                  nonnativeSelectorCache(selector, true);
                } finally {
                  if (nid === expando) {
                    context.removeAttribute("id");
                  }
                }
              }
            }
          }
          return select(selector.replace(rtrimCSS, "$1"), context, results, seed);
        }
        function createCache2() {
          var keys = [];
          function cache(key, value) {
            if (keys.push(key + " ") > Expr.cacheLength) {
              delete cache[keys.shift()];
            }
            return cache[key + " "] = value;
          }
          return cache;
        }
        function markFunction(fn) {
          fn[expando] = true;
          return fn;
        }
        function assert(fn) {
          var el2 = document3.createElement("fieldset");
          try {
            return !!fn(el2);
          } catch (e2) {
            return false;
          } finally {
            if (el2.parentNode) {
              el2.parentNode.removeChild(el2);
            }
            el2 = null;
          }
        }
        function createInputPseudo(type) {
          return function(elem) {
            return nodeName(elem, "input") && elem.type === type;
          };
        }
        function createButtonPseudo(type) {
          return function(elem) {
            return (nodeName(elem, "input") || nodeName(elem, "button")) && elem.type === type;
          };
        }
        function createDisabledPseudo(disabled) {
          return function(elem) {
            if ("form" in elem) {
              if (elem.parentNode && elem.disabled === false) {
                if ("label" in elem) {
                  if ("label" in elem.parentNode) {
                    return elem.parentNode.disabled === disabled;
                  } else {
                    return elem.disabled === disabled;
                  }
                }
                return elem.isDisabled === disabled || // Where there is no isDisabled, check manually
                elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
              }
              return elem.disabled === disabled;
            } else if ("label" in elem) {
              return elem.disabled === disabled;
            }
            return false;
          };
        }
        function createPositionalPseudo(fn) {
          return markFunction(function(argument) {
            argument = +argument;
            return markFunction(function(seed, matches2) {
              var j, matchIndexes = fn([], seed.length, argument), i2 = matchIndexes.length;
              while (i2--) {
                if (seed[j = matchIndexes[i2]]) {
                  seed[j] = !(matches2[j] = seed[j]);
                }
              }
            });
          });
        }
        function testContext(context) {
          return context && typeof context.getElementsByTagName !== "undefined" && context;
        }
        function setDocument(node2) {
          var subWindow, doc = node2 ? node2.ownerDocument || node2 : preferredDoc;
          if (doc == document3 || doc.nodeType !== 9 || !doc.documentElement) {
            return document3;
          }
          document3 = doc;
          documentElement2 = document3.documentElement;
          documentIsHTML = !jQuery.isXMLDoc(document3);
          matches = documentElement2.matches || documentElement2.webkitMatchesSelector || documentElement2.msMatchesSelector;
          if (documentElement2.msMatchesSelector && // Support: IE 11+, Edge 17 - 18+
          // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
          // two documents; shallow comparisons work.
          // eslint-disable-next-line eqeqeq
          preferredDoc != document3 && (subWindow = document3.defaultView) && subWindow.top !== subWindow) {
            subWindow.addEventListener("unload", unloadHandler);
          }
          support.getById = assert(function(el2) {
            documentElement2.appendChild(el2).id = jQuery.expando;
            return !document3.getElementsByName || !document3.getElementsByName(jQuery.expando).length;
          });
          support.disconnectedMatch = assert(function(el2) {
            return matches.call(el2, "*");
          });
          support.scope = assert(function() {
            return document3.querySelectorAll(":scope");
          });
          support.cssHas = assert(function() {
            try {
              document3.querySelector(":has(*,:jqfake)");
              return false;
            } catch (e2) {
              return true;
            }
          });
          if (support.getById) {
            Expr.filter.ID = function(id2) {
              var attrId = id2.replace(runescape, funescape);
              return function(elem) {
                return elem.getAttribute("id") === attrId;
              };
            };
            Expr.find.ID = function(id2, context) {
              if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                var elem = context.getElementById(id2);
                return elem ? [elem] : [];
              }
            };
          } else {
            Expr.filter.ID = function(id2) {
              var attrId = id2.replace(runescape, funescape);
              return function(elem) {
                var node3 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                return node3 && node3.value === attrId;
              };
            };
            Expr.find.ID = function(id2, context) {
              if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                var node3, i2, elems, elem = context.getElementById(id2);
                if (elem) {
                  node3 = elem.getAttributeNode("id");
                  if (node3 && node3.value === id2) {
                    return [elem];
                  }
                  elems = context.getElementsByName(id2);
                  i2 = 0;
                  while (elem = elems[i2++]) {
                    node3 = elem.getAttributeNode("id");
                    if (node3 && node3.value === id2) {
                      return [elem];
                    }
                  }
                }
                return [];
              }
            };
          }
          Expr.find.TAG = function(tag, context) {
            if (typeof context.getElementsByTagName !== "undefined") {
              return context.getElementsByTagName(tag);
            } else {
              return context.querySelectorAll(tag);
            }
          };
          Expr.find.CLASS = function(className, context) {
            if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
              return context.getElementsByClassName(className);
            }
          };
          rbuggyQSA = [];
          assert(function(el2) {
            var input;
            documentElement2.appendChild(el2).innerHTML = "<a id='" + expando + "' href='' disabled='disabled'></a><select id='" + expando + "-\r\\' disabled='disabled'><option selected=''></option></select>";
            if (!el2.querySelectorAll("[selected]").length) {
              rbuggyQSA.push("\\[" + whitespace2 + "*(?:value|" + booleans + ")");
            }
            if (!el2.querySelectorAll("[id~=" + expando + "-]").length) {
              rbuggyQSA.push("~=");
            }
            if (!el2.querySelectorAll("a#" + expando + "+*").length) {
              rbuggyQSA.push(".#.+[+~]");
            }
            if (!el2.querySelectorAll(":checked").length) {
              rbuggyQSA.push(":checked");
            }
            input = document3.createElement("input");
            input.setAttribute("type", "hidden");
            el2.appendChild(input).setAttribute("name", "D");
            documentElement2.appendChild(el2).disabled = true;
            if (el2.querySelectorAll(":disabled").length !== 2) {
              rbuggyQSA.push(":enabled", ":disabled");
            }
            input = document3.createElement("input");
            input.setAttribute("name", "");
            el2.appendChild(input);
            if (!el2.querySelectorAll("[name='']").length) {
              rbuggyQSA.push("\\[" + whitespace2 + "*name" + whitespace2 + "*=" + whitespace2 + `*(?:''|"")`);
            }
          });
          if (!support.cssHas) {
            rbuggyQSA.push(":has");
          }
          rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
          sortOrder = function(a, b2) {
            if (a === b2) {
              hasDuplicate = true;
              return 0;
            }
            var compare = !a.compareDocumentPosition - !b2.compareDocumentPosition;
            if (compare) {
              return compare;
            }
            compare = (a.ownerDocument || a) == (b2.ownerDocument || b2) ? a.compareDocumentPosition(b2) : (
              // Otherwise we know they are disconnected
              1
            );
            if (compare & 1 || !support.sortDetached && b2.compareDocumentPosition(a) === compare) {
              if (a === document3 || a.ownerDocument == preferredDoc && find.contains(preferredDoc, a)) {
                return -1;
              }
              if (b2 === document3 || b2.ownerDocument == preferredDoc && find.contains(preferredDoc, b2)) {
                return 1;
              }
              return sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b2) : 0;
            }
            return compare & 4 ? -1 : 1;
          };
          return document3;
        }
        find.matches = function(expr, elements) {
          return find(expr, null, null, elements);
        };
        find.matchesSelector = function(elem, expr) {
          setDocument(elem);
          if (documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
            try {
              var ret = matches.call(elem, expr);
              if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              elem.document && elem.document.nodeType !== 11) {
                return ret;
              }
            } catch (e2) {
              nonnativeSelectorCache(expr, true);
            }
          }
          return find(expr, document3, null, [elem]).length > 0;
        };
        find.contains = function(context, elem) {
          if ((context.ownerDocument || context) != document3) {
            setDocument(context);
          }
          return jQuery.contains(context, elem);
        };
        find.attr = function(elem, name) {
          if ((elem.ownerDocument || elem) != document3) {
            setDocument(elem);
          }
          var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
          if (val !== void 0) {
            return val;
          }
          return elem.getAttribute(name);
        };
        find.error = function(msg) {
          throw new Error("Syntax error, unrecognized expression: " + msg);
        };
        jQuery.uniqueSort = function(results) {
          var elem, duplicates = [], j = 0, i2 = 0;
          hasDuplicate = !support.sortStable;
          sortInput = !support.sortStable && slice2.call(results, 0);
          sort.call(results, sortOrder);
          if (hasDuplicate) {
            while (elem = results[i2++]) {
              if (elem === results[i2]) {
                j = duplicates.push(i2);
              }
            }
            while (j--) {
              splice.call(results, duplicates[j], 1);
            }
          }
          sortInput = null;
          return results;
        };
        jQuery.fn.uniqueSort = function() {
          return this.pushStack(jQuery.uniqueSort(slice2.apply(this)));
        };
        Expr = jQuery.expr = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: markFunction,
          match: matchExpr,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: true },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: true },
            "~": { dir: "previousSibling" }
          },
          preFilter: {
            ATTR: function(match2) {
              match2[1] = match2[1].replace(runescape, funescape);
              match2[3] = (match2[3] || match2[4] || match2[5] || "").replace(runescape, funescape);
              if (match2[2] === "~=") {
                match2[3] = " " + match2[3] + " ";
              }
              return match2.slice(0, 4);
            },
            CHILD: function(match2) {
              match2[1] = match2[1].toLowerCase();
              if (match2[1].slice(0, 3) === "nth") {
                if (!match2[3]) {
                  find.error(match2[0]);
                }
                match2[4] = +(match2[4] ? match2[5] + (match2[6] || 1) : 2 * (match2[3] === "even" || match2[3] === "odd"));
                match2[5] = +(match2[7] + match2[8] || match2[3] === "odd");
              } else if (match2[3]) {
                find.error(match2[0]);
              }
              return match2;
            },
            PSEUDO: function(match2) {
              var excess, unquoted = !match2[6] && match2[2];
              if (matchExpr.CHILD.test(match2[0])) {
                return null;
              }
              if (match2[3]) {
                match2[2] = match2[4] || match2[5] || "";
              } else if (unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
              (excess = tokenize(unquoted, true)) && // advance to the next closing parenthesis
              (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                match2[0] = match2[0].slice(0, excess);
                match2[2] = unquoted.slice(0, excess);
              }
              return match2.slice(0, 3);
            }
          },
          filter: {
            TAG: function(nodeNameSelector) {
              var expectedNodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
              return nodeNameSelector === "*" ? function() {
                return true;
              } : function(elem) {
                return nodeName(elem, expectedNodeName);
              };
            },
            CLASS: function(className) {
              var pattern = classCache[className + " "];
              return pattern || (pattern = new RegExp("(^|" + whitespace2 + ")" + className + "(" + whitespace2 + "|$)")) && classCache(className, function(elem) {
                return pattern.test(
                  typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
                );
              });
            },
            ATTR: function(name, operator, check) {
              return function(elem) {
                var result = find.attr(elem, name);
                if (result == null) {
                  return operator === "!=";
                }
                if (!operator) {
                  return true;
                }
                result += "";
                if (operator === "=") {
                  return result === check;
                }
                if (operator === "!=") {
                  return result !== check;
                }
                if (operator === "^=") {
                  return check && result.indexOf(check) === 0;
                }
                if (operator === "*=") {
                  return check && result.indexOf(check) > -1;
                }
                if (operator === "$=") {
                  return check && result.slice(-check.length) === check;
                }
                if (operator === "~=") {
                  return (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1;
                }
                if (operator === "|=") {
                  return result === check || result.slice(0, check.length + 1) === check + "-";
                }
                return false;
              };
            },
            CHILD: function(type, what, _argument, first, last) {
              var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
              return first === 1 && last === 0 ? (
                // Shortcut for :nth-*(n)
                function(elem) {
                  return !!elem.parentNode;
                }
              ) : function(elem, _context, xml) {
                var cache, outerCache, node2, nodeIndex, start, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                if (parent) {
                  if (simple) {
                    while (dir2) {
                      node2 = elem;
                      while (node2 = node2[dir2]) {
                        if (ofType ? nodeName(node2, name) : node2.nodeType === 1) {
                          return false;
                        }
                      }
                      start = dir2 = type === "only" && !start && "nextSibling";
                    }
                    return true;
                  }
                  start = [forward ? parent.firstChild : parent.lastChild];
                  if (forward && useCache) {
                    outerCache = parent[expando] || (parent[expando] = {});
                    cache = outerCache[type] || [];
                    nodeIndex = cache[0] === dirruns && cache[1];
                    diff = nodeIndex && cache[2];
                    node2 = nodeIndex && parent.childNodes[nodeIndex];
                    while (node2 = ++nodeIndex && node2 && node2[dir2] || // Fallback to seeking `elem` from the start
                    (diff = nodeIndex = 0) || start.pop()) {
                      if (node2.nodeType === 1 && ++diff && node2 === elem) {
                        outerCache[type] = [dirruns, nodeIndex, diff];
                        break;
                      }
                    }
                  } else {
                    if (useCache) {
                      outerCache = elem[expando] || (elem[expando] = {});
                      cache = outerCache[type] || [];
                      nodeIndex = cache[0] === dirruns && cache[1];
                      diff = nodeIndex;
                    }
                    if (diff === false) {
                      while (node2 = ++nodeIndex && node2 && node2[dir2] || (diff = nodeIndex = 0) || start.pop()) {
                        if ((ofType ? nodeName(node2, name) : node2.nodeType === 1) && ++diff) {
                          if (useCache) {
                            outerCache = node2[expando] || (node2[expando] = {});
                            outerCache[type] = [dirruns, diff];
                          }
                          if (node2 === elem) {
                            break;
                          }
                        }
                      }
                    }
                  }
                  diff -= last;
                  return diff === first || diff % first === 0 && diff / first >= 0;
                }
              };
            },
            PSEUDO: function(pseudo, argument) {
              var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || find.error("unsupported pseudo: " + pseudo);
              if (fn[expando]) {
                return fn(argument);
              }
              if (fn.length > 1) {
                args = [pseudo, pseudo, "", argument];
                return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches2) {
                  var idx, matched = fn(seed, argument), i2 = matched.length;
                  while (i2--) {
                    idx = indexOf.call(seed, matched[i2]);
                    seed[idx] = !(matches2[idx] = matched[i2]);
                  }
                }) : function(elem) {
                  return fn(elem, 0, args);
                };
              }
              return fn;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: markFunction(function(selector) {
              var input = [], results = [], matcher = compile2(selector.replace(rtrimCSS, "$1"));
              return matcher[expando] ? markFunction(function(seed, matches2, _context, xml) {
                var elem, unmatched = matcher(seed, null, xml, []), i2 = seed.length;
                while (i2--) {
                  if (elem = unmatched[i2]) {
                    seed[i2] = !(matches2[i2] = elem);
                  }
                }
              }) : function(elem, _context, xml) {
                input[0] = elem;
                matcher(input, null, xml, results);
                input[0] = null;
                return !results.pop();
              };
            }),
            has: markFunction(function(selector) {
              return function(elem) {
                return find(selector, elem).length > 0;
              };
            }),
            contains: markFunction(function(text) {
              text = text.replace(runescape, funescape);
              return function(elem) {
                return (elem.textContent || jQuery.text(elem)).indexOf(text) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // https://www.w3.org/TR/selectors/#lang-pseudo
            lang: markFunction(function(lang) {
              if (!ridentifier.test(lang || "")) {
                find.error("unsupported lang: " + lang);
              }
              lang = lang.replace(runescape, funescape).toLowerCase();
              return function(elem) {
                var elemLang;
                do {
                  if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                    elemLang = elemLang.toLowerCase();
                    return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                  }
                } while ((elem = elem.parentNode) && elem.nodeType === 1);
                return false;
              };
            }),
            // Miscellaneous
            target: function(elem) {
              var hash2 = window2.location && window2.location.hash;
              return hash2 && hash2.slice(1) === elem.id;
            },
            root: function(elem) {
              return elem === documentElement2;
            },
            focus: function(elem) {
              return elem === safeActiveElement() && document3.hasFocus() && !!(elem.type || elem.href || ~elem.tabIndex);
            },
            // Boolean properties
            enabled: createDisabledPseudo(false),
            disabled: createDisabledPseudo(true),
            checked: function(elem) {
              return nodeName(elem, "input") && !!elem.checked || nodeName(elem, "option") && !!elem.selected;
            },
            selected: function(elem) {
              if (elem.parentNode) {
                elem.parentNode.selectedIndex;
              }
              return elem.selected === true;
            },
            // Contents
            empty: function(elem) {
              for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                if (elem.nodeType < 6) {
                  return false;
                }
              }
              return true;
            },
            parent: function(elem) {
              return !Expr.pseudos.empty(elem);
            },
            // Element/input types
            header: function(elem) {
              return rheader.test(elem.nodeName);
            },
            input: function(elem) {
              return rinputs.test(elem.nodeName);
            },
            button: function(elem) {
              return nodeName(elem, "input") && elem.type === "button" || nodeName(elem, "button");
            },
            text: function(elem) {
              var attr;
              return nodeName(elem, "input") && elem.type === "text" && // Support: IE <10 only
              // New HTML5 attribute values (e.g., "search") appear
              // with elem.type === "text"
              ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
            },
            // Position-in-collection
            first: createPositionalPseudo(function() {
              return [0];
            }),
            last: createPositionalPseudo(function(_matchIndexes, length2) {
              return [length2 - 1];
            }),
            eq: createPositionalPseudo(function(_matchIndexes, length2, argument) {
              return [argument < 0 ? argument + length2 : argument];
            }),
            even: createPositionalPseudo(function(matchIndexes, length2) {
              var i2 = 0;
              for (; i2 < length2; i2 += 2) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            }),
            odd: createPositionalPseudo(function(matchIndexes, length2) {
              var i2 = 1;
              for (; i2 < length2; i2 += 2) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            }),
            lt: createPositionalPseudo(function(matchIndexes, length2, argument) {
              var i2;
              if (argument < 0) {
                i2 = argument + length2;
              } else if (argument > length2) {
                i2 = length2;
              } else {
                i2 = argument;
              }
              for (; --i2 >= 0; ) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            }),
            gt: createPositionalPseudo(function(matchIndexes, length2, argument) {
              var i2 = argument < 0 ? argument + length2 : argument;
              for (; ++i2 < length2; ) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            })
          }
        };
        Expr.pseudos.nth = Expr.pseudos.eq;
        for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
          Expr.pseudos[i] = createInputPseudo(i);
        }
        for (i in { submit: true, reset: true }) {
          Expr.pseudos[i] = createButtonPseudo(i);
        }
        function setFilters() {
        }
        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();
        function tokenize(selector, parseOnly) {
          var matched, match2, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
          if (cached) {
            return parseOnly ? 0 : cached.slice(0);
          }
          soFar = selector;
          groups = [];
          preFilters = Expr.preFilter;
          while (soFar) {
            if (!matched || (match2 = rcomma.exec(soFar))) {
              if (match2) {
                soFar = soFar.slice(match2[0].length) || soFar;
              }
              groups.push(tokens = []);
            }
            matched = false;
            if (match2 = rleadingCombinator.exec(soFar)) {
              matched = match2.shift();
              tokens.push({
                value: matched,
                // Cast descendant combinators to space
                type: match2[0].replace(rtrimCSS, " ")
              });
              soFar = soFar.slice(matched.length);
            }
            for (type in Expr.filter) {
              if ((match2 = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match2 = preFilters[type](match2)))) {
                matched = match2.shift();
                tokens.push({
                  value: matched,
                  type,
                  matches: match2
                });
                soFar = soFar.slice(matched.length);
              }
            }
            if (!matched) {
              break;
            }
          }
          if (parseOnly) {
            return soFar.length;
          }
          return soFar ? find.error(selector) : (
            // Cache the tokens
            tokenCache(selector, groups).slice(0)
          );
        }
        function toSelector(tokens) {
          var i2 = 0, len = tokens.length, selector = "";
          for (; i2 < len; i2++) {
            selector += tokens[i2].value;
          }
          return selector;
        }
        function addCombinator(matcher, combinator, base) {
          var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base && key === "parentNode", doneName = done++;
          return combinator.first ? (
            // Check against closest ancestor/preceding element
            function(elem, context, xml) {
              while (elem = elem[dir2]) {
                if (elem.nodeType === 1 || checkNonElements) {
                  return matcher(elem, context, xml);
                }
              }
              return false;
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(elem, context, xml) {
              var oldCache, outerCache, newCache = [dirruns, doneName];
              if (xml) {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    if (matcher(elem, context, xml)) {
                      return true;
                    }
                  }
                }
              } else {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    outerCache = elem[expando] || (elem[expando] = {});
                    if (skip && nodeName(elem, skip)) {
                      elem = elem[dir2] || elem;
                    } else if ((oldCache = outerCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                      return newCache[2] = oldCache[2];
                    } else {
                      outerCache[key] = newCache;
                      if (newCache[2] = matcher(elem, context, xml)) {
                        return true;
                      }
                    }
                  }
                }
              }
              return false;
            }
          );
        }
        function elementMatcher(matchers) {
          return matchers.length > 1 ? function(elem, context, xml) {
            var i2 = matchers.length;
            while (i2--) {
              if (!matchers[i2](elem, context, xml)) {
                return false;
              }
            }
            return true;
          } : matchers[0];
        }
        function multipleContexts(selector, contexts, results) {
          var i2 = 0, len = contexts.length;
          for (; i2 < len; i2++) {
            find(selector, contexts[i2], results);
          }
          return results;
        }
        function condense(unmatched, map, filter, context, xml) {
          var elem, newUnmatched = [], i2 = 0, len = unmatched.length, mapped = map != null;
          for (; i2 < len; i2++) {
            if (elem = unmatched[i2]) {
              if (!filter || filter(elem, context, xml)) {
                newUnmatched.push(elem);
                if (mapped) {
                  map.push(i2);
                }
              }
            }
          }
          return newUnmatched;
        }
        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
          if (postFilter && !postFilter[expando]) {
            postFilter = setMatcher(postFilter);
          }
          if (postFinder && !postFinder[expando]) {
            postFinder = setMatcher(postFinder, postSelector);
          }
          return markFunction(function(seed, results, context, xml) {
            var temp, i2, elem, matcherOut, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
              selector || "*",
              context.nodeType ? [context] : context,
              []
            ), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems;
            if (matcher) {
              matcherOut = postFinder || (seed ? preFilter : preexisting || postFilter) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                results
              );
              matcher(matcherIn, matcherOut, context, xml);
            } else {
              matcherOut = matcherIn;
            }
            if (postFilter) {
              temp = condense(matcherOut, postMap);
              postFilter(temp, [], context, xml);
              i2 = temp.length;
              while (i2--) {
                if (elem = temp[i2]) {
                  matcherOut[postMap[i2]] = !(matcherIn[postMap[i2]] = elem);
                }
              }
            }
            if (seed) {
              if (postFinder || preFilter) {
                if (postFinder) {
                  temp = [];
                  i2 = matcherOut.length;
                  while (i2--) {
                    if (elem = matcherOut[i2]) {
                      temp.push(matcherIn[i2] = elem);
                    }
                  }
                  postFinder(null, matcherOut = [], temp, xml);
                }
                i2 = matcherOut.length;
                while (i2--) {
                  if ((elem = matcherOut[i2]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i2]) > -1) {
                    seed[temp] = !(results[temp] = elem);
                  }
                }
              }
            } else {
              matcherOut = condense(
                matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
              );
              if (postFinder) {
                postFinder(null, results, matcherOut, xml);
              } else {
                push2.apply(results, matcherOut);
              }
            }
          });
        }
        function matcherFromTokens(tokens) {
          var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i2 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
            return elem === checkContext;
          }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
            return indexOf.call(checkContext, elem) > -1;
          }, implicitRelative, true), matchers = [function(elem, context, xml) {
            var ret = !leadingRelative && (xml || context != outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
            checkContext = null;
            return ret;
          }];
          for (; i2 < len; i2++) {
            if (matcher = Expr.relative[tokens[i2].type]) {
              matchers = [addCombinator(elementMatcher(matchers), matcher)];
            } else {
              matcher = Expr.filter[tokens[i2].type].apply(null, tokens[i2].matches);
              if (matcher[expando]) {
                j = ++i2;
                for (; j < len; j++) {
                  if (Expr.relative[tokens[j].type]) {
                    break;
                  }
                }
                return setMatcher(
                  i2 > 1 && elementMatcher(matchers),
                  i2 > 1 && toSelector(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    tokens.slice(0, i2 - 1).concat({ value: tokens[i2 - 2].type === " " ? "*" : "" })
                  ).replace(rtrimCSS, "$1"),
                  matcher,
                  i2 < j && matcherFromTokens(tokens.slice(i2, j)),
                  j < len && matcherFromTokens(tokens = tokens.slice(j)),
                  j < len && toSelector(tokens)
                );
              }
              matchers.push(matcher);
            }
          }
          return elementMatcher(matchers);
        }
        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
          var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
            var elem, j, matcher, matchedCount = 0, i2 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
            if (outermost) {
              outermostContext = context == document3 || context || outermost;
            }
            for (; i2 !== len && (elem = elems[i2]) != null; i2++) {
              if (byElement && elem) {
                j = 0;
                if (!context && elem.ownerDocument != document3) {
                  setDocument(elem);
                  xml = !documentIsHTML;
                }
                while (matcher = elementMatchers[j++]) {
                  if (matcher(elem, context || document3, xml)) {
                    push2.call(results, elem);
                    break;
                  }
                }
                if (outermost) {
                  dirruns = dirrunsUnique;
                }
              }
              if (bySet) {
                if (elem = !matcher && elem) {
                  matchedCount--;
                }
                if (seed) {
                  unmatched.push(elem);
                }
              }
            }
            matchedCount += i2;
            if (bySet && i2 !== matchedCount) {
              j = 0;
              while (matcher = setMatchers[j++]) {
                matcher(unmatched, setMatched, context, xml);
              }
              if (seed) {
                if (matchedCount > 0) {
                  while (i2--) {
                    if (!(unmatched[i2] || setMatched[i2])) {
                      setMatched[i2] = pop.call(results);
                    }
                  }
                }
                setMatched = condense(setMatched);
              }
              push2.apply(results, setMatched);
              if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                jQuery.uniqueSort(results);
              }
            }
            if (outermost) {
              dirruns = dirrunsUnique;
              outermostContext = contextBackup;
            }
            return unmatched;
          };
          return bySet ? markFunction(superMatcher) : superMatcher;
        }
        function compile2(selector, match2) {
          var i2, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
          if (!cached) {
            if (!match2) {
              match2 = tokenize(selector);
            }
            i2 = match2.length;
            while (i2--) {
              cached = matcherFromTokens(match2[i2]);
              if (cached[expando]) {
                setMatchers.push(cached);
              } else {
                elementMatchers.push(cached);
              }
            }
            cached = compilerCache(
              selector,
              matcherFromGroupMatchers(elementMatchers, setMatchers)
            );
            cached.selector = selector;
          }
          return cached;
        }
        function select(selector, context, results, seed) {
          var i2, tokens, token2, type, find2, compiled = typeof selector === "function" && selector, match2 = !seed && tokenize(selector = compiled.selector || selector);
          results = results || [];
          if (match2.length === 1) {
            tokens = match2[0] = match2[0].slice(0);
            if (tokens.length > 2 && (token2 = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
              context = (Expr.find.ID(
                token2.matches[0].replace(runescape, funescape),
                context
              ) || [])[0];
              if (!context) {
                return results;
              } else if (compiled) {
                context = context.parentNode;
              }
              selector = selector.slice(tokens.shift().value.length);
            }
            i2 = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
            while (i2--) {
              token2 = tokens[i2];
              if (Expr.relative[type = token2.type]) {
                break;
              }
              if (find2 = Expr.find[type]) {
                if (seed = find2(
                  token2.matches[0].replace(runescape, funescape),
                  rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                )) {
                  tokens.splice(i2, 1);
                  selector = seed.length && toSelector(tokens);
                  if (!selector) {
                    push2.apply(results, seed);
                    return results;
                  }
                  break;
                }
              }
            }
          }
          (compiled || compile2(selector, match2))(
            seed,
            context,
            !documentIsHTML,
            results,
            !context || rsibling.test(selector) && testContext(context.parentNode) || context
          );
          return results;
        }
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
        setDocument();
        support.sortDetached = assert(function(el2) {
          return el2.compareDocumentPosition(document3.createElement("fieldset")) & 1;
        });
        jQuery.find = find;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = jQuery.uniqueSort;
        find.compile = compile2;
        find.select = select;
        find.setDocument = setDocument;
        find.tokenize = tokenize;
        find.escape = jQuery.escapeSelector;
        find.getText = jQuery.text;
        find.isXML = jQuery.isXMLDoc;
        find.selectors = jQuery.expr;
        find.support = jQuery.support;
        find.uniqueSort = jQuery.uniqueSort;
      })();
      var dir = function(elem, dir2, until) {
        var matched = [], truncate = until !== void 0;
        while ((elem = elem[dir2]) && elem.nodeType !== 9) {
          if (elem.nodeType === 1) {
            if (truncate && jQuery(elem).is(until)) {
              break;
            }
            matched.push(elem);
          }
        }
        return matched;
      };
      var siblings = function(n2, elem) {
        var matched = [];
        for (; n2; n2 = n2.nextSibling) {
          if (n2.nodeType === 1 && n2 !== elem) {
            matched.push(n2);
          }
        }
        return matched;
      };
      var rneedsContext = jQuery.expr.match.needsContext;
      var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
      function winnow(elements, qualifier, not) {
        if (isFunction(qualifier)) {
          return jQuery.grep(elements, function(elem, i) {
            return !!qualifier.call(elem, i, elem) !== not;
          });
        }
        if (qualifier.nodeType) {
          return jQuery.grep(elements, function(elem) {
            return elem === qualifier !== not;
          });
        }
        if (typeof qualifier !== "string") {
          return jQuery.grep(elements, function(elem) {
            return indexOf.call(qualifier, elem) > -1 !== not;
          });
        }
        return jQuery.filter(qualifier, elements, not);
      }
      jQuery.filter = function(expr, elems, not) {
        var elem = elems[0];
        if (not) {
          expr = ":not(" + expr + ")";
        }
        if (elems.length === 1 && elem.nodeType === 1) {
          return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
        }
        return jQuery.find.matches(expr, jQuery.grep(elems, function(elem2) {
          return elem2.nodeType === 1;
        }));
      };
      jQuery.fn.extend({
        find: function(selector) {
          var i, ret, len = this.length, self2 = this;
          if (typeof selector !== "string") {
            return this.pushStack(jQuery(selector).filter(function() {
              for (i = 0; i < len; i++) {
                if (jQuery.contains(self2[i], this)) {
                  return true;
                }
              }
            }));
          }
          ret = this.pushStack([]);
          for (i = 0; i < len; i++) {
            jQuery.find(selector, self2[i], ret);
          }
          return len > 1 ? jQuery.uniqueSort(ret) : ret;
        },
        filter: function(selector) {
          return this.pushStack(winnow(this, selector || [], false));
        },
        not: function(selector) {
          return this.pushStack(winnow(this, selector || [], true));
        },
        is: function(selector) {
          return !!winnow(
            this,
            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [],
            false
          ).length;
        }
      });
      var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init = jQuery.fn.init = function(selector, context, root) {
        var match2, elem;
        if (!selector) {
          return this;
        }
        root = root || rootjQuery;
        if (typeof selector === "string") {
          if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
            match2 = [null, selector, null];
          } else {
            match2 = rquickExpr.exec(selector);
          }
          if (match2 && (match2[1] || !context)) {
            if (match2[1]) {
              context = context instanceof jQuery ? context[0] : context;
              jQuery.merge(this, jQuery.parseHTML(
                match2[1],
                context && context.nodeType ? context.ownerDocument || context : document2,
                true
              ));
              if (rsingleTag.test(match2[1]) && jQuery.isPlainObject(context)) {
                for (match2 in context) {
                  if (isFunction(this[match2])) {
                    this[match2](context[match2]);
                  } else {
                    this.attr(match2, context[match2]);
                  }
                }
              }
              return this;
            } else {
              elem = document2.getElementById(match2[2]);
              if (elem) {
                this[0] = elem;
                this.length = 1;
              }
              return this;
            }
          } else if (!context || context.jquery) {
            return (context || root).find(selector);
          } else {
            return this.constructor(context).find(selector);
          }
        } else if (selector.nodeType) {
          this[0] = selector;
          this.length = 1;
          return this;
        } else if (isFunction(selector)) {
          return root.ready !== void 0 ? root.ready(selector) : (
            // Execute immediately if ready is not present
            selector(jQuery)
          );
        }
        return jQuery.makeArray(selector, this);
      };
      init.prototype = jQuery.fn;
      rootjQuery = jQuery(document2);
      var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
      };
      jQuery.fn.extend({
        has: function(target) {
          var targets = jQuery(target, this), l2 = targets.length;
          return this.filter(function() {
            var i = 0;
            for (; i < l2; i++) {
              if (jQuery.contains(this, targets[i])) {
                return true;
              }
            }
          });
        },
        closest: function(selectors, context) {
          var cur, i = 0, l2 = this.length, matched = [], targets = typeof selectors !== "string" && jQuery(selectors);
          if (!rneedsContext.test(selectors)) {
            for (; i < l2; i++) {
              for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : (
                  // Don't pass non-elements to jQuery#find
                  cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors)
                ))) {
                  matched.push(cur);
                  break;
                }
              }
            }
          }
          return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
        },
        // Determine the position of an element within the set
        index: function(elem) {
          if (!elem) {
            return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
          }
          if (typeof elem === "string") {
            return indexOf.call(jQuery(elem), this[0]);
          }
          return indexOf.call(
            this,
            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem
          );
        },
        add: function(selector, context) {
          return this.pushStack(
            jQuery.uniqueSort(
              jQuery.merge(this.get(), jQuery(selector, context))
            )
          );
        },
        addBack: function(selector) {
          return this.add(
            selector == null ? this.prevObject : this.prevObject.filter(selector)
          );
        }
      });
      function sibling(cur, dir2) {
        while ((cur = cur[dir2]) && cur.nodeType !== 1) {
        }
        return cur;
      }
      jQuery.each({
        parent: function(elem) {
          var parent = elem.parentNode;
          return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function(elem) {
          return dir(elem, "parentNode");
        },
        parentsUntil: function(elem, _i, until) {
          return dir(elem, "parentNode", until);
        },
        next: function(elem) {
          return sibling(elem, "nextSibling");
        },
        prev: function(elem) {
          return sibling(elem, "previousSibling");
        },
        nextAll: function(elem) {
          return dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
          return dir(elem, "previousSibling");
        },
        nextUntil: function(elem, _i, until) {
          return dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, _i, until) {
          return dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
          return siblings((elem.parentNode || {}).firstChild, elem);
        },
        children: function(elem) {
          return siblings(elem.firstChild);
        },
        contents: function(elem) {
          if (elem.contentDocument != null && // Support: IE 11+
          // <object> elements with no `data` attribute has an object
          // `contentDocument` with a `null` prototype.
          getProto(elem.contentDocument)) {
            return elem.contentDocument;
          }
          if (nodeName(elem, "template")) {
            elem = elem.content || elem;
          }
          return jQuery.merge([], elem.childNodes);
        }
      }, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
          var matched = jQuery.map(this, fn, until);
          if (name.slice(-5) !== "Until") {
            selector = until;
          }
          if (selector && typeof selector === "string") {
            matched = jQuery.filter(selector, matched);
          }
          if (this.length > 1) {
            if (!guaranteedUnique[name]) {
              jQuery.uniqueSort(matched);
            }
            if (rparentsprev.test(name)) {
              matched.reverse();
            }
          }
          return this.pushStack(matched);
        };
      });
      var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
      function createOptions(options) {
        var object = {};
        jQuery.each(options.match(rnothtmlwhite) || [], function(_, flag) {
          object[flag] = true;
        });
        return object;
      }
      jQuery.Callbacks = function(options) {
        options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);
        var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
          locked = locked || options.once;
          fired = firing = true;
          for (; queue.length; firingIndex = -1) {
            memory = queue.shift();
            while (++firingIndex < list.length) {
              if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                firingIndex = list.length;
                memory = false;
              }
            }
          }
          if (!options.memory) {
            memory = false;
          }
          firing = false;
          if (locked) {
            if (memory) {
              list = [];
            } else {
              list = "";
            }
          }
        }, self2 = {
          // Add a callback or a collection of callbacks to the list
          add: function() {
            if (list) {
              if (memory && !firing) {
                firingIndex = list.length - 1;
                queue.push(memory);
              }
              (function add(args) {
                jQuery.each(args, function(_, arg2) {
                  if (isFunction(arg2)) {
                    if (!options.unique || !self2.has(arg2)) {
                      list.push(arg2);
                    }
                  } else if (arg2 && arg2.length && toType(arg2) !== "string") {
                    add(arg2);
                  }
                });
              })(arguments);
              if (memory && !firing) {
                fire();
              }
            }
            return this;
          },
          // Remove a callback from the list
          remove: function() {
            jQuery.each(arguments, function(_, arg2) {
              var index;
              while ((index = jQuery.inArray(arg2, list, index)) > -1) {
                list.splice(index, 1);
                if (index <= firingIndex) {
                  firingIndex--;
                }
              }
            });
            return this;
          },
          // Check if a given callback is in the list.
          // If no argument is given, return whether or not list has callbacks attached.
          has: function(fn) {
            return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
          },
          // Remove all callbacks from the list
          empty: function() {
            if (list) {
              list = [];
            }
            return this;
          },
          // Disable .fire and .add
          // Abort any current/pending executions
          // Clear all callbacks and values
          disable: function() {
            locked = queue = [];
            list = memory = "";
            return this;
          },
          disabled: function() {
            return !list;
          },
          // Disable .fire
          // Also disable .add unless we have memory (since it would have no effect)
          // Abort any pending executions
          lock: function() {
            locked = queue = [];
            if (!memory && !firing) {
              list = memory = "";
            }
            return this;
          },
          locked: function() {
            return !!locked;
          },
          // Call all callbacks with the given context and arguments
          fireWith: function(context, args) {
            if (!locked) {
              args = args || [];
              args = [context, args.slice ? args.slice() : args];
              queue.push(args);
              if (!firing) {
                fire();
              }
            }
            return this;
          },
          // Call all the callbacks with the given arguments
          fire: function() {
            self2.fireWith(this, arguments);
            return this;
          },
          // To know if the callbacks have already been called at least once
          fired: function() {
            return !!fired;
          }
        };
        return self2;
      };
      function Identity(v2) {
        return v2;
      }
      function Thrower(ex) {
        throw ex;
      }
      function adoptValue(value, resolve, reject, noValue) {
        var method;
        try {
          if (value && isFunction(method = value.promise)) {
            method.call(value).done(resolve).fail(reject);
          } else if (value && isFunction(method = value.then)) {
            method.call(value, resolve, reject);
          } else {
            resolve.apply(void 0, [value].slice(noValue));
          }
        } catch (value2) {
          reject.apply(void 0, [value2]);
        }
      }
      jQuery.extend({
        Deferred: function(func) {
          var tuples = [
            // action, add listener, callbacks,
            // ... .then handlers, argument index, [final state]
            [
              "notify",
              "progress",
              jQuery.Callbacks("memory"),
              jQuery.Callbacks("memory"),
              2
            ],
            [
              "resolve",
              "done",
              jQuery.Callbacks("once memory"),
              jQuery.Callbacks("once memory"),
              0,
              "resolved"
            ],
            [
              "reject",
              "fail",
              jQuery.Callbacks("once memory"),
              jQuery.Callbacks("once memory"),
              1,
              "rejected"
            ]
          ], state = "pending", promise = {
            state: function() {
              return state;
            },
            always: function() {
              deferred.done(arguments).fail(arguments);
              return this;
            },
            "catch": function(fn) {
              return promise.then(null, fn);
            },
            // Keep pipe for back-compat
            pipe: function() {
              var fns = arguments;
              return jQuery.Deferred(function(newDefer) {
                jQuery.each(tuples, function(_i, tuple) {
                  var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                  deferred[tuple[1]](function() {
                    var returned = fn && fn.apply(this, arguments);
                    if (returned && isFunction(returned.promise)) {
                      returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                    } else {
                      newDefer[tuple[0] + "With"](
                        this,
                        fn ? [returned] : arguments
                      );
                    }
                  });
                });
                fns = null;
              }).promise();
            },
            then: function(onFulfilled, onRejected, onProgress) {
              var maxDepth = 0;
              function resolve(depth, deferred2, handler, special) {
                return function() {
                  var that = this, args = arguments, mightThrow = function() {
                    var returned, then;
                    if (depth < maxDepth) {
                      return;
                    }
                    returned = handler.apply(that, args);
                    if (returned === deferred2.promise()) {
                      throw new TypeError("Thenable self-resolution");
                    }
                    then = returned && // Support: Promises/A+ section 2.3.4
                    // https://promisesaplus.com/#point-64
                    // Only check objects and functions for thenability
                    (typeof returned === "object" || typeof returned === "function") && returned.then;
                    if (isFunction(then)) {
                      if (special) {
                        then.call(
                          returned,
                          resolve(maxDepth, deferred2, Identity, special),
                          resolve(maxDepth, deferred2, Thrower, special)
                        );
                      } else {
                        maxDepth++;
                        then.call(
                          returned,
                          resolve(maxDepth, deferred2, Identity, special),
                          resolve(maxDepth, deferred2, Thrower, special),
                          resolve(
                            maxDepth,
                            deferred2,
                            Identity,
                            deferred2.notifyWith
                          )
                        );
                      }
                    } else {
                      if (handler !== Identity) {
                        that = void 0;
                        args = [returned];
                      }
                      (special || deferred2.resolveWith)(that, args);
                    }
                  }, process = special ? mightThrow : function() {
                    try {
                      mightThrow();
                    } catch (e2) {
                      if (jQuery.Deferred.exceptionHook) {
                        jQuery.Deferred.exceptionHook(
                          e2,
                          process.error
                        );
                      }
                      if (depth + 1 >= maxDepth) {
                        if (handler !== Thrower) {
                          that = void 0;
                          args = [e2];
                        }
                        deferred2.rejectWith(that, args);
                      }
                    }
                  };
                  if (depth) {
                    process();
                  } else {
                    if (jQuery.Deferred.getErrorHook) {
                      process.error = jQuery.Deferred.getErrorHook();
                    } else if (jQuery.Deferred.getStackHook) {
                      process.error = jQuery.Deferred.getStackHook();
                    }
                    window2.setTimeout(process);
                  }
                };
              }
              return jQuery.Deferred(function(newDefer) {
                tuples[0][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onProgress) ? onProgress : Identity,
                    newDefer.notifyWith
                  )
                );
                tuples[1][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onFulfilled) ? onFulfilled : Identity
                  )
                );
                tuples[2][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onRejected) ? onRejected : Thrower
                  )
                );
              }).promise();
            },
            // Get a promise for this deferred
            // If obj is provided, the promise aspect is added to the object
            promise: function(obj) {
              return obj != null ? jQuery.extend(obj, promise) : promise;
            }
          }, deferred = {};
          jQuery.each(tuples, function(i, tuple) {
            var list = tuple[2], stateString = tuple[5];
            promise[tuple[1]] = list.add;
            if (stateString) {
              list.add(
                function() {
                  state = stateString;
                },
                // rejected_callbacks.disable
                // fulfilled_callbacks.disable
                tuples[3 - i][2].disable,
                // rejected_handlers.disable
                // fulfilled_handlers.disable
                tuples[3 - i][3].disable,
                // progress_callbacks.lock
                tuples[0][2].lock,
                // progress_handlers.lock
                tuples[0][3].lock
              );
            }
            list.add(tuple[3].fire);
            deferred[tuple[0]] = function() {
              deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
              return this;
            };
            deferred[tuple[0] + "With"] = list.fireWith;
          });
          promise.promise(deferred);
          if (func) {
            func.call(deferred, deferred);
          }
          return deferred;
        },
        // Deferred helper
        when: function(singleValue) {
          var remaining = arguments.length, i = remaining, resolveContexts = Array(i), resolveValues = slice2.call(arguments), primary = jQuery.Deferred(), updateFunc = function(i2) {
            return function(value) {
              resolveContexts[i2] = this;
              resolveValues[i2] = arguments.length > 1 ? slice2.call(arguments) : value;
              if (!--remaining) {
                primary.resolveWith(resolveContexts, resolveValues);
              }
            };
          };
          if (remaining <= 1) {
            adoptValue(
              singleValue,
              primary.done(updateFunc(i)).resolve,
              primary.reject,
              !remaining
            );
            if (primary.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)) {
              return primary.then();
            }
          }
          while (i--) {
            adoptValue(resolveValues[i], updateFunc(i), primary.reject);
          }
          return primary.promise();
        }
      });
      var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
      jQuery.Deferred.exceptionHook = function(error, asyncError) {
        if (window2.console && window2.console.warn && error && rerrorNames.test(error.name)) {
          window2.console.warn(
            "jQuery.Deferred exception: " + error.message,
            error.stack,
            asyncError
          );
        }
      };
      jQuery.readyException = function(error) {
        window2.setTimeout(function() {
          throw error;
        });
      };
      var readyList = jQuery.Deferred();
      jQuery.fn.ready = function(fn) {
        readyList.then(fn).catch(function(error) {
          jQuery.readyException(error);
        });
        return this;
      };
      jQuery.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,
        // A counter to track how many items to wait for before
        // the ready event fires. See trac-6781
        readyWait: 1,
        // Handle when the DOM is ready
        ready: function(wait) {
          if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
            return;
          }
          jQuery.isReady = true;
          if (wait !== true && --jQuery.readyWait > 0) {
            return;
          }
          readyList.resolveWith(document2, [jQuery]);
        }
      });
      jQuery.ready.then = readyList.then;
      function completed() {
        document2.removeEventListener("DOMContentLoaded", completed);
        window2.removeEventListener("load", completed);
        jQuery.ready();
      }
      if (document2.readyState === "complete" || document2.readyState !== "loading" && !document2.documentElement.doScroll) {
        window2.setTimeout(jQuery.ready);
      } else {
        document2.addEventListener("DOMContentLoaded", completed);
        window2.addEventListener("load", completed);
      }
      var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0, len = elems.length, bulk = key == null;
        if (toType(key) === "object") {
          chainable = true;
          for (i in key) {
            access(elems, fn, i, key[i], true, emptyGet, raw);
          }
        } else if (value !== void 0) {
          chainable = true;
          if (!isFunction(value)) {
            raw = true;
          }
          if (bulk) {
            if (raw) {
              fn.call(elems, value);
              fn = null;
            } else {
              bulk = fn;
              fn = function(elem, _key, value2) {
                return bulk.call(jQuery(elem), value2);
              };
            }
          }
          if (fn) {
            for (; i < len; i++) {
              fn(
                elems[i],
                key,
                raw ? value : value.call(elems[i], i, fn(elems[i], key))
              );
            }
          }
        }
        if (chainable) {
          return elems;
        }
        if (bulk) {
          return fn.call(elems);
        }
        return len ? fn(elems[0], key) : emptyGet;
      };
      var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
      function fcamelCase(_all, letter) {
        return letter.toUpperCase();
      }
      function camelCase(string) {
        return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
      }
      var acceptData = function(owner) {
        return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
      };
      function Data() {
        this.expando = jQuery.expando + Data.uid++;
      }
      Data.uid = 1;
      Data.prototype = {
        cache: function(owner) {
          var value = owner[this.expando];
          if (!value) {
            value = {};
            if (acceptData(owner)) {
              if (owner.nodeType) {
                owner[this.expando] = value;
              } else {
                Object.defineProperty(owner, this.expando, {
                  value,
                  configurable: true
                });
              }
            }
          }
          return value;
        },
        set: function(owner, data, value) {
          var prop, cache = this.cache(owner);
          if (typeof data === "string") {
            cache[camelCase(data)] = value;
          } else {
            for (prop in data) {
              cache[camelCase(prop)] = data[prop];
            }
          }
          return cache;
        },
        get: function(owner, key) {
          return key === void 0 ? this.cache(owner) : (
            // Always use camelCase key (gh-2257)
            owner[this.expando] && owner[this.expando][camelCase(key)]
          );
        },
        access: function(owner, key, value) {
          if (key === void 0 || key && typeof key === "string" && value === void 0) {
            return this.get(owner, key);
          }
          this.set(owner, key, value);
          return value !== void 0 ? value : key;
        },
        remove: function(owner, key) {
          var i, cache = owner[this.expando];
          if (cache === void 0) {
            return;
          }
          if (key !== void 0) {
            if (Array.isArray(key)) {
              key = key.map(camelCase);
            } else {
              key = camelCase(key);
              key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
            }
            i = key.length;
            while (i--) {
              delete cache[key[i]];
            }
          }
          if (key === void 0 || jQuery.isEmptyObject(cache)) {
            if (owner.nodeType) {
              owner[this.expando] = void 0;
            } else {
              delete owner[this.expando];
            }
          }
        },
        hasData: function(owner) {
          var cache = owner[this.expando];
          return cache !== void 0 && !jQuery.isEmptyObject(cache);
        }
      };
      var dataPriv = new Data();
      var dataUser = new Data();
      var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
      function getData(data) {
        if (data === "true") {
          return true;
        }
        if (data === "false") {
          return false;
        }
        if (data === "null") {
          return null;
        }
        if (data === +data + "") {
          return +data;
        }
        if (rbrace.test(data)) {
          return JSON.parse(data);
        }
        return data;
      }
      function dataAttr(elem, key, data) {
        var name;
        if (data === void 0 && elem.nodeType === 1) {
          name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
          data = elem.getAttribute(name);
          if (typeof data === "string") {
            try {
              data = getData(data);
            } catch (e2) {
            }
            dataUser.set(elem, key, data);
          } else {
            data = void 0;
          }
        }
        return data;
      }
      jQuery.extend({
        hasData: function(elem) {
          return dataUser.hasData(elem) || dataPriv.hasData(elem);
        },
        data: function(elem, name, data) {
          return dataUser.access(elem, name, data);
        },
        removeData: function(elem, name) {
          dataUser.remove(elem, name);
        },
        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function(elem, name, data) {
          return dataPriv.access(elem, name, data);
        },
        _removeData: function(elem, name) {
          dataPriv.remove(elem, name);
        }
      });
      jQuery.fn.extend({
        data: function(key, value) {
          var i, name, data, elem = this[0], attrs = elem && elem.attributes;
          if (key === void 0) {
            if (this.length) {
              data = dataUser.get(elem);
              if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                i = attrs.length;
                while (i--) {
                  if (attrs[i]) {
                    name = attrs[i].name;
                    if (name.indexOf("data-") === 0) {
                      name = camelCase(name.slice(5));
                      dataAttr(elem, name, data[name]);
                    }
                  }
                }
                dataPriv.set(elem, "hasDataAttrs", true);
              }
            }
            return data;
          }
          if (typeof key === "object") {
            return this.each(function() {
              dataUser.set(this, key);
            });
          }
          return access(this, function(value2) {
            var data2;
            if (elem && value2 === void 0) {
              data2 = dataUser.get(elem, key);
              if (data2 !== void 0) {
                return data2;
              }
              data2 = dataAttr(elem, key);
              if (data2 !== void 0) {
                return data2;
              }
              return;
            }
            this.each(function() {
              dataUser.set(this, key, value2);
            });
          }, null, value, arguments.length > 1, null, true);
        },
        removeData: function(key) {
          return this.each(function() {
            dataUser.remove(this, key);
          });
        }
      });
      jQuery.extend({
        queue: function(elem, type, data) {
          var queue;
          if (elem) {
            type = (type || "fx") + "queue";
            queue = dataPriv.get(elem, type);
            if (data) {
              if (!queue || Array.isArray(data)) {
                queue = dataPriv.access(elem, type, jQuery.makeArray(data));
              } else {
                queue.push(data);
              }
            }
            return queue || [];
          }
        },
        dequeue: function(elem, type) {
          type = type || "fx";
          var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next2 = function() {
            jQuery.dequeue(elem, type);
          };
          if (fn === "inprogress") {
            fn = queue.shift();
            startLength--;
          }
          if (fn) {
            if (type === "fx") {
              queue.unshift("inprogress");
            }
            delete hooks.stop;
            fn.call(elem, next2, hooks);
          }
          if (!startLength && hooks) {
            hooks.empty.fire();
          }
        },
        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function(elem, type) {
          var key = type + "queueHooks";
          return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
            empty: jQuery.Callbacks("once memory").add(function() {
              dataPriv.remove(elem, [type + "queue", key]);
            })
          });
        }
      });
      jQuery.fn.extend({
        queue: function(type, data) {
          var setter = 2;
          if (typeof type !== "string") {
            data = type;
            type = "fx";
            setter--;
          }
          if (arguments.length < setter) {
            return jQuery.queue(this[0], type);
          }
          return data === void 0 ? this : this.each(function() {
            var queue = jQuery.queue(this, type, data);
            jQuery._queueHooks(this, type);
            if (type === "fx" && queue[0] !== "inprogress") {
              jQuery.dequeue(this, type);
            }
          });
        },
        dequeue: function(type) {
          return this.each(function() {
            jQuery.dequeue(this, type);
          });
        },
        clearQueue: function(type) {
          return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function(type, obj) {
          var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
            if (!--count) {
              defer.resolveWith(elements, [elements]);
            }
          };
          if (typeof type !== "string") {
            obj = type;
            type = void 0;
          }
          type = type || "fx";
          while (i--) {
            tmp = dataPriv.get(elements[i], type + "queueHooks");
            if (tmp && tmp.empty) {
              count++;
              tmp.empty.add(resolve);
            }
          }
          resolve();
          return defer.promise(obj);
        }
      });
      var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
      var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
      var cssExpand = ["Top", "Right", "Bottom", "Left"];
      var documentElement = document2.documentElement;
      var isAttached = function(elem) {
        return jQuery.contains(elem.ownerDocument, elem);
      }, composed = { composed: true };
      if (documentElement.getRootNode) {
        isAttached = function(elem) {
          return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
        };
      }
      var isHiddenWithinTree = function(elem, el2) {
        elem = el2 || elem;
        return elem.style.display === "none" || elem.style.display === "" && // Otherwise, check computed style
        // Support: Firefox <=43 - 45
        // Disconnected elements can have computed display: none, so first confirm that elem is
        // in the document.
        isAttached(elem) && jQuery.css(elem, "display") === "none";
      };
      function adjustCSS(elem, prop, valueParts, tween) {
        var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
          return tween.cur();
        } : function() {
          return jQuery.css(elem, prop, "");
        }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));
        if (initialInUnit && initialInUnit[3] !== unit) {
          initial = initial / 2;
          unit = unit || initialInUnit[3];
          initialInUnit = +initial || 1;
          while (maxIterations--) {
            jQuery.style(elem, prop, initialInUnit + unit);
            if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
              maxIterations = 0;
            }
            initialInUnit = initialInUnit / scale;
          }
          initialInUnit = initialInUnit * 2;
          jQuery.style(elem, prop, initialInUnit + unit);
          valueParts = valueParts || [];
        }
        if (valueParts) {
          initialInUnit = +initialInUnit || +initial || 0;
          adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
          if (tween) {
            tween.unit = unit;
            tween.start = initialInUnit;
            tween.end = adjusted;
          }
        }
        return adjusted;
      }
      var defaultDisplayMap = {};
      function getDefaultDisplay(elem) {
        var temp, doc = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
        if (display) {
          return display;
        }
        temp = doc.body.appendChild(doc.createElement(nodeName2));
        display = jQuery.css(temp, "display");
        temp.parentNode.removeChild(temp);
        if (display === "none") {
          display = "block";
        }
        defaultDisplayMap[nodeName2] = display;
        return display;
      }
      function showHide(elements, show) {
        var display, elem, values2 = [], index = 0, length2 = elements.length;
        for (; index < length2; index++) {
          elem = elements[index];
          if (!elem.style) {
            continue;
          }
          display = elem.style.display;
          if (show) {
            if (display === "none") {
              values2[index] = dataPriv.get(elem, "display") || null;
              if (!values2[index]) {
                elem.style.display = "";
              }
            }
            if (elem.style.display === "" && isHiddenWithinTree(elem)) {
              values2[index] = getDefaultDisplay(elem);
            }
          } else {
            if (display !== "none") {
              values2[index] = "none";
              dataPriv.set(elem, "display", display);
            }
          }
        }
        for (index = 0; index < length2; index++) {
          if (values2[index] != null) {
            elements[index].style.display = values2[index];
          }
        }
        return elements;
      }
      jQuery.fn.extend({
        show: function() {
          return showHide(this, true);
        },
        hide: function() {
          return showHide(this);
        },
        toggle: function(state) {
          if (typeof state === "boolean") {
            return state ? this.show() : this.hide();
          }
          return this.each(function() {
            if (isHiddenWithinTree(this)) {
              jQuery(this).show();
            } else {
              jQuery(this).hide();
            }
          });
        }
      });
      var rcheckableType = /^(?:checkbox|radio)$/i;
      var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
      var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
      (function() {
        var fragment = document2.createDocumentFragment(), div = fragment.appendChild(document2.createElement("div")), input = document2.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("checked", "checked");
        input.setAttribute("name", "t");
        div.appendChild(input);
        support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
        div.innerHTML = "<textarea>x</textarea>";
        support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
        div.innerHTML = "<option></option>";
        support.option = !!div.lastChild;
      })();
      var wrapMap = {
        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
      };
      wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
      wrapMap.th = wrapMap.td;
      if (!support.option) {
        wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
      }
      function getAll(context, tag) {
        var ret;
        if (typeof context.getElementsByTagName !== "undefined") {
          ret = context.getElementsByTagName(tag || "*");
        } else if (typeof context.querySelectorAll !== "undefined") {
          ret = context.querySelectorAll(tag || "*");
        } else {
          ret = [];
        }
        if (tag === void 0 || tag && nodeName(context, tag)) {
          return jQuery.merge([context], ret);
        }
        return ret;
      }
      function setGlobalEval(elems, refElements) {
        var i = 0, l2 = elems.length;
        for (; i < l2; i++) {
          dataPriv.set(
            elems[i],
            "globalEval",
            !refElements || dataPriv.get(refElements[i], "globalEval")
          );
        }
      }
      var rhtml = /<|&#?\w+;/;
      function buildFragment(elems, context, scripts, selection, ignored) {
        var elem, tmp, tag, wrap, attached, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l2 = elems.length;
        for (; i < l2; i++) {
          elem = elems[i];
          if (elem || elem === 0) {
            if (toType(elem) === "object") {
              jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
            } else if (!rhtml.test(elem)) {
              nodes.push(context.createTextNode(elem));
            } else {
              tmp = tmp || fragment.appendChild(context.createElement("div"));
              tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
              wrap = wrapMap[tag] || wrapMap._default;
              tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
              j = wrap[0];
              while (j--) {
                tmp = tmp.lastChild;
              }
              jQuery.merge(nodes, tmp.childNodes);
              tmp = fragment.firstChild;
              tmp.textContent = "";
            }
          }
        }
        fragment.textContent = "";
        i = 0;
        while (elem = nodes[i++]) {
          if (selection && jQuery.inArray(elem, selection) > -1) {
            if (ignored) {
              ignored.push(elem);
            }
            continue;
          }
          attached = isAttached(elem);
          tmp = getAll(fragment.appendChild(elem), "script");
          if (attached) {
            setGlobalEval(tmp);
          }
          if (scripts) {
            j = 0;
            while (elem = tmp[j++]) {
              if (rscriptType.test(elem.type || "")) {
                scripts.push(elem);
              }
            }
          }
        }
        return fragment;
      }
      var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
      function returnTrue() {
        return true;
      }
      function returnFalse() {
        return false;
      }
      function on(elem, types, selector, data, fn, one) {
        var origFn, type;
        if (typeof types === "object") {
          if (typeof selector !== "string") {
            data = data || selector;
            selector = void 0;
          }
          for (type in types) {
            on(elem, type, selector, data, types[type], one);
          }
          return elem;
        }
        if (data == null && fn == null) {
          fn = selector;
          data = selector = void 0;
        } else if (fn == null) {
          if (typeof selector === "string") {
            fn = data;
            data = void 0;
          } else {
            fn = data;
            data = selector;
            selector = void 0;
          }
        }
        if (fn === false) {
          fn = returnFalse;
        } else if (!fn) {
          return elem;
        }
        if (one === 1) {
          origFn = fn;
          fn = function(event) {
            jQuery().off(event);
            return origFn.apply(this, arguments);
          };
          fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
        }
        return elem.each(function() {
          jQuery.event.add(this, types, fn, data, selector);
        });
      }
      jQuery.event = {
        global: {},
        add: function(elem, types, handler, data, selector) {
          var handleObjIn, eventHandle, tmp, events, t2, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
          if (!acceptData(elem)) {
            return;
          }
          if (handler.handler) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
            selector = handleObjIn.selector;
          }
          if (selector) {
            jQuery.find.matchesSelector(documentElement, selector);
          }
          if (!handler.guid) {
            handler.guid = jQuery.guid++;
          }
          if (!(events = elemData.events)) {
            events = elemData.events = /* @__PURE__ */ Object.create(null);
          }
          if (!(eventHandle = elemData.handle)) {
            eventHandle = elemData.handle = function(e2) {
              return typeof jQuery !== "undefined" && jQuery.event.triggered !== e2.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
            };
          }
          types = (types || "").match(rnothtmlwhite) || [""];
          t2 = types.length;
          while (t2--) {
            tmp = rtypenamespace.exec(types[t2]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();
            if (!type) {
              continue;
            }
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            special = jQuery.event.special[type] || {};
            handleObj = jQuery.extend({
              type,
              origType,
              data,
              handler,
              guid: handler.guid,
              selector,
              needsContext: selector && jQuery.expr.match.needsContext.test(selector),
              namespace: namespaces.join(".")
            }, handleObjIn);
            if (!(handlers = events[type])) {
              handlers = events[type] = [];
              handlers.delegateCount = 0;
              if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                if (elem.addEventListener) {
                  elem.addEventListener(type, eventHandle);
                }
              }
            }
            if (special.add) {
              special.add.call(elem, handleObj);
              if (!handleObj.handler.guid) {
                handleObj.handler.guid = handler.guid;
              }
            }
            if (selector) {
              handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
              handlers.push(handleObj);
            }
            jQuery.event.global[type] = true;
          }
        },
        // Detach an event or set of events from an element
        remove: function(elem, types, handler, selector, mappedTypes) {
          var j, origCount, tmp, events, t2, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
          if (!elemData || !(events = elemData.events)) {
            return;
          }
          types = (types || "").match(rnothtmlwhite) || [""];
          t2 = types.length;
          while (t2--) {
            tmp = rtypenamespace.exec(types[t2]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();
            if (!type) {
              for (type in events) {
                jQuery.event.remove(elem, type + types[t2], handler, selector, true);
              }
              continue;
            }
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            handlers = events[type] || [];
            tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
            origCount = j = handlers.length;
            while (j--) {
              handleObj = handlers[j];
              if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                handlers.splice(j, 1);
                if (handleObj.selector) {
                  handlers.delegateCount--;
                }
                if (special.remove) {
                  special.remove.call(elem, handleObj);
                }
              }
            }
            if (origCount && !handlers.length) {
              if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                jQuery.removeEvent(elem, type, elemData.handle);
              }
              delete events[type];
            }
          }
          if (jQuery.isEmptyObject(events)) {
            dataPriv.remove(elem, "handle events");
          }
        },
        dispatch: function(nativeEvent) {
          var i, j, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
          args[0] = event;
          for (i = 1; i < arguments.length; i++) {
            args[i] = arguments[i];
          }
          event.delegateTarget = this;
          if (special.preDispatch && special.preDispatch.call(this, event) === false) {
            return;
          }
          handlerQueue = jQuery.event.handlers.call(this, event, handlers);
          i = 0;
          while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
            event.currentTarget = matched.elem;
            j = 0;
            while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
              if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
                event.handleObj = handleObj;
                event.data = handleObj.data;
                ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                if (ret !== void 0) {
                  if ((event.result = ret) === false) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }
              }
            }
          }
          if (special.postDispatch) {
            special.postDispatch.call(this, event);
          }
          return event.result;
        },
        handlers: function(event, handlers) {
          var i, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
          if (delegateCount && // Support: IE <=9
          // Black-hole SVG <use> instance trees (trac-13180)
          cur.nodeType && // Support: Firefox <=42
          // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
          // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
          // Support: IE 11 only
          // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
          !(event.type === "click" && event.button >= 1)) {
            for (; cur !== this; cur = cur.parentNode || this) {
              if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                matchedHandlers = [];
                matchedSelectors = {};
                for (i = 0; i < delegateCount; i++) {
                  handleObj = handlers[i];
                  sel = handleObj.selector + " ";
                  if (matchedSelectors[sel] === void 0) {
                    matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
                  }
                  if (matchedSelectors[sel]) {
                    matchedHandlers.push(handleObj);
                  }
                }
                if (matchedHandlers.length) {
                  handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                }
              }
            }
          }
          cur = this;
          if (delegateCount < handlers.length) {
            handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
          }
          return handlerQueue;
        },
        addProp: function(name, hook) {
          Object.defineProperty(jQuery.Event.prototype, name, {
            enumerable: true,
            configurable: true,
            get: isFunction(hook) ? function() {
              if (this.originalEvent) {
                return hook(this.originalEvent);
              }
            } : function() {
              if (this.originalEvent) {
                return this.originalEvent[name];
              }
            },
            set: function(value) {
              Object.defineProperty(this, name, {
                enumerable: true,
                configurable: true,
                writable: true,
                value
              });
            }
          });
        },
        fix: function(originalEvent) {
          return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
        },
        special: {
          load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: true
          },
          click: {
            // Utilize native event to ensure correct state for checkable inputs
            setup: function(data) {
              var el2 = this || data;
              if (rcheckableType.test(el2.type) && el2.click && nodeName(el2, "input")) {
                leverageNative(el2, "click", true);
              }
              return false;
            },
            trigger: function(data) {
              var el2 = this || data;
              if (rcheckableType.test(el2.type) && el2.click && nodeName(el2, "input")) {
                leverageNative(el2, "click");
              }
              return true;
            },
            // For cross-browser consistency, suppress native .click() on links
            // Also prevent it if we're currently inside a leveraged native-event stack
            _default: function(event) {
              var target = event.target;
              return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
            }
          },
          beforeunload: {
            postDispatch: function(event) {
              if (event.result !== void 0 && event.originalEvent) {
                event.originalEvent.returnValue = event.result;
              }
            }
          }
        }
      };
      function leverageNative(el2, type, isSetup) {
        if (!isSetup) {
          if (dataPriv.get(el2, type) === void 0) {
            jQuery.event.add(el2, type, returnTrue);
          }
          return;
        }
        dataPriv.set(el2, type, false);
        jQuery.event.add(el2, type, {
          namespace: false,
          handler: function(event) {
            var result, saved = dataPriv.get(this, type);
            if (event.isTrigger & 1 && this[type]) {
              if (!saved) {
                saved = slice2.call(arguments);
                dataPriv.set(this, type, saved);
                this[type]();
                result = dataPriv.get(this, type);
                dataPriv.set(this, type, false);
                if (saved !== result) {
                  event.stopImmediatePropagation();
                  event.preventDefault();
                  return result;
                }
              } else if ((jQuery.event.special[type] || {}).delegateType) {
                event.stopPropagation();
              }
            } else if (saved) {
              dataPriv.set(this, type, jQuery.event.trigger(
                saved[0],
                saved.slice(1),
                this
              ));
              event.stopPropagation();
              event.isImmediatePropagationStopped = returnTrue;
            }
          }
        });
      }
      jQuery.removeEvent = function(elem, type, handle) {
        if (elem.removeEventListener) {
          elem.removeEventListener(type, handle);
        }
      };
      jQuery.Event = function(src, props) {
        if (!(this instanceof jQuery.Event)) {
          return new jQuery.Event(src, props);
        }
        if (src && src.type) {
          this.originalEvent = src;
          this.type = src.type;
          this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && // Support: Android <=2.3 only
          src.returnValue === false ? returnTrue : returnFalse;
          this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
          this.currentTarget = src.currentTarget;
          this.relatedTarget = src.relatedTarget;
        } else {
          this.type = src;
        }
        if (props) {
          jQuery.extend(this, props);
        }
        this.timeStamp = src && src.timeStamp || Date.now();
        this[jQuery.expando] = true;
      };
      jQuery.Event.prototype = {
        constructor: jQuery.Event,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        isSimulated: false,
        preventDefault: function() {
          var e2 = this.originalEvent;
          this.isDefaultPrevented = returnTrue;
          if (e2 && !this.isSimulated) {
            e2.preventDefault();
          }
        },
        stopPropagation: function() {
          var e2 = this.originalEvent;
          this.isPropagationStopped = returnTrue;
          if (e2 && !this.isSimulated) {
            e2.stopPropagation();
          }
        },
        stopImmediatePropagation: function() {
          var e2 = this.originalEvent;
          this.isImmediatePropagationStopped = returnTrue;
          if (e2 && !this.isSimulated) {
            e2.stopImmediatePropagation();
          }
          this.stopPropagation();
        }
      };
      jQuery.each({
        altKey: true,
        bubbles: true,
        cancelable: true,
        changedTouches: true,
        ctrlKey: true,
        detail: true,
        eventPhase: true,
        metaKey: true,
        pageX: true,
        pageY: true,
        shiftKey: true,
        view: true,
        "char": true,
        code: true,
        charCode: true,
        key: true,
        keyCode: true,
        button: true,
        buttons: true,
        clientX: true,
        clientY: true,
        offsetX: true,
        offsetY: true,
        pointerId: true,
        pointerType: true,
        screenX: true,
        screenY: true,
        targetTouches: true,
        toElement: true,
        touches: true,
        which: true
      }, jQuery.event.addProp);
      jQuery.each({ focus: "focusin", blur: "focusout" }, function(type, delegateType) {
        function focusMappedHandler(nativeEvent) {
          if (document2.documentMode) {
            var handle = dataPriv.get(this, "handle"), event = jQuery.event.fix(nativeEvent);
            event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
            event.isSimulated = true;
            handle(nativeEvent);
            if (event.target === event.currentTarget) {
              handle(event);
            }
          } else {
            jQuery.event.simulate(
              delegateType,
              nativeEvent.target,
              jQuery.event.fix(nativeEvent)
            );
          }
        }
        jQuery.event.special[type] = {
          // Utilize native event if possible so blur/focus sequence is correct
          setup: function() {
            var attaches;
            leverageNative(this, type, true);
            if (document2.documentMode) {
              attaches = dataPriv.get(this, delegateType);
              if (!attaches) {
                this.addEventListener(delegateType, focusMappedHandler);
              }
              dataPriv.set(this, delegateType, (attaches || 0) + 1);
            } else {
              return false;
            }
          },
          trigger: function() {
            leverageNative(this, type);
            return true;
          },
          teardown: function() {
            var attaches;
            if (document2.documentMode) {
              attaches = dataPriv.get(this, delegateType) - 1;
              if (!attaches) {
                this.removeEventListener(delegateType, focusMappedHandler);
                dataPriv.remove(this, delegateType);
              } else {
                dataPriv.set(this, delegateType, attaches);
              }
            } else {
              return false;
            }
          },
          // Suppress native focus or blur if we're currently inside
          // a leveraged native-event stack
          _default: function(event) {
            return dataPriv.get(event.target, type);
          },
          delegateType
        };
        jQuery.event.special[delegateType] = {
          setup: function() {
            var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType);
            if (!attaches) {
              if (document2.documentMode) {
                this.addEventListener(delegateType, focusMappedHandler);
              } else {
                doc.addEventListener(type, focusMappedHandler, true);
              }
            }
            dataPriv.set(dataHolder, delegateType, (attaches || 0) + 1);
          },
          teardown: function() {
            var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType) - 1;
            if (!attaches) {
              if (document2.documentMode) {
                this.removeEventListener(delegateType, focusMappedHandler);
              } else {
                doc.removeEventListener(type, focusMappedHandler, true);
              }
              dataPriv.remove(dataHolder, delegateType);
            } else {
              dataPriv.set(dataHolder, delegateType, attaches);
            }
          }
        };
      });
      jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
      }, function(orig, fix) {
        jQuery.event.special[orig] = {
          delegateType: fix,
          bindType: fix,
          handle: function(event) {
            var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
            if (!related || related !== target && !jQuery.contains(target, related)) {
              event.type = handleObj.origType;
              ret = handleObj.handler.apply(this, arguments);
              event.type = fix;
            }
            return ret;
          }
        };
      });
      jQuery.fn.extend({
        on: function(types, selector, data, fn) {
          return on(this, types, selector, data, fn);
        },
        one: function(types, selector, data, fn) {
          return on(this, types, selector, data, fn, 1);
        },
        off: function(types, selector, fn) {
          var handleObj, type;
          if (types && types.preventDefault && types.handleObj) {
            handleObj = types.handleObj;
            jQuery(types.delegateTarget).off(
              handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
              handleObj.selector,
              handleObj.handler
            );
            return this;
          }
          if (typeof types === "object") {
            for (type in types) {
              this.off(type, selector, types[type]);
            }
            return this;
          }
          if (selector === false || typeof selector === "function") {
            fn = selector;
            selector = void 0;
          }
          if (fn === false) {
            fn = returnFalse;
          }
          return this.each(function() {
            jQuery.event.remove(this, types, fn, selector);
          });
        }
      });
      var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
      function manipulationTarget(elem, content) {
        if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
          return jQuery(elem).children("tbody")[0] || elem;
        }
        return elem;
      }
      function disableScript(elem) {
        elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
        return elem;
      }
      function restoreScript(elem) {
        if ((elem.type || "").slice(0, 5) === "true/") {
          elem.type = elem.type.slice(5);
        } else {
          elem.removeAttribute("type");
        }
        return elem;
      }
      function cloneCopyEvent(src, dest) {
        var i, l2, type, pdataOld, udataOld, udataCur, events;
        if (dest.nodeType !== 1) {
          return;
        }
        if (dataPriv.hasData(src)) {
          pdataOld = dataPriv.get(src);
          events = pdataOld.events;
          if (events) {
            dataPriv.remove(dest, "handle events");
            for (type in events) {
              for (i = 0, l2 = events[type].length; i < l2; i++) {
                jQuery.event.add(dest, type, events[type][i]);
              }
            }
          }
        }
        if (dataUser.hasData(src)) {
          udataOld = dataUser.access(src);
          udataCur = jQuery.extend({}, udataOld);
          dataUser.set(dest, udataCur);
        }
      }
      function fixInput(src, dest) {
        var nodeName2 = dest.nodeName.toLowerCase();
        if (nodeName2 === "input" && rcheckableType.test(src.type)) {
          dest.checked = src.checked;
        } else if (nodeName2 === "input" || nodeName2 === "textarea") {
          dest.defaultValue = src.defaultValue;
        }
      }
      function domManip(collection, args, callback, ignored) {
        args = flat(args);
        var fragment, first, scripts, hasScripts, node2, doc, i = 0, l2 = collection.length, iNoClone = l2 - 1, value = args[0], valueIsFunction = isFunction(value);
        if (valueIsFunction || l2 > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
          return collection.each(function(index) {
            var self2 = collection.eq(index);
            if (valueIsFunction) {
              args[0] = value.call(this, index, self2.html());
            }
            domManip(self2, args, callback, ignored);
          });
        }
        if (l2) {
          fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
          first = fragment.firstChild;
          if (fragment.childNodes.length === 1) {
            fragment = first;
          }
          if (first || ignored) {
            scripts = jQuery.map(getAll(fragment, "script"), disableScript);
            hasScripts = scripts.length;
            for (; i < l2; i++) {
              node2 = fragment;
              if (i !== iNoClone) {
                node2 = jQuery.clone(node2, true, true);
                if (hasScripts) {
                  jQuery.merge(scripts, getAll(node2, "script"));
                }
              }
              callback.call(collection[i], node2, i);
            }
            if (hasScripts) {
              doc = scripts[scripts.length - 1].ownerDocument;
              jQuery.map(scripts, restoreScript);
              for (i = 0; i < hasScripts; i++) {
                node2 = scripts[i];
                if (rscriptType.test(node2.type || "") && !dataPriv.access(node2, "globalEval") && jQuery.contains(doc, node2)) {
                  if (node2.src && (node2.type || "").toLowerCase() !== "module") {
                    if (jQuery._evalUrl && !node2.noModule) {
                      jQuery._evalUrl(node2.src, {
                        nonce: node2.nonce || node2.getAttribute("nonce")
                      }, doc);
                    }
                  } else {
                    DOMEval(node2.textContent.replace(rcleanScript, ""), node2, doc);
                  }
                }
              }
            }
          }
        }
        return collection;
      }
      function remove(elem, selector, keepData) {
        var node2, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0;
        for (; (node2 = nodes[i]) != null; i++) {
          if (!keepData && node2.nodeType === 1) {
            jQuery.cleanData(getAll(node2));
          }
          if (node2.parentNode) {
            if (keepData && isAttached(node2)) {
              setGlobalEval(getAll(node2, "script"));
            }
            node2.parentNode.removeChild(node2);
          }
        }
        return elem;
      }
      jQuery.extend({
        htmlPrefilter: function(html) {
          return html;
        },
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
          var i, l2, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
          if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
            destElements = getAll(clone);
            srcElements = getAll(elem);
            for (i = 0, l2 = srcElements.length; i < l2; i++) {
              fixInput(srcElements[i], destElements[i]);
            }
          }
          if (dataAndEvents) {
            if (deepDataAndEvents) {
              srcElements = srcElements || getAll(elem);
              destElements = destElements || getAll(clone);
              for (i = 0, l2 = srcElements.length; i < l2; i++) {
                cloneCopyEvent(srcElements[i], destElements[i]);
              }
            } else {
              cloneCopyEvent(elem, clone);
            }
          }
          destElements = getAll(clone, "script");
          if (destElements.length > 0) {
            setGlobalEval(destElements, !inPage && getAll(elem, "script"));
          }
          return clone;
        },
        cleanData: function(elems) {
          var data, elem, type, special = jQuery.event.special, i = 0;
          for (; (elem = elems[i]) !== void 0; i++) {
            if (acceptData(elem)) {
              if (data = elem[dataPriv.expando]) {
                if (data.events) {
                  for (type in data.events) {
                    if (special[type]) {
                      jQuery.event.remove(elem, type);
                    } else {
                      jQuery.removeEvent(elem, type, data.handle);
                    }
                  }
                }
                elem[dataPriv.expando] = void 0;
              }
              if (elem[dataUser.expando]) {
                elem[dataUser.expando] = void 0;
              }
            }
          }
        }
      });
      jQuery.fn.extend({
        detach: function(selector) {
          return remove(this, selector, true);
        },
        remove: function(selector) {
          return remove(this, selector);
        },
        text: function(value) {
          return access(this, function(value2) {
            return value2 === void 0 ? jQuery.text(this) : this.empty().each(function() {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                this.textContent = value2;
              }
            });
          }, null, value, arguments.length);
        },
        append: function() {
          return domManip(this, arguments, function(elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.appendChild(elem);
            }
          });
        },
        prepend: function() {
          return domManip(this, arguments, function(elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.insertBefore(elem, target.firstChild);
            }
          });
        },
        before: function() {
          return domManip(this, arguments, function(elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this);
            }
          });
        },
        after: function() {
          return domManip(this, arguments, function(elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this.nextSibling);
            }
          });
        },
        empty: function() {
          var elem, i = 0;
          for (; (elem = this[i]) != null; i++) {
            if (elem.nodeType === 1) {
              jQuery.cleanData(getAll(elem, false));
              elem.textContent = "";
            }
          }
          return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
          dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
          deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
          return this.map(function() {
            return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
          });
        },
        html: function(value) {
          return access(this, function(value2) {
            var elem = this[0] || {}, i = 0, l2 = this.length;
            if (value2 === void 0 && elem.nodeType === 1) {
              return elem.innerHTML;
            }
            if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
              value2 = jQuery.htmlPrefilter(value2);
              try {
                for (; i < l2; i++) {
                  elem = this[i] || {};
                  if (elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem, false));
                    elem.innerHTML = value2;
                  }
                }
                elem = 0;
              } catch (e2) {
              }
            }
            if (elem) {
              this.empty().append(value2);
            }
          }, null, value, arguments.length);
        },
        replaceWith: function() {
          var ignored = [];
          return domManip(this, arguments, function(elem) {
            var parent = this.parentNode;
            if (jQuery.inArray(this, ignored) < 0) {
              jQuery.cleanData(getAll(this));
              if (parent) {
                parent.replaceChild(elem, this);
              }
            }
          }, ignored);
        }
      });
      jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
      }, function(name, original) {
        jQuery.fn[name] = function(selector) {
          var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0;
          for (; i <= last; i++) {
            elems = i === last ? this : this.clone(true);
            jQuery(insert[i])[original](elems);
            push.apply(ret, elems.get());
          }
          return this.pushStack(ret);
        };
      });
      var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
      var rcustomProp = /^--/;
      var getStyles = function(elem) {
        var view = elem.ownerDocument.defaultView;
        if (!view || !view.opener) {
          view = window2;
        }
        return view.getComputedStyle(elem);
      };
      var swap = function(elem, options, callback) {
        var ret, name, old = {};
        for (name in options) {
          old[name] = elem.style[name];
          elem.style[name] = options[name];
        }
        ret = callback.call(elem);
        for (name in options) {
          elem.style[name] = old[name];
        }
        return ret;
      };
      var rboxStyle = new RegExp(cssExpand.join("|"), "i");
      (function() {
        function computeStyleTests() {
          if (!div) {
            return;
          }
          container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
          div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
          documentElement.appendChild(container).appendChild(div);
          var divStyle = window2.getComputedStyle(div);
          pixelPositionVal = divStyle.top !== "1%";
          reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
          div.style.right = "60%";
          pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
          boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
          div.style.position = "absolute";
          scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
          documentElement.removeChild(container);
          div = null;
        }
        function roundPixelMeasures(measure) {
          return Math.round(parseFloat(measure));
        }
        var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document2.createElement("div"), div = document2.createElement("div");
        if (!div.style) {
          return;
        }
        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";
        jQuery.extend(support, {
          boxSizingReliable: function() {
            computeStyleTests();
            return boxSizingReliableVal;
          },
          pixelBoxStyles: function() {
            computeStyleTests();
            return pixelBoxStylesVal;
          },
          pixelPosition: function() {
            computeStyleTests();
            return pixelPositionVal;
          },
          reliableMarginLeft: function() {
            computeStyleTests();
            return reliableMarginLeftVal;
          },
          scrollboxSize: function() {
            computeStyleTests();
            return scrollboxSizeVal;
          },
          // Support: IE 9 - 11+, Edge 15 - 18+
          // IE/Edge misreport `getComputedStyle` of table rows with width/height
          // set in CSS while `offset*` properties report correct values.
          // Behavior in IE 9 is more subtle than in newer versions & it passes
          // some versions of this test; make sure not to make it pass there!
          //
          // Support: Firefox 70+
          // Only Firefox includes border widths
          // in computed dimensions. (gh-4529)
          reliableTrDimensions: function() {
            var table, tr, trChild, trStyle;
            if (reliableTrDimensionsVal == null) {
              table = document2.createElement("table");
              tr = document2.createElement("tr");
              trChild = document2.createElement("div");
              table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
              tr.style.cssText = "box-sizing:content-box;border:1px solid";
              tr.style.height = "1px";
              trChild.style.height = "9px";
              trChild.style.display = "block";
              documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
              trStyle = window2.getComputedStyle(tr);
              reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
              documentElement.removeChild(table);
            }
            return reliableTrDimensionsVal;
          }
        });
      })();
      function curCSS(elem, name, computed) {
        var width2, minWidth2, maxWidth2, ret, isCustomProp = rcustomProp.test(name), style2 = elem.style;
        computed = computed || getStyles(elem);
        if (computed) {
          ret = computed.getPropertyValue(name) || computed[name];
          if (isCustomProp && ret) {
            ret = ret.replace(rtrimCSS, "$1") || void 0;
          }
          if (ret === "" && !isAttached(elem)) {
            ret = jQuery.style(elem, name);
          }
          if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
            width2 = style2.width;
            minWidth2 = style2.minWidth;
            maxWidth2 = style2.maxWidth;
            style2.minWidth = style2.maxWidth = style2.width = ret;
            ret = computed.width;
            style2.width = width2;
            style2.minWidth = minWidth2;
            style2.maxWidth = maxWidth2;
          }
        }
        return ret !== void 0 ? (
          // Support: IE <=9 - 11 only
          // IE returns zIndex value as an integer.
          ret + ""
        ) : ret;
      }
      function addGetHookIf(conditionFn, hookFn) {
        return {
          get: function() {
            if (conditionFn()) {
              delete this.get;
              return;
            }
            return (this.get = hookFn).apply(this, arguments);
          }
        };
      }
      var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document2.createElement("div").style, vendorProps = {};
      function vendorPropName(name) {
        var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length;
        while (i--) {
          name = cssPrefixes[i] + capName;
          if (name in emptyStyle) {
            return name;
          }
        }
      }
      function finalPropName(name) {
        var final = jQuery.cssProps[name] || vendorProps[name];
        if (final) {
          return final;
        }
        if (name in emptyStyle) {
          return name;
        }
        return vendorProps[name] = vendorPropName(name) || name;
      }
      var rdisplayswap = /^(none|table(?!-c[ea]).+)/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
      };
      function setPositiveNumber(_elem, value, subtract) {
        var matches = rcssNum.exec(value);
        return matches ? (
          // Guard against undefined "subtract", e.g., when used as in cssHooks
          Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
        ) : value;
      }
      function boxModelAdjustment(elem, dimension, box, isBorderBox, styles2, computedVal) {
        var i = dimension === "width" ? 1 : 0, extra = 0, delta = 0, marginDelta = 0;
        if (box === (isBorderBox ? "border" : "content")) {
          return 0;
        }
        for (; i < 4; i += 2) {
          if (box === "margin") {
            marginDelta += jQuery.css(elem, box + cssExpand[i], true, styles2);
          }
          if (!isBorderBox) {
            delta += jQuery.css(elem, "padding" + cssExpand[i], true, styles2);
            if (box !== "padding") {
              delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles2);
            } else {
              extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles2);
            }
          } else {
            if (box === "content") {
              delta -= jQuery.css(elem, "padding" + cssExpand[i], true, styles2);
            }
            if (box !== "margin") {
              delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles2);
            }
          }
        }
        if (!isBorderBox && computedVal >= 0) {
          delta += Math.max(0, Math.ceil(
            elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
            // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
            // Use an explicit zero to avoid NaN (gh-3964)
          )) || 0;
        }
        return delta + marginDelta;
      }
      function getWidthOrHeight(elem, dimension, extra) {
        var styles2 = getStyles(elem), boxSizingNeeded = !support.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles2) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles2), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
        if (rnumnonpx.test(val)) {
          if (!extra) {
            return val;
          }
          val = "auto";
        }
        if ((!support.boxSizingReliable() && isBorderBox || // Support: IE 10 - 11+, Edge 15 - 18+
        // IE/Edge misreport `getComputedStyle` of table rows with width/height
        // set in CSS while `offset*` properties report correct values.
        // Interestingly, in some cases IE 9 doesn't suffer from this issue.
        !support.reliableTrDimensions() && nodeName(elem, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
        // This happens for inline elements with no explicit setting (gh-3571)
        val === "auto" || // Support: Android <=4.1 - 4.3 only
        // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
        !parseFloat(val) && jQuery.css(elem, "display", false, styles2) === "inline") && // Make sure the element is visible & connected
        elem.getClientRects().length) {
          isBorderBox = jQuery.css(elem, "boxSizing", false, styles2) === "border-box";
          valueIsBorderBox = offsetProp in elem;
          if (valueIsBorderBox) {
            val = elem[offsetProp];
          }
        }
        val = parseFloat(val) || 0;
        return val + boxModelAdjustment(
          elem,
          dimension,
          extra || (isBorderBox ? "border" : "content"),
          valueIsBorderBox,
          styles2,
          // Provide the current computed size to request scroll gutter calculation (gh-3589)
          val
        ) + "px";
      }
      jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
          opacity: {
            get: function(elem, computed) {
              if (computed) {
                var ret = curCSS(elem, "opacity");
                return ret === "" ? "1" : ret;
              }
            }
          }
        },
        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
          animationIterationCount: true,
          aspectRatio: true,
          borderImageSlice: true,
          columnCount: true,
          flexGrow: true,
          flexShrink: true,
          fontWeight: true,
          gridArea: true,
          gridColumn: true,
          gridColumnEnd: true,
          gridColumnStart: true,
          gridRow: true,
          gridRowEnd: true,
          gridRowStart: true,
          lineHeight: true,
          opacity: true,
          order: true,
          orphans: true,
          scale: true,
          widows: true,
          zIndex: true,
          zoom: true,
          // SVG-related
          fillOpacity: true,
          floodOpacity: true,
          stopOpacity: true,
          strokeMiterlimit: true,
          strokeOpacity: true
        },
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {},
        // Get and set the style property on a DOM Node
        style: function(elem, name, value, extra) {
          if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
          }
          var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style2 = elem.style;
          if (!isCustomProp) {
            name = finalPropName(origName);
          }
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
          if (value !== void 0) {
            type = typeof value;
            if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
              value = adjustCSS(elem, name, ret);
              type = "number";
            }
            if (value == null || value !== value) {
              return;
            }
            if (type === "number" && !isCustomProp) {
              value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
            }
            if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
              style2[name] = "inherit";
            }
            if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
              if (isCustomProp) {
                style2.setProperty(name, value);
              } else {
                style2[name] = value;
              }
            }
          } else {
            if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
              return ret;
            }
            return style2[name];
          }
        },
        css: function(elem, name, extra, styles2) {
          var val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
          if (!isCustomProp) {
            name = finalPropName(origName);
          }
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
          if (hooks && "get" in hooks) {
            val = hooks.get(elem, true, extra);
          }
          if (val === void 0) {
            val = curCSS(elem, name, styles2);
          }
          if (val === "normal" && name in cssNormalTransform) {
            val = cssNormalTransform[name];
          }
          if (extra === "" || extra) {
            num = parseFloat(val);
            return extra === true || isFinite(num) ? num || 0 : val;
          }
          return val;
        }
      });
      jQuery.each(["height", "width"], function(_i, dimension) {
        jQuery.cssHooks[dimension] = {
          get: function(elem, computed, extra) {
            if (computed) {
              return rdisplayswap.test(jQuery.css(elem, "display")) && // Support: Safari 8+
              // Table columns in Safari have non-zero offsetWidth & zero
              // getBoundingClientRect().width unless display is changed.
              // Support: IE <=11 only
              // Running getBoundingClientRect on a disconnected node
              // in IE throws an error.
              (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
                return getWidthOrHeight(elem, dimension, extra);
              }) : getWidthOrHeight(elem, dimension, extra);
            }
          },
          set: function(elem, value, extra) {
            var matches, styles2 = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles2.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles2) === "border-box", subtract = extra ? boxModelAdjustment(
              elem,
              dimension,
              extra,
              isBorderBox,
              styles2
            ) : 0;
            if (isBorderBox && scrollboxSizeBuggy) {
              subtract -= Math.ceil(
                elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles2[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles2) - 0.5
              );
            }
            if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
              elem.style[dimension] = value;
              value = jQuery.css(elem, dimension);
            }
            return setPositiveNumber(elem, value, subtract);
          }
        };
      });
      jQuery.cssHooks.marginLeft = addGetHookIf(
        support.reliableMarginLeft,
        function(elem, computed) {
          if (computed) {
            return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
              return elem.getBoundingClientRect().left;
            })) + "px";
          }
        }
      );
      jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
      }, function(prefix2, suffix) {
        jQuery.cssHooks[prefix2 + suffix] = {
          expand: function(value) {
            var i = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
            for (; i < 4; i++) {
              expanded[prefix2 + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
            }
            return expanded;
          }
        };
        if (prefix2 !== "margin") {
          jQuery.cssHooks[prefix2 + suffix].set = setPositiveNumber;
        }
      });
      jQuery.fn.extend({
        css: function(name, value) {
          return access(this, function(elem, name2, value2) {
            var styles2, len, map = {}, i = 0;
            if (Array.isArray(name2)) {
              styles2 = getStyles(elem);
              len = name2.length;
              for (; i < len; i++) {
                map[name2[i]] = jQuery.css(elem, name2[i], false, styles2);
              }
              return map;
            }
            return value2 !== void 0 ? jQuery.style(elem, name2, value2) : jQuery.css(elem, name2);
          }, name, value, arguments.length > 1);
        }
      });
      function Tween(elem, options, prop, end, easing2) {
        return new Tween.prototype.init(elem, options, prop, end, easing2);
      }
      jQuery.Tween = Tween;
      Tween.prototype = {
        constructor: Tween,
        init: function(elem, options, prop, end, easing2, unit) {
          this.elem = elem;
          this.prop = prop;
          this.easing = easing2 || jQuery.easing._default;
          this.options = options;
          this.start = this.now = this.cur();
          this.end = end;
          this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function() {
          var hooks = Tween.propHooks[this.prop];
          return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function(percent) {
          var eased, hooks = Tween.propHooks[this.prop];
          if (this.options.duration) {
            this.pos = eased = jQuery.easing[this.easing](
              percent,
              this.options.duration * percent,
              0,
              1,
              this.options.duration
            );
          } else {
            this.pos = eased = percent;
          }
          this.now = (this.end - this.start) * eased + this.start;
          if (this.options.step) {
            this.options.step.call(this.elem, this.now, this);
          }
          if (hooks && hooks.set) {
            hooks.set(this);
          } else {
            Tween.propHooks._default.set(this);
          }
          return this;
        }
      };
      Tween.prototype.init.prototype = Tween.prototype;
      Tween.propHooks = {
        _default: {
          get: function(tween) {
            var result;
            if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
              return tween.elem[tween.prop];
            }
            result = jQuery.css(tween.elem, tween.prop, "");
            return !result || result === "auto" ? 0 : result;
          },
          set: function(tween) {
            if (jQuery.fx.step[tween.prop]) {
              jQuery.fx.step[tween.prop](tween);
            } else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
              jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
            } else {
              tween.elem[tween.prop] = tween.now;
            }
          }
        }
      };
      Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
          if (tween.elem.nodeType && tween.elem.parentNode) {
            tween.elem[tween.prop] = tween.now;
          }
        }
      };
      jQuery.easing = {
        linear: function(p2) {
          return p2;
        },
        swing: function(p2) {
          return 0.5 - Math.cos(p2 * Math.PI) / 2;
        },
        _default: "swing"
      };
      jQuery.fx = Tween.prototype.init;
      jQuery.fx.step = {};
      var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
      function schedule() {
        if (inProgress) {
          if (document2.hidden === false && window2.requestAnimationFrame) {
            window2.requestAnimationFrame(schedule);
          } else {
            window2.setTimeout(schedule, jQuery.fx.interval);
          }
          jQuery.fx.tick();
        }
      }
      function createFxNow() {
        window2.setTimeout(function() {
          fxNow = void 0;
        });
        return fxNow = Date.now();
      }
      function genFx(type, includeWidth) {
        var which, i = 0, attrs = { height: type };
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4; i += 2 - includeWidth) {
          which = cssExpand[i];
          attrs["margin" + which] = attrs["padding" + which] = type;
        }
        if (includeWidth) {
          attrs.opacity = attrs.width = type;
        }
        return attrs;
      }
      function createTween(value, prop, animation) {
        var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length2 = collection.length;
        for (; index < length2; index++) {
          if (tween = collection[index].call(animation, prop, value)) {
            return tween;
          }
        }
      }
      function defaultPrefilter(elem, props, opts) {
        var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style2 = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
        if (!opts.queue) {
          hooks = jQuery._queueHooks(elem, "fx");
          if (hooks.unqueued == null) {
            hooks.unqueued = 0;
            oldfire = hooks.empty.fire;
            hooks.empty.fire = function() {
              if (!hooks.unqueued) {
                oldfire();
              }
            };
          }
          hooks.unqueued++;
          anim.always(function() {
            anim.always(function() {
              hooks.unqueued--;
              if (!jQuery.queue(elem, "fx").length) {
                hooks.empty.fire();
              }
            });
          });
        }
        for (prop in props) {
          value = props[prop];
          if (rfxtypes.test(value)) {
            delete props[prop];
            toggle = toggle || value === "toggle";
            if (value === (hidden ? "hide" : "show")) {
              if (value === "show" && dataShow && dataShow[prop] !== void 0) {
                hidden = true;
              } else {
                continue;
              }
            }
            orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
          }
        }
        propTween = !jQuery.isEmptyObject(props);
        if (!propTween && jQuery.isEmptyObject(orig)) {
          return;
        }
        if (isBox && elem.nodeType === 1) {
          opts.overflow = [style2.overflow, style2.overflowX, style2.overflowY];
          restoreDisplay = dataShow && dataShow.display;
          if (restoreDisplay == null) {
            restoreDisplay = dataPriv.get(elem, "display");
          }
          display = jQuery.css(elem, "display");
          if (display === "none") {
            if (restoreDisplay) {
              display = restoreDisplay;
            } else {
              showHide([elem], true);
              restoreDisplay = elem.style.display || restoreDisplay;
              display = jQuery.css(elem, "display");
              showHide([elem]);
            }
          }
          if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
            if (jQuery.css(elem, "float") === "none") {
              if (!propTween) {
                anim.done(function() {
                  style2.display = restoreDisplay;
                });
                if (restoreDisplay == null) {
                  display = style2.display;
                  restoreDisplay = display === "none" ? "" : display;
                }
              }
              style2.display = "inline-block";
            }
          }
        }
        if (opts.overflow) {
          style2.overflow = "hidden";
          anim.always(function() {
            style2.overflow = opts.overflow[0];
            style2.overflowX = opts.overflow[1];
            style2.overflowY = opts.overflow[2];
          });
        }
        propTween = false;
        for (prop in orig) {
          if (!propTween) {
            if (dataShow) {
              if ("hidden" in dataShow) {
                hidden = dataShow.hidden;
              }
            } else {
              dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
            }
            if (toggle) {
              dataShow.hidden = !hidden;
            }
            if (hidden) {
              showHide([elem], true);
            }
            anim.done(function() {
              if (!hidden) {
                showHide([elem]);
              }
              dataPriv.remove(elem, "fxshow");
              for (prop in orig) {
                jQuery.style(elem, prop, orig[prop]);
              }
            });
          }
          propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
          if (!(prop in dataShow)) {
            dataShow[prop] = propTween.start;
            if (hidden) {
              propTween.end = propTween.start;
              propTween.start = 0;
            }
          }
        }
      }
      function propFilter(props, specialEasing) {
        var index, name, easing2, value, hooks;
        for (index in props) {
          name = camelCase(index);
          easing2 = specialEasing[name];
          value = props[index];
          if (Array.isArray(value)) {
            easing2 = value[1];
            value = props[index] = value[0];
          }
          if (index !== name) {
            props[name] = value;
            delete props[index];
          }
          hooks = jQuery.cssHooks[name];
          if (hooks && "expand" in hooks) {
            value = hooks.expand(value);
            delete props[name];
            for (index in value) {
              if (!(index in props)) {
                props[index] = value[index];
                specialEasing[index] = easing2;
              }
            }
          } else {
            specialEasing[name] = easing2;
          }
        }
      }
      function Animation(elem, properties2, options) {
        var result, stopped, index = 0, length2 = Animation.prefilters.length, deferred = jQuery.Deferred().always(function() {
          delete tick.elem;
        }), tick = function() {
          if (stopped) {
            return false;
          }
          var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length3 = animation.tweens.length;
          for (; index2 < length3; index2++) {
            animation.tweens[index2].run(percent);
          }
          deferred.notifyWith(elem, [animation, percent, remaining]);
          if (percent < 1 && length3) {
            return remaining;
          }
          if (!length3) {
            deferred.notifyWith(elem, [animation, 1, 0]);
          }
          deferred.resolveWith(elem, [animation]);
          return false;
        }, animation = deferred.promise({
          elem,
          props: jQuery.extend({}, properties2),
          opts: jQuery.extend(true, {
            specialEasing: {},
            easing: jQuery.easing._default
          }, options),
          originalProperties: properties2,
          originalOptions: options,
          startTime: fxNow || createFxNow(),
          duration: options.duration,
          tweens: [],
          createTween: function(prop, end) {
            var tween = jQuery.Tween(
              elem,
              animation.opts,
              prop,
              end,
              animation.opts.specialEasing[prop] || animation.opts.easing
            );
            animation.tweens.push(tween);
            return tween;
          },
          stop: function(gotoEnd) {
            var index2 = 0, length3 = gotoEnd ? animation.tweens.length : 0;
            if (stopped) {
              return this;
            }
            stopped = true;
            for (; index2 < length3; index2++) {
              animation.tweens[index2].run(1);
            }
            if (gotoEnd) {
              deferred.notifyWith(elem, [animation, 1, 0]);
              deferred.resolveWith(elem, [animation, gotoEnd]);
            } else {
              deferred.rejectWith(elem, [animation, gotoEnd]);
            }
            return this;
          }
        }), props = animation.props;
        propFilter(props, animation.opts.specialEasing);
        for (; index < length2; index++) {
          result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
          if (result) {
            if (isFunction(result.stop)) {
              jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
            }
            return result;
          }
        }
        jQuery.map(props, createTween, animation);
        if (isFunction(animation.opts.start)) {
          animation.opts.start.call(elem, animation);
        }
        animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
        jQuery.fx.timer(
          jQuery.extend(tick, {
            elem,
            anim: animation,
            queue: animation.opts.queue
          })
        );
        return animation;
      }
      jQuery.Animation = jQuery.extend(Animation, {
        tweeners: {
          "*": [function(prop, value) {
            var tween = this.createTween(prop, value);
            adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
            return tween;
          }]
        },
        tweener: function(props, callback) {
          if (isFunction(props)) {
            callback = props;
            props = ["*"];
          } else {
            props = props.match(rnothtmlwhite);
          }
          var prop, index = 0, length2 = props.length;
          for (; index < length2; index++) {
            prop = props[index];
            Animation.tweeners[prop] = Animation.tweeners[prop] || [];
            Animation.tweeners[prop].unshift(callback);
          }
        },
        prefilters: [defaultPrefilter],
        prefilter: function(callback, prepend) {
          if (prepend) {
            Animation.prefilters.unshift(callback);
          } else {
            Animation.prefilters.push(callback);
          }
        }
      });
      jQuery.speed = function(speed, easing2, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
          complete: fn || !fn && easing2 || isFunction(speed) && speed,
          duration: speed,
          easing: fn && easing2 || easing2 && !isFunction(easing2) && easing2
        };
        if (jQuery.fx.off) {
          opt.duration = 0;
        } else {
          if (typeof opt.duration !== "number") {
            if (opt.duration in jQuery.fx.speeds) {
              opt.duration = jQuery.fx.speeds[opt.duration];
            } else {
              opt.duration = jQuery.fx.speeds._default;
            }
          }
        }
        if (opt.queue == null || opt.queue === true) {
          opt.queue = "fx";
        }
        opt.old = opt.complete;
        opt.complete = function() {
          if (isFunction(opt.old)) {
            opt.old.call(this);
          }
          if (opt.queue) {
            jQuery.dequeue(this, opt.queue);
          }
        };
        return opt;
      };
      jQuery.fn.extend({
        fadeTo: function(speed, to, easing2, callback) {
          return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing2, callback);
        },
        animate: function(prop, speed, easing2, callback) {
          var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing2, callback), doAnimation = function() {
            var anim = Animation(this, jQuery.extend({}, prop), optall);
            if (empty || dataPriv.get(this, "finish")) {
              anim.stop(true);
            }
          };
          doAnimation.finish = doAnimation;
          return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function(type, clearQueue, gotoEnd) {
          var stopQueue = function(hooks) {
            var stop = hooks.stop;
            delete hooks.stop;
            stop(gotoEnd);
          };
          if (typeof type !== "string") {
            gotoEnd = clearQueue;
            clearQueue = type;
            type = void 0;
          }
          if (clearQueue) {
            this.queue(type || "fx", []);
          }
          return this.each(function() {
            var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers, data = dataPriv.get(this);
            if (index) {
              if (data[index] && data[index].stop) {
                stopQueue(data[index]);
              }
            } else {
              for (index in data) {
                if (data[index] && data[index].stop && rrun.test(index)) {
                  stopQueue(data[index]);
                }
              }
            }
            for (index = timers.length; index--; ) {
              if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                timers[index].anim.stop(gotoEnd);
                dequeue = false;
                timers.splice(index, 1);
              }
            }
            if (dequeue || !gotoEnd) {
              jQuery.dequeue(this, type);
            }
          });
        },
        finish: function(type) {
          if (type !== false) {
            type = type || "fx";
          }
          return this.each(function() {
            var index, data = dataPriv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length2 = queue ? queue.length : 0;
            data.finish = true;
            jQuery.queue(this, type, []);
            if (hooks && hooks.stop) {
              hooks.stop.call(this, true);
            }
            for (index = timers.length; index--; ) {
              if (timers[index].elem === this && timers[index].queue === type) {
                timers[index].anim.stop(true);
                timers.splice(index, 1);
              }
            }
            for (index = 0; index < length2; index++) {
              if (queue[index] && queue[index].finish) {
                queue[index].finish.call(this);
              }
            }
            delete data.finish;
          });
        }
      });
      jQuery.each(["toggle", "show", "hide"], function(_i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function(speed, easing2, callback) {
          return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing2, callback);
        };
      });
      jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
      }, function(name, props) {
        jQuery.fn[name] = function(speed, easing2, callback) {
          return this.animate(props, speed, easing2, callback);
        };
      });
      jQuery.timers = [];
      jQuery.fx.tick = function() {
        var timer, i = 0, timers = jQuery.timers;
        fxNow = Date.now();
        for (; i < timers.length; i++) {
          timer = timers[i];
          if (!timer() && timers[i] === timer) {
            timers.splice(i--, 1);
          }
        }
        if (!timers.length) {
          jQuery.fx.stop();
        }
        fxNow = void 0;
      };
      jQuery.fx.timer = function(timer) {
        jQuery.timers.push(timer);
        jQuery.fx.start();
      };
      jQuery.fx.interval = 13;
      jQuery.fx.start = function() {
        if (inProgress) {
          return;
        }
        inProgress = true;
        schedule();
      };
      jQuery.fx.stop = function() {
        inProgress = null;
      };
      jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
      };
      jQuery.fn.delay = function(time, type) {
        time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
        type = type || "fx";
        return this.queue(type, function(next2, hooks) {
          var timeout = window2.setTimeout(next2, time);
          hooks.stop = function() {
            window2.clearTimeout(timeout);
          };
        });
      };
      (function() {
        var input = document2.createElement("input"), select = document2.createElement("select"), opt = select.appendChild(document2.createElement("option"));
        input.type = "checkbox";
        support.checkOn = input.value !== "";
        support.optSelected = opt.selected;
        input = document2.createElement("input");
        input.value = "t";
        input.type = "radio";
        support.radioValue = input.value === "t";
      })();
      var boolHook, attrHandle = jQuery.expr.attrHandle;
      jQuery.fn.extend({
        attr: function(name, value) {
          return access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
          return this.each(function() {
            jQuery.removeAttr(this, name);
          });
        }
      });
      jQuery.extend({
        attr: function(elem, name, value) {
          var ret, hooks, nType = elem.nodeType;
          if (nType === 3 || nType === 8 || nType === 2) {
            return;
          }
          if (typeof elem.getAttribute === "undefined") {
            return jQuery.prop(elem, name, value);
          }
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0);
          }
          if (value !== void 0) {
            if (value === null) {
              jQuery.removeAttr(elem, name);
              return;
            }
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
              return ret;
            }
            elem.setAttribute(name, value + "");
            return value;
          }
          if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
          }
          ret = jQuery.find.attr(elem, name);
          return ret == null ? void 0 : ret;
        },
        attrHooks: {
          type: {
            set: function(elem, value) {
              if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
                var val = elem.value;
                elem.setAttribute("type", value);
                if (val) {
                  elem.value = val;
                }
                return value;
              }
            }
          }
        },
        removeAttr: function(elem, value) {
          var name, i = 0, attrNames = value && value.match(rnothtmlwhite);
          if (attrNames && elem.nodeType === 1) {
            while (name = attrNames[i++]) {
              elem.removeAttribute(name);
            }
          }
        }
      });
      boolHook = {
        set: function(elem, value, name) {
          if (value === false) {
            jQuery.removeAttr(elem, name);
          } else {
            elem.setAttribute(name, name);
          }
          return name;
        }
      };
      jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(_i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;
        attrHandle[name] = function(elem, name2, isXML) {
          var ret, handle, lowercaseName = name2.toLowerCase();
          if (!isXML) {
            handle = attrHandle[lowercaseName];
            attrHandle[lowercaseName] = ret;
            ret = getter(elem, name2, isXML) != null ? lowercaseName : null;
            attrHandle[lowercaseName] = handle;
          }
          return ret;
        };
      });
      var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
      jQuery.fn.extend({
        prop: function(name, value) {
          return access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
          return this.each(function() {
            delete this[jQuery.propFix[name] || name];
          });
        }
      });
      jQuery.extend({
        prop: function(elem, name, value) {
          var ret, hooks, nType = elem.nodeType;
          if (nType === 3 || nType === 8 || nType === 2) {
            return;
          }
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            name = jQuery.propFix[name] || name;
            hooks = jQuery.propHooks[name];
          }
          if (value !== void 0) {
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
              return ret;
            }
            return elem[name] = value;
          }
          if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
          }
          return elem[name];
        },
        propHooks: {
          tabIndex: {
            get: function(elem) {
              var tabindex = jQuery.find.attr(elem, "tabindex");
              if (tabindex) {
                return parseInt(tabindex, 10);
              }
              if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
                return 0;
              }
              return -1;
            }
          }
        },
        propFix: {
          "for": "htmlFor",
          "class": "className"
        }
      });
      if (!support.optSelected) {
        jQuery.propHooks.selected = {
          get: function(elem) {
            var parent = elem.parentNode;
            if (parent && parent.parentNode) {
              parent.parentNode.selectedIndex;
            }
            return null;
          },
          set: function(elem) {
            var parent = elem.parentNode;
            if (parent) {
              parent.selectedIndex;
              if (parent.parentNode) {
                parent.parentNode.selectedIndex;
              }
            }
          }
        };
      }
      jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
      ], function() {
        jQuery.propFix[this.toLowerCase()] = this;
      });
      function stripAndCollapse(value) {
        var tokens = value.match(rnothtmlwhite) || [];
        return tokens.join(" ");
      }
      function getClass(elem) {
        return elem.getAttribute && elem.getAttribute("class") || "";
      }
      function classesToArray(value) {
        if (Array.isArray(value)) {
          return value;
        }
        if (typeof value === "string") {
          return value.match(rnothtmlwhite) || [];
        }
        return [];
      }
      jQuery.fn.extend({
        addClass: function(value) {
          var classNames, cur, curValue, className, i, finalValue;
          if (isFunction(value)) {
            return this.each(function(j) {
              jQuery(this).addClass(value.call(this, j, getClass(this)));
            });
          }
          classNames = classesToArray(value);
          if (classNames.length) {
            return this.each(function() {
              curValue = getClass(this);
              cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
              if (cur) {
                for (i = 0; i < classNames.length; i++) {
                  className = classNames[i];
                  if (cur.indexOf(" " + className + " ") < 0) {
                    cur += className + " ";
                  }
                }
                finalValue = stripAndCollapse(cur);
                if (curValue !== finalValue) {
                  this.setAttribute("class", finalValue);
                }
              }
            });
          }
          return this;
        },
        removeClass: function(value) {
          var classNames, cur, curValue, className, i, finalValue;
          if (isFunction(value)) {
            return this.each(function(j) {
              jQuery(this).removeClass(value.call(this, j, getClass(this)));
            });
          }
          if (!arguments.length) {
            return this.attr("class", "");
          }
          classNames = classesToArray(value);
          if (classNames.length) {
            return this.each(function() {
              curValue = getClass(this);
              cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
              if (cur) {
                for (i = 0; i < classNames.length; i++) {
                  className = classNames[i];
                  while (cur.indexOf(" " + className + " ") > -1) {
                    cur = cur.replace(" " + className + " ", " ");
                  }
                }
                finalValue = stripAndCollapse(cur);
                if (curValue !== finalValue) {
                  this.setAttribute("class", finalValue);
                }
              }
            });
          }
          return this;
        },
        toggleClass: function(value, stateVal) {
          var classNames, className, i, self2, type = typeof value, isValidValue = type === "string" || Array.isArray(value);
          if (isFunction(value)) {
            return this.each(function(i2) {
              jQuery(this).toggleClass(
                value.call(this, i2, getClass(this), stateVal),
                stateVal
              );
            });
          }
          if (typeof stateVal === "boolean" && isValidValue) {
            return stateVal ? this.addClass(value) : this.removeClass(value);
          }
          classNames = classesToArray(value);
          return this.each(function() {
            if (isValidValue) {
              self2 = jQuery(this);
              for (i = 0; i < classNames.length; i++) {
                className = classNames[i];
                if (self2.hasClass(className)) {
                  self2.removeClass(className);
                } else {
                  self2.addClass(className);
                }
              }
            } else if (value === void 0 || type === "boolean") {
              className = getClass(this);
              if (className) {
                dataPriv.set(this, "__className__", className);
              }
              if (this.setAttribute) {
                this.setAttribute(
                  "class",
                  className || value === false ? "" : dataPriv.get(this, "__className__") || ""
                );
              }
            }
          });
        },
        hasClass: function(selector) {
          var className, elem, i = 0;
          className = " " + selector + " ";
          while (elem = this[i++]) {
            if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
              return true;
            }
          }
          return false;
        }
      });
      var rreturn = /\r/g;
      jQuery.fn.extend({
        val: function(value) {
          var hooks, ret, valueIsFunction, elem = this[0];
          if (!arguments.length) {
            if (elem) {
              hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
              if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
                return ret;
              }
              ret = elem.value;
              if (typeof ret === "string") {
                return ret.replace(rreturn, "");
              }
              return ret == null ? "" : ret;
            }
            return;
          }
          valueIsFunction = isFunction(value);
          return this.each(function(i) {
            var val;
            if (this.nodeType !== 1) {
              return;
            }
            if (valueIsFunction) {
              val = value.call(this, i, jQuery(this).val());
            } else {
              val = value;
            }
            if (val == null) {
              val = "";
            } else if (typeof val === "number") {
              val += "";
            } else if (Array.isArray(val)) {
              val = jQuery.map(val, function(value2) {
                return value2 == null ? "" : value2 + "";
              });
            }
            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
            if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
              this.value = val;
            }
          });
        }
      });
      jQuery.extend({
        valHooks: {
          option: {
            get: function(elem) {
              var val = jQuery.find.attr(elem, "value");
              return val != null ? val : (
                // Support: IE <=10 - 11 only
                // option.text throws exceptions (trac-14686, trac-14858)
                // Strip and collapse whitespace
                // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                stripAndCollapse(jQuery.text(elem))
              );
            }
          },
          select: {
            get: function(elem) {
              var value, option, i, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values2 = one ? null : [], max = one ? index + 1 : options.length;
              if (index < 0) {
                i = max;
              } else {
                i = one ? index : 0;
              }
              for (; i < max; i++) {
                option = options[i];
                if ((option.selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
                !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                  value = jQuery(option).val();
                  if (one) {
                    return value;
                  }
                  values2.push(value);
                }
              }
              return values2;
            },
            set: function(elem, value) {
              var optionSet, option, options = elem.options, values2 = jQuery.makeArray(value), i = options.length;
              while (i--) {
                option = options[i];
                if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values2) > -1) {
                  optionSet = true;
                }
              }
              if (!optionSet) {
                elem.selectedIndex = -1;
              }
              return values2;
            }
          }
        }
      });
      jQuery.each(["radio", "checkbox"], function() {
        jQuery.valHooks[this] = {
          set: function(elem, value) {
            if (Array.isArray(value)) {
              return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
            }
          }
        };
        if (!support.checkOn) {
          jQuery.valHooks[this].get = function(elem) {
            return elem.getAttribute("value") === null ? "on" : elem.value;
          };
        }
      });
      var location = window2.location;
      var nonce = { guid: Date.now() };
      var rquery = /\?/;
      jQuery.parseXML = function(data) {
        var xml, parserErrorElem;
        if (!data || typeof data !== "string") {
          return null;
        }
        try {
          xml = new window2.DOMParser().parseFromString(data, "text/xml");
        } catch (e2) {
        }
        parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
        if (!xml || parserErrorElem) {
          jQuery.error("Invalid XML: " + (parserErrorElem ? jQuery.map(parserErrorElem.childNodes, function(el2) {
            return el2.textContent;
          }).join("\n") : data));
        }
        return xml;
      };
      var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e2) {
        e2.stopPropagation();
      };
      jQuery.extend(jQuery.event, {
        trigger: function(event, data, elem, onlyHandlers) {
          var i, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document2], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
          cur = lastElement = tmp = elem = elem || document2;
          if (elem.nodeType === 3 || elem.nodeType === 8) {
            return;
          }
          if (rfocusMorph.test(type + jQuery.event.triggered)) {
            return;
          }
          if (type.indexOf(".") > -1) {
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
          }
          ontype = type.indexOf(":") < 0 && "on" + type;
          event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
          event.isTrigger = onlyHandlers ? 2 : 3;
          event.namespace = namespaces.join(".");
          event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
          event.result = void 0;
          if (!event.target) {
            event.target = elem;
          }
          data = data == null ? [event] : jQuery.makeArray(data, [event]);
          special = jQuery.event.special[type] || {};
          if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
            return;
          }
          if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
            bubbleType = special.delegateType || type;
            if (!rfocusMorph.test(bubbleType + type)) {
              cur = cur.parentNode;
            }
            for (; cur; cur = cur.parentNode) {
              eventPath.push(cur);
              tmp = cur;
            }
            if (tmp === (elem.ownerDocument || document2)) {
              eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
            }
          }
          i = 0;
          while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
            lastElement = cur;
            event.type = i > 1 ? bubbleType : special.bindType || type;
            handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
            if (handle) {
              handle.apply(cur, data);
            }
            handle = ontype && cur[ontype];
            if (handle && handle.apply && acceptData(cur)) {
              event.result = handle.apply(cur, data);
              if (event.result === false) {
                event.preventDefault();
              }
            }
          }
          event.type = type;
          if (!onlyHandlers && !event.isDefaultPrevented()) {
            if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
              if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
                tmp = elem[ontype];
                if (tmp) {
                  elem[ontype] = null;
                }
                jQuery.event.triggered = type;
                if (event.isPropagationStopped()) {
                  lastElement.addEventListener(type, stopPropagationCallback);
                }
                elem[type]();
                if (event.isPropagationStopped()) {
                  lastElement.removeEventListener(type, stopPropagationCallback);
                }
                jQuery.event.triggered = void 0;
                if (tmp) {
                  elem[ontype] = tmp;
                }
              }
            }
          }
          return event.result;
        },
        // Piggyback on a donor event to simulate a different one
        // Used only for `focus(in | out)` events
        simulate: function(type, elem, event) {
          var e2 = jQuery.extend(
            new jQuery.Event(),
            event,
            {
              type,
              isSimulated: true
            }
          );
          jQuery.event.trigger(e2, null, elem);
        }
      });
      jQuery.fn.extend({
        trigger: function(type, data) {
          return this.each(function() {
            jQuery.event.trigger(type, data, this);
          });
        },
        triggerHandler: function(type, data) {
          var elem = this[0];
          if (elem) {
            return jQuery.event.trigger(type, data, elem, true);
          }
        }
      });
      var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
      function buildParams(prefix2, obj, traditional, add) {
        var name;
        if (Array.isArray(obj)) {
          jQuery.each(obj, function(i, v2) {
            if (traditional || rbracket.test(prefix2)) {
              add(prefix2, v2);
            } else {
              buildParams(
                prefix2 + "[" + (typeof v2 === "object" && v2 != null ? i : "") + "]",
                v2,
                traditional,
                add
              );
            }
          });
        } else if (!traditional && toType(obj) === "object") {
          for (name in obj) {
            buildParams(prefix2 + "[" + name + "]", obj[name], traditional, add);
          }
        } else {
          add(prefix2, obj);
        }
      }
      jQuery.param = function(a, traditional) {
        var prefix2, s = [], add = function(key, valueOrFunction) {
          var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
          s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
        };
        if (a == null) {
          return "";
        }
        if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
          jQuery.each(a, function() {
            add(this.name, this.value);
          });
        } else {
          for (prefix2 in a) {
            buildParams(prefix2, a[prefix2], traditional, add);
          }
        }
        return s.join("&");
      };
      jQuery.fn.extend({
        serialize: function() {
          return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
          return this.map(function() {
            var elements = jQuery.prop(this, "elements");
            return elements ? jQuery.makeArray(elements) : this;
          }).filter(function() {
            var type = this.type;
            return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
          }).map(function(_i, elem) {
            var val = jQuery(this).val();
            if (val == null) {
              return null;
            }
            if (Array.isArray(val)) {
              return jQuery.map(val, function(val2) {
                return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
              });
            }
            return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
          }).get();
        }
      });
      var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document2.createElement("a");
      originAnchor.href = location.href;
      function addToPrefiltersOrTransports(structure) {
        return function(dataTypeExpression, func) {
          if (typeof dataTypeExpression !== "string") {
            func = dataTypeExpression;
            dataTypeExpression = "*";
          }
          var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
          if (isFunction(func)) {
            while (dataType = dataTypes[i++]) {
              if (dataType[0] === "+") {
                dataType = dataType.slice(1) || "*";
                (structure[dataType] = structure[dataType] || []).unshift(func);
              } else {
                (structure[dataType] = structure[dataType] || []).push(func);
              }
            }
          }
        };
      }
      function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        var inspected = {}, seekingTransport = structure === transports;
        function inspect(dataType) {
          var selected;
          inspected[dataType] = true;
          jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
            var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
            if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
              options.dataTypes.unshift(dataTypeOrTransport);
              inspect(dataTypeOrTransport);
              return false;
            } else if (seekingTransport) {
              return !(selected = dataTypeOrTransport);
            }
          });
          return selected;
        }
        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
      }
      function ajaxExtend(target, src) {
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) {
          if (src[key] !== void 0) {
            (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
          }
        }
        if (deep) {
          jQuery.extend(true, target, deep);
        }
        return target;
      }
      function ajaxHandleResponses(s, jqXHR, responses) {
        var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
        while (dataTypes[0] === "*") {
          dataTypes.shift();
          if (ct === void 0) {
            ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
          }
        }
        if (ct) {
          for (type in contents) {
            if (contents[type] && contents[type].test(ct)) {
              dataTypes.unshift(type);
              break;
            }
          }
        }
        if (dataTypes[0] in responses) {
          finalDataType = dataTypes[0];
        } else {
          for (type in responses) {
            if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
              finalDataType = type;
              break;
            }
            if (!firstDataType) {
              firstDataType = type;
            }
          }
          finalDataType = finalDataType || firstDataType;
        }
        if (finalDataType) {
          if (finalDataType !== dataTypes[0]) {
            dataTypes.unshift(finalDataType);
          }
          return responses[finalDataType];
        }
      }
      function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2, current2, conv, tmp, prev2, converters = {}, dataTypes = s.dataTypes.slice();
        if (dataTypes[1]) {
          for (conv in s.converters) {
            converters[conv.toLowerCase()] = s.converters[conv];
          }
        }
        current2 = dataTypes.shift();
        while (current2) {
          if (s.responseFields[current2]) {
            jqXHR[s.responseFields[current2]] = response;
          }
          if (!prev2 && isSuccess && s.dataFilter) {
            response = s.dataFilter(response, s.dataType);
          }
          prev2 = current2;
          current2 = dataTypes.shift();
          if (current2) {
            if (current2 === "*") {
              current2 = prev2;
            } else if (prev2 !== "*" && prev2 !== current2) {
              conv = converters[prev2 + " " + current2] || converters["* " + current2];
              if (!conv) {
                for (conv2 in converters) {
                  tmp = conv2.split(" ");
                  if (tmp[1] === current2) {
                    conv = converters[prev2 + " " + tmp[0]] || converters["* " + tmp[0]];
                    if (conv) {
                      if (conv === true) {
                        conv = converters[conv2];
                      } else if (converters[conv2] !== true) {
                        current2 = tmp[0];
                        dataTypes.unshift(tmp[1]);
                      }
                      break;
                    }
                  }
                }
              }
              if (conv !== true) {
                if (conv && s.throws) {
                  response = conv(response);
                } else {
                  try {
                    response = conv(response);
                  } catch (e2) {
                    return {
                      state: "parsererror",
                      error: conv ? e2 : "No conversion from " + prev2 + " to " + current2
                    };
                  }
                }
              }
            }
          }
        }
        return { state: "success", data: response };
      }
      jQuery.extend({
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: location.href,
          type: "GET",
          isLocal: rlocalProtocol.test(location.protocol),
          global: true,
          processData: true,
          async: true,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          /*
          timeout: 0,
          data: null,
          dataType: null,
          username: null,
          password: null,
          cache: null,
          throws: false,
          traditional: false,
          headers: {},
          */
          accepts: {
            "*": allTypes,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
          },
          contents: {
            xml: /\bxml\b/,
            html: /\bhtml/,
            json: /\bjson\b/
          },
          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
          },
          // Data converters
          // Keys separate source (or catchall "*") and destination types with a single space
          converters: {
            // Convert anything to text
            "* text": String,
            // Text to html (true = no transformation)
            "text html": true,
            // Evaluate text as a json expression
            "text json": JSON.parse,
            // Parse text as xml
            "text xml": jQuery.parseXML
          },
          // For options that shouldn't be deep extended:
          // you can add your own custom options here if
          // and when you create one that shouldn't be
          // deep extended (see ajaxExtend)
          flatOptions: {
            url: true,
            context: true
          }
        },
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function(target, settings) {
          return settings ? (
            // Building a settings object
            ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings)
          ) : (
            // Extending ajaxSettings
            ajaxExtend(jQuery.ajaxSettings, target)
          );
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        // Main method
        ajax: function(url, options) {
          if (typeof url === "object") {
            options = url;
            url = void 0;
          }
          options = options || {};
          var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i, uncached, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
            readyState: 0,
            // Builds headers hashtable if needed
            getResponseHeader: function(key) {
              var match2;
              if (completed2) {
                if (!responseHeaders) {
                  responseHeaders = {};
                  while (match2 = rheaders.exec(responseHeadersString)) {
                    responseHeaders[match2[1].toLowerCase() + " "] = (responseHeaders[match2[1].toLowerCase() + " "] || []).concat(match2[2]);
                  }
                }
                match2 = responseHeaders[key.toLowerCase() + " "];
              }
              return match2 == null ? null : match2.join(", ");
            },
            // Raw string
            getAllResponseHeaders: function() {
              return completed2 ? responseHeadersString : null;
            },
            // Caches the header
            setRequestHeader: function(name, value) {
              if (completed2 == null) {
                name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
                requestHeaders[name] = value;
              }
              return this;
            },
            // Overrides response content-type header
            overrideMimeType: function(type) {
              if (completed2 == null) {
                s.mimeType = type;
              }
              return this;
            },
            // Status-dependent callbacks
            statusCode: function(map) {
              var code;
              if (map) {
                if (completed2) {
                  jqXHR.always(map[jqXHR.status]);
                } else {
                  for (code in map) {
                    statusCode[code] = [statusCode[code], map[code]];
                  }
                }
              }
              return this;
            },
            // Cancel the request
            abort: function(statusText) {
              var finalText = statusText || strAbort;
              if (transport) {
                transport.abort(finalText);
              }
              done(0, finalText);
              return this;
            }
          };
          deferred.promise(jqXHR);
          s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");
          s.type = options.method || options.type || s.method || s.type;
          s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
          if (s.crossDomain == null) {
            urlAnchor = document2.createElement("a");
            try {
              urlAnchor.href = s.url;
              urlAnchor.href = urlAnchor.href;
              s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
            } catch (e2) {
              s.crossDomain = true;
            }
          }
          if (s.data && s.processData && typeof s.data !== "string") {
            s.data = jQuery.param(s.data, s.traditional);
          }
          inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
          if (completed2) {
            return jqXHR;
          }
          fireGlobals = jQuery.event && s.global;
          if (fireGlobals && jQuery.active++ === 0) {
            jQuery.event.trigger("ajaxStart");
          }
          s.type = s.type.toUpperCase();
          s.hasContent = !rnoContent.test(s.type);
          cacheURL = s.url.replace(rhash, "");
          if (!s.hasContent) {
            uncached = s.url.slice(cacheURL.length);
            if (s.data && (s.processData || typeof s.data === "string")) {
              cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
              delete s.data;
            }
            if (s.cache === false) {
              cacheURL = cacheURL.replace(rantiCache, "$1");
              uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
            }
            s.url = cacheURL + uncached;
          } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
            s.data = s.data.replace(r20, "+");
          }
          if (s.ifModified) {
            if (jQuery.lastModified[cacheURL]) {
              jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
            }
            if (jQuery.etag[cacheURL]) {
              jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
            }
          }
          if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
            jqXHR.setRequestHeader("Content-Type", s.contentType);
          }
          jqXHR.setRequestHeader(
            "Accept",
            s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]
          );
          for (i in s.headers) {
            jqXHR.setRequestHeader(i, s.headers[i]);
          }
          if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed2)) {
            return jqXHR.abort();
          }
          strAbort = "abort";
          completeDeferred.add(s.complete);
          jqXHR.done(s.success);
          jqXHR.fail(s.error);
          transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
          if (!transport) {
            done(-1, "No Transport");
          } else {
            jqXHR.readyState = 1;
            if (fireGlobals) {
              globalEventContext.trigger("ajaxSend", [jqXHR, s]);
            }
            if (completed2) {
              return jqXHR;
            }
            if (s.async && s.timeout > 0) {
              timeoutTimer = window2.setTimeout(function() {
                jqXHR.abort("timeout");
              }, s.timeout);
            }
            try {
              completed2 = false;
              transport.send(requestHeaders, done);
            } catch (e2) {
              if (completed2) {
                throw e2;
              }
              done(-1, e2);
            }
          }
          function done(status, nativeStatusText, responses, headers) {
            var isSuccess, success, error, response, modified, statusText = nativeStatusText;
            if (completed2) {
              return;
            }
            completed2 = true;
            if (timeoutTimer) {
              window2.clearTimeout(timeoutTimer);
            }
            transport = void 0;
            responseHeadersString = headers || "";
            jqXHR.readyState = status > 0 ? 4 : 0;
            isSuccess = status >= 200 && status < 300 || status === 304;
            if (responses) {
              response = ajaxHandleResponses(s, jqXHR, responses);
            }
            if (!isSuccess && jQuery.inArray("script", s.dataTypes) > -1 && jQuery.inArray("json", s.dataTypes) < 0) {
              s.converters["text script"] = function() {
              };
            }
            response = ajaxConvert(s, response, jqXHR, isSuccess);
            if (isSuccess) {
              if (s.ifModified) {
                modified = jqXHR.getResponseHeader("Last-Modified");
                if (modified) {
                  jQuery.lastModified[cacheURL] = modified;
                }
                modified = jqXHR.getResponseHeader("etag");
                if (modified) {
                  jQuery.etag[cacheURL] = modified;
                }
              }
              if (status === 204 || s.type === "HEAD") {
                statusText = "nocontent";
              } else if (status === 304) {
                statusText = "notmodified";
              } else {
                statusText = response.state;
                success = response.data;
                error = response.error;
                isSuccess = !error;
              }
            } else {
              error = statusText;
              if (status || !statusText) {
                statusText = "error";
                if (status < 0) {
                  status = 0;
                }
              }
            }
            jqXHR.status = status;
            jqXHR.statusText = (nativeStatusText || statusText) + "";
            if (isSuccess) {
              deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
            } else {
              deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
            }
            jqXHR.statusCode(statusCode);
            statusCode = void 0;
            if (fireGlobals) {
              globalEventContext.trigger(
                isSuccess ? "ajaxSuccess" : "ajaxError",
                [jqXHR, s, isSuccess ? success : error]
              );
            }
            completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
            if (fireGlobals) {
              globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
              if (!--jQuery.active) {
                jQuery.event.trigger("ajaxStop");
              }
            }
          }
          return jqXHR;
        },
        getJSON: function(url, data, callback) {
          return jQuery.get(url, data, callback, "json");
        },
        getScript: function(url, callback) {
          return jQuery.get(url, void 0, callback, "script");
        }
      });
      jQuery.each(["get", "post"], function(_i, method) {
        jQuery[method] = function(url, data, callback, type) {
          if (isFunction(data)) {
            type = type || callback;
            callback = data;
            data = void 0;
          }
          return jQuery.ajax(jQuery.extend({
            url,
            type: method,
            dataType: type,
            data,
            success: callback
          }, jQuery.isPlainObject(url) && url));
        };
      });
      jQuery.ajaxPrefilter(function(s) {
        var i;
        for (i in s.headers) {
          if (i.toLowerCase() === "content-type") {
            s.contentType = s.headers[i] || "";
          }
        }
      });
      jQuery._evalUrl = function(url, options, doc) {
        return jQuery.ajax({
          url,
          // Make this explicit, since user can override this through ajaxSetup (trac-11264)
          type: "GET",
          dataType: "script",
          cache: true,
          async: false,
          global: false,
          // Only evaluate the response if it is successful (gh-4126)
          // dataFilter is not invoked for failure responses, so using it instead
          // of the default converter is kludgy but it works.
          converters: {
            "text script": function() {
            }
          },
          dataFilter: function(response) {
            jQuery.globalEval(response, options, doc);
          }
        });
      };
      jQuery.fn.extend({
        wrapAll: function(html) {
          var wrap;
          if (this[0]) {
            if (isFunction(html)) {
              html = html.call(this[0]);
            }
            wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
            if (this[0].parentNode) {
              wrap.insertBefore(this[0]);
            }
            wrap.map(function() {
              var elem = this;
              while (elem.firstElementChild) {
                elem = elem.firstElementChild;
              }
              return elem;
            }).append(this);
          }
          return this;
        },
        wrapInner: function(html) {
          if (isFunction(html)) {
            return this.each(function(i) {
              jQuery(this).wrapInner(html.call(this, i));
            });
          }
          return this.each(function() {
            var self2 = jQuery(this), contents = self2.contents();
            if (contents.length) {
              contents.wrapAll(html);
            } else {
              self2.append(html);
            }
          });
        },
        wrap: function(html) {
          var htmlIsFunction = isFunction(html);
          return this.each(function(i) {
            jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
          });
        },
        unwrap: function(selector) {
          this.parent(selector).not("body").each(function() {
            jQuery(this).replaceWith(this.childNodes);
          });
          return this;
        }
      });
      jQuery.expr.pseudos.hidden = function(elem) {
        return !jQuery.expr.pseudos.visible(elem);
      };
      jQuery.expr.pseudos.visible = function(elem) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
      };
      jQuery.ajaxSettings.xhr = function() {
        try {
          return new window2.XMLHttpRequest();
        } catch (e2) {
        }
      };
      var xhrSuccessStatus = {
        // File protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE <=9 only
        // trac-1450: sometimes IE returns 1223 when it should be 204
        1223: 204
      }, xhrSupported = jQuery.ajaxSettings.xhr();
      support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
      support.ajax = xhrSupported = !!xhrSupported;
      jQuery.ajaxTransport(function(options) {
        var callback, errorCallback;
        if (support.cors || xhrSupported && !options.crossDomain) {
          return {
            send: function(headers, complete) {
              var i, xhr = options.xhr();
              xhr.open(
                options.type,
                options.url,
                options.async,
                options.username,
                options.password
              );
              if (options.xhrFields) {
                for (i in options.xhrFields) {
                  xhr[i] = options.xhrFields[i];
                }
              }
              if (options.mimeType && xhr.overrideMimeType) {
                xhr.overrideMimeType(options.mimeType);
              }
              if (!options.crossDomain && !headers["X-Requested-With"]) {
                headers["X-Requested-With"] = "XMLHttpRequest";
              }
              for (i in headers) {
                xhr.setRequestHeader(i, headers[i]);
              }
              callback = function(type) {
                return function() {
                  if (callback) {
                    callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                    if (type === "abort") {
                      xhr.abort();
                    } else if (type === "error") {
                      if (typeof xhr.status !== "number") {
                        complete(0, "error");
                      } else {
                        complete(
                          // File: protocol always yields status 0; see trac-8605, trac-14207
                          xhr.status,
                          xhr.statusText
                        );
                      }
                    } else {
                      complete(
                        xhrSuccessStatus[xhr.status] || xhr.status,
                        xhr.statusText,
                        // Support: IE <=9 only
                        // IE9 has no XHR2 but throws on binary (trac-11426)
                        // For XHR2 non-text, let the caller handle it (gh-2498)
                        (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText },
                        xhr.getAllResponseHeaders()
                      );
                    }
                  }
                };
              };
              xhr.onload = callback();
              errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
              if (xhr.onabort !== void 0) {
                xhr.onabort = errorCallback;
              } else {
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    window2.setTimeout(function() {
                      if (callback) {
                        errorCallback();
                      }
                    });
                  }
                };
              }
              callback = callback("abort");
              try {
                xhr.send(options.hasContent && options.data || null);
              } catch (e2) {
                if (callback) {
                  throw e2;
                }
              }
            },
            abort: function() {
              if (callback) {
                callback();
              }
            }
          };
        }
      });
      jQuery.ajaxPrefilter(function(s) {
        if (s.crossDomain) {
          s.contents.script = false;
        }
      });
      jQuery.ajaxSetup({
        accepts: {
          script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
          script: /\b(?:java|ecma)script\b/
        },
        converters: {
          "text script": function(text) {
            jQuery.globalEval(text);
            return text;
          }
        }
      });
      jQuery.ajaxPrefilter("script", function(s) {
        if (s.cache === void 0) {
          s.cache = false;
        }
        if (s.crossDomain) {
          s.type = "GET";
        }
      });
      jQuery.ajaxTransport("script", function(s) {
        if (s.crossDomain || s.scriptAttrs) {
          var script, callback;
          return {
            send: function(_, complete) {
              script = jQuery("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", callback = function(evt) {
                script.remove();
                callback = null;
                if (evt) {
                  complete(evt.type === "error" ? 404 : 200, evt.type);
                }
              });
              document2.head.appendChild(script[0]);
            },
            abort: function() {
              if (callback) {
                callback();
              }
            }
          };
        }
      });
      var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
      jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
          var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
          this[callback] = true;
          return callback;
        }
      });
      jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
        if (jsonProp || s.dataTypes[0] === "jsonp") {
          callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
          if (jsonProp) {
            s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
          } else if (s.jsonp !== false) {
            s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
          }
          s.converters["script json"] = function() {
            if (!responseContainer) {
              jQuery.error(callbackName + " was not called");
            }
            return responseContainer[0];
          };
          s.dataTypes[0] = "json";
          overwritten = window2[callbackName];
          window2[callbackName] = function() {
            responseContainer = arguments;
          };
          jqXHR.always(function() {
            if (overwritten === void 0) {
              jQuery(window2).removeProp(callbackName);
            } else {
              window2[callbackName] = overwritten;
            }
            if (s[callbackName]) {
              s.jsonpCallback = originalSettings.jsonpCallback;
              oldCallbacks.push(callbackName);
            }
            if (responseContainer && isFunction(overwritten)) {
              overwritten(responseContainer[0]);
            }
            responseContainer = overwritten = void 0;
          });
          return "script";
        }
      });
      support.createHTMLDocument = function() {
        var body = document2.implementation.createHTMLDocument("").body;
        body.innerHTML = "<form></form><form></form>";
        return body.childNodes.length === 2;
      }();
      jQuery.parseHTML = function(data, context, keepScripts) {
        if (typeof data !== "string") {
          return [];
        }
        if (typeof context === "boolean") {
          keepScripts = context;
          context = false;
        }
        var base, parsed, scripts;
        if (!context) {
          if (support.createHTMLDocument) {
            context = document2.implementation.createHTMLDocument("");
            base = context.createElement("base");
            base.href = document2.location.href;
            context.head.appendChild(base);
          } else {
            context = document2;
          }
        }
        parsed = rsingleTag.exec(data);
        scripts = !keepScripts && [];
        if (parsed) {
          return [context.createElement(parsed[1])];
        }
        parsed = buildFragment([data], context, scripts);
        if (scripts && scripts.length) {
          jQuery(scripts).remove();
        }
        return jQuery.merge([], parsed.childNodes);
      };
      jQuery.fn.load = function(url, params, callback) {
        var selector, type, response, self2 = this, off = url.indexOf(" ");
        if (off > -1) {
          selector = stripAndCollapse(url.slice(off));
          url = url.slice(0, off);
        }
        if (isFunction(params)) {
          callback = params;
          params = void 0;
        } else if (params && typeof params === "object") {
          type = "POST";
        }
        if (self2.length > 0) {
          jQuery.ajax({
            url,
            // If "type" variable is undefined, then "GET" method will be used.
            // Make value of this field explicit since
            // user can override it through ajaxSetup method
            type: type || "GET",
            dataType: "html",
            data: params
          }).done(function(responseText) {
            response = arguments;
            self2.html(selector ? (
              // If a selector was specified, locate the right elements in a dummy div
              // Exclude scripts to avoid IE 'Permission Denied' errors
              jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector)
            ) : (
              // Otherwise use the full result
              responseText
            ));
          }).always(callback && function(jqXHR, status) {
            self2.each(function() {
              callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
            });
          });
        }
        return this;
      };
      jQuery.expr.pseudos.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
          return elem === fn.elem;
        }).length;
      };
      jQuery.offset = {
        setOffset: function(elem, options, i) {
          var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position2 = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
          if (position2 === "static") {
            elem.style.position = "relative";
          }
          curOffset = curElem.offset();
          curCSSTop = jQuery.css(elem, "top");
          curCSSLeft = jQuery.css(elem, "left");
          calculatePosition = (position2 === "absolute" || position2 === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
          if (calculatePosition) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
          } else {
            curTop = parseFloat(curCSSTop) || 0;
            curLeft = parseFloat(curCSSLeft) || 0;
          }
          if (isFunction(options)) {
            options = options.call(elem, i, jQuery.extend({}, curOffset));
          }
          if (options.top != null) {
            props.top = options.top - curOffset.top + curTop;
          }
          if (options.left != null) {
            props.left = options.left - curOffset.left + curLeft;
          }
          if ("using" in options) {
            options.using.call(elem, props);
          } else {
            curElem.css(props);
          }
        }
      };
      jQuery.fn.extend({
        // offset() relates an element's border box to the document origin
        offset: function(options) {
          if (arguments.length) {
            return options === void 0 ? this : this.each(function(i) {
              jQuery.offset.setOffset(this, options, i);
            });
          }
          var rect, win, elem = this[0];
          if (!elem) {
            return;
          }
          if (!elem.getClientRects().length) {
            return { top: 0, left: 0 };
          }
          rect = elem.getBoundingClientRect();
          win = elem.ownerDocument.defaultView;
          return {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset
          };
        },
        // position() relates an element's margin box to its offset parent's padding box
        // This corresponds to the behavior of CSS absolute positioning
        position: function() {
          if (!this[0]) {
            return;
          }
          var offsetParent, offset, doc, elem = this[0], parentOffset = { top: 0, left: 0 };
          if (jQuery.css(elem, "position") === "fixed") {
            offset = elem.getBoundingClientRect();
          } else {
            offset = this.offset();
            doc = elem.ownerDocument;
            offsetParent = elem.offsetParent || doc.documentElement;
            while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent, "position") === "static") {
              offsetParent = offsetParent.parentNode;
            }
            if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
              parentOffset = jQuery(offsetParent).offset();
              parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
              parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
            }
          }
          return {
            top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
            left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
          };
        },
        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function() {
          return this.map(function() {
            var offsetParent = this.offsetParent;
            while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
              offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || documentElement;
          });
        }
      });
      jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
        var top = "pageYOffset" === prop;
        jQuery.fn[method] = function(val) {
          return access(this, function(elem, method2, val2) {
            var win;
            if (isWindow(elem)) {
              win = elem;
            } else if (elem.nodeType === 9) {
              win = elem.defaultView;
            }
            if (val2 === void 0) {
              return win ? win[prop] : elem[method2];
            }
            if (win) {
              win.scrollTo(
                !top ? val2 : win.pageXOffset,
                top ? val2 : win.pageYOffset
              );
            } else {
              elem[method2] = val2;
            }
          }, method, val, arguments.length);
        };
      });
      jQuery.each(["top", "left"], function(_i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(
          support.pixelPosition,
          function(elem, computed) {
            if (computed) {
              computed = curCSS(elem, prop);
              return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
            }
          }
        );
      });
      jQuery.each({ Height: "height", Width: "width" }, function(name, type) {
        jQuery.each({
          padding: "inner" + name,
          content: type,
          "": "outer" + name
        }, function(defaultExtra, funcName) {
          jQuery.fn[funcName] = function(margin2, value) {
            var chainable = arguments.length && (defaultExtra || typeof margin2 !== "boolean"), extra = defaultExtra || (margin2 === true || value === true ? "margin" : "border");
            return access(this, function(elem, type2, value2) {
              var doc;
              if (isWindow(elem)) {
                return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
              }
              if (elem.nodeType === 9) {
                doc = elem.documentElement;
                return Math.max(
                  elem.body["scroll" + name],
                  doc["scroll" + name],
                  elem.body["offset" + name],
                  doc["offset" + name],
                  doc["client" + name]
                );
              }
              return value2 === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                jQuery.css(elem, type2, extra)
              ) : (
                // Set width or height on the element
                jQuery.style(elem, type2, value2, extra)
              );
            }, type, chainable ? margin2 : void 0, chainable);
          };
        });
      });
      jQuery.each([
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
      ], function(_i, type) {
        jQuery.fn[type] = function(fn) {
          return this.on(type, fn);
        };
      });
      jQuery.fn.extend({
        bind: function(types, data, fn) {
          return this.on(types, null, data, fn);
        },
        unbind: function(types, fn) {
          return this.off(types, null, fn);
        },
        delegate: function(selector, types, data, fn) {
          return this.on(types, selector, data, fn);
        },
        undelegate: function(selector, types, fn) {
          return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        },
        hover: function(fnOver, fnOut) {
          return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver);
        }
      });
      jQuery.each(
        "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
        function(_i, name) {
          jQuery.fn[name] = function(data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
          };
        }
      );
      var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
      jQuery.proxy = function(fn, context) {
        var tmp, args, proxy;
        if (typeof context === "string") {
          tmp = fn[context];
          context = fn;
          fn = tmp;
        }
        if (!isFunction(fn)) {
          return void 0;
        }
        args = slice2.call(arguments, 2);
        proxy = function() {
          return fn.apply(context || this, args.concat(slice2.call(arguments)));
        };
        proxy.guid = fn.guid = fn.guid || jQuery.guid++;
        return proxy;
      };
      jQuery.holdReady = function(hold) {
        if (hold) {
          jQuery.readyWait++;
        } else {
          jQuery.ready(true);
        }
      };
      jQuery.isArray = Array.isArray;
      jQuery.parseJSON = JSON.parse;
      jQuery.nodeName = nodeName;
      jQuery.isFunction = isFunction;
      jQuery.isWindow = isWindow;
      jQuery.camelCase = camelCase;
      jQuery.type = toType;
      jQuery.now = Date.now;
      jQuery.isNumeric = function(obj) {
        var type = jQuery.type(obj);
        return (type === "number" || type === "string") && // parseFloat NaNs numeric-cast false positives ("")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        !isNaN(obj - parseFloat(obj));
      };
      jQuery.trim = function(text) {
        return text == null ? "" : (text + "").replace(rtrim, "$1");
      };
      var _jQuery = window2.jQuery, _$ = window2.$;
      jQuery.noConflict = function(deep) {
        if (window2.$ === jQuery) {
          window2.$ = _$;
        }
        if (deep && window2.jQuery === jQuery) {
          window2.jQuery = _jQuery;
        }
        return jQuery;
      };
      if (typeof noGlobal === "undefined") {
        window2.jQuery = window2.$ = jQuery;
      }
      return jQuery;
    });
  })(jquery);
  var jqueryExports = jquery.exports;
  const $ = /* @__PURE__ */ getDefaultExportFromCjs(jqueryExports);
  const DrinkwaterIcon = "data:image/png;base64,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";
  function App() {
    const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
    const [drawerContent, setDrawerContent] = reactExports.useState(null);
    const toggleDrawer = (open) => (event) => {
      if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
        return;
      }
      setDrawerOpen(open);
    };
    reactExports.useEffect(() => {
      const content = $("#ppm-sidemenu").detach().html();
      setDrawerContent(content || null);
    }, []);
    return /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement(
      IconButton,
      {
        onClick: toggleDrawer(true),
        sx: {
          color: "white"
        }
      },
      /* @__PURE__ */ React$1.createElement(ReadMoreIcon, { style: { transform: "scaleX(-1)", fontSize: "3rem" } })
    ), /* @__PURE__ */ React$1.createElement(
      Drawer,
      {
        anchor: "right",
        open: drawerOpen,
        onClose: toggleDrawer(false),
        ModalProps: {
          keepMounted: true
          // para melhorar o desempenho em dispositivos móveis
        },
        sx: {
          "& .MuiDrawer-paper": {
            maxWidth: "300px",
            backgroundColor: "#eeeeee"
            // cor de fundo do drawer
          }
        }
      },
      /* @__PURE__ */ React$1.createElement(
        "div",
        {
          role: "presentation"
        },
        drawerContent && /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement(
          "div",
          {
            id: "ppm-drawer-content",
            dangerouslySetInnerHTML: { __html: drawerContent }
          }
        ), /* @__PURE__ */ React$1.createElement("div", { style: { display: "flex", width: "100%", justifyContent: "center", alignItems: "center" } }, /* @__PURE__ */ React$1.createElement("img", { src: DrinkwaterIcon, alt: "Drinkwater Icon", style: { maxWidth: "100px" } })))
      )
    ));
  }
  function log(...args) {
    console.log(
      "%cUserscript (React Mode):",
      "color: purple; font-weight: bold",
      ...args
    );
  }
  function addLocationChangeCallback(callback) {
    window.setTimeout(callback, 0);
    let oldHref = window.location.href;
    const body = document.querySelector("body");
    const observer = new MutationObserver((mutations) => {
      if (mutations.some(() => oldHref !== document.location.href)) {
        oldHref = document.location.href;
        callback();
      }
    });
    observer.observe(body, { childList: true, subtree: true });
    return observer;
  }
  async function awaitElement(selector) {
    const MAX_TRIES = 60;
    let tries = 0;
    return new Promise((resolve, reject) => {
      function probe() {
        tries++;
        return document.querySelector(selector);
      }
      function delayedProbe() {
        if (tries >= MAX_TRIES) {
          log("Can't find element with selector", selector);
          reject();
          return;
        }
        const elm = probe();
        if (elm) {
          resolve(elm);
          return;
        }
        window.setTimeout(delayedProbe, 250);
      }
      delayedProbe();
    });
  }
  function formatProdErrorMessage$1(code) {
    return `Minified Redux error #${code}; visit https://redux.js.org/Errors?code=${code} for the full message or use the non-minified dev environment for full errors. `;
  }
  var $$observable = /* @__PURE__ */ (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();
  var symbol_observable_default = $$observable;
  var randomString = () => Math.random().toString(36).substring(7).split("").join(".");
  var ActionTypes = {
    INIT: `@@redux/INIT${/* @__PURE__ */ randomString()}`,
    REPLACE: `@@redux/REPLACE${/* @__PURE__ */ randomString()}`,
    PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
  };
  var actionTypes_default = ActionTypes;
  function isPlainObject$1(obj) {
    if (typeof obj !== "object" || obj === null)
      return false;
    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto || Object.getPrototypeOf(obj) === null;
  }
  function createStore(reducer, preloadedState, enhancer) {
    if (typeof reducer !== "function") {
      throw new Error(formatProdErrorMessage$1(2));
    }
    if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
      throw new Error(formatProdErrorMessage$1(0));
    }
    if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
      enhancer = preloadedState;
      preloadedState = void 0;
    }
    if (typeof enhancer !== "undefined") {
      if (typeof enhancer !== "function") {
        throw new Error(formatProdErrorMessage$1(1));
      }
      return enhancer(createStore)(reducer, preloadedState);
    }
    let currentReducer = reducer;
    let currentState = preloadedState;
    let currentListeners = /* @__PURE__ */ new Map();
    let nextListeners = currentListeners;
    let listenerIdCounter = 0;
    let isDispatching = false;
    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = /* @__PURE__ */ new Map();
        currentListeners.forEach((listener, key) => {
          nextListeners.set(key, listener);
        });
      }
    }
    function getState() {
      if (isDispatching) {
        throw new Error(formatProdErrorMessage$1(3));
      }
      return currentState;
    }
    function subscribe(listener) {
      if (typeof listener !== "function") {
        throw new Error(formatProdErrorMessage$1(4));
      }
      if (isDispatching) {
        throw new Error(formatProdErrorMessage$1(5));
      }
      let isSubscribed = true;
      ensureCanMutateNextListeners();
      const listenerId = listenerIdCounter++;
      nextListeners.set(listenerId, listener);
      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }
        if (isDispatching) {
          throw new Error(formatProdErrorMessage$1(6));
        }
        isSubscribed = false;
        ensureCanMutateNextListeners();
        nextListeners.delete(listenerId);
        currentListeners = null;
      };
    }
    function dispatch(action) {
      if (!isPlainObject$1(action)) {
        throw new Error(formatProdErrorMessage$1(7));
      }
      if (typeof action.type === "undefined") {
        throw new Error(formatProdErrorMessage$1(8));
      }
      if (typeof action.type !== "string") {
        throw new Error(formatProdErrorMessage$1(17));
      }
      if (isDispatching) {
        throw new Error(formatProdErrorMessage$1(9));
      }
      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }
      const listeners = currentListeners = nextListeners;
      listeners.forEach((listener) => {
        listener();
      });
      return action;
    }
    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== "function") {
        throw new Error(formatProdErrorMessage$1(10));
      }
      currentReducer = nextReducer;
      dispatch({
        type: actionTypes_default.REPLACE
      });
    }
    function observable() {
      const outerSubscribe = subscribe;
      return {
        /**
         * The minimal observable subscription method.
         * @param observer Any object that can be used as an observer.
         * The observer object should have a `next` method.
         * @returns An object with an `unsubscribe` method that can
         * be used to unsubscribe the observable from the store, and prevent further
         * emission of values from the observable.
         */
        subscribe(observer) {
          if (typeof observer !== "object" || observer === null) {
            throw new Error(formatProdErrorMessage$1(11));
          }
          function observeState() {
            const observerAsObserver = observer;
            if (observerAsObserver.next) {
              observerAsObserver.next(getState());
            }
          }
          observeState();
          const unsubscribe = outerSubscribe(observeState);
          return {
            unsubscribe
          };
        },
        [symbol_observable_default]() {
          return this;
        }
      };
    }
    dispatch({
      type: actionTypes_default.INIT
    });
    const store2 = {
      dispatch,
      subscribe,
      getState,
      replaceReducer,
      [symbol_observable_default]: observable
    };
    return store2;
  }
  function assertReducerShape(reducers) {
    Object.keys(reducers).forEach((key) => {
      const reducer = reducers[key];
      const initialState = reducer(void 0, {
        type: actionTypes_default.INIT
      });
      if (typeof initialState === "undefined") {
        throw new Error(formatProdErrorMessage$1(12));
      }
      if (typeof reducer(void 0, {
        type: actionTypes_default.PROBE_UNKNOWN_ACTION()
      }) === "undefined") {
        throw new Error(formatProdErrorMessage$1(13));
      }
    });
  }
  function combineReducers(reducers) {
    const reducerKeys = Object.keys(reducers);
    const finalReducers = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      if (typeof reducers[key] === "function") {
        finalReducers[key] = reducers[key];
      }
    }
    const finalReducerKeys = Object.keys(finalReducers);
    let shapeAssertionError;
    try {
      assertReducerShape(finalReducers);
    } catch (e2) {
      shapeAssertionError = e2;
    }
    return function combination(state = {}, action) {
      if (shapeAssertionError) {
        throw shapeAssertionError;
      }
      let hasChanged = false;
      const nextState = {};
      for (let i = 0; i < finalReducerKeys.length; i++) {
        const key = finalReducerKeys[i];
        const reducer = finalReducers[key];
        const previousStateForKey = state[key];
        const nextStateForKey = reducer(previousStateForKey, action);
        if (typeof nextStateForKey === "undefined") {
          action && action.type;
          throw new Error(formatProdErrorMessage$1(14));
        }
        nextState[key] = nextStateForKey;
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      }
      hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
      return hasChanged ? nextState : state;
    };
  }
  function compose(...funcs) {
    if (funcs.length === 0) {
      return (arg2) => arg2;
    }
    if (funcs.length === 1) {
      return funcs[0];
    }
    return funcs.reduce((a, b2) => (...args) => a(b2(...args)));
  }
  function applyMiddleware(...middlewares) {
    return (createStore2) => (reducer, preloadedState) => {
      const store2 = createStore2(reducer, preloadedState);
      let dispatch = () => {
        throw new Error(formatProdErrorMessage$1(15));
      };
      const middlewareAPI = {
        getState: store2.getState,
        dispatch: (action, ...args) => dispatch(action, ...args)
      };
      const chain = middlewares.map((middleware2) => middleware2(middlewareAPI));
      dispatch = compose(...chain)(store2.dispatch);
      return {
        ...store2,
        dispatch
      };
    };
  }
  var NOTHING = Symbol.for("immer-nothing");
  var DRAFTABLE = Symbol.for("immer-draftable");
  var DRAFT_STATE = Symbol.for("immer-state");
  function die(error, ...args) {
    throw new Error(
      `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
    );
  }
  var getPrototypeOf = Object.getPrototypeOf;
  function isDraft(value) {
    return !!value && !!value[DRAFT_STATE];
  }
  function isDraftable(value) {
    var _a;
    if (!value)
      return false;
    return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!((_a = value.constructor) == null ? void 0 : _a[DRAFTABLE]) || isMap(value) || isSet(value);
  }
  var objectCtorString = Object.prototype.constructor.toString();
  function isPlainObject(value) {
    if (!value || typeof value !== "object")
      return false;
    const proto = getPrototypeOf(value);
    if (proto === null) {
      return true;
    }
    const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    if (Ctor === Object)
      return true;
    return typeof Ctor == "function" && Function.toString.call(Ctor) === objectCtorString;
  }
  function each(obj, iter) {
    if (getArchtype(obj) === 0) {
      Reflect.ownKeys(obj).forEach((key) => {
        iter(key, obj[key], obj);
      });
    } else {
      obj.forEach((entry, index) => iter(index, entry, obj));
    }
  }
  function getArchtype(thing) {
    const state = thing[DRAFT_STATE];
    return state ? state.type_ : Array.isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
  }
  function has(thing, prop) {
    return getArchtype(thing) === 2 ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
  }
  function set(thing, propOrOldValue, value) {
    const t2 = getArchtype(thing);
    if (t2 === 2)
      thing.set(propOrOldValue, value);
    else if (t2 === 3) {
      thing.add(value);
    } else
      thing[propOrOldValue] = value;
  }
  function is(x2, y2) {
    if (x2 === y2) {
      return x2 !== 0 || 1 / x2 === 1 / y2;
    } else {
      return x2 !== x2 && y2 !== y2;
    }
  }
  function isMap(target) {
    return target instanceof Map;
  }
  function isSet(target) {
    return target instanceof Set;
  }
  function latest(state) {
    return state.copy_ || state.base_;
  }
  function shallowCopy(base, strict) {
    if (isMap(base)) {
      return new Map(base);
    }
    if (isSet(base)) {
      return new Set(base);
    }
    if (Array.isArray(base))
      return Array.prototype.slice.call(base);
    const isPlain = isPlainObject(base);
    if (strict === true || strict === "class_only" && !isPlain) {
      const descriptors = Object.getOwnPropertyDescriptors(base);
      delete descriptors[DRAFT_STATE];
      let keys = Reflect.ownKeys(descriptors);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const desc = descriptors[key];
        if (desc.writable === false) {
          desc.writable = true;
          desc.configurable = true;
        }
        if (desc.get || desc.set)
          descriptors[key] = {
            configurable: true,
            writable: true,
            // could live with !!desc.set as well here...
            enumerable: desc.enumerable,
            value: base[key]
          };
      }
      return Object.create(getPrototypeOf(base), descriptors);
    } else {
      const proto = getPrototypeOf(base);
      if (proto !== null && isPlain) {
        return { ...base };
      }
      const obj = Object.create(proto);
      return Object.assign(obj, base);
    }
  }
  function freeze(obj, deep = false) {
    if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
      return obj;
    if (getArchtype(obj) > 1) {
      obj.set = obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
    }
    Object.freeze(obj);
    if (deep)
      Object.entries(obj).forEach(([key, value]) => freeze(value, true));
    return obj;
  }
  function dontMutateFrozenCollections() {
    die(2);
  }
  function isFrozen(obj) {
    return Object.isFrozen(obj);
  }
  var plugins = {};
  function getPlugin(pluginKey) {
    const plugin = plugins[pluginKey];
    if (!plugin) {
      die(0, pluginKey);
    }
    return plugin;
  }
  var currentScope;
  function getCurrentScope() {
    return currentScope;
  }
  function createScope(parent_, immer_) {
    return {
      drafts_: [],
      parent_,
      immer_,
      // Whenever the modified draft contains a draft from another scope, we
      // need to prevent auto-freezing so the unowned draft can be finalized.
      canAutoFreeze_: true,
      unfinalizedDrafts_: 0
    };
  }
  function usePatchesInScope(scope, patchListener) {
    if (patchListener) {
      getPlugin("Patches");
      scope.patches_ = [];
      scope.inversePatches_ = [];
      scope.patchListener_ = patchListener;
    }
  }
  function revokeScope(scope) {
    leaveScope(scope);
    scope.drafts_.forEach(revokeDraft);
    scope.drafts_ = null;
  }
  function leaveScope(scope) {
    if (scope === currentScope) {
      currentScope = scope.parent_;
    }
  }
  function enterScope(immer2) {
    return currentScope = createScope(currentScope, immer2);
  }
  function revokeDraft(draft) {
    const state = draft[DRAFT_STATE];
    if (state.type_ === 0 || state.type_ === 1)
      state.revoke_();
    else
      state.revoked_ = true;
  }
  function processResult(result, scope) {
    scope.unfinalizedDrafts_ = scope.drafts_.length;
    const baseDraft = scope.drafts_[0];
    const isReplaced = result !== void 0 && result !== baseDraft;
    if (isReplaced) {
      if (baseDraft[DRAFT_STATE].modified_) {
        revokeScope(scope);
        die(4);
      }
      if (isDraftable(result)) {
        result = finalize(scope, result);
        if (!scope.parent_)
          maybeFreeze(scope, result);
      }
      if (scope.patches_) {
        getPlugin("Patches").generateReplacementPatches_(
          baseDraft[DRAFT_STATE].base_,
          result,
          scope.patches_,
          scope.inversePatches_
        );
      }
    } else {
      result = finalize(scope, baseDraft, []);
    }
    revokeScope(scope);
    if (scope.patches_) {
      scope.patchListener_(scope.patches_, scope.inversePatches_);
    }
    return result !== NOTHING ? result : void 0;
  }
  function finalize(rootScope, value, path) {
    if (isFrozen(value))
      return value;
    const state = value[DRAFT_STATE];
    if (!state) {
      each(
        value,
        (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path)
      );
      return value;
    }
    if (state.scope_ !== rootScope)
      return value;
    if (!state.modified_) {
      maybeFreeze(rootScope, state.base_, true);
      return state.base_;
    }
    if (!state.finalized_) {
      state.finalized_ = true;
      state.scope_.unfinalizedDrafts_--;
      const result = state.copy_;
      let resultEach = result;
      let isSet2 = false;
      if (state.type_ === 3) {
        resultEach = new Set(result);
        result.clear();
        isSet2 = true;
      }
      each(
        resultEach,
        (key, childValue) => finalizeProperty(rootScope, state, result, key, childValue, path, isSet2)
      );
      maybeFreeze(rootScope, result, false);
      if (path && rootScope.patches_) {
        getPlugin("Patches").generatePatches_(
          state,
          path,
          rootScope.patches_,
          rootScope.inversePatches_
        );
      }
    }
    return state.copy_;
  }
  function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
    if (isDraft(childValue)) {
      const path = rootPath && parentState && parentState.type_ !== 3 && // Set objects are atomic since they have no keys.
      !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
      const res = finalize(rootScope, childValue, path);
      set(targetObject, prop, res);
      if (isDraft(res)) {
        rootScope.canAutoFreeze_ = false;
      } else
        return;
    } else if (targetIsSet) {
      targetObject.add(childValue);
    }
    if (isDraftable(childValue) && !isFrozen(childValue)) {
      if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
        return;
      }
      finalize(rootScope, childValue);
      if ((!parentState || !parentState.scope_.parent_) && typeof prop !== "symbol" && Object.prototype.propertyIsEnumerable.call(targetObject, prop))
        maybeFreeze(rootScope, childValue);
    }
  }
  function maybeFreeze(scope, value, deep = false) {
    if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
      freeze(value, deep);
    }
  }
  function createProxyProxy(base, parent) {
    const isArray = Array.isArray(base);
    const state = {
      type_: isArray ? 1 : 0,
      // Track which produce call this is associated with.
      scope_: parent ? parent.scope_ : getCurrentScope(),
      // True for both shallow and deep changes.
      modified_: false,
      // Used during finalization.
      finalized_: false,
      // Track which properties have been assigned (true) or deleted (false).
      assigned_: {},
      // The parent draft state.
      parent_: parent,
      // The base state.
      base_: base,
      // The base proxy.
      draft_: null,
      // set below
      // The base copy with any updated values.
      copy_: null,
      // Called by the `produce` function.
      revoke_: null,
      isManual_: false
    };
    let target = state;
    let traps = objectTraps;
    if (isArray) {
      target = [state];
      traps = arrayTraps;
    }
    const { revoke, proxy } = Proxy.revocable(target, traps);
    state.draft_ = proxy;
    state.revoke_ = revoke;
    return proxy;
  }
  var objectTraps = {
    get(state, prop) {
      if (prop === DRAFT_STATE)
        return state;
      const source = latest(state);
      if (!has(source, prop)) {
        return readPropFromProto(state, source, prop);
      }
      const value = source[prop];
      if (state.finalized_ || !isDraftable(value)) {
        return value;
      }
      if (value === peek(state.base_, prop)) {
        prepareCopy(state);
        return state.copy_[prop] = createProxy(value, state);
      }
      return value;
    },
    has(state, prop) {
      return prop in latest(state);
    },
    ownKeys(state) {
      return Reflect.ownKeys(latest(state));
    },
    set(state, prop, value) {
      const desc = getDescriptorFromProto(latest(state), prop);
      if (desc == null ? void 0 : desc.set) {
        desc.set.call(state.draft_, value);
        return true;
      }
      if (!state.modified_) {
        const current2 = peek(latest(state), prop);
        const currentState = current2 == null ? void 0 : current2[DRAFT_STATE];
        if (currentState && currentState.base_ === value) {
          state.copy_[prop] = value;
          state.assigned_[prop] = false;
          return true;
        }
        if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
          return true;
        prepareCopy(state);
        markChanged(state);
      }
      if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
      (value !== void 0 || prop in state.copy_) || // special case: NaN
      Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
        return true;
      state.copy_[prop] = value;
      state.assigned_[prop] = true;
      return true;
    },
    deleteProperty(state, prop) {
      if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
        state.assigned_[prop] = false;
        prepareCopy(state);
        markChanged(state);
      } else {
        delete state.assigned_[prop];
      }
      if (state.copy_) {
        delete state.copy_[prop];
      }
      return true;
    },
    // Note: We never coerce `desc.value` into an Immer draft, because we can't make
    // the same guarantee in ES5 mode.
    getOwnPropertyDescriptor(state, prop) {
      const owner = latest(state);
      const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
      if (!desc)
        return desc;
      return {
        writable: true,
        configurable: state.type_ !== 1 || prop !== "length",
        enumerable: desc.enumerable,
        value: owner[prop]
      };
    },
    defineProperty() {
      die(11);
    },
    getPrototypeOf(state) {
      return getPrototypeOf(state.base_);
    },
    setPrototypeOf() {
      die(12);
    }
  };
  var arrayTraps = {};
  each(objectTraps, (key, fn) => {
    arrayTraps[key] = function() {
      arguments[0] = arguments[0][0];
      return fn.apply(this, arguments);
    };
  });
  arrayTraps.deleteProperty = function(state, prop) {
    return arrayTraps.set.call(this, state, prop, void 0);
  };
  arrayTraps.set = function(state, prop, value) {
    return objectTraps.set.call(this, state[0], prop, value, state[0]);
  };
  function peek(draft, prop) {
    const state = draft[DRAFT_STATE];
    const source = state ? latest(state) : draft;
    return source[prop];
  }
  function readPropFromProto(state, source, prop) {
    var _a;
    const desc = getDescriptorFromProto(source, prop);
    return desc ? `value` in desc ? desc.value : (
      // This is a very special case, if the prop is a getter defined by the
      // prototype, we should invoke it with the draft as context!
      (_a = desc.get) == null ? void 0 : _a.call(state.draft_)
    ) : void 0;
  }
  function getDescriptorFromProto(source, prop) {
    if (!(prop in source))
      return void 0;
    let proto = getPrototypeOf(source);
    while (proto) {
      const desc = Object.getOwnPropertyDescriptor(proto, prop);
      if (desc)
        return desc;
      proto = getPrototypeOf(proto);
    }
    return void 0;
  }
  function markChanged(state) {
    if (!state.modified_) {
      state.modified_ = true;
      if (state.parent_) {
        markChanged(state.parent_);
      }
    }
  }
  function prepareCopy(state) {
    if (!state.copy_) {
      state.copy_ = shallowCopy(
        state.base_,
        state.scope_.immer_.useStrictShallowCopy_
      );
    }
  }
  var Immer2 = class {
    constructor(config2) {
      this.autoFreeze_ = true;
      this.useStrictShallowCopy_ = false;
      this.produce = (base, recipe, patchListener) => {
        if (typeof base === "function" && typeof recipe !== "function") {
          const defaultBase = recipe;
          recipe = base;
          const self2 = this;
          return function curriedProduce(base2 = defaultBase, ...args) {
            return self2.produce(base2, (draft) => recipe.call(this, draft, ...args));
          };
        }
        if (typeof recipe !== "function")
          die(6);
        if (patchListener !== void 0 && typeof patchListener !== "function")
          die(7);
        let result;
        if (isDraftable(base)) {
          const scope = enterScope(this);
          const proxy = createProxy(base, void 0);
          let hasError = true;
          try {
            result = recipe(proxy);
            hasError = false;
          } finally {
            if (hasError)
              revokeScope(scope);
            else
              leaveScope(scope);
          }
          usePatchesInScope(scope, patchListener);
          return processResult(result, scope);
        } else if (!base || typeof base !== "object") {
          result = recipe(base);
          if (result === void 0)
            result = base;
          if (result === NOTHING)
            result = void 0;
          if (this.autoFreeze_)
            freeze(result, true);
          if (patchListener) {
            const p2 = [];
            const ip = [];
            getPlugin("Patches").generateReplacementPatches_(base, result, p2, ip);
            patchListener(p2, ip);
          }
          return result;
        } else
          die(1, base);
      };
      this.produceWithPatches = (base, recipe) => {
        if (typeof base === "function") {
          return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
        }
        let patches, inversePatches;
        const result = this.produce(base, recipe, (p2, ip) => {
          patches = p2;
          inversePatches = ip;
        });
        return [result, patches, inversePatches];
      };
      if (typeof (config2 == null ? void 0 : config2.autoFreeze) === "boolean")
        this.setAutoFreeze(config2.autoFreeze);
      if (typeof (config2 == null ? void 0 : config2.useStrictShallowCopy) === "boolean")
        this.setUseStrictShallowCopy(config2.useStrictShallowCopy);
    }
    createDraft(base) {
      if (!isDraftable(base))
        die(8);
      if (isDraft(base))
        base = current(base);
      const scope = enterScope(this);
      const proxy = createProxy(base, void 0);
      proxy[DRAFT_STATE].isManual_ = true;
      leaveScope(scope);
      return proxy;
    }
    finishDraft(draft, patchListener) {
      const state = draft && draft[DRAFT_STATE];
      if (!state || !state.isManual_)
        die(9);
      const { scope_: scope } = state;
      usePatchesInScope(scope, patchListener);
      return processResult(void 0, scope);
    }
    /**
     * Pass true to automatically freeze all copies created by Immer.
     *
     * By default, auto-freezing is enabled.
     */
    setAutoFreeze(value) {
      this.autoFreeze_ = value;
    }
    /**
     * Pass true to enable strict shallow copy.
     *
     * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
     */
    setUseStrictShallowCopy(value) {
      this.useStrictShallowCopy_ = value;
    }
    applyPatches(base, patches) {
      let i;
      for (i = patches.length - 1; i >= 0; i--) {
        const patch = patches[i];
        if (patch.path.length === 0 && patch.op === "replace") {
          base = patch.value;
          break;
        }
      }
      if (i > -1) {
        patches = patches.slice(i + 1);
      }
      const applyPatchesImpl = getPlugin("Patches").applyPatches_;
      if (isDraft(base)) {
        return applyPatchesImpl(base, patches);
      }
      return this.produce(
        base,
        (draft) => applyPatchesImpl(draft, patches)
      );
    }
  };
  function createProxy(value, parent) {
    const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
    const scope = parent ? parent.scope_ : getCurrentScope();
    scope.drafts_.push(draft);
    return draft;
  }
  function current(value) {
    if (!isDraft(value))
      die(10, value);
    return currentImpl(value);
  }
  function currentImpl(value) {
    if (!isDraftable(value) || isFrozen(value))
      return value;
    const state = value[DRAFT_STATE];
    let copy2;
    if (state) {
      if (!state.modified_)
        return state.base_;
      state.finalized_ = true;
      copy2 = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
    } else {
      copy2 = shallowCopy(value, true);
    }
    each(copy2, (key, childValue) => {
      set(copy2, key, currentImpl(childValue));
    });
    if (state) {
      state.finalized_ = false;
    }
    return copy2;
  }
  var immer = new Immer2();
  immer.produce;
  immer.produceWithPatches.bind(
    immer
  );
  immer.setAutoFreeze.bind(immer);
  immer.setUseStrictShallowCopy.bind(immer);
  immer.applyPatches.bind(immer);
  immer.createDraft.bind(immer);
  immer.finishDraft.bind(immer);
  function assertIsFunction(func, errorMessage = `expected a function, instead received ${typeof func}`) {
    if (typeof func !== "function") {
      throw new TypeError(errorMessage);
    }
  }
  function assertIsObject(object, errorMessage = `expected an object, instead received ${typeof object}`) {
    if (typeof object !== "object") {
      throw new TypeError(errorMessage);
    }
  }
  function assertIsArrayOfFunctions(array, errorMessage = `expected all items to be functions, instead received the following types: `) {
    if (!array.every((item) => typeof item === "function")) {
      const itemTypes = array.map(
        (item) => typeof item === "function" ? `function ${item.name || "unnamed"}()` : typeof item
      ).join(", ");
      throw new TypeError(`${errorMessage}[${itemTypes}]`);
    }
  }
  var ensureIsArray = (item) => {
    return Array.isArray(item) ? item : [item];
  };
  function getDependencies(createSelectorArgs) {
    const dependencies = Array.isArray(createSelectorArgs[0]) ? createSelectorArgs[0] : createSelectorArgs;
    assertIsArrayOfFunctions(
      dependencies,
      `createSelector expects all input-selectors to be functions, but received the following types: `
    );
    return dependencies;
  }
  function collectInputSelectorResults(dependencies, inputSelectorArgs) {
    const inputSelectorResults = [];
    const { length: length2 } = dependencies;
    for (let i = 0; i < length2; i++) {
      inputSelectorResults.push(dependencies[i].apply(null, inputSelectorArgs));
    }
    return inputSelectorResults;
  }
  var StrongRef = class {
    constructor(value) {
      this.value = value;
    }
    deref() {
      return this.value;
    }
  };
  var Ref = typeof WeakRef !== "undefined" ? WeakRef : StrongRef;
  var UNTERMINATED = 0;
  var TERMINATED = 1;
  function createCacheNode() {
    return {
      s: UNTERMINATED,
      v: void 0,
      o: null,
      p: null
    };
  }
  function weakMapMemoize(func, options = {}) {
    let fnNode = createCacheNode();
    const { resultEqualityCheck } = options;
    let lastResult;
    let resultsCount = 0;
    function memoized() {
      var _a;
      let cacheNode = fnNode;
      const { length: length2 } = arguments;
      for (let i = 0, l2 = length2; i < l2; i++) {
        const arg2 = arguments[i];
        if (typeof arg2 === "function" || typeof arg2 === "object" && arg2 !== null) {
          let objectCache = cacheNode.o;
          if (objectCache === null) {
            cacheNode.o = objectCache = /* @__PURE__ */ new WeakMap();
          }
          const objectNode = objectCache.get(arg2);
          if (objectNode === void 0) {
            cacheNode = createCacheNode();
            objectCache.set(arg2, cacheNode);
          } else {
            cacheNode = objectNode;
          }
        } else {
          let primitiveCache = cacheNode.p;
          if (primitiveCache === null) {
            cacheNode.p = primitiveCache = /* @__PURE__ */ new Map();
          }
          const primitiveNode = primitiveCache.get(arg2);
          if (primitiveNode === void 0) {
            cacheNode = createCacheNode();
            primitiveCache.set(arg2, cacheNode);
          } else {
            cacheNode = primitiveNode;
          }
        }
      }
      const terminatedNode = cacheNode;
      let result;
      if (cacheNode.s === TERMINATED) {
        result = cacheNode.v;
      } else {
        result = func.apply(null, arguments);
        resultsCount++;
        if (resultEqualityCheck) {
          const lastResultValue = ((_a = lastResult == null ? void 0 : lastResult.deref) == null ? void 0 : _a.call(lastResult)) ?? lastResult;
          if (lastResultValue != null && resultEqualityCheck(lastResultValue, result)) {
            result = lastResultValue;
            resultsCount !== 0 && resultsCount--;
          }
          const needsWeakRef = typeof result === "object" && result !== null || typeof result === "function";
          lastResult = needsWeakRef ? new Ref(result) : result;
        }
      }
      terminatedNode.s = TERMINATED;
      terminatedNode.v = result;
      return result;
    }
    memoized.clearCache = () => {
      fnNode = createCacheNode();
      memoized.resetResultsCount();
    };
    memoized.resultsCount = () => resultsCount;
    memoized.resetResultsCount = () => {
      resultsCount = 0;
    };
    return memoized;
  }
  function createSelectorCreator(memoizeOrOptions, ...memoizeOptionsFromArgs) {
    const createSelectorCreatorOptions = typeof memoizeOrOptions === "function" ? {
      memoize: memoizeOrOptions,
      memoizeOptions: memoizeOptionsFromArgs
    } : memoizeOrOptions;
    const createSelector2 = (...createSelectorArgs) => {
      let recomputations = 0;
      let dependencyRecomputations = 0;
      let lastResult;
      let directlyPassedOptions = {};
      let resultFunc = createSelectorArgs.pop();
      if (typeof resultFunc === "object") {
        directlyPassedOptions = resultFunc;
        resultFunc = createSelectorArgs.pop();
      }
      assertIsFunction(
        resultFunc,
        `createSelector expects an output function after the inputs, but received: [${typeof resultFunc}]`
      );
      const combinedOptions = {
        ...createSelectorCreatorOptions,
        ...directlyPassedOptions
      };
      const {
        memoize: memoize2,
        memoizeOptions = [],
        argsMemoize = weakMapMemoize,
        argsMemoizeOptions = [],
        devModeChecks = {}
      } = combinedOptions;
      const finalMemoizeOptions = ensureIsArray(memoizeOptions);
      const finalArgsMemoizeOptions = ensureIsArray(argsMemoizeOptions);
      const dependencies = getDependencies(createSelectorArgs);
      const memoizedResultFunc = memoize2(function recomputationWrapper() {
        recomputations++;
        return resultFunc.apply(
          null,
          arguments
        );
      }, ...finalMemoizeOptions);
      const selector = argsMemoize(function dependenciesChecker() {
        dependencyRecomputations++;
        const inputSelectorResults = collectInputSelectorResults(
          dependencies,
          arguments
        );
        lastResult = memoizedResultFunc.apply(null, inputSelectorResults);
        return lastResult;
      }, ...finalArgsMemoizeOptions);
      return Object.assign(selector, {
        resultFunc,
        memoizedResultFunc,
        dependencies,
        dependencyRecomputations: () => dependencyRecomputations,
        resetDependencyRecomputations: () => {
          dependencyRecomputations = 0;
        },
        lastResult: () => lastResult,
        recomputations: () => recomputations,
        resetRecomputations: () => {
          recomputations = 0;
        },
        memoize: memoize2,
        argsMemoize
      });
    };
    Object.assign(createSelector2, {
      withTypes: () => createSelector2
    });
    return createSelector2;
  }
  var createSelector = /* @__PURE__ */ createSelectorCreator(weakMapMemoize);
  var createStructuredSelector = Object.assign(
    (inputSelectorsObject, selectorCreator = createSelector) => {
      assertIsObject(
        inputSelectorsObject,
        `createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof inputSelectorsObject}`
      );
      const inputSelectorKeys = Object.keys(inputSelectorsObject);
      const dependencies = inputSelectorKeys.map(
        (key) => inputSelectorsObject[key]
      );
      const structuredSelector = selectorCreator(
        dependencies,
        (...inputSelectorResults) => {
          return inputSelectorResults.reduce((composition, value, index) => {
            composition[inputSelectorKeys[index]] = value;
            return composition;
          }, {});
        }
      );
      return structuredSelector;
    },
    { withTypes: () => createStructuredSelector }
  );
  function createThunkMiddleware(extraArgument) {
    const middleware2 = ({ dispatch, getState }) => (next2) => (action) => {
      if (typeof action === "function") {
        return action(dispatch, getState, extraArgument);
      }
      return next2(action);
    };
    return middleware2;
  }
  var thunk = createThunkMiddleware();
  var withExtraArgument = createThunkMiddleware;
  var composeWithDevTools = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
    if (arguments.length === 0) return void 0;
    if (typeof arguments[0] === "object") return compose;
    return compose.apply(null, arguments);
  };
  var Tuple = class _Tuple extends Array {
    constructor(...items) {
      super(...items);
      Object.setPrototypeOf(this, _Tuple.prototype);
    }
    static get [Symbol.species]() {
      return _Tuple;
    }
    concat(...arr) {
      return super.concat.apply(this, arr);
    }
    prepend(...arr) {
      if (arr.length === 1 && Array.isArray(arr[0])) {
        return new _Tuple(...arr[0].concat(this));
      }
      return new _Tuple(...arr.concat(this));
    }
  };
  function isBoolean(x2) {
    return typeof x2 === "boolean";
  }
  var buildGetDefaultMiddleware = () => function getDefaultMiddleware(options) {
    const {
      thunk: thunk$1 = true,
      immutableCheck = true,
      serializableCheck = true,
      actionCreatorCheck = true
    } = options ?? {};
    let middlewareArray = new Tuple();
    if (thunk$1) {
      if (isBoolean(thunk$1)) {
        middlewareArray.push(thunk);
      } else {
        middlewareArray.push(withExtraArgument(thunk$1.extraArgument));
      }
    }
    return middlewareArray;
  };
  var SHOULD_AUTOBATCH = "RTK_autoBatch";
  var createQueueWithTimer = (timeout) => {
    return (notify) => {
      setTimeout(notify, timeout);
    };
  };
  var rAF = typeof window !== "undefined" && window.requestAnimationFrame ? window.requestAnimationFrame : createQueueWithTimer(10);
  var autoBatchEnhancer = (options = {
    type: "raf"
  }) => (next2) => (...args) => {
    const store2 = next2(...args);
    let notifying = true;
    let shouldNotifyAtEndOfTick = false;
    let notificationQueued = false;
    const listeners = /* @__PURE__ */ new Set();
    const queueCallback = options.type === "tick" ? queueMicrotask : options.type === "raf" ? rAF : options.type === "callback" ? options.queueNotification : createQueueWithTimer(options.timeout);
    const notifyListeners = () => {
      notificationQueued = false;
      if (shouldNotifyAtEndOfTick) {
        shouldNotifyAtEndOfTick = false;
        listeners.forEach((l2) => l2());
      }
    };
    return Object.assign({}, store2, {
      // Override the base `store.subscribe` method to keep original listeners
      // from running if we're delaying notifications
      subscribe(listener2) {
        const wrappedListener = () => notifying && listener2();
        const unsubscribe = store2.subscribe(wrappedListener);
        listeners.add(listener2);
        return () => {
          unsubscribe();
          listeners.delete(listener2);
        };
      },
      // Override the base `store.dispatch` method so that we can check actions
      // for the `shouldAutoBatch` flag and determine if batching is active
      dispatch(action) {
        var _a;
        try {
          notifying = !((_a = action == null ? void 0 : action.meta) == null ? void 0 : _a[SHOULD_AUTOBATCH]);
          shouldNotifyAtEndOfTick = !notifying;
          if (shouldNotifyAtEndOfTick) {
            if (!notificationQueued) {
              notificationQueued = true;
              queueCallback(notifyListeners);
            }
          }
          return store2.dispatch(action);
        } finally {
          notifying = true;
        }
      }
    });
  };
  var buildGetDefaultEnhancers = (middlewareEnhancer) => function getDefaultEnhancers(options) {
    const {
      autoBatch = true
    } = options ?? {};
    let enhancerArray = new Tuple(middlewareEnhancer);
    if (autoBatch) {
      enhancerArray.push(autoBatchEnhancer(typeof autoBatch === "object" ? autoBatch : void 0));
    }
    return enhancerArray;
  };
  function configureStore(options) {
    const getDefaultMiddleware = buildGetDefaultMiddleware();
    const {
      reducer = void 0,
      middleware: middleware2,
      devTools = true,
      preloadedState = void 0,
      enhancers = void 0
    } = options || {};
    let rootReducer;
    if (typeof reducer === "function") {
      rootReducer = reducer;
    } else if (isPlainObject$1(reducer)) {
      rootReducer = combineReducers(reducer);
    } else {
      throw new Error(formatProdErrorMessage(1));
    }
    let finalMiddleware;
    if (typeof middleware2 === "function") {
      finalMiddleware = middleware2(getDefaultMiddleware);
    } else {
      finalMiddleware = getDefaultMiddleware();
    }
    let finalCompose = compose;
    if (devTools) {
      finalCompose = composeWithDevTools({
        // Enable capture of stack traces for dispatched Redux actions
        trace: false,
        ...typeof devTools === "object" && devTools
      });
    }
    const middlewareEnhancer = applyMiddleware(...finalMiddleware);
    const getDefaultEnhancers = buildGetDefaultEnhancers(middlewareEnhancer);
    let storeEnhancers = typeof enhancers === "function" ? enhancers(getDefaultEnhancers) : getDefaultEnhancers();
    const composedEnhancer = finalCompose(...storeEnhancers);
    return createStore(rootReducer, preloadedState, composedEnhancer);
  }
  function formatProdErrorMessage(code) {
    return `Minified Redux Toolkit error #${code}; visit https://redux-toolkit.js.org/Errors?code=${code} for the full message or use the non-minified dev environment for full errors. `;
  }
  const store = configureStore({
    reducer: {}
  });
  var useSyncExternalStoreWithSelector_production_min = {};
  /**
   * @license React
   * use-sync-external-store-with-selector.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var g = reactExports;
  function n(a, b2) {
    return a === b2 && (0 !== a || 1 / a === 1 / b2) || a !== a && b2 !== b2;
  }
  var p = "function" === typeof Object.is ? Object.is : n, q = g.useSyncExternalStore, r = g.useRef, t = g.useEffect, u = g.useMemo, v = g.useDebugValue;
  useSyncExternalStoreWithSelector_production_min.useSyncExternalStoreWithSelector = function(a, b2, e2, l2, h2) {
    var c2 = r(null);
    if (null === c2.current) {
      var f2 = { hasValue: false, value: null };
      c2.current = f2;
    } else f2 = c2.current;
    c2 = u(function() {
      function a2(a3) {
        if (!c3) {
          c3 = true;
          d3 = a3;
          a3 = l2(a3);
          if (void 0 !== h2 && f2.hasValue) {
            var b3 = f2.value;
            if (h2(b3, a3)) return k2 = b3;
          }
          return k2 = a3;
        }
        b3 = k2;
        if (p(d3, a3)) return b3;
        var e3 = l2(a3);
        if (void 0 !== h2 && h2(b3, e3)) return b3;
        d3 = a3;
        return k2 = e3;
      }
      var c3 = false, d3, k2, m2 = void 0 === e2 ? null : e2;
      return [function() {
        return a2(b2());
      }, null === m2 ? void 0 : function() {
        return a2(m2());
      }];
    }, [b2, e2, l2, h2]);
    var d2 = q(a, c2[0], c2[1]);
    t(function() {
      f2.hasValue = true;
      f2.value = d2;
    }, [d2]);
    v(d2);
    return d2;
  };
  var React = (
    // prettier-ignore
    // @ts-ignore
    "default" in ReactOriginal ? React$1 : ReactOriginal
  );
  var ContextKey = Symbol.for(`react-redux-context`);
  var gT = typeof globalThis !== "undefined" ? globalThis : (
    /* fall back to a per-module scope (pre-8.1 behaviour) if `globalThis` is not available */
    {}
  );
  function getContext() {
    if (!React.createContext)
      return {};
    const contextMap = gT[ContextKey] ?? (gT[ContextKey] = /* @__PURE__ */ new Map());
    let realContext = contextMap.get(React.createContext);
    if (!realContext) {
      realContext = React.createContext(
        null
      );
      contextMap.set(React.createContext, realContext);
    }
    return realContext;
  }
  var ReactReduxContext = /* @__PURE__ */ getContext();
  function defaultNoopBatch(callback) {
    callback();
  }
  function createListenerCollection() {
    let first = null;
    let last = null;
    return {
      clear() {
        first = null;
        last = null;
      },
      notify() {
        defaultNoopBatch(() => {
          let listener = first;
          while (listener) {
            listener.callback();
            listener = listener.next;
          }
        });
      },
      get() {
        const listeners = [];
        let listener = first;
        while (listener) {
          listeners.push(listener);
          listener = listener.next;
        }
        return listeners;
      },
      subscribe(callback) {
        let isSubscribed = true;
        const listener = last = {
          callback,
          next: null,
          prev: last
        };
        if (listener.prev) {
          listener.prev.next = listener;
        } else {
          first = listener;
        }
        return function unsubscribe() {
          if (!isSubscribed || first === null)
            return;
          isSubscribed = false;
          if (listener.next) {
            listener.next.prev = listener.prev;
          } else {
            last = listener.prev;
          }
          if (listener.prev) {
            listener.prev.next = listener.next;
          } else {
            first = listener.next;
          }
        };
      }
    };
  }
  var nullListeners = {
    notify() {
    },
    get: () => []
  };
  function createSubscription(store2, parentSub) {
    let unsubscribe;
    let listeners = nullListeners;
    let subscriptionsAmount = 0;
    let selfSubscribed = false;
    function addNestedSub(listener) {
      trySubscribe();
      const cleanupListener = listeners.subscribe(listener);
      let removed = false;
      return () => {
        if (!removed) {
          removed = true;
          cleanupListener();
          tryUnsubscribe();
        }
      };
    }
    function notifyNestedSubs() {
      listeners.notify();
    }
    function handleChangeWrapper() {
      if (subscription.onStateChange) {
        subscription.onStateChange();
      }
    }
    function isSubscribed() {
      return selfSubscribed;
    }
    function trySubscribe() {
      subscriptionsAmount++;
      if (!unsubscribe) {
        unsubscribe = store2.subscribe(handleChangeWrapper);
        listeners = createListenerCollection();
      }
    }
    function tryUnsubscribe() {
      subscriptionsAmount--;
      if (unsubscribe && subscriptionsAmount === 0) {
        unsubscribe();
        unsubscribe = void 0;
        listeners.clear();
        listeners = nullListeners;
      }
    }
    function trySubscribeSelf() {
      if (!selfSubscribed) {
        selfSubscribed = true;
        trySubscribe();
      }
    }
    function tryUnsubscribeSelf() {
      if (selfSubscribed) {
        selfSubscribed = false;
        tryUnsubscribe();
      }
    }
    const subscription = {
      addNestedSub,
      notifyNestedSubs,
      handleChangeWrapper,
      isSubscribed,
      trySubscribe: trySubscribeSelf,
      tryUnsubscribe: tryUnsubscribeSelf,
      getListeners: () => listeners
    };
    return subscription;
  }
  var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
  var isReactNative = typeof navigator !== "undefined" && navigator.product === "ReactNative";
  var useIsomorphicLayoutEffect = canUseDOM || isReactNative ? React.useLayoutEffect : React.useEffect;
  function Provider({
    store: store2,
    context,
    children,
    serverState,
    stabilityCheck = "once",
    identityFunctionCheck = "once"
  }) {
    const contextValue = React.useMemo(() => {
      const subscription = createSubscription(store2);
      return {
        store: store2,
        subscription,
        getServerState: serverState ? () => serverState : void 0,
        stabilityCheck,
        identityFunctionCheck
      };
    }, [store2, serverState, stabilityCheck, identityFunctionCheck]);
    const previousState = React.useMemo(() => store2.getState(), [store2]);
    useIsomorphicLayoutEffect(() => {
      const { subscription } = contextValue;
      subscription.onStateChange = subscription.notifyNestedSubs;
      subscription.trySubscribe();
      if (previousState !== store2.getState()) {
        subscription.notifyNestedSubs();
      }
      return () => {
        subscription.tryUnsubscribe();
        subscription.onStateChange = void 0;
      };
    }, [contextValue, previousState]);
    const Context = context || ReactReduxContext;
    return /* @__PURE__ */ React.createElement(Context.Provider, { value: contextValue }, children);
  }
  var Provider_default = Provider;
  async function main() {
    const link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.href = "https://use.fontawesome.com/releases/v5.15.4/css/all.css";
    document.head.appendChild(link2);
    const googleFontLink = document.createElement("link");
    googleFontLink.rel = "stylesheet";
    googleFontLink.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap";
    document.head.appendChild(googleFontLink);
    const mobileHeader = await awaitElement("#mobile-header");
    const topMenuMobMenu = document.querySelector("#top-menu-mobmenu");
    if (mobileHeader && topMenuMobMenu) {
      const buttonContainer = document.createElement("div");
      buttonContainer.style.float = "right";
      mobileHeader.insertBefore(buttonContainer, topMenuMobMenu);
      const root = createRoot(buttonContainer);
      root.render(
        /* @__PURE__ */ React$1.createElement(Provider_default, { store }, /* @__PURE__ */ React$1.createElement(App, null))
      );
    }
  }
  addLocationChangeCallback(() => {
    main().catch((e2) => {
      console.error("Error loading main function:", e2);
    });
  });
})();
;
(function(){
                    const el = document.createElement("style");
                    el.innerText = "";
                    el.type = "text/css";
                    document.head.appendChild(el);
                })();