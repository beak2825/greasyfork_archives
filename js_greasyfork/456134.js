// ==UserScript==
// @name         宜搭Talk
// @namespace    npm/vite-plugin-monkey
// @version      0.0.4
// @author       monkey
// @description  宜搭讨论插件
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliwork.com
// @match        https://*.aliwork.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/456134/%E5%AE%9C%E6%90%ADTalk.user.js
// @updateURL https://update.greasyfork.org/scripts/456134/%E5%AE%9C%E6%90%ADTalk.meta.js
// ==/UserScript==

(function() {
  "use strict";
  var _react_18_2_0_react = { exports: {} };
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
  var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$1 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z = Symbol.iterator;
  function A(a) {
    if (null === a || "object" !== typeof a)
      return null;
    a = z && a[z] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  var B = { isMounted: function() {
    return false;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, C = Object.assign, D = {};
  function E(a, b, e) {
    this.props = a;
    this.context = b;
    this.refs = D;
    this.updater = e || B;
  }
  E.prototype.isReactComponent = {};
  E.prototype.setState = function(a, b) {
    if ("object" !== typeof a && "function" !== typeof a && null != a)
      throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, b, "setState");
  };
  E.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
  };
  function F() {
  }
  F.prototype = E.prototype;
  function G(a, b, e) {
    this.props = a;
    this.context = b;
    this.refs = D;
    this.updater = e || B;
  }
  var H = G.prototype = new F();
  H.constructor = G;
  C(H, E.prototype);
  H.isPureReactComponent = true;
  var I = Array.isArray, J = Object.prototype.hasOwnProperty, K = { current: null }, L = { key: true, ref: true, __self: true, __source: true };
  function M(a, b, e) {
    var d, c = {}, k2 = null, h = null;
    if (null != b)
      for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b)
        J.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
    var g = arguments.length - 2;
    if (1 === g)
      c.children = e;
    else if (1 < g) {
      for (var f2 = Array(g), m2 = 0; m2 < g; m2++)
        f2[m2] = arguments[m2 + 2];
      c.children = f2;
    }
    if (a && a.defaultProps)
      for (d in g = a.defaultProps, g)
        void 0 === c[d] && (c[d] = g[d]);
    return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K.current };
  }
  function N(a, b) {
    return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
  }
  function O(a) {
    return "object" === typeof a && null !== a && a.$$typeof === l$1;
  }
  function escape(a) {
    var b = { "=": "=0", ":": "=2" };
    return "$" + a.replace(/[=:]/g, function(a2) {
      return b[a2];
    });
  }
  var P = /\/+/g;
  function Q(a, b) {
    return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
  }
  function R(a, b, e, d, c) {
    var k2 = typeof a;
    if ("undefined" === k2 || "boolean" === k2)
      a = null;
    var h = false;
    if (null === a)
      h = true;
    else
      switch (k2) {
        case "string":
        case "number":
          h = true;
          break;
        case "object":
          switch (a.$$typeof) {
            case l$1:
            case n$1:
              h = true;
          }
      }
    if (h)
      return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a2) {
        return a2;
      })) : null != c && (O(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
    h = 0;
    d = "" === d ? "." : d + ":";
    if (I(a))
      for (var g = 0; g < a.length; g++) {
        k2 = a[g];
        var f2 = d + Q(k2, g);
        h += R(k2, b, e, f2, c);
      }
    else if (f2 = A(a), "function" === typeof f2)
      for (a = f2.call(a), g = 0; !(k2 = a.next()).done; )
        k2 = k2.value, f2 = d + Q(k2, g++), h += R(k2, b, e, f2, c);
    else if ("object" === k2)
      throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
    return h;
  }
  function S(a, b, e) {
    if (null == a)
      return a;
    var d = [], c = 0;
    R(a, d, "", "", function(a2) {
      return b.call(e, a2, c++);
    });
    return d;
  }
  function T(a) {
    if (-1 === a._status) {
      var b = a._result;
      b = b();
      b.then(function(b2) {
        if (0 === a._status || -1 === a._status)
          a._status = 1, a._result = b2;
      }, function(b2) {
        if (0 === a._status || -1 === a._status)
          a._status = 2, a._result = b2;
      });
      -1 === a._status && (a._status = 0, a._result = b);
    }
    if (1 === a._status)
      return a._result.default;
    throw a._result;
  }
  var U = { current: null }, V = { transition: null }, W = { ReactCurrentDispatcher: U, ReactCurrentBatchConfig: V, ReactCurrentOwner: K };
  react_production_min.Children = { map: S, forEach: function(a, b, e) {
    S(a, function() {
      b.apply(this, arguments);
    }, e);
  }, count: function(a) {
    var b = 0;
    S(a, function() {
      b++;
    });
    return b;
  }, toArray: function(a) {
    return S(a, function(a2) {
      return a2;
    }) || [];
  }, only: function(a) {
    if (!O(a))
      throw Error("React.Children.only expected to receive a single React element child.");
    return a;
  } };
  react_production_min.Component = E;
  react_production_min.Fragment = p$1;
  react_production_min.Profiler = r;
  react_production_min.PureComponent = G;
  react_production_min.StrictMode = q$1;
  react_production_min.Suspense = w;
  react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W;
  react_production_min.cloneElement = function(a, b, e) {
    if (null === a || void 0 === a)
      throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
    var d = C({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
    if (null != b) {
      void 0 !== b.ref && (k2 = b.ref, h = K.current);
      void 0 !== b.key && (c = "" + b.key);
      if (a.type && a.type.defaultProps)
        var g = a.type.defaultProps;
      for (f2 in b)
        J.call(b, f2) && !L.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
    }
    var f2 = arguments.length - 2;
    if (1 === f2)
      d.children = e;
    else if (1 < f2) {
      g = Array(f2);
      for (var m2 = 0; m2 < f2; m2++)
        g[m2] = arguments[m2 + 2];
      d.children = g;
    }
    return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
  };
  react_production_min.createContext = function(a) {
    a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
    a.Provider = { $$typeof: t, _context: a };
    return a.Consumer = a;
  };
  react_production_min.createElement = M;
  react_production_min.createFactory = function(a) {
    var b = M.bind(null, a);
    b.type = a;
    return b;
  };
  react_production_min.createRef = function() {
    return { current: null };
  };
  react_production_min.forwardRef = function(a) {
    return { $$typeof: v, render: a };
  };
  react_production_min.isValidElement = O;
  react_production_min.lazy = function(a) {
    return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T };
  };
  react_production_min.memo = function(a, b) {
    return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
  };
  react_production_min.startTransition = function(a) {
    var b = V.transition;
    V.transition = {};
    try {
      a();
    } finally {
      V.transition = b;
    }
  };
  react_production_min.unstable_act = function() {
    throw Error("act(...) is not supported in production builds of React.");
  };
  react_production_min.useCallback = function(a, b) {
    return U.current.useCallback(a, b);
  };
  react_production_min.useContext = function(a) {
    return U.current.useContext(a);
  };
  react_production_min.useDebugValue = function() {
  };
  react_production_min.useDeferredValue = function(a) {
    return U.current.useDeferredValue(a);
  };
  react_production_min.useEffect = function(a, b) {
    return U.current.useEffect(a, b);
  };
  react_production_min.useId = function() {
    return U.current.useId();
  };
  react_production_min.useImperativeHandle = function(a, b, e) {
    return U.current.useImperativeHandle(a, b, e);
  };
  react_production_min.useInsertionEffect = function(a, b) {
    return U.current.useInsertionEffect(a, b);
  };
  react_production_min.useLayoutEffect = function(a, b) {
    return U.current.useLayoutEffect(a, b);
  };
  react_production_min.useMemo = function(a, b) {
    return U.current.useMemo(a, b);
  };
  react_production_min.useReducer = function(a, b, e) {
    return U.current.useReducer(a, b, e);
  };
  react_production_min.useRef = function(a) {
    return U.current.useRef(a);
  };
  react_production_min.useState = function(a) {
    return U.current.useState(a);
  };
  react_production_min.useSyncExternalStore = function(a, b, e) {
    return U.current.useSyncExternalStore(a, b, e);
  };
  react_production_min.useTransition = function() {
    return U.current.useTransition();
  };
  react_production_min.version = "18.2.0";
  (function(module) {
    {
      module.exports = react_production_min;
    }
  })(_react_18_2_0_react);
  var monkeyWindow = window;
  var unsafeWindow = /* @__PURE__ */ (() => {
    return monkeyWindow.unsafeWindow;
  })();
  var GM_setValue = /* @__PURE__ */ (() => monkeyWindow.GM_setValue)();
  var GM_addStyle = /* @__PURE__ */ (() => monkeyWindow.GM_addStyle)();
  var GM_registerMenuCommand = /* @__PURE__ */ (() => monkeyWindow.GM_registerMenuCommand)();
  var GM_getValue = /* @__PURE__ */ (() => monkeyWindow.GM_getValue)();
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
  var f = _react_18_2_0_react.exports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a)
      m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  (function(module) {
    {
      module.exports = reactJsxRuntime_production_min;
    }
  })(jsxRuntime);
  const jsx = jsxRuntime.exports.jsx;
  function init() {
    let loginUser = unsafeWindow && unsafeWindow.loginUser || "\u533F\u540D";
    function yidatalk(path, width = "1000px", height = "500px") {
      return /* @__PURE__ */ jsx("iframe", {
        frameborder: "0",
        width,
        height,
        sandbox: "allow-modals allow-same-origin allow-scripts allow-popups allow-forms",
        ref: async (ref) => {
          if (ref) {
            const doc = ref.contentWindow.document, link = doc.createElement("link"), script = doc.createElement("script"), div = doc.createElement("div");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = "https://qiniu.zjxmyq.cn/@waline/client/dist/waline.css";
            script.type = "module";
            script.appendChild(doc.createTextNode(`
                  import { init } from 'https://qiniu.zjxmyq.cn/@waline/client/dist/waline.mjs'

                  init({
                    el: '#waline',
                    serverURL: 'https://waline.zjxmyq.cn/',
                    path: '${path}',
                    locale: {
                      anonymous: '${loginUser.userName}'
                    }
                  })
                `));
            div.id = "waline";
            doc.head.append(link);
            doc.body.append(div);
            doc.body.append(script);
          }
        }
      });
    }
    const formPath = `${__VcDeepYidaUtils__.VuMicroUtils.RENDER_DEFAULT_CONFIG.routerBaseName}/${__VcDeepYidaUtils__.VuMicroUtils.getCurrentFormUuid()}`;
    AliLowCodeEngine.designerCabin.addBuiltinComponentAction({
      name: "yida-talk",
      content: {
        icon: /* @__PURE__ */ jsx(Next.Icon, {
          type: "atm"
        }),
        title: "\u5B9C\u642DTalk",
        action(node) {
          var _a;
          const fieldId = ((_a = node == null ? void 0 : node.propsData) == null ? void 0 : _a.fieldId) || node.id, path = `${formPath}/${fieldId}`;
          Deep.Dialog.show({
            title: `${LeGao.getApp().getTitle()} >> Component: ${fieldId}`,
            closeMode: ["esc", "close"],
            content: yidatalk(path),
            footer: false
          });
        }
      },
      important: true,
      condition: true
    });
    AliLowCodeEngine.skeleton.add({
      area: "leftArea",
      type: "PanelDock",
      name: "yida-talk",
      content: yidatalk(formPath, "100%", "100%"),
      props: {
        align: "left",
        icon: "atm",
        description: "\u5B9C\u642DTalk"
      },
      panelProps: {
        floatable: true,
        hideTitleBar: false,
        title: "\u5B9C\u642DTalk",
        width: 800,
        maxWidth: 1500,
        enableDrag: true
      }
    });
    let schema = GM_getValue("schema", true), robot = GM_getValue("robot", false);
    function set_schema(bool) {
      const schema_css = `
        .lc-left-area-bottom div:last-child {
            display: ${bool ? "block" : "none"};
        }
        `;
      GM_addStyle(schema_css);
    }
    function set_robot(bool) {
      const robot_css = `
        #yc-assistant-float-container > div > div.uxcore-service-float-button-circle {
            display: ${bool ? "block" : "none"};
        }
        `;
      GM_addStyle(robot_css);
    }
    if (schema) {
      set_schema(schema);
    }
    if (!robot) {
      set_robot(robot);
    }
    GM_registerMenuCommand(`schema\u5F00\u5173`, function() {
      schema = !schema;
      GM_setValue("schema", schema);
      set_schema(schema);
    });
    GM_registerMenuCommand(`\u673A\u5668\u4EBA\u5F00\u5173`, function() {
      robot = !robot;
      GM_setValue("robot", robot);
      set_robot(robot);
    });
  }
  setTimeout(() => {
    console.log("check before init yida talk");
    if (unsafeWindow.LeGao && unsafeWindow.AliLowCodeEngine && unsafeWindow.__VcDeepYidaUtils__) {
      console.log("init yida talk");
      init();
    }
  }, 3e3);
})();
