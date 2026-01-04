// ==UserScript==
// @name       github-issues-wiki
// @namespace  npm/vite-plugin-monkey
// @version    0.0.1
// @description github issues viewer
// @author     monkey
// @icon       https://vitejs.dev/logo.svg
// @match      https://github.com/*
// @require    https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472555/github-issues-wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/472555/github-issues-wiki.meta.js
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=t,document.head.append(e)})(" :root.issue-active{padding-left:250px}#app{width:250px;height:100%;text-align:center;position:fixed;left:0;top:0;z-index:999;display:none}#app.active{display:block}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{border-radius:3px;background:rgba(0,0,0,.06);-webkit-box-shadow:inset 0 0 5px rgba(0,0,0,.08)}::-webkit-scrollbar-thumb{border-radius:3px;background:rgba(0,0,0,.12);-webkit-box-shadow:inset 0 0 10px rgba(0,0,0,.2)}.item-inner[data-v-8ef0fbfc]{text-align:left;border-top:1px solid gray;padding:10px 0}.item-inner .head[data-v-8ef0fbfc]{font-weight:500;display:flex;flex-direction:row}.item-inner .index[data-v-8ef0fbfc]{margin-right:3px}.item-inner .name[data-v-8ef0fbfc]{margin-left:5px;word-break:break-all;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}.item-inner .desc[data-v-8ef0fbfc]{padding-top:.5em;text-align:justify}.item-inner[data-v-8ef0fbfc]:hover{background-color:#dcffff;cursor:default}.list-infinite[data-v-8e8d3fd2]{width:100%;height:100%;border:2px solid;border-radius:3px;overflow-y:scroll;max-height:100%;border-color:#696969;position:relative;background-color:#fff;padding-left:5px;padding-right:5px}.list-infinite .list-item-infinite[data-v-8e8d3fd2]{display:flex;align-items:center;padding:1em;border-bottom:1px solid;border-color:#d3d3d3}.list-infinite .loader[data-v-8e8d3fd2]{margin-top:5px;letter-spacing:3px} ");

