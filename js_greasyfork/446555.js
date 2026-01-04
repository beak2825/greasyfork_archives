// ==UserScript==
// @name        Wukong 开发体验增强脚本
// @description 适用于 Motiff 的开发套件
// @namespace   github.com/Yidadaa
// @require     https://unpkg.com/react@18/umd/react.development.js
// @require     https://unpkg.com/react-dom@18/umd/react-dom.development.js
// @match       https://wukong.yuanfudao.biz/file/*
// @match       https://kanyun.motiff.com/file/*
// @match       https://staging.motiff.com/file/*
// @match       https://beta.motiff.com/file/*
// @match       http://local.yuanfudao.biz:3000/file/*
// @match       https://jihulab.com/yuanli/wukong/-/merge_requests/*
// @match       https://princi.zhenguanyu.com/*
// @match       https://wkong.atlassian.net/browse/WK-*
// @match       https://wkong.atlassian.net/jira/software/c/projects/WK/boards/26/backlog*
// @match       https://wkong.atlassian.net/jira/software/c/projects/WK/issues/WK-*
// @match       https://wkong.atlassian.net/jira/software/c/projects/WK/boards/26?assignee=*
// @version     2.9.5
// @author      cuzi
// @license     MIT
// @grant       GM.getValue
// @grant       GM.notification
// @grant       GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/446555/Wukong%20%E5%BC%80%E5%8F%91%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/446555/Wukong%20%E5%BC%80%E5%8F%91%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2020 cvzi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/* globals React, ReactDOM */
(function (React$1, ReactDOM) {
  'use strict';

  function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n.default = e;
    return Object.freeze(n);
  }

  var React__namespace = /*#__PURE__*/_interopNamespaceDefault(React$1);
  var ReactDOM__namespace = /*#__PURE__*/_interopNamespaceDefault(ReactDOM);

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  var _excluded$1q = ["color"];
  var Cross1Icon = /*#__PURE__*/React$1.forwardRef(function (_ref, forwardedRef) {
    var _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'currentColor' : _ref$color,
      props = _objectWithoutPropertiesLoose(_ref, _excluded$1q);
    return React$1.createElement("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), React$1.createElement("path", {
      d: "M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$1r = ["color"];
  var Cross2Icon = /*#__PURE__*/React$1.forwardRef(function (_ref, forwardedRef) {
    var _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'currentColor' : _ref$color,
      props = _objectWithoutPropertiesLoose(_ref, _excluded$1r);
    return React$1.createElement("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), React$1.createElement("path", {
      d: "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$23 = ["color"];
  var ExternalLinkIcon = /*#__PURE__*/React$1.forwardRef(function (_ref, forwardedRef) {
    var _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'currentColor' : _ref$color,
      props = _objectWithoutPropertiesLoose(_ref, _excluded$23);
    return React$1.createElement("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), React$1.createElement("path", {
      d: "M3 2C2.44772 2 2 2.44772 2 3V12C2 12.5523 2.44772 13 3 13H12C12.5523 13 13 12.5523 13 12V8.5C13 8.22386 12.7761 8 12.5 8C12.2239 8 12 8.22386 12 8.5V12H3V3L6.5 3C6.77614 3 7 2.77614 7 2.5C7 2.22386 6.77614 2 6.5 2H3ZM12.8536 2.14645C12.9015 2.19439 12.9377 2.24964 12.9621 2.30861C12.9861 2.36669 12.9996 2.4303 13 2.497L13 2.5V2.50049V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3.70711L6.85355 8.85355C6.65829 9.04882 6.34171 9.04882 6.14645 8.85355C5.95118 8.65829 5.95118 8.34171 6.14645 8.14645L11.2929 3H9.5C9.22386 3 9 2.77614 9 2.5C9 2.22386 9.22386 2 9.5 2H12.4999H12.5C12.5678 2 12.6324 2.01349 12.6914 2.03794C12.7504 2.06234 12.8056 2.09851 12.8536 2.14645Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$39 = ["color"];
  var MixIcon = /*#__PURE__*/React$1.forwardRef(function (_ref, forwardedRef) {
    var _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'currentColor' : _ref$color,
      props = _objectWithoutPropertiesLoose(_ref, _excluded$39);
    return React$1.createElement("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), React$1.createElement("path", {
      d: "M2.14921 3.99996C2.14921 2.97778 2.97784 2.14915 4.00002 2.14915C5.02219 2.14915 5.85083 2.97778 5.85083 3.99996C5.85083 5.02213 5.02219 5.85077 4.00002 5.85077C2.97784 5.85077 2.14921 5.02213 2.14921 3.99996ZM4.00002 1.24915C2.48079 1.24915 1.24921 2.48073 1.24921 3.99996C1.24921 5.51919 2.48079 6.75077 4.00002 6.75077C5.51925 6.75077 6.75083 5.51919 6.75083 3.99996C6.75083 2.48073 5.51925 1.24915 4.00002 1.24915ZM5.82034 11.0001L2.49998 12.8369V9.16331L5.82034 11.0001ZM2.63883 8.21159C2.17228 7.9535 1.59998 8.29093 1.59998 8.82411V13.1761C1.59998 13.7093 2.17228 14.0467 2.63883 13.7886L6.57235 11.6126C7.05389 11.3462 7.05389 10.654 6.57235 10.3876L2.63883 8.21159ZM8.30001 9.00003C8.30001 8.61343 8.61341 8.30003 9.00001 8.30003H13C13.3866 8.30003 13.7 8.61343 13.7 9.00003V13C13.7 13.3866 13.3866 13.7 13 13.7H9.00001C8.61341 13.7 8.30001 13.3866 8.30001 13V9.00003ZM9.20001 9.20003V12.8H12.8V9.20003H9.20001ZM13.4432 2.19311C13.6189 2.01737 13.6189 1.73245 13.4432 1.55671C13.2675 1.38098 12.9826 1.38098 12.8068 1.55671L11 3.36353L9.19321 1.55674C9.01748 1.381 8.73255 1.381 8.55682 1.55674C8.38108 1.73247 8.38108 2.0174 8.55682 2.19313L10.3636 3.99992L8.55682 5.80671C8.38108 5.98245 8.38108 6.26737 8.55682 6.44311C8.73255 6.61885 9.01748 6.61885 9.19321 6.44311L11 4.63632L12.8068 6.44314C12.9826 6.61887 13.2675 6.61887 13.4432 6.44314C13.6189 6.2674 13.6189 5.98247 13.4432 5.80674L11.6364 3.99992L13.4432 2.19311Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$3n = ["color"];
  var Pencil1Icon = /*#__PURE__*/React$1.forwardRef(function (_ref, forwardedRef) {
    var _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'currentColor' : _ref$color,
      props = _objectWithoutPropertiesLoose(_ref, _excluded$3n);
    return React$1.createElement("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), React$1.createElement("path", {
      d: "M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$3x = ["color"];
  var PlusIcon = /*#__PURE__*/React$1.forwardRef(function (_ref, forwardedRef) {
    var _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'currentColor' : _ref$color,
      props = _objectWithoutPropertiesLoose(_ref, _excluded$3x);
    return React$1.createElement("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), React$1.createElement("path", {
      d: "M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  var _excluded$4G = ["color"];
  var TrashIcon = /*#__PURE__*/React$1.forwardRef(function (_ref, forwardedRef) {
    var _ref$color = _ref.color,
      color = _ref$color === void 0 ? 'currentColor' : _ref$color,
      props = _objectWithoutPropertiesLoose(_ref, _excluded$4G);
    return React$1.createElement("svg", Object.assign({
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, props, {
      ref: forwardedRef
    }), React$1.createElement("path", {
      d: "M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var classnames = {exports: {}};

  /*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  */
  (function (module) {
    /* global define */

    (function () {

      var hasOwn = {}.hasOwnProperty;
      function classNames() {
        var classes = [];
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          if (!arg) continue;
          var argType = typeof arg;
          if (argType === 'string' || argType === 'number') {
            classes.push(arg);
          } else if (Array.isArray(arg)) {
            if (arg.length) {
              var inner = classNames.apply(null, arg);
              if (inner) {
                classes.push(inner);
              }
            }
          } else if (argType === 'object') {
            if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
              classes.push(arg.toString());
              continue;
            }
            for (var key in arg) {
              if (hasOwn.call(arg, key) && arg[key]) {
                classes.push(key);
              }
            }
          }
        }
        return classes.join(' ');
      }
      if (module.exports) {
        classNames.default = classNames;
        module.exports = classNames;
      } else {
        window.classNames = classNames;
      }
    })();
  })(classnames);
  var classnamesExports = classnames.exports;
  var classNames = /*@__PURE__*/getDefaultExportFromCjs(classnamesExports);

  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function (target) {
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

  function $e42e1063c40fb3ef$export$b9ecd428b558ff10(originalEventHandler, ourEventHandler, {
    checkForDefaultPrevented = true
  } = {}) {
    return function handleEvent(event) {
      originalEventHandler === null || originalEventHandler === void 0 || originalEventHandler(event);
      if (checkForDefaultPrevented === false || !event.defaultPrevented) return ourEventHandler === null || ourEventHandler === void 0 ? void 0 : ourEventHandler(event);
    };
  }

  /**
   * Set a given ref to a given value
   * This utility takes care of different types of refs: callback refs and RefObject(s)
   */
  function $6ed0406888f73fc4$var$setRef(ref, value) {
    if (typeof ref === 'function') ref(value);else if (ref !== null && ref !== undefined) ref.current = value;
  }
  /**
   * A utility to compose multiple refs together
   * Accepts callback refs and RefObject(s)
   */
  function $6ed0406888f73fc4$export$43e446d32b3d21af(...refs) {
    return node => refs.forEach(ref => $6ed0406888f73fc4$var$setRef(ref, node));
  }
  /**
   * A custom hook that composes multiple refs
   * Accepts callback refs and RefObject(s)
   */
  function $6ed0406888f73fc4$export$c7b2cbe3552a0d05(...refs) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React$1.useCallback($6ed0406888f73fc4$export$43e446d32b3d21af(...refs), refs);
  }

  /* -------------------------------------------------------------------------------------------------
   * createContextScope
   * -----------------------------------------------------------------------------------------------*/
  function $c512c27ab02ef895$export$50c7b4e9d9f19c1(scopeName, createContextScopeDeps = []) {
    let defaultContexts = [];
    /* -----------------------------------------------------------------------------------------------
    * createContext
    * ---------------------------------------------------------------------------------------------*/
    function $c512c27ab02ef895$export$fd42f52fd3ae1109(rootComponentName, defaultContext) {
      const BaseContext = /*#__PURE__*/React$1.createContext(defaultContext);
      const index = defaultContexts.length;
      defaultContexts = [...defaultContexts, defaultContext];
      function Provider(props) {
        const {
          scope: scope,
          children: children,
          ...context
        } = props;
        const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index]) || BaseContext; // Only re-memoize when prop values change
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const value = React$1.useMemo(() => context, Object.values(context));
        return /*#__PURE__*/React$1.createElement(Context.Provider, {
          value: value
        }, children);
      }
      function useContext(consumerName, scope) {
        const Context = (scope === null || scope === void 0 ? void 0 : scope[scopeName][index]) || BaseContext;
        const context = React$1.useContext(Context);
        if (context) return context;
        if (defaultContext !== undefined) return defaultContext; // if a defaultContext wasn't specified, it's a required context.
        throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
      }
      Provider.displayName = rootComponentName + 'Provider';
      return [Provider, useContext];
    }
    /* -----------------------------------------------------------------------------------------------
    * createScope
    * ---------------------------------------------------------------------------------------------*/
    const createScope = () => {
      const scopeContexts = defaultContexts.map(defaultContext => {
        return /*#__PURE__*/React$1.createContext(defaultContext);
      });
      return function useScope(scope) {
        const contexts = (scope === null || scope === void 0 ? void 0 : scope[scopeName]) || scopeContexts;
        return React$1.useMemo(() => ({
          [`__scope${scopeName}`]: {
            ...scope,
            [scopeName]: contexts
          }
        }), [scope, contexts]);
      };
    };
    createScope.scopeName = scopeName;
    return [$c512c27ab02ef895$export$fd42f52fd3ae1109, $c512c27ab02ef895$var$composeContextScopes(createScope, ...createContextScopeDeps)];
  }
  /* -------------------------------------------------------------------------------------------------
   * composeContextScopes
   * -----------------------------------------------------------------------------------------------*/
  function $c512c27ab02ef895$var$composeContextScopes(...scopes) {
    const baseScope = scopes[0];
    if (scopes.length === 1) return baseScope;
    const createScope1 = () => {
      const scopeHooks = scopes.map(createScope => ({
        useScope: createScope(),
        scopeName: createScope.scopeName
      }));
      return function useComposedScopes(overrideScopes) {
        const nextScopes1 = scopeHooks.reduce((nextScopes, {
          useScope: useScope,
          scopeName: scopeName
        }) => {
          // We are calling a hook inside a callback which React warns against to avoid inconsistent
          // renders, however, scoping doesn't have render side effects so we ignore the rule.
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const scopeProps = useScope(overrideScopes);
          const currentScope = scopeProps[`__scope${scopeName}`];
          return {
            ...nextScopes,
            ...currentScope
          };
        }, {});
        return React$1.useMemo(() => ({
          [`__scope${baseScope.scopeName}`]: nextScopes1
        }), [nextScopes1]);
      };
    };
    createScope1.scopeName = baseScope.scopeName;
    return createScope1;
  }

  /* -------------------------------------------------------------------------------------------------
   * Slot
   * -----------------------------------------------------------------------------------------------*/
  const $5e63c961fc1ce211$export$8c6ed5c666ac1360 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      children: children,
      ...slotProps
    } = props;
    const childrenArray = React$1.Children.toArray(children);
    const slottable = childrenArray.find($5e63c961fc1ce211$var$isSlottable);
    if (slottable) {
      // the new element to render is the one passed as a child of `Slottable`
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map(child => {
        if (child === slottable) {
          // because the new element will be the one rendered, we are only interested
          // in grabbing its children (`newElement.props.children`)
          if (React$1.Children.count(newElement) > 1) return React$1.Children.only(null);
          return /*#__PURE__*/React$1.isValidElement(newElement) ? newElement.props.children : null;
        } else return child;
      });
      return /*#__PURE__*/React$1.createElement($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
        ref: forwardedRef
      }), /*#__PURE__*/React$1.isValidElement(newElement) ? /*#__PURE__*/React$1.cloneElement(newElement, undefined, newChildren) : null);
    }
    return /*#__PURE__*/React$1.createElement($5e63c961fc1ce211$var$SlotClone, _extends({}, slotProps, {
      ref: forwardedRef
    }), children);
  });
  $5e63c961fc1ce211$export$8c6ed5c666ac1360.displayName = 'Slot';
  /* -------------------------------------------------------------------------------------------------
   * SlotClone
   * -----------------------------------------------------------------------------------------------*/
  const $5e63c961fc1ce211$var$SlotClone = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      children: children,
      ...slotProps
    } = props;
    if ( /*#__PURE__*/React$1.isValidElement(children)) return /*#__PURE__*/React$1.cloneElement(children, {
      ...$5e63c961fc1ce211$var$mergeProps(slotProps, children.props),
      ref: forwardedRef ? $6ed0406888f73fc4$export$43e446d32b3d21af(forwardedRef, children.ref) : children.ref
    });
    return React$1.Children.count(children) > 1 ? React$1.Children.only(null) : null;
  });
  $5e63c961fc1ce211$var$SlotClone.displayName = 'SlotClone';
  /* -------------------------------------------------------------------------------------------------
   * Slottable
   * -----------------------------------------------------------------------------------------------*/
  const $5e63c961fc1ce211$export$d9f1ccf0bdb05d45 = ({
    children: children
  }) => {
    return /*#__PURE__*/React$1.createElement(React$1.Fragment, null, children);
  };
  /* ---------------------------------------------------------------------------------------------- */
  function $5e63c961fc1ce211$var$isSlottable(child) {
    return /*#__PURE__*/React$1.isValidElement(child) && child.type === $5e63c961fc1ce211$export$d9f1ccf0bdb05d45;
  }
  function $5e63c961fc1ce211$var$mergeProps(slotProps, childProps) {
    // all child props should override
    const overrideProps = {
      ...childProps
    };
    for (const propName in childProps) {
      const slotPropValue = slotProps[propName];
      const childPropValue = childProps[propName];
      const isHandler = /^on[A-Z]/.test(propName);
      if (isHandler) {
        // if the handler exists on both, we compose them
        if (slotPropValue && childPropValue) overrideProps[propName] = (...args) => {
          childPropValue(...args);
          slotPropValue(...args);
        };else if (slotPropValue) overrideProps[propName] = slotPropValue;
      } else if (propName === 'style') overrideProps[propName] = {
        ...slotPropValue,
        ...childPropValue
      };else if (propName === 'className') overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ');
    }
    return {
      ...slotProps,
      ...overrideProps
    };
  }

  const $8927f6f2acc4f386$var$NODES = ['a', 'button', 'div', 'form', 'h2', 'h3', 'img', 'input', 'label', 'li', 'nav', 'ol', 'p', 'span', 'svg', 'ul']; // Temporary while we await merge of this fix:
  // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55396
  // prettier-ignore
  /* -------------------------------------------------------------------------------------------------
   * Primitive
   * -----------------------------------------------------------------------------------------------*/
  const $8927f6f2acc4f386$export$250ffa63cdc0d034 = $8927f6f2acc4f386$var$NODES.reduce((primitive, node) => {
    const Node = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
      const {
        asChild: asChild,
        ...primitiveProps
      } = props;
      const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac1360 : node;
      React$1.useEffect(() => {
        window[Symbol.for('radix-ui')] = true;
      }, []);
      return /*#__PURE__*/React$1.createElement(Comp, _extends({}, primitiveProps, {
        ref: forwardedRef
      }));
    });
    Node.displayName = `Primitive.${node}`;
    return {
      ...primitive,
      [node]: Node
    };
  }, {});
  /* -------------------------------------------------------------------------------------------------
   * Utils
   * -----------------------------------------------------------------------------------------------*/ /**
                                                                                                       * Flush custom event dispatch
                                                                                                       * https://github.com/radix-ui/primitives/pull/1378
                                                                                                       *
                                                                                                       * React batches *all* event handlers since version 18, this introduces certain considerations when using custom event types.
                                                                                                       *
                                                                                                       * Internally, React prioritises events in the following order:
                                                                                                       *  - discrete
                                                                                                       *  - continuous
                                                                                                       *  - default
                                                                                                       *
                                                                                                       * https://github.com/facebook/react/blob/a8a4742f1c54493df00da648a3f9d26e3db9c8b5/packages/react-dom/src/events/ReactDOMEventListener.js#L294-L350
                                                                                                       *
                                                                                                       * `discrete` is an  important distinction as updates within these events are applied immediately.
                                                                                                       * React however, is not able to infer the priority of custom event types due to how they are detected internally.
                                                                                                       * Because of this, it's possible for updates from custom events to be unexpectedly batched when
                                                                                                       * dispatched by another `discrete` event.
                                                                                                       *
                                                                                                       * In order to ensure that updates from custom events are applied predictably, we need to manually flush the batch.
                                                                                                       * This utility should be used when dispatching a custom event from within another `discrete` event, this utility
                                                                                                       * is not nessesary when dispatching known event types, or if dispatching a custom type inside a non-discrete event.
                                                                                                       * For example:
                                                                                                       *
                                                                                                       * dispatching a known click 👎
                                                                                                       * target.dispatchEvent(new Event(‘click’))
                                                                                                       *
                                                                                                       * dispatching a custom type within a non-discrete event 👎
                                                                                                       * onScroll={(event) => event.target.dispatchEvent(new CustomEvent(‘customType’))}
                                                                                                       *
                                                                                                       * dispatching a custom type within a `discrete` event 👍
                                                                                                       * onPointerDown={(event) => dispatchDiscreteCustomEvent(event.target, new CustomEvent(‘customType’))}
                                                                                                       *
                                                                                                       * Note: though React classifies `focus`, `focusin` and `focusout` events as `discrete`, it's  not recommended to use
                                                                                                       * this utility with them. This is because it's possible for those handlers to be called implicitly during render
                                                                                                       * e.g. when focus is within a component as it is unmounted, or when managing focus on mount.
                                                                                                       */
  function $8927f6f2acc4f386$export$6d1a0317bde7de7f(target, event) {
    if (target) ReactDOM.flushSync(() => target.dispatchEvent(event));
  }

  /**
   * A custom hook that converts a callback to a ref to avoid triggering re-renders when passed as a
   * prop or avoid re-executing effects when passed as a dependency
   */
  function $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(callback) {
    const callbackRef = React$1.useRef(callback);
    React$1.useEffect(() => {
      callbackRef.current = callback;
    }); // https://github.com/facebook/react/issues/19240
    return React$1.useMemo(() => (...args) => {
      var _callbackRef$current;
      return (_callbackRef$current = callbackRef.current) === null || _callbackRef$current === void 0 ? void 0 : _callbackRef$current.call(callbackRef, ...args);
    }, []);
  }

  /**
   * Listens for when the escape key is down
   */
  function $addc16e1bbe58fd0$export$3a72a57244d6e765(onEscapeKeyDownProp, ownerDocument = globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) {
    const onEscapeKeyDown = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onEscapeKeyDownProp);
    React$1.useEffect(() => {
      const handleKeyDown = event => {
        if (event.key === 'Escape') onEscapeKeyDown(event);
      };
      ownerDocument.addEventListener('keydown', handleKeyDown);
      return () => ownerDocument.removeEventListener('keydown', handleKeyDown);
    }, [onEscapeKeyDown, ownerDocument]);
  }

  const $5cb92bef7577960e$var$CONTEXT_UPDATE = 'dismissableLayer.update';
  const $5cb92bef7577960e$var$POINTER_DOWN_OUTSIDE = 'dismissableLayer.pointerDownOutside';
  const $5cb92bef7577960e$var$FOCUS_OUTSIDE = 'dismissableLayer.focusOutside';
  let $5cb92bef7577960e$var$originalBodyPointerEvents;
  const $5cb92bef7577960e$var$DismissableLayerContext = /*#__PURE__*/React$1.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set()
  });
  const $5cb92bef7577960e$export$177fb62ff3ec1f22 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    var _node$ownerDocument;
    const {
      disableOutsidePointerEvents = false,
      onEscapeKeyDown: onEscapeKeyDown,
      onPointerDownOutside: onPointerDownOutside,
      onFocusOutside: onFocusOutside,
      onInteractOutside: onInteractOutside,
      onDismiss: onDismiss,
      ...layerProps
    } = props;
    const context = React$1.useContext($5cb92bef7577960e$var$DismissableLayerContext);
    const [node1, setNode] = React$1.useState(null);
    const ownerDocument = (_node$ownerDocument = node1 === null || node1 === void 0 ? void 0 : node1.ownerDocument) !== null && _node$ownerDocument !== void 0 ? _node$ownerDocument : globalThis === null || globalThis === void 0 ? void 0 : globalThis.document;
    const [, force] = React$1.useState({});
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, node => setNode(node));
    const layers = Array.from(context.layers);
    const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1); // prettier-ignore
    const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled); // prettier-ignore
    const index = node1 ? layers.indexOf(node1) : -1;
    const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
    const isPointerEventsEnabled = index >= highestLayerWithOutsidePointerEventsDisabledIndex;
    const pointerDownOutside = $5cb92bef7577960e$var$usePointerDownOutside(event => {
      const target = event.target;
      const isPointerDownOnBranch = [...context.branches].some(branch => branch.contains(target));
      if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
      onPointerDownOutside === null || onPointerDownOutside === void 0 || onPointerDownOutside(event);
      onInteractOutside === null || onInteractOutside === void 0 || onInteractOutside(event);
      if (!event.defaultPrevented) onDismiss === null || onDismiss === void 0 || onDismiss();
    }, ownerDocument);
    const focusOutside = $5cb92bef7577960e$var$useFocusOutside(event => {
      const target = event.target;
      const isFocusInBranch = [...context.branches].some(branch => branch.contains(target));
      if (isFocusInBranch) return;
      onFocusOutside === null || onFocusOutside === void 0 || onFocusOutside(event);
      onInteractOutside === null || onInteractOutside === void 0 || onInteractOutside(event);
      if (!event.defaultPrevented) onDismiss === null || onDismiss === void 0 || onDismiss();
    }, ownerDocument);
    $addc16e1bbe58fd0$export$3a72a57244d6e765(event => {
      const isHighestLayer = index === context.layers.size - 1;
      if (!isHighestLayer) return;
      onEscapeKeyDown === null || onEscapeKeyDown === void 0 || onEscapeKeyDown(event);
      if (!event.defaultPrevented && onDismiss) {
        event.preventDefault();
        onDismiss();
      }
    }, ownerDocument);
    React$1.useEffect(() => {
      if (!node1) return;
      if (disableOutsidePointerEvents) {
        if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
          $5cb92bef7577960e$var$originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
          ownerDocument.body.style.pointerEvents = 'none';
        }
        context.layersWithOutsidePointerEventsDisabled.add(node1);
      }
      context.layers.add(node1);
      $5cb92bef7577960e$var$dispatchUpdate();
      return () => {
        if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) ownerDocument.body.style.pointerEvents = $5cb92bef7577960e$var$originalBodyPointerEvents;
      };
    }, [node1, ownerDocument, disableOutsidePointerEvents, context]);
    /**
    * We purposefully prevent combining this effect with the `disableOutsidePointerEvents` effect
    * because a change to `disableOutsidePointerEvents` would remove this layer from the stack
    * and add it to the end again so the layering order wouldn't be _creation order_.
    * We only want them to be removed from context stacks when unmounted.
    */
    React$1.useEffect(() => {
      return () => {
        if (!node1) return;
        context.layers.delete(node1);
        context.layersWithOutsidePointerEventsDisabled.delete(node1);
        $5cb92bef7577960e$var$dispatchUpdate();
      };
    }, [node1, context]);
    React$1.useEffect(() => {
      const handleUpdate = () => force({});
      document.addEventListener($5cb92bef7577960e$var$CONTEXT_UPDATE, handleUpdate);
      return () => document.removeEventListener($5cb92bef7577960e$var$CONTEXT_UPDATE, handleUpdate);
    }, []);
    return /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, layerProps, {
      ref: composedRefs,
      style: {
        pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? 'auto' : 'none' : undefined,
        ...props.style
      },
      onFocusCapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onFocusCapture, focusOutside.onFocusCapture),
      onBlurCapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onBlurCapture, focusOutside.onBlurCapture),
      onPointerDownCapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerDownCapture, pointerDownOutside.onPointerDownCapture)
    }));
  });
  /* -----------------------------------------------------------------------------------------------*/ /**
                                                                                                       * Listens for `pointerdown` outside a react subtree. We use `pointerdown` rather than `pointerup`
                                                                                                       * to mimic layer dismissing behaviour present in OS.
                                                                                                       * Returns props to pass to the node we want to check for outside events.
                                                                                                       */
  function $5cb92bef7577960e$var$usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) {
    const handlePointerDownOutside = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onPointerDownOutside);
    const isPointerInsideReactTreeRef = React$1.useRef(false);
    const handleClickRef = React$1.useRef(() => {});
    React$1.useEffect(() => {
      const handlePointerDown = event => {
        if (event.target && !isPointerInsideReactTreeRef.current) {
          const eventDetail = {
            originalEvent: event
          };
          function handleAndDispatchPointerDownOutsideEvent() {
            $5cb92bef7577960e$var$handleAndDispatchCustomEvent($5cb92bef7577960e$var$POINTER_DOWN_OUTSIDE, handlePointerDownOutside, eventDetail, {
              discrete: true
            });
          }
          /**
          * On touch devices, we need to wait for a click event because browsers implement
          * a ~350ms delay between the time the user stops touching the display and when the
          * browser executres events. We need to ensure we don't reactivate pointer-events within
          * this timeframe otherwise the browser may execute events that should have been prevented.
          *
          * Additionally, this also lets us deal automatically with cancellations when a click event
          * isn't raised because the page was considered scrolled/drag-scrolled, long-pressed, etc.
          *
          * This is why we also continuously remove the previous listener, because we cannot be
          * certain that it was raised, and therefore cleaned-up.
          */
          if (event.pointerType === 'touch') {
            ownerDocument.removeEventListener('click', handleClickRef.current);
            handleClickRef.current = handleAndDispatchPointerDownOutsideEvent;
            ownerDocument.addEventListener('click', handleClickRef.current, {
              once: true
            });
          } else handleAndDispatchPointerDownOutsideEvent();
        } else
          // We need to remove the event listener in case the outside click has been canceled.
          // See: https://github.com/radix-ui/primitives/issues/2171
          ownerDocument.removeEventListener('click', handleClickRef.current);
        isPointerInsideReactTreeRef.current = false;
      };
      /**
      * if this hook executes in a component that mounts via a `pointerdown` event, the event
      * would bubble up to the document and trigger a `pointerDownOutside` event. We avoid
      * this by delaying the event listener registration on the document.
      * This is not React specific, but rather how the DOM works, ie:
      * ```
      * button.addEventListener('pointerdown', () => {
      *   console.log('I will log');
      *   document.addEventListener('pointerdown', () => {
      *     console.log('I will also log');
      *   })
      * });
      */
      const timerId = window.setTimeout(() => {
        ownerDocument.addEventListener('pointerdown', handlePointerDown);
      }, 0);
      return () => {
        window.clearTimeout(timerId);
        ownerDocument.removeEventListener('pointerdown', handlePointerDown);
        ownerDocument.removeEventListener('click', handleClickRef.current);
      };
    }, [ownerDocument, handlePointerDownOutside]);
    return {
      // ensures we check React component tree (not just DOM tree)
      onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
    };
  }
  /**
   * Listens for when focus happens outside a react subtree.
   * Returns props to pass to the root (node) of the subtree we want to check.
   */
  function $5cb92bef7577960e$var$useFocusOutside(onFocusOutside, ownerDocument = globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) {
    const handleFocusOutside = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onFocusOutside);
    const isFocusInsideReactTreeRef = React$1.useRef(false);
    React$1.useEffect(() => {
      const handleFocus = event => {
        if (event.target && !isFocusInsideReactTreeRef.current) {
          const eventDetail = {
            originalEvent: event
          };
          $5cb92bef7577960e$var$handleAndDispatchCustomEvent($5cb92bef7577960e$var$FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
            discrete: false
          });
        }
      };
      ownerDocument.addEventListener('focusin', handleFocus);
      return () => ownerDocument.removeEventListener('focusin', handleFocus);
    }, [ownerDocument, handleFocusOutside]);
    return {
      onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
      onBlurCapture: () => isFocusInsideReactTreeRef.current = false
    };
  }
  function $5cb92bef7577960e$var$dispatchUpdate() {
    const event = new CustomEvent($5cb92bef7577960e$var$CONTEXT_UPDATE);
    document.dispatchEvent(event);
  }
  function $5cb92bef7577960e$var$handleAndDispatchCustomEvent(name, handler, detail, {
    discrete: discrete
  }) {
    const target = detail.originalEvent.target;
    const event = new CustomEvent(name, {
      bubbles: false,
      cancelable: true,
      detail: detail
    });
    if (handler) target.addEventListener(name, handler, {
      once: true
    });
    if (discrete) $8927f6f2acc4f386$export$6d1a0317bde7de7f(target, event);else target.dispatchEvent(event);
  }

  /**
   * On the server, React emits a warning when calling `useLayoutEffect`.
   * This is because neither `useLayoutEffect` nor `useEffect` run on the server.
   * We use this safe version which suppresses the warning by replacing it with a noop on the server.
   *
   * See: https://reactjs.org/docs/hooks-reference.html#uselayouteffect
   */
  const $9f79659886946c16$export$e5c5a5f917a5871c = Boolean(globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) ? React$1.useLayoutEffect : () => {};

  const $1746a345f3d73bb7$var$useReactId = React__namespace['useId'.toString()] || (() => undefined);
  let $1746a345f3d73bb7$var$count = 0;
  function $1746a345f3d73bb7$export$f680877a34711e37(deterministicId) {
    const [id, setId] = React__namespace.useState($1746a345f3d73bb7$var$useReactId()); // React versions older than 18 will have client-side ids only.
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      if (!deterministicId) setId(reactId => reactId !== null && reactId !== void 0 ? reactId : String($1746a345f3d73bb7$var$count++));
    }, [deterministicId]);
    return deterministicId || (id ? `radix-${id}` : '');
  }

  const sides = ['top', 'right', 'bottom', 'left'];
  const min = Math.min;
  const max = Math.max;
  const round = Math.round;
  const floor = Math.floor;
  const createCoords = v => ({
    x: v,
    y: v
  });
  const oppositeSideMap = {
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom'
  };
  const oppositeAlignmentMap = {
    start: 'end',
    end: 'start'
  };
  function clamp(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === 'function' ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split('-')[0];
  }
  function getAlignment(placement) {
    return placement.split('-')[1];
  }
  function getOppositeAxis(axis) {
    return axis === 'x' ? 'y' : 'x';
  }
  function getAxisLength(axis) {
    return axis === 'y' ? 'height' : 'width';
  }
  function getSideAxis(placement) {
    return ['top', 'bottom'].includes(getSide(placement)) ? 'y' : 'x';
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === 'x' ? alignment === (rtl ? 'end' : 'start') ? 'right' : 'left' : alignment === 'start' ? 'bottom' : 'top';
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.replace(/start|end/g, alignment => oppositeAlignmentMap[alignment]);
  }
  function getSideList(side, isStart, rtl) {
    const lr = ['left', 'right'];
    const rl = ['right', 'left'];
    const tb = ['top', 'bottom'];
    const bt = ['bottom', 'top'];
    switch (side) {
      case 'top':
      case 'bottom':
        if (rtl) return isStart ? rl : lr;
        return isStart ? lr : rl;
      case 'left':
      case 'right':
        return isStart ? tb : bt;
      default:
        return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === 'start', rtl);
    if (alignment) {
      list = list.map(side => side + "-" + alignment);
      if (flipAlignment) {
        list = list.concat(list.map(getOppositeAlignmentPlacement));
      }
    }
    return list;
  }
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, side => oppositeSideMap[side]);
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== 'number' ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    return {
      ...rect,
      top: rect.y,
      left: rect.x,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    };
  }

  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === 'y';
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case 'top':
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case 'bottom':
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case 'right':
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case 'left':
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    switch (getAlignment(placement)) {
      case 'start':
        coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case 'end':
        coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }
    return coords;
  }

  /**
   * Computes the `x` and `y` coordinates that will place the floating element
   * next to a reference element when it is given a certain positioning strategy.
   *
   * This export does not have any `platform` interface logic. You will need to
   * write one for the platform you are using Floating UI with.
   */
  const computePosition$1 = async (reference, floating, config) => {
    const {
      placement = 'bottom',
      strategy = 'absolute',
      middleware = [],
      platform
    } = config;
    const validMiddleware = middleware.filter(Boolean);
    const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));
    let rects = await platform.getElementRects({
      reference,
      floating,
      strategy
    });
    let {
      x,
      y
    } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let middlewareData = {};
    let resetCount = 0;
    for (let i = 0; i < validMiddleware.length; i++) {
      const {
        name,
        fn
      } = validMiddleware[i];
      const {
        x: nextX,
        y: nextY,
        data,
        reset
      } = await fn({
        x,
        y,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy,
        middlewareData,
        rects,
        platform,
        elements: {
          reference,
          floating
        }
      });
      x = nextX != null ? nextX : x;
      y = nextY != null ? nextY : y;
      middlewareData = {
        ...middlewareData,
        [name]: {
          ...middlewareData[name],
          ...data
        }
      };
      if (reset && resetCount <= 50) {
        resetCount++;
        if (typeof reset === 'object') {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }
          if (reset.rects) {
            rects = reset.rects === true ? await platform.getElementRects({
              reference,
              floating,
              strategy
            }) : reset.rects;
          }
          ({
            x,
            y
          } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }
        i = -1;
        continue;
      }
    }
    return {
      x,
      y,
      placement: statefulPlacement,
      strategy,
      middlewareData
    };
  };

  /**
   * Resolves with an object of overflow side offsets that determine how much the
   * element is overflowing a given clipping boundary on each side.
   * - positive = overflowing the boundary by that number of pixels
   * - negative = how many pixels left before it will overflow
   * - 0 = lies flush with the boundary
   * @see https://floating-ui.com/docs/detectOverflow
   */
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {
      x,
      y,
      platform,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = 'clippingAncestors',
      rootBoundary = 'viewport',
      elementContext = 'floating',
      altBoundary = false,
      padding = 0
    } = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === 'floating' ? 'reference' : 'floating';
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform.getClippingRect({
      element: ((_await$platform$isEle = await (platform.isElement == null ? void 0 : platform.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || (await (platform.getDocumentElement == null ? void 0 : platform.getDocumentElement(elements.floating))),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === 'floating' ? {
      ...rects.floating,
      x,
      y
    } : rects.reference;
    const offsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(elements.floating));
    const offsetScale = (await (platform.isElement == null ? void 0 : platform.isElement(offsetParent))) ? (await (platform.getScale == null ? void 0 : platform.getScale(offsetParent))) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }

  /**
   * Provides data to position an inner element of the floating element so that it
   * appears centered to the reference element.
   * @see https://floating-ui.com/docs/arrow
   */
  const arrow$1 = options => ({
    name: 'arrow',
    options,
    async fn(state) {
      const {
        x,
        y,
        placement,
        rects,
        platform,
        elements,
        middlewareData
      } = state;
      // Since `element` is required, we don't Partial<> the type.
      const {
        element,
        padding = 0
      } = evaluate(options, state) || {};
      if (element == null) {
        return {};
      }
      const paddingObject = getPaddingObject(padding);
      const coords = {
        x,
        y
      };
      const axis = getAlignmentAxis(placement);
      const length = getAxisLength(axis);
      const arrowDimensions = await platform.getDimensions(element);
      const isYAxis = axis === 'y';
      const minProp = isYAxis ? 'top' : 'left';
      const maxProp = isYAxis ? 'bottom' : 'right';
      const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';
      const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
      const startDiff = coords[axis] - rects.reference[axis];
      const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
      let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

      // DOM platform can return `window` as the `offsetParent`.
      if (!clientSize || !(await (platform.isElement == null ? void 0 : platform.isElement(arrowOffsetParent)))) {
        clientSize = elements.floating[clientProp] || rects.floating[length];
      }
      const centerToReference = endDiff / 2 - startDiff / 2;

      // If the padding is large enough that it causes the arrow to no longer be
      // centered, modify the padding so that it is centered.
      const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
      const minPadding = min(paddingObject[minProp], largestPossiblePadding);
      const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);

      // Make sure the arrow doesn't overflow the floating element if the center
      // point is outside the floating element's bounds.
      const min$1 = minPadding;
      const max = clientSize - arrowDimensions[length] - maxPadding;
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
      const offset = clamp(min$1, center, max);

      // If the reference is small enough that the arrow's padding causes it to
      // to point to nothing for an aligned placement, adjust the offset of the
      // floating element itself. To ensure `shift()` continues to take action,
      // a single reset is performed when this is true.
      const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center != offset && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
      const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max : 0;
      return {
        [axis]: coords[axis] + alignmentOffset,
        data: {
          [axis]: offset,
          centerOffset: center - offset - alignmentOffset,
          ...(shouldAddOffset && {
            alignmentOffset
          })
        },
        reset: shouldAddOffset
      };
    }
  });

  /**
   * Optimizes the visibility of the floating element by flipping the `placement`
   * in order to keep it in view when the preferred placement(s) will overflow the
   * clipping boundary. Alternative to `autoPlacement`.
   * @see https://floating-ui.com/docs/flip
   */
  const flip = function (options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: 'flip',
      options,
      async fn(state) {
        var _middlewareData$arrow, _middlewareData$flip;
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform,
          elements
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true,
          fallbackPlacements: specifiedFallbackPlacements,
          fallbackStrategy = 'bestFit',
          fallbackAxisSideDirection = 'none',
          flipAlignment = true,
          ...detectOverflowOptions
        } = evaluate(options, state);

        // If a reset by the arrow was caused due to an alignment offset being
        // added, we should skip any logic now since `flip()` has already done its
        // work.
        // https://github.com/floating-ui/floating-ui/issues/2549#issuecomment-1719601643
        if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        const side = getSide(placement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
        if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== 'none') {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements = [initialPlacement, ...fallbackPlacements];
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides[0]], overflow[sides[1]]);
        }
        overflowsData = [...overflowsData, {
          placement,
          overflows
        }];

        // One or more sides is overflowing.
        if (!overflows.every(side => side <= 0)) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements[nextIndex];
          if (nextPlacement) {
            // Try next placement and re-run the lifecycle.
            return {
              data: {
                index: nextIndex,
                overflows: overflowsData
              },
              reset: {
                placement: nextPlacement
              }
            };
          }

          // First, find the candidates that fit on the mainAxis side of overflow,
          // then find the placement that fits the best on the main crossAxis side.
          let resetPlacement = (_overflowsData$filter = overflowsData.filter(d => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;

          // Otherwise fallback.
          if (!resetPlacement) {
            switch (fallbackStrategy) {
              case 'bestFit':
                {
                  var _overflowsData$map$so;
                  const placement = (_overflowsData$map$so = overflowsData.map(d => [d.placement, d.overflows.filter(overflow => overflow > 0).reduce((acc, overflow) => acc + overflow, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
                  if (placement) {
                    resetPlacement = placement;
                  }
                  break;
                }
              case 'initialPlacement':
                resetPlacement = initialPlacement;
                break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      }
    };
  };
  function getSideOffsets(overflow, rect) {
    return {
      top: overflow.top - rect.height,
      right: overflow.right - rect.width,
      bottom: overflow.bottom - rect.height,
      left: overflow.left - rect.width
    };
  }
  function isAnySideFullyClipped(overflow) {
    return sides.some(side => overflow[side] >= 0);
  }
  /**
   * Provides data to hide the floating element in applicable situations, such as
   * when it is not in the same clipping context as the reference element.
   * @see https://floating-ui.com/docs/hide
   */
  const hide = function (options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: 'hide',
      options,
      async fn(state) {
        const {
          rects
        } = state;
        const {
          strategy = 'referenceHidden',
          ...detectOverflowOptions
        } = evaluate(options, state);
        switch (strategy) {
          case 'referenceHidden':
            {
              const overflow = await detectOverflow(state, {
                ...detectOverflowOptions,
                elementContext: 'reference'
              });
              const offsets = getSideOffsets(overflow, rects.reference);
              return {
                data: {
                  referenceHiddenOffsets: offsets,
                  referenceHidden: isAnySideFullyClipped(offsets)
                }
              };
            }
          case 'escaped':
            {
              const overflow = await detectOverflow(state, {
                ...detectOverflowOptions,
                altBoundary: true
              });
              const offsets = getSideOffsets(overflow, rects.floating);
              return {
                data: {
                  escapedOffsets: offsets,
                  escaped: isAnySideFullyClipped(offsets)
                }
              };
            }
          default:
            {
              return {};
            }
        }
      }
    };
  };

  // For type backwards-compatibility, the `OffsetOptions` type was also
  // Derivable.
  async function convertValueToCoords(state, options) {
    const {
      placement,
      platform,
      elements
    } = state;
    const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === 'y';
    const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options, state);

    // eslint-disable-next-line prefer-const
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === 'number' ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: 0,
      crossAxis: 0,
      alignmentAxis: null,
      ...rawValue
    };
    if (alignment && typeof alignmentAxis === 'number') {
      crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }

  /**
   * Modifies the placement by translating the floating element along the
   * specified axes.
   * A number (shorthand for `mainAxis` or distance), or an axes configuration
   * object may be passed.
   * @see https://floating-ui.com/docs/offset
   */
  const offset = function (options) {
    if (options === void 0) {
      options = 0;
    }
    return {
      name: 'offset',
      options,
      async fn(state) {
        const {
          x,
          y
        } = state;
        const diffCoords = await convertValueToCoords(state, options);
        return {
          x: x + diffCoords.x,
          y: y + diffCoords.y,
          data: diffCoords
        };
      }
    };
  };

  /**
   * Optimizes the visibility of the floating element by shifting it in order to
   * keep it in view when it will overflow the clipping boundary.
   * @see https://floating-ui.com/docs/shift
   */
  const shift = function (options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: 'shift',
      options,
      async fn(state) {
        const {
          x,
          y,
          placement
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = false,
          limiter = {
            fn: _ref => {
              let {
                x,
                y
              } = _ref;
              return {
                x,
                y
              };
            }
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const coords = {
          x,
          y
        };
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(getSide(placement));
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        if (checkMainAxis) {
          const minSide = mainAxis === 'y' ? 'top' : 'left';
          const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
          const min = mainAxisCoord + overflow[minSide];
          const max = mainAxisCoord - overflow[maxSide];
          mainAxisCoord = clamp(min, mainAxisCoord, max);
        }
        if (checkCrossAxis) {
          const minSide = crossAxis === 'y' ? 'top' : 'left';
          const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
          const min = crossAxisCoord + overflow[minSide];
          const max = crossAxisCoord - overflow[maxSide];
          crossAxisCoord = clamp(min, crossAxisCoord, max);
        }
        const limitedCoords = limiter.fn({
          ...state,
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        });
        return {
          ...limitedCoords,
          data: {
            x: limitedCoords.x - x,
            y: limitedCoords.y - y
          }
        };
      }
    };
  };
  /**
   * Built-in `limiter` that will stop `shift()` at a certain point.
   */
  const limitShift = function (options) {
    if (options === void 0) {
      options = {};
    }
    return {
      options,
      fn(state) {
        const {
          x,
          y,
          placement,
          rects,
          middlewareData
        } = state;
        const {
          offset = 0,
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true
        } = evaluate(options, state);
        const coords = {
          x,
          y
        };
        const crossAxis = getSideAxis(placement);
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        const rawOffset = evaluate(offset, state);
        const computedOffset = typeof rawOffset === 'number' ? {
          mainAxis: rawOffset,
          crossAxis: 0
        } : {
          mainAxis: 0,
          crossAxis: 0,
          ...rawOffset
        };
        if (checkMainAxis) {
          const len = mainAxis === 'y' ? 'height' : 'width';
          const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
          const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
          if (mainAxisCoord < limitMin) {
            mainAxisCoord = limitMin;
          } else if (mainAxisCoord > limitMax) {
            mainAxisCoord = limitMax;
          }
        }
        if (checkCrossAxis) {
          var _middlewareData$offse, _middlewareData$offse2;
          const len = mainAxis === 'y' ? 'width' : 'height';
          const isOriginSide = ['top', 'left'].includes(getSide(placement));
          const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
          const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
          if (crossAxisCoord < limitMin) {
            crossAxisCoord = limitMin;
          } else if (crossAxisCoord > limitMax) {
            crossAxisCoord = limitMax;
          }
        }
        return {
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        };
      }
    };
  };

  /**
   * Provides data that allows you to change the size of the floating element —
   * for instance, prevent it from overflowing the clipping boundary or match the
   * width of the reference element.
   * @see https://floating-ui.com/docs/size
   */
  const size = function (options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: 'size',
      options,
      async fn(state) {
        const {
          placement,
          rects,
          platform,
          elements
        } = state;
        const {
          apply = () => {},
          ...detectOverflowOptions
        } = evaluate(options, state);
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const side = getSide(placement);
        const alignment = getAlignment(placement);
        const isYAxis = getSideAxis(placement) === 'y';
        const {
          width,
          height
        } = rects.floating;
        let heightSide;
        let widthSide;
        if (side === 'top' || side === 'bottom') {
          heightSide = side;
          widthSide = alignment === ((await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating))) ? 'start' : 'end') ? 'left' : 'right';
        } else {
          widthSide = side;
          heightSide = alignment === 'end' ? 'top' : 'bottom';
        }
        const overflowAvailableHeight = height - overflow[heightSide];
        const overflowAvailableWidth = width - overflow[widthSide];
        const noShift = !state.middlewareData.shift;
        let availableHeight = overflowAvailableHeight;
        let availableWidth = overflowAvailableWidth;
        if (isYAxis) {
          const maximumClippingWidth = width - overflow.left - overflow.right;
          availableWidth = alignment || noShift ? min(overflowAvailableWidth, maximumClippingWidth) : maximumClippingWidth;
        } else {
          const maximumClippingHeight = height - overflow.top - overflow.bottom;
          availableHeight = alignment || noShift ? min(overflowAvailableHeight, maximumClippingHeight) : maximumClippingHeight;
        }
        if (noShift && !alignment) {
          const xMin = max(overflow.left, 0);
          const xMax = max(overflow.right, 0);
          const yMin = max(overflow.top, 0);
          const yMax = max(overflow.bottom, 0);
          if (isYAxis) {
            availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
          } else {
            availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
          }
        }
        await apply({
          ...state,
          availableWidth,
          availableHeight
        });
        const nextDimensions = await platform.getDimensions(elements.floating);
        if (width !== nextDimensions.width || height !== nextDimensions.height) {
          return {
            reset: {
              rects: true
            }
          };
        }
        return {};
      }
    };
  };

  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || '').toLowerCase();
    }
    // Mocked nodes in testing environments may not be instances of Node. By
    // returning `#document` an infinite loop won't occur.
    // https://github.com/floating-ui/floating-ui/issues/2317
    return '#document';
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null ? void 0 : (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    // Browsers without `ShadowRoot` support.
    if (typeof ShadowRoot === 'undefined') {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  function isOverflowElement(element) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle$1(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !['inline', 'contents'].includes(display);
  }
  function isTableElement(element) {
    return ['table', 'td', 'th'].includes(getNodeName(element));
  }
  function isContainingBlock(element) {
    const webkit = isWebKit();
    const css = getComputedStyle$1(element);

    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
    return css.transform !== 'none' || css.perspective !== 'none' || (css.containerType ? css.containerType !== 'normal' : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== 'none' : false) || !webkit && (css.filter ? css.filter !== 'none' : false) || ['transform', 'perspective', 'filter'].some(value => (css.willChange || '').includes(value)) || ['paint', 'layout', 'strict', 'content'].some(value => (css.contain || '').includes(value));
  }
  function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else {
        currentNode = getParentNode(currentNode);
      }
    }
    return null;
  }
  function isWebKit() {
    if (typeof CSS === 'undefined' || !CSS.supports) return false;
    return CSS.supports('-webkit-backdrop-filter', 'none');
  }
  function isLastTraversableNode(node) {
    return ['html', 'body', '#document'].includes(getNodeName(node));
  }
  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function getNodeScroll(element) {
    if (isElement(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    return {
      scrollLeft: element.pageXOffset,
      scrollTop: element.pageYOffset
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === 'html') {
      return node;
    }
    const result =
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot ||
    // DOM Element detected.
    node.parentNode ||
    // ShadowRoot detected.
    isShadowRoot(node) && node.host ||
    // Fallback.
    getDocumentElement(node);
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return node.ownerDocument ? node.ownerDocument.body : node.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], win.frameElement && traverseIframes ? getOverflowAncestors(win.frameElement) : []);
    }
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }

  function getCssDimensions(element) {
    const css = getComputedStyle$1(element);
    // In testing environments, the `width` and `height` properties are empty
    // strings for SVG elements, returning NaN. Fallback to `0` in this case.
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }
  function unwrapElement(element) {
    return !isElement(element) ? element.contextElement : element;
  }
  function getScale(element) {
    const domElement = unwrapElement(element);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $
    } = getCssDimensions(domElement);
    let x = ($ ? round(rect.width) : rect.width) / width;
    let y = ($ ? round(rect.height) : rect.height) / height;

    // 0, NaN, or Infinity should always fallback to 1.

    if (!x || !Number.isFinite(x)) {
      x = 1;
    }
    if (!y || !Number.isFinite(y)) {
      y = 1;
    }
    return {
      x,
      y
    };
  }
  const noOffsets = /*#__PURE__*/createCoords(0);
  function getVisualOffsets(element) {
    const win = getWindow(element);
    if (!isWebKit() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
      return false;
    }
    return isFixed;
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale = getScale(offsetParent);
        }
      } else {
        scale = getScale(element);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x = (clientRect.left + visualOffsets.x) / scale.x;
    let y = (clientRect.top + visualOffsets.y) / scale.y;
    let width = clientRect.width / scale.x;
    let height = clientRect.height / scale.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentIFrame = win.frameElement;
      while (currentIFrame && offsetParent && offsetWin !== win) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle$1(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x *= iframeScale.x;
        y *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x += left;
        y += top;
        currentIFrame = getWindow(currentIFrame).frameElement;
      }
    }
    return rectToClientRect({
      width,
      height,
      x,
      y
    });
  }
  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    if (offsetParent === documentElement) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale = createCoords(1);
    const offsets = createCoords(0);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== 'fixed') {
      if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    return {
      width: rect.width * scale.x,
      height: rect.height * scale.y,
      x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
      y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
    };
  }
  function getClientRects(element) {
    return Array.from(element.getClientRects());
  }
  function getWindowScrollBarX(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
  }

  // Gets the entire size of the scrollable document area, even extending outside
  // of the `<html>` and `<body>` rect bounds if horizontally scrollable.
  function getDocumentRect(element) {
    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = element.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y = -scroll.scrollTop;
    if (getComputedStyle$1(body).direction === 'rtl') {
      x += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width,
      height,
      x,
      y
    };
  }
  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x = 0;
    let y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit();
      if (!visualViewportBased || visualViewportBased && strategy === 'fixed') {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    return {
      width,
      height,
      x,
      y
    };
  }

  // Returns the inner client rect, subtracting scrollbars if present.
  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
    const width = element.clientWidth * scale.x;
    const height = element.clientHeight * scale.y;
    const x = left * scale.x;
    const y = top * scale.y;
    return {
      width,
      height,
      x,
      y
    };
  }
  function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === 'viewport') {
      rect = getViewportRect(element, strategy);
    } else if (clippingAncestor === 'document') {
      rect = getDocumentRect(getDocumentElement(element));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element);
      rect = {
        ...clippingAncestor,
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element, stopNode) {
    const parentNode = getParentNode(element);
    if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle$1(parentNode).position === 'fixed' || hasFixedPositionAncestor(parentNode, stopNode);
  }

  // A "clipping ancestor" is an `overflow` element with the characteristic of
  // clipping (or hiding) child elements. This returns all clipping ancestors
  // of the given element up the tree.
  function getClippingElementAncestors(element, cache) {
    const cachedResult = cache.get(element);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element, [], false).filter(el => isElement(el) && getNodeName(el) !== 'body');
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle$1(element).position === 'fixed';
    let currentNode = elementIsFixed ? getParentNode(element) : element;

    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle$1(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === 'fixed') {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === 'static' && !!currentContainingBlockComputedStyle && ['absolute', 'fixed'].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
      if (shouldDropCurrentNode) {
        // Drop non-containing blocks.
        result = result.filter(ancestor => ancestor !== currentNode);
      } else {
        // Record last containing block for next iteration.
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache.set(element, result);
    return result;
  }

  // Gets the maximum area that the element is visible in due to any number of
  // clipping ancestors.
  function getClippingRect(_ref) {
    let {
      element,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === 'clippingAncestors' ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstClippingAncestor = clippingAncestors[0];
    const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
    return {
      width: clippingRect.right - clippingRect.left,
      height: clippingRect.bottom - clippingRect.top,
      x: clippingRect.left,
      y: clippingRect.top
    };
  }
  function getDimensions(element) {
    return getCssDimensions(element);
  }
  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === 'fixed';
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }
    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }
  function getTrueOffsetParent(element, polyfill) {
    if (!isHTMLElement(element) || getComputedStyle$1(element).position === 'fixed') {
      return null;
    }
    if (polyfill) {
      return polyfill(element);
    }
    return element.offsetParent;
  }

  // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.
  function getOffsetParent(element, polyfill) {
    const window = getWindow(element);
    if (!isHTMLElement(element)) {
      return window;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static' && !isContainingBlock(offsetParent))) {
      return window;
    }
    return offsetParent || getContainingBlock(element) || window;
  }
  const getElementRects = async function (_ref) {
    let {
      reference,
      floating,
      strategy
    } = _ref;
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    return {
      reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
      floating: {
        x: 0,
        y: 0,
        ...(await getDimensionsFn(floating))
      }
    };
  };
  function isRTL(element) {
    return getComputedStyle$1(element).direction === 'rtl';
  }
  const platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement,
    getClippingRect,
    getOffsetParent,
    getElementRects,
    getClientRects,
    getDimensions,
    getScale,
    isElement,
    isRTL
  };

  // https://samthor.au/2021/observing-dom/
  function observeMove(element, onMove) {
    let io = null;
    let timeoutId;
    const root = getDocumentElement(element);
    function cleanup() {
      clearTimeout(timeoutId);
      io && io.disconnect();
      io = null;
    }
    function refresh(skip, threshold) {
      if (skip === void 0) {
        skip = false;
      }
      if (threshold === void 0) {
        threshold = 1;
      }
      cleanup();
      const {
        left,
        top,
        width,
        height
      } = element.getBoundingClientRect();
      if (!skip) {
        onMove();
      }
      if (!width || !height) {
        return;
      }
      const insetTop = floor(top);
      const insetRight = floor(root.clientWidth - (left + width));
      const insetBottom = floor(root.clientHeight - (top + height));
      const insetLeft = floor(left);
      const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
      const options = {
        rootMargin,
        threshold: max(0, min(1, threshold)) || 1
      };
      let isFirstUpdate = true;
      function handleObserve(entries) {
        const ratio = entries[0].intersectionRatio;
        if (ratio !== threshold) {
          if (!isFirstUpdate) {
            return refresh();
          }
          if (!ratio) {
            timeoutId = setTimeout(() => {
              refresh(false, 1e-7);
            }, 100);
          } else {
            refresh(false, ratio);
          }
        }
        isFirstUpdate = false;
      }

      // Older browsers don't support a `document` as the root and will throw an
      // error.
      try {
        io = new IntersectionObserver(handleObserve, {
          ...options,
          // Handle <iframe>s
          root: root.ownerDocument
        });
      } catch (e) {
        io = new IntersectionObserver(handleObserve, options);
      }
      io.observe(element);
    }
    refresh(true);
    return cleanup;
  }

  /**
   * Automatically updates the position of the floating element when necessary.
   * Should only be called when the floating element is mounted on the DOM or
   * visible on the screen.
   * @returns cleanup function that should be invoked when the floating element is
   * removed from the DOM or hidden from the screen.
   * @see https://floating-ui.com/docs/autoUpdate
   */
  function autoUpdate(reference, floating, update, options) {
    if (options === void 0) {
      options = {};
    }
    const {
      ancestorScroll = true,
      ancestorResize = true,
      elementResize = typeof ResizeObserver === 'function',
      layoutShift = typeof IntersectionObserver === 'function',
      animationFrame = false
    } = options;
    const referenceEl = unwrapElement(reference);
    const ancestors = ancestorScroll || ancestorResize ? [...(referenceEl ? getOverflowAncestors(referenceEl) : []), ...getOverflowAncestors(floating)] : [];
    ancestors.forEach(ancestor => {
      ancestorScroll && ancestor.addEventListener('scroll', update, {
        passive: true
      });
      ancestorResize && ancestor.addEventListener('resize', update);
    });
    const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
    let reobserveFrame = -1;
    let resizeObserver = null;
    if (elementResize) {
      resizeObserver = new ResizeObserver(_ref => {
        let [firstEntry] = _ref;
        if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
          // Prevent update loops when using the `size` middleware.
          // https://github.com/floating-ui/floating-ui/issues/1740
          resizeObserver.unobserve(floating);
          cancelAnimationFrame(reobserveFrame);
          reobserveFrame = requestAnimationFrame(() => {
            resizeObserver && resizeObserver.observe(floating);
          });
        }
        update();
      });
      if (referenceEl && !animationFrame) {
        resizeObserver.observe(referenceEl);
      }
      resizeObserver.observe(floating);
    }
    let frameId;
    let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
    if (animationFrame) {
      frameLoop();
    }
    function frameLoop() {
      const nextRefRect = getBoundingClientRect(reference);
      if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
        update();
      }
      prevRefRect = nextRefRect;
      frameId = requestAnimationFrame(frameLoop);
    }
    update();
    return () => {
      ancestors.forEach(ancestor => {
        ancestorScroll && ancestor.removeEventListener('scroll', update);
        ancestorResize && ancestor.removeEventListener('resize', update);
      });
      cleanupIo && cleanupIo();
      resizeObserver && resizeObserver.disconnect();
      resizeObserver = null;
      if (animationFrame) {
        cancelAnimationFrame(frameId);
      }
    };
  }

  /**
   * Computes the `x` and `y` coordinates that will place the floating element
   * next to a reference element when it is given a certain CSS positioning
   * strategy.
   */
  const computePosition = (reference, floating, options) => {
    // This caches the expensive `getClippingElementAncestors` function so that
    // multiple lifecycle resets re-use the same result. It only lives for a
    // single call. If other functions become expensive, we can add them as well.
    const cache = new Map();
    const mergedOptions = {
      platform,
      ...options
    };
    const platformWithCache = {
      ...mergedOptions.platform,
      _c: cache
    };
    return computePosition$1(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };

  /**
   * Provides data to position an inner element of the floating element so that it
   * appears centered to the reference element.
   * This wraps the core `arrow` middleware to allow React refs as the element.
   * @see https://floating-ui.com/docs/arrow
   */
  const arrow = options => {
    function isRef(value) {
      return {}.hasOwnProperty.call(value, 'current');
    }
    return {
      name: 'arrow',
      options,
      fn(state) {
        const {
          element,
          padding
        } = typeof options === 'function' ? options(state) : options;
        if (element && isRef(element)) {
          if (element.current != null) {
            return arrow$1({
              element: element.current,
              padding
            }).fn(state);
          }
          return {};
        } else if (element) {
          return arrow$1({
            element,
            padding
          }).fn(state);
        }
        return {};
      }
    };
  };
  var index = typeof document !== 'undefined' ? React$1.useLayoutEffect : React$1.useEffect;

  // Fork of `fast-deep-equal` that only does the comparisons we need and compares
  // functions
  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (typeof a !== typeof b) {
      return false;
    }
    if (typeof a === 'function' && a.toString() === b.toString()) {
      return true;
    }
    let length, i, keys;
    if (a && b && typeof a == 'object') {
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length) return false;
        for (i = length; i-- !== 0;) {
          if (!deepEqual(a[i], b[i])) {
            return false;
          }
        }
        return true;
      }
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) {
        return false;
      }
      for (i = length; i-- !== 0;) {
        if (!{}.hasOwnProperty.call(b, keys[i])) {
          return false;
        }
      }
      for (i = length; i-- !== 0;) {
        const key = keys[i];
        if (key === '_owner' && a.$$typeof) {
          continue;
        }
        if (!deepEqual(a[key], b[key])) {
          return false;
        }
      }
      return true;
    }
    return a !== a && b !== b;
  }
  function getDPR(element) {
    if (typeof window === 'undefined') {
      return 1;
    }
    const win = element.ownerDocument.defaultView || window;
    return win.devicePixelRatio || 1;
  }
  function roundByDPR(element, value) {
    const dpr = getDPR(element);
    return Math.round(value * dpr) / dpr;
  }
  function useLatestRef(value) {
    const ref = React__namespace.useRef(value);
    index(() => {
      ref.current = value;
    });
    return ref;
  }

  /**
   * Provides data to position a floating element.
   * @see https://floating-ui.com/docs/useFloating
   */
  function useFloating(options) {
    if (options === void 0) {
      options = {};
    }
    const {
      placement = 'bottom',
      strategy = 'absolute',
      middleware = [],
      platform,
      elements: {
        reference: externalReference,
        floating: externalFloating
      } = {},
      transform = true,
      whileElementsMounted,
      open
    } = options;
    const [data, setData] = React__namespace.useState({
      x: 0,
      y: 0,
      strategy,
      placement,
      middlewareData: {},
      isPositioned: false
    });
    const [latestMiddleware, setLatestMiddleware] = React__namespace.useState(middleware);
    if (!deepEqual(latestMiddleware, middleware)) {
      setLatestMiddleware(middleware);
    }
    const [_reference, _setReference] = React__namespace.useState(null);
    const [_floating, _setFloating] = React__namespace.useState(null);
    const setReference = React__namespace.useCallback(node => {
      if (node != referenceRef.current) {
        referenceRef.current = node;
        _setReference(node);
      }
    }, [_setReference]);
    const setFloating = React__namespace.useCallback(node => {
      if (node !== floatingRef.current) {
        floatingRef.current = node;
        _setFloating(node);
      }
    }, [_setFloating]);
    const referenceEl = externalReference || _reference;
    const floatingEl = externalFloating || _floating;
    const referenceRef = React__namespace.useRef(null);
    const floatingRef = React__namespace.useRef(null);
    const dataRef = React__namespace.useRef(data);
    const whileElementsMountedRef = useLatestRef(whileElementsMounted);
    const platformRef = useLatestRef(platform);
    const update = React__namespace.useCallback(() => {
      if (!referenceRef.current || !floatingRef.current) {
        return;
      }
      const config = {
        placement,
        strategy,
        middleware: latestMiddleware
      };
      if (platformRef.current) {
        config.platform = platformRef.current;
      }
      computePosition(referenceRef.current, floatingRef.current, config).then(data => {
        const fullData = {
          ...data,
          isPositioned: true
        };
        if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
          dataRef.current = fullData;
          ReactDOM__namespace.flushSync(() => {
            setData(fullData);
          });
        }
      });
    }, [latestMiddleware, placement, strategy, platformRef]);
    index(() => {
      if (open === false && dataRef.current.isPositioned) {
        dataRef.current.isPositioned = false;
        setData(data => ({
          ...data,
          isPositioned: false
        }));
      }
    }, [open]);
    const isMountedRef = React__namespace.useRef(false);
    index(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    index(() => {
      if (referenceEl) referenceRef.current = referenceEl;
      if (floatingEl) floatingRef.current = floatingEl;
      if (referenceEl && floatingEl) {
        if (whileElementsMountedRef.current) {
          return whileElementsMountedRef.current(referenceEl, floatingEl, update);
        } else {
          update();
        }
      }
    }, [referenceEl, floatingEl, update, whileElementsMountedRef]);
    const refs = React__namespace.useMemo(() => ({
      reference: referenceRef,
      floating: floatingRef,
      setReference,
      setFloating
    }), [setReference, setFloating]);
    const elements = React__namespace.useMemo(() => ({
      reference: referenceEl,
      floating: floatingEl
    }), [referenceEl, floatingEl]);
    const floatingStyles = React__namespace.useMemo(() => {
      const initialStyles = {
        position: strategy,
        left: 0,
        top: 0
      };
      if (!elements.floating) {
        return initialStyles;
      }
      const x = roundByDPR(elements.floating, data.x);
      const y = roundByDPR(elements.floating, data.y);
      if (transform) {
        return {
          ...initialStyles,
          transform: "translate(" + x + "px, " + y + "px)",
          ...(getDPR(elements.floating) >= 1.5 && {
            willChange: 'transform'
          })
        };
      }
      return {
        position: strategy,
        left: x,
        top: y
      };
    }, [strategy, transform, elements.floating, data.x, data.y]);
    return React__namespace.useMemo(() => ({
      ...data,
      update,
      refs,
      elements,
      floatingStyles
    }), [data, update, refs, elements, floatingStyles]);
  }

  function $db6c3485150b8e66$export$1ab7ae714698c4b8(element) {
    const [size, setSize] = React$1.useState(undefined);
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      if (element) {
        // provide size as early as possible
        setSize({
          width: element.offsetWidth,
          height: element.offsetHeight
        });
        const resizeObserver = new ResizeObserver(entries => {
          if (!Array.isArray(entries)) return;
          // Since we only observe the one element, we don't need to loop over the
          // array
          if (!entries.length) return;
          const entry = entries[0];
          let width;
          let height;
          if ('borderBoxSize' in entry) {
            const borderSizeEntry = entry['borderBoxSize']; // iron out differences between browsers
            const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
            width = borderSize['inlineSize'];
            height = borderSize['blockSize'];
          } else {
            // for browsers that don't support `borderBoxSize`
            // we calculate it ourselves to get the correct border box.
            width = element.offsetWidth;
            height = element.offsetHeight;
          }
          setSize({
            width: width,
            height: height
          });
        });
        resizeObserver.observe(element, {
          box: 'border-box'
        });
        return () => resizeObserver.unobserve(element);
      } else
        // We only want to reset to `undefined` when the element becomes `null`,
        // not if it changes to another element.
        setSize(undefined);
    }, [element]);
    return size;
  }

  /* -------------------------------------------------------------------------------------------------
   * Popper
   * -----------------------------------------------------------------------------------------------*/
  const $cf1ac5d9fe0e8206$var$POPPER_NAME = 'Popper';
  const [$cf1ac5d9fe0e8206$var$createPopperContext, $cf1ac5d9fe0e8206$export$722aac194ae923] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($cf1ac5d9fe0e8206$var$POPPER_NAME);
  const [$cf1ac5d9fe0e8206$var$PopperProvider, $cf1ac5d9fe0e8206$var$usePopperContext] = $cf1ac5d9fe0e8206$var$createPopperContext($cf1ac5d9fe0e8206$var$POPPER_NAME);
  const $cf1ac5d9fe0e8206$export$badac9ada3a0bdf9 = props => {
    const {
      __scopePopper: __scopePopper,
      children: children
    } = props;
    const [anchor, setAnchor] = React$1.useState(null);
    return /*#__PURE__*/React$1.createElement($cf1ac5d9fe0e8206$var$PopperProvider, {
      scope: __scopePopper,
      anchor: anchor,
      onAnchorChange: setAnchor
    }, children);
  };
  /* -------------------------------------------------------------------------------------------------
   * PopperAnchor
   * -----------------------------------------------------------------------------------------------*/
  const $cf1ac5d9fe0e8206$var$ANCHOR_NAME = 'PopperAnchor';
  const $cf1ac5d9fe0e8206$export$ecd4e1ccab6ed6d = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopePopper: __scopePopper,
      virtualRef: virtualRef,
      ...anchorProps
    } = props;
    const context = $cf1ac5d9fe0e8206$var$usePopperContext($cf1ac5d9fe0e8206$var$ANCHOR_NAME, __scopePopper);
    const ref = React$1.useRef(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref);
    React$1.useEffect(() => {
      // Consumer can anchor the popper to something that isn't
      // a DOM node e.g. pointer position, so we override the
      // `anchorRef` with their virtual ref in this case.
      context.onAnchorChange((virtualRef === null || virtualRef === void 0 ? void 0 : virtualRef.current) || ref.current);
    });
    return virtualRef ? null : /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, anchorProps, {
      ref: composedRefs
    }));
  });
  /* -------------------------------------------------------------------------------------------------
   * PopperContent
   * -----------------------------------------------------------------------------------------------*/
  const $cf1ac5d9fe0e8206$var$CONTENT_NAME = 'PopperContent';
  const [$cf1ac5d9fe0e8206$var$PopperContentProvider, $cf1ac5d9fe0e8206$var$useContentContext] = $cf1ac5d9fe0e8206$var$createPopperContext($cf1ac5d9fe0e8206$var$CONTENT_NAME);
  const $cf1ac5d9fe0e8206$export$bc4ae5855d3c4fc = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    var _arrowSize$width, _arrowSize$height, _middlewareData$arrow, _middlewareData$arrow2, _middlewareData$arrow3, _middlewareData$trans, _middlewareData$trans2, _middlewareData$hide;
    const {
      __scopePopper: __scopePopper,
      side = 'bottom',
      sideOffset = 0,
      align = 'center',
      alignOffset = 0,
      arrowPadding = 0,
      avoidCollisions = true,
      collisionBoundary = [],
      collisionPadding: collisionPaddingProp = 0,
      sticky = 'partial',
      hideWhenDetached = false,
      updatePositionStrategy = 'optimized',
      onPlaced: onPlaced,
      ...contentProps
    } = props;
    const context = $cf1ac5d9fe0e8206$var$usePopperContext($cf1ac5d9fe0e8206$var$CONTENT_NAME, __scopePopper);
    const [content, setContent] = React$1.useState(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, node => setContent(node));
    const [arrow$1, setArrow] = React$1.useState(null);
    const arrowSize = $db6c3485150b8e66$export$1ab7ae714698c4b8(arrow$1);
    const arrowWidth = (_arrowSize$width = arrowSize === null || arrowSize === void 0 ? void 0 : arrowSize.width) !== null && _arrowSize$width !== void 0 ? _arrowSize$width : 0;
    const arrowHeight = (_arrowSize$height = arrowSize === null || arrowSize === void 0 ? void 0 : arrowSize.height) !== null && _arrowSize$height !== void 0 ? _arrowSize$height : 0;
    const desiredPlacement = side + (align !== 'center' ? '-' + align : '');
    const collisionPadding = typeof collisionPaddingProp === 'number' ? collisionPaddingProp : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...collisionPaddingProp
    };
    const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
    const hasExplicitBoundaries = boundary.length > 0;
    const detectOverflowOptions = {
      padding: collisionPadding,
      boundary: boundary.filter($cf1ac5d9fe0e8206$var$isNotNull),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: hasExplicitBoundaries
    };
    const {
      refs: refs,
      floatingStyles: floatingStyles,
      placement: placement,
      isPositioned: isPositioned,
      middlewareData: middlewareData
    } = useFloating({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: 'fixed',
      placement: desiredPlacement,
      whileElementsMounted: (...args) => {
        const cleanup = autoUpdate(...args, {
          animationFrame: updatePositionStrategy === 'always'
        });
        return cleanup;
      },
      elements: {
        reference: context.anchor
      },
      middleware: [offset({
        mainAxis: sideOffset + arrowHeight,
        alignmentAxis: alignOffset
      }), avoidCollisions && shift({
        mainAxis: true,
        crossAxis: false,
        limiter: sticky === 'partial' ? limitShift() : undefined,
        ...detectOverflowOptions
      }), avoidCollisions && flip({
        ...detectOverflowOptions
      }), size({
        ...detectOverflowOptions,
        apply: ({
          elements: elements,
          rects: rects,
          availableWidth: availableWidth,
          availableHeight: availableHeight
        }) => {
          const {
            width: anchorWidth,
            height: anchorHeight
          } = rects.reference;
          const contentStyle = elements.floating.style;
          contentStyle.setProperty('--radix-popper-available-width', `${availableWidth}px`);
          contentStyle.setProperty('--radix-popper-available-height', `${availableHeight}px`);
          contentStyle.setProperty('--radix-popper-anchor-width', `${anchorWidth}px`);
          contentStyle.setProperty('--radix-popper-anchor-height', `${anchorHeight}px`);
        }
      }), arrow$1 && arrow({
        element: arrow$1,
        padding: arrowPadding
      }), $cf1ac5d9fe0e8206$var$transformOrigin({
        arrowWidth: arrowWidth,
        arrowHeight: arrowHeight
      }), hideWhenDetached && hide({
        strategy: 'referenceHidden',
        ...detectOverflowOptions
      })]
    });
    const [placedSide, placedAlign] = $cf1ac5d9fe0e8206$var$getSideAndAlignFromPlacement(placement);
    const handlePlaced = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onPlaced);
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      if (isPositioned) handlePlaced === null || handlePlaced === void 0 || handlePlaced();
    }, [isPositioned, handlePlaced]);
    const arrowX = (_middlewareData$arrow = middlewareData.arrow) === null || _middlewareData$arrow === void 0 ? void 0 : _middlewareData$arrow.x;
    const arrowY = (_middlewareData$arrow2 = middlewareData.arrow) === null || _middlewareData$arrow2 === void 0 ? void 0 : _middlewareData$arrow2.y;
    const cannotCenterArrow = ((_middlewareData$arrow3 = middlewareData.arrow) === null || _middlewareData$arrow3 === void 0 ? void 0 : _middlewareData$arrow3.centerOffset) !== 0;
    const [contentZIndex, setContentZIndex] = React$1.useState();
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]);
    return /*#__PURE__*/React$1.createElement("div", {
      ref: refs.setFloating,
      "data-radix-popper-content-wrapper": "",
      style: {
        ...floatingStyles,
        transform: isPositioned ? floatingStyles.transform : 'translate(0, -200%)',
        // keep off the page when measuring
        minWidth: 'max-content',
        zIndex: contentZIndex,
        ['--radix-popper-transform-origin']: [(_middlewareData$trans = middlewareData.transformOrigin) === null || _middlewareData$trans === void 0 ? void 0 : _middlewareData$trans.x, (_middlewareData$trans2 = middlewareData.transformOrigin) === null || _middlewareData$trans2 === void 0 ? void 0 : _middlewareData$trans2.y].join(' ')
      } // Floating UI interally calculates logical alignment based the `dir` attribute on
      ,

      dir: props.dir
    }, /*#__PURE__*/React$1.createElement($cf1ac5d9fe0e8206$var$PopperContentProvider, {
      scope: __scopePopper,
      placedSide: placedSide,
      onArrowChange: setArrow,
      arrowX: arrowX,
      arrowY: arrowY,
      shouldHideArrow: cannotCenterArrow
    }, /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      "data-side": placedSide,
      "data-align": placedAlign
    }, contentProps, {
      ref: composedRefs,
      style: {
        ...contentProps.style,
        // if the PopperContent hasn't been placed yet (not all measurements done)
        // we prevent animations so that users's animation don't kick in too early referring wrong sides
        animation: !isPositioned ? 'none' : undefined,
        // hide the content if using the hide middleware and should be hidden
        opacity: (_middlewareData$hide = middlewareData.hide) !== null && _middlewareData$hide !== void 0 && _middlewareData$hide.referenceHidden ? 0 : undefined
      }
    }))));
  });
  /* -----------------------------------------------------------------------------------------------*/
  function $cf1ac5d9fe0e8206$var$isNotNull(value) {
    return value !== null;
  }
  const $cf1ac5d9fe0e8206$var$transformOrigin = options => ({
    name: 'transformOrigin',
    options: options,
    fn(data) {
      var _middlewareData$arrow4, _middlewareData$arrow5, _middlewareData$arrow6, _middlewareData$arrow7, _middlewareData$arrow8;
      const {
        placement: placement,
        rects: rects,
        middlewareData: middlewareData
      } = data;
      const cannotCenterArrow = ((_middlewareData$arrow4 = middlewareData.arrow) === null || _middlewareData$arrow4 === void 0 ? void 0 : _middlewareData$arrow4.centerOffset) !== 0;
      const isArrowHidden = cannotCenterArrow;
      const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
      const [placedSide, placedAlign] = $cf1ac5d9fe0e8206$var$getSideAndAlignFromPlacement(placement);
      const noArrowAlign = {
        start: '0%',
        center: '50%',
        end: '100%'
      }[placedAlign];
      const arrowXCenter = ((_middlewareData$arrow5 = (_middlewareData$arrow6 = middlewareData.arrow) === null || _middlewareData$arrow6 === void 0 ? void 0 : _middlewareData$arrow6.x) !== null && _middlewareData$arrow5 !== void 0 ? _middlewareData$arrow5 : 0) + arrowWidth / 2;
      const arrowYCenter = ((_middlewareData$arrow7 = (_middlewareData$arrow8 = middlewareData.arrow) === null || _middlewareData$arrow8 === void 0 ? void 0 : _middlewareData$arrow8.y) !== null && _middlewareData$arrow7 !== void 0 ? _middlewareData$arrow7 : 0) + arrowHeight / 2;
      let x = '';
      let y = '';
      if (placedSide === 'bottom') {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${-arrowHeight}px`;
      } else if (placedSide === 'top') {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${rects.floating.height + arrowHeight}px`;
      } else if (placedSide === 'right') {
        x = `${-arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      } else if (placedSide === 'left') {
        x = `${rects.floating.width + arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      }
      return {
        data: {
          x: x,
          y: y
        }
      };
    }
  });
  function $cf1ac5d9fe0e8206$var$getSideAndAlignFromPlacement(placement) {
    const [side, align = 'center'] = placement.split('-');
    return [side, align];
  }
  const $cf1ac5d9fe0e8206$export$be92b6f5f03c0fe9 = $cf1ac5d9fe0e8206$export$badac9ada3a0bdf9;
  const $cf1ac5d9fe0e8206$export$b688253958b8dfe7 = $cf1ac5d9fe0e8206$export$ecd4e1ccab6ed6d;
  const $cf1ac5d9fe0e8206$export$7c6e2c02157bb7d2 = $cf1ac5d9fe0e8206$export$bc4ae5855d3c4fc;

  const $f1701beae083dbae$export$602eac185826482c = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    var _globalThis$document;
    const {
      container = globalThis === null || globalThis === void 0 ? void 0 : (_globalThis$document = globalThis.document) === null || _globalThis$document === void 0 ? void 0 : _globalThis$document.body,
      ...portalProps
    } = props;
    return container ? /*#__PURE__*/ReactDOM.createPortal( /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, portalProps, {
      ref: forwardedRef
    })), container) : null;
  });

  function $fe963b355347cc68$export$3e6543de14f8614f(initialState, machine) {
    return React$1.useReducer((state, event) => {
      const nextState = machine[state][event];
      return nextState !== null && nextState !== void 0 ? nextState : state;
    }, initialState);
  }
  const $921a889cee6df7e8$export$99c2b779aa4e8b8b = props => {
    const {
      present: present,
      children: children
    } = props;
    const presence = $921a889cee6df7e8$var$usePresence(present);
    const child = typeof children === 'function' ? children({
      present: presence.isPresent
    }) : React$1.Children.only(children);
    const ref = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(presence.ref, child.ref);
    const forceMount = typeof children === 'function';
    return forceMount || presence.isPresent ? /*#__PURE__*/React$1.cloneElement(child, {
      ref: ref
    }) : null;
  };
  $921a889cee6df7e8$export$99c2b779aa4e8b8b.displayName = 'Presence';
  /* -------------------------------------------------------------------------------------------------
   * usePresence
   * -----------------------------------------------------------------------------------------------*/
  function $921a889cee6df7e8$var$usePresence(present) {
    const [node1, setNode] = React$1.useState();
    const stylesRef = React$1.useRef({});
    const prevPresentRef = React$1.useRef(present);
    const prevAnimationNameRef = React$1.useRef('none');
    const initialState = present ? 'mounted' : 'unmounted';
    const [state, send] = $fe963b355347cc68$export$3e6543de14f8614f(initialState, {
      mounted: {
        UNMOUNT: 'unmounted',
        ANIMATION_OUT: 'unmountSuspended'
      },
      unmountSuspended: {
        MOUNT: 'mounted',
        ANIMATION_END: 'unmounted'
      },
      unmounted: {
        MOUNT: 'mounted'
      }
    });
    React$1.useEffect(() => {
      const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
      prevAnimationNameRef.current = state === 'mounted' ? currentAnimationName : 'none';
    }, [state]);
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      const styles = stylesRef.current;
      const wasPresent = prevPresentRef.current;
      const hasPresentChanged = wasPresent !== present;
      if (hasPresentChanged) {
        const prevAnimationName = prevAnimationNameRef.current;
        const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(styles);
        if (present) send('MOUNT');else if (currentAnimationName === 'none' || (styles === null || styles === void 0 ? void 0 : styles.display) === 'none')
          // If there is no exit animation or the element is hidden, animations won't run
          // so we unmount instantly
          send('UNMOUNT');else {
          /**
          * When `present` changes to `false`, we check changes to animation-name to
          * determine whether an animation has started. We chose this approach (reading
          * computed styles) because there is no `animationrun` event and `animationstart`
          * fires after `animation-delay` has expired which would be too late.
          */
          const isAnimating = prevAnimationName !== currentAnimationName;
          if (wasPresent && isAnimating) send('ANIMATION_OUT');else send('UNMOUNT');
        }
        prevPresentRef.current = present;
      }
    }, [present, send]);
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      if (node1) {
        /**
        * Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
        * event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
        * make sure we only trigger ANIMATION_END for the currently active animation.
        */
        const handleAnimationEnd = event => {
          const currentAnimationName = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
          const isCurrentAnimation = currentAnimationName.includes(event.animationName);
          if (event.target === node1 && isCurrentAnimation)
            // With React 18 concurrency this update is applied
            // a frame after the animation ends, creating a flash of visible content.
            // By manually flushing we ensure they sync within a frame, removing the flash.
            ReactDOM.flushSync(() => send('ANIMATION_END'));
        };
        const handleAnimationStart = event => {
          if (event.target === node1)
            // if animation occurred, store its name as the previous animation.
            prevAnimationNameRef.current = $921a889cee6df7e8$var$getAnimationName(stylesRef.current);
        };
        node1.addEventListener('animationstart', handleAnimationStart);
        node1.addEventListener('animationcancel', handleAnimationEnd);
        node1.addEventListener('animationend', handleAnimationEnd);
        return () => {
          node1.removeEventListener('animationstart', handleAnimationStart);
          node1.removeEventListener('animationcancel', handleAnimationEnd);
          node1.removeEventListener('animationend', handleAnimationEnd);
        };
      } else
        // Transition to the unmounted state if the node is removed prematurely.
        // We avoid doing so during cleanup as the node may change but still exist.
        send('ANIMATION_END');
    }, [node1, send]);
    return {
      isPresent: ['mounted', 'unmountSuspended'].includes(state),
      ref: React$1.useCallback(node => {
        if (node) stylesRef.current = getComputedStyle(node);
        setNode(node);
      }, [])
    };
  }
  /* -----------------------------------------------------------------------------------------------*/
  function $921a889cee6df7e8$var$getAnimationName(styles) {
    return (styles === null || styles === void 0 ? void 0 : styles.animationName) || 'none';
  }

  function $71cd76cc60e0454e$export$6f32135080cb4c3({
    prop: prop,
    defaultProp: defaultProp,
    onChange = () => {}
  }) {
    const [uncontrolledProp, setUncontrolledProp] = $71cd76cc60e0454e$var$useUncontrolledState({
      defaultProp: defaultProp,
      onChange: onChange
    });
    const isControlled = prop !== undefined;
    const value1 = isControlled ? prop : uncontrolledProp;
    const handleChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onChange);
    const setValue = React$1.useCallback(nextValue => {
      if (isControlled) {
        const setter = nextValue;
        const value = typeof nextValue === 'function' ? setter(prop) : nextValue;
        if (value !== prop) handleChange(value);
      } else setUncontrolledProp(nextValue);
    }, [isControlled, prop, setUncontrolledProp, handleChange]);
    return [value1, setValue];
  }
  function $71cd76cc60e0454e$var$useUncontrolledState({
    defaultProp: defaultProp,
    onChange: onChange
  }) {
    const uncontrolledState = React$1.useState(defaultProp);
    const [value] = uncontrolledState;
    const prevValueRef = React$1.useRef(value);
    const handleChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onChange);
    React$1.useEffect(() => {
      if (prevValueRef.current !== value) {
        handleChange(value);
        prevValueRef.current = value;
      }
    }, [value, prevValueRef, handleChange]);
    return uncontrolledState;
  }

  const $ea1ef594cf570d83$export$439d29a4e110a164 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    return /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.span, _extends({}, props, {
      ref: forwardedRef,
      style: {
        // See: https://github.com/twbs/bootstrap/blob/master/scss/mixins/_screen-reader.scss
        position: 'absolute',
        border: 0,
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
        ...props.style
      }
    }));
  });

  const [$a093c7e1ec25a057$var$createTooltipContext, $a093c7e1ec25a057$export$1c540a2224f0d865] = $c512c27ab02ef895$export$50c7b4e9d9f19c1('Tooltip', [$cf1ac5d9fe0e8206$export$722aac194ae923]);
  $cf1ac5d9fe0e8206$export$722aac194ae923();
  /* -------------------------------------------------------------------------------------------------
   * TooltipProvider
   * -----------------------------------------------------------------------------------------------*/
  const $a093c7e1ec25a057$var$PROVIDER_NAME = 'TooltipProvider';
  const $a093c7e1ec25a057$var$DEFAULT_DELAY_DURATION = 700;
  const [$a093c7e1ec25a057$var$TooltipProviderContextProvider, $a093c7e1ec25a057$var$useTooltipProviderContext] = $a093c7e1ec25a057$var$createTooltipContext($a093c7e1ec25a057$var$PROVIDER_NAME);
  const $a093c7e1ec25a057$export$f78649fb9ca566b8 = props => {
    const {
      __scopeTooltip: __scopeTooltip,
      delayDuration = $a093c7e1ec25a057$var$DEFAULT_DELAY_DURATION,
      skipDelayDuration = 300,
      disableHoverableContent = false,
      children: children
    } = props;
    const [isOpenDelayed, setIsOpenDelayed] = React$1.useState(true);
    const isPointerInTransitRef = React$1.useRef(false);
    const skipDelayTimerRef = React$1.useRef(0);
    React$1.useEffect(() => {
      const skipDelayTimer = skipDelayTimerRef.current;
      return () => window.clearTimeout(skipDelayTimer);
    }, []);
    return /*#__PURE__*/React$1.createElement($a093c7e1ec25a057$var$TooltipProviderContextProvider, {
      scope: __scopeTooltip,
      isOpenDelayed: isOpenDelayed,
      delayDuration: delayDuration,
      onOpen: React$1.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        setIsOpenDelayed(false);
      }, []),
      onClose: React$1.useCallback(() => {
        window.clearTimeout(skipDelayTimerRef.current);
        skipDelayTimerRef.current = window.setTimeout(() => setIsOpenDelayed(true), skipDelayDuration);
      }, [skipDelayDuration]),
      isPointerInTransitRef: isPointerInTransitRef,
      onPointerInTransitChange: React$1.useCallback(inTransit => {
        isPointerInTransitRef.current = inTransit;
      }, []),
      disableHoverableContent: disableHoverableContent
    }, children);
  };
  /* -------------------------------------------------------------------------------------------------
   * Tooltip
   * -----------------------------------------------------------------------------------------------*/
  const $a093c7e1ec25a057$var$TOOLTIP_NAME = 'Tooltip';
  $a093c7e1ec25a057$var$createTooltipContext($a093c7e1ec25a057$var$TOOLTIP_NAME);
  /* -------------------------------------------------------------------------------------------------
   * TooltipPortal
   * -----------------------------------------------------------------------------------------------*/
  const $a093c7e1ec25a057$var$PORTAL_NAME = 'TooltipPortal';
  $a093c7e1ec25a057$var$createTooltipContext($a093c7e1ec25a057$var$PORTAL_NAME, {
    forceMount: undefined
  });
  $a093c7e1ec25a057$var$createTooltipContext($a093c7e1ec25a057$var$TOOLTIP_NAME, {
    isInside: false
  });
  const $a093c7e1ec25a057$export$2881499e37b75b9a = $a093c7e1ec25a057$export$f78649fb9ca566b8;

  const $f631663db3294ace$var$DirectionContext = /*#__PURE__*/React$1.createContext(undefined);
  /* -------------------------------------------------------------------------------------------------
   * Direction
   * -----------------------------------------------------------------------------------------------*/
  const $f631663db3294ace$export$c760c09fdd558351 = props => {
    const {
      dir: dir,
      children: children
    } = props;
    return /*#__PURE__*/React$1.createElement($f631663db3294ace$var$DirectionContext.Provider, {
      value: dir
    }, children);
  };
  /* -----------------------------------------------------------------------------------------------*/
  function $f631663db3294ace$export$b39126d51d94e6f3(localDir) {
    const globalDir = React$1.useContext($f631663db3294ace$var$DirectionContext);
    return localDir || globalDir || 'ltr';
  }

  // prettier-ignore
  const radixColorScalesRegular = ['tomato', 'red', 'ruby', 'crimson', 'pink', 'plum', 'purple', 'violet', 'iris', 'indigo', 'blue', 'cyan', 'teal', 'jade', 'green', 'grass', 'brown', 'orange'];
  const radixColorScalesBright = ['sky', 'mint', 'lime', 'yellow', 'amber'];
  const radixColorScalesMetal = ['gold', 'bronze'];
  // prettier-ignore
  const radixColorScales = [...radixColorScalesRegular, ...radixColorScalesBright, ...radixColorScalesMetal];
  const radixGrayScalePure = 'gray';
  const radixGrayScalesDesaturated = ['mauve', 'slate', 'sage', 'olive', 'sand'];
  const radixGrayScales = [radixGrayScalePure, ...radixGrayScalesDesaturated];
  function radixGetMatchingGrayScale(colorScale) {
    switch (colorScale) {
      case 'tomato':
      case 'red':
      case 'ruby':
      case 'crimson':
      case 'pink':
      case 'plum':
      case 'purple':
      case 'violet':
        return 'mauve';
      case 'iris':
      case 'indigo':
      case 'blue':
      case 'sky':
      case 'cyan':
        return 'slate';
      case 'teal':
      case 'jade':
      case 'mint':
      case 'green':
        return 'sage';
      case 'grass':
      case 'lime':
        return 'olive';
      case 'yellow':
      case 'amber':
      case 'orange':
      case 'brown':
      case 'gold':
      case 'bronze':
        return 'sand';
    }
  }

  const appearances = ['inherit', 'light', 'dark'];
  const accentColors = [...radixColorScales, 'gray'];
  const grayColors = [...radixGrayScales, 'auto'];
  const panelBackgrounds = ['solid', 'translucent'];
  const radii = ['none', 'small', 'medium', 'large', 'full'];
  const scalings = ['90%', '95%', '100%', '105%', '110%'];
  const themePropDefs = {
    hasBackground: {
      type: 'boolean',
      default: true
    },
    appearance: {
      type: 'enum',
      values: appearances,
      default: 'inherit'
    },
    accentColor: {
      type: 'enum',
      values: accentColors,
      default: 'indigo'
    },
    grayColor: {
      type: 'enum',
      values: grayColors,
      default: 'auto'
    },
    panelBackground: {
      type: 'enum',
      values: panelBackgrounds,
      default: 'translucent'
    },
    radius: {
      type: 'enum',
      values: radii,
      default: 'medium'
    },
    scaling: {
      type: 'enum',
      values: scalings,
      default: '100%'
    }
  };
  function getMatchingGrayColor(accentColor) {
    if (accentColor === 'gray') return 'gray';
    return radixGetMatchingGrayScale(accentColor);
  }

  const noop = () => {};
  const ThemeContext = React__namespace.createContext(undefined);
  function useThemeContext() {
    const context = React__namespace.useContext(ThemeContext);
    if (context === undefined) {
      throw new Error('`useThemeContext` must be used within a `Theme`');
    }
    return context;
  }
  const Theme = React__namespace.forwardRef((props, forwardedRef) => {
    const context = React__namespace.useContext(ThemeContext);
    const isRoot = context === undefined;
    if (isRoot) {
      return React__namespace.createElement($a093c7e1ec25a057$export$2881499e37b75b9a, null, React__namespace.createElement($f631663db3294ace$export$c760c09fdd558351, {
        dir: "ltr"
      }, React__namespace.createElement(ThemeRoot, {
        ...props,
        ref: forwardedRef
      })));
    }
    return React__namespace.createElement(ThemeImpl, {
      ...props,
      ref: forwardedRef
    });
  });
  Theme.displayName = 'Theme';
  const ThemeRoot = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      appearance: appearanceProp = themePropDefs.appearance.default,
      accentColor: accentColorProp = themePropDefs.accentColor.default,
      grayColor: grayColorProp = themePropDefs.grayColor.default,
      panelBackground: panelBackgroundProp = themePropDefs.panelBackground.default,
      radius: radiusProp = themePropDefs.radius.default,
      scaling: scalingProp = themePropDefs.scaling.default,
      hasBackground = themePropDefs.hasBackground.default,
      ...rootProps
    } = props;
    const [appearance, setAppearance] = React__namespace.useState(appearanceProp);
    React__namespace.useEffect(() => setAppearance(appearanceProp), [appearanceProp]);
    const [accentColor, setAccentColor] = React__namespace.useState(accentColorProp);
    React__namespace.useEffect(() => setAccentColor(accentColorProp), [accentColorProp]);
    const [grayColor, setGrayColor] = React__namespace.useState(grayColorProp);
    React__namespace.useEffect(() => setGrayColor(grayColorProp), [grayColorProp]);
    const [panelBackground, setPanelBackground] = React__namespace.useState(panelBackgroundProp);
    React__namespace.useEffect(() => setPanelBackground(panelBackgroundProp), [panelBackgroundProp]);
    const [radius, setRadius] = React__namespace.useState(radiusProp);
    React__namespace.useEffect(() => setRadius(radiusProp), [radiusProp]);
    const [scaling, setScaling] = React__namespace.useState(scalingProp);
    React__namespace.useEffect(() => setScaling(scalingProp), [scalingProp]);
    // Initial appearance on page load when `appearance` is explicitly set to `light` or `dark`
    const ExplicitRootAppearanceScript = React__namespace.memo(({
      appearance
    }) => React__namespace.createElement("script", {
      dangerouslySetInnerHTML: {
        __html: `!(function(){try{var d=document.documentElement,c=d.classList;c.remove('light','dark');d.style.colorScheme='${appearance}';c.add('${appearance}');}catch(e){}})();`
      }
    }), () => true // Never re-render
    );

    ExplicitRootAppearanceScript.displayName = 'ExplicitRootAppearanceScript';
    // Client-side only changes when `appearance` prop is changed while developing
    React__namespace.useEffect(() => updateThemeAppearanceClass(appearanceProp), [appearanceProp]);
    const resolvedGrayColor = grayColor === 'auto' ? getMatchingGrayColor(accentColor) : grayColor;
    return React__namespace.createElement(React__namespace.Fragment, null, appearance !== 'inherit' && React__namespace.createElement(ExplicitRootAppearanceScript, {
      appearance: appearance
    }), hasBackground && React__namespace.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: `
:root, .light, .light-theme { --color-page-background: white; }
.dark, .dark-theme { --color-page-background: var(--${resolvedGrayColor}-1); }
body { background-color: var(--color-page-background); }
`
      }
    }), React__namespace.createElement(ThemeImpl, {
      ...rootProps,
      ref: forwardedRef,
      isRoot: true,
      hasBackground: hasBackground,
      //
      appearance: appearance,
      accentColor: accentColor,
      grayColor: grayColor,
      panelBackground: panelBackground,
      radius: radius,
      scaling: scaling,
      //
      onAppearanceChange: setAppearance,
      onAccentColorChange: setAccentColor,
      onGrayColorChange: setGrayColor,
      onPanelBackgroundChange: setPanelBackground,
      onRadiusChange: setRadius,
      onScalingChange: setScaling
    }));
  });
  ThemeRoot.displayName = 'ThemeRoot';
  const ThemeImpl = React__namespace.forwardRef((props, forwardedRef) => {
    var _a, _b, _c, _d, _e, _f;
    const context = React__namespace.useContext(ThemeContext);
    const {
      asChild,
      isRoot,
      hasBackground,
      //
      appearance = (_a = context === null || context === void 0 ? void 0 : context.appearance) !== null && _a !== void 0 ? _a : themePropDefs.appearance.default,
      accentColor = (_b = context === null || context === void 0 ? void 0 : context.accentColor) !== null && _b !== void 0 ? _b : themePropDefs.accentColor.default,
      grayColor = (_c = context === null || context === void 0 ? void 0 : context.resolvedGrayColor) !== null && _c !== void 0 ? _c : themePropDefs.grayColor.default,
      panelBackground = (_d = context === null || context === void 0 ? void 0 : context.panelBackground) !== null && _d !== void 0 ? _d : themePropDefs.panelBackground.default,
      radius = (_e = context === null || context === void 0 ? void 0 : context.radius) !== null && _e !== void 0 ? _e : themePropDefs.radius.default,
      scaling = (_f = context === null || context === void 0 ? void 0 : context.scaling) !== null && _f !== void 0 ? _f : themePropDefs.scaling.default,
      //
      onAppearanceChange = noop,
      onAccentColorChange = noop,
      onGrayColorChange = noop,
      onPanelBackgroundChange = noop,
      onRadiusChange = noop,
      onScalingChange = noop,
      //
      ...themeProps
    } = props;
    const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac1360 : 'div';
    const resolvedGrayColor = grayColor === 'auto' ? getMatchingGrayColor(accentColor) : grayColor;
    const isExplicitAppearance = props.appearance !== undefined && props.appearance !== 'inherit';
    const isExplicitGrayColor = props.grayColor !== undefined;
    const shouldHaveBackground = !isRoot && (hasBackground === true || hasBackground !== false && (isExplicitAppearance || isExplicitGrayColor));
    return React__namespace.createElement(ThemeContext.Provider, {
      value: React__namespace.useMemo(() => ({
        appearance,
        accentColor,
        grayColor,
        resolvedGrayColor,
        panelBackground,
        radius,
        scaling,
        //
        onAppearanceChange,
        onAccentColorChange,
        onGrayColorChange,
        onPanelBackgroundChange,
        onRadiusChange,
        onScalingChange
      }), [appearance, accentColor, grayColor, resolvedGrayColor, panelBackground, radius, scaling,
      //
      onAppearanceChange, onAccentColorChange, onGrayColorChange, onPanelBackgroundChange, onRadiusChange, onScalingChange])
    }, React__namespace.createElement(Comp, {
      "data-is-root-theme": isRoot ? 'true' : 'false',
      "data-accent-color": accentColor,
      "data-gray-color": resolvedGrayColor,
      "data-has-background": shouldHaveBackground ? 'true' : 'false',
      "data-panel-background": panelBackground,
      "data-radius": radius,
      "data-scaling": scaling,
      ref: forwardedRef,
      ...themeProps,
      className: classNames('radix-themes', {
        // Only apply theme class to nested `Theme` sections.
        //
        // If it's the root `Theme`, we either rely on
        // - something else setting the theme class when root `appearance` is `inherit`
        // - our script setting it when root `appearance` is explicit
        light: !isRoot && appearance === 'light',
        dark: !isRoot && appearance === 'dark'
      }, themeProps.className)
    }));
  });
  ThemeImpl.displayName = 'ThemeImpl';
  function updateThemeAppearanceClass(appearance) {
    if (appearance === 'inherit') return;
    const root = document.documentElement;
    if (root.classList.contains('light-theme') || root.classList.contains('dark-theme')) {
      root.classList.remove('light-theme', 'dark-theme');
      root.style.colorScheme = appearance;
      root.classList.add(`${appearance}-theme`);
    }
    if (root.classList.contains('light') || root.classList.contains('dark')) {
      root.classList.remove('light', 'dark');
      root.style.colorScheme = appearance;
      root.classList.add(appearance);
    }
  }

  const colorProp = {
    type: 'enum',
    values: themePropDefs.accentColor.values,
    default: undefined
  };

  const highContrastProp = {
    type: 'boolean',
    default: undefined
  };

  /**
   * A helper to generate CSS classes that include breakpoints.
   *
   * Examples:
   * ```
   * const marginTop = '1'
   * withBreakpoints(marginTop, 'mt') // returns 'mt-1'
   *
   * const padding = { initial: '1', xs: '2', md: '3' }
   * withBreakpoints(padding, 'p') // returns 'p-1 xs:p-1 md:p-3'
   *
   * const justifyContent = { initial: 'start', md: 'space-between' }
   * withBreakpoints(justifyContent, 'jc', { 'space-between': 'sb' }) // returns 'jc-start md:jc-sb'
   * ```
   */
  function withBreakpoints(value,
  // Value to check
  classPrefix = '',
  // CSS class prefix, e.g. "px" in "px-1" class
  valueMap // Optionally, an object to map prop values to a different CSS suffix
  ) {
    var _a, _b, _c, _d;
    const classes = [];
    if (typeof value === 'object') {
      for (const bp of Object.keys(value)) {
        if (bp in value) {
          const str = (_a = value[bp]) === null || _a === void 0 ? void 0 : _a.toString();
          const isNegative = str === null || str === void 0 ? void 0 : str.startsWith('-');
          const delimiter = classPrefix === '' ? '' : '-';
          const prefix = isNegative ? `-${classPrefix}` : classPrefix;
          const matchedValue = isNegative ? str === null || str === void 0 ? void 0 : str.substring(1) : str;
          if (matchedValue === undefined) {
            continue;
          }
          const suffix = (_b = valueMap === null || valueMap === void 0 ? void 0 : valueMap[matchedValue]) !== null && _b !== void 0 ? _b : matchedValue;
          const className = bp === 'initial' ? `${prefix}${delimiter}${suffix}` : `${bp}:${prefix}${delimiter}${suffix}`;
          classes.push(className);
        }
      }
    }
    if (typeof value === 'string') {
      const isNegative = value.startsWith('-');
      const delimiter = classPrefix === '' ? '' : '-';
      const prefix = isNegative ? `-${classPrefix}` : classPrefix;
      const matchedValue = isNegative ? value.substring(1) : value;
      const suffix = (_c = valueMap === null || valueMap === void 0 ? void 0 : valueMap[matchedValue]) !== null && _c !== void 0 ? _c : matchedValue;
      classes.push(`${prefix}${delimiter}${suffix}`);
    }
    if (typeof value === 'boolean') {
      const delimiter = classPrefix === '' ? '' : '-';
      const matchedValue = value.toString();
      const suffix = (_d = valueMap === null || valueMap === void 0 ? void 0 : valueMap[matchedValue]) !== null && _d !== void 0 ? _d : matchedValue;
      classes.push(`${classPrefix}${delimiter}${suffix}`);
    }
    return classes.join(' ');
  }

  const paddingValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const paddingPropDefs = {
    p: {
      type: 'enum',
      values: paddingValues,
      default: undefined,
      responsive: true
    },
    px: {
      type: 'enum',
      values: paddingValues,
      default: undefined,
      responsive: true
    },
    py: {
      type: 'enum',
      values: paddingValues,
      default: undefined,
      responsive: true
    },
    pt: {
      type: 'enum',
      values: paddingValues,
      default: undefined,
      responsive: true
    },
    pr: {
      type: 'enum',
      values: paddingValues,
      default: undefined,
      responsive: true
    },
    pb: {
      type: 'enum',
      values: paddingValues,
      default: undefined,
      responsive: true
    },
    pl: {
      type: 'enum',
      values: paddingValues,
      default: undefined,
      responsive: true
    }
  };
  function extractPaddingProps(props) {
    const {
      p = layoutPropDefs.p.default,
      px = layoutPropDefs.px.default,
      py = layoutPropDefs.py.default,
      pt = layoutPropDefs.pt.default,
      pr = layoutPropDefs.pr.default,
      pb = layoutPropDefs.pb.default,
      pl = layoutPropDefs.pl.default,
      ...rest
    } = props;
    return {
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
      rest
    };
  }
  function withPaddingProps(props) {
    return [withBreakpoints(props.p, 'rt-r-p'), withBreakpoints(props.px, 'rt-r-px'), withBreakpoints(props.py, 'rt-r-py'), withBreakpoints(props.pt, 'rt-r-pt'), withBreakpoints(props.pr, 'rt-r-pr'), withBreakpoints(props.pb, 'rt-r-pb'), withBreakpoints(props.pl, 'rt-r-pl')].filter(Boolean).join(' ');
  }
  const positionValues = ['static', 'relative', 'absolute', 'fixed', 'sticky'];
  const positionEdgeValues = ['auto', '0', '50%', '100%'];
  // prettier-ignore
  const widthHeightValues = ['auto', 'min-content', 'max-content', '100%', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const flexShrinkValues = ['0', '1'];
  const flexGrowValues = ['0', '1'];
  const layoutPropDefs = {
    ...paddingPropDefs,
    position: {
      type: 'enum',
      values: positionValues,
      default: undefined,
      responsive: true
    },
    inset: {
      type: 'enum',
      values: positionEdgeValues,
      default: undefined,
      responsive: true
    },
    top: {
      type: 'enum',
      values: positionEdgeValues,
      default: undefined,
      responsive: true
    },
    right: {
      type: 'enum',
      values: positionEdgeValues,
      default: undefined,
      responsive: true
    },
    bottom: {
      type: 'enum',
      values: positionEdgeValues,
      default: undefined,
      responsive: true
    },
    left: {
      type: 'enum',
      values: positionEdgeValues,
      default: undefined,
      responsive: true
    },
    width: {
      type: 'enum',
      values: widthHeightValues,
      default: undefined,
      responsive: true
    },
    height: {
      type: 'enum',
      values: widthHeightValues,
      default: undefined,
      responsive: true
    },
    shrink: {
      type: 'enum',
      values: flexShrinkValues,
      default: undefined,
      responsive: true
    },
    grow: {
      type: 'enum',
      values: flexGrowValues,
      default: undefined,
      responsive: true
    }
  };
  function extractLayoutProps(props) {
    const {
      rest: paddingRest,
      ...paddingProps
    } = extractPaddingProps(props);
    const {
      position = layoutPropDefs.position.default,
      width = layoutPropDefs.width.default,
      height = layoutPropDefs.height.default,
      inset = layoutPropDefs.inset.default,
      top = layoutPropDefs.top.default,
      bottom = layoutPropDefs.bottom.default,
      left = layoutPropDefs.left.default,
      right = layoutPropDefs.right.default,
      shrink = layoutPropDefs.shrink.default,
      grow = layoutPropDefs.grow.default,
      ...rest
    } = paddingRest;
    return {
      ...paddingProps,
      position,
      width,
      height,
      inset,
      top,
      bottom,
      left,
      right,
      shrink,
      grow,
      rest
    };
  }
  function withLayoutProps(props) {
    return [withPaddingProps(props), withBreakpoints(props.position, 'rt-r-position'), withBreakpoints(props.shrink, 'rt-r-fs'), withBreakpoints(props.grow, 'rt-r-fg'), withBreakpoints(props.width, 'rt-r-w'), withBreakpoints(props.height, 'rt-r-h'), withBreakpoints(props.inset, 'rt-r-inset'), withBreakpoints(props.top, 'rt-r-top'), withBreakpoints(props.bottom, 'rt-r-bottom'), withBreakpoints(props.left, 'rt-r-left'), withBreakpoints(props.right, 'rt-r-right')].filter(Boolean).join(' ');
  }

  const trimValues = ['normal', 'start', 'end', 'both'];
  const trimProp = {
    type: 'enum',
    values: trimValues,
    default: undefined,
    responsive: true
  };

  // prettier-ignore
  const marginValues = ['auto', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9'];
  const marginPropDefs = {
    m: {
      type: 'enum',
      values: marginValues,
      default: undefined,
      responsive: true
    },
    mx: {
      type: 'enum',
      values: marginValues,
      default: undefined,
      responsive: true
    },
    my: {
      type: 'enum',
      values: marginValues,
      default: undefined,
      responsive: true
    },
    mt: {
      type: 'enum',
      values: marginValues,
      default: undefined,
      responsive: true
    },
    mr: {
      type: 'enum',
      values: marginValues,
      default: undefined,
      responsive: true
    },
    mb: {
      type: 'enum',
      values: marginValues,
      default: undefined,
      responsive: true
    },
    ml: {
      type: 'enum',
      values: marginValues,
      default: undefined,
      responsive: true
    }
  };
  function extractMarginProps(props) {
    const {
      m = marginPropDefs.m.default,
      mx = marginPropDefs.mx.default,
      my = marginPropDefs.my.default,
      mt = marginPropDefs.mt.default,
      mr = marginPropDefs.mr.default,
      mb = marginPropDefs.mb.default,
      ml = marginPropDefs.ml.default,
      ...rest
    } = props;
    return {
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      rest
    };
  }
  function withMarginProps(props) {
    return [withBreakpoints(props.m, 'rt-r-m'), withBreakpoints(props.mx, 'rt-r-mx'), withBreakpoints(props.my, 'rt-r-my'), withBreakpoints(props.mt, 'rt-r-mt'), withBreakpoints(props.mr, 'rt-r-mr'), withBreakpoints(props.mb, 'rt-r-mb'), withBreakpoints(props.ml, 'rt-r-ml')].filter(Boolean).join(' ');
  }

  const radiusProp = {
    type: 'enum',
    values: themePropDefs.radius.values,
    default: undefined
  };

  const alignValues$1 = ['left', 'center', 'right'];
  const alignProp = {
    type: 'enum',
    values: alignValues$1,
    default: undefined,
    responsive: true
  };

  const weights = ['light', 'regular', 'medium', 'bold'];
  const weightProp = {
    type: 'enum',
    values: weights,
    default: undefined,
    responsive: true
  };

  const displayValues = ['none', 'inline-flex', 'flex'];
  const directionValues = ['row', 'column', 'row-reverse', 'column-reverse'];
  const alignValues = ['start', 'center', 'end', 'baseline', 'stretch'];
  const justifyValues = ['start', 'center', 'end', 'between'];
  const wrapValues = ['nowrap', 'wrap', 'wrap-reverse'];
  const gapValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const flexPropDefs = {
    display: {
      type: 'enum',
      values: displayValues,
      default: 'flex',
      responsive: true
    },
    direction: {
      type: 'enum',
      values: directionValues,
      default: undefined,
      responsive: true
    },
    align: {
      type: 'enum',
      values: alignValues,
      default: undefined,
      responsive: true
    },
    justify: {
      type: 'enum',
      values: justifyValues,
      default: 'start',
      responsive: true
    },
    wrap: {
      type: 'enum',
      values: wrapValues,
      default: undefined,
      responsive: true
    },
    gap: {
      type: 'enum',
      values: gapValues,
      default: undefined,
      responsive: true
    }
  };

  const Flex = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const {
      rest: layoutRest,
      ...layoutProps
    } = extractLayoutProps(marginRest);
    const {
      className,
      asChild,
      display = flexPropDefs.display.default,
      direction = flexPropDefs.direction.default,
      align = flexPropDefs.align.default,
      justify = flexPropDefs.justify.default,
      wrap = flexPropDefs.wrap.default,
      gap = flexPropDefs.gap.default,
      ...flexProps
    } = layoutRest;
    const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac1360 : 'div';
    return React__namespace.createElement(Comp, {
      ...flexProps,
      ref: forwardedRef,
      className: classNames('rt-Flex', className, withBreakpoints(display, 'rt-r-display'), withBreakpoints(direction, 'rt-r-fd'), withBreakpoints(align, 'rt-r-ai'), withBreakpoints(justify, 'rt-r-jc', {
        between: 'space-between'
      }), withBreakpoints(wrap, 'rt-r-fw'), withBreakpoints(gap, 'rt-r-gap'), withLayoutProps(layoutProps), withMarginProps(marginProps))
    });
  });
  Flex.displayName = 'Flex';

  const sizes$a = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const headingPropDefs = {
    size: {
      type: 'enum',
      values: sizes$a,
      default: '6',
      responsive: true
    },
    weight: {
      ...weightProp,
      default: 'bold'
    },
    align: alignProp,
    trim: trimProp,
    color: colorProp,
    highContrast: highContrastProp
  };

  const Heading = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const {
      children,
      className,
      asChild = false,
      as: Tag = 'h1',
      size = headingPropDefs.size.default,
      weight = headingPropDefs.weight.default,
      align = headingPropDefs.align.default,
      trim = headingPropDefs.trim.default,
      color = headingPropDefs.color.default,
      highContrast = headingPropDefs.highContrast.default,
      ...headingProps
    } = marginRest;
    return React__namespace.createElement($5e63c961fc1ce211$export$8c6ed5c666ac1360, {
      "data-accent-color": color,
      ...headingProps,
      ref: forwardedRef,
      className: classNames('rt-Heading', className, withBreakpoints(size, 'rt-r-size'), withBreakpoints(weight, 'rt-r-weight'), withBreakpoints(align, 'rt-r-ta'), withBreakpoints(trim, 'rt-r-lt'), {
        'rt-high-contrast': highContrast
      }, withMarginProps(marginProps))
    }, asChild ? children : React__namespace.createElement(Tag, null, children));
  });
  Heading.displayName = 'Heading';

  const sizes$9 = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const textPropDefs = {
    size: {
      type: 'enum',
      values: sizes$9,
      default: undefined,
      responsive: true
    },
    weight: weightProp,
    align: alignProp,
    trim: trimProp,
    color: colorProp,
    highContrast: highContrastProp
  };

  const Text = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const {
      children,
      className,
      asChild = false,
      as: Tag = 'span',
      size = textPropDefs.size.default,
      weight = textPropDefs.weight.default,
      align = textPropDefs.align.default,
      trim = textPropDefs.trim.default,
      color = textPropDefs.color.default,
      highContrast = textPropDefs.highContrast.default,
      ...textProps
    } = marginRest;
    return React__namespace.createElement($5e63c961fc1ce211$export$8c6ed5c666ac1360, {
      "data-accent-color": color,
      ...textProps,
      ref: forwardedRef,
      className: classNames('rt-Text', className, withBreakpoints(size, 'rt-r-size'), withBreakpoints(weight, 'rt-r-weight'), withBreakpoints(align, 'rt-r-ta'), withBreakpoints(trim, 'rt-r-lt'), {
        'rt-high-contrast': highContrast
      }, withMarginProps(marginProps))
    }, asChild ? children : React__namespace.createElement(Tag, null, children));
  });
  Text.displayName = 'Text';

  function $010c2913dbd2fe3d$export$5cae361ad82dce8b(value) {
    const ref = React$1.useRef({
      value: value,
      previous: value
    }); // We compare values before making an update to ensure that
    // a change has been made. This ensures the previous value is
    // persisted correctly between renders.
    return React$1.useMemo(() => {
      if (ref.current.value !== value) {
        ref.current.previous = ref.current.value;
        ref.current.value = value;
      }
      return ref.current.previous;
    }, [value]);
  }

  const ThickCheckIcon = React__namespace.forwardRef(({
    color = 'currentColor',
    ...props
  }, forwardedRef) => {
    return React__namespace.createElement("svg", {
      width: "9",
      height: "9",
      viewBox: "0 0 9 9",
      fill: color,
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref: forwardedRef
    }, React__namespace.createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M8.53547 0.62293C8.88226 0.849446 8.97976 1.3142 8.75325 1.66099L4.5083 8.1599C4.38833 8.34356 4.19397 8.4655 3.9764 8.49358C3.75883 8.52167 3.53987 8.45309 3.3772 8.30591L0.616113 5.80777C0.308959 5.52987 0.285246 5.05559 0.563148 4.74844C0.84105 4.44128 1.31533 4.41757 1.62249 4.69547L3.73256 6.60459L7.49741 0.840706C7.72393 0.493916 8.18868 0.396414 8.53547 0.62293Z"
    }));
  });
  ThickCheckIcon.displayName = 'ThickCheckIcon';
  const ChevronDownIcon = React__namespace.forwardRef(({
    color = 'currentColor',
    ...props
  }, forwardedRef) => {
    return React__namespace.createElement("svg", {
      width: "9",
      height: "9",
      viewBox: "0 0 9 9",
      fill: color,
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref: forwardedRef
    }, React__namespace.createElement("path", {
      d: "M0.135232 3.15803C0.324102 2.95657 0.640521 2.94637 0.841971 3.13523L4.5 6.56464L8.158 3.13523C8.3595 2.94637 8.6759 2.95657 8.8648 3.15803C9.0536 3.35949 9.0434 3.67591 8.842 3.86477L4.84197 7.6148C4.64964 7.7951 4.35036 7.7951 4.15803 7.6148L0.158031 3.86477C-0.0434285 3.67591 -0.0536285 3.35949 0.135232 3.15803Z"
    }));
  });
  ChevronDownIcon.displayName = 'ChevronDownIcon';
  const ThickChevronRightIcon = React__namespace.forwardRef(({
    color = 'currentColor',
    ...props
  }, forwardedRef) => {
    return React__namespace.createElement("svg", {
      width: "9",
      height: "9",
      viewBox: "0 0 9 9",
      fill: color,
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref: forwardedRef
    }, React__namespace.createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M3.23826 0.201711C3.54108 -0.0809141 4.01567 -0.0645489 4.29829 0.238264L7.79829 3.98826C8.06724 4.27642 8.06724 4.72359 7.79829 5.01174L4.29829 8.76174C4.01567 9.06455 3.54108 9.08092 3.23826 8.79829C2.93545 8.51567 2.91909 8.04108 3.20171 7.73826L6.22409 4.5L3.20171 1.26174C2.91909 0.958928 2.93545 0.484337 3.23826 0.201711Z"
    }));
  });
  ThickChevronRightIcon.displayName = 'ThickChevronRightIcon';
  const InfoCircledIcon = React__namespace.forwardRef(({
    color = 'currentColor',
    ...props
  }, forwardedRef) => {
    return React__namespace.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 15 15",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref: forwardedRef
    }, React__namespace.createElement("path", {
      d: "M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z",
      fill: color,
      fillRule: "evenodd",
      clipRule: "evenodd"
    }));
  });
  InfoCircledIcon.displayName = 'InfoCircledIcon';

  // We have resorted to returning slots directly rather than exposing primitives that can then
  // be slotted like `<CollectionItem as={Slot}>…</CollectionItem>`.
  // This is because we encountered issues with generic types that cannot be statically analysed
  // due to creating them dynamically via createCollection.
  function $e02a7d9cb1dc128c$export$c74125a8e3af6bb2(name) {
    /* -----------------------------------------------------------------------------------------------
    * CollectionProvider
    * ---------------------------------------------------------------------------------------------*/
    const PROVIDER_NAME = name + 'CollectionProvider';
    const [createCollectionContext, createCollectionScope] = $c512c27ab02ef895$export$50c7b4e9d9f19c1(PROVIDER_NAME);
    const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(PROVIDER_NAME, {
      collectionRef: {
        current: null
      },
      itemMap: new Map()
    });
    const CollectionProvider = props => {
      const {
        scope: scope,
        children: children
      } = props;
      const ref = React$1.useRef(null);
      const itemMap = React$1.useRef(new Map()).current;
      return /*#__PURE__*/React$1.createElement(CollectionProviderImpl, {
        scope: scope,
        itemMap: itemMap,
        collectionRef: ref
      }, children);
    };
    /* -----------------------------------------------------------------------------------------------
    * CollectionSlot
    * ---------------------------------------------------------------------------------------------*/
    const COLLECTION_SLOT_NAME = name + 'CollectionSlot';
    const CollectionSlot = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
      const {
        scope: scope,
        children: children
      } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, context.collectionRef);
      return /*#__PURE__*/React$1.createElement($5e63c961fc1ce211$export$8c6ed5c666ac1360, {
        ref: composedRefs
      }, children);
    });
    /* -----------------------------------------------------------------------------------------------
    * CollectionItem
    * ---------------------------------------------------------------------------------------------*/
    const ITEM_SLOT_NAME = name + 'CollectionItemSlot';
    const ITEM_DATA_ATTR = 'data-radix-collection-item';
    const CollectionItemSlot = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
      const {
        scope: scope,
        children: children,
        ...itemData
      } = props;
      const ref = React$1.useRef(null);
      const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      React$1.useEffect(() => {
        context.itemMap.set(ref, {
          ref: ref,
          ...itemData
        });
        return () => void context.itemMap.delete(ref);
      });
      return /*#__PURE__*/React$1.createElement($5e63c961fc1ce211$export$8c6ed5c666ac1360, {
        [ITEM_DATA_ATTR]: '',
        ref: composedRefs
      }, children);
    });
    /* -----------------------------------------------------------------------------------------------
    * useCollection
    * ---------------------------------------------------------------------------------------------*/
    function useCollection(scope) {
      const context = useCollectionContext(name + 'CollectionConsumer', scope);
      const getItems = React$1.useCallback(() => {
        const collectionNode = context.collectionRef.current;
        if (!collectionNode) return [];
        const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
        const items = Array.from(context.itemMap.values());
        const orderedItems = items.sort((a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current));
        return orderedItems;
      }, [context.collectionRef, context.itemMap]);
      return getItems;
    }
    return [{
      Provider: CollectionProvider,
      Slot: CollectionSlot,
      ItemSlot: CollectionItemSlot
    }, useCollection, createCollectionScope];
  }

  const $d7bdfb9eb0fdf311$var$ENTRY_FOCUS = 'rovingFocusGroup.onEntryFocus';
  const $d7bdfb9eb0fdf311$var$EVENT_OPTIONS = {
    bubbles: false,
    cancelable: true
  };
  /* -------------------------------------------------------------------------------------------------
   * RovingFocusGroup
   * -----------------------------------------------------------------------------------------------*/
  const $d7bdfb9eb0fdf311$var$GROUP_NAME = 'RovingFocusGroup';
  const [$d7bdfb9eb0fdf311$var$Collection, $d7bdfb9eb0fdf311$var$useCollection, $d7bdfb9eb0fdf311$var$createCollectionScope] = $e02a7d9cb1dc128c$export$c74125a8e3af6bb2($d7bdfb9eb0fdf311$var$GROUP_NAME);
  const [$d7bdfb9eb0fdf311$var$createRovingFocusGroupContext, $d7bdfb9eb0fdf311$export$c7109489551a4f4] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($d7bdfb9eb0fdf311$var$GROUP_NAME, [$d7bdfb9eb0fdf311$var$createCollectionScope]);
  const [$d7bdfb9eb0fdf311$var$RovingFocusProvider, $d7bdfb9eb0fdf311$var$useRovingFocusContext] = $d7bdfb9eb0fdf311$var$createRovingFocusGroupContext($d7bdfb9eb0fdf311$var$GROUP_NAME);
  const $d7bdfb9eb0fdf311$export$8699f7c8af148338 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    return /*#__PURE__*/React$1.createElement($d7bdfb9eb0fdf311$var$Collection.Provider, {
      scope: props.__scopeRovingFocusGroup
    }, /*#__PURE__*/React$1.createElement($d7bdfb9eb0fdf311$var$Collection.Slot, {
      scope: props.__scopeRovingFocusGroup
    }, /*#__PURE__*/React$1.createElement($d7bdfb9eb0fdf311$var$RovingFocusGroupImpl, _extends({}, props, {
      ref: forwardedRef
    }))));
  });
  /* -----------------------------------------------------------------------------------------------*/
  const $d7bdfb9eb0fdf311$var$RovingFocusGroupImpl = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup: __scopeRovingFocusGroup,
      orientation: orientation,
      loop = false,
      dir: dir,
      currentTabStopId: currentTabStopIdProp,
      defaultCurrentTabStopId: defaultCurrentTabStopId,
      onCurrentTabStopIdChange: onCurrentTabStopIdChange,
      onEntryFocus: onEntryFocus,
      ...groupProps
    } = props;
    const ref = React$1.useRef(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref);
    const direction = $f631663db3294ace$export$b39126d51d94e6f3(dir);
    const [currentTabStopId = null, setCurrentTabStopId] = $71cd76cc60e0454e$export$6f32135080cb4c3({
      prop: currentTabStopIdProp,
      defaultProp: defaultCurrentTabStopId,
      onChange: onCurrentTabStopIdChange
    });
    const [isTabbingBackOut, setIsTabbingBackOut] = React$1.useState(false);
    const handleEntryFocus = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onEntryFocus);
    const getItems = $d7bdfb9eb0fdf311$var$useCollection(__scopeRovingFocusGroup);
    const isClickFocusRef = React$1.useRef(false);
    const [focusableItemsCount, setFocusableItemsCount] = React$1.useState(0);
    React$1.useEffect(() => {
      const node = ref.current;
      if (node) {
        node.addEventListener($d7bdfb9eb0fdf311$var$ENTRY_FOCUS, handleEntryFocus);
        return () => node.removeEventListener($d7bdfb9eb0fdf311$var$ENTRY_FOCUS, handleEntryFocus);
      }
    }, [handleEntryFocus]);
    return /*#__PURE__*/React$1.createElement($d7bdfb9eb0fdf311$var$RovingFocusProvider, {
      scope: __scopeRovingFocusGroup,
      orientation: orientation,
      dir: direction,
      loop: loop,
      currentTabStopId: currentTabStopId,
      onItemFocus: React$1.useCallback(tabStopId => setCurrentTabStopId(tabStopId), [setCurrentTabStopId]),
      onItemShiftTab: React$1.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: React$1.useCallback(() => setFocusableItemsCount(prevCount => prevCount + 1), []),
      onFocusableItemRemove: React$1.useCallback(() => setFocusableItemsCount(prevCount => prevCount - 1), [])
    }, /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
      "data-orientation": orientation
    }, groupProps, {
      ref: composedRefs,
      style: {
        outline: 'none',
        ...props.style
      },
      onMouseDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onMouseDown, () => {
        isClickFocusRef.current = true;
      }),
      onFocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onFocus, event => {
        // We normally wouldn't need this check, because we already check
        // that the focus is on the current target and not bubbling to it.
        // We do this because Safari doesn't focus buttons when clicked, and
        // instead, the wrapper will get focused and not through a bubbling event.
        const isKeyboardFocus = !isClickFocusRef.current;
        if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
          const entryFocusEvent = new CustomEvent($d7bdfb9eb0fdf311$var$ENTRY_FOCUS, $d7bdfb9eb0fdf311$var$EVENT_OPTIONS);
          event.currentTarget.dispatchEvent(entryFocusEvent);
          if (!entryFocusEvent.defaultPrevented) {
            const items = getItems().filter(item => item.focusable);
            const activeItem = items.find(item => item.active);
            const currentItem = items.find(item => item.id === currentTabStopId);
            const candidateItems = [activeItem, currentItem, ...items].filter(Boolean);
            const candidateNodes = candidateItems.map(item => item.ref.current);
            $d7bdfb9eb0fdf311$var$focusFirst(candidateNodes);
          }
        }
        isClickFocusRef.current = false;
      }),
      onBlur: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onBlur, () => setIsTabbingBackOut(false))
    })));
  });
  /* -------------------------------------------------------------------------------------------------
   * RovingFocusGroupItem
   * -----------------------------------------------------------------------------------------------*/
  const $d7bdfb9eb0fdf311$var$ITEM_NAME = 'RovingFocusGroupItem';
  const $d7bdfb9eb0fdf311$export$ab9df7c53fe8454 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup: __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId: tabStopId,
      ...itemProps
    } = props;
    const autoId = $1746a345f3d73bb7$export$f680877a34711e37();
    const id = tabStopId || autoId;
    const context = $d7bdfb9eb0fdf311$var$useRovingFocusContext($d7bdfb9eb0fdf311$var$ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = $d7bdfb9eb0fdf311$var$useCollection(__scopeRovingFocusGroup);
    const {
      onFocusableItemAdd: onFocusableItemAdd,
      onFocusableItemRemove: onFocusableItemRemove
    } = context;
    React$1.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /*#__PURE__*/React$1.createElement($d7bdfb9eb0fdf311$var$Collection.ItemSlot, {
      scope: __scopeRovingFocusGroup,
      id: id,
      focusable: focusable,
      active: active
    }, /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.span, _extends({
      tabIndex: isCurrentTabStop ? 0 : -1,
      "data-orientation": context.orientation
    }, itemProps, {
      ref: forwardedRef,
      onMouseDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onMouseDown, event => {
        // We prevent focusing non-focusable items on `mousedown`.
        // Even though the item has tabIndex={-1}, that only means take it out of the tab order.
        if (!focusable) event.preventDefault(); // Safari doesn't focus a button when clicked so we run our logic on mousedown also
        else context.onItemFocus(id);
      }),
      onFocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onFocus, () => context.onItemFocus(id)),
      onKeyDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onKeyDown, event => {
        if (event.key === 'Tab' && event.shiftKey) {
          context.onItemShiftTab();
          return;
        }
        if (event.target !== event.currentTarget) return;
        const focusIntent = $d7bdfb9eb0fdf311$var$getFocusIntent(event, context.orientation, context.dir);
        if (focusIntent !== undefined) {
          event.preventDefault();
          const items = getItems().filter(item => item.focusable);
          let candidateNodes = items.map(item => item.ref.current);
          if (focusIntent === 'last') candidateNodes.reverse();else if (focusIntent === 'prev' || focusIntent === 'next') {
            if (focusIntent === 'prev') candidateNodes.reverse();
            const currentIndex = candidateNodes.indexOf(event.currentTarget);
            candidateNodes = context.loop ? $d7bdfb9eb0fdf311$var$wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
          }
          /**
          * Imperative focus during keydown is risky so we prevent React's batching updates
          * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
          */
          setTimeout(() => $d7bdfb9eb0fdf311$var$focusFirst(candidateNodes));
        }
      })
    })));
  });
  /* -----------------------------------------------------------------------------------------------*/ // prettier-ignore
  const $d7bdfb9eb0fdf311$var$MAP_KEY_TO_FOCUS_INTENT = {
    ArrowLeft: 'prev',
    ArrowUp: 'prev',
    ArrowRight: 'next',
    ArrowDown: 'next',
    PageUp: 'first',
    Home: 'first',
    PageDown: 'last',
    End: 'last'
  };
  function $d7bdfb9eb0fdf311$var$getDirectionAwareKey(key, dir) {
    if (dir !== 'rtl') return key;
    return key === 'ArrowLeft' ? 'ArrowRight' : key === 'ArrowRight' ? 'ArrowLeft' : key;
  }
  function $d7bdfb9eb0fdf311$var$getFocusIntent(event, orientation, dir) {
    const key = $d7bdfb9eb0fdf311$var$getDirectionAwareKey(event.key, dir);
    if (orientation === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(key)) return undefined;
    if (orientation === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(key)) return undefined;
    return $d7bdfb9eb0fdf311$var$MAP_KEY_TO_FOCUS_INTENT[key];
  }
  function $d7bdfb9eb0fdf311$var$focusFirst(candidates) {
    const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
    for (const candidate of candidates) {
      // if focus is already where we want to go, we don't want to keep going through the candidates
      if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
      candidate.focus();
      if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
    }
  }
  /**
   * Wraps an array around itself at a given start index
   * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
   */
  function $d7bdfb9eb0fdf311$var$wrapArray(array, startIndex) {
    return array.map((_, index) => array[(startIndex + index) % array.length]);
  }
  const $d7bdfb9eb0fdf311$export$be92b6f5f03c0fe9 = $d7bdfb9eb0fdf311$export$8699f7c8af148338;
  const $d7bdfb9eb0fdf311$export$6d08773d2e66f8f2 = $d7bdfb9eb0fdf311$export$ab9df7c53fe8454;

  function $ae6933e535247d3d$export$7d15b64cf5a3a4c4(value, [min, max]) {
    return Math.min(max, Math.max(min, value));
  }

  /** Number of components which have requested interest to have focus guards */
  let $3db38b7d1fb3fe6a$var$count = 0;
  /**
   * Injects a pair of focus guards at the edges of the whole DOM tree
   * to ensure `focusin` & `focusout` events can be caught consistently.
   */
  function $3db38b7d1fb3fe6a$export$b7ece24a22aeda8c() {
    React$1.useEffect(() => {
      var _edgeGuards$, _edgeGuards$2;
      const edgeGuards = document.querySelectorAll('[data-radix-focus-guard]');
      document.body.insertAdjacentElement('afterbegin', (_edgeGuards$ = edgeGuards[0]) !== null && _edgeGuards$ !== void 0 ? _edgeGuards$ : $3db38b7d1fb3fe6a$var$createFocusGuard());
      document.body.insertAdjacentElement('beforeend', (_edgeGuards$2 = edgeGuards[1]) !== null && _edgeGuards$2 !== void 0 ? _edgeGuards$2 : $3db38b7d1fb3fe6a$var$createFocusGuard());
      $3db38b7d1fb3fe6a$var$count++;
      return () => {
        if ($3db38b7d1fb3fe6a$var$count === 1) document.querySelectorAll('[data-radix-focus-guard]').forEach(node => node.remove());
        $3db38b7d1fb3fe6a$var$count--;
      };
    }, []);
  }
  function $3db38b7d1fb3fe6a$var$createFocusGuard() {
    const element = document.createElement('span');
    element.setAttribute('data-radix-focus-guard', '');
    element.tabIndex = 0;
    element.style.cssText = 'outline: none; opacity: 0; position: fixed; pointer-events: none';
    return element;
  }

  const $d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT = 'focusScope.autoFocusOnMount';
  const $d3863c46a17e8a28$var$AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount';
  const $d3863c46a17e8a28$var$EVENT_OPTIONS = {
    bubbles: false,
    cancelable: true
  };
  const $d3863c46a17e8a28$export$20e40289641fbbb6 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      loop = false,
      trapped = false,
      onMountAutoFocus: onMountAutoFocusProp,
      onUnmountAutoFocus: onUnmountAutoFocusProp,
      ...scopeProps
    } = props;
    const [container1, setContainer] = React$1.useState(null);
    const onMountAutoFocus = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onMountAutoFocusProp);
    const onUnmountAutoFocus = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onUnmountAutoFocusProp);
    const lastFocusedElementRef = React$1.useRef(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, node => setContainer(node));
    const focusScope = React$1.useRef({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    }).current; // Takes care of trapping focus if focus is moved outside programmatically for example
    React$1.useEffect(() => {
      if (trapped) {
        function handleFocusIn(event) {
          if (focusScope.paused || !container1) return;
          const target = event.target;
          if (container1.contains(target)) lastFocusedElementRef.current = target;else $d3863c46a17e8a28$var$focus(lastFocusedElementRef.current, {
            select: true
          });
        }
        function handleFocusOut(event) {
          if (focusScope.paused || !container1) return;
          const relatedTarget = event.relatedTarget; // A `focusout` event with a `null` `relatedTarget` will happen in at least two cases:
          //
          // 1. When the user switches app/tabs/windows/the browser itself loses focus.
          // 2. In Google Chrome, when the focused element is removed from the DOM.
          //
          // We let the browser do its thing here because:
          //
          // 1. The browser already keeps a memory of what's focused for when the page gets refocused.
          // 2. In Google Chrome, if we try to focus the deleted focused element (as per below), it
          //    throws the CPU to 100%, so we avoid doing anything for this reason here too.
          if (relatedTarget === null) return; // If the focus has moved to an actual legitimate element (`relatedTarget !== null`)
          // that is outside the container, we move focus to the last valid focused element inside.
          if (!container1.contains(relatedTarget)) $d3863c46a17e8a28$var$focus(lastFocusedElementRef.current, {
            select: true
          });
        } // When the focused element gets removed from the DOM, browsers move focus
        // back to the document.body. In this case, we move focus to the container
        // to keep focus trapped correctly.
        function handleMutations(mutations) {
          const focusedElement = document.activeElement;
          if (focusedElement !== document.body) return;
          for (const mutation of mutations) if (mutation.removedNodes.length > 0) $d3863c46a17e8a28$var$focus(container1);
        }
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);
        const mutationObserver = new MutationObserver(handleMutations);
        if (container1) mutationObserver.observe(container1, {
          childList: true,
          subtree: true
        });
        return () => {
          document.removeEventListener('focusin', handleFocusIn);
          document.removeEventListener('focusout', handleFocusOut);
          mutationObserver.disconnect();
        };
      }
    }, [trapped, container1, focusScope.paused]);
    React$1.useEffect(() => {
      if (container1) {
        $d3863c46a17e8a28$var$focusScopesStack.add(focusScope);
        const previouslyFocusedElement = document.activeElement;
        const hasFocusedCandidate = container1.contains(previouslyFocusedElement);
        if (!hasFocusedCandidate) {
          const mountEvent = new CustomEvent($d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT, $d3863c46a17e8a28$var$EVENT_OPTIONS);
          container1.addEventListener($d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          container1.dispatchEvent(mountEvent);
          if (!mountEvent.defaultPrevented) {
            $d3863c46a17e8a28$var$focusFirst($d3863c46a17e8a28$var$removeLinks($d3863c46a17e8a28$var$getTabbableCandidates(container1)), {
              select: true
            });
            if (document.activeElement === previouslyFocusedElement) $d3863c46a17e8a28$var$focus(container1);
          }
        }
        return () => {
          container1.removeEventListener($d3863c46a17e8a28$var$AUTOFOCUS_ON_MOUNT, onMountAutoFocus); // We hit a react bug (fixed in v17) with focusing in unmount.
          // We need to delay the focus a little to get around it for now.
          // See: https://github.com/facebook/react/issues/17894
          setTimeout(() => {
            const unmountEvent = new CustomEvent($d3863c46a17e8a28$var$AUTOFOCUS_ON_UNMOUNT, $d3863c46a17e8a28$var$EVENT_OPTIONS);
            container1.addEventListener($d3863c46a17e8a28$var$AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            container1.dispatchEvent(unmountEvent);
            if (!unmountEvent.defaultPrevented) $d3863c46a17e8a28$var$focus(previouslyFocusedElement !== null && previouslyFocusedElement !== void 0 ? previouslyFocusedElement : document.body, {
              select: true
            });
            // we need to remove the listener after we `dispatchEvent`
            container1.removeEventListener($d3863c46a17e8a28$var$AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            $d3863c46a17e8a28$var$focusScopesStack.remove(focusScope);
          }, 0);
        };
      }
    }, [container1, onMountAutoFocus, onUnmountAutoFocus, focusScope]); // Takes care of looping focus (when tabbing whilst at the edges)
    const handleKeyDown = React$1.useCallback(event => {
      if (!loop && !trapped) return;
      if (focusScope.paused) return;
      const isTabKey = event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey;
      const focusedElement = document.activeElement;
      if (isTabKey && focusedElement) {
        const container = event.currentTarget;
        const [first, last] = $d3863c46a17e8a28$var$getTabbableEdges(container);
        const hasTabbableElementsInside = first && last; // we can only wrap focus if we have tabbable edges
        if (!hasTabbableElementsInside) {
          if (focusedElement === container) event.preventDefault();
        } else {
          if (!event.shiftKey && focusedElement === last) {
            event.preventDefault();
            if (loop) $d3863c46a17e8a28$var$focus(first, {
              select: true
            });
          } else if (event.shiftKey && focusedElement === first) {
            event.preventDefault();
            if (loop) $d3863c46a17e8a28$var$focus(last, {
              select: true
            });
          }
        }
      }
    }, [loop, trapped, focusScope.paused]);
    return /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      tabIndex: -1
    }, scopeProps, {
      ref: composedRefs,
      onKeyDown: handleKeyDown
    }));
  });
  /* -------------------------------------------------------------------------------------------------
   * Utils
   * -----------------------------------------------------------------------------------------------*/ /**
                                                                                                       * Attempts focusing the first element in a list of candidates.
                                                                                                       * Stops when focus has actually moved.
                                                                                                       */
  function $d3863c46a17e8a28$var$focusFirst(candidates, {
    select = false
  } = {}) {
    const previouslyFocusedElement = document.activeElement;
    for (const candidate of candidates) {
      $d3863c46a17e8a28$var$focus(candidate, {
        select: select
      });
      if (document.activeElement !== previouslyFocusedElement) return;
    }
  }
  /**
   * Returns the first and last tabbable elements inside a container.
   */
  function $d3863c46a17e8a28$var$getTabbableEdges(container) {
    const candidates = $d3863c46a17e8a28$var$getTabbableCandidates(container);
    const first = $d3863c46a17e8a28$var$findVisible(candidates, container);
    const last = $d3863c46a17e8a28$var$findVisible(candidates.reverse(), container);
    return [first, last];
  }
  /**
   * Returns a list of potential tabbable candidates.
   *
   * NOTE: This is only a close approximation. For example it doesn't take into account cases like when
   * elements are not visible. This cannot be worked out easily by just reading a property, but rather
   * necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
   *
   * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
   * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
   */
  function $d3863c46a17e8a28$var$getTabbableCandidates(container) {
    const nodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: node => {
        const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden';
        if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP; // `.tabIndex` is not the same as the `tabindex` attribute. It works on the
        // runtime's understanding of tabbability, so this automatically accounts
        // for any kind of element that could be tabbed to.
        return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode); // we do not take into account the order of nodes with positive `tabIndex` as it
    // hinders accessibility to have tab order different from visual order.
    return nodes;
  }
  /**
   * Returns the first visible element in a list.
   * NOTE: Only checks visibility up to the `container`.
   */
  function $d3863c46a17e8a28$var$findVisible(elements, container) {
    for (const element of elements) {
      // we stop checking if it's hidden at the `container` level (excluding)
      if (!$d3863c46a17e8a28$var$isHidden(element, {
        upTo: container
      })) return element;
    }
  }
  function $d3863c46a17e8a28$var$isHidden(node, {
    upTo: upTo
  }) {
    if (getComputedStyle(node).visibility === 'hidden') return true;
    while (node) {
      // we stop at `upTo` (excluding it)
      if (upTo !== undefined && node === upTo) return false;
      if (getComputedStyle(node).display === 'none') return true;
      node = node.parentElement;
    }
    return false;
  }
  function $d3863c46a17e8a28$var$isSelectableInput(element) {
    return element instanceof HTMLInputElement && 'select' in element;
  }
  function $d3863c46a17e8a28$var$focus(element, {
    select = false
  } = {}) {
    // only focus if that element is focusable
    if (element && element.focus) {
      const previouslyFocusedElement = document.activeElement; // NOTE: we prevent scrolling on focus, to minimize jarring transitions for users
      element.focus({
        preventScroll: true
      }); // only select if its not the same element, it supports selection and we need to select
      if (element !== previouslyFocusedElement && $d3863c46a17e8a28$var$isSelectableInput(element) && select) element.select();
    }
  }
  /* -------------------------------------------------------------------------------------------------
   * FocusScope stack
   * -----------------------------------------------------------------------------------------------*/
  const $d3863c46a17e8a28$var$focusScopesStack = $d3863c46a17e8a28$var$createFocusScopesStack();
  function $d3863c46a17e8a28$var$createFocusScopesStack() {
    /** A stack of focus scopes, with the active one at the top */let stack = [];
    return {
      add(focusScope) {
        // pause the currently active focus scope (at the top of the stack)
        const activeFocusScope = stack[0];
        if (focusScope !== activeFocusScope) activeFocusScope === null || activeFocusScope === void 0 || activeFocusScope.pause();
        // remove in case it already exists (because we'll re-add it at the top of the stack)
        stack = $d3863c46a17e8a28$var$arrayRemove(stack, focusScope);
        stack.unshift(focusScope);
      },
      remove(focusScope) {
        var _stack$;
        stack = $d3863c46a17e8a28$var$arrayRemove(stack, focusScope);
        (_stack$ = stack[0]) === null || _stack$ === void 0 || _stack$.resume();
      }
    };
  }
  function $d3863c46a17e8a28$var$arrayRemove(array, item) {
    const updatedArray = [...array];
    const index = updatedArray.indexOf(item);
    if (index !== -1) updatedArray.splice(index, 1);
    return updatedArray;
  }
  function $d3863c46a17e8a28$var$removeLinks(items) {
    return items.filter(item => item.tagName !== 'A');
  }

  var getDefaultParent = function (originalTarget) {
    if (typeof document === 'undefined') {
      return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
  };
  var counterMap = new WeakMap();
  var uncontrolledNodes = new WeakMap();
  var markerMap = {};
  var lockCount = 0;
  var unwrapHost = function (node) {
    return node && (node.host || unwrapHost(node.parentNode));
  };
  var correctTargets = function (parent, targets) {
    return targets.map(function (target) {
      if (parent.contains(target)) {
        return target;
      }
      var correctedTarget = unwrapHost(target);
      if (correctedTarget && parent.contains(correctedTarget)) {
        return correctedTarget;
      }
      console.error('aria-hidden', target, 'in not contained inside', parent, '. Doing nothing');
      return null;
    }).filter(function (x) {
      return Boolean(x);
    });
  };
  /**
   * Marks everything except given node(or nodes) as aria-hidden
   * @param {Element | Element[]} originalTarget - elements to keep on the page
   * @param [parentNode] - top element, defaults to document.body
   * @param {String} [markerName] - a special attribute to mark every node
   * @param {String} [controlAttribute] - html Attribute to control
   * @return {Undo} undo command
   */
  var applyAttributeToOthers = function (originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    if (!markerMap[markerName]) {
      markerMap[markerName] = new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = new Set();
    var elementsToStop = new Set(targets);
    var keep = function (el) {
      if (!el || elementsToKeep.has(el)) {
        return;
      }
      elementsToKeep.add(el);
      keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function (parent) {
      if (!parent || elementsToStop.has(parent)) {
        return;
      }
      Array.prototype.forEach.call(parent.children, function (node) {
        if (elementsToKeep.has(node)) {
          deep(node);
        } else {
          var attr = node.getAttribute(controlAttribute);
          var alreadyHidden = attr !== null && attr !== 'false';
          var counterValue = (counterMap.get(node) || 0) + 1;
          var markerValue = (markerCounter.get(node) || 0) + 1;
          counterMap.set(node, counterValue);
          markerCounter.set(node, markerValue);
          hiddenNodes.push(node);
          if (counterValue === 1 && alreadyHidden) {
            uncontrolledNodes.set(node, true);
          }
          if (markerValue === 1) {
            node.setAttribute(markerName, 'true');
          }
          if (!alreadyHidden) {
            node.setAttribute(controlAttribute, 'true');
          }
        }
      });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function () {
      hiddenNodes.forEach(function (node) {
        var counterValue = counterMap.get(node) - 1;
        var markerValue = markerCounter.get(node) - 1;
        counterMap.set(node, counterValue);
        markerCounter.set(node, markerValue);
        if (!counterValue) {
          if (!uncontrolledNodes.has(node)) {
            node.removeAttribute(controlAttribute);
          }
          uncontrolledNodes.delete(node);
        }
        if (!markerValue) {
          node.removeAttribute(markerName);
        }
      });
      lockCount--;
      if (!lockCount) {
        // clear
        counterMap = new WeakMap();
        counterMap = new WeakMap();
        uncontrolledNodes = new WeakMap();
        markerMap = {};
      }
    };
  };
  /**
   * Marks everything except given node(or nodes) as aria-hidden
   * @param {Element | Element[]} originalTarget - elements to keep on the page
   * @param [parentNode] - top element, defaults to document.body
   * @param {String} [markerName] - a special attribute to mark every node
   * @return {Undo} undo command
   */
  var hideOthers = function (originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
      markerName = 'data-aria-hidden';
    }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    var activeParentNode = parentNode || getDefaultParent(originalTarget);
    if (!activeParentNode) {
      return function () {
        return null;
      };
    }
    // we should not hide ariaLive elements - https://github.com/theKashey/aria-hidden/issues/10
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll('[aria-live]')));
    return applyAttributeToOthers(targets, activeParentNode, markerName, 'aria-hidden');
  };

  /******************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise, SuppressedError, Symbol */

  var __assign = function () {
    __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    }
    return t;
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };

  var zeroRightClassName = 'right-scroll-bar-position';
  var fullWidthClassName = 'width-before-scroll-bar';
  var noScrollbarsClassName = 'with-scroll-bars-hidden';
  /**
   * Name of a CSS variable containing the amount of "hidden" scrollbar
   * ! might be undefined ! use will fallback!
   */
  var removedBarSizeVariable = '--removed-body-scroll-bar-size';

  /**
   * Assigns a value for a given ref, no matter of the ref format
   * @param {RefObject} ref - a callback function or ref object
   * @param value - a new value
   *
   * @see https://github.com/theKashey/use-callback-ref#assignref
   * @example
   * const refObject = useRef();
   * const refFn = (ref) => {....}
   *
   * assignRef(refObject, "refValue");
   * assignRef(refFn, "refValue");
   */
  function assignRef(ref, value) {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
    return ref;
  }

  /**
   * creates a MutableRef with ref change callback
   * @param initialValue - initial ref value
   * @param {Function} callback - a callback to run when value changes
   *
   * @example
   * const ref = useCallbackRef(0, (newValue, oldValue) => console.log(oldValue, '->', newValue);
   * ref.current = 1;
   * // prints 0 -> 1
   *
   * @see https://reactjs.org/docs/hooks-reference.html#useref
   * @see https://github.com/theKashey/use-callback-ref#usecallbackref---to-replace-reactuseref
   * @returns {MutableRefObject}
   */
  function useCallbackRef(initialValue, callback) {
    var ref = React$1.useState(function () {
      return {
        // value
        value: initialValue,
        // last callback
        callback: callback,
        // "memoized" public interface
        facade: {
          get current() {
            return ref.value;
          },
          set current(value) {
            var last = ref.value;
            if (last !== value) {
              ref.value = value;
              ref.callback(value, last);
            }
          }
        }
      };
    })[0];
    // update callback
    ref.callback = callback;
    return ref.facade;
  }

  /**
   * Merges two or more refs together providing a single interface to set their value
   * @param {RefObject|Ref} refs
   * @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
   *
   * @see {@link mergeRefs} a version without buit-in memoization
   * @see https://github.com/theKashey/use-callback-ref#usemergerefs
   * @example
   * const Component = React.forwardRef((props, ref) => {
   *   const ownRef = useRef();
   *   const domRef = useMergeRefs([ref, ownRef]); // 👈 merge together
   *   return <div ref={domRef}>...</div>
   * }
   */
  function useMergeRefs(refs, defaultValue) {
    return useCallbackRef(defaultValue || null, function (newValue) {
      return refs.forEach(function (ref) {
        return assignRef(ref, newValue);
      });
    });
  }

  function ItoI(a) {
    return a;
  }
  function innerCreateMedium(defaults, middleware) {
    if (middleware === void 0) {
      middleware = ItoI;
    }
    var buffer = [];
    var assigned = false;
    var medium = {
      read: function () {
        if (assigned) {
          throw new Error('Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.');
        }
        if (buffer.length) {
          return buffer[buffer.length - 1];
        }
        return defaults;
      },
      useMedium: function (data) {
        var item = middleware(data, assigned);
        buffer.push(item);
        return function () {
          buffer = buffer.filter(function (x) {
            return x !== item;
          });
        };
      },
      assignSyncMedium: function (cb) {
        assigned = true;
        while (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
        }
        buffer = {
          push: function (x) {
            return cb(x);
          },
          filter: function () {
            return buffer;
          }
        };
      },
      assignMedium: function (cb) {
        assigned = true;
        var pendingQueue = [];
        if (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
          pendingQueue = buffer;
        }
        var executeQueue = function () {
          var cbs = pendingQueue;
          pendingQueue = [];
          cbs.forEach(cb);
        };
        var cycle = function () {
          return Promise.resolve().then(executeQueue);
        };
        cycle();
        buffer = {
          push: function (x) {
            pendingQueue.push(x);
            cycle();
          },
          filter: function (filter) {
            pendingQueue = pendingQueue.filter(filter);
            return buffer;
          }
        };
      }
    };
    return medium;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  function createSidecarMedium(options) {
    if (options === void 0) {
      options = {};
    }
    var medium = innerCreateMedium(null);
    medium.options = __assign({
      async: true,
      ssr: false
    }, options);
    return medium;
  }

  var SideCar$1 = function (_a) {
    var sideCar = _a.sideCar,
      rest = __rest(_a, ["sideCar"]);
    if (!sideCar) {
      throw new Error('Sidecar: please provide `sideCar` property to import the right car');
    }
    var Target = sideCar.read();
    if (!Target) {
      throw new Error('Sidecar medium not found');
    }
    return React__namespace.createElement(Target, __assign({}, rest));
  };
  SideCar$1.isSideCarExport = true;
  function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar$1;
  }

  var effectCar = createSidecarMedium();

  var nothing = function () {
    return;
  };
  /**
   * Removes scrollbar from the page and contain the scroll within the Lock
   */
  var RemoveScroll = React__namespace.forwardRef(function (props, parentRef) {
    var ref = React__namespace.useRef(null);
    var _a = React__namespace.useState({
        onScrollCapture: nothing,
        onWheelCapture: nothing,
        onTouchMoveCapture: nothing
      }),
      callbacks = _a[0],
      setCallbacks = _a[1];
    var forwardProps = props.forwardProps,
      children = props.children,
      className = props.className,
      removeScrollBar = props.removeScrollBar,
      enabled = props.enabled,
      shards = props.shards,
      sideCar = props.sideCar,
      noIsolation = props.noIsolation,
      inert = props.inert,
      allowPinchZoom = props.allowPinchZoom,
      _b = props.as,
      Container = _b === void 0 ? 'div' : _b,
      rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noIsolation", "inert", "allowPinchZoom", "as"]);
    var SideCar = sideCar;
    var containerRef = useMergeRefs([ref, parentRef]);
    var containerProps = __assign(__assign({}, rest), callbacks);
    return React__namespace.createElement(React__namespace.Fragment, null, enabled && React__namespace.createElement(SideCar, {
      sideCar: effectCar,
      removeScrollBar: removeScrollBar,
      shards: shards,
      noIsolation: noIsolation,
      inert: inert,
      setCallbacks: setCallbacks,
      allowPinchZoom: !!allowPinchZoom,
      lockRef: ref
    }), forwardProps ? React__namespace.cloneElement(React__namespace.Children.only(children), __assign(__assign({}, containerProps), {
      ref: containerRef
    })) : React__namespace.createElement(Container, __assign({}, containerProps, {
      className: className,
      ref: containerRef
    }), children));
  });
  RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
  };
  RemoveScroll.classNames = {
    fullWidth: fullWidthClassName,
    zeroRight: zeroRightClassName
  };

  var currentNonce;
  var getNonce = function () {
    if (currentNonce) {
      return currentNonce;
    }
    if (typeof __webpack_nonce__ !== 'undefined') {
      return __webpack_nonce__;
    }
    return undefined;
  };

  function makeStyleTag() {
    if (!document) return null;
    var tag = document.createElement('style');
    tag.type = 'text/css';
    var nonce = getNonce();
    if (nonce) {
      tag.setAttribute('nonce', nonce);
    }
    return tag;
  }
  function injectStyles(tag, css) {
    // @ts-ignore
    if (tag.styleSheet) {
      // @ts-ignore
      tag.styleSheet.cssText = css;
    } else {
      tag.appendChild(document.createTextNode(css));
    }
  }
  function insertStyleTag(tag) {
    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(tag);
  }
  var stylesheetSingleton = function () {
    var counter = 0;
    var stylesheet = null;
    return {
      add: function (style) {
        if (counter == 0) {
          if (stylesheet = makeStyleTag()) {
            injectStyles(stylesheet, style);
            insertStyleTag(stylesheet);
          }
        }
        counter++;
      },
      remove: function () {
        counter--;
        if (!counter && stylesheet) {
          stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
          stylesheet = null;
        }
      }
    };
  };

  /**
   * creates a hook to control style singleton
   * @see {@link styleSingleton} for a safer component version
   * @example
   * ```tsx
   * const useStyle = styleHookSingleton();
   * ///
   * useStyle('body { overflow: hidden}');
   */
  var styleHookSingleton = function () {
    var sheet = stylesheetSingleton();
    return function (styles, isDynamic) {
      React__namespace.useEffect(function () {
        sheet.add(styles);
        return function () {
          sheet.remove();
        };
      }, [styles && isDynamic]);
    };
  };

  /**
   * create a Component to add styles on demand
   * - styles are added when first instance is mounted
   * - styles are removed when the last instance is unmounted
   * - changing styles in runtime does nothing unless dynamic is set. But with multiple components that can lead to the undefined behavior
   */
  var styleSingleton = function () {
    var useStyle = styleHookSingleton();
    var Sheet = function (_a) {
      var styles = _a.styles,
        dynamic = _a.dynamic;
      useStyle(styles, dynamic);
      return null;
    };
    return Sheet;
  };

  var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
  };
  var parse = function (x) {
    return parseInt(x || '', 10) || 0;
  };
  var getOffset = function (gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === 'padding' ? 'paddingLeft' : 'marginLeft'];
    var top = cs[gapMode === 'padding' ? 'paddingTop' : 'marginTop'];
    var right = cs[gapMode === 'padding' ? 'paddingRight' : 'marginRight'];
    return [parse(left), parse(top), parse(right)];
  };
  var getGapWidth = function (gapMode) {
    if (gapMode === void 0) {
      gapMode = 'margin';
    }
    if (typeof window === 'undefined') {
      return zeroGap;
    }
    var offsets = getOffset(gapMode);
    var documentWidth = document.documentElement.clientWidth;
    var windowWidth = window.innerWidth;
    return {
      left: offsets[0],
      top: offsets[1],
      right: offsets[2],
      gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
    };
  };

  var Style = styleSingleton();
  // important tip - once we measure scrollBar width and remove them
  // we could not repeat this operation
  // thus we are using style-singleton - only the first "yet correct" style will be applied.
  var getStyles = function (_a, allowRelative, gapMode, important) {
    var left = _a.left,
      top = _a.top,
      right = _a.right,
      gap = _a.gap;
    if (gapMode === void 0) {
      gapMode = 'margin';
    }
    return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([allowRelative && "position: relative ".concat(important, ";"), gapMode === 'margin' && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "), gapMode === 'padding' && "padding-right: ".concat(gap, "px ").concat(important, ";")].filter(Boolean).join(''), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
  };
  /**
   * Removes page scrollbar and blocks page scroll when mounted
   */
  var RemoveScrollBar = function (props) {
    var noRelative = props.noRelative,
      noImportant = props.noImportant,
      _a = props.gapMode,
      gapMode = _a === void 0 ? 'margin' : _a;
    /*
     gap will be measured on every component mount
     however it will be used only by the "first" invocation
     due to singleton nature of <Style
     */
    var gap = React__namespace.useMemo(function () {
      return getGapWidth(gapMode);
    }, [gapMode]);
    return React__namespace.createElement(Style, {
      styles: getStyles(gap, !noRelative, gapMode, !noImportant ? '!important' : '')
    });
  };

  var passiveSupported = false;
  if (typeof window !== 'undefined') {
    try {
      var options = Object.defineProperty({}, 'passive', {
        get: function () {
          passiveSupported = true;
          return true;
        }
      });
      // @ts-ignore
      window.addEventListener('test', options, options);
      // @ts-ignore
      window.removeEventListener('test', options, options);
    } catch (err) {
      passiveSupported = false;
    }
  }
  var nonPassive = passiveSupported ? {
    passive: false
  } : false;

  var alwaysContainsScroll = function (node) {
    // textarea will always _contain_ scroll inside self. It only can be hidden
    return node.tagName === 'TEXTAREA';
  };
  var elementCanBeScrolled = function (node, overflow) {
    var styles = window.getComputedStyle(node);
    return (
      // not-not-scrollable
      styles[overflow] !== 'hidden' &&
      // contains scroll inside self
      !(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === 'visible')
    );
  };
  var elementCouldBeVScrolled = function (node) {
    return elementCanBeScrolled(node, 'overflowY');
  };
  var elementCouldBeHScrolled = function (node) {
    return elementCanBeScrolled(node, 'overflowX');
  };
  var locationCouldBeScrolled = function (axis, node) {
    var current = node;
    do {
      // Skip over shadow root
      if (typeof ShadowRoot !== 'undefined' && current instanceof ShadowRoot) {
        current = current.host;
      }
      var isScrollable = elementCouldBeScrolled(axis, current);
      if (isScrollable) {
        var _a = getScrollVariables(axis, current),
          s = _a[1],
          d = _a[2];
        if (s > d) {
          return true;
        }
      }
      current = current.parentNode;
    } while (current && current !== document.body);
    return false;
  };
  var getVScrollVariables = function (_a) {
    var scrollTop = _a.scrollTop,
      scrollHeight = _a.scrollHeight,
      clientHeight = _a.clientHeight;
    return [scrollTop, scrollHeight, clientHeight];
  };
  var getHScrollVariables = function (_a) {
    var scrollLeft = _a.scrollLeft,
      scrollWidth = _a.scrollWidth,
      clientWidth = _a.clientWidth;
    return [scrollLeft, scrollWidth, clientWidth];
  };
  var elementCouldBeScrolled = function (axis, node) {
    return axis === 'v' ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
  };
  var getScrollVariables = function (axis, node) {
    return axis === 'v' ? getVScrollVariables(node) : getHScrollVariables(node);
  };
  var getDirectionFactor = function (axis, direction) {
    /**
     * If the element's direction is rtl (right-to-left), then scrollLeft is 0 when the scrollbar is at its rightmost position,
     * and then increasingly negative as you scroll towards the end of the content.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
     */
    return axis === 'h' && direction === 'rtl' ? -1 : 1;
  };
  var handleScroll = function (axis, endTarget, event, sourceDelta, noOverscroll) {
    var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
    var delta = directionFactor * sourceDelta;
    // find scrollable target
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
      var _a = getScrollVariables(axis, target),
        position = _a[0],
        scroll_1 = _a[1],
        capacity = _a[2];
      var elementScroll = scroll_1 - capacity - directionFactor * position;
      if (position || elementScroll) {
        if (elementCouldBeScrolled(axis, target)) {
          availableScroll += elementScroll;
          availableScrollTop += position;
        }
      }
      target = target.parentNode;
    } while (
    // portaled content
    !targetInLock && target !== document.body ||
    // self content
    targetInLock && (endTarget.contains(target) || endTarget === target));
    if (isDeltaPositive && (noOverscroll && availableScroll === 0 || !noOverscroll && delta > availableScroll)) {
      shouldCancelScroll = true;
    } else if (!isDeltaPositive && (noOverscroll && availableScrollTop === 0 || !noOverscroll && -delta > availableScrollTop)) {
      shouldCancelScroll = true;
    }
    return shouldCancelScroll;
  };

  var getTouchXY = function (event) {
    return 'changedTouches' in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
  };
  var getDeltaXY = function (event) {
    return [event.deltaX, event.deltaY];
  };
  var extractRef = function (ref) {
    return ref && 'current' in ref ? ref.current : ref;
  };
  var deltaCompare = function (x, y) {
    return x[0] === y[0] && x[1] === y[1];
  };
  var generateStyle = function (id) {
    return "\n  .block-interactivity-".concat(id, " {pointer-events: none;}\n  .allow-interactivity-").concat(id, " {pointer-events: all;}\n");
  };
  var idCounter = 0;
  var lockStack = [];
  function RemoveScrollSideCar(props) {
    var shouldPreventQueue = React__namespace.useRef([]);
    var touchStartRef = React__namespace.useRef([0, 0]);
    var activeAxis = React__namespace.useRef();
    var id = React__namespace.useState(idCounter++)[0];
    var Style = React__namespace.useState(function () {
      return styleSingleton();
    })[0];
    var lastProps = React__namespace.useRef(props);
    React__namespace.useEffect(function () {
      lastProps.current = props;
    }, [props]);
    React__namespace.useEffect(function () {
      if (props.inert) {
        document.body.classList.add("block-interactivity-".concat(id));
        var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef), true).filter(Boolean);
        allow_1.forEach(function (el) {
          return el.classList.add("allow-interactivity-".concat(id));
        });
        return function () {
          document.body.classList.remove("block-interactivity-".concat(id));
          allow_1.forEach(function (el) {
            return el.classList.remove("allow-interactivity-".concat(id));
          });
        };
      }
      return;
    }, [props.inert, props.lockRef.current, props.shards]);
    var shouldCancelEvent = React__namespace.useCallback(function (event, parent) {
      if ('touches' in event && event.touches.length === 2) {
        return !lastProps.current.allowPinchZoom;
      }
      var touch = getTouchXY(event);
      var touchStart = touchStartRef.current;
      var deltaX = 'deltaX' in event ? event.deltaX : touchStart[0] - touch[0];
      var deltaY = 'deltaY' in event ? event.deltaY : touchStart[1] - touch[1];
      var currentAxis;
      var target = event.target;
      var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? 'h' : 'v';
      // allow horizontal touch move on Range inputs. They will not cause any scroll
      if ('touches' in event && moveDirection === 'h' && target.type === 'range') {
        return false;
      }
      var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      if (!canBeScrolledInMainDirection) {
        return true;
      }
      if (canBeScrolledInMainDirection) {
        currentAxis = moveDirection;
      } else {
        currentAxis = moveDirection === 'v' ? 'h' : 'v';
        canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
        // other axis might be not scrollable
      }

      if (!canBeScrolledInMainDirection) {
        return false;
      }
      if (!activeAxis.current && 'changedTouches' in event && (deltaX || deltaY)) {
        activeAxis.current = currentAxis;
      }
      if (!currentAxis) {
        return true;
      }
      var cancelingAxis = activeAxis.current || currentAxis;
      return handleScroll(cancelingAxis, parent, event, cancelingAxis === 'h' ? deltaX : deltaY, true);
    }, []);
    var shouldPrevent = React__namespace.useCallback(function (_event) {
      var event = _event;
      if (!lockStack.length || lockStack[lockStack.length - 1] !== Style) {
        // not the last active
        return;
      }
      var delta = 'deltaY' in event ? getDeltaXY(event) : getTouchXY(event);
      var sourceEvent = shouldPreventQueue.current.filter(function (e) {
        return e.name === event.type && e.target === event.target && deltaCompare(e.delta, delta);
      })[0];
      // self event, and should be canceled
      if (sourceEvent && sourceEvent.should) {
        if (event.cancelable) {
          event.preventDefault();
        }
        return;
      }
      // outside or shard event
      if (!sourceEvent) {
        var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function (node) {
          return node.contains(event.target);
        });
        var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
        if (shouldStop) {
          if (event.cancelable) {
            event.preventDefault();
          }
        }
      }
    }, []);
    var shouldCancel = React__namespace.useCallback(function (name, delta, target, should) {
      var event = {
        name: name,
        delta: delta,
        target: target,
        should: should
      };
      shouldPreventQueue.current.push(event);
      setTimeout(function () {
        shouldPreventQueue.current = shouldPreventQueue.current.filter(function (e) {
          return e !== event;
        });
      }, 1);
    }, []);
    var scrollTouchStart = React__namespace.useCallback(function (event) {
      touchStartRef.current = getTouchXY(event);
      activeAxis.current = undefined;
    }, []);
    var scrollWheel = React__namespace.useCallback(function (event) {
      shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = React__namespace.useCallback(function (event) {
      shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    React__namespace.useEffect(function () {
      lockStack.push(Style);
      props.setCallbacks({
        onScrollCapture: scrollWheel,
        onWheelCapture: scrollWheel,
        onTouchMoveCapture: scrollTouchMove
      });
      document.addEventListener('wheel', shouldPrevent, nonPassive);
      document.addEventListener('touchmove', shouldPrevent, nonPassive);
      document.addEventListener('touchstart', scrollTouchStart, nonPassive);
      return function () {
        lockStack = lockStack.filter(function (inst) {
          return inst !== Style;
        });
        document.removeEventListener('wheel', shouldPrevent, nonPassive);
        document.removeEventListener('touchmove', shouldPrevent, nonPassive);
        document.removeEventListener('touchstart', scrollTouchStart, nonPassive);
      };
    }, []);
    var removeScrollBar = props.removeScrollBar,
      inert = props.inert;
    return React__namespace.createElement(React__namespace.Fragment, null, inert ? React__namespace.createElement(Style, {
      styles: generateStyle(id)
    }) : null, removeScrollBar ? React__namespace.createElement(RemoveScrollBar, {
      gapMode: "margin"
    }) : null);
  }

  var SideCar = exportSidecar(effectCar, RemoveScrollSideCar);

  var ReactRemoveScroll = React__namespace.forwardRef(function (props, ref) {
    return React__namespace.createElement(RemoveScroll, __assign({}, props, {
      ref: ref,
      sideCar: SideCar
    }));
  });
  ReactRemoveScroll.classNames = RemoveScroll.classNames;
  var $am6gm$RemoveScroll = ReactRemoveScroll;

  const $cc7e05a45900e73f$var$OPEN_KEYS = [' ', 'Enter', 'ArrowUp', 'ArrowDown'];
  const $cc7e05a45900e73f$var$SELECTION_KEYS = [' ', 'Enter'];
  /* -------------------------------------------------------------------------------------------------
   * Select
   * -----------------------------------------------------------------------------------------------*/
  const $cc7e05a45900e73f$var$SELECT_NAME = 'Select';
  const [$cc7e05a45900e73f$var$Collection, $cc7e05a45900e73f$var$useCollection, $cc7e05a45900e73f$var$createCollectionScope] = $e02a7d9cb1dc128c$export$c74125a8e3af6bb2($cc7e05a45900e73f$var$SELECT_NAME);
  const [$cc7e05a45900e73f$var$createSelectContext, $cc7e05a45900e73f$export$286727a75dc039bd] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($cc7e05a45900e73f$var$SELECT_NAME, [$cc7e05a45900e73f$var$createCollectionScope, $cf1ac5d9fe0e8206$export$722aac194ae923]);
  const $cc7e05a45900e73f$var$usePopperScope = $cf1ac5d9fe0e8206$export$722aac194ae923();
  const [$cc7e05a45900e73f$var$SelectProvider, $cc7e05a45900e73f$var$useSelectContext] = $cc7e05a45900e73f$var$createSelectContext($cc7e05a45900e73f$var$SELECT_NAME);
  const [$cc7e05a45900e73f$var$SelectNativeOptionsProvider, $cc7e05a45900e73f$var$useSelectNativeOptionsContext] = $cc7e05a45900e73f$var$createSelectContext($cc7e05a45900e73f$var$SELECT_NAME);
  const $cc7e05a45900e73f$export$ef9b1a59e592288f = props => {
    const {
      __scopeSelect: __scopeSelect,
      children: children,
      open: openProp,
      defaultOpen: defaultOpen,
      onOpenChange: onOpenChange,
      value: valueProp,
      defaultValue: defaultValue,
      onValueChange: onValueChange,
      dir: dir,
      name: name,
      autoComplete: autoComplete,
      disabled: disabled,
      required: required
    } = props;
    const popperScope = $cc7e05a45900e73f$var$usePopperScope(__scopeSelect);
    const [trigger, setTrigger] = React$1.useState(null);
    const [valueNode, setValueNode] = React$1.useState(null);
    const [valueNodeHasChildren, setValueNodeHasChildren] = React$1.useState(false);
    const direction = $f631663db3294ace$export$b39126d51d94e6f3(dir);
    const [open = false, setOpen] = $71cd76cc60e0454e$export$6f32135080cb4c3({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChange
    });
    const [value, setValue] = $71cd76cc60e0454e$export$6f32135080cb4c3({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange
    });
    const triggerPointerDownPosRef = React$1.useRef(null); // We set this to true by default so that events bubble to forms without JS (SSR)
    const isFormControl = trigger ? Boolean(trigger.closest('form')) : true;
    const [nativeOptionsSet, setNativeOptionsSet] = React$1.useState(new Set()); // The native `select` only associates the correct default value if the corresponding
    // `option` is rendered as a child **at the same time** as itself.
    // Because it might take a few renders for our items to gather the information to build
    // the native `option`(s), we generate a key on the `select` to make sure React re-builds it
    // each time the options change.
    const nativeSelectKey = Array.from(nativeOptionsSet).map(option => option.props.value).join(';');
    return /*#__PURE__*/React$1.createElement($cf1ac5d9fe0e8206$export$be92b6f5f03c0fe9, popperScope, /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$SelectProvider, {
      required: required,
      scope: __scopeSelect,
      trigger: trigger,
      onTriggerChange: setTrigger,
      valueNode: valueNode,
      onValueNodeChange: setValueNode,
      valueNodeHasChildren: valueNodeHasChildren,
      onValueNodeHasChildrenChange: setValueNodeHasChildren,
      contentId: $1746a345f3d73bb7$export$f680877a34711e37(),
      value: value,
      onValueChange: setValue,
      open: open,
      onOpenChange: setOpen,
      dir: direction,
      triggerPointerDownPosRef: triggerPointerDownPosRef,
      disabled: disabled
    }, /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$Collection.Provider, {
      scope: __scopeSelect
    }, /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$SelectNativeOptionsProvider, {
      scope: props.__scopeSelect,
      onNativeOptionAdd: React$1.useCallback(option => {
        setNativeOptionsSet(prev => new Set(prev).add(option));
      }, []),
      onNativeOptionRemove: React$1.useCallback(option => {
        setNativeOptionsSet(prev => {
          const optionsSet = new Set(prev);
          optionsSet.delete(option);
          return optionsSet;
        });
      }, [])
    }, children)), isFormControl ? /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$BubbleSelect, {
      key: nativeSelectKey,
      "aria-hidden": true,
      required: required,
      tabIndex: -1,
      name: name,
      autoComplete: autoComplete,
      value: value // enable form autofill
      ,

      onChange: event => setValue(event.target.value),
      disabled: disabled
    }, value === undefined ? /*#__PURE__*/React$1.createElement("option", {
      value: ""
    }) : null, Array.from(nativeOptionsSet)) : null));
  };
  /* -------------------------------------------------------------------------------------------------
   * SelectTrigger
   * -----------------------------------------------------------------------------------------------*/
  const $cc7e05a45900e73f$var$TRIGGER_NAME = 'SelectTrigger';
  const $cc7e05a45900e73f$export$3ac1e88a1c0b9f1 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSelect: __scopeSelect,
      disabled = false,
      ...triggerProps
    } = props;
    const popperScope = $cc7e05a45900e73f$var$usePopperScope(__scopeSelect);
    const context = $cc7e05a45900e73f$var$useSelectContext($cc7e05a45900e73f$var$TRIGGER_NAME, __scopeSelect);
    const isDisabled = context.disabled || disabled;
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, context.onTriggerChange);
    const getItems = $cc7e05a45900e73f$var$useCollection(__scopeSelect);
    const [searchRef, handleTypeaheadSearch, resetTypeahead] = $cc7e05a45900e73f$var$useTypeaheadSearch(search => {
      const enabledItems = getItems().filter(item => !item.disabled);
      const currentItem = enabledItems.find(item => item.value === context.value);
      const nextItem = $cc7e05a45900e73f$var$findNextItem(enabledItems, search, currentItem);
      if (nextItem !== undefined) context.onValueChange(nextItem.value);
    });
    const handleOpen = () => {
      if (!isDisabled) {
        context.onOpenChange(true); // reset typeahead when we open
        resetTypeahead();
      }
    };
    return /*#__PURE__*/React$1.createElement($cf1ac5d9fe0e8206$export$b688253958b8dfe7, _extends({
      asChild: true
    }, popperScope), /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.button, _extends({
      type: "button",
      role: "combobox",
      "aria-controls": context.contentId,
      "aria-expanded": context.open,
      "aria-required": context.required,
      "aria-autocomplete": "none",
      dir: context.dir,
      "data-state": context.open ? 'open' : 'closed',
      disabled: isDisabled,
      "data-disabled": isDisabled ? '' : undefined,
      "data-placeholder": $cc7e05a45900e73f$var$shouldShowPlaceholder(context.value) ? '' : undefined
    }, triggerProps, {
      ref: composedRefs // Enable compatibility with native label or custom `Label` "click" for Safari:
      ,

      onClick: $e42e1063c40fb3ef$export$b9ecd428b558ff10(triggerProps.onClick, event => {
        // Whilst browsers generally have no issue focusing the trigger when clicking
        // on a label, Safari seems to struggle with the fact that there's no `onClick`.
        // We force `focus` in this case. Note: this doesn't create any other side-effect
        // because we are preventing default in `onPointerDown` so effectively
        // this only runs for a label "click"
        event.currentTarget.focus();
      }),
      onPointerDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(triggerProps.onPointerDown, event => {
        // prevent implicit pointer capture
        // https://www.w3.org/TR/pointerevents3/#implicit-pointer-capture
        const target = event.target;
        if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
        // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
        // but not when the control key is pressed (avoiding MacOS right click)
        if (event.button === 0 && event.ctrlKey === false) {
          handleOpen();
          context.triggerPointerDownPosRef.current = {
            x: Math.round(event.pageX),
            y: Math.round(event.pageY)
          }; // prevent trigger from stealing focus from the active item after opening.
          event.preventDefault();
        }
      }),
      onKeyDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(triggerProps.onKeyDown, event => {
        const isTypingAhead = searchRef.current !== '';
        const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
        if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
        if (isTypingAhead && event.key === ' ') return;
        if ($cc7e05a45900e73f$var$OPEN_KEYS.includes(event.key)) {
          handleOpen();
          event.preventDefault();
        }
      })
    })));
  });
  /* -------------------------------------------------------------------------------------------------
   * SelectValue
   * -----------------------------------------------------------------------------------------------*/
  const $cc7e05a45900e73f$var$VALUE_NAME = 'SelectValue';
  const $cc7e05a45900e73f$export$e288731fd71264f0 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const {
      __scopeSelect: __scopeSelect,
      className: className,
      style: style,
      children: children,
      placeholder = '',
      ...valueProps
    } = props;
    const context = $cc7e05a45900e73f$var$useSelectContext($cc7e05a45900e73f$var$VALUE_NAME, __scopeSelect);
    const {
      onValueNodeHasChildrenChange: onValueNodeHasChildrenChange
    } = context;
    const hasChildren = children !== undefined;
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, context.onValueNodeChange);
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      onValueNodeHasChildrenChange(hasChildren);
    }, [onValueNodeHasChildrenChange, hasChildren]);
    return /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.span, _extends({}, valueProps, {
      ref: composedRefs // we don't want events from the portalled `SelectValue` children to bubble
      ,

      style: {
        pointerEvents: 'none'
      }
    }), $cc7e05a45900e73f$var$shouldShowPlaceholder(context.value) ? /*#__PURE__*/React$1.createElement(React$1.Fragment, null, placeholder) : children);
  });
  const $cc7e05a45900e73f$export$99b400cabb58c515 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSelect: __scopeSelect,
      children: children,
      ...iconProps
    } = props;
    return /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.span, _extends({
      "aria-hidden": true
    }, iconProps, {
      ref: forwardedRef
    }), children || '▼');
  });
  const $cc7e05a45900e73f$export$b2af6c9944296213 = props => {
    return /*#__PURE__*/React$1.createElement($f1701beae083dbae$export$602eac185826482c, _extends({
      asChild: true
    }, props));
  };
  /* -------------------------------------------------------------------------------------------------
   * SelectContent
   * -----------------------------------------------------------------------------------------------*/
  const $cc7e05a45900e73f$var$CONTENT_NAME = 'SelectContent';
  const $cc7e05a45900e73f$export$c973a4b3cb86a03d = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const context = $cc7e05a45900e73f$var$useSelectContext($cc7e05a45900e73f$var$CONTENT_NAME, props.__scopeSelect);
    const [fragment, setFragment] = React$1.useState(); // setting the fragment in `useLayoutEffect` as `DocumentFragment` doesn't exist on the server
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      setFragment(new DocumentFragment());
    }, []);
    if (!context.open) {
      const frag = fragment;
      return frag ? /*#__PURE__*/ReactDOM.createPortal( /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$SelectContentProvider, {
        scope: props.__scopeSelect
      }, /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$Collection.Slot, {
        scope: props.__scopeSelect
      }, /*#__PURE__*/React$1.createElement("div", null, props.children))), frag) : null;
    }
    return /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$SelectContentImpl, _extends({}, props, {
      ref: forwardedRef
    }));
  });
  /* -------------------------------------------------------------------------------------------------
   * SelectContentImpl
   * -----------------------------------------------------------------------------------------------*/
  const $cc7e05a45900e73f$var$CONTENT_MARGIN = 10;
  const [$cc7e05a45900e73f$var$SelectContentProvider, $cc7e05a45900e73f$var$useSelectContentContext] = $cc7e05a45900e73f$var$createSelectContext($cc7e05a45900e73f$var$CONTENT_NAME);
  const $cc7e05a45900e73f$var$SelectContentImpl = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSelect: __scopeSelect,
      position = 'item-aligned',
      onCloseAutoFocus: onCloseAutoFocus,
      onEscapeKeyDown: onEscapeKeyDown,
      onPointerDownOutside: onPointerDownOutside,
      side:
      //
      // PopperContent props
      side,
      sideOffset: sideOffset,
      align: align,
      alignOffset: alignOffset,
      arrowPadding: arrowPadding,
      collisionBoundary: collisionBoundary,
      collisionPadding: collisionPadding,
      sticky: sticky,
      hideWhenDetached: hideWhenDetached,
      avoidCollisions: avoidCollisions,
      //
      ...contentProps
    } = props;
    const context = $cc7e05a45900e73f$var$useSelectContext($cc7e05a45900e73f$var$CONTENT_NAME, __scopeSelect);
    const [content, setContent] = React$1.useState(null);
    const [viewport, setViewport] = React$1.useState(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, node => setContent(node));
    const [selectedItem, setSelectedItem] = React$1.useState(null);
    const [selectedItemText, setSelectedItemText] = React$1.useState(null);
    const getItems = $cc7e05a45900e73f$var$useCollection(__scopeSelect);
    const [isPositioned, setIsPositioned] = React$1.useState(false);
    const firstValidItemFoundRef = React$1.useRef(false); // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    React$1.useEffect(() => {
      if (content) return hideOthers(content);
    }, [content]); // Make sure the whole tree has focus guards as our `Select` may be
    // the last element in the DOM (because of the `Portal`)
    $3db38b7d1fb3fe6a$export$b7ece24a22aeda8c();
    const focusFirst = React$1.useCallback(candidates => {
      const [firstItem, ...restItems] = getItems().map(item => item.ref.current);
      const [lastItem] = restItems.slice(-1);
      const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
      for (const candidate of candidates) {
        // if focus is already where we want to go, we don't want to keep going through the candidates
        if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
        candidate === null || candidate === void 0 || candidate.scrollIntoView({
          block: 'nearest'
        }); // viewport might have padding so scroll to its edges when focusing first/last items.
        if (candidate === firstItem && viewport) viewport.scrollTop = 0;
        if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
        candidate === null || candidate === void 0 || candidate.focus();
        if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
      }
    }, [getItems, viewport]);
    const focusSelectedItem = React$1.useCallback(() => focusFirst([selectedItem, content]), [focusFirst, selectedItem, content]); // Since this is not dependent on layout, we want to ensure this runs at the same time as
    // other effects across components. Hence why we don't call `focusSelectedItem` inside `position`.
    React$1.useEffect(() => {
      if (isPositioned) focusSelectedItem();
    }, [isPositioned, focusSelectedItem]); // prevent selecting items on `pointerup` in some cases after opening from `pointerdown`
    // and close on `pointerup` outside.
    const {
      onOpenChange: onOpenChange,
      triggerPointerDownPosRef: triggerPointerDownPosRef
    } = context;
    React$1.useEffect(() => {
      if (content) {
        let pointerMoveDelta = {
          x: 0,
          y: 0
        };
        const handlePointerMove = event => {
          var _triggerPointerDownPo, _triggerPointerDownPo2, _triggerPointerDownPo3, _triggerPointerDownPo4;
          pointerMoveDelta = {
            x: Math.abs(Math.round(event.pageX) - ((_triggerPointerDownPo = (_triggerPointerDownPo2 = triggerPointerDownPosRef.current) === null || _triggerPointerDownPo2 === void 0 ? void 0 : _triggerPointerDownPo2.x) !== null && _triggerPointerDownPo !== void 0 ? _triggerPointerDownPo : 0)),
            y: Math.abs(Math.round(event.pageY) - ((_triggerPointerDownPo3 = (_triggerPointerDownPo4 = triggerPointerDownPosRef.current) === null || _triggerPointerDownPo4 === void 0 ? void 0 : _triggerPointerDownPo4.y) !== null && _triggerPointerDownPo3 !== void 0 ? _triggerPointerDownPo3 : 0))
          };
        };
        const handlePointerUp = event => {
          // If the pointer hasn't moved by a certain threshold then we prevent selecting item on `pointerup`.
          if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) event.preventDefault();else
            // otherwise, if the event was outside the content, close.
            if (!content.contains(event.target)) onOpenChange(false);
          document.removeEventListener('pointermove', handlePointerMove);
          triggerPointerDownPosRef.current = null;
        };
        if (triggerPointerDownPosRef.current !== null) {
          document.addEventListener('pointermove', handlePointerMove);
          document.addEventListener('pointerup', handlePointerUp, {
            capture: true,
            once: true
          });
        }
        return () => {
          document.removeEventListener('pointermove', handlePointerMove);
          document.removeEventListener('pointerup', handlePointerUp, {
            capture: true
          });
        };
      }
    }, [content, onOpenChange, triggerPointerDownPosRef]);
    React$1.useEffect(() => {
      const close = () => onOpenChange(false);
      window.addEventListener('blur', close);
      window.addEventListener('resize', close);
      return () => {
        window.removeEventListener('blur', close);
        window.removeEventListener('resize', close);
      };
    }, [onOpenChange]);
    const [searchRef, handleTypeaheadSearch] = $cc7e05a45900e73f$var$useTypeaheadSearch(search => {
      const enabledItems = getItems().filter(item => !item.disabled);
      const currentItem = enabledItems.find(item => item.ref.current === document.activeElement);
      const nextItem = $cc7e05a45900e73f$var$findNextItem(enabledItems, search, currentItem);
      if (nextItem)
        /**
        * Imperative focus during keydown is risky so we prevent React's batching updates
        * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
        */
        setTimeout(() => nextItem.ref.current.focus());
    });
    const itemRefCallback = React$1.useCallback((node, value, disabled) => {
      const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
      const isSelectedItem = context.value !== undefined && context.value === value;
      if (isSelectedItem || isFirstValidItem) {
        setSelectedItem(node);
        if (isFirstValidItem) firstValidItemFoundRef.current = true;
      }
    }, [context.value]);
    const handleItemLeave = React$1.useCallback(() => content === null || content === void 0 ? void 0 : content.focus(), [content]);
    const itemTextRefCallback = React$1.useCallback((node, value, disabled) => {
      const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
      const isSelectedItem = context.value !== undefined && context.value === value;
      if (isSelectedItem || isFirstValidItem) setSelectedItemText(node);
    }, [context.value]);
    const SelectPosition = position === 'popper' ? $cc7e05a45900e73f$var$SelectPopperPosition : $cc7e05a45900e73f$var$SelectItemAlignedPosition; // Silently ignore props that are not supported by `SelectItemAlignedPosition`
    const popperContentProps = SelectPosition === $cc7e05a45900e73f$var$SelectPopperPosition ? {
      side: side,
      sideOffset: sideOffset,
      align: align,
      alignOffset: alignOffset,
      arrowPadding: arrowPadding,
      collisionBoundary: collisionBoundary,
      collisionPadding: collisionPadding,
      sticky: sticky,
      hideWhenDetached: hideWhenDetached,
      avoidCollisions: avoidCollisions
    } : {};
    return /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$SelectContentProvider, {
      scope: __scopeSelect,
      content: content,
      viewport: viewport,
      onViewportChange: setViewport,
      itemRefCallback: itemRefCallback,
      selectedItem: selectedItem,
      onItemLeave: handleItemLeave,
      itemTextRefCallback: itemTextRefCallback,
      focusSelectedItem: focusSelectedItem,
      selectedItemText: selectedItemText,
      position: position,
      isPositioned: isPositioned,
      searchRef: searchRef
    }, /*#__PURE__*/React$1.createElement($am6gm$RemoveScroll, {
      as: $5e63c961fc1ce211$export$8c6ed5c666ac1360,
      allowPinchZoom: true
    }, /*#__PURE__*/React$1.createElement($d3863c46a17e8a28$export$20e40289641fbbb6, {
      asChild: true // we make sure we're not trapping once it's been closed
      ,

      trapped: context.open,
      onMountAutoFocus: event => {
        // we prevent open autofocus because we manually focus the selected item
        event.preventDefault();
      },
      onUnmountAutoFocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(onCloseAutoFocus, event => {
        var _context$trigger;
        (_context$trigger = context.trigger) === null || _context$trigger === void 0 || _context$trigger.focus({
          preventScroll: true
        });
        event.preventDefault();
      })
    }, /*#__PURE__*/React$1.createElement($5cb92bef7577960e$export$177fb62ff3ec1f22, {
      asChild: true,
      disableOutsidePointerEvents: true,
      onEscapeKeyDown: onEscapeKeyDown,
      onPointerDownOutside: onPointerDownOutside // When focus is trapped, a focusout event may still happen.
      ,

      onFocusOutside: event => event.preventDefault(),
      onDismiss: () => context.onOpenChange(false)
    }, /*#__PURE__*/React$1.createElement(SelectPosition, _extends({
      role: "listbox",
      id: context.contentId,
      "data-state": context.open ? 'open' : 'closed',
      dir: context.dir,
      onContextMenu: event => event.preventDefault()
    }, contentProps, popperContentProps, {
      onPlaced: () => setIsPositioned(true),
      ref: composedRefs,
      style: {
        // flex layout so we can place the scroll buttons properly
        display: 'flex',
        flexDirection: 'column',
        // reset the outline by default as the content MAY get focused
        outline: 'none',
        ...contentProps.style
      },
      onKeyDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(contentProps.onKeyDown, event => {
        const isModifierKey = event.ctrlKey || event.altKey || event.metaKey; // select should not be navigated using tab key so we prevent it
        if (event.key === 'Tab') event.preventDefault();
        if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
        if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
          const items = getItems().filter(item => !item.disabled);
          let candidateNodes = items.map(item => item.ref.current);
          if (['ArrowUp', 'End'].includes(event.key)) candidateNodes = candidateNodes.slice().reverse();
          if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
            const currentElement = event.target;
            const currentIndex = candidateNodes.indexOf(currentElement);
            candidateNodes = candidateNodes.slice(currentIndex + 1);
          }
          /**
          * Imperative focus during keydown is risky so we prevent React's batching updates
          * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
          */
          setTimeout(() => focusFirst(candidateNodes));
          event.preventDefault();
        }
      })
    }))))));
  });
  const $cc7e05a45900e73f$var$SelectItemAlignedPosition = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSelect: __scopeSelect,
      onPlaced: onPlaced,
      ...popperProps
    } = props;
    const context = $cc7e05a45900e73f$var$useSelectContext($cc7e05a45900e73f$var$CONTENT_NAME, __scopeSelect);
    const contentContext = $cc7e05a45900e73f$var$useSelectContentContext($cc7e05a45900e73f$var$CONTENT_NAME, __scopeSelect);
    const [contentWrapper, setContentWrapper] = React$1.useState(null);
    const [content, setContent] = React$1.useState(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, node => setContent(node));
    const getItems = $cc7e05a45900e73f$var$useCollection(__scopeSelect);
    const shouldExpandOnScrollRef = React$1.useRef(false);
    const shouldRepositionRef = React$1.useRef(true);
    const {
      viewport: viewport,
      selectedItem: selectedItem,
      selectedItemText: selectedItemText,
      focusSelectedItem: focusSelectedItem
    } = contentContext;
    const position = React$1.useCallback(() => {
      if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
        const triggerRect = context.trigger.getBoundingClientRect(); // -----------------------------------------------------------------------------------------
        //  Horizontal positioning
        // -----------------------------------------------------------------------------------------
        const contentRect = content.getBoundingClientRect();
        const valueNodeRect = context.valueNode.getBoundingClientRect();
        const itemTextRect = selectedItemText.getBoundingClientRect();
        if (context.dir !== 'rtl') {
          const itemTextOffset = itemTextRect.left - contentRect.left;
          const left = valueNodeRect.left - itemTextOffset;
          const leftDelta = triggerRect.left - left;
          const minContentWidth = triggerRect.width + leftDelta;
          const contentWidth = Math.max(minContentWidth, contentRect.width);
          const rightEdge = window.innerWidth - $cc7e05a45900e73f$var$CONTENT_MARGIN;
          const clampedLeft = $ae6933e535247d3d$export$7d15b64cf5a3a4c4(left, [$cc7e05a45900e73f$var$CONTENT_MARGIN, rightEdge - contentWidth]);
          contentWrapper.style.minWidth = minContentWidth + 'px';
          contentWrapper.style.left = clampedLeft + 'px';
        } else {
          const itemTextOffset = contentRect.right - itemTextRect.right;
          const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
          const rightDelta = window.innerWidth - triggerRect.right - right;
          const minContentWidth = triggerRect.width + rightDelta;
          const contentWidth = Math.max(minContentWidth, contentRect.width);
          const leftEdge = window.innerWidth - $cc7e05a45900e73f$var$CONTENT_MARGIN;
          const clampedRight = $ae6933e535247d3d$export$7d15b64cf5a3a4c4(right, [$cc7e05a45900e73f$var$CONTENT_MARGIN, leftEdge - contentWidth]);
          contentWrapper.style.minWidth = minContentWidth + 'px';
          contentWrapper.style.right = clampedRight + 'px';
        } // -----------------------------------------------------------------------------------------
        // Vertical positioning
        // -----------------------------------------------------------------------------------------
        const items = getItems();
        const availableHeight = window.innerHeight - $cc7e05a45900e73f$var$CONTENT_MARGIN * 2;
        const itemsHeight = viewport.scrollHeight;
        const contentStyles = window.getComputedStyle(content);
        const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
        const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
        const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
        const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
        const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth; // prettier-ignore
        const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
        const viewportStyles = window.getComputedStyle(viewport);
        const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
        const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
        const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - $cc7e05a45900e73f$var$CONTENT_MARGIN;
        const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
        const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
        const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
        const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
        const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
        const willAlignWithoutTopOverflow = contentTopToItemMiddle <= topEdgeToTriggerMiddle;
        if (willAlignWithoutTopOverflow) {
          const isLastItem = selectedItem === items[items.length - 1].ref.current;
          contentWrapper.style.bottom = "0px";
          const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
          const clampedTriggerMiddleToBottomEdge = Math.max(triggerMiddleToBottomEdge, selectedItemHalfHeight + (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth);
          const height = contentTopToItemMiddle + clampedTriggerMiddleToBottomEdge;
          contentWrapper.style.height = height + 'px';
        } else {
          const isFirstItem = selectedItem === items[0].ref.current;
          contentWrapper.style.top = "0px";
          const clampedTopEdgeToTriggerMiddle = Math.max(topEdgeToTriggerMiddle, contentBorderTopWidth + viewport.offsetTop + (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight);
          const height = clampedTopEdgeToTriggerMiddle + itemMiddleToContentBottom;
          contentWrapper.style.height = height + 'px';
          viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
        }
        contentWrapper.style.margin = `${$cc7e05a45900e73f$var$CONTENT_MARGIN}px 0`;
        contentWrapper.style.minHeight = minContentHeight + 'px';
        contentWrapper.style.maxHeight = availableHeight + 'px'; // -----------------------------------------------------------------------------------------
        onPlaced === null || onPlaced === void 0 || onPlaced(); // we don't want the initial scroll position adjustment to trigger "expand on scroll"
        // so we explicitly turn it on only after they've registered.
        requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
      }
    }, [getItems, context.trigger, context.valueNode, contentWrapper, content, viewport, selectedItem, selectedItemText, context.dir, onPlaced]);
    $9f79659886946c16$export$e5c5a5f917a5871c(() => position(), [position]); // copy z-index from content to wrapper
    const [contentZIndex, setContentZIndex] = React$1.useState();
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
    }, [content]); // When the viewport becomes scrollable at the top, the scroll up button will mount.
    // Because it is part of the normal flow, it will push down the viewport, thus throwing our
    // trigger => selectedItem alignment off by the amount the viewport was pushed down.
    // We wait for this to happen and then re-run the positining logic one more time to account for it.
    const handleScrollButtonChange = React$1.useCallback(node => {
      if (node && shouldRepositionRef.current === true) {
        position();
        focusSelectedItem === null || focusSelectedItem === void 0 || focusSelectedItem();
        shouldRepositionRef.current = false;
      }
    }, [position, focusSelectedItem]);
    return /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$SelectViewportProvider, {
      scope: __scopeSelect,
      contentWrapper: contentWrapper,
      shouldExpandOnScrollRef: shouldExpandOnScrollRef,
      onScrollButtonChange: handleScrollButtonChange
    }, /*#__PURE__*/React$1.createElement("div", {
      ref: setContentWrapper,
      style: {
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        zIndex: contentZIndex
      }
    }, /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, popperProps, {
      ref: composedRefs,
      style: {
        // When we get the height of the content, it includes borders. If we were to set
        // the height without having `boxSizing: 'border-box'` it would be too big.
        boxSizing: 'border-box',
        // We need to ensure the content doesn't get taller than the wrapper
        maxHeight: '100%',
        ...popperProps.style
      }
    }))));
  });
  const $cc7e05a45900e73f$var$SelectPopperPosition = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSelect: __scopeSelect,
      align = 'start',
      collisionPadding = $cc7e05a45900e73f$var$CONTENT_MARGIN,
      ...popperProps
    } = props;
    const popperScope = $cc7e05a45900e73f$var$usePopperScope(__scopeSelect);
    return /*#__PURE__*/React$1.createElement($cf1ac5d9fe0e8206$export$7c6e2c02157bb7d2, _extends({}, popperScope, popperProps, {
      ref: forwardedRef,
      align: align,
      collisionPadding: collisionPadding,
      style: {
        // Ensure border-box for floating-ui calculations
        boxSizing: 'border-box',
        ...popperProps.style,
        '--radix-select-content-transform-origin': 'var(--radix-popper-transform-origin)',
        '--radix-select-content-available-width': 'var(--radix-popper-available-width)',
        '--radix-select-content-available-height': 'var(--radix-popper-available-height)',
        '--radix-select-trigger-width': 'var(--radix-popper-anchor-width)',
        '--radix-select-trigger-height': 'var(--radix-popper-anchor-height)'
      }
    }));
  });
  /* -------------------------------------------------------------------------------------------------
   * SelectViewport
   * -----------------------------------------------------------------------------------------------*/
  const [$cc7e05a45900e73f$var$SelectViewportProvider, $cc7e05a45900e73f$var$useSelectViewportContext] = $cc7e05a45900e73f$var$createSelectContext($cc7e05a45900e73f$var$CONTENT_NAME, {});
  const $cc7e05a45900e73f$var$VIEWPORT_NAME = 'SelectViewport';
  const $cc7e05a45900e73f$export$9ed6e7b40248d36d = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSelect: __scopeSelect,
      ...viewportProps
    } = props;
    const contentContext = $cc7e05a45900e73f$var$useSelectContentContext($cc7e05a45900e73f$var$VIEWPORT_NAME, __scopeSelect);
    const viewportContext = $cc7e05a45900e73f$var$useSelectViewportContext($cc7e05a45900e73f$var$VIEWPORT_NAME, __scopeSelect);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, contentContext.onViewportChange);
    const prevScrollTopRef = React$1.useRef(0);
    return /*#__PURE__*/React$1.createElement(React$1.Fragment, null, /*#__PURE__*/React$1.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}`
      }
    }), /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$Collection.Slot, {
      scope: __scopeSelect
    }, /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      "data-radix-select-viewport": "",
      role: "presentation"
    }, viewportProps, {
      ref: composedRefs,
      style: {
        // we use position: 'relative' here on the `viewport` so that when we call
        // `selectedItem.offsetTop` in calculations, the offset is relative to the viewport
        // (independent of the scrollUpButton).
        position: 'relative',
        flex: 1,
        overflow: 'auto',
        ...viewportProps.style
      },
      onScroll: $e42e1063c40fb3ef$export$b9ecd428b558ff10(viewportProps.onScroll, event => {
        const viewport = event.currentTarget;
        const {
          contentWrapper: contentWrapper,
          shouldExpandOnScrollRef: shouldExpandOnScrollRef
        } = viewportContext;
        if (shouldExpandOnScrollRef !== null && shouldExpandOnScrollRef !== void 0 && shouldExpandOnScrollRef.current && contentWrapper) {
          const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
          if (scrolledBy > 0) {
            const availableHeight = window.innerHeight - $cc7e05a45900e73f$var$CONTENT_MARGIN * 2;
            const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
            const cssHeight = parseFloat(contentWrapper.style.height);
            const prevHeight = Math.max(cssMinHeight, cssHeight);
            if (prevHeight < availableHeight) {
              const nextHeight = prevHeight + scrolledBy;
              const clampedNextHeight = Math.min(availableHeight, nextHeight);
              const heightDiff = nextHeight - clampedNextHeight;
              contentWrapper.style.height = clampedNextHeight + 'px';
              if (contentWrapper.style.bottom === '0px') {
                viewport.scrollTop = heightDiff > 0 ? heightDiff : 0; // ensure the content stays pinned to the bottom
                contentWrapper.style.justifyContent = 'flex-end';
              }
            }
          }
        }
        prevScrollTopRef.current = viewport.scrollTop;
      })
    }))));
  });
  /* -------------------------------------------------------------------------------------------------
   * SelectGroup
   * -----------------------------------------------------------------------------------------------*/
  const $cc7e05a45900e73f$var$GROUP_NAME = 'SelectGroup';
  const [$cc7e05a45900e73f$var$SelectGroupContextProvider, $cc7e05a45900e73f$var$useSelectGroupContext] = $cc7e05a45900e73f$var$createSelectContext($cc7e05a45900e73f$var$GROUP_NAME);
  const $cc7e05a45900e73f$export$ee25a334c55de1f4 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSelect: __scopeSelect,
      ...groupProps
    } = props;
    const groupId = $1746a345f3d73bb7$export$f680877a34711e37();
    return /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$SelectGroupContextProvider, {
      scope: __scopeSelect,
      id: groupId
    }, /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      role: "group",
      "aria-labelledby": groupId
    }, groupProps, {
      ref: forwardedRef
    })));
  });
  /* -------------------------------------------------------------------------------------------------
   * SelectLabel
   * -----------------------------------------------------------------------------------------------*/
  const $cc7e05a45900e73f$var$LABEL_NAME = 'SelectLabel';
  const $cc7e05a45900e73f$export$f67338d29bd972f8 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSelect: __scopeSelect,
      ...labelProps
    } = props;
    const groupContext = $cc7e05a45900e73f$var$useSelectGroupContext($cc7e05a45900e73f$var$LABEL_NAME, __scopeSelect);
    return /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      id: groupContext.id
    }, labelProps, {
      ref: forwardedRef
    }));
  });
  /* -------------------------------------------------------------------------------------------------
   * SelectItem
   * -----------------------------------------------------------------------------------------------*/
  const $cc7e05a45900e73f$var$ITEM_NAME = 'SelectItem';
  const [$cc7e05a45900e73f$var$SelectItemContextProvider, $cc7e05a45900e73f$var$useSelectItemContext] = $cc7e05a45900e73f$var$createSelectContext($cc7e05a45900e73f$var$ITEM_NAME);
  const $cc7e05a45900e73f$export$13ef48a934230896 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSelect: __scopeSelect,
      value: value,
      disabled = false,
      textValue: textValueProp,
      ...itemProps
    } = props;
    const context = $cc7e05a45900e73f$var$useSelectContext($cc7e05a45900e73f$var$ITEM_NAME, __scopeSelect);
    const contentContext = $cc7e05a45900e73f$var$useSelectContentContext($cc7e05a45900e73f$var$ITEM_NAME, __scopeSelect);
    const isSelected = context.value === value;
    const [textValue, setTextValue] = React$1.useState(textValueProp !== null && textValueProp !== void 0 ? textValueProp : '');
    const [isFocused, setIsFocused] = React$1.useState(false);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, node => {
      var _contentContext$itemR;
      return (_contentContext$itemR = contentContext.itemRefCallback) === null || _contentContext$itemR === void 0 ? void 0 : _contentContext$itemR.call(contentContext, node, value, disabled);
    });
    const textId = $1746a345f3d73bb7$export$f680877a34711e37();
    const handleSelect = () => {
      if (!disabled) {
        context.onValueChange(value);
        context.onOpenChange(false);
      }
    };
    if (value === '') throw new Error('A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.');
    return /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$SelectItemContextProvider, {
      scope: __scopeSelect,
      value: value,
      disabled: disabled,
      textId: textId,
      isSelected: isSelected,
      onItemTextChange: React$1.useCallback(node => {
        setTextValue(prevTextValue => {
          var _node$textContent;
          return prevTextValue || ((_node$textContent = node === null || node === void 0 ? void 0 : node.textContent) !== null && _node$textContent !== void 0 ? _node$textContent : '').trim();
        });
      }, [])
    }, /*#__PURE__*/React$1.createElement($cc7e05a45900e73f$var$Collection.ItemSlot, {
      scope: __scopeSelect,
      value: value,
      disabled: disabled,
      textValue: textValue
    }, /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      role: "option",
      "aria-labelledby": textId,
      "data-highlighted": isFocused ? '' : undefined // `isFocused` caveat fixes stuttering in VoiceOver
      ,

      "aria-selected": isSelected && isFocused,
      "data-state": isSelected ? 'checked' : 'unchecked',
      "aria-disabled": disabled || undefined,
      "data-disabled": disabled ? '' : undefined,
      tabIndex: disabled ? undefined : -1
    }, itemProps, {
      ref: composedRefs,
      onFocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(itemProps.onFocus, () => setIsFocused(true)),
      onBlur: $e42e1063c40fb3ef$export$b9ecd428b558ff10(itemProps.onBlur, () => setIsFocused(false)),
      onPointerUp: $e42e1063c40fb3ef$export$b9ecd428b558ff10(itemProps.onPointerUp, handleSelect),
      onPointerMove: $e42e1063c40fb3ef$export$b9ecd428b558ff10(itemProps.onPointerMove, event => {
        if (disabled) {
          var _contentContext$onIte;
          (_contentContext$onIte = contentContext.onItemLeave) === null || _contentContext$onIte === void 0 || _contentContext$onIte.call(contentContext);
        } else
          // even though safari doesn't support this option, it's acceptable
          // as it only means it might scroll a few pixels when using the pointer.
          event.currentTarget.focus({
            preventScroll: true
          });
      }),
      onPointerLeave: $e42e1063c40fb3ef$export$b9ecd428b558ff10(itemProps.onPointerLeave, event => {
        if (event.currentTarget === document.activeElement) {
          var _contentContext$onIte2;
          (_contentContext$onIte2 = contentContext.onItemLeave) === null || _contentContext$onIte2 === void 0 || _contentContext$onIte2.call(contentContext);
        }
      }),
      onKeyDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(itemProps.onKeyDown, event => {
        var _contentContext$searc;
        const isTypingAhead = ((_contentContext$searc = contentContext.searchRef) === null || _contentContext$searc === void 0 ? void 0 : _contentContext$searc.current) !== '';
        if (isTypingAhead && event.key === ' ') return;
        if ($cc7e05a45900e73f$var$SELECTION_KEYS.includes(event.key)) handleSelect(); // prevent page scroll if using the space key to select an item
        if (event.key === ' ') event.preventDefault();
      })
    }))));
  });
  /* -------------------------------------------------------------------------------------------------
   * SelectItemText
   * -----------------------------------------------------------------------------------------------*/
  const $cc7e05a45900e73f$var$ITEM_TEXT_NAME = 'SelectItemText';
  const $cc7e05a45900e73f$export$3572fb0fb821ff49 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    // We ignore `className` and `style` as this part shouldn't be styled.
    const {
      __scopeSelect: __scopeSelect,
      className: className,
      style: style,
      ...itemTextProps
    } = props;
    const context = $cc7e05a45900e73f$var$useSelectContext($cc7e05a45900e73f$var$ITEM_TEXT_NAME, __scopeSelect);
    const contentContext = $cc7e05a45900e73f$var$useSelectContentContext($cc7e05a45900e73f$var$ITEM_TEXT_NAME, __scopeSelect);
    const itemContext = $cc7e05a45900e73f$var$useSelectItemContext($cc7e05a45900e73f$var$ITEM_TEXT_NAME, __scopeSelect);
    const nativeOptionsContext = $cc7e05a45900e73f$var$useSelectNativeOptionsContext($cc7e05a45900e73f$var$ITEM_TEXT_NAME, __scopeSelect);
    const [itemTextNode, setItemTextNode] = React$1.useState(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, node => setItemTextNode(node), itemContext.onItemTextChange, node => {
      var _contentContext$itemT;
      return (_contentContext$itemT = contentContext.itemTextRefCallback) === null || _contentContext$itemT === void 0 ? void 0 : _contentContext$itemT.call(contentContext, node, itemContext.value, itemContext.disabled);
    });
    const textContent = itemTextNode === null || itemTextNode === void 0 ? void 0 : itemTextNode.textContent;
    const nativeOption = React$1.useMemo(() => /*#__PURE__*/React$1.createElement("option", {
      key: itemContext.value,
      value: itemContext.value,
      disabled: itemContext.disabled
    }, textContent), [itemContext.disabled, itemContext.value, textContent]);
    const {
      onNativeOptionAdd: onNativeOptionAdd,
      onNativeOptionRemove: onNativeOptionRemove
    } = nativeOptionsContext;
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      onNativeOptionAdd(nativeOption);
      return () => onNativeOptionRemove(nativeOption);
    }, [onNativeOptionAdd, onNativeOptionRemove, nativeOption]);
    return /*#__PURE__*/React$1.createElement(React$1.Fragment, null, /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.span, _extends({
      id: itemContext.textId
    }, itemTextProps, {
      ref: composedRefs
    })), itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? /*#__PURE__*/ReactDOM.createPortal(itemTextProps.children, context.valueNode) : null);
  });
  /* -------------------------------------------------------------------------------------------------
   * SelectItemIndicator
   * -----------------------------------------------------------------------------------------------*/
  const $cc7e05a45900e73f$var$ITEM_INDICATOR_NAME = 'SelectItemIndicator';
  const $cc7e05a45900e73f$export$6b9198de19accfe6 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSelect: __scopeSelect,
      ...itemIndicatorProps
    } = props;
    const itemContext = $cc7e05a45900e73f$var$useSelectItemContext($cc7e05a45900e73f$var$ITEM_INDICATOR_NAME, __scopeSelect);
    return itemContext.isSelected ? /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.span, _extends({
      "aria-hidden": true
    }, itemIndicatorProps, {
      ref: forwardedRef
    })) : null;
  });
  const $cc7e05a45900e73f$export$eba4b1df07cb1d3 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSelect: __scopeSelect,
      ...separatorProps
    } = props;
    return /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      "aria-hidden": true
    }, separatorProps, {
      ref: forwardedRef
    }));
  });
  /* -----------------------------------------------------------------------------------------------*/
  function $cc7e05a45900e73f$var$shouldShowPlaceholder(value) {
    return value === '' || value === undefined;
  }
  const $cc7e05a45900e73f$var$BubbleSelect = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      value: value,
      ...selectProps
    } = props;
    const ref = React$1.useRef(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref);
    const prevValue = $010c2913dbd2fe3d$export$5cae361ad82dce8b(value); // Bubble value change to parents (e.g form change event)
    React$1.useEffect(() => {
      const select = ref.current;
      const selectProto = window.HTMLSelectElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(selectProto, 'value');
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event('change', {
          bubbles: true
        });
        setValue.call(select, value);
        select.dispatchEvent(event);
      }
    }, [prevValue, value]);
    /**
    * We purposefully use a `select` here to support form autofill as much
    * as possible.
    *
    * We purposefully do not add the `value` attribute here to allow the value
    * to be set programatically and bubble to any parent form `onChange` event.
    * Adding the `value` will cause React to consider the programatic
    * dispatch a duplicate and it will get swallowed.
    *
    * We use `VisuallyHidden` rather than `display: "none"` because Safari autofill
    * won't work otherwise.
    */
    return /*#__PURE__*/React$1.createElement($ea1ef594cf570d83$export$439d29a4e110a164, {
      asChild: true
    }, /*#__PURE__*/React$1.createElement("select", _extends({}, selectProps, {
      ref: composedRefs,
      defaultValue: value
    })));
  });
  $cc7e05a45900e73f$var$BubbleSelect.displayName = 'BubbleSelect';
  function $cc7e05a45900e73f$var$useTypeaheadSearch(onSearchChange) {
    const handleSearchChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onSearchChange);
    const searchRef = React$1.useRef('');
    const timerRef = React$1.useRef(0);
    const handleTypeaheadSearch = React$1.useCallback(key => {
      const search = searchRef.current + key;
      handleSearchChange(search);
      (function updateSearch(value) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current); // Reset `searchRef` 1 second after it was last updated
        if (value !== '') timerRef.current = window.setTimeout(() => updateSearch(''), 1000);
      })(search);
    }, [handleSearchChange]);
    const resetTypeahead = React$1.useCallback(() => {
      searchRef.current = '';
      window.clearTimeout(timerRef.current);
    }, []);
    React$1.useEffect(() => {
      return () => window.clearTimeout(timerRef.current);
    }, []);
    return [searchRef, handleTypeaheadSearch, resetTypeahead];
  }
  /**
   * This is the "meat" of the typeahead matching logic. It takes in a list of items,
   * the search and the current item, and returns the next item (or `undefined`).
   *
   * We normalize the search because if a user has repeatedly pressed a character,
   * we want the exact same behavior as if we only had that one character
   * (ie. cycle through items starting with that character)
   *
   * We also reorder the items by wrapping the array around the current item.
   * This is so we always look forward from the current item, and picking the first
   * item will always be the correct one.
   *
   * Finally, if the normalized search is exactly one character, we exclude the
   * current item from the values because otherwise it would be the first to match always
   * and focus would never move. This is as opposed to the regular case, where we
   * don't want focus to move if the current item still matches.
   */
  function $cc7e05a45900e73f$var$findNextItem(items, search, currentItem) {
    const isRepeated = search.length > 1 && Array.from(search).every(char => char === search[0]);
    const normalizedSearch = isRepeated ? search[0] : search;
    const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
    let wrappedItems = $cc7e05a45900e73f$var$wrapArray(items, Math.max(currentItemIndex, 0));
    const excludeCurrentItem = normalizedSearch.length === 1;
    if (excludeCurrentItem) wrappedItems = wrappedItems.filter(v => v !== currentItem);
    const nextItem = wrappedItems.find(item => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
    return nextItem !== currentItem ? nextItem : undefined;
  }
  /**
   * Wraps an array around itself at a given start index
   * Example: `wrapArray(['a', 'b', 'c', 'd'], 2) === ['c', 'd', 'a', 'b']`
   */
  function $cc7e05a45900e73f$var$wrapArray(array, startIndex) {
    return array.map((_, index) => array[(startIndex + index) % array.length]);
  }
  const $cc7e05a45900e73f$export$be92b6f5f03c0fe9 = $cc7e05a45900e73f$export$ef9b1a59e592288f;
  const $cc7e05a45900e73f$export$41fb9f06171c75f4 = $cc7e05a45900e73f$export$3ac1e88a1c0b9f1;
  const $cc7e05a45900e73f$export$4c8d1a57a761ef94 = $cc7e05a45900e73f$export$e288731fd71264f0;
  const $cc7e05a45900e73f$export$f04a61298a47a40f = $cc7e05a45900e73f$export$99b400cabb58c515;
  const $cc7e05a45900e73f$export$602eac185826482c = $cc7e05a45900e73f$export$b2af6c9944296213;
  const $cc7e05a45900e73f$export$7c6e2c02157bb7d2 = $cc7e05a45900e73f$export$c973a4b3cb86a03d;
  const $cc7e05a45900e73f$export$d5c6c08dc2d3ca7 = $cc7e05a45900e73f$export$9ed6e7b40248d36d;
  const $cc7e05a45900e73f$export$eb2fcfdbd7ba97d4 = $cc7e05a45900e73f$export$ee25a334c55de1f4;
  const $cc7e05a45900e73f$export$b04be29aa201d4f5 = $cc7e05a45900e73f$export$f67338d29bd972f8;
  const $cc7e05a45900e73f$export$6d08773d2e66f8f2 = $cc7e05a45900e73f$export$13ef48a934230896;
  const $cc7e05a45900e73f$export$d6e5bf9c43ea9319 = $cc7e05a45900e73f$export$3572fb0fb821ff49;
  const $cc7e05a45900e73f$export$c3468e2714d175fa = $cc7e05a45900e73f$export$6b9198de19accfe6;
  const $cc7e05a45900e73f$export$1ff3c3f08ae963c0 = $cc7e05a45900e73f$export$eba4b1df07cb1d3;

  function $6c2e24571c90391f$export$3e6543de14f8614f(initialState, machine) {
    return React$1.useReducer((state, event) => {
      const nextState = machine[state][event];
      return nextState !== null && nextState !== void 0 ? nextState : state;
    }, initialState);
  }

  /* -------------------------------------------------------------------------------------------------
   * ScrollArea
   * -----------------------------------------------------------------------------------------------*/
  const $57acba87d6e25586$var$SCROLL_AREA_NAME = 'ScrollArea';
  const [$57acba87d6e25586$var$createScrollAreaContext, $57acba87d6e25586$export$488468afe3a6f2b1] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($57acba87d6e25586$var$SCROLL_AREA_NAME);
  const [$57acba87d6e25586$var$ScrollAreaProvider, $57acba87d6e25586$var$useScrollAreaContext] = $57acba87d6e25586$var$createScrollAreaContext($57acba87d6e25586$var$SCROLL_AREA_NAME);
  const $57acba87d6e25586$export$ccf8d8d7bbf3c2cc = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeScrollArea: __scopeScrollArea,
      type = 'hover',
      dir: dir,
      scrollHideDelay = 600,
      ...scrollAreaProps
    } = props;
    const [scrollArea, setScrollArea] = React$1.useState(null);
    const [viewport, setViewport] = React$1.useState(null);
    const [content, setContent] = React$1.useState(null);
    const [scrollbarX, setScrollbarX] = React$1.useState(null);
    const [scrollbarY, setScrollbarY] = React$1.useState(null);
    const [cornerWidth, setCornerWidth] = React$1.useState(0);
    const [cornerHeight, setCornerHeight] = React$1.useState(0);
    const [scrollbarXEnabled, setScrollbarXEnabled] = React$1.useState(false);
    const [scrollbarYEnabled, setScrollbarYEnabled] = React$1.useState(false);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, node => setScrollArea(node));
    const direction = $f631663db3294ace$export$b39126d51d94e6f3(dir);
    return /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaProvider, {
      scope: __scopeScrollArea,
      type: type,
      dir: direction,
      scrollHideDelay: scrollHideDelay,
      scrollArea: scrollArea,
      viewport: viewport,
      onViewportChange: setViewport,
      content: content,
      onContentChange: setContent,
      scrollbarX: scrollbarX,
      onScrollbarXChange: setScrollbarX,
      scrollbarXEnabled: scrollbarXEnabled,
      onScrollbarXEnabledChange: setScrollbarXEnabled,
      scrollbarY: scrollbarY,
      onScrollbarYChange: setScrollbarY,
      scrollbarYEnabled: scrollbarYEnabled,
      onScrollbarYEnabledChange: setScrollbarYEnabled,
      onCornerWidthChange: setCornerWidth,
      onCornerHeightChange: setCornerHeight
    }, /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      dir: direction
    }, scrollAreaProps, {
      ref: composedRefs,
      style: {
        position: 'relative',
        // Pass corner sizes as CSS vars to reduce re-renders of context consumers
        ['--radix-scroll-area-corner-width']: cornerWidth + 'px',
        ['--radix-scroll-area-corner-height']: cornerHeight + 'px',
        ...props.style
      }
    })));
  });
  /* -------------------------------------------------------------------------------------------------
   * ScrollAreaViewport
   * -----------------------------------------------------------------------------------------------*/
  const $57acba87d6e25586$var$VIEWPORT_NAME = 'ScrollAreaViewport';
  const $57acba87d6e25586$export$a21cbf9f11fca853 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeScrollArea: __scopeScrollArea,
      children: children,
      ...viewportProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$VIEWPORT_NAME, __scopeScrollArea);
    const ref = React$1.useRef(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref, context.onViewportChange);
    return /*#__PURE__*/React$1.createElement(React$1.Fragment, null, /*#__PURE__*/React$1.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
      }
    }), /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      "data-radix-scroll-area-viewport": ""
    }, viewportProps, {
      ref: composedRefs,
      style: {
        /**
        * We don't support `visible` because the intention is to have at least one scrollbar
        * if this component is used and `visible` will behave like `auto` in that case
        * https://developer.mozilla.org/en-US/docs/Web/CSS/overflowed#description
        *
        * We don't handle `auto` because the intention is for the native implementation
        * to be hidden if using this component. We just want to ensure the node is scrollable
        * so could have used either `scroll` or `auto` here. We picked `scroll` to prevent
        * the browser from having to work out whether to render native scrollbars or not,
        * we tell it to with the intention of hiding them in CSS.
        */
        overflowX: context.scrollbarXEnabled ? 'scroll' : 'hidden',
        overflowY: context.scrollbarYEnabled ? 'scroll' : 'hidden',
        ...props.style
      }
    }), /*#__PURE__*/React$1.createElement("div", {
      ref: context.onContentChange,
      style: {
        minWidth: '100%',
        display: 'table'
      }
    }, children)));
  });
  /* -------------------------------------------------------------------------------------------------
   * ScrollAreaScrollbar
   * -----------------------------------------------------------------------------------------------*/
  const $57acba87d6e25586$var$SCROLLBAR_NAME = 'ScrollAreaScrollbar';
  const $57acba87d6e25586$export$2fabd85d0eba3c57 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      forceMount: forceMount,
      ...scrollbarProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
    const {
      onScrollbarXEnabledChange: onScrollbarXEnabledChange,
      onScrollbarYEnabledChange: onScrollbarYEnabledChange
    } = context;
    const isHorizontal = props.orientation === 'horizontal';
    React$1.useEffect(() => {
      isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
      return () => {
        isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
      };
    }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
    return context.type === 'hover' ? /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaScrollbarHover, _extends({}, scrollbarProps, {
      ref: forwardedRef,
      forceMount: forceMount
    })) : context.type === 'scroll' ? /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaScrollbarScroll, _extends({}, scrollbarProps, {
      ref: forwardedRef,
      forceMount: forceMount
    })) : context.type === 'auto' ? /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaScrollbarAuto, _extends({}, scrollbarProps, {
      ref: forwardedRef,
      forceMount: forceMount
    })) : context.type === 'always' ? /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaScrollbarVisible, _extends({}, scrollbarProps, {
      ref: forwardedRef
    })) : null;
  });
  /* -----------------------------------------------------------------------------------------------*/
  const $57acba87d6e25586$var$ScrollAreaScrollbarHover = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      forceMount: forceMount,
      ...scrollbarProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
    const [visible, setVisible] = React$1.useState(false);
    React$1.useEffect(() => {
      const scrollArea = context.scrollArea;
      let hideTimer = 0;
      if (scrollArea) {
        const handlePointerEnter = () => {
          window.clearTimeout(hideTimer);
          setVisible(true);
        };
        const handlePointerLeave = () => {
          hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
        };
        scrollArea.addEventListener('pointerenter', handlePointerEnter);
        scrollArea.addEventListener('pointerleave', handlePointerLeave);
        return () => {
          window.clearTimeout(hideTimer);
          scrollArea.removeEventListener('pointerenter', handlePointerEnter);
          scrollArea.removeEventListener('pointerleave', handlePointerLeave);
        };
      }
    }, [context.scrollArea, context.scrollHideDelay]);
    return /*#__PURE__*/React$1.createElement($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
      present: forceMount || visible
    }, /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaScrollbarAuto, _extends({
      "data-state": visible ? 'visible' : 'hidden'
    }, scrollbarProps, {
      ref: forwardedRef
    })));
  });
  const $57acba87d6e25586$var$ScrollAreaScrollbarScroll = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      forceMount: forceMount,
      ...scrollbarProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
    const isHorizontal = props.orientation === 'horizontal';
    const debounceScrollEnd = $57acba87d6e25586$var$useDebounceCallback(() => send('SCROLL_END'), 100);
    const [state, send] = $6c2e24571c90391f$export$3e6543de14f8614f('hidden', {
      hidden: {
        SCROLL: 'scrolling'
      },
      scrolling: {
        SCROLL_END: 'idle',
        POINTER_ENTER: 'interacting'
      },
      interacting: {
        SCROLL: 'interacting',
        POINTER_LEAVE: 'idle'
      },
      idle: {
        HIDE: 'hidden',
        SCROLL: 'scrolling',
        POINTER_ENTER: 'interacting'
      }
    });
    React$1.useEffect(() => {
      if (state === 'idle') {
        const hideTimer = window.setTimeout(() => send('HIDE'), context.scrollHideDelay);
        return () => window.clearTimeout(hideTimer);
      }
    }, [state, context.scrollHideDelay, send]);
    React$1.useEffect(() => {
      const viewport = context.viewport;
      const scrollDirection = isHorizontal ? 'scrollLeft' : 'scrollTop';
      if (viewport) {
        let prevScrollPos = viewport[scrollDirection];
        const handleScroll = () => {
          const scrollPos = viewport[scrollDirection];
          const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
          if (hasScrollInDirectionChanged) {
            send('SCROLL');
            debounceScrollEnd();
          }
          prevScrollPos = scrollPos;
        };
        viewport.addEventListener('scroll', handleScroll);
        return () => viewport.removeEventListener('scroll', handleScroll);
      }
    }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
    return /*#__PURE__*/React$1.createElement($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
      present: forceMount || state !== 'hidden'
    }, /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaScrollbarVisible, _extends({
      "data-state": state === 'hidden' ? 'hidden' : 'visible'
    }, scrollbarProps, {
      ref: forwardedRef,
      onPointerEnter: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerEnter, () => send('POINTER_ENTER')),
      onPointerLeave: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerLeave, () => send('POINTER_LEAVE'))
    })));
  });
  const $57acba87d6e25586$var$ScrollAreaScrollbarAuto = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
    const {
      forceMount: forceMount,
      ...scrollbarProps
    } = props;
    const [visible, setVisible] = React$1.useState(false);
    const isHorizontal = props.orientation === 'horizontal';
    const handleResize = $57acba87d6e25586$var$useDebounceCallback(() => {
      if (context.viewport) {
        const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
        const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
        setVisible(isHorizontal ? isOverflowX : isOverflowY);
      }
    }, 10);
    $57acba87d6e25586$var$useResizeObserver(context.viewport, handleResize);
    $57acba87d6e25586$var$useResizeObserver(context.content, handleResize);
    return /*#__PURE__*/React$1.createElement($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
      present: forceMount || visible
    }, /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaScrollbarVisible, _extends({
      "data-state": visible ? 'visible' : 'hidden'
    }, scrollbarProps, {
      ref: forwardedRef
    })));
  });
  /* -----------------------------------------------------------------------------------------------*/
  const $57acba87d6e25586$var$ScrollAreaScrollbarVisible = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      orientation = 'vertical',
      ...scrollbarProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
    const thumbRef = React$1.useRef(null);
    const pointerOffsetRef = React$1.useRef(0);
    const [sizes, setSizes] = React$1.useState({
      content: 0,
      viewport: 0,
      scrollbar: {
        size: 0,
        paddingStart: 0,
        paddingEnd: 0
      }
    });
    const thumbRatio = $57acba87d6e25586$var$getThumbRatio(sizes.viewport, sizes.content);
    const commonProps = {
      ...scrollbarProps,
      sizes: sizes,
      onSizesChange: setSizes,
      hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
      onThumbChange: thumb => thumbRef.current = thumb,
      onThumbPointerUp: () => pointerOffsetRef.current = 0,
      onThumbPointerDown: pointerPos => pointerOffsetRef.current = pointerPos
    };
    function getScrollPosition(pointerPos, dir) {
      return $57acba87d6e25586$var$getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
    }
    if (orientation === 'horizontal') return /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaScrollbarX, _extends({}, commonProps, {
      ref: forwardedRef,
      onThumbPositionChange: () => {
        if (context.viewport && thumbRef.current) {
          const scrollPos = context.viewport.scrollLeft;
          const offset = $57acba87d6e25586$var$getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
          thumbRef.current.style.transform = `translate3d(${offset}px, 0, 0)`;
        }
      },
      onWheelScroll: scrollPos => {
        if (context.viewport) context.viewport.scrollLeft = scrollPos;
      },
      onDragScroll: pointerPos => {
        if (context.viewport) context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
      }
    }));
    if (orientation === 'vertical') return /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaScrollbarY, _extends({}, commonProps, {
      ref: forwardedRef,
      onThumbPositionChange: () => {
        if (context.viewport && thumbRef.current) {
          const scrollPos = context.viewport.scrollTop;
          const offset = $57acba87d6e25586$var$getThumbOffsetFromScroll(scrollPos, sizes);
          thumbRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
      },
      onWheelScroll: scrollPos => {
        if (context.viewport) context.viewport.scrollTop = scrollPos;
      },
      onDragScroll: pointerPos => {
        if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
      }
    }));
    return null;
  });
  /* -----------------------------------------------------------------------------------------------*/
  const $57acba87d6e25586$var$ScrollAreaScrollbarX = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      sizes: sizes,
      onSizesChange: onSizesChange,
      ...scrollbarProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
    const [computedStyle, setComputedStyle] = React$1.useState();
    const ref = React$1.useRef(null);
    const composeRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref, context.onScrollbarXChange);
    React$1.useEffect(() => {
      if (ref.current) setComputedStyle(getComputedStyle(ref.current));
    }, [ref]);
    return /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaScrollbarImpl, _extends({
      "data-orientation": "horizontal"
    }, scrollbarProps, {
      ref: composeRefs,
      sizes: sizes,
      style: {
        bottom: 0,
        left: context.dir === 'rtl' ? 'var(--radix-scroll-area-corner-width)' : 0,
        right: context.dir === 'ltr' ? 'var(--radix-scroll-area-corner-width)' : 0,
        ['--radix-scroll-area-thumb-width']: $57acba87d6e25586$var$getThumbSize(sizes) + 'px',
        ...props.style
      },
      onThumbPointerDown: pointerPos => props.onThumbPointerDown(pointerPos.x),
      onDragScroll: pointerPos => props.onDragScroll(pointerPos.x),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollLeft + event.deltaX;
          props.onWheelScroll(scrollPos); // prevent window scroll when wheeling on scrollbar
          if ($57acba87d6e25586$var$isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) event.preventDefault();
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) onSizesChange({
          content: context.viewport.scrollWidth,
          viewport: context.viewport.offsetWidth,
          scrollbar: {
            size: ref.current.clientWidth,
            paddingStart: $57acba87d6e25586$var$toInt(computedStyle.paddingLeft),
            paddingEnd: $57acba87d6e25586$var$toInt(computedStyle.paddingRight)
          }
        });
      }
    }));
  });
  const $57acba87d6e25586$var$ScrollAreaScrollbarY = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      sizes: sizes,
      onSizesChange: onSizesChange,
      ...scrollbarProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, props.__scopeScrollArea);
    const [computedStyle, setComputedStyle] = React$1.useState();
    const ref = React$1.useRef(null);
    const composeRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, ref, context.onScrollbarYChange);
    React$1.useEffect(() => {
      if (ref.current) setComputedStyle(getComputedStyle(ref.current));
    }, [ref]);
    return /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaScrollbarImpl, _extends({
      "data-orientation": "vertical"
    }, scrollbarProps, {
      ref: composeRefs,
      sizes: sizes,
      style: {
        top: 0,
        right: context.dir === 'ltr' ? 0 : undefined,
        left: context.dir === 'rtl' ? 0 : undefined,
        bottom: 'var(--radix-scroll-area-corner-height)',
        ['--radix-scroll-area-thumb-height']: $57acba87d6e25586$var$getThumbSize(sizes) + 'px',
        ...props.style
      },
      onThumbPointerDown: pointerPos => props.onThumbPointerDown(pointerPos.y),
      onDragScroll: pointerPos => props.onDragScroll(pointerPos.y),
      onWheelScroll: (event, maxScrollPos) => {
        if (context.viewport) {
          const scrollPos = context.viewport.scrollTop + event.deltaY;
          props.onWheelScroll(scrollPos); // prevent window scroll when wheeling on scrollbar
          if ($57acba87d6e25586$var$isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) event.preventDefault();
        }
      },
      onResize: () => {
        if (ref.current && context.viewport && computedStyle) onSizesChange({
          content: context.viewport.scrollHeight,
          viewport: context.viewport.offsetHeight,
          scrollbar: {
            size: ref.current.clientHeight,
            paddingStart: $57acba87d6e25586$var$toInt(computedStyle.paddingTop),
            paddingEnd: $57acba87d6e25586$var$toInt(computedStyle.paddingBottom)
          }
        });
      }
    }));
  });
  /* -----------------------------------------------------------------------------------------------*/
  const [$57acba87d6e25586$var$ScrollbarProvider, $57acba87d6e25586$var$useScrollbarContext] = $57acba87d6e25586$var$createScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME);
  const $57acba87d6e25586$var$ScrollAreaScrollbarImpl = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeScrollArea: __scopeScrollArea,
      sizes: sizes,
      hasThumb: hasThumb,
      onThumbChange: onThumbChange,
      onThumbPointerUp: onThumbPointerUp,
      onThumbPointerDown: onThumbPointerDown,
      onThumbPositionChange: onThumbPositionChange,
      onDragScroll: onDragScroll,
      onWheelScroll: onWheelScroll,
      onResize: onResize,
      ...scrollbarProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$SCROLLBAR_NAME, __scopeScrollArea);
    const [scrollbar, setScrollbar] = React$1.useState(null);
    const composeRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, node => setScrollbar(node));
    const rectRef = React$1.useRef(null);
    const prevWebkitUserSelectRef = React$1.useRef('');
    const viewport = context.viewport;
    const maxScrollPos = sizes.content - sizes.viewport;
    const handleWheelScroll = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onWheelScroll);
    const handleThumbPositionChange = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onThumbPositionChange);
    const handleResize = $57acba87d6e25586$var$useDebounceCallback(onResize, 10);
    function handleDragScroll(event) {
      if (rectRef.current) {
        const x = event.clientX - rectRef.current.left;
        const y = event.clientY - rectRef.current.top;
        onDragScroll({
          x: x,
          y: y
        });
      }
    }
    /**
    * We bind wheel event imperatively so we can switch off passive
    * mode for document wheel event to allow it to be prevented
    */
    React$1.useEffect(() => {
      const handleWheel = event => {
        const element = event.target;
        const isScrollbarWheel = scrollbar === null || scrollbar === void 0 ? void 0 : scrollbar.contains(element);
        if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
      };
      document.addEventListener('wheel', handleWheel, {
        passive: false
      });
      return () => document.removeEventListener('wheel', handleWheel, {
        passive: false
      });
    }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
    /**
    * Update thumb position on sizes change
    */
    React$1.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
    $57acba87d6e25586$var$useResizeObserver(scrollbar, handleResize);
    $57acba87d6e25586$var$useResizeObserver(context.content, handleResize);
    return /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollbarProvider, {
      scope: __scopeScrollArea,
      scrollbar: scrollbar,
      hasThumb: hasThumb,
      onThumbChange: $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onThumbChange),
      onThumbPointerUp: $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onThumbPointerUp),
      onThumbPositionChange: handleThumbPositionChange,
      onThumbPointerDown: $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onThumbPointerDown)
    }, /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, scrollbarProps, {
      ref: composeRefs,
      style: {
        position: 'absolute',
        ...scrollbarProps.style
      },
      onPointerDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerDown, event => {
        const mainPointer = 0;
        if (event.button === mainPointer) {
          const element = event.target;
          element.setPointerCapture(event.pointerId);
          rectRef.current = scrollbar.getBoundingClientRect(); // pointer capture doesn't prevent text selection in Safari
          // so we remove text selection manually when scrolling
          prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
          document.body.style.webkitUserSelect = 'none';
          if (context.viewport) context.viewport.style.scrollBehavior = 'auto';
          handleDragScroll(event);
        }
      }),
      onPointerMove: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerMove, handleDragScroll),
      onPointerUp: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerUp, event => {
        const element = event.target;
        if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
        document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
        if (context.viewport) context.viewport.style.scrollBehavior = '';
        rectRef.current = null;
      })
    })));
  });
  /* -------------------------------------------------------------------------------------------------
   * ScrollAreaThumb
   * -----------------------------------------------------------------------------------------------*/
  const $57acba87d6e25586$var$THUMB_NAME = 'ScrollAreaThumb';
  const $57acba87d6e25586$export$9fba1154677d7cd2 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      forceMount: forceMount,
      ...thumbProps
    } = props;
    const scrollbarContext = $57acba87d6e25586$var$useScrollbarContext($57acba87d6e25586$var$THUMB_NAME, props.__scopeScrollArea);
    return /*#__PURE__*/React$1.createElement($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
      present: forceMount || scrollbarContext.hasThumb
    }, /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaThumbImpl, _extends({
      ref: forwardedRef
    }, thumbProps)));
  });
  const $57acba87d6e25586$var$ScrollAreaThumbImpl = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeScrollArea: __scopeScrollArea,
      style: style,
      ...thumbProps
    } = props;
    const scrollAreaContext = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$THUMB_NAME, __scopeScrollArea);
    const scrollbarContext = $57acba87d6e25586$var$useScrollbarContext($57acba87d6e25586$var$THUMB_NAME, __scopeScrollArea);
    const {
      onThumbPositionChange: onThumbPositionChange
    } = scrollbarContext;
    const composedRef = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, node => scrollbarContext.onThumbChange(node));
    const removeUnlinkedScrollListenerRef = React$1.useRef();
    const debounceScrollEnd = $57acba87d6e25586$var$useDebounceCallback(() => {
      if (removeUnlinkedScrollListenerRef.current) {
        removeUnlinkedScrollListenerRef.current();
        removeUnlinkedScrollListenerRef.current = undefined;
      }
    }, 100);
    React$1.useEffect(() => {
      const viewport = scrollAreaContext.viewport;
      if (viewport) {
        /**
        * We only bind to native scroll event so we know when scroll starts and ends.
        * When scroll starts we start a requestAnimationFrame loop that checks for
        * changes to scroll position. That rAF loop triggers our thumb position change
        * when relevant to avoid scroll-linked effects. We cancel the loop when scroll ends.
        * https://developer.mozilla.org/en-US/docs/Mozilla/Performance/Scroll-linked_effects
        */
        const handleScroll = () => {
          debounceScrollEnd();
          if (!removeUnlinkedScrollListenerRef.current) {
            const listener = $57acba87d6e25586$var$addUnlinkedScrollListener(viewport, onThumbPositionChange);
            removeUnlinkedScrollListenerRef.current = listener;
            onThumbPositionChange();
          }
        };
        onThumbPositionChange();
        viewport.addEventListener('scroll', handleScroll);
        return () => viewport.removeEventListener('scroll', handleScroll);
      }
    }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
    return /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      "data-state": scrollbarContext.hasThumb ? 'visible' : 'hidden'
    }, thumbProps, {
      ref: composedRef,
      style: {
        width: 'var(--radix-scroll-area-thumb-width)',
        height: 'var(--radix-scroll-area-thumb-height)',
        ...style
      },
      onPointerDownCapture: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerDownCapture, event => {
        const thumb = event.target;
        const thumbRect = thumb.getBoundingClientRect();
        const x = event.clientX - thumbRect.left;
        const y = event.clientY - thumbRect.top;
        scrollbarContext.onThumbPointerDown({
          x: x,
          y: y
        });
      }),
      onPointerUp: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onPointerUp, scrollbarContext.onThumbPointerUp)
    }));
  });
  /* -------------------------------------------------------------------------------------------------
   * ScrollAreaCorner
   * -----------------------------------------------------------------------------------------------*/
  const $57acba87d6e25586$var$CORNER_NAME = 'ScrollAreaCorner';
  const $57acba87d6e25586$export$56969d565df7cc4b = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$CORNER_NAME, props.__scopeScrollArea);
    const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
    const hasCorner = context.type !== 'scroll' && hasBothScrollbarsVisible;
    return hasCorner ? /*#__PURE__*/React$1.createElement($57acba87d6e25586$var$ScrollAreaCornerImpl, _extends({}, props, {
      ref: forwardedRef
    })) : null;
  });
  /* -----------------------------------------------------------------------------------------------*/
  const $57acba87d6e25586$var$ScrollAreaCornerImpl = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeScrollArea: __scopeScrollArea,
      ...cornerProps
    } = props;
    const context = $57acba87d6e25586$var$useScrollAreaContext($57acba87d6e25586$var$CORNER_NAME, __scopeScrollArea);
    const [width1, setWidth] = React$1.useState(0);
    const [height1, setHeight] = React$1.useState(0);
    const hasSize = Boolean(width1 && height1);
    $57acba87d6e25586$var$useResizeObserver(context.scrollbarX, () => {
      var _context$scrollbarX;
      const height = ((_context$scrollbarX = context.scrollbarX) === null || _context$scrollbarX === void 0 ? void 0 : _context$scrollbarX.offsetHeight) || 0;
      context.onCornerHeightChange(height);
      setHeight(height);
    });
    $57acba87d6e25586$var$useResizeObserver(context.scrollbarY, () => {
      var _context$scrollbarY;
      const width = ((_context$scrollbarY = context.scrollbarY) === null || _context$scrollbarY === void 0 ? void 0 : _context$scrollbarY.offsetWidth) || 0;
      context.onCornerWidthChange(width);
      setWidth(width);
    });
    return hasSize ? /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({}, cornerProps, {
      ref: forwardedRef,
      style: {
        width: width1,
        height: height1,
        position: 'absolute',
        right: context.dir === 'ltr' ? 0 : undefined,
        left: context.dir === 'rtl' ? 0 : undefined,
        bottom: 0,
        ...props.style
      }
    })) : null;
  });
  /* -----------------------------------------------------------------------------------------------*/
  function $57acba87d6e25586$var$toInt(value) {
    return value ? parseInt(value, 10) : 0;
  }
  function $57acba87d6e25586$var$getThumbRatio(viewportSize, contentSize) {
    const ratio = viewportSize / contentSize;
    return isNaN(ratio) ? 0 : ratio;
  }
  function $57acba87d6e25586$var$getThumbSize(sizes) {
    const ratio = $57acba87d6e25586$var$getThumbRatio(sizes.viewport, sizes.content);
    const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
    const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio; // minimum of 18 matches macOS minimum
    return Math.max(thumbSize, 18);
  }
  function $57acba87d6e25586$var$getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = 'ltr') {
    const thumbSizePx = $57acba87d6e25586$var$getThumbSize(sizes);
    const thumbCenter = thumbSizePx / 2;
    const offset = pointerOffset || thumbCenter;
    const thumbOffsetFromEnd = thumbSizePx - offset;
    const minPointerPos = sizes.scrollbar.paddingStart + offset;
    const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
    const maxScrollPos = sizes.content - sizes.viewport;
    const scrollRange = dir === 'ltr' ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
    const interpolate = $57acba87d6e25586$var$linearScale([minPointerPos, maxPointerPos], scrollRange);
    return interpolate(pointerPos);
  }
  function $57acba87d6e25586$var$getThumbOffsetFromScroll(scrollPos, sizes, dir = 'ltr') {
    const thumbSizePx = $57acba87d6e25586$var$getThumbSize(sizes);
    const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
    const scrollbar = sizes.scrollbar.size - scrollbarPadding;
    const maxScrollPos = sizes.content - sizes.viewport;
    const maxThumbPos = scrollbar - thumbSizePx;
    const scrollClampRange = dir === 'ltr' ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
    const scrollWithoutMomentum = $ae6933e535247d3d$export$7d15b64cf5a3a4c4(scrollPos, scrollClampRange);
    const interpolate = $57acba87d6e25586$var$linearScale([0, maxScrollPos], [0, maxThumbPos]);
    return interpolate(scrollWithoutMomentum);
  } // https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
  function $57acba87d6e25586$var$linearScale(input, output) {
    return value => {
      if (input[0] === input[1] || output[0] === output[1]) return output[0];
      const ratio = (output[1] - output[0]) / (input[1] - input[0]);
      return output[0] + ratio * (value - input[0]);
    };
  }
  function $57acba87d6e25586$var$isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
    return scrollPos > 0 && scrollPos < maxScrollPos;
  } // Custom scroll handler to avoid scroll-linked effects
  // https://developer.mozilla.org/en-US/docs/Mozilla/Performance/Scroll-linked_effects
  const $57acba87d6e25586$var$addUnlinkedScrollListener = (node, handler = () => {}) => {
    let prevPosition = {
      left: node.scrollLeft,
      top: node.scrollTop
    };
    let rAF = 0;
    (function loop() {
      const position = {
        left: node.scrollLeft,
        top: node.scrollTop
      };
      const isHorizontalScroll = prevPosition.left !== position.left;
      const isVerticalScroll = prevPosition.top !== position.top;
      if (isHorizontalScroll || isVerticalScroll) handler();
      prevPosition = position;
      rAF = window.requestAnimationFrame(loop);
    })();
    return () => window.cancelAnimationFrame(rAF);
  };
  function $57acba87d6e25586$var$useDebounceCallback(callback, delay) {
    const handleCallback = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(callback);
    const debounceTimerRef = React$1.useRef(0);
    React$1.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
    return React$1.useCallback(() => {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(handleCallback, delay);
    }, [handleCallback, delay]);
  }
  function $57acba87d6e25586$var$useResizeObserver(element, onResize) {
    const handleResize = $b1b2314f5f9a1d84$export$25bec8c6f54ee79a(onResize);
    $9f79659886946c16$export$e5c5a5f917a5871c(() => {
      let rAF = 0;
      if (element) {
        /**
        * Resize Observer will throw an often benign error that says `ResizeObserver loop
        * completed with undelivered notifications`. This means that ResizeObserver was not
        * able to deliver all observations within a single animation frame, so we use
        * `requestAnimationFrame` to ensure we don't deliver unnecessary observations.
        * Further reading: https://github.com/WICG/resize-observer/issues/38
        */
        const resizeObserver = new ResizeObserver(() => {
          cancelAnimationFrame(rAF);
          rAF = window.requestAnimationFrame(handleResize);
        });
        resizeObserver.observe(element);
        return () => {
          window.cancelAnimationFrame(rAF);
          resizeObserver.unobserve(element);
        };
      }
    }, [element, handleResize]);
  }
  /* -----------------------------------------------------------------------------------------------*/
  const $57acba87d6e25586$export$be92b6f5f03c0fe9 = $57acba87d6e25586$export$ccf8d8d7bbf3c2cc;
  const $57acba87d6e25586$export$d5c6c08dc2d3ca7 = $57acba87d6e25586$export$a21cbf9f11fca853;
  const $57acba87d6e25586$export$9a4e88b92edfce6b = $57acba87d6e25586$export$2fabd85d0eba3c57;
  const $57acba87d6e25586$export$6521433ed15a34db = $57acba87d6e25586$export$9fba1154677d7cd2;
  const $57acba87d6e25586$export$ac61190d9fc311a9 = $57acba87d6e25586$export$56969d565df7cc4b;

  const sizes$8 = ['1', '2', '3'];
  const selectRootPropDefs = {
    size: {
      type: 'enum',
      values: sizes$8,
      default: '2',
      responsive: true
    }
  };
  const triggerVariants = ['classic', 'surface', 'soft', 'ghost'];
  const selectTriggerPropDefs = {
    variant: {
      type: 'enum',
      values: triggerVariants,
      default: 'surface'
    },
    color: colorProp,
    radius: radiusProp
  };
  const contentVariants = ['solid', 'soft'];
  const selectContentPropDefs = {
    variant: {
      type: 'enum',
      values: contentVariants,
      default: 'solid'
    },
    color: colorProp,
    highContrast: highContrastProp
  };

  const SelectContext = React__namespace.createContext({});
  const SelectRoot = props => {
    const {
      children,
      size = selectRootPropDefs.size.default,
      ...rootProps
    } = props;
    return React__namespace.createElement($cc7e05a45900e73f$export$be92b6f5f03c0fe9, {
      ...rootProps
    }, React__namespace.createElement(SelectContext.Provider, {
      value: React__namespace.useMemo(() => ({
        size
      }), [size])
    }, children));
  };
  SelectRoot.displayName = 'SelectRoot';
  const SelectTrigger = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const {
      className,
      variant = selectTriggerPropDefs.variant.default,
      color = selectTriggerPropDefs.color.default,
      radius = selectTriggerPropDefs.radius.default,
      placeholder,
      ...triggerProps
    } = marginRest;
    const {
      size
    } = React__namespace.useContext(SelectContext);
    return React__namespace.createElement($cc7e05a45900e73f$export$41fb9f06171c75f4, {
      asChild: true
    }, React__namespace.createElement("button", {
      "data-accent-color": color,
      "data-radius": radius,
      ...triggerProps,
      ref: forwardedRef,
      className: classNames('rt-reset', 'rt-SelectTrigger', className, withBreakpoints(size, 'rt-r-size'), `rt-variant-${variant}`, withMarginProps(marginProps))
    }, React__namespace.createElement("span", {
      className: "rt-SelectTriggerInner"
    }, React__namespace.createElement($cc7e05a45900e73f$export$4c8d1a57a761ef94, {
      placeholder: placeholder
    })), React__namespace.createElement($cc7e05a45900e73f$export$f04a61298a47a40f, {
      asChild: true
    }, React__namespace.createElement(ChevronDownIcon, {
      className: "rt-SelectIcon"
    }))));
  });
  SelectTrigger.displayName = 'SelectTrigger';
  const SelectContent = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      className,
      children,
      variant = selectContentPropDefs.variant.default,
      highContrast = selectContentPropDefs.highContrast.default,
      color = selectContentPropDefs.color.default,
      container,
      ...contentProps
    } = props;
    const {
      size
    } = React__namespace.useContext(SelectContext);
    const themeContext = useThemeContext();
    const resolvedColor = color !== null && color !== void 0 ? color : themeContext.accentColor;
    return React__namespace.createElement($cc7e05a45900e73f$export$602eac185826482c, {
      container: container
    }, React__namespace.createElement(Theme, {
      asChild: true
    }, React__namespace.createElement($cc7e05a45900e73f$export$7c6e2c02157bb7d2, {
      "data-accent-color": resolvedColor,
      sideOffset: 4,
      ...contentProps,
      ref: forwardedRef,
      className: classNames({
        'rt-PopperContent': contentProps.position === 'popper'
      }, 'rt-SelectContent', className, withBreakpoints(size, 'rt-r-size'), `rt-variant-${variant}`, {
        'rt-high-contrast': highContrast
      })
    }, React__namespace.createElement($57acba87d6e25586$export$be92b6f5f03c0fe9, {
      type: "auto",
      className: "rt-ScrollAreaRoot"
    }, React__namespace.createElement($cc7e05a45900e73f$export$d5c6c08dc2d3ca7, {
      asChild: true,
      className: "rt-SelectViewport"
    }, React__namespace.createElement($57acba87d6e25586$export$d5c6c08dc2d3ca7, {
      className: "rt-ScrollAreaViewport",
      style: {
        overflowY: undefined
      }
    }, children)), React__namespace.createElement($57acba87d6e25586$export$9a4e88b92edfce6b, {
      className: "rt-ScrollAreaScrollbar rt-r-size-1",
      orientation: "vertical"
    }, React__namespace.createElement($57acba87d6e25586$export$6521433ed15a34db, {
      className: "rt-ScrollAreaThumb"
    }))))));
  });
  SelectContent.displayName = 'SelectContent';
  const SelectItem = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      className,
      children,
      ...itemProps
    } = props;
    return React__namespace.createElement($cc7e05a45900e73f$export$6d08773d2e66f8f2, {
      ...itemProps,
      ref: forwardedRef,
      className: classNames('rt-SelectItem', className)
    }, React__namespace.createElement($cc7e05a45900e73f$export$c3468e2714d175fa, {
      className: "rt-SelectItemIndicator"
    }, React__namespace.createElement(ThickCheckIcon, {
      className: "rt-SelectItemIndicatorIcon"
    })), React__namespace.createElement($cc7e05a45900e73f$export$d6e5bf9c43ea9319, null, children));
  });
  SelectItem.displayName = 'SelectItem';
  const SelectGroup = React__namespace.forwardRef((props, forwardedRef) => React__namespace.createElement($cc7e05a45900e73f$export$eb2fcfdbd7ba97d4, {
    ...props,
    ref: forwardedRef,
    className: classNames('rt-SelectGroup', props.className)
  }));
  SelectGroup.displayName = 'SelectGroup';
  const SelectLabel = React__namespace.forwardRef((props, forwardedRef) => React__namespace.createElement($cc7e05a45900e73f$export$b04be29aa201d4f5, {
    ...props,
    ref: forwardedRef,
    className: classNames('rt-SelectLabel', props.className)
  }));
  SelectLabel.displayName = 'SelectLabel';
  const SelectSeparator = React__namespace.forwardRef((props, forwardedRef) => React__namespace.createElement($cc7e05a45900e73f$export$1ff3c3f08ae963c0, {
    ...props,
    ref: forwardedRef,
    className: classNames('rt-SelectSeparator', props.className)
  }));
  SelectSeparator.displayName = 'SelectSeparator';
  const Select = Object.assign({}, {
    Root: SelectRoot,
    Trigger: SelectTrigger,
    Content: SelectContent,
    Item: SelectItem,
    Group: SelectGroup,
    Label: SelectLabel,
    Separator: SelectSeparator
  });

  /* -------------------------------------------------------------------------------------------------
   * Switch
   * -----------------------------------------------------------------------------------------------*/
  const $6be4966fd9bbc698$var$SWITCH_NAME = 'Switch';
  const [$6be4966fd9bbc698$var$createSwitchContext, $6be4966fd9bbc698$export$cf7f5f17f69cbd43] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($6be4966fd9bbc698$var$SWITCH_NAME);
  const [$6be4966fd9bbc698$var$SwitchProvider, $6be4966fd9bbc698$var$useSwitchContext] = $6be4966fd9bbc698$var$createSwitchContext($6be4966fd9bbc698$var$SWITCH_NAME);
  const $6be4966fd9bbc698$export$b5d5cf8927ab7262 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSwitch: __scopeSwitch,
      name: name,
      checked: checkedProp,
      defaultChecked: defaultChecked,
      required: required,
      disabled: disabled,
      value = 'on',
      onCheckedChange: onCheckedChange,
      ...switchProps
    } = props;
    const [button, setButton] = React$1.useState(null);
    const composedRefs = $6ed0406888f73fc4$export$c7b2cbe3552a0d05(forwardedRef, node => setButton(node));
    const hasConsumerStoppedPropagationRef = React$1.useRef(false); // We set this to true by default so that events bubble to forms without JS (SSR)
    const isFormControl = button ? Boolean(button.closest('form')) : true;
    const [checked = false, setChecked] = $71cd76cc60e0454e$export$6f32135080cb4c3({
      prop: checkedProp,
      defaultProp: defaultChecked,
      onChange: onCheckedChange
    });
    return /*#__PURE__*/React$1.createElement($6be4966fd9bbc698$var$SwitchProvider, {
      scope: __scopeSwitch,
      checked: checked,
      disabled: disabled
    }, /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.button, _extends({
      type: "button",
      role: "switch",
      "aria-checked": checked,
      "aria-required": required,
      "data-state": $6be4966fd9bbc698$var$getState(checked),
      "data-disabled": disabled ? '' : undefined,
      disabled: disabled,
      value: value
    }, switchProps, {
      ref: composedRefs,
      onClick: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onClick, event => {
        setChecked(prevChecked => !prevChecked);
        if (isFormControl) {
          hasConsumerStoppedPropagationRef.current = event.isPropagationStopped(); // if switch is in a form, stop propagation from the button so that we only propagate
          // one click event (from the input). We propagate changes from an input so that native
          // form validation works and form events reflect switch updates.
          if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
        }
      })
    })), isFormControl && /*#__PURE__*/React$1.createElement($6be4966fd9bbc698$var$BubbleInput, {
      control: button,
      bubbles: !hasConsumerStoppedPropagationRef.current,
      name: name,
      value: value,
      checked: checked,
      required: required,
      disabled: disabled // We transform because the input is absolutely positioned but we have
      ,

      style: {
        transform: 'translateX(-100%)'
      }
    }));
  });
  /* -------------------------------------------------------------------------------------------------
   * SwitchThumb
   * -----------------------------------------------------------------------------------------------*/
  const $6be4966fd9bbc698$var$THUMB_NAME = 'SwitchThumb';
  const $6be4966fd9bbc698$export$4d07bf653ea69106 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeSwitch: __scopeSwitch,
      ...thumbProps
    } = props;
    const context = $6be4966fd9bbc698$var$useSwitchContext($6be4966fd9bbc698$var$THUMB_NAME, __scopeSwitch);
    return /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.span, _extends({
      "data-state": $6be4966fd9bbc698$var$getState(context.checked),
      "data-disabled": context.disabled ? '' : undefined
    }, thumbProps, {
      ref: forwardedRef
    }));
  });
  /* ---------------------------------------------------------------------------------------------- */
  const $6be4966fd9bbc698$var$BubbleInput = props => {
    const {
      control: control,
      checked: checked,
      bubbles = true,
      ...inputProps
    } = props;
    const ref = React$1.useRef(null);
    const prevChecked = $010c2913dbd2fe3d$export$5cae361ad82dce8b(checked);
    const controlSize = $db6c3485150b8e66$export$1ab7ae714698c4b8(control); // Bubble checked change to parents (e.g form change event)
    React$1.useEffect(() => {
      const input = ref.current;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'checked');
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event('click', {
          bubbles: bubbles
        });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /*#__PURE__*/React$1.createElement("input", _extends({
      type: "checkbox",
      "aria-hidden": true,
      defaultChecked: checked
    }, inputProps, {
      tabIndex: -1,
      ref: ref,
      style: {
        ...props.style,
        ...controlSize,
        position: 'absolute',
        pointerEvents: 'none',
        opacity: 0,
        margin: 0
      }
    }));
  };
  function $6be4966fd9bbc698$var$getState(checked) {
    return checked ? 'checked' : 'unchecked';
  }
  const $6be4966fd9bbc698$export$be92b6f5f03c0fe9 = $6be4966fd9bbc698$export$b5d5cf8927ab7262;
  const $6be4966fd9bbc698$export$6521433ed15a34db = $6be4966fd9bbc698$export$4d07bf653ea69106;

  const sizes$7 = ['1', '2', '3'];
  const variants$5 = ['classic', 'surface', 'soft'];
  const switchPropDefs = {
    size: {
      type: 'enum',
      values: sizes$7,
      default: '2',
      responsive: true
    },
    variant: {
      type: 'enum',
      values: variants$5,
      default: 'surface'
    },
    color: colorProp,
    highContrast: highContrastProp,
    radius: radiusProp
  };

  const Switch = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const {
      className,
      style,
      size = switchPropDefs.size.default,
      variant = switchPropDefs.variant.default,
      color = switchPropDefs.color.default,
      highContrast = switchPropDefs.highContrast.default,
      radius = switchPropDefs.radius.default,
      ...switchProps
    } = marginRest;
    return React__namespace.createElement("span", {
      "data-radius": radius,
      className: classNames('rt-SwitchRoot', className, withBreakpoints(size, 'rt-r-size'), `rt-variant-${variant}`, {
        'rt-high-contrast': highContrast
      }, withMarginProps(marginProps)),
      style: style
    }, React__namespace.createElement($6be4966fd9bbc698$export$be92b6f5f03c0fe9, {
      "data-accent-color": color,
      ...switchProps,
      ref: forwardedRef,
      className: classNames('rt-reset', 'rt-SwitchButton', {
        'rt-high-contrast': highContrast
      })
    }, React__namespace.createElement($6be4966fd9bbc698$export$6521433ed15a34db, {
      className: classNames('rt-SwitchThumb', {
        'rt-high-contrast': highContrast
      })
    })));
  });
  Switch.displayName = 'Switch';

  const sizes$6 = ['1', '2', '3'];
  const variants$4 = ['classic', 'surface', 'soft'];
  const textAreaPropDefs = {
    size: {
      type: 'enum',
      values: sizes$6,
      default: '2',
      responsive: true
    },
    variant: {
      type: 'enum',
      values: variants$4,
      default: 'surface'
    },
    color: colorProp
  };

  const TextArea = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const {
      className,
      size = textAreaPropDefs.size.default,
      variant = textAreaPropDefs.variant.default,
      color = textAreaPropDefs.color.default,
      style,
      ...textAreaProps
    } = marginRest;
    return React__namespace.createElement("div", {
      "data-accent-color": color,
      style: style,
      className: classNames('rt-TextAreaRoot', className, withBreakpoints(size, 'rt-r-size'), `rt-variant-${variant}`, withMarginProps(marginProps))
    }, React__namespace.createElement("textarea", {
      className: "rt-TextAreaInput",
      ref: forwardedRef,
      ...textAreaProps
    }), React__namespace.createElement("div", {
      className: "rt-TextAreaChrome"
    }));
  });
  TextArea.displayName = 'TextArea';

  const sizes$5 = ['1', '2', '3'];
  const variants$3 = ['classic', 'surface', 'soft'];
  const textFieldPropDefs = {
    size: {
      type: 'enum',
      values: sizes$5,
      default: '2',
      responsive: true
    },
    variant: {
      type: 'enum',
      values: variants$3,
      default: 'surface'
    },
    color: colorProp,
    radius: radiusProp
  };
  const textFieldSlotPropDefs = {
    color: colorProp,
    gap: flexPropDefs.gap
  };

  const TextFieldContext = React__namespace.createContext(undefined);
  const TextFieldRoot = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const {
      children,
      className,
      size = textFieldPropDefs.size.default,
      variant = textFieldPropDefs.variant.default,
      color = textFieldPropDefs.color.default,
      radius = textFieldPropDefs.radius.default,
      ...rootProps
    } = marginRest;
    return React__namespace.createElement("div", {
      "data-radius": radius,
      ...rootProps,
      ref: forwardedRef,
      className: classNames('rt-TextFieldRoot', className, withMarginProps(marginProps)),
      onPointerDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(rootProps.onPointerDown, event => {
        const target = event.target;
        if (target.closest('input, button, a')) return;
        const input = event.currentTarget.querySelector('.rt-TextFieldInput');
        if (!input) return;
        const position = input.compareDocumentPosition(target);
        const targetIsBeforeInput = (position & Node.DOCUMENT_POSITION_PRECEDING) !== 0;
        const cursorPosition = targetIsBeforeInput ? 0 : input.value.length;
        requestAnimationFrame(() => {
          input.setSelectionRange(cursorPosition, cursorPosition);
          input.focus();
        });
      })
    }, React__namespace.createElement(TextFieldContext.Provider, {
      value: {
        size,
        variant,
        color,
        radius
      }
    }, children));
  });
  TextFieldRoot.displayName = 'TextFieldRoot';
  const TextFieldSlot = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: paddingRest,
      ...paddingProps
    } = extractPaddingProps(props);
    const {
      className,
      color = textFieldSlotPropDefs.color.default,
      gap = textFieldSlotPropDefs.gap.default,
      ...slotProps
    } = paddingRest;
    const context = React__namespace.useContext(TextFieldContext);
    return React__namespace.createElement("div", {
      "data-accent-color": color,
      ...slotProps,
      ref: forwardedRef,
      className: classNames('rt-TextFieldSlot', className, withBreakpoints(context === null || context === void 0 ? void 0 : context.size, 'rt-r-size'), withBreakpoints(gap, 'rt-r-gap'), withPaddingProps(paddingProps))
    });
  });
  TextFieldSlot.displayName = 'TextFieldSlot';
  const TextFieldInput = React__namespace.forwardRef((props, forwardedRef) => {
    var _a, _b, _c, _d;
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const context = React__namespace.useContext(TextFieldContext);
    const hasRoot = context !== undefined;
    const {
      className,
      size = (_a = context === null || context === void 0 ? void 0 : context.size) !== null && _a !== void 0 ? _a : textFieldPropDefs.size.default,
      variant = (_b = context === null || context === void 0 ? void 0 : context.variant) !== null && _b !== void 0 ? _b : textFieldPropDefs.variant.default,
      color = (_c = context === null || context === void 0 ? void 0 : context.color) !== null && _c !== void 0 ? _c : textFieldPropDefs.color.default,
      radius = (_d = context === null || context === void 0 ? void 0 : context.radius) !== null && _d !== void 0 ? _d : textFieldPropDefs.radius.default,
      ...inputProps
    } = marginRest;
    const input = React__namespace.createElement(React__namespace.Fragment, null, React__namespace.createElement("input", {
      "data-accent-color": color,
      spellCheck: "false",
      ...inputProps,
      ref: forwardedRef,
      className: classNames('rt-TextFieldInput', className, withBreakpoints(size, 'rt-r-size'), `rt-variant-${variant}`)
    }), React__namespace.createElement("div", {
      "data-accent-color": color,
      "data-radius": (context === null || context === void 0 ? void 0 : context.radius) ? undefined : radius,
      className: "rt-TextFieldChrome"
    }));
    return hasRoot ? input : React__namespace.createElement(TextFieldRoot, {
      ...marginProps,
      size: size,
      variant: variant,
      color: color,
      radius: radius
    }, input);
  });
  TextFieldInput.displayName = 'TextFieldInput';
  const TextField = Object.assign({}, {
    Root: TextFieldRoot,
    Slot: TextFieldSlot,
    Input: TextFieldInput
  });

  const sizes$4 = ['1', '2', '3'];
  const scrollbarsValues = ['vertical', 'horizontal', 'both'];
  const scrollAreaPropDefs = {
    size: {
      type: 'enum',
      values: sizes$4,
      default: '1',
      responsive: true
    },
    radius: radiusProp,
    scrollbars: {
      type: 'enum',
      values: scrollbarsValues,
      default: 'both'
    }
  };

  const ScrollArea = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const {
      className,
      style,
      type,
      scrollHideDelay = type !== 'scroll' ? 0 : undefined,
      dir,
      size = scrollAreaPropDefs.size.default,
      radius = scrollAreaPropDefs.radius.default,
      scrollbars = scrollAreaPropDefs.scrollbars.default,
      ...viewportProps
    } = marginRest;
    return React__namespace.createElement($57acba87d6e25586$export$be92b6f5f03c0fe9, {
      type: type,
      scrollHideDelay: scrollHideDelay,
      className: classNames('rt-ScrollAreaRoot', className, withMarginProps(marginProps)),
      style: style
    }, React__namespace.createElement($57acba87d6e25586$export$d5c6c08dc2d3ca7, {
      ...viewportProps,
      ref: forwardedRef,
      className: "rt-ScrollAreaViewport"
    }), React__namespace.createElement("div", {
      className: "rt-ScrollAreaViewportFocusRing"
    }), scrollbars !== 'vertical' ? React__namespace.createElement($57acba87d6e25586$export$9a4e88b92edfce6b, {
      "data-radius": radius,
      orientation: "horizontal",
      className: classNames('rt-ScrollAreaScrollbar', withBreakpoints(size, 'rt-r-size'))
    }, React__namespace.createElement($57acba87d6e25586$export$6521433ed15a34db, {
      className: "rt-ScrollAreaThumb"
    })) : null, scrollbars !== 'horizontal' ? React__namespace.createElement($57acba87d6e25586$export$9a4e88b92edfce6b, {
      "data-radius": radius,
      orientation: "vertical",
      className: classNames('rt-ScrollAreaScrollbar', withBreakpoints(size, 'rt-r-size'))
    }, React__namespace.createElement($57acba87d6e25586$export$6521433ed15a34db, {
      className: "rt-ScrollAreaThumb"
    })) : null, scrollbars === 'both' ? React__namespace.createElement($57acba87d6e25586$export$ac61190d9fc311a9, {
      className: "rt-ScrollAreaCorner"
    }) : null);
  });
  ScrollArea.displayName = 'ScrollArea';

  const sizes$3 = ['1', '2'];
  const variants$2 = ['solid', 'soft', 'surface', 'outline'];
  const badgePropDefs = {
    size: {
      type: 'enum',
      values: sizes$3,
      default: '1',
      responsive: true
    },
    variant: {
      type: 'enum',
      values: variants$2,
      default: 'soft'
    },
    color: {
      ...colorProp,
      default: undefined
    },
    highContrast: highContrastProp,
    radius: radiusProp
  };

  const Badge = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const {
      className,
      size = badgePropDefs.size.default,
      variant = badgePropDefs.variant.default,
      color = badgePropDefs.color.default,
      highContrast = badgePropDefs.highContrast.default,
      radius = badgePropDefs.radius.default,
      ...badgeProps
    } = marginRest;
    return React__namespace.createElement("span", {
      "data-accent-color": color,
      "data-radius": radius,
      ...badgeProps,
      ref: forwardedRef,
      className: classNames('rt-Badge', className, withBreakpoints(size, 'rt-r-size'), `rt-variant-${variant}`, {
        'rt-high-contrast': highContrast
      }, withMarginProps(marginProps))
    });
  });
  Badge.displayName = 'Badge';

  const sizes$2 = ['1', '2', '3', '4'];
  const variants$1 = ['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'];
  const baseButtonPropDefs = {
    size: {
      type: 'enum',
      values: sizes$2,
      default: '2',
      responsive: true
    },
    variant: {
      type: 'enum',
      values: variants$1,
      default: 'solid'
    },
    color: colorProp,
    highContrast: highContrastProp,
    radius: radiusProp
  };

  const BaseButton = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const {
      className,
      asChild = false,
      size = baseButtonPropDefs.size.default,
      variant = baseButtonPropDefs.variant.default,
      color = baseButtonPropDefs.color.default,
      highContrast = baseButtonPropDefs.highContrast.default,
      radius = baseButtonPropDefs.radius.default,
      ...baseButtonProps
    } = marginRest;
    const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac1360 : 'button';
    return React__namespace.createElement(Comp
    // The `data-disabled` attribute enables correct styles when doing `<Button asChild disabled>`
    , {
      "data-disabled": baseButtonProps.disabled || undefined,
      "data-accent-color": color,
      "data-radius": radius,
      ...baseButtonProps,
      ref: forwardedRef,
      className: classNames('rt-reset', 'rt-BaseButton', className, withBreakpoints(size, 'rt-r-size'), `rt-variant-${variant}`, {
        'rt-high-contrast': highContrast
      }, withMarginProps(marginProps))
    });
  });
  BaseButton.displayName = 'BaseButton';

  const Button = React__namespace.forwardRef((props, forwardedRef) => React__namespace.createElement(BaseButton, {
    ...props,
    ref: forwardedRef,
    className: classNames('rt-Button', props.className)
  }));
  Button.displayName = 'Button';

  const sizes$1 = ['1', '2', '3', '4', '5'];
  const variants = ['surface', 'classic', 'ghost'];
  const cardPropDefs = {
    size: {
      type: 'enum',
      values: sizes$1,
      default: '1',
      responsive: true
    },
    variant: {
      type: 'enum',
      values: variants,
      default: 'surface'
    }
  };

  const Card = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const {
      asChild,
      children,
      className,
      size = cardPropDefs.size.default,
      variant = cardPropDefs.variant.default,
      ...cardProps
    } = marginRest;
    const Comp = asChild ? $5e63c961fc1ce211$export$8c6ed5c666ac1360 : 'div';
    function getChild() {
      const firstChild = React__namespace.Children.only(children);
      return React__namespace.cloneElement(firstChild, {
        children: React__namespace.createElement("div", {
          className: "rt-CardInner"
        }, firstChild.props.children)
      });
    }
    return React__namespace.createElement(Comp, {
      ref: forwardedRef,
      ...cardProps,
      className: classNames('rt-reset', 'rt-Card', className, withBreakpoints(size, 'rt-r-size'), `rt-variant-${variant}`, withMarginProps(marginProps))
    }, asChild ? getChild() : React__namespace.createElement("div", {
      className: "rt-CardInner"
    }, children));
  });
  Card.displayName = 'Card';

  const IconButton = React__namespace.forwardRef((props, forwardedRef) => React__namespace.createElement(BaseButton, {
    ...props,
    ref: forwardedRef,
    className: classNames('rt-IconButton', props.className)
  }));
  IconButton.displayName = 'IconButton';

  /* -------------------------------------------------------------------------------------------------
   * Tabs
   * -----------------------------------------------------------------------------------------------*/
  const $69cb30bb0017df05$var$TABS_NAME = 'Tabs';
  const [$69cb30bb0017df05$var$createTabsContext, $69cb30bb0017df05$export$355f5bd209d7b13a] = $c512c27ab02ef895$export$50c7b4e9d9f19c1($69cb30bb0017df05$var$TABS_NAME, [$d7bdfb9eb0fdf311$export$c7109489551a4f4]);
  const $69cb30bb0017df05$var$useRovingFocusGroupScope = $d7bdfb9eb0fdf311$export$c7109489551a4f4();
  const [$69cb30bb0017df05$var$TabsProvider, $69cb30bb0017df05$var$useTabsContext] = $69cb30bb0017df05$var$createTabsContext($69cb30bb0017df05$var$TABS_NAME);
  const $69cb30bb0017df05$export$b2539bed5023c21c = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeTabs: __scopeTabs,
      value: valueProp,
      onValueChange: onValueChange,
      defaultValue: defaultValue,
      orientation = 'horizontal',
      dir: dir,
      activationMode = 'automatic',
      ...tabsProps
    } = props;
    const direction = $f631663db3294ace$export$b39126d51d94e6f3(dir);
    const [value, setValue] = $71cd76cc60e0454e$export$6f32135080cb4c3({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue
    });
    return /*#__PURE__*/React$1.createElement($69cb30bb0017df05$var$TabsProvider, {
      scope: __scopeTabs,
      baseId: $1746a345f3d73bb7$export$f680877a34711e37(),
      value: value,
      onValueChange: setValue,
      orientation: orientation,
      dir: direction,
      activationMode: activationMode
    }, /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      dir: direction,
      "data-orientation": orientation
    }, tabsProps, {
      ref: forwardedRef
    })));
  });
  /* -------------------------------------------------------------------------------------------------
   * TabsList
   * -----------------------------------------------------------------------------------------------*/
  const $69cb30bb0017df05$var$TAB_LIST_NAME = 'TabsList';
  const $69cb30bb0017df05$export$9712d22edc0d78c1 = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeTabs: __scopeTabs,
      loop = true,
      ...listProps
    } = props;
    const context = $69cb30bb0017df05$var$useTabsContext($69cb30bb0017df05$var$TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = $69cb30bb0017df05$var$useRovingFocusGroupScope(__scopeTabs);
    return /*#__PURE__*/React$1.createElement($d7bdfb9eb0fdf311$export$be92b6f5f03c0fe9, _extends({
      asChild: true
    }, rovingFocusGroupScope, {
      orientation: context.orientation,
      dir: context.dir,
      loop: loop
    }), /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      role: "tablist",
      "aria-orientation": context.orientation
    }, listProps, {
      ref: forwardedRef
    })));
  });
  /* -------------------------------------------------------------------------------------------------
   * TabsTrigger
   * -----------------------------------------------------------------------------------------------*/
  const $69cb30bb0017df05$var$TRIGGER_NAME = 'TabsTrigger';
  const $69cb30bb0017df05$export$8114b9fdfdf9f3ba = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeTabs: __scopeTabs,
      value: value,
      disabled = false,
      ...triggerProps
    } = props;
    const context = $69cb30bb0017df05$var$useTabsContext($69cb30bb0017df05$var$TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = $69cb30bb0017df05$var$useRovingFocusGroupScope(__scopeTabs);
    const triggerId = $69cb30bb0017df05$var$makeTriggerId(context.baseId, value);
    const contentId = $69cb30bb0017df05$var$makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /*#__PURE__*/React$1.createElement($d7bdfb9eb0fdf311$export$6d08773d2e66f8f2, _extends({
      asChild: true
    }, rovingFocusGroupScope, {
      focusable: !disabled,
      active: isSelected
    }), /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.button, _extends({
      type: "button",
      role: "tab",
      "aria-selected": isSelected,
      "aria-controls": contentId,
      "data-state": isSelected ? 'active' : 'inactive',
      "data-disabled": disabled ? '' : undefined,
      disabled: disabled,
      id: triggerId
    }, triggerProps, {
      ref: forwardedRef,
      onMouseDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onMouseDown, event => {
        // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
        // but not when the control key is pressed (avoiding MacOS right click)
        if (!disabled && event.button === 0 && event.ctrlKey === false) context.onValueChange(value);else
          // prevent focus to avoid accidental activation
          event.preventDefault();
      }),
      onKeyDown: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onKeyDown, event => {
        if ([' ', 'Enter'].includes(event.key)) context.onValueChange(value);
      }),
      onFocus: $e42e1063c40fb3ef$export$b9ecd428b558ff10(props.onFocus, () => {
        // handle "automatic" activation if necessary
        // ie. activate tab following focus
        const isAutomaticActivation = context.activationMode !== 'manual';
        if (!isSelected && !disabled && isAutomaticActivation) context.onValueChange(value);
      })
    })));
  });
  /* -------------------------------------------------------------------------------------------------
   * TabsContent
   * -----------------------------------------------------------------------------------------------*/
  const $69cb30bb0017df05$var$CONTENT_NAME = 'TabsContent';
  const $69cb30bb0017df05$export$bd905d70e8fd2ebb = /*#__PURE__*/React$1.forwardRef((props, forwardedRef) => {
    const {
      __scopeTabs: __scopeTabs,
      value: value,
      forceMount: forceMount,
      children: children,
      ...contentProps
    } = props;
    const context = $69cb30bb0017df05$var$useTabsContext($69cb30bb0017df05$var$CONTENT_NAME, __scopeTabs);
    const triggerId = $69cb30bb0017df05$var$makeTriggerId(context.baseId, value);
    const contentId = $69cb30bb0017df05$var$makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = React$1.useRef(isSelected);
    React$1.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /*#__PURE__*/React$1.createElement($921a889cee6df7e8$export$99c2b779aa4e8b8b, {
      present: forceMount || isSelected
    }, ({
      present: present
    }) => /*#__PURE__*/React$1.createElement($8927f6f2acc4f386$export$250ffa63cdc0d034.div, _extends({
      "data-state": isSelected ? 'active' : 'inactive',
      "data-orientation": context.orientation,
      role: "tabpanel",
      "aria-labelledby": triggerId,
      hidden: !present,
      id: contentId,
      tabIndex: 0
    }, contentProps, {
      ref: forwardedRef,
      style: {
        ...props.style,
        animationDuration: isMountAnimationPreventedRef.current ? '0s' : undefined
      }
    }), present && children));
  });
  /* ---------------------------------------------------------------------------------------------- */
  function $69cb30bb0017df05$var$makeTriggerId(baseId, value) {
    return `${baseId}-trigger-${value}`;
  }
  function $69cb30bb0017df05$var$makeContentId(baseId, value) {
    return `${baseId}-content-${value}`;
  }
  const $69cb30bb0017df05$export$be92b6f5f03c0fe9 = $69cb30bb0017df05$export$b2539bed5023c21c;
  const $69cb30bb0017df05$export$54c2e3dc7acea9f5 = $69cb30bb0017df05$export$9712d22edc0d78c1;
  const $69cb30bb0017df05$export$41fb9f06171c75f4 = $69cb30bb0017df05$export$8114b9fdfdf9f3ba;
  const $69cb30bb0017df05$export$7c6e2c02157bb7d2 = $69cb30bb0017df05$export$bd905d70e8fd2ebb;

  const sizes = ['1', '2'];
  const tabsListPropDefs = {
    size: {
      type: 'enum',
      values: sizes,
      default: '2',
      responsive: true
    }
  };

  const TabsRoot = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      rest: marginRest,
      ...marginProps
    } = extractMarginProps(props);
    const {
      className,
      ...rootProps
    } = marginRest;
    return React__namespace.createElement($69cb30bb0017df05$export$be92b6f5f03c0fe9, {
      ...rootProps,
      ref: forwardedRef,
      className: classNames('rt-TabsRoot', className, withMarginProps(marginProps))
    });
  });
  TabsRoot.displayName = 'TabsRoot';
  const TabsList = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      className,
      size = tabsListPropDefs.size.default,
      ...listProps
    } = props;
    return React__namespace.createElement($69cb30bb0017df05$export$54c2e3dc7acea9f5, {
      ...listProps,
      ref: forwardedRef,
      className: classNames('rt-TabsList', className, withBreakpoints(size, 'rt-r-size'))
    });
  });
  TabsList.displayName = 'TabsList';
  const TabsTrigger = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      className,
      children,
      ...triggerProps
    } = props;
    return React__namespace.createElement($69cb30bb0017df05$export$41fb9f06171c75f4, {
      ...triggerProps,
      ref: forwardedRef,
      className: classNames('rt-reset', 'rt-TabsTrigger', className)
    }, React__namespace.createElement("span", {
      className: "rt-TabsTriggerInner"
    }, children), React__namespace.createElement("span", {
      className: "rt-TabsTriggerInnerHidden"
    }, children));
  });
  TabsTrigger.displayName = 'TabsTrigger';
  const TabsContent = React__namespace.forwardRef((props, forwardedRef) => React__namespace.createElement($69cb30bb0017df05$export$7c6e2c02157bb7d2, {
    ...props,
    ref: forwardedRef,
    className: classNames('rt-TabsContent', props.className)
  }));
  TabsContent.displayName = 'TabsContent';
  const Tabs = Object.assign({}, {
    Root: TabsRoot,
    List: TabsList,
    Trigger: TabsTrigger,
    Content: TabsContent
  });

  function RadixTheme(props) {
      return (React$1.createElement(Theme, { className: `${props.className}`, style: {
              zIndex: 9999,
              ...props.style,
          } }, props.children));
  }

  var createRoot;
  var m = ReactDOM;
  {
    createRoot = m.createRoot;
    m.hydrateRoot;
  }

  function copyTextToClipboard(text) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
  }
  const globalCreateRoot = (dom, ...args) => {
      const root = createRoot(dom, ...args);
      const doUnmount = root.unmount.bind(root);
      root.unmount = () => {
          doUnmount();
          window.unmountRootCallbacks.delete(doUnmount);
      };
      window.unmountRootCallbacks.add(doUnmount);
      return root;
  };
  function tryRun(func) {
      try {
          return [func(), null];
      }
      catch (e) {
          return [null, e];
      }
  }
  function shortString(s, max = 3) {
      return s.slice(0, max) + (s.length > max ? "..." : "");
  }
  function randomId() {
      const id = btoa((Math.random() + (Date.now() % 37)).toString());
      return id;
  }

  function useDrag(position, direction = { x: 1, y: 1 }) {
      const [currentPosition, setCurrentPosition] = React$1.useState({ ...position });
      const dragging = React$1.useRef(false);
      const startPosition = React$1.useRef({ ...position });
      const startClientPoint = React$1.useRef({ ...position });
      function onDragStart(e) {
          dragging.current = true;
          startPosition.current.x = currentPosition.x;
          startPosition.current.y = currentPosition.y;
          startClientPoint.current.x = e.clientX;
          startClientPoint.current.y = e.clientY;
      }
      React$1.useEffect(() => {
          function onDragMove(e) {
              if (!dragging.current)
                  return;
              const newPosition = { ...currentPosition };
              newPosition.x =
                  startPosition.current.x +
                      (e.clientX - startClientPoint.current.x) * direction.x;
              newPosition.y =
                  startPosition.current.y +
                      (e.clientY - startClientPoint.current.y) * direction.y;
              setCurrentPosition(newPosition);
          }
          function onDragEnd() {
              dragging.current = false;
          }
          document.addEventListener("pointermove", onDragMove);
          document.addEventListener("pointerup", onDragEnd);
          return () => {
              document.removeEventListener("pointermove", onDragMove);
              document.removeEventListener("pointerup", onDragEnd);
          };
      }, []);
      return {
          ...currentPosition,
          onDragStart,
      };
  }
  function getDragPositionAndDirection(position = {}) {
      const windowPosition = {
          x: 10,
          y: 60,
      };
      const direction = {
          x: -1,
          y: -1,
      };
      if (position.top !== undefined) {
          windowPosition.y = position.top;
          direction.y = 1;
      }
      if (position.right !== undefined) {
          windowPosition.x = position.right;
          direction.x = -1;
      }
      if (position.bottom !== undefined) {
          windowPosition.y = position.bottom;
          direction.y = -1;
      }
      if (position.left !== undefined) {
          windowPosition.x = position.left;
          direction.x = 1;
      }
      function makeStyle(windowPosition) {
          const horizontal = direction.x === -1 ? "right" : "left";
          const vertical = direction.y === -1 ? "bottom" : "top";
          return {
              [horizontal]: windowPosition.x,
              [vertical]: windowPosition.y,
          };
      }
      return {
          windowPosition,
          direction,
          makeStyle,
      };
  }
  function FloatWindow(props) {
      const windowInfo = getDragPositionAndDirection(props.position);
      const drag = useDrag({ ...windowInfo.windowPosition }, { ...windowInfo.direction });
      return (React$1.createElement("div", { className: `fixed flex flex-col bg-white border rounded-lg min-w-[268px] min-h-[200px] max-h-[90vh] shadow-md ${props.className}`, style: { ...windowInfo.makeStyle(drag), zIndex: 9999 } },
          React$1.createElement("div", { className: "flex items-center p-3 border-b cursor-move", onPointerDown: (e) => drag.onDragStart(e) },
              React$1.createElement("div", { className: "flex-1 text-xs font-bold text-black" }, props.title),
              React$1.createElement("div", { className: "flex items-center" },
                  React$1.createElement(IconButton, { variant: "ghost", color: "gray", onClick: () => props.onClose?.() },
                      React$1.createElement(Cross1Icon, null)))),
          React$1.createElement(ScrollArea, { className: "flex-1 p-3 text-sm" }, props.children)));
  }
  const allWindowsCloseHandler = new Map();
  function openFloatWindow(id, content, options) {
      if (allWindowsCloseHandler.has(id)) {
          allWindowsCloseHandler.get(id)();
      }
      let dom = document.getElementById(id);
      if (dom)
          dom.remove();
      dom = document.createElement("div");
      dom.id = id;
      dom.style.zIndex = "99999";
      document.body.append(dom);
      function closeWindow() {
          root.unmount();
          dom.remove();
          allWindowsCloseHandler.delete(id);
      }
      allWindowsCloseHandler.set(id, closeWindow);
      const root = globalCreateRoot(dom);
      root.render(React$1.createElement(RadixTheme, null,
          React$1.createElement(FloatWindow, { ...options, onClose: closeWindow }, content)));
      return {
          close: closeWindow,
          dom,
      };
  }

  function ListItem(props) {
      return (React$1.createElement("div", { className: "flex items-center p-2 border rounded-lg shadow-sm hover:bg-gray-100 " +
              props.className, onClick: props.onClick },
          React$1.createElement("div", { className: "flex-1 overflow-hidden text-xs" },
              React$1.createElement("div", { className: "font-bold" }, props.title),
              React$1.createElement("div", { className: "text-gray-400" }, props.subTitle)),
          React$1.createElement("div", { className: "text-xs" }, props.tail)));
  }

  function dispatchStorageEvent(key, newValue) {
    window.dispatchEvent(new StorageEvent("storage", {
      key,
      newValue
    }));
  }
  const setLocalStorageItem = (key, value) => {
    const stringifiedValue = JSON.stringify(value);
    window.localStorage.setItem(key, stringifiedValue);
    dispatchStorageEvent(key, stringifiedValue);
  };
  const removeLocalStorageItem = key => {
    window.localStorage.removeItem(key);
    dispatchStorageEvent(key, null);
  };
  const getLocalStorageItem = key => {
    return window.localStorage.getItem(key);
  };
  const useLocalStorageSubscribe = callback => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  };
  const getLocalStorageServerSnapshot = () => {
    throw Error("useLocalStorage is a client-only hook");
  };
  function useLocalStorage(key, initialValue) {
    const getSnapshot = () => getLocalStorageItem(key);
    const store = React__namespace.useSyncExternalStore(useLocalStorageSubscribe, getSnapshot, getLocalStorageServerSnapshot);
    const setState = React__namespace.useCallback(v => {
      try {
        const nextState = typeof v === "function" ? v(JSON.parse(store)) : v;
        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    }, [key, store]);
    React__namespace.useEffect(() => {
      if (getLocalStorageItem(key) === null && typeof initialValue !== "undefined") {
        setLocalStorageItem(key, initialValue);
      }
    }, [key, initialValue]);
    return [store ? JSON.parse(store) : initialValue, setState];
  }

  const SlotIds = {
      RadixUI: "radix-ui-css",
      Tailwind: "tailwind-js",
  };
  const StoreKey = {
      AIPRLTab: "prl-tab",
      PRLTypes: "prl-types",
      PRLConfigs: "prl-field-configs",
      QueryLabelGroups: "query-label-groups",
      NodePrlConfig: (id) => `prl-node-${id}`,
      DocPrlConfig: (id) => `prl-doc-${id}`,
  };

  function useStorageState(value, key) {
      return useLocalStorage(key, value);
  }
  function useImmerStorageState(value, key) {
      const [state, setState] = useStorageState(value, key);
      function update(updater) {
          const newState = JSON.parse(localStorage.getItem(key));
          updater(newState);
          setState(newState);
      }
      return {
          value: state,
          update,
      };
  }
  function useDocId() {
      const docId = React$1.useMemo(() => {
          return location.pathname.split("/").pop();
      }, [location.pathname]);
      return docId;
  }
  const defaultDocState = {
      prlIds: {},
  };
  function useDocState() {
      const docId = useDocId();
      const docState = useImmerStorageState(defaultDocState, StoreKey.DocPrlConfig(docId));
      return docState;
  }

  function useSelectionNodes() {
      const [nodes, setNodes] = React$1.useState([]);
      React$1.useEffect(() => {
          function onClick() {
              if (typeof motiff === "undefined") {
                  return;
              }
              const selectedNodes = motiff.currentPage.selection;
              setNodes(selectedNodes.slice());
          }
          onClick();
          window.addEventListener("click", onClick);
          return () => window.removeEventListener("click", onClick);
      }, []);
      return nodes;
  }

  /**
   * PRL 标注
   */
  function PRLLabel() {
      const selectionNodes = useSelectionNodes();
      const node = selectionNodes[0];
      const [editNode, setEditNode] = React$1.useState(null);
      const [showPRLEditPanel, setShowPRLEditPanel] = React$1.useState(false);
      React$1.useEffect(() => {
          if (!window.isDev)
              return;
          if (node && !editNode) {
              setEditNode(node);
          }
      }, [node, editNode]);
      return (React$1.createElement(React$1.Fragment, null,
          React$1.createElement(Flex, { justify: "between", align: "center" },
              React$1.createElement("div", null,
                  React$1.createElement(Heading, { size: "1" }, "\u9009\u4E2D\u4E00\u4E2A\u56FE\u5C42\uFF0C\u7136\u540E\u70B9\u51FB\u751F\u6210"),
                  React$1.createElement("div", { className: "text-xs text-gray-400 text-ellipsis" }, node ? (React$1.createElement(React$1.Fragment, null,
                      "\u5F53\u524D\u56FE\u5C42\uFF1A",
                      node.type,
                      "[",
                      node.id,
                      "]: ",
                      shortString(node.name, 10))) : (React$1.createElement(React$1.Fragment, null, "\u5F53\u524D\u672A\u9009\u4E2D\u56FE\u5C42")))),
              React$1.createElement(Button, { variant: "soft", onClick: () => { } }, "\u751F\u6210")),
          React$1.createElement(Flex, { justify: "between", align: "center", className: "mt-2" },
              React$1.createElement("div", null,
                  React$1.createElement(Heading, { size: "1" }, "PRL \u5B57\u6BB5"),
                  React$1.createElement("div", { className: "text-xs text-gray-400 text-ellipsis" }, "\u52A8\u6001\u7F16\u8F91\u8868\u5355\u89C4\u5219")),
              React$1.createElement(Button, { onClick: () => {
                      setShowPRLEditPanel(!showPRLEditPanel);
                  }, variant: "soft" }, "\u7F16\u8F91")),
          React$1.createElement("div", { className: "mt-2" }, node && (React$1.createElement(NodeItem, { node: node, onEditNode: (_node) => {
                  setEditNode(_node);
              } }))),
          showPRLEditPanel && (React$1.createElement(PRLFieldsPanel, { onClose: () => setShowPRLEditPanel(false) })),
          editNode && (React$1.createElement(EditPrlFields, { node: editNode, key: editNode.id, onClose: () => setEditNode(null) }))));
  }
  const TagMapper = {
      DOCUMENT: { color: "tomato" },
      PAGE: { color: "red" },
      SLICE: { color: "ruby" },
      FRAME: { color: "crimson" },
      GROUP: { color: "pink" },
      COMPONENT: { color: "plum" },
      INSTANCE: { color: "purple" },
      BOOLEAN_OPERATION: { color: "violet" },
      VECTOR: { color: "iris" },
      STAR: { color: "indigo" },
      LINE: { color: "blue" },
      ELLIPSE: { color: "cyan" },
      POLYGON: { color: "teal" },
      RECTANGLE: { color: "jade" },
      TEXT: { color: "green" },
  };
  function NodeItem(props) {
      const docState = useDocState();
      const isSelected = !!docState.value.prlIds[props.node.id];
      return (React$1.createElement(Flex, { className: "w-full box-border" },
          React$1.createElement(Flex, null, new Array(props.depth ?? 0).fill(0).map((_, i) => {
              return React$1.createElement("div", { key: i, className: "w-3 h-full border-l" });
          })),
          React$1.createElement("div", { className: "flex-1 pt-2" },
              React$1.createElement(Flex, { align: "center", justify: "between", className: "hover:bg-gray-100" },
                  React$1.createElement(Text, { as: "label" },
                      React$1.createElement(Flex, { align: "center" },
                          React$1.createElement("input", { type: "checkbox", checked: isSelected, onChange: (e) => docState.update((state) => (state.prlIds[props.node.id] = e.currentTarget.checked)), className: "mr-1" }),
                          React$1.createElement(Badge, { color: TagMapper[props.node.type].color }, props.node.type),
                          React$1.createElement("div", { className: "ml-2 max-w-[300px] truncate text-xs" }, props.node.name))),
                  React$1.createElement(Button, { size: "1", variant: "soft", onClick: () => {
                          props.onEditNode?.(props.node);
                      } },
                      React$1.createElement(Pencil1Icon, null))),
              props.node.children?.map((child) => (React$1.createElement(NodeItem, { node: child, key: child.id, depth: props.depth ?? 0 + 1, onEditNode: props.onEditNode }))))));
  }
  function EditPrlFields(props) {
      const id = props.node.id;
      const docState = useDocState();
      const isSelected = !!docState.value.prlIds[id];
      // 自动计算出来的值
      const defaultState = React$1.useMemo(() => {
          const name = props.node.name;
          const text = tryRun(() => props.node.characters)[0] ?? name;
          const item = function (value) {
              return { value: value.toString(), disable: false };
          };
          return {
              text: item(text),
              content: item(text),
              width: item(tryRun(() => props.node.width.toFixed(0))[0] ?? 0),
              height: item(tryRun(() => props.node.height.toFixed(0))[0] ?? 0),
          };
      }, [props.node]);
      // 用户设置的值
      const nodeState = useImmerStorageState({ userConfigState: {} }, StoreKey.NodePrlConfig(id));
      const editState = React$1.useMemo(() => {
          return Object.assign({}, defaultState, nodeState.value.userConfigState);
      }, [defaultState, nodeState]);
      const [types, _setTypes] = useStorageState(defaultTypes, StoreKey.PRLTypes);
      function selectThisNode() {
          docState.update((state) => (state.prlIds[id] = true));
      }
      return (React$1.createElement(React$1.Fragment, null,
          React$1.createElement(FloatWindow, { title: props.node.id, position: {
                  right: 800,
                  top: 80,
              }, className: "w-[300px]", onClose: props.onClose },
              React$1.createElement(Flex, { direction: "column", gap: "1" },
                  React$1.createElement(ListItem, { title: props.node.name, subTitle: props.node.id, tail: React$1.createElement(Switch, { checked: isSelected, onClick: () => { } }) }),
                  React$1.createElement(ListItem, { title: "\u5206\u7C7B", subTitle: "PRL \u8BED\u4E49\u5316\u5206\u7C7B", tail: React$1.createElement(Select.Root, { defaultValue: nodeState.value.userConfigState["type"]?.value, onValueChange: (value) => {
                              nodeState.update((state) => {
                                  selectThisNode();
                                  state.userConfigState["type"] = { value, disable: false };
                              });
                          } },
                          React$1.createElement(Select.Trigger, null),
                          React$1.createElement(Select.Content, { style: { zIndex: 9999 } }, types
                              .split(",")
                              .map((v) => v.trim())
                              .map((v, i) => {
                              return (React$1.createElement(Select.Item, { value: v, key: i }, v));
                          }))) }),
                  React$1.createElement(EditPrlPanel, { state: editState, onStateChange: (name, value, disable) => {
                          nodeState.update((state) => {
                              selectThisNode();
                              state.userConfigState[name] = { value, disable };
                          });
                      } }),
                  React$1.createElement("div", { className: "max-w-full p-2 text-xs bg-gray-100 rounded-md" }, Object.entries(editState)
                      .filter(([_, v]) => !v.disable && v.value !== undefined)
                      .map(([k, v]) => {
                      return [k, v.value].join("=");
                  })
                      .join(", "))))));
  }
  const defaultTypes = "StatusBar,NavBar,Lists,ListItem,Card,IconButton,TextButton,Button,Title,Text,Badge,Switch,Supporting Text,Tag,Tabs,TabBars,KingKongArea,Section,Item,Icon,Carousel,Checkbox,Avatar,Divider,Rating,Input";
  const defaultConfigs = `
direction:enum:row,column
text:text:文本内容
content:text:文本描述
justify:enum:start,end,center,space between,space around,stretch
align:enum:start,end,center,baseline,stretch
state:enum:active,inactive,focused
width:text:宽度
height:text:高度
`;
  function PRLFieldsPanel(props) {
      const [types, setTypes] = useStorageState(defaultTypes, StoreKey.PRLTypes);
      const [configs, setConfigs] = useStorageState(defaultConfigs, StoreKey.PRLConfigs);
      return (React$1.createElement(FloatWindow, { position: {
              top: 80,
              right: 800,
          }, onClose: props.onClose, title: "PRL \u5B57\u6BB5\u914D\u7F6E", className: "w-[300px]" },
          React$1.createElement(Heading, { size: "1" }, "\u8282\u70B9\u7C7B\u578B"),
          React$1.createElement(Text, { size: "1", color: "gray" }, "\u4F7F\u7528\u82F1\u6587\u9017\u53F7\u9694\u5F00"),
          React$1.createElement(TextArea, { placeholder: "options1,options2", className: "mt-1 font-mono", size: "1", rows: 5, spellCheck: "false", value: types, onChange: (e) => setTypes(e.currentTarget.value) }),
          React$1.createElement(Heading, { size: "1", className: "my-1" }, "\u9884\u89C8"),
          React$1.createElement(ScrollArea, { className: "h-[70px]", type: "auto" },
              React$1.createElement(Flex, { gap: "1", wrap: "wrap" }, types
                  .split(",")
                  .filter((v) => v.trim())
                  .map((v, i) => {
                  return (React$1.createElement(Badge, { key: i, size: "1" }, v));
              }))),
          React$1.createElement(Heading, { size: "1", className: "mt-2" }, "\u5B57\u6BB5\u5217\u8868"),
          React$1.createElement(Text, { size: "1", color: "gray" }, "\u7528\u6362\u884C\u9694\u5F00\uFF0C\u8BED\u6CD5\uFF1Aname:type:enum1,enum2\uFF0C\u5176\u4E2D type: text,enum"),
          React$1.createElement(TextArea, { className: "mt-1 font-mono", placeholder: "name:type:option1,option1", size: "1", value: configs, rows: 6, spellCheck: "false", onChange: (e) => setConfigs(e.currentTarget.value) }),
          React$1.createElement(Heading, { size: "1", className: "my-1" }, "\u9884\u89C8"),
          React$1.createElement(EditPrlPanel, null)));
  }
  function EditPrlPanel(props) {
      const [configs, _] = useStorageState(defaultConfigs, StoreKey.PRLConfigs);
      return (React$1.createElement("div", { className: "border rounded-md" }, configs
          .split("\n")
          .filter((v) => v)
          .map((c, i) => {
          const [name, type, options] = c.split(":").map((v) => v.trim());
          const items = options?.split(",")?.filter((v) => v) ?? [];
          return (React$1.createElement(EditPrlPanelItem, { disable: props.state?.[name]?.disable, key: i, name: name, type: type, placeholder: options, options: items, raw: c, defaultValue: props.state?.[name]?.value, onChange: props.onStateChange }));
      })));
  }
  function EditPrlPanelItem(props) {
      return (React$1.createElement(Flex, { className: "p-1 border-b last:border-0", align: "center", justify: "between" },
          React$1.createElement(Text, { as: "label" },
              React$1.createElement(Flex, { align: "center", gap: "1" },
                  React$1.createElement("input", { type: "checkbox", checked: !props.disable, onChange: (e) => {
                          props.onChange?.(props.name, props.defaultValue, !e.currentTarget.checked);
                      } }),
                  React$1.createElement(Heading, { size: "1" }, props.name))),
          React$1.createElement(React$1.Fragment, null, props.type === "text" ? (React$1.createElement(TextField.Input, { size: "1", placeholder: props.placeholder, onChange: (e) => props.onChange?.(props.name, e.currentTarget.value, props.disable), defaultValue: props.defaultValue })) : props.type === "enum" ? (React$1.createElement(Select.Root, { defaultValue: props.defaultValue ?? props.options?.[0], size: "1", onValueChange: (value) => props.onChange?.(props.name, value, props.disable) },
              React$1.createElement(Select.Trigger, null),
              React$1.createElement(Select.Content, { style: { zIndex: 99999 } }, props.options?.map((opt, i) => (React$1.createElement(Select.Item, { key: i, value: opt }, opt)))))) : (React$1.createElement("div", null,
              "\u4E0D\u652F\u6301\u7C7B\u522B\uFF1A",
              props.raw)))));
  }

  function QueryLabelPanel() {
      const selectionNodes = useSelectionNodes();
      const docId = useDocId();
      const queryLabelGroups = useImmerStorageState({ groups: [] }, StoreKey.QueryLabelGroups);
      const docState = useDocState();
      return (React$1.createElement(Flex, { gap: "2", direction: "column" },
          React$1.createElement(ListItem, { title: "\u5F53\u524D\u9009\u533A\u5143\u7D20", subTitle: `[${selectionNodes.length}] ${selectionNodes
                .map((node) => `[${node.type}]${shortString(node.name, 4)}`)
                .join("; ")}`, tail: React$1.createElement(Button, { variant: "soft" }, "\u5BFC\u51FA") }),
          React$1.createElement(Button, { variant: "soft", onClick: () => {
                  queryLabelGroups.update((data) => data.groups.push({
                      name: "未命名组",
                      id: randomId(),
                      docId,
                      items: [],
                  }));
              } },
              React$1.createElement(PlusIcon, null),
              " \u65B0\u589E\u4E00\u7EC4\u6807\u6CE8"),
          queryLabelGroups.value.groups.reverse().map((group, i) => {
              return (React$1.createElement(Card, { key: group.id },
                  React$1.createElement(Flex, { direction: "column", gap: "2" },
                      React$1.createElement("div", { className: "grid grid-cols-[auto,1fr,auto,auto] gap-2" },
                          React$1.createElement(Badge, null, queryLabelGroups.value.groups.length - i),
                          React$1.createElement("div", null,
                              React$1.createElement(Heading, { size: "1" },
                                  group.name,
                                  " [",
                                  group.items.length,
                                  " \u4E2A\u5143\u7D20]"),
                              React$1.createElement(Heading, { size: "1" }, group.docId)),
                          React$1.createElement(Flex, { gap: "2" },
                              React$1.createElement(IconButton, { size: "1", variant: "soft", onClick: () => queryLabelGroups.update((data) => {
                                      const targetGroup = data.groups.find((g) => g.id === group.id);
                                      targetGroup.name = prompt("重命名标注组");
                                  }) },
                                  React$1.createElement(Pencil1Icon, null)),
                              React$1.createElement(IconButton, { onClick: () => {
                                      queryLabelGroups.update((data) => {
                                          data.groups = data.groups.filter((_group) => _group.id !== group.id);
                                      });
                                  }, variant: "soft", color: "red", size: "1" },
                                  React$1.createElement(TrashIcon, null))),
                          React$1.createElement(Button, { variant: "soft", size: "1", onClick: () => {
                                  queryLabelGroups.update((data) => {
                                      const targetGroup = data.groups.find((g) => g.id === group.id);
                                      const excludeIds = new Set(targetGroup.items.map((v) => v.id));
                                      targetGroup.items.push(...selectionNodes
                                          .map((node) => ({
                                          name: node.name,
                                          id: node.id,
                                          type: node.type,
                                      }))
                                          .filter((item) => !excludeIds.has(item.id)));
                                  });
                              } },
                              React$1.createElement(PlusIcon, null),
                              " \u6DFB\u52A0\u9009\u533A")),
                      group.items.map((item, j) => {
                          const isPrlNode = !!docState.value.prlIds[item.id];
                          return (React$1.createElement(ListItem, { key: j, title: React$1.createElement(React$1.Fragment, null,
                                  "[",
                                  item.type,
                                  "]",
                                  item.id,
                                  isPrlNode && (React$1.createElement(Badge, { size: "1", ml: "1" }, "PRL"))), subTitle: React$1.createElement("div", { className: "truncate" }, item.name), onClick: () => {
                                  wukong.locate(item.id);
                              }, tail: React$1.createElement(IconButton, { size: "1", variant: "soft", color: "gray", onClick: () => {
                                      queryLabelGroups.update((data) => {
                                          const targetGroup = data.groups.find((g) => g.id === group.id);
                                          targetGroup.items = targetGroup.items.filter((_item) => _item.id !== item.id);
                                      });
                                  } },
                                  React$1.createElement(Cross2Icon, null)) }));
                      }))));
          })));
  }

  function AIPanel() {
      const [prlTab, setPrlTab] = useStorageState("0", StoreKey.AIPRLTab);
      return (React$1.createElement("div", { className: "w-[500px] mt-[-10px]" },
          React$1.createElement(Tabs.Root, { defaultValue: prlTab, onValueChange: setPrlTab },
              React$1.createElement(Tabs.List, { className: "mb-2", size: "1" },
                  React$1.createElement(Tabs.Trigger, { value: "0" }, "PRL \u6807\u6CE8"),
                  React$1.createElement(Tabs.Trigger, { value: "1" }, "\u68C0\u7D22\u6807\u6CE8")),
              React$1.createElement(Tabs.Content, { value: "0" },
                  React$1.createElement(PRLLabel, null)),
              React$1.createElement(Tabs.Content, { value: "1" },
                  React$1.createElement(QueryLabelPanel, null)))));
  }

  function DevPanel(props) {
      const docId = useDocId();
      function openAIPanel() {
          openFloatWindow("ai-prl-pdl", React$1.createElement(AIPanel, null), {
              title: `设计稿标注（${docId}）`,
              position: {
                  top: 80,
                  right: 260,
              },
          });
          props.onClose();
      }
      React$1.useEffect(() => {
          if (window.isDev) {
              openAIPanel();
          }
      }, []);
      return (React$1.createElement(FloatWindow, { title: "Super Wukong", onClose: props.onClose },
          React$1.createElement(Flex, { direction: "column", gap: "2" },
              React$1.createElement(ListItem, { onClick: () => {
                      openAIPanel();
                  }, title: "\u8BBE\u8BA1\u7A3F\u6807\u6CE8", subTitle: "\u67E5\u770B\u9009\u4E2D\u5143\u7D20\u7684 PRL \u548C PDL", className: "group", tail: React$1.createElement(Flex, { gap: "1", className: "group-hover:underline" },
                      "\u542F\u52A8 ",
                      React$1.createElement(ExternalLinkIcon, null)) }))));
  }

  const matches$5 = [
      ".*wukong.yuanfudao.biz/file/*",
      ".*kanyun.motiff.com/file/*",
      ".*staging.motiff.com/file/*",
      ".*beta.motiff.com/file/*",
  ];
  function mountDeps() {
      let link = document.getElementById(SlotIds.RadixUI);
      if (!link) {
          link = document.createElement("link");
          link.id = SlotIds.RadixUI;
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/@radix-ui/themes@2.0.1/styles.css";
          document.head.appendChild(link);
      }
      let script = document.getElementById(SlotIds.Tailwind);
      if (!script) {
          return;
      }
  }
  function Entry$5() {
      const [showPanel, setShowPanel] = React$1.useState(!!window.isDev);
      React$1.useEffect(() => {
          mountDeps();
      }, []);
      return (React$1.createElement(RadixTheme, { style: {
              position: "fixed",
              zIndex: 9999,
              top: 0,
              left: 0,
          } },
          React$1.createElement(Button, { variant: "solid", className: "fixed w-8 h-8 border cursor-pointer bottom-4 right-20", radius: "full", style: { padding: 0 }, onClick: () => {
                  setShowPanel(!showPanel);
              } },
              React$1.createElement(MixIcon, null)),
          showPanel && (React$1.createElement(DevPanel, { onClose: () => {
                  setShowPanel(false);
              } }))));
  }

  var MotiffEditorEntry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Entry: Entry$5,
    matches: matches$5
  });

  const LOGO = "data:image/png;base64,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";
  const message = {
      show(text) {
          GM.notification({ title: "Super Wukong", text: text, image: LOGO });
      },
      hide() { },
  };

  function getReviewLink() {
      const detailDesc = document.querySelector(".detail-page-description");
      const branchLink = detailDesc.querySelector("a[title]");
      const branchText = branchLink.innerText.replaceAll("/", "-");
      window.open(`https://wukong.yuanfudao.biz/review/${branchText}/app/`);
  }
  function getReviewText() {
      const mrTitle = document.querySelector(".page-title");
      const mrReviewer = document.querySelector(".reviewer .sidebar-collapsed-user");
      const titleText = !!mrTitle ? mrTitle.innerText : "";
      const reviewerText = !!mrReviewer
          ? mrReviewer.title
              .split(", ")
              .map((v) => "@" + v)
              .join(" ")
          : "";
      const mrUrl = location.href.match(/.*merge_requests\/\d+/)[0];
      const mrDescDom = document.querySelector(".description > .js-task-list-field");
      !!mrDescDom ? mrDescDom.value : "";
      const approveDom = document.querySelector("div[data-qa-selector=approvals_summary_content]");
      let approveText = "";
      if (approveDom) {
          const approveDomText = approveDom.innerText.toLowerCase();
          approveText = "还需要 " + approveDomText.match(/\d+/) + " 个 approval";
          if (approveDomText.includes("owners") ||
              approveDomText.includes("所有者")) {
              approveText += "\n\n** 需要 code owner 特别授权 **";
          }
      }
      const reviewText = [reviewerText, approveText, titleText, mrUrl]
          .filter((v) => v.length > 0)
          .join("\n\n");
      if (navigator.clipboard) {
          navigator.clipboard.writeText(reviewText);
          message.show("已经复制到剪切板");
      }
      else {
          alert("请允许剪切板访问权限");
      }
      return reviewText;
  }
  function parseCommitsAndInsert() {
      const commits = Array.from(document.getElementsByClassName("commit-content"));
      const text = commits
          .map((v) => {
          if (v.innerText.includes("fixup"))
              return "";
          // @ts-expect-error
          const committer = v.getElementsByClassName("committer")[0].innerText;
          return v.innerText.replace(committer, "");
      })
          .filter((v) => v.length > 0)
          .map((v) => "- " + v)
          .join("");
      const issues = Array.from(text.matchAll(/\[WK-\d+\]/g))
          .map((v) => v[0])
          .filter((v) => !!v)
          .join("");
      const textInput = document.querySelector(".note-textarea");
      textInput.value = text;
      const title = document.getElementById("merge_request_title");
      if (title && !title.value.includes(issues)) {
          title.value = issues;
      }
  }

  const matches$4 = ["https://jihulab.com/yuanli/wukong/-/merge_requests/*"];
  function Entry$4() {
      React$1.useEffect(() => {
          registerEvent$4();
      });
      return React$1.createElement("div", null);
  }
  function registerEvent$4() {
      window.onmousemove = () => {
          if (!window.reviewerMounted) {
              const reviewBtn = document.createElement("div");
              reviewBtn.className =
                  "gl-display-none gl-md-display-block btn gl-button btn-default btn-grouped gl-md-mr-3";
              reviewBtn.onclick = getReviewText;
              reviewBtn.innerText = "复制邀请";
              reviewBtn.title = "点击复制 MR 邀请";
              const linkBtn = document.createElement("div");
              linkBtn.className =
                  "gl-display-none gl-md-display-block btn gl-button btn-default btn-grouped";
              linkBtn.onclick = getReviewLink;
              linkBtn.innerText = "打开预览";
              linkBtn.title = "点击打开预览链接";
              const actions = document.querySelector(".detail-page-header-actions");
              if (actions) {
                  actions.insertBefore(reviewBtn, actions.children[0]);
                  actions.insertBefore(linkBtn, actions.children[0]);
                  window.reviewerMounted = true;
              }
          }
          if (location.href.includes("merge_requests/new") && !window.insertMounted) {
              const insertBtn = document.createElement("div");
              insertBtn.className = "toolbar-text btn gl-button";
              // @ts-expect-error
              insertBtn.style = "float: right";
              insertBtn.innerText = "解析 Commits";
              insertBtn.onclick = parseCommitsAndInsert;
              const toolbar = document.querySelector(".comment-toolbar");
              if (toolbar) {
                  toolbar.appendChild(insertBtn);
                  window.insertMounted = true;
              }
          }
      };
  }

  var ReviewEntry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Entry: Entry$4,
    matches: matches$4
  });

  const matches$3 = ["https://princi.zhenguanyu.com/*"];
  function Entry$3() {
      React$1.useEffect(() => {
          registerEvent$3();
      });
      return React$1.createElement("div", null);
  }
  function registerEvent$3() {
      window.onmousemove = () => {
          if (location.href.includes("task-manage") && !window.generateMounted) {
              const dom = document.querySelector(".task-filter");
              if (dom) {
                  const generateBtn = document.createElement("button");
                  generateBtn.onclick = onGenerateFrogCode;
                  generateBtn.innerText = "生成打点代码";
                  generateBtn.className = "ant-btn ant-btn-primary";
                  dom.style.display = "flex";
                  dom.appendChild(generateBtn);
                  window.generateMounted = true;
              }
          }
      };
  }
  async function onGenerateFrogCode() {
      const taskId = prompt("请输入你要生成的代码的 taskID");
      if (!taskId)
          return;
      // 拉取数据
      let m = message;
      m.show("正在拉取数据");
      const res = await fetch(`https://princi.zhenguanyu.com/pipe-princi/api/v1/newBuryPage/frogs/${taskId}/1?issueId=${taskId}&type=1&isAll=1`);
      const data = await res.json();
      // 生成代码
      function generateCode(items) {
          let code = "export const logs = {\n";
          let events = {};
          items.forEach((item) => {
              if (!events[item.enName]) {
                  events[item.enName] = {};
              }
              let params = "";
              let customExtend = "";
              if (item.paramters && item.paramters.length > 0) {
                  params = "(customExtend: { ";
                  item.paramters.forEach((paramter) => {
                      params += `${paramter.enName}: '${paramter.value
                        .split(",")
                        .join("' | '")}', `;
                  });
                  params = params.slice(0, -2);
                  params += " }) ";
                  customExtend = ", customExtend";
              }
              else {
                  params = "() ";
              }
              events[item.enName][item.eventName] = {
                  params,
                  customExtend,
                  url: item.url,
                  eventType: item.eventType,
              };
          });
          for (let enName in events) {
              code += `  ${enName}: {\n`;
              for (let eventName in events[enName]) {
                  code += `    ${eventName}${events[enName][eventName].params}{
        WKFrog.addFrogRecord({ url: '${events[enName][eventName].url}', eventId: ${items.find((item) => item.enName === enName && item.eventName === eventName).eventId}, eventName: '${eventName}', eventAction: '${events[enName][eventName].eventType}'${events[enName][eventName].customExtend} });
      },\n`;
              }
              code += "  },\n";
          }
          code += "};";
          return code;
      }
      const code = generateCode(data.data);
      copyTextToClipboard(code);
      message.show("生成的代码已经复制到剪切板，直接复制到编辑器即可开始使用");
  }

  var PrinciEntry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Entry: Entry$3,
    matches: matches$3
  });

  function getJiraTicketText() {
      var titleField = document.querySelector('[data-testid="issue.views.issue-base.foundation.summary.heading"]');
      var title = titleField ? titleField.innerText : "";
      var ticketId = window.location.href.match(/WK-\d+/)[0];
      var ticketTypeField = document.querySelector('[data-testid="issue.views.issue-base.foundation.change-issue-type.tooltip--container"]');
      var ticketTypeBtn = ticketTypeField.children[0];
      var type = "feat";
      if (ticketTypeBtn) {
          var label = ticketTypeBtn.getAttribute("aria-label");
          if (label.includes("缺陷") || label.includes("Bug")) {
              type = "fix";
          }
      }
      var jiraTicketText = `${type}: [${ticketId}] ${title}`;
      if (navigator.clipboard) {
          navigator.clipboard.writeText(jiraTicketText);
          message.show("已经复制到剪切板");
      }
      else {
          alert("请允许剪切板访问权限");
      }
  }

  const matches$2 = [
      "https://wkong.atlassian.net/browse/WK-*",
      "https://wkong.atlassian.net/jira/software/c/projects/WK/issues/WK-*"
  ];
  function Entry$2() {
      React$1.useEffect(() => {
          registerEvent$2();
      });
      return React$1.createElement("div", null);
  }
  function registerEvent$2() {
      window.onmousemove = () => {
          let existed = document.getElementById('commit-msg-btn');
          if (!existed) {
              const commitMsgBtn = document.createElement("div");
              commitMsgBtn.style.backgroundColor =
                  "var(--ds-background-neutral, rgba(9, 30, 66, 0.04))"; // 设置按钮的颜色为灰色
              commitMsgBtn.style.marginRight = "10px";
              commitMsgBtn.style.paddingLeft = "6px";
              commitMsgBtn.style.paddingRight = "6px";
              commitMsgBtn.style.height = "32px";
              commitMsgBtn.style.lineHeight = "32px";
              commitMsgBtn.style.fontSize = "inherit";
              commitMsgBtn.style.fontWeight = "500";
              commitMsgBtn.style.cursor = "pointer";
              commitMsgBtn.style.color = "var(--ds-text, #42526E) !important";
              commitMsgBtn.style.boxSizing = "border-box";
              commitMsgBtn.onclick = getJiraTicketText;
              commitMsgBtn.innerText = "获取 Commit 信息";
              commitMsgBtn.title = "点击获取 Commit 信息";
              commitMsgBtn.id = "commit-msg-btn";
              var addAttachmentElement = document.querySelector('[data-testid="issue.issue-view.views.issue-base.foundation.quick-add.quick-add-item.add-attachment"]');
              if (addAttachmentElement) {
                  var toolBar = addAttachmentElement.parentElement.parentElement;
                  if (toolBar) {
                      toolBar.insertBefore(commitMsgBtn, toolBar.children[0]);
                  }
              }
          }
      };
  }

  var JiraCommitEntry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Entry: Entry$2,
    matches: matches$2
  });

  const matches$1 = [
      "^https://wkong.atlassian.net/jira/software/c/projects/WK/boards/26/backlog",
  ];
  function Entry$1() {
      React$1.useEffect(() => {
          registerEvent$1();
      });
      return React$1.createElement("div", null);
  }
  function registerEvent$1() {
      window.onmousemove = () => {
          let existed = document.getElementById('commit-msg-btn');
          if (!existed) {
              const commitMsgBtn = document.createElement("div");
              commitMsgBtn.style.backgroundColor =
                  "var(--ds-background-neutral, rgba(9, 30, 66, 0.04))"; // 设置按钮的颜色为灰色
              commitMsgBtn.style.marginBottom = "10px";
              commitMsgBtn.style.paddingLeft = "6px";
              commitMsgBtn.style.paddingRight = "6px";
              commitMsgBtn.style.width = "95px";
              commitMsgBtn.style.height = "32px";
              commitMsgBtn.style.lineHeight = "32px";
              commitMsgBtn.style.fontSize = "inherit";
              commitMsgBtn.style.fontWeight = "500";
              commitMsgBtn.style.cursor = "pointer";
              commitMsgBtn.style.color = "var(--ds-text, #42526E) !important";
              commitMsgBtn.style.boxSizing = "border-box";
              commitMsgBtn.onclick = getJiraTicketText;
              commitMsgBtn.innerText = "Commit信息";
              commitMsgBtn.title = "Commit信息";
              commitMsgBtn.id = "commit-msg-btn";
              var addAttachmentElement = document.querySelector('[data-testid="issue.views.issue-base.foundation.status.actions-wrapper"]');
              if (addAttachmentElement) {
                  var toolBar = addAttachmentElement.parentElement;
                  if (toolBar) {
                      toolBar.prepend(commitMsgBtn);
                  }
              }
          }
      };
  }

  var JiraBackLogCommitEntry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Entry: Entry$1,
    matches: matches$1
  });

  const matches = [
      "^https://wkong.atlassian.net/jira/software/c/projects/WK/boards/26\\?assignee"
  ];
  function Entry() {
      React$1.useEffect(() => {
          registerEvent();
      });
      return React$1.createElement("div", null);
  }
  function registerEvent() {
      window.onmousemove = () => {
          let existed = document.getElementById('commit-msg-btn');
          if (!existed) {
              const commitMsgBtn = document.createElement("div");
              commitMsgBtn.style.backgroundColor =
                  "var(--ds-background-neutral, rgba(9, 30, 66, 0.04))"; // 设置按钮的颜色为灰色
              commitMsgBtn.style.marginRight = "10px";
              commitMsgBtn.style.paddingLeft = "6px";
              commitMsgBtn.style.paddingRight = "6px";
              commitMsgBtn.style.height = "32px";
              commitMsgBtn.style.lineHeight = "32px";
              commitMsgBtn.style.fontSize = "inherit";
              commitMsgBtn.style.fontWeight = "500";
              commitMsgBtn.style.cursor = "pointer";
              commitMsgBtn.style.color = "var(--ds-text, #42526E) !important";
              commitMsgBtn.style.boxSizing = "border-box";
              commitMsgBtn.onclick = getJiraTicketText;
              commitMsgBtn.innerText = "获取 Commit 信息";
              commitMsgBtn.title = "点击获取 Commit 信息";
              commitMsgBtn.id = "commit-msg-btn";
              var addAttachmentElement = document.querySelector('[data-testid="issue.issue-view.views.issue-base.foundation.quick-add.quick-add-item.add-attachment"]');
              if (addAttachmentElement) {
                  var toolBar = addAttachmentElement.parentElement.parentElement;
                  if (toolBar) {
                      toolBar.insertBefore(commitMsgBtn, toolBar.children[0]);
                  }
              }
          }
      };
  }

  var JiraAssigneeCommitEntry = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Entry: Entry,
    matches: matches
  });

  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;
    if (!css || typeof document === 'undefined') {
      return;
    }
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = "/*\n! tailwindcss v3.3.5 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n5. Use the user's configured `sans` font-feature-settings by default.\n6. Use the user's configured `sans` font-variation-settings by default.\n*/\n\nhtml {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden] {\n  display: none;\n}\n\n*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n.fixed {\n  position: fixed;\n}\n.bottom-4 {\n  bottom: 1rem;\n}\n.right-20 {\n  right: 5rem;\n}\n.my-1 {\n  margin-top: 0.25rem;\n  margin-bottom: 0.25rem;\n}\n.mb-2 {\n  margin-bottom: 0.5rem;\n}\n.ml-2 {\n  margin-left: 0.5rem;\n}\n.mr-1 {\n  margin-right: 0.25rem;\n}\n.mt-1 {\n  margin-top: 0.25rem;\n}\n.mt-2 {\n  margin-top: 0.5rem;\n}\n.mt-\\[-10px\\] {\n  margin-top: -10px;\n}\n.box-border {\n  box-sizing: border-box;\n}\n.flex {\n  display: flex;\n}\n.grid {\n  display: grid;\n}\n.h-8 {\n  height: 2rem;\n}\n.h-\\[70px\\] {\n  height: 70px;\n}\n.h-full {\n  height: 100%;\n}\n.max-h-\\[90vh\\] {\n  max-height: 90vh;\n}\n.min-h-\\[200px\\] {\n  min-height: 200px;\n}\n.w-3 {\n  width: 0.75rem;\n}\n.w-8 {\n  width: 2rem;\n}\n.w-\\[300px\\] {\n  width: 300px;\n}\n.w-\\[500px\\] {\n  width: 500px;\n}\n.w-full {\n  width: 100%;\n}\n.min-w-\\[268px\\] {\n  min-width: 268px;\n}\n.max-w-\\[300px\\] {\n  max-width: 300px;\n}\n.max-w-full {\n  max-width: 100%;\n}\n.flex-1 {\n  flex: 1 1 0%;\n}\n.cursor-move {\n  cursor: move;\n}\n.cursor-pointer {\n  cursor: pointer;\n}\n.grid-cols-\\[auto\\2c 1fr\\2c auto\\2c auto\\] {\n  grid-template-columns: auto 1fr auto auto;\n}\n.flex-col {\n  flex-direction: column;\n}\n.items-center {\n  align-items: center;\n}\n.gap-2 {\n  gap: 0.5rem;\n}\n.overflow-hidden {\n  overflow: hidden;\n}\n.truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.text-ellipsis {\n  text-overflow: ellipsis;\n}\n.rounded-lg {\n  border-radius: 0.5rem;\n}\n.rounded-md {\n  border-radius: 0.375rem;\n}\n.border {\n  border-width: 1px;\n}\n.border-b {\n  border-bottom-width: 1px;\n}\n.border-l {\n  border-left-width: 1px;\n}\n.bg-gray-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.p-1 {\n  padding: 0.25rem;\n}\n.p-2 {\n  padding: 0.5rem;\n}\n.p-3 {\n  padding: 0.75rem;\n}\n.pt-2 {\n  padding-top: 0.5rem;\n}\n.font-mono {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n}\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.font-bold {\n  font-weight: 700;\n}\n.text-black {\n  --tw-text-opacity: 1;\n  color: rgb(0 0 0 / var(--tw-text-opacity));\n}\n.text-gray-400 {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n.shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-sm {\n  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n.last\\:border-0:last-child {\n  border-width: 0px;\n}\n.hover\\:bg-gray-100:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\n.group:hover .group-hover\\:underline {\n  text-decoration-line: underline;\n}\n";
  styleInject(css_248z);

  const entries = [
      MotiffEditorEntry,
      ReviewEntry,
      PrinciEntry,
      JiraCommitEntry,
      JiraBackLogCommitEntry,
      JiraAssigneeCommitEntry,
  ];
  function GlobalEntry() {
      for (const e of entries) {
          const someMatched = e.matches.some((s) => new RegExp(s).test(location.href));
          if (someMatched) {
              return e.Entry();
          }
      }
      return null;
  }

  if (window.unmountRootCallbacks) {
    window.unmountRootCallbacks.forEach(cb => {
      cb();
    });
    window.unmountRootCallbacks.clear();
  } else {
    window.unmountRootCallbacks = window.unmountRootCallbacks || new Set();
  }
  function getOrCreateDom(id = "super-wukong-root") {
    let dom = document.getElementById(id);
    if (dom) {
      dom.remove();
    }
    dom = document.createElement("div");
    dom.id = id;
    document.body.appendChild(dom);
    return dom;
  }
  const root = globalCreateRoot(getOrCreateDom());
  root.render( /*#__PURE__*/React.createElement(GlobalEntry, null));

})(React, ReactDOM);
