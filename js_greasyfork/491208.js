// ==UserScript==
// @name         98Tang助手
// @namespace    npm/vite-plugin-monkey
// @version      0.0.1
// @author       monkey
// @description  98tang助手
// @icon         https://sehuatang.net/favicon.ico
// @match        https://sehuatang.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491208/98Tang%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/491208/98Tang%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const p=document.createElement("style");p.textContent=o,document.head.append(p)})(" /*! PhotoSwipe main CSS by Dmytro Semenov | photoswipe.com */.pswp{--pswp-bg: #000;--pswp-placeholder-bg: #222;--pswp-root-z-index: 100000;--pswp-preloader-color: rgba(79, 79, 79, .4);--pswp-preloader-color-secondary: rgba(255, 255, 255, .9);--pswp-icon-color: #fff;--pswp-icon-color-secondary: #4f4f4f;--pswp-icon-stroke-color: #4f4f4f;--pswp-icon-stroke-width: 2px;--pswp-error-text-color: var(--pswp-icon-color)}.pswp{position:fixed;top:0;left:0;width:100%;height:100%;z-index:var(--pswp-root-z-index);display:none;touch-action:none;outline:0;opacity:.003;contain:layout style size;-webkit-tap-highlight-color:rgba(0,0,0,0)}.pswp:focus{outline:0}.pswp *{box-sizing:border-box}.pswp img{max-width:none}.pswp--open{display:block}.pswp,.pswp__bg{transform:translateZ(0);will-change:opacity}.pswp__bg{opacity:.005;background:var(--pswp-bg)}.pswp,.pswp__scroll-wrap{overflow:hidden}.pswp__scroll-wrap,.pswp__bg,.pswp__container,.pswp__item,.pswp__content,.pswp__img,.pswp__zoom-wrap{position:absolute;top:0;left:0;width:100%;height:100%}.pswp__img,.pswp__zoom-wrap{width:auto;height:auto}.pswp--click-to-zoom.pswp--zoom-allowed .pswp__img{cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img{cursor:move;cursor:-webkit-grab;cursor:-moz-grab;cursor:grab}.pswp--click-to-zoom.pswp--zoomed-in .pswp__img:active{cursor:-webkit-grabbing;cursor:-moz-grabbing;cursor:grabbing}.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img,.pswp--no-mouse-drag.pswp--zoomed-in .pswp__img:active,.pswp__img{cursor:-webkit-zoom-out;cursor:-moz-zoom-out;cursor:zoom-out}.pswp__container,.pswp__img,.pswp__button,.pswp__counter{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pswp__item{z-index:1;overflow:hidden}.pswp__hidden{display:none!important}.pswp__content{pointer-events:none}.pswp__content>*{pointer-events:auto}.pswp__error-msg-container{display:grid}.pswp__error-msg{margin:auto;font-size:1em;line-height:1;color:var(--pswp-error-text-color)}.pswp .pswp__hide-on-close{opacity:.005;will-change:opacity;transition:opacity var(--pswp-transition-duration) cubic-bezier(.4,0,.22,1);z-index:10;pointer-events:none}.pswp--ui-visible .pswp__hide-on-close{opacity:1;pointer-events:auto}.pswp__button{position:relative;display:block;width:50px;height:60px;padding:0;margin:0;overflow:hidden;cursor:pointer;background:none;border:0;box-shadow:none;opacity:.85;-webkit-appearance:none;-webkit-touch-callout:none}.pswp__button:hover,.pswp__button:active,.pswp__button:focus{transition:none;padding:0;background:none;border:0;box-shadow:none;opacity:1}.pswp__button:disabled{opacity:.3;cursor:auto}.pswp__icn{fill:var(--pswp-icon-color);color:var(--pswp-icon-color-secondary)}.pswp__icn{position:absolute;top:14px;left:9px;width:32px;height:32px;overflow:hidden;pointer-events:none}.pswp__icn-shadow{stroke:var(--pswp-icon-stroke-color);stroke-width:var(--pswp-icon-stroke-width);fill:none}.pswp__icn:focus{outline:0}div.pswp__img--placeholder,.pswp__img--with-bg{background:var(--pswp-placeholder-bg)}.pswp__top-bar{position:absolute;left:0;top:0;width:100%;height:60px;display:flex;flex-direction:row;justify-content:flex-end;z-index:10;pointer-events:none!important}.pswp__top-bar>*{pointer-events:auto;will-change:opacity}.pswp__button--close{margin-right:6px}.pswp__button--arrow{position:absolute;width:75px;height:100px;top:50%;margin-top:-50px}.pswp__button--arrow:disabled{display:none;cursor:default}.pswp__button--arrow .pswp__icn{top:50%;margin-top:-30px;width:60px;height:60px;background:none;border-radius:0}.pswp--one-slide .pswp__button--arrow{display:none}.pswp--touch .pswp__button--arrow{visibility:hidden}.pswp--has_mouse .pswp__button--arrow{visibility:visible}.pswp__button--arrow--prev{right:auto;left:0}.pswp__button--arrow--next{right:0}.pswp__button--arrow--next .pswp__icn{left:auto;right:14px;transform:scaleX(-1)}.pswp__button--zoom{display:none}.pswp--zoom-allowed .pswp__button--zoom{display:block}.pswp--zoomed-in .pswp__zoom-icn-bar-v{display:none}.pswp__preloader{position:relative;overflow:hidden;width:50px;height:60px;margin-right:auto}.pswp__preloader .pswp__icn{opacity:0;transition:opacity .2s linear;animation:pswp-clockwise .6s linear infinite}.pswp__preloader--active .pswp__icn{opacity:.85}@keyframes pswp-clockwise{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.pswp__counter{height:30px;margin-top:15px;margin-inline-start:20px;font-size:14px;line-height:30px;color:var(--pswp-icon-color);text-shadow:1px 1px 3px var(--pswp-icon-color-secondary);opacity:.85}.pswp--one-slide .pswp__counter{display:none} ");

(function () {
  'use strict';

  /*!
    * PhotoSwipe 5.4.3 - https://photoswipe.com
    * (c) 2023 Dmytro Semenov
    */
  function createElement$1(className, tagName, appendToEl) {
    const el = document.createElement(tagName);
    if (className) {
      el.className = className;
    }
    if (appendToEl) {
      appendToEl.appendChild(el);
    }
    return el;
  }
  function equalizePoints(p1, p2) {
    p1.x = p2.x;
    p1.y = p2.y;
    if (p2.id !== void 0) {
      p1.id = p2.id;
    }
    return p1;
  }
  function roundPoint(p) {
    p.x = Math.round(p.x);
    p.y = Math.round(p.y);
  }
  function getDistanceBetween(p1, p2) {
    const x = Math.abs(p1.x - p2.x);
    const y = Math.abs(p1.y - p2.y);
    return Math.sqrt(x * x + y * y);
  }
  function pointsEqual(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
  }
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
  function toTransformString$1(x, y, scale) {
    let propValue = `translate3d(${x}px,${y || 0}px,0)`;
    if (scale !== void 0) {
      propValue += ` scale3d(${scale},${scale},1)`;
    }
    return propValue;
  }
  function setTransform(el, x, y, scale) {
    el.style.transform = toTransformString$1(x, y, scale);
  }
  const defaultCSSEasing = "cubic-bezier(.4,0,.22,1)";
  function setTransitionStyle(el, prop, duration, ease) {
    el.style.transition = prop ? `${prop} ${duration}ms ${ease || defaultCSSEasing}` : "none";
  }
  function setWidthHeight$1(el, w, h) {
    el.style.width = typeof w === "number" ? `${w}px` : w;
    el.style.height = typeof h === "number" ? `${h}px` : h;
  }
  function removeTransitionStyle(el) {
    setTransitionStyle(el);
  }
  function decodeImage(img) {
    if ("decode" in img) {
      return img.decode().catch(() => {
      });
    }
    if (img.complete) {
      return Promise.resolve(img);
    }
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }
  const LOAD_STATE$1 = {
    IDLE: "idle",
    LOADING: "loading",
    LOADED: "loaded",
    ERROR: "error"
  };
  function specialKeyUsed$1(e) {
    return "button" in e && e.button === 1 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
  }
  function getElementsFromOption$1(option, legacySelector, parent = document) {
    let elements = [];
    if (option instanceof Element) {
      elements = [option];
    } else if (option instanceof NodeList || Array.isArray(option)) {
      elements = Array.from(option);
    } else {
      const selector = typeof option === "string" ? option : legacySelector;
      if (selector) {
        elements = Array.from(parent.querySelectorAll(selector));
      }
    }
    return elements;
  }
  function isSafari$1() {
    return !!(navigator.vendor && navigator.vendor.match(/apple/i));
  }
  let supportsPassive = false;
  try {
    window.addEventListener("test", null, Object.defineProperty({}, "passive", {
      get: () => {
        supportsPassive = true;
      }
    }));
  } catch (e) {
  }
  class DOMEvents {
    constructor() {
      this._pool = [];
    }
    /**
     * Adds event listeners
     *
     * @param {PoolItem['target']} target
     * @param {PoolItem['type']} type Can be multiple, separated by space.
     * @param {PoolItem['listener']} listener
     * @param {PoolItem['passive']} [passive]
     */
    add(target, type, listener, passive) {
      this._toggleListener(target, type, listener, passive);
    }
    /**
     * Removes event listeners
     *
     * @param {PoolItem['target']} target
     * @param {PoolItem['type']} type
     * @param {PoolItem['listener']} listener
     * @param {PoolItem['passive']} [passive]
     */
    remove(target, type, listener, passive) {
      this._toggleListener(target, type, listener, passive, true);
    }
    /**
     * Removes all bound events
     */
    removeAll() {
      this._pool.forEach((poolItem) => {
        this._toggleListener(poolItem.target, poolItem.type, poolItem.listener, poolItem.passive, true, true);
      });
      this._pool = [];
    }
    /**
     * Adds or removes event
     *
     * @private
     * @param {PoolItem['target']} target
     * @param {PoolItem['type']} type
     * @param {PoolItem['listener']} listener
     * @param {PoolItem['passive']} [passive]
     * @param {boolean} [unbind] Whether the event should be added or removed
     * @param {boolean} [skipPool] Whether events pool should be skipped
     */
    _toggleListener(target, type, listener, passive, unbind, skipPool) {
      if (!target) {
        return;
      }
      const methodName = unbind ? "removeEventListener" : "addEventListener";
      const types = type.split(" ");
      types.forEach((eType) => {
        if (eType) {
          if (!skipPool) {
            if (unbind) {
              this._pool = this._pool.filter((poolItem) => {
                return poolItem.type !== eType || poolItem.listener !== listener || poolItem.target !== target;
              });
            } else {
              this._pool.push({
                target,
                type: eType,
                listener,
                passive
              });
            }
          }
          const eventOptions = supportsPassive ? {
            passive: passive || false
          } : false;
          target[methodName](eType, listener, eventOptions);
        }
      });
    }
  }
  function getViewportSize$1(options, pswp) {
    if (options.getViewportSizeFn) {
      const newViewportSize = options.getViewportSizeFn(options, pswp);
      if (newViewportSize) {
        return newViewportSize;
      }
    }
    return {
      x: document.documentElement.clientWidth,
      // TODO: height on mobile is very incosistent due to toolbar
      // find a way to improve this
      //
      // document.documentElement.clientHeight - doesn't seem to work well
      y: window.innerHeight
    };
  }
  function parsePaddingOption$1(prop, options, viewportSize, itemData, index) {
    let paddingValue = 0;
    if (options.paddingFn) {
      paddingValue = options.paddingFn(viewportSize, itemData, index)[prop];
    } else if (options.padding) {
      paddingValue = options.padding[prop];
    } else {
      const legacyPropName = "padding" + prop[0].toUpperCase() + prop.slice(1);
      if (options[legacyPropName]) {
        paddingValue = options[legacyPropName];
      }
    }
    return Number(paddingValue) || 0;
  }
  function getPanAreaSize$1(options, viewportSize, itemData, index) {
    return {
      x: viewportSize.x - parsePaddingOption$1("left", options, viewportSize, itemData, index) - parsePaddingOption$1("right", options, viewportSize, itemData, index),
      y: viewportSize.y - parsePaddingOption$1("top", options, viewportSize, itemData, index) - parsePaddingOption$1("bottom", options, viewportSize, itemData, index)
    };
  }
  class PanBounds {
    /**
     * @param {Slide} slide
     */
    constructor(slide) {
      this.slide = slide;
      this.currZoomLevel = 1;
      this.center = /** @type {Point} */
      {
        x: 0,
        y: 0
      };
      this.max = /** @type {Point} */
      {
        x: 0,
        y: 0
      };
      this.min = /** @type {Point} */
      {
        x: 0,
        y: 0
      };
    }
    /**
     * _getItemBounds
     *
     * @param {number} currZoomLevel
     */
    update(currZoomLevel) {
      this.currZoomLevel = currZoomLevel;
      if (!this.slide.width) {
        this.reset();
      } else {
        this._updateAxis("x");
        this._updateAxis("y");
        this.slide.pswp.dispatch("calcBounds", {
          slide: this.slide
        });
      }
    }
    /**
     * _calculateItemBoundsForAxis
     *
     * @param {Axis} axis
     */
    _updateAxis(axis) {
      const {
        pswp
      } = this.slide;
      const elSize = this.slide[axis === "x" ? "width" : "height"] * this.currZoomLevel;
      const paddingProp = axis === "x" ? "left" : "top";
      const padding = parsePaddingOption$1(paddingProp, pswp.options, pswp.viewportSize, this.slide.data, this.slide.index);
      const panAreaSize = this.slide.panAreaSize[axis];
      this.center[axis] = Math.round((panAreaSize - elSize) / 2) + padding;
      this.max[axis] = elSize > panAreaSize ? Math.round(panAreaSize - elSize) + padding : this.center[axis];
      this.min[axis] = elSize > panAreaSize ? padding : this.center[axis];
    }
    // _getZeroBounds
    reset() {
      this.center.x = 0;
      this.center.y = 0;
      this.max.x = 0;
      this.max.y = 0;
      this.min.x = 0;
      this.min.y = 0;
    }
    /**
     * Correct pan position if it's beyond the bounds
     *
     * @param {Axis} axis x or y
     * @param {number} panOffset
     * @returns {number}
     */
    correctPan(axis, panOffset) {
      return clamp(panOffset, this.max[axis], this.min[axis]);
    }
  }
  const MAX_IMAGE_WIDTH$1 = 4e3;
  let ZoomLevel$1 = class ZoomLevel {
    /**
     * @param {PhotoSwipeOptions} options PhotoSwipe options
     * @param {SlideData} itemData Slide data
     * @param {number} index Slide index
     * @param {PhotoSwipe} [pswp] PhotoSwipe instance, can be undefined if not initialized yet
     */
    constructor(options, itemData, index, pswp) {
      this.pswp = pswp;
      this.options = options;
      this.itemData = itemData;
      this.index = index;
      this.panAreaSize = null;
      this.elementSize = null;
      this.fit = 1;
      this.fill = 1;
      this.vFill = 1;
      this.initial = 1;
      this.secondary = 1;
      this.max = 1;
      this.min = 1;
    }
    /**
     * Calculate initial, secondary and maximum zoom level for the specified slide.
     *
     * It should be called when either image or viewport size changes.
     *
     * @param {number} maxWidth
     * @param {number} maxHeight
     * @param {Point} panAreaSize
     */
    update(maxWidth, maxHeight, panAreaSize) {
      const elementSize = {
        x: maxWidth,
        y: maxHeight
      };
      this.elementSize = elementSize;
      this.panAreaSize = panAreaSize;
      const hRatio = panAreaSize.x / elementSize.x;
      const vRatio = panAreaSize.y / elementSize.y;
      this.fit = Math.min(1, hRatio < vRatio ? hRatio : vRatio);
      this.fill = Math.min(1, hRatio > vRatio ? hRatio : vRatio);
      this.vFill = Math.min(1, vRatio);
      this.initial = this._getInitial();
      this.secondary = this._getSecondary();
      this.max = Math.max(this.initial, this.secondary, this._getMax());
      this.min = Math.min(this.fit, this.initial, this.secondary);
      if (this.pswp) {
        this.pswp.dispatch("zoomLevelsUpdate", {
          zoomLevels: this,
          slideData: this.itemData
        });
      }
    }
    /**
     * Parses user-defined zoom option.
     *
     * @private
     * @param {'initial' | 'secondary' | 'max'} optionPrefix Zoom level option prefix (initial, secondary, max)
     * @returns { number | undefined }
     */
    _parseZoomLevelOption(optionPrefix) {
      const optionName = (
        /** @type {'initialZoomLevel' | 'secondaryZoomLevel' | 'maxZoomLevel'} */
        optionPrefix + "ZoomLevel"
      );
      const optionValue = this.options[optionName];
      if (!optionValue) {
        return;
      }
      if (typeof optionValue === "function") {
        return optionValue(this);
      }
      if (optionValue === "fill") {
        return this.fill;
      }
      if (optionValue === "fit") {
        return this.fit;
      }
      return Number(optionValue);
    }
    /**
     * Get zoom level to which image will be zoomed after double-tap gesture,
     * or when user clicks on zoom icon,
     * or mouse-click on image itself.
     * If you return 1 image will be zoomed to its original size.
     *
     * @private
     * @return {number}
     */
    _getSecondary() {
      let currZoomLevel = this._parseZoomLevelOption("secondary");
      if (currZoomLevel) {
        return currZoomLevel;
      }
      currZoomLevel = Math.min(1, this.fit * 3);
      if (this.elementSize && currZoomLevel * this.elementSize.x > MAX_IMAGE_WIDTH$1) {
        currZoomLevel = MAX_IMAGE_WIDTH$1 / this.elementSize.x;
      }
      return currZoomLevel;
    }
    /**
     * Get initial image zoom level.
     *
     * @private
     * @return {number}
     */
    _getInitial() {
      return this._parseZoomLevelOption("initial") || this.fit;
    }
    /**
     * Maximum zoom level when user zooms
     * via zoom/pinch gesture,
     * via cmd/ctrl-wheel or via trackpad.
     *
     * @private
     * @return {number}
     */
    _getMax() {
      return this._parseZoomLevelOption("max") || Math.max(1, this.fit * 4);
    }
  };
  class Slide {
    /**
     * @param {SlideData} data
     * @param {number} index
     * @param {PhotoSwipe} pswp
     */
    constructor(data, index, pswp) {
      this.data = data;
      this.index = index;
      this.pswp = pswp;
      this.isActive = index === pswp.currIndex;
      this.currentResolution = 0;
      this.panAreaSize = {
        x: 0,
        y: 0
      };
      this.pan = {
        x: 0,
        y: 0
      };
      this.isFirstSlide = this.isActive && !pswp.opener.isOpen;
      this.zoomLevels = new ZoomLevel$1(pswp.options, data, index, pswp);
      this.pswp.dispatch("gettingData", {
        slide: this,
        data: this.data,
        index
      });
      this.content = this.pswp.contentLoader.getContentBySlide(this);
      this.container = createElement$1("pswp__zoom-wrap", "div");
      this.holderElement = null;
      this.currZoomLevel = 1;
      this.width = this.content.width;
      this.height = this.content.height;
      this.heavyAppended = false;
      this.bounds = new PanBounds(this);
      this.prevDisplayedWidth = -1;
      this.prevDisplayedHeight = -1;
      this.pswp.dispatch("slideInit", {
        slide: this
      });
    }
    /**
     * If this slide is active/current/visible
     *
     * @param {boolean} isActive
     */
    setIsActive(isActive) {
      if (isActive && !this.isActive) {
        this.activate();
      } else if (!isActive && this.isActive) {
        this.deactivate();
      }
    }
    /**
     * Appends slide content to DOM
     *
     * @param {HTMLElement} holderElement
     */
    append(holderElement) {
      this.holderElement = holderElement;
      this.container.style.transformOrigin = "0 0";
      if (!this.data) {
        return;
      }
      this.calculateSize();
      this.load();
      this.updateContentSize();
      this.appendHeavy();
      this.holderElement.appendChild(this.container);
      this.zoomAndPanToInitial();
      this.pswp.dispatch("firstZoomPan", {
        slide: this
      });
      this.applyCurrentZoomPan();
      this.pswp.dispatch("afterSetContent", {
        slide: this
      });
      if (this.isActive) {
        this.activate();
      }
    }
    load() {
      this.content.load(false);
      this.pswp.dispatch("slideLoad", {
        slide: this
      });
    }
    /**
     * Append "heavy" DOM elements
     *
     * This may depend on a type of slide,
     * but generally these are large images.
     */
    appendHeavy() {
      const {
        pswp
      } = this;
      const appendHeavyNearby = true;
      if (this.heavyAppended || !pswp.opener.isOpen || pswp.mainScroll.isShifted() || !this.isActive && !appendHeavyNearby) {
        return;
      }
      if (this.pswp.dispatch("appendHeavy", {
        slide: this
      }).defaultPrevented) {
        return;
      }
      this.heavyAppended = true;
      this.content.append();
      this.pswp.dispatch("appendHeavyContent", {
        slide: this
      });
    }
    /**
     * Triggered when this slide is active (selected).
     *
     * If it's part of opening/closing transition -
     * activate() will trigger after the transition is ended.
     */
    activate() {
      this.isActive = true;
      this.appendHeavy();
      this.content.activate();
      this.pswp.dispatch("slideActivate", {
        slide: this
      });
    }
    /**
     * Triggered when this slide becomes inactive.
     *
     * Slide can become inactive only after it was active.
     */
    deactivate() {
      this.isActive = false;
      this.content.deactivate();
      if (this.currZoomLevel !== this.zoomLevels.initial) {
        this.calculateSize();
      }
      this.currentResolution = 0;
      this.zoomAndPanToInitial();
      this.applyCurrentZoomPan();
      this.updateContentSize();
      this.pswp.dispatch("slideDeactivate", {
        slide: this
      });
    }
    /**
     * The slide should destroy itself, it will never be used again.
     * (unbind all events and destroy internal components)
     */
    destroy() {
      this.content.hasSlide = false;
      this.content.remove();
      this.container.remove();
      this.pswp.dispatch("slideDestroy", {
        slide: this
      });
    }
    resize() {
      if (this.currZoomLevel === this.zoomLevels.initial || !this.isActive) {
        this.calculateSize();
        this.currentResolution = 0;
        this.zoomAndPanToInitial();
        this.applyCurrentZoomPan();
        this.updateContentSize();
      } else {
        this.calculateSize();
        this.bounds.update(this.currZoomLevel);
        this.panTo(this.pan.x, this.pan.y);
      }
    }
    /**
     * Apply size to current slide content,
     * based on the current resolution and scale.
     *
     * @param {boolean} [force] if size should be updated even if dimensions weren't changed
     */
    updateContentSize(force) {
      const scaleMultiplier = this.currentResolution || this.zoomLevels.initial;
      if (!scaleMultiplier) {
        return;
      }
      const width = Math.round(this.width * scaleMultiplier) || this.pswp.viewportSize.x;
      const height = Math.round(this.height * scaleMultiplier) || this.pswp.viewportSize.y;
      if (!this.sizeChanged(width, height) && !force) {
        return;
      }
      this.content.setDisplayedSize(width, height);
    }
    /**
     * @param {number} width
     * @param {number} height
     */
    sizeChanged(width, height) {
      if (width !== this.prevDisplayedWidth || height !== this.prevDisplayedHeight) {
        this.prevDisplayedWidth = width;
        this.prevDisplayedHeight = height;
        return true;
      }
      return false;
    }
    /** @returns {HTMLImageElement | HTMLDivElement | null | undefined} */
    getPlaceholderElement() {
      var _this$content$placeho;
      return (_this$content$placeho = this.content.placeholder) === null || _this$content$placeho === void 0 ? void 0 : _this$content$placeho.element;
    }
    /**
     * Zoom current slide image to...
     *
     * @param {number} destZoomLevel Destination zoom level.
     * @param {Point} [centerPoint]
     * Transform origin center point, or false if viewport center should be used.
     * @param {number | false} [transitionDuration] Transition duration, may be set to 0.
     * @param {boolean} [ignoreBounds] Minimum and maximum zoom levels will be ignored.
     */
    zoomTo(destZoomLevel, centerPoint, transitionDuration, ignoreBounds) {
      const {
        pswp
      } = this;
      if (!this.isZoomable() || pswp.mainScroll.isShifted()) {
        return;
      }
      pswp.dispatch("beforeZoomTo", {
        destZoomLevel,
        centerPoint,
        transitionDuration
      });
      pswp.animations.stopAllPan();
      const prevZoomLevel = this.currZoomLevel;
      if (!ignoreBounds) {
        destZoomLevel = clamp(destZoomLevel, this.zoomLevels.min, this.zoomLevels.max);
      }
      this.setZoomLevel(destZoomLevel);
      this.pan.x = this.calculateZoomToPanOffset("x", centerPoint, prevZoomLevel);
      this.pan.y = this.calculateZoomToPanOffset("y", centerPoint, prevZoomLevel);
      roundPoint(this.pan);
      const finishTransition = () => {
        this._setResolution(destZoomLevel);
        this.applyCurrentZoomPan();
      };
      if (!transitionDuration) {
        finishTransition();
      } else {
        pswp.animations.startTransition({
          isPan: true,
          name: "zoomTo",
          target: this.container,
          transform: this.getCurrentTransform(),
          onComplete: finishTransition,
          duration: transitionDuration,
          easing: pswp.options.easing
        });
      }
    }
    /**
     * @param {Point} [centerPoint]
     */
    toggleZoom(centerPoint) {
      this.zoomTo(this.currZoomLevel === this.zoomLevels.initial ? this.zoomLevels.secondary : this.zoomLevels.initial, centerPoint, this.pswp.options.zoomAnimationDuration);
    }
    /**
     * Updates zoom level property and recalculates new pan bounds,
     * unlike zoomTo it does not apply transform (use applyCurrentZoomPan)
     *
     * @param {number} currZoomLevel
     */
    setZoomLevel(currZoomLevel) {
      this.currZoomLevel = currZoomLevel;
      this.bounds.update(this.currZoomLevel);
    }
    /**
     * Get pan position after zoom at a given `point`.
     *
     * Always call setZoomLevel(newZoomLevel) beforehand to recalculate
     * pan bounds according to the new zoom level.
     *
     * @param {'x' | 'y'} axis
     * @param {Point} [point]
     * point based on which zoom is performed, usually refers to the current mouse position,
     * if false - viewport center will be used.
     * @param {number} [prevZoomLevel] Zoom level before new zoom was applied.
     * @returns {number}
     */
    calculateZoomToPanOffset(axis, point, prevZoomLevel) {
      const totalPanDistance = this.bounds.max[axis] - this.bounds.min[axis];
      if (totalPanDistance === 0) {
        return this.bounds.center[axis];
      }
      if (!point) {
        point = this.pswp.getViewportCenterPoint();
      }
      if (!prevZoomLevel) {
        prevZoomLevel = this.zoomLevels.initial;
      }
      const zoomFactor = this.currZoomLevel / prevZoomLevel;
      return this.bounds.correctPan(axis, (this.pan[axis] - point[axis]) * zoomFactor + point[axis]);
    }
    /**
     * Apply pan and keep it within bounds.
     *
     * @param {number} panX
     * @param {number} panY
     */
    panTo(panX, panY) {
      this.pan.x = this.bounds.correctPan("x", panX);
      this.pan.y = this.bounds.correctPan("y", panY);
      this.applyCurrentZoomPan();
    }
    /**
     * If the slide in the current state can be panned by the user
     * @returns {boolean}
     */
    isPannable() {
      return Boolean(this.width) && this.currZoomLevel > this.zoomLevels.fit;
    }
    /**
     * If the slide can be zoomed
     * @returns {boolean}
     */
    isZoomable() {
      return Boolean(this.width) && this.content.isZoomable();
    }
    /**
     * Apply transform and scale based on
     * the current pan position (this.pan) and zoom level (this.currZoomLevel)
     */
    applyCurrentZoomPan() {
      this._applyZoomTransform(this.pan.x, this.pan.y, this.currZoomLevel);
      if (this === this.pswp.currSlide) {
        this.pswp.dispatch("zoomPanUpdate", {
          slide: this
        });
      }
    }
    zoomAndPanToInitial() {
      this.currZoomLevel = this.zoomLevels.initial;
      this.bounds.update(this.currZoomLevel);
      equalizePoints(this.pan, this.bounds.center);
      this.pswp.dispatch("initialZoomPan", {
        slide: this
      });
    }
    /**
     * Set translate and scale based on current resolution
     *
     * @param {number} x
     * @param {number} y
     * @param {number} zoom
     * @private
     */
    _applyZoomTransform(x, y, zoom) {
      zoom /= this.currentResolution || this.zoomLevels.initial;
      setTransform(this.container, x, y, zoom);
    }
    calculateSize() {
      const {
        pswp
      } = this;
      equalizePoints(this.panAreaSize, getPanAreaSize$1(pswp.options, pswp.viewportSize, this.data, this.index));
      this.zoomLevels.update(this.width, this.height, this.panAreaSize);
      pswp.dispatch("calcSlideSize", {
        slide: this
      });
    }
    /** @returns {string} */
    getCurrentTransform() {
      const scale = this.currZoomLevel / (this.currentResolution || this.zoomLevels.initial);
      return toTransformString$1(this.pan.x, this.pan.y, scale);
    }
    /**
     * Set resolution and re-render the image.
     *
     * For example, if the real image size is 2000x1500,
     * and resolution is 0.5 - it will be rendered as 1000x750.
     *
     * Image with zoom level 2 and resolution 0.5 is
     * the same as image with zoom level 1 and resolution 1.
     *
     * Used to optimize animations and make
     * sure that browser renders image in the highest quality.
     * Also used by responsive images to load the correct one.
     *
     * @param {number} newResolution
     */
    _setResolution(newResolution) {
      if (newResolution === this.currentResolution) {
        return;
      }
      this.currentResolution = newResolution;
      this.updateContentSize();
      this.pswp.dispatch("resolutionChanged");
    }
  }
  const PAN_END_FRICTION = 0.35;
  const VERTICAL_DRAG_FRICTION = 0.6;
  const MIN_RATIO_TO_CLOSE = 0.4;
  const MIN_NEXT_SLIDE_SPEED = 0.5;
  function project(initialVelocity, decelerationRate) {
    return initialVelocity * decelerationRate / (1 - decelerationRate);
  }
  class DragHandler {
    /**
     * @param {Gestures} gestures
     */
    constructor(gestures) {
      this.gestures = gestures;
      this.pswp = gestures.pswp;
      this.startPan = {
        x: 0,
        y: 0
      };
    }
    start() {
      if (this.pswp.currSlide) {
        equalizePoints(this.startPan, this.pswp.currSlide.pan);
      }
      this.pswp.animations.stopAll();
    }
    change() {
      const {
        p1,
        prevP1,
        dragAxis
      } = this.gestures;
      const {
        currSlide
      } = this.pswp;
      if (dragAxis === "y" && this.pswp.options.closeOnVerticalDrag && currSlide && currSlide.currZoomLevel <= currSlide.zoomLevels.fit && !this.gestures.isMultitouch) {
        const panY = currSlide.pan.y + (p1.y - prevP1.y);
        if (!this.pswp.dispatch("verticalDrag", {
          panY
        }).defaultPrevented) {
          this._setPanWithFriction("y", panY, VERTICAL_DRAG_FRICTION);
          const bgOpacity = 1 - Math.abs(this._getVerticalDragRatio(currSlide.pan.y));
          this.pswp.applyBgOpacity(bgOpacity);
          currSlide.applyCurrentZoomPan();
        }
      } else {
        const mainScrollChanged = this._panOrMoveMainScroll("x");
        if (!mainScrollChanged) {
          this._panOrMoveMainScroll("y");
          if (currSlide) {
            roundPoint(currSlide.pan);
            currSlide.applyCurrentZoomPan();
          }
        }
      }
    }
    end() {
      const {
        velocity
      } = this.gestures;
      const {
        mainScroll,
        currSlide
      } = this.pswp;
      let indexDiff = 0;
      this.pswp.animations.stopAll();
      if (mainScroll.isShifted()) {
        const mainScrollShiftDiff = mainScroll.x - mainScroll.getCurrSlideX();
        const currentSlideVisibilityRatio = mainScrollShiftDiff / this.pswp.viewportSize.x;
        if (velocity.x < -MIN_NEXT_SLIDE_SPEED && currentSlideVisibilityRatio < 0 || velocity.x < 0.1 && currentSlideVisibilityRatio < -0.5) {
          indexDiff = 1;
          velocity.x = Math.min(velocity.x, 0);
        } else if (velocity.x > MIN_NEXT_SLIDE_SPEED && currentSlideVisibilityRatio > 0 || velocity.x > -0.1 && currentSlideVisibilityRatio > 0.5) {
          indexDiff = -1;
          velocity.x = Math.max(velocity.x, 0);
        }
        mainScroll.moveIndexBy(indexDiff, true, velocity.x);
      }
      if (currSlide && currSlide.currZoomLevel > currSlide.zoomLevels.max || this.gestures.isMultitouch) {
        this.gestures.zoomLevels.correctZoomPan(true);
      } else {
        this._finishPanGestureForAxis("x");
        this._finishPanGestureForAxis("y");
      }
    }
    /**
     * @private
     * @param {'x' | 'y'} axis
     */
    _finishPanGestureForAxis(axis) {
      const {
        velocity
      } = this.gestures;
      const {
        currSlide
      } = this.pswp;
      if (!currSlide) {
        return;
      }
      const {
        pan,
        bounds
      } = currSlide;
      const panPos = pan[axis];
      const restoreBgOpacity = this.pswp.bgOpacity < 1 && axis === "y";
      const decelerationRate = 0.995;
      const projectedPosition = panPos + project(velocity[axis], decelerationRate);
      if (restoreBgOpacity) {
        const vDragRatio = this._getVerticalDragRatio(panPos);
        const projectedVDragRatio = this._getVerticalDragRatio(projectedPosition);
        if (vDragRatio < 0 && projectedVDragRatio < -MIN_RATIO_TO_CLOSE || vDragRatio > 0 && projectedVDragRatio > MIN_RATIO_TO_CLOSE) {
          this.pswp.close();
          return;
        }
      }
      const correctedPanPosition = bounds.correctPan(axis, projectedPosition);
      if (panPos === correctedPanPosition) {
        return;
      }
      const dampingRatio = correctedPanPosition === projectedPosition ? 1 : 0.82;
      const initialBgOpacity = this.pswp.bgOpacity;
      const totalPanDist = correctedPanPosition - panPos;
      this.pswp.animations.startSpring({
        name: "panGesture" + axis,
        isPan: true,
        start: panPos,
        end: correctedPanPosition,
        velocity: velocity[axis],
        dampingRatio,
        onUpdate: (pos) => {
          if (restoreBgOpacity && this.pswp.bgOpacity < 1) {
            const animationProgressRatio = 1 - (correctedPanPosition - pos) / totalPanDist;
            this.pswp.applyBgOpacity(clamp(initialBgOpacity + (1 - initialBgOpacity) * animationProgressRatio, 0, 1));
          }
          pan[axis] = Math.floor(pos);
          currSlide.applyCurrentZoomPan();
        }
      });
    }
    /**
     * Update position of the main scroll,
     * or/and update pan position of the current slide.
     *
     * Should return true if it changes (or can change) main scroll.
     *
     * @private
     * @param {'x' | 'y'} axis
     * @returns {boolean}
     */
    _panOrMoveMainScroll(axis) {
      const {
        p1,
        dragAxis,
        prevP1,
        isMultitouch
      } = this.gestures;
      const {
        currSlide,
        mainScroll
      } = this.pswp;
      const delta = p1[axis] - prevP1[axis];
      const newMainScrollX = mainScroll.x + delta;
      if (!delta || !currSlide) {
        return false;
      }
      if (axis === "x" && !currSlide.isPannable() && !isMultitouch) {
        mainScroll.moveTo(newMainScrollX, true);
        return true;
      }
      const {
        bounds
      } = currSlide;
      const newPan = currSlide.pan[axis] + delta;
      if (this.pswp.options.allowPanToNext && dragAxis === "x" && axis === "x" && !isMultitouch) {
        const currSlideMainScrollX = mainScroll.getCurrSlideX();
        const mainScrollShiftDiff = mainScroll.x - currSlideMainScrollX;
        const isLeftToRight = delta > 0;
        const isRightToLeft = !isLeftToRight;
        if (newPan > bounds.min[axis] && isLeftToRight) {
          const wasAtMinPanPosition = bounds.min[axis] <= this.startPan[axis];
          if (wasAtMinPanPosition) {
            mainScroll.moveTo(newMainScrollX, true);
            return true;
          } else {
            this._setPanWithFriction(axis, newPan);
          }
        } else if (newPan < bounds.max[axis] && isRightToLeft) {
          const wasAtMaxPanPosition = this.startPan[axis] <= bounds.max[axis];
          if (wasAtMaxPanPosition) {
            mainScroll.moveTo(newMainScrollX, true);
            return true;
          } else {
            this._setPanWithFriction(axis, newPan);
          }
        } else {
          if (mainScrollShiftDiff !== 0) {
            if (mainScrollShiftDiff > 0) {
              mainScroll.moveTo(Math.max(newMainScrollX, currSlideMainScrollX), true);
              return true;
            } else if (mainScrollShiftDiff < 0) {
              mainScroll.moveTo(Math.min(newMainScrollX, currSlideMainScrollX), true);
              return true;
            }
          } else {
            this._setPanWithFriction(axis, newPan);
          }
        }
      } else {
        if (axis === "y") {
          if (!mainScroll.isShifted() && bounds.min.y !== bounds.max.y) {
            this._setPanWithFriction(axis, newPan);
          }
        } else {
          this._setPanWithFriction(axis, newPan);
        }
      }
      return false;
    }
    // If we move above - the ratio is negative
    // If we move below the ratio is positive
    /**
     * Relation between pan Y position and third of viewport height.
     *
     * When we are at initial position (center bounds) - the ratio is 0,
     * if position is shifted upwards - the ratio is negative,
     * if position is shifted downwards - the ratio is positive.
     *
     * @private
     * @param {number} panY The current pan Y position.
     * @returns {number}
     */
    _getVerticalDragRatio(panY) {
      var _this$pswp$currSlide$, _this$pswp$currSlide;
      return (panY - ((_this$pswp$currSlide$ = (_this$pswp$currSlide = this.pswp.currSlide) === null || _this$pswp$currSlide === void 0 ? void 0 : _this$pswp$currSlide.bounds.center.y) !== null && _this$pswp$currSlide$ !== void 0 ? _this$pswp$currSlide$ : 0)) / (this.pswp.viewportSize.y / 3);
    }
    /**
     * Set pan position of the current slide.
     * Apply friction if the position is beyond the pan bounds,
     * or if custom friction is defined.
     *
     * @private
     * @param {'x' | 'y'} axis
     * @param {number} potentialPan
     * @param {number} [customFriction] (0.1 - 1)
     */
    _setPanWithFriction(axis, potentialPan, customFriction) {
      const {
        currSlide
      } = this.pswp;
      if (!currSlide) {
        return;
      }
      const {
        pan,
        bounds
      } = currSlide;
      const correctedPan = bounds.correctPan(axis, potentialPan);
      if (correctedPan !== potentialPan || customFriction) {
        const delta = Math.round(potentialPan - pan[axis]);
        pan[axis] += delta * (customFriction || PAN_END_FRICTION);
      } else {
        pan[axis] = potentialPan;
      }
    }
  }
  const UPPER_ZOOM_FRICTION = 0.05;
  const LOWER_ZOOM_FRICTION = 0.15;
  function getZoomPointsCenter(p, p1, p2) {
    p.x = (p1.x + p2.x) / 2;
    p.y = (p1.y + p2.y) / 2;
    return p;
  }
  class ZoomHandler {
    /**
     * @param {Gestures} gestures
     */
    constructor(gestures) {
      this.gestures = gestures;
      this._startPan = {
        x: 0,
        y: 0
      };
      this._startZoomPoint = {
        x: 0,
        y: 0
      };
      this._zoomPoint = {
        x: 0,
        y: 0
      };
      this._wasOverFitZoomLevel = false;
      this._startZoomLevel = 1;
    }
    start() {
      const {
        currSlide
      } = this.gestures.pswp;
      if (currSlide) {
        this._startZoomLevel = currSlide.currZoomLevel;
        equalizePoints(this._startPan, currSlide.pan);
      }
      this.gestures.pswp.animations.stopAllPan();
      this._wasOverFitZoomLevel = false;
    }
    change() {
      const {
        p1,
        startP1,
        p2,
        startP2,
        pswp
      } = this.gestures;
      const {
        currSlide
      } = pswp;
      if (!currSlide) {
        return;
      }
      const minZoomLevel = currSlide.zoomLevels.min;
      const maxZoomLevel = currSlide.zoomLevels.max;
      if (!currSlide.isZoomable() || pswp.mainScroll.isShifted()) {
        return;
      }
      getZoomPointsCenter(this._startZoomPoint, startP1, startP2);
      getZoomPointsCenter(this._zoomPoint, p1, p2);
      let currZoomLevel = 1 / getDistanceBetween(startP1, startP2) * getDistanceBetween(p1, p2) * this._startZoomLevel;
      if (currZoomLevel > currSlide.zoomLevels.initial + currSlide.zoomLevels.initial / 15) {
        this._wasOverFitZoomLevel = true;
      }
      if (currZoomLevel < minZoomLevel) {
        if (pswp.options.pinchToClose && !this._wasOverFitZoomLevel && this._startZoomLevel <= currSlide.zoomLevels.initial) {
          const bgOpacity = 1 - (minZoomLevel - currZoomLevel) / (minZoomLevel / 1.2);
          if (!pswp.dispatch("pinchClose", {
            bgOpacity
          }).defaultPrevented) {
            pswp.applyBgOpacity(bgOpacity);
          }
        } else {
          currZoomLevel = minZoomLevel - (minZoomLevel - currZoomLevel) * LOWER_ZOOM_FRICTION;
        }
      } else if (currZoomLevel > maxZoomLevel) {
        currZoomLevel = maxZoomLevel + (currZoomLevel - maxZoomLevel) * UPPER_ZOOM_FRICTION;
      }
      currSlide.pan.x = this._calculatePanForZoomLevel("x", currZoomLevel);
      currSlide.pan.y = this._calculatePanForZoomLevel("y", currZoomLevel);
      currSlide.setZoomLevel(currZoomLevel);
      currSlide.applyCurrentZoomPan();
    }
    end() {
      const {
        pswp
      } = this.gestures;
      const {
        currSlide
      } = pswp;
      if ((!currSlide || currSlide.currZoomLevel < currSlide.zoomLevels.initial) && !this._wasOverFitZoomLevel && pswp.options.pinchToClose) {
        pswp.close();
      } else {
        this.correctZoomPan();
      }
    }
    /**
     * @private
     * @param {'x' | 'y'} axis
     * @param {number} currZoomLevel
     * @returns {number}
     */
    _calculatePanForZoomLevel(axis, currZoomLevel) {
      const zoomFactor = currZoomLevel / this._startZoomLevel;
      return this._zoomPoint[axis] - (this._startZoomPoint[axis] - this._startPan[axis]) * zoomFactor;
    }
    /**
     * Correct currZoomLevel and pan if they are
     * beyond minimum or maximum values.
     * With animation.
     *
     * @param {boolean} [ignoreGesture]
     * Wether gesture coordinates should be ignored when calculating destination pan position.
     */
    correctZoomPan(ignoreGesture) {
      const {
        pswp
      } = this.gestures;
      const {
        currSlide
      } = pswp;
      if (!(currSlide !== null && currSlide !== void 0 && currSlide.isZoomable())) {
        return;
      }
      if (this._zoomPoint.x === 0) {
        ignoreGesture = true;
      }
      const prevZoomLevel = currSlide.currZoomLevel;
      let destinationZoomLevel;
      let currZoomLevelNeedsChange = true;
      if (prevZoomLevel < currSlide.zoomLevels.initial) {
        destinationZoomLevel = currSlide.zoomLevels.initial;
      } else if (prevZoomLevel > currSlide.zoomLevels.max) {
        destinationZoomLevel = currSlide.zoomLevels.max;
      } else {
        currZoomLevelNeedsChange = false;
        destinationZoomLevel = prevZoomLevel;
      }
      const initialBgOpacity = pswp.bgOpacity;
      const restoreBgOpacity = pswp.bgOpacity < 1;
      const initialPan = equalizePoints({
        x: 0,
        y: 0
      }, currSlide.pan);
      let destinationPan = equalizePoints({
        x: 0,
        y: 0
      }, initialPan);
      if (ignoreGesture) {
        this._zoomPoint.x = 0;
        this._zoomPoint.y = 0;
        this._startZoomPoint.x = 0;
        this._startZoomPoint.y = 0;
        this._startZoomLevel = prevZoomLevel;
        equalizePoints(this._startPan, initialPan);
      }
      if (currZoomLevelNeedsChange) {
        destinationPan = {
          x: this._calculatePanForZoomLevel("x", destinationZoomLevel),
          y: this._calculatePanForZoomLevel("y", destinationZoomLevel)
        };
      }
      currSlide.setZoomLevel(destinationZoomLevel);
      destinationPan = {
        x: currSlide.bounds.correctPan("x", destinationPan.x),
        y: currSlide.bounds.correctPan("y", destinationPan.y)
      };
      currSlide.setZoomLevel(prevZoomLevel);
      const panNeedsChange = !pointsEqual(destinationPan, initialPan);
      if (!panNeedsChange && !currZoomLevelNeedsChange && !restoreBgOpacity) {
        currSlide._setResolution(destinationZoomLevel);
        currSlide.applyCurrentZoomPan();
        return;
      }
      pswp.animations.stopAllPan();
      pswp.animations.startSpring({
        isPan: true,
        start: 0,
        end: 1e3,
        velocity: 0,
        dampingRatio: 1,
        naturalFrequency: 40,
        onUpdate: (now) => {
          now /= 1e3;
          if (panNeedsChange || currZoomLevelNeedsChange) {
            if (panNeedsChange) {
              currSlide.pan.x = initialPan.x + (destinationPan.x - initialPan.x) * now;
              currSlide.pan.y = initialPan.y + (destinationPan.y - initialPan.y) * now;
            }
            if (currZoomLevelNeedsChange) {
              const newZoomLevel = prevZoomLevel + (destinationZoomLevel - prevZoomLevel) * now;
              currSlide.setZoomLevel(newZoomLevel);
            }
            currSlide.applyCurrentZoomPan();
          }
          if (restoreBgOpacity && pswp.bgOpacity < 1) {
            pswp.applyBgOpacity(clamp(initialBgOpacity + (1 - initialBgOpacity) * now, 0, 1));
          }
        },
        onComplete: () => {
          currSlide._setResolution(destinationZoomLevel);
          currSlide.applyCurrentZoomPan();
        }
      });
    }
  }
  function didTapOnMainContent(event) {
    return !!/** @type {HTMLElement} */
    event.target.closest(".pswp__container");
  }
  class TapHandler {
    /**
     * @param {Gestures} gestures
     */
    constructor(gestures) {
      this.gestures = gestures;
    }
    /**
     * @param {Point} point
     * @param {PointerEvent} originalEvent
     */
    click(point, originalEvent) {
      const targetClassList = (
        /** @type {HTMLElement} */
        originalEvent.target.classList
      );
      const isImageClick = targetClassList.contains("pswp__img");
      const isBackgroundClick = targetClassList.contains("pswp__item") || targetClassList.contains("pswp__zoom-wrap");
      if (isImageClick) {
        this._doClickOrTapAction("imageClick", point, originalEvent);
      } else if (isBackgroundClick) {
        this._doClickOrTapAction("bgClick", point, originalEvent);
      }
    }
    /**
     * @param {Point} point
     * @param {PointerEvent} originalEvent
     */
    tap(point, originalEvent) {
      if (didTapOnMainContent(originalEvent)) {
        this._doClickOrTapAction("tap", point, originalEvent);
      }
    }
    /**
     * @param {Point} point
     * @param {PointerEvent} originalEvent
     */
    doubleTap(point, originalEvent) {
      if (didTapOnMainContent(originalEvent)) {
        this._doClickOrTapAction("doubleTap", point, originalEvent);
      }
    }
    /**
     * @private
     * @param {Actions} actionName
     * @param {Point} point
     * @param {PointerEvent} originalEvent
     */
    _doClickOrTapAction(actionName, point, originalEvent) {
      var _this$gestures$pswp$e;
      const {
        pswp
      } = this.gestures;
      const {
        currSlide
      } = pswp;
      const actionFullName = (
        /** @type {AddPostfix<Actions, 'Action'>} */
        actionName + "Action"
      );
      const optionValue = pswp.options[actionFullName];
      if (pswp.dispatch(actionFullName, {
        point,
        originalEvent
      }).defaultPrevented) {
        return;
      }
      if (typeof optionValue === "function") {
        optionValue.call(pswp, point, originalEvent);
        return;
      }
      switch (optionValue) {
        case "close":
        case "next":
          pswp[optionValue]();
          break;
        case "zoom":
          currSlide === null || currSlide === void 0 || currSlide.toggleZoom(point);
          break;
        case "zoom-or-close":
          if (currSlide !== null && currSlide !== void 0 && currSlide.isZoomable() && currSlide.zoomLevels.secondary !== currSlide.zoomLevels.initial) {
            currSlide.toggleZoom(point);
          } else if (pswp.options.clickToCloseNonZoomable) {
            pswp.close();
          }
          break;
        case "toggle-controls":
          (_this$gestures$pswp$e = this.gestures.pswp.element) === null || _this$gestures$pswp$e === void 0 || _this$gestures$pswp$e.classList.toggle("pswp--ui-visible");
          break;
      }
    }
  }
  const AXIS_SWIPE_HYSTERISIS = 10;
  const DOUBLE_TAP_DELAY = 300;
  const MIN_TAP_DISTANCE = 25;
  class Gestures {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp) {
      this.pswp = pswp;
      this.dragAxis = null;
      this.p1 = {
        x: 0,
        y: 0
      };
      this.p2 = {
        x: 0,
        y: 0
      };
      this.prevP1 = {
        x: 0,
        y: 0
      };
      this.prevP2 = {
        x: 0,
        y: 0
      };
      this.startP1 = {
        x: 0,
        y: 0
      };
      this.startP2 = {
        x: 0,
        y: 0
      };
      this.velocity = {
        x: 0,
        y: 0
      };
      this._lastStartP1 = {
        x: 0,
        y: 0
      };
      this._intervalP1 = {
        x: 0,
        y: 0
      };
      this._numActivePoints = 0;
      this._ongoingPointers = [];
      this._touchEventEnabled = "ontouchstart" in window;
      this._pointerEventEnabled = !!window.PointerEvent;
      this.supportsTouch = this._touchEventEnabled || this._pointerEventEnabled && navigator.maxTouchPoints > 1;
      this._numActivePoints = 0;
      this._intervalTime = 0;
      this._velocityCalculated = false;
      this.isMultitouch = false;
      this.isDragging = false;
      this.isZooming = false;
      this.raf = null;
      this._tapTimer = null;
      if (!this.supportsTouch) {
        pswp.options.allowPanToNext = false;
      }
      this.drag = new DragHandler(this);
      this.zoomLevels = new ZoomHandler(this);
      this.tapHandler = new TapHandler(this);
      pswp.on("bindEvents", () => {
        pswp.events.add(
          pswp.scrollWrap,
          "click",
          /** @type EventListener */
          this._onClick.bind(this)
        );
        if (this._pointerEventEnabled) {
          this._bindEvents("pointer", "down", "up", "cancel");
        } else if (this._touchEventEnabled) {
          this._bindEvents("touch", "start", "end", "cancel");
          if (pswp.scrollWrap) {
            pswp.scrollWrap.ontouchmove = () => {
            };
            pswp.scrollWrap.ontouchend = () => {
            };
          }
        } else {
          this._bindEvents("mouse", "down", "up");
        }
      });
    }
    /**
     * @private
     * @param {'mouse' | 'touch' | 'pointer'} pref
     * @param {'down' | 'start'} down
     * @param {'up' | 'end'} up
     * @param {'cancel'} [cancel]
     */
    _bindEvents(pref, down, up, cancel) {
      const {
        pswp
      } = this;
      const {
        events
      } = pswp;
      const cancelEvent = cancel ? pref + cancel : "";
      events.add(
        pswp.scrollWrap,
        pref + down,
        /** @type EventListener */
        this.onPointerDown.bind(this)
      );
      events.add(
        window,
        pref + "move",
        /** @type EventListener */
        this.onPointerMove.bind(this)
      );
      events.add(
        window,
        pref + up,
        /** @type EventListener */
        this.onPointerUp.bind(this)
      );
      if (cancelEvent) {
        events.add(
          pswp.scrollWrap,
          cancelEvent,
          /** @type EventListener */
          this.onPointerUp.bind(this)
        );
      }
    }
    /**
     * @param {PointerEvent} e
     */
    onPointerDown(e) {
      const isMousePointer = e.type === "mousedown" || e.pointerType === "mouse";
      if (isMousePointer && e.button > 0) {
        return;
      }
      const {
        pswp
      } = this;
      if (!pswp.opener.isOpen) {
        e.preventDefault();
        return;
      }
      if (pswp.dispatch("pointerDown", {
        originalEvent: e
      }).defaultPrevented) {
        return;
      }
      if (isMousePointer) {
        pswp.mouseDetected();
        this._preventPointerEventBehaviour(e, "down");
      }
      pswp.animations.stopAll();
      this._updatePoints(e, "down");
      if (this._numActivePoints === 1) {
        this.dragAxis = null;
        equalizePoints(this.startP1, this.p1);
      }
      if (this._numActivePoints > 1) {
        this._clearTapTimer();
        this.isMultitouch = true;
      } else {
        this.isMultitouch = false;
      }
    }
    /**
     * @param {PointerEvent} e
     */
    onPointerMove(e) {
      this._preventPointerEventBehaviour(e, "move");
      if (!this._numActivePoints) {
        return;
      }
      this._updatePoints(e, "move");
      if (this.pswp.dispatch("pointerMove", {
        originalEvent: e
      }).defaultPrevented) {
        return;
      }
      if (this._numActivePoints === 1 && !this.isDragging) {
        if (!this.dragAxis) {
          this._calculateDragDirection();
        }
        if (this.dragAxis && !this.isDragging) {
          if (this.isZooming) {
            this.isZooming = false;
            this.zoomLevels.end();
          }
          this.isDragging = true;
          this._clearTapTimer();
          this._updateStartPoints();
          this._intervalTime = Date.now();
          this._velocityCalculated = false;
          equalizePoints(this._intervalP1, this.p1);
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.drag.start();
          this._rafStopLoop();
          this._rafRenderLoop();
        }
      } else if (this._numActivePoints > 1 && !this.isZooming) {
        this._finishDrag();
        this.isZooming = true;
        this._updateStartPoints();
        this.zoomLevels.start();
        this._rafStopLoop();
        this._rafRenderLoop();
      }
    }
    /**
     * @private
     */
    _finishDrag() {
      if (this.isDragging) {
        this.isDragging = false;
        if (!this._velocityCalculated) {
          this._updateVelocity(true);
        }
        this.drag.end();
        this.dragAxis = null;
      }
    }
    /**
     * @param {PointerEvent} e
     */
    onPointerUp(e) {
      if (!this._numActivePoints) {
        return;
      }
      this._updatePoints(e, "up");
      if (this.pswp.dispatch("pointerUp", {
        originalEvent: e
      }).defaultPrevented) {
        return;
      }
      if (this._numActivePoints === 0) {
        this._rafStopLoop();
        if (this.isDragging) {
          this._finishDrag();
        } else if (!this.isZooming && !this.isMultitouch) {
          this._finishTap(e);
        }
      }
      if (this._numActivePoints < 2 && this.isZooming) {
        this.isZooming = false;
        this.zoomLevels.end();
        if (this._numActivePoints === 1) {
          this.dragAxis = null;
          this._updateStartPoints();
        }
      }
    }
    /**
     * @private
     */
    _rafRenderLoop() {
      if (this.isDragging || this.isZooming) {
        this._updateVelocity();
        if (this.isDragging) {
          if (!pointsEqual(this.p1, this.prevP1)) {
            this.drag.change();
          }
        } else {
          if (!pointsEqual(this.p1, this.prevP1) || !pointsEqual(this.p2, this.prevP2)) {
            this.zoomLevels.change();
          }
        }
        this._updatePrevPoints();
        this.raf = requestAnimationFrame(this._rafRenderLoop.bind(this));
      }
    }
    /**
     * Update velocity at 50ms interval
     *
     * @private
     * @param {boolean} [force]
     */
    _updateVelocity(force) {
      const time = Date.now();
      const duration = time - this._intervalTime;
      if (duration < 50 && !force) {
        return;
      }
      this.velocity.x = this._getVelocity("x", duration);
      this.velocity.y = this._getVelocity("y", duration);
      this._intervalTime = time;
      equalizePoints(this._intervalP1, this.p1);
      this._velocityCalculated = true;
    }
    /**
     * @private
     * @param {PointerEvent} e
     */
    _finishTap(e) {
      const {
        mainScroll
      } = this.pswp;
      if (mainScroll.isShifted()) {
        mainScroll.moveIndexBy(0, true);
        return;
      }
      if (e.type.indexOf("cancel") > 0) {
        return;
      }
      if (e.type === "mouseup" || e.pointerType === "mouse") {
        this.tapHandler.click(this.startP1, e);
        return;
      }
      const tapDelay = this.pswp.options.doubleTapAction ? DOUBLE_TAP_DELAY : 0;
      if (this._tapTimer) {
        this._clearTapTimer();
        if (getDistanceBetween(this._lastStartP1, this.startP1) < MIN_TAP_DISTANCE) {
          this.tapHandler.doubleTap(this.startP1, e);
        }
      } else {
        equalizePoints(this._lastStartP1, this.startP1);
        this._tapTimer = setTimeout(() => {
          this.tapHandler.tap(this.startP1, e);
          this._clearTapTimer();
        }, tapDelay);
      }
    }
    /**
     * @private
     */
    _clearTapTimer() {
      if (this._tapTimer) {
        clearTimeout(this._tapTimer);
        this._tapTimer = null;
      }
    }
    /**
     * Get velocity for axis
     *
     * @private
     * @param {'x' | 'y'} axis
     * @param {number} duration
     * @returns {number}
     */
    _getVelocity(axis, duration) {
      const displacement = this.p1[axis] - this._intervalP1[axis];
      if (Math.abs(displacement) > 1 && duration > 5) {
        return displacement / duration;
      }
      return 0;
    }
    /**
     * @private
     */
    _rafStopLoop() {
      if (this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = null;
      }
    }
    /**
     * @private
     * @param {PointerEvent} e
     * @param {'up' | 'down' | 'move'} pointerType Normalized pointer type
     */
    _preventPointerEventBehaviour(e, pointerType) {
      const preventPointerEvent = this.pswp.applyFilters("preventPointerEvent", true, e, pointerType);
      if (preventPointerEvent) {
        e.preventDefault();
      }
    }
    /**
     * Parses and normalizes points from the touch, mouse or pointer event.
     * Updates p1 and p2.
     *
     * @private
     * @param {PointerEvent | TouchEvent} e
     * @param {'up' | 'down' | 'move'} pointerType Normalized pointer type
     */
    _updatePoints(e, pointerType) {
      if (this._pointerEventEnabled) {
        const pointerEvent = (
          /** @type {PointerEvent} */
          e
        );
        const pointerIndex = this._ongoingPointers.findIndex((ongoingPointer) => {
          return ongoingPointer.id === pointerEvent.pointerId;
        });
        if (pointerType === "up" && pointerIndex > -1) {
          this._ongoingPointers.splice(pointerIndex, 1);
        } else if (pointerType === "down" && pointerIndex === -1) {
          this._ongoingPointers.push(this._convertEventPosToPoint(pointerEvent, {
            x: 0,
            y: 0
          }));
        } else if (pointerIndex > -1) {
          this._convertEventPosToPoint(pointerEvent, this._ongoingPointers[pointerIndex]);
        }
        this._numActivePoints = this._ongoingPointers.length;
        if (this._numActivePoints > 0) {
          equalizePoints(this.p1, this._ongoingPointers[0]);
        }
        if (this._numActivePoints > 1) {
          equalizePoints(this.p2, this._ongoingPointers[1]);
        }
      } else {
        const touchEvent = (
          /** @type {TouchEvent} */
          e
        );
        this._numActivePoints = 0;
        if (touchEvent.type.indexOf("touch") > -1) {
          if (touchEvent.touches && touchEvent.touches.length > 0) {
            this._convertEventPosToPoint(touchEvent.touches[0], this.p1);
            this._numActivePoints++;
            if (touchEvent.touches.length > 1) {
              this._convertEventPosToPoint(touchEvent.touches[1], this.p2);
              this._numActivePoints++;
            }
          }
        } else {
          this._convertEventPosToPoint(
            /** @type {PointerEvent} */
            e,
            this.p1
          );
          if (pointerType === "up") {
            this._numActivePoints = 0;
          } else {
            this._numActivePoints++;
          }
        }
      }
    }
    /** update points that were used during previous rAF tick
     * @private
     */
    _updatePrevPoints() {
      equalizePoints(this.prevP1, this.p1);
      equalizePoints(this.prevP2, this.p2);
    }
    /** update points at the start of gesture
     * @private
     */
    _updateStartPoints() {
      equalizePoints(this.startP1, this.p1);
      equalizePoints(this.startP2, this.p2);
      this._updatePrevPoints();
    }
    /** @private */
    _calculateDragDirection() {
      if (this.pswp.mainScroll.isShifted()) {
        this.dragAxis = "x";
      } else {
        const diff = Math.abs(this.p1.x - this.startP1.x) - Math.abs(this.p1.y - this.startP1.y);
        if (diff !== 0) {
          const axisToCheck = diff > 0 ? "x" : "y";
          if (Math.abs(this.p1[axisToCheck] - this.startP1[axisToCheck]) >= AXIS_SWIPE_HYSTERISIS) {
            this.dragAxis = axisToCheck;
          }
        }
      }
    }
    /**
     * Converts touch, pointer or mouse event
     * to PhotoSwipe point.
     *
     * @private
     * @param {Touch | PointerEvent} e
     * @param {Point} p
     * @returns {Point}
     */
    _convertEventPosToPoint(e, p) {
      p.x = e.pageX - this.pswp.offset.x;
      p.y = e.pageY - this.pswp.offset.y;
      if ("pointerId" in e) {
        p.id = e.pointerId;
      } else if (e.identifier !== void 0) {
        p.id = e.identifier;
      }
      return p;
    }
    /**
     * @private
     * @param {PointerEvent} e
     */
    _onClick(e) {
      if (this.pswp.mainScroll.isShifted()) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }
  const MAIN_SCROLL_END_FRICTION = 0.35;
  class MainScroll {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp) {
      this.pswp = pswp;
      this.x = 0;
      this.slideWidth = 0;
      this._currPositionIndex = 0;
      this._prevPositionIndex = 0;
      this._containerShiftIndex = -1;
      this.itemHolders = [];
    }
    /**
     * Position the scroller and slide containers
     * according to viewport size.
     *
     * @param {boolean} [resizeSlides] Whether slides content should resized
     */
    resize(resizeSlides) {
      const {
        pswp
      } = this;
      const newSlideWidth = Math.round(pswp.viewportSize.x + pswp.viewportSize.x * pswp.options.spacing);
      const slideWidthChanged = newSlideWidth !== this.slideWidth;
      if (slideWidthChanged) {
        this.slideWidth = newSlideWidth;
        this.moveTo(this.getCurrSlideX());
      }
      this.itemHolders.forEach((itemHolder, index) => {
        if (slideWidthChanged) {
          setTransform(itemHolder.el, (index + this._containerShiftIndex) * this.slideWidth);
        }
        if (resizeSlides && itemHolder.slide) {
          itemHolder.slide.resize();
        }
      });
    }
    /**
     * Reset X position of the main scroller to zero
     */
    resetPosition() {
      this._currPositionIndex = 0;
      this._prevPositionIndex = 0;
      this.slideWidth = 0;
      this._containerShiftIndex = -1;
    }
    /**
     * Create and append array of three items
     * that hold data about slides in DOM
     */
    appendHolders() {
      this.itemHolders = [];
      for (let i = 0; i < 3; i++) {
        const el = createElement$1("pswp__item", "div", this.pswp.container);
        el.setAttribute("role", "group");
        el.setAttribute("aria-roledescription", "slide");
        el.setAttribute("aria-hidden", "true");
        el.style.display = i === 1 ? "block" : "none";
        this.itemHolders.push({
          el
          //index: -1
        });
      }
    }
    /**
     * Whether the main scroll can be horizontally swiped to the next or previous slide.
     * @returns {boolean}
     */
    canBeSwiped() {
      return this.pswp.getNumItems() > 1;
    }
    /**
     * Move main scroll by X amount of slides.
     * For example:
     *   `-1` will move to the previous slide,
     *    `0` will reset the scroll position of the current slide,
     *    `3` will move three slides forward
     *
     * If loop option is enabled - index will be automatically looped too,
     * (for example `-1` will move to the last slide of the gallery).
     *
     * @param {number} diff
     * @param {boolean} [animate]
     * @param {number} [velocityX]
     * @returns {boolean} whether index was changed or not
     */
    moveIndexBy(diff, animate, velocityX) {
      const {
        pswp
      } = this;
      let newIndex = pswp.potentialIndex + diff;
      const numSlides = pswp.getNumItems();
      if (pswp.canLoop()) {
        newIndex = pswp.getLoopedIndex(newIndex);
        const distance = (diff + numSlides) % numSlides;
        if (distance <= numSlides / 2) {
          diff = distance;
        } else {
          diff = distance - numSlides;
        }
      } else {
        if (newIndex < 0) {
          newIndex = 0;
        } else if (newIndex >= numSlides) {
          newIndex = numSlides - 1;
        }
        diff = newIndex - pswp.potentialIndex;
      }
      pswp.potentialIndex = newIndex;
      this._currPositionIndex -= diff;
      pswp.animations.stopMainScroll();
      const destinationX = this.getCurrSlideX();
      if (!animate) {
        this.moveTo(destinationX);
        this.updateCurrItem();
      } else {
        pswp.animations.startSpring({
          isMainScroll: true,
          start: this.x,
          end: destinationX,
          velocity: velocityX || 0,
          naturalFrequency: 30,
          dampingRatio: 1,
          //0.7,
          onUpdate: (x) => {
            this.moveTo(x);
          },
          onComplete: () => {
            this.updateCurrItem();
            pswp.appendHeavy();
          }
        });
        let currDiff = pswp.potentialIndex - pswp.currIndex;
        if (pswp.canLoop()) {
          const currDistance = (currDiff + numSlides) % numSlides;
          if (currDistance <= numSlides / 2) {
            currDiff = currDistance;
          } else {
            currDiff = currDistance - numSlides;
          }
        }
        if (Math.abs(currDiff) > 1) {
          this.updateCurrItem();
        }
      }
      return Boolean(diff);
    }
    /**
     * X position of the main scroll for the current slide
     * (ignores position during dragging)
     * @returns {number}
     */
    getCurrSlideX() {
      return this.slideWidth * this._currPositionIndex;
    }
    /**
     * Whether scroll position is shifted.
     * For example, it will return true if the scroll is being dragged or animated.
     * @returns {boolean}
     */
    isShifted() {
      return this.x !== this.getCurrSlideX();
    }
    /**
     * Update slides X positions and set their content
     */
    updateCurrItem() {
      var _this$itemHolders$;
      const {
        pswp
      } = this;
      const positionDifference = this._prevPositionIndex - this._currPositionIndex;
      if (!positionDifference) {
        return;
      }
      this._prevPositionIndex = this._currPositionIndex;
      pswp.currIndex = pswp.potentialIndex;
      let diffAbs = Math.abs(positionDifference);
      let tempHolder;
      if (diffAbs >= 3) {
        this._containerShiftIndex += positionDifference + (positionDifference > 0 ? -3 : 3);
        diffAbs = 3;
      }
      for (let i = 0; i < diffAbs; i++) {
        if (positionDifference > 0) {
          tempHolder = this.itemHolders.shift();
          if (tempHolder) {
            this.itemHolders[2] = tempHolder;
            this._containerShiftIndex++;
            setTransform(tempHolder.el, (this._containerShiftIndex + 2) * this.slideWidth);
            pswp.setContent(tempHolder, pswp.currIndex - diffAbs + i + 2);
          }
        } else {
          tempHolder = this.itemHolders.pop();
          if (tempHolder) {
            this.itemHolders.unshift(tempHolder);
            this._containerShiftIndex--;
            setTransform(tempHolder.el, this._containerShiftIndex * this.slideWidth);
            pswp.setContent(tempHolder, pswp.currIndex + diffAbs - i - 2);
          }
        }
      }
      if (Math.abs(this._containerShiftIndex) > 50 && !this.isShifted()) {
        this.resetPosition();
        this.resize();
      }
      pswp.animations.stopAllPan();
      this.itemHolders.forEach((itemHolder, i) => {
        if (itemHolder.slide) {
          itemHolder.slide.setIsActive(i === 1);
        }
      });
      pswp.currSlide = (_this$itemHolders$ = this.itemHolders[1]) === null || _this$itemHolders$ === void 0 ? void 0 : _this$itemHolders$.slide;
      pswp.contentLoader.updateLazy(positionDifference);
      if (pswp.currSlide) {
        pswp.currSlide.applyCurrentZoomPan();
      }
      pswp.dispatch("change");
    }
    /**
     * Move the X position of the main scroll container
     *
     * @param {number} x
     * @param {boolean} [dragging]
     */
    moveTo(x, dragging) {
      if (!this.pswp.canLoop() && dragging) {
        let newSlideIndexOffset = (this.slideWidth * this._currPositionIndex - x) / this.slideWidth;
        newSlideIndexOffset += this.pswp.currIndex;
        const delta = Math.round(x - this.x);
        if (newSlideIndexOffset < 0 && delta > 0 || newSlideIndexOffset >= this.pswp.getNumItems() - 1 && delta < 0) {
          x = this.x + delta * MAIN_SCROLL_END_FRICTION;
        }
      }
      this.x = x;
      if (this.pswp.container) {
        setTransform(this.pswp.container, x);
      }
      this.pswp.dispatch("moveMainScroll", {
        x,
        dragging: dragging !== null && dragging !== void 0 ? dragging : false
      });
    }
  }
  const KeyboardKeyCodesMap = {
    Escape: 27,
    z: 90,
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    Tab: 9
  };
  const getKeyboardEventKey = (key, isKeySupported) => {
    return isKeySupported ? key : KeyboardKeyCodesMap[key];
  };
  class Keyboard {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp) {
      this.pswp = pswp;
      this._wasFocused = false;
      pswp.on("bindEvents", () => {
        if (pswp.options.trapFocus) {
          if (!pswp.options.initialPointerPos) {
            this._focusRoot();
          }
          pswp.events.add(
            document,
            "focusin",
            /** @type EventListener */
            this._onFocusIn.bind(this)
          );
        }
        pswp.events.add(
          document,
          "keydown",
          /** @type EventListener */
          this._onKeyDown.bind(this)
        );
      });
      const lastActiveElement = (
        /** @type {HTMLElement} */
        document.activeElement
      );
      pswp.on("destroy", () => {
        if (pswp.options.returnFocus && lastActiveElement && this._wasFocused) {
          lastActiveElement.focus();
        }
      });
    }
    /** @private */
    _focusRoot() {
      if (!this._wasFocused && this.pswp.element) {
        this.pswp.element.focus();
        this._wasFocused = true;
      }
    }
    /**
     * @private
     * @param {KeyboardEvent} e
     */
    _onKeyDown(e) {
      const {
        pswp
      } = this;
      if (pswp.dispatch("keydown", {
        originalEvent: e
      }).defaultPrevented) {
        return;
      }
      if (specialKeyUsed$1(e)) {
        return;
      }
      let keydownAction;
      let axis;
      let isForward = false;
      const isKeySupported = "key" in e;
      switch (isKeySupported ? e.key : e.keyCode) {
        case getKeyboardEventKey("Escape", isKeySupported):
          if (pswp.options.escKey) {
            keydownAction = "close";
          }
          break;
        case getKeyboardEventKey("z", isKeySupported):
          keydownAction = "toggleZoom";
          break;
        case getKeyboardEventKey("ArrowLeft", isKeySupported):
          axis = "x";
          break;
        case getKeyboardEventKey("ArrowUp", isKeySupported):
          axis = "y";
          break;
        case getKeyboardEventKey("ArrowRight", isKeySupported):
          axis = "x";
          isForward = true;
          break;
        case getKeyboardEventKey("ArrowDown", isKeySupported):
          isForward = true;
          axis = "y";
          break;
        case getKeyboardEventKey("Tab", isKeySupported):
          this._focusRoot();
          break;
      }
      if (axis) {
        e.preventDefault();
        const {
          currSlide
        } = pswp;
        if (pswp.options.arrowKeys && axis === "x" && pswp.getNumItems() > 1) {
          keydownAction = isForward ? "next" : "prev";
        } else if (currSlide && currSlide.currZoomLevel > currSlide.zoomLevels.fit) {
          currSlide.pan[axis] += isForward ? -80 : 80;
          currSlide.panTo(currSlide.pan.x, currSlide.pan.y);
        }
      }
      if (keydownAction) {
        e.preventDefault();
        pswp[keydownAction]();
      }
    }
    /**
     * Trap focus inside photoswipe
     *
     * @private
     * @param {FocusEvent} e
     */
    _onFocusIn(e) {
      const {
        template
      } = this.pswp;
      if (template && document !== e.target && template !== e.target && !template.contains(
        /** @type {Node} */
        e.target
      )) {
        template.focus();
      }
    }
  }
  const DEFAULT_EASING = "cubic-bezier(.4,0,.22,1)";
  class CSSAnimation {
    /**
     * onComplete can be unpredictable, be careful about current state
     *
     * @param {CssAnimationProps} props
     */
    constructor(props) {
      var _props$prop;
      this.props = props;
      const {
        target,
        onComplete,
        transform,
        onFinish = () => {
        },
        duration = 333,
        easing = DEFAULT_EASING
      } = props;
      this.onFinish = onFinish;
      const prop = transform ? "transform" : "opacity";
      const propValue = (_props$prop = props[prop]) !== null && _props$prop !== void 0 ? _props$prop : "";
      this._target = target;
      this._onComplete = onComplete;
      this._finished = false;
      this._onTransitionEnd = this._onTransitionEnd.bind(this);
      this._helperTimeout = setTimeout(() => {
        setTransitionStyle(target, prop, duration, easing);
        this._helperTimeout = setTimeout(() => {
          target.addEventListener("transitionend", this._onTransitionEnd, false);
          target.addEventListener("transitioncancel", this._onTransitionEnd, false);
          this._helperTimeout = setTimeout(() => {
            this._finalizeAnimation();
          }, duration + 500);
          target.style[prop] = propValue;
        }, 30);
      }, 0);
    }
    /**
     * @private
     * @param {TransitionEvent} e
     */
    _onTransitionEnd(e) {
      if (e.target === this._target) {
        this._finalizeAnimation();
      }
    }
    /**
     * @private
     */
    _finalizeAnimation() {
      if (!this._finished) {
        this._finished = true;
        this.onFinish();
        if (this._onComplete) {
          this._onComplete();
        }
      }
    }
    // Destroy is called automatically onFinish
    destroy() {
      if (this._helperTimeout) {
        clearTimeout(this._helperTimeout);
      }
      removeTransitionStyle(this._target);
      this._target.removeEventListener("transitionend", this._onTransitionEnd, false);
      this._target.removeEventListener("transitioncancel", this._onTransitionEnd, false);
      if (!this._finished) {
        this._finalizeAnimation();
      }
    }
  }
  const DEFAULT_NATURAL_FREQUENCY = 12;
  const DEFAULT_DAMPING_RATIO = 0.75;
  class SpringEaser {
    /**
     * @param {number} initialVelocity Initial velocity, px per ms.
     *
     * @param {number} [dampingRatio]
     * Determines how bouncy animation will be.
     * From 0 to 1, 0 - always overshoot, 1 - do not overshoot.
     * "overshoot" refers to part of animation that
     * goes beyond the final value.
     *
     * @param {number} [naturalFrequency]
     * Determines how fast animation will slow down.
     * The higher value - the stiffer the transition will be,
     * and the faster it will slow down.
     * Recommended value from 10 to 50
     */
    constructor(initialVelocity, dampingRatio, naturalFrequency) {
      this.velocity = initialVelocity * 1e3;
      this._dampingRatio = dampingRatio || DEFAULT_DAMPING_RATIO;
      this._naturalFrequency = naturalFrequency || DEFAULT_NATURAL_FREQUENCY;
      this._dampedFrequency = this._naturalFrequency;
      if (this._dampingRatio < 1) {
        this._dampedFrequency *= Math.sqrt(1 - this._dampingRatio * this._dampingRatio);
      }
    }
    /**
     * @param {number} deltaPosition Difference between current and end position of the animation
     * @param {number} deltaTime Frame duration in milliseconds
     *
     * @returns {number} Displacement, relative to the end position.
     */
    easeFrame(deltaPosition, deltaTime) {
      let displacement = 0;
      let coeff;
      deltaTime /= 1e3;
      const naturalDumpingPow = Math.E ** (-this._dampingRatio * this._naturalFrequency * deltaTime);
      if (this._dampingRatio === 1) {
        coeff = this.velocity + this._naturalFrequency * deltaPosition;
        displacement = (deltaPosition + coeff * deltaTime) * naturalDumpingPow;
        this.velocity = displacement * -this._naturalFrequency + coeff * naturalDumpingPow;
      } else if (this._dampingRatio < 1) {
        coeff = 1 / this._dampedFrequency * (this._dampingRatio * this._naturalFrequency * deltaPosition + this.velocity);
        const dumpedFCos = Math.cos(this._dampedFrequency * deltaTime);
        const dumpedFSin = Math.sin(this._dampedFrequency * deltaTime);
        displacement = naturalDumpingPow * (deltaPosition * dumpedFCos + coeff * dumpedFSin);
        this.velocity = displacement * -this._naturalFrequency * this._dampingRatio + naturalDumpingPow * (-this._dampedFrequency * deltaPosition * dumpedFSin + this._dampedFrequency * coeff * dumpedFCos);
      }
      return displacement;
    }
  }
  class SpringAnimation {
    /**
     * @param {SpringAnimationProps} props
     */
    constructor(props) {
      this.props = props;
      this._raf = 0;
      const {
        start,
        end,
        velocity,
        onUpdate,
        onComplete,
        onFinish = () => {
        },
        dampingRatio,
        naturalFrequency
      } = props;
      this.onFinish = onFinish;
      const easer = new SpringEaser(velocity, dampingRatio, naturalFrequency);
      let prevTime = Date.now();
      let deltaPosition = start - end;
      const animationLoop = () => {
        if (this._raf) {
          deltaPosition = easer.easeFrame(deltaPosition, Date.now() - prevTime);
          if (Math.abs(deltaPosition) < 1 && Math.abs(easer.velocity) < 50) {
            onUpdate(end);
            if (onComplete) {
              onComplete();
            }
            this.onFinish();
          } else {
            prevTime = Date.now();
            onUpdate(deltaPosition + end);
            this._raf = requestAnimationFrame(animationLoop);
          }
        }
      };
      this._raf = requestAnimationFrame(animationLoop);
    }
    // Destroy is called automatically onFinish
    destroy() {
      if (this._raf >= 0) {
        cancelAnimationFrame(this._raf);
      }
      this._raf = 0;
    }
  }
  class Animations {
    constructor() {
      this.activeAnimations = [];
    }
    /**
     * @param {SpringAnimationProps} props
     */
    startSpring(props) {
      this._start(props, true);
    }
    /**
     * @param {CssAnimationProps} props
     */
    startTransition(props) {
      this._start(props);
    }
    /**
     * @private
     * @param {AnimationProps} props
     * @param {boolean} [isSpring]
     * @returns {Animation}
     */
    _start(props, isSpring) {
      const animation = isSpring ? new SpringAnimation(
        /** @type SpringAnimationProps */
        props
      ) : new CSSAnimation(
        /** @type CssAnimationProps */
        props
      );
      this.activeAnimations.push(animation);
      animation.onFinish = () => this.stop(animation);
      return animation;
    }
    /**
     * @param {Animation} animation
     */
    stop(animation) {
      animation.destroy();
      const index = this.activeAnimations.indexOf(animation);
      if (index > -1) {
        this.activeAnimations.splice(index, 1);
      }
    }
    stopAll() {
      this.activeAnimations.forEach((animation) => {
        animation.destroy();
      });
      this.activeAnimations = [];
    }
    /**
     * Stop all pan or zoom transitions
     */
    stopAllPan() {
      this.activeAnimations = this.activeAnimations.filter((animation) => {
        if (animation.props.isPan) {
          animation.destroy();
          return false;
        }
        return true;
      });
    }
    stopMainScroll() {
      this.activeAnimations = this.activeAnimations.filter((animation) => {
        if (animation.props.isMainScroll) {
          animation.destroy();
          return false;
        }
        return true;
      });
    }
    /**
     * Returns true if main scroll transition is running
     */
    // isMainScrollRunning() {
    //   return this.activeAnimations.some((animation) => {
    //     return animation.props.isMainScroll;
    //   });
    // }
    /**
     * Returns true if any pan or zoom transition is running
     */
    isPanRunning() {
      return this.activeAnimations.some((animation) => {
        return animation.props.isPan;
      });
    }
  }
  class ScrollWheel {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp) {
      this.pswp = pswp;
      pswp.events.add(
        pswp.element,
        "wheel",
        /** @type EventListener */
        this._onWheel.bind(this)
      );
    }
    /**
     * @private
     * @param {WheelEvent} e
     */
    _onWheel(e) {
      e.preventDefault();
      const {
        currSlide
      } = this.pswp;
      let {
        deltaX,
        deltaY
      } = e;
      if (!currSlide) {
        return;
      }
      if (this.pswp.dispatch("wheel", {
        originalEvent: e
      }).defaultPrevented) {
        return;
      }
      if (e.ctrlKey || this.pswp.options.wheelToZoom) {
        if (currSlide.isZoomable()) {
          let zoomFactor = -deltaY;
          if (e.deltaMode === 1) {
            zoomFactor *= 0.05;
          } else {
            zoomFactor *= e.deltaMode ? 1 : 2e-3;
          }
          zoomFactor = 2 ** zoomFactor;
          const destZoomLevel = currSlide.currZoomLevel * zoomFactor;
          currSlide.zoomTo(destZoomLevel, {
            x: e.clientX,
            y: e.clientY
          });
        }
      } else {
        if (currSlide.isPannable()) {
          if (e.deltaMode === 1) {
            deltaX *= 18;
            deltaY *= 18;
          }
          currSlide.panTo(currSlide.pan.x - deltaX, currSlide.pan.y - deltaY);
        }
      }
    }
  }
  function addElementHTML(htmlData) {
    if (typeof htmlData === "string") {
      return htmlData;
    }
    if (!htmlData || !htmlData.isCustomSVG) {
      return "";
    }
    const svgData = htmlData;
    let out = '<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 %d %d" width="%d" height="%d">';
    out = out.split("%d").join(
      /** @type {string} */
      svgData.size || 32
    );
    if (svgData.outlineID) {
      out += '<use class="pswp__icn-shadow" xlink:href="#' + svgData.outlineID + '"/>';
    }
    out += svgData.inner;
    out += "</svg>";
    return out;
  }
  class UIElement {
    /**
     * @param {PhotoSwipe} pswp
     * @param {UIElementData} data
     */
    constructor(pswp, data) {
      var _container;
      const name = data.name || data.className;
      let elementHTML = data.html;
      if (pswp.options[name] === false) {
        return;
      }
      if (typeof pswp.options[name + "SVG"] === "string") {
        elementHTML = pswp.options[name + "SVG"];
      }
      pswp.dispatch("uiElementCreate", {
        data
      });
      let className = "";
      if (data.isButton) {
        className += "pswp__button ";
        className += data.className || `pswp__button--${data.name}`;
      } else {
        className += data.className || `pswp__${data.name}`;
      }
      let tagName = data.isButton ? data.tagName || "button" : data.tagName || "div";
      tagName = /** @type {keyof HTMLElementTagNameMap} */
      tagName.toLowerCase();
      const element = createElement$1(className, tagName);
      if (data.isButton) {
        if (tagName === "button") {
          element.type = "button";
        }
        let {
          title
        } = data;
        const {
          ariaLabel
        } = data;
        if (typeof pswp.options[name + "Title"] === "string") {
          title = pswp.options[name + "Title"];
        }
        if (title) {
          element.title = title;
        }
        const ariaText = ariaLabel || title;
        if (ariaText) {
          element.setAttribute("aria-label", ariaText);
        }
      }
      element.innerHTML = addElementHTML(elementHTML);
      if (data.onInit) {
        data.onInit(element, pswp);
      }
      if (data.onClick) {
        element.onclick = (e) => {
          if (typeof data.onClick === "string") {
            pswp[data.onClick]();
          } else if (typeof data.onClick === "function") {
            data.onClick(e, element, pswp);
          }
        };
      }
      const appendTo = data.appendTo || "bar";
      let container = pswp.element;
      if (appendTo === "bar") {
        if (!pswp.topBar) {
          pswp.topBar = createElement$1("pswp__top-bar pswp__hide-on-close", "div", pswp.scrollWrap);
        }
        container = pswp.topBar;
      } else {
        element.classList.add("pswp__hide-on-close");
        if (appendTo === "wrapper") {
          container = pswp.scrollWrap;
        }
      }
      (_container = container) === null || _container === void 0 || _container.appendChild(pswp.applyFilters("uiElement", element, data));
    }
  }
  function initArrowButton(element, pswp, isNextButton) {
    element.classList.add("pswp__button--arrow");
    element.setAttribute("aria-controls", "pswp__items");
    pswp.on("change", () => {
      if (!pswp.options.loop) {
        if (isNextButton) {
          element.disabled = !(pswp.currIndex < pswp.getNumItems() - 1);
        } else {
          element.disabled = !(pswp.currIndex > 0);
        }
      }
    });
  }
  const arrowPrev = {
    name: "arrowPrev",
    className: "pswp__button--arrow--prev",
    title: "Previous",
    order: 10,
    isButton: true,
    appendTo: "wrapper",
    html: {
      isCustomSVG: true,
      size: 60,
      inner: '<path d="M29 43l-3 3-16-16 16-16 3 3-13 13 13 13z" id="pswp__icn-arrow"/>',
      outlineID: "pswp__icn-arrow"
    },
    onClick: "prev",
    onInit: initArrowButton
  };
  const arrowNext = {
    name: "arrowNext",
    className: "pswp__button--arrow--next",
    title: "Next",
    order: 11,
    isButton: true,
    appendTo: "wrapper",
    html: {
      isCustomSVG: true,
      size: 60,
      inner: '<use xlink:href="#pswp__icn-arrow"/>',
      outlineID: "pswp__icn-arrow"
    },
    onClick: "next",
    onInit: (el, pswp) => {
      initArrowButton(el, pswp, true);
    }
  };
  const closeButton = {
    name: "close",
    title: "Close",
    order: 20,
    isButton: true,
    html: {
      isCustomSVG: true,
      inner: '<path d="M24 10l-2-2-6 6-6-6-2 2 6 6-6 6 2 2 6-6 6 6 2-2-6-6z" id="pswp__icn-close"/>',
      outlineID: "pswp__icn-close"
    },
    onClick: "close"
  };
  const zoomButton = {
    name: "zoom",
    title: "Zoom",
    order: 10,
    isButton: true,
    html: {
      isCustomSVG: true,
      // eslint-disable-next-line max-len
      inner: '<path d="M17.426 19.926a6 6 0 1 1 1.5-1.5L23 22.5 21.5 24l-4.074-4.074z" id="pswp__icn-zoom"/><path fill="currentColor" class="pswp__zoom-icn-bar-h" d="M11 16v-2h6v2z"/><path fill="currentColor" class="pswp__zoom-icn-bar-v" d="M13 12h2v6h-2z"/>',
      outlineID: "pswp__icn-zoom"
    },
    onClick: "toggleZoom"
  };
  const loadingIndicator = {
    name: "preloader",
    appendTo: "bar",
    order: 7,
    html: {
      isCustomSVG: true,
      // eslint-disable-next-line max-len
      inner: '<path fill-rule="evenodd" clip-rule="evenodd" d="M21.2 16a5.2 5.2 0 1 1-5.2-5.2V8a8 8 0 1 0 8 8h-2.8Z" id="pswp__icn-loading"/>',
      outlineID: "pswp__icn-loading"
    },
    onInit: (indicatorElement, pswp) => {
      let isVisible;
      let delayTimeout = null;
      const toggleIndicatorClass = (className, add) => {
        indicatorElement.classList.toggle("pswp__preloader--" + className, add);
      };
      const setIndicatorVisibility = (visible) => {
        if (isVisible !== visible) {
          isVisible = visible;
          toggleIndicatorClass("active", visible);
        }
      };
      const updatePreloaderVisibility = () => {
        var _pswp$currSlide;
        if (!((_pswp$currSlide = pswp.currSlide) !== null && _pswp$currSlide !== void 0 && _pswp$currSlide.content.isLoading())) {
          setIndicatorVisibility(false);
          if (delayTimeout) {
            clearTimeout(delayTimeout);
            delayTimeout = null;
          }
          return;
        }
        if (!delayTimeout) {
          delayTimeout = setTimeout(() => {
            var _pswp$currSlide2;
            setIndicatorVisibility(Boolean((_pswp$currSlide2 = pswp.currSlide) === null || _pswp$currSlide2 === void 0 ? void 0 : _pswp$currSlide2.content.isLoading()));
            delayTimeout = null;
          }, pswp.options.preloaderDelay);
        }
      };
      pswp.on("change", updatePreloaderVisibility);
      pswp.on("loadComplete", (e) => {
        if (pswp.currSlide === e.slide) {
          updatePreloaderVisibility();
        }
      });
      if (pswp.ui) {
        pswp.ui.updatePreloaderVisibility = updatePreloaderVisibility;
      }
    }
  };
  const counterIndicator = {
    name: "counter",
    order: 5,
    onInit: (counterElement, pswp) => {
      pswp.on("change", () => {
        counterElement.innerText = pswp.currIndex + 1 + pswp.options.indexIndicatorSep + pswp.getNumItems();
      });
    }
  };
  function setZoomedIn(el, isZoomedIn) {
    el.classList.toggle("pswp--zoomed-in", isZoomedIn);
  }
  class UI {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp) {
      this.pswp = pswp;
      this.isRegistered = false;
      this.uiElementsData = [];
      this.items = [];
      this.updatePreloaderVisibility = () => {
      };
      this._lastUpdatedZoomLevel = void 0;
    }
    init() {
      const {
        pswp
      } = this;
      this.isRegistered = false;
      this.uiElementsData = [closeButton, arrowPrev, arrowNext, zoomButton, loadingIndicator, counterIndicator];
      pswp.dispatch("uiRegister");
      this.uiElementsData.sort((a, b) => {
        return (a.order || 0) - (b.order || 0);
      });
      this.items = [];
      this.isRegistered = true;
      this.uiElementsData.forEach((uiElementData) => {
        this.registerElement(uiElementData);
      });
      pswp.on("change", () => {
        var _pswp$element;
        (_pswp$element = pswp.element) === null || _pswp$element === void 0 || _pswp$element.classList.toggle("pswp--one-slide", pswp.getNumItems() === 1);
      });
      pswp.on("zoomPanUpdate", () => this._onZoomPanUpdate());
    }
    /**
     * @param {UIElementData} elementData
     */
    registerElement(elementData) {
      if (this.isRegistered) {
        this.items.push(new UIElement(this.pswp, elementData));
      } else {
        this.uiElementsData.push(elementData);
      }
    }
    /**
     * Fired each time zoom or pan position is changed.
     * Update classes that control visibility of zoom button and cursor icon.
     *
     * @private
     */
    _onZoomPanUpdate() {
      const {
        template,
        currSlide,
        options
      } = this.pswp;
      if (this.pswp.opener.isClosing || !template || !currSlide) {
        return;
      }
      let {
        currZoomLevel
      } = currSlide;
      if (!this.pswp.opener.isOpen) {
        currZoomLevel = currSlide.zoomLevels.initial;
      }
      if (currZoomLevel === this._lastUpdatedZoomLevel) {
        return;
      }
      this._lastUpdatedZoomLevel = currZoomLevel;
      const currZoomLevelDiff = currSlide.zoomLevels.initial - currSlide.zoomLevels.secondary;
      if (Math.abs(currZoomLevelDiff) < 0.01 || !currSlide.isZoomable()) {
        setZoomedIn(template, false);
        template.classList.remove("pswp--zoom-allowed");
        return;
      }
      template.classList.add("pswp--zoom-allowed");
      const potentialZoomLevel = currZoomLevel === currSlide.zoomLevels.initial ? currSlide.zoomLevels.secondary : currSlide.zoomLevels.initial;
      setZoomedIn(template, potentialZoomLevel <= currZoomLevel);
      if (options.imageClickAction === "zoom" || options.imageClickAction === "zoom-or-close") {
        template.classList.add("pswp--click-to-zoom");
      }
    }
  }
  function getBoundsByElement(el) {
    const thumbAreaRect = el.getBoundingClientRect();
    return {
      x: thumbAreaRect.left,
      y: thumbAreaRect.top,
      w: thumbAreaRect.width
    };
  }
  function getCroppedBoundsByElement(el, imageWidth, imageHeight) {
    const thumbAreaRect = el.getBoundingClientRect();
    const hRatio = thumbAreaRect.width / imageWidth;
    const vRatio = thumbAreaRect.height / imageHeight;
    const fillZoomLevel = hRatio > vRatio ? hRatio : vRatio;
    const offsetX = (thumbAreaRect.width - imageWidth * fillZoomLevel) / 2;
    const offsetY = (thumbAreaRect.height - imageHeight * fillZoomLevel) / 2;
    const bounds = {
      x: thumbAreaRect.left + offsetX,
      y: thumbAreaRect.top + offsetY,
      w: imageWidth * fillZoomLevel
    };
    bounds.innerRect = {
      w: thumbAreaRect.width,
      h: thumbAreaRect.height,
      x: offsetX,
      y: offsetY
    };
    return bounds;
  }
  function getThumbBounds(index, itemData, instance) {
    const event = instance.dispatch("thumbBounds", {
      index,
      itemData,
      instance
    });
    if (event.thumbBounds) {
      return event.thumbBounds;
    }
    const {
      element
    } = itemData;
    let thumbBounds;
    let thumbnail;
    if (element && instance.options.thumbSelector !== false) {
      const thumbSelector = instance.options.thumbSelector || "img";
      thumbnail = element.matches(thumbSelector) ? element : (
        /** @type {HTMLElement | null} */
        element.querySelector(thumbSelector)
      );
    }
    thumbnail = instance.applyFilters("thumbEl", thumbnail, itemData, index);
    if (thumbnail) {
      if (!itemData.thumbCropped) {
        thumbBounds = getBoundsByElement(thumbnail);
      } else {
        thumbBounds = getCroppedBoundsByElement(thumbnail, itemData.width || itemData.w || 0, itemData.height || itemData.h || 0);
      }
    }
    return instance.applyFilters("thumbBounds", thumbBounds, itemData, index);
  }
  let PhotoSwipeEvent$1 = class PhotoSwipeEvent {
    /**
     * @param {T} type
     * @param {PhotoSwipeEventsMap[T]} [details]
     */
    constructor(type, details) {
      this.type = type;
      this.defaultPrevented = false;
      if (details) {
        Object.assign(this, details);
      }
    }
    preventDefault() {
      this.defaultPrevented = true;
    }
  };
  let Eventable$1 = class Eventable {
    constructor() {
      this._listeners = {};
      this._filters = {};
      this.pswp = void 0;
      this.options = void 0;
    }
    /**
     * @template {keyof PhotoSwipeFiltersMap} T
     * @param {T} name
     * @param {PhotoSwipeFiltersMap[T]} fn
     * @param {number} priority
     */
    addFilter(name, fn, priority = 100) {
      var _this$_filters$name, _this$_filters$name2, _this$pswp;
      if (!this._filters[name]) {
        this._filters[name] = [];
      }
      (_this$_filters$name = this._filters[name]) === null || _this$_filters$name === void 0 || _this$_filters$name.push({
        fn,
        priority
      });
      (_this$_filters$name2 = this._filters[name]) === null || _this$_filters$name2 === void 0 || _this$_filters$name2.sort((f1, f2) => f1.priority - f2.priority);
      (_this$pswp = this.pswp) === null || _this$pswp === void 0 || _this$pswp.addFilter(name, fn, priority);
    }
    /**
     * @template {keyof PhotoSwipeFiltersMap} T
     * @param {T} name
     * @param {PhotoSwipeFiltersMap[T]} fn
     */
    removeFilter(name, fn) {
      if (this._filters[name]) {
        this._filters[name] = this._filters[name].filter((filter) => filter.fn !== fn);
      }
      if (this.pswp) {
        this.pswp.removeFilter(name, fn);
      }
    }
    /**
     * @template {keyof PhotoSwipeFiltersMap} T
     * @param {T} name
     * @param {Parameters<PhotoSwipeFiltersMap[T]>} args
     * @returns {Parameters<PhotoSwipeFiltersMap[T]>[0]}
     */
    applyFilters(name, ...args) {
      var _this$_filters$name3;
      (_this$_filters$name3 = this._filters[name]) === null || _this$_filters$name3 === void 0 || _this$_filters$name3.forEach((filter) => {
        args[0] = filter.fn.apply(this, args);
      });
      return args[0];
    }
    /**
     * @template {keyof PhotoSwipeEventsMap} T
     * @param {T} name
     * @param {EventCallback<T>} fn
     */
    on(name, fn) {
      var _this$_listeners$name, _this$pswp2;
      if (!this._listeners[name]) {
        this._listeners[name] = [];
      }
      (_this$_listeners$name = this._listeners[name]) === null || _this$_listeners$name === void 0 || _this$_listeners$name.push(fn);
      (_this$pswp2 = this.pswp) === null || _this$pswp2 === void 0 || _this$pswp2.on(name, fn);
    }
    /**
     * @template {keyof PhotoSwipeEventsMap} T
     * @param {T} name
     * @param {EventCallback<T>} fn
     */
    off(name, fn) {
      var _this$pswp3;
      if (this._listeners[name]) {
        this._listeners[name] = this._listeners[name].filter((listener) => fn !== listener);
      }
      (_this$pswp3 = this.pswp) === null || _this$pswp3 === void 0 || _this$pswp3.off(name, fn);
    }
    /**
     * @template {keyof PhotoSwipeEventsMap} T
     * @param {T} name
     * @param {PhotoSwipeEventsMap[T]} [details]
     * @returns {AugmentedEvent<T>}
     */
    dispatch(name, details) {
      var _this$_listeners$name2;
      if (this.pswp) {
        return this.pswp.dispatch(name, details);
      }
      const event = (
        /** @type {AugmentedEvent<T>} */
        new PhotoSwipeEvent$1(name, details)
      );
      (_this$_listeners$name2 = this._listeners[name]) === null || _this$_listeners$name2 === void 0 || _this$_listeners$name2.forEach((listener) => {
        listener.call(this, event);
      });
      return event;
    }
  };
  let Placeholder$1 = class Placeholder {
    /**
     * @param {string | false} imageSrc
     * @param {HTMLElement} container
     */
    constructor(imageSrc, container) {
      this.element = createElement$1("pswp__img pswp__img--placeholder", imageSrc ? "img" : "div", container);
      if (imageSrc) {
        const imgEl = (
          /** @type {HTMLImageElement} */
          this.element
        );
        imgEl.decoding = "async";
        imgEl.alt = "";
        imgEl.src = imageSrc;
        imgEl.setAttribute("role", "presentation");
      }
      this.element.setAttribute("aria-hidden", "true");
    }
    /**
     * @param {number} width
     * @param {number} height
     */
    setDisplayedSize(width, height) {
      if (!this.element) {
        return;
      }
      if (this.element.tagName === "IMG") {
        setWidthHeight$1(this.element, 250, "auto");
        this.element.style.transformOrigin = "0 0";
        this.element.style.transform = toTransformString$1(0, 0, width / 250);
      } else {
        setWidthHeight$1(this.element, width, height);
      }
    }
    destroy() {
      var _this$element;
      if ((_this$element = this.element) !== null && _this$element !== void 0 && _this$element.parentNode) {
        this.element.remove();
      }
      this.element = null;
    }
  };
  let Content$1 = class Content {
    /**
     * @param {SlideData} itemData Slide data
     * @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox instance
     * @param {number} index
     */
    constructor(itemData, instance, index) {
      this.instance = instance;
      this.data = itemData;
      this.index = index;
      this.element = void 0;
      this.placeholder = void 0;
      this.slide = void 0;
      this.displayedImageWidth = 0;
      this.displayedImageHeight = 0;
      this.width = Number(this.data.w) || Number(this.data.width) || 0;
      this.height = Number(this.data.h) || Number(this.data.height) || 0;
      this.isAttached = false;
      this.hasSlide = false;
      this.isDecoding = false;
      this.state = LOAD_STATE$1.IDLE;
      if (this.data.type) {
        this.type = this.data.type;
      } else if (this.data.src) {
        this.type = "image";
      } else {
        this.type = "html";
      }
      this.instance.dispatch("contentInit", {
        content: this
      });
    }
    removePlaceholder() {
      if (this.placeholder && !this.keepPlaceholder()) {
        setTimeout(() => {
          if (this.placeholder) {
            this.placeholder.destroy();
            this.placeholder = void 0;
          }
        }, 1e3);
      }
    }
    /**
     * Preload content
     *
     * @param {boolean} isLazy
     * @param {boolean} [reload]
     */
    load(isLazy, reload) {
      if (this.slide && this.usePlaceholder()) {
        if (!this.placeholder) {
          const placeholderSrc = this.instance.applyFilters(
            "placeholderSrc",
            // use  image-based placeholder only for the first slide,
            // as rendering (even small stretched thumbnail) is an expensive operation
            this.data.msrc && this.slide.isFirstSlide ? this.data.msrc : false,
            this
          );
          this.placeholder = new Placeholder$1(placeholderSrc, this.slide.container);
        } else {
          const placeholderEl = this.placeholder.element;
          if (placeholderEl && !placeholderEl.parentElement) {
            this.slide.container.prepend(placeholderEl);
          }
        }
      }
      if (this.element && !reload) {
        return;
      }
      if (this.instance.dispatch("contentLoad", {
        content: this,
        isLazy
      }).defaultPrevented) {
        return;
      }
      if (this.isImageContent()) {
        this.element = createElement$1("pswp__img", "img");
        if (this.displayedImageWidth) {
          this.loadImage(isLazy);
        }
      } else {
        this.element = createElement$1("pswp__content", "div");
        this.element.innerHTML = this.data.html || "";
      }
      if (reload && this.slide) {
        this.slide.updateContentSize(true);
      }
    }
    /**
     * Preload image
     *
     * @param {boolean} isLazy
     */
    loadImage(isLazy) {
      var _this$data$src, _this$data$alt;
      if (!this.isImageContent() || !this.element || this.instance.dispatch("contentLoadImage", {
        content: this,
        isLazy
      }).defaultPrevented) {
        return;
      }
      const imageElement = (
        /** @type HTMLImageElement */
        this.element
      );
      this.updateSrcsetSizes();
      if (this.data.srcset) {
        imageElement.srcset = this.data.srcset;
      }
      imageElement.src = (_this$data$src = this.data.src) !== null && _this$data$src !== void 0 ? _this$data$src : "";
      imageElement.alt = (_this$data$alt = this.data.alt) !== null && _this$data$alt !== void 0 ? _this$data$alt : "";
      this.state = LOAD_STATE$1.LOADING;
      if (imageElement.complete) {
        this.onLoaded();
      } else {
        imageElement.onload = () => {
          this.onLoaded();
        };
        imageElement.onerror = () => {
          this.onError();
        };
      }
    }
    /**
     * Assign slide to content
     *
     * @param {Slide} slide
     */
    setSlide(slide) {
      this.slide = slide;
      this.hasSlide = true;
      this.instance = slide.pswp;
    }
    /**
     * Content load success handler
     */
    onLoaded() {
      this.state = LOAD_STATE$1.LOADED;
      if (this.slide && this.element) {
        this.instance.dispatch("loadComplete", {
          slide: this.slide,
          content: this
        });
        if (this.slide.isActive && this.slide.heavyAppended && !this.element.parentNode) {
          this.append();
          this.slide.updateContentSize(true);
        }
        if (this.state === LOAD_STATE$1.LOADED || this.state === LOAD_STATE$1.ERROR) {
          this.removePlaceholder();
        }
      }
    }
    /**
     * Content load error handler
     */
    onError() {
      this.state = LOAD_STATE$1.ERROR;
      if (this.slide) {
        this.displayError();
        this.instance.dispatch("loadComplete", {
          slide: this.slide,
          isError: true,
          content: this
        });
        this.instance.dispatch("loadError", {
          slide: this.slide,
          content: this
        });
      }
    }
    /**
     * @returns {Boolean} If the content is currently loading
     */
    isLoading() {
      return this.instance.applyFilters("isContentLoading", this.state === LOAD_STATE$1.LOADING, this);
    }
    /**
     * @returns {Boolean} If the content is in error state
     */
    isError() {
      return this.state === LOAD_STATE$1.ERROR;
    }
    /**
     * @returns {boolean} If the content is image
     */
    isImageContent() {
      return this.type === "image";
    }
    /**
     * Update content size
     *
     * @param {Number} width
     * @param {Number} height
     */
    setDisplayedSize(width, height) {
      if (!this.element) {
        return;
      }
      if (this.placeholder) {
        this.placeholder.setDisplayedSize(width, height);
      }
      if (this.instance.dispatch("contentResize", {
        content: this,
        width,
        height
      }).defaultPrevented) {
        return;
      }
      setWidthHeight$1(this.element, width, height);
      if (this.isImageContent() && !this.isError()) {
        const isInitialSizeUpdate = !this.displayedImageWidth && width;
        this.displayedImageWidth = width;
        this.displayedImageHeight = height;
        if (isInitialSizeUpdate) {
          this.loadImage(false);
        } else {
          this.updateSrcsetSizes();
        }
        if (this.slide) {
          this.instance.dispatch("imageSizeChange", {
            slide: this.slide,
            width,
            height,
            content: this
          });
        }
      }
    }
    /**
     * @returns {boolean} If the content can be zoomed
     */
    isZoomable() {
      return this.instance.applyFilters("isContentZoomable", this.isImageContent() && this.state !== LOAD_STATE$1.ERROR, this);
    }
    /**
     * Update image srcset sizes attribute based on width and height
     */
    updateSrcsetSizes() {
      if (!this.isImageContent() || !this.element || !this.data.srcset) {
        return;
      }
      const image = (
        /** @type HTMLImageElement */
        this.element
      );
      const sizesWidth = this.instance.applyFilters("srcsetSizesWidth", this.displayedImageWidth, this);
      if (!image.dataset.largestUsedSize || sizesWidth > parseInt(image.dataset.largestUsedSize, 10)) {
        image.sizes = sizesWidth + "px";
        image.dataset.largestUsedSize = String(sizesWidth);
      }
    }
    /**
     * @returns {boolean} If content should use a placeholder (from msrc by default)
     */
    usePlaceholder() {
      return this.instance.applyFilters("useContentPlaceholder", this.isImageContent(), this);
    }
    /**
     * Preload content with lazy-loading param
     */
    lazyLoad() {
      if (this.instance.dispatch("contentLazyLoad", {
        content: this
      }).defaultPrevented) {
        return;
      }
      this.load(true);
    }
    /**
     * @returns {boolean} If placeholder should be kept after content is loaded
     */
    keepPlaceholder() {
      return this.instance.applyFilters("isKeepingPlaceholder", this.isLoading(), this);
    }
    /**
     * Destroy the content
     */
    destroy() {
      this.hasSlide = false;
      this.slide = void 0;
      if (this.instance.dispatch("contentDestroy", {
        content: this
      }).defaultPrevented) {
        return;
      }
      this.remove();
      if (this.placeholder) {
        this.placeholder.destroy();
        this.placeholder = void 0;
      }
      if (this.isImageContent() && this.element) {
        this.element.onload = null;
        this.element.onerror = null;
        this.element = void 0;
      }
    }
    /**
     * Display error message
     */
    displayError() {
      if (this.slide) {
        var _this$instance$option, _this$instance$option2;
        let errorMsgEl = createElement$1("pswp__error-msg", "div");
        errorMsgEl.innerText = (_this$instance$option = (_this$instance$option2 = this.instance.options) === null || _this$instance$option2 === void 0 ? void 0 : _this$instance$option2.errorMsg) !== null && _this$instance$option !== void 0 ? _this$instance$option : "";
        errorMsgEl = /** @type {HTMLDivElement} */
        this.instance.applyFilters("contentErrorElement", errorMsgEl, this);
        this.element = createElement$1("pswp__content pswp__error-msg-container", "div");
        this.element.appendChild(errorMsgEl);
        this.slide.container.innerText = "";
        this.slide.container.appendChild(this.element);
        this.slide.updateContentSize(true);
        this.removePlaceholder();
      }
    }
    /**
     * Append the content
     */
    append() {
      if (this.isAttached || !this.element) {
        return;
      }
      this.isAttached = true;
      if (this.state === LOAD_STATE$1.ERROR) {
        this.displayError();
        return;
      }
      if (this.instance.dispatch("contentAppend", {
        content: this
      }).defaultPrevented) {
        return;
      }
      const supportsDecode = "decode" in this.element;
      if (this.isImageContent()) {
        if (supportsDecode && this.slide && (!this.slide.isActive || isSafari$1())) {
          this.isDecoding = true;
          this.element.decode().catch(() => {
          }).finally(() => {
            this.isDecoding = false;
            this.appendImage();
          });
        } else {
          this.appendImage();
        }
      } else if (this.slide && !this.element.parentNode) {
        this.slide.container.appendChild(this.element);
      }
    }
    /**
     * Activate the slide,
     * active slide is generally the current one,
     * meaning the user can see it.
     */
    activate() {
      if (this.instance.dispatch("contentActivate", {
        content: this
      }).defaultPrevented || !this.slide) {
        return;
      }
      if (this.isImageContent() && this.isDecoding && !isSafari$1()) {
        this.appendImage();
      } else if (this.isError()) {
        this.load(false, true);
      }
      if (this.slide.holderElement) {
        this.slide.holderElement.setAttribute("aria-hidden", "false");
      }
    }
    /**
     * Deactivate the content
     */
    deactivate() {
      this.instance.dispatch("contentDeactivate", {
        content: this
      });
      if (this.slide && this.slide.holderElement) {
        this.slide.holderElement.setAttribute("aria-hidden", "true");
      }
    }
    /**
     * Remove the content from DOM
     */
    remove() {
      this.isAttached = false;
      if (this.instance.dispatch("contentRemove", {
        content: this
      }).defaultPrevented) {
        return;
      }
      if (this.element && this.element.parentNode) {
        this.element.remove();
      }
      if (this.placeholder && this.placeholder.element) {
        this.placeholder.element.remove();
      }
    }
    /**
     * Append the image content to slide container
     */
    appendImage() {
      if (!this.isAttached) {
        return;
      }
      if (this.instance.dispatch("contentAppendImage", {
        content: this
      }).defaultPrevented) {
        return;
      }
      if (this.slide && this.element && !this.element.parentNode) {
        this.slide.container.appendChild(this.element);
      }
      if (this.state === LOAD_STATE$1.LOADED || this.state === LOAD_STATE$1.ERROR) {
        this.removePlaceholder();
      }
    }
  };
  const MIN_SLIDES_TO_CACHE = 5;
  function lazyLoadData$1(itemData, instance, index) {
    const content = instance.createContentFromData(itemData, index);
    let zoomLevel;
    const {
      options
    } = instance;
    if (options) {
      zoomLevel = new ZoomLevel$1(options, itemData, -1);
      let viewportSize;
      if (instance.pswp) {
        viewportSize = instance.pswp.viewportSize;
      } else {
        viewportSize = getViewportSize$1(options, instance);
      }
      const panAreaSize = getPanAreaSize$1(options, viewportSize, itemData, index);
      zoomLevel.update(content.width, content.height, panAreaSize);
    }
    content.lazyLoad();
    if (zoomLevel) {
      content.setDisplayedSize(Math.ceil(content.width * zoomLevel.initial), Math.ceil(content.height * zoomLevel.initial));
    }
    return content;
  }
  function lazyLoadSlide$1(index, instance) {
    const itemData = instance.getItemData(index);
    if (instance.dispatch("lazyLoadSlide", {
      index,
      itemData
    }).defaultPrevented) {
      return;
    }
    return lazyLoadData$1(itemData, instance, index);
  }
  class ContentLoader {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp) {
      this.pswp = pswp;
      this.limit = Math.max(pswp.options.preload[0] + pswp.options.preload[1] + 1, MIN_SLIDES_TO_CACHE);
      this._cachedItems = [];
    }
    /**
     * Lazy load nearby slides based on `preload` option.
     *
     * @param {number} [diff] Difference between slide indexes that was changed recently, or 0.
     */
    updateLazy(diff) {
      const {
        pswp
      } = this;
      if (pswp.dispatch("lazyLoad").defaultPrevented) {
        return;
      }
      const {
        preload
      } = pswp.options;
      const isForward = diff === void 0 ? true : diff >= 0;
      let i;
      for (i = 0; i <= preload[1]; i++) {
        this.loadSlideByIndex(pswp.currIndex + (isForward ? i : -i));
      }
      for (i = 1; i <= preload[0]; i++) {
        this.loadSlideByIndex(pswp.currIndex + (isForward ? -i : i));
      }
    }
    /**
     * @param {number} initialIndex
     */
    loadSlideByIndex(initialIndex) {
      const index = this.pswp.getLoopedIndex(initialIndex);
      let content = this.getContentByIndex(index);
      if (!content) {
        content = lazyLoadSlide$1(index, this.pswp);
        if (content) {
          this.addToCache(content);
        }
      }
    }
    /**
     * @param {Slide} slide
     * @returns {Content}
     */
    getContentBySlide(slide) {
      let content = this.getContentByIndex(slide.index);
      if (!content) {
        content = this.pswp.createContentFromData(slide.data, slide.index);
        this.addToCache(content);
      }
      content.setSlide(slide);
      return content;
    }
    /**
     * @param {Content} content
     */
    addToCache(content) {
      this.removeByIndex(content.index);
      this._cachedItems.push(content);
      if (this._cachedItems.length > this.limit) {
        const indexToRemove = this._cachedItems.findIndex((item) => {
          return !item.isAttached && !item.hasSlide;
        });
        if (indexToRemove !== -1) {
          const removedItem = this._cachedItems.splice(indexToRemove, 1)[0];
          removedItem.destroy();
        }
      }
    }
    /**
     * Removes an image from cache, does not destroy() it, just removes.
     *
     * @param {number} index
     */
    removeByIndex(index) {
      const indexToRemove = this._cachedItems.findIndex((item) => item.index === index);
      if (indexToRemove !== -1) {
        this._cachedItems.splice(indexToRemove, 1);
      }
    }
    /**
     * @param {number} index
     * @returns {Content | undefined}
     */
    getContentByIndex(index) {
      return this._cachedItems.find((content) => content.index === index);
    }
    destroy() {
      this._cachedItems.forEach((content) => content.destroy());
      this._cachedItems = [];
    }
  }
  let PhotoSwipeBase$1 = class PhotoSwipeBase extends Eventable$1 {
    /**
     * Get total number of slides
     *
     * @returns {number}
     */
    getNumItems() {
      var _this$options;
      let numItems = 0;
      const dataSource = (_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.dataSource;
      if (dataSource && "length" in dataSource) {
        numItems = dataSource.length;
      } else if (dataSource && "gallery" in dataSource) {
        if (!dataSource.items) {
          dataSource.items = this._getGalleryDOMElements(dataSource.gallery);
        }
        if (dataSource.items) {
          numItems = dataSource.items.length;
        }
      }
      const event = this.dispatch("numItems", {
        dataSource,
        numItems
      });
      return this.applyFilters("numItems", event.numItems, dataSource);
    }
    /**
     * @param {SlideData} slideData
     * @param {number} index
     * @returns {Content}
     */
    createContentFromData(slideData, index) {
      return new Content$1(slideData, this, index);
    }
    /**
     * Get item data by index.
     *
     * "item data" should contain normalized information that PhotoSwipe needs to generate a slide.
     * For example, it may contain properties like
     * `src`, `srcset`, `w`, `h`, which will be used to generate a slide with image.
     *
     * @param {number} index
     * @returns {SlideData}
     */
    getItemData(index) {
      var _this$options2;
      const dataSource = (_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.dataSource;
      let dataSourceItem = {};
      if (Array.isArray(dataSource)) {
        dataSourceItem = dataSource[index];
      } else if (dataSource && "gallery" in dataSource) {
        if (!dataSource.items) {
          dataSource.items = this._getGalleryDOMElements(dataSource.gallery);
        }
        dataSourceItem = dataSource.items[index];
      }
      let itemData = dataSourceItem;
      if (itemData instanceof Element) {
        itemData = this._domElementToItemData(itemData);
      }
      const event = this.dispatch("itemData", {
        itemData: itemData || {},
        index
      });
      return this.applyFilters("itemData", event.itemData, index);
    }
    /**
     * Get array of gallery DOM elements,
     * based on childSelector and gallery element.
     *
     * @param {HTMLElement} galleryElement
     * @returns {HTMLElement[]}
     */
    _getGalleryDOMElements(galleryElement) {
      var _this$options3, _this$options4;
      if ((_this$options3 = this.options) !== null && _this$options3 !== void 0 && _this$options3.children || (_this$options4 = this.options) !== null && _this$options4 !== void 0 && _this$options4.childSelector) {
        return getElementsFromOption$1(this.options.children, this.options.childSelector, galleryElement) || [];
      }
      return [galleryElement];
    }
    /**
     * Converts DOM element to item data object.
     *
     * @param {HTMLElement} element DOM element
     * @returns {SlideData}
     */
    _domElementToItemData(element) {
      const itemData = {
        element
      };
      const linkEl = (
        /** @type {HTMLAnchorElement} */
        element.tagName === "A" ? element : element.querySelector("a")
      );
      if (linkEl) {
        itemData.src = linkEl.dataset.pswpSrc || linkEl.href;
        if (linkEl.dataset.pswpSrcset) {
          itemData.srcset = linkEl.dataset.pswpSrcset;
        }
        itemData.width = linkEl.dataset.pswpWidth ? parseInt(linkEl.dataset.pswpWidth, 10) : 0;
        itemData.height = linkEl.dataset.pswpHeight ? parseInt(linkEl.dataset.pswpHeight, 10) : 0;
        itemData.w = itemData.width;
        itemData.h = itemData.height;
        if (linkEl.dataset.pswpType) {
          itemData.type = linkEl.dataset.pswpType;
        }
        const thumbnailEl = element.querySelector("img");
        if (thumbnailEl) {
          var _thumbnailEl$getAttri;
          itemData.msrc = thumbnailEl.currentSrc || thumbnailEl.src;
          itemData.alt = (_thumbnailEl$getAttri = thumbnailEl.getAttribute("alt")) !== null && _thumbnailEl$getAttri !== void 0 ? _thumbnailEl$getAttri : "";
        }
        if (linkEl.dataset.pswpCropped || linkEl.dataset.cropped) {
          itemData.thumbCropped = true;
        }
      }
      return this.applyFilters("domItemData", itemData, element, linkEl);
    }
    /**
     * Lazy-load by slide data
     *
     * @param {SlideData} itemData Data about the slide
     * @param {number} index
     * @returns {Content} Image that is being decoded or false.
     */
    lazyLoadData(itemData, index) {
      return lazyLoadData$1(itemData, this, index);
    }
  };
  const MIN_OPACITY = 3e-3;
  class Opener {
    /**
     * @param {PhotoSwipe} pswp
     */
    constructor(pswp) {
      this.pswp = pswp;
      this.isClosed = true;
      this.isOpen = false;
      this.isClosing = false;
      this.isOpening = false;
      this._duration = void 0;
      this._useAnimation = false;
      this._croppedZoom = false;
      this._animateRootOpacity = false;
      this._animateBgOpacity = false;
      this._placeholder = void 0;
      this._opacityElement = void 0;
      this._cropContainer1 = void 0;
      this._cropContainer2 = void 0;
      this._thumbBounds = void 0;
      this._prepareOpen = this._prepareOpen.bind(this);
      pswp.on("firstZoomPan", this._prepareOpen);
    }
    open() {
      this._prepareOpen();
      this._start();
    }
    close() {
      if (this.isClosed || this.isClosing || this.isOpening) {
        return;
      }
      const slide = this.pswp.currSlide;
      this.isOpen = false;
      this.isOpening = false;
      this.isClosing = true;
      this._duration = this.pswp.options.hideAnimationDuration;
      if (slide && slide.currZoomLevel * slide.width >= this.pswp.options.maxWidthToAnimate) {
        this._duration = 0;
      }
      this._applyStartProps();
      setTimeout(() => {
        this._start();
      }, this._croppedZoom ? 30 : 0);
    }
    /** @private */
    _prepareOpen() {
      this.pswp.off("firstZoomPan", this._prepareOpen);
      if (!this.isOpening) {
        const slide = this.pswp.currSlide;
        this.isOpening = true;
        this.isClosing = false;
        this._duration = this.pswp.options.showAnimationDuration;
        if (slide && slide.zoomLevels.initial * slide.width >= this.pswp.options.maxWidthToAnimate) {
          this._duration = 0;
        }
        this._applyStartProps();
      }
    }
    /** @private */
    _applyStartProps() {
      const {
        pswp
      } = this;
      const slide = this.pswp.currSlide;
      const {
        options
      } = pswp;
      if (options.showHideAnimationType === "fade") {
        options.showHideOpacity = true;
        this._thumbBounds = void 0;
      } else if (options.showHideAnimationType === "none") {
        options.showHideOpacity = false;
        this._duration = 0;
        this._thumbBounds = void 0;
      } else if (this.isOpening && pswp._initialThumbBounds) {
        this._thumbBounds = pswp._initialThumbBounds;
      } else {
        this._thumbBounds = this.pswp.getThumbBounds();
      }
      this._placeholder = slide === null || slide === void 0 ? void 0 : slide.getPlaceholderElement();
      pswp.animations.stopAll();
      this._useAnimation = Boolean(this._duration && this._duration > 50);
      this._animateZoom = Boolean(this._thumbBounds) && (slide === null || slide === void 0 ? void 0 : slide.content.usePlaceholder()) && (!this.isClosing || !pswp.mainScroll.isShifted());
      if (!this._animateZoom) {
        this._animateRootOpacity = true;
        if (this.isOpening && slide) {
          slide.zoomAndPanToInitial();
          slide.applyCurrentZoomPan();
        }
      } else {
        var _options$showHideOpac;
        this._animateRootOpacity = (_options$showHideOpac = options.showHideOpacity) !== null && _options$showHideOpac !== void 0 ? _options$showHideOpac : false;
      }
      this._animateBgOpacity = !this._animateRootOpacity && this.pswp.options.bgOpacity > MIN_OPACITY;
      this._opacityElement = this._animateRootOpacity ? pswp.element : pswp.bg;
      if (!this._useAnimation) {
        this._duration = 0;
        this._animateZoom = false;
        this._animateBgOpacity = false;
        this._animateRootOpacity = true;
        if (this.isOpening) {
          if (pswp.element) {
            pswp.element.style.opacity = String(MIN_OPACITY);
          }
          pswp.applyBgOpacity(1);
        }
        return;
      }
      if (this._animateZoom && this._thumbBounds && this._thumbBounds.innerRect) {
        var _this$pswp$currSlide;
        this._croppedZoom = true;
        this._cropContainer1 = this.pswp.container;
        this._cropContainer2 = (_this$pswp$currSlide = this.pswp.currSlide) === null || _this$pswp$currSlide === void 0 ? void 0 : _this$pswp$currSlide.holderElement;
        if (pswp.container) {
          pswp.container.style.overflow = "hidden";
          pswp.container.style.width = pswp.viewportSize.x + "px";
        }
      } else {
        this._croppedZoom = false;
      }
      if (this.isOpening) {
        if (this._animateRootOpacity) {
          if (pswp.element) {
            pswp.element.style.opacity = String(MIN_OPACITY);
          }
          pswp.applyBgOpacity(1);
        } else {
          if (this._animateBgOpacity && pswp.bg) {
            pswp.bg.style.opacity = String(MIN_OPACITY);
          }
          if (pswp.element) {
            pswp.element.style.opacity = "1";
          }
        }
        if (this._animateZoom) {
          this._setClosedStateZoomPan();
          if (this._placeholder) {
            this._placeholder.style.willChange = "transform";
            this._placeholder.style.opacity = String(MIN_OPACITY);
          }
        }
      } else if (this.isClosing) {
        if (pswp.mainScroll.itemHolders[0]) {
          pswp.mainScroll.itemHolders[0].el.style.display = "none";
        }
        if (pswp.mainScroll.itemHolders[2]) {
          pswp.mainScroll.itemHolders[2].el.style.display = "none";
        }
        if (this._croppedZoom) {
          if (pswp.mainScroll.x !== 0) {
            pswp.mainScroll.resetPosition();
            pswp.mainScroll.resize();
          }
        }
      }
    }
    /** @private */
    _start() {
      if (this.isOpening && this._useAnimation && this._placeholder && this._placeholder.tagName === "IMG") {
        new Promise((resolve) => {
          let decoded = false;
          let isDelaying = true;
          decodeImage(
            /** @type {HTMLImageElement} */
            this._placeholder
          ).finally(() => {
            decoded = true;
            if (!isDelaying) {
              resolve(true);
            }
          });
          setTimeout(() => {
            isDelaying = false;
            if (decoded) {
              resolve(true);
            }
          }, 50);
          setTimeout(resolve, 250);
        }).finally(() => this._initiate());
      } else {
        this._initiate();
      }
    }
    /** @private */
    _initiate() {
      var _this$pswp$element, _this$pswp$element2;
      (_this$pswp$element = this.pswp.element) === null || _this$pswp$element === void 0 || _this$pswp$element.style.setProperty("--pswp-transition-duration", this._duration + "ms");
      this.pswp.dispatch(this.isOpening ? "openingAnimationStart" : "closingAnimationStart");
      this.pswp.dispatch(
        /** @type {'initialZoomIn' | 'initialZoomOut'} */
        "initialZoom" + (this.isOpening ? "In" : "Out")
      );
      (_this$pswp$element2 = this.pswp.element) === null || _this$pswp$element2 === void 0 || _this$pswp$element2.classList.toggle("pswp--ui-visible", this.isOpening);
      if (this.isOpening) {
        if (this._placeholder) {
          this._placeholder.style.opacity = "1";
        }
        this._animateToOpenState();
      } else if (this.isClosing) {
        this._animateToClosedState();
      }
      if (!this._useAnimation) {
        this._onAnimationComplete();
      }
    }
    /** @private */
    _onAnimationComplete() {
      const {
        pswp
      } = this;
      this.isOpen = this.isOpening;
      this.isClosed = this.isClosing;
      this.isOpening = false;
      this.isClosing = false;
      pswp.dispatch(this.isOpen ? "openingAnimationEnd" : "closingAnimationEnd");
      pswp.dispatch(
        /** @type {'initialZoomInEnd' | 'initialZoomOutEnd'} */
        "initialZoom" + (this.isOpen ? "InEnd" : "OutEnd")
      );
      if (this.isClosed) {
        pswp.destroy();
      } else if (this.isOpen) {
        var _pswp$currSlide;
        if (this._animateZoom && pswp.container) {
          pswp.container.style.overflow = "visible";
          pswp.container.style.width = "100%";
        }
        (_pswp$currSlide = pswp.currSlide) === null || _pswp$currSlide === void 0 || _pswp$currSlide.applyCurrentZoomPan();
      }
    }
    /** @private */
    _animateToOpenState() {
      const {
        pswp
      } = this;
      if (this._animateZoom) {
        if (this._croppedZoom && this._cropContainer1 && this._cropContainer2) {
          this._animateTo(this._cropContainer1, "transform", "translate3d(0,0,0)");
          this._animateTo(this._cropContainer2, "transform", "none");
        }
        if (pswp.currSlide) {
          pswp.currSlide.zoomAndPanToInitial();
          this._animateTo(pswp.currSlide.container, "transform", pswp.currSlide.getCurrentTransform());
        }
      }
      if (this._animateBgOpacity && pswp.bg) {
        this._animateTo(pswp.bg, "opacity", String(pswp.options.bgOpacity));
      }
      if (this._animateRootOpacity && pswp.element) {
        this._animateTo(pswp.element, "opacity", "1");
      }
    }
    /** @private */
    _animateToClosedState() {
      const {
        pswp
      } = this;
      if (this._animateZoom) {
        this._setClosedStateZoomPan(true);
      }
      if (this._animateBgOpacity && pswp.bgOpacity > 0.01 && pswp.bg) {
        this._animateTo(pswp.bg, "opacity", "0");
      }
      if (this._animateRootOpacity && pswp.element) {
        this._animateTo(pswp.element, "opacity", "0");
      }
    }
    /**
     * @private
     * @param {boolean} [animate]
     */
    _setClosedStateZoomPan(animate) {
      if (!this._thumbBounds)
        return;
      const {
        pswp
      } = this;
      const {
        innerRect
      } = this._thumbBounds;
      const {
        currSlide,
        viewportSize
      } = pswp;
      if (this._croppedZoom && innerRect && this._cropContainer1 && this._cropContainer2) {
        const containerOnePanX = -viewportSize.x + (this._thumbBounds.x - innerRect.x) + innerRect.w;
        const containerOnePanY = -viewportSize.y + (this._thumbBounds.y - innerRect.y) + innerRect.h;
        const containerTwoPanX = viewportSize.x - innerRect.w;
        const containerTwoPanY = viewportSize.y - innerRect.h;
        if (animate) {
          this._animateTo(this._cropContainer1, "transform", toTransformString$1(containerOnePanX, containerOnePanY));
          this._animateTo(this._cropContainer2, "transform", toTransformString$1(containerTwoPanX, containerTwoPanY));
        } else {
          setTransform(this._cropContainer1, containerOnePanX, containerOnePanY);
          setTransform(this._cropContainer2, containerTwoPanX, containerTwoPanY);
        }
      }
      if (currSlide) {
        equalizePoints(currSlide.pan, innerRect || this._thumbBounds);
        currSlide.currZoomLevel = this._thumbBounds.w / currSlide.width;
        if (animate) {
          this._animateTo(currSlide.container, "transform", currSlide.getCurrentTransform());
        } else {
          currSlide.applyCurrentZoomPan();
        }
      }
    }
    /**
     * @private
     * @param {HTMLElement} target
     * @param {'transform' | 'opacity'} prop
     * @param {string} propValue
     */
    _animateTo(target, prop, propValue) {
      if (!this._duration) {
        target.style[prop] = propValue;
        return;
      }
      const {
        animations
      } = this.pswp;
      const animProps = {
        duration: this._duration,
        easing: this.pswp.options.easing,
        onComplete: () => {
          if (!animations.activeAnimations.length) {
            this._onAnimationComplete();
          }
        },
        target
      };
      animProps[prop] = propValue;
      animations.startTransition(animProps);
    }
  }
  const defaultOptions = {
    allowPanToNext: true,
    spacing: 0.1,
    loop: true,
    pinchToClose: true,
    closeOnVerticalDrag: true,
    hideAnimationDuration: 333,
    showAnimationDuration: 333,
    zoomAnimationDuration: 333,
    escKey: true,
    arrowKeys: true,
    trapFocus: true,
    returnFocus: true,
    maxWidthToAnimate: 4e3,
    clickToCloseNonZoomable: true,
    imageClickAction: "zoom-or-close",
    bgClickAction: "close",
    tapAction: "toggle-controls",
    doubleTapAction: "zoom",
    indexIndicatorSep: " / ",
    preloaderDelay: 2e3,
    bgOpacity: 0.8,
    index: 0,
    errorMsg: "The image cannot be loaded",
    preload: [1, 2],
    easing: "cubic-bezier(.4,0,.22,1)"
  };
  class PhotoSwipe extends PhotoSwipeBase$1 {
    /**
     * @param {PhotoSwipeOptions} [options]
     */
    constructor(options) {
      super();
      this.options = this._prepareOptions(options || {});
      this.offset = {
        x: 0,
        y: 0
      };
      this._prevViewportSize = {
        x: 0,
        y: 0
      };
      this.viewportSize = {
        x: 0,
        y: 0
      };
      this.bgOpacity = 1;
      this.currIndex = 0;
      this.potentialIndex = 0;
      this.isOpen = false;
      this.isDestroying = false;
      this.hasMouse = false;
      this._initialItemData = {};
      this._initialThumbBounds = void 0;
      this.topBar = void 0;
      this.element = void 0;
      this.template = void 0;
      this.container = void 0;
      this.scrollWrap = void 0;
      this.currSlide = void 0;
      this.events = new DOMEvents();
      this.animations = new Animations();
      this.mainScroll = new MainScroll(this);
      this.gestures = new Gestures(this);
      this.opener = new Opener(this);
      this.keyboard = new Keyboard(this);
      this.contentLoader = new ContentLoader(this);
    }
    /** @returns {boolean} */
    init() {
      if (this.isOpen || this.isDestroying) {
        return false;
      }
      this.isOpen = true;
      this.dispatch("init");
      this.dispatch("beforeOpen");
      this._createMainStructure();
      let rootClasses = "pswp--open";
      if (this.gestures.supportsTouch) {
        rootClasses += " pswp--touch";
      }
      if (this.options.mainClass) {
        rootClasses += " " + this.options.mainClass;
      }
      if (this.element) {
        this.element.className += " " + rootClasses;
      }
      this.currIndex = this.options.index || 0;
      this.potentialIndex = this.currIndex;
      this.dispatch("firstUpdate");
      this.scrollWheel = new ScrollWheel(this);
      if (Number.isNaN(this.currIndex) || this.currIndex < 0 || this.currIndex >= this.getNumItems()) {
        this.currIndex = 0;
      }
      if (!this.gestures.supportsTouch) {
        this.mouseDetected();
      }
      this.updateSize();
      this.offset.y = window.pageYOffset;
      this._initialItemData = this.getItemData(this.currIndex);
      this.dispatch("gettingData", {
        index: this.currIndex,
        data: this._initialItemData,
        slide: void 0
      });
      this._initialThumbBounds = this.getThumbBounds();
      this.dispatch("initialLayout");
      this.on("openingAnimationEnd", () => {
        const {
          itemHolders
        } = this.mainScroll;
        if (itemHolders[0]) {
          itemHolders[0].el.style.display = "block";
          this.setContent(itemHolders[0], this.currIndex - 1);
        }
        if (itemHolders[2]) {
          itemHolders[2].el.style.display = "block";
          this.setContent(itemHolders[2], this.currIndex + 1);
        }
        this.appendHeavy();
        this.contentLoader.updateLazy();
        this.events.add(window, "resize", this._handlePageResize.bind(this));
        this.events.add(window, "scroll", this._updatePageScrollOffset.bind(this));
        this.dispatch("bindEvents");
      });
      if (this.mainScroll.itemHolders[1]) {
        this.setContent(this.mainScroll.itemHolders[1], this.currIndex);
      }
      this.dispatch("change");
      this.opener.open();
      this.dispatch("afterInit");
      return true;
    }
    /**
     * Get looped slide index
     * (for example, -1 will return the last slide)
     *
     * @param {number} index
     * @returns {number}
     */
    getLoopedIndex(index) {
      const numSlides = this.getNumItems();
      if (this.options.loop) {
        if (index > numSlides - 1) {
          index -= numSlides;
        }
        if (index < 0) {
          index += numSlides;
        }
      }
      return clamp(index, 0, numSlides - 1);
    }
    appendHeavy() {
      this.mainScroll.itemHolders.forEach((itemHolder) => {
        var _itemHolder$slide;
        (_itemHolder$slide = itemHolder.slide) === null || _itemHolder$slide === void 0 || _itemHolder$slide.appendHeavy();
      });
    }
    /**
     * Change the slide
     * @param {number} index New index
     */
    goTo(index) {
      this.mainScroll.moveIndexBy(this.getLoopedIndex(index) - this.potentialIndex);
    }
    /**
     * Go to the next slide.
     */
    next() {
      this.goTo(this.potentialIndex + 1);
    }
    /**
     * Go to the previous slide.
     */
    prev() {
      this.goTo(this.potentialIndex - 1);
    }
    /**
     * @see slide/slide.js zoomTo
     *
     * @param {Parameters<Slide['zoomTo']>} args
     */
    zoomTo(...args) {
      var _this$currSlide;
      (_this$currSlide = this.currSlide) === null || _this$currSlide === void 0 || _this$currSlide.zoomTo(...args);
    }
    /**
     * @see slide/slide.js toggleZoom
     */
    toggleZoom() {
      var _this$currSlide2;
      (_this$currSlide2 = this.currSlide) === null || _this$currSlide2 === void 0 || _this$currSlide2.toggleZoom();
    }
    /**
     * Close the gallery.
     * After closing transition ends - destroy it
     */
    close() {
      if (!this.opener.isOpen || this.isDestroying) {
        return;
      }
      this.isDestroying = true;
      this.dispatch("close");
      this.events.removeAll();
      this.opener.close();
    }
    /**
     * Destroys the gallery:
     * - instantly closes the gallery
     * - unbinds events,
     * - cleans intervals and timeouts
     * - removes elements from DOM
     */
    destroy() {
      var _this$element;
      if (!this.isDestroying) {
        this.options.showHideAnimationType = "none";
        this.close();
        return;
      }
      this.dispatch("destroy");
      this._listeners = {};
      if (this.scrollWrap) {
        this.scrollWrap.ontouchmove = null;
        this.scrollWrap.ontouchend = null;
      }
      (_this$element = this.element) === null || _this$element === void 0 || _this$element.remove();
      this.mainScroll.itemHolders.forEach((itemHolder) => {
        var _itemHolder$slide2;
        (_itemHolder$slide2 = itemHolder.slide) === null || _itemHolder$slide2 === void 0 || _itemHolder$slide2.destroy();
      });
      this.contentLoader.destroy();
      this.events.removeAll();
    }
    /**
     * Refresh/reload content of a slide by its index
     *
     * @param {number} slideIndex
     */
    refreshSlideContent(slideIndex) {
      this.contentLoader.removeByIndex(slideIndex);
      this.mainScroll.itemHolders.forEach((itemHolder, i) => {
        var _this$currSlide$index, _this$currSlide3;
        let potentialHolderIndex = ((_this$currSlide$index = (_this$currSlide3 = this.currSlide) === null || _this$currSlide3 === void 0 ? void 0 : _this$currSlide3.index) !== null && _this$currSlide$index !== void 0 ? _this$currSlide$index : 0) - 1 + i;
        if (this.canLoop()) {
          potentialHolderIndex = this.getLoopedIndex(potentialHolderIndex);
        }
        if (potentialHolderIndex === slideIndex) {
          this.setContent(itemHolder, slideIndex, true);
          if (i === 1) {
            var _itemHolder$slide3;
            this.currSlide = itemHolder.slide;
            (_itemHolder$slide3 = itemHolder.slide) === null || _itemHolder$slide3 === void 0 || _itemHolder$slide3.setIsActive(true);
          }
        }
      });
      this.dispatch("change");
    }
    /**
     * Set slide content
     *
     * @param {ItemHolder} holder mainScroll.itemHolders array item
     * @param {number} index Slide index
     * @param {boolean} [force] If content should be set even if index wasn't changed
     */
    setContent(holder, index, force) {
      if (this.canLoop()) {
        index = this.getLoopedIndex(index);
      }
      if (holder.slide) {
        if (holder.slide.index === index && !force) {
          return;
        }
        holder.slide.destroy();
        holder.slide = void 0;
      }
      if (!this.canLoop() && (index < 0 || index >= this.getNumItems())) {
        return;
      }
      const itemData = this.getItemData(index);
      holder.slide = new Slide(itemData, index, this);
      if (index === this.currIndex) {
        this.currSlide = holder.slide;
      }
      holder.slide.append(holder.el);
    }
    /** @returns {Point} */
    getViewportCenterPoint() {
      return {
        x: this.viewportSize.x / 2,
        y: this.viewportSize.y / 2
      };
    }
    /**
     * Update size of all elements.
     * Executed on init and on page resize.
     *
     * @param {boolean} [force] Update size even if size of viewport was not changed.
     */
    updateSize(force) {
      if (this.isDestroying) {
        return;
      }
      const newViewportSize = getViewportSize$1(this.options, this);
      if (!force && pointsEqual(newViewportSize, this._prevViewportSize)) {
        return;
      }
      equalizePoints(this._prevViewportSize, newViewportSize);
      this.dispatch("beforeResize");
      equalizePoints(this.viewportSize, this._prevViewportSize);
      this._updatePageScrollOffset();
      this.dispatch("viewportSize");
      this.mainScroll.resize(this.opener.isOpen);
      if (!this.hasMouse && window.matchMedia("(any-hover: hover)").matches) {
        this.mouseDetected();
      }
      this.dispatch("resize");
    }
    /**
     * @param {number} opacity
     */
    applyBgOpacity(opacity) {
      this.bgOpacity = Math.max(opacity, 0);
      if (this.bg) {
        this.bg.style.opacity = String(this.bgOpacity * this.options.bgOpacity);
      }
    }
    /**
     * Whether mouse is detected
     */
    mouseDetected() {
      if (!this.hasMouse) {
        var _this$element2;
        this.hasMouse = true;
        (_this$element2 = this.element) === null || _this$element2 === void 0 || _this$element2.classList.add("pswp--has_mouse");
      }
    }
    /**
     * Page resize event handler
     *
     * @private
     */
    _handlePageResize() {
      this.updateSize();
      if (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) {
        setTimeout(() => {
          this.updateSize();
        }, 500);
      }
    }
    /**
     * Page scroll offset is used
     * to get correct coordinates
     * relative to PhotoSwipe viewport.
     *
     * @private
     */
    _updatePageScrollOffset() {
      this.setScrollOffset(0, window.pageYOffset);
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    setScrollOffset(x, y) {
      this.offset.x = x;
      this.offset.y = y;
      this.dispatch("updateScrollOffset");
    }
    /**
     * Create main HTML structure of PhotoSwipe,
     * and add it to DOM
     *
     * @private
     */
    _createMainStructure() {
      this.element = createElement$1("pswp", "div");
      this.element.setAttribute("tabindex", "-1");
      this.element.setAttribute("role", "dialog");
      this.template = this.element;
      this.bg = createElement$1("pswp__bg", "div", this.element);
      this.scrollWrap = createElement$1("pswp__scroll-wrap", "section", this.element);
      this.container = createElement$1("pswp__container", "div", this.scrollWrap);
      this.scrollWrap.setAttribute("aria-roledescription", "carousel");
      this.container.setAttribute("aria-live", "off");
      this.container.setAttribute("id", "pswp__items");
      this.mainScroll.appendHolders();
      this.ui = new UI(this);
      this.ui.init();
      (this.options.appendToEl || document.body).appendChild(this.element);
    }
    /**
     * Get position and dimensions of small thumbnail
     *   {x:,y:,w:}
     *
     * Height is optional (calculated based on the large image)
     *
     * @returns {Bounds | undefined}
     */
    getThumbBounds() {
      return getThumbBounds(this.currIndex, this.currSlide ? this.currSlide.data : this._initialItemData, this);
    }
    /**
     * If the PhotoSwipe can have continuous loop
     * @returns Boolean
     */
    canLoop() {
      return this.options.loop && this.getNumItems() > 2;
    }
    /**
     * @private
     * @param {PhotoSwipeOptions} options
     * @returns {PreparedPhotoSwipeOptions}
     */
    _prepareOptions(options) {
      if (window.matchMedia("(prefers-reduced-motion), (update: slow)").matches) {
        options.showHideAnimationType = "none";
        options.zoomAnimationDuration = 0;
      }
      return {
        ...defaultOptions,
        ...options
      };
    }
  }
  /*!
    * PhotoSwipe Lightbox 5.4.3 - https://photoswipe.com
    * (c) 2023 Dmytro Semenov
    */
  function createElement(className, tagName, appendToEl) {
    const el = document.createElement(tagName);
    if (className) {
      el.className = className;
    }
    if (appendToEl) {
      appendToEl.appendChild(el);
    }
    return el;
  }
  function toTransformString(x, y, scale) {
    let propValue = `translate3d(${x}px,${y || 0}px,0)`;
    if (scale !== void 0) {
      propValue += ` scale3d(${scale},${scale},1)`;
    }
    return propValue;
  }
  function setWidthHeight(el, w, h) {
    el.style.width = typeof w === "number" ? `${w}px` : w;
    el.style.height = typeof h === "number" ? `${h}px` : h;
  }
  const LOAD_STATE = {
    IDLE: "idle",
    LOADING: "loading",
    LOADED: "loaded",
    ERROR: "error"
  };
  function specialKeyUsed(e) {
    return "button" in e && e.button === 1 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
  }
  function getElementsFromOption(option, legacySelector, parent = document) {
    let elements = [];
    if (option instanceof Element) {
      elements = [option];
    } else if (option instanceof NodeList || Array.isArray(option)) {
      elements = Array.from(option);
    } else {
      const selector = typeof option === "string" ? option : legacySelector;
      if (selector) {
        elements = Array.from(parent.querySelectorAll(selector));
      }
    }
    return elements;
  }
  function isPswpClass(fn) {
    return typeof fn === "function" && fn.prototype && fn.prototype.goTo;
  }
  function isSafari() {
    return !!(navigator.vendor && navigator.vendor.match(/apple/i));
  }
  class PhotoSwipeEvent2 {
    /**
     * @param {T} type
     * @param {PhotoSwipeEventsMap[T]} [details]
     */
    constructor(type, details) {
      this.type = type;
      this.defaultPrevented = false;
      if (details) {
        Object.assign(this, details);
      }
    }
    preventDefault() {
      this.defaultPrevented = true;
    }
  }
  class Eventable2 {
    constructor() {
      this._listeners = {};
      this._filters = {};
      this.pswp = void 0;
      this.options = void 0;
    }
    /**
     * @template {keyof PhotoSwipeFiltersMap} T
     * @param {T} name
     * @param {PhotoSwipeFiltersMap[T]} fn
     * @param {number} priority
     */
    addFilter(name, fn, priority = 100) {
      var _this$_filters$name, _this$_filters$name2, _this$pswp;
      if (!this._filters[name]) {
        this._filters[name] = [];
      }
      (_this$_filters$name = this._filters[name]) === null || _this$_filters$name === void 0 || _this$_filters$name.push({
        fn,
        priority
      });
      (_this$_filters$name2 = this._filters[name]) === null || _this$_filters$name2 === void 0 || _this$_filters$name2.sort((f1, f2) => f1.priority - f2.priority);
      (_this$pswp = this.pswp) === null || _this$pswp === void 0 || _this$pswp.addFilter(name, fn, priority);
    }
    /**
     * @template {keyof PhotoSwipeFiltersMap} T
     * @param {T} name
     * @param {PhotoSwipeFiltersMap[T]} fn
     */
    removeFilter(name, fn) {
      if (this._filters[name]) {
        this._filters[name] = this._filters[name].filter((filter) => filter.fn !== fn);
      }
      if (this.pswp) {
        this.pswp.removeFilter(name, fn);
      }
    }
    /**
     * @template {keyof PhotoSwipeFiltersMap} T
     * @param {T} name
     * @param {Parameters<PhotoSwipeFiltersMap[T]>} args
     * @returns {Parameters<PhotoSwipeFiltersMap[T]>[0]}
     */
    applyFilters(name, ...args) {
      var _this$_filters$name3;
      (_this$_filters$name3 = this._filters[name]) === null || _this$_filters$name3 === void 0 || _this$_filters$name3.forEach((filter) => {
        args[0] = filter.fn.apply(this, args);
      });
      return args[0];
    }
    /**
     * @template {keyof PhotoSwipeEventsMap} T
     * @param {T} name
     * @param {EventCallback<T>} fn
     */
    on(name, fn) {
      var _this$_listeners$name, _this$pswp2;
      if (!this._listeners[name]) {
        this._listeners[name] = [];
      }
      (_this$_listeners$name = this._listeners[name]) === null || _this$_listeners$name === void 0 || _this$_listeners$name.push(fn);
      (_this$pswp2 = this.pswp) === null || _this$pswp2 === void 0 || _this$pswp2.on(name, fn);
    }
    /**
     * @template {keyof PhotoSwipeEventsMap} T
     * @param {T} name
     * @param {EventCallback<T>} fn
     */
    off(name, fn) {
      var _this$pswp3;
      if (this._listeners[name]) {
        this._listeners[name] = this._listeners[name].filter((listener) => fn !== listener);
      }
      (_this$pswp3 = this.pswp) === null || _this$pswp3 === void 0 || _this$pswp3.off(name, fn);
    }
    /**
     * @template {keyof PhotoSwipeEventsMap} T
     * @param {T} name
     * @param {PhotoSwipeEventsMap[T]} [details]
     * @returns {AugmentedEvent<T>}
     */
    dispatch(name, details) {
      var _this$_listeners$name2;
      if (this.pswp) {
        return this.pswp.dispatch(name, details);
      }
      const event = (
        /** @type {AugmentedEvent<T>} */
        new PhotoSwipeEvent2(name, details)
      );
      (_this$_listeners$name2 = this._listeners[name]) === null || _this$_listeners$name2 === void 0 || _this$_listeners$name2.forEach((listener) => {
        listener.call(this, event);
      });
      return event;
    }
  }
  class Placeholder2 {
    /**
     * @param {string | false} imageSrc
     * @param {HTMLElement} container
     */
    constructor(imageSrc, container) {
      this.element = createElement("pswp__img pswp__img--placeholder", imageSrc ? "img" : "div", container);
      if (imageSrc) {
        const imgEl = (
          /** @type {HTMLImageElement} */
          this.element
        );
        imgEl.decoding = "async";
        imgEl.alt = "";
        imgEl.src = imageSrc;
        imgEl.setAttribute("role", "presentation");
      }
      this.element.setAttribute("aria-hidden", "true");
    }
    /**
     * @param {number} width
     * @param {number} height
     */
    setDisplayedSize(width, height) {
      if (!this.element) {
        return;
      }
      if (this.element.tagName === "IMG") {
        setWidthHeight(this.element, 250, "auto");
        this.element.style.transformOrigin = "0 0";
        this.element.style.transform = toTransformString(0, 0, width / 250);
      } else {
        setWidthHeight(this.element, width, height);
      }
    }
    destroy() {
      var _this$element;
      if ((_this$element = this.element) !== null && _this$element !== void 0 && _this$element.parentNode) {
        this.element.remove();
      }
      this.element = null;
    }
  }
  class Content2 {
    /**
     * @param {SlideData} itemData Slide data
     * @param {PhotoSwipeBase} instance PhotoSwipe or PhotoSwipeLightbox instance
     * @param {number} index
     */
    constructor(itemData, instance, index) {
      this.instance = instance;
      this.data = itemData;
      this.index = index;
      this.element = void 0;
      this.placeholder = void 0;
      this.slide = void 0;
      this.displayedImageWidth = 0;
      this.displayedImageHeight = 0;
      this.width = Number(this.data.w) || Number(this.data.width) || 0;
      this.height = Number(this.data.h) || Number(this.data.height) || 0;
      this.isAttached = false;
      this.hasSlide = false;
      this.isDecoding = false;
      this.state = LOAD_STATE.IDLE;
      if (this.data.type) {
        this.type = this.data.type;
      } else if (this.data.src) {
        this.type = "image";
      } else {
        this.type = "html";
      }
      this.instance.dispatch("contentInit", {
        content: this
      });
    }
    removePlaceholder() {
      if (this.placeholder && !this.keepPlaceholder()) {
        setTimeout(() => {
          if (this.placeholder) {
            this.placeholder.destroy();
            this.placeholder = void 0;
          }
        }, 1e3);
      }
    }
    /**
     * Preload content
     *
     * @param {boolean} isLazy
     * @param {boolean} [reload]
     */
    load(isLazy, reload) {
      if (this.slide && this.usePlaceholder()) {
        if (!this.placeholder) {
          const placeholderSrc = this.instance.applyFilters(
            "placeholderSrc",
            // use  image-based placeholder only for the first slide,
            // as rendering (even small stretched thumbnail) is an expensive operation
            this.data.msrc && this.slide.isFirstSlide ? this.data.msrc : false,
            this
          );
          this.placeholder = new Placeholder2(placeholderSrc, this.slide.container);
        } else {
          const placeholderEl = this.placeholder.element;
          if (placeholderEl && !placeholderEl.parentElement) {
            this.slide.container.prepend(placeholderEl);
          }
        }
      }
      if (this.element && !reload) {
        return;
      }
      if (this.instance.dispatch("contentLoad", {
        content: this,
        isLazy
      }).defaultPrevented) {
        return;
      }
      if (this.isImageContent()) {
        this.element = createElement("pswp__img", "img");
        if (this.displayedImageWidth) {
          this.loadImage(isLazy);
        }
      } else {
        this.element = createElement("pswp__content", "div");
        this.element.innerHTML = this.data.html || "";
      }
      if (reload && this.slide) {
        this.slide.updateContentSize(true);
      }
    }
    /**
     * Preload image
     *
     * @param {boolean} isLazy
     */
    loadImage(isLazy) {
      var _this$data$src, _this$data$alt;
      if (!this.isImageContent() || !this.element || this.instance.dispatch("contentLoadImage", {
        content: this,
        isLazy
      }).defaultPrevented) {
        return;
      }
      const imageElement = (
        /** @type HTMLImageElement */
        this.element
      );
      this.updateSrcsetSizes();
      if (this.data.srcset) {
        imageElement.srcset = this.data.srcset;
      }
      imageElement.src = (_this$data$src = this.data.src) !== null && _this$data$src !== void 0 ? _this$data$src : "";
      imageElement.alt = (_this$data$alt = this.data.alt) !== null && _this$data$alt !== void 0 ? _this$data$alt : "";
      this.state = LOAD_STATE.LOADING;
      if (imageElement.complete) {
        this.onLoaded();
      } else {
        imageElement.onload = () => {
          this.onLoaded();
        };
        imageElement.onerror = () => {
          this.onError();
        };
      }
    }
    /**
     * Assign slide to content
     *
     * @param {Slide} slide
     */
    setSlide(slide) {
      this.slide = slide;
      this.hasSlide = true;
      this.instance = slide.pswp;
    }
    /**
     * Content load success handler
     */
    onLoaded() {
      this.state = LOAD_STATE.LOADED;
      if (this.slide && this.element) {
        this.instance.dispatch("loadComplete", {
          slide: this.slide,
          content: this
        });
        if (this.slide.isActive && this.slide.heavyAppended && !this.element.parentNode) {
          this.append();
          this.slide.updateContentSize(true);
        }
        if (this.state === LOAD_STATE.LOADED || this.state === LOAD_STATE.ERROR) {
          this.removePlaceholder();
        }
      }
    }
    /**
     * Content load error handler
     */
    onError() {
      this.state = LOAD_STATE.ERROR;
      if (this.slide) {
        this.displayError();
        this.instance.dispatch("loadComplete", {
          slide: this.slide,
          isError: true,
          content: this
        });
        this.instance.dispatch("loadError", {
          slide: this.slide,
          content: this
        });
      }
    }
    /**
     * @returns {Boolean} If the content is currently loading
     */
    isLoading() {
      return this.instance.applyFilters("isContentLoading", this.state === LOAD_STATE.LOADING, this);
    }
    /**
     * @returns {Boolean} If the content is in error state
     */
    isError() {
      return this.state === LOAD_STATE.ERROR;
    }
    /**
     * @returns {boolean} If the content is image
     */
    isImageContent() {
      return this.type === "image";
    }
    /**
     * Update content size
     *
     * @param {Number} width
     * @param {Number} height
     */
    setDisplayedSize(width, height) {
      if (!this.element) {
        return;
      }
      if (this.placeholder) {
        this.placeholder.setDisplayedSize(width, height);
      }
      if (this.instance.dispatch("contentResize", {
        content: this,
        width,
        height
      }).defaultPrevented) {
        return;
      }
      setWidthHeight(this.element, width, height);
      if (this.isImageContent() && !this.isError()) {
        const isInitialSizeUpdate = !this.displayedImageWidth && width;
        this.displayedImageWidth = width;
        this.displayedImageHeight = height;
        if (isInitialSizeUpdate) {
          this.loadImage(false);
        } else {
          this.updateSrcsetSizes();
        }
        if (this.slide) {
          this.instance.dispatch("imageSizeChange", {
            slide: this.slide,
            width,
            height,
            content: this
          });
        }
      }
    }
    /**
     * @returns {boolean} If the content can be zoomed
     */
    isZoomable() {
      return this.instance.applyFilters("isContentZoomable", this.isImageContent() && this.state !== LOAD_STATE.ERROR, this);
    }
    /**
     * Update image srcset sizes attribute based on width and height
     */
    updateSrcsetSizes() {
      if (!this.isImageContent() || !this.element || !this.data.srcset) {
        return;
      }
      const image = (
        /** @type HTMLImageElement */
        this.element
      );
      const sizesWidth = this.instance.applyFilters("srcsetSizesWidth", this.displayedImageWidth, this);
      if (!image.dataset.largestUsedSize || sizesWidth > parseInt(image.dataset.largestUsedSize, 10)) {
        image.sizes = sizesWidth + "px";
        image.dataset.largestUsedSize = String(sizesWidth);
      }
    }
    /**
     * @returns {boolean} If content should use a placeholder (from msrc by default)
     */
    usePlaceholder() {
      return this.instance.applyFilters("useContentPlaceholder", this.isImageContent(), this);
    }
    /**
     * Preload content with lazy-loading param
     */
    lazyLoad() {
      if (this.instance.dispatch("contentLazyLoad", {
        content: this
      }).defaultPrevented) {
        return;
      }
      this.load(true);
    }
    /**
     * @returns {boolean} If placeholder should be kept after content is loaded
     */
    keepPlaceholder() {
      return this.instance.applyFilters("isKeepingPlaceholder", this.isLoading(), this);
    }
    /**
     * Destroy the content
     */
    destroy() {
      this.hasSlide = false;
      this.slide = void 0;
      if (this.instance.dispatch("contentDestroy", {
        content: this
      }).defaultPrevented) {
        return;
      }
      this.remove();
      if (this.placeholder) {
        this.placeholder.destroy();
        this.placeholder = void 0;
      }
      if (this.isImageContent() && this.element) {
        this.element.onload = null;
        this.element.onerror = null;
        this.element = void 0;
      }
    }
    /**
     * Display error message
     */
    displayError() {
      if (this.slide) {
        var _this$instance$option, _this$instance$option2;
        let errorMsgEl = createElement("pswp__error-msg", "div");
        errorMsgEl.innerText = (_this$instance$option = (_this$instance$option2 = this.instance.options) === null || _this$instance$option2 === void 0 ? void 0 : _this$instance$option2.errorMsg) !== null && _this$instance$option !== void 0 ? _this$instance$option : "";
        errorMsgEl = /** @type {HTMLDivElement} */
        this.instance.applyFilters("contentErrorElement", errorMsgEl, this);
        this.element = createElement("pswp__content pswp__error-msg-container", "div");
        this.element.appendChild(errorMsgEl);
        this.slide.container.innerText = "";
        this.slide.container.appendChild(this.element);
        this.slide.updateContentSize(true);
        this.removePlaceholder();
      }
    }
    /**
     * Append the content
     */
    append() {
      if (this.isAttached || !this.element) {
        return;
      }
      this.isAttached = true;
      if (this.state === LOAD_STATE.ERROR) {
        this.displayError();
        return;
      }
      if (this.instance.dispatch("contentAppend", {
        content: this
      }).defaultPrevented) {
        return;
      }
      const supportsDecode = "decode" in this.element;
      if (this.isImageContent()) {
        if (supportsDecode && this.slide && (!this.slide.isActive || isSafari())) {
          this.isDecoding = true;
          this.element.decode().catch(() => {
          }).finally(() => {
            this.isDecoding = false;
            this.appendImage();
          });
        } else {
          this.appendImage();
        }
      } else if (this.slide && !this.element.parentNode) {
        this.slide.container.appendChild(this.element);
      }
    }
    /**
     * Activate the slide,
     * active slide is generally the current one,
     * meaning the user can see it.
     */
    activate() {
      if (this.instance.dispatch("contentActivate", {
        content: this
      }).defaultPrevented || !this.slide) {
        return;
      }
      if (this.isImageContent() && this.isDecoding && !isSafari()) {
        this.appendImage();
      } else if (this.isError()) {
        this.load(false, true);
      }
      if (this.slide.holderElement) {
        this.slide.holderElement.setAttribute("aria-hidden", "false");
      }
    }
    /**
     * Deactivate the content
     */
    deactivate() {
      this.instance.dispatch("contentDeactivate", {
        content: this
      });
      if (this.slide && this.slide.holderElement) {
        this.slide.holderElement.setAttribute("aria-hidden", "true");
      }
    }
    /**
     * Remove the content from DOM
     */
    remove() {
      this.isAttached = false;
      if (this.instance.dispatch("contentRemove", {
        content: this
      }).defaultPrevented) {
        return;
      }
      if (this.element && this.element.parentNode) {
        this.element.remove();
      }
      if (this.placeholder && this.placeholder.element) {
        this.placeholder.element.remove();
      }
    }
    /**
     * Append the image content to slide container
     */
    appendImage() {
      if (!this.isAttached) {
        return;
      }
      if (this.instance.dispatch("contentAppendImage", {
        content: this
      }).defaultPrevented) {
        return;
      }
      if (this.slide && this.element && !this.element.parentNode) {
        this.slide.container.appendChild(this.element);
      }
      if (this.state === LOAD_STATE.LOADED || this.state === LOAD_STATE.ERROR) {
        this.removePlaceholder();
      }
    }
  }
  function getViewportSize(options, pswp) {
    if (options.getViewportSizeFn) {
      const newViewportSize = options.getViewportSizeFn(options, pswp);
      if (newViewportSize) {
        return newViewportSize;
      }
    }
    return {
      x: document.documentElement.clientWidth,
      // TODO: height on mobile is very incosistent due to toolbar
      // find a way to improve this
      //
      // document.documentElement.clientHeight - doesn't seem to work well
      y: window.innerHeight
    };
  }
  function parsePaddingOption(prop, options, viewportSize, itemData, index) {
    let paddingValue = 0;
    if (options.paddingFn) {
      paddingValue = options.paddingFn(viewportSize, itemData, index)[prop];
    } else if (options.padding) {
      paddingValue = options.padding[prop];
    } else {
      const legacyPropName = "padding" + prop[0].toUpperCase() + prop.slice(1);
      if (options[legacyPropName]) {
        paddingValue = options[legacyPropName];
      }
    }
    return Number(paddingValue) || 0;
  }
  function getPanAreaSize(options, viewportSize, itemData, index) {
    return {
      x: viewportSize.x - parsePaddingOption("left", options, viewportSize, itemData, index) - parsePaddingOption("right", options, viewportSize, itemData, index),
      y: viewportSize.y - parsePaddingOption("top", options, viewportSize, itemData, index) - parsePaddingOption("bottom", options, viewportSize, itemData, index)
    };
  }
  const MAX_IMAGE_WIDTH = 4e3;
  class ZoomLevel2 {
    /**
     * @param {PhotoSwipeOptions} options PhotoSwipe options
     * @param {SlideData} itemData Slide data
     * @param {number} index Slide index
     * @param {PhotoSwipe} [pswp] PhotoSwipe instance, can be undefined if not initialized yet
     */
    constructor(options, itemData, index, pswp) {
      this.pswp = pswp;
      this.options = options;
      this.itemData = itemData;
      this.index = index;
      this.panAreaSize = null;
      this.elementSize = null;
      this.fit = 1;
      this.fill = 1;
      this.vFill = 1;
      this.initial = 1;
      this.secondary = 1;
      this.max = 1;
      this.min = 1;
    }
    /**
     * Calculate initial, secondary and maximum zoom level for the specified slide.
     *
     * It should be called when either image or viewport size changes.
     *
     * @param {number} maxWidth
     * @param {number} maxHeight
     * @param {Point} panAreaSize
     */
    update(maxWidth, maxHeight, panAreaSize) {
      const elementSize = {
        x: maxWidth,
        y: maxHeight
      };
      this.elementSize = elementSize;
      this.panAreaSize = panAreaSize;
      const hRatio = panAreaSize.x / elementSize.x;
      const vRatio = panAreaSize.y / elementSize.y;
      this.fit = Math.min(1, hRatio < vRatio ? hRatio : vRatio);
      this.fill = Math.min(1, hRatio > vRatio ? hRatio : vRatio);
      this.vFill = Math.min(1, vRatio);
      this.initial = this._getInitial();
      this.secondary = this._getSecondary();
      this.max = Math.max(this.initial, this.secondary, this._getMax());
      this.min = Math.min(this.fit, this.initial, this.secondary);
      if (this.pswp) {
        this.pswp.dispatch("zoomLevelsUpdate", {
          zoomLevels: this,
          slideData: this.itemData
        });
      }
    }
    /**
     * Parses user-defined zoom option.
     *
     * @private
     * @param {'initial' | 'secondary' | 'max'} optionPrefix Zoom level option prefix (initial, secondary, max)
     * @returns { number | undefined }
     */
    _parseZoomLevelOption(optionPrefix) {
      const optionName = (
        /** @type {'initialZoomLevel' | 'secondaryZoomLevel' | 'maxZoomLevel'} */
        optionPrefix + "ZoomLevel"
      );
      const optionValue = this.options[optionName];
      if (!optionValue) {
        return;
      }
      if (typeof optionValue === "function") {
        return optionValue(this);
      }
      if (optionValue === "fill") {
        return this.fill;
      }
      if (optionValue === "fit") {
        return this.fit;
      }
      return Number(optionValue);
    }
    /**
     * Get zoom level to which image will be zoomed after double-tap gesture,
     * or when user clicks on zoom icon,
     * or mouse-click on image itself.
     * If you return 1 image will be zoomed to its original size.
     *
     * @private
     * @return {number}
     */
    _getSecondary() {
      let currZoomLevel = this._parseZoomLevelOption("secondary");
      if (currZoomLevel) {
        return currZoomLevel;
      }
      currZoomLevel = Math.min(1, this.fit * 3);
      if (this.elementSize && currZoomLevel * this.elementSize.x > MAX_IMAGE_WIDTH) {
        currZoomLevel = MAX_IMAGE_WIDTH / this.elementSize.x;
      }
      return currZoomLevel;
    }
    /**
     * Get initial image zoom level.
     *
     * @private
     * @return {number}
     */
    _getInitial() {
      return this._parseZoomLevelOption("initial") || this.fit;
    }
    /**
     * Maximum zoom level when user zooms
     * via zoom/pinch gesture,
     * via cmd/ctrl-wheel or via trackpad.
     *
     * @private
     * @return {number}
     */
    _getMax() {
      return this._parseZoomLevelOption("max") || Math.max(1, this.fit * 4);
    }
  }
  function lazyLoadData(itemData, instance, index) {
    const content = instance.createContentFromData(itemData, index);
    let zoomLevel;
    const {
      options
    } = instance;
    if (options) {
      zoomLevel = new ZoomLevel2(options, itemData, -1);
      let viewportSize;
      if (instance.pswp) {
        viewportSize = instance.pswp.viewportSize;
      } else {
        viewportSize = getViewportSize(options, instance);
      }
      const panAreaSize = getPanAreaSize(options, viewportSize, itemData, index);
      zoomLevel.update(content.width, content.height, panAreaSize);
    }
    content.lazyLoad();
    if (zoomLevel) {
      content.setDisplayedSize(Math.ceil(content.width * zoomLevel.initial), Math.ceil(content.height * zoomLevel.initial));
    }
    return content;
  }
  function lazyLoadSlide(index, instance) {
    const itemData = instance.getItemData(index);
    if (instance.dispatch("lazyLoadSlide", {
      index,
      itemData
    }).defaultPrevented) {
      return;
    }
    return lazyLoadData(itemData, instance, index);
  }
  class PhotoSwipeBase2 extends Eventable2 {
    /**
     * Get total number of slides
     *
     * @returns {number}
     */
    getNumItems() {
      var _this$options;
      let numItems = 0;
      const dataSource = (_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.dataSource;
      if (dataSource && "length" in dataSource) {
        numItems = dataSource.length;
      } else if (dataSource && "gallery" in dataSource) {
        if (!dataSource.items) {
          dataSource.items = this._getGalleryDOMElements(dataSource.gallery);
        }
        if (dataSource.items) {
          numItems = dataSource.items.length;
        }
      }
      const event = this.dispatch("numItems", {
        dataSource,
        numItems
      });
      return this.applyFilters("numItems", event.numItems, dataSource);
    }
    /**
     * @param {SlideData} slideData
     * @param {number} index
     * @returns {Content}
     */
    createContentFromData(slideData, index) {
      return new Content2(slideData, this, index);
    }
    /**
     * Get item data by index.
     *
     * "item data" should contain normalized information that PhotoSwipe needs to generate a slide.
     * For example, it may contain properties like
     * `src`, `srcset`, `w`, `h`, which will be used to generate a slide with image.
     *
     * @param {number} index
     * @returns {SlideData}
     */
    getItemData(index) {
      var _this$options2;
      const dataSource = (_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.dataSource;
      let dataSourceItem = {};
      if (Array.isArray(dataSource)) {
        dataSourceItem = dataSource[index];
      } else if (dataSource && "gallery" in dataSource) {
        if (!dataSource.items) {
          dataSource.items = this._getGalleryDOMElements(dataSource.gallery);
        }
        dataSourceItem = dataSource.items[index];
      }
      let itemData = dataSourceItem;
      if (itemData instanceof Element) {
        itemData = this._domElementToItemData(itemData);
      }
      const event = this.dispatch("itemData", {
        itemData: itemData || {},
        index
      });
      return this.applyFilters("itemData", event.itemData, index);
    }
    /**
     * Get array of gallery DOM elements,
     * based on childSelector and gallery element.
     *
     * @param {HTMLElement} galleryElement
     * @returns {HTMLElement[]}
     */
    _getGalleryDOMElements(galleryElement) {
      var _this$options3, _this$options4;
      if ((_this$options3 = this.options) !== null && _this$options3 !== void 0 && _this$options3.children || (_this$options4 = this.options) !== null && _this$options4 !== void 0 && _this$options4.childSelector) {
        return getElementsFromOption(this.options.children, this.options.childSelector, galleryElement) || [];
      }
      return [galleryElement];
    }
    /**
     * Converts DOM element to item data object.
     *
     * @param {HTMLElement} element DOM element
     * @returns {SlideData}
     */
    _domElementToItemData(element) {
      const itemData = {
        element
      };
      const linkEl = (
        /** @type {HTMLAnchorElement} */
        element.tagName === "A" ? element : element.querySelector("a")
      );
      if (linkEl) {
        itemData.src = linkEl.dataset.pswpSrc || linkEl.href;
        if (linkEl.dataset.pswpSrcset) {
          itemData.srcset = linkEl.dataset.pswpSrcset;
        }
        itemData.width = linkEl.dataset.pswpWidth ? parseInt(linkEl.dataset.pswpWidth, 10) : 0;
        itemData.height = linkEl.dataset.pswpHeight ? parseInt(linkEl.dataset.pswpHeight, 10) : 0;
        itemData.w = itemData.width;
        itemData.h = itemData.height;
        if (linkEl.dataset.pswpType) {
          itemData.type = linkEl.dataset.pswpType;
        }
        const thumbnailEl = element.querySelector("img");
        if (thumbnailEl) {
          var _thumbnailEl$getAttri;
          itemData.msrc = thumbnailEl.currentSrc || thumbnailEl.src;
          itemData.alt = (_thumbnailEl$getAttri = thumbnailEl.getAttribute("alt")) !== null && _thumbnailEl$getAttri !== void 0 ? _thumbnailEl$getAttri : "";
        }
        if (linkEl.dataset.pswpCropped || linkEl.dataset.cropped) {
          itemData.thumbCropped = true;
        }
      }
      return this.applyFilters("domItemData", itemData, element, linkEl);
    }
    /**
     * Lazy-load by slide data
     *
     * @param {SlideData} itemData Data about the slide
     * @param {number} index
     * @returns {Content} Image that is being decoded or false.
     */
    lazyLoadData(itemData, index) {
      return lazyLoadData(itemData, this, index);
    }
  }
  class PhotoSwipeLightbox extends PhotoSwipeBase2 {
    /**
     * @param {PhotoSwipeOptions} [options]
     */
    constructor(options) {
      super();
      this.options = options || {};
      this._uid = 0;
      this.shouldOpen = false;
      this._preloadedContent = void 0;
      this.onThumbnailsClick = this.onThumbnailsClick.bind(this);
    }
    /**
     * Initialize lightbox, should be called only once.
     * It's not included in the main constructor, so you may bind events before it.
     */
    init() {
      getElementsFromOption(this.options.gallery, this.options.gallerySelector).forEach((galleryElement) => {
        galleryElement.addEventListener("click", this.onThumbnailsClick, false);
      });
    }
    /**
     * @param {MouseEvent} e
     */
    onThumbnailsClick(e) {
      if (specialKeyUsed(e) || window.pswp) {
        return;
      }
      let initialPoint = {
        x: e.clientX,
        y: e.clientY
      };
      if (!initialPoint.x && !initialPoint.y) {
        initialPoint = null;
      }
      let clickedIndex = this.getClickedIndex(e);
      clickedIndex = this.applyFilters("clickedIndex", clickedIndex, e, this);
      const dataSource = {
        gallery: (
          /** @type {HTMLElement} */
          e.currentTarget
        )
      };
      if (clickedIndex >= 0) {
        e.preventDefault();
        this.loadAndOpen(clickedIndex, dataSource, initialPoint);
      }
    }
    /**
     * Get index of gallery item that was clicked.
     *
     * @param {MouseEvent} e click event
     * @returns {number}
     */
    getClickedIndex(e) {
      if (this.options.getClickedIndexFn) {
        return this.options.getClickedIndexFn.call(this, e);
      }
      const clickedTarget = (
        /** @type {HTMLElement} */
        e.target
      );
      const childElements = getElementsFromOption(
        this.options.children,
        this.options.childSelector,
        /** @type {HTMLElement} */
        e.currentTarget
      );
      const clickedChildIndex = childElements.findIndex((child) => child === clickedTarget || child.contains(clickedTarget));
      if (clickedChildIndex !== -1) {
        return clickedChildIndex;
      } else if (this.options.children || this.options.childSelector) {
        return -1;
      }
      return 0;
    }
    /**
     * Load and open PhotoSwipe
     *
     * @param {number} index
     * @param {DataSource} [dataSource]
     * @param {Point | null} [initialPoint]
     * @returns {boolean}
     */
    loadAndOpen(index, dataSource, initialPoint) {
      if (window.pswp || !this.options) {
        return false;
      }
      if (!dataSource && this.options.gallery && this.options.children) {
        const galleryElements = getElementsFromOption(this.options.gallery);
        if (galleryElements[0]) {
          dataSource = {
            gallery: galleryElements[0]
          };
        }
      }
      this.options.index = index;
      this.options.initialPointerPos = initialPoint;
      this.shouldOpen = true;
      this.preload(index, dataSource);
      return true;
    }
    /**
     * Load the main module and the slide content by index
     *
     * @param {number} index
     * @param {DataSource} [dataSource]
     */
    preload(index, dataSource) {
      const {
        options
      } = this;
      if (dataSource) {
        options.dataSource = dataSource;
      }
      const promiseArray = [];
      const pswpModuleType = typeof options.pswpModule;
      if (isPswpClass(options.pswpModule)) {
        promiseArray.push(Promise.resolve(
          /** @type {Type<PhotoSwipe>} */
          options.pswpModule
        ));
      } else if (pswpModuleType === "string") {
        throw new Error("pswpModule as string is no longer supported");
      } else if (pswpModuleType === "function") {
        promiseArray.push(
          /** @type {() => Promise<Type<PhotoSwipe>>} */
          options.pswpModule()
        );
      } else {
        throw new Error("pswpModule is not valid");
      }
      if (typeof options.openPromise === "function") {
        promiseArray.push(options.openPromise());
      }
      if (options.preloadFirstSlide !== false && index >= 0) {
        this._preloadedContent = lazyLoadSlide(index, this);
      }
      const uid = ++this._uid;
      Promise.all(promiseArray).then((iterableModules) => {
        if (this.shouldOpen) {
          const mainModule = iterableModules[0];
          this._openPhotoswipe(mainModule, uid);
        }
      });
    }
    /**
     * @private
     * @param {Type<PhotoSwipe> | { default: Type<PhotoSwipe> }} module
     * @param {number} uid
     */
    _openPhotoswipe(module, uid) {
      if (uid !== this._uid && this.shouldOpen) {
        return;
      }
      this.shouldOpen = false;
      if (window.pswp) {
        return;
      }
      const pswp = typeof module === "object" ? new module.default(this.options) : new module(this.options);
      this.pswp = pswp;
      window.pswp = pswp;
      Object.keys(this._listeners).forEach((name) => {
        var _this$_listeners$name;
        (_this$_listeners$name = this._listeners[name]) === null || _this$_listeners$name === void 0 || _this$_listeners$name.forEach((fn) => {
          pswp.on(
            name,
            /** @type {EventCallback<typeof name>} */
            fn
          );
        });
      });
      Object.keys(this._filters).forEach((name) => {
        var _this$_filters$name;
        (_this$_filters$name = this._filters[name]) === null || _this$_filters$name === void 0 || _this$_filters$name.forEach((filter) => {
          pswp.addFilter(name, filter.fn, filter.priority);
        });
      });
      if (this._preloadedContent) {
        pswp.contentLoader.addToCache(this._preloadedContent);
        this._preloadedContent = void 0;
      }
      pswp.on("destroy", () => {
        this.pswp = void 0;
        delete window.pswp;
      });
      pswp.init();
    }
    /**
     * Unbinds all events, closes PhotoSwipe if it's open.
     */
    destroy() {
      var _this$pswp;
      (_this$pswp = this.pswp) === null || _this$pswp === void 0 || _this$pswp.destroy();
      this.shouldOpen = false;
      this._listeners = {};
      getElementsFromOption(this.options.gallery, this.options.gallerySelector).forEach((galleryElement) => {
        galleryElement.removeEventListener("click", this.onThumbnailsClick, false);
      });
    }
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var jquery = { exports: {} };
  /*!
   * jQuery JavaScript Library v3.7.1
   * https://jquery.com/
   *
   * Copyright OpenJS Foundation and other contributors
   * Released under the MIT license
   * https://jquery.org/license
   *
   * Date: 2023-08-28T13:37Z
   */
  (function(module) {
    (function(global2, factory) {
      {
        module.exports = global2.document ? factory(global2, true) : function(w) {
          if (!w.document) {
            throw new Error("jQuery requires a window with a document");
          }
          return factory(w);
        };
      }
    })(typeof window !== "undefined" ? window : commonjsGlobal, function(window2, noGlobal) {
      var arr = [];
      var getProto = Object.getPrototypeOf;
      var slice = arr.slice;
      var flat = arr.flat ? function(array) {
        return arr.flat.call(array);
      } : function(array) {
        return arr.concat.apply([], array);
      };
      var push = arr.push;
      var indexOf = arr.indexOf;
      var class2type = {};
      var toString = class2type.toString;
      var hasOwn = class2type.hasOwnProperty;
      var fnToString = hasOwn.toString;
      var ObjectFunctionString = fnToString.call(Object);
      var support = {};
      var isFunction = function isFunction2(obj) {
        return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
      };
      var isWindow = function isWindow2(obj) {
        return obj != null && obj === obj.window;
      };
      var document2 = window2.document;
      var preservedScriptAttributes = {
        type: true,
        src: true,
        nonce: true,
        noModule: true
      };
      function DOMEval(code, node, doc) {
        doc = doc || document2;
        var i, val, script = doc.createElement("script");
        script.text = code;
        if (node) {
          for (i in preservedScriptAttributes) {
            val = node[i] || node.getAttribute && node.getAttribute(i);
            if (val) {
              script.setAttribute(i, val);
            }
          }
        }
        doc.head.appendChild(script).parentNode.removeChild(script);
      }
      function toType(obj) {
        if (obj == null) {
          return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
      }
      var version = "3.7.1", rhtmlSuffix = /HTML$/i, jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context);
      };
      jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: version,
        constructor: jQuery,
        // The default length of a jQuery object is 0
        length: 0,
        toArray: function() {
          return slice.call(this);
        },
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function(num) {
          if (num == null) {
            return slice.call(this);
          }
          return num < 0 ? this[num + this.length] : this[num];
        },
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function(elems) {
          var ret = jQuery.merge(this.constructor(), elems);
          ret.prevObject = this;
          return ret;
        },
        // Execute a callback for every element in the matched set.
        each: function(callback) {
          return jQuery.each(this, callback);
        },
        map: function(callback) {
          return this.pushStack(jQuery.map(this, function(elem, i) {
            return callback.call(elem, i, elem);
          }));
        },
        slice: function() {
          return this.pushStack(slice.apply(this, arguments));
        },
        first: function() {
          return this.eq(0);
        },
        last: function() {
          return this.eq(-1);
        },
        even: function() {
          return this.pushStack(jQuery.grep(this, function(_elem, i) {
            return (i + 1) % 2;
          }));
        },
        odd: function() {
          return this.pushStack(jQuery.grep(this, function(_elem, i) {
            return i % 2;
          }));
        },
        eq: function(i) {
          var len = this.length, j = +i + (i < 0 ? len : 0);
          return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        end: function() {
          return this.prevObject || this.constructor();
        },
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push,
        sort: arr.sort,
        splice: arr.splice
      };
      jQuery.extend = jQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
        if (typeof target === "boolean") {
          deep = target;
          target = arguments[i] || {};
          i++;
        }
        if (typeof target !== "object" && !isFunction(target)) {
          target = {};
        }
        if (i === length) {
          target = this;
          i--;
        }
        for (; i < length; i++) {
          if ((options = arguments[i]) != null) {
            for (name in options) {
              copy = options[name];
              if (name === "__proto__" || target === copy) {
                continue;
              }
              if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                src = target[name];
                if (copyIsArray && !Array.isArray(src)) {
                  clone = [];
                } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                  clone = {};
                } else {
                  clone = src;
                }
                copyIsArray = false;
                target[name] = jQuery.extend(deep, clone, copy);
              } else if (copy !== void 0) {
                target[name] = copy;
              }
            }
          }
        }
        return target;
      };
      jQuery.extend({
        // Unique for each copy of jQuery on the page
        expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
        // Assume jQuery is ready without the ready module
        isReady: true,
        error: function(msg) {
          throw new Error(msg);
        },
        noop: function() {
        },
        isPlainObject: function(obj) {
          var proto, Ctor;
          if (!obj || toString.call(obj) !== "[object Object]") {
            return false;
          }
          proto = getProto(obj);
          if (!proto) {
            return true;
          }
          Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
          return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
        },
        isEmptyObject: function(obj) {
          var name;
          for (name in obj) {
            return false;
          }
          return true;
        },
        // Evaluates a script in a provided context; falls back to the global one
        // if not specified.
        globalEval: function(code, options, doc) {
          DOMEval(code, { nonce: options && options.nonce }, doc);
        },
        each: function(obj, callback) {
          var length, i = 0;
          if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
              if (callback.call(obj[i], i, obj[i]) === false) {
                break;
              }
            }
          } else {
            for (i in obj) {
              if (callback.call(obj[i], i, obj[i]) === false) {
                break;
              }
            }
          }
          return obj;
        },
        // Retrieve the text value of an array of DOM nodes
        text: function(elem) {
          var node, ret = "", i = 0, nodeType = elem.nodeType;
          if (!nodeType) {
            while (node = elem[i++]) {
              ret += jQuery.text(node);
            }
          }
          if (nodeType === 1 || nodeType === 11) {
            return elem.textContent;
          }
          if (nodeType === 9) {
            return elem.documentElement.textContent;
          }
          if (nodeType === 3 || nodeType === 4) {
            return elem.nodeValue;
          }
          return ret;
        },
        // results is for internal usage only
        makeArray: function(arr2, results) {
          var ret = results || [];
          if (arr2 != null) {
            if (isArrayLike(Object(arr2))) {
              jQuery.merge(
                ret,
                typeof arr2 === "string" ? [arr2] : arr2
              );
            } else {
              push.call(ret, arr2);
            }
          }
          return ret;
        },
        inArray: function(elem, arr2, i) {
          return arr2 == null ? -1 : indexOf.call(arr2, elem, i);
        },
        isXMLDoc: function(elem) {
          var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
          return !rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
        },
        // Support: Android <=4.0 only, PhantomJS 1 only
        // push.apply(_, arraylike) throws on ancient WebKit
        merge: function(first, second) {
          var len = +second.length, j = 0, i = first.length;
          for (; j < len; j++) {
            first[i++] = second[j];
          }
          first.length = i;
          return first;
        },
        grep: function(elems, callback, invert) {
          var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
          for (; i < length; i++) {
            callbackInverse = !callback(elems[i], i);
            if (callbackInverse !== callbackExpect) {
              matches.push(elems[i]);
            }
          }
          return matches;
        },
        // arg is for internal usage only
        map: function(elems, callback, arg) {
          var length, value, i = 0, ret = [];
          if (isArrayLike(elems)) {
            length = elems.length;
            for (; i < length; i++) {
              value = callback(elems[i], i, arg);
              if (value != null) {
                ret.push(value);
              }
            }
          } else {
            for (i in elems) {
              value = callback(elems[i], i, arg);
              if (value != null) {
                ret.push(value);
              }
            }
          }
          return flat(ret);
        },
        // A global GUID counter for objects
        guid: 1,
        // jQuery.support is not used in Core but other projects attach their
        // properties to it so it needs to exist.
        support
      });
      if (typeof Symbol === "function") {
        jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
      }
      jQuery.each(
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
        function(_i, name) {
          class2type["[object " + name + "]"] = name.toLowerCase();
        }
      );
      function isArrayLike(obj) {
        var length = !!obj && "length" in obj && obj.length, type = toType(obj);
        if (isFunction(obj) || isWindow(obj)) {
          return false;
        }
        return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
      }
      function nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
      }
      var pop = arr.pop;
      var sort = arr.sort;
      var splice = arr.splice;
      var whitespace = "[\\x20\\t\\r\\n\\f]";
      var rtrimCSS = new RegExp(
        "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
        "g"
      );
      jQuery.contains = function(a, b) {
        var bup = b && b.parentNode;
        return a === bup || !!(bup && bup.nodeType === 1 && // Support: IE 9 - 11+
        // IE doesn't have `contains` on SVG.
        (a.contains ? a.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
      };
      var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
      function fcssescape(ch, asCodePoint) {
        if (asCodePoint) {
          if (ch === "\0") {
            return "�";
          }
          return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
        }
        return "\\" + ch;
      }
      jQuery.escapeSelector = function(sel) {
        return (sel + "").replace(rcssescape, fcssescape);
      };
      var preferredDoc = document2, pushNative = push;
      (function() {
        var i, Expr, outermostContext, sortInput, hasDuplicate, push2 = pushNative, document3, documentElement2, documentIsHTML, rbuggyQSA, matches, expando = jQuery.expando, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
          if (a === b) {
            hasDuplicate = true;
          }
          return 0;
        }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
        "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
        `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rleadingCombinator = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
          ID: new RegExp("^#(" + identifier + ")"),
          CLASS: new RegExp("^\\.(" + identifier + ")"),
          TAG: new RegExp("^(" + identifier + "|[*])"),
          ATTR: new RegExp("^" + attributes),
          PSEUDO: new RegExp("^" + pseudos),
          CHILD: new RegExp(
            "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)",
            "i"
          ),
          bool: new RegExp("^(?:" + booleans + ")$", "i"),
          // For use in libraries implementing .is()
          // We use this for POS matching in `select`
          needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
          var high = "0x" + escape.slice(1) - 65536;
          if (nonHex) {
            return nonHex;
          }
          return high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
        }, unloadHandler = function() {
          setDocument();
        }, inDisabledFieldset = addCombinator(
          function(elem) {
            return elem.disabled === true && nodeName(elem, "fieldset");
          },
          { dir: "parentNode", next: "legend" }
        );
        function safeActiveElement() {
          try {
            return document3.activeElement;
          } catch (err) {
          }
        }
        try {
          push2.apply(
            arr = slice.call(preferredDoc.childNodes),
            preferredDoc.childNodes
          );
          arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
          push2 = {
            apply: function(target, els) {
              pushNative.apply(target, slice.call(els));
            },
            call: function(target) {
              pushNative.apply(target, slice.call(arguments, 1));
            }
          };
        }
        function find(selector, context, results, seed) {
          var m, i2, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
          results = results || [];
          if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
            return results;
          }
          if (!seed) {
            setDocument(context);
            context = context || document3;
            if (documentIsHTML) {
              if (nodeType !== 11 && (match = rquickExpr2.exec(selector))) {
                if (m = match[1]) {
                  if (nodeType === 9) {
                    if (elem = context.getElementById(m)) {
                      if (elem.id === m) {
                        push2.call(results, elem);
                        return results;
                      }
                    } else {
                      return results;
                    }
                  } else {
                    if (newContext && (elem = newContext.getElementById(m)) && find.contains(context, elem) && elem.id === m) {
                      push2.call(results, elem);
                      return results;
                    }
                  }
                } else if (match[2]) {
                  push2.apply(results, context.getElementsByTagName(selector));
                  return results;
                } else if ((m = match[3]) && context.getElementsByClassName) {
                  push2.apply(results, context.getElementsByClassName(m));
                  return results;
                }
              }
              if (!nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                newSelector = selector;
                newContext = context;
                if (nodeType === 1 && (rdescend.test(selector) || rleadingCombinator.test(selector))) {
                  newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                  if (newContext != context || !support.scope) {
                    if (nid = context.getAttribute("id")) {
                      nid = jQuery.escapeSelector(nid);
                    } else {
                      context.setAttribute("id", nid = expando);
                    }
                  }
                  groups = tokenize(selector);
                  i2 = groups.length;
                  while (i2--) {
                    groups[i2] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i2]);
                  }
                  newSelector = groups.join(",");
                }
                try {
                  push2.apply(
                    results,
                    newContext.querySelectorAll(newSelector)
                  );
                  return results;
                } catch (qsaError) {
                  nonnativeSelectorCache(selector, true);
                } finally {
                  if (nid === expando) {
                    context.removeAttribute("id");
                  }
                }
              }
            }
          }
          return select(selector.replace(rtrimCSS, "$1"), context, results, seed);
        }
        function createCache() {
          var keys = [];
          function cache(key, value) {
            if (keys.push(key + " ") > Expr.cacheLength) {
              delete cache[keys.shift()];
            }
            return cache[key + " "] = value;
          }
          return cache;
        }
        function markFunction(fn) {
          fn[expando] = true;
          return fn;
        }
        function assert(fn) {
          var el = document3.createElement("fieldset");
          try {
            return !!fn(el);
          } catch (e) {
            return false;
          } finally {
            if (el.parentNode) {
              el.parentNode.removeChild(el);
            }
            el = null;
          }
        }
        function createInputPseudo(type) {
          return function(elem) {
            return nodeName(elem, "input") && elem.type === type;
          };
        }
        function createButtonPseudo(type) {
          return function(elem) {
            return (nodeName(elem, "input") || nodeName(elem, "button")) && elem.type === type;
          };
        }
        function createDisabledPseudo(disabled) {
          return function(elem) {
            if ("form" in elem) {
              if (elem.parentNode && elem.disabled === false) {
                if ("label" in elem) {
                  if ("label" in elem.parentNode) {
                    return elem.parentNode.disabled === disabled;
                  } else {
                    return elem.disabled === disabled;
                  }
                }
                return elem.isDisabled === disabled || // Where there is no isDisabled, check manually
                elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
              }
              return elem.disabled === disabled;
            } else if ("label" in elem) {
              return elem.disabled === disabled;
            }
            return false;
          };
        }
        function createPositionalPseudo(fn) {
          return markFunction(function(argument) {
            argument = +argument;
            return markFunction(function(seed, matches2) {
              var j, matchIndexes = fn([], seed.length, argument), i2 = matchIndexes.length;
              while (i2--) {
                if (seed[j = matchIndexes[i2]]) {
                  seed[j] = !(matches2[j] = seed[j]);
                }
              }
            });
          });
        }
        function testContext(context) {
          return context && typeof context.getElementsByTagName !== "undefined" && context;
        }
        function setDocument(node) {
          var subWindow, doc = node ? node.ownerDocument || node : preferredDoc;
          if (doc == document3 || doc.nodeType !== 9 || !doc.documentElement) {
            return document3;
          }
          document3 = doc;
          documentElement2 = document3.documentElement;
          documentIsHTML = !jQuery.isXMLDoc(document3);
          matches = documentElement2.matches || documentElement2.webkitMatchesSelector || documentElement2.msMatchesSelector;
          if (documentElement2.msMatchesSelector && // Support: IE 11+, Edge 17 - 18+
          // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
          // two documents; shallow comparisons work.
          // eslint-disable-next-line eqeqeq
          preferredDoc != document3 && (subWindow = document3.defaultView) && subWindow.top !== subWindow) {
            subWindow.addEventListener("unload", unloadHandler);
          }
          support.getById = assert(function(el) {
            documentElement2.appendChild(el).id = jQuery.expando;
            return !document3.getElementsByName || !document3.getElementsByName(jQuery.expando).length;
          });
          support.disconnectedMatch = assert(function(el) {
            return matches.call(el, "*");
          });
          support.scope = assert(function() {
            return document3.querySelectorAll(":scope");
          });
          support.cssHas = assert(function() {
            try {
              document3.querySelector(":has(*,:jqfake)");
              return false;
            } catch (e) {
              return true;
            }
          });
          if (support.getById) {
            Expr.filter.ID = function(id) {
              var attrId = id.replace(runescape, funescape);
              return function(elem) {
                return elem.getAttribute("id") === attrId;
              };
            };
            Expr.find.ID = function(id, context) {
              if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                var elem = context.getElementById(id);
                return elem ? [elem] : [];
              }
            };
          } else {
            Expr.filter.ID = function(id) {
              var attrId = id.replace(runescape, funescape);
              return function(elem) {
                var node2 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                return node2 && node2.value === attrId;
              };
            };
            Expr.find.ID = function(id, context) {
              if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                var node2, i2, elems, elem = context.getElementById(id);
                if (elem) {
                  node2 = elem.getAttributeNode("id");
                  if (node2 && node2.value === id) {
                    return [elem];
                  }
                  elems = context.getElementsByName(id);
                  i2 = 0;
                  while (elem = elems[i2++]) {
                    node2 = elem.getAttributeNode("id");
                    if (node2 && node2.value === id) {
                      return [elem];
                    }
                  }
                }
                return [];
              }
            };
          }
          Expr.find.TAG = function(tag, context) {
            if (typeof context.getElementsByTagName !== "undefined") {
              return context.getElementsByTagName(tag);
            } else {
              return context.querySelectorAll(tag);
            }
          };
          Expr.find.CLASS = function(className, context) {
            if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
              return context.getElementsByClassName(className);
            }
          };
          rbuggyQSA = [];
          assert(function(el) {
            var input;
            documentElement2.appendChild(el).innerHTML = "<a id='" + expando + "' href='' disabled='disabled'></a><select id='" + expando + "-\r\\' disabled='disabled'><option selected=''></option></select>";
            if (!el.querySelectorAll("[selected]").length) {
              rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
            }
            if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
              rbuggyQSA.push("~=");
            }
            if (!el.querySelectorAll("a#" + expando + "+*").length) {
              rbuggyQSA.push(".#.+[+~]");
            }
            if (!el.querySelectorAll(":checked").length) {
              rbuggyQSA.push(":checked");
            }
            input = document3.createElement("input");
            input.setAttribute("type", "hidden");
            el.appendChild(input).setAttribute("name", "D");
            documentElement2.appendChild(el).disabled = true;
            if (el.querySelectorAll(":disabled").length !== 2) {
              rbuggyQSA.push(":enabled", ":disabled");
            }
            input = document3.createElement("input");
            input.setAttribute("name", "");
            el.appendChild(input);
            if (!el.querySelectorAll("[name='']").length) {
              rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + `*(?:''|"")`);
            }
          });
          if (!support.cssHas) {
            rbuggyQSA.push(":has");
          }
          rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
          sortOrder = function(a, b) {
            if (a === b) {
              hasDuplicate = true;
              return 0;
            }
            var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
            if (compare) {
              return compare;
            }
            compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : (
              // Otherwise we know they are disconnected
              1
            );
            if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
              if (a === document3 || a.ownerDocument == preferredDoc && find.contains(preferredDoc, a)) {
                return -1;
              }
              if (b === document3 || b.ownerDocument == preferredDoc && find.contains(preferredDoc, b)) {
                return 1;
              }
              return sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
            }
            return compare & 4 ? -1 : 1;
          };
          return document3;
        }
        find.matches = function(expr, elements) {
          return find(expr, null, null, elements);
        };
        find.matchesSelector = function(elem, expr) {
          setDocument(elem);
          if (documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
            try {
              var ret = matches.call(elem, expr);
              if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
              // fragment in IE 9
              elem.document && elem.document.nodeType !== 11) {
                return ret;
              }
            } catch (e) {
              nonnativeSelectorCache(expr, true);
            }
          }
          return find(expr, document3, null, [elem]).length > 0;
        };
        find.contains = function(context, elem) {
          if ((context.ownerDocument || context) != document3) {
            setDocument(context);
          }
          return jQuery.contains(context, elem);
        };
        find.attr = function(elem, name) {
          if ((elem.ownerDocument || elem) != document3) {
            setDocument(elem);
          }
          var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : void 0;
          if (val !== void 0) {
            return val;
          }
          return elem.getAttribute(name);
        };
        find.error = function(msg) {
          throw new Error("Syntax error, unrecognized expression: " + msg);
        };
        jQuery.uniqueSort = function(results) {
          var elem, duplicates = [], j = 0, i2 = 0;
          hasDuplicate = !support.sortStable;
          sortInput = !support.sortStable && slice.call(results, 0);
          sort.call(results, sortOrder);
          if (hasDuplicate) {
            while (elem = results[i2++]) {
              if (elem === results[i2]) {
                j = duplicates.push(i2);
              }
            }
            while (j--) {
              splice.call(results, duplicates[j], 1);
            }
          }
          sortInput = null;
          return results;
        };
        jQuery.fn.uniqueSort = function() {
          return this.pushStack(jQuery.uniqueSort(slice.apply(this)));
        };
        Expr = jQuery.expr = {
          // Can be adjusted by the user
          cacheLength: 50,
          createPseudo: markFunction,
          match: matchExpr,
          attrHandle: {},
          find: {},
          relative: {
            ">": { dir: "parentNode", first: true },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: true },
            "~": { dir: "previousSibling" }
          },
          preFilter: {
            ATTR: function(match) {
              match[1] = match[1].replace(runescape, funescape);
              match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
              if (match[2] === "~=") {
                match[3] = " " + match[3] + " ";
              }
              return match.slice(0, 4);
            },
            CHILD: function(match) {
              match[1] = match[1].toLowerCase();
              if (match[1].slice(0, 3) === "nth") {
                if (!match[3]) {
                  find.error(match[0]);
                }
                match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                match[5] = +(match[7] + match[8] || match[3] === "odd");
              } else if (match[3]) {
                find.error(match[0]);
              }
              return match;
            },
            PSEUDO: function(match) {
              var excess, unquoted = !match[6] && match[2];
              if (matchExpr.CHILD.test(match[0])) {
                return null;
              }
              if (match[3]) {
                match[2] = match[4] || match[5] || "";
              } else if (unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
              (excess = tokenize(unquoted, true)) && // advance to the next closing parenthesis
              (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                match[0] = match[0].slice(0, excess);
                match[2] = unquoted.slice(0, excess);
              }
              return match.slice(0, 3);
            }
          },
          filter: {
            TAG: function(nodeNameSelector) {
              var expectedNodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
              return nodeNameSelector === "*" ? function() {
                return true;
              } : function(elem) {
                return nodeName(elem, expectedNodeName);
              };
            },
            CLASS: function(className) {
              var pattern = classCache[className + " "];
              return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                return pattern.test(
                  typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
                );
              });
            },
            ATTR: function(name, operator, check) {
              return function(elem) {
                var result = find.attr(elem, name);
                if (result == null) {
                  return operator === "!=";
                }
                if (!operator) {
                  return true;
                }
                result += "";
                if (operator === "=") {
                  return result === check;
                }
                if (operator === "!=") {
                  return result !== check;
                }
                if (operator === "^=") {
                  return check && result.indexOf(check) === 0;
                }
                if (operator === "*=") {
                  return check && result.indexOf(check) > -1;
                }
                if (operator === "$=") {
                  return check && result.slice(-check.length) === check;
                }
                if (operator === "~=") {
                  return (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1;
                }
                if (operator === "|=") {
                  return result === check || result.slice(0, check.length + 1) === check + "-";
                }
                return false;
              };
            },
            CHILD: function(type, what, _argument, first, last) {
              var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
              return first === 1 && last === 0 ? (
                // Shortcut for :nth-*(n)
                function(elem) {
                  return !!elem.parentNode;
                }
              ) : function(elem, _context, xml) {
                var cache, outerCache, node, nodeIndex, start, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                if (parent) {
                  if (simple) {
                    while (dir2) {
                      node = elem;
                      while (node = node[dir2]) {
                        if (ofType ? nodeName(node, name) : node.nodeType === 1) {
                          return false;
                        }
                      }
                      start = dir2 = type === "only" && !start && "nextSibling";
                    }
                    return true;
                  }
                  start = [forward ? parent.firstChild : parent.lastChild];
                  if (forward && useCache) {
                    outerCache = parent[expando] || (parent[expando] = {});
                    cache = outerCache[type] || [];
                    nodeIndex = cache[0] === dirruns && cache[1];
                    diff = nodeIndex && cache[2];
                    node = nodeIndex && parent.childNodes[nodeIndex];
                    while (node = ++nodeIndex && node && node[dir2] || // Fallback to seeking `elem` from the start
                    (diff = nodeIndex = 0) || start.pop()) {
                      if (node.nodeType === 1 && ++diff && node === elem) {
                        outerCache[type] = [dirruns, nodeIndex, diff];
                        break;
                      }
                    }
                  } else {
                    if (useCache) {
                      outerCache = elem[expando] || (elem[expando] = {});
                      cache = outerCache[type] || [];
                      nodeIndex = cache[0] === dirruns && cache[1];
                      diff = nodeIndex;
                    }
                    if (diff === false) {
                      while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start.pop()) {
                        if ((ofType ? nodeName(node, name) : node.nodeType === 1) && ++diff) {
                          if (useCache) {
                            outerCache = node[expando] || (node[expando] = {});
                            outerCache[type] = [dirruns, diff];
                          }
                          if (node === elem) {
                            break;
                          }
                        }
                      }
                    }
                  }
                  diff -= last;
                  return diff === first || diff % first === 0 && diff / first >= 0;
                }
              };
            },
            PSEUDO: function(pseudo, argument) {
              var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || find.error("unsupported pseudo: " + pseudo);
              if (fn[expando]) {
                return fn(argument);
              }
              if (fn.length > 1) {
                args = [pseudo, pseudo, "", argument];
                return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches2) {
                  var idx, matched = fn(seed, argument), i2 = matched.length;
                  while (i2--) {
                    idx = indexOf.call(seed, matched[i2]);
                    seed[idx] = !(matches2[idx] = matched[i2]);
                  }
                }) : function(elem) {
                  return fn(elem, 0, args);
                };
              }
              return fn;
            }
          },
          pseudos: {
            // Potentially complex pseudos
            not: markFunction(function(selector) {
              var input = [], results = [], matcher = compile(selector.replace(rtrimCSS, "$1"));
              return matcher[expando] ? markFunction(function(seed, matches2, _context, xml) {
                var elem, unmatched = matcher(seed, null, xml, []), i2 = seed.length;
                while (i2--) {
                  if (elem = unmatched[i2]) {
                    seed[i2] = !(matches2[i2] = elem);
                  }
                }
              }) : function(elem, _context, xml) {
                input[0] = elem;
                matcher(input, null, xml, results);
                input[0] = null;
                return !results.pop();
              };
            }),
            has: markFunction(function(selector) {
              return function(elem) {
                return find(selector, elem).length > 0;
              };
            }),
            contains: markFunction(function(text) {
              text = text.replace(runescape, funescape);
              return function(elem) {
                return (elem.textContent || jQuery.text(elem)).indexOf(text) > -1;
              };
            }),
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // https://www.w3.org/TR/selectors/#lang-pseudo
            lang: markFunction(function(lang) {
              if (!ridentifier.test(lang || "")) {
                find.error("unsupported lang: " + lang);
              }
              lang = lang.replace(runescape, funescape).toLowerCase();
              return function(elem) {
                var elemLang;
                do {
                  if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                    elemLang = elemLang.toLowerCase();
                    return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                  }
                } while ((elem = elem.parentNode) && elem.nodeType === 1);
                return false;
              };
            }),
            // Miscellaneous
            target: function(elem) {
              var hash = window2.location && window2.location.hash;
              return hash && hash.slice(1) === elem.id;
            },
            root: function(elem) {
              return elem === documentElement2;
            },
            focus: function(elem) {
              return elem === safeActiveElement() && document3.hasFocus() && !!(elem.type || elem.href || ~elem.tabIndex);
            },
            // Boolean properties
            enabled: createDisabledPseudo(false),
            disabled: createDisabledPseudo(true),
            checked: function(elem) {
              return nodeName(elem, "input") && !!elem.checked || nodeName(elem, "option") && !!elem.selected;
            },
            selected: function(elem) {
              if (elem.parentNode) {
                elem.parentNode.selectedIndex;
              }
              return elem.selected === true;
            },
            // Contents
            empty: function(elem) {
              for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                if (elem.nodeType < 6) {
                  return false;
                }
              }
              return true;
            },
            parent: function(elem) {
              return !Expr.pseudos.empty(elem);
            },
            // Element/input types
            header: function(elem) {
              return rheader.test(elem.nodeName);
            },
            input: function(elem) {
              return rinputs.test(elem.nodeName);
            },
            button: function(elem) {
              return nodeName(elem, "input") && elem.type === "button" || nodeName(elem, "button");
            },
            text: function(elem) {
              var attr;
              return nodeName(elem, "input") && elem.type === "text" && // Support: IE <10 only
              // New HTML5 attribute values (e.g., "search") appear
              // with elem.type === "text"
              ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
            },
            // Position-in-collection
            first: createPositionalPseudo(function() {
              return [0];
            }),
            last: createPositionalPseudo(function(_matchIndexes, length) {
              return [length - 1];
            }),
            eq: createPositionalPseudo(function(_matchIndexes, length, argument) {
              return [argument < 0 ? argument + length : argument];
            }),
            even: createPositionalPseudo(function(matchIndexes, length) {
              var i2 = 0;
              for (; i2 < length; i2 += 2) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            }),
            odd: createPositionalPseudo(function(matchIndexes, length) {
              var i2 = 1;
              for (; i2 < length; i2 += 2) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            }),
            lt: createPositionalPseudo(function(matchIndexes, length, argument) {
              var i2;
              if (argument < 0) {
                i2 = argument + length;
              } else if (argument > length) {
                i2 = length;
              } else {
                i2 = argument;
              }
              for (; --i2 >= 0; ) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            }),
            gt: createPositionalPseudo(function(matchIndexes, length, argument) {
              var i2 = argument < 0 ? argument + length : argument;
              for (; ++i2 < length; ) {
                matchIndexes.push(i2);
              }
              return matchIndexes;
            })
          }
        };
        Expr.pseudos.nth = Expr.pseudos.eq;
        for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
          Expr.pseudos[i] = createInputPseudo(i);
        }
        for (i in { submit: true, reset: true }) {
          Expr.pseudos[i] = createButtonPseudo(i);
        }
        function setFilters() {
        }
        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();
        function tokenize(selector, parseOnly) {
          var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
          if (cached) {
            return parseOnly ? 0 : cached.slice(0);
          }
          soFar = selector;
          groups = [];
          preFilters = Expr.preFilter;
          while (soFar) {
            if (!matched || (match = rcomma.exec(soFar))) {
              if (match) {
                soFar = soFar.slice(match[0].length) || soFar;
              }
              groups.push(tokens = []);
            }
            matched = false;
            if (match = rleadingCombinator.exec(soFar)) {
              matched = match.shift();
              tokens.push({
                value: matched,
                // Cast descendant combinators to space
                type: match[0].replace(rtrimCSS, " ")
              });
              soFar = soFar.slice(matched.length);
            }
            for (type in Expr.filter) {
              if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                matched = match.shift();
                tokens.push({
                  value: matched,
                  type,
                  matches: match
                });
                soFar = soFar.slice(matched.length);
              }
            }
            if (!matched) {
              break;
            }
          }
          if (parseOnly) {
            return soFar.length;
          }
          return soFar ? find.error(selector) : (
            // Cache the tokens
            tokenCache(selector, groups).slice(0)
          );
        }
        function toSelector(tokens) {
          var i2 = 0, len = tokens.length, selector = "";
          for (; i2 < len; i2++) {
            selector += tokens[i2].value;
          }
          return selector;
        }
        function addCombinator(matcher, combinator, base) {
          var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base && key === "parentNode", doneName = done++;
          return combinator.first ? (
            // Check against closest ancestor/preceding element
            function(elem, context, xml) {
              while (elem = elem[dir2]) {
                if (elem.nodeType === 1 || checkNonElements) {
                  return matcher(elem, context, xml);
                }
              }
              return false;
            }
          ) : (
            // Check against all ancestor/preceding elements
            function(elem, context, xml) {
              var oldCache, outerCache, newCache = [dirruns, doneName];
              if (xml) {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    if (matcher(elem, context, xml)) {
                      return true;
                    }
                  }
                }
              } else {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    outerCache = elem[expando] || (elem[expando] = {});
                    if (skip && nodeName(elem, skip)) {
                      elem = elem[dir2] || elem;
                    } else if ((oldCache = outerCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                      return newCache[2] = oldCache[2];
                    } else {
                      outerCache[key] = newCache;
                      if (newCache[2] = matcher(elem, context, xml)) {
                        return true;
                      }
                    }
                  }
                }
              }
              return false;
            }
          );
        }
        function elementMatcher(matchers) {
          return matchers.length > 1 ? function(elem, context, xml) {
            var i2 = matchers.length;
            while (i2--) {
              if (!matchers[i2](elem, context, xml)) {
                return false;
              }
            }
            return true;
          } : matchers[0];
        }
        function multipleContexts(selector, contexts, results) {
          var i2 = 0, len = contexts.length;
          for (; i2 < len; i2++) {
            find(selector, contexts[i2], results);
          }
          return results;
        }
        function condense(unmatched, map, filter, context, xml) {
          var elem, newUnmatched = [], i2 = 0, len = unmatched.length, mapped = map != null;
          for (; i2 < len; i2++) {
            if (elem = unmatched[i2]) {
              if (!filter || filter(elem, context, xml)) {
                newUnmatched.push(elem);
                if (mapped) {
                  map.push(i2);
                }
              }
            }
          }
          return newUnmatched;
        }
        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
          if (postFilter && !postFilter[expando]) {
            postFilter = setMatcher(postFilter);
          }
          if (postFinder && !postFinder[expando]) {
            postFinder = setMatcher(postFinder, postSelector);
          }
          return markFunction(function(seed, results, context, xml) {
            var temp, i2, elem, matcherOut, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
              selector || "*",
              context.nodeType ? [context] : context,
              []
            ), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems;
            if (matcher) {
              matcherOut = postFinder || (seed ? preFilter : preexisting || postFilter) ? (
                // ...intermediate processing is necessary
                []
              ) : (
                // ...otherwise use results directly
                results
              );
              matcher(matcherIn, matcherOut, context, xml);
            } else {
              matcherOut = matcherIn;
            }
            if (postFilter) {
              temp = condense(matcherOut, postMap);
              postFilter(temp, [], context, xml);
              i2 = temp.length;
              while (i2--) {
                if (elem = temp[i2]) {
                  matcherOut[postMap[i2]] = !(matcherIn[postMap[i2]] = elem);
                }
              }
            }
            if (seed) {
              if (postFinder || preFilter) {
                if (postFinder) {
                  temp = [];
                  i2 = matcherOut.length;
                  while (i2--) {
                    if (elem = matcherOut[i2]) {
                      temp.push(matcherIn[i2] = elem);
                    }
                  }
                  postFinder(null, matcherOut = [], temp, xml);
                }
                i2 = matcherOut.length;
                while (i2--) {
                  if ((elem = matcherOut[i2]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i2]) > -1) {
                    seed[temp] = !(results[temp] = elem);
                  }
                }
              }
            } else {
              matcherOut = condense(
                matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
              );
              if (postFinder) {
                postFinder(null, results, matcherOut, xml);
              } else {
                push2.apply(results, matcherOut);
              }
            }
          });
        }
        function matcherFromTokens(tokens) {
          var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i2 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
            return elem === checkContext;
          }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
            return indexOf.call(checkContext, elem) > -1;
          }, implicitRelative, true), matchers = [function(elem, context, xml) {
            var ret = !leadingRelative && (xml || context != outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
            checkContext = null;
            return ret;
          }];
          for (; i2 < len; i2++) {
            if (matcher = Expr.relative[tokens[i2].type]) {
              matchers = [addCombinator(elementMatcher(matchers), matcher)];
            } else {
              matcher = Expr.filter[tokens[i2].type].apply(null, tokens[i2].matches);
              if (matcher[expando]) {
                j = ++i2;
                for (; j < len; j++) {
                  if (Expr.relative[tokens[j].type]) {
                    break;
                  }
                }
                return setMatcher(
                  i2 > 1 && elementMatcher(matchers),
                  i2 > 1 && toSelector(
                    // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                    tokens.slice(0, i2 - 1).concat({ value: tokens[i2 - 2].type === " " ? "*" : "" })
                  ).replace(rtrimCSS, "$1"),
                  matcher,
                  i2 < j && matcherFromTokens(tokens.slice(i2, j)),
                  j < len && matcherFromTokens(tokens = tokens.slice(j)),
                  j < len && toSelector(tokens)
                );
              }
              matchers.push(matcher);
            }
          }
          return elementMatcher(matchers);
        }
        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
          var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
            var elem, j, matcher, matchedCount = 0, i2 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
            if (outermost) {
              outermostContext = context == document3 || context || outermost;
            }
            for (; i2 !== len && (elem = elems[i2]) != null; i2++) {
              if (byElement && elem) {
                j = 0;
                if (!context && elem.ownerDocument != document3) {
                  setDocument(elem);
                  xml = !documentIsHTML;
                }
                while (matcher = elementMatchers[j++]) {
                  if (matcher(elem, context || document3, xml)) {
                    push2.call(results, elem);
                    break;
                  }
                }
                if (outermost) {
                  dirruns = dirrunsUnique;
                }
              }
              if (bySet) {
                if (elem = !matcher && elem) {
                  matchedCount--;
                }
                if (seed) {
                  unmatched.push(elem);
                }
              }
            }
            matchedCount += i2;
            if (bySet && i2 !== matchedCount) {
              j = 0;
              while (matcher = setMatchers[j++]) {
                matcher(unmatched, setMatched, context, xml);
              }
              if (seed) {
                if (matchedCount > 0) {
                  while (i2--) {
                    if (!(unmatched[i2] || setMatched[i2])) {
                      setMatched[i2] = pop.call(results);
                    }
                  }
                }
                setMatched = condense(setMatched);
              }
              push2.apply(results, setMatched);
              if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                jQuery.uniqueSort(results);
              }
            }
            if (outermost) {
              dirruns = dirrunsUnique;
              outermostContext = contextBackup;
            }
            return unmatched;
          };
          return bySet ? markFunction(superMatcher) : superMatcher;
        }
        function compile(selector, match) {
          var i2, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
          if (!cached) {
            if (!match) {
              match = tokenize(selector);
            }
            i2 = match.length;
            while (i2--) {
              cached = matcherFromTokens(match[i2]);
              if (cached[expando]) {
                setMatchers.push(cached);
              } else {
                elementMatchers.push(cached);
              }
            }
            cached = compilerCache(
              selector,
              matcherFromGroupMatchers(elementMatchers, setMatchers)
            );
            cached.selector = selector;
          }
          return cached;
        }
        function select(selector, context, results, seed) {
          var i2, tokens, token, type, find2, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
          results = results || [];
          if (match.length === 1) {
            tokens = match[0] = match[0].slice(0);
            if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
              context = (Expr.find.ID(
                token.matches[0].replace(runescape, funescape),
                context
              ) || [])[0];
              if (!context) {
                return results;
              } else if (compiled) {
                context = context.parentNode;
              }
              selector = selector.slice(tokens.shift().value.length);
            }
            i2 = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
            while (i2--) {
              token = tokens[i2];
              if (Expr.relative[type = token.type]) {
                break;
              }
              if (find2 = Expr.find[type]) {
                if (seed = find2(
                  token.matches[0].replace(runescape, funescape),
                  rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                )) {
                  tokens.splice(i2, 1);
                  selector = seed.length && toSelector(tokens);
                  if (!selector) {
                    push2.apply(results, seed);
                    return results;
                  }
                  break;
                }
              }
            }
          }
          (compiled || compile(selector, match))(
            seed,
            context,
            !documentIsHTML,
            results,
            !context || rsibling.test(selector) && testContext(context.parentNode) || context
          );
          return results;
        }
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
        setDocument();
        support.sortDetached = assert(function(el) {
          return el.compareDocumentPosition(document3.createElement("fieldset")) & 1;
        });
        jQuery.find = find;
        jQuery.expr[":"] = jQuery.expr.pseudos;
        jQuery.unique = jQuery.uniqueSort;
        find.compile = compile;
        find.select = select;
        find.setDocument = setDocument;
        find.tokenize = tokenize;
        find.escape = jQuery.escapeSelector;
        find.getText = jQuery.text;
        find.isXML = jQuery.isXMLDoc;
        find.selectors = jQuery.expr;
        find.support = jQuery.support;
        find.uniqueSort = jQuery.uniqueSort;
      })();
      var dir = function(elem, dir2, until) {
        var matched = [], truncate = until !== void 0;
        while ((elem = elem[dir2]) && elem.nodeType !== 9) {
          if (elem.nodeType === 1) {
            if (truncate && jQuery(elem).is(until)) {
              break;
            }
            matched.push(elem);
          }
        }
        return matched;
      };
      var siblings = function(n, elem) {
        var matched = [];
        for (; n; n = n.nextSibling) {
          if (n.nodeType === 1 && n !== elem) {
            matched.push(n);
          }
        }
        return matched;
      };
      var rneedsContext = jQuery.expr.match.needsContext;
      var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
      function winnow(elements, qualifier, not) {
        if (isFunction(qualifier)) {
          return jQuery.grep(elements, function(elem, i) {
            return !!qualifier.call(elem, i, elem) !== not;
          });
        }
        if (qualifier.nodeType) {
          return jQuery.grep(elements, function(elem) {
            return elem === qualifier !== not;
          });
        }
        if (typeof qualifier !== "string") {
          return jQuery.grep(elements, function(elem) {
            return indexOf.call(qualifier, elem) > -1 !== not;
          });
        }
        return jQuery.filter(qualifier, elements, not);
      }
      jQuery.filter = function(expr, elems, not) {
        var elem = elems[0];
        if (not) {
          expr = ":not(" + expr + ")";
        }
        if (elems.length === 1 && elem.nodeType === 1) {
          return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
        }
        return jQuery.find.matches(expr, jQuery.grep(elems, function(elem2) {
          return elem2.nodeType === 1;
        }));
      };
      jQuery.fn.extend({
        find: function(selector) {
          var i, ret, len = this.length, self2 = this;
          if (typeof selector !== "string") {
            return this.pushStack(jQuery(selector).filter(function() {
              for (i = 0; i < len; i++) {
                if (jQuery.contains(self2[i], this)) {
                  return true;
                }
              }
            }));
          }
          ret = this.pushStack([]);
          for (i = 0; i < len; i++) {
            jQuery.find(selector, self2[i], ret);
          }
          return len > 1 ? jQuery.uniqueSort(ret) : ret;
        },
        filter: function(selector) {
          return this.pushStack(winnow(this, selector || [], false));
        },
        not: function(selector) {
          return this.pushStack(winnow(this, selector || [], true));
        },
        is: function(selector) {
          return !!winnow(
            this,
            // If this is a positional/relative selector, check membership in the returned set
            // so $("p:first").is("p:last") won't return true for a doc with two "p".
            typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [],
            false
          ).length;
        }
      });
      var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init = jQuery.fn.init = function(selector, context, root) {
        var match, elem;
        if (!selector) {
          return this;
        }
        root = root || rootjQuery;
        if (typeof selector === "string") {
          if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
            match = [null, selector, null];
          } else {
            match = rquickExpr.exec(selector);
          }
          if (match && (match[1] || !context)) {
            if (match[1]) {
              context = context instanceof jQuery ? context[0] : context;
              jQuery.merge(this, jQuery.parseHTML(
                match[1],
                context && context.nodeType ? context.ownerDocument || context : document2,
                true
              ));
              if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                for (match in context) {
                  if (isFunction(this[match])) {
                    this[match](context[match]);
                  } else {
                    this.attr(match, context[match]);
                  }
                }
              }
              return this;
            } else {
              elem = document2.getElementById(match[2]);
              if (elem) {
                this[0] = elem;
                this.length = 1;
              }
              return this;
            }
          } else if (!context || context.jquery) {
            return (context || root).find(selector);
          } else {
            return this.constructor(context).find(selector);
          }
        } else if (selector.nodeType) {
          this[0] = selector;
          this.length = 1;
          return this;
        } else if (isFunction(selector)) {
          return root.ready !== void 0 ? root.ready(selector) : (
            // Execute immediately if ready is not present
            selector(jQuery)
          );
        }
        return jQuery.makeArray(selector, this);
      };
      init.prototype = jQuery.fn;
      rootjQuery = jQuery(document2);
      var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
      };
      jQuery.fn.extend({
        has: function(target) {
          var targets = jQuery(target, this), l = targets.length;
          return this.filter(function() {
            var i = 0;
            for (; i < l; i++) {
              if (jQuery.contains(this, targets[i])) {
                return true;
              }
            }
          });
        },
        closest: function(selectors, context) {
          var cur, i = 0, l = this.length, matched = [], targets = typeof selectors !== "string" && jQuery(selectors);
          if (!rneedsContext.test(selectors)) {
            for (; i < l; i++) {
              for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : (
                  // Don't pass non-elements to jQuery#find
                  cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors)
                ))) {
                  matched.push(cur);
                  break;
                }
              }
            }
          }
          return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
        },
        // Determine the position of an element within the set
        index: function(elem) {
          if (!elem) {
            return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
          }
          if (typeof elem === "string") {
            return indexOf.call(jQuery(elem), this[0]);
          }
          return indexOf.call(
            this,
            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem
          );
        },
        add: function(selector, context) {
          return this.pushStack(
            jQuery.uniqueSort(
              jQuery.merge(this.get(), jQuery(selector, context))
            )
          );
        },
        addBack: function(selector) {
          return this.add(
            selector == null ? this.prevObject : this.prevObject.filter(selector)
          );
        }
      });
      function sibling(cur, dir2) {
        while ((cur = cur[dir2]) && cur.nodeType !== 1) {
        }
        return cur;
      }
      jQuery.each({
        parent: function(elem) {
          var parent = elem.parentNode;
          return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function(elem) {
          return dir(elem, "parentNode");
        },
        parentsUntil: function(elem, _i, until) {
          return dir(elem, "parentNode", until);
        },
        next: function(elem) {
          return sibling(elem, "nextSibling");
        },
        prev: function(elem) {
          return sibling(elem, "previousSibling");
        },
        nextAll: function(elem) {
          return dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
          return dir(elem, "previousSibling");
        },
        nextUntil: function(elem, _i, until) {
          return dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, _i, until) {
          return dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
          return siblings((elem.parentNode || {}).firstChild, elem);
        },
        children: function(elem) {
          return siblings(elem.firstChild);
        },
        contents: function(elem) {
          if (elem.contentDocument != null && // Support: IE 11+
          // <object> elements with no `data` attribute has an object
          // `contentDocument` with a `null` prototype.
          getProto(elem.contentDocument)) {
            return elem.contentDocument;
          }
          if (nodeName(elem, "template")) {
            elem = elem.content || elem;
          }
          return jQuery.merge([], elem.childNodes);
        }
      }, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
          var matched = jQuery.map(this, fn, until);
          if (name.slice(-5) !== "Until") {
            selector = until;
          }
          if (selector && typeof selector === "string") {
            matched = jQuery.filter(selector, matched);
          }
          if (this.length > 1) {
            if (!guaranteedUnique[name]) {
              jQuery.uniqueSort(matched);
            }
            if (rparentsprev.test(name)) {
              matched.reverse();
            }
          }
          return this.pushStack(matched);
        };
      });
      var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
      function createOptions(options) {
        var object = {};
        jQuery.each(options.match(rnothtmlwhite) || [], function(_, flag) {
          object[flag] = true;
        });
        return object;
      }
      jQuery.Callbacks = function(options) {
        options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);
        var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
          locked = locked || options.once;
          fired = firing = true;
          for (; queue.length; firingIndex = -1) {
            memory = queue.shift();
            while (++firingIndex < list.length) {
              if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                firingIndex = list.length;
                memory = false;
              }
            }
          }
          if (!options.memory) {
            memory = false;
          }
          firing = false;
          if (locked) {
            if (memory) {
              list = [];
            } else {
              list = "";
            }
          }
        }, self2 = {
          // Add a callback or a collection of callbacks to the list
          add: function() {
            if (list) {
              if (memory && !firing) {
                firingIndex = list.length - 1;
                queue.push(memory);
              }
              (function add(args) {
                jQuery.each(args, function(_, arg) {
                  if (isFunction(arg)) {
                    if (!options.unique || !self2.has(arg)) {
                      list.push(arg);
                    }
                  } else if (arg && arg.length && toType(arg) !== "string") {
                    add(arg);
                  }
                });
              })(arguments);
              if (memory && !firing) {
                fire();
              }
            }
            return this;
          },
          // Remove a callback from the list
          remove: function() {
            jQuery.each(arguments, function(_, arg) {
              var index;
              while ((index = jQuery.inArray(arg, list, index)) > -1) {
                list.splice(index, 1);
                if (index <= firingIndex) {
                  firingIndex--;
                }
              }
            });
            return this;
          },
          // Check if a given callback is in the list.
          // If no argument is given, return whether or not list has callbacks attached.
          has: function(fn) {
            return fn ? jQuery.inArray(fn, list) > -1 : list.length > 0;
          },
          // Remove all callbacks from the list
          empty: function() {
            if (list) {
              list = [];
            }
            return this;
          },
          // Disable .fire and .add
          // Abort any current/pending executions
          // Clear all callbacks and values
          disable: function() {
            locked = queue = [];
            list = memory = "";
            return this;
          },
          disabled: function() {
            return !list;
          },
          // Disable .fire
          // Also disable .add unless we have memory (since it would have no effect)
          // Abort any pending executions
          lock: function() {
            locked = queue = [];
            if (!memory && !firing) {
              list = memory = "";
            }
            return this;
          },
          locked: function() {
            return !!locked;
          },
          // Call all callbacks with the given context and arguments
          fireWith: function(context, args) {
            if (!locked) {
              args = args || [];
              args = [context, args.slice ? args.slice() : args];
              queue.push(args);
              if (!firing) {
                fire();
              }
            }
            return this;
          },
          // Call all the callbacks with the given arguments
          fire: function() {
            self2.fireWith(this, arguments);
            return this;
          },
          // To know if the callbacks have already been called at least once
          fired: function() {
            return !!fired;
          }
        };
        return self2;
      };
      function Identity(v) {
        return v;
      }
      function Thrower(ex) {
        throw ex;
      }
      function adoptValue(value, resolve, reject, noValue) {
        var method;
        try {
          if (value && isFunction(method = value.promise)) {
            method.call(value).done(resolve).fail(reject);
          } else if (value && isFunction(method = value.then)) {
            method.call(value, resolve, reject);
          } else {
            resolve.apply(void 0, [value].slice(noValue));
          }
        } catch (value2) {
          reject.apply(void 0, [value2]);
        }
      }
      jQuery.extend({
        Deferred: function(func) {
          var tuples = [
            // action, add listener, callbacks,
            // ... .then handlers, argument index, [final state]
            [
              "notify",
              "progress",
              jQuery.Callbacks("memory"),
              jQuery.Callbacks("memory"),
              2
            ],
            [
              "resolve",
              "done",
              jQuery.Callbacks("once memory"),
              jQuery.Callbacks("once memory"),
              0,
              "resolved"
            ],
            [
              "reject",
              "fail",
              jQuery.Callbacks("once memory"),
              jQuery.Callbacks("once memory"),
              1,
              "rejected"
            ]
          ], state = "pending", promise = {
            state: function() {
              return state;
            },
            always: function() {
              deferred.done(arguments).fail(arguments);
              return this;
            },
            "catch": function(fn) {
              return promise.then(null, fn);
            },
            // Keep pipe for back-compat
            pipe: function() {
              var fns = arguments;
              return jQuery.Deferred(function(newDefer) {
                jQuery.each(tuples, function(_i, tuple) {
                  var fn = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                  deferred[tuple[1]](function() {
                    var returned = fn && fn.apply(this, arguments);
                    if (returned && isFunction(returned.promise)) {
                      returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                    } else {
                      newDefer[tuple[0] + "With"](
                        this,
                        fn ? [returned] : arguments
                      );
                    }
                  });
                });
                fns = null;
              }).promise();
            },
            then: function(onFulfilled, onRejected, onProgress) {
              var maxDepth = 0;
              function resolve(depth, deferred2, handler, special) {
                return function() {
                  var that = this, args = arguments, mightThrow = function() {
                    var returned, then;
                    if (depth < maxDepth) {
                      return;
                    }
                    returned = handler.apply(that, args);
                    if (returned === deferred2.promise()) {
                      throw new TypeError("Thenable self-resolution");
                    }
                    then = returned && // Support: Promises/A+ section 2.3.4
                    // https://promisesaplus.com/#point-64
                    // Only check objects and functions for thenability
                    (typeof returned === "object" || typeof returned === "function") && returned.then;
                    if (isFunction(then)) {
                      if (special) {
                        then.call(
                          returned,
                          resolve(maxDepth, deferred2, Identity, special),
                          resolve(maxDepth, deferred2, Thrower, special)
                        );
                      } else {
                        maxDepth++;
                        then.call(
                          returned,
                          resolve(maxDepth, deferred2, Identity, special),
                          resolve(maxDepth, deferred2, Thrower, special),
                          resolve(
                            maxDepth,
                            deferred2,
                            Identity,
                            deferred2.notifyWith
                          )
                        );
                      }
                    } else {
                      if (handler !== Identity) {
                        that = void 0;
                        args = [returned];
                      }
                      (special || deferred2.resolveWith)(that, args);
                    }
                  }, process = special ? mightThrow : function() {
                    try {
                      mightThrow();
                    } catch (e) {
                      if (jQuery.Deferred.exceptionHook) {
                        jQuery.Deferred.exceptionHook(
                          e,
                          process.error
                        );
                      }
                      if (depth + 1 >= maxDepth) {
                        if (handler !== Thrower) {
                          that = void 0;
                          args = [e];
                        }
                        deferred2.rejectWith(that, args);
                      }
                    }
                  };
                  if (depth) {
                    process();
                  } else {
                    if (jQuery.Deferred.getErrorHook) {
                      process.error = jQuery.Deferred.getErrorHook();
                    } else if (jQuery.Deferred.getStackHook) {
                      process.error = jQuery.Deferred.getStackHook();
                    }
                    window2.setTimeout(process);
                  }
                };
              }
              return jQuery.Deferred(function(newDefer) {
                tuples[0][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onProgress) ? onProgress : Identity,
                    newDefer.notifyWith
                  )
                );
                tuples[1][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onFulfilled) ? onFulfilled : Identity
                  )
                );
                tuples[2][3].add(
                  resolve(
                    0,
                    newDefer,
                    isFunction(onRejected) ? onRejected : Thrower
                  )
                );
              }).promise();
            },
            // Get a promise for this deferred
            // If obj is provided, the promise aspect is added to the object
            promise: function(obj) {
              return obj != null ? jQuery.extend(obj, promise) : promise;
            }
          }, deferred = {};
          jQuery.each(tuples, function(i, tuple) {
            var list = tuple[2], stateString = tuple[5];
            promise[tuple[1]] = list.add;
            if (stateString) {
              list.add(
                function() {
                  state = stateString;
                },
                // rejected_callbacks.disable
                // fulfilled_callbacks.disable
                tuples[3 - i][2].disable,
                // rejected_handlers.disable
                // fulfilled_handlers.disable
                tuples[3 - i][3].disable,
                // progress_callbacks.lock
                tuples[0][2].lock,
                // progress_handlers.lock
                tuples[0][3].lock
              );
            }
            list.add(tuple[3].fire);
            deferred[tuple[0]] = function() {
              deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
              return this;
            };
            deferred[tuple[0] + "With"] = list.fireWith;
          });
          promise.promise(deferred);
          if (func) {
            func.call(deferred, deferred);
          }
          return deferred;
        },
        // Deferred helper
        when: function(singleValue) {
          var remaining = arguments.length, i = remaining, resolveContexts = Array(i), resolveValues = slice.call(arguments), primary = jQuery.Deferred(), updateFunc = function(i2) {
            return function(value) {
              resolveContexts[i2] = this;
              resolveValues[i2] = arguments.length > 1 ? slice.call(arguments) : value;
              if (!--remaining) {
                primary.resolveWith(resolveContexts, resolveValues);
              }
            };
          };
          if (remaining <= 1) {
            adoptValue(
              singleValue,
              primary.done(updateFunc(i)).resolve,
              primary.reject,
              !remaining
            );
            if (primary.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)) {
              return primary.then();
            }
          }
          while (i--) {
            adoptValue(resolveValues[i], updateFunc(i), primary.reject);
          }
          return primary.promise();
        }
      });
      var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
      jQuery.Deferred.exceptionHook = function(error, asyncError) {
        if (window2.console && window2.console.warn && error && rerrorNames.test(error.name)) {
          window2.console.warn(
            "jQuery.Deferred exception: " + error.message,
            error.stack,
            asyncError
          );
        }
      };
      jQuery.readyException = function(error) {
        window2.setTimeout(function() {
          throw error;
        });
      };
      var readyList = jQuery.Deferred();
      jQuery.fn.ready = function(fn) {
        readyList.then(fn).catch(function(error) {
          jQuery.readyException(error);
        });
        return this;
      };
      jQuery.extend({
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,
        // A counter to track how many items to wait for before
        // the ready event fires. See trac-6781
        readyWait: 1,
        // Handle when the DOM is ready
        ready: function(wait) {
          if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
            return;
          }
          jQuery.isReady = true;
          if (wait !== true && --jQuery.readyWait > 0) {
            return;
          }
          readyList.resolveWith(document2, [jQuery]);
        }
      });
      jQuery.ready.then = readyList.then;
      function completed() {
        document2.removeEventListener("DOMContentLoaded", completed);
        window2.removeEventListener("load", completed);
        jQuery.ready();
      }
      if (document2.readyState === "complete" || document2.readyState !== "loading" && !document2.documentElement.doScroll) {
        window2.setTimeout(jQuery.ready);
      } else {
        document2.addEventListener("DOMContentLoaded", completed);
        window2.addEventListener("load", completed);
      }
      var access = function(elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0, len = elems.length, bulk = key == null;
        if (toType(key) === "object") {
          chainable = true;
          for (i in key) {
            access(elems, fn, i, key[i], true, emptyGet, raw);
          }
        } else if (value !== void 0) {
          chainable = true;
          if (!isFunction(value)) {
            raw = true;
          }
          if (bulk) {
            if (raw) {
              fn.call(elems, value);
              fn = null;
            } else {
              bulk = fn;
              fn = function(elem, _key, value2) {
                return bulk.call(jQuery(elem), value2);
              };
            }
          }
          if (fn) {
            for (; i < len; i++) {
              fn(
                elems[i],
                key,
                raw ? value : value.call(elems[i], i, fn(elems[i], key))
              );
            }
          }
        }
        if (chainable) {
          return elems;
        }
        if (bulk) {
          return fn.call(elems);
        }
        return len ? fn(elems[0], key) : emptyGet;
      };
      var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
      function fcamelCase(_all, letter) {
        return letter.toUpperCase();
      }
      function camelCase(string) {
        return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
      }
      var acceptData = function(owner) {
        return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
      };
      function Data() {
        this.expando = jQuery.expando + Data.uid++;
      }
      Data.uid = 1;
      Data.prototype = {
        cache: function(owner) {
          var value = owner[this.expando];
          if (!value) {
            value = {};
            if (acceptData(owner)) {
              if (owner.nodeType) {
                owner[this.expando] = value;
              } else {
                Object.defineProperty(owner, this.expando, {
                  value,
                  configurable: true
                });
              }
            }
          }
          return value;
        },
        set: function(owner, data, value) {
          var prop, cache = this.cache(owner);
          if (typeof data === "string") {
            cache[camelCase(data)] = value;
          } else {
            for (prop in data) {
              cache[camelCase(prop)] = data[prop];
            }
          }
          return cache;
        },
        get: function(owner, key) {
          return key === void 0 ? this.cache(owner) : (
            // Always use camelCase key (gh-2257)
            owner[this.expando] && owner[this.expando][camelCase(key)]
          );
        },
        access: function(owner, key, value) {
          if (key === void 0 || key && typeof key === "string" && value === void 0) {
            return this.get(owner, key);
          }
          this.set(owner, key, value);
          return value !== void 0 ? value : key;
        },
        remove: function(owner, key) {
          var i, cache = owner[this.expando];
          if (cache === void 0) {
            return;
          }
          if (key !== void 0) {
            if (Array.isArray(key)) {
              key = key.map(camelCase);
            } else {
              key = camelCase(key);
              key = key in cache ? [key] : key.match(rnothtmlwhite) || [];
            }
            i = key.length;
            while (i--) {
              delete cache[key[i]];
            }
          }
          if (key === void 0 || jQuery.isEmptyObject(cache)) {
            if (owner.nodeType) {
              owner[this.expando] = void 0;
            } else {
              delete owner[this.expando];
            }
          }
        },
        hasData: function(owner) {
          var cache = owner[this.expando];
          return cache !== void 0 && !jQuery.isEmptyObject(cache);
        }
      };
      var dataPriv = new Data();
      var dataUser = new Data();
      var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
      function getData(data) {
        if (data === "true") {
          return true;
        }
        if (data === "false") {
          return false;
        }
        if (data === "null") {
          return null;
        }
        if (data === +data + "") {
          return +data;
        }
        if (rbrace.test(data)) {
          return JSON.parse(data);
        }
        return data;
      }
      function dataAttr(elem, key, data) {
        var name;
        if (data === void 0 && elem.nodeType === 1) {
          name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
          data = elem.getAttribute(name);
          if (typeof data === "string") {
            try {
              data = getData(data);
            } catch (e) {
            }
            dataUser.set(elem, key, data);
          } else {
            data = void 0;
          }
        }
        return data;
      }
      jQuery.extend({
        hasData: function(elem) {
          return dataUser.hasData(elem) || dataPriv.hasData(elem);
        },
        data: function(elem, name, data) {
          return dataUser.access(elem, name, data);
        },
        removeData: function(elem, name) {
          dataUser.remove(elem, name);
        },
        // TODO: Now that all calls to _data and _removeData have been replaced
        // with direct calls to dataPriv methods, these can be deprecated.
        _data: function(elem, name, data) {
          return dataPriv.access(elem, name, data);
        },
        _removeData: function(elem, name) {
          dataPriv.remove(elem, name);
        }
      });
      jQuery.fn.extend({
        data: function(key, value) {
          var i, name, data, elem = this[0], attrs = elem && elem.attributes;
          if (key === void 0) {
            if (this.length) {
              data = dataUser.get(elem);
              if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                i = attrs.length;
                while (i--) {
                  if (attrs[i]) {
                    name = attrs[i].name;
                    if (name.indexOf("data-") === 0) {
                      name = camelCase(name.slice(5));
                      dataAttr(elem, name, data[name]);
                    }
                  }
                }
                dataPriv.set(elem, "hasDataAttrs", true);
              }
            }
            return data;
          }
          if (typeof key === "object") {
            return this.each(function() {
              dataUser.set(this, key);
            });
          }
          return access(this, function(value2) {
            var data2;
            if (elem && value2 === void 0) {
              data2 = dataUser.get(elem, key);
              if (data2 !== void 0) {
                return data2;
              }
              data2 = dataAttr(elem, key);
              if (data2 !== void 0) {
                return data2;
              }
              return;
            }
            this.each(function() {
              dataUser.set(this, key, value2);
            });
          }, null, value, arguments.length > 1, null, true);
        },
        removeData: function(key) {
          return this.each(function() {
            dataUser.remove(this, key);
          });
        }
      });
      jQuery.extend({
        queue: function(elem, type, data) {
          var queue;
          if (elem) {
            type = (type || "fx") + "queue";
            queue = dataPriv.get(elem, type);
            if (data) {
              if (!queue || Array.isArray(data)) {
                queue = dataPriv.access(elem, type, jQuery.makeArray(data));
              } else {
                queue.push(data);
              }
            }
            return queue || [];
          }
        },
        dequeue: function(elem, type) {
          type = type || "fx";
          var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
            jQuery.dequeue(elem, type);
          };
          if (fn === "inprogress") {
            fn = queue.shift();
            startLength--;
          }
          if (fn) {
            if (type === "fx") {
              queue.unshift("inprogress");
            }
            delete hooks.stop;
            fn.call(elem, next, hooks);
          }
          if (!startLength && hooks) {
            hooks.empty.fire();
          }
        },
        // Not public - generate a queueHooks object, or return the current one
        _queueHooks: function(elem, type) {
          var key = type + "queueHooks";
          return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
            empty: jQuery.Callbacks("once memory").add(function() {
              dataPriv.remove(elem, [type + "queue", key]);
            })
          });
        }
      });
      jQuery.fn.extend({
        queue: function(type, data) {
          var setter = 2;
          if (typeof type !== "string") {
            data = type;
            type = "fx";
            setter--;
          }
          if (arguments.length < setter) {
            return jQuery.queue(this[0], type);
          }
          return data === void 0 ? this : this.each(function() {
            var queue = jQuery.queue(this, type, data);
            jQuery._queueHooks(this, type);
            if (type === "fx" && queue[0] !== "inprogress") {
              jQuery.dequeue(this, type);
            }
          });
        },
        dequeue: function(type) {
          return this.each(function() {
            jQuery.dequeue(this, type);
          });
        },
        clearQueue: function(type) {
          return this.queue(type || "fx", []);
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function(type, obj) {
          var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
            if (!--count) {
              defer.resolveWith(elements, [elements]);
            }
          };
          if (typeof type !== "string") {
            obj = type;
            type = void 0;
          }
          type = type || "fx";
          while (i--) {
            tmp = dataPriv.get(elements[i], type + "queueHooks");
            if (tmp && tmp.empty) {
              count++;
              tmp.empty.add(resolve);
            }
          }
          resolve();
          return defer.promise(obj);
        }
      });
      var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
      var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
      var cssExpand = ["Top", "Right", "Bottom", "Left"];
      var documentElement = document2.documentElement;
      var isAttached = function(elem) {
        return jQuery.contains(elem.ownerDocument, elem);
      }, composed = { composed: true };
      if (documentElement.getRootNode) {
        isAttached = function(elem) {
          return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
        };
      }
      var isHiddenWithinTree = function(elem, el) {
        elem = el || elem;
        return elem.style.display === "none" || elem.style.display === "" && // Otherwise, check computed style
        // Support: Firefox <=43 - 45
        // Disconnected elements can have computed display: none, so first confirm that elem is
        // in the document.
        isAttached(elem) && jQuery.css(elem, "display") === "none";
      };
      function adjustCSS(elem, prop, valueParts, tween) {
        var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
          return tween.cur();
        } : function() {
          return jQuery.css(elem, prop, "");
        }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));
        if (initialInUnit && initialInUnit[3] !== unit) {
          initial = initial / 2;
          unit = unit || initialInUnit[3];
          initialInUnit = +initial || 1;
          while (maxIterations--) {
            jQuery.style(elem, prop, initialInUnit + unit);
            if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
              maxIterations = 0;
            }
            initialInUnit = initialInUnit / scale;
          }
          initialInUnit = initialInUnit * 2;
          jQuery.style(elem, prop, initialInUnit + unit);
          valueParts = valueParts || [];
        }
        if (valueParts) {
          initialInUnit = +initialInUnit || +initial || 0;
          adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
          if (tween) {
            tween.unit = unit;
            tween.start = initialInUnit;
            tween.end = adjusted;
          }
        }
        return adjusted;
      }
      var defaultDisplayMap = {};
      function getDefaultDisplay(elem) {
        var temp, doc = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
        if (display) {
          return display;
        }
        temp = doc.body.appendChild(doc.createElement(nodeName2));
        display = jQuery.css(temp, "display");
        temp.parentNode.removeChild(temp);
        if (display === "none") {
          display = "block";
        }
        defaultDisplayMap[nodeName2] = display;
        return display;
      }
      function showHide(elements, show) {
        var display, elem, values = [], index = 0, length = elements.length;
        for (; index < length; index++) {
          elem = elements[index];
          if (!elem.style) {
            continue;
          }
          display = elem.style.display;
          if (show) {
            if (display === "none") {
              values[index] = dataPriv.get(elem, "display") || null;
              if (!values[index]) {
                elem.style.display = "";
              }
            }
            if (elem.style.display === "" && isHiddenWithinTree(elem)) {
              values[index] = getDefaultDisplay(elem);
            }
          } else {
            if (display !== "none") {
              values[index] = "none";
              dataPriv.set(elem, "display", display);
            }
          }
        }
        for (index = 0; index < length; index++) {
          if (values[index] != null) {
            elements[index].style.display = values[index];
          }
        }
        return elements;
      }
      jQuery.fn.extend({
        show: function() {
          return showHide(this, true);
        },
        hide: function() {
          return showHide(this);
        },
        toggle: function(state) {
          if (typeof state === "boolean") {
            return state ? this.show() : this.hide();
          }
          return this.each(function() {
            if (isHiddenWithinTree(this)) {
              jQuery(this).show();
            } else {
              jQuery(this).hide();
            }
          });
        }
      });
      var rcheckableType = /^(?:checkbox|radio)$/i;
      var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
      var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
      (function() {
        var fragment = document2.createDocumentFragment(), div = fragment.appendChild(document2.createElement("div")), input = document2.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("checked", "checked");
        input.setAttribute("name", "t");
        div.appendChild(input);
        support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
        div.innerHTML = "<textarea>x</textarea>";
        support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
        div.innerHTML = "<option></option>";
        support.option = !!div.lastChild;
      })();
      var wrapMap = {
        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
      };
      wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
      wrapMap.th = wrapMap.td;
      if (!support.option) {
        wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
      }
      function getAll(context, tag) {
        var ret;
        if (typeof context.getElementsByTagName !== "undefined") {
          ret = context.getElementsByTagName(tag || "*");
        } else if (typeof context.querySelectorAll !== "undefined") {
          ret = context.querySelectorAll(tag || "*");
        } else {
          ret = [];
        }
        if (tag === void 0 || tag && nodeName(context, tag)) {
          return jQuery.merge([context], ret);
        }
        return ret;
      }
      function setGlobalEval(elems, refElements) {
        var i = 0, l = elems.length;
        for (; i < l; i++) {
          dataPriv.set(
            elems[i],
            "globalEval",
            !refElements || dataPriv.get(refElements[i], "globalEval")
          );
        }
      }
      var rhtml = /<|&#?\w+;/;
      function buildFragment(elems, context, scripts, selection, ignored) {
        var elem, tmp, tag, wrap, attached, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length;
        for (; i < l; i++) {
          elem = elems[i];
          if (elem || elem === 0) {
            if (toType(elem) === "object") {
              jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
            } else if (!rhtml.test(elem)) {
              nodes.push(context.createTextNode(elem));
            } else {
              tmp = tmp || fragment.appendChild(context.createElement("div"));
              tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
              wrap = wrapMap[tag] || wrapMap._default;
              tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
              j = wrap[0];
              while (j--) {
                tmp = tmp.lastChild;
              }
              jQuery.merge(nodes, tmp.childNodes);
              tmp = fragment.firstChild;
              tmp.textContent = "";
            }
          }
        }
        fragment.textContent = "";
        i = 0;
        while (elem = nodes[i++]) {
          if (selection && jQuery.inArray(elem, selection) > -1) {
            if (ignored) {
              ignored.push(elem);
            }
            continue;
          }
          attached = isAttached(elem);
          tmp = getAll(fragment.appendChild(elem), "script");
          if (attached) {
            setGlobalEval(tmp);
          }
          if (scripts) {
            j = 0;
            while (elem = tmp[j++]) {
              if (rscriptType.test(elem.type || "")) {
                scripts.push(elem);
              }
            }
          }
        }
        return fragment;
      }
      var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
      function returnTrue() {
        return true;
      }
      function returnFalse() {
        return false;
      }
      function on(elem, types, selector, data, fn, one) {
        var origFn, type;
        if (typeof types === "object") {
          if (typeof selector !== "string") {
            data = data || selector;
            selector = void 0;
          }
          for (type in types) {
            on(elem, type, selector, data, types[type], one);
          }
          return elem;
        }
        if (data == null && fn == null) {
          fn = selector;
          data = selector = void 0;
        } else if (fn == null) {
          if (typeof selector === "string") {
            fn = data;
            data = void 0;
          } else {
            fn = data;
            data = selector;
            selector = void 0;
          }
        }
        if (fn === false) {
          fn = returnFalse;
        } else if (!fn) {
          return elem;
        }
        if (one === 1) {
          origFn = fn;
          fn = function(event) {
            jQuery().off(event);
            return origFn.apply(this, arguments);
          };
          fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
        }
        return elem.each(function() {
          jQuery.event.add(this, types, fn, data, selector);
        });
      }
      jQuery.event = {
        global: {},
        add: function(elem, types, handler, data, selector) {
          var handleObjIn, eventHandle, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
          if (!acceptData(elem)) {
            return;
          }
          if (handler.handler) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
            selector = handleObjIn.selector;
          }
          if (selector) {
            jQuery.find.matchesSelector(documentElement, selector);
          }
          if (!handler.guid) {
            handler.guid = jQuery.guid++;
          }
          if (!(events = elemData.events)) {
            events = elemData.events = /* @__PURE__ */ Object.create(null);
          }
          if (!(eventHandle = elemData.handle)) {
            eventHandle = elemData.handle = function(e) {
              return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
            };
          }
          types = (types || "").match(rnothtmlwhite) || [""];
          t = types.length;
          while (t--) {
            tmp = rtypenamespace.exec(types[t]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();
            if (!type) {
              continue;
            }
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            special = jQuery.event.special[type] || {};
            handleObj = jQuery.extend({
              type,
              origType,
              data,
              handler,
              guid: handler.guid,
              selector,
              needsContext: selector && jQuery.expr.match.needsContext.test(selector),
              namespace: namespaces.join(".")
            }, handleObjIn);
            if (!(handlers = events[type])) {
              handlers = events[type] = [];
              handlers.delegateCount = 0;
              if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                if (elem.addEventListener) {
                  elem.addEventListener(type, eventHandle);
                }
              }
            }
            if (special.add) {
              special.add.call(elem, handleObj);
              if (!handleObj.handler.guid) {
                handleObj.handler.guid = handler.guid;
              }
            }
            if (selector) {
              handlers.splice(handlers.delegateCount++, 0, handleObj);
            } else {
              handlers.push(handleObj);
            }
            jQuery.event.global[type] = true;
          }
        },
        // Detach an event or set of events from an element
        remove: function(elem, types, handler, selector, mappedTypes) {
          var j, origCount, tmp, events, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
          if (!elemData || !(events = elemData.events)) {
            return;
          }
          types = (types || "").match(rnothtmlwhite) || [""];
          t = types.length;
          while (t--) {
            tmp = rtypenamespace.exec(types[t]) || [];
            type = origType = tmp[1];
            namespaces = (tmp[2] || "").split(".").sort();
            if (!type) {
              for (type in events) {
                jQuery.event.remove(elem, type + types[t], handler, selector, true);
              }
              continue;
            }
            special = jQuery.event.special[type] || {};
            type = (selector ? special.delegateType : special.bindType) || type;
            handlers = events[type] || [];
            tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
            origCount = j = handlers.length;
            while (j--) {
              handleObj = handlers[j];
              if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                handlers.splice(j, 1);
                if (handleObj.selector) {
                  handlers.delegateCount--;
                }
                if (special.remove) {
                  special.remove.call(elem, handleObj);
                }
              }
            }
            if (origCount && !handlers.length) {
              if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                jQuery.removeEvent(elem, type, elemData.handle);
              }
              delete events[type];
            }
          }
          if (jQuery.isEmptyObject(events)) {
            dataPriv.remove(elem, "handle events");
          }
        },
        dispatch: function(nativeEvent) {
          var i, j, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
          args[0] = event;
          for (i = 1; i < arguments.length; i++) {
            args[i] = arguments[i];
          }
          event.delegateTarget = this;
          if (special.preDispatch && special.preDispatch.call(this, event) === false) {
            return;
          }
          handlerQueue = jQuery.event.handlers.call(this, event, handlers);
          i = 0;
          while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
            event.currentTarget = matched.elem;
            j = 0;
            while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
              if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
                event.handleObj = handleObj;
                event.data = handleObj.data;
                ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                if (ret !== void 0) {
                  if ((event.result = ret) === false) {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                }
              }
            }
          }
          if (special.postDispatch) {
            special.postDispatch.call(this, event);
          }
          return event.result;
        },
        handlers: function(event, handlers) {
          var i, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
          if (delegateCount && // Support: IE <=9
          // Black-hole SVG <use> instance trees (trac-13180)
          cur.nodeType && // Support: Firefox <=42
          // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
          // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
          // Support: IE 11 only
          // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
          !(event.type === "click" && event.button >= 1)) {
            for (; cur !== this; cur = cur.parentNode || this) {
              if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                matchedHandlers = [];
                matchedSelectors = {};
                for (i = 0; i < delegateCount; i++) {
                  handleObj = handlers[i];
                  sel = handleObj.selector + " ";
                  if (matchedSelectors[sel] === void 0) {
                    matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
                  }
                  if (matchedSelectors[sel]) {
                    matchedHandlers.push(handleObj);
                  }
                }
                if (matchedHandlers.length) {
                  handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                }
              }
            }
          }
          cur = this;
          if (delegateCount < handlers.length) {
            handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
          }
          return handlerQueue;
        },
        addProp: function(name, hook) {
          Object.defineProperty(jQuery.Event.prototype, name, {
            enumerable: true,
            configurable: true,
            get: isFunction(hook) ? function() {
              if (this.originalEvent) {
                return hook(this.originalEvent);
              }
            } : function() {
              if (this.originalEvent) {
                return this.originalEvent[name];
              }
            },
            set: function(value) {
              Object.defineProperty(this, name, {
                enumerable: true,
                configurable: true,
                writable: true,
                value
              });
            }
          });
        },
        fix: function(originalEvent) {
          return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
        },
        special: {
          load: {
            // Prevent triggered image.load events from bubbling to window.load
            noBubble: true
          },
          click: {
            // Utilize native event to ensure correct state for checkable inputs
            setup: function(data) {
              var el = this || data;
              if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                leverageNative(el, "click", true);
              }
              return false;
            },
            trigger: function(data) {
              var el = this || data;
              if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                leverageNative(el, "click");
              }
              return true;
            },
            // For cross-browser consistency, suppress native .click() on links
            // Also prevent it if we're currently inside a leveraged native-event stack
            _default: function(event) {
              var target = event.target;
              return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
            }
          },
          beforeunload: {
            postDispatch: function(event) {
              if (event.result !== void 0 && event.originalEvent) {
                event.originalEvent.returnValue = event.result;
              }
            }
          }
        }
      };
      function leverageNative(el, type, isSetup) {
        if (!isSetup) {
          if (dataPriv.get(el, type) === void 0) {
            jQuery.event.add(el, type, returnTrue);
          }
          return;
        }
        dataPriv.set(el, type, false);
        jQuery.event.add(el, type, {
          namespace: false,
          handler: function(event) {
            var result, saved = dataPriv.get(this, type);
            if (event.isTrigger & 1 && this[type]) {
              if (!saved) {
                saved = slice.call(arguments);
                dataPriv.set(this, type, saved);
                this[type]();
                result = dataPriv.get(this, type);
                dataPriv.set(this, type, false);
                if (saved !== result) {
                  event.stopImmediatePropagation();
                  event.preventDefault();
                  return result;
                }
              } else if ((jQuery.event.special[type] || {}).delegateType) {
                event.stopPropagation();
              }
            } else if (saved) {
              dataPriv.set(this, type, jQuery.event.trigger(
                saved[0],
                saved.slice(1),
                this
              ));
              event.stopPropagation();
              event.isImmediatePropagationStopped = returnTrue;
            }
          }
        });
      }
      jQuery.removeEvent = function(elem, type, handle) {
        if (elem.removeEventListener) {
          elem.removeEventListener(type, handle);
        }
      };
      jQuery.Event = function(src, props) {
        if (!(this instanceof jQuery.Event)) {
          return new jQuery.Event(src, props);
        }
        if (src && src.type) {
          this.originalEvent = src;
          this.type = src.type;
          this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && // Support: Android <=2.3 only
          src.returnValue === false ? returnTrue : returnFalse;
          this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
          this.currentTarget = src.currentTarget;
          this.relatedTarget = src.relatedTarget;
        } else {
          this.type = src;
        }
        if (props) {
          jQuery.extend(this, props);
        }
        this.timeStamp = src && src.timeStamp || Date.now();
        this[jQuery.expando] = true;
      };
      jQuery.Event.prototype = {
        constructor: jQuery.Event,
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        isSimulated: false,
        preventDefault: function() {
          var e = this.originalEvent;
          this.isDefaultPrevented = returnTrue;
          if (e && !this.isSimulated) {
            e.preventDefault();
          }
        },
        stopPropagation: function() {
          var e = this.originalEvent;
          this.isPropagationStopped = returnTrue;
          if (e && !this.isSimulated) {
            e.stopPropagation();
          }
        },
        stopImmediatePropagation: function() {
          var e = this.originalEvent;
          this.isImmediatePropagationStopped = returnTrue;
          if (e && !this.isSimulated) {
            e.stopImmediatePropagation();
          }
          this.stopPropagation();
        }
      };
      jQuery.each({
        altKey: true,
        bubbles: true,
        cancelable: true,
        changedTouches: true,
        ctrlKey: true,
        detail: true,
        eventPhase: true,
        metaKey: true,
        pageX: true,
        pageY: true,
        shiftKey: true,
        view: true,
        "char": true,
        code: true,
        charCode: true,
        key: true,
        keyCode: true,
        button: true,
        buttons: true,
        clientX: true,
        clientY: true,
        offsetX: true,
        offsetY: true,
        pointerId: true,
        pointerType: true,
        screenX: true,
        screenY: true,
        targetTouches: true,
        toElement: true,
        touches: true,
        which: true
      }, jQuery.event.addProp);
      jQuery.each({ focus: "focusin", blur: "focusout" }, function(type, delegateType) {
        function focusMappedHandler(nativeEvent) {
          if (document2.documentMode) {
            var handle = dataPriv.get(this, "handle"), event = jQuery.event.fix(nativeEvent);
            event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
            event.isSimulated = true;
            handle(nativeEvent);
            if (event.target === event.currentTarget) {
              handle(event);
            }
          } else {
            jQuery.event.simulate(
              delegateType,
              nativeEvent.target,
              jQuery.event.fix(nativeEvent)
            );
          }
        }
        jQuery.event.special[type] = {
          // Utilize native event if possible so blur/focus sequence is correct
          setup: function() {
            var attaches;
            leverageNative(this, type, true);
            if (document2.documentMode) {
              attaches = dataPriv.get(this, delegateType);
              if (!attaches) {
                this.addEventListener(delegateType, focusMappedHandler);
              }
              dataPriv.set(this, delegateType, (attaches || 0) + 1);
            } else {
              return false;
            }
          },
          trigger: function() {
            leverageNative(this, type);
            return true;
          },
          teardown: function() {
            var attaches;
            if (document2.documentMode) {
              attaches = dataPriv.get(this, delegateType) - 1;
              if (!attaches) {
                this.removeEventListener(delegateType, focusMappedHandler);
                dataPriv.remove(this, delegateType);
              } else {
                dataPriv.set(this, delegateType, attaches);
              }
            } else {
              return false;
            }
          },
          // Suppress native focus or blur if we're currently inside
          // a leveraged native-event stack
          _default: function(event) {
            return dataPriv.get(event.target, type);
          },
          delegateType
        };
        jQuery.event.special[delegateType] = {
          setup: function() {
            var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType);
            if (!attaches) {
              if (document2.documentMode) {
                this.addEventListener(delegateType, focusMappedHandler);
              } else {
                doc.addEventListener(type, focusMappedHandler, true);
              }
            }
            dataPriv.set(dataHolder, delegateType, (attaches || 0) + 1);
          },
          teardown: function() {
            var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType) - 1;
            if (!attaches) {
              if (document2.documentMode) {
                this.removeEventListener(delegateType, focusMappedHandler);
              } else {
                doc.removeEventListener(type, focusMappedHandler, true);
              }
              dataPriv.remove(dataHolder, delegateType);
            } else {
              dataPriv.set(dataHolder, delegateType, attaches);
            }
          }
        };
      });
      jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
      }, function(orig, fix) {
        jQuery.event.special[orig] = {
          delegateType: fix,
          bindType: fix,
          handle: function(event) {
            var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
            if (!related || related !== target && !jQuery.contains(target, related)) {
              event.type = handleObj.origType;
              ret = handleObj.handler.apply(this, arguments);
              event.type = fix;
            }
            return ret;
          }
        };
      });
      jQuery.fn.extend({
        on: function(types, selector, data, fn) {
          return on(this, types, selector, data, fn);
        },
        one: function(types, selector, data, fn) {
          return on(this, types, selector, data, fn, 1);
        },
        off: function(types, selector, fn) {
          var handleObj, type;
          if (types && types.preventDefault && types.handleObj) {
            handleObj = types.handleObj;
            jQuery(types.delegateTarget).off(
              handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
              handleObj.selector,
              handleObj.handler
            );
            return this;
          }
          if (typeof types === "object") {
            for (type in types) {
              this.off(type, selector, types[type]);
            }
            return this;
          }
          if (selector === false || typeof selector === "function") {
            fn = selector;
            selector = void 0;
          }
          if (fn === false) {
            fn = returnFalse;
          }
          return this.each(function() {
            jQuery.event.remove(this, types, fn, selector);
          });
        }
      });
      var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
      function manipulationTarget(elem, content) {
        if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
          return jQuery(elem).children("tbody")[0] || elem;
        }
        return elem;
      }
      function disableScript(elem) {
        elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
        return elem;
      }
      function restoreScript(elem) {
        if ((elem.type || "").slice(0, 5) === "true/") {
          elem.type = elem.type.slice(5);
        } else {
          elem.removeAttribute("type");
        }
        return elem;
      }
      function cloneCopyEvent(src, dest) {
        var i, l, type, pdataOld, udataOld, udataCur, events;
        if (dest.nodeType !== 1) {
          return;
        }
        if (dataPriv.hasData(src)) {
          pdataOld = dataPriv.get(src);
          events = pdataOld.events;
          if (events) {
            dataPriv.remove(dest, "handle events");
            for (type in events) {
              for (i = 0, l = events[type].length; i < l; i++) {
                jQuery.event.add(dest, type, events[type][i]);
              }
            }
          }
        }
        if (dataUser.hasData(src)) {
          udataOld = dataUser.access(src);
          udataCur = jQuery.extend({}, udataOld);
          dataUser.set(dest, udataCur);
        }
      }
      function fixInput(src, dest) {
        var nodeName2 = dest.nodeName.toLowerCase();
        if (nodeName2 === "input" && rcheckableType.test(src.type)) {
          dest.checked = src.checked;
        } else if (nodeName2 === "input" || nodeName2 === "textarea") {
          dest.defaultValue = src.defaultValue;
        }
      }
      function domManip(collection, args, callback, ignored) {
        args = flat(args);
        var fragment, first, scripts, hasScripts, node, doc, i = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction(value);
        if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
          return collection.each(function(index) {
            var self2 = collection.eq(index);
            if (valueIsFunction) {
              args[0] = value.call(this, index, self2.html());
            }
            domManip(self2, args, callback, ignored);
          });
        }
        if (l) {
          fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
          first = fragment.firstChild;
          if (fragment.childNodes.length === 1) {
            fragment = first;
          }
          if (first || ignored) {
            scripts = jQuery.map(getAll(fragment, "script"), disableScript);
            hasScripts = scripts.length;
            for (; i < l; i++) {
              node = fragment;
              if (i !== iNoClone) {
                node = jQuery.clone(node, true, true);
                if (hasScripts) {
                  jQuery.merge(scripts, getAll(node, "script"));
                }
              }
              callback.call(collection[i], node, i);
            }
            if (hasScripts) {
              doc = scripts[scripts.length - 1].ownerDocument;
              jQuery.map(scripts, restoreScript);
              for (i = 0; i < hasScripts; i++) {
                node = scripts[i];
                if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {
                  if (node.src && (node.type || "").toLowerCase() !== "module") {
                    if (jQuery._evalUrl && !node.noModule) {
                      jQuery._evalUrl(node.src, {
                        nonce: node.nonce || node.getAttribute("nonce")
                      }, doc);
                    }
                  } else {
                    DOMEval(node.textContent.replace(rcleanScript, ""), node, doc);
                  }
                }
              }
            }
          }
        }
        return collection;
      }
      function remove(elem, selector, keepData) {
        var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0;
        for (; (node = nodes[i]) != null; i++) {
          if (!keepData && node.nodeType === 1) {
            jQuery.cleanData(getAll(node));
          }
          if (node.parentNode) {
            if (keepData && isAttached(node)) {
              setGlobalEval(getAll(node, "script"));
            }
            node.parentNode.removeChild(node);
          }
        }
        return elem;
      }
      jQuery.extend({
        htmlPrefilter: function(html) {
          return html;
        },
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
          var i, l, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
          if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
            destElements = getAll(clone);
            srcElements = getAll(elem);
            for (i = 0, l = srcElements.length; i < l; i++) {
              fixInput(srcElements[i], destElements[i]);
            }
          }
          if (dataAndEvents) {
            if (deepDataAndEvents) {
              srcElements = srcElements || getAll(elem);
              destElements = destElements || getAll(clone);
              for (i = 0, l = srcElements.length; i < l; i++) {
                cloneCopyEvent(srcElements[i], destElements[i]);
              }
            } else {
              cloneCopyEvent(elem, clone);
            }
          }
          destElements = getAll(clone, "script");
          if (destElements.length > 0) {
            setGlobalEval(destElements, !inPage && getAll(elem, "script"));
          }
          return clone;
        },
        cleanData: function(elems) {
          var data, elem, type, special = jQuery.event.special, i = 0;
          for (; (elem = elems[i]) !== void 0; i++) {
            if (acceptData(elem)) {
              if (data = elem[dataPriv.expando]) {
                if (data.events) {
                  for (type in data.events) {
                    if (special[type]) {
                      jQuery.event.remove(elem, type);
                    } else {
                      jQuery.removeEvent(elem, type, data.handle);
                    }
                  }
                }
                elem[dataPriv.expando] = void 0;
              }
              if (elem[dataUser.expando]) {
                elem[dataUser.expando] = void 0;
              }
            }
          }
        }
      });
      jQuery.fn.extend({
        detach: function(selector) {
          return remove(this, selector, true);
        },
        remove: function(selector) {
          return remove(this, selector);
        },
        text: function(value) {
          return access(this, function(value2) {
            return value2 === void 0 ? jQuery.text(this) : this.empty().each(function() {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                this.textContent = value2;
              }
            });
          }, null, value, arguments.length);
        },
        append: function() {
          return domManip(this, arguments, function(elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.appendChild(elem);
            }
          });
        },
        prepend: function() {
          return domManip(this, arguments, function(elem) {
            if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
              var target = manipulationTarget(this, elem);
              target.insertBefore(elem, target.firstChild);
            }
          });
        },
        before: function() {
          return domManip(this, arguments, function(elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this);
            }
          });
        },
        after: function() {
          return domManip(this, arguments, function(elem) {
            if (this.parentNode) {
              this.parentNode.insertBefore(elem, this.nextSibling);
            }
          });
        },
        empty: function() {
          var elem, i = 0;
          for (; (elem = this[i]) != null; i++) {
            if (elem.nodeType === 1) {
              jQuery.cleanData(getAll(elem, false));
              elem.textContent = "";
            }
          }
          return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
          dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
          deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
          return this.map(function() {
            return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
          });
        },
        html: function(value) {
          return access(this, function(value2) {
            var elem = this[0] || {}, i = 0, l = this.length;
            if (value2 === void 0 && elem.nodeType === 1) {
              return elem.innerHTML;
            }
            if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
              value2 = jQuery.htmlPrefilter(value2);
              try {
                for (; i < l; i++) {
                  elem = this[i] || {};
                  if (elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem, false));
                    elem.innerHTML = value2;
                  }
                }
                elem = 0;
              } catch (e) {
              }
            }
            if (elem) {
              this.empty().append(value2);
            }
          }, null, value, arguments.length);
        },
        replaceWith: function() {
          var ignored = [];
          return domManip(this, arguments, function(elem) {
            var parent = this.parentNode;
            if (jQuery.inArray(this, ignored) < 0) {
              jQuery.cleanData(getAll(this));
              if (parent) {
                parent.replaceChild(elem, this);
              }
            }
          }, ignored);
        }
      });
      jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
      }, function(name, original) {
        jQuery.fn[name] = function(selector) {
          var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0;
          for (; i <= last; i++) {
            elems = i === last ? this : this.clone(true);
            jQuery(insert[i])[original](elems);
            push.apply(ret, elems.get());
          }
          return this.pushStack(ret);
        };
      });
      var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
      var rcustomProp = /^--/;
      var getStyles = function(elem) {
        var view = elem.ownerDocument.defaultView;
        if (!view || !view.opener) {
          view = window2;
        }
        return view.getComputedStyle(elem);
      };
      var swap = function(elem, options, callback) {
        var ret, name, old = {};
        for (name in options) {
          old[name] = elem.style[name];
          elem.style[name] = options[name];
        }
        ret = callback.call(elem);
        for (name in options) {
          elem.style[name] = old[name];
        }
        return ret;
      };
      var rboxStyle = new RegExp(cssExpand.join("|"), "i");
      (function() {
        function computeStyleTests() {
          if (!div) {
            return;
          }
          container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
          div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
          documentElement.appendChild(container).appendChild(div);
          var divStyle = window2.getComputedStyle(div);
          pixelPositionVal = divStyle.top !== "1%";
          reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
          div.style.right = "60%";
          pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
          boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
          div.style.position = "absolute";
          scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
          documentElement.removeChild(container);
          div = null;
        }
        function roundPixelMeasures(measure) {
          return Math.round(parseFloat(measure));
        }
        var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document2.createElement("div"), div = document2.createElement("div");
        if (!div.style) {
          return;
        }
        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";
        jQuery.extend(support, {
          boxSizingReliable: function() {
            computeStyleTests();
            return boxSizingReliableVal;
          },
          pixelBoxStyles: function() {
            computeStyleTests();
            return pixelBoxStylesVal;
          },
          pixelPosition: function() {
            computeStyleTests();
            return pixelPositionVal;
          },
          reliableMarginLeft: function() {
            computeStyleTests();
            return reliableMarginLeftVal;
          },
          scrollboxSize: function() {
            computeStyleTests();
            return scrollboxSizeVal;
          },
          // Support: IE 9 - 11+, Edge 15 - 18+
          // IE/Edge misreport `getComputedStyle` of table rows with width/height
          // set in CSS while `offset*` properties report correct values.
          // Behavior in IE 9 is more subtle than in newer versions & it passes
          // some versions of this test; make sure not to make it pass there!
          //
          // Support: Firefox 70+
          // Only Firefox includes border widths
          // in computed dimensions. (gh-4529)
          reliableTrDimensions: function() {
            var table, tr, trChild, trStyle;
            if (reliableTrDimensionsVal == null) {
              table = document2.createElement("table");
              tr = document2.createElement("tr");
              trChild = document2.createElement("div");
              table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
              tr.style.cssText = "box-sizing:content-box;border:1px solid";
              tr.style.height = "1px";
              trChild.style.height = "9px";
              trChild.style.display = "block";
              documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
              trStyle = window2.getComputedStyle(tr);
              reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
              documentElement.removeChild(table);
            }
            return reliableTrDimensionsVal;
          }
        });
      })();
      function curCSS(elem, name, computed) {
        var width, minWidth, maxWidth, ret, isCustomProp = rcustomProp.test(name), style = elem.style;
        computed = computed || getStyles(elem);
        if (computed) {
          ret = computed.getPropertyValue(name) || computed[name];
          if (isCustomProp && ret) {
            ret = ret.replace(rtrimCSS, "$1") || void 0;
          }
          if (ret === "" && !isAttached(elem)) {
            ret = jQuery.style(elem, name);
          }
          if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
            width = style.width;
            minWidth = style.minWidth;
            maxWidth = style.maxWidth;
            style.minWidth = style.maxWidth = style.width = ret;
            ret = computed.width;
            style.width = width;
            style.minWidth = minWidth;
            style.maxWidth = maxWidth;
          }
        }
        return ret !== void 0 ? (
          // Support: IE <=9 - 11 only
          // IE returns zIndex value as an integer.
          ret + ""
        ) : ret;
      }
      function addGetHookIf(conditionFn, hookFn) {
        return {
          get: function() {
            if (conditionFn()) {
              delete this.get;
              return;
            }
            return (this.get = hookFn).apply(this, arguments);
          }
        };
      }
      var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document2.createElement("div").style, vendorProps = {};
      function vendorPropName(name) {
        var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length;
        while (i--) {
          name = cssPrefixes[i] + capName;
          if (name in emptyStyle) {
            return name;
          }
        }
      }
      function finalPropName(name) {
        var final = jQuery.cssProps[name] || vendorProps[name];
        if (final) {
          return final;
        }
        if (name in emptyStyle) {
          return name;
        }
        return vendorProps[name] = vendorPropName(name) || name;
      }
      var rdisplayswap = /^(none|table(?!-c[ea]).+)/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
      };
      function setPositiveNumber(_elem, value, subtract) {
        var matches = rcssNum.exec(value);
        return matches ? (
          // Guard against undefined "subtract", e.g., when used as in cssHooks
          Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
        ) : value;
      }
      function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
        var i = dimension === "width" ? 1 : 0, extra = 0, delta = 0, marginDelta = 0;
        if (box === (isBorderBox ? "border" : "content")) {
          return 0;
        }
        for (; i < 4; i += 2) {
          if (box === "margin") {
            marginDelta += jQuery.css(elem, box + cssExpand[i], true, styles);
          }
          if (!isBorderBox) {
            delta += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
            if (box !== "padding") {
              delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            } else {
              extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            }
          } else {
            if (box === "content") {
              delta -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
            }
            if (box !== "margin") {
              delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
            }
          }
        }
        if (!isBorderBox && computedVal >= 0) {
          delta += Math.max(0, Math.ceil(
            elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
            // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
            // Use an explicit zero to avoid NaN (gh-3964)
          )) || 0;
        }
        return delta + marginDelta;
      }
      function getWidthOrHeight(elem, dimension, extra) {
        var styles = getStyles(elem), boxSizingNeeded = !support.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
        if (rnumnonpx.test(val)) {
          if (!extra) {
            return val;
          }
          val = "auto";
        }
        if ((!support.boxSizingReliable() && isBorderBox || // Support: IE 10 - 11+, Edge 15 - 18+
        // IE/Edge misreport `getComputedStyle` of table rows with width/height
        // set in CSS while `offset*` properties report correct values.
        // Interestingly, in some cases IE 9 doesn't suffer from this issue.
        !support.reliableTrDimensions() && nodeName(elem, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
        // This happens for inline elements with no explicit setting (gh-3571)
        val === "auto" || // Support: Android <=4.1 - 4.3 only
        // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
        !parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline") && // Make sure the element is visible & connected
        elem.getClientRects().length) {
          isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";
          valueIsBorderBox = offsetProp in elem;
          if (valueIsBorderBox) {
            val = elem[offsetProp];
          }
        }
        val = parseFloat(val) || 0;
        return val + boxModelAdjustment(
          elem,
          dimension,
          extra || (isBorderBox ? "border" : "content"),
          valueIsBorderBox,
          styles,
          // Provide the current computed size to request scroll gutter calculation (gh-3589)
          val
        ) + "px";
      }
      jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
          opacity: {
            get: function(elem, computed) {
              if (computed) {
                var ret = curCSS(elem, "opacity");
                return ret === "" ? "1" : ret;
              }
            }
          }
        },
        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
          animationIterationCount: true,
          aspectRatio: true,
          borderImageSlice: true,
          columnCount: true,
          flexGrow: true,
          flexShrink: true,
          fontWeight: true,
          gridArea: true,
          gridColumn: true,
          gridColumnEnd: true,
          gridColumnStart: true,
          gridRow: true,
          gridRowEnd: true,
          gridRowStart: true,
          lineHeight: true,
          opacity: true,
          order: true,
          orphans: true,
          scale: true,
          widows: true,
          zIndex: true,
          zoom: true,
          // SVG-related
          fillOpacity: true,
          floodOpacity: true,
          stopOpacity: true,
          strokeMiterlimit: true,
          strokeOpacity: true
        },
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {},
        // Get and set the style property on a DOM Node
        style: function(elem, name, value, extra) {
          if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
            return;
          }
          var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
          if (!isCustomProp) {
            name = finalPropName(origName);
          }
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
          if (value !== void 0) {
            type = typeof value;
            if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
              value = adjustCSS(elem, name, ret);
              type = "number";
            }
            if (value == null || value !== value) {
              return;
            }
            if (type === "number" && !isCustomProp) {
              value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
            }
            if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
              style[name] = "inherit";
            }
            if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
              if (isCustomProp) {
                style.setProperty(name, value);
              } else {
                style[name] = value;
              }
            }
          } else {
            if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
              return ret;
            }
            return style[name];
          }
        },
        css: function(elem, name, extra, styles) {
          var val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
          if (!isCustomProp) {
            name = finalPropName(origName);
          }
          hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
          if (hooks && "get" in hooks) {
            val = hooks.get(elem, true, extra);
          }
          if (val === void 0) {
            val = curCSS(elem, name, styles);
          }
          if (val === "normal" && name in cssNormalTransform) {
            val = cssNormalTransform[name];
          }
          if (extra === "" || extra) {
            num = parseFloat(val);
            return extra === true || isFinite(num) ? num || 0 : val;
          }
          return val;
        }
      });
      jQuery.each(["height", "width"], function(_i, dimension) {
        jQuery.cssHooks[dimension] = {
          get: function(elem, computed, extra) {
            if (computed) {
              return rdisplayswap.test(jQuery.css(elem, "display")) && // Support: Safari 8+
              // Table columns in Safari have non-zero offsetWidth & zero
              // getBoundingClientRect().width unless display is changed.
              // Support: IE <=11 only
              // Running getBoundingClientRect on a disconnected node
              // in IE throws an error.
              (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
                return getWidthOrHeight(elem, dimension, extra);
              }) : getWidthOrHeight(elem, dimension, extra);
            }
          },
          set: function(elem, value, extra) {
            var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(
              elem,
              dimension,
              extra,
              isBorderBox,
              styles
            ) : 0;
            if (isBorderBox && scrollboxSizeBuggy) {
              subtract -= Math.ceil(
                elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5
              );
            }
            if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
              elem.style[dimension] = value;
              value = jQuery.css(elem, dimension);
            }
            return setPositiveNumber(elem, value, subtract);
          }
        };
      });
      jQuery.cssHooks.marginLeft = addGetHookIf(
        support.reliableMarginLeft,
        function(elem, computed) {
          if (computed) {
            return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
              return elem.getBoundingClientRect().left;
            })) + "px";
          }
        }
      );
      jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
      }, function(prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
          expand: function(value) {
            var i = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
            for (; i < 4; i++) {
              expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
            }
            return expanded;
          }
        };
        if (prefix !== "margin") {
          jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
      });
      jQuery.fn.extend({
        css: function(name, value) {
          return access(this, function(elem, name2, value2) {
            var styles, len, map = {}, i = 0;
            if (Array.isArray(name2)) {
              styles = getStyles(elem);
              len = name2.length;
              for (; i < len; i++) {
                map[name2[i]] = jQuery.css(elem, name2[i], false, styles);
              }
              return map;
            }
            return value2 !== void 0 ? jQuery.style(elem, name2, value2) : jQuery.css(elem, name2);
          }, name, value, arguments.length > 1);
        }
      });
      function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
      }
      jQuery.Tween = Tween;
      Tween.prototype = {
        constructor: Tween,
        init: function(elem, options, prop, end, easing, unit) {
          this.elem = elem;
          this.prop = prop;
          this.easing = easing || jQuery.easing._default;
          this.options = options;
          this.start = this.now = this.cur();
          this.end = end;
          this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function() {
          var hooks = Tween.propHooks[this.prop];
          return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function(percent) {
          var eased, hooks = Tween.propHooks[this.prop];
          if (this.options.duration) {
            this.pos = eased = jQuery.easing[this.easing](
              percent,
              this.options.duration * percent,
              0,
              1,
              this.options.duration
            );
          } else {
            this.pos = eased = percent;
          }
          this.now = (this.end - this.start) * eased + this.start;
          if (this.options.step) {
            this.options.step.call(this.elem, this.now, this);
          }
          if (hooks && hooks.set) {
            hooks.set(this);
          } else {
            Tween.propHooks._default.set(this);
          }
          return this;
        }
      };
      Tween.prototype.init.prototype = Tween.prototype;
      Tween.propHooks = {
        _default: {
          get: function(tween) {
            var result;
            if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
              return tween.elem[tween.prop];
            }
            result = jQuery.css(tween.elem, tween.prop, "");
            return !result || result === "auto" ? 0 : result;
          },
          set: function(tween) {
            if (jQuery.fx.step[tween.prop]) {
              jQuery.fx.step[tween.prop](tween);
            } else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
              jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
            } else {
              tween.elem[tween.prop] = tween.now;
            }
          }
        }
      };
      Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
          if (tween.elem.nodeType && tween.elem.parentNode) {
            tween.elem[tween.prop] = tween.now;
          }
        }
      };
      jQuery.easing = {
        linear: function(p) {
          return p;
        },
        swing: function(p) {
          return 0.5 - Math.cos(p * Math.PI) / 2;
        },
        _default: "swing"
      };
      jQuery.fx = Tween.prototype.init;
      jQuery.fx.step = {};
      var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
      function schedule() {
        if (inProgress) {
          if (document2.hidden === false && window2.requestAnimationFrame) {
            window2.requestAnimationFrame(schedule);
          } else {
            window2.setTimeout(schedule, jQuery.fx.interval);
          }
          jQuery.fx.tick();
        }
      }
      function createFxNow() {
        window2.setTimeout(function() {
          fxNow = void 0;
        });
        return fxNow = Date.now();
      }
      function genFx(type, includeWidth) {
        var which, i = 0, attrs = { height: type };
        includeWidth = includeWidth ? 1 : 0;
        for (; i < 4; i += 2 - includeWidth) {
          which = cssExpand[i];
          attrs["margin" + which] = attrs["padding" + which] = type;
        }
        if (includeWidth) {
          attrs.opacity = attrs.width = type;
        }
        return attrs;
      }
      function createTween(value, prop, animation) {
        var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
        for (; index < length; index++) {
          if (tween = collection[index].call(animation, prop, value)) {
            return tween;
          }
        }
      }
      function defaultPrefilter(elem, props, opts) {
        var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
        if (!opts.queue) {
          hooks = jQuery._queueHooks(elem, "fx");
          if (hooks.unqueued == null) {
            hooks.unqueued = 0;
            oldfire = hooks.empty.fire;
            hooks.empty.fire = function() {
              if (!hooks.unqueued) {
                oldfire();
              }
            };
          }
          hooks.unqueued++;
          anim.always(function() {
            anim.always(function() {
              hooks.unqueued--;
              if (!jQuery.queue(elem, "fx").length) {
                hooks.empty.fire();
              }
            });
          });
        }
        for (prop in props) {
          value = props[prop];
          if (rfxtypes.test(value)) {
            delete props[prop];
            toggle = toggle || value === "toggle";
            if (value === (hidden ? "hide" : "show")) {
              if (value === "show" && dataShow && dataShow[prop] !== void 0) {
                hidden = true;
              } else {
                continue;
              }
            }
            orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
          }
        }
        propTween = !jQuery.isEmptyObject(props);
        if (!propTween && jQuery.isEmptyObject(orig)) {
          return;
        }
        if (isBox && elem.nodeType === 1) {
          opts.overflow = [style.overflow, style.overflowX, style.overflowY];
          restoreDisplay = dataShow && dataShow.display;
          if (restoreDisplay == null) {
            restoreDisplay = dataPriv.get(elem, "display");
          }
          display = jQuery.css(elem, "display");
          if (display === "none") {
            if (restoreDisplay) {
              display = restoreDisplay;
            } else {
              showHide([elem], true);
              restoreDisplay = elem.style.display || restoreDisplay;
              display = jQuery.css(elem, "display");
              showHide([elem]);
            }
          }
          if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
            if (jQuery.css(elem, "float") === "none") {
              if (!propTween) {
                anim.done(function() {
                  style.display = restoreDisplay;
                });
                if (restoreDisplay == null) {
                  display = style.display;
                  restoreDisplay = display === "none" ? "" : display;
                }
              }
              style.display = "inline-block";
            }
          }
        }
        if (opts.overflow) {
          style.overflow = "hidden";
          anim.always(function() {
            style.overflow = opts.overflow[0];
            style.overflowX = opts.overflow[1];
            style.overflowY = opts.overflow[2];
          });
        }
        propTween = false;
        for (prop in orig) {
          if (!propTween) {
            if (dataShow) {
              if ("hidden" in dataShow) {
                hidden = dataShow.hidden;
              }
            } else {
              dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
            }
            if (toggle) {
              dataShow.hidden = !hidden;
            }
            if (hidden) {
              showHide([elem], true);
            }
            anim.done(function() {
              if (!hidden) {
                showHide([elem]);
              }
              dataPriv.remove(elem, "fxshow");
              for (prop in orig) {
                jQuery.style(elem, prop, orig[prop]);
              }
            });
          }
          propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
          if (!(prop in dataShow)) {
            dataShow[prop] = propTween.start;
            if (hidden) {
              propTween.end = propTween.start;
              propTween.start = 0;
            }
          }
        }
      }
      function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;
        for (index in props) {
          name = camelCase(index);
          easing = specialEasing[name];
          value = props[index];
          if (Array.isArray(value)) {
            easing = value[1];
            value = props[index] = value[0];
          }
          if (index !== name) {
            props[name] = value;
            delete props[index];
          }
          hooks = jQuery.cssHooks[name];
          if (hooks && "expand" in hooks) {
            value = hooks.expand(value);
            delete props[name];
            for (index in value) {
              if (!(index in props)) {
                props[index] = value[index];
                specialEasing[index] = easing;
              }
            }
          } else {
            specialEasing[name] = easing;
          }
        }
      }
      function Animation(elem, properties, options) {
        var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery.Deferred().always(function() {
          delete tick.elem;
        }), tick = function() {
          if (stopped) {
            return false;
          }
          var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length2 = animation.tweens.length;
          for (; index2 < length2; index2++) {
            animation.tweens[index2].run(percent);
          }
          deferred.notifyWith(elem, [animation, percent, remaining]);
          if (percent < 1 && length2) {
            return remaining;
          }
          if (!length2) {
            deferred.notifyWith(elem, [animation, 1, 0]);
          }
          deferred.resolveWith(elem, [animation]);
          return false;
        }, animation = deferred.promise({
          elem,
          props: jQuery.extend({}, properties),
          opts: jQuery.extend(true, {
            specialEasing: {},
            easing: jQuery.easing._default
          }, options),
          originalProperties: properties,
          originalOptions: options,
          startTime: fxNow || createFxNow(),
          duration: options.duration,
          tweens: [],
          createTween: function(prop, end) {
            var tween = jQuery.Tween(
              elem,
              animation.opts,
              prop,
              end,
              animation.opts.specialEasing[prop] || animation.opts.easing
            );
            animation.tweens.push(tween);
            return tween;
          },
          stop: function(gotoEnd) {
            var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
            if (stopped) {
              return this;
            }
            stopped = true;
            for (; index2 < length2; index2++) {
              animation.tweens[index2].run(1);
            }
            if (gotoEnd) {
              deferred.notifyWith(elem, [animation, 1, 0]);
              deferred.resolveWith(elem, [animation, gotoEnd]);
            } else {
              deferred.rejectWith(elem, [animation, gotoEnd]);
            }
            return this;
          }
        }), props = animation.props;
        propFilter(props, animation.opts.specialEasing);
        for (; index < length; index++) {
          result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
          if (result) {
            if (isFunction(result.stop)) {
              jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
            }
            return result;
          }
        }
        jQuery.map(props, createTween, animation);
        if (isFunction(animation.opts.start)) {
          animation.opts.start.call(elem, animation);
        }
        animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
        jQuery.fx.timer(
          jQuery.extend(tick, {
            elem,
            anim: animation,
            queue: animation.opts.queue
          })
        );
        return animation;
      }
      jQuery.Animation = jQuery.extend(Animation, {
        tweeners: {
          "*": [function(prop, value) {
            var tween = this.createTween(prop, value);
            adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
            return tween;
          }]
        },
        tweener: function(props, callback) {
          if (isFunction(props)) {
            callback = props;
            props = ["*"];
          } else {
            props = props.match(rnothtmlwhite);
          }
          var prop, index = 0, length = props.length;
          for (; index < length; index++) {
            prop = props[index];
            Animation.tweeners[prop] = Animation.tweeners[prop] || [];
            Animation.tweeners[prop].unshift(callback);
          }
        },
        prefilters: [defaultPrefilter],
        prefilter: function(callback, prepend) {
          if (prepend) {
            Animation.prefilters.unshift(callback);
          } else {
            Animation.prefilters.push(callback);
          }
        }
      });
      jQuery.speed = function(speed, easing, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
          complete: fn || !fn && easing || isFunction(speed) && speed,
          duration: speed,
          easing: fn && easing || easing && !isFunction(easing) && easing
        };
        if (jQuery.fx.off) {
          opt.duration = 0;
        } else {
          if (typeof opt.duration !== "number") {
            if (opt.duration in jQuery.fx.speeds) {
              opt.duration = jQuery.fx.speeds[opt.duration];
            } else {
              opt.duration = jQuery.fx.speeds._default;
            }
          }
        }
        if (opt.queue == null || opt.queue === true) {
          opt.queue = "fx";
        }
        opt.old = opt.complete;
        opt.complete = function() {
          if (isFunction(opt.old)) {
            opt.old.call(this);
          }
          if (opt.queue) {
            jQuery.dequeue(this, opt.queue);
          }
        };
        return opt;
      };
      jQuery.fn.extend({
        fadeTo: function(speed, to, easing, callback) {
          return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
          var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
            var anim = Animation(this, jQuery.extend({}, prop), optall);
            if (empty || dataPriv.get(this, "finish")) {
              anim.stop(true);
            }
          };
          doAnimation.finish = doAnimation;
          return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function(type, clearQueue, gotoEnd) {
          var stopQueue = function(hooks) {
            var stop = hooks.stop;
            delete hooks.stop;
            stop(gotoEnd);
          };
          if (typeof type !== "string") {
            gotoEnd = clearQueue;
            clearQueue = type;
            type = void 0;
          }
          if (clearQueue) {
            this.queue(type || "fx", []);
          }
          return this.each(function() {
            var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers, data = dataPriv.get(this);
            if (index) {
              if (data[index] && data[index].stop) {
                stopQueue(data[index]);
              }
            } else {
              for (index in data) {
                if (data[index] && data[index].stop && rrun.test(index)) {
                  stopQueue(data[index]);
                }
              }
            }
            for (index = timers.length; index--; ) {
              if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                timers[index].anim.stop(gotoEnd);
                dequeue = false;
                timers.splice(index, 1);
              }
            }
            if (dequeue || !gotoEnd) {
              jQuery.dequeue(this, type);
            }
          });
        },
        finish: function(type) {
          if (type !== false) {
            type = type || "fx";
          }
          return this.each(function() {
            var index, data = dataPriv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
            data.finish = true;
            jQuery.queue(this, type, []);
            if (hooks && hooks.stop) {
              hooks.stop.call(this, true);
            }
            for (index = timers.length; index--; ) {
              if (timers[index].elem === this && timers[index].queue === type) {
                timers[index].anim.stop(true);
                timers.splice(index, 1);
              }
            }
            for (index = 0; index < length; index++) {
              if (queue[index] && queue[index].finish) {
                queue[index].finish.call(this);
              }
            }
            delete data.finish;
          });
        }
      });
      jQuery.each(["toggle", "show", "hide"], function(_i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function(speed, easing, callback) {
          return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
        };
      });
      jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
      }, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
          return this.animate(props, speed, easing, callback);
        };
      });
      jQuery.timers = [];
      jQuery.fx.tick = function() {
        var timer, i = 0, timers = jQuery.timers;
        fxNow = Date.now();
        for (; i < timers.length; i++) {
          timer = timers[i];
          if (!timer() && timers[i] === timer) {
            timers.splice(i--, 1);
          }
        }
        if (!timers.length) {
          jQuery.fx.stop();
        }
        fxNow = void 0;
      };
      jQuery.fx.timer = function(timer) {
        jQuery.timers.push(timer);
        jQuery.fx.start();
      };
      jQuery.fx.interval = 13;
      jQuery.fx.start = function() {
        if (inProgress) {
          return;
        }
        inProgress = true;
        schedule();
      };
      jQuery.fx.stop = function() {
        inProgress = null;
      };
      jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
      };
      jQuery.fn.delay = function(time, type) {
        time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
        type = type || "fx";
        return this.queue(type, function(next, hooks) {
          var timeout = window2.setTimeout(next, time);
          hooks.stop = function() {
            window2.clearTimeout(timeout);
          };
        });
      };
      (function() {
        var input = document2.createElement("input"), select = document2.createElement("select"), opt = select.appendChild(document2.createElement("option"));
        input.type = "checkbox";
        support.checkOn = input.value !== "";
        support.optSelected = opt.selected;
        input = document2.createElement("input");
        input.value = "t";
        input.type = "radio";
        support.radioValue = input.value === "t";
      })();
      var boolHook, attrHandle = jQuery.expr.attrHandle;
      jQuery.fn.extend({
        attr: function(name, value) {
          return access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
          return this.each(function() {
            jQuery.removeAttr(this, name);
          });
        }
      });
      jQuery.extend({
        attr: function(elem, name, value) {
          var ret, hooks, nType = elem.nodeType;
          if (nType === 3 || nType === 8 || nType === 2) {
            return;
          }
          if (typeof elem.getAttribute === "undefined") {
            return jQuery.prop(elem, name, value);
          }
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0);
          }
          if (value !== void 0) {
            if (value === null) {
              jQuery.removeAttr(elem, name);
              return;
            }
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
              return ret;
            }
            elem.setAttribute(name, value + "");
            return value;
          }
          if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
          }
          ret = jQuery.find.attr(elem, name);
          return ret == null ? void 0 : ret;
        },
        attrHooks: {
          type: {
            set: function(elem, value) {
              if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
                var val = elem.value;
                elem.setAttribute("type", value);
                if (val) {
                  elem.value = val;
                }
                return value;
              }
            }
          }
        },
        removeAttr: function(elem, value) {
          var name, i = 0, attrNames = value && value.match(rnothtmlwhite);
          if (attrNames && elem.nodeType === 1) {
            while (name = attrNames[i++]) {
              elem.removeAttribute(name);
            }
          }
        }
      });
      boolHook = {
        set: function(elem, value, name) {
          if (value === false) {
            jQuery.removeAttr(elem, name);
          } else {
            elem.setAttribute(name, name);
          }
          return name;
        }
      };
      jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(_i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;
        attrHandle[name] = function(elem, name2, isXML) {
          var ret, handle, lowercaseName = name2.toLowerCase();
          if (!isXML) {
            handle = attrHandle[lowercaseName];
            attrHandle[lowercaseName] = ret;
            ret = getter(elem, name2, isXML) != null ? lowercaseName : null;
            attrHandle[lowercaseName] = handle;
          }
          return ret;
        };
      });
      var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
      jQuery.fn.extend({
        prop: function(name, value) {
          return access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
          return this.each(function() {
            delete this[jQuery.propFix[name] || name];
          });
        }
      });
      jQuery.extend({
        prop: function(elem, name, value) {
          var ret, hooks, nType = elem.nodeType;
          if (nType === 3 || nType === 8 || nType === 2) {
            return;
          }
          if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
            name = jQuery.propFix[name] || name;
            hooks = jQuery.propHooks[name];
          }
          if (value !== void 0) {
            if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
              return ret;
            }
            return elem[name] = value;
          }
          if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
            return ret;
          }
          return elem[name];
        },
        propHooks: {
          tabIndex: {
            get: function(elem) {
              var tabindex = jQuery.find.attr(elem, "tabindex");
              if (tabindex) {
                return parseInt(tabindex, 10);
              }
              if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
                return 0;
              }
              return -1;
            }
          }
        },
        propFix: {
          "for": "htmlFor",
          "class": "className"
        }
      });
      if (!support.optSelected) {
        jQuery.propHooks.selected = {
          get: function(elem) {
            var parent = elem.parentNode;
            if (parent && parent.parentNode) {
              parent.parentNode.selectedIndex;
            }
            return null;
          },
          set: function(elem) {
            var parent = elem.parentNode;
            if (parent) {
              parent.selectedIndex;
              if (parent.parentNode) {
                parent.parentNode.selectedIndex;
              }
            }
          }
        };
      }
      jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
      ], function() {
        jQuery.propFix[this.toLowerCase()] = this;
      });
      function stripAndCollapse(value) {
        var tokens = value.match(rnothtmlwhite) || [];
        return tokens.join(" ");
      }
      function getClass(elem) {
        return elem.getAttribute && elem.getAttribute("class") || "";
      }
      function classesToArray(value) {
        if (Array.isArray(value)) {
          return value;
        }
        if (typeof value === "string") {
          return value.match(rnothtmlwhite) || [];
        }
        return [];
      }
      jQuery.fn.extend({
        addClass: function(value) {
          var classNames, cur, curValue, className, i, finalValue;
          if (isFunction(value)) {
            return this.each(function(j) {
              jQuery(this).addClass(value.call(this, j, getClass(this)));
            });
          }
          classNames = classesToArray(value);
          if (classNames.length) {
            return this.each(function() {
              curValue = getClass(this);
              cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
              if (cur) {
                for (i = 0; i < classNames.length; i++) {
                  className = classNames[i];
                  if (cur.indexOf(" " + className + " ") < 0) {
                    cur += className + " ";
                  }
                }
                finalValue = stripAndCollapse(cur);
                if (curValue !== finalValue) {
                  this.setAttribute("class", finalValue);
                }
              }
            });
          }
          return this;
        },
        removeClass: function(value) {
          var classNames, cur, curValue, className, i, finalValue;
          if (isFunction(value)) {
            return this.each(function(j) {
              jQuery(this).removeClass(value.call(this, j, getClass(this)));
            });
          }
          if (!arguments.length) {
            return this.attr("class", "");
          }
          classNames = classesToArray(value);
          if (classNames.length) {
            return this.each(function() {
              curValue = getClass(this);
              cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
              if (cur) {
                for (i = 0; i < classNames.length; i++) {
                  className = classNames[i];
                  while (cur.indexOf(" " + className + " ") > -1) {
                    cur = cur.replace(" " + className + " ", " ");
                  }
                }
                finalValue = stripAndCollapse(cur);
                if (curValue !== finalValue) {
                  this.setAttribute("class", finalValue);
                }
              }
            });
          }
          return this;
        },
        toggleClass: function(value, stateVal) {
          var classNames, className, i, self2, type = typeof value, isValidValue = type === "string" || Array.isArray(value);
          if (isFunction(value)) {
            return this.each(function(i2) {
              jQuery(this).toggleClass(
                value.call(this, i2, getClass(this), stateVal),
                stateVal
              );
            });
          }
          if (typeof stateVal === "boolean" && isValidValue) {
            return stateVal ? this.addClass(value) : this.removeClass(value);
          }
          classNames = classesToArray(value);
          return this.each(function() {
            if (isValidValue) {
              self2 = jQuery(this);
              for (i = 0; i < classNames.length; i++) {
                className = classNames[i];
                if (self2.hasClass(className)) {
                  self2.removeClass(className);
                } else {
                  self2.addClass(className);
                }
              }
            } else if (value === void 0 || type === "boolean") {
              className = getClass(this);
              if (className) {
                dataPriv.set(this, "__className__", className);
              }
              if (this.setAttribute) {
                this.setAttribute(
                  "class",
                  className || value === false ? "" : dataPriv.get(this, "__className__") || ""
                );
              }
            }
          });
        },
        hasClass: function(selector) {
          var className, elem, i = 0;
          className = " " + selector + " ";
          while (elem = this[i++]) {
            if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
              return true;
            }
          }
          return false;
        }
      });
      var rreturn = /\r/g;
      jQuery.fn.extend({
        val: function(value) {
          var hooks, ret, valueIsFunction, elem = this[0];
          if (!arguments.length) {
            if (elem) {
              hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
              if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
                return ret;
              }
              ret = elem.value;
              if (typeof ret === "string") {
                return ret.replace(rreturn, "");
              }
              return ret == null ? "" : ret;
            }
            return;
          }
          valueIsFunction = isFunction(value);
          return this.each(function(i) {
            var val;
            if (this.nodeType !== 1) {
              return;
            }
            if (valueIsFunction) {
              val = value.call(this, i, jQuery(this).val());
            } else {
              val = value;
            }
            if (val == null) {
              val = "";
            } else if (typeof val === "number") {
              val += "";
            } else if (Array.isArray(val)) {
              val = jQuery.map(val, function(value2) {
                return value2 == null ? "" : value2 + "";
              });
            }
            hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
            if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
              this.value = val;
            }
          });
        }
      });
      jQuery.extend({
        valHooks: {
          option: {
            get: function(elem) {
              var val = jQuery.find.attr(elem, "value");
              return val != null ? val : (
                // Support: IE <=10 - 11 only
                // option.text throws exceptions (trac-14686, trac-14858)
                // Strip and collapse whitespace
                // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                stripAndCollapse(jQuery.text(elem))
              );
            }
          },
          select: {
            get: function(elem) {
              var value, option, i, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max = one ? index + 1 : options.length;
              if (index < 0) {
                i = max;
              } else {
                i = one ? index : 0;
              }
              for (; i < max; i++) {
                option = options[i];
                if ((option.selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
                !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                  value = jQuery(option).val();
                  if (one) {
                    return value;
                  }
                  values.push(value);
                }
              }
              return values;
            },
            set: function(elem, value) {
              var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length;
              while (i--) {
                option = options[i];
                if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
                  optionSet = true;
                }
              }
              if (!optionSet) {
                elem.selectedIndex = -1;
              }
              return values;
            }
          }
        }
      });
      jQuery.each(["radio", "checkbox"], function() {
        jQuery.valHooks[this] = {
          set: function(elem, value) {
            if (Array.isArray(value)) {
              return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
            }
          }
        };
        if (!support.checkOn) {
          jQuery.valHooks[this].get = function(elem) {
            return elem.getAttribute("value") === null ? "on" : elem.value;
          };
        }
      });
      var location = window2.location;
      var nonce = { guid: Date.now() };
      var rquery = /\?/;
      jQuery.parseXML = function(data) {
        var xml, parserErrorElem;
        if (!data || typeof data !== "string") {
          return null;
        }
        try {
          xml = new window2.DOMParser().parseFromString(data, "text/xml");
        } catch (e) {
        }
        parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
        if (!xml || parserErrorElem) {
          jQuery.error("Invalid XML: " + (parserErrorElem ? jQuery.map(parserErrorElem.childNodes, function(el) {
            return el.textContent;
          }).join("\n") : data));
        }
        return xml;
      };
      var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
        e.stopPropagation();
      };
      jQuery.extend(jQuery.event, {
        trigger: function(event, data, elem, onlyHandlers) {
          var i, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document2], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
          cur = lastElement = tmp = elem = elem || document2;
          if (elem.nodeType === 3 || elem.nodeType === 8) {
            return;
          }
          if (rfocusMorph.test(type + jQuery.event.triggered)) {
            return;
          }
          if (type.indexOf(".") > -1) {
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
          }
          ontype = type.indexOf(":") < 0 && "on" + type;
          event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
          event.isTrigger = onlyHandlers ? 2 : 3;
          event.namespace = namespaces.join(".");
          event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
          event.result = void 0;
          if (!event.target) {
            event.target = elem;
          }
          data = data == null ? [event] : jQuery.makeArray(data, [event]);
          special = jQuery.event.special[type] || {};
          if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
            return;
          }
          if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
            bubbleType = special.delegateType || type;
            if (!rfocusMorph.test(bubbleType + type)) {
              cur = cur.parentNode;
            }
            for (; cur; cur = cur.parentNode) {
              eventPath.push(cur);
              tmp = cur;
            }
            if (tmp === (elem.ownerDocument || document2)) {
              eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
            }
          }
          i = 0;
          while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
            lastElement = cur;
            event.type = i > 1 ? bubbleType : special.bindType || type;
            handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
            if (handle) {
              handle.apply(cur, data);
            }
            handle = ontype && cur[ontype];
            if (handle && handle.apply && acceptData(cur)) {
              event.result = handle.apply(cur, data);
              if (event.result === false) {
                event.preventDefault();
              }
            }
          }
          event.type = type;
          if (!onlyHandlers && !event.isDefaultPrevented()) {
            if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
              if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
                tmp = elem[ontype];
                if (tmp) {
                  elem[ontype] = null;
                }
                jQuery.event.triggered = type;
                if (event.isPropagationStopped()) {
                  lastElement.addEventListener(type, stopPropagationCallback);
                }
                elem[type]();
                if (event.isPropagationStopped()) {
                  lastElement.removeEventListener(type, stopPropagationCallback);
                }
                jQuery.event.triggered = void 0;
                if (tmp) {
                  elem[ontype] = tmp;
                }
              }
            }
          }
          return event.result;
        },
        // Piggyback on a donor event to simulate a different one
        // Used only for `focus(in | out)` events
        simulate: function(type, elem, event) {
          var e = jQuery.extend(
            new jQuery.Event(),
            event,
            {
              type,
              isSimulated: true
            }
          );
          jQuery.event.trigger(e, null, elem);
        }
      });
      jQuery.fn.extend({
        trigger: function(type, data) {
          return this.each(function() {
            jQuery.event.trigger(type, data, this);
          });
        },
        triggerHandler: function(type, data) {
          var elem = this[0];
          if (elem) {
            return jQuery.event.trigger(type, data, elem, true);
          }
        }
      });
      var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
      function buildParams(prefix, obj, traditional, add) {
        var name;
        if (Array.isArray(obj)) {
          jQuery.each(obj, function(i, v) {
            if (traditional || rbracket.test(prefix)) {
              add(prefix, v);
            } else {
              buildParams(
                prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
                v,
                traditional,
                add
              );
            }
          });
        } else if (!traditional && toType(obj) === "object") {
          for (name in obj) {
            buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
          }
        } else {
          add(prefix, obj);
        }
      }
      jQuery.param = function(a, traditional) {
        var prefix, s = [], add = function(key, valueOrFunction) {
          var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
          s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
        };
        if (a == null) {
          return "";
        }
        if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
          jQuery.each(a, function() {
            add(this.name, this.value);
          });
        } else {
          for (prefix in a) {
            buildParams(prefix, a[prefix], traditional, add);
          }
        }
        return s.join("&");
      };
      jQuery.fn.extend({
        serialize: function() {
          return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
          return this.map(function() {
            var elements = jQuery.prop(this, "elements");
            return elements ? jQuery.makeArray(elements) : this;
          }).filter(function() {
            var type = this.type;
            return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
          }).map(function(_i, elem) {
            var val = jQuery(this).val();
            if (val == null) {
              return null;
            }
            if (Array.isArray(val)) {
              return jQuery.map(val, function(val2) {
                return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
              });
            }
            return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
          }).get();
        }
      });
      var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document2.createElement("a");
      originAnchor.href = location.href;
      function addToPrefiltersOrTransports(structure) {
        return function(dataTypeExpression, func) {
          if (typeof dataTypeExpression !== "string") {
            func = dataTypeExpression;
            dataTypeExpression = "*";
          }
          var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
          if (isFunction(func)) {
            while (dataType = dataTypes[i++]) {
              if (dataType[0] === "+") {
                dataType = dataType.slice(1) || "*";
                (structure[dataType] = structure[dataType] || []).unshift(func);
              } else {
                (structure[dataType] = structure[dataType] || []).push(func);
              }
            }
          }
        };
      }
      function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        var inspected = {}, seekingTransport = structure === transports;
        function inspect(dataType) {
          var selected;
          inspected[dataType] = true;
          jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
            var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
            if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
              options.dataTypes.unshift(dataTypeOrTransport);
              inspect(dataTypeOrTransport);
              return false;
            } else if (seekingTransport) {
              return !(selected = dataTypeOrTransport);
            }
          });
          return selected;
        }
        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
      }
      function ajaxExtend(target, src) {
        var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) {
          if (src[key] !== void 0) {
            (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
          }
        }
        if (deep) {
          jQuery.extend(true, target, deep);
        }
        return target;
      }
      function ajaxHandleResponses(s, jqXHR, responses) {
        var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
        while (dataTypes[0] === "*") {
          dataTypes.shift();
          if (ct === void 0) {
            ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
          }
        }
        if (ct) {
          for (type in contents) {
            if (contents[type] && contents[type].test(ct)) {
              dataTypes.unshift(type);
              break;
            }
          }
        }
        if (dataTypes[0] in responses) {
          finalDataType = dataTypes[0];
        } else {
          for (type in responses) {
            if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
              finalDataType = type;
              break;
            }
            if (!firstDataType) {
              firstDataType = type;
            }
          }
          finalDataType = finalDataType || firstDataType;
        }
        if (finalDataType) {
          if (finalDataType !== dataTypes[0]) {
            dataTypes.unshift(finalDataType);
          }
          return responses[finalDataType];
        }
      }
      function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
        if (dataTypes[1]) {
          for (conv in s.converters) {
            converters[conv.toLowerCase()] = s.converters[conv];
          }
        }
        current = dataTypes.shift();
        while (current) {
          if (s.responseFields[current]) {
            jqXHR[s.responseFields[current]] = response;
          }
          if (!prev && isSuccess && s.dataFilter) {
            response = s.dataFilter(response, s.dataType);
          }
          prev = current;
          current = dataTypes.shift();
          if (current) {
            if (current === "*") {
              current = prev;
            } else if (prev !== "*" && prev !== current) {
              conv = converters[prev + " " + current] || converters["* " + current];
              if (!conv) {
                for (conv2 in converters) {
                  tmp = conv2.split(" ");
                  if (tmp[1] === current) {
                    conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                    if (conv) {
                      if (conv === true) {
                        conv = converters[conv2];
                      } else if (converters[conv2] !== true) {
                        current = tmp[0];
                        dataTypes.unshift(tmp[1]);
                      }
                      break;
                    }
                  }
                }
              }
              if (conv !== true) {
                if (conv && s.throws) {
                  response = conv(response);
                } else {
                  try {
                    response = conv(response);
                  } catch (e) {
                    return {
                      state: "parsererror",
                      error: conv ? e : "No conversion from " + prev + " to " + current
                    };
                  }
                }
              }
            }
          }
        }
        return { state: "success", data: response };
      }
      jQuery.extend({
        // Counter for holding the number of active queries
        active: 0,
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
        ajaxSettings: {
          url: location.href,
          type: "GET",
          isLocal: rlocalProtocol.test(location.protocol),
          global: true,
          processData: true,
          async: true,
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          /*
          timeout: 0,
          data: null,
          dataType: null,
          username: null,
          password: null,
          cache: null,
          throws: false,
          traditional: false,
          headers: {},
          */
          accepts: {
            "*": allTypes,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
          },
          contents: {
            xml: /\bxml\b/,
            html: /\bhtml/,
            json: /\bjson\b/
          },
          responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
          },
          // Data converters
          // Keys separate source (or catchall "*") and destination types with a single space
          converters: {
            // Convert anything to text
            "* text": String,
            // Text to html (true = no transformation)
            "text html": true,
            // Evaluate text as a json expression
            "text json": JSON.parse,
            // Parse text as xml
            "text xml": jQuery.parseXML
          },
          // For options that shouldn't be deep extended:
          // you can add your own custom options here if
          // and when you create one that shouldn't be
          // deep extended (see ajaxExtend)
          flatOptions: {
            url: true,
            context: true
          }
        },
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function(target, settings) {
          return settings ? (
            // Building a settings object
            ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings)
          ) : (
            // Extending ajaxSettings
            ajaxExtend(jQuery.ajaxSettings, target)
          );
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        // Main method
        ajax: function(url, options) {
          if (typeof url === "object") {
            options = url;
            url = void 0;
          }
          options = options || {};
          var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i, uncached, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
            readyState: 0,
            // Builds headers hashtable if needed
            getResponseHeader: function(key) {
              var match;
              if (completed2) {
                if (!responseHeaders) {
                  responseHeaders = {};
                  while (match = rheaders.exec(responseHeadersString)) {
                    responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                  }
                }
                match = responseHeaders[key.toLowerCase() + " "];
              }
              return match == null ? null : match.join(", ");
            },
            // Raw string
            getAllResponseHeaders: function() {
              return completed2 ? responseHeadersString : null;
            },
            // Caches the header
            setRequestHeader: function(name, value) {
              if (completed2 == null) {
                name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
                requestHeaders[name] = value;
              }
              return this;
            },
            // Overrides response content-type header
            overrideMimeType: function(type) {
              if (completed2 == null) {
                s.mimeType = type;
              }
              return this;
            },
            // Status-dependent callbacks
            statusCode: function(map) {
              var code;
              if (map) {
                if (completed2) {
                  jqXHR.always(map[jqXHR.status]);
                } else {
                  for (code in map) {
                    statusCode[code] = [statusCode[code], map[code]];
                  }
                }
              }
              return this;
            },
            // Cancel the request
            abort: function(statusText) {
              var finalText = statusText || strAbort;
              if (transport) {
                transport.abort(finalText);
              }
              done(0, finalText);
              return this;
            }
          };
          deferred.promise(jqXHR);
          s.url = ((url || s.url || location.href) + "").replace(rprotocol, location.protocol + "//");
          s.type = options.method || options.type || s.method || s.type;
          s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
          if (s.crossDomain == null) {
            urlAnchor = document2.createElement("a");
            try {
              urlAnchor.href = s.url;
              urlAnchor.href = urlAnchor.href;
              s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
            } catch (e) {
              s.crossDomain = true;
            }
          }
          if (s.data && s.processData && typeof s.data !== "string") {
            s.data = jQuery.param(s.data, s.traditional);
          }
          inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
          if (completed2) {
            return jqXHR;
          }
          fireGlobals = jQuery.event && s.global;
          if (fireGlobals && jQuery.active++ === 0) {
            jQuery.event.trigger("ajaxStart");
          }
          s.type = s.type.toUpperCase();
          s.hasContent = !rnoContent.test(s.type);
          cacheURL = s.url.replace(rhash, "");
          if (!s.hasContent) {
            uncached = s.url.slice(cacheURL.length);
            if (s.data && (s.processData || typeof s.data === "string")) {
              cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
              delete s.data;
            }
            if (s.cache === false) {
              cacheURL = cacheURL.replace(rantiCache, "$1");
              uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
            }
            s.url = cacheURL + uncached;
          } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
            s.data = s.data.replace(r20, "+");
          }
          if (s.ifModified) {
            if (jQuery.lastModified[cacheURL]) {
              jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
            }
            if (jQuery.etag[cacheURL]) {
              jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
            }
          }
          if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
            jqXHR.setRequestHeader("Content-Type", s.contentType);
          }
          jqXHR.setRequestHeader(
            "Accept",
            s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]
          );
          for (i in s.headers) {
            jqXHR.setRequestHeader(i, s.headers[i]);
          }
          if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed2)) {
            return jqXHR.abort();
          }
          strAbort = "abort";
          completeDeferred.add(s.complete);
          jqXHR.done(s.success);
          jqXHR.fail(s.error);
          transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
          if (!transport) {
            done(-1, "No Transport");
          } else {
            jqXHR.readyState = 1;
            if (fireGlobals) {
              globalEventContext.trigger("ajaxSend", [jqXHR, s]);
            }
            if (completed2) {
              return jqXHR;
            }
            if (s.async && s.timeout > 0) {
              timeoutTimer = window2.setTimeout(function() {
                jqXHR.abort("timeout");
              }, s.timeout);
            }
            try {
              completed2 = false;
              transport.send(requestHeaders, done);
            } catch (e) {
              if (completed2) {
                throw e;
              }
              done(-1, e);
            }
          }
          function done(status, nativeStatusText, responses, headers) {
            var isSuccess, success, error, response, modified, statusText = nativeStatusText;
            if (completed2) {
              return;
            }
            completed2 = true;
            if (timeoutTimer) {
              window2.clearTimeout(timeoutTimer);
            }
            transport = void 0;
            responseHeadersString = headers || "";
            jqXHR.readyState = status > 0 ? 4 : 0;
            isSuccess = status >= 200 && status < 300 || status === 304;
            if (responses) {
              response = ajaxHandleResponses(s, jqXHR, responses);
            }
            if (!isSuccess && jQuery.inArray("script", s.dataTypes) > -1 && jQuery.inArray("json", s.dataTypes) < 0) {
              s.converters["text script"] = function() {
              };
            }
            response = ajaxConvert(s, response, jqXHR, isSuccess);
            if (isSuccess) {
              if (s.ifModified) {
                modified = jqXHR.getResponseHeader("Last-Modified");
                if (modified) {
                  jQuery.lastModified[cacheURL] = modified;
                }
                modified = jqXHR.getResponseHeader("etag");
                if (modified) {
                  jQuery.etag[cacheURL] = modified;
                }
              }
              if (status === 204 || s.type === "HEAD") {
                statusText = "nocontent";
              } else if (status === 304) {
                statusText = "notmodified";
              } else {
                statusText = response.state;
                success = response.data;
                error = response.error;
                isSuccess = !error;
              }
            } else {
              error = statusText;
              if (status || !statusText) {
                statusText = "error";
                if (status < 0) {
                  status = 0;
                }
              }
            }
            jqXHR.status = status;
            jqXHR.statusText = (nativeStatusText || statusText) + "";
            if (isSuccess) {
              deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
            } else {
              deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
            }
            jqXHR.statusCode(statusCode);
            statusCode = void 0;
            if (fireGlobals) {
              globalEventContext.trigger(
                isSuccess ? "ajaxSuccess" : "ajaxError",
                [jqXHR, s, isSuccess ? success : error]
              );
            }
            completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
            if (fireGlobals) {
              globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
              if (!--jQuery.active) {
                jQuery.event.trigger("ajaxStop");
              }
            }
          }
          return jqXHR;
        },
        getJSON: function(url, data, callback) {
          return jQuery.get(url, data, callback, "json");
        },
        getScript: function(url, callback) {
          return jQuery.get(url, void 0, callback, "script");
        }
      });
      jQuery.each(["get", "post"], function(_i, method) {
        jQuery[method] = function(url, data, callback, type) {
          if (isFunction(data)) {
            type = type || callback;
            callback = data;
            data = void 0;
          }
          return jQuery.ajax(jQuery.extend({
            url,
            type: method,
            dataType: type,
            data,
            success: callback
          }, jQuery.isPlainObject(url) && url));
        };
      });
      jQuery.ajaxPrefilter(function(s) {
        var i;
        for (i in s.headers) {
          if (i.toLowerCase() === "content-type") {
            s.contentType = s.headers[i] || "";
          }
        }
      });
      jQuery._evalUrl = function(url, options, doc) {
        return jQuery.ajax({
          url,
          // Make this explicit, since user can override this through ajaxSetup (trac-11264)
          type: "GET",
          dataType: "script",
          cache: true,
          async: false,
          global: false,
          // Only evaluate the response if it is successful (gh-4126)
          // dataFilter is not invoked for failure responses, so using it instead
          // of the default converter is kludgy but it works.
          converters: {
            "text script": function() {
            }
          },
          dataFilter: function(response) {
            jQuery.globalEval(response, options, doc);
          }
        });
      };
      jQuery.fn.extend({
        wrapAll: function(html) {
          var wrap;
          if (this[0]) {
            if (isFunction(html)) {
              html = html.call(this[0]);
            }
            wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
            if (this[0].parentNode) {
              wrap.insertBefore(this[0]);
            }
            wrap.map(function() {
              var elem = this;
              while (elem.firstElementChild) {
                elem = elem.firstElementChild;
              }
              return elem;
            }).append(this);
          }
          return this;
        },
        wrapInner: function(html) {
          if (isFunction(html)) {
            return this.each(function(i) {
              jQuery(this).wrapInner(html.call(this, i));
            });
          }
          return this.each(function() {
            var self2 = jQuery(this), contents = self2.contents();
            if (contents.length) {
              contents.wrapAll(html);
            } else {
              self2.append(html);
            }
          });
        },
        wrap: function(html) {
          var htmlIsFunction = isFunction(html);
          return this.each(function(i) {
            jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
          });
        },
        unwrap: function(selector) {
          this.parent(selector).not("body").each(function() {
            jQuery(this).replaceWith(this.childNodes);
          });
          return this;
        }
      });
      jQuery.expr.pseudos.hidden = function(elem) {
        return !jQuery.expr.pseudos.visible(elem);
      };
      jQuery.expr.pseudos.visible = function(elem) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
      };
      jQuery.ajaxSettings.xhr = function() {
        try {
          return new window2.XMLHttpRequest();
        } catch (e) {
        }
      };
      var xhrSuccessStatus = {
        // File protocol always yields status code 0, assume 200
        0: 200,
        // Support: IE <=9 only
        // trac-1450: sometimes IE returns 1223 when it should be 204
        1223: 204
      }, xhrSupported = jQuery.ajaxSettings.xhr();
      support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
      support.ajax = xhrSupported = !!xhrSupported;
      jQuery.ajaxTransport(function(options) {
        var callback, errorCallback;
        if (support.cors || xhrSupported && !options.crossDomain) {
          return {
            send: function(headers, complete) {
              var i, xhr = options.xhr();
              xhr.open(
                options.type,
                options.url,
                options.async,
                options.username,
                options.password
              );
              if (options.xhrFields) {
                for (i in options.xhrFields) {
                  xhr[i] = options.xhrFields[i];
                }
              }
              if (options.mimeType && xhr.overrideMimeType) {
                xhr.overrideMimeType(options.mimeType);
              }
              if (!options.crossDomain && !headers["X-Requested-With"]) {
                headers["X-Requested-With"] = "XMLHttpRequest";
              }
              for (i in headers) {
                xhr.setRequestHeader(i, headers[i]);
              }
              callback = function(type) {
                return function() {
                  if (callback) {
                    callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                    if (type === "abort") {
                      xhr.abort();
                    } else if (type === "error") {
                      if (typeof xhr.status !== "number") {
                        complete(0, "error");
                      } else {
                        complete(
                          // File: protocol always yields status 0; see trac-8605, trac-14207
                          xhr.status,
                          xhr.statusText
                        );
                      }
                    } else {
                      complete(
                        xhrSuccessStatus[xhr.status] || xhr.status,
                        xhr.statusText,
                        // Support: IE <=9 only
                        // IE9 has no XHR2 but throws on binary (trac-11426)
                        // For XHR2 non-text, let the caller handle it (gh-2498)
                        (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText },
                        xhr.getAllResponseHeaders()
                      );
                    }
                  }
                };
              };
              xhr.onload = callback();
              errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
              if (xhr.onabort !== void 0) {
                xhr.onabort = errorCallback;
              } else {
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    window2.setTimeout(function() {
                      if (callback) {
                        errorCallback();
                      }
                    });
                  }
                };
              }
              callback = callback("abort");
              try {
                xhr.send(options.hasContent && options.data || null);
              } catch (e) {
                if (callback) {
                  throw e;
                }
              }
            },
            abort: function() {
              if (callback) {
                callback();
              }
            }
          };
        }
      });
      jQuery.ajaxPrefilter(function(s) {
        if (s.crossDomain) {
          s.contents.script = false;
        }
      });
      jQuery.ajaxSetup({
        accepts: {
          script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
          script: /\b(?:java|ecma)script\b/
        },
        converters: {
          "text script": function(text) {
            jQuery.globalEval(text);
            return text;
          }
        }
      });
      jQuery.ajaxPrefilter("script", function(s) {
        if (s.cache === void 0) {
          s.cache = false;
        }
        if (s.crossDomain) {
          s.type = "GET";
        }
      });
      jQuery.ajaxTransport("script", function(s) {
        if (s.crossDomain || s.scriptAttrs) {
          var script, callback;
          return {
            send: function(_, complete) {
              script = jQuery("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", callback = function(evt) {
                script.remove();
                callback = null;
                if (evt) {
                  complete(evt.type === "error" ? 404 : 200, evt.type);
                }
              });
              document2.head.appendChild(script[0]);
            },
            abort: function() {
              if (callback) {
                callback();
              }
            }
          };
        }
      });
      var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
      jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
          var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
          this[callback] = true;
          return callback;
        }
      });
      jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
        if (jsonProp || s.dataTypes[0] === "jsonp") {
          callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
          if (jsonProp) {
            s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
          } else if (s.jsonp !== false) {
            s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
          }
          s.converters["script json"] = function() {
            if (!responseContainer) {
              jQuery.error(callbackName + " was not called");
            }
            return responseContainer[0];
          };
          s.dataTypes[0] = "json";
          overwritten = window2[callbackName];
          window2[callbackName] = function() {
            responseContainer = arguments;
          };
          jqXHR.always(function() {
            if (overwritten === void 0) {
              jQuery(window2).removeProp(callbackName);
            } else {
              window2[callbackName] = overwritten;
            }
            if (s[callbackName]) {
              s.jsonpCallback = originalSettings.jsonpCallback;
              oldCallbacks.push(callbackName);
            }
            if (responseContainer && isFunction(overwritten)) {
              overwritten(responseContainer[0]);
            }
            responseContainer = overwritten = void 0;
          });
          return "script";
        }
      });
      support.createHTMLDocument = function() {
        var body = document2.implementation.createHTMLDocument("").body;
        body.innerHTML = "<form></form><form></form>";
        return body.childNodes.length === 2;
      }();
      jQuery.parseHTML = function(data, context, keepScripts) {
        if (typeof data !== "string") {
          return [];
        }
        if (typeof context === "boolean") {
          keepScripts = context;
          context = false;
        }
        var base, parsed, scripts;
        if (!context) {
          if (support.createHTMLDocument) {
            context = document2.implementation.createHTMLDocument("");
            base = context.createElement("base");
            base.href = document2.location.href;
            context.head.appendChild(base);
          } else {
            context = document2;
          }
        }
        parsed = rsingleTag.exec(data);
        scripts = !keepScripts && [];
        if (parsed) {
          return [context.createElement(parsed[1])];
        }
        parsed = buildFragment([data], context, scripts);
        if (scripts && scripts.length) {
          jQuery(scripts).remove();
        }
        return jQuery.merge([], parsed.childNodes);
      };
      jQuery.fn.load = function(url, params, callback) {
        var selector, type, response, self2 = this, off = url.indexOf(" ");
        if (off > -1) {
          selector = stripAndCollapse(url.slice(off));
          url = url.slice(0, off);
        }
        if (isFunction(params)) {
          callback = params;
          params = void 0;
        } else if (params && typeof params === "object") {
          type = "POST";
        }
        if (self2.length > 0) {
          jQuery.ajax({
            url,
            // If "type" variable is undefined, then "GET" method will be used.
            // Make value of this field explicit since
            // user can override it through ajaxSetup method
            type: type || "GET",
            dataType: "html",
            data: params
          }).done(function(responseText) {
            response = arguments;
            self2.html(selector ? (
              // If a selector was specified, locate the right elements in a dummy div
              // Exclude scripts to avoid IE 'Permission Denied' errors
              jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector)
            ) : (
              // Otherwise use the full result
              responseText
            ));
          }).always(callback && function(jqXHR, status) {
            self2.each(function() {
              callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
            });
          });
        }
        return this;
      };
      jQuery.expr.pseudos.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
          return elem === fn.elem;
        }).length;
      };
      jQuery.offset = {
        setOffset: function(elem, options, i) {
          var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
          if (position === "static") {
            elem.style.position = "relative";
          }
          curOffset = curElem.offset();
          curCSSTop = jQuery.css(elem, "top");
          curCSSLeft = jQuery.css(elem, "left");
          calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
          if (calculatePosition) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
          } else {
            curTop = parseFloat(curCSSTop) || 0;
            curLeft = parseFloat(curCSSLeft) || 0;
          }
          if (isFunction(options)) {
            options = options.call(elem, i, jQuery.extend({}, curOffset));
          }
          if (options.top != null) {
            props.top = options.top - curOffset.top + curTop;
          }
          if (options.left != null) {
            props.left = options.left - curOffset.left + curLeft;
          }
          if ("using" in options) {
            options.using.call(elem, props);
          } else {
            curElem.css(props);
          }
        }
      };
      jQuery.fn.extend({
        // offset() relates an element's border box to the document origin
        offset: function(options) {
          if (arguments.length) {
            return options === void 0 ? this : this.each(function(i) {
              jQuery.offset.setOffset(this, options, i);
            });
          }
          var rect, win, elem = this[0];
          if (!elem) {
            return;
          }
          if (!elem.getClientRects().length) {
            return { top: 0, left: 0 };
          }
          rect = elem.getBoundingClientRect();
          win = elem.ownerDocument.defaultView;
          return {
            top: rect.top + win.pageYOffset,
            left: rect.left + win.pageXOffset
          };
        },
        // position() relates an element's margin box to its offset parent's padding box
        // This corresponds to the behavior of CSS absolute positioning
        position: function() {
          if (!this[0]) {
            return;
          }
          var offsetParent, offset, doc, elem = this[0], parentOffset = { top: 0, left: 0 };
          if (jQuery.css(elem, "position") === "fixed") {
            offset = elem.getBoundingClientRect();
          } else {
            offset = this.offset();
            doc = elem.ownerDocument;
            offsetParent = elem.offsetParent || doc.documentElement;
            while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent, "position") === "static") {
              offsetParent = offsetParent.parentNode;
            }
            if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
              parentOffset = jQuery(offsetParent).offset();
              parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
              parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
            }
          }
          return {
            top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
            left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
          };
        },
        // This method will return documentElement in the following cases:
        // 1) For the element inside the iframe without offsetParent, this method will return
        //    documentElement of the parent window
        // 2) For the hidden or detached element
        // 3) For body or html element, i.e. in case of the html node - it will return itself
        //
        // but those exceptions were never presented as a real life use-cases
        // and might be considered as more preferable results.
        //
        // This logic, however, is not guaranteed and can change at any point in the future
        offsetParent: function() {
          return this.map(function() {
            var offsetParent = this.offsetParent;
            while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
              offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || documentElement;
          });
        }
      });
      jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
        var top = "pageYOffset" === prop;
        jQuery.fn[method] = function(val) {
          return access(this, function(elem, method2, val2) {
            var win;
            if (isWindow(elem)) {
              win = elem;
            } else if (elem.nodeType === 9) {
              win = elem.defaultView;
            }
            if (val2 === void 0) {
              return win ? win[prop] : elem[method2];
            }
            if (win) {
              win.scrollTo(
                !top ? val2 : win.pageXOffset,
                top ? val2 : win.pageYOffset
              );
            } else {
              elem[method2] = val2;
            }
          }, method, val, arguments.length);
        };
      });
      jQuery.each(["top", "left"], function(_i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(
          support.pixelPosition,
          function(elem, computed) {
            if (computed) {
              computed = curCSS(elem, prop);
              return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
            }
          }
        );
      });
      jQuery.each({ Height: "height", Width: "width" }, function(name, type) {
        jQuery.each({
          padding: "inner" + name,
          content: type,
          "": "outer" + name
        }, function(defaultExtra, funcName) {
          jQuery.fn[funcName] = function(margin, value) {
            var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
            return access(this, function(elem, type2, value2) {
              var doc;
              if (isWindow(elem)) {
                return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
              }
              if (elem.nodeType === 9) {
                doc = elem.documentElement;
                return Math.max(
                  elem.body["scroll" + name],
                  doc["scroll" + name],
                  elem.body["offset" + name],
                  doc["offset" + name],
                  doc["client" + name]
                );
              }
              return value2 === void 0 ? (
                // Get width or height on the element, requesting but not forcing parseFloat
                jQuery.css(elem, type2, extra)
              ) : (
                // Set width or height on the element
                jQuery.style(elem, type2, value2, extra)
              );
            }, type, chainable ? margin : void 0, chainable);
          };
        });
      });
      jQuery.each([
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend"
      ], function(_i, type) {
        jQuery.fn[type] = function(fn) {
          return this.on(type, fn);
        };
      });
      jQuery.fn.extend({
        bind: function(types, data, fn) {
          return this.on(types, null, data, fn);
        },
        unbind: function(types, fn) {
          return this.off(types, null, fn);
        },
        delegate: function(selector, types, data, fn) {
          return this.on(types, selector, data, fn);
        },
        undelegate: function(selector, types, fn) {
          return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        },
        hover: function(fnOver, fnOut) {
          return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver);
        }
      });
      jQuery.each(
        "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
        function(_i, name) {
          jQuery.fn[name] = function(data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
          };
        }
      );
      var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
      jQuery.proxy = function(fn, context) {
        var tmp, args, proxy;
        if (typeof context === "string") {
          tmp = fn[context];
          context = fn;
          fn = tmp;
        }
        if (!isFunction(fn)) {
          return void 0;
        }
        args = slice.call(arguments, 2);
        proxy = function() {
          return fn.apply(context || this, args.concat(slice.call(arguments)));
        };
        proxy.guid = fn.guid = fn.guid || jQuery.guid++;
        return proxy;
      };
      jQuery.holdReady = function(hold) {
        if (hold) {
          jQuery.readyWait++;
        } else {
          jQuery.ready(true);
        }
      };
      jQuery.isArray = Array.isArray;
      jQuery.parseJSON = JSON.parse;
      jQuery.nodeName = nodeName;
      jQuery.isFunction = isFunction;
      jQuery.isWindow = isWindow;
      jQuery.camelCase = camelCase;
      jQuery.type = toType;
      jQuery.now = Date.now;
      jQuery.isNumeric = function(obj) {
        var type = jQuery.type(obj);
        return (type === "number" || type === "string") && // parseFloat NaNs numeric-cast false positives ("")
        // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
        // subtraction forces infinities to NaN
        !isNaN(obj - parseFloat(obj));
      };
      jQuery.trim = function(text) {
        return text == null ? "" : (text + "").replace(rtrim, "$1");
      };
      var _jQuery = window2.jQuery, _$ = window2.$;
      jQuery.noConflict = function(deep) {
        if (window2.$ === jQuery) {
          window2.$ = _$;
        }
        if (deep && window2.jQuery === jQuery) {
          window2.jQuery = _jQuery;
        }
        return jQuery;
      };
      if (typeof noGlobal === "undefined") {
        window2.jQuery = window2.$ = jQuery;
      }
      return jQuery;
    });
  })(jquery);
  var jqueryExports = jquery.exports;
  const $ = /* @__PURE__ */ getDefaultExportFromCjs(jqueryExports);
  function calculateImageSize(originalWidth, originalHeight) {
    var aspectRatio = originalWidth / originalHeight;
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var newWidth, newHeight;
    if (viewportWidth / viewportHeight > aspectRatio) {
      newWidth = viewportHeight * aspectRatio;
      newHeight = viewportHeight;
    } else {
      newWidth = viewportWidth;
      newHeight = viewportWidth / aspectRatio;
    }
    return { width: newWidth, height: newHeight };
  }
  function openSwipe(dataSource, index = 0) {
    var lightbox = new PhotoSwipeLightbox({
      dataSource: dataSource.map((item) => ({
        ...item,
        ...calculateImageSize(item.width, item.height)
      })),
      // dynamic import is not supported in UMD version
      pswpModule: PhotoSwipe,
      wheelToZoom: true,
      pinchToClose: false,
      imageClickAction: "next",
      //                 tapAction: 'next',
      showHideAnimationType: "none"
    });
    lightbox.loadAndOpen(index);
  }
  function onImgSwipe(parentClassName) {
    document.body.addEventListener(
      "click",
      (e) => {
        const $el = $(e.target);
        if ($el.is("img") && $el.parents(parentClassName).length) {
          const $imgs = $el.parents(parentClassName).find("img");
          const index = $imgs.index($el);
          const imgs = $imgs.get().map((img) => {
            console.log(img);
            return {
              src: img.src,
              width: img.width,
              height: img.height
            };
          });
          openSwipe(imgs, index);
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
      },
      true
    );
  }
  function injectImageHelper() {
    onImgSwipe(".pbw");
    onImgSwipe("#imgbox_td");
  }
  injectImageHelper();

})();