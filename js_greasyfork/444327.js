// ==UserScript==
// @name         ABEMA ニコニコ風コメント
// @namespace    https://midra.me
// @version      1.0.3
// @description  ABEMAのコメントをニコニコ風に流すやつ
// @author       Midra
// @license      MIT
// @match        https://abema.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=abema.tv
// @run-at       document-end
// @noframes
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM.addStyle
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      abema.tv
// @downloadURL https://update.greasyfork.org/scripts/444327/ABEMA%20%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%A2%A8%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/444327/ABEMA%20%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%A2%A8%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88.meta.js
// ==/UserScript==

"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateSet = (obj, member, value, setter) => {
    __accessCheck(obj, member, "write to private field");
    setter ? setter.call(obj, value) : member.set(obj, value);
    return value;
  };
  var __privateWrapper = (obj, member, setter, getter) => ({
    set _(value) {
      __privateSet(obj, member, value, setter);
    },
    get _() {
      return __privateGet(obj, member, getter);
    }
  });
  var __privateMethod = (obj, member, method) => {
    __accessCheck(obj, member, "access private method");
    return method;
  };

  // ../../Library/FlowComments/src/constants.ts
  var CONFIG = {
    FONT_FAMILY: [
      "Arial",
      '"\uFF2D\uFF33 \uFF30\u30B4\u30B7\u30C3\u30AF"',
      "MS PGothic",
      '"\u30D2\u30E9\u30AE\u30CE\u89D2\u30B4\u30B7\u30C3\u30AF"',
      '"Hiragino Sans"',
      "Gulim",
      '"Malgun Gothic"',
      '"\u9ED1\u4F53"',
      "SimHei",
      "system-ui",
      "-apple-system",
      "sans-serif"
    ].join(),
    FONT_WEIGHT: "600",
    FONT_SCALE: 0.7,
    FONT_OFFSET_Y: 0.15,
    TEXT_COLOR: "#fff",
    TEXT_SHADOW_COLOR: "#000",
    TEXT_SHADOW_BLUR: 1,
    TEXT_MARGIN: 0.2,
    CANVAS_CLASSNAME: "mid-FlowComments",
    CANVAS_RATIO: 16 / 9,
    CANVAS_RESOLUTION: 720,
    RESOLUTION_LIST: [240, 360, 480, 720],
    CMT_DISPLAY_DURATION: 6e3,
    CMT_LIMIT: 0,
    LINES: 11,
    AUTO_RESIZE: true,
    AUTO_RESOLUTION: true
  };
  var ITEM_DEFAULT_OPTION = {
    position: 0 /* FLOW */,
    duration: CONFIG.CMT_DISPLAY_DURATION
  };
  var DEFAULT_OPTION = {
    resolution: CONFIG.CANVAS_RESOLUTION,
    lines: CONFIG.LINES,
    limit: CONFIG.CMT_LIMIT,
    autoResize: CONFIG.AUTO_RESIZE,
    autoResolution: CONFIG.AUTO_RESOLUTION,
    smoothRender: false
  };
  var DEFAULT_STYLE = {
    fontFamily: CONFIG.FONT_FAMILY,
    fontWeight: CONFIG.FONT_WEIGHT,
    fontScale: 1,
    color: CONFIG.TEXT_COLOR,
    shadowColor: CONFIG.TEXT_SHADOW_COLOR,
    shadowBlur: CONFIG.TEXT_SHADOW_BLUR,
    opacity: 1
  };

  // ../../Library/FlowComments/src/modules/core.ts
  var core_exports = {};
  __export(core_exports, {
    Image: () => Image2,
    Item: () => Item,
    Main: () => Main,
    Util: () => Util
  });

  // ../../Library/FlowComments/src/modules/util.ts
  var Util = class {
    static filterObject(obj) {
      if (obj !== void 0 && obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
        Object.keys(obj).forEach((key) => {
          if (obj[key] === void 0 || obj[key] === null) {
            delete obj[key];
          } else {
            this.filterObject(obj[key]);
          }
        });
      }
    }
    static setStyleToCanvas(ctx, style, fontSize) {
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.font = `${style.fontWeight} ${fontSize * style.fontScale}px ${style.fontFamily}`;
      ctx.fillStyle = style.color;
      ctx.shadowColor = style.shadowColor;
      ctx.shadowBlur = fontSize / 16 * style.shadowBlur;
      ctx.globalAlpha = style.opacity;
    }
  };

  // ../../Library/FlowComments/src/modules/imageCache.ts
  var _OPTION, _cache;
  var ImageCache = class {
    static add(url, img) {
      if (__privateGet(this, _OPTION).maxSize < Object.keys(__privateGet(this, _cache)).length) {
        let delCacheUrl;
        Object.keys(__privateGet(this, _cache)).forEach((key) => {
          if (delCacheUrl === void 0 || __privateGet(this, _cache)[key].lastUsed < __privateGet(this, _cache)[delCacheUrl].lastUsed) {
            delCacheUrl = key;
          }
        });
        this.dispose(delCacheUrl);
      }
      __privateGet(this, _cache)[url] = {
        img,
        lastUsed: Date.now()
      };
    }
    static has(url) {
      return url !== void 0 && __privateGet(this, _cache).hasOwnProperty(url);
    }
    static async get(url) {
      return new Promise(async (resolve, reject) => {
        if (this.has(url)) {
          __privateGet(this, _cache)[url].lastUsed = Date.now();
          resolve(__privateGet(this, _cache)[url].img);
        } else {
          try {
            let img = new Image();
            img.addEventListener("load", ({ target }) => {
              if (target instanceof HTMLImageElement) {
                this.add(target.src, target);
                resolve(__privateGet(this, _cache)[target.src].img);
              } else {
                reject();
              }
            });
            img.addEventListener("error", reject);
            img.src = url;
            img = null;
          } catch (e) {
            reject(e);
          }
        }
      });
    }
    static dispose(url) {
      if (url !== void 0 && this.has(url)) {
        __privateGet(this, _cache)[url].img.remove();
        delete __privateGet(this, _cache)[url];
      }
    }
  };
  _OPTION = new WeakMap();
  _cache = new WeakMap();
  __privateAdd(ImageCache, _OPTION, {
    maxSize: 50
  });
  __privateAdd(ImageCache, _cache, {});

  // ../../Library/FlowComments/src/modules/image.ts
  var Image2 = class {
    constructor(url, alt) {
      this._url = url;
      this._alt = alt || "";
    }
    get url() {
      return this._url;
    }
    get alt() {
      return this._alt;
    }
    async get() {
      try {
        return await ImageCache.get(this._url);
      } catch (e) {
        return this._alt;
      }
    }
  };

  // ../../Library/FlowComments/src/modules/item.ts
  var Item = class {
    constructor(id, content, option, style) {
      this.position = {
        x: 0,
        y: 0,
        xp: 0,
        offsetY: 0
      };
      this.size = {
        width: 0,
        height: 0
      };
      this.scrollWidth = 0;
      this.line = 0;
      Util.filterObject(option);
      Util.filterObject(style);
      this._id = id;
      this._content = Array.isArray(content) ? content.filter((v) => v) : content;
      this._option = { ...ITEM_DEFAULT_OPTION, ...option };
      if (this._option.position === 0 /* FLOW */) {
        this._actualDuration = this._option.duration * 1.5;
      } else {
        this._actualDuration = this._option.duration;
      }
      this._style = style;
      this._canvas = document.createElement("canvas");
    }
    get id() {
      return this._id;
    }
    get content() {
      return this._content;
    }
    get style() {
      return this._style;
    }
    get option() {
      return this._option;
    }
    get actualDuration() {
      return this._actualDuration;
    }
    get canvas() {
      return this._canvas;
    }
    get top() {
      return this.position?.y || 0;
    }
    get bottom() {
      return this.position !== void 0 && this.size !== void 0 ? this.position.y + this.size.height : 0;
    }
    get left() {
      return this.position?.x || 0;
    }
    get right() {
      return this.position !== void 0 && this.size !== void 0 ? this.position.x + this.size.width : 0;
    }
    get rect() {
      return {
        width: this.size?.width || 0,
        height: this.size?.height || 0,
        top: this.top,
        bottom: this.bottom,
        left: this.left,
        right: this.right
      };
    }
    dispose() {
      this._canvas?.remove();
    }
  };

  // ../../Library/FlowComments/src/modules/main.ts
  var _id_cnt, _updateCommentsStyle, updateCommentsStyle_fn, _floor, floor_fn, _initializeComment, initializeComment_fn, _renderComment, renderComment_fn, _update, update_fn, _loop, loop_fn;
  var _Main = class {
    constructor(option, style) {
      __privateAdd(this, _updateCommentsStyle);
      __privateAdd(this, _floor);
      __privateAdd(this, _initializeComment);
      __privateAdd(this, _renderComment);
      __privateAdd(this, _update);
      __privateAdd(this, _loop);
      this.initialize(option, style);
    }
    get id() {
      return this._id;
    }
    get style() {
      return { ...DEFAULT_STYLE, ...this._style };
    }
    get option() {
      return { ...DEFAULT_OPTION, ...this._option };
    }
    get canvas() {
      return this._canvas;
    }
    get context2d() {
      return this._context2d;
    }
    get comments() {
      return this._comments;
    }
    get lineHeight() {
      return this._canvas instanceof HTMLCanvasElement ? this._canvas.height / this.option.lines : 0;
    }
    get fontSize() {
      return this.lineHeight * CONFIG.FONT_SCALE;
    }
    get isStarted() {
      return this._animReqId !== void 0;
    }
    initialize(option, style) {
      this.dispose();
      this._id = ++__privateWrapper(_Main, _id_cnt)._;
      this._canvas = document.createElement("canvas");
      this._canvas.classList.add(CONFIG.CANVAS_CLASSNAME);
      this._canvas.dataset.fcid = this._id.toString();
      this._context2d = this._canvas.getContext("2d");
      this._comments = [];
      this._resizeObs = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if (this._canvas === void 0)
            return;
          const { width, height } = entry.contentRect;
          if (this.option.autoResize) {
            const rect_before = this._canvas.width / this._canvas.height;
            const rect_resized = width / height;
            if (0.01 < Math.abs(rect_before - rect_resized)) {
              this.resizeCanvas();
            }
          }
          if (this.option.autoResolution) {
            const resolution = CONFIG.RESOLUTION_LIST.find((v) => height <= v);
            if (Number.isFinite(resolution) && this.option.resolution !== resolution) {
              this.changeOption({ resolution });
            }
          }
        });
      });
      this._resizeObs.observe(this._canvas);
      this.changeOption(option);
      this.changeStyle(style);
    }
    changeOption(option) {
      Util.filterObject(option);
      this._option = { ...this._option, ...option };
      if (option !== void 0 && option !== null) {
        this.resizeCanvas();
      }
    }
    changeStyle(style) {
      Util.filterObject(style);
      this._style = { ...this._style, ...style };
      if (style !== void 0 && style !== null) {
        __privateMethod(this, _updateCommentsStyle, updateCommentsStyle_fn).call(this);
      }
    }
    resizeCanvas() {
      const { width, height } = this._canvas.getBoundingClientRect();
      const { resolution } = this.option;
      const ratio = width === 0 && height === 0 ? CONFIG.CANVAS_RATIO : width / height;
      this._canvas.width = resolution * ratio;
      this._canvas.height = resolution;
      __privateMethod(this, _updateCommentsStyle, updateCommentsStyle_fn).call(this);
    }
    resetCanvasStyle() {
      this.changeStyle(DEFAULT_STYLE);
    }
    async pushComment(comment) {
      if (this.isStarted === false || document.visibilityState === "hidden")
        return;
      if (0 < this.option.limit && this.option.limit <= this._comments.length) {
        this._comments.splice(0, this._comments.length - this.option.limit)[0];
      }
      await __privateMethod(this, _initializeComment, initializeComment_fn).call(this, comment);
      const spd_pushCmt = comment.scrollWidth / comment.option.duration;
      const lines_over = [...Array(this.option.lines)].map((_, i) => [i, 0]);
      this._comments.forEach((cmt) => {
        const leftTime = cmt.option.duration * (1 - cmt.position.xp);
        const isOver = comment.left - spd_pushCmt * leftTime <= 0 || comment.left <= cmt.right;
        if (isOver && cmt.line < this.option.lines) {
          lines_over[cmt.line][1]++;
        }
      });
      const lines_sort = lines_over.sort(([, cntA], [, cntB]) => cntA - cntB);
      comment.line = lines_sort[0][0];
      comment.position.y = this.lineHeight * comment.line;
      this._comments.push(comment);
    }
    start() {
      if (this._animReqId === void 0) {
        this._animReqId = window.requestAnimationFrame(__privateMethod(this, _loop, loop_fn).bind(this));
      }
    }
    stop() {
      if (this._animReqId !== void 0) {
        window.cancelAnimationFrame(this._animReqId);
        delete this._animReqId;
      }
    }
    dispose() {
      this.stop();
      this._canvas?.remove();
      this._resizeObs?.disconnect();
    }
  };
  var Main = _Main;
  _id_cnt = new WeakMap();
  _updateCommentsStyle = new WeakSet();
  updateCommentsStyle_fn = function() {
    this._context2d?.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._comments.forEach((cmt) => {
      __privateMethod(this, _initializeComment, initializeComment_fn).call(this, cmt);
      __privateMethod(this, _renderComment, renderComment_fn).call(this, cmt);
    });
  };
  _floor = new WeakSet();
  floor_fn = function(num) {
    return this._option?.smoothRender ? num : num | 0;
  };
  _initializeComment = new WeakSet();
  initializeComment_fn = async function(comment) {
    const ctx = comment.canvas.getContext("2d");
    if (ctx === null)
      return;
    ctx.clearRect(0, 0, comment.canvas.width, comment.canvas.height);
    const style = { ...this.style, ...comment.style };
    const drawFontSize = this.fontSize * style.fontScale;
    const margin = drawFontSize * CONFIG.TEXT_MARGIN;
    Util.setStyleToCanvas(ctx, style, this.fontSize);
    const aryWidth = [];
    for (const cont of comment.content) {
      if (typeof cont === "string") {
        aryWidth.push(ctx.measureText(cont).width);
      } else if (cont instanceof Image2) {
        const img = await cont.get();
        if (img instanceof HTMLImageElement) {
          const ratio = img.width / img.height;
          aryWidth.push(drawFontSize * ratio);
        } else if (img !== void 0) {
          aryWidth.push(ctx.measureText(img).width);
        } else {
          aryWidth.push(1);
        }
      }
    }
    comment.size.width = aryWidth.reduce((a, b) => a + b);
    comment.size.width += margin * (aryWidth.length - 1);
    comment.size.height = this.lineHeight;
    comment.scrollWidth = this._canvas.width + comment.size.width;
    comment.position.x = this._canvas.width - comment.scrollWidth * comment.position.xp;
    comment.position.y = this.lineHeight * comment.line;
    comment.position.offsetY = this.lineHeight / 2 * (1 + CONFIG.FONT_OFFSET_Y);
    comment.canvas.width = comment.size.width;
    comment.canvas.height = comment.size.height;
    Util.setStyleToCanvas(ctx, style, this.fontSize);
    let dx = 0;
    for (let idx = 0; idx < comment.content.length; idx++) {
      if (0 < idx) {
        dx += margin;
      }
      const cont = comment.content[idx];
      if (typeof cont === "string") {
        ctx.fillText(
          cont,
          __privateMethod(this, _floor, floor_fn).call(this, dx),
          __privateMethod(this, _floor, floor_fn).call(this, comment.position.offsetY)
        );
      } else if (cont instanceof Image2) {
        const img = await cont.get();
        if (img instanceof HTMLImageElement) {
          ctx.drawImage(
            img,
            __privateMethod(this, _floor, floor_fn).call(this, dx),
            __privateMethod(this, _floor, floor_fn).call(this, (comment.size.height - drawFontSize) / 2),
            __privateMethod(this, _floor, floor_fn).call(this, aryWidth[idx]),
            __privateMethod(this, _floor, floor_fn).call(this, drawFontSize)
          );
        } else if (img !== void 0) {
          ctx.fillText(
            img,
            __privateMethod(this, _floor, floor_fn).call(this, dx),
            __privateMethod(this, _floor, floor_fn).call(this, comment.position.offsetY)
          );
        } else {
          ctx.fillText(
            "",
            __privateMethod(this, _floor, floor_fn).call(this, dx),
            __privateMethod(this, _floor, floor_fn).call(this, comment.position.offsetY)
          );
        }
      }
      dx += aryWidth[idx];
    }
  };
  _renderComment = new WeakSet();
  renderComment_fn = function(comment) {
    this._context2d?.drawImage(
      comment.canvas,
      __privateMethod(this, _floor, floor_fn).call(this, comment.position.x),
      __privateMethod(this, _floor, floor_fn).call(this, comment.position.y)
    );
  };
  _update = new WeakSet();
  update_fn = function(time) {
    this._context2d?.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._comments.forEach((cmt, idx, ary) => {
      if (cmt.startTime === void 0) {
        cmt.startTime = time;
      }
      const elapsedTime = time - cmt.startTime;
      if (elapsedTime <= cmt.actualDuration) {
        if (cmt.option.position === 0 /* FLOW */) {
          cmt.position.xp = elapsedTime / cmt.option.duration;
          cmt.position.x = this._canvas.width - cmt.scrollWidth * cmt.position.xp;
        }
        __privateMethod(this, _renderComment, renderComment_fn).call(this, cmt);
      } else {
        cmt.dispose();
        ary.splice(idx, 1)[0];
      }
    });
  };
  _loop = new WeakSet();
  loop_fn = function(time) {
    __privateMethod(this, _update, update_fn).call(this, time);
    if (this._animReqId !== void 0) {
      this._animReqId = window.requestAnimationFrame(__privateMethod(this, _loop, loop_fn).bind(this));
    }
  };
  __privateAdd(Main, _id_cnt, 0);

  // src/constants.ts
  var STYLE = `
.mid-FlowComments {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
`;

  // src/utils/getDataFromElement.ts
  var getDataFromElement = (element) => {
    const text = element.querySelector(".com-tv-CommentBlock__message, .com-comment-CommentItem__body")?.textContent?.trim();
    const datetime = Number(element.querySelector(".com-tv-CommentBlock__time")?.getAttribute("datetime"));
    const result = {};
    if (typeof text === "string") {
      result["text"] = text;
    }
    if (Number.isFinite(datetime)) {
      result["date"] = new Date(datetime);
    }
    return result;
  };
  var getDataFromElement_default = getDataFromElement;

  // src/utils/injectStyle.ts
  var injectStyle = (css) => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  };
  var injectStyle_default = injectStyle;

  // src/index.ts
  (async () => {
    injectStyle_default(STYLE);
    let fc = null;
    let timeoutIds = [];
    const obs_opt = {
      childList: true,
      subtree: true
    };
    const obs = new MutationObserver((mutationRecord) => {
      const comments = [];
      for (const { addedNodes, removedNodes } of mutationRecord) {
        for (const added of addedNodes) {
          if (!(added instanceof HTMLElement))
            continue;
          if (added.classList.contains("com-tv-CommentBlock--new") || added.classList.contains("com-comment-CommentItem")) {
            const data = getDataFromElement_default(added);
            if (data !== void 0) {
              comments.push(data);
            }
          }
        }
        for (const removed of removedNodes) {
          if (!(removed instanceof HTMLElement))
            continue;
          if (removed.classList.contains("com-a-Video__video") || removed.classList.contains("com-vod-VODResponsiveMainContent")) {
            timeoutIds.forEach((id) => clearTimeout(id));
            timeoutIds = [];
            fc?.dispose();
            fc = null;
          }
        }
      }
      if (0 < comments.length) {
        if (fc === null) {
          const video = document.querySelector(".com-a-Video__video, .com-live-event__LiveEventPlayerView");
          if (video instanceof HTMLElement) {
            fc = new core_exports.Main({
              autoResize: true,
              autoResolution: false,
              lines: 12,
              resolution: 720,
              smoothRender: false
            });
            video.insertAdjacentElement("afterend", fc.canvas);
            fc.start();
          }
        }
        if (comments.length === 1) {
          if (typeof comments[0].text === "string") {
            fc.pushComment(new core_exports.Item(Symbol(), [comments[0].text]));
          }
        } else {
          const cmtTimeA = comments[0].date?.getTime();
          const cmtTimeB = comments[comments.length - 1].date?.getTime();
          const diff = Number.isFinite(cmtTimeA) && Number.isFinite(cmtTimeB) ? cmtTimeB - cmtTimeA : null;
          comments.forEach((comment, idx) => {
            let timeout = 0;
            if (diff !== null) {
              timeout = (comment.date.getTime() - cmtTimeA) / diff * 8e3;
            } else {
              timeout = idx / comments.length * 8e3;
            }
            timeoutIds.push(
              setTimeout((text) => {
                fc?.pushComment(new core_exports.Item(Symbol(), [text]));
              }, timeout, comment.text)
            );
          });
        }
      }
    });
    obs.observe(document.body, obs_opt);
  })();
})();
