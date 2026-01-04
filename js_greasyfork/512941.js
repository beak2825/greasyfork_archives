// ==UserScript==
// @name         pornHelper
// @namespace    npm/vite-plugin-monkey
// @version      1.0.0
// @author       Kin
// @description  下载PornHub视频和封面
// @license      MIT
// @icon         https://pornhub.com/favicon.ico
// @homepage     https://github.com/Yorushika-fan/pornHelper
// @match        *://*.pornhub.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.12/dist/vue.global.prod.js
// @require      https://unpkg.com/vue-demi@latest/lib/index.iife.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.8.5/dist/index.full.min.js
// @resource     ElementPlus  https://cdn.jsdelivr.net/npm/element-plus@2.8.5/dist/index.full.min.css
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/512941/pornHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/512941/pornHelper.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const r=document.createElement("style");r.textContent=t,document.head.append(r)})(" *,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }.fixed{position:fixed}.right-4{right:1rem}.top-16{top:4rem}.z-10{z-index:10}.mb-4{margin-bottom:1rem}.flex{display:flex}.flex-grow{flex-grow:1}.flex-row{flex-direction:row}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse: 0;margin-right:calc(.5rem * var(--tw-space-x-reverse));margin-left:calc(.5rem * calc(1 - var(--tw-space-x-reverse)))}.\\!rounded-lg{border-radius:.5rem!important}.rounded{border-radius:.25rem}.\\!bg-\\[\\#ff9900\\]{--tw-bg-opacity: 1 !important;background-color:rgb(255 153 0 / var(--tw-bg-opacity))!important}.\\!bg-gray-200{--tw-bg-opacity: 1 !important;background-color:rgb(229 231 235 / var(--tw-bg-opacity))!important}.bg-blue-500{--tw-bg-opacity: 1;background-color:rgb(59 130 246 / var(--tw-bg-opacity))}.bg-green-500{--tw-bg-opacity: 1;background-color:rgb(34 197 94 / var(--tw-bg-opacity))}.\\!py-3{padding-top:.75rem!important;padding-bottom:.75rem!important}.px-4{padding-left:1rem;padding-right:1rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.\\!text-base{font-size:1rem!important;line-height:1.5rem!important}.\\!font-bold{font-weight:700!important}.font-bold{font-weight:700}.\\!text-black{--tw-text-opacity: 1 !important;color:rgb(0 0 0 / var(--tw-text-opacity))!important}.\\!text-gray-700{--tw-text-opacity: 1 !important;color:rgb(55 65 81 / var(--tw-text-opacity))!important}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity))}.shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.\\!transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke!important;transition-timing-function:cubic-bezier(.4,0,.2,1)!important;transition-duration:.15s!important}.hover\\:\\!bg-\\[\\#ff6600\\]:hover{--tw-bg-opacity: 1 !important;background-color:rgb(255 102 0 / var(--tw-bg-opacity))!important}.hover\\:\\!bg-gray-300:hover{--tw-bg-opacity: 1 !important;background-color:rgb(209 213 219 / var(--tw-bg-opacity))!important}.hover\\:bg-blue-600:hover{--tw-bg-opacity: 1;background-color:rgb(37 99 235 / var(--tw-bg-opacity))}.hover\\:bg-green-600:hover{--tw-bg-opacity: 1;background-color:rgb(22 163 74 / var(--tw-bg-opacity))} ");

