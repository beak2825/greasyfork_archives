// ==UserScript==
// @name          react-shadow-root-umd
// @namespace     flomk.userscripts
// @version       6.2.0
// @description   UMD of react-shadow-root
// @author        flomk
// ==/UserScript==
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-dom'), require('prop-types')) :
    typeof define === 'function' && define.amd ? define(['react', 'react-dom', 'prop-types'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ReactShadowRoot = factory(global.React, global.ReactDOM, global.PropTypes));
})(this, (function (__0$, __1$, __2$) { 'use strict';

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

    var __0$__namespace = /*#__PURE__*/_interopNamespaceDefault(__0$);
    var __1$__namespace = /*#__PURE__*/_interopNamespaceDefault(__1$);
    var __2$__namespace = /*#__PURE__*/_interopNamespaceDefault(__2$);

    /* esm.sh - esbuild bundle(react-shadow-root@6.2.0) es2022 development */
    var require=n=>{const e=m=>typeof m.default<"u"?m.default:m;switch(n){case"react":return e(__0$__namespace);case"react-dom":return e(__1$__namespace);case"prop-types":return e(__2$__namespace);default:throw new Error("module \""+n+"\" not found");}};
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
        get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
    }) : x)(function(x) {
        if (typeof require !== "undefined")
            return require.apply(this, arguments);
        throw Error('Dynamic require of "' + x + '" is not supported');
    });
    var __commonJS = (cb, mod) => function __require2() {
        return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    };
    var __export = (target, all) => {
        for (var name in all)
            __defProp(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
            for (let key of __getOwnPropNames(from))
                if (!__hasOwnProp.call(to, key) && key !== except)
                    __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
    };
    var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget);
    var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
        mod
    ));

    // ../esmd/npm/react-shadow-root@6.2.0/node_modules/.pnpm/react-shadow-root@6.2.0_prop-types@15.8.1_react-dom@18.3.1_react@18.3.1/node_modules/react-shadow-root/lib/ReactShadowRoot.js
    var require_ReactShadowRoot = __commonJS({
        "../esmd/npm/react-shadow-root@6.2.0/node_modules/.pnpm/react-shadow-root@6.2.0_prop-types@15.8.1_react-dom@18.3.1_react@18.3.1/node_modules/react-shadow-root/lib/ReactShadowRoot.js"(exports) {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = void 0;
            var _react = _interopRequireDefault(__require("react"));
            var _reactDom = _interopRequireDefault(__require("react-dom"));
            var _propTypes = _interopRequireDefault(__require("prop-types"));
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { "default": obj };
            }
            function _typeof(obj) {
                "@babel/helpers - typeof";
                if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
                    _typeof = function _typeof2(obj2) {
                        return typeof obj2;
                    };
                } else {
                    _typeof = function _typeof2(obj2) {
                        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
                    };
                }
                return _typeof(obj);
            }
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
                    if ("value" in descriptor)
                        descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            function _createClass(Constructor, protoProps, staticProps) {
                if (protoProps)
                    _defineProperties(Constructor.prototype, protoProps);
                return Constructor;
            }
            function _createSuper(Derived) {
                return function() {
                    var Super = _getPrototypeOf(Derived), result;
                    if (_isNativeReflectConstruct()) {
                        var NewTarget = _getPrototypeOf(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else {
                        result = Super.apply(this, arguments);
                    }
                    return _possibleConstructorReturn(this, result);
                };
            }
            function _possibleConstructorReturn(self, call) {
                if (call && (_typeof(call) === "object" || typeof call === "function")) {
                    return call;
                }
                return _assertThisInitialized(self);
            }
            function _assertThisInitialized(self) {
                if (self === void 0) {
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                }
                return self;
            }
            function _isNativeReflectConstruct() {
                if (typeof Reflect === "undefined" || !Reflect.construct)
                    return false;
                if (Reflect.construct.sham)
                    return false;
                if (typeof Proxy === "function")
                    return true;
                try {
                    Date.prototype.toString.call(Reflect.construct(Date, [], function() {
                    }));
                    return true;
                } catch (e) {
                    return false;
                }
            }
            function _getPrototypeOf(o) {
                _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
                    return o2.__proto__ || Object.getPrototypeOf(o2);
                };
                return _getPrototypeOf(o);
            }
            function _inherits(subClass, superClass) {
                if (typeof superClass !== "function" && superClass !== null) {
                    throw new TypeError("Super expression must either be null or a function");
                }
                subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
                if (superClass)
                    _setPrototypeOf(subClass, superClass);
            }
            function _setPrototypeOf(o, p) {
                _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
                    o2.__proto__ = p2;
                    return o2;
                };
                return _setPrototypeOf(o, p);
            }
            function _defineProperty(obj, key, value) {
                if (key in obj) {
                    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
                } else {
                    obj[key] = value;
                }
                return obj;
            }
            var constructableStylesheetsSupported = typeof window !== "undefined" && window.ShadowRoot && window.ShadowRoot.prototype.hasOwnProperty("adoptedStyleSheets") && window.CSSStyleSheet && window.CSSStyleSheet.prototype.hasOwnProperty("replace");
            var shadowRootSupported = typeof window !== "undefined" && window.Element && window.Element.prototype.hasOwnProperty("attachShadow");
            var _default = /* @__PURE__ */ function(_React$PureComponent) {
                _inherits(_default2, _React$PureComponent);
                var _super = _createSuper(_default2);
                function _default2(props) {
                    var _this;
                    _classCallCheck(this, _default2);
                    _this = _super.call(this, props);
                    _defineProperty(_assertThisInitialized(_this), "state", {
                        initialized: false
                    });
                    _this.placeholder = _react["default"].createRef();
                    return _this;
                }
                _createClass(_default2, [{
                    key: "componentDidMount",
                    value: function componentDidMount() {
                        var _this$props = this.props, delegatesFocus = _this$props.delegatesFocus, mode = _this$props.mode, stylesheets = _this$props.stylesheets;
                        this.shadowRoot = this.placeholder.current.parentNode.attachShadow({
                            delegatesFocus,
                            mode
                        });
                        if (stylesheets) {
                            this.shadowRoot.adoptedStyleSheets = stylesheets;
                        }
                        this.setState({
                            initialized: true
                        });
                    }
                }, {
                    key: "render",
                    value: function render() {
                        if (!this.state.initialized) {
                            if (this.props.declarative) {
                                return /* @__PURE__ */ _react["default"].createElement("template", {
                                    ref: this.placeholder,
                                    shadowroot: this.props.mode
                                }, this.props.children);
                            }
                            return /* @__PURE__ */ _react["default"].createElement("span", {
                                ref: this.placeholder
                            });
                        }
                        return _reactDom["default"].createPortal(this.props.children, this.shadowRoot);
                    }
                }]);
                return _default2;
            }(_react["default"].PureComponent);
            exports["default"] = _default;
            _defineProperty(_default, "constructableStylesheetsSupported", constructableStylesheetsSupported);
            _defineProperty(_default, "constructibleStylesheetsSupported", constructableStylesheetsSupported);
            _defineProperty(_default, "defaultProps", {
                declarative: false,
                delegatesFocus: false,
                mode: "open"
            });
            _defineProperty(_default, "displayName", "ReactShadowRoot");
            _defineProperty(_default, "propTypes", {
                declarative: _propTypes["default"].bool,
                delegatesFocus: _propTypes["default"].bool,
                mode: _propTypes["default"].oneOf(["open", "closed"]),
                stylesheets: _propTypes["default"].arrayOf(typeof window !== "undefined" ? _propTypes["default"].instanceOf(window.CSSStyleSheet) : _propTypes["default"].any)
            });
            _defineProperty(_default, "shadowRootSupported", shadowRootSupported);
        }
    });

    // ../esmd/npm/react-shadow-root@6.2.0/node_modules/.pnpm/react-shadow-root@6.2.0_prop-types@15.8.1_react-dom@18.3.1_react@18.3.1/node_modules/react-shadow-root/lib/index.js
    var require_lib = __commonJS({
        "../esmd/npm/react-shadow-root@6.2.0/node_modules/.pnpm/react-shadow-root@6.2.0_prop-types@15.8.1_react-dom@18.3.1_react@18.3.1/node_modules/react-shadow-root/lib/index.js"(exports) {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = void 0;
            var _ReactShadowRoot = _interopRequireDefault(require_ReactShadowRoot());
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { "default": obj };
            }
            var _default = _ReactShadowRoot["default"];
            exports["default"] = _default;
        }
    });

    // ../esmd/npm/react-shadow-root@6.2.0/build.js
    var build_exports = {};
    __export(build_exports, {
        __esModule: () => __esModule,
        default: () => build_default
    });
    var __module = __toESM(require_lib());
    __reExport(build_exports, __toESM(require_lib()));
    var { __esModule } = __module;
    var { default: __default, ...__rest } = __module;
    var build_default = __default !== void 0 ? __default : __rest;

    return build_default;

}));