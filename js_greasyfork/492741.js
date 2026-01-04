// ==UserScript==
// @name         Plan Coordinates NG
// @namespace    npm/vite-plugin-monkey
// @version      0.0.1
// @author       Fabio Tea <iam@f4b.io> (iam.f4b.io)
// @description  A userscript to make show the coordinates of the picture-elements in HomeAssistant
// @license      MIT
// @icon         https://cdn.imgchest.com/files/d7ogcv26wwy.png
// @match        http://homeassistant.local:8123/*
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7.9
// @require      https://cdn.jsdelivr.net/npm/shadow-dom-selector@4.1.2
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/492741/Plan%20Coordinates%20NG.user.js
// @updateURL https://update.greasyfork.org/scripts/492741/Plan%20Coordinates%20NG.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*! @gera2ld/jsx-dom v2.2.2 | ISC License */
  const VTYPE_ELEMENT = 1;
  const VTYPE_FUNCTION = 2;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const XLINK_NS = "http://www.w3.org/1999/xlink";
  const NS_ATTRS = {
    show: XLINK_NS,
    actuate: XLINK_NS,
    href: XLINK_NS
  };
  const isLeaf = (c2) => typeof c2 === "string" || typeof c2 === "number";
  const isElement = (c2) => (c2 == null ? void 0 : c2.vtype) === VTYPE_ELEMENT;
  const isRenderFunction = (c2) => (c2 == null ? void 0 : c2.vtype) === VTYPE_FUNCTION;
  function h$1(type, props, ...children) {
    props = Object.assign({}, props, {
      children: children.length === 1 ? children[0] : children
    });
    return jsx(type, props);
  }
  function jsx(type, props) {
    let vtype;
    if (typeof type === "string")
      vtype = VTYPE_ELEMENT;
    else if (typeof type === "function")
      vtype = VTYPE_FUNCTION;
    else
      throw new Error("Invalid VNode type");
    return {
      vtype,
      type,
      props
    };
  }
  function Fragment(props) {
    return props.children;
  }
  const DEFAULT_ENV = {
    isSvg: false
  };
  function insertDom(parent, nodes) {
    if (!Array.isArray(nodes))
      nodes = [nodes];
    nodes = nodes.filter(Boolean);
    if (nodes.length)
      parent.append(...nodes);
  }
  function mountAttributes(domElement, props, env) {
    for (const key in props) {
      if (key === "key" || key === "children" || key === "ref")
        continue;
      if (key === "dangerouslySetInnerHTML") {
        domElement.innerHTML = props[key].__html;
      } else if (key === "innerHTML" || key === "textContent" || key === "innerText" || key === "value" && ["textarea", "select"].includes(domElement.tagName)) {
        const value = props[key];
        if (value != null)
          domElement[key] = value;
      } else if (key.startsWith("on")) {
        domElement[key.toLowerCase()] = props[key];
      } else {
        setDOMAttribute(domElement, key, props[key], env.isSvg);
      }
    }
  }
  const attrMap = {
    className: "class",
    labelFor: "for"
  };
  function setDOMAttribute(el, attr, value, isSVG) {
    attr = attrMap[attr] || attr;
    if (value === true) {
      el.setAttribute(attr, "");
    } else if (value === false) {
      el.removeAttribute(attr);
    } else {
      const namespace = isSVG ? NS_ATTRS[attr] : void 0;
      if (namespace !== void 0) {
        el.setAttributeNS(namespace, attr, value);
      } else {
        el.setAttribute(attr, value);
      }
    }
  }
  function flatten(arr) {
    return arr.reduce((prev, item) => prev.concat(item), []);
  }
  function mountChildren(children, env) {
    return Array.isArray(children) ? flatten(children.map((child) => mountChildren(child, env))) : mount(children, env);
  }
  function mount(vnode, env = DEFAULT_ENV) {
    if (vnode == null || typeof vnode === "boolean") {
      return null;
    }
    if (vnode instanceof Node) {
      return vnode;
    }
    if (isRenderFunction(vnode)) {
      const {
        type,
        props
      } = vnode;
      if (type === Fragment) {
        const node = document.createDocumentFragment();
        if (props.children) {
          const children = mountChildren(props.children, env);
          insertDom(node, children);
        }
        return node;
      }
      const childVNode = type(props);
      return mount(childVNode, env);
    }
    if (isLeaf(vnode)) {
      return document.createTextNode(`${vnode}`);
    }
    if (isElement(vnode)) {
      let node;
      const {
        type,
        props
      } = vnode;
      if (!env.isSvg && type === "svg") {
        env = Object.assign({}, env, {
          isSvg: true
        });
      }
      if (!env.isSvg) {
        node = document.createElement(type);
      } else {
        node = document.createElementNS(SVG_NS, type);
      }
      mountAttributes(node, props, env);
      if (props.children) {
        let childEnv = env;
        if (env.isSvg && type === "foreignObject") {
          childEnv = Object.assign({}, childEnv, {
            isSvg: false
          });
        }
        const children = mountChildren(props.children, childEnv);
        if (children != null)
          insertDom(node, children);
      }
      const {
        ref
      } = props;
      if (typeof ref === "function")
        ref(node);
      return node;
    }
    throw new Error("mount: Invalid Vnode!");
  }
  function mountDom(vnode) {
    return mount(vnode);
  }
  function hm(...args) {
    return mountDom(h$1(...args));
  }
  /*! @violentmonkey/dom@2.1.7 | ISC License */
  var _VM$1;
  Object.assign(typeof VM !== "undefined" && ((_VM$1 = VM) == null ? void 0 : _VM$1.versions) || {}, {
    dom: "2.1.7"
  });
  function observe(node, callback, options) {
    const observer = new MutationObserver((mutations, ob) => {
      const result = callback(mutations, ob);
      if (result)
        disconnect();
    });
    observer.observe(node, Object.assign({
      childList: true,
      subtree: true
    }, options));
    const disconnect = () => observer.disconnect();
    return disconnect;
  }
  /*! @violentmonkey/ui v0.7.9 | ISC License */
  var css_248z = ":host{all:initial;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,sans-serif;font-size:16px;line-height:1.5}";
  var themes = { "dark": "vmui-jkiNs1", "light": "vmui-aBcXBX" };
  var stylesheet$2 = ".vmui-jkiNs1{background:rgba(0,0,0,.8);border:1px solid #333;box-shadow:0 0 8px #333;color:#fff}.vmui-aBcXBX{background:#fff;border:1px solid #ddd;box-shadow:0 0 8px #ddd;color:#333}";
  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
      for (var i2 = 1; i2 < arguments.length; i2++) {
        var source = arguments[i2];
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
  class Movable {
    constructor(el, options) {
      this.onMouseDown = (e2) => {
        e2.preventDefault();
        e2.stopPropagation();
        const {
          x,
          y: y2
        } = this.el.getBoundingClientRect();
        const {
          clientX,
          clientY
        } = e2;
        this.dragging = {
          x: clientX - x,
          y: clientY - y2
        };
        document.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("mouseup", this.onMouseUp);
      };
      this.onMouseMove = (e2) => {
        if (!this.dragging)
          return;
        const {
          x,
          y: y2
        } = this.dragging;
        const {
          clientX,
          clientY
        } = e2;
        const position = {
          top: "auto",
          left: "auto",
          right: "auto",
          bottom: "auto"
        };
        const {
          clientWidth,
          clientHeight
        } = document.documentElement;
        const width = this.el.offsetWidth;
        const height = this.el.offsetHeight;
        const left = Math.min(clientWidth - width, Math.max(0, clientX - x));
        const top = Math.min(clientHeight - height, Math.max(0, clientY - y2));
        const {
          origin
        } = this.options;
        if (origin.x === "start" || origin.x === "auto" && left + left + width < clientWidth) {
          position.left = `${left}px`;
        } else {
          position.right = `${clientWidth - left - width}px`;
        }
        if (origin.y === "start" || origin.y === "auto" && top + top + height < clientHeight) {
          position.top = `${top}px`;
        } else {
          position.bottom = `${clientHeight - top - height}px`;
        }
        Object.assign(this.el.style, position);
      };
      this.onMouseUp = () => {
        var _this$options$onMoved, _this$options;
        this.dragging = null;
        document.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("mouseup", this.onMouseUp);
        (_this$options$onMoved = (_this$options = this.options).onMoved) == null || _this$options$onMoved.call(_this$options);
      };
      this.el = el;
      this.setOptions(options);
    }
    setOptions(options) {
      this.options = _extends({}, Movable.defaultOptions, options);
    }
    enable() {
      this.el.addEventListener("mousedown", this.onMouseDown);
    }
    disable() {
      this.dragging = void 0;
      this.el.removeEventListener("mousedown", this.onMouseDown);
      document.removeEventListener("mousemove", this.onMouseMove);
      document.removeEventListener("mouseup", this.onMouseUp);
    }
  }
  Movable.defaultOptions = {
    origin: {
      x: "auto",
      y: "auto"
    }
  };
  function getHostElement(shadow = true) {
    const id = getUniqueId("vmui-");
    const host = mountDom(h$1(id, {
      id
    }));
    let root;
    if (shadow) {
      root = host.attachShadow({
        mode: "open"
      });
    } else {
      root = mountDom(h$1(id, {}));
      host.append(root);
    }
    const styles2 = [];
    const addStyle = (css) => {
      if (!shadow && typeof GM_addStyle === "function") {
        styles2.push(GM_addStyle(css.replace(/:host\b/g, `#${id} `)));
      } else {
        root.append(mountDom(VM.h("style", null, css)));
      }
    };
    const dispose = () => {
      host.remove();
      styles2.forEach((style) => style.remove());
    };
    addStyle(css_248z);
    const result = {
      id,
      tag: "VM.getHostElement",
      shadow,
      host,
      root,
      addStyle,
      dispose,
      show() {
        appendToBody(this.tag, this.host);
      },
      hide() {
        this.host.remove();
      }
    };
    return result;
  }
  function appendToBody(tag, ...children) {
    if (!document.body) {
      console.warn(`[${tag}] document.body is not ready yet, operation skipped.`);
      return;
    }
    document.body.append(...children);
  }
  function getUniqueId(prefix = "") {
    return prefix + Math.random().toString(36).slice(2, 8);
  }
  function classNames(names) {
    return names.filter(Boolean).join(" ");
  }
  var styles$1 = { "toast": "vmui-MNVqs0" };
  var stylesheet$1 = ".vmui-MNVqs0{left:50%;padding:8px 16px;position:fixed;top:50%;transform:translate(-50%,-50%);z-index:10000}";
  function showToast(content, options) {
    options = _extends({
      duration: 2e3,
      shadow: true,
      theme: "light",
      beforeEnter: defaultBeforeEnter,
      beforeClose: defaultBeforeClose
    }, options);
    const hostElem = getHostElement(options.shadow);
    const {
      dispose,
      addStyle
    } = hostElem;
    const body = mountDom(VM.h(hostElem.id, {
      className: classNames([styles$1.toast, themes[options.theme], options.className])
    }, content));
    hostElem.root.append(body);
    let {
      style
    } = options;
    if (typeof style === "function")
      style = style(hostElem.id);
    addStyle([stylesheet$1, stylesheet$2, style].filter(Boolean).join("\n"));
    let closed = false;
    const result = _extends({}, hostElem, {
      tag: "VM.showToast",
      body,
      close
    });
    result.show();
    (async () => {
      await (options.beforeEnter == null ? void 0 : options.beforeEnter(result));
      if (options.duration) {
        setTimeout(close, options.duration);
      }
    })();
    return result;
    async function close() {
      if (closed)
        return;
      closed = true;
      await (options.beforeClose == null ? void 0 : options.beforeClose(result));
      dispose();
    }
  }
  async function defaultBeforeEnter(result) {
    const {
      body
    } = result;
    body.style.transition = "opacity .2s";
    body.style.opacity = "0";
    await sleep(0);
    body.style.opacity = "1";
    await sleep(200);
  }
  async function defaultBeforeClose(result) {
    const {
      body
    } = result;
    body.style.transition = "opacity .2s";
    body.style.opacity = "0";
    await sleep(200);
  }
  async function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  var styles = { "panel": "vmui-pliUr-", "body": "vmui-I3r6A8" };
  var stylesheet = ".vmui-pliUr-{color:#333;position:fixed;z-index:10000}.vmui-I3r6A8{display:block;padding:8px;position:relative;word-break:break-word}";
  function getPanel(options) {
    options = _extends({
      shadow: true,
      theme: "light"
    }, options);
    const hostElem = getHostElement(options.shadow);
    const body = mountDom(VM.h(hostElem.id, {
      className: classNames([styles.body, themes[options.theme]])
    }));
    const wrapper = mountDom(VM.h(hostElem.id, {
      className: classNames([styles.panel, options.className])
    }, body));
    let {
      style
    } = options;
    if (typeof style === "function")
      style = style(hostElem.id);
    hostElem.addStyle([stylesheet, stylesheet$2, style].filter(Boolean).join("\n"));
    hostElem.root.append(wrapper);
    const clear = () => {
      while (body.firstChild)
        body.firstChild.remove();
    };
    const append = (...args) => {
      body.append(...args.map(mountDom).filter(Boolean));
    };
    const setContent = (...args) => {
      clear();
      append(...args);
    };
    if (options.content)
      setContent(options.content);
    let movable;
    const setMovable = (toggle, options2) => {
      movable || (movable = new Movable(wrapper));
      if (options2)
        movable.setOptions(options2);
      if (toggle) {
        movable.enable();
      } else {
        movable.disable();
      }
    };
    return _extends({}, hostElem, {
      tag: "VM.getPanel",
      wrapper,
      body,
      clear,
      append,
      setContent,
      setMovable
    });
  }
  var _VM, _VM2;
  Object.assign(typeof VM !== "undefined" && ((_VM = VM) == null ? void 0 : _VM.versions) || {}, {
    ui: "0.7.9"
  });
  if (typeof VM === "undefined" || ((_VM2 = VM) == null || (_VM2 = _VM2.versions) == null || (_VM2 = _VM2.dom) == null ? void 0 : _VM2.split(".")[0]) !== "2") {
    throw new Error(`[VM-UI] @violentmonkey/dom@2 is required
Please include following code in your metadata:

// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7.9
`);
  }
  var n = function() {
    return n = Object.assign || function(n2) {
      for (var t2, e2 = 1, r2 = arguments.length; e2 < r2; e2++)
        for (var o2 in t2 = arguments[e2])
          Object.prototype.hasOwnProperty.call(t2, o2) && (n2[o2] = t2[o2]);
      return n2;
    }, n.apply(this, arguments);
  };
  function t(n2, t2, e2, r2) {
    return new (e2 || (e2 = Promise))(function(o2, u2) {
      function i2(n3) {
        try {
          c2(r2.next(n3));
        } catch (n4) {
          u2(n4);
        }
      }
      function a2(n3) {
        try {
          c2(r2.throw(n3));
        } catch (n4) {
          u2(n4);
        }
      }
      function c2(n3) {
        var t3;
        n3.done ? o2(n3.value) : (t3 = n3.value, t3 instanceof e2 ? t3 : new e2(function(n4) {
          n4(t3);
        })).then(i2, a2);
      }
      c2((r2 = r2.apply(n2, t2 || [])).next());
    });
  }
  function e(n2, t2) {
    var e2, r2, o2, u2, i2 = { label: 0, sent: function() {
      if (1 & o2[0])
        throw o2[1];
      return o2[1];
    }, trys: [], ops: [] };
    return u2 = { next: a2(0), throw: a2(1), return: a2(2) }, "function" == typeof Symbol && (u2[Symbol.iterator] = function() {
      return this;
    }), u2;
    function a2(a3) {
      return function(c2) {
        return function(a4) {
          if (e2)
            throw new TypeError("Generator is already executing.");
          for (; u2 && (u2 = 0, a4[0] && (i2 = 0)), i2; )
            try {
              if (e2 = 1, r2 && (o2 = 2 & a4[0] ? r2.return : a4[0] ? r2.throw || ((o2 = r2.return) && o2.call(r2), 0) : r2.next) && !(o2 = o2.call(r2, a4[1])).done)
                return o2;
              switch (r2 = 0, o2 && (a4 = [2 & a4[0], o2.value]), a4[0]) {
                case 0:
                case 1:
                  o2 = a4;
                  break;
                case 4:
                  return i2.label++, { value: a4[1], done: false };
                case 5:
                  i2.label++, r2 = a4[1], a4 = [0];
                  continue;
                case 7:
                  a4 = i2.ops.pop(), i2.trys.pop();
                  continue;
                default:
                  if (!(o2 = i2.trys, (o2 = o2.length > 0 && o2[o2.length - 1]) || 6 !== a4[0] && 2 !== a4[0])) {
                    i2 = 0;
                    continue;
                  }
                  if (3 === a4[0] && (!o2 || a4[1] > o2[0] && a4[1] < o2[3])) {
                    i2.label = a4[1];
                    break;
                  }
                  if (6 === a4[0] && i2.label < o2[1]) {
                    i2.label = o2[1], o2 = a4;
                    break;
                  }
                  if (o2 && i2.label < o2[2]) {
                    i2.label = o2[2], i2.ops.push(a4);
                    break;
                  }
                  o2[2] && i2.ops.pop(), i2.trys.pop();
                  continue;
              }
              a4 = t2.call(n2, i2);
            } catch (n3) {
              a4 = [6, n3], r2 = 0;
            } finally {
              e2 = o2 = 0;
            }
          if (5 & a4[0])
            throw a4[1];
          return { value: a4[0] ? a4[1] : void 0, done: true };
        }([a3, c2]);
      };
    }
  }
  "function" == typeof SuppressedError && SuppressedError;
  var r = "$", o = ":host", u = "invalid selector", i = 10, a = 10, c = function(n2) {
    var t2, e2 = n2[0], r2 = n2[1];
    return (t2 = e2) && (t2 instanceof Document || t2 instanceof Element || t2 instanceof ShadowRoot) && "string" == typeof r2;
  };
  function l(n2, t2) {
    return function(n3) {
      return n3.split(",").map(function(n4) {
        return n4.trim();
      });
    }(n2).map(function(n3) {
      var e2 = function(n4) {
        return n4.split(r).map(function(n5) {
          return n5.trim();
        });
      }(n3);
      return t2(e2);
    });
  }
  var s = function(n2, t2, e2, r2) {
    return new Promise(function(o2) {
      var u2 = 0, i2 = function() {
        var a2 = n2();
        t2(a2) ? o2(a2) : ++u2 < e2 ? setTimeout(i2, r2) : o2(a2);
      };
      i2();
    });
  };
  function f(n2, t2) {
    var e2 = t2 ? " If you want to select a shadowRoot, use ".concat(t2, " instead.") : "";
    return "".concat(n2, " cannot be used with a selector ending in a shadowRoot (").concat(r, ").").concat(e2);
  }
  function d(n2) {
    return n2 instanceof Promise ? n2 : Promise.resolve(n2);
  }
  function h() {
    return "You can not select a shadowRoot (".concat(r, ") of the document.");
  }
  function v() {
    return "You can not select a shadowRoot (".concat(r, ") of a shadowRoot.");
  }
  function y(n2, t2) {
    for (var e2, r2, u2 = null, i2 = n2.length, a2 = 0; a2 < i2; a2++) {
      if (0 === a2)
        if (n2[a2].length)
          u2 = t2.querySelector(n2[a2]);
        else {
          if (t2 instanceof Document)
            throw new SyntaxError(h());
          if (t2 instanceof ShadowRoot)
            throw new SyntaxError(v());
          u2 = (null === (e2 = t2.shadowRoot) || void 0 === e2 ? void 0 : e2.querySelector(n2[++a2])) || null;
        }
      else
        u2 = (null === (r2 = u2.shadowRoot) || void 0 === r2 ? void 0 : r2.querySelector("".concat(o, " ").concat(n2[a2]))) || null;
      if (null === u2)
        return null;
    }
    return u2;
  }
  function m(n2, t2) {
    var e2, r2 = function(n3, t3, e3) {
      if (e3 || 2 === arguments.length)
        for (var r3, o2 = 0, u3 = t3.length; o2 < u3; o2++)
          !r3 && o2 in t3 || (r3 || (r3 = Array.prototype.slice.call(t3, 0, o2)), r3[o2] = t3[o2]);
      return n3.concat(r3 || Array.prototype.slice.call(t3));
    }([], n2, true), u2 = r2.pop();
    if (!r2.length)
      return t2.querySelectorAll(u2);
    var i2 = y(r2, t2);
    return (null === (e2 = null == i2 ? void 0 : i2.shadowRoot) || void 0 === e2 ? void 0 : e2.querySelectorAll("".concat(o, " ").concat(u2))) || null;
  }
  function p(n2, t2) {
    if (1 === n2.length && !n2[0].length) {
      if (t2 instanceof Document)
        throw new SyntaxError(h());
      if (t2 instanceof ShadowRoot)
        throw new SyntaxError(v());
      return t2.shadowRoot;
    }
    var e2 = y(n2, t2);
    return (null == e2 ? void 0 : e2.shadowRoot) || null;
  }
  function g(n2, t2, e2) {
    void 0 === e2 && (e2 = "querySelectorAll");
    for (var r2 = l(n2, function(n3) {
      if (!n3[n3.length - 1].length)
        throw new SyntaxError(f(e2));
      return n3;
    }), o2 = r2.length, i2 = 0; i2 < o2; i2++) {
      var a2 = m(r2[i2], t2);
      if (null == a2 ? void 0 : a2.length)
        return a2;
    }
    return document.querySelectorAll(u);
  }
  function S(n2, t2, e2, o2) {
    void 0 === e2 && (e2 = "shadowRootQuerySelector"), void 0 === o2 && (o2 = "querySelector");
    for (var u2 = l(n2, function(n3) {
      if (n3.pop().length)
        throw new SyntaxError(function(n4, t3) {
          return "".concat(n4, " must be used with a selector ending in a shadowRoot (").concat(r, "). If you don't want to select a shadowRoot, use ").concat(t3, " instead.");
        }(e2, o2));
      return n3;
    }), i2 = u2.length, a2 = 0; a2 < i2; a2++) {
      var c2 = p(u2[a2], t2);
      if (c2)
        return c2;
    }
    return null;
  }
  function P(n2, r2, o2, u2) {
    return t(this, void 0, void 0, function() {
      return e(this, function(t2) {
        return [2, s(function() {
          return g(n2, r2, "asyncQuerySelectorAll");
        }, function(n3) {
          return !!n3.length;
        }, o2, u2)];
      });
    });
  }
  function R(n2, r2, o2, u2) {
    return t(this, void 0, void 0, function() {
      return e(this, function(t2) {
        return [2, s(function() {
          return S(n2, r2, "asyncShadowRootQuerySelector", "asyncQuerySelector");
        }, function(n3) {
          return !!n3;
        }, o2, u2)];
      });
    });
  }
  var _ = function(n2, t2) {
    var e2 = n2.querySelectorAll(t2);
    if (e2.length)
      return e2;
    if (n2 instanceof Element && n2.shadowRoot) {
      var r2 = _(n2.shadowRoot, t2);
      if (r2.length)
        return r2;
    }
    for (var o2 = 0, i2 = Array.from(n2.querySelectorAll("*")); o2 < i2.length; o2++) {
      var a2 = i2[o2], c2 = _(a2, t2);
      if (c2.length)
        return c2;
    }
    return document.querySelectorAll(u);
  }, q = function(n2, t2, e2, r2) {
    return s(function() {
      return _(n2, t2);
    }, function(n3) {
      return !!n3.length;
    }, e2, r2);
  };
  function A() {
    for (var n2 = [], t2 = 0; t2 < arguments.length; t2++)
      n2[t2] = arguments[t2];
    var e2 = n2[0], r2 = n2[1];
    return "string" == typeof e2 ? _(document, e2)[0] || null : _(e2, r2)[0] || null;
  }
  function j() {
    for (var n2 = [], r2 = 0; r2 < arguments.length; r2++)
      n2[r2] = arguments[r2];
    return t(this, void 0, void 0, function() {
      var t2, r3, o2, u2, l2;
      return e(this, function(e2) {
        switch (e2.label) {
          case 0:
            return c(n2) ? (t2 = n2[0], r3 = n2[1], o2 = n2[2], [4, P(r3, t2, (null == o2 ? void 0 : o2.retries) || i, (null == o2 ? void 0 : o2.delay) || a)]) : [3, 2];
          case 1:
            return [2, e2.sent()];
          case 2:
            return u2 = n2[0], l2 = n2[1], [2, P(u2, document, (null == l2 ? void 0 : l2.retries) || i, (null == l2 ? void 0 : l2.delay) || a)];
        }
      });
    });
  }
  function D() {
    for (var n2 = [], r2 = 0; r2 < arguments.length; r2++)
      n2[r2] = arguments[r2];
    return t(this, void 0, void 0, function() {
      var t2, r3, o2, u2, l2;
      return e(this, function(e2) {
        switch (e2.label) {
          case 0:
            return c(n2) ? (t2 = n2[0], r3 = n2[1], o2 = n2[2], [4, R(r3, t2, (null == o2 ? void 0 : o2.retries) || i, (null == o2 ? void 0 : o2.delay) || a)]) : [3, 2];
          case 1:
            return [2, e2.sent()];
          case 2:
            return u2 = n2[0], l2 = n2[1], [2, R(u2, document, (null == l2 ? void 0 : l2.retries) || i, (null == l2 ? void 0 : l2.delay) || a)];
        }
      });
    });
  }
  (function() {
    function o2(t2, e2) {
      t2 instanceof Node || t2 instanceof Promise ? (this._element = t2, this._asyncParams = n({ retries: i, delay: a }, e2 || {})) : (this._element = document, this._asyncParams = n({ retries: i, delay: a }, t2 || {}));
    }
    return Object.defineProperty(o2.prototype, "element", { get: function() {
      return d(this._element).then(function(n2) {
        return n2 instanceof NodeList ? n2[0] || null : n2;
      });
    }, enumerable: false, configurable: true }), Object.defineProperty(o2.prototype, r, { get: function() {
      var n2 = this;
      return new o2(d(this._element).then(function(t2) {
        return t2 instanceof Document || t2 instanceof ShadowRoot || null === t2 || t2 instanceof NodeList && 0 === t2.length ? null : t2 instanceof NodeList ? D(t2[0], r, n2._asyncParams) : D(t2, r, n2._asyncParams);
      }), this._asyncParams);
    }, enumerable: false, configurable: true }), Object.defineProperty(o2.prototype, "all", { get: function() {
      return d(this._element).then(function(n2) {
        return n2 instanceof NodeList ? n2 : document.querySelectorAll(u);
      });
    }, enumerable: false, configurable: true }), Object.defineProperty(o2.prototype, "asyncParams", { get: function() {
      return this._asyncParams;
    }, enumerable: false, configurable: true }), o2.prototype.eq = function(n2) {
      return t(this, void 0, void 0, function() {
        return e(this, function(t2) {
          return [2, d(this._element).then(function(t3) {
            return t3 instanceof NodeList && t3[n2] || null;
          })];
        });
      });
    }, o2.prototype.query = function(n2) {
      var t2 = this;
      return new o2(d(this._element).then(function(e2) {
        return null === e2 || e2 instanceof NodeList && 0 === e2.length ? null : e2 instanceof NodeList ? j(e2[0], n2, t2._asyncParams) : j(e2, n2, t2._asyncParams);
      }), this._asyncParams);
    }, o2.prototype.deepQuery = function(n2) {
      var t2 = this;
      return new o2(d(this._element).then(function(e2) {
        return null === e2 || e2 instanceof NodeList && 0 === e2.length ? null : e2 instanceof NodeList ? Promise.race(Array.from(e2).map(function(e3) {
          return q(e3, n2, t2._asyncParams.retries, t2._asyncParams.delay);
        })) : q(e2, n2, t2._asyncParams.retries, t2._asyncParams.delay);
      }), this._asyncParams);
    }, o2;
  })();
  observe(document.body, () => {
    const loadingToast = showToast(h$1("div", {}, "Loading..."), {});
    const intervall = setInterval(() => {
      const imageElement = A("hui-image");
      if (imageElement) {
        clearInterval(intervall);
        loadingToast.close();
        const boxWidth = imageElement.getBoundingClientRect().width;
        const boxHeight = imageElement.getBoundingClientRect().height;
        imageElement.addEventListener("click", (el) => {
          const clientX = el.clientX - 256;
          const clientY = el.clientY - 56;
          if (clientX <= boxWidth && clientY <= boxHeight) {
            const percentX = Math.ceil(clientX / boxWidth * 100);
            const percentY = Math.ceil(clientY / boxHeight * 100);
            const coordinatesHtml = hm(
              "article",
              { class: "card" },
              [
                hm("header", {}, hm("h3", {}, "Coordinates")),
                hm("footer", {}, [
                  hm("fieldset", { class: "flex two" }, [
                    hm("label", { for: "boxWidth" }, "boxHeight"),
                    hm("input", { id: "boxWidth", type: "number", class: "show", value: boxWidth, readonly: true })
                  ]),
                  hm("fieldset", { class: "flex two" }, [
                    hm("label", { for: "boxHeight" }, "boxHeight"),
                    hm("input", { id: "boxHeight", type: "number", class: "show", value: boxHeight, readonly: true })
                  ]),
                  hm("fieldset", { class: "flex two" }, [
                    hm("label", { for: "clientX" }, "clientX"),
                    hm("input", { id: "clientX", type: "number", class: "show", value: clientX, readonly: true })
                  ]),
                  hm("fieldset", { class: "flex two" }, [
                    hm("label", { for: "clientY" }, "clientY"),
                    hm("input", { id: "clientY", type: "number", class: "show", value: clientY, readonly: true })
                  ]),
                  hm("fieldset", { class: "flex two" }, [
                    hm("label", { for: "percentX" }, "percentX"),
                    hm("input", { id: "percentX", type: "number", class: "show", value: percentX, readonly: true })
                  ]),
                  hm("fieldset", { class: "flex two" }, [
                    hm("label", { for: "percentY" }, "percentY"),
                    hm("input", { id: "percentY", type: "number", class: "show", value: percentY, readonly: true })
                  ])
                ])
              ]
            );
            const panel = getPanel({
              content: coordinatesHtml
            });
            panel.wrapper.style.top = "10px";
            panel.wrapper.style.right = "10px";
            panel.show();
          }
        });
      }
    }, 1e3);
    return true;
  });

})();