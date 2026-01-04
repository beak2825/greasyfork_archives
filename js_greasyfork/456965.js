// ==UserScript==
// @name               豆瓣读书书架
// @name:zh            豆瓣读书书架
// @namespace          https://github.com/ilyydy/tampermonkey-script
// @version            0.0.4
// @author             ilyydy
// @description        无需登录，快速选择书籍加入书架，复制导出书籍信息
// @description:zh     无需登录，快速选择书籍加入书架，复制导出书籍信息
// @description:zh-CN  无需登录，快速选择书籍加入书架，复制导出书籍信息
// @license            MIT
// @icon               data:image/x-icon;base64,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AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP+RwIn////////////4+/j/GnwK/xF3AP8RdwD/EXcA/xF3AP8afAr/+Pv4////////////kcCJ/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/9Xn0v///////////77auf8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP++2rn////////////V59L/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8rhhz/////////////////erNw/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/3qzcP////////////////8rhhz/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/26sZP////////////////81jCf/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/NYwn/////////////////26sZP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/vdm4////////////5PDi/y+IIP8viCD/L4gg/y+IIP8viCD/L4gg/y+IIP8viCD/5PDi////////////vdm4/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/0+bQ/////////////////////////////////////////////////////////////////////////////////////////////////9Pm0P8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP/T5tD/////////////////////////////////////////////////////////////////////////////////////////////////0+bQ/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/9Pm0P///////////9vq2P+Iu4D/iLuA/4i7gP+Iu4D/iLuA/4i7gP+Iu4D/iLuA/4i7gP+Iu4D/iLuA/4i7gP/b6tj////////////T5tD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/0+bQ////////////tdWw/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/7XVsP///////////9Pm0P8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP/T5tD///////////+11bD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/tdWw////////////0+bQ/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/9Pm0P///////////7XVsP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP+11bD////////////T5tD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/0+bQ////////////tdWw/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/7XVsP///////////9Pm0P8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP/T5tD////////////b6tj/iLuA/4i7gP+Iu4D/iLuA/4i7gP+Iu4D/iLuA/4i7gP+Iu4D/iLuA/4i7gP+Iu4D/2+rY////////////0+bQ/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/9Pm0P/////////////////////////////////////////////////////////////////////////////////////////////////T5tD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/0+bQ/////////////////////////////////////////////////////////////////////////////////////////////////9Pm0P8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/+Lu4P//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4u7g/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/4u7g///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////i7uD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP/i7uD//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Lu4P8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AOYRdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwDmEXcASRF3AOYRdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA/xF3AP8RdwD/EXcA5hF3AEkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @supportURL         https://github.com/ilyydy/tampermonkey-script/issues
// @match              http*://*book.douban.com/*
// @match              http*://search.douban.com/book/*
// @require            https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.global.prod.js
// @require            data:application/javascript,window.Vue%3DVue%3B
// @require            https://cdn.jsdelivr.net/npm/element-plus@2.2.19/dist/index.full.min.js
// @require            https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @require            https://cdn.jsdelivr.net/npm/csv-stringify@6.2.3/dist/iife/sync.js
// @resource           element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.2.19/dist/index.css
// @connect            book.douban.com
// @grant              GM_getResourceText
// @grant              GM_getValue
// @grant              GM_setClipboard
// @grant              GM_setValue
// @grant              GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/456965/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E4%B9%A6%E6%9E%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/456965/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E4%B9%A6%E6%9E%B6.meta.js
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.innerText=t,document.head.appendChild(e)})(".book-field[data-v-5f2bdcc9]{margin-bottom:5px}.item[data-v-bdb4b0de]{display:grid;grid-template-columns:80% 20%}.item-button[data-v-bdb4b0de]{display:grid}.affix[data-v-ed4eeb8f]{position:fixed;bottom:50px;right:50px}.book-list-container[data-v-ed4eeb8f]{margin:auto 20px}.book-list-container-header[data-v-ed4eeb8f]{margin-bottom:20px}.book-list-container-header-select[data-v-ed4eeb8f]{margin-left:10px;width:140px}.book-list-container-header-item[data-v-ed4eeb8f]{margin-left:10px}.book-list-container-empty p[data-v-ed4eeb8f]{font-size:18px;text-align:center}.book-list-container-book-item[data-v-ed4eeb8f]{margin-bottom:20px}");

