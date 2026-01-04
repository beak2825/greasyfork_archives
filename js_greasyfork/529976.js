// ==UserScript==
// @name         全能视频播放器速度控制(最大16倍速)
// @namespace    http://tampermonkey.net/
// @version      4.2.1
// @author       不会起名
// @description  支持【B站】【爱奇艺】【腾讯视频】【优酷】...等网站
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        *://*.youtube.com/watch*
// @match        *://*.bilibili.com/video/*
// @match        *://v.qq.com/x/cover/*
// @match        *://www.youku.com/video?*
// @match        *://*.netflix.com/watch/*
// @match        *://*.dailymotion.com/video/*
// @match        *://*.twitch.tv/*/videos/*
// @match        *://*.vimeo.com/*
// @match        *://*.huya.com/*
// @match        *://*.douyu.com/*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.tudou.com/v*
// @match        *://*.bilibili.com/anime/*
// @match        *://*.bilibili.com/bangumi/play/*
// @match        *://m.youku.com/v*
// @match        *://m.youku.com/a*
// @match        *://v.youku.com/v_*
// @match        *://v.youku.com/pad_show*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/w_*
// @match        *://*.iqiyi.com/a_*
// @match        *://*.iqiyi.com/adv*
// @match        *://*.iq.com/play/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.pptv.com/show/*
// @match        *://www.yuque.com/r/goto*
// @match        *://*.xiaohongshu.com/explore*
// @match        *://tv.wandhi.com/go.html*
// @match        *://tv.wandhi.com/check.html
// @match        *://*.zhihu.com/question*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.14/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/529976/%E5%85%A8%E8%83%BD%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%28%E6%9C%80%E5%A4%A716%E5%80%8D%E9%80%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529976/%E5%85%A8%E8%83%BD%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E9%80%9F%E5%BA%A6%E6%8E%A7%E5%88%B6%28%E6%9C%80%E5%A4%A716%E5%80%8D%E9%80%9F%29.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const o=document.createElement("style");o.textContent=e,document.head.append(o)})(" #speed-control.light[data-v-b7c1e33b]{--bg-color: #e4ebf5;--text-color: #9baacf;--Shadow-color1: #c8d0e7;--Shadow-color2: #ffffff}#speed-control.dark[data-v-b7c1e33b]{--bg-color: #696969;--text-color: #ffffff;--Shadow-color1: #4a4a4a;--Shadow-color2: #929292}#speed-control.fold[data-v-b7c1e33b]{--width: 200px;--height: 153px}#speed-control.unfold[data-v-b7c1e33b]{--width: 140px;--height: 22px}#speed-control[data-v-b7c1e33b]{--controlBorder: #dddddd;position:fixed;top:20px;left:20px;z-index:9999;border-radius:5px;padding:10px;width:var(--width);height:var(--height);font-size:12px;line-height:1.5;background-color:var(--bg-color);color:var(--text-color);border:1px solid #ffbdbd;transition:width .3s,height .3s,background-color .3s,color .3s,opacity .3s;overflow:hidden;-webkit-user-select:none;user-select:none;box-sizing:content-box;opacity:.7}#speed-control[data-v-b7c1e33b]:hover{opacity:1;animation:borderShadow-b7c1e33b 3s linear infinite}#speed-control .header[data-v-b7c1e33b]{display:flex;justify-content:space-between;align-items:center;cursor:move}#speed-control .headerTitle[data-v-b7c1e33b]{width:100%;line-height:22px}#speed-control .headerBtn[data-v-b7c1e33b]{display:flex;justify-content:space-between;align-items:center;gap:10px}#speed-control .headerBtn button[data-v-b7c1e33b]{width:35px;line-height:22px}#speed-control button[data-v-b7c1e33b]{border-radius:3px;background-color:transparent;border:none;line-height:22px;box-shadow:3px 3px 6px var(--Shadow-color1),-2px -2px 5px var(--Shadow-color2);color:var(--text-color);cursor:pointer}#speed-control button[data-v-b7c1e33b] :focus{outline:none}#speed-control button[data-v-b7c1e33b]:focus,#speed-control button[data-v-b7c1e33b]:focus-visible{outline:none}#speed-control button[data-v-b7c1e33b]:active,#speed-control .numInputSpeed[data-v-b7c1e33b]{box-shadow:inset 2px 2px 5px var(--Shadow-color1),inset -2px -2px 5px var(--Shadow-color2)!important}#speed-control .speedBtnList[data-v-b7c1e33b]{display:flex;flex-wrap:wrap;margin:15px 0;justify-content:space-between;row-gap:10px}.speedBtnList button[data-v-b7c1e33b]{width:30%}#speed-control .slider[data-v-b7c1e33b]{--slider-width: 100%;--slider-height: 6px;--slider-border-radius: 999px;--level-transition-duration: .1s;--level-color: var(--Shadow-color2)}#speed-control .slider[data-v-b7c1e33b]{display:flex;align-items:center;cursor:pointer}#speed-control .slider .level[data-v-b7c1e33b]{-webkit-appearance:none;-moz-appearance:none;appearance:none;width:var(--slider-width);height:var(--slider-height);background-color:var(--text-color);overflow:hidden;border-radius:var(--slider-border-radius);-webkit-transition:height var(--level-transition-duration);-o-transition:height var(--level-transition-duration);transition:height var(--level-transition-duration);cursor:pointer}#speed-control .level[data-v-b7c1e33b]::-webkit-slider-thumb{-webkit-appearance:none;width:0;height:0;-webkit-box-shadow:-200px 0 0 200px var(--level-color);box-shadow:-200px 0 0 200px var(--level-color)}#speed-control .slider:hover .level[data-v-b7c1e33b]{height:calc(var(--slider-height) * 2)}#speed-control .numInputSpeed[data-v-b7c1e33b]{position:relative;width:42px;height:22px;margin-left:10px;padding:3px 6px;text-align:center;border-radius:4px;border:none;color:var(--text-color);background-color:transparent}#speed-control .numInputSpeed[data-v-b7c1e33b]::-webkit-inner-spin-button,#speed-control .numInputSpeed[data-v-b7c1e33b]::-webkit-outer-spin-button{-webkit-appearance:none;display:none;margin:0}#speed-control .number-input[data-v-b7c1e33b]{display:flex;align-items:center;gap:5px}#speed-control .controls[data-v-b7c1e33b]{display:flex;flex-direction:column;gap:5px}#speed-control .controls button[data-v-b7c1e33b]{border:none;cursor:pointer;padding:0 5px;font-size:10px;line-height:1.2}#speed-control .controls button[data-v-b7c1e33b]:hover{color:#000}@keyframes borderShadow-b7c1e33b{0%{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}} ");

