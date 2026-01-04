// ==UserScript==
// @name     tw2tools
// @namespace https://greasyfork.org/pt-BR/scripts/496485-tw2tools
// @version  2.1
// @description A sample userscript built using react
// @include https://*.tribalwars2.com/*
// @grant    none
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/496485/tw2tools.user.js
// @updateURL https://update.greasyfork.org/scripts/496485/tw2tools.meta.js
// ==/UserScript==

function loadTimeHelper() {
    if (typeof require !== "undefined") {
        require(["helper/time"], function (time) {
            console.log("Módulo time carregado:", time);
            const gameTime = time.gameTime();
            console.log("Hora no jogo, agora", gameTime);
            window.timeHelper = time;
        });
    } else {
        console.error("RequireJS não está disponível na página.");
    }
}

var timeHelperFound = false;

window.addEventListener('load', function() {
    var intervalId = setInterval(function(){
        if(!timeHelperFound){
            loadTimeHelper();
            if (window.timeHelper) {
                timeHelperFound = true;
                clearInterval(intervalId); // Stop the interval when timeHelper is found
            }
        }
    }, 1000); // Run this every 1 second
});

(function() {
  "use strict";
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
  var l = Symbol.for("react.element"), n = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r$1 = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u$1 = Symbol.for("react.context"), v$2 = Symbol.for("react.forward_ref"), w$1 = Symbol.for("react.suspense"), x$1 = Symbol.for("react.memo"), y$1 = Symbol.for("react.lazy"), z$2 = Symbol.iterator;
  function A$2(a) {
    if (null === a || "object" !== typeof a)
      return null;
    a = z$2 && a[z$2] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  var B$2 = { isMounted: function() {
    return false;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, C$2 = Object.assign, D$2 = {};
  function E$2(a, b2, e) {
    this.props = a;
    this.context = b2;
    this.refs = D$2;
    this.updater = e || B$2;
  }
  E$2.prototype.isReactComponent = {};
  E$2.prototype.setState = function(a, b2) {
    if ("object" !== typeof a && "function" !== typeof a && null != a)
      throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, b2, "setState");
  };
  E$2.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
  };
  function F() {
  }
  F.prototype = E$2.prototype;
  function G$1(a, b2, e) {
    this.props = a;
    this.context = b2;
    this.refs = D$2;
    this.updater = e || B$2;
  }
  var H$2 = G$1.prototype = new F();
  H$2.constructor = G$1;
  C$2(H$2, E$2.prototype);
  H$2.isPureReactComponent = true;
  var I$2 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$2 = { key: true, ref: true, __self: true, __source: true };
  function M$2(a, b2, e) {
    var d2, c2 = {}, k2 = null, h2 = null;
    if (null != b2)
      for (d2 in void 0 !== b2.ref && (h2 = b2.ref), void 0 !== b2.key && (k2 = "" + b2.key), b2)
        J.call(b2, d2) && !L$2.hasOwnProperty(d2) && (c2[d2] = b2[d2]);
    var g2 = arguments.length - 2;
    if (1 === g2)
      c2.children = e;
    else if (1 < g2) {
      for (var f2 = Array(g2), m2 = 0; m2 < g2; m2++)
        f2[m2] = arguments[m2 + 2];
      c2.children = f2;
    }
    if (a && a.defaultProps)
      for (d2 in g2 = a.defaultProps, g2)
        void 0 === c2[d2] && (c2[d2] = g2[d2]);
    return { $$typeof: l, type: a, key: k2, ref: h2, props: c2, _owner: K$1.current };
  }
  function N$2(a, b2) {
    return { $$typeof: l, type: a.type, key: b2, ref: a.ref, props: a.props, _owner: a._owner };
  }
  function O$2(a) {
    return "object" === typeof a && null !== a && a.$$typeof === l;
  }
  function escape(a) {
    var b2 = { "=": "=0", ":": "=2" };
    return "$" + a.replace(/[=:]/g, function(a2) {
      return b2[a2];
    });
  }
  var P$2 = /\/+/g;
  function Q$2(a, b2) {
    return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b2.toString(36);
  }
  function R$2(a, b2, e, d2, c2) {
    var k2 = typeof a;
    if ("undefined" === k2 || "boolean" === k2)
      a = null;
    var h2 = false;
    if (null === a)
      h2 = true;
    else
      switch (k2) {
        case "string":
        case "number":
          h2 = true;
          break;
        case "object":
          switch (a.$$typeof) {
            case l:
            case n:
              h2 = true;
          }
      }
    if (h2)
      return h2 = a, c2 = c2(h2), a = "" === d2 ? "." + Q$2(h2, 0) : d2, I$2(c2) ? (e = "", null != a && (e = a.replace(P$2, "$&/") + "/"), R$2(c2, b2, e, "", function(a2) {
        return a2;
      })) : null != c2 && (O$2(c2) && (c2 = N$2(c2, e + (!c2.key || h2 && h2.key === c2.key ? "" : ("" + c2.key).replace(P$2, "$&/") + "/") + a)), b2.push(c2)), 1;
    h2 = 0;
    d2 = "" === d2 ? "." : d2 + ":";
    if (I$2(a))
      for (var g2 = 0; g2 < a.length; g2++) {
        k2 = a[g2];
        var f2 = d2 + Q$2(k2, g2);
        h2 += R$2(k2, b2, e, f2, c2);
      }
    else if (f2 = A$2(a), "function" === typeof f2)
      for (a = f2.call(a), g2 = 0; !(k2 = a.next()).done; )
        k2 = k2.value, f2 = d2 + Q$2(k2, g2++), h2 += R$2(k2, b2, e, f2, c2);
    else if ("object" === k2)
      throw b2 = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b2 ? "object with keys {" + Object.keys(a).join(", ") + "}" : b2) + "). If you meant to render a collection of children, use an array instead.");
    return h2;
  }
  function S$2(a, b2, e) {
    if (null == a)
      return a;
    var d2 = [], c2 = 0;
    R$2(a, d2, "", "", function(a2) {
      return b2.call(e, a2, c2++);
    });
    return d2;
  }
  function T$2(a) {
    if (-1 === a._status) {
      var b2 = a._result;
      b2 = b2();
      b2.then(function(b3) {
        if (0 === a._status || -1 === a._status)
          a._status = 1, a._result = b3;
      }, function(b3) {
        if (0 === a._status || -1 === a._status)
          a._status = 2, a._result = b3;
      });
      -1 === a._status && (a._status = 0, a._result = b2);
    }
    if (1 === a._status)
      return a._result.default;
    throw a._result;
  }
  var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
  function X$1() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  react_production_min.Children = { map: S$2, forEach: function(a, b2, e) {
    S$2(a, function() {
      b2.apply(this, arguments);
    }, e);
  }, count: function(a) {
    var b2 = 0;
    S$2(a, function() {
      b2++;
    });
    return b2;
  }, toArray: function(a) {
    return S$2(a, function(a2) {
      return a2;
    }) || [];
  }, only: function(a) {
    if (!O$2(a))
      throw Error("React.Children.only expected to receive a single React element child.");
    return a;
  } };
  react_production_min.Component = E$2;
  react_production_min.Fragment = p$2;
  react_production_min.Profiler = r$1;
  react_production_min.PureComponent = G$1;
  react_production_min.StrictMode = q$1;
  react_production_min.Suspense = w$1;
  react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
  react_production_min.act = X$1;
  react_production_min.cloneElement = function(a, b2, e) {
    if (null === a || void 0 === a)
      throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
    var d2 = C$2({}, a.props), c2 = a.key, k2 = a.ref, h2 = a._owner;
    if (null != b2) {
      void 0 !== b2.ref && (k2 = b2.ref, h2 = K$1.current);
      void 0 !== b2.key && (c2 = "" + b2.key);
      if (a.type && a.type.defaultProps)
        var g2 = a.type.defaultProps;
      for (f2 in b2)
        J.call(b2, f2) && !L$2.hasOwnProperty(f2) && (d2[f2] = void 0 === b2[f2] && void 0 !== g2 ? g2[f2] : b2[f2]);
    }
    var f2 = arguments.length - 2;
    if (1 === f2)
      d2.children = e;
    else if (1 < f2) {
      g2 = Array(f2);
      for (var m2 = 0; m2 < f2; m2++)
        g2[m2] = arguments[m2 + 2];
      d2.children = g2;
    }
    return { $$typeof: l, type: a.type, key: c2, ref: k2, props: d2, _owner: h2 };
  };
  react_production_min.createContext = function(a) {
    a = { $$typeof: u$1, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
    a.Provider = { $$typeof: t, _context: a };
    return a.Consumer = a;
  };
  react_production_min.createElement = M$2;
  react_production_min.createFactory = function(a) {
    var b2 = M$2.bind(null, a);
    b2.type = a;
    return b2;
  };
  react_production_min.createRef = function() {
    return { current: null };
  };
  react_production_min.forwardRef = function(a) {
    return { $$typeof: v$2, render: a };
  };
  react_production_min.isValidElement = O$2;
  react_production_min.lazy = function(a) {
    return { $$typeof: y$1, _payload: { _status: -1, _result: a }, _init: T$2 };
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
  react_production_min.useImperativeHandle = function(a, b2, e) {
    return U$1.current.useImperativeHandle(a, b2, e);
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
  react_production_min.useReducer = function(a, b2, e) {
    return U$1.current.useReducer(a, b2, e);
  };
  react_production_min.useRef = function(a) {
    return U$1.current.useRef(a);
  };
  react_production_min.useState = function(a) {
    return U$1.current.useState(a);
  };
  react_production_min.useSyncExternalStore = function(a, b2, e) {
    return U$1.current.useSyncExternalStore(a, b2, e);
  };
  react_production_min.useTransition = function() {
    return U$1.current.useTransition();
  };
  react_production_min.version = "18.3.1";
  {
    react.exports = react_production_min;
  }
  var reactExports = react.exports;
  const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
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
      a:
        for (; 0 < c2; ) {
          var d2 = c2 - 1 >>> 1, e = a[d2];
          if (0 < g2(e, b2))
            a[d2] = b2, a[c2] = e, c2 = d2;
          else
            break a;
        }
    }
    function h2(a) {
      return 0 === a.length ? null : a[0];
    }
    function k2(a) {
      if (0 === a.length)
        return null;
      var b2 = a[0], c2 = a.pop();
      if (c2 !== b2) {
        a[0] = c2;
        a:
          for (var d2 = 0, e = a.length, w2 = e >>> 1; d2 < w2; ) {
            var m2 = 2 * (d2 + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
            if (0 > g2(C2, c2))
              n2 < e && 0 > g2(x2, C2) ? (a[d2] = x2, a[n2] = c2, d2 = n2) : (a[d2] = C2, a[m2] = c2, d2 = m2);
            else if (n2 < e && 0 > g2(x2, c2))
              a[d2] = x2, a[n2] = c2, d2 = n2;
            else
              break a;
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
        if (null === b2.callback)
          k2(t2);
        else if (b2.startTime <= a)
          k2(t2), b2.sortIndex = b2.expirationTime, f2(r2, b2);
        else
          break;
        b2 = h2(t2);
      }
    }
    function H2(a) {
      B2 = false;
      G2(a);
      if (!A2)
        if (null !== h2(r2))
          A2 = true, I2(J2);
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
            var e = d2(v2.expirationTime <= b2);
            b2 = exports.unstable_now();
            "function" === typeof e ? v2.callback = e : v2 === h2(r2) && k2(r2);
            G2(b2);
          } else
            k2(r2);
          v2 = h2(r2);
        }
        if (null !== v2)
          var w2 = true;
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
      } else
        N2 = false;
    }
    var S2;
    if ("function" === typeof F2)
      S2 = function() {
        F2(R2);
      };
    else if ("undefined" !== typeof MessageChannel) {
      var T2 = new MessageChannel(), U2 = T2.port2;
      T2.port1.onmessage = R2;
      S2 = function() {
        U2.postMessage(null);
      };
    } else
      S2 = function() {
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
          var e = -1;
          break;
        case 2:
          e = 250;
          break;
        case 5:
          e = 1073741823;
          break;
        case 4:
          e = 1e4;
          break;
        default:
          e = 5e3;
      }
      e = c2 + e;
      a = { id: u2++, callback: b2, priorityLevel: a, startTime: c2, expirationTime: e, sortIndex: -1 };
      c2 > d2 ? (a.sortIndex = c2, f2(t2, a), null === h2(r2) && a === h2(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c2 - d2))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
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
  function p$1(a) {
    for (var b2 = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c2 = 1; c2 < arguments.length; c2++)
      b2 += "&args[]=" + encodeURIComponent(arguments[c2]);
    return "Minified React error #" + a + "; visit " + b2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var da = /* @__PURE__ */ new Set(), ea = {};
  function fa(a, b2) {
    ha(a, b2);
    ha(a + "Capture", b2);
  }
  function ha(a, b2) {
    ea[a] = b2;
    for (a = 0; a < b2.length; a++)
      da.add(b2[a]);
  }
  var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
  function oa(a) {
    if (ja.call(ma, a))
      return true;
    if (ja.call(la, a))
      return false;
    if (ka.test(a))
      return ma[a] = true;
    la[a] = true;
    return false;
  }
  function pa(a, b2, c2, d2) {
    if (null !== c2 && 0 === c2.type)
      return false;
    switch (typeof b2) {
      case "function":
      case "symbol":
        return true;
      case "boolean":
        if (d2)
          return false;
        if (null !== c2)
          return !c2.acceptsBooleans;
        a = a.toLowerCase().slice(0, 5);
        return "data-" !== a && "aria-" !== a;
      default:
        return false;
    }
  }
  function qa(a, b2, c2, d2) {
    if (null === b2 || "undefined" === typeof b2 || pa(a, b2, c2, d2))
      return true;
    if (d2)
      return false;
    if (null !== c2)
      switch (c2.type) {
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
  function v$1(a, b2, c2, d2, e, f2, g2) {
    this.acceptsBooleans = 2 === b2 || 3 === b2 || 4 === b2;
    this.attributeName = d2;
    this.attributeNamespace = e;
    this.mustUseProperty = c2;
    this.propertyName = a;
    this.type = b2;
    this.sanitizeURL = f2;
    this.removeEmptyString = g2;
  }
  var z$1 = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
    z$1[a] = new v$1(a, 0, false, a, null, false, false);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
    var b2 = a[0];
    z$1[b2] = new v$1(b2, 1, false, a[1], null, false, false);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
    z$1[a] = new v$1(a, 2, false, a.toLowerCase(), null, false, false);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
    z$1[a] = new v$1(a, 2, false, a, null, false, false);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
    z$1[a] = new v$1(a, 3, false, a.toLowerCase(), null, false, false);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function(a) {
    z$1[a] = new v$1(a, 3, true, a, null, false, false);
  });
  ["capture", "download"].forEach(function(a) {
    z$1[a] = new v$1(a, 4, false, a, null, false, false);
  });
  ["cols", "rows", "size", "span"].forEach(function(a) {
    z$1[a] = new v$1(a, 6, false, a, null, false, false);
  });
  ["rowSpan", "start"].forEach(function(a) {
    z$1[a] = new v$1(a, 5, false, a.toLowerCase(), null, false, false);
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
    z$1[b2] = new v$1(b2, 1, false, a, null, false, false);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
    var b2 = a.replace(ra, sa);
    z$1[b2] = new v$1(b2, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
    var b2 = a.replace(ra, sa);
    z$1[b2] = new v$1(b2, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
  });
  ["tabIndex", "crossOrigin"].forEach(function(a) {
    z$1[a] = new v$1(a, 1, false, a.toLowerCase(), null, false, false);
  });
  z$1.xlinkHref = new v$1("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
  ["src", "href", "action", "formAction"].forEach(function(a) {
    z$1[a] = new v$1(a, 1, false, a.toLowerCase(), null, true, true);
  });
  function ta(a, b2, c2, d2) {
    var e = z$1.hasOwnProperty(b2) ? z$1[b2] : null;
    if (null !== e ? 0 !== e.type : d2 || !(2 < b2.length) || "o" !== b2[0] && "O" !== b2[0] || "n" !== b2[1] && "N" !== b2[1])
      qa(b2, c2, e, d2) && (c2 = null), d2 || null === e ? oa(b2) && (null === c2 ? a.removeAttribute(b2) : a.setAttribute(b2, "" + c2)) : e.mustUseProperty ? a[e.propertyName] = null === c2 ? 3 === e.type ? false : "" : c2 : (b2 = e.attributeName, d2 = e.attributeNamespace, null === c2 ? a.removeAttribute(b2) : (e = e.type, c2 = 3 === e || 4 === e && true === c2 ? "" : "" + c2, d2 ? a.setAttributeNS(d2, b2, c2) : a.setAttribute(b2, c2)));
  }
  var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
  var Ia = Symbol.for("react.offscreen");
  var Ja = Symbol.iterator;
  function Ka(a) {
    if (null === a || "object" !== typeof a)
      return null;
    a = Ja && a[Ja] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  var A$1 = Object.assign, La;
  function Ma(a) {
    if (void 0 === La)
      try {
        throw Error();
      } catch (c2) {
        var b2 = c2.stack.trim().match(/\n( *(at )?)/);
        La = b2 && b2[1] || "";
      }
    return "\n" + La + a;
  }
  var Na = false;
  function Oa(a, b2) {
    if (!a || Na)
      return "";
    Na = true;
    var c2 = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (b2)
        if (b2 = function() {
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
        for (var e = l2.stack.split("\n"), f2 = d2.stack.split("\n"), g2 = e.length - 1, h2 = f2.length - 1; 1 <= g2 && 0 <= h2 && e[g2] !== f2[h2]; )
          h2--;
        for (; 1 <= g2 && 0 <= h2; g2--, h2--)
          if (e[g2] !== f2[h2]) {
            if (1 !== g2 || 1 !== h2) {
              do
                if (g2--, h2--, 0 > h2 || e[g2] !== f2[h2]) {
                  var k2 = "\n" + e[g2].replace(" at new ", " at ");
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
    if (null == a)
      return null;
    if ("function" === typeof a)
      return a.displayName || a.name || null;
    if ("string" === typeof a)
      return a;
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
    if ("object" === typeof a)
      switch (a.$$typeof) {
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
        if ("function" === typeof b2)
          return b2.displayName || b2.name || null;
        if ("string" === typeof b2)
          return b2;
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
      var e = c2.get, f2 = c2.set;
      Object.defineProperty(a, b2, { configurable: true, get: function() {
        return e.call(this);
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
    if (!a)
      return false;
    var b2 = a._valueTracker;
    if (!b2)
      return true;
    var c2 = b2.getValue();
    var d2 = "";
    a && (d2 = Ta(a) ? a.checked ? "true" : "false" : a.value);
    a = d2;
    return a !== c2 ? (b2.setValue(a), true) : false;
  }
  function Xa(a) {
    a = a || ("undefined" !== typeof document ? document : void 0);
    if ("undefined" === typeof a)
      return null;
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
    if (null != c2)
      if ("number" === d2) {
        if (0 === c2 && "" === a.value || a.value != c2)
          a.value = "" + c2;
      } else
        a.value !== "" + c2 && (a.value = "" + c2);
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
      if (!("submit" !== d2 && "reset" !== d2 || void 0 !== b2.value && null !== b2.value))
        return;
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
    if ("number" !== b2 || Xa(a.ownerDocument) !== a)
      null == c2 ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c2 && (a.defaultValue = "" + c2);
  }
  var eb = Array.isArray;
  function fb(a, b2, c2, d2) {
    a = a.options;
    if (b2) {
      b2 = {};
      for (var e = 0; e < c2.length; e++)
        b2["$" + c2[e]] = true;
      for (c2 = 0; c2 < a.length; c2++)
        e = b2.hasOwnProperty("$" + a[c2].value), a[c2].selected !== e && (a[c2].selected = e), e && d2 && (a[c2].defaultSelected = true);
    } else {
      c2 = "" + Sa(c2);
      b2 = null;
      for (e = 0; e < a.length; e++) {
        if (a[e].value === c2) {
          a[e].selected = true;
          d2 && (a[e].defaultSelected = true);
          return;
        }
        null !== b2 || a[e].disabled || (b2 = a[e]);
      }
      null !== b2 && (b2.selected = true);
    }
  }
  function gb(a, b2) {
    if (null != b2.dangerouslySetInnerHTML)
      throw Error(p$1(91));
    return A$1({}, b2, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
  }
  function hb(a, b2) {
    var c2 = b2.value;
    if (null == c2) {
      c2 = b2.children;
      b2 = b2.defaultValue;
      if (null != c2) {
        if (null != b2)
          throw Error(p$1(92));
        if (eb(c2)) {
          if (1 < c2.length)
            throw Error(p$1(93));
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
    return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b2, c2, d2, e) {
      MSApp.execUnsafeLocalFunction(function() {
        return a(b2, c2, d2, e);
      });
    } : a;
  }(function(a, b2) {
    if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a)
      a.innerHTML = b2;
    else {
      mb = mb || document.createElement("div");
      mb.innerHTML = "<svg>" + b2.valueOf().toString() + "</svg>";
      for (b2 = mb.firstChild; a.firstChild; )
        a.removeChild(a.firstChild);
      for (; b2.firstChild; )
        a.appendChild(b2.firstChild);
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
    for (var c2 in b2)
      if (b2.hasOwnProperty(c2)) {
        var d2 = 0 === c2.indexOf("--"), e = rb(c2, b2[c2], d2);
        "float" === c2 && (c2 = "cssFloat");
        d2 ? a.setProperty(c2, e) : a[c2] = e;
      }
  }
  var tb = A$1({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
  function ub(a, b2) {
    if (b2) {
      if (tb[a] && (null != b2.children || null != b2.dangerouslySetInnerHTML))
        throw Error(p$1(137, a));
      if (null != b2.dangerouslySetInnerHTML) {
        if (null != b2.children)
          throw Error(p$1(60));
        if ("object" !== typeof b2.dangerouslySetInnerHTML || !("__html" in b2.dangerouslySetInnerHTML))
          throw Error(p$1(61));
      }
      if (null != b2.style && "object" !== typeof b2.style)
        throw Error(p$1(62));
    }
  }
  function vb(a, b2) {
    if (-1 === a.indexOf("-"))
      return "string" === typeof b2.is;
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
      if ("function" !== typeof yb)
        throw Error(p$1(280));
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
      if (b2)
        for (a = 0; a < b2.length; a++)
          Bb(b2[a]);
    }
  }
  function Gb(a, b2) {
    return a(b2);
  }
  function Hb() {
  }
  var Ib = false;
  function Jb(a, b2, c2) {
    if (Ib)
      return a(b2, c2);
    Ib = true;
    try {
      return Gb(a, b2, c2);
    } finally {
      if (Ib = false, null !== zb || null !== Ab)
        Hb(), Fb();
    }
  }
  function Kb(a, b2) {
    var c2 = a.stateNode;
    if (null === c2)
      return null;
    var d2 = Db(c2);
    if (null === d2)
      return null;
    c2 = d2[b2];
    a:
      switch (b2) {
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
    if (a)
      return null;
    if (c2 && "function" !== typeof c2)
      throw Error(p$1(231, b2, typeof c2));
    return c2;
  }
  var Lb = false;
  if (ia)
    try {
      var Mb = {};
      Object.defineProperty(Mb, "passive", { get: function() {
        Lb = true;
      } });
      window.addEventListener("test", Mb, Mb);
      window.removeEventListener("test", Mb, Mb);
    } catch (a) {
      Lb = false;
    }
  function Nb(a, b2, c2, d2, e, f2, g2, h2, k2) {
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
  function Tb(a, b2, c2, d2, e, f2, g2, h2, k2) {
    Ob = false;
    Pb = null;
    Nb.apply(Sb, arguments);
  }
  function Ub(a, b2, c2, d2, e, f2, g2, h2, k2) {
    Tb.apply(this, arguments);
    if (Ob) {
      if (Ob) {
        var l2 = Pb;
        Ob = false;
        Pb = null;
      } else
        throw Error(p$1(198));
      Qb || (Qb = true, Rb = l2);
    }
  }
  function Vb(a) {
    var b2 = a, c2 = a;
    if (a.alternate)
      for (; b2.return; )
        b2 = b2.return;
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
      if (null !== b2)
        return b2.dehydrated;
    }
    return null;
  }
  function Xb(a) {
    if (Vb(a) !== a)
      throw Error(p$1(188));
  }
  function Yb(a) {
    var b2 = a.alternate;
    if (!b2) {
      b2 = Vb(a);
      if (null === b2)
        throw Error(p$1(188));
      return b2 !== a ? null : a;
    }
    for (var c2 = a, d2 = b2; ; ) {
      var e = c2.return;
      if (null === e)
        break;
      var f2 = e.alternate;
      if (null === f2) {
        d2 = e.return;
        if (null !== d2) {
          c2 = d2;
          continue;
        }
        break;
      }
      if (e.child === f2.child) {
        for (f2 = e.child; f2; ) {
          if (f2 === c2)
            return Xb(e), a;
          if (f2 === d2)
            return Xb(e), b2;
          f2 = f2.sibling;
        }
        throw Error(p$1(188));
      }
      if (c2.return !== d2.return)
        c2 = e, d2 = f2;
      else {
        for (var g2 = false, h2 = e.child; h2; ) {
          if (h2 === c2) {
            g2 = true;
            c2 = e;
            d2 = f2;
            break;
          }
          if (h2 === d2) {
            g2 = true;
            d2 = e;
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
              d2 = e;
              break;
            }
            if (h2 === d2) {
              g2 = true;
              d2 = f2;
              c2 = e;
              break;
            }
            h2 = h2.sibling;
          }
          if (!g2)
            throw Error(p$1(189));
        }
      }
      if (c2.alternate !== d2)
        throw Error(p$1(190));
    }
    if (3 !== c2.tag)
      throw Error(p$1(188));
    return c2.stateNode.current === c2 ? a : b2;
  }
  function Zb(a) {
    a = Yb(a);
    return null !== a ? $b(a) : null;
  }
  function $b(a) {
    if (5 === a.tag || 6 === a.tag)
      return a;
    for (a = a.child; null !== a; ) {
      var b2 = $b(a);
      if (null !== b2)
        return b2;
      a = a.sibling;
    }
    return null;
  }
  var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B$1 = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
  function mc(a) {
    if (lc && "function" === typeof lc.onCommitFiberRoot)
      try {
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
    if (0 === c2)
      return 0;
    var d2 = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g2 = c2 & 268435455;
    if (0 !== g2) {
      var h2 = g2 & ~e;
      0 !== h2 ? d2 = tc(h2) : (f2 &= g2, 0 !== f2 && (d2 = tc(f2)));
    } else
      g2 = c2 & ~e, 0 !== g2 ? d2 = tc(g2) : 0 !== f2 && (d2 = tc(f2));
    if (0 === d2)
      return 0;
    if (0 !== b2 && b2 !== d2 && 0 === (b2 & e) && (e = d2 & -d2, f2 = b2 & -b2, e >= f2 || 16 === e && 0 !== (f2 & 4194240)))
      return b2;
    0 !== (d2 & 4) && (d2 |= c2 & 16);
    b2 = a.entangledLanes;
    if (0 !== b2)
      for (a = a.entanglements, b2 &= d2; 0 < b2; )
        c2 = 31 - oc(b2), e = 1 << c2, d2 |= a[c2], b2 &= ~e;
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
    for (var c2 = a.suspendedLanes, d2 = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
      var g2 = 31 - oc(f2), h2 = 1 << g2, k2 = e[g2];
      if (-1 === k2) {
        if (0 === (h2 & c2) || 0 !== (h2 & d2))
          e[g2] = vc(h2, b2);
      } else
        k2 <= b2 && (a.expiredLanes |= h2);
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
    for (var b2 = [], c2 = 0; 31 > c2; c2++)
      b2.push(a);
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
      var e = 31 - oc(c2), f2 = 1 << e;
      b2[e] = 0;
      d2[e] = -1;
      a[e] = -1;
      c2 &= ~f2;
    }
  }
  function Cc(a, b2) {
    var c2 = a.entangledLanes |= b2;
    for (a = a.entanglements; c2; ) {
      var d2 = 31 - oc(c2), e = 1 << d2;
      e & b2 | a[d2] & b2 && (a[d2] |= b2);
      c2 &= ~e;
    }
  }
  var C$1 = 0;
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
  function Tc(a, b2, c2, d2, e, f2) {
    if (null === a || a.nativeEvent !== f2)
      return a = { blockedOn: b2, domEventName: c2, eventSystemFlags: d2, nativeEvent: f2, targetContainers: [e] }, null !== b2 && (b2 = Cb(b2), null !== b2 && Fc(b2)), a;
    a.eventSystemFlags |= d2;
    b2 = a.targetContainers;
    null !== e && -1 === b2.indexOf(e) && b2.push(e);
    return a;
  }
  function Uc(a, b2, c2, d2, e) {
    switch (b2) {
      case "focusin":
        return Lc = Tc(Lc, a, b2, c2, d2, e), true;
      case "dragenter":
        return Mc = Tc(Mc, a, b2, c2, d2, e), true;
      case "mouseover":
        return Nc = Tc(Nc, a, b2, c2, d2, e), true;
      case "pointerover":
        var f2 = e.pointerId;
        Oc.set(f2, Tc(Oc.get(f2) || null, a, b2, c2, d2, e));
        return true;
      case "gotpointercapture":
        return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b2, c2, d2, e)), true;
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
    if (null !== a.blockedOn)
      return false;
    for (var b2 = a.targetContainers; 0 < b2.length; ) {
      var c2 = Yc(a.domEventName, a.eventSystemFlags, b2[0], a.nativeEvent);
      if (null === c2) {
        c2 = a.nativeEvent;
        var d2 = new c2.constructor(c2.type, c2);
        wb = d2;
        c2.target.dispatchEvent(d2);
        wb = null;
      } else
        return b2 = Cb(c2), null !== b2 && Fc(b2), a.blockedOn = c2, false;
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
    for (c2 = 0; c2 < Qc.length; c2++)
      d2 = Qc[c2], d2.blockedOn === a && (d2.blockedOn = null);
    for (; 0 < Qc.length && (c2 = Qc[0], null === c2.blockedOn); )
      Vc(c2), null === c2.blockedOn && Qc.shift();
  }
  var cd = ua.ReactCurrentBatchConfig, dd = true;
  function ed(a, b2, c2, d2) {
    var e = C$1, f2 = cd.transition;
    cd.transition = null;
    try {
      C$1 = 1, fd(a, b2, c2, d2);
    } finally {
      C$1 = e, cd.transition = f2;
    }
  }
  function gd(a, b2, c2, d2) {
    var e = C$1, f2 = cd.transition;
    cd.transition = null;
    try {
      C$1 = 4, fd(a, b2, c2, d2);
    } finally {
      C$1 = e, cd.transition = f2;
    }
  }
  function fd(a, b2, c2, d2) {
    if (dd) {
      var e = Yc(a, b2, c2, d2);
      if (null === e)
        hd(a, b2, d2, id, c2), Sc(a, d2);
      else if (Uc(e, a, b2, c2, d2))
        d2.stopPropagation();
      else if (Sc(a, d2), b2 & 4 && -1 < Rc.indexOf(a)) {
        for (; null !== e; ) {
          var f2 = Cb(e);
          null !== f2 && Ec(f2);
          f2 = Yc(a, b2, c2, d2);
          null === f2 && hd(a, b2, d2, id, c2);
          if (f2 === e)
            break;
          e = f2;
        }
        null !== e && d2.stopPropagation();
      } else
        hd(a, b2, d2, null, c2);
    }
  }
  var id = null;
  function Yc(a, b2, c2, d2) {
    id = null;
    a = xb(d2);
    a = Wc(a);
    if (null !== a)
      if (b2 = Vb(a), null === b2)
        a = null;
      else if (c2 = b2.tag, 13 === c2) {
        a = Wb(b2);
        if (null !== a)
          return a;
        a = null;
      } else if (3 === c2) {
        if (b2.stateNode.current.memoizedState.isDehydrated)
          return 3 === b2.tag ? b2.stateNode.containerInfo : null;
        a = null;
      } else
        b2 !== a && (a = null);
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
    if (md)
      return md;
    var a, b2 = ld, c2 = b2.length, d2, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
    for (a = 0; a < c2 && b2[a] === e[a]; a++)
      ;
    var g2 = c2 - a;
    for (d2 = 1; d2 <= g2 && b2[c2 - d2] === e[f2 - d2]; d2++)
      ;
    return md = e.slice(a, 1 < d2 ? 1 - d2 : void 0);
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
    function b2(b3, d2, e, f2, g2) {
      this._reactName = b3;
      this._targetInst = e;
      this.type = d2;
      this.nativeEvent = f2;
      this.target = g2;
      this.currentTarget = null;
      for (var c2 in a)
        a.hasOwnProperty(c2) && (b3 = a[c2], this[c2] = b3 ? b3(f2) : f2[c2]);
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
    if ("movementX" in a)
      return a.movementX;
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
      if ("Unidentified" !== b2)
        return b2;
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
        if (32 !== b2.which)
          return null;
        fe = true;
        return ee;
      case "textInput":
        return a = b2.data, a === ee && fe ? null : a;
      default:
        return null;
    }
  }
  function ke(a, b2) {
    if (ie)
      return "compositionend" === a || !ae && ge(a, b2) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
    switch (a) {
      case "paste":
        return null;
      case "keypress":
        if (!(b2.ctrlKey || b2.altKey || b2.metaKey) || b2.ctrlKey && b2.altKey) {
          if (b2.char && 1 < b2.char.length)
            return b2.char;
          if (b2.which)
            return String.fromCharCode(b2.which);
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
    if (Wa(b2))
      return a;
  }
  function ve(a, b2) {
    if ("change" === a)
      return b2;
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
    } else
      xe = false;
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
    if ("selectionchange" === a || "keyup" === a || "keydown" === a)
      return te(qe);
  }
  function Ee(a, b2) {
    if ("click" === a)
      return te(b2);
  }
  function Fe(a, b2) {
    if ("input" === a || "change" === a)
      return te(b2);
  }
  function Ge(a, b2) {
    return a === b2 && (0 !== a || 1 / a === 1 / b2) || a !== a && b2 !== b2;
  }
  var He = "function" === typeof Object.is ? Object.is : Ge;
  function Ie(a, b2) {
    if (He(a, b2))
      return true;
    if ("object" !== typeof a || null === a || "object" !== typeof b2 || null === b2)
      return false;
    var c2 = Object.keys(a), d2 = Object.keys(b2);
    if (c2.length !== d2.length)
      return false;
    for (d2 = 0; d2 < c2.length; d2++) {
      var e = c2[d2];
      if (!ja.call(b2, e) || !He(a[e], b2[e]))
        return false;
    }
    return true;
  }
  function Je(a) {
    for (; a && a.firstChild; )
      a = a.firstChild;
    return a;
  }
  function Ke(a, b2) {
    var c2 = Je(a);
    a = 0;
    for (var d2; c2; ) {
      if (3 === c2.nodeType) {
        d2 = a + c2.textContent.length;
        if (a <= b2 && d2 >= b2)
          return { node: c2, offset: b2 - a };
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
      if (c2)
        a = b2.contentWindow;
      else
        break;
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
        if (b2 = d2.start, a = d2.end, void 0 === a && (a = b2), "selectionStart" in c2)
          c2.selectionStart = b2, c2.selectionEnd = Math.min(a, c2.value.length);
        else if (a = (b2 = c2.ownerDocument || document) && b2.defaultView || window, a.getSelection) {
          a = a.getSelection();
          var e = c2.textContent.length, f2 = Math.min(d2.start, e);
          d2 = void 0 === d2.end ? f2 : Math.min(d2.end, e);
          !a.extend && f2 > d2 && (e = d2, d2 = f2, f2 = e);
          e = Ke(c2, f2);
          var g2 = Ke(
            c2,
            d2
          );
          e && g2 && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g2.node || a.focusOffset !== g2.offset) && (b2 = b2.createRange(), b2.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d2 ? (a.addRange(b2), a.extend(g2.node, g2.offset)) : (b2.setEnd(g2.node, g2.offset), a.addRange(b2)));
        }
      }
      b2 = [];
      for (a = c2; a = a.parentNode; )
        1 === a.nodeType && b2.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
      "function" === typeof c2.focus && c2.focus();
      for (c2 = 0; c2 < b2.length; c2++)
        a = b2[c2], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
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
    if (Xe[a])
      return Xe[a];
    if (!We[a])
      return a;
    var b2 = We[a], c2;
    for (c2 in b2)
      if (b2.hasOwnProperty(c2) && c2 in Ye)
        return Xe[a] = b2[c2];
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
      var d2 = a[c2], e = d2.event;
      d2 = d2.listeners;
      a: {
        var f2 = void 0;
        if (b2)
          for (var g2 = d2.length - 1; 0 <= g2; g2--) {
            var h2 = d2[g2], k2 = h2.instance, l2 = h2.currentTarget;
            h2 = h2.listener;
            if (k2 !== f2 && e.isPropagationStopped())
              break a;
            nf(e, h2, l2);
            f2 = k2;
          }
        else
          for (g2 = 0; g2 < d2.length; g2++) {
            h2 = d2[g2];
            k2 = h2.instance;
            l2 = h2.currentTarget;
            h2 = h2.listener;
            if (k2 !== f2 && e.isPropagationStopped())
              break a;
            nf(e, h2, l2);
            f2 = k2;
          }
      }
    }
    if (Qb)
      throw a = Rb, Qb = false, Rb = null, a;
  }
  function D$1(a, b2) {
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
        var e = ed;
        break;
      case 4:
        e = gd;
        break;
      default:
        e = fd;
    }
    c2 = e.bind(null, b2, c2, a);
    e = void 0;
    !Lb || "touchstart" !== b2 && "touchmove" !== b2 && "wheel" !== b2 || (e = true);
    d2 ? void 0 !== e ? a.addEventListener(b2, c2, { capture: true, passive: e }) : a.addEventListener(b2, c2, true) : void 0 !== e ? a.addEventListener(b2, c2, { passive: e }) : a.addEventListener(b2, c2, false);
  }
  function hd(a, b2, c2, d2, e) {
    var f2 = d2;
    if (0 === (b2 & 1) && 0 === (b2 & 2) && null !== d2)
      a:
        for (; ; ) {
          if (null === d2)
            return;
          var g2 = d2.tag;
          if (3 === g2 || 4 === g2) {
            var h2 = d2.stateNode.containerInfo;
            if (h2 === e || 8 === h2.nodeType && h2.parentNode === e)
              break;
            if (4 === g2)
              for (g2 = d2.return; null !== g2; ) {
                var k2 = g2.tag;
                if (3 === k2 || 4 === k2) {
                  if (k2 = g2.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e)
                    return;
                }
                g2 = g2.return;
              }
            for (; null !== h2; ) {
              g2 = Wc(h2);
              if (null === g2)
                return;
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
      var d3 = f2, e2 = xb(c2), g3 = [];
      a: {
        var h3 = df.get(a);
        if (void 0 !== h3) {
          var k3 = td, n2 = a;
          switch (a) {
            case "keypress":
              if (0 === od(c2))
                break a;
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
              if (2 === c2.button)
                break a;
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
            if (J2)
              break;
            w2 = w2.return;
          }
          0 < t2.length && (h3 = new k3(h3, n2, null, c2, e2), g3.push({ event: h3, listeners: t2 }));
        }
      }
      if (0 === (b2 & 7)) {
        a: {
          h3 = "mouseover" === a || "pointerover" === a;
          k3 = "mouseout" === a || "pointerout" === a;
          if (h3 && c2 !== wb && (n2 = c2.relatedTarget || c2.fromElement) && (Wc(n2) || n2[uf]))
            break a;
          if (k3 || h3) {
            h3 = e2.window === e2 ? e2 : (h3 = e2.ownerDocument) ? h3.defaultView || h3.parentWindow : window;
            if (k3) {
              if (n2 = c2.relatedTarget || c2.toElement, k3 = d3, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag))
                n2 = null;
            } else
              k3 = null, n2 = d3;
            if (k3 !== n2) {
              t2 = Bd;
              F2 = "onMouseLeave";
              x2 = "onMouseEnter";
              w2 = "mouse";
              if ("pointerout" === a || "pointerover" === a)
                t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
              J2 = null == k3 ? h3 : ue(k3);
              u2 = null == n2 ? h3 : ue(n2);
              h3 = new t2(F2, w2 + "leave", k3, c2, e2);
              h3.target = J2;
              h3.relatedTarget = u2;
              F2 = null;
              Wc(e2) === d3 && (t2 = new t2(x2, w2 + "enter", n2, c2, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
              J2 = F2;
              if (k3 && n2)
                b: {
                  t2 = k3;
                  x2 = n2;
                  w2 = 0;
                  for (u2 = t2; u2; u2 = vf(u2))
                    w2++;
                  u2 = 0;
                  for (F2 = x2; F2; F2 = vf(F2))
                    u2++;
                  for (; 0 < w2 - u2; )
                    t2 = vf(t2), w2--;
                  for (; 0 < u2 - w2; )
                    x2 = vf(x2), u2--;
                  for (; w2--; ) {
                    if (t2 === x2 || null !== x2 && t2 === x2.alternate)
                      break b;
                    t2 = vf(t2);
                    x2 = vf(x2);
                  }
                  t2 = null;
                }
              else
                t2 = null;
              null !== k3 && wf(g3, h3, k3, t2, false);
              null !== n2 && null !== J2 && wf(g3, J2, n2, t2, true);
            }
          }
        }
        a: {
          h3 = d3 ? ue(d3) : window;
          k3 = h3.nodeName && h3.nodeName.toLowerCase();
          if ("select" === k3 || "input" === k3 && "file" === h3.type)
            var na = ve;
          else if (me(h3))
            if (we)
              na = Fe;
            else {
              na = De;
              var xa = Ce;
            }
          else
            (k3 = h3.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h3.type || "radio" === h3.type) && (na = Ee);
          if (na && (na = na(a, d3))) {
            ne(g3, na, c2, e2);
            break a;
          }
          xa && xa(a, h3, d3);
          "focusout" === a && (xa = h3._wrapperState) && xa.controlled && "number" === h3.type && cb(h3, "number", h3.value);
        }
        xa = d3 ? ue(d3) : window;
        switch (a) {
          case "focusin":
            if (me(xa) || "true" === xa.contentEditable)
              Qe = xa, Re = d3, Se = null;
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
            Ue(g3, c2, e2);
            break;
          case "selectionchange":
            if (Pe)
              break;
          case "keydown":
          case "keyup":
            Ue(g3, c2, e2);
        }
        var $a;
        if (ae)
          b: {
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
        else
          ie ? ge(a, c2) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c2.keyCode && (ba = "onCompositionStart");
        ba && (de && "ko" !== c2.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d3, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c2, e2), g3.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c2), null !== $a && (ba.data = $a))));
        if ($a = ce ? je(a, c2) : ke(a, c2))
          d3 = oe(d3, "onBeforeInput"), 0 < d3.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c2, e2), g3.push({ event: e2, listeners: d3 }), e2.data = $a);
      }
      se(g3, b2);
    });
  }
  function tf(a, b2, c2) {
    return { instance: a, listener: b2, currentTarget: c2 };
  }
  function oe(a, b2) {
    for (var c2 = b2 + "Capture", d2 = []; null !== a; ) {
      var e = a, f2 = e.stateNode;
      5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c2), null != f2 && d2.unshift(tf(a, f2, e)), f2 = Kb(a, b2), null != f2 && d2.push(tf(a, f2, e)));
      a = a.return;
    }
    return d2;
  }
  function vf(a) {
    if (null === a)
      return null;
    do
      a = a.return;
    while (a && 5 !== a.tag);
    return a ? a : null;
  }
  function wf(a, b2, c2, d2, e) {
    for (var f2 = b2._reactName, g2 = []; null !== c2 && c2 !== d2; ) {
      var h2 = c2, k2 = h2.alternate, l2 = h2.stateNode;
      if (null !== k2 && k2 === d2)
        break;
      5 === h2.tag && null !== l2 && (h2 = l2, e ? (k2 = Kb(c2, f2), null != k2 && g2.unshift(tf(c2, k2, h2))) : e || (k2 = Kb(c2, f2), null != k2 && g2.push(tf(c2, k2, h2))));
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
    if (zf(a) !== b2 && c2)
      throw Error(p$1(425));
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
      var e = c2.nextSibling;
      a.removeChild(c2);
      if (e && 8 === e.nodeType)
        if (c2 = e.data, "/$" === c2) {
          if (0 === d2) {
            a.removeChild(e);
            bd(b2);
            return;
          }
          d2--;
        } else
          "$" !== c2 && "$?" !== c2 && "$!" !== c2 || d2++;
      c2 = e;
    } while (c2);
    bd(b2);
  }
  function Lf(a) {
    for (; null != a; a = a.nextSibling) {
      var b2 = a.nodeType;
      if (1 === b2 || 3 === b2)
        break;
      if (8 === b2) {
        b2 = a.data;
        if ("$" === b2 || "$!" === b2 || "$?" === b2)
          break;
        if ("/$" === b2)
          return null;
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
          if (0 === b2)
            return a;
          b2--;
        } else
          "/$" === c2 && b2++;
      }
      a = a.previousSibling;
    }
    return null;
  }
  var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
  function Wc(a) {
    var b2 = a[Of];
    if (b2)
      return b2;
    for (var c2 = a.parentNode; c2; ) {
      if (b2 = c2[uf] || c2[Of]) {
        c2 = b2.alternate;
        if (null !== b2.child || null !== c2 && null !== c2.child)
          for (a = Mf(a); null !== a; ) {
            if (c2 = a[Of])
              return c2;
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
    if (5 === a.tag || 6 === a.tag)
      return a.stateNode;
    throw Error(p$1(33));
  }
  function Db(a) {
    return a[Pf] || null;
  }
  var Sf = [], Tf = -1;
  function Uf(a) {
    return { current: a };
  }
  function E$1(a) {
    0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
  }
  function G(a, b2) {
    Tf++;
    Sf[Tf] = a.current;
    a.current = b2;
  }
  var Vf = {}, H$1 = Uf(Vf), Wf = Uf(false), Xf = Vf;
  function Yf(a, b2) {
    var c2 = a.type.contextTypes;
    if (!c2)
      return Vf;
    var d2 = a.stateNode;
    if (d2 && d2.__reactInternalMemoizedUnmaskedChildContext === b2)
      return d2.__reactInternalMemoizedMaskedChildContext;
    var e = {}, f2;
    for (f2 in c2)
      e[f2] = b2[f2];
    d2 && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b2, a.__reactInternalMemoizedMaskedChildContext = e);
    return e;
  }
  function Zf(a) {
    a = a.childContextTypes;
    return null !== a && void 0 !== a;
  }
  function $f() {
    E$1(Wf);
    E$1(H$1);
  }
  function ag(a, b2, c2) {
    if (H$1.current !== Vf)
      throw Error(p$1(168));
    G(H$1, b2);
    G(Wf, c2);
  }
  function bg(a, b2, c2) {
    var d2 = a.stateNode;
    b2 = b2.childContextTypes;
    if ("function" !== typeof d2.getChildContext)
      return c2;
    d2 = d2.getChildContext();
    for (var e in d2)
      if (!(e in b2))
        throw Error(p$1(108, Ra(a) || "Unknown", e));
    return A$1({}, c2, d2);
  }
  function cg(a) {
    a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
    Xf = H$1.current;
    G(H$1, a);
    G(Wf, Wf.current);
    return true;
  }
  function dg(a, b2, c2) {
    var d2 = a.stateNode;
    if (!d2)
      throw Error(p$1(169));
    c2 ? (a = bg(a, b2, Xf), d2.__reactInternalMemoizedMergedChildContext = a, E$1(Wf), E$1(H$1), G(H$1, a)) : E$1(Wf);
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
      var a = 0, b2 = C$1;
      try {
        var c2 = eg;
        for (C$1 = 1; a < c2.length; a++) {
          var d2 = c2[a];
          do
            d2 = d2(true);
          while (null !== d2);
        }
        eg = null;
        fg = false;
      } catch (e) {
        throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
      } finally {
        C$1 = b2, gg = false;
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
    var e = 32 - oc(d2) - 1;
    d2 &= ~(1 << e);
    c2 += 1;
    var f2 = 32 - oc(b2) + e;
    if (30 < f2) {
      var g2 = e - e % 5;
      f2 = (d2 & (1 << g2) - 1).toString(32);
      d2 >>= g2;
      e -= g2;
      rg = 1 << 32 - oc(b2) + e | c2 << e | d2;
      sg = f2 + a;
    } else
      rg = 1 << f2 | c2 << e | d2, sg = a;
  }
  function vg(a) {
    null !== a.return && (tg(a, 1), ug(a, 1, 0));
  }
  function wg(a) {
    for (; a === mg; )
      mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
    for (; a === qg; )
      qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
  }
  var xg = null, yg = null, I$1 = false, zg = null;
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
    if (I$1) {
      var b2 = yg;
      if (b2) {
        var c2 = b2;
        if (!Cg(a, b2)) {
          if (Dg(a))
            throw Error(p$1(418));
          b2 = Lf(c2.nextSibling);
          var d2 = xg;
          b2 && Cg(a, b2) ? Ag(d2, c2) : (a.flags = a.flags & -4097 | 2, I$1 = false, xg = a);
        }
      } else {
        if (Dg(a))
          throw Error(p$1(418));
        a.flags = a.flags & -4097 | 2;
        I$1 = false;
        xg = a;
      }
    }
  }
  function Fg(a) {
    for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; )
      a = a.return;
    xg = a;
  }
  function Gg(a) {
    if (a !== xg)
      return false;
    if (!I$1)
      return Fg(a), I$1 = true, false;
    var b2;
    (b2 = 3 !== a.tag) && !(b2 = 5 !== a.tag) && (b2 = a.type, b2 = "head" !== b2 && "body" !== b2 && !Ef(a.type, a.memoizedProps));
    if (b2 && (b2 = yg)) {
      if (Dg(a))
        throw Hg(), Error(p$1(418));
      for (; b2; )
        Ag(a, b2), b2 = Lf(b2.nextSibling);
    }
    Fg(a);
    if (13 === a.tag) {
      a = a.memoizedState;
      a = null !== a ? a.dehydrated : null;
      if (!a)
        throw Error(p$1(317));
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
            } else
              "$" !== c2 && "$!" !== c2 && "$?" !== c2 || b2++;
          }
          a = a.nextSibling;
        }
        yg = null;
      }
    } else
      yg = xg ? Lf(a.stateNode.nextSibling) : null;
    return true;
  }
  function Hg() {
    for (var a = yg; a; )
      a = Lf(a.nextSibling);
  }
  function Ig() {
    yg = xg = null;
    I$1 = false;
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
          if (1 !== c2.tag)
            throw Error(p$1(309));
          var d2 = c2.stateNode;
        }
        if (!d2)
          throw Error(p$1(147, a));
        var e = d2, f2 = "" + a;
        if (null !== b2 && null !== b2.ref && "function" === typeof b2.ref && b2.ref._stringRef === f2)
          return b2.ref;
        b2 = function(a2) {
          var b3 = e.refs;
          null === a2 ? delete b3[f2] : b3[f2] = a2;
        };
        b2._stringRef = f2;
        return b2;
      }
      if ("string" !== typeof a)
        throw Error(p$1(284));
      if (!c2._owner)
        throw Error(p$1(290, a));
    }
    return a;
  }
  function Mg(a, b2) {
    a = Object.prototype.toString.call(b2);
    throw Error(p$1(31, "[object Object]" === a ? "object with keys {" + Object.keys(b2).join(", ") + "}" : a));
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
      if (!a)
        return null;
      for (; null !== d3; )
        b2(c3, d3), d3 = d3.sibling;
      return null;
    }
    function d2(a2, b3) {
      for (a2 = /* @__PURE__ */ new Map(); null !== b3; )
        null !== b3.key ? a2.set(b3.key, b3) : a2.set(b3.index, b3), b3 = b3.sibling;
      return a2;
    }
    function e(a2, b3) {
      a2 = Pg(a2, b3);
      a2.index = 0;
      a2.sibling = null;
      return a2;
    }
    function f2(b3, c3, d3) {
      b3.index = d3;
      if (!a)
        return b3.flags |= 1048576, c3;
      d3 = b3.alternate;
      if (null !== d3)
        return d3 = d3.index, d3 < c3 ? (b3.flags |= 2, c3) : d3;
      b3.flags |= 2;
      return c3;
    }
    function g2(b3) {
      a && null === b3.alternate && (b3.flags |= 2);
      return b3;
    }
    function h2(a2, b3, c3, d3) {
      if (null === b3 || 6 !== b3.tag)
        return b3 = Qg(c3, a2.mode, d3), b3.return = a2, b3;
      b3 = e(b3, c3);
      b3.return = a2;
      return b3;
    }
    function k2(a2, b3, c3, d3) {
      var f3 = c3.type;
      if (f3 === ya)
        return m2(a2, b3, c3.props.children, d3, c3.key);
      if (null !== b3 && (b3.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b3.type))
        return d3 = e(b3, c3.props), d3.ref = Lg(a2, b3, c3), d3.return = a2, d3;
      d3 = Rg(c3.type, c3.key, c3.props, null, a2.mode, d3);
      d3.ref = Lg(a2, b3, c3);
      d3.return = a2;
      return d3;
    }
    function l2(a2, b3, c3, d3) {
      if (null === b3 || 4 !== b3.tag || b3.stateNode.containerInfo !== c3.containerInfo || b3.stateNode.implementation !== c3.implementation)
        return b3 = Sg(c3, a2.mode, d3), b3.return = a2, b3;
      b3 = e(b3, c3.children || []);
      b3.return = a2;
      return b3;
    }
    function m2(a2, b3, c3, d3, f3) {
      if (null === b3 || 7 !== b3.tag)
        return b3 = Tg(c3, a2.mode, d3, f3), b3.return = a2, b3;
      b3 = e(b3, c3);
      b3.return = a2;
      return b3;
    }
    function q2(a2, b3, c3) {
      if ("string" === typeof b3 && "" !== b3 || "number" === typeof b3)
        return b3 = Qg("" + b3, a2.mode, c3), b3.return = a2, b3;
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
        if (eb(b3) || Ka(b3))
          return b3 = Tg(b3, a2.mode, c3, null), b3.return = a2, b3;
        Mg(a2, b3);
      }
      return null;
    }
    function r2(a2, b3, c3, d3) {
      var e2 = null !== b3 ? b3.key : null;
      if ("string" === typeof c3 && "" !== c3 || "number" === typeof c3)
        return null !== e2 ? null : h2(a2, b3, "" + c3, d3);
      if ("object" === typeof c3 && null !== c3) {
        switch (c3.$$typeof) {
          case va:
            return c3.key === e2 ? k2(a2, b3, c3, d3) : null;
          case wa:
            return c3.key === e2 ? l2(a2, b3, c3, d3) : null;
          case Ha:
            return e2 = c3._init, r2(
              a2,
              b3,
              e2(c3._payload),
              d3
            );
        }
        if (eb(c3) || Ka(c3))
          return null !== e2 ? null : m2(a2, b3, c3, d3, null);
        Mg(a2, c3);
      }
      return null;
    }
    function y2(a2, b3, c3, d3, e2) {
      if ("string" === typeof d3 && "" !== d3 || "number" === typeof d3)
        return a2 = a2.get(c3) || null, h2(b3, a2, "" + d3, e2);
      if ("object" === typeof d3 && null !== d3) {
        switch (d3.$$typeof) {
          case va:
            return a2 = a2.get(null === d3.key ? c3 : d3.key) || null, k2(b3, a2, d3, e2);
          case wa:
            return a2 = a2.get(null === d3.key ? c3 : d3.key) || null, l2(b3, a2, d3, e2);
          case Ha:
            var f3 = d3._init;
            return y2(a2, b3, c3, f3(d3._payload), e2);
        }
        if (eb(d3) || Ka(d3))
          return a2 = a2.get(c3) || null, m2(b3, a2, d3, e2, null);
        Mg(b3, d3);
      }
      return null;
    }
    function n2(e2, g3, h3, k3) {
      for (var l3 = null, m3 = null, u2 = g3, w2 = g3 = 0, x2 = null; null !== u2 && w2 < h3.length; w2++) {
        u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
        var n3 = r2(e2, u2, h3[w2], k3);
        if (null === n3) {
          null === u2 && (u2 = x2);
          break;
        }
        a && u2 && null === n3.alternate && b2(e2, u2);
        g3 = f2(n3, g3, w2);
        null === m3 ? l3 = n3 : m3.sibling = n3;
        m3 = n3;
        u2 = x2;
      }
      if (w2 === h3.length)
        return c2(e2, u2), I$1 && tg(e2, w2), l3;
      if (null === u2) {
        for (; w2 < h3.length; w2++)
          u2 = q2(e2, h3[w2], k3), null !== u2 && (g3 = f2(u2, g3, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
        I$1 && tg(e2, w2);
        return l3;
      }
      for (u2 = d2(e2, u2); w2 < h3.length; w2++)
        x2 = y2(u2, e2, w2, h3[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g3 = f2(x2, g3, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
      a && u2.forEach(function(a2) {
        return b2(e2, a2);
      });
      I$1 && tg(e2, w2);
      return l3;
    }
    function t2(e2, g3, h3, k3) {
      var l3 = Ka(h3);
      if ("function" !== typeof l3)
        throw Error(p$1(150));
      h3 = l3.call(h3);
      if (null == h3)
        throw Error(p$1(151));
      for (var u2 = l3 = null, m3 = g3, w2 = g3 = 0, x2 = null, n3 = h3.next(); null !== m3 && !n3.done; w2++, n3 = h3.next()) {
        m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
        var t3 = r2(e2, m3, n3.value, k3);
        if (null === t3) {
          null === m3 && (m3 = x2);
          break;
        }
        a && m3 && null === t3.alternate && b2(e2, m3);
        g3 = f2(t3, g3, w2);
        null === u2 ? l3 = t3 : u2.sibling = t3;
        u2 = t3;
        m3 = x2;
      }
      if (n3.done)
        return c2(
          e2,
          m3
        ), I$1 && tg(e2, w2), l3;
      if (null === m3) {
        for (; !n3.done; w2++, n3 = h3.next())
          n3 = q2(e2, n3.value, k3), null !== n3 && (g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
        I$1 && tg(e2, w2);
        return l3;
      }
      for (m3 = d2(e2, m3); !n3.done; w2++, n3 = h3.next())
        n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g3 = f2(n3, g3, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      a && m3.forEach(function(a2) {
        return b2(e2, a2);
      });
      I$1 && tg(e2, w2);
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
                      d3 = e(l3, f3.props.children);
                      d3.return = a2;
                      a2 = d3;
                      break a;
                    }
                  } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                    c2(a2, l3.sibling);
                    d3 = e(l3, f3.props);
                    d3.ref = Lg(a2, l3, f3);
                    d3.return = a2;
                    a2 = d3;
                    break a;
                  }
                  c2(a2, l3);
                  break;
                } else
                  b2(a2, l3);
                l3 = l3.sibling;
              }
              f3.type === ya ? (d3 = Tg(f3.props.children, a2.mode, h3, f3.key), d3.return = a2, a2 = d3) : (h3 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h3), h3.ref = Lg(a2, d3, f3), h3.return = a2, a2 = h3);
            }
            return g2(a2);
          case wa:
            a: {
              for (l3 = f3.key; null !== d3; ) {
                if (d3.key === l3)
                  if (4 === d3.tag && d3.stateNode.containerInfo === f3.containerInfo && d3.stateNode.implementation === f3.implementation) {
                    c2(a2, d3.sibling);
                    d3 = e(d3, f3.children || []);
                    d3.return = a2;
                    a2 = d3;
                    break a;
                  } else {
                    c2(a2, d3);
                    break;
                  }
                else
                  b2(a2, d3);
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
        if (eb(f3))
          return n2(a2, d3, f3, h3);
        if (Ka(f3))
          return t2(a2, d3, f3, h3);
        Mg(a2, f3);
      }
      return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d3 && 6 === d3.tag ? (c2(a2, d3.sibling), d3 = e(d3, f3), d3.return = a2, a2 = d3) : (c2(a2, d3), d3 = Qg(f3, a2.mode, h3), d3.return = a2, a2 = d3), g2(a2)) : c2(a2, d3);
    }
    return J2;
  }
  var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
  function $g() {
    Zg = Yg = Xg = null;
  }
  function ah(a) {
    var b2 = Wg.current;
    E$1(Wg);
    a._currentValue = b2;
  }
  function bh(a, b2, c2) {
    for (; null !== a; ) {
      var d2 = a.alternate;
      (a.childLanes & b2) !== b2 ? (a.childLanes |= b2, null !== d2 && (d2.childLanes |= b2)) : null !== d2 && (d2.childLanes & b2) !== b2 && (d2.childLanes |= b2);
      if (a === c2)
        break;
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
    if (Zg !== a)
      if (a = { context: a, memoizedValue: b2, next: null }, null === Yg) {
        if (null === Xg)
          throw Error(p$1(308));
        Yg = a;
        Xg.dependencies = { lanes: 0, firstContext: a };
      } else
        Yg = Yg.next = a;
    return b2;
  }
  var fh = null;
  function gh(a) {
    null === fh ? fh = [a] : fh.push(a);
  }
  function hh(a, b2, c2, d2) {
    var e = b2.interleaved;
    null === e ? (c2.next = c2, gh(b2)) : (c2.next = e.next, e.next = c2);
    b2.interleaved = c2;
    return ih(a, d2);
  }
  function ih(a, b2) {
    a.lanes |= b2;
    var c2 = a.alternate;
    null !== c2 && (c2.lanes |= b2);
    c2 = a;
    for (a = a.return; null !== a; )
      a.childLanes |= b2, c2 = a.alternate, null !== c2 && (c2.childLanes |= b2), c2 = a, a = a.return;
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
    if (null === d2)
      return null;
    d2 = d2.shared;
    if (0 !== (K & 2)) {
      var e = d2.pending;
      null === e ? b2.next = b2 : (b2.next = e.next, e.next = b2);
      d2.pending = b2;
      return ih(a, c2);
    }
    e = d2.interleaved;
    null === e ? (b2.next = b2, gh(d2)) : (b2.next = e.next, e.next = b2);
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
      var e = null, f2 = null;
      c2 = c2.firstBaseUpdate;
      if (null !== c2) {
        do {
          var g2 = { eventTime: c2.eventTime, lane: c2.lane, tag: c2.tag, payload: c2.payload, callback: c2.callback, next: null };
          null === f2 ? e = f2 = g2 : f2 = f2.next = g2;
          c2 = c2.next;
        } while (null !== c2);
        null === f2 ? e = f2 = b2 : f2 = f2.next = b2;
      } else
        e = f2 = b2;
      c2 = { baseState: d2.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d2.shared, effects: d2.effects };
      a.updateQueue = c2;
      return;
    }
    a = c2.lastBaseUpdate;
    null === a ? c2.firstBaseUpdate = b2 : a.next = b2;
    c2.lastBaseUpdate = b2;
  }
  function qh(a, b2, c2, d2) {
    var e = a.updateQueue;
    jh = false;
    var f2 = e.firstBaseUpdate, g2 = e.lastBaseUpdate, h2 = e.shared.pending;
    if (null !== h2) {
      e.shared.pending = null;
      var k2 = h2, l2 = k2.next;
      k2.next = null;
      null === g2 ? f2 = l2 : g2.next = l2;
      g2 = k2;
      var m2 = a.alternate;
      null !== m2 && (m2 = m2.updateQueue, h2 = m2.lastBaseUpdate, h2 !== g2 && (null === h2 ? m2.firstBaseUpdate = l2 : h2.next = l2, m2.lastBaseUpdate = k2));
    }
    if (null !== f2) {
      var q2 = e.baseState;
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
                if (null === r2 || void 0 === r2)
                  break a;
                q2 = A$1({}, q2, r2);
                break a;
              case 2:
                jh = true;
            }
          }
          null !== h2.callback && 0 !== h2.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h2] : r2.push(h2));
        } else
          y2 = { eventTime: y2, lane: r2, tag: h2.tag, payload: h2.payload, callback: h2.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g2 |= r2;
        h2 = h2.next;
        if (null === h2)
          if (h2 = e.shared.pending, null === h2)
            break;
          else
            r2 = h2, h2 = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
      } while (1);
      null === m2 && (k2 = q2);
      e.baseState = k2;
      e.firstBaseUpdate = l2;
      e.lastBaseUpdate = m2;
      b2 = e.shared.interleaved;
      if (null !== b2) {
        e = b2;
        do
          g2 |= e.lane, e = e.next;
        while (e !== b2);
      } else
        null === f2 && (e.shared.lanes = 0);
      rh |= g2;
      a.lanes = g2;
      a.memoizedState = q2;
    }
  }
  function sh(a, b2, c2) {
    a = b2.effects;
    b2.effects = null;
    if (null !== a)
      for (b2 = 0; b2 < a.length; b2++) {
        var d2 = a[b2], e = d2.callback;
        if (null !== e) {
          d2.callback = null;
          d2 = c2;
          if ("function" !== typeof e)
            throw Error(p$1(191, e));
          e.call(d2);
        }
      }
  }
  var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
  function xh(a) {
    if (a === th)
      throw Error(p$1(174));
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
    E$1(uh);
    G(uh, b2);
  }
  function zh() {
    E$1(uh);
    E$1(vh);
    E$1(wh);
  }
  function Ah(a) {
    xh(wh.current);
    var b2 = xh(uh.current);
    var c2 = lb(b2, a.type);
    b2 !== c2 && (G(vh, a), G(uh, c2));
  }
  function Bh(a) {
    vh.current === a && (E$1(uh), E$1(vh));
  }
  var L$1 = Uf(0);
  function Ch(a) {
    for (var b2 = a; null !== b2; ) {
      if (13 === b2.tag) {
        var c2 = b2.memoizedState;
        if (null !== c2 && (c2 = c2.dehydrated, null === c2 || "$?" === c2.data || "$!" === c2.data))
          return b2;
      } else if (19 === b2.tag && void 0 !== b2.memoizedProps.revealOrder) {
        if (0 !== (b2.flags & 128))
          return b2;
      } else if (null !== b2.child) {
        b2.child.return = b2;
        b2 = b2.child;
        continue;
      }
      if (b2 === a)
        break;
      for (; null === b2.sibling; ) {
        if (null === b2.return || b2.return === a)
          return null;
        b2 = b2.return;
      }
      b2.sibling.return = b2.return;
      b2 = b2.sibling;
    }
    return null;
  }
  var Dh = [];
  function Eh() {
    for (var a = 0; a < Dh.length; a++)
      Dh[a]._workInProgressVersionPrimary = null;
    Dh.length = 0;
  }
  var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M$1 = null, N$1 = null, O$1 = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
  function P$1() {
    throw Error(p$1(321));
  }
  function Mh(a, b2) {
    if (null === b2)
      return false;
    for (var c2 = 0; c2 < b2.length && c2 < a.length; c2++)
      if (!He(a[c2], b2[c2]))
        return false;
    return true;
  }
  function Nh(a, b2, c2, d2, e, f2) {
    Hh = f2;
    M$1 = b2;
    b2.memoizedState = null;
    b2.updateQueue = null;
    b2.lanes = 0;
    Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
    a = c2(d2, e);
    if (Jh) {
      f2 = 0;
      do {
        Jh = false;
        Kh = 0;
        if (25 <= f2)
          throw Error(p$1(301));
        f2 += 1;
        O$1 = N$1 = null;
        b2.updateQueue = null;
        Fh.current = Qh;
        a = c2(d2, e);
      } while (Jh);
    }
    Fh.current = Rh;
    b2 = null !== N$1 && null !== N$1.next;
    Hh = 0;
    O$1 = N$1 = M$1 = null;
    Ih = false;
    if (b2)
      throw Error(p$1(300));
    return a;
  }
  function Sh() {
    var a = 0 !== Kh;
    Kh = 0;
    return a;
  }
  function Th() {
    var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    null === O$1 ? M$1.memoizedState = O$1 = a : O$1 = O$1.next = a;
    return O$1;
  }
  function Uh() {
    if (null === N$1) {
      var a = M$1.alternate;
      a = null !== a ? a.memoizedState : null;
    } else
      a = N$1.next;
    var b2 = null === O$1 ? M$1.memoizedState : O$1.next;
    if (null !== b2)
      O$1 = b2, N$1 = a;
    else {
      if (null === a)
        throw Error(p$1(310));
      N$1 = a;
      a = { memoizedState: N$1.memoizedState, baseState: N$1.baseState, baseQueue: N$1.baseQueue, queue: N$1.queue, next: null };
      null === O$1 ? M$1.memoizedState = O$1 = a : O$1 = O$1.next = a;
    }
    return O$1;
  }
  function Vh(a, b2) {
    return "function" === typeof b2 ? b2(a) : b2;
  }
  function Wh(a) {
    var b2 = Uh(), c2 = b2.queue;
    if (null === c2)
      throw Error(p$1(311));
    c2.lastRenderedReducer = a;
    var d2 = N$1, e = d2.baseQueue, f2 = c2.pending;
    if (null !== f2) {
      if (null !== e) {
        var g2 = e.next;
        e.next = f2.next;
        f2.next = g2;
      }
      d2.baseQueue = e = f2;
      c2.pending = null;
    }
    if (null !== e) {
      f2 = e.next;
      d2 = d2.baseState;
      var h2 = g2 = null, k2 = null, l2 = f2;
      do {
        var m2 = l2.lane;
        if ((Hh & m2) === m2)
          null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d2 = l2.hasEagerState ? l2.eagerState : a(d2, l2.action);
        else {
          var q2 = {
            lane: m2,
            action: l2.action,
            hasEagerState: l2.hasEagerState,
            eagerState: l2.eagerState,
            next: null
          };
          null === k2 ? (h2 = k2 = q2, g2 = d2) : k2 = k2.next = q2;
          M$1.lanes |= m2;
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
      e = a;
      do
        f2 = e.lane, M$1.lanes |= f2, rh |= f2, e = e.next;
      while (e !== a);
    } else
      null === e && (c2.lanes = 0);
    return [b2.memoizedState, c2.dispatch];
  }
  function Xh(a) {
    var b2 = Uh(), c2 = b2.queue;
    if (null === c2)
      throw Error(p$1(311));
    c2.lastRenderedReducer = a;
    var d2 = c2.dispatch, e = c2.pending, f2 = b2.memoizedState;
    if (null !== e) {
      c2.pending = null;
      var g2 = e = e.next;
      do
        f2 = a(f2, g2.action), g2 = g2.next;
      while (g2 !== e);
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
    var c2 = M$1, d2 = Uh(), e = b2(), f2 = !He(d2.memoizedState, e);
    f2 && (d2.memoizedState = e, dh = true);
    d2 = d2.queue;
    $h(ai.bind(null, c2, d2, a), [a]);
    if (d2.getSnapshot !== b2 || f2 || null !== O$1 && O$1.memoizedState.tag & 1) {
      c2.flags |= 2048;
      bi(9, ci.bind(null, c2, d2, e, b2), void 0, null);
      if (null === Q$1)
        throw Error(p$1(349));
      0 !== (Hh & 30) || di(c2, b2, e);
    }
    return e;
  }
  function di(a, b2, c2) {
    a.flags |= 16384;
    a = { getSnapshot: b2, value: c2 };
    b2 = M$1.updateQueue;
    null === b2 ? (b2 = { lastEffect: null, stores: null }, M$1.updateQueue = b2, b2.stores = [a]) : (c2 = b2.stores, null === c2 ? b2.stores = [a] : c2.push(a));
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
    a = a.dispatch = ii.bind(null, M$1, a);
    return [b2.memoizedState, a];
  }
  function bi(a, b2, c2, d2) {
    a = { tag: a, create: b2, destroy: c2, deps: d2, next: null };
    b2 = M$1.updateQueue;
    null === b2 ? (b2 = { lastEffect: null, stores: null }, M$1.updateQueue = b2, b2.lastEffect = a.next = a) : (c2 = b2.lastEffect, null === c2 ? b2.lastEffect = a.next = a : (d2 = c2.next, c2.next = a, a.next = d2, b2.lastEffect = a));
    return a;
  }
  function ji() {
    return Uh().memoizedState;
  }
  function ki(a, b2, c2, d2) {
    var e = Th();
    M$1.flags |= a;
    e.memoizedState = bi(1 | b2, c2, void 0, void 0 === d2 ? null : d2);
  }
  function li(a, b2, c2, d2) {
    var e = Uh();
    d2 = void 0 === d2 ? null : d2;
    var f2 = void 0;
    if (null !== N$1) {
      var g2 = N$1.memoizedState;
      f2 = g2.destroy;
      if (null !== d2 && Mh(d2, g2.deps)) {
        e.memoizedState = bi(b2, c2, f2, d2);
        return;
      }
    }
    M$1.flags |= a;
    e.memoizedState = bi(1 | b2, c2, f2, d2);
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
    if ("function" === typeof b2)
      return a = a(), b2(a), function() {
        b2(null);
      };
    if (null !== b2 && void 0 !== b2)
      return a = a(), b2.current = a, function() {
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
    if (null !== d2 && null !== b2 && Mh(b2, d2[1]))
      return d2[0];
    c2.memoizedState = [a, b2];
    return a;
  }
  function ti(a, b2) {
    var c2 = Uh();
    b2 = void 0 === b2 ? null : b2;
    var d2 = c2.memoizedState;
    if (null !== d2 && null !== b2 && Mh(b2, d2[1]))
      return d2[0];
    a = a();
    c2.memoizedState = [a, b2];
    return a;
  }
  function ui(a, b2, c2) {
    if (0 === (Hh & 21))
      return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c2;
    He(c2, b2) || (c2 = yc(), M$1.lanes |= c2, rh |= c2, a.baseState = true);
    return b2;
  }
  function vi(a, b2) {
    var c2 = C$1;
    C$1 = 0 !== c2 && 4 > c2 ? c2 : 4;
    a(true);
    var d2 = Gh.transition;
    Gh.transition = {};
    try {
      a(false), b2();
    } finally {
      C$1 = c2, Gh.transition = d2;
    }
  }
  function wi() {
    return Uh().memoizedState;
  }
  function xi(a, b2, c2) {
    var d2 = yi(a);
    c2 = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
    if (zi(a))
      Ai(b2, c2);
    else if (c2 = hh(a, b2, c2, d2), null !== c2) {
      var e = R$1();
      gi(c2, a, d2, e);
      Bi(c2, b2, d2);
    }
  }
  function ii(a, b2, c2) {
    var d2 = yi(a), e = { lane: d2, action: c2, hasEagerState: false, eagerState: null, next: null };
    if (zi(a))
      Ai(b2, e);
    else {
      var f2 = a.alternate;
      if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b2.lastRenderedReducer, null !== f2))
        try {
          var g2 = b2.lastRenderedState, h2 = f2(g2, c2);
          e.hasEagerState = true;
          e.eagerState = h2;
          if (He(h2, g2)) {
            var k2 = b2.interleaved;
            null === k2 ? (e.next = e, gh(b2)) : (e.next = k2.next, k2.next = e);
            b2.interleaved = e;
            return;
          }
        } catch (l2) {
        } finally {
        }
      c2 = hh(a, b2, e, d2);
      null !== c2 && (e = R$1(), gi(c2, a, d2, e), Bi(c2, b2, d2));
    }
  }
  function zi(a) {
    var b2 = a.alternate;
    return a === M$1 || null !== b2 && b2 === M$1;
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
  var Rh = { readContext: eh, useCallback: P$1, useContext: P$1, useEffect: P$1, useImperativeHandle: P$1, useInsertionEffect: P$1, useLayoutEffect: P$1, useMemo: P$1, useReducer: P$1, useRef: P$1, useState: P$1, useDebugValue: P$1, useDeferredValue: P$1, useTransition: P$1, useMutableSource: P$1, useSyncExternalStore: P$1, useId: P$1, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b2) {
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
    a = a.dispatch = xi.bind(null, M$1, a);
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
    var d2 = M$1, e = Th();
    if (I$1) {
      if (void 0 === c2)
        throw Error(p$1(407));
      c2 = c2();
    } else {
      c2 = b2();
      if (null === Q$1)
        throw Error(p$1(349));
      0 !== (Hh & 30) || di(d2, b2, c2);
    }
    e.memoizedState = c2;
    var f2 = { value: c2, getSnapshot: b2 };
    e.queue = f2;
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
    var a = Th(), b2 = Q$1.identifierPrefix;
    if (I$1) {
      var c2 = sg;
      var d2 = rg;
      c2 = (d2 & ~(1 << 32 - oc(d2) - 1)).toString(32) + c2;
      b2 = ":" + b2 + "R" + c2;
      c2 = Kh++;
      0 < c2 && (b2 += "H" + c2.toString(32));
      b2 += ":";
    } else
      c2 = Lh++, b2 = ":" + b2 + "r" + c2.toString(32) + ":";
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
      return ui(b2, N$1.memoizedState, a);
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
    return null === N$1 ? b2.memoizedState = a : ui(b2, N$1.memoizedState, a);
  }, useTransition: function() {
    var a = Xh(Vh)[0], b2 = Uh().memoizedState;
    return [a, b2];
  }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
  function Ci(a, b2) {
    if (a && a.defaultProps) {
      b2 = A$1({}, b2);
      a = a.defaultProps;
      for (var c2 in a)
        void 0 === b2[c2] && (b2[c2] = a[c2]);
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
    var d2 = R$1(), e = yi(a), f2 = mh(d2, e);
    f2.payload = b2;
    void 0 !== c2 && null !== c2 && (f2.callback = c2);
    b2 = nh(a, f2, e);
    null !== b2 && (gi(b2, a, e, d2), oh(b2, a, e));
  }, enqueueReplaceState: function(a, b2, c2) {
    a = a._reactInternals;
    var d2 = R$1(), e = yi(a), f2 = mh(d2, e);
    f2.tag = 1;
    f2.payload = b2;
    void 0 !== c2 && null !== c2 && (f2.callback = c2);
    b2 = nh(a, f2, e);
    null !== b2 && (gi(b2, a, e, d2), oh(b2, a, e));
  }, enqueueForceUpdate: function(a, b2) {
    a = a._reactInternals;
    var c2 = R$1(), d2 = yi(a), e = mh(c2, d2);
    e.tag = 2;
    void 0 !== b2 && null !== b2 && (e.callback = b2);
    b2 = nh(a, e, d2);
    null !== b2 && (gi(b2, a, d2, c2), oh(b2, a, d2));
  } };
  function Fi(a, b2, c2, d2, e, f2, g2) {
    a = a.stateNode;
    return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d2, f2, g2) : b2.prototype && b2.prototype.isPureReactComponent ? !Ie(c2, d2) || !Ie(e, f2) : true;
  }
  function Gi(a, b2, c2) {
    var d2 = false, e = Vf;
    var f2 = b2.contextType;
    "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b2) ? Xf : H$1.current, d2 = b2.contextTypes, f2 = (d2 = null !== d2 && void 0 !== d2) ? Yf(a, e) : Vf);
    b2 = new b2(c2, f2);
    a.memoizedState = null !== b2.state && void 0 !== b2.state ? b2.state : null;
    b2.updater = Ei;
    a.stateNode = b2;
    b2._reactInternals = a;
    d2 && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
    return b2;
  }
  function Hi(a, b2, c2, d2) {
    a = b2.state;
    "function" === typeof b2.componentWillReceiveProps && b2.componentWillReceiveProps(c2, d2);
    "function" === typeof b2.UNSAFE_componentWillReceiveProps && b2.UNSAFE_componentWillReceiveProps(c2, d2);
    b2.state !== a && Ei.enqueueReplaceState(b2, b2.state, null);
  }
  function Ii(a, b2, c2, d2) {
    var e = a.stateNode;
    e.props = c2;
    e.state = a.memoizedState;
    e.refs = {};
    kh(a);
    var f2 = b2.contextType;
    "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b2) ? Xf : H$1.current, e.context = Yf(a, f2));
    e.state = a.memoizedState;
    f2 = b2.getDerivedStateFromProps;
    "function" === typeof f2 && (Di(a, b2, f2, c2), e.state = a.memoizedState);
    "function" === typeof b2.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b2 = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b2 !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c2, e, d2), e.state = a.memoizedState);
    "function" === typeof e.componentDidMount && (a.flags |= 4194308);
  }
  function Ji(a, b2) {
    try {
      var c2 = "", d2 = b2;
      do
        c2 += Pa(d2), d2 = d2.return;
      while (d2);
      var e = c2;
    } catch (f2) {
      e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
    }
    return { value: a, source: b2, stack: e, digest: null };
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
      var e = b2.value;
      c2.payload = function() {
        return d2(e);
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
      var e = /* @__PURE__ */ new Set();
      d2.set(b2, e);
    } else
      e = d2.get(b2), void 0 === e && (e = /* @__PURE__ */ new Set(), d2.set(b2, e));
    e.has(c2) || (e.add(c2), a = Ti.bind(null, a, b2, c2), b2.then(a, a));
  }
  function Ui(a) {
    do {
      var b2;
      if (b2 = 13 === a.tag)
        b2 = a.memoizedState, b2 = null !== b2 ? null !== b2.dehydrated ? true : false : true;
      if (b2)
        return a;
      a = a.return;
    } while (null !== a);
    return null;
  }
  function Vi(a, b2, c2, d2, e) {
    if (0 === (a.mode & 1))
      return a === b2 ? a.flags |= 65536 : (a.flags |= 128, c2.flags |= 131072, c2.flags &= -52805, 1 === c2.tag && (null === c2.alternate ? c2.tag = 17 : (b2 = mh(-1, 1), b2.tag = 2, nh(c2, b2, 1))), c2.lanes |= 1), a;
    a.flags |= 65536;
    a.lanes = e;
    return a;
  }
  var Wi = ua.ReactCurrentOwner, dh = false;
  function Xi(a, b2, c2, d2) {
    b2.child = null === a ? Vg(b2, null, c2, d2) : Ug(b2, a.child, c2, d2);
  }
  function Yi(a, b2, c2, d2, e) {
    c2 = c2.render;
    var f2 = b2.ref;
    ch(b2, e);
    d2 = Nh(a, b2, c2, d2, f2, e);
    c2 = Sh();
    if (null !== a && !dh)
      return b2.updateQueue = a.updateQueue, b2.flags &= -2053, a.lanes &= ~e, Zi(a, b2, e);
    I$1 && c2 && vg(b2);
    b2.flags |= 1;
    Xi(a, b2, d2, e);
    return b2.child;
  }
  function $i(a, b2, c2, d2, e) {
    if (null === a) {
      var f2 = c2.type;
      if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c2.compare && void 0 === c2.defaultProps)
        return b2.tag = 15, b2.type = f2, bj(a, b2, f2, d2, e);
      a = Rg(c2.type, null, d2, b2, b2.mode, e);
      a.ref = b2.ref;
      a.return = b2;
      return b2.child = a;
    }
    f2 = a.child;
    if (0 === (a.lanes & e)) {
      var g2 = f2.memoizedProps;
      c2 = c2.compare;
      c2 = null !== c2 ? c2 : Ie;
      if (c2(g2, d2) && a.ref === b2.ref)
        return Zi(a, b2, e);
    }
    b2.flags |= 1;
    a = Pg(f2, d2);
    a.ref = b2.ref;
    a.return = b2;
    return b2.child = a;
  }
  function bj(a, b2, c2, d2, e) {
    if (null !== a) {
      var f2 = a.memoizedProps;
      if (Ie(f2, d2) && a.ref === b2.ref)
        if (dh = false, b2.pendingProps = d2 = f2, 0 !== (a.lanes & e))
          0 !== (a.flags & 131072) && (dh = true);
        else
          return b2.lanes = a.lanes, Zi(a, b2, e);
    }
    return cj(a, b2, c2, d2, e);
  }
  function dj(a, b2, c2) {
    var d2 = b2.pendingProps, e = d2.children, f2 = null !== a ? a.memoizedState : null;
    if ("hidden" === d2.mode)
      if (0 === (b2.mode & 1))
        b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c2;
      else {
        if (0 === (c2 & 1073741824))
          return a = null !== f2 ? f2.baseLanes | c2 : c2, b2.lanes = b2.childLanes = 1073741824, b2.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b2.updateQueue = null, G(ej, fj), fj |= a, null;
        b2.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
        d2 = null !== f2 ? f2.baseLanes : c2;
        G(ej, fj);
        fj |= d2;
      }
    else
      null !== f2 ? (d2 = f2.baseLanes | c2, b2.memoizedState = null) : d2 = c2, G(ej, fj), fj |= d2;
    Xi(a, b2, e, c2);
    return b2.child;
  }
  function gj(a, b2) {
    var c2 = b2.ref;
    if (null === a && null !== c2 || null !== a && a.ref !== c2)
      b2.flags |= 512, b2.flags |= 2097152;
  }
  function cj(a, b2, c2, d2, e) {
    var f2 = Zf(c2) ? Xf : H$1.current;
    f2 = Yf(b2, f2);
    ch(b2, e);
    c2 = Nh(a, b2, c2, d2, f2, e);
    d2 = Sh();
    if (null !== a && !dh)
      return b2.updateQueue = a.updateQueue, b2.flags &= -2053, a.lanes &= ~e, Zi(a, b2, e);
    I$1 && d2 && vg(b2);
    b2.flags |= 1;
    Xi(a, b2, c2, e);
    return b2.child;
  }
  function hj(a, b2, c2, d2, e) {
    if (Zf(c2)) {
      var f2 = true;
      cg(b2);
    } else
      f2 = false;
    ch(b2, e);
    if (null === b2.stateNode)
      ij(a, b2), Gi(b2, c2, d2), Ii(b2, c2, d2, e), d2 = true;
    else if (null === a) {
      var g2 = b2.stateNode, h2 = b2.memoizedProps;
      g2.props = h2;
      var k2 = g2.context, l2 = c2.contextType;
      "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c2) ? Xf : H$1.current, l2 = Yf(b2, l2));
      var m2 = c2.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g2.getSnapshotBeforeUpdate;
      q2 || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== d2 || k2 !== l2) && Hi(b2, g2, d2, l2);
      jh = false;
      var r2 = b2.memoizedState;
      g2.state = r2;
      qh(b2, d2, g2, e);
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
      "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c2) ? Xf : H$1.current, k2 = Yf(b2, k2));
      var y2 = c2.getDerivedStateFromProps;
      (m2 = "function" === typeof y2 || "function" === typeof g2.getSnapshotBeforeUpdate) || "function" !== typeof g2.UNSAFE_componentWillReceiveProps && "function" !== typeof g2.componentWillReceiveProps || (h2 !== q2 || r2 !== k2) && Hi(b2, g2, d2, k2);
      jh = false;
      r2 = b2.memoizedState;
      g2.state = r2;
      qh(b2, d2, g2, e);
      var n2 = b2.memoizedState;
      h2 !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b2, c2, y2, d2), n2 = b2.memoizedState), (l2 = jh || Fi(b2, c2, l2, d2, r2, n2, k2) || false) ? (m2 || "function" !== typeof g2.UNSAFE_componentWillUpdate && "function" !== typeof g2.componentWillUpdate || ("function" === typeof g2.componentWillUpdate && g2.componentWillUpdate(d2, n2, k2), "function" === typeof g2.UNSAFE_componentWillUpdate && g2.UNSAFE_componentWillUpdate(d2, n2, k2)), "function" === typeof g2.componentDidUpdate && (b2.flags |= 4), "function" === typeof g2.getSnapshotBeforeUpdate && (b2.flags |= 1024)) : ("function" !== typeof g2.componentDidUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b2.flags |= 1024), b2.memoizedProps = d2, b2.memoizedState = n2), g2.props = d2, g2.state = n2, g2.context = k2, d2 = l2) : ("function" !== typeof g2.componentDidUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b2.flags |= 4), "function" !== typeof g2.getSnapshotBeforeUpdate || h2 === a.memoizedProps && r2 === a.memoizedState || (b2.flags |= 1024), d2 = false);
    }
    return jj(a, b2, c2, d2, f2, e);
  }
  function jj(a, b2, c2, d2, e, f2) {
    gj(a, b2);
    var g2 = 0 !== (b2.flags & 128);
    if (!d2 && !g2)
      return e && dg(b2, c2, false), Zi(a, b2, f2);
    d2 = b2.stateNode;
    Wi.current = b2;
    var h2 = g2 && "function" !== typeof c2.getDerivedStateFromError ? null : d2.render();
    b2.flags |= 1;
    null !== a && g2 ? (b2.child = Ug(b2, a.child, null, f2), b2.child = Ug(b2, null, h2, f2)) : Xi(a, b2, h2, f2);
    b2.memoizedState = d2.state;
    e && dg(b2, c2, true);
    return b2.child;
  }
  function kj(a) {
    var b2 = a.stateNode;
    b2.pendingContext ? ag(a, b2.pendingContext, b2.pendingContext !== b2.context) : b2.context && ag(a, b2.context, false);
    yh(a, b2.containerInfo);
  }
  function lj(a, b2, c2, d2, e) {
    Ig();
    Jg(e);
    b2.flags |= 256;
    Xi(a, b2, c2, d2);
    return b2.child;
  }
  var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
  function nj(a) {
    return { baseLanes: a, cachePool: null, transitions: null };
  }
  function oj(a, b2, c2) {
    var d2 = b2.pendingProps, e = L$1.current, f2 = false, g2 = 0 !== (b2.flags & 128), h2;
    (h2 = g2) || (h2 = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
    if (h2)
      f2 = true, b2.flags &= -129;
    else if (null === a || null !== a.memoizedState)
      e |= 1;
    G(L$1, e & 1);
    if (null === a) {
      Eg(b2);
      a = b2.memoizedState;
      if (null !== a && (a = a.dehydrated, null !== a))
        return 0 === (b2.mode & 1) ? b2.lanes = 1 : "$!" === a.data ? b2.lanes = 8 : b2.lanes = 1073741824, null;
      g2 = d2.children;
      a = d2.fallback;
      return f2 ? (d2 = b2.mode, f2 = b2.child, g2 = { mode: "hidden", children: g2 }, 0 === (d2 & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g2) : f2 = pj(g2, d2, 0, null), a = Tg(a, d2, c2, null), f2.return = b2, a.return = b2, f2.sibling = a, b2.child = f2, b2.child.memoizedState = nj(c2), b2.memoizedState = mj, a) : qj(b2, g2);
    }
    e = a.memoizedState;
    if (null !== e && (h2 = e.dehydrated, null !== h2))
      return rj(a, b2, g2, d2, h2, e, c2);
    if (f2) {
      f2 = d2.fallback;
      g2 = b2.mode;
      e = a.child;
      h2 = e.sibling;
      var k2 = { mode: "hidden", children: d2.children };
      0 === (g2 & 1) && b2.child !== e ? (d2 = b2.child, d2.childLanes = 0, d2.pendingProps = k2, b2.deletions = null) : (d2 = Pg(e, k2), d2.subtreeFlags = e.subtreeFlags & 14680064);
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
  function rj(a, b2, c2, d2, e, f2, g2) {
    if (c2) {
      if (b2.flags & 256)
        return b2.flags &= -257, d2 = Ki(Error(p$1(422))), sj(a, b2, g2, d2);
      if (null !== b2.memoizedState)
        return b2.child = a.child, b2.flags |= 128, null;
      f2 = d2.fallback;
      e = b2.mode;
      d2 = pj({ mode: "visible", children: d2.children }, e, 0, null);
      f2 = Tg(f2, e, g2, null);
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
    if (0 === (b2.mode & 1))
      return sj(a, b2, g2, null);
    if ("$!" === e.data) {
      d2 = e.nextSibling && e.nextSibling.dataset;
      if (d2)
        var h2 = d2.dgst;
      d2 = h2;
      f2 = Error(p$1(419));
      d2 = Ki(f2, d2, void 0);
      return sj(a, b2, g2, d2);
    }
    h2 = 0 !== (g2 & a.childLanes);
    if (dh || h2) {
      d2 = Q$1;
      if (null !== d2) {
        switch (g2 & -g2) {
          case 4:
            e = 2;
            break;
          case 16:
            e = 8;
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
            e = 32;
            break;
          case 536870912:
            e = 268435456;
            break;
          default:
            e = 0;
        }
        e = 0 !== (e & (d2.suspendedLanes | g2)) ? 0 : e;
        0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d2, a, e, -1));
      }
      tj();
      d2 = Ki(Error(p$1(421)));
      return sj(a, b2, g2, d2);
    }
    if ("$?" === e.data)
      return b2.flags |= 128, b2.child = a.child, b2 = uj.bind(null, a), e._reactRetry = b2, null;
    a = f2.treeContext;
    yg = Lf(e.nextSibling);
    xg = b2;
    I$1 = true;
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
  function wj(a, b2, c2, d2, e) {
    var f2 = a.memoizedState;
    null === f2 ? a.memoizedState = { isBackwards: b2, rendering: null, renderingStartTime: 0, last: d2, tail: c2, tailMode: e } : (f2.isBackwards = b2, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d2, f2.tail = c2, f2.tailMode = e);
  }
  function xj(a, b2, c2) {
    var d2 = b2.pendingProps, e = d2.revealOrder, f2 = d2.tail;
    Xi(a, b2, d2.children, c2);
    d2 = L$1.current;
    if (0 !== (d2 & 2))
      d2 = d2 & 1 | 2, b2.flags |= 128;
    else {
      if (null !== a && 0 !== (a.flags & 128))
        a:
          for (a = b2.child; null !== a; ) {
            if (13 === a.tag)
              null !== a.memoizedState && vj(a, c2, b2);
            else if (19 === a.tag)
              vj(a, c2, b2);
            else if (null !== a.child) {
              a.child.return = a;
              a = a.child;
              continue;
            }
            if (a === b2)
              break a;
            for (; null === a.sibling; ) {
              if (null === a.return || a.return === b2)
                break a;
              a = a.return;
            }
            a.sibling.return = a.return;
            a = a.sibling;
          }
      d2 &= 1;
    }
    G(L$1, d2);
    if (0 === (b2.mode & 1))
      b2.memoizedState = null;
    else
      switch (e) {
        case "forwards":
          c2 = b2.child;
          for (e = null; null !== c2; )
            a = c2.alternate, null !== a && null === Ch(a) && (e = c2), c2 = c2.sibling;
          c2 = e;
          null === c2 ? (e = b2.child, b2.child = null) : (e = c2.sibling, c2.sibling = null);
          wj(b2, false, e, c2, f2);
          break;
        case "backwards":
          c2 = null;
          e = b2.child;
          for (b2.child = null; null !== e; ) {
            a = e.alternate;
            if (null !== a && null === Ch(a)) {
              b2.child = e;
              break;
            }
            a = e.sibling;
            e.sibling = c2;
            c2 = e;
            e = a;
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
    if (0 === (c2 & b2.childLanes))
      return null;
    if (null !== a && b2.child !== a.child)
      throw Error(p$1(153));
    if (null !== b2.child) {
      a = b2.child;
      c2 = Pg(a, a.pendingProps);
      b2.child = c2;
      for (c2.return = b2; null !== a.sibling; )
        a = a.sibling, c2 = c2.sibling = Pg(a, a.pendingProps), c2.return = b2;
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
        var d2 = b2.type._context, e = b2.memoizedProps.value;
        G(Wg, d2._currentValue);
        d2._currentValue = e;
        break;
      case 13:
        d2 = b2.memoizedState;
        if (null !== d2) {
          if (null !== d2.dehydrated)
            return G(L$1, L$1.current & 1), b2.flags |= 128, null;
          if (0 !== (c2 & b2.child.childLanes))
            return oj(a, b2, c2);
          G(L$1, L$1.current & 1);
          a = Zi(a, b2, c2);
          return null !== a ? a.sibling : null;
        }
        G(L$1, L$1.current & 1);
        break;
      case 19:
        d2 = 0 !== (c2 & b2.childLanes);
        if (0 !== (a.flags & 128)) {
          if (d2)
            return xj(a, b2, c2);
          b2.flags |= 128;
        }
        e = b2.memoizedState;
        null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
        G(L$1, L$1.current);
        if (d2)
          break;
        else
          return null;
      case 22:
      case 23:
        return b2.lanes = 0, dj(a, b2, c2);
    }
    return Zi(a, b2, c2);
  }
  var zj, Aj, Bj, Cj;
  zj = function(a, b2) {
    for (var c2 = b2.child; null !== c2; ) {
      if (5 === c2.tag || 6 === c2.tag)
        a.appendChild(c2.stateNode);
      else if (4 !== c2.tag && null !== c2.child) {
        c2.child.return = c2;
        c2 = c2.child;
        continue;
      }
      if (c2 === b2)
        break;
      for (; null === c2.sibling; ) {
        if (null === c2.return || c2.return === b2)
          return;
        c2 = c2.return;
      }
      c2.sibling.return = c2.return;
      c2 = c2.sibling;
    }
  };
  Aj = function() {
  };
  Bj = function(a, b2, c2, d2) {
    var e = a.memoizedProps;
    if (e !== d2) {
      a = b2.stateNode;
      xh(uh.current);
      var f2 = null;
      switch (c2) {
        case "input":
          e = Ya(a, e);
          d2 = Ya(a, d2);
          f2 = [];
          break;
        case "select":
          e = A$1({}, e, { value: void 0 });
          d2 = A$1({}, d2, { value: void 0 });
          f2 = [];
          break;
        case "textarea":
          e = gb(a, e);
          d2 = gb(a, d2);
          f2 = [];
          break;
        default:
          "function" !== typeof e.onClick && "function" === typeof d2.onClick && (a.onclick = Bf);
      }
      ub(c2, d2);
      var g2;
      c2 = null;
      for (l2 in e)
        if (!d2.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2])
          if ("style" === l2) {
            var h2 = e[l2];
            for (g2 in h2)
              h2.hasOwnProperty(g2) && (c2 || (c2 = {}), c2[g2] = "");
          } else
            "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
      for (l2 in d2) {
        var k2 = d2[l2];
        h2 = null != e ? e[l2] : void 0;
        if (d2.hasOwnProperty(l2) && k2 !== h2 && (null != k2 || null != h2))
          if ("style" === l2)
            if (h2) {
              for (g2 in h2)
                !h2.hasOwnProperty(g2) || k2 && k2.hasOwnProperty(g2) || (c2 || (c2 = {}), c2[g2] = "");
              for (g2 in k2)
                k2.hasOwnProperty(g2) && h2[g2] !== k2[g2] && (c2 || (c2 = {}), c2[g2] = k2[g2]);
            } else
              c2 || (f2 || (f2 = []), f2.push(
                l2,
                c2
              )), c2 = k2;
          else
            "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h2 = h2 ? h2.__html : void 0, null != k2 && h2 !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D$1("scroll", a), f2 || h2 === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
      }
      c2 && (f2 = f2 || []).push("style", c2);
      var l2 = f2;
      if (b2.updateQueue = l2)
        b2.flags |= 4;
    }
  };
  Cj = function(a, b2, c2, d2) {
    c2 !== d2 && (b2.flags |= 4);
  };
  function Dj(a, b2) {
    if (!I$1)
      switch (a.tailMode) {
        case "hidden":
          b2 = a.tail;
          for (var c2 = null; null !== b2; )
            null !== b2.alternate && (c2 = b2), b2 = b2.sibling;
          null === c2 ? a.tail = null : c2.sibling = null;
          break;
        case "collapsed":
          c2 = a.tail;
          for (var d2 = null; null !== c2; )
            null !== c2.alternate && (d2 = c2), c2 = c2.sibling;
          null === d2 ? b2 || null === a.tail ? a.tail = null : a.tail.sibling = null : d2.sibling = null;
      }
  }
  function S$1(a) {
    var b2 = null !== a.alternate && a.alternate.child === a.child, c2 = 0, d2 = 0;
    if (b2)
      for (var e = a.child; null !== e; )
        c2 |= e.lanes | e.childLanes, d2 |= e.subtreeFlags & 14680064, d2 |= e.flags & 14680064, e.return = a, e = e.sibling;
    else
      for (e = a.child; null !== e; )
        c2 |= e.lanes | e.childLanes, d2 |= e.subtreeFlags, d2 |= e.flags, e.return = a, e = e.sibling;
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
        return S$1(b2), null;
      case 1:
        return Zf(b2.type) && $f(), S$1(b2), null;
      case 3:
        d2 = b2.stateNode;
        zh();
        E$1(Wf);
        E$1(H$1);
        Eh();
        d2.pendingContext && (d2.context = d2.pendingContext, d2.pendingContext = null);
        if (null === a || null === a.child)
          Gg(b2) ? b2.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b2.flags & 256) || (b2.flags |= 1024, null !== zg && (Fj(zg), zg = null));
        Aj(a, b2);
        S$1(b2);
        return null;
      case 5:
        Bh(b2);
        var e = xh(wh.current);
        c2 = b2.type;
        if (null !== a && null != b2.stateNode)
          Bj(a, b2, c2, d2, e), a.ref !== b2.ref && (b2.flags |= 512, b2.flags |= 2097152);
        else {
          if (!d2) {
            if (null === b2.stateNode)
              throw Error(p$1(166));
            S$1(b2);
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
                D$1("cancel", d2);
                D$1("close", d2);
                break;
              case "iframe":
              case "object":
              case "embed":
                D$1("load", d2);
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++)
                  D$1(lf[e], d2);
                break;
              case "source":
                D$1("error", d2);
                break;
              case "img":
              case "image":
              case "link":
                D$1(
                  "error",
                  d2
                );
                D$1("load", d2);
                break;
              case "details":
                D$1("toggle", d2);
                break;
              case "input":
                Za(d2, f2);
                D$1("invalid", d2);
                break;
              case "select":
                d2._wrapperState = { wasMultiple: !!f2.multiple };
                D$1("invalid", d2);
                break;
              case "textarea":
                hb(d2, f2), D$1("invalid", d2);
            }
            ub(c2, f2);
            e = null;
            for (var g2 in f2)
              if (f2.hasOwnProperty(g2)) {
                var h2 = f2[g2];
                "children" === g2 ? "string" === typeof h2 ? d2.textContent !== h2 && (true !== f2.suppressHydrationWarning && Af(d2.textContent, h2, a), e = ["children", h2]) : "number" === typeof h2 && d2.textContent !== "" + h2 && (true !== f2.suppressHydrationWarning && Af(
                  d2.textContent,
                  h2,
                  a
                ), e = ["children", "" + h2]) : ea.hasOwnProperty(g2) && null != h2 && "onScroll" === g2 && D$1("scroll", d2);
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
            d2 = e;
            b2.updateQueue = d2;
            null !== d2 && (b2.flags |= 4);
          } else {
            g2 = 9 === e.nodeType ? e : e.ownerDocument;
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
                  D$1("cancel", a);
                  D$1("close", a);
                  e = d2;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  D$1("load", a);
                  e = d2;
                  break;
                case "video":
                case "audio":
                  for (e = 0; e < lf.length; e++)
                    D$1(lf[e], a);
                  e = d2;
                  break;
                case "source":
                  D$1("error", a);
                  e = d2;
                  break;
                case "img":
                case "image":
                case "link":
                  D$1(
                    "error",
                    a
                  );
                  D$1("load", a);
                  e = d2;
                  break;
                case "details":
                  D$1("toggle", a);
                  e = d2;
                  break;
                case "input":
                  Za(a, d2);
                  e = Ya(a, d2);
                  D$1("invalid", a);
                  break;
                case "option":
                  e = d2;
                  break;
                case "select":
                  a._wrapperState = { wasMultiple: !!d2.multiple };
                  e = A$1({}, d2, { value: void 0 });
                  D$1("invalid", a);
                  break;
                case "textarea":
                  hb(a, d2);
                  e = gb(a, d2);
                  D$1("invalid", a);
                  break;
                default:
                  e = d2;
              }
              ub(c2, e);
              h2 = e;
              for (f2 in h2)
                if (h2.hasOwnProperty(f2)) {
                  var k2 = h2[f2];
                  "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c2 || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D$1("scroll", a) : null != k2 && ta(a, f2, k2, g2));
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
                  "function" === typeof e.onClick && (a.onclick = Bf);
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
        S$1(b2);
        return null;
      case 6:
        if (a && null != b2.stateNode)
          Cj(a, b2, a.memoizedProps, d2);
        else {
          if ("string" !== typeof d2 && null === b2.stateNode)
            throw Error(p$1(166));
          c2 = xh(wh.current);
          xh(uh.current);
          if (Gg(b2)) {
            d2 = b2.stateNode;
            c2 = b2.memoizedProps;
            d2[Of] = b2;
            if (f2 = d2.nodeValue !== c2) {
              if (a = xg, null !== a)
                switch (a.tag) {
                  case 3:
                    Af(d2.nodeValue, c2, 0 !== (a.mode & 1));
                    break;
                  case 5:
                    true !== a.memoizedProps.suppressHydrationWarning && Af(d2.nodeValue, c2, 0 !== (a.mode & 1));
                }
            }
            f2 && (b2.flags |= 4);
          } else
            d2 = (9 === c2.nodeType ? c2 : c2.ownerDocument).createTextNode(d2), d2[Of] = b2, b2.stateNode = d2;
        }
        S$1(b2);
        return null;
      case 13:
        E$1(L$1);
        d2 = b2.memoizedState;
        if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
          if (I$1 && null !== yg && 0 !== (b2.mode & 1) && 0 === (b2.flags & 128))
            Hg(), Ig(), b2.flags |= 98560, f2 = false;
          else if (f2 = Gg(b2), null !== d2 && null !== d2.dehydrated) {
            if (null === a) {
              if (!f2)
                throw Error(p$1(318));
              f2 = b2.memoizedState;
              f2 = null !== f2 ? f2.dehydrated : null;
              if (!f2)
                throw Error(p$1(317));
              f2[Of] = b2;
            } else
              Ig(), 0 === (b2.flags & 128) && (b2.memoizedState = null), b2.flags |= 4;
            S$1(b2);
            f2 = false;
          } else
            null !== zg && (Fj(zg), zg = null), f2 = true;
          if (!f2)
            return b2.flags & 65536 ? b2 : null;
        }
        if (0 !== (b2.flags & 128))
          return b2.lanes = c2, b2;
        d2 = null !== d2;
        d2 !== (null !== a && null !== a.memoizedState) && d2 && (b2.child.flags |= 8192, 0 !== (b2.mode & 1) && (null === a || 0 !== (L$1.current & 1) ? 0 === T$1 && (T$1 = 3) : tj()));
        null !== b2.updateQueue && (b2.flags |= 4);
        S$1(b2);
        return null;
      case 4:
        return zh(), Aj(a, b2), null === a && sf(b2.stateNode.containerInfo), S$1(b2), null;
      case 10:
        return ah(b2.type._context), S$1(b2), null;
      case 17:
        return Zf(b2.type) && $f(), S$1(b2), null;
      case 19:
        E$1(L$1);
        f2 = b2.memoizedState;
        if (null === f2)
          return S$1(b2), null;
        d2 = 0 !== (b2.flags & 128);
        g2 = f2.rendering;
        if (null === g2)
          if (d2)
            Dj(f2, false);
          else {
            if (0 !== T$1 || null !== a && 0 !== (a.flags & 128))
              for (a = b2.child; null !== a; ) {
                g2 = Ch(a);
                if (null !== g2) {
                  b2.flags |= 128;
                  Dj(f2, false);
                  d2 = g2.updateQueue;
                  null !== d2 && (b2.updateQueue = d2, b2.flags |= 4);
                  b2.subtreeFlags = 0;
                  d2 = c2;
                  for (c2 = b2.child; null !== c2; )
                    f2 = c2, a = d2, f2.flags &= 14680066, g2 = f2.alternate, null === g2 ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g2.childLanes, f2.lanes = g2.lanes, f2.child = g2.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g2.memoizedProps, f2.memoizedState = g2.memoizedState, f2.updateQueue = g2.updateQueue, f2.type = g2.type, a = g2.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c2 = c2.sibling;
                  G(L$1, L$1.current & 1 | 2);
                  return b2.child;
                }
                a = a.sibling;
              }
            null !== f2.tail && B$1() > Gj && (b2.flags |= 128, d2 = true, Dj(f2, false), b2.lanes = 4194304);
          }
        else {
          if (!d2)
            if (a = Ch(g2), null !== a) {
              if (b2.flags |= 128, d2 = true, c2 = a.updateQueue, null !== c2 && (b2.updateQueue = c2, b2.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g2.alternate && !I$1)
                return S$1(b2), null;
            } else
              2 * B$1() - f2.renderingStartTime > Gj && 1073741824 !== c2 && (b2.flags |= 128, d2 = true, Dj(f2, false), b2.lanes = 4194304);
          f2.isBackwards ? (g2.sibling = b2.child, b2.child = g2) : (c2 = f2.last, null !== c2 ? c2.sibling = g2 : b2.child = g2, f2.last = g2);
        }
        if (null !== f2.tail)
          return b2 = f2.tail, f2.rendering = b2, f2.tail = b2.sibling, f2.renderingStartTime = B$1(), b2.sibling = null, c2 = L$1.current, G(L$1, d2 ? c2 & 1 | 2 : c2 & 1), b2;
        S$1(b2);
        return null;
      case 22:
      case 23:
        return Hj(), d2 = null !== b2.memoizedState, null !== a && null !== a.memoizedState !== d2 && (b2.flags |= 8192), d2 && 0 !== (b2.mode & 1) ? 0 !== (fj & 1073741824) && (S$1(b2), b2.subtreeFlags & 6 && (b2.flags |= 8192)) : S$1(b2), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(p$1(156, b2.tag));
  }
  function Ij(a, b2) {
    wg(b2);
    switch (b2.tag) {
      case 1:
        return Zf(b2.type) && $f(), a = b2.flags, a & 65536 ? (b2.flags = a & -65537 | 128, b2) : null;
      case 3:
        return zh(), E$1(Wf), E$1(H$1), Eh(), a = b2.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b2.flags = a & -65537 | 128, b2) : null;
      case 5:
        return Bh(b2), null;
      case 13:
        E$1(L$1);
        a = b2.memoizedState;
        if (null !== a && null !== a.dehydrated) {
          if (null === b2.alternate)
            throw Error(p$1(340));
          Ig();
        }
        a = b2.flags;
        return a & 65536 ? (b2.flags = a & -65537 | 128, b2) : null;
      case 19:
        return E$1(L$1), null;
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
    if (null !== c2)
      if ("function" === typeof c2)
        try {
          c2(null);
        } catch (d2) {
          W(a, b2, d2);
        }
      else
        c2.current = null;
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
      if ("selectionStart" in a)
        var c2 = { start: a.selectionStart, end: a.selectionEnd };
      else
        a: {
          c2 = (c2 = a.ownerDocument) && c2.defaultView || window;
          var d2 = c2.getSelection && c2.getSelection();
          if (d2 && 0 !== d2.rangeCount) {
            c2 = d2.anchorNode;
            var e = d2.anchorOffset, f2 = d2.focusNode;
            d2 = d2.focusOffset;
            try {
              c2.nodeType, f2.nodeType;
            } catch (F2) {
              c2 = null;
              break a;
            }
            var g2 = 0, h2 = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
            b:
              for (; ; ) {
                for (var y2; ; ) {
                  q2 !== c2 || 0 !== e && 3 !== q2.nodeType || (h2 = g2 + e);
                  q2 !== f2 || 0 !== d2 && 3 !== q2.nodeType || (k2 = g2 + d2);
                  3 === q2.nodeType && (g2 += q2.nodeValue.length);
                  if (null === (y2 = q2.firstChild))
                    break;
                  r2 = q2;
                  q2 = y2;
                }
                for (; ; ) {
                  if (q2 === a)
                    break b;
                  r2 === c2 && ++l2 === e && (h2 = g2);
                  r2 === f2 && ++m2 === d2 && (k2 = g2);
                  if (null !== (y2 = q2.nextSibling))
                    break;
                  q2 = r2;
                  r2 = q2.parentNode;
                }
                q2 = y2;
              }
            c2 = -1 === h2 || -1 === k2 ? null : { start: h2, end: k2 };
          } else
            c2 = null;
        }
      c2 = c2 || { start: 0, end: 0 };
    } else
      c2 = null;
    Df = { focusedElem: a, selectionRange: c2 };
    dd = false;
    for (V = b2; null !== V; )
      if (b2 = V, a = b2.child, 0 !== (b2.subtreeFlags & 1028) && null !== a)
        a.return = b2, V = a;
      else
        for (; null !== V; ) {
          b2 = V;
          try {
            var n2 = b2.alternate;
            if (0 !== (b2.flags & 1024))
              switch (b2.tag) {
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
                  throw Error(p$1(163));
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
      var e = d2 = d2.next;
      do {
        if ((e.tag & a) === a) {
          var f2 = e.destroy;
          e.destroy = void 0;
          void 0 !== f2 && Mj(b2, c2, f2);
        }
        e = e.next;
      } while (e !== d2);
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
    a:
      for (; ; ) {
        for (; null === a.sibling; ) {
          if (null === a.return || Tj(a.return))
            return null;
          a = a.return;
        }
        a.sibling.return = a.return;
        for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
          if (a.flags & 2)
            continue a;
          if (null === a.child || 4 === a.tag)
            continue a;
          else
            a.child.return = a, a = a.child;
        }
        if (!(a.flags & 2))
          return a.stateNode;
      }
  }
  function Vj(a, b2, c2) {
    var d2 = a.tag;
    if (5 === d2 || 6 === d2)
      a = a.stateNode, b2 ? 8 === c2.nodeType ? c2.parentNode.insertBefore(a, b2) : c2.insertBefore(a, b2) : (8 === c2.nodeType ? (b2 = c2.parentNode, b2.insertBefore(a, c2)) : (b2 = c2, b2.appendChild(a)), c2 = c2._reactRootContainer, null !== c2 && void 0 !== c2 || null !== b2.onclick || (b2.onclick = Bf));
    else if (4 !== d2 && (a = a.child, null !== a))
      for (Vj(a, b2, c2), a = a.sibling; null !== a; )
        Vj(a, b2, c2), a = a.sibling;
  }
  function Wj(a, b2, c2) {
    var d2 = a.tag;
    if (5 === d2 || 6 === d2)
      a = a.stateNode, b2 ? c2.insertBefore(a, b2) : c2.appendChild(a);
    else if (4 !== d2 && (a = a.child, null !== a))
      for (Wj(a, b2, c2), a = a.sibling; null !== a; )
        Wj(a, b2, c2), a = a.sibling;
  }
  var X = null, Xj = false;
  function Yj(a, b2, c2) {
    for (c2 = c2.child; null !== c2; )
      Zj(a, b2, c2), c2 = c2.sibling;
  }
  function Zj(a, b2, c2) {
    if (lc && "function" === typeof lc.onCommitFiberUnmount)
      try {
        lc.onCommitFiberUnmount(kc, c2);
      } catch (h2) {
      }
    switch (c2.tag) {
      case 5:
        U || Lj(c2, b2);
      case 6:
        var d2 = X, e = Xj;
        X = null;
        Yj(a, b2, c2);
        X = d2;
        Xj = e;
        null !== X && (Xj ? (a = X, c2 = c2.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c2) : a.removeChild(c2)) : X.removeChild(c2.stateNode));
        break;
      case 18:
        null !== X && (Xj ? (a = X, c2 = c2.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c2) : 1 === a.nodeType && Kf(a, c2), bd(a)) : Kf(X, c2.stateNode));
        break;
      case 4:
        d2 = X;
        e = Xj;
        X = c2.stateNode.containerInfo;
        Xj = true;
        Yj(a, b2, c2);
        X = d2;
        Xj = e;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!U && (d2 = c2.updateQueue, null !== d2 && (d2 = d2.lastEffect, null !== d2))) {
          e = d2 = d2.next;
          do {
            var f2 = e, g2 = f2.destroy;
            f2 = f2.tag;
            void 0 !== g2 && (0 !== (f2 & 2) ? Mj(c2, b2, g2) : 0 !== (f2 & 4) && Mj(c2, b2, g2));
            e = e.next;
          } while (e !== d2);
        }
        Yj(a, b2, c2);
        break;
      case 1:
        if (!U && (Lj(c2, b2), d2 = c2.stateNode, "function" === typeof d2.componentWillUnmount))
          try {
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
    if (null !== c2)
      for (var d2 = 0; d2 < c2.length; d2++) {
        var e = c2[d2];
        try {
          var f2 = a, g2 = b2, h2 = g2;
          a:
            for (; null !== h2; ) {
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
          if (null === X)
            throw Error(p$1(160));
          Zj(f2, g2, e);
          X = null;
          Xj = false;
          var k2 = e.alternate;
          null !== k2 && (k2.return = null);
          e.return = null;
        } catch (l2) {
          W(e, b2, l2);
        }
      }
    if (b2.subtreeFlags & 12854)
      for (b2 = b2.child; null !== b2; )
        dk(b2, a), b2 = b2.sibling;
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
          var e = a.stateNode;
          try {
            ob(e, "");
          } catch (t2) {
            W(a, a.return, t2);
          }
        }
        if (d2 & 4 && (e = a.stateNode, null != e)) {
          var f2 = a.memoizedProps, g2 = null !== c2 ? c2.memoizedProps : f2, h2 = a.type, k2 = a.updateQueue;
          a.updateQueue = null;
          if (null !== k2)
            try {
              "input" === h2 && "radio" === f2.type && null != f2.name && ab(e, f2);
              vb(h2, g2);
              var l2 = vb(h2, f2);
              for (g2 = 0; g2 < k2.length; g2 += 2) {
                var m2 = k2[g2], q2 = k2[g2 + 1];
                "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
              }
              switch (h2) {
                case "input":
                  bb(e, f2);
                  break;
                case "textarea":
                  ib(e, f2);
                  break;
                case "select":
                  var r2 = e._wrapperState.wasMultiple;
                  e._wrapperState.wasMultiple = !!f2.multiple;
                  var y2 = f2.value;
                  null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                    e,
                    !!f2.multiple,
                    f2.defaultValue,
                    true
                  ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
              }
              e[Pf] = f2;
            } catch (t2) {
              W(a, a.return, t2);
            }
        }
        break;
      case 6:
        ck(b2, a);
        ek(a);
        if (d2 & 4) {
          if (null === a.stateNode)
            throw Error(p$1(162));
          e = a.stateNode;
          f2 = a.memoizedProps;
          try {
            e.nodeValue = f2;
          } catch (t2) {
            W(a, a.return, t2);
          }
        }
        break;
      case 3:
        ck(b2, a);
        ek(a);
        if (d2 & 4 && null !== c2 && c2.memoizedState.isDehydrated)
          try {
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
        e = a.child;
        e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B$1()));
        d2 & 4 && ak(a);
        break;
      case 22:
        m2 = null !== c2 && null !== c2.memoizedState;
        a.mode & 1 ? (U = (l2 = U) || m2, ck(b2, a), U = l2) : ck(b2, a);
        ek(a);
        if (d2 & 8192) {
          l2 = null !== a.memoizedState;
          if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1))
            for (V = a, m2 = a.child; null !== m2; ) {
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
          a:
            for (m2 = null, q2 = a; ; ) {
              if (5 === q2.tag) {
                if (null === m2) {
                  m2 = q2;
                  try {
                    e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h2 = q2.stateNode, k2 = q2.memoizedProps.style, g2 = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h2.style.display = rb("display", g2));
                  } catch (t2) {
                    W(a, a.return, t2);
                  }
                }
              } else if (6 === q2.tag) {
                if (null === m2)
                  try {
                    q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
                  } catch (t2) {
                    W(a, a.return, t2);
                  }
              } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
                q2.child.return = q2;
                q2 = q2.child;
                continue;
              }
              if (q2 === a)
                break a;
              for (; null === q2.sibling; ) {
                if (null === q2.return || q2.return === a)
                  break a;
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
          throw Error(p$1(160));
        }
        switch (d2.tag) {
          case 5:
            var e = d2.stateNode;
            d2.flags & 32 && (ob(e, ""), d2.flags &= -33);
            var f2 = Uj(a);
            Wj(a, f2, e);
            break;
          case 3:
          case 4:
            var g2 = d2.stateNode.containerInfo, h2 = Uj(a);
            Vj(a, h2, g2);
            break;
          default:
            throw Error(p$1(161));
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
      var e = V, f2 = e.child;
      if (22 === e.tag && d2) {
        var g2 = null !== e.memoizedState || Jj;
        if (!g2) {
          var h2 = e.alternate, k2 = null !== h2 && null !== h2.memoizedState || U;
          h2 = Jj;
          var l2 = U;
          Jj = g2;
          if ((U = k2) && !l2)
            for (V = e; null !== V; )
              g2 = V, k2 = g2.child, 22 === g2.tag && null !== g2.memoizedState ? jk(e) : null !== k2 ? (k2.return = g2, V = k2) : jk(e);
          for (; null !== f2; )
            V = f2, ik(f2), f2 = f2.sibling;
          V = e;
          Jj = h2;
          U = l2;
        }
        kk(a);
      } else
        0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
    }
  }
  function kk(a) {
    for (; null !== V; ) {
      var b2 = V;
      if (0 !== (b2.flags & 8772)) {
        var c2 = b2.alternate;
        try {
          if (0 !== (b2.flags & 8772))
            switch (b2.tag) {
              case 0:
              case 11:
              case 15:
                U || Qj(5, b2);
                break;
              case 1:
                var d2 = b2.stateNode;
                if (b2.flags & 4 && !U)
                  if (null === c2)
                    d2.componentDidMount();
                  else {
                    var e = b2.elementType === b2.type ? c2.memoizedProps : Ci(b2.type, c2.memoizedProps);
                    d2.componentDidUpdate(e, c2.memoizedState, d2.__reactInternalSnapshotBeforeUpdate);
                  }
                var f2 = b2.updateQueue;
                null !== f2 && sh(b2, f2, d2);
                break;
              case 3:
                var g2 = b2.updateQueue;
                if (null !== g2) {
                  c2 = null;
                  if (null !== b2.child)
                    switch (b2.child.tag) {
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
                throw Error(p$1(163));
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
              var e = b2.return;
              try {
                d2.componentDidMount();
              } catch (k2) {
                W(b2, e, k2);
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
  var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q$1 = null, Y$1 = null, Z = 0, fj = 0, ej = Uf(0), T$1 = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
  function R$1() {
    return 0 !== (K & 6) ? B$1() : -1 !== Ak ? Ak : Ak = B$1();
  }
  function yi(a) {
    if (0 === (a.mode & 1))
      return 1;
    if (0 !== (K & 2) && 0 !== Z)
      return Z & -Z;
    if (null !== Kg.transition)
      return 0 === Bk && (Bk = yc()), Bk;
    a = C$1;
    if (0 !== a)
      return a;
    a = window.event;
    a = void 0 === a ? 16 : jd(a.type);
    return a;
  }
  function gi(a, b2, c2, d2) {
    if (50 < yk)
      throw yk = 0, zk = null, Error(p$1(185));
    Ac(a, c2, d2);
    if (0 === (K & 2) || a !== Q$1)
      a === Q$1 && (0 === (K & 2) && (qk |= c2), 4 === T$1 && Ck(a, Z)), Dk(a, d2), 1 === c2 && 0 === K && 0 === (b2.mode & 1) && (Gj = B$1() + 500, fg && jg());
  }
  function Dk(a, b2) {
    var c2 = a.callbackNode;
    wc(a, b2);
    var d2 = uc(a, a === Q$1 ? Z : 0);
    if (0 === d2)
      null !== c2 && bc(c2), a.callbackNode = null, a.callbackPriority = 0;
    else if (b2 = d2 & -d2, a.callbackPriority !== b2) {
      null != c2 && bc(c2);
      if (1 === b2)
        0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
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
    if (0 !== (K & 6))
      throw Error(p$1(327));
    var c2 = a.callbackNode;
    if (Hk() && a.callbackNode !== c2)
      return null;
    var d2 = uc(a, a === Q$1 ? Z : 0);
    if (0 === d2)
      return null;
    if (0 !== (d2 & 30) || 0 !== (d2 & a.expiredLanes) || b2)
      b2 = Ik(a, d2);
    else {
      b2 = d2;
      var e = K;
      K |= 2;
      var f2 = Jk();
      if (Q$1 !== a || Z !== b2)
        uk = null, Gj = B$1() + 500, Kk(a, b2);
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
      K = e;
      null !== Y$1 ? b2 = 0 : (Q$1 = null, Z = 0, b2 = T$1);
    }
    if (0 !== b2) {
      2 === b2 && (e = xc(a), 0 !== e && (d2 = e, b2 = Nk(a, e)));
      if (1 === b2)
        throw c2 = pk, Kk(a, 0), Ck(a, d2), Dk(a, B$1()), c2;
      if (6 === b2)
        Ck(a, d2);
      else {
        e = a.current.alternate;
        if (0 === (d2 & 30) && !Ok(e) && (b2 = Ik(a, d2), 2 === b2 && (f2 = xc(a), 0 !== f2 && (d2 = f2, b2 = Nk(a, f2))), 1 === b2))
          throw c2 = pk, Kk(a, 0), Ck(a, d2), Dk(a, B$1()), c2;
        a.finishedWork = e;
        a.finishedLanes = d2;
        switch (b2) {
          case 0:
          case 1:
            throw Error(p$1(345));
          case 2:
            Pk(a, tk, uk);
            break;
          case 3:
            Ck(a, d2);
            if ((d2 & 130023424) === d2 && (b2 = fk + 500 - B$1(), 10 < b2)) {
              if (0 !== uc(a, 0))
                break;
              e = a.suspendedLanes;
              if ((e & d2) !== d2) {
                R$1();
                a.pingedLanes |= a.suspendedLanes & e;
                break;
              }
              a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b2);
              break;
            }
            Pk(a, tk, uk);
            break;
          case 4:
            Ck(a, d2);
            if ((d2 & 4194240) === d2)
              break;
            b2 = a.eventTimes;
            for (e = -1; 0 < d2; ) {
              var g2 = 31 - oc(d2);
              f2 = 1 << g2;
              g2 = b2[g2];
              g2 > e && (e = g2);
              d2 &= ~f2;
            }
            d2 = e;
            d2 = B$1() - d2;
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
            throw Error(p$1(329));
        }
      }
    }
    Dk(a, B$1());
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
        if (null !== c2 && (c2 = c2.stores, null !== c2))
          for (var d2 = 0; d2 < c2.length; d2++) {
            var e = c2[d2], f2 = e.getSnapshot;
            e = e.value;
            try {
              if (!He(f2(), e))
                return false;
            } catch (g2) {
              return false;
            }
          }
      }
      c2 = b2.child;
      if (b2.subtreeFlags & 16384 && null !== c2)
        c2.return = b2, b2 = c2;
      else {
        if (b2 === a)
          break;
        for (; null === b2.sibling; ) {
          if (null === b2.return || b2.return === a)
            return true;
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
    if (0 !== (K & 6))
      throw Error(p$1(327));
    Hk();
    var b2 = uc(a, 0);
    if (0 === (b2 & 1))
      return Dk(a, B$1()), null;
    var c2 = Ik(a, b2);
    if (0 !== a.tag && 2 === c2) {
      var d2 = xc(a);
      0 !== d2 && (b2 = d2, c2 = Nk(a, d2));
    }
    if (1 === c2)
      throw c2 = pk, Kk(a, 0), Ck(a, b2), Dk(a, B$1()), c2;
    if (6 === c2)
      throw Error(p$1(345));
    a.finishedWork = a.current.alternate;
    a.finishedLanes = b2;
    Pk(a, tk, uk);
    Dk(a, B$1());
    return null;
  }
  function Qk(a, b2) {
    var c2 = K;
    K |= 1;
    try {
      return a(b2);
    } finally {
      K = c2, 0 === K && (Gj = B$1() + 500, fg && jg());
    }
  }
  function Rk(a) {
    null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
    var b2 = K;
    K |= 1;
    var c2 = ok.transition, d2 = C$1;
    try {
      if (ok.transition = null, C$1 = 1, a)
        return a();
    } finally {
      C$1 = d2, ok.transition = c2, K = b2, 0 === (K & 6) && jg();
    }
  }
  function Hj() {
    fj = ej.current;
    E$1(ej);
  }
  function Kk(a, b2) {
    a.finishedWork = null;
    a.finishedLanes = 0;
    var c2 = a.timeoutHandle;
    -1 !== c2 && (a.timeoutHandle = -1, Gf(c2));
    if (null !== Y$1)
      for (c2 = Y$1.return; null !== c2; ) {
        var d2 = c2;
        wg(d2);
        switch (d2.tag) {
          case 1:
            d2 = d2.type.childContextTypes;
            null !== d2 && void 0 !== d2 && $f();
            break;
          case 3:
            zh();
            E$1(Wf);
            E$1(H$1);
            Eh();
            break;
          case 5:
            Bh(d2);
            break;
          case 4:
            zh();
            break;
          case 13:
            E$1(L$1);
            break;
          case 19:
            E$1(L$1);
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
    Q$1 = a;
    Y$1 = a = Pg(a.current, null);
    Z = fj = b2;
    T$1 = 0;
    pk = null;
    rk = qk = rh = 0;
    tk = sk = null;
    if (null !== fh) {
      for (b2 = 0; b2 < fh.length; b2++)
        if (c2 = fh[b2], d2 = c2.interleaved, null !== d2) {
          c2.interleaved = null;
          var e = d2.next, f2 = c2.pending;
          if (null !== f2) {
            var g2 = f2.next;
            f2.next = e;
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
      var c2 = Y$1;
      try {
        $g();
        Fh.current = Rh;
        if (Ih) {
          for (var d2 = M$1.memoizedState; null !== d2; ) {
            var e = d2.queue;
            null !== e && (e.pending = null);
            d2 = d2.next;
          }
          Ih = false;
        }
        Hh = 0;
        O$1 = N$1 = M$1 = null;
        Jh = false;
        Kh = 0;
        nk.current = null;
        if (null === c2 || null === c2.return) {
          T$1 = 1;
          pk = b2;
          Y$1 = null;
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
              } else
                n2.add(k2);
              break a;
            } else {
              if (0 === (b2 & 1)) {
                Si(f2, l2, b2);
                tj();
                break a;
              }
              k2 = Error(p$1(426));
            }
          } else if (I$1 && h2.mode & 1) {
            var J2 = Ui(g2);
            if (null !== J2) {
              0 === (J2.flags & 65536) && (J2.flags |= 256);
              Vi(J2, g2, h2, f2, b2);
              Jg(Ji(k2, h2));
              break a;
            }
          }
          f2 = k2 = Ji(k2, h2);
          4 !== T$1 && (T$1 = 2);
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
        Y$1 === c2 && null !== c2 && (Y$1 = c2 = c2.return);
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
    if (0 === T$1 || 3 === T$1 || 2 === T$1)
      T$1 = 4;
    null === Q$1 || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q$1, Z);
  }
  function Ik(a, b2) {
    var c2 = K;
    K |= 2;
    var d2 = Jk();
    if (Q$1 !== a || Z !== b2)
      uk = null, Kk(a, b2);
    do
      try {
        Tk();
        break;
      } catch (e) {
        Mk(a, e);
      }
    while (1);
    $g();
    K = c2;
    mk.current = d2;
    if (null !== Y$1)
      throw Error(p$1(261));
    Q$1 = null;
    Z = 0;
    return T$1;
  }
  function Tk() {
    for (; null !== Y$1; )
      Uk(Y$1);
  }
  function Lk() {
    for (; null !== Y$1 && !cc(); )
      Uk(Y$1);
  }
  function Uk(a) {
    var b2 = Vk(a.alternate, a, fj);
    a.memoizedProps = a.pendingProps;
    null === b2 ? Sk(a) : Y$1 = b2;
    nk.current = null;
  }
  function Sk(a) {
    var b2 = a;
    do {
      var c2 = b2.alternate;
      a = b2.return;
      if (0 === (b2.flags & 32768)) {
        if (c2 = Ej(c2, b2, fj), null !== c2) {
          Y$1 = c2;
          return;
        }
      } else {
        c2 = Ij(c2, b2);
        if (null !== c2) {
          c2.flags &= 32767;
          Y$1 = c2;
          return;
        }
        if (null !== a)
          a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
        else {
          T$1 = 6;
          Y$1 = null;
          return;
        }
      }
      b2 = b2.sibling;
      if (null !== b2) {
        Y$1 = b2;
        return;
      }
      Y$1 = b2 = a;
    } while (null !== b2);
    0 === T$1 && (T$1 = 5);
  }
  function Pk(a, b2, c2) {
    var d2 = C$1, e = ok.transition;
    try {
      ok.transition = null, C$1 = 1, Wk(a, b2, c2, d2);
    } finally {
      ok.transition = e, C$1 = d2;
    }
    return null;
  }
  function Wk(a, b2, c2, d2) {
    do
      Hk();
    while (null !== wk);
    if (0 !== (K & 6))
      throw Error(p$1(327));
    c2 = a.finishedWork;
    var e = a.finishedLanes;
    if (null === c2)
      return null;
    a.finishedWork = null;
    a.finishedLanes = 0;
    if (c2 === a.current)
      throw Error(p$1(177));
    a.callbackNode = null;
    a.callbackPriority = 0;
    var f2 = c2.lanes | c2.childLanes;
    Bc(a, f2);
    a === Q$1 && (Y$1 = Q$1 = null, Z = 0);
    0 === (c2.subtreeFlags & 2064) && 0 === (c2.flags & 2064) || vk || (vk = true, Fk(hc, function() {
      Hk();
      return null;
    }));
    f2 = 0 !== (c2.flags & 15990);
    if (0 !== (c2.subtreeFlags & 15990) || f2) {
      f2 = ok.transition;
      ok.transition = null;
      var g2 = C$1;
      C$1 = 1;
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
      C$1 = g2;
      ok.transition = f2;
    } else
      a.current = c2;
    vk && (vk = false, wk = a, xk = e);
    f2 = a.pendingLanes;
    0 === f2 && (Ri = null);
    mc(c2.stateNode);
    Dk(a, B$1());
    if (null !== b2)
      for (d2 = a.onRecoverableError, c2 = 0; c2 < b2.length; c2++)
        e = b2[c2], d2(e.value, { componentStack: e.stack, digest: e.digest });
    if (Oi)
      throw Oi = false, a = Pi, Pi = null, a;
    0 !== (xk & 1) && 0 !== a.tag && Hk();
    f2 = a.pendingLanes;
    0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
    jg();
    return null;
  }
  function Hk() {
    if (null !== wk) {
      var a = Dc(xk), b2 = ok.transition, c2 = C$1;
      try {
        ok.transition = null;
        C$1 = 16 > a ? 16 : a;
        if (null === wk)
          var d2 = false;
        else {
          a = wk;
          wk = null;
          xk = 0;
          if (0 !== (K & 6))
            throw Error(p$1(331));
          var e = K;
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
                    if (null !== q2)
                      q2.return = m2, V = q2;
                    else
                      for (; null !== V; ) {
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
            if (0 !== (f2.subtreeFlags & 2064) && null !== g2)
              g2.return = f2, V = g2;
            else
              b:
                for (; null !== V; ) {
                  f2 = V;
                  if (0 !== (f2.flags & 2048))
                    switch (f2.tag) {
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
            if (0 !== (g2.subtreeFlags & 2064) && null !== u2)
              u2.return = g2, V = u2;
            else
              b:
                for (g2 = w2; null !== V; ) {
                  h2 = V;
                  if (0 !== (h2.flags & 2048))
                    try {
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
          K = e;
          jg();
          if (lc && "function" === typeof lc.onPostCommitFiberRoot)
            try {
              lc.onPostCommitFiberRoot(kc, a);
            } catch (na) {
            }
          d2 = true;
        }
        return d2;
      } finally {
        C$1 = c2, ok.transition = b2;
      }
    }
    return false;
  }
  function Xk(a, b2, c2) {
    b2 = Ji(c2, b2);
    b2 = Ni(a, b2, 1);
    a = nh(a, b2, 1);
    b2 = R$1();
    null !== a && (Ac(a, 1, b2), Dk(a, b2));
  }
  function W(a, b2, c2) {
    if (3 === a.tag)
      Xk(a, a, c2);
    else
      for (; null !== b2; ) {
        if (3 === b2.tag) {
          Xk(b2, a, c2);
          break;
        } else if (1 === b2.tag) {
          var d2 = b2.stateNode;
          if ("function" === typeof b2.type.getDerivedStateFromError || "function" === typeof d2.componentDidCatch && (null === Ri || !Ri.has(d2))) {
            a = Ji(c2, a);
            a = Qi(b2, a, 1);
            b2 = nh(b2, a, 1);
            a = R$1();
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
    b2 = R$1();
    a.pingedLanes |= a.suspendedLanes & c2;
    Q$1 === a && (Z & c2) === c2 && (4 === T$1 || 3 === T$1 && (Z & 130023424) === Z && 500 > B$1() - fk ? Kk(a, 0) : rk |= c2);
    Dk(a, b2);
  }
  function Yk(a, b2) {
    0 === b2 && (0 === (a.mode & 1) ? b2 = 1 : (b2 = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
    var c2 = R$1();
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
        var e = a.memoizedState;
        null !== e && (c2 = e.retryLane);
        break;
      case 19:
        d2 = a.stateNode;
        break;
      default:
        throw Error(p$1(314));
    }
    null !== d2 && d2.delete(b2);
    Yk(a, c2);
  }
  var Vk;
  Vk = function(a, b2, c2) {
    if (null !== a)
      if (a.memoizedProps !== b2.pendingProps || Wf.current)
        dh = true;
      else {
        if (0 === (a.lanes & c2) && 0 === (b2.flags & 128))
          return dh = false, yj(a, b2, c2);
        dh = 0 !== (a.flags & 131072) ? true : false;
      }
    else
      dh = false, I$1 && 0 !== (b2.flags & 1048576) && ug(b2, ng, b2.index);
    b2.lanes = 0;
    switch (b2.tag) {
      case 2:
        var d2 = b2.type;
        ij(a, b2);
        a = b2.pendingProps;
        var e = Yf(b2, H$1.current);
        ch(b2, c2);
        e = Nh(null, b2, d2, a, e, c2);
        var f2 = Sh();
        b2.flags |= 1;
        "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b2.tag = 1, b2.memoizedState = null, b2.updateQueue = null, Zf(d2) ? (f2 = true, cg(b2)) : f2 = false, b2.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b2), e.updater = Ei, b2.stateNode = e, e._reactInternals = b2, Ii(b2, d2, a, c2), b2 = jj(null, b2, d2, true, f2, c2)) : (b2.tag = 0, I$1 && f2 && vg(b2), Xi(null, b2, e, c2), b2 = b2.child);
        return b2;
      case 16:
        d2 = b2.elementType;
        a: {
          ij(a, b2);
          a = b2.pendingProps;
          e = d2._init;
          d2 = e(d2._payload);
          b2.type = d2;
          e = b2.tag = Zk(d2);
          a = Ci(d2, a);
          switch (e) {
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
          throw Error(p$1(
            306,
            d2,
            ""
          ));
        }
        return b2;
      case 0:
        return d2 = b2.type, e = b2.pendingProps, e = b2.elementType === d2 ? e : Ci(d2, e), cj(a, b2, d2, e, c2);
      case 1:
        return d2 = b2.type, e = b2.pendingProps, e = b2.elementType === d2 ? e : Ci(d2, e), hj(a, b2, d2, e, c2);
      case 3:
        a: {
          kj(b2);
          if (null === a)
            throw Error(p$1(387));
          d2 = b2.pendingProps;
          f2 = b2.memoizedState;
          e = f2.element;
          lh(a, b2);
          qh(b2, d2, null, c2);
          var g2 = b2.memoizedState;
          d2 = g2.element;
          if (f2.isDehydrated)
            if (f2 = { element: d2, isDehydrated: false, cache: g2.cache, pendingSuspenseBoundaries: g2.pendingSuspenseBoundaries, transitions: g2.transitions }, b2.updateQueue.baseState = f2, b2.memoizedState = f2, b2.flags & 256) {
              e = Ji(Error(p$1(423)), b2);
              b2 = lj(a, b2, d2, c2, e);
              break a;
            } else if (d2 !== e) {
              e = Ji(Error(p$1(424)), b2);
              b2 = lj(a, b2, d2, c2, e);
              break a;
            } else
              for (yg = Lf(b2.stateNode.containerInfo.firstChild), xg = b2, I$1 = true, zg = null, c2 = Vg(b2, null, d2, c2), b2.child = c2; c2; )
                c2.flags = c2.flags & -3 | 4096, c2 = c2.sibling;
          else {
            Ig();
            if (d2 === e) {
              b2 = Zi(a, b2, c2);
              break a;
            }
            Xi(a, b2, d2, c2);
          }
          b2 = b2.child;
        }
        return b2;
      case 5:
        return Ah(b2), null === a && Eg(b2), d2 = b2.type, e = b2.pendingProps, f2 = null !== a ? a.memoizedProps : null, g2 = e.children, Ef(d2, e) ? g2 = null : null !== f2 && Ef(d2, f2) && (b2.flags |= 32), gj(a, b2), Xi(a, b2, g2, c2), b2.child;
      case 6:
        return null === a && Eg(b2), null;
      case 13:
        return oj(a, b2, c2);
      case 4:
        return yh(b2, b2.stateNode.containerInfo), d2 = b2.pendingProps, null === a ? b2.child = Ug(b2, null, d2, c2) : Xi(a, b2, d2, c2), b2.child;
      case 11:
        return d2 = b2.type, e = b2.pendingProps, e = b2.elementType === d2 ? e : Ci(d2, e), Yi(a, b2, d2, e, c2);
      case 7:
        return Xi(a, b2, b2.pendingProps, c2), b2.child;
      case 8:
        return Xi(a, b2, b2.pendingProps.children, c2), b2.child;
      case 12:
        return Xi(a, b2, b2.pendingProps.children, c2), b2.child;
      case 10:
        a: {
          d2 = b2.type._context;
          e = b2.pendingProps;
          f2 = b2.memoizedProps;
          g2 = e.value;
          G(Wg, d2._currentValue);
          d2._currentValue = g2;
          if (null !== f2)
            if (He(f2.value, g2)) {
              if (f2.children === e.children && !Wf.current) {
                b2 = Zi(a, b2, c2);
                break a;
              }
            } else
              for (f2 = b2.child, null !== f2 && (f2.return = b2); null !== f2; ) {
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
                } else if (10 === f2.tag)
                  g2 = f2.type === b2.type ? null : f2.child;
                else if (18 === f2.tag) {
                  g2 = f2.return;
                  if (null === g2)
                    throw Error(p$1(341));
                  g2.lanes |= c2;
                  h2 = g2.alternate;
                  null !== h2 && (h2.lanes |= c2);
                  bh(g2, c2, b2);
                  g2 = f2.sibling;
                } else
                  g2 = f2.child;
                if (null !== g2)
                  g2.return = f2;
                else
                  for (g2 = f2; null !== g2; ) {
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
          Xi(a, b2, e.children, c2);
          b2 = b2.child;
        }
        return b2;
      case 9:
        return e = b2.type, d2 = b2.pendingProps.children, ch(b2, c2), e = eh(e), d2 = d2(e), b2.flags |= 1, Xi(a, b2, d2, c2), b2.child;
      case 14:
        return d2 = b2.type, e = Ci(d2, b2.pendingProps), e = Ci(d2.type, e), $i(a, b2, d2, e, c2);
      case 15:
        return bj(a, b2, b2.type, b2.pendingProps, c2);
      case 17:
        return d2 = b2.type, e = b2.pendingProps, e = b2.elementType === d2 ? e : Ci(d2, e), ij(a, b2), b2.tag = 1, Zf(d2) ? (a = true, cg(b2)) : a = false, ch(b2, c2), Gi(b2, d2, e), Ii(b2, d2, e, c2), jj(null, b2, d2, true, a, c2);
      case 19:
        return xj(a, b2, c2);
      case 22:
        return dj(a, b2, c2);
    }
    throw Error(p$1(156, b2.tag));
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
    if ("function" === typeof a)
      return aj(a) ? 1 : 0;
    if (void 0 !== a && null !== a) {
      a = a.$$typeof;
      if (a === Da)
        return 11;
      if (a === Ga)
        return 14;
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
  function Rg(a, b2, c2, d2, e, f2) {
    var g2 = 2;
    d2 = a;
    if ("function" === typeof a)
      aj(a) && (g2 = 1);
    else if ("string" === typeof a)
      g2 = 5;
    else
      a:
        switch (a) {
          case ya:
            return Tg(c2.children, e, f2, b2);
          case za:
            g2 = 8;
            e |= 8;
            break;
          case Aa:
            return a = Bg(12, c2, b2, e | 2), a.elementType = Aa, a.lanes = f2, a;
          case Ea:
            return a = Bg(13, c2, b2, e), a.elementType = Ea, a.lanes = f2, a;
          case Fa:
            return a = Bg(19, c2, b2, e), a.elementType = Fa, a.lanes = f2, a;
          case Ia:
            return pj(c2, e, f2, b2);
          default:
            if ("object" === typeof a && null !== a)
              switch (a.$$typeof) {
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
            throw Error(p$1(130, null == a ? a : typeof a, ""));
        }
    b2 = Bg(g2, c2, b2, e);
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
  function al(a, b2, c2, d2, e) {
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
    this.onRecoverableError = e;
    this.mutableSourceEagerHydrationData = null;
  }
  function bl(a, b2, c2, d2, e, f2, g2, h2, k2) {
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
    if (!a)
      return Vf;
    a = a._reactInternals;
    a: {
      if (Vb(a) !== a || 1 !== a.tag)
        throw Error(p$1(170));
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
      throw Error(p$1(171));
    }
    if (1 === a.tag) {
      var c2 = a.type;
      if (Zf(c2))
        return bg(a, c2, b2);
    }
    return b2;
  }
  function el(a, b2, c2, d2, e, f2, g2, h2, k2) {
    a = bl(c2, d2, true, a, e, f2, g2, h2, k2);
    a.context = dl(null);
    c2 = a.current;
    d2 = R$1();
    e = yi(c2);
    f2 = mh(d2, e);
    f2.callback = void 0 !== b2 && null !== b2 ? b2 : null;
    nh(c2, f2, e);
    a.current.lanes = e;
    Ac(a, e, d2);
    Dk(a, d2);
    return a;
  }
  function fl(a, b2, c2, d2) {
    var e = b2.current, f2 = R$1(), g2 = yi(e);
    c2 = dl(c2);
    null === b2.context ? b2.context = c2 : b2.pendingContext = c2;
    b2 = mh(f2, g2);
    b2.payload = { element: a };
    d2 = void 0 === d2 ? null : d2;
    null !== d2 && (b2.callback = d2);
    a = nh(e, b2, g2);
    null !== a && (gi(a, e, g2, f2), oh(a, e, g2));
    return g2;
  }
  function gl(a) {
    a = a.current;
    if (!a.child)
      return null;
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
    if (null === b2)
      throw Error(p$1(409));
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
      for (var c2 = 0; c2 < Qc.length && 0 !== b2 && b2 < Qc[c2].priority; c2++)
        ;
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
  function ql(a, b2, c2, d2, e) {
    if (e) {
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
    for (; e = a.lastChild; )
      a.removeChild(e);
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
  function rl(a, b2, c2, d2, e) {
    var f2 = c2._reactRootContainer;
    if (f2) {
      var g2 = f2;
      if ("function" === typeof e) {
        var h2 = e;
        e = function() {
          var a2 = gl(g2);
          h2.call(a2);
        };
      }
      fl(b2, g2, a, e);
    } else
      g2 = ql(c2, b2, a, e, d2);
    return gl(g2);
  }
  Ec = function(a) {
    switch (a.tag) {
      case 3:
        var b2 = a.stateNode;
        if (b2.current.memoizedState.isDehydrated) {
          var c2 = tc(b2.pendingLanes);
          0 !== c2 && (Cc(b2, c2 | 1), Dk(b2, B$1()), 0 === (K & 6) && (Gj = B$1() + 500, jg()));
        }
        break;
      case 13:
        Rk(function() {
          var b3 = ih(a, 1);
          if (null !== b3) {
            var c3 = R$1();
            gi(b3, a, 1, c3);
          }
        }), il(a, 1);
    }
  };
  Fc = function(a) {
    if (13 === a.tag) {
      var b2 = ih(a, 134217728);
      if (null !== b2) {
        var c2 = R$1();
        gi(b2, a, 134217728, c2);
      }
      il(a, 134217728);
    }
  };
  Gc = function(a) {
    if (13 === a.tag) {
      var b2 = yi(a), c2 = ih(a, b2);
      if (null !== c2) {
        var d2 = R$1();
        gi(c2, a, b2, d2);
      }
      il(a, b2);
    }
  };
  Hc = function() {
    return C$1;
  };
  Ic = function(a, b2) {
    var c2 = C$1;
    try {
      return C$1 = a, b2();
    } finally {
      C$1 = c2;
    }
  };
  yb = function(a, b2, c2) {
    switch (b2) {
      case "input":
        bb(a, c2);
        b2 = c2.name;
        if ("radio" === c2.type && null != b2) {
          for (c2 = a; c2.parentNode; )
            c2 = c2.parentNode;
          c2 = c2.querySelectorAll("input[name=" + JSON.stringify("" + b2) + '][type="radio"]');
          for (b2 = 0; b2 < c2.length; b2++) {
            var d2 = c2[b2];
            if (d2 !== a && d2.form === a.form) {
              var e = Db(d2);
              if (!e)
                throw Error(p$1(90));
              Wa(d2);
              bb(d2, e);
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
    if (!vl.isDisabled && vl.supportsFiber)
      try {
        kc = vl.inject(ul), lc = vl;
      } catch (a) {
      }
  }
  reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
  reactDom_production_min.createPortal = function(a, b2) {
    var c2 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    if (!nl(b2))
      throw Error(p$1(200));
    return cl(a, b2, null, c2);
  };
  reactDom_production_min.createRoot = function(a, b2) {
    if (!nl(a))
      throw Error(p$1(299));
    var c2 = false, d2 = "", e = kl;
    null !== b2 && void 0 !== b2 && (true === b2.unstable_strictMode && (c2 = true), void 0 !== b2.identifierPrefix && (d2 = b2.identifierPrefix), void 0 !== b2.onRecoverableError && (e = b2.onRecoverableError));
    b2 = bl(a, 1, false, null, null, c2, false, d2, e);
    a[uf] = b2.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    return new ll(b2);
  };
  reactDom_production_min.findDOMNode = function(a) {
    if (null == a)
      return null;
    if (1 === a.nodeType)
      return a;
    var b2 = a._reactInternals;
    if (void 0 === b2) {
      if ("function" === typeof a.render)
        throw Error(p$1(188));
      a = Object.keys(a).join(",");
      throw Error(p$1(268, a));
    }
    a = Zb(b2);
    a = null === a ? null : a.stateNode;
    return a;
  };
  reactDom_production_min.flushSync = function(a) {
    return Rk(a);
  };
  reactDom_production_min.hydrate = function(a, b2, c2) {
    if (!ol(b2))
      throw Error(p$1(200));
    return rl(null, a, b2, true, c2);
  };
  reactDom_production_min.hydrateRoot = function(a, b2, c2) {
    if (!nl(a))
      throw Error(p$1(405));
    var d2 = null != c2 && c2.hydratedSources || null, e = false, f2 = "", g2 = kl;
    null !== c2 && void 0 !== c2 && (true === c2.unstable_strictMode && (e = true), void 0 !== c2.identifierPrefix && (f2 = c2.identifierPrefix), void 0 !== c2.onRecoverableError && (g2 = c2.onRecoverableError));
    b2 = el(b2, null, a, 1, null != c2 ? c2 : null, e, false, f2, g2);
    a[uf] = b2.current;
    sf(a);
    if (d2)
      for (a = 0; a < d2.length; a++)
        c2 = d2[a], e = c2._getVersion, e = e(c2._source), null == b2.mutableSourceEagerHydrationData ? b2.mutableSourceEagerHydrationData = [c2, e] : b2.mutableSourceEagerHydrationData.push(
          c2,
          e
        );
    return new ml(b2);
  };
  reactDom_production_min.render = function(a, b2, c2) {
    if (!ol(b2))
      throw Error(p$1(200));
    return rl(null, a, b2, false, c2);
  };
  reactDom_production_min.unmountComponentAtNode = function(a) {
    if (!ol(a))
      throw Error(p$1(40));
    return a._reactRootContainer ? (Rk(function() {
      rl(null, null, a, false, function() {
        a._reactRootContainer = null;
        a[uf] = null;
      });
    }), true) : false;
  };
  reactDom_production_min.unstable_batchedUpdates = Qk;
  reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b2, c2, d2) {
    if (!ol(c2))
      throw Error(p$1(200));
    if (null == a || void 0 === a._reactInternals)
      throw Error(p$1(38));
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
  var createRoot;
  var m$1 = reactDomExports;
  {
    createRoot = m$1.createRoot;
    m$1.hydrateRoot;
  }
  function Tw2ToolsButton() {
    const handleClick = () => {
      const dialog = document.getElementById("tw2toolspad");
      if (dialog && typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        console.error(
          "Element with id 'tw2toolspad' is not a <dialog> or showModal is not a function."
        );
      }
    };
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { className: "tw-btn tw-btn-neutral", onClick: handleClick }, "Tw2Tools"));
  }
  function r(e) {
    var t2, f2, n2 = "";
    if ("string" == typeof e || "number" == typeof e)
      n2 += e;
    else if ("object" == typeof e)
      if (Array.isArray(e)) {
        var o = e.length;
        for (t2 = 0; t2 < o; t2++)
          e[t2] && (f2 = r(e[t2])) && (n2 && (n2 += " "), n2 += f2);
      } else
        for (f2 in e)
          e[f2] && (n2 && (n2 += " "), n2 += f2);
    return n2;
  }
  function clsx() {
    for (var e, t2, f2 = 0, n2 = "", o = arguments.length; f2 < o; f2++)
      (e = arguments[f2]) && (t2 = r(e)) && (n2 && (n2 += " "), n2 += t2);
    return n2;
  }
  const c = (e) => "number" == typeof e && !isNaN(e), d = (e) => "string" == typeof e, u = (e) => "function" == typeof e, p = (e) => d(e) || u(e) ? e : null, m = (e) => reactExports.isValidElement(e) || d(e) || u(e) || c(e);
  function f(e, t2, n2) {
    void 0 === n2 && (n2 = 300);
    const { scrollHeight: o, style: s } = e;
    requestAnimationFrame(() => {
      s.minHeight = "initial", s.height = o + "px", s.transition = `all ${n2}ms`, requestAnimationFrame(() => {
        s.height = "0", s.padding = "0", s.margin = "0", setTimeout(t2, n2);
      });
    });
  }
  function g(t2) {
    let { enter: a, exit: r2, appendPosition: i = false, collapse: l2 = true, collapseDuration: c2 = 300 } = t2;
    return function(t3) {
      let { children: d2, position: u2, preventExitTransition: p2, done: m2, nodeRef: g2, isIn: y2, playToast: v2 } = t3;
      const h2 = i ? `${a}--${u2}` : a, T2 = i ? `${r2}--${u2}` : r2, E2 = reactExports.useRef(0);
      return reactExports.useLayoutEffect(() => {
        const e = g2.current, t4 = h2.split(" "), n2 = (o) => {
          o.target === g2.current && (v2(), e.removeEventListener("animationend", n2), e.removeEventListener("animationcancel", n2), 0 === E2.current && "animationcancel" !== o.type && e.classList.remove(...t4));
        };
        e.classList.add(...t4), e.addEventListener("animationend", n2), e.addEventListener("animationcancel", n2);
      }, []), reactExports.useEffect(() => {
        const e = g2.current, t4 = () => {
          e.removeEventListener("animationend", t4), l2 ? f(e, m2, c2) : m2();
        };
        y2 || (p2 ? t4() : (E2.current = 1, e.className += ` ${T2}`, e.addEventListener("animationend", t4)));
      }, [y2]), React.createElement(React.Fragment, null, d2);
    };
  }
  function y(e, t2) {
    return null != e ? { content: e.content, containerId: e.props.containerId, id: e.props.toastId, theme: e.props.theme, type: e.props.type, data: e.props.data || {}, isLoading: e.props.isLoading, icon: e.props.icon, status: t2 } : {};
  }
  const v = /* @__PURE__ */ new Map();
  let h = [];
  const T = /* @__PURE__ */ new Set(), E = (e) => T.forEach((t2) => t2(e)), b = () => v.size > 0;
  function I(e, t2) {
    var n2;
    if (t2)
      return !(null == (n2 = v.get(t2)) || !n2.isToastActive(e));
    let o = false;
    return v.forEach((t3) => {
      t3.isToastActive(e) && (o = true);
    }), o;
  }
  function _(e, t2) {
    m(e) && (b() || h.push({ content: e, options: t2 }), v.forEach((n2) => {
      n2.buildToast(e, t2);
    }));
  }
  function C(e, t2) {
    v.forEach((n2) => {
      null != t2 && null != t2 && t2.containerId ? (null == t2 ? void 0 : t2.containerId) === n2.id && n2.toggle(e, null == t2 ? void 0 : t2.id) : n2.toggle(e, null == t2 ? void 0 : t2.id);
    });
  }
  function L(e) {
    const { subscribe: o, getSnapshot: s, setProps: i } = reactExports.useRef(function(e2) {
      const n2 = e2.containerId || 1;
      return { subscribe(o2) {
        const s2 = /* @__PURE__ */ function(e3, n3, o3) {
          let s3 = 1, r3 = 0, i2 = [], l3 = [], f2 = [], g2 = n3;
          const v2 = /* @__PURE__ */ new Map(), h2 = /* @__PURE__ */ new Set(), T2 = () => {
            f2 = Array.from(v2.values()), h2.forEach((e4) => e4());
          }, E2 = (e4) => {
            l3 = null == e4 ? [] : l3.filter((t2) => t2 !== e4), T2();
          }, b2 = (e4) => {
            const { toastId: n4, onOpen: s4, updateId: a, children: r4 } = e4.props, i3 = null == a;
            e4.staleId && v2.delete(e4.staleId), v2.set(n4, e4), l3 = [...l3, e4.props.toastId].filter((t2) => t2 !== e4.staleId), T2(), o3(y(e4, i3 ? "added" : "updated")), i3 && u(s4) && s4(reactExports.isValidElement(r4) && r4.props);
          };
          return { id: e3, props: g2, observe: (e4) => (h2.add(e4), () => h2.delete(e4)), toggle: (e4, t2) => {
            v2.forEach((n4) => {
              null != t2 && t2 !== n4.props.toastId || u(n4.toggle) && n4.toggle(e4);
            });
          }, removeToast: E2, toasts: v2, clearQueue: () => {
            r3 -= i2.length, i2 = [];
          }, buildToast: (n4, l4) => {
            if (((t2) => {
              let { containerId: n5, toastId: o4, updateId: s4 } = t2;
              const a = n5 ? n5 !== e3 : 1 !== e3, r4 = v2.has(o4) && null == s4;
              return a || r4;
            })(l4))
              return;
            const { toastId: f3, updateId: h3, data: I2, staleId: _2, delay: C2 } = l4, L2 = () => {
              E2(f3);
            }, N2 = null == h3;
            N2 && r3++;
            const $2 = { ...g2, style: g2.toastStyle, key: s3++, ...Object.fromEntries(Object.entries(l4).filter((e4) => {
              let [t2, n5] = e4;
              return null != n5;
            })), toastId: f3, updateId: h3, data: I2, closeToast: L2, isIn: false, className: p(l4.className || g2.toastClassName), bodyClassName: p(l4.bodyClassName || g2.bodyClassName), progressClassName: p(l4.progressClassName || g2.progressClassName), autoClose: !l4.isLoading && (w2 = l4.autoClose, k2 = g2.autoClose, false === w2 || c(w2) && w2 > 0 ? w2 : k2), deleteToast() {
              const e4 = v2.get(f3), { onClose: n5, children: s4 } = e4.props;
              u(n5) && n5(reactExports.isValidElement(s4) && s4.props), o3(y(e4, "removed")), v2.delete(f3), r3--, r3 < 0 && (r3 = 0), i2.length > 0 ? b2(i2.shift()) : T2();
            } };
            var w2, k2;
            $2.closeButton = g2.closeButton, false === l4.closeButton || m(l4.closeButton) ? $2.closeButton = l4.closeButton : true === l4.closeButton && ($2.closeButton = !m(g2.closeButton) || g2.closeButton);
            let P2 = n4;
            reactExports.isValidElement(n4) && !d(n4.type) ? P2 = reactExports.cloneElement(n4, { closeToast: L2, toastProps: $2, data: I2 }) : u(n4) && (P2 = n4({ closeToast: L2, toastProps: $2, data: I2 }));
            const M2 = { content: P2, props: $2, staleId: _2 };
            g2.limit && g2.limit > 0 && r3 > g2.limit && N2 ? i2.push(M2) : c(C2) ? setTimeout(() => {
              b2(M2);
            }, C2) : b2(M2);
          }, setProps(e4) {
            g2 = e4;
          }, setToggle: (e4, t2) => {
            v2.get(e4).toggle = t2;
          }, isToastActive: (e4) => l3.some((t2) => t2 === e4), getSnapshot: () => g2.newestOnTop ? f2.reverse() : f2 };
        }(n2, e2, E);
        v.set(n2, s2);
        const r2 = s2.observe(o2);
        return h.forEach((e3) => _(e3.content, e3.options)), h = [], () => {
          r2(), v.delete(n2);
        };
      }, setProps(e3) {
        var t2;
        null == (t2 = v.get(n2)) || t2.setProps(e3);
      }, getSnapshot() {
        var e3;
        return null == (e3 = v.get(n2)) ? void 0 : e3.getSnapshot();
      } };
    }(e)).current;
    i(e);
    const l2 = reactExports.useSyncExternalStore(o, s, s);
    return { getToastToRender: function(e2) {
      if (!l2)
        return [];
      const t2 = /* @__PURE__ */ new Map();
      return l2.forEach((e3) => {
        const { position: n2 } = e3.props;
        t2.has(n2) || t2.set(n2, []), t2.get(n2).push(e3);
      }), Array.from(t2, (t3) => e2(t3[0], t3[1]));
    }, isToastActive: I, count: null == l2 ? void 0 : l2.length };
  }
  function N(e) {
    const [t2, o] = reactExports.useState(false), [a, r2] = reactExports.useState(false), l2 = reactExports.useRef(null), c2 = reactExports.useRef({ start: 0, delta: 0, removalDistance: 0, canCloseOnClick: true, canDrag: false, didMove: false }).current, { autoClose: d2, pauseOnHover: u2, closeToast: p2, onClick: m2, closeOnClick: f2 } = e;
    var g2, y2;
    function h2() {
      o(true);
    }
    function T2() {
      o(false);
    }
    function E2(n2) {
      const o2 = l2.current;
      c2.canDrag && o2 && (c2.didMove = true, t2 && T2(), c2.delta = "x" === e.draggableDirection ? n2.clientX - c2.start : n2.clientY - c2.start, c2.start !== n2.clientX && (c2.canCloseOnClick = false), o2.style.transform = `translate3d(${"x" === e.draggableDirection ? `${c2.delta}px, var(--y)` : `0, calc(${c2.delta}px + var(--y))`},0)`, o2.style.opacity = "" + (1 - Math.abs(c2.delta / c2.removalDistance)));
    }
    function b2() {
      document.removeEventListener("pointermove", E2), document.removeEventListener("pointerup", b2);
      const t3 = l2.current;
      if (c2.canDrag && c2.didMove && t3) {
        if (c2.canDrag = false, Math.abs(c2.delta) > c2.removalDistance)
          return r2(true), e.closeToast(), void e.collapseAll();
        t3.style.transition = "transform 0.2s, opacity 0.2s", t3.style.removeProperty("transform"), t3.style.removeProperty("opacity");
      }
    }
    null == (y2 = v.get((g2 = { id: e.toastId, containerId: e.containerId, fn: o }).containerId || 1)) || y2.setToggle(g2.id, g2.fn), reactExports.useEffect(() => {
      if (e.pauseOnFocusLoss)
        return document.hasFocus() || T2(), window.addEventListener("focus", h2), window.addEventListener("blur", T2), () => {
          window.removeEventListener("focus", h2), window.removeEventListener("blur", T2);
        };
    }, [e.pauseOnFocusLoss]);
    const I2 = { onPointerDown: function(t3) {
      if (true === e.draggable || e.draggable === t3.pointerType) {
        c2.didMove = false, document.addEventListener("pointermove", E2), document.addEventListener("pointerup", b2);
        const n2 = l2.current;
        c2.canCloseOnClick = true, c2.canDrag = true, n2.style.transition = "none", "x" === e.draggableDirection ? (c2.start = t3.clientX, c2.removalDistance = n2.offsetWidth * (e.draggablePercent / 100)) : (c2.start = t3.clientY, c2.removalDistance = n2.offsetHeight * (80 === e.draggablePercent ? 1.5 * e.draggablePercent : e.draggablePercent) / 100);
      }
    }, onPointerUp: function(t3) {
      const { top: n2, bottom: o2, left: s, right: a2 } = l2.current.getBoundingClientRect();
      "touchend" !== t3.nativeEvent.type && e.pauseOnHover && t3.clientX >= s && t3.clientX <= a2 && t3.clientY >= n2 && t3.clientY <= o2 ? T2() : h2();
    } };
    return d2 && u2 && (I2.onMouseEnter = T2, e.stacked || (I2.onMouseLeave = h2)), f2 && (I2.onClick = (e2) => {
      m2 && m2(e2), c2.canCloseOnClick && p2();
    }), { playToast: h2, pauseToast: T2, isRunning: t2, preventExitTransition: a, toastRef: l2, eventHandlers: I2 };
  }
  function $(t2) {
    let { delay: n2, isRunning: o, closeToast: s, type: a = "default", hide: r2, className: i, style: c2, controlledProgress: d2, progress: p2, rtl: m2, isIn: f2, theme: g2 } = t2;
    const y2 = r2 || d2 && 0 === p2, v2 = { ...c2, animationDuration: `${n2}ms`, animationPlayState: o ? "running" : "paused" };
    d2 && (v2.transform = `scaleX(${p2})`);
    const h2 = clsx("Toastify__progress-bar", d2 ? "Toastify__progress-bar--controlled" : "Toastify__progress-bar--animated", `Toastify__progress-bar-theme--${g2}`, `Toastify__progress-bar--${a}`, { "Toastify__progress-bar--rtl": m2 }), T2 = u(i) ? i({ rtl: m2, type: a, defaultClassName: h2 }) : clsx(h2, i), E2 = { [d2 && p2 >= 1 ? "onTransitionEnd" : "onAnimationEnd"]: d2 && p2 < 1 ? null : () => {
      f2 && s();
    } };
    return React.createElement("div", { className: "Toastify__progress-bar--wrp", "data-hidden": y2 }, React.createElement("div", { className: `Toastify__progress-bar--bg Toastify__progress-bar-theme--${g2} Toastify__progress-bar--${a}` }), React.createElement("div", { role: "progressbar", "aria-hidden": y2 ? "true" : "false", "aria-label": "notification timer", className: T2, style: v2, ...E2 }));
  }
  let w = 1;
  const k = () => "" + w++;
  function P(e) {
    return e && (d(e.toastId) || c(e.toastId)) ? e.toastId : k();
  }
  function M(e, t2) {
    return _(e, t2), t2.toastId;
  }
  function x(e, t2) {
    return { ...t2, type: t2 && t2.type || e, toastId: P(t2) };
  }
  function A(e) {
    return (t2, n2) => M(t2, x(e, n2));
  }
  function B(e, t2) {
    return M(e, x("default", t2));
  }
  B.loading = (e, t2) => M(e, x("default", { isLoading: true, autoClose: false, closeOnClick: false, closeButton: false, draggable: false, ...t2 })), B.promise = function(e, t2, n2) {
    let o, { pending: s, error: a, success: r2 } = t2;
    s && (o = d(s) ? B.loading(s, n2) : B.loading(s.render, { ...n2, ...s }));
    const i = { isLoading: null, autoClose: null, closeOnClick: null, closeButton: null, draggable: null }, l2 = (e2, t3, s2) => {
      if (null == t3)
        return void B.dismiss(o);
      const a2 = { type: e2, ...i, ...n2, data: s2 }, r3 = d(t3) ? { render: t3 } : t3;
      return o ? B.update(o, { ...a2, ...r3 }) : B(r3.render, { ...a2, ...r3 }), s2;
    }, c2 = u(e) ? e() : e;
    return c2.then((e2) => l2("success", r2, e2)).catch((e2) => l2("error", a, e2)), c2;
  }, B.success = A("success"), B.info = A("info"), B.error = A("error"), B.warning = A("warning"), B.warn = B.warning, B.dark = (e, t2) => M(e, x("default", { theme: "dark", ...t2 })), B.dismiss = function(e) {
    !function(e2) {
      var t2;
      if (b()) {
        if (null == e2 || d(t2 = e2) || c(t2))
          v.forEach((t3) => {
            t3.removeToast(e2);
          });
        else if (e2 && ("containerId" in e2 || "id" in e2)) {
          const t3 = v.get(e2.containerId);
          t3 ? t3.removeToast(e2.id) : v.forEach((t4) => {
            t4.removeToast(e2.id);
          });
        }
      } else
        h = h.filter((t3) => null != e2 && t3.options.toastId !== e2);
    }(e);
  }, B.clearWaitingQueue = function(e) {
    void 0 === e && (e = {}), v.forEach((t2) => {
      !t2.props.limit || e.containerId && t2.id !== e.containerId || t2.clearQueue();
    });
  }, B.isActive = I, B.update = function(e, t2) {
    void 0 === t2 && (t2 = {});
    const n2 = ((e2, t3) => {
      var n3;
      let { containerId: o } = t3;
      return null == (n3 = v.get(o || 1)) ? void 0 : n3.toasts.get(e2);
    })(e, t2);
    if (n2) {
      const { props: o, content: s } = n2, a = { delay: 100, ...o, ...t2, toastId: t2.toastId || e, updateId: k() };
      a.toastId !== e && (a.staleId = e);
      const r2 = a.render || s;
      delete a.render, M(r2, a);
    }
  }, B.done = (e) => {
    B.update(e, { progress: 1 });
  }, B.onChange = function(e) {
    return T.add(e), () => {
      T.delete(e);
    };
  }, B.play = (e) => C(true, e), B.pause = (e) => C(false, e);
  const O = "undefined" != typeof window ? reactExports.useLayoutEffect : reactExports.useEffect, D = (t2) => {
    let { theme: n2, type: o, isLoading: s, ...a } = t2;
    return React.createElement("svg", { viewBox: "0 0 24 24", width: "100%", height: "100%", fill: "colored" === n2 ? "currentColor" : `var(--toastify-icon-color-${o})`, ...a });
  }, z = { info: function(t2) {
    return React.createElement(D, { ...t2 }, React.createElement("path", { d: "M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z" }));
  }, warning: function(t2) {
    return React.createElement(D, { ...t2 }, React.createElement("path", { d: "M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z" }));
  }, success: function(t2) {
    return React.createElement(D, { ...t2 }, React.createElement("path", { d: "M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z" }));
  }, error: function(t2) {
    return React.createElement(D, { ...t2 }, React.createElement("path", { d: "M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z" }));
  }, spinner: function() {
    return React.createElement("div", { className: "Toastify__spinner" });
  } }, R = (n2) => {
    const { isRunning: o, preventExitTransition: s, toastRef: r2, eventHandlers: i, playToast: c2 } = N(n2), { closeButton: d2, children: p2, autoClose: m2, onClick: f2, type: g2, hideProgressBar: y2, closeToast: v2, transition: h2, position: T2, className: E2, style: b2, bodyClassName: I2, bodyStyle: _2, progressClassName: C2, progressStyle: L2, updateId: w2, role: k2, progress: P2, rtl: M2, toastId: x2, deleteToast: A2, isIn: B2, isLoading: O2, closeOnClick: D2, theme: R2 } = n2, S2 = clsx("Toastify__toast", `Toastify__toast-theme--${R2}`, `Toastify__toast--${g2}`, { "Toastify__toast--rtl": M2 }, { "Toastify__toast--close-on-click": D2 }), H2 = u(E2) ? E2({ rtl: M2, position: T2, type: g2, defaultClassName: S2 }) : clsx(S2, E2), F2 = function(e) {
      let { theme: n3, type: o2, isLoading: s2, icon: r3 } = e, i2 = null;
      const l2 = { theme: n3, type: o2 };
      return false === r3 || (u(r3) ? i2 = r3({ ...l2, isLoading: s2 }) : reactExports.isValidElement(r3) ? i2 = reactExports.cloneElement(r3, l2) : s2 ? i2 = z.spinner() : ((e2) => e2 in z)(o2) && (i2 = z[o2](l2))), i2;
    }(n2), X2 = !!P2 || !m2, Y2 = { closeToast: v2, type: g2, theme: R2 };
    let q2 = null;
    return false === d2 || (q2 = u(d2) ? d2(Y2) : reactExports.isValidElement(d2) ? reactExports.cloneElement(d2, Y2) : function(t2) {
      let { closeToast: n3, theme: o2, ariaLabel: s2 = "close" } = t2;
      return React.createElement("button", { className: `Toastify__close-button Toastify__close-button--${o2}`, type: "button", onClick: (e) => {
        e.stopPropagation(), n3(e);
      }, "aria-label": s2 }, React.createElement("svg", { "aria-hidden": "true", viewBox: "0 0 14 16" }, React.createElement("path", { fillRule: "evenodd", d: "M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z" })));
    }(Y2)), React.createElement(h2, { isIn: B2, done: A2, position: T2, preventExitTransition: s, nodeRef: r2, playToast: c2 }, React.createElement("div", { id: x2, onClick: f2, "data-in": B2, className: H2, ...i, style: b2, ref: r2 }, React.createElement("div", { ...B2 && { role: k2 }, className: u(I2) ? I2({ type: g2 }) : clsx("Toastify__toast-body", I2), style: _2 }, null != F2 && React.createElement("div", { className: clsx("Toastify__toast-icon", { "Toastify--animate-icon Toastify__zoom-enter": !O2 }) }, F2), React.createElement("div", null, p2)), q2, React.createElement($, { ...w2 && !X2 ? { key: `pb-${w2}` } : {}, rtl: M2, theme: R2, delay: m2, isRunning: o, isIn: B2, closeToast: v2, hide: y2, type: g2, style: L2, className: C2, controlledProgress: X2, progress: P2 || 0 })));
  }, S = function(e, t2) {
    return void 0 === t2 && (t2 = false), { enter: `Toastify--animate Toastify__${e}-enter`, exit: `Toastify--animate Toastify__${e}-exit`, appendPosition: t2 };
  }, H = g(S("bounce", true));
  g(S("slide", true));
  g(S("zoom"));
  const Y = g(S("flip")), q = { position: "top-right", transition: H, autoClose: 5e3, closeButton: true, pauseOnHover: true, pauseOnFocusLoss: true, draggable: "touch", draggablePercent: 80, draggableDirection: "x", role: "alert", theme: "light" };
  function Q(t2) {
    let o = { ...q, ...t2 };
    const s = t2.stacked, [a, r2] = reactExports.useState(true), c2 = reactExports.useRef(null), { getToastToRender: d2, isToastActive: m2, count: f2 } = L(o), { className: g2, style: y2, rtl: v2, containerId: h2 } = o;
    function T2(e) {
      const t3 = clsx("Toastify__toast-container", `Toastify__toast-container--${e}`, { "Toastify__toast-container--rtl": v2 });
      return u(g2) ? g2({ position: e, rtl: v2, defaultClassName: t3 }) : clsx(t3, p(g2));
    }
    function E2() {
      s && (r2(true), B.play());
    }
    return O(() => {
      if (s) {
        var e;
        const t3 = c2.current.querySelectorAll('[data-in="true"]'), n2 = 12, s2 = null == (e = o.position) ? void 0 : e.includes("top");
        let r3 = 0, i = 0;
        Array.from(t3).reverse().forEach((e2, t4) => {
          const o2 = e2;
          o2.classList.add("Toastify__toast--stacked"), t4 > 0 && (o2.dataset.collapsed = `${a}`), o2.dataset.pos || (o2.dataset.pos = s2 ? "top" : "bot");
          const l2 = r3 * (a ? 0.2 : 1) + (a ? 0 : n2 * t4);
          o2.style.setProperty("--y", `${s2 ? l2 : -1 * l2}px`), o2.style.setProperty("--g", `${n2}`), o2.style.setProperty("--s", "" + (1 - (a ? i : 0))), r3 += o2.offsetHeight, i += 0.025;
        });
      }
    }, [a, f2, s]), React.createElement("div", { ref: c2, className: "Toastify", id: h2, onMouseEnter: () => {
      s && (r2(false), B.pause());
    }, onMouseLeave: E2 }, d2((t3, n2) => {
      const o2 = n2.length ? { ...y2 } : { ...y2, pointerEvents: "none" };
      return React.createElement("div", { className: T2(t3), style: o2, key: `container-${t3}` }, n2.map((t4) => {
        let { content: n3, props: o3 } = t4;
        return React.createElement(R, { ...o3, stacked: s, collapseAll: E2, isIn: m2(o3.toastId, o3.containerId), style: o3.style, key: `toast-${o3.key}` }, n3);
      }));
    }));
  }
  function Home({ setCurrentPage }) {
    return /* @__PURE__ */ React.createElement("div", { className: "tw-hero tw-h-full" }, /* @__PURE__ */ React.createElement("div", { className: "tw-hero-content tw-text-center" }, /* @__PURE__ */ React.createElement("div", { className: "tw-max-w-md" }, /* @__PURE__ */ React.createElement("h1", { className: "tw-text-5xl tw-font-bold" }, "HOME"), /* @__PURE__ */ React.createElement("p", { className: "tw-py-6" }, "Tw2Tools tem como objetivo automatizar algumas tarefas chatas do jogo Tribal Wars 2, facilitando a vida de quem joga e quer ter uma vida social fora do jogo."), /* @__PURE__ */ React.createElement("div", { className: "tw-rounded-lg tw-text-white tw-font-bold tw-bg-slate-700 tw-p-5" }, "Escolha uma ferramenta no menu superior"))));
  }
  const showToastError = (message) => {
    B.error(message, {
      position: "top-right",
      autoClose: 5e3,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: void 0,
      theme: "colored",
      transition: Y
    });
  };
  const showToastSuccess = (message) => {
    B.success(message, {
      position: "top-right",
      autoClose: 5e3,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: void 0,
      theme: "colored",
      transition: Y
    });
  };
  const Input = ({ type, className, placeholder, value, onChange, disabled }) => {
    return /* @__PURE__ */ React.createElement(
      "input",
      {
        type,
        className: `${className} !tw-border-none !tw-bg-none !tw-shadow-none`,
        placeholder,
        value,
        onChange,
        disabled
      }
    );
  };
  /**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  /**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const stringToByteArray$1 = function(str) {
    const out = [];
    let p2 = 0;
    for (let i = 0; i < str.length; i++) {
      let c2 = str.charCodeAt(i);
      if (c2 < 128) {
        out[p2++] = c2;
      } else if (c2 < 2048) {
        out[p2++] = c2 >> 6 | 192;
        out[p2++] = c2 & 63 | 128;
      } else if ((c2 & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
        c2 = 65536 + ((c2 & 1023) << 10) + (str.charCodeAt(++i) & 1023);
        out[p2++] = c2 >> 18 | 240;
        out[p2++] = c2 >> 12 & 63 | 128;
        out[p2++] = c2 >> 6 & 63 | 128;
        out[p2++] = c2 & 63 | 128;
      } else {
        out[p2++] = c2 >> 12 | 224;
        out[p2++] = c2 >> 6 & 63 | 128;
        out[p2++] = c2 & 63 | 128;
      }
    }
    return out;
  };
  const byteArrayToString = function(bytes) {
    const out = [];
    let pos = 0, c2 = 0;
    while (pos < bytes.length) {
      const c1 = bytes[pos++];
      if (c1 < 128) {
        out[c2++] = String.fromCharCode(c1);
      } else if (c1 > 191 && c1 < 224) {
        const c22 = bytes[pos++];
        out[c2++] = String.fromCharCode((c1 & 31) << 6 | c22 & 63);
      } else if (c1 > 239 && c1 < 365) {
        const c22 = bytes[pos++];
        const c3 = bytes[pos++];
        const c4 = bytes[pos++];
        const u2 = ((c1 & 7) << 18 | (c22 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
        out[c2++] = String.fromCharCode(55296 + (u2 >> 10));
        out[c2++] = String.fromCharCode(56320 + (u2 & 1023));
      } else {
        const c22 = bytes[pos++];
        const c3 = bytes[pos++];
        out[c2++] = String.fromCharCode((c1 & 15) << 12 | (c22 & 63) << 6 | c3 & 63);
      }
    }
    return out.join("");
  };
  const base64 = {
    /**
     * Maps bytes to characters.
     */
    byteToCharMap_: null,
    /**
     * Maps characters to bytes.
     */
    charToByteMap_: null,
    /**
     * Maps bytes to websafe characters.
     * @private
     */
    byteToCharMapWebSafe_: null,
    /**
     * Maps websafe characters to bytes.
     * @private
     */
    charToByteMapWebSafe_: null,
    /**
     * Our default alphabet, shared between
     * ENCODED_VALS and ENCODED_VALS_WEBSAFE
     */
    ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    /**
     * Our default alphabet. Value 64 (=) is special; it means "nothing."
     */
    get ENCODED_VALS() {
      return this.ENCODED_VALS_BASE + "+/=";
    },
    /**
     * Our websafe alphabet.
     */
    get ENCODED_VALS_WEBSAFE() {
      return this.ENCODED_VALS_BASE + "-_.";
    },
    /**
     * Whether this browser supports the atob and btoa functions. This extension
     * started at Mozilla but is now implemented by many browsers. We use the
     * ASSUME_* variables to avoid pulling in the full useragent detection library
     * but still allowing the standard per-browser compilations.
     *
     */
    HAS_NATIVE_SUPPORT: typeof atob === "function",
    /**
     * Base64-encode an array of bytes.
     *
     * @param input An array of bytes (numbers with
     *     value in [0, 255]) to encode.
     * @param webSafe Boolean indicating we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeByteArray(input, webSafe) {
      if (!Array.isArray(input)) {
        throw Error("encodeByteArray takes an array as a parameter");
      }
      this.init_();
      const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
      const output = [];
      for (let i = 0; i < input.length; i += 3) {
        const byte1 = input[i];
        const haveByte2 = i + 1 < input.length;
        const byte2 = haveByte2 ? input[i + 1] : 0;
        const haveByte3 = i + 2 < input.length;
        const byte3 = haveByte3 ? input[i + 2] : 0;
        const outByte1 = byte1 >> 2;
        const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
        let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
        let outByte4 = byte3 & 63;
        if (!haveByte3) {
          outByte4 = 64;
          if (!haveByte2) {
            outByte3 = 64;
          }
        }
        output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
      }
      return output.join("");
    },
    /**
     * Base64-encode a string.
     *
     * @param input A string to encode.
     * @param webSafe If true, we should use the
     *     alternative alphabet.
     * @return The base64 encoded string.
     */
    encodeString(input, webSafe) {
      if (this.HAS_NATIVE_SUPPORT && !webSafe) {
        return btoa(input);
      }
      return this.encodeByteArray(stringToByteArray$1(input), webSafe);
    },
    /**
     * Base64-decode a string.
     *
     * @param input to decode.
     * @param webSafe True if we should use the
     *     alternative alphabet.
     * @return string representing the decoded value.
     */
    decodeString(input, webSafe) {
      if (this.HAS_NATIVE_SUPPORT && !webSafe) {
        return atob(input);
      }
      return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
    },
    /**
     * Base64-decode a string.
     *
     * In base-64 decoding, groups of four characters are converted into three
     * bytes.  If the encoder did not apply padding, the input length may not
     * be a multiple of 4.
     *
     * In this case, the last group will have fewer than 4 characters, and
     * padding will be inferred.  If the group has one or two characters, it decodes
     * to one byte.  If the group has three characters, it decodes to two bytes.
     *
     * @param input Input to decode.
     * @param webSafe True if we should use the web-safe alphabet.
     * @return bytes representing the decoded value.
     */
    decodeStringToByteArray(input, webSafe) {
      this.init_();
      const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
      const output = [];
      for (let i = 0; i < input.length; ) {
        const byte1 = charToByteMap[input.charAt(i++)];
        const haveByte2 = i < input.length;
        const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
        ++i;
        const haveByte3 = i < input.length;
        const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
        ++i;
        const haveByte4 = i < input.length;
        const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
        ++i;
        if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
          throw new DecodeBase64StringError();
        }
        const outByte1 = byte1 << 2 | byte2 >> 4;
        output.push(outByte1);
        if (byte3 !== 64) {
          const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
          output.push(outByte2);
          if (byte4 !== 64) {
            const outByte3 = byte3 << 6 & 192 | byte4;
            output.push(outByte3);
          }
        }
      }
      return output;
    },
    /**
     * Lazy static initialization function. Called before
     * accessing any of the static map variables.
     * @private
     */
    init_() {
      if (!this.byteToCharMap_) {
        this.byteToCharMap_ = {};
        this.charToByteMap_ = {};
        this.byteToCharMapWebSafe_ = {};
        this.charToByteMapWebSafe_ = {};
        for (let i = 0; i < this.ENCODED_VALS.length; i++) {
          this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
          this.charToByteMap_[this.byteToCharMap_[i]] = i;
          this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
          this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
          if (i >= this.ENCODED_VALS_BASE.length) {
            this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
            this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
          }
        }
      }
    }
  };
  class DecodeBase64StringError extends Error {
    constructor() {
      super(...arguments);
      this.name = "DecodeBase64StringError";
    }
  }
  const base64Encode = function(str) {
    const utf8Bytes = stringToByteArray$1(str);
    return base64.encodeByteArray(utf8Bytes, true);
  };
  const base64urlEncodeWithoutPadding = function(str) {
    return base64Encode(str).replace(/\./g, "");
  };
  const base64Decode = function(str) {
    try {
      return base64.decodeString(str, true);
    } catch (e) {
      console.error("base64Decode failed: ", e);
    }
    return null;
  };
  /**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function getGlobal() {
    if (typeof self !== "undefined") {
      return self;
    }
    if (typeof window !== "undefined") {
      return window;
    }
    if (typeof global !== "undefined") {
      return global;
    }
    throw new Error("Unable to locate global object.");
  }
  /**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
  const getDefaultsFromEnvVariable = () => {
    if (typeof process === "undefined" || typeof process.env === "undefined") {
      return;
    }
    const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
    if (defaultsJsonString) {
      return JSON.parse(defaultsJsonString);
    }
  };
  const getDefaultsFromCookie = () => {
    if (typeof document === "undefined") {
      return;
    }
    let match;
    try {
      match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
    } catch (e) {
      return;
    }
    const decoded = match && base64Decode(match[1]);
    return decoded && JSON.parse(decoded);
  };
  const getDefaults = () => {
    try {
      return getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
    } catch (e) {
      console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
      return;
    }
  };
  const getDefaultEmulatorHost = (productName) => {
    var _a, _b;
    return (_b = (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.emulatorHosts) === null || _b === void 0 ? void 0 : _b[productName];
  };
  const getDefaultAppConfig = () => {
    var _a;
    return (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.config;
  };
  const getExperimentalSetting = (name2) => {
    var _a;
    return (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a[`_${name2}`];
  };
  /**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Deferred {
    constructor() {
      this.reject = () => {
      };
      this.resolve = () => {
      };
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    }
    /**
     * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
     * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
     * and returns a node-style callback which will resolve or reject the Deferred's promise.
     */
    wrapCallback(callback) {
      return (error, value) => {
        if (error) {
          this.reject(error);
        } else {
          this.resolve(value);
        }
        if (typeof callback === "function") {
          this.promise.catch(() => {
          });
          if (callback.length === 1) {
            callback(error);
          } else {
            callback(error, value);
          }
        }
      };
    }
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function getUA() {
    if (typeof navigator !== "undefined" && typeof navigator["userAgent"] === "string") {
      return navigator["userAgent"];
    } else {
      return "";
    }
  }
  function isMobileCordova() {
    return typeof window !== "undefined" && // @ts-ignore Setting up an broadly applicable index signature for Window
    // just to deal with this case would probably be a bad idea.
    !!(window["cordova"] || window["phonegap"] || window["PhoneGap"]) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA());
  }
  function isBrowserExtension() {
    const runtime = typeof chrome === "object" ? chrome.runtime : typeof browser === "object" ? browser.runtime : void 0;
    return typeof runtime === "object" && runtime.id !== void 0;
  }
  function isReactNative() {
    return typeof navigator === "object" && navigator["product"] === "ReactNative";
  }
  function isIE() {
    const ua2 = getUA();
    return ua2.indexOf("MSIE ") >= 0 || ua2.indexOf("Trident/") >= 0;
  }
  function isIndexedDBAvailable() {
    try {
      return typeof indexedDB === "object";
    } catch (e) {
      return false;
    }
  }
  function validateIndexedDBOpenable() {
    return new Promise((resolve, reject) => {
      try {
        let preExist = true;
        const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
        const request = self.indexedDB.open(DB_CHECK_NAME);
        request.onsuccess = () => {
          request.result.close();
          if (!preExist) {
            self.indexedDB.deleteDatabase(DB_CHECK_NAME);
          }
          resolve(true);
        };
        request.onupgradeneeded = () => {
          preExist = false;
        };
        request.onerror = () => {
          var _a;
          reject(((_a = request.error) === null || _a === void 0 ? void 0 : _a.message) || "");
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  function areCookiesEnabled() {
    if (typeof navigator === "undefined" || !navigator.cookieEnabled) {
      return false;
    }
    return true;
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const ERROR_NAME = "FirebaseError";
  class FirebaseError extends Error {
    constructor(code, message, customData) {
      super(message);
      this.code = code;
      this.customData = customData;
      this.name = ERROR_NAME;
      Object.setPrototypeOf(this, FirebaseError.prototype);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ErrorFactory.prototype.create);
      }
    }
  }
  class ErrorFactory {
    constructor(service, serviceName, errors) {
      this.service = service;
      this.serviceName = serviceName;
      this.errors = errors;
    }
    create(code, ...data) {
      const customData = data[0] || {};
      const fullCode = `${this.service}/${code}`;
      const template = this.errors[code];
      const message = template ? replaceTemplate(template, customData) : "Error";
      const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
      const error = new FirebaseError(fullCode, fullMessage, customData);
      return error;
    }
  }
  function replaceTemplate(template, data) {
    return template.replace(PATTERN, (_2, key) => {
      const value = data[key];
      return value != null ? String(value) : `<${key}?>`;
    });
  }
  const PATTERN = /\{\$([^}]+)}/g;
  function isEmpty(obj) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
  function deepEqual(a, b2) {
    if (a === b2) {
      return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b2);
    for (const k2 of aKeys) {
      if (!bKeys.includes(k2)) {
        return false;
      }
      const aProp = a[k2];
      const bProp = b2[k2];
      if (isObject(aProp) && isObject(bProp)) {
        if (!deepEqual(aProp, bProp)) {
          return false;
        }
      } else if (aProp !== bProp) {
        return false;
      }
    }
    for (const k2 of bKeys) {
      if (!aKeys.includes(k2)) {
        return false;
      }
    }
    return true;
  }
  function isObject(thing) {
    return thing !== null && typeof thing === "object";
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function querystring(querystringParams) {
    const params = [];
    for (const [key, value] of Object.entries(querystringParams)) {
      if (Array.isArray(value)) {
        value.forEach((arrayVal) => {
          params.push(encodeURIComponent(key) + "=" + encodeURIComponent(arrayVal));
        });
      } else {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }
    }
    return params.length ? "&" + params.join("&") : "";
  }
  function querystringDecode(querystring2) {
    const obj = {};
    const tokens = querystring2.replace(/^\?/, "").split("&");
    tokens.forEach((token) => {
      if (token) {
        const [key, value] = token.split("=");
        obj[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
    return obj;
  }
  function extractQuerystring(url) {
    const queryStart = url.indexOf("?");
    if (!queryStart) {
      return "";
    }
    const fragmentStart = url.indexOf("#", queryStart);
    return url.substring(queryStart, fragmentStart > 0 ? fragmentStart : void 0);
  }
  function createSubscribe(executor, onNoObservers) {
    const proxy = new ObserverProxy(executor, onNoObservers);
    return proxy.subscribe.bind(proxy);
  }
  class ObserverProxy {
    /**
     * @param executor Function which can make calls to a single Observer
     *     as a proxy.
     * @param onNoObservers Callback when count of Observers goes to zero.
     */
    constructor(executor, onNoObservers) {
      this.observers = [];
      this.unsubscribes = [];
      this.observerCount = 0;
      this.task = Promise.resolve();
      this.finalized = false;
      this.onNoObservers = onNoObservers;
      this.task.then(() => {
        executor(this);
      }).catch((e) => {
        this.error(e);
      });
    }
    next(value) {
      this.forEachObserver((observer) => {
        observer.next(value);
      });
    }
    error(error) {
      this.forEachObserver((observer) => {
        observer.error(error);
      });
      this.close(error);
    }
    complete() {
      this.forEachObserver((observer) => {
        observer.complete();
      });
      this.close();
    }
    /**
     * Subscribe function that can be used to add an Observer to the fan-out list.
     *
     * - We require that no event is sent to a subscriber sychronously to their
     *   call to subscribe().
     */
    subscribe(nextOrObserver, error, complete) {
      let observer;
      if (nextOrObserver === void 0 && error === void 0 && complete === void 0) {
        throw new Error("Missing Observer.");
      }
      if (implementsAnyMethods(nextOrObserver, [
        "next",
        "error",
        "complete"
      ])) {
        observer = nextOrObserver;
      } else {
        observer = {
          next: nextOrObserver,
          error,
          complete
        };
      }
      if (observer.next === void 0) {
        observer.next = noop;
      }
      if (observer.error === void 0) {
        observer.error = noop;
      }
      if (observer.complete === void 0) {
        observer.complete = noop;
      }
      const unsub = this.unsubscribeOne.bind(this, this.observers.length);
      if (this.finalized) {
        this.task.then(() => {
          try {
            if (this.finalError) {
              observer.error(this.finalError);
            } else {
              observer.complete();
            }
          } catch (e) {
          }
          return;
        });
      }
      this.observers.push(observer);
      return unsub;
    }
    // Unsubscribe is synchronous - we guarantee that no events are sent to
    // any unsubscribed Observer.
    unsubscribeOne(i) {
      if (this.observers === void 0 || this.observers[i] === void 0) {
        return;
      }
      delete this.observers[i];
      this.observerCount -= 1;
      if (this.observerCount === 0 && this.onNoObservers !== void 0) {
        this.onNoObservers(this);
      }
    }
    forEachObserver(fn) {
      if (this.finalized) {
        return;
      }
      for (let i = 0; i < this.observers.length; i++) {
        this.sendOne(i, fn);
      }
    }
    // Call the Observer via one of it's callback function. We are careful to
    // confirm that the observe has not been unsubscribed since this asynchronous
    // function had been queued.
    sendOne(i, fn) {
      this.task.then(() => {
        if (this.observers !== void 0 && this.observers[i] !== void 0) {
          try {
            fn(this.observers[i]);
          } catch (e) {
            if (typeof console !== "undefined" && console.error) {
              console.error(e);
            }
          }
        }
      });
    }
    close(err) {
      if (this.finalized) {
        return;
      }
      this.finalized = true;
      if (err !== void 0) {
        this.finalError = err;
      }
      this.task.then(() => {
        this.observers = void 0;
        this.onNoObservers = void 0;
      });
    }
  }
  function implementsAnyMethods(obj, methods) {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    for (const method of methods) {
      if (method in obj && typeof obj[method] === "function") {
        return true;
      }
    }
    return false;
  }
  function noop() {
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const DEFAULT_INTERVAL_MILLIS = 1e3;
  const DEFAULT_BACKOFF_FACTOR = 2;
  const MAX_VALUE_MILLIS = 4 * 60 * 60 * 1e3;
  const RANDOM_FACTOR = 0.5;
  function calculateBackoffMillis(backoffCount, intervalMillis = DEFAULT_INTERVAL_MILLIS, backoffFactor = DEFAULT_BACKOFF_FACTOR) {
    const currBaseValue = intervalMillis * Math.pow(backoffFactor, backoffCount);
    const randomWait = Math.round(
      // A fraction of the backoff value to add/subtract.
      // Deviation: changes multiplication order to improve readability.
      RANDOM_FACTOR * currBaseValue * // A random float (rounded to int by Math.round above) in the range [-1, 1]. Determines
      // if we add or subtract.
      (Math.random() - 0.5) * 2
    );
    return Math.min(MAX_VALUE_MILLIS, currBaseValue + randomWait);
  }
  /**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function getModularInstance(service) {
    if (service && service._delegate) {
      return service._delegate;
    } else {
      return service;
    }
  }
  class Component {
    /**
     *
     * @param name The public service name, e.g. app, auth, firestore, database
     * @param instanceFactory Service factory responsible for creating the public interface
     * @param type whether the service provided by the component is public or private
     */
    constructor(name2, instanceFactory, type) {
      this.name = name2;
      this.instanceFactory = instanceFactory;
      this.type = type;
      this.multipleInstances = false;
      this.serviceProps = {};
      this.instantiationMode = "LAZY";
      this.onInstanceCreated = null;
    }
    setInstantiationMode(mode) {
      this.instantiationMode = mode;
      return this;
    }
    setMultipleInstances(multipleInstances) {
      this.multipleInstances = multipleInstances;
      return this;
    }
    setServiceProps(props) {
      this.serviceProps = props;
      return this;
    }
    setInstanceCreatedCallback(callback) {
      this.onInstanceCreated = callback;
      return this;
    }
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const DEFAULT_ENTRY_NAME$1 = "[DEFAULT]";
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Provider {
    constructor(name2, container) {
      this.name = name2;
      this.container = container;
      this.component = null;
      this.instances = /* @__PURE__ */ new Map();
      this.instancesDeferred = /* @__PURE__ */ new Map();
      this.instancesOptions = /* @__PURE__ */ new Map();
      this.onInitCallbacks = /* @__PURE__ */ new Map();
    }
    /**
     * @param identifier A provider can provide mulitple instances of a service
     * if this.component.multipleInstances is true.
     */
    get(identifier) {
      const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
      if (!this.instancesDeferred.has(normalizedIdentifier)) {
        const deferred = new Deferred();
        this.instancesDeferred.set(normalizedIdentifier, deferred);
        if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
          try {
            const instance = this.getOrInitializeService({
              instanceIdentifier: normalizedIdentifier
            });
            if (instance) {
              deferred.resolve(instance);
            }
          } catch (e) {
          }
        }
      }
      return this.instancesDeferred.get(normalizedIdentifier).promise;
    }
    getImmediate(options) {
      var _a;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
      const optional = (_a = options === null || options === void 0 ? void 0 : options.optional) !== null && _a !== void 0 ? _a : false;
      if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
        try {
          return this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
        } catch (e) {
          if (optional) {
            return null;
          } else {
            throw e;
          }
        }
      } else {
        if (optional) {
          return null;
        } else {
          throw Error(`Service ${this.name} is not available`);
        }
      }
    }
    getComponent() {
      return this.component;
    }
    setComponent(component) {
      if (component.name !== this.name) {
        throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
      }
      if (this.component) {
        throw Error(`Component for ${this.name} has already been provided`);
      }
      this.component = component;
      if (!this.shouldAutoInitialize()) {
        return;
      }
      if (isComponentEager(component)) {
        try {
          this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME$1 });
        } catch (e) {
        }
      }
      for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
        const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
        try {
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier
          });
          instanceDeferred.resolve(instance);
        } catch (e) {
        }
      }
    }
    clearInstance(identifier = DEFAULT_ENTRY_NAME$1) {
      this.instancesDeferred.delete(identifier);
      this.instancesOptions.delete(identifier);
      this.instances.delete(identifier);
    }
    // app.delete() will call this method on every provider to delete the services
    // TODO: should we mark the provider as deleted?
    async delete() {
      const services = Array.from(this.instances.values());
      await Promise.all([
        ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
        ...services.filter((service) => "_delete" in service).map((service) => service._delete())
      ]);
    }
    isComponentSet() {
      return this.component != null;
    }
    isInitialized(identifier = DEFAULT_ENTRY_NAME$1) {
      return this.instances.has(identifier);
    }
    getOptions(identifier = DEFAULT_ENTRY_NAME$1) {
      return this.instancesOptions.get(identifier) || {};
    }
    initialize(opts = {}) {
      const { options = {} } = opts;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
      if (this.isInitialized(normalizedIdentifier)) {
        throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
      }
      if (!this.isComponentSet()) {
        throw Error(`Component ${this.name} has not been registered yet`);
      }
      const instance = this.getOrInitializeService({
        instanceIdentifier: normalizedIdentifier,
        options
      });
      for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
        const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
        if (normalizedIdentifier === normalizedDeferredIdentifier) {
          instanceDeferred.resolve(instance);
        }
      }
      return instance;
    }
    /**
     *
     * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
     * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
     *
     * @param identifier An optional instance identifier
     * @returns a function to unregister the callback
     */
    onInit(callback, identifier) {
      var _a;
      const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
      const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Set();
      existingCallbacks.add(callback);
      this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
      const existingInstance = this.instances.get(normalizedIdentifier);
      if (existingInstance) {
        callback(existingInstance, normalizedIdentifier);
      }
      return () => {
        existingCallbacks.delete(callback);
      };
    }
    /**
     * Invoke onInit callbacks synchronously
     * @param instance the service instance`
     */
    invokeOnInitCallbacks(instance, identifier) {
      const callbacks = this.onInitCallbacks.get(identifier);
      if (!callbacks) {
        return;
      }
      for (const callback of callbacks) {
        try {
          callback(instance, identifier);
        } catch (_a) {
        }
      }
    }
    getOrInitializeService({ instanceIdentifier, options = {} }) {
      let instance = this.instances.get(instanceIdentifier);
      if (!instance && this.component) {
        instance = this.component.instanceFactory(this.container, {
          instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
          options
        });
        this.instances.set(instanceIdentifier, instance);
        this.instancesOptions.set(instanceIdentifier, options);
        this.invokeOnInitCallbacks(instance, instanceIdentifier);
        if (this.component.onInstanceCreated) {
          try {
            this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
          } catch (_a) {
          }
        }
      }
      return instance || null;
    }
    normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME$1) {
      if (this.component) {
        return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME$1;
      } else {
        return identifier;
      }
    }
    shouldAutoInitialize() {
      return !!this.component && this.component.instantiationMode !== "EXPLICIT";
    }
  }
  function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME$1 ? void 0 : identifier;
  }
  function isComponentEager(component) {
    return component.instantiationMode === "EAGER";
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class ComponentContainer {
    constructor(name2) {
      this.name = name2;
      this.providers = /* @__PURE__ */ new Map();
    }
    /**
     *
     * @param component Component being added
     * @param overwrite When a component with the same name has already been registered,
     * if overwrite is true: overwrite the existing component with the new component and create a new
     * provider with the new component. It can be useful in tests where you want to use different mocks
     * for different tests.
     * if overwrite is false: throw an exception
     */
    addComponent(component) {
      const provider = this.getProvider(component.name);
      if (provider.isComponentSet()) {
        throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
      }
      provider.setComponent(component);
    }
    addOrOverwriteComponent(component) {
      const provider = this.getProvider(component.name);
      if (provider.isComponentSet()) {
        this.providers.delete(component.name);
      }
      this.addComponent(component);
    }
    /**
     * getProvider provides a type safe interface where it can only be called with a field name
     * present in NameServiceMapping interface.
     *
     * Firebase SDKs providing services should extend NameServiceMapping interface to register
     * themselves.
     */
    getProvider(name2) {
      if (this.providers.has(name2)) {
        return this.providers.get(name2);
      }
      const provider = new Provider(name2, this);
      this.providers.set(name2, provider);
      return provider;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var LogLevel;
  (function(LogLevel2) {
    LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
    LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
    LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
    LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
    LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
    LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
  })(LogLevel || (LogLevel = {}));
  const levelStringToEnum = {
    "debug": LogLevel.DEBUG,
    "verbose": LogLevel.VERBOSE,
    "info": LogLevel.INFO,
    "warn": LogLevel.WARN,
    "error": LogLevel.ERROR,
    "silent": LogLevel.SILENT
  };
  const defaultLogLevel = LogLevel.INFO;
  const ConsoleMethod = {
    [LogLevel.DEBUG]: "log",
    [LogLevel.VERBOSE]: "log",
    [LogLevel.INFO]: "info",
    [LogLevel.WARN]: "warn",
    [LogLevel.ERROR]: "error"
  };
  const defaultLogHandler = (instance, logType, ...args) => {
    if (logType < instance.logLevel) {
      return;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const method = ConsoleMethod[logType];
    if (method) {
      console[method](`[${now}]  ${instance.name}:`, ...args);
    } else {
      throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
    }
  };
  class Logger {
    /**
     * Gives you an instance of a Logger to capture messages according to
     * Firebase's logging scheme.
     *
     * @param name The name that the logs will be associated with
     */
    constructor(name2) {
      this.name = name2;
      this._logLevel = defaultLogLevel;
      this._logHandler = defaultLogHandler;
      this._userLogHandler = null;
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(val) {
      if (!(val in LogLevel)) {
        throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
      }
      this._logLevel = val;
    }
    // Workaround for setter/getter having to be the same type.
    setLogLevel(val) {
      this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
    }
    get logHandler() {
      return this._logHandler;
    }
    set logHandler(val) {
      if (typeof val !== "function") {
        throw new TypeError("Value assigned to `logHandler` must be a function");
      }
      this._logHandler = val;
    }
    get userLogHandler() {
      return this._userLogHandler;
    }
    set userLogHandler(val) {
      this._userLogHandler = val;
    }
    /**
     * The functions below are all based on the `console` interface
     */
    debug(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
      this._logHandler(this, LogLevel.DEBUG, ...args);
    }
    log(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
      this._logHandler(this, LogLevel.VERBOSE, ...args);
    }
    info(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
      this._logHandler(this, LogLevel.INFO, ...args);
    }
    warn(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
      this._logHandler(this, LogLevel.WARN, ...args);
    }
    error(...args) {
      this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
      this._logHandler(this, LogLevel.ERROR, ...args);
    }
  }
  const instanceOfAny = (object, constructors) => constructors.some((c2) => object instanceof c2);
  let idbProxyableTypes;
  let cursorAdvanceMethods;
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  const cursorRequestMap = /* @__PURE__ */ new WeakMap();
  const transactionDoneMap = /* @__PURE__ */ new WeakMap();
  const transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
  const transformCache = /* @__PURE__ */ new WeakMap();
  const reverseTransformCache = /* @__PURE__ */ new WeakMap();
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    promise.then((value) => {
      if (value instanceof IDBCursor) {
        cursorRequestMap.set(value, request);
      }
    }).catch(() => {
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  let idbProxyTraps = {
    get(target, prop, receiver) {
      if (target instanceof IDBTransaction) {
        if (prop === "done")
          return transactionDoneMap.get(target);
        if (prop === "objectStoreNames") {
          return target.objectStoreNames || transactionStoreNamesMap.get(target);
        }
        if (prop === "store") {
          return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
        }
      }
      return wrap(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
        return true;
      }
      return prop in target;
    }
  };
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
      return function(storeNames, ...args) {
        const tx = func.call(unwrap(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
        return wrap(tx);
      };
    }
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(cursorRequestMap.get(this));
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  const unwrap = (value) => reverseTransformCache.get(value);
  function openDB(name2, version2, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name2, version2);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db2) => {
      if (terminated)
        db2.addEventListener("close", () => terminated());
      if (blocking) {
        db2.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  const readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
  const writeMethods = ["put", "add", "delete", "clear"];
  const cachedMethods = /* @__PURE__ */ new Map();
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
    ) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
  }));
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class PlatformLoggerServiceImpl {
    constructor(container) {
      this.container = container;
    }
    // In initial implementation, this will be called by installations on
    // auth token refresh, and installations will send this string.
    getPlatformInfoString() {
      const providers = this.container.getProviders();
      return providers.map((provider) => {
        if (isVersionServiceProvider(provider)) {
          const service = provider.getImmediate();
          return `${service.library}/${service.version}`;
        } else {
          return null;
        }
      }).filter((logString) => logString).join(" ");
    }
  }
  function isVersionServiceProvider(provider) {
    const component = provider.getComponent();
    return (component === null || component === void 0 ? void 0 : component.type) === "VERSION";
  }
  const name$p = "@firebase/app";
  const version$1$1 = "0.10.4";
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const logger$1 = new Logger("@firebase/app");
  const name$o = "@firebase/app-compat";
  const name$n = "@firebase/analytics-compat";
  const name$m = "@firebase/analytics";
  const name$l = "@firebase/app-check-compat";
  const name$k = "@firebase/app-check";
  const name$j = "@firebase/auth";
  const name$i = "@firebase/auth-compat";
  const name$h = "@firebase/database";
  const name$g = "@firebase/database-compat";
  const name$f = "@firebase/functions";
  const name$e = "@firebase/functions-compat";
  const name$d = "@firebase/installations";
  const name$c = "@firebase/installations-compat";
  const name$b = "@firebase/messaging";
  const name$a = "@firebase/messaging-compat";
  const name$9 = "@firebase/performance";
  const name$8 = "@firebase/performance-compat";
  const name$7 = "@firebase/remote-config";
  const name$6 = "@firebase/remote-config-compat";
  const name$5 = "@firebase/storage";
  const name$4 = "@firebase/storage-compat";
  const name$3$1 = "@firebase/firestore";
  const name$2$1 = "@firebase/vertexai-preview";
  const name$1$1 = "@firebase/firestore-compat";
  const name$q = "firebase";
  const version$4 = "10.12.1";
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const DEFAULT_ENTRY_NAME = "[DEFAULT]";
  const PLATFORM_LOG_STRING = {
    [name$p]: "fire-core",
    [name$o]: "fire-core-compat",
    [name$m]: "fire-analytics",
    [name$n]: "fire-analytics-compat",
    [name$k]: "fire-app-check",
    [name$l]: "fire-app-check-compat",
    [name$j]: "fire-auth",
    [name$i]: "fire-auth-compat",
    [name$h]: "fire-rtdb",
    [name$g]: "fire-rtdb-compat",
    [name$f]: "fire-fn",
    [name$e]: "fire-fn-compat",
    [name$d]: "fire-iid",
    [name$c]: "fire-iid-compat",
    [name$b]: "fire-fcm",
    [name$a]: "fire-fcm-compat",
    [name$9]: "fire-perf",
    [name$8]: "fire-perf-compat",
    [name$7]: "fire-rc",
    [name$6]: "fire-rc-compat",
    [name$5]: "fire-gcs",
    [name$4]: "fire-gcs-compat",
    [name$3$1]: "fire-fst",
    [name$1$1]: "fire-fst-compat",
    [name$2$1]: "fire-vertex",
    "fire-js": "fire-js",
    [name$q]: "fire-js-all"
  };
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const _apps = /* @__PURE__ */ new Map();
  const _serverApps = /* @__PURE__ */ new Map();
  const _components = /* @__PURE__ */ new Map();
  function _addComponent(app2, component) {
    try {
      app2.container.addComponent(component);
    } catch (e) {
      logger$1.debug(`Component ${component.name} failed to register with FirebaseApp ${app2.name}`, e);
    }
  }
  function _registerComponent(component) {
    const componentName = component.name;
    if (_components.has(componentName)) {
      logger$1.debug(`There were multiple attempts to register component ${componentName}.`);
      return false;
    }
    _components.set(componentName, component);
    for (const app2 of _apps.values()) {
      _addComponent(app2, component);
    }
    for (const serverApp of _serverApps.values()) {
      _addComponent(serverApp, component);
    }
    return true;
  }
  function _getProvider(app2, name2) {
    const heartbeatController = app2.container.getProvider("heartbeat").getImmediate({ optional: true });
    if (heartbeatController) {
      void heartbeatController.triggerHeartbeat();
    }
    return app2.container.getProvider(name2);
  }
  function _isFirebaseServerApp(obj) {
    return obj.settings !== void 0;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const ERRORS$1 = {
    [
      "no-app"
      /* AppError.NO_APP */
    ]: "No Firebase App '{$appName}' has been created - call initializeApp() first",
    [
      "bad-app-name"
      /* AppError.BAD_APP_NAME */
    ]: "Illegal App name: '{$appName}'",
    [
      "duplicate-app"
      /* AppError.DUPLICATE_APP */
    ]: "Firebase App named '{$appName}' already exists with different options or config",
    [
      "app-deleted"
      /* AppError.APP_DELETED */
    ]: "Firebase App named '{$appName}' already deleted",
    [
      "server-app-deleted"
      /* AppError.SERVER_APP_DELETED */
    ]: "Firebase Server App has been deleted",
    [
      "no-options"
      /* AppError.NO_OPTIONS */
    ]: "Need to provide options, when not being deployed to hosting via source.",
    [
      "invalid-app-argument"
      /* AppError.INVALID_APP_ARGUMENT */
    ]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    [
      "invalid-log-argument"
      /* AppError.INVALID_LOG_ARGUMENT */
    ]: "First argument to `onLog` must be null or a function.",
    [
      "idb-open"
      /* AppError.IDB_OPEN */
    ]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-get"
      /* AppError.IDB_GET */
    ]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-set"
      /* AppError.IDB_WRITE */
    ]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "idb-delete"
      /* AppError.IDB_DELETE */
    ]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
    [
      "finalization-registry-not-supported"
      /* AppError.FINALIZATION_REGISTRY_NOT_SUPPORTED */
    ]: "FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",
    [
      "invalid-server-app-environment"
      /* AppError.INVALID_SERVER_APP_ENVIRONMENT */
    ]: "FirebaseServerApp is not for use in browser environments."
  };
  const ERROR_FACTORY$2 = new ErrorFactory("app", "Firebase", ERRORS$1);
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class FirebaseAppImpl {
    constructor(options, config, container) {
      this._isDeleted = false;
      this._options = Object.assign({}, options);
      this._config = Object.assign({}, config);
      this._name = config.name;
      this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
      this._container = container;
      this.container.addComponent(new Component(
        "app",
        () => this,
        "PUBLIC"
        /* ComponentType.PUBLIC */
      ));
    }
    get automaticDataCollectionEnabled() {
      this.checkDestroyed();
      return this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(val) {
      this.checkDestroyed();
      this._automaticDataCollectionEnabled = val;
    }
    get name() {
      this.checkDestroyed();
      return this._name;
    }
    get options() {
      this.checkDestroyed();
      return this._options;
    }
    get config() {
      this.checkDestroyed();
      return this._config;
    }
    get container() {
      return this._container;
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(val) {
      this._isDeleted = val;
    }
    /**
     * This function will throw an Error if the App has already been deleted -
     * use before performing API actions on the App.
     */
    checkDestroyed() {
      if (this.isDeleted) {
        throw ERROR_FACTORY$2.create("app-deleted", { appName: this._name });
      }
    }
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const SDK_VERSION = version$4;
  function initializeApp(_options, rawConfig = {}) {
    let options = _options;
    if (typeof rawConfig !== "object") {
      const name3 = rawConfig;
      rawConfig = { name: name3 };
    }
    const config = Object.assign({ name: DEFAULT_ENTRY_NAME, automaticDataCollectionEnabled: false }, rawConfig);
    const name2 = config.name;
    if (typeof name2 !== "string" || !name2) {
      throw ERROR_FACTORY$2.create("bad-app-name", {
        appName: String(name2)
      });
    }
    options || (options = getDefaultAppConfig());
    if (!options) {
      throw ERROR_FACTORY$2.create(
        "no-options"
        /* AppError.NO_OPTIONS */
      );
    }
    const existingApp = _apps.get(name2);
    if (existingApp) {
      if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
        return existingApp;
      } else {
        throw ERROR_FACTORY$2.create("duplicate-app", { appName: name2 });
      }
    }
    const container = new ComponentContainer(name2);
    for (const component of _components.values()) {
      container.addComponent(component);
    }
    const newApp = new FirebaseAppImpl(options, config, container);
    _apps.set(name2, newApp);
    return newApp;
  }
  function getApp(name2 = DEFAULT_ENTRY_NAME) {
    const app2 = _apps.get(name2);
    if (!app2 && name2 === DEFAULT_ENTRY_NAME && getDefaultAppConfig()) {
      return initializeApp();
    }
    if (!app2) {
      throw ERROR_FACTORY$2.create("no-app", { appName: name2 });
    }
    return app2;
  }
  function registerVersion(libraryKeyOrName, version2, variant) {
    var _a;
    let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
    if (variant) {
      library += `-${variant}`;
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version2.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
      const warning = [
        `Unable to register library "${library}" with version "${version2}":`
      ];
      if (libraryMismatch) {
        warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
      }
      if (libraryMismatch && versionMismatch) {
        warning.push("and");
      }
      if (versionMismatch) {
        warning.push(`version name "${version2}" contains illegal characters (whitespace or "/")`);
      }
      logger$1.warn(warning.join(" "));
      return;
    }
    _registerComponent(new Component(
      `${library}-version`,
      () => ({ library, version: version2 }),
      "VERSION"
      /* ComponentType.VERSION */
    ));
  }
  /**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const DB_NAME$1 = "firebase-heartbeat-database";
  const DB_VERSION$1 = 1;
  const STORE_NAME = "firebase-heartbeat-store";
  let dbPromise$1 = null;
  function getDbPromise$1() {
    if (!dbPromise$1) {
      dbPromise$1 = openDB(DB_NAME$1, DB_VERSION$1, {
        upgrade: (db2, oldVersion) => {
          switch (oldVersion) {
            case 0:
              try {
                db2.createObjectStore(STORE_NAME);
              } catch (e) {
                console.warn(e);
              }
          }
        }
      }).catch((e) => {
        throw ERROR_FACTORY$2.create("idb-open", {
          originalErrorMessage: e.message
        });
      });
    }
    return dbPromise$1;
  }
  async function readHeartbeatsFromIndexedDB(app2) {
    try {
      const db2 = await getDbPromise$1();
      const tx = db2.transaction(STORE_NAME);
      const result = await tx.objectStore(STORE_NAME).get(computeKey(app2));
      await tx.done;
      return result;
    } catch (e) {
      if (e instanceof FirebaseError) {
        logger$1.warn(e.message);
      } else {
        const idbGetError = ERROR_FACTORY$2.create("idb-get", {
          originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
        });
        logger$1.warn(idbGetError.message);
      }
    }
  }
  async function writeHeartbeatsToIndexedDB(app2, heartbeatObject) {
    try {
      const db2 = await getDbPromise$1();
      const tx = db2.transaction(STORE_NAME, "readwrite");
      const objectStore = tx.objectStore(STORE_NAME);
      await objectStore.put(heartbeatObject, computeKey(app2));
      await tx.done;
    } catch (e) {
      if (e instanceof FirebaseError) {
        logger$1.warn(e.message);
      } else {
        const idbGetError = ERROR_FACTORY$2.create("idb-set", {
          originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
        });
        logger$1.warn(idbGetError.message);
      }
    }
  }
  function computeKey(app2) {
    return `${app2.name}!${app2.options.appId}`;
  }
  /**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const MAX_HEADER_BYTES = 1024;
  const STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1e3;
  class HeartbeatServiceImpl {
    constructor(container) {
      this.container = container;
      this._heartbeatsCache = null;
      const app2 = this.container.getProvider("app").getImmediate();
      this._storage = new HeartbeatStorageImpl(app2);
      this._heartbeatsCachePromise = this._storage.read().then((result) => {
        this._heartbeatsCache = result;
        return result;
      });
    }
    /**
     * Called to report a heartbeat. The function will generate
     * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
     * to IndexedDB.
     * Note that we only store one heartbeat per day. So if a heartbeat for today is
     * already logged, subsequent calls to this function in the same day will be ignored.
     */
    async triggerHeartbeat() {
      var _a, _b;
      const platformLogger = this.container.getProvider("platform-logger").getImmediate();
      const agent = platformLogger.getPlatformInfoString();
      const date = getUTCDateString();
      if (((_a = this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null) {
        this._heartbeatsCache = await this._heartbeatsCachePromise;
        if (((_b = this._heartbeatsCache) === null || _b === void 0 ? void 0 : _b.heartbeats) == null) {
          return;
        }
      }
      if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
        return;
      } else {
        this._heartbeatsCache.heartbeats.push({ date, agent });
      }
      this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat) => {
        const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
        const now = Date.now();
        return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
      });
      return this._storage.overwrite(this._heartbeatsCache);
    }
    /**
     * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
     * It also clears all heartbeats from memory as well as in IndexedDB.
     *
     * NOTE: Consuming product SDKs should not send the header if this method
     * returns an empty string.
     */
    async getHeartbeatsHeader() {
      var _a;
      if (this._heartbeatsCache === null) {
        await this._heartbeatsCachePromise;
      }
      if (((_a = this._heartbeatsCache) === null || _a === void 0 ? void 0 : _a.heartbeats) == null || this._heartbeatsCache.heartbeats.length === 0) {
        return "";
      }
      const date = getUTCDateString();
      const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
      const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
      this._heartbeatsCache.lastSentHeartbeatDate = date;
      if (unsentEntries.length > 0) {
        this._heartbeatsCache.heartbeats = unsentEntries;
        await this._storage.overwrite(this._heartbeatsCache);
      } else {
        this._heartbeatsCache.heartbeats = [];
        void this._storage.overwrite(this._heartbeatsCache);
      }
      return headerString;
    }
  }
  function getUTCDateString() {
    const today = /* @__PURE__ */ new Date();
    return today.toISOString().substring(0, 10);
  }
  function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
    const heartbeatsToSend = [];
    let unsentEntries = heartbeatsCache.slice();
    for (const singleDateHeartbeat of heartbeatsCache) {
      const heartbeatEntry = heartbeatsToSend.find((hb2) => hb2.agent === singleDateHeartbeat.agent);
      if (!heartbeatEntry) {
        heartbeatsToSend.push({
          agent: singleDateHeartbeat.agent,
          dates: [singleDateHeartbeat.date]
        });
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatsToSend.pop();
          break;
        }
      } else {
        heartbeatEntry.dates.push(singleDateHeartbeat.date);
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatEntry.dates.pop();
          break;
        }
      }
      unsentEntries = unsentEntries.slice(1);
    }
    return {
      heartbeatsToSend,
      unsentEntries
    };
  }
  class HeartbeatStorageImpl {
    constructor(app2) {
      this.app = app2;
      this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
    }
    async runIndexedDBEnvironmentCheck() {
      if (!isIndexedDBAvailable()) {
        return false;
      } else {
        return validateIndexedDBOpenable().then(() => true).catch(() => false);
      }
    }
    /**
     * Read all heartbeats.
     */
    async read() {
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return { heartbeats: [] };
      } else {
        const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
        if (idbHeartbeatObject === null || idbHeartbeatObject === void 0 ? void 0 : idbHeartbeatObject.heartbeats) {
          return idbHeartbeatObject;
        } else {
          return { heartbeats: [] };
        }
      }
    }
    // overwrite the storage with the provided heartbeats
    async overwrite(heartbeatsObject) {
      var _a;
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return;
      } else {
        const existingHeartbeatsObject = await this.read();
        return writeHeartbeatsToIndexedDB(this.app, {
          lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
          heartbeats: heartbeatsObject.heartbeats
        });
      }
    }
    // add heartbeats
    async add(heartbeatsObject) {
      var _a;
      const canUseIndexedDB = await this._canUseIndexedDBPromise;
      if (!canUseIndexedDB) {
        return;
      } else {
        const existingHeartbeatsObject = await this.read();
        return writeHeartbeatsToIndexedDB(this.app, {
          lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
          heartbeats: [
            ...existingHeartbeatsObject.heartbeats,
            ...heartbeatsObject.heartbeats
          ]
        });
      }
    }
  }
  function countBytes(heartbeatsCache) {
    return base64urlEncodeWithoutPadding(
      // heartbeatsCache wrapper properties
      JSON.stringify({ version: 2, heartbeats: heartbeatsCache })
    ).length;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function registerCoreComponents(variant) {
    _registerComponent(new Component(
      "platform-logger",
      (container) => new PlatformLoggerServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    _registerComponent(new Component(
      "heartbeat",
      (container) => new HeartbeatServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    registerVersion(name$p, version$1$1, variant);
    registerVersion(name$p, version$1$1, "esm2017");
    registerVersion("fire-js", "");
  }
  registerCoreComponents("");
  function __rest(s, e) {
    var t2 = {};
    for (var p2 in s)
      if (Object.prototype.hasOwnProperty.call(s, p2) && e.indexOf(p2) < 0)
        t2[p2] = s[p2];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p2 = Object.getOwnPropertySymbols(s); i < p2.length; i++) {
        if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i]))
          t2[p2[i]] = s[p2[i]];
      }
    return t2;
  }
  typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };
  function _prodErrorMap() {
    return {
      [
        "dependent-sdk-initialized-before-auth"
        /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
      ]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
    };
  }
  const prodErrorMap = _prodErrorMap;
  const _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory("auth", "Firebase", _prodErrorMap());
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const logClient = new Logger("@firebase/auth");
  function _logWarn(msg, ...args) {
    if (logClient.logLevel <= LogLevel.WARN) {
      logClient.warn(`Auth (${SDK_VERSION}): ${msg}`, ...args);
    }
  }
  function _logError(msg, ...args) {
    if (logClient.logLevel <= LogLevel.ERROR) {
      logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _fail(authOrCode, ...rest) {
    throw createErrorInternal(authOrCode, ...rest);
  }
  function _createError(authOrCode, ...rest) {
    return createErrorInternal(authOrCode, ...rest);
  }
  function _errorWithCustomMessage(auth2, code, message) {
    const errorMap = Object.assign(Object.assign({}, prodErrorMap()), { [code]: message });
    const factory2 = new ErrorFactory("auth", "Firebase", errorMap);
    return factory2.create(code, {
      appName: auth2.name
    });
  }
  function _serverAppCurrentUserOperationNotSupportedError(auth2) {
    return _errorWithCustomMessage(auth2, "operation-not-supported-in-this-environment", "Operations that alter the current user are not supported in conjunction with FirebaseServerApp");
  }
  function createErrorInternal(authOrCode, ...rest) {
    if (typeof authOrCode !== "string") {
      const code = rest[0];
      const fullParams = [...rest.slice(1)];
      if (fullParams[0]) {
        fullParams[0].appName = authOrCode.name;
      }
      return authOrCode._errorFactory.create(code, ...fullParams);
    }
    return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
  }
  function _assert(assertion, authOrCode, ...rest) {
    if (!assertion) {
      throw createErrorInternal(authOrCode, ...rest);
    }
  }
  function debugFail(failure) {
    const message = `INTERNAL ASSERTION FAILED: ` + failure;
    _logError(message);
    throw new Error(message);
  }
  function debugAssert(assertion, message) {
    if (!assertion) {
      debugFail(message);
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _getCurrentUrl() {
    var _a;
    return typeof self !== "undefined" && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.href) || "";
  }
  function _isHttpOrHttps() {
    return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
  }
  function _getCurrentScheme() {
    var _a;
    return typeof self !== "undefined" && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.protocol) || null;
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _isOnline() {
    if (typeof navigator !== "undefined" && navigator && "onLine" in navigator && typeof navigator.onLine === "boolean" && // Apply only for traditional web apps and Chrome extensions.
    // This is especially true for Cordova apps which have unreliable
    // navigator.onLine behavior unless cordova-plugin-network-information is
    // installed which overwrites the native navigator.onLine value and
    // defines navigator.connection.
    (_isHttpOrHttps() || isBrowserExtension() || "connection" in navigator)) {
      return navigator.onLine;
    }
    return true;
  }
  function _getUserLanguage() {
    if (typeof navigator === "undefined") {
      return null;
    }
    const navigatorLanguage = navigator;
    return (
      // Most reliable, but only supported in Chrome/Firefox.
      navigatorLanguage.languages && navigatorLanguage.languages[0] || // Supported in most browsers, but returns the language of the browser
      // UI, not the language set in browser settings.
      navigatorLanguage.language || // Couldn't determine language.
      null
    );
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Delay {
    constructor(shortDelay, longDelay) {
      this.shortDelay = shortDelay;
      this.longDelay = longDelay;
      debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
      this.isMobile = isMobileCordova() || isReactNative();
    }
    get() {
      if (!_isOnline()) {
        return Math.min(5e3, this.shortDelay);
      }
      return this.isMobile ? this.longDelay : this.shortDelay;
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _emulatorUrl(config, path) {
    debugAssert(config.emulator, "Emulator should always be set here");
    const { url } = config.emulator;
    if (!path) {
      return url;
    }
    return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class FetchProvider {
    static initialize(fetchImpl, headersImpl, responseImpl) {
      this.fetchImpl = fetchImpl;
      if (headersImpl) {
        this.headersImpl = headersImpl;
      }
      if (responseImpl) {
        this.responseImpl = responseImpl;
      }
    }
    static fetch() {
      if (this.fetchImpl) {
        return this.fetchImpl;
      }
      if (typeof self !== "undefined" && "fetch" in self) {
        return self.fetch;
      }
      if (typeof globalThis !== "undefined" && globalThis.fetch) {
        return globalThis.fetch;
      }
      if (typeof fetch !== "undefined") {
        return fetch;
      }
      debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
    }
    static headers() {
      if (this.headersImpl) {
        return this.headersImpl;
      }
      if (typeof self !== "undefined" && "Headers" in self) {
        return self.Headers;
      }
      if (typeof globalThis !== "undefined" && globalThis.Headers) {
        return globalThis.Headers;
      }
      if (typeof Headers !== "undefined") {
        return Headers;
      }
      debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
    }
    static response() {
      if (this.responseImpl) {
        return this.responseImpl;
      }
      if (typeof self !== "undefined" && "Response" in self) {
        return self.Response;
      }
      if (typeof globalThis !== "undefined" && globalThis.Response) {
        return globalThis.Response;
      }
      if (typeof Response !== "undefined") {
        return Response;
      }
      debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const SERVER_ERROR_MAP = {
    // Custom token errors.
    [
      "CREDENTIAL_MISMATCH"
      /* ServerError.CREDENTIAL_MISMATCH */
    ]: "custom-token-mismatch",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_CUSTOM_TOKEN"
      /* ServerError.MISSING_CUSTOM_TOKEN */
    ]: "internal-error",
    // Create Auth URI errors.
    [
      "INVALID_IDENTIFIER"
      /* ServerError.INVALID_IDENTIFIER */
    ]: "invalid-email",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_CONTINUE_URI"
      /* ServerError.MISSING_CONTINUE_URI */
    ]: "internal-error",
    // Sign in with email and password errors (some apply to sign up too).
    [
      "INVALID_PASSWORD"
      /* ServerError.INVALID_PASSWORD */
    ]: "wrong-password",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_PASSWORD"
      /* ServerError.MISSING_PASSWORD */
    ]: "missing-password",
    // Thrown if Email Enumeration Protection is enabled in the project and the email or password is
    // invalid.
    [
      "INVALID_LOGIN_CREDENTIALS"
      /* ServerError.INVALID_LOGIN_CREDENTIALS */
    ]: "invalid-credential",
    // Sign up with email and password errors.
    [
      "EMAIL_EXISTS"
      /* ServerError.EMAIL_EXISTS */
    ]: "email-already-in-use",
    [
      "PASSWORD_LOGIN_DISABLED"
      /* ServerError.PASSWORD_LOGIN_DISABLED */
    ]: "operation-not-allowed",
    // Verify assertion for sign in with credential errors:
    [
      "INVALID_IDP_RESPONSE"
      /* ServerError.INVALID_IDP_RESPONSE */
    ]: "invalid-credential",
    [
      "INVALID_PENDING_TOKEN"
      /* ServerError.INVALID_PENDING_TOKEN */
    ]: "invalid-credential",
    [
      "FEDERATED_USER_ID_ALREADY_LINKED"
      /* ServerError.FEDERATED_USER_ID_ALREADY_LINKED */
    ]: "credential-already-in-use",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_REQ_TYPE"
      /* ServerError.MISSING_REQ_TYPE */
    ]: "internal-error",
    // Send Password reset email errors:
    [
      "EMAIL_NOT_FOUND"
      /* ServerError.EMAIL_NOT_FOUND */
    ]: "user-not-found",
    [
      "RESET_PASSWORD_EXCEED_LIMIT"
      /* ServerError.RESET_PASSWORD_EXCEED_LIMIT */
    ]: "too-many-requests",
    [
      "EXPIRED_OOB_CODE"
      /* ServerError.EXPIRED_OOB_CODE */
    ]: "expired-action-code",
    [
      "INVALID_OOB_CODE"
      /* ServerError.INVALID_OOB_CODE */
    ]: "invalid-action-code",
    // This can only happen if the SDK sends a bad request.
    [
      "MISSING_OOB_CODE"
      /* ServerError.MISSING_OOB_CODE */
    ]: "internal-error",
    // Operations that require ID token in request:
    [
      "CREDENTIAL_TOO_OLD_LOGIN_AGAIN"
      /* ServerError.CREDENTIAL_TOO_OLD_LOGIN_AGAIN */
    ]: "requires-recent-login",
    [
      "INVALID_ID_TOKEN"
      /* ServerError.INVALID_ID_TOKEN */
    ]: "invalid-user-token",
    [
      "TOKEN_EXPIRED"
      /* ServerError.TOKEN_EXPIRED */
    ]: "user-token-expired",
    [
      "USER_NOT_FOUND"
      /* ServerError.USER_NOT_FOUND */
    ]: "user-token-expired",
    // Other errors.
    [
      "TOO_MANY_ATTEMPTS_TRY_LATER"
      /* ServerError.TOO_MANY_ATTEMPTS_TRY_LATER */
    ]: "too-many-requests",
    [
      "PASSWORD_DOES_NOT_MEET_REQUIREMENTS"
      /* ServerError.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */
    ]: "password-does-not-meet-requirements",
    // Phone Auth related errors.
    [
      "INVALID_CODE"
      /* ServerError.INVALID_CODE */
    ]: "invalid-verification-code",
    [
      "INVALID_SESSION_INFO"
      /* ServerError.INVALID_SESSION_INFO */
    ]: "invalid-verification-id",
    [
      "INVALID_TEMPORARY_PROOF"
      /* ServerError.INVALID_TEMPORARY_PROOF */
    ]: "invalid-credential",
    [
      "MISSING_SESSION_INFO"
      /* ServerError.MISSING_SESSION_INFO */
    ]: "missing-verification-id",
    [
      "SESSION_EXPIRED"
      /* ServerError.SESSION_EXPIRED */
    ]: "code-expired",
    // Other action code errors when additional settings passed.
    // MISSING_CONTINUE_URI is getting mapped to INTERNAL_ERROR above.
    // This is OK as this error will be caught by client side validation.
    [
      "MISSING_ANDROID_PACKAGE_NAME"
      /* ServerError.MISSING_ANDROID_PACKAGE_NAME */
    ]: "missing-android-pkg-name",
    [
      "UNAUTHORIZED_DOMAIN"
      /* ServerError.UNAUTHORIZED_DOMAIN */
    ]: "unauthorized-continue-uri",
    // getProjectConfig errors when clientId is passed.
    [
      "INVALID_OAUTH_CLIENT_ID"
      /* ServerError.INVALID_OAUTH_CLIENT_ID */
    ]: "invalid-oauth-client-id",
    // User actions (sign-up or deletion) disabled errors.
    [
      "ADMIN_ONLY_OPERATION"
      /* ServerError.ADMIN_ONLY_OPERATION */
    ]: "admin-restricted-operation",
    // Multi factor related errors.
    [
      "INVALID_MFA_PENDING_CREDENTIAL"
      /* ServerError.INVALID_MFA_PENDING_CREDENTIAL */
    ]: "invalid-multi-factor-session",
    [
      "MFA_ENROLLMENT_NOT_FOUND"
      /* ServerError.MFA_ENROLLMENT_NOT_FOUND */
    ]: "multi-factor-info-not-found",
    [
      "MISSING_MFA_ENROLLMENT_ID"
      /* ServerError.MISSING_MFA_ENROLLMENT_ID */
    ]: "missing-multi-factor-info",
    [
      "MISSING_MFA_PENDING_CREDENTIAL"
      /* ServerError.MISSING_MFA_PENDING_CREDENTIAL */
    ]: "missing-multi-factor-session",
    [
      "SECOND_FACTOR_EXISTS"
      /* ServerError.SECOND_FACTOR_EXISTS */
    ]: "second-factor-already-in-use",
    [
      "SECOND_FACTOR_LIMIT_EXCEEDED"
      /* ServerError.SECOND_FACTOR_LIMIT_EXCEEDED */
    ]: "maximum-second-factor-count-exceeded",
    // Blocking functions related errors.
    [
      "BLOCKING_FUNCTION_ERROR_RESPONSE"
      /* ServerError.BLOCKING_FUNCTION_ERROR_RESPONSE */
    ]: "internal-error",
    // Recaptcha related errors.
    [
      "RECAPTCHA_NOT_ENABLED"
      /* ServerError.RECAPTCHA_NOT_ENABLED */
    ]: "recaptcha-not-enabled",
    [
      "MISSING_RECAPTCHA_TOKEN"
      /* ServerError.MISSING_RECAPTCHA_TOKEN */
    ]: "missing-recaptcha-token",
    [
      "INVALID_RECAPTCHA_TOKEN"
      /* ServerError.INVALID_RECAPTCHA_TOKEN */
    ]: "invalid-recaptcha-token",
    [
      "INVALID_RECAPTCHA_ACTION"
      /* ServerError.INVALID_RECAPTCHA_ACTION */
    ]: "invalid-recaptcha-action",
    [
      "MISSING_CLIENT_TYPE"
      /* ServerError.MISSING_CLIENT_TYPE */
    ]: "missing-client-type",
    [
      "MISSING_RECAPTCHA_VERSION"
      /* ServerError.MISSING_RECAPTCHA_VERSION */
    ]: "missing-recaptcha-version",
    [
      "INVALID_RECAPTCHA_VERSION"
      /* ServerError.INVALID_RECAPTCHA_VERSION */
    ]: "invalid-recaptcha-version",
    [
      "INVALID_REQ_TYPE"
      /* ServerError.INVALID_REQ_TYPE */
    ]: "invalid-req-type"
    /* AuthErrorCode.INVALID_REQ_TYPE */
  };
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const DEFAULT_API_TIMEOUT_MS = new Delay(3e4, 6e4);
  function _addTidIfNecessary(auth2, request) {
    if (auth2.tenantId && !request.tenantId) {
      return Object.assign(Object.assign({}, request), { tenantId: auth2.tenantId });
    }
    return request;
  }
  async function _performApiRequest(auth2, method, path, request, customErrorMap = {}) {
    return _performFetchWithErrorHandling(auth2, customErrorMap, async () => {
      let body = {};
      let params = {};
      if (request) {
        if (method === "GET") {
          params = request;
        } else {
          body = {
            body: JSON.stringify(request)
          };
        }
      }
      const query = querystring(Object.assign({ key: auth2.config.apiKey }, params)).slice(1);
      const headers = await auth2._getAdditionalHeaders();
      headers[
        "Content-Type"
        /* HttpHeader.CONTENT_TYPE */
      ] = "application/json";
      if (auth2.languageCode) {
        headers[
          "X-Firebase-Locale"
          /* HttpHeader.X_FIREBASE_LOCALE */
        ] = auth2.languageCode;
      }
      return FetchProvider.fetch()(_getFinalTarget(auth2, auth2.config.apiHost, path, query), Object.assign({
        method,
        headers,
        referrerPolicy: "no-referrer"
      }, body));
    });
  }
  async function _performFetchWithErrorHandling(auth2, customErrorMap, fetchFn) {
    auth2._canInitEmulator = false;
    const errorMap = Object.assign(Object.assign({}, SERVER_ERROR_MAP), customErrorMap);
    try {
      const networkTimeout = new NetworkTimeout(auth2);
      const response = await Promise.race([
        fetchFn(),
        networkTimeout.promise
      ]);
      networkTimeout.clearNetworkTimeout();
      const json = await response.json();
      if ("needConfirmation" in json) {
        throw _makeTaggedError(auth2, "account-exists-with-different-credential", json);
      }
      if (response.ok && !("errorMessage" in json)) {
        return json;
      } else {
        const errorMessage = response.ok ? json.errorMessage : json.error.message;
        const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
        if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED") {
          throw _makeTaggedError(auth2, "credential-already-in-use", json);
        } else if (serverErrorCode === "EMAIL_EXISTS") {
          throw _makeTaggedError(auth2, "email-already-in-use", json);
        } else if (serverErrorCode === "USER_DISABLED") {
          throw _makeTaggedError(auth2, "user-disabled", json);
        }
        const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
        if (serverErrorMessage) {
          throw _errorWithCustomMessage(auth2, authError, serverErrorMessage);
        } else {
          _fail(auth2, authError);
        }
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        throw e;
      }
      _fail(auth2, "network-request-failed", { "message": String(e) });
    }
  }
  async function _performSignInRequest(auth2, method, path, request, customErrorMap = {}) {
    const serverResponse = await _performApiRequest(auth2, method, path, request, customErrorMap);
    if ("mfaPendingCredential" in serverResponse) {
      _fail(auth2, "multi-factor-auth-required", {
        _serverResponse: serverResponse
      });
    }
    return serverResponse;
  }
  function _getFinalTarget(auth2, host, path, query) {
    const base = `${host}${path}?${query}`;
    if (!auth2.config.emulator) {
      return `${auth2.config.apiScheme}://${base}`;
    }
    return _emulatorUrl(auth2.config, base);
  }
  function _parseEnforcementState(enforcementStateStr) {
    switch (enforcementStateStr) {
      case "ENFORCE":
        return "ENFORCE";
      case "AUDIT":
        return "AUDIT";
      case "OFF":
        return "OFF";
      default:
        return "ENFORCEMENT_STATE_UNSPECIFIED";
    }
  }
  class NetworkTimeout {
    constructor(auth2) {
      this.auth = auth2;
      this.timer = null;
      this.promise = new Promise((_2, reject) => {
        this.timer = setTimeout(() => {
          return reject(_createError(
            this.auth,
            "network-request-failed"
            /* AuthErrorCode.NETWORK_REQUEST_FAILED */
          ));
        }, DEFAULT_API_TIMEOUT_MS.get());
      });
    }
    clearNetworkTimeout() {
      clearTimeout(this.timer);
    }
  }
  function _makeTaggedError(auth2, code, response) {
    const errorParams = {
      appName: auth2.name
    };
    if (response.email) {
      errorParams.email = response.email;
    }
    if (response.phoneNumber) {
      errorParams.phoneNumber = response.phoneNumber;
    }
    const error = _createError(auth2, code, errorParams);
    error.customData._tokenResponse = response;
    return error;
  }
  function isEnterprise(grecaptcha) {
    return grecaptcha !== void 0 && grecaptcha.enterprise !== void 0;
  }
  class RecaptchaConfig {
    constructor(response) {
      this.siteKey = "";
      this.recaptchaEnforcementState = [];
      if (response.recaptchaKey === void 0) {
        throw new Error("recaptchaKey undefined");
      }
      this.siteKey = response.recaptchaKey.split("/")[3];
      this.recaptchaEnforcementState = response.recaptchaEnforcementState;
    }
    /**
     * Returns the reCAPTCHA Enterprise enforcement state for the given provider.
     *
     * @param providerStr - The provider whose enforcement state is to be returned.
     * @returns The reCAPTCHA Enterprise enforcement state for the given provider.
     */
    getProviderEnforcementState(providerStr) {
      if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) {
        return null;
      }
      for (const recaptchaEnforcementState of this.recaptchaEnforcementState) {
        if (recaptchaEnforcementState.provider && recaptchaEnforcementState.provider === providerStr) {
          return _parseEnforcementState(recaptchaEnforcementState.enforcementState);
        }
      }
      return null;
    }
    /**
     * Returns true if the reCAPTCHA Enterprise enforcement state for the provider is set to ENFORCE or AUDIT.
     *
     * @param providerStr - The provider whose enablement state is to be returned.
     * @returns Whether or not reCAPTCHA Enterprise protection is enabled for the given provider.
     */
    isProviderEnabled(providerStr) {
      return this.getProviderEnforcementState(providerStr) === "ENFORCE" || this.getProviderEnforcementState(providerStr) === "AUDIT";
    }
  }
  async function getRecaptchaConfig(auth2, request) {
    return _performApiRequest(auth2, "GET", "/v2/recaptchaConfig", _addTidIfNecessary(auth2, request));
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function deleteAccount(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:delete", request);
  }
  async function getAccountInfo(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:lookup", request);
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function utcTimestampToDateString(utcTimestamp) {
    if (!utcTimestamp) {
      return void 0;
    }
    try {
      const date = new Date(Number(utcTimestamp));
      if (!isNaN(date.getTime())) {
        return date.toUTCString();
      }
    } catch (e) {
    }
    return void 0;
  }
  async function getIdTokenResult(user, forceRefresh = false) {
    const userInternal = getModularInstance(user);
    const token = await userInternal.getIdToken(forceRefresh);
    const claims = _parseToken(token);
    _assert(
      claims && claims.exp && claims.auth_time && claims.iat,
      userInternal.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const firebase = typeof claims.firebase === "object" ? claims.firebase : void 0;
    const signInProvider = firebase === null || firebase === void 0 ? void 0 : firebase["sign_in_provider"];
    return {
      claims,
      token,
      authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
      issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
      expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
      signInProvider: signInProvider || null,
      signInSecondFactor: (firebase === null || firebase === void 0 ? void 0 : firebase["sign_in_second_factor"]) || null
    };
  }
  function secondsStringToMilliseconds(seconds) {
    return Number(seconds) * 1e3;
  }
  function _parseToken(token) {
    const [algorithm, payload, signature] = token.split(".");
    if (algorithm === void 0 || payload === void 0 || signature === void 0) {
      _logError("JWT malformed, contained fewer than 3 sections");
      return null;
    }
    try {
      const decoded = base64Decode(payload);
      if (!decoded) {
        _logError("Failed to decode base64 JWT payload");
        return null;
      }
      return JSON.parse(decoded);
    } catch (e) {
      _logError("Caught error parsing JWT payload as JSON", e === null || e === void 0 ? void 0 : e.toString());
      return null;
    }
  }
  function _tokenExpiresIn(token) {
    const parsedToken = _parseToken(token);
    _assert(
      parsedToken,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof parsedToken.exp !== "undefined",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof parsedToken.iat !== "undefined",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return Number(parsedToken.exp) - Number(parsedToken.iat);
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
    if (bypassAuthState) {
      return promise;
    }
    try {
      return await promise;
    } catch (e) {
      if (e instanceof FirebaseError && isUserInvalidated(e)) {
        if (user.auth.currentUser === user) {
          await user.auth.signOut();
        }
      }
      throw e;
    }
  }
  function isUserInvalidated({ code }) {
    return code === `auth/${"user-disabled"}` || code === `auth/${"user-token-expired"}`;
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class ProactiveRefresh {
    constructor(user) {
      this.user = user;
      this.isRunning = false;
      this.timerId = null;
      this.errorBackoff = 3e4;
    }
    _start() {
      if (this.isRunning) {
        return;
      }
      this.isRunning = true;
      this.schedule();
    }
    _stop() {
      if (!this.isRunning) {
        return;
      }
      this.isRunning = false;
      if (this.timerId !== null) {
        clearTimeout(this.timerId);
      }
    }
    getInterval(wasError) {
      var _a;
      if (wasError) {
        const interval = this.errorBackoff;
        this.errorBackoff = Math.min(
          this.errorBackoff * 2,
          96e4
          /* Duration.RETRY_BACKOFF_MAX */
        );
        return interval;
      } else {
        this.errorBackoff = 3e4;
        const expTime = (_a = this.user.stsTokenManager.expirationTime) !== null && _a !== void 0 ? _a : 0;
        const interval = expTime - Date.now() - 3e5;
        return Math.max(0, interval);
      }
    }
    schedule(wasError = false) {
      if (!this.isRunning) {
        return;
      }
      const interval = this.getInterval(wasError);
      this.timerId = setTimeout(async () => {
        await this.iteration();
      }, interval);
    }
    async iteration() {
      try {
        await this.user.getIdToken(true);
      } catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.code) === `auth/${"network-request-failed"}`) {
          this.schedule(
            /* wasError */
            true
          );
        }
        return;
      }
      this.schedule();
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class UserMetadata {
    constructor(createdAt, lastLoginAt) {
      this.createdAt = createdAt;
      this.lastLoginAt = lastLoginAt;
      this._initializeTime();
    }
    _initializeTime() {
      this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
      this.creationTime = utcTimestampToDateString(this.createdAt);
    }
    _copy(metadata) {
      this.createdAt = metadata.createdAt;
      this.lastLoginAt = metadata.lastLoginAt;
      this._initializeTime();
    }
    toJSON() {
      return {
        createdAt: this.createdAt,
        lastLoginAt: this.lastLoginAt
      };
    }
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function _reloadWithoutSaving(user) {
    var _a;
    const auth2 = user.auth;
    const idToken = await user.getIdToken();
    const response = await _logoutIfInvalidated(user, getAccountInfo(auth2, { idToken }));
    _assert(
      response === null || response === void 0 ? void 0 : response.users.length,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const coreAccount = response.users[0];
    user._notifyReloadListener(coreAccount);
    const newProviderData = ((_a = coreAccount.providerUserInfo) === null || _a === void 0 ? void 0 : _a.length) ? extractProviderData(coreAccount.providerUserInfo) : [];
    const providerData = mergeProviderData(user.providerData, newProviderData);
    const oldIsAnonymous = user.isAnonymous;
    const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length);
    const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
    const updates = {
      uid: coreAccount.localId,
      displayName: coreAccount.displayName || null,
      photoURL: coreAccount.photoUrl || null,
      email: coreAccount.email || null,
      emailVerified: coreAccount.emailVerified || false,
      phoneNumber: coreAccount.phoneNumber || null,
      tenantId: coreAccount.tenantId || null,
      providerData,
      metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
      isAnonymous
    };
    Object.assign(user, updates);
  }
  async function reload(user) {
    const userInternal = getModularInstance(user);
    await _reloadWithoutSaving(userInternal);
    await userInternal.auth._persistUserIfCurrent(userInternal);
    userInternal.auth._notifyListenersIfCurrent(userInternal);
  }
  function mergeProviderData(original, newData) {
    const deduped = original.filter((o) => !newData.some((n2) => n2.providerId === o.providerId));
    return [...deduped, ...newData];
  }
  function extractProviderData(providers) {
    return providers.map((_a) => {
      var { providerId } = _a, provider = __rest(_a, ["providerId"]);
      return {
        providerId,
        uid: provider.rawId || "",
        displayName: provider.displayName || null,
        email: provider.email || null,
        phoneNumber: provider.phoneNumber || null,
        photoURL: provider.photoUrl || null
      };
    });
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function requestStsToken(auth2, refreshToken) {
    const response = await _performFetchWithErrorHandling(auth2, {}, async () => {
      const body = querystring({
        "grant_type": "refresh_token",
        "refresh_token": refreshToken
      }).slice(1);
      const { tokenApiHost, apiKey } = auth2.config;
      const url = _getFinalTarget(auth2, tokenApiHost, "/v1/token", `key=${apiKey}`);
      const headers = await auth2._getAdditionalHeaders();
      headers[
        "Content-Type"
        /* HttpHeader.CONTENT_TYPE */
      ] = "application/x-www-form-urlencoded";
      return FetchProvider.fetch()(url, {
        method: "POST",
        headers,
        body
      });
    });
    return {
      accessToken: response.access_token,
      expiresIn: response.expires_in,
      refreshToken: response.refresh_token
    };
  }
  async function revokeToken(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v2/accounts:revokeToken", _addTidIfNecessary(auth2, request));
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class StsTokenManager {
    constructor() {
      this.refreshToken = null;
      this.accessToken = null;
      this.expirationTime = null;
    }
    get isExpired() {
      return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
    }
    updateFromServerResponse(response) {
      _assert(
        response.idToken,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      _assert(
        typeof response.idToken !== "undefined",
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      _assert(
        typeof response.refreshToken !== "undefined",
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const expiresIn = "expiresIn" in response && typeof response.expiresIn !== "undefined" ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
      this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
    }
    updateFromIdToken(idToken) {
      _assert(
        idToken.length !== 0,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const expiresIn = _tokenExpiresIn(idToken);
      this.updateTokensAndExpiration(idToken, null, expiresIn);
    }
    async getToken(auth2, forceRefresh = false) {
      if (!forceRefresh && this.accessToken && !this.isExpired) {
        return this.accessToken;
      }
      _assert(
        this.refreshToken,
        auth2,
        "user-token-expired"
        /* AuthErrorCode.TOKEN_EXPIRED */
      );
      if (this.refreshToken) {
        await this.refresh(auth2, this.refreshToken);
        return this.accessToken;
      }
      return null;
    }
    clearRefreshToken() {
      this.refreshToken = null;
    }
    async refresh(auth2, oldToken) {
      const { accessToken, refreshToken, expiresIn } = await requestStsToken(auth2, oldToken);
      this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
    }
    updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
      this.refreshToken = refreshToken || null;
      this.accessToken = accessToken || null;
      this.expirationTime = Date.now() + expiresInSec * 1e3;
    }
    static fromJSON(appName, object) {
      const { refreshToken, accessToken, expirationTime } = object;
      const manager = new StsTokenManager();
      if (refreshToken) {
        _assert(typeof refreshToken === "string", "internal-error", {
          appName
        });
        manager.refreshToken = refreshToken;
      }
      if (accessToken) {
        _assert(typeof accessToken === "string", "internal-error", {
          appName
        });
        manager.accessToken = accessToken;
      }
      if (expirationTime) {
        _assert(typeof expirationTime === "number", "internal-error", {
          appName
        });
        manager.expirationTime = expirationTime;
      }
      return manager;
    }
    toJSON() {
      return {
        refreshToken: this.refreshToken,
        accessToken: this.accessToken,
        expirationTime: this.expirationTime
      };
    }
    _assign(stsTokenManager) {
      this.accessToken = stsTokenManager.accessToken;
      this.refreshToken = stsTokenManager.refreshToken;
      this.expirationTime = stsTokenManager.expirationTime;
    }
    _clone() {
      return Object.assign(new StsTokenManager(), this.toJSON());
    }
    _performRefresh() {
      return debugFail("not implemented");
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function assertStringOrUndefined(assertion, appName) {
    _assert(typeof assertion === "string" || typeof assertion === "undefined", "internal-error", { appName });
  }
  class UserImpl {
    constructor(_a) {
      var { uid, auth: auth2, stsTokenManager } = _a, opt = __rest(_a, ["uid", "auth", "stsTokenManager"]);
      this.providerId = "firebase";
      this.proactiveRefresh = new ProactiveRefresh(this);
      this.reloadUserInfo = null;
      this.reloadListener = null;
      this.uid = uid;
      this.auth = auth2;
      this.stsTokenManager = stsTokenManager;
      this.accessToken = stsTokenManager.accessToken;
      this.displayName = opt.displayName || null;
      this.email = opt.email || null;
      this.emailVerified = opt.emailVerified || false;
      this.phoneNumber = opt.phoneNumber || null;
      this.photoURL = opt.photoURL || null;
      this.isAnonymous = opt.isAnonymous || false;
      this.tenantId = opt.tenantId || null;
      this.providerData = opt.providerData ? [...opt.providerData] : [];
      this.metadata = new UserMetadata(opt.createdAt || void 0, opt.lastLoginAt || void 0);
    }
    async getIdToken(forceRefresh) {
      const accessToken = await _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
      _assert(
        accessToken,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      if (this.accessToken !== accessToken) {
        this.accessToken = accessToken;
        await this.auth._persistUserIfCurrent(this);
        this.auth._notifyListenersIfCurrent(this);
      }
      return accessToken;
    }
    getIdTokenResult(forceRefresh) {
      return getIdTokenResult(this, forceRefresh);
    }
    reload() {
      return reload(this);
    }
    _assign(user) {
      if (this === user) {
        return;
      }
      _assert(
        this.uid === user.uid,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      this.displayName = user.displayName;
      this.photoURL = user.photoURL;
      this.email = user.email;
      this.emailVerified = user.emailVerified;
      this.phoneNumber = user.phoneNumber;
      this.isAnonymous = user.isAnonymous;
      this.tenantId = user.tenantId;
      this.providerData = user.providerData.map((userInfo) => Object.assign({}, userInfo));
      this.metadata._copy(user.metadata);
      this.stsTokenManager._assign(user.stsTokenManager);
    }
    _clone(auth2) {
      const newUser = new UserImpl(Object.assign(Object.assign({}, this), { auth: auth2, stsTokenManager: this.stsTokenManager._clone() }));
      newUser.metadata._copy(this.metadata);
      return newUser;
    }
    _onReload(callback) {
      _assert(
        !this.reloadListener,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      this.reloadListener = callback;
      if (this.reloadUserInfo) {
        this._notifyReloadListener(this.reloadUserInfo);
        this.reloadUserInfo = null;
      }
    }
    _notifyReloadListener(userInfo) {
      if (this.reloadListener) {
        this.reloadListener(userInfo);
      } else {
        this.reloadUserInfo = userInfo;
      }
    }
    _startProactiveRefresh() {
      this.proactiveRefresh._start();
    }
    _stopProactiveRefresh() {
      this.proactiveRefresh._stop();
    }
    async _updateTokensIfNecessary(response, reload2 = false) {
      let tokensRefreshed = false;
      if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
        this.stsTokenManager.updateFromServerResponse(response);
        tokensRefreshed = true;
      }
      if (reload2) {
        await _reloadWithoutSaving(this);
      }
      await this.auth._persistUserIfCurrent(this);
      if (tokensRefreshed) {
        this.auth._notifyListenersIfCurrent(this);
      }
    }
    async delete() {
      if (_isFirebaseServerApp(this.auth.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this.auth));
      }
      const idToken = await this.getIdToken();
      await _logoutIfInvalidated(this, deleteAccount(this.auth, { idToken }));
      this.stsTokenManager.clearRefreshToken();
      return this.auth.signOut();
    }
    toJSON() {
      return Object.assign(Object.assign({
        uid: this.uid,
        email: this.email || void 0,
        emailVerified: this.emailVerified,
        displayName: this.displayName || void 0,
        isAnonymous: this.isAnonymous,
        photoURL: this.photoURL || void 0,
        phoneNumber: this.phoneNumber || void 0,
        tenantId: this.tenantId || void 0,
        providerData: this.providerData.map((userInfo) => Object.assign({}, userInfo)),
        stsTokenManager: this.stsTokenManager.toJSON(),
        // Redirect event ID must be maintained in case there is a pending
        // redirect event.
        _redirectEventId: this._redirectEventId
      }, this.metadata.toJSON()), {
        // Required for compatibility with the legacy SDK (go/firebase-auth-sdk-persistence-parsing):
        apiKey: this.auth.config.apiKey,
        appName: this.auth.name
      });
    }
    get refreshToken() {
      return this.stsTokenManager.refreshToken || "";
    }
    static _fromJSON(auth2, object) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const displayName = (_a = object.displayName) !== null && _a !== void 0 ? _a : void 0;
      const email = (_b = object.email) !== null && _b !== void 0 ? _b : void 0;
      const phoneNumber = (_c = object.phoneNumber) !== null && _c !== void 0 ? _c : void 0;
      const photoURL = (_d = object.photoURL) !== null && _d !== void 0 ? _d : void 0;
      const tenantId = (_e = object.tenantId) !== null && _e !== void 0 ? _e : void 0;
      const _redirectEventId = (_f = object._redirectEventId) !== null && _f !== void 0 ? _f : void 0;
      const createdAt = (_g = object.createdAt) !== null && _g !== void 0 ? _g : void 0;
      const lastLoginAt = (_h = object.lastLoginAt) !== null && _h !== void 0 ? _h : void 0;
      const { uid, emailVerified, isAnonymous, providerData, stsTokenManager: plainObjectTokenManager } = object;
      _assert(
        uid && plainObjectTokenManager,
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
      _assert(
        typeof uid === "string",
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      assertStringOrUndefined(displayName, auth2.name);
      assertStringOrUndefined(email, auth2.name);
      _assert(
        typeof emailVerified === "boolean",
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      _assert(
        typeof isAnonymous === "boolean",
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      assertStringOrUndefined(phoneNumber, auth2.name);
      assertStringOrUndefined(photoURL, auth2.name);
      assertStringOrUndefined(tenantId, auth2.name);
      assertStringOrUndefined(_redirectEventId, auth2.name);
      assertStringOrUndefined(createdAt, auth2.name);
      assertStringOrUndefined(lastLoginAt, auth2.name);
      const user = new UserImpl({
        uid,
        auth: auth2,
        email,
        emailVerified,
        displayName,
        isAnonymous,
        photoURL,
        phoneNumber,
        tenantId,
        stsTokenManager,
        createdAt,
        lastLoginAt
      });
      if (providerData && Array.isArray(providerData)) {
        user.providerData = providerData.map((userInfo) => Object.assign({}, userInfo));
      }
      if (_redirectEventId) {
        user._redirectEventId = _redirectEventId;
      }
      return user;
    }
    /**
     * Initialize a User from an idToken server response
     * @param auth
     * @param idTokenResponse
     */
    static async _fromIdTokenResponse(auth2, idTokenResponse, isAnonymous = false) {
      const stsTokenManager = new StsTokenManager();
      stsTokenManager.updateFromServerResponse(idTokenResponse);
      const user = new UserImpl({
        uid: idTokenResponse.localId,
        auth: auth2,
        stsTokenManager,
        isAnonymous
      });
      await _reloadWithoutSaving(user);
      return user;
    }
    /**
     * Initialize a User from an idToken server response
     * @param auth
     * @param idTokenResponse
     */
    static async _fromGetAccountInfoResponse(auth2, response, idToken) {
      const coreAccount = response.users[0];
      _assert(
        coreAccount.localId !== void 0,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const providerData = coreAccount.providerUserInfo !== void 0 ? extractProviderData(coreAccount.providerUserInfo) : [];
      const isAnonymous = !(coreAccount.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length);
      const stsTokenManager = new StsTokenManager();
      stsTokenManager.updateFromIdToken(idToken);
      const user = new UserImpl({
        uid: coreAccount.localId,
        auth: auth2,
        stsTokenManager,
        isAnonymous
      });
      const updates = {
        uid: coreAccount.localId,
        displayName: coreAccount.displayName || null,
        photoURL: coreAccount.photoUrl || null,
        email: coreAccount.email || null,
        emailVerified: coreAccount.emailVerified || false,
        phoneNumber: coreAccount.phoneNumber || null,
        tenantId: coreAccount.tenantId || null,
        providerData,
        metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
        isAnonymous: !(coreAccount.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length)
      };
      Object.assign(user, updates);
      return user;
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const instanceCache = /* @__PURE__ */ new Map();
  function _getInstance(cls) {
    debugAssert(cls instanceof Function, "Expected a class definition");
    let instance = instanceCache.get(cls);
    if (instance) {
      debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
      return instance;
    }
    instance = new cls();
    instanceCache.set(cls, instance);
    return instance;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class InMemoryPersistence {
    constructor() {
      this.type = "NONE";
      this.storage = {};
    }
    async _isAvailable() {
      return true;
    }
    async _set(key, value) {
      this.storage[key] = value;
    }
    async _get(key) {
      const value = this.storage[key];
      return value === void 0 ? null : value;
    }
    async _remove(key) {
      delete this.storage[key];
    }
    _addListener(_key, _listener) {
      return;
    }
    _removeListener(_key, _listener) {
      return;
    }
  }
  InMemoryPersistence.type = "NONE";
  const inMemoryPersistence = InMemoryPersistence;
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _persistenceKeyName(key, apiKey, appName) {
    return `${"firebase"}:${key}:${apiKey}:${appName}`;
  }
  class PersistenceUserManager {
    constructor(persistence, auth2, userKey) {
      this.persistence = persistence;
      this.auth = auth2;
      this.userKey = userKey;
      const { config, name: name2 } = this.auth;
      this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name2);
      this.fullPersistenceKey = _persistenceKeyName("persistence", config.apiKey, name2);
      this.boundEventHandler = auth2._onStorageEvent.bind(auth2);
      this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
    }
    setCurrentUser(user) {
      return this.persistence._set(this.fullUserKey, user.toJSON());
    }
    async getCurrentUser() {
      const blob = await this.persistence._get(this.fullUserKey);
      return blob ? UserImpl._fromJSON(this.auth, blob) : null;
    }
    removeCurrentUser() {
      return this.persistence._remove(this.fullUserKey);
    }
    savePersistenceForRedirect() {
      return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
    }
    async setPersistence(newPersistence) {
      if (this.persistence === newPersistence) {
        return;
      }
      const currentUser = await this.getCurrentUser();
      await this.removeCurrentUser();
      this.persistence = newPersistence;
      if (currentUser) {
        return this.setCurrentUser(currentUser);
      }
    }
    delete() {
      this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
    }
    static async create(auth2, persistenceHierarchy, userKey = "authUser") {
      if (!persistenceHierarchy.length) {
        return new PersistenceUserManager(_getInstance(inMemoryPersistence), auth2, userKey);
      }
      const availablePersistences = (await Promise.all(persistenceHierarchy.map(async (persistence) => {
        if (await persistence._isAvailable()) {
          return persistence;
        }
        return void 0;
      }))).filter((persistence) => persistence);
      let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
      const key = _persistenceKeyName(userKey, auth2.config.apiKey, auth2.name);
      let userToMigrate = null;
      for (const persistence of persistenceHierarchy) {
        try {
          const blob = await persistence._get(key);
          if (blob) {
            const user = UserImpl._fromJSON(auth2, blob);
            if (persistence !== selectedPersistence) {
              userToMigrate = user;
            }
            selectedPersistence = persistence;
            break;
          }
        } catch (_a) {
        }
      }
      const migrationHierarchy = availablePersistences.filter((p2) => p2._shouldAllowMigration);
      if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) {
        return new PersistenceUserManager(selectedPersistence, auth2, userKey);
      }
      selectedPersistence = migrationHierarchy[0];
      if (userToMigrate) {
        await selectedPersistence._set(key, userToMigrate.toJSON());
      }
      await Promise.all(persistenceHierarchy.map(async (persistence) => {
        if (persistence !== selectedPersistence) {
          try {
            await persistence._remove(key);
          } catch (_a) {
          }
        }
      }));
      return new PersistenceUserManager(selectedPersistence, auth2, userKey);
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _getBrowserName(userAgent) {
    const ua2 = userAgent.toLowerCase();
    if (ua2.includes("opera/") || ua2.includes("opr/") || ua2.includes("opios/")) {
      return "Opera";
    } else if (_isIEMobile(ua2)) {
      return "IEMobile";
    } else if (ua2.includes("msie") || ua2.includes("trident/")) {
      return "IE";
    } else if (ua2.includes("edge/")) {
      return "Edge";
    } else if (_isFirefox(ua2)) {
      return "Firefox";
    } else if (ua2.includes("silk/")) {
      return "Silk";
    } else if (_isBlackBerry(ua2)) {
      return "Blackberry";
    } else if (_isWebOS(ua2)) {
      return "Webos";
    } else if (_isSafari(ua2)) {
      return "Safari";
    } else if ((ua2.includes("chrome/") || _isChromeIOS(ua2)) && !ua2.includes("edge/")) {
      return "Chrome";
    } else if (_isAndroid(ua2)) {
      return "Android";
    } else {
      const re2 = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
      const matches = userAgent.match(re2);
      if ((matches === null || matches === void 0 ? void 0 : matches.length) === 2) {
        return matches[1];
      }
    }
    return "Other";
  }
  function _isFirefox(ua2 = getUA()) {
    return /firefox\//i.test(ua2);
  }
  function _isSafari(userAgent = getUA()) {
    const ua2 = userAgent.toLowerCase();
    return ua2.includes("safari/") && !ua2.includes("chrome/") && !ua2.includes("crios/") && !ua2.includes("android");
  }
  function _isChromeIOS(ua2 = getUA()) {
    return /crios\//i.test(ua2);
  }
  function _isIEMobile(ua2 = getUA()) {
    return /iemobile/i.test(ua2);
  }
  function _isAndroid(ua2 = getUA()) {
    return /android/i.test(ua2);
  }
  function _isBlackBerry(ua2 = getUA()) {
    return /blackberry/i.test(ua2);
  }
  function _isWebOS(ua2 = getUA()) {
    return /webos/i.test(ua2);
  }
  function _isIOS(ua2 = getUA()) {
    return /iphone|ipad|ipod/i.test(ua2) || /macintosh/i.test(ua2) && /mobile/i.test(ua2);
  }
  function _isIOSStandalone(ua2 = getUA()) {
    var _a;
    return _isIOS(ua2) && !!((_a = window.navigator) === null || _a === void 0 ? void 0 : _a.standalone);
  }
  function _isIE10() {
    return isIE() && document.documentMode === 10;
  }
  function _isMobileBrowser(ua2 = getUA()) {
    return _isIOS(ua2) || _isAndroid(ua2) || _isWebOS(ua2) || _isBlackBerry(ua2) || /windows phone/i.test(ua2) || _isIEMobile(ua2);
  }
  function _isIframe() {
    try {
      return !!(window && window !== window.top);
    } catch (e) {
      return false;
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _getClientVersion(clientPlatform, frameworks = []) {
    let reportedPlatform;
    switch (clientPlatform) {
      case "Browser":
        reportedPlatform = _getBrowserName(getUA());
        break;
      case "Worker":
        reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
        break;
      default:
        reportedPlatform = clientPlatform;
    }
    const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
    return `${reportedPlatform}/${"JsCore"}/${SDK_VERSION}/${reportedFrameworks}`;
  }
  /**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class AuthMiddlewareQueue {
    constructor(auth2) {
      this.auth = auth2;
      this.queue = [];
    }
    pushCallback(callback, onAbort) {
      const wrappedCallback = (user) => new Promise((resolve, reject) => {
        try {
          const result = callback(user);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
      wrappedCallback.onAbort = onAbort;
      this.queue.push(wrappedCallback);
      const index = this.queue.length - 1;
      return () => {
        this.queue[index] = () => Promise.resolve();
      };
    }
    async runMiddleware(nextUser) {
      if (this.auth.currentUser === nextUser) {
        return;
      }
      const onAbortStack = [];
      try {
        for (const beforeStateCallback of this.queue) {
          await beforeStateCallback(nextUser);
          if (beforeStateCallback.onAbort) {
            onAbortStack.push(beforeStateCallback.onAbort);
          }
        }
      } catch (e) {
        onAbortStack.reverse();
        for (const onAbort of onAbortStack) {
          try {
            onAbort();
          } catch (_2) {
          }
        }
        throw this.auth._errorFactory.create("login-blocked", {
          originalMessage: e === null || e === void 0 ? void 0 : e.message
        });
      }
    }
  }
  /**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function _getPasswordPolicy(auth2, request = {}) {
    return _performApiRequest(auth2, "GET", "/v2/passwordPolicy", _addTidIfNecessary(auth2, request));
  }
  /**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const MINIMUM_MIN_PASSWORD_LENGTH = 6;
  class PasswordPolicyImpl {
    constructor(response) {
      var _a, _b, _c, _d;
      const responseOptions = response.customStrengthOptions;
      this.customStrengthOptions = {};
      this.customStrengthOptions.minPasswordLength = (_a = responseOptions.minPasswordLength) !== null && _a !== void 0 ? _a : MINIMUM_MIN_PASSWORD_LENGTH;
      if (responseOptions.maxPasswordLength) {
        this.customStrengthOptions.maxPasswordLength = responseOptions.maxPasswordLength;
      }
      if (responseOptions.containsLowercaseCharacter !== void 0) {
        this.customStrengthOptions.containsLowercaseLetter = responseOptions.containsLowercaseCharacter;
      }
      if (responseOptions.containsUppercaseCharacter !== void 0) {
        this.customStrengthOptions.containsUppercaseLetter = responseOptions.containsUppercaseCharacter;
      }
      if (responseOptions.containsNumericCharacter !== void 0) {
        this.customStrengthOptions.containsNumericCharacter = responseOptions.containsNumericCharacter;
      }
      if (responseOptions.containsNonAlphanumericCharacter !== void 0) {
        this.customStrengthOptions.containsNonAlphanumericCharacter = responseOptions.containsNonAlphanumericCharacter;
      }
      this.enforcementState = response.enforcementState;
      if (this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED") {
        this.enforcementState = "OFF";
      }
      this.allowedNonAlphanumericCharacters = (_c = (_b = response.allowedNonAlphanumericCharacters) === null || _b === void 0 ? void 0 : _b.join("")) !== null && _c !== void 0 ? _c : "";
      this.forceUpgradeOnSignin = (_d = response.forceUpgradeOnSignin) !== null && _d !== void 0 ? _d : false;
      this.schemaVersion = response.schemaVersion;
    }
    validatePassword(password) {
      var _a, _b, _c, _d, _e, _f;
      const status = {
        isValid: true,
        passwordPolicy: this
      };
      this.validatePasswordLengthOptions(password, status);
      this.validatePasswordCharacterOptions(password, status);
      status.isValid && (status.isValid = (_a = status.meetsMinPasswordLength) !== null && _a !== void 0 ? _a : true);
      status.isValid && (status.isValid = (_b = status.meetsMaxPasswordLength) !== null && _b !== void 0 ? _b : true);
      status.isValid && (status.isValid = (_c = status.containsLowercaseLetter) !== null && _c !== void 0 ? _c : true);
      status.isValid && (status.isValid = (_d = status.containsUppercaseLetter) !== null && _d !== void 0 ? _d : true);
      status.isValid && (status.isValid = (_e = status.containsNumericCharacter) !== null && _e !== void 0 ? _e : true);
      status.isValid && (status.isValid = (_f = status.containsNonAlphanumericCharacter) !== null && _f !== void 0 ? _f : true);
      return status;
    }
    /**
     * Validates that the password meets the length options for the policy.
     *
     * @param password Password to validate.
     * @param status Validation status.
     */
    validatePasswordLengthOptions(password, status) {
      const minPasswordLength = this.customStrengthOptions.minPasswordLength;
      const maxPasswordLength = this.customStrengthOptions.maxPasswordLength;
      if (minPasswordLength) {
        status.meetsMinPasswordLength = password.length >= minPasswordLength;
      }
      if (maxPasswordLength) {
        status.meetsMaxPasswordLength = password.length <= maxPasswordLength;
      }
    }
    /**
     * Validates that the password meets the character options for the policy.
     *
     * @param password Password to validate.
     * @param status Validation status.
     */
    validatePasswordCharacterOptions(password, status) {
      this.updatePasswordCharacterOptionsStatuses(
        status,
        /* containsLowercaseCharacter= */
        false,
        /* containsUppercaseCharacter= */
        false,
        /* containsNumericCharacter= */
        false,
        /* containsNonAlphanumericCharacter= */
        false
      );
      let passwordChar;
      for (let i = 0; i < password.length; i++) {
        passwordChar = password.charAt(i);
        this.updatePasswordCharacterOptionsStatuses(
          status,
          /* containsLowercaseCharacter= */
          passwordChar >= "a" && passwordChar <= "z",
          /* containsUppercaseCharacter= */
          passwordChar >= "A" && passwordChar <= "Z",
          /* containsNumericCharacter= */
          passwordChar >= "0" && passwordChar <= "9",
          /* containsNonAlphanumericCharacter= */
          this.allowedNonAlphanumericCharacters.includes(passwordChar)
        );
      }
    }
    /**
     * Updates the running validation status with the statuses for the character options.
     * Expected to be called each time a character is processed to update each option status
     * based on the current character.
     *
     * @param status Validation status.
     * @param containsLowercaseCharacter Whether the character is a lowercase letter.
     * @param containsUppercaseCharacter Whether the character is an uppercase letter.
     * @param containsNumericCharacter Whether the character is a numeric character.
     * @param containsNonAlphanumericCharacter Whether the character is a non-alphanumeric character.
     */
    updatePasswordCharacterOptionsStatuses(status, containsLowercaseCharacter, containsUppercaseCharacter, containsNumericCharacter, containsNonAlphanumericCharacter) {
      if (this.customStrengthOptions.containsLowercaseLetter) {
        status.containsLowercaseLetter || (status.containsLowercaseLetter = containsLowercaseCharacter);
      }
      if (this.customStrengthOptions.containsUppercaseLetter) {
        status.containsUppercaseLetter || (status.containsUppercaseLetter = containsUppercaseCharacter);
      }
      if (this.customStrengthOptions.containsNumericCharacter) {
        status.containsNumericCharacter || (status.containsNumericCharacter = containsNumericCharacter);
      }
      if (this.customStrengthOptions.containsNonAlphanumericCharacter) {
        status.containsNonAlphanumericCharacter || (status.containsNonAlphanumericCharacter = containsNonAlphanumericCharacter);
      }
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class AuthImpl {
    constructor(app2, heartbeatServiceProvider, appCheckServiceProvider, config) {
      this.app = app2;
      this.heartbeatServiceProvider = heartbeatServiceProvider;
      this.appCheckServiceProvider = appCheckServiceProvider;
      this.config = config;
      this.currentUser = null;
      this.emulatorConfig = null;
      this.operations = Promise.resolve();
      this.authStateSubscription = new Subscription(this);
      this.idTokenSubscription = new Subscription(this);
      this.beforeStateQueue = new AuthMiddlewareQueue(this);
      this.redirectUser = null;
      this.isProactiveRefreshEnabled = false;
      this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1;
      this._canInitEmulator = true;
      this._isInitialized = false;
      this._deleted = false;
      this._initializationPromise = null;
      this._popupRedirectResolver = null;
      this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
      this._agentRecaptchaConfig = null;
      this._tenantRecaptchaConfigs = {};
      this._projectPasswordPolicy = null;
      this._tenantPasswordPolicies = {};
      this.lastNotifiedUid = void 0;
      this.languageCode = null;
      this.tenantId = null;
      this.settings = { appVerificationDisabledForTesting: false };
      this.frameworks = [];
      this.name = app2.name;
      this.clientVersion = config.sdkClientVersion;
    }
    _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
      if (popupRedirectResolver) {
        this._popupRedirectResolver = _getInstance(popupRedirectResolver);
      }
      this._initializationPromise = this.queue(async () => {
        var _a, _b;
        if (this._deleted) {
          return;
        }
        this.persistenceManager = await PersistenceUserManager.create(this, persistenceHierarchy);
        if (this._deleted) {
          return;
        }
        if ((_a = this._popupRedirectResolver) === null || _a === void 0 ? void 0 : _a._shouldInitProactively) {
          try {
            await this._popupRedirectResolver._initialize(this);
          } catch (e) {
          }
        }
        await this.initializeCurrentUser(popupRedirectResolver);
        this.lastNotifiedUid = ((_b = this.currentUser) === null || _b === void 0 ? void 0 : _b.uid) || null;
        if (this._deleted) {
          return;
        }
        this._isInitialized = true;
      });
      return this._initializationPromise;
    }
    /**
     * If the persistence is changed in another window, the user manager will let us know
     */
    async _onStorageEvent() {
      if (this._deleted) {
        return;
      }
      const user = await this.assertedPersistence.getCurrentUser();
      if (!this.currentUser && !user) {
        return;
      }
      if (this.currentUser && user && this.currentUser.uid === user.uid) {
        this._currentUser._assign(user);
        await this.currentUser.getIdToken();
        return;
      }
      await this._updateCurrentUser(
        user,
        /* skipBeforeStateCallbacks */
        true
      );
    }
    async initializeCurrentUserFromIdToken(idToken) {
      try {
        const response = await getAccountInfo(this, { idToken });
        const user = await UserImpl._fromGetAccountInfoResponse(this, response, idToken);
        await this.directlySetCurrentUser(user);
      } catch (err) {
        console.warn("FirebaseServerApp could not login user with provided authIdToken: ", err);
        await this.directlySetCurrentUser(null);
      }
    }
    async initializeCurrentUser(popupRedirectResolver) {
      var _a;
      if (_isFirebaseServerApp(this.app)) {
        const idToken = this.app.settings.authIdToken;
        if (idToken) {
          return new Promise((resolve) => {
            setTimeout(() => this.initializeCurrentUserFromIdToken(idToken).then(resolve, resolve));
          });
        } else {
          return this.directlySetCurrentUser(null);
        }
      }
      const previouslyStoredUser = await this.assertedPersistence.getCurrentUser();
      let futureCurrentUser = previouslyStoredUser;
      let needsTocheckMiddleware = false;
      if (popupRedirectResolver && this.config.authDomain) {
        await this.getOrInitRedirectPersistenceManager();
        const redirectUserEventId = (_a = this.redirectUser) === null || _a === void 0 ? void 0 : _a._redirectEventId;
        const storedUserEventId = futureCurrentUser === null || futureCurrentUser === void 0 ? void 0 : futureCurrentUser._redirectEventId;
        const result = await this.tryRedirectSignIn(popupRedirectResolver);
        if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && (result === null || result === void 0 ? void 0 : result.user)) {
          futureCurrentUser = result.user;
          needsTocheckMiddleware = true;
        }
      }
      if (!futureCurrentUser) {
        return this.directlySetCurrentUser(null);
      }
      if (!futureCurrentUser._redirectEventId) {
        if (needsTocheckMiddleware) {
          try {
            await this.beforeStateQueue.runMiddleware(futureCurrentUser);
          } catch (e) {
            futureCurrentUser = previouslyStoredUser;
            this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e));
          }
        }
        if (futureCurrentUser) {
          return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
        } else {
          return this.directlySetCurrentUser(null);
        }
      }
      _assert(
        this._popupRedirectResolver,
        this,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      await this.getOrInitRedirectPersistenceManager();
      if (this.redirectUser && this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) {
        return this.directlySetCurrentUser(futureCurrentUser);
      }
      return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
    }
    async tryRedirectSignIn(redirectResolver) {
      let result = null;
      try {
        result = await this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
      } catch (e) {
        await this._setRedirectUser(null);
      }
      return result;
    }
    async reloadAndSetCurrentUserOrClear(user) {
      try {
        await _reloadWithoutSaving(user);
      } catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.code) !== `auth/${"network-request-failed"}`) {
          return this.directlySetCurrentUser(null);
        }
      }
      return this.directlySetCurrentUser(user);
    }
    useDeviceLanguage() {
      this.languageCode = _getUserLanguage();
    }
    async _delete() {
      this._deleted = true;
    }
    async updateCurrentUser(userExtern) {
      if (_isFirebaseServerApp(this.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
      }
      const user = userExtern ? getModularInstance(userExtern) : null;
      if (user) {
        _assert(
          user.auth.config.apiKey === this.config.apiKey,
          this,
          "invalid-user-token"
          /* AuthErrorCode.INVALID_AUTH */
        );
      }
      return this._updateCurrentUser(user && user._clone(this));
    }
    async _updateCurrentUser(user, skipBeforeStateCallbacks = false) {
      if (this._deleted) {
        return;
      }
      if (user) {
        _assert(
          this.tenantId === user.tenantId,
          this,
          "tenant-id-mismatch"
          /* AuthErrorCode.TENANT_ID_MISMATCH */
        );
      }
      if (!skipBeforeStateCallbacks) {
        await this.beforeStateQueue.runMiddleware(user);
      }
      return this.queue(async () => {
        await this.directlySetCurrentUser(user);
        this.notifyAuthListeners();
      });
    }
    async signOut() {
      if (_isFirebaseServerApp(this.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
      }
      await this.beforeStateQueue.runMiddleware(null);
      if (this.redirectPersistenceManager || this._popupRedirectResolver) {
        await this._setRedirectUser(null);
      }
      return this._updateCurrentUser(
        null,
        /* skipBeforeStateCallbacks */
        true
      );
    }
    setPersistence(persistence) {
      if (_isFirebaseServerApp(this.app)) {
        return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));
      }
      return this.queue(async () => {
        await this.assertedPersistence.setPersistence(_getInstance(persistence));
      });
    }
    _getRecaptchaConfig() {
      if (this.tenantId == null) {
        return this._agentRecaptchaConfig;
      } else {
        return this._tenantRecaptchaConfigs[this.tenantId];
      }
    }
    async validatePassword(password) {
      if (!this._getPasswordPolicyInternal()) {
        await this._updatePasswordPolicy();
      }
      const passwordPolicy = this._getPasswordPolicyInternal();
      if (passwordPolicy.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION) {
        return Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {}));
      }
      return passwordPolicy.validatePassword(password);
    }
    _getPasswordPolicyInternal() {
      if (this.tenantId === null) {
        return this._projectPasswordPolicy;
      } else {
        return this._tenantPasswordPolicies[this.tenantId];
      }
    }
    async _updatePasswordPolicy() {
      const response = await _getPasswordPolicy(this);
      const passwordPolicy = new PasswordPolicyImpl(response);
      if (this.tenantId === null) {
        this._projectPasswordPolicy = passwordPolicy;
      } else {
        this._tenantPasswordPolicies[this.tenantId] = passwordPolicy;
      }
    }
    _getPersistence() {
      return this.assertedPersistence.persistence.type;
    }
    _updateErrorMap(errorMap) {
      this._errorFactory = new ErrorFactory("auth", "Firebase", errorMap());
    }
    onAuthStateChanged(nextOrObserver, error, completed) {
      return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
    }
    beforeAuthStateChanged(callback, onAbort) {
      return this.beforeStateQueue.pushCallback(callback, onAbort);
    }
    onIdTokenChanged(nextOrObserver, error, completed) {
      return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
    }
    authStateReady() {
      return new Promise((resolve, reject) => {
        if (this.currentUser) {
          resolve();
        } else {
          const unsubscribe = this.onAuthStateChanged(() => {
            unsubscribe();
            resolve();
          }, reject);
        }
      });
    }
    /**
     * Revokes the given access token. Currently only supports Apple OAuth access tokens.
     */
    async revokeAccessToken(token) {
      if (this.currentUser) {
        const idToken = await this.currentUser.getIdToken();
        const request = {
          providerId: "apple.com",
          tokenType: "ACCESS_TOKEN",
          token,
          idToken
        };
        if (this.tenantId != null) {
          request.tenantId = this.tenantId;
        }
        await revokeToken(this, request);
      }
    }
    toJSON() {
      var _a;
      return {
        apiKey: this.config.apiKey,
        authDomain: this.config.authDomain,
        appName: this.name,
        currentUser: (_a = this._currentUser) === null || _a === void 0 ? void 0 : _a.toJSON()
      };
    }
    async _setRedirectUser(user, popupRedirectResolver) {
      const redirectManager = await this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
      return user === null ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user);
    }
    async getOrInitRedirectPersistenceManager(popupRedirectResolver) {
      if (!this.redirectPersistenceManager) {
        const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
        _assert(
          resolver,
          this,
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
        this.redirectPersistenceManager = await PersistenceUserManager.create(
          this,
          [_getInstance(resolver._redirectPersistence)],
          "redirectUser"
          /* KeyName.REDIRECT_USER */
        );
        this.redirectUser = await this.redirectPersistenceManager.getCurrentUser();
      }
      return this.redirectPersistenceManager;
    }
    async _redirectUserForId(id2) {
      var _a, _b;
      if (this._isInitialized) {
        await this.queue(async () => {
        });
      }
      if (((_a = this._currentUser) === null || _a === void 0 ? void 0 : _a._redirectEventId) === id2) {
        return this._currentUser;
      }
      if (((_b = this.redirectUser) === null || _b === void 0 ? void 0 : _b._redirectEventId) === id2) {
        return this.redirectUser;
      }
      return null;
    }
    async _persistUserIfCurrent(user) {
      if (user === this.currentUser) {
        return this.queue(async () => this.directlySetCurrentUser(user));
      }
    }
    /** Notifies listeners only if the user is current */
    _notifyListenersIfCurrent(user) {
      if (user === this.currentUser) {
        this.notifyAuthListeners();
      }
    }
    _key() {
      return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
    }
    _startProactiveRefresh() {
      this.isProactiveRefreshEnabled = true;
      if (this.currentUser) {
        this._currentUser._startProactiveRefresh();
      }
    }
    _stopProactiveRefresh() {
      this.isProactiveRefreshEnabled = false;
      if (this.currentUser) {
        this._currentUser._stopProactiveRefresh();
      }
    }
    /** Returns the current user cast as the internal type */
    get _currentUser() {
      return this.currentUser;
    }
    notifyAuthListeners() {
      var _a, _b;
      if (!this._isInitialized) {
        return;
      }
      this.idTokenSubscription.next(this.currentUser);
      const currentUid = (_b = (_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : null;
      if (this.lastNotifiedUid !== currentUid) {
        this.lastNotifiedUid = currentUid;
        this.authStateSubscription.next(this.currentUser);
      }
    }
    registerStateListener(subscription, nextOrObserver, error, completed) {
      if (this._deleted) {
        return () => {
        };
      }
      const cb2 = typeof nextOrObserver === "function" ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
      let isUnsubscribed = false;
      const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
      _assert(
        promise,
        this,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      promise.then(() => {
        if (isUnsubscribed) {
          return;
        }
        cb2(this.currentUser);
      });
      if (typeof nextOrObserver === "function") {
        const unsubscribe = subscription.addObserver(nextOrObserver, error, completed);
        return () => {
          isUnsubscribed = true;
          unsubscribe();
        };
      } else {
        const unsubscribe = subscription.addObserver(nextOrObserver);
        return () => {
          isUnsubscribed = true;
          unsubscribe();
        };
      }
    }
    /**
     * Unprotected (from race conditions) method to set the current user. This
     * should only be called from within a queued callback. This is necessary
     * because the queue shouldn't rely on another queued callback.
     */
    async directlySetCurrentUser(user) {
      if (this.currentUser && this.currentUser !== user) {
        this._currentUser._stopProactiveRefresh();
      }
      if (user && this.isProactiveRefreshEnabled) {
        user._startProactiveRefresh();
      }
      this.currentUser = user;
      if (user) {
        await this.assertedPersistence.setCurrentUser(user);
      } else {
        await this.assertedPersistence.removeCurrentUser();
      }
    }
    queue(action) {
      this.operations = this.operations.then(action, action);
      return this.operations;
    }
    get assertedPersistence() {
      _assert(
        this.persistenceManager,
        this,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      return this.persistenceManager;
    }
    _logFramework(framework) {
      if (!framework || this.frameworks.includes(framework)) {
        return;
      }
      this.frameworks.push(framework);
      this.frameworks.sort();
      this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
    }
    _getFrameworks() {
      return this.frameworks;
    }
    async _getAdditionalHeaders() {
      var _a;
      const headers = {
        [
          "X-Client-Version"
          /* HttpHeader.X_CLIENT_VERSION */
        ]: this.clientVersion
      };
      if (this.app.options.appId) {
        headers[
          "X-Firebase-gmpid"
          /* HttpHeader.X_FIREBASE_GMPID */
        ] = this.app.options.appId;
      }
      const heartbeatsHeader = await ((_a = this.heartbeatServiceProvider.getImmediate({
        optional: true
      })) === null || _a === void 0 ? void 0 : _a.getHeartbeatsHeader());
      if (heartbeatsHeader) {
        headers[
          "X-Firebase-Client"
          /* HttpHeader.X_FIREBASE_CLIENT */
        ] = heartbeatsHeader;
      }
      const appCheckToken = await this._getAppCheckToken();
      if (appCheckToken) {
        headers[
          "X-Firebase-AppCheck"
          /* HttpHeader.X_FIREBASE_APP_CHECK */
        ] = appCheckToken;
      }
      return headers;
    }
    async _getAppCheckToken() {
      var _a;
      const appCheckTokenResult = await ((_a = this.appCheckServiceProvider.getImmediate({ optional: true })) === null || _a === void 0 ? void 0 : _a.getToken());
      if (appCheckTokenResult === null || appCheckTokenResult === void 0 ? void 0 : appCheckTokenResult.error) {
        _logWarn(`Error while retrieving App Check token: ${appCheckTokenResult.error}`);
      }
      return appCheckTokenResult === null || appCheckTokenResult === void 0 ? void 0 : appCheckTokenResult.token;
    }
  }
  function _castAuth(auth2) {
    return getModularInstance(auth2);
  }
  class Subscription {
    constructor(auth2) {
      this.auth = auth2;
      this.observer = null;
      this.addObserver = createSubscribe((observer) => this.observer = observer);
    }
    get next() {
      _assert(
        this.observer,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      return this.observer.next.bind(this.observer);
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  let externalJSProvider = {
    async loadJS() {
      throw new Error("Unable to load external scripts");
    },
    recaptchaV2Script: "",
    recaptchaEnterpriseScript: "",
    gapiScript: ""
  };
  function _setExternalJSProvider(p2) {
    externalJSProvider = p2;
  }
  function _loadJS(url) {
    return externalJSProvider.loadJS(url);
  }
  function _recaptchaEnterpriseScriptUrl() {
    return externalJSProvider.recaptchaEnterpriseScript;
  }
  function _gapiScriptUrl() {
    return externalJSProvider.gapiScript;
  }
  function _generateCallbackName(prefix) {
    return `__${prefix}${Math.floor(Math.random() * 1e6)}`;
  }
  const RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = "recaptcha-enterprise";
  const FAKE_TOKEN = "NO_RECAPTCHA";
  class RecaptchaEnterpriseVerifier {
    /**
     *
     * @param authExtern - The corresponding Firebase {@link Auth} instance.
     *
     */
    constructor(authExtern) {
      this.type = RECAPTCHA_ENTERPRISE_VERIFIER_TYPE;
      this.auth = _castAuth(authExtern);
    }
    /**
     * Executes the verification process.
     *
     * @returns A Promise for a token that can be used to assert the validity of a request.
     */
    async verify(action = "verify", forceRefresh = false) {
      async function retrieveSiteKey(auth2) {
        if (!forceRefresh) {
          if (auth2.tenantId == null && auth2._agentRecaptchaConfig != null) {
            return auth2._agentRecaptchaConfig.siteKey;
          }
          if (auth2.tenantId != null && auth2._tenantRecaptchaConfigs[auth2.tenantId] !== void 0) {
            return auth2._tenantRecaptchaConfigs[auth2.tenantId].siteKey;
          }
        }
        return new Promise(async (resolve, reject) => {
          getRecaptchaConfig(auth2, {
            clientType: "CLIENT_TYPE_WEB",
            version: "RECAPTCHA_ENTERPRISE"
            /* RecaptchaVersion.ENTERPRISE */
          }).then((response) => {
            if (response.recaptchaKey === void 0) {
              reject(new Error("recaptcha Enterprise site key undefined"));
            } else {
              const config = new RecaptchaConfig(response);
              if (auth2.tenantId == null) {
                auth2._agentRecaptchaConfig = config;
              } else {
                auth2._tenantRecaptchaConfigs[auth2.tenantId] = config;
              }
              return resolve(config.siteKey);
            }
          }).catch((error) => {
            reject(error);
          });
        });
      }
      function retrieveRecaptchaToken(siteKey, resolve, reject) {
        const grecaptcha = window.grecaptcha;
        if (isEnterprise(grecaptcha)) {
          grecaptcha.enterprise.ready(() => {
            grecaptcha.enterprise.execute(siteKey, { action }).then((token) => {
              resolve(token);
            }).catch(() => {
              resolve(FAKE_TOKEN);
            });
          });
        } else {
          reject(Error("No reCAPTCHA enterprise script loaded."));
        }
      }
      return new Promise((resolve, reject) => {
        retrieveSiteKey(this.auth).then((siteKey) => {
          if (!forceRefresh && isEnterprise(window.grecaptcha)) {
            retrieveRecaptchaToken(siteKey, resolve, reject);
          } else {
            if (typeof window === "undefined") {
              reject(new Error("RecaptchaVerifier is only supported in browser"));
              return;
            }
            let url = _recaptchaEnterpriseScriptUrl();
            if (url.length !== 0) {
              url += siteKey;
            }
            _loadJS(url).then(() => {
              retrieveRecaptchaToken(siteKey, resolve, reject);
            }).catch((error) => {
              reject(error);
            });
          }
        }).catch((error) => {
          reject(error);
        });
      });
    }
  }
  async function injectRecaptchaFields(auth2, request, action, captchaResp = false) {
    const verifier = new RecaptchaEnterpriseVerifier(auth2);
    let captchaResponse;
    try {
      captchaResponse = await verifier.verify(action);
    } catch (error) {
      captchaResponse = await verifier.verify(action, true);
    }
    const newRequest = Object.assign({}, request);
    if (!captchaResp) {
      Object.assign(newRequest, { captchaResponse });
    } else {
      Object.assign(newRequest, { "captchaResp": captchaResponse });
    }
    Object.assign(newRequest, {
      "clientType": "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    });
    Object.assign(newRequest, {
      "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
      /* RecaptchaVersion.ENTERPRISE */
    });
    return newRequest;
  }
  async function handleRecaptchaFlow(authInstance, request, actionName, actionMethod) {
    var _a;
    if ((_a = authInstance._getRecaptchaConfig()) === null || _a === void 0 ? void 0 : _a.isProviderEnabled(
      "EMAIL_PASSWORD_PROVIDER"
      /* RecaptchaProvider.EMAIL_PASSWORD_PROVIDER */
    )) {
      const requestWithRecaptcha = await injectRecaptchaFields(
        authInstance,
        request,
        actionName,
        actionName === "getOobCode"
        /* RecaptchaActionName.GET_OOB_CODE */
      );
      return actionMethod(authInstance, requestWithRecaptcha);
    } else {
      return actionMethod(authInstance, request).catch(async (error) => {
        if (error.code === `auth/${"missing-recaptcha-token"}`) {
          console.log(`${actionName} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
          const requestWithRecaptcha = await injectRecaptchaFields(
            authInstance,
            request,
            actionName,
            actionName === "getOobCode"
            /* RecaptchaActionName.GET_OOB_CODE */
          );
          return actionMethod(authInstance, requestWithRecaptcha);
        } else {
          return Promise.reject(error);
        }
      });
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function initializeAuth(app2, deps) {
    const provider = _getProvider(app2, "auth");
    if (provider.isInitialized()) {
      const auth3 = provider.getImmediate();
      const initialOptions = provider.getOptions();
      if (deepEqual(initialOptions, deps !== null && deps !== void 0 ? deps : {})) {
        return auth3;
      } else {
        _fail(
          auth3,
          "already-initialized"
          /* AuthErrorCode.ALREADY_INITIALIZED */
        );
      }
    }
    const auth2 = provider.initialize({ options: deps });
    return auth2;
  }
  function _initializeAuthInstance(auth2, deps) {
    const persistence = (deps === null || deps === void 0 ? void 0 : deps.persistence) || [];
    const hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
    if (deps === null || deps === void 0 ? void 0 : deps.errorMap) {
      auth2._updateErrorMap(deps.errorMap);
    }
    auth2._initializeWithPersistence(hierarchy, deps === null || deps === void 0 ? void 0 : deps.popupRedirectResolver);
  }
  function connectAuthEmulator(auth2, url, options) {
    const authInternal = _castAuth(auth2);
    _assert(
      authInternal._canInitEmulator,
      authInternal,
      "emulator-config-failed"
      /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
    );
    _assert(
      /^https?:\/\//.test(url),
      authInternal,
      "invalid-emulator-scheme"
      /* AuthErrorCode.INVALID_EMULATOR_SCHEME */
    );
    const disableWarnings = false;
    const protocol = extractProtocol(url);
    const { host, port } = extractHostAndPort(url);
    const portStr = port === null ? "" : `:${port}`;
    authInternal.config.emulator = { url: `${protocol}//${host}${portStr}/` };
    authInternal.settings.appVerificationDisabledForTesting = true;
    authInternal.emulatorConfig = Object.freeze({
      host,
      port,
      protocol: protocol.replace(":", ""),
      options: Object.freeze({ disableWarnings })
    });
    {
      emitEmulatorWarning();
    }
  }
  function extractProtocol(url) {
    const protocolEnd = url.indexOf(":");
    return protocolEnd < 0 ? "" : url.substr(0, protocolEnd + 1);
  }
  function extractHostAndPort(url) {
    const protocol = extractProtocol(url);
    const authority = /(\/\/)?([^?#/]+)/.exec(url.substr(protocol.length));
    if (!authority) {
      return { host: "", port: null };
    }
    const hostAndPort = authority[2].split("@").pop() || "";
    const bracketedIPv6 = /^(\[[^\]]+\])(:|$)/.exec(hostAndPort);
    if (bracketedIPv6) {
      const host = bracketedIPv6[1];
      return { host, port: parsePort(hostAndPort.substr(host.length + 1)) };
    } else {
      const [host, port] = hostAndPort.split(":");
      return { host, port: parsePort(port) };
    }
  }
  function parsePort(portStr) {
    if (!portStr) {
      return null;
    }
    const port = Number(portStr);
    if (isNaN(port)) {
      return null;
    }
    return port;
  }
  function emitEmulatorWarning() {
    function attachBanner() {
      const el2 = document.createElement("p");
      const sty = el2.style;
      el2.innerText = "Running in emulator mode. Do not use with production credentials.";
      sty.position = "fixed";
      sty.width = "100%";
      sty.backgroundColor = "#ffffff";
      sty.border = ".1em solid #000000";
      sty.color = "#b50000";
      sty.bottom = "0px";
      sty.left = "0px";
      sty.margin = "0px";
      sty.zIndex = "10000";
      sty.textAlign = "center";
      el2.classList.add("firebase-emulator-warning");
      document.body.appendChild(el2);
    }
    if (typeof console !== "undefined" && typeof console.info === "function") {
      console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");
    }
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", attachBanner);
      } else {
        attachBanner();
      }
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class AuthCredential {
    /** @internal */
    constructor(providerId, signInMethod) {
      this.providerId = providerId;
      this.signInMethod = signInMethod;
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns a JSON-serializable representation of this object.
     */
    toJSON() {
      return debugFail("not implemented");
    }
    /** @internal */
    _getIdTokenResponse(_auth) {
      return debugFail("not implemented");
    }
    /** @internal */
    _linkToIdToken(_auth, _idToken) {
      return debugFail("not implemented");
    }
    /** @internal */
    _getReauthenticationResolver(_auth) {
      return debugFail("not implemented");
    }
  }
  async function linkEmailPassword(auth2, request) {
    return _performApiRequest(auth2, "POST", "/v1/accounts:signUp", request);
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function signInWithPassword(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth2, request));
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function signInWithEmailLink$1(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth2, request));
  }
  async function signInWithEmailLinkForLinking(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth2, request));
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class EmailAuthCredential extends AuthCredential {
    /** @internal */
    constructor(_email, _password, signInMethod, _tenantId = null) {
      super("password", signInMethod);
      this._email = _email;
      this._password = _password;
      this._tenantId = _tenantId;
    }
    /** @internal */
    static _fromEmailAndPassword(email, password) {
      return new EmailAuthCredential(
        email,
        password,
        "password"
        /* SignInMethod.EMAIL_PASSWORD */
      );
    }
    /** @internal */
    static _fromEmailAndCode(email, oobCode, tenantId = null) {
      return new EmailAuthCredential(email, oobCode, "emailLink", tenantId);
    }
    /** {@inheritdoc AuthCredential.toJSON} */
    toJSON() {
      return {
        email: this._email,
        password: this._password,
        signInMethod: this.signInMethod,
        tenantId: this._tenantId
      };
    }
    /**
     * Static method to deserialize a JSON representation of an object into an {@link  AuthCredential}.
     *
     * @param json - Either `object` or the stringified representation of the object. When string is
     * provided, `JSON.parse` would be called first.
     *
     * @returns If the JSON input does not represent an {@link AuthCredential}, null is returned.
     */
    static fromJSON(json) {
      const obj = typeof json === "string" ? JSON.parse(json) : json;
      if ((obj === null || obj === void 0 ? void 0 : obj.email) && (obj === null || obj === void 0 ? void 0 : obj.password)) {
        if (obj.signInMethod === "password") {
          return this._fromEmailAndPassword(obj.email, obj.password);
        } else if (obj.signInMethod === "emailLink") {
          return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
        }
      }
      return null;
    }
    /** @internal */
    async _getIdTokenResponse(auth2) {
      switch (this.signInMethod) {
        case "password":
          const request = {
            returnSecureToken: true,
            email: this._email,
            password: this._password,
            clientType: "CLIENT_TYPE_WEB"
            /* RecaptchaClientType.WEB */
          };
          return handleRecaptchaFlow(auth2, request, "signInWithPassword", signInWithPassword);
        case "emailLink":
          return signInWithEmailLink$1(auth2, {
            email: this._email,
            oobCode: this._password
          });
        default:
          _fail(
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    }
    /** @internal */
    async _linkToIdToken(auth2, idToken) {
      switch (this.signInMethod) {
        case "password":
          const request = {
            idToken,
            returnSecureToken: true,
            email: this._email,
            password: this._password,
            clientType: "CLIENT_TYPE_WEB"
            /* RecaptchaClientType.WEB */
          };
          return handleRecaptchaFlow(auth2, request, "signUpPassword", linkEmailPassword);
        case "emailLink":
          return signInWithEmailLinkForLinking(auth2, {
            idToken,
            email: this._email,
            oobCode: this._password
          });
        default:
          _fail(
            auth2,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    }
    /** @internal */
    _getReauthenticationResolver(auth2) {
      return this._getIdTokenResponse(auth2);
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function signInWithIdp(auth2, request) {
    return _performSignInRequest(auth2, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth2, request));
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const IDP_REQUEST_URI$1 = "http://localhost";
  class OAuthCredential extends AuthCredential {
    constructor() {
      super(...arguments);
      this.pendingToken = null;
    }
    /** @internal */
    static _fromParams(params) {
      const cred = new OAuthCredential(params.providerId, params.signInMethod);
      if (params.idToken || params.accessToken) {
        if (params.idToken) {
          cred.idToken = params.idToken;
        }
        if (params.accessToken) {
          cred.accessToken = params.accessToken;
        }
        if (params.nonce && !params.pendingToken) {
          cred.nonce = params.nonce;
        }
        if (params.pendingToken) {
          cred.pendingToken = params.pendingToken;
        }
      } else if (params.oauthToken && params.oauthTokenSecret) {
        cred.accessToken = params.oauthToken;
        cred.secret = params.oauthTokenSecret;
      } else {
        _fail(
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
      }
      return cred;
    }
    /** {@inheritdoc AuthCredential.toJSON}  */
    toJSON() {
      return {
        idToken: this.idToken,
        accessToken: this.accessToken,
        secret: this.secret,
        nonce: this.nonce,
        pendingToken: this.pendingToken,
        providerId: this.providerId,
        signInMethod: this.signInMethod
      };
    }
    /**
     * Static method to deserialize a JSON representation of an object into an
     * {@link  AuthCredential}.
     *
     * @param json - Input can be either Object or the stringified representation of the object.
     * When string is provided, JSON.parse would be called first.
     *
     * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
     */
    static fromJSON(json) {
      const obj = typeof json === "string" ? JSON.parse(json) : json;
      const { providerId, signInMethod } = obj, rest = __rest(obj, ["providerId", "signInMethod"]);
      if (!providerId || !signInMethod) {
        return null;
      }
      const cred = new OAuthCredential(providerId, signInMethod);
      cred.idToken = rest.idToken || void 0;
      cred.accessToken = rest.accessToken || void 0;
      cred.secret = rest.secret;
      cred.nonce = rest.nonce;
      cred.pendingToken = rest.pendingToken || null;
      return cred;
    }
    /** @internal */
    _getIdTokenResponse(auth2) {
      const request = this.buildRequest();
      return signInWithIdp(auth2, request);
    }
    /** @internal */
    _linkToIdToken(auth2, idToken) {
      const request = this.buildRequest();
      request.idToken = idToken;
      return signInWithIdp(auth2, request);
    }
    /** @internal */
    _getReauthenticationResolver(auth2) {
      const request = this.buildRequest();
      request.autoCreate = false;
      return signInWithIdp(auth2, request);
    }
    buildRequest() {
      const request = {
        requestUri: IDP_REQUEST_URI$1,
        returnSecureToken: true
      };
      if (this.pendingToken) {
        request.pendingToken = this.pendingToken;
      } else {
        const postBody = {};
        if (this.idToken) {
          postBody["id_token"] = this.idToken;
        }
        if (this.accessToken) {
          postBody["access_token"] = this.accessToken;
        }
        if (this.secret) {
          postBody["oauth_token_secret"] = this.secret;
        }
        postBody["providerId"] = this.providerId;
        if (this.nonce && !this.pendingToken) {
          postBody["nonce"] = this.nonce;
        }
        request.postBody = querystring(postBody);
      }
      return request;
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function parseMode(mode) {
    switch (mode) {
      case "recoverEmail":
        return "RECOVER_EMAIL";
      case "resetPassword":
        return "PASSWORD_RESET";
      case "signIn":
        return "EMAIL_SIGNIN";
      case "verifyEmail":
        return "VERIFY_EMAIL";
      case "verifyAndChangeEmail":
        return "VERIFY_AND_CHANGE_EMAIL";
      case "revertSecondFactorAddition":
        return "REVERT_SECOND_FACTOR_ADDITION";
      default:
        return null;
    }
  }
  function parseDeepLink(url) {
    const link = querystringDecode(extractQuerystring(url))["link"];
    const doubleDeepLink = link ? querystringDecode(extractQuerystring(link))["deep_link_id"] : null;
    const iOSDeepLink = querystringDecode(extractQuerystring(url))["deep_link_id"];
    const iOSDoubleDeepLink = iOSDeepLink ? querystringDecode(extractQuerystring(iOSDeepLink))["link"] : null;
    return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
  }
  class ActionCodeURL {
    /**
     * @param actionLink - The link from which to extract the URL.
     * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
     *
     * @internal
     */
    constructor(actionLink) {
      var _a, _b, _c, _d, _e, _f;
      const searchParams = querystringDecode(extractQuerystring(actionLink));
      const apiKey = (_a = searchParams[
        "apiKey"
        /* QueryField.API_KEY */
      ]) !== null && _a !== void 0 ? _a : null;
      const code = (_b = searchParams[
        "oobCode"
        /* QueryField.CODE */
      ]) !== null && _b !== void 0 ? _b : null;
      const operation = parseMode((_c = searchParams[
        "mode"
        /* QueryField.MODE */
      ]) !== null && _c !== void 0 ? _c : null);
      _assert(
        apiKey && code && operation,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      this.apiKey = apiKey;
      this.operation = operation;
      this.code = code;
      this.continueUrl = (_d = searchParams[
        "continueUrl"
        /* QueryField.CONTINUE_URL */
      ]) !== null && _d !== void 0 ? _d : null;
      this.languageCode = (_e = searchParams[
        "languageCode"
        /* QueryField.LANGUAGE_CODE */
      ]) !== null && _e !== void 0 ? _e : null;
      this.tenantId = (_f = searchParams[
        "tenantId"
        /* QueryField.TENANT_ID */
      ]) !== null && _f !== void 0 ? _f : null;
    }
    /**
     * Parses the email action link string and returns an {@link ActionCodeURL} if the link is valid,
     * otherwise returns null.
     *
     * @param link  - The email action link string.
     * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
     *
     * @public
     */
    static parseLink(link) {
      const actionLink = parseDeepLink(link);
      try {
        return new ActionCodeURL(actionLink);
      } catch (_a) {
        return null;
      }
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class EmailAuthProvider {
    constructor() {
      this.providerId = EmailAuthProvider.PROVIDER_ID;
    }
    /**
     * Initialize an {@link AuthCredential} using an email and password.
     *
     * @example
     * ```javascript
     * const authCredential = EmailAuthProvider.credential(email, password);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * ```javascript
     * const userCredential = await signInWithEmailAndPassword(auth, email, password);
     * ```
     *
     * @param email - Email address.
     * @param password - User account password.
     * @returns The auth provider credential.
     */
    static credential(email, password) {
      return EmailAuthCredential._fromEmailAndPassword(email, password);
    }
    /**
     * Initialize an {@link AuthCredential} using an email and an email link after a sign in with
     * email link operation.
     *
     * @example
     * ```javascript
     * const authCredential = EmailAuthProvider.credentialWithLink(auth, email, emailLink);
     * const userCredential = await signInWithCredential(auth, authCredential);
     * ```
     *
     * @example
     * ```javascript
     * await sendSignInLinkToEmail(auth, email);
     * // Obtain emailLink from user.
     * const userCredential = await signInWithEmailLink(auth, email, emailLink);
     * ```
     *
     * @param auth - The {@link Auth} instance used to verify the link.
     * @param email - Email address.
     * @param emailLink - Sign-in email link.
     * @returns - The auth provider credential.
     */
    static credentialWithLink(email, emailLink) {
      const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
      _assert(
        actionCodeUrl,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
    }
  }
  EmailAuthProvider.PROVIDER_ID = "password";
  EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
  EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class FederatedAuthProvider {
    /**
     * Constructor for generic OAuth providers.
     *
     * @param providerId - Provider for which credentials should be generated.
     */
    constructor(providerId) {
      this.providerId = providerId;
      this.defaultLanguageCode = null;
      this.customParameters = {};
    }
    /**
     * Set the language gode.
     *
     * @param languageCode - language code
     */
    setDefaultLanguage(languageCode) {
      this.defaultLanguageCode = languageCode;
    }
    /**
     * Sets the OAuth custom parameters to pass in an OAuth request for popup and redirect sign-in
     * operations.
     *
     * @remarks
     * For a detailed list, check the reserved required OAuth 2.0 parameters such as `client_id`,
     * `redirect_uri`, `scope`, `response_type`, and `state` are not allowed and will be ignored.
     *
     * @param customOAuthParameters - The custom OAuth parameters to pass in the OAuth request.
     */
    setCustomParameters(customOAuthParameters) {
      this.customParameters = customOAuthParameters;
      return this;
    }
    /**
     * Retrieve the current list of {@link CustomParameters}.
     */
    getCustomParameters() {
      return this.customParameters;
    }
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class BaseOAuthProvider extends FederatedAuthProvider {
    constructor() {
      super(...arguments);
      this.scopes = [];
    }
    /**
     * Add an OAuth scope to the credential.
     *
     * @param scope - Provider OAuth scope to add.
     */
    addScope(scope) {
      if (!this.scopes.includes(scope)) {
        this.scopes.push(scope);
      }
      return this;
    }
    /**
     * Retrieve the current list of OAuth scopes.
     */
    getScopes() {
      return [...this.scopes];
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class FacebookAuthProvider extends BaseOAuthProvider {
    constructor() {
      super(
        "facebook.com"
        /* ProviderId.FACEBOOK */
      );
    }
    /**
     * Creates a credential for Facebook.
     *
     * @example
     * ```javascript
     * // `event` from the Facebook auth.authResponseChange callback.
     * const credential = FacebookAuthProvider.credential(event.authResponse.accessToken);
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param accessToken - Facebook access token.
     */
    static credential(accessToken) {
      return OAuthCredential._fromParams({
        providerId: FacebookAuthProvider.PROVIDER_ID,
        signInMethod: FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
        accessToken
      });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      return FacebookAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
      return FacebookAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
        return null;
      }
      if (!tokenResponse.oauthAccessToken) {
        return null;
      }
      try {
        return FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
      } catch (_a) {
        return null;
      }
    }
  }
  FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
  FacebookAuthProvider.PROVIDER_ID = "facebook.com";
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class GoogleAuthProvider extends BaseOAuthProvider {
    constructor() {
      super(
        "google.com"
        /* ProviderId.GOOGLE */
      );
      this.addScope("profile");
    }
    /**
     * Creates a credential for Google. At least one of ID token and access token is required.
     *
     * @example
     * ```javascript
     * // \`googleUser\` from the onsuccess Google Sign In callback.
     * const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param idToken - Google ID token.
     * @param accessToken - Google access token.
     */
    static credential(idToken, accessToken) {
      return OAuthCredential._fromParams({
        providerId: GoogleAuthProvider.PROVIDER_ID,
        signInMethod: GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
        idToken,
        accessToken
      });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      return GoogleAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
      return GoogleAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse) {
        return null;
      }
      const { oauthIdToken, oauthAccessToken } = tokenResponse;
      if (!oauthIdToken && !oauthAccessToken) {
        return null;
      }
      try {
        return GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
      } catch (_a) {
        return null;
      }
    }
  }
  GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
  GoogleAuthProvider.PROVIDER_ID = "google.com";
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class GithubAuthProvider extends BaseOAuthProvider {
    constructor() {
      super(
        "github.com"
        /* ProviderId.GITHUB */
      );
    }
    /**
     * Creates a credential for Github.
     *
     * @param accessToken - Github access token.
     */
    static credential(accessToken) {
      return OAuthCredential._fromParams({
        providerId: GithubAuthProvider.PROVIDER_ID,
        signInMethod: GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
        accessToken
      });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      return GithubAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
      return GithubAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
        return null;
      }
      if (!tokenResponse.oauthAccessToken) {
        return null;
      }
      try {
        return GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
      } catch (_a) {
        return null;
      }
    }
  }
  GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
  GithubAuthProvider.PROVIDER_ID = "github.com";
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class TwitterAuthProvider extends BaseOAuthProvider {
    constructor() {
      super(
        "twitter.com"
        /* ProviderId.TWITTER */
      );
    }
    /**
     * Creates a credential for Twitter.
     *
     * @param token - Twitter access token.
     * @param secret - Twitter secret.
     */
    static credential(token, secret) {
      return OAuthCredential._fromParams({
        providerId: TwitterAuthProvider.PROVIDER_ID,
        signInMethod: TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
        oauthToken: token,
        oauthTokenSecret: secret
      });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
      return TwitterAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
      return TwitterAuthProvider.credentialFromTaggedObject(error.customData || {});
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
      if (!tokenResponse) {
        return null;
      }
      const { oauthAccessToken, oauthTokenSecret } = tokenResponse;
      if (!oauthAccessToken || !oauthTokenSecret) {
        return null;
      }
      try {
        return TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
      } catch (_a) {
        return null;
      }
    }
  }
  TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
  TwitterAuthProvider.PROVIDER_ID = "twitter.com";
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class UserCredentialImpl {
    constructor(params) {
      this.user = params.user;
      this.providerId = params.providerId;
      this._tokenResponse = params._tokenResponse;
      this.operationType = params.operationType;
    }
    static async _fromIdTokenResponse(auth2, operationType, idTokenResponse, isAnonymous = false) {
      const user = await UserImpl._fromIdTokenResponse(auth2, idTokenResponse, isAnonymous);
      const providerId = providerIdForResponse(idTokenResponse);
      const userCred = new UserCredentialImpl({
        user,
        providerId,
        _tokenResponse: idTokenResponse,
        operationType
      });
      return userCred;
    }
    static async _forOperation(user, operationType, response) {
      await user._updateTokensIfNecessary(
        response,
        /* reload */
        true
      );
      const providerId = providerIdForResponse(response);
      return new UserCredentialImpl({
        user,
        providerId,
        _tokenResponse: response,
        operationType
      });
    }
  }
  function providerIdForResponse(response) {
    if (response.providerId) {
      return response.providerId;
    }
    if ("phoneNumber" in response) {
      return "phone";
    }
    return null;
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class MultiFactorError extends FirebaseError {
    constructor(auth2, error, operationType, user) {
      var _a;
      super(error.code, error.message);
      this.operationType = operationType;
      this.user = user;
      Object.setPrototypeOf(this, MultiFactorError.prototype);
      this.customData = {
        appName: auth2.name,
        tenantId: (_a = auth2.tenantId) !== null && _a !== void 0 ? _a : void 0,
        _serverResponse: error.customData._serverResponse,
        operationType
      };
    }
    static _fromErrorAndOperation(auth2, error, operationType, user) {
      return new MultiFactorError(auth2, error, operationType, user);
    }
  }
  function _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential, user) {
    const idTokenProvider = operationType === "reauthenticate" ? credential._getReauthenticationResolver(auth2) : credential._getIdTokenResponse(auth2);
    return idTokenProvider.catch((error) => {
      if (error.code === `auth/${"multi-factor-auth-required"}`) {
        throw MultiFactorError._fromErrorAndOperation(auth2, error, operationType, user);
      }
      throw error;
    });
  }
  async function _link$1(user, credential, bypassAuthState = false) {
    const response = await _logoutIfInvalidated(user, credential._linkToIdToken(user.auth, await user.getIdToken()), bypassAuthState);
    return UserCredentialImpl._forOperation(user, "link", response);
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function _reauthenticate(user, credential, bypassAuthState = false) {
    const { auth: auth2 } = user;
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    const operationType = "reauthenticate";
    try {
      const response = await _logoutIfInvalidated(user, _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential, user), bypassAuthState);
      _assert(
        response.idToken,
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const parsed = _parseToken(response.idToken);
      _assert(
        parsed,
        auth2,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const { sub: localId } = parsed;
      _assert(
        user.uid === localId,
        auth2,
        "user-mismatch"
        /* AuthErrorCode.USER_MISMATCH */
      );
      return UserCredentialImpl._forOperation(user, operationType, response);
    } catch (e) {
      if ((e === null || e === void 0 ? void 0 : e.code) === `auth/${"user-not-found"}`) {
        _fail(
          auth2,
          "user-mismatch"
          /* AuthErrorCode.USER_MISMATCH */
        );
      }
      throw e;
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function _signInWithCredential(auth2, credential, bypassAuthState = false) {
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    const operationType = "signIn";
    const response = await _processCredentialSavingMfaContextIfNecessary(auth2, operationType, credential);
    const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth2, operationType, response);
    if (!bypassAuthState) {
      await auth2._updateCurrentUser(userCredential.user);
    }
    return userCredential;
  }
  async function signInWithCredential(auth2, credential) {
    return _signInWithCredential(_castAuth(auth2), credential);
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function recachePasswordPolicy(auth2) {
    const authInternal = _castAuth(auth2);
    if (authInternal._getPasswordPolicyInternal()) {
      await authInternal._updatePasswordPolicy();
    }
  }
  function signInWithEmailAndPassword(auth2, email, password) {
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    return signInWithCredential(getModularInstance(auth2), EmailAuthProvider.credential(email, password)).catch(async (error) => {
      if (error.code === `auth/${"password-does-not-meet-requirements"}`) {
        void recachePasswordPolicy(auth2);
      }
      throw error;
    });
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function setPersistence(auth2, persistence) {
    return getModularInstance(auth2).setPersistence(persistence);
  }
  function onIdTokenChanged(auth2, nextOrObserver, error, completed) {
    return getModularInstance(auth2).onIdTokenChanged(nextOrObserver, error, completed);
  }
  function beforeAuthStateChanged(auth2, callback, onAbort) {
    return getModularInstance(auth2).beforeAuthStateChanged(callback, onAbort);
  }
  function onAuthStateChanged(auth2, nextOrObserver, error, completed) {
    return getModularInstance(auth2).onAuthStateChanged(nextOrObserver, error, completed);
  }
  const STORAGE_AVAILABLE_KEY = "__sak";
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class BrowserPersistenceClass {
    constructor(storageRetriever, type) {
      this.storageRetriever = storageRetriever;
      this.type = type;
    }
    _isAvailable() {
      try {
        if (!this.storage) {
          return Promise.resolve(false);
        }
        this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
        this.storage.removeItem(STORAGE_AVAILABLE_KEY);
        return Promise.resolve(true);
      } catch (_a) {
        return Promise.resolve(false);
      }
    }
    _set(key, value) {
      this.storage.setItem(key, JSON.stringify(value));
      return Promise.resolve();
    }
    _get(key) {
      const json = this.storage.getItem(key);
      return Promise.resolve(json ? JSON.parse(json) : null);
    }
    _remove(key) {
      this.storage.removeItem(key);
      return Promise.resolve();
    }
    get storage() {
      return this.storageRetriever();
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _iframeCannotSyncWebStorage() {
    const ua2 = getUA();
    return _isSafari(ua2) || _isIOS(ua2);
  }
  const _POLLING_INTERVAL_MS$1 = 1e3;
  const IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
  class BrowserLocalPersistence extends BrowserPersistenceClass {
    constructor() {
      super(
        () => window.localStorage,
        "LOCAL"
        /* PersistenceType.LOCAL */
      );
      this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
      this.listeners = {};
      this.localCache = {};
      this.pollTimer = null;
      this.safariLocalStorageNotSynced = _iframeCannotSyncWebStorage() && _isIframe();
      this.fallbackToPolling = _isMobileBrowser();
      this._shouldAllowMigration = true;
    }
    forAllChangedKeys(cb2) {
      for (const key of Object.keys(this.listeners)) {
        const newValue = this.storage.getItem(key);
        const oldValue = this.localCache[key];
        if (newValue !== oldValue) {
          cb2(key, oldValue, newValue);
        }
      }
    }
    onStorageEvent(event, poll = false) {
      if (!event.key) {
        this.forAllChangedKeys((key2, _oldValue, newValue) => {
          this.notifyListeners(key2, newValue);
        });
        return;
      }
      const key = event.key;
      if (poll) {
        this.detachListener();
      } else {
        this.stopPolling();
      }
      if (this.safariLocalStorageNotSynced) {
        const storedValue2 = this.storage.getItem(key);
        if (event.newValue !== storedValue2) {
          if (event.newValue !== null) {
            this.storage.setItem(key, event.newValue);
          } else {
            this.storage.removeItem(key);
          }
        } else if (this.localCache[key] === event.newValue && !poll) {
          return;
        }
      }
      const triggerListeners = () => {
        const storedValue2 = this.storage.getItem(key);
        if (!poll && this.localCache[key] === storedValue2) {
          return;
        }
        this.notifyListeners(key, storedValue2);
      };
      const storedValue = this.storage.getItem(key);
      if (_isIE10() && storedValue !== event.newValue && event.newValue !== event.oldValue) {
        setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
      } else {
        triggerListeners();
      }
    }
    notifyListeners(key, value) {
      this.localCache[key] = value;
      const listeners = this.listeners[key];
      if (listeners) {
        for (const listener of Array.from(listeners)) {
          listener(value ? JSON.parse(value) : value);
        }
      }
    }
    startPolling() {
      this.stopPolling();
      this.pollTimer = setInterval(() => {
        this.forAllChangedKeys((key, oldValue, newValue) => {
          this.onStorageEvent(
            new StorageEvent("storage", {
              key,
              oldValue,
              newValue
            }),
            /* poll */
            true
          );
        });
      }, _POLLING_INTERVAL_MS$1);
    }
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    }
    attachListener() {
      window.addEventListener("storage", this.boundEventHandler);
    }
    detachListener() {
      window.removeEventListener("storage", this.boundEventHandler);
    }
    _addListener(key, listener) {
      if (Object.keys(this.listeners).length === 0) {
        if (this.fallbackToPolling) {
          this.startPolling();
        } else {
          this.attachListener();
        }
      }
      if (!this.listeners[key]) {
        this.listeners[key] = /* @__PURE__ */ new Set();
        this.localCache[key] = this.storage.getItem(key);
      }
      this.listeners[key].add(listener);
    }
    _removeListener(key, listener) {
      if (this.listeners[key]) {
        this.listeners[key].delete(listener);
        if (this.listeners[key].size === 0) {
          delete this.listeners[key];
        }
      }
      if (Object.keys(this.listeners).length === 0) {
        this.detachListener();
        this.stopPolling();
      }
    }
    // Update local cache on base operations:
    async _set(key, value) {
      await super._set(key, value);
      this.localCache[key] = JSON.stringify(value);
    }
    async _get(key) {
      const value = await super._get(key);
      this.localCache[key] = JSON.stringify(value);
      return value;
    }
    async _remove(key) {
      await super._remove(key);
      delete this.localCache[key];
    }
  }
  BrowserLocalPersistence.type = "LOCAL";
  const browserLocalPersistence = BrowserLocalPersistence;
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class BrowserSessionPersistence extends BrowserPersistenceClass {
    constructor() {
      super(
        () => window.sessionStorage,
        "SESSION"
        /* PersistenceType.SESSION */
      );
    }
    _addListener(_key, _listener) {
      return;
    }
    _removeListener(_key, _listener) {
      return;
    }
  }
  BrowserSessionPersistence.type = "SESSION";
  const browserSessionPersistence = BrowserSessionPersistence;
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _allSettled(promises) {
    return Promise.all(promises.map(async (promise) => {
      try {
        const value = await promise;
        return {
          fulfilled: true,
          value
        };
      } catch (reason) {
        return {
          fulfilled: false,
          reason
        };
      }
    }));
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Receiver {
    constructor(eventTarget) {
      this.eventTarget = eventTarget;
      this.handlersMap = {};
      this.boundEventHandler = this.handleEvent.bind(this);
    }
    /**
     * Obtain an instance of a Receiver for a given event target, if none exists it will be created.
     *
     * @param eventTarget - An event target (such as window or self) through which the underlying
     * messages will be received.
     */
    static _getInstance(eventTarget) {
      const existingInstance = this.receivers.find((receiver) => receiver.isListeningto(eventTarget));
      if (existingInstance) {
        return existingInstance;
      }
      const newInstance = new Receiver(eventTarget);
      this.receivers.push(newInstance);
      return newInstance;
    }
    isListeningto(eventTarget) {
      return this.eventTarget === eventTarget;
    }
    /**
     * Fans out a MessageEvent to the appropriate listeners.
     *
     * @remarks
     * Sends an {@link Status.ACK} upon receipt and a {@link Status.DONE} once all handlers have
     * finished processing.
     *
     * @param event - The MessageEvent.
     *
     */
    async handleEvent(event) {
      const messageEvent = event;
      const { eventId, eventType, data } = messageEvent.data;
      const handlers = this.handlersMap[eventType];
      if (!(handlers === null || handlers === void 0 ? void 0 : handlers.size)) {
        return;
      }
      messageEvent.ports[0].postMessage({
        status: "ack",
        eventId,
        eventType
      });
      const promises = Array.from(handlers).map(async (handler) => handler(messageEvent.origin, data));
      const response = await _allSettled(promises);
      messageEvent.ports[0].postMessage({
        status: "done",
        eventId,
        eventType,
        response
      });
    }
    /**
     * Subscribe an event handler for a particular event.
     *
     * @param eventType - Event name to subscribe to.
     * @param eventHandler - The event handler which should receive the events.
     *
     */
    _subscribe(eventType, eventHandler) {
      if (Object.keys(this.handlersMap).length === 0) {
        this.eventTarget.addEventListener("message", this.boundEventHandler);
      }
      if (!this.handlersMap[eventType]) {
        this.handlersMap[eventType] = /* @__PURE__ */ new Set();
      }
      this.handlersMap[eventType].add(eventHandler);
    }
    /**
     * Unsubscribe an event handler from a particular event.
     *
     * @param eventType - Event name to unsubscribe from.
     * @param eventHandler - Optinoal event handler, if none provided, unsubscribe all handlers on this event.
     *
     */
    _unsubscribe(eventType, eventHandler) {
      if (this.handlersMap[eventType] && eventHandler) {
        this.handlersMap[eventType].delete(eventHandler);
      }
      if (!eventHandler || this.handlersMap[eventType].size === 0) {
        delete this.handlersMap[eventType];
      }
      if (Object.keys(this.handlersMap).length === 0) {
        this.eventTarget.removeEventListener("message", this.boundEventHandler);
      }
    }
  }
  Receiver.receivers = [];
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _generateEventId(prefix = "", digits = 10) {
    let random = "";
    for (let i = 0; i < digits; i++) {
      random += Math.floor(Math.random() * 10);
    }
    return prefix + random;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class Sender {
    constructor(target) {
      this.target = target;
      this.handlers = /* @__PURE__ */ new Set();
    }
    /**
     * Unsubscribe the handler and remove it from our tracking Set.
     *
     * @param handler - The handler to unsubscribe.
     */
    removeMessageHandler(handler) {
      if (handler.messageChannel) {
        handler.messageChannel.port1.removeEventListener("message", handler.onMessage);
        handler.messageChannel.port1.close();
      }
      this.handlers.delete(handler);
    }
    /**
     * Send a message to the Receiver located at {@link target}.
     *
     * @remarks
     * We'll first wait a bit for an ACK , if we get one we will wait significantly longer until the
     * receiver has had a chance to fully process the event.
     *
     * @param eventType - Type of event to send.
     * @param data - The payload of the event.
     * @param timeout - Timeout for waiting on an ACK from the receiver.
     *
     * @returns An array of settled promises from all the handlers that were listening on the receiver.
     */
    async _send(eventType, data, timeout = 50) {
      const messageChannel = typeof MessageChannel !== "undefined" ? new MessageChannel() : null;
      if (!messageChannel) {
        throw new Error(
          "connection_unavailable"
          /* _MessageError.CONNECTION_UNAVAILABLE */
        );
      }
      let completionTimer;
      let handler;
      return new Promise((resolve, reject) => {
        const eventId = _generateEventId("", 20);
        messageChannel.port1.start();
        const ackTimer = setTimeout(() => {
          reject(new Error(
            "unsupported_event"
            /* _MessageError.UNSUPPORTED_EVENT */
          ));
        }, timeout);
        handler = {
          messageChannel,
          onMessage(event) {
            const messageEvent = event;
            if (messageEvent.data.eventId !== eventId) {
              return;
            }
            switch (messageEvent.data.status) {
              case "ack":
                clearTimeout(ackTimer);
                completionTimer = setTimeout(
                  () => {
                    reject(new Error(
                      "timeout"
                      /* _MessageError.TIMEOUT */
                    ));
                  },
                  3e3
                  /* _TimeoutDuration.COMPLETION */
                );
                break;
              case "done":
                clearTimeout(completionTimer);
                resolve(messageEvent.data.response);
                break;
              default:
                clearTimeout(ackTimer);
                clearTimeout(completionTimer);
                reject(new Error(
                  "invalid_response"
                  /* _MessageError.INVALID_RESPONSE */
                ));
                break;
            }
          }
        };
        this.handlers.add(handler);
        messageChannel.port1.addEventListener("message", handler.onMessage);
        this.target.postMessage({
          eventType,
          eventId,
          data
        }, [messageChannel.port2]);
      }).finally(() => {
        if (handler) {
          this.removeMessageHandler(handler);
        }
      });
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _window() {
    return window;
  }
  function _setWindowLocation(url) {
    _window().location.href = url;
  }
  /**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _isWorker() {
    return typeof _window()["WorkerGlobalScope"] !== "undefined" && typeof _window()["importScripts"] === "function";
  }
  async function _getActiveServiceWorker() {
    if (!(navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker)) {
      return null;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      return registration.active;
    } catch (_a) {
      return null;
    }
  }
  function _getServiceWorkerController() {
    var _a;
    return ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) === null || _a === void 0 ? void 0 : _a.controller) || null;
  }
  function _getWorkerGlobalScope() {
    return _isWorker() ? self : null;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const DB_NAME = "firebaseLocalStorageDb";
  const DB_VERSION = 1;
  const DB_OBJECTSTORE_NAME = "firebaseLocalStorage";
  const DB_DATA_KEYPATH = "fbase_key";
  class DBPromise {
    constructor(request) {
      this.request = request;
    }
    toPromise() {
      return new Promise((resolve, reject) => {
        this.request.addEventListener("success", () => {
          resolve(this.request.result);
        });
        this.request.addEventListener("error", () => {
          reject(this.request.error);
        });
      });
    }
  }
  function getObjectStore(db2, isReadWrite) {
    return db2.transaction([DB_OBJECTSTORE_NAME], isReadWrite ? "readwrite" : "readonly").objectStore(DB_OBJECTSTORE_NAME);
  }
  function _deleteDatabase() {
    const request = indexedDB.deleteDatabase(DB_NAME);
    return new DBPromise(request).toPromise();
  }
  function _openDatabase() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    return new Promise((resolve, reject) => {
      request.addEventListener("error", () => {
        reject(request.error);
      });
      request.addEventListener("upgradeneeded", () => {
        const db2 = request.result;
        try {
          db2.createObjectStore(DB_OBJECTSTORE_NAME, { keyPath: DB_DATA_KEYPATH });
        } catch (e) {
          reject(e);
        }
      });
      request.addEventListener("success", async () => {
        const db2 = request.result;
        if (!db2.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) {
          db2.close();
          await _deleteDatabase();
          resolve(await _openDatabase());
        } else {
          resolve(db2);
        }
      });
    });
  }
  async function _putObject(db2, key, value) {
    const request = getObjectStore(db2, true).put({
      [DB_DATA_KEYPATH]: key,
      value
    });
    return new DBPromise(request).toPromise();
  }
  async function getObject(db2, key) {
    const request = getObjectStore(db2, false).get(key);
    const data = await new DBPromise(request).toPromise();
    return data === void 0 ? null : data.value;
  }
  function _deleteObject(db2, key) {
    const request = getObjectStore(db2, true).delete(key);
    return new DBPromise(request).toPromise();
  }
  const _POLLING_INTERVAL_MS = 800;
  const _TRANSACTION_RETRY_COUNT = 3;
  class IndexedDBLocalPersistence {
    constructor() {
      this.type = "LOCAL";
      this._shouldAllowMigration = true;
      this.listeners = {};
      this.localCache = {};
      this.pollTimer = null;
      this.pendingWrites = 0;
      this.receiver = null;
      this.sender = null;
      this.serviceWorkerReceiverAvailable = false;
      this.activeServiceWorker = null;
      this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {
      }, () => {
      });
    }
    async _openDb() {
      if (this.db) {
        return this.db;
      }
      this.db = await _openDatabase();
      return this.db;
    }
    async _withRetries(op) {
      let numAttempts = 0;
      while (true) {
        try {
          const db2 = await this._openDb();
          return await op(db2);
        } catch (e) {
          if (numAttempts++ > _TRANSACTION_RETRY_COUNT) {
            throw e;
          }
          if (this.db) {
            this.db.close();
            this.db = void 0;
          }
        }
      }
    }
    /**
     * IndexedDB events do not propagate from the main window to the worker context.  We rely on a
     * postMessage interface to send these events to the worker ourselves.
     */
    async initializeServiceWorkerMessaging() {
      return _isWorker() ? this.initializeReceiver() : this.initializeSender();
    }
    /**
     * As the worker we should listen to events from the main window.
     */
    async initializeReceiver() {
      this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
      this.receiver._subscribe("keyChanged", async (_origin, data) => {
        const keys = await this._poll();
        return {
          keyProcessed: keys.includes(data.key)
        };
      });
      this.receiver._subscribe("ping", async (_origin, _data) => {
        return [
          "keyChanged"
          /* _EventType.KEY_CHANGED */
        ];
      });
    }
    /**
     * As the main window, we should let the worker know when keys change (set and remove).
     *
     * @remarks
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready | ServiceWorkerContainer.ready}
     * may not resolve.
     */
    async initializeSender() {
      var _a, _b;
      this.activeServiceWorker = await _getActiveServiceWorker();
      if (!this.activeServiceWorker) {
        return;
      }
      this.sender = new Sender(this.activeServiceWorker);
      const results = await this.sender._send(
        "ping",
        {},
        800
        /* _TimeoutDuration.LONG_ACK */
      );
      if (!results) {
        return;
      }
      if (((_a = results[0]) === null || _a === void 0 ? void 0 : _a.fulfilled) && ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.value.includes(
        "keyChanged"
        /* _EventType.KEY_CHANGED */
      ))) {
        this.serviceWorkerReceiverAvailable = true;
      }
    }
    /**
     * Let the worker know about a changed key, the exact key doesn't technically matter since the
     * worker will just trigger a full sync anyway.
     *
     * @remarks
     * For now, we only support one service worker per page.
     *
     * @param key - Storage key which changed.
     */
    async notifyServiceWorker(key) {
      if (!this.sender || !this.activeServiceWorker || _getServiceWorkerController() !== this.activeServiceWorker) {
        return;
      }
      try {
        await this.sender._send(
          "keyChanged",
          { key },
          // Use long timeout if receiver has previously responded to a ping from us.
          this.serviceWorkerReceiverAvailable ? 800 : 50
          /* _TimeoutDuration.ACK */
        );
      } catch (_a) {
      }
    }
    async _isAvailable() {
      try {
        if (!indexedDB) {
          return false;
        }
        const db2 = await _openDatabase();
        await _putObject(db2, STORAGE_AVAILABLE_KEY, "1");
        await _deleteObject(db2, STORAGE_AVAILABLE_KEY);
        return true;
      } catch (_a) {
      }
      return false;
    }
    async _withPendingWrite(write) {
      this.pendingWrites++;
      try {
        await write();
      } finally {
        this.pendingWrites--;
      }
    }
    async _set(key, value) {
      return this._withPendingWrite(async () => {
        await this._withRetries((db2) => _putObject(db2, key, value));
        this.localCache[key] = value;
        return this.notifyServiceWorker(key);
      });
    }
    async _get(key) {
      const obj = await this._withRetries((db2) => getObject(db2, key));
      this.localCache[key] = obj;
      return obj;
    }
    async _remove(key) {
      return this._withPendingWrite(async () => {
        await this._withRetries((db2) => _deleteObject(db2, key));
        delete this.localCache[key];
        return this.notifyServiceWorker(key);
      });
    }
    async _poll() {
      const result = await this._withRetries((db2) => {
        const getAllRequest = getObjectStore(db2, false).getAll();
        return new DBPromise(getAllRequest).toPromise();
      });
      if (!result) {
        return [];
      }
      if (this.pendingWrites !== 0) {
        return [];
      }
      const keys = [];
      const keysInResult = /* @__PURE__ */ new Set();
      if (result.length !== 0) {
        for (const { fbase_key: key, value } of result) {
          keysInResult.add(key);
          if (JSON.stringify(this.localCache[key]) !== JSON.stringify(value)) {
            this.notifyListeners(key, value);
            keys.push(key);
          }
        }
      }
      for (const localKey of Object.keys(this.localCache)) {
        if (this.localCache[localKey] && !keysInResult.has(localKey)) {
          this.notifyListeners(localKey, null);
          keys.push(localKey);
        }
      }
      return keys;
    }
    notifyListeners(key, newValue) {
      this.localCache[key] = newValue;
      const listeners = this.listeners[key];
      if (listeners) {
        for (const listener of Array.from(listeners)) {
          listener(newValue);
        }
      }
    }
    startPolling() {
      this.stopPolling();
      this.pollTimer = setInterval(async () => this._poll(), _POLLING_INTERVAL_MS);
    }
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    }
    _addListener(key, listener) {
      if (Object.keys(this.listeners).length === 0) {
        this.startPolling();
      }
      if (!this.listeners[key]) {
        this.listeners[key] = /* @__PURE__ */ new Set();
        void this._get(key);
      }
      this.listeners[key].add(listener);
    }
    _removeListener(key, listener) {
      if (this.listeners[key]) {
        this.listeners[key].delete(listener);
        if (this.listeners[key].size === 0) {
          delete this.listeners[key];
        }
      }
      if (Object.keys(this.listeners).length === 0) {
        this.stopPolling();
      }
    }
  }
  IndexedDBLocalPersistence.type = "LOCAL";
  const indexedDBLocalPersistence = IndexedDBLocalPersistence;
  new Delay(3e4, 6e4);
  /**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function _withDefaultResolver(auth2, resolverOverride) {
    if (resolverOverride) {
      return _getInstance(resolverOverride);
    }
    _assert(
      auth2._popupRedirectResolver,
      auth2,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    return auth2._popupRedirectResolver;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class IdpCredential extends AuthCredential {
    constructor(params) {
      super(
        "custom",
        "custom"
        /* ProviderId.CUSTOM */
      );
      this.params = params;
    }
    _getIdTokenResponse(auth2) {
      return signInWithIdp(auth2, this._buildIdpRequest());
    }
    _linkToIdToken(auth2, idToken) {
      return signInWithIdp(auth2, this._buildIdpRequest(idToken));
    }
    _getReauthenticationResolver(auth2) {
      return signInWithIdp(auth2, this._buildIdpRequest());
    }
    _buildIdpRequest(idToken) {
      const request = {
        requestUri: this.params.requestUri,
        sessionId: this.params.sessionId,
        postBody: this.params.postBody,
        tenantId: this.params.tenantId,
        pendingToken: this.params.pendingToken,
        returnSecureToken: true,
        returnIdpCredential: true
      };
      if (idToken) {
        request.idToken = idToken;
      }
      return request;
    }
  }
  function _signIn(params) {
    return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
  }
  function _reauth(params) {
    const { auth: auth2, user } = params;
    _assert(
      user,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
  }
  async function _link(params) {
    const { auth: auth2, user } = params;
    _assert(
      user,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return _link$1(user, new IdpCredential(params), params.bypassAuthState);
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class AbstractPopupRedirectOperation {
    constructor(auth2, filter2, resolver, user, bypassAuthState = false) {
      this.auth = auth2;
      this.resolver = resolver;
      this.user = user;
      this.bypassAuthState = bypassAuthState;
      this.pendingPromise = null;
      this.eventManager = null;
      this.filter = Array.isArray(filter2) ? filter2 : [filter2];
    }
    execute() {
      return new Promise(async (resolve, reject) => {
        this.pendingPromise = { resolve, reject };
        try {
          this.eventManager = await this.resolver._initialize(this.auth);
          await this.onExecution();
          this.eventManager.registerConsumer(this);
        } catch (e) {
          this.reject(e);
        }
      });
    }
    async onAuthEvent(event) {
      const { urlResponse, sessionId, postBody, tenantId, error, type } = event;
      if (error) {
        this.reject(error);
        return;
      }
      const params = {
        auth: this.auth,
        requestUri: urlResponse,
        sessionId,
        tenantId: tenantId || void 0,
        postBody: postBody || void 0,
        user: this.user,
        bypassAuthState: this.bypassAuthState
      };
      try {
        this.resolve(await this.getIdpTask(type)(params));
      } catch (e) {
        this.reject(e);
      }
    }
    onError(error) {
      this.reject(error);
    }
    getIdpTask(type) {
      switch (type) {
        case "signInViaPopup":
        case "signInViaRedirect":
          return _signIn;
        case "linkViaPopup":
        case "linkViaRedirect":
          return _link;
        case "reauthViaPopup":
        case "reauthViaRedirect":
          return _reauth;
        default:
          _fail(
            this.auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    }
    resolve(cred) {
      debugAssert(this.pendingPromise, "Pending promise was never set");
      this.pendingPromise.resolve(cred);
      this.unregisterAndCleanUp();
    }
    reject(error) {
      debugAssert(this.pendingPromise, "Pending promise was never set");
      this.pendingPromise.reject(error);
      this.unregisterAndCleanUp();
    }
    unregisterAndCleanUp() {
      if (this.eventManager) {
        this.eventManager.unregisterConsumer(this);
      }
      this.pendingPromise = null;
      this.cleanUp();
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2e3, 1e4);
  class PopupOperation extends AbstractPopupRedirectOperation {
    constructor(auth2, filter2, provider, resolver, user) {
      super(auth2, filter2, resolver, user);
      this.provider = provider;
      this.authWindow = null;
      this.pollId = null;
      if (PopupOperation.currentPopupAction) {
        PopupOperation.currentPopupAction.cancel();
      }
      PopupOperation.currentPopupAction = this;
    }
    async executeNotNull() {
      const result = await this.execute();
      _assert(
        result,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      return result;
    }
    async onExecution() {
      debugAssert(this.filter.length === 1, "Popup operations only handle one event");
      const eventId = _generateEventId();
      this.authWindow = await this.resolver._openPopup(
        this.auth,
        this.provider,
        this.filter[0],
        // There's always one, see constructor
        eventId
      );
      this.authWindow.associatedEvent = eventId;
      this.resolver._originValidation(this.auth).catch((e) => {
        this.reject(e);
      });
      this.resolver._isIframeWebStorageSupported(this.auth, (isSupported) => {
        if (!isSupported) {
          this.reject(_createError(
            this.auth,
            "web-storage-unsupported"
            /* AuthErrorCode.WEB_STORAGE_UNSUPPORTED */
          ));
        }
      });
      this.pollUserCancellation();
    }
    get eventId() {
      var _a;
      return ((_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.associatedEvent) || null;
    }
    cancel() {
      this.reject(_createError(
        this.auth,
        "cancelled-popup-request"
        /* AuthErrorCode.EXPIRED_POPUP_REQUEST */
      ));
    }
    cleanUp() {
      if (this.authWindow) {
        this.authWindow.close();
      }
      if (this.pollId) {
        window.clearTimeout(this.pollId);
      }
      this.authWindow = null;
      this.pollId = null;
      PopupOperation.currentPopupAction = null;
    }
    pollUserCancellation() {
      const poll = () => {
        var _a, _b;
        if ((_b = (_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.window) === null || _b === void 0 ? void 0 : _b.closed) {
          this.pollId = window.setTimeout(
            () => {
              this.pollId = null;
              this.reject(_createError(
                this.auth,
                "popup-closed-by-user"
                /* AuthErrorCode.POPUP_CLOSED_BY_USER */
              ));
            },
            8e3
            /* _Timeout.AUTH_EVENT */
          );
          return;
        }
        this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
      };
      poll();
    }
  }
  PopupOperation.currentPopupAction = null;
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const PENDING_REDIRECT_KEY = "pendingRedirect";
  const redirectOutcomeMap = /* @__PURE__ */ new Map();
  class RedirectAction extends AbstractPopupRedirectOperation {
    constructor(auth2, resolver, bypassAuthState = false) {
      super(auth2, [
        "signInViaRedirect",
        "linkViaRedirect",
        "reauthViaRedirect",
        "unknown"
        /* AuthEventType.UNKNOWN */
      ], resolver, void 0, bypassAuthState);
      this.eventId = null;
    }
    /**
     * Override the execute function; if we already have a redirect result, then
     * just return it.
     */
    async execute() {
      let readyOutcome = redirectOutcomeMap.get(this.auth._key());
      if (!readyOutcome) {
        try {
          const hasPendingRedirect = await _getAndClearPendingRedirectStatus(this.resolver, this.auth);
          const result = hasPendingRedirect ? await super.execute() : null;
          readyOutcome = () => Promise.resolve(result);
        } catch (e) {
          readyOutcome = () => Promise.reject(e);
        }
        redirectOutcomeMap.set(this.auth._key(), readyOutcome);
      }
      if (!this.bypassAuthState) {
        redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
      }
      return readyOutcome();
    }
    async onAuthEvent(event) {
      if (event.type === "signInViaRedirect") {
        return super.onAuthEvent(event);
      } else if (event.type === "unknown") {
        this.resolve(null);
        return;
      }
      if (event.eventId) {
        const user = await this.auth._redirectUserForId(event.eventId);
        if (user) {
          this.user = user;
          return super.onAuthEvent(event);
        } else {
          this.resolve(null);
        }
      }
    }
    async onExecution() {
    }
    cleanUp() {
    }
  }
  async function _getAndClearPendingRedirectStatus(resolver, auth2) {
    const key = pendingRedirectKey(auth2);
    const persistence = resolverPersistence(resolver);
    if (!await persistence._isAvailable()) {
      return false;
    }
    const hasPendingRedirect = await persistence._get(key) === "true";
    await persistence._remove(key);
    return hasPendingRedirect;
  }
  function _overrideRedirectResult(auth2, result) {
    redirectOutcomeMap.set(auth2._key(), result);
  }
  function resolverPersistence(resolver) {
    return _getInstance(resolver._redirectPersistence);
  }
  function pendingRedirectKey(auth2) {
    return _persistenceKeyName(PENDING_REDIRECT_KEY, auth2.config.apiKey, auth2.name);
  }
  async function _getRedirectResult(auth2, resolverExtern, bypassAuthState = false) {
    if (_isFirebaseServerApp(auth2.app)) {
      return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(auth2));
    }
    const authInternal = _castAuth(auth2);
    const resolver = _withDefaultResolver(authInternal, resolverExtern);
    const action = new RedirectAction(authInternal, resolver, bypassAuthState);
    const result = await action.execute();
    if (result && !bypassAuthState) {
      delete result.user._redirectEventId;
      await authInternal._persistUserIfCurrent(result.user);
      await authInternal._setRedirectUser(null, resolverExtern);
    }
    return result;
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1e3;
  class AuthEventManager {
    constructor(auth2) {
      this.auth = auth2;
      this.cachedEventUids = /* @__PURE__ */ new Set();
      this.consumers = /* @__PURE__ */ new Set();
      this.queuedRedirectEvent = null;
      this.hasHandledPotentialRedirect = false;
      this.lastProcessedEventTime = Date.now();
    }
    registerConsumer(authEventConsumer) {
      this.consumers.add(authEventConsumer);
      if (this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
        this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
        this.saveEventToCache(this.queuedRedirectEvent);
        this.queuedRedirectEvent = null;
      }
    }
    unregisterConsumer(authEventConsumer) {
      this.consumers.delete(authEventConsumer);
    }
    onEvent(event) {
      if (this.hasEventBeenHandled(event)) {
        return false;
      }
      let handled = false;
      this.consumers.forEach((consumer) => {
        if (this.isEventForConsumer(event, consumer)) {
          handled = true;
          this.sendToConsumer(event, consumer);
          this.saveEventToCache(event);
        }
      });
      if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
        return handled;
      }
      this.hasHandledPotentialRedirect = true;
      if (!handled) {
        this.queuedRedirectEvent = event;
        handled = true;
      }
      return handled;
    }
    sendToConsumer(event, consumer) {
      var _a;
      if (event.error && !isNullRedirectEvent(event)) {
        const code = ((_a = event.error.code) === null || _a === void 0 ? void 0 : _a.split("auth/")[1]) || "internal-error";
        consumer.onError(_createError(this.auth, code));
      } else {
        consumer.onAuthEvent(event);
      }
    }
    isEventForConsumer(event, consumer) {
      const eventIdMatches = consumer.eventId === null || !!event.eventId && event.eventId === consumer.eventId;
      return consumer.filter.includes(event.type) && eventIdMatches;
    }
    hasEventBeenHandled(event) {
      if (Date.now() - this.lastProcessedEventTime >= EVENT_DUPLICATION_CACHE_DURATION_MS) {
        this.cachedEventUids.clear();
      }
      return this.cachedEventUids.has(eventUid(event));
    }
    saveEventToCache(event) {
      this.cachedEventUids.add(eventUid(event));
      this.lastProcessedEventTime = Date.now();
    }
  }
  function eventUid(e) {
    return [e.type, e.eventId, e.sessionId, e.tenantId].filter((v2) => v2).join("-");
  }
  function isNullRedirectEvent({ type, error }) {
    return type === "unknown" && (error === null || error === void 0 ? void 0 : error.code) === `auth/${"no-auth-event"}`;
  }
  function isRedirectEvent(event) {
    switch (event.type) {
      case "signInViaRedirect":
      case "linkViaRedirect":
      case "reauthViaRedirect":
        return true;
      case "unknown":
        return isNullRedirectEvent(event);
      default:
        return false;
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function _getProjectConfig(auth2, request = {}) {
    return _performApiRequest(auth2, "GET", "/v1/projects", request);
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  const HTTP_REGEX = /^https?/;
  async function _validateOrigin(auth2) {
    if (auth2.config.emulator) {
      return;
    }
    const { authorizedDomains } = await _getProjectConfig(auth2);
    for (const domain of authorizedDomains) {
      try {
        if (matchDomain(domain)) {
          return;
        }
      } catch (_a) {
      }
    }
    _fail(
      auth2,
      "unauthorized-domain"
      /* AuthErrorCode.INVALID_ORIGIN */
    );
  }
  function matchDomain(expected) {
    const currentUrl = _getCurrentUrl();
    const { protocol, hostname } = new URL(currentUrl);
    if (expected.startsWith("chrome-extension://")) {
      const ceUrl = new URL(expected);
      if (ceUrl.hostname === "" && hostname === "") {
        return protocol === "chrome-extension:" && expected.replace("chrome-extension://", "") === currentUrl.replace("chrome-extension://", "");
      }
      return protocol === "chrome-extension:" && ceUrl.hostname === hostname;
    }
    if (!HTTP_REGEX.test(protocol)) {
      return false;
    }
    if (IP_ADDRESS_REGEX.test(expected)) {
      return hostname === expected;
    }
    const escapedDomainPattern = expected.replace(/\./g, "\\.");
    const re2 = new RegExp("^(.+\\." + escapedDomainPattern + "|" + escapedDomainPattern + ")$", "i");
    return re2.test(hostname);
  }
  /**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const NETWORK_TIMEOUT = new Delay(3e4, 6e4);
  function resetUnloadedGapiModules() {
    const beacon = _window().___jsl;
    if (beacon === null || beacon === void 0 ? void 0 : beacon.H) {
      for (const hint of Object.keys(beacon.H)) {
        beacon.H[hint].r = beacon.H[hint].r || [];
        beacon.H[hint].L = beacon.H[hint].L || [];
        beacon.H[hint].r = [...beacon.H[hint].L];
        if (beacon.CP) {
          for (let i = 0; i < beacon.CP.length; i++) {
            beacon.CP[i] = null;
          }
        }
      }
    }
  }
  function loadGapi(auth2) {
    return new Promise((resolve, reject) => {
      var _a, _b, _c;
      function loadGapiIframe() {
        resetUnloadedGapiModules();
        gapi.load("gapi.iframes", {
          callback: () => {
            resolve(gapi.iframes.getContext());
          },
          ontimeout: () => {
            resetUnloadedGapiModules();
            reject(_createError(
              auth2,
              "network-request-failed"
              /* AuthErrorCode.NETWORK_REQUEST_FAILED */
            ));
          },
          timeout: NETWORK_TIMEOUT.get()
        });
      }
      if ((_b = (_a = _window().gapi) === null || _a === void 0 ? void 0 : _a.iframes) === null || _b === void 0 ? void 0 : _b.Iframe) {
        resolve(gapi.iframes.getContext());
      } else if (!!((_c = _window().gapi) === null || _c === void 0 ? void 0 : _c.load)) {
        loadGapiIframe();
      } else {
        const cbName = _generateCallbackName("iframefcb");
        _window()[cbName] = () => {
          if (!!gapi.load) {
            loadGapiIframe();
          } else {
            reject(_createError(
              auth2,
              "network-request-failed"
              /* AuthErrorCode.NETWORK_REQUEST_FAILED */
            ));
          }
        };
        return _loadJS(`${_gapiScriptUrl()}?onload=${cbName}`).catch((e) => reject(e));
      }
    }).catch((error) => {
      cachedGApiLoader = null;
      throw error;
    });
  }
  let cachedGApiLoader = null;
  function _loadGapi(auth2) {
    cachedGApiLoader = cachedGApiLoader || loadGapi(auth2);
    return cachedGApiLoader;
  }
  /**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const PING_TIMEOUT = new Delay(5e3, 15e3);
  const IFRAME_PATH = "__/auth/iframe";
  const EMULATED_IFRAME_PATH = "emulator/auth/iframe";
  const IFRAME_ATTRIBUTES = {
    style: {
      position: "absolute",
      top: "-100px",
      width: "1px",
      height: "1px"
    },
    "aria-hidden": "true",
    tabindex: "-1"
  };
  const EID_FROM_APIHOST = /* @__PURE__ */ new Map([
    ["identitytoolkit.googleapis.com", "p"],
    ["staging-identitytoolkit.sandbox.googleapis.com", "s"],
    ["test-identitytoolkit.sandbox.googleapis.com", "t"]
    // test
  ]);
  function getIframeUrl(auth2) {
    const config = auth2.config;
    _assert(
      config.authDomain,
      auth2,
      "auth-domain-config-required"
      /* AuthErrorCode.MISSING_AUTH_DOMAIN */
    );
    const url = config.emulator ? _emulatorUrl(config, EMULATED_IFRAME_PATH) : `https://${auth2.config.authDomain}/${IFRAME_PATH}`;
    const params = {
      apiKey: config.apiKey,
      appName: auth2.name,
      v: SDK_VERSION
    };
    const eid = EID_FROM_APIHOST.get(auth2.config.apiHost);
    if (eid) {
      params.eid = eid;
    }
    const frameworks = auth2._getFrameworks();
    if (frameworks.length) {
      params.fw = frameworks.join(",");
    }
    return `${url}?${querystring(params).slice(1)}`;
  }
  async function _openIframe(auth2) {
    const context = await _loadGapi(auth2);
    const gapi2 = _window().gapi;
    _assert(
      gapi2,
      auth2,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return context.open({
      where: document.body,
      url: getIframeUrl(auth2),
      messageHandlersFilter: gapi2.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
      attributes: IFRAME_ATTRIBUTES,
      dontclear: true
    }, (iframe) => new Promise(async (resolve, reject) => {
      await iframe.restyle({
        // Prevent iframe from closing on mouse out.
        setHideOnLeave: false
      });
      const networkError = _createError(
        auth2,
        "network-request-failed"
        /* AuthErrorCode.NETWORK_REQUEST_FAILED */
      );
      const networkErrorTimer = _window().setTimeout(() => {
        reject(networkError);
      }, PING_TIMEOUT.get());
      function clearTimerAndResolve() {
        _window().clearTimeout(networkErrorTimer);
        resolve(iframe);
      }
      iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, () => {
        reject(networkError);
      });
    }));
  }
  /**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const BASE_POPUP_OPTIONS = {
    location: "yes",
    resizable: "yes",
    statusbar: "yes",
    toolbar: "no"
  };
  const DEFAULT_WIDTH = 500;
  const DEFAULT_HEIGHT = 600;
  const TARGET_BLANK = "_blank";
  const FIREFOX_EMPTY_URL = "http://localhost";
  class AuthPopup {
    constructor(window2) {
      this.window = window2;
      this.associatedEvent = null;
    }
    close() {
      if (this.window) {
        try {
          this.window.close();
        } catch (e) {
        }
      }
    }
  }
  function _open(auth2, url, name2, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
    const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
    const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
    let target = "";
    const options = Object.assign(Object.assign({}, BASE_POPUP_OPTIONS), {
      width: width.toString(),
      height: height.toString(),
      top,
      left
    });
    const ua2 = getUA().toLowerCase();
    if (name2) {
      target = _isChromeIOS(ua2) ? TARGET_BLANK : name2;
    }
    if (_isFirefox(ua2)) {
      url = url || FIREFOX_EMPTY_URL;
      options.scrollbars = "yes";
    }
    const optionsString = Object.entries(options).reduce((accum, [key, value]) => `${accum}${key}=${value},`, "");
    if (_isIOSStandalone(ua2) && target !== "_self") {
      openAsNewWindowIOS(url || "", target);
      return new AuthPopup(null);
    }
    const newWin = window.open(url || "", target, optionsString);
    _assert(
      newWin,
      auth2,
      "popup-blocked"
      /* AuthErrorCode.POPUP_BLOCKED */
    );
    try {
      newWin.focus();
    } catch (e) {
    }
    return new AuthPopup(newWin);
  }
  function openAsNewWindowIOS(url, target) {
    const el2 = document.createElement("a");
    el2.href = url;
    el2.target = target;
    const click = document.createEvent("MouseEvent");
    click.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
    el2.dispatchEvent(click);
  }
  /**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const WIDGET_PATH = "__/auth/handler";
  const EMULATOR_WIDGET_PATH = "emulator/auth/handler";
  const FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent("fac");
  async function _getRedirectUrl(auth2, provider, authType, redirectUrl, eventId, additionalParams) {
    _assert(
      auth2.config.authDomain,
      auth2,
      "auth-domain-config-required"
      /* AuthErrorCode.MISSING_AUTH_DOMAIN */
    );
    _assert(
      auth2.config.apiKey,
      auth2,
      "invalid-api-key"
      /* AuthErrorCode.INVALID_API_KEY */
    );
    const params = {
      apiKey: auth2.config.apiKey,
      appName: auth2.name,
      authType,
      redirectUrl,
      v: SDK_VERSION,
      eventId
    };
    if (provider instanceof FederatedAuthProvider) {
      provider.setDefaultLanguage(auth2.languageCode);
      params.providerId = provider.providerId || "";
      if (!isEmpty(provider.getCustomParameters())) {
        params.customParameters = JSON.stringify(provider.getCustomParameters());
      }
      for (const [key, value] of Object.entries({})) {
        params[key] = value;
      }
    }
    if (provider instanceof BaseOAuthProvider) {
      const scopes = provider.getScopes().filter((scope) => scope !== "");
      if (scopes.length > 0) {
        params.scopes = scopes.join(",");
      }
    }
    if (auth2.tenantId) {
      params.tid = auth2.tenantId;
    }
    const paramsDict = params;
    for (const key of Object.keys(paramsDict)) {
      if (paramsDict[key] === void 0) {
        delete paramsDict[key];
      }
    }
    const appCheckToken = await auth2._getAppCheckToken();
    const appCheckTokenFragment = appCheckToken ? `#${FIREBASE_APP_CHECK_FRAGMENT_ID}=${encodeURIComponent(appCheckToken)}` : "";
    return `${getHandlerBase(auth2)}?${querystring(paramsDict).slice(1)}${appCheckTokenFragment}`;
  }
  function getHandlerBase({ config }) {
    if (!config.emulator) {
      return `https://${config.authDomain}/${WIDGET_PATH}`;
    }
    return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const WEB_STORAGE_SUPPORT_KEY = "webStorageSupport";
  class BrowserPopupRedirectResolver {
    constructor() {
      this.eventManagers = {};
      this.iframes = {};
      this.originValidationPromises = {};
      this._redirectPersistence = browserSessionPersistence;
      this._completeRedirectFn = _getRedirectResult;
      this._overrideRedirectResult = _overrideRedirectResult;
    }
    // Wrapping in async even though we don't await anywhere in order
    // to make sure errors are raised as promise rejections
    async _openPopup(auth2, provider, authType, eventId) {
      var _a;
      debugAssert((_a = this.eventManagers[auth2._key()]) === null || _a === void 0 ? void 0 : _a.manager, "_initialize() not called before _openPopup()");
      const url = await _getRedirectUrl(auth2, provider, authType, _getCurrentUrl(), eventId);
      return _open(auth2, url, _generateEventId());
    }
    async _openRedirect(auth2, provider, authType, eventId) {
      await this._originValidation(auth2);
      const url = await _getRedirectUrl(auth2, provider, authType, _getCurrentUrl(), eventId);
      _setWindowLocation(url);
      return new Promise(() => {
      });
    }
    _initialize(auth2) {
      const key = auth2._key();
      if (this.eventManagers[key]) {
        const { manager, promise: promise2 } = this.eventManagers[key];
        if (manager) {
          return Promise.resolve(manager);
        } else {
          debugAssert(promise2, "If manager is not set, promise should be");
          return promise2;
        }
      }
      const promise = this.initAndGetManager(auth2);
      this.eventManagers[key] = { promise };
      promise.catch(() => {
        delete this.eventManagers[key];
      });
      return promise;
    }
    async initAndGetManager(auth2) {
      const iframe = await _openIframe(auth2);
      const manager = new AuthEventManager(auth2);
      iframe.register("authEvent", (iframeEvent) => {
        _assert(
          iframeEvent === null || iframeEvent === void 0 ? void 0 : iframeEvent.authEvent,
          auth2,
          "invalid-auth-event"
          /* AuthErrorCode.INVALID_AUTH_EVENT */
        );
        const handled = manager.onEvent(iframeEvent.authEvent);
        return {
          status: handled ? "ACK" : "ERROR"
          /* GapiOutcome.ERROR */
        };
      }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
      this.eventManagers[auth2._key()] = { manager };
      this.iframes[auth2._key()] = iframe;
      return manager;
    }
    _isIframeWebStorageSupported(auth2, cb2) {
      const iframe = this.iframes[auth2._key()];
      iframe.send(WEB_STORAGE_SUPPORT_KEY, { type: WEB_STORAGE_SUPPORT_KEY }, (result) => {
        var _a;
        const isSupported = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a[WEB_STORAGE_SUPPORT_KEY];
        if (isSupported !== void 0) {
          cb2(!!isSupported);
        }
        _fail(
          auth2,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
      }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
    }
    _originValidation(auth2) {
      const key = auth2._key();
      if (!this.originValidationPromises[key]) {
        this.originValidationPromises[key] = _validateOrigin(auth2);
      }
      return this.originValidationPromises[key];
    }
    get _shouldInitProactively() {
      return _isMobileBrowser() || _isSafari() || _isIOS();
    }
  }
  const browserPopupRedirectResolver = BrowserPopupRedirectResolver;
  var name$3 = "@firebase/auth";
  var version$3 = "1.7.3";
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class AuthInterop {
    constructor(auth2) {
      this.auth = auth2;
      this.internalListeners = /* @__PURE__ */ new Map();
    }
    getUid() {
      var _a;
      this.assertAuthConfigured();
      return ((_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.uid) || null;
    }
    async getToken(forceRefresh) {
      this.assertAuthConfigured();
      await this.auth._initializationPromise;
      if (!this.auth.currentUser) {
        return null;
      }
      const accessToken = await this.auth.currentUser.getIdToken(forceRefresh);
      return { accessToken };
    }
    addAuthTokenListener(listener) {
      this.assertAuthConfigured();
      if (this.internalListeners.has(listener)) {
        return;
      }
      const unsubscribe = this.auth.onIdTokenChanged((user) => {
        listener((user === null || user === void 0 ? void 0 : user.stsTokenManager.accessToken) || null);
      });
      this.internalListeners.set(listener, unsubscribe);
      this.updateProactiveRefresh();
    }
    removeAuthTokenListener(listener) {
      this.assertAuthConfigured();
      const unsubscribe = this.internalListeners.get(listener);
      if (!unsubscribe) {
        return;
      }
      this.internalListeners.delete(listener);
      unsubscribe();
      this.updateProactiveRefresh();
    }
    assertAuthConfigured() {
      _assert(
        this.auth._initializationPromise,
        "dependent-sdk-initialized-before-auth"
        /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
      );
    }
    updateProactiveRefresh() {
      if (this.internalListeners.size > 0) {
        this.auth._startProactiveRefresh();
      } else {
        this.auth._stopProactiveRefresh();
      }
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function getVersionForPlatform(clientPlatform) {
    switch (clientPlatform) {
      case "Node":
        return "node";
      case "ReactNative":
        return "rn";
      case "Worker":
        return "webworker";
      case "Cordova":
        return "cordova";
      case "WebExtension":
        return "web-extension";
      default:
        return void 0;
    }
  }
  function registerAuth(clientPlatform) {
    _registerComponent(new Component(
      "auth",
      (container, { options: deps }) => {
        const app2 = container.getProvider("app").getImmediate();
        const heartbeatServiceProvider = container.getProvider("heartbeat");
        const appCheckServiceProvider = container.getProvider("app-check-internal");
        const { apiKey, authDomain } = app2.options;
        _assert(apiKey && !apiKey.includes(":"), "invalid-api-key", { appName: app2.name });
        const config = {
          apiKey,
          authDomain,
          clientPlatform,
          apiHost: "identitytoolkit.googleapis.com",
          tokenApiHost: "securetoken.googleapis.com",
          apiScheme: "https",
          sdkClientVersion: _getClientVersion(clientPlatform)
        };
        const authInstance = new AuthImpl(app2, heartbeatServiceProvider, appCheckServiceProvider, config);
        _initializeAuthInstance(authInstance, deps);
        return authInstance;
      },
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ).setInstantiationMode(
      "EXPLICIT"
      /* InstantiationMode.EXPLICIT */
    ).setInstanceCreatedCallback((container, _instanceIdentifier, _instance) => {
      const authInternalProvider = container.getProvider(
        "auth-internal"
        /* _ComponentName.AUTH_INTERNAL */
      );
      authInternalProvider.initialize();
    }));
    _registerComponent(new Component(
      "auth-internal",
      (container) => {
        const auth2 = _castAuth(container.getProvider(
          "auth"
          /* _ComponentName.AUTH */
        ).getImmediate());
        return ((auth3) => new AuthInterop(auth3))(auth2);
      },
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ).setInstantiationMode(
      "EXPLICIT"
      /* InstantiationMode.EXPLICIT */
    ));
    registerVersion(name$3, version$3, getVersionForPlatform(clientPlatform));
    registerVersion(name$3, version$3, "esm2017");
  }
  /**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const DEFAULT_ID_TOKEN_MAX_AGE = 5 * 60;
  const authIdTokenMaxAge = getExperimentalSetting("authIdTokenMaxAge") || DEFAULT_ID_TOKEN_MAX_AGE;
  let lastPostedIdToken = null;
  const mintCookieFactory = (url) => async (user) => {
    const idTokenResult = user && await user.getIdTokenResult();
    const idTokenAge = idTokenResult && ((/* @__PURE__ */ new Date()).getTime() - Date.parse(idTokenResult.issuedAtTime)) / 1e3;
    if (idTokenAge && idTokenAge > authIdTokenMaxAge) {
      return;
    }
    const idToken = idTokenResult === null || idTokenResult === void 0 ? void 0 : idTokenResult.token;
    if (lastPostedIdToken === idToken) {
      return;
    }
    lastPostedIdToken = idToken;
    await fetch(url, {
      method: idToken ? "POST" : "DELETE",
      headers: idToken ? {
        "Authorization": `Bearer ${idToken}`
      } : {}
    });
  };
  function getAuth(app2 = getApp()) {
    const provider = _getProvider(app2, "auth");
    if (provider.isInitialized()) {
      return provider.getImmediate();
    }
    const auth2 = initializeAuth(app2, {
      popupRedirectResolver: browserPopupRedirectResolver,
      persistence: [
        indexedDBLocalPersistence,
        browserLocalPersistence,
        browserSessionPersistence
      ]
    });
    const authTokenSyncPath = getExperimentalSetting("authTokenSyncURL");
    if (authTokenSyncPath && typeof isSecureContext === "boolean" && isSecureContext) {
      const authTokenSyncUrl = new URL(authTokenSyncPath, location.origin);
      if (location.origin === authTokenSyncUrl.origin) {
        const mintCookie = mintCookieFactory(authTokenSyncUrl.toString());
        beforeAuthStateChanged(auth2, mintCookie, () => mintCookie(auth2.currentUser));
        onIdTokenChanged(auth2, (user) => mintCookie(user));
      }
    }
    const authEmulatorHost = getDefaultEmulatorHost("auth");
    if (authEmulatorHost) {
      connectAuthEmulator(auth2, `http://${authEmulatorHost}`);
    }
    return auth2;
  }
  function getScriptParentElement() {
    var _a, _b;
    return (_b = (_a = document.getElementsByTagName("head")) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : document;
  }
  _setExternalJSProvider({
    loadJS(url) {
      return new Promise((resolve, reject) => {
        const el2 = document.createElement("script");
        el2.setAttribute("src", url);
        el2.onload = resolve;
        el2.onerror = (e) => {
          const error = _createError(
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          error.customData = e;
          reject(error);
        };
        el2.type = "text/javascript";
        el2.charset = "UTF-8";
        getScriptParentElement().appendChild(el2);
      });
    },
    gapiScript: "https://apis.google.com/js/api.js",
    recaptchaV2Script: "https://www.google.com/recaptcha/api.js",
    recaptchaEnterpriseScript: "https://www.google.com/recaptcha/enterprise.js?render="
  });
  registerAuth(
    "Browser"
    /* ClientPlatform.BROWSER */
  );
  var name$2 = "firebase";
  var version$2 = "10.12.1";
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  registerVersion(name$2, version$2, "app");
  const name$1 = "@firebase/installations";
  const version$1 = "0.6.7";
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const PENDING_TIMEOUT_MS = 1e4;
  const PACKAGE_VERSION = `w:${version$1}`;
  const INTERNAL_AUTH_VERSION = "FIS_v2";
  const INSTALLATIONS_API_URL = "https://firebaseinstallations.googleapis.com/v1";
  const TOKEN_EXPIRATION_BUFFER = 60 * 60 * 1e3;
  const SERVICE = "installations";
  const SERVICE_NAME = "Installations";
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const ERROR_DESCRIPTION_MAP = {
    [
      "missing-app-config-values"
      /* ErrorCode.MISSING_APP_CONFIG_VALUES */
    ]: 'Missing App configuration value: "{$valueName}"',
    [
      "not-registered"
      /* ErrorCode.NOT_REGISTERED */
    ]: "Firebase Installation is not registered.",
    [
      "installation-not-found"
      /* ErrorCode.INSTALLATION_NOT_FOUND */
    ]: "Firebase Installation not found.",
    [
      "request-failed"
      /* ErrorCode.REQUEST_FAILED */
    ]: '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
    [
      "app-offline"
      /* ErrorCode.APP_OFFLINE */
    ]: "Could not process request. Application offline.",
    [
      "delete-pending-registration"
      /* ErrorCode.DELETE_PENDING_REGISTRATION */
    ]: "Can't delete installation while there is a pending registration request."
  };
  const ERROR_FACTORY$1 = new ErrorFactory(SERVICE, SERVICE_NAME, ERROR_DESCRIPTION_MAP);
  function isServerError(error) {
    return error instanceof FirebaseError && error.code.includes(
      "request-failed"
      /* ErrorCode.REQUEST_FAILED */
    );
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function getInstallationsEndpoint({ projectId }) {
    return `${INSTALLATIONS_API_URL}/projects/${projectId}/installations`;
  }
  function extractAuthTokenInfoFromResponse(response) {
    return {
      token: response.token,
      requestStatus: 2,
      expiresIn: getExpiresInFromResponseExpiresIn(response.expiresIn),
      creationTime: Date.now()
    };
  }
  async function getErrorFromResponse(requestName, response) {
    const responseJson = await response.json();
    const errorData = responseJson.error;
    return ERROR_FACTORY$1.create("request-failed", {
      requestName,
      serverCode: errorData.code,
      serverMessage: errorData.message,
      serverStatus: errorData.status
    });
  }
  function getHeaders$1({ apiKey }) {
    return new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-goog-api-key": apiKey
    });
  }
  function getHeadersWithAuth(appConfig, { refreshToken }) {
    const headers = getHeaders$1(appConfig);
    headers.append("Authorization", getAuthorizationHeader(refreshToken));
    return headers;
  }
  async function retryIfServerError(fn) {
    const result = await fn();
    if (result.status >= 500 && result.status < 600) {
      return fn();
    }
    return result;
  }
  function getExpiresInFromResponseExpiresIn(responseExpiresIn) {
    return Number(responseExpiresIn.replace("s", "000"));
  }
  function getAuthorizationHeader(refreshToken) {
    return `${INTERNAL_AUTH_VERSION} ${refreshToken}`;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function createInstallationRequest({ appConfig, heartbeatServiceProvider }, { fid }) {
    const endpoint = getInstallationsEndpoint(appConfig);
    const headers = getHeaders$1(appConfig);
    const heartbeatService = heartbeatServiceProvider.getImmediate({
      optional: true
    });
    if (heartbeatService) {
      const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
      if (heartbeatsHeader) {
        headers.append("x-firebase-client", heartbeatsHeader);
      }
    }
    const body = {
      fid,
      authVersion: INTERNAL_AUTH_VERSION,
      appId: appConfig.appId,
      sdkVersion: PACKAGE_VERSION
    };
    const request = {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    };
    const response = await retryIfServerError(() => fetch(endpoint, request));
    if (response.ok) {
      const responseValue = await response.json();
      const registeredInstallationEntry = {
        fid: responseValue.fid || fid,
        registrationStatus: 2,
        refreshToken: responseValue.refreshToken,
        authToken: extractAuthTokenInfoFromResponse(responseValue.authToken)
      };
      return registeredInstallationEntry;
    } else {
      throw await getErrorFromResponse("Create Installation", response);
    }
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function bufferToBase64UrlSafe(array) {
    const b64 = btoa(String.fromCharCode(...array));
    return b64.replace(/\+/g, "-").replace(/\//g, "_");
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const VALID_FID_PATTERN = /^[cdef][\w-]{21}$/;
  const INVALID_FID = "";
  function generateFid() {
    try {
      const fidByteArray = new Uint8Array(17);
      const crypto = self.crypto || self.msCrypto;
      crypto.getRandomValues(fidByteArray);
      fidByteArray[0] = 112 + fidByteArray[0] % 16;
      const fid = encode(fidByteArray);
      return VALID_FID_PATTERN.test(fid) ? fid : INVALID_FID;
    } catch (_a) {
      return INVALID_FID;
    }
  }
  function encode(fidByteArray) {
    const b64String = bufferToBase64UrlSafe(fidByteArray);
    return b64String.substr(0, 22);
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function getKey(appConfig) {
    return `${appConfig.appName}!${appConfig.appId}`;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const fidChangeCallbacks = /* @__PURE__ */ new Map();
  function fidChanged(appConfig, fid) {
    const key = getKey(appConfig);
    callFidChangeCallbacks(key, fid);
    broadcastFidChange(key, fid);
  }
  function callFidChangeCallbacks(key, fid) {
    const callbacks = fidChangeCallbacks.get(key);
    if (!callbacks) {
      return;
    }
    for (const callback of callbacks) {
      callback(fid);
    }
  }
  function broadcastFidChange(key, fid) {
    const channel = getBroadcastChannel();
    if (channel) {
      channel.postMessage({ key, fid });
    }
    closeBroadcastChannel();
  }
  let broadcastChannel = null;
  function getBroadcastChannel() {
    if (!broadcastChannel && "BroadcastChannel" in self) {
      broadcastChannel = new BroadcastChannel("[Firebase] FID Change");
      broadcastChannel.onmessage = (e) => {
        callFidChangeCallbacks(e.data.key, e.data.fid);
      };
    }
    return broadcastChannel;
  }
  function closeBroadcastChannel() {
    if (fidChangeCallbacks.size === 0 && broadcastChannel) {
      broadcastChannel.close();
      broadcastChannel = null;
    }
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const DATABASE_NAME = "firebase-installations-database";
  const DATABASE_VERSION = 1;
  const OBJECT_STORE_NAME = "firebase-installations-store";
  let dbPromise = null;
  function getDbPromise() {
    if (!dbPromise) {
      dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
        upgrade: (db2, oldVersion) => {
          switch (oldVersion) {
            case 0:
              db2.createObjectStore(OBJECT_STORE_NAME);
          }
        }
      });
    }
    return dbPromise;
  }
  async function set(appConfig, value) {
    const key = getKey(appConfig);
    const db2 = await getDbPromise();
    const tx = db2.transaction(OBJECT_STORE_NAME, "readwrite");
    const objectStore = tx.objectStore(OBJECT_STORE_NAME);
    const oldValue = await objectStore.get(key);
    await objectStore.put(value, key);
    await tx.done;
    if (!oldValue || oldValue.fid !== value.fid) {
      fidChanged(appConfig, value.fid);
    }
    return value;
  }
  async function remove(appConfig) {
    const key = getKey(appConfig);
    const db2 = await getDbPromise();
    const tx = db2.transaction(OBJECT_STORE_NAME, "readwrite");
    await tx.objectStore(OBJECT_STORE_NAME).delete(key);
    await tx.done;
  }
  async function update(appConfig, updateFn) {
    const key = getKey(appConfig);
    const db2 = await getDbPromise();
    const tx = db2.transaction(OBJECT_STORE_NAME, "readwrite");
    const store = tx.objectStore(OBJECT_STORE_NAME);
    const oldValue = await store.get(key);
    const newValue = updateFn(oldValue);
    if (newValue === void 0) {
      await store.delete(key);
    } else {
      await store.put(newValue, key);
    }
    await tx.done;
    if (newValue && (!oldValue || oldValue.fid !== newValue.fid)) {
      fidChanged(appConfig, newValue.fid);
    }
    return newValue;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function getInstallationEntry(installations) {
    let registrationPromise;
    const installationEntry = await update(installations.appConfig, (oldEntry) => {
      const installationEntry2 = updateOrCreateInstallationEntry(oldEntry);
      const entryWithPromise = triggerRegistrationIfNecessary(installations, installationEntry2);
      registrationPromise = entryWithPromise.registrationPromise;
      return entryWithPromise.installationEntry;
    });
    if (installationEntry.fid === INVALID_FID) {
      return { installationEntry: await registrationPromise };
    }
    return {
      installationEntry,
      registrationPromise
    };
  }
  function updateOrCreateInstallationEntry(oldEntry) {
    const entry = oldEntry || {
      fid: generateFid(),
      registrationStatus: 0
      /* RequestStatus.NOT_STARTED */
    };
    return clearTimedOutRequest(entry);
  }
  function triggerRegistrationIfNecessary(installations, installationEntry) {
    if (installationEntry.registrationStatus === 0) {
      if (!navigator.onLine) {
        const registrationPromiseWithError = Promise.reject(ERROR_FACTORY$1.create(
          "app-offline"
          /* ErrorCode.APP_OFFLINE */
        ));
        return {
          installationEntry,
          registrationPromise: registrationPromiseWithError
        };
      }
      const inProgressEntry = {
        fid: installationEntry.fid,
        registrationStatus: 1,
        registrationTime: Date.now()
      };
      const registrationPromise = registerInstallation(installations, inProgressEntry);
      return { installationEntry: inProgressEntry, registrationPromise };
    } else if (installationEntry.registrationStatus === 1) {
      return {
        installationEntry,
        registrationPromise: waitUntilFidRegistration(installations)
      };
    } else {
      return { installationEntry };
    }
  }
  async function registerInstallation(installations, installationEntry) {
    try {
      const registeredInstallationEntry = await createInstallationRequest(installations, installationEntry);
      return set(installations.appConfig, registeredInstallationEntry);
    } catch (e) {
      if (isServerError(e) && e.customData.serverCode === 409) {
        await remove(installations.appConfig);
      } else {
        await set(installations.appConfig, {
          fid: installationEntry.fid,
          registrationStatus: 0
          /* RequestStatus.NOT_STARTED */
        });
      }
      throw e;
    }
  }
  async function waitUntilFidRegistration(installations) {
    let entry = await updateInstallationRequest(installations.appConfig);
    while (entry.registrationStatus === 1) {
      await sleep(100);
      entry = await updateInstallationRequest(installations.appConfig);
    }
    if (entry.registrationStatus === 0) {
      const { installationEntry, registrationPromise } = await getInstallationEntry(installations);
      if (registrationPromise) {
        return registrationPromise;
      } else {
        return installationEntry;
      }
    }
    return entry;
  }
  function updateInstallationRequest(appConfig) {
    return update(appConfig, (oldEntry) => {
      if (!oldEntry) {
        throw ERROR_FACTORY$1.create(
          "installation-not-found"
          /* ErrorCode.INSTALLATION_NOT_FOUND */
        );
      }
      return clearTimedOutRequest(oldEntry);
    });
  }
  function clearTimedOutRequest(entry) {
    if (hasInstallationRequestTimedOut(entry)) {
      return {
        fid: entry.fid,
        registrationStatus: 0
        /* RequestStatus.NOT_STARTED */
      };
    }
    return entry;
  }
  function hasInstallationRequestTimedOut(installationEntry) {
    return installationEntry.registrationStatus === 1 && installationEntry.registrationTime + PENDING_TIMEOUT_MS < Date.now();
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function generateAuthTokenRequest({ appConfig, heartbeatServiceProvider }, installationEntry) {
    const endpoint = getGenerateAuthTokenEndpoint(appConfig, installationEntry);
    const headers = getHeadersWithAuth(appConfig, installationEntry);
    const heartbeatService = heartbeatServiceProvider.getImmediate({
      optional: true
    });
    if (heartbeatService) {
      const heartbeatsHeader = await heartbeatService.getHeartbeatsHeader();
      if (heartbeatsHeader) {
        headers.append("x-firebase-client", heartbeatsHeader);
      }
    }
    const body = {
      installation: {
        sdkVersion: PACKAGE_VERSION,
        appId: appConfig.appId
      }
    };
    const request = {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    };
    const response = await retryIfServerError(() => fetch(endpoint, request));
    if (response.ok) {
      const responseValue = await response.json();
      const completedAuthToken = extractAuthTokenInfoFromResponse(responseValue);
      return completedAuthToken;
    } else {
      throw await getErrorFromResponse("Generate Auth Token", response);
    }
  }
  function getGenerateAuthTokenEndpoint(appConfig, { fid }) {
    return `${getInstallationsEndpoint(appConfig)}/${fid}/authTokens:generate`;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function refreshAuthToken(installations, forceRefresh = false) {
    let tokenPromise;
    const entry = await update(installations.appConfig, (oldEntry) => {
      if (!isEntryRegistered(oldEntry)) {
        throw ERROR_FACTORY$1.create(
          "not-registered"
          /* ErrorCode.NOT_REGISTERED */
        );
      }
      const oldAuthToken = oldEntry.authToken;
      if (!forceRefresh && isAuthTokenValid(oldAuthToken)) {
        return oldEntry;
      } else if (oldAuthToken.requestStatus === 1) {
        tokenPromise = waitUntilAuthTokenRequest(installations, forceRefresh);
        return oldEntry;
      } else {
        if (!navigator.onLine) {
          throw ERROR_FACTORY$1.create(
            "app-offline"
            /* ErrorCode.APP_OFFLINE */
          );
        }
        const inProgressEntry = makeAuthTokenRequestInProgressEntry(oldEntry);
        tokenPromise = fetchAuthTokenFromServer(installations, inProgressEntry);
        return inProgressEntry;
      }
    });
    const authToken = tokenPromise ? await tokenPromise : entry.authToken;
    return authToken;
  }
  async function waitUntilAuthTokenRequest(installations, forceRefresh) {
    let entry = await updateAuthTokenRequest(installations.appConfig);
    while (entry.authToken.requestStatus === 1) {
      await sleep(100);
      entry = await updateAuthTokenRequest(installations.appConfig);
    }
    const authToken = entry.authToken;
    if (authToken.requestStatus === 0) {
      return refreshAuthToken(installations, forceRefresh);
    } else {
      return authToken;
    }
  }
  function updateAuthTokenRequest(appConfig) {
    return update(appConfig, (oldEntry) => {
      if (!isEntryRegistered(oldEntry)) {
        throw ERROR_FACTORY$1.create(
          "not-registered"
          /* ErrorCode.NOT_REGISTERED */
        );
      }
      const oldAuthToken = oldEntry.authToken;
      if (hasAuthTokenRequestTimedOut(oldAuthToken)) {
        return Object.assign(Object.assign({}, oldEntry), { authToken: {
          requestStatus: 0
          /* RequestStatus.NOT_STARTED */
        } });
      }
      return oldEntry;
    });
  }
  async function fetchAuthTokenFromServer(installations, installationEntry) {
    try {
      const authToken = await generateAuthTokenRequest(installations, installationEntry);
      const updatedInstallationEntry = Object.assign(Object.assign({}, installationEntry), { authToken });
      await set(installations.appConfig, updatedInstallationEntry);
      return authToken;
    } catch (e) {
      if (isServerError(e) && (e.customData.serverCode === 401 || e.customData.serverCode === 404)) {
        await remove(installations.appConfig);
      } else {
        const updatedInstallationEntry = Object.assign(Object.assign({}, installationEntry), { authToken: {
          requestStatus: 0
          /* RequestStatus.NOT_STARTED */
        } });
        await set(installations.appConfig, updatedInstallationEntry);
      }
      throw e;
    }
  }
  function isEntryRegistered(installationEntry) {
    return installationEntry !== void 0 && installationEntry.registrationStatus === 2;
  }
  function isAuthTokenValid(authToken) {
    return authToken.requestStatus === 2 && !isAuthTokenExpired(authToken);
  }
  function isAuthTokenExpired(authToken) {
    const now = Date.now();
    return now < authToken.creationTime || authToken.creationTime + authToken.expiresIn < now + TOKEN_EXPIRATION_BUFFER;
  }
  function makeAuthTokenRequestInProgressEntry(oldEntry) {
    const inProgressAuthToken = {
      requestStatus: 1,
      requestTime: Date.now()
    };
    return Object.assign(Object.assign({}, oldEntry), { authToken: inProgressAuthToken });
  }
  function hasAuthTokenRequestTimedOut(authToken) {
    return authToken.requestStatus === 1 && authToken.requestTime + PENDING_TIMEOUT_MS < Date.now();
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function getId(installations) {
    const installationsImpl = installations;
    const { installationEntry, registrationPromise } = await getInstallationEntry(installationsImpl);
    if (registrationPromise) {
      registrationPromise.catch(console.error);
    } else {
      refreshAuthToken(installationsImpl).catch(console.error);
    }
    return installationEntry.fid;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function getToken(installations, forceRefresh = false) {
    const installationsImpl = installations;
    await completeInstallationRegistration(installationsImpl);
    const authToken = await refreshAuthToken(installationsImpl, forceRefresh);
    return authToken.token;
  }
  async function completeInstallationRegistration(installations) {
    const { registrationPromise } = await getInstallationEntry(installations);
    if (registrationPromise) {
      await registrationPromise;
    }
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function extractAppConfig(app2) {
    if (!app2 || !app2.options) {
      throw getMissingValueError("App Configuration");
    }
    if (!app2.name) {
      throw getMissingValueError("App Name");
    }
    const configKeys = [
      "projectId",
      "apiKey",
      "appId"
    ];
    for (const keyName of configKeys) {
      if (!app2.options[keyName]) {
        throw getMissingValueError(keyName);
      }
    }
    return {
      appName: app2.name,
      projectId: app2.options.projectId,
      apiKey: app2.options.apiKey,
      appId: app2.options.appId
    };
  }
  function getMissingValueError(valueName) {
    return ERROR_FACTORY$1.create("missing-app-config-values", {
      valueName
    });
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const INSTALLATIONS_NAME = "installations";
  const INSTALLATIONS_NAME_INTERNAL = "installations-internal";
  const publicFactory = (container) => {
    const app2 = container.getProvider("app").getImmediate();
    const appConfig = extractAppConfig(app2);
    const heartbeatServiceProvider = _getProvider(app2, "heartbeat");
    const installationsImpl = {
      app: app2,
      appConfig,
      heartbeatServiceProvider,
      _delete: () => Promise.resolve()
    };
    return installationsImpl;
  };
  const internalFactory = (container) => {
    const app2 = container.getProvider("app").getImmediate();
    const installations = _getProvider(app2, INSTALLATIONS_NAME).getImmediate();
    const installationsInternal = {
      getId: () => getId(installations),
      getToken: (forceRefresh) => getToken(installations, forceRefresh)
    };
    return installationsInternal;
  };
  function registerInstallations() {
    _registerComponent(new Component(
      INSTALLATIONS_NAME,
      publicFactory,
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ));
    _registerComponent(new Component(
      INSTALLATIONS_NAME_INTERNAL,
      internalFactory,
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
  }
  registerInstallations();
  registerVersion(name$1, version$1);
  registerVersion(name$1, version$1, "esm2017");
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const ANALYTICS_TYPE = "analytics";
  const GA_FID_KEY = "firebase_id";
  const ORIGIN_KEY = "origin";
  const FETCH_TIMEOUT_MILLIS = 60 * 1e3;
  const DYNAMIC_CONFIG_URL = "https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig";
  const GTAG_URL = "https://www.googletagmanager.com/gtag/js";
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const logger = new Logger("@firebase/analytics");
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const ERRORS = {
    [
      "already-exists"
      /* AnalyticsError.ALREADY_EXISTS */
    ]: "A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.",
    [
      "already-initialized"
      /* AnalyticsError.ALREADY_INITIALIZED */
    ]: "initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.",
    [
      "already-initialized-settings"
      /* AnalyticsError.ALREADY_INITIALIZED_SETTINGS */
    ]: "Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.",
    [
      "interop-component-reg-failed"
      /* AnalyticsError.INTEROP_COMPONENT_REG_FAILED */
    ]: "Firebase Analytics Interop Component failed to instantiate: {$reason}",
    [
      "invalid-analytics-context"
      /* AnalyticsError.INVALID_ANALYTICS_CONTEXT */
    ]: "Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
    [
      "indexeddb-unavailable"
      /* AnalyticsError.INDEXEDDB_UNAVAILABLE */
    ]: "IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
    [
      "fetch-throttle"
      /* AnalyticsError.FETCH_THROTTLE */
    ]: "The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.",
    [
      "config-fetch-failed"
      /* AnalyticsError.CONFIG_FETCH_FAILED */
    ]: "Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}",
    [
      "no-api-key"
      /* AnalyticsError.NO_API_KEY */
    ]: 'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',
    [
      "no-app-id"
      /* AnalyticsError.NO_APP_ID */
    ]: 'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',
    [
      "no-client-id"
      /* AnalyticsError.NO_CLIENT_ID */
    ]: 'The "client_id" field is empty.',
    [
      "invalid-gtag-resource"
      /* AnalyticsError.INVALID_GTAG_RESOURCE */
    ]: "Trusted Types detected an invalid gtag resource: {$gtagURL}."
  };
  const ERROR_FACTORY = new ErrorFactory("analytics", "Analytics", ERRORS);
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  function createGtagTrustedTypesScriptURL(url) {
    if (!url.startsWith(GTAG_URL)) {
      const err = ERROR_FACTORY.create("invalid-gtag-resource", {
        gtagURL: url
      });
      logger.warn(err.message);
      return "";
    }
    return url;
  }
  function promiseAllSettled(promises) {
    return Promise.all(promises.map((promise) => promise.catch((e) => e)));
  }
  function createTrustedTypesPolicy(policyName, policyOptions) {
    let trustedTypesPolicy;
    if (window.trustedTypes) {
      trustedTypesPolicy = window.trustedTypes.createPolicy(policyName, policyOptions);
    }
    return trustedTypesPolicy;
  }
  function insertScriptTag(dataLayerName2, measurementId) {
    const trustedTypesPolicy = createTrustedTypesPolicy("firebase-js-sdk-policy", {
      createScriptURL: createGtagTrustedTypesScriptURL
    });
    const script = document.createElement("script");
    const gtagScriptURL = `${GTAG_URL}?l=${dataLayerName2}&id=${measurementId}`;
    script.src = trustedTypesPolicy ? trustedTypesPolicy === null || trustedTypesPolicy === void 0 ? void 0 : trustedTypesPolicy.createScriptURL(gtagScriptURL) : gtagScriptURL;
    script.async = true;
    document.head.appendChild(script);
  }
  function getOrCreateDataLayer(dataLayerName2) {
    let dataLayer = [];
    if (Array.isArray(window[dataLayerName2])) {
      dataLayer = window[dataLayerName2];
    } else {
      window[dataLayerName2] = dataLayer;
    }
    return dataLayer;
  }
  async function gtagOnConfig(gtagCore, initializationPromisesMap2, dynamicConfigPromisesList2, measurementIdToAppId2, measurementId, gtagParams) {
    const correspondingAppId = measurementIdToAppId2[measurementId];
    try {
      if (correspondingAppId) {
        await initializationPromisesMap2[correspondingAppId];
      } else {
        const dynamicConfigResults = await promiseAllSettled(dynamicConfigPromisesList2);
        const foundConfig = dynamicConfigResults.find((config) => config.measurementId === measurementId);
        if (foundConfig) {
          await initializationPromisesMap2[foundConfig.appId];
        }
      }
    } catch (e) {
      logger.error(e);
    }
    gtagCore("config", measurementId, gtagParams);
  }
  async function gtagOnEvent(gtagCore, initializationPromisesMap2, dynamicConfigPromisesList2, measurementId, gtagParams) {
    try {
      let initializationPromisesToWaitFor = [];
      if (gtagParams && gtagParams["send_to"]) {
        let gaSendToList = gtagParams["send_to"];
        if (!Array.isArray(gaSendToList)) {
          gaSendToList = [gaSendToList];
        }
        const dynamicConfigResults = await promiseAllSettled(dynamicConfigPromisesList2);
        for (const sendToId of gaSendToList) {
          const foundConfig = dynamicConfigResults.find((config) => config.measurementId === sendToId);
          const initializationPromise = foundConfig && initializationPromisesMap2[foundConfig.appId];
          if (initializationPromise) {
            initializationPromisesToWaitFor.push(initializationPromise);
          } else {
            initializationPromisesToWaitFor = [];
            break;
          }
        }
      }
      if (initializationPromisesToWaitFor.length === 0) {
        initializationPromisesToWaitFor = Object.values(initializationPromisesMap2);
      }
      await Promise.all(initializationPromisesToWaitFor);
      gtagCore("event", measurementId, gtagParams || {});
    } catch (e) {
      logger.error(e);
    }
  }
  function wrapGtag(gtagCore, initializationPromisesMap2, dynamicConfigPromisesList2, measurementIdToAppId2) {
    async function gtagWrapper(command, ...args) {
      try {
        if (command === "event") {
          const [measurementId, gtagParams] = args;
          await gtagOnEvent(gtagCore, initializationPromisesMap2, dynamicConfigPromisesList2, measurementId, gtagParams);
        } else if (command === "config") {
          const [measurementId, gtagParams] = args;
          await gtagOnConfig(gtagCore, initializationPromisesMap2, dynamicConfigPromisesList2, measurementIdToAppId2, measurementId, gtagParams);
        } else if (command === "consent") {
          const [consentAction, gtagParams] = args;
          gtagCore("consent", consentAction, gtagParams);
        } else if (command === "get") {
          const [measurementId, fieldName, callback] = args;
          gtagCore("get", measurementId, fieldName, callback);
        } else if (command === "set") {
          const [customParams] = args;
          gtagCore("set", customParams);
        } else {
          gtagCore(command, ...args);
        }
      } catch (e) {
        logger.error(e);
      }
    }
    return gtagWrapper;
  }
  function wrapOrCreateGtag(initializationPromisesMap2, dynamicConfigPromisesList2, measurementIdToAppId2, dataLayerName2, gtagFunctionName) {
    let gtagCore = function(..._args) {
      window[dataLayerName2].push(arguments);
    };
    if (window[gtagFunctionName] && typeof window[gtagFunctionName] === "function") {
      gtagCore = window[gtagFunctionName];
    }
    window[gtagFunctionName] = wrapGtag(gtagCore, initializationPromisesMap2, dynamicConfigPromisesList2, measurementIdToAppId2);
    return {
      gtagCore,
      wrappedGtag: window[gtagFunctionName]
    };
  }
  function findGtagScriptOnPage(dataLayerName2) {
    const scriptTags = window.document.getElementsByTagName("script");
    for (const tag of Object.values(scriptTags)) {
      if (tag.src && tag.src.includes(GTAG_URL) && tag.src.includes(dataLayerName2)) {
        return tag;
      }
    }
    return null;
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  const LONG_RETRY_FACTOR = 30;
  const BASE_INTERVAL_MILLIS = 1e3;
  class RetryData {
    constructor(throttleMetadata = {}, intervalMillis = BASE_INTERVAL_MILLIS) {
      this.throttleMetadata = throttleMetadata;
      this.intervalMillis = intervalMillis;
    }
    getThrottleMetadata(appId) {
      return this.throttleMetadata[appId];
    }
    setThrottleMetadata(appId, metadata) {
      this.throttleMetadata[appId] = metadata;
    }
    deleteThrottleMetadata(appId) {
      delete this.throttleMetadata[appId];
    }
  }
  const defaultRetryData = new RetryData();
  function getHeaders(apiKey) {
    return new Headers({
      Accept: "application/json",
      "x-goog-api-key": apiKey
    });
  }
  async function fetchDynamicConfig(appFields) {
    var _a;
    const { appId, apiKey } = appFields;
    const request = {
      method: "GET",
      headers: getHeaders(apiKey)
    };
    const appUrl = DYNAMIC_CONFIG_URL.replace("{app-id}", appId);
    const response = await fetch(appUrl, request);
    if (response.status !== 200 && response.status !== 304) {
      let errorMessage = "";
      try {
        const jsonResponse = await response.json();
        if ((_a = jsonResponse.error) === null || _a === void 0 ? void 0 : _a.message) {
          errorMessage = jsonResponse.error.message;
        }
      } catch (_ignored) {
      }
      throw ERROR_FACTORY.create("config-fetch-failed", {
        httpStatus: response.status,
        responseMessage: errorMessage
      });
    }
    return response.json();
  }
  async function fetchDynamicConfigWithRetry(app2, retryData = defaultRetryData, timeoutMillis) {
    const { appId, apiKey, measurementId } = app2.options;
    if (!appId) {
      throw ERROR_FACTORY.create(
        "no-app-id"
        /* AnalyticsError.NO_APP_ID */
      );
    }
    if (!apiKey) {
      if (measurementId) {
        return {
          measurementId,
          appId
        };
      }
      throw ERROR_FACTORY.create(
        "no-api-key"
        /* AnalyticsError.NO_API_KEY */
      );
    }
    const throttleMetadata = retryData.getThrottleMetadata(appId) || {
      backoffCount: 0,
      throttleEndTimeMillis: Date.now()
    };
    const signal = new AnalyticsAbortSignal();
    setTimeout(async () => {
      signal.abort();
    }, FETCH_TIMEOUT_MILLIS);
    return attemptFetchDynamicConfigWithRetry({ appId, apiKey, measurementId }, throttleMetadata, signal, retryData);
  }
  async function attemptFetchDynamicConfigWithRetry(appFields, { throttleEndTimeMillis, backoffCount }, signal, retryData = defaultRetryData) {
    var _a;
    const { appId, measurementId } = appFields;
    try {
      await setAbortableTimeout(signal, throttleEndTimeMillis);
    } catch (e) {
      if (measurementId) {
        logger.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${measurementId} provided in the "measurementId" field in the local Firebase config. [${e === null || e === void 0 ? void 0 : e.message}]`);
        return { appId, measurementId };
      }
      throw e;
    }
    try {
      const response = await fetchDynamicConfig(appFields);
      retryData.deleteThrottleMetadata(appId);
      return response;
    } catch (e) {
      const error = e;
      if (!isRetriableError(error)) {
        retryData.deleteThrottleMetadata(appId);
        if (measurementId) {
          logger.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${measurementId} provided in the "measurementId" field in the local Firebase config. [${error === null || error === void 0 ? void 0 : error.message}]`);
          return { appId, measurementId };
        } else {
          throw e;
        }
      }
      const backoffMillis = Number((_a = error === null || error === void 0 ? void 0 : error.customData) === null || _a === void 0 ? void 0 : _a.httpStatus) === 503 ? calculateBackoffMillis(backoffCount, retryData.intervalMillis, LONG_RETRY_FACTOR) : calculateBackoffMillis(backoffCount, retryData.intervalMillis);
      const throttleMetadata = {
        throttleEndTimeMillis: Date.now() + backoffMillis,
        backoffCount: backoffCount + 1
      };
      retryData.setThrottleMetadata(appId, throttleMetadata);
      logger.debug(`Calling attemptFetch again in ${backoffMillis} millis`);
      return attemptFetchDynamicConfigWithRetry(appFields, throttleMetadata, signal, retryData);
    }
  }
  function setAbortableTimeout(signal, throttleEndTimeMillis) {
    return new Promise((resolve, reject) => {
      const backoffMillis = Math.max(throttleEndTimeMillis - Date.now(), 0);
      const timeout = setTimeout(resolve, backoffMillis);
      signal.addEventListener(() => {
        clearTimeout(timeout);
        reject(ERROR_FACTORY.create("fetch-throttle", {
          throttleEndTimeMillis
        }));
      });
    });
  }
  function isRetriableError(e) {
    if (!(e instanceof FirebaseError) || !e.customData) {
      return false;
    }
    const httpStatus = Number(e.customData["httpStatus"]);
    return httpStatus === 429 || httpStatus === 500 || httpStatus === 503 || httpStatus === 504;
  }
  class AnalyticsAbortSignal {
    constructor() {
      this.listeners = [];
    }
    addEventListener(listener) {
      this.listeners.push(listener);
    }
    abort() {
      this.listeners.forEach((listener) => listener());
    }
  }
  async function logEvent$1(gtagFunction, initializationPromise, eventName, eventParams, options) {
    if (options && options.global) {
      gtagFunction("event", eventName, eventParams);
      return;
    } else {
      const measurementId = await initializationPromise;
      const params = Object.assign(Object.assign({}, eventParams), { "send_to": measurementId });
      gtagFunction("event", eventName, params);
    }
  }
  /**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  async function validateIndexedDB() {
    if (!isIndexedDBAvailable()) {
      logger.warn(ERROR_FACTORY.create("indexeddb-unavailable", {
        errorInfo: "IndexedDB is not available in this environment."
      }).message);
      return false;
    } else {
      try {
        await validateIndexedDBOpenable();
      } catch (e) {
        logger.warn(ERROR_FACTORY.create("indexeddb-unavailable", {
          errorInfo: e === null || e === void 0 ? void 0 : e.toString()
        }).message);
        return false;
      }
    }
    return true;
  }
  async function _initializeAnalytics(app2, dynamicConfigPromisesList2, measurementIdToAppId2, installations, gtagCore, dataLayerName2, options) {
    var _a;
    const dynamicConfigPromise = fetchDynamicConfigWithRetry(app2);
    dynamicConfigPromise.then((config) => {
      measurementIdToAppId2[config.measurementId] = config.appId;
      if (app2.options.measurementId && config.measurementId !== app2.options.measurementId) {
        logger.warn(`The measurement ID in the local Firebase config (${app2.options.measurementId}) does not match the measurement ID fetched from the server (${config.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`);
      }
    }).catch((e) => logger.error(e));
    dynamicConfigPromisesList2.push(dynamicConfigPromise);
    const fidPromise = validateIndexedDB().then((envIsValid) => {
      if (envIsValid) {
        return installations.getId();
      } else {
        return void 0;
      }
    });
    const [dynamicConfig, fid] = await Promise.all([
      dynamicConfigPromise,
      fidPromise
    ]);
    if (!findGtagScriptOnPage(dataLayerName2)) {
      insertScriptTag(dataLayerName2, dynamicConfig.measurementId);
    }
    gtagCore("js", /* @__PURE__ */ new Date());
    const configProperties = (_a = options === null || options === void 0 ? void 0 : options.config) !== null && _a !== void 0 ? _a : {};
    configProperties[ORIGIN_KEY] = "firebase";
    configProperties.update = true;
    if (fid != null) {
      configProperties[GA_FID_KEY] = fid;
    }
    gtagCore("config", dynamicConfig.measurementId, configProperties);
    return dynamicConfig.measurementId;
  }
  /**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  class AnalyticsService {
    constructor(app2) {
      this.app = app2;
    }
    _delete() {
      delete initializationPromisesMap[this.app.options.appId];
      return Promise.resolve();
    }
  }
  let initializationPromisesMap = {};
  let dynamicConfigPromisesList = [];
  const measurementIdToAppId = {};
  let dataLayerName = "dataLayer";
  let gtagName = "gtag";
  let gtagCoreFunction;
  let wrappedGtagFunction;
  let globalInitDone = false;
  function warnOnBrowserContextMismatch() {
    const mismatchedEnvMessages = [];
    if (isBrowserExtension()) {
      mismatchedEnvMessages.push("This is a browser extension environment.");
    }
    if (!areCookiesEnabled()) {
      mismatchedEnvMessages.push("Cookies are not available.");
    }
    if (mismatchedEnvMessages.length > 0) {
      const details = mismatchedEnvMessages.map((message, index) => `(${index + 1}) ${message}`).join(" ");
      const err = ERROR_FACTORY.create("invalid-analytics-context", {
        errorInfo: details
      });
      logger.warn(err.message);
    }
  }
  function factory(app2, installations, options) {
    warnOnBrowserContextMismatch();
    const appId = app2.options.appId;
    if (!appId) {
      throw ERROR_FACTORY.create(
        "no-app-id"
        /* AnalyticsError.NO_APP_ID */
      );
    }
    if (!app2.options.apiKey) {
      if (app2.options.measurementId) {
        logger.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${app2.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);
      } else {
        throw ERROR_FACTORY.create(
          "no-api-key"
          /* AnalyticsError.NO_API_KEY */
        );
      }
    }
    if (initializationPromisesMap[appId] != null) {
      throw ERROR_FACTORY.create("already-exists", {
        id: appId
      });
    }
    if (!globalInitDone) {
      getOrCreateDataLayer(dataLayerName);
      const { wrappedGtag, gtagCore } = wrapOrCreateGtag(initializationPromisesMap, dynamicConfigPromisesList, measurementIdToAppId, dataLayerName, gtagName);
      wrappedGtagFunction = wrappedGtag;
      gtagCoreFunction = gtagCore;
      globalInitDone = true;
    }
    initializationPromisesMap[appId] = _initializeAnalytics(app2, dynamicConfigPromisesList, measurementIdToAppId, installations, gtagCoreFunction, dataLayerName, options);
    const analyticsInstance = new AnalyticsService(app2);
    return analyticsInstance;
  }
  function getAnalytics(app2 = getApp()) {
    app2 = getModularInstance(app2);
    const analyticsProvider = _getProvider(app2, ANALYTICS_TYPE);
    if (analyticsProvider.isInitialized()) {
      return analyticsProvider.getImmediate();
    }
    return initializeAnalytics(app2);
  }
  function initializeAnalytics(app2, options = {}) {
    const analyticsProvider = _getProvider(app2, ANALYTICS_TYPE);
    if (analyticsProvider.isInitialized()) {
      const existingInstance = analyticsProvider.getImmediate();
      if (deepEqual(options, analyticsProvider.getOptions())) {
        return existingInstance;
      } else {
        throw ERROR_FACTORY.create(
          "already-initialized"
          /* AnalyticsError.ALREADY_INITIALIZED */
        );
      }
    }
    const analyticsInstance = analyticsProvider.initialize({ options });
    return analyticsInstance;
  }
  function logEvent(analyticsInstance, eventName, eventParams, options) {
    analyticsInstance = getModularInstance(analyticsInstance);
    logEvent$1(wrappedGtagFunction, initializationPromisesMap[analyticsInstance.app.options.appId], eventName, eventParams, options).catch((e) => logger.error(e));
  }
  const name = "@firebase/analytics";
  const version = "0.10.4";
  function registerAnalytics() {
    _registerComponent(new Component(
      ANALYTICS_TYPE,
      (container, { options: analyticsOptions }) => {
        const app2 = container.getProvider("app").getImmediate();
        const installations = container.getProvider("installations-internal").getImmediate();
        return factory(app2, installations, analyticsOptions);
      },
      "PUBLIC"
      /* ComponentType.PUBLIC */
    ));
    _registerComponent(new Component(
      "analytics-internal",
      internalFactory2,
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    registerVersion(name, version);
    registerVersion(name, version, "esm2017");
    function internalFactory2(container) {
      try {
        const analytics = container.getProvider(ANALYTICS_TYPE).getImmediate();
        return {
          logEvent: (eventName, eventParams, options) => logEvent(analytics, eventName, eventParams, options)
        };
      } catch (e) {
        throw ERROR_FACTORY.create("interop-component-reg-failed", {
          reason: e
        });
      }
    }
  }
  registerAnalytics();
  const firebaseConfig = {
    apiKey: "AIzaSyDLmZlIIPpk2S_DsUx9kjfxpNdP98G_8AE",
    authDomain: "tw2tools-9efad.firebaseapp.com",
    projectId: "tw2tools-9efad",
    storageBucket: "tw2tools-9efad.appspot.com",
    messagingSenderId: "257365092259",
    appId: "1:257365092259:web:0ccaab20f1465445c15c16",
    measurementId: "G-FVK2H1NDBV"
  };
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
  const auth = getAuth(app);
  const initialState = {
    user: null,
    loading: true,
    error: null
  };
  const AuthStateContext = reactExports.createContext(void 0);
  const AuthDispatchContext = reactExports.createContext(
    void 0
  );
  const authReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN_SUCCESS":
        return { ...state, user: action.payload, loading: false };
      case "LOGOUT":
        return { ...state, user: null, loading: false };
      case "SET_LOADING":
        return { ...state, loading: true };
      case "SET_ERROR":
        return { ...state, error: action.payload, loading: false };
      default:
        return state;
    }
  };
  const AuthProvider = ({
    children
  }) => {
    const [state, dispatch] = reactExports.useReducer(authReducer, initialState);
    reactExports.useEffect(() => {
      setPersistence(auth, browserLocalPersistence).then(() => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
          } else {
            dispatch({ type: "LOGOUT" });
          }
        });
      }).catch((error) => {
        dispatch({ type: "SET_ERROR", payload: error.message });
      });
    }, []);
    return /* @__PURE__ */ React.createElement(AuthStateContext.Provider, { value: state }, /* @__PURE__ */ React.createElement(AuthDispatchContext.Provider, { value: dispatch }, children));
  };
  const useAuthState = () => {
    const context = reactExports.useContext(AuthStateContext);
    if (context === void 0) {
      throw new Error("useAuthState must be used within an AuthProvider");
    }
    return context;
  };
  const useAuthDispatch = () => {
    const context = reactExports.useContext(AuthDispatchContext);
    if (context === void 0) {
      throw new Error("useAuthDispatch must be used within an AuthProvider");
    }
    return context;
  };
  const useFirebaseAuth = () => {
    const dispatch = useAuthDispatch();
    const [user, setUser] = reactExports.useState(null);
    const [error, setError] = reactExports.useState(null);
    const [isLoading, setIsLoading] = reactExports.useState(false);
    const login = async (email, password) => {
      setIsLoading(true);
      setError(null);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        dispatch({ type: "LOGIN_SUCCESS", payload: userCredential.user });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        dispatch({ type: "SET_ERROR", payload: error });
      } finally {
        setIsLoading(false);
      }
    };
    reactExports.useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user2) => {
        if (user2) {
          setUser(user2);
          dispatch({ type: "LOGIN_SUCCESS", payload: user2 });
        } else {
          setUser(null);
        }
      });
      return () => unsubscribe();
    }, [dispatch]);
    return { user, error, isLoading, login };
  };
  function LoginForm({ setCurrentPage }) {
    const [email, setEmail] = reactExports.useState("");
    const [password, setPassword] = reactExports.useState("");
    const [errors, setErrors] = reactExports.useState({ email: "", password: "" });
    const { user, error, login, isLoading } = useFirebaseAuth();
    const handleSubmit = async (e) => {
      e.preventDefault();
      setErrors({ email: "", password: "" });
      if (!email) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Email é obrigatório" }));
      }
      if (!password) {
        setErrors((prevErrors) => ({ ...prevErrors, password: "Senha é obrigatória" }));
      }
      if (email && password) {
        await login(email, password);
        if (error) {
          showToastError(error);
        } else {
          showToastSuccess("Logado com sucesso");
          setCurrentPage("home");
        }
      }
    };
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
    return /* @__PURE__ */ React.createElement("form", { className: "tw-flex tw-flex-col tw-gap-4", onSubmit: handleSubmit }, /* @__PURE__ */ React.createElement("label", { className: "tw-input tw-input-bordered tw-flex tw-items-center tw-gap-2" }, /* @__PURE__ */ React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor",
        className: "tw-w-4 tw-h-4 tw-opacity-70"
      },
      /* @__PURE__ */ React.createElement("path", { d: "M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" }),
      /* @__PURE__ */ React.createElement("path", { d: "M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" })
    ), /* @__PURE__ */ React.createElement(
      Input,
      {
        type: "email",
        className: "tw-grow !tw-bg-none tw-border-hidden",
        placeholder: "Email",
        value: email,
        onChange: handleEmailChange
      }
    )), errors.email && /* @__PURE__ */ React.createElement("p", { className: "tw-text-red-500" }, errors.email), /* @__PURE__ */ React.createElement("label", { className: "tw-input tw-input-bordered tw-flex tw-items-center tw-gap-2" }, /* @__PURE__ */ React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 16 16",
        fill: "currentColor",
        className: "tw-w-4 tw-h-4 tw-opacity-70"
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          fillRule: "evenodd",
          d: "M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z",
          clipRule: "evenodd"
        }
      )
    ), /* @__PURE__ */ React.createElement(
      Input,
      {
        type: "password",
        className: "tw-grow !tw-bg-none tw-border-hidden",
        placeholder: "Password",
        value: password,
        onChange: handlePasswordChange
      }
    )), errors.password && /* @__PURE__ */ React.createElement("p", { className: "tw-text-red-500" }, errors.password), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "tw-btn tw-btn-active tw-btn-neutral", disabled: isLoading }, isLoading ? "Logando..." : "Login"), error && /* @__PURE__ */ React.createElement("p", { className: "tw-text-red-500" }, error));
  }
  function Login({ setCurrentPage }) {
    return /* @__PURE__ */ React.createElement("div", { className: "tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center" }, /* @__PURE__ */ React.createElement(LoginForm, { setCurrentPage }));
  }
  var DefaultContext = {
    color: void 0,
    size: void 0,
    className: void 0,
    style: void 0,
    attr: void 0
  };
  var IconContext = React.createContext && /* @__PURE__ */ React.createContext(DefaultContext);
  var _excluded = ["attr", "size", "title"];
  function _objectWithoutProperties(source, excluded) {
    if (source == null)
      return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
          continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (excluded.indexOf(key) >= 0)
          continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function ownKeys(e, r2) {
    var t2 = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r2 && (o = o.filter(function(r3) {
        return Object.getOwnPropertyDescriptor(e, r3).enumerable;
      })), t2.push.apply(t2, o);
    }
    return t2;
  }
  function _objectSpread(e) {
    for (var r2 = 1; r2 < arguments.length; r2++) {
      var t2 = null != arguments[r2] ? arguments[r2] : {};
      r2 % 2 ? ownKeys(Object(t2), true).forEach(function(r3) {
        _defineProperty(e, r3, t2[r3]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r3) {
        Object.defineProperty(e, r3, Object.getOwnPropertyDescriptor(t2, r3));
      });
    }
    return e;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPropertyKey(t2) {
    var i = _toPrimitive(t2, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _toPrimitive(t2, r2) {
    if ("object" != typeof t2 || !t2)
      return t2;
    var e = t2[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t2, r2 || "default");
      if ("object" != typeof i)
        return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r2 ? String : Number)(t2);
  }
  function Tree2Element(tree) {
    return tree && tree.map((node, i) => /* @__PURE__ */ React.createElement(node.tag, _objectSpread({
      key: i
    }, node.attr), Tree2Element(node.child)));
  }
  function GenIcon(data) {
    return (props) => /* @__PURE__ */ React.createElement(IconBase, _extends({
      attr: _objectSpread({}, data.attr)
    }, props), Tree2Element(data.child));
  }
  function IconBase(props) {
    var elem = (conf) => {
      var {
        attr,
        size,
        title
      } = props, svgProps = _objectWithoutProperties(props, _excluded);
      var computedSize = size || conf.size || "1em";
      var className;
      if (conf.className)
        className = conf.className;
      if (props.className)
        className = (className ? className + " " : "") + props.className;
      return /* @__PURE__ */ React.createElement("svg", _extends({
        stroke: "currentColor",
        fill: "currentColor",
        strokeWidth: "0"
      }, conf.attr, attr, svgProps, {
        className,
        style: _objectSpread(_objectSpread({
          color: props.color || conf.color
        }, conf.style), props.style),
        height: computedSize,
        width: computedSize,
        xmlns: "http://www.w3.org/2000/svg"
      }), title && /* @__PURE__ */ React.createElement("title", null, title), props.children);
    };
    return IconContext !== void 0 ? /* @__PURE__ */ React.createElement(IconContext.Consumer, null, (conf) => elem(conf)) : elem(DefaultContext);
  }
  function FaBomb(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M440.5 88.5l-52 52L415 167c9.4 9.4 9.4 24.6 0 33.9l-17.4 17.4c11.8 26.1 18.4 55.1 18.4 85.6 0 114.9-93.1 208-208 208S0 418.9 0 304 93.1 96 208 96c30.5 0 59.5 6.6 85.6 18.4L311 97c9.4-9.4 24.6-9.4 33.9 0l26.5 26.5 52-52 17.1 17zM500 60h-24c-6.6 0-12 5.4-12 12s5.4 12 12 12h24c6.6 0 12-5.4 12-12s-5.4-12-12-12zM440 0c-6.6 0-12 5.4-12 12v24c0 6.6 5.4 12 12 12s12-5.4 12-12V12c0-6.6-5.4-12-12-12zm33.9 55l17-17c4.7-4.7 4.7-12.3 0-17-4.7-4.7-12.3-4.7-17 0l-17 17c-4.7 4.7-4.7 12.3 0 17 4.8 4.7 12.4 4.7 17 0zm-67.8 0c4.7 4.7 12.3 4.7 17 0 4.7-4.7 4.7-12.3 0-17l-17-17c-4.7-4.7-12.3-4.7-17 0-4.7 4.7-4.7 12.3 0 17l17 17zm67.8 34c-4.7-4.7-12.3-4.7-17 0-4.7 4.7-4.7 12.3 0 17l17 17c4.7 4.7 12.3 4.7 17 0 4.7-4.7 4.7-12.3 0-17l-17-17zM112 272c0-35.3 28.7-64 64-64 8.8 0 16-7.2 16-16s-7.2-16-16-16c-52.9 0-96 43.1-96 96 0 8.8 7.2 16 16 16s16-7.2 16-16z" }, "child": [] }] })(props);
  }
  function FaHammer(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 576 512" }, "child": [{ "tag": "path", "attr": { "d": "M571.31 193.94l-22.63-22.63c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31-28.9-28.9c5.63-21.31.36-44.9-16.35-61.61l-45.25-45.25c-62.48-62.48-163.79-62.48-226.28 0l90.51 45.25v18.75c0 16.97 6.74 33.25 18.75 45.25l49.14 49.14c16.71 16.71 40.3 21.98 61.61 16.35l28.9 28.9-11.31 11.31c-6.25 6.25-6.25 16.38 0 22.63l22.63 22.63c6.25 6.25 16.38 6.25 22.63 0l90.51-90.51c6.23-6.24 6.23-16.37-.02-22.62zm-286.72-15.2c-3.7-3.7-6.84-7.79-9.85-11.95L19.64 404.96c-25.57 23.88-26.26 64.19-1.53 88.93s65.05 24.05 88.93-1.53l238.13-255.07c-3.96-2.91-7.9-5.87-11.44-9.41l-49.14-49.14z" }, "child": [] }] })(props);
  }
  function FaHorseHead(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M509.8 332.5l-69.9-164.3c-14.9-41.2-50.4-71-93-79.2 18-10.6 46.3-35.9 34.2-82.3-1.3-5-7.1-7.9-12-6.1L166.9 76.3C35.9 123.4 0 238.9 0 398.8V480c0 17.7 14.3 32 32 32h236.2c23.8 0 39.3-25 28.6-46.3L256 384v-.7c-45.6-3.5-84.6-30.7-104.3-69.6-1.6-3.1-.9-6.9 1.6-9.3l12.1-12.1c3.9-3.9 10.6-2.7 12.9 2.4 14.8 33.7 48.2 57.4 87.4 57.4 17.2 0 33-5.1 46.8-13.2l46 63.9c6 8.4 15.7 13.3 26 13.3h50.3c8.5 0 16.6-3.4 22.6-9.4l45.3-39.8c8.9-9.1 11.7-22.6 7.1-34.4zM328 224c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24z" }, "child": [] }] })(props);
  }
  function FaShieldAlt(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256.1 446.3l-.1-381 175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7z" }, "child": [] }] })(props);
  }
  function GiBarbarian(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M197.584 23.28c-18.284.166-34.4 4.378-48.488 12.285C120.92 51.38 102.008 80.7 87.62 117.445c-.637 1.623-1.254 3.282-1.874 4.936a433.13 433.13 0 0 0 16.73 6.654c.628-1.69 1.26-3.378 1.905-5.028 13.612-34.757 30.7-59.935 53.524-72.746 11.413-6.405 24.546-10.037 40.137-10.136 15.592-.1 33.64 3.335 54.884 11.06L256 53.3l3.076-1.116c42.486-15.45 72.195-13.735 95.02-.924 22.824 12.81 39.912 37.99 53.523 72.746.645 1.65 1.276 3.338 1.905 5.028a433.14 433.14 0 0 0 16.73-6.653c-.62-1.653-1.238-3.312-1.874-4.936-14.388-36.743-33.3-66.065-61.476-81.88C335.38 20.117 300.046 18.895 256 34.27c-21.502-7.506-40.977-11.15-58.416-10.99zm-16.145 85.35c-4.77 5.446-9.19 11.48-13.268 18.068-3.655 5.905-7 12.262-10.037 19.01l.16.035c.235-.005.47-.018.705-.018a32.61 32.61 0 0 1 13.77 3.05 439.41 439.41 0 0 0 49.494 6.62c-15.17-15.56-29.05-32.14-40.825-46.764zm157.474 10.652c-9.547 9.597-17.313 20.762-23.076 33.34a438.226 438.226 0 0 0 23.387-3.846 32.61 32.61 0 0 1 13.775-3.05c.236 0 .47.012.705.017l.16-.035c-3.036-6.748-6.382-13.105-10.037-19.01a147.53 147.53 0 0 0-4.914-7.416zM37.727 138.725l22.34 22.34 7.445-22.34zm406.76 0l7.447 22.34 22.34-22.34zM85.526 141.61l-10.187 30.564c17.367 6.233 34.72 11.564 52.062 16.002-.906-3-1.4-6.17-1.4-9.45 0-7.88 2.816-15.144 7.486-20.84a453.046 453.046 0 0 1-47.96-16.276zm340.95 0a452.977 452.977 0 0 1-47.967 16.267c4.673 5.7 7.492 12.966 7.492 20.848 0 3.276-.492 6.444-1.396 9.44a579.07 579.07 0 0 0 52.058-15.99zM159 163.725c-8.39 0-15 6.61-15 15s6.61 15 15 15 15-6.61 15-15-6.61-15-15-15zm194 0c-8.39 0-15 6.61-15 15s6.61 15 15 15 15-6.61 15-15-6.61-15-15-15zm-31.78 6.184a454.296 454.296 0 0 1-12.21 1.585c-2.643 9.64-4.27 19.926-4.8 30.808a509.808 509.808 0 0 0 23.265-2.752c-4.663-5.694-7.475-12.953-7.475-20.825 0-3.05.43-6.005 1.22-8.816zm-130.433.014a32.614 32.614 0 0 1 1.213 8.8c0 7.875-2.813 15.136-7.48 20.83a510.61 510.61 0 0 0 34.617 3.73c.32-6.48-3.405-30.475-3.405-30.475a456.76 456.76 0 0 1-24.945-2.886zm51.604 4.64l-8.644 6.897 13.88 83.265h16.75L275.4 198.57c-11.192-6.3-22.285-14.618-33.01-24.007zM66.28 188.16c-15.22 63.397-26.077 137.993-43.05 211.542l-1.8 7.804 7.543 2.696a14845.52 14845.52 0 0 0 43.41 15.453 417.662 417.662 0 0 1 12.77-4.47c5.114-1.703 10.176-3.32 15.11-4.903-17.488-6.054-36.565-12.83-57.777-20.403C58.5 324.755 69.37 253.65 83.47 194.134a613.683 613.683 0 0 1-17.19-5.974zm379.44 0a613.688 613.688 0 0 1-17.19 5.975c14.1 59.517 24.97 130.62 40.984 201.744-21.212 7.57-40.29 14.348-57.776 20.402 4.933 1.582 9.995 3.2 15.108 4.904a417.657 417.657 0 0 1 12.77 4.47c13.545-4.79 27.904-9.916 43.41-15.454l7.544-2.696-1.8-7.804c-16.973-73.55-27.83-148.145-43.05-211.54zm-305.408 21.694c-2.188 15.23-3.312 31.277-3.312 47.87 0 48 .646 86.742 14.814 111.536 7.085 12.397 17.22 21.812 33.647 28.657 16.428 6.844 39.29 10.808 70.54 10.808 31.25 0 54.112-3.964 70.54-10.808 16.426-6.845 26.56-16.26 33.646-28.657C374.354 344.466 375 305.725 375 257.725c0-16.594-1.124-32.64-3.313-47.87-27.274 6.046-54.568 9.943-81.87 11.71l-2.413 14.484c21.605 2.345 46.537-6.993 77.395-18.737l6.4 16.824c-7.816 2.975-15.448 5.92-22.948 8.63 4.365 3.607 7.7 8.663 7.7 14.958 0 8.2-5.652 14.307-11.88 17.834-6.228 3.526-13.82 5.31-22.095 5.31-8.275 0-15.868-1.784-22.096-5.31-6.227-3.528-11.88-9.635-11.88-17.835 0-1.182.13-2.316.35-3.41a79.073 79.073 0 0 1-3.92-.416l-4.805 28.825h-47.25L227.57 253.9c-1.305.168-2.612.31-3.92.415.22 1.094.35 2.228.35 3.41 0 8.2-5.653 14.307-11.88 17.834-6.23 3.526-13.822 5.31-22.097 5.31-8.274 0-15.867-1.784-22.095-5.31-6.228-3.528-11.88-9.635-11.88-17.835 0-6.295 3.335-11.35 7.7-14.96-7.5-2.707-15.132-5.653-22.95-8.628l6.403-16.824c30.86 11.744 55.79 21.082 77.396 18.736l-2.414-14.485c-27.3-1.767-54.595-5.664-81.87-11.71zm-36.177 6.512c-.22.01-.53.215-.754.254-9.218 30.762-5.474 47.118.24 66.853l15.38 7.69v-62.618c-4.425-6.463-8.398-9.97-11.084-11.224-1.486-.692-2.616-1.015-3.78-.954zm303.73 0c-1.165-.06-2.295.262-3.78.955-2.687 1.254-6.66 4.762-11.085 11.225v62.618l15.38-7.69c5.715-19.735 9.458-36.09.24-66.853-.226-.04-.535-.243-.755-.254zM190.023 252.58c-5.52 0-10.413 1.38-13.224 2.973-2.023 1.145-2.54 1.945-2.68 2.172.14.227.657 1.027 2.68 2.172 2.81 1.592 7.704 2.973 13.223 2.973 5.52 0 10.415-1.38 13.227-2.973 2.022-1.145 2.538-1.945 2.68-2.172-.142-.227-.658-1.027-2.68-2.172-2.812-1.592-7.707-2.972-13.227-2.972zm15.907 5.145c.055.09.07.11.07 0s-.015-.09-.07 0zm-31.81 0c-.056-.09-.07-.11-.07 0s.014.09.07 0zm147.857-5.144c-5.52 0-10.415 1.38-13.227 2.973-2.022 1.145-2.538 1.945-2.68 2.172.142.227.658 1.027 2.68 2.172 2.812 1.592 7.707 2.973 13.227 2.973 5.52 0 10.413-1.38 13.224-2.973 2.023-1.145 2.54-1.945 2.68-2.172-.14-.227-.657-1.027-2.68-2.172-2.81-1.592-7.704-2.972-13.223-2.972zm15.904 5.145c.056.09.07.11.07 0s-.014-.09-.07 0zm-31.81 0c-.055-.09-.07-.11-.07 0s.015.09.07 0zm-91.07 32h18s.124 6.12 3.05 11.975c2.927 5.853 6.95 11.025 19.95 11.025s17.023-5.172 19.95-11.025c2.926-5.854 3.05-11.975 3.05-11.975h18s.124 9.88-4.95 20.026c-5.073 10.147-17.05 20.975-36.05 20.975-19 0-30.977-10.828-36.05-20.974-5.074-10.146-4.95-20.025-4.95-20.025zm41 53.178c21.138 0 42.276 4.093 66.846 12.283l-5.692 17.078c-46.86-15.62-75.447-15.62-122.308 0l-5.692-17.078c24.57-8.19 45.708-12.283 66.846-12.283zm-94.244 62.674a30.333 30.333 0 0 1-1.297 1.53c-5.123 5.61-11.71 9.69-19.056 13.228-14.692 7.073-32.843 12.024-50.558 17.93-17.716 5.904-34.85 12.754-46.82 22.064-9.73 7.565-16.135 16.173-18.22 28.395H173.81c12.59-6.51 23.538-11.936 30.553-17.66 7.39-6.03 10.754-11.19 10.635-21.232l18-.215c.18 15.237-7.198 27.185-17.256 35.392a81.47 81.47 0 0 1-4.953 3.715h90.42a81.47 81.47 0 0 1-4.954-3.715c-10.058-8.207-17.436-20.155-17.256-35.392l18 .215c-.12 10.042 3.246 15.203 10.635 21.232 7.015 5.724 17.962 11.15 30.553 17.66h148.007c-2.086-12.222-8.492-20.83-18.22-28.396-11.97-9.31-29.105-16.16-46.82-22.066-17.716-5.905-35.867-10.856-50.56-17.93-7.345-3.536-13.932-7.618-19.054-13.228-.45-.493-.878-1.006-1.296-1.53-5.047 3.394-10.633 6.395-16.783 8.958-19.572 8.155-44.71 12.19-77.46 12.19-32.75 0-57.888-4.035-77.46-12.19-6.15-2.563-11.737-5.564-16.784-8.957z" }, "child": [] }] })(props);
  }
  function GiBattleAxe(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M240.094 19.594c-56.69.364-110.882 29.054-151.594 72.344-53.428 56.81-81.948 137.907-61.03 210.093 16.33-8.797 32.757-15.987 48.936-21.374-6.327-123.16 89.247-210.922 200.03-210.344 4.255-13.365 10.268-27.308 18.127-41.874-16.323-5.43-32.736-8.36-48.97-8.782-1.833-.047-3.67-.074-5.5-.062zM271.28 88.97C173.724 90.715 91.367 166.07 94.907 275.28c10.986-2.73 21.788-4.582 32.28-5.436 14.59-1.187 28.69-.463 41.783 2.437L278.312 162.94c-5.26-12.1-8.473-25.024-9.344-38.75-.716-11.256.14-22.983 2.592-35.22-.093.002-.187 0-.28 0zm60.845 60.718l-16.875 16.875L345.75 197l16.813-16.813-30.438-30.5zm-37.125 23L175.625 292.063l44.625 44.562 119.313-119.313L295 172.688zm189.875 46.093c-14.466 7.808-28.318 13.807-41.594 18.064.75 111.013-87.243 206.8-210.686 200.28-5.39 16.104-12.552 32.462-21.313 48.72 72.19 20.922 153.313-7.6 210.126-61.03 57.045-53.65 88.516-130.72 63.47-206.033zm-136 15.657L240.687 342.625c3.23 13.563 4.086 28.245 2.844 43.47-.862 10.58-2.752 21.476-5.53 32.56 109.585 3.718 185.128-79.008 186.594-176.905-12.342 2.506-24.16 3.403-35.5 2.688-14.287-.9-27.698-4.347-40.22-10zM169.5 312.313L20.094 461.72V494H48.75l151.188-151.188-30.438-30.5z" }, "child": [] }] })(props);
  }
  function GiCatapult(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M197.746 30.38l-9.898 30.905-40.485 18.194-28.79 28.055 30.855 35.512 47.486-4.596 36.06 8.35 30.83-33.52-4.263-56.7-61.794-26.2zM25.902 133.32c-13.472 25.957-6.665 67.412 30.356 96.746 37.04 29.35 78.807 26.396 100.855 7.223L25.903 133.32zm359.174 68.99l-34.152 11.38 7.217 21.65-227.6 147.94c12.527 4.355 23.416 12.25 31.466 22.484L369.904 270.63l36.303 108.913c16.727.414 31.995 6.866 43.7 17.264l-64.83-194.498zM171.484 248.67c-9.358 9.058-21.296 15.425-34.656 18.715l63.496 49.064L232.3 295.67l-60.816-46.996zM292.66 342.31l-31.976 20.784L317.504 407h32.183c3.296-4.39 7.104-8.377 11.336-11.865L292.66 342.31zM108.166 397.5c-27.997 0-50.5 22.503-50.5 50.5s22.503 50.5 50.5 50.5 50.5-22.503 50.5-50.5-22.503-50.5-50.5-50.5zm296.334 0c-27.997 0-50.5 22.503-50.5 50.5s22.503 50.5 50.5 50.5S455 475.997 455 448s-22.503-50.5-50.5-50.5zM25 425v46h18.66c-2.58-7.196-3.994-14.937-3.994-23s1.415-15.804 3.994-23H25zm147.672 0c2.58 7.196 3.994 14.937 3.994 23s-1.415 15.804-3.994 23h167.322c-2.58-7.196-3.994-14.937-3.994-23s1.415-15.804 3.994-23H172.672zm296.334 0c2.58 7.196 3.994 14.937 3.994 23s-1.415 15.804-3.994 23H487v-46h-17.994zm-360.84 3.166A19.833 19.833 0 0 1 128 448a19.833 19.833 0 0 1-19.834 19.834A19.833 19.833 0 0 1 88.334 448a19.833 19.833 0 0 1 19.832-19.834zm296.334 0A19.833 19.833 0 0 1 424.334 448a19.833 19.833 0 0 1-19.834 19.834A19.833 19.833 0 0 1 384.666 448a19.833 19.833 0 0 1 19.834-19.834z" }, "child": [] }] })(props);
  }
  function GiLightningBow(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M19.97 17.375l47.436 75 8.47 13.688.03-.25L220.22 334l3.405-78.28 105.313 151.374 2.437-68.906 14.5 14.062 1.156 1.125 144.94 142.25-156.564-303.78-2.156 69.436-123.813-123.905-2.093 46.375L19.97 17.375zm446.5 1.53c-.523.005-1.063.03-1.595.064-6.066.372-12.796 2.708-19.906 7.75 6.678 2.253 13.083 5.75 18.842 9.936 10.075 7.32 18.823 17.062 23.594 28.282 10.19-16.118 6.488-29.96-1.75-38.157-4.738-4.713-11.36-7.923-19.187-7.874zM404.343 42.72L93.5 57.843l20.063 17.718L392.188 62c3.458-6.438 7.497-12.875 12.156-19.28zm23.78.093c-4.272 4.88-8.057 9.782-11.437 14.687 10.62 1.142 21.087 5.93 30 12.406 7.493 5.444 14.226 12.253 19.157 20 2.04-2.538 4.277-5.13 6.72-7.78-.48-9.738-8.59-22.29-19.72-30.376-8.186-5.947-17.27-9.09-24.72-8.938zm-16.28 33.25c-.486-.007-.965.01-1.438.03-1.798.08-3.505.395-5.062.876-16.464 34.053-16.13 67.398-17.25 95.03-.802 19.795-2.35 38.88-11.313 60.5l32 62.063c28.516-44.8 34.895-84.874 36.158-116 .877-21.643-.462-37.142 2.937-53.063 1.24-5.805 3.186-11.478 6.03-17.25-2.88-8.178-9.632-17.003-18.186-23.22-7.877-5.72-16.587-8.872-23.876-8.968zm-355 34.78L37.25 408.782c6.493-5.112 13.034-9.608 19.594-13.592L73.78 138.125l-16.936-27.28zm210.28 239.72c-31.528 18.55-59.427 23.91-88.437 28.28-28.43 4.283-59.555 7.39-90.875 21.094 7.244 4.844 13.495 11.588 18.407 19 6.118 9.236 10.55 19.92 11.843 30.75 3.73-1.565 7.482-2.922 11.28-4.093 18.75-5.782 38.11-7.495 62.22-11.125 31.644-4.766 68.924-12.73 109.375-36.314l-33.813-47.594zM66.25 411.219c-4.684 2.874-9.374 6.05-14.03 9.56 10.655 4.543 19.69 13.353 26.31 23.345 4.65 7.016 8.307 14.86 10.376 22.97 3.522-2.782 7.013-5.28 10.5-7.533.803-9.013-2.417-20.723-8.75-30.28-6.76-10.204-16.203-17.014-24.406-18.063zm-30.906 23.905c-1.157 1.104-2.316 2.222-3.47 3.375-18.448 18.448-14.666 35.774-4.186 46.156 10.098 10.005 26.772 13.74 44.218-2.25.107-8.647-3.138-19.216-8.937-27.97-7.648-11.54-18.73-18.76-27.564-18.186l-.062-1.125z" }, "child": [] }] })(props);
  }
  function GiLoad(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M64 48c-8.726 0-16 7.274-16 16v384c0 8.726 7.274 16 16 16h236.25l-16-16H64V64h63.375v97.53c0 3.924 3.443 7.095 7.72 7.095h169.81c4.277 0 7.72-3.17 7.72-7.094V64h69.22c.428.318.8.548 1.467 1.094 2.05 1.675 4.962 4.264 8.375 7.406 6.827 6.283 15.65 14.837 24.313 23.5 8.663 8.663 17.217 17.486 23.5 24.313 3.142 3.413 5.73 6.324 7.406 8.374.546.668.776 1.04 1.094 1.47V366h16V128c0-2.68-.657-3.402-1.03-4.156-.375-.754-.725-1.294-1.095-1.844-.74-1.1-1.575-2.19-2.594-3.438-2.036-2.492-4.768-5.55-8.03-9.093-6.524-7.09-15.155-16-23.938-24.782-8.782-8.783-17.692-17.414-24.78-23.938-3.545-3.262-6.6-5.994-9.094-8.03-1.247-1.02-2.337-1.855-3.438-2.595-.55-.37-1.09-.72-1.844-1.094-.754-.373-1.477-1.03-4.156-1.03H64zm87.72 16h48.56c4.277 0 7.72 4.425 7.72 9.938v70.124c0 5.513-3.443 9.938-7.72 9.938h-48.56c-4.277 0-7.72-4.425-7.72-9.938V73.938c0-5.512 3.443-9.937 7.72-9.937zM114 212c-4.432 0-8 3.568-8 8v184c0 4.432 3.568 8 8 8h134.25l-30.625-30.625L202.28 366H279V238h127v-18c0-4.432-3.568-8-8-8H114zm183 44v128h-51.25L352 490.25 458.25 384H407V256H297zm167 147.75l-16 16V448h-28.25l-16 16H448c8.726 0 16-7.274 16-16v-44.25z" }, "child": [] }] })(props);
  }
  function GiPocketBow(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M77.85 11.848l9.535 70.648-69.418-11.174 41.508 56.07-11.127 322.715c-11.712 13.235-20.716 28.85-25.823 47.914 74.198-55.834 152.88-71.602 223.606-101.383l-35.913-35.914c-53.122 25.232-105.774 42.49-142.547 71.347l9.674-280.54 8.06 10.888 2.2 4.47h71.304L358.723 394.03c15.618-13.627 29.605-28.41 42.66-44.645l-229.877-193.78V84.226l-11.86-9.165 273.594-10.66c-29.99 36.36-46.84 89.07-71.39 142.416l36.558 36.56c29.22-70.24 45.014-148.09 100.262-221.507-18.54 4.97-33.69 13.015-46.604 23.603l-.02-.506-315.437 12.29-58.76-45.41zm24.613 42.638l50.355 38.916v54.795H99.236l-.607-.146-38.357-50.988 49 7.89-6.81-50.466zm248.103 167.48c-8.162 13.275-17.044 25.835-26.586 37.727l30.727 25.903c11.16-8.75 22.568-17.176 34.06-25.432l-38.2-38.2zm100.006 89.74C414.826 368.52 375.184 412.43 315.88 447.67c59.143 20.683 118.488 37.302 178.8 43.98-8.706-60.66-23.977-120.562-44.108-179.94zm-184.08 5.774c-13.42 10.98-27.58 21.186-42.414 30.674l37.47 37.47c8.748-14.57 18.62-27.954 29.327-40.43l-24.383-27.714z" }, "child": [] }] })(props);
  }
  function GiSpears(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M433.877 19.855l-78.62 158.668 47.82 53.934-15.673 260.824h38.79l15.697-261.233 51.04-45.25-59.053-166.942zm-130.48 20.598L216.073 152.55l28.397 49.186-28.616 106.387-.102-.176-9.545 35.62.076.134-40.234 149.58h32.68l29.676-111.186.026.045 9.527-35.556-.054-.09 36.656-137.344 48.415-27.95L303.4 40.452h-.002zM111.632 153.21l14.48 116.54 44.42 11.904L193 320.648l9.555-35.66-9.256-16.1 12.022-44.87-93.69-70.81zm-49.357 74.31l-42.68 79.31 23.57 28.455L30.786 493.28h18.746L61.83 336.26l27.608-22.865-27.163-85.875h-.002zm257.06 10.878l-22.354 87.248 29.686 21.932L345.04 493.28h18.84l-18.823-149.235 21.293-28.824-47.016-76.822zm175.103 28.614l-40.108 226.27h18.98l21.128-119.188V267.012zm-339.903 38.886l-55.35 71.05 18.618 32.247-20.41 84.086h19.233l19.51-80.385 30.81-17.788-12.408-89.21h-.002zm96.623 63.645l-9.517 35.516 50.837 88.22h29.8l-71.12-123.737z" }, "child": [] }] })(props);
  }
  function GiSwordsEmblem(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 512 512" }, "child": [{ "tag": "path", "attr": { "d": "M66.54 18.002c-.327-.007-.655-.005-.98.006-4.064.136-8.105 1.634-11.39 4.535-7.508 6.632-8.218 18.094-1.586 25.602 4.394 4.974 10.906 6.945 16.986 5.792l57.838 65.475-50.373 44.498 24.188 27.38c9.69-21.368 22.255-39.484 37.427-54.65l6.91 36.188c25.092-6.29 49.834-10.563 74.366-12.873l-23.912-27.07-38.66-12.483c17.117-12.9 36.734-22.97 58.62-30.474l-24.19-27.385-50.37 44.496-57.92-65.57c1.79-5.835.617-12.43-3.72-17.34-3.498-3.96-8.34-6.03-13.235-6.128zm384.397 0c-4.895.1-9.735 2.168-13.232 6.127-4.338 4.91-5.514 11.506-3.723 17.343l-57.92 65.568-50.37-44.497-24.188 27.385c21.884 7.504 41.5 17.573 58.62 30.472l-38.66 12.485-23.255 26.324c24.71 1.863 49.367 5.706 74.118 11.46l6.498-34.03c15.173 15.166 27.74 33.282 37.43 54.65l24.185-27.38-50.372-44.498 57.838-65.475c6.08 1.153 12.593-.818 16.987-5.792 6.63-7.508 5.92-18.97-1.586-25.602-3.285-2.9-7.326-4.4-11.39-4.535-.326-.01-.653-.013-.98-.006zm-186.425 158.51c-39.56-.098-79.467 5.226-120.633 16.095-2.046 90.448 34.484 209.35 118.47 259.905 81.295-49.13 122.402-169.902 120.552-259.914-39.75-10.496-78.91-15.988-118.39-16.086zm-117.176 153.5L60.47 428.35l-12.2 63.894 61.9-19.994 68.49-77.535c-12.86-20.108-23.246-42.03-31.324-64.703zm228.203 6.11c-8.69 22.238-19.577 43.634-32.706 63.142l64.473 72.986 61.898 19.994-12.2-63.894-81.466-92.23z" }, "child": [] }] })(props);
  }
  let injector;
  let filter;
  let rootScope;
  let intervalId2;
  let transferredSharedDataService;
  let modelDataService;
  let socketService;
  let routeProvider;
  let eventTypeProvider;
  let windowDisplayService;
  let windowManagerService;
  let angularHotkeys;
  let armyService;
  let villageService;
  let mapService;
  let $timeout;
  let storageService;
  let resourceService;
  let buildingService;
  let reportService;
  let villageInfoService;
  const fetchinjector = () => {
    try {
      if (window.injector) {
        injector = window.injector;
        filter = injector.get("$filter");
        rootScope = injector.get("$rootScope");
        transferredSharedDataService = injector.get("transferredSharedDataService");
        modelDataService = injector.get("modelDataService");
        socketService = injector.get("socketService");
        routeProvider = injector.get("routeProvider");
        eventTypeProvider = injector.get("eventTypeProvider");
        windowDisplayService = injector.get("windowDisplayService");
        windowManagerService = injector.get("windowManagerService");
        angularHotkeys = injector.get("hotkeys");
        armyService = injector.get("armyService");
        villageService = injector.get("villageService");
        mapService = injector.get("mapService");
        $timeout = injector.get("$timeout");
        storageService = injector.get("storageService");
        resourceService = injector.get("resourceService");
        buildingService = injector.get("buildingService");
        reportService = injector.get("reportService");
        villageInfoService = injector.get("villageInfoService");
        clearInterval(intervalId2);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  let timeHelper;
  let intervalId;
  const fetchTimeHelper = () => {
    try {
      if (window.timeHelper) {
        timeHelper = window.timeHelper;
        clearInterval(intervalId);
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  window.addEventListener("load", function() {
    intervalId2 = window.setInterval(fetchinjector, 1e3);
    intervalId = window.setInterval(fetchTimeHelper, 1e3);
  });
  const Spinner = () => /* @__PURE__ */ React.createElement("svg", { className: "tw-animate-spin tw-h-10 tw-w-10 tw-mr-3", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement(
    "circle",
    {
      className: "tw-opacity-25",
      cx: "12",
      cy: "12",
      r: "10",
      stroke: "currentColor",
      strokeWidth: "4"
    }
  ), /* @__PURE__ */ React.createElement(
    "path",
    {
      className: "tw-opacity-75",
      fill: "currentColor",
      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    }
  ));
  const unitIcons = {
    spear: GiSpears,
    sword: GiSwordsEmblem,
    axe: GiBattleAxe,
    archer: GiPocketBow,
    light_cavalry: FaHorseHead,
    mounted_archer: GiLightningBow,
    heavy_cavalry: FaShieldAlt,
    ram: FaHammer,
    catapult: FaBomb,
    doppelsoldner: GiBarbarian,
    trebuchet: GiCatapult
  };
  const unitNames = [
    "Lança",
    "Espada",
    "Vk",
    "Arco",
    "CL",
    "AM",
    "CP",
    "Ram",
    "Catas",
    "Bk",
    "Trab"
  ];
  const initialTroopsCount = {
    own: Array(11).fill(0),
    recruiting: Array(11).fill(0),
    available: Array(11).fill(0),
    total: Array(11).fill(0),
    missing: Array(11).fill(0)
  };
  function Tropas({ setCurrentPage }) {
    const [troopsCount, setTroopsCount] = reactExports.useState(initialTroopsCount);
    const [loading, setLoading] = reactExports.useState(true);
    const countUnits = () => {
      setLoading(true);
      const modelDataService2 = injector.get("modelDataService");
      const villages = modelDataService2.getVillages();
      const properties = ["own", "recruiting", "available"];
      const newTroopsCount = {
        own: Array(11).fill(0),
        recruiting: Array(11).fill(0),
        available: Array(11).fill(0),
        total: Array(11).fill(0),
        missing: Array(11).fill(0)
      };
      for (let i = 0; i < 3; i++) {
        const property = properties[i];
        for (const key in villages) {
          if (villages.hasOwnProperty(key)) {
            newTroopsCount[property][0] += villages[key].unitInfo.units.spear[property];
            newTroopsCount[property][1] += villages[key].unitInfo.units.sword[property];
            newTroopsCount[property][2] += villages[key].unitInfo.units.axe[property];
            newTroopsCount[property][3] += villages[key].unitInfo.units.archer[property];
            newTroopsCount[property][4] += villages[key].unitInfo.units.light_cavalry[property];
            newTroopsCount[property][5] += villages[key].unitInfo.units.mounted_archer[property];
            newTroopsCount[property][6] += villages[key].unitInfo.units.heavy_cavalry[property];
            newTroopsCount[property][7] += villages[key].unitInfo.units.ram[property];
            newTroopsCount[property][8] += villages[key].unitInfo.units.catapult[property];
            newTroopsCount[property][9] += villages[key].unitInfo.units.doppelsoldner[property];
            newTroopsCount[property][10] += villages[key].unitInfo.units.trebuchet[property];
          }
        }
      }
      for (let j = 0; j < 11; j++) {
        newTroopsCount.total[j] = newTroopsCount.own[j] + newTroopsCount.recruiting[j];
        newTroopsCount.missing[j] = newTroopsCount.own[j] - newTroopsCount.available[j];
      }
      setTroopsCount(newTroopsCount);
      setLoading(false);
    };
    reactExports.useEffect(() => {
      countUnits();
    }, []);
    return /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "troops-container tw-flex tw-flex-row tw-gap-16" }, loading ? /* @__PURE__ */ React.createElement(Spinner, null) : ["own", "recruiting", "available", "missing", "total"].map(
      (property, propertyIndex) => /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "tw-flex tw-flex-col tw-items-start",
          key: property
        },
        /* @__PURE__ */ React.createElement("h2", { className: "tw-text-lg tw-font-bold tw-mb-2 tw-capitalize" }, property),
        /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-col tw-mb-4" }, unitNames.map((name2, index) => {
          const Icon = unitIcons[Object.keys(unitIcons)[index]];
          return /* @__PURE__ */ React.createElement(
            "div",
            {
              key: name2,
              className: "troop-item tw-flex tw-items-center"
            },
            /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-row tw-gap-2" }, /* @__PURE__ */ React.createElement(Icon, { className: "tw-mr-2", size: 24 }), /* @__PURE__ */ React.createElement("span", { className: "tw-text-md tw-font-bold" }, name2, ":"), /* @__PURE__ */ React.createElement("span", null, troopsCount[property][index].toLocaleString("pt-BR")))
          );
        }))
      )
    )), /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-justify-center" }, /* @__PURE__ */ React.createElement("button", { onClick: countUnits, className: "tw-btn tw-btn-primary" }, "Atualizar")));
  }
  function AutoBug({ setCurrentPage }) {
    return /* @__PURE__ */ React.createElement("div", { className: "tw-hero tw-h-full" }, /* @__PURE__ */ React.createElement("div", { className: "tw-hero-content tw-text-center" }, /* @__PURE__ */ React.createElement("div", { className: "tw-max-w-md" }, /* @__PURE__ */ React.createElement("h1", { className: "tw-text-5xl tw-font-bold" }, "AutoBug"), /* @__PURE__ */ React.createElement("p", { className: "tw-py-6" }, "Tw2Tools tem como objetivo automatizar algumas tarefas chatas do jogo Tribal Wars 2, facilitando a vida de quem joga e quer ter uma vida social fora do jogo."), /* @__PURE__ */ React.createElement("div", { className: "tw-rounded-lg tw-text-white tw-font-bold tw-bg-slate-700 tw-p-5" }, "Escolha uma ferramenta no menu superior"))));
  }
  const InputWithLabel = ({
    label,
    type,
    placeholder,
    value,
    onChange,
    disabled = false,
    className = "",
    children
  }) => {
    return /* @__PURE__ */ React.createElement("label", { className: "tw-form-control" }, /* @__PURE__ */ React.createElement("div", { className: "tw-label" }, /* @__PURE__ */ React.createElement("span", { className: "tw-label-text" }, label)), children ? children : /* @__PURE__ */ React.createElement(
      Input,
      {
        type,
        placeholder,
        className: `tw-input tw-input-bordered ${className}`,
        value,
        onChange,
        disabled
      }
    ));
  };
  const SelectWithLabel = ({
    label,
    value,
    onChange,
    options,
    className = ""
  }) => {
    return /* @__PURE__ */ React.createElement("label", { className: "tw-form-control" }, /* @__PURE__ */ React.createElement("div", { className: "tw-label" }, /* @__PURE__ */ React.createElement("span", { className: "tw-label-text" }, label)), /* @__PURE__ */ React.createElement("select", { className: `tw-select tw-select-bordered ${className}`, value, onChange }, /* @__PURE__ */ React.createElement("option", { disabled: true, value: "" }, "Escolha um"), options.map((option) => /* @__PURE__ */ React.createElement("option", { key: option.value, value: option.value }, option.label))));
  };
  const showDialog = (dialogId) => {
    const dialog = document.getElementById(dialogId);
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      console.error(
        "Element with id 'presets-table' is not a <dialog> or showModal is not a function."
      );
    }
  };
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
  const getVilaOrigem = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const span = await awaitElement(
          'span[ng-show*="character.getSelectedVillage().getX()"]'
        );
        const socketService2 = injector.get("socketService");
        const routeProvider2 = injector.get("routeProvider");
        const modelDataService2 = injector.get("modelDataService");
        if (!span) {
          reject("Elemento span não encontrado");
          return;
        }
        const coordsText = span.textContent;
        if (!coordsText) {
          reject("Texto de coordenadas não encontrado");
          return;
        }
        const [x2, y2] = coordsText.replace(/[()]/g, "").split("|").map(Number);
        socketService2.emit(
          routeProvider2.MAP_GETVILLAGES,
          { x: x2, y: y2, width: 1, height: 1 },
          function(data) {
            if (data && data.villages && data.villages.length > 0) {
              resolve(data.villages[0]);
            } else {
              console.log(x2, y2);
              console.log(data);
              reject("Dados da vila não encontrados");
            }
          }
        );
      } catch (error) {
        reject("Erro ao buscar o ID da vila: " + error);
      }
    });
  };
  const getVilaTarget = (x2, y2) => {
    return new Promise(async (resolve, reject) => {
      try {
        const socketService2 = injector.get("socketService");
        const routeProvider2 = injector.get("routeProvider");
        socketService2.emit(
          routeProvider2.MAP_GETVILLAGES,
          { x: x2, y: y2, width: 1, height: 1 },
          function(data) {
            if (data && data.villages && data.villages.length > 0) {
              resolve(data.villages[0]);
            } else {
              console.log(x2, y2);
              console.log(data);
              reject("Dados da vila não encontrados");
            }
          }
        );
      } catch (error) {
        reject("Erro ao buscar o ID da vila: " + error);
      }
    });
  };
  const math = {
    fastMultiply: function(a, b2, c2) {
      return c2[0] = a[0] * b2[0] + a[1] * b2[2], c2[1] = a[0] * b2[1] + a[1] * b2[3], c2[2] = a[2] * b2[0] + a[3] * b2[2], c2[3] = a[2] * b2[1] + a[3] * b2[3], c2[4] = a[0] * b2[4] + a[1] * b2[5] + a[4], c2[5] = a[2] * b2[4] + a[3] * b2[5] + a[5], c2;
    },
    fastVMultiply: function(a, b2, c2) {
      return c2[0] = a[0] * b2[0] + a[1] * b2[1] + a[4], c2[1] = a[2] * b2[0] + a[3] * b2[1] + a[5], c2;
    },
    getVector2D: function(b2, c2) {
      var d2 = typeof Float32Array !== "undefined" ? new Float32Array(2) : [0, 0];
      return d2[0] = b2, d2[1] = c2, d2;
    },
    getMatrix2D: function(b2, c2, d2, e, f2, g2) {
      var h2 = typeof Float32Array !== "undefined" ? new Float32Array(6) : [0, 0, 0, 0, 0, 0];
      return h2[0] = b2, h2[1] = c2, h2[2] = d2, h2[3] = e, h2[4] = f2, h2[5] = g2, h2;
    },
    multiply: function(a, b2) {
      return [a[0] * b2[0] + a[1] * b2[2], a[0] * b2[1] + a[1] * b2[3], a[2] * b2[0] + a[3] * b2[2], a[2] * b2[1] + a[3] * b2[3], a[0] * b2[4] + a[1] * b2[5] + a[4], a[2] * b2[4] + a[3] * b2[5] + a[5]];
    },
    vmultiply: function(a, b2) {
      return [a[0] * b2[0] + a[1] * b2[1] + a[4], a[2] * b2[0] + a[3] * b2[1] + a[5], 1];
    },
    invert: function(a) {
      var b2 = 1 / (a[0] * a[3] - a[1] * a[2]);
      return [a[3] * b2, a[1] * b2, a[2] * b2, a[0] * b2, (a[1] * a[5] - a[4] * a[3]) * b2, (a[4] * a[2] - a[0] * a[5]) * b2, 0, 0, (a[0] * a[3] - a[1] * a[2]) * b2];
    },
    equal: function(a, b2) {
      if (a.length !== b2.length)
        return false;
      for (var c2 = a.length; c2--; )
        if (a[c2] !== b2[c2])
          return false;
      return true;
    },
    distance: function(a, b2, c2, d2) {
      return Math.sqrt((a - c2) * (a - c2) + (b2 - d2) * (b2 - d2));
    },
    getRotationMatrix: function(a, b2, c2) {
      return [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a), b2 || 0, c2 || 0];
    },
    vlength: function(a) {
      return Math.sqrt(a.map(function(a2) {
        return a2 * a2;
      }).reduce(function(a2, b2) {
        return a2 + b2;
      }));
    },
    normalize: function(a) {
      var b2 = this.vlength(a), c2 = function(a2) {
        return a2 / b2;
      };
      return a.map(c2);
    },
    getPointOnQuadraticCurve: function(a, b2, c2, d2, e, f2, g2) {
      var h2 = 1 - g2 / 100, i = function(a2, b22, c22, d22) {
        var e2 = 1 - a2;
        return e2 * e2 * b22 + 2 * e2 * a2 * c22 + a2 * a2 * d22;
      };
      return {
        x: i(h2, a, c2, e),
        y: i(h2, b2, d2, f2)
      };
    },
    getPointOnLine: function(a, b2, c2, d2, e) {
      var f2 = this.vlength([a - c2, b2 - d2]), g2 = -(f2 / 100 * e), h2 = a - c2, i = b2 - d2, j = Math.sqrt(h2 * h2 + i * i);
      return {
        x: c2 + h2 / j * (j + g2),
        y: d2 + i / j * (j + g2)
      };
    },
    actualDistance: function(a, b2) {
      var c2 = a.y - b2.y, d2 = a.x - b2.x;
      return c2 % 2 && (d2 += a.y % 2 ? 0.5 : -0.5), Math.sqrt(d2 * d2 + c2 * c2 * 0.75);
    },
    sub: function(a, b2) {
      return [a[0] - b2[0], a[1] - b2[1]];
    },
    isPointInPolygon: function(a, b2) {
      for (var c2, d2, e = b2.length, f2 = 0; e--; )
        c2 = this.sub(b2[e ? e - 1 : b2.length - 1], b2[e]), d2 = this.testSegmentIntersection(a, [1, 0], b2[e], c2), d2[0] > 0 && d2[1].between(0, 1) && f2++;
      return !!(1 & f2);
    },
    getPointInPolygon: function(a) {
      for (var b2, c2, d2, e, f2, g2, h2 = a.length; h2-- && (b2 = a[h2], c2 = a[h2 ? h2 - 1 : a.length - 1], d2 = a[h2 < a.length - 2 ? h2 + 1 : 0], e = this.sub(c2, b2), f2 = this.sub(d2, b2), !(Math.acos(this.dotProduct2D(e, f2) / (this.vlength(e) * this.vlength(f2))) < Math.PI)); )
        ;
      return g2 = this.sub(c2, d2), g2[0] *= 0.5, g2[1] *= 0.5, g2[0] += d2[0], g2[1] += d2[1], g2;
    },
    crossProduct2D: function(a, b2) {
      return a[0] * b2[1] - a[1] * b2[0];
    },
    dotProduct2D: function(a, b2) {
      return a[0] * b2[0] + a[1] * b2[1];
    },
    testSegmentIntersection: function(a, b2, c2, d2) {
      var e, f2, g2 = this.crossProduct2D, h2 = g2(b2, d2), i = [c2[0] - a[0], c2[1] - a[1]];
      return h2 ? (e = g2(i, d2) / h2, f2 = g2(i, b2) / h2, [e, f2]) : false;
    },
    gcd: function(a, b2) {
      var c2;
      for (0 > b2 && (b2 = -b2), 0 > a && (a = -a), b2 > a && (c2 = b2, b2 = a, a = c2); a > 0; )
        c2 = b2 % a, b2 = a, a = c2;
      return b2;
    },
    lcm: function(a, c2) {
      return 0 === a && 0 === c2 ? 0 : Math.abs(a * c2) / this.gcd(a, c2);
    }
  };
  const getTravelTime = function(origin, target, units, type = "attack", useEffects = true) {
    console.log(origin);
    console.log(target);
    console.log(units);
    console.log(type);
    console.log(useEffects);
    const targetIsBarbarian = !target.character_id;
    const targetIsSameTribe = target.character_id && target.tribe_id && target.tribe_id === modelDataService.getSelectedCharacter().getTribeId();
    if (useEffects !== false) {
      if (type === "attack") {
        if (targetIsBarbarian) {
          useEffects = true;
        }
      } else if (type === "support") {
        if (targetIsSameTribe) {
          useEffects = true;
        }
      }
    }
    const army = {
      units,
      officers: {}
    };
    console.log("army: " + army);
    console.log("units" + units);
    console.log("type" + type);
    const travelTime = armyService.calculateTravelTime(
      army,
      {
        barbarian: targetIsBarbarian,
        ownTribe: targetIsSameTribe,
        officers: {},
        effects: useEffects
      },
      type
    );
    const distance = math.actualDistance(origin, target);
    const totalTravelTime = armyService.getTravelTimeForDistance(
      army,
      travelTime,
      distance,
      type
    );
    console.log("Distance: " + distance);
    console.log("TotalTravelTime: " + totalTravelTime * 1e3);
    return totalTravelTime * 1e3;
  };
  const useTroopSettings$1 = () => {
    const [typeTroopSend, setTypeTroopSend] = reactExports.useState("");
    const [troopsToSend, setTroopsToSend] = reactExports.useState("");
    const [bbCoordX, setBbCoordX] = reactExports.useState("");
    const [bbCoordY, setBbCoordY] = reactExports.useState("");
    const [commands, setCommands] = reactExports.useState("");
    const [hordeInterval, setHordeInterval] = reactExports.useState("");
    const [typeTroopRecruit, setTypeTroopRecruit] = reactExports.useState("");
    const [troopsToRecruit, setTroopsToRecruit] = reactExports.useState("");
    const [amountRecruits, setAmountRecruits] = reactExports.useState("");
    const [delay, setDelay] = reactExports.useState("");
    const [origin, setOrigin] = reactExports.useState(null);
    const [target, setTarget] = reactExports.useState(null);
    const [travelTime, setTravelTime] = reactExports.useState("");
    const [isBugging, setIsBugging] = reactExports.useState(false);
    reactExports.useEffect(() => {
      if (bbCoordX.length === 3 && bbCoordY.length === 3 && typeTroopSend !== "") {
        (async () => {
          try {
            const originVila = await getVilaOrigem();
            const targetVila = await getVilaTarget(parseInt(bbCoordX), parseInt(bbCoordY));
            setOrigin(originVila);
            setTarget(targetVila);
            console.log("Origem e destino definidos:", { originVila, targetVila });
          } catch (error) {
            console.error("Erro ao obter vilas:", error);
          }
        })();
      }
    }, [bbCoordX, bbCoordY, typeTroopSend]);
    reactExports.useEffect(() => {
      if (origin && target) {
        const units = { [typeTroopSend]: parseInt(troopsToSend) || 1 };
        const time = getTravelTime(origin, target, units);
        setTravelTime(time.toString());
        console.log("Tempo de viagem definido:", time.toString());
      }
    }, [origin, target, typeTroopSend, troopsToSend]);
    return {
      typeTroopSend,
      setTypeTroopSend,
      troopsToSend,
      setTroopsToSend,
      bbCoordX,
      setBbCoordX,
      bbCoordY,
      setBbCoordY,
      commands,
      setCommands,
      hordeInterval,
      setHordeInterval,
      typeTroopRecruit,
      setTypeTroopRecruit,
      troopsToRecruit,
      setTroopsToRecruit,
      amountRecruits,
      setAmountRecruits,
      delay,
      setDelay,
      origin,
      target,
      travelTime,
      isBugging,
      setIsBugging
    };
  };
  function MdDeleteSweep(props) {
    return GenIcon({ "tag": "svg", "attr": { "viewBox": "0 0 24 24" }, "child": [{ "tag": "path", "attr": { "fill": "none", "d": "M0 0h24v24H0z" }, "child": [] }, { "tag": "path", "attr": { "d": "M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z" }, "child": [] }] })(props);
  }
  const Presets = ({ applyPreset }) => {
    const [presets, setPresets] = reactExports.useState([]);
    reactExports.useEffect(() => {
      const savedPresets = JSON.parse(localStorage.getItem("presets") || "[]");
      setPresets(savedPresets);
    }, []);
    const handleDelete = (index) => {
      const updatedPresets = presets.filter((_2, i) => i !== index);
      setPresets(updatedPresets);
      localStorage.setItem("presets", JSON.stringify(updatedPresets));
    };
    return /* @__PURE__ */ React.createElement("dialog", { id: "presets-table", className: "tw-modal tw-text-black tw-font-normal" }, /* @__PURE__ */ React.createElement("div", { className: "tw-modal-box" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "tw-table tw-w-full tw-text-center" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "tw-px-4 tw-py-2" }, "#"), /* @__PURE__ */ React.createElement("th", { className: "tw-px-4 tw-py-2" }, "Name"), /* @__PURE__ */ React.createElement("th", { className: "tw-px-4 tw-py-2" }, "Apply"), /* @__PURE__ */ React.createElement("th", { className: "tw-px-4 tw-py-2" }, "Delete"))), /* @__PURE__ */ React.createElement("tbody", null, presets.map((preset, index) => /* @__PURE__ */ React.createElement("tr", { key: index, className: "tw-text-center" }, /* @__PURE__ */ React.createElement("th", { className: "tw-px-4 tw-py-2" }, index + 1), /* @__PURE__ */ React.createElement("td", { className: "tw-px-4 tw-py-2" }, preset.name), /* @__PURE__ */ React.createElement("td", { className: "tw-px-4 tw-py-2" }, /* @__PURE__ */ React.createElement(GiLoad, { className: "tw-text-2xl tw-mx-auto", onClick: () => applyPreset(preset) })), /* @__PURE__ */ React.createElement("td", { className: "tw-px-4 tw-py-2" }, /* @__PURE__ */ React.createElement(MdDeleteSweep, { className: "tw-text-2xl tw-mx-auto tw-text-red-500", onClick: () => handleDelete(index) }))))))), /* @__PURE__ */ React.createElement("div", { className: "tw-modal-action" }, /* @__PURE__ */ React.createElement("form", { method: "dialog" }, /* @__PURE__ */ React.createElement("button", { className: "tw-btn" }, "Fechar")))));
  };
  const AddPreset = ({
    typeTroopSend,
    troopsToSend,
    bbCoordX,
    bbCoordY,
    commands,
    hordeInterval,
    typeTroopRecruit,
    troopsToRecruit,
    amountRecruits,
    delay
  }) => {
    const [presetName, setPresetName] = reactExports.useState("");
    const handleSave = () => {
      const presetData = {
        name: presetName,
        typeTroopSend,
        troopsToSend,
        bbCoordX,
        bbCoordY,
        commands,
        hordeInterval,
        typeTroopRecruit,
        troopsToRecruit,
        amountRecruits,
        delay
      };
      const existingPresets = JSON.parse(localStorage.getItem("presets") || "[]");
      existingPresets.push(presetData);
      localStorage.removeItem("presets");
      localStorage.setItem("presets", JSON.stringify(existingPresets));
      const dialog = document.getElementById("add-preset");
      dialog.close();
    };
    return /* @__PURE__ */ React.createElement("dialog", { id: "add-preset", className: "tw-modal tw-text-black tw-font-normal" }, /* @__PURE__ */ React.createElement("div", { className: "tw-modal-box" }, /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Nome",
        type: "text",
        placeholder: "Preset",
        value: presetName,
        onChange: (e) => setPresetName(e.target.value)
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "tw-btn tw-btn-neutral tw-mt-5 tw-mb-5",
        onClick: handleSave
      },
      "Salvar"
    ), /* @__PURE__ */ React.createElement("div", { className: "tw-modal-action" }, /* @__PURE__ */ React.createElement("form", { method: "dialog" }, /* @__PURE__ */ React.createElement("button", { className: "tw-btn" }, "Fechar")))));
  };
  function Bug1({ setCurrentPage }) {
    const {
      typeTroopSend,
      setTypeTroopSend,
      troopsToSend,
      setTroopsToSend,
      bbCoordX,
      setBbCoordX,
      bbCoordY,
      setBbCoordY,
      commands,
      setCommands,
      hordeInterval,
      setHordeInterval,
      typeTroopRecruit,
      setTypeTroopRecruit,
      troopsToRecruit,
      setTroopsToRecruit,
      amountRecruits,
      setAmountRecruits,
      delay,
      setDelay,
      travelTime,
      origin,
      target,
      isBugging,
      setIsBugging
    } = useTroopSettings$1();
    const convertToMilliseconds = (timeString) => {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      return (hours * 3600 + minutes * 60 + seconds) * 1e3;
    };
    const recruitTime = (travelTime2, delay2) => {
      var formattedTravelTime = filter("readableMillisecondsFilter")(travelTime2);
      delay2 = delay2 * 1e3;
      const timeNow = (/* @__PURE__ */ new Date()).getTime();
      const travelTimeMilliseconds = convertToMilliseconds(formattedTravelTime);
      const recruitTimeCalc = new Date(timeNow + travelTimeMilliseconds + delay2);
      const timeAtt = /* @__PURE__ */ new Date();
      return recruitTimeCalc.getTime() - timeAtt.getTime();
    };
    reactExports.useEffect(() => {
      let intervalId3;
      const bugHordeWrapper = () => {
        if ((origin == null ? void 0 : origin.id) && (target == null ? void 0 : target.id) && typeTroopSend && troopsToSend && commands && typeTroopRecruit && troopsToRecruit && amountRecruits && travelTime && delay) {
          bugHorde(
            parseInt(origin.id),
            parseInt(target.id),
            typeTroopSend,
            parseInt(troopsToSend),
            parseInt(commands),
            typeTroopRecruit,
            parseInt(troopsToRecruit),
            parseInt(amountRecruits),
            travelTime,
            parseInt(delay)
          );
        }
      };
      if (isBugging) {
        bugHordeWrapper();
        intervalId3 = setInterval(() => {
          bugHordeWrapper();
        }, parseInt(hordeInterval) * 1e3 + recruitTime(travelTime, parseInt(delay)));
      }
      return () => {
        if (intervalId3) {
          clearInterval(intervalId3);
        }
      };
    }, [
      isBugging,
      origin == null ? void 0 : origin.id,
      target == null ? void 0 : target.id,
      typeTroopSend,
      troopsToSend,
      commands,
      typeTroopRecruit,
      troopsToRecruit,
      amountRecruits,
      travelTime,
      delay,
      hordeInterval
    ]);
    const troopOptions = [
      { value: "spear", label: "Lanceiro" },
      { value: "axe", label: "Viking" },
      { value: "light_cavalry", label: "Cavalaria Leve" },
      { value: "heavy_cavalry", label: "Cavalaria Pesada" },
      { value: "mounted_archer", label: "Arqueiro Montado" }
    ];
    const applyPreset = (preset) => {
      setTypeTroopSend(preset.typeTroopSend);
      setTroopsToSend(preset.troopsToSend);
      setBbCoordX(preset.bbCoordX);
      setBbCoordY(preset.bbCoordY);
      setCommands(preset.commands);
      setHordeInterval(preset.hordeInterval);
      setTypeTroopRecruit(preset.typeTroopRecruit);
      setTroopsToRecruit(preset.troopsToRecruit);
      setAmountRecruits(preset.amountRecruits);
      setDelay(preset.delay);
    };
    function SendXAttacks(origin_id, target_id, typeTroopSend2, troopsToSend2, commands2) {
      try {
        let army = { [typeTroopSend2]: troopsToSend2 };
        console.log(army);
        for (let i = 0; i < commands2; i++) {
          socketService.emit(routeProvider.SEND_CUSTOM_ARMY, {
            start_village: origin_id,
            target_village: target_id,
            type: "attack",
            units: army,
            icon: 0,
            officers: {},
            catapult_target: false
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    function recruitTroops(origin_id, typeTroopRecruit2, troopsToRecruit2) {
      try {
        socketService.emit(routeProvider.BARRACKS_RECRUIT, {
          village_id: origin_id,
          unit_type: typeTroopRecruit2,
          amount: troopsToRecruit2
        });
      } catch (err) {
        console.log(err);
      }
    }
    function recruitTroopsInterval(origin_id, typeTroopRecruit2, troopsToRecruit2, amountRecruits2, delayEntreRecruits) {
      let i = 0;
      let interval = setInterval(() => {
        recruitTroops(origin_id, typeTroopRecruit2, troopsToRecruit2);
        i++;
        if (i === amountRecruits2) {
          clearInterval(interval);
        }
      }, delayEntreRecruits);
      console.log(recruitQueue());
    }
    const recruitQueue = () => {
      const selectedVillageModel = modelDataService.getSelectedVillage();
      const recruitingQueue = selectedVillageModel.getRecruitingQueue("barracks");
      return recruitingQueue.jobs;
    };
    function cancelRecruit(jobId) {
      var messageType = routeProvider.BARRACKS_CANCEL_RECRUIT_JOB;
      socketService.emit(messageType, {
        village_id: modelDataService.getSelectedVillage().getId(),
        job_id: jobId
      });
    }
    function cancelAllRecruits() {
      var queue = recruitQueue();
      queue.forEach((job) => {
        cancelRecruit(job.data.job_id);
      });
    }
    function recruitAndCancellAllRecruits(origin_id, typeTroopRecruit2, troopsToRecruit2, amountRecruits2, delayEntreRecruits) {
      recruitTroopsInterval(
        origin_id,
        typeTroopRecruit2,
        troopsToRecruit2,
        amountRecruits2,
        delayEntreRecruits
      );
      setTimeout(() => {
        cancelAllRecruits();
      }, 12e3);
    }
    function bugHorde(origin_id, target_id, typeTroopSend2, troopsToSend2, commands2, typeTroopRecruit2, troopsToRecruit2, amountRecruits2, travelTime2, delay2) {
      try {
        console.log("Enviando horda");
        SendXAttacks(origin_id, target_id, typeTroopSend2, troopsToSend2, commands2);
        console.log("Ataques enviados");
        const delayEntreRecruits = 300;
        var timeUntilRecruit = recruitTime(travelTime2, delay2);
        console.log(
          "Irá recrutar em :" + filter("readableMillisecondsFilter")(timeUntilRecruit.toString())
        );
        setTimeout(() => {
          console.log("Recrutando tropas");
          recruitAndCancellAllRecruits(
            origin_id,
            typeTroopRecruit2,
            troopsToRecruit2,
            amountRecruits2,
            delayEntreRecruits
          );
        }, timeUntilRecruit);
      } catch (err) {
        console.log("Erro na função bugHorde: ", err);
      }
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      AddPreset,
      {
        typeTroopSend,
        troopsToSend,
        bbCoordX,
        bbCoordY,
        commands,
        hordeInterval,
        typeTroopRecruit,
        troopsToRecruit,
        amountRecruits,
        delay
      }
    ), /* @__PURE__ */ React.createElement("h1", { className: "tw-font-bold tw-text-2xl tw-mb-5" }, "Dados de Envio"), /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-row tw-gap-10" }, /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-items-center tw-flex-col" }, /* @__PURE__ */ React.createElement("h1", { className: "tw-font-bold" }, "Tropas/envio"), /* @__PURE__ */ React.createElement("div", { className: "srcTroops tw-flex tw-flex-row tw-gap-5" }, /* @__PURE__ */ React.createElement(
      SelectWithLabel,
      {
        label: "Escolha qual tropa enviar",
        value: typeTroopSend,
        onChange: (e) => setTypeTroopSend(e.target.value),
        options: troopOptions
      }
    ), /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Tropas por comando?",
        type: "number",
        placeholder: "Quantidade",
        value: troopsToSend,
        onChange: (e) => setTroopsToSend(e.target.value.toString()),
        className: "tw-w-[150px]"
      }
    ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "tw-font-bold" }, "Dados da Barbara"), /* @__PURE__ */ React.createElement("div", { className: "srcTroops tw-flex tw-flex-row tw-gap-5" }, /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Coord X",
        type: "number",
        placeholder: "X",
        value: bbCoordX,
        onChange: (e) => setBbCoordX(e.target.value.toString()),
        className: "tw-w-[60px]"
      }
    ), /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Coord Y",
        type: "number",
        placeholder: "Y",
        value: bbCoordY,
        onChange: (e) => setBbCoordY(e.target.value.toString()),
        className: "tw-w-[60px]"
      }
    ), /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Tempo de viagem",
        type: "text",
        placeholder: "Tempo",
        value: filter("readableMillisecondsFilter")(travelTime),
        onChange: (e) => {
        },
        disabled: true,
        className: "tw-w-[150px]"
      }
    )))), /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-row tw-gap-10 tw-mt-5" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "tw-font-bold" }, "Ataques por hordas"), /* @__PURE__ */ React.createElement("div", { className: "srcTroops tw-flex tw-flex-row tw-gap-5" }, /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Quantidade",
        type: "number",
        placeholder: "Qtd",
        value: commands,
        onChange: (e) => setCommands(e.target.value.toString()),
        className: "tw-w-[60px]"
      }
    ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "tw-font-bold" }, "Intervalo entre hordas"), /* @__PURE__ */ React.createElement("div", { className: "srcTroops tw-flex tw-flex-row tw-gap-5" }, /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Segundos",
        type: "number",
        placeholder: "Qtd",
        value: hordeInterval,
        onChange: (e) => setHordeInterval(e.target.value.toString()),
        className: "tw-w-[60px]"
      }
    )))), /* @__PURE__ */ React.createElement("h1", { className: "tw-font-bold tw-text-2xl tw-mb-5 tw-mt-5" }, "Dados de recrutamento"), /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-row tw-gap-10" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "srcTroops tw-flex tw-flex-row tw-gap-5" }, /* @__PURE__ */ React.createElement(
      SelectWithLabel,
      {
        label: "Escolha qual tropa recrutar",
        value: typeTroopRecruit,
        onChange: (e) => setTypeTroopRecruit(e.target.value),
        options: troopOptions
      }
    ), /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Tropas por recruit",
        type: "number",
        placeholder: "Quantidade",
        value: troopsToRecruit,
        onChange: (e) => setTroopsToRecruit(e.target.value.toString()),
        className: "tw-w-[150px]"
      }
    ), /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Quantidade de recruits",
        type: "number",
        placeholder: "Quantidade",
        value: amountRecruits,
        onChange: (e) => setAmountRecruits(e.target.value.toString()),
        className: "tw-w-[150px]"
      }
    ), /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Iniciar Recruits quanto tempo após bater?",
        type: "number",
        placeholder: "Delay",
        value: delay,
        onChange: (e) => setDelay(e.target.value.toString()),
        className: "tw-w-[150px]"
      }
    )))), /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-row tw-gap-10 tw-mb-5 tw-mt-5" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "tw-btn tw-btn-accent",
        onClick: () => showDialog("add-preset")
      },
      /* @__PURE__ */ React.createElement("span", null, "Salvar PreSet")
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "tw-btn tw-btn-primary",
        onClick: () => showDialog("presets-table")
      },
      /* @__PURE__ */ React.createElement("span", null, "Pre-Sets")
    )), /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-row tw-gap-10 " }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "tw-btn tw-btn-secondary",
        onClick: () => setIsBugging(false),
        disabled: !isBugging
      },
      /* @__PURE__ */ React.createElement("span", null, "Pausar")
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "tw-btn tw-btn-neutral",
        onClick: () => setIsBugging(true),
        disabled: isBugging || travelTime === ""
      },
      /* @__PURE__ */ React.createElement("span", null, "Iniciar")
    )), /* @__PURE__ */ React.createElement(Presets, { applyPreset }));
  }
  const useTroopSettings = () => {
    const [bbCoordX2, setBbCoordX2] = reactExports.useState("");
    const [bbCoordY2, setBbCoordY2] = reactExports.useState("");
    const [commands2, setCommands2] = reactExports.useState("");
    const [hordeInterval2, setHordeInterval2] = reactExports.useState("");
    const [typeTroopRecruit2, setTypeTroopRecruit2] = reactExports.useState("");
    const [troopsToRecruit2, setTroopsToRecruit2] = reactExports.useState("");
    const [amountRecruits2, setAmountRecruits2] = reactExports.useState("");
    const [delay2, setDelay2] = reactExports.useState("");
    const [origin2, setOrigin2] = reactExports.useState(null);
    const [target2, setTarget2] = reactExports.useState(null);
    const [isBugging2, setIsBugging2] = reactExports.useState(false);
    reactExports.useEffect(() => {
      try {
        if (bbCoordX2.length === 3 && bbCoordY2.length === 3) {
          (async () => {
            try {
              const originVila = await getVilaOrigem();
              const targetVila = await getVilaTarget(parseInt(bbCoordX2), parseInt(bbCoordY2));
              setOrigin2(originVila);
              setTarget2(targetVila);
              console.log("Origem e destino definidos:", { originVila, targetVila });
            } catch (error) {
              console.error("Erro ao obter vilas:", error);
            }
          })();
        }
      } catch (err) {
        console.error(err.message);
      }
    }, [bbCoordX2, bbCoordY2]);
    return {
      bbCoordX2,
      setBbCoordX2,
      bbCoordY2,
      setBbCoordY2,
      commands2,
      setCommands2,
      hordeInterval2,
      setHordeInterval2,
      typeTroopRecruit2,
      setTypeTroopRecruit2,
      troopsToRecruit2,
      setTroopsToRecruit2,
      amountRecruits2,
      setAmountRecruits2,
      delay2,
      setDelay2,
      origin2,
      target2,
      isBugging2,
      setIsBugging2
    };
  };
  function Bug2({ setCurrentPage }) {
    const {
      bbCoordX2,
      setBbCoordX2,
      bbCoordY2,
      setBbCoordY2,
      commands2,
      setCommands2,
      hordeInterval2,
      setHordeInterval2,
      typeTroopRecruit2,
      setTypeTroopRecruit2,
      troopsToRecruit2,
      setTroopsToRecruit2,
      amountRecruits2,
      setAmountRecruits2,
      delay2,
      setDelay2,
      origin2,
      target2,
      isBugging2,
      setIsBugging2
    } = useTroopSettings();
    const [keepQueue, setKeepQueue] = reactExports.useState(false);
    const convertToMilliseconds = (timeString) => {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      return (hours * 3600 + minutes * 60 + seconds) * 1e3;
    };
    const recruitTime = (travelTime, delay) => {
      var formattedTravelTime = filter("readableMillisecondsFilter")(travelTime);
      delay = delay * 1e3;
      const timeNow = (/* @__PURE__ */ new Date()).getTime();
      const travelTimeMilliseconds = convertToMilliseconds(formattedTravelTime);
      const recruitTimeCalc = new Date(timeNow + travelTimeMilliseconds + delay);
      const timeAtt = /* @__PURE__ */ new Date();
      return recruitTimeCalc.getTime() - timeAtt.getTime();
    };
    reactExports.useEffect(() => {
      let intervalId3;
      const bugHordeWrapper = () => {
        let oldQueue = [];
        if ((origin2 == null ? void 0 : origin2.id) && (target2 == null ? void 0 : target2.id) && commands2 && typeTroopRecruit2 && troopsToRecruit2 && amountRecruits2 && delay2) {
          console.log(keepQueue);
          if (keepQueue) {
            oldQueue = JSON.parse(JSON.stringify(recruitQueue()));
            oldQueue.forEach((job) => {
              console.log(job.data.job_id);
            });
          }
          console.log("Calling bugHorde...");
          if (oldQueue.length > 0) {
            bugHorde(
              parseInt(origin2.id),
              parseInt(target2.id),
              "DASDAS",
              1,
              parseInt(commands2),
              typeTroopRecruit2,
              parseInt(troopsToRecruit2),
              parseInt(amountRecruits2),
              "0",
              parseInt(delay2),
              oldQueue
            );
          } else {
            bugHorde(
              parseInt(origin2.id),
              parseInt(target2.id),
              "DASDAS",
              1,
              parseInt(commands2),
              typeTroopRecruit2,
              parseInt(troopsToRecruit2),
              parseInt(amountRecruits2),
              "0",
              parseInt(delay2)
            );
          }
        } else {
          console.log("Missing data for bugHorde:");
          console.log("origin.id:", origin2 == null ? void 0 : origin2.id);
          console.log("target.id:", target2 == null ? void 0 : target2.id);
          console.log("commands:", commands2);
          console.log("typeTroopRecruit:", typeTroopRecruit2);
          console.log("troopsToRecruit:", troopsToRecruit2);
          console.log("amountRecruits:", amountRecruits2);
          console.log("delay:", delay2);
        }
      };
      if (isBugging2) {
        console.log("Starting bug...");
        bugHordeWrapper();
        intervalId3 = setInterval(() => {
          bugHordeWrapper();
        }, parseInt(hordeInterval2) * 1e3 + recruitTime("0", parseInt(delay2)));
      }
      return () => {
        if (intervalId3) {
          clearInterval(intervalId3);
        }
      };
    }, [
      isBugging2,
      origin2 == null ? void 0 : origin2.id,
      target2 == null ? void 0 : target2.id,
      commands2,
      typeTroopRecruit2,
      troopsToRecruit2,
      amountRecruits2,
      delay2,
      hordeInterval2
    ]);
    const troopOptions = [
      { value: "spear", label: "Lanceiro" },
      { value: "axe", label: "Viking" },
      { value: "light_cavalry", label: "Cavalaria Leve" },
      { value: "heavy_cavalry", label: "Cavalaria Pesada" },
      { value: "mounted_archer", label: "Arqueiro Montado" }
    ];
    const applyPreset = (preset) => {
      setBbCoordX2(preset.bbCoordX);
      setBbCoordY2(preset.bbCoordY);
      setCommands2(preset.commands);
      setHordeInterval2(preset.hordeInterval);
      setTypeTroopRecruit2(preset.typeTroopRecruit);
      setTroopsToRecruit2(preset.troopsToRecruit);
      setAmountRecruits2(preset.amountRecruits);
      setDelay2(preset.delay);
    };
    function SendXAttacks(origin_id, target_id, typeTroopSend, troopsToSend, commands) {
      try {
        let army = { [typeTroopSend]: troopsToSend };
        console.log(army);
        for (let i = 0; i < commands; i++) {
          socketService.emit(routeProvider.SEND_CUSTOM_ARMY, {
            start_village: origin_id,
            target_village: target_id,
            type: "attack",
            units: army,
            icon: 0,
            officers: {},
            catapult_target: false
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    function recruitTroops(origin_id, typeTroopRecruit, troopsToRecruit) {
      try {
        socketService.emit(routeProvider.BARRACKS_RECRUIT, {
          village_id: origin_id,
          unit_type: typeTroopRecruit,
          amount: troopsToRecruit
        });
      } catch (err) {
        console.log(err);
      }
    }
    function recruitTroopsInterval(origin_id, typeTroopRecruit, troopsToRecruit, amountRecruits, delayEntreRecruits) {
      let i = 0;
      let interval = setInterval(() => {
        recruitTroops(origin_id, typeTroopRecruit, troopsToRecruit);
        i++;
        if (i === amountRecruits) {
          clearInterval(interval);
        }
      }, delayEntreRecruits);
      console.log(recruitQueue());
    }
    const recruitQueue = () => {
      const selectedVillageModel = modelDataService.getSelectedVillage();
      const recruitingQueue = selectedVillageModel.getRecruitingQueue("barracks");
      return recruitingQueue.jobs;
    };
    function cancelRecruit(jobId) {
      var messageType = routeProvider.BARRACKS_CANCEL_RECRUIT_JOB;
      socketService.emit(messageType, {
        village_id: modelDataService.getSelectedVillage().getId(),
        job_id: jobId
      });
    }
    function cancelAllRecruits(oldQueue) {
      var queue = recruitQueue();
      console.log("queue antes");
      queue.forEach((job) => {
        console.log(job.data.job_id);
      });
      if (oldQueue) {
        console.log("oldQueue");
        oldQueue.forEach((job) => {
          console.log(job.data.job_id);
        });
        queue = queue.filter(
          (job) => !oldQueue.some((oldJob) => oldJob.data.job_id === job.data.job_id)
        );
        console.log("queue após ");
        queue.forEach((job) => {
          console.log(job.data.job_id);
        });
      }
      queue.forEach((job) => {
        cancelRecruit(job.data.job_id);
      });
    }
    function recruitAndCancellAllRecruits(origin_id, typeTroopRecruit, troopsToRecruit, amountRecruits, delayEntreRecruits, oldQueue) {
      recruitTroopsInterval(
        origin_id,
        typeTroopRecruit,
        troopsToRecruit,
        amountRecruits,
        delayEntreRecruits
      );
      setTimeout(() => {
        keepQueue ? cancelAllRecruits(oldQueue) : cancelAllRecruits();
      }, 12e3);
    }
    function bugHorde(origin_id, target_id, typeTroopSend, troopsToSend, commands, typeTroopRecruit, troopsToRecruit, amountRecruits, travelTime, delay, oldQueue) {
      try {
        console.log("Enviando horda");
        SendXAttacks(origin_id, target_id, typeTroopSend, troopsToSend, commands);
        console.log("Ataques enviados");
        const delayEntreRecruits = 300;
        var timeUntilRecruit = recruitTime(travelTime, delay);
        console.log(
          "Irá recrutar em :" + filter("readableMillisecondsFilter")(timeUntilRecruit.toString())
        );
        setTimeout(() => {
          console.log("Recrutando tropas");
          oldQueue && oldQueue.length > 0 ? recruitAndCancellAllRecruits(
            origin_id,
            typeTroopRecruit,
            troopsToRecruit,
            amountRecruits,
            delayEntreRecruits,
            oldQueue
          ) : recruitAndCancellAllRecruits(
            origin_id,
            typeTroopRecruit,
            troopsToRecruit,
            amountRecruits,
            delayEntreRecruits
          );
        }, timeUntilRecruit);
      } catch (err) {
        console.log(err);
      }
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      AddPreset,
      {
        typeTroopSend: "",
        troopsToSend: "1",
        bbCoordX: bbCoordX2,
        bbCoordY: bbCoordY2,
        commands: commands2,
        hordeInterval: hordeInterval2,
        typeTroopRecruit: typeTroopRecruit2,
        troopsToRecruit: troopsToRecruit2,
        amountRecruits: amountRecruits2,
        delay: delay2
      }
    ), /* @__PURE__ */ React.createElement("h1", { className: "tw-font-bold tw-text-2xl tw-mb-5" }, "Dados de Envio"), /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-row tw-gap-10" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "tw-font-bold" }, "Dados da Barbara"), /* @__PURE__ */ React.createElement("div", { className: "srcTroops tw-flex tw-flex-row tw-gap-5" }, /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Coord X",
        type: "number",
        placeholder: "X",
        value: bbCoordX2,
        onChange: (e) => setBbCoordX2(e.target.value.toString()),
        className: "tw-w-[60px]"
      }
    ), /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Coord Y",
        type: "number",
        placeholder: "Y",
        value: bbCoordY2,
        onChange: (e) => setBbCoordY2(e.target.value.toString()),
        className: "tw-w-[60px]"
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "tw-form-control" }, /* @__PURE__ */ React.createElement("label", { className: "tw-label cursor-pointer tw-flex tw-gap-4 tw-flex-col" }, /* @__PURE__ */ React.createElement("span", { className: "tw-label-text" }, "Manter recrutamento anterior ?"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: keepQueue,
        onChange: (e) => setKeepQueue(e.target.checked),
        className: "tw-checkbox"
      }
    )))))), /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-row tw-gap-10 tw-mt-5" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "tw-font-bold" }, "Ataques por hordas"), /* @__PURE__ */ React.createElement("div", { className: "srcTroops tw-flex tw-flex-row tw-gap-5" }, /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Quantidade",
        type: "number",
        placeholder: "Qtd",
        value: commands2,
        onChange: (e) => setCommands2(e.target.value.toString()),
        className: "tw-w-[60px]"
      }
    ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "tw-font-bold" }, "Intervalo entre hordas"), /* @__PURE__ */ React.createElement("div", { className: "srcTroops tw-flex tw-flex-row tw-gap-5" }, /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Segundos",
        type: "number",
        placeholder: "Qtd",
        value: hordeInterval2,
        onChange: (e) => setHordeInterval2(e.target.value.toString()),
        className: "tw-w-[60px]"
      }
    )))), /* @__PURE__ */ React.createElement("h1", { className: "tw-font-bold tw-text-2xl tw-mb-5 tw-mt-5" }, "Dados de recrutamento"), /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-row tw-gap-10" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "srcTroops tw-flex tw-flex-row tw-gap-5" }, /* @__PURE__ */ React.createElement(
      SelectWithLabel,
      {
        label: "Escolha qual tropa recrutar",
        value: typeTroopRecruit2,
        onChange: (e) => setTypeTroopRecruit2(e.target.value),
        options: troopOptions
      }
    ), /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Tropas por recruit",
        type: "number",
        placeholder: "Quantidade",
        value: troopsToRecruit2,
        onChange: (e) => setTroopsToRecruit2(e.target.value.toString()),
        className: "tw-w-[150px]"
      }
    ), /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Quantidade de recruits",
        type: "number",
        placeholder: "Quantidade",
        value: amountRecruits2,
        onChange: (e) => setAmountRecruits2(e.target.value.toString()),
        className: "tw-w-[150px]"
      }
    ), /* @__PURE__ */ React.createElement(
      InputWithLabel,
      {
        label: "Iniciar Recruits quanto tempo após bater?",
        type: "number",
        placeholder: "Delay",
        value: delay2,
        onChange: (e) => setDelay2(e.target.value.toString()),
        className: "tw-w-[150px]"
      }
    )))), /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-row tw-gap-10 tw-mb-5 tw-mt-5" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "tw-btn tw-btn-accent",
        onClick: () => showDialog("add-preset")
      },
      /* @__PURE__ */ React.createElement("span", null, "Salvar PreSet")
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "tw-btn tw-btn-primary",
        onClick: () => showDialog("presets-table")
      },
      /* @__PURE__ */ React.createElement("span", null, "Pre-Sets")
    )), /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-flex-row tw-gap-10 " }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "tw-btn tw-btn-secondary",
        onClick: () => setIsBugging2(!isBugging2),
        disabled: !isBugging2
      },
      /* @__PURE__ */ React.createElement("span", null, "Pausar")
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "tw-btn tw-btn-neutral",
        onClick: () => setIsBugging2(!isBugging2),
        disabled: isBugging2
      },
      /* @__PURE__ */ React.createElement("span", null, "Iniciar")
    )), /* @__PURE__ */ React.createElement(Presets, { applyPreset }));
  }
  function Navbar() {
    const { user, loading } = useAuthState();
    const [currentPage, setCurrentPage] = reactExports.useState("login");
    reactExports.useEffect(() => {
      if (user) {
        setCurrentPage("home");
      } else {
        setCurrentPage("login");
      }
    }, [user]);
    const handleInputChange = (event) => {
      setCurrentPage(event.target.value);
    };
    const handleClick = () => {
      const dialog = document.getElementById("tw2toolspad");
      if (dialog && typeof dialog.close === "function") {
        dialog.close();
      } else {
        console.error("Element with id 'tw2toolspad' is not a <dialog> or showModal is not a function.");
      }
    };
    const renderPage = () => {
      if (!user && currentPage !== "login") {
        return /* @__PURE__ */ React.createElement(Login, { setCurrentPage });
      }
      switch (currentPage) {
        case "login":
          return /* @__PURE__ */ React.createElement(Login, { setCurrentPage });
        case "home":
          return /* @__PURE__ */ React.createElement(Home, { setCurrentPage });
        case "tropas":
          return /* @__PURE__ */ React.createElement(Tropas, { setCurrentPage });
        case "autobug/bug2":
          return /* @__PURE__ */ React.createElement(Bug2, { setCurrentPage });
        case "autobug":
          return /* @__PURE__ */ React.createElement(Bug1, { setCurrentPage });
        case "calculadora":
          return /* @__PURE__ */ React.createElement(AutoBug, { setCurrentPage });
        case "autobug/bug1":
          return /* @__PURE__ */ React.createElement(Bug1, { setCurrentPage });
        default:
          return /* @__PURE__ */ React.createElement(Login, { setCurrentPage });
      }
    };
    if (loading) {
      return /* @__PURE__ */ React.createElement("div", null, "Loading...");
    }
    return /* @__PURE__ */ React.createElement("div", { className: "tw-drawer tw-h-full tw-overflow-hidden" }, /* @__PURE__ */ React.createElement("input", { id: "my-drawer-3", type: "checkbox", className: "tw-drawer-toggle" }), /* @__PURE__ */ React.createElement("div", { className: "tw-drawer-content tw-flex tw-flex-col tw-h-full" }, /* @__PURE__ */ React.createElement("div", { className: "tw-mockup-browser tw-border tw-bg-base-300" }, /* @__PURE__ */ React.createElement("div", { className: "tw-mockup-browser-toolbar tw-rounded-t-lg" }, /* @__PURE__ */ React.createElement("div", { className: "tw-input" }, "tw2tools/", /* @__PURE__ */ React.createElement(
      Input,
      {
        type: "text",
        value: currentPage,
        onChange: handleInputChange,
        className: "tw-w-20 !tw-shadow-none !tw-border-none !tw-bg-none !tw-p-0",
        placeholder: "rota"
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "tw-flex tw-gap-1" }, /* @__PURE__ */ React.createElement(
      "a",
      {
        className: "tw-w-3 tw-h-3 tw-p-3 tw-bg-red-500 hover:tw-bg-red-600 tw-rounded-full tw-flex tw-items-center tw-justify-center",
        onClick: handleClick
      },
      /* @__PURE__ */ React.createElement("i", { className: "fas fa-times tw-text-gray-200 hover:tw-text-gray-100" })
    )))), /* @__PURE__ */ React.createElement("div", { className: "tw-navbar tw-bg-base-100" }, /* @__PURE__ */ React.createElement("div", { className: "tw-navbar-start" }, /* @__PURE__ */ React.createElement("div", { className: "tw-dropdown" }, /* @__PURE__ */ React.createElement(
      "label",
      {
        htmlFor: "my-drawer-3",
        tabIndex: 0,
        role: "button",
        className: `tw-btn tw-btn-ghost tw-lg:tw-hidden ${currentPage === "login" ? "tw-hidden" : ""}`
      },
      /* @__PURE__ */ React.createElement("i", { className: "fas fa-bars tw-h-5 tw-w-5" })
    )), /* @__PURE__ */ React.createElement("a", { className: "tw-btn tw-btn-ghost tw-text-xl" }, "Tw2 Tools")), /* @__PURE__ */ React.createElement("div", { className: "tw-navbar-center tw-lg:tw-flex" }, /* @__PURE__ */ React.createElement("ul", { className: "tw-menu tw-menu-horizontal tw-px-1" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
      "a",
      {
        className: "tw-font-bold",
        onClick: () => setCurrentPage("tropas")
      },
      "Tropas"
    )), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
      "a",
      {
        className: "tw-font-bold",
        onClick: () => setCurrentPage("autobug/bug2")
      },
      "AutoBug"
    )), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
      "a",
      {
        className: "tw-font-bold",
        onClick: () => setCurrentPage("calculadora")
      },
      "Calculadora"
    )))), /* @__PURE__ */ React.createElement("div", { className: "tw-navbar-end" })), /* @__PURE__ */ React.createElement("div", { className: "tw-bg-slate-200 tw-w-full tw-h-full tw-max-h-full" }, /* @__PURE__ */ React.createElement("div", { className: "tw-container tw-w-full tw-max-h-[645px] tw-flex tw-flex-col tw-items-center tw-justify-start tw-overflow-y-auto tw-p-4" }, renderPage(), /* @__PURE__ */ React.createElement(Q, null)))), /* @__PURE__ */ React.createElement("div", { className: "tw-drawer-side tw-h-full" }, /* @__PURE__ */ React.createElement(
      "label",
      {
        htmlFor: "my-drawer-3",
        "aria-label": "close sidebar",
        className: "tw-drawer-overlay"
      }
    ), /* @__PURE__ */ React.createElement("ul", { className: "tw-menu tw-p-4 tw-w-80 tw-min-h-full tw-bg-base-200" }, currentPage.startsWith("autobug") && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { onClick: () => setCurrentPage("autobug/bug1") }, "Bug1")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { onClick: () => setCurrentPage("autobug/bug2") }, "Bug2"))))));
  }
  function Tw2ToolsPad() {
    return /* @__PURE__ */ React.createElement("dialog", { id: "tw2toolspad", className: "tw-modal tw-text-black tw-font-normal" }, /* @__PURE__ */ React.createElement("div", { className: "tw-modal-box tw-w-3/4 tw-h-5/6 tw-max-w-screen-2xl tw-p-0 tw-flex tw-flex-col" }, /* @__PURE__ */ React.createElement(AuthProvider, null, /* @__PURE__ */ React.createElement(Navbar, null))));
  }
  function App() {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Tw2ToolsButton, null), /* @__PURE__ */ React.createElement(Tw2ToolsPad, null));
  }
  log("React script has successfully started");
  async function main() {
    const link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.href = "https://use.fontawesome.com/releases/v5.15.4/css/all.css";
    document.getElementsByTagName("head")[0].appendChild(link2);
    let menuContainer = null;
    let intervalId3;
    const fetchMenuContainer = () => {
      menuContainer = document.querySelector("#interface-bottom");
      if (menuContainer) {
        clearInterval(intervalId3);
        const container = document.createElement("div");
        container.style.zIndex = "99999";
        container.style.position = "absolute";
        container.style.left = "70px";
        container.style.top = "40px";
        menuContainer.appendChild(container);
        container.className = "shadow-root";
        const root = createRoot(container);
        root.render(/* @__PURE__ */ React.createElement(App, null));
      } else {
        log("The #interface-bottom element could not be found.");
      }
    };
    intervalId3 = window.setInterval(fetchMenuContainer, 1e3);
  }
  addLocationChangeCallback(() => {
    main().catch((e) => {
      log(e);
    });
  });
})();
;
(function(){
                    const el = document.createElement("style");
                    el.innerText = "body {\r\n  margin: 0;\r\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\",\r\n    \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\",\r\n    sans-serif;\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n\r\ncode {\r\n  font-family: source-code-pro, Menlo, Monaco, Consolas, \"Courier New\",\r\n    monospace;\r\n}\r\n/*\n! tailwindcss v3.4.3 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}::before,\n::after {\n  --tw-content: '';\n}/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n5. Use the user's configured `sans` font-feature-settings by default.\n6. Use the user's configured `sans` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/html,\n:host {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n  -webkit-tap-highlight-color: transparent; /* 7 */\n}/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/body {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/hr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/abbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}/*\nRemove the default font size and weight for headings.\n*/h1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/a {\n  color: inherit;\n  text-decoration: inherit;\n}/*\nAdd the correct font weight in Edge and Safari.\n*/b,\nstrong {\n  font-weight: bolder;\n}/*\n1. Use the user's configured `mono` font-family by default.\n2. Use the user's configured `mono` font-feature-settings by default.\n3. Use the user's configured `mono` font-variation-settings by default.\n4. Correct the odd `em` font sizing in all browsers.\n*/code,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */\n  font-feature-settings: normal; /* 2 */\n  font-variation-settings: normal; /* 3 */\n  font-size: 1em; /* 4 */\n}/*\nAdd the correct font size in all browsers.\n*/small {\n  font-size: 80%;\n}/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/sub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}sub {\n  bottom: -0.25em;\n}sup {\n  top: -0.5em;\n}/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/table {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/button,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  letter-spacing: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/button,\nselect {\n  text-transform: none;\n}/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/button,\ninput:where([type='button']),\ninput:where([type='reset']),\ninput:where([type='submit']) {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}/*\nUse the modern Firefox focus style for all focusable elements.\n*/:-moz-focusring {\n  outline: auto;\n}/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/:-moz-ui-invalid {\n  box-shadow: none;\n}/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/progress {\n  vertical-align: baseline;\n}/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/::-webkit-search-decoration {\n  -webkit-appearance: none;\n}/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}/*\nAdd the correct display in Chrome and Safari.\n*/summary {\n  display: list-item;\n}/*\nRemoves the default spacing and border for appropriate elements.\n*/blockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}fieldset {\n  margin: 0;\n  padding: 0;\n}legend {\n  padding: 0;\n}ol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}/*\nReset default styling for dialogs.\n*/dialog {\n  padding: 0;\n}/*\nPrevent resizing textareas horizontally by default.\n*/textarea {\n  resize: vertical;\n}/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/input::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}input::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}/*\nSet the default cursor for buttons.\n*/button,\n[role=\"button\"] {\n  cursor: pointer;\n}/*\nMake sure disabled buttons don't get the pointer cursor.\n*/:disabled {\n  cursor: default;\n}/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/img,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/img,\nvideo {\n  max-width: 100%;\n  height: auto;\n}/* Make elements with the HTML hidden attribute stay hidden by default */[hidden] {\n  display: none;\n}:root,\n[data-theme] {\n  background-color: var(--fallback-b1,oklch(var(--b1)/1));\n  color: var(--fallback-bc,oklch(var(--bc)/1));\n}@supports not (color: oklch(0% 0 0)) {\n\n  :root {\n    color-scheme: light;\n    --fallback-p: #491eff;\n    --fallback-pc: #d4dbff;\n    --fallback-s: #ff41c7;\n    --fallback-sc: #fff9fc;\n    --fallback-a: #00cfbd;\n    --fallback-ac: #00100d;\n    --fallback-n: #2b3440;\n    --fallback-nc: #d7dde4;\n    --fallback-b1: #ffffff;\n    --fallback-b2: #e5e6e6;\n    --fallback-b3: #e5e6e6;\n    --fallback-bc: #1f2937;\n    --fallback-in: #00b3f0;\n    --fallback-inc: #000000;\n    --fallback-su: #00ca92;\n    --fallback-suc: #000000;\n    --fallback-wa: #ffc22d;\n    --fallback-wac: #000000;\n    --fallback-er: #ff6f70;\n    --fallback-erc: #000000;\n  }\n\n  @media (prefers-color-scheme: dark) {\n\n    :root {\n      color-scheme: dark;\n      --fallback-p: #7582ff;\n      --fallback-pc: #050617;\n      --fallback-s: #ff71cf;\n      --fallback-sc: #190211;\n      --fallback-a: #00c7b5;\n      --fallback-ac: #000e0c;\n      --fallback-n: #2a323c;\n      --fallback-nc: #a6adbb;\n      --fallback-b1: #1d232a;\n      --fallback-b2: #191e24;\n      --fallback-b3: #15191e;\n      --fallback-bc: #a6adbb;\n      --fallback-in: #00b3f0;\n      --fallback-inc: #000000;\n      --fallback-su: #00ca92;\n      --fallback-suc: #000000;\n      --fallback-wa: #ffc22d;\n      --fallback-wac: #000000;\n      --fallback-er: #ff6f70;\n      --fallback-erc: #000000;\n    }\n  }\n}html {\n  -webkit-tap-highlight-color: transparent;\n}:root {\n  color-scheme: light;\n  --in: 72.06% 0.191 231.6;\n  --su: 64.8% 0.150 160;\n  --wa: 84.71% 0.199 83.87;\n  --er: 71.76% 0.221 22.18;\n  --pc: 89.824% 0.06192 275.75;\n  --ac: 15.352% 0.0368 183.61;\n  --inc: 0% 0 0;\n  --suc: 0% 0 0;\n  --wac: 0% 0 0;\n  --erc: 0% 0 0;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --p: 49.12% 0.3096 275.75;\n  --s: 69.71% 0.329 342.55;\n  --sc: 98.71% 0.0106 342.55;\n  --a: 76.76% 0.184 183.61;\n  --n: 32.1785% 0.02476 255.701624;\n  --nc: 89.4994% 0.011585 252.096176;\n  --b1: 100% 0 0;\n  --b2: 96.1151% 0 0;\n  --b3: 92.4169% 0.00108 197.137559;\n  --bc: 27.8078% 0.029596 256.847952;\n}@media (prefers-color-scheme: dark) {\n\n  :root {\n    color-scheme: dark;\n    --in: 72.06% 0.191 231.6;\n    --su: 64.8% 0.150 160;\n    --wa: 84.71% 0.199 83.87;\n    --er: 71.76% 0.221 22.18;\n    --pc: 13.138% 0.0392 275.75;\n    --sc: 14.96% 0.052 342.55;\n    --ac: 14.902% 0.0334 183.61;\n    --inc: 0% 0 0;\n    --suc: 0% 0 0;\n    --wac: 0% 0 0;\n    --erc: 0% 0 0;\n    --rounded-box: 1rem;\n    --rounded-btn: 0.5rem;\n    --rounded-badge: 1.9rem;\n    --animation-btn: 0.25s;\n    --animation-input: .2s;\n    --btn-focus-scale: 0.95;\n    --border-btn: 1px;\n    --tab-border: 1px;\n    --tab-radius: 0.5rem;\n    --p: 65.69% 0.196 275.75;\n    --s: 74.8% 0.26 342.55;\n    --a: 74.51% 0.167 183.61;\n    --n: 31.3815% 0.021108 254.139175;\n    --nc: 74.6477% 0.0216 264.435964;\n    --b1: 25.3267% 0.015896 252.417568;\n    --b2: 23.2607% 0.013807 253.100675;\n    --b3: 21.1484% 0.01165 254.087939;\n    --bc: 74.6477% 0.0216 264.435964;\n  }\n}[data-theme=light] {\n  color-scheme: light;\n  --in: 72.06% 0.191 231.6;\n  --su: 64.8% 0.150 160;\n  --wa: 84.71% 0.199 83.87;\n  --er: 71.76% 0.221 22.18;\n  --pc: 89.824% 0.06192 275.75;\n  --ac: 15.352% 0.0368 183.61;\n  --inc: 0% 0 0;\n  --suc: 0% 0 0;\n  --wac: 0% 0 0;\n  --erc: 0% 0 0;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --p: 49.12% 0.3096 275.75;\n  --s: 69.71% 0.329 342.55;\n  --sc: 98.71% 0.0106 342.55;\n  --a: 76.76% 0.184 183.61;\n  --n: 32.1785% 0.02476 255.701624;\n  --nc: 89.4994% 0.011585 252.096176;\n  --b1: 100% 0 0;\n  --b2: 96.1151% 0 0;\n  --b3: 92.4169% 0.00108 197.137559;\n  --bc: 27.8078% 0.029596 256.847952;\n}[data-theme=dark] {\n  color-scheme: dark;\n  --in: 72.06% 0.191 231.6;\n  --su: 64.8% 0.150 160;\n  --wa: 84.71% 0.199 83.87;\n  --er: 71.76% 0.221 22.18;\n  --pc: 13.138% 0.0392 275.75;\n  --sc: 14.96% 0.052 342.55;\n  --ac: 14.902% 0.0334 183.61;\n  --inc: 0% 0 0;\n  --suc: 0% 0 0;\n  --wac: 0% 0 0;\n  --erc: 0% 0 0;\n  --rounded-box: 1rem;\n  --rounded-btn: 0.5rem;\n  --rounded-badge: 1.9rem;\n  --animation-btn: 0.25s;\n  --animation-input: .2s;\n  --btn-focus-scale: 0.95;\n  --border-btn: 1px;\n  --tab-border: 1px;\n  --tab-radius: 0.5rem;\n  --p: 65.69% 0.196 275.75;\n  --s: 74.8% 0.26 342.55;\n  --a: 74.51% 0.167 183.61;\n  --n: 31.3815% 0.021108 254.139175;\n  --nc: 74.6477% 0.0216 264.435964;\n  --b1: 25.3267% 0.015896 252.417568;\n  --b2: 23.2607% 0.013807 253.100675;\n  --b3: 21.1484% 0.01165 254.087939;\n  --bc: 74.6477% 0.0216 264.435964;\n}*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}.tw-container {\n  width: 100%;\n}@media (min-width: 640px) {\n\n  .tw-container {\n    max-width: 640px;\n  }\n}@media (min-width: 768px) {\n\n  .tw-container {\n    max-width: 768px;\n  }\n}@media (min-width: 1024px) {\n\n  .tw-container {\n    max-width: 1024px;\n  }\n}@media (min-width: 1280px) {\n\n  .tw-container {\n    max-width: 1280px;\n  }\n}@media (min-width: 1536px) {\n\n  .tw-container {\n    max-width: 1536px;\n  }\n}@media (hover:hover) {\n\n  .tw-label a:hover {\n    --tw-text-opacity: 1;\n    color: var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)));\n  }\n\n  .tw-menu li > *:not(ul, .tw-menu-title, details, .tw-btn):active,\n.tw-menu li > *:not(ul, .tw-menu-title, details, .tw-btn).tw-active,\n.tw-menu li > details > summary:active {\n    --tw-bg-opacity: 1;\n    background-color: var(--fallback-n,oklch(var(--n)/var(--tw-bg-opacity)));\n    --tw-text-opacity: 1;\n    color: var(--fallback-nc,oklch(var(--nc)/var(--tw-text-opacity)));\n  }\n}.tw-btn {\n  display: inline-flex;\n  height: 3rem;\n  min-height: 3rem;\n  flex-shrink: 0;\n  cursor: pointer;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  border-radius: var(--rounded-btn, 0.5rem);\n  border-color: transparent;\n  border-color: oklch(var(--btn-color, var(--b2)) / var(--tw-border-opacity));\n  padding-left: 1rem;\n  padding-right: 1rem;\n  text-align: center;\n  font-size: 0.875rem;\n  line-height: 1em;\n  gap: 0.5rem;\n  font-weight: 600;\n  text-decoration-line: none;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  border-width: var(--border-btn, 1px);\n  transition-property: color, background-color, border-color, opacity, box-shadow, transform;\n  --tw-text-opacity: 1;\n  color: var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)));\n  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n  outline-color: var(--fallback-bc,oklch(var(--bc)/1));\n  background-color: oklch(var(--btn-color, var(--b2)) / var(--tw-bg-opacity));\n  --tw-bg-opacity: 1;\n  --tw-border-opacity: 1;\n}.tw-btn-disabled,\n  .tw-btn[disabled],\n  .tw-btn:disabled {\n  pointer-events: none;\n}:where(.tw-btn:is(input[type=\"checkbox\"])),\n:where(.tw-btn:is(input[type=\"radio\"])) {\n  width: auto;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n}.tw-btn:is(input[type=\"checkbox\"]):after,\n.tw-btn:is(input[type=\"radio\"]):after {\n  --tw-content: attr(aria-label);\n  content: var(--tw-content);\n}.tw-drawer {\n  position: relative;\n  display: grid;\n  grid-auto-columns: max-content auto;\n  width: 100%;\n}.tw-drawer-content {\n  grid-column-start: 2;\n  grid-row-start: 1;\n  min-width: 0px;\n}.tw-drawer-side {\n  pointer-events: none;\n  position: fixed;\n  inset-inline-start: 0px;\n  top: 0px;\n  grid-column-start: 1;\n  grid-row-start: 1;\n  display: grid;\n  width: 100%;\n  grid-template-columns: repeat(1, minmax(0, 1fr));\n  grid-template-rows: repeat(1, minmax(0, 1fr));\n  align-items: flex-start;\n  justify-items: start;\n  overflow-x: hidden;\n  overflow-y: hidden;\n  overscroll-behavior: contain;\n  height: 100vh;\n  height: 100dvh;\n}.tw-drawer-side > .tw-drawer-overlay {\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  position: sticky;\n  top: 0px;\n  place-self: stretch;\n  cursor: pointer;\n  background-color: transparent;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  transition-duration: 200ms;\n}.tw-drawer-side > * {\n  grid-column-start: 1;\n  grid-row-start: 1;\n}.tw-drawer-side > *:not(.tw-drawer-overlay) {\n  transition-property: transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  transition-duration: 300ms;\n  will-change: transform;\n  transform: translateX(-100%);\n}[dir=\"rtl\"] .tw-drawer-side > *:not(.tw-drawer-overlay) {\n  transform: translateX(100%);\n}.tw-drawer-toggle {\n  position: fixed;\n  height: 0px;\n  width: 0px;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  opacity: 0;\n}.tw-drawer-toggle:checked ~ .tw-drawer-side {\n  pointer-events: auto;\n  visibility: visible;\n  overflow-y: auto;\n}.tw-drawer-toggle:checked ~ .tw-drawer-side > *:not(.tw-drawer-overlay) {\n  transform: translateX(0%);\n}.tw-drawer-end .tw-drawer-toggle ~ .tw-drawer-content {\n  grid-column-start: 1;\n}.tw-drawer-end .tw-drawer-toggle ~ .tw-drawer-side {\n  grid-column-start: 2;\n  justify-items: end;\n}.tw-drawer-end .tw-drawer-toggle ~ .tw-drawer-side > *:not(.tw-drawer-overlay) {\n  transform: translateX(100%);\n}[dir=\"rtl\"] .tw-drawer-end .tw-drawer-toggle ~ .tw-drawer-side > *:not(.tw-drawer-overlay) {\n  transform: translateX(-100%);\n}.tw-drawer-end .tw-drawer-toggle:checked ~ .tw-drawer-side > *:not(.tw-drawer-overlay) {\n  transform: translateX(0%);\n}.tw-dropdown {\n  position: relative;\n  display: inline-block;\n}.tw-dropdown > *:not(summary):focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}.tw-dropdown .tw-dropdown-content {\n  position: absolute;\n}.tw-dropdown:is(:not(details)) .tw-dropdown-content {\n  visibility: hidden;\n  opacity: 0;\n  transform-origin: top;\n  --tw-scale-x: .95;\n  --tw-scale-y: .95;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  transition-duration: 200ms;\n}.tw-dropdown.tw-dropdown-open .tw-dropdown-content,\n.tw-dropdown:not(.tw-dropdown-hover):focus .tw-dropdown-content,\n.tw-dropdown:focus-within .tw-dropdown-content {\n  visibility: visible;\n  opacity: 1;\n}@media (hover: hover) {\n\n  .tw-dropdown.tw-dropdown-hover:hover .tw-dropdown-content {\n    visibility: visible;\n    opacity: 1;\n  }\n\n  .tw-btn:hover {\n    --tw-border-opacity: 1;\n    border-color: var(--fallback-b3,oklch(var(--b3)/var(--tw-border-opacity)));\n    --tw-bg-opacity: 1;\n    background-color: var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity)));\n  }\n\n  @supports (color: color-mix(in oklab, black, black)) {\n\n    .tw-btn:hover {\n      background-color: color-mix(\n            in oklab,\n            oklch(var(--btn-color, var(--b2)) / var(--tw-bg-opacity, 1)) 90%,\n            black\n          );\n      border-color: color-mix(\n            in oklab,\n            oklch(var(--btn-color, var(--b2)) / var(--tw-border-opacity, 1)) 90%,\n            black\n          );\n    }\n  }\n\n  @supports not (color: oklch(0% 0 0)) {\n\n    .tw-btn:hover {\n      background-color: var(--btn-color, var(--fallback-b2));\n      border-color: var(--btn-color, var(--fallback-b2));\n    }\n  }\n\n  .tw-btn:hover {\n    --tw-border-opacity: 1;\n    border-color: var(--fallback-b3,oklch(var(--b3)/var(--tw-border-opacity)));\n    --tw-bg-opacity: 1;\n    background-color: var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity)));\n  }\n\n  @supports (color: color-mix(in oklab, black, black)) {\n\n    .tw-btn:hover {\n      background-color: color-mix(\n            in oklab,\n            oklch(var(--btn-color, var(--b2)) / var(--tw-bg-opacity, 1)) 90%,\n            black\n          );\n      border-color: color-mix(\n            in oklab,\n            oklch(var(--btn-color, var(--b2)) / var(--tw-border-opacity, 1)) 90%,\n            black\n          );\n    }\n  }\n\n  @supports not (color: oklch(0% 0 0)) {\n\n    .tw-btn:hover {\n      background-color: var(--btn-color, var(--fallback-b2));\n      border-color: var(--btn-color, var(--fallback-b2));\n    }\n  }\n\n  .tw-btn:hover {\n    --tw-border-opacity: 1;\n    border-color: var(--fallback-b3,oklch(var(--b3)/var(--tw-border-opacity)));\n    --tw-bg-opacity: 1;\n    background-color: var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity)));\n  }\n\n  @supports (color: color-mix(in oklab, black, black)) {\n\n    .tw-btn:hover {\n      background-color: color-mix(\n            in oklab,\n            oklch(var(--btn-color, var(--b2)) / var(--tw-bg-opacity, 1)) 90%,\n            black\n          );\n      border-color: color-mix(\n            in oklab,\n            oklch(var(--btn-color, var(--b2)) / var(--tw-border-opacity, 1)) 90%,\n            black\n          );\n    }\n  }\n\n  @supports not (color: oklch(0% 0 0)) {\n\n    .tw-btn:hover {\n      background-color: var(--btn-color, var(--fallback-b2));\n      border-color: var(--btn-color, var(--fallback-b2));\n    }\n  }\n\n  .tw-btn.tw-glass:hover {\n    --glass-opacity: 25%;\n    --glass-border-opacity: 15%;\n  }\n\n  .tw-btn-ghost:hover {\n    border-color: transparent;\n  }\n\n  @supports (color: oklch(0% 0 0)) {\n\n    .tw-btn-ghost:hover {\n      background-color: var(--fallback-bc,oklch(var(--bc)/0.2));\n    }\n  }\n\n  .tw-btn-ghost:hover {\n    border-color: transparent;\n  }\n\n  @supports (color: oklch(0% 0 0)) {\n\n    .tw-btn-ghost:hover {\n      background-color: var(--fallback-bc,oklch(var(--bc)/0.2));\n    }\n  }\n\n  .tw-btn-outline.tw-btn-primary:hover {\n    --tw-text-opacity: 1;\n    color: var(--fallback-pc,oklch(var(--pc)/var(--tw-text-opacity)));\n  }\n\n  @supports (color: color-mix(in oklab, black, black)) {\n\n    .tw-btn-outline.tw-btn-primary:hover {\n      background-color: color-mix(in oklab, var(--fallback-p,oklch(var(--p)/1)) 90%, black);\n      border-color: color-mix(in oklab, var(--fallback-p,oklch(var(--p)/1)) 90%, black);\n    }\n  }\n\n  .tw-btn-outline.tw-btn-primary:hover {\n    --tw-text-opacity: 1;\n    color: var(--fallback-pc,oklch(var(--pc)/var(--tw-text-opacity)));\n  }\n\n  @supports (color: color-mix(in oklab, black, black)) {\n\n    .tw-btn-outline.tw-btn-primary:hover {\n      background-color: color-mix(in oklab, var(--fallback-p,oklch(var(--p)/1)) 90%, black);\n      border-color: color-mix(in oklab, var(--fallback-p,oklch(var(--p)/1)) 90%, black);\n    }\n  }\n\n  .tw-btn-disabled:hover,\n    .tw-btn[disabled]:hover,\n    .tw-btn:disabled:hover {\n    --tw-border-opacity: 0;\n    background-color: var(--fallback-n,oklch(var(--n)/var(--tw-bg-opacity)));\n    --tw-bg-opacity: 0.2;\n    color: var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)));\n    --tw-text-opacity: 0.2;\n  }\n\n  @supports (color: color-mix(in oklab, black, black)) {\n\n    .tw-btn:is(input[type=\"checkbox\"]:checked):hover, .tw-btn:is(input[type=\"radio\"]:checked):hover {\n      background-color: color-mix(in oklab, var(--fallback-p,oklch(var(--p)/1)) 90%, black);\n      border-color: color-mix(in oklab, var(--fallback-p,oklch(var(--p)/1)) 90%, black);\n    }\n  }\n\n  .tw-dropdown.tw-dropdown-hover:hover .tw-dropdown-content {\n    --tw-scale-x: 1;\n    --tw-scale-y: 1;\n    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n  }\n\n  :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > *:not(ul, details, .tw-menu-title)):not(.tw-active, .tw-btn):hover, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > details > summary:not(.tw-menu-title)):not(.tw-active, .tw-btn):hover {\n    cursor: pointer;\n    outline: 2px solid transparent;\n    outline-offset: 2px;\n  }\n\n  @supports (color: oklch(0% 0 0)) {\n\n    :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > *:not(ul, details, .tw-menu-title)):not(.tw-active, .tw-btn):hover, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > details > summary:not(.tw-menu-title)):not(.tw-active, .tw-btn):hover {\n      background-color: var(--fallback-bc,oklch(var(--bc)/0.1));\n    }\n  }\n\n  :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > *:not(ul, details, .tw-menu-title)):not(.tw-active, .tw-btn):hover, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > details > summary:not(.tw-menu-title)):not(.tw-active, .tw-btn):hover {\n    cursor: pointer;\n    outline: 2px solid transparent;\n    outline-offset: 2px;\n  }\n\n  @supports (color: oklch(0% 0 0)) {\n\n    :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > *:not(ul, details, .tw-menu-title)):not(.tw-active, .tw-btn):hover, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > details > summary:not(.tw-menu-title)):not(.tw-active, .tw-btn):hover {\n      background-color: var(--fallback-bc,oklch(var(--bc)/0.1));\n    }\n  }\n\n  :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > *:not(ul, details, .tw-menu-title)):not(.tw-active, .tw-btn):hover, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > details > summary:not(.tw-menu-title)):not(.tw-active, .tw-btn):hover {\n    cursor: pointer;\n    outline: 2px solid transparent;\n    outline-offset: 2px;\n  }\n\n  @supports (color: oklch(0% 0 0)) {\n\n    :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > *:not(ul, details, .tw-menu-title)):not(.tw-active, .tw-btn):hover, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > details > summary:not(.tw-menu-title)):not(.tw-active, .tw-btn):hover {\n      background-color: var(--fallback-bc,oklch(var(--bc)/0.1));\n    }\n  }\n\n  :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > *:not(ul, details, .tw-menu-title)):not(.tw-active, .tw-btn):hover, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > details > summary:not(.tw-menu-title)):not(.tw-active, .tw-btn):hover {\n    cursor: pointer;\n    outline: 2px solid transparent;\n    outline-offset: 2px;\n  }\n\n  @supports (color: oklch(0% 0 0)) {\n\n    :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > *:not(ul, details, .tw-menu-title)):not(.tw-active, .tw-btn):hover, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > details > summary:not(.tw-menu-title)):not(.tw-active, .tw-btn):hover {\n      background-color: var(--fallback-bc,oklch(var(--bc)/0.1));\n    }\n  }\n}.tw-dropdown:is(details) summary::-webkit-details-marker {\n  display: none;\n}.tw-form-control {\n  display: flex;\n  flex-direction: column;\n}.tw-label {\n  display: flex;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  align-items: center;\n  justify-content: space-between;\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}.tw-hero {\n  display: grid;\n  width: 100%;\n  place-items: center;\n  background-size: cover;\n  background-position: center;\n}.tw-hero > * {\n  grid-column-start: 1;\n  grid-row-start: 1;\n}.tw-hero-content {\n  z-index: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  max-width: 80rem;\n  gap: 1rem;\n  padding: 1rem;\n}.tw-input {\n  flex-shrink: 1;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  height: 3rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  font-size: 1rem;\n  line-height: 2;\n  line-height: 1.5rem;\n  border-radius: var(--rounded-btn, 0.5rem);\n  border-width: 1px;\n  border-color: transparent;\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)));\n}.tw-input[type=\"number\"]::-webkit-inner-spin-button,\n.tw-input-md[type=\"number\"]::-webkit-inner-spin-button {\n  margin-top: -1rem;\n  margin-bottom: -1rem;\n  margin-inline-end: -1rem;\n}.tw-join .tw-dropdown .tw-join-item:first-child:not(:last-child),\n  .tw-join *:first-child:not(:last-child) .tw-dropdown .tw-join-item {\n  border-start-end-radius: inherit;\n  border-end-end-radius: inherit;\n}.tw-menu {\n  display: flex;\n  flex-direction: column;\n  flex-wrap: wrap;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  padding: 0.5rem;\n}.tw-menu :where(li ul) {\n  position: relative;\n  white-space: nowrap;\n  margin-inline-start: 1rem;\n  padding-inline-start: 0.5rem;\n}.tw-menu :where(li:not(.tw-menu-title) > *:not(ul, details, .tw-menu-title, .tw-btn)), .tw-menu :where(li:not(.tw-menu-title) > details > summary:not(.tw-menu-title)) {\n  display: grid;\n  grid-auto-flow: column;\n  align-content: flex-start;\n  align-items: center;\n  gap: 0.5rem;\n  grid-auto-columns: minmax(auto, max-content) auto max-content;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}.tw-menu li.tw-disabled {\n  cursor: not-allowed;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  color: var(--fallback-bc,oklch(var(--bc)/0.3));\n}.tw-menu :where(li > .tw-menu-dropdown:not(.tw-menu-dropdown-show)) {\n  display: none;\n}:where(.tw-menu li) {\n  position: relative;\n  display: flex;\n  flex-shrink: 0;\n  flex-direction: column;\n  flex-wrap: wrap;\n  align-items: stretch;\n}:where(.tw-menu li) .tw-badge {\n  justify-self: end;\n}.tw-mockup-browser {\n  position: relative;\n  overflow: hidden;\n  overflow-x: auto;\n  border-radius: var(--rounded-box, 1rem);\n}.tw-mockup-browser pre[data-prefix]:before {\n  content: attr(data-prefix);\n  display: inline-block;\n  text-align: right;\n}.tw-modal {\n  pointer-events: none;\n  position: fixed;\n  inset: 0px;\n  margin: 0px;\n  display: grid;\n  height: 100%;\n  max-height: none;\n  width: 100%;\n  max-width: none;\n  justify-items: center;\n  padding: 0px;\n  opacity: 0;\n  overscroll-behavior: contain;\n  z-index: 999;\n  background-color: transparent;\n  color: inherit;\n  transition-duration: 200ms;\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  transition-property: transform, opacity, visibility;\n  overflow-y: hidden;\n}:where(.tw-modal) {\n  align-items: center;\n}.tw-modal-box {\n  max-height: calc(100vh - 5em);\n  grid-column-start: 1;\n  grid-row-start: 1;\n  width: 91.666667%;\n  max-width: 32rem;\n  --tw-scale-x: .9;\n  --tw-scale-y: .9;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n  border-bottom-right-radius: var(--rounded-box, 1rem);\n  border-bottom-left-radius: var(--rounded-box, 1rem);\n  border-top-left-radius: var(--rounded-box, 1rem);\n  border-top-right-radius: var(--rounded-box, 1rem);\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)));\n  padding: 1.5rem;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  transition-duration: 200ms;\n  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n}.tw-modal-open,\n.tw-modal:target,\n.tw-modal-toggle:checked + .tw-modal,\n.tw-modal[open] {\n  pointer-events: auto;\n  visibility: visible;\n  opacity: 1;\n}:root:has(:is(.tw-modal-open, .tw-modal:target, .tw-modal-toggle:checked + .tw-modal, .tw-modal[open])) {\n  overflow: hidden;\n  scrollbar-gutter: stable;\n}.tw-navbar {\n  display: flex;\n  align-items: center;\n  padding: var(--navbar-padding, 0.5rem);\n  min-height: 4rem;\n  width: 100%;\n}:where(.tw-navbar > *:not(script, style)) {\n  display: inline-flex;\n  align-items: center;\n}.tw-navbar-start {\n  width: 50%;\n  justify-content: flex-start;\n}.tw-navbar-center {\n  flex-shrink: 0;\n}.tw-navbar-end {\n  width: 50%;\n  justify-content: flex-end;\n}.tw-select {\n  display: inline-flex;\n  cursor: pointer;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  height: 3rem;\n  min-height: 3rem;\n  padding-left: 1rem;\n  padding-right: 2.5rem;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  line-height: 2;\n  border-radius: var(--rounded-btn, 0.5rem);\n  border-width: 1px;\n  border-color: transparent;\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)));\n  background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),\n    linear-gradient(135deg, currentColor 50%, transparent 50%);\n  background-position: calc(100% - 20px) calc(1px + 50%),\n    calc(100% - 16.1px) calc(1px + 50%);\n  background-size: 4px 4px,\n    4px 4px;\n  background-repeat: no-repeat;\n}.tw-select[multiple] {\n  height: auto;\n}.tw-btm-nav > * .tw-label {\n  font-size: 1rem;\n  line-height: 1.5rem;\n}@media (prefers-reduced-motion: no-preference) {\n\n  .tw-btn {\n    animation: button-pop var(--animation-btn, 0.25s) ease-out;\n  }\n}.tw-btn:active:hover,\n  .tw-btn:active:focus {\n  animation: button-pop 0s ease-out;\n  transform: scale(var(--btn-focus-scale, 0.97));\n}@supports not (color: oklch(0% 0 0)) {\n\n  .tw-btn {\n    background-color: var(--btn-color, var(--fallback-b2));\n    border-color: var(--btn-color, var(--fallback-b2));\n  }\n\n  .tw-btn-primary {\n    --btn-color: var(--fallback-p);\n  }\n\n  .tw-btn-neutral {\n    --btn-color: var(--fallback-n);\n  }\n}@supports (color: color-mix(in oklab, black, black)) {\n\n  .tw-btn-active {\n    background-color: color-mix(\n          in oklab,\n          oklch(var(--btn-color, var(--b3)) / var(--tw-bg-opacity, 1)) 90%,\n          black\n        );\n    border-color: color-mix(\n          in oklab,\n          oklch(var(--btn-color, var(--b3)) / var(--tw-border-opacity, 1)) 90%,\n          black\n        );\n  }\n\n  .tw-btn-outline.tw-btn-primary.tw-btn-active {\n    background-color: color-mix(in oklab, var(--fallback-p,oklch(var(--p)/1)) 90%, black);\n    border-color: color-mix(in oklab, var(--fallback-p,oklch(var(--p)/1)) 90%, black);\n  }\n\n  .tw-btn-outline.tw-btn-secondary.tw-btn-active {\n    background-color: color-mix(in oklab, var(--fallback-s,oklch(var(--s)/1)) 90%, black);\n    border-color: color-mix(in oklab, var(--fallback-s,oklch(var(--s)/1)) 90%, black);\n  }\n\n  .tw-btn-outline.tw-btn-accent.tw-btn-active {\n    background-color: color-mix(in oklab, var(--fallback-a,oklch(var(--a)/1)) 90%, black);\n    border-color: color-mix(in oklab, var(--fallback-a,oklch(var(--a)/1)) 90%, black);\n  }\n\n  .tw-btn-outline.tw-btn-success.tw-btn-active {\n    background-color: color-mix(in oklab, var(--fallback-su,oklch(var(--su)/1)) 90%, black);\n    border-color: color-mix(in oklab, var(--fallback-su,oklch(var(--su)/1)) 90%, black);\n  }\n\n  .tw-btn-outline.tw-btn-info.tw-btn-active {\n    background-color: color-mix(in oklab, var(--fallback-in,oklch(var(--in)/1)) 90%, black);\n    border-color: color-mix(in oklab, var(--fallback-in,oklch(var(--in)/1)) 90%, black);\n  }\n\n  .tw-btn-outline.tw-btn-warning.tw-btn-active {\n    background-color: color-mix(in oklab, var(--fallback-wa,oklch(var(--wa)/1)) 90%, black);\n    border-color: color-mix(in oklab, var(--fallback-wa,oklch(var(--wa)/1)) 90%, black);\n  }\n\n  .tw-btn-outline.tw-btn-error.tw-btn-active {\n    background-color: color-mix(in oklab, var(--fallback-er,oklch(var(--er)/1)) 90%, black);\n    border-color: color-mix(in oklab, var(--fallback-er,oklch(var(--er)/1)) 90%, black);\n  }\n}.tw-btn:focus-visible {\n  outline-style: solid;\n  outline-width: 2px;\n  outline-offset: 2px;\n}.tw-btn-primary {\n  --tw-text-opacity: 1;\n  color: var(--fallback-pc,oklch(var(--pc)/var(--tw-text-opacity)));\n  outline-color: var(--fallback-p,oklch(var(--p)/1));\n}@supports (color: oklch(0% 0 0)) {\n\n  .tw-btn-primary {\n    --btn-color: var(--p);\n  }\n\n  .tw-btn-neutral {\n    --btn-color: var(--n);\n  }\n}.tw-btn-neutral {\n  --tw-text-opacity: 1;\n  color: var(--fallback-nc,oklch(var(--nc)/var(--tw-text-opacity)));\n  outline-color: var(--fallback-n,oklch(var(--n)/1));\n}.tw-btn.tw-glass {\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n  outline-color: currentColor;\n}.tw-btn.tw-glass.tw-btn-active {\n  --glass-opacity: 25%;\n  --glass-border-opacity: 15%;\n}.tw-btn-ghost {\n  border-width: 1px;\n  border-color: transparent;\n  background-color: transparent;\n  color: currentColor;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n  outline-color: currentColor;\n}.tw-btn-ghost.tw-btn-active {\n  border-color: transparent;\n  background-color: var(--fallback-bc,oklch(var(--bc)/0.2));\n}.tw-btn-link.tw-btn-active {\n  border-color: transparent;\n  background-color: transparent;\n  text-decoration-line: underline;\n}.tw-btn-outline.tw-btn-active {\n  --tw-border-opacity: 1;\n  border-color: var(--fallback-bc,oklch(var(--bc)/var(--tw-border-opacity)));\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-bc,oklch(var(--bc)/var(--tw-bg-opacity)));\n  --tw-text-opacity: 1;\n  color: var(--fallback-b1,oklch(var(--b1)/var(--tw-text-opacity)));\n}.tw-btn-outline.tw-btn-primary {\n  --tw-text-opacity: 1;\n  color: var(--fallback-p,oklch(var(--p)/var(--tw-text-opacity)));\n}.tw-btn-outline.tw-btn-primary.tw-btn-active {\n  --tw-text-opacity: 1;\n  color: var(--fallback-pc,oklch(var(--pc)/var(--tw-text-opacity)));\n}.tw-btn-outline.tw-btn-secondary.tw-btn-active {\n  --tw-text-opacity: 1;\n  color: var(--fallback-sc,oklch(var(--sc)/var(--tw-text-opacity)));\n}.tw-btn-outline.tw-btn-accent.tw-btn-active {\n  --tw-text-opacity: 1;\n  color: var(--fallback-ac,oklch(var(--ac)/var(--tw-text-opacity)));\n}.tw-btn-outline.tw-btn-success.tw-btn-active {\n  --tw-text-opacity: 1;\n  color: var(--fallback-suc,oklch(var(--suc)/var(--tw-text-opacity)));\n}.tw-btn-outline.tw-btn-info.tw-btn-active {\n  --tw-text-opacity: 1;\n  color: var(--fallback-inc,oklch(var(--inc)/var(--tw-text-opacity)));\n}.tw-btn-outline.tw-btn-warning.tw-btn-active {\n  --tw-text-opacity: 1;\n  color: var(--fallback-wac,oklch(var(--wac)/var(--tw-text-opacity)));\n}.tw-btn-outline.tw-btn-error.tw-btn-active {\n  --tw-text-opacity: 1;\n  color: var(--fallback-erc,oklch(var(--erc)/var(--tw-text-opacity)));\n}.tw-btn.tw-btn-disabled,\n  .tw-btn[disabled],\n  .tw-btn:disabled {\n  --tw-border-opacity: 0;\n  background-color: var(--fallback-n,oklch(var(--n)/var(--tw-bg-opacity)));\n  --tw-bg-opacity: 0.2;\n  color: var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)));\n  --tw-text-opacity: 0.2;\n}.tw-btn:is(input[type=\"checkbox\"]:checked),\n.tw-btn:is(input[type=\"radio\"]:checked) {\n  --tw-border-opacity: 1;\n  border-color: var(--fallback-p,oklch(var(--p)/var(--tw-border-opacity)));\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-p,oklch(var(--p)/var(--tw-bg-opacity)));\n  --tw-text-opacity: 1;\n  color: var(--fallback-pc,oklch(var(--pc)/var(--tw-text-opacity)));\n}.tw-btn:is(input[type=\"checkbox\"]:checked):focus-visible, .tw-btn:is(input[type=\"radio\"]:checked):focus-visible {\n  outline-color: var(--fallback-p,oklch(var(--p)/1));\n}@keyframes button-pop {\n\n  0% {\n    transform: scale(var(--btn-focus-scale, 0.98));\n  }\n\n  40% {\n    transform: scale(1.02);\n  }\n\n  100% {\n    transform: scale(1);\n  }\n}@keyframes checkmark {\n\n  0% {\n    background-position-y: 5px;\n  }\n\n  50% {\n    background-position-y: -2px;\n  }\n\n  100% {\n    background-position-y: 0;\n  }\n}.tw-drawer-toggle:checked ~ .tw-drawer-side > .tw-drawer-overlay {\n  background-color: #0006;\n}.tw-drawer-toggle:focus-visible ~ .tw-drawer-content label.tw-drawer-button {\n  outline-style: solid;\n  outline-width: 2px;\n  outline-offset: 2px;\n}.tw-dropdown.tw-dropdown-open .tw-dropdown-content,\n.tw-dropdown:focus .tw-dropdown-content,\n.tw-dropdown:focus-within .tw-dropdown-content {\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}.tw-label-text {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  --tw-text-opacity: 1;\n  color: var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)));\n}.tw-input input {\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-p,oklch(var(--p)/var(--tw-bg-opacity)));\n  background-color: transparent;\n}.tw-input input:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}.tw-input[list]::-webkit-calendar-picker-indicator {\n  line-height: 1em;\n}.tw-input-bordered {\n  border-color: var(--fallback-bc,oklch(var(--bc)/0.2));\n}.tw-input:focus,\n  .tw-input:focus-within {\n  box-shadow: none;\n  border-color: var(--fallback-bc,oklch(var(--bc)/0.2));\n  outline-style: solid;\n  outline-width: 2px;\n  outline-offset: 2px;\n  outline-color: var(--fallback-bc,oklch(var(--bc)/0.2));\n}.tw-input:has(> input[disabled]),\n  .tw-input-disabled,\n  .tw-input:disabled,\n  .tw-input[disabled] {\n  cursor: not-allowed;\n  --tw-border-opacity: 1;\n  border-color: var(--fallback-b2,oklch(var(--b2)/var(--tw-border-opacity)));\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)));\n  color: var(--fallback-bc,oklch(var(--bc)/0.4));\n}.tw-input:has(> input[disabled])::-moz-placeholder, .tw-input-disabled::-moz-placeholder, .tw-input:disabled::-moz-placeholder, .tw-input[disabled]::-moz-placeholder {\n  color: var(--fallback-bc,oklch(var(--bc)/var(--tw-placeholder-opacity)));\n  --tw-placeholder-opacity: 0.2;\n}.tw-input:has(> input[disabled])::placeholder,\n  .tw-input-disabled::placeholder,\n  .tw-input:disabled::placeholder,\n  .tw-input[disabled]::placeholder {\n  color: var(--fallback-bc,oklch(var(--bc)/var(--tw-placeholder-opacity)));\n  --tw-placeholder-opacity: 0.2;\n}.tw-input:has(> input[disabled]) > input[disabled] {\n  cursor: not-allowed;\n}.tw-input::-webkit-date-and-time-value {\n  text-align: inherit;\n}:where(.tw-menu li:empty) {\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-bc,oklch(var(--bc)/var(--tw-bg-opacity)));\n  opacity: 0.1;\n  margin: 0.5rem 1rem;\n  height: 1px;\n}.tw-menu :where(li ul):before {\n  position: absolute;\n  bottom: 0.75rem;\n  inset-inline-start: 0px;\n  top: 0.75rem;\n  width: 1px;\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-bc,oklch(var(--bc)/var(--tw-bg-opacity)));\n  opacity: 0.1;\n  content: \"\";\n}.tw-menu :where(li:not(.tw-menu-title) > *:not(ul, details, .tw-menu-title, .tw-btn)),\n.tw-menu :where(li:not(.tw-menu-title) > details > summary:not(.tw-menu-title)) {\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  border-radius: var(--rounded-btn, 0.5rem);\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  text-align: start;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  transition-duration: 200ms;\n  text-wrap: balance;\n}:where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > *:not(ul, details, .tw-menu-title)):not(summary, .tw-active, .tw-btn).tw-focus, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > *:not(ul, details, .tw-menu-title)):not(summary, .tw-active, .tw-btn):focus, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > *:not(ul, details, .tw-menu-title)):is(summary):not(.tw-active, .tw-btn):focus-visible, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > details > summary:not(.tw-menu-title)):not(summary, .tw-active, .tw-btn).tw-focus, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > details > summary:not(.tw-menu-title)):not(summary, .tw-active, .tw-btn):focus, :where(.tw-menu li:not(.tw-menu-title, .tw-disabled) > details > summary:not(.tw-menu-title)):is(summary):not(.tw-active, .tw-btn):focus-visible {\n  cursor: pointer;\n  background-color: var(--fallback-bc,oklch(var(--bc)/0.1));\n  --tw-text-opacity: 1;\n  color: var(--fallback-bc,oklch(var(--bc)/var(--tw-text-opacity)));\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}.tw-menu li > *:not(ul, .tw-menu-title, details, .tw-btn):active,\n.tw-menu li > *:not(ul, .tw-menu-title, details, .tw-btn).tw-active,\n.tw-menu li > details > summary:active {\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-n,oklch(var(--n)/var(--tw-bg-opacity)));\n  --tw-text-opacity: 1;\n  color: var(--fallback-nc,oklch(var(--nc)/var(--tw-text-opacity)));\n}.tw-menu :where(li > details > summary)::-webkit-details-marker {\n  display: none;\n}.tw-menu :where(li > details > summary):after,\n.tw-menu :where(li > .tw-menu-dropdown-toggle):after {\n  justify-self: end;\n  display: block;\n  margin-top: -0.5rem;\n  height: 0.5rem;\n  width: 0.5rem;\n  transform: rotate(45deg);\n  transition-property: transform, margin-top;\n  transition-duration: 0.3s;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  content: \"\";\n  transform-origin: 75% 75%;\n  box-shadow: 2px 2px;\n  pointer-events: none;\n}.tw-menu :where(li > details[open] > summary):after,\n.tw-menu :where(li > .tw-menu-dropdown-toggle.tw-menu-dropdown-show):after {\n  transform: rotate(225deg);\n  margin-top: 0;\n}.tw-mockup-browser .tw-mockup-browser-toolbar {\n  margin-top: 0.75rem;\n  margin-bottom: 0.75rem;\n  display: inline-flex;\n  width: 100%;\n  align-items: center;\n  padding-right: 1.4em;\n}:is([dir=\"rtl\"] .tw-mockup-browser .tw-mockup-browser-toolbar) {\n  flex-direction: row-reverse;\n}.tw-mockup-browser .tw-mockup-browser-toolbar:before {\n  content: \"\";\n  margin-right: 4.8rem;\n  display: inline-block;\n  aspect-ratio: 1 / 1;\n  height: 0.75rem;\n  border-radius: 9999px;\n  opacity: 0.3;\n  box-shadow: 1.4em 0,\n          2.8em 0,\n          4.2em 0;\n}.tw-mockup-browser .tw-mockup-browser-toolbar .tw-input {\n  position: relative;\n  margin-left: auto;\n  margin-right: auto;\n  display: block;\n  height: 1.75rem;\n  width: 24rem;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)));\n  padding-left: 2rem;\n  direction: ltr;\n}.tw-mockup-browser .tw-mockup-browser-toolbar .tw-input:before {\n  content: \"\";\n  position: absolute;\n  left: 0.5rem;\n  top: 50%;\n  aspect-ratio: 1 / 1;\n  height: 0.75rem;\n  --tw-translate-y: -50%;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n  border-radius: 9999px;\n  border-width: 2px;\n  border-color: currentColor;\n  opacity: 0.6;\n}.tw-mockup-browser .tw-mockup-browser-toolbar .tw-input:after {\n  content: \"\";\n  position: absolute;\n  left: 1.25rem;\n  top: 50%;\n  height: 0.5rem;\n  --tw-translate-y: 25%;\n  --tw-rotate: -45deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n  border-radius: 9999px;\n  border-width: 1px;\n  border-color: currentColor;\n  opacity: 0.6;\n}.tw-modal:not(dialog:not(.tw-modal-open)),\n  .tw-modal::backdrop {\n  background-color: #0006;\n  animation: modal-pop 0.2s ease-out;\n}.tw-modal-open .tw-modal-box,\n.tw-modal-toggle:checked + .tw-modal .tw-modal-box,\n.tw-modal:target .tw-modal-box,\n.tw-modal[open] .tw-modal-box {\n  --tw-translate-y: 0px;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}@keyframes modal-pop {\n\n  0% {\n    opacity: 0;\n  }\n}@keyframes progress-loading {\n\n  50% {\n    background-position-x: -115%;\n  }\n}@keyframes radiomark {\n\n  0% {\n    box-shadow: 0 0 0 12px var(--fallback-b1,oklch(var(--b1)/1)) inset,\n      0 0 0 12px var(--fallback-b1,oklch(var(--b1)/1)) inset;\n  }\n\n  50% {\n    box-shadow: 0 0 0 3px var(--fallback-b1,oklch(var(--b1)/1)) inset,\n      0 0 0 3px var(--fallback-b1,oklch(var(--b1)/1)) inset;\n  }\n\n  100% {\n    box-shadow: 0 0 0 4px var(--fallback-b1,oklch(var(--b1)/1)) inset,\n      0 0 0 4px var(--fallback-b1,oklch(var(--b1)/1)) inset;\n  }\n}@keyframes rating-pop {\n\n  0% {\n    transform: translateY(-0.125em);\n  }\n\n  40% {\n    transform: translateY(-0.125em);\n  }\n\n  100% {\n    transform: translateY(0);\n  }\n}.tw-select-bordered {\n  border-color: var(--fallback-bc,oklch(var(--bc)/0.2));\n}.tw-select:focus {\n  box-shadow: none;\n  border-color: var(--fallback-bc,oklch(var(--bc)/0.2));\n  outline-style: solid;\n  outline-width: 2px;\n  outline-offset: 2px;\n  outline-color: var(--fallback-bc,oklch(var(--bc)/0.2));\n}.tw-select-disabled,\n  .tw-select:disabled,\n  .tw-select[disabled] {\n  cursor: not-allowed;\n  --tw-border-opacity: 1;\n  border-color: var(--fallback-b2,oklch(var(--b2)/var(--tw-border-opacity)));\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)));\n  color: var(--fallback-bc,oklch(var(--bc)/0.4));\n}.tw-select-disabled::-moz-placeholder, .tw-select:disabled::-moz-placeholder, .tw-select[disabled]::-moz-placeholder {\n  color: var(--fallback-bc,oklch(var(--bc)/var(--tw-placeholder-opacity)));\n  --tw-placeholder-opacity: 0.2;\n}.tw-select-disabled::placeholder,\n  .tw-select:disabled::placeholder,\n  .tw-select[disabled]::placeholder {\n  color: var(--fallback-bc,oklch(var(--bc)/var(--tw-placeholder-opacity)));\n  --tw-placeholder-opacity: 0.2;\n}.tw-select-multiple,\n  .tw-select[multiple],\n  .tw-select[size].tw-select:not([size=\"1\"]) {\n  background-image: none;\n  padding-right: 1rem;\n}[dir=\"rtl\"] .tw-select {\n  background-position: calc(0% + 12px) calc(1px + 50%),\n    calc(0% + 16px) calc(1px + 50%);\n}@keyframes skeleton {\n\n  from {\n    background-position: 150%;\n  }\n\n  to {\n    background-position: -50%;\n  }\n}@keyframes toast-pop {\n\n  0% {\n    transform: scale(0.9);\n    opacity: 0;\n  }\n\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}.tw-glass,\n  .tw-glass.tw-btn-active {\n  border: none;\n  -webkit-backdrop-filter: blur(var(--glass-blur, 40px));\n          backdrop-filter: blur(var(--glass-blur, 40px));\n  background-color: transparent;\n  background-image: linear-gradient(\n        135deg,\n        rgb(255 255 255 / var(--glass-opacity, 30%)) 0%,\n        rgb(0 0 0 / 0%) 100%\n      ),\n      linear-gradient(\n        var(--glass-reflex-degree, 100deg),\n        rgb(255 255 255 / var(--glass-reflex-opacity, 10%)) 25%,\n        rgb(0 0 0 / 0%) 25%\n      );\n  box-shadow: 0 0 0 1px rgb(255 255 255 / var(--glass-border-opacity, 10%)) inset,\n      0 0 0 2px rgb(0 0 0 / 5%);\n  text-shadow: 0 1px rgb(0 0 0 / var(--glass-text-shadow-opacity, 5%));\n}@media (hover: hover) {\n\n  .tw-glass.tw-btn-active {\n    border: none;\n    -webkit-backdrop-filter: blur(var(--glass-blur, 40px));\n            backdrop-filter: blur(var(--glass-blur, 40px));\n    background-color: transparent;\n    background-image: linear-gradient(\n          135deg,\n          rgb(255 255 255 / var(--glass-opacity, 30%)) 0%,\n          rgb(0 0 0 / 0%) 100%\n        ),\n        linear-gradient(\n          var(--glass-reflex-degree, 100deg),\n          rgb(255 255 255 / var(--glass-reflex-opacity, 10%)) 25%,\n          rgb(0 0 0 / 0%) 25%\n        );\n    box-shadow: 0 0 0 1px rgb(255 255 255 / var(--glass-border-opacity, 10%)) inset,\n        0 0 0 2px rgb(0 0 0 / 5%);\n    text-shadow: 0 1px rgb(0 0 0 / var(--glass-text-shadow-opacity, 5%));\n  }\n}.tw-drawer-open > .tw-drawer-toggle {\n  display: none;\n}.tw-drawer-open > .tw-drawer-toggle ~ .tw-drawer-side {\n  pointer-events: auto;\n  visibility: visible;\n  position: sticky;\n  display: block;\n  width: auto;\n  overscroll-behavior: auto;\n}.tw-drawer-open > .tw-drawer-toggle ~ .tw-drawer-side > *:not(.tw-drawer-overlay) {\n  transform: translateX(0%);\n}[dir=\"rtl\"] .tw-drawer-open > .tw-drawer-toggle ~ .tw-drawer-side > *:not(.tw-drawer-overlay) {\n  transform: translateX(0%);\n}.tw-drawer-open > .tw-drawer-toggle:checked ~ .tw-drawer-side {\n  pointer-events: auto;\n  visibility: visible;\n}.tw-drawer-open > .tw-drawer-side {\n  overflow-y: auto;\n}html:has(.tw-drawer-toggle:checked) {\n  overflow-y: hidden;\n  scrollbar-gutter: stable;\n}.tw-menu-horizontal {\n  display: inline-flex;\n  flex-direction: row;\n}.tw-menu-horizontal > li:not(.tw-menu-title) > details > ul {\n  position: absolute;\n}.tw-drawer-open > .tw-drawer-toggle ~ .tw-drawer-side > .tw-drawer-overlay {\n  cursor: default;\n  background-color: transparent;\n}.tw-menu-horizontal > li:not(.tw-menu-title) > details > ul {\n  margin-inline-start: 0px;\n  margin-top: 1rem;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  padding-inline-end: 0.5rem;\n}.tw-menu-horizontal > li > details > ul:before {\n  content: none;\n}:where(.tw-menu-horizontal > li:not(.tw-menu-title) > details > ul) {\n  border-radius: var(--rounded-box, 1rem);\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)));\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}.tw-modal-top :where(.tw-modal-box) {\n  width: 100%;\n  max-width: none;\n  --tw-translate-y: -2.5rem;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n  border-bottom-right-radius: var(--rounded-box, 1rem);\n  border-bottom-left-radius: var(--rounded-box, 1rem);\n  border-top-left-radius: 0px;\n  border-top-right-radius: 0px;\n}.tw-modal-middle :where(.tw-modal-box) {\n  width: 91.666667%;\n  max-width: 32rem;\n  --tw-translate-y: 0px;\n  --tw-scale-x: .9;\n  --tw-scale-y: .9;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n  border-top-left-radius: var(--rounded-box, 1rem);\n  border-top-right-radius: var(--rounded-box, 1rem);\n  border-bottom-right-radius: var(--rounded-box, 1rem);\n  border-bottom-left-radius: var(--rounded-box, 1rem);\n}.tw-modal-bottom :where(.tw-modal-box) {\n  width: 100%;\n  max-width: none;\n  --tw-translate-y: 2.5rem;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n  border-top-left-radius: var(--rounded-box, 1rem);\n  border-top-right-radius: var(--rounded-box, 1rem);\n  border-bottom-right-radius: 0px;\n  border-bottom-left-radius: 0px;\n}.tw-mb-2 {\n  margin-bottom: 0.5rem;\n}.tw-mb-4 {\n  margin-bottom: 1rem;\n}.tw-mb-5 {\n  margin-bottom: 1.25rem;\n}.tw-mr-2 {\n  margin-right: 0.5rem;\n}.tw-mr-3 {\n  margin-right: 0.75rem;\n}.tw-mt-5 {\n  margin-top: 1.25rem;\n}.tw-flex {\n  display: flex;\n}.tw-hidden {\n  display: none;\n}.tw-h-10 {\n  height: 2.5rem;\n}.tw-h-3 {\n  height: 0.75rem;\n}.tw-h-4 {\n  height: 1rem;\n}.tw-h-5 {\n  height: 1.25rem;\n}.tw-h-5\\/6 {\n  height: 83.333333%;\n}.tw-h-full {\n  height: 100%;\n}.tw-max-h-\\[645px\\] {\n  max-height: 645px;\n}.tw-max-h-full {\n  max-height: 100%;\n}.tw-min-h-full {\n  min-height: 100%;\n}.tw-w-10 {\n  width: 2.5rem;\n}.tw-w-20 {\n  width: 5rem;\n}.tw-w-3 {\n  width: 0.75rem;\n}.tw-w-3\\/4 {\n  width: 75%;\n}.tw-w-4 {\n  width: 1rem;\n}.tw-w-5 {\n  width: 1.25rem;\n}.tw-w-80 {\n  width: 20rem;\n}.tw-w-\\[150px\\] {\n  width: 150px;\n}.tw-w-\\[60px\\] {\n  width: 60px;\n}.tw-w-full {\n  width: 100%;\n}.tw-max-w-md {\n  max-width: 28rem;\n}.tw-max-w-screen-2xl {\n  max-width: 1536px;\n}.tw-grow {\n  flex-grow: 1;\n}@keyframes tw-spin {\n\n  to {\n    transform: rotate(360deg);\n  }\n}.tw-animate-spin {\n  animation: tw-spin 1s linear infinite;\n}.tw-flex-row {\n  flex-direction: row;\n}.tw-flex-col {\n  flex-direction: column;\n}.tw-items-start {\n  align-items: flex-start;\n}.tw-items-center {\n  align-items: center;\n}.tw-justify-start {\n  justify-content: flex-start;\n}.tw-justify-center {\n  justify-content: center;\n}.tw-gap-1 {\n  gap: 0.25rem;\n}.tw-gap-10 {\n  gap: 2.5rem;\n}.tw-gap-16 {\n  gap: 4rem;\n}.tw-gap-2 {\n  gap: 0.5rem;\n}.tw-gap-4 {\n  gap: 1rem;\n}.tw-gap-5 {\n  gap: 1.25rem;\n}.tw-overflow-hidden {\n  overflow: hidden;\n}.tw-overflow-y-auto {\n  overflow-y: auto;\n}.tw-rounded-full {\n  border-radius: 9999px;\n}.tw-rounded-lg {\n  border-radius: 0.5rem;\n}.tw-rounded-t-lg {\n  border-top-left-radius: 0.5rem;\n  border-top-right-radius: 0.5rem;\n}.tw-border {\n  border-width: 1px;\n}.tw-border-hidden {\n  border-style: hidden;\n}.\\!tw-border-none {\n  border-style: none !important;\n}.tw-bg-base-100 {\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-b1,oklch(var(--b1)/var(--tw-bg-opacity)));\n}.tw-bg-base-200 {\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-b2,oklch(var(--b2)/var(--tw-bg-opacity)));\n}.tw-bg-base-300 {\n  --tw-bg-opacity: 1;\n  background-color: var(--fallback-b3,oklch(var(--b3)/var(--tw-bg-opacity)));\n}.tw-bg-red-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(239 68 68 / var(--tw-bg-opacity));\n}.tw-bg-slate-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(226 232 240 / var(--tw-bg-opacity));\n}.tw-bg-slate-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(51 65 85 / var(--tw-bg-opacity));\n}.\\!tw-bg-none {\n  background-image: none !important;\n}.\\!tw-p-0 {\n  padding: 0px !important;\n}.tw-p-0 {\n  padding: 0px;\n}.tw-p-3 {\n  padding: 0.75rem;\n}.tw-p-4 {\n  padding: 1rem;\n}.tw-p-5 {\n  padding: 1.25rem;\n}.tw-px-1 {\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n}.tw-py-6 {\n  padding-top: 1.5rem;\n  padding-bottom: 1.5rem;\n}.tw-text-center {\n  text-align: center;\n}.tw-text-2xl {\n  font-size: 1.5rem;\n  line-height: 2rem;\n}.tw-text-5xl {\n  font-size: 3rem;\n  line-height: 1;\n}.tw-text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}.tw-text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}.tw-font-bold {\n  font-weight: 700;\n}.tw-font-normal {\n  font-weight: 400;\n}.tw-capitalize {\n  text-transform: capitalize;\n}.tw-text-black {\n  --tw-text-opacity: 1;\n  color: rgb(0 0 0 / var(--tw-text-opacity));\n}.tw-text-gray-200 {\n  --tw-text-opacity: 1;\n  color: rgb(229 231 235 / var(--tw-text-opacity));\n}.tw-text-red-500 {\n  --tw-text-opacity: 1;\n  color: rgb(239 68 68 / var(--tw-text-opacity));\n}.tw-text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}.tw-opacity-25 {\n  opacity: 0.25;\n}.tw-opacity-70 {\n  opacity: 0.7;\n}.tw-opacity-75 {\n  opacity: 0.75;\n}.\\!tw-shadow-none {\n  --tw-shadow: 0 0 #0000 !important;\n  --tw-shadow-colored: 0 0 #0000 !important;\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow) !important;\n}.hover\\:tw-bg-red-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 38 38 / var(--tw-bg-opacity));\n}.hover\\:tw-text-gray-100:hover {\n  --tw-text-opacity: 1;\n  color: rgb(243 244 246 / var(--tw-text-opacity));\n}\r\n:root {\n  --toastify-color-light: #fff;\n  --toastify-color-dark: #121212;\n  --toastify-color-info: #3498db;\n  --toastify-color-success: #07bc0c;\n  --toastify-color-warning: #f1c40f;\n  --toastify-color-error: #e74c3c;\n  --toastify-color-transparent: rgba(255, 255, 255, 0.7);\n  --toastify-icon-color-info: var(--toastify-color-info);\n  --toastify-icon-color-success: var(--toastify-color-success);\n  --toastify-icon-color-warning: var(--toastify-color-warning);\n  --toastify-icon-color-error: var(--toastify-color-error);\n  --toastify-toast-width: 320px;\n  --toastify-toast-offset: 16px;\n  --toastify-toast-top: max(var(--toastify-toast-offset), env(safe-area-inset-top));\n  --toastify-toast-right: max(var(--toastify-toast-offset), env(safe-area-inset-right));\n  --toastify-toast-left: max(var(--toastify-toast-offset), env(safe-area-inset-left));\n  --toastify-toast-bottom: max(var(--toastify-toast-offset), env(safe-area-inset-bottom));\n  --toastify-toast-background: #fff;\n  --toastify-toast-min-height: 64px;\n  --toastify-toast-max-height: 800px;\n  --toastify-toast-bd-radius: 6px;\n  --toastify-font-family: sans-serif;\n  --toastify-z-index: 9999;\n  --toastify-text-color-light: #757575;\n  --toastify-text-color-dark: #fff;\n  --toastify-text-color-info: #fff;\n  --toastify-text-color-success: #fff;\n  --toastify-text-color-warning: #fff;\n  --toastify-text-color-error: #fff;\n  --toastify-spinner-color: #616161;\n  --toastify-spinner-color-empty-area: #e0e0e0;\n  --toastify-color-progress-light: linear-gradient(\n    to right,\n    #4cd964,\n    #5ac8fa,\n    #007aff,\n    #34aadc,\n    #5856d6,\n    #ff2d55\n  );\n  --toastify-color-progress-dark: #bb86fc;\n  --toastify-color-progress-info: var(--toastify-color-info);\n  --toastify-color-progress-success: var(--toastify-color-success);\n  --toastify-color-progress-warning: var(--toastify-color-warning);\n  --toastify-color-progress-error: var(--toastify-color-error);\n  --toastify-color-progress-bgo: 0.2;\n}\n\n.Toastify__toast-container {\n  z-index: var(--toastify-z-index);\n  -webkit-transform: translate3d(0, 0, var(--toastify-z-index));\n  position: fixed;\n  padding: 4px;\n  width: var(--toastify-toast-width);\n  box-sizing: border-box;\n  color: #fff;\n}\n\n.Toastify__toast-container--top-left {\n  top: var(--toastify-toast-top);\n  left: var(--toastify-toast-left);\n}\n\n.Toastify__toast-container--top-center {\n  top: var(--toastify-toast-top);\n  left: 50%;\n  transform: translateX(-50%);\n}\n\n.Toastify__toast-container--top-right {\n  top: var(--toastify-toast-top);\n  right: var(--toastify-toast-right);\n}\n\n.Toastify__toast-container--bottom-left {\n  bottom: var(--toastify-toast-bottom);\n  left: var(--toastify-toast-left);\n}\n\n.Toastify__toast-container--bottom-center {\n  bottom: var(--toastify-toast-bottom);\n  left: 50%;\n  transform: translateX(-50%);\n}\n\n.Toastify__toast-container--bottom-right {\n  bottom: var(--toastify-toast-bottom);\n  right: var(--toastify-toast-right);\n}\n\n@media only screen and (max-width : 480px) {\n  .Toastify__toast-container {\n    width: 100vw;\n    padding: 0;\n    left: env(safe-area-inset-left);\n    margin: 0;\n  }\n  .Toastify__toast-container--top-left, .Toastify__toast-container--top-center, .Toastify__toast-container--top-right {\n    top: env(safe-area-inset-top);\n    transform: translateX(0);\n  }\n  .Toastify__toast-container--bottom-left, .Toastify__toast-container--bottom-center, .Toastify__toast-container--bottom-right {\n    bottom: env(safe-area-inset-bottom);\n    transform: translateX(0);\n  }\n  .Toastify__toast-container--rtl {\n    right: env(safe-area-inset-right);\n    left: initial;\n  }\n}\n\n.Toastify__toast {\n  --y: 0;\n  position: relative;\n  touch-action: none;\n  min-height: var(--toastify-toast-min-height);\n  box-sizing: border-box;\n  margin-bottom: 1rem;\n  padding: 8px;\n  border-radius: var(--toastify-toast-bd-radius);\n  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);\n  display: flex;\n  justify-content: space-between;\n  max-height: var(--toastify-toast-max-height);\n  font-family: var(--toastify-font-family);\n  cursor: default;\n  direction: ltr;\n  /* webkit only issue #791 */\n  z-index: 0;\n  overflow: hidden;\n}\n\n.Toastify__toast--stacked {\n  position: absolute;\n  width: 100%;\n  transform: translate3d(0, var(--y), 0) scale(var(--s));\n  transition: transform 0.3s;\n}\n\n.Toastify__toast--stacked[data-collapsed] .Toastify__toast-body, .Toastify__toast--stacked[data-collapsed] .Toastify__close-button {\n  transition: opacity 0.1s;\n}\n\n.Toastify__toast--stacked[data-collapsed=false] {\n  overflow: visible;\n}\n\n.Toastify__toast--stacked[data-collapsed=true]:not(:last-child) > * {\n  opacity: 0;\n}\n\n.Toastify__toast--stacked:after {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: calc(var(--g) * 1px);\n  bottom: 100%;\n}\n\n.Toastify__toast--stacked[data-pos=top] {\n  top: 0;\n}\n\n.Toastify__toast--stacked[data-pos=bot] {\n  bottom: 0;\n}\n\n.Toastify__toast--stacked[data-pos=bot].Toastify__toast--stacked:before {\n  transform-origin: top;\n}\n\n.Toastify__toast--stacked[data-pos=top].Toastify__toast--stacked:before {\n  transform-origin: bottom;\n}\n\n.Toastify__toast--stacked:before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: 100%;\n  transform: scaleY(3);\n  z-index: -1;\n}\n\n.Toastify__toast--rtl {\n  direction: rtl;\n}\n\n.Toastify__toast--close-on-click {\n  cursor: pointer;\n}\n\n.Toastify__toast-body {\n  margin: auto 0;\n  flex: 1 1 auto;\n  padding: 6px;\n  display: flex;\n  align-items: center;\n}\n\n.Toastify__toast-body > div:last-child {\n  word-break: break-word;\n  flex: 1;\n}\n\n.Toastify__toast-icon {\n  margin-inline-end: 10px;\n  width: 20px;\n  flex-shrink: 0;\n  display: flex;\n}\n\n.Toastify--animate {\n  animation-fill-mode: both;\n  animation-duration: 0.5s;\n}\n\n.Toastify--animate-icon {\n  animation-fill-mode: both;\n  animation-duration: 0.3s;\n}\n\n@media only screen and (max-width : 480px) {\n  .Toastify__toast {\n    margin-bottom: 0;\n    border-radius: 0;\n  }\n}\n\n.Toastify__toast-theme--dark {\n  background: var(--toastify-color-dark);\n  color: var(--toastify-text-color-dark);\n}\n\n.Toastify__toast-theme--light {\n  background: var(--toastify-color-light);\n  color: var(--toastify-text-color-light);\n}\n\n.Toastify__toast-theme--colored.Toastify__toast--default {\n  background: var(--toastify-color-light);\n  color: var(--toastify-text-color-light);\n}\n\n.Toastify__toast-theme--colored.Toastify__toast--info {\n  color: var(--toastify-text-color-info);\n  background: var(--toastify-color-info);\n}\n\n.Toastify__toast-theme--colored.Toastify__toast--success {\n  color: var(--toastify-text-color-success);\n  background: var(--toastify-color-success);\n}\n\n.Toastify__toast-theme--colored.Toastify__toast--warning {\n  color: var(--toastify-text-color-warning);\n  background: var(--toastify-color-warning);\n}\n\n.Toastify__toast-theme--colored.Toastify__toast--error {\n  color: var(--toastify-text-color-error);\n  background: var(--toastify-color-error);\n}\n\n.Toastify__progress-bar-theme--light {\n  background: var(--toastify-color-progress-light);\n}\n\n.Toastify__progress-bar-theme--dark {\n  background: var(--toastify-color-progress-dark);\n}\n\n.Toastify__progress-bar--info {\n  background: var(--toastify-color-progress-info);\n}\n\n.Toastify__progress-bar--success {\n  background: var(--toastify-color-progress-success);\n}\n\n.Toastify__progress-bar--warning {\n  background: var(--toastify-color-progress-warning);\n}\n\n.Toastify__progress-bar--error {\n  background: var(--toastify-color-progress-error);\n}\n\n.Toastify__progress-bar-theme--colored.Toastify__progress-bar--info, .Toastify__progress-bar-theme--colored.Toastify__progress-bar--success, .Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning, .Toastify__progress-bar-theme--colored.Toastify__progress-bar--error {\n  background: var(--toastify-color-transparent);\n}\n\n.Toastify__close-button {\n  color: #fff;\n  background: transparent;\n  outline: none;\n  border: none;\n  padding: 0;\n  cursor: pointer;\n  opacity: 0.7;\n  transition: 0.3s ease;\n  align-self: flex-start;\n  z-index: 1;\n}\n\n.Toastify__close-button--light {\n  color: #000;\n  opacity: 0.3;\n}\n\n.Toastify__close-button > svg {\n  fill: currentColor;\n  height: 16px;\n  width: 14px;\n}\n\n.Toastify__close-button:hover, .Toastify__close-button:focus {\n  opacity: 1;\n}\n\n@keyframes Toastify__trackProgress {\n  0% {\n    transform: scaleX(1);\n  }\n  100% {\n    transform: scaleX(0);\n  }\n}\n\n.Toastify__progress-bar {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: var(--toastify-z-index);\n  opacity: 0.7;\n  transform-origin: left;\n  border-bottom-left-radius: var(--toastify-toast-bd-radius);\n}\n\n.Toastify__progress-bar--animated {\n  animation: Toastify__trackProgress linear 1 forwards;\n}\n\n.Toastify__progress-bar--controlled {\n  transition: transform 0.2s;\n}\n\n.Toastify__progress-bar--rtl {\n  right: 0;\n  left: initial;\n  transform-origin: right;\n  border-bottom-left-radius: initial;\n  border-bottom-right-radius: var(--toastify-toast-bd-radius);\n}\n\n.Toastify__progress-bar--wrp {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 5px;\n  border-bottom-left-radius: var(--toastify-toast-bd-radius);\n}\n\n.Toastify__progress-bar--wrp[data-hidden=true] {\n  opacity: 0;\n}\n\n.Toastify__progress-bar--bg {\n  opacity: var(--toastify-color-progress-bgo);\n  width: 100%;\n  height: 100%;\n}\n\n.Toastify__spinner {\n  width: 20px;\n  height: 20px;\n  box-sizing: border-box;\n  border: 2px solid;\n  border-radius: 100%;\n  border-color: var(--toastify-spinner-color-empty-area);\n  border-right-color: var(--toastify-spinner-color);\n  animation: Toastify__spin 0.65s linear infinite;\n}\n\n@keyframes Toastify__bounceInRight {\n  from, 60%, 75%, 90%, to {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n  from {\n    opacity: 0;\n    transform: translate3d(3000px, 0, 0);\n  }\n  60% {\n    opacity: 1;\n    transform: translate3d(-25px, 0, 0);\n  }\n  75% {\n    transform: translate3d(10px, 0, 0);\n  }\n  90% {\n    transform: translate3d(-5px, 0, 0);\n  }\n  to {\n    transform: none;\n  }\n}\n\n@keyframes Toastify__bounceOutRight {\n  20% {\n    opacity: 1;\n    transform: translate3d(-20px, var(--y), 0);\n  }\n  to {\n    opacity: 0;\n    transform: translate3d(2000px, var(--y), 0);\n  }\n}\n\n@keyframes Toastify__bounceInLeft {\n  from, 60%, 75%, 90%, to {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n  0% {\n    opacity: 0;\n    transform: translate3d(-3000px, 0, 0);\n  }\n  60% {\n    opacity: 1;\n    transform: translate3d(25px, 0, 0);\n  }\n  75% {\n    transform: translate3d(-10px, 0, 0);\n  }\n  90% {\n    transform: translate3d(5px, 0, 0);\n  }\n  to {\n    transform: none;\n  }\n}\n\n@keyframes Toastify__bounceOutLeft {\n  20% {\n    opacity: 1;\n    transform: translate3d(20px, var(--y), 0);\n  }\n  to {\n    opacity: 0;\n    transform: translate3d(-2000px, var(--y), 0);\n  }\n}\n\n@keyframes Toastify__bounceInUp {\n  from, 60%, 75%, 90%, to {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n  from {\n    opacity: 0;\n    transform: translate3d(0, 3000px, 0);\n  }\n  60% {\n    opacity: 1;\n    transform: translate3d(0, -20px, 0);\n  }\n  75% {\n    transform: translate3d(0, 10px, 0);\n  }\n  90% {\n    transform: translate3d(0, -5px, 0);\n  }\n  to {\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes Toastify__bounceOutUp {\n  20% {\n    transform: translate3d(0, calc(var(--y) - 10px), 0);\n  }\n  40%, 45% {\n    opacity: 1;\n    transform: translate3d(0, calc(var(--y) + 20px), 0);\n  }\n  to {\n    opacity: 0;\n    transform: translate3d(0, -2000px, 0);\n  }\n}\n\n@keyframes Toastify__bounceInDown {\n  from, 60%, 75%, 90%, to {\n    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);\n  }\n  0% {\n    opacity: 0;\n    transform: translate3d(0, -3000px, 0);\n  }\n  60% {\n    opacity: 1;\n    transform: translate3d(0, 25px, 0);\n  }\n  75% {\n    transform: translate3d(0, -10px, 0);\n  }\n  90% {\n    transform: translate3d(0, 5px, 0);\n  }\n  to {\n    transform: none;\n  }\n}\n\n@keyframes Toastify__bounceOutDown {\n  20% {\n    transform: translate3d(0, calc(var(--y) - 10px), 0);\n  }\n  40%, 45% {\n    opacity: 1;\n    transform: translate3d(0, calc(var(--y) + 20px), 0);\n  }\n  to {\n    opacity: 0;\n    transform: translate3d(0, 2000px, 0);\n  }\n}\n\n.Toastify__bounce-enter--top-left, .Toastify__bounce-enter--bottom-left {\n  animation-name: Toastify__bounceInLeft;\n}\n\n.Toastify__bounce-enter--top-right, .Toastify__bounce-enter--bottom-right {\n  animation-name: Toastify__bounceInRight;\n}\n\n.Toastify__bounce-enter--top-center {\n  animation-name: Toastify__bounceInDown;\n}\n\n.Toastify__bounce-enter--bottom-center {\n  animation-name: Toastify__bounceInUp;\n}\n\n.Toastify__bounce-exit--top-left, .Toastify__bounce-exit--bottom-left {\n  animation-name: Toastify__bounceOutLeft;\n}\n\n.Toastify__bounce-exit--top-right, .Toastify__bounce-exit--bottom-right {\n  animation-name: Toastify__bounceOutRight;\n}\n\n.Toastify__bounce-exit--top-center {\n  animation-name: Toastify__bounceOutUp;\n}\n\n.Toastify__bounce-exit--bottom-center {\n  animation-name: Toastify__bounceOutDown;\n}\n\n@keyframes Toastify__zoomIn {\n  from {\n    opacity: 0;\n    transform: scale3d(0.3, 0.3, 0.3);\n  }\n  50% {\n    opacity: 1;\n  }\n}\n\n@keyframes Toastify__zoomOut {\n  from {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0;\n    transform: translate3d(0, var(--y), 0) scale3d(0.3, 0.3, 0.3);\n  }\n  to {\n    opacity: 0;\n  }\n}\n\n.Toastify__zoom-enter {\n  animation-name: Toastify__zoomIn;\n}\n\n.Toastify__zoom-exit {\n  animation-name: Toastify__zoomOut;\n}\n\n@keyframes Toastify__flipIn {\n  from {\n    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);\n    animation-timing-function: ease-in;\n    opacity: 0;\n  }\n  40% {\n    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);\n    animation-timing-function: ease-in;\n  }\n  60% {\n    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);\n    opacity: 1;\n  }\n  80% {\n    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);\n  }\n  to {\n    transform: perspective(400px);\n  }\n}\n\n@keyframes Toastify__flipOut {\n  from {\n    transform: translate3d(0, var(--y), 0) perspective(400px);\n  }\n  30% {\n    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, -20deg);\n    opacity: 1;\n  }\n  to {\n    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, 90deg);\n    opacity: 0;\n  }\n}\n\n.Toastify__flip-enter {\n  animation-name: Toastify__flipIn;\n}\n\n.Toastify__flip-exit {\n  animation-name: Toastify__flipOut;\n}\n\n@keyframes Toastify__slideInRight {\n  from {\n    transform: translate3d(110%, 0, 0);\n    visibility: visible;\n  }\n  to {\n    transform: translate3d(0, var(--y), 0);\n  }\n}\n\n@keyframes Toastify__slideInLeft {\n  from {\n    transform: translate3d(-110%, 0, 0);\n    visibility: visible;\n  }\n  to {\n    transform: translate3d(0, var(--y), 0);\n  }\n}\n\n@keyframes Toastify__slideInUp {\n  from {\n    transform: translate3d(0, 110%, 0);\n    visibility: visible;\n  }\n  to {\n    transform: translate3d(0, var(--y), 0);\n  }\n}\n\n@keyframes Toastify__slideInDown {\n  from {\n    transform: translate3d(0, -110%, 0);\n    visibility: visible;\n  }\n  to {\n    transform: translate3d(0, var(--y), 0);\n  }\n}\n\n@keyframes Toastify__slideOutRight {\n  from {\n    transform: translate3d(0, var(--y), 0);\n  }\n  to {\n    visibility: hidden;\n    transform: translate3d(110%, var(--y), 0);\n  }\n}\n\n@keyframes Toastify__slideOutLeft {\n  from {\n    transform: translate3d(0, var(--y), 0);\n  }\n  to {\n    visibility: hidden;\n    transform: translate3d(-110%, var(--y), 0);\n  }\n}\n\n@keyframes Toastify__slideOutDown {\n  from {\n    transform: translate3d(0, var(--y), 0);\n  }\n  to {\n    visibility: hidden;\n    transform: translate3d(0, 500px, 0);\n  }\n}\n\n@keyframes Toastify__slideOutUp {\n  from {\n    transform: translate3d(0, var(--y), 0);\n  }\n  to {\n    visibility: hidden;\n    transform: translate3d(0, -500px, 0);\n  }\n}\n\n.Toastify__slide-enter--top-left, .Toastify__slide-enter--bottom-left {\n  animation-name: Toastify__slideInLeft;\n}\n\n.Toastify__slide-enter--top-right, .Toastify__slide-enter--bottom-right {\n  animation-name: Toastify__slideInRight;\n}\n\n.Toastify__slide-enter--top-center {\n  animation-name: Toastify__slideInDown;\n}\n\n.Toastify__slide-enter--bottom-center {\n  animation-name: Toastify__slideInUp;\n}\n\n.Toastify__slide-exit--top-left, .Toastify__slide-exit--bottom-left {\n  animation-name: Toastify__slideOutLeft;\n  animation-timing-function: ease-in;\n  animation-duration: 0.3s;\n}\n\n.Toastify__slide-exit--top-right, .Toastify__slide-exit--bottom-right {\n  animation-name: Toastify__slideOutRight;\n  animation-timing-function: ease-in;\n  animation-duration: 0.3s;\n}\n\n.Toastify__slide-exit--top-center {\n  animation-name: Toastify__slideOutUp;\n  animation-timing-function: ease-in;\n  animation-duration: 0.3s;\n}\n\n.Toastify__slide-exit--bottom-center {\n  animation-name: Toastify__slideOutDown;\n  animation-timing-function: ease-in;\n  animation-duration: 0.3s;\n}\n\n@keyframes Toastify__spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=ReactToastify.css.map */";
                    el.type = "text/css";
                    document.head.appendChild(el);
                })();