(function(vue, elementPlus, sync, XLSX2) {
  "use strict";
  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e) {
      for (const k in e) {
        if (k !== "default") {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }
  const XLSX__namespace = /* @__PURE__ */ _interopNamespaceDefault(XLSX2);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t, document.head.append(o), t;
  };
  cssLoader("element-plus/dist/index.css");
  /*! Element Plus Icons Vue v2.0.10 */
  var export_helper_default = (sfc, props) => {
    let target = sfc.__vccOpts || sfc;
    for (let [key, val] of props)
      target[key] = val;
    return target;
  };
  var arrow_down_vue_vue_type_script_lang_default = {
    name: "ArrowDown"
  };
  var _hoisted_16 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_26 = /* @__PURE__ */ vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
  }, null, -1), _hoisted_36 = [
    _hoisted_26
  ];
  function _sfc_render6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_16, _hoisted_36);
  }
  var arrow_down_default = /* @__PURE__ */ export_helper_default(arrow_down_vue_vue_type_script_lang_default, [["render", _sfc_render6], ["__file", "arrow-down.vue"]]);
  var arrow_left_vue_vue_type_script_lang_default = {
    name: "ArrowLeft"
  };
  var _hoisted_18 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_28 = /* @__PURE__ */ vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0z"
  }, null, -1), _hoisted_38 = [
    _hoisted_28
  ];
  function _sfc_render8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_18, _hoisted_38);
  }
  var arrow_left_default = /* @__PURE__ */ export_helper_default(arrow_left_vue_vue_type_script_lang_default, [["render", _sfc_render8], ["__file", "arrow-left.vue"]]);
  var monkeyWindow = window;
  var GM_setValue = /* @__PURE__ */ (() => monkeyWindow.GM_setValue)();
  var GM_xmlhttpRequest = /* @__PURE__ */ (() => monkeyWindow.GM_xmlhttpRequest)();
  var GM_setClipboard = /* @__PURE__ */ (() => monkeyWindow.GM_setClipboard)();
  var GM_getValue = /* @__PURE__ */ (() => monkeyWindow.GM_getValue)();
  const BOOK_SHELF_KEY = "tampermonkey_douban_books";
  let books;
  function useStore$1(force = false) {
    if (!books || force) {
      {
        books = vue.reactive(JSON.parse(GM_getValue(BOOK_SHELF_KEY, "[]")));
        vue.watch(books, (newValue) => {
          GM_setValue(BOOK_SHELF_KEY, JSON.stringify(newValue));
        });
      }
    }
    return books;
  }
  function getBookIdx(id) {
    return books.findIndex((i) => i.id === id);
  }
  function getBook$1(id) {
    return books.find((i) => i.id === id);
  }
  function hasBook(id) {
    return getBookIdx(id) !== -1;
  }
  function addBook(book) {
    if (!hasBook(book.id)) {
      books.push({ ...book, addTime: Date.now() });
      return { success: true, msg: "" };
    } else {
      return { success: false, msg: `《${book.title}》 已在书架中` };
    }
  }
  function removeBook(id) {
    const idx = getBookIdx(id);
    if (idx === -1)
      return false;
    books.splice(idx, 1);
    return true;
  }
  function clearBook() {
    books.splice(0, books.length);
  }
  const booksStore = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    BOOK_SHELF_KEY,
    addBook,
    get books() {
      return books;
    },
    clearBook,
    getBook: getBook$1,
    getBookIdx,
    hasBook,
    removeBook,
    useStore: useStore$1
  }, Symbol.toStringTag, { value: "Module" }));
  function useStore(force = false) {
    useStore$1(force);
    return { booksStore };
  }
  function success(msg) {
    return elementPlus.ElMessage.success({ message: msg, showClose: true, grouping: true });
  }
  function warning(msg) {
    console.warn(msg);
    return elementPlus.ElMessage.warning({ message: msg, showClose: true, grouping: true });
  }
  function error(msg) {
    console.error(msg);
    return elementPlus.ElMessage.error({ message: msg, showClose: true, grouping: true });
  }
  function exportCsv(rows, filename, options) {
    const v = sync.stringify(rows, options);
    {
      const link = document.createElement("a");
      link.download = filename;
      const blob = new Blob([v], { type: "text/csv;charset=utf-8;" });
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }
  function exportXlsx(rows, filename, aoa2SheetOpts, writingOptions) {
    const worksheet = XLSX__namespace.utils.aoa_to_sheet(rows, aoa2SheetOpts);
    const workbook = XLSX__namespace.utils.book_new();
    XLSX__namespace.utils.book_append_sheet(workbook, worksheet);
    XLSX__namespace.writeFile(workbook, filename, writingOptions);
  }
  const BOOK_FIELD_MAP = {
    id: "id",
    title: "书名",
    subTitle: "副标题",
    originName: "原作名",
    authors: "作者",
    translators: "译者",
    publishingHouse: "出版社",
    publishingTime: "出版时间",
    seriesName: "丛书",
    page: "页数",
    ISBN: "ISBN",
    score: "评分",
    scorePeopleCount: "评分人数",
    coverUrl: "封面图链接",
    doubanUrl: "豆瓣链接",
    contentBrief: "内容简介"
  };
  const defaultBookFields = Object.keys(BOOK_FIELD_MAP);
  const excelFormatterMap = defaultBookFields.reduce((pre, field) => {
    switch (field) {
      case "authors":
      case "translators":
        pre[field] = (book) => book[field].join(", ");
        break;
      default:
        pre[field] = (book) => book[field];
        break;
    }
    return pre;
  }, {});
  const specialBookItemFormatters = [
    {
      key: "id",
      label: BOOK_FIELD_MAP.id,
      type: "link",
      getLink: (book) => book.doubanUrl
    },
    {
      key: "doubanUrl",
      label: BOOK_FIELD_MAP.doubanUrl,
      type: "link",
      getLink: (book) => book.doubanUrl
    },
    {
      key: "coverUrl",
      label: BOOK_FIELD_MAP.coverUrl,
      type: "link",
      getLink: (book) => book.coverUrl
    },
    {
      key: "authors",
      label: BOOK_FIELD_MAP.authors,
      type: "string",
      getText: (book) => book.authors.join(", ")
    },
    {
      key: "translators",
      label: BOOK_FIELD_MAP.translators,
      type: "string",
      getText: (book) => book.translators.join(", ")
    },
    {
      key: "contentBrief",
      label: BOOK_FIELD_MAP.contentBrief,
      type: "string",
      getText: (book) => book.contentBrief,
      styleObj: {
        "line-height": "30px",
        "white-space": "pre-line",
        "max-height": "300px",
        "padding-right": "20px",
        width: "98%",
        display: "inline-block",
        overflow: "auto"
      }
    }
  ];
  const bookItemFormatters = defaultBookFields.map((field) => {
    const v = specialBookItemFormatters.find((i) => i.key === field);
    if (v)
      return v;
    return {
      key: field,
      label: BOOK_FIELD_MAP[field],
      type: "string",
      getText: (book) => book[field]
    };
  });
  function getBookViewText(book, fields = defaultBookFields) {
    const textList = [];
    fields.forEach((i) => {
      const v = book[i];
      if (Array.isArray(v)) {
        if (v.length > 0)
          textList.push(`${BOOK_FIELD_MAP[i]}: ${v.join(", ")}`);
      } else if (v) {
        textList.push(`${BOOK_FIELD_MAP[i]}: ${v}`);
      }
    });
    return textList.join("\n");
  }
  async function copyBook(book, fields = defaultBookFields) {
    const text = getBookViewText(book, fields);
    GM_setClipboard(text, "text");
  }
  async function copyBookWithTip(book, fields = defaultBookFields) {
    try {
      await copyBook(book);
      success("复制成功");
    } catch (err) {
      error(err.msg);
    }
  }
  const exportCsvName = "豆瓣书籍导出.csv";
  function exportBookCsv(books2, filename = exportCsvName, options = { bom: true }) {
    const header = defaultBookFields.map((field) => BOOK_FIELD_MAP[field]);
    const data = [header];
    books2.forEach((book) => {
      const row = defaultBookFields.map((field) => {
        return excelFormatterMap[field](book);
      });
      data.push(row);
    });
    exportCsv(data, filename, options);
  }
  const exportXlsxName = "豆瓣书籍导出.xlsx";
  function exportBookXlsx(books2, filename = exportXlsxName, aoa2SheetOpts, writingOptions) {
    const header = defaultBookFields.map((field) => BOOK_FIELD_MAP[field]);
    const data = [header];
    books2.forEach((book) => {
      const row = defaultBookFields.map((field) => {
        return excelFormatterMap[field](book);
      });
      data.push(row);
    });
    exportXlsx(data, filename, aoa2SheetOpts, writingOptions);
  }
  const _hoisted_1$3 = { key: 0 };
  const _hoisted_2$2 = { key: 1 };
  const _hoisted_3$1 = ["href"];
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "BookFormatter",
    props: {
      book: null,
      fields: { default: () => defaultBookFields },
      hideEmptyField: { type: Boolean, default: true }
    },
    setup(__props) {
      const props = __props;
      const bookFormatter = vue.computed(
        () => bookItemFormatters.filter((i) => {
          if (!props.fields.includes(i.key))
            return false;
          if (!props.hideEmptyField)
            return true;
          const v = props.book[i.key];
          if (Array.isArray(v))
            return v.length > 0;
          return !!props.book[i.key];
        })
      );
      return (_ctx, _cache) => {
        return vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(bookFormatter), (item) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            class: "book-field",
            key: item.key
          }, [
            item.key === "contentBrief" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, vue.toDisplayString(item.label) + ":", 1)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_2$2, vue.toDisplayString(item.label) + ": ", 1)),
            item.type === "string" ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 2,
              style: vue.normalizeStyle(item.styleObj)
            }, vue.toDisplayString(item.getText ? item.getText(__props.book) : __props.book[item.key]), 5)) : item.type === "link" ? (vue.openBlock(), vue.createElementBlock("a", {
              key: 3,
              href: item.getLink ? item.getLink(__props.book) : `${__props.book[item.key]}`,
              target: "_blank",
              style: vue.normalizeStyle(item.styleObj)
            }, vue.toDisplayString(__props.book[item.key]), 13, _hoisted_3$1)) : vue.createCommentVNode("", true)
          ]);
        }), 128);
      };
    }
  });
  const BookFormatter_vue_vue_type_style_index_0_scoped_5f2bdcc9_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const BookFormatter = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-5f2bdcc9"]]);
  const _hoisted_1$2 = { class: "item" };
  const _hoisted_2$1 = { class: "item-button" };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "BookItem",
    props: {
      book: null
    },
    emits: ["select"],
    setup(__props, { emit }) {
      const props = __props;
      const { booksStore: booksStore2 } = useStore();
      const briefFields = ["id", "title", "authors", "score", "ISBN"];
      function select() {
        emit("select", props.book);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          vue.createElementVNode("div", null, [
            vue.createVNode(BookFormatter, {
              book: __props.book,
              fields: briefFields,
              "hide-empty-field": false
            }, null, 8, ["book"])
          ]),
          vue.createElementVNode("div", _hoisted_2$1, [
            vue.createElementVNode("div", null, [
              vue.createVNode(vue.unref(elementPlus.ElButton), {
                round: "",
                size: "small",
                type: "primary",
                onClick: select
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("详情")
                ]),
                _: 1
              })
            ]),
            vue.createElementVNode("div", null, [
              vue.createVNode(vue.unref(elementPlus.ElButton), {
                round: "",
                size: "small",
                type: "primary",
                onClick: _cache[0] || (_cache[0] = () => vue.unref(copyBookWithTip)(__props.book))
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("复制")
                ]),
                _: 1
              })
            ]),
            vue.createElementVNode("div", null, [
              vue.createVNode(vue.unref(elementPlus.ElButton), {
                round: "",
                size: "small",
                type: "danger",
                onClick: _cache[1] || (_cache[1] = ($event) => vue.unref(booksStore2).removeBook(__props.book.id))
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("移除")
                ]),
                _: 1
              })
            ])
          ])
        ]);
      };
    }
  });
  const BookItem_vue_vue_type_style_index_0_scoped_bdb4b0de_lang = "";
  const BookItem = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-bdb4b0de"]]);
  const _hoisted_1$1 = { key: 0 };
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "BookDetail",
    props: {
      book: null,
      show: { type: Boolean }
    },
    emits: ["close"],
    setup(__props, { emit }) {
      function handleClose() {
        emit("close");
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(elementPlus.ElDialog), {
          "model-value": __props.show && !!__props.book,
          title: "书籍详情",
          width: "70%",
          style: { "max-height": "80vh" },
          "before-close": handleClose
        }, {
          default: vue.withCtx(() => [
            !!__props.book ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
              vue.createVNode(BookFormatter, { book: __props.book }, null, 8, ["book"])
            ])) : vue.createCommentVNode("", true)
          ]),
          _: 1
        }, 8, ["model-value"]);
      };
    }
  });
  const _withScopeId = (n) => (vue.pushScopeId("data-v-ed4eeb8f"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = { class: "affix" };
  const _hoisted_2 = { class: "book-list-container" };
  const _hoisted_3 = { class: "book-list-container-header" };
  const _hoisted_4 = { class: "book-list-container-body" };
  const _hoisted_5 = { key: 0 };
  const _hoisted_6 = {
    key: 1,
    class: "book-list-container-empty"
  };
  const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "书架为空", -1));
  const _hoisted_8 = [
    _hoisted_7
  ];
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "BookShelf",
    setup(__props) {
      const { booksStore: booksStore2 } = useStore();
      const showDrawer = vue.ref(false);
      const sortKey = vue.ref("addTime");
      const sortAsc = vue.ref(true);
      const books2 = vue.computed(() => {
        return [...booksStore2.books].sort((a, b) => {
          const aValue = a[sortKey.value];
          const bValue = b[sortKey.value];
          if (Array.isArray(aValue) || Array.isArray(bValue))
            return 0;
          return aValue > bValue ? sortAsc.value ? 1 : -1 : sortAsc.value ? -1 : 1;
        });
      });
      const selectedBook = vue.ref(void 0);
      const showDetail = vue.ref(false);
      function selectBook(book) {
        selectedBook.value = book;
        showDetail.value = true;
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.withDirectives(vue.createElementVNode("div", _hoisted_1, [
            vue.createVNode(vue.unref(elementPlus.ElButton), {
              icon: vue.unref(arrow_left_default),
              circle: "",
              type: "primary",
              onClick: _cache[0] || (_cache[0] = ($event) => showDrawer.value = !showDrawer.value)
            }, null, 8, ["icon"])
          ], 512), [
            [vue.vShow, !showDrawer.value]
          ]),
          vue.createVNode(vue.unref(elementPlus.ElDrawer), {
            modelValue: showDrawer.value,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => showDrawer.value = $event),
            title: "书架"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_2, [
                vue.createElementVNode("div", _hoisted_3, [
                  vue.createVNode(vue.unref(elementPlus.ElDropdown), {
                    disabled: vue.unref(books2).length === 0
                  }, {
                    dropdown: vue.withCtx(() => [
                      vue.createVNode(vue.unref(elementPlus.ElDropdownMenu), null, {
                        default: vue.withCtx(() => [
                          vue.createVNode(vue.unref(elementPlus.ElDropdownItem), {
                            onClick: _cache[1] || (_cache[1] = () => vue.unref(exportBookXlsx)(vue.unref(books2)))
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("excel ")
                            ]),
                            _: 1
                          }),
                          vue.createVNode(vue.unref(elementPlus.ElDropdownItem), {
                            onClick: _cache[2] || (_cache[2] = () => vue.unref(exportBookCsv)(vue.unref(books2)))
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("csv ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(elementPlus.ElButton), {
                        type: "primary",
                        round: "",
                        disabled: vue.unref(books2).length === 0
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(" 导出"),
                          vue.createVNode(vue.unref(elementPlus.ElIcon), { class: "el-icon--right" }, {
                            default: vue.withCtx(() => [
                              vue.createVNode(vue.unref(arrow_down_default))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ]),
                    _: 1
                  }, 8, ["disabled"]),
                  vue.createVNode(vue.unref(elementPlus.ElButton), {
                    class: "book-list-container-header-item",
                    round: "",
                    type: "danger",
                    disabled: vue.unref(books2).length === 0,
                    onClick: vue.unref(booksStore2).clearBook
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("清空 ")
                    ]),
                    _: 1
                  }, 8, ["disabled", "onClick"])
                ]),
                vue.createElementVNode("div", _hoisted_4, [
                  vue.unref(books2).length > 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_5, [
                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(books2), (book) => {
                      return vue.openBlock(), vue.createElementBlock("div", {
                        class: "book-list-container-book-item",
                        key: book.id
                      }, [
                        vue.createVNode(BookItem, {
                          book,
                          onSelect: selectBook
                        }, null, 8, ["book"])
                      ]);
                    }), 128))
                  ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, _hoisted_8))
                ])
              ])
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(_sfc_main$2, {
            book: selectedBook.value,
            show: showDetail.value,
            onClose: _cache[4] || (_cache[4] = ($event) => showDetail.value = false)
          }, null, 8, ["book", "show"])
        ], 64);
      };
    }
  });
  const BookShelf_vue_vue_type_style_index_0_scoped_ed4eeb8f_lang = "";
  const BookShelf = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-ed4eeb8f"]]);
  function getMetaInfo(subjectDoc) {
    const data = {
      id: "",
      doubanUrl: "",
      title: "",
      ISBN: "",
      authors: []
    };
    const jsonElement = subjectDoc.querySelector('[type="application/ld+json"]');
    if (!jsonElement || !jsonElement.textContent) {
      return data;
    }
    const obj = JSON.parse(jsonElement.textContent);
    data.doubanUrl = obj.url;
    const id = obj.url.split("/")[4];
    data.id = id;
    data.title = obj.name;
    data.ISBN = obj.isbn;
    data.authors = obj.author.map((i) => i.name);
    return data;
  }
  function getFromA(element) {
    const aElements = [];
    let current = element;
    while (current) {
      const next = current.nextElementSibling;
      if (!next || next.tagName !== "A")
        break;
      current = next;
      aElements.push(current);
    }
    return aElements.map((i) => {
      var _a;
      return (_a = i.textContent) == null ? void 0 : _a.trim();
    });
  }
  function getFromText(element) {
    var _a, _b;
    const text = (_b = (_a = element.nextSibling) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    if (!text || text === ":")
      return "";
    return text;
  }
  function getFromAOrText(element) {
    const resultFromA = getFromA(element);
    if (resultFromA.length !== 0) {
      return resultFromA;
    }
    const resultFromText = getFromText(element);
    return resultFromText ? [resultFromText] : [];
  }
  function getExtraInfo(subjectDoc) {
    const data = {
      publishingHouse: "",
      subTitle: "",
      originName: "",
      publishingTime: "",
      seriesName: "",
      page: 0,
      translators: []
    };
    const plElements = subjectDoc.querySelectorAll("#info .pl");
    Array.from(plElements).forEach((element) => {
      var _a;
      switch ((_a = element.textContent) == null ? void 0 : _a.trim()) {
        case "出版社:":
          data.publishingHouse = getFromAOrText(element)[0] ?? "";
          break;
        case "副标题:":
          data.subTitle = getFromText(element);
          break;
        case "原作名:":
          data.originName = getFromText(element);
          break;
        case "译者":
          data.translators = getFromAOrText(element);
          break;
        case "出版年:":
          data.publishingTime = getFromText(element);
          break;
        case "页数:": {
          const pageStr = getFromText(element);
          data.page = pageStr ? Number.parseInt(pageStr, 10) : 0;
          break;
        }
        case "丛书:":
          data.seriesName = getFromAOrText(element)[0] ?? "";
          break;
      }
    });
    return data;
  }
  function getScoreInfo(subjectDoc) {
    var _a, _b, _c, _d;
    const element = subjectDoc.getElementById("interest_sectl");
    const scoreStr = (_b = (_a = element == null ? void 0 : element.querySelector("strong")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim();
    const scorePeopleCountStr = (_d = (_c = element == null ? void 0 : element.querySelector(".rating_people > span")) == null ? void 0 : _c.textContent) == null ? void 0 : _d.trim();
    let scorePeopleCount = 0;
    if (scorePeopleCountStr && !scorePeopleCountStr.includes("目前无人评价")) {
      scorePeopleCount = Number.parseInt(scorePeopleCountStr, 10);
    }
    return {
      score: scoreStr ? Number.parseFloat(scoreStr) : 0,
      scorePeopleCount
    };
  }
  function getContentBrief(subjectDoc) {
    var _a;
    const introElements = Array.from(
      subjectDoc == null ? void 0 : subjectDoc.querySelectorAll("#link-report .intro")
    );
    if (introElements.length === 0)
      return "";
    const pElements = ((_a = introElements[introElements.length - 1]) == null ? void 0 : _a.getElementsByTagName("p")) ?? [];
    return Array.from(pElements).reduce((str, current, idx) => {
      var _a2;
      const text = (_a2 = current.textContent) == null ? void 0 : _a2.trim();
      if (text)
        str += idx === 0 ? text : `
${text}`;
      return str;
    }, "");
  }
  function getCoverUrl(subjectDoc) {
    var _a;
    const imgElement = (_a = subjectDoc.getElementById("mainpic")) == null ? void 0 : _a.querySelector("img");
    return (imgElement == null ? void 0 : imgElement.src) ?? "";
  }
  function getBook(subjectDoc) {
    const book = {
      ...getMetaInfo(subjectDoc),
      ...getScoreInfo(subjectDoc),
      ...getExtraInfo(subjectDoc),
      contentBrief: getContentBrief(subjectDoc),
      coverUrl: getCoverUrl(subjectDoc)
    };
    return book;
  }
  function getAlreadyReadButton(subjectDoc) {
    return subjectDoc.querySelector("#interest_sect_level > a:nth-child(3)");
  }
  function getLasButton(subjectDoc) {
    return subjectDoc.querySelector(
      "#interest_sect_level > a:nth-last-of-type(1)"
    );
  }
  const parseHeaders = (rawHeaders = "") => {
    const headers = new Headers();
    const preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
    preProcessedHeaders.split("\r").map(function(header) {
      return header.startsWith(`
`) ? header.substring(1) : header;
    }).forEach(function(line) {
      var _a;
      const parts = line.split(":");
      const key = (_a = parts.shift()) == null ? void 0 : _a.trim();
      if (key) {
        const value = parts.join(":").trim();
        headers.append(key, value);
      }
    });
    return headers;
  };
  async function GM_Fetch(xhrRequest) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        async onload(e) {
          const resp = new Response(e.response ?? e.responseText, {
            status: e.status,
            statusText: e.statusText,
            headers: parseHeaders(e.responseHeaders)
          });
          Object.defineProperty(resp, "url", { value: e.finalUrl });
          resolve(resp);
        },
        async onerror() {
          reject(new TypeError("Network request failed"));
        },
        async ontimeout() {
          reject(new TypeError("Network request failed"));
        },
        async onabort() {
          reject(new DOMException("Aborted", "AbortError"));
        },
        ...xhrRequest
      });
    });
  }
  const IDENTIFY_CLASS = "douban_shelf_button";
  function createBtn(doc, id, text, clickHandler, style, classList) {
    const btn = doc.createElement("a");
    const clsList = classList || ["j", "a_show_login", "colbutt", "ll"];
    btn.classList.add(...clsList);
    btn.id = id;
    btn.href = "#";
    btn.rel = "nofollow";
    if (style) {
      Object.entries(style).map(([k, v]) => {
        btn.style[k] = v;
      });
    }
    const span = doc.createElement("span");
    span.classList.add(IDENTIFY_CLASS);
    span.textContent = text;
    span.style.fontSize = "13px";
    btn.appendChild(span);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      clickHandler();
    });
    return btn;
  }
  const COPY_ID = "douban-book-copy";
  const ADD_SHELF_ID = "douban-book-add-shelf";
  const COPY = "复制";
  const ADD_SHELF = "加入书架";
  function createCopyBtn(doc, getBook2, id = COPY_ID, style, classList) {
    const btn = createBtn(
      doc,
      id,
      COPY,
      async () => {
        const book = await getBook2(doc);
        if (!book)
          return;
        try {
          await copyBookWithTip(book);
          btn.dispatchEvent(new CustomEvent(COPY, { detail: true }));
        } catch (error2) {
          btn.dispatchEvent(new CustomEvent(COPY, { detail: false }));
          throw error2;
        }
      },
      style,
      classList
    );
    return btn;
  }
  function createAddBtn(doc, getBook2, id = ADD_SHELF_ID, style, classList) {
    const btn = createBtn(
      doc,
      id,
      ADD_SHELF,
      async () => {
        const book = await getBook2(doc);
        const { booksStore: booksStore2 } = useStore();
        const r = booksStore2.addBook(book);
        if (!r.success) {
          btn.dispatchEvent(new CustomEvent(ADD_SHELF, { detail: false }));
          warning(r.msg);
        } else {
          btn.dispatchEvent(new CustomEvent(ADD_SHELF, { detail: true }));
          success("加入成功");
        }
      },
      style,
      classList
    );
    return btn;
  }
  async function getBookPageHtmlByUrl(url) {
    const response = await GM_Fetch({ url });
    if (response.status !== 200) {
      return null;
    }
    const text = await response.text();
    return text;
  }
  function useInitBtns$5(doc) {
    if (!/\/subject\/\d+\/?$/.test(new URL(doc.URL).pathname)) {
      return;
    }
    const lastButton = getLasButton(doc);
    if (!lastButton) {
      warning(`定位'读过'按钮失败`);
      return;
    }
    const span = lastButton.querySelector("span");
    if ((span == null ? void 0 : span.textContent) === ADD_SHELF) {
      return;
    }
    const input = span == null ? void 0 : span.querySelector("input");
    const alreadyReadButton = (input == null ? void 0 : input.value) === "读过" ? lastButton : getAlreadyReadButton(doc);
    if (!alreadyReadButton) {
      warning(`定位'读过'按钮失败`);
      return;
    }
    const copyBtn = createCopyBtn(doc, getBook);
    const addBtn = createAddBtn(doc, getBook);
    alreadyReadButton.after(copyBtn);
    copyBtn.after(addBtn);
    return { copyBtn, addBtn };
  }
  function init$5(doc) {
    useInitBtns$5(doc);
  }
  function getBookItemList$4(searchDoc) {
    const rootEle = searchDoc.querySelector("#wrapper #root");
    if (!rootEle)
      return [];
    return Array.from(rootEle.querySelectorAll(".item-root")).reduce(
      (list, cur) => {
        var _a, _b, _c, _d, _e;
        const aEle = cur.querySelector("a");
        if ((_a = aEle == null ? void 0 : aEle.href) == null ? void 0 : _a.startsWith("https://book.douban.com/subject/")) {
          const name = ((_c = (_b = cur.querySelector(".detail .title")) == null ? void 0 : _b.querySelector("a")) == null ? void 0 : _c.textContent) ?? "";
          const id = ((_e = (_d = aEle == null ? void 0 : aEle.href) == null ? void 0 : _d.split("https://book.douban.com/subject/")[1]) == null ? void 0 : _e.split("/")[0]) ?? "";
          list.push({
            element: cur,
            url: aEle == null ? void 0 : aEle.href,
            id,
            name
          });
        }
        return list;
      },
      []
    );
  }
  function useInitBtns$4(doc) {
    const btn = doc.getElementById(`${COPY_ID}-0`);
    if (btn) {
      return false;
    }
    const { booksStore: booksStore2 } = useStore();
    const list = getBookItemList$4(doc);
    list.forEach(({ element, url, name, id }, idx) => {
      var _a;
      let bookCache = void 0;
      const getBook$12 = async () => {
        if (bookCache)
          return bookCache;
        const bookInStore = booksStore2.getBook(id);
        if (bookInStore) {
          bookCache = {
            ...bookInStore
          };
          delete bookCache.addTime;
          return bookCache;
        }
        const html = await getBookPageHtmlByUrl(url);
        if (!html) {
          throw new Error(`获取《${name}》页面失败`);
        }
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(html, "text/html");
        const book = getBook(htmlDoc);
        bookCache = book;
        return book;
      };
      const style = {
        marginTop: "7px"
      };
      const copyBtn = createCopyBtn(doc, getBook$12, `${COPY_ID}-${idx}`, style);
      const addBtn = createAddBtn(doc, getBook$12, `${ADD_SHELF_ID}-${idx}`, style);
      (_a = element.querySelector(".detail")) == null ? void 0 : _a.appendChild(copyBtn);
      copyBtn.after(addBtn);
    });
    return true;
  }
  function init$4(doc) {
    useInitBtns$4(doc);
  }
  function getBookItemList$3(seriesDoc) {
    return Array.from(
      seriesDoc.querySelectorAll("#content .subject-item")
    ).reduce((list, cur) => {
      var _a, _b, _c, _d;
      const aEle = (_a = cur.querySelector(".info")) == null ? void 0 : _a.querySelector("a");
      if ((_b = aEle == null ? void 0 : aEle.href) == null ? void 0 : _b.startsWith("https://book.douban.com/subject/")) {
        const id = ((_d = (_c = aEle == null ? void 0 : aEle.href) == null ? void 0 : _c.split("https://book.douban.com/subject/")[1]) == null ? void 0 : _d.split("/")[0]) ?? "";
        list.push({
          element: cur,
          url: aEle == null ? void 0 : aEle.href,
          id,
          name: (aEle == null ? void 0 : aEle.textContent) ?? ""
        });
      }
      return list;
    }, []);
  }
  function useInitBtns$3(doc) {
    if (!/\/series\/\d+\/?$/.test(new URL(doc.URL).pathname)) {
      return false;
    }
    const btn = doc.getElementById(`${COPY_ID}-0`);
    if (btn) {
      return false;
    }
    const { booksStore: booksStore2 } = useStore();
    const list = getBookItemList$3(doc);
    list.forEach(({ element, url, name, id }, idx) => {
      var _a;
      let bookCache = void 0;
      const getBook$12 = async () => {
        if (bookCache)
          return bookCache;
        const bookInStore = booksStore2.getBook(id);
        if (bookInStore) {
          bookCache = {
            ...bookInStore
          };
          delete bookCache.addTime;
          return bookCache;
        }
        const html = await getBookPageHtmlByUrl(url);
        if (!html) {
          throw new Error(`获取《${name}》页面失败`);
        }
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(html, "text/html");
        const book = getBook(htmlDoc);
        bookCache = book;
        return book;
      };
      const style = {
        marginTop: "7px"
      };
      const copyBtn = createCopyBtn(doc, getBook$12, `${COPY_ID}-${idx}`, style);
      const addBtn = createAddBtn(doc, getBook$12, `${ADD_SHELF_ID}-${idx}`, style);
      (_a = element.querySelector(".info")) == null ? void 0 : _a.appendChild(copyBtn);
      copyBtn.after(addBtn);
    });
    return true;
  }
  function init$3(doc) {
    useInitBtns$3(doc);
  }
  function getBookItemList$2(seriesDoc) {
    return Array.from(seriesDoc.querySelectorAll("#content .bkdesc")).reduce(
      (list, cur) => {
        var _a, _b, _c;
        const aEle = cur == null ? void 0 : cur.querySelector("a");
        if ((_a = aEle == null ? void 0 : aEle.href) == null ? void 0 : _a.startsWith("https://book.douban.com/subject/")) {
          const id = ((_c = (_b = aEle == null ? void 0 : aEle.href) == null ? void 0 : _b.split("https://book.douban.com/subject/")[1]) == null ? void 0 : _c.split("/")[0]) ?? "";
          list.push({
            element: cur,
            url: aEle == null ? void 0 : aEle.href,
            id,
            name: (aEle == null ? void 0 : aEle.textContent) ?? ""
          });
        }
        return list;
      },
      []
    );
  }
  function useInitBtns$2(doc) {
    if (!/\/works\/\d+\/?$/.test(new URL(doc.URL).pathname)) {
      return false;
    }
    const btn = doc.getElementById(`${COPY_ID}-0`);
    if (btn) {
      return false;
    }
    const { booksStore: booksStore2 } = useStore();
    const list = getBookItemList$2(doc);
    list.forEach(({ element, url, name, id }, idx) => {
      var _a;
      let bookCache = void 0;
      const getBook$12 = async () => {
        if (bookCache)
          return bookCache;
        const bookInStore = booksStore2.getBook(id);
        if (bookInStore) {
          bookCache = {
            ...bookInStore
          };
          delete bookCache.addTime;
          return bookCache;
        }
        const html = await getBookPageHtmlByUrl(url);
        if (!html) {
          throw new Error(`获取《${name}》页面失败`);
        }
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(html, "text/html");
        const book = getBook(htmlDoc);
        bookCache = book;
        return book;
      };
      const classList = ["j", "ll", "colbutt", "a_add2cart", "add2cart"];
      const copyBtn = createCopyBtn(
        doc,
        getBook$12,
        `${COPY_ID}-${idx}`,
        void 0,
        classList
      );
      const addBtn = createAddBtn(
        doc,
        getBook$12,
        `${ADD_SHELF_ID}-${idx}`,
        void 0,
        classList
      );
      (_a = element.querySelector(".rr")) == null ? void 0 : _a.appendChild(copyBtn);
      copyBtn.after(addBtn);
    });
    return true;
  }
  function init$2(doc) {
    useInitBtns$2(doc);
  }
  function getBookItemList$1(seriesDoc) {
    return Array.from(
      seriesDoc.querySelectorAll("#content .subject-item")
    ).reduce((list, cur) => {
      var _a, _b, _c, _d;
      const aEle = (_a = cur.querySelector(".info")) == null ? void 0 : _a.querySelector("a");
      if ((_b = aEle == null ? void 0 : aEle.href) == null ? void 0 : _b.startsWith("https://book.douban.com/subject/")) {
        const id = ((_d = (_c = aEle == null ? void 0 : aEle.href) == null ? void 0 : _c.split("https://book.douban.com/subject/")[1]) == null ? void 0 : _d.split("/")[0]) ?? "";
        list.push({
          element: cur,
          url: aEle == null ? void 0 : aEle.href,
          id,
          name: (aEle == null ? void 0 : aEle.textContent) ?? ""
        });
      }
      return list;
    }, []);
  }
  function useInitBtns$1(doc) {
    if (!/\/press\/\d+\/?$/.test(new URL(doc.URL).pathname)) {
      return false;
    }
    const btn = doc.getElementById(`${COPY_ID}-0`);
    if (btn) {
      return false;
    }
    const { booksStore: booksStore2 } = useStore();
    const list = getBookItemList$1(doc);
    list.forEach(({ element, url, name, id }, idx) => {
      var _a;
      let bookCache = void 0;
      const getBook$12 = async () => {
        if (bookCache)
          return bookCache;
        const bookInStore = booksStore2.getBook(id);
        if (bookInStore) {
          bookCache = {
            ...bookInStore
          };
          delete bookCache.addTime;
          return bookCache;
        }
        const html = await getBookPageHtmlByUrl(url);
        if (!html) {
          throw new Error(`获取《${name}》页面失败`);
        }
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(html, "text/html");
        const book = getBook(htmlDoc);
        bookCache = book;
        return book;
      };
      const style = {
        marginTop: "7px"
      };
      const classList = ["j", "a_collect_btn"];
      const copyBtn = createCopyBtn(
        doc,
        getBook$12,
        `${COPY_ID}-${idx}`,
        style,
        classList
      );
      const addBtn = createAddBtn(
        doc,
        getBook$12,
        `${ADD_SHELF_ID}-${idx}`,
        style,
        classList
      );
      (_a = element.querySelector(".ft .collect-info")) == null ? void 0 : _a.appendChild(copyBtn);
      copyBtn.after(addBtn);
    });
    return true;
  }
  function init$1(doc) {
    useInitBtns$1(doc);
  }
  function getBookItemList(seriesDoc) {
    return Array.from(seriesDoc.querySelectorAll("#content li")).reduce(
      (list, cur) => {
        var _a, _b, _c;
        const aEle = cur == null ? void 0 : cur.querySelector("a");
        if ((_a = aEle == null ? void 0 : aEle.href) == null ? void 0 : _a.startsWith("https://book.douban.com/subject/")) {
          const id = ((_c = (_b = aEle == null ? void 0 : aEle.href) == null ? void 0 : _b.split("https://book.douban.com/subject/")[1]) == null ? void 0 : _c.split("/")[0]) ?? "";
          list.push({
            element: cur,
            url: aEle == null ? void 0 : aEle.href,
            id,
            name: (aEle == null ? void 0 : aEle.textContent) ?? ""
          });
        }
        return list;
      },
      []
    );
  }
  function useInitBtns(doc) {
    if (!/\/author\/\d+\/books\/?$/.test(new URL(doc.URL).pathname)) {
      return false;
    }
    const btn = doc.getElementById(`${COPY_ID}-0`);
    if (btn) {
      return false;
    }
    const { booksStore: booksStore2 } = useStore();
    const list = getBookItemList(doc);
    list.forEach(({ element, url, name, id }, idx) => {
      var _a;
      let bookCache = void 0;
      const getBook$12 = async () => {
        if (bookCache)
          return bookCache;
        const bookInStore = booksStore2.getBook(id);
        if (bookInStore) {
          bookCache = {
            ...bookInStore
          };
          delete bookCache.addTime;
          return bookCache;
        }
        const html = await getBookPageHtmlByUrl(url);
        if (!html) {
          throw new Error(`获取《${name}》页面失败`);
        }
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(html, "text/html");
        const book = getBook(htmlDoc);
        bookCache = book;
        return book;
      };
      const classList = ["j", "a_collect_btn"];
      const copyBtn = doc.createElement("span");
      copyBtn.classList.add("gact");
      copyBtn.appendChild(
        createCopyBtn(doc, getBook$12, `${COPY_ID}-${idx}`, void 0, classList)
      );
      const addBtn = doc.createElement("span");
      addBtn.classList.add("gact");
      addBtn.appendChild(
        createAddBtn(doc, getBook$12, `${ADD_SHELF_ID}-${idx}`, void 0, classList)
      );
      (_a = element.querySelector(".author-collect")) == null ? void 0 : _a.appendChild(copyBtn);
      copyBtn.after(addBtn);
    });
    return true;
  }
  function init(doc) {
    useInitBtns(doc);
  }
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      vue.onMounted(async () => {
        const map = {
          ["book.douban.com/subject"]: init$5,
          ["search.douban.com/book"]: init$4,
          ["book.douban.com/series"]: init$3,
          ["book.douban.com/works"]: init$2,
          ["book.douban.com/press"]: init$1,
          ["book.douban.com/author"]: init
        };
        const url = new URL(document.URL);
        const initFunc = map[url.host + url.pathname.split("/").slice(0, 2).join("/")];
        if (initFunc) {
          initFunc(document);
        } else {
          console.warn(`${url} 没有对应的处理方法`);
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(BookShelf);
      };
    }
  });
  async function run(doc) {
    const app = document.createElement("div");
    doc.body.appendChild(app);
    setTimeout(() => {
      vue.createApp(_sfc_main).mount(app);
    });
  }
  run(document);
})(Vue, ElementPlus, csv_stringify_sync, XLSX);
