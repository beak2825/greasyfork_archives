// ==UserScript==
// @name         GitHub README TOC
// @namespace    https://greasyfork.org/en/scripts/464732-github-readme-toc
// @version      0.3.3
// @author       pacexy <pacexy@gmail.com>
// @description  Add table of contents(TOC) for README in GitHub.
// @license      MIT
// @icon         https://github.com/favicon.ico
// @homepage     https://github.com/pacexy/github-readme-toc#readme
// @homepageURL  https://github.com/pacexy/github-readme-toc#readme
// @source       https://github.com/pacexy/github-readme-toc
// @supportURL   https://github.com/pacexy/github-readme-toc/issues
// @match        https://github.com/**
// @require      https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @downloadURL https://update.greasyfork.org/scripts/464732/GitHub%20README%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/464732/GitHub%20README%20TOC.meta.js
// ==/UserScript==

(o=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.textContent=o,document.head.append(t)})(" #github-readme-toc{position:sticky;z-index:30;top:0px!important;padding-top:24px;margin-top:24px;border-top:1px solid var(--color-border-muted);display:flex;flex-direction:column;max-height:100vh}#github-readme-toc ul{list-style:none;overflow:auto;padding-right:8px;padding-bottom:8px}#github-readme-toc ul>li{margin-bottom:8px}#github-readme-toc a{color:var(--color-fg-default)}#github-readme-toc a:hover{color:var(--color-accent-fg);text-decoration:none} ");

(function (require$$0, require$$0$1) {
  'use strict';

  var jsxRuntimeExports = {};
  var jsxRuntime = {
    get exports() {
      return jsxRuntimeExports;
    },
    set exports(v) {
      jsxRuntimeExports = v;
    }
  };
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
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a)
      m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
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
  var client = {};
  var m = require$$0$1;
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  const name = "github-readme-toc";
  function assert$1(el) {
    if (!el) {
      throw new Error("Element not exists");
    }
  }
  function ensureElements() {
    var _a;
    const container = (_a = document.querySelector(".BorderGrid")) == null ? void 0 : _a.parentElement;
    const headings = document.querySelectorAll("article.markdown-body .markdown-heading");
    assert$1(container);
    assert$1(headings);
    return { container, headings };
  }
  function assert(x) {
    if (!x) {
      throw new Error("Assertion failed");
    }
  }
  function getToc() {
    return [...ensureElements().headings].map((heading) => {
      var _a;
      const h = heading.firstElementChild;
      assert(h);
      const depth = Number(h.tagName.slice(1));
      const anchor = heading.querySelector("a");
      return {
        depth,
        text: (_a = heading.textContent) == null ? void 0 : _a.trim(),
        url: anchor == null ? void 0 : anchor.href
      };
    });
  }
  const Toc = ({ toc }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: toc.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { style: { paddingLeft: (h.depth - 1) * 16 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: h.url, children: h.text }) }, i)) });
  };
  function App() {
    const toc = getToc();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "h4 mb-3", children: "Table of Contents" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toc, { toc })
    ] });
  }
  async function render() {
    let root = document.querySelector(`#${name}`);
    if (root) {
      return;
    }
    const container = ensureElements().container;
    root = document.createElement("div");
    root.id = name;
    container.append(root);
    client.createRoot(root).render(
      /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
    );
  }
  function run() {
    render().then(() => {
    }).catch((error) => {
    });
  }
  ["pjax:end", "turbo:render"].forEach((e) => {
    document.addEventListener(e, () => {
      run();
    });
  });
  run();

})(React, ReactDOM);
