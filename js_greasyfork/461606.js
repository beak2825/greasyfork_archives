// ==UserScript==
// @name            JavBus-Guide 番号筛选器
// @name:en         JavBus-Guide Video Filter
// @namespace       javbus-guide
// @version         1.7.6
// @author          xyjtyskfydhqss
// @description     JavBus 影片筛选
// @description:en  JavBus Video Filter on list page
// @license         MIT
// @icon            https://www.javbus.com/favicon.ico
// @homepageURL     https://sleazyfork.org/zh-CN/scripts/461606-javbus-guide-%E7%95%AA%E5%8F%B7%E7%AD%9B%E9%80%89%E5%99%A8
// @include         /^https?:\/\/www\.(jav|bus|dmm|see|cdn|fan){2}\.[\w]+\/.*$/
// @match           https://www.javbus.com/*
// @require         https://registry.npmmirror.com/jquery/3.7.1/files/dist/jquery.min.js
// @require         https://registry.npmmirror.com/react/18.3.1/files/umd/react.production.min.js
// @require         https://registry.npmmirror.com/react-dom/18.3.1/files/umd/react-dom.production.min.js
// @require         https://registry.npmmirror.com/lodash/4.17.21/files/lodash.min.js
// @require         https://registry.npmmirror.com/dayjs/1.11.13/files/dayjs.min.js
// @require         https://registry.npmmirror.com/antd/5.20.3/files/dist/antd-with-locales.min.js
// @grant           GM.xmlHttpRequest
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_openInTab
// @grant           GM_registerMenuCommand
// @grant           GM_setClipboard
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/461606/JavBus-Guide%20%E7%95%AA%E5%8F%B7%E7%AD%9B%E9%80%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461606/JavBus-Guide%20%E7%95%AA%E5%8F%B7%E7%AD%9B%E9%80%89%E5%99%A8.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const t=document.createElement("style");t.textContent=n,document.head.append(t)})(` .i-icon{display:inline-block;color:inherit;font-style:normal;line-height:0;text-align:center;text-transform:none;vertical-align:-.125em;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.i-icon-spin svg{animation:i-icon-spin 1s infinite linear}.i-icon-rtl{transform:scaleX(-1)}@keyframes i-icon-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-webkit-keyframes i-icon-spin{100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}._item_is514_1 {
  float: none;
  margin: 0;
  width: 100%;
  --x-bgc: #121212;
  --x-sub-bgc: #202020;
  --x-ftc: #fffffff2;
  --x-sub-ftc: #aaa;
  --x-grey: #313131;
  --x-blue: #0a84ff;
  --x-orange: #ff9f0a;
  --x-green: #30d158;
  --x-red: #ff453a;
  --x-yellow: #ffd60a;
  --x-line-h: 22px;
  --x-thumb-w: 190px;
  --x-cover-w: 360px;
  --x-thumb-ratio: 147 / 200;
  --x-cover-ratio: 400 / 269;
  --x-avatar-ratio: 1;
  --x-sprite-ratio: 4 / 3;
}
._item_is514_1 ._movie-box_is514_23 {
  display: block;
  background-color: #fff;
  overflow: hidden;
  padding: 0px;
  border: none;
  border-radius: 0px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
._item_is514_1 ._photo-frame_is514_32 {
  overflow: hidden;
  aspect-ratio: 135/91;
  margin: 10px;
  background: var(--x-sub-ftc);
}
._item_is514_1 ._photo-frame_is514_32 ._img_is514_38 {
  width: 100%;
  height: 100%;
  min-width: unset;
  max-width: none;
  min-height: unset;
  max-height: none;
  margin: 0;
  object-fit: contain;
  opacity: 1;
  transition: opacity 0.25s linear;
}
._item_is514_1 ._photo-info-extra_is514_50 {
  height: auto !important;
  padding: 0 10px 10px !important;
  line-height: var(--x-line-h) !important;
  border: none !important;
  background: unset !important;
}
._item_is514_1 .x-ellipsis {
  display: -webkit-box !important;
  overflow: hidden;
  white-space: unset !important;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  word-break: break-all;
  -webkit-line-clamp: 2;
  height: calc(var(--x-line-h) * 2) !important;
}
._item_is514_1 .x-title {
  line-height: var(--x-line-h) !important;
}._container_13vny_1 {
  margin-left: auto !important;
  margin-right: auto !important;
  width: 95vw;
}

._actions-wrapper_13vny_7 {
  border-top: 2px solid #ccc;
  margin-top: 10px;
  padding-top: 10px;
}

._tag_13vny_13 {
  margin-left: 0;
  font-weight: normal;
  font-size: 130%;
}
._tag_13vny_13 ._no-select_13vny_18 {
  user-select: none;
}
._tag_13vny_13 .ant-checkbox-wrapper {
  font-size: 0;
}
._tag_13vny_13 .ant-checkbox-inner {
  width: 19.2px;
  height: 19.2px;
}
._tag_13vny_13 .ant-checkbox-inner::after {
  width: 6.8568px;
  height: 10.9704px;
}
._tag_13vny_13 .ant-checkbox + span {
  padding-left: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

._grid_13vny_39 {
  display: grid;
  grid-template-columns: repeat(var(--col), 1fr);
  row-gap: 20px;
  column-gap: 20px;
  --col: 4;
}

@media (width >= 700px) {
  ._grid_13vny_39 {
    --col: 2;
  }
}
@media (width >= 1045px) {
  ._grid_13vny_39 {
    --col: 3;
  }
}
@media (width >= 1390px) {
  ._grid_13vny_39 {
    --col: 4;
  }
}
@media (width >= 1735px) {
  ._grid_13vny_39 {
    --col: 5;
  }
}
@media (width >= 2080px) {
  ._grid_13vny_39 {
    --col: 6;
  }
}
@media (width >= 2425px) {
  ._grid_13vny_39 {
    --col: 7;
  }
}
@media (width >= 2770px) {
  ._grid_13vny_39 {
    --col: 8;
  }
}.page-star .star {
  display: flex;
}
.page-star .star .avatar-box {
  margin-left: 0;
}
.page-star #waterfall2,
.page-star .filtered-container {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 0;
}
.page-star #waterfall2 {
  display: none;
}

.page-series #waterfall {
  display: none;
} `);

(function (lodash, React__default, antd, zh_CN, require$$0, jq, dayjs) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
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

  const React__default__namespace = /*#__PURE__*/_interopNamespaceDefault(React__default);

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  /**
   * natural-orderby v3.0.2
   *
   * Copyright (c) Olaf Ennen
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   */
  var compareNumbers = function compareNumbers2(numberA, numberB) {
    if (numberA < numberB) {
      return -1;
    }
    if (numberA > numberB) {
      return 1;
    }
    return 0;
  };
  var compareUnicode = function compareUnicode2(stringA, stringB) {
    var result = stringA.localeCompare(stringB);
    return result ? result / Math.abs(result) : 0;
  };
  var RE_NUMBERS = /(^0x[\da-fA-F]+$|^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?(?!\.\d+)(?=\D|\s|$))|\d+)/g;
  var RE_LEADING_OR_TRAILING_WHITESPACES = /^\s+|\s+$/g;
  var RE_WHITESPACES = /\s+/g;
  var RE_INT_OR_FLOAT = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
  var RE_DATE = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[/-]\d{1,4}[/-]\d{1,4}|^\w+, \w+ \d+, \d{4})/;
  var RE_LEADING_ZERO = /^0+[1-9]{1}[0-9]*$/;
  var RE_UNICODE_CHARACTERS = /[^\x00-\x80]/;
  var stringCompare = function stringCompare2(stringA, stringB) {
    if (stringA < stringB) {
      return -1;
    }
    if (stringA > stringB) {
      return 1;
    }
    return 0;
  };
  var compareChunks = function compareChunks2(chunksA, chunksB) {
    var lengthA = chunksA.length;
    var lengthB = chunksB.length;
    var size = Math.min(lengthA, lengthB);
    for (var i2 = 0; i2 < size; i2++) {
      var chunkA = chunksA[i2];
      var chunkB = chunksB[i2];
      if (chunkA.normalizedString !== chunkB.normalizedString) {
        if (chunkA.normalizedString === "" !== (chunkB.normalizedString === "")) {
          return chunkA.normalizedString === "" ? -1 : 1;
        }
        if (chunkA.parsedNumber !== void 0 && chunkB.parsedNumber !== void 0) {
          var result = compareNumbers(chunkA.parsedNumber, chunkB.parsedNumber);
          if (result === 0) {
            return stringCompare(chunkA.normalizedString, chunkB.normalizedString);
          }
          return result;
        } else if (chunkA.parsedNumber !== void 0 || chunkB.parsedNumber !== void 0) {
          return chunkA.parsedNumber !== void 0 ? -1 : 1;
        } else if (RE_UNICODE_CHARACTERS.test(chunkA.normalizedString + chunkB.normalizedString)) {
          return compareUnicode(chunkA.normalizedString, chunkB.normalizedString);
        } else {
          return stringCompare(chunkA.normalizedString, chunkB.normalizedString);
        }
      }
    }
    if (lengthA > size || lengthB > size) {
      return lengthA <= size ? -1 : 1;
    }
    return 0;
  };
  var compareOtherTypes = function compareOtherTypes2(valueA, valueB) {
    if (!valueA.chunks ? valueB.chunks : !valueB.chunks) {
      return !valueA.chunks ? 1 : -1;
    }
    if (valueA.isNaN ? !valueB.isNaN : valueB.isNaN) {
      return valueA.isNaN ? -1 : 1;
    }
    if (valueA.isSymbol ? !valueB.isSymbol : valueB.isSymbol) {
      return valueA.isSymbol ? -1 : 1;
    }
    if (valueA.isObject ? !valueB.isObject : valueB.isObject) {
      return valueA.isObject ? -1 : 1;
    }
    if (valueA.isArray ? !valueB.isArray : valueB.isArray) {
      return valueA.isArray ? -1 : 1;
    }
    if (valueA.isFunction ? !valueB.isFunction : valueB.isFunction) {
      return valueA.isFunction ? -1 : 1;
    }
    if (valueA.isNull ? !valueB.isNull : valueB.isNull) {
      return valueA.isNull ? -1 : 1;
    }
    return 0;
  };
  var compareValues = function compareValues2(valueA, valueB) {
    if (valueA.value === valueB.value) {
      return 0;
    }
    if (valueA.parsedNumber !== void 0 && valueB.parsedNumber !== void 0) {
      return compareNumbers(valueA.parsedNumber, valueB.parsedNumber);
    }
    if (valueA.chunks && valueB.chunks) {
      return compareChunks(valueA.chunks, valueB.chunks);
    }
    return compareOtherTypes(valueA, valueB);
  };
  var normalizeAlphaChunk = function normalizeAlphaChunk2(chunk2) {
    return chunk2.replace(RE_WHITESPACES, " ").replace(RE_LEADING_OR_TRAILING_WHITESPACES, "");
  };
  var parseNumber = function parseNumber2(value) {
    if (value.length !== 0) {
      var parsedNumber = Number(value);
      if (!Number.isNaN(parsedNumber)) {
        return parsedNumber;
      }
    }
    return void 0;
  };
  var normalizeNumericChunk = function normalizeNumericChunk2(chunk2, index, chunks) {
    if (RE_INT_OR_FLOAT.test(chunk2)) {
      if (!RE_LEADING_ZERO.test(chunk2) || index === 0 || chunks[index - 1] !== ".") {
        return parseNumber(chunk2) || 0;
      }
    }
    return void 0;
  };
  var createChunkMap = function createChunkMap2(chunk2, index, chunks) {
    return {
      parsedNumber: normalizeNumericChunk(chunk2, index, chunks),
      normalizedString: normalizeAlphaChunk(chunk2)
    };
  };
  var createChunks = function createChunks2(value) {
    return value.replace(RE_NUMBERS, "\0$1\0").replace(/\0$/, "").replace(/^\0/, "").split("\0");
  };
  var createChunkMaps = function createChunkMaps2(value) {
    var chunksMaps = createChunks(value).map(createChunkMap);
    return chunksMaps;
  };
  var isFunction$1 = function isFunction(value) {
    return typeof value === "function";
  };
  var isNaN$1 = function isNaN2(value) {
    return Number.isNaN(value) || value instanceof Number && Number.isNaN(value.valueOf());
  };
  var isNull = function isNull2(value) {
    return value === null;
  };
  var isObject$6 = function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Number) && !(value instanceof String) && !(value instanceof Boolean) && !(value instanceof Date);
  };
  var isSymbol$2 = function isSymbol(value) {
    return typeof value === "symbol";
  };
  var isUndefined = function isUndefined2(value) {
    return value === void 0;
  };
  var parseDate = function parseDate2(value) {
    try {
      var parsedDate = Date.parse(value);
      if (!Number.isNaN(parsedDate)) {
        if (RE_DATE.test(value)) {
          return parsedDate;
        }
      }
      return void 0;
    } catch (_unused) {
      return void 0;
    }
  };
  var numberify = function numberify2(value) {
    var parsedNumber = parseNumber(value);
    if (parsedNumber !== void 0) {
      return parsedNumber;
    }
    return parseDate(value);
  };
  var stringify$1 = function stringify(value) {
    if (typeof value === "boolean" || value instanceof Boolean) {
      return Number(value).toString();
    }
    if (typeof value === "number" || value instanceof Number) {
      return value.toString();
    }
    if (value instanceof Date) {
      return value.getTime().toString();
    }
    if (typeof value === "string" || value instanceof String) {
      return value.toLowerCase().replace(RE_LEADING_OR_TRAILING_WHITESPACES, "");
    }
    return "";
  };
  var getMappedValueRecord = function getMappedValueRecord2(value) {
    if (typeof value === "string" || value instanceof String || (typeof value === "number" || value instanceof Number) && !isNaN$1(value) || typeof value === "boolean" || value instanceof Boolean || value instanceof Date) {
      var stringValue = stringify$1(value);
      var parsedNumber = numberify(stringValue);
      var chunks = createChunkMaps(parsedNumber ? "" + parsedNumber : stringValue);
      return {
        parsedNumber,
        chunks,
        value
      };
    }
    return {
      isArray: Array.isArray(value),
      isFunction: isFunction$1(value),
      isNaN: isNaN$1(value),
      isNull: isNull(value),
      isObject: isObject$6(value),
      isSymbol: isSymbol$2(value),
      isUndefined: isUndefined(value),
      value
    };
  };
  var compareMultiple = function compareMultiple2(recordA, recordB, orders) {
    var indexA = recordA.index, valuesA = recordA.values;
    var indexB = recordB.index, valuesB = recordB.values;
    var length2 = valuesA.length;
    var ordersLength = orders.length;
    for (var i2 = 0; i2 < length2; i2++) {
      var order = i2 < ordersLength ? orders[i2] : null;
      if (order && typeof order === "function") {
        var result = order(valuesA[i2].value, valuesB[i2].value);
        if (result) {
          return result;
        }
      } else {
        var _result = compareValues(valuesA[i2], valuesB[i2]);
        if (_result) {
          return _result * (order === "desc" ? -1 : 1);
        }
      }
    }
    return indexA - indexB;
  };
  var createIdentifierFn = function createIdentifierFn2(identifier2) {
    if (typeof identifier2 === "function") {
      return identifier2;
    }
    return function(value) {
      if (Array.isArray(value)) {
        var index = Number(identifier2);
        if (Number.isInteger(index)) {
          return value[index];
        }
      } else if (value && typeof value === "object") {
        var result = Object.getOwnPropertyDescriptor(value, identifier2);
        return result == null ? void 0 : result.value;
      }
      return value;
    };
  };
  var getElementByIndex = function getElementByIndex2(collection, index) {
    return collection[index];
  };
  var getValueByIdentifier = function getValueByIdentifier2(value, getValue2) {
    return getValue2(value);
  };
  var baseOrderBy = function baseOrderBy2(collection, identifiers, orders) {
    var identifierFns = identifiers.length ? identifiers.map(createIdentifierFn) : [function(value) {
      return value;
    }];
    var mappedCollection = collection.map(function(element, index) {
      var values = identifierFns.map(function(identifier2) {
        return getValueByIdentifier(element, identifier2);
      }).map(getMappedValueRecord);
      return {
        index,
        values
      };
    });
    mappedCollection.sort(function(recordA, recordB) {
      return compareMultiple(recordA, recordB, orders);
    });
    return mappedCollection.map(function(element) {
      return getElementByIndex(collection, element.index);
    });
  };
  var getIdentifiers = function getIdentifiers2(identifiers) {
    if (!identifiers) {
      return [];
    }
    var identifierList = !Array.isArray(identifiers) ? [identifiers] : [].concat(identifiers);
    if (identifierList.some(function(identifier2) {
      return typeof identifier2 !== "string" && typeof identifier2 !== "number" && typeof identifier2 !== "function";
    })) {
      return [];
    }
    return identifierList;
  };
  var getOrders = function getOrders2(orders) {
    if (!orders) {
      return [];
    }
    var orderList = !Array.isArray(orders) ? [orders] : [].concat(orders);
    if (orderList.some(function(order) {
      return order !== "asc" && order !== "desc" && typeof order !== "function";
    })) {
      return [];
    }
    return orderList;
  };
  function orderBy(collection, identifiers, orders) {
    if (!collection || !Array.isArray(collection)) {
      return [];
    }
    var validatedIdentifiers = getIdentifiers(identifiers);
    var validatedOrders = getOrders(orders);
    return baseOrderBy(collection, validatedIdentifiers, validatedOrders);
  }
  Array.prototype.uniq = function() {
    return lodash.uniq(this);
  };
  Array.prototype.orderBy = function(...[columns, orders]) {
    return orderBy(this, columns, orders);
  };
  Array.prototype._map = function(field) {
    return lodash.map(this, field);
  };
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
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
  var f$2 = React__default, k$2 = Symbol.for("react.element"), l$3 = Symbol.for("react.fragment"), m$4 = Object.prototype.hasOwnProperty, n$3 = f$2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$3 = { key: true, ref: true, __self: true, __source: true };
  function q$2(c2, a2, g2) {
    var b2, d2 = {}, e2 = null, h2 = null;
    void 0 !== g2 && (e2 = "" + g2);
    void 0 !== a2.key && (e2 = "" + a2.key);
    void 0 !== a2.ref && (h2 = a2.ref);
    for (b2 in a2) m$4.call(a2, b2) && !p$3.hasOwnProperty(b2) && (d2[b2] = a2[b2]);
    if (c2 && c2.defaultProps) for (b2 in a2 = c2.defaultProps, a2) void 0 === d2[b2] && (d2[b2] = a2[b2]);
    return { $$typeof: k$2, type: c2, key: e2, ref: h2, props: d2, _owner: n$3.current };
  }
  reactJsxRuntime_production_min.Fragment = l$3;
  reactJsxRuntime_production_min.jsx = q$2;
  reactJsxRuntime_production_min.jsxs = q$2;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var isDevelopment$3 = false;
  function sheetForTag(tag2) {
    if (tag2.sheet) {
      return tag2.sheet;
    }
    for (var i2 = 0; i2 < document.styleSheets.length; i2++) {
      if (document.styleSheets[i2].ownerNode === tag2) {
        return document.styleSheets[i2];
      }
    }
    return void 0;
  }
  function createStyleElement(options) {
    var tag2 = document.createElement("style");
    tag2.setAttribute("data-emotion", options.key);
    if (options.nonce !== void 0) {
      tag2.setAttribute("nonce", options.nonce);
    }
    tag2.appendChild(document.createTextNode(""));
    tag2.setAttribute("data-s", "");
    return tag2;
  }
  var StyleSheet = /* @__PURE__ */ function() {
    function StyleSheet2(options) {
      var _this = this;
      this._insertTag = function(tag2) {
        var before;
        if (_this.tags.length === 0) {
          if (_this.insertionPoint) {
            before = _this.insertionPoint.nextSibling;
          } else if (_this.prepend) {
            before = _this.container.firstChild;
          } else {
            before = _this.before;
          }
        } else {
          before = _this.tags[_this.tags.length - 1].nextSibling;
        }
        _this.container.insertBefore(tag2, before);
        _this.tags.push(tag2);
      };
      this.isSpeedy = options.speedy === void 0 ? !isDevelopment$3 : options.speedy;
      this.tags = [];
      this.ctr = 0;
      this.nonce = options.nonce;
      this.key = options.key;
      this.container = options.container;
      this.prepend = options.prepend;
      this.insertionPoint = options.insertionPoint;
      this.before = null;
    }
    var _proto = StyleSheet2.prototype;
    _proto.hydrate = function hydrate(nodes) {
      nodes.forEach(this._insertTag);
    };
    _proto.insert = function insert(rule) {
      if (this.ctr % (this.isSpeedy ? 65e3 : 1) === 0) {
        this._insertTag(createStyleElement(this));
      }
      var tag2 = this.tags[this.tags.length - 1];
      if (this.isSpeedy) {
        var sheet = sheetForTag(tag2);
        try {
          sheet.insertRule(rule, sheet.cssRules.length);
        } catch (e2) {
        }
      } else {
        tag2.appendChild(document.createTextNode(rule));
      }
      this.ctr++;
    };
    _proto.flush = function flush() {
      this.tags.forEach(function(tag2) {
        var _tag$parentNode;
        return (_tag$parentNode = tag2.parentNode) == null ? void 0 : _tag$parentNode.removeChild(tag2);
      });
      this.tags = [];
      this.ctr = 0;
    };
    return StyleSheet2;
  }();
  var MS = "-ms-";
  var MOZ = "-moz-";
  var WEBKIT = "-webkit-";
  var COMMENT = "comm";
  var RULESET = "rule";
  var DECLARATION = "decl";
  var IMPORT = "@import";
  var KEYFRAMES = "@keyframes";
  var LAYER = "@layer";
  var abs = Math.abs;
  var from = String.fromCharCode;
  var assign = Object.assign;
  function hash(value, length2) {
    return charat(value, 0) ^ 45 ? (((length2 << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
  }
  function trim(value) {
    return value.trim();
  }
  function match(value, pattern) {
    return (value = pattern.exec(value)) ? value[0] : value;
  }
  function replace(value, pattern, replacement) {
    return value.replace(pattern, replacement);
  }
  function indexof(value, search) {
    return value.indexOf(search);
  }
  function charat(value, index) {
    return value.charCodeAt(index) | 0;
  }
  function substr(value, begin, end) {
    return value.slice(begin, end);
  }
  function strlen(value) {
    return value.length;
  }
  function sizeof(value) {
    return value.length;
  }
  function append(value, array) {
    return array.push(value), value;
  }
  function combine(array, callback) {
    return array.map(callback).join("");
  }
  var line = 1;
  var column = 1;
  var length = 0;
  var position = 0;
  var character = 0;
  var characters = "";
  function node(value, root2, parent, type, props, children, length2) {
    return { value, root: root2, parent, type, props, children, line, column, length: length2, return: "" };
  }
  function copy(root2, props) {
    return assign(node("", null, null, "", null, null, 0), root2, { length: -root2.length }, props);
  }
  function char() {
    return character;
  }
  function prev() {
    character = position > 0 ? charat(characters, --position) : 0;
    if (column--, character === 10)
      column = 1, line--;
    return character;
  }
  function next() {
    character = position < length ? charat(characters, position++) : 0;
    if (column++, character === 10)
      column = 1, line++;
    return character;
  }
  function peek() {
    return charat(characters, position);
  }
  function caret() {
    return position;
  }
  function slice(begin, end) {
    return substr(characters, begin, end);
  }
  function token(type) {
    switch (type) {
      case 0:
      case 9:
      case 10:
      case 13:
      case 32:
        return 5;
      case 33:
      case 43:
      case 44:
      case 47:
      case 62:
      case 64:
      case 126:
      case 59:
      case 123:
      case 125:
        return 4;
      case 58:
        return 3;
      case 34:
      case 39:
      case 40:
      case 91:
        return 2;
      case 41:
      case 93:
        return 1;
    }
    return 0;
  }
  function alloc(value) {
    return line = column = 1, length = strlen(characters = value), position = 0, [];
  }
  function dealloc(value) {
    return characters = "", value;
  }
  function delimit(type) {
    return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
  }
  function whitespace(type) {
    while (character = peek())
      if (character < 33)
        next();
      else
        break;
    return token(type) > 2 || token(character) > 3 ? "" : " ";
  }
  function escaping(index, count) {
    while (--count && next())
      if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
        break;
    return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
  }
  function delimiter(type) {
    while (next())
      switch (character) {
        case type:
          return position;
        case 34:
        case 39:
          if (type !== 34 && type !== 39)
            delimiter(character);
          break;
        case 40:
          if (type === 41)
            delimiter(type);
          break;
        case 92:
          next();
          break;
      }
    return position;
  }
  function commenter(type, index) {
    while (next())
      if (type + character === 47 + 10)
        break;
      else if (type + character === 42 + 42 && peek() === 47)
        break;
    return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
  }
  function identifier(index) {
    while (!token(peek()))
      next();
    return slice(index, position);
  }
  function compile(value) {
    return dealloc(parse$2("", null, null, null, [""], value = alloc(value), 0, [0], value));
  }
  function parse$2(value, root2, parent, rule, rules, rulesets, pseudo, points, declarations) {
    var index = 0;
    var offset = 0;
    var length2 = pseudo;
    var atrule = 0;
    var property = 0;
    var previous = 0;
    var variable = 1;
    var scanning = 1;
    var ampersand = 1;
    var character2 = 0;
    var type = "";
    var props = rules;
    var children = rulesets;
    var reference = rule;
    var characters2 = type;
    while (scanning)
      switch (previous = character2, character2 = next()) {
        case 40:
          if (previous != 108 && charat(characters2, length2 - 1) == 58) {
            if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f") != -1)
              ampersand = -1;
            break;
          }
        case 34:
        case 39:
        case 91:
          characters2 += delimit(character2);
          break;
        case 9:
        case 10:
        case 13:
        case 32:
          characters2 += whitespace(previous);
          break;
        case 92:
          characters2 += escaping(caret() - 1, 7);
          continue;
        case 47:
          switch (peek()) {
            case 42:
            case 47:
              append(comment(commenter(next(), caret()), root2, parent), declarations);
              break;
            default:
              characters2 += "/";
          }
          break;
        case 123 * variable:
          points[index++] = strlen(characters2) * ampersand;
        case 125 * variable:
        case 59:
        case 0:
          switch (character2) {
            case 0:
            case 125:
              scanning = 0;
            case 59 + offset:
              if (ampersand == -1) characters2 = replace(characters2, /\f/g, "");
              if (property > 0 && strlen(characters2) - length2)
                append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2), declarations);
              break;
            case 59:
              characters2 += ";";
            default:
              append(reference = ruleset(characters2, root2, parent, index, offset, rules, points, type, props = [], children = [], length2), rulesets);
              if (character2 === 123)
                if (offset === 0)
                  parse$2(characters2, root2, reference, reference, props, rulesets, length2, points, children);
                else
                  switch (atrule === 99 && charat(characters2, 3) === 110 ? 100 : atrule) {
                    case 100:
                    case 108:
                    case 109:
                    case 115:
                      parse$2(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2), children), rules, children, length2, points, rule ? props : children);
                      break;
                    default:
                      parse$2(characters2, reference, reference, reference, [""], children, 0, points, children);
                  }
          }
          index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
          break;
        case 58:
          length2 = 1 + strlen(characters2), property = previous;
        default:
          if (variable < 1) {
            if (character2 == 123)
              --variable;
            else if (character2 == 125 && variable++ == 0 && prev() == 125)
              continue;
          }
          switch (characters2 += from(character2), character2 * variable) {
            case 38:
              ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
              break;
            case 44:
              points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
              break;
            case 64:
              if (peek() === 45)
                characters2 += delimit(next());
              atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
              break;
            case 45:
              if (previous === 45 && strlen(characters2) == 2)
                variable = 0;
          }
      }
    return rulesets;
  }
  function ruleset(value, root2, parent, index, offset, rules, points, type, props, children, length2) {
    var post = offset - 1;
    var rule = offset === 0 ? rules : [""];
    var size = sizeof(rule);
    for (var i2 = 0, j = 0, k2 = 0; i2 < index; ++i2)
      for (var x2 = 0, y2 = substr(value, post + 1, post = abs(j = points[i2])), z2 = value; x2 < size; ++x2)
        if (z2 = trim(j > 0 ? rule[x2] + " " + y2 : replace(y2, /&\f/g, rule[x2])))
          props[k2++] = z2;
    return node(value, root2, parent, offset === 0 ? RULESET : type, props, children, length2);
  }
  function comment(value, root2, parent) {
    return node(value, root2, parent, COMMENT, from(char()), substr(value, 2, -2), 0);
  }
  function declaration(value, root2, parent, length2) {
    return node(value, root2, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2);
  }
  function serialize(children, callback) {
    var output = "";
    var length2 = sizeof(children);
    for (var i2 = 0; i2 < length2; i2++)
      output += callback(children[i2], i2, children, callback) || "";
    return output;
  }
  function stringify2(element, index, children, callback) {
    switch (element.type) {
      case LAYER:
        if (element.children.length) break;
      case IMPORT:
      case DECLARATION:
        return element.return = element.return || element.value;
      case COMMENT:
        return "";
      case KEYFRAMES:
        return element.return = element.value + "{" + serialize(element.children, callback) + "}";
      case RULESET:
        element.value = element.props.join(",");
    }
    return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
  }
  function middleware(collection) {
    var length2 = sizeof(collection);
    return function(element, index, children, callback) {
      var output = "";
      for (var i2 = 0; i2 < length2; i2++)
        output += collection[i2](element, index, children, callback) || "";
      return output;
    };
  }
  function rulesheet(callback) {
    return function(element) {
      if (!element.root) {
        if (element = element.return)
          callback(element);
      }
    };
  }
  function memoize(fn) {
    var cache2 = /* @__PURE__ */ Object.create(null);
    return function(arg) {
      if (cache2[arg] === void 0) cache2[arg] = fn(arg);
      return cache2[arg];
    };
  }
  var identifierWithPointTracking = function identifierWithPointTracking2(begin, points, index) {
    var previous = 0;
    var character2 = 0;
    while (true) {
      previous = character2;
      character2 = peek();
      if (previous === 38 && character2 === 12) {
        points[index] = 1;
      }
      if (token(character2)) {
        break;
      }
      next();
    }
    return slice(begin, position);
  };
  var toRules = function toRules2(parsed, points) {
    var index = -1;
    var character2 = 44;
    do {
      switch (token(character2)) {
        case 0:
          if (character2 === 38 && peek() === 12) {
            points[index] = 1;
          }
          parsed[index] += identifierWithPointTracking(position - 1, points, index);
          break;
        case 2:
          parsed[index] += delimit(character2);
          break;
        case 4:
          if (character2 === 44) {
            parsed[++index] = peek() === 58 ? "&\f" : "";
            points[index] = parsed[index].length;
            break;
          }
        default:
          parsed[index] += from(character2);
      }
    } while (character2 = next());
    return parsed;
  };
  var getRules = function getRules2(value, points) {
    return dealloc(toRules(alloc(value), points));
  };
  var fixedElements = /* @__PURE__ */ new WeakMap();
  var compat = function compat2(element) {
    if (element.type !== "rule" || !element.parent || // positive .length indicates that this rule contains pseudo
    // negative .length indicates that this rule has been already prefixed
    element.length < 1) {
      return;
    }
    var value = element.value, parent = element.parent;
    var isImplicitRule = element.column === parent.column && element.line === parent.line;
    while (parent.type !== "rule") {
      parent = parent.parent;
      if (!parent) return;
    }
    if (element.props.length === 1 && value.charCodeAt(0) !== 58 && !fixedElements.get(parent)) {
      return;
    }
    if (isImplicitRule) {
      return;
    }
    fixedElements.set(element, true);
    var points = [];
    var rules = getRules(value, points);
    var parentRules = parent.props;
    for (var i2 = 0, k2 = 0; i2 < rules.length; i2++) {
      for (var j = 0; j < parentRules.length; j++, k2++) {
        element.props[k2] = points[i2] ? rules[i2].replace(/&\f/g, parentRules[j]) : parentRules[j] + " " + rules[i2];
      }
    }
  };
  var removeLabel = function removeLabel2(element) {
    if (element.type === "decl") {
      var value = element.value;
      if (
        // charcode for l
        value.charCodeAt(0) === 108 && // charcode for b
        value.charCodeAt(2) === 98
      ) {
        element["return"] = "";
        element.value = "";
      }
    }
  };
  function prefix(value, length2) {
    switch (hash(value, length2)) {
      case 5103:
        return WEBKIT + "print-" + value + value;
      case 5737:
      case 4201:
      case 3177:
      case 3433:
      case 1641:
      case 4457:
      case 2921:
      case 5572:
      case 6356:
      case 5844:
      case 3191:
      case 6645:
      case 3005:
      case 6391:
      case 5879:
      case 5623:
      case 6135:
      case 4599:
      case 4855:
      case 4215:
      case 6389:
      case 5109:
      case 5365:
      case 5621:
      case 3829:
        return WEBKIT + value + value;
      case 5349:
      case 4246:
      case 4810:
      case 6968:
      case 2756:
        return WEBKIT + value + MOZ + value + MS + value + value;
      case 6828:
      case 4268:
        return WEBKIT + value + MS + value + value;
      case 6165:
        return WEBKIT + value + MS + "flex-" + value + value;
      case 5187:
        return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
      case 5443:
        return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/, "") + value;
      case 4675:
        return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/, "") + value;
      case 5548:
        return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
      case 5292:
        return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
      case 6060:
        return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
      case 4554:
        return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
      case 6187:
        return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
      case 5495:
      case 3959:
        return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
      case 4968:
        return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + WEBKIT + value + value;
      case 4095:
      case 3583:
      case 4068:
      case 2532:
        return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
      case 8116:
      case 7059:
      case 5753:
      case 5535:
      case 5445:
      case 5701:
      case 4933:
      case 4677:
      case 5533:
      case 5789:
      case 5021:
      case 4765:
        if (strlen(value) - 1 - length2 > 6) switch (charat(value, length2 + 1)) {
          case 109:
            if (charat(value, length2 + 4) !== 45) break;
          case 102:
            return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length2 + 3) == 108 ? "$3" : "$2-$3")) + value;
          case 115:
            return ~indexof(value, "stretch") ? prefix(replace(value, "stretch", "fill-available"), length2) + value : value;
        }
        break;
      case 4949:
        if (charat(value, length2 + 1) !== 115) break;
      case 6444:
        switch (charat(value, strlen(value) - 3 - (~indexof(value, "!important") && 10))) {
          case 107:
            return replace(value, ":", ":" + WEBKIT) + value;
          case 101:
            return replace(value, /(.+:)([^;!]+)(;|!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
        }
        break;
      case 5936:
        switch (charat(value, length2 + 11)) {
          case 114:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
          case 108:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
          case 45:
            return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
        }
        return WEBKIT + value + MS + value + value;
    }
    return value;
  }
  var prefixer = function prefixer2(element, index, children, callback) {
    if (element.length > -1) {
      if (!element["return"]) switch (element.type) {
        case DECLARATION:
          element["return"] = prefix(element.value, element.length);
          break;
        case KEYFRAMES:
          return serialize([copy(element, {
            value: replace(element.value, "@", "@" + WEBKIT)
          })], callback);
        case RULESET:
          if (element.length) return combine(element.props, function(value) {
            switch (match(value, /(::plac\w+|:read-\w+)/)) {
              case ":read-only":
              case ":read-write":
                return serialize([copy(element, {
                  props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")]
                })], callback);
              case "::placeholder":
                return serialize([copy(element, {
                  props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")]
                }), copy(element, {
                  props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")]
                }), copy(element, {
                  props: [replace(value, /:(plac\w+)/, MS + "input-$1")]
                })], callback);
            }
            return "";
          });
      }
    }
  };
  var defaultStylisPlugins = [prefixer];
  var createCache = function createCache2(options) {
    var key = options.key;
    if (key === "css") {
      var ssrStyles = document.querySelectorAll("style[data-emotion]:not([data-s])");
      Array.prototype.forEach.call(ssrStyles, function(node2) {
        var dataEmotionAttribute = node2.getAttribute("data-emotion");
        if (dataEmotionAttribute.indexOf(" ") === -1) {
          return;
        }
        document.head.appendChild(node2);
        node2.setAttribute("data-s", "");
      });
    }
    var stylisPlugins = options.stylisPlugins || defaultStylisPlugins;
    var inserted = {};
    var container2;
    var nodesToHydrate = [];
    {
      container2 = options.container || document.head;
      Array.prototype.forEach.call(
        // this means we will ignore elements which don't have a space in them which
        // means that the style elements we're looking at are only Emotion 11 server-rendered style elements
        document.querySelectorAll('style[data-emotion^="' + key + ' "]'),
        function(node2) {
          var attrib = node2.getAttribute("data-emotion").split(" ");
          for (var i2 = 1; i2 < attrib.length; i2++) {
            inserted[attrib[i2]] = true;
          }
          nodesToHydrate.push(node2);
        }
      );
    }
    var _insert;
    var omnipresentPlugins = [compat, removeLabel];
    {
      var currentSheet;
      var finalizingPlugins = [stringify2, rulesheet(function(rule) {
        currentSheet.insert(rule);
      })];
      var serializer = middleware(omnipresentPlugins.concat(stylisPlugins, finalizingPlugins));
      var stylis = function stylis2(styles2) {
        return serialize(compile(styles2), serializer);
      };
      _insert = function insert(selector, serialized, sheet, shouldCache) {
        currentSheet = sheet;
        stylis(selector ? selector + "{" + serialized.styles + "}" : serialized.styles);
        if (shouldCache) {
          cache2.inserted[serialized.name] = true;
        }
      };
    }
    var cache2 = {
      key,
      sheet: new StyleSheet({
        key,
        container: container2,
        nonce: options.nonce,
        speedy: options.speedy,
        prepend: options.prepend,
        insertionPoint: options.insertionPoint
      }),
      nonce: options.nonce,
      inserted,
      registered: {},
      insert: _insert
    };
    cache2.sheet.hydrate(nodesToHydrate);
    return cache2;
  };
  var reactIs$1 = { exports: {} };
  var reactIs_production_min = {};
  /** @license React v16.13.1
   * react-is.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var b = "function" === typeof Symbol && Symbol.for, c$1 = b ? Symbol.for("react.element") : 60103, d$1 = b ? Symbol.for("react.portal") : 60106, e$2 = b ? Symbol.for("react.fragment") : 60107, f$1 = b ? Symbol.for("react.strict_mode") : 60108, g$2 = b ? Symbol.for("react.profiler") : 60114, h$3 = b ? Symbol.for("react.provider") : 60109, k$1 = b ? Symbol.for("react.context") : 60110, l$2 = b ? Symbol.for("react.async_mode") : 60111, m$3 = b ? Symbol.for("react.concurrent_mode") : 60111, n$2 = b ? Symbol.for("react.forward_ref") : 60112, p$2 = b ? Symbol.for("react.suspense") : 60113, q$1 = b ? Symbol.for("react.suspense_list") : 60120, r$2 = b ? Symbol.for("react.memo") : 60115, t$2 = b ? Symbol.for("react.lazy") : 60116, v = b ? Symbol.for("react.block") : 60121, w$2 = b ? Symbol.for("react.fundamental") : 60117, x = b ? Symbol.for("react.responder") : 60118, y$2 = b ? Symbol.for("react.scope") : 60119;
  function z(a2) {
    if ("object" === typeof a2 && null !== a2) {
      var u2 = a2.$$typeof;
      switch (u2) {
        case c$1:
          switch (a2 = a2.type, a2) {
            case l$2:
            case m$3:
            case e$2:
            case g$2:
            case f$1:
            case p$2:
              return a2;
            default:
              switch (a2 = a2 && a2.$$typeof, a2) {
                case k$1:
                case n$2:
                case t$2:
                case r$2:
                case h$3:
                  return a2;
                default:
                  return u2;
              }
          }
        case d$1:
          return u2;
      }
    }
  }
  function A(a2) {
    return z(a2) === m$3;
  }
  reactIs_production_min.AsyncMode = l$2;
  reactIs_production_min.ConcurrentMode = m$3;
  reactIs_production_min.ContextConsumer = k$1;
  reactIs_production_min.ContextProvider = h$3;
  reactIs_production_min.Element = c$1;
  reactIs_production_min.ForwardRef = n$2;
  reactIs_production_min.Fragment = e$2;
  reactIs_production_min.Lazy = t$2;
  reactIs_production_min.Memo = r$2;
  reactIs_production_min.Portal = d$1;
  reactIs_production_min.Profiler = g$2;
  reactIs_production_min.StrictMode = f$1;
  reactIs_production_min.Suspense = p$2;
  reactIs_production_min.isAsyncMode = function(a2) {
    return A(a2) || z(a2) === l$2;
  };
  reactIs_production_min.isConcurrentMode = A;
  reactIs_production_min.isContextConsumer = function(a2) {
    return z(a2) === k$1;
  };
  reactIs_production_min.isContextProvider = function(a2) {
    return z(a2) === h$3;
  };
  reactIs_production_min.isElement = function(a2) {
    return "object" === typeof a2 && null !== a2 && a2.$$typeof === c$1;
  };
  reactIs_production_min.isForwardRef = function(a2) {
    return z(a2) === n$2;
  };
  reactIs_production_min.isFragment = function(a2) {
    return z(a2) === e$2;
  };
  reactIs_production_min.isLazy = function(a2) {
    return z(a2) === t$2;
  };
  reactIs_production_min.isMemo = function(a2) {
    return z(a2) === r$2;
  };
  reactIs_production_min.isPortal = function(a2) {
    return z(a2) === d$1;
  };
  reactIs_production_min.isProfiler = function(a2) {
    return z(a2) === g$2;
  };
  reactIs_production_min.isStrictMode = function(a2) {
    return z(a2) === f$1;
  };
  reactIs_production_min.isSuspense = function(a2) {
    return z(a2) === p$2;
  };
  reactIs_production_min.isValidElementType = function(a2) {
    return "string" === typeof a2 || "function" === typeof a2 || a2 === e$2 || a2 === m$3 || a2 === g$2 || a2 === f$1 || a2 === p$2 || a2 === q$1 || "object" === typeof a2 && null !== a2 && (a2.$$typeof === t$2 || a2.$$typeof === r$2 || a2.$$typeof === h$3 || a2.$$typeof === k$1 || a2.$$typeof === n$2 || a2.$$typeof === w$2 || a2.$$typeof === x || a2.$$typeof === y$2 || a2.$$typeof === v);
  };
  reactIs_production_min.typeOf = z;
  {
    reactIs$1.exports = reactIs_production_min;
  }
  var reactIsExports = reactIs$1.exports;
  var reactIs = reactIsExports;
  var FORWARD_REF_STATICS = {
    "$$typeof": true,
    render: true,
    defaultProps: true,
    displayName: true,
    propTypes: true
  };
  var MEMO_STATICS = {
    "$$typeof": true,
    compare: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
    type: true
  };
  var TYPE_STATICS = {};
  TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
  TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;
  var isBrowser$1 = true;
  function getRegisteredStyles(registered, registeredStyles, classNames) {
    var rawClassName = "";
    classNames.split(" ").forEach(function(className) {
      if (registered[className] !== void 0) {
        registeredStyles.push(registered[className] + ";");
      } else {
        rawClassName += className + " ";
      }
    });
    return rawClassName;
  }
  var registerStyles = function registerStyles2(cache2, serialized, isStringTag) {
    var className = cache2.key + "-" + serialized.name;
    if (
      // we only need to add the styles to the registered cache if the
      // class name could be used further down
      // the tree but if it's a string tag, we know it won't
      // so we don't have to add it to registered cache.
      // this improves memory usage since we can avoid storing the whole style string
      (isStringTag === false || // we need to always store it if we're in compat mode and
      // in node since emotion-server relies on whether a style is in
      // the registered cache to know whether a style is global or not
      // also, note that this check will be dead code eliminated in the browser
      isBrowser$1 === false) && cache2.registered[className] === void 0
    ) {
      cache2.registered[className] = serialized.styles;
    }
  };
  var insertStyles = function insertStyles2(cache2, serialized, isStringTag) {
    registerStyles(cache2, serialized, isStringTag);
    var className = cache2.key + "-" + serialized.name;
    if (cache2.inserted[serialized.name] === void 0) {
      var current = serialized;
      do {
        cache2.insert(serialized === current ? "." + className : "", current, cache2.sheet, true);
        current = current.next;
      } while (current !== void 0);
    }
  };
  function murmur2(str) {
    var h2 = 0;
    var k2, i2 = 0, len = str.length;
    for (; len >= 4; ++i2, len -= 4) {
      k2 = str.charCodeAt(i2) & 255 | (str.charCodeAt(++i2) & 255) << 8 | (str.charCodeAt(++i2) & 255) << 16 | (str.charCodeAt(++i2) & 255) << 24;
      k2 = /* Math.imul(k, m): */
      (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16);
      k2 ^= /* k >>> r: */
      k2 >>> 24;
      h2 = /* Math.imul(k, m): */
      (k2 & 65535) * 1540483477 + ((k2 >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
      (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    }
    switch (len) {
      case 3:
        h2 ^= (str.charCodeAt(i2 + 2) & 255) << 16;
      case 2:
        h2 ^= (str.charCodeAt(i2 + 1) & 255) << 8;
      case 1:
        h2 ^= str.charCodeAt(i2) & 255;
        h2 = /* Math.imul(h, m): */
        (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    }
    h2 ^= h2 >>> 13;
    h2 = /* Math.imul(h, m): */
    (h2 & 65535) * 1540483477 + ((h2 >>> 16) * 59797 << 16);
    return ((h2 ^ h2 >>> 15) >>> 0).toString(36);
  }
  var unitlessKeys$1 = {
    animationIterationCount: 1,
    aspectRatio: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    scale: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    // SVG-related properties
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
  };
  var isDevelopment$2 = false;
  var hyphenateRegex$1 = /[A-Z]|^ms/g;
  var animationRegex$1 = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
  var isCustomProperty$1 = function isCustomProperty(property) {
    return property.charCodeAt(1) === 45;
  };
  var isProcessableValue$1 = function isProcessableValue(value) {
    return value != null && typeof value !== "boolean";
  };
  var processStyleName$1 = /* @__PURE__ */ memoize(function(styleName) {
    return isCustomProperty$1(styleName) ? styleName : styleName.replace(hyphenateRegex$1, "-$&").toLowerCase();
  });
  var processStyleValue$1 = function processStyleValue(key, value) {
    switch (key) {
      case "animation":
      case "animationName": {
        if (typeof value === "string") {
          return value.replace(animationRegex$1, function(match2, p1, p2) {
            cursor$1 = {
              name: p1,
              styles: p2,
              next: cursor$1
            };
            return p1;
          });
        }
      }
    }
    if (unitlessKeys$1[key] !== 1 && !isCustomProperty$1(key) && typeof value === "number" && value !== 0) {
      return value + "px";
    }
    return value;
  };
  var noComponentSelectorMessage$1 = "Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.";
  function handleInterpolation$1(mergedProps, registered, interpolation) {
    if (interpolation == null) {
      return "";
    }
    var componentSelector = interpolation;
    if (componentSelector.__emotion_styles !== void 0) {
      return componentSelector;
    }
    switch (typeof interpolation) {
      case "boolean": {
        return "";
      }
      case "object": {
        var keyframes = interpolation;
        if (keyframes.anim === 1) {
          cursor$1 = {
            name: keyframes.name,
            styles: keyframes.styles,
            next: cursor$1
          };
          return keyframes.name;
        }
        var serializedStyles = interpolation;
        if (serializedStyles.styles !== void 0) {
          var next2 = serializedStyles.next;
          if (next2 !== void 0) {
            while (next2 !== void 0) {
              cursor$1 = {
                name: next2.name,
                styles: next2.styles,
                next: cursor$1
              };
              next2 = next2.next;
            }
          }
          var styles2 = serializedStyles.styles + ";";
          return styles2;
        }
        return createStringFromObject$1(mergedProps, registered, interpolation);
      }
      case "function": {
        if (mergedProps !== void 0) {
          var previousCursor = cursor$1;
          var result = interpolation(mergedProps);
          cursor$1 = previousCursor;
          return handleInterpolation$1(mergedProps, registered, result);
        }
        break;
      }
    }
    var asString = interpolation;
    {
      return asString;
    }
  }
  function createStringFromObject$1(mergedProps, registered, obj) {
    var string = "";
    if (Array.isArray(obj)) {
      for (var i2 = 0; i2 < obj.length; i2++) {
        string += handleInterpolation$1(mergedProps, registered, obj[i2]) + ";";
      }
    } else {
      for (var key in obj) {
        var value = obj[key];
        if (typeof value !== "object") {
          var asString = value;
          if (isProcessableValue$1(asString)) {
            string += processStyleName$1(key) + ":" + processStyleValue$1(key, asString) + ";";
          }
        } else {
          if (key === "NO_COMPONENT_SELECTOR" && isDevelopment$2) {
            throw new Error(noComponentSelectorMessage$1);
          }
          if (Array.isArray(value) && typeof value[0] === "string" && registered == null) {
            for (var _i = 0; _i < value.length; _i++) {
              if (isProcessableValue$1(value[_i])) {
                string += processStyleName$1(key) + ":" + processStyleValue$1(key, value[_i]) + ";";
              }
            }
          } else {
            var interpolated = handleInterpolation$1(mergedProps, registered, value);
            switch (key) {
              case "animation":
              case "animationName": {
                string += processStyleName$1(key) + ":" + interpolated + ";";
                break;
              }
              default: {
                string += key + "{" + interpolated + "}";
              }
            }
          }
        }
      }
    }
    return string;
  }
  var labelPattern$1 = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
  var cursor$1;
  function serializeStyles$1(args, registered, mergedProps) {
    if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && args[0].styles !== void 0) {
      return args[0];
    }
    var stringMode = true;
    var styles2 = "";
    cursor$1 = void 0;
    var strings = args[0];
    if (strings == null || strings.raw === void 0) {
      stringMode = false;
      styles2 += handleInterpolation$1(mergedProps, registered, strings);
    } else {
      var asTemplateStringsArr = strings;
      styles2 += asTemplateStringsArr[0];
    }
    for (var i2 = 1; i2 < args.length; i2++) {
      styles2 += handleInterpolation$1(mergedProps, registered, args[i2]);
      if (stringMode) {
        var templateStringsArr = strings;
        styles2 += templateStringsArr[i2];
      }
    }
    labelPattern$1.lastIndex = 0;
    var identifierName = "";
    var match2;
    while ((match2 = labelPattern$1.exec(styles2)) !== null) {
      identifierName += "-" + match2[1];
    }
    var name = murmur2(styles2) + identifierName;
    return {
      name,
      styles: styles2,
      next: cursor$1
    };
  }
  var syncFallback = function syncFallback2(create) {
    return create();
  };
  var useInsertionEffect = React__default__namespace["useInsertionEffect"] ? React__default__namespace["useInsertionEffect"] : false;
  var useInsertionEffectAlwaysWithSyncFallback = useInsertionEffect || syncFallback;
  var useInsertionEffectWithLayoutFallback = useInsertionEffect || React__default__namespace.useLayoutEffect;
  var isDevelopment$1 = false;
  var EmotionCacheContext = /* @__PURE__ */ React__default__namespace.createContext(
    // we're doing this to avoid preconstruct's dead code elimination in this one case
    // because this module is primarily intended for the browser and node
    // but it's also required in react native and similar environments sometimes
    // and we could have a special build just for that
    // but this is much easier and the native packages
    // might use a different theme context in the future anyway
    typeof HTMLElement !== "undefined" ? /* @__PURE__ */ createCache({
      key: "css"
    }) : null
  );
  EmotionCacheContext.Provider;
  var withEmotionCache = function withEmotionCache2(func) {
    return /* @__PURE__ */ React__default.forwardRef(function(props, ref) {
      var cache2 = React__default.useContext(EmotionCacheContext);
      return func(props, cache2, ref);
    });
  };
  var ThemeContext = /* @__PURE__ */ React__default__namespace.createContext({});
  var hasOwn = {}.hasOwnProperty;
  var typePropName = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__";
  var createEmotionProps = function createEmotionProps2(type, props) {
    var newProps = {};
    for (var key in props) {
      if (hasOwn.call(props, key)) {
        newProps[key] = props[key];
      }
    }
    newProps[typePropName] = type;
    return newProps;
  };
  var Insertion = function Insertion2(_ref) {
    var cache2 = _ref.cache, serialized = _ref.serialized, isStringTag = _ref.isStringTag;
    registerStyles(cache2, serialized, isStringTag);
    useInsertionEffectAlwaysWithSyncFallback(function() {
      return insertStyles(cache2, serialized, isStringTag);
    });
    return null;
  };
  var Emotion = /* @__PURE__ */ withEmotionCache(
    /* <any, any> */
    function(props, cache2, ref) {
      var cssProp = props.css;
      if (typeof cssProp === "string" && cache2.registered[cssProp] !== void 0) {
        cssProp = cache2.registered[cssProp];
      }
      var WrappedComponent = props[typePropName];
      var registeredStyles = [cssProp];
      var className = "";
      if (typeof props.className === "string") {
        className = getRegisteredStyles(cache2.registered, registeredStyles, props.className);
      } else if (props.className != null) {
        className = props.className + " ";
      }
      var serialized = serializeStyles$1(registeredStyles, void 0, React__default__namespace.useContext(ThemeContext));
      className += cache2.key + "-" + serialized.name;
      var newProps = {};
      for (var key in props) {
        if (hasOwn.call(props, key) && key !== "css" && key !== typePropName && !isDevelopment$1) {
          newProps[key] = props[key];
        }
      }
      newProps.className = className;
      if (ref) {
        newProps.ref = ref;
      }
      return /* @__PURE__ */ React__default__namespace.createElement(React__default__namespace.Fragment, null, /* @__PURE__ */ React__default__namespace.createElement(Insertion, {
        cache: cache2,
        serialized,
        isStringTag: typeof WrappedComponent === "string"
      }), /* @__PURE__ */ React__default__namespace.createElement(WrappedComponent, newProps));
    }
  );
  var Emotion$1 = Emotion;
  var Fragment = jsxRuntimeExports.Fragment;
  function jsx(type, props, key) {
    if (!hasOwn.call(props, "css")) {
      return jsxRuntimeExports.jsx(type, props, key);
    }
    return jsxRuntimeExports.jsx(Emotion$1, createEmotionProps(type, props), key);
  }
  function jsxs(type, props, key) {
    if (!hasOwn.call(props, "css")) {
      return jsxRuntimeExports.jsxs(type, props, key);
    }
    return jsxRuntimeExports.jsxs(Emotion$1, createEmotionProps(type, props), key);
  }
  const APP_NAME = "javbus-guide";
  var Global = /* @__PURE__ */ withEmotionCache(function(props, cache2) {
    var styles2 = props.styles;
    var serialized = serializeStyles$1([styles2], void 0, React__default__namespace.useContext(ThemeContext));
    var sheetRef = React__default__namespace.useRef();
    useInsertionEffectWithLayoutFallback(function() {
      var key = cache2.key + "-global";
      var sheet = new cache2.sheet.constructor({
        key,
        nonce: cache2.sheet.nonce,
        container: cache2.sheet.container,
        speedy: cache2.sheet.isSpeedy
      });
      var rehydrating = false;
      var node2 = document.querySelector('style[data-emotion="' + key + " " + serialized.name + '"]');
      if (cache2.sheet.tags.length) {
        sheet.before = cache2.sheet.tags[0];
      }
      if (node2 !== null) {
        rehydrating = true;
        node2.setAttribute("data-emotion", key);
        sheet.hydrate([node2]);
      }
      sheetRef.current = [sheet, rehydrating];
      return function() {
        sheet.flush();
      };
    }, [cache2]);
    useInsertionEffectWithLayoutFallback(function() {
      var sheetRefCurrent = sheetRef.current;
      var sheet = sheetRefCurrent[0], rehydrating = sheetRefCurrent[1];
      if (rehydrating) {
        sheetRefCurrent[1] = false;
        return;
      }
      if (serialized.next !== void 0) {
        insertStyles(cache2, serialized.next, true);
      }
      if (sheet.tags.length) {
        var element = sheet.tags[sheet.tags.length - 1].nextElementSibling;
        sheet.before = element;
        sheet.flush();
      }
      cache2.insert("", serialized, sheet, false);
    }, [cache2, serialized.name]);
    return null;
  });
  function css$1() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return serializeStyles$1(args);
  }
  antd.message.config({
    top: 60,
    maxCount: 3
  });
  function CustomTooltip(props) {
    return jsx(
      antd.Tooltip,
      {
        ...props,
        overlayStyle: {
          width: "max-content",
          maxWidth: "50vw",
          ...props.overlayInnerStyle
        },
        children: props.children
      }
    );
  }
  function AntdAppWrapper({ children }) {
    return jsxs(
      antd.ConfigProvider,
      {
        theme: { cssVar: true, token: { colorPrimary: "#01847F" } },
        locale: zh_CN,
        autoInsertSpaceInButton: false,
        children: [
          jsx(GlobalCss, {}),
          children
        ]
      }
    );
  }
  function GlobalCss() {
    const token2 = antd.theme.useToken();
    const colorPrimary = token2.token.colorPrimary;
    return jsx(
      Global,
      {
        styles: css$1`
        :root {
          --javbus-guide-color-primary: ${colorPrimary};
        }
      `
      }
    );
  }
  var createRoot;
  var m$2 = require$$0;
  {
    createRoot = m$2.createRoot;
    m$2.hydrateRoot;
  }
  const e$1 = Symbol(), t$1 = Symbol(), r$1 = "a", n$1 = "w";
  let o = (e2, t2) => new Proxy(e2, t2);
  const s$1 = Object.getPrototypeOf, c = /* @__PURE__ */ new WeakMap(), l$1 = (e2) => e2 && (c.has(e2) ? c.get(e2) : s$1(e2) === Object.prototype || s$1(e2) === Array.prototype), f = (e2) => "object" == typeof e2 && null !== e2, i = (e2) => {
    if (Array.isArray(e2)) return Array.from(e2);
    const t2 = Object.getOwnPropertyDescriptors(e2);
    return Object.values(t2).forEach((e3) => {
      e3.configurable = true;
    }), Object.create(s$1(e2), t2);
  }, u$1 = (e2) => e2[t$1] || e2, a = (s2, c2, f2, p2) => {
    if (!l$1(s2)) return s2;
    let g2 = p2 && p2.get(s2);
    if (!g2) {
      const e2 = u$1(s2);
      g2 = ((e3) => Object.values(Object.getOwnPropertyDescriptors(e3)).some((e4) => !e4.configurable && !e4.writable))(e2) ? [e2, i(e2)] : [e2], null == p2 || p2.set(s2, g2);
    }
    const [y2, h2] = g2;
    let w2 = f2 && f2.get(y2);
    return w2 && w2[1].f === !!h2 || (w2 = ((o2, s3) => {
      const c3 = { f: s3 };
      let l2 = false;
      const f3 = (e2, t2) => {
        if (!l2) {
          let s4 = c3[r$1].get(o2);
          if (s4 || (s4 = {}, c3[r$1].set(o2, s4)), e2 === n$1) s4[n$1] = true;
          else {
            let r2 = s4[e2];
            r2 || (r2 = /* @__PURE__ */ new Set(), s4[e2] = r2), r2.add(t2);
          }
        }
      }, i2 = { get: (e2, n2) => n2 === t$1 ? o2 : (f3("k", n2), a(Reflect.get(e2, n2), c3[r$1], c3.c, c3.t)), has: (t2, n2) => n2 === e$1 ? (l2 = true, c3[r$1].delete(o2), true) : (f3("h", n2), Reflect.has(t2, n2)), getOwnPropertyDescriptor: (e2, t2) => (f3("o", t2), Reflect.getOwnPropertyDescriptor(e2, t2)), ownKeys: (e2) => (f3(n$1), Reflect.ownKeys(e2)) };
      return s3 && (i2.set = i2.deleteProperty = () => false), [i2, c3];
    })(y2, !!h2), w2[1].p = o(h2 || y2, w2[0]), f2 && f2.set(y2, w2)), w2[1][r$1] = c2, w2[1].c = f2, w2[1].t = p2, w2[1].p;
  }, p$1 = (e2, t2, r2, o2, s2 = Object.is) => {
    if (s2(e2, t2)) return false;
    if (!f(e2) || !f(t2)) return true;
    const c2 = r2.get(u$1(e2));
    if (!c2) return true;
    if (o2) {
      const r3 = o2.get(e2);
      if (r3 && r3.n === t2) return r3.g;
      o2.set(e2, { n: t2, g: false });
    }
    let l2 = null;
    try {
      for (const r3 of c2.h || []) if (l2 = Reflect.has(e2, r3) !== Reflect.has(t2, r3), l2) return l2;
      if (true === c2[n$1]) {
        if (l2 = ((e3, t3) => {
          const r3 = Reflect.ownKeys(e3), n2 = Reflect.ownKeys(t3);
          return r3.length !== n2.length || r3.some((e4, t4) => e4 !== n2[t4]);
        })(e2, t2), l2) return l2;
      } else for (const r3 of c2.o || []) if (l2 = !!Reflect.getOwnPropertyDescriptor(e2, r3) != !!Reflect.getOwnPropertyDescriptor(t2, r3), l2) return l2;
      for (const n2 of c2.k || []) if (l2 = p$1(e2[n2], t2[n2], r2, o2, s2), l2) return l2;
      return null === l2 && (l2 = true), l2;
    } finally {
      o2 && o2.set(e2, { n: t2, g: l2 });
    }
  }, y$1 = (e2) => l$1(e2) && e2[t$1] || null, h$2 = (e2, t2 = true) => {
    c.set(e2, t2);
  }, w$1 = (e2, t2, r2) => {
    const o2 = [], s2 = /* @__PURE__ */ new WeakSet(), c2 = (e3, l2) => {
      if (s2.has(e3)) return;
      f(e3) && s2.add(e3);
      const i2 = f(e3) && t2.get(u$1(e3));
      if (i2) {
        var a2, p2;
        if (null == (a2 = i2.h) || a2.forEach((e4) => {
          const t3 = `:has(${String(e4)})`;
          o2.push(l2 ? [...l2, t3] : [t3]);
        }), true === i2[n$1]) {
          const e4 = ":ownKeys";
          o2.push(l2 ? [...l2, e4] : [e4]);
        } else {
          var g2;
          null == (g2 = i2.o) || g2.forEach((e4) => {
            const t3 = `:hasOwn(${String(e4)})`;
            o2.push(l2 ? [...l2, t3] : [t3]);
          });
        }
        null == (p2 = i2.k) || p2.forEach((t3) => {
          !("value" in (Object.getOwnPropertyDescriptor(e3, t3) || {})) || c2(e3[t3], l2 ? [...l2, t3] : [t3]);
        });
      } else l2 && o2.push(l2);
    };
    return c2(e2), o2;
  };
  const __vite_import_meta_env__$1 = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": false };
  const isObject$5 = (x2) => typeof x2 === "object" && x2 !== null;
  const proxyStateMap = /* @__PURE__ */ new WeakMap();
  const refSet = /* @__PURE__ */ new WeakSet();
  const buildProxyFunction = (objectIs2 = Object.is, newProxy = (target, handler) => new Proxy(target, handler), canProxy = (x2) => isObject$5(x2) && !refSet.has(x2) && (Array.isArray(x2) || !(Symbol.iterator in x2)) && !(x2 instanceof WeakMap) && !(x2 instanceof WeakSet) && !(x2 instanceof Error) && !(x2 instanceof Number) && !(x2 instanceof Date) && !(x2 instanceof String) && !(x2 instanceof RegExp) && !(x2 instanceof ArrayBuffer), defaultHandlePromise = (promise) => {
    switch (promise.status) {
      case "fulfilled":
        return promise.value;
      case "rejected":
        throw promise.reason;
      default:
        throw promise;
    }
  }, snapCache = /* @__PURE__ */ new WeakMap(), createSnapshot = (target, version, handlePromise = defaultHandlePromise) => {
    const cache2 = snapCache.get(target);
    if ((cache2 == null ? void 0 : cache2[0]) === version) {
      return cache2[1];
    }
    const snap = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
    h$2(snap, true);
    snapCache.set(target, [version, snap]);
    Reflect.ownKeys(target).forEach((key) => {
      if (Object.getOwnPropertyDescriptor(snap, key)) {
        return;
      }
      const value = Reflect.get(target, key);
      const { enumerable } = Reflect.getOwnPropertyDescriptor(
        target,
        key
      );
      const desc = {
        value,
        enumerable,
        // This is intentional to avoid copying with proxy-compare.
        // It's still non-writable, so it avoids assigning a value.
        configurable: true
      };
      if (refSet.has(value)) {
        h$2(value, false);
      } else if (value instanceof Promise) {
        delete desc.value;
        desc.get = () => handlePromise(value);
      } else if (proxyStateMap.has(value)) {
        const [target2, ensureVersion] = proxyStateMap.get(
          value
        );
        desc.value = createSnapshot(
          target2,
          ensureVersion(),
          handlePromise
        );
      }
      Object.defineProperty(snap, key, desc);
    });
    return Object.preventExtensions(snap);
  }, proxyCache = /* @__PURE__ */ new WeakMap(), versionHolder = [1, 1], proxyFunction = (initialObject) => {
    if (!isObject$5(initialObject)) {
      throw new Error("object required");
    }
    const found = proxyCache.get(initialObject);
    if (found) {
      return found;
    }
    let version = versionHolder[0];
    const listeners2 = /* @__PURE__ */ new Set();
    const notifyUpdate = (op, nextVersion = ++versionHolder[0]) => {
      if (version !== nextVersion) {
        version = nextVersion;
        listeners2.forEach((listener) => listener(op, nextVersion));
      }
    };
    let checkVersion = versionHolder[1];
    const ensureVersion = (nextCheckVersion = ++versionHolder[1]) => {
      if (checkVersion !== nextCheckVersion && !listeners2.size) {
        checkVersion = nextCheckVersion;
        propProxyStates.forEach(([propProxyState]) => {
          const propVersion = propProxyState[1](nextCheckVersion);
          if (propVersion > version) {
            version = propVersion;
          }
        });
      }
      return version;
    };
    const createPropListener = (prop) => (op, nextVersion) => {
      const newOp = [...op];
      newOp[1] = [prop, ...newOp[1]];
      notifyUpdate(newOp, nextVersion);
    };
    const propProxyStates = /* @__PURE__ */ new Map();
    const addPropListener = (prop, propProxyState) => {
      if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production" && propProxyStates.has(prop)) {
        throw new Error("prop listener already exists");
      }
      if (listeners2.size) {
        const remove = propProxyState[3](createPropListener(prop));
        propProxyStates.set(prop, [propProxyState, remove]);
      } else {
        propProxyStates.set(prop, [propProxyState]);
      }
    };
    const removePropListener = (prop) => {
      var _a;
      const entry = propProxyStates.get(prop);
      if (entry) {
        propProxyStates.delete(prop);
        (_a = entry[1]) == null ? void 0 : _a.call(entry);
      }
    };
    const addListener = (listener) => {
      listeners2.add(listener);
      if (listeners2.size === 1) {
        propProxyStates.forEach(([propProxyState, prevRemove], prop) => {
          if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production" && prevRemove) {
            throw new Error("remove already exists");
          }
          const remove = propProxyState[3](createPropListener(prop));
          propProxyStates.set(prop, [propProxyState, remove]);
        });
      }
      const removeListener = () => {
        listeners2.delete(listener);
        if (listeners2.size === 0) {
          propProxyStates.forEach(([propProxyState, remove], prop) => {
            if (remove) {
              remove();
              propProxyStates.set(prop, [propProxyState]);
            }
          });
        }
      };
      return removeListener;
    };
    const baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
    const handler = {
      deleteProperty(target, prop) {
        const prevValue = Reflect.get(target, prop);
        removePropListener(prop);
        const deleted = Reflect.deleteProperty(target, prop);
        if (deleted) {
          notifyUpdate(["delete", [prop], prevValue]);
        }
        return deleted;
      },
      set(target, prop, value, receiver) {
        const hasPrevValue = Reflect.has(target, prop);
        const prevValue = Reflect.get(target, prop, receiver);
        if (hasPrevValue && (objectIs2(prevValue, value) || proxyCache.has(value) && objectIs2(prevValue, proxyCache.get(value)))) {
          return true;
        }
        removePropListener(prop);
        if (isObject$5(value)) {
          value = y$1(value) || value;
        }
        let nextValue = value;
        if (value instanceof Promise) {
          value.then((v2) => {
            value.status = "fulfilled";
            value.value = v2;
            notifyUpdate(["resolve", [prop], v2]);
          }).catch((e2) => {
            value.status = "rejected";
            value.reason = e2;
            notifyUpdate(["reject", [prop], e2]);
          });
        } else {
          if (!proxyStateMap.has(value) && canProxy(value)) {
            nextValue = proxyFunction(value);
          }
          const childProxyState = !refSet.has(nextValue) && proxyStateMap.get(nextValue);
          if (childProxyState) {
            addPropListener(prop, childProxyState);
          }
        }
        Reflect.set(target, prop, nextValue, receiver);
        notifyUpdate(["set", [prop], value, prevValue]);
        return true;
      }
    };
    const proxyObject = newProxy(baseObject, handler);
    proxyCache.set(initialObject, proxyObject);
    const proxyState = [
      baseObject,
      ensureVersion,
      createSnapshot,
      addListener
    ];
    proxyStateMap.set(proxyObject, proxyState);
    Reflect.ownKeys(initialObject).forEach((key) => {
      const desc = Object.getOwnPropertyDescriptor(
        initialObject,
        key
      );
      if ("value" in desc) {
        proxyObject[key] = initialObject[key];
        delete desc.value;
        delete desc.writable;
      }
      Object.defineProperty(baseObject, key, desc);
    });
    return proxyObject;
  }) => [
    // public functions
    proxyFunction,
    // shared state
    proxyStateMap,
    refSet,
    // internal things
    objectIs2,
    newProxy,
    canProxy,
    defaultHandlePromise,
    snapCache,
    createSnapshot,
    proxyCache,
    versionHolder
  ];
  const [defaultProxyFunction] = buildProxyFunction();
  function proxy(initialObject = {}) {
    return defaultProxyFunction(initialObject);
  }
  function subscribe$4(proxyObject, callback, notifyInSync) {
    const proxyState = proxyStateMap.get(proxyObject);
    if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production" && !proxyState) {
      console.warn("Please use proxy object");
    }
    let promise;
    const ops = [];
    const addListener = proxyState[3];
    let isListenerActive = false;
    const listener = (op) => {
      ops.push(op);
      if (!promise) {
        promise = Promise.resolve().then(() => {
          promise = void 0;
          if (isListenerActive) {
            callback(ops.splice(0));
          }
        });
      }
    };
    const removeListener = addListener(listener);
    isListenerActive = true;
    return () => {
      isListenerActive = false;
      removeListener();
    };
  }
  function snapshot(proxyObject, handlePromise) {
    const proxyState = proxyStateMap.get(proxyObject);
    if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production" && !proxyState) {
      console.warn("Please use proxy object");
    }
    const [target, ensureVersion, createSnapshot] = proxyState;
    return createSnapshot(target, ensureVersion(), handlePromise);
  }
  var shim$2 = { exports: {} };
  var useSyncExternalStoreShim_production_min = {};
  /**
   * @license React
   * use-sync-external-store-shim.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var e = React__default;
  function h$1(a2, b2) {
    return a2 === b2 && (0 !== a2 || 1 / a2 === 1 / b2) || a2 !== a2 && b2 !== b2;
  }
  var k = "function" === typeof Object.is ? Object.is : h$1, l = e.useState, m$1 = e.useEffect, n = e.useLayoutEffect, p = e.useDebugValue;
  function q(a2, b2) {
    var d2 = b2(), f2 = l({ inst: { value: d2, getSnapshot: b2 } }), c2 = f2[0].inst, g2 = f2[1];
    n(function() {
      c2.value = d2;
      c2.getSnapshot = b2;
      r(c2) && g2({ inst: c2 });
    }, [a2, d2, b2]);
    m$1(function() {
      r(c2) && g2({ inst: c2 });
      return a2(function() {
        r(c2) && g2({ inst: c2 });
      });
    }, [a2]);
    p(d2);
    return d2;
  }
  function r(a2) {
    var b2 = a2.getSnapshot;
    a2 = a2.value;
    try {
      var d2 = b2();
      return !k(a2, d2);
    } catch (f2) {
      return true;
    }
  }
  function t(a2, b2) {
    return b2();
  }
  var u = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? t : q;
  useSyncExternalStoreShim_production_min.useSyncExternalStore = void 0 !== e.useSyncExternalStore ? e.useSyncExternalStore : u;
  {
    shim$2.exports = useSyncExternalStoreShim_production_min;
  }
  var shimExports = shim$2.exports;
  const useSyncExternalStoreExports = /* @__PURE__ */ getDefaultExportFromCjs(shimExports);
  const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": false };
  const { use } = React__default;
  const { useSyncExternalStore } = useSyncExternalStoreExports;
  const useAffectedDebugValue = (state, affected) => {
    const pathList = React__default.useRef();
    React__default.useEffect(() => {
      pathList.current = w$1(state, affected);
    });
    React__default.useDebugValue(pathList.current);
  };
  const targetCache = /* @__PURE__ */ new WeakMap();
  function useSnapshot(proxyObject, options) {
    const notifyInSync = void 0;
    const lastSnapshot = React__default.useRef();
    const lastAffected = React__default.useRef();
    let inRender = true;
    const currSnapshot = useSyncExternalStore(
      React__default.useCallback(
        (callback) => {
          const unsub = subscribe$4(proxyObject, callback);
          callback();
          return unsub;
        },
        [proxyObject, notifyInSync]
      ),
      () => {
        const nextSnapshot = snapshot(proxyObject, use);
        try {
          if (!inRender && lastSnapshot.current && lastAffected.current && !p$1(
            lastSnapshot.current,
            nextSnapshot,
            lastAffected.current,
            /* @__PURE__ */ new WeakMap()
          )) {
            return lastSnapshot.current;
          }
        } catch (e2) {
        }
        return nextSnapshot;
      },
      () => snapshot(proxyObject, use)
    );
    inRender = false;
    const currAffected = /* @__PURE__ */ new WeakMap();
    React__default.useEffect(() => {
      lastSnapshot.current = currSnapshot;
      lastAffected.current = currAffected;
    });
    if ((__vite_import_meta_env__ ? "production" : void 0) !== "production") {
      useAffectedDebugValue(currSnapshot, currAffected);
    }
    const proxyCache = React__default.useMemo(() => /* @__PURE__ */ new WeakMap(), []);
    return a(
      currSnapshot,
      currAffected,
      proxyCache,
      targetCache
    );
  }
  const settingsUiState = proxy({
    settingsModalOpen: false
  });
  function zhStringComparer(_a, _b) {
    const [a2, b2] = [_a, _b];
    return a2.localeCompare(b2, "zh-CN");
  }
  function mapZhString(s2) {
    return s2.replaceAll(new RegExp(String.raw`\w`, "g"), "000$&");
  }
  function proxySet(initialValues) {
    const set = proxy({
      data: Array.from(new Set(initialValues)),
      has(value) {
        return this.data.indexOf(value) !== -1;
      },
      add(value) {
        let hasProxy = false;
        if (typeof value === "object" && value !== null) {
          hasProxy = this.data.indexOf(proxy(value)) !== -1;
        }
        if (this.data.indexOf(value) === -1 && !hasProxy) {
          this.data.push(value);
        }
        return this;
      },
      delete(value) {
        const index = this.data.indexOf(value);
        if (index === -1) {
          return false;
        }
        this.data.splice(index, 1);
        return true;
      },
      clear() {
        this.data.splice(0);
      },
      get size() {
        return this.data.length;
      },
      forEach(cb) {
        this.data.forEach((value) => {
          cb(value, value, this);
        });
      },
      get [Symbol.toStringTag]() {
        return "Set";
      },
      toJSON() {
        return new Set(this.data);
      },
      [Symbol.iterator]() {
        return this.data[Symbol.iterator]();
      },
      values() {
        return this.data.values();
      },
      keys() {
        return this.data.values();
      },
      entries() {
        return new Set(this.data).entries();
      }
    });
    Object.defineProperties(set, {
      data: {
        enumerable: false
      },
      size: {
        enumerable: false
      },
      toJSON: {
        enumerable: false
      }
    });
    Object.seal(set);
    return set;
  }
  const initialSettings = {
    simplifyPages: true,
    disableTagTextSelect: true,
    autoParseVideoCountLimit: 1500,
    tagsForceOrder: [],
    tagsBlackList: [],
    showBlackListCollectionCheckbox: false,
    alwaysViewThreadInNewWindow: true
  };
  const allowedKeys = Object.keys(initialSettings);
  const storageKey = "settings";
  const savedSettings = lodash.pick(GM_getValue(storageKey) || {}, allowedKeys);
  const settings = proxy({ ...initialSettings, ...savedSettings });
  subscribe$4(settings, () => {
    GM_setValue(storageKey, lodash.pick(snapshot(settings), allowedKeys));
  });
  function useSettingsSnapshot() {
    return useSnapshot(settings);
  }
  var safeIsNaN = Number.isNaN || function ponyfill(value) {
    return typeof value === "number" && value !== value;
  };
  function isEqual(first, second) {
    if (first === second) {
      return true;
    }
    if (safeIsNaN(first) && safeIsNaN(second)) {
      return true;
    }
    return false;
  }
  function areInputsEqual(newInputs, lastInputs) {
    if (newInputs.length !== lastInputs.length) {
      return false;
    }
    for (var i2 = 0; i2 < newInputs.length; i2++) {
      if (!isEqual(newInputs[i2], lastInputs[i2])) {
        return false;
      }
    }
    return true;
  }
  function memoizeOne(resultFn, isEqual2) {
    if (isEqual2 === void 0) {
      isEqual2 = areInputsEqual;
    }
    var cache2 = null;
    function memoized() {
      var newArgs = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        newArgs[_i] = arguments[_i];
      }
      if (cache2 && cache2.lastThis === this && isEqual2(newArgs, cache2.lastArgs)) {
        return cache2.lastResult;
      }
      var lastResult = resultFn.apply(this, newArgs);
      cache2 = {
        lastResult,
        lastArgs: newArgs,
        lastThis: this
      };
      return lastResult;
    }
    memoized.clear = function clear() {
      cache2 = null;
    };
    return memoized;
  }
  function customMemo(fn) {
    return memoizeOne(fn, lodash.isEqual);
  }
  var CollectionType = ((CollectionType2) => {
    CollectionType2["Single"] = "single";
    CollectionType2["Other"] = "other";
    CollectionType2["Collection"] = "collection";
    CollectionType2["BlackList"] = "blackList";
    return CollectionType2;
  })(CollectionType || {});
  const CollectionTypeValues = Object.values(CollectionType);
  const HANZI_SINGLE = "单体作品";
  const HANZI_COLLECTION = "合集";
  const videoHasCollectionTag = (item2) => {
    var _a;
    return !!((_a = item2.detailInfo) == null ? void 0 : _a.tags.some((t2) => t2.name === HANZI_COLLECTION));
  };
  const videoHasSingleTag = (item2) => {
    var _a;
    return !!((_a = item2.detailInfo) == null ? void 0 : _a.tags.some((t2) => t2.name === HANZI_SINGLE));
  };
  const videoHasBlackListTag = (item2) => {
    var _a;
    return !!((_a = item2.detailInfo) == null ? void 0 : _a.tags.some((t2) => settings.tagsBlackList.includes(t2.name)));
  };
  const COLLECTION_MIN_COUNT = 6;
  function classifyCollectionType(v2) {
    var _a;
    const starCount = (_a = v2.detailInfo) == null ? void 0 : _a.stars.length;
    if (videoHasBlackListTag(v2)) return "blackList";
    if (videoHasSingleTag(v2)) return "single";
    if (starCount === 1) return "single";
    if (videoHasCollectionTag(v2)) return "collection";
    if (starCount && starCount >= COLLECTION_MIN_COUNT) return "collection";
    return "other";
  }
  const CollectionTypeConfig = {
    ["blackList"]: {
      label: "黑名单",
      tooltip: `包含黑名单内 Tag 的影片`
    },
    ["single"]: {
      label: HANZI_SINGLE,
      tooltip: `包含「${HANZI_SINGLE}」Tag 的影片 或 演员数量 = 1 的影片`
    },
    ["collection"]: {
      label: HANZI_COLLECTION,
      tooltip: jsxs(Fragment, { children: [
        "包含「",
        HANZI_COLLECTION,
        "」Tag 的影片",
        jsx("br", {}),
        "或演员数量 ",
        ">=",
        " ",
        COLLECTION_MIN_COUNT,
        " 的影片"
      ] })
    },
    ["other"]: {
      label: "其它",
      tooltip: jsxs(Fragment, { children: [
        "其它剩余影片, 筛选顺序为: ",
        jsx("br", {}),
        "黑名单 -> 单体作品 -> 合集 -> 其它"
      ] })
    }
  };
  function filterByCollection(videos, includeRecord) {
    return videos.filter((item2) => {
      const { collectionType } = item2;
      return includeRecord[collectionType];
    });
  }
  customMemo(filterByCollection);
  const jiuziti2xinziti = {
    "亞": "亜",
    "惡": "悪",
    "壓": "圧",
    "圍": "囲",
    "醫": "医",
    "爲": "為",
    "壹": "壱",
    "逸": "逸",
    "隱": "隠",
    "榮": "栄",
    "營": "営",
    "衞": "衛",
    "驛": "駅",
    "謁": "謁",
    "圓": "円",
    "鹽": "塩",
    "緣": "縁",
    "艷": "艶",
    "應": "応",
    "歐": "欧",
    "毆": "殴",
    "櫻": "桜",
    "奧": "奥",
    "橫": "横",
    "溫": "温",
    "穩": "穏",
    "假": "仮",
    "價": "価",
    "禍": "禍",
    "畫": "画",
    "會": "会",
    "悔": "悔",
    "海": "海",
    "繪": "絵",
    "壞": "壊",
    "懷": "懐",
    "慨": "慨",
    "槪": "概",
    "擴": "拡",
    "殼": "殻",
    "覺": "覚",
    "學": "学",
    "嶽": "岳",
    "樂": "楽",
    "喝": "喝",
    "渴": "渇",
    "褐": "褐",
    "罐": "缶",
    "卷": "巻",
    "陷": "陥",
    "勸": "勧",
    "寬": "寛",
    "漢": "漢",
    "關": "関",
    "歡": "歓",
    "觀": "観",
    "氣": "気",
    "祈": "祈",
    "既": "既",
    "歸": "帰",
    "龜": "亀",
    "器": "器",
    "僞": "偽",
    "戲": "戯",
    "犧": "犠",
    "舊": "旧",
    "據": "拠",
    "擧": "挙",
    "虛": "虚",
    "峽": "峡",
    "挾": "挟",
    "狹": "狭",
    "鄕": "郷",
    "響": "響",
    "曉": "暁",
    "勤": "勤",
    "謹": "謹",
    "區": "区",
    "驅": "駆",
    "勳": "勲",
    "薰": "薫",
    "徑": "径",
    "莖": "茎",
    "惠": "恵",
    "揭": "掲",
    "溪": "渓",
    "經": "経",
    "螢": "蛍",
    "輕": "軽",
    "繼": "継",
    "鷄": "鶏",
    "藝": "芸",
    "擊": "撃",
    "缺": "欠",
    "硏": "研",
    "縣": "県",
    "儉": "倹",
    "劍": "剣",
    "險": "険",
    "圈": "圏",
    "檢": "検",
    "獻": "献",
    "權": "権",
    "顯": "顕",
    "驗": "験",
    "嚴": "厳",
    "廣": "広",
    "效": "効",
    "恆": "恒",
    "黃": "黄",
    "鑛": "鉱",
    "號": "号",
    "國": "国",
    "黑": "黒",
    "穀": "穀",
    "碎": "砕",
    "濟": "済",
    "齋": "斎",
    "劑": "剤",
    "殺": "殺",
    "雜": "雑",
    "參": "参",
    "棧": "桟",
    "蠶": "蚕",
    "慘": "惨",
    "贊": "賛",
    "殘": "残",
    "絲": "糸",
    "祉": "祉",
    "視": "視",
    "齒": "歯",
    "兒": "児",
    "辭": "辞",
    "濕": "湿",
    "實": "実",
    "寫": "写",
    "社": "社",
    "者": "者",
    "煮": "煮",
    "釋": "釈",
    "壽": "寿",
    "收": "収",
    "臭": "臭",
    "從": "従",
    "澁": "渋",
    "獸": "獣",
    "縱": "縦",
    "祝": "祝",
    "肅": "粛",
    "處": "処",
    "暑": "暑",
    "署": "署",
    "緖": "緒",
    "諸": "諸",
    "敍": "叙",
    "將": "将",
    "祥": "祥",
    "稱": "称",
    "涉": "渉",
    "燒": "焼",
    "證": "証",
    "奬": "奨",
    "條": "条",
    "狀": "状",
    "乘": "乗",
    "淨": "浄",
    "剩": "剰",
    "疊": "畳",
    "繩": "縄",
    "壤": "壌",
    "孃": "嬢",
    "讓": "譲",
    "釀": "醸",
    "觸": "触",
    "囑": "嘱",
    "神": "神",
    "眞": "真",
    "寢": "寝",
    "愼": "慎",
    "盡": "尽",
    "圖": "図",
    "粹": "粋",
    "醉": "酔",
    "穗": "穂",
    "隨": "随",
    "髓": "髄",
    "樞": "枢",
    "數": "数",
    "瀨": "瀬",
    "聲": "声",
    "齊": "斉",
    "靜": "静",
    "竊": "窃",
    "攝": "摂",
    "節": "節",
    "專": "専",
    "淺": "浅",
    "戰": "戦",
    "踐": "践",
    "錢": "銭",
    "潛": "潜",
    "纖": "繊",
    "禪": "禅",
    "祖": "祖",
    "雙": "双",
    "壯": "壮",
    "爭": "争",
    "莊": "荘",
    "搜": "捜",
    "插": "挿",
    "巢": "巣",
    "曾": "曽",
    "瘦": "痩",
    "裝": "装",
    "僧": "僧",
    "層": "層",
    "總": "総",
    "騷": "騒",
    "增": "増",
    "憎": "憎",
    "藏": "蔵",
    "贈": "贈",
    "臟": "臓",
    "卽": "即",
    "屬": "属",
    "續": "続",
    "墮": "堕",
    "對": "対",
    "體": "体",
    "帶": "帯",
    "滯": "滞",
    "臺": "台",
    "瀧": "滝",
    "擇": "択",
    "澤": "沢",
    "擔": "担",
    "單": "単",
    "膽": "胆",
    "嘆": "嘆",
    "團": "団",
    "斷": "断",
    "彈": "弾",
    "遲": "遅",
    "癡": "痴",
    "蟲": "虫",
    "晝": "昼",
    "鑄": "鋳",
    "著": "著",
    "廳": "庁",
    "徵": "徴",
    "聽": "聴",
    "懲": "懲",
    "敕": "勅",
    "鎭": "鎮",
    "塚": "塚",
    "遞": "逓",
    "鐵": "鉄",
    "點": "点",
    "轉": "転",
    "傳": "伝",
    "都": "都",
    "燈": "灯",
    "當": "当",
    "黨": "党",
    "盜": "盗",
    "稻": "稲",
    "鬭": "闘",
    "德": "徳",
    "獨": "独",
    "讀": "読",
    "突": "突",
    "屆": "届",
    "難": "難",
    "貳": "弐",
    "惱": "悩",
    "腦": "脳",
    "霸": "覇",
    "拜": "拝",
    "廢": "廃",
    "賣": "売",
    "梅": "梅",
    "麥": "麦",
    "發": "発",
    "髮": "髪",
    "拔": "抜",
    "繁": "繁",
    "晚": "晩",
    "蠻": "蛮",
    "卑": "卑",
    "祕": "秘",
    "碑": "碑",
    "濱": "浜",
    "賓": "賓",
    "頻": "頻",
    "敏": "敏",
    "甁": "瓶",
    "侮": "侮",
    "福": "福",
    "拂": "払",
    "佛": "仏",
    "倂": "併",
    "竝": "並",
    "塀": "塀",
    "餠": "餅",
    "邊": "辺",
    "變": "変",
    "辯": "弁",
    "瓣": "弁",
    "辨": "弁",
    "勉": "勉",
    "步": "歩",
    "寶": "宝",
    "豐": "豊",
    "襃": "褒",
    "墨": "墨",
    "飜": "翻",
    "每": "毎",
    "萬": "万",
    "滿": "満",
    "免": "免",
    "麵": "麺",
    "默": "黙",
    "彌": "弥",
    "譯": "訳",
    "藥": "薬",
    "與": "与",
    "豫": "予",
    "餘": "余",
    "譽": "誉",
    "搖": "揺",
    "樣": "様",
    "謠": "謡",
    "來": "来",
    "賴": "頼",
    "亂": "乱",
    "覽": "覧",
    "欄": "欄",
    "龍": "竜",
    "隆": "隆",
    "虜": "虜",
    "兩": "両",
    "獵": "猟",
    "綠": "緑",
    "淚": "涙",
    "壘": "塁",
    "類": "類",
    "禮": "礼",
    "勵": "励",
    "戾": "戻",
    "靈": "霊",
    "齡": "齢",
    "曆": "暦",
    "歷": "歴",
    "戀": "恋",
    "練": "練",
    "鍊": "錬",
    "爐": "炉",
    "勞": "労",
    "郞": "郎",
    "朗": "朗",
    "廊": "廊",
    "樓": "楼",
    "錄": "録",
    "灣": "湾"
  };
  const kanji2hanzi = {
    "褲": "裤",
    "豔": "艳",
    "萬": "万",
    "與": "与",
    "醜": "丑",
    "専": "专",
    "業": "业",
    "東": "东",
    "糸": "纟",
    "絲": "丝",
    "両": "两",
    "厳": "严",
    "嚴": "严",
    "喪": "丧",
    "個": "个",
    "箇": "个",
    "豊": "丰",
    "豐": "丰",
    "臨": "临",
    "為": "为",
    "麗": "丽",
    "挙": "举",
    "麽": "么",
    "義": "义",
    "烏": "乌",
    "楽": "乐",
    "樂": "乐",
    "喬": "乔",
    "乗": "乘",
    "習": "习",
    "郷": "乡",
    "書": "书",
    "買": "买",
    "亂": "乱",
    "瞭": "了",
    "虧": "亏",
    "曇": "昙",
    "雲": "云",
    "亜": "亚",
    "亞": "亚",
    "産": "产",
    "畝": "亩",
    "親": "亲",
    "褻": "亵",
    "億": "亿",
    "僅": "仅",
    "僕": "仆",
    "従": "从",
    "從": "从",
    "倉": "仓",
    "払": "拂",
    "儀": "仪",
    "們": "们",
    "価": "价",
    "價": "价",
    "衆": "众",
    "優": "优",
    "夥": "伙",
    "會": "会",
    "傴": "伛",
    "傘": "伞",
    "偉": "伟",
    "伝": "传",
    "傳": "传",
    "俥": "伡",
    "傷": "伤",
    "倀": "伥",
    "倫": "伦",
    "傖": "伧",
    "偽": "伪",
    "僞": "伪",
    "佇": "伫",
    "餘": "余",
    "仏": "佛",
    "傭": "佣",
    "僉": "佥",
    "俠": "侠",
    "偵": "侦",
    "側": "侧",
    "僑": "侨",
    "儈": "侩",
    "儕": "侪",
    "儂": "侬",
    "儔": "俦",
    "儼": "俨",
    "倆": "俩",
    "儷": "俪",
    "倹": "俭",
    "儉": "俭",
    "藉": "借",
    "債": "债",
    "値": "值",
    "傾": "倾",
    "仮": "假",
    "僂": "偻",
    "僨": "偾",
    "償": "偿",
    "儎": "傤",
    "儻": "傥",
    "儐": "傧",
    "儲": "储",
    "儺": "傩",
    "児": "儿",
    "兒": "儿",
    "黨": "党",
    "蘭": "兰",
    "関": "关",
    "興": "兴",
    "養": "养",
    "獣": "兽",
    "岡": "冈",
    "冊": "册",
    "軍": "军",
    "農": "农",
    "塚": "冢",
    "鼕": "冬",
    "馮": "冯",
    "氷": "冰",
    "沖": "冲",
    "衝": "冲",
    "決": "决",
    "況": "况",
    "凍": "冻",
    "浄": "净",
    "準": "准",
    "涼": "凉",
    "減": "减",
    "幾": "几",
    "鳳": "凤",
    "鳧": "凫",
    "憑": "凭",
    "凱": "凯",
    "撃": "击",
    "擊": "击",
    "鑿": "凿",
    "芻": "刍",
    "劃": "划",
    "劉": "刘",
    "則": "则",
    "剛": "刚",
    "創": "创",
    "別": "别",
    "彆": "别",
    "剗": "刬",
    "剄": "刭",
    "颳": "刮",
    "製": "制",
    "劊": "刽",
    "劌": "刿",
    "剴": "剀",
    "剤": "剂",
    "劑": "剂",
    "剮": "剐",
    "剣": "剑",
    "劇": "剧",
    "剰": "剩",
    "勧": "劝",
    "勸": "劝",
    "辦": "办",
    "務": "务",
    "勱": "劢",
    "働": "动",
    "動": "动",
    "勵": "励",
    "労": "劳",
    "勞": "劳",
    "勢": "势",
    "勲": "勋",
    "勳": "勋",
    "勩": "勚",
    "匭": "匦",
    "匱": "匮",
    "區": "区",
    "韆": "千",
    "昇": "升",
    "華": "华",
    "協": "协",
    "単": "单",
    "單": "单",
    "売": "卖",
    "賣": "卖",
    "蔔": "卜",
    "盧": "卢",
    "衛": "卫",
    "巻": "卷",
    "捲": "卷",
    "廠": "厂",
    "庁": "厅",
    "暦": "历",
    "歴": "历",
    "厲": "厉",
    "圧": "压",
    "壓": "压",
    "厭": "厌",
    "厙": "厍",
    "厴": "厣",
    "県": "县",
    "縣": "县",
    "靉": "叆",
    "靆": "叇",
    "雙": "双",
    "発": "发",
    "髪": "发",
    "変": "变",
    "畳": "叠",
    "隻": "只",
    "葉": "叶",
    "號": "号",
    "嘆": "叹",
    "嘰": "叽",
    "籲": "吁",
    "喫": "吃",
    "閤": "合",
    "後": "后",
    "嚇": "吓",
    "嗎": "吗",
    "呑": "吞",
    "噸": "吨",
    "聞": "闻",
    "聴": "听",
    "啓": "启",
    "呉": "吴",
    "嘸": "呒",
    "嘔": "呕",
    "嚦": "呖",
    "唄": "呗",
    "員": "员",
    "咼": "呙",
    "嗆": "呛",
    "嗚": "呜",
    "詠": "咏",
    "嚨": "咙",
    "嚀": "咛",
    "噝": "咝",
    "諮": "咨",
    "響": "响",
    "唖": "哑",
    "啞": "哑",
    "噠": "哒",
    "嘵": "哓",
    "噦": "哕",
    "嘩": "哗",
    "噲": "哙",
    "嚌": "哜",
    "噥": "哝",
    "喲": "哟",
    "嗊": "唝",
    "嘮": "唠",
    "啢": "唡",
    "嗩": "唢",
    "喚": "唤",
    "嘖": "啧",
    "嗇": "啬",
    "囀": "啭",
    "嘓": "啯",
    "囉": "啰",
    "嘽": "啴",
    "噴": "喷",
    "嘍": "喽",
    "嚳": "喾",
    "囁": "嗫",
    "噯": "嗳",
    "嚶": "嘤",
    "囑": "嘱",
    "嚕": "噜",
    "団": "团",
    "園": "园",
    "睏": "困",
    "囲": "围",
    "圇": "囵",
    "図": "图",
    "圖": "图",
    "円": "圆",
    "圓": "圆",
    "圏": "圈",
    "聖": "圣",
    "壙": "圹",
    "場": "场",
    "壊": "坏",
    "壞": "坏",
    "塊": "块",
    "堅": "坚",
    "壇": "坛",
    "壢": "坜",
    "壩": "坝",
    "墳": "坟",
    "墜": "坠",
    "塁": "垒",
    "壘": "垒",
    "墾": "垦",
    "堊": "垩",
    "墊": "垫",
    "埡": "垭",
    "墶": "垯",
    "壋": "垱",
    "塏": "垲",
    "堖": "垴",
    "塒": "埘",
    "堝": "埚",
    "塹": "堑",
    "墮": "堕",
    "壪": "塆",
    "増": "增",
    "壌": "壤",
    "壯": "壮",
    "聲": "声",
    "殻": "壳",
    "壺": "壶",
    "壼": "壸",
    "壱": "壹",
    "処": "处",
    "備": "备",
    "復": "复",
    "複": "复",
    "頭": "头",
    "誇": "夸",
    "夾": "夹",
    "奪": "夺",
    "奮": "奋",
    "奨": "奖",
    "奬": "奖",
    "粧": "妆",
    "婦": "妇",
    "媽": "妈",
    "嫗": "妪",
    "嬀": "妫",
    "姉": "姊",
    "薑": "姜",
    "姫": "姬",
    "婁": "娄",
    "婭": "娅",
    "嬈": "娆",
    "嬌": "娇",
    "孌": "娈",
    "嬢": "娘",
    "娯": "娱",
    "媧": "娲",
    "嫿": "婳",
    "嬰": "婴",
    "嬋": "婵",
    "嬸": "婶",
    "嬃": "媭",
    "嬡": "嫒",
    "嬪": "嫔",
    "孫": "孙",
    "孿": "孪",
    "寧": "宁",
    "実": "实",
    "實": "实",
    "寵": "宠",
    "審": "审",
    "憲": "宪",
    "宮": "宫",
    "傢": "家",
    "寛": "宽",
    "寬": "宽",
    "賓": "宾",
    "対": "对",
    "對": "对",
    "尋": "寻",
    "導": "导",
    "將": "将",
    "爾": "尔",
    "塵": "尘",
    "堯": "尧",
    "層": "层",
    "屛": "屏",
    "屬": "属",
    "屢": "屡",
    "屨": "屦",
    "嶼": "屿",
    "歳": "岁",
    "豈": "岂",
    "嶇": "岖",
    "崗": "岗",
    "峴": "岘",
    "嵐": "岚",
    "島": "岛",
    "嶺": "岭",
    "崬": "岽",
    "巋": "岿",
    "嶨": "峃",
    "嶧": "峄",
    "峽": "峡",
    "嶢": "峣",
    "嶠": "峤",
    "巒": "峦",
    "嶗": "崂",
    "崍": "崃",
    "嶮": "崄",
    "嵆": "嵇",
    "嶸": "嵘",
    "嶔": "嵚",
    "嶁": "嵝",
    "巓": "巅",
    "巣": "巢",
    "鞏": "巩",
    "巰": "巯",
    "幣": "币",
    "帥": "帅",
    "師": "师",
    "幃": "帏",
    "帳": "帐",
    "簾": "帘",
    "幟": "帜",
    "帯": "带",
    "帶": "带",
    "幀": "帧",
    "幬": "帱",
    "幘": "帻",
    "幗": "帼",
    "乾": "干",
    "幹": "干",
    "並": "并",
    "併": "并",
    "広": "广",
    "廣": "广",
    "荘": "庄",
    "慶": "庆",
    "廬": "庐",
    "廡": "庑",
    "庫": "库",
    "応": "应",
    "應": "应",
    "廟": "庙",
    "廃": "废",
    "廎": "庼",
    "開": "开",
    "異": "异",
    "棄": "弃",
    "弐": "贰",
    "弔": "吊",
    "張": "张",
    "弳": "弪",
    "彎": "弯",
    "弾": "弹",
    "彈": "弹",
    "強": "强",
    "帰": "归",
    "歸": "归",
    "錄": "录",
    "録": "录",
    "彠": "彟",
    "徹": "彻",
    "徴": "徵",
    "徵": "征",
    "禦": "御",
    "徳": "德",
    "憶": "忆",
    "懺": "忏",
    "誌": "志",
    "憂": "忧",
    "愾": "忾",
    "懐": "怀",
    "懷": "怀",
    "態": "态",
    "慫": "怂",
    "憮": "怃",
    "慪": "怄",
    "悵": "怅",
    "愴": "怆",
    "憐": "怜",
    "総": "总",
    "懟": "怼",
    "懌": "怿",
    "戀": "恋",
    "懇": "恳",
    "悪": "恶",
    "慟": "恸",
    "愷": "恺",
    "惻": "恻",
    "悩": "恼",
    "惱": "恼",
    "惲": "恽",
    "懸": "悬",
    "慳": "悭",
    "憫": "悯",
    "驚": "惊",
    "恵": "惠",
    "懼": "惧",
    "慘": "惨",
    "懲": "惩",
    "憊": "惫",
    "愜": "惬",
    "憚": "惮",
    "慣": "惯",
    "癒": "愈",
    "憤": "愤",
    "憒": "愦",
    "願": "愿",
    "懣": "懑",
    "戔": "戋",
    "戯": "戏",
    "戧": "戗",
    "戦": "战",
    "戰": "战",
    "闘": "斗",
    "戸": "户",
    "戻": "戾",
    "纔": "才",
    "撲": "扑",
    "託": "讬",
    "執": "执",
    "拡": "扩",
    "捫": "扪",
    "掃": "扫",
    "揚": "扬",
    "擾": "扰",
    "摺": "折",
    "撫": "抚",
    "摶": "抟",
    "摳": "抠",
    "掄": "抡",
    "搶": "抢",
    "護": "护",
    "報": "报",
    "擔": "担",
    "抜": "拔",
    "拝": "拜",
    "擬": "拟",
    "攏": "拢",
    "揀": "拣",
    "擁": "拥",
    "攔": "拦",
    "擰": "拧",
    "撥": "拨",
    "択": "择",
    "擇": "择",
    "掛": "挂",
    "摯": "挚",
    "攣": "挛",
    "掗": "挜",
    "撾": "挝",
    "撻": "挞",
    "挾": "挟",
    "撓": "挠",
    "撟": "挢",
    "擠": "挤",
    "揮": "挥",
    "撏": "挦",
    "撈": "捞",
    "損": "损",
    "撿": "捡",
    "換": "换",
    "拠": "据",
    "據": "据",
    "擄": "掳",
    "摑": "掴",
    "擲": "掷",
    "摻": "掺",
    "摜": "掼",
    "挿": "插",
    "掲": "揭",
    "攙": "搀",
    "擱": "搁",
    "摟": "搂",
    "攪": "搅",
    "捜": "搜",
    "摂": "摄",
    "攝": "摄",
    "攄": "摅",
    "揺": "摇",
    "擯": "摈",
    "攤": "摊",
    "攖": "撄",
    "攆": "撵",
    "擷": "撷",
    "擼": "撸",
    "攛": "撺",
    "擻": "擞",
    "収": "收",
    "効": "效",
    "敵": "敌",
    "勅": "敕",
    "數": "数",
    "斎": "斋",
    "斕": "斓",
    "斬": "斩",
    "斷": "断",
    "鏇": "旋",
    "無": "无",
    "舊": "旧",
    "時": "时",
    "曠": "旷",
    "暘": "旸",
    "晝": "昼",
    "曨": "昽",
    "顕": "显",
    "顯": "显",
    "曬": "晒",
    "暁": "晓",
    "曉": "晓",
    "暈": "晕",
    "暉": "晖",
    "晩": "晚",
    "暫": "暂",
    "曖": "暧",
    "賛": "赞",
    "術": "术",
    "硃": "朱",
    "樸": "朴",
    "機": "机",
    "殺": "杀",
    "雑": "杂",
    "権": "权",
    "權": "权",
    "條": "条",
    "來": "来",
    "楊": "杨",
    "榪": "杩",
    "傑": "杰",
    "鬆": "松",
    "闆": "板",
    "極": "极",
    "構": "构",
    "菓": "果",
    "樅": "枞",
    "樞": "枢",
    "棗": "枣",
    "櫪": "枥",
    "梘": "枧",
    "棖": "枨",
    "楓": "枫",
    "梟": "枭",
    "檸": "柠",
    "査": "查",
    "檉": "柽",
    "標": "标",
    "桟": "栈",
    "棧": "栈",
    "櫛": "栉",
    "櫳": "栊",
    "棟": "栋",
    "櫨": "栌",
    "櫟": "栎",
    "欄": "栏",
    "樹": "树",
    "様": "样",
    "樣": "样",
    "欒": "栾",
    "卓": "桌",
    "橈": "桡",
    "楨": "桢",
    "檔": "档",
    "榿": "桤",
    "橋": "桥",
    "樺": "桦",
    "檜": "桧",
    "槳": "桨",
    "樁": "桩",
    "夢": "梦",
    "檮": "梼",
    "槤": "梿",
    "検": "检",
    "檢": "检",
    "碁": "棋",
    "槧": "椠",
    "欏": "椤",
    "橢": "椭",
    "欖": "榄",
    "櫬": "榇",
    "櫚": "榈",
    "欅": "榉",
    "檟": "槚",
    "檻": "槛",
    "櫧": "槠",
    "桜": "樱",
    "櫻": "樱",
    "櫞": "橼",
    "歓": "欢",
    "歟": "欤",
    "歐": "欧",
    "歩": "步",
    "岐": "歧",
    "殲": "歼",
    "殤": "殇",
    "殘": "残",
    "殞": "殒",
    "殮": "殓",
    "殫": "殚",
    "殯": "殡",
    "毆": "殴",
    "轂": "毂",
    "毎": "每",
    "畢": "毕",
    "毿": "毵",
    "氌": "氇",
    "気": "气",
    "氣": "气",
    "雰": "氛",
    "氫": "氢",
    "氬": "氩",
    "彙": "汇",
    "漢": "汉",
    "汚": "污",
    "湯": "汤",
    "澐": "沄",
    "瀋": "沈",
    "溝": "沟",
    "灃": "沣",
    "漚": "沤",
    "瀝": "沥",
    "淪": "沦",
    "滄": "沧",
    "渢": "沨",
    "潙": "沩",
    "滬": "沪",
    "濔": "沵",
    "濘": "泞",
    "涙": "泪",
    "瀧": "泷",
    "瀘": "泸",
    "濼": "泺",
    "潟": "舄",
    "瀉": "泻",
    "潑": "泼",
    "沢": "泽",
    "澤": "泽",
    "涇": "泾",
    "潔": "洁",
    "灑": "洒",
    "窪": "洼",
    "浹": "浃",
    "淺": "浅",
    "漿": "浆",
    "澆": "浇",
    "湞": "浈",
    "溮": "浉",
    "濁": "浊",
    "測": "测",
    "澮": "浍",
    "済": "济",
    "濟": "济",
    "瀏": "浏",
    "滻": "浐",
    "渾": "浑",
    "滸": "浒",
    "濃": "浓",
    "潯": "浔",
    "濜": "浕",
    "塗": "涂",
    "渉": "涉",
    "濤": "涛",
    "澇": "涝",
    "淶": "涞",
    "漣": "涟",
    "潿": "涠",
    "渦": "涡",
    "溳": "涢",
    "滌": "涤",
    "潤": "润",
    "漲": "涨",
    "渋": "涩",
    "澱": "淀",
    "渊": "淵",
    "淵": "渊",
    "漬": "渍",
    "漸": "渐",
    "澠": "渑",
    "漁ｗ": "渔",
    "滲": "渗",
    "渇": "渴",
    "遊": "游",
    "灣": "湾",
    "潰": "溃",
    "濺": "溅",
    "漊": "溇",
    "渓": "溪",
    "潷": "滗",
    "滯": "滞",
    "灄": "滠",
    "満": "满",
    "滿": "满",
    "瀅": "滢",
    "濾": "滤",
    "濫": "滥",
    "灤": "滦",
    "浜": "滨",
    "濱": "滨",
    "灘": "滩",
    "澦": "滪",
    "灕": "漓",
    "瀠": "潆",
    "瀟": "潇",
    "瀲": "潋",
    "濰": "潍",
    "瀾": "澜",
    "瀨": "濑",
    "瀬": "濑",
    "瀕": "濒",
    "灝": "灏",
    "滅": "灭",
    "燈": "灯",
    "霊": "灵",
    "竈": "灶",
    "災": "灾",
    "燦": "灿",
    "煬": "炀",
    "煒": "炜",
    "熗": "炝",
    "砲": "炮",
    "點": "点",
    "錬": "炼",
    "熾": "炽",
    "爍": "烁",
    "爛": "烂",
    "烴": "烃",
    "燭": "烛",
    "煙": "烟",
    "煩": "烦",
    "焼": "烧",
    "燒": "烧",
    "燴": "烩",
    "燙": "烫",
    "燼": "烬",
    "熱": "热",
    "燜": "焖",
    "燾": "焘",
    "薫": "熏",
    "愛": "爱",
    "爺": "爷",
    "牘": "牍",
    "牽": "牵",
    "犠": "牺",
    "犧": "牺",
    "犢": "犊",
    "狀": "状",
    "獷": "犷",
    "獁": "犸",
    "猶": "犹",
    "狽": "狈",
    "獮": "狝",
    "獰": "狞",
    "獨": "独",
    "獅": "狮",
    "獪": "狯",
    "獄": "狱",
    "猻": "狲",
    "猟": "猎",
    "獵": "猎",
    "獼": "猕",
    "玀": "猡",
    "獻": "献",
    "獺": "獭",
    "璣": "玑",
    "璵": "玙",
    "瑒": "玚",
    "瑪": "玛",
    "瑋": "玮",
    "環": "环",
    "現": "现",
    "瑲": "玱",
    "璽": "玺",
    "璫": "珰",
    "琿": "珲",
    "璡": "琎",
    "璉": "琏",
    "瓊": "琼",
    "璦": "瑷",
    "瓔": "璎",
    "瓚": "瓒",
    "甌": "瓯",
    "電": "电",
    "畫": "画",
    "暢": "畅",
    "疇": "畴",
    "疎": "疏",
    "癤": "疖",
    "療": "疗",
    "瘧": "疟",
    "癘": "疠",
    "瘍": "疡",
    "癧": "疬",
    "瘲": "疭",
    "瘡": "疮",
    "瘋": "疯",
    "癥": "症",
    "癰": "痈",
    "痙": "痉",
    "癢": "痒",
    "瘂": "痖",
    "癆": "痨",
    "癇": "痫",
    "癉": "瘅",
    "瘮": "瘆",
    "瘞": "瘗",
    "癟": "瘪",
    "癱": "瘫",
    "癮": "瘾",
    "癭": "瘿",
    "癩": "癞",
    "癬": "癣",
    "癲": "癫",
    "皚": "皑",
    "皺": "皱",
    "皸": "皲",
    "塩": "盐",
    "監": "监",
    "蓋": "盖",
    "盤": "盘",
    "瞘": "眍",
    "矓": "眬",
    "睞": "睐",
    "瞼": "睑",
    "瞶": "瞆",
    "瞞": "瞒",
    "矚": "瞩",
    "矯": "矫",
    "磯": "矶",
    "礬": "矾",
    "鉱": "矿",
    "碭": "砀",
    "碼": "码",
    "硯": "砚",
    "碸": "砜",
    "礪": "砺",
    "礫": "砾",
    "礎": "础",
    "硜": "硁",
    "碩": "硕",
    "硤": "硖",
    "磑": "硙",
    "礄": "硚",
    "確": "确",
    "礙": "碍",
    "砕": "碎",
    "磧": "碛",
    "禮": "礼",
    "禡": "祃",
    "禕": "祎",
    "禰": "祢",
    "禎": "祯",
    "禱": "祷",
    "禍": "祸",
    "禪": "禅",
    "離": "离",
    "種": "种",
    "積": "积",
    "稱": "称",
    "穢": "秽",
    "穠": "秾",
    "穌": "稣",
    "穏": "稳",
    "穩": "稳",
    "稲": "稻",
    "穡": "穑",
    "穂": "穗",
    "窮": "穷",
    "竊": "窃",
    "竅": "窍",
    "窵": "窎",
    "窯": "窑",
    "窓": "窗",
    "竄": "窜",
    "窩": "窝",
    "竇": "窦",
    "窶": "窭",
    "競": "竞",
    "篤": "笃",
    "筆": "笔",
    "筧": "笕",
    "籠": "笼",
    "籩": "笾",
    "築": "筑",
    "篳": "筚",
    "篩": "筛",
    "簹": "筜",
    "籌": "筹",
    "篔": "筼",
    "篠": "筿",
    "簡": "简",
    "籙": "箓",
    "簀": "箦",
    "篋": "箧",
    "籜": "箨",
    "籮": "箩",
    "簞": "箪",
    "簣": "篑",
    "簍": "篓",
    "籃": "篮",
    "籛": "篯",
    "籬": "篱",
    "籪": "簖",
    "籟": "籁",
    "糴": "籴",
    "類": "类",
    "糶": "粜",
    "糲": "粝",
    "糞": "粪",
    "糧": "粮",
    "粋": "粹",
    "係": "系",
    "繋": "系",
    "緊": "紧",
    "縶": "絷",
    "繁": "繁",
    "糾": "纠",
    "紆": "纡",
    "紅": "红",
    "紂": "纣",
    "維": "维",
    "繊": "纤",
    "紇": "纥",
    "約": "约",
    "級": "级",
    "紈": "纨",
    "紀": "纪",
    "紉": "纫",
    "緯": "纬",
    "紜": "纭",
    "紘": "纮",
    "純": "纯",
    "紕": "纰",
    "紗": "纱",
    "綱": "纲",
    "納": "纳",
    "縦": "纵",
    "縱": "纵",
    "綸": "纶",
    "紛": "纷",
    "紙": "纸",
    "紋": "纹",
    "紡": "纺",
    "紵": "纻",
    "紖": "纼",
    "紐": "纽",
    "紓": "纾",
    "線": "缐",
    "紺": "绀",
    "紱": "绂",
    "練": "练",
    "組": "组",
    "紳": "绅",
    "細": "细",
    "織": "织",
    "終": "终",
    "縐": "绉",
    "絆": "绊",
    "絀": "绌",
    "紹": "绍",
    "繹": "绎",
    "経": "经",
    "經": "经",
    "紿": "绐",
    "綁": "绑",
    "結": "结",
    "絝": "绔",
    "絰": "绖",
    "絎": "绗",
    "絵": "绘",
    "繪": "绘",
    "給": "给",
    "絢": "绚",
    "絳": "绛",
    "絡": "络",
    "絕": "绝",
    "絶": "绝",
    "絞": "绞",
    "統": "统",
    "綆": "绠",
    "綃": "绡",
    "絹": "绢",
    "綌": "绤",
    "綏": "绥",
    "継": "继",
    "繼": "继",
    "綈": "绨",
    "績": "绩",
    "緒": "绪",
    "綾": "绫",
    "続": "续",
    "續": "续",
    "綺": "绮",
    "緋": "绯",
    "綽": "绰",
    "緄": "绲",
    "縄": "绳",
    "繩": "绳",
    "綿": "绵",
    "綬": "绶",
    "綢": "绸",
    "綯": "绹",
    "綹": "绺",
    "綣": "绻",
    "綜": "综",
    "綻": "绽",
    "綰": "绾",
    "緑": "绿",
    "綴": "缀",
    "緇": "缁",
    "緙": "缂",
    "緗": "缃",
    "緬": "缅",
    "纜": "缆",
    "緹": "缇",
    "緲": "缈",
    "緝": "缉",
    "縕": "缊",
    "繢": "缋",
    "緦": "缌",
    "緞": "缎",
    "緶": "缏",
    "緱": "缑",
    "縋": "缒",
    "緩": "缓",
    "締": "缔",
    "縷": "缕",
    "編": "编",
    "縁": "缘",
    "縉": "缙",
    "縛": "缚",
    "縟": "缛",
    "縝": "缜",
    "縫": "缝",
    "縗": "缞",
    "縞": "缟",
    "纏": "缠",
    "縊": "缢",
    "縑": "缣",
    "繽": "缤",
    "縹": "缥",
    "縵": "缦",
    "纓": "缨",
    "縮": "缩",
    "繆": "缪",
    "繅": "缫",
    "纈": "缬",
    "繚": "缭",
    "繕": "缮",
    "繒": "缯",
    "繰": "缲",
    "繯": "缳",
    "繳": "缴",
    "纘": "缵",
    "缶": "罐",
    "網": "网",
    "羅": "罗",
    "罰": "罚",
    "罷": "罢",
    "羆": "罴",
    "羥": "羟",
    "翹": "翘",
    "翽": "翙",
    "翬": "翚",
    "耮": "耢",
    "耬": "耧",
    "聳": "耸",
    "恥": "耻",
    "聶": "聂",
    "聾": "聋",
    "職": "职",
    "聹": "聍",
    "聵": "聩",
    "粛": "肃",
    "腸": "肠",
    "膚": "肤",
    "腎": "肾",
    "腫": "肿",
    "脹": "胀",
    "脅": "胁",
    "膽": "胆",
    "勝": "胜",
    "朧": "胧",
    "腖": "胨",
    "臚": "胪",
    "膠": "胶",
    "脈": "脉",
    "膾": "脍",
    "臓": "脏",
    "臍": "脐",
    "脳": "脑",
    "腦": "脑",
    "胞": "脓",
    "膿": "脓",
    "臠": "脔",
    "腡": "脶",
    "臉": "脸",
    "膕": "腘",
    "膩": "腻",
    "騰": "腾",
    "臏": "膑",
    "臢": "臜",
    "緻": "致",
    "輿": "舆",
    "捨": "舍",
    "舎": "舍",
    "艦": "舰",
    "艙": "舱",
    "般": "船",
    "艫": "舻",
    "艱": "艰",
    "艶": "艳",
    "芸": "艺",
    "藝": "艺",
    "節": "节",
    "薌": "芗",
    "蕪": "芜",
    "蘆": "芦",
    "蕓": "芸",
    "蓯": "苁",
    "葦": "苇",
    "藶": "苈",
    "莧": "苋",
    "萇": "苌",
    "蒼": "苍",
    "蘇": "苏",
    "薴": "苧",
    "蘋": "苹",
    "範": "范",
    "蘢": "茏",
    "蔦": "茑",
    "塋": "茔",
    "煢": "茕",
    "繭": "茧",
    "薦": "荐",
    "薘": "荙",
    "莢": "荚",
    "蕘": "荛",
    "蓽": "荜",
    "薈": "荟",
    "薺": "荠",
    "栄": "荣",
    "榮": "荣",
    "葷": "荤",
    "滎": "荥",
    "犖": "荦",
    "熒": "荧",
    "蕁": "荨",
    "藎": "荩",
    "蓀": "荪",
    "蕒": "荬",
    "葒": "荭",
    "葤": "荮",
    "薬": "药",
    "萊": "莱",
    "蓮": "莲",
    "蒔": "莳",
    "萵": "莴",
    "薟": "莶",
    "獲": "获",
    "穫": "获",
    "蕕": "莸",
    "瑩": "莹",
    "蘀": "萚",
    "蘿": "萝",
    "蛍": "萤",
    "螢": "萤",
    "営": "营",
    "營": "营",
    "縈": "萦",
    "蕭": "萧",
    "薩": "萨",
    "蕆": "蒇",
    "蕢": "蒉",
    "蔣": "蒋",
    "蔞": "蒌",
    "藍": "蓝",
    "薊": "蓟",
    "蘺": "蓠",
    "蕷": "蓣",
    "鎣": "蓥",
    "驀": "蓦",
    "衊": "蔑",
    "蘞": "蔹",
    "藺": "蔺",
    "藹": "蔼",
    "蘄": "蕲",
    "蘊": "蕴",
    "藪": "薮",
    "蔵": "藏",
    "蘚": "藓",
    "虜": "虏",
    "慮": "虑",
    "蟲": "虫",
    "蟣": "虮",
    "雖": "虽",
    "蝦": "虾",
    "蠆": "虿",
    "蝕": "蚀",
    "螞": "蚂",
    "蠶": "蚕",
    "蜆": "蚬",
    "蠱": "蛊",
    "蠣": "蛎",
    "蟶": "蛏",
    "蠻": "蛮",
    "蟄": "蛰",
    "蛺": "蛱",
    "蟯": "蛲",
    "螄": "蛳",
    "蠐": "蛴",
    "蝸": "蜗",
    "蝋": "蜡",
    "蠟": "蜡",
    "蠅": "蝇",
    "蟈": "蝈",
    "蟬": "蝉",
    "螻": "蝼",
    "蠑": "蝾",
    "螿": "螀",
    "蟎": "螨",
    "蠨": "蟏",
    "釁": "衅",
    "補": "补",
    "錶": "表",
    "襯": "衬",
    "襖": "袄",
    "褘": "袆",
    "襲": "袭",
    "襏": "袯",
    "裝": "装",
    "襠": "裆",
    "褳": "裢",
    "襝": "裣",
    "襉": "裥",
    "褸": "褛",
    "襤": "褴",
    "見": "见",
    "観": "观",
    "觀": "观",
    "覎": "觃",
    "規": "规",
    "視": "视",
    "覘": "觇",
    "覧": "览",
    "覚": "觉",
    "覺": "觉",
    "覬": "觊",
    "覡": "觋",
    "覿": "觌",
    "覥": "觍",
    "覦": "觎",
    "覯": "觏",
    "覲": "觐",
    "觴": "觞",
    "觸": "触",
    "觶": "觯",
    "誾": "訚",
    "讋": "詟",
    "譽": "誉",
    "謄": "誊",
    "計": "计",
    "訂": "订",
    "訃": "讣",
    "認": "认",
    "譏": "讥",
    "訐": "讦",
    "訌": "讧",
    "討": "讨",
    "譲": "让",
    "訕": "讪",
    "訖": "讫",
    "訓": "训",
    "議": "议",
    "訊": "讯",
    "記": "记",
    "訒": "讱",
    "講": "讲",
    "諱": "讳",
    "謳": "讴",
    "詎": "讵",
    "訝": "讶",
    "訥": "讷",
    "許": "许",
    "論": "论",
    "訟": "讼",
    "諷": "讽",
    "設": "设",
    "訪": "访",
    "訣": "诀",
    "証": "证",
    "證": "证",
    "詁": "诂",
    "訶": "诃",
    "評": "评",
    "詛": "诅",
    "識": "识",
    "詗": "诇",
    "詐": "诈",
    "訴": "诉",
    "診": "诊",
    "謅": "诌",
    "詞": "词",
    "詘": "诎",
    "詔": "诏",
    "詖": "诐",
    "訳": "译",
    "譯": "译",
    "詒": "诒",
    "誆": "诓",
    "誄": "诔",
    "試": "试",
    "詿": "诖",
    "詩": "诗",
    "詰": "诘",
    "詼": "诙",
    "誠": "诚",
    "誅": "诛",
    "詵": "诜",
    "話": "话",
    "誕": "诞",
    "詬": "诟",
    "詮": "诠",
    "詭": "诡",
    "詢": "询",
    "詣": "诣",
    "諍": "诤",
    "該": "该",
    "詳": "详",
    "詫": "诧",
    "諢": "诨",
    "詡": "诩",
    "譸": "诪",
    "誡": "诫",
    "誣": "诬",
    "語": "语",
    "誚": "诮",
    "誤": "误",
    "誥": "诰",
    "誘": "诱",
    "誨": "诲",
    "説": "说",
    "誦": "诵",
    "誒": "诶",
    "請": "请",
    "諸": "诸",
    "諏": "诹",
    "諾": "诺",
    "読": "读",
    "讀": "读",
    "諑": "诼",
    "誹": "诽",
    "課": "课",
    "諉": "诿",
    "諛": "谀",
    "誰": "谁",
    "諗": "谂",
    "調": "调",
    "諒": "谅",
    "諄": "谆",
    "誶": "谇",
    "談": "谈",
    "讅": "谉",
    "誼": "谊",
    "謀": "谋",
    "諜": "谍",
    "謊": "谎",
    "諫": "谏",
    "諧": "谐",
    "謔": "谑",
    "謁": "谒",
    "謂": "谓",
    "諤": "谔",
    "諭": "谕",
    "諼": "谖",
    "讒": "谗",
    "諳": "谙",
    "諺": "谚",
    "諦": "谛",
    "謎": "谜",
    "諞": "谝",
    "諝": "谞",
    "讜": "谠",
    "謖": "谡",
    "謝": "谢",
    "謠": "谣",
    "謡": "谣",
    "謗": "谤",
    "謙": "谦",
    "謐": "谧",
    "謹": "谨",
    "謾": "谩",
    "謬": "谬",
    "譚": "谭",
    "譖": "谮",
    "譙": "谯",
    "讕": "谰",
    "譜": "谱",
    "譎": "谲",
    "讞": "谳",
    "譴": "谴",
    "讖": "谶",
    "穀": "谷",
    "豶": "豮",
    "貝": "贝",
    "貞": "贞",
    "負": "负",
    "貢": "贡",
    "財": "财",
    "責": "责",
    "賢": "贤",
    "敗": "败",
    "賬": "账",
    "貨": "货",
    "質": "质",
    "販": "贩",
    "貪": "贪",
    "貧": "贫",
    "貶": "贬",
    "購": "购",
    "貯": "贮",
    "貫": "贯",
    "貳": "贰",
    "賤": "贱",
    "賁": "贲",
    "貰": "贳",
    "貼": "贴",
    "貴": "贵",
    "貺": "贶",
    "貸": "贷",
    "貿": "贸",
    "費": "费",
    "賀": "贺",
    "貽": "贻",
    "賊": "贼",
    "贄": "贽",
    "賈": "贾",
    "賄": "贿",
    "貲": "赀",
    "賃": "赁",
    "賂": "赂",
    "資": "资",
    "賅": "赅",
    "賕": "赇",
    "賑": "赈",
    "賚": "赉",
    "賒": "赊",
    "賦": "赋",
    "賭": "赌",
    "贖": "赎",
    "賞": "赏",
    "賜": "赐",
    "贔": "赑",
    "賙": "赒",
    "賡": "赓",
    "賠": "赔",
    "賧": "赕",
    "頼": "赖",
    "賵": "赗",
    "贅": "赘",
    "賻": "赙",
    "賺": "赚",
    "賽": "赛",
    "賾": "赜",
    "讃": "赞",
    "贇": "赟",
    "贈": "赠",
    "贍": "赡",
    "贏": "赢",
    "赬": "赪",
    "趙": "赵",
    "趕": "赶",
    "趨": "趋",
    "趲": "趱",
    "躉": "趸",
    "躍": "跃",
    "躒": "跞",
    "踐": "践",
    "躂": "跶",
    "蹕": "跸",
    "躊": "踌",
    "躓": "踬",
    "躑": "踯",
    "躡": "蹑",
    "蹣": "蹒",
    "躥": "蹿",
    "躪": "躏",
    "躦": "躜",
    "軀": "躯",
    "車": "车",
    "軋": "轧",
    "軌": "轨",
    "軒": "轩",
    "軑": "轪",
    "軔": "轫",
    "転": "转",
    "轉": "转",
    "軛": "轭",
    "輪": "轮",
    "軟": "软",
    "軻": "轲",
    "轤": "轳",
    "軸": "轴",
    "軹": "轵",
    "軼": "轶",
    "軤": "轷",
    "軫": "轸",
    "轢": "轹",
    "軺": "轺",
    "軽": "轻",
    "輕": "轻",
    "軾": "轼",
    "載": "载",
    "輊": "轾",
    "轎": "轿",
    "輈": "辀",
    "輇": "辁",
    "輅": "辂",
    "較": "较",
    "輔": "辅",
    "輛": "辆",
    "輦": "辇",
    "輩": "辈",
    "輝": "辉",
    "輥": "辊",
    "輞": "辋",
    "輬": "辌",
    "輟": "辍",
    "輜": "辎",
    "輳": "辏",
    "輻": "辐",
    "輯": "辑",
    "轀": "辒",
    "輸": "输",
    "轡": "辔",
    "轅": "辕",
    "轄": "辖",
    "輾": "辗",
    "轆": "辘",
    "轍": "辙",
    "轔": "辚",
    "闢": "辟",
    "辯": "辩",
    "辮": "辫",
    "辺": "边",
    "邊": "边",
    "遼": "辽",
    "達": "达",
    "遷": "迁",
    "過": "过",
    "邁": "迈",
    "運": "运",
    "還": "还",
    "這": "这",
    "進": "进",
    "遠": "远",
    "違": "违",
    "連": "连",
    "遅": "迟",
    "邇": "迩",
    "跡": "迹",
    "適": "适",
    "選": "选",
    "遜": "逊",
    "逓": "递",
    "遞": "递",
    "邐": "逦",
    "邏": "逻",
    "遺": "遗",
    "鄧": "邓",
    "鄺": "邝",
    "鄔": "邬",
    "郵": "邮",
    "鄒": "邹",
    "鄴": "邺",
    "隣": "邻",
    "鬱": "郁",
    "郟": "郏",
    "鄶": "郐",
    "鄭": "郑",
    "鄆": "郓",
    "酈": "郦",
    "鄖": "郧",
    "鄲": "郸",
    "酇": "酂",
    "醞": "酝",
    "醱": "酦",
    "醬": "酱",
    "釅": "酽",
    "釃": "酾",
    "醸": "酿",
    "釀": "酿",
    "酔": "醉",
    "酢": "醋",
    "採": "采",
    "釈": "释",
    "釋": "释",
    "裏": "里",
    "鑑": "鉴",
    "鑾": "銮",
    "鏨": "錾",
    "釓": "钆",
    "釔": "钇",
    "針": "针",
    "釘": "钉",
    "釗": "钊",
    "釙": "钋",
    "釕": "钌",
    "釷": "钍",
    "釧": "钏",
    "釤": "钐",
    "釩": "钒",
    "釣": "钓",
    "鍆": "钔",
    "釹": "钕",
    "鍚": "钖",
    "釵": "钗",
    "鈃": "钘",
    "鈣": "钙",
    "鈈": "钚",
    "鈦": "钛",
    "鈍": "钝",
    "鈔": "钞",
    "鐘": "钟",
    "鈉": "钠",
    "鋇": "钡",
    "鋼": "钢",
    "鈑": "钣",
    "鈐": "钤",
    "鑰": "钥",
    "欽": "钦",
    "鈞": "钧",
    "鎢": "钨",
    "鈧": "钪",
    "鈁": "钫",
    "鈥": "钬",
    "鈄": "钭",
    "鈕": "钮",
    "鈀": "钯",
    "鈺": "钰",
    "銭": "钱",
    "錢": "钱",
    "鉦": "钲",
    "鈷": "钴",
    "鉢": "钵",
    "鈳": "钶",
    "鉕": "钷",
    "鈸": "钹",
    "鉬": "钼",
    "鉭": "钽",
    "鉀": "钾",
    "鈿": "钿",
    "鈾": "铀",
    "鉄": "铁",
    "鉑": "铂",
    "鈴": "铃",
    "鑠": "铄",
    "鉛": "铅",
    "鉚": "铆",
    "鈰": "铈",
    "鉉": "铉",
    "鉈": "铊",
    "鉍": "铋",
    "鈮": "铌",
    "鈹": "铍",
    "鐸": "铎",
    "鉶": "铏",
    "銬": "铐",
    "銠": "铑",
    "鉺": "铒",
    "鋩": "铓",
    "錏": "铔",
    "銪": "铕",
    "鋮": "铖",
    "鋏": "铗",
    "鋣": "铘",
    "鐃": "铙",
    "銍": "铚",
    "鐺": "铛",
    "銅": "铜",
    "鋁": "铝",
    "銱": "铞",
    "銦": "铟",
    "鎧": "铠",
    "鍘": "铡",
    "銖": "铢",
    "銑": "铣",
    "鋌": "铤",
    "銩": "铥",
    "銛": "铦",
    "鏵": "铧",
    "銓": "铨",
    "鎩": "铩",
    "鉿": "铪",
    "銚": "铫",
    "鉻": "铬",
    "銘": "铭",
    "錚": "铮",
    "銫": "铯",
    "鉸": "铰",
    "銥": "铱",
    "銃": "铳",
    "鐋": "铴",
    "銨": "铵",
    "銀": "银",
    "銣": "铷",
    "鋳": "铸",
    "鑄": "铸",
    "鐒": "铹",
    "舗": "铺",
    "鋙": "铻",
    "錸": "铼",
    "鋱": "铽",
    "鏈": "链",
    "鏗": "铿",
    "銷": "销",
    "鎖": "锁",
    "鋰": "锂",
    "鋥": "锃",
    "鍋": "锅",
    "鋯": "锆",
    "鋨": "锇",
    "鋝": "锊",
    "鋒": "锋",
    "鋅": "锌",
    "鋶": "锍",
    "鐦": "锎",
    "鐗": "锏",
    "鋭": "锐",
    "銻": "锑",
    "鋃": "锒",
    "鋟": "锓",
    "錒": "锕",
    "錆": "锖",
    "鍺": "锗",
    "鍩": "锘",
    "錯": "错",
    "錨": "锚",
    "錛": "锛",
    "錡": "锜",
    "鍀": "锝",
    "錁": "锞",
    "錕": "锟",
    "錩": "锠",
    "錫": "锡",
    "錮": "锢",
    "鑼": "锣",
    "錘": "锤",
    "錐": "锥",
    "錦": "锦",
    "錈": "锩",
    "鍃": "锪",
    "錇": "锫",
    "錟": "锬",
    "錠": "锭",
    "鍵": "键",
    "鋸": "锯",
    "錳": "锰",
    "錙": "锱",
    "鍥": "锲",
    "鍈": "锳",
    "鍇": "锴",
    "鏘": "锵",
    "鍶": "锶",
    "鍔": "锷",
    "鍛": "锻",
    "鎪": "锼",
    "鍠": "锽",
    "鍰": "锾",
    "鎄": "锿",
    "鍍": "镀",
    "鎂": "镁",
    "鏤": "镂",
    "鐨": "镄",
    "鎇": "镅",
    "鏌": "镆",
    "鎭": "镇",
    "鎮": "镇",
    "鎛": "镈",
    "鎘": "镉",
    "鑷": "镊",
    "钂": "镋",
    "鎳": "镍",
    "鎿": "镎",
    "鎦": "镏",
    "鎬": "镐",
    "鎊": "镑",
    "鎰": "镒",
    "鎵": "镓",
    "鑌": "镔",
    "鏢": "镖",
    "鏜": "镗",
    "鏰": "镚",
    "鏞": "镛",
    "鏡": "镜",
    "鏑": "镝",
    "鏃": "镞",
    "鏐": "镠",
    "鐔": "镡",
    "鐐": "镣",
    "鏷": "镤",
    "鑥": "镥",
    "鐓": "镦",
    "鑭": "镧",
    "鐠": "镨",
    "鑹": "镩",
    "鏹": "镪",
    "鐙": "镫",
    "鑊": "镬",
    "鐳": "镭",
    "鐶": "镮",
    "鐿": "镱",
    "鑔": "镲",
    "鑣": "镳",
    "鑞": "镴",
    "鑱": "镵",
    "鑲": "镶",
    "長": "长",
    "門": "门",
    "閂": "闩",
    "閃": "闪",
    "閈": "闬",
    "閉": "闭",
    "問": "问",
    "闖": "闯",
    "閏": "闰",
    "闈": "闱",
    "閑": "闲",
    "閎": "闳",
    "間": "间",
    "閔": "闵",
    "閌": "闶",
    "悶": "闷",
    "閨": "闺",
    "闥": "闼",
    "閩": "闽",
    "閭": "闾",
    "闓": "闿",
    "閥": "阀",
    "閣": "阁",
    "閡": "阂",
    "閫": "阃",
    "鬮": "阄",
    "閱": "阅",
    "閲": "阅",
    "閬": "阆",
    "闍": "阇",
    "閾": "阈",
    "閹": "阉",
    "鬩": "阋",
    "閿": "阌",
    "閽": "阍",
    "閼": "阏",
    "闡": "阐",
    "闌": "阑",
    "闃": "阒",
    "闠": "阓",
    "闋": "阕",
    "闔": "阖",
    "闐": "阗",
    "闒": "阘",
    "闕": "阙",
    "闞": "阚",
    "闤": "阛",
    "隊": "队",
    "陽": "阳",
    "蔭": "荫",
    "陰": "阴",
    "陣": "阵",
    "階": "阶",
    "際": "际",
    "陸": "陆",
    "隴": "陇",
    "陳": "陈",
    "陘": "陉",
    "陝": "陕",
    "隕": "陨",
    "険": "险",
    "險": "险",
    "陥": "陷",
    "隨": "随",
    "隠": "隐",
    "隱": "隐",
    "隷": "隶",
    "難": "难",
    "雛": "雏",
    "彫": "雕",
    "靂": "雳",
    "霧": "雾",
    "霽": "霁",
    "黴": "霉",
    "靄": "霭",
    "覇": "霸",
    "靚": "靓",
    "靨": "靥",
    "韃": "鞑",
    "鞽": "鞒",
    "韉": "鞯",
    "韋": "韦",
    "韍": "韨",
    "韓": "韩",
    "韙": "韪",
    "韞": "韫",
    "韻": "韵",
    "頁": "页",
    "頂": "顶",
    "頃": "顷",
    "頇": "顸",
    "項": "项",
    "順": "顺",
    "須": "须",
    "頊": "顼",
    "頑": "顽",
    "顧": "顾",
    "頓": "顿",
    "頎": "颀",
    "頒": "颁",
    "頌": "颂",
    "頏": "颃",
    "預": "预",
    "顱": "颅",
    "領": "领",
    "頗": "颇",
    "頸": "颈",
    "頡": "颉",
    "頬": "颊",
    "頰": "颊",
    "頲": "颋",
    "頜": "颌",
    "潁": "颍",
    "熲": "颎",
    "頦": "颏",
    "頤": "颐",
    "頻": "频",
    "頷": "颔",
    "顆": "颗",
    "題": "题",
    "顒": "颙",
    "顎": "颚",
    "顓": "颛",
    "顔": "颜",
    "額": "额",
    "顳": "颞",
    "顢": "颟",
    "顛": "颠",
    "顙": "颡",
    "顥": "颢",
    "纇": "颣",
    "顫": "颤",
    "顬": "颥",
    "顰": "颦",
    "顴": "颧",
    "風": "风",
    "颭": "飐",
    "颮": "飑",
    "颯": "飒",
    "颶": "飓",
    "颸": "飔",
    "颼": "飕",
    "颻": "飖",
    "飀": "飗",
    "飛": "飞",
    "饗": "飨",
    "饜": "餍",
    "飣": "饤",
    "飢": "饥",
    "飥": "饦",
    "餳": "饧",
    "飩": "饨",
    "餼": "饩",
    "飫": "饫",
    "飭": "饬",
    "飯": "饭",
    "飮": "饮",
    "飲": "饮",
    "餞": "饯",
    "飾": "饰",
    "飽": "饱",
    "飼": "饲",
    "飿": "饳",
    "飴": "饴",
    "餌": "饵",
    "饒": "饶",
    "餎": "饹",
    "餃": "饺",
    "餏": "饻",
    "餅": "饼",
    "餠": "饼",
    "餖": "饾",
    "餓": "饿",
    "餒": "馁",
    "餕": "馂",
    "餜": "馃",
    "餛": "馄",
    "餡": "馅",
    "館": "馆",
    "餷": "馇",
    "餿": "馊",
    "饞": "馋",
    "饁": "馌",
    "餺": "馎",
    "餾": "馏",
    "饈": "馐",
    "饉": "馑",
    "饅": "馒",
    "饊": "馓",
    "饌": "馔",
    "饢": "馕",
    "馬": "马",
    "馭": "驭",
    "駄": "驮",
    "馴": "驯",
    "馳": "驰",
    "駆": "驱",
    "馹": "驲",
    "駁": "驳",
    "驢": "驴",
    "駔": "驵",
    "駛": "驶",
    "駟": "驷",
    "駙": "驸",
    "駒": "驹",
    "騶": "驺",
    "駐": "驻",
    "駝": "驼",
    "駑": "驽",
    "駕": "驾",
    "駅": "驿",
    "驛": "驿",
    "駘": "骀",
    "驍": "骁",
    "駰": "骃",
    "驕": "骄",
    "驊": "骅",
    "駱": "骆",
    "駭": "骇",
    "駢": "骈",
    "驪": "骊",
    "騁": "骋",
    "験": "验",
    "騂": "骍",
    "駿": "骏",
    "騏": "骐",
    "騎": "骑",
    "騍": "骒",
    "騅": "骓",
    "驌": "骕",
    "驂": "骖",
    "騙": "骗",
    "騤": "骙",
    "騒": "骚",
    "騷": "骚",
    "騖": "骛",
    "驁": "骜",
    "騮": "骝",
    "騫": "骞",
    "騸": "骟",
    "驃": "骠",
    "驄": "骢",
    "驏": "骣",
    "驟": "骤",
    "驥": "骥",
    "驦": "骦",
    "驤": "骧",
    "髏": "髅",
    "髖": "髋",
    "髕": "髌",
    "髄": "髓",
    "鬹": "鬶",
    "魘": "魇",
    "魎": "魉",
    "魚": "鱼",
    "魛": "鱽",
    "魢": "鱾",
    "魷": "鱿",
    "魨": "鲀",
    "魯": "鲁",
    "魴": "鲂",
    "鮃": "鲆",
    "鱸": "鲈",
    "鮋": "鲉",
    "鮓": "鲊",
    "鮒": "鲋",
    "鮊": "鲌",
    "鮑": "鲍",
    "鱟": "鲎",
    "鮍": "鲏",
    "鮐": "鲐",
    "鮭": "鲑",
    "鮚": "鲒",
    "鮪": "鲔",
    "鮦": "鲖",
    "鰂": "鲗",
    "鮜": "鲘",
    "鱠": "鲙",
    "鱭": "鲚",
    "鮫": "鲛",
    "鮮": "鲜",
    "鯗": "鲞",
    "鱺": "鲡",
    "鰱": "鲢",
    "鰹": "鲣",
    "鯉": "鲤",
    "鰣": "鲥",
    "鯊": "鲨",
    "鯇": "鲩",
    "鮶": "鲪",
    "鯽": "鲫",
    "鯒": "鲬",
    "鯖": "鲭",
    "鯪": "鲮",
    "鯕": "鲯",
    "鯫": "鲰",
    "鯡": "鲱",
    "鯤": "鲲",
    "鯧": "鲳",
    "鯝": "鲴",
    "鯢": "鲵",
    "鯛": "鲷",
    "鯨": "鲸",
    "鰺": "鲹",
    "鯴": "鲺",
    "鯔": "鲻",
    "鱝": "鲼",
    "鰈": "鲽",
    "鰏": "鲾",
    "鱨": "鲿",
    "鰮": "鳁",
    "鰃": "鳂",
    "鰓": "鳃",
    "鰍": "鳅",
    "鰒": "鳆",
    "鰉": "鳇",
    "鰁": "鳈",
    "鱂": "鳉",
    "鯿": "鳊",
    "鰭": "鳍",
    "鰨": "鳎",
    "鰥": "鳏",
    "鰩": "鳐",
    "鰟": "鳑",
    "鰜": "鳒",
    "鰳": "鳓",
    "鰾": "鳔",
    "鱈": "鳕",
    "鰻": "鳗",
    "鰵": "鳘",
    "鱅": "鳙",
    "鱖": "鳜",
    "鱗": "鳞",
    "鱒": "鳟",
    "鱯": "鳠",
    "鱤": "鳡",
    "鱧": "鳢",
    "鱣": "鳣",
    "鳥": "鸟",
    "鳩": "鸠",
    "鶏": "鸡",
    "鳶": "鸢",
    "鳴": "鸣",
    "鳲": "鸤",
    "鷗": "鸥",
    "鶬": "鸧",
    "鴇": "鸨",
    "鴣": "鸪",
    "鶇": "鸫",
    "鸕": "鸬",
    "鴨": "鸭",
    "鴞": "鸮",
    "鴦": "鸯",
    "鴒": "鸰",
    "鴟": "鸱",
    "鴛": "鸳",
    "鷽": "鸴",
    "鴕": "鸵",
    "鷥": "鸶",
    "鷙": "鸷",
    "鴯": "鸸",
    "鴰": "鸹",
    "鵂": "鸺",
    "鴴": "鸻",
    "鴿": "鸽",
    "鸞": "鸾",
    "鴻": "鸿",
    "鵐": "鹀",
    "鸝": "鹂",
    "鵑": "鹃",
    "鵠": "鹄",
    "鵒": "鹆",
    "鵜": "鹈",
    "鵡": "鹉",
    "鵲": "鹊",
    "鶓": "鹋",
    "鵪": "鹌",
    "鵯": "鹎",
    "鵬": "鹏",
    "鵮": "鹐",
    "鶉": "鹑",
    "鶊": "鹒",
    "鵷": "鹓",
    "鷫": "鹔",
    "鶘": "鹕",
    "鶡": "鹖",
    "鶚": "鹗",
    "鶻": "鹘",
    "鶖": "鹙",
    "鶥": "鹛",
    "鶩": "鹜",
    "鷂": "鹞",
    "鶲": "鹟",
    "鶹": "鹠",
    "鶺": "鹡",
    "鷁": "鹢",
    "鶼": "鹣",
    "鶴": "鹤",
    "鷖": "鹥",
    "鸚": "鹦",
    "鷓": "鹧",
    "鷚": "鹨",
    "鷯": "鹩",
    "鷦": "鹪",
    "鷲": "鹫",
    "鷸": "鹬",
    "鷺": "鹭",
    "鸇": "鹯",
    "鷹": "鹰",
    "鸌": "鹱",
    "鸏": "鹲",
    "鸛": "鹳",
    "鹺": "鹾",
    "麥": "麦",
    "黌": "黉",
    "黒": "黑",
    "黙": "默",
    "黶": "黡",
    "黷": "黩",
    "黲": "黪",
    "黽": "黾",
    "黿": "鼋",
    "鼉": "鼍",
    "斉": "齐",
    "齏": "齑",
    "歯": "齿",
    "齒": "齿",
    "齕": "龁",
    "齗": "龂",
    "齟": "龃",
    "齡": "龄",
    "齢": "龄",
    "齠": "龆",
    "齜": "龇",
    "齦": "龈",
    "齬": "龉",
    "齪": "龊",
    "齲": "龋",
    "竜": "龙",
    "龍": "龙",
    "龔": "龚",
    "龕": "龛",
    "亀": "龟",
    "鮎": "鲇",
    "窺": "窥",
    "穎": "颖",
    "頴": "颕",
    "於": "于",
    "臥": "卧",
    "鈎": "钩",
    "姦": "奸",
    "澗": "涧",
    "贋": "赝",
    "蟻": "蚁",
    "漁": "渔",
    "兇": "凶",
    "蕎": "荞",
    "鍬": "锹",
    "荊": "荆",
    "轟": "轰",
    "阪": "坂",
    "咲": "笑",
    "柵": "栅",
    "屍": "尸",
    "週": "周",
    "鋤": "锄",
    "嘗": "尝",
    "鍾": "锺",
    "棲": "栖",
    "叢": "丛",
    "槍": "枪",
    "滝": "泷",
    "竪": "竖",
    "歎": "叹",
    "註": "注",
    "瀦": "潴",
    "苧": "苎",
    "著": "着",
    "鎚": "锤",
    "紬": "䌷",
    "蕩": "荡",
    "禿": "秃",
    "罵": "骂",
    "盃": "杯",
    "鋪": "铺",
    "湊": "凑",
    "裡": "里",
    "侶": "侣",
    "煉": "炼",
    "聯": "联",
    "呂": "吕",
    "櫓": "橹",
    "亙": "亘",
    "鰐": "鳄",
    "侖": "仑",
    "儘": "尽",
    "俔": "伣",
    "僥": "侥",
    "兌": "兑",
    "兩": "两",
    "冪": "幂",
    "處": "处",
    "刪": "删",
    "剋": "克",
    "劍": "剑",
    "勁": "劲",
    "匯": "汇",
    "卻": "却",
    "厠": "厕",
    "參": "参",
    "吶": "呐",
    "嘯": "啸",
    "嚥": "咽",
    "嚮": "向",
    "囂": "嚣",
    "囈": "呓",
    "國": "国",
    "圍": "围",
    "團": "团",
    "塢": "坞",
    "毀": "毁",
    "墻": "墙",
    "壟": "垄",
    "壽": "寿",
    "奐": "奂",
    "奧": "奥",
    "奩": "奁",
    "妝": "妆",
    "媼": "媪",
    "嫻": "娴",
    "學": "学",
    "寢": "寝",
    "寫": "写",
    "寶": "宝",
    "專": "专",
    "屆": "届",
    "屓": "屃",
    "崢": "峥",
    "嶄": "崭",
    "嶽": "岳",
    "幺": "么",
    "麼": "么",
    "廁": "厕",
    "廂": "厢",
    "廈": "厦",
    "廝": "厮",
    "廚": "厨",
    "廢": "废",
    "廩": "廪",
    "廳": "厅",
    "彌": "弥",
    "徑": "径",
    "徠": "徕",
    "恆": "恒",
    "惡": "恶",
    "慍": "愠",
    "愨": "悫",
    "慄": "栗",
    "慚": "惭",
    "懍": "懔",
    "懶": "懒",
    "懾": "慑",
    "戲": "戏",
    "搖": "摇",
    "搗": "捣",
    "舉": "举",
    "攬": "揽",
    "擴": "扩",
    "擺": "摆",
    "攜": "携",
    "敘": "叙",
    "斂": "敛",
    "斃": "毙",
    "變": "变",
    "晉": "晋",
    "曄": "晔",
    "朮": "术",
    "桿": "杆",
    "梔": "栀",
    "椏": "桠",
    "榲": "榅",
    "槨": "椁",
    "樓": "楼",
    "檣": "樯",
    "櫃": "柜",
    "檳": "槟",
    "盜": "盗",
    "歡": "欢",
    "歿": "殁",
    "殼": "壳",
    "氈": "毡",
    "沒": "没",
    "洶": "汹",
    "浣": "灌",
    "淨": "净",
    "淒": "凄",
    "渙": "涣",
    "滾": "滚",
    "滷": "卤",
    "澀": "涩",
    "潛": "潜",
    "濕": "湿",
    "濛": "蒙",
    "瀰": "弥",
    "煥": "焕",
    "燉": "炖",
    "爐": "炉",
    "爭": "争",
    "爲": "为",
    "牆": "墙",
    "狹": "狭",
    "獎": "奖",
    "獸": "兽",
    "琺": "珐",
    "瑣": "琐",
    "瓏": "珑",
    "當": "当",
    "疊": "叠",
    "痾": "疴",
    "瘻": "瘘",
    "癡": "痴",
    "發": "发",
    "皰": "疱",
    "盞": "盏",
    "盡": "尽",
    "盪": "荡",
    "眥": "眦",
    "矇": "蒙",
    "礦": "矿",
    "磚": "砖",
    "磽": "硗",
    "祿": "禄",
    "齋": "斋",
    "稈": "秆",
    "稟": "禀",
    "筍": "笋",
    "筴": "䇲",
    "箋": "笺",
    "箏": "筝",
    "簫": "箫",
    "簽": "签",
    "籖": "签",
    "絅": "䌹",
    "紲": "绁",
    "絨": "绒",
    "綉": "绣",
    "絛": "绦",
    "綵": "䌽",
    "綫": "线",
    "總": "总",
    "緘": "缄",
    "緡": "缗",
    "繃": "绷",
    "縲": "缧",
    "繞": "绕",
    "繿": "䍀",
    "纖": "纤",
    "罌": "罂",
    "羈": "羁",
    "聰": "聪",
    "聽": "听",
    "肅": "肃",
    "脛": "胫",
    "膃": "腽",
    "臘": "腊",
    "臟": "脏",
    "臺": "台",
    "艤": "舣",
    "艷": "艳",
    "茲": "兹",
    "莖": "茎",
    "莊": "庄",
    "葯": "药",
    "蓴": "莼",
    "薀": "蕰",
    "薔": "蔷",
    "藥": "药",
    "蛻": "蜕",
    "蝟": "猬",
    "袞": "衮",
    "褌": "裈",
    "襪": "袜",
    "覓": "觅",
    "覽": "览",
    "訛": "讹",
    "詆": "诋",
    "誑": "诳",
    "諂": "谄",
    "謚": "谥",
    "謫": "谪",
    "謨": "谟",
    "譫": "谵",
    "讎": "雠",
    "讓": "让",
    "豎": "竖",
    "豬": "猪",
    "贊": "赞",
    "贐": "赆",
    "齎": "赍",
    "贓": "赃",
    "踴": "踊",
    "蹌": "跄",
    "蹤": "踪",
    "躋": "跻",
    "輒": "辄",
    "輓": "挽",
    "辭": "辞",
    "迴": "回",
    "逕": "迳",
    "遲": "迟",
    "鄰": "邻",
    "醫": "医",
    "釐": "厘",
    "鉞": "钺",
    "鉗": "钳",
    "鉅": "钜",
    "鉤": "钩",
    "鉋": "铇",
    "銜": "衔",
    "銹": "锈",
    "鎔": "镕",
    "鏝": "镘",
    "鐫": "镌",
    "鐵": "铁",
    "鑒": "鉴",
    "鑽": "钻",
    "钁": "镢",
    "閘": "闸",
    "閻": "阎",
    "闊": "阔",
    "關": "关",
    "隸": "隶",
    "雋": "隽",
    "雜": "杂",
    "靈": "灵",
    "靜": "静",
    "靦": "腼",
    "鞦": "秋",
    "韜": "韬",
    "頽": "颓",
    "顏": "颜",
    "颱": "台",
    "飄": "飘",
    "飆": "飙",
    "餉": "饷",
    "饋": "馈",
    "饑": "饥",
    "駸": "骎",
    "驅": "驱",
    "騾": "骡",
    "驗": "验",
    "驫": "骉",
    "體": "体",
    "髮": "发",
    "鬚": "须",
    "鬢": "鬓",
    "鬥": "斗",
    "鬧": "闹",
    "鯀": "鲧",
    "鯰": "鲶",
    "鰲": "鳌",
    "鳬": "凫",
    "鴉": "鸦",
    "鴆": "鸩",
    "鶯": "莺",
    "鵁": "䴔",
    "鵝": "鹅",
    "鷄": "鸡",
    "鹵": "卤",
    "鹹": "咸",
    "鹽": "盐",
    "麩": "麸",
    "齊": "齐",
    "齔": "龀",
    "齣": "出",
    "齷": "龌",
    "齶": "腭",
    "龜": "龟",
    "遙": "遥",
    "瑤": "瑶",
    "凜": "凛",
    "闇": "暗",
    "鎌": "镰",
    "込": "迂",
    "搾": "榨",
    "呪": "咒",
    "麺": "面",
    "孃": "娘",
    "愼": "慎",
    "擧": "举",
    "敍": "叙",
    "澁": "涩",
    "眞": "真",
    "祕": "秘",
    "竝": "并",
    "飜": "翻",
    "衞": "卫",
    "襃": "褒",
    "鑛": "矿"
  };
  const tc2sc = {
    "內": "内",
    "勻": "匀",
    "弔": "吊",
    "戶": "户",
    "冊": "册",
    "氾": "泛",
    "丟": "丢",
    "亙": "亘",
    "兇": "凶",
    "伕": "夫",
    "吒": "咤",
    "汙": "污",
    "佇": "伫",
    "別": "别",
    "佔": "占",
    "吳": "吴",
    "刪": "删",
    "呂": "吕",
    "兌": "兑",
    "囪": "囱",
    "壯": "壮",
    "夾": "夹",
    "妝": "妆",
    "決": "决",
    "沖": "冲",
    "沒": "没",
    "禿": "秃",
    "災": "灾",
    "貝": "贝",
    "車": "车",
    "迆": "迤",
    "見": "见",
    "兩": "两",
    "來": "来",
    "並": "并",
    "併": "并",
    "侖": "仑",
    "亞": "亚",
    "協": "协",
    "兒": "儿",
    "卹": "恤",
    "姍": "姗",
    "彿": "佛",
    "屆": "届",
    "岡": "冈",
    "東": "东",
    "拋": "抛",
    "爭": "争",
    "歿": "殁",
    "況": "况",
    "狀": "状",
    "臥": "卧",
    "玨": "珏",
    "糾": "纠",
    "羋": "芈",
    "軋": "轧",
    "係": "系",
    "兗": "兖",
    "俠": "侠",
    "長": "长",
    "門": "门",
    "侶": "侣",
    "剋": "克",
    "則": "则",
    "勁": "劲",
    "卻": "却",
    "姪": "侄",
    "姦": "奸",
    "奐": "奂",
    "屍": "尸",
    "帥": "帅",
    "恆": "恒",
    "彥": "彦",
    "後": "后",
    "枴": "拐",
    "洶": "汹",
    "為": "为",
    "柵": "栅",
    "牴": "抵",
    "盃": "杯",
    "紂": "纣",
    "紅": "红",
    "紀": "纪",
    "紉": "纫",
    "紇": "纥",
    "約": "约",
    "苧": "苎",
    "計": "计",
    "訂": "订",
    "訃": "讣",
    "貞": "贞",
    "負": "负",
    "軍": "军",
    "軌": "轨",
    "倆": "俩",
    "頁": "页",
    "風": "风",
    "飛": "飞",
    "們": "们",
    "倀": "伥",
    "閂": "闩",
    "倣": "仿",
    "個": "个",
    "韋": "韦",
    "倖": "幸",
    "倫": "伦",
    "倉": "仓",
    "凍": "冻",
    "剛": "刚",
    "員": "员",
    "娛": "娱",
    "剝": "剥",
    "孫": "孙",
    "島": "岛",
    "師": "师",
    "宮": "宫",
    "庫": "库",
    "悅": "悦",
    "徑": "径",
    "峽": "峡",
    "恥": "耻",
    "挾": "挟",
    "書": "书",
    "氣": "气",
    "時": "时",
    "晉": "晋",
    "烏": "乌",
    "涇": "泾",
    "狹": "狭",
    "狽": "狈",
    "皰": "疱",
    "珮": "佩",
    "畝": "亩",
    "紛": "纷",
    "紡": "纺",
    "紗": "纱",
    "紋": "纹",
    "純": "纯",
    "紐": "纽",
    "紕": "纰",
    "級": "级",
    "紜": "纭",
    "脅": "胁",
    "納": "纳",
    "紙": "纸",
    "脈": "脉",
    "茲": "兹",
    "芻": "刍",
    "荊": "荆",
    "記": "记",
    "訐": "讦",
    "討": "讨",
    "訌": "讧",
    "訕": "讪",
    "訊": "讯",
    "託": "托",
    "訓": "训",
    "訖": "讫",
    "豈": "岂",
    "財": "财",
    "貢": "贡",
    "釘": "钉",
    "針": "针",
    "軒": "轩",
    "釗": "钊",
    "軔": "轫",
    "閃": "闪",
    "陣": "阵",
    "迺": "乃",
    "陝": "陕",
    "迴": "回",
    "隻": "只",
    "飢": "饥",
    "馬": "马",
    "鬥": "斗",
    "偺": "咱",
    "偽": "伪",
    "偉": "伟",
    "偵": "侦",
    "側": "侧",
    "國": "国",
    "啞": "哑",
    "堅": "坚",
    "堊": "垩",
    "務": "务",
    "動": "动",
    "問": "问",
    "執": "执",
    "唸": "念",
    "夠": "够",
    "區": "区",
    "參": "参",
    "婁": "娄",
    "啣": "衔",
    "婦": "妇",
    "張": "张",
    "強": "强",
    "崢": "峥",
    "崑": "昆",
    "彫": "雕",
    "崙": "仑",
    "從": "从",
    "帶": "带",
    "帳": "帐",
    "專": "专",
    "將": "将",
    "屜": "屉",
    "悽": "凄",
    "悵": "怅",
    "捨": "舍",
    "掃": "扫",
    "敗": "败",
    "掛": "挂",
    "啟": "启",
    "捫": "扪",
    "敘": "叙",
    "掄": "抡",
    "斬": "斩",
    "掙": "挣",
    "採": "采",
    "捲": "卷",
    "晝": "昼",
    "棄": "弃",
    "淺": "浅",
    "梔": "栀",
    "勗": "勖",
    "條": "条",
    "梟": "枭",
    "殺": "杀",
    "氫": "氢",
    "桿": "杆",
    "涼": "凉",
    "淵": "渊",
    "梱": "捆",
    "淒": "凄",
    "淚": "泪",
    "猙": "狰",
    "淪": "沦",
    "淨": "净",
    "現": "现",
    "琍": "璃",
    "眾": "众",
    "產": "产",
    "牽": "牵",
    "硃": "朱",
    "畢": "毕",
    "異": "异",
    "細": "细",
    "紳": "绅",
    "組": "组",
    "終": "终",
    "缽": "钵",
    "莢": "荚",
    "習": "习",
    "莖": "茎",
    "絆": "绊",
    "絃": "弦",
    "統": "统",
    "莊": "庄",
    "紮": "扎",
    "紹": "绍",
    "脣": "唇",
    "紼": "绋",
    "脫": "脱",
    "絀": "绌",
    "貧": "贫",
    "處": "处",
    "覓": "觅",
    "規": "规",
    "訪": "访",
    "軛": "轭",
    "訝": "讶",
    "軟": "软",
    "訣": "诀",
    "這": "这",
    "訥": "讷",
    "許": "许",
    "設": "设",
    "訟": "讼",
    "連": "连",
    "訛": "讹",
    "術": "术",
    "袞": "衮",
    "販": "贩",
    "逕": "迳",
    "責": "责",
    "貫": "贯",
    "貨": "货",
    "貪": "贪",
    "傖": "伧",
    "傘": "伞",
    "凱": "凯",
    "頂": "顶",
    "剴": "剀",
    "頃": "顷",
    "創": "创",
    "釵": "钗",
    "魚": "鱼",
    "釦": "扣",
    "鳥": "鸟",
    "勞": "劳",
    "釣": "钓",
    "勝": "胜",
    "釧": "钏",
    "麥": "麦",
    "勛": "勋",
    "閉": "闭",
    "傢": "家",
    "陳": "陈",
    "陸": "陆",
    "陰": "阴",
    "備": "备",
    "傑": "杰",
    "圍": "围",
    "堯": "尧",
    "喪": "丧",
    "場": "场",
    "尋": "寻",
    "報": "报",
    "嵐": "岚",
    "單": "单",
    "壺": "壶",
    "幀": "帧",
    "喲": "哟",
    "幾": "几",
    "喚": "唤",
    "廁": "厕",
    "喬": "乔",
    "廂": "厢",
    "復": "复",
    "換": "换",
    "惡": "恶",
    "揚": "扬",
    "悶": "闷",
    "揀": "拣",
    "愜": "惬",
    "惻": "恻",
    "惱": "恼",
    "揮": "挥",
    "湧": "涌",
    "湊": "凑",
    "減": "减",
    "棗": "枣",
    "欽": "钦",
    "殘": "残",
    "棟": "栋",
    "殼": "壳",
    "棧": "栈",
    "渦": "涡",
    "湯": "汤",
    "棲": "栖",
    "測": "测",
    "琺": "珐",
    "發": "发",
    "渾": "浑",
    "渙": "涣",
    "盜": "盗",
    "睏": "困",
    "無": "无",
    "甦": "苏",
    "硯": "砚",
    "畫": "画",
    "稈": "秆",
    "稅": "税",
    "猶": "犹",
    "痙": "痉",
    "絲": "丝",
    "絡": "络",
    "菸": "烟",
    "給": "给",
    "絢": "绚",
    "筆": "笔",
    "肅": "肃",
    "華": "华",
    "筍": "笋",
    "菴": "庵",
    "萊": "莱",
    "腎": "肾",
    "絞": "绞",
    "脹": "胀",
    "結": "结",
    "絨": "绒",
    "絕": "绝",
    "評": "评",
    "貴": "贵",
    "詞": "词",
    "買": "买",
    "証": "证",
    "貶": "贬",
    "詁": "诂",
    "貿": "贸",
    "虛": "虚",
    "詔": "诏",
    "貸": "贷",
    "詛": "诅",
    "詐": "诈",
    "詆": "诋",
    "訴": "诉",
    "診": "诊",
    "貯": "贮",
    "貼": "贴",
    "貳": "贰",
    "貽": "贻",
    "視": "视",
    "賁": "贲",
    "軻": "轲",
    "註": "注",
    "費": "费",
    "軸": "轴",
    "詠": "咏",
    "賀": "贺",
    "軼": "轶",
    "閔": "闵",
    "閏": "闰",
    "開": "开",
    "週": "周",
    "閑": "闲",
    "間": "间",
    "進": "进",
    "閒": "闲",
    "隊": "队",
    "郵": "邮",
    "階": "阶",
    "鄉": "乡",
    "陽": "阳",
    "鈔": "钞",
    "鈣": "钙",
    "鈕": "钮",
    "鈉": "钠",
    "鈞": "钧",
    "鈍": "钝",
    "雋": "隽",
    "鈐": "钤",
    "雲": "云",
    "韌": "韧",
    "項": "项",
    "順": "顺",
    "須": "须",
    "飪": "饪",
    "飯": "饭",
    "飩": "饨",
    "飲": "饮",
    "飭": "饬",
    "馮": "冯",
    "馭": "驭",
    "黃": "黄",
    "亂": "乱",
    "傭": "佣",
    "債": "债",
    "塗": "涂",
    "塚": "冢",
    "傳": "传",
    "嗎": "吗",
    "僅": "仅",
    "傾": "倾",
    "嗇": "啬",
    "傷": "伤",
    "塊": "块",
    "塢": "坞",
    "傯": "偬",
    "奧": "奥",
    "嗚": "呜",
    "剷": "铲",
    "嗆": "呛",
    "勦": "剿",
    "媽": "妈",
    "園": "园",
    "媼": "媪",
    "勢": "势",
    "圓": "圆",
    "匯": "汇",
    "損": "损",
    "搶": "抢",
    "慄": "栗",
    "搖": "摇",
    "幹": "干",
    "慍": "愠",
    "搗": "捣",
    "愾": "忾",
    "廈": "厦",
    "愴": "怆",
    "彙": "汇",
    "徬": "彷",
    "暉": "晖",
    "搾": "榨",
    "暈": "晕",
    "會": "会",
    "業": "业",
    "愛": "爱",
    "極": "极",
    "煩": "烦",
    "煉": "炼",
    "楊": "杨",
    "溝": "沟",
    "楨": "桢",
    "滅": "灭",
    "煬": "炀",
    "楓": "枫",
    "溼": "湿",
    "煥": "焕",
    "溫": "温",
    "爺": "爷",
    "歲": "岁",
    "毀": "毁",
    "準": "准",
    "獅": "狮",
    "滄": "沧",
    "瑯": "琅",
    "煙": "烟",
    "祿": "禄",
    "琿": "珲",
    "睞": "睐",
    "萬": "万",
    "稜": "棱",
    "當": "当",
    "睜": "睁",
    "稟": "禀",
    "痺": "痹",
    "節": "节",
    "盞": "盏",
    "粵": "粤",
    "經": "经",
    "絹": "绢",
    "萵": "莴",
    "綑": "捆",
    "腳": "脚",
    "綁": "绑",
    "腫": "肿",
    "綏": "绥",
    "虜": "虏",
    "腦": "脑",
    "號": "号",
    "義": "义",
    "羨": "羡",
    "葷": "荤",
    "聖": "圣",
    "葦": "苇",
    "蛻": "蜕",
    "葉": "叶",
    "腸": "肠",
    "話": "话",
    "誅": "诛",
    "補": "补",
    "詭": "诡",
    "詢": "询",
    "裝": "装",
    "詮": "诠",
    "裡": "里",
    "詬": "诟",
    "裊": "袅",
    "較": "较",
    "載": "载",
    "詫": "诧",
    "軾": "轼",
    "該": "该",
    "賊": "贼",
    "輊": "轾",
    "詳": "详",
    "資": "资",
    "試": "试",
    "賈": "贾",
    "農": "农",
    "詩": "诗",
    "賄": "贿",
    "運": "运",
    "詰": "诘",
    "貲": "赀",
    "遊": "游",
    "誇": "夸",
    "賃": "赁",
    "詼": "诙",
    "賂": "赂",
    "詣": "诣",
    "賅": "赅",
    "達": "达",
    "誠": "诚",
    "跡": "迹",
    "違": "违",
    "鈾": "铀",
    "鉛": "铅",
    "鉋": "刨",
    "鉤": "钩",
    "過": "过",
    "鉑": "铂",
    "鈴": "铃",
    "閘": "闸",
    "鄒": "邹",
    "隕": "陨",
    "電": "电",
    "鈷": "钴",
    "鉗": "钳",
    "鈸": "钹",
    "鈽": "钚",
    "鉀": "钾",
    "預": "预",
    "頑": "顽",
    "頓": "顿",
    "頊": "顼",
    "頒": "颁",
    "頌": "颂",
    "飼": "饲",
    "飴": "饴",
    "飽": "饱",
    "飾": "饰",
    "馳": "驰",
    "馱": "驮",
    "馴": "驯",
    "鳩": "鸠",
    "壽": "寿",
    "嘔": "呕",
    "夥": "伙",
    "僥": "侥",
    "嘆": "叹",
    "夢": "梦",
    "嘍": "喽",
    "奪": "夺",
    "奩": "奁",
    "僕": "仆",
    "嘖": "啧",
    "僑": "侨",
    "僱": "雇",
    "嫗": "妪",
    "團": "团",
    "圖": "图",
    "劃": "划",
    "塵": "尘",
    "匱": "匮",
    "厭": "厌",
    "寧": "宁",
    "墊": "垫",
    "塹": "堑",
    "嘗": "尝",
    "實": "实",
    "慇": "殷",
    "寢": "寝",
    "態": "态",
    "對": "对",
    "暢": "畅",
    "屢": "屡",
    "慣": "惯",
    "嶄": "崭",
    "慟": "恸",
    "嶇": "岖",
    "慚": "惭",
    "慘": "惨",
    "幣": "币",
    "榮": "荣",
    "幗": "帼",
    "槓": "杠",
    "構": "构",
    "摟": "搂",
    "彆": "别",
    "摺": "折",
    "摑": "掴",
    "徹": "彻",
    "槍": "枪",
    "滯": "滞",
    "漸": "渐",
    "漲": "涨",
    "氳": "氲",
    "漣": "涟",
    "滾": "滚",
    "滬": "沪",
    "漁": "渔",
    "滲": "渗",
    "漬": "渍",
    "滌": "涤",
    "漢": "汉",
    "滿": "满",
    "爾": "尔",
    "犖": "荦",
    "獄": "狱",
    "瑤": "瑶",
    "瑣": "琐",
    "瑪": "玛",
    "瘧": "疟",
    "瘍": "疡",
    "瘋": "疯",
    "瘉": "愈",
    "瘓": "痪",
    "盡": "尽",
    "監": "监",
    "箋": "笺",
    "箏": "筝",
    "碩": "硕",
    "禎": "祯",
    "綻": "绽",
    "禍": "祸",
    "綰": "绾",
    "種": "种",
    "綜": "综",
    "稱": "称",
    "綽": "绰",
    "窪": "洼",
    "綾": "绫",
    "窩": "窝",
    "綠": "绿",
    "緊": "紧",
    "綴": "缀",
    "網": "网",
    "綱": "纲",
    "綺": "绮",
    "綢": "绸",
    "綿": "绵",
    "綵": "彩",
    "綸": "纶",
    "維": "维",
    "緒": "绪",
    "緇": "缁",
    "罰": "罚",
    "聞": "闻",
    "蒐": "搜",
    "蒼": "苍",
    "臺": "台",
    "與": "与",
    "蓆": "席",
    "蝕": "蚀",
    "蒞": "莅",
    "蓋": "盖",
    "製": "制",
    "蓀": "荪",
    "誦": "诵",
    "誌": "志",
    "語": "语",
    "誣": "诬",
    "認": "认",
    "誡": "诫",
    "誤": "误",
    "說": "说",
    "誥": "诰",
    "誨": "诲",
    "誘": "诱",
    "誑": "诳",
    "貍": "狸",
    "賓": "宾",
    "賑": "赈",
    "賒": "赊",
    "鉸": "铰",
    "趙": "赵",
    "銬": "铐",
    "趕": "赶",
    "銀": "银",
    "跼": "局",
    "銅": "铜",
    "輔": "辅",
    "銘": "铭",
    "輒": "辄",
    "銖": "铢",
    "輕": "轻",
    "鉻": "铬",
    "輓": "挽",
    "銓": "铨",
    "銜": "衔",
    "遠": "远",
    "閡": "阂",
    "閨": "闺",
    "遜": "逊",
    "閩": "闽",
    "閣": "阁",
    "遙": "遥",
    "閥": "阀",
    "遞": "递",
    "閤": "合",
    "際": "际",
    "頗": "颇",
    "領": "领",
    "颯": "飒",
    "颱": "台",
    "餃": "饺",
    "餅": "饼",
    "餌": "饵",
    "餉": "饷",
    "駁": "驳",
    "骯": "肮",
    "鳴": "鸣",
    "鳶": "鸢",
    "厲": "厉",
    "鳳": "凤",
    "嘮": "唠",
    "麼": "么",
    "齊": "齐",
    "億": "亿",
    "嘩": "哗",
    "儀": "仪",
    "噓": "嘘",
    "價": "价",
    "噴": "喷",
    "儂": "侬",
    "儈": "侩",
    "嘯": "啸",
    "儉": "俭",
    "嘰": "叽",
    "凜": "凛",
    "劇": "剧",
    "劉": "刘",
    "墳": "坟",
    "劍": "剑",
    "墜": "坠",
    "墮": "堕",
    "嫻": "娴",
    "嬋": "婵",
    "嫵": "妩",
    "嬌": "娇",
    "寬": "宽",
    "審": "审",
    "寫": "写",
    "層": "层",
    "幟": "帜",
    "廢": "废",
    "廚": "厨",
    "廟": "庙",
    "廝": "厮",
    "廣": "广",
    "廠": "厂",
    "彈": "弹",
    "憚": "惮",
    "撫": "抚",
    "憤": "愤",
    "撚": "捻",
    "徵": "征",
    "敵": "敌",
    "慶": "庆",
    "摯": "挚",
    "數": "数",
    "慮": "虑",
    "暫": "暂",
    "撲": "扑",
    "憂": "忧",
    "撈": "捞",
    "樣": "样",
    "慼": "戚",
    "撐": "撑",
    "槨": "椁",
    "慫": "怂",
    "撥": "拨",
    "樁": "桩",
    "慾": "欲",
    "撓": "挠",
    "樞": "枢",
    "標": "标",
    "憐": "怜",
    "憫": "悯",
    "樓": "楼",
    "槳": "桨",
    "樂": "乐",
    "潰": "溃",
    "樅": "枞",
    "潤": "润",
    "瘡": "疮",
    "歐": "欧",
    "澗": "涧",
    "皚": "皑",
    "殤": "殇",
    "皺": "皱",
    "盤": "盘",
    "毆": "殴",
    "漿": "浆",
    "熱": "热",
    "瞇": "眯",
    "潑": "泼",
    "犛": "牦",
    "獎": "奖",
    "潔": "洁",
    "確": "确",
    "澆": "浇",
    "瑩": "莹",
    "潛": "潜",
    "碼": "码",
    "緯": "纬",
    "膚": "肤",
    "緻": "致",
    "緘": "缄",
    "穀": "谷",
    "緬": "缅",
    "緝": "缉",
    "蓮": "莲",
    "編": "编",
    "緣": "缘",
    "蔭": "荫",
    "窯": "窑",
    "線": "缐",
    "窮": "穷",
    "緞": "缎",
    "緩": "缓",
    "蔣": "蒋",
    "綞": "缍",
    "範": "范",
    "罵": "骂",
    "蔔": "卜",
    "罷": "罢",
    "蔥": "葱",
    "締": "缔",
    "練": "练",
    "膠": "胶",
    "蝦": "虾",
    "課": "课",
    "蝸": "蜗",
    "諉": "诿",
    "蝨": "虱",
    "諂": "谄",
    "調": "调",
    "誰": "谁",
    "論": "论",
    "衛": "卫",
    "諍": "诤",
    "衝": "冲",
    "豎": "竖",
    "複": "复",
    "豬": "猪",
    "賠": "赔",
    "賞": "赏",
    "誼": "谊",
    "賦": "赋",
    "諒": "谅",
    "賤": "贱",
    "談": "谈",
    "賬": "账",
    "諄": "谆",
    "賭": "赌",
    "誕": "诞",
    "賢": "贤",
    "請": "请",
    "賣": "卖",
    "諸": "诸",
    "賜": "赐",
    "質": "质",
    "踫": "碰",
    "踐": "践",
    "輝": "辉",
    "輛": "辆",
    "輟": "辍",
    "輩": "辈",
    "輦": "辇",
    "輪": "轮",
    "輜": "辎",
    "適": "适",
    "銳": "锐",
    "銼": "锉",
    "鋒": "锋",
    "閭": "闾",
    "遷": "迁",
    "閱": "阅",
    "鄰": "邻",
    "鄭": "郑",
    "鄧": "邓",
    "醃": "腌",
    "鞏": "巩",
    "鋅": "锌",
    "頡": "颉",
    "銻": "锑",
    "颳": "刮",
    "銷": "销",
    "養": "养",
    "鋪": "铺",
    "餓": "饿",
    "鋤": "锄",
    "餒": "馁",
    "鋁": "铝",
    "餘": "余",
    "駝": "驼",
    "駐": "驻",
    "駟": "驷",
    "駛": "驶",
    "駑": "驽",
    "駕": "驾",
    "駒": "驹",
    "駙": "驸",
    "髮": "发",
    "鬧": "闹",
    "魷": "鱿",
    "魯": "鲁",
    "鴆": "鸩",
    "鴉": "鸦",
    "麩": "麸",
    "齒": "齿",
    "儘": "尽",
    "儔": "俦",
    "儐": "傧",
    "劑": "剂",
    "噹": "当",
    "噸": "吨",
    "憊": "惫",
    "懍": "懔",
    "噥": "哝",
    "憶": "忆",
    "噯": "嗳",
    "戰": "战",
    "墾": "垦",
    "壇": "坛",
    "擁": "拥",
    "擋": "挡",
    "奮": "奋",
    "撻": "挞",
    "嬝": "袅",
    "據": "据",
    "學": "学",
    "擄": "掳",
    "導": "导",
    "擇": "择",
    "憲": "宪",
    "憑": "凭",
    "撿": "捡",
    "機": "机",
    "擔": "担",
    "歷": "历",
    "燙": "烫",
    "曆": "历",
    "燜": "焖",
    "曉": "晓",
    "澱": "淀",
    "燄": "焰",
    "濃": "浓",
    "獨": "独",
    "樸": "朴",
    "澤": "泽",
    "樺": "桦",
    "濁": "浊",
    "璣": "玑",
    "橫": "横",
    "甌": "瓯",
    "樹": "树",
    "熾": "炽",
    "盧": "卢",
    "橢": "椭",
    "燉": "炖",
    "燐": "磷",
    "橋": "桥",
    "燒": "烧",
    "瞞": "瞒",
    "燈": "灯",
    "縑": "缣",
    "磚": "砖",
    "縈": "萦",
    "縛": "缚",
    "禦": "御",
    "縣": "县",
    "積": "积",
    "穎": "颖",
    "穌": "稣",
    "窺": "窥",
    "膩": "腻",
    "簑": "蓑",
    "築": "筑",
    "篤": "笃",
    "興": "兴",
    "篛": "箬",
    "艙": "舱",
    "篩": "筛",
    "縊": "缢",
    "蕩": "荡",
    "蕭": "萧",
    "蕪": "芜",
    "螞": "蚂",
    "螢": "萤",
    "褲": "裤",
    "親": "亲",
    "覦": "觎",
    "諦": "谛",
    "諺": "谚",
    "諫": "谏",
    "諱": "讳",
    "輻": "辐",
    "謀": "谋",
    "輯": "辑",
    "諜": "谍",
    "輸": "输",
    "諧": "谐",
    "諮": "咨",
    "辦": "办",
    "諾": "诺",
    "謁": "谒",
    "謂": "谓",
    "選": "选",
    "諷": "讽",
    "遲": "迟",
    "諭": "谕",
    "遼": "辽",
    "遺": "遗",
    "貓": "猫",
    "賴": "赖",
    "錠": "锭",
    "錶": "表",
    "鋸": "锯",
    "踴": "踊",
    "錳": "锰",
    "錯": "错",
    "錢": "钱",
    "鋼": "钢",
    "錫": "锡",
    "錄": "录",
    "錚": "铮",
    "錐": "锥",
    "錦": "锦",
    "閻": "阎",
    "隨": "随",
    "險": "险",
    "霑": "沾",
    "靜": "静",
    "靦": "腼",
    "頰": "颊",
    "鬨": "哄",
    "頸": "颈",
    "鮑": "鲍",
    "頻": "频",
    "鴕": "鸵",
    "頷": "颔",
    "鴣": "鸪",
    "頭": "头",
    "鴦": "鸯",
    "頹": "颓",
    "鴨": "鸭",
    "頤": "颐",
    "鴒": "鸰",
    "鴛": "鸳",
    "館": "馆",
    "餞": "饯",
    "餛": "馄",
    "龍": "龙",
    "餡": "馅",
    "龜": "龟",
    "駭": "骇",
    "駢": "骈",
    "優": "优",
    "駱": "骆",
    "償": "偿",
    "儲": "储",
    "勵": "励",
    "嚀": "咛",
    "嚐": "尝",
    "嚇": "吓",
    "壓": "压",
    "嬰": "婴",
    "嬪": "嫔",
    "嬤": "嬷",
    "尷": "尴",
    "嶼": "屿",
    "嶺": "岭",
    "嶽": "岳",
    "幫": "帮",
    "彌": "弥",
    "檔": "档",
    "應": "应",
    "懇": "恳",
    "檢": "检",
    "檜": "桧",
    "戲": "戏",
    "櫛": "栉",
    "殮": "殓",
    "濘": "泞",
    "擊": "击",
    "濱": "滨",
    "濟": "济",
    "擠": "挤",
    "擰": "拧",
    "濛": "蒙",
    "濤": "涛",
    "擬": "拟",
    "濫": "滥",
    "擱": "搁",
    "斂": "敛",
    "澀": "涩",
    "斃": "毙",
    "濬": "浚",
    "曖": "暧",
    "營": "营",
    "燦": "灿",
    "燭": "烛",
    "燬": "毁",
    "燴": "烩",
    "牆": "墙",
    "獰": "狞",
    "獲": "获",
    "環": "环",
    "璦": "瑷",
    "癆": "痨",
    "療": "疗",
    "盪": "荡",
    "糞": "粪",
    "矯": "矫",
    "縮": "缩",
    "績": "绩",
    "繆": "缪",
    "縷": "缕",
    "磯": "矶",
    "縲": "缧",
    "繃": "绷",
    "縫": "缝",
    "禪": "禅",
    "總": "总",
    "縱": "纵",
    "繅": "缫",
    "簍": "篓",
    "聲": "声",
    "聰": "聪",
    "聯": "联",
    "聳": "耸",
    "膿": "脓",
    "膽": "胆",
    "臉": "脸",
    "膾": "脍",
    "臨": "临",
    "舉": "举",
    "艱": "艰",
    "薑": "姜",
    "褸": "褛",
    "薔": "蔷",
    "覬": "觊",
    "謎": "谜",
    "謗": "谤",
    "謙": "谦",
    "虧": "亏",
    "講": "讲",
    "謊": "谎",
    "謠": "谣",
    "謝": "谢",
    "謄": "誊",
    "谿": "溪",
    "螻": "蝼",
    "賺": "赚",
    "賽": "赛",
    "蟈": "蝈",
    "購": "购",
    "趨": "趋",
    "褻": "亵",
    "轄": "辖",
    "輾": "辗",
    "轂": "毂",
    "轅": "辕",
    "輿": "舆",
    "還": "还",
    "邁": "迈",
    "醞": "酝",
    "醜": "丑",
    "鍍": "镀",
    "鎂": "镁",
    "雖": "虽",
    "錨": "锚",
    "鍵": "键",
    "鍊": "炼",
    "鍥": "锲",
    "韓": "韩",
    "鍋": "锅",
    "顆": "颗",
    "錘": "锤",
    "颶": "飓",
    "鍾": "钟",
    "餵": "喂",
    "騁": "骋",
    "鍬": "锹",
    "駿": "骏",
    "鍛": "锻",
    "鮮": "鲜",
    "鍰": "锾",
    "鮫": "鲛",
    "闊": "阔",
    "鮪": "鲔",
    "闋": "阕",
    "鴻": "鸿",
    "闌": "阑",
    "鴿": "鸽",
    "闈": "闱",
    "闆": "板",
    "隱": "隐",
    "點": "点",
    "隸": "隶",
    "齋": "斋",
    "叢": "丛",
    "嚕": "噜",
    "嚮": "向",
    "壙": "圹",
    "壘": "垒",
    "嬸": "婶",
    "懣": "懑",
    "擴": "扩",
    "擲": "掷",
    "擾": "扰",
    "攆": "撵",
    "擺": "摆",
    "擻": "擞",
    "燻": "熏",
    "斷": "断",
    "獷": "犷",
    "獵": "猎",
    "檳": "槟",
    "甕": "瓮",
    "櫃": "柜",
    "檻": "槛",
    "癘": "疠",
    "檸": "柠",
    "癒": "愈",
    "櫂": "棹",
    "歟": "欤",
    "歸": "归",
    "殯": "殡",
    "礎": "础",
    "瀉": "泻",
    "禮": "礼",
    "瀋": "沈",
    "穡": "穑",
    "濾": "滤",
    "穢": "秽",
    "瀆": "渎",
    "竄": "窜",
    "濺": "溅",
    "竅": "窍",
    "簫": "箫",
    "瀏": "浏",
    "簞": "箪",
    "簣": "篑",
    "簡": "简",
    "糧": "粮",
    "織": "织",
    "繕": "缮",
    "繞": "绕",
    "繚": "缭",
    "繡": "绣",
    "罈": "坛",
    "翹": "翘",
    "職": "职",
    "聶": "聂",
    "臍": "脐",
    "臏": "膑",
    "舊": "旧",
    "薩": "萨",
    "蹤": "踪",
    "藍": "蓝",
    "軀": "躯",
    "轉": "转",
    "轍": "辙",
    "邇": "迩",
    "蟯": "蛲",
    "醫": "医",
    "蟬": "蝉",
    "醬": "酱",
    "蟲": "虫",
    "釐": "厘",
    "鎔": "镕",
    "覲": "觐",
    "鎊": "镑",
    "觴": "觞",
    "鎖": "锁",
    "謨": "谟",
    "鎢": "钨",
    "謹": "谨",
    "鎳": "镍",
    "謬": "谬",
    "鎮": "镇",
    "豐": "丰",
    "闔": "阖",
    "贅": "赘",
    "闖": "闯",
    "闐": "阗",
    "蹣": "蹒",
    "雜": "杂",
    "雙": "双",
    "雛": "雏",
    "雞": "鸡",
    "鞦": "秋",
    "額": "额",
    "顏": "颜",
    "題": "题",
    "顎": "颚",
    "顓": "颛",
    "颺": "飏",
    "餾": "馏",
    "餿": "馊",
    "餽": "馈",
    "騎": "骑",
    "鬆": "松",
    "鯊": "鲨",
    "懷": "怀",
    "鯉": "鲤",
    "懶": "懒",
    "鯽": "鲫",
    "鵑": "鹃",
    "鵝": "鹅",
    "攏": "拢",
    "鵠": "鹄",
    "曠": "旷",
    "鼕": "冬",
    "櫥": "橱",
    "櫝": "椟",
    "櫚": "榈",
    "嚥": "咽",
    "櫓": "橹",
    "嚨": "咙",
    "壞": "坏",
    "瀟": "潇",
    "壟": "垄",
    "瀨": "濑",
    "壢": "坜",
    "寵": "宠",
    "瀝": "沥",
    "龐": "庞",
    "瀕": "濒",
    "廬": "庐",
    "懲": "惩",
    "爍": "烁",
    "牘": "牍",
    "犢": "犊",
    "獸": "兽",
    "獺": "獭",
    "璽": "玺",
    "瓊": "琼",
    "疇": "畴",
    "矇": "蒙",
    "礙": "碍",
    "禱": "祷",
    "穫": "获",
    "穩": "稳",
    "簾": "帘",
    "簽": "签",
    "簷": "檐",
    "繫": "系",
    "繭": "茧",
    "襠": "裆",
    "繹": "绎",
    "繩": "绳",
    "襖": "袄",
    "繪": "绘",
    "譁": "哗",
    "羅": "罗",
    "譜": "谱",
    "羶": "膻",
    "識": "识",
    "證": "证",
    "譚": "谭",
    "臘": "腊",
    "譎": "谲",
    "譏": "讥",
    "藝": "艺",
    "贈": "赠",
    "藪": "薮",
    "贊": "赞",
    "藥": "药",
    "蟻": "蚁",
    "蠅": "蝇",
    "蠍": "蝎",
    "蹺": "跷",
    "轔": "辚",
    "轎": "轿",
    "辭": "辞",
    "邊": "边",
    "鏡": "镜",
    "鏑": "镝",
    "鏟": "铲",
    "鏃": "镞",
    "鏈": "链",
    "鏜": "镗",
    "鏝": "镘",
    "鏢": "镖",
    "鏍": "镙",
    "鏘": "锵",
    "鏤": "镂",
    "鏗": "铿",
    "關": "关",
    "隴": "陇",
    "離": "离",
    "鵲": "鹊",
    "難": "难",
    "鵪": "鹌",
    "鵬": "鹏",
    "霧": "雾",
    "麗": "丽",
    "韜": "韬",
    "韻": "韵",
    "麴": "麹",
    "類": "类",
    "願": "愿",
    "勸": "劝",
    "顛": "颠",
    "颼": "飕",
    "嚶": "嘤",
    "饅": "馒",
    "嚴": "严",
    "騖": "骛",
    "騙": "骗",
    "鬍": "胡",
    "鯨": "鲸",
    "鯧": "鲳",
    "寶": "宝",
    "鶉": "鹑",
    "懸": "悬",
    "鵡": "鹉",
    "懺": "忏",
    "攔": "拦",
    "攙": "搀",
    "朧": "胧",
    "瀾": "澜",
    "瀰": "弥",
    "爐": "炉",
    "犧": "牺",
    "獻": "献",
    "瓏": "珑",
    "癢": "痒",
    "癥": "症",
    "礦": "矿",
    "礪": "砺",
    "礬": "矾",
    "礫": "砾",
    "竇": "窦",
    "競": "竞",
    "籌": "筹",
    "蘊": "蕴",
    "籃": "篮",
    "蠔": "蚝",
    "襤": "褴",
    "辮": "辫",
    "覺": "觉",
    "繽": "缤",
    "觸": "触",
    "繼": "继",
    "議": "议",
    "臚": "胪",
    "譯": "译",
    "艦": "舰",
    "贏": "赢",
    "贍": "赡",
    "藹": "蔼",
    "躉": "趸",
    "藺": "蔺",
    "蘆": "芦",
    "躂": "跶",
    "蘋": "苹",
    "釋": "释",
    "鏽": "锈",
    "闡": "阐",
    "飄": "飘",
    "饒": "饶",
    "饑": "饥",
    "騫": "骞",
    "騰": "腾",
    "騷": "骚",
    "鰓": "鳃",
    "鰍": "鳅",
    "鹹": "咸",
    "麵": "面",
    "黨": "党",
    "齟": "龃",
    "齣": "出",
    "齡": "龄",
    "蘇": "苏",
    "鐘": "钟",
    "鐃": "铙",
    "儷": "俪",
    "囁": "嗫",
    "續": "续",
    "囀": "啭",
    "囂": "嚣",
    "蘭": "兰",
    "蘚": "藓",
    "屬": "属",
    "蠣": "蛎",
    "懼": "惧",
    "懾": "慑",
    "蠟": "蜡",
    "攝": "摄",
    "襪": "袜",
    "攜": "携",
    "覽": "览",
    "櫻": "樱",
    "譴": "谴",
    "欄": "栏",
    "護": "护",
    "殲": "歼",
    "譽": "誉",
    "贓": "赃",
    "爛": "烂",
    "躊": "踌",
    "癩": "癞",
    "躍": "跃",
    "矓": "眬",
    "轟": "轰",
    "籐": "藤",
    "辯": "辩",
    "纏": "缠",
    "鐮": "镰",
    "鐳": "镭",
    "鐵": "铁",
    "鐺": "铛",
    "鐸": "铎",
    "鐲": "镯",
    "闢": "辟",
    "響": "响",
    "顧": "顾",
    "驅": "驱",
    "驃": "骠",
    "驀": "蓦",
    "騾": "骡",
    "髏": "髅",
    "鰭": "鳍",
    "鰥": "鳏",
    "鶯": "莺",
    "鶴": "鹤",
    "鷂": "鹞",
    "齜": "龇",
    "齦": "龈",
    "儼": "俨",
    "囈": "呓",
    "囉": "啰",
    "孿": "孪",
    "巔": "巅",
    "巒": "峦",
    "彎": "弯",
    "攤": "摊",
    "躑": "踯",
    "權": "权",
    "轡": "辔",
    "歡": "欢",
    "鑄": "铸",
    "灑": "洒",
    "鑑": "鉴",
    "灘": "滩",
    "鑒": "鉴",
    "玀": "猡",
    "霽": "霁",
    "疊": "迭",
    "癮": "瘾",
    "韃": "鞑",
    "癬": "癣",
    "韁": "缰",
    "籠": "笼",
    "顫": "颤",
    "籟": "籁",
    "驕": "骄",
    "聾": "聋",
    "鬚": "须",
    "聽": "听",
    "鱉": "鳖",
    "臟": "脏",
    "鰱": "鲢",
    "襲": "袭",
    "鰾": "鳔",
    "襯": "衬",
    "鰻": "鳗",
    "讀": "读",
    "鷓": "鹧",
    "贖": "赎",
    "鷗": "鸥",
    "贗": "赝",
    "鼴": "鼹",
    "齬": "龉",
    "齪": "龊",
    "龔": "龚",
    "囌": "苏",
    "巖": "岩",
    "戀": "恋",
    "攣": "挛",
    "攪": "搅",
    "竊": "窃",
    "籤": "签",
    "纓": "缨",
    "纖": "纤",
    "蘿": "萝",
    "蠱": "蛊",
    "變": "变",
    "邐": "逦",
    "鑣": "镳",
    "鑠": "铄",
    "靨": "靥",
    "顯": "显",
    "饜": "餍",
    "驚": "惊",
    "驛": "驿",
    "驗": "验",
    "髒": "脏",
    "體": "体",
    "鱔": "鳝",
    "鱗": "鳞",
    "鱖": "鳜",
    "鷥": "鸶",
    "黴": "霉",
    "囑": "嘱",
    "壩": "坝",
    "攬": "揽",
    "癱": "瘫",
    "癲": "癫",
    "羈": "羁",
    "蠶": "蚕",
    "讓": "让",
    "讒": "谗",
    "讖": "谶",
    "贛": "赣",
    "釀": "酿",
    "靂": "雳",
    "靈": "灵",
    "靄": "霭",
    "鱷": "鳄",
    "鱸": "鲈",
    "黷": "黩",
    "豔": "艳",
    "鑿": "凿",
    "鸚": "鹦",
    "驪": "骊",
    "鬱": "郁",
    "鸞": "鸾",
    "籲": "吁",
    "顰": "颦",
    "驟": "骤",
    "鬢": "鬓",
    "魘": "魇",
    "鷹": "鹰",
    "鷺": "鹭",
    "鹼": "碱",
    "鹽": "盐",
    "鼇": "鳌",
    "齷": "龌",
    "齲": "龋",
    "廳": "厅",
    "欖": "榄",
    "灣": "湾",
    "籬": "篱",
    "籮": "箩",
    "蠻": "蛮",
    "躡": "蹑",
    "釁": "衅",
    "鑲": "镶",
    "鑰": "钥",
    "顱": "颅",
    "饞": "馋",
    "灤": "滦",
    "矚": "瞩",
    "讚": "赞",
    "驢": "驴",
    "驥": "骥",
    "纜": "缆",
    "躪": "躏",
    "鑽": "钻",
    "鑾": "銮",
    "鑼": "锣",
    "垵": "埯",
    "銨": "铵",
    "諳": "谙",
    "錒": "锕",
    "驁": "骜",
    "嬡": "嫒",
    "靉": "叆",
    "翺": "翱",
    "鰲": "鳌",
    "嶴": "岙",
    "埯": "垵",
    "鎄": "锿",
    "佈": "布",
    "竝": "并",
    "綳": "绷",
    "襬": "摆",
    "癟": "瘪",
    "唄": "呗",
    "蓽": "荜",
    "嗶": "哔",
    "鈈": "钚",
    "鋇": "钡",
    "鈑": "钣",
    "鈀": "钯",
    "鴇": "鸨",
    "颮": "飑",
    "鉢": "钵",
    "鉍": "铋",
    "餑": "饽",
    "籩": "笾",
    "鵓": "鹁",
    "篳": "筚",
    "擯": "摈",
    "齙": "龅",
    "蹕": "跸",
    "錛": "锛",
    "鮁": "鲅",
    "潷": "滗",
    "鑌": "镔",
    "飆": "飙",
    "鏰": "镚",
    "鯿": "鳊",
    "韝": "鞴",
    "髕": "髌",
    "詖": "诐",
    "驫": "骉",
    "襏": "袯",
    "贔": "赑",
    "鵯": "鹎",
    "鮊": "鲌",
    "鎛": "镈",
    "鰏": "鲾",
    "纔": "才",
    "喫": "吃",
    "産": "产",
    "牀": "床",
    "厠": "厕",
    "摻": "掺",
    "酧": "酬",
    "癡": "痴",
    "澂": "澄",
    "萇": "苌",
    "蓯": "苁",
    "棖": "枨",
    "儕": "侪",
    "檉": "柽",
    "硨": "砗",
    "蠆": "虿",
    "覘": "觇",
    "蒓": "莼",
    "齔": "龀",
    "鴟": "鸱",
    "蟶": "蛏",
    "銃": "铳",
    "閶": "阊",
    "諶": "谌",
    "驂": "骖",
    "箠": "棰",
    "餷": "馇",
    "磣": "碜",
    "輳": "辏",
    "鍤": "锸",
    "鷀": "鹚",
    "驄": "骢",
    "攛": "撺",
    "驏": "骣",
    "鑹": "镩",
    "讎": "雠",
    "躕": "蹰",
    "躥": "蹿",
    "鑔": "镲",
    "黲": "黪",
    "鑱": "镵",
    "瑒": "玚",
    "剗": "刬",
    "鶬": "鸧",
    "滻": "浐",
    "幬": "帱",
    "檮": "梼",
    "鋮": "铖",
    "蕆": "蒇",
    "赬": "赪",
    "櫬": "榇",
    "縗": "缞",
    "鹺": "鹾",
    "鱨": "鲿",
    "酇": "酂",
    "囅": "冁",
    "觝": "抵",
    "隄": "堤",
    "曡": "叠",
    "耑": "端",
    "氹": "凼",
    "碭": "砀",
    "糴": "籴",
    "壋": "垱",
    "腖": "胨",
    "懟": "怼",
    "璫": "珰",
    "鶇": "鸫",
    "鈿": "钿",
    "鄲": "郸",
    "燾": "焘",
    "撣": "掸",
    "啗": "啖",
    "銚": "铫",
    "闍": "阇",
    "殫": "殚",
    "賧": "赕",
    "讜": "谠",
    "鍀": "锝",
    "煆": "煅",
    "鯛": "鲷",
    "鐓": "镦",
    "鐙": "镫",
    "籪": "簖",
    "鰈": "鲽",
    "軑": "轪",
    "崬": "岽",
    "飿": "饳",
    "紿": "绐",
    "墶": "垯",
    "薘": "荙",
    "噠": "哒",
    "鈄": "钭",
    "絰": "绖",
    "魛": "鱽",
    "窵": "窎",
    "銱": "铞",
    "銩": "铥",
    "覿": "觌",
    "簹": "筜",
    "癉": "瘅",
    "靆": "叇",
    "嚲": "亸",
    "鰐": "鳄",
    "鴯": "鸸",
    "鉺": "铒",
    "閼": "阏",
    "諤": "谔",
    "鋨": "锇",
    "齶": "腭",
    "鶚": "鹗",
    "鍔": "锷",
    "鮞": "鲕",
    "汎": "泛",
    "頫": "俯",
    "誹": "诽",
    "繙": "翻",
    "鳬": "凫",
    "嘸": "呒",
    "灃": "沣",
    "渢": "沨",
    "釩": "钒",
    "紱": "绂",
    "碸": "砜",
    "鈁": "钫",
    "僨": "偾",
    "緋": "绯",
    "魴": "鲂",
    "鮒": "鲋",
    "賻": "赙",
    "襆": "幞",
    "鯡": "鲱",
    "鱝": "鲼",
    "韍": "韨",
    "賵": "赗",
    "鐨": "镄",
    "豶": "豮",
    "觀": "观",
    "崗": "岗",
    "榖": "谷",
    "柺": "拐",
    "鈎": "钩",
    "矽": "硅",
    "琯": "管",
    "鎬": "镐",
    "嬀": "妫",
    "匭": "匦",
    "劌": "刿",
    "劊": "刽",
    "詿": "诖",
    "紺": "绀",
    "軲": "轱",
    "剮": "剐",
    "餎": "饹",
    "堝": "埚",
    "臯": "皋",
    "綆": "绠",
    "摜": "掼",
    "鴰": "鸹",
    "餜": "馃",
    "緄": "绲",
    "輥": "辊",
    "鋯": "锆",
    "賡": "赓",
    "緱": "缑",
    "錮": "锢",
    "縞": "缟",
    "覯": "觏",
    "鶻": "鹘",
    "鮭": "鲑",
    "鎘": "镉",
    "鯁": "鲠",
    "鯀": "鲧",
    "鯝": "鲴",
    "鸛": "鹳",
    "戇": "戆",
    "釓": "钆",
    "嗊": "唝",
    "膕": "腘",
    "餶": "馉",
    "鶊": "鹒",
    "鬹": "鬶",
    "鱤": "鳡",
    "釬": "焊",
    "銲": "焊",
    "閎": "闳",
    "訶": "诃",
    "諢": "诨",
    "頇": "顸",
    "薈": "荟",
    "噅": "咴",
    "餄": "饸",
    "滸": "浒",
    "驊": "骅",
    "絎": "绗",
    "頏": "颃",
    "鏵": "铧",
    "鉿": "铪",
    "鴴": "鸻",
    "閽": "阍",
    "頜": "颌",
    "翬": "翚",
    "鱟": "鲎",
    "鶘": "鹕",
    "鯇": "鲩",
    "繯": "缳",
    "鰉": "鳇",
    "顥": "颢",
    "鑊": "镬",
    "灝": "灏",
    "沍": "冱",
    "紘": "纮",
    "葒": "荭",
    "軤": "轷",
    "鈥": "钬",
    "褘": "袆",
    "齕": "龁",
    "嫿": "婳",
    "翽": "翙",
    "鍃": "锪",
    "鶡": "鹖",
    "鍠": "锽",
    "鮜": "鲘",
    "餱": "糇",
    "黌": "黉",
    "鐶": "镮",
    "鸌": "鹱",
    "彠": "彟",
    "鱯": "鳠",
    "侷": "局",
    "鷄": "鸡",
    "薦": "荐",
    "奬": "奖",
    "絶": "绝",
    "堿": "碱",
    "繮": "缰",
    "繳": "缴",
    "詎": "讵",
    "癤": "疖",
    "剄": "刭",
    "梘": "枧",
    "郟": "郏",
    "蟣": "虮",
    "薺": "荠",
    "藎": "荩",
    "嶠": "峤",
    "脛": "胫",
    "浹": "浃",
    "濜": "浕",
    "絳": "绛",
    "筧": "笕",
    "鬮": "阄",
    "燼": "烬",
    "廄": "厩",
    "鋏": "铗",
    "皸": "皲",
    "靚": "靓",
    "賫": "赍",
    "瞼": "睑",
    "蛺": "蛱",
    "鐧": "锏",
    "鋦": "锔",
    "熲": "颎",
    "襇": "裥",
    "薊": "蓟",
    "櫸": "榉",
    "躋": "跻",
    "錈": "锩",
    "縉": "缙",
    "戩": "戬",
    "鱭": "鲚",
    "饉": "馑",
    "鎸": "镌",
    "鎵": "镓",
    "鰹": "鲣",
    "齏": "齑",
    "屨": "屦",
    "鐝": "镢",
    "鷦": "鹪",
    "鷲": "鹫",
    "韉": "鞯",
    "戔": "戋",
    "垧": "坰",
    "巹": "卺",
    "鉅": "钜",
    "贐": "赆",
    "棬": "桊",
    "璡": "琎",
    "魢": "鱾",
    "謭": "谫",
    "檟": "槚",
    "鮚": "鲒",
    "窶": "窭",
    "鮶": "鲪",
    "鶺": "鹡",
    "鶼": "鹣",
    "籛": "篯",
    "鱂": "鳉",
    "鰜": "鳒",
    "摳": "抠",
    "殻": "壳",
    "崐": "昆",
    "饋": "馈",
    "鄺": "邝",
    "哢": "咔",
    "巋": "岿",
    "誆": "诓",
    "瞘": "眍",
    "噲": "哙",
    "貺": "贶",
    "獪": "狯",
    "闓": "闿",
    "澮": "浍",
    "愷": "恺",
    "絝": "绔",
    "閫": "阃",
    "鎧": "铠",
    "龕": "龛",
    "騍": "骒",
    "頦": "颏",
    "憒": "愦",
    "嚳": "喾",
    "緙": "缂",
    "錁": "锞",
    "錕": "锟",
    "鍇": "锴",
    "闞": "阚",
    "聵": "聩",
    "鯤": "鲲",
    "髖": "髋",
    "纊": "纩",
    "閌": "闶",
    "鄶": "郐",
    "塏": "垲",
    "鈧": "钪",
    "硜": "硁",
    "壼": "壸",
    "褌": "裈",
    "蕢": "蒉",
    "鐦": "锎",
    "騤": "骙",
    "鵾": "鹍",
    "鱠": "鲙",
    "滷": "卤",
    "鹵": "卤",
    "裏": "里",
    "録": "录",
    "覧": "览",
    "畱": "留",
    "淩": "凌",
    "澇": "涝",
    "纍": "累",
    "邏": "逻",
    "緑": "绿",
    "霤": "溜",
    "灕": "漓",
    "藶": "苈",
    "嚦": "呖",
    "圇": "囵",
    "釕": "钌",
    "壚": "垆",
    "蘢": "茏",
    "櫪": "枥",
    "瀧": "泷",
    "瀘": "泸",
    "濼": "泺",
    "誄": "诔",
    "櫳": "栊",
    "櫨": "栌",
    "櫟": "栎",
    "酈": "郦",
    "轤": "轳",
    "孌": "娈",
    "癧": "疬",
    "涖": "莅",
    "礱": "砻",
    "輅": "辂",
    "鸕": "鸬",
    "嶗": "崂",
    "崍": "崃",
    "徠": "徕",
    "欒": "栾",
    "閬": "阆",
    "淶": "涞",
    "璉": "琏",
    "槤": "梿",
    "欞": "棂",
    "賚": "赉",
    "銠": "铑",
    "僂": "偻",
    "艫": "舻",
    "糲": "粝",
    "淥": "渌",
    "綹": "绺",
    "蔞": "蒌",
    "欏": "椤",
    "鸝": "鹂",
    "躒": "跞",
    "嶁": "嵝",
    "錸": "铼",
    "鋰": "锂",
    "鋃": "锒",
    "臠": "脔",
    "褳": "裢",
    "耮": "耢",
    "蘺": "蓠",
    "騮": "骝",
    "縭": "缡",
    "籙": "箓",
    "瘻": "瘘",
    "瀲": "潋",
    "讕": "谰",
    "耬": "耧",
    "擼": "撸",
    "轆": "辘",
    "鎦": "镏",
    "鱺": "鲡",
    "鏐": "镠",
    "氌": "氇",
    "魎": "魉",
    "鯪": "鲮",
    "廩": "廪",
    "斕": "斓",
    "檁": "檩",
    "鷯": "鹩",
    "鐐": "镣",
    "鑭": "镧",
    "鰳": "鳓",
    "鑞": "镴",
    "鱧": "鳢",
    "轢": "轹",
    "曨": "昽",
    "倈": "俫",
    "咔": "哢",
    "棶": "梾",
    "穭": "稆",
    "腡": "脶",
    "輬": "辌",
    "鐒": "铹",
    "鋝": "锊",
    "鋶": "锍",
    "漊": "溇",
    "襝": "裣",
    "蘞": "蔹",
    "飀": "飗",
    "鶹": "鹠",
    "瀂": "澛",
    "鷚": "鹨",
    "鑥": "镥",
    "襴": "襕",
    "麽": "么",
    "駡": "骂",
    "祕": "秘",
    "懞": "蒙",
    "饃": "馍",
    "衊": "蔑",
    "勱": "劢",
    "獁": "犸",
    "黽": "黾",
    "氂": "牦",
    "瑉": "珉",
    "蕒": "荬",
    "禰": "祢",
    "嘜": "唛",
    "鉬": "钼",
    "鉚": "铆",
    "獼": "猕",
    "澠": "渑",
    "冪": "幂",
    "謐": "谧",
    "緲": "缈",
    "緡": "缗",
    "鶓": "鹋",
    "謾": "谩",
    "鶥": "鹛",
    "縵": "缦",
    "顢": "颟",
    "蟎": "螨",
    "榪": "杩",
    "禡": "祃",
    "鍆": "钔",
    "愍": "湣",
    "湣": "愍",
    "鎇": "镅",
    "鏌": "镆",
    "鸏": "鹲",
    "鰵": "鳘",
    "廼": "乃",
    "嬭": "奶",
    "煖": "暖",
    "蔦": "茑",
    "釹": "钕",
    "鈮": "铌",
    "嚙": "啮",
    "穠": "秾",
    "儺": "傩",
    "鮎": "鲇",
    "鑷": "镊",
    "顳": "颞",
    "鯢": "鲵",
    "饢": "馕",
    "堖": "垴",
    "隉": "陧",
    "聹": "聍",
    "鍩": "锘",
    "鎿": "镎",
    "謳": "讴",
    "漚": "沤",
    "慪": "怄",
    "砲": "炮",
    "丬": "爿",
    "釙": "钋",
    "麅": "狍",
    "鈹": "铍",
    "諞": "谝",
    "鮃": "鲆",
    "羆": "罴",
    "縹": "缥",
    "鉕": "钷",
    "醱": "酦",
    "錇": "锫",
    "鮍": "鲏",
    "鏷": "镤",
    "鐠": "镨",
    "鰟": "鳑",
    "韆": "千",
    "麯": "曲",
    "啓": "启",
    "朞": "期",
    "墻": "墙",
    "旂": "旗",
    "扡": "扦",
    "虯": "虬",
    "唚": "吣",
    "僉": "佥",
    "檾": "苘",
    "煢": "茕",
    "釺": "钎",
    "郤": "郄",
    "戧": "戗",
    "熗": "炝",
    "蕎": "荞",
    "蕁": "荨",
    "誚": "诮",
    "榿": "桤",
    "頎": "颀",
    "鴝": "鸲",
    "慳": "悭",
    "駸": "骎",
    "慤": "悫",
    "磽": "硗",
    "蹌": "跄",
    "賕": "赇",
    "羥": "羟",
    "騏": "骐",
    "綣": "绻",
    "撳": "揿",
    "槧": "椠",
    "蠐": "蛴",
    "潟": "舄",
    "闃": "阒",
    "巰": "巯",
    "磧": "碛",
    "錡": "锜",
    "鵮": "鹐",
    "闕": "阙",
    "踡": "蜷",
    "篋": "箧",
    "譙": "谯",
    "嬙": "嫱",
    "鞽": "鞒",
    "蘄": "蕲",
    "檣": "樯",
    "覷": "觑",
    "繾": "缱",
    "繰": "缲",
    "鏹": "镪",
    "繈": "襁",
    "繦": "襁",
    "顴": "颧",
    "臒": "癯",
    "俔": "伣",
    "詘": "诎",
    "瑲": "玱",
    "膁": "肷",
    "輇": "辁",
    "礄": "硚",
    "廎": "庼",
    "桊": "棬",
    "嶔": "嵚",
    "鋟": "锓",
    "錆": "锖",
    "鶖": "鹙",
    "鯖": "鲭",
    "鯕": "鲯",
    "鰁": "鳈",
    "鋭": "锐",
    "紝": "纴",
    "嬈": "娆",
    "橈": "桡",
    "銣": "铷",
    "嶸": "嵘",
    "縟": "缛",
    "蠑": "蝾",
    "訒": "讱",
    "馹": "驲",
    "蕘": "荛",
    "顬": "颥",
    "陞": "升",
    "竪": "竖",
    "説": "说",
    "曬": "晒",
    "賸": "剩",
    "濕": "湿",
    "泝": "溯",
    "痠": "酸",
    "厙": "厍",
    "畲": "佘",
    "紓": "纾",
    "噝": "咝",
    "詵": "诜",
    "坰": "垧",
    "貰": "贳",
    "猻": "狲",
    "塒": "埘",
    "蒔": "莳",
    "嗩": "唢",
    "鈰": "铈",
    "諗": "谂",
    "誶": "谇",
    "鎩": "铩",
    "銫": "铯",
    "緔": "绱",
    "綬": "绶",
    "螄": "蛳",
    "謖": "谡",
    "謚": "谥",
    "緦": "缌",
    "攄": "摅",
    "瘮": "瘆",
    "騸": "骟",
    "鍶": "锶",
    "糝": "糁",
    "鰣": "鲥",
    "饊": "馓",
    "顙": "颡",
    "釤": "钐",
    "鳲": "鸤",
    "溮": "浉",
    "驌": "骕",
    "毿": "毵",
    "颸": "飔",
    "灄": "滠",
    "鷫": "鹔",
    "釃": "酾",
    "鎪": "锼",
    "鯴": "鲺",
    "鰺": "鲹",
    "鯵": "鲹",
    "驦": "骦",
    "鸘": "鹴",
    "檯": "台",
    "糰": "团",
    "罎": "坛",
    "擡": "抬",
    "鐡": "铁",
    "偸": "偷",
    "媮": "偷",
    "頽": "颓",
    "摶": "抟",
    "曇": "昙",
    "遝": "沓",
    "釷": "钍",
    "駘": "骀",
    "鈦": "钛",
    "闥": "闼",
    "烴": "烃",
    "鉭": "钽",
    "鉈": "铊",
    "縧": "绦",
    "綈": "绨",
    "覜": "眺",
    "鋌": "铤",
    "糶": "粜",
    "儻": "傥",
    "魨": "鲀",
    "鵜": "鹈",
    "緹": "缇",
    "鮐": "鲐",
    "鯷": "鳀",
    "鰨": "鳎",
    "鼉": "鼍",
    "蘀": "萚",
    "嘽": "啴",
    "鐋": "铴",
    "綯": "绹",
    "鋱": "铽",
    "頲": "颋",
    "齠": "龆",
    "錟": "锬",
    "闒": "阘",
    "籜": "箨",
    "鮦": "鲖",
    "钂": "镋",
    "鰷": "鲦",
    "鞉": "鼗",
    "鞀": "鼗",
    "爲": "为",
    "僞": "伪",
    "蝟": "猬",
    "鄔": "邬",
    "紈": "纨",
    "幃": "帏",
    "廡": "庑",
    "潙": "沩",
    "憮": "怃",
    "瑋": "玮",
    "煒": "炜",
    "潿": "涠",
    "媧": "娲",
    "壪": "塆",
    "輞": "辋",
    "鋙": "铻",
    "韙": "韪",
    "濰": "潍",
    "鶩": "鹜",
    "咼": "呙",
    "磑": "硙",
    "閿": "阌",
    "鵐": "鹀",
    "輼": "辒",
    "膃": "腽",
    "鶲": "鹟",
    "鰛": "鳁",
    "鰃": "鳂",
    "縴": "纤",
    "訢": "欣",
    "綫": "线",
    "脩": "修",
    "賉": "恤",
    "傚": "效",
    "綉": "绣",
    "鏇": "旋",
    "銹": "锈",
    "薰": "熏",
    "薌": "芗",
    "餳": "饧",
    "莧": "苋",
    "峴": "岘",
    "餼": "饩",
    "陘": "陉",
    "詡": "诩",
    "紲": "绁",
    "撏": "挦",
    "滎": "荥",
    "嘵": "哓",
    "郄": "郤",
    "秈": "籼",
    "潯": "浔",
    "驍": "骁",
    "塤": "埙",
    "鴞": "鸮",
    "蜆": "蚬",
    "鉉": "铉",
    "獫": "猃",
    "綃": "绡",
    "覡": "觋",
    "硤": "硖",
    "銑": "铣",
    "鬩": "阋",
    "謔": "谑",
    "諼": "谖",
    "嬃": "媭",
    "癇": "痫",
    "鷴": "鹇",
    "漵": "溆",
    "緗": "缃",
    "饗": "飨",
    "醯": "酰",
    "躚": "跹",
    "鍁": "锨",
    "饈": "馐",
    "鱘": "鲟",
    "鮝": "鲞",
    "璿": "璇",
    "擷": "撷",
    "舄": "潟",
    "纈": "缬",
    "鐔": "镡",
    "酰": "醯",
    "鱈": "鳕",
    "驤": "骧",
    "訩": "讻",
    "詗": "诇",
    "屓": "屃",
    "獮": "狝",
    "嶨": "峃",
    "鈃": "钘",
    "餏": "饻",
    "薟": "莶",
    "嶮": "崄",
    "綌": "绤",
    "騂": "骍",
    "鉶": "铏",
    "鵂": "鸺",
    "諝": "谞",
    "斆": "敩",
    "镟": "碹",
    "蠨": "蟏",
    "鰼": "鳛",
    "於": "于",
    "祐": "佑",
    "鬰": "郁",
    "喦": "岩",
    "熒": "荧",
    "艷": "艳",
    "閲": "阅",
    "醖": "酝",
    "婬": "淫",
    "窰": "窑",
    "謡": "谣",
    "縯": "演",
    "藴": "蕴",
    "顔": "颜",
    "燿": "耀",
    "釔": "钇",
    "傴": "伛",
    "紆": "纡",
    "璵": "玙",
    "蕓": "芸",
    "鄴": "邺",
    "暘": "旸",
    "飫": "饫",
    "詒": "诒",
    "塋": "茔",
    "嶧": "峄",
    "懌": "怿",
    "鄆": "郓",
    "禕": "祎",
    "埡": "垭",
    "噦": "哕",
    "鄖": "郧",
    "嶢": "峣",
    "俁": "俣",
    "懨": "恹",
    "惲": "恽",
    "婭": "娅",
    "蓧": "莜",
    "蕕": "莸",
    "鈺": "钰",
    "鉞": "钺",
    "氬": "氩",
    "癰": "痈",
    "誾": "訚",
    "燁": "烨",
    "諛": "谀",
    "殞": "殒",
    "銦": "铟",
    "銥": "铱",
    "閾": "阈",
    "閹": "阉",
    "黿": "鼋",
    "崳": "嵛",
    "鵒": "鹆",
    "潁": "颍",
    "韞": "韫",
    "鎣": "蓥",
    "灧": "滟",
    "瀅": "滢",
    "澦": "滪",
    "攖": "撄",
    "鄘": "墉",
    "釅": "酽",
    "罌": "罂",
    "瓔": "璎",
    "顒": "颙",
    "鎰": "镒",
    "讞": "谳",
    "櫞": "橼",
    "贋": "赝",
    "鏞": "镛",
    "贇": "赟",
    "癭": "瘿",
    "鷸": "鹬",
    "鰩": "鳐",
    "彞": "彝",
    "鱅": "鳙",
    "閆": "闫",
    "覎": "觃",
    "鍚": "钖",
    "軺": "轺",
    "艤": "舣",
    "駰": "骃",
    "椏": "桠",
    "曄": "晔",
    "溳": "涢",
    "勩": "勚",
    "厴": "厣",
    "銪": "铕",
    "鋣": "铘",
    "齗": "龂",
    "濚": "溁",
    "緼": "缊",
    "蕷": "蓣",
    "鍈": "锳",
    "篔": "筼",
    "鮋": "鲉",
    "饁": "馌",
    "墉": "鄘",
    "瘞": "瘗",
    "瀠": "潆",
    "鷊": "鹝",
    "憖": "慭",
    "鯒": "鲬",
    "鷁": "鹢",
    "黶": "黡",
    "鐿": "镱",
    "紥": "扎",
    "衆": "众",
    "竈": "灶",
    "喒": "咱",
    "氈": "毡",
    "玆": "兹",
    "凖": "准",
    "炤": "照",
    "劄": "札",
    "謅": "诌",
    "縐": "绉",
    "撾": "挝",
    "葤": "荮",
    "軫": "轸",
    "贄": "贽",
    "唕": "唣",
    "鉦": "钲",
    "諏": "诹",
    "諑": "诼",
    "鷙": "鸷",
    "眥": "眦",
    "幘": "帻",
    "鍘": "铡",
    "騅": "骓",
    "摣": "揸",
    "蟄": "蛰",
    "蹠": "跖",
    "鋥": "锃",
    "騭": "骘",
    "縋": "缒",
    "鍺": "锗",
    "錙": "锱",
    "謫": "谪",
    "縝": "缜",
    "櫧": "槠",
    "簀": "箦",
    "瀦": "潴",
    "譖": "谮",
    "賾": "赜",
    "躓": "踬",
    "觶": "觯",
    "饌": "馔",
    "譫": "谵",
    "繒": "缯",
    "鏨": "錾",
    "鯔": "鲻",
    "攢": "攒",
    "纘": "缵",
    "瓚": "瓒",
    "臢": "臜",
    "鱒": "鳟",
    "趲": "趱",
    "躦": "躜",
    "咤": "吒",
    "紵": "纻",
    "紖": "纼",
    "苎": "苧",
    "駔": "驵",
    "騶": "驺",
    "軹": "轵",
    "颭": "飐",
    "湞": "浈",
    "輈": "辀",
    "銍": "铚",
    "鵃": "鸼",
    "縶": "絷",
    "讋": "詟",
    "賙": "赒",
    "鑕": "锧",
    "鮓": "鲊",
    "鎡": "镃",
    "札": "劄",
    "鰂": "鲗",
    "鮺": "鲝",
    "櫫": "橥",
    "鯫": "鲰",
    "鸇": "鹯",
    "鱣": "鳣",
    "齄": "齇"
  };
  const needReplaceCharacters = /* @__PURE__ */ new Set([
    ...Object.keys(kanji2hanzi),
    ...Object.keys(jiuziti2xinziti),
    ...Object.values(jiuziti2xinziti),
    ...Object.keys(tc2sc)
  ]);
  function toSimplifiedChinese(str) {
    function mapChar(c2) {
      if (!needReplaceCharacters.has(c2)) return c2;
      if (tc2sc[c2]) return tc2sc[c2];
      if (kanji2hanzi[c2]) return kanji2hanzi[c2];
      c2 = jiuziti2xinziti[c2] || c2;
      if (kanji2hanzi[c2]) return kanji2hanzi[c2];
      return c2;
    }
    return str.split("").map((c2) => mapChar(c2)).join("");
  }
  function _allPrefixs(allIncludedVideos) {
    const videosMaped = allIncludedVideos.map((v2) => {
      return {
        id: v2.id,
        prefix: v2.id.split("-")[0].toUpperCase()
      };
    });
    const grouped = lodash.groupBy(videosMaped, (item2) => item2.prefix);
    const list = Object.entries(grouped).map(([prefix2, arr]) => ({
      name: prefix2,
      value: prefix2,
      count: arr.length
    }));
    return list.orderBy(["count", (item2) => item2.name.toLowerCase()], ["desc", zhStringComparer]);
  }
  function filterByPrefix(videos, selectedPrefix) {
    if (!selectedPrefix) return videos;
    return videos.filter((v2) => v2.id.toUpperCase().startsWith(selectedPrefix + "-"));
  }
  function filterBySearchText(videos, searchText) {
    if (!searchText) return videos;
    const searchTextSc = toSimplifiedChinese(searchText);
    const searchTextList = [searchText, searchTextSc].uniq().map((x2) => x2.toLowerCase());
    return videos.filter((it) => {
      const itemMatchesText = (text) => {
        var _a;
        return it.id.toLowerCase().includes(text) || it.name.toLowerCase().includes(text) || ((_a = it.detailInfo) == null ? void 0 : _a.tags.some((t2) => t2.name.toLowerCase().includes(text)));
      };
      return searchTextList.some((text) => itemMatchesText(text));
    });
  }
  function filterByScope({
    videos,
    selectedStudio,
    selectedLabel,
    selectedSeries,
    selectedDirector,
    selectedStar,
    selectedPrefix,
    searchText,
    enableFilterByStarCount,
    selecedStarCount
  }) {
    videos = [...videos];
    if (selectedStudio) {
      videos = videos.filter((v2) => {
        var _a, _b;
        return ((_b = (_a = v2.detailInfo) == null ? void 0 : _a.studio) == null ? void 0 : _b.url) === selectedStudio;
      });
    }
    if (selectedLabel) {
      videos = videos.filter((v2) => {
        var _a, _b;
        return ((_b = (_a = v2.detailInfo) == null ? void 0 : _a.label) == null ? void 0 : _b.url) === selectedLabel;
      });
    }
    if (selectedSeries) {
      videos = videos.filter((v2) => {
        var _a, _b;
        return ((_b = (_a = v2.detailInfo) == null ? void 0 : _a.series) == null ? void 0 : _b.url) === selectedSeries;
      });
    }
    if (selectedDirector) {
      videos = videos.filter((v2) => {
        var _a, _b;
        return ((_b = (_a = v2.detailInfo) == null ? void 0 : _a.director) == null ? void 0 : _b.url) === selectedDirector;
      });
    }
    if (selectedStar) {
      videos = videos.filter((v2) => {
        var _a;
        return (((_a = v2.detailInfo) == null ? void 0 : _a.stars) || []).map((s2) => s2.url).includes(selectedStar);
      });
    }
    if (selectedPrefix) {
      videos = filterByPrefix(videos, selectedPrefix || "");
    }
    if (searchText) {
      videos = filterBySearchText(videos, searchText);
    }
    if (enableFilterByStarCount && selecedStarCount) {
      let [min2, max2] = selecedStarCount;
      videos = videos.filter((v2) => {
        var _a;
        const count = ((_a = v2.detailInfo) == null ? void 0 : _a.stars.length) || 1;
        return count >= min2 && count <= max2;
      });
    }
    return videos;
  }
  const _videosAfterFilterByScope = memoizeOne(
    filterByScope,
    (...[args1, args2]) => {
      const [_args1, _args2] = [args1, args2].map((args) => {
        return {
          ...args[0],
          videos: args[0].videos._map("id")
        };
      });
      return lodash.isEqual(_args1, _args2);
    }
  );
  function getTrimedPath(path = location.pathname) {
    if (path.startsWith("/en/") || path.startsWith("/ja/") || path.startsWith("/ko/")) {
      path = path.slice(3);
    }
    if (path.startsWith("/uncensored")) {
      path = path.slice("/uncensored".length);
    }
    path || (path = "/");
    return path;
  }
  function trimPagenumFromUrl(url) {
    const u2 = new URL(url);
    const trimedPath = getTrimedPath(u2.pathname).slice(1);
    const parts = trimedPath.split("/");
    if (parts.length === 3 && /^\d+$/.test(parts.at(-1))) {
      const _u = new URL(u2);
      const parts2 = _u.pathname.split("/");
      parts2.pop();
      _u.pathname = parts2.join("/");
      return _u.href;
    }
    return url;
  }
  const getTagId = lodash.memoize(function getTagId2(url) {
    const u2 = new URL(url);
    const parts = getTrimedPath(u2.pathname).split("/");
    const id2 = parts.at(-1);
    return [url.includes("uncensored") ? "uncensored" : "", id2].filter(Boolean).join("-");
  });
  const trimHash = lodash.memoize((url) => {
    return url.replace(/#.*$/, "");
  });
  var UNIHANS = ["阿", "哎", "安", "肮", "凹", "八", "挀", "扳", "邦", "勹", "陂", "奔", "伻", "屄", "边", "灬", "憋", "汃", "冫", "癶", "峬", "嚓", "偲", "参", "仓", "撡", "冊", "嵾", "曽", "叉", "芆", "辿", "伥", "抄", "车", "抻", "阷", "吃", "充", "抽", "出", "欻", "揣", "巛", "刅", "吹", "旾", "逴", "呲", "匆", "凑", "粗", "汆", "崔", "邨", "搓", "咑", "呆", "丹", "当", "刀", "嘚", "扥", "灯", "氐", "甸", "刁", "爹", "丁", "丟", "东", "吺", "厾", "耑", "垖", "吨", "多", "妸", "诶", "奀", "鞥", "儿", "发", "帆", "匚", "飞", "分", "丰", "覅", "仏", "紑", "夫", "旮", "侅", "甘", "冈", "皋", "戈", "给", "根", "刯", "工", "勾", "估", "瓜", "乖", "关", "光", "归", "丨", "呙", "哈", "咍", "佄", "夯", "茠", "诃", "黒", "拫", "亨", "噷", "叿", "齁", "乎", "花", "怀", "欢", "巟", "灰", "昏", "吙", "丌", "加", "戋", "江", "艽", "阶", "巾", "坕", "冂", "丩", "凥", "姢", "噘", "军", "咔", "开", "刊", "忼", "尻", "匼", "肎", "劥", "空", "抠", "扝", "夸", "蒯", "宽", "匡", "亏", "坤", "扩", "垃", "来", "兰", "啷", "捞", "肋", "勒", "崚", "哩", "俩", "奁", "良", "撩", "毟", "拎", "伶", "溜", "囖", "龙", "瞜", "噜", "驴", "娈", "掠", "抡", "罗", "呣", "妈", "埋", "嫚", "牤", "猫", "么", "呅", "门", "甿", "咪", "宀", "喵", "乜", "民", "名", "谬", "摸", "哞", "毪", "嗯", "拏", "腉", "囡", "囔", "孬", "疒", "娞", "恁", "能", "妮", "拈", "娘", "鸟", "捏", "囜", "宁", "妞", "农", "羺", "奴", "女", "奻", "疟", "黁", "挪", "喔", "讴", "妑", "拍", "眅", "乓", "抛", "呸", "喷", "匉", "丕", "囨", "剽", "氕", "姘", "乒", "钋", "剖", "仆", "七", "掐", "千", "呛", "悄", "癿", "亲", "靑", "卭", "丘", "区", "峑", "缺", "夋", "呥", "穣", "娆", "惹", "人", "扔", "日", "茸", "厹", "邚", "挼", "堧", "婑", "瞤", "捼", "仨", "毢", "三", "桒", "掻", "閪", "森", "僧", "杀", "筛", "山", "伤", "弰", "奢", "申", "升", "尸", "収", "书", "刷", "衰", "闩", "双", "脽", "吮", "说", "厶", "忪", "捜", "苏", "狻", "夊", "孙", "唆", "他", "囼", "坍", "汤", "夲", "忑", "熥", "剔", "天", "旫", "帖", "厅", "囲", "偷", "凸", "湍", "推", "吞", "乇", "穵", "歪", "弯", "尣", "危", "昷", "翁", "挝", "乌", "夕", "虲", "仙", "乡", "灱", "些", "心", "星", "凶", "休", "吁", "吅", "削", "坃", "丫", "恹", "央", "幺", "倻", "一", "囙", "应", "哟", "佣", "优", "扜", "囦", "曰", "晕", "帀", "災", "兂", "匨", "傮", "则", "贼", "怎", "増", "扎", "捚", "沾", "张", "佋", "蜇", "贞", "争", "之", "中", "州", "朱", "抓", "拽", "专", "妆", "隹", "宒", "卓", "乲", "宗", "邹", "租", "钻", "厜", "尊", "昨", "兙"];
  var PINYINS = ["A", "AI", "AN", "ANG", "AO", "BA", "BAI", "BAN", "BANG", "BAO", "BEI", "BEN", "BENG", "BI", "BIAN", "BIAO", "BIE", "BIN", "BING", "BO", "BU", "CA", "CAI", "CAN", "CANG", "CAO", "CE", "CEN", "CENG", "CHA", "CHAI", "CHAN", "CHANG", "CHAO", "CHE", "CHEN", "CHENG", "CHI", "CHONG", "CHOU", "CHU", "CHUA", "CHUAI", "CHUAN", "CHUANG", "CHUI", "CHUN", "CHUO", "CI", "CONG", "COU", "CU", "CUAN", "CUI", "CUN", "CUO", "DA", "DAI", "DAN", "DANG", "DAO", "DE", "DEN", "DENG", "DI", "DIAN", "DIAO", "DIE", "DING", "DIU", "DONG", "DOU", "DU", "DUAN", "DUI", "DUN", "DUO", "E", "EI", "EN", "ENG", "ER", "FA", "FAN", "FANG", "FEI", "FEN", "FENG", "FIAO", "FO", "FOU", "FU", "GA", "GAI", "GAN", "GANG", "GAO", "GE", "GEI", "GEN", "GENG", "GONG", "GOU", "GU", "GUA", "GUAI", "GUAN", "GUANG", "GUI", "GUN", "GUO", "HA", "HAI", "HAN", "HANG", "HAO", "HE", "HEI", "HEN", "HENG", "HM", "HONG", "HOU", "HU", "HUA", "HUAI", "HUAN", "HUANG", "HUI", "HUN", "HUO", "JI", "JIA", "JIAN", "JIANG", "JIAO", "JIE", "JIN", "JING", "JIONG", "JIU", "JU", "JUAN", "JUE", "JUN", "KA", "KAI", "KAN", "KANG", "KAO", "KE", "KEN", "KENG", "KONG", "KOU", "KU", "KUA", "KUAI", "KUAN", "KUANG", "KUI", "KUN", "KUO", "LA", "LAI", "LAN", "LANG", "LAO", "LE", "LEI", "LENG", "LI", "LIA", "LIAN", "LIANG", "LIAO", "LIE", "LIN", "LING", "LIU", "LO", "LONG", "LOU", "LU", "LV", "LUAN", "LVE", "LUN", "LUO", "M", "MA", "MAI", "MAN", "MANG", "MAO", "ME", "MEI", "MEN", "MENG", "MI", "MIAN", "MIAO", "MIE", "MIN", "MING", "MIU", "MO", "MOU", "MU", "N", "NA", "NAI", "NAN", "NANG", "NAO", "NE", "NEI", "NEN", "NENG", "NI", "NIAN", "NIANG", "NIAO", "NIE", "NIN", "NING", "NIU", "NONG", "NOU", "NU", "NV", "NUAN", "NVE", "NUN", "NUO", "O", "OU", "PA", "PAI", "PAN", "PANG", "PAO", "PEI", "PEN", "PENG", "PI", "PIAN", "PIAO", "PIE", "PIN", "PING", "PO", "POU", "PU", "QI", "QIA", "QIAN", "QIANG", "QIAO", "QIE", "QIN", "QING", "QIONG", "QIU", "QU", "QUAN", "QUE", "QUN", "RAN", "RANG", "RAO", "RE", "REN", "RENG", "RI", "RONG", "ROU", "RU", "RUA", "RUAN", "RUI", "RUN", "RUO", "SA", "SAI", "SAN", "SANG", "SAO", "SE", "SEN", "SENG", "SHA", "SHAI", "SHAN", "SHANG", "SHAO", "SHE", "SHEN", "SHENG", "SHI", "SHOU", "SHU", "SHUA", "SHUAI", "SHUAN", "SHUANG", "SHUI", "SHUN", "SHUO", "SI", "SONG", "SOU", "SU", "SUAN", "SUI", "SUN", "SUO", "TA", "TAI", "TAN", "TANG", "TAO", "TE", "TENG", "TI", "TIAN", "TIAO", "TIE", "TING", "TONG", "TOU", "TU", "TUAN", "TUI", "TUN", "TUO", "WA", "WAI", "WAN", "WANG", "WEI", "WEN", "WENG", "WO", "WU", "XI", "XIA", "XIAN", "XIANG", "XIAO", "XIE", "XIN", "XING", "XIONG", "XIU", "XU", "XUAN", "XUE", "XUN", "YA", "YAN", "YANG", "YAO", "YE", "YI", "YIN", "YING", "YO", "YONG", "YOU", "YU", "YUAN", "YUE", "YUN", "ZA", "ZAI", "ZAN", "ZANG", "ZAO", "ZE", "ZEI", "ZEN", "ZENG", "ZHA", "ZHAI", "ZHAN", "ZHANG", "ZHAO", "ZHE", "ZHEN", "ZHENG", "ZHI", "ZHONG", "ZHOU", "ZHU", "ZHUA", "ZHUAI", "ZHUAN", "ZHUANG", "ZHUI", "ZHUN", "ZHUO", "ZI", "ZONG", "ZOU", "ZU", "ZUAN", "ZUI", "ZUN", "ZUO", ""];
  var EXCEPTIONS = {
    "曾": "ZENG",
    // CENG 曾
    "沈": "SHEN",
    // CHEN 沈
    "嗲": "DIA",
    // DIE 嗲
    "碡": "ZHOU",
    // DU 碡
    "聒": "GUO",
    // GUA 聒
    "炔": "QUE",
    // GUI 炔
    "蚵": "KE",
    // HE 蚵
    "砉": "HUA",
    // HUO 砉
    "嬤": "MO",
    // MA 嬤
    "嬷": "MO",
    // MA 嬷
    "蹒": "PAN",
    // MAN 蹒
    "蹊": "XI",
    // QI 蹊
    "丬": "PAN",
    // QIANG 丬
    "霰": "XIAN",
    // SAN 霰
    "莘": "XIN",
    // SHEN 莘
    "豉": "CHI",
    // SHI 豉
    "饧": "XING",
    // TANG 饧
    "筠": "JUN",
    // YUN 筠
    "长": "CHANG",
    // ZHANG 长
    "帧": "ZHEN",
    // ZHENG 帧
    "峙": "SHI",
    // ZHI 峙
    "郍": "NA",
    "芎": "XIONG",
    "谁": "SHUI"
  };
  var dict = {
    PINYINS,
    UNIHANS,
    EXCEPTIONS
  };
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  var DICT = dict;
  var FIRST_PINYIN_UNIHAN = "阿";
  var LAST_PINYIN_UNIHAN = "鿿";
  var LATIN = 1;
  var PINYIN = 2;
  var UNKNOWN = 3;
  var supported = null;
  var COLLATOR = void 0;
  function patchDict(patchers) {
    if (!patchers) return;
    if (typeof patchers === "function") {
      patchers = [patchers];
    }
    if (patchers.forEach) {
      patchers.forEach(function(p2) {
        typeof p2 === "function" && p2(DICT);
      });
    }
  }
  function isSupported(force) {
    if (!force && supported !== null) {
      return supported;
    }
    if ((typeof Intl === "undefined" ? "undefined" : _typeof(Intl)) === "object" && Intl.Collator) {
      COLLATOR = new Intl.Collator(["zh-Hans-CN", "zh-CN"]);
      supported = Intl.Collator.supportedLocalesOf(["zh-CN"]).length === 1;
    } else {
      supported = false;
    }
    return supported;
  }
  function genToken(ch) {
    var UNIHANS2 = DICT.UNIHANS;
    var PINYINS2 = DICT.PINYINS;
    var EXCEPTIONS2 = DICT.EXCEPTIONS;
    var token2 = {
      source: ch
      // First check EXCEPTIONS map, then search with UNIHANS table.
    };
    if (ch in EXCEPTIONS2) {
      token2.type = PINYIN;
      token2.target = EXCEPTIONS2[ch];
      return token2;
    }
    var offset = -1;
    var cmp = void 0;
    if (ch.charCodeAt(0) < 256) {
      token2.type = LATIN;
      token2.target = ch;
      return token2;
    } else {
      cmp = COLLATOR.compare(ch, FIRST_PINYIN_UNIHAN);
      if (cmp < 0) {
        token2.type = UNKNOWN;
        token2.target = ch;
        return token2;
      } else if (cmp === 0) {
        token2.type = PINYIN;
        offset = 0;
      } else {
        cmp = COLLATOR.compare(ch, LAST_PINYIN_UNIHAN);
        if (cmp > 0) {
          token2.type = UNKNOWN;
          token2.target = ch;
          return token2;
        } else if (cmp === 0) {
          token2.type = PINYIN;
          offset = UNIHANS2.length - 1;
        }
      }
    }
    token2.type = PINYIN;
    if (offset < 0) {
      var begin = 0;
      var end = UNIHANS2.length - 1;
      while (begin <= end) {
        offset = ~~((begin + end) / 2);
        var unihan = UNIHANS2[offset];
        cmp = COLLATOR.compare(ch, unihan);
        if (cmp === 0) {
          break;
        } else if (cmp > 0) {
          begin = offset + 1;
        } else {
          end = offset - 1;
        }
      }
    }
    if (cmp < 0) {
      offset--;
    }
    token2.target = PINYINS2[offset];
    if (!token2.target) {
      token2.type = UNKNOWN;
      token2.target = token2.source;
    }
    return token2;
  }
  function parse$1(str) {
    if (typeof str !== "string") {
      throw new Error("argument should be string.");
    }
    if (!isSupported()) {
      throw new Error("not support Intl or zh-CN language.");
    }
    return str.split("").map(function(v2) {
      return genToken(v2);
    });
  }
  var core = {
    isSupported,
    parse: parse$1,
    patchDict,
    genToken,
    // inner usage
    convertToPinyin: function convertToPinyin(str, separator, lowerCase) {
      return parse$1(str).map(function(v2) {
        if (lowerCase && v2.type === PINYIN) {
          return v2.target.toLowerCase();
        }
        return v2.target;
      }).join(separator || "");
    }
  };
  var _56l = { exports: {} };
  (function(module, exports) {
    exports = module.exports = function patcher(DICT2) {
      DICT2.EXCEPTIONS = {
        "嗲": "DIA",
        // DIE 嗲
        "碡": "ZHOU",
        // DU 碡
        "聒": "GUO",
        // GUA 聒
        "炔": "QUE",
        // GUI 炔
        "蚵": "KE",
        // HE 蚵
        "砉": "HUA",
        // HUO 砉
        "嬷": "MO",
        // MA 嬷 新增
        "蹊": "XI",
        // QI 蹊
        "丬": "PAN",
        // QIANG 丬
        "霰": "XIAN",
        // SAN 霰
        "豉": "CHI",
        // SHI 豉
        "饧": "XING",
        // TANG 饧
        "帧": "ZHEN",
        // ZHENG 帧
        "芎": "XIONG",
        // 芎
        "谁": "SHUI",
        // 谁
        "钶": "KE"
        // 钶
        // Update UNIHANS dict.
      };
      DICT2.UNIHANS[91] = "伕";
      DICT2.UNIHANS[347] = "仚";
      DICT2.UNIHANS[393] = "诌";
      DICT2.UNIHANS[39] = "婤";
      DICT2.UNIHANS[50] = "腠";
      DICT2.UNIHANS[369] = "攸";
      DICT2.UNIHANS[123] = "乯";
      DICT2.UNIHANS[171] = "刕";
      DICT2.UNIHANS[102] = "佝";
      DICT2.UNIHANS[126] = "犿";
      DICT2.UNIHANS[176] = "列";
      DICT2.UNIHANS[178] = "刢";
      DICT2.UNIHANS[252] = "娝";
      DICT2.UNIHANS[330] = "偸";
    };
    exports.shouldPatch = function shouldPatch(toToken) {
      if (typeof toToken !== "function") return false;
      if (toToken("伕").target === "FOU" && toToken("仚").target === "XIA" && toToken("诌").target === "ZHONG" && toToken("婤").target === "CHONG" && toToken("腠").target === "CONG" && toToken("攸").target === "YONG" && toToken("乯").target === "HOU" && toToken("刕").target === "LENG" && toToken("佝").target === "GONG" && toToken("犿").target === "HUAI" && toToken("列").target === "LIAO" && toToken("刢").target === "LIN" && toToken("钶").target === "E") {
        return true;
      }
      return false;
    };
  })(_56l, _56l.exports);
  var _56lExports = _56l.exports;
  var pinyin = core;
  var patcher56L = _56lExports;
  if (pinyin.isSupported() && patcher56L.shouldPatch(pinyin.genToken)) {
    pinyin.patchDict(patcher56L);
  }
  var dist = pinyin;
  const pinyin$1 = /* @__PURE__ */ getDefaultExportFromCjs(dist);
  var TagSorter = ((TagSorter2) => {
    TagSorter2["Pinyin"] = "Pinyin";
    TagSorter2["Count"] = "Count";
    TagSorter2["Occurrence"] = "Occurrence";
    return TagSorter2;
  })(TagSorter || {});
  const TagSorterLabel = {
    ["Pinyin"]: "按拼音排序",
    ["Count"]: "按数量排序",
    ["Occurrence"]: "自然出现顺序"
  };
  function getAllTags(videos) {
    if (!videos) return [];
    const list = videos.map((v2) => {
      var _a;
      return ((_a = v2.detailInfo) == null ? void 0 : _a.tags) ?? [];
    }).flat();
    const grouped = lodash.groupBy(list, (tag2) => tag2.url);
    let _list = Object.entries(grouped).map(([url, list2]) => {
      return { name: list2[0].name, url, count: list2.length };
    }).orderBy(["count", "name"], ["desc", zhStringComparer]);
    return _list.map((item2) => {
      var _a;
      let pinyinFirstLetter = ((_a = pinyin$1.convertToPinyin(item2.name)) == null ? void 0 : _a[0]) || "";
      if (!/[a-zA-Z]/.test(pinyinFirstLetter)) {
        pinyinFirstLetter = "";
      }
      return {
        ...item2,
        pinyinFirstLetter,
        id: getTagId(item2.url)
      };
    });
  }
  const _allTags = customMemo(getAllTags);
  function filterByTag(videos, selectedTagIds) {
    if (!videos.length) return [];
    if (!selectedTagIds.length) return videos.slice();
    selectedTagIds = selectedTagIds.uniq();
    return videos.filter((v2) => selectedTagIds.every((selectedId) => v2.tagsMap[selectedId]));
  }
  const _videosAfterFilterByTag = memoizeOne(
    filterByTag,
    (...[args1, args2]) => {
      const [_args1, _args2] = [args1, args2].map((args) => {
        return [args[0]._map("id"), args[1]];
      });
      return lodash.isEqual(_args1, _args2);
    }
  );
  const _allTagsSorted = function({
    tagSorter,
    allTags,
    tagsForceOrder
  }) {
    allTags = allTags.filter((item2) => {
      return item2.name !== HANZI_COLLECTION && item2.name !== HANZI_SINGLE;
    });
    if (tagSorter === "Occurrence") return allTags;
    const mapForceOrder = (tag2) => {
      return tagsForceOrder.includes(tag2.name) ? tagsForceOrder.indexOf(tag2.name) : Infinity;
    };
    if (tagSorter === "Count") {
      return allTags.orderBy([mapForceOrder, "count", mapName], ["asc", "desc", zhStringComparer]);
    }
    return allTags.orderBy([mapForceOrder, mapName], ["asc", zhStringComparer]);
  };
  function mapName(tag2) {
    let name = tag2.name;
    name = mapZhString(name);
    name = (tag2.pinyinFirstLetter || "") + name;
    return name;
  }
  const STAR_COUNT_NO_LIMIT_NUM = 11;
  const initialState = () => ({
    videos: [],
    loadingPageCount: 0,
    loadingProgress: { progress: 0, completed: 0, total: 0 },
    get videoCountRecord() {
      const grouped = lodash.groupBy(this.videos, (v2) => v2.collectionType);
      return Object.values(CollectionType).reduce(
        (ret, val) => {
          var _a;
          return { ...ret, [val]: ((_a = grouped[val]) == null ? void 0 : _a.length) || 0 };
        },
        {}
      );
    },
    includeRecord: {
      [CollectionType.Single]: true,
      [CollectionType.Other]: true,
      [CollectionType.Collection]: false,
      [CollectionType.BlackList]: false
    },
    get videosAfterFilterByCollection() {
      return filterByCollection(this.videos, this.includeRecord);
    },
    selectedStudio: void 0,
    selectedLabel: void 0,
    selectedSeries: void 0,
    selectedDirector: void 0,
    selectedStar: void 0,
    selectedPrefix: void 0,
    searchText: void 0,
    enableFilterByStarCount: false,
    selecedStarCount: [0, 11],
    __processNameUrlList(list) {
      const grouped = lodash.groupBy(list, (s2) => s2.url);
      const listWithCount = Object.entries(grouped).map(([url, list2]) => {
        return { name: list2[0].name, value: url, count: list2.length };
      });
      return listWithCount.orderBy(["count", (item2) => mapZhString(item2.name)], ["desc", zhStringComparer]);
    },
    _getCountListByDetailInfo(key) {
      const videos = this.videosAfterFilterByCollection;
      const list = videos.map((v2) => {
        var _a;
        return (_a = v2.detailInfo) == null ? void 0 : _a[key];
      }).filter(Boolean);
      return this.__processNameUrlList(list);
    },
    get allStudios() {
      return this._getCountListByDetailInfo("studio");
    },
    get allLabels() {
      return this._getCountListByDetailInfo("label");
    },
    get allSeries() {
      return this._getCountListByDetailInfo("series");
    },
    get allDirectors() {
      return this._getCountListByDetailInfo("director");
    },
    get allPrefixs() {
      return _allPrefixs(this.videosAfterFilterByCollection);
    },
    get allStars() {
      const list = this.videosAfterFilterByCollection.map((v2) => {
        var _a;
        return (_a = v2.detailInfo) == null ? void 0 : _a.stars;
      }).flat().filter(Boolean);
      return this.__processNameUrlList(list);
    },
    get videosAfterFilterByScope() {
      const {
        videosAfterFilterByCollection: videos,
        selectedStudio,
        selectedLabel,
        selectedSeries,
        selectedDirector,
        selectedStar,
        selectedPrefix,
        searchText,
        enableFilterByStarCount,
        selecedStarCount
      } = this;
      return _videosAfterFilterByScope({
        videos,
        selectedStudio,
        selectedLabel,
        selectedSeries,
        selectedDirector,
        selectedStar,
        selectedPrefix,
        searchText,
        enableFilterByStarCount,
        selecedStarCount
      });
    },
    get allTags() {
      return _allTags(this.videosAfterFilterByScope);
    },
    tagSorter: TagSorter.Pinyin,
    selectedTagIds: proxySet(),
    lockedTagIds: proxySet(),
    get videosAfterFilterByTag() {
      const visibileTagIds = this.allTags._map("id");
      const selectedTagIds = [...snapshot(this.selectedTagIds)].filter((id2) => visibileTagIds.includes(id2));
      return _videosAfterFilterByTag(this.videosAfterFilterByScope, selectedTagIds);
    },
    moreFilterPanelExpanded: false
  });
  const store = proxy(initialState());
  function useStoreSnapshot() {
    return useSnapshot(store);
  }
  var classnames$1 = { exports: {} };
  /*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  */
  (function(module) {
    (function() {
      var hasOwn2 = {}.hasOwnProperty;
      function classNames() {
        var classes = "";
        for (var i2 = 0; i2 < arguments.length; i2++) {
          var arg = arguments[i2];
          if (arg) {
            classes = appendClass(classes, parseValue(arg));
          }
        }
        return classes;
      }
      function parseValue(arg) {
        if (typeof arg === "string" || typeof arg === "number") {
          return arg;
        }
        if (typeof arg !== "object") {
          return "";
        }
        if (Array.isArray(arg)) {
          return classNames.apply(null, arg);
        }
        if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
          return arg.toString();
        }
        var classes = "";
        for (var key in arg) {
          if (hasOwn2.call(arg, key) && arg[key]) {
            classes = appendClass(classes, key);
          }
        }
        return classes;
      }
      function appendClass(value, newClass) {
        if (!newClass) {
          return value;
        }
        if (value) {
          return value + " " + newClass;
        }
        return value + newClass;
      }
      if (module.exports) {
        classNames.default = classNames;
        module.exports = classNames;
      } else {
        window.classNames = classNames;
      }
    })();
  })(classnames$1);
  var classnamesExports = classnames$1.exports;
  const cx = /* @__PURE__ */ getDefaultExportFromCjs(classnamesExports);
  var unitlessKeys = {
    animationIterationCount: 1,
    aspectRatio: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    // SVG-related properties
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
  };
  var isDevelopment = false;
  var hyphenateRegex = /[A-Z]|^ms/g;
  var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;
  var isCustomProperty2 = function isCustomProperty3(property) {
    return property.charCodeAt(1) === 45;
  };
  var isProcessableValue2 = function isProcessableValue3(value) {
    return value != null && typeof value !== "boolean";
  };
  var processStyleName = /* @__PURE__ */ memoize(function(styleName) {
    return isCustomProperty2(styleName) ? styleName : styleName.replace(hyphenateRegex, "-$&").toLowerCase();
  });
  var processStyleValue2 = function processStyleValue3(key, value) {
    switch (key) {
      case "animation":
      case "animationName": {
        if (typeof value === "string") {
          return value.replace(animationRegex, function(match2, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
    }
    if (unitlessKeys[key] !== 1 && !isCustomProperty2(key) && typeof value === "number" && value !== 0) {
      return value + "px";
    }
    return value;
  };
  var noComponentSelectorMessage = "Component selectors can only be used in conjunction with @emotion/babel-plugin, the swc Emotion plugin, or another Emotion-aware compiler transform.";
  function handleInterpolation(mergedProps, registered, interpolation) {
    if (interpolation == null) {
      return "";
    }
    var componentSelector = interpolation;
    if (componentSelector.__emotion_styles !== void 0) {
      return componentSelector;
    }
    switch (typeof interpolation) {
      case "boolean": {
        return "";
      }
      case "object": {
        var keyframes = interpolation;
        if (keyframes.anim === 1) {
          cursor = {
            name: keyframes.name,
            styles: keyframes.styles,
            next: cursor
          };
          return keyframes.name;
        }
        var serializedStyles = interpolation;
        if (serializedStyles.styles !== void 0) {
          var next2 = serializedStyles.next;
          if (next2 !== void 0) {
            while (next2 !== void 0) {
              cursor = {
                name: next2.name,
                styles: next2.styles,
                next: cursor
              };
              next2 = next2.next;
            }
          }
          var styles2 = serializedStyles.styles + ";";
          return styles2;
        }
        return createStringFromObject(mergedProps, registered, interpolation);
      }
    }
    var asString = interpolation;
    if (registered == null) {
      return asString;
    }
    var cached = registered[asString];
    return cached !== void 0 ? cached : asString;
  }
  function createStringFromObject(mergedProps, registered, obj) {
    var string = "";
    if (Array.isArray(obj)) {
      for (var i2 = 0; i2 < obj.length; i2++) {
        string += handleInterpolation(mergedProps, registered, obj[i2]) + ";";
      }
    } else {
      for (var key in obj) {
        var value = obj[key];
        if (typeof value !== "object") {
          var asString = value;
          if (registered != null && registered[asString] !== void 0) {
            string += key + "{" + registered[asString] + "}";
          } else if (isProcessableValue2(asString)) {
            string += processStyleName(key) + ":" + processStyleValue2(key, asString) + ";";
          }
        } else {
          if (key === "NO_COMPONENT_SELECTOR" && isDevelopment) {
            throw new Error(noComponentSelectorMessage);
          }
          if (Array.isArray(value) && typeof value[0] === "string" && (registered == null || registered[value[0]] === void 0)) {
            for (var _i = 0; _i < value.length; _i++) {
              if (isProcessableValue2(value[_i])) {
                string += processStyleName(key) + ":" + processStyleValue2(key, value[_i]) + ";";
              }
            }
          } else {
            var interpolated = handleInterpolation(mergedProps, registered, value);
            switch (key) {
              case "animation":
              case "animationName": {
                string += processStyleName(key) + ":" + interpolated + ";";
                break;
              }
              default: {
                string += key + "{" + interpolated + "}";
              }
            }
          }
        }
      }
    }
    return string;
  }
  var labelPattern = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
  var cursor;
  function serializeStyles(args, registered, mergedProps) {
    if (args.length === 1 && typeof args[0] === "object" && args[0] !== null && args[0].styles !== void 0) {
      return args[0];
    }
    var stringMode = true;
    var styles2 = "";
    cursor = void 0;
    var strings = args[0];
    if (strings == null || strings.raw === void 0) {
      stringMode = false;
      styles2 += handleInterpolation(mergedProps, registered, strings);
    } else {
      var asTemplateStringsArr = strings;
      styles2 += asTemplateStringsArr[0];
    }
    for (var i2 = 1; i2 < args.length; i2++) {
      styles2 += handleInterpolation(mergedProps, registered, args[i2]);
      if (stringMode) {
        var templateStringsArr = strings;
        styles2 += templateStringsArr[i2];
      }
    }
    labelPattern.lastIndex = 0;
    var identifierName = "";
    var match2;
    while ((match2 = labelPattern.exec(styles2)) !== null) {
      identifierName += "-" + match2[1];
    }
    var name = murmur2(styles2) + identifierName;
    return {
      name,
      styles: styles2,
      next: cursor
    };
  }
  function insertWithoutScoping(cache2, serialized) {
    if (cache2.inserted[serialized.name] === void 0) {
      return cache2.insert("", serialized, cache2.sheet, true);
    }
  }
  function merge$1(registered, css2, className) {
    var registeredStyles = [];
    var rawClassName = getRegisteredStyles(registered, registeredStyles, className);
    if (registeredStyles.length < 2) {
      return className;
    }
    return rawClassName + css2(registeredStyles);
  }
  var createEmotion = function createEmotion2(options) {
    var cache2 = createCache(options);
    cache2.sheet.speedy = function(value) {
      this.isSpeedy = value;
    };
    cache2.compat = true;
    var css2 = function css3() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var serialized = serializeStyles(args, cache2.registered, void 0);
      insertStyles(cache2, serialized, false);
      return cache2.key + "-" + serialized.name;
    };
    var keyframes = function keyframes2() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      var serialized = serializeStyles(args, cache2.registered);
      var animation = "animation-" + serialized.name;
      insertWithoutScoping(cache2, {
        name: serialized.name,
        styles: "@keyframes " + animation + "{" + serialized.styles + "}"
      });
      return animation;
    };
    var injectGlobal = function injectGlobal2() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      var serialized = serializeStyles(args, cache2.registered);
      insertWithoutScoping(cache2, serialized);
    };
    var cx2 = function cx3() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return merge$1(cache2.registered, css2, classnames(args));
    };
    return {
      css: css2,
      cx: cx2,
      injectGlobal,
      keyframes,
      hydrate: function hydrate(ids2) {
        ids2.forEach(function(key) {
          cache2.inserted[key] = true;
        });
      },
      flush: function flush() {
        cache2.registered = {};
        cache2.inserted = {};
        cache2.sheet.flush();
      },
      sheet: cache2.sheet,
      cache: cache2,
      getRegisteredStyles: getRegisteredStyles.bind(null, cache2.registered),
      merge: merge$1.bind(null, cache2.registered, css2)
    };
  };
  var classnames = function classnames2(args) {
    var cls = "";
    for (var i2 = 0; i2 < args.length; i2++) {
      var arg = args[i2];
      if (arg == null) continue;
      var toAdd = void 0;
      switch (typeof arg) {
        case "boolean":
          break;
        case "object": {
          if (Array.isArray(arg)) {
            toAdd = classnames2(arg);
          } else {
            toAdd = "";
            for (var k2 in arg) {
              if (arg[k2] && k2) {
                toAdd && (toAdd += " ");
                toAdd += k2;
              }
            }
          }
          break;
        }
        default: {
          toAdd = arg;
        }
      }
      if (toAdd) {
        cls && (cls += " ");
        cls += toAdd;
      }
    }
    return cls;
  };
  var _createEmotion = createEmotion({
    key: "css"
  }), css = _createEmotion.css;
  const styled = { generateClassName: css };
  function CollapsePanel({
    expanded,
    children,
    ...props
  }) {
    return jsx(
      "div",
      {
        ...props,
        "data-classname": "wrapper",
        css: css$1`
        transition: grid-template-rows 0.2s ease-out;
        display: grid;
        grid-template-rows: ${expanded ? 1 : 0}fr;
      `,
        children: jsx(
          "div",
          {
            "data-classname": "inner",
            css: css$1`
          overflow: hidden;
        `,
            children
          }
        )
      }
    );
  }
  function FlagSettingItem({
    configKey,
    label: label2,
    extraAction,
    tooltip,
    ...otherProps
  }) {
    const snap = useSettingsSnapshot();
    const checked = !!snap[configKey];
    const onChange = React__default.useCallback((e2) => {
      const val = e2.target.checked;
      settings[configKey] = val;
      extraAction == null ? void 0 : extraAction(val);
    }, []);
    let inner = jsx("span", { style: { userSelect: "none" }, children: label2 || configKey });
    if (tooltip)
      inner = jsx(antd.Tooltip, { title: tooltip, overlayStyle: { width: "max-content", maxWidth: "50vw" }, children: inner });
    return jsx(antd.Checkbox, { ...otherProps, checked, onChange, children: inner });
  }
  var _excluded = ["size", "strokeWidth", "strokeLinecap", "strokeLinejoin", "theme", "fill", "className", "spin"];
  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = null != arguments[i2] ? arguments[i2] : {};
      i2 % 2 ? ownKeys(Object(source), true).forEach(function(key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i2;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i2 = 0; i2 < sourceSymbolKeys.length; i2++) {
        key = sourceSymbolKeys[i2];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i2;
    for (i2 = 0; i2 < sourceKeys.length; i2++) {
      key = sourceKeys[i2];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  var DEFAULT_ICON_CONFIGS = {
    size: "1em",
    strokeWidth: 4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    rtl: false,
    theme: "outline",
    colors: {
      outline: {
        fill: "#333",
        background: "transparent"
      },
      filled: {
        fill: "#333",
        background: "#FFF"
      },
      twoTone: {
        fill: "#333",
        twoTone: "#2F88FF"
      },
      multiColor: {
        outStrokeColor: "#333",
        outFillColor: "#2F88FF",
        innerStrokeColor: "#FFF",
        innerFillColor: "#43CCF8"
      }
    },
    prefix: "i"
  };
  function guid() {
    return "icon-" + ((1 + Math.random()) * 4294967296 | 0).toString(16).substring(1);
  }
  function IconConverter(id2, icon, config) {
    var fill = typeof icon.fill === "string" ? [icon.fill] : icon.fill || [];
    var colors = [];
    var theme2 = icon.theme || config.theme;
    switch (theme2) {
      case "outline":
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push("none");
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push("none");
        break;
      case "filled":
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push("#FFF");
        colors.push("#FFF");
        break;
      case "two-tone":
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push(typeof fill[1] === "string" ? fill[1] : config.colors.twoTone.twoTone);
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push(typeof fill[1] === "string" ? fill[1] : config.colors.twoTone.twoTone);
        break;
      case "multi-color":
        colors.push(typeof fill[0] === "string" ? fill[0] : "currentColor");
        colors.push(typeof fill[1] === "string" ? fill[1] : config.colors.multiColor.outFillColor);
        colors.push(typeof fill[2] === "string" ? fill[2] : config.colors.multiColor.innerStrokeColor);
        colors.push(typeof fill[3] === "string" ? fill[3] : config.colors.multiColor.innerFillColor);
        break;
    }
    return {
      size: icon.size || config.size,
      strokeWidth: icon.strokeWidth || config.strokeWidth,
      strokeLinecap: icon.strokeLinecap || config.strokeLinecap,
      strokeLinejoin: icon.strokeLinejoin || config.strokeLinejoin,
      colors,
      id: id2
    };
  }
  var IconContext = /* @__PURE__ */ React__default.createContext(DEFAULT_ICON_CONFIGS);
  IconContext.Provider;
  function IconWrapper(name, rtl, render) {
    return function(props) {
      var size = props.size, strokeWidth = props.strokeWidth, strokeLinecap = props.strokeLinecap, strokeLinejoin = props.strokeLinejoin, theme2 = props.theme, fill = props.fill, className = props.className, spin = props.spin, extra = _objectWithoutProperties(props, _excluded);
      var ICON_CONFIGS = React__default.useContext(IconContext);
      var id2 = React__default.useMemo(guid, []);
      var svgProps = IconConverter(id2, {
        size,
        strokeWidth,
        strokeLinecap,
        strokeLinejoin,
        theme: theme2,
        fill
      }, ICON_CONFIGS);
      var cls = [ICON_CONFIGS.prefix + "-icon"];
      cls.push(ICON_CONFIGS.prefix + "-icon-" + name);
      if (rtl && ICON_CONFIGS.rtl) {
        cls.push(ICON_CONFIGS.prefix + "-icon-rtl");
      }
      if (spin) {
        cls.push(ICON_CONFIGS.prefix + "-icon-spin");
      }
      if (className) {
        cls.push(className);
      }
      return /* @__PURE__ */ React__default.createElement("span", _objectSpread(_objectSpread({}, extra), {}, {
        className: cls.join(" ")
      }), render(svgProps));
    };
  }
  const CloseSmall = IconWrapper("close-small", false, function(props) {
    return /* @__PURE__ */ React__default.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React__default.createElement("path", {
      d: "M14 14L34 34",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M14 34L34 14",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }));
  });
  const DownC = IconWrapper("down-c", false, function(props) {
    return /* @__PURE__ */ React__default.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React__default.createElement("path", {
      d: "M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M33 21L24 30L15 21",
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }));
  });
  const ExpandDown = IconWrapper("expand-down", false, function(props) {
    return /* @__PURE__ */ React__default.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React__default.createElement("path", {
      d: "M6 10C6 7.79086 7.79086 6 10 6H38C40.2091 6 42 7.79086 42 10V38C42 40.2091 40.2091 42 38 42H10C7.79086 42 6 40.2091 6 38V10Z",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M6 32H42",
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M20 16L24 20L28 16",
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M6 26V38",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M42 26V38",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }));
  });
  const Help = IconWrapper("help", true, function(props) {
    return /* @__PURE__ */ React__default.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React__default.createElement("path", {
      d: "M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M24 28.6248V24.6248C27.3137 24.6248 30 21.9385 30 18.6248C30 15.3111 27.3137 12.6248 24 12.6248C20.6863 12.6248 18 15.3111 18 18.6248",
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M24 37.6248C25.3807 37.6248 26.5 36.5055 26.5 35.1248C26.5 33.7441 25.3807 32.6248 24 32.6248C22.6193 32.6248 21.5 33.7441 21.5 35.1248C21.5 36.5055 22.6193 37.6248 24 37.6248Z",
      fill: props.colors[2]
    }));
  });
  const Info = IconWrapper("info", true, function(props) {
    return /* @__PURE__ */ React__default.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React__default.createElement("path", {
      d: "M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M24 11C25.3807 11 26.5 12.1193 26.5 13.5C26.5 14.8807 25.3807 16 24 16C22.6193 16 21.5 14.8807 21.5 13.5C21.5 12.1193 22.6193 11 24 11Z",
      fill: props.colors[2]
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M24.5 34V20H23.5H22.5",
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M21 34H28",
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }));
  });
  const Lock = IconWrapper("lock", false, function(props) {
    return /* @__PURE__ */ React__default.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React__default.createElement("rect", {
      x: "6",
      y: "22",
      width: "36",
      height: "22",
      rx: "2",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M14 22V14C14 8.47715 18.4772 4 24 4C29.5228 4 34 8.47715 34 14V22",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M24 30V36",
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }));
  });
  const Unlock = IconWrapper("unlock", true, function(props) {
    return /* @__PURE__ */ React__default.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React__default.createElement("rect", {
      x: "7",
      y: "22.0476",
      width: "34",
      height: "22",
      rx: "2",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M14 22V14.0047C13.9948 8.87022 17.9227 4.56718 23.0859 4.05117C28.249 3.53516 32.9673 6.97408 34 12.0059",
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M24 30V36",
      stroke: props.colors[2],
      strokeWidth: props.strokeWidth,
      strokeLinecap: props.strokeLinecap,
      strokeLinejoin: props.strokeLinejoin
    }));
  });
  const WaterfallsH = IconWrapper("waterfalls-h", true, function(props) {
    return /* @__PURE__ */ React__default.createElement("svg", {
      width: props.size,
      height: props.size,
      viewBox: "0 0 48 48",
      fill: "none"
    }, /* @__PURE__ */ React__default.createElement("path", {
      d: "M20 6H6V17H20V6Z",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M42 31H28V42H42V31Z",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M42 6H28V23H42V6Z",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }), /* @__PURE__ */ React__default.createElement("path", {
      d: "M20 25H6V42H20V25Z",
      fill: props.colors[1],
      stroke: props.colors[0],
      strokeWidth: props.strokeWidth,
      strokeLinejoin: props.strokeLinejoin
    }));
  });
  const ImportedIcons = {
    Help,
    Info,
    WaterfallsH,
    CloseSmall,
    ExpandDown,
    DownC,
    Lock,
    Unlock
  };
  function IconPark({ name, theme: theme2, size, fill, ml, mr, mt, mb, ...props }) {
    theme2 || (theme2 = "outline");
    size || (size = 24);
    fill || (fill = "currentColor");
    const Comp = ImportedIcons[name];
    return jsx(
      Comp,
      {
        ...{ theme: theme2, size, fill, ...props },
        css: [
          ml && css$1`
            margin-left: ${ml}px;
          `,
          mr && css$1`
            margin-right: ${mr}px;
          `,
          mt && css$1`
            margin-top: ${mt}px;
          `,
          mb && css$1`
            margin-bottom: ${mb}px;
          `
        ]
      }
    );
  }
  function HelpInfo({
    children,
    iconProps,
    tooltipProps
  }) {
    return jsx(Fragment, { children: children && jsx(CustomTooltip, { ...tooltipProps, title: children, children: jsx(
      IconPark,
      {
        name: "Help",
        size: 14,
        ...iconProps,
        style: {
          cursor: "pointer",
          marginLeft: "4px",
          ...iconProps == null ? void 0 : iconProps.style
        }
      }
    ) }) });
  }
  function useCombinedRefs() {
    for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
      refs[_key] = arguments[_key];
    }
    return React__default.useMemo(
      () => (node2) => {
        refs.forEach((ref) => ref(node2));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      refs
    );
  }
  const canUseDOM = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
  function isWindow(element) {
    const elementString = Object.prototype.toString.call(element);
    return elementString === "[object Window]" || // In Electron context the Window object serializes to [object global]
    elementString === "[object global]";
  }
  function isNode(node2) {
    return "nodeType" in node2;
  }
  function getWindow(target) {
    var _target$ownerDocument, _target$ownerDocument2;
    if (!target) {
      return window;
    }
    if (isWindow(target)) {
      return target;
    }
    if (!isNode(target)) {
      return window;
    }
    return (_target$ownerDocument = (_target$ownerDocument2 = target.ownerDocument) == null ? void 0 : _target$ownerDocument2.defaultView) != null ? _target$ownerDocument : window;
  }
  function isDocument(node2) {
    const {
      Document
    } = getWindow(node2);
    return node2 instanceof Document;
  }
  function isHTMLElement(node2) {
    if (isWindow(node2)) {
      return false;
    }
    return node2 instanceof getWindow(node2).HTMLElement;
  }
  function isSVGElement(node2) {
    return node2 instanceof getWindow(node2).SVGElement;
  }
  function getOwnerDocument(target) {
    if (!target) {
      return document;
    }
    if (isWindow(target)) {
      return target.document;
    }
    if (!isNode(target)) {
      return document;
    }
    if (isDocument(target)) {
      return target;
    }
    if (isHTMLElement(target) || isSVGElement(target)) {
      return target.ownerDocument;
    }
    return document;
  }
  const useIsomorphicLayoutEffect$3 = canUseDOM ? React__default.useLayoutEffect : React__default.useEffect;
  function useEvent(handler) {
    const handlerRef = React__default.useRef(handler);
    useIsomorphicLayoutEffect$3(() => {
      handlerRef.current = handler;
    });
    return React__default.useCallback(function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return handlerRef.current == null ? void 0 : handlerRef.current(...args);
    }, []);
  }
  function useInterval() {
    const intervalRef = React__default.useRef(null);
    const set = React__default.useCallback((listener, duration) => {
      intervalRef.current = setInterval(listener, duration);
    }, []);
    const clear = React__default.useCallback(() => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);
    return [set, clear];
  }
  function useLatestValue(value, dependencies) {
    if (dependencies === void 0) {
      dependencies = [value];
    }
    const valueRef = React__default.useRef(value);
    useIsomorphicLayoutEffect$3(() => {
      if (valueRef.current !== value) {
        valueRef.current = value;
      }
    }, dependencies);
    return valueRef;
  }
  function useLazyMemo(callback, dependencies) {
    const valueRef = React__default.useRef();
    return React__default.useMemo(
      () => {
        const newValue = callback(valueRef.current);
        valueRef.current = newValue;
        return newValue;
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...dependencies]
    );
  }
  function useNodeRef(onChange) {
    const onChangeHandler = useEvent(onChange);
    const node2 = React__default.useRef(null);
    const setNodeRef = React__default.useCallback(
      (element) => {
        if (element !== node2.current) {
          onChangeHandler == null ? void 0 : onChangeHandler(element, node2.current);
        }
        node2.current = element;
      },
      //eslint-disable-next-line
      []
    );
    return [node2, setNodeRef];
  }
  function usePrevious(value) {
    const ref = React__default.useRef();
    React__default.useEffect(() => {
      ref.current = value;
    }, [value]);
    return ref.current;
  }
  let ids = {};
  function useUniqueId(prefix2, value) {
    return React__default.useMemo(() => {
      if (value) {
        return value;
      }
      const id2 = ids[prefix2] == null ? 0 : ids[prefix2] + 1;
      ids[prefix2] = id2;
      return prefix2 + "-" + id2;
    }, [prefix2, value]);
  }
  function createAdjustmentFn(modifier) {
    return function(object) {
      for (var _len = arguments.length, adjustments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        adjustments[_key - 1] = arguments[_key];
      }
      return adjustments.reduce((accumulator, adjustment) => {
        const entries = Object.entries(adjustment);
        for (const [key, valueAdjustment] of entries) {
          const value = accumulator[key];
          if (value != null) {
            accumulator[key] = value + modifier * valueAdjustment;
          }
        }
        return accumulator;
      }, {
        ...object
      });
    };
  }
  const add = /* @__PURE__ */ createAdjustmentFn(1);
  const subtract = /* @__PURE__ */ createAdjustmentFn(-1);
  function hasViewportRelativeCoordinates(event) {
    return "clientX" in event && "clientY" in event;
  }
  function isKeyboardEvent(event) {
    if (!event) {
      return false;
    }
    const {
      KeyboardEvent
    } = getWindow(event.target);
    return KeyboardEvent && event instanceof KeyboardEvent;
  }
  function isTouchEvent(event) {
    if (!event) {
      return false;
    }
    const {
      TouchEvent
    } = getWindow(event.target);
    return TouchEvent && event instanceof TouchEvent;
  }
  function getEventCoordinates(event) {
    if (isTouchEvent(event)) {
      if (event.touches && event.touches.length) {
        const {
          clientX: x2,
          clientY: y2
        } = event.touches[0];
        return {
          x: x2,
          y: y2
        };
      } else if (event.changedTouches && event.changedTouches.length) {
        const {
          clientX: x2,
          clientY: y2
        } = event.changedTouches[0];
        return {
          x: x2,
          y: y2
        };
      }
    }
    if (hasViewportRelativeCoordinates(event)) {
      return {
        x: event.clientX,
        y: event.clientY
      };
    }
    return null;
  }
  const CSS = /* @__PURE__ */ Object.freeze({
    Translate: {
      toString(transform) {
        if (!transform) {
          return;
        }
        const {
          x: x2,
          y: y2
        } = transform;
        return "translate3d(" + (x2 ? Math.round(x2) : 0) + "px, " + (y2 ? Math.round(y2) : 0) + "px, 0)";
      }
    },
    Scale: {
      toString(transform) {
        if (!transform) {
          return;
        }
        const {
          scaleX,
          scaleY
        } = transform;
        return "scaleX(" + scaleX + ") scaleY(" + scaleY + ")";
      }
    },
    Transform: {
      toString(transform) {
        if (!transform) {
          return;
        }
        return [CSS.Translate.toString(transform), CSS.Scale.toString(transform)].join(" ");
      }
    },
    Transition: {
      toString(_ref) {
        let {
          property,
          duration,
          easing
        } = _ref;
        return property + " " + duration + "ms " + easing;
      }
    }
  });
  const SELECTOR = "a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]";
  function findFirstFocusableNode(element) {
    if (element.matches(SELECTOR)) {
      return element;
    }
    return element.querySelector(SELECTOR);
  }
  const hiddenStyles = {
    display: "none"
  };
  function HiddenText(_ref) {
    let {
      id: id2,
      value
    } = _ref;
    return React__default.createElement("div", {
      id: id2,
      style: hiddenStyles
    }, value);
  }
  function LiveRegion(_ref) {
    let {
      id: id2,
      announcement,
      ariaLiveType = "assertive"
    } = _ref;
    const visuallyHidden = {
      position: "fixed",
      width: 1,
      height: 1,
      margin: -1,
      border: 0,
      padding: 0,
      overflow: "hidden",
      clip: "rect(0 0 0 0)",
      clipPath: "inset(100%)",
      whiteSpace: "nowrap"
    };
    return React__default.createElement("div", {
      id: id2,
      style: visuallyHidden,
      role: "status",
      "aria-live": ariaLiveType,
      "aria-atomic": true
    }, announcement);
  }
  function useAnnouncement() {
    const [announcement, setAnnouncement] = React__default.useState("");
    const announce = React__default.useCallback((value) => {
      if (value != null) {
        setAnnouncement(value);
      }
    }, []);
    return {
      announce,
      announcement
    };
  }
  const DndMonitorContext = /* @__PURE__ */ React__default.createContext(null);
  function useDndMonitor(listener) {
    const registerListener = React__default.useContext(DndMonitorContext);
    React__default.useEffect(() => {
      if (!registerListener) {
        throw new Error("useDndMonitor must be used within a children of <DndContext>");
      }
      const unsubscribe = registerListener(listener);
      return unsubscribe;
    }, [listener, registerListener]);
  }
  function useDndMonitorProvider() {
    const [listeners2] = React__default.useState(() => /* @__PURE__ */ new Set());
    const registerListener = React__default.useCallback((listener) => {
      listeners2.add(listener);
      return () => listeners2.delete(listener);
    }, [listeners2]);
    const dispatch = React__default.useCallback((_ref) => {
      let {
        type,
        event
      } = _ref;
      listeners2.forEach((listener) => {
        var _listener$type;
        return (_listener$type = listener[type]) == null ? void 0 : _listener$type.call(listener, event);
      });
    }, [listeners2]);
    return [dispatch, registerListener];
  }
  const defaultScreenReaderInstructions = {
    draggable: "\n    To pick up a draggable item, press the space bar.\n    While dragging, use the arrow keys to move the item.\n    Press space again to drop the item in its new position, or press escape to cancel.\n  "
  };
  const defaultAnnouncements = {
    onDragStart(_ref) {
      let {
        active
      } = _ref;
      return "Picked up draggable item " + active.id + ".";
    },
    onDragOver(_ref2) {
      let {
        active,
        over
      } = _ref2;
      if (over) {
        return "Draggable item " + active.id + " was moved over droppable area " + over.id + ".";
      }
      return "Draggable item " + active.id + " is no longer over a droppable area.";
    },
    onDragEnd(_ref3) {
      let {
        active,
        over
      } = _ref3;
      if (over) {
        return "Draggable item " + active.id + " was dropped over droppable area " + over.id;
      }
      return "Draggable item " + active.id + " was dropped.";
    },
    onDragCancel(_ref4) {
      let {
        active
      } = _ref4;
      return "Dragging was cancelled. Draggable item " + active.id + " was dropped.";
    }
  };
  function Accessibility(_ref) {
    let {
      announcements = defaultAnnouncements,
      container: container2,
      hiddenTextDescribedById,
      screenReaderInstructions = defaultScreenReaderInstructions
    } = _ref;
    const {
      announce,
      announcement
    } = useAnnouncement();
    const liveRegionId = useUniqueId("DndLiveRegion");
    const [mounted, setMounted] = React__default.useState(false);
    React__default.useEffect(() => {
      setMounted(true);
    }, []);
    useDndMonitor(React__default.useMemo(() => ({
      onDragStart(_ref2) {
        let {
          active
        } = _ref2;
        announce(announcements.onDragStart({
          active
        }));
      },
      onDragMove(_ref3) {
        let {
          active,
          over
        } = _ref3;
        if (announcements.onDragMove) {
          announce(announcements.onDragMove({
            active,
            over
          }));
        }
      },
      onDragOver(_ref4) {
        let {
          active,
          over
        } = _ref4;
        announce(announcements.onDragOver({
          active,
          over
        }));
      },
      onDragEnd(_ref5) {
        let {
          active,
          over
        } = _ref5;
        announce(announcements.onDragEnd({
          active,
          over
        }));
      },
      onDragCancel(_ref6) {
        let {
          active,
          over
        } = _ref6;
        announce(announcements.onDragCancel({
          active,
          over
        }));
      }
    }), [announce, announcements]));
    if (!mounted) {
      return null;
    }
    const markup = React__default.createElement(React__default.Fragment, null, React__default.createElement(HiddenText, {
      id: hiddenTextDescribedById,
      value: screenReaderInstructions.draggable
    }), React__default.createElement(LiveRegion, {
      id: liveRegionId,
      announcement
    }));
    return container2 ? require$$0.createPortal(markup, container2) : markup;
  }
  var Action;
  (function(Action2) {
    Action2["DragStart"] = "dragStart";
    Action2["DragMove"] = "dragMove";
    Action2["DragEnd"] = "dragEnd";
    Action2["DragCancel"] = "dragCancel";
    Action2["DragOver"] = "dragOver";
    Action2["RegisterDroppable"] = "registerDroppable";
    Action2["SetDroppableDisabled"] = "setDroppableDisabled";
    Action2["UnregisterDroppable"] = "unregisterDroppable";
  })(Action || (Action = {}));
  function noop$1() {
  }
  function useSensor(sensor, options) {
    return React__default.useMemo(
      () => ({
        sensor,
        options: options != null ? options : {}
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [sensor, options]
    );
  }
  function useSensors() {
    for (var _len = arguments.length, sensors = new Array(_len), _key = 0; _key < _len; _key++) {
      sensors[_key] = arguments[_key];
    }
    return React__default.useMemo(
      () => [...sensors].filter((sensor) => sensor != null),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...sensors]
    );
  }
  const defaultCoordinates = /* @__PURE__ */ Object.freeze({
    x: 0,
    y: 0
  });
  function distanceBetween(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
  function sortCollisionsAsc(_ref, _ref2) {
    let {
      data: {
        value: a2
      }
    } = _ref;
    let {
      data: {
        value: b2
      }
    } = _ref2;
    return a2 - b2;
  }
  function sortCollisionsDesc(_ref3, _ref4) {
    let {
      data: {
        value: a2
      }
    } = _ref3;
    let {
      data: {
        value: b2
      }
    } = _ref4;
    return b2 - a2;
  }
  function cornersOfRectangle(_ref5) {
    let {
      left,
      top,
      height,
      width
    } = _ref5;
    return [{
      x: left,
      y: top
    }, {
      x: left + width,
      y: top
    }, {
      x: left,
      y: top + height
    }, {
      x: left + width,
      y: top + height
    }];
  }
  function getFirstCollision(collisions, property) {
    if (!collisions || collisions.length === 0) {
      return null;
    }
    const [firstCollision] = collisions;
    return firstCollision[property];
  }
  const closestCorners = (_ref) => {
    let {
      collisionRect,
      droppableRects,
      droppableContainers
    } = _ref;
    const corners = cornersOfRectangle(collisionRect);
    const collisions = [];
    for (const droppableContainer of droppableContainers) {
      const {
        id: id2
      } = droppableContainer;
      const rect = droppableRects.get(id2);
      if (rect) {
        const rectCorners = cornersOfRectangle(rect);
        const distances = corners.reduce((accumulator, corner, index) => {
          return accumulator + distanceBetween(rectCorners[index], corner);
        }, 0);
        const effectiveDistance = Number((distances / 4).toFixed(4));
        collisions.push({
          id: id2,
          data: {
            droppableContainer,
            value: effectiveDistance
          }
        });
      }
    }
    return collisions.sort(sortCollisionsAsc);
  };
  function getIntersectionRatio(entry, target) {
    const top = Math.max(target.top, entry.top);
    const left = Math.max(target.left, entry.left);
    const right = Math.min(target.left + target.width, entry.left + entry.width);
    const bottom = Math.min(target.top + target.height, entry.top + entry.height);
    const width = right - left;
    const height = bottom - top;
    if (left < right && top < bottom) {
      const targetArea = target.width * target.height;
      const entryArea = entry.width * entry.height;
      const intersectionArea = width * height;
      const intersectionRatio = intersectionArea / (targetArea + entryArea - intersectionArea);
      return Number(intersectionRatio.toFixed(4));
    }
    return 0;
  }
  const rectIntersection = (_ref) => {
    let {
      collisionRect,
      droppableRects,
      droppableContainers
    } = _ref;
    const collisions = [];
    for (const droppableContainer of droppableContainers) {
      const {
        id: id2
      } = droppableContainer;
      const rect = droppableRects.get(id2);
      if (rect) {
        const intersectionRatio = getIntersectionRatio(rect, collisionRect);
        if (intersectionRatio > 0) {
          collisions.push({
            id: id2,
            data: {
              droppableContainer,
              value: intersectionRatio
            }
          });
        }
      }
    }
    return collisions.sort(sortCollisionsDesc);
  };
  function adjustScale(transform, rect1, rect2) {
    return {
      ...transform,
      scaleX: rect1 && rect2 ? rect1.width / rect2.width : 1,
      scaleY: rect1 && rect2 ? rect1.height / rect2.height : 1
    };
  }
  function getRectDelta(rect1, rect2) {
    return rect1 && rect2 ? {
      x: rect1.left - rect2.left,
      y: rect1.top - rect2.top
    } : defaultCoordinates;
  }
  function createRectAdjustmentFn(modifier) {
    return function adjustClientRect(rect) {
      for (var _len = arguments.length, adjustments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        adjustments[_key - 1] = arguments[_key];
      }
      return adjustments.reduce((acc, adjustment) => ({
        ...acc,
        top: acc.top + modifier * adjustment.y,
        bottom: acc.bottom + modifier * adjustment.y,
        left: acc.left + modifier * adjustment.x,
        right: acc.right + modifier * adjustment.x
      }), {
        ...rect
      });
    };
  }
  const getAdjustedRect = /* @__PURE__ */ createRectAdjustmentFn(1);
  function parseTransform(transform) {
    if (transform.startsWith("matrix3d(")) {
      const transformArray = transform.slice(9, -1).split(/, /);
      return {
        x: +transformArray[12],
        y: +transformArray[13],
        scaleX: +transformArray[0],
        scaleY: +transformArray[5]
      };
    } else if (transform.startsWith("matrix(")) {
      const transformArray = transform.slice(7, -1).split(/, /);
      return {
        x: +transformArray[4],
        y: +transformArray[5],
        scaleX: +transformArray[0],
        scaleY: +transformArray[3]
      };
    }
    return null;
  }
  function inverseTransform(rect, transform, transformOrigin) {
    const parsedTransform = parseTransform(transform);
    if (!parsedTransform) {
      return rect;
    }
    const {
      scaleX,
      scaleY,
      x: translateX,
      y: translateY
    } = parsedTransform;
    const x2 = rect.left - translateX - (1 - scaleX) * parseFloat(transformOrigin);
    const y2 = rect.top - translateY - (1 - scaleY) * parseFloat(transformOrigin.slice(transformOrigin.indexOf(" ") + 1));
    const w2 = scaleX ? rect.width / scaleX : rect.width;
    const h2 = scaleY ? rect.height / scaleY : rect.height;
    return {
      width: w2,
      height: h2,
      top: y2,
      right: x2 + w2,
      bottom: y2 + h2,
      left: x2
    };
  }
  const defaultOptions = {
    ignoreTransform: false
  };
  function getClientRect(element, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    let rect = element.getBoundingClientRect();
    if (options.ignoreTransform) {
      const {
        transform,
        transformOrigin
      } = getWindow(element).getComputedStyle(element);
      if (transform) {
        rect = inverseTransform(rect, transform, transformOrigin);
      }
    }
    const {
      top,
      left,
      width,
      height,
      bottom,
      right
    } = rect;
    return {
      top,
      left,
      width,
      height,
      bottom,
      right
    };
  }
  function getTransformAgnosticClientRect(element) {
    return getClientRect(element, {
      ignoreTransform: true
    });
  }
  function getWindowClientRect(element) {
    const width = element.innerWidth;
    const height = element.innerHeight;
    return {
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      width,
      height
    };
  }
  function isFixed(node2, computedStyle) {
    if (computedStyle === void 0) {
      computedStyle = getWindow(node2).getComputedStyle(node2);
    }
    return computedStyle.position === "fixed";
  }
  function isScrollable(element, computedStyle) {
    if (computedStyle === void 0) {
      computedStyle = getWindow(element).getComputedStyle(element);
    }
    const overflowRegex = /(auto|scroll|overlay)/;
    const properties2 = ["overflow", "overflowX", "overflowY"];
    return properties2.some((property) => {
      const value = computedStyle[property];
      return typeof value === "string" ? overflowRegex.test(value) : false;
    });
  }
  function getScrollableAncestors(element, limit2) {
    const scrollParents = [];
    function findScrollableAncestors(node2) {
      if (limit2 != null && scrollParents.length >= limit2) {
        return scrollParents;
      }
      if (!node2) {
        return scrollParents;
      }
      if (isDocument(node2) && node2.scrollingElement != null && !scrollParents.includes(node2.scrollingElement)) {
        scrollParents.push(node2.scrollingElement);
        return scrollParents;
      }
      if (!isHTMLElement(node2) || isSVGElement(node2)) {
        return scrollParents;
      }
      if (scrollParents.includes(node2)) {
        return scrollParents;
      }
      const computedStyle = getWindow(element).getComputedStyle(node2);
      if (node2 !== element) {
        if (isScrollable(node2, computedStyle)) {
          scrollParents.push(node2);
        }
      }
      if (isFixed(node2, computedStyle)) {
        return scrollParents;
      }
      return findScrollableAncestors(node2.parentNode);
    }
    if (!element) {
      return scrollParents;
    }
    return findScrollableAncestors(element);
  }
  function getFirstScrollableAncestor(node2) {
    const [firstScrollableAncestor] = getScrollableAncestors(node2, 1);
    return firstScrollableAncestor != null ? firstScrollableAncestor : null;
  }
  function getScrollableElement(element) {
    if (!canUseDOM || !element) {
      return null;
    }
    if (isWindow(element)) {
      return element;
    }
    if (!isNode(element)) {
      return null;
    }
    if (isDocument(element) || element === getOwnerDocument(element).scrollingElement) {
      return window;
    }
    if (isHTMLElement(element)) {
      return element;
    }
    return null;
  }
  function getScrollXCoordinate(element) {
    if (isWindow(element)) {
      return element.scrollX;
    }
    return element.scrollLeft;
  }
  function getScrollYCoordinate(element) {
    if (isWindow(element)) {
      return element.scrollY;
    }
    return element.scrollTop;
  }
  function getScrollCoordinates(element) {
    return {
      x: getScrollXCoordinate(element),
      y: getScrollYCoordinate(element)
    };
  }
  var Direction;
  (function(Direction2) {
    Direction2[Direction2["Forward"] = 1] = "Forward";
    Direction2[Direction2["Backward"] = -1] = "Backward";
  })(Direction || (Direction = {}));
  function isDocumentScrollingElement(element) {
    if (!canUseDOM || !element) {
      return false;
    }
    return element === document.scrollingElement;
  }
  function getScrollPosition(scrollingContainer) {
    const minScroll = {
      x: 0,
      y: 0
    };
    const dimensions = isDocumentScrollingElement(scrollingContainer) ? {
      height: window.innerHeight,
      width: window.innerWidth
    } : {
      height: scrollingContainer.clientHeight,
      width: scrollingContainer.clientWidth
    };
    const maxScroll = {
      x: scrollingContainer.scrollWidth - dimensions.width,
      y: scrollingContainer.scrollHeight - dimensions.height
    };
    const isTop = scrollingContainer.scrollTop <= minScroll.y;
    const isLeft = scrollingContainer.scrollLeft <= minScroll.x;
    const isBottom = scrollingContainer.scrollTop >= maxScroll.y;
    const isRight = scrollingContainer.scrollLeft >= maxScroll.x;
    return {
      isTop,
      isLeft,
      isBottom,
      isRight,
      maxScroll,
      minScroll
    };
  }
  const defaultThreshold = {
    x: 0.2,
    y: 0.2
  };
  function getScrollDirectionAndSpeed(scrollContainer, scrollContainerRect, _ref, acceleration, thresholdPercentage) {
    let {
      top,
      left,
      right,
      bottom
    } = _ref;
    if (acceleration === void 0) {
      acceleration = 10;
    }
    if (thresholdPercentage === void 0) {
      thresholdPercentage = defaultThreshold;
    }
    const {
      isTop,
      isBottom,
      isLeft,
      isRight
    } = getScrollPosition(scrollContainer);
    const direction = {
      x: 0,
      y: 0
    };
    const speed = {
      x: 0,
      y: 0
    };
    const threshold = {
      height: scrollContainerRect.height * thresholdPercentage.y,
      width: scrollContainerRect.width * thresholdPercentage.x
    };
    if (!isTop && top <= scrollContainerRect.top + threshold.height) {
      direction.y = Direction.Backward;
      speed.y = acceleration * Math.abs((scrollContainerRect.top + threshold.height - top) / threshold.height);
    } else if (!isBottom && bottom >= scrollContainerRect.bottom - threshold.height) {
      direction.y = Direction.Forward;
      speed.y = acceleration * Math.abs((scrollContainerRect.bottom - threshold.height - bottom) / threshold.height);
    }
    if (!isRight && right >= scrollContainerRect.right - threshold.width) {
      direction.x = Direction.Forward;
      speed.x = acceleration * Math.abs((scrollContainerRect.right - threshold.width - right) / threshold.width);
    } else if (!isLeft && left <= scrollContainerRect.left + threshold.width) {
      direction.x = Direction.Backward;
      speed.x = acceleration * Math.abs((scrollContainerRect.left + threshold.width - left) / threshold.width);
    }
    return {
      direction,
      speed
    };
  }
  function getScrollElementRect(element) {
    if (element === document.scrollingElement) {
      const {
        innerWidth,
        innerHeight
      } = window;
      return {
        top: 0,
        left: 0,
        right: innerWidth,
        bottom: innerHeight,
        width: innerWidth,
        height: innerHeight
      };
    }
    const {
      top,
      left,
      right,
      bottom
    } = element.getBoundingClientRect();
    return {
      top,
      left,
      right,
      bottom,
      width: element.clientWidth,
      height: element.clientHeight
    };
  }
  function getScrollOffsets(scrollableAncestors) {
    return scrollableAncestors.reduce((acc, node2) => {
      return add(acc, getScrollCoordinates(node2));
    }, defaultCoordinates);
  }
  function getScrollXOffset(scrollableAncestors) {
    return scrollableAncestors.reduce((acc, node2) => {
      return acc + getScrollXCoordinate(node2);
    }, 0);
  }
  function getScrollYOffset(scrollableAncestors) {
    return scrollableAncestors.reduce((acc, node2) => {
      return acc + getScrollYCoordinate(node2);
    }, 0);
  }
  function scrollIntoViewIfNeeded(element, measure) {
    if (measure === void 0) {
      measure = getClientRect;
    }
    if (!element) {
      return;
    }
    const {
      top,
      left,
      bottom,
      right
    } = measure(element);
    const firstScrollableAncestor = getFirstScrollableAncestor(element);
    if (!firstScrollableAncestor) {
      return;
    }
    if (bottom <= 0 || right <= 0 || top >= window.innerHeight || left >= window.innerWidth) {
      element.scrollIntoView({
        block: "center",
        inline: "center"
      });
    }
  }
  const properties = [["x", ["left", "right"], getScrollXOffset], ["y", ["top", "bottom"], getScrollYOffset]];
  class Rect {
    constructor(rect, element) {
      this.rect = void 0;
      this.width = void 0;
      this.height = void 0;
      this.top = void 0;
      this.bottom = void 0;
      this.right = void 0;
      this.left = void 0;
      const scrollableAncestors = getScrollableAncestors(element);
      const scrollOffsets = getScrollOffsets(scrollableAncestors);
      this.rect = {
        ...rect
      };
      this.width = rect.width;
      this.height = rect.height;
      for (const [axis, keys, getScrollOffset] of properties) {
        for (const key of keys) {
          Object.defineProperty(this, key, {
            get: () => {
              const currentOffsets = getScrollOffset(scrollableAncestors);
              const scrollOffsetsDeltla = scrollOffsets[axis] - currentOffsets;
              return this.rect[key] + scrollOffsetsDeltla;
            },
            enumerable: true
          });
        }
      }
      Object.defineProperty(this, "rect", {
        enumerable: false
      });
    }
  }
  class Listeners {
    constructor(target) {
      this.target = void 0;
      this.listeners = [];
      this.removeAll = () => {
        this.listeners.forEach((listener) => {
          var _this$target;
          return (_this$target = this.target) == null ? void 0 : _this$target.removeEventListener(...listener);
        });
      };
      this.target = target;
    }
    add(eventName, handler, options) {
      var _this$target2;
      (_this$target2 = this.target) == null ? void 0 : _this$target2.addEventListener(eventName, handler, options);
      this.listeners.push([eventName, handler, options]);
    }
  }
  function getEventListenerTarget(target) {
    const {
      EventTarget
    } = getWindow(target);
    return target instanceof EventTarget ? target : getOwnerDocument(target);
  }
  function hasExceededDistance(delta, measurement) {
    const dx = Math.abs(delta.x);
    const dy = Math.abs(delta.y);
    if (typeof measurement === "number") {
      return Math.sqrt(dx ** 2 + dy ** 2) > measurement;
    }
    if ("x" in measurement && "y" in measurement) {
      return dx > measurement.x && dy > measurement.y;
    }
    if ("x" in measurement) {
      return dx > measurement.x;
    }
    if ("y" in measurement) {
      return dy > measurement.y;
    }
    return false;
  }
  var EventName;
  (function(EventName2) {
    EventName2["Click"] = "click";
    EventName2["DragStart"] = "dragstart";
    EventName2["Keydown"] = "keydown";
    EventName2["ContextMenu"] = "contextmenu";
    EventName2["Resize"] = "resize";
    EventName2["SelectionChange"] = "selectionchange";
    EventName2["VisibilityChange"] = "visibilitychange";
  })(EventName || (EventName = {}));
  function preventDefault(event) {
    event.preventDefault();
  }
  function stopPropagation(event) {
    event.stopPropagation();
  }
  var KeyboardCode;
  (function(KeyboardCode2) {
    KeyboardCode2["Space"] = "Space";
    KeyboardCode2["Down"] = "ArrowDown";
    KeyboardCode2["Right"] = "ArrowRight";
    KeyboardCode2["Left"] = "ArrowLeft";
    KeyboardCode2["Up"] = "ArrowUp";
    KeyboardCode2["Esc"] = "Escape";
    KeyboardCode2["Enter"] = "Enter";
  })(KeyboardCode || (KeyboardCode = {}));
  const defaultKeyboardCodes = {
    start: [KeyboardCode.Space, KeyboardCode.Enter],
    cancel: [KeyboardCode.Esc],
    end: [KeyboardCode.Space, KeyboardCode.Enter]
  };
  const defaultKeyboardCoordinateGetter = (event, _ref) => {
    let {
      currentCoordinates
    } = _ref;
    switch (event.code) {
      case KeyboardCode.Right:
        return {
          ...currentCoordinates,
          x: currentCoordinates.x + 25
        };
      case KeyboardCode.Left:
        return {
          ...currentCoordinates,
          x: currentCoordinates.x - 25
        };
      case KeyboardCode.Down:
        return {
          ...currentCoordinates,
          y: currentCoordinates.y + 25
        };
      case KeyboardCode.Up:
        return {
          ...currentCoordinates,
          y: currentCoordinates.y - 25
        };
    }
    return void 0;
  };
  class KeyboardSensor {
    constructor(props) {
      this.props = void 0;
      this.autoScrollEnabled = false;
      this.referenceCoordinates = void 0;
      this.listeners = void 0;
      this.windowListeners = void 0;
      this.props = props;
      const {
        event: {
          target
        }
      } = props;
      this.props = props;
      this.listeners = new Listeners(getOwnerDocument(target));
      this.windowListeners = new Listeners(getWindow(target));
      this.handleKeyDown = this.handleKeyDown.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.attach();
    }
    attach() {
      this.handleStart();
      this.windowListeners.add(EventName.Resize, this.handleCancel);
      this.windowListeners.add(EventName.VisibilityChange, this.handleCancel);
      setTimeout(() => this.listeners.add(EventName.Keydown, this.handleKeyDown));
    }
    handleStart() {
      const {
        activeNode,
        onStart
      } = this.props;
      const node2 = activeNode.node.current;
      if (node2) {
        scrollIntoViewIfNeeded(node2);
      }
      onStart(defaultCoordinates);
    }
    handleKeyDown(event) {
      if (isKeyboardEvent(event)) {
        const {
          active,
          context,
          options
        } = this.props;
        const {
          keyboardCodes = defaultKeyboardCodes,
          coordinateGetter = defaultKeyboardCoordinateGetter,
          scrollBehavior = "smooth"
        } = options;
        const {
          code
        } = event;
        if (keyboardCodes.end.includes(code)) {
          this.handleEnd(event);
          return;
        }
        if (keyboardCodes.cancel.includes(code)) {
          this.handleCancel(event);
          return;
        }
        const {
          collisionRect
        } = context.current;
        const currentCoordinates = collisionRect ? {
          x: collisionRect.left,
          y: collisionRect.top
        } : defaultCoordinates;
        if (!this.referenceCoordinates) {
          this.referenceCoordinates = currentCoordinates;
        }
        const newCoordinates = coordinateGetter(event, {
          active,
          context: context.current,
          currentCoordinates
        });
        if (newCoordinates) {
          const coordinatesDelta = subtract(newCoordinates, currentCoordinates);
          const scrollDelta = {
            x: 0,
            y: 0
          };
          const {
            scrollableAncestors
          } = context.current;
          for (const scrollContainer of scrollableAncestors) {
            const direction = event.code;
            const {
              isTop,
              isRight,
              isLeft,
              isBottom,
              maxScroll,
              minScroll
            } = getScrollPosition(scrollContainer);
            const scrollElementRect = getScrollElementRect(scrollContainer);
            const clampedCoordinates = {
              x: Math.min(direction === KeyboardCode.Right ? scrollElementRect.right - scrollElementRect.width / 2 : scrollElementRect.right, Math.max(direction === KeyboardCode.Right ? scrollElementRect.left : scrollElementRect.left + scrollElementRect.width / 2, newCoordinates.x)),
              y: Math.min(direction === KeyboardCode.Down ? scrollElementRect.bottom - scrollElementRect.height / 2 : scrollElementRect.bottom, Math.max(direction === KeyboardCode.Down ? scrollElementRect.top : scrollElementRect.top + scrollElementRect.height / 2, newCoordinates.y))
            };
            const canScrollX = direction === KeyboardCode.Right && !isRight || direction === KeyboardCode.Left && !isLeft;
            const canScrollY = direction === KeyboardCode.Down && !isBottom || direction === KeyboardCode.Up && !isTop;
            if (canScrollX && clampedCoordinates.x !== newCoordinates.x) {
              const newScrollCoordinates = scrollContainer.scrollLeft + coordinatesDelta.x;
              const canScrollToNewCoordinates = direction === KeyboardCode.Right && newScrollCoordinates <= maxScroll.x || direction === KeyboardCode.Left && newScrollCoordinates >= minScroll.x;
              if (canScrollToNewCoordinates && !coordinatesDelta.y) {
                scrollContainer.scrollTo({
                  left: newScrollCoordinates,
                  behavior: scrollBehavior
                });
                return;
              }
              if (canScrollToNewCoordinates) {
                scrollDelta.x = scrollContainer.scrollLeft - newScrollCoordinates;
              } else {
                scrollDelta.x = direction === KeyboardCode.Right ? scrollContainer.scrollLeft - maxScroll.x : scrollContainer.scrollLeft - minScroll.x;
              }
              if (scrollDelta.x) {
                scrollContainer.scrollBy({
                  left: -scrollDelta.x,
                  behavior: scrollBehavior
                });
              }
              break;
            } else if (canScrollY && clampedCoordinates.y !== newCoordinates.y) {
              const newScrollCoordinates = scrollContainer.scrollTop + coordinatesDelta.y;
              const canScrollToNewCoordinates = direction === KeyboardCode.Down && newScrollCoordinates <= maxScroll.y || direction === KeyboardCode.Up && newScrollCoordinates >= minScroll.y;
              if (canScrollToNewCoordinates && !coordinatesDelta.x) {
                scrollContainer.scrollTo({
                  top: newScrollCoordinates,
                  behavior: scrollBehavior
                });
                return;
              }
              if (canScrollToNewCoordinates) {
                scrollDelta.y = scrollContainer.scrollTop - newScrollCoordinates;
              } else {
                scrollDelta.y = direction === KeyboardCode.Down ? scrollContainer.scrollTop - maxScroll.y : scrollContainer.scrollTop - minScroll.y;
              }
              if (scrollDelta.y) {
                scrollContainer.scrollBy({
                  top: -scrollDelta.y,
                  behavior: scrollBehavior
                });
              }
              break;
            }
          }
          this.handleMove(event, add(subtract(newCoordinates, this.referenceCoordinates), scrollDelta));
        }
      }
    }
    handleMove(event, coordinates) {
      const {
        onMove
      } = this.props;
      event.preventDefault();
      onMove(coordinates);
    }
    handleEnd(event) {
      const {
        onEnd
      } = this.props;
      event.preventDefault();
      this.detach();
      onEnd();
    }
    handleCancel(event) {
      const {
        onCancel
      } = this.props;
      event.preventDefault();
      this.detach();
      onCancel();
    }
    detach() {
      this.listeners.removeAll();
      this.windowListeners.removeAll();
    }
  }
  KeyboardSensor.activators = [{
    eventName: "onKeyDown",
    handler: (event, _ref, _ref2) => {
      let {
        keyboardCodes = defaultKeyboardCodes,
        onActivation
      } = _ref;
      let {
        active
      } = _ref2;
      const {
        code
      } = event.nativeEvent;
      if (keyboardCodes.start.includes(code)) {
        const activator = active.activatorNode.current;
        if (activator && event.target !== activator) {
          return false;
        }
        event.preventDefault();
        onActivation == null ? void 0 : onActivation({
          event: event.nativeEvent
        });
        return true;
      }
      return false;
    }
  }];
  function isDistanceConstraint(constraint) {
    return Boolean(constraint && "distance" in constraint);
  }
  function isDelayConstraint(constraint) {
    return Boolean(constraint && "delay" in constraint);
  }
  class AbstractPointerSensor {
    constructor(props, events2, listenerTarget) {
      var _getEventCoordinates;
      if (listenerTarget === void 0) {
        listenerTarget = getEventListenerTarget(props.event.target);
      }
      this.props = void 0;
      this.events = void 0;
      this.autoScrollEnabled = true;
      this.document = void 0;
      this.activated = false;
      this.initialCoordinates = void 0;
      this.timeoutId = null;
      this.listeners = void 0;
      this.documentListeners = void 0;
      this.windowListeners = void 0;
      this.props = props;
      this.events = events2;
      const {
        event
      } = props;
      const {
        target
      } = event;
      this.props = props;
      this.events = events2;
      this.document = getOwnerDocument(target);
      this.documentListeners = new Listeners(this.document);
      this.listeners = new Listeners(listenerTarget);
      this.windowListeners = new Listeners(getWindow(target));
      this.initialCoordinates = (_getEventCoordinates = getEventCoordinates(event)) != null ? _getEventCoordinates : defaultCoordinates;
      this.handleStart = this.handleStart.bind(this);
      this.handleMove = this.handleMove.bind(this);
      this.handleEnd = this.handleEnd.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.handleKeydown = this.handleKeydown.bind(this);
      this.removeTextSelection = this.removeTextSelection.bind(this);
      this.attach();
    }
    attach() {
      const {
        events: events2,
        props: {
          options: {
            activationConstraint,
            bypassActivationConstraint
          }
        }
      } = this;
      this.listeners.add(events2.move.name, this.handleMove, {
        passive: false
      });
      this.listeners.add(events2.end.name, this.handleEnd);
      this.windowListeners.add(EventName.Resize, this.handleCancel);
      this.windowListeners.add(EventName.DragStart, preventDefault);
      this.windowListeners.add(EventName.VisibilityChange, this.handleCancel);
      this.windowListeners.add(EventName.ContextMenu, preventDefault);
      this.documentListeners.add(EventName.Keydown, this.handleKeydown);
      if (activationConstraint) {
        if (bypassActivationConstraint != null && bypassActivationConstraint({
          event: this.props.event,
          activeNode: this.props.activeNode,
          options: this.props.options
        })) {
          return this.handleStart();
        }
        if (isDelayConstraint(activationConstraint)) {
          this.timeoutId = setTimeout(this.handleStart, activationConstraint.delay);
          return;
        }
        if (isDistanceConstraint(activationConstraint)) {
          return;
        }
      }
      this.handleStart();
    }
    detach() {
      this.listeners.removeAll();
      this.windowListeners.removeAll();
      setTimeout(this.documentListeners.removeAll, 50);
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
    handleStart() {
      const {
        initialCoordinates
      } = this;
      const {
        onStart
      } = this.props;
      if (initialCoordinates) {
        this.activated = true;
        this.documentListeners.add(EventName.Click, stopPropagation, {
          capture: true
        });
        this.removeTextSelection();
        this.documentListeners.add(EventName.SelectionChange, this.removeTextSelection);
        onStart(initialCoordinates);
      }
    }
    handleMove(event) {
      var _getEventCoordinates2;
      const {
        activated,
        initialCoordinates,
        props
      } = this;
      const {
        onMove,
        options: {
          activationConstraint
        }
      } = props;
      if (!initialCoordinates) {
        return;
      }
      const coordinates = (_getEventCoordinates2 = getEventCoordinates(event)) != null ? _getEventCoordinates2 : defaultCoordinates;
      const delta = subtract(initialCoordinates, coordinates);
      if (!activated && activationConstraint) {
        if (isDistanceConstraint(activationConstraint)) {
          if (activationConstraint.tolerance != null && hasExceededDistance(delta, activationConstraint.tolerance)) {
            return this.handleCancel();
          }
          if (hasExceededDistance(delta, activationConstraint.distance)) {
            return this.handleStart();
          }
        }
        if (isDelayConstraint(activationConstraint)) {
          if (hasExceededDistance(delta, activationConstraint.tolerance)) {
            return this.handleCancel();
          }
        }
        return;
      }
      if (event.cancelable) {
        event.preventDefault();
      }
      onMove(coordinates);
    }
    handleEnd() {
      const {
        onEnd
      } = this.props;
      this.detach();
      onEnd();
    }
    handleCancel() {
      const {
        onCancel
      } = this.props;
      this.detach();
      onCancel();
    }
    handleKeydown(event) {
      if (event.code === KeyboardCode.Esc) {
        this.handleCancel();
      }
    }
    removeTextSelection() {
      var _this$document$getSel;
      (_this$document$getSel = this.document.getSelection()) == null ? void 0 : _this$document$getSel.removeAllRanges();
    }
  }
  const events = {
    move: {
      name: "pointermove"
    },
    end: {
      name: "pointerup"
    }
  };
  class PointerSensor extends AbstractPointerSensor {
    constructor(props) {
      const {
        event
      } = props;
      const listenerTarget = getOwnerDocument(event.target);
      super(props, events, listenerTarget);
    }
  }
  PointerSensor.activators = [{
    eventName: "onPointerDown",
    handler: (_ref, _ref2) => {
      let {
        nativeEvent: event
      } = _ref;
      let {
        onActivation
      } = _ref2;
      if (!event.isPrimary || event.button !== 0) {
        return false;
      }
      onActivation == null ? void 0 : onActivation({
        event
      });
      return true;
    }
  }];
  const events$1 = {
    move: {
      name: "mousemove"
    },
    end: {
      name: "mouseup"
    }
  };
  var MouseButton;
  (function(MouseButton2) {
    MouseButton2[MouseButton2["RightClick"] = 2] = "RightClick";
  })(MouseButton || (MouseButton = {}));
  class MouseSensor extends AbstractPointerSensor {
    constructor(props) {
      super(props, events$1, getOwnerDocument(props.event.target));
    }
  }
  MouseSensor.activators = [{
    eventName: "onMouseDown",
    handler: (_ref, _ref2) => {
      let {
        nativeEvent: event
      } = _ref;
      let {
        onActivation
      } = _ref2;
      if (event.button === MouseButton.RightClick) {
        return false;
      }
      onActivation == null ? void 0 : onActivation({
        event
      });
      return true;
    }
  }];
  const events$2 = {
    move: {
      name: "touchmove"
    },
    end: {
      name: "touchend"
    }
  };
  class TouchSensor extends AbstractPointerSensor {
    constructor(props) {
      super(props, events$2);
    }
    static setup() {
      window.addEventListener(events$2.move.name, noop2, {
        capture: false,
        passive: false
      });
      return function teardown() {
        window.removeEventListener(events$2.move.name, noop2);
      };
      function noop2() {
      }
    }
  }
  TouchSensor.activators = [{
    eventName: "onTouchStart",
    handler: (_ref, _ref2) => {
      let {
        nativeEvent: event
      } = _ref;
      let {
        onActivation
      } = _ref2;
      const {
        touches
      } = event;
      if (touches.length > 1) {
        return false;
      }
      onActivation == null ? void 0 : onActivation({
        event
      });
      return true;
    }
  }];
  var AutoScrollActivator;
  (function(AutoScrollActivator2) {
    AutoScrollActivator2[AutoScrollActivator2["Pointer"] = 0] = "Pointer";
    AutoScrollActivator2[AutoScrollActivator2["DraggableRect"] = 1] = "DraggableRect";
  })(AutoScrollActivator || (AutoScrollActivator = {}));
  var TraversalOrder;
  (function(TraversalOrder2) {
    TraversalOrder2[TraversalOrder2["TreeOrder"] = 0] = "TreeOrder";
    TraversalOrder2[TraversalOrder2["ReversedTreeOrder"] = 1] = "ReversedTreeOrder";
  })(TraversalOrder || (TraversalOrder = {}));
  function useAutoScroller(_ref) {
    let {
      acceleration,
      activator = AutoScrollActivator.Pointer,
      canScroll,
      draggingRect,
      enabled,
      interval = 5,
      order = TraversalOrder.TreeOrder,
      pointerCoordinates,
      scrollableAncestors,
      scrollableAncestorRects,
      delta,
      threshold
    } = _ref;
    const scrollIntent = useScrollIntent({
      delta,
      disabled: !enabled
    });
    const [setAutoScrollInterval, clearAutoScrollInterval] = useInterval();
    const scrollSpeed = React__default.useRef({
      x: 0,
      y: 0
    });
    const scrollDirection = React__default.useRef({
      x: 0,
      y: 0
    });
    const rect = React__default.useMemo(() => {
      switch (activator) {
        case AutoScrollActivator.Pointer:
          return pointerCoordinates ? {
            top: pointerCoordinates.y,
            bottom: pointerCoordinates.y,
            left: pointerCoordinates.x,
            right: pointerCoordinates.x
          } : null;
        case AutoScrollActivator.DraggableRect:
          return draggingRect;
      }
    }, [activator, draggingRect, pointerCoordinates]);
    const scrollContainerRef = React__default.useRef(null);
    const autoScroll = React__default.useCallback(() => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) {
        return;
      }
      const scrollLeft = scrollSpeed.current.x * scrollDirection.current.x;
      const scrollTop = scrollSpeed.current.y * scrollDirection.current.y;
      scrollContainer.scrollBy(scrollLeft, scrollTop);
    }, []);
    const sortedScrollableAncestors = React__default.useMemo(() => order === TraversalOrder.TreeOrder ? [...scrollableAncestors].reverse() : scrollableAncestors, [order, scrollableAncestors]);
    React__default.useEffect(
      () => {
        if (!enabled || !scrollableAncestors.length || !rect) {
          clearAutoScrollInterval();
          return;
        }
        for (const scrollContainer of sortedScrollableAncestors) {
          if ((canScroll == null ? void 0 : canScroll(scrollContainer)) === false) {
            continue;
          }
          const index = scrollableAncestors.indexOf(scrollContainer);
          const scrollContainerRect = scrollableAncestorRects[index];
          if (!scrollContainerRect) {
            continue;
          }
          const {
            direction,
            speed
          } = getScrollDirectionAndSpeed(scrollContainer, scrollContainerRect, rect, acceleration, threshold);
          for (const axis of ["x", "y"]) {
            if (!scrollIntent[axis][direction[axis]]) {
              speed[axis] = 0;
              direction[axis] = 0;
            }
          }
          if (speed.x > 0 || speed.y > 0) {
            clearAutoScrollInterval();
            scrollContainerRef.current = scrollContainer;
            setAutoScrollInterval(autoScroll, interval);
            scrollSpeed.current = speed;
            scrollDirection.current = direction;
            return;
          }
        }
        scrollSpeed.current = {
          x: 0,
          y: 0
        };
        scrollDirection.current = {
          x: 0,
          y: 0
        };
        clearAutoScrollInterval();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        acceleration,
        autoScroll,
        canScroll,
        clearAutoScrollInterval,
        enabled,
        interval,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(rect),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(scrollIntent),
        setAutoScrollInterval,
        scrollableAncestors,
        sortedScrollableAncestors,
        scrollableAncestorRects,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(threshold)
      ]
    );
  }
  const defaultScrollIntent = {
    x: {
      [Direction.Backward]: false,
      [Direction.Forward]: false
    },
    y: {
      [Direction.Backward]: false,
      [Direction.Forward]: false
    }
  };
  function useScrollIntent(_ref2) {
    let {
      delta,
      disabled
    } = _ref2;
    const previousDelta = usePrevious(delta);
    return useLazyMemo((previousIntent) => {
      if (disabled || !previousDelta || !previousIntent) {
        return defaultScrollIntent;
      }
      const direction = {
        x: Math.sign(delta.x - previousDelta.x),
        y: Math.sign(delta.y - previousDelta.y)
      };
      return {
        x: {
          [Direction.Backward]: previousIntent.x[Direction.Backward] || direction.x === -1,
          [Direction.Forward]: previousIntent.x[Direction.Forward] || direction.x === 1
        },
        y: {
          [Direction.Backward]: previousIntent.y[Direction.Backward] || direction.y === -1,
          [Direction.Forward]: previousIntent.y[Direction.Forward] || direction.y === 1
        }
      };
    }, [disabled, delta, previousDelta]);
  }
  function useCachedNode(draggableNodes, id2) {
    const draggableNode = id2 !== null ? draggableNodes.get(id2) : void 0;
    const node2 = draggableNode ? draggableNode.node.current : null;
    return useLazyMemo((cachedNode) => {
      var _ref;
      if (id2 === null) {
        return null;
      }
      return (_ref = node2 != null ? node2 : cachedNode) != null ? _ref : null;
    }, [node2, id2]);
  }
  function useCombineActivators(sensors, getSyntheticHandler) {
    return React__default.useMemo(() => sensors.reduce((accumulator, sensor) => {
      const {
        sensor: Sensor
      } = sensor;
      const sensorActivators = Sensor.activators.map((activator) => ({
        eventName: activator.eventName,
        handler: getSyntheticHandler(activator.handler, sensor)
      }));
      return [...accumulator, ...sensorActivators];
    }, []), [sensors, getSyntheticHandler]);
  }
  var MeasuringStrategy;
  (function(MeasuringStrategy2) {
    MeasuringStrategy2[MeasuringStrategy2["Always"] = 0] = "Always";
    MeasuringStrategy2[MeasuringStrategy2["BeforeDragging"] = 1] = "BeforeDragging";
    MeasuringStrategy2[MeasuringStrategy2["WhileDragging"] = 2] = "WhileDragging";
  })(MeasuringStrategy || (MeasuringStrategy = {}));
  var MeasuringFrequency;
  (function(MeasuringFrequency2) {
    MeasuringFrequency2["Optimized"] = "optimized";
  })(MeasuringFrequency || (MeasuringFrequency = {}));
  const defaultValue = /* @__PURE__ */ new Map();
  function useDroppableMeasuring(containers, _ref) {
    let {
      dragging,
      dependencies,
      config
    } = _ref;
    const [queue, setQueue] = React__default.useState(null);
    const {
      frequency,
      measure,
      strategy
    } = config;
    const containersRef = React__default.useRef(containers);
    const disabled = isDisabled();
    const disabledRef = useLatestValue(disabled);
    const measureDroppableContainers = React__default.useCallback(function(ids2) {
      if (ids2 === void 0) {
        ids2 = [];
      }
      if (disabledRef.current) {
        return;
      }
      setQueue((value) => {
        if (value === null) {
          return ids2;
        }
        return value.concat(ids2.filter((id2) => !value.includes(id2)));
      });
    }, [disabledRef]);
    const timeoutId = React__default.useRef(null);
    const droppableRects = useLazyMemo((previousValue) => {
      if (disabled && !dragging) {
        return defaultValue;
      }
      if (!previousValue || previousValue === defaultValue || containersRef.current !== containers || queue != null) {
        const map2 = /* @__PURE__ */ new Map();
        for (let container2 of containers) {
          if (!container2) {
            continue;
          }
          if (queue && queue.length > 0 && !queue.includes(container2.id) && container2.rect.current) {
            map2.set(container2.id, container2.rect.current);
            continue;
          }
          const node2 = container2.node.current;
          const rect = node2 ? new Rect(measure(node2), node2) : null;
          container2.rect.current = rect;
          if (rect) {
            map2.set(container2.id, rect);
          }
        }
        return map2;
      }
      return previousValue;
    }, [containers, queue, dragging, disabled, measure]);
    React__default.useEffect(() => {
      containersRef.current = containers;
    }, [containers]);
    React__default.useEffect(
      () => {
        if (disabled) {
          return;
        }
        measureDroppableContainers();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [dragging, disabled]
    );
    React__default.useEffect(
      () => {
        if (queue && queue.length > 0) {
          setQueue(null);
        }
      },
      //eslint-disable-next-line react-hooks/exhaustive-deps
      [JSON.stringify(queue)]
    );
    React__default.useEffect(
      () => {
        if (disabled || typeof frequency !== "number" || timeoutId.current !== null) {
          return;
        }
        timeoutId.current = setTimeout(() => {
          measureDroppableContainers();
          timeoutId.current = null;
        }, frequency);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [frequency, disabled, measureDroppableContainers, ...dependencies]
    );
    return {
      droppableRects,
      measureDroppableContainers,
      measuringScheduled: queue != null
    };
    function isDisabled() {
      switch (strategy) {
        case MeasuringStrategy.Always:
          return false;
        case MeasuringStrategy.BeforeDragging:
          return dragging;
        default:
          return !dragging;
      }
    }
  }
  function useInitialValue(value, computeFn) {
    return useLazyMemo((previousValue) => {
      if (!value) {
        return null;
      }
      if (previousValue) {
        return previousValue;
      }
      return typeof computeFn === "function" ? computeFn(value) : value;
    }, [computeFn, value]);
  }
  function useInitialRect(node2, measure) {
    return useInitialValue(node2, measure);
  }
  function useMutationObserver(_ref) {
    let {
      callback,
      disabled
    } = _ref;
    const handleMutations = useEvent(callback);
    const mutationObserver = React__default.useMemo(() => {
      if (disabled || typeof window === "undefined" || typeof window.MutationObserver === "undefined") {
        return void 0;
      }
      const {
        MutationObserver: MutationObserver2
      } = window;
      return new MutationObserver2(handleMutations);
    }, [handleMutations, disabled]);
    React__default.useEffect(() => {
      return () => mutationObserver == null ? void 0 : mutationObserver.disconnect();
    }, [mutationObserver]);
    return mutationObserver;
  }
  function useResizeObserver(_ref) {
    let {
      callback,
      disabled
    } = _ref;
    const handleResize = useEvent(callback);
    const resizeObserver = React__default.useMemo(
      () => {
        if (disabled || typeof window === "undefined" || typeof window.ResizeObserver === "undefined") {
          return void 0;
        }
        const {
          ResizeObserver: ResizeObserver2
        } = window;
        return new ResizeObserver2(handleResize);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [disabled]
    );
    React__default.useEffect(() => {
      return () => resizeObserver == null ? void 0 : resizeObserver.disconnect();
    }, [resizeObserver]);
    return resizeObserver;
  }
  function defaultMeasure(element) {
    return new Rect(getClientRect(element), element);
  }
  function useRect(element, measure, fallbackRect) {
    if (measure === void 0) {
      measure = defaultMeasure;
    }
    const [rect, measureRect] = React__default.useReducer(reducer2, null);
    const mutationObserver = useMutationObserver({
      callback(records) {
        if (!element) {
          return;
        }
        for (const record of records) {
          const {
            type,
            target
          } = record;
          if (type === "childList" && target instanceof HTMLElement && target.contains(element)) {
            measureRect();
            break;
          }
        }
      }
    });
    const resizeObserver = useResizeObserver({
      callback: measureRect
    });
    useIsomorphicLayoutEffect$3(() => {
      measureRect();
      if (element) {
        resizeObserver == null ? void 0 : resizeObserver.observe(element);
        mutationObserver == null ? void 0 : mutationObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
      } else {
        resizeObserver == null ? void 0 : resizeObserver.disconnect();
        mutationObserver == null ? void 0 : mutationObserver.disconnect();
      }
    }, [element]);
    return rect;
    function reducer2(currentRect) {
      if (!element) {
        return null;
      }
      if (element.isConnected === false) {
        var _ref;
        return (_ref = currentRect != null ? currentRect : fallbackRect) != null ? _ref : null;
      }
      const newRect = measure(element);
      if (JSON.stringify(currentRect) === JSON.stringify(newRect)) {
        return currentRect;
      }
      return newRect;
    }
  }
  function useRectDelta(rect) {
    const initialRect = useInitialValue(rect);
    return getRectDelta(rect, initialRect);
  }
  const defaultValue$1 = [];
  function useScrollableAncestors(node2) {
    const previousNode = React__default.useRef(node2);
    const ancestors = useLazyMemo((previousValue) => {
      if (!node2) {
        return defaultValue$1;
      }
      if (previousValue && previousValue !== defaultValue$1 && node2 && previousNode.current && node2.parentNode === previousNode.current.parentNode) {
        return previousValue;
      }
      return getScrollableAncestors(node2);
    }, [node2]);
    React__default.useEffect(() => {
      previousNode.current = node2;
    }, [node2]);
    return ancestors;
  }
  function useScrollOffsets(elements) {
    const [scrollCoordinates, setScrollCoordinates] = React__default.useState(null);
    const prevElements = React__default.useRef(elements);
    const handleScroll = React__default.useCallback((event) => {
      const scrollingElement = getScrollableElement(event.target);
      if (!scrollingElement) {
        return;
      }
      setScrollCoordinates((scrollCoordinates2) => {
        if (!scrollCoordinates2) {
          return null;
        }
        scrollCoordinates2.set(scrollingElement, getScrollCoordinates(scrollingElement));
        return new Map(scrollCoordinates2);
      });
    }, []);
    React__default.useEffect(() => {
      const previousElements = prevElements.current;
      if (elements !== previousElements) {
        cleanup(previousElements);
        const entries = elements.map((element) => {
          const scrollableElement = getScrollableElement(element);
          if (scrollableElement) {
            scrollableElement.addEventListener("scroll", handleScroll, {
              passive: true
            });
            return [scrollableElement, getScrollCoordinates(scrollableElement)];
          }
          return null;
        }).filter((entry) => entry != null);
        setScrollCoordinates(entries.length ? new Map(entries) : null);
        prevElements.current = elements;
      }
      return () => {
        cleanup(elements);
        cleanup(previousElements);
      };
      function cleanup(elements2) {
        elements2.forEach((element) => {
          const scrollableElement = getScrollableElement(element);
          scrollableElement == null ? void 0 : scrollableElement.removeEventListener("scroll", handleScroll);
        });
      }
    }, [handleScroll, elements]);
    return React__default.useMemo(() => {
      if (elements.length) {
        return scrollCoordinates ? Array.from(scrollCoordinates.values()).reduce((acc, coordinates) => add(acc, coordinates), defaultCoordinates) : getScrollOffsets(elements);
      }
      return defaultCoordinates;
    }, [elements, scrollCoordinates]);
  }
  function useScrollOffsetsDelta(scrollOffsets, dependencies) {
    if (dependencies === void 0) {
      dependencies = [];
    }
    const initialScrollOffsets = React__default.useRef(null);
    React__default.useEffect(
      () => {
        initialScrollOffsets.current = null;
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      dependencies
    );
    React__default.useEffect(() => {
      const hasScrollOffsets = scrollOffsets !== defaultCoordinates;
      if (hasScrollOffsets && !initialScrollOffsets.current) {
        initialScrollOffsets.current = scrollOffsets;
      }
      if (!hasScrollOffsets && initialScrollOffsets.current) {
        initialScrollOffsets.current = null;
      }
    }, [scrollOffsets]);
    return initialScrollOffsets.current ? subtract(scrollOffsets, initialScrollOffsets.current) : defaultCoordinates;
  }
  function useSensorSetup(sensors) {
    React__default.useEffect(
      () => {
        if (!canUseDOM) {
          return;
        }
        const teardownFns = sensors.map((_ref) => {
          let {
            sensor
          } = _ref;
          return sensor.setup == null ? void 0 : sensor.setup();
        });
        return () => {
          for (const teardown of teardownFns) {
            teardown == null ? void 0 : teardown();
          }
        };
      },
      // TO-DO: Sensors length could theoretically change which would not be a valid dependency
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sensors.map((_ref2) => {
        let {
          sensor
        } = _ref2;
        return sensor;
      })
    );
  }
  function useSyntheticListeners(listeners2, id2) {
    return React__default.useMemo(() => {
      return listeners2.reduce((acc, _ref) => {
        let {
          eventName,
          handler
        } = _ref;
        acc[eventName] = (event) => {
          handler(event, id2);
        };
        return acc;
      }, {});
    }, [listeners2, id2]);
  }
  function useWindowRect(element) {
    return React__default.useMemo(() => element ? getWindowClientRect(element) : null, [element]);
  }
  const defaultValue$2 = [];
  function useRects(elements, measure) {
    if (measure === void 0) {
      measure = getClientRect;
    }
    const [firstElement] = elements;
    const windowRect = useWindowRect(firstElement ? getWindow(firstElement) : null);
    const [rects, measureRects] = React__default.useReducer(reducer2, defaultValue$2);
    const resizeObserver = useResizeObserver({
      callback: measureRects
    });
    if (elements.length > 0 && rects === defaultValue$2) {
      measureRects();
    }
    useIsomorphicLayoutEffect$3(() => {
      if (elements.length) {
        elements.forEach((element) => resizeObserver == null ? void 0 : resizeObserver.observe(element));
      } else {
        resizeObserver == null ? void 0 : resizeObserver.disconnect();
        measureRects();
      }
    }, [elements]);
    return rects;
    function reducer2() {
      if (!elements.length) {
        return defaultValue$2;
      }
      return elements.map((element) => isDocumentScrollingElement(element) ? windowRect : new Rect(measure(element), element));
    }
  }
  function getMeasurableNode(node2) {
    if (!node2) {
      return null;
    }
    if (node2.children.length > 1) {
      return node2;
    }
    const firstChild = node2.children[0];
    return isHTMLElement(firstChild) ? firstChild : node2;
  }
  function useDragOverlayMeasuring(_ref) {
    let {
      measure
    } = _ref;
    const [rect, setRect] = React__default.useState(null);
    const handleResize = React__default.useCallback((entries) => {
      for (const {
        target
      } of entries) {
        if (isHTMLElement(target)) {
          setRect((rect2) => {
            const newRect = measure(target);
            return rect2 ? {
              ...rect2,
              width: newRect.width,
              height: newRect.height
            } : newRect;
          });
          break;
        }
      }
    }, [measure]);
    const resizeObserver = useResizeObserver({
      callback: handleResize
    });
    const handleNodeChange = React__default.useCallback((element) => {
      const node2 = getMeasurableNode(element);
      resizeObserver == null ? void 0 : resizeObserver.disconnect();
      if (node2) {
        resizeObserver == null ? void 0 : resizeObserver.observe(node2);
      }
      setRect(node2 ? measure(node2) : null);
    }, [measure, resizeObserver]);
    const [nodeRef, setRef] = useNodeRef(handleNodeChange);
    return React__default.useMemo(() => ({
      nodeRef,
      rect,
      setRef
    }), [rect, nodeRef, setRef]);
  }
  const defaultSensors = [{
    sensor: PointerSensor,
    options: {}
  }, {
    sensor: KeyboardSensor,
    options: {}
  }];
  const defaultData = {
    current: {}
  };
  const defaultMeasuringConfiguration = {
    draggable: {
      measure: getTransformAgnosticClientRect
    },
    droppable: {
      measure: getTransformAgnosticClientRect,
      strategy: MeasuringStrategy.WhileDragging,
      frequency: MeasuringFrequency.Optimized
    },
    dragOverlay: {
      measure: getClientRect
    }
  };
  class DroppableContainersMap extends Map {
    get(id2) {
      var _super$get;
      return id2 != null ? (_super$get = super.get(id2)) != null ? _super$get : void 0 : void 0;
    }
    toArray() {
      return Array.from(this.values());
    }
    getEnabled() {
      return this.toArray().filter((_ref) => {
        let {
          disabled
        } = _ref;
        return !disabled;
      });
    }
    getNodeFor(id2) {
      var _this$get$node$curren, _this$get;
      return (_this$get$node$curren = (_this$get = this.get(id2)) == null ? void 0 : _this$get.node.current) != null ? _this$get$node$curren : void 0;
    }
  }
  const defaultPublicContext = {
    activatorEvent: null,
    active: null,
    activeNode: null,
    activeNodeRect: null,
    collisions: null,
    containerNodeRect: null,
    draggableNodes: /* @__PURE__ */ new Map(),
    droppableRects: /* @__PURE__ */ new Map(),
    droppableContainers: /* @__PURE__ */ new DroppableContainersMap(),
    over: null,
    dragOverlay: {
      nodeRef: {
        current: null
      },
      rect: null,
      setRef: noop$1
    },
    scrollableAncestors: [],
    scrollableAncestorRects: [],
    measuringConfiguration: defaultMeasuringConfiguration,
    measureDroppableContainers: noop$1,
    windowRect: null,
    measuringScheduled: false
  };
  const defaultInternalContext = {
    activatorEvent: null,
    activators: [],
    active: null,
    activeNodeRect: null,
    ariaDescribedById: {
      draggable: ""
    },
    dispatch: noop$1,
    draggableNodes: /* @__PURE__ */ new Map(),
    over: null,
    measureDroppableContainers: noop$1
  };
  const InternalContext = /* @__PURE__ */ React__default.createContext(defaultInternalContext);
  const PublicContext = /* @__PURE__ */ React__default.createContext(defaultPublicContext);
  function getInitialState() {
    return {
      draggable: {
        active: null,
        initialCoordinates: {
          x: 0,
          y: 0
        },
        nodes: /* @__PURE__ */ new Map(),
        translate: {
          x: 0,
          y: 0
        }
      },
      droppable: {
        containers: new DroppableContainersMap()
      }
    };
  }
  function reducer(state, action) {
    switch (action.type) {
      case Action.DragStart:
        return {
          ...state,
          draggable: {
            ...state.draggable,
            initialCoordinates: action.initialCoordinates,
            active: action.active
          }
        };
      case Action.DragMove:
        if (!state.draggable.active) {
          return state;
        }
        return {
          ...state,
          draggable: {
            ...state.draggable,
            translate: {
              x: action.coordinates.x - state.draggable.initialCoordinates.x,
              y: action.coordinates.y - state.draggable.initialCoordinates.y
            }
          }
        };
      case Action.DragEnd:
      case Action.DragCancel:
        return {
          ...state,
          draggable: {
            ...state.draggable,
            active: null,
            initialCoordinates: {
              x: 0,
              y: 0
            },
            translate: {
              x: 0,
              y: 0
            }
          }
        };
      case Action.RegisterDroppable: {
        const {
          element
        } = action;
        const {
          id: id2
        } = element;
        const containers = new DroppableContainersMap(state.droppable.containers);
        containers.set(id2, element);
        return {
          ...state,
          droppable: {
            ...state.droppable,
            containers
          }
        };
      }
      case Action.SetDroppableDisabled: {
        const {
          id: id2,
          key,
          disabled
        } = action;
        const element = state.droppable.containers.get(id2);
        if (!element || key !== element.key) {
          return state;
        }
        const containers = new DroppableContainersMap(state.droppable.containers);
        containers.set(id2, {
          ...element,
          disabled
        });
        return {
          ...state,
          droppable: {
            ...state.droppable,
            containers
          }
        };
      }
      case Action.UnregisterDroppable: {
        const {
          id: id2,
          key
        } = action;
        const element = state.droppable.containers.get(id2);
        if (!element || key !== element.key) {
          return state;
        }
        const containers = new DroppableContainersMap(state.droppable.containers);
        containers.delete(id2);
        return {
          ...state,
          droppable: {
            ...state.droppable,
            containers
          }
        };
      }
      default: {
        return state;
      }
    }
  }
  function RestoreFocus(_ref) {
    let {
      disabled
    } = _ref;
    const {
      active,
      activatorEvent,
      draggableNodes
    } = React__default.useContext(InternalContext);
    const previousActivatorEvent = usePrevious(activatorEvent);
    const previousActiveId = usePrevious(active == null ? void 0 : active.id);
    React__default.useEffect(() => {
      if (disabled) {
        return;
      }
      if (!activatorEvent && previousActivatorEvent && previousActiveId != null) {
        if (!isKeyboardEvent(previousActivatorEvent)) {
          return;
        }
        if (document.activeElement === previousActivatorEvent.target) {
          return;
        }
        const draggableNode = draggableNodes.get(previousActiveId);
        if (!draggableNode) {
          return;
        }
        const {
          activatorNode,
          node: node2
        } = draggableNode;
        if (!activatorNode.current && !node2.current) {
          return;
        }
        requestAnimationFrame(() => {
          for (const element of [activatorNode.current, node2.current]) {
            if (!element) {
              continue;
            }
            const focusableNode = findFirstFocusableNode(element);
            if (focusableNode) {
              focusableNode.focus();
              break;
            }
          }
        });
      }
    }, [activatorEvent, disabled, draggableNodes, previousActiveId, previousActivatorEvent]);
    return null;
  }
  function applyModifiers(modifiers, _ref) {
    let {
      transform,
      ...args
    } = _ref;
    return modifiers != null && modifiers.length ? modifiers.reduce((accumulator, modifier) => {
      return modifier({
        transform: accumulator,
        ...args
      });
    }, transform) : transform;
  }
  function useMeasuringConfiguration(config) {
    return React__default.useMemo(
      () => ({
        draggable: {
          ...defaultMeasuringConfiguration.draggable,
          ...config == null ? void 0 : config.draggable
        },
        droppable: {
          ...defaultMeasuringConfiguration.droppable,
          ...config == null ? void 0 : config.droppable
        },
        dragOverlay: {
          ...defaultMeasuringConfiguration.dragOverlay,
          ...config == null ? void 0 : config.dragOverlay
        }
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [config == null ? void 0 : config.draggable, config == null ? void 0 : config.droppable, config == null ? void 0 : config.dragOverlay]
    );
  }
  function useLayoutShiftScrollCompensation(_ref) {
    let {
      activeNode,
      measure,
      initialRect,
      config = true
    } = _ref;
    const initialized = React__default.useRef(false);
    const {
      x: x2,
      y: y2
    } = typeof config === "boolean" ? {
      x: config,
      y: config
    } : config;
    useIsomorphicLayoutEffect$3(() => {
      const disabled = !x2 && !y2;
      if (disabled || !activeNode) {
        initialized.current = false;
        return;
      }
      if (initialized.current || !initialRect) {
        return;
      }
      const node2 = activeNode == null ? void 0 : activeNode.node.current;
      if (!node2 || node2.isConnected === false) {
        return;
      }
      const rect = measure(node2);
      const rectDelta = getRectDelta(rect, initialRect);
      if (!x2) {
        rectDelta.x = 0;
      }
      if (!y2) {
        rectDelta.y = 0;
      }
      initialized.current = true;
      if (Math.abs(rectDelta.x) > 0 || Math.abs(rectDelta.y) > 0) {
        const firstScrollableAncestor = getFirstScrollableAncestor(node2);
        if (firstScrollableAncestor) {
          firstScrollableAncestor.scrollBy({
            top: rectDelta.y,
            left: rectDelta.x
          });
        }
      }
    }, [activeNode, x2, y2, initialRect, measure]);
  }
  const ActiveDraggableContext = /* @__PURE__ */ React__default.createContext({
    ...defaultCoordinates,
    scaleX: 1,
    scaleY: 1
  });
  var Status;
  (function(Status2) {
    Status2[Status2["Uninitialized"] = 0] = "Uninitialized";
    Status2[Status2["Initializing"] = 1] = "Initializing";
    Status2[Status2["Initialized"] = 2] = "Initialized";
  })(Status || (Status = {}));
  const DndContext = /* @__PURE__ */ React__default.memo(function DndContext2(_ref) {
    var _sensorContext$curren, _dragOverlay$nodeRef$, _dragOverlay$rect, _over$rect;
    let {
      id: id2,
      accessibility,
      autoScroll = true,
      children,
      sensors = defaultSensors,
      collisionDetection = rectIntersection,
      measuring,
      modifiers,
      ...props
    } = _ref;
    const store2 = React__default.useReducer(reducer, void 0, getInitialState);
    const [state, dispatch] = store2;
    const [dispatchMonitorEvent, registerMonitorListener] = useDndMonitorProvider();
    const [status, setStatus] = React__default.useState(Status.Uninitialized);
    const isInitialized = status === Status.Initialized;
    const {
      draggable: {
        active: activeId,
        nodes: draggableNodes,
        translate
      },
      droppable: {
        containers: droppableContainers
      }
    } = state;
    const node2 = activeId ? draggableNodes.get(activeId) : null;
    const activeRects = React__default.useRef({
      initial: null,
      translated: null
    });
    const active = React__default.useMemo(() => {
      var _node$data;
      return activeId != null ? {
        id: activeId,
        // It's possible for the active node to unmount while dragging
        data: (_node$data = node2 == null ? void 0 : node2.data) != null ? _node$data : defaultData,
        rect: activeRects
      } : null;
    }, [activeId, node2]);
    const activeRef = React__default.useRef(null);
    const [activeSensor, setActiveSensor] = React__default.useState(null);
    const [activatorEvent, setActivatorEvent] = React__default.useState(null);
    const latestProps = useLatestValue(props, Object.values(props));
    const draggableDescribedById = useUniqueId("DndDescribedBy", id2);
    const enabledDroppableContainers = React__default.useMemo(() => droppableContainers.getEnabled(), [droppableContainers]);
    const measuringConfiguration = useMeasuringConfiguration(measuring);
    const {
      droppableRects,
      measureDroppableContainers,
      measuringScheduled
    } = useDroppableMeasuring(enabledDroppableContainers, {
      dragging: isInitialized,
      dependencies: [translate.x, translate.y],
      config: measuringConfiguration.droppable
    });
    const activeNode = useCachedNode(draggableNodes, activeId);
    const activationCoordinates = React__default.useMemo(() => activatorEvent ? getEventCoordinates(activatorEvent) : null, [activatorEvent]);
    const autoScrollOptions = getAutoScrollerOptions();
    const initialActiveNodeRect = useInitialRect(activeNode, measuringConfiguration.draggable.measure);
    useLayoutShiftScrollCompensation({
      activeNode: activeId ? draggableNodes.get(activeId) : null,
      config: autoScrollOptions.layoutShiftCompensation,
      initialRect: initialActiveNodeRect,
      measure: measuringConfiguration.draggable.measure
    });
    const activeNodeRect = useRect(activeNode, measuringConfiguration.draggable.measure, initialActiveNodeRect);
    const containerNodeRect = useRect(activeNode ? activeNode.parentElement : null);
    const sensorContext = React__default.useRef({
      activatorEvent: null,
      active: null,
      activeNode,
      collisionRect: null,
      collisions: null,
      droppableRects,
      draggableNodes,
      draggingNode: null,
      draggingNodeRect: null,
      droppableContainers,
      over: null,
      scrollableAncestors: [],
      scrollAdjustedTranslate: null
    });
    const overNode = droppableContainers.getNodeFor((_sensorContext$curren = sensorContext.current.over) == null ? void 0 : _sensorContext$curren.id);
    const dragOverlay = useDragOverlayMeasuring({
      measure: measuringConfiguration.dragOverlay.measure
    });
    const draggingNode = (_dragOverlay$nodeRef$ = dragOverlay.nodeRef.current) != null ? _dragOverlay$nodeRef$ : activeNode;
    const draggingNodeRect = isInitialized ? (_dragOverlay$rect = dragOverlay.rect) != null ? _dragOverlay$rect : activeNodeRect : null;
    const usesDragOverlay = Boolean(dragOverlay.nodeRef.current && dragOverlay.rect);
    const nodeRectDelta = useRectDelta(usesDragOverlay ? null : activeNodeRect);
    const windowRect = useWindowRect(draggingNode ? getWindow(draggingNode) : null);
    const scrollableAncestors = useScrollableAncestors(isInitialized ? overNode != null ? overNode : activeNode : null);
    const scrollableAncestorRects = useRects(scrollableAncestors);
    const modifiedTranslate = applyModifiers(modifiers, {
      transform: {
        x: translate.x - nodeRectDelta.x,
        y: translate.y - nodeRectDelta.y,
        scaleX: 1,
        scaleY: 1
      },
      activatorEvent,
      active,
      activeNodeRect,
      containerNodeRect,
      draggingNodeRect,
      over: sensorContext.current.over,
      overlayNodeRect: dragOverlay.rect,
      scrollableAncestors,
      scrollableAncestorRects,
      windowRect
    });
    const pointerCoordinates = activationCoordinates ? add(activationCoordinates, translate) : null;
    const scrollOffsets = useScrollOffsets(scrollableAncestors);
    const scrollAdjustment = useScrollOffsetsDelta(scrollOffsets);
    const activeNodeScrollDelta = useScrollOffsetsDelta(scrollOffsets, [activeNodeRect]);
    const scrollAdjustedTranslate = add(modifiedTranslate, scrollAdjustment);
    const collisionRect = draggingNodeRect ? getAdjustedRect(draggingNodeRect, modifiedTranslate) : null;
    const collisions = active && collisionRect ? collisionDetection({
      active,
      collisionRect,
      droppableRects,
      droppableContainers: enabledDroppableContainers,
      pointerCoordinates
    }) : null;
    const overId = getFirstCollision(collisions, "id");
    const [over, setOver] = React__default.useState(null);
    const appliedTranslate = usesDragOverlay ? modifiedTranslate : add(modifiedTranslate, activeNodeScrollDelta);
    const transform = adjustScale(appliedTranslate, (_over$rect = over == null ? void 0 : over.rect) != null ? _over$rect : null, activeNodeRect);
    const instantiateSensor = React__default.useCallback(
      (event, _ref2) => {
        let {
          sensor: Sensor,
          options
        } = _ref2;
        if (activeRef.current == null) {
          return;
        }
        const activeNode2 = draggableNodes.get(activeRef.current);
        if (!activeNode2) {
          return;
        }
        const activatorEvent2 = event.nativeEvent;
        const sensorInstance = new Sensor({
          active: activeRef.current,
          activeNode: activeNode2,
          event: activatorEvent2,
          options,
          // Sensors need to be instantiated with refs for arguments that change over time
          // otherwise they are frozen in time with the stale arguments
          context: sensorContext,
          onStart(initialCoordinates) {
            const id3 = activeRef.current;
            if (id3 == null) {
              return;
            }
            const draggableNode = draggableNodes.get(id3);
            if (!draggableNode) {
              return;
            }
            const {
              onDragStart
            } = latestProps.current;
            const event2 = {
              active: {
                id: id3,
                data: draggableNode.data,
                rect: activeRects
              }
            };
            require$$0.unstable_batchedUpdates(() => {
              onDragStart == null ? void 0 : onDragStart(event2);
              setStatus(Status.Initializing);
              dispatch({
                type: Action.DragStart,
                initialCoordinates,
                active: id3
              });
              dispatchMonitorEvent({
                type: "onDragStart",
                event: event2
              });
            });
          },
          onMove(coordinates) {
            dispatch({
              type: Action.DragMove,
              coordinates
            });
          },
          onEnd: createHandler(Action.DragEnd),
          onCancel: createHandler(Action.DragCancel)
        });
        require$$0.unstable_batchedUpdates(() => {
          setActiveSensor(sensorInstance);
          setActivatorEvent(event.nativeEvent);
        });
        function createHandler(type) {
          return async function handler() {
            const {
              active: active2,
              collisions: collisions2,
              over: over2,
              scrollAdjustedTranslate: scrollAdjustedTranslate2
            } = sensorContext.current;
            let event2 = null;
            if (active2 && scrollAdjustedTranslate2) {
              const {
                cancelDrop
              } = latestProps.current;
              event2 = {
                activatorEvent: activatorEvent2,
                active: active2,
                collisions: collisions2,
                delta: scrollAdjustedTranslate2,
                over: over2
              };
              if (type === Action.DragEnd && typeof cancelDrop === "function") {
                const shouldCancel = await Promise.resolve(cancelDrop(event2));
                if (shouldCancel) {
                  type = Action.DragCancel;
                }
              }
            }
            activeRef.current = null;
            require$$0.unstable_batchedUpdates(() => {
              dispatch({
                type
              });
              setStatus(Status.Uninitialized);
              setOver(null);
              setActiveSensor(null);
              setActivatorEvent(null);
              const eventName = type === Action.DragEnd ? "onDragEnd" : "onDragCancel";
              if (event2) {
                const handler2 = latestProps.current[eventName];
                handler2 == null ? void 0 : handler2(event2);
                dispatchMonitorEvent({
                  type: eventName,
                  event: event2
                });
              }
            });
          };
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [draggableNodes]
    );
    const bindActivatorToSensorInstantiator = React__default.useCallback((handler, sensor) => {
      return (event, active2) => {
        const nativeEvent = event.nativeEvent;
        const activeDraggableNode = draggableNodes.get(active2);
        if (
          // Another sensor is already instantiating
          activeRef.current !== null || // No active draggable
          !activeDraggableNode || // Event has already been captured
          nativeEvent.dndKit || nativeEvent.defaultPrevented
        ) {
          return;
        }
        const activationContext = {
          active: activeDraggableNode
        };
        const shouldActivate = handler(event, sensor.options, activationContext);
        if (shouldActivate === true) {
          nativeEvent.dndKit = {
            capturedBy: sensor.sensor
          };
          activeRef.current = active2;
          instantiateSensor(event, sensor);
        }
      };
    }, [draggableNodes, instantiateSensor]);
    const activators = useCombineActivators(sensors, bindActivatorToSensorInstantiator);
    useSensorSetup(sensors);
    useIsomorphicLayoutEffect$3(() => {
      if (activeNodeRect && status === Status.Initializing) {
        setStatus(Status.Initialized);
      }
    }, [activeNodeRect, status]);
    React__default.useEffect(
      () => {
        const {
          onDragMove
        } = latestProps.current;
        const {
          active: active2,
          activatorEvent: activatorEvent2,
          collisions: collisions2,
          over: over2
        } = sensorContext.current;
        if (!active2 || !activatorEvent2) {
          return;
        }
        const event = {
          active: active2,
          activatorEvent: activatorEvent2,
          collisions: collisions2,
          delta: {
            x: scrollAdjustedTranslate.x,
            y: scrollAdjustedTranslate.y
          },
          over: over2
        };
        require$$0.unstable_batchedUpdates(() => {
          onDragMove == null ? void 0 : onDragMove(event);
          dispatchMonitorEvent({
            type: "onDragMove",
            event
          });
        });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [scrollAdjustedTranslate.x, scrollAdjustedTranslate.y]
    );
    React__default.useEffect(
      () => {
        const {
          active: active2,
          activatorEvent: activatorEvent2,
          collisions: collisions2,
          droppableContainers: droppableContainers2,
          scrollAdjustedTranslate: scrollAdjustedTranslate2
        } = sensorContext.current;
        if (!active2 || activeRef.current == null || !activatorEvent2 || !scrollAdjustedTranslate2) {
          return;
        }
        const {
          onDragOver
        } = latestProps.current;
        const overContainer = droppableContainers2.get(overId);
        const over2 = overContainer && overContainer.rect.current ? {
          id: overContainer.id,
          rect: overContainer.rect.current,
          data: overContainer.data,
          disabled: overContainer.disabled
        } : null;
        const event = {
          active: active2,
          activatorEvent: activatorEvent2,
          collisions: collisions2,
          delta: {
            x: scrollAdjustedTranslate2.x,
            y: scrollAdjustedTranslate2.y
          },
          over: over2
        };
        require$$0.unstable_batchedUpdates(() => {
          setOver(over2);
          onDragOver == null ? void 0 : onDragOver(event);
          dispatchMonitorEvent({
            type: "onDragOver",
            event
          });
        });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [overId]
    );
    useIsomorphicLayoutEffect$3(() => {
      sensorContext.current = {
        activatorEvent,
        active,
        activeNode,
        collisionRect,
        collisions,
        droppableRects,
        draggableNodes,
        draggingNode,
        draggingNodeRect,
        droppableContainers,
        over,
        scrollableAncestors,
        scrollAdjustedTranslate
      };
      activeRects.current = {
        initial: draggingNodeRect,
        translated: collisionRect
      };
    }, [active, activeNode, collisions, collisionRect, draggableNodes, draggingNode, draggingNodeRect, droppableRects, droppableContainers, over, scrollableAncestors, scrollAdjustedTranslate]);
    useAutoScroller({
      ...autoScrollOptions,
      delta: translate,
      draggingRect: collisionRect,
      pointerCoordinates,
      scrollableAncestors,
      scrollableAncestorRects
    });
    const publicContext = React__default.useMemo(() => {
      const context = {
        active,
        activeNode,
        activeNodeRect,
        activatorEvent,
        collisions,
        containerNodeRect,
        dragOverlay,
        draggableNodes,
        droppableContainers,
        droppableRects,
        over,
        measureDroppableContainers,
        scrollableAncestors,
        scrollableAncestorRects,
        measuringConfiguration,
        measuringScheduled,
        windowRect
      };
      return context;
    }, [active, activeNode, activeNodeRect, activatorEvent, collisions, containerNodeRect, dragOverlay, draggableNodes, droppableContainers, droppableRects, over, measureDroppableContainers, scrollableAncestors, scrollableAncestorRects, measuringConfiguration, measuringScheduled, windowRect]);
    const internalContext = React__default.useMemo(() => {
      const context = {
        activatorEvent,
        activators,
        active,
        activeNodeRect,
        ariaDescribedById: {
          draggable: draggableDescribedById
        },
        dispatch,
        draggableNodes,
        over,
        measureDroppableContainers
      };
      return context;
    }, [activatorEvent, activators, active, activeNodeRect, dispatch, draggableDescribedById, draggableNodes, over, measureDroppableContainers]);
    return React__default.createElement(DndMonitorContext.Provider, {
      value: registerMonitorListener
    }, React__default.createElement(InternalContext.Provider, {
      value: internalContext
    }, React__default.createElement(PublicContext.Provider, {
      value: publicContext
    }, React__default.createElement(ActiveDraggableContext.Provider, {
      value: transform
    }, children)), React__default.createElement(RestoreFocus, {
      disabled: (accessibility == null ? void 0 : accessibility.restoreFocus) === false
    })), React__default.createElement(Accessibility, {
      ...accessibility,
      hiddenTextDescribedById: draggableDescribedById
    }));
    function getAutoScrollerOptions() {
      const activeSensorDisablesAutoscroll = (activeSensor == null ? void 0 : activeSensor.autoScrollEnabled) === false;
      const autoScrollGloballyDisabled = typeof autoScroll === "object" ? autoScroll.enabled === false : autoScroll === false;
      const enabled = isInitialized && !activeSensorDisablesAutoscroll && !autoScrollGloballyDisabled;
      if (typeof autoScroll === "object") {
        return {
          ...autoScroll,
          enabled
        };
      }
      return {
        enabled
      };
    }
  });
  const NullContext = /* @__PURE__ */ React__default.createContext(null);
  const defaultRole = "button";
  const ID_PREFIX$1 = "Droppable";
  function useDraggable(_ref) {
    let {
      id: id2,
      data,
      disabled = false,
      attributes
    } = _ref;
    const key = useUniqueId(ID_PREFIX$1);
    const {
      activators,
      activatorEvent,
      active,
      activeNodeRect,
      ariaDescribedById,
      draggableNodes,
      over
    } = React__default.useContext(InternalContext);
    const {
      role = defaultRole,
      roleDescription = "draggable",
      tabIndex = 0
    } = attributes != null ? attributes : {};
    const isDragging = (active == null ? void 0 : active.id) === id2;
    const transform = React__default.useContext(isDragging ? ActiveDraggableContext : NullContext);
    const [node2, setNodeRef] = useNodeRef();
    const [activatorNode, setActivatorNodeRef] = useNodeRef();
    const listeners2 = useSyntheticListeners(activators, id2);
    const dataRef = useLatestValue(data);
    useIsomorphicLayoutEffect$3(
      () => {
        draggableNodes.set(id2, {
          id: id2,
          key,
          node: node2,
          activatorNode,
          data: dataRef
        });
        return () => {
          const node3 = draggableNodes.get(id2);
          if (node3 && node3.key === key) {
            draggableNodes.delete(id2);
          }
        };
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [draggableNodes, id2]
    );
    const memoizedAttributes = React__default.useMemo(() => ({
      role,
      tabIndex,
      "aria-disabled": disabled,
      "aria-pressed": isDragging && role === defaultRole ? true : void 0,
      "aria-roledescription": roleDescription,
      "aria-describedby": ariaDescribedById.draggable
    }), [disabled, role, tabIndex, isDragging, roleDescription, ariaDescribedById.draggable]);
    return {
      active,
      activatorEvent,
      activeNodeRect,
      attributes: memoizedAttributes,
      isDragging,
      listeners: disabled ? void 0 : listeners2,
      node: node2,
      over,
      setNodeRef,
      setActivatorNodeRef,
      transform
    };
  }
  function useDndContext() {
    return React__default.useContext(PublicContext);
  }
  const ID_PREFIX$1$1 = "Droppable";
  const defaultResizeObserverConfig = {
    timeout: 25
  };
  function useDroppable(_ref) {
    let {
      data,
      disabled = false,
      id: id2,
      resizeObserverConfig
    } = _ref;
    const key = useUniqueId(ID_PREFIX$1$1);
    const {
      active,
      dispatch,
      over,
      measureDroppableContainers
    } = React__default.useContext(InternalContext);
    const previous = React__default.useRef({
      disabled
    });
    const resizeObserverConnected = React__default.useRef(false);
    const rect = React__default.useRef(null);
    const callbackId = React__default.useRef(null);
    const {
      disabled: resizeObserverDisabled,
      updateMeasurementsFor,
      timeout: resizeObserverTimeout
    } = {
      ...defaultResizeObserverConfig,
      ...resizeObserverConfig
    };
    const ids2 = useLatestValue(updateMeasurementsFor != null ? updateMeasurementsFor : id2);
    const handleResize = React__default.useCallback(
      () => {
        if (!resizeObserverConnected.current) {
          resizeObserverConnected.current = true;
          return;
        }
        if (callbackId.current != null) {
          clearTimeout(callbackId.current);
        }
        callbackId.current = setTimeout(() => {
          measureDroppableContainers(Array.isArray(ids2.current) ? ids2.current : [ids2.current]);
          callbackId.current = null;
        }, resizeObserverTimeout);
      },
      //eslint-disable-next-line react-hooks/exhaustive-deps
      [resizeObserverTimeout]
    );
    const resizeObserver = useResizeObserver({
      callback: handleResize,
      disabled: resizeObserverDisabled || !active
    });
    const handleNodeChange = React__default.useCallback((newElement, previousElement) => {
      if (!resizeObserver) {
        return;
      }
      if (previousElement) {
        resizeObserver.unobserve(previousElement);
        resizeObserverConnected.current = false;
      }
      if (newElement) {
        resizeObserver.observe(newElement);
      }
    }, [resizeObserver]);
    const [nodeRef, setNodeRef] = useNodeRef(handleNodeChange);
    const dataRef = useLatestValue(data);
    React__default.useEffect(() => {
      if (!resizeObserver || !nodeRef.current) {
        return;
      }
      resizeObserver.disconnect();
      resizeObserverConnected.current = false;
      resizeObserver.observe(nodeRef.current);
    }, [nodeRef, resizeObserver]);
    useIsomorphicLayoutEffect$3(
      () => {
        dispatch({
          type: Action.RegisterDroppable,
          element: {
            id: id2,
            key,
            disabled,
            node: nodeRef,
            rect,
            data: dataRef
          }
        });
        return () => dispatch({
          type: Action.UnregisterDroppable,
          key,
          id: id2
        });
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [id2]
    );
    React__default.useEffect(() => {
      if (disabled !== previous.current.disabled) {
        dispatch({
          type: Action.SetDroppableDisabled,
          id: id2,
          key,
          disabled
        });
        previous.current.disabled = disabled;
      }
    }, [id2, key, disabled, dispatch]);
    return {
      active,
      rect,
      isOver: (over == null ? void 0 : over.id) === id2,
      node: nodeRef,
      over,
      setNodeRef
    };
  }
  function restrictToBoundingRect(transform, rect, boundingRect) {
    const value = {
      ...transform
    };
    if (rect.top + transform.y <= boundingRect.top) {
      value.y = boundingRect.top - rect.top;
    } else if (rect.bottom + transform.y >= boundingRect.top + boundingRect.height) {
      value.y = boundingRect.top + boundingRect.height - rect.bottom;
    }
    if (rect.left + transform.x <= boundingRect.left) {
      value.x = boundingRect.left - rect.left;
    } else if (rect.right + transform.x >= boundingRect.left + boundingRect.width) {
      value.x = boundingRect.left + boundingRect.width - rect.right;
    }
    return value;
  }
  const restrictToWindowEdges = (_ref) => {
    let {
      transform,
      draggingNodeRect,
      windowRect
    } = _ref;
    if (!draggingNodeRect || !windowRect) {
      return transform;
    }
    return restrictToBoundingRect(transform, draggingNodeRect, windowRect);
  };
  function arrayMove(array, from2, to) {
    const newArray = array.slice();
    newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from2, 1)[0]);
    return newArray;
  }
  function getSortedRects(items, rects) {
    return items.reduce((accumulator, id2, index) => {
      const rect = rects.get(id2);
      if (rect) {
        accumulator[index] = rect;
      }
      return accumulator;
    }, Array(items.length));
  }
  function isValidIndex(index) {
    return index !== null && index >= 0;
  }
  function itemsEqual(a2, b2) {
    if (a2 === b2) {
      return true;
    }
    if (a2.length !== b2.length) {
      return false;
    }
    for (let i2 = 0; i2 < a2.length; i2++) {
      if (a2[i2] !== b2[i2]) {
        return false;
      }
    }
    return true;
  }
  function normalizeDisabled(disabled) {
    if (typeof disabled === "boolean") {
      return {
        draggable: disabled,
        droppable: disabled
      };
    }
    return disabled;
  }
  const rectSortingStrategy = (_ref) => {
    let {
      rects,
      activeIndex,
      overIndex,
      index
    } = _ref;
    const newRects = arrayMove(rects, overIndex, activeIndex);
    const oldRect = rects[index];
    const newRect = newRects[index];
    if (!newRect || !oldRect) {
      return null;
    }
    return {
      x: newRect.left - oldRect.left,
      y: newRect.top - oldRect.top,
      scaleX: newRect.width / oldRect.width,
      scaleY: newRect.height / oldRect.height
    };
  };
  const ID_PREFIX = "Sortable";
  const Context = /* @__PURE__ */ React__default.createContext({
    activeIndex: -1,
    containerId: ID_PREFIX,
    disableTransforms: false,
    items: [],
    overIndex: -1,
    useDragOverlay: false,
    sortedRects: [],
    strategy: rectSortingStrategy,
    disabled: {
      draggable: false,
      droppable: false
    }
  });
  function SortableContext(_ref) {
    let {
      children,
      id: id2,
      items: userDefinedItems,
      strategy = rectSortingStrategy,
      disabled: disabledProp = false
    } = _ref;
    const {
      active,
      dragOverlay,
      droppableRects,
      over,
      measureDroppableContainers
    } = useDndContext();
    const containerId = useUniqueId(ID_PREFIX, id2);
    const useDragOverlay = Boolean(dragOverlay.rect !== null);
    const items = React__default.useMemo(() => userDefinedItems.map((item2) => typeof item2 === "object" && "id" in item2 ? item2.id : item2), [userDefinedItems]);
    const isDragging = active != null;
    const activeIndex = active ? items.indexOf(active.id) : -1;
    const overIndex = over ? items.indexOf(over.id) : -1;
    const previousItemsRef = React__default.useRef(items);
    const itemsHaveChanged = !itemsEqual(items, previousItemsRef.current);
    const disableTransforms = overIndex !== -1 && activeIndex === -1 || itemsHaveChanged;
    const disabled = normalizeDisabled(disabledProp);
    useIsomorphicLayoutEffect$3(() => {
      if (itemsHaveChanged && isDragging) {
        measureDroppableContainers(items);
      }
    }, [itemsHaveChanged, items, isDragging, measureDroppableContainers]);
    React__default.useEffect(() => {
      previousItemsRef.current = items;
    }, [items]);
    const contextValue = React__default.useMemo(
      () => ({
        activeIndex,
        containerId,
        disabled,
        disableTransforms,
        items,
        overIndex,
        useDragOverlay,
        sortedRects: getSortedRects(items, droppableRects),
        strategy
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [activeIndex, containerId, disabled.draggable, disabled.droppable, disableTransforms, items, overIndex, droppableRects, useDragOverlay, strategy]
    );
    return React__default.createElement(Context.Provider, {
      value: contextValue
    }, children);
  }
  const defaultNewIndexGetter = (_ref) => {
    let {
      id: id2,
      items,
      activeIndex,
      overIndex
    } = _ref;
    return arrayMove(items, activeIndex, overIndex).indexOf(id2);
  };
  const defaultAnimateLayoutChanges = (_ref2) => {
    let {
      containerId,
      isSorting,
      wasDragging,
      index,
      items,
      newIndex,
      previousItems,
      previousContainerId,
      transition
    } = _ref2;
    if (!transition || !wasDragging) {
      return false;
    }
    if (previousItems !== items && index === newIndex) {
      return false;
    }
    if (isSorting) {
      return true;
    }
    return newIndex !== index && containerId === previousContainerId;
  };
  const defaultTransition = {
    duration: 200,
    easing: "ease"
  };
  const transitionProperty = "transform";
  const disabledTransition = /* @__PURE__ */ CSS.Transition.toString({
    property: transitionProperty,
    duration: 0,
    easing: "linear"
  });
  const defaultAttributes = {
    roleDescription: "sortable"
  };
  function useDerivedTransform(_ref) {
    let {
      disabled,
      index,
      node: node2,
      rect
    } = _ref;
    const [derivedTransform, setDerivedtransform] = React__default.useState(null);
    const previousIndex = React__default.useRef(index);
    useIsomorphicLayoutEffect$3(() => {
      if (!disabled && index !== previousIndex.current && node2.current) {
        const initial = rect.current;
        if (initial) {
          const current = getClientRect(node2.current, {
            ignoreTransform: true
          });
          const delta = {
            x: initial.left - current.left,
            y: initial.top - current.top,
            scaleX: initial.width / current.width,
            scaleY: initial.height / current.height
          };
          if (delta.x || delta.y) {
            setDerivedtransform(delta);
          }
        }
      }
      if (index !== previousIndex.current) {
        previousIndex.current = index;
      }
    }, [disabled, index, node2, rect]);
    React__default.useEffect(() => {
      if (derivedTransform) {
        setDerivedtransform(null);
      }
    }, [derivedTransform]);
    return derivedTransform;
  }
  function useSortable(_ref) {
    let {
      animateLayoutChanges = defaultAnimateLayoutChanges,
      attributes: userDefinedAttributes,
      disabled: localDisabled,
      data: customData,
      getNewIndex = defaultNewIndexGetter,
      id: id2,
      strategy: localStrategy,
      resizeObserverConfig,
      transition = defaultTransition
    } = _ref;
    const {
      items,
      containerId,
      activeIndex,
      disabled: globalDisabled,
      disableTransforms,
      sortedRects,
      overIndex,
      useDragOverlay,
      strategy: globalStrategy
    } = React__default.useContext(Context);
    const disabled = normalizeLocalDisabled(localDisabled, globalDisabled);
    const index = items.indexOf(id2);
    const data = React__default.useMemo(() => ({
      sortable: {
        containerId,
        index,
        items
      },
      ...customData
    }), [containerId, customData, index, items]);
    const itemsAfterCurrentSortable = React__default.useMemo(() => items.slice(items.indexOf(id2)), [items, id2]);
    const {
      rect,
      node: node2,
      isOver,
      setNodeRef: setDroppableNodeRef
    } = useDroppable({
      id: id2,
      data,
      disabled: disabled.droppable,
      resizeObserverConfig: {
        updateMeasurementsFor: itemsAfterCurrentSortable,
        ...resizeObserverConfig
      }
    });
    const {
      active,
      activatorEvent,
      activeNodeRect,
      attributes,
      setNodeRef: setDraggableNodeRef,
      listeners: listeners2,
      isDragging,
      over,
      setActivatorNodeRef,
      transform
    } = useDraggable({
      id: id2,
      data,
      attributes: {
        ...defaultAttributes,
        ...userDefinedAttributes
      },
      disabled: disabled.draggable
    });
    const setNodeRef = useCombinedRefs(setDroppableNodeRef, setDraggableNodeRef);
    const isSorting = Boolean(active);
    const displaceItem = isSorting && !disableTransforms && isValidIndex(activeIndex) && isValidIndex(overIndex);
    const shouldDisplaceDragSource = !useDragOverlay && isDragging;
    const dragSourceDisplacement = shouldDisplaceDragSource && displaceItem ? transform : null;
    const strategy = localStrategy != null ? localStrategy : globalStrategy;
    const finalTransform = displaceItem ? dragSourceDisplacement != null ? dragSourceDisplacement : strategy({
      rects: sortedRects,
      activeNodeRect,
      activeIndex,
      overIndex,
      index
    }) : null;
    const newIndex = isValidIndex(activeIndex) && isValidIndex(overIndex) ? getNewIndex({
      id: id2,
      items,
      activeIndex,
      overIndex
    }) : index;
    const activeId = active == null ? void 0 : active.id;
    const previous = React__default.useRef({
      activeId,
      items,
      newIndex,
      containerId
    });
    const itemsHaveChanged = items !== previous.current.items;
    const shouldAnimateLayoutChanges = animateLayoutChanges({
      active,
      containerId,
      isDragging,
      isSorting,
      id: id2,
      index,
      items,
      newIndex: previous.current.newIndex,
      previousItems: previous.current.items,
      previousContainerId: previous.current.containerId,
      transition,
      wasDragging: previous.current.activeId != null
    });
    const derivedTransform = useDerivedTransform({
      disabled: !shouldAnimateLayoutChanges,
      index,
      node: node2,
      rect
    });
    React__default.useEffect(() => {
      if (isSorting && previous.current.newIndex !== newIndex) {
        previous.current.newIndex = newIndex;
      }
      if (containerId !== previous.current.containerId) {
        previous.current.containerId = containerId;
      }
      if (items !== previous.current.items) {
        previous.current.items = items;
      }
    }, [isSorting, newIndex, containerId, items]);
    React__default.useEffect(() => {
      if (activeId === previous.current.activeId) {
        return;
      }
      if (activeId && !previous.current.activeId) {
        previous.current.activeId = activeId;
        return;
      }
      const timeoutId = setTimeout(() => {
        previous.current.activeId = activeId;
      }, 50);
      return () => clearTimeout(timeoutId);
    }, [activeId]);
    return {
      active,
      activeIndex,
      attributes,
      data,
      rect,
      index,
      newIndex,
      items,
      isOver,
      isSorting,
      isDragging,
      listeners: listeners2,
      node: node2,
      overIndex,
      over,
      setNodeRef,
      setActivatorNodeRef,
      setDroppableNodeRef,
      setDraggableNodeRef,
      transform: derivedTransform != null ? derivedTransform : finalTransform,
      transition: getTransition()
    };
    function getTransition() {
      if (
        // Temporarily disable transitions for a single frame to set up derived transforms
        derivedTransform || // Or to prevent items jumping to back to their "new" position when items change
        itemsHaveChanged && previous.current.newIndex === index
      ) {
        return disabledTransition;
      }
      if (shouldDisplaceDragSource && !isKeyboardEvent(activatorEvent) || !transition) {
        return void 0;
      }
      if (isSorting || shouldAnimateLayoutChanges) {
        return CSS.Transition.toString({
          ...transition,
          property: transitionProperty
        });
      }
      return void 0;
    }
  }
  function normalizeLocalDisabled(localDisabled, globalDisabled) {
    var _localDisabled$dragga, _localDisabled$droppa;
    if (typeof localDisabled === "boolean") {
      return {
        draggable: localDisabled,
        // Backwards compatibility
        droppable: false
      };
    }
    return {
      draggable: (_localDisabled$dragga = localDisabled == null ? void 0 : localDisabled.draggable) != null ? _localDisabled$dragga : globalDisabled.draggable,
      droppable: (_localDisabled$droppa = localDisabled == null ? void 0 : localDisabled.droppable) != null ? _localDisabled$droppa : globalDisabled.droppable
    };
  }
  [KeyboardCode.Down, KeyboardCode.Right, KeyboardCode.Up, KeyboardCode.Left];
  var createUpdateEffect = function(hook) {
    return function(effect, deps) {
      var isMounted = React__default.useRef(false);
      hook(function() {
        return function() {
          isMounted.current = false;
        };
      }, []);
      hook(function() {
        if (!isMounted.current) {
          isMounted.current = true;
        } else {
          return effect();
        }
      }, deps);
    };
  };
  var __assign = function() {
    __assign = Object.assign || function __assign2(t2) {
      for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
        s2 = arguments[i2];
        for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2)) t2[p2] = s2[p2];
      }
      return t2;
    };
    return __assign.apply(this, arguments);
  };
  function __rest(s2, e2) {
    var t2 = {};
    for (var p2 in s2) if (Object.prototype.hasOwnProperty.call(s2, p2) && e2.indexOf(p2) < 0)
      t2[p2] = s2[p2];
    if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i2 = 0, p2 = Object.getOwnPropertySymbols(s2); i2 < p2.length; i2++) {
        if (e2.indexOf(p2[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p2[i2]))
          t2[p2[i2]] = s2[p2[i2]];
      }
    return t2;
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e2) {
          reject(e2);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e2) {
          reject(e2);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t2[0] & 1) throw t2[1];
      return t2[1];
    }, trys: [], ops: [] }, f2, y2, t2, g2;
    return g2 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g2[Symbol.iterator] = function() {
      return this;
    }), g2;
    function verb(n2) {
      return function(v2) {
        return step([n2, v2]);
      };
    }
    function step(op) {
      if (f2) throw new TypeError("Generator is already executing.");
      while (g2 && (g2 = 0, op[0] && (_ = 0)), _) try {
        if (f2 = 1, y2 && (t2 = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t2 = y2["return"]) && t2.call(y2), 0) : y2.next) && !(t2 = t2.call(y2, op[1])).done) return t2;
        if (y2 = 0, t2) op = [op[0] & 2, t2.value];
        switch (op[0]) {
          case 0:
          case 1:
            t2 = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y2 = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t2 = _.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t2[1]) {
              _.label = t2[1];
              t2 = op;
              break;
            }
            if (t2 && _.label < t2[2]) {
              _.label = t2[2];
              _.ops.push(op);
              break;
            }
            if (t2[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e2) {
        op = [6, e2];
        y2 = 0;
      } finally {
        f2 = t2 = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __read(o2, n2) {
    var m2 = typeof Symbol === "function" && o2[Symbol.iterator];
    if (!m2) return o2;
    var i2 = m2.call(o2), r2, ar = [], e2;
    try {
      while ((n2 === void 0 || n2-- > 0) && !(r2 = i2.next()).done) ar.push(r2.value);
    } catch (error) {
      e2 = { error };
    } finally {
      try {
        if (r2 && !r2.done && (m2 = i2["return"])) m2.call(i2);
      } finally {
        if (e2) throw e2.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from2, pack) {
    if (arguments.length === 2) for (var i2 = 0, l2 = from2.length, ar; i2 < l2; i2++) {
      if (ar || !(i2 in from2)) {
        if (!ar) ar = Array.prototype.slice.call(from2, 0, i2);
        ar[i2] = from2[i2];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from2));
  }
  typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message2) {
    var e2 = new Error(message2);
    return e2.name = "SuppressedError", e2.error = error, e2.suppressed = suppressed, e2;
  };
  var isFunction2 = function(value) {
    return typeof value === "function";
  };
  function useMemoizedFn(fn) {
    var fnRef = React__default.useRef(fn);
    fnRef.current = React__default.useMemo(function() {
      return fn;
    }, [fn]);
    var memoizedFn = React__default.useRef();
    if (!memoizedFn.current) {
      memoizedFn.current = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return fnRef.current.apply(this, args);
      };
    }
    return memoizedFn.current;
  }
  const useUpdateEffect = createUpdateEffect(React__default.useEffect);
  var useAutoRunPlugin = function(fetchInstance, _a) {
    var manual = _a.manual, _b = _a.ready, ready = _b === void 0 ? true : _b, _c = _a.defaultParams, defaultParams = _c === void 0 ? [] : _c, _d = _a.refreshDeps, refreshDeps = _d === void 0 ? [] : _d, refreshDepsAction = _a.refreshDepsAction;
    var hasAutoRun = React__default.useRef(false);
    hasAutoRun.current = false;
    useUpdateEffect(function() {
      if (!manual && ready) {
        hasAutoRun.current = true;
        fetchInstance.run.apply(fetchInstance, __spreadArray([], __read(defaultParams), false));
      }
    }, [ready]);
    useUpdateEffect(function() {
      if (hasAutoRun.current) {
        return;
      }
      if (!manual) {
        hasAutoRun.current = true;
        if (refreshDepsAction) {
          refreshDepsAction();
        } else {
          fetchInstance.refresh();
        }
      }
    }, __spreadArray([], __read(refreshDeps), false));
    return {
      onBefore: function() {
        if (!ready) {
          return {
            stopNow: true
          };
        }
      }
    };
  };
  useAutoRunPlugin.onInit = function(_a) {
    var _b = _a.ready, ready = _b === void 0 ? true : _b, manual = _a.manual;
    return {
      loading: !manual && ready
    };
  };
  function depsAreSame(oldDeps, deps) {
    if (oldDeps === deps) return true;
    for (var i2 = 0; i2 < oldDeps.length; i2++) {
      if (!Object.is(oldDeps[i2], deps[i2])) return false;
    }
    return true;
  }
  function useCreation(factory, deps) {
    var current = React__default.useRef({
      deps,
      obj: void 0,
      initialized: false
    }).current;
    if (current.initialized === false || !depsAreSame(current.deps, deps)) {
      current.deps = deps;
      current.obj = factory();
      current.initialized = true;
    }
    return current.obj;
  }
  function useLatest(value) {
    var ref = React__default.useRef(value);
    ref.current = value;
    return ref;
  }
  var useUnmount = function(fn) {
    var fnRef = useLatest(fn);
    React__default.useEffect(function() {
      return function() {
        fnRef.current();
      };
    }, []);
  };
  var cache$1 = /* @__PURE__ */ new Map();
  var setCache = function(key, cacheTime, cachedData) {
    var currentCache = cache$1.get(key);
    if (currentCache === null || currentCache === void 0 ? void 0 : currentCache.timer) {
      clearTimeout(currentCache.timer);
    }
    var timer = void 0;
    if (cacheTime > -1) {
      timer = setTimeout(function() {
        cache$1.delete(key);
      }, cacheTime);
    }
    cache$1.set(key, __assign(__assign({}, cachedData), {
      timer
    }));
  };
  var getCache = function(key) {
    return cache$1.get(key);
  };
  var cachePromise = /* @__PURE__ */ new Map();
  var getCachePromise = function(cacheKey) {
    return cachePromise.get(cacheKey);
  };
  var setCachePromise = function(cacheKey, promise) {
    cachePromise.set(cacheKey, promise);
    promise.then(function(res) {
      cachePromise.delete(cacheKey);
      return res;
    }).catch(function() {
      cachePromise.delete(cacheKey);
    });
  };
  var listeners$2 = {};
  var trigger = function(key, data) {
    if (listeners$2[key]) {
      listeners$2[key].forEach(function(item2) {
        return item2(data);
      });
    }
  };
  var subscribe$3 = function(key, listener) {
    if (!listeners$2[key]) {
      listeners$2[key] = [];
    }
    listeners$2[key].push(listener);
    return function unsubscribe() {
      var index = listeners$2[key].indexOf(listener);
      listeners$2[key].splice(index, 1);
    };
  };
  var useCachePlugin = function(fetchInstance, _a) {
    var cacheKey = _a.cacheKey, _b = _a.cacheTime, cacheTime = _b === void 0 ? 5 * 60 * 1e3 : _b, _c = _a.staleTime, staleTime = _c === void 0 ? 0 : _c, customSetCache = _a.setCache, customGetCache = _a.getCache;
    var unSubscribeRef = React__default.useRef();
    var currentPromiseRef = React__default.useRef();
    var _setCache = function(key, cachedData) {
      if (customSetCache) {
        customSetCache(cachedData);
      } else {
        setCache(key, cacheTime, cachedData);
      }
      trigger(key, cachedData.data);
    };
    var _getCache = function(key, params) {
      if (params === void 0) {
        params = [];
      }
      if (customGetCache) {
        return customGetCache(params);
      }
      return getCache(key);
    };
    useCreation(function() {
      if (!cacheKey) {
        return;
      }
      var cacheData = _getCache(cacheKey);
      if (cacheData && Object.hasOwnProperty.call(cacheData, "data")) {
        fetchInstance.state.data = cacheData.data;
        fetchInstance.state.params = cacheData.params;
        if (staleTime === -1 || (/* @__PURE__ */ new Date()).getTime() - cacheData.time <= staleTime) {
          fetchInstance.state.loading = false;
        }
      }
      unSubscribeRef.current = subscribe$3(cacheKey, function(data) {
        fetchInstance.setState({
          data
        });
      });
    }, []);
    useUnmount(function() {
      var _a2;
      (_a2 = unSubscribeRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(unSubscribeRef);
    });
    if (!cacheKey) {
      return {};
    }
    return {
      onBefore: function(params) {
        var cacheData = _getCache(cacheKey, params);
        if (!cacheData || !Object.hasOwnProperty.call(cacheData, "data")) {
          return {};
        }
        if (staleTime === -1 || (/* @__PURE__ */ new Date()).getTime() - cacheData.time <= staleTime) {
          return {
            loading: false,
            data: cacheData === null || cacheData === void 0 ? void 0 : cacheData.data,
            error: void 0,
            returnNow: true
          };
        } else {
          return {
            data: cacheData === null || cacheData === void 0 ? void 0 : cacheData.data,
            error: void 0
          };
        }
      },
      onRequest: function(service, args) {
        var servicePromise = getCachePromise(cacheKey);
        if (servicePromise && servicePromise !== currentPromiseRef.current) {
          return {
            servicePromise
          };
        }
        servicePromise = service.apply(void 0, __spreadArray([], __read(args), false));
        currentPromiseRef.current = servicePromise;
        setCachePromise(cacheKey, servicePromise);
        return {
          servicePromise
        };
      },
      onSuccess: function(data, params) {
        var _a2;
        if (cacheKey) {
          (_a2 = unSubscribeRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(unSubscribeRef);
          _setCache(cacheKey, {
            data,
            params,
            time: (/* @__PURE__ */ new Date()).getTime()
          });
          unSubscribeRef.current = subscribe$3(cacheKey, function(d2) {
            fetchInstance.setState({
              data: d2
            });
          });
        }
      },
      onMutate: function(data) {
        var _a2;
        if (cacheKey) {
          (_a2 = unSubscribeRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(unSubscribeRef);
          _setCache(cacheKey, {
            data,
            params: fetchInstance.state.params,
            time: (/* @__PURE__ */ new Date()).getTime()
          });
          unSubscribeRef.current = subscribe$3(cacheKey, function(d2) {
            fetchInstance.setState({
              data: d2
            });
          });
        }
      }
    };
  };
  function isObject$4(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }
  var isObject_1 = isObject$4;
  var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal$1;
  var freeGlobal = _freeGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root$2 = freeGlobal || freeSelf || Function("return this")();
  var _root = root$2;
  var root$1 = _root;
  var now$1 = function() {
    return root$1.Date.now();
  };
  var now_1 = now$1;
  var reWhitespace = /\s/;
  function trimmedEndIndex$1(string) {
    var index = string.length;
    while (index-- && reWhitespace.test(string.charAt(index))) {
    }
    return index;
  }
  var _trimmedEndIndex = trimmedEndIndex$1;
  var trimmedEndIndex = _trimmedEndIndex;
  var reTrimStart = /^\s+/;
  function baseTrim$1(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
  }
  var _baseTrim = baseTrim$1;
  var root = _root;
  var Symbol$3 = root.Symbol;
  var _Symbol = Symbol$3;
  var Symbol$2 = _Symbol;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  var nativeObjectToString$1 = objectProto$1.toString;
  var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
  function getRawTag$1(value) {
    var isOwn = hasOwnProperty$1.call(value, symToStringTag$1), tag2 = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e2) {
    }
    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag2;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }
  var _getRawTag = getRawTag$1;
  var objectProto = Object.prototype;
  var nativeObjectToString = objectProto.toString;
  function objectToString$1(value) {
    return nativeObjectToString.call(value);
  }
  var _objectToString = objectToString$1;
  var Symbol$1 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString;
  var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function baseGetTag$1(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }
  var _baseGetTag = baseGetTag$1;
  function isObjectLike$1(value) {
    return value != null && typeof value == "object";
  }
  var isObjectLike_1 = isObjectLike$1;
  var baseGetTag = _baseGetTag, isObjectLike = isObjectLike_1;
  var symbolTag = "[object Symbol]";
  function isSymbol$1(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
  }
  var isSymbol_1 = isSymbol$1;
  var baseTrim = _baseTrim, isObject$3 = isObject_1, isSymbol2 = isSymbol_1;
  var NAN = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber$1(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol2(value)) {
      return NAN;
    }
    if (isObject$3(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject$3(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  var toNumber_1 = toNumber$1;
  var isObject$2 = isObject_1, now = now_1, toNumber = toNumber_1;
  var FUNC_ERROR_TEXT$1 = "Expected a function";
  var nativeMax = Math.max, nativeMin = Math.min;
  function debounce$1(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    wait = toNumber(wait) || 0;
    if (isObject$2(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now());
    }
    function debounced() {
      var time = now(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }
  var debounce_1 = debounce$1;
  const debounce$2 = /* @__PURE__ */ getDefaultExportFromCjs(debounce_1);
  var useDebouncePlugin = function(fetchInstance, _a) {
    var debounceWait = _a.debounceWait, debounceLeading = _a.debounceLeading, debounceTrailing = _a.debounceTrailing, debounceMaxWait = _a.debounceMaxWait;
    var debouncedRef = React__default.useRef();
    var options = React__default.useMemo(function() {
      var ret = {};
      if (debounceLeading !== void 0) {
        ret.leading = debounceLeading;
      }
      if (debounceTrailing !== void 0) {
        ret.trailing = debounceTrailing;
      }
      if (debounceMaxWait !== void 0) {
        ret.maxWait = debounceMaxWait;
      }
      return ret;
    }, [debounceLeading, debounceTrailing, debounceMaxWait]);
    React__default.useEffect(function() {
      if (debounceWait) {
        var _originRunAsync_1 = fetchInstance.runAsync.bind(fetchInstance);
        debouncedRef.current = debounce$2(function(callback) {
          callback();
        }, debounceWait, options);
        fetchInstance.runAsync = function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return new Promise(function(resolve, reject) {
            var _a2;
            (_a2 = debouncedRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(debouncedRef, function() {
              _originRunAsync_1.apply(void 0, __spreadArray([], __read(args), false)).then(resolve).catch(reject);
            });
          });
        };
        return function() {
          var _a2;
          (_a2 = debouncedRef.current) === null || _a2 === void 0 ? void 0 : _a2.cancel();
          fetchInstance.runAsync = _originRunAsync_1;
        };
      }
    }, [debounceWait, options]);
    if (!debounceWait) {
      return {};
    }
    return {
      onCancel: function() {
        var _a2;
        (_a2 = debouncedRef.current) === null || _a2 === void 0 ? void 0 : _a2.cancel();
      }
    };
  };
  var useLoadingDelayPlugin = function(fetchInstance, _a) {
    var loadingDelay = _a.loadingDelay, ready = _a.ready;
    var timerRef = React__default.useRef();
    if (!loadingDelay) {
      return {};
    }
    var cancelTimeout = function() {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    return {
      onBefore: function() {
        cancelTimeout();
        if (ready !== false) {
          timerRef.current = setTimeout(function() {
            fetchInstance.setState({
              loading: true
            });
          }, loadingDelay);
        }
        return {
          loading: false
        };
      },
      onFinally: function() {
        cancelTimeout();
      },
      onCancel: function() {
        cancelTimeout();
      }
    };
  };
  var isBrowser = !!(typeof window !== "undefined" && window.document && window.document.createElement);
  function isDocumentVisible() {
    if (isBrowser) {
      return document.visibilityState !== "hidden";
    }
    return true;
  }
  var listeners$1 = [];
  function subscribe$2(listener) {
    listeners$1.push(listener);
    return function unsubscribe() {
      var index = listeners$1.indexOf(listener);
      listeners$1.splice(index, 1);
    };
  }
  if (isBrowser) {
    var revalidate$1 = function() {
      if (!isDocumentVisible()) return;
      for (var i2 = 0; i2 < listeners$1.length; i2++) {
        var listener = listeners$1[i2];
        listener();
      }
    };
    window.addEventListener("visibilitychange", revalidate$1, false);
  }
  var usePollingPlugin = function(fetchInstance, _a) {
    var pollingInterval = _a.pollingInterval, _b = _a.pollingWhenHidden, pollingWhenHidden = _b === void 0 ? true : _b, _c = _a.pollingErrorRetryCount, pollingErrorRetryCount = _c === void 0 ? -1 : _c;
    var timerRef = React__default.useRef();
    var unsubscribeRef = React__default.useRef();
    var countRef = React__default.useRef(0);
    var stopPolling = function() {
      var _a2;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      (_a2 = unsubscribeRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(unsubscribeRef);
    };
    useUpdateEffect(function() {
      if (!pollingInterval) {
        stopPolling();
      }
    }, [pollingInterval]);
    if (!pollingInterval) {
      return {};
    }
    return {
      onBefore: function() {
        stopPolling();
      },
      onError: function() {
        countRef.current += 1;
      },
      onSuccess: function() {
        countRef.current = 0;
      },
      onFinally: function() {
        if (pollingErrorRetryCount === -1 || // When an error occurs, the request is not repeated after pollingErrorRetryCount retries
        pollingErrorRetryCount !== -1 && countRef.current <= pollingErrorRetryCount) {
          timerRef.current = setTimeout(function() {
            if (!pollingWhenHidden && !isDocumentVisible()) {
              unsubscribeRef.current = subscribe$2(function() {
                fetchInstance.refresh();
              });
            } else {
              fetchInstance.refresh();
            }
          }, pollingInterval);
        } else {
          countRef.current = 0;
        }
      },
      onCancel: function() {
        stopPolling();
      }
    };
  };
  function limit(fn, timespan) {
    var pending = false;
    return function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (pending) return;
      pending = true;
      fn.apply(void 0, __spreadArray([], __read(args), false));
      setTimeout(function() {
        pending = false;
      }, timespan);
    };
  }
  function isOnline() {
    if (isBrowser && typeof navigator.onLine !== "undefined") {
      return navigator.onLine;
    }
    return true;
  }
  var listeners = [];
  function subscribe$1(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      var index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }
  if (isBrowser) {
    var revalidate = function() {
      if (!isDocumentVisible() || !isOnline()) return;
      for (var i2 = 0; i2 < listeners.length; i2++) {
        var listener = listeners[i2];
        listener();
      }
    };
    window.addEventListener("visibilitychange", revalidate, false);
    window.addEventListener("focus", revalidate, false);
  }
  var useRefreshOnWindowFocusPlugin = function(fetchInstance, _a) {
    var refreshOnWindowFocus = _a.refreshOnWindowFocus, _b = _a.focusTimespan, focusTimespan = _b === void 0 ? 5e3 : _b;
    var unsubscribeRef = React__default.useRef();
    var stopSubscribe = function() {
      var _a2;
      (_a2 = unsubscribeRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(unsubscribeRef);
    };
    React__default.useEffect(function() {
      if (refreshOnWindowFocus) {
        var limitRefresh_1 = limit(fetchInstance.refresh.bind(fetchInstance), focusTimespan);
        unsubscribeRef.current = subscribe$1(function() {
          limitRefresh_1();
        });
      }
      return function() {
        stopSubscribe();
      };
    }, [refreshOnWindowFocus, focusTimespan]);
    useUnmount(function() {
      stopSubscribe();
    });
    return {};
  };
  var useRetryPlugin = function(fetchInstance, _a) {
    var retryInterval = _a.retryInterval, retryCount = _a.retryCount;
    var timerRef = React__default.useRef();
    var countRef = React__default.useRef(0);
    var triggerByRetry = React__default.useRef(false);
    if (!retryCount) {
      return {};
    }
    return {
      onBefore: function() {
        if (!triggerByRetry.current) {
          countRef.current = 0;
        }
        triggerByRetry.current = false;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      },
      onSuccess: function() {
        countRef.current = 0;
      },
      onError: function() {
        countRef.current += 1;
        if (retryCount === -1 || countRef.current <= retryCount) {
          var timeout2 = retryInterval !== null && retryInterval !== void 0 ? retryInterval : Math.min(1e3 * Math.pow(2, countRef.current), 3e4);
          timerRef.current = setTimeout(function() {
            triggerByRetry.current = true;
            fetchInstance.refresh();
          }, timeout2);
        } else {
          countRef.current = 0;
        }
      },
      onCancel: function() {
        countRef.current = 0;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      }
    };
  };
  var debounce = debounce_1, isObject$1 = isObject_1;
  var FUNC_ERROR_TEXT = "Expected a function";
  function throttle(func, wait, options) {
    var leading = true, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    if (isObject$1(options)) {
      leading = "leading" in options ? !!options.leading : leading;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, {
      "leading": leading,
      "maxWait": wait,
      "trailing": trailing
    });
  }
  var throttle_1 = throttle;
  const throttle$1 = /* @__PURE__ */ getDefaultExportFromCjs(throttle_1);
  var useThrottlePlugin = function(fetchInstance, _a) {
    var throttleWait = _a.throttleWait, throttleLeading = _a.throttleLeading, throttleTrailing = _a.throttleTrailing;
    var throttledRef = React__default.useRef();
    var options = {};
    if (throttleLeading !== void 0) {
      options.leading = throttleLeading;
    }
    if (throttleTrailing !== void 0) {
      options.trailing = throttleTrailing;
    }
    React__default.useEffect(function() {
      if (throttleWait) {
        var _originRunAsync_1 = fetchInstance.runAsync.bind(fetchInstance);
        throttledRef.current = throttle$1(function(callback) {
          callback();
        }, throttleWait, options);
        fetchInstance.runAsync = function() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return new Promise(function(resolve, reject) {
            var _a2;
            (_a2 = throttledRef.current) === null || _a2 === void 0 ? void 0 : _a2.call(throttledRef, function() {
              _originRunAsync_1.apply(void 0, __spreadArray([], __read(args), false)).then(resolve).catch(reject);
            });
          });
        };
        return function() {
          var _a2;
          fetchInstance.runAsync = _originRunAsync_1;
          (_a2 = throttledRef.current) === null || _a2 === void 0 ? void 0 : _a2.cancel();
        };
      }
    }, [throttleWait, throttleLeading, throttleTrailing]);
    if (!throttleWait) {
      return {};
    }
    return {
      onCancel: function() {
        var _a2;
        (_a2 = throttledRef.current) === null || _a2 === void 0 ? void 0 : _a2.cancel();
      }
    };
  };
  var useMount = function(fn) {
    React__default.useEffect(function() {
      fn === null || fn === void 0 ? void 0 : fn();
    }, []);
  };
  var useUpdate = function() {
    var _a = __read(React__default.useState({}), 2), setState = _a[1];
    return React__default.useCallback(function() {
      return setState({});
    }, []);
  };
  var Fetch = (
    /** @class */
    function() {
      function Fetch2(serviceRef, options, subscribe2, initState) {
        if (initState === void 0) {
          initState = {};
        }
        this.serviceRef = serviceRef;
        this.options = options;
        this.subscribe = subscribe2;
        this.initState = initState;
        this.count = 0;
        this.state = {
          loading: false,
          params: void 0,
          data: void 0,
          error: void 0
        };
        this.state = __assign(__assign(__assign({}, this.state), {
          loading: !options.manual
        }), initState);
      }
      Fetch2.prototype.setState = function(s2) {
        if (s2 === void 0) {
          s2 = {};
        }
        this.state = __assign(__assign({}, this.state), s2);
        this.subscribe();
      };
      Fetch2.prototype.runPluginHandler = function(event) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          rest[_i - 1] = arguments[_i];
        }
        var r2 = this.pluginImpls.map(function(i2) {
          var _a;
          return (_a = i2[event]) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([i2], __read(rest), false));
        }).filter(Boolean);
        return Object.assign.apply(Object, __spreadArray([{}], __read(r2), false));
      };
      Fetch2.prototype.runAsync = function() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          params[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function() {
          var currentCount, _l, _m, stopNow, _o, returnNow, state, servicePromise, res, error_1;
          var _p;
          return __generator(this, function(_q) {
            switch (_q.label) {
              case 0:
                this.count += 1;
                currentCount = this.count;
                _l = this.runPluginHandler("onBefore", params), _m = _l.stopNow, stopNow = _m === void 0 ? false : _m, _o = _l.returnNow, returnNow = _o === void 0 ? false : _o, state = __rest(_l, ["stopNow", "returnNow"]);
                if (stopNow) {
                  return [2, new Promise(function() {
                  })];
                }
                this.setState(__assign({
                  loading: true,
                  params
                }, state));
                if (returnNow) {
                  return [2, Promise.resolve(state.data)];
                }
                (_b = (_a = this.options).onBefore) === null || _b === void 0 ? void 0 : _b.call(_a, params);
                _q.label = 1;
              case 1:
                _q.trys.push([1, 3, , 4]);
                servicePromise = this.runPluginHandler("onRequest", this.serviceRef.current, params).servicePromise;
                if (!servicePromise) {
                  servicePromise = (_p = this.serviceRef).current.apply(_p, __spreadArray([], __read(params), false));
                }
                return [4, servicePromise];
              case 2:
                res = _q.sent();
                if (currentCount !== this.count) {
                  return [2, new Promise(function() {
                  })];
                }
                this.setState({
                  data: res,
                  error: void 0,
                  loading: false
                });
                (_d = (_c = this.options).onSuccess) === null || _d === void 0 ? void 0 : _d.call(_c, res, params);
                this.runPluginHandler("onSuccess", res, params);
                (_f = (_e = this.options).onFinally) === null || _f === void 0 ? void 0 : _f.call(_e, params, res, void 0);
                if (currentCount === this.count) {
                  this.runPluginHandler("onFinally", params, res, void 0);
                }
                return [2, res];
              case 3:
                error_1 = _q.sent();
                if (currentCount !== this.count) {
                  return [2, new Promise(function() {
                  })];
                }
                this.setState({
                  error: error_1,
                  loading: false
                });
                (_h = (_g = this.options).onError) === null || _h === void 0 ? void 0 : _h.call(_g, error_1, params);
                this.runPluginHandler("onError", error_1, params);
                (_k = (_j = this.options).onFinally) === null || _k === void 0 ? void 0 : _k.call(_j, params, void 0, error_1);
                if (currentCount === this.count) {
                  this.runPluginHandler("onFinally", params, void 0, error_1);
                }
                throw error_1;
              case 4:
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      Fetch2.prototype.run = function() {
        var _this = this;
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          params[_i] = arguments[_i];
        }
        this.runAsync.apply(this, __spreadArray([], __read(params), false)).catch(function(error) {
          if (!_this.options.onError) {
            console.error(error);
          }
        });
      };
      Fetch2.prototype.cancel = function() {
        this.count += 1;
        this.setState({
          loading: false
        });
        this.runPluginHandler("onCancel");
      };
      Fetch2.prototype.refresh = function() {
        this.run.apply(this, __spreadArray([], __read(this.state.params || []), false));
      };
      Fetch2.prototype.refreshAsync = function() {
        return this.runAsync.apply(this, __spreadArray([], __read(this.state.params || []), false));
      };
      Fetch2.prototype.mutate = function(data) {
        var targetData = isFunction2(data) ? data(this.state.data) : data;
        this.runPluginHandler("onMutate", targetData);
        this.setState({
          data: targetData
        });
      };
      return Fetch2;
    }()
  );
  function useRequestImplement(service, options, plugins) {
    if (options === void 0) {
      options = {};
    }
    if (plugins === void 0) {
      plugins = [];
    }
    var _a = options.manual, manual = _a === void 0 ? false : _a, _b = options.ready, ready = _b === void 0 ? true : _b, rest = __rest(options, ["manual", "ready"]);
    var fetchOptions = __assign({
      manual,
      ready
    }, rest);
    var serviceRef = useLatest(service);
    var update = useUpdate();
    var fetchInstance = useCreation(function() {
      var initState = plugins.map(function(p2) {
        var _a2;
        return (_a2 = p2 === null || p2 === void 0 ? void 0 : p2.onInit) === null || _a2 === void 0 ? void 0 : _a2.call(p2, fetchOptions);
      }).filter(Boolean);
      return new Fetch(serviceRef, fetchOptions, update, Object.assign.apply(Object, __spreadArray([{}], __read(initState), false)));
    }, []);
    fetchInstance.options = fetchOptions;
    fetchInstance.pluginImpls = plugins.map(function(p2) {
      return p2(fetchInstance, fetchOptions);
    });
    useMount(function() {
      if (!manual && ready) {
        var params = fetchInstance.state.params || options.defaultParams || [];
        fetchInstance.run.apply(fetchInstance, __spreadArray([], __read(params), false));
      }
    });
    useUnmount(function() {
      fetchInstance.cancel();
    });
    return {
      loading: fetchInstance.state.loading,
      data: fetchInstance.state.data,
      error: fetchInstance.state.error,
      params: fetchInstance.state.params || [],
      cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance)),
      refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)),
      refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)),
      run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)),
      runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)),
      mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance))
    };
  }
  function useRequest(service, options, plugins) {
    return useRequestImplement(service, options, __spreadArray(__spreadArray([], __read([]), false), [useDebouncePlugin, useLoadingDelayPlugin, usePollingPlugin, useRefreshOnWindowFocusPlugin, useThrottlePlugin, useAutoRunPlugin, useCachePlugin, useRetryPlugin], false));
  }
  function useMap(initialValue) {
    var getInitValue = function() {
      return new Map(initialValue);
    };
    var _a = __read(React__default.useState(getInitValue), 2), map2 = _a[0], setMap = _a[1];
    var set = function(key, entry) {
      setMap(function(prev2) {
        var temp = new Map(prev2);
        temp.set(key, entry);
        return temp;
      });
    };
    var setAll = function(newMap) {
      setMap(new Map(newMap));
    };
    var remove = function(key) {
      setMap(function(prev2) {
        var temp = new Map(prev2);
        temp.delete(key);
        return temp;
      });
    };
    var reset2 = function() {
      return setMap(getInitValue());
    };
    var get = function(key) {
      return map2.get(key);
    };
    return [map2, {
      set: useMemoizedFn(set),
      setAll: useMemoizedFn(setAll),
      remove: useMemoizedFn(remove),
      reset: useMemoizedFn(reset2),
      get: useMemoizedFn(get)
    }];
  }
  function DndKitSortableList({
    list,
    getId,
    onChange,
    renderItem
  }) {
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 5
        }
      })
    );
    const uniqList = React__default.useMemo(() => lodash.uniqBy(list, (item2) => getId(item2)), [list]);
    const idArr = React__default.useMemo(() => list.map((item2) => getId(item2)), [uniqList]);
    const [activeId, setActiveId] = React__default.useState(void 0);
    const handleDragStart = useMemoizedFn((e2) => {
      setActiveId(e2.active.id.toString());
    });
    const handleDragEnd = useMemoizedFn((e2) => {
      setActiveId(void 0);
      const { over, active } = e2;
      if (!(over == null ? void 0 : over.id) || over.id === active.id) return;
      const oldIndex = list.findIndex((item2) => getId(item2) === active.id);
      const newIndex = list.findIndex((item2) => getId(item2) === over.id);
      const newList = arrayMove(list, oldIndex, newIndex);
      onChange(newList);
    });
    return jsx(Fragment, { children: jsx(
      DndContext,
      {
        sensors,
        collisionDetection: closestCorners,
        onDragEnd: handleDragEnd,
        onDragStart: handleDragStart,
        modifiers: [restrictToWindowEdges],
        children: jsx(SortableContext, { items: idArr, strategy: rectSortingStrategy, children: list.map((item2) => {
          const id2 = getId(item2);
          const dragging = activeId === id2;
          return jsx(SortableItem, { id: id2, children: renderItem(item2, id2, dragging) }, id2);
        }) })
      }
    ) });
  }
  function SortableItem({
    elementType,
    id: id2,
    children
  }) {
    const { attributes, listeners: listeners2, setNodeRef, transform, transition } = useSortable({ id: id2 });
    const style = {
      transform: CSS.Translate.toString(transform),
      transition
    };
    const Element = elementType || "div";
    return jsx(Element, { ...attributes, ...listeners2, style, ref: setNodeRef, children });
  }
  const { Search } = antd.Input;
  const onClose = () => {
    settingsUiState.settingsModalOpen = false;
  };
  function SettingsUi() {
    const { settingsModalOpen } = useSnapshot(settingsUiState);
    return jsx(antd.Modal, { title: "设置", open: settingsModalOpen, onCancel: onClose, width: "1000px", footer: null, centered: true, children: jsx(
      antd.Tabs,
      {
        tabPosition: "top",
        items: [
          {
            key: "basic",
            label: "基础设置",
            children: jsx(TabPaneParse, {})
          },
          {
            key: "tags",
            label: "Tag 设置",
            children: jsx(TabPaneTag, {})
          },
          {
            key: "forum",
            label: "论坛设置",
            children: jsx(TabPaneForum, {})
          }
        ]
      }
    ) });
  }
  const S = {
    cssTabPane: css$1`
    min-height: 30vh;
  `,
    configPart: css$1`
    margin-top: 30px;
    &:first-of-type {
      margin-top: 0;
    }
  `,
    configTitle: css$1`
    font-size: 15px;
    display: flex;
    align-items: center;
  `
  };
  function TabPaneParse() {
    const { autoParseVideoCountLimit } = useSettingsSnapshot();
    return jsxs("div", { css: S.cssTabPane, children: [
      jsxs(antd.Flex, { align: "center", gap: "large", children: [
        jsx("span", { css: S.configTitle, children: "自动解析最大影片数量" }),
        jsx(
          antd.Button,
          {
            onClick: () => {
              settings.autoParseVideoCountLimit = initialSettings.autoParseVideoCountLimit;
            },
            children: "重置"
          }
        )
      ] }),
      jsxs(antd.Flex, { align: "center", children: [
        jsx(
          antd.Slider,
          {
            css: css$1`
            flex: 1;
          `,
            value: autoParseVideoCountLimit,
            min: 5,
            max: 1e4,
            onChange: (val) => {
              settings.autoParseVideoCountLimit = val;
            }
          }
        ),
        jsx("span", { children: autoParseVideoCountLimit })
      ] })
    ] });
  }
  function TabPaneTag() {
    let { tagsForceOrder, tagsBlackList } = useSettingsSnapshot();
    tagsForceOrder = React__default.useMemo(() => lodash.uniq(tagsForceOrder).filter(Boolean), [tagsForceOrder]);
    tagsBlackList = React__default.useMemo(() => lodash.uniq(tagsBlackList).filter(Boolean), [tagsBlackList]);
    const [blacklistExpanded, setBlacklistExpanded] = React__default.useState(false);
    return jsxs("div", { css: S.cssTabPane, children: [
      jsxs("div", { "data-class": "config-part", css: S.configPart, children: [
        jsxs("div", { css: S.configTitle, children: [
          "Tag 置顶",
          jsx(HelpInfo, { children: "在 Tag 筛选界面置顶" })
        ] }),
        jsx(
          Search,
          {
            css: css$1`
            margin-top: 5px;
            margin-bottom: 5px;
          `,
            placeholder: "添加 Tag 置顶",
            enterButton: "添加",
            allowClear: true,
            onSearch: (val, e2) => {
              var _a;
              if (!val) return;
              const set = new Set(settings.tagsForceOrder);
              if (!set.has(val)) {
                set.add(val);
              } else {
                antd.message.warning(`${val} 已存在`);
              }
              settings.tagsForceOrder = Array.from(set);
              if (e2 == null ? void 0 : e2.target) {
                const el = e2.target;
                const clearBtn = (_a = el.closest(".ant-input-wrapper")) == null ? void 0 : _a.querySelector(".ant-input-clear-icon");
                clearBtn == null ? void 0 : clearBtn.click();
              }
            }
          }
        ),
        tagsForceOrder.length ? jsx(
          "div",
          {
            css: css$1`
              display: flex;
              flex-wrap: wrap;
              gap: 5px 10px;
            `,
            children: jsx(
              DndKitSortableList,
              {
                list: tagsForceOrder,
                getId: lodash.identity,
                onChange: (val) => {
                  settings.tagsForceOrder = val;
                },
                renderItem: (item2) => jsx(
                  TagItemDisplay,
                  {
                    tag: item2,
                    onDelete: (tag2) => {
                      const s2 = /* @__PURE__ */ new Set([...settings.tagsForceOrder]);
                      s2.delete(tag2);
                      settings.tagsForceOrder = Array.from(s2);
                    }
                  },
                  item2
                )
              }
            )
          }
        ) : jsx(antd.Empty, {})
      ] }),
      jsxs("div", { "data-class": "config-part", css: S.configPart, children: [
        jsxs("div", { css: S.configTitle, children: [
          "Tag 黑名单",
          jsx(HelpInfo, { children: "包含这些 Tag 的影片都会被剔除" }),
          jsx(antd.Tooltip, { title: "有些恶心所以默认收起的~", children: jsx(
            antd.Button,
            {
              shape: "circle",
              onClick: () => {
                setBlacklistExpanded((x2) => !x2);
              },
              css: css$1`
                margin-left: 20px;
              `,
              children: jsx(
                IconPark,
                {
                  name: "DownC",
                  size: 14,
                  css: css$1`
                  transition: transform 0.3s ease;
                  transform: ${blacklistExpanded ? "rotate(180deg)" : "rotate(0deg)"};
                `
                }
              )
            }
          ) })
        ] }),
        jsxs(CollapsePanel, { expanded: blacklistExpanded, children: [
          jsxs(
            antd.Space,
            {
              css: css$1`
              margin-top: 10px;
            `,
              children: [
                jsx(antd.Tooltip, { title: ["女装人妖", "变性者"].join(", "), children: jsx(
                  antd.Button,
                  {
                    size: "small",
                    onClick: () => {
                      settings.tagsBlackList = Array.from(/* @__PURE__ */ new Set([...settings.tagsBlackList, ...["女装人妖", "变性者"]]));
                    },
                    children: "添加 人妖 预设"
                  }
                ) }),
                jsx(
                  antd.Button,
                  {
                    size: "small",
                    onClick: () => {
                      settings.tagsBlackList = Array.from(
                        /* @__PURE__ */ new Set([...settings.tagsBlackList, ...["饮尿", "排便", "食粪", "粪便"]])
                      );
                    },
                    children: "添加 🤮恶心 预设"
                  }
                ),
                jsx(
                  FlagSettingItem,
                  {
                    configKey: "showBlackListCollectionCheckbox",
                    label: "在范围筛选中显示黑名单",
                    tooltip: jsxs(Fragment, { children: [
                      "勾选此项在",
                      HANZI_SINGLE,
                      " / ",
                      HANZI_COLLECTION,
                      " 处显示黑名单勾选框",
                      jsx("br", {}),
                      "如果你想查看黑名单过滤了哪些影片的话"
                    ] }),
                    extraAction: (val) => {
                      if (!val) {
                        store.includeRecord[CollectionType.BlackList] = false;
                      }
                    }
                  }
                )
              ]
            }
          ),
          jsx(
            Search,
            {
              css: css$1`
              margin-top: 5px;
              margin-bottom: 5px;
            `,
              placeholder: "添加 Tag 黑名单",
              enterButton: "添加",
              allowClear: true,
              onSearch: (val, e2) => {
                var _a;
                if (!val) return;
                const set = new Set(settings.tagsBlackList);
                if (!set.has(val)) {
                  set.add(val);
                } else {
                  antd.message.warning(`${val} 已存在`);
                }
                settings.tagsBlackList = Array.from(set);
                if (e2 == null ? void 0 : e2.target) {
                  const el = e2.target;
                  const clearBtn = (_a = el.closest(".ant-input-wrapper")) == null ? void 0 : _a.querySelector(".ant-input-clear-icon");
                  clearBtn == null ? void 0 : clearBtn.click();
                }
              }
            }
          ),
          tagsBlackList.length ? jsx(
            "div",
            {
              css: css$1`
                display: flex;
                flex-wrap: wrap;
                gap: 5px 10px;
              `,
              children: tagsBlackList.map((t2) => {
                return jsx(
                  TagItemDisplay,
                  {
                    tag: t2,
                    enableDragging: false,
                    onDelete: (tag2) => {
                      const s2 = /* @__PURE__ */ new Set([...settings.tagsBlackList]);
                      s2.delete(tag2);
                      settings.tagsBlackList = Array.from(s2);
                    }
                  },
                  t2
                );
              })
            }
          ) : jsx(antd.Empty, {})
        ] })
      ] })
    ] });
  }
  const TagItemDisplay = React__default.forwardRef(({ tag: tag2, enableDragging = true, dragging, className, onDelete, ...restProps }, ref) => {
    return jsxs(
      "div",
      {
        ...restProps,
        ref,
        className: cx(className, { dragging }),
        css: [
          css$1`
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 2px 15px;
          position: relative;

          display: inline-flex;
          align-items: center;

          &:hover,
          &.dragging {
            border-color: var(--ant-color-primary);
            color: var(--ant-color-primary);
            .anticon {
              visibility: visible;
            }
          }

          &.dragging {
            z-index: 10;
          }
        `,
          enableDragging && css$1`
            cursor: move;
          `
        ],
        children: [
          tag2,
          jsx(
            IconPark,
            {
              name: "CloseSmall",
              size: 16,
              onClick: () => {
                onDelete == null ? void 0 : onDelete(tag2);
              },
              css: css$1`
          cursor: pointer;
          margin-left: 5px;
          font-size: 12px;
        `
            }
          )
        ]
      }
    );
  });
  function TabPaneForum() {
    return jsx("div", { css: S.cssTabPane, children: jsxs("div", { "data-class": "config-part", css: S.configPart, children: [
      jsx("div", { css: S.configTitle, children: "论坛" }),
      jsx(
        FlagSettingItem,
        {
          configKey: "alwaysViewThreadInNewWindow",
          label: "总是使用新窗口查看帖子",
          tooltip: "新窗口打开帖子"
        }
      )
    ] }) });
  }
  function initSettingsUi() {
    GM_registerMenuCommand("设置", () => {
      showSettingsUi();
    });
  }
  function showSettingsUi() {
    settingsUiState.settingsModalOpen = true;
    renderOnce();
  }
  const renderOnce = lodash.once(() => {
    const div = document.createElement("div");
    const r2 = createRoot(div);
    r2.render(
      jsx(Fragment, { children: jsx(AntdAppWrapper, { children: jsx(SettingsUi, {}) }) })
    );
  });
  function logWithLabel(...args) {
    const [msg, ...rest] = args;
    if (typeof msg === "string") {
      console.log(`[${APP_NAME}]: ${msg}`, ...rest);
    } else {
      console.log(`[${APP_NAME}]: `, msg, ...rest);
    }
  }
  function getVideoCount() {
    const el = document.querySelector("#resultshowall, #resultshowmag");
    const count = /\d+/.exec((el == null ? void 0 : el.textContent) || "");
    if (!count) return 0;
    const num = Number(count[0]);
    return num;
  }
  function commonjsRequire(path) {
    throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }
  var localforage$1 = { exports: {} };
  /*!
      localForage -- Offline Storage, Improved
      Version 1.10.0
      https://localforage.github.io/localForage
      (c) 2013-2017 Mozilla, Apache License 2.0
  */
  (function(module, exports) {
    (function(f2) {
      {
        module.exports = f2();
      }
    })(function() {
      return function e2(t2, n2, r2) {
        function s2(o3, u2) {
          if (!n2[o3]) {
            if (!t2[o3]) {
              var a2 = typeof commonjsRequire == "function" && commonjsRequire;
              if (!u2 && a2) return a2(o3, true);
              if (i2) return i2(o3, true);
              var f2 = new Error("Cannot find module '" + o3 + "'");
              throw f2.code = "MODULE_NOT_FOUND", f2;
            }
            var l2 = n2[o3] = { exports: {} };
            t2[o3][0].call(l2.exports, function(e3) {
              var n3 = t2[o3][1][e3];
              return s2(n3 ? n3 : e3);
            }, l2, l2.exports, e2, t2, n2, r2);
          }
          return n2[o3].exports;
        }
        var i2 = typeof commonjsRequire == "function" && commonjsRequire;
        for (var o2 = 0; o2 < r2.length; o2++) s2(r2[o2]);
        return s2;
      }({ 1: [function(_dereq_, module2, exports2) {
        (function(global2) {
          var Mutation = global2.MutationObserver || global2.WebKitMutationObserver;
          var scheduleDrain;
          {
            if (Mutation) {
              var called = 0;
              var observer = new Mutation(nextTick);
              var element = global2.document.createTextNode("");
              observer.observe(element, {
                characterData: true
              });
              scheduleDrain = function() {
                element.data = called = ++called % 2;
              };
            } else if (!global2.setImmediate && typeof global2.MessageChannel !== "undefined") {
              var channel = new global2.MessageChannel();
              channel.port1.onmessage = nextTick;
              scheduleDrain = function() {
                channel.port2.postMessage(0);
              };
            } else if ("document" in global2 && "onreadystatechange" in global2.document.createElement("script")) {
              scheduleDrain = function() {
                var scriptEl = global2.document.createElement("script");
                scriptEl.onreadystatechange = function() {
                  nextTick();
                  scriptEl.onreadystatechange = null;
                  scriptEl.parentNode.removeChild(scriptEl);
                  scriptEl = null;
                };
                global2.document.documentElement.appendChild(scriptEl);
              };
            } else {
              scheduleDrain = function() {
                setTimeout(nextTick, 0);
              };
            }
          }
          var draining;
          var queue = [];
          function nextTick() {
            draining = true;
            var i2, oldQueue;
            var len = queue.length;
            while (len) {
              oldQueue = queue;
              queue = [];
              i2 = -1;
              while (++i2 < len) {
                oldQueue[i2]();
              }
              len = queue.length;
            }
            draining = false;
          }
          module2.exports = immediate;
          function immediate(task) {
            if (queue.push(task) === 1 && !draining) {
              scheduleDrain();
            }
          }
        }).call(this, typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, {}], 2: [function(_dereq_, module2, exports2) {
        var immediate = _dereq_(1);
        function INTERNAL() {
        }
        var handlers = {};
        var REJECTED = ["REJECTED"];
        var FULFILLED = ["FULFILLED"];
        var PENDING = ["PENDING"];
        module2.exports = Promise2;
        function Promise2(resolver) {
          if (typeof resolver !== "function") {
            throw new TypeError("resolver must be a function");
          }
          this.state = PENDING;
          this.queue = [];
          this.outcome = void 0;
          if (resolver !== INTERNAL) {
            safelyResolveThenable(this, resolver);
          }
        }
        Promise2.prototype["catch"] = function(onRejected) {
          return this.then(null, onRejected);
        };
        Promise2.prototype.then = function(onFulfilled, onRejected) {
          if (typeof onFulfilled !== "function" && this.state === FULFILLED || typeof onRejected !== "function" && this.state === REJECTED) {
            return this;
          }
          var promise = new this.constructor(INTERNAL);
          if (this.state !== PENDING) {
            var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
            unwrap(promise, resolver, this.outcome);
          } else {
            this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
          }
          return promise;
        };
        function QueueItem(promise, onFulfilled, onRejected) {
          this.promise = promise;
          if (typeof onFulfilled === "function") {
            this.onFulfilled = onFulfilled;
            this.callFulfilled = this.otherCallFulfilled;
          }
          if (typeof onRejected === "function") {
            this.onRejected = onRejected;
            this.callRejected = this.otherCallRejected;
          }
        }
        QueueItem.prototype.callFulfilled = function(value) {
          handlers.resolve(this.promise, value);
        };
        QueueItem.prototype.otherCallFulfilled = function(value) {
          unwrap(this.promise, this.onFulfilled, value);
        };
        QueueItem.prototype.callRejected = function(value) {
          handlers.reject(this.promise, value);
        };
        QueueItem.prototype.otherCallRejected = function(value) {
          unwrap(this.promise, this.onRejected, value);
        };
        function unwrap(promise, func, value) {
          immediate(function() {
            var returnValue;
            try {
              returnValue = func(value);
            } catch (e2) {
              return handlers.reject(promise, e2);
            }
            if (returnValue === promise) {
              handlers.reject(promise, new TypeError("Cannot resolve promise with itself"));
            } else {
              handlers.resolve(promise, returnValue);
            }
          });
        }
        handlers.resolve = function(self2, value) {
          var result = tryCatch(getThen, value);
          if (result.status === "error") {
            return handlers.reject(self2, result.value);
          }
          var thenable = result.value;
          if (thenable) {
            safelyResolveThenable(self2, thenable);
          } else {
            self2.state = FULFILLED;
            self2.outcome = value;
            var i2 = -1;
            var len = self2.queue.length;
            while (++i2 < len) {
              self2.queue[i2].callFulfilled(value);
            }
          }
          return self2;
        };
        handlers.reject = function(self2, error) {
          self2.state = REJECTED;
          self2.outcome = error;
          var i2 = -1;
          var len = self2.queue.length;
          while (++i2 < len) {
            self2.queue[i2].callRejected(error);
          }
          return self2;
        };
        function getThen(obj) {
          var then = obj && obj.then;
          if (obj && (typeof obj === "object" || typeof obj === "function") && typeof then === "function") {
            return function appyThen() {
              then.apply(obj, arguments);
            };
          }
        }
        function safelyResolveThenable(self2, thenable) {
          var called = false;
          function onError(value) {
            if (called) {
              return;
            }
            called = true;
            handlers.reject(self2, value);
          }
          function onSuccess(value) {
            if (called) {
              return;
            }
            called = true;
            handlers.resolve(self2, value);
          }
          function tryToUnwrap() {
            thenable(onSuccess, onError);
          }
          var result = tryCatch(tryToUnwrap);
          if (result.status === "error") {
            onError(result.value);
          }
        }
        function tryCatch(func, value) {
          var out = {};
          try {
            out.value = func(value);
            out.status = "success";
          } catch (e2) {
            out.status = "error";
            out.value = e2;
          }
          return out;
        }
        Promise2.resolve = resolve;
        function resolve(value) {
          if (value instanceof this) {
            return value;
          }
          return handlers.resolve(new this(INTERNAL), value);
        }
        Promise2.reject = reject;
        function reject(reason) {
          var promise = new this(INTERNAL);
          return handlers.reject(promise, reason);
        }
        Promise2.all = all;
        function all(iterable) {
          var self2 = this;
          if (Object.prototype.toString.call(iterable) !== "[object Array]") {
            return this.reject(new TypeError("must be an array"));
          }
          var len = iterable.length;
          var called = false;
          if (!len) {
            return this.resolve([]);
          }
          var values = new Array(len);
          var resolved = 0;
          var i2 = -1;
          var promise = new this(INTERNAL);
          while (++i2 < len) {
            allResolver(iterable[i2], i2);
          }
          return promise;
          function allResolver(value, i3) {
            self2.resolve(value).then(resolveFromAll, function(error) {
              if (!called) {
                called = true;
                handlers.reject(promise, error);
              }
            });
            function resolveFromAll(outValue) {
              values[i3] = outValue;
              if (++resolved === len && !called) {
                called = true;
                handlers.resolve(promise, values);
              }
            }
          }
        }
        Promise2.race = race;
        function race(iterable) {
          var self2 = this;
          if (Object.prototype.toString.call(iterable) !== "[object Array]") {
            return this.reject(new TypeError("must be an array"));
          }
          var len = iterable.length;
          var called = false;
          if (!len) {
            return this.resolve([]);
          }
          var i2 = -1;
          var promise = new this(INTERNAL);
          while (++i2 < len) {
            resolver(iterable[i2]);
          }
          return promise;
          function resolver(value) {
            self2.resolve(value).then(function(response) {
              if (!called) {
                called = true;
                handlers.resolve(promise, response);
              }
            }, function(error) {
              if (!called) {
                called = true;
                handlers.reject(promise, error);
              }
            });
          }
        }
      }, { "1": 1 }], 3: [function(_dereq_, module2, exports2) {
        (function(global2) {
          if (typeof global2.Promise !== "function") {
            global2.Promise = _dereq_(2);
          }
        }).call(this, typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
      }, { "2": 2 }], 4: [function(_dereq_, module2, exports2) {
        var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
          return typeof obj;
        } : function(obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        }
        function getIDB() {
          try {
            if (typeof indexedDB !== "undefined") {
              return indexedDB;
            }
            if (typeof webkitIndexedDB !== "undefined") {
              return webkitIndexedDB;
            }
            if (typeof mozIndexedDB !== "undefined") {
              return mozIndexedDB;
            }
            if (typeof OIndexedDB !== "undefined") {
              return OIndexedDB;
            }
            if (typeof msIndexedDB !== "undefined") {
              return msIndexedDB;
            }
          } catch (e2) {
            return;
          }
        }
        var idb = getIDB();
        function isIndexedDBValid() {
          try {
            if (!idb || !idb.open) {
              return false;
            }
            var isSafari = typeof openDatabase !== "undefined" && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);
            var hasFetch = typeof fetch === "function" && fetch.toString().indexOf("[native code") !== -1;
            return (!isSafari || hasFetch) && typeof indexedDB !== "undefined" && // some outdated implementations of IDB that appear on Samsung
            // and HTC Android devices <4.4 are missing IDBKeyRange
            // See: https://github.com/mozilla/localForage/issues/128
            // See: https://github.com/mozilla/localForage/issues/272
            typeof IDBKeyRange !== "undefined";
          } catch (e2) {
            return false;
          }
        }
        function createBlob(parts, properties2) {
          parts = parts || [];
          properties2 = properties2 || {};
          try {
            return new Blob(parts, properties2);
          } catch (e2) {
            if (e2.name !== "TypeError") {
              throw e2;
            }
            var Builder = typeof BlobBuilder !== "undefined" ? BlobBuilder : typeof MSBlobBuilder !== "undefined" ? MSBlobBuilder : typeof MozBlobBuilder !== "undefined" ? MozBlobBuilder : WebKitBlobBuilder;
            var builder = new Builder();
            for (var i2 = 0; i2 < parts.length; i2 += 1) {
              builder.append(parts[i2]);
            }
            return builder.getBlob(properties2.type);
          }
        }
        if (typeof Promise === "undefined") {
          _dereq_(3);
        }
        var Promise$1 = Promise;
        function executeCallback(promise, callback) {
          if (callback) {
            promise.then(function(result) {
              callback(null, result);
            }, function(error) {
              callback(error);
            });
          }
        }
        function executeTwoCallbacks(promise, callback, errorCallback) {
          if (typeof callback === "function") {
            promise.then(callback);
          }
          if (typeof errorCallback === "function") {
            promise["catch"](errorCallback);
          }
        }
        function normalizeKey(key2) {
          if (typeof key2 !== "string") {
            console.warn(key2 + " used as a key, but it is not a string.");
            key2 = String(key2);
          }
          return key2;
        }
        function getCallback() {
          if (arguments.length && typeof arguments[arguments.length - 1] === "function") {
            return arguments[arguments.length - 1];
          }
        }
        var DETECT_BLOB_SUPPORT_STORE = "local-forage-detect-blob-support";
        var supportsBlobs = void 0;
        var dbContexts = {};
        var toString = Object.prototype.toString;
        var READ_ONLY = "readonly";
        var READ_WRITE = "readwrite";
        function _binStringToArrayBuffer(bin) {
          var length3 = bin.length;
          var buf = new ArrayBuffer(length3);
          var arr = new Uint8Array(buf);
          for (var i2 = 0; i2 < length3; i2++) {
            arr[i2] = bin.charCodeAt(i2);
          }
          return buf;
        }
        function _checkBlobSupportWithoutCaching(idb2) {
          return new Promise$1(function(resolve) {
            var txn = idb2.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
            var blob = createBlob([""]);
            txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, "key");
            txn.onabort = function(e2) {
              e2.preventDefault();
              e2.stopPropagation();
              resolve(false);
            };
            txn.oncomplete = function() {
              var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
              var matchedEdge = navigator.userAgent.match(/Edge\//);
              resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
            };
          })["catch"](function() {
            return false;
          });
        }
        function _checkBlobSupport(idb2) {
          if (typeof supportsBlobs === "boolean") {
            return Promise$1.resolve(supportsBlobs);
          }
          return _checkBlobSupportWithoutCaching(idb2).then(function(value) {
            supportsBlobs = value;
            return supportsBlobs;
          });
        }
        function _deferReadiness(dbInfo) {
          var dbContext = dbContexts[dbInfo.name];
          var deferredOperation = {};
          deferredOperation.promise = new Promise$1(function(resolve, reject) {
            deferredOperation.resolve = resolve;
            deferredOperation.reject = reject;
          });
          dbContext.deferredOperations.push(deferredOperation);
          if (!dbContext.dbReady) {
            dbContext.dbReady = deferredOperation.promise;
          } else {
            dbContext.dbReady = dbContext.dbReady.then(function() {
              return deferredOperation.promise;
            });
          }
        }
        function _advanceReadiness(dbInfo) {
          var dbContext = dbContexts[dbInfo.name];
          var deferredOperation = dbContext.deferredOperations.pop();
          if (deferredOperation) {
            deferredOperation.resolve();
            return deferredOperation.promise;
          }
        }
        function _rejectReadiness(dbInfo, err) {
          var dbContext = dbContexts[dbInfo.name];
          var deferredOperation = dbContext.deferredOperations.pop();
          if (deferredOperation) {
            deferredOperation.reject(err);
            return deferredOperation.promise;
          }
        }
        function _getConnection(dbInfo, upgradeNeeded) {
          return new Promise$1(function(resolve, reject) {
            dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();
            if (dbInfo.db) {
              if (upgradeNeeded) {
                _deferReadiness(dbInfo);
                dbInfo.db.close();
              } else {
                return resolve(dbInfo.db);
              }
            }
            var dbArgs = [dbInfo.name];
            if (upgradeNeeded) {
              dbArgs.push(dbInfo.version);
            }
            var openreq = idb.open.apply(idb, dbArgs);
            if (upgradeNeeded) {
              openreq.onupgradeneeded = function(e2) {
                var db = openreq.result;
                try {
                  db.createObjectStore(dbInfo.storeName);
                  if (e2.oldVersion <= 1) {
                    db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                  }
                } catch (ex) {
                  if (ex.name === "ConstraintError") {
                    console.warn('The database "' + dbInfo.name + '" has been upgraded from version ' + e2.oldVersion + " to version " + e2.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                  } else {
                    throw ex;
                  }
                }
              };
            }
            openreq.onerror = function(e2) {
              e2.preventDefault();
              reject(openreq.error);
            };
            openreq.onsuccess = function() {
              var db = openreq.result;
              db.onversionchange = function(e2) {
                e2.target.close();
              };
              resolve(db);
              _advanceReadiness(dbInfo);
            };
          });
        }
        function _getOriginalConnection(dbInfo) {
          return _getConnection(dbInfo, false);
        }
        function _getUpgradedConnection(dbInfo) {
          return _getConnection(dbInfo, true);
        }
        function _isUpgradeNeeded(dbInfo, defaultVersion) {
          if (!dbInfo.db) {
            return true;
          }
          var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
          var isDowngrade = dbInfo.version < dbInfo.db.version;
          var isUpgrade = dbInfo.version > dbInfo.db.version;
          if (isDowngrade) {
            if (dbInfo.version !== defaultVersion) {
              console.warn('The database "' + dbInfo.name + `" can't be downgraded from version ` + dbInfo.db.version + " to version " + dbInfo.version + ".");
            }
            dbInfo.version = dbInfo.db.version;
          }
          if (isUpgrade || isNewStore) {
            if (isNewStore) {
              var incVersion = dbInfo.db.version + 1;
              if (incVersion > dbInfo.version) {
                dbInfo.version = incVersion;
              }
            }
            return true;
          }
          return false;
        }
        function _encodeBlob(blob) {
          return new Promise$1(function(resolve, reject) {
            var reader = new FileReader();
            reader.onerror = reject;
            reader.onloadend = function(e2) {
              var base64 = btoa(e2.target.result || "");
              resolve({
                __local_forage_encoded_blob: true,
                data: base64,
                type: blob.type
              });
            };
            reader.readAsBinaryString(blob);
          });
        }
        function _decodeBlob(encodedBlob) {
          var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
          return createBlob([arrayBuff], { type: encodedBlob.type });
        }
        function _isEncodedBlob(value) {
          return value && value.__local_forage_encoded_blob;
        }
        function _fullyReady(callback) {
          var self2 = this;
          var promise = self2._initReady().then(function() {
            var dbContext = dbContexts[self2._dbInfo.name];
            if (dbContext && dbContext.dbReady) {
              return dbContext.dbReady;
            }
          });
          executeTwoCallbacks(promise, callback, callback);
          return promise;
        }
        function _tryReconnect(dbInfo) {
          _deferReadiness(dbInfo);
          var dbContext = dbContexts[dbInfo.name];
          var forages = dbContext.forages;
          for (var i2 = 0; i2 < forages.length; i2++) {
            var forage = forages[i2];
            if (forage._dbInfo.db) {
              forage._dbInfo.db.close();
              forage._dbInfo.db = null;
            }
          }
          dbInfo.db = null;
          return _getOriginalConnection(dbInfo).then(function(db) {
            dbInfo.db = db;
            if (_isUpgradeNeeded(dbInfo)) {
              return _getUpgradedConnection(dbInfo);
            }
            return db;
          }).then(function(db) {
            dbInfo.db = dbContext.db = db;
            for (var i3 = 0; i3 < forages.length; i3++) {
              forages[i3]._dbInfo.db = db;
            }
          })["catch"](function(err) {
            _rejectReadiness(dbInfo, err);
            throw err;
          });
        }
        function createTransaction(dbInfo, mode, callback, retries) {
          if (retries === void 0) {
            retries = 1;
          }
          try {
            var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
            callback(null, tx);
          } catch (err) {
            if (retries > 0 && (!dbInfo.db || err.name === "InvalidStateError" || err.name === "NotFoundError")) {
              return Promise$1.resolve().then(function() {
                if (!dbInfo.db || err.name === "NotFoundError" && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                  if (dbInfo.db) {
                    dbInfo.version = dbInfo.db.version + 1;
                  }
                  return _getUpgradedConnection(dbInfo);
                }
              }).then(function() {
                return _tryReconnect(dbInfo).then(function() {
                  createTransaction(dbInfo, mode, callback, retries - 1);
                });
              })["catch"](callback);
            }
            callback(err);
          }
        }
        function createDbContext() {
          return {
            // Running localForages sharing a database.
            forages: [],
            // Shared database.
            db: null,
            // Database readiness (promise).
            dbReady: null,
            // Deferred operations on the database.
            deferredOperations: []
          };
        }
        function _initStorage(options) {
          var self2 = this;
          var dbInfo = {
            db: null
          };
          if (options) {
            for (var i2 in options) {
              dbInfo[i2] = options[i2];
            }
          }
          var dbContext = dbContexts[dbInfo.name];
          if (!dbContext) {
            dbContext = createDbContext();
            dbContexts[dbInfo.name] = dbContext;
          }
          dbContext.forages.push(self2);
          if (!self2._initReady) {
            self2._initReady = self2.ready;
            self2.ready = _fullyReady;
          }
          var initPromises = [];
          function ignoreErrors() {
            return Promise$1.resolve();
          }
          for (var j = 0; j < dbContext.forages.length; j++) {
            var forage = dbContext.forages[j];
            if (forage !== self2) {
              initPromises.push(forage._initReady()["catch"](ignoreErrors));
            }
          }
          var forages = dbContext.forages.slice(0);
          return Promise$1.all(initPromises).then(function() {
            dbInfo.db = dbContext.db;
            return _getOriginalConnection(dbInfo);
          }).then(function(db) {
            dbInfo.db = db;
            if (_isUpgradeNeeded(dbInfo, self2._defaultConfig.version)) {
              return _getUpgradedConnection(dbInfo);
            }
            return db;
          }).then(function(db) {
            dbInfo.db = dbContext.db = db;
            self2._dbInfo = dbInfo;
            for (var k2 = 0; k2 < forages.length; k2++) {
              var forage2 = forages[k2];
              if (forage2 !== self2) {
                forage2._dbInfo.db = dbInfo.db;
                forage2._dbInfo.version = dbInfo.version;
              }
            }
          });
        }
        function getItem(key2, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store2 = transaction.objectStore(self2._dbInfo.storeName);
                  var req = store2.get(key2);
                  req.onsuccess = function() {
                    var value = req.result;
                    if (value === void 0) {
                      value = null;
                    }
                    if (_isEncodedBlob(value)) {
                      value = _decodeBlob(value);
                    }
                    resolve(value);
                  };
                  req.onerror = function() {
                    reject(req.error);
                  };
                } catch (e2) {
                  reject(e2);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function iterate(iterator, callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store2 = transaction.objectStore(self2._dbInfo.storeName);
                  var req = store2.openCursor();
                  var iterationNumber = 1;
                  req.onsuccess = function() {
                    var cursor2 = req.result;
                    if (cursor2) {
                      var value = cursor2.value;
                      if (_isEncodedBlob(value)) {
                        value = _decodeBlob(value);
                      }
                      var result = iterator(value, cursor2.key, iterationNumber++);
                      if (result !== void 0) {
                        resolve(result);
                      } else {
                        cursor2["continue"]();
                      }
                    } else {
                      resolve();
                    }
                  };
                  req.onerror = function() {
                    reject(req.error);
                  };
                } catch (e2) {
                  reject(e2);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function setItem(key2, value, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = new Promise$1(function(resolve, reject) {
            var dbInfo;
            self2.ready().then(function() {
              dbInfo = self2._dbInfo;
              if (toString.call(value) === "[object Blob]") {
                return _checkBlobSupport(dbInfo.db).then(function(blobSupport) {
                  if (blobSupport) {
                    return value;
                  }
                  return _encodeBlob(value);
                });
              }
              return value;
            }).then(function(value2) {
              createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store2 = transaction.objectStore(self2._dbInfo.storeName);
                  if (value2 === null) {
                    value2 = void 0;
                  }
                  var req = store2.put(value2, key2);
                  transaction.oncomplete = function() {
                    if (value2 === void 0) {
                      value2 = null;
                    }
                    resolve(value2);
                  };
                  transaction.onabort = transaction.onerror = function() {
                    var err2 = req.error ? req.error : req.transaction.error;
                    reject(err2);
                  };
                } catch (e2) {
                  reject(e2);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function removeItem(key2, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store2 = transaction.objectStore(self2._dbInfo.storeName);
                  var req = store2["delete"](key2);
                  transaction.oncomplete = function() {
                    resolve();
                  };
                  transaction.onerror = function() {
                    reject(req.error);
                  };
                  transaction.onabort = function() {
                    var err2 = req.error ? req.error : req.transaction.error;
                    reject(err2);
                  };
                } catch (e2) {
                  reject(e2);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function clear(callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_WRITE, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store2 = transaction.objectStore(self2._dbInfo.storeName);
                  var req = store2.clear();
                  transaction.oncomplete = function() {
                    resolve();
                  };
                  transaction.onabort = transaction.onerror = function() {
                    var err2 = req.error ? req.error : req.transaction.error;
                    reject(err2);
                  };
                } catch (e2) {
                  reject(e2);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function length2(callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store2 = transaction.objectStore(self2._dbInfo.storeName);
                  var req = store2.count();
                  req.onsuccess = function() {
                    resolve(req.result);
                  };
                  req.onerror = function() {
                    reject(req.error);
                  };
                } catch (e2) {
                  reject(e2);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function key(n2, callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            if (n2 < 0) {
              resolve(null);
              return;
            }
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store2 = transaction.objectStore(self2._dbInfo.storeName);
                  var advanced = false;
                  var req = store2.openKeyCursor();
                  req.onsuccess = function() {
                    var cursor2 = req.result;
                    if (!cursor2) {
                      resolve(null);
                      return;
                    }
                    if (n2 === 0) {
                      resolve(cursor2.key);
                    } else {
                      if (!advanced) {
                        advanced = true;
                        cursor2.advance(n2);
                      } else {
                        resolve(cursor2.key);
                      }
                    }
                  };
                  req.onerror = function() {
                    reject(req.error);
                  };
                } catch (e2) {
                  reject(e2);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function keys(callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              createTransaction(self2._dbInfo, READ_ONLY, function(err, transaction) {
                if (err) {
                  return reject(err);
                }
                try {
                  var store2 = transaction.objectStore(self2._dbInfo.storeName);
                  var req = store2.openKeyCursor();
                  var keys2 = [];
                  req.onsuccess = function() {
                    var cursor2 = req.result;
                    if (!cursor2) {
                      resolve(keys2);
                      return;
                    }
                    keys2.push(cursor2.key);
                    cursor2["continue"]();
                  };
                  req.onerror = function() {
                    reject(req.error);
                  };
                } catch (e2) {
                  reject(e2);
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function dropInstance(options, callback) {
          callback = getCallback.apply(this, arguments);
          var currentConfig = this.config();
          options = typeof options !== "function" && options || {};
          if (!options.name) {
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
          }
          var self2 = this;
          var promise;
          if (!options.name) {
            promise = Promise$1.reject("Invalid arguments");
          } else {
            var isCurrentDb = options.name === currentConfig.name && self2._dbInfo.db;
            var dbPromise = isCurrentDb ? Promise$1.resolve(self2._dbInfo.db) : _getOriginalConnection(options).then(function(db) {
              var dbContext = dbContexts[options.name];
              var forages = dbContext.forages;
              dbContext.db = db;
              for (var i2 = 0; i2 < forages.length; i2++) {
                forages[i2]._dbInfo.db = db;
              }
              return db;
            });
            if (!options.storeName) {
              promise = dbPromise.then(function(db) {
                _deferReadiness(options);
                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;
                db.close();
                for (var i2 = 0; i2 < forages.length; i2++) {
                  var forage = forages[i2];
                  forage._dbInfo.db = null;
                }
                var dropDBPromise = new Promise$1(function(resolve, reject) {
                  var req = idb.deleteDatabase(options.name);
                  req.onerror = function() {
                    var db2 = req.result;
                    if (db2) {
                      db2.close();
                    }
                    reject(req.error);
                  };
                  req.onblocked = function() {
                    console.warn('dropInstance blocked for database "' + options.name + '" until all open connections are closed');
                  };
                  req.onsuccess = function() {
                    var db2 = req.result;
                    if (db2) {
                      db2.close();
                    }
                    resolve(db2);
                  };
                });
                return dropDBPromise.then(function(db2) {
                  dbContext.db = db2;
                  for (var i3 = 0; i3 < forages.length; i3++) {
                    var _forage = forages[i3];
                    _advanceReadiness(_forage._dbInfo);
                  }
                })["catch"](function(err) {
                  (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function() {
                  });
                  throw err;
                });
              });
            } else {
              promise = dbPromise.then(function(db) {
                if (!db.objectStoreNames.contains(options.storeName)) {
                  return;
                }
                var newVersion = db.version + 1;
                _deferReadiness(options);
                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;
                db.close();
                for (var i2 = 0; i2 < forages.length; i2++) {
                  var forage = forages[i2];
                  forage._dbInfo.db = null;
                  forage._dbInfo.version = newVersion;
                }
                var dropObjectPromise = new Promise$1(function(resolve, reject) {
                  var req = idb.open(options.name, newVersion);
                  req.onerror = function(err) {
                    var db2 = req.result;
                    db2.close();
                    reject(err);
                  };
                  req.onupgradeneeded = function() {
                    var db2 = req.result;
                    db2.deleteObjectStore(options.storeName);
                  };
                  req.onsuccess = function() {
                    var db2 = req.result;
                    db2.close();
                    resolve(db2);
                  };
                });
                return dropObjectPromise.then(function(db2) {
                  dbContext.db = db2;
                  for (var j = 0; j < forages.length; j++) {
                    var _forage2 = forages[j];
                    _forage2._dbInfo.db = db2;
                    _advanceReadiness(_forage2._dbInfo);
                  }
                })["catch"](function(err) {
                  (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function() {
                  });
                  throw err;
                });
              });
            }
          }
          executeCallback(promise, callback);
          return promise;
        }
        var asyncStorage = {
          _driver: "asyncStorage",
          _initStorage,
          _support: isIndexedDBValid(),
          iterate,
          getItem,
          setItem,
          removeItem,
          clear,
          length: length2,
          key,
          keys,
          dropInstance
        };
        function isWebSQLValid() {
          return typeof openDatabase === "function";
        }
        var BASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var BLOB_TYPE_PREFIX = "~~local_forage_type~";
        var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;
        var SERIALIZED_MARKER = "__lfsc__:";
        var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;
        var TYPE_ARRAYBUFFER = "arbf";
        var TYPE_BLOB = "blob";
        var TYPE_INT8ARRAY = "si08";
        var TYPE_UINT8ARRAY = "ui08";
        var TYPE_UINT8CLAMPEDARRAY = "uic8";
        var TYPE_INT16ARRAY = "si16";
        var TYPE_INT32ARRAY = "si32";
        var TYPE_UINT16ARRAY = "ur16";
        var TYPE_UINT32ARRAY = "ui32";
        var TYPE_FLOAT32ARRAY = "fl32";
        var TYPE_FLOAT64ARRAY = "fl64";
        var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;
        var toString$1 = Object.prototype.toString;
        function stringToBuffer(serializedString) {
          var bufferLength = serializedString.length * 0.75;
          var len = serializedString.length;
          var i2;
          var p2 = 0;
          var encoded1, encoded2, encoded3, encoded4;
          if (serializedString[serializedString.length - 1] === "=") {
            bufferLength--;
            if (serializedString[serializedString.length - 2] === "=") {
              bufferLength--;
            }
          }
          var buffer = new ArrayBuffer(bufferLength);
          var bytes = new Uint8Array(buffer);
          for (i2 = 0; i2 < len; i2 += 4) {
            encoded1 = BASE_CHARS.indexOf(serializedString[i2]);
            encoded2 = BASE_CHARS.indexOf(serializedString[i2 + 1]);
            encoded3 = BASE_CHARS.indexOf(serializedString[i2 + 2]);
            encoded4 = BASE_CHARS.indexOf(serializedString[i2 + 3]);
            bytes[p2++] = encoded1 << 2 | encoded2 >> 4;
            bytes[p2++] = (encoded2 & 15) << 4 | encoded3 >> 2;
            bytes[p2++] = (encoded3 & 3) << 6 | encoded4 & 63;
          }
          return buffer;
        }
        function bufferToString(buffer) {
          var bytes = new Uint8Array(buffer);
          var base64String = "";
          var i2;
          for (i2 = 0; i2 < bytes.length; i2 += 3) {
            base64String += BASE_CHARS[bytes[i2] >> 2];
            base64String += BASE_CHARS[(bytes[i2] & 3) << 4 | bytes[i2 + 1] >> 4];
            base64String += BASE_CHARS[(bytes[i2 + 1] & 15) << 2 | bytes[i2 + 2] >> 6];
            base64String += BASE_CHARS[bytes[i2 + 2] & 63];
          }
          if (bytes.length % 3 === 2) {
            base64String = base64String.substring(0, base64String.length - 1) + "=";
          } else if (bytes.length % 3 === 1) {
            base64String = base64String.substring(0, base64String.length - 2) + "==";
          }
          return base64String;
        }
        function serialize2(value, callback) {
          var valueType = "";
          if (value) {
            valueType = toString$1.call(value);
          }
          if (value && (valueType === "[object ArrayBuffer]" || value.buffer && toString$1.call(value.buffer) === "[object ArrayBuffer]")) {
            var buffer;
            var marker = SERIALIZED_MARKER;
            if (value instanceof ArrayBuffer) {
              buffer = value;
              marker += TYPE_ARRAYBUFFER;
            } else {
              buffer = value.buffer;
              if (valueType === "[object Int8Array]") {
                marker += TYPE_INT8ARRAY;
              } else if (valueType === "[object Uint8Array]") {
                marker += TYPE_UINT8ARRAY;
              } else if (valueType === "[object Uint8ClampedArray]") {
                marker += TYPE_UINT8CLAMPEDARRAY;
              } else if (valueType === "[object Int16Array]") {
                marker += TYPE_INT16ARRAY;
              } else if (valueType === "[object Uint16Array]") {
                marker += TYPE_UINT16ARRAY;
              } else if (valueType === "[object Int32Array]") {
                marker += TYPE_INT32ARRAY;
              } else if (valueType === "[object Uint32Array]") {
                marker += TYPE_UINT32ARRAY;
              } else if (valueType === "[object Float32Array]") {
                marker += TYPE_FLOAT32ARRAY;
              } else if (valueType === "[object Float64Array]") {
                marker += TYPE_FLOAT64ARRAY;
              } else {
                callback(new Error("Failed to get type for BinaryArray"));
              }
            }
            callback(marker + bufferToString(buffer));
          } else if (valueType === "[object Blob]") {
            var fileReader = new FileReader();
            fileReader.onload = function() {
              var str = BLOB_TYPE_PREFIX + value.type + "~" + bufferToString(this.result);
              callback(SERIALIZED_MARKER + TYPE_BLOB + str);
            };
            fileReader.readAsArrayBuffer(value);
          } else {
            try {
              callback(JSON.stringify(value));
            } catch (e2) {
              console.error("Couldn't convert value into a JSON string: ", value);
              callback(null, e2);
            }
          }
        }
        function deserialize(value) {
          if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
            return JSON.parse(value);
          }
          var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
          var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
          var blobType;
          if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
            var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
            blobType = matcher[1];
            serializedString = serializedString.substring(matcher[0].length);
          }
          var buffer = stringToBuffer(serializedString);
          switch (type) {
            case TYPE_ARRAYBUFFER:
              return buffer;
            case TYPE_BLOB:
              return createBlob([buffer], { type: blobType });
            case TYPE_INT8ARRAY:
              return new Int8Array(buffer);
            case TYPE_UINT8ARRAY:
              return new Uint8Array(buffer);
            case TYPE_UINT8CLAMPEDARRAY:
              return new Uint8ClampedArray(buffer);
            case TYPE_INT16ARRAY:
              return new Int16Array(buffer);
            case TYPE_UINT16ARRAY:
              return new Uint16Array(buffer);
            case TYPE_INT32ARRAY:
              return new Int32Array(buffer);
            case TYPE_UINT32ARRAY:
              return new Uint32Array(buffer);
            case TYPE_FLOAT32ARRAY:
              return new Float32Array(buffer);
            case TYPE_FLOAT64ARRAY:
              return new Float64Array(buffer);
            default:
              throw new Error("Unkown type: " + type);
          }
        }
        var localforageSerializer = {
          serialize: serialize2,
          deserialize,
          stringToBuffer,
          bufferToString
        };
        function createDbTable(t2, dbInfo, callback, errorCallback) {
          t2.executeSql("CREATE TABLE IF NOT EXISTS " + dbInfo.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], callback, errorCallback);
        }
        function _initStorage$1(options) {
          var self2 = this;
          var dbInfo = {
            db: null
          };
          if (options) {
            for (var i2 in options) {
              dbInfo[i2] = typeof options[i2] !== "string" ? options[i2].toString() : options[i2];
            }
          }
          var dbInfoPromise = new Promise$1(function(resolve, reject) {
            try {
              dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
            } catch (e2) {
              return reject(e2);
            }
            dbInfo.db.transaction(function(t2) {
              createDbTable(t2, dbInfo, function() {
                self2._dbInfo = dbInfo;
                resolve();
              }, function(t3, error) {
                reject(error);
              });
            }, reject);
          });
          dbInfo.serializer = localforageSerializer;
          return dbInfoPromise;
        }
        function tryExecuteSql(t2, dbInfo, sqlStatement, args, callback, errorCallback) {
          t2.executeSql(sqlStatement, args, callback, function(t3, error) {
            if (error.code === error.SYNTAX_ERR) {
              t3.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [dbInfo.storeName], function(t4, results) {
                if (!results.rows.length) {
                  createDbTable(t4, dbInfo, function() {
                    t4.executeSql(sqlStatement, args, callback, errorCallback);
                  }, errorCallback);
                } else {
                  errorCallback(t4, error);
                }
              }, errorCallback);
            } else {
              errorCallback(t3, error);
            }
          }, errorCallback);
        }
        function getItem$1(key2, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t2) {
                tryExecuteSql(t2, dbInfo, "SELECT * FROM " + dbInfo.storeName + " WHERE key = ? LIMIT 1", [key2], function(t3, results) {
                  var result = results.rows.length ? results.rows.item(0).value : null;
                  if (result) {
                    result = dbInfo.serializer.deserialize(result);
                  }
                  resolve(result);
                }, function(t3, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function iterate$1(iterator, callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t2) {
                tryExecuteSql(t2, dbInfo, "SELECT * FROM " + dbInfo.storeName, [], function(t3, results) {
                  var rows = results.rows;
                  var length3 = rows.length;
                  for (var i2 = 0; i2 < length3; i2++) {
                    var item2 = rows.item(i2);
                    var result = item2.value;
                    if (result) {
                      result = dbInfo.serializer.deserialize(result);
                    }
                    result = iterator(result, item2.key, i2 + 1);
                    if (result !== void 0) {
                      resolve(result);
                      return;
                    }
                  }
                  resolve();
                }, function(t3, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function _setItem(key2, value, callback, retriesLeft) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              if (value === void 0) {
                value = null;
              }
              var originalValue = value;
              var dbInfo = self2._dbInfo;
              dbInfo.serializer.serialize(value, function(value2, error) {
                if (error) {
                  reject(error);
                } else {
                  dbInfo.db.transaction(function(t2) {
                    tryExecuteSql(t2, dbInfo, "INSERT OR REPLACE INTO " + dbInfo.storeName + " (key, value) VALUES (?, ?)", [key2, value2], function() {
                      resolve(originalValue);
                    }, function(t3, error2) {
                      reject(error2);
                    });
                  }, function(sqlError) {
                    if (sqlError.code === sqlError.QUOTA_ERR) {
                      if (retriesLeft > 0) {
                        resolve(_setItem.apply(self2, [key2, originalValue, callback, retriesLeft - 1]));
                        return;
                      }
                      reject(sqlError);
                    }
                  });
                }
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function setItem$1(key2, value, callback) {
          return _setItem.apply(this, [key2, value, callback, 1]);
        }
        function removeItem$1(key2, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t2) {
                tryExecuteSql(t2, dbInfo, "DELETE FROM " + dbInfo.storeName + " WHERE key = ?", [key2], function() {
                  resolve();
                }, function(t3, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function clear$1(callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t2) {
                tryExecuteSql(t2, dbInfo, "DELETE FROM " + dbInfo.storeName, [], function() {
                  resolve();
                }, function(t3, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function length$1(callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t2) {
                tryExecuteSql(t2, dbInfo, "SELECT COUNT(key) as c FROM " + dbInfo.storeName, [], function(t3, results) {
                  var result = results.rows.item(0).c;
                  resolve(result);
                }, function(t3, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function key$1(n2, callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t2) {
                tryExecuteSql(t2, dbInfo, "SELECT key FROM " + dbInfo.storeName + " WHERE id = ? LIMIT 1", [n2 + 1], function(t3, results) {
                  var result = results.rows.length ? results.rows.item(0).key : null;
                  resolve(result);
                }, function(t3, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function keys$1(callback) {
          var self2 = this;
          var promise = new Promise$1(function(resolve, reject) {
            self2.ready().then(function() {
              var dbInfo = self2._dbInfo;
              dbInfo.db.transaction(function(t2) {
                tryExecuteSql(t2, dbInfo, "SELECT key FROM " + dbInfo.storeName, [], function(t3, results) {
                  var keys2 = [];
                  for (var i2 = 0; i2 < results.rows.length; i2++) {
                    keys2.push(results.rows.item(i2).key);
                  }
                  resolve(keys2);
                }, function(t3, error) {
                  reject(error);
                });
              });
            })["catch"](reject);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function getAllStoreNames(db) {
          return new Promise$1(function(resolve, reject) {
            db.transaction(function(t2) {
              t2.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function(t3, results) {
                var storeNames = [];
                for (var i2 = 0; i2 < results.rows.length; i2++) {
                  storeNames.push(results.rows.item(i2).name);
                }
                resolve({
                  db,
                  storeNames
                });
              }, function(t3, error) {
                reject(error);
              });
            }, function(sqlError) {
              reject(sqlError);
            });
          });
        }
        function dropInstance$1(options, callback) {
          callback = getCallback.apply(this, arguments);
          var currentConfig = this.config();
          options = typeof options !== "function" && options || {};
          if (!options.name) {
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
          }
          var self2 = this;
          var promise;
          if (!options.name) {
            promise = Promise$1.reject("Invalid arguments");
          } else {
            promise = new Promise$1(function(resolve) {
              var db;
              if (options.name === currentConfig.name) {
                db = self2._dbInfo.db;
              } else {
                db = openDatabase(options.name, "", "", 0);
              }
              if (!options.storeName) {
                resolve(getAllStoreNames(db));
              } else {
                resolve({
                  db,
                  storeNames: [options.storeName]
                });
              }
            }).then(function(operationInfo) {
              return new Promise$1(function(resolve, reject) {
                operationInfo.db.transaction(function(t2) {
                  function dropTable(storeName) {
                    return new Promise$1(function(resolve2, reject2) {
                      t2.executeSql("DROP TABLE IF EXISTS " + storeName, [], function() {
                        resolve2();
                      }, function(t3, error) {
                        reject2(error);
                      });
                    });
                  }
                  var operations = [];
                  for (var i2 = 0, len = operationInfo.storeNames.length; i2 < len; i2++) {
                    operations.push(dropTable(operationInfo.storeNames[i2]));
                  }
                  Promise$1.all(operations).then(function() {
                    resolve();
                  })["catch"](function(e2) {
                    reject(e2);
                  });
                }, function(sqlError) {
                  reject(sqlError);
                });
              });
            });
          }
          executeCallback(promise, callback);
          return promise;
        }
        var webSQLStorage = {
          _driver: "webSQLStorage",
          _initStorage: _initStorage$1,
          _support: isWebSQLValid(),
          iterate: iterate$1,
          getItem: getItem$1,
          setItem: setItem$1,
          removeItem: removeItem$1,
          clear: clear$1,
          length: length$1,
          key: key$1,
          keys: keys$1,
          dropInstance: dropInstance$1
        };
        function isLocalStorageValid() {
          try {
            return typeof localStorage !== "undefined" && "setItem" in localStorage && // in IE8 typeof localStorage.setItem === 'object'
            !!localStorage.setItem;
          } catch (e2) {
            return false;
          }
        }
        function _getKeyPrefix(options, defaultConfig) {
          var keyPrefix = options.name + "/";
          if (options.storeName !== defaultConfig.storeName) {
            keyPrefix += options.storeName + "/";
          }
          return keyPrefix;
        }
        function checkIfLocalStorageThrows() {
          var localStorageTestKey = "_localforage_support_test";
          try {
            localStorage.setItem(localStorageTestKey, true);
            localStorage.removeItem(localStorageTestKey);
            return false;
          } catch (e2) {
            return true;
          }
        }
        function _isLocalStorageUsable() {
          return !checkIfLocalStorageThrows() || localStorage.length > 0;
        }
        function _initStorage$2(options) {
          var self2 = this;
          var dbInfo = {};
          if (options) {
            for (var i2 in options) {
              dbInfo[i2] = options[i2];
            }
          }
          dbInfo.keyPrefix = _getKeyPrefix(options, self2._defaultConfig);
          if (!_isLocalStorageUsable()) {
            return Promise$1.reject();
          }
          self2._dbInfo = dbInfo;
          dbInfo.serializer = localforageSerializer;
          return Promise$1.resolve();
        }
        function clear$2(callback) {
          var self2 = this;
          var promise = self2.ready().then(function() {
            var keyPrefix = self2._dbInfo.keyPrefix;
            for (var i2 = localStorage.length - 1; i2 >= 0; i2--) {
              var key2 = localStorage.key(i2);
              if (key2.indexOf(keyPrefix) === 0) {
                localStorage.removeItem(key2);
              }
            }
          });
          executeCallback(promise, callback);
          return promise;
        }
        function getItem$2(key2, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = self2.ready().then(function() {
            var dbInfo = self2._dbInfo;
            var result = localStorage.getItem(dbInfo.keyPrefix + key2);
            if (result) {
              result = dbInfo.serializer.deserialize(result);
            }
            return result;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function iterate$2(iterator, callback) {
          var self2 = this;
          var promise = self2.ready().then(function() {
            var dbInfo = self2._dbInfo;
            var keyPrefix = dbInfo.keyPrefix;
            var keyPrefixLength = keyPrefix.length;
            var length3 = localStorage.length;
            var iterationNumber = 1;
            for (var i2 = 0; i2 < length3; i2++) {
              var key2 = localStorage.key(i2);
              if (key2.indexOf(keyPrefix) !== 0) {
                continue;
              }
              var value = localStorage.getItem(key2);
              if (value) {
                value = dbInfo.serializer.deserialize(value);
              }
              value = iterator(value, key2.substring(keyPrefixLength), iterationNumber++);
              if (value !== void 0) {
                return value;
              }
            }
          });
          executeCallback(promise, callback);
          return promise;
        }
        function key$2(n2, callback) {
          var self2 = this;
          var promise = self2.ready().then(function() {
            var dbInfo = self2._dbInfo;
            var result;
            try {
              result = localStorage.key(n2);
            } catch (error) {
              result = null;
            }
            if (result) {
              result = result.substring(dbInfo.keyPrefix.length);
            }
            return result;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function keys$2(callback) {
          var self2 = this;
          var promise = self2.ready().then(function() {
            var dbInfo = self2._dbInfo;
            var length3 = localStorage.length;
            var keys2 = [];
            for (var i2 = 0; i2 < length3; i2++) {
              var itemKey = localStorage.key(i2);
              if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                keys2.push(itemKey.substring(dbInfo.keyPrefix.length));
              }
            }
            return keys2;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function length$2(callback) {
          var self2 = this;
          var promise = self2.keys().then(function(keys2) {
            return keys2.length;
          });
          executeCallback(promise, callback);
          return promise;
        }
        function removeItem$2(key2, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = self2.ready().then(function() {
            var dbInfo = self2._dbInfo;
            localStorage.removeItem(dbInfo.keyPrefix + key2);
          });
          executeCallback(promise, callback);
          return promise;
        }
        function setItem$2(key2, value, callback) {
          var self2 = this;
          key2 = normalizeKey(key2);
          var promise = self2.ready().then(function() {
            if (value === void 0) {
              value = null;
            }
            var originalValue = value;
            return new Promise$1(function(resolve, reject) {
              var dbInfo = self2._dbInfo;
              dbInfo.serializer.serialize(value, function(value2, error) {
                if (error) {
                  reject(error);
                } else {
                  try {
                    localStorage.setItem(dbInfo.keyPrefix + key2, value2);
                    resolve(originalValue);
                  } catch (e2) {
                    if (e2.name === "QuotaExceededError" || e2.name === "NS_ERROR_DOM_QUOTA_REACHED") {
                      reject(e2);
                    }
                    reject(e2);
                  }
                }
              });
            });
          });
          executeCallback(promise, callback);
          return promise;
        }
        function dropInstance$2(options, callback) {
          callback = getCallback.apply(this, arguments);
          options = typeof options !== "function" && options || {};
          if (!options.name) {
            var currentConfig = this.config();
            options.name = options.name || currentConfig.name;
            options.storeName = options.storeName || currentConfig.storeName;
          }
          var self2 = this;
          var promise;
          if (!options.name) {
            promise = Promise$1.reject("Invalid arguments");
          } else {
            promise = new Promise$1(function(resolve) {
              if (!options.storeName) {
                resolve(options.name + "/");
              } else {
                resolve(_getKeyPrefix(options, self2._defaultConfig));
              }
            }).then(function(keyPrefix) {
              for (var i2 = localStorage.length - 1; i2 >= 0; i2--) {
                var key2 = localStorage.key(i2);
                if (key2.indexOf(keyPrefix) === 0) {
                  localStorage.removeItem(key2);
                }
              }
            });
          }
          executeCallback(promise, callback);
          return promise;
        }
        var localStorageWrapper = {
          _driver: "localStorageWrapper",
          _initStorage: _initStorage$2,
          _support: isLocalStorageValid(),
          iterate: iterate$2,
          getItem: getItem$2,
          setItem: setItem$2,
          removeItem: removeItem$2,
          clear: clear$2,
          length: length$2,
          key: key$2,
          keys: keys$2,
          dropInstance: dropInstance$2
        };
        var sameValue = function sameValue2(x2, y2) {
          return x2 === y2 || typeof x2 === "number" && typeof y2 === "number" && isNaN(x2) && isNaN(y2);
        };
        var includes = function includes2(array, searchElement) {
          var len = array.length;
          var i2 = 0;
          while (i2 < len) {
            if (sameValue(array[i2], searchElement)) {
              return true;
            }
            i2++;
          }
          return false;
        };
        var isArray = Array.isArray || function(arg) {
          return Object.prototype.toString.call(arg) === "[object Array]";
        };
        var DefinedDrivers = {};
        var DriverSupport = {};
        var DefaultDrivers = {
          INDEXEDDB: asyncStorage,
          WEBSQL: webSQLStorage,
          LOCALSTORAGE: localStorageWrapper
        };
        var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];
        var OptionalDriverMethods = ["dropInstance"];
        var LibraryMethods = ["clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem"].concat(OptionalDriverMethods);
        var DefaultConfig = {
          description: "",
          driver: DefaultDriverOrder.slice(),
          name: "localforage",
          // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
          // we can use without a prompt.
          size: 4980736,
          storeName: "keyvaluepairs",
          version: 1
        };
        function callWhenReady(localForageInstance, libraryMethod) {
          localForageInstance[libraryMethod] = function() {
            var _args = arguments;
            return localForageInstance.ready().then(function() {
              return localForageInstance[libraryMethod].apply(localForageInstance, _args);
            });
          };
        }
        function extend() {
          for (var i2 = 1; i2 < arguments.length; i2++) {
            var arg = arguments[i2];
            if (arg) {
              for (var _key in arg) {
                if (arg.hasOwnProperty(_key)) {
                  if (isArray(arg[_key])) {
                    arguments[0][_key] = arg[_key].slice();
                  } else {
                    arguments[0][_key] = arg[_key];
                  }
                }
              }
            }
          }
          return arguments[0];
        }
        var LocalForage = function() {
          function LocalForage2(options) {
            _classCallCheck(this, LocalForage2);
            for (var driverTypeKey in DefaultDrivers) {
              if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                var driver = DefaultDrivers[driverTypeKey];
                var driverName = driver._driver;
                this[driverTypeKey] = driverName;
                if (!DefinedDrivers[driverName]) {
                  this.defineDriver(driver);
                }
              }
            }
            this._defaultConfig = extend({}, DefaultConfig);
            this._config = extend({}, this._defaultConfig, options);
            this._driverSet = null;
            this._initDriver = null;
            this._ready = false;
            this._dbInfo = null;
            this._wrapLibraryMethodsWithReady();
            this.setDriver(this._config.driver)["catch"](function() {
            });
          }
          LocalForage2.prototype.config = function config(options) {
            if ((typeof options === "undefined" ? "undefined" : _typeof2(options)) === "object") {
              if (this._ready) {
                return new Error("Can't call config() after localforage has been used.");
              }
              for (var i2 in options) {
                if (i2 === "storeName") {
                  options[i2] = options[i2].replace(/\W/g, "_");
                }
                if (i2 === "version" && typeof options[i2] !== "number") {
                  return new Error("Database version must be a number.");
                }
                this._config[i2] = options[i2];
              }
              if ("driver" in options && options.driver) {
                return this.setDriver(this._config.driver);
              }
              return true;
            } else if (typeof options === "string") {
              return this._config[options];
            } else {
              return this._config;
            }
          };
          LocalForage2.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
            var promise = new Promise$1(function(resolve, reject) {
              try {
                var driverName = driverObject._driver;
                var complianceError = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                if (!driverObject._driver) {
                  reject(complianceError);
                  return;
                }
                var driverMethods = LibraryMethods.concat("_initStorage");
                for (var i2 = 0, len = driverMethods.length; i2 < len; i2++) {
                  var driverMethodName = driverMethods[i2];
                  var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                  if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== "function") {
                    reject(complianceError);
                    return;
                  }
                }
                var configureMissingMethods = function configureMissingMethods2() {
                  var methodNotImplementedFactory = function methodNotImplementedFactory2(methodName) {
                    return function() {
                      var error = new Error("Method " + methodName + " is not implemented by the current driver");
                      var promise2 = Promise$1.reject(error);
                      executeCallback(promise2, arguments[arguments.length - 1]);
                      return promise2;
                    };
                  };
                  for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                    var optionalDriverMethod = OptionalDriverMethods[_i];
                    if (!driverObject[optionalDriverMethod]) {
                      driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                    }
                  }
                };
                configureMissingMethods();
                var setDriverSupport = function setDriverSupport2(support) {
                  if (DefinedDrivers[driverName]) {
                    console.info("Redefining LocalForage driver: " + driverName);
                  }
                  DefinedDrivers[driverName] = driverObject;
                  DriverSupport[driverName] = support;
                  resolve();
                };
                if ("_support" in driverObject) {
                  if (driverObject._support && typeof driverObject._support === "function") {
                    driverObject._support().then(setDriverSupport, reject);
                  } else {
                    setDriverSupport(!!driverObject._support);
                  }
                } else {
                  setDriverSupport(true);
                }
              } catch (e2) {
                reject(e2);
              }
            });
            executeTwoCallbacks(promise, callback, errorCallback);
            return promise;
          };
          LocalForage2.prototype.driver = function driver() {
            return this._driver || null;
          };
          LocalForage2.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
            var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error("Driver not found."));
            executeTwoCallbacks(getDriverPromise, callback, errorCallback);
            return getDriverPromise;
          };
          LocalForage2.prototype.getSerializer = function getSerializer(callback) {
            var serializerPromise = Promise$1.resolve(localforageSerializer);
            executeTwoCallbacks(serializerPromise, callback);
            return serializerPromise;
          };
          LocalForage2.prototype.ready = function ready(callback) {
            var self2 = this;
            var promise = self2._driverSet.then(function() {
              if (self2._ready === null) {
                self2._ready = self2._initDriver();
              }
              return self2._ready;
            });
            executeTwoCallbacks(promise, callback, callback);
            return promise;
          };
          LocalForage2.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
            var self2 = this;
            if (!isArray(drivers)) {
              drivers = [drivers];
            }
            var supportedDrivers = this._getSupportedDrivers(drivers);
            function setDriverToConfig() {
              self2._config.driver = self2.driver();
            }
            function extendSelfWithDriver(driver) {
              self2._extend(driver);
              setDriverToConfig();
              self2._ready = self2._initStorage(self2._config);
              return self2._ready;
            }
            function initDriver(supportedDrivers2) {
              return function() {
                var currentDriverIndex = 0;
                function driverPromiseLoop() {
                  while (currentDriverIndex < supportedDrivers2.length) {
                    var driverName = supportedDrivers2[currentDriverIndex];
                    currentDriverIndex++;
                    self2._dbInfo = null;
                    self2._ready = null;
                    return self2.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                  }
                  setDriverToConfig();
                  var error = new Error("No available storage method found.");
                  self2._driverSet = Promise$1.reject(error);
                  return self2._driverSet;
                }
                return driverPromiseLoop();
              };
            }
            var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function() {
              return Promise$1.resolve();
            }) : Promise$1.resolve();
            this._driverSet = oldDriverSetDone.then(function() {
              var driverName = supportedDrivers[0];
              self2._dbInfo = null;
              self2._ready = null;
              return self2.getDriver(driverName).then(function(driver) {
                self2._driver = driver._driver;
                setDriverToConfig();
                self2._wrapLibraryMethodsWithReady();
                self2._initDriver = initDriver(supportedDrivers);
              });
            })["catch"](function() {
              setDriverToConfig();
              var error = new Error("No available storage method found.");
              self2._driverSet = Promise$1.reject(error);
              return self2._driverSet;
            });
            executeTwoCallbacks(this._driverSet, callback, errorCallback);
            return this._driverSet;
          };
          LocalForage2.prototype.supports = function supports(driverName) {
            return !!DriverSupport[driverName];
          };
          LocalForage2.prototype._extend = function _extend(libraryMethodsAndProperties) {
            extend(this, libraryMethodsAndProperties);
          };
          LocalForage2.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
            var supportedDrivers = [];
            for (var i2 = 0, len = drivers.length; i2 < len; i2++) {
              var driverName = drivers[i2];
              if (this.supports(driverName)) {
                supportedDrivers.push(driverName);
              }
            }
            return supportedDrivers;
          };
          LocalForage2.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
            for (var i2 = 0, len = LibraryMethods.length; i2 < len; i2++) {
              callWhenReady(this, LibraryMethods[i2]);
            }
          };
          LocalForage2.prototype.createInstance = function createInstance2(options) {
            return new LocalForage2(options);
          };
          return LocalForage2;
        }();
        var localforage_js = new LocalForage();
        module2.exports = localforage_js;
      }, { "3": 3 }] }, {}, [4])(4);
    });
  })(localforage$1);
  var localforageExports = localforage$1.exports;
  const localforage = /* @__PURE__ */ getDefaultExportFromCjs(localforageExports);
  const dbName = `localforage-${APP_NAME}`;
  function createDBWithTable(tableName) {
    return localforage.createInstance({
      driver: localforage.INDEXEDDB,
      name: dbName,
      storeName: tableName
    });
  }
  const allVideosDB = createDBWithTable("all-videos");
  const videoDetailInfoDB = createDBWithTable("video-detail-info");
  const starInfoDB = createDBWithTable("star-info");
  var src$1 = { exports: {} };
  var worker = function mapOnWorker(arr, fn, workers) {
    return new Promise(function(resolve, reject) {
      var completed = 0;
      var started = 0;
      var running = 0;
      var results = new Array(arr.length).fill(void 0);
      var rejected = false;
      var workerIsUnsing = /* @__PURE__ */ new WeakMap();
      var getWorker = function(index) {
        for (var i2 = 0; i2 < workers.length; i2++) {
          var worker2 = workers[i2];
          if (workerIsUnsing.get(worker2)) {
            continue;
          } else {
            workerIsUnsing.set(worker2, index);
            return worker2;
          }
        }
      };
      function start(index) {
        var cur = arr[index];
        var worker2 = getWorker(index);
        Promise.resolve(fn.call(cur, cur, index, arr, worker2)).then(function(result) {
          workerIsUnsing.delete(worker2);
          running--;
          results[index] = result;
          completed++;
          replenish();
        }).catch(function(err) {
          rejected = true;
          reject(err);
        });
      }
      function replenish() {
        if (rejected) return;
        if (completed >= arr.length) {
          return resolve(results);
        }
        while (running < workers.length && started < arr.length) {
          start(started);
          started++;
          running++;
        }
      }
      replenish();
    });
  };
  src$1.exports = function pmap(arr, fn, concurrency) {
    concurrency = concurrency || Infinity;
    if (typeof concurrency !== "number") {
      throw new TypeError(String(concurrency) + " is not a number");
    }
    return new Promise(function(resolve, reject) {
      var completed = 0;
      var started = 0;
      var running = 0;
      var results = new Array(arr.length).fill(void 0);
      var rejected = false;
      function start(index) {
        var cur = arr[index];
        Promise.resolve(fn.call(cur, cur, index, arr)).then(function(result) {
          running--;
          completed++;
          results[index] = result;
          replenish();
        }).catch(function(err) {
          rejected = true;
          reject(err);
        });
      }
      function replenish() {
        if (rejected) return;
        if (completed >= arr.length) {
          return resolve(results);
        }
        while (running < concurrency && started < arr.length) {
          start(started);
          running++;
          started++;
        }
      }
      replenish();
    });
  };
  var pmapWorker = worker;
  src$1.exports.pmapWorker = pmapWorker;
  var srcExports = src$1.exports;
  const pmap2 = /* @__PURE__ */ getDefaultExportFromCjs(srcExports);
  class HTTPError extends Error {
    constructor(response, request, options) {
      const code = response.status || response.status === 0 ? response.status : "";
      const title = response.statusText || "";
      const status = `${code} ${title}`.trim();
      const reason = status ? `status code ${status}` : "an unknown error";
      super(`Request failed with ${reason}: ${request.method} ${request.url}`);
      __publicField(this, "response");
      __publicField(this, "request");
      __publicField(this, "options");
      this.name = "HTTPError";
      this.response = response;
      this.request = request;
      this.options = options;
    }
  }
  class TimeoutError extends Error {
    constructor(request) {
      super(`Request timed out: ${request.method} ${request.url}`);
      __publicField(this, "request");
      this.name = "TimeoutError";
      this.request = request;
    }
  }
  const isObject2 = (value) => value !== null && typeof value === "object";
  const validateAndMerge = (...sources) => {
    for (const source of sources) {
      if ((!isObject2(source) || Array.isArray(source)) && source !== void 0) {
        throw new TypeError("The `options` argument must be an object");
      }
    }
    return deepMerge({}, ...sources);
  };
  const mergeHeaders = (source1 = {}, source2 = {}) => {
    const result = new globalThis.Headers(source1);
    const isHeadersInstance = source2 instanceof globalThis.Headers;
    const source = new globalThis.Headers(source2);
    for (const [key, value] of source.entries()) {
      if (isHeadersInstance && value === "undefined" || value === void 0) {
        result.delete(key);
      } else {
        result.set(key, value);
      }
    }
    return result;
  };
  function newHookValue(original, incoming, property) {
    return Object.hasOwn(incoming, property) && incoming[property] === void 0 ? [] : deepMerge(original[property] ?? [], incoming[property] ?? []);
  }
  const mergeHooks = (original = {}, incoming = {}) => ({
    beforeRequest: newHookValue(original, incoming, "beforeRequest"),
    beforeRetry: newHookValue(original, incoming, "beforeRetry"),
    afterResponse: newHookValue(original, incoming, "afterResponse"),
    beforeError: newHookValue(original, incoming, "beforeError")
  });
  const deepMerge = (...sources) => {
    let returnValue = {};
    let headers = {};
    let hooks = {};
    for (const source of sources) {
      if (Array.isArray(source)) {
        if (!Array.isArray(returnValue)) {
          returnValue = [];
        }
        returnValue = [...returnValue, ...source];
      } else if (isObject2(source)) {
        for (let [key, value] of Object.entries(source)) {
          if (isObject2(value) && key in returnValue) {
            value = deepMerge(returnValue[key], value);
          }
          returnValue = { ...returnValue, [key]: value };
        }
        if (isObject2(source.hooks)) {
          hooks = mergeHooks(hooks, source.hooks);
          returnValue.hooks = hooks;
        }
        if (isObject2(source.headers)) {
          headers = mergeHeaders(headers, source.headers);
          returnValue.headers = headers;
        }
      }
    }
    return returnValue;
  };
  const supportsRequestStreams = (() => {
    let duplexAccessed = false;
    let hasContentType = false;
    const supportsReadableStream = typeof globalThis.ReadableStream === "function";
    const supportsRequest = typeof globalThis.Request === "function";
    if (supportsReadableStream && supportsRequest) {
      try {
        hasContentType = new globalThis.Request("https://empty.invalid", {
          body: new globalThis.ReadableStream(),
          method: "POST",
          // @ts-expect-error - Types are outdated.
          get duplex() {
            duplexAccessed = true;
            return "half";
          }
        }).headers.has("Content-Type");
      } catch (error) {
        if (error instanceof Error && error.message === "unsupported BodyInit type") {
          return false;
        }
        throw error;
      }
    }
    return duplexAccessed && !hasContentType;
  })();
  const supportsAbortController = typeof globalThis.AbortController === "function";
  const supportsResponseStreams = typeof globalThis.ReadableStream === "function";
  const supportsFormData = typeof globalThis.FormData === "function";
  const requestMethods = ["get", "post", "put", "patch", "head", "delete"];
  const responseTypes = {
    json: "application/json",
    text: "text/*",
    formData: "multipart/form-data",
    arrayBuffer: "*/*",
    blob: "*/*"
  };
  const maxSafeTimeout = 2147483647;
  const stop = Symbol("stop");
  const kyOptionKeys = {
    json: true,
    parseJson: true,
    stringifyJson: true,
    searchParams: true,
    prefixUrl: true,
    retry: true,
    timeout: true,
    hooks: true,
    throwHttpErrors: true,
    onDownloadProgress: true,
    fetch: true
  };
  const requestOptionsRegistry = {
    method: true,
    headers: true,
    body: true,
    mode: true,
    credentials: true,
    cache: true,
    redirect: true,
    referrer: true,
    referrerPolicy: true,
    integrity: true,
    keepalive: true,
    signal: true,
    window: true,
    dispatcher: true,
    duplex: true,
    priority: true
  };
  const normalizeRequestMethod = (input) => requestMethods.includes(input) ? input.toUpperCase() : input;
  const retryMethods = ["get", "put", "head", "delete", "options", "trace"];
  const retryStatusCodes = [408, 413, 429, 500, 502, 503, 504];
  const retryAfterStatusCodes = [413, 429, 503];
  const defaultRetryOptions = {
    limit: 2,
    methods: retryMethods,
    statusCodes: retryStatusCodes,
    afterStatusCodes: retryAfterStatusCodes,
    maxRetryAfter: Number.POSITIVE_INFINITY,
    backoffLimit: Number.POSITIVE_INFINITY,
    delay: (attemptCount) => 0.3 * 2 ** (attemptCount - 1) * 1e3
  };
  const normalizeRetryOptions = (retry = {}) => {
    if (typeof retry === "number") {
      return {
        ...defaultRetryOptions,
        limit: retry
      };
    }
    if (retry.methods && !Array.isArray(retry.methods)) {
      throw new Error("retry.methods must be an array");
    }
    if (retry.statusCodes && !Array.isArray(retry.statusCodes)) {
      throw new Error("retry.statusCodes must be an array");
    }
    return {
      ...defaultRetryOptions,
      ...retry
    };
  };
  async function timeout(request, init2, abortController, options) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (abortController) {
          abortController.abort();
        }
        reject(new TimeoutError(request));
      }, options.timeout);
      void options.fetch(request, init2).then(resolve).catch(reject).then(() => {
        clearTimeout(timeoutId);
      });
    });
  }
  async function delay$1(ms2, { signal }) {
    return new Promise((resolve, reject) => {
      if (signal) {
        signal.throwIfAborted();
        signal.addEventListener("abort", abortHandler, { once: true });
      }
      function abortHandler() {
        clearTimeout(timeoutId);
        reject(signal.reason);
      }
      const timeoutId = setTimeout(() => {
        signal == null ? void 0 : signal.removeEventListener("abort", abortHandler);
        resolve();
      }, ms2);
    });
  }
  const findUnknownOptions = (request, options) => {
    const unknownOptions = {};
    for (const key in options) {
      if (!(key in requestOptionsRegistry) && !(key in kyOptionKeys) && !(key in request)) {
        unknownOptions[key] = options[key];
      }
    }
    return unknownOptions;
  };
  class Ky {
    // eslint-disable-next-line complexity
    constructor(input, options = {}) {
      __publicField(this, "request");
      __publicField(this, "abortController");
      __publicField(this, "_retryCount", 0);
      __publicField(this, "_input");
      __publicField(this, "_options");
      var _a, _b;
      this._input = input;
      this._options = {
        ...options,
        headers: mergeHeaders(this._input.headers, options.headers),
        hooks: mergeHooks({
          beforeRequest: [],
          beforeRetry: [],
          beforeError: [],
          afterResponse: []
        }, options.hooks),
        method: normalizeRequestMethod(options.method ?? this._input.method),
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        prefixUrl: String(options.prefixUrl || ""),
        retry: normalizeRetryOptions(options.retry),
        throwHttpErrors: options.throwHttpErrors !== false,
        timeout: options.timeout ?? 1e4,
        fetch: options.fetch ?? globalThis.fetch.bind(globalThis)
      };
      if (typeof this._input !== "string" && !(this._input instanceof URL || this._input instanceof globalThis.Request)) {
        throw new TypeError("`input` must be a string, URL, or Request");
      }
      if (this._options.prefixUrl && typeof this._input === "string") {
        if (this._input.startsWith("/")) {
          throw new Error("`input` must not begin with a slash when using `prefixUrl`");
        }
        if (!this._options.prefixUrl.endsWith("/")) {
          this._options.prefixUrl += "/";
        }
        this._input = this._options.prefixUrl + this._input;
      }
      if (supportsAbortController) {
        this.abortController = new globalThis.AbortController();
        const originalSignal = this._options.signal ?? this._input.signal;
        originalSignal == null ? void 0 : originalSignal.addEventListener("abort", () => {
          this.abortController.abort(originalSignal.reason);
        });
        this._options.signal = this.abortController.signal;
      }
      if (supportsRequestStreams) {
        this._options.duplex = "half";
      }
      if (this._options.json !== void 0) {
        this._options.body = ((_b = (_a = this._options).stringifyJson) == null ? void 0 : _b.call(_a, this._options.json)) ?? JSON.stringify(this._options.json);
        this._options.headers.set("content-type", this._options.headers.get("content-type") ?? "application/json");
      }
      this.request = new globalThis.Request(this._input, this._options);
      if (this._options.searchParams) {
        const textSearchParams = typeof this._options.searchParams === "string" ? this._options.searchParams.replace(/^\?/, "") : new URLSearchParams(this._options.searchParams).toString();
        const searchParams2 = "?" + textSearchParams;
        const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams2);
        if ((supportsFormData && this._options.body instanceof globalThis.FormData || this._options.body instanceof URLSearchParams) && !(this._options.headers && this._options.headers["content-type"])) {
          this.request.headers.delete("content-type");
        }
        this.request = new globalThis.Request(new globalThis.Request(url, { ...this.request }), this._options);
      }
    }
    static create(input, options) {
      const ky2 = new Ky(input, options);
      const function_ = async () => {
        if (typeof ky2._options.timeout === "number" && ky2._options.timeout > maxSafeTimeout) {
          throw new RangeError(`The \`timeout\` option cannot be greater than ${maxSafeTimeout}`);
        }
        await Promise.resolve();
        let response = await ky2._fetch();
        for (const hook of ky2._options.hooks.afterResponse) {
          const modifiedResponse = await hook(ky2.request, ky2._options, ky2._decorateResponse(response.clone()));
          if (modifiedResponse instanceof globalThis.Response) {
            response = modifiedResponse;
          }
        }
        ky2._decorateResponse(response);
        if (!response.ok && ky2._options.throwHttpErrors) {
          let error = new HTTPError(response, ky2.request, ky2._options);
          for (const hook of ky2._options.hooks.beforeError) {
            error = await hook(error);
          }
          throw error;
        }
        if (ky2._options.onDownloadProgress) {
          if (typeof ky2._options.onDownloadProgress !== "function") {
            throw new TypeError("The `onDownloadProgress` option must be a function");
          }
          if (!supportsResponseStreams) {
            throw new Error("Streams are not supported in your environment. `ReadableStream` is missing.");
          }
          return ky2._stream(response.clone(), ky2._options.onDownloadProgress);
        }
        return response;
      };
      const isRetriableMethod = ky2._options.retry.methods.includes(ky2.request.method.toLowerCase());
      const result = isRetriableMethod ? ky2._retry(function_) : function_();
      for (const [type, mimeType] of Object.entries(responseTypes)) {
        result[type] = async () => {
          ky2.request.headers.set("accept", ky2.request.headers.get("accept") || mimeType);
          const awaitedResult = await result;
          const response = awaitedResult.clone();
          if (type === "json") {
            if (response.status === 204) {
              return "";
            }
            const arrayBuffer = await response.clone().arrayBuffer();
            const responseSize = arrayBuffer.byteLength;
            if (responseSize === 0) {
              return "";
            }
            if (options.parseJson) {
              return options.parseJson(await response.text());
            }
          }
          return response[type]();
        };
      }
      return result;
    }
    _calculateRetryDelay(error) {
      this._retryCount++;
      if (this._retryCount > this._options.retry.limit || error instanceof TimeoutError) {
        throw error;
      }
      if (error instanceof HTTPError) {
        if (!this._options.retry.statusCodes.includes(error.response.status)) {
          throw error;
        }
        const retryAfter = error.response.headers.get("Retry-After") ?? error.response.headers.get("RateLimit-Reset") ?? error.response.headers.get("X-RateLimit-Reset") ?? error.response.headers.get("X-Rate-Limit-Reset");
        if (retryAfter && this._options.retry.afterStatusCodes.includes(error.response.status)) {
          let after = Number(retryAfter) * 1e3;
          if (Number.isNaN(after)) {
            after = Date.parse(retryAfter) - Date.now();
          } else if (after >= Date.parse("2024-01-01")) {
            after -= Date.now();
          }
          const max2 = this._options.retry.maxRetryAfter ?? after;
          return after < max2 ? after : max2;
        }
        if (error.response.status === 413) {
          throw error;
        }
      }
      const retryDelay = this._options.retry.delay(this._retryCount);
      return Math.min(this._options.retry.backoffLimit, retryDelay);
    }
    _decorateResponse(response) {
      if (this._options.parseJson) {
        response.json = async () => this._options.parseJson(await response.text());
      }
      return response;
    }
    async _retry(function_) {
      try {
        return await function_();
      } catch (error) {
        const ms2 = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
        if (this._retryCount < 1) {
          throw error;
        }
        await delay$1(ms2, { signal: this._options.signal });
        for (const hook of this._options.hooks.beforeRetry) {
          const hookResult = await hook({
            request: this.request,
            options: this._options,
            error,
            retryCount: this._retryCount
          });
          if (hookResult === stop) {
            return;
          }
        }
        return this._retry(function_);
      }
    }
    async _fetch() {
      for (const hook of this._options.hooks.beforeRequest) {
        const result = await hook(this.request, this._options);
        if (result instanceof Request) {
          this.request = result;
          break;
        }
        if (result instanceof Response) {
          return result;
        }
      }
      const nonRequestOptions = findUnknownOptions(this.request, this._options);
      const mainRequest = this.request;
      this.request = mainRequest.clone();
      if (this._options.timeout === false) {
        return this._options.fetch(mainRequest, nonRequestOptions);
      }
      return timeout(mainRequest, nonRequestOptions, this.abortController, this._options);
    }
    /* istanbul ignore next */
    _stream(response, onDownloadProgress) {
      const totalBytes = Number(response.headers.get("content-length")) || 0;
      let transferredBytes = 0;
      if (response.status === 204) {
        if (onDownloadProgress) {
          onDownloadProgress({ percent: 1, totalBytes, transferredBytes }, new Uint8Array());
        }
        return new globalThis.Response(null, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      }
      return new globalThis.Response(new globalThis.ReadableStream({
        async start(controller) {
          const reader = response.body.getReader();
          if (onDownloadProgress) {
            onDownloadProgress({ percent: 0, transferredBytes: 0, totalBytes }, new Uint8Array());
          }
          async function read() {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              return;
            }
            if (onDownloadProgress) {
              transferredBytes += value.byteLength;
              const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
              onDownloadProgress({ percent, transferredBytes, totalBytes }, value);
            }
            controller.enqueue(value);
            await read();
          }
          await read();
        }
      }), {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
    }
  }
  /*! MIT License © Sindre Sorhus */
  const createInstance = (defaults) => {
    const ky2 = (input, options) => Ky.create(input, validateAndMerge(defaults, options));
    for (const method of requestMethods) {
      ky2[method] = (input, options) => Ky.create(input, validateAndMerge(defaults, options, { method }));
    }
    ky2.create = (newDefaults) => createInstance(validateAndMerge(newDefaults));
    ky2.extend = (newDefaults) => {
      if (typeof newDefaults === "function") {
        newDefaults = newDefaults(defaults ?? {});
      }
      return createInstance(validateAndMerge(defaults, newDefaults));
    };
    ky2.stop = stop;
    return ky2;
  };
  const ky = createInstance();
  async function readHtml(url) {
    try {
      return await ky.get(url, {
        retry: 5,
        cache: "force-cache"
      }).text();
    } catch (e2) {
      console.error(e2.stack || e2);
    }
    return void 0;
  }
  function load(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return jq(doc);
  }
  async function getVideoDetailInfo(link, force = false) {
    const db = videoDetailInfoDB;
    const key = `${link}`;
    if (!force) {
      const info2 = await db.getItem(key);
      if (info2) return info2;
    }
    const html = await readHtml(link);
    if (!html) return null;
    const $ = load(html);
    const info = {
      tags: _tags($),
      stars: _stars($),
      date: _date($),
      duration: _duration($),
      studio: _studio($),
      label: _label($),
      series: _series($),
      director: _director($)
    };
    await db.setItem(key, info);
    return info;
  }
  function _tags($) {
    let tags = $.find(".genre").filter(function() {
      var _a;
      const a2 = jq("a", this);
      return !!(a2.length && ((_a = a2.attr("href")) == null ? void 0 : _a.includes("/genre/")));
    }).map(function() {
      const a2 = jq("a", this);
      return { name: a2.text(), url: a2.attr("href") || "" };
    }).toArray();
    tags = lodash.uniqBy(tags, (x2) => x2.url);
    return tags;
  }
  function _stars($) {
    let stars = $.find(".genre").filter(function() {
      var _a;
      const a2 = jq("a", this);
      return !!(a2.length && ((_a = a2.attr("href")) == null ? void 0 : _a.includes("/star/")));
    }).map(function() {
      const a2 = jq("a", this);
      return { name: a2.text(), url: a2.attr("href") || "" };
    }).toArray();
    stars = lodash.uniqBy(stars, (x2) => x2.url);
    return stars;
  }
  function __extract($, searchText) {
    const $header = $.find(".movie .info p .header").filter(function() {
      const text = jq(this).text().trim();
      return text === searchText || text.includes(searchText);
    }).eq(0);
    return $header;
  }
  function _extractRestText($, searchText) {
    const $header = __extract($, searchText);
    const headerText = $header.text();
    const fullText = $header.parent().text();
    const rest = fullText.replace(headerText, "").trim();
    return rest;
  }
  function _extractRestLink($, searchText) {
    const $header = __extract($, searchText);
    const $a = $header.siblings("a").eq(0);
    if ($a.length === 0) return;
    return { name: $a.text().trim(), url: $a.attr("href") || "" };
  }
  function _date($) {
    const date = _extractRestText($, "發行日期");
    if (!date) return;
    const d2 = dayjs(date, "YYYY-MM-DD");
    if (!d2.isValid()) return;
    return d2.unix();
  }
  function _duration($) {
    const durationText = _extractRestText($, "長度");
    if (!durationText) return;
    const minutes = parseInt(durationText);
    return minutes;
  }
  function _studio($) {
    return _extractRestLink($, "製作商");
  }
  function _label($) {
    return _extractRestLink($, "發行商");
  }
  function _series($) {
    return _extractRestLink($, "系列");
  }
  function _director($) {
    return _extractRestLink($, "導演");
  }
  function simplifyNameUrlItem(item2) {
    if (item2 == null ? void 0 : item2.name) {
      item2.name = toSimplifiedChinese(item2.name);
    }
  }
  const HASH_RE = /#/g;
  const AMPERSAND_RE = /&/g;
  const SLASH_RE = /\//g;
  const EQUAL_RE = /=/g;
  const PLUS_RE = /\+/g;
  const ENC_CARET_RE = /%5e/gi;
  const ENC_BACKTICK_RE = /%60/gi;
  const ENC_PIPE_RE = /%7c/gi;
  const ENC_SPACE_RE = /%20/gi;
  function encode(text) {
    return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
  }
  function encodeQueryValue(input) {
    return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
  }
  function encodeQueryKey(text) {
    return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
  }
  function decode(text = "") {
    try {
      return decodeURIComponent("" + text);
    } catch {
      return "" + text;
    }
  }
  function decodeQueryKey(text) {
    return decode(text.replace(PLUS_RE, " "));
  }
  function decodeQueryValue(text) {
    return decode(text.replace(PLUS_RE, " "));
  }
  function parseQuery(parametersString = "") {
    const object = {};
    if (parametersString[0] === "?") {
      parametersString = parametersString.slice(1);
    }
    for (const parameter of parametersString.split("&")) {
      const s2 = parameter.match(/([^=]+)=?(.*)/) || [];
      if (s2.length < 2) {
        continue;
      }
      const key = decodeQueryKey(s2[1]);
      if (key === "__proto__" || key === "constructor") {
        continue;
      }
      const value = decodeQueryValue(s2[2] || "");
      if (object[key] === void 0) {
        object[key] = value;
      } else if (Array.isArray(object[key])) {
        object[key].push(value);
      } else {
        object[key] = [object[key], value];
      }
    }
    return object;
  }
  function encodeQueryItem(key, value) {
    if (typeof value === "number" || typeof value === "boolean") {
      value = String(value);
    }
    if (!value) {
      return encodeQueryKey(key);
    }
    if (Array.isArray(value)) {
      return value.map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
    }
    return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
  }
  function stringifyQuery(query) {
    return Object.keys(query).filter((k2) => query[k2] !== void 0).map((k2) => encodeQueryItem(k2, query[k2])).filter(Boolean).join("&");
  }
  const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
  const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
  const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
  function hasProtocol(inputString, opts = {}) {
    if (typeof opts === "boolean") {
      opts = { acceptRelative: opts };
    }
    if (opts.strict) {
      return PROTOCOL_STRICT_REGEX.test(inputString);
    }
    return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
  }
  function withTrailingSlash(input = "", respectQueryAndFragment) {
    {
      return input.endsWith("/") ? input : input + "/";
    }
  }
  function hasLeadingSlash(input = "") {
    return input.startsWith("/");
  }
  function withoutLeadingSlash(input = "") {
    return (hasLeadingSlash(input) ? input.slice(1) : input) || "/";
  }
  function isNonEmptyURL(url) {
    return url && url !== "/";
  }
  function resolveURL(base = "", ...inputs) {
    if (typeof base !== "string") {
      throw new TypeError(
        `URL input should be string received ${typeof base} (${base})`
      );
    }
    const filteredInputs = inputs.filter((input) => isNonEmptyURL(input));
    if (filteredInputs.length === 0) {
      return base;
    }
    const url = parseURL(base);
    for (const inputSegment of filteredInputs) {
      const urlSegment = parseURL(inputSegment);
      if (urlSegment.pathname) {
        url.pathname = withTrailingSlash(url.pathname) + withoutLeadingSlash(urlSegment.pathname);
      }
      if (urlSegment.hash && urlSegment.hash !== "#") {
        url.hash = urlSegment.hash;
      }
      if (urlSegment.search && urlSegment.search !== "?") {
        if (url.search && url.search !== "?") {
          const queryString = stringifyQuery({
            ...parseQuery(url.search),
            ...parseQuery(urlSegment.search)
          });
          url.search = queryString.length > 0 ? "?" + queryString : "";
        } else {
          url.search = urlSegment.search;
        }
      }
    }
    return stringifyParsedURL(url);
  }
  const protocolRelative = Symbol.for("ufo:protocolRelative");
  function parseURL(input = "", defaultProto) {
    const _specialProtoMatch = input.match(
      /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
    );
    if (_specialProtoMatch) {
      const [, _proto, _pathname = ""] = _specialProtoMatch;
      return {
        protocol: _proto.toLowerCase(),
        pathname: _pathname,
        href: _proto + _pathname,
        auth: "",
        host: "",
        search: "",
        hash: ""
      };
    }
    if (!hasProtocol(input, { acceptRelative: true })) {
      return parsePath(input);
    }
    const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
    let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
    if (protocol === "file:") {
      path = path.replace(/\/(?=[A-Za-z]:)/, "");
    }
    const { pathname, search, hash: hash2 } = parsePath(path);
    return {
      protocol: protocol.toLowerCase(),
      auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
      host,
      pathname,
      search,
      hash: hash2,
      [protocolRelative]: !protocol
    };
  }
  function parsePath(input = "") {
    const [pathname = "", search = "", hash2 = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
    return {
      pathname,
      search,
      hash: hash2
    };
  }
  function stringifyParsedURL(parsed) {
    const pathname = parsed.pathname || "";
    const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
    const hash2 = parsed.hash || "";
    const auth = parsed.auth ? parsed.auth + "@" : "";
    const host = parsed.host || "";
    const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
    return proto + auth + host + pathname + search + hash2;
  }
  const VIDEO_DETAIL_CONCURRENCY = 10 * 3;
  const JAVBUS_PAGE_SIZE = 30;
  function getCurrentPageType() {
    const magnetClass = "glyphicon-magnet";
    const allClass = "glyphicon-film";
    return jq(`.dropdown-toggle .${magnetClass}, .dropdown-toggle .${allClass}`).hasClass(magnetClass) ? "magnet" : "all";
  }
  const $cache = {};
  async function _get$(rawUrl) {
    const url = trimHash(rawUrl);
    if ($cache[url]) return $cache[url];
    const html = await readHtml(url);
    if (!html) throw new Error(`html empty on page ${url}`);
    const $ = load(html);
    $cache[url] = $;
    return $;
  }
  function getItemsOnListPage($) {
    return $.find("#waterfall .movie-box").map(function() {
      var _a;
      const cover = jq(".photo-frame img", this).attr("src") || "";
      const name = ((_a = jq(".photo-info span", this).html().split("<br")[0]) == null ? void 0 : _a.trim()) || "";
      const id2 = jq("date", this).eq(0).text() || "";
      const date = jq("date", this).eq(1).text() || "";
      const link = jq(this).attr("href") || "";
      const magnetTags = jq(".item-tag .btn", this).map(function() {
        const text = jq(this).text().trim();
        const s2 = new Set(this.classList);
        s2.delete("btn");
        s2.delete("btn-xs");
        const className = Array.from(s2).join(" ");
        return { text, className };
      }).toArray();
      return { id: id2, name, cover, date, link, magnetTags };
    }).toArray();
  }
  async function getItemsOnListUrl(url) {
    const $ = await _get$(url);
    return getItemsOnListPage($);
  }
  async function parseAllVideos({
    startUrl,
    expectedVideoCount,
    emitter,
    cache: cache2 = []
  }) {
    let completedPages = 0;
    const emitProgress = lodash.throttle(() => emitter == null ? void 0 : emitter.emit("page-progress", completedPages), 100);
    const isRecentUpdate = getIsRecentUpdate(startUrl);
    const urlsQueueBase = trimPagenumFromUrl(startUrl);
    const maxPageNum = Math.ceil(expectedVideoCount / JAVBUS_PAGE_SIZE);
    const urlsQueue = new Array(maxPageNum).fill(0).map((_, index) => {
      if (index === 0) return urlsQueueBase;
      return resolveURL(urlsQueueBase, isRecentUpdate ? "page" : "", `${index + 1}`);
    });
    async function _videosOnListPages(urlList) {
      const results = await pmap2(
        urlList,
        async (url) => {
          const items = await getItemsOnListUrl(url);
          completedPages++;
          emitProgress();
          return items;
        },
        VIDEO_DETAIL_CONCURRENCY
      );
      return results.flat();
    }
    const incrmentalUpdate = !!cache2.length;
    if (!incrmentalUpdate) {
      return await _videosOnListPages(urlsQueue);
    } else {
      let getHasMore = function() {
        const cacheLinks = cache2.slice(0, 10)._map("link");
        const resultLinks = result._map("link");
        const fi = cacheLinks[0];
        if (!fi) return;
        const index = resultLinks.indexOf(fi);
        if (index === -1) return;
        const resultLinksSlice = resultLinks.slice(index, index + cacheLinks.length);
        if (lodash.isEqual(resultLinksSlice, cacheLinks)) return false;
      };
      const batchSize = 8;
      const batchs = lodash.chunk(urlsQueue, batchSize);
      let result = [];
      for (const batch of batchs) {
        const videos = await _videosOnListPages(batch);
        result = result.concat(videos);
        const hasMore = getHasMore() ?? true;
        if (!hasMore) {
          break;
        }
      }
      result = lodash.uniqBy([...result, ...cache2], (x2) => x2.link);
      return result;
    }
  }
  async function allVideos({
    url,
    expectedVideoCount,
    emitter,
    force = false,
    isRecentUpdate = false
  }) {
    let videos = await _getRawVideos({
      url,
      pageType: getCurrentPageType(),
      expectedVideoCount,
      force,
      emitter,
      isRecentUpdate
    });
    videos = lodash.uniqBy(videos, (v2) => v2.link);
    videos.forEach((v2) => {
      v2.name = toSimplifiedChinese(v2.name);
    });
    return addDetailInfo(videos, emitter);
  }
  async function pageHasValidCache(url, expectedVideoCount) {
    const videos = await __getAllVideosByCache({
      url,
      pageType: getCurrentPageType(),
      expectedVideoCount,
      isRecentUpdate: false
    });
    return !!(videos == null ? void 0 : videos.length);
  }
  async function pageHasCache(url) {
    const cacheKey = getPageCacheKey(url, getCurrentPageType());
    const { results } = await allVideosDB.getItem(cacheKey) || {};
    return !!(results == null ? void 0 : results.length);
  }
  async function _getRawVideos({
    url,
    pageType,
    expectedVideoCount,
    force,
    emitter,
    isRecentUpdate
  }) {
    var _a;
    if (!force) {
      const arr = await __getAllVideosByCache({ url, pageType, expectedVideoCount, isRecentUpdate });
      if (arr == null ? void 0 : arr.length) return arr;
    }
    const cache2 = (_a = await allVideosDB.getItem(getPageCacheKey(url, pageType))) == null ? void 0 : _a.results;
    const results = await parseAllVideos({ startUrl: url, expectedVideoCount, emitter, cache: cache2 });
    await allVideosDB.setItem(getPageCacheKey(url, pageType), {
      results,
      expectedVideoCount
    });
    return results;
  }
  function getPageCacheKey(url, pageType) {
    const _url = trimPagenumFromUrl(url);
    return `${_url}:${pageType}`;
  }
  async function __getAllVideosByCache({
    url,
    pageType,
    expectedVideoCount,
    isRecentUpdate
  }) {
    var _a, _b;
    const cacheKey = getPageCacheKey(url, pageType);
    const data = await allVideosDB.getItem(cacheKey);
    if (!((_a = data == null ? void 0 : data.results) == null ? void 0 : _a.length)) return;
    const { results = [] } = data;
    if (isRecentUpdate) {
      const itemsOnCurrentPage = await getItemsOnListUrl(url);
      if (((_b = itemsOnCurrentPage[0]) == null ? void 0 : _b.id) === results[0].id) {
        return results;
      }
    } else {
      if (results.length === expectedVideoCount) {
        return results;
      }
      if (data.expectedVideoCount === expectedVideoCount) {
        return results;
      }
    }
  }
  async function addDetailInfo(videos, emitter) {
    let completed = 0;
    const emitProgress = lodash.throttle(
      () => {
        const total = videos.length;
        emitter == null ? void 0 : emitter.emit("detail-progress", {
          total,
          completed,
          progress: completed / total
        });
      },
      80,
      { leading: true, trailing: true }
    );
    return await pmap2(
      videos,
      async (video) => {
        const detailInfo = await getVideoDetailInfo(video.link);
        detailInfo == null ? void 0 : detailInfo.tags.forEach(simplifyNameUrlItem);
        detailInfo == null ? void 0 : detailInfo.stars.forEach(simplifyNameUrlItem);
        simplifyNameUrlItem(detailInfo == null ? void 0 : detailInfo.studio);
        simplifyNameUrlItem(detailInfo == null ? void 0 : detailInfo.label);
        simplifyNameUrlItem(detailInfo == null ? void 0 : detailInfo.series);
        simplifyNameUrlItem(detailInfo == null ? void 0 : detailInfo.director);
        completed++;
        emitProgress();
        return {
          ...video,
          detailInfo
        };
      },
      VIDEO_DETAIL_CONCURRENCY
    );
  }
  function mitt(n2) {
    return { all: n2 = n2 || /* @__PURE__ */ new Map(), on: function(t2, e2) {
      var i2 = n2.get(t2);
      i2 ? i2.push(e2) : n2.set(t2, [e2]);
    }, off: function(t2, e2) {
      var i2 = n2.get(t2);
      i2 && (e2 ? i2.splice(i2.indexOf(e2) >>> 0, 1) : n2.set(t2, []));
    }, emit: function(t2, e2) {
      var i2 = n2.get(t2);
      i2 && i2.slice().map(function(n3) {
        n3(e2);
      }), (i2 = n2.get("*")) && i2.slice().map(function(n3) {
        n3(t2, e2);
      });
    } };
  }
  const PUBLISH = 0;
  const SUBSCRIBE = 1;
  const RESET = 2;
  const VALUE = 4;
  function compose(a2, b2) {
    return (arg) => a2(b2(arg));
  }
  function thrush(arg, proc) {
    return proc(arg);
  }
  function curry2to1(proc, arg1) {
    return (arg2) => proc(arg1, arg2);
  }
  function curry1to0(proc, arg) {
    return () => proc(arg);
  }
  function tap(arg, proc) {
    proc(arg);
    return arg;
  }
  function tup(...args) {
    return args;
  }
  function call(proc) {
    proc();
  }
  function always(value) {
    return () => value;
  }
  function joinProc(...procs) {
    return () => {
      procs.map(call);
    };
  }
  function noop() {
  }
  function subscribe(emitter, subscription) {
    return emitter(SUBSCRIBE, subscription);
  }
  function publish(publisher, value) {
    publisher(PUBLISH, value);
  }
  function reset(emitter) {
    emitter(RESET);
  }
  function getValue(depot) {
    return depot(VALUE);
  }
  function connect(emitter, publisher) {
    return subscribe(emitter, curry2to1(publisher, PUBLISH));
  }
  function handleNext(emitter, subscription) {
    const unsub = emitter(SUBSCRIBE, (value) => {
      unsub();
      subscription(value);
    });
    return unsub;
  }
  function stream() {
    const subscriptions = [];
    return (action, arg) => {
      switch (action) {
        case RESET:
          subscriptions.splice(0, subscriptions.length);
          return;
        case SUBSCRIBE:
          subscriptions.push(arg);
          return () => {
            const indexOf2 = subscriptions.indexOf(arg);
            if (indexOf2 > -1) {
              subscriptions.splice(indexOf2, 1);
            }
          };
        case PUBLISH:
          subscriptions.slice().forEach((subscription) => {
            subscription(arg);
          });
          return;
        default:
          throw new Error(`unrecognized action ${action}`);
      }
    };
  }
  function statefulStream(initial) {
    let value = initial;
    const innerSubject = stream();
    return (action, arg) => {
      switch (action) {
        case SUBSCRIBE:
          const subscription = arg;
          subscription(value);
          break;
        case PUBLISH:
          value = arg;
          break;
        case VALUE:
          return value;
      }
      return innerSubject(action, arg);
    };
  }
  function eventHandler(emitter) {
    let unsub;
    let currentSubscription;
    const cleanup = () => unsub && unsub();
    return function(action, subscription) {
      switch (action) {
        case SUBSCRIBE:
          if (subscription) {
            if (currentSubscription === subscription) {
              return;
            }
            cleanup();
            currentSubscription = subscription;
            unsub = subscribe(emitter, subscription);
            return unsub;
          } else {
            cleanup();
            return noop;
          }
        case RESET:
          cleanup();
          currentSubscription = null;
          return;
        default:
          throw new Error(`unrecognized action ${action}`);
      }
    };
  }
  function streamFromEmitter(emitter) {
    return tap(stream(), (stream2) => connect(emitter, stream2));
  }
  function statefulStreamFromEmitter(emitter, initial) {
    return tap(statefulStream(initial), (stream2) => connect(emitter, stream2));
  }
  function combineOperators(...operators) {
    return (subscriber) => {
      return operators.reduceRight(thrush, subscriber);
    };
  }
  function pipe(source, ...operators) {
    const project = combineOperators(...operators);
    return (action, subscription) => {
      switch (action) {
        case SUBSCRIBE:
          return subscribe(source, project(subscription));
        case RESET:
          reset(source);
          return;
      }
    };
  }
  function defaultComparator(previous, next2) {
    return previous === next2;
  }
  function distinctUntilChanged(comparator = defaultComparator) {
    let current;
    return (done) => (next2) => {
      if (!comparator(current, next2)) {
        current = next2;
        done(next2);
      }
    };
  }
  function filter(predicate) {
    return (done) => (value) => {
      predicate(value) && done(value);
    };
  }
  function map(project) {
    return (done) => compose(done, project);
  }
  function mapTo(value) {
    return (done) => () => done(value);
  }
  function scan(scanner, initial) {
    return (done) => (value) => done(initial = scanner(initial, value));
  }
  function skip(times) {
    return (done) => (value) => {
      times > 0 ? times-- : done(value);
    };
  }
  function throttleTime(interval) {
    let currentValue = null;
    let timeout2;
    return (done) => (value) => {
      currentValue = value;
      if (timeout2) {
        return;
      }
      timeout2 = setTimeout(() => {
        timeout2 = void 0;
        done(currentValue);
      }, interval);
    };
  }
  function debounceTime(interval) {
    let currentValue;
    let timeout2;
    return (done) => (value) => {
      currentValue = value;
      if (timeout2) {
        clearTimeout(timeout2);
      }
      timeout2 = setTimeout(() => {
        done(currentValue);
      }, interval);
    };
  }
  function withLatestFrom(...sources) {
    const values = new Array(sources.length);
    let called = 0;
    let pendingCall = null;
    const allCalled = Math.pow(2, sources.length) - 1;
    sources.forEach((source, index) => {
      const bit = Math.pow(2, index);
      subscribe(source, (value) => {
        const prevCalled = called;
        called = called | bit;
        values[index] = value;
        if (prevCalled !== allCalled && called === allCalled && pendingCall) {
          pendingCall();
          pendingCall = null;
        }
      });
    });
    return (done) => (value) => {
      const call2 = () => done([value].concat(values));
      if (called === allCalled) {
        call2();
      } else {
        pendingCall = call2;
      }
    };
  }
  function merge(...sources) {
    return function(action, subscription) {
      switch (action) {
        case SUBSCRIBE:
          return joinProc(...sources.map((source) => subscribe(source, subscription)));
        case RESET:
          return;
        default:
          throw new Error(`unrecognized action ${action}`);
      }
    };
  }
  function duc(source, comparator = defaultComparator) {
    return pipe(source, distinctUntilChanged(comparator));
  }
  function combineLatest(...emitters) {
    const innerSubject = stream();
    const values = new Array(emitters.length);
    let called = 0;
    const allCalled = Math.pow(2, emitters.length) - 1;
    emitters.forEach((source, index) => {
      const bit = Math.pow(2, index);
      subscribe(source, (value) => {
        values[index] = value;
        called = called | bit;
        if (called === allCalled) {
          publish(innerSubject, values);
        }
      });
    });
    return function(action, subscription) {
      switch (action) {
        case SUBSCRIBE:
          if (called === allCalled) {
            subscription(values);
          }
          return subscribe(innerSubject, subscription);
        case RESET:
          return reset(innerSubject);
        default:
          throw new Error(`unrecognized action ${action}`);
      }
    };
  }
  function system(constructor, dependencies = [], { singleton } = { singleton: true }) {
    return {
      id: id(),
      constructor,
      dependencies,
      singleton
    };
  }
  const id = () => Symbol();
  function init$1(systemSpec) {
    const singletons = /* @__PURE__ */ new Map();
    const _init = ({ id: id2, constructor, dependencies, singleton }) => {
      if (singleton && singletons.has(id2)) {
        return singletons.get(id2);
      }
      const system2 = constructor(dependencies.map((e2) => _init(e2)));
      if (singleton) {
        singletons.set(id2, system2);
      }
      return system2;
    };
    return _init(systemSpec);
  }
  function omit(keys, obj) {
    const result = {};
    const index = {};
    let idx = 0;
    const len = keys.length;
    while (idx < len) {
      index[keys[idx]] = 1;
      idx += 1;
    }
    for (const prop in obj) {
      if (!index.hasOwnProperty(prop)) {
        result[prop] = obj[prop];
      }
    }
    return result;
  }
  const useIsomorphicLayoutEffect$2 = typeof document !== "undefined" ? React__default.useLayoutEffect : React__default.useEffect;
  function systemToComponent(systemSpec, map2, Root) {
    const requiredPropNames = Object.keys(map2.required || {});
    const optionalPropNames = Object.keys(map2.optional || {});
    const methodNames = Object.keys(map2.methods || {});
    const eventNames = Object.keys(map2.events || {});
    const Context2 = React__default.createContext({});
    function applyPropsToSystem(system2, props) {
      if (system2["propsReady"]) {
        publish(system2["propsReady"], false);
      }
      for (const requiredPropName of requiredPropNames) {
        const stream2 = system2[map2.required[requiredPropName]];
        publish(stream2, props[requiredPropName]);
      }
      for (const optionalPropName of optionalPropNames) {
        if (optionalPropName in props) {
          const stream2 = system2[map2.optional[optionalPropName]];
          publish(stream2, props[optionalPropName]);
        }
      }
      if (system2["propsReady"]) {
        publish(system2["propsReady"], true);
      }
    }
    function buildMethods(system2) {
      return methodNames.reduce((acc, methodName) => {
        acc[methodName] = (value) => {
          const stream2 = system2[map2.methods[methodName]];
          publish(stream2, value);
        };
        return acc;
      }, {});
    }
    function buildEventHandlers(system2) {
      return eventNames.reduce((handlers, eventName) => {
        handlers[eventName] = eventHandler(system2[map2.events[eventName]]);
        return handlers;
      }, {});
    }
    const Component = React__default.forwardRef((propsWithChildren, ref) => {
      const { children, ...props } = propsWithChildren;
      const [system2] = React__default.useState(() => {
        return tap(init$1(systemSpec), (system22) => applyPropsToSystem(system22, props));
      });
      const [handlers] = React__default.useState(curry1to0(buildEventHandlers, system2));
      useIsomorphicLayoutEffect$2(() => {
        for (const eventName of eventNames) {
          if (eventName in props) {
            subscribe(handlers[eventName], props[eventName]);
          }
        }
        return () => {
          Object.values(handlers).map(reset);
        };
      }, [props, handlers, system2]);
      useIsomorphicLayoutEffect$2(() => {
        applyPropsToSystem(system2, props);
      });
      React__default.useImperativeHandle(ref, always(buildMethods(system2)));
      return React__default.createElement(
        Context2.Provider,
        { value: system2 },
        Root ? React__default.createElement(
          Root,
          omit([...requiredPropNames, ...optionalPropNames, ...eventNames], props),
          children
        ) : children
      );
    });
    const usePublisher2 = (key) => {
      return React__default.useCallback(curry2to1(publish, React__default.useContext(Context2)[key]), [key]);
    };
    const useEmitterValue18 = (key) => {
      const system2 = React__default.useContext(Context2);
      const source = system2[key];
      const cb = React__default.useCallback(
        (c2) => {
          return subscribe(source, c2);
        },
        [source]
      );
      return React__default.useSyncExternalStore(
        cb,
        () => getValue(source),
        () => getValue(source)
      );
    };
    const useEmitterValueLegacy = (key) => {
      const system2 = React__default.useContext(Context2);
      const source = system2[key];
      const [value, setValue] = React__default.useState(curry1to0(getValue, source));
      useIsomorphicLayoutEffect$2(
        () => subscribe(source, (next2) => {
          if (next2 !== value) {
            setValue(always(next2));
          }
        }),
        [source, value]
      );
      return value;
    };
    const useEmitterValue2 = React__default.version.startsWith("18") ? useEmitterValue18 : useEmitterValueLegacy;
    const useEmitter2 = (key, callback) => {
      const context = React__default.useContext(Context2);
      const source = context[key];
      useIsomorphicLayoutEffect$2(() => subscribe(source, callback), [callback, source]);
    };
    return {
      Component,
      usePublisher: usePublisher2,
      useEmitterValue: useEmitterValue2,
      useEmitter: useEmitter2
    };
  }
  const useIsomorphicLayoutEffect = typeof document !== "undefined" ? React__default.useLayoutEffect : React__default.useEffect;
  const useIsomorphicLayoutEffect$1 = useIsomorphicLayoutEffect;
  var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
    LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
    LogLevel2[LogLevel2["INFO"] = 1] = "INFO";
    LogLevel2[LogLevel2["WARN"] = 2] = "WARN";
    LogLevel2[LogLevel2["ERROR"] = 3] = "ERROR";
    return LogLevel2;
  })(LogLevel || {});
  const CONSOLE_METHOD_MAP = {
    [
      0
      /* DEBUG */
    ]: "debug",
    [
      1
      /* INFO */
    ]: "log",
    [
      2
      /* WARN */
    ]: "warn",
    [
      3
      /* ERROR */
    ]: "error"
  };
  const getGlobalThis = () => typeof globalThis === "undefined" ? window : globalThis;
  const loggerSystem = system(
    () => {
      const logLevel = statefulStream(
        3
        /* ERROR */
      );
      const log = statefulStream((label2, message2, level = 1) => {
        var _a;
        const currentLevel = (_a = getGlobalThis()["VIRTUOSO_LOG_LEVEL"]) != null ? _a : getValue(logLevel);
        if (level >= currentLevel) {
          console[CONSOLE_METHOD_MAP[level]](
            "%creact-virtuoso: %c%s %o",
            "color: #0253b3; font-weight: bold",
            "color: initial",
            label2,
            message2
          );
        }
      });
      return {
        log,
        logLevel
      };
    },
    [],
    { singleton: true }
  );
  function useSizeWithElRef(callback, enabled, skipAnimationFrame) {
    const ref = React__default.useRef(null);
    let callbackRef = (_el) => {
    };
    if (typeof ResizeObserver !== "undefined") {
      const observer = React__default.useMemo(() => {
        return new ResizeObserver((entries) => {
          const code = () => {
            const element = entries[0].target;
            if (element.offsetParent !== null) {
              callback(element);
            }
          };
          requestAnimationFrame(code);
        });
      }, [callback]);
      callbackRef = (elRef) => {
        if (elRef && enabled) {
          observer.observe(elRef);
          ref.current = elRef;
        } else {
          if (ref.current) {
            observer.unobserve(ref.current);
          }
          ref.current = null;
        }
      };
    }
    return { ref, callbackRef };
  }
  function useSize(callback, enabled, skipAnimationFrame) {
    return useSizeWithElRef(callback, enabled).callbackRef;
  }
  function correctItemSize(el, dimension) {
    return Math.round(el.getBoundingClientRect()[dimension]);
  }
  function approximatelyEqual(num1, num2) {
    return Math.abs(num1 - num2) < 1.01;
  }
  function useScrollTop(scrollContainerStateCallback, smoothScrollTargetReached, scrollerElement, scrollerRefCallback = noop, customScrollParent, horizontalDirection) {
    const scrollerRef = React__default.useRef(null);
    const scrollTopTarget = React__default.useRef(null);
    const timeoutRef = React__default.useRef(null);
    const handler = React__default.useCallback(
      (ev) => {
        const el = ev.target;
        const windowScroll = el === window || el === document;
        const scrollTop = horizontalDirection ? windowScroll ? window.pageXOffset || document.documentElement.scrollLeft : el.scrollLeft : windowScroll ? window.pageYOffset || document.documentElement.scrollTop : el.scrollTop;
        const scrollHeight = horizontalDirection ? windowScroll ? document.documentElement.scrollWidth : el.scrollWidth : windowScroll ? document.documentElement.scrollHeight : el.scrollHeight;
        const viewportHeight = horizontalDirection ? windowScroll ? window.innerWidth : el.offsetWidth : windowScroll ? window.innerHeight : el.offsetHeight;
        const call2 = () => {
          scrollContainerStateCallback({
            scrollTop: Math.max(scrollTop, 0),
            scrollHeight,
            viewportHeight
          });
        };
        if (ev.suppressFlushSync) {
          call2();
        } else {
          require$$0.flushSync(call2);
        }
        if (scrollTopTarget.current !== null) {
          if (scrollTop === scrollTopTarget.current || scrollTop <= 0 || scrollTop === scrollHeight - viewportHeight) {
            scrollTopTarget.current = null;
            smoothScrollTargetReached(true);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
        }
      },
      [scrollContainerStateCallback, smoothScrollTargetReached]
    );
    React__default.useEffect(() => {
      const localRef = customScrollParent ? customScrollParent : scrollerRef.current;
      scrollerRefCallback(customScrollParent ? customScrollParent : scrollerRef.current);
      handler({ target: localRef, suppressFlushSync: true });
      localRef.addEventListener("scroll", handler, { passive: true });
      return () => {
        scrollerRefCallback(null);
        localRef.removeEventListener("scroll", handler);
      };
    }, [scrollerRef, handler, scrollerElement, scrollerRefCallback, customScrollParent]);
    function scrollToCallback(location2) {
      const scrollerElement2 = scrollerRef.current;
      if (!scrollerElement2 || (horizontalDirection ? "offsetWidth" in scrollerElement2 && scrollerElement2.offsetWidth === 0 : "offsetHeight" in scrollerElement2 && scrollerElement2.offsetHeight === 0)) {
        return;
      }
      const isSmooth = location2.behavior === "smooth";
      let offsetHeight;
      let scrollHeight;
      let scrollTop;
      if (scrollerElement2 === window) {
        scrollHeight = Math.max(
          correctItemSize(document.documentElement, horizontalDirection ? "width" : "height"),
          horizontalDirection ? document.documentElement.scrollWidth : document.documentElement.scrollHeight
        );
        offsetHeight = horizontalDirection ? window.innerWidth : window.innerHeight;
        scrollTop = horizontalDirection ? document.documentElement.scrollLeft : document.documentElement.scrollTop;
      } else {
        scrollHeight = scrollerElement2[horizontalDirection ? "scrollWidth" : "scrollHeight"];
        offsetHeight = correctItemSize(scrollerElement2, horizontalDirection ? "width" : "height");
        scrollTop = scrollerElement2[horizontalDirection ? "scrollLeft" : "scrollTop"];
      }
      const maxScrollTop = scrollHeight - offsetHeight;
      location2.top = Math.ceil(Math.max(Math.min(maxScrollTop, location2.top), 0));
      if (approximatelyEqual(offsetHeight, scrollHeight) || location2.top === scrollTop) {
        scrollContainerStateCallback({ scrollTop, scrollHeight, viewportHeight: offsetHeight });
        if (isSmooth) {
          smoothScrollTargetReached(true);
        }
        return;
      }
      if (isSmooth) {
        scrollTopTarget.current = location2.top;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          scrollTopTarget.current = null;
          smoothScrollTargetReached(true);
        }, 1e3);
      } else {
        scrollTopTarget.current = null;
      }
      if (horizontalDirection) {
        location2 = { left: location2.top, behavior: location2.behavior };
      }
      scrollerElement2.scrollTo(location2);
    }
    function scrollByCallback(location2) {
      if (horizontalDirection) {
        location2 = { left: location2.top, behavior: location2.behavior };
      }
      scrollerRef.current.scrollBy(location2);
    }
    return { scrollerRef, scrollByCallback, scrollToCallback };
  }
  const domIOSystem = system(
    () => {
      const scrollContainerState = stream();
      const scrollTop = stream();
      const deviation = statefulStream(0);
      const smoothScrollTargetReached = stream();
      const statefulScrollTop = statefulStream(0);
      const viewportHeight = stream();
      const scrollHeight = stream();
      const headerHeight = statefulStream(0);
      const fixedHeaderHeight = statefulStream(0);
      const fixedFooterHeight = statefulStream(0);
      const footerHeight = statefulStream(0);
      const scrollTo = stream();
      const scrollBy = stream();
      const scrollingInProgress = statefulStream(false);
      const horizontalDirection = statefulStream(false);
      const skipAnimationFrameInResizeObserver = statefulStream(false);
      connect(
        pipe(
          scrollContainerState,
          map(({ scrollTop: scrollTop2 }) => scrollTop2)
        ),
        scrollTop
      );
      connect(
        pipe(
          scrollContainerState,
          map(({ scrollHeight: scrollHeight2 }) => scrollHeight2)
        ),
        scrollHeight
      );
      connect(scrollTop, statefulScrollTop);
      return {
        // input
        scrollContainerState,
        scrollTop,
        viewportHeight,
        headerHeight,
        fixedHeaderHeight,
        fixedFooterHeight,
        footerHeight,
        scrollHeight,
        smoothScrollTargetReached,
        horizontalDirection,
        skipAnimationFrameInResizeObserver,
        // signals
        scrollTo,
        scrollBy,
        // state
        statefulScrollTop,
        deviation,
        scrollingInProgress
      };
    },
    [],
    { singleton: true }
  );
  const SUPPORTS_SCROLL_TO_OPTIONS = typeof document !== "undefined" && "scrollBehavior" in document.documentElement.style;
  function normalizeIndexLocation(location2) {
    const result = typeof location2 === "number" ? { index: location2 } : location2;
    if (!result.align) {
      result.align = "start";
    }
    if (!result.behavior || !SUPPORTS_SCROLL_TO_OPTIONS) {
      result.behavior = "auto";
    }
    if (!result.offset) {
      result.offset = 0;
    }
    return result;
  }
  const UP = "up";
  const DOWN = "down";
  const NONE$1 = "none";
  const INITIAL_BOTTOM_STATE = {
    atBottom: false,
    notAtBottomBecause: "NOT_SHOWING_LAST_ITEM",
    state: {
      offsetBottom: 0,
      scrollTop: 0,
      viewportHeight: 0,
      scrollHeight: 0
    }
  };
  const DEFAULT_AT_TOP_THRESHOLD = 0;
  const stateFlagsSystem = system(([{ scrollContainerState, scrollTop, viewportHeight, headerHeight, footerHeight, scrollBy }]) => {
    const isAtBottom = statefulStream(false);
    const isAtTop = statefulStream(true);
    const atBottomStateChange = stream();
    const atTopStateChange = stream();
    const atBottomThreshold = statefulStream(4);
    const atTopThreshold = statefulStream(DEFAULT_AT_TOP_THRESHOLD);
    const isScrolling = statefulStreamFromEmitter(
      pipe(
        merge(pipe(duc(scrollTop), skip(1), mapTo(true)), pipe(duc(scrollTop), skip(1), mapTo(false), debounceTime(100))),
        distinctUntilChanged()
      ),
      false
    );
    const isScrollingBy = statefulStreamFromEmitter(
      pipe(merge(pipe(scrollBy, mapTo(true)), pipe(scrollBy, mapTo(false), debounceTime(200))), distinctUntilChanged()),
      false
    );
    connect(
      pipe(
        combineLatest(duc(scrollTop), duc(atTopThreshold)),
        map(([top, atTopThreshold2]) => top <= atTopThreshold2),
        distinctUntilChanged()
      ),
      isAtTop
    );
    connect(pipe(isAtTop, throttleTime(50)), atTopStateChange);
    const atBottomState = streamFromEmitter(
      pipe(
        combineLatest(scrollContainerState, duc(viewportHeight), duc(headerHeight), duc(footerHeight), duc(atBottomThreshold)),
        scan((current, [{ scrollTop: scrollTop2, scrollHeight }, viewportHeight2, _headerHeight, _footerHeight, atBottomThreshold2]) => {
          const isAtBottom2 = scrollTop2 + viewportHeight2 - scrollHeight > -atBottomThreshold2;
          const state = {
            viewportHeight: viewportHeight2,
            scrollTop: scrollTop2,
            scrollHeight
          };
          if (isAtBottom2) {
            let atBottomBecause;
            let scrollTopDelta;
            if (scrollTop2 > current.state.scrollTop) {
              atBottomBecause = "SCROLLED_DOWN";
              scrollTopDelta = current.state.scrollTop - scrollTop2;
            } else {
              atBottomBecause = "SIZE_DECREASED";
              scrollTopDelta = current.state.scrollTop - scrollTop2 || current.scrollTopDelta;
            }
            return {
              atBottom: true,
              state,
              atBottomBecause,
              scrollTopDelta
            };
          }
          let notAtBottomBecause;
          if (state.scrollHeight > current.state.scrollHeight) {
            notAtBottomBecause = "SIZE_INCREASED";
          } else if (viewportHeight2 < current.state.viewportHeight) {
            notAtBottomBecause = "VIEWPORT_HEIGHT_DECREASING";
          } else if (scrollTop2 < current.state.scrollTop) {
            notAtBottomBecause = "SCROLLING_UPWARDS";
          } else {
            notAtBottomBecause = "NOT_FULLY_SCROLLED_TO_LAST_ITEM_BOTTOM";
          }
          return {
            atBottom: false,
            notAtBottomBecause,
            state
          };
        }, INITIAL_BOTTOM_STATE),
        distinctUntilChanged((prev2, next2) => {
          return prev2 && prev2.atBottom === next2.atBottom;
        })
      )
    );
    const lastJumpDueToItemResize = statefulStreamFromEmitter(
      pipe(
        scrollContainerState,
        scan(
          (current, { scrollTop: scrollTop2, scrollHeight, viewportHeight: viewportHeight2 }) => {
            if (!approximatelyEqual(current.scrollHeight, scrollHeight)) {
              const atBottom = scrollHeight - (scrollTop2 + viewportHeight2) < 1;
              if (current.scrollTop !== scrollTop2 && atBottom) {
                return {
                  scrollHeight,
                  scrollTop: scrollTop2,
                  jump: current.scrollTop - scrollTop2,
                  changed: true
                };
              } else {
                return {
                  scrollHeight,
                  scrollTop: scrollTop2,
                  jump: 0,
                  changed: true
                };
              }
            } else {
              return {
                scrollTop: scrollTop2,
                scrollHeight,
                jump: 0,
                changed: false
              };
            }
          },
          { scrollHeight: 0, jump: 0, scrollTop: 0, changed: false }
        ),
        filter((value) => value.changed),
        map((value) => value.jump)
      ),
      0
    );
    connect(
      pipe(
        atBottomState,
        map((state) => state.atBottom)
      ),
      isAtBottom
    );
    connect(pipe(isAtBottom, throttleTime(50)), atBottomStateChange);
    const scrollDirection = statefulStream(DOWN);
    connect(
      pipe(
        scrollContainerState,
        map(({ scrollTop: scrollTop2 }) => scrollTop2),
        distinctUntilChanged(),
        scan(
          (acc, scrollTop2) => {
            if (getValue(isScrollingBy)) {
              return { direction: acc.direction, prevScrollTop: scrollTop2 };
            }
            return { direction: scrollTop2 < acc.prevScrollTop ? UP : DOWN, prevScrollTop: scrollTop2 };
          },
          { direction: DOWN, prevScrollTop: 0 }
        ),
        map((value) => value.direction)
      ),
      scrollDirection
    );
    connect(pipe(scrollContainerState, throttleTime(50), mapTo(NONE$1)), scrollDirection);
    const scrollVelocity = statefulStream(0);
    connect(
      pipe(
        isScrolling,
        filter((value) => !value),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        mapTo(0)
      ),
      scrollVelocity
    );
    connect(
      pipe(
        scrollTop,
        throttleTime(100),
        withLatestFrom(isScrolling),
        filter(([_, isScrolling2]) => !!isScrolling2),
        scan(([_, prev2], [next2]) => [prev2, next2], [0, 0]),
        map(([prev2, next2]) => next2 - prev2)
      ),
      scrollVelocity
    );
    return {
      isScrolling,
      isAtTop,
      isAtBottom,
      atBottomState,
      atTopStateChange,
      atBottomStateChange,
      scrollDirection,
      atBottomThreshold,
      atTopThreshold,
      scrollVelocity,
      lastJumpDueToItemResize
    };
  }, tup(domIOSystem));
  const propsReadySystem = system(
    ([{ log }]) => {
      const propsReady = statefulStream(false);
      const didMount = streamFromEmitter(
        pipe(
          propsReady,
          filter((ready) => ready),
          distinctUntilChanged()
        )
      );
      subscribe(propsReady, (value) => {
        value && getValue(log)("props updated", {}, LogLevel.DEBUG);
      });
      return { propsReady, didMount };
    },
    tup(loggerSystem),
    { singleton: true }
  );
  function skipFrames(frameCount, callback) {
    if (frameCount == 0) {
      callback();
    } else {
      requestAnimationFrame(() => skipFrames(frameCount - 1, callback));
    }
  }
  function getInitialTopMostItemIndexNumber(location2, totalCount) {
    const lastIndex = totalCount - 1;
    const index = typeof location2 === "number" ? location2 : location2.index === "LAST" ? lastIndex : location2.index;
    return index;
  }
  function tupleComparator(prev2, current) {
    return !!(prev2 && prev2[0] === current[0] && prev2[1] === current[1]);
  }
  function rangeComparator(prev2, next2) {
    return !!(prev2 && prev2.startIndex === next2.startIndex && prev2.endIndex === next2.endIndex);
  }
  const TOP = "top";
  const BOTTOM = "bottom";
  const NONE = "none";
  function getOverscan(overscan, end, direction) {
    if (typeof overscan === "number") {
      return direction === UP && end === TOP || direction === DOWN && end === BOTTOM ? overscan : 0;
    } else {
      if (direction === UP) {
        return end === TOP ? overscan.main : overscan.reverse;
      } else {
        return end === BOTTOM ? overscan.main : overscan.reverse;
      }
    }
  }
  function getViewportIncrease(value, end) {
    return typeof value === "number" ? value : value[end] || 0;
  }
  const sizeRangeSystem = system(
    ([{ scrollTop, viewportHeight, deviation, headerHeight, fixedHeaderHeight }]) => {
      const listBoundary = stream();
      const topListHeight = statefulStream(0);
      const increaseViewportBy = statefulStream(0);
      const overscan = statefulStream(0);
      const visibleRange = statefulStreamFromEmitter(
        pipe(
          combineLatest(
            duc(scrollTop),
            duc(viewportHeight),
            duc(headerHeight),
            duc(listBoundary, tupleComparator),
            duc(overscan),
            duc(topListHeight),
            duc(fixedHeaderHeight),
            duc(deviation),
            duc(increaseViewportBy)
          ),
          map(
            ([
              scrollTop2,
              viewportHeight2,
              headerHeight2,
              [listTop, listBottom],
              overscan2,
              topListHeight2,
              fixedHeaderHeight2,
              deviation2,
              increaseViewportBy2
            ]) => {
              const top = scrollTop2 - deviation2;
              const stickyHeaderHeight = topListHeight2 + fixedHeaderHeight2;
              const headerVisible = Math.max(headerHeight2 - top, 0);
              let direction = NONE;
              const topViewportAddition = getViewportIncrease(increaseViewportBy2, TOP);
              const bottomViewportAddition = getViewportIncrease(increaseViewportBy2, BOTTOM);
              listTop -= deviation2;
              listTop += headerHeight2 + fixedHeaderHeight2;
              listBottom += headerHeight2 + fixedHeaderHeight2;
              listBottom -= deviation2;
              if (listTop > scrollTop2 + stickyHeaderHeight - topViewportAddition) {
                direction = UP;
              }
              if (listBottom < scrollTop2 - headerVisible + viewportHeight2 + bottomViewportAddition) {
                direction = DOWN;
              }
              if (direction !== NONE) {
                return [
                  Math.max(top - headerHeight2 - getOverscan(overscan2, TOP, direction) - topViewportAddition, 0),
                  top - headerVisible - fixedHeaderHeight2 + viewportHeight2 + getOverscan(overscan2, BOTTOM, direction) + bottomViewportAddition
                ];
              }
              return null;
            }
          ),
          filter((value) => value != null),
          distinctUntilChanged(tupleComparator)
        ),
        [0, 0]
      );
      return {
        // input
        listBoundary,
        overscan,
        topListHeight,
        increaseViewportBy,
        // output
        visibleRange
      };
    },
    tup(domIOSystem),
    { singleton: true }
  );
  const scrollSeekSystem = system(
    ([{ scrollVelocity }]) => {
      const isSeeking = statefulStream(false);
      const rangeChanged = stream();
      const scrollSeekConfiguration = statefulStream(false);
      connect(
        pipe(
          scrollVelocity,
          withLatestFrom(scrollSeekConfiguration, isSeeking, rangeChanged),
          filter(([_, config]) => !!config),
          map(([speed, config, isSeeking2, range]) => {
            const { exit, enter } = config;
            if (isSeeking2) {
              if (exit(speed, range)) {
                return false;
              }
            } else {
              if (enter(speed, range)) {
                return true;
              }
            }
            return isSeeking2;
          }),
          distinctUntilChanged()
        ),
        isSeeking
      );
      subscribe(
        pipe(combineLatest(isSeeking, scrollVelocity, rangeChanged), withLatestFrom(scrollSeekConfiguration)),
        ([[isSeeking2, velocity, range], config]) => isSeeking2 && config && config.change && config.change(velocity, range)
      );
      return { isSeeking, scrollSeekConfiguration, scrollVelocity, scrollSeekRangeChanged: rangeChanged };
    },
    tup(stateFlagsSystem),
    { singleton: true }
  );
  function simpleMemoize(func) {
    let called = false;
    let result;
    return () => {
      if (!called) {
        called = true;
        result = func();
      }
      return result;
    };
  }
  const windowScrollerSystem = system(([{ scrollTo, scrollContainerState }]) => {
    const windowScrollContainerState = stream();
    const windowViewportRect = stream();
    const windowScrollTo = stream();
    const useWindowScroll = statefulStream(false);
    const customScrollParent = statefulStream(void 0);
    connect(
      pipe(
        combineLatest(windowScrollContainerState, windowViewportRect),
        map(([{ viewportHeight, scrollTop: windowScrollTop, scrollHeight }, { offsetTop }]) => {
          return {
            scrollTop: Math.max(0, windowScrollTop - offsetTop),
            scrollHeight,
            viewportHeight
          };
        })
      ),
      scrollContainerState
    );
    connect(
      pipe(
        scrollTo,
        withLatestFrom(windowViewportRect),
        map(([scrollTo2, { offsetTop }]) => {
          return {
            ...scrollTo2,
            top: scrollTo2.top + offsetTop
          };
        })
      ),
      windowScrollTo
    );
    return {
      // config
      useWindowScroll,
      customScrollParent,
      // input
      windowScrollContainerState,
      windowViewportRect,
      // signals
      windowScrollTo
    };
  }, tup(domIOSystem));
  const WEBKIT_STICKY = "-webkit-sticky";
  const STICKY = "sticky";
  const positionStickyCssValue = simpleMemoize(() => {
    if (typeof document === "undefined") {
      return STICKY;
    }
    const node2 = document.createElement("div");
    node2.style.position = WEBKIT_STICKY;
    return node2.style.position === WEBKIT_STICKY ? WEBKIT_STICKY : STICKY;
  });
  function useWindowViewportRectRef(callback, customScrollParent, skipAnimationFrame) {
    const viewportInfo = React__default.useRef(null);
    const calculateInfo = React__default.useCallback(
      (element) => {
        if (element === null || !element.offsetParent) {
          return;
        }
        const rect = element.getBoundingClientRect();
        const visibleWidth = rect.width;
        let visibleHeight, offsetTop;
        if (customScrollParent) {
          const customScrollParentRect = customScrollParent.getBoundingClientRect();
          const deltaTop = rect.top - customScrollParentRect.top;
          visibleHeight = customScrollParentRect.height - Math.max(0, deltaTop);
          offsetTop = deltaTop + customScrollParent.scrollTop;
        } else {
          visibleHeight = window.innerHeight - Math.max(0, rect.top);
          offsetTop = rect.top + window.pageYOffset;
        }
        viewportInfo.current = {
          offsetTop,
          visibleHeight,
          visibleWidth
        };
        callback(viewportInfo.current);
      },
      [callback, customScrollParent]
    );
    const { callbackRef, ref } = useSizeWithElRef(calculateInfo, true);
    const scrollAndResizeEventHandler = React__default.useCallback(() => {
      calculateInfo(ref.current);
    }, [calculateInfo, ref]);
    React__default.useEffect(() => {
      if (customScrollParent) {
        customScrollParent.addEventListener("scroll", scrollAndResizeEventHandler);
        const observer = new ResizeObserver(() => {
          requestAnimationFrame(scrollAndResizeEventHandler);
        });
        observer.observe(customScrollParent);
        return () => {
          customScrollParent.removeEventListener("scroll", scrollAndResizeEventHandler);
          observer.unobserve(customScrollParent);
        };
      } else {
        window.addEventListener("scroll", scrollAndResizeEventHandler);
        window.addEventListener("resize", scrollAndResizeEventHandler);
        return () => {
          window.removeEventListener("scroll", scrollAndResizeEventHandler);
          window.removeEventListener("resize", scrollAndResizeEventHandler);
        };
      }
    }, [scrollAndResizeEventHandler, customScrollParent]);
    return callbackRef;
  }
  React__default.createContext(void 0);
  const VirtuosoGridMockContext = React__default.createContext(void 0);
  function identity(value) {
    return value;
  }
  ({ position: positionStickyCssValue(), zIndex: 1, overflowAnchor: "none" });
  const scrollerStyle = {
    height: "100%",
    outline: "none",
    overflowY: "auto",
    position: "relative",
    WebkitOverflowScrolling: "touch"
  };
  const horizontalScrollerStyle = {
    outline: "none",
    overflowX: "auto",
    position: "relative"
  };
  const viewportStyle = (alignToBottom) => ({
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    ...{}
  });
  ({
    width: "100%",
    position: positionStickyCssValue(),
    top: 0,
    zIndex: 1
  });
  function contextPropIfNotDomElement(element, context) {
    if (typeof element === "string") {
      return void 0;
    }
    return { context };
  }
  function buildScroller({ usePublisher: usePublisher2, useEmitter: useEmitter2, useEmitterValue: useEmitterValue2 }) {
    const Scroller2 = React__default.memo(function VirtuosoScroller({ style, children, ...props }) {
      const scrollContainerStateCallback = usePublisher2("scrollContainerState");
      const ScrollerComponent = useEmitterValue2("ScrollerComponent");
      const smoothScrollTargetReached = usePublisher2("smoothScrollTargetReached");
      const scrollerRefCallback = useEmitterValue2("scrollerRef");
      const context = useEmitterValue2("context");
      const horizontalDirection = useEmitterValue2("horizontalDirection") || false;
      const { scrollerRef, scrollByCallback, scrollToCallback } = useScrollTop(
        scrollContainerStateCallback,
        smoothScrollTargetReached,
        ScrollerComponent,
        scrollerRefCallback,
        void 0,
        horizontalDirection
      );
      useEmitter2("scrollTo", scrollToCallback);
      useEmitter2("scrollBy", scrollByCallback);
      const defaultStyle = horizontalDirection ? horizontalScrollerStyle : scrollerStyle;
      return React__default.createElement(
        ScrollerComponent,
        {
          ref: scrollerRef,
          style: { ...defaultStyle, ...style },
          "data-testid": "virtuoso-scroller",
          "data-virtuoso-scroller": true,
          tabIndex: 0,
          ...props,
          ...contextPropIfNotDomElement(ScrollerComponent, context)
        },
        children
      );
    });
    return Scroller2;
  }
  function buildWindowScroller({ usePublisher: usePublisher2, useEmitter: useEmitter2, useEmitterValue: useEmitterValue2 }) {
    const Scroller2 = React__default.memo(function VirtuosoWindowScroller({ style, children, ...props }) {
      const scrollContainerStateCallback = usePublisher2("windowScrollContainerState");
      const ScrollerComponent = useEmitterValue2("ScrollerComponent");
      const smoothScrollTargetReached = usePublisher2("smoothScrollTargetReached");
      const totalListHeight = useEmitterValue2("totalListHeight");
      const deviation = useEmitterValue2("deviation");
      const customScrollParent = useEmitterValue2("customScrollParent");
      const context = useEmitterValue2("context");
      const { scrollerRef, scrollByCallback, scrollToCallback } = useScrollTop(
        scrollContainerStateCallback,
        smoothScrollTargetReached,
        ScrollerComponent,
        noop,
        customScrollParent
      );
      useIsomorphicLayoutEffect$1(() => {
        scrollerRef.current = customScrollParent ? customScrollParent : window;
        return () => {
          scrollerRef.current = null;
        };
      }, [scrollerRef, customScrollParent]);
      useEmitter2("windowScrollTo", scrollToCallback);
      useEmitter2("scrollBy", scrollByCallback);
      return React__default.createElement(
        ScrollerComponent,
        {
          style: { position: "relative", ...style, ...totalListHeight !== 0 ? { height: totalListHeight + deviation } : {} },
          "data-virtuoso-scroller": true,
          ...props,
          ...contextPropIfNotDomElement(ScrollerComponent, context)
        },
        children
      );
    });
    return Scroller2;
  }
  const INITIAL_GRID_STATE = {
    items: [],
    offsetBottom: 0,
    offsetTop: 0,
    top: 0,
    bottom: 0,
    itemHeight: 0,
    itemWidth: 0
  };
  const PROBE_GRID_STATE = {
    items: [{ index: 0 }],
    offsetBottom: 0,
    offsetTop: 0,
    top: 0,
    bottom: 0,
    itemHeight: 0,
    itemWidth: 0
  };
  const { round, ceil, floor, min, max } = Math;
  function buildProbeGridState(items) {
    return {
      ...PROBE_GRID_STATE,
      items
    };
  }
  function buildItems(startIndex, endIndex, data) {
    return Array.from({ length: endIndex - startIndex + 1 }).map((_, i2) => {
      const dataItem = data === null ? null : data[i2 + startIndex];
      return { index: i2 + startIndex, data: dataItem };
    });
  }
  function gapComparator(prev2, next2) {
    return prev2 && prev2.column === next2.column && prev2.row === next2.row;
  }
  function dimensionComparator(prev2, next2) {
    return prev2 && prev2.width === next2.width && prev2.height === next2.height;
  }
  const gridSystem = /* @__PURE__ */ system(
    ([
      { overscan, visibleRange, listBoundary },
      { scrollTop, viewportHeight, scrollBy, scrollTo, smoothScrollTargetReached, scrollContainerState, footerHeight, headerHeight },
      stateFlags,
      scrollSeek,
      { propsReady, didMount },
      { windowViewportRect, useWindowScroll, customScrollParent, windowScrollContainerState, windowScrollTo },
      log
    ]) => {
      const totalCount = statefulStream(0);
      const initialItemCount = statefulStream(0);
      const gridState = statefulStream(INITIAL_GRID_STATE);
      const viewportDimensions = statefulStream({ height: 0, width: 0 });
      const itemDimensions = statefulStream({ height: 0, width: 0 });
      const scrollToIndex = stream();
      const scrollHeight = stream();
      const deviation = statefulStream(0);
      const data = statefulStream(null);
      const gap = statefulStream({ row: 0, column: 0 });
      const stateChanged = stream();
      const restoreStateFrom = stream();
      const stateRestoreInProgress = statefulStream(false);
      const initialTopMostItemIndex = statefulStream(0);
      const scrolledToInitialItem = statefulStream(true);
      const scrollScheduled = statefulStream(false);
      const horizontalDirection = statefulStream(false);
      subscribe(
        pipe(
          didMount,
          withLatestFrom(initialTopMostItemIndex),
          filter(([_, location2]) => !!location2)
        ),
        () => {
          publish(scrolledToInitialItem, false);
          publish(initialItemCount, 0);
        }
      );
      subscribe(
        pipe(
          combineLatest(didMount, scrolledToInitialItem, itemDimensions, viewportDimensions, initialTopMostItemIndex, scrollScheduled),
          filter(([didMount2, scrolledToInitialItem2, itemDimensions2, viewportDimensions2, , scrollScheduled2]) => {
            return didMount2 && !scrolledToInitialItem2 && itemDimensions2.height !== 0 && viewportDimensions2.height !== 0 && !scrollScheduled2;
          })
        ),
        ([, , , , initialTopMostItemIndex2]) => {
          publish(scrollScheduled, true);
          skipFrames(1, () => {
            publish(scrollToIndex, initialTopMostItemIndex2);
          });
          handleNext(pipe(scrollTop), () => {
            publish(listBoundary, [0, 0]);
            publish(scrolledToInitialItem, true);
          });
        }
      );
      connect(
        pipe(
          restoreStateFrom,
          filter((value) => value !== void 0 && value !== null && value.scrollTop > 0),
          mapTo(0)
        ),
        initialItemCount
      );
      subscribe(
        pipe(
          didMount,
          withLatestFrom(restoreStateFrom),
          filter(([, snapshot2]) => snapshot2 !== void 0 && snapshot2 !== null)
        ),
        ([, snapshot2]) => {
          if (!snapshot2) {
            return;
          }
          publish(viewportDimensions, snapshot2.viewport), publish(itemDimensions, snapshot2 == null ? void 0 : snapshot2.item);
          publish(gap, snapshot2.gap);
          if (snapshot2.scrollTop > 0) {
            publish(stateRestoreInProgress, true);
            handleNext(pipe(scrollTop, skip(1)), (_value) => {
              publish(stateRestoreInProgress, false);
            });
            publish(scrollTo, { top: snapshot2.scrollTop });
          }
        }
      );
      connect(
        pipe(
          viewportDimensions,
          map(({ height }) => height)
        ),
        viewportHeight
      );
      connect(
        pipe(
          combineLatest(
            duc(viewportDimensions, dimensionComparator),
            duc(itemDimensions, dimensionComparator),
            duc(gap, (prev2, next2) => prev2 && prev2.column === next2.column && prev2.row === next2.row),
            duc(scrollTop)
          ),
          map(([viewport, item2, gap2, scrollTop2]) => ({
            viewport,
            item: item2,
            gap: gap2,
            scrollTop: scrollTop2
          }))
        ),
        stateChanged
      );
      connect(
        pipe(
          combineLatest(
            duc(totalCount),
            visibleRange,
            duc(gap, gapComparator),
            duc(itemDimensions, dimensionComparator),
            duc(viewportDimensions, dimensionComparator),
            duc(data),
            duc(initialItemCount),
            duc(stateRestoreInProgress),
            duc(scrolledToInitialItem),
            duc(initialTopMostItemIndex)
          ),
          filter(([, , , , , , , stateRestoreInProgress2]) => {
            return !stateRestoreInProgress2;
          }),
          map(
            ([
              totalCount2,
              [startOffset, endOffset],
              gap2,
              item2,
              viewport,
              data2,
              initialItemCount2,
              ,
              scrolledToInitialItem2,
              initialTopMostItemIndex2
            ]) => {
              const { row: rowGap, column: columnGap } = gap2;
              const { height: itemHeight, width: itemWidth } = item2;
              const { width: viewportWidth } = viewport;
              if (initialItemCount2 === 0 && (totalCount2 === 0 || viewportWidth === 0)) {
                return INITIAL_GRID_STATE;
              }
              if (itemWidth === 0) {
                const startIndex2 = getInitialTopMostItemIndexNumber(initialTopMostItemIndex2, totalCount2);
                const endIndex2 = startIndex2 === 0 ? Math.max(initialItemCount2 - 1, 0) : startIndex2;
                return buildProbeGridState(buildItems(startIndex2, endIndex2, data2));
              }
              const perRow = itemsPerRow(viewportWidth, itemWidth, columnGap);
              let startIndex;
              let endIndex;
              if (!scrolledToInitialItem2) {
                startIndex = 0;
                endIndex = -1;
              } else if (startOffset === 0 && endOffset === 0 && initialItemCount2 > 0) {
                startIndex = 0;
                endIndex = initialItemCount2 - 1;
              } else {
                startIndex = perRow * floor((startOffset + rowGap) / (itemHeight + rowGap));
                endIndex = perRow * ceil((endOffset + rowGap) / (itemHeight + rowGap)) - 1;
                endIndex = min(totalCount2 - 1, max(endIndex, perRow - 1));
                startIndex = min(endIndex, max(0, startIndex));
              }
              const items = buildItems(startIndex, endIndex, data2);
              const { top, bottom } = gridLayout(viewport, gap2, item2, items);
              const rowCount = ceil(totalCount2 / perRow);
              const totalHeight = rowCount * itemHeight + (rowCount - 1) * rowGap;
              const offsetBottom = totalHeight - bottom;
              return { items, offsetTop: top, offsetBottom, top, bottom, itemHeight, itemWidth };
            }
          )
        ),
        gridState
      );
      connect(
        pipe(
          data,
          filter((data2) => data2 !== null),
          map((data2) => data2.length)
        ),
        totalCount
      );
      connect(
        pipe(
          combineLatest(viewportDimensions, itemDimensions, gridState, gap),
          filter(([viewportDimensions2, itemDimensions2, { items }]) => {
            return items.length > 0 && itemDimensions2.height !== 0 && viewportDimensions2.height !== 0;
          }),
          map(([viewportDimensions2, itemDimensions2, { items }, gap2]) => {
            const { top, bottom } = gridLayout(viewportDimensions2, gap2, itemDimensions2, items);
            return [top, bottom];
          }),
          distinctUntilChanged(tupleComparator)
        ),
        listBoundary
      );
      const hasScrolled = statefulStream(false);
      connect(
        pipe(
          scrollTop,
          withLatestFrom(hasScrolled),
          map(([scrollTop2, hasScrolled2]) => {
            return hasScrolled2 || scrollTop2 !== 0;
          })
        ),
        hasScrolled
      );
      const endReached = streamFromEmitter(
        pipe(
          duc(gridState),
          filter(({ items }) => items.length > 0),
          withLatestFrom(totalCount, hasScrolled),
          filter(([{ items }, totalCount2, hasScrolled2]) => hasScrolled2 && items[items.length - 1].index === totalCount2 - 1),
          map(([, totalCount2]) => totalCount2 - 1),
          distinctUntilChanged()
        )
      );
      const startReached = streamFromEmitter(
        pipe(
          duc(gridState),
          filter(({ items }) => {
            return items.length > 0 && items[0].index === 0;
          }),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          mapTo(0),
          distinctUntilChanged()
        )
      );
      const rangeChanged = streamFromEmitter(
        pipe(
          duc(gridState),
          withLatestFrom(stateRestoreInProgress),
          filter(([{ items }, stateRestoreInProgress2]) => items.length > 0 && !stateRestoreInProgress2),
          map(([{ items }]) => {
            return {
              startIndex: items[0].index,
              endIndex: items[items.length - 1].index
            };
          }),
          distinctUntilChanged(rangeComparator),
          throttleTime(0)
        )
      );
      connect(rangeChanged, scrollSeek.scrollSeekRangeChanged);
      connect(
        pipe(
          scrollToIndex,
          withLatestFrom(viewportDimensions, itemDimensions, totalCount, gap),
          map(([location2, viewportDimensions2, itemDimensions2, totalCount2, gap2]) => {
            const normalLocation = normalizeIndexLocation(location2);
            const { align, behavior, offset } = normalLocation;
            let index = normalLocation.index;
            if (index === "LAST") {
              index = totalCount2 - 1;
            }
            index = max(0, index, min(totalCount2 - 1, index));
            let top = itemTop(viewportDimensions2, gap2, itemDimensions2, index);
            if (align === "end") {
              top = round(top - viewportDimensions2.height + itemDimensions2.height);
            } else if (align === "center") {
              top = round(top - viewportDimensions2.height / 2 + itemDimensions2.height / 2);
            }
            if (offset) {
              top += offset;
            }
            return { top, behavior };
          })
        ),
        scrollTo
      );
      const totalListHeight = statefulStreamFromEmitter(
        pipe(
          gridState,
          map((gridState2) => {
            return gridState2.offsetBottom + gridState2.bottom;
          })
        ),
        0
      );
      connect(
        pipe(
          windowViewportRect,
          map((viewportInfo) => ({ width: viewportInfo.visibleWidth, height: viewportInfo.visibleHeight }))
        ),
        viewportDimensions
      );
      return {
        // input
        data,
        totalCount,
        viewportDimensions,
        itemDimensions,
        scrollTop,
        scrollHeight,
        overscan,
        scrollBy,
        scrollTo,
        scrollToIndex,
        smoothScrollTargetReached,
        windowViewportRect,
        windowScrollTo,
        useWindowScroll,
        customScrollParent,
        windowScrollContainerState,
        deviation,
        scrollContainerState,
        footerHeight,
        headerHeight,
        initialItemCount,
        gap,
        restoreStateFrom,
        ...scrollSeek,
        initialTopMostItemIndex,
        horizontalDirection,
        // output
        gridState,
        totalListHeight,
        ...stateFlags,
        startReached,
        endReached,
        rangeChanged,
        stateChanged,
        propsReady,
        stateRestoreInProgress,
        ...log
      };
    },
    tup(sizeRangeSystem, domIOSystem, stateFlagsSystem, scrollSeekSystem, propsReadySystem, windowScrollerSystem, loggerSystem)
  );
  function gridLayout(viewport, gap, item2, items) {
    const { height: itemHeight } = item2;
    if (itemHeight === void 0 || items.length === 0) {
      return { top: 0, bottom: 0 };
    }
    const top = itemTop(viewport, gap, item2, items[0].index);
    const bottom = itemTop(viewport, gap, item2, items[items.length - 1].index) + itemHeight;
    return { top, bottom };
  }
  function itemTop(viewport, gap, item2, index) {
    const perRow = itemsPerRow(viewport.width, item2.width, gap.column);
    const rowCount = floor(index / perRow);
    const top = rowCount * item2.height + max(0, rowCount - 1) * gap.row;
    return top > 0 ? top + gap.row : top;
  }
  function itemsPerRow(viewportWidth, itemWidth, gap) {
    return max(1, floor((viewportWidth + gap) / (floor(itemWidth) + gap)));
  }
  const gridComponentPropsSystem = /* @__PURE__ */ system(() => {
    const itemContent = statefulStream((index) => `Item ${index}`);
    const components = statefulStream({});
    const context = statefulStream(null);
    const itemClassName = statefulStream("virtuoso-grid-item");
    const listClassName = statefulStream("virtuoso-grid-list");
    const computeItemKey = statefulStream(identity);
    const headerFooterTag = statefulStream("div");
    const scrollerRef = statefulStream(noop);
    const distinctProp = (propName, defaultValue2 = null) => {
      return statefulStreamFromEmitter(
        pipe(
          components,
          map((components2) => components2[propName]),
          distinctUntilChanged()
        ),
        defaultValue2
      );
    };
    const readyStateChanged = statefulStream(false);
    const reportReadyState = statefulStream(false);
    connect(duc(reportReadyState), readyStateChanged);
    return {
      readyStateChanged,
      reportReadyState,
      context,
      itemContent,
      components,
      computeItemKey,
      itemClassName,
      listClassName,
      headerFooterTag,
      scrollerRef,
      FooterComponent: distinctProp("Footer"),
      HeaderComponent: distinctProp("Header"),
      ListComponent: distinctProp("List", "div"),
      ItemComponent: distinctProp("Item", "div"),
      ScrollerComponent: distinctProp("Scroller", "div"),
      ScrollSeekPlaceholder: distinctProp("ScrollSeekPlaceholder", "div")
    };
  });
  const combinedSystem$1 = /* @__PURE__ */ system(([gridSystem2, gridComponentPropsSystem2]) => {
    return { ...gridSystem2, ...gridComponentPropsSystem2 };
  }, tup(gridSystem, gridComponentPropsSystem));
  const GridItems = /* @__PURE__ */ React__default.memo(function GridItems2() {
    const gridState = useEmitterValue$1("gridState");
    const listClassName = useEmitterValue$1("listClassName");
    const itemClassName = useEmitterValue$1("itemClassName");
    const itemContent = useEmitterValue$1("itemContent");
    const computeItemKey = useEmitterValue$1("computeItemKey");
    const isSeeking = useEmitterValue$1("isSeeking");
    const scrollHeightCallback = usePublisher$1("scrollHeight");
    const ItemComponent = useEmitterValue$1("ItemComponent");
    const ListComponent = useEmitterValue$1("ListComponent");
    const ScrollSeekPlaceholder = useEmitterValue$1("ScrollSeekPlaceholder");
    const context = useEmitterValue$1("context");
    const itemDimensions = usePublisher$1("itemDimensions");
    const gridGap = usePublisher$1("gap");
    const log = useEmitterValue$1("log");
    const stateRestoreInProgress = useEmitterValue$1("stateRestoreInProgress");
    const reportReadyState = usePublisher$1("reportReadyState");
    const listRef = useSize(
      React__default.useMemo(
        () => (el) => {
          const scrollHeight = el.parentElement.parentElement.scrollHeight;
          scrollHeightCallback(scrollHeight);
          const firstItem = el.firstChild;
          if (firstItem) {
            const { width, height } = firstItem.getBoundingClientRect();
            itemDimensions({ width, height });
          }
          gridGap({
            row: resolveGapValue("row-gap", getComputedStyle(el).rowGap, log),
            column: resolveGapValue("column-gap", getComputedStyle(el).columnGap, log)
          });
        },
        [scrollHeightCallback, itemDimensions, gridGap, log]
      ),
      true
    );
    if (stateRestoreInProgress) {
      return null;
    }
    useIsomorphicLayoutEffect$1(() => {
      if (gridState.itemHeight > 0 && gridState.itemWidth > 0) {
        reportReadyState(true);
      }
    }, [gridState]);
    return React__default.createElement(
      ListComponent,
      {
        ref: listRef,
        className: listClassName,
        ...contextPropIfNotDomElement(ListComponent, context),
        style: { paddingTop: gridState.offsetTop, paddingBottom: gridState.offsetBottom },
        "data-testid": "virtuoso-item-list"
      },
      gridState.items.map((item2) => {
        const key = computeItemKey(item2.index, item2.data, context);
        return isSeeking ? React__default.createElement(ScrollSeekPlaceholder, {
          key,
          ...contextPropIfNotDomElement(ScrollSeekPlaceholder, context),
          index: item2.index,
          height: gridState.itemHeight,
          width: gridState.itemWidth
        }) : React__default.createElement(
          ItemComponent,
          { ...contextPropIfNotDomElement(ItemComponent, context), className: itemClassName, "data-index": item2.index, key },
          itemContent(item2.index, item2.data, context)
        );
      })
    );
  });
  const Header = React__default.memo(function VirtuosoHeader2() {
    const Header2 = useEmitterValue$1("HeaderComponent");
    const headerHeight = usePublisher$1("headerHeight");
    const headerFooterTag = useEmitterValue$1("headerFooterTag");
    const ref = useSize(
      React__default.useMemo(() => (el) => headerHeight(correctItemSize(el, "height")), [headerHeight]),
      true
    );
    const context = useEmitterValue$1("context");
    return Header2 ? React__default.createElement(headerFooterTag, { ref }, React__default.createElement(Header2, contextPropIfNotDomElement(Header2, context))) : null;
  });
  const Footer = React__default.memo(function VirtuosoGridFooter() {
    const Footer2 = useEmitterValue$1("FooterComponent");
    const footerHeight = usePublisher$1("footerHeight");
    const headerFooterTag = useEmitterValue$1("headerFooterTag");
    const ref = useSize(
      React__default.useMemo(() => (el) => footerHeight(correctItemSize(el, "height")), [footerHeight]),
      true
    );
    const context = useEmitterValue$1("context");
    return Footer2 ? React__default.createElement(headerFooterTag, { ref }, React__default.createElement(Footer2, contextPropIfNotDomElement(Footer2, context))) : null;
  });
  const Viewport$1 = ({ children }) => {
    const ctx = React__default.useContext(VirtuosoGridMockContext);
    const itemDimensions = usePublisher$1("itemDimensions");
    const viewportDimensions = usePublisher$1("viewportDimensions");
    const viewportRef = useSize(
      React__default.useMemo(
        () => (el) => {
          viewportDimensions(el.getBoundingClientRect());
        },
        [viewportDimensions]
      ),
      true
    );
    React__default.useEffect(() => {
      if (ctx) {
        viewportDimensions({ height: ctx.viewportHeight, width: ctx.viewportWidth });
        itemDimensions({ height: ctx.itemHeight, width: ctx.itemWidth });
      }
    }, [ctx, viewportDimensions, itemDimensions]);
    return /* @__PURE__ */ React__default.createElement("div", { style: viewportStyle(), ref: viewportRef }, children);
  };
  const WindowViewport$1 = ({ children }) => {
    const ctx = React__default.useContext(VirtuosoGridMockContext);
    const windowViewportRect = usePublisher$1("windowViewportRect");
    const itemDimensions = usePublisher$1("itemDimensions");
    const customScrollParent = useEmitterValue$1("customScrollParent");
    const viewportRef = useWindowViewportRectRef(windowViewportRect, customScrollParent);
    React__default.useEffect(() => {
      if (ctx) {
        itemDimensions({ height: ctx.itemHeight, width: ctx.itemWidth });
        windowViewportRect({ offsetTop: 0, visibleHeight: ctx.viewportHeight, visibleWidth: ctx.viewportWidth });
      }
    }, [ctx, windowViewportRect, itemDimensions]);
    return /* @__PURE__ */ React__default.createElement("div", { ref: viewportRef, style: viewportStyle() }, children);
  };
  const GridRoot = /* @__PURE__ */ React__default.memo(function GridRoot2({ ...props }) {
    const useWindowScroll = useEmitterValue$1("useWindowScroll");
    const customScrollParent = useEmitterValue$1("customScrollParent");
    const TheScroller = customScrollParent || useWindowScroll ? WindowScroller$1 : Scroller$1;
    const TheViewport = customScrollParent || useWindowScroll ? WindowViewport$1 : Viewport$1;
    return /* @__PURE__ */ React__default.createElement(TheScroller, { ...props }, /* @__PURE__ */ React__default.createElement(TheViewport, null, /* @__PURE__ */ React__default.createElement(Header, null), /* @__PURE__ */ React__default.createElement(GridItems, null), /* @__PURE__ */ React__default.createElement(Footer, null)));
  });
  const {
    Component: Grid,
    usePublisher: usePublisher$1,
    useEmitterValue: useEmitterValue$1,
    useEmitter: useEmitter$1
  } = /* @__PURE__ */ systemToComponent(
    combinedSystem$1,
    {
      optional: {
        context: "context",
        totalCount: "totalCount",
        overscan: "overscan",
        itemContent: "itemContent",
        components: "components",
        computeItemKey: "computeItemKey",
        data: "data",
        initialItemCount: "initialItemCount",
        scrollSeekConfiguration: "scrollSeekConfiguration",
        headerFooterTag: "headerFooterTag",
        listClassName: "listClassName",
        itemClassName: "itemClassName",
        useWindowScroll: "useWindowScroll",
        customScrollParent: "customScrollParent",
        scrollerRef: "scrollerRef",
        logLevel: "logLevel",
        restoreStateFrom: "restoreStateFrom",
        initialTopMostItemIndex: "initialTopMostItemIndex"
      },
      methods: {
        scrollTo: "scrollTo",
        scrollBy: "scrollBy",
        scrollToIndex: "scrollToIndex"
      },
      events: {
        isScrolling: "isScrolling",
        endReached: "endReached",
        startReached: "startReached",
        rangeChanged: "rangeChanged",
        atBottomStateChange: "atBottomStateChange",
        atTopStateChange: "atTopStateChange",
        stateChanged: "stateChanged",
        readyStateChanged: "readyStateChanged"
      }
    },
    GridRoot
  );
  const Scroller$1 = /* @__PURE__ */ buildScroller({ usePublisher: usePublisher$1, useEmitterValue: useEmitterValue$1, useEmitter: useEmitter$1 });
  const WindowScroller$1 = /* @__PURE__ */ buildWindowScroller({ usePublisher: usePublisher$1, useEmitterValue: useEmitterValue$1, useEmitter: useEmitter$1 });
  function resolveGapValue(property, value, log) {
    if (value !== "normal" && !(value == null ? void 0 : value.endsWith("px"))) {
      log(`${property} was not resolved to pixel value correctly`, value, LogLevel.WARN);
    }
    if (value === "normal") {
      return 0;
    }
    return parseInt(value != null ? value : "0", 10);
  }
  const VirtuosoGrid = Grid;
  const item = "_item_is514_1";
  const movieBox = "_movie-box_is514_23";
  const photoFrame = "_photo-frame_is514_32";
  const img = "_img_is514_38";
  const photoInfoExtra = "_photo-info-extra_is514_50";
  const PRESET_TAG_COLORS = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple"
  ];
  const TitleMap = {
    高清: "包含高清HD的磁力連結",
    今日新種: "包含最新出種的磁力連結",
    字幕: "包含字幕的磁力連結"
  };
  const imgReplace = [
    {
      regex: /\/thumbs?\//i,
      replace: (val) => val.replace(/\/thumbs?\//g, "/cover/").replace(".jpg", "_b.jpg")
    },
    {
      regex: /pics\.dmm\.co\.jp/i,
      replace: (val) => val.replace("ps.jpg", "pl.jpg")
    }
  ];
  const Card = React__default.memo(function Card2({ item: item$1 }) {
    var _a;
    const cover = React__default.useMemo(() => {
      let url = item$1.cover;
      imgReplace.forEach(({ regex, replace: replace2 }) => {
        if (regex.test(url)) {
          url = replace2(url);
        }
      });
      return url;
    }, [item$1.cover]);
    const onRightClick = useMemoizedFn((e2) => {
      e2.preventDefault();
      GM_openInTab(item$1.link, { active: false });
    });
    const tags = ((_a = item$1.detailInfo) == null ? void 0 : _a.tags) || [];
    const tagColors = React__default.useMemo(() => lodash.shuffle(PRESET_TAG_COLORS), []);
    return jsx("div", { className: item, onContextMenu: onRightClick, children: jsx(
      antd.Tooltip,
      {
        align: { offset: [0, 0] },
        title: jsx(Fragment, { children: tags.length ? tags.map((t2, index) => jsx(
          antd.Tag,
          {
            color: tagColors[index % PRESET_TAG_COLORS.length],
            css: css$1`
                      &.ant-tag {
                        margin-bottom: 4px;
                        margin-right: 6px;
                      }
                    `,
            children: t2.name
          },
          t2.url
        )) : "暂无标签" }),
        children: jsxs("a", { className: movieBox, href: item$1.link, target: "_blank", children: [
          jsx("div", { className: photoFrame, children: jsx("img", { src: cover, title: item$1.name, className: img, loading: "eager" }) }),
          jsx("div", { className: cx("photo-info", photoInfoExtra), children: jsxs("span", { children: [
            jsx("div", { title: item$1.name, className: "x-ellipsis x-title", children: item$1.name }),
            jsx(
              "div",
              {
                css: css$1`
                  height: 22px;
                  margin: 4px 0;
                  white-space: nowrap;
                `,
                children: (item$1.magnetTags || []).map((t2) => {
                  return jsx(
                    "button",
                    {
                      disabled: true,
                      className: `btn btn-xs ${t2.className}`,
                      title: TitleMap[t2.text] || "",
                      css: css$1`
                        margin-left: 4px;
                        &:first-of-type {
                          margin-left: 0;
                        }
                      `,
                      children: t2.text
                    },
                    t2.text + t2.className
                  );
                })
              }
            ),
            jsx("span", { children: item$1.id }),
            " / ",
            jsx("span", { children: item$1.date })
          ] }) })
        ] })
      }
    ) });
  });
  const container = "_container_13vny_1";
  const actionsWrapper = "_actions-wrapper_13vny_7";
  const tag = "_tag_13vny_13";
  const grid = "_grid_13vny_39";
  function MoreFilterPanelTrigger() {
    const { moreFilterPanelExpanded, searchText } = useSnapshot(store);
    return jsx(CustomTooltip, { title: "使用 制作商 / 发行商 / 系列 / 导演 / 演员 / 番号前缀 / 标题搜索 等条件来进行筛选", children: jsxs(
      antd.Button,
      {
        css: [
          css$1`
            position: relative;
            display: flex;
            align-items: center;
          `,
          moreFilterPanelExpanded && css$1`
              color: var(--ant-button-default-active-color);
              border-color: var(--ant-button-default-active-border-color);
              background: var(--ant-button-default-active-bg);
            `
        ],
        onClick: () => {
          if (moreFilterPanelExpanded) {
            const hasFilter = stateKeys.some((k2) => !!store[k2]) || searchText || store.enableFilterByStarCount;
            if (hasFilter) {
              antd.message.warning("无法收起面板, 请先清除面板内筛选条件~");
              return;
            }
          }
          store.moreFilterPanelExpanded = !store.moreFilterPanelExpanded;
        },
        children: [
          "更多筛选条件",
          jsx(
            IconPark,
            {
              name: "DownC",
              size: 14,
              ml: 6,
              css: css$1`
            transition: transform 0.3s ease;
            transform: ${moreFilterPanelExpanded ? "rotate(180deg)" : "rotate(0deg)"};
          `
            }
          )
        ]
      }
    ) });
  }
  const styles = {
    wrapper: css$1`
    display: flex;
    align-items: center;
  `,
    label: css$1`
    min-width: 66px;
    text-align: right;
  `,
    input: css$1`
    margin-left: 10px;
    width: 300px;
  `
  };
  const stateKeys = [
    "selectedStudio",
    "selectedLabel",
    "selectedSeries",
    "selectedDirector",
    "selectedStar",
    "selectedPrefix"
  ];
  function MoreFilterPanel() {
    const {
      videosAfterFilterByCollection,
      videosAfterFilterByScope,
      selectedStudio,
      selectedLabel,
      selectedDirector,
      selectedSeries,
      selectedStar,
      allStudios,
      allLabels,
      allDirectors,
      allSeries,
      allStars,
      allPrefixs,
      selectedPrefix
    } = useSnapshot(store);
    const predicate = (s2, v2) => s2.value === v2;
    useValidCheck(allPrefixs, selectedPrefix, "selectedPrefix", predicate);
    useValidCheck(allStudios, selectedStudio, "selectedStudio", predicate);
    useValidCheck(allLabels, selectedLabel, "selectedLabel", predicate);
    useValidCheck(allSeries, selectedSeries, "selectedSeries", predicate);
    useValidCheck(allDirectors, selectedDirector, "selectedDirector", predicate);
    useValidCheck(allStars, selectedStar, "selectedStar", predicate);
    const onChange = useMemoizedFn((key, val) => {
      {
        const prevVideoCount = videosAfterFilterByScope.length;
        const prevCondition = lodash.pick(store, stateKeys);
        const nextConditions = { ...prevCondition, [key]: val };
        const nextVideoCount = filterByScope({
          videos: videosAfterFilterByCollection,
          ...nextConditions
        }).length;
        if (prevVideoCount > 0 && nextVideoCount === 0) {
          antd.message.warning("条件组合结果为空, 已自动清空其它条件!", 1);
          stateKeys.forEach((k2) => {
            if (k2 === key) return;
            store[k2] = void 0;
          });
        }
      }
      store[key] = val;
    });
    const searchRef = React__default.useRef(null);
    const [optionSortBy, setOptionSortBy] = React__default.useState("count");
    function useSortedVersion(optionList) {
      return React__default.useMemo(
        () => optionSortBy === "count" ? optionList : optionList.orderBy([(item2) => mapZhString(item2.name)], [zhStringComparer]),
        [optionSortBy, optionList]
      );
    }
    const _allStudios = useSortedVersion(allStudios);
    const _allLabels = useSortedVersion(allLabels);
    const _allDirectors = useSortedVersion(allDirectors);
    const _allSeries = useSortedVersion(allSeries);
    const _allStars = useSortedVersion(allStars);
    const _allPrefixs2 = useSortedVersion(allPrefixs);
    return jsx(
      "div",
      {
        css: css$1`
        margin: 15px 0 10px;
        padding: 10px;
        border: 1px solid var(--javbus-guide-color-primary);
        border-radius: 6px;
      `,
        children: jsxs(antd.Space, { direction: "vertical", children: [
          jsxs(antd.Space, { size: ["large", 10], wrap: true, children: [
            jsxs("div", { css: styles.wrapper, children: [
              jsx("span", { css: styles.label, children: "操作" }),
              jsx("div", { css: styles.input, children: jsx(
                antd.Button,
                {
                  onClick: () => {
                    var _a, _b;
                    stateKeys.forEach((k2) => store[k2] = void 0);
                    store.searchText = void 0;
                    store.enableFilterByStarCount = false;
                    const searchWrapper = searchRef.current;
                    (_a = searchWrapper == null ? void 0 : searchWrapper.querySelector(".ant-input-clear-icon")) == null ? void 0 : _a.click();
                    (_b = searchWrapper == null ? void 0 : searchWrapper.querySelector("input")) == null ? void 0 : _b.blur();
                  },
                  children: "清除全部"
                }
              ) })
            ] }),
            jsxs("div", { css: styles.wrapper, children: [
              jsx("span", { css: styles.label, children: "排序" }),
              jsx("div", { css: styles.input, children: jsxs(antd.Radio.Group, { buttonStyle: "solid", value: optionSortBy, onChange: (e2) => setOptionSortBy(e2.target.value), children: [
                jsx(antd.Radio.Button, { value: "count", children: "数量" }),
                jsx(antd.Radio.Button, { value: "name", children: "名称" })
              ] }) })
            ] })
          ] }),
          jsxs(antd.Space, { size: ["large", 10], wrap: true, children: [
            jsxs("div", { css: styles.wrapper, children: [
              jsx("span", { css: styles.label, children: "制作商" }),
              jsx(
                antd.Select,
                {
                  css: styles.input,
                  allowClear: true,
                  placeholder: "制作商",
                  value: selectedStudio,
                  onChange: (val) => onChange("selectedStudio", val),
                  options: _allStudios.map(({ name, value, count }) => {
                    return {
                      label: `${name}(${count})`,
                      value
                    };
                  })
                }
              )
            ] }),
            jsxs("div", { css: styles.wrapper, children: [
              jsx("span", { css: styles.label, children: "发行商" }),
              jsx(
                antd.Select,
                {
                  css: styles.input,
                  allowClear: true,
                  placeholder: "发行商",
                  value: selectedLabel,
                  onChange: (val) => onChange("selectedLabel", val),
                  options: _allLabels.map(({ name, value, count }) => {
                    return {
                      label: `${name}(${count})`,
                      value
                    };
                  })
                }
              )
            ] }),
            jsxs("div", { css: styles.wrapper, children: [
              jsx("span", { css: styles.label, children: "系列" }),
              jsx(
                antd.Select,
                {
                  css: styles.input,
                  allowClear: true,
                  placeholder: "系列",
                  value: selectedSeries,
                  onChange: (val) => onChange("selectedSeries", val),
                  options: _allSeries.map(({ name, value, count }) => {
                    return {
                      label: `${name}(${count})`,
                      value
                    };
                  })
                }
              )
            ] }),
            jsxs("div", { css: styles.wrapper, children: [
              jsx("span", { css: styles.label, children: "导演" }),
              jsx(
                antd.Select,
                {
                  css: styles.input,
                  allowClear: true,
                  placeholder: "导演",
                  value: selectedDirector,
                  onChange: (val) => onChange("selectedDirector", val),
                  options: _allDirectors.map(({ name, value, count }) => {
                    return {
                      label: `${name}(${count})`,
                      value
                    };
                  })
                }
              )
            ] }),
            jsxs("div", { css: styles.wrapper, children: [
              jsx("span", { css: styles.label, children: "演员" }),
              jsx(
                antd.Select,
                {
                  css: styles.input,
                  allowClear: true,
                  placeholder: "演员",
                  value: selectedStar,
                  onChange: (val) => onChange("selectedStar", val),
                  options: _allStars.map(({ name, value, count }) => {
                    return {
                      label: `${name}(${count})`,
                      value
                    };
                  })
                }
              )
            ] }),
            jsxs("div", { css: styles.wrapper, children: [
              jsx("span", { css: styles.label, children: "番号前缀" }),
              jsx(
                antd.Select,
                {
                  css: styles.input,
                  showSearch: true,
                  allowClear: true,
                  placeholder: "番号前缀",
                  value: selectedPrefix,
                  onChange: (val) => onChange("selectedPrefix", val),
                  options: _allPrefixs2.map((p2) => {
                    const { name, value, count } = p2;
                    return { label: `${name}(${count})`, value };
                  }),
                  filterOption: (input, option) => ((option == null ? void 0 : option.value) ?? "").toLowerCase().includes(input.toLowerCase())
                }
              )
            ] }),
            jsxs("div", { css: styles.wrapper, ref: searchRef, children: [
              jsx("span", { css: styles.label, children: "标题搜索" }),
              jsx(
                antd.Input.Search,
                {
                  css: styles.input,
                  placeholder: "标题搜索",
                  allowClear: true,
                  onSearch: (value) => {
                    store.searchText = value;
                  }
                }
              )
            ] })
          ] }),
          jsx(FilterStarCount, {})
        ] })
      }
    );
  }
  function FilterStarCount() {
    const { videosAfterFilterByCollection, selecedStarCount, enableFilterByStarCount } = useSnapshot(store);
    const starCounts = React__default.useMemo(() => {
      return videosAfterFilterByCollection.map((v2) => {
        var _a;
        return ((_a = v2.detailInfo) == null ? void 0 : _a.stars.length) || 0;
      }).uniq().toSorted((a2, b2) => a2 - b2);
    }, [videosAfterFilterByCollection]);
    const min2 = starCounts[0];
    const max2 = Math.min(starCounts.at(-1) || STAR_COUNT_NO_LIMIT_NUM, STAR_COUNT_NO_LIMIT_NUM);
    const marks = React__default.useMemo(() => {
      const ret = {};
      for (let i2 = min2; i2 <= max2; i2++) {
        if (i2 === STAR_COUNT_NO_LIMIT_NUM) {
          ret[i2] = "不限";
        } else {
          ret[i2] = i2;
        }
      }
      return ret;
    }, [min2, max2]);
    const tooltipFormatter = useMemoizedFn((i2) => marks[i2]);
    return jsx(Fragment, { children: jsxs("div", { css: styles.wrapper, children: [
      jsx("span", { css: styles.label, children: "演员数量" }),
      jsxs(
        "div",
        {
          css: [
            styles.input,
            css$1`
              display: flex;
              align-items: center;
              width: unset;
            `
          ],
          children: [
            jsx(
              antd.Checkbox,
              {
                checked: enableFilterByStarCount,
                onChange: (e2) => store.enableFilterByStarCount = e2.target.checked,
                children: "启用筛选"
              }
            ),
            jsx(
              antd.Slider,
              {
                disabled: !enableFilterByStarCount,
                min: min2,
                max: max2,
                css: css$1`
              margin-left: 20px;
              width: 500px;
            `,
                dots: true,
                range: { draggableTrack: true },
                marks,
                tooltip: { formatter: tooltipFormatter },
                value: selecedStarCount,
                onChange: (val) => {
                  store.selecedStarCount = val;
                }
              }
            )
          ]
        }
      )
    ] }) });
  }
  function useValidCheck(collection, value, key, predicate) {
    useUpdateEffect(() => {
      if (!value) return;
      if (!collection.find((item2) => predicate(item2, value))) {
        store[key] = void 0;
      }
    }, [collection, value]);
  }
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;
  var ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
    );
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match2 = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match2) {
      return;
    }
    var n2 = parseFloat(match2[1]);
    var type = (match2[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n2 * y;
      case "weeks":
      case "week":
      case "w":
        return n2 * w;
      case "days":
      case "day":
      case "d":
        return n2 * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n2 * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n2 * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n2 * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n2;
      default:
        return void 0;
    }
  }
  function fmtShort(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return Math.round(ms2 / d) + "d";
    }
    if (msAbs >= h) {
      return Math.round(ms2 / h) + "h";
    }
    if (msAbs >= m) {
      return Math.round(ms2 / m) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms2 / s) + "s";
    }
    return ms2 + "ms";
  }
  function fmtLong(ms2) {
    var msAbs = Math.abs(ms2);
    if (msAbs >= d) {
      return plural(ms2, msAbs, d, "day");
    }
    if (msAbs >= h) {
      return plural(ms2, msAbs, h, "hour");
    }
    if (msAbs >= m) {
      return plural(ms2, msAbs, m, "minute");
    }
    if (msAbs >= s) {
      return plural(ms2, msAbs, s, "second");
    }
    return ms2 + " ms";
  }
  function plural(ms2, msAbs, n2, name) {
    var isPlural = msAbs >= n2 * 1.5;
    return Math.round(ms2 / n2) + " " + name + (isPlural ? "s" : "");
  }
  const ms$1 = /* @__PURE__ */ getDefaultExportFromCjs(ms);
  async function getStarInfo(url) {
    {
      const path = getTrimedPath(new URL(url).pathname);
      if (!path.startsWith("/star")) return void 0;
    }
    const cacheKey = trimPagenumFromUrl(url);
    {
      const data = await starInfoDB.getItem(cacheKey);
      if (data && data.cacheTs && Date.now() < data.cacheTs + ms$1("1M")) {
        return data;
      }
    }
    const html = await readHtml(cacheKey);
    const $ = load(html || "");
    const $box = $.find(".avatar-box");
    const avatarUrl = $box.find(".photo-frame img").attr("src") || "";
    const name = $box.find(".photo-info > span").eq(0).text().trim();
    const desc = $box.find(".photo-info > p").map(function() {
      return jq(this).text().trim();
    }).toArray();
    const info = { name, avatarUrl, desc };
    await starInfoDB.setItem(cacheKey, { ...info, cacheTs: Date.now() });
    return info;
  }
  function StarInfoView() {
    const { data: starInfo } = useRequest(async () => getStarInfo(location.href));
    if (!starInfo || !starInfo.avatarUrl && !starInfo.name) {
      return null;
    }
    return jsxs(
      antd.Flex,
      {
        align: "center",
        justify: "flex-start",
        gap: 20,
        css: css$1`
        margin-bottom: 10px;
      `,
        children: [
          jsx(antd.Avatar, { src: starInfo.avatarUrl, size: 120, shape: "circle" }),
          jsxs("div", { children: [
            jsx("div", { children: starInfo.name }),
            jsx(
              "div",
              {
                css: css$1`
            margin-top: 5px;
            display: flex;
            flex-wrap: wrap;
            gap: 2px 40px;
          `,
                children: starInfo.desc.map((descItem) => jsx("span", { children: descItem }, descItem))
              }
            )
          ] })
        ]
      }
    );
  }
  const LockPopover = {
    wrapper: styled.generateClassName`
    .ant-popover-conetnt {
    }
    .ant-popover-inner {
      padding: 4px;
    }
    .ant-popover-title {
      padding: 0;
      margin: 0;
      min-width: unset;
      width: max-content;
    }
  `
  };
  const TagDisplay = React__default.memo(function({
    tag: tag$1,
    tagSorter,
    tagWidth,
    disableTagTextSelect,
    isForceOrder,
    cliped,
    faded,
    checked,
    onCheckedChange,
    locked,
    onLockedChange
  }) {
    const { name, url, id: id2, count, pinyinFirstLetter } = tag$1;
    const text = `${tagSorter === TagSorter.Pinyin && pinyinFirstLetter ? `[${pinyinFirstLetter.toUpperCase()}] ` : ""}${name}(${count})`;
    const innerSpanRef = React__default.useRef(null);
    const inner = jsx("span", { ref: innerSpanRef, "data-mark": "inner-span", children: text });
    const innerWithTooltip = jsx(CustomTooltip, { title: text, children: inner });
    const lockIcon = jsx(
      "span",
      {
        css: css$1`
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);

        z-index: 2;
        background-color: var(--javbus-guide-color-primary);
        /* background-color: red; */
        color: #fff;

        aspect-ratio: 1;
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;

        cursor: pointer;
        border-radius: 4px;
      `,
        children: jsx(IconPark, { name: "Lock", size: 14 })
      }
    );
    const checkboxId = React__default.useId();
    const checkbox = jsx(
      antd.Checkbox,
      {
        id: checkboxId,
        checked,
        onChange: (e2) => {
          const newValue = e2.target.checked;
          onCheckedChange == null ? void 0 : onCheckedChange(id2, newValue);
        }
      }
    );
    const withLockPopover = (children) => jsx(
      antd.Popover,
      {
        trigger: "hover",
        arrow: false,
        overlayClassName: LockPopover.wrapper,
        title: jsx(
          antd.Switch,
          {
            css: css$1`
            .ant-switch-inner {
              .ant-switch-inner-checked,
              .ant-switch-inner-unchecked {
                display: flex;
                align-items: center;
                height: 100%;
              }
            }
          `,
            checked: locked,
            onChange: (e2) => onLockedChange == null ? void 0 : onLockedChange(id2, e2),
            checkedChildren: jsx(
              IconPark,
              {
                name: "Lock",
                size: 14,
                css: css$1`
                margin-right: 10px;
              `
              }
            ),
            unCheckedChildren: jsx(
              IconPark,
              {
                name: "Unlock",
                size: 14,
                css: css$1`
                margin-left: 10px;
              `
              }
            )
          }
        ),
        children
      }
    );
    return jsxs(
      "span",
      {
        "data-tag-id": id2,
        "data-tag-name": name,
        "data-tag-url": url,
        "data-cliped": cliped,
        className: tag,
        css: [
          css$1`
          position: relative;
          display: inline-flex;
          flex-wrap: nowrap;
          align-items: center;
          transition: all 0.2s ease-out;
        `,
          tagWidth && css$1`
            width: ${tagWidth}px;
            text-overflow: clip;
            overflow: hidden;
          `,
          isForceOrder && css$1`
            color: #ef2729;
          `,
          disableTagTextSelect && css$1`
            user-select: none;
          `,
          faded && css$1`
            opacity: 0.5;
          `
        ],
        children: [
          locked && withLockPopover(lockIcon),
          withLockPopover(checkbox),
          jsx(
            "label",
            {
              htmlFor: checkboxId,
              css: css$1`
          display: unset;
          max-width: unset;
          margin-bottom: unset;
          font-weight: unset;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          margin-left: 6px;
          font-size: 16px;
        `,
              children: cliped ? innerWithTooltip : inner
            }
          )
        ]
      },
      id2
    );
  });
  function minmax(val, min2, max2) {
    if (val < min2) {
      return min2;
    } else if (val > max2) {
      return max2;
    } else {
      return val;
    }
  }
  var assert$1 = { exports: {} };
  var errors = {};
  var util = {};
  var types = {};
  var shams$1 = function hasSymbols() {
    if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
      return false;
    }
    if (typeof Symbol.iterator === "symbol") {
      return true;
    }
    var obj = {};
    var sym = Symbol("test");
    var symObj = Object(sym);
    if (typeof sym === "string") {
      return false;
    }
    if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
      return false;
    }
    if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
      return false;
    }
    var symVal = 42;
    obj[sym] = symVal;
    for (sym in obj) {
      return false;
    }
    if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
      return false;
    }
    if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
      return false;
    }
    var syms = Object.getOwnPropertySymbols(obj);
    if (syms.length !== 1 || syms[0] !== sym) {
      return false;
    }
    if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
      return false;
    }
    if (typeof Object.getOwnPropertyDescriptor === "function") {
      var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
      if (descriptor.value !== symVal || descriptor.enumerable !== true) {
        return false;
      }
    }
    return true;
  };
  var hasSymbols$1 = shams$1;
  var shams = function hasToStringTagShams() {
    return hasSymbols$1() && !!Symbol.toStringTag;
  };
  var hasSymbols2;
  var hasRequiredHasSymbols;
  function requireHasSymbols() {
    if (hasRequiredHasSymbols) return hasSymbols2;
    hasRequiredHasSymbols = 1;
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = shams$1;
    hasSymbols2 = function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    };
    return hasSymbols2;
  }
  var hasProto;
  var hasRequiredHasProto;
  function requireHasProto() {
    if (hasRequiredHasProto) return hasProto;
    hasRequiredHasProto = 1;
    var test = {
      foo: {}
    };
    var $Object = Object;
    hasProto = function hasProto2() {
      return { __proto__: test }.foo === test.foo && !({ __proto__: null } instanceof $Object);
    };
    return hasProto;
  }
  var implementation$3;
  var hasRequiredImplementation$3;
  function requireImplementation$3() {
    if (hasRequiredImplementation$3) return implementation$3;
    hasRequiredImplementation$3 = 1;
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var slice2 = Array.prototype.slice;
    var toStr2 = Object.prototype.toString;
    var funcType = "[object Function]";
    implementation$3 = function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr2.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slice2.call(arguments, 1);
      var bound;
      var binder = function() {
        if (this instanceof bound) {
          var result = target.apply(
            this,
            args.concat(slice2.call(arguments))
          );
          if (Object(result) === result) {
            return result;
          }
          return this;
        } else {
          return target.apply(
            that,
            args.concat(slice2.call(arguments))
          );
        }
      };
      var boundLength = Math.max(0, target.length - args.length);
      var boundArgs = [];
      for (var i2 = 0; i2 < boundLength; i2++) {
        boundArgs.push("$" + i2);
      }
      bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty2 = function Empty3() {
        };
        Empty2.prototype = target.prototype;
        bound.prototype = new Empty2();
        Empty2.prototype = null;
      }
      return bound;
    };
    return implementation$3;
  }
  var functionBind;
  var hasRequiredFunctionBind;
  function requireFunctionBind() {
    if (hasRequiredFunctionBind) return functionBind;
    hasRequiredFunctionBind = 1;
    var implementation2 = requireImplementation$3();
    functionBind = Function.prototype.bind || implementation2;
    return functionBind;
  }
  var src;
  var hasRequiredSrc;
  function requireSrc() {
    if (hasRequiredSrc) return src;
    hasRequiredSrc = 1;
    var bind = requireFunctionBind();
    src = bind.call(Function.call, Object.prototype.hasOwnProperty);
    return src;
  }
  var getIntrinsic;
  var hasRequiredGetIntrinsic;
  function requireGetIntrinsic() {
    if (hasRequiredGetIntrinsic) return getIntrinsic;
    hasRequiredGetIntrinsic = 1;
    var undefined$1;
    var $SyntaxError = SyntaxError;
    var $Function = Function;
    var $TypeError = TypeError;
    var getEvalledConstructor = function(expressionSyntax) {
      try {
        return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e2) {
      }
    };
    var $gOPD = Object.getOwnPropertyDescriptor;
    if ($gOPD) {
      try {
        $gOPD({}, "");
      } catch (e2) {
        $gOPD = null;
      }
    }
    var throwTypeError = function() {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD ? function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    }() : throwTypeError;
    var hasSymbols3 = requireHasSymbols()();
    var hasProto2 = requireHasProto()();
    var getProto2 = Object.getPrototypeOf || (hasProto2 ? function(x2) {
      return x2.__proto__;
    } : null);
    var needsEval = {};
    var TypedArray = typeof Uint8Array === "undefined" || !getProto2 ? undefined$1 : getProto2(Uint8Array);
    var INTRINSICS = {
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols3 && getProto2 ? getProto2([][Symbol.iterator]()) : undefined$1,
      "%AsyncFromSyncIteratorPrototype%": undefined$1,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
      "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined$1 : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined$1 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": Error,
      "%eval%": eval,
      // eslint-disable-line no-eval
      "%EvalError%": EvalError,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols3 && getProto2 ? getProto2(getProto2([][Symbol.iterator]())) : undefined$1,
      "%JSON%": typeof JSON === "object" ? JSON : undefined$1,
      "%Map%": typeof Map === "undefined" ? undefined$1 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols3 || !getProto2 ? undefined$1 : getProto2((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": Object,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
      "%RangeError%": RangeError,
      "%ReferenceError%": ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined$1 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols3 || !getProto2 ? undefined$1 : getProto2((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols3 && getProto2 ? getProto2(""[Symbol.iterator]()) : undefined$1,
      "%Symbol%": hasSymbols3 ? Symbol : undefined$1,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
      "%URIError%": URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet
    };
    if (getProto2) {
      try {
        null.error;
      } catch (e2) {
        var errorProto = getProto2(getProto2(e2));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
    }
    var doEval = function doEval2(name) {
      var value;
      if (name === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name === "%AsyncGenerator%") {
        var fn = doEval2("%AsyncGeneratorFunction%");
        if (fn) {
          value = fn.prototype;
        }
      } else if (name === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen && getProto2) {
          value = getProto2(gen.prototype);
        }
      }
      INTRINSICS[name] = value;
      return value;
    };
    var LEGACY_ALIASES = {
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind = requireFunctionBind();
    var hasOwn2 = requireSrc();
    var $concat = bind.call(Function.call, Array.prototype.concat);
    var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
    var $replace = bind.call(Function.call, String.prototype.replace);
    var $strSlice = bind.call(Function.call, String.prototype.slice);
    var $exec = bind.call(Function.call, RegExp.prototype.exec);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match2, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match2;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn2(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn2(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name + " does not exist!");
    };
    getIntrinsic = function GetIntrinsic2(name, allowMissing) {
      if (typeof name !== "string" || name.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i2 = 1, isOwn = true; i2 < parts.length; i2 += 1) {
        var part = parts[i2];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn2(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
            }
            return void 0;
          }
          if ($gOPD && i2 + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn2(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    };
    return getIntrinsic;
  }
  var callBind$2 = { exports: {} };
  var hasRequiredCallBind;
  function requireCallBind() {
    if (hasRequiredCallBind) return callBind$2.exports;
    hasRequiredCallBind = 1;
    (function(module) {
      var bind = requireFunctionBind();
      var GetIntrinsic2 = requireGetIntrinsic();
      var $apply = GetIntrinsic2("%Function.prototype.apply%");
      var $call = GetIntrinsic2("%Function.prototype.call%");
      var $reflectApply = GetIntrinsic2("%Reflect.apply%", true) || bind.call($call, $apply);
      var $gOPD = GetIntrinsic2("%Object.getOwnPropertyDescriptor%", true);
      var $defineProperty = GetIntrinsic2("%Object.defineProperty%", true);
      var $max = GetIntrinsic2("%Math.max%");
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e2) {
          $defineProperty = null;
        }
      }
      module.exports = function callBind2(originalFunction) {
        var func = $reflectApply(bind, $call, arguments);
        if ($gOPD && $defineProperty) {
          var desc = $gOPD(func, "length");
          if (desc.configurable) {
            $defineProperty(
              func,
              "length",
              { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
            );
          }
        }
        return func;
      };
      var applyBind = function applyBind2() {
        return $reflectApply(bind, $apply, arguments);
      };
      if ($defineProperty) {
        $defineProperty(module.exports, "apply", { value: applyBind });
      } else {
        module.exports.apply = applyBind;
      }
    })(callBind$2);
    return callBind$2.exports;
  }
  var GetIntrinsic = requireGetIntrinsic();
  var callBind$1 = requireCallBind();
  var $indexOf$1 = callBind$1(GetIntrinsic("String.prototype.indexOf"));
  var callBound$2 = function callBoundIntrinsic(name, allowMissing) {
    var intrinsic = GetIntrinsic(name, !!allowMissing);
    if (typeof intrinsic === "function" && $indexOf$1(name, ".prototype.") > -1) {
      return callBind$1(intrinsic);
    }
    return intrinsic;
  };
  var hasToStringTag$3 = shams();
  var callBound$1 = callBound$2;
  var $toString$1 = callBound$1("Object.prototype.toString");
  var isStandardArguments = function isArguments(value) {
    if (hasToStringTag$3 && value && typeof value === "object" && Symbol.toStringTag in value) {
      return false;
    }
    return $toString$1(value) === "[object Arguments]";
  };
  var isLegacyArguments = function isArguments2(value) {
    if (isStandardArguments(value)) {
      return true;
    }
    return value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && $toString$1(value) !== "[object Array]" && $toString$1(value.callee) === "[object Function]";
  };
  var supportsStandardArguments = function() {
    return isStandardArguments(arguments);
  }();
  isStandardArguments.isLegacyArguments = isLegacyArguments;
  var isArguments$1 = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
  var toStr$2 = Object.prototype.toString;
  var fnToStr$1 = Function.prototype.toString;
  var isFnRegex = /^\s*(?:function)?\*/;
  var hasToStringTag$2 = shams();
  var getProto = Object.getPrototypeOf;
  var getGeneratorFunc = function() {
    if (!hasToStringTag$2) {
      return false;
    }
    try {
      return Function("return function*() {}")();
    } catch (e2) {
    }
  };
  var GeneratorFunction;
  var isGeneratorFunction = function isGeneratorFunction2(fn) {
    if (typeof fn !== "function") {
      return false;
    }
    if (isFnRegex.test(fnToStr$1.call(fn))) {
      return true;
    }
    if (!hasToStringTag$2) {
      var str = toStr$2.call(fn);
      return str === "[object GeneratorFunction]";
    }
    if (!getProto) {
      return false;
    }
    if (typeof GeneratorFunction === "undefined") {
      var generatorFunc = getGeneratorFunc();
      GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
    }
    return getProto(fn) === GeneratorFunction;
  };
  var fnToStr = Function.prototype.toString;
  var reflectApply = typeof Reflect === "object" && Reflect !== null && Reflect.apply;
  var badArrayLike;
  var isCallableMarker;
  if (typeof reflectApply === "function" && typeof Object.defineProperty === "function") {
    try {
      badArrayLike = Object.defineProperty({}, "length", {
        get: function() {
          throw isCallableMarker;
        }
      });
      isCallableMarker = {};
      reflectApply(function() {
        throw 42;
      }, null, badArrayLike);
    } catch (_) {
      if (_ !== isCallableMarker) {
        reflectApply = null;
      }
    }
  } else {
    reflectApply = null;
  }
  var constructorRegex = /^\s*class\b/;
  var isES6ClassFn = function isES6ClassFunction(value) {
    try {
      var fnStr = fnToStr.call(value);
      return constructorRegex.test(fnStr);
    } catch (e2) {
      return false;
    }
  };
  var tryFunctionObject = function tryFunctionToStr(value) {
    try {
      if (isES6ClassFn(value)) {
        return false;
      }
      fnToStr.call(value);
      return true;
    } catch (e2) {
      return false;
    }
  };
  var toStr$1 = Object.prototype.toString;
  var objectClass = "[object Object]";
  var fnClass = "[object Function]";
  var genClass = "[object GeneratorFunction]";
  var ddaClass = "[object HTMLAllCollection]";
  var ddaClass2 = "[object HTML document.all class]";
  var ddaClass3 = "[object HTMLCollection]";
  var hasToStringTag$1 = typeof Symbol === "function" && !!Symbol.toStringTag;
  var isIE68 = !(0 in [,]);
  var isDDA = function isDocumentDotAll() {
    return false;
  };
  if (typeof document === "object") {
    var all = document.all;
    if (toStr$1.call(all) === toStr$1.call(document.all)) {
      isDDA = function isDocumentDotAll2(value) {
        if ((isIE68 || !value) && (typeof value === "undefined" || typeof value === "object")) {
          try {
            var str = toStr$1.call(value);
            return (str === ddaClass || str === ddaClass2 || str === ddaClass3 || str === objectClass) && value("") == null;
          } catch (e2) {
          }
        }
        return false;
      };
    }
  }
  var isCallable$1 = reflectApply ? function isCallable(value) {
    if (isDDA(value)) {
      return true;
    }
    if (!value) {
      return false;
    }
    if (typeof value !== "function" && typeof value !== "object") {
      return false;
    }
    try {
      reflectApply(value, null, badArrayLike);
    } catch (e2) {
      if (e2 !== isCallableMarker) {
        return false;
      }
    }
    return !isES6ClassFn(value) && tryFunctionObject(value);
  } : function isCallable2(value) {
    if (isDDA(value)) {
      return true;
    }
    if (!value) {
      return false;
    }
    if (typeof value !== "function" && typeof value !== "object") {
      return false;
    }
    if (hasToStringTag$1) {
      return tryFunctionObject(value);
    }
    if (isES6ClassFn(value)) {
      return false;
    }
    var strClass = toStr$1.call(value);
    if (strClass !== fnClass && strClass !== genClass && !/^\[object HTML/.test(strClass)) {
      return false;
    }
    return tryFunctionObject(value);
  };
  var isCallable3 = isCallable$1;
  var toStr = Object.prototype.toString;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var forEachArray = function forEachArray2(array, iterator, receiver) {
    for (var i2 = 0, len = array.length; i2 < len; i2++) {
      if (hasOwnProperty.call(array, i2)) {
        if (receiver == null) {
          iterator(array[i2], i2, array);
        } else {
          iterator.call(receiver, array[i2], i2, array);
        }
      }
    }
  };
  var forEachString = function forEachString2(string, iterator, receiver) {
    for (var i2 = 0, len = string.length; i2 < len; i2++) {
      if (receiver == null) {
        iterator(string.charAt(i2), i2, string);
      } else {
        iterator.call(receiver, string.charAt(i2), i2, string);
      }
    }
  };
  var forEachObject = function forEachObject2(object, iterator, receiver) {
    for (var k2 in object) {
      if (hasOwnProperty.call(object, k2)) {
        if (receiver == null) {
          iterator(object[k2], k2, object);
        } else {
          iterator.call(receiver, object[k2], k2, object);
        }
      }
    }
  };
  var forEach$1 = function forEach(list, iterator, thisArg) {
    if (!isCallable3(iterator)) {
      throw new TypeError("iterator must be a function");
    }
    var receiver;
    if (arguments.length >= 3) {
      receiver = thisArg;
    }
    if (toStr.call(list) === "[object Array]") {
      forEachArray(list, iterator, receiver);
    } else if (typeof list === "string") {
      forEachString(list, iterator, receiver);
    } else {
      forEachObject(list, iterator, receiver);
    }
  };
  var forEach_1 = forEach$1;
  var possibleNames = [
    "BigInt64Array",
    "BigUint64Array",
    "Float32Array",
    "Float64Array",
    "Int16Array",
    "Int32Array",
    "Int8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8Array",
    "Uint8ClampedArray"
  ];
  var g$1 = typeof globalThis === "undefined" ? commonjsGlobal : globalThis;
  var availableTypedArrays$1 = function availableTypedArrays() {
    var out = [];
    for (var i2 = 0; i2 < possibleNames.length; i2++) {
      if (typeof g$1[possibleNames[i2]] === "function") {
        out[out.length] = possibleNames[i2];
      }
    }
    return out;
  };
  var gopd;
  var hasRequiredGopd;
  function requireGopd() {
    if (hasRequiredGopd) return gopd;
    hasRequiredGopd = 1;
    var GetIntrinsic2 = requireGetIntrinsic();
    var $gOPD = GetIntrinsic2("%Object.getOwnPropertyDescriptor%", true);
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e2) {
        $gOPD = null;
      }
    }
    gopd = $gOPD;
    return gopd;
  }
  var forEach2 = forEach_1;
  var availableTypedArrays2 = availableTypedArrays$1;
  var callBind = requireCallBind();
  var callBound = callBound$2;
  var gOPD = requireGopd();
  var $toString = callBound("Object.prototype.toString");
  var hasToStringTag = shams();
  var g = typeof globalThis === "undefined" ? commonjsGlobal : globalThis;
  var typedArrays = availableTypedArrays2();
  var $slice = callBound("String.prototype.slice");
  var getPrototypeOf = Object.getPrototypeOf;
  var $indexOf = callBound("Array.prototype.indexOf", true) || function indexOf(array, value) {
    for (var i2 = 0; i2 < array.length; i2 += 1) {
      if (array[i2] === value) {
        return i2;
      }
    }
    return -1;
  };
  var cache = { __proto__: null };
  if (hasToStringTag && gOPD && getPrototypeOf) {
    forEach2(typedArrays, function(typedArray) {
      var arr = new g[typedArray]();
      if (Symbol.toStringTag in arr) {
        var proto = getPrototypeOf(arr);
        var descriptor = gOPD(proto, Symbol.toStringTag);
        if (!descriptor) {
          var superProto = getPrototypeOf(proto);
          descriptor = gOPD(superProto, Symbol.toStringTag);
        }
        cache["$" + typedArray] = callBind(descriptor.get);
      }
    });
  } else {
    forEach2(typedArrays, function(typedArray) {
      var arr = new g[typedArray]();
      cache["$" + typedArray] = callBind(arr.slice);
    });
  }
  var tryTypedArrays = function tryAllTypedArrays(value) {
    var found = false;
    forEach2(cache, function(getter, typedArray) {
      if (!found) {
        try {
          if ("$" + getter(value) === typedArray) {
            found = $slice(typedArray, 1);
          }
        } catch (e2) {
        }
      }
    });
    return found;
  };
  var trySlices = function tryAllSlices(value) {
    var found = false;
    forEach2(cache, function(getter, name) {
      if (!found) {
        try {
          getter(value);
          found = $slice(name, 1);
        } catch (e2) {
        }
      }
    });
    return found;
  };
  var whichTypedArray$1 = function whichTypedArray(value) {
    if (!value || typeof value !== "object") {
      return false;
    }
    if (!hasToStringTag) {
      var tag2 = $slice($toString(value), 8, -1);
      if ($indexOf(typedArrays, tag2) > -1) {
        return tag2;
      }
      if (tag2 !== "Object") {
        return false;
      }
      return trySlices(value);
    }
    if (!gOPD) {
      return null;
    }
    return tryTypedArrays(value);
  };
  var whichTypedArray2 = whichTypedArray$1;
  var isTypedArray = function isTypedArray2(value) {
    return !!whichTypedArray2(value);
  };
  (function(exports) {
    var isArgumentsObject = isArguments$1;
    var isGeneratorFunction$1 = isGeneratorFunction;
    var whichTypedArray3 = whichTypedArray$1;
    var isTypedArray$1 = isTypedArray;
    function uncurryThis(f2) {
      return f2.call.bind(f2);
    }
    var BigIntSupported = typeof BigInt !== "undefined";
    var SymbolSupported = typeof Symbol !== "undefined";
    var ObjectToString = uncurryThis(Object.prototype.toString);
    var numberValue = uncurryThis(Number.prototype.valueOf);
    var stringValue = uncurryThis(String.prototype.valueOf);
    var booleanValue = uncurryThis(Boolean.prototype.valueOf);
    if (BigIntSupported) {
      var bigIntValue = uncurryThis(BigInt.prototype.valueOf);
    }
    if (SymbolSupported) {
      var symbolValue = uncurryThis(Symbol.prototype.valueOf);
    }
    function checkBoxedPrimitive(value, prototypeValueOf) {
      if (typeof value !== "object") {
        return false;
      }
      try {
        prototypeValueOf(value);
        return true;
      } catch (e2) {
        return false;
      }
    }
    exports.isArgumentsObject = isArgumentsObject;
    exports.isGeneratorFunction = isGeneratorFunction$1;
    exports.isTypedArray = isTypedArray$1;
    function isPromise(input) {
      return typeof Promise !== "undefined" && input instanceof Promise || input !== null && typeof input === "object" && typeof input.then === "function" && typeof input.catch === "function";
    }
    exports.isPromise = isPromise;
    function isArrayBufferView(value) {
      if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        return ArrayBuffer.isView(value);
      }
      return isTypedArray$1(value) || isDataView(value);
    }
    exports.isArrayBufferView = isArrayBufferView;
    function isUint8Array(value) {
      return whichTypedArray3(value) === "Uint8Array";
    }
    exports.isUint8Array = isUint8Array;
    function isUint8ClampedArray(value) {
      return whichTypedArray3(value) === "Uint8ClampedArray";
    }
    exports.isUint8ClampedArray = isUint8ClampedArray;
    function isUint16Array(value) {
      return whichTypedArray3(value) === "Uint16Array";
    }
    exports.isUint16Array = isUint16Array;
    function isUint32Array(value) {
      return whichTypedArray3(value) === "Uint32Array";
    }
    exports.isUint32Array = isUint32Array;
    function isInt8Array(value) {
      return whichTypedArray3(value) === "Int8Array";
    }
    exports.isInt8Array = isInt8Array;
    function isInt16Array(value) {
      return whichTypedArray3(value) === "Int16Array";
    }
    exports.isInt16Array = isInt16Array;
    function isInt32Array(value) {
      return whichTypedArray3(value) === "Int32Array";
    }
    exports.isInt32Array = isInt32Array;
    function isFloat32Array(value) {
      return whichTypedArray3(value) === "Float32Array";
    }
    exports.isFloat32Array = isFloat32Array;
    function isFloat64Array(value) {
      return whichTypedArray3(value) === "Float64Array";
    }
    exports.isFloat64Array = isFloat64Array;
    function isBigInt64Array(value) {
      return whichTypedArray3(value) === "BigInt64Array";
    }
    exports.isBigInt64Array = isBigInt64Array;
    function isBigUint64Array(value) {
      return whichTypedArray3(value) === "BigUint64Array";
    }
    exports.isBigUint64Array = isBigUint64Array;
    function isMapToString(value) {
      return ObjectToString(value) === "[object Map]";
    }
    isMapToString.working = typeof Map !== "undefined" && isMapToString(/* @__PURE__ */ new Map());
    function isMap(value) {
      if (typeof Map === "undefined") {
        return false;
      }
      return isMapToString.working ? isMapToString(value) : value instanceof Map;
    }
    exports.isMap = isMap;
    function isSetToString(value) {
      return ObjectToString(value) === "[object Set]";
    }
    isSetToString.working = typeof Set !== "undefined" && isSetToString(/* @__PURE__ */ new Set());
    function isSet(value) {
      if (typeof Set === "undefined") {
        return false;
      }
      return isSetToString.working ? isSetToString(value) : value instanceof Set;
    }
    exports.isSet = isSet;
    function isWeakMapToString(value) {
      return ObjectToString(value) === "[object WeakMap]";
    }
    isWeakMapToString.working = typeof WeakMap !== "undefined" && isWeakMapToString(/* @__PURE__ */ new WeakMap());
    function isWeakMap(value) {
      if (typeof WeakMap === "undefined") {
        return false;
      }
      return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
    }
    exports.isWeakMap = isWeakMap;
    function isWeakSetToString(value) {
      return ObjectToString(value) === "[object WeakSet]";
    }
    isWeakSetToString.working = typeof WeakSet !== "undefined" && isWeakSetToString(/* @__PURE__ */ new WeakSet());
    function isWeakSet(value) {
      return isWeakSetToString(value);
    }
    exports.isWeakSet = isWeakSet;
    function isArrayBufferToString(value) {
      return ObjectToString(value) === "[object ArrayBuffer]";
    }
    isArrayBufferToString.working = typeof ArrayBuffer !== "undefined" && isArrayBufferToString(new ArrayBuffer());
    function isArrayBuffer(value) {
      if (typeof ArrayBuffer === "undefined") {
        return false;
      }
      return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
    }
    exports.isArrayBuffer = isArrayBuffer;
    function isDataViewToString(value) {
      return ObjectToString(value) === "[object DataView]";
    }
    isDataViewToString.working = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
    function isDataView(value) {
      if (typeof DataView === "undefined") {
        return false;
      }
      return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
    }
    exports.isDataView = isDataView;
    var SharedArrayBufferCopy = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : void 0;
    function isSharedArrayBufferToString(value) {
      return ObjectToString(value) === "[object SharedArrayBuffer]";
    }
    function isSharedArrayBuffer(value) {
      if (typeof SharedArrayBufferCopy === "undefined") {
        return false;
      }
      if (typeof isSharedArrayBufferToString.working === "undefined") {
        isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
      }
      return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
    }
    exports.isSharedArrayBuffer = isSharedArrayBuffer;
    function isAsyncFunction(value) {
      return ObjectToString(value) === "[object AsyncFunction]";
    }
    exports.isAsyncFunction = isAsyncFunction;
    function isMapIterator(value) {
      return ObjectToString(value) === "[object Map Iterator]";
    }
    exports.isMapIterator = isMapIterator;
    function isSetIterator(value) {
      return ObjectToString(value) === "[object Set Iterator]";
    }
    exports.isSetIterator = isSetIterator;
    function isGeneratorObject(value) {
      return ObjectToString(value) === "[object Generator]";
    }
    exports.isGeneratorObject = isGeneratorObject;
    function isWebAssemblyCompiledModule(value) {
      return ObjectToString(value) === "[object WebAssembly.Module]";
    }
    exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
    function isNumberObject(value) {
      return checkBoxedPrimitive(value, numberValue);
    }
    exports.isNumberObject = isNumberObject;
    function isStringObject(value) {
      return checkBoxedPrimitive(value, stringValue);
    }
    exports.isStringObject = isStringObject;
    function isBooleanObject(value) {
      return checkBoxedPrimitive(value, booleanValue);
    }
    exports.isBooleanObject = isBooleanObject;
    function isBigIntObject(value) {
      return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
    }
    exports.isBigIntObject = isBigIntObject;
    function isSymbolObject(value) {
      return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
    }
    exports.isSymbolObject = isSymbolObject;
    function isBoxedPrimitive(value) {
      return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
    }
    exports.isBoxedPrimitive = isBoxedPrimitive;
    function isAnyArrayBuffer(value) {
      return typeof Uint8Array !== "undefined" && (isArrayBuffer(value) || isSharedArrayBuffer(value));
    }
    exports.isAnyArrayBuffer = isAnyArrayBuffer;
    ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(method) {
      Object.defineProperty(exports, method, {
        enumerable: false,
        value: function() {
          throw new Error(method + " is not supported in userland");
        }
      });
    });
  })(types);
  var isBufferBrowser = function isBuffer(arg) {
    return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
  };
  var inherits_browser = { exports: {} };
  if (typeof Object.create === "function") {
    inherits_browser.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    inherits_browser.exports = function inherits(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }
  var inherits_browserExports = inherits_browser.exports;
  (function(exports) {
    var define_process_env_default = {};
    var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors2(obj) {
      var keys = Object.keys(obj);
      var descriptors = {};
      for (var i2 = 0; i2 < keys.length; i2++) {
        descriptors[keys[i2]] = Object.getOwnPropertyDescriptor(obj, keys[i2]);
      }
      return descriptors;
    };
    var formatRegExp = /%[sdj%]/g;
    exports.format = function(f2) {
      if (!isString(f2)) {
        var objects = [];
        for (var i2 = 0; i2 < arguments.length; i2++) {
          objects.push(inspect(arguments[i2]));
        }
        return objects.join(" ");
      }
      var i2 = 1;
      var args = arguments;
      var len = args.length;
      var str = String(f2).replace(formatRegExp, function(x22) {
        if (x22 === "%%") return "%";
        if (i2 >= len) return x22;
        switch (x22) {
          case "%s":
            return String(args[i2++]);
          case "%d":
            return Number(args[i2++]);
          case "%j":
            try {
              return JSON.stringify(args[i2++]);
            } catch (_) {
              return "[Circular]";
            }
          default:
            return x22;
        }
      });
      for (var x2 = args[i2]; i2 < len; x2 = args[++i2]) {
        if (isNull3(x2) || !isObject3(x2)) {
          str += " " + x2;
        } else {
          str += " " + inspect(x2);
        }
      }
      return str;
    };
    exports.deprecate = function(fn, msg) {
      if (typeof process !== "undefined" && process.noDeprecation === true) {
        return fn;
      }
      if (typeof process === "undefined") {
        return function() {
          return exports.deprecate(fn, msg).apply(this, arguments);
        };
      }
      var warned = false;
      function deprecated() {
        if (!warned) {
          if (process.throwDeprecation) {
            throw new Error(msg);
          } else if (process.traceDeprecation) {
            console.trace(msg);
          } else {
            console.error(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }
      return deprecated;
    };
    var debugs = {};
    var debugEnvRegex = /^$/;
    if (define_process_env_default.NODE_DEBUG) {
      var debugEnv = define_process_env_default.NODE_DEBUG;
      debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase();
      debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
    }
    exports.debuglog = function(set) {
      set = set.toUpperCase();
      if (!debugs[set]) {
        if (debugEnvRegex.test(set)) {
          var pid = process.pid;
          debugs[set] = function() {
            var msg = exports.format.apply(exports, arguments);
            console.error("%s %d: %s", set, pid, msg);
          };
        } else {
          debugs[set] = function() {
          };
        }
      }
      return debugs[set];
    };
    function inspect(obj, opts) {
      var ctx = {
        seen: [],
        stylize: stylizeNoColor
      };
      if (arguments.length >= 3) ctx.depth = arguments[2];
      if (arguments.length >= 4) ctx.colors = arguments[3];
      if (isBoolean(opts)) {
        ctx.showHidden = opts;
      } else if (opts) {
        exports._extend(ctx, opts);
      }
      if (isUndefined3(ctx.showHidden)) ctx.showHidden = false;
      if (isUndefined3(ctx.depth)) ctx.depth = 2;
      if (isUndefined3(ctx.colors)) ctx.colors = false;
      if (isUndefined3(ctx.customInspect)) ctx.customInspect = true;
      if (ctx.colors) ctx.stylize = stylizeWithColor;
      return formatValue(ctx, obj, ctx.depth);
    }
    exports.inspect = inspect;
    inspect.colors = {
      "bold": [1, 22],
      "italic": [3, 23],
      "underline": [4, 24],
      "inverse": [7, 27],
      "white": [37, 39],
      "grey": [90, 39],
      "black": [30, 39],
      "blue": [34, 39],
      "cyan": [36, 39],
      "green": [32, 39],
      "magenta": [35, 39],
      "red": [31, 39],
      "yellow": [33, 39]
    };
    inspect.styles = {
      "special": "cyan",
      "number": "yellow",
      "boolean": "yellow",
      "undefined": "grey",
      "null": "bold",
      "string": "green",
      "date": "magenta",
      // "name": intentionally not styling
      "regexp": "red"
    };
    function stylizeWithColor(str, styleType) {
      var style = inspect.styles[styleType];
      if (style) {
        return "\x1B[" + inspect.colors[style][0] + "m" + str + "\x1B[" + inspect.colors[style][1] + "m";
      } else {
        return str;
      }
    }
    function stylizeNoColor(str, styleType) {
      return str;
    }
    function arrayToHash(array) {
      var hash2 = {};
      array.forEach(function(val, idx) {
        hash2[val] = true;
      });
      return hash2;
    }
    function formatValue(ctx, value, recurseTimes) {
      if (ctx.customInspect && value && isFunction3(value.inspect) && // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }
      var keys = Object.keys(value);
      var visibleKeys = arrayToHash(keys);
      if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
      }
      if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
        return formatError(value);
      }
      if (keys.length === 0) {
        if (isFunction3(value)) {
          var name = value.name ? ": " + value.name : "";
          return ctx.stylize("[Function" + name + "]", "special");
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toString.call(value), "date");
        }
        if (isError(value)) {
          return formatError(value);
        }
      }
      var base = "", array = false, braces = ["{", "}"];
      if (isArray(value)) {
        array = true;
        braces = ["[", "]"];
      }
      if (isFunction3(value)) {
        var n2 = value.name ? ": " + value.name : "";
        base = " [Function" + n2 + "]";
      }
      if (isRegExp(value)) {
        base = " " + RegExp.prototype.toString.call(value);
      }
      if (isDate(value)) {
        base = " " + Date.prototype.toUTCString.call(value);
      }
      if (isError(value)) {
        base = " " + formatError(value);
      }
      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }
      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
        } else {
          return ctx.stylize("[Object]", "special");
        }
      }
      ctx.seen.push(value);
      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else {
        output = keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
      }
      ctx.seen.pop();
      return reduceToSingleString(output, base, braces);
    }
    function formatPrimitive(ctx, value) {
      if (isUndefined3(value))
        return ctx.stylize("undefined", "undefined");
      if (isString(value)) {
        var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return ctx.stylize(simple, "string");
      }
      if (isNumber(value))
        return ctx.stylize("" + value, "number");
      if (isBoolean(value))
        return ctx.stylize("" + value, "boolean");
      if (isNull3(value))
        return ctx.stylize("null", "null");
    }
    function formatError(value) {
      return "[" + Error.prototype.toString.call(value) + "]";
    }
    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i2 = 0, l2 = value.length; i2 < l2; ++i2) {
        if (hasOwnProperty2(value, String(i2))) {
          output.push(formatProperty(
            ctx,
            value,
            recurseTimes,
            visibleKeys,
            String(i2),
            true
          ));
        } else {
          output.push("");
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(
            ctx,
            value,
            recurseTimes,
            visibleKeys,
            key,
            true
          ));
        }
      });
      return output;
    }
    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name, str, desc;
      desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
      if (desc.get) {
        if (desc.set) {
          str = ctx.stylize("[Getter/Setter]", "special");
        } else {
          str = ctx.stylize("[Getter]", "special");
        }
      } else {
        if (desc.set) {
          str = ctx.stylize("[Setter]", "special");
        }
      }
      if (!hasOwnProperty2(visibleKeys, key)) {
        name = "[" + key + "]";
      }
      if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
          if (isNull3(recurseTimes)) {
            str = formatValue(ctx, desc.value, null);
          } else {
            str = formatValue(ctx, desc.value, recurseTimes - 1);
          }
          if (str.indexOf("\n") > -1) {
            if (array) {
              str = str.split("\n").map(function(line2) {
                return "  " + line2;
              }).join("\n").slice(2);
            } else {
              str = "\n" + str.split("\n").map(function(line2) {
                return "   " + line2;
              }).join("\n");
            }
          }
        } else {
          str = ctx.stylize("[Circular]", "special");
        }
      }
      if (isUndefined3(name)) {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify("" + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.slice(1, -1);
          name = ctx.stylize(name, "name");
        } else {
          name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, "string");
        }
      }
      return name + ": " + str;
    }
    function reduceToSingleString(output, base, braces) {
      var length2 = output.reduce(function(prev2, cur) {
        if (cur.indexOf("\n") >= 0) ;
        return prev2 + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      if (length2 > 60) {
        return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
      }
      return braces[0] + base + " " + output.join(", ") + " " + braces[1];
    }
    exports.types = types;
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;
    function isBoolean(arg) {
      return typeof arg === "boolean";
    }
    exports.isBoolean = isBoolean;
    function isNull3(arg) {
      return arg === null;
    }
    exports.isNull = isNull3;
    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    function isNumber(arg) {
      return typeof arg === "number";
    }
    exports.isNumber = isNumber;
    function isString(arg) {
      return typeof arg === "string";
    }
    exports.isString = isString;
    function isSymbol3(arg) {
      return typeof arg === "symbol";
    }
    exports.isSymbol = isSymbol3;
    function isUndefined3(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined3;
    function isRegExp(re) {
      return isObject3(re) && objectToString2(re) === "[object RegExp]";
    }
    exports.isRegExp = isRegExp;
    exports.types.isRegExp = isRegExp;
    function isObject3(arg) {
      return typeof arg === "object" && arg !== null;
    }
    exports.isObject = isObject3;
    function isDate(d2) {
      return isObject3(d2) && objectToString2(d2) === "[object Date]";
    }
    exports.isDate = isDate;
    exports.types.isDate = isDate;
    function isError(e2) {
      return isObject3(e2) && (objectToString2(e2) === "[object Error]" || e2 instanceof Error);
    }
    exports.isError = isError;
    exports.types.isNativeError = isError;
    function isFunction3(arg) {
      return typeof arg === "function";
    }
    exports.isFunction = isFunction3;
    function isPrimitive(arg) {
      return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || // ES6 symbol
      typeof arg === "undefined";
    }
    exports.isPrimitive = isPrimitive;
    exports.isBuffer = isBufferBrowser;
    function objectToString2(o2) {
      return Object.prototype.toString.call(o2);
    }
    function pad(n2) {
      return n2 < 10 ? "0" + n2.toString(10) : n2.toString(10);
    }
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    function timestamp() {
      var d2 = /* @__PURE__ */ new Date();
      var time = [
        pad(d2.getHours()),
        pad(d2.getMinutes()),
        pad(d2.getSeconds())
      ].join(":");
      return [d2.getDate(), months[d2.getMonth()], time].join(" ");
    }
    exports.log = function() {
      console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
    };
    exports.inherits = inherits_browserExports;
    exports._extend = function(origin, add2) {
      if (!add2 || !isObject3(add2)) return origin;
      var keys = Object.keys(add2);
      var i2 = keys.length;
      while (i2--) {
        origin[keys[i2]] = add2[keys[i2]];
      }
      return origin;
    };
    function hasOwnProperty2(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    var kCustomPromisifiedSymbol = typeof Symbol !== "undefined" ? Symbol("util.promisify.custom") : void 0;
    exports.promisify = function promisify(original) {
      if (typeof original !== "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
        var fn = original[kCustomPromisifiedSymbol];
        if (typeof fn !== "function") {
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        }
        Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn,
          enumerable: false,
          writable: false,
          configurable: true
        });
        return fn;
      }
      function fn() {
        var promiseResolve, promiseReject;
        var promise = new Promise(function(resolve, reject) {
          promiseResolve = resolve;
          promiseReject = reject;
        });
        var args = [];
        for (var i2 = 0; i2 < arguments.length; i2++) {
          args.push(arguments[i2]);
        }
        args.push(function(err, value) {
          if (err) {
            promiseReject(err);
          } else {
            promiseResolve(value);
          }
        });
        try {
          original.apply(this, args);
        } catch (err) {
          promiseReject(err);
        }
        return promise;
      }
      Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
      if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
        value: fn,
        enumerable: false,
        writable: false,
        configurable: true
      });
      return Object.defineProperties(
        fn,
        getOwnPropertyDescriptors(original)
      );
    };
    exports.promisify.custom = kCustomPromisifiedSymbol;
    function callbackifyOnRejected(reason, cb) {
      if (!reason) {
        var newReason = new Error("Promise was rejected with a falsy value");
        newReason.reason = reason;
        reason = newReason;
      }
      return cb(reason);
    }
    function callbackify(original) {
      if (typeof original !== "function") {
        throw new TypeError('The "original" argument must be of type Function');
      }
      function callbackified() {
        var args = [];
        for (var i2 = 0; i2 < arguments.length; i2++) {
          args.push(arguments[i2]);
        }
        var maybeCb = args.pop();
        if (typeof maybeCb !== "function") {
          throw new TypeError("The last argument must be of type Function");
        }
        var self2 = this;
        var cb = function() {
          return maybeCb.apply(self2, arguments);
        };
        original.apply(this, args).then(
          function(ret) {
            process.nextTick(cb.bind(null, null, ret));
          },
          function(rej) {
            process.nextTick(callbackifyOnRejected.bind(null, rej, cb));
          }
        );
      }
      Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
      Object.defineProperties(
        callbackified,
        getOwnPropertyDescriptors(original)
      );
      return callbackified;
    }
    exports.callbackify = callbackify;
  })(util);
  var hasRequiredErrors;
  function requireErrors() {
    if (hasRequiredErrors) return errors;
    hasRequiredErrors = 1;
    function _typeof2(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof2 = function _typeof3(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof2 = function _typeof3(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof2(obj);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _possibleConstructorReturn(self2, call2) {
      if (call2 && (_typeof2(call2) === "object" || typeof call2 === "function")) {
        return call2;
      }
      return _assertThisInitialized(self2);
    }
    function _assertThisInitialized(self2) {
      if (self2 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self2;
    }
    function _getPrototypeOf(o2) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o3) {
        return o3.__proto__ || Object.getPrototypeOf(o3);
      };
      return _getPrototypeOf(o2);
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _setPrototypeOf(o2, p2) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o3, p3) {
        o3.__proto__ = p3;
        return o3;
      };
      return _setPrototypeOf(o2, p2);
    }
    var codes = {};
    var assert2;
    var util$1;
    function createErrorType(code, message2, Base) {
      if (!Base) {
        Base = Error;
      }
      function getMessage(arg1, arg2, arg3) {
        if (typeof message2 === "string") {
          return message2;
        } else {
          return message2(arg1, arg2, arg3);
        }
      }
      var NodeError = /* @__PURE__ */ function(_Base) {
        _inherits(NodeError2, _Base);
        function NodeError2(arg1, arg2, arg3) {
          var _this;
          _classCallCheck(this, NodeError2);
          _this = _possibleConstructorReturn(this, _getPrototypeOf(NodeError2).call(this, getMessage(arg1, arg2, arg3)));
          _this.code = code;
          return _this;
        }
        return NodeError2;
      }(Base);
      codes[code] = NodeError;
    }
    function oneOf(expected, thing) {
      if (Array.isArray(expected)) {
        var len = expected.length;
        expected = expected.map(function(i2) {
          return String(i2);
        });
        if (len > 2) {
          return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(", "), ", or ") + expected[len - 1];
        } else if (len === 2) {
          return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
        } else {
          return "of ".concat(thing, " ").concat(expected[0]);
        }
      } else {
        return "of ".concat(thing, " ").concat(String(expected));
      }
    }
    function startsWith(str, search, pos) {
      return str.substr(0, search.length) === search;
    }
    function endsWith(str, search, this_len) {
      if (this_len === void 0 || this_len > str.length) {
        this_len = str.length;
      }
      return str.substring(this_len - search.length, this_len) === search;
    }
    function includes(str, search, start) {
      if (typeof start !== "number") {
        start = 0;
      }
      if (start + search.length > str.length) {
        return false;
      } else {
        return str.indexOf(search, start) !== -1;
      }
    }
    createErrorType("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError);
    createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
      if (assert2 === void 0) assert2 = requireAssert();
      assert2(typeof name === "string", "'name' must be a string");
      var determiner;
      if (typeof expected === "string" && startsWith(expected, "not ")) {
        determiner = "must not be";
        expected = expected.replace(/^not /, "");
      } else {
        determiner = "must be";
      }
      var msg;
      if (endsWith(name, " argument")) {
        msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
      } else {
        var type = includes(name, ".") ? "property" : "argument";
        msg = 'The "'.concat(name, '" ').concat(type, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
      }
      msg += ". Received type ".concat(_typeof2(actual));
      return msg;
    }, TypeError);
    createErrorType("ERR_INVALID_ARG_VALUE", function(name, value) {
      var reason = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "is invalid";
      if (util$1 === void 0) util$1 = util;
      var inspected = util$1.inspect(value);
      if (inspected.length > 128) {
        inspected = "".concat(inspected.slice(0, 128), "...");
      }
      return "The argument '".concat(name, "' ").concat(reason, ". Received ").concat(inspected);
    }, TypeError);
    createErrorType("ERR_INVALID_RETURN_VALUE", function(input, name, value) {
      var type;
      if (value && value.constructor && value.constructor.name) {
        type = "instance of ".concat(value.constructor.name);
      } else {
        type = "type ".concat(_typeof2(value));
      }
      return "Expected ".concat(input, ' to be returned from the "').concat(name, '"') + " function but got ".concat(type, ".");
    }, TypeError);
    createErrorType("ERR_MISSING_ARGS", function() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (assert2 === void 0) assert2 = requireAssert();
      assert2(args.length > 0, "At least one arg needs to be specified");
      var msg = "The ";
      var len = args.length;
      args = args.map(function(a2) {
        return '"'.concat(a2, '"');
      });
      switch (len) {
        case 1:
          msg += "".concat(args[0], " argument");
          break;
        case 2:
          msg += "".concat(args[0], " and ").concat(args[1], " arguments");
          break;
        default:
          msg += args.slice(0, len - 1).join(", ");
          msg += ", and ".concat(args[len - 1], " arguments");
          break;
      }
      return "".concat(msg, " must be specified");
    }, TypeError);
    errors.codes = codes;
    return errors;
  }
  var assertion_error;
  var hasRequiredAssertion_error;
  function requireAssertion_error() {
    if (hasRequiredAssertion_error) return assertion_error;
    hasRequiredAssertion_error = 1;
    function _objectSpread2(target) {
      for (var i2 = 1; i2 < arguments.length; i2++) {
        var source = arguments[i2] != null ? arguments[i2] : {};
        var ownKeys2 = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
          ownKeys2 = ownKeys2.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
          }));
        }
        ownKeys2.forEach(function(key) {
          _defineProperty2(target, key, source[key]);
        });
      }
      return target;
    }
    function _defineProperty2(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i2 = 0; i2 < props.length; i2++) {
        var descriptor = props[i2];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      return Constructor;
    }
    function _possibleConstructorReturn(self2, call2) {
      if (call2 && (_typeof2(call2) === "object" || typeof call2 === "function")) {
        return call2;
      }
      return _assertThisInitialized(self2);
    }
    function _assertThisInitialized(self2) {
      if (self2 === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self2;
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
      if (superClass) _setPrototypeOf(subClass, superClass);
    }
    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
      _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
        if (Class2 === null || !_isNativeFunction(Class2)) return Class2;
        if (typeof Class2 !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
          if (_cache.has(Class2)) return _cache.get(Class2);
          _cache.set(Class2, Wrapper);
        }
        function Wrapper() {
          return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
        return _setPrototypeOf(Wrapper, Class2);
      };
      return _wrapNativeSuper(Class);
    }
    function isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;
      try {
        Date.prototype.toString.call(Reflect.construct(Date, [], function() {
        }));
        return true;
      } catch (e2) {
        return false;
      }
    }
    function _construct(Parent, args, Class) {
      if (isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct2(Parent2, args2, Class2) {
          var a2 = [null];
          a2.push.apply(a2, args2);
          var Constructor = Function.bind.apply(Parent2, a2);
          var instance = new Constructor();
          if (Class2) _setPrototypeOf(instance, Class2.prototype);
          return instance;
        };
      }
      return _construct.apply(null, arguments);
    }
    function _isNativeFunction(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }
    function _setPrototypeOf(o2, p2) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o3, p3) {
        o3.__proto__ = p3;
        return o3;
      };
      return _setPrototypeOf(o2, p2);
    }
    function _getPrototypeOf(o2) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o3) {
        return o3.__proto__ || Object.getPrototypeOf(o3);
      };
      return _getPrototypeOf(o2);
    }
    function _typeof2(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof2 = function _typeof3(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof2 = function _typeof3(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof2(obj);
    }
    var _require = util, inspect = _require.inspect;
    var _require2 = requireErrors(), ERR_INVALID_ARG_TYPE = _require2.codes.ERR_INVALID_ARG_TYPE;
    function endsWith(str, search, this_len) {
      if (this_len === void 0 || this_len > str.length) {
        this_len = str.length;
      }
      return str.substring(this_len - search.length, this_len) === search;
    }
    function repeat(str, count) {
      count = Math.floor(count);
      if (str.length == 0 || count == 0) return "";
      var maxCount = str.length * count;
      count = Math.floor(Math.log(count) / Math.log(2));
      while (count) {
        str += str;
        count--;
      }
      str += str.substring(0, maxCount - str.length);
      return str;
    }
    var blue = "";
    var green = "";
    var red = "";
    var white = "";
    var kReadableOperator = {
      deepStrictEqual: "Expected values to be strictly deep-equal:",
      strictEqual: "Expected values to be strictly equal:",
      strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
      deepEqual: "Expected values to be loosely deep-equal:",
      equal: "Expected values to be loosely equal:",
      notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
      notStrictEqual: 'Expected "actual" to be strictly unequal to:',
      notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
      notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
      notEqual: 'Expected "actual" to be loosely unequal to:',
      notIdentical: "Values identical but not reference-equal:"
    };
    var kMaxShortLength = 10;
    function copyError(source) {
      var keys = Object.keys(source);
      var target = Object.create(Object.getPrototypeOf(source));
      keys.forEach(function(key) {
        target[key] = source[key];
      });
      Object.defineProperty(target, "message", {
        value: source.message
      });
      return target;
    }
    function inspectValue(val) {
      return inspect(val, {
        compact: false,
        customInspect: false,
        depth: 1e3,
        maxArrayLength: Infinity,
        // Assert compares only enumerable properties (with a few exceptions).
        showHidden: false,
        // Having a long line as error is better than wrapping the line for
        // comparison for now.
        // TODO(BridgeAR): `breakLength` should be limited as soon as soon as we
        // have meta information about the inspected properties (i.e., know where
        // in what line the property starts and ends).
        breakLength: Infinity,
        // Assert does not detect proxies currently.
        showProxy: false,
        sorted: true,
        // Inspect getters as we also check them when comparing entries.
        getters: true
      });
    }
    function createErrDiff(actual, expected, operator) {
      var other = "";
      var res = "";
      var lastPos = 0;
      var end = "";
      var skipped = false;
      var actualInspected = inspectValue(actual);
      var actualLines = actualInspected.split("\n");
      var expectedLines = inspectValue(expected).split("\n");
      var i2 = 0;
      var indicator = "";
      if (operator === "strictEqual" && _typeof2(actual) === "object" && _typeof2(expected) === "object" && actual !== null && expected !== null) {
        operator = "strictEqualObject";
      }
      if (actualLines.length === 1 && expectedLines.length === 1 && actualLines[0] !== expectedLines[0]) {
        var inputLength = actualLines[0].length + expectedLines[0].length;
        if (inputLength <= kMaxShortLength) {
          if ((_typeof2(actual) !== "object" || actual === null) && (_typeof2(expected) !== "object" || expected === null) && (actual !== 0 || expected !== 0)) {
            return "".concat(kReadableOperator[operator], "\n\n") + "".concat(actualLines[0], " !== ").concat(expectedLines[0], "\n");
          }
        } else if (operator !== "strictEqualObject") {
          var maxLength = process.stderr && process.stderr.isTTY ? process.stderr.columns : 80;
          if (inputLength < maxLength) {
            while (actualLines[0][i2] === expectedLines[0][i2]) {
              i2++;
            }
            if (i2 > 2) {
              indicator = "\n  ".concat(repeat(" ", i2), "^");
              i2 = 0;
            }
          }
        }
      }
      var a2 = actualLines[actualLines.length - 1];
      var b2 = expectedLines[expectedLines.length - 1];
      while (a2 === b2) {
        if (i2++ < 2) {
          end = "\n  ".concat(a2).concat(end);
        } else {
          other = a2;
        }
        actualLines.pop();
        expectedLines.pop();
        if (actualLines.length === 0 || expectedLines.length === 0) break;
        a2 = actualLines[actualLines.length - 1];
        b2 = expectedLines[expectedLines.length - 1];
      }
      var maxLines = Math.max(actualLines.length, expectedLines.length);
      if (maxLines === 0) {
        var _actualLines = actualInspected.split("\n");
        if (_actualLines.length > 30) {
          _actualLines[26] = "".concat(blue, "...").concat(white);
          while (_actualLines.length > 27) {
            _actualLines.pop();
          }
        }
        return "".concat(kReadableOperator.notIdentical, "\n\n").concat(_actualLines.join("\n"), "\n");
      }
      if (i2 > 3) {
        end = "\n".concat(blue, "...").concat(white).concat(end);
        skipped = true;
      }
      if (other !== "") {
        end = "\n  ".concat(other).concat(end);
        other = "";
      }
      var printedLines = 0;
      var msg = kReadableOperator[operator] + "\n".concat(green, "+ actual").concat(white, " ").concat(red, "- expected").concat(white);
      var skippedMsg = " ".concat(blue, "...").concat(white, " Lines skipped");
      for (i2 = 0; i2 < maxLines; i2++) {
        var cur = i2 - lastPos;
        if (actualLines.length < i2 + 1) {
          if (cur > 1 && i2 > 2) {
            if (cur > 4) {
              res += "\n".concat(blue, "...").concat(white);
              skipped = true;
            } else if (cur > 3) {
              res += "\n  ".concat(expectedLines[i2 - 2]);
              printedLines++;
            }
            res += "\n  ".concat(expectedLines[i2 - 1]);
            printedLines++;
          }
          lastPos = i2;
          other += "\n".concat(red, "-").concat(white, " ").concat(expectedLines[i2]);
          printedLines++;
        } else if (expectedLines.length < i2 + 1) {
          if (cur > 1 && i2 > 2) {
            if (cur > 4) {
              res += "\n".concat(blue, "...").concat(white);
              skipped = true;
            } else if (cur > 3) {
              res += "\n  ".concat(actualLines[i2 - 2]);
              printedLines++;
            }
            res += "\n  ".concat(actualLines[i2 - 1]);
            printedLines++;
          }
          lastPos = i2;
          res += "\n".concat(green, "+").concat(white, " ").concat(actualLines[i2]);
          printedLines++;
        } else {
          var expectedLine = expectedLines[i2];
          var actualLine = actualLines[i2];
          var divergingLines = actualLine !== expectedLine && (!endsWith(actualLine, ",") || actualLine.slice(0, -1) !== expectedLine);
          if (divergingLines && endsWith(expectedLine, ",") && expectedLine.slice(0, -1) === actualLine) {
            divergingLines = false;
            actualLine += ",";
          }
          if (divergingLines) {
            if (cur > 1 && i2 > 2) {
              if (cur > 4) {
                res += "\n".concat(blue, "...").concat(white);
                skipped = true;
              } else if (cur > 3) {
                res += "\n  ".concat(actualLines[i2 - 2]);
                printedLines++;
              }
              res += "\n  ".concat(actualLines[i2 - 1]);
              printedLines++;
            }
            lastPos = i2;
            res += "\n".concat(green, "+").concat(white, " ").concat(actualLine);
            other += "\n".concat(red, "-").concat(white, " ").concat(expectedLine);
            printedLines += 2;
          } else {
            res += other;
            other = "";
            if (cur === 1 || i2 === 0) {
              res += "\n  ".concat(actualLine);
              printedLines++;
            }
          }
        }
        if (printedLines > 20 && i2 < maxLines - 2) {
          return "".concat(msg).concat(skippedMsg, "\n").concat(res, "\n").concat(blue, "...").concat(white).concat(other, "\n") + "".concat(blue, "...").concat(white);
        }
      }
      return "".concat(msg).concat(skipped ? skippedMsg : "", "\n").concat(res).concat(other).concat(end).concat(indicator);
    }
    var AssertionError = /* @__PURE__ */ function(_Error) {
      _inherits(AssertionError2, _Error);
      function AssertionError2(options) {
        var _this;
        _classCallCheck(this, AssertionError2);
        if (_typeof2(options) !== "object" || options === null) {
          throw new ERR_INVALID_ARG_TYPE("options", "Object", options);
        }
        var message2 = options.message, operator = options.operator, stackStartFn = options.stackStartFn;
        var actual = options.actual, expected = options.expected;
        var limit2 = Error.stackTraceLimit;
        Error.stackTraceLimit = 0;
        if (message2 != null) {
          _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError2).call(this, String(message2)));
        } else {
          if (process.stderr && process.stderr.isTTY) {
            if (process.stderr && process.stderr.getColorDepth && process.stderr.getColorDepth() !== 1) {
              blue = "\x1B[34m";
              green = "\x1B[32m";
              white = "\x1B[39m";
              red = "\x1B[31m";
            } else {
              blue = "";
              green = "";
              white = "";
              red = "";
            }
          }
          if (_typeof2(actual) === "object" && actual !== null && _typeof2(expected) === "object" && expected !== null && "stack" in actual && actual instanceof Error && "stack" in expected && expected instanceof Error) {
            actual = copyError(actual);
            expected = copyError(expected);
          }
          if (operator === "deepStrictEqual" || operator === "strictEqual") {
            _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError2).call(this, createErrDiff(actual, expected, operator)));
          } else if (operator === "notDeepStrictEqual" || operator === "notStrictEqual") {
            var base = kReadableOperator[operator];
            var res = inspectValue(actual).split("\n");
            if (operator === "notStrictEqual" && _typeof2(actual) === "object" && actual !== null) {
              base = kReadableOperator.notStrictEqualObject;
            }
            if (res.length > 30) {
              res[26] = "".concat(blue, "...").concat(white);
              while (res.length > 27) {
                res.pop();
              }
            }
            if (res.length === 1) {
              _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError2).call(this, "".concat(base, " ").concat(res[0])));
            } else {
              _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError2).call(this, "".concat(base, "\n\n").concat(res.join("\n"), "\n")));
            }
          } else {
            var _res = inspectValue(actual);
            var other = "";
            var knownOperators = kReadableOperator[operator];
            if (operator === "notDeepEqual" || operator === "notEqual") {
              _res = "".concat(kReadableOperator[operator], "\n\n").concat(_res);
              if (_res.length > 1024) {
                _res = "".concat(_res.slice(0, 1021), "...");
              }
            } else {
              other = "".concat(inspectValue(expected));
              if (_res.length > 512) {
                _res = "".concat(_res.slice(0, 509), "...");
              }
              if (other.length > 512) {
                other = "".concat(other.slice(0, 509), "...");
              }
              if (operator === "deepEqual" || operator === "equal") {
                _res = "".concat(knownOperators, "\n\n").concat(_res, "\n\nshould equal\n\n");
              } else {
                other = " ".concat(operator, " ").concat(other);
              }
            }
            _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError2).call(this, "".concat(_res).concat(other)));
          }
        }
        Error.stackTraceLimit = limit2;
        _this.generatedMessage = !message2;
        Object.defineProperty(_assertThisInitialized(_this), "name", {
          value: "AssertionError [ERR_ASSERTION]",
          enumerable: false,
          writable: true,
          configurable: true
        });
        _this.code = "ERR_ASSERTION";
        _this.actual = actual;
        _this.expected = expected;
        _this.operator = operator;
        if (Error.captureStackTrace) {
          Error.captureStackTrace(_assertThisInitialized(_this), stackStartFn);
        }
        _this.stack;
        _this.name = "AssertionError";
        return _possibleConstructorReturn(_this);
      }
      _createClass(AssertionError2, [{
        key: "toString",
        value: function toString() {
          return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
        }
      }, {
        key: inspect.custom,
        value: function value(recurseTimes, ctx) {
          return inspect(this, _objectSpread2({}, ctx, {
            customInspect: false,
            depth: 0
          }));
        }
      }]);
      return AssertionError2;
    }(_wrapNativeSuper(Error));
    assertion_error = AssertionError;
    return assertion_error;
  }
  var es6ObjectAssign;
  var hasRequiredEs6ObjectAssign;
  function requireEs6ObjectAssign() {
    if (hasRequiredEs6ObjectAssign) return es6ObjectAssign;
    hasRequiredEs6ObjectAssign = 1;
    function assign2(target, firstSource) {
      if (target === void 0 || target === null) {
        throw new TypeError("Cannot convert first argument to object");
      }
      var to = Object(target);
      for (var i2 = 1; i2 < arguments.length; i2++) {
        var nextSource = arguments[i2];
        if (nextSource === void 0 || nextSource === null) {
          continue;
        }
        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== void 0 && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
    function polyfill2() {
      if (!Object.assign) {
        Object.defineProperty(Object, "assign", {
          enumerable: false,
          configurable: true,
          writable: true,
          value: assign2
        });
      }
    }
    es6ObjectAssign = {
      assign: assign2,
      polyfill: polyfill2
    };
    return es6ObjectAssign;
  }
  var isArguments3;
  var hasRequiredIsArguments;
  function requireIsArguments() {
    if (hasRequiredIsArguments) return isArguments3;
    hasRequiredIsArguments = 1;
    var toStr2 = Object.prototype.toString;
    isArguments3 = function isArguments4(value) {
      var str = toStr2.call(value);
      var isArgs = str === "[object Arguments]";
      if (!isArgs) {
        isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr2.call(value.callee) === "[object Function]";
      }
      return isArgs;
    };
    return isArguments3;
  }
  var implementation$2;
  var hasRequiredImplementation$2;
  function requireImplementation$2() {
    if (hasRequiredImplementation$2) return implementation$2;
    hasRequiredImplementation$2 = 1;
    var keysShim;
    if (!Object.keys) {
      var has = Object.prototype.hasOwnProperty;
      var toStr2 = Object.prototype.toString;
      var isArgs = requireIsArguments();
      var isEnumerable = Object.prototype.propertyIsEnumerable;
      var hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
      var hasProtoEnumBug = isEnumerable.call(function() {
      }, "prototype");
      var dontEnums = [
        "toString",
        "toLocaleString",
        "valueOf",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "constructor"
      ];
      var equalsConstructorPrototype = function(o2) {
        var ctor = o2.constructor;
        return ctor && ctor.prototype === o2;
      };
      var excludedKeys = {
        $applicationCache: true,
        $console: true,
        $external: true,
        $frame: true,
        $frameElement: true,
        $frames: true,
        $innerHeight: true,
        $innerWidth: true,
        $onmozfullscreenchange: true,
        $onmozfullscreenerror: true,
        $outerHeight: true,
        $outerWidth: true,
        $pageXOffset: true,
        $pageYOffset: true,
        $parent: true,
        $scrollLeft: true,
        $scrollTop: true,
        $scrollX: true,
        $scrollY: true,
        $self: true,
        $webkitIndexedDB: true,
        $webkitStorageInfo: true,
        $window: true
      };
      var hasAutomationEqualityBug = function() {
        if (typeof window === "undefined") {
          return false;
        }
        for (var k2 in window) {
          try {
            if (!excludedKeys["$" + k2] && has.call(window, k2) && window[k2] !== null && typeof window[k2] === "object") {
              try {
                equalsConstructorPrototype(window[k2]);
              } catch (e2) {
                return true;
              }
            }
          } catch (e2) {
            return true;
          }
        }
        return false;
      }();
      var equalsConstructorPrototypeIfNotBuggy = function(o2) {
        if (typeof window === "undefined" || !hasAutomationEqualityBug) {
          return equalsConstructorPrototype(o2);
        }
        try {
          return equalsConstructorPrototype(o2);
        } catch (e2) {
          return false;
        }
      };
      keysShim = function keys(object) {
        var isObject3 = object !== null && typeof object === "object";
        var isFunction3 = toStr2.call(object) === "[object Function]";
        var isArguments4 = isArgs(object);
        var isString = isObject3 && toStr2.call(object) === "[object String]";
        var theKeys = [];
        if (!isObject3 && !isFunction3 && !isArguments4) {
          throw new TypeError("Object.keys called on a non-object");
        }
        var skipProto = hasProtoEnumBug && isFunction3;
        if (isString && object.length > 0 && !has.call(object, 0)) {
          for (var i2 = 0; i2 < object.length; ++i2) {
            theKeys.push(String(i2));
          }
        }
        if (isArguments4 && object.length > 0) {
          for (var j = 0; j < object.length; ++j) {
            theKeys.push(String(j));
          }
        } else {
          for (var name in object) {
            if (!(skipProto && name === "prototype") && has.call(object, name)) {
              theKeys.push(String(name));
            }
          }
        }
        if (hasDontEnumBug) {
          var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
          for (var k2 = 0; k2 < dontEnums.length; ++k2) {
            if (!(skipConstructor && dontEnums[k2] === "constructor") && has.call(object, dontEnums[k2])) {
              theKeys.push(dontEnums[k2]);
            }
          }
        }
        return theKeys;
      };
    }
    implementation$2 = keysShim;
    return implementation$2;
  }
  var objectKeys;
  var hasRequiredObjectKeys;
  function requireObjectKeys() {
    if (hasRequiredObjectKeys) return objectKeys;
    hasRequiredObjectKeys = 1;
    var slice2 = Array.prototype.slice;
    var isArgs = requireIsArguments();
    var origKeys = Object.keys;
    var keysShim = origKeys ? function keys(o2) {
      return origKeys(o2);
    } : requireImplementation$2();
    var originalKeys = Object.keys;
    keysShim.shim = function shimObjectKeys() {
      if (Object.keys) {
        var keysWorksWithArguments = function() {
          var args = Object.keys(arguments);
          return args && args.length === arguments.length;
        }(1, 2);
        if (!keysWorksWithArguments) {
          Object.keys = function keys(object) {
            if (isArgs(object)) {
              return originalKeys(slice2.call(object));
            }
            return originalKeys(object);
          };
        }
      } else {
        Object.keys = keysShim;
      }
      return Object.keys || keysShim;
    };
    objectKeys = keysShim;
    return objectKeys;
  }
  var hasPropertyDescriptors_1;
  var hasRequiredHasPropertyDescriptors;
  function requireHasPropertyDescriptors() {
    if (hasRequiredHasPropertyDescriptors) return hasPropertyDescriptors_1;
    hasRequiredHasPropertyDescriptors = 1;
    var GetIntrinsic2 = requireGetIntrinsic();
    var $defineProperty = GetIntrinsic2("%Object.defineProperty%", true);
    var hasPropertyDescriptors = function hasPropertyDescriptors2() {
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
          return true;
        } catch (e2) {
          return false;
        }
      }
      return false;
    };
    hasPropertyDescriptors.hasArrayLengthDefineBug = function hasArrayLengthDefineBug() {
      if (!hasPropertyDescriptors()) {
        return null;
      }
      try {
        return $defineProperty([], "length", { value: 1 }).length !== 1;
      } catch (e2) {
        return true;
      }
    };
    hasPropertyDescriptors_1 = hasPropertyDescriptors;
    return hasPropertyDescriptors_1;
  }
  var defineDataProperty;
  var hasRequiredDefineDataProperty;
  function requireDefineDataProperty() {
    if (hasRequiredDefineDataProperty) return defineDataProperty;
    hasRequiredDefineDataProperty = 1;
    var hasPropertyDescriptors = requireHasPropertyDescriptors()();
    var GetIntrinsic2 = requireGetIntrinsic();
    var $defineProperty = hasPropertyDescriptors && GetIntrinsic2("%Object.defineProperty%", true);
    var $SyntaxError = GetIntrinsic2("%SyntaxError%");
    var $TypeError = GetIntrinsic2("%TypeError%");
    var gopd2 = requireGopd();
    defineDataProperty = function defineDataProperty2(obj, property, value) {
      if (!obj || typeof obj !== "object" && typeof obj !== "function") {
        throw new $TypeError("`obj` must be an object or a function`");
      }
      if (typeof property !== "string" && typeof property !== "symbol") {
        throw new $TypeError("`property` must be a string or a symbol`");
      }
      if (arguments.length > 3 && typeof arguments[3] !== "boolean" && arguments[3] !== null) {
        throw new $TypeError("`nonEnumerable`, if provided, must be a boolean or null");
      }
      if (arguments.length > 4 && typeof arguments[4] !== "boolean" && arguments[4] !== null) {
        throw new $TypeError("`nonWritable`, if provided, must be a boolean or null");
      }
      if (arguments.length > 5 && typeof arguments[5] !== "boolean" && arguments[5] !== null) {
        throw new $TypeError("`nonConfigurable`, if provided, must be a boolean or null");
      }
      if (arguments.length > 6 && typeof arguments[6] !== "boolean") {
        throw new $TypeError("`loose`, if provided, must be a boolean");
      }
      var nonEnumerable = arguments.length > 3 ? arguments[3] : null;
      var nonWritable = arguments.length > 4 ? arguments[4] : null;
      var nonConfigurable = arguments.length > 5 ? arguments[5] : null;
      var loose = arguments.length > 6 ? arguments[6] : false;
      var desc = !!gopd2 && gopd2(obj, property);
      if ($defineProperty) {
        $defineProperty(obj, property, {
          configurable: nonConfigurable === null && desc ? desc.configurable : !nonConfigurable,
          enumerable: nonEnumerable === null && desc ? desc.enumerable : !nonEnumerable,
          value,
          writable: nonWritable === null && desc ? desc.writable : !nonWritable
        });
      } else if (loose || !nonEnumerable && !nonWritable && !nonConfigurable) {
        obj[property] = value;
      } else {
        throw new $SyntaxError("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
      }
    };
    return defineDataProperty;
  }
  var defineProperties_1;
  var hasRequiredDefineProperties;
  function requireDefineProperties() {
    if (hasRequiredDefineProperties) return defineProperties_1;
    hasRequiredDefineProperties = 1;
    var keys = requireObjectKeys();
    var hasSymbols3 = typeof Symbol === "function" && typeof Symbol("foo") === "symbol";
    var toStr2 = Object.prototype.toString;
    var concat = Array.prototype.concat;
    var defineDataProperty2 = requireDefineDataProperty();
    var isFunction3 = function(fn) {
      return typeof fn === "function" && toStr2.call(fn) === "[object Function]";
    };
    var supportsDescriptors = requireHasPropertyDescriptors()();
    var defineProperty = function(object, name, value, predicate) {
      if (name in object) {
        if (predicate === true) {
          if (object[name] === value) {
            return;
          }
        } else if (!isFunction3(predicate) || !predicate()) {
          return;
        }
      }
      if (supportsDescriptors) {
        defineDataProperty2(object, name, value, true);
      } else {
        defineDataProperty2(object, name, value);
      }
    };
    var defineProperties = function(object, map2) {
      var predicates = arguments.length > 2 ? arguments[2] : {};
      var props = keys(map2);
      if (hasSymbols3) {
        props = concat.call(props, Object.getOwnPropertySymbols(map2));
      }
      for (var i2 = 0; i2 < props.length; i2 += 1) {
        defineProperty(object, props[i2], map2[props[i2]], predicates[props[i2]]);
      }
    };
    defineProperties.supportsDescriptors = !!supportsDescriptors;
    defineProperties_1 = defineProperties;
    return defineProperties_1;
  }
  var implementation$1;
  var hasRequiredImplementation$1;
  function requireImplementation$1() {
    if (hasRequiredImplementation$1) return implementation$1;
    hasRequiredImplementation$1 = 1;
    var numberIsNaN = function(value) {
      return value !== value;
    };
    implementation$1 = function is(a2, b2) {
      if (a2 === 0 && b2 === 0) {
        return 1 / a2 === 1 / b2;
      }
      if (a2 === b2) {
        return true;
      }
      if (numberIsNaN(a2) && numberIsNaN(b2)) {
        return true;
      }
      return false;
    };
    return implementation$1;
  }
  var polyfill$1;
  var hasRequiredPolyfill$1;
  function requirePolyfill$1() {
    if (hasRequiredPolyfill$1) return polyfill$1;
    hasRequiredPolyfill$1 = 1;
    var implementation2 = requireImplementation$1();
    polyfill$1 = function getPolyfill() {
      return typeof Object.is === "function" ? Object.is : implementation2;
    };
    return polyfill$1;
  }
  var shim$1;
  var hasRequiredShim$1;
  function requireShim$1() {
    if (hasRequiredShim$1) return shim$1;
    hasRequiredShim$1 = 1;
    var getPolyfill = requirePolyfill$1();
    var define = requireDefineProperties();
    shim$1 = function shimObjectIs() {
      var polyfill2 = getPolyfill();
      define(Object, { is: polyfill2 }, {
        is: function testObjectIs() {
          return Object.is !== polyfill2;
        }
      });
      return polyfill2;
    };
    return shim$1;
  }
  var objectIs;
  var hasRequiredObjectIs;
  function requireObjectIs() {
    if (hasRequiredObjectIs) return objectIs;
    hasRequiredObjectIs = 1;
    var define = requireDefineProperties();
    var callBind2 = requireCallBind();
    var implementation2 = requireImplementation$1();
    var getPolyfill = requirePolyfill$1();
    var shim2 = requireShim$1();
    var polyfill2 = callBind2(getPolyfill(), Object);
    define(polyfill2, {
      getPolyfill,
      implementation: implementation2,
      shim: shim2
    });
    objectIs = polyfill2;
    return objectIs;
  }
  var implementation;
  var hasRequiredImplementation;
  function requireImplementation() {
    if (hasRequiredImplementation) return implementation;
    hasRequiredImplementation = 1;
    implementation = function isNaN3(value) {
      return value !== value;
    };
    return implementation;
  }
  var polyfill;
  var hasRequiredPolyfill;
  function requirePolyfill() {
    if (hasRequiredPolyfill) return polyfill;
    hasRequiredPolyfill = 1;
    var implementation2 = requireImplementation();
    polyfill = function getPolyfill() {
      if (Number.isNaN && Number.isNaN(NaN) && !Number.isNaN("a")) {
        return Number.isNaN;
      }
      return implementation2;
    };
    return polyfill;
  }
  var shim;
  var hasRequiredShim;
  function requireShim() {
    if (hasRequiredShim) return shim;
    hasRequiredShim = 1;
    var define = requireDefineProperties();
    var getPolyfill = requirePolyfill();
    shim = function shimNumberIsNaN() {
      var polyfill2 = getPolyfill();
      define(Number, { isNaN: polyfill2 }, {
        isNaN: function testIsNaN() {
          return Number.isNaN !== polyfill2;
        }
      });
      return polyfill2;
    };
    return shim;
  }
  var isNan;
  var hasRequiredIsNan;
  function requireIsNan() {
    if (hasRequiredIsNan) return isNan;
    hasRequiredIsNan = 1;
    var callBind2 = requireCallBind();
    var define = requireDefineProperties();
    var implementation2 = requireImplementation();
    var getPolyfill = requirePolyfill();
    var shim2 = requireShim();
    var polyfill2 = callBind2(getPolyfill(), Number);
    define(polyfill2, {
      getPolyfill,
      implementation: implementation2,
      shim: shim2
    });
    isNan = polyfill2;
    return isNan;
  }
  var comparisons;
  var hasRequiredComparisons;
  function requireComparisons() {
    if (hasRequiredComparisons) return comparisons;
    hasRequiredComparisons = 1;
    function _slicedToArray(arr, i2) {
      return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i2) || _nonIterableRest();
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
    function _iterableToArrayLimit(arr, i2) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = void 0;
      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);
          if (i2 && _arr.length === i2) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"] != null) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
    function _arrayWithHoles(arr) {
      if (Array.isArray(arr)) return arr;
    }
    function _typeof2(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof2 = function _typeof3(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof2 = function _typeof3(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof2(obj);
    }
    var regexFlagsSupported = /a/g.flags !== void 0;
    var arrayFromSet = function arrayFromSet2(set) {
      var array = [];
      set.forEach(function(value) {
        return array.push(value);
      });
      return array;
    };
    var arrayFromMap = function arrayFromMap2(map2) {
      var array = [];
      map2.forEach(function(value, key) {
        return array.push([key, value]);
      });
      return array;
    };
    var objectIs2 = Object.is ? Object.is : requireObjectIs();
    var objectGetOwnPropertySymbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
      return [];
    };
    var numberIsNaN = Number.isNaN ? Number.isNaN : requireIsNan();
    function uncurryThis(f2) {
      return f2.call.bind(f2);
    }
    var hasOwnProperty2 = uncurryThis(Object.prototype.hasOwnProperty);
    var propertyIsEnumerable = uncurryThis(Object.prototype.propertyIsEnumerable);
    var objectToString2 = uncurryThis(Object.prototype.toString);
    var _require$types = util.types, isAnyArrayBuffer = _require$types.isAnyArrayBuffer, isArrayBufferView = _require$types.isArrayBufferView, isDate = _require$types.isDate, isMap = _require$types.isMap, isRegExp = _require$types.isRegExp, isSet = _require$types.isSet, isNativeError = _require$types.isNativeError, isBoxedPrimitive = _require$types.isBoxedPrimitive, isNumberObject = _require$types.isNumberObject, isStringObject = _require$types.isStringObject, isBooleanObject = _require$types.isBooleanObject, isBigIntObject = _require$types.isBigIntObject, isSymbolObject = _require$types.isSymbolObject, isFloat32Array = _require$types.isFloat32Array, isFloat64Array = _require$types.isFloat64Array;
    function isNonIndex(key) {
      if (key.length === 0 || key.length > 10) return true;
      for (var i2 = 0; i2 < key.length; i2++) {
        var code = key.charCodeAt(i2);
        if (code < 48 || code > 57) return true;
      }
      return key.length === 10 && key >= Math.pow(2, 32);
    }
    function getOwnNonIndexProperties(value) {
      return Object.keys(value).filter(isNonIndex).concat(objectGetOwnPropertySymbols(value).filter(Object.prototype.propertyIsEnumerable.bind(value)));
    }
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
     * @license  MIT
     */
    function compare(a2, b2) {
      if (a2 === b2) {
        return 0;
      }
      var x2 = a2.length;
      var y2 = b2.length;
      for (var i2 = 0, len = Math.min(x2, y2); i2 < len; ++i2) {
        if (a2[i2] !== b2[i2]) {
          x2 = a2[i2];
          y2 = b2[i2];
          break;
        }
      }
      if (x2 < y2) {
        return -1;
      }
      if (y2 < x2) {
        return 1;
      }
      return 0;
    }
    var kStrict = true;
    var kLoose = false;
    var kNoIterator = 0;
    var kIsArray = 1;
    var kIsSet = 2;
    var kIsMap = 3;
    function areSimilarRegExps(a2, b2) {
      return regexFlagsSupported ? a2.source === b2.source && a2.flags === b2.flags : RegExp.prototype.toString.call(a2) === RegExp.prototype.toString.call(b2);
    }
    function areSimilarFloatArrays(a2, b2) {
      if (a2.byteLength !== b2.byteLength) {
        return false;
      }
      for (var offset = 0; offset < a2.byteLength; offset++) {
        if (a2[offset] !== b2[offset]) {
          return false;
        }
      }
      return true;
    }
    function areSimilarTypedArrays(a2, b2) {
      if (a2.byteLength !== b2.byteLength) {
        return false;
      }
      return compare(new Uint8Array(a2.buffer, a2.byteOffset, a2.byteLength), new Uint8Array(b2.buffer, b2.byteOffset, b2.byteLength)) === 0;
    }
    function areEqualArrayBuffers(buf1, buf2) {
      return buf1.byteLength === buf2.byteLength && compare(new Uint8Array(buf1), new Uint8Array(buf2)) === 0;
    }
    function isEqualBoxedPrimitive(val1, val2) {
      if (isNumberObject(val1)) {
        return isNumberObject(val2) && objectIs2(Number.prototype.valueOf.call(val1), Number.prototype.valueOf.call(val2));
      }
      if (isStringObject(val1)) {
        return isStringObject(val2) && String.prototype.valueOf.call(val1) === String.prototype.valueOf.call(val2);
      }
      if (isBooleanObject(val1)) {
        return isBooleanObject(val2) && Boolean.prototype.valueOf.call(val1) === Boolean.prototype.valueOf.call(val2);
      }
      if (isBigIntObject(val1)) {
        return isBigIntObject(val2) && BigInt.prototype.valueOf.call(val1) === BigInt.prototype.valueOf.call(val2);
      }
      return isSymbolObject(val2) && Symbol.prototype.valueOf.call(val1) === Symbol.prototype.valueOf.call(val2);
    }
    function innerDeepEqual(val1, val2, strict, memos) {
      if (val1 === val2) {
        if (val1 !== 0) return true;
        return strict ? objectIs2(val1, val2) : true;
      }
      if (strict) {
        if (_typeof2(val1) !== "object") {
          return typeof val1 === "number" && numberIsNaN(val1) && numberIsNaN(val2);
        }
        if (_typeof2(val2) !== "object" || val1 === null || val2 === null) {
          return false;
        }
        if (Object.getPrototypeOf(val1) !== Object.getPrototypeOf(val2)) {
          return false;
        }
      } else {
        if (val1 === null || _typeof2(val1) !== "object") {
          if (val2 === null || _typeof2(val2) !== "object") {
            return val1 == val2;
          }
          return false;
        }
        if (val2 === null || _typeof2(val2) !== "object") {
          return false;
        }
      }
      var val1Tag = objectToString2(val1);
      var val2Tag = objectToString2(val2);
      if (val1Tag !== val2Tag) {
        return false;
      }
      if (Array.isArray(val1)) {
        if (val1.length !== val2.length) {
          return false;
        }
        var keys1 = getOwnNonIndexProperties(val1);
        var keys2 = getOwnNonIndexProperties(val2);
        if (keys1.length !== keys2.length) {
          return false;
        }
        return keyCheck(val1, val2, strict, memos, kIsArray, keys1);
      }
      if (val1Tag === "[object Object]") {
        if (!isMap(val1) && isMap(val2) || !isSet(val1) && isSet(val2)) {
          return false;
        }
      }
      if (isDate(val1)) {
        if (!isDate(val2) || Date.prototype.getTime.call(val1) !== Date.prototype.getTime.call(val2)) {
          return false;
        }
      } else if (isRegExp(val1)) {
        if (!isRegExp(val2) || !areSimilarRegExps(val1, val2)) {
          return false;
        }
      } else if (isNativeError(val1) || val1 instanceof Error) {
        if (val1.message !== val2.message || val1.name !== val2.name) {
          return false;
        }
      } else if (isArrayBufferView(val1)) {
        if (!strict && (isFloat32Array(val1) || isFloat64Array(val1))) {
          if (!areSimilarFloatArrays(val1, val2)) {
            return false;
          }
        } else if (!areSimilarTypedArrays(val1, val2)) {
          return false;
        }
        var _keys = getOwnNonIndexProperties(val1);
        var _keys2 = getOwnNonIndexProperties(val2);
        if (_keys.length !== _keys2.length) {
          return false;
        }
        return keyCheck(val1, val2, strict, memos, kNoIterator, _keys);
      } else if (isSet(val1)) {
        if (!isSet(val2) || val1.size !== val2.size) {
          return false;
        }
        return keyCheck(val1, val2, strict, memos, kIsSet);
      } else if (isMap(val1)) {
        if (!isMap(val2) || val1.size !== val2.size) {
          return false;
        }
        return keyCheck(val1, val2, strict, memos, kIsMap);
      } else if (isAnyArrayBuffer(val1)) {
        if (!areEqualArrayBuffers(val1, val2)) {
          return false;
        }
      } else if (isBoxedPrimitive(val1) && !isEqualBoxedPrimitive(val1, val2)) {
        return false;
      }
      return keyCheck(val1, val2, strict, memos, kNoIterator);
    }
    function getEnumerables(val, keys) {
      return keys.filter(function(k2) {
        return propertyIsEnumerable(val, k2);
      });
    }
    function keyCheck(val1, val2, strict, memos, iterationType, aKeys) {
      if (arguments.length === 5) {
        aKeys = Object.keys(val1);
        var bKeys = Object.keys(val2);
        if (aKeys.length !== bKeys.length) {
          return false;
        }
      }
      var i2 = 0;
      for (; i2 < aKeys.length; i2++) {
        if (!hasOwnProperty2(val2, aKeys[i2])) {
          return false;
        }
      }
      if (strict && arguments.length === 5) {
        var symbolKeysA = objectGetOwnPropertySymbols(val1);
        if (symbolKeysA.length !== 0) {
          var count = 0;
          for (i2 = 0; i2 < symbolKeysA.length; i2++) {
            var key = symbolKeysA[i2];
            if (propertyIsEnumerable(val1, key)) {
              if (!propertyIsEnumerable(val2, key)) {
                return false;
              }
              aKeys.push(key);
              count++;
            } else if (propertyIsEnumerable(val2, key)) {
              return false;
            }
          }
          var symbolKeysB = objectGetOwnPropertySymbols(val2);
          if (symbolKeysA.length !== symbolKeysB.length && getEnumerables(val2, symbolKeysB).length !== count) {
            return false;
          }
        } else {
          var _symbolKeysB = objectGetOwnPropertySymbols(val2);
          if (_symbolKeysB.length !== 0 && getEnumerables(val2, _symbolKeysB).length !== 0) {
            return false;
          }
        }
      }
      if (aKeys.length === 0 && (iterationType === kNoIterator || iterationType === kIsArray && val1.length === 0 || val1.size === 0)) {
        return true;
      }
      if (memos === void 0) {
        memos = {
          val1: /* @__PURE__ */ new Map(),
          val2: /* @__PURE__ */ new Map(),
          position: 0
        };
      } else {
        var val2MemoA = memos.val1.get(val1);
        if (val2MemoA !== void 0) {
          var val2MemoB = memos.val2.get(val2);
          if (val2MemoB !== void 0) {
            return val2MemoA === val2MemoB;
          }
        }
        memos.position++;
      }
      memos.val1.set(val1, memos.position);
      memos.val2.set(val2, memos.position);
      var areEq = objEquiv(val1, val2, strict, aKeys, memos, iterationType);
      memos.val1.delete(val1);
      memos.val2.delete(val2);
      return areEq;
    }
    function setHasEqualElement(set, val1, strict, memo2) {
      var setValues = arrayFromSet(set);
      for (var i2 = 0; i2 < setValues.length; i2++) {
        var val2 = setValues[i2];
        if (innerDeepEqual(val1, val2, strict, memo2)) {
          set.delete(val2);
          return true;
        }
      }
      return false;
    }
    function findLooseMatchingPrimitives(prim) {
      switch (_typeof2(prim)) {
        case "undefined":
          return null;
        case "object":
          return void 0;
        case "symbol":
          return false;
        case "string":
          prim = +prim;
        case "number":
          if (numberIsNaN(prim)) {
            return false;
          }
      }
      return true;
    }
    function setMightHaveLoosePrim(a2, b2, prim) {
      var altValue = findLooseMatchingPrimitives(prim);
      if (altValue != null) return altValue;
      return b2.has(altValue) && !a2.has(altValue);
    }
    function mapMightHaveLoosePrim(a2, b2, prim, item2, memo2) {
      var altValue = findLooseMatchingPrimitives(prim);
      if (altValue != null) {
        return altValue;
      }
      var curB = b2.get(altValue);
      if (curB === void 0 && !b2.has(altValue) || !innerDeepEqual(item2, curB, false, memo2)) {
        return false;
      }
      return !a2.has(altValue) && innerDeepEqual(item2, curB, false, memo2);
    }
    function setEquiv(a2, b2, strict, memo2) {
      var set = null;
      var aValues = arrayFromSet(a2);
      for (var i2 = 0; i2 < aValues.length; i2++) {
        var val = aValues[i2];
        if (_typeof2(val) === "object" && val !== null) {
          if (set === null) {
            set = /* @__PURE__ */ new Set();
          }
          set.add(val);
        } else if (!b2.has(val)) {
          if (strict) return false;
          if (!setMightHaveLoosePrim(a2, b2, val)) {
            return false;
          }
          if (set === null) {
            set = /* @__PURE__ */ new Set();
          }
          set.add(val);
        }
      }
      if (set !== null) {
        var bValues = arrayFromSet(b2);
        for (var _i = 0; _i < bValues.length; _i++) {
          var _val = bValues[_i];
          if (_typeof2(_val) === "object" && _val !== null) {
            if (!setHasEqualElement(set, _val, strict, memo2)) return false;
          } else if (!strict && !a2.has(_val) && !setHasEqualElement(set, _val, strict, memo2)) {
            return false;
          }
        }
        return set.size === 0;
      }
      return true;
    }
    function mapHasEqualEntry(set, map2, key1, item1, strict, memo2) {
      var setValues = arrayFromSet(set);
      for (var i2 = 0; i2 < setValues.length; i2++) {
        var key2 = setValues[i2];
        if (innerDeepEqual(key1, key2, strict, memo2) && innerDeepEqual(item1, map2.get(key2), strict, memo2)) {
          set.delete(key2);
          return true;
        }
      }
      return false;
    }
    function mapEquiv(a2, b2, strict, memo2) {
      var set = null;
      var aEntries = arrayFromMap(a2);
      for (var i2 = 0; i2 < aEntries.length; i2++) {
        var _aEntries$i = _slicedToArray(aEntries[i2], 2), key = _aEntries$i[0], item1 = _aEntries$i[1];
        if (_typeof2(key) === "object" && key !== null) {
          if (set === null) {
            set = /* @__PURE__ */ new Set();
          }
          set.add(key);
        } else {
          var item2 = b2.get(key);
          if (item2 === void 0 && !b2.has(key) || !innerDeepEqual(item1, item2, strict, memo2)) {
            if (strict) return false;
            if (!mapMightHaveLoosePrim(a2, b2, key, item1, memo2)) return false;
            if (set === null) {
              set = /* @__PURE__ */ new Set();
            }
            set.add(key);
          }
        }
      }
      if (set !== null) {
        var bEntries = arrayFromMap(b2);
        for (var _i2 = 0; _i2 < bEntries.length; _i2++) {
          var _bEntries$_i = _slicedToArray(bEntries[_i2], 2), key = _bEntries$_i[0], item3 = _bEntries$_i[1];
          if (_typeof2(key) === "object" && key !== null) {
            if (!mapHasEqualEntry(set, a2, key, item3, strict, memo2)) return false;
          } else if (!strict && (!a2.has(key) || !innerDeepEqual(a2.get(key), item3, false, memo2)) && !mapHasEqualEntry(set, a2, key, item3, false, memo2)) {
            return false;
          }
        }
        return set.size === 0;
      }
      return true;
    }
    function objEquiv(a2, b2, strict, keys, memos, iterationType) {
      var i2 = 0;
      if (iterationType === kIsSet) {
        if (!setEquiv(a2, b2, strict, memos)) {
          return false;
        }
      } else if (iterationType === kIsMap) {
        if (!mapEquiv(a2, b2, strict, memos)) {
          return false;
        }
      } else if (iterationType === kIsArray) {
        for (; i2 < a2.length; i2++) {
          if (hasOwnProperty2(a2, i2)) {
            if (!hasOwnProperty2(b2, i2) || !innerDeepEqual(a2[i2], b2[i2], strict, memos)) {
              return false;
            }
          } else if (hasOwnProperty2(b2, i2)) {
            return false;
          } else {
            var keysA = Object.keys(a2);
            for (; i2 < keysA.length; i2++) {
              var key = keysA[i2];
              if (!hasOwnProperty2(b2, key) || !innerDeepEqual(a2[key], b2[key], strict, memos)) {
                return false;
              }
            }
            if (keysA.length !== Object.keys(b2).length) {
              return false;
            }
            return true;
          }
        }
      }
      for (i2 = 0; i2 < keys.length; i2++) {
        var _key = keys[i2];
        if (!innerDeepEqual(a2[_key], b2[_key], strict, memos)) {
          return false;
        }
      }
      return true;
    }
    function isDeepEqual(val1, val2) {
      return innerDeepEqual(val1, val2, kLoose);
    }
    function isDeepStrictEqual(val1, val2) {
      return innerDeepEqual(val1, val2, kStrict);
    }
    comparisons = {
      isDeepEqual,
      isDeepStrictEqual
    };
    return comparisons;
  }
  var hasRequiredAssert;
  function requireAssert() {
    if (hasRequiredAssert) return assert$1.exports;
    hasRequiredAssert = 1;
    function _typeof2(obj) {
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof2 = function _typeof3(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof2 = function _typeof3(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof2(obj);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    var _require = requireErrors(), _require$codes = _require.codes, ERR_AMBIGUOUS_ARGUMENT = _require$codes.ERR_AMBIGUOUS_ARGUMENT, ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE = _require$codes.ERR_INVALID_ARG_VALUE, ERR_INVALID_RETURN_VALUE = _require$codes.ERR_INVALID_RETURN_VALUE, ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
    var AssertionError = requireAssertion_error();
    var _require2 = util, inspect = _require2.inspect;
    var _require$types = util.types, isPromise = _require$types.isPromise, isRegExp = _require$types.isRegExp;
    var objectAssign = Object.assign ? Object.assign : requireEs6ObjectAssign().assign;
    var objectIs2 = Object.is ? Object.is : requireObjectIs();
    var isDeepEqual;
    var isDeepStrictEqual;
    function lazyLoadComparison() {
      var comparison = requireComparisons();
      isDeepEqual = comparison.isDeepEqual;
      isDeepStrictEqual = comparison.isDeepStrictEqual;
    }
    var warned = false;
    var assert2 = assert$1.exports = ok;
    var NO_EXCEPTION_SENTINEL = {};
    function innerFail(obj) {
      if (obj.message instanceof Error) throw obj.message;
      throw new AssertionError(obj);
    }
    function fail(actual, expected, message2, operator, stackStartFn) {
      var argsLen = arguments.length;
      var internalMessage;
      if (argsLen === 0) {
        internalMessage = "Failed";
      } else if (argsLen === 1) {
        message2 = actual;
        actual = void 0;
      } else {
        if (warned === false) {
          warned = true;
          var warn = process.emitWarning ? process.emitWarning : console.warn.bind(console);
          warn("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094");
        }
        if (argsLen === 2) operator = "!=";
      }
      if (message2 instanceof Error) throw message2;
      var errArgs = {
        actual,
        expected,
        operator: operator === void 0 ? "fail" : operator,
        stackStartFn: stackStartFn || fail
      };
      if (message2 !== void 0) {
        errArgs.message = message2;
      }
      var err = new AssertionError(errArgs);
      if (internalMessage) {
        err.message = internalMessage;
        err.generatedMessage = true;
      }
      throw err;
    }
    assert2.fail = fail;
    assert2.AssertionError = AssertionError;
    function innerOk(fn, argLen, value, message2) {
      if (!value) {
        var generatedMessage = false;
        if (argLen === 0) {
          generatedMessage = true;
          message2 = "No value argument passed to `assert.ok()`";
        } else if (message2 instanceof Error) {
          throw message2;
        }
        var err = new AssertionError({
          actual: value,
          expected: true,
          message: message2,
          operator: "==",
          stackStartFn: fn
        });
        err.generatedMessage = generatedMessage;
        throw err;
      }
    }
    function ok() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      innerOk.apply(void 0, [ok, args.length].concat(args));
    }
    assert2.ok = ok;
    assert2.equal = function equal(actual, expected, message2) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (actual != expected) {
        innerFail({
          actual,
          expected,
          message: message2,
          operator: "==",
          stackStartFn: equal
        });
      }
    };
    assert2.notEqual = function notEqual(actual, expected, message2) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (actual == expected) {
        innerFail({
          actual,
          expected,
          message: message2,
          operator: "!=",
          stackStartFn: notEqual
        });
      }
    };
    assert2.deepEqual = function deepEqual(actual, expected, message2) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (isDeepEqual === void 0) lazyLoadComparison();
      if (!isDeepEqual(actual, expected)) {
        innerFail({
          actual,
          expected,
          message: message2,
          operator: "deepEqual",
          stackStartFn: deepEqual
        });
      }
    };
    assert2.notDeepEqual = function notDeepEqual(actual, expected, message2) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (isDeepEqual === void 0) lazyLoadComparison();
      if (isDeepEqual(actual, expected)) {
        innerFail({
          actual,
          expected,
          message: message2,
          operator: "notDeepEqual",
          stackStartFn: notDeepEqual
        });
      }
    };
    assert2.deepStrictEqual = function deepStrictEqual(actual, expected, message2) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (isDeepEqual === void 0) lazyLoadComparison();
      if (!isDeepStrictEqual(actual, expected)) {
        innerFail({
          actual,
          expected,
          message: message2,
          operator: "deepStrictEqual",
          stackStartFn: deepStrictEqual
        });
      }
    };
    assert2.notDeepStrictEqual = notDeepStrictEqual;
    function notDeepStrictEqual(actual, expected, message2) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (isDeepEqual === void 0) lazyLoadComparison();
      if (isDeepStrictEqual(actual, expected)) {
        innerFail({
          actual,
          expected,
          message: message2,
          operator: "notDeepStrictEqual",
          stackStartFn: notDeepStrictEqual
        });
      }
    }
    assert2.strictEqual = function strictEqual(actual, expected, message2) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (!objectIs2(actual, expected)) {
        innerFail({
          actual,
          expected,
          message: message2,
          operator: "strictEqual",
          stackStartFn: strictEqual
        });
      }
    };
    assert2.notStrictEqual = function notStrictEqual(actual, expected, message2) {
      if (arguments.length < 2) {
        throw new ERR_MISSING_ARGS("actual", "expected");
      }
      if (objectIs2(actual, expected)) {
        innerFail({
          actual,
          expected,
          message: message2,
          operator: "notStrictEqual",
          stackStartFn: notStrictEqual
        });
      }
    };
    var Comparison = function Comparison2(obj, keys, actual) {
      var _this = this;
      _classCallCheck(this, Comparison2);
      keys.forEach(function(key) {
        if (key in obj) {
          if (actual !== void 0 && typeof actual[key] === "string" && isRegExp(obj[key]) && obj[key].test(actual[key])) {
            _this[key] = actual[key];
          } else {
            _this[key] = obj[key];
          }
        }
      });
    };
    function compareExceptionKey(actual, expected, key, message2, keys, fn) {
      if (!(key in actual) || !isDeepStrictEqual(actual[key], expected[key])) {
        if (!message2) {
          var a2 = new Comparison(actual, keys);
          var b2 = new Comparison(expected, keys, actual);
          var err = new AssertionError({
            actual: a2,
            expected: b2,
            operator: "deepStrictEqual",
            stackStartFn: fn
          });
          err.actual = actual;
          err.expected = expected;
          err.operator = fn.name;
          throw err;
        }
        innerFail({
          actual,
          expected,
          message: message2,
          operator: fn.name,
          stackStartFn: fn
        });
      }
    }
    function expectedException(actual, expected, msg, fn) {
      if (typeof expected !== "function") {
        if (isRegExp(expected)) return expected.test(actual);
        if (arguments.length === 2) {
          throw new ERR_INVALID_ARG_TYPE("expected", ["Function", "RegExp"], expected);
        }
        if (_typeof2(actual) !== "object" || actual === null) {
          var err = new AssertionError({
            actual,
            expected,
            message: msg,
            operator: "deepStrictEqual",
            stackStartFn: fn
          });
          err.operator = fn.name;
          throw err;
        }
        var keys = Object.keys(expected);
        if (expected instanceof Error) {
          keys.push("name", "message");
        } else if (keys.length === 0) {
          throw new ERR_INVALID_ARG_VALUE("error", expected, "may not be an empty object");
        }
        if (isDeepEqual === void 0) lazyLoadComparison();
        keys.forEach(function(key) {
          if (typeof actual[key] === "string" && isRegExp(expected[key]) && expected[key].test(actual[key])) {
            return;
          }
          compareExceptionKey(actual, expected, key, msg, keys, fn);
        });
        return true;
      }
      if (expected.prototype !== void 0 && actual instanceof expected) {
        return true;
      }
      if (Error.isPrototypeOf(expected)) {
        return false;
      }
      return expected.call({}, actual) === true;
    }
    function getActual(fn) {
      if (typeof fn !== "function") {
        throw new ERR_INVALID_ARG_TYPE("fn", "Function", fn);
      }
      try {
        fn();
      } catch (e2) {
        return e2;
      }
      return NO_EXCEPTION_SENTINEL;
    }
    function checkIsPromise(obj) {
      return isPromise(obj) || obj !== null && _typeof2(obj) === "object" && typeof obj.then === "function" && typeof obj.catch === "function";
    }
    function waitForActual(promiseFn) {
      return Promise.resolve().then(function() {
        var resultPromise;
        if (typeof promiseFn === "function") {
          resultPromise = promiseFn();
          if (!checkIsPromise(resultPromise)) {
            throw new ERR_INVALID_RETURN_VALUE("instance of Promise", "promiseFn", resultPromise);
          }
        } else if (checkIsPromise(promiseFn)) {
          resultPromise = promiseFn;
        } else {
          throw new ERR_INVALID_ARG_TYPE("promiseFn", ["Function", "Promise"], promiseFn);
        }
        return Promise.resolve().then(function() {
          return resultPromise;
        }).then(function() {
          return NO_EXCEPTION_SENTINEL;
        }).catch(function(e2) {
          return e2;
        });
      });
    }
    function expectsError(stackStartFn, actual, error, message2) {
      if (typeof error === "string") {
        if (arguments.length === 4) {
          throw new ERR_INVALID_ARG_TYPE("error", ["Object", "Error", "Function", "RegExp"], error);
        }
        if (_typeof2(actual) === "object" && actual !== null) {
          if (actual.message === error) {
            throw new ERR_AMBIGUOUS_ARGUMENT("error/message", 'The error message "'.concat(actual.message, '" is identical to the message.'));
          }
        } else if (actual === error) {
          throw new ERR_AMBIGUOUS_ARGUMENT("error/message", 'The error "'.concat(actual, '" is identical to the message.'));
        }
        message2 = error;
        error = void 0;
      } else if (error != null && _typeof2(error) !== "object" && typeof error !== "function") {
        throw new ERR_INVALID_ARG_TYPE("error", ["Object", "Error", "Function", "RegExp"], error);
      }
      if (actual === NO_EXCEPTION_SENTINEL) {
        var details = "";
        if (error && error.name) {
          details += " (".concat(error.name, ")");
        }
        details += message2 ? ": ".concat(message2) : ".";
        var fnType = stackStartFn.name === "rejects" ? "rejection" : "exception";
        innerFail({
          actual: void 0,
          expected: error,
          operator: stackStartFn.name,
          message: "Missing expected ".concat(fnType).concat(details),
          stackStartFn
        });
      }
      if (error && !expectedException(actual, error, message2, stackStartFn)) {
        throw actual;
      }
    }
    function expectsNoError(stackStartFn, actual, error, message2) {
      if (actual === NO_EXCEPTION_SENTINEL) return;
      if (typeof error === "string") {
        message2 = error;
        error = void 0;
      }
      if (!error || expectedException(actual, error)) {
        var details = message2 ? ": ".concat(message2) : ".";
        var fnType = stackStartFn.name === "doesNotReject" ? "rejection" : "exception";
        innerFail({
          actual,
          expected: error,
          operator: stackStartFn.name,
          message: "Got unwanted ".concat(fnType).concat(details, "\n") + 'Actual message: "'.concat(actual && actual.message, '"'),
          stackStartFn
        });
      }
      throw actual;
    }
    assert2.throws = function throws(promiseFn) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      expectsError.apply(void 0, [throws, getActual(promiseFn)].concat(args));
    };
    assert2.rejects = function rejects(promiseFn) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }
      return waitForActual(promiseFn).then(function(result) {
        return expectsError.apply(void 0, [rejects, result].concat(args));
      });
    };
    assert2.doesNotThrow = function doesNotThrow(fn) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }
      expectsNoError.apply(void 0, [doesNotThrow, getActual(fn)].concat(args));
    };
    assert2.doesNotReject = function doesNotReject(fn) {
      for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }
      return waitForActual(fn).then(function(result) {
        return expectsNoError.apply(void 0, [doesNotReject, result].concat(args));
      });
    };
    assert2.ifError = function ifError(err) {
      if (err !== null && err !== void 0) {
        var message2 = "ifError got unwanted exception: ";
        if (_typeof2(err) === "object" && typeof err.message === "string") {
          if (err.message.length === 0 && err.constructor) {
            message2 += err.constructor.name;
          } else {
            message2 += err.message;
          }
        } else {
          message2 += inspect(err);
        }
        var newErr = new AssertionError({
          actual: err,
          expected: null,
          operator: "ifError",
          message: message2,
          stackStartFn: ifError
        });
        var origStack = err.stack;
        if (typeof origStack === "string") {
          var tmp2 = origStack.split("\n");
          tmp2.shift();
          var tmp1 = newErr.stack.split("\n");
          for (var i2 = 0; i2 < tmp2.length; i2++) {
            var pos = tmp1.indexOf(tmp2[i2]);
            if (pos !== -1) {
              tmp1 = tmp1.slice(0, pos);
              break;
            }
          }
          newErr.stack = "".concat(tmp1.join("\n"), "\n").concat(tmp2.join("\n"));
        }
        throw newErr;
      }
    };
    function strict() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }
      innerOk.apply(void 0, [strict, args.length].concat(args));
    }
    assert2.strict = objectAssign(strict, assert2, {
      equal: assert2.strictEqual,
      deepEqual: assert2.deepStrictEqual,
      notEqual: assert2.notStrictEqual,
      notDeepEqual: assert2.notDeepStrictEqual
    });
    assert2.strict.strict = assert2.strict;
    return assert$1.exports;
  }
  var assertExports = requireAssert();
  const assert = /* @__PURE__ */ getDefaultExportFromCjs(assertExports);
  const hiddenContainerCss = css$1`
  position: fixed;
  top: -1000px;
  left: -1000px;
  visibility: hidden;
`;
  function handleTagsMaxWidth(allTagsSorted) {
    const minimalVisiblePercent = 0.88;
    const hiddenContainerRef = React__default.useRef(null);
    const [tagsOriginalWidthMap, { setAll }] = useMap();
    const [tagsMaxWidth, setTagsMaxWidth] = React__default.useState(140);
    useUpdateEffect(() => {
      var _a;
      if (!allTagsSorted.length) return;
      if (tagsOriginalWidthMap.size) {
        return;
      }
      const map2 = Array.from(
        ((_a = hiddenContainerRef.current) == null ? void 0 : _a.querySelectorAll(`[data-tag-id]`)) || []
      ).reduce(
        (ret, el) => {
          const id2 = el.dataset.tagId;
          assert(id2, "data-tag-id empty");
          const width = Math.ceil(el.getBoundingClientRect().width);
          return { ...ret, [id2]: width };
        },
        {}
      );
      setAll(Object.entries(map2));
      const _widths = allTagsSorted.map((t2) => map2[t2.id] || 0).sort((a2, b2) => a2 - b2);
      const _index = minmax(
        Math.ceil(allTagsSorted.length * minimalVisiblePercent - 1),
        0,
        allTagsSorted.length - 1
      );
      const val = minmax(_widths[_index], 120, 200);
      setTagsMaxWidth(val);
    }, [allTagsSorted]);
    return { tagsOriginalWidthMap, tagsMaxWidth, hiddenContainerRef };
  }
  function TagsList() {
    const {
      videosAfterFilterByScope,
      allTags,
      tagSorter,
      selectedTagIds,
      lockedTagIds,
      videosAfterFilterByTag
    } = useStoreSnapshot();
    const { disableTagTextSelect, tagsForceOrder } = useSettingsSnapshot();
    const allTagsSorted = React__default.useMemo(
      () => _allTagsSorted({ tagSorter, allTags, tagsForceOrder }),
      [tagSorter, allTags, tagsForceOrder]
    );
    const allTagIds = React__default.useMemo(() => allTagsSorted._map("id"), [allTagsSorted]);
    useUpdateEffect(() => {
      const allVisibleIds = allTagsSorted.map((x2) => x2.id);
      for (const id2 of selectedTagIds) {
        if (!allVisibleIds.includes(id2)) {
          store.selectedTagIds.delete(id2);
        }
      }
    }, [allTagsSorted]);
    const { tagsMaxWidth, tagsOriginalWidthMap, hiddenContainerRef } = handleTagsMaxWidth(allTagsSorted);
    const onCheckedChange = useMemoizedFn((id2, newValue) => {
      if (!newValue) {
        if (!lockedTagIds.has(id2)) {
          store.selectedTagIds.delete(id2);
        }
        return;
      }
      !!videosAfterFilterByTag.length;
      const nextSelectedTagIds = [...selectedTagIds, id2].uniq().filter((x2) => allTagIds.includes(x2));
      const nextHasVideo = !!filterByTag(videosAfterFilterByScope, nextSelectedTagIds).length;
      if (nextHasVideo) {
        store.selectedTagIds.add(id2);
        return;
      }
      const allVisibleTagIds2 = allTagsSorted.map((x2) => x2.id);
      const autoUnSelectTagIds = [...selectedTagIds].filter(
        (id22) => allVisibleTagIds2.includes(id22) && !lockedTagIds.has(id22)
      );
      const autoUnSelectTagNames = autoUnSelectTagIds.map((id22) => {
        var _a;
        return ((_a = allTags.find((t2) => t2.id === id22)) == null ? void 0 : _a.name) || "";
      });
      if (autoUnSelectTagNames.length) {
        antd.message.info(`Tag 组合结果为空, 已自动取消勾选${autoUnSelectTagNames.map((x2) => `「${x2}」`).join("&")}`, 1);
      }
      autoUnSelectTagIds.forEach((id22) => store.selectedTagIds.delete(id22));
      store.selectedTagIds.add(id2);
    });
    const onLockedChange = useMemoizedFn((id2, locked) => {
      if (locked) {
        store.lockedTagIds.add(id2);
        store.selectedTagIds.add(id2);
      } else {
        store.lockedTagIds.delete(id2);
      }
    });
    const allVisibleTagIds = React__default.useMemo(() => allTagsSorted.map((x2) => x2.id), [allTagsSorted]);
    const allVisibleLockedTagIds = React__default.useMemo(
      () => Array.from(lockedTagIds).filter((id2) => allVisibleTagIds.includes(id2)),
      [lockedTagIds, allVisibleTagIds]
    );
    const _lockedTagIds = React__default.useDeferredValue(lockedTagIds);
    const tagIdsAfterApplyLock = React__default.useMemo(() => {
      if (!allVisibleLockedTagIds.length) return [];
      const videosAfterApplyLock = filterByTag(videosAfterFilterByScope, [...lockedTagIds]);
      const tagIdsAfterApplyLock2 = getAllTags(videosAfterApplyLock)._map("id");
      return tagIdsAfterApplyLock2;
    }, [videosAfterFilterByScope, allTagsSorted, _lockedTagIds]);
    return jsxs(
      "div",
      {
        css: css$1`
        margin-top: 5px;
        display: flex;
        flex-wrap: wrap;
        row-gap: 4px;
        column-gap: 12px;
      `,
        children: [
          !tagsOriginalWidthMap.size && jsx("div", { css: hiddenContainerCss, ref: hiddenContainerRef, children: allTagsSorted.map((t2) => jsx(TagDisplay, { tag: t2, tagSorter }, t2.id)) }),
          allTagsSorted.map((tag2) => {
            const { name, id: id2 } = tag2;
            const cliped = !!(tagsMaxWidth && tagsOriginalWidthMap.get(id2) && tagsOriginalWidthMap.get(id2) > tagsMaxWidth);
            let faded = false;
            if (allVisibleLockedTagIds.length && !allVisibleLockedTagIds.includes(id2) && !tagIdsAfterApplyLock.includes(id2)) {
              faded = true;
            }
            return jsx(
              TagDisplay,
              {
                ...{
                  key: id2,
                  tag: tag2,
                  tagSorter,
                  tagWidth: tagsMaxWidth,
                  disableTagTextSelect,
                  isForceOrder: tagsForceOrder.includes(name),
                  cliped,
                  faded,
                  checked: selectedTagIds.has(id2),
                  onCheckedChange,
                  locked: lockedTagIds.has(id2),
                  onLockedChange
                }
              }
            );
          })
        ]
      }
    );
  }
  async function fetchAll(emitter) {
    let expectedVideoCount = getVideoCount();
    const isRecentUpdate = IS_RECENT_UPDATE;
    if (isRecentUpdate) {
      expectedVideoCount = settings.autoParseVideoCountLimit;
      if (location.href.includes("/uncensored")) {
        expectedVideoCount = 500;
      }
    }
    const videos = await allVideos({
      url: location.href,
      expectedVideoCount,
      emitter,
      isRecentUpdate
    });
    videos.forEach((item2) => {
      var _a;
      item2.key = item2.link;
      item2.collectionType = classifyCollectionType(item2);
      item2.tagsMap = (((_a = item2.detailInfo) == null ? void 0 : _a.tags) || []).reduce((map2, tag2) => {
        return { ...map2, [getTagId(tag2.url)]: true };
      }, {});
    });
    return videos;
  }
  const cleanedStatus = proxy({ value: false });
  function useCleanedStatus() {
    return useSnapshot(cleanedStatus).value;
  }
  const removeDefaultContents = lodash.once(() => {
    jq("#waterfall").remove();
    jq("#x-status").remove();
    jq("ul.pagination").parent().remove();
    cleanedStatus.value = true;
  });
  async function init() {
    const start = performance.now();
    const prevStateKeeped = lodash.pick(store, ["moreFilterPanelExpanded"]);
    Object.assign(store, initialState(), prevStateKeeped);
    const emitter = mitt();
    emitter.on("page-progress", (page) => {
      store.loadingPageCount = page;
    });
    emitter.on("detail-progress", (p2) => {
      store.loadingProgress = p2;
    });
    const videos = await fetchAll(emitter);
    store.videos = videos;
    removeDefaultContents();
    const cost = performance.now() - start;
    logWithLabel("init cost %s ms", Math.round(cost));
  }
  function VideoFilter() {
    const {
      runAsync: loadAll,
      loading,
      error
    } = useRequest(init, {
      manual: true
    });
    const {
      disableTagTextSelect,
      showBlackListCollectionCheckbox,
      autoParseVideoCountLimit: VIDEO_COUNT_LIMIT
    } = useSettingsSnapshot();
    const expectedVideoCount = React__default.useMemo(() => {
      const num = getVideoCount();
      console.log("[javbus-guide]: expect %s videos", num);
      return num;
    }, []);
    const tooMany = expectedVideoCount > VIDEO_COUNT_LIMIT;
    const [tooManyButCached, setTooManyButCached] = React__default.useState(false);
    useMount(async () => {
      if (IS_RECENT_UPDATE) {
        return loadAll();
      }
      if (!tooMany) {
        return loadAll();
      }
      if (await pageHasValidCache(location.href, expectedVideoCount)) {
        setTooManyButCached(true);
        return loadAll();
      }
      if (await pageHasCache(location.href)) {
        await loadAll();
      }
    });
    if (error) {
      console.error(error);
    }
    const {
      videos,
      videosAfterFilterByScope,
      videosAfterFilterByTag,
      loadingPageCount,
      loadingProgress,
      videoCountRecord,
      includeRecord,
      tagSorter,
      moreFilterPanelExpanded
    } = useStoreSnapshot();
    const onExport = useMemoizedFn(() => {
      const content = videosAfterFilterByTag.map((v2) => v2.id).join("\n");
      GM_setClipboard(content);
      antd.message.success("已复制");
    });
    const cleaned = useCleanedStatus();
    return jsxs("div", { className: cx(actionsWrapper, container), children: [
      jsx(StarInfoView, {}),
      IS_RECENT_UPDATE && jsx("div", { children: loading ? jsx("h1", { children: "最近更新的影片" }) : jsxs("h1", { children: [
        "最近更新的 ",
        videos.length,
        " 部影片"
      ] }) }),
      jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [
        jsxs(antd.Button, { onClick: loadAll, loading, size: "large", type: "primary", children: [
          "加载全部内容并筛选",
          loading && "(...加载中)",
          error && "(出错重试)"
        ] }),
        jsx(antd.Tooltip, { title: "清除已选择的 Tags", children: jsx(
          antd.Button,
          {
            style: { marginLeft: "5px" },
            onClick: () => {
              store.lockedTagIds.clear();
              store.selectedTagIds.clear();
            },
            size: "large",
            children: "清除已选"
          }
        ) }),
        jsx("span", { style: { marginLeft: 10 } }),
        CollectionTypeValues.map((item2) => {
          const { label: label2, tooltip } = CollectionTypeConfig[item2];
          const videoCount = videoCountRecord[item2];
          const checked = includeRecord[item2];
          let show = loading || !!videoCount;
          if (item2 === CollectionType.BlackList) {
            show = showBlackListCollectionCheckbox;
          }
          return jsx(React__default.Fragment, { children: show && jsx(antd.Checkbox, { checked, onChange: (e2) => store.includeRecord[item2] = e2.target.checked, children: jsxs(CustomTooltip, { title: tooltip, children: [
            label2,
            "(",
            videoCount,
            ")"
          ] }) }) }, item2);
        }),
        jsx(MoreFilterPanelTrigger, {}),
        jsx(antd.Tooltip, { title: "复制筛选后的番号列表到剪贴板", children: jsx(antd.Button, { style: { marginLeft: 5 }, onClick: onExport, children: "导出" }) }),
        jsx("div", { style: { flex: "1" } }),
        jsxs(antd.Space, { children: [
          jsx(antd.Button, { onClick: () => showSettingsUi(), children: "设置" }),
          jsx(
            antd.Select,
            {
              style: { width: 120 },
              value: tagSorter,
              onChange: (val) => store.tagSorter = val,
              options: Object.entries(TagSorterLabel).map(([tagSorter2, label2]) => ({
                value: tagSorter2,
                label: label2
              }))
            }
          ),
          jsx(
            antd.Checkbox,
            {
              checked: disableTagTextSelect,
              onChange: (e2) => {
                settings.disableTagTextSelect = e2.target.checked;
              },
              children: "Tag 文字禁用选中"
            }
          )
        ] })
      ] }),
      jsx(CollapsePanel, { expanded: moreFilterPanelExpanded, children: jsx(MoreFilterPanel, {}) }),
      jsx(TagsList, {}),
      jsxs(
        "h3",
        {
          css: css$1`
          margin-top: 10px;
          margin-bottom: 10px;
        `,
          children: [
            "匹配的影片",
            jsxs(
              CustomTooltip,
              {
                title: jsxs(Fragment, { children: [
                  "全部: ",
                  videos.length,
                  " ",
                  jsx("br", {}),
                  "范围筛选后剩余: ",
                  videosAfterFilterByScope.length,
                  " ",
                  jsx("br", {}),
                  "Tag筛选后剩余: ",
                  videosAfterFilterByTag.length,
                  " ",
                  jsx("br", {})
                ] }),
                children: [
                  "(",
                  videosAfterFilterByTag.length,
                  "/",
                  videosAfterFilterByScope.length,
                  "/",
                  videos.length,
                  ")"
                ]
              }
            )
          ]
        }
      ),
      tooMany && !videos.length && jsxs(
        "div",
        {
          className: "filtered-title",
          style: {
            textAlign: "center",
            padding: "20px 0"
          },
          children: [
            jsxs("h2", { children: [
              "影片数量(",
              expectedVideoCount,
              ") 超过限值(",
              VIDEO_COUNT_LIMIT,
              ")",
              tooManyButCached ? "" : ",已取消自动加载"
            ] }),
            jsx(antd.Button, { onClick: loadAll, loading, type: "primary", size: "large", children: loading ? jsxs(Fragment, { children: [
              tooManyButCached ? "检测到缓存, " : "",
              " 加载中...影片数量较多, 请耐心等待!"
            ] }) : "点击手动加载" })
          ]
        }
      ),
      jsxs(
        "div",
        {
          className: "filtered-container",
          css: css$1`
          margin: 10px 0 0;
        `,
          children: [
            loading ? jsx(
              "div",
              {
                css: css$1`
              padding: 20px 0;
            `,
                children: jsx(ProgressDisplay, { loadingPageCount, loadingProgress })
              }
            ) : jsxs(Fragment, { children: [
              (!tooMany || tooMany && !!videos.length) && !videosAfterFilterByTag.length && jsx(antd.Empty, { style: { margin: "0 auto" } }),
              jsx(VideoListVirtuoso, { list: videosAfterFilterByTag })
            ] }),
            jsx(
              antd.Divider,
              {
                plain: true,
                orientation: "center",
                css: css$1`
            margin-top: 80px !important;
            margin-bottom: 150px !important;
          `,
                children: "底线"
              }
            ),
            !cleaned && jsxs(
              "div",
              {
                css: css$1`
              margin-top: 50vh;
              height: 20vh;
              background-color: blueviolet;
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
            `,
                children: [
                  jsx(
                    IconPark,
                    {
                      name: "WaterfallsH",
                      size: 40,
                      css: css$1`
                margin-right: 10px;
              `
                    }
                  ),
                  "默认内容"
                ]
              }
            )
          ]
        }
      )
    ] });
  }
  function ProgressDisplay({
    loadingPageCount,
    loadingProgress
  }) {
    let num = 1;
    const numDisplay = (no) => jsx(
      "span",
      {
        css: css$1`
        aspect-ratio: 1;
        border-radius: 50%;
        background-color: pink;
        color: #fff;
        width: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 5px;
      `,
        children: no
      }
    );
    return jsx(
      "div",
      {
        css: css$1`
        width: 300px;
        margin: 0 auto;
        text-align: center;
      `,
        children: jsxs(
          antd.Space,
          {
            direction: "vertical",
            size: "large",
            css: css$1`
          width: 100%;
        `,
            children: [
              !!loadingPageCount && jsxs("div", { children: [
                numDisplay(num++),
                "已访问列表页: ",
                loadingPageCount
              ] }),
              jsxs("div", { children: [
                jsx(antd.Progress, { percent: Math.round(loadingProgress.progress * 100) }),
                numDisplay(num++),
                "已访问详情页: ",
                loadingProgress.completed,
                "/",
                loadingProgress.total
              ] })
            ]
          }
        )
      }
    );
  }
  function VideoListVirtuoso({ list }) {
    return jsx("div", { children: jsx(
      VirtuosoGrid,
      {
        useWindowScroll: true,
        overscan: 50,
        data: list,
        computeItemKey: (index, video) => video.key,
        listClassName: grid,
        itemContent: (index, video) => {
          return jsx(Card, { item: video });
        }
      }
    ) });
  }
  const RECENT_UPDATE_HASH_STR = "#recent-update";
  const IS_RECENT_UPDATE = getIsRecentUpdate(location.href);
  function getIsRecentUpdate(url) {
    const u2 = new URL(url);
    const p2 = getTrimedPath();
    return p2 === "/" && u2.hash === RECENT_UPDATE_HASH_STR;
  }
  function initFilter() {
    const path = getTrimedPath();
    if (path.startsWith("/star/") || path.startsWith("/genre/") || path.startsWith("/series/") || path.startsWith("/studio/") || path.startsWith("/label/") || path.startsWith("/director/")) {
      return addFilter();
    }
    if (path.startsWith("/search/")) {
      const count = getVideoCount();
      if (count <= 5) {
        logWithLabel("too little videos in search page, skip addFilter");
        return;
      }
      return addFilter();
    }
    if (path === "/") {
      if (IS_RECENT_UPDATE) {
        return addFilter();
      } else {
        return addRecentUpdateEntry();
      }
    }
  }
  async function addFilter() {
    const reactContainer = jq("<div></div>").insertBefore(jq("#waterfall"))[0];
    const root2 = createRoot(reactContainer);
    root2.render(
      jsx(AntdAppWrapper, { children: jsx(VideoFilter, {}) })
    );
  }
  function addRecentUpdateEntry() {
    const u2 = new URL(location.href);
    u2.hash = RECENT_UPDATE_HASH_STR;
    const newHref = u2.toString();
    const entry = jq("<a></a>").attr("href", newHref).attr("target", "_blank").text("JavBus-Guide 番号筛选器: 最近更新").addClass(styled.generateClassName`
      display: block;
      margin: 40px 0 10px 0;
      text-align: center;
    `)[0];
    const anchor = document.querySelector("#waterfall");
    anchor == null ? void 0 : anchor.insertAdjacentElement("beforebegin", entry);
  }
  function initForum() {
    const u2 = new URL(location.href);
    if (u2.pathname === "/forum/forum.php" && u2.searchParams.get("mod") === "forumdisplay") {
      if (settings.alwaysViewThreadInNewWindow) {
        const a2 = document.querySelector("#atarget");
        const checked = a2 == null ? void 0 : a2.classList.contains("atarget_1");
        if (!checked) {
          a2 == null ? void 0 : a2.click();
        }
      }
    }
  }
  const createAbortError = () => {
    const error = new Error("Delay aborted");
    error.name = "AbortError";
    return error;
  };
  const clearMethods = /* @__PURE__ */ new WeakMap();
  function createDelay({ clearTimeout: defaultClear, setTimeout: defaultSet } = {}) {
    return (milliseconds, { value, signal } = {}) => {
      if (signal == null ? void 0 : signal.aborted) {
        return Promise.reject(createAbortError());
      }
      let timeoutId;
      let settle;
      let rejectFunction;
      const clear = defaultClear ?? clearTimeout;
      const signalListener = () => {
        clear(timeoutId);
        rejectFunction(createAbortError());
      };
      const cleanup = () => {
        if (signal) {
          signal.removeEventListener("abort", signalListener);
        }
      };
      const delayPromise = new Promise((resolve, reject) => {
        settle = () => {
          cleanup();
          resolve(value);
        };
        rejectFunction = reject;
        timeoutId = (defaultSet ?? setTimeout)(settle, milliseconds);
      });
      if (signal) {
        signal.addEventListener("abort", signalListener, { once: true });
      }
      clearMethods.set(delayPromise, () => {
        clear(timeoutId);
        timeoutId = null;
        settle();
      });
      return delayPromise;
    };
  }
  const delay = createDelay();
  function initToSimplifiedChinese() {
    addToggleGmCommand();
    addToogleUiButton();
    jq(() => {
      requestIdleCallback(() => {
        startTransform();
      });
    });
  }
  function startTransform() {
    if (!settings.simplifyPages) return;
    return handleRoot(document);
  }
  const TO_SC_IGNORE_ATTR_NAME = `data-${APP_NAME}-to-sc-ignore`;
  function handleRoot(rootNode) {
    if (!rootNode) return;
    traverse(rootNode, actionOnNode);
    const debouncedFn = lodash.debounce(() => traverse(document.body, actionOnNode), 200);
    const ob = new MutationObserver(() => {
      debouncedFn();
    });
    ob.observe(rootNode, {
      subtree: true,
      childList: true
    });
  }
  var TraveseResult = ((TraveseResult2) => {
    TraveseResult2[TraveseResult2["Continue"] = 0] = "Continue";
    TraveseResult2[TraveseResult2["Stop"] = 1] = "Stop";
    return TraveseResult2;
  })(TraveseResult || {});
  function traverse(node2, action) {
    if (!node2) return;
    const result = action(node2);
    if (!actionResultCache.has(node2)) {
      actionResultCache.set(node2, result);
    }
    if (result === 1) {
      return;
    }
    node2 == null ? void 0 : node2.childNodes.forEach((node22) => {
      traverse(node22, action);
    });
  }
  const actionResultCache = /* @__PURE__ */ new WeakMap();
  const inForum = location.pathname.startsWith("/forum/");
  const searchParams = new URLSearchParams(location.search);
  const inForumPostDetail = location.pathname === "/forum/forum.php" && searchParams.get("mod") === "viewthread";
  const forumPostDetailBlacklist = [
    "#thread_subject",
    "div.t_fsz",
    "div.pstl"
  ];
  function actionOnNode(node2) {
    if (!node2) return;
    if (actionResultCache.has(node2)) {
      return actionResultCache.get(node2);
    }
    const _simplify = (val, setter) => {
      if (!val) return;
      const newVal = toSimplifiedChinese(val);
      if (newVal !== val) {
        setter(newVal);
      }
    };
    if (node2.nodeType === Node.TEXT_NODE) {
      if (!node2.textContent) return;
      if (!node2.textContent.trim()) return;
      _simplify(node2.textContent, (val) => node2.textContent = val);
    } else if (node2.nodeType === Node.ELEMENT_NODE) {
      const el = node2;
      const tagName = el.tagName.toLowerCase();
      if (inForumPostDetail) {
        if (forumPostDetailBlacklist.some((s2) => el.matches(s2))) {
          return 1;
        }
      }
      if (tagName === "input" || tagName === "textarea") {
        const input = node2;
        _simplify(input.placeholder, (val) => input.placeholder = val);
      }
      if (tagName === "script" || tagName === "style") {
        return 1;
      }
      if (el.hasAttribute(TO_SC_IGNORE_ATTR_NAME)) {
        return 1;
      }
    }
  }
  const label = "全站转「简体汉字」";
  async function _toggleAction() {
    settings.simplifyPages = !settings.simplifyPages;
    if (settings.simplifyPages) {
      antd.message.success(`${label}: 已生效`, 1);
      startTransform();
    } else {
      antd.message.warning(`${label}: 已禁用, 即将刷新页面~`);
      await delay(1e3);
      location.reload();
    }
  }
  function addToggleGmCommand() {
    GM_registerMenuCommand(label, (e2) => _toggleAction());
  }
  function addToogleUiButton() {
    var _a;
    const rootEl = document.createElement("span");
    rootEl.classList.add("javbus-guide-toggle-to-sc");
    {
      if (inForum) {
        const parent = document.querySelector("#toptb.jav-nav");
        (_a = parent == null ? void 0 : parent.firstElementChild) == null ? void 0 : _a.appendChild(rootEl);
      } else {
        const el = jq("#navbar .nav.navbar-nav:not(.navbar-right)").eq(-1)[0];
        el == null ? void 0 : el.insertAdjacentElement("afterend", rootEl);
      }
    }
    const root2 = createRoot(rootEl);
    root2.render(
      jsx(AntdAppWrapper, { children: jsx(ToggleToScUi, {}) })
    );
  }
  function ToggleToScUi() {
    const { simplifyPages } = useSettingsSnapshot();
    return jsxs(
      "span",
      {
        css: css$1`
        height: 50px;
        display: inline-flex;
        align-items: center;
        margin-left: 20px;
      `,
        children: [
          "简体",
          jsx(
            antd.Switch,
            {
              css: css$1`
          margin-left: 3px;
        `,
              checked: simplifyPages,
              onChange: () => {
                _toggleAction();
              }
            }
          )
        ]
      }
    );
  }
  main();
  async function main() {
    initSettingsUi();
    initToSimplifiedChinese();
    initFilter();
    initForum();
  }

})(_, React, antd, antd.locales.zh_CN, ReactDOM, $, dayjs);