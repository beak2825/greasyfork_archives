// ==UserScript==
// @name         @suchipi/jsxdom
// @version      0.4.1
// @description  Create DOM elements with a createElement-like jsx function
// @author       Lily Skye
// @grant        none
// @license      MIT
// ==/UserScript==
(function () {
  "use strict";

  const ref = (...args) => {
    return { current: args.length > 0 ? args[0] : null };
  };
  const nodeFactory = (type, props) => {
    if (typeof type !== "string") {
      return document.createDocumentFragment();
    }
    const otherProps = Object.assign({}, props);
    {
      delete otherProps.style;
      delete otherProps.ref;
      delete otherProps.namespaceURI;
      delete otherProps.children;
      delete otherProps.tagName;
    }
    let node;
    if (props.namespaceURI) {
      node = document.createElementNS(props.namespaceURI, type);
    } else {
      node = document.createElement(type);
    }
    if (props.style != null) {
      Object.assign(node.style, props.style);
    }
    if (props.ref != null) {
      if (typeof props.ref === "function") {
        props.ref.call(null, node);
      } else {
        props.ref.current = node;
      }
    }
    Object.assign(node, otherProps);
    return node;
  };
  const jsx = (type, ...args) => {
    let rawProps = null;
    let children = null;
    if (typeof args[0] === "object" && args[0] != null) {
      if (args[0] instanceof Node) {
        children = args;
      } else {
        rawProps = args[0];
        children = args.slice(1);
      }
    } else {
      children = args;
    }
    children = children.flat(Infinity);
    const props = rawProps || {};
    props.children = children;
    if (type === DocumentFragment || typeof type === "string") {
      const node = nodeFactory(type, props);
      for (const child of children) {
        if (child == null) continue;
        if (typeof child === "object") {
          node.appendChild(child);
        } else {
          const textNode = document.createTextNode(String(child));
          node.appendChild(textNode);
        }
      }
      return node;
    } else {
      return type(props);
    }
  };
  const createElement = jsx;
  const Fragment = DocumentFragment;

  var jsxdom = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Fragment: Fragment,
    createElement: createElement,
    jsx: jsx,
    nodeFactory: nodeFactory,
    ref: ref,
  });

  globalThis.jsxdom = jsxdom;
})();