(function (vue) {
  'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) {
        symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }
      keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      if (i % 2) {
        ownKeys(Object(source), true).forEach(function(key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function(key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }
    return target;
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
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr))
      return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null)
      return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o)
      return;
    if (typeof o === "string")
      return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor)
      n = o.constructor.name;
    if (n === "Map" || n === "Set")
      return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length)
      len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++)
      arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var DIRECTION_TYPE = {
    FRONT: "FRONT",
    // scroll up or left
    BEHIND: "BEHIND"
    // scroll down or right
  };
  var CALC_TYPE = {
    INIT: "INIT",
    FIXED: "FIXED",
    DYNAMIC: "DYNAMIC"
  };
  var LEADING_BUFFER = 2;
  var Virtual = /* @__PURE__ */ function() {
    function Virtual2(param, callUpdate) {
      _classCallCheck(this, Virtual2);
      this.init(param, callUpdate);
    }
    _createClass(Virtual2, [{
      key: "init",
      value: function init(param, callUpdate) {
        this.param = param;
        this.callUpdate = callUpdate;
        this.sizes = /* @__PURE__ */ new Map();
        this.firstRangeTotalSize = 0;
        this.firstRangeAverageSize = 0;
        this.lastCalcIndex = 0;
        this.fixedSizeValue = 0;
        this.calcType = CALC_TYPE.INIT;
        this.offset = 0;
        this.direction = "";
        this.range = /* @__PURE__ */ Object.create(null);
        if (param) {
          this.checkRange(0, param.keeps - 1);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.init(null, null);
      }
      // return current render range
    }, {
      key: "getRange",
      value: function getRange() {
        var range = /* @__PURE__ */ Object.create(null);
        range.start = this.range.start;
        range.end = this.range.end;
        range.padFront = this.range.padFront;
        range.padBehind = this.range.padBehind;
        return range;
      }
    }, {
      key: "isBehind",
      value: function isBehind() {
        return this.direction === DIRECTION_TYPE.BEHIND;
      }
    }, {
      key: "isFront",
      value: function isFront() {
        return this.direction === DIRECTION_TYPE.FRONT;
      }
      // return start index offset
    }, {
      key: "getOffset",
      value: function getOffset(start) {
        return (start < 1 ? 0 : this.getIndexOffset(start)) + this.param.slotHeaderSize;
      }
    }, {
      key: "updateParam",
      value: function updateParam(key, value) {
        var _this = this;
        if (this.param && key in this.param) {
          if (key === "uniqueIds") {
            this.sizes.forEach(function(v, key2) {
              if (!value.includes(key2)) {
                _this.sizes["delete"](key2);
              }
            });
          }
          this.param[key] = value;
        }
      }
      // save each size map by id
    }, {
      key: "saveSize",
      value: function saveSize(id, size) {
        this.sizes.set(id, size);
        if (this.calcType === CALC_TYPE.INIT) {
          this.fixedSizeValue = size;
          this.calcType = CALC_TYPE.FIXED;
        } else if (this.calcType === CALC_TYPE.FIXED && this.fixedSizeValue !== size) {
          this.calcType = CALC_TYPE.DYNAMIC;
          delete this.fixedSizeValue;
        }
        if (this.calcType !== CALC_TYPE.FIXED && typeof this.firstRangeTotalSize !== "undefined") {
          if (this.sizes.size < Math.min(this.param.keeps, this.param.uniqueIds.length)) {
            this.firstRangeTotalSize = _toConsumableArray(this.sizes.values()).reduce(function(acc, val) {
              return acc + val;
            }, 0);
            this.firstRangeAverageSize = Math.round(this.firstRangeTotalSize / this.sizes.size);
          } else {
            delete this.firstRangeTotalSize;
          }
        }
      }
      // in some special situation (e.g. length change) we need to update in a row
      // try goiong to render next range by a leading buffer according to current direction
    }, {
      key: "handleDataSourcesChange",
      value: function handleDataSourcesChange() {
        var start = this.range.start;
        if (this.isFront()) {
          start = start - LEADING_BUFFER;
        } else if (this.isBehind()) {
          start = start + LEADING_BUFFER;
        }
        start = Math.max(start, 0);
        this.updateRange(this.range.start, this.getEndByStart(start));
      }
      // when slot size change, we also need force update
    }, {
      key: "handleSlotSizeChange",
      value: function handleSlotSizeChange() {
        this.handleDataSourcesChange();
      }
      // calculating range on scroll
    }, {
      key: "handleScroll",
      value: function handleScroll(offset) {
        this.direction = offset < this.offset ? DIRECTION_TYPE.FRONT : DIRECTION_TYPE.BEHIND;
        this.offset = offset;
        if (!this.param) {
          return;
        }
        if (this.direction === DIRECTION_TYPE.FRONT) {
          this.handleFront();
        } else if (this.direction === DIRECTION_TYPE.BEHIND) {
          this.handleBehind();
        }
      }
      // ----------- public method end -----------
    }, {
      key: "handleFront",
      value: function handleFront() {
        var overs = this.getScrollOvers();
        if (overs > this.range.start) {
          return;
        }
        var start = Math.max(overs - this.param.buffer, 0);
        this.checkRange(start, this.getEndByStart(start));
      }
    }, {
      key: "handleBehind",
      value: function handleBehind() {
        var overs = this.getScrollOvers();
        if (overs < this.range.start + this.param.buffer) {
          return;
        }
        this.checkRange(overs, this.getEndByStart(overs));
      }
      // return the pass overs according to current scroll offset
    }, {
      key: "getScrollOvers",
      value: function getScrollOvers() {
        var offset = this.offset - this.param.slotHeaderSize;
        if (offset <= 0) {
          return 0;
        }
        if (this.isFixedType()) {
          return Math.floor(offset / this.fixedSizeValue);
        }
        var low = 0;
        var middle = 0;
        var middleOffset = 0;
        var high = this.param.uniqueIds.length;
        while (low <= high) {
          middle = low + Math.floor((high - low) / 2);
          middleOffset = this.getIndexOffset(middle);
          if (middleOffset === offset) {
            return middle;
          } else if (middleOffset < offset) {
            low = middle + 1;
          } else if (middleOffset > offset) {
            high = middle - 1;
          }
        }
        return low > 0 ? --low : 0;
      }
      // return a scroll offset from given index, can efficiency be improved more here?
      // although the call frequency is very high, its only a superposition of numbers
    }, {
      key: "getIndexOffset",
      value: function getIndexOffset(givenIndex) {
        if (!givenIndex) {
          return 0;
        }
        var offset = 0;
        var indexSize = 0;
        for (var index = 0; index < givenIndex; index++) {
          indexSize = this.sizes.get(this.param.uniqueIds[index]);
          offset = offset + (typeof indexSize === "number" ? indexSize : this.getEstimateSize());
        }
        this.lastCalcIndex = Math.max(this.lastCalcIndex, givenIndex - 1);
        this.lastCalcIndex = Math.min(this.lastCalcIndex, this.getLastIndex());
        return offset;
      }
      // is fixed size type
    }, {
      key: "isFixedType",
      value: function isFixedType() {
        return this.calcType === CALC_TYPE.FIXED;
      }
      // return the real last index
    }, {
      key: "getLastIndex",
      value: function getLastIndex() {
        return this.param.uniqueIds.length - 1;
      }
      // in some conditions range is broke, we need correct it
      // and then decide whether need update to next range
    }, {
      key: "checkRange",
      value: function checkRange(start, end) {
        var keeps = this.param.keeps;
        var total = this.param.uniqueIds.length;
        if (total <= keeps) {
          start = 0;
          end = this.getLastIndex();
        } else if (end - start < keeps - 1) {
          start = end - keeps + 1;
        }
        if (this.range.start !== start) {
          this.updateRange(start, end);
        }
      }
      // setting to a new range and rerender
    }, {
      key: "updateRange",
      value: function updateRange(start, end) {
        this.range.start = start;
        this.range.end = end;
        this.range.padFront = this.getPadFront();
        this.range.padBehind = this.getPadBehind();
        this.callUpdate(this.getRange());
      }
      // return end base on start
    }, {
      key: "getEndByStart",
      value: function getEndByStart(start) {
        var theoryEnd = start + this.param.keeps - 1;
        var truelyEnd = Math.min(theoryEnd, this.getLastIndex());
        return truelyEnd;
      }
      // return total front offset
    }, {
      key: "getPadFront",
      value: function getPadFront() {
        if (this.isFixedType()) {
          return this.fixedSizeValue * this.range.start;
        } else {
          return this.getIndexOffset(this.range.start);
        }
      }
      // return total behind offset
    }, {
      key: "getPadBehind",
      value: function getPadBehind() {
        var end = this.range.end;
        var lastIndex = this.getLastIndex();
        if (this.isFixedType()) {
          return (lastIndex - end) * this.fixedSizeValue;
        }
        if (this.lastCalcIndex === lastIndex) {
          return this.getIndexOffset(lastIndex) - this.getIndexOffset(end);
        } else {
          return (lastIndex - end) * this.getEstimateSize();
        }
      }
      // get the item estimate size
    }, {
      key: "getEstimateSize",
      value: function getEstimateSize() {
        return this.isFixedType() ? this.fixedSizeValue : this.firstRangeAverageSize || this.param.estimateSize;
      }
    }]);
    return Virtual2;
  }();
  var VirtualProps = {
    dataKey: {
      type: [String, Function],
      required: true
    },
    dataSources: {
      type: Array,
      required: true,
      "default": function _default() {
        return [];
      }
    },
    dataComponent: {
      type: [Object, Function],
      required: true
    },
    keeps: {
      type: Number,
      "default": 30
    },
    extraProps: {
      type: Object
    },
    estimateSize: {
      type: Number,
      "default": 50
    },
    direction: {
      type: String,
      "default": "vertical"
      // the other value is horizontal
    },
    start: {
      type: Number,
      "default": 0
    },
    offset: {
      type: Number,
      "default": 0
    },
    topThreshold: {
      type: Number,
      "default": 0
    },
    bottomThreshold: {
      type: Number,
      "default": 0
    },
    pageMode: {
      type: Boolean,
      "default": false
    },
    rootTag: {
      type: String,
      "default": "div"
    },
    wrapTag: {
      type: String,
      "default": "div"
    },
    wrapClass: {
      type: String,
      "default": "wrap"
    },
    wrapStyle: {
      type: Object
    },
    itemTag: {
      type: String,
      "default": "div"
    },
    itemClass: {
      type: String,
      "default": ""
    },
    itemClassAdd: {
      type: Function
    },
    itemStyle: {
      type: Object
    },
    headerTag: {
      type: String,
      "default": "div"
    },
    headerClass: {
      type: String,
      "default": ""
    },
    headerStyle: {
      type: Object
    },
    footerTag: {
      type: String,
      "default": "div"
    },
    footerClass: {
      type: String,
      "default": ""
    },
    footerStyle: {
      type: Object
    },
    itemScopedSlots: {
      type: Object
    }
  };
  var ItemProps = {
    index: {
      type: Number
    },
    event: {
      type: String
    },
    tag: {
      type: String
    },
    horizontal: {
      type: Boolean
    },
    source: {
      type: Object
    },
    component: {
      type: [Object, Function]
    },
    uniqueKey: {
      type: [String, Number]
    },
    extraProps: {
      type: Object
    },
    scopedSlots: {
      type: Object
    }
  };
  var SlotProps = {
    event: {
      type: String
    },
    uniqueKey: {
      type: String
    },
    tag: {
      type: String
    },
    horizontal: {
      type: Boolean
    }
  };
  var useResizeChange = function useResizeChange2(props, rootRef, emit) {
    var resizeObserver = null;
    var shapeKey = vue.computed(function() {
      return props.horizontal ? "offsetWidth" : "offsetHeight";
    });
    var getCurrentSize = function getCurrentSize2() {
      return rootRef.value ? rootRef.value[shapeKey.value] : 0;
    };
    var dispatchSizeChange = function dispatchSizeChange2() {
      var event = props.event, uniqueKey = props.uniqueKey, hasInitial = props.hasInitial;
      emit(event, uniqueKey, getCurrentSize(), hasInitial);
    };
    vue.onMounted(function() {
      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(function() {
          dispatchSizeChange();
        });
        rootRef.value && resizeObserver.observe(rootRef.value);
      }
    });
    vue.onUpdated(function() {
      dispatchSizeChange();
    });
    vue.onUnmounted(function() {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    });
  };
  var Item$1 = vue.defineComponent({
    name: "VirtualListItem",
    props: ItemProps,
    emits: ["itemResize"],
    setup: function setup(props, _ref) {
      var emit = _ref.emit;
      var rootRef = vue.ref(null);
      useResizeChange(props, rootRef, emit);
      return function() {
        var Tag = props.tag, Comp = props.component, _props$extraProps = props.extraProps, extraProps = _props$extraProps === void 0 ? {} : _props$extraProps, index = props.index, source = props.source, _props$scopedSlots = props.scopedSlots, scopedSlots = _props$scopedSlots === void 0 ? {} : _props$scopedSlots, uniqueKey = props.uniqueKey;
        var mergedProps = _objectSpread2(_objectSpread2({}, extraProps), {}, {
          source,
          index
        });
        return vue.createVNode(Tag, {
          "key": uniqueKey,
          "ref": rootRef
        }, {
          "default": function _default2() {
            return [vue.createVNode(Comp, _objectSpread2(_objectSpread2({}, mergedProps), {}, {
              "scopedSlots": scopedSlots
            }), null)];
          }
        });
      };
    }
  });
  var Slot = vue.defineComponent({
    name: "VirtualListSlot",
    props: SlotProps,
    emits: ["slotResize"],
    setup: function setup2(props, _ref2) {
      var slots = _ref2.slots, emit = _ref2.emit;
      var rootRef = vue.ref(null);
      useResizeChange(props, rootRef, emit);
      return function() {
        var _slots$default;
        var Tag = props.tag, uniqueKey = props.uniqueKey;
        return vue.createVNode(Tag, {
          "ref": rootRef,
          "key": uniqueKey
        }, {
          "default": function _default2() {
            return [(_slots$default = slots["default"]) === null || _slots$default === void 0 ? void 0 : _slots$default.call(slots)];
          }
        });
      };
    }
  });
  var EVENT_TYPE;
  (function(EVENT_TYPE2) {
    EVENT_TYPE2["ITEM"] = "itemResize";
    EVENT_TYPE2["SLOT"] = "slotResize";
  })(EVENT_TYPE || (EVENT_TYPE = {}));
  var SLOT_TYPE;
  (function(SLOT_TYPE2) {
    SLOT_TYPE2["HEADER"] = "thead";
    SLOT_TYPE2["FOOTER"] = "tfoot";
  })(SLOT_TYPE || (SLOT_TYPE = {}));
  var VirtualList = vue.defineComponent({
    name: "VirtualList",
    props: VirtualProps,
    setup: function setup3(props, _ref) {
      var emit = _ref.emit, slots = _ref.slots, expose = _ref.expose;
      var isHorizontal = props.direction === "horizontal";
      var directionKey = isHorizontal ? "scrollLeft" : "scrollTop";
      var range = vue.ref(null);
      var root = vue.ref();
      var shepherd = vue.ref(null);
      var virtual;
      vue.watch(function() {
        return props.dataSources.length;
      }, function() {
        virtual.updateParam("uniqueIds", getUniqueIdFromDataSources());
        virtual.handleDataSourcesChange();
      });
      vue.watch(function() {
        return props.keeps;
      }, function(newValue) {
        virtual.updateParam("keeps", newValue);
        virtual.handleSlotSizeChange();
      });
      vue.watch(function() {
        return props.start;
      }, function(newValue) {
        scrollToIndex(newValue);
      });
      vue.watch(function() {
        return props.offset;
      }, function(newValue) {
        return scrollToOffset(newValue);
      });
      var getSize = function getSize2(id) {
        return virtual.sizes.get(id);
      };
      var getOffset = function getOffset2() {
        if (props.pageMode) {
          return document.documentElement[directionKey] || document.body[directionKey];
        } else {
          return root.value ? Math.ceil(root.value[directionKey]) : 0;
        }
      };
      var getClientSize = function getClientSize2() {
        var key = isHorizontal ? "clientWidth" : "clientHeight";
        if (props.pageMode) {
          return document.documentElement[key] || document.body[key];
        } else {
          return root.value ? Math.ceil(root.value[key]) : 0;
        }
      };
      var getScrollSize = function getScrollSize2() {
        var key = isHorizontal ? "scrollWidth" : "scrollHeight";
        if (props.pageMode) {
          return document.documentElement[key] || document.body[key];
        } else {
          return root.value ? Math.ceil(root.value[key]) : 0;
        }
      };
      var emitEvent = function emitEvent2(offset, clientSize, scrollSize, evt) {
        emit("scroll", evt, virtual.getRange());
        if (virtual.isFront() && !!props.dataSources.length && offset - props.topThreshold <= 0) {
          emit("totop");
        } else if (virtual.isBehind() && offset + clientSize + props.bottomThreshold >= scrollSize) {
          emit("tobottom");
        }
      };
      var onScroll = function onScroll2(evt) {
        var offset = getOffset();
        var clientSize = getClientSize();
        var scrollSize = getScrollSize();
        if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) {
          return;
        }
        virtual.handleScroll(offset);
        emitEvent(offset, clientSize, scrollSize, evt);
      };
      var getUniqueIdFromDataSources = function getUniqueIdFromDataSources2() {
        var dataKey = props.dataKey, _props$dataSources = props.dataSources, dataSources = _props$dataSources === void 0 ? [] : _props$dataSources;
        return dataSources.map(function(dataSource) {
          return typeof dataKey === "function" ? dataKey(dataSource) : dataSource[dataKey];
        });
      };
      var onRangeChanged = function onRangeChanged2(newRange) {
        range.value = newRange;
      };
      var installVirtual = function installVirtual2() {
        virtual = new Virtual({
          slotHeaderSize: 0,
          slotFooterSize: 0,
          keeps: props.keeps,
          estimateSize: props.estimateSize,
          buffer: Math.round(props.keeps / 3),
          // recommend for a third of keeps
          uniqueIds: getUniqueIdFromDataSources()
        }, onRangeChanged);
        range.value = virtual.getRange();
      };
      var scrollToIndex = function scrollToIndex2(index) {
        if (index >= props.dataSources.length - 1) {
          scrollToBottom();
        } else {
          var offset = virtual.getOffset(index);
          scrollToOffset(offset);
        }
      };
      var scrollToOffset = function scrollToOffset2(offset) {
        if (props.pageMode) {
          document.body[directionKey] = offset;
          document.documentElement[directionKey] = offset;
        } else {
          if (root.value) {
            root.value[directionKey] = offset;
          }
        }
      };
      var getRenderSlots = function getRenderSlots2() {
        var slots2 = [];
        var _range$value = range.value, start = _range$value.start, end = _range$value.end;
        var dataSources = props.dataSources, dataKey = props.dataKey, itemClass = props.itemClass, itemTag = props.itemTag, itemStyle = props.itemStyle, extraProps = props.extraProps, dataComponent = props.dataComponent, itemScopedSlots = props.itemScopedSlots;
        for (var index = start; index <= end; index++) {
          var dataSource = dataSources[index];
          if (dataSource) {
            var uniqueKey = typeof dataKey === "function" ? dataKey(dataSource) : dataSource[dataKey];
            if (typeof uniqueKey === "string" || typeof uniqueKey === "number") {
              slots2.push(vue.createVNode(Item$1, {
                "index": index,
                "tag": itemTag,
                "event": EVENT_TYPE.ITEM,
                "horizontal": isHorizontal,
                "uniqueKey": uniqueKey,
                "source": dataSource,
                "extraProps": extraProps,
                "component": dataComponent,
                "scopedSlots": itemScopedSlots,
                "style": itemStyle,
                "class": "".concat(itemClass).concat(props.itemClassAdd ? " " + props.itemClassAdd(index) : ""),
                "onItemResize": onItemResized
              }, null));
            } else {
              console.warn("Cannot get the data-key '".concat(dataKey, "' from data-sources."));
            }
          } else {
            console.warn("Cannot get the index '".concat(index, "' from data-sources."));
          }
        }
        return slots2;
      };
      var onItemResized = function onItemResized2(id, size) {
        virtual.saveSize(id, size);
        emit("resized", id, size);
      };
      var onSlotResized = function onSlotResized2(type, size, hasInit) {
        if (type === SLOT_TYPE.HEADER) {
          virtual.updateParam("slotHeaderSize", size);
        } else if (type === SLOT_TYPE.FOOTER) {
          virtual.updateParam("slotFooterSize", size);
        }
        if (hasInit) {
          virtual.handleSlotSizeChange();
        }
      };
      var scrollToBottom = function scrollToBottom2() {
        if (shepherd.value) {
          var offset = shepherd.value[isHorizontal ? "offsetLeft" : "offsetTop"];
          scrollToOffset(offset);
          setTimeout(function() {
            if (getOffset() + getClientSize() < getScrollSize()) {
              scrollToBottom2();
            }
          }, 3);
        }
      };
      var updatePageModeFront = function updatePageModeFront2() {
        if (root.value) {
          var rect = root.value.getBoundingClientRect();
          var defaultView = root.value.ownerDocument.defaultView;
          var offsetFront = isHorizontal ? rect.left + defaultView.pageXOffset : rect.top + defaultView.pageYOffset;
          virtual.updateParam("slotHeaderSize", offsetFront);
        }
      };
      var getSizes = function getSizes2() {
        return virtual.sizes.size;
      };
      vue.onBeforeMount(function() {
        installVirtual();
      });
      vue.onActivated(function() {
        scrollToOffset(virtual.offset);
      });
      vue.onMounted(function() {
        if (props.start) {
          scrollToIndex(props.start);
        } else if (props.offset) {
          scrollToOffset(props.offset);
        }
        if (props.pageMode) {
          updatePageModeFront();
          document.addEventListener("scroll", onScroll, {
            passive: false
          });
        }
      });
      vue.onUnmounted(function() {
        virtual.destroy();
        if (props.pageMode) {
          document.removeEventListener("scroll", onScroll);
        }
      });
      expose({
        scrollToBottom,
        getSizes,
        getSize,
        getOffset,
        getScrollSize,
        getClientSize,
        scrollToOffset,
        scrollToIndex
      });
      return function() {
        var pageMode = props.pageMode, RootTag = props.rootTag, WrapTag = props.wrapTag, wrapClass = props.wrapClass, wrapStyle = props.wrapStyle, headerTag = props.headerTag, headerClass = props.headerClass, headerStyle = props.headerStyle, footerTag = props.footerTag, footerClass = props.footerClass, footerStyle = props.footerStyle;
        var _ref2 = range.value, padFront = _ref2.padFront, padBehind = _ref2.padBehind;
        var paddingStyle = {
          padding: isHorizontal ? "0px ".concat(padBehind, "px 0px ").concat(padFront, "px") : "".concat(padFront, "px 0px ").concat(padBehind, "px")
        };
        var wrapperStyle = wrapStyle ? Object.assign({}, wrapStyle, paddingStyle) : paddingStyle;
        var header = slots.header, footer = slots.footer;
        return vue.createVNode(RootTag, {
          "ref": root,
          "onScroll": !pageMode && onScroll
        }, {
          "default": function _default2() {
            return [header && vue.createVNode(Slot, {
              "class": headerClass,
              "style": headerStyle,
              "tag": headerTag,
              "event": EVENT_TYPE.SLOT,
              "uniqueKey": SLOT_TYPE.HEADER,
              "onSlotResize": onSlotResized
            }, {
              "default": function _default3() {
                return [header()];
              }
            }), vue.createVNode(WrapTag, {
              "class": wrapClass,
              "style": wrapperStyle
            }, {
              "default": function _default3() {
                return [getRenderSlots()];
              }
            }), footer && vue.createVNode(Slot, {
              "class": footerClass,
              "style": footerStyle,
              "tag": footerTag,
              "event": EVENT_TYPE.SLOT,
              "uniqueKey": SLOT_TYPE.FOOTER,
              "onSlotResize": onSlotResized
            }, {
              "default": function _default3() {
                return [footer()];
              }
            }), vue.createVNode("div", {
              "ref": shepherd,
              "style": {
                width: isHorizontal ? "0px" : "100%",
                height: isHorizontal ? "100%" : "0px"
              }
            }, null)];
          }
        });
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$1 = { class: "head" };
  const _hoisted_2 = { class: "index" };
  const _hoisted_3 = ["title"];
  const _sfc_main$2 = {
    __name: "Item",
    props: {
      source: {
        type: Object,
        default: () => ({})
      }
    },
    setup(__props) {
      const props = __props;
      const handleClick = () => {
        const url = props.source.url;
        const parser = new DOMParser();
        const oldTopo = document.getElementsByClassName("list-infinite")[0].scrollTop;
        fetch(url).then(function(response) {
          return response.text();
        }).then(function(html) {
          const doc = parser.parseFromString(html, "text/html");
          const app = document.getElementById("app");
          document.body = doc.body;
          document.body.appendChild(app);
          document.getElementsByClassName("list-infinite")[0].scrollTop = oldTopo;
        }).catch(function(error) {
          console.error("Failed to load issue:", error);
        });
        history.pushState({}, "", url);
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "item-inner",
          onClick: handleClick
        }, [
          vue.createElementVNode("div", _hoisted_1$1, [
            vue.createElementVNode("div", _hoisted_2, vue.toDisplayString(__props.source.index), 1),
            vue.createElementVNode("div", {
              class: "name",
              title: __props.source.text
            }, vue.toDisplayString(__props.source.text), 9, _hoisted_3)
          ])
        ]);
      };
    }
  };
  const Item = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-8ef0fbfc"]]);
  const _withScopeId = (n) => (vue.pushScopeId("data-v-8e8d3fd2"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "loader" }, "已经到底了", -1));
  const _sfc_main$1 = {
    __name: "IssueSidebar",
    setup(__props) {
      let currentPage = 1;
      let hasFinished = vue.ref(false);
      const listData = vue.ref([]);
      const onScrollToTop = () => {
        console.log("at top");
      };
      const onScrollToBottom = () => {
        console.log("at bottom");
        requestData();
      };
      vue.onMounted(() => {
        requestData();
      });
      function requestData() {
        const url = `https://github.com${window.location.pathname.replace(/\/issues\/.*/, "/issues")}?page=${currentPage}&q=is%3Aissue`;
        fetch(url).then(function(response) {
          return response.text();
        }).then(function(html) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const issueLinks = doc.querySelectorAll(".js-navigation-open");
          const len = listData.value.length;
          if (!issueLinks.length) {
            hasFinished.value = true;
          } else {
            listData.value = listData.value.concat(Array.from(issueLinks).map((v, i) => {
              return {
                index: len + i + 1,
                text: v.innerText,
                url: v.href
              };
            }));
            currentPage++;
          }
        }).catch(function(error) {
          console.error("Failed to load issues:", error);
        });
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(VirtualList), {
          class: "list-infinite",
          "data-key": "index",
          "data-sources": listData.value,
          "data-component": Item,
          "estimate-size": 70,
          "item-class": "list-item-infinite",
          "footer-class": "loader-wrapper",
          onTotop: onScrollToTop,
          onTobottom: onScrollToBottom
        }, vue.createSlots({ _: 2 }, [
          vue.unref(hasFinished) ? {
            name: "footer",
            fn: vue.withCtx(() => [
              _hoisted_1
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["data-sources"]);
      };
    }
  };
  const IssueSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-8e8d3fd2"]]);
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      let tamp = null;
      let currentUrl = "";
      const showIssueTab = vue.ref(false);
      const reg = /\/issues/;
      vue.onMounted(() => {
        tamp = setInterval(function() {
          if (window.location.href !== currentUrl) {
            console.log("URL发生变化");
            if (reg.test(window.location.href)) {
              showIssueTab.value = true;
              document.documentElement.classList.add("issue-active");
              document.getElementById("app").classList.add("active");
            } else {
              showIssueTab.value = false;
              document.documentElement.classList.remove("issue-active");
              document.getElementById("app").classList.remove("active");
            }
            currentUrl = window.location.href;
          }
        }, 500);
      });
      vue.onUnmounted(() => {
        clearInterval(tamp);
      });
      return (_ctx, _cache) => {
        return showIssueTab.value ? (vue.openBlock(), vue.createBlock(IssueSidebar, { key: 0 })) : vue.createCommentVNode("", true);
      };
    }
  };
  vue.createApp(_sfc_main).mount(
    (() => {
      const app = document.createElement("div");
      app.id = "app";
      document.body.append(app);
      return app;
    })()
  );

})(Vue);