(function (vue, elementPlus) {
  'use strict';

  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("ElementPlus");
  var _GM_download = /* @__PURE__ */ (() => typeof GM_download != "undefined" ? GM_download : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var _a;
  const isClient = typeof window !== "undefined";
  const isString = (val) => typeof val === "string";
  const noop = () => {
  };
  isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
  function resolveUnref(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }
  function createFilterWrapper(filter, fn) {
    function wrapper(...args) {
      return new Promise((resolve, reject) => {
        Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
      });
    }
    return wrapper;
  }
  function throttleFilter(ms, trailing = true, leading = true, rejectOnCancel = false) {
    let lastExec = 0;
    let timer;
    let isLeading = true;
    let lastRejector = noop;
    let lastValue;
    const clear = () => {
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
        lastRejector();
        lastRejector = noop;
      }
    };
    const filter = (_invoke) => {
      const duration = resolveUnref(ms);
      const elapsed = Date.now() - lastExec;
      const invoke = () => {
        return lastValue = _invoke();
      };
      clear();
      if (duration <= 0) {
        lastExec = Date.now();
        return invoke();
      }
      if (elapsed > duration && (leading || !isLeading)) {
        lastExec = Date.now();
        invoke();
      } else if (trailing) {
        lastValue = new Promise((resolve, reject) => {
          lastRejector = rejectOnCancel ? reject : resolve;
          timer = setTimeout(() => {
            lastExec = Date.now();
            isLeading = true;
            resolve(invoke());
            clear();
          }, Math.max(0, duration - elapsed));
        });
      }
      if (!leading && !timer)
        timer = setTimeout(() => isLeading = true, duration);
      isLeading = false;
      return lastValue;
    };
    return filter;
  }
  function identity(arg) {
    return arg;
  }
  function tryOnScopeDispose(fn) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn);
      return true;
    }
    return false;
  }
  function useThrottleFn(fn, ms = 200, trailing = false, leading = true, rejectOnCancel = false) {
    return createFilterWrapper(throttleFilter(ms, trailing, leading, rejectOnCancel), fn);
  }
  function tryOnMounted(fn, sync = true) {
    if (vue.getCurrentInstance())
      vue.onMounted(fn);
    else if (sync)
      fn();
    else
      vue.nextTick(fn);
  }
  function useTimeoutFn(cb, interval, options = {}) {
    const {
      immediate = true
    } = options;
    const isPending = vue.ref(false);
    let timer = null;
    function clear() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
    function stop() {
      isPending.value = false;
      clear();
    }
    function start(...args) {
      clear();
      isPending.value = true;
      timer = setTimeout(() => {
        isPending.value = false;
        timer = null;
        cb(...args);
      }, resolveUnref(interval));
    }
    if (immediate) {
      isPending.value = true;
      if (isClient)
        start();
    }
    tryOnScopeDispose(stop);
    return {
      isPending: vue.readonly(isPending),
      start,
      stop
    };
  }
  function unrefElement(elRef) {
    var _a2;
    const plain = resolveUnref(elRef);
    return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
  }
  const defaultWindow = isClient ? window : void 0;
  const defaultNavigator = isClient ? window.navigator : void 0;
  function useEventListener(...args) {
    let target;
    let events;
    let listeners;
    let options;
    if (isString(args[0]) || Array.isArray(args[0])) {
      [events, listeners, options] = args;
      target = defaultWindow;
    } else {
      [target, events, listeners, options] = args;
    }
    if (!target)
      return noop;
    if (!Array.isArray(events))
      events = [events];
    if (!Array.isArray(listeners))
      listeners = [listeners];
    const cleanups = [];
    const cleanup = () => {
      cleanups.forEach((fn) => fn());
      cleanups.length = 0;
    };
    const register = (el, event, listener, options2) => {
      el.addEventListener(event, listener, options2);
      return () => el.removeEventListener(event, listener, options2);
    };
    const stopWatch = vue.watch(() => [unrefElement(target), resolveUnref(options)], ([el, options2]) => {
      cleanup();
      if (!el)
        return;
      cleanups.push(...events.flatMap((event) => {
        return listeners.map((listener) => register(el, event, listener, options2));
      }));
    }, { immediate: true, flush: "post" });
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return stop;
  }
  function useSupported(callback, sync = false) {
    const isSupported = vue.ref();
    const update = () => isSupported.value = Boolean(callback());
    update();
    tryOnMounted(update, sync);
    return isSupported;
  }
  function useClipboard(options = {}) {
    const {
      navigator = defaultNavigator,
      read = false,
      source,
      copiedDuring = 1500,
      legacy = false
    } = options;
    const events = ["copy", "cut"];
    const isClipboardApiSupported = useSupported(() => navigator && "clipboard" in navigator);
    const isSupported = vue.computed(() => isClipboardApiSupported.value || legacy);
    const text = vue.ref("");
    const copied = vue.ref(false);
    const timeout = useTimeoutFn(() => copied.value = false, copiedDuring);
    function updateText() {
      if (isClipboardApiSupported.value) {
        navigator.clipboard.readText().then((value) => {
          text.value = value;
        });
      } else {
        text.value = legacyRead();
      }
    }
    if (isSupported.value && read) {
      for (const event of events)
        useEventListener(event, updateText);
    }
    async function copy(value = resolveUnref(source)) {
      if (isSupported.value && value != null) {
        if (isClipboardApiSupported.value)
          await navigator.clipboard.writeText(value);
        else
          legacyCopy(value);
        text.value = value;
        copied.value = true;
        timeout.start();
      }
    }
    function legacyCopy(value) {
      const ta = document.createElement("textarea");
      ta.value = value != null ? value : "";
      ta.style.position = "absolute";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    function legacyRead() {
      var _a2, _b, _c;
      return (_c = (_b = (_a2 = document == null ? void 0 : document.getSelection) == null ? void 0 : _a2.call(document)) == null ? void 0 : _b.toString()) != null ? _c : "";
    }
    return {
      isSupported,
      text,
      copied,
      copy
    };
  }
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  _global[globalKey] = _global[globalKey] || {};
  var SwipeDirection;
  (function(SwipeDirection2) {
    SwipeDirection2["UP"] = "UP";
    SwipeDirection2["RIGHT"] = "RIGHT";
    SwipeDirection2["DOWN"] = "DOWN";
    SwipeDirection2["LEFT"] = "LEFT";
    SwipeDirection2["NONE"] = "NONE";
  })(SwipeDirection || (SwipeDirection = {}));
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  const _TransitionPresets = {
    easeInSine: [0.12, 0, 0.39, 0],
    easeOutSine: [0.61, 1, 0.88, 1],
    easeInOutSine: [0.37, 0, 0.63, 1],
    easeInQuad: [0.11, 0, 0.5, 0],
    easeOutQuad: [0.5, 1, 0.89, 1],
    easeInOutQuad: [0.45, 0, 0.55, 1],
    easeInCubic: [0.32, 0, 0.67, 0],
    easeOutCubic: [0.33, 1, 0.68, 1],
    easeInOutCubic: [0.65, 0, 0.35, 1],
    easeInQuart: [0.5, 0, 0.75, 0],
    easeOutQuart: [0.25, 1, 0.5, 1],
    easeInOutQuart: [0.76, 0, 0.24, 1],
    easeInQuint: [0.64, 0, 0.78, 0],
    easeOutQuint: [0.22, 1, 0.36, 1],
    easeInOutQuint: [0.83, 0, 0.17, 1],
    easeInExpo: [0.7, 0, 0.84, 0],
    easeOutExpo: [0.16, 1, 0.3, 1],
    easeInOutExpo: [0.87, 0, 0.13, 1],
    easeInCirc: [0.55, 0, 1, 0.45],
    easeOutCirc: [0, 0.55, 0.45, 1],
    easeInOutCirc: [0.85, 0, 0.15, 1],
    easeInBack: [0.36, 0, 0.66, -0.56],
    easeOutBack: [0.34, 1.56, 0.64, 1],
    easeInOutBack: [0.68, -0.6, 0.32, 1.6]
  };
  __spreadValues({
    linear: identity
  }, _TransitionPresets);
  const _hoisted_1 = {
    key: 0,
    class: "fixed top-16 right-4 flex flex-row space-x-2 z-10"
  };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "pornhub",
    setup(__props) {
      const isDownloadingVideo = vue.ref(false);
      const isDownloadingCover = vue.ref(false);
      const downloadProgress = vue.ref(0);
      const isDownloading = vue.ref(false);
      vue.onMounted(() => {
        console.log("脚本已加载");
        console.log(`
    ____                  _   _       _     
   |  _ \\ ___  _ __ _ __ | | | |_   _| |__  
   | |_) / _ \\| '__| '_ \\| |_| | | | | '_ \\ 
   |  __/ (_) | |  | | | |  _  | |_| | |_) |
   |_|   \\___/|_|  |_| |_|_| |_|\\__,_|_.__/ 
  `);
      });
      const videoList = vue.ref([]);
      const { copy } = useClipboard();
      const getFlashVars = () => {
        const flashvarsRegex = /flashvars_\d+/;
        const flashvarsKey = Object.keys(_unsafeWindow).find((key) => flashvarsRegex.test(key));
        if (flashvarsKey) {
          return _unsafeWindow[flashvarsKey];
        }
        return null;
      };
      const getVideoInfo = () => {
        videoList.value = [];
        console.log(videoList.value);
        const flashvars = getFlashVars();
        if (flashvars) {
          const mediaDefinitions = flashvars.mediaDefinitions;
          Object.values(mediaDefinitions).forEach((media) => {
            if (media.format === "mp4") {
              _GM_xmlhttpRequest({
                url: media.videoUrl,
                method: "GET",
                responseType: "json",
                onload: (response) => {
                  response.response.forEach((res) => {
                    videoList.value.push({
                      videoUrl: res.videoUrl,
                      quality: res.quality
                    });
                  });
                },
                ontimeout: () => elementPlus.ElMessage.error("请求视频超时,请稍后再试"),
                onerror: () => elementPlus.ElMessage.error("请求视频失败,请稍后再试")
              });
            }
          });
          isDownloadingVideo.value = true;
        } else {
          elementPlus.ElMessage.error("没有找到flashvars");
        }
      };
      const downloadVideo = (video) => {
        isDownloading.value = true;
        downloadProgress.value = 0;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", video.videoUrl, true);
        xhr.responseType = "blob";
        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            downloadProgress.value = event.loaded / event.total * 100;
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200) {
            const blob = xhr.response;
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `video_${video.quality}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            elementPlus.ElMessage.success(`${video.quality} 质量的视频下载成功`);
          } else {
            elementPlus.ElMessage.error(`${video.quality} 质量的视频下载失败`);
          }
          isDownloading.value = false;
        };
        xhr.onerror = () => {
          console.error("下载错误");
          elementPlus.ElMessage.error(`${video.quality} 质量的视频下载失败`);
          isDownloading.value = false;
        };
        xhr.send();
      };
      const downloadCover = useThrottleFn(() => {
        if (isDownloadingCover.value) return;
        isDownloadingCover.value = true;
        const flashvars = getFlashVars();
        if (flashvars) {
          const coverUrl = flashvars.image_url;
          _GM_download({
            url: coverUrl,
            name: "cover.jpg",
            onerror: () => elementPlus.ElMessage.error("封面下载失败"),
            ontimeout: () => elementPlus.ElMessage.error("封面下载超时"),
            onload: () => elementPlus.ElMessage.success("封面下载成功")
          });
        }
        setTimeout(() => {
          isDownloadingCover.value = false;
        }, 2e3);
      }, 2e3);
      const copyVideoLink = (url) => {
        copy(url);
        elementPlus.ElMessage.success("下载链接已复制到剪贴板");
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          getFlashVars() && !isDownloadingVideo.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
            vue.createElementVNode("button", {
              class: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow",
              onClick: getVideoInfo
            }, " 下载视频 "),
            vue.createElementVNode("button", {
              class: "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow",
              onClick: _cache[0] || (_cache[0] = //@ts-ignore
              (...args) => vue.unref(downloadCover) && vue.unref(downloadCover)(...args))
            }, vue.toDisplayString(isDownloadingCover.value ? "下载中..." : "下载封面"), 1)
          ])) : vue.createCommentVNode("", true),
          vue.createVNode(vue.unref(elementPlus.ElDialog), {
            modelValue: isDownloadingVideo.value,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => isDownloadingVideo.value = $event),
            title: "下载视频",
            width: "400px"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(elementPlus.ElSkeleton), {
                loading: videoList.value.length === 0,
                "animated:true": ""
              }, {
                template: vue.withCtx(() => [
                  (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(4, (i) => {
                    return vue.createElementVNode("div", {
                      key: i,
                      class: "mb-4"
                    }, [
                      vue.createVNode(vue.unref(elementPlus.ElSkeletonItem), {
                        variant: "button",
                        style: { "width": "100%", "height": "48px" }
                      })
                    ]);
                  }), 64))
                ]),
                default: vue.withCtx(() => [
                  !isDownloading.value ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(videoList.value, (video, index) => {
                    return vue.openBlock(), vue.createElementBlock("div", {
                      key: index,
                      class: "mb-4 flex space-x-2"
                    }, [
                      vue.createVNode(vue.unref(elementPlus.ElButton), {
                        class: vue.normalizeClass([
                          "flex-grow !py-3 !text-base !font-bold !rounded-lg !transition-colors",
                          "!bg-[#ff9900] hover:!bg-[#ff6600] !text-black"
                        ]),
                        onClick: ($event) => downloadVideo(video)
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(video.quality + "p"), 1)
                        ]),
                        _: 2
                      }, 1032, ["onClick"]),
                      vue.createVNode(vue.unref(elementPlus.ElButton), {
                        class: vue.normalizeClass([
                          "!py-3 !text-base !font-bold !rounded-lg !transition-colors",
                          "!bg-gray-200 hover:!bg-gray-300 !text-gray-700"
                        ]),
                        onClick: ($event) => copyVideoLink(video.videoUrl)
                      }, {
                        default: vue.withCtx(() => _cache[2] || (_cache[2] = [
                          vue.createTextVNode(" 复制链接 ")
                        ])),
                        _: 2
                      }, 1032, ["onClick"])
                    ]);
                  }), 128)) : vue.createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["loading"]),
              isDownloading.value ? (vue.openBlock(), vue.createBlock(vue.unref(elementPlus.ElProgress), {
                key: 0,
                percentage: downloadProgress.value,
                status: "success",
                "stroke-width": 20
              }, null, 8, ["percentage"])) : vue.createCommentVNode("", true)
            ]),
            _: 1
          }, 8, ["modelValue"])
        ], 64);
      };
    }
  });
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(_sfc_main$1);
      };
    }
  });
  vue.createApp(_sfc_main).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue, ElementPlus);