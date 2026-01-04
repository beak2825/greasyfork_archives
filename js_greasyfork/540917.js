// ==UserScript==
// @name               mitmproxy-llm-better-view
// @name:zh-CN         mitmproxy 大模型请求内容预览
// @namespace          npm/vite-plugin-monkey
// @version            0.0.10
// @description        Better view request body and response body of LLM API (openai completion) in mitmweb
// @description:zh-CN  在 mitmweb 中查看大模型请求中的信息
// @icon               https://s3.api2o.com/mitm-better-view.svg
// @homepage           https://github.com/slow-groovin/mitmproxy-llm-better-view
// @include            http://localhost:8081/*
// @include            http://127.0.0.1:8081/*
// @grant              GM_addElement
// @grant              GM_addStyle
// @grant              unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/540917/mitmproxy-llm-better-view.user.js
// @updateURL https://update.greasyfork.org/scripts/540917/mitmproxy-llm-better-view.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var _a;
  var _GM_addElement = /* @__PURE__ */ (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t$1 = globalThis, i$1 = t$1.trustedTypes, s = i$1 ? i$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, e$2 = "$lit$", h = `lit$${Math.random().toFixed(9).slice(2)}$`, o$1 = "?" + h, n = `<${o$1}>`, r = document, l = () => r.createComment(""), c = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, a = Array.isArray, u = (t2) => a(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), d = "[ 	\n\f\r]", f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, v = /-->/g, _ = />/g, m = RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), p = /'/g, g = /"/g, $ = /^(?:script|style|textarea|title)$/i, y = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), x = y(1), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), A = /* @__PURE__ */ new WeakMap(), C = r.createTreeWalker(r, 129);
  function P(t2, i2) {
    if (!a(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== s ? s.createHTML(i2) : i2;
  }
  const V = (t2, i2) => {
    const s2 = t2.length - 1, o2 = [];
    let r2, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = f;
    for (let i3 = 0; i3 < s2; i3++) {
      const s3 = t2[i3];
      let a2, u2, d2 = -1, y2 = 0;
      for (; y2 < s3.length && (c2.lastIndex = y2, u2 = c2.exec(s3), null !== u2); ) y2 = c2.lastIndex, c2 === f ? "!--" === u2[1] ? c2 = v : void 0 !== u2[1] ? c2 = _ : void 0 !== u2[2] ? ($.test(u2[2]) && (r2 = RegExp("</" + u2[2], "g")), c2 = m) : void 0 !== u2[3] && (c2 = m) : c2 === m ? ">" === u2[0] ? (c2 = r2 ?? f, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? m : '"' === u2[3] ? g : p) : c2 === g || c2 === p ? c2 = m : c2 === v || c2 === _ ? c2 = f : (c2 = m, r2 = void 0);
      const x2 = c2 === m && t2[i3 + 1].startsWith("/>") ? " " : "";
      l2 += c2 === f ? s3 + n : d2 >= 0 ? (o2.push(a2), s3.slice(0, d2) + e$2 + s3.slice(d2) + h + x2) : s3 + h + (-2 === d2 ? i3 : x2);
    }
    return [P(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), o2];
  };
  class N {
    constructor({ strings: t2, _$litType$: s2 }, n2) {
      let r2;
      this.parts = [];
      let c2 = 0, a2 = 0;
      const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = V(t2, s2);
      if (this.el = N.createElement(f2, n2), C.currentNode = this.el.content, 2 === s2 || 3 === s2) {
        const t3 = this.el.content.firstChild;
        t3.replaceWith(...t3.childNodes);
      }
      for (; null !== (r2 = C.nextNode()) && d2.length < u2; ) {
        if (1 === r2.nodeType) {
          if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(e$2)) {
            const i2 = v2[a2++], s3 = r2.getAttribute(t3).split(h), e2 = /([.?@])?(.*)/.exec(i2);
            d2.push({ type: 1, index: c2, name: e2[2], strings: s3, ctor: "." === e2[1] ? H : "?" === e2[1] ? I : "@" === e2[1] ? L : k }), r2.removeAttribute(t3);
          } else t3.startsWith(h) && (d2.push({ type: 6, index: c2 }), r2.removeAttribute(t3));
          if ($.test(r2.tagName)) {
            const t3 = r2.textContent.split(h), s3 = t3.length - 1;
            if (s3 > 0) {
              r2.textContent = i$1 ? i$1.emptyScript : "";
              for (let i2 = 0; i2 < s3; i2++) r2.append(t3[i2], l()), C.nextNode(), d2.push({ type: 2, index: ++c2 });
              r2.append(t3[s3], l());
            }
          }
        } else if (8 === r2.nodeType) if (r2.data === o$1) d2.push({ type: 2, index: c2 });
        else {
          let t3 = -1;
          for (; -1 !== (t3 = r2.data.indexOf(h, t3 + 1)); ) d2.push({ type: 7, index: c2 }), t3 += h.length - 1;
        }
        c2++;
      }
    }
    static createElement(t2, i2) {
      const s2 = r.createElement("template");
      return s2.innerHTML = t2, s2;
    }
  }
  function S(t2, i2, s2 = t2, e2) {
    var _a2, _b;
    if (i2 === T) return i2;
    let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
    const o2 = c(i2) ? void 0 : i2._$litDirective$;
    return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = S(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
  }
  class M {
    constructor(t2, i2) {
      this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t2) {
      const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? r).importNode(i2, true);
      C.currentNode = e2;
      let h2 = C.nextNode(), o2 = 0, n2 = 0, l2 = s2[0];
      for (; void 0 !== l2; ) {
        if (o2 === l2.index) {
          let i3;
          2 === l2.type ? i3 = new R(h2, h2.nextSibling, this, t2) : 1 === l2.type ? i3 = new l2.ctor(h2, l2.name, l2.strings, this, t2) : 6 === l2.type && (i3 = new z(h2, this, t2)), this._$AV.push(i3), l2 = s2[++n2];
        }
        o2 !== (l2 == null ? void 0 : l2.index) && (h2 = C.nextNode(), o2++);
      }
      return C.currentNode = r, e2;
    }
    p(t2) {
      let i2 = 0;
      for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
    }
  }
  class R {
    get _$AU() {
      var _a2;
      return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
    }
    constructor(t2, i2, s2, e2) {
      this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
    }
    get parentNode() {
      let t2 = this._$AA.parentNode;
      const i2 = this._$AM;
      return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t2, i2 = this) {
      t2 = S(this, t2, i2), c(t2) ? t2 === E || null == t2 || "" === t2 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t2 !== this._$AH && t2 !== T && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : u(t2) ? this.k(t2) : this._(t2);
    }
    O(t2) {
      return this._$AA.parentNode.insertBefore(t2, this._$AB);
    }
    T(t2) {
      this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
    }
    _(t2) {
      this._$AH !== E && c(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(r.createTextNode(t2)), this._$AH = t2;
    }
    $(t2) {
      var _a2;
      const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = N.createElement(P(s2.h, s2.h[0]), this.options)), s2);
      if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
      else {
        const t3 = new M(e2, this), s3 = t3.u(this.options);
        t3.p(i2), this.T(s3), this._$AH = t3;
      }
    }
    _$AC(t2) {
      let i2 = A.get(t2.strings);
      return void 0 === i2 && A.set(t2.strings, i2 = new N(t2)), i2;
    }
    k(t2) {
      a(this._$AH) || (this._$AH = [], this._$AR());
      const i2 = this._$AH;
      let s2, e2 = 0;
      for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new R(this.O(l()), this.O(l()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
      e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
    }
    _$AR(t2 = this._$AA.nextSibling, i2) {
      var _a2;
      for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, i2); t2 && t2 !== this._$AB; ) {
        const i3 = t2.nextSibling;
        t2.remove(), t2 = i3;
      }
    }
    setConnected(t2) {
      var _a2;
      void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
    }
  }
  class k {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t2, i2, s2, e2, h2) {
      this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = E;
    }
    _$AI(t2, i2 = this, s2, e2) {
      const h2 = this.strings;
      let o2 = false;
      if (void 0 === h2) t2 = S(this, t2, i2, 0), o2 = !c(t2) || t2 !== this._$AH && t2 !== T, o2 && (this._$AH = t2);
      else {
        const e3 = t2;
        let n2, r2;
        for (t2 = h2[0], n2 = 0; n2 < h2.length - 1; n2++) r2 = S(this, e3[s2 + n2], i2, n2), r2 === T && (r2 = this._$AH[n2]), o2 || (o2 = !c(r2) || r2 !== this._$AH[n2]), r2 === E ? t2 = E : t2 !== E && (t2 += (r2 ?? "") + h2[n2 + 1]), this._$AH[n2] = r2;
      }
      o2 && !e2 && this.j(t2);
    }
    j(t2) {
      t2 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
    }
  }
  class H extends k {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t2) {
      this.element[this.name] = t2 === E ? void 0 : t2;
    }
  }
  class I extends k {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t2) {
      this.element.toggleAttribute(this.name, !!t2 && t2 !== E);
    }
  }
  class L extends k {
    constructor(t2, i2, s2, e2, h2) {
      super(t2, i2, s2, e2, h2), this.type = 5;
    }
    _$AI(t2, i2 = this) {
      if ((t2 = S(this, t2, i2, 0) ?? E) === T) return;
      const s2 = this._$AH, e2 = t2 === E && s2 !== E || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== E && (s2 === E || e2);
      e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
    }
    handleEvent(t2) {
      var _a2;
      "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
    }
  }
  class z {
    constructor(t2, i2, s2) {
      this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t2) {
      S(this, t2);
    }
  }
  const j = t$1.litHtmlPolyfillSupport;
  j == null ? void 0 : j(N, R), (t$1.litHtmlVersions ?? (t$1.litHtmlVersions = [])).push("3.3.0");
  const B = (t2, i2, s2) => {
    const e2 = i2;
    let h2 = e2._$litPart$;
    if (void 0 === h2) {
      const t3 = null;
      e2._$litPart$ = h2 = new R(i2.insertBefore(l(), t3), t3, void 0, {});
    }
    return h2._$AI(t2), h2;
  };
  function processSSEEvents(events) {
    if (!events.length) {
      throw new Error("No events to process");
    }
    const finalEvent = events.find((event) => event.usage) || events[events.length - 1];
    const aggregatedChoices = aggregateChoices(events);
    return {
      id: finalEvent.id || "N/A",
      object: finalEvent.object || "N/A",
      created: finalEvent.created || 0,
      model: finalEvent.model || "N/A",
      system_fingerprint: finalEvent.system_fingerprint,
      choices: aggregatedChoices,
      usage: finalEvent.usage,
      eventCount: events.length
    };
  }
  function aggregateChoices(events) {
    var _a2, _b;
    const choiceMap = /* @__PURE__ */ new Map();
    for (const event of events) {
      if (!event.choices) continue;
      for (const choice of event.choices) {
        const index = choice.index;
        if (!choiceMap.has(index)) {
          choiceMap.set(index, {
            index,
            role: "N/A",
            content: "",
            tool_calls: /* @__PURE__ */ new Map(),
            finish_reason: "N/A"
          });
        }
        const agg = choiceMap.get(index);
        const delta = choice.delta;
        if (delta) {
          if (delta.role) agg.role = delta.role;
          if (delta.content) agg.content += delta.content;
          if (delta.tool_calls) {
            for (const toolCallDelta of delta.tool_calls) {
              const toolIndex = toolCallDelta.index;
              if (!agg.tool_calls.has(toolIndex)) {
                agg.tool_calls.set(toolIndex, {
                  index: toolIndex,
                  id: "N/A",
                  type: "N/A",
                  function: { name: "N/A", arguments: "" }
                });
              }
              const toolCall = agg.tool_calls.get(toolIndex);
              if (toolCallDelta.id) toolCall.id = toolCallDelta.id;
              if (toolCallDelta.type) toolCall.type = toolCallDelta.type;
              if ((_a2 = toolCallDelta.function) == null ? void 0 : _a2.name) toolCall.function.name = toolCallDelta.function.name;
              if ((_b = toolCallDelta.function) == null ? void 0 : _b.arguments) {
                toolCall.function.arguments += toolCallDelta.function.arguments;
              }
            }
          }
        }
        if (choice.finish_reason) {
          agg.finish_reason = choice.finish_reason;
        }
      }
    }
    return Array.from(choiceMap.values()).map((agg) => ({
      index: agg.index,
      role: agg.role,
      content: agg.content,
      tool_calls: Array.from(agg.tool_calls.values()).sort((a2, b) => a2.index - b.index),
      finish_reason: agg.finish_reason
    })).sort((a2, b) => a2.index - b.index);
  }
  const css = x`<style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        padding: 2px;
        line-height: 1.5;
        font-size: 14px;
      }

      .container {
      }

      .header {
        text-align: center;
        margin-bottom: 16px;
        position: relative;
      }

      .header h1 {
        color: #1e293b;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .header p {
        color: #64748b;
        font-size: 0.875rem;
      }

      .global-collapse-btn {
        position: absolute;
        top: 0;
        right: 0;
        background: #e2e8f0;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.75rem;
        color: #475569;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: background-color 0.2s;
      }

      .global-collapse-btn:hover {
        background: #cbd5e1;
      }

      .section {
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin-bottom: 12px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0; /* Merged from second definition */
      }

      .section:last-child {
        border-bottom: none; /* Merged from second definition */
      }

      .section-header {
        padding: 10px 12px;
        background: #f1f5f9;
        border-bottom: 1px solid #e2e8f0;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.2s;
      }

      .section-header:hover {
        background: #e2e8f0;
      }

      .section-title {
        font-weight: 600;
        font-size: 0.95rem;
        color: #1e293b;
      }
      .section-controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .expand-collapse-btn {
        background: #dbeafe;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.7rem;
        color: #1d4ed8;
        display: flex;
        align-items: center;
        gap: 2px;
        transition: background-color 0.2s;
      }

      .expand-collapse-btn:hover {
        background: #bfdbfe;
      }

      .expand-collapse-btn.tools {
        background: #f3e8ff;
        color: #7c3aed;
      }

      .expand-collapse-btn.tools:hover {
        background: #e9d5ff;
      }

      .toggle-icon {
        transition: transform 0.2s;
        color: #64748b;
        font-size: 0.75rem;
      }

      .toggle-icon.rotated {
        transform: rotate(180deg);
      }

      .section-content {
        padding: 2px;
      }

      .info-item {
        padding: 8px 4px;
        border-bottom: 1px solid #f1f5f9;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .info-item:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 0.8rem;
        color: #64748b;
        font-weight: 500;
        min-width: 120px;
      }

      .info-value {
        font-weight: 600;
        color: #1e293b;
        font-size: 0.8rem;
      }

      .message-item,
      .tool-item {
        border-bottom: 2px solid #7eb4e950;
        padding: 4px 8px;
      }

      .message-item:last-child,
      .tool-item:last-child {
        border-bottom: none;
      }

      .message-header,
      .tool-header {
        padding: 6px 0;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .message-header:hover,
      .tool-header:hover {
        background: #f8fafc;
        margin: 0 -12px;
        padding: 6px 12px;
        border-radius: 4px;
      }

      .role-badge {
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.65rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .role-user {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .role-assistant {
        background: #dcfce7;
        color: #166534;
      }

      .role-system {
        background: #fef3c7;
        color: #92400e;
      }

      .role-tool {
        background: #f3e8ff;
        color: #7c3aed;
      }

      .tool-name-badge {
        padding: 3px 8px;
        border-radius: 4px;
        font-size: initial;
        font-weight: 700;
        text-transform: none;
        background: #f3e8ff;
        color: #7c3aed;
        font-family: "Monaco", "Menlo", monospace;
      }

      .message-content,
      .tool-content {
        padding: 4px 16px;
        font-size: initial;
        background-color: #88bcc515;
        overflow-y: auto;
      }

      .json-content {
        font-family: "Monaco", "Menlo", monospace;
        background: #1e293b; /* Merged from second definition */
        color: #e2e8f0; /* Merged from second definition */
        padding: 16px; /* Merged from second definition */
        border-radius: 6px; /* Merged from second definition */
        font-size: 0.875rem; /* Merged from second definition */
        white-space: pre-wrap;
        overflow-x: auto; /* Merged from second definition */
      }

      .usage-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .usage-item {
        background: #f8fafc;
        padding: 16px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }    
      .usage-label {
        font-size: 0.875rem;
        color: #64748b;
        margin-bottom: 4px;
      }

      .usage-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1e293b;
      }

      .choice-item {
        border-radius: 8px;
        margin-bottom: 16px;
        overflow: hidden;
      }

      .choice-header {
        background: #f8fafc;
        padding: 12px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: none;
        width: 100%;
        text-align: left;
      }

      .choice-header:hover {
        background: #f1f5f9;
      }

      .choice-badge {
        background: #10b981; /* Merged from second definition */
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .choice-content {
        padding: 16px;
      }

      .choice-meta {
        gap: 16px;
        margin-bottom: 12px;
        font-size: 0.875rem;
        flex-direction: column; /* Merged from second definition */
        gap: 8px; /* Merged from second definition */
      }

      .choice-meta-item {
      }

      .choice-meta-item span:first-child {
        font-weight: 600;
        /* color: #64748b; */
      }

      /* GitHub-style Markdown prose */
      .prose {
        line-height: 1.7; /* Merged from second definition */
        color: #374151; /* Merged from second definition */
      }

      .prose h1,
      .prose h2,
      .prose h3,
      .prose h4,
      .prose h5,
      .prose h6 {
        margin-top: 1.5em; /* Merged from second definition */
        margin-bottom: 0.5em; /* Merged from second definition */
        font-weight: 600;
        line-height: 1.25;
        color: #1f2937; /* Merged from second definition */
      }

      .prose h1 {
        font-size: 1.25em;
        border-bottom: 1px solid #d0d7de;
        padding-bottom: 4px;
      }
      .prose h2 {
        font-size: 1.1em;
        border-bottom: 1px solid #d0d7de;
        padding-bottom: 4px;
      }
      .prose h3 {
        font-size: 1em;
      }
      .prose h4 {
        font-size: 0.9rem; /* Adjusted from 0.9em to 0.9rem for consistency */
      }
      .prose h5 {
        font-size: 0.85em;
      }
      .prose h6 {
        font-size: 0.8em;
        color: #656d76;
      }

      .prose p {
        margin-top: 0;
        margin-bottom: 1em; /* Merged from second definition */
      }

      .prose ul,
      .prose ol {
        margin-top: 0;
        margin-bottom: 1em; /* Merged from second definition */
        padding-left: 1.5em; /* Merged from second definition */
      }

      .prose li {
        margin-bottom: 0.25em; /* Merged from second definition */
      }

      .prose blockquote {
        margin: 8px 0;
        padding: 0 12px;
        color: #656d76;
        border-left: 3px solid #d0d7de;
      }

      .prose code {
        background: #f3f4f6; /* Merged from second definition */
        padding: 0.125em 0.25em; /* Merged from second definition */
        border-radius: 0.25em; /* Merged from second definition */
        font-size: 0.875em; /* Merged from second definition */
        font-family: "Monaco", "Menlo", "Consolas", monospace;
      }

      .prose pre {
        background: #1f2937; /* Merged from second definition */
        color: #f9fafb; /* Merged from second definition */
        padding: 1em; /* Merged from second definition */
        border-radius: 0.5em; /* Merged from second definition */
        overflow-x: auto;
        margin: 1em 0; /* Merged from second definition */
        border: 1px solid #d0d7de;
      }

      .prose pre code {
        background: none;
        padding: 0;
      }

      .prose a {
        color: #0969da;
        text-decoration: none;
      }

      .prose a:hover {
        text-decoration: underline;
      }

      .prose strong {
        font-weight: 600;
      }

      .prose em {
        font-style: italic;
      }

      .prose table {
        border-collapse: collapse;
        margin: 8px 0;
        width: 100%;
      }

      .prose th,
      .prose td {
        border: 1px solid #d0d7de;
        padding: 6px 8px;
        text-align: left;
      }

      .prose th {
        background: #f6f8fa;
        font-weight: 600;
      }

      .tool-description {
        margin: 6px 0;
        font-size: 1rem;
      }

      .tool-call-name {
        font-weight: 600;
        color: #1e293b;
        font-size: 0.875rem;
      }

      .tool-parameters {
        margin-top: 8px;
      }

      .tool-parameters-title {
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 6px;
      }

      .parameter-item {
        margin-bottom: 8px;
        padding: 6px 8px;
        background: #f8fafc;
        border-radius: 4px;
        border-left: 3px solid #3b82f6;
      }

      .parameter-name {
        font-weight: 600;
        font-size: 0.75rem;
        color: #1e293b;
        font-family: "Monaco", "Menlo", monospace;
      }

      .parameter-type {
        font-size: 0.7rem;
        color: #7c3aed;
        background: #f3e8ff;
        padding: 1px 4px;
        border-radius: 2px;
        margin-left: 6px;
      }

      .parameter-required {
        font-size: 0.65rem;
        color: #dc2626;
        background: #fef2f2;
        padding: 1px 4px;
        border-radius: 2px;
        margin-left: 4px;
      }

      .parameter-description {
        font-size: 0.75rem;
        color: #64748b;
        margin-top: 2px;
      }

      .empty-state {
        text-align: center;
        color: #64748b;
        font-style: italic;
        padding: 40px 20px; /* Merged from second definition */
      }

      /* SVG Icons */
      .icon {
        width: 12px;
        height: 12px;
        fill: currentColor;
      }

      .event-badge {
        position: absolute;
        top: 16px;
        right: 24px;
        background: #6366f1; /* Merged from second definition */
        color: white; /* Merged from second definition */
        padding: 3px 6px; /* Merged from second definition */
        border-radius: 3px; /* Merged from second definition */
        font-size: 0.7rem; /* Merged from second definition */
        font-weight: 600;
        backdrop-filter: blur(10px);
      }

      .content {
        padding: 0;
      }

      .finish-reason-badge {
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
      }

      .finish-stop {
        background: #dcfce7;
        color: #166534;
      }

      .finish-length {
        background: #fef3c7;
        color: #92400e;
      }

      .finish-tool-calls {
        background: #dbeafe;
        color: #1e40af;
      }

      .finish-content-filter {
        background: #fecaca;
        color: #991b1b;
      }

      .content-section {
        margin-bottom: 16px;
      }

      .content-section h4 {
        margin-bottom: 8px;
        font-size: 0.9rem;
        color: #1e293b;
        font-weight: 600;
      }

      .tool-calls-container {
      }

      .tool-calls-container h4 {
        margin-bottom: 12px;
        font-size: 0.9rem;
        color: #1e293b;
        font-weight: 600;
      }

      .tool-call-item {
        border-radius: 6px;
        margin-bottom: 8px;
        overflow: hidden;
      }

      .tool-call-header {
        background: #fafafa;
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: none;
        width: 100%;
        text-align: left;
      }

      .tool-call-header:hover {
        background: #f5f5f5;
      }

      .tool-call-id {
        font-size: 0.75rem;
        color: #64748b;
      }

      .tool-call-content {
        padding: 2px;
      }

      .events-timeline {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .event-item {
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        overflow: hidden;
      }

      .event-header {
        background: #f8fafc;
        padding: 10px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: none;
        width: 100%;
        text-align: left;
      }

      .event-header:hover {
        background: #f1f5f9;
      }

      .event-meta {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .event-type-badge {
        background: #e5e7eb;
        color: #374151;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.7rem;
        font-weight: 500;
      }

      .event-timestamp {
        font-size: 0.75rem;
        color: #64748b;
        font-family: 'Monaco', 'Menlo', monospace;
      }

      .event-content {
        padding: 12px;
      }

      [data-content-type="anthropic"]{
        margin-bottom: 12px;
        padding: 2px;
        border-radius: 8px;
        border: #d1701452 solid 1px;
      }

      
    }
    </style>`;
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t = { CHILD: 2 }, e$1 = (t2) => (...e2) => ({ _$litDirective$: t2, values: e2 });
  class i {
    constructor(t2) {
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t2, e2, i2) {
      this._$Ct = t2, this._$AM = e2, this._$Ci = i2;
    }
    _$AS(t2, e2) {
      return this.update(t2, e2);
    }
    update(t2, e2) {
      return this.render(...e2);
    }
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  class e extends i {
    constructor(i2) {
      if (super(i2), this.it = E, i2.type !== t.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
    }
    render(r2) {
      if (r2 === E || null == r2) return this._t = void 0, this.it = r2;
      if (r2 === T) return r2;
      if ("string" != typeof r2) throw Error(this.constructor.directiveName + "() called with a non-string value");
      if (r2 === this.it) return this._t;
      this.it = r2;
      const s2 = [r2];
      return s2.raw = s2, this._t = { _$litType$: this.constructor.resultType, strings: s2, values: [] };
    }
  }
  e.directiveName = "unsafeHTML", e.resultType = 1;
  const o = e$1(e);
  function _getDefaults() {
    return {
      async: false,
      breaks: false,
      extensions: null,
      gfm: true,
      hooks: null,
      pedantic: false,
      renderer: null,
      silent: false,
      tokenizer: null,
      walkTokens: null
    };
  }
  var _defaults = _getDefaults();
  function changeDefaults(newDefaults) {
    _defaults = newDefaults;
  }
  var noopTest = { exec: () => null };
  function edit(regex, opt = "") {
    let source = typeof regex === "string" ? regex : regex.source;
    const obj = {
      replace: (name, val) => {
        let valSource = typeof val === "string" ? val : val.source;
        valSource = valSource.replace(other.caret, "$1");
        source = source.replace(name, valSource);
        return obj;
      },
      getRegex: () => {
        return new RegExp(source, opt);
      }
    };
    return obj;
  }
  var other = {
    codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
    outputLinkReplace: /\\([\[\]])/g,
    indentCodeCompensation: /^(\s+)(?:```)/,
    beginningSpace: /^\s+/,
    endingHash: /#$/,
    startingSpaceChar: /^ /,
    endingSpaceChar: / $/,
    nonSpaceChar: /[^ ]/,
    newLineCharGlobal: /\n/g,
    tabCharGlobal: /\t/g,
    multipleSpaceGlobal: /\s+/g,
    blankLine: /^[ \t]*$/,
    doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
    blockquoteStart: /^ {0,3}>/,
    blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
    blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
    listReplaceTabs: /^\t+/,
    listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
    listIsTask: /^\[[ xX]\] /,
    listReplaceTask: /^\[[ xX]\] +/,
    anyLine: /\n.*\n/,
    hrefBrackets: /^<(.*)>$/,
    tableDelimiter: /[:|]/,
    tableAlignChars: /^\||\| *$/g,
    tableRowBlankLine: /\n[ \t]*$/,
    tableAlignRight: /^ *-+: *$/,
    tableAlignCenter: /^ *:-+: *$/,
    tableAlignLeft: /^ *:-+ *$/,
    startATag: /^<a /i,
    endATag: /^<\/a>/i,
    startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
    endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
    startAngleBracket: /^</,
    endAngleBracket: />$/,
    pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
    unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
    escapeTest: /[&<>"']/,
    escapeReplace: /[&<>"']/g,
    escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
    escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
    unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
    caret: /(^|[^\[])\^/g,
    percentDecode: /%25/g,
    findPipe: /\|/g,
    splitPipe: / \|/,
    slashPipe: /\\\|/g,
    carriageReturn: /\r\n|\r/g,
    spaceLine: /^ +$/gm,
    notSpaceStart: /^\S*/,
    endingNewline: /\n$/,
    listItemRegex: (bull) => new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`),
    nextBulletRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
    hrRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
    fencesBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`),
    headingBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`),
    htmlBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}<(?:[a-z].*>|!--)`, "i")
  };
  var newline = /^(?:[ \t]*(?:\n|$))+/;
  var blockCode = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
  var fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  var hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  var heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  var bullet = /(?:[*+-]|\d{1,9}[.)])/;
  var lheadingCore = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
  var lheading = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
  var lheadingGfm = edit(lheadingCore).replace(/bull/g, bullet).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
  var _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
  var blockText = /^[^\n]+/;
  var _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
  var def = edit(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", _blockLabel).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
  var list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, bullet).getRegex();
  var _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  var _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
  var html = edit(
    "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
    "i"
  ).replace("comment", _comment).replace("tag", _tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  var paragraph = edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
  var blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", paragraph).getRegex();
  var blockNormal = {
    blockquote,
    code: blockCode,
    def,
    fences,
    heading,
    hr,
    html,
    lheading,
    list,
    newline,
    paragraph,
    table: noopTest,
    text: blockText
  };
  var gfmTable = edit(
    "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
  ).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
  var blockGfm = {
    ...blockNormal,
    lheading: lheadingGfm,
    table: gfmTable,
    paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gfmTable).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex()
  };
  var blockPedantic = {
    ...blockNormal,
    html: edit(
      `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
    ).replace("comment", _comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: noopTest,
    // fences not supported
    lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", lheading).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
  };
  var escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  var inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  var br = /^( {2,}|\\)\n(?!\s*$)/;
  var inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  var _punctuation = /[\p{P}\p{S}]/u;
  var _punctuationOrSpace = /[\s\p{P}\p{S}]/u;
  var _notPunctuationOrSpace = /[^\s\p{P}\p{S}]/u;
  var punctuation = edit(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, _punctuationOrSpace).getRegex();
  var _punctuationGfmStrongEm = /(?!~)[\p{P}\p{S}]/u;
  var _punctuationOrSpaceGfmStrongEm = /(?!~)[\s\p{P}\p{S}]/u;
  var _notPunctuationOrSpaceGfmStrongEm = /(?:[^\s\p{P}\p{S}]|~)/u;
  var blockSkip = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g;
  var emStrongLDelimCore = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
  var emStrongLDelim = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuation).getRegex();
  var emStrongLDelimGfm = edit(emStrongLDelimCore, "u").replace(/punct/g, _punctuationGfmStrongEm).getRegex();
  var emStrongRDelimAstCore = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)";
  var emStrongRDelimAst = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
  var emStrongRDelimAstGfm = edit(emStrongRDelimAstCore, "gu").replace(/notPunctSpace/g, _notPunctuationOrSpaceGfmStrongEm).replace(/punctSpace/g, _punctuationOrSpaceGfmStrongEm).replace(/punct/g, _punctuationGfmStrongEm).getRegex();
  var emStrongRDelimUnd = edit(
    "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
    "gu"
  ).replace(/notPunctSpace/g, _notPunctuationOrSpace).replace(/punctSpace/g, _punctuationOrSpace).replace(/punct/g, _punctuation).getRegex();
  var anyPunctuation = edit(/\\(punct)/, "gu").replace(/punct/g, _punctuation).getRegex();
  var autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
  var _inlineComment = edit(_comment).replace("(?:-->|$)", "-->").getRegex();
  var tag = edit(
    "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
  ).replace("comment", _inlineComment).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
  var _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
  var link = edit(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", _inlineLabel).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
  var reflink = edit(/^!?\[(label)\]\[(ref)\]/).replace("label", _inlineLabel).replace("ref", _blockLabel).getRegex();
  var nolink = edit(/^!?\[(ref)\](?:\[\])?/).replace("ref", _blockLabel).getRegex();
  var reflinkSearch = edit("reflink|nolink(?!\\()", "g").replace("reflink", reflink).replace("nolink", nolink).getRegex();
  var inlineNormal = {
    _backpedal: noopTest,
    // only used for GFM url
    anyPunctuation,
    autolink,
    blockSkip,
    br,
    code: inlineCode,
    del: noopTest,
    emStrongLDelim,
    emStrongRDelimAst,
    emStrongRDelimUnd,
    escape,
    link,
    nolink,
    punctuation,
    reflink,
    reflinkSearch,
    tag,
    text: inlineText,
    url: noopTest
  };
  var inlinePedantic = {
    ...inlineNormal,
    link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", _inlineLabel).getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _inlineLabel).getRegex()
  };
  var inlineGfm = {
    ...inlineNormal,
    emStrongRDelimAst: emStrongRDelimAstGfm,
    emStrongLDelim: emStrongLDelimGfm,
    url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
    _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
  };
  var inlineBreaks = {
    ...inlineGfm,
    br: edit(br).replace("{2,}", "*").getRegex(),
    text: edit(inlineGfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
  };
  var block = {
    normal: blockNormal,
    gfm: blockGfm,
    pedantic: blockPedantic
  };
  var inline = {
    normal: inlineNormal,
    gfm: inlineGfm,
    breaks: inlineBreaks,
    pedantic: inlinePedantic
  };
  var escapeReplacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  var getEscapeReplacement = (ch) => escapeReplacements[ch];
  function escape2(html2, encode) {
    if (encode) {
      if (other.escapeTest.test(html2)) {
        return html2.replace(other.escapeReplace, getEscapeReplacement);
      }
    } else {
      if (other.escapeTestNoEncode.test(html2)) {
        return html2.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
      }
    }
    return html2;
  }
  function cleanUrl(href) {
    try {
      href = encodeURI(href).replace(other.percentDecode, "%");
    } catch {
      return null;
    }
    return href;
  }
  function splitCells(tableRow, count) {
    var _a2;
    const row = tableRow.replace(other.findPipe, (match, offset, str) => {
      let escaped = false;
      let curr = offset;
      while (--curr >= 0 && str[curr] === "\\") escaped = !escaped;
      if (escaped) {
        return "|";
      } else {
        return " |";
      }
    }), cells = row.split(other.splitPipe);
    let i2 = 0;
    if (!cells[0].trim()) {
      cells.shift();
    }
    if (cells.length > 0 && !((_a2 = cells.at(-1)) == null ? void 0 : _a2.trim())) {
      cells.pop();
    }
    if (count) {
      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count) cells.push("");
      }
    }
    for (; i2 < cells.length; i2++) {
      cells[i2] = cells[i2].trim().replace(other.slashPipe, "|");
    }
    return cells;
  }
  function rtrim(str, c2, invert) {
    const l2 = str.length;
    if (l2 === 0) {
      return "";
    }
    let suffLen = 0;
    while (suffLen < l2) {
      const currChar = str.charAt(l2 - suffLen - 1);
      if (currChar === c2 && true) {
        suffLen++;
      } else {
        break;
      }
    }
    return str.slice(0, l2 - suffLen);
  }
  function findClosingBracket(str, b) {
    if (str.indexOf(b[1]) === -1) {
      return -1;
    }
    let level = 0;
    for (let i2 = 0; i2 < str.length; i2++) {
      if (str[i2] === "\\") {
        i2++;
      } else if (str[i2] === b[0]) {
        level++;
      } else if (str[i2] === b[1]) {
        level--;
        if (level < 0) {
          return i2;
        }
      }
    }
    if (level > 0) {
      return -2;
    }
    return -1;
  }
  function outputLink(cap, link2, raw, lexer2, rules) {
    const href = link2.href;
    const title = link2.title || null;
    const text = cap[1].replace(rules.other.outputLinkReplace, "$1");
    lexer2.state.inLink = true;
    const token = {
      type: cap[0].charAt(0) === "!" ? "image" : "link",
      raw,
      href,
      title,
      text,
      tokens: lexer2.inlineTokens(text)
    };
    lexer2.state.inLink = false;
    return token;
  }
  function indentCodeCompensation(raw, text, rules) {
    const matchIndentToCode = raw.match(rules.other.indentCodeCompensation);
    if (matchIndentToCode === null) {
      return text;
    }
    const indentToCode = matchIndentToCode[1];
    return text.split("\n").map((node) => {
      const matchIndentInNode = node.match(rules.other.beginningSpace);
      if (matchIndentInNode === null) {
        return node;
      }
      const [indentInNode] = matchIndentInNode;
      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }
      return node;
    }).join("\n");
  }
  var _Tokenizer = class {
    // set by the lexer
    constructor(options2) {
      __publicField(this, "options");
      __publicField(this, "rules");
      // set by the lexer
      __publicField(this, "lexer");
      this.options = options2 || _defaults;
    }
    space(src) {
      const cap = this.rules.block.newline.exec(src);
      if (cap && cap[0].length > 0) {
        return {
          type: "space",
          raw: cap[0]
        };
      }
    }
    code(src) {
      const cap = this.rules.block.code.exec(src);
      if (cap) {
        const text = cap[0].replace(this.rules.other.codeRemoveIndent, "");
        return {
          type: "code",
          raw: cap[0],
          codeBlockStyle: "indented",
          text: !this.options.pedantic ? rtrim(text, "\n") : text
        };
      }
    }
    fences(src) {
      const cap = this.rules.block.fences.exec(src);
      if (cap) {
        const raw = cap[0];
        const text = indentCodeCompensation(raw, cap[3] || "", this.rules);
        return {
          type: "code",
          raw,
          lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
          text
        };
      }
    }
    heading(src) {
      const cap = this.rules.block.heading.exec(src);
      if (cap) {
        let text = cap[2].trim();
        if (this.rules.other.endingHash.test(text)) {
          const trimmed = rtrim(text, "#");
          if (this.options.pedantic) {
            text = trimmed.trim();
          } else if (!trimmed || this.rules.other.endingSpaceChar.test(trimmed)) {
            text = trimmed.trim();
          }
        }
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[1].length,
          text,
          tokens: this.lexer.inline(text)
        };
      }
    }
    hr(src) {
      const cap = this.rules.block.hr.exec(src);
      if (cap) {
        return {
          type: "hr",
          raw: rtrim(cap[0], "\n")
        };
      }
    }
    blockquote(src) {
      const cap = this.rules.block.blockquote.exec(src);
      if (cap) {
        let lines = rtrim(cap[0], "\n").split("\n");
        let raw = "";
        let text = "";
        const tokens = [];
        while (lines.length > 0) {
          let inBlockquote = false;
          const currentLines = [];
          let i2;
          for (i2 = 0; i2 < lines.length; i2++) {
            if (this.rules.other.blockquoteStart.test(lines[i2])) {
              currentLines.push(lines[i2]);
              inBlockquote = true;
            } else if (!inBlockquote) {
              currentLines.push(lines[i2]);
            } else {
              break;
            }
          }
          lines = lines.slice(i2);
          const currentRaw = currentLines.join("\n");
          const currentText = currentRaw.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
          raw = raw ? `${raw}
${currentRaw}` : currentRaw;
          text = text ? `${text}
${currentText}` : currentText;
          const top = this.lexer.state.top;
          this.lexer.state.top = true;
          this.lexer.blockTokens(currentText, tokens, true);
          this.lexer.state.top = top;
          if (lines.length === 0) {
            break;
          }
          const lastToken = tokens.at(-1);
          if ((lastToken == null ? void 0 : lastToken.type) === "code") {
            break;
          } else if ((lastToken == null ? void 0 : lastToken.type) === "blockquote") {
            const oldToken = lastToken;
            const newText = oldToken.raw + "\n" + lines.join("\n");
            const newToken = this.blockquote(newText);
            tokens[tokens.length - 1] = newToken;
            raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
            text = text.substring(0, text.length - oldToken.text.length) + newToken.text;
            break;
          } else if ((lastToken == null ? void 0 : lastToken.type) === "list") {
            const oldToken = lastToken;
            const newText = oldToken.raw + "\n" + lines.join("\n");
            const newToken = this.list(newText);
            tokens[tokens.length - 1] = newToken;
            raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
            text = text.substring(0, text.length - oldToken.raw.length) + newToken.raw;
            lines = newText.substring(tokens.at(-1).raw.length).split("\n");
            continue;
          }
        }
        return {
          type: "blockquote",
          raw,
          tokens,
          text
        };
      }
    }
    list(src) {
      let cap = this.rules.block.list.exec(src);
      if (cap) {
        let bull = cap[1].trim();
        const isordered = bull.length > 1;
        const list2 = {
          type: "list",
          raw: "",
          ordered: isordered,
          start: isordered ? +bull.slice(0, -1) : "",
          loose: false,
          items: []
        };
        bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
        if (this.options.pedantic) {
          bull = isordered ? bull : "[*+-]";
        }
        const itemRegex = this.rules.other.listItemRegex(bull);
        let endsWithBlankLine = false;
        while (src) {
          let endEarly = false;
          let raw = "";
          let itemContents = "";
          if (!(cap = itemRegex.exec(src))) {
            break;
          }
          if (this.rules.block.hr.test(src)) {
            break;
          }
          raw = cap[0];
          src = src.substring(raw.length);
          let line = cap[2].split("\n", 1)[0].replace(this.rules.other.listReplaceTabs, (t2) => " ".repeat(3 * t2.length));
          let nextLine = src.split("\n", 1)[0];
          let blankLine = !line.trim();
          let indent = 0;
          if (this.options.pedantic) {
            indent = 2;
            itemContents = line.trimStart();
          } else if (blankLine) {
            indent = cap[1].length + 1;
          } else {
            indent = cap[2].search(this.rules.other.nonSpaceChar);
            indent = indent > 4 ? 1 : indent;
            itemContents = line.slice(indent);
            indent += cap[1].length;
          }
          if (blankLine && this.rules.other.blankLine.test(nextLine)) {
            raw += nextLine + "\n";
            src = src.substring(nextLine.length + 1);
            endEarly = true;
          }
          if (!endEarly) {
            const nextBulletRegex = this.rules.other.nextBulletRegex(indent);
            const hrRegex = this.rules.other.hrRegex(indent);
            const fencesBeginRegex = this.rules.other.fencesBeginRegex(indent);
            const headingBeginRegex = this.rules.other.headingBeginRegex(indent);
            const htmlBeginRegex = this.rules.other.htmlBeginRegex(indent);
            while (src) {
              const rawLine = src.split("\n", 1)[0];
              let nextLineWithoutTabs;
              nextLine = rawLine;
              if (this.options.pedantic) {
                nextLine = nextLine.replace(this.rules.other.listReplaceNesting, "  ");
                nextLineWithoutTabs = nextLine;
              } else {
                nextLineWithoutTabs = nextLine.replace(this.rules.other.tabCharGlobal, "    ");
              }
              if (fencesBeginRegex.test(nextLine)) {
                break;
              }
              if (headingBeginRegex.test(nextLine)) {
                break;
              }
              if (htmlBeginRegex.test(nextLine)) {
                break;
              }
              if (nextBulletRegex.test(nextLine)) {
                break;
              }
              if (hrRegex.test(nextLine)) {
                break;
              }
              if (nextLineWithoutTabs.search(this.rules.other.nonSpaceChar) >= indent || !nextLine.trim()) {
                itemContents += "\n" + nextLineWithoutTabs.slice(indent);
              } else {
                if (blankLine) {
                  break;
                }
                if (line.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4) {
                  break;
                }
                if (fencesBeginRegex.test(line)) {
                  break;
                }
                if (headingBeginRegex.test(line)) {
                  break;
                }
                if (hrRegex.test(line)) {
                  break;
                }
                itemContents += "\n" + nextLine;
              }
              if (!blankLine && !nextLine.trim()) {
                blankLine = true;
              }
              raw += rawLine + "\n";
              src = src.substring(rawLine.length + 1);
              line = nextLineWithoutTabs.slice(indent);
            }
          }
          if (!list2.loose) {
            if (endsWithBlankLine) {
              list2.loose = true;
            } else if (this.rules.other.doubleBlankLine.test(raw)) {
              endsWithBlankLine = true;
            }
          }
          let istask = null;
          let ischecked;
          if (this.options.gfm) {
            istask = this.rules.other.listIsTask.exec(itemContents);
            if (istask) {
              ischecked = istask[0] !== "[ ] ";
              itemContents = itemContents.replace(this.rules.other.listReplaceTask, "");
            }
          }
          list2.items.push({
            type: "list_item",
            raw,
            task: !!istask,
            checked: ischecked,
            loose: false,
            text: itemContents,
            tokens: []
          });
          list2.raw += raw;
        }
        const lastItem = list2.items.at(-1);
        if (lastItem) {
          lastItem.raw = lastItem.raw.trimEnd();
          lastItem.text = lastItem.text.trimEnd();
        } else {
          return;
        }
        list2.raw = list2.raw.trimEnd();
        for (let i2 = 0; i2 < list2.items.length; i2++) {
          this.lexer.state.top = false;
          list2.items[i2].tokens = this.lexer.blockTokens(list2.items[i2].text, []);
          if (!list2.loose) {
            const spacers = list2.items[i2].tokens.filter((t2) => t2.type === "space");
            const hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t2) => this.rules.other.anyLine.test(t2.raw));
            list2.loose = hasMultipleLineBreaks;
          }
        }
        if (list2.loose) {
          for (let i2 = 0; i2 < list2.items.length; i2++) {
            list2.items[i2].loose = true;
          }
        }
        return list2;
      }
    }
    html(src) {
      const cap = this.rules.block.html.exec(src);
      if (cap) {
        const token = {
          type: "html",
          block: true,
          raw: cap[0],
          pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
          text: cap[0]
        };
        return token;
      }
    }
    def(src) {
      const cap = this.rules.block.def.exec(src);
      if (cap) {
        const tag2 = cap[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " ");
        const href = cap[2] ? cap[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "";
        const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
        return {
          type: "def",
          tag: tag2,
          raw: cap[0],
          href,
          title
        };
      }
    }
    table(src) {
      var _a2;
      const cap = this.rules.block.table.exec(src);
      if (!cap) {
        return;
      }
      if (!this.rules.other.tableDelimiter.test(cap[2])) {
        return;
      }
      const headers = splitCells(cap[1]);
      const aligns = cap[2].replace(this.rules.other.tableAlignChars, "").split("|");
      const rows = ((_a2 = cap[3]) == null ? void 0 : _a2.trim()) ? cap[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [];
      const item = {
        type: "table",
        raw: cap[0],
        header: [],
        align: [],
        rows: []
      };
      if (headers.length !== aligns.length) {
        return;
      }
      for (const align of aligns) {
        if (this.rules.other.tableAlignRight.test(align)) {
          item.align.push("right");
        } else if (this.rules.other.tableAlignCenter.test(align)) {
          item.align.push("center");
        } else if (this.rules.other.tableAlignLeft.test(align)) {
          item.align.push("left");
        } else {
          item.align.push(null);
        }
      }
      for (let i2 = 0; i2 < headers.length; i2++) {
        item.header.push({
          text: headers[i2],
          tokens: this.lexer.inline(headers[i2]),
          header: true,
          align: item.align[i2]
        });
      }
      for (const row of rows) {
        item.rows.push(splitCells(row, item.header.length).map((cell, i2) => {
          return {
            text: cell,
            tokens: this.lexer.inline(cell),
            header: false,
            align: item.align[i2]
          };
        }));
      }
      return item;
    }
    lheading(src) {
      const cap = this.rules.block.lheading.exec(src);
      if (cap) {
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[2].charAt(0) === "=" ? 1 : 2,
          text: cap[1],
          tokens: this.lexer.inline(cap[1])
        };
      }
    }
    paragraph(src) {
      const cap = this.rules.block.paragraph.exec(src);
      if (cap) {
        const text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
        return {
          type: "paragraph",
          raw: cap[0],
          text,
          tokens: this.lexer.inline(text)
        };
      }
    }
    text(src) {
      const cap = this.rules.block.text.exec(src);
      if (cap) {
        return {
          type: "text",
          raw: cap[0],
          text: cap[0],
          tokens: this.lexer.inline(cap[0])
        };
      }
    }
    escape(src) {
      const cap = this.rules.inline.escape.exec(src);
      if (cap) {
        return {
          type: "escape",
          raw: cap[0],
          text: cap[1]
        };
      }
    }
    tag(src) {
      const cap = this.rules.inline.tag.exec(src);
      if (cap) {
        if (!this.lexer.state.inLink && this.rules.other.startATag.test(cap[0])) {
          this.lexer.state.inLink = true;
        } else if (this.lexer.state.inLink && this.rules.other.endATag.test(cap[0])) {
          this.lexer.state.inLink = false;
        }
        if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(cap[0])) {
          this.lexer.state.inRawBlock = true;
        } else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(cap[0])) {
          this.lexer.state.inRawBlock = false;
        }
        return {
          type: "html",
          raw: cap[0],
          inLink: this.lexer.state.inLink,
          inRawBlock: this.lexer.state.inRawBlock,
          block: false,
          text: cap[0]
        };
      }
    }
    link(src) {
      const cap = this.rules.inline.link.exec(src);
      if (cap) {
        const trimmedUrl = cap[2].trim();
        if (!this.options.pedantic && this.rules.other.startAngleBracket.test(trimmedUrl)) {
          if (!this.rules.other.endAngleBracket.test(trimmedUrl)) {
            return;
          }
          const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
          if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
            return;
          }
        } else {
          const lastParenIndex = findClosingBracket(cap[2], "()");
          if (lastParenIndex === -2) {
            return;
          }
          if (lastParenIndex > -1) {
            const start = cap[0].indexOf("!") === 0 ? 5 : 4;
            const linkLen = start + cap[1].length + lastParenIndex;
            cap[2] = cap[2].substring(0, lastParenIndex);
            cap[0] = cap[0].substring(0, linkLen).trim();
            cap[3] = "";
          }
        }
        let href = cap[2];
        let title = "";
        if (this.options.pedantic) {
          const link2 = this.rules.other.pedanticHrefTitle.exec(href);
          if (link2) {
            href = link2[1];
            title = link2[3];
          }
        } else {
          title = cap[3] ? cap[3].slice(1, -1) : "";
        }
        href = href.trim();
        if (this.rules.other.startAngleBracket.test(href)) {
          if (this.options.pedantic && !this.rules.other.endAngleBracket.test(trimmedUrl)) {
            href = href.slice(1);
          } else {
            href = href.slice(1, -1);
          }
        }
        return outputLink(cap, {
          href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
          title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
        }, cap[0], this.lexer, this.rules);
      }
    }
    reflink(src, links) {
      let cap;
      if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
        const linkString = (cap[2] || cap[1]).replace(this.rules.other.multipleSpaceGlobal, " ");
        const link2 = links[linkString.toLowerCase()];
        if (!link2) {
          const text = cap[0].charAt(0);
          return {
            type: "text",
            raw: text,
            text
          };
        }
        return outputLink(cap, link2, cap[0], this.lexer, this.rules);
      }
    }
    emStrong(src, maskedSrc, prevChar = "") {
      let match = this.rules.inline.emStrongLDelim.exec(src);
      if (!match) return;
      if (match[3] && prevChar.match(this.rules.other.unicodeAlphaNumeric)) return;
      const nextChar = match[1] || match[2] || "";
      if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
        const lLength = [...match[0]].length - 1;
        let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
        const endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        endReg.lastIndex = 0;
        maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
        while ((match = endReg.exec(maskedSrc)) != null) {
          rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
          if (!rDelim) continue;
          rLength = [...rDelim].length;
          if (match[3] || match[4]) {
            delimTotal += rLength;
            continue;
          } else if (match[5] || match[6]) {
            if (lLength % 3 && !((lLength + rLength) % 3)) {
              midDelimTotal += rLength;
              continue;
            }
          }
          delimTotal -= rLength;
          if (delimTotal > 0) continue;
          rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
          const lastCharLength = [...match[0]][0].length;
          const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
          if (Math.min(lLength, rLength) % 2) {
            const text2 = raw.slice(1, -1);
            return {
              type: "em",
              raw,
              text: text2,
              tokens: this.lexer.inlineTokens(text2)
            };
          }
          const text = raw.slice(2, -2);
          return {
            type: "strong",
            raw,
            text,
            tokens: this.lexer.inlineTokens(text)
          };
        }
      }
    }
    codespan(src) {
      const cap = this.rules.inline.code.exec(src);
      if (cap) {
        let text = cap[2].replace(this.rules.other.newLineCharGlobal, " ");
        const hasNonSpaceChars = this.rules.other.nonSpaceChar.test(text);
        const hasSpaceCharsOnBothEnds = this.rules.other.startingSpaceChar.test(text) && this.rules.other.endingSpaceChar.test(text);
        if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
          text = text.substring(1, text.length - 1);
        }
        return {
          type: "codespan",
          raw: cap[0],
          text
        };
      }
    }
    br(src) {
      const cap = this.rules.inline.br.exec(src);
      if (cap) {
        return {
          type: "br",
          raw: cap[0]
        };
      }
    }
    del(src) {
      const cap = this.rules.inline.del.exec(src);
      if (cap) {
        return {
          type: "del",
          raw: cap[0],
          text: cap[2],
          tokens: this.lexer.inlineTokens(cap[2])
        };
      }
    }
    autolink(src) {
      const cap = this.rules.inline.autolink.exec(src);
      if (cap) {
        let text, href;
        if (cap[2] === "@") {
          text = cap[1];
          href = "mailto:" + text;
        } else {
          text = cap[1];
          href = text;
        }
        return {
          type: "link",
          raw: cap[0],
          text,
          href,
          tokens: [
            {
              type: "text",
              raw: text,
              text
            }
          ]
        };
      }
    }
    url(src) {
      var _a2;
      let cap;
      if (cap = this.rules.inline.url.exec(src)) {
        let text, href;
        if (cap[2] === "@") {
          text = cap[0];
          href = "mailto:" + text;
        } else {
          let prevCapZero;
          do {
            prevCapZero = cap[0];
            cap[0] = ((_a2 = this.rules.inline._backpedal.exec(cap[0])) == null ? void 0 : _a2[0]) ?? "";
          } while (prevCapZero !== cap[0]);
          text = cap[0];
          if (cap[1] === "www.") {
            href = "http://" + cap[0];
          } else {
            href = cap[0];
          }
        }
        return {
          type: "link",
          raw: cap[0],
          text,
          href,
          tokens: [
            {
              type: "text",
              raw: text,
              text
            }
          ]
        };
      }
    }
    inlineText(src) {
      const cap = this.rules.inline.text.exec(src);
      if (cap) {
        const escaped = this.lexer.state.inRawBlock;
        return {
          type: "text",
          raw: cap[0],
          text: cap[0],
          escaped
        };
      }
    }
  };
  var _Lexer = class __Lexer {
    constructor(options2) {
      __publicField(this, "tokens");
      __publicField(this, "options");
      __publicField(this, "state");
      __publicField(this, "tokenizer");
      __publicField(this, "inlineQueue");
      this.tokens = [];
      this.tokens.links = /* @__PURE__ */ Object.create(null);
      this.options = options2 || _defaults;
      this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
      this.tokenizer = this.options.tokenizer;
      this.tokenizer.options = this.options;
      this.tokenizer.lexer = this;
      this.inlineQueue = [];
      this.state = {
        inLink: false,
        inRawBlock: false,
        top: true
      };
      const rules = {
        other,
        block: block.normal,
        inline: inline.normal
      };
      if (this.options.pedantic) {
        rules.block = block.pedantic;
        rules.inline = inline.pedantic;
      } else if (this.options.gfm) {
        rules.block = block.gfm;
        if (this.options.breaks) {
          rules.inline = inline.breaks;
        } else {
          rules.inline = inline.gfm;
        }
      }
      this.tokenizer.rules = rules;
    }
    /**
     * Expose Rules
     */
    static get rules() {
      return {
        block,
        inline
      };
    }
    /**
     * Static Lex Method
     */
    static lex(src, options2) {
      const lexer2 = new __Lexer(options2);
      return lexer2.lex(src);
    }
    /**
     * Static Lex Inline Method
     */
    static lexInline(src, options2) {
      const lexer2 = new __Lexer(options2);
      return lexer2.inlineTokens(src);
    }
    /**
     * Preprocessing
     */
    lex(src) {
      src = src.replace(other.carriageReturn, "\n");
      this.blockTokens(src, this.tokens);
      for (let i2 = 0; i2 < this.inlineQueue.length; i2++) {
        const next = this.inlineQueue[i2];
        this.inlineTokens(next.src, next.tokens);
      }
      this.inlineQueue = [];
      return this.tokens;
    }
    blockTokens(src, tokens = [], lastParagraphClipped = false) {
      var _a2, _b, _c;
      if (this.options.pedantic) {
        src = src.replace(other.tabCharGlobal, "    ").replace(other.spaceLine, "");
      }
      while (src) {
        let token;
        if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.block) == null ? void 0 : _b.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
          continue;
        }
        if (token = this.tokenizer.space(src)) {
          src = src.substring(token.raw.length);
          const lastToken = tokens.at(-1);
          if (token.raw.length === 1 && lastToken !== void 0) {
            lastToken.raw += "\n";
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.code(src)) {
          src = src.substring(token.raw.length);
          const lastToken = tokens.at(-1);
          if ((lastToken == null ? void 0 : lastToken.type) === "paragraph" || (lastToken == null ? void 0 : lastToken.type) === "text") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.at(-1).src = lastToken.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.fences(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.heading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.hr(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.blockquote(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.list(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.html(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.def(src)) {
          src = src.substring(token.raw.length);
          const lastToken = tokens.at(-1);
          if ((lastToken == null ? void 0 : lastToken.type) === "paragraph" || (lastToken == null ? void 0 : lastToken.type) === "text") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.raw;
            this.inlineQueue.at(-1).src = lastToken.text;
          } else if (!this.tokens.links[token.tag]) {
            this.tokens.links[token.tag] = {
              href: token.href,
              title: token.title
            };
          }
          continue;
        }
        if (token = this.tokenizer.table(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.lheading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        let cutSrc = src;
        if ((_c = this.options.extensions) == null ? void 0 : _c.startBlock) {
          let startIndex = Infinity;
          const tempSrc = src.slice(1);
          let tempStart;
          this.options.extensions.startBlock.forEach((getStartIndex) => {
            tempStart = getStartIndex.call({ lexer: this }, tempSrc);
            if (typeof tempStart === "number" && tempStart >= 0) {
              startIndex = Math.min(startIndex, tempStart);
            }
          });
          if (startIndex < Infinity && startIndex >= 0) {
            cutSrc = src.substring(0, startIndex + 1);
          }
        }
        if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
          const lastToken = tokens.at(-1);
          if (lastParagraphClipped && (lastToken == null ? void 0 : lastToken.type) === "paragraph") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.pop();
            this.inlineQueue.at(-1).src = lastToken.text;
          } else {
            tokens.push(token);
          }
          lastParagraphClipped = cutSrc.length !== src.length;
          src = src.substring(token.raw.length);
          continue;
        }
        if (token = this.tokenizer.text(src)) {
          src = src.substring(token.raw.length);
          const lastToken = tokens.at(-1);
          if ((lastToken == null ? void 0 : lastToken.type) === "text") {
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
            this.inlineQueue.pop();
            this.inlineQueue.at(-1).src = lastToken.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      this.state.top = true;
      return tokens;
    }
    inline(src, tokens = []) {
      this.inlineQueue.push({ src, tokens });
      return tokens;
    }
    /**
     * Lexing/Compiling
     */
    inlineTokens(src, tokens = []) {
      var _a2, _b, _c;
      let maskedSrc = src;
      let match = null;
      if (this.tokens.links) {
        const links = Object.keys(this.tokens.links);
        if (links.length > 0) {
          while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
            if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
              maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
            }
          }
        }
      }
      while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
      }
      while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      }
      let keepPrevChar = false;
      let prevChar = "";
      while (src) {
        if (!keepPrevChar) {
          prevChar = "";
        }
        keepPrevChar = false;
        let token;
        if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.inline) == null ? void 0 : _b.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
          continue;
        }
        if (token = this.tokenizer.escape(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.tag(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.link(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.reflink(src, this.tokens.links)) {
          src = src.substring(token.raw.length);
          const lastToken = tokens.at(-1);
          if (token.type === "text" && (lastToken == null ? void 0 : lastToken.type) === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.codespan(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.br(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.del(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.autolink(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (!this.state.inLink && (token = this.tokenizer.url(src))) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        let cutSrc = src;
        if ((_c = this.options.extensions) == null ? void 0 : _c.startInline) {
          let startIndex = Infinity;
          const tempSrc = src.slice(1);
          let tempStart;
          this.options.extensions.startInline.forEach((getStartIndex) => {
            tempStart = getStartIndex.call({ lexer: this }, tempSrc);
            if (typeof tempStart === "number" && tempStart >= 0) {
              startIndex = Math.min(startIndex, tempStart);
            }
          });
          if (startIndex < Infinity && startIndex >= 0) {
            cutSrc = src.substring(0, startIndex + 1);
          }
        }
        if (token = this.tokenizer.inlineText(cutSrc)) {
          src = src.substring(token.raw.length);
          if (token.raw.slice(-1) !== "_") {
            prevChar = token.raw.slice(-1);
          }
          keepPrevChar = true;
          const lastToken = tokens.at(-1);
          if ((lastToken == null ? void 0 : lastToken.type) === "text") {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      return tokens;
    }
  };
  var _Renderer = class {
    // set by the parser
    constructor(options2) {
      __publicField(this, "options");
      __publicField(this, "parser");
      this.options = options2 || _defaults;
    }
    space(token) {
      return "";
    }
    code({ text, lang, escaped }) {
      var _a2;
      const langString = (_a2 = (lang || "").match(other.notSpaceStart)) == null ? void 0 : _a2[0];
      const code = text.replace(other.endingNewline, "") + "\n";
      if (!langString) {
        return "<pre><code>" + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
      }
      return '<pre><code class="language-' + escape2(langString) + '">' + (escaped ? code : escape2(code, true)) + "</code></pre>\n";
    }
    blockquote({ tokens }) {
      const body = this.parser.parse(tokens);
      return `<blockquote>
${body}</blockquote>
`;
    }
    html({ text }) {
      return text;
    }
    heading({ tokens, depth }) {
      return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>
`;
    }
    hr(token) {
      return "<hr>\n";
    }
    list(token) {
      const ordered = token.ordered;
      const start = token.start;
      let body = "";
      for (let j2 = 0; j2 < token.items.length; j2++) {
        const item = token.items[j2];
        body += this.listitem(item);
      }
      const type = ordered ? "ol" : "ul";
      const startAttr = ordered && start !== 1 ? ' start="' + start + '"' : "";
      return "<" + type + startAttr + ">\n" + body + "</" + type + ">\n";
    }
    listitem(item) {
      var _a2;
      let itemBody = "";
      if (item.task) {
        const checkbox = this.checkbox({ checked: !!item.checked });
        if (item.loose) {
          if (((_a2 = item.tokens[0]) == null ? void 0 : _a2.type) === "paragraph") {
            item.tokens[0].text = checkbox + " " + item.tokens[0].text;
            if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
              item.tokens[0].tokens[0].text = checkbox + " " + escape2(item.tokens[0].tokens[0].text);
              item.tokens[0].tokens[0].escaped = true;
            }
          } else {
            item.tokens.unshift({
              type: "text",
              raw: checkbox + " ",
              text: checkbox + " ",
              escaped: true
            });
          }
        } else {
          itemBody += checkbox + " ";
        }
      }
      itemBody += this.parser.parse(item.tokens, !!item.loose);
      return `<li>${itemBody}</li>
`;
    }
    checkbox({ checked }) {
      return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
    }
    paragraph({ tokens }) {
      return `<p>${this.parser.parseInline(tokens)}</p>
`;
    }
    table(token) {
      let header = "";
      let cell = "";
      for (let j2 = 0; j2 < token.header.length; j2++) {
        cell += this.tablecell(token.header[j2]);
      }
      header += this.tablerow({ text: cell });
      let body = "";
      for (let j2 = 0; j2 < token.rows.length; j2++) {
        const row = token.rows[j2];
        cell = "";
        for (let k2 = 0; k2 < row.length; k2++) {
          cell += this.tablecell(row[k2]);
        }
        body += this.tablerow({ text: cell });
      }
      if (body) body = `<tbody>${body}</tbody>`;
      return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
    }
    tablerow({ text }) {
      return `<tr>
${text}</tr>
`;
    }
    tablecell(token) {
      const content = this.parser.parseInline(token.tokens);
      const type = token.header ? "th" : "td";
      const tag2 = token.align ? `<${type} align="${token.align}">` : `<${type}>`;
      return tag2 + content + `</${type}>
`;
    }
    /**
     * span level renderer
     */
    strong({ tokens }) {
      return `<strong>${this.parser.parseInline(tokens)}</strong>`;
    }
    em({ tokens }) {
      return `<em>${this.parser.parseInline(tokens)}</em>`;
    }
    codespan({ text }) {
      return `<code>${escape2(text, true)}</code>`;
    }
    br(token) {
      return "<br>";
    }
    del({ tokens }) {
      return `<del>${this.parser.parseInline(tokens)}</del>`;
    }
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const cleanHref = cleanUrl(href);
      if (cleanHref === null) {
        return text;
      }
      href = cleanHref;
      let out = '<a href="' + href + '"';
      if (title) {
        out += ' title="' + escape2(title) + '"';
      }
      out += ">" + text + "</a>";
      return out;
    }
    image({ href, title, text, tokens }) {
      if (tokens) {
        text = this.parser.parseInline(tokens, this.parser.textRenderer);
      }
      const cleanHref = cleanUrl(href);
      if (cleanHref === null) {
        return escape2(text);
      }
      href = cleanHref;
      let out = `<img src="${href}" alt="${text}"`;
      if (title) {
        out += ` title="${escape2(title)}"`;
      }
      out += ">";
      return out;
    }
    text(token) {
      return "tokens" in token && token.tokens ? this.parser.parseInline(token.tokens) : "escaped" in token && token.escaped ? token.text : escape2(token.text);
    }
  };
  var _TextRenderer = class {
    // no need for block level renderers
    strong({ text }) {
      return text;
    }
    em({ text }) {
      return text;
    }
    codespan({ text }) {
      return text;
    }
    del({ text }) {
      return text;
    }
    html({ text }) {
      return text;
    }
    text({ text }) {
      return text;
    }
    link({ text }) {
      return "" + text;
    }
    image({ text }) {
      return "" + text;
    }
    br() {
      return "";
    }
  };
  var _Parser = class __Parser {
    constructor(options2) {
      __publicField(this, "options");
      __publicField(this, "renderer");
      __publicField(this, "textRenderer");
      this.options = options2 || _defaults;
      this.options.renderer = this.options.renderer || new _Renderer();
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;
      this.renderer.parser = this;
      this.textRenderer = new _TextRenderer();
    }
    /**
     * Static Parse Method
     */
    static parse(tokens, options2) {
      const parser2 = new __Parser(options2);
      return parser2.parse(tokens);
    }
    /**
     * Static Parse Inline Method
     */
    static parseInline(tokens, options2) {
      const parser2 = new __Parser(options2);
      return parser2.parseInline(tokens);
    }
    /**
     * Parse Loop
     */
    parse(tokens, top = true) {
      var _a2, _b;
      let out = "";
      for (let i2 = 0; i2 < tokens.length; i2++) {
        const anyToken = tokens[i2];
        if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.renderers) == null ? void 0 : _b[anyToken.type]) {
          const genericToken = anyToken;
          const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
          if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(genericToken.type)) {
            out += ret || "";
            continue;
          }
        }
        const token = anyToken;
        switch (token.type) {
          case "space": {
            out += this.renderer.space(token);
            continue;
          }
          case "hr": {
            out += this.renderer.hr(token);
            continue;
          }
          case "heading": {
            out += this.renderer.heading(token);
            continue;
          }
          case "code": {
            out += this.renderer.code(token);
            continue;
          }
          case "table": {
            out += this.renderer.table(token);
            continue;
          }
          case "blockquote": {
            out += this.renderer.blockquote(token);
            continue;
          }
          case "list": {
            out += this.renderer.list(token);
            continue;
          }
          case "html": {
            out += this.renderer.html(token);
            continue;
          }
          case "paragraph": {
            out += this.renderer.paragraph(token);
            continue;
          }
          case "text": {
            let textToken = token;
            let body = this.renderer.text(textToken);
            while (i2 + 1 < tokens.length && tokens[i2 + 1].type === "text") {
              textToken = tokens[++i2];
              body += "\n" + this.renderer.text(textToken);
            }
            if (top) {
              out += this.renderer.paragraph({
                type: "paragraph",
                raw: body,
                text: body,
                tokens: [{ type: "text", raw: body, text: body, escaped: true }]
              });
            } else {
              out += body;
            }
            continue;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return "";
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
    /**
     * Parse Inline Tokens
     */
    parseInline(tokens, renderer = this.renderer) {
      var _a2, _b;
      let out = "";
      for (let i2 = 0; i2 < tokens.length; i2++) {
        const anyToken = tokens[i2];
        if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.renderers) == null ? void 0 : _b[anyToken.type]) {
          const ret = this.options.extensions.renderers[anyToken.type].call({ parser: this }, anyToken);
          if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(anyToken.type)) {
            out += ret || "";
            continue;
          }
        }
        const token = anyToken;
        switch (token.type) {
          case "escape": {
            out += renderer.text(token);
            break;
          }
          case "html": {
            out += renderer.html(token);
            break;
          }
          case "link": {
            out += renderer.link(token);
            break;
          }
          case "image": {
            out += renderer.image(token);
            break;
          }
          case "strong": {
            out += renderer.strong(token);
            break;
          }
          case "em": {
            out += renderer.em(token);
            break;
          }
          case "codespan": {
            out += renderer.codespan(token);
            break;
          }
          case "br": {
            out += renderer.br(token);
            break;
          }
          case "del": {
            out += renderer.del(token);
            break;
          }
          case "text": {
            out += renderer.text(token);
            break;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return "";
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
  };
  var _Hooks = (_a = class {
    constructor(options2) {
      __publicField(this, "options");
      __publicField(this, "block");
      this.options = options2 || _defaults;
    }
    /**
     * Process markdown before marked
     */
    preprocess(markdown) {
      return markdown;
    }
    /**
     * Process HTML after marked is finished
     */
    postprocess(html2) {
      return html2;
    }
    /**
     * Process all tokens before walk tokens
     */
    processAllTokens(tokens) {
      return tokens;
    }
    /**
     * Provide function to tokenize markdown
     */
    provideLexer() {
      return this.block ? _Lexer.lex : _Lexer.lexInline;
    }
    /**
     * Provide function to parse tokens
     */
    provideParser() {
      return this.block ? _Parser.parse : _Parser.parseInline;
    }
  }, __publicField(_a, "passThroughHooks", /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess",
    "processAllTokens"
  ])), _a);
  var Marked = class {
    constructor(...args) {
      __publicField(this, "defaults", _getDefaults());
      __publicField(this, "options", this.setOptions);
      __publicField(this, "parse", this.parseMarkdown(true));
      __publicField(this, "parseInline", this.parseMarkdown(false));
      __publicField(this, "Parser", _Parser);
      __publicField(this, "Renderer", _Renderer);
      __publicField(this, "TextRenderer", _TextRenderer);
      __publicField(this, "Lexer", _Lexer);
      __publicField(this, "Tokenizer", _Tokenizer);
      __publicField(this, "Hooks", _Hooks);
      this.use(...args);
    }
    /**
     * Run callback for every token
     */
    walkTokens(tokens, callback) {
      var _a2, _b;
      let values = [];
      for (const token of tokens) {
        values = values.concat(callback.call(this, token));
        switch (token.type) {
          case "table": {
            const tableToken = token;
            for (const cell of tableToken.header) {
              values = values.concat(this.walkTokens(cell.tokens, callback));
            }
            for (const row of tableToken.rows) {
              for (const cell of row) {
                values = values.concat(this.walkTokens(cell.tokens, callback));
              }
            }
            break;
          }
          case "list": {
            const listToken = token;
            values = values.concat(this.walkTokens(listToken.items, callback));
            break;
          }
          default: {
            const genericToken = token;
            if ((_b = (_a2 = this.defaults.extensions) == null ? void 0 : _a2.childTokens) == null ? void 0 : _b[genericToken.type]) {
              this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
                const tokens2 = genericToken[childTokens].flat(Infinity);
                values = values.concat(this.walkTokens(tokens2, callback));
              });
            } else if (genericToken.tokens) {
              values = values.concat(this.walkTokens(genericToken.tokens, callback));
            }
          }
        }
      }
      return values;
    }
    use(...args) {
      const extensions = this.defaults.extensions || { renderers: {}, childTokens: {} };
      args.forEach((pack) => {
        const opts = { ...pack };
        opts.async = this.defaults.async || opts.async || false;
        if (pack.extensions) {
          pack.extensions.forEach((ext) => {
            if (!ext.name) {
              throw new Error("extension name required");
            }
            if ("renderer" in ext) {
              const prevRenderer = extensions.renderers[ext.name];
              if (prevRenderer) {
                extensions.renderers[ext.name] = function(...args2) {
                  let ret = ext.renderer.apply(this, args2);
                  if (ret === false) {
                    ret = prevRenderer.apply(this, args2);
                  }
                  return ret;
                };
              } else {
                extensions.renderers[ext.name] = ext.renderer;
              }
            }
            if ("tokenizer" in ext) {
              if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
                throw new Error("extension level must be 'block' or 'inline'");
              }
              const extLevel = extensions[ext.level];
              if (extLevel) {
                extLevel.unshift(ext.tokenizer);
              } else {
                extensions[ext.level] = [ext.tokenizer];
              }
              if (ext.start) {
                if (ext.level === "block") {
                  if (extensions.startBlock) {
                    extensions.startBlock.push(ext.start);
                  } else {
                    extensions.startBlock = [ext.start];
                  }
                } else if (ext.level === "inline") {
                  if (extensions.startInline) {
                    extensions.startInline.push(ext.start);
                  } else {
                    extensions.startInline = [ext.start];
                  }
                }
              }
            }
            if ("childTokens" in ext && ext.childTokens) {
              extensions.childTokens[ext.name] = ext.childTokens;
            }
          });
          opts.extensions = extensions;
        }
        if (pack.renderer) {
          const renderer = this.defaults.renderer || new _Renderer(this.defaults);
          for (const prop in pack.renderer) {
            if (!(prop in renderer)) {
              throw new Error(`renderer '${prop}' does not exist`);
            }
            if (["options", "parser"].includes(prop)) {
              continue;
            }
            const rendererProp = prop;
            const rendererFunc = pack.renderer[rendererProp];
            const prevRenderer = renderer[rendererProp];
            renderer[rendererProp] = (...args2) => {
              let ret = rendererFunc.apply(renderer, args2);
              if (ret === false) {
                ret = prevRenderer.apply(renderer, args2);
              }
              return ret || "";
            };
          }
          opts.renderer = renderer;
        }
        if (pack.tokenizer) {
          const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
          for (const prop in pack.tokenizer) {
            if (!(prop in tokenizer)) {
              throw new Error(`tokenizer '${prop}' does not exist`);
            }
            if (["options", "rules", "lexer"].includes(prop)) {
              continue;
            }
            const tokenizerProp = prop;
            const tokenizerFunc = pack.tokenizer[tokenizerProp];
            const prevTokenizer = tokenizer[tokenizerProp];
            tokenizer[tokenizerProp] = (...args2) => {
              let ret = tokenizerFunc.apply(tokenizer, args2);
              if (ret === false) {
                ret = prevTokenizer.apply(tokenizer, args2);
              }
              return ret;
            };
          }
          opts.tokenizer = tokenizer;
        }
        if (pack.hooks) {
          const hooks = this.defaults.hooks || new _Hooks();
          for (const prop in pack.hooks) {
            if (!(prop in hooks)) {
              throw new Error(`hook '${prop}' does not exist`);
            }
            if (["options", "block"].includes(prop)) {
              continue;
            }
            const hooksProp = prop;
            const hooksFunc = pack.hooks[hooksProp];
            const prevHook = hooks[hooksProp];
            if (_Hooks.passThroughHooks.has(prop)) {
              hooks[hooksProp] = (arg) => {
                if (this.defaults.async) {
                  return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
                    return prevHook.call(hooks, ret2);
                  });
                }
                const ret = hooksFunc.call(hooks, arg);
                return prevHook.call(hooks, ret);
              };
            } else {
              hooks[hooksProp] = (...args2) => {
                let ret = hooksFunc.apply(hooks, args2);
                if (ret === false) {
                  ret = prevHook.apply(hooks, args2);
                }
                return ret;
              };
            }
          }
          opts.hooks = hooks;
        }
        if (pack.walkTokens) {
          const walkTokens2 = this.defaults.walkTokens;
          const packWalktokens = pack.walkTokens;
          opts.walkTokens = function(token) {
            let values = [];
            values.push(packWalktokens.call(this, token));
            if (walkTokens2) {
              values = values.concat(walkTokens2.call(this, token));
            }
            return values;
          };
        }
        this.defaults = { ...this.defaults, ...opts };
      });
      return this;
    }
    setOptions(opt) {
      this.defaults = { ...this.defaults, ...opt };
      return this;
    }
    lexer(src, options2) {
      return _Lexer.lex(src, options2 ?? this.defaults);
    }
    parser(tokens, options2) {
      return _Parser.parse(tokens, options2 ?? this.defaults);
    }
    parseMarkdown(blockType) {
      const parse2 = (src, options2) => {
        const origOpt = { ...options2 };
        const opt = { ...this.defaults, ...origOpt };
        const throwError = this.onError(!!opt.silent, !!opt.async);
        if (this.defaults.async === true && origOpt.async === false) {
          return throwError(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
        }
        if (typeof src === "undefined" || src === null) {
          return throwError(new Error("marked(): input parameter is undefined or null"));
        }
        if (typeof src !== "string") {
          return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
        }
        if (opt.hooks) {
          opt.hooks.options = opt;
          opt.hooks.block = blockType;
        }
        const lexer2 = opt.hooks ? opt.hooks.provideLexer() : blockType ? _Lexer.lex : _Lexer.lexInline;
        const parser2 = opt.hooks ? opt.hooks.provideParser() : blockType ? _Parser.parse : _Parser.parseInline;
        if (opt.async) {
          return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer2(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser2(tokens, opt)).then((html2) => opt.hooks ? opt.hooks.postprocess(html2) : html2).catch(throwError);
        }
        try {
          if (opt.hooks) {
            src = opt.hooks.preprocess(src);
          }
          let tokens = lexer2(src, opt);
          if (opt.hooks) {
            tokens = opt.hooks.processAllTokens(tokens);
          }
          if (opt.walkTokens) {
            this.walkTokens(tokens, opt.walkTokens);
          }
          let html2 = parser2(tokens, opt);
          if (opt.hooks) {
            html2 = opt.hooks.postprocess(html2);
          }
          return html2;
        } catch (e2) {
          return throwError(e2);
        }
      };
      return parse2;
    }
    onError(silent, async) {
      return (e2) => {
        e2.message += "\nPlease report this to https://github.com/markedjs/marked.";
        if (silent) {
          const msg = "<p>An error occurred:</p><pre>" + escape2(e2.message + "", true) + "</pre>";
          if (async) {
            return Promise.resolve(msg);
          }
          return msg;
        }
        if (async) {
          return Promise.reject(e2);
        }
        throw e2;
      };
    }
  };
  var markedInstance = new Marked();
  function marked(src, opt) {
    return markedInstance.parse(src, opt);
  }
  marked.options = marked.setOptions = function(options2) {
    markedInstance.setOptions(options2);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  };
  marked.getDefaults = _getDefaults;
  marked.defaults = _defaults;
  marked.use = function(...args) {
    markedInstance.use(...args);
    marked.defaults = markedInstance.defaults;
    changeDefaults(marked.defaults);
    return marked;
  };
  marked.walkTokens = function(tokens, callback) {
    return markedInstance.walkTokens(tokens, callback);
  };
  marked.parseInline = markedInstance.parseInline;
  marked.Parser = _Parser;
  marked.parser = _Parser.parse;
  marked.Renderer = _Renderer;
  marked.TextRenderer = _TextRenderer;
  marked.Lexer = _Lexer;
  marked.lexer = _Lexer.lex;
  marked.Tokenizer = _Tokenizer;
  marked.Hooks = _Hooks;
  marked.parse = marked;
  marked.options;
  marked.setOptions;
  marked.use;
  marked.walkTokens;
  marked.parseInline;
  _Parser.parse;
  _Lexer.lex;
  function renderChoiceTextContent(content) {
    console.log("content", content);
    if (!content) {
      return "";
    }
    content = content.trim();
    let _isJSON = isJSON(content);
    if (_isJSON) {
      return x`<div data-format='text-as-json' style="white-space: pre; font-family: monospace; overflow-x: auto;"><pre>${JSON.stringify(JSON.parse(content), null, 2)}</pre></div>`;
    }
    let isXml = isXmlFragment(content);
    let isMarkdown = content.startsWith("#") || content.includes("\n```") || content.includes("\n# ") || content.includes("\n## ") || content.includes("\n# ") || content.includes("\n### ") || content.includes("\n1. ") || content.includes("\n- ");
    if (isXml && !isMarkdown) {
      return x`<div data-format='xml' style="white-space: pre; font-family: monospace; overflow-x: auto;">${content}</div>`;
    }
    const parsedHtml = marked.use({
      renderer: {
        html({ text }) {
          return `<div data-format='markdown-html' style="white-space: pre; font-family: monospace; overflow-x: auto;">${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
        }
      }
    }).parse(content);
    return o(parsedHtml);
  }
  function renderToolMessage(content) {
    try {
      const toolArr = JSON.parse(content);
      const htmls = toolArr.map((toolObj) => {
        if (toolObj.type === "text") {
          return renderChoiceTextContent(toolObj.text);
        }
        return x`<div  style="white-space: pre; font-family: monospace;">${content}</div>`;
      });
      return joinedWithHr(htmls);
    } catch (e2) {
    }
    return x`<div  style="white-space: pre; font-family: monospace;">${content}</div>`;
  }
  function renderToolChoiceArgument(_arguments) {
    if (typeof _arguments === "object") {
      return x`<div class="json-content"><pre>${JSON.stringify(_arguments, null, 2)}</pre></div>`;
    }
    try {
      const toolObj = JSON.parse(_arguments);
      return x`<div class="json-content"><pre>${JSON.stringify(toolObj, null, 2)}</pre></div>`;
    } catch (e2) {
    }
    return x`<div  style="white-space: pre; font-family: monospace;">${_arguments}</div>`;
  }
  const joinedWithHr = (sections) => sections.flatMap(
    (section, index, arr) => index < arr.length - 1 ? [section, x`<hr />`] : [section]
    // 最后一段后面不加
  );
  function isXmlFragment(content) {
    if (!content || typeof content !== "string") {
      return false;
    }
    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return false;
    }
    if (!trimmedContent.includes("<") || !trimmedContent.includes(">")) {
      return false;
    }
    const startsWithXmlPattern = /^\s*(<\?xml|<[a-zA-Z][a-zA-Z0-9:_.-]*[\s/>])/i;
    const hasBalancedTags = (str) => {
      const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9:_.-]*)[^>]*>/g;
      const matches = [...str.matchAll(tagPattern)];
      if (matches.length === 0) {
        return false;
      }
      const openTags = [];
      for (const match of matches) {
        const fullTag = match[0];
        const tagName = match[1];
        if (fullTag.endsWith("/>")) {
          continue;
        }
        if (fullTag.startsWith("</")) {
          if (openTags.length === 0 || openTags.pop() !== tagName) {
            return false;
          }
        } else {
          openTags.push(tagName);
        }
      }
      return true;
    };
    const hasXmlFeatures = (str) => {
      const hasAttributes = /\s+[a-zA-Z][a-zA-Z0-9:_.-]*\s*=\s*(['"]).*?\1/.test(str);
      const hasSelfClosingTags = /<[^>]+\/\s*>/.test(str);
      const hasCData = /<!\[CDATA\[.*?\]\]>/.test(str);
      const hasComments = /<!--.*?-->/.test(str);
      const hasEntityRef = /&[a-zA-Z0-9#]+;/.test(str);
      return hasAttributes || hasSelfClosingTags || hasCData || hasComments || hasEntityRef;
    };
    const hasNestedStructure = /<[^>]*>[^<>]*<[^>]*>/.test(trimmedContent);
    const isStartingWithXml = startsWithXmlPattern.test(trimmedContent);
    const hasBalanced = hasBalancedTags(trimmedContent);
    const hasFeatures = hasXmlFeatures(trimmedContent);
    return isStartingWithXml || hasBalanced && (hasFeatures || hasNestedStructure);
  }
  function isJSON(content) {
    try {
      JSON.parse(content);
      return true;
    } catch (e2) {
      return false;
    }
  }
  const renderInfoItem$2 = (label, value) => {
    if (value === void 0) return "";
    return x`
    <div class="info-item">
      <div class="info-label">${label}</div>
      <div class="info-value">${typeof value === "boolean" ? value ? "true" : "false" : value}</div>
    </div>
  `;
  };
  const renderMessageContent = (message) => {
    if (message.role === "tool") {
      return x`<div class="prose" data-type="tool">${renderToolMessage(message.content)}</div>`;
    } else if (typeof message.content === "string") {
      return x`<div class="prose" data-format="string">${renderChoiceTextContent(message.content)}</div>`;
    } else if (Array.isArray(message.content)) {
      return x`<div data-format="array">${message.content.map((item) => renderMessageContent(item))}</div> `;
    } else if (isAnthropicContent(message)) {
      return renderAnthropicContent(message);
    } else {
      return x`<div class="json-content" data-format="object">${JSON.stringify(message.content, null, 2)}</div>`;
    }
  };
  function isAnthropicContent(content) {
    if (content.type && typeof content.type === "string") {
      return true;
    }
  }
  function renderAnthropicContent(content) {
    if (content.type === "text") {
      return x`<div class="prose" data-format="string" data-content-type="anthropic">${renderChoiceTextContent(content.text)}</div>`;
    } else {
      return x`<div class="json-content" data-format="object" data-content-type="anthropic">${JSON.stringify(content, null, 2)}</div>`;
    }
  }
  const renderMessage = (message, index) => {
    const roleClass = `role-${message.role}`;
    return x`
    <details open class="message-item">
      <summary class="message-header">
        <div style="display: flex; align-items: center; gap: 8px">
          <span class="role-badge ${roleClass}">${message.role}</span>
          <span style="font-size: 0.8rem">Message ${index + 1}</span>
        </div>
      </summary>
      <div class="message-content">
        ${renderMessageContent(message)}
      </div>
    </details>
  `;
  };
  const renderParameterItem = (name, param, required = []) => {
    const isRequired = required.includes(name);
    return x`
    <div class="parameter-item">
      <div>
        <span class="parameter-name">${name}</span>
        ${param.type ? x`<span class="parameter-type">${param.type}</span>` : ""}
        ${isRequired ? x`<span class="parameter-required">required</span>` : ""}
      </div>
      ${param.description ? x`<div class="parameter-description">${param.description}</div>` : ""}
    </div>
  `;
  };
  const renderToolContent = (tool, index) => {
    var _a2;
    if (!tool.function) {
      return x`<div class="json-content">${JSON.stringify(tool, null, 2)}</div>`;
    }
    return x`
    ${tool.function.description ? x`<div class="tool-description prose">${renderChoiceTextContent(tool.function.description)}</div>` : ""}
    ${((_a2 = tool.function.parameters) == null ? void 0 : _a2.properties) ? x`
        <div class="tool-parameters">
          <div class="tool-parameters-title">parameters:</div>
          ${Object.entries(tool.function.parameters.properties).map(
    ([name, param]) => renderParameterItem(name, param, tool.function.parameters.required || [])
  )}
        </div>
      ` : ""}
  `;
  };
  const renderTool = (tool, index) => {
    var _a2;
    return x`
    <details open class="tool-item">
      <summary class="tool-header">
        <div style="display: flex; align-items: center; gap: 8px">
          <span class="tool-name-badge">
            ${((_a2 = tool.function) == null ? void 0 : _a2.name) || `Tool ${index + 1}`}
          </span>
        </div>
      </summary>
      <div class="tool-content">
        ${renderToolContent(tool)}
      </div>
    </details>
  `;
  };
  const renderBasicInfo$2 = (obj) => {
    return x`
    <details open class="section">
      <summary class="section-header">
        <span class="section-title">Basic Info</span>
      </summary>
      <div class="section-content">
        ${renderInfoItem$2("model", obj.model)}
        ${renderInfoItem$2("Temperature", obj.temperature)}
        ${renderInfoItem$2("Max Tokens", obj.max_tokens)}
        ${renderInfoItem$2("Top P", obj.top_p)}
        ${renderInfoItem$2("Frequency Penalty", obj.frequency_penalty)}
        ${renderInfoItem$2("Presence Penalty", obj.presence_penalty)}
        ${renderInfoItem$2("Stream", obj.stream)}
        ${renderInfoItem$2("n", obj.n)}
      </div>
    </details>
  `;
  };
  const renderMessages = (messages = []) => {
    return x`
    <details open class="section">
      <summary class="section-header">
        <span class="section-title">
          Messages
          ${messages.length ? x`<span>(${messages.length})</span>` : ""}
        </span>
      </summary>
      <div class="section-content">
        ${!messages.length ? x`<div class="empty-state">no messages</div>` : x`${messages.map((message, index) => renderMessage(message, index))}`}
      </div>
    </details>
  `;
  };
  const renderPrompt = (prompt) => {
    if (!prompt) return "";
    return x`
    <details open class="section">
      <summary class="section-header">
        <span class="section-title">Prompt</span>
      </summary>
      <div class="section-content">
        <div class="message-content">${renderChoiceTextContent(prompt)}</div>
      </div>
    </details>
  `;
  };
  const renderTools = (tools = []) => {
    if (tools.length === 0) return "";
    return x`
    <details open class="section">
      <summary class="section-header">
        <span class="section-title">
          Tools
          <span>(${tools.length})</span>
        </span>
      </summary>
      <div class="section-content">
        ${tools.map((tool, index) => renderTool(tool, index))}
      </div>
    </details>
  `;
  };
  const openai_req_template = (obj) => x`<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OpenAI API Request Visualizer</title>
    ${css}
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>OpenAI API Request</h1>
        <p></p>
      </div>

      ${renderBasicInfo$2(obj)}
      ${obj.messages ? renderMessages(obj.messages) : ""}
      ${obj.prompt ? renderPrompt(obj.prompt) : ""}
      ${renderTools(obj.tools)}
    </div>
  </body>
</html>`;
  const renderInfoItem$1 = (label, value) => {
    if (value === void 0) return "";
    return x`
    <div class="info-item">
      <div class="info-label">${label}</div>
      <div class="info-value">${typeof value === "boolean" ? value ? "true" : "false" : value}</div>
    </div>
  `;
  };
  const renderUsageItem$1 = (label, value) => {
    if (value === void 0) return "";
    return x`
    <div class="usage-item">
      <div class="usage-label">${label}</div>
      <div class="usage-value">${value}</div>
    </div>
  `;
  };
  const renderBasicInfo$1 = (obj) => {
    const createdDate = obj.created ? new Date(obj.created * 1e3).toLocaleString("en-US") : void 0;
    return x`
    <details open class="section">
      <summary class="section-header">
        <span class="section-title">Basic Info</span>
      </summary>
      <div class="section-content">
        ${renderInfoItem$1("Response ID", obj.id)}
        ${renderInfoItem$1("Object Type", obj.object)}
        ${renderInfoItem$1("Created", createdDate)}
        ${renderInfoItem$1("Model", obj.model)}
        ${renderInfoItem$1("System Fingerprint", obj.system_fingerprint)}
      </div>
    </details>
  `;
  };
  const renderTokenUsage$1 = (usage) => {
    var _a2;
    if (!usage) return "";
    return x`
    <details open class="section">
      <summary class="section-header">
        <span class="section-title">Token Usage</span>
      </summary>
      <div class="section-content">
        <div class="usage-grid">
          ${renderUsageItem$1("Prompt Tokens", usage.prompt_tokens)}
          ${renderUsageItem$1("Completion Tokens", usage.completion_tokens)}
          ${renderUsageItem$1("Total Tokens", usage.total_tokens)}
          ${renderUsageItem$1("Cached Tokens", (_a2 = usage.prompt_tokens_details) == null ? void 0 : _a2.cached_tokens)}
        </div>
      </div>
    </details>
  `;
  };
  const renderToolCall$1 = (toolCall, index) => {
    var _a2, _b;
    const parsedArguments = ((_a2 = toolCall.function) == null ? void 0 : _a2.arguments) ? JSON.parse(toolCall.function.arguments) : {};
    return x`
    <details open class="tool-call-item">
      <summary class="tool-call-header">
        <div>
          <div class="tool-call-name">${((_b = toolCall.function) == null ? void 0 : _b.name) || "Unknown Function"}</div>
          <div class="tool-call-id">ID: ${toolCall.id || "N/A"}</div>
        </div>
      </summary>
      <div class="tool-call-content">
        ${renderToolChoiceArgument(parsedArguments)}
      </div>
    </details>
  `;
  };
  const renderToolCalls = (toolCalls) => {
    if (!(toolCalls == null ? void 0 : toolCalls.length)) return "";
    return x`
    <div class="tool-calls-container">
      <h4 style="margin-bottom: 8px; font-size: 0.9rem; color: #1e293b;">Tool Calls:</h4>
      ${toolCalls.map((toolCall, index) => renderToolCall$1(toolCall))}
    </div>
  `;
  };
  const renderLogProbs = (logprobs) => {
    if (!logprobs) return "";
    return x`
    <div style="margin-top: 12px;">
      <h4 style="margin-bottom: 8px; font-size: 0.9rem; color: #1e293b;">Log Probabilities:</h4>
      <div class="json-content">${JSON.stringify(logprobs, null, 2)}</div>
    </div>
  `;
  };
  const renderChoiceMeta = (choice) => {
    return x`
    <div class="choice-meta">
      ${choice.index !== void 0 ? x`
        <div class="choice-meta-item">
          <span>Index:</span>
          <span>${choice.index}</span>
        </div>
      ` : ""}
      ${choice.logprobs ? x`
        <div class="choice-meta-item">
          <span>Log Probs:</span>
          <span>Available</span>
        </div>
      ` : ""}
    </div>
  `;
  };
  const renderChoiceMessageContent = (content) => {
    if (!content) return "";
    return x`
    <div class="prose">
      ${typeof content === "string" ? renderChoiceTextContent(content) : x`<div class="json-content">${JSON.stringify(content, null, 2)}</div>`}
    </div>
  `;
  };
  const getFinishReasonClass$1 = (finishReason) => {
    const classMap = {
      "stop": "finish-stop",
      "length": "finish-length",
      "tool_calls": "finish-tool-calls",
      "content_filter": "finish-content-filter"
    };
    return classMap[finishReason] || "";
  };
  const renderChoice$1 = (choice, index) => {
    var _a2, _b;
    const finishReasonClass = getFinishReasonClass$1(choice.finish_reason);
    return x`
    <details open class="choice-item">
      <summary class="choice-header">
        <div style="display: flex; align-items: center; gap: 8px">
          <span class="choice-badge">Choice ${index + 1}</span>
          <span class="finish-reason-badge ${finishReasonClass}">
            ${choice.finish_reason || "unknown"}
          </span>
        </div>
      </summary>
      <div class="choice-content">
        ${renderChoiceMeta(choice)}
        ${renderChoiceMessageContent((_a2 = choice.message) == null ? void 0 : _a2.content)}
        ${renderToolCalls((_b = choice.message) == null ? void 0 : _b.tool_calls)}
        ${renderLogProbs(choice.logprobs)}
      </div>
    </details>
  `;
  };
  const renderChoices$1 = (choices = []) => {
    return x`
    <details open class="section">
      <summary class="section-header">
        <span class="section-title">
          Choices
          ${choices.length ? x`<span>(${choices.length})</span>` : ""}
        </span>
      </summary>
      <div class="section-content">
        ${!choices.length ? x`<div class="empty-state">No choices available</div>` : x`${choices.map((choice, index) => renderChoice$1(choice, index))}`}
      </div>
    </details>
  `;
  };
  const openai_res_template = (obj) => x`<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OpenAI API Response Visualizer</title>
    ${css}
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>OpenAI API Response</h1>
      </div>

      ${renderBasicInfo$1(obj)}
      ${renderTokenUsage$1(obj.usage)}
      ${renderChoices$1(obj.choices)}
    </div>
  </body>
</html>`;
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1e3).toLocaleString("en-US");
  };
  const formatJSON = (data) => {
    if (typeof data === "string") return data;
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };
  const getFinishReasonClass = (reason) => {
    const classMap = {
      stop: "finish-stop",
      length: "finish-length",
      tool_calls: "finish-tool-calls",
      content_filter: "finish-content-filter"
    };
    return classMap[reason] || "";
  };
  const renderInfoItem = (label, value, formatter) => {
    if (!value) return "";
    const displayValue = formatter ? formatter(value) : value;
    return x`
    <div class="info-item">
      <div class="info-label">${label}</div>
      <div class="info-value">${displayValue}</div>
    </div>
  `;
  };
  const renderUsageItem = (label, value) => {
    if (!value) return "";
    return x`
    <div class="usage-item">
      <div class="usage-label">${label}</div>
      <div class="usage-value">${value}</div>
    </div>
  `;
  };
  const renderBasicInfo = (events) => x`
  <details open class="section">
    <summary class="section-header">
      <div class="section-title">Basic Info</div>
    </summary>
    <div class="section-content">
      ${renderInfoItem("Model", events.model)}
      ${renderInfoItem("Created", events.created, formatTimestamp)}
      ${renderInfoItem("System Fingerprint", events.system_fingerprint)}
      ${renderInfoItem("Events Count", events.eventCount || 0)}
    </div>
  </details>
`;
  const renderTokenUsage = (usage) => {
    var _a2;
    if (!usage) return "";
    return x`
    <details open class="section">
      <summary class="section-header">
        <div class="section-title">Token Usage</div>
      </summary>
      <div class="section-content">
        <div class="usage-grid">
          ${renderUsageItem("Prompt Tokens", usage.prompt_tokens)}
          ${renderUsageItem("Completion Tokens", usage.completion_tokens)}
          ${renderUsageItem("Total Tokens", usage.total_tokens)}
          ${renderUsageItem("Cached Tokens", (_a2 = usage.prompt_tokens_details) == null ? void 0 : _a2.cached_tokens)}
        </div>
      </div>
    </details>
  `;
  };
  const renderToolCall = (toolCall, index) => {
    var _a2, _b;
    return x`
  <div class="tool-call-item">
    <div>
      <div class="tool-call-name">${((_a2 = toolCall.function) == null ? void 0 : _a2.name) || "Unknown Function"}</div>
      <div class="tool-call-id">ID: ${toolCall.id || "N/A"}</div>
    </div>
    <div class="tool-call-content">
    ${renderToolChoiceArgument(((_b = toolCall.function) == null ? void 0 : _b.arguments) || "{}")}
    </div>
  </div>
`;
  };
  const renderChoiceContent = (choice) => {
    var _a2;
    const contentHtml = choice.content ? x`
    <div class="content-section">
      <h4>Content:</h4>
      <div class="prose">
        ${typeof choice.content === "string" ? renderChoiceTextContent(choice.content) : x`<div class="json-content">${formatJSON(choice.content)}</div>`}
      </div>
    </div>
  ` : "";
    const toolCallsHtml = ((_a2 = choice.tool_calls) == null ? void 0 : _a2.length) ? x`
    <div class="tool-calls-container">
      ${choice.tool_calls.map((toolCall, index) => renderToolCall(toolCall))}
    </div>
  ` : "";
    return x`${contentHtml}${toolCallsHtml}`;
  };
  const renderChoice = (choice, index) => x`
  <details open class="choice-item">
    <summary class="choice-header">
      <div class="choice-meta-item">
        <span class="choice-badge">Choice ${index + 1}</span>
        <span class="finish-reason-badge ${getFinishReasonClass(choice.finish_reason)}">
          ${choice.finish_reason || "unknown"}
        </span>
      </div>
    </summary>
    <div class="choice-content">
      ${renderChoiceContent(choice)}
    </div>
  </details>
`;
  const renderChoices = (choices) => x`
  <details open class="section">
    <summary class="section-header">
      <div class="section-title">
        Choices
        ${(choices == null ? void 0 : choices.length) ? x`<span>(${choices.length})</span>` : ""}
      </div>
    </summary>
    <div class="section-content">
      ${!(choices == null ? void 0 : choices.length) ? x`<div class="empty-state">No choices available</div>` : choices.map((choice, index) => renderChoice(choice, index))}
    </div>
  </details>
`;
  const renderEvent = (event, index) => x`
  <details open class="event-item">
    <summary class="event-header">
      <div class="event-meta">
        <span class="event-badge">Event ${index + 1}</span>
        <span class="event-type-badge">${event.event || "data"}</span>
        ${event.timestamp ? x`
          <span class="event-timestamp">
            ${new Date(event.timestamp).toLocaleTimeString("en-US")}
          </span>
        ` : ""}
      </div>
    </summary>
    <div class="event-content">
      ${event.data ? x`
        <div class="json-content">${formatJSON(event.data)}</div>
      ` : ""}
    </div>
  </details>
`;
  const renderEventsTimeline = (events) => {
    if (!(events == null ? void 0 : events.length)) return "";
    return x`
    <details open class="section">
      <summary class="section-header">
        <div class="section-title">
          Events Timeline
          <span>(${events.length})</span>
        </div>
      </summary>
      <div class="section-content">
        <div class="events-timeline">
          ${events.map((event, index) => renderEvent(event, index))}
        </div>
      </div>
    </details>
  `;
  };
  const openai_res_sse_template = (events) => x`<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OpenAI SSE Response Visualizer</title>
    ${css}
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="event-badge">${events.eventCount || 0} events</div>
        <h1>OpenAI SSE Response</h1>
        <p>Server-Sent Events Response Visualization</p>
      </div>
      <div class="content">
        ${renderBasicInfo(events)}
        ${renderTokenUsage(events.usage)}
        ${renderChoices(events.choices)}
        ${renderEventsTimeline(events.events)}
      </div>
    </div>
  </body>
</html>
`;
  class LRUCache {
    constructor(capacity) {
      __publicField(this, "capacity");
      __publicField(this, "cache");
      if (capacity <= 0) {
        throw new Error("Capacity must be greater than 0.");
      }
      this.capacity = capacity;
      this.cache = /* @__PURE__ */ new Map();
    }
    get(key) {
      if (!this.cache.has(key)) return void 0;
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    put(key, value) {
      if (this.cache.has(key)) {
        this.cache.delete(key);
      } else if (this.cache.size >= this.capacity) {
        const oldestKey = this.cache.keys().next().value;
        oldestKey && this.cache.delete(oldestKey);
      }
      this.cache.set(key, value);
    }
    has(key) {
      return this.cache.has(key);
    }
    delete(key) {
      return this.cache.delete(key);
    }
    clear() {
      this.cache.clear();
    }
    size() {
      return this.cache.size;
    }
    keys() {
      return Array.from(this.cache.keys());
    }
    values() {
      return Array.from(this.cache.values());
    }
    entries() {
      return Array.from(this.cache.entries());
    }
  }
  function omit(obj, keys) {
    const result = {};
    Object.keys(obj).forEach((key) => {
      if (!keys.includes(key)) {
        result[key] = obj[key];
      }
    });
    return result;
  }
  const flowKV = new LRUCache(1024);
  const originalFetch = _unsafeWindow.fetch;
  let iframeElement;
  let mutationObservers = {};
  _GM_addStyle(`
details.llm-better-view {
  border: 1px solid #aaa;
  border-radius: 4px;
  margin-bottom: 16px;
}

.llm-better-view summary {
  font-weight: bold;
  padding: 0.5em;
  display: list-item;
}

details[open].llm-better-view summary {
  border-bottom: 1px solid #aaa;
  margin-bottom: 0.5em;
}

  `);
  listenUrlChange(async ({ uuid, action }) => {
    const flow = await getFlow(uuid);
    if (!flow) {
      return;
    }
    if (isOpenaiFlow(flow)) {
      if (action === "request") {
        await renderOpenaiRequest(uuid);
      } else if (action === "response") {
        await renderOpenaiResponse(uuid);
      }
    }
  });
  async function renderOpenaiRequest(uuid) {
    const json = await getFlowData(`http://${window.location.host}/flows/${uuid}/request/content/Auto.json`);
    if (!json.text) {
      console.warn("response has no text field.");
    }
    let parsedObj;
    try {
      parsedObj = JSON.parse(json.text);
    } catch (e2) {
      console.error(e2);
    }
    if (!isLLMRequest(parsedObj)) {
      return;
    }
    const html2 = await generateHtmlForOpenaiRequestBody(parsedObj);
    createIFrameElement(html2);
  }
  async function renderOpenaiResponse(uuid) {
    let json = await await getFlowData(`http://${window.location.host}/flows/${uuid}/response/content/Auto.json`);
    let html2 = "";
    if (json.view_name === "JSON") {
      const parsedObj = JSON.parse(json.text);
      if (!isLLMResponse(parsedObj)) {
        return;
      }
      html2 = await generateHtmlForOpenaiResponseBody(parsedObj);
    } else {
      html2 = await generateHtmlForOpenaiSSE(json.text);
    }
    createIFrameElement(html2);
  }
  async function generateHtmlForOpenaiRequestBody(body) {
    const templateResult = openai_req_template(body);
    const tempDiv = document.createElement("div");
    B(templateResult, tempDiv);
    const html2 = tempDiv.innerHTML;
    return html2;
  }
  async function generateHtmlForOpenaiResponseBody(body) {
    const templateResult = openai_res_template(body);
    const tempDiv = document.createElement("div");
    B(templateResult, tempDiv);
    const html2 = tempDiv.innerHTML;
    return html2;
  }
  async function generateHtmlForOpenaiSSE(sseText) {
    const events = [];
    sseText.split("\n").forEach((line) => {
      line = line.trim();
      if (line.startsWith("data: ")) {
        const dataContent = line.slice(6);
        if (dataContent === "[DONE]") return;
        try {
          events.push(JSON.parse(dataContent));
        } catch {
        }
      }
    });
    const input = processSSEEvents(events);
    const templateResult = openai_res_sse_template(input);
    const tempDiv = document.createElement("div");
    B(templateResult, tempDiv);
    const html2 = tempDiv.innerHTML;
    return html2;
  }
  async function getFlowData(dataUrl) {
    const newResp = await originalFetch(new Request(dataUrl));
    const newJson = await newResp.json();
    return newJson;
  }
  function extractFlowInfo(url) {
    const regex = /#\/flows\/([0-9a-fA-F\-]{36})\/(request|response)/;
    const match = url.match(regex);
    if (match) {
      const [, uuid, action] = match;
      return { uuid, action };
    }
    return null;
  }
  async function listenUrlChange(hook) {
    let currentUrl = location.href;
    function onUrlChange() {
      if (location.href !== currentUrl) {
        const flow = extractFlowInfo(location.href);
        if (flow) {
          hook == null ? void 0 : hook(flow);
        }
        currentUrl = location.href;
      }
    }
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      onUrlChange();
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      onUrlChange();
    };
    window.addEventListener("popstate", onUrlChange);
  }
  function isOpenaiFlow(flow) {
    return flow.request.path.endsWith("/completions");
  }
  async function getFlow(uuid) {
    const cacheKey = `mitmproxy-flow-${uuid}`;
    let cachedFlow = flowKV.get(cacheKey);
    if (cachedFlow) {
      return cachedFlow;
    }
    const response = await originalFetch(`http://${location.host}/flows`);
    if (!response.ok) {
      throw new Error(`Failed to fetch flow with uuid ${uuid}`);
    }
    const flowArray = await response.json();
    let targetFlow = null;
    for (const flow of flowArray) {
      if (isOpenaiFlow(flow)) {
        flowKV.put(flow.id, omit(flow, ["client_conn", "server_conn"]));
      }
      if (flow.id === uuid) {
        targetFlow = flow;
      }
    }
    if (targetFlow) {
      flowKV.put(cacheKey, targetFlow);
    }
    return targetFlow;
  }
  function isLLMRequest(parsedObj) {
    return !!parsedObj && (!!parsedObj["messages"] || !!parsedObj["prompt"]) && !!parsedObj["model"];
  }
  function isLLMResponse(parsedObj) {
    return !!parsedObj && !!parsedObj["choices"] && !!parsedObj["model"];
  }
  async function createIFrameElement(html2) {
    let container = document.getElementById("mitmproxy-llm-better-view-container");
    if (!container) {
      const contentview = document.querySelector(".contentview");
      if (!contentview) {
        console.warn("no `.contentview` element found");
        return;
      }
      const secondChild = contentview.childNodes[1];
      container = document.createElement("details");
      container.toggleAttribute("open");
      container.id = "mitmproxy-llm-better-view-container";
      container.classList = "llm-better-view";
      contentview.insertBefore(container, secondChild);
    }
    let summaryElement = Array.from(container.children).find(
      (el) => el.tagName.toLowerCase() === "summary"
    );
    if (!summaryElement) {
      summaryElement = document.createElement("summary");
      summaryElement.textContent = "LLM Better View";
      container.prepend(summaryElement);
    }
    const resizeIframeContent = () => {
      var _a2;
      try {
        const iframeDocument = iframeElement.contentDocument || ((_a2 = iframeElement.contentWindow) == null ? void 0 : _a2.document);
        const height = iframeDocument == null ? void 0 : iframeDocument.documentElement.offsetHeight;
        iframeElement.style.height = height + "px";
      } catch (e2) {
        console.warn(e2);
      }
    };
    for (const observerId in mutationObservers) {
      mutationObservers[observerId].disconnect();
      delete mutationObservers[observerId];
    }
    if (iframeElement && container.contains(iframeElement)) {
      container.removeChild(iframeElement);
    }
    iframeElement = _GM_addElement(container, "iframe", {
      scrolling: "no",
      frameborder: "0",
      style: "width: 100%; height: 100%; border: none; overflow: hidden; display: block; background: transparent; ",
      csp: "default-src 'unsafe-eval'  'unsafe-inline' ",
      srcdoc: html2
      // src: blobUrl
    });
    iframeElement.onload = () => {
      var _a2;
      resizeIframeContent();
      const iframeDocument = iframeElement.contentDocument || ((_a2 = iframeElement.contentWindow) == null ? void 0 : _a2.document);
      if (iframeDocument) {
        const observer = new MutationObserver(resizeIframeContent);
        observer.observe(iframeDocument.body, { childList: true, subtree: true, attributes: true });
        const observerId = `${Date.now()}`;
        iframeElement.dataset.mutationObserverId = observerId;
        mutationObservers[observerId] = observer;
      }
    };
    container.appendChild(iframeElement);
  }

})();