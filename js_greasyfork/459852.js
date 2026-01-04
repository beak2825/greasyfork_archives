// ==UserScript==
// @name       知乎历史记录
// @namespace  https://maxchang.me
// @version    1.2.3
// @author     Max Chang
// @license    MIT
// @icon       https://static.zhihu.com/heifetz/favicon.ico
// @match      https://www.zhihu.com/
// @match      https://www.zhihu.com/follow*
// @match      https://www.zhihu.com/hot*
// @match      https://www.zhihu.com/column-square*
// @match      https://www.zhihu.com/search?*
// @match      https://www.zhihu.com/topic/*
// @grant      GM_addStyle
// @grant      GM_getValue
// @grant      GM_info
// @grant      GM_registerMenuCommand
// @grant      GM_setValue
// @grant      unsafeWindow
// @description 给知乎添加历史记录
// @downloadURL https://update.greasyfork.org/scripts/459852/%E7%9F%A5%E4%B9%8E%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/459852/%E7%9F%A5%E4%B9%8E%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const r=document.createElement("style");r.textContent=o,document.head.append(r)})(' ._item_s1d3p_1{padding:var(--spacing-md) 0;border-bottom:1px solid var(--shadow-color);display:flex;flex-direction:column}._item_s1d3p_1:last-child{border-bottom:none}._link_s1d3p_12{flex:1;color:var(--text-color);text-decoration:none;min-width:0}._link_s1d3p_12:hover,._link_s1d3p_12:focus{color:var(--primary-color)}._header_s1d3p_24{display:flex}._visitTime_s1d3p_28{color:var(--text-secondary);font-size:var(--font-size-sm);white-space:nowrap;flex-shrink:0}._title_s1d3p_35{flex:1;font-weight:500;transition:color .2s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}._content_s1d3p_45{color:var(--text-secondary);font-size:var(--font-size-sm);margin:var(--spacing-sm) 0 0 0;overflow:hidden;text-overflow:ellipsis;word-break:break-word;display:-webkit-box;line-clamp:2;-webkit-box-orient:vertical;-webkit-line-clamp:2}._content_s1d3p_45 em{font-style:normal;background-color:#ffe60066;border-radius:2px;padding:0 2px;margin:0 -2px;font-weight:500}._answer_s1d3p_68:before,._article_s1d3p_69:before,._pin_s1d3p_70:before{background-color:var(--primary-bg);font-weight:700;font-size:var(--font-size-sm);padding:1px var(--spacing-sm) 0;border-radius:var(--border-radius-sm);margin-right:var(--spacing-sm);display:inline-block}._answer_s1d3p_68:before{content:"\u95EE\u9898";color:#2196f3}._article_s1d3p_69:before{content:"\u6587\u7AE0";color:#004b87}._pin_s1d3p_70:before{content:"\u60F3\u6CD5";color:#60a912}._srOnly_s1d3p_95{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}._dialog_eoj9h_2,._dialog_eoj9h_2::backdrop{transition:display .25s allow-discrete,overlay .25s allow-discrete,opacity .25s;opacity:0}._dialog_eoj9h_2[open],._dialog_eoj9h_2[open]::backdrop{opacity:1}@starting-style{._dialog_eoj9h_2[open],._dialog_eoj9h_2[open]::backdrop{opacity:0}}._dialog_eoj9h_2{padding:0;border:0;border-radius:var(--border-radius);box-shadow:0 4px 12px var(--shadow-color);background-color:#fff;max-width:800px;width:80%;overflow:hidden;-webkit-user-select:text!important;user-select:text!important}._dialog_eoj9h_2::backdrop{background-color:var(--backdrop-color)}._content_eoj9h_39{background-color:var(--bg);padding:var(--spacing-lg) var(--spacing-xl);outline:none}._header_nqn5f_1{display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--spacing-sm);border-bottom:1px solid #eee;padding-bottom:var(--spacing-md)}._title_nqn5f_10{margin:0;font-size:18px;color:var(--text-color)}._body_nqn5f_16{max-height:70vh;overflow-y:auto}._list_nqn5f_21{list-style:none;margin:0;display:flex;flex-direction:column;padding:0 1.5em}._container_1sav8_1{position:relative;flex:1;margin:0 var(--spacing-lg);display:flex;align-items:center}._input_1sav8_9{flex:1;width:100%;padding:var(--spacing-sm) var(--spacing-md);padding-right:calc(var(--spacing-md) * 3);border:1px solid #eee;border-radius:var(--border-radius);font-size:var(--font-size-md);color:var(--text-color);background-color:#f9f9f9;transition:border-color .2s}._input_1sav8_9:focus{outline:none;border-color:var(--primary-light)}._clearButton_1sav8_27{position:absolute;right:var(--spacing-sm);background:none;border:none;cursor:pointer;color:var(--text-secondary);font-size:12px;padding:var(--spacing-sm);display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background-color .2s}._clearButton_1sav8_27:hover{background-color:#eee}._info_1sav8_47{padding:var(--spacing-sm) var(--spacing-lg);font-size:var(--font-size-sm);color:var(--text-secondary);background-color:#f5f5f5;margin-bottom:var(--spacing-md);border-radius:var(--border-radius-sm)}._emptyState_1sav8_56{text-align:center;padding:var(--spacing-xl);color:var(--text-secondary);font-style:italic}._historyCard_2h19t_1{background:var(--bg);border-radius:var(--border-radius-sm);box-shadow:0 1px 3px var(--shadow-color);margin-bottom:10px;padding:5px 0}._historyButton_2h19t_9{margin:0 18px;display:flex;justify-content:center;align-items:center;border:1px solid var(--primary-light);background:transparent;color:var(--primary-color);border-radius:var(--border-radius);height:40px;font-size:var(--font-size-md);cursor:pointer;width:calc(100% - 36px)}:root{--bg: white;--primary-color: rgb(5, 109, 232);--primary-light: rgba(5, 109, 232, .5);--primary-bg: rgba(33, 150, 243, .2);--text-color: #333;--text-secondary: #666;--shadow-color: hsla(0, 0%, 7%, .1);--backdrop-color: hsla(0, 0%, 7%, .65);--border-radius-sm: 2px;--border-radius: 4px;--spacing-sm: 4px;--spacing-md: 8px;--spacing-lg: 16px;--spacing-xl: 25px;--font-size-sm: 13px;--font-size-md: 14px}[data-theme=dark]{--bg: #191b1f;--primary-color: rgb(79, 195, 247);--primary-light: rgba(79, 195, 247, .5);--primary-bg: rgba(79, 195, 247, .2);--text-color: #e0e0e0;--text-secondary: #b0bec5;--shadow-color: hsla(0, 0%, 65%, .2);--backdrop-color: hsla(0, 0%, 7%, .85)} ');