(function (vue) {
  'use strict';

  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = { class: "header" };
  const _hoisted_2 = { class: "headerBtn" };
  const _hoisted_3 = ["textContent"];
  const _hoisted_4 = ["textContent"];
  const _hoisted_5 = { class: "speedBtnList" };
  const _hoisted_6 = ["onClick", "textContent"];
  const _hoisted_7 = { class: "slider" };
  const _hoisted_8 = ["min", "max", "step", "value"];
  const _hoisted_9 = { class: "number-input" };
  const _hoisted_10 = ["min", "max", "step", "value"];
  const _hoisted_11 = { class: "controls" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const SPEED = {
        MIN: 0.1,
        MAX: 16,
        STEP: 0.05
      };
      const PRESET = [0.5, 1, 5, 8, 12, 16];
      const theme = vue.ref(_GM_getValue("theme", "light"));
      const isFold = vue.ref(_GM_getValue("isFold", "unfold"));
      const position = vue.ref(_GM_getValue("savedPosition", { x: 20, y: 20 }));
      const speed = vue.ref(1);
      const numInputSpeed = vue.ref(null);
      const incrementRef = vue.ref(null);
      const decrementRef = vue.ref(null);
      const mediaElements = vue.ref(null);
      const updatePlaybackRate = () => {
        mediaElements.value = document.querySelector("video");
        mediaElements.value.playbackRate = speed.value;
      };
      const toggleTheme = () => {
        theme.value = theme.value === "light" ? "dark" : "light";
        _GM_setValue("theme", theme.value);
      };
      const toggleFold = () => {
        isFold.value = isFold.value === "fold" ? "unfold" : "fold";
        _GM_setValue("isFold", isFold.value);
      };
      const toggleSpeed = (speedVal) => {
        speed.value = speedVal;
        updatePlaybackRate();
      };
      const onMousedown = (e) => {
        const offsetX = e.clientX - position.value.x;
        const offsetY = e.clientY - position.value.y;
        const onMousemove = (e2) => {
          position.value.x = e2.clientX - offsetX;
          position.value.y = e2.clientY - offsetY;
        };
        const onMouseup = () => {
          document.removeEventListener("mousemove", onMousemove);
          document.removeEventListener("mouseup", onMouseup);
          _GM_setValue("savedPosition", { ...position.value });
        };
        document.addEventListener("mousemove", onMousemove);
        document.addEventListener("mouseup", onMouseup);
      };
      const increment = () => {
        speed.value = Math.min(SPEED.MAX, Math.round((speed.value * 1 + SPEED.STEP) * 100) / 100);
        updatePlaybackRate();
      };
      const decrement = () => {
        speed.value = Math.max(SPEED.MIN, Math.round((speed.value * 1 - SPEED.STEP) * 100) / 100);
        updatePlaybackRate();
      };
      const handleKeyDown = (e) => {
        if (e.altKey) {
          if (e.key === "ArrowUp") {
            increment();
          } else if (e.key === "ArrowDown") {
            decrement();
          } else if (e.key === "r" || e.key === "R") {
            toggleSpeed(1);
          }
          e.preventDefault();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      const handleWheel = (event) => {
        event.preventDefault();
        requestAnimationFrame(() => {
          if (event.deltaY < 0) {
            increment();
          } else {
            decrement();
          }
        });
      };
      const sliderRangeChange = (event) => {
        speed.value = event.target.valueAsNumber;
        updatePlaybackRate();
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          id: "speed-control",
          ref: "dragElement",
          class: vue.normalizeClass([vue.unref(theme), vue.unref(isFold)]),
          style: vue.normalizeStyle({ transform: `translate(${vue.unref(position).x}px, ${vue.unref(position).y}px)` })
        }, [
          vue.createElementVNode("div", _hoisted_1, [
            vue.createElementVNode("div", {
              class: "headerTitle",
              onMousedown
            }, "播放控制", 32),
            vue.createElementVNode("div", _hoisted_2, [
              vue.createElementVNode("button", {
                type: "button",
                onClick: _cache[0] || (_cache[0] = ($event) => toggleFold()),
                textContent: vue.toDisplayString(vue.unref(isFold) === "unfold" ? "▶" : "▼")
              }, null, 8, _hoisted_3),
              vue.createElementVNode("button", {
                type: "button",
                onClick: _cache[1] || (_cache[1] = ($event) => toggleTheme()),
                textContent: vue.toDisplayString(vue.unref(theme) === "dark" ? "🌞" : "🌙")
              }, null, 8, _hoisted_4)
            ])
          ]),
          vue.createElementVNode("div", _hoisted_5, [
            (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(PRESET, (item) => {
              return vue.createElementVNode("button", {
                type: "button",
                onClick: ($event) => toggleSpeed(item),
                key: item,
                textContent: vue.toDisplayString(`×${item.toFixed(2)}`)
              }, null, 8, _hoisted_6);
            }), 64))
          ]),
          vue.createElementVNode("div", null, "当前速度：×" + vue.toDisplayString(vue.unref(speed).toFixed(2)), 1),
          vue.createElementVNode("div", _hoisted_7, [
            vue.createElementVNode("input", {
              type: "range",
              min: SPEED.MIN,
              max: SPEED.MAX,
              step: SPEED.STEP,
              class: "level",
              onInput: sliderRangeChange,
              value: vue.unref(speed).toFixed(2)
            }, null, 40, _hoisted_8),
            vue.createElementVNode("div", _hoisted_9, [
              vue.createElementVNode("input", {
                type: "number",
                min: SPEED.MIN,
                max: SPEED.MAX,
                step: SPEED.STEP,
                ref_key: "numInputSpeed",
                ref: numInputSpeed,
                class: "numInputSpeed",
                onWheel: _cache[2] || (_cache[2] = vue.withModifiers(($event) => handleWheel($event), ["prevent"])),
                value: vue.unref(speed).toFixed(2)
              }, null, 40, _hoisted_10),
              vue.createElementVNode("div", _hoisted_11, [
                vue.createElementVNode("button", {
                  class: "increment",
                  ref_key: "incrementRef",
                  ref: incrementRef,
                  onClick: _cache[3] || (_cache[3] = ($event) => increment())
                }, "▲", 512),
                vue.createElementVNode("button", {
                  class: "decrement",
                  ref_key: "decrementRef",
                  ref: decrementRef,
                  onClick: _cache[4] || (_cache[4] = ($event) => decrement())
                }, "▼", 512)
              ])
            ])
          ])
        ], 6);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b7c1e33b"]]);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue);