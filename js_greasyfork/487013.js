// ==UserScript==
// @name         Youtube Mobile Enhance 油管移动端增强
// @namespace    http://tampermonkey.net/
// @version      2.9.2
// @author       zyronon
// @description  针对油管移动端，点击视频新标签页打开，记忆播放速度，突破播放速度限制
// @license      GPL License
// @icon         https://v2next.netlify.app/favicon.ico
// @homepage     https://github.com/zyronon/web-scripts
// @homepageURL  https://github.com/zyronon/web-scripts
// @supportURL   https://update.greasyfork.org/scripts/487013/Youtube%20Mobile%20Enhance%20%E6%B2%B9%E7%AE%A1%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%A2%9E%E5%BC%BA.user.js
// @match        https://m.youtube.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.4.38/dist/vue.global.prod.js
// @require      https://cdn.jsdelivr.net/npm/eruda@3.2.3/eruda.js
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/487013/Youtube%20Mobile%20Enhance%20%E6%B2%B9%E7%AE%A1%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/487013/Youtube%20Mobile%20Enhance%20%E6%B2%B9%E7%AE%A1%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" html{font-size:12px!important}.ytb-next{font-size:1.4rem;display:flex;position:fixed;top:0;right:10px;width:calc(22vw - 10px);z-index:99999;background:black}.ytb-next .btn{flex:1;color:#f1f1f1;background-color:#ffffff1a;padding:5px 0;height:36px;font-size:14px;line-height:36px;text-align:center;border:1px solid rgba(0,0,0,.8)}.msg{position:fixed;z-index:999;font-size:3rem;left:0;top:0;color:#000;background:white;padding:1rem 2rem}@media (min-width: 1280px) and (orientation: landscape){.player-container,.player-container.sticky-player{right:22vw!important;top:0!important;z-index:999!important}ytm-watch{margin-right:22vw!important}ytm-engagement-panel,.related-items-container{width:22vw!important}lazy-list .feed-item{width:100%!important}lazy-list .feed-item ytm-media-item{width:100%!important}.playlist-entrypoint-background-protection,.slide-in-animation-entry-point{width:22vw!important}ytm-single-column-watch-next-results-renderer [section-identifier=related-items],ytm-single-column-watch-next-results-renderer>ytm-playlist{width:22vw!important;padding:0 0 8px 8px;box-sizing:border-box}ytm-single-column-watch-next-results-renderer .playlist-content{width:22vw!important}} ");

(function (vue, eruda) {
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

  const eruda__namespace = /*#__PURE__*/_interopNamespaceDefault(eruda);

  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const _hoisted_2 = {
    key: 1,
    class: "msg"
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      let refVideo = vue.ref(null);
      let rate = vue.ref(1);
      let lastRate = vue.ref(1);
      let pageType = vue.ref("");
      let msg = vue.reactive({
        show: false,
        content: "",
        timer: -1
      });
      function stop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return true;
      }
      function openNewTab(href, active = false) {
        _GM_openInTab(href, { active });
      }
      function getBrowserType() {
        let userAgent = navigator.userAgent;
        if (userAgent.indexOf("Opera") > -1) {
          return "Opera";
        }
        if (userAgent.indexOf("Firefox") > -1) {
          return "FF";
        }
        if (userAgent.indexOf("Chrome") > -1) {
          return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
          return "Safari";
        }
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
          return "IE";
        }
      }
      function initStyle(type) {
        let style2 = `
  :root {
  --color-scrollbar: rgb(147, 173, 227);
}

html[darker-dark-theme] {
  --color-scrollbar: rgb(92, 93, 94);
}

${type === "FF" ? `/* 火狐美化滚动条 */
* {
  scrollbar-color: var(--color-scrollbar);
  /* 滑块颜色  滚动条背景颜色 */
  scrollbar-width: thin;
  /* 滚动条宽度有三种：thin、auto、none */
}` : `
  ::-webkit-scrollbar {
  width: 1rem;
  height: 1rem;
}

::-webkit-scrollbar-track {
  background: transparent;
  border-radius: .2rem;
}

::-webkit-scrollbar-thumb {
  background: var(--color-scrollbar);
  border-radius: 1rem;
}`}
  `;
        let addStyle2 = document.createElement("style");
        addStyle2.rel = "stylesheet";
        addStyle2.type = "text/css";
        addStyle2.innerHTML = style2;
        window.document.head.append(addStyle2);
      }
      function findA(target, e) {
        let parentNode = target.parentNode;
        let count = 0;
        while (parentNode.tagName !== "A" && count < 10) {
          count++;
          parentNode = parentNode.parentNode;
        }
        console.log(parentNode);
        openNewTab(parentNode.href, true);
        return stop(e);
      }
      function checkPageType() {
        if (location.pathname === "/watch") {
          pageType.value = "watch";
        }
        if (location.pathname === "/") {
          pageType.value = "home";
        }
        if (location.pathname.startsWith("/@")) {
          pageType.value = "user";
        }
      }
      function checkVideo() {
        let v = document.querySelector("video");
        if (v) {
          v.playbackRate = rate.value;
          refVideo.value = v;
          window.funs.checkWatchPageDiv();
          return true;
        }
      }
      function playbackRateToggle() {
        checkVideo();
        if (refVideo.value) {
          if (refVideo.value.playbackRate !== 1) {
            lastRate.value = rate.value;
            rate.value = refVideo.value.playbackRate = 1;
            showMsg("播放速度: 1");
          } else {
            rate.value = refVideo.value.playbackRate = lastRate.value === 1 ? 2 : lastRate.value;
            showMsg("播放速度: " + rate.value);
          }
        }
      }
      function toggle() {
        checkVideo();
        if (refVideo.value) {
          if (refVideo.value.paused) {
            refVideo.value.play();
          } else {
            refVideo.value.pause();
          }
        }
      }
      function setPlaybackRate(val) {
        checkVideo();
        if (refVideo.value) {
          rate.value = refVideo.value.playbackRate = Number(val.toFixed(1));
          showMsg("播放速度: " + rate.value);
        }
      }
      function showMsg(text) {
        if (msg.show) {
          msg.show = false;
          clearTimeout(msg.timer);
        }
        msg.show = true;
        msg.content = text;
        msg.timer = setTimeout(() => {
          msg.show = false;
        }, 3e3);
      }
      function checkOptionButtons() {
        let dom = document.querySelector(".ytb-next");
        if (dom)
          return;
        dom = document.createElement("div");
        dom.classList.add("ytb-next");
        dom.innerHTML = `
    <div class="btn" onclick="window.cb('playbackRateToggle')">切</div>
    <div class="btn" onclick="window.cb('addRate')">&nbsp;+&nbsp;</div>
    <div class="btn" onclick="window.cb('removeRate')">&nbsp;-&nbsp;</div>
    <div class="btn" onclick="window.cb('playbackRateToggle1')">&nbsp;1&nbsp;</div>
    <div class="btn" onclick="window.cb('playbackRateToggle2')">&nbsp;2&nbsp;</div>
    <div class="btn" onclick="window.cb('playbackRateToggle25')">&nbsp;2.5&nbsp;</div>
    <div class="btn" onclick="window.cb('playbackRateToggle3')">&nbsp;3&nbsp;</div>
        `;
        document.body.append(dom);
      }
      function checkIsWatchPage() {
        checkPageType();
        return pageType.value === "watch";
      }
      function checkA(e) {
        let target = e.target;
        let tagName = target.tagName;
        let classList = target.classList;
        if (tagName === "IMG" && Array.from(classList).some((v) => v.includes("yt-core-image"))) {
          console.log("封面");
          if (checkIsWatchPage())
            return;
          return findA(target, e);
        }
        if (tagName === "SPAN" && Array.from(classList).some((v) => v.includes("yt-core-attributed-string"))) {
          console.log("标题");
          if (checkIsWatchPage())
            return;
          return findA(target, e);
        }
        if (tagName === "BUTTON" && Array.from(classList).some((v) => v.includes("ytp-large-play-button"))) {
          console.log("播放按钮");
          if (checkIsWatchPage())
            return;
        }
        if (tagName === "DIV" && Array.from(classList).some((v) => v.includes("ytp-cued-thumbnail-overlay-image"))) {
          console.log("播放按钮");
          if (checkIsWatchPage())
            return;
        }
      }
      vue.watch(rate, (value) => {
        localStorage.setItem("youtube-rate", value);
        window.rate = value;
      });
      vue.onMounted(() => {
        console.log("Youtube Next start");
        setTimeout(() => {
          let browserType = getBrowserType();
          initStyle(browserType);
        }, 500);
        let youtubeRate = localStorage.getItem("youtube-rate");
        if (youtubeRate) {
          rate.value = Number(youtubeRate);
        }
        _unsafeWindow.cb = (type) => {
          console.log("type", type);
          switch (type) {
            case "toggle":
              toggle();
              break;
            case "playbackRateToggle":
              playbackRateToggle();
              break;
            case "playbackRateToggle1":
              setPlaybackRate(1);
              break;
            case "playbackRateToggle2":
              setPlaybackRate(2);
              break;
            case "playbackRateToggle25":
              setPlaybackRate(2.5);
              break;
            case "playbackRateToggle3":
              setPlaybackRate(3);
              break;
            case "addRate":
              setPlaybackRate(rate.value + 0.1);
              break;
            case "removeRate":
              setPlaybackRate(rate.value - 0.1);
              break;
          }
        };
        if (checkIsWatchPage()) {
          setTimeout(() => {
            checkOptionButtons();
            checkVideo();
            if (refVideo.value) {
              refVideo.value.muted = false;
              refVideo.value.playbackRate = rate.value;
              showMsg("播放速度: " + rate.value);
            }
          }, 1e3);
        }
        window.addEventListener("click", checkA, true);
        window.addEventListener("visibilitychange", stop, true);
      });
      vue.onUnmounted(() => {
        window.removeEventListener("click", checkA, true);
        window.removeEventListener("visibilitychange", stop, true);
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createCommentVNode("", true),
          vue.unref(msg).show ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2, vue.toDisplayString(vue.unref(msg).content), 1)) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  });
  try {
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
      window.trustedTypes.createPolicy("default", {
        createHTML: (string) => string,
        createScriptURL: (string) => string,
        createScript: (string) => string
      });
    }
  } catch (e) {
    console.error("trustedTypes");
  }
  try {
    setTimeout(() => {
      var _a;
      (_a = window.eruda) == null ? void 0 : _a.init();
      eruda__namespace == null ? void 0 : eruda__namespace.init();
    }, 0);
  } catch (e) {
  }
  window.videoEl = null;
  window.rate = 1;
  window.funs = {
    checkWatchPageDiv() {
      let header = document.querySelector("#header-bar");
      let stickyPlayer = document.querySelector("#app.sticky-player");
      if (header)
        header.style["display"] = "none";
      if (stickyPlayer)
        stickyPlayer.style["padding-top"] = "0";
    }
  };
  async function sleep(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
  function proxyHTMLMediaElementEvent() {
    if (HTMLMediaElement.prototype._rawAddEventListener_) {
      return false;
    }
    HTMLMediaElement.prototype._rawAddEventListener_ = HTMLMediaElement.prototype.addEventListener;
    HTMLMediaElement.prototype._rawRemoveEventListener_ = HTMLMediaElement.prototype.removeEventListener;
    HTMLMediaElement.prototype.addEventListener = new Proxy(HTMLMediaElement.prototype.addEventListener, {
      apply(target, ctx, args) {
        const eventName = args[0];
        const listener = args[1];
        if (listener instanceof Function && eventName === "ratechange") {
          args[1] = new Proxy(listener, {
            apply(target2, ctx2, args2) {
              if (ctx2) {
                if (ctx2.playbackRate && eventName === "ratechange") {
                  if (ctx2._hasBlockRatechangeEvent_) {
                    return true;
                  }
                  const oldRate = ctx2.playbackRate;
                  const startTime = Date.now();
                  const result = target2.apply(ctx2, args2);
                  const blockRatechangeBehave1 = oldRate !== ctx2.playbackRate || Date.now() - startTime > 1e3;
                  const blockRatechangeBehave2 = ctx2._setPlaybackRate_ && ctx2._setPlaybackRate_.value !== ctx2.playbackRate;
                  if (blockRatechangeBehave1 || blockRatechangeBehave2) {
                    debug.info(`[execVideoEvent][${eventName}]检测到可能存在阻止调速的行为，已禁止${eventName}事件的执行`, listener);
                    ctx2._hasBlockRatechangeEvent_ = true;
                    return true;
                  } else {
                    return result;
                  }
                }
              }
              try {
                return target2.apply(ctx2, args2);
              } catch (e) {
                debug.error(`[proxyPlayerEvent][${eventName}]`, listener, e);
              }
            }
          });
        }
        if (listener instanceof Function && eventName === "play") {
          args[1] = new Proxy(listener, {
            apply(target2, ctx2, args2) {
              console.log("play", window.rate);
              ctx2.playbackRate = window.rate;
              window.funs.checkWatchPageDiv();
              try {
                return target2.apply(ctx2, args2);
              } catch (e) {
                debug.error(`[proxyPlayerEvent][${eventName}]`, listener, e);
              }
            }
          });
        }
        return target.apply(ctx, args);
      }
    });
  }
  proxyHTMLMediaElementEvent();
  async function init() {
    let $section = document.createElement("section");
    $section.id = "vue-app";
    let count = 0;
    if (document.body) {
      document.body.append($section);
    } else {
      while (!document.body && count < 50) {
        await sleep(100);
        count++;
      }
      document.body.append($section);
    }
    let vueApp = vue.createApp(_sfc_main);
    vueApp.config.unwrapInjectedRef = true;
    vueApp.mount($section);
  }
  init();

})(Vue, Vue);