(function (require$$1, ReactDOM) {
  'use strict';

  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  var objectAssign;
  var hasRequiredObjectAssign;
  function requireObjectAssign() {
    if (hasRequiredObjectAssign) return objectAssign;
    hasRequiredObjectAssign = 1;
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;
    function toObject(val) {
      if (val === null || val === void 0) {
        throw new TypeError("Object.assign cannot be called with null or undefined");
      }
      return Object(val);
    }
    function shouldUseNative() {
      try {
        if (!Object.assign) {
          return false;
        }
        var test1 = new String("abc");
        test1[5] = "de";
        if (Object.getOwnPropertyNames(test1)[0] === "5") {
          return false;
        }
        var test2 = {};
        for (var i = 0; i < 10; i++) {
          test2["_" + String.fromCharCode(i)] = i;
        }
        var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
          return test2[n];
        });
        if (order2.join("") !== "0123456789") {
          return false;
        }
        var test3 = {};
        "abcdefghijklmnopqrst".split("").forEach(function(letter) {
          test3[letter] = letter;
        });
        if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    objectAssign = shouldUseNative() ? Object.assign : function(target, source) {
      var from;
      var to = toObject(target);
      var symbols;
      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }
        if (getOwnPropertySymbols) {
          symbols = getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }
      return to;
    };
    return objectAssign;
  }
  /** @license React v17.0.2
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var hasRequiredReactJsxRuntime_production_min;
  function requireReactJsxRuntime_production_min() {
    if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
    hasRequiredReactJsxRuntime_production_min = 1;
    requireObjectAssign();
    var f = require$$1, g = 60103;
    reactJsxRuntime_production_min.Fragment = 60107;
    if ("function" === typeof Symbol && Symbol.for) {
      var h = Symbol.for;
      g = h("react.element");
      reactJsxRuntime_production_min.Fragment = h("react.fragment");
    }
    var m = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n = Object.prototype.hasOwnProperty, p = { key: true, ref: true, __self: true, __source: true };
    function q(c, a, k) {
      var b, d = {}, e = null, l = null;
      void 0 !== k && (e = "" + k);
      void 0 !== a.key && (e = "" + a.key);
      void 0 !== a.ref && (l = a.ref);
      for (b in a) n.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
      if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
      return { $$typeof: g, type: c, key: e, ref: l, props: d, _owner: m.current };
    }
    reactJsxRuntime_production_min.jsx = q;
    reactJsxRuntime_production_min.jsxs = q;
    return reactJsxRuntime_production_min;
  }
  var hasRequiredJsxRuntime;
  function requireJsxRuntime() {
    if (hasRequiredJsxRuntime) return jsxRuntime.exports;
    hasRequiredJsxRuntime = 1;
    {
      jsxRuntime.exports = requireReactJsxRuntime_production_min();
    }
    return jsxRuntime.exports;
  }
  var jsxRuntimeExports = requireJsxRuntime();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const item = "_item_s1d3p_1";
  const link = "_link_s1d3p_12";
  const header$1 = "_header_s1d3p_24";
  const visitTime = "_visitTime_s1d3p_28";
  const title$1 = "_title_s1d3p_35";
  const content$1 = "_content_s1d3p_45";
  const answer = "_answer_s1d3p_68";
  const article = "_article_s1d3p_69";
  const pin = "_pin_s1d3p_70";
  const srOnly = "_srOnly_s1d3p_95";
  const Item = {
    item,
    link,
    header: header$1,
    visitTime,
    title: title$1,
    content: content$1,
    answer,
    article,
    pin,
    srOnly
  };
  const formatTime = (date) => {
    const now = /* @__PURE__ */ new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1e3);
    if (diff < 60) return "刚刚";
    if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
    return date.toLocaleDateString("zh-CN");
  };
  const highlightTextWithPositions = (text, fieldPositions) => {
    if (!fieldPositions || fieldPositions.length === 0) return text;
    const highlightMarkers = new Array(text.length).fill(false);
    for (const { start, end } of fieldPositions) {
      const endIndex = Math.min(end, text.length);
      for (let i = start; i < endIndex; i++) {
        highlightMarkers[i] = true;
      }
    }
    const segments = [];
    let currentSegment = null;
    for (let i = 0; i < text.length; i++) {
      const shouldHighlight = highlightMarkers[i];
      if (!currentSegment || currentSegment.highlight !== shouldHighlight) {
        if (currentSegment) segments.push(currentSegment);
        currentSegment = {
          text: text[i],
          highlight: shouldHighlight
        };
        continue;
      }
      currentSegment.text += text[i];
    }
    if (currentSegment) segments.push(currentSegment);
    return segments.map(
      (segment, index) => segment.highlight ? /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: segment.text }, index) : /* @__PURE__ */ jsxRuntimeExports.jsx(require$$1.Fragment, { children: segment.text }, index)
    );
  };
  const HistoryItem = require$$1.forwardRef(({ item: item2, searchResult }, ref) => {
    const contentTypeMap = {
      answer: "问题",
      article: "文章",
      pin: "想法"
    };
    const visitTime2 = !item2.visitTime ? null : new Date(item2.visitTime);
    const formattedVisitTime = !visitTime2 ? null : {
      short: formatTime(visitTime2),
      full: visitTime2.toLocaleString("zh-CN")
    };
    const highlightedTitle = require$$1.useMemo(
      () => {
        var _a;
        return highlightTextWithPositions(item2.title, (_a = searchResult == null ? void 0 : searchResult.matches) == null ? void 0 : _a.title);
      },
      [item2.title, searchResult]
    );
    const highlightedContent = require$$1.useMemo(() => {
      var _a;
      if (!item2.content) return null;
      return highlightTextWithPositions(item2.content, (_a = searchResult == null ? void 0 : searchResult.matches) == null ? void 0 : _a.content);
    }, [item2.content, searchResult]);
    const highlightedAuthorName = require$$1.useMemo(() => {
      var _a;
      if (formattedVisitTime || !searchResult) return null;
      return highlightTextWithPositions(item2.authorName, (_a = searchResult.matches) == null ? void 0 : _a.authorName);
    }, [item2.authorName, formattedVisitTime, searchResult]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: Item.item, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: item2.url, className: Item.link, ref, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: Item.srOnly, children: contentTypeMap[item2.type] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: Item.header, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${Item.title} ${Item[item2.type]}`, children: highlightedTitle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: Item.visitTime, title: formattedVisitTime == null ? void 0 : formattedVisitTime.full, "aria-hidden": true, tabIndex: -1, children: (formattedVisitTime == null ? void 0 : formattedVisitTime.short) ?? (highlightedAuthorName || item2.authorName) })
        ] }),
        // 没有访问时间的是之前的历史记录，没有包含作者的 content，所以需要提示作者
        !formattedVisitTime && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: Item.srOnly, children: [
          "作者：",
          item2.authorName
        ] }),
        formattedVisitTime && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: Item.srOnly, children: [
          "浏览于",
          /* @__PURE__ */ jsxRuntimeExports.jsx("time", { dateTime: formattedVisitTime.short, children: formattedVisitTime.short })
        ] })
      ] }),
      item2.content && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: Item.content, children: highlightedContent })
    ] });
  });
  const dialog = "_dialog_eoj9h_2";
  const content = "_content_eoj9h_39";
  const styles$1 = {
    dialog,
    content
  };
  const Dialog = ({ isOpen, onClose, children, initialFocusRef, className = "" }) => {
    const dialogRef = require$$1.useRef(null);
    require$$1.useEffect(() => {
      var _a;
      const dialogElement = dialogRef.current;
      if (!dialogElement) return;
      if (isOpen) {
        dialogElement.showModal();
        document.body.style.overflow = "hidden";
        (_a = initialFocusRef == null ? void 0 : initialFocusRef.current) == null ? void 0 : _a.focus();
      } else if (dialogElement.open) {
        dialogElement.close();
        document.body.style.overflow = "";
      }
    }, [isOpen, initialFocusRef]);
    const handleClose = () => {
      onClose();
    };
    return ReactDOM.createPortal(
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "dialog",
        {
          ref: dialogRef,
          className: `${styles$1.dialog} ${className}`,
          onClose: handleClose,
          onClick: (e) => {
            if (e.target === dialogRef.current) {
              handleClose();
            }
          },
          onKeyDown: (e) => {
            if (e.key === "Escape") {
              handleClose();
            }
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles$1.content, children })
        }
      ),
      document.body
    );
  };
  const createSegmenter = () => {
    if (Intl == null ? void 0 : Intl.Segmenter) {
      const segmenterInstance = new Intl.Segmenter("zh", { granularity: "word" });
      return (text) => {
        const trimmedText = text.trim();
        if (!trimmedText) return [];
        const ignoreWords = /* @__PURE__ */ new Set([
          "的",
          "了",
          "是",
          "在",
          "和",
          "有",
          "就",
          "不",
          "也",
          "这",
          "那",
          "吗",
          "吧",
          "啊",
          "哦",
          "啦",
          "呀",
          "！",
          "？",
          "，",
          "。",
          "、",
          "；",
          "：",
          "“",
          "”",
          "‘",
          "’",
          "《",
          "》",
          "[",
          "]",
          "{",
          "}",
          ".",
          "(",
          ")",
          "【",
          "】",
          "——",
          "—",
          "…",
          "·"
        ]);
        const segments = Array.from(segmenterInstance.segment(trimmedText)).map((item2) => item2.segment.trim()).filter((word) => word && !ignoreWords.has(word));
        const uniqueTerms = /* @__PURE__ */ new Set([...segments, trimmedText]);
        return Array.from(uniqueTerms);
      };
    }
    return (text) => {
      const trimmedText = text.trim();
      if (!trimmedText) return [];
      const parts = trimmedText.split(/\s+/).map((part) => part.trim()).filter(Boolean);
      const uniqueTerms = /* @__PURE__ */ new Set([...parts, trimmedText]);
      return Array.from(uniqueTerms);
    };
  };
  const segmenter = createSegmenter();
  const isItemMatch = (item2, term) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    const { title: title2, content: content2, authorName } = item2;
    if (title2.toLowerCase().includes(lowerTerm)) return true;
    if (content2 == null ? void 0 : content2.toLowerCase().includes(lowerTerm)) return true;
    return authorName.toLowerCase().includes(lowerTerm);
  };
  const findAllMatches = (text, searchTerm) => {
    if (!text) return [];
    const result = [];
    const termLower = searchTerm.toLowerCase();
    let startIndex = 0;
    let matchIndex;
    while ((matchIndex = text.toLowerCase().indexOf(termLower, startIndex)) !== -1) {
      result.push({
        start: matchIndex,
        end: matchIndex + searchTerm.length,
        term: searchTerm
      });
      startIndex = matchIndex + 1;
    }
    return result;
  };
  const searchItem = (items, term) => {
    if (!term) return /* @__PURE__ */ new Map();
    const result = /* @__PURE__ */ new Map();
    const searchTerms = segmenter(term);
    items.forEach((item2, index) => {
      let hasMatches = false;
      const itemResult = {
        terms: [],
        matches: {}
      };
      for (const searchTerm of searchTerms) {
        if (!isItemMatch(item2, searchTerm)) continue;
        if (!itemResult.terms.includes(searchTerm)) {
          itemResult.terms.push(searchTerm);
        }
        hasMatches = true;
        const fields = ["title", "authorName"];
        if (item2.content) fields.push("content");
        fields.forEach((field) => {
          const text = item2[field];
          const matches = findAllMatches(text, searchTerm);
          if (matches.length > 0) {
            if (!itemResult.matches[field]) {
              itemResult.matches[field] = [];
            }
            itemResult.matches[field].push(...matches);
          }
        });
      }
      if (hasMatches) result.set(index, itemResult);
    });
    return result;
  };
  const log = (logMethod, tag, ...args) => {
    const colors = {
      log: "#2c3e50",
      error: "#ff4500",
      warn: "#f39c12"
    };
    const fontFamily = "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;";
    console[logMethod](
      `%c ${_GM_info.script.name} %c ${tag} `,
      `padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #056de8; font-weight: bold; ${fontFamily}`,
      `padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: ${colors[logMethod]}; font-weight: bold; ${fontFamily}`,
      ...args
    );
  };
  const logger = {
    log: (...args) => log("log", "日志", ...args),
    error: (...args) => log("error", "错误", ...args),
    warn: (...args) => log("warn", "警告", ...args)
  };
  class Result {
    constructor(inner) {
      this.inner = inner;
    }
    static Ok(value) {
      return new Result({ ok: true, value });
    }
    static Err(error) {
      return new Result({ ok: false, error });
    }
    static try(fn) {
      try {
        const val = fn();
        const okValue = val === void 0 ? null : val;
        return Result.Ok(okValue);
      } catch (err) {
        return Result.Err(err instanceof Error ? err : new Error(String(err)));
      }
    }
    isOk() {
      return this.inner.ok;
    }
    isErr() {
      return !this.inner.ok;
    }
    unwrap() {
      if (this.inner.ok) return this.inner.value;
      throw new Error("Tried to unwrap Err: " + JSON.stringify(this.inner.error));
    }
    unwrapErr() {
      if (!this.inner.ok) return this.inner.error;
      throw new Error("Tried to unwrapErr Ok: " + JSON.stringify(this.inner.value));
    }
    unwrapOr(defaultValue) {
      return this.inner.ok ? this.inner.value : defaultValue;
    }
    map(fn) {
      return this.inner.ok ? Result.Ok(fn(this.inner.value)) : Result.Err(this.inner.error);
    }
    mapErr(fn) {
      return this.inner.ok ? Result.Ok(this.inner.value) : Result.Err(fn(this.inner.error));
    }
    andThen(fn) {
      return this.inner.ok ? fn(this.inner.value) : Result.Err(this.inner.error);
    }
    match(handlers) {
      return this.inner.ok ? handlers.Ok(this.inner.value) : handlers.Err(this.inner.error);
    }
  }
  const STORAGE_KEY = "ZH_HISTORY";
  const HISTORY_LIMIT_KEY = "HISTORY_LIMIT";
  const DEFAULT_HISTORY_LIMIT = 20;
  const HISTORY_LIMIT = _GM_getValue(HISTORY_LIMIT_KEY) || DEFAULT_HISTORY_LIMIT;
  const setHistoryLimit = (limit) => {
    const numericLimit = Number(limit);
    if (!Number.isNaN(numericLimit) && numericLimit > 0) {
      _GM_setValue(HISTORY_LIMIT_KEY, numericLimit);
      return Result.Ok(null);
    }
    return Result.Err("输入无效，请输入一个正整数");
  };
  const saveHistory = (item2) => Result.try(() => {
    const raw = _GM_getValue(STORAGE_KEY);
    const historyItems = raw ? JSON.parse(raw) : [];
    const existingIndex = historyItems.findIndex((i) => i.itemId === item2.itemId);
    if (existingIndex !== -1) {
      historyItems.splice(existingIndex, 1);
    }
    historyItems.push(item2);
    if (historyItems.length > HISTORY_LIMIT) {
      historyItems.splice(0, historyItems.length - HISTORY_LIMIT);
    }
    _GM_setValue(STORAGE_KEY, JSON.stringify(historyItems));
  }).mapErr((error) => `保存浏览历史失败：${error}`);
  const importHistory = (history, merge = false) => {
    const parsedHistory = Result.try(() => JSON.parse(history)).unwrapOr([]).reverse();
    if (!Array.isArray(parsedHistory) || parsedHistory.length === 0) {
      return Result.Err("导入的历史记录格式不正确或为空数组");
    }
    let historyItems = getHistory(false);
    let mergeCount = 0;
    if (merge) {
      parsedHistory.forEach((item2) => {
        const existingIndex = historyItems.findIndex((i) => i.itemId === item2.itemId);
        if (existingIndex !== -1) {
          historyItems.splice(existingIndex, 1);
          mergeCount++;
        }
        historyItems.push(item2);
      });
    } else {
      historyItems = parsedHistory;
    }
    if (historyItems.length > HISTORY_LIMIT) {
      historyItems.splice(0, historyItems.length - HISTORY_LIMIT);
    }
    historyItems.sort((a, b) => (a.visitTime || 0) - (b.visitTime || 0));
    _GM_setValue(STORAGE_KEY, JSON.stringify(historyItems));
    return Result.Ok(
      `成功导入 ${parsedHistory.length} 条历史记录` + (mergeCount > 0 ? `，合并了 ${mergeCount} 条重复记录` : "")
    );
  };
  const migrateToGMStorage = () => Result.try(() => {
    logger.log("检测到旧的浏览历史数据，正在转换...");
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      _GM_setValue(STORAGE_KEY, raw);
      localStorage.removeItem(STORAGE_KEY);
    }
    logger.log("转换浏览历史数据成功");
  });
  const getHistory = (reverse = true) => Result.try(() => {
    if (localStorage.getItem(STORAGE_KEY) !== null) {
      const migrationResult = migrateToGMStorage();
      migrationResult.mapErr((error) => {
        logger.error("历史记录转换失败：", error);
      });
    }
    const raw = _GM_getValue(STORAGE_KEY);
    return raw ? reverse ? JSON.parse(raw).reverse() : JSON.parse(raw) : [];
  }).match({
    Ok: (history) => history,
    Err: (error) => {
      logger.error("获取浏览历史失败：", error);
      return [];
    }
  });
  const clearHistory = () => Result.try(() => {
    _GM_setValue(STORAGE_KEY, null);
  });
  function throttle(delay, callback, options) {
    var _ref = options || {}, _ref$noTrailing = _ref.noTrailing, noTrailing = _ref$noTrailing === void 0 ? false : _ref$noTrailing, _ref$noLeading = _ref.noLeading, noLeading = _ref$noLeading === void 0 ? false : _ref$noLeading, _ref$debounceMode = _ref.debounceMode, debounceMode = _ref$debounceMode === void 0 ? void 0 : _ref$debounceMode;
    var timeoutID;
    var cancelled = false;
    var lastExec = 0;
    function clearExistingTimeout() {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
    }
    function cancel(options2) {
      var _ref2 = options2 || {}, _ref2$upcomingOnly = _ref2.upcomingOnly, upcomingOnly = _ref2$upcomingOnly === void 0 ? false : _ref2$upcomingOnly;
      clearExistingTimeout();
      cancelled = !upcomingOnly;
    }
    function wrapper() {
      for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
        arguments_[_key] = arguments[_key];
      }
      var self = this;
      var elapsed = Date.now() - lastExec;
      if (cancelled) {
        return;
      }
      function exec() {
        lastExec = Date.now();
        callback.apply(self, arguments_);
      }
      function clear() {
        timeoutID = void 0;
      }
      if (!noLeading && debounceMode && !timeoutID) {
        exec();
      }
      clearExistingTimeout();
      if (debounceMode === void 0 && elapsed > delay) {
        if (noLeading) {
          lastExec = Date.now();
          if (!noTrailing) {
            timeoutID = setTimeout(debounceMode ? clear : exec, delay);
          }
        } else {
          exec();
        }
      } else if (noTrailing !== true) {
        timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === void 0 ? delay - elapsed : delay);
      }
    }
    wrapper.cancel = cancel;
    return wrapper;
  }
  function debounce(delay, callback, options) {
    var _ref = options || {}, _ref$atBegin = _ref.atBegin, atBegin = _ref$atBegin === void 0 ? false : _ref$atBegin;
    return throttle(delay, callback, {
      debounceMode: atBegin !== false
    });
  }
  function useDebouncedState(initialValue, delay = 300) {
    const [value, setValue] = require$$1.useState(initialValue);
    const [debouncedValue, setDebouncedValue] = require$$1.useState(initialValue);
    require$$1.useEffect(() => {
      const handler = debounce(delay, setDebouncedValue, {
        atBegin: true
      });
      handler(value);
      return () => {
        var _a;
        (_a = handler.cancel) == null ? void 0 : _a.call(handler);
      };
    }, [value, delay]);
    return [value, debouncedValue, setValue];
  }
  const header = "_header_nqn5f_1";
  const title = "_title_nqn5f_10";
  const body = "_body_nqn5f_16";
  const list = "_list_nqn5f_21";
  const Viewer = {
    header,
    title,
    body,
    list
  };
  const container = "_container_1sav8_1";
  const input = "_input_1sav8_9";
  const clearButton = "_clearButton_1sav8_27";
  const info = "_info_1sav8_47";
  const emptyState = "_emptyState_1sav8_56";
  const Search = {
    container,
    input,
    clearButton,
    info,
    emptyState
  };
  const SearchBox = ({ searchTerm, onSearchChange, placeholder = "搜索历史记录" }) => {
    const handleChange = (e) => {
      onSearchChange(e.target.value);
    };
    const clearSearch = () => {
      onSearchChange("");
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: Search.container, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          placeholder,
          className: Search.input,
          value: searchTerm,
          onChange: handleChange,
          "aria-label": placeholder,
          style: { backgroundColor: "transparent" }
        }
      ),
      searchTerm && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: Search.clearButton, onClick: clearSearch, "aria-label": "清除搜索", children: "✕" })
    ] });
  };
  const SearchStatus = ({ totalCount, matchedCount }) => {
    if (totalCount === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: Search.emptyState, children: "暂无浏览历史" });
    if (matchedCount !== -1) {
      if (matchedCount === 0) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: Search.emptyState, children: "没有找到匹配的历史记录" });
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: Search.info, children: [
        "找到 ",
        matchedCount,
        " 条匹配结果"
      ] });
    }
    return null;
  };
  const HistoryViewer = ({ isOpen, onClose }) => {
    const [searchTerm, debouncedValue, setSearchTerm] = useDebouncedState("", 300);
    const historyItems = getHistory();
    const matchedItems = require$$1.useMemo(() => searchItem(historyItems, debouncedValue), [historyItems, debouncedValue]);
    const firstItemRef = require$$1.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { isOpen, onClose, initialFocusRef: firstItemRef, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: Viewer.header, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: Viewer.title, children: "浏览历史" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SearchBox, { searchTerm, onSearchChange: setSearchTerm })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: Viewer.body, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SearchStatus, { totalCount: historyItems.length, matchedCount: searchTerm ? matchedItems.size : -1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: Viewer.list, children: historyItems.map((item2, i) => {
          const isMatch = !searchTerm || matchedItems.has(i);
          if (!isMatch) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            HistoryItem,
            {
              item: item2,
              searchResult: matchedItems.get(i),
              ref: i === 0 ? firstItemRef : null
            },
            item2.itemId
          );
        }) })
      ] })
    ] });
  };
  const historyCard = "_historyCard_2h19t_1";
  const historyButton = "_historyButton_2h19t_9";
  const styles = {
    historyCard,
    historyButton
  };
  const SidebarEntry = () => {
    const [isDialogOpen, setIsDialogOpen] = require$$1.useState(false);
    require$$1.useEffect(() => {
      const handleKeyDown = (event) => {
        const target = event.target;
        const isEditableTarget = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable || target.tagName === "SELECT";
        if (event.key === "h" && !isEditableTarget) {
          setIsDialogOpen((prev) => !prev);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: styles.historyCard, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: styles.historyButton,
          onClick: () => setIsDialogOpen(true),
          "aria-label": "历史记录,打开后按 Esc 关闭",
          "aria-haspopup": "dialog",
          type: "button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "历史记录" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryViewer, { isOpen: isDialogOpen, onClose: () => setIsDialogOpen(false) })
    ] });
  };
  const App = () => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarEntry, {}) });
  };
  const clearHistoryCommand = [
    "🗑 清空浏览历史记录",
    () => {
      alert(
        clearHistory().match({
          Ok: () => "清空成功",
          Err: (error) => `清空失败: ${error}`
        })
      );
    }
  ];
  const setHistoryLimitCommand = [
    `🔢 设置数量限制（当前：${HISTORY_LIMIT}）`,
    () => {
      const input2 = prompt(`请输入新的历史记录最大数量（默认 ${DEFAULT_HISTORY_LIMIT}）`);
      if (!input2) return;
      alert(
        setHistoryLimit(input2).match({
          Ok: () => "设置成功",
          Err: (error) => `设置失败: ${error}`
        })
      );
    }
  ];
  const exportDataCommand = [
    "📤 导出历史记录",
    () => {
      const history = getHistory();
      const blob = new Blob([JSON.stringify(history)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "zhihu_history.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  ];
  const importDataCommand = [
    "📂 导入历史记录",
    () => {
      const input2 = document.createElement("input");
      input2.type = "file";
      input2.accept = ".json";
      input2.onchange = async (event) => {
        var _a;
        const file = (_a = event.target.files) == null ? void 0 : _a[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          var _a2;
          const content2 = (_a2 = e.target) == null ? void 0 : _a2.result;
          if (typeof content2 !== "string") return;
          const merge = confirm(
            '⚠️危险操作 - 是否合并数据：\n\n• 点击"确定"：合并数据（注意：超出限制的项将被删除）\n• 点击"取消"：覆盖现有数据\n📋 建议先导出备份您的历史记录！'
          );
          alert(
            importHistory(content2, merge).match({
              Ok: (msg) => `导入成功: ${msg}`,
              Err: (error) => `导入失败: ${error}`
            })
          );
        };
        reader.readAsText(file);
      };
      input2.click();
    }
  ];
  const registerMenuCommand = (command) => _GM_registerMenuCommand(...command);
  const registerMenuCommands = () => [clearHistoryCommand, setHistoryLimitCommand, exportDataCommand, importDataCommand].forEach(registerMenuCommand);
  const CONTENT_TYPE = ["answer", "article", "pin"];
  const getPageType = (pathname) => {
    switch (pathname) {
      case "/":
      case "/follow":
      case "/hot":
      case "/column-square":
        return "home";
      case "/search":
        return "search";
      default:
        if (pathname.startsWith("/topic")) return "topic";
        return null;
    }
  };
  const truncateText = (text, maxLength = 120) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };
  function isIn(values, x) {
    return values.includes(x);
  }
  const extendMetadata = (item2, rawMetadata) => {
    var _a, _b;
    rawMetadata.visitTime = Date.now();
    const extractMetadata = () => {
      const span = item2.querySelector(".RichText");
      if (!span) return void 0;
      let text = span.innerText.trim();
      if (!text.startsWith(rawMetadata.authorName)) text = `${rawMetadata.authorName}：${text}`;
      return truncateText(text);
    };
    const extractPinTitle = () => {
      var _a2, _b2;
      const sourceBlock = (_a2 = item2 == null ? void 0 : item2.parentElement) == null ? void 0 : _a2.previousElementSibling;
      const firstLine = sourceBlock == null ? void 0 : sourceBlock.querySelector(".FeedSource-firstline");
      const titleText = ((_b2 = firstLine == null ? void 0 : firstLine.textContent) == null ? void 0 : _b2.split("·")[0]) ?? "";
      return titleText.trim();
    };
    switch (rawMetadata.type) {
      case "pin": {
        const userLink = (_a = item2.closest(".Feed")) == null ? void 0 : _a.querySelector(".UserLink-link");
        if (userLink) rawMetadata.authorName = userLink.innerText.trim();
        rawMetadata.url = `https://www.zhihu.com/pin/${rawMetadata.itemId}`;
        rawMetadata.title = extractPinTitle();
        rawMetadata.content = ((_b = item2.querySelector(".RichText")) == null ? void 0 : _b.textContent) ?? "";
        break;
      }
      case "article":
      case "answer": {
        if (!rawMetadata.url) {
          const linkEl = item2.querySelector(".ContentItem-title a");
          if (linkEl) rawMetadata.url = linkEl.href;
        }
        rawMetadata.content = extractMetadata();
        break;
      }
    }
    return rawMetadata;
  };
  const extractMetadataFromZop = (item2) => {
    const zop = item2.dataset.zop;
    if (!zop) return Result.Err(`无法读取回答或文章信息：${JSON.stringify(item2.dataset)}`);
    return Result.try(() => JSON.parse(zop)).mapErr((err) => `解析数据失败：${err}`);
  };
  const extractMetadataFromSearch = (item2) => {
    var _a, _b;
    const hotLandingId = item2.getAttribute("name");
    const type = item2.getAttribute("itemprop") || // 如果没有 `itemprop` 属性，检查是否有关注按钮，如果有的话，说明是单独的问题
    (item2.querySelector(".FollowButton") ? "answer" : void 0);
    if (!type) return Result.Err(`元素缺少 itemprop 属性：${truncateText(item2.outerHTML)}`);
    if (!isIn(CONTENT_TYPE, type))
      return Result.Err(`元素 itemprop 值不合法："${type}"，支持的类型：${CONTENT_TYPE.join(", ")}`);
    const authorName = ((_a = item2.querySelector("b[data-first-child]")) == null ? void 0 : _a.textContent) || // 未展开的回答
    ((_b = item2.querySelector(".AuthorInfo-name")) == null ? void 0 : _b.textContent) || // 已经展开的回答
    "";
    if (hotLandingId) {
      const newItem = item2.closest(".HotLanding-contentItem");
      if (newItem) item2 = newItem;
    }
    const linkEl = item2.querySelector("a");
    if (!linkEl) return Result.Err(`元素缺少链接标签：${truncateText(item2.outerHTML)}`);
    const url = linkEl.href + (hotLandingId ? `/answer/${hotLandingId}` : "");
    const titleElement = item2.querySelector(".ContentItem-title");
    if (!titleElement) return Result.Err(`元素缺少标题标签：${truncateText(item2.outerHTML)}`);
    const title2 = titleElement.innerText.trim();
    if (!title2) return Result.Err(`元素的标题内容为空`);
    const itemId = url.split("/").pop();
    if (!itemId) return Result.Err(`无法从 URL 中提取 itemId：${url}`);
    return Result.Ok({
      authorName,
      type,
      itemId,
      url,
      title: title2
    });
  };
  const saveHistoryFromElement = (item2, extractMetadata) => extractMetadata(item2).map((data) => extendMetadata(item2, data)).andThen(saveHistory);
  const saveHistoryFromHomePageElement = (item2) => saveHistoryFromElement(item2, extractMetadataFromZop);
  const saveHistoryFromSearchElement = (item2) => saveHistoryFromElement(item2, extractMetadataFromSearch);
  const trackZopHistory = (selector) => {
    const container2 = document.querySelector(selector);
    if (!container2) {
      logger.error("未找到首页推荐容器");
      return;
    }
    const handleContentItem = (getItem) => {
      const item2 = getItem();
      if (!item2) return;
      saveHistoryFromHomePageElement(item2).mapErr((err) => logger.error(err));
    };
    container2.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      handleContentItem(() => target.closest(".ContentItem"));
    });
    container2.addEventListener("keydown", (e) => {
      if (e.key !== "o") return;
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      handleContentItem(() => target.querySelector(".ContentItem"));
    });
  };
  const trackSearchHistory = () => {
    const params = new URLSearchParams(location.search);
    if (params.get("type") !== "content") return;
    const container2 = document.querySelector(".Search-container");
    if (!container2) {
      logger.error("未找到搜索结果容器");
      return;
    }
    const handleContentItem = (getItem) => {
      var _a, _b;
      let item2 = getItem();
      if (!item2) return;
      if (((_a = item2.dataset) == null ? void 0 : _a.zaDetailViewPathModule) === "Content") {
        const newItem = (_b = item2.parentElement) == null ? void 0 : _b.querySelectorAll(".ContentItem")[1];
        if (newItem) item2 = newItem;
      }
      saveHistoryFromSearchElement(item2).mapErr((err) => logger.error(err));
    };
    container2.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      handleContentItem(() => target.closest(".ContentItem"));
    });
    container2.addEventListener("keydown", (e) => {
      if (e.key !== "o") return;
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      handleContentItem(() => target.querySelector(".ContentItem"));
    });
  };
  const getContentSelector = (pageType) => {
    switch (pageType) {
      case "home":
        return "#TopstoryContent";
      case "topic":
        return "#TopicMain";
      default:
        return null;
    }
  };
  const trackHistory = () => {
    const pageType = getPageType(location.pathname);
    if (!pageType) {
      logger.error(`当前页面类型不支持：${location.pathname}`);
      return;
    }
    switch (pageType) {
      case "home":
      case "topic": {
        const selector = getContentSelector(pageType);
        if (selector) trackZopHistory(selector);
        break;
      }
      case "search":
        trackSearchHistory();
        break;
    }
  };
  console.log(
    "%c知乎历史记录",
    "color:#1772F6; font-weight:bold; font-size:3em; padding:5px; text-shadow:1px 1px 3px rgba(0,0,0,0.7)"
  );
  trackHistory();
  const mountApp = () => {
    var _a;
    const container2 = document.createElement("div");
    container2.id = "zh-history-root";
    const target = (_a = document.querySelector('a[aria-label="边栏锚点"]')) == null ? void 0 : _a.parentElement;
    if (!target) {
      logger.warn("未找到挂载点。");
      return;
    }
    target.insertBefore(container2, target.firstChild);
    ReactDOM.render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, {}), container2);
  };
  mountApp();
  registerMenuCommands();
  logger.log(`初始化成功，版本：${_GM_info.script.version}`);

})(unsafeWindow.React, unsafeWindow.ReactDOM);