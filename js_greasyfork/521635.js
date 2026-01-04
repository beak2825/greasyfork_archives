// ==UserScript==
// @name         视频VIP助手 - VPlayer
// @namespace    https://greasyfork.org/zh-CN/scripts/521635-hua-vplayer
// @version      0.0.22.8
// @author       Hua (VX: MoonlighTraveler)
// @description  视频VIP助手: 腾讯、爱奇艺、优酷、乐视、土豆、芒果TV; 解析更方便，播放更流畅，支持多端：手机端、电脑端
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADeElEQVR4nO2XzWuUVxSHj12I/QtK0kXJtFJUWjFtmMlXQyRGjV9JqsWUJm0UGaqJTRDFWtpYmpoxVBdD20AjiRgVbOlHRFEEP7BgUrvtoot2FdOtuHCpTzm5piBmGOI9ceaW+8CzmDOX3/ubw/u+JCKRSCQSiUQikblZ3sfi0m6OlnTxT2k3hGBJN9OlXWS0u/hS2kWm0D/IwwHvBZToNl1Y1X9LeXSBJ5ZVJPOSvdTM3gniy0t7QM03K7Z5rrPz5pUPQc03K7Z5rrPzZlka1HyzYpvnOjtvXt8FIeu9gPKdELLeC0h+AKoEhlnvmg5QJTDMete/B6oEhlnvNe+CKoFh1rtpO6gSGGa9t7wDqgSGWe+tW0H1r8SilhZSal8fz8kCY9a7rRVU35ztLQzOZrW1crutmUpZQKx6S3szqAY59zTn/XaX197Mw/YtnO7YwIveJRewt+zYDKpVTvdNSA/Czlb3uXMz9zs3cXjbNp73LjvH9byD0htBtcrpueX86DLsPgjpTW6e3shUegMd+q7wLm3YW7qaQLXK+fTXx/34DPR0uu9mXM/k7iaSxdJbeteBapUzeGMOr8PnX8O+t92ZnrU86F3Hqb2reaHQvWV/I6hWOUNXc/vNRej/BA6sd2f3N3L3QCNrCtlbDjWAapVz+kp+R85BZo87f6iBvwvZW/pWg2qVM34pv+fOwvFd7vxn9U+3AKve0l8HqlXOtQu5vfIjjOyD/np3tv8t7n5RR0Mhe0umFlSrnN/Hn/T2L3D+CBxf685kankwUMupLz1egla95Vg1qFY5f/70uLeyMNzivlO/quLGsWpWFktvyVaCapUz/YPzrxEY3wHZKjfPVjKVTdGB0R9CVr1lKAmqVc7UWbjeC99Vu8/fJrk/lOTwaB1LvMvOcT3voBMVoPrmDL/JPc0Zq3d5wxU8PFHB2MnUwvwzZNVbTr4BqkHO4GzWaDm/jZaT8i73DHrLmVWg+ubosz1WTkq1es6fRW/5fiWoEhhmvX9+DVQJDLPeF1aAKoFh1vvyMlAlMMx6X30VVAkMs943l4IqgWHWe+JlCFnvBUwmIGTNFiB5ZsU2jwtIxDsAq0dgWoMmEtQU8paez3yyjNqZWRl3xJfJBAOFfpE9rRMJjngv4I/lLH60hJk7IQjLuKM/Xrt7LyASiUQikUhE/qf8C11P8gg1P6hwAAAAAElFTkSuQmCC
// @match        *://v.qq.com/*
// @match        *://m.v.qq.com/*
// @match        *://video.qq.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://*.le.com/*
// @match        *://*.tudou.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.mgtv.com/*
// @require      https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521635/%E8%A7%86%E9%A2%91VIP%E5%8A%A9%E6%89%8B%20-%20VPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/521635/%E8%A7%86%E9%A2%91VIP%E5%8A%A9%E6%89%8B%20-%20VPlayer.meta.js
// ==/UserScript==

(function(e){const o=document.createElement("style");o.id="monkey-hua-vplayer-popup-style-css",o.textContent=e,document.head.appendChild(o)})(" .App{--block-c-value: 0 0 0;--block-color: rgba(0, 0, 0, .8);--white-color: rgba(255, 255, 255, 1);--green-color: rgba(67, 231, 0, 1);--yellow-color: rgba(215, 127, 47, 1);--blue-color: rgba(0, 154, 255, 1);--card-top: 27px;--card-left: 105px}.App *,.App *:before,.App *:after{box-sizing:border-box}.App p{margin:0;font-size:13px;color:#888}.App ul{list-style:none;padding:0;margin:0}.App button{border:none;border-radius:4px}.App .card{position:fixed;top:var(--card-top);left:var(--card-left);z-index:20241222}.App .card button{padding:5px 8px;font-size:16px;color:var(--white-color);background-color:var(--green-color);cursor:pointer}.App dialog{max-width:var(--dialog-width, 0px);width:var(--dialog-width, 0px);max-height:fit-content;height:fit-content;background-color:var(--white-color);padding:0;border:none;border-radius:8px;grid-template-columns:2fr;transition:all .3s ease-in-out;overflow:hidden}.App dialog .header{--font-size: 20px;--close-size: 28px;display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.App dialog .header h2{margin:0;padding:0;color:var(--block-color);font-size:var(--font-size);font-weight:400}.App dialog .header .close{color:var(--white-color);background-color:var(--green-color);width:var(--close-size);height:var(--close-size);font-size:20px;font-weight:700;border-radius:3px;cursor:pointer}.App dialog .body{overflow-y:auto}.App dialog .body ul{--cols: 5;--li-font-size: 14px;display:grid;grid-template-columns:repeat(var(--cols),1fr);gap:8px;overflow:auto}.App dialog .body ul li{display:grid;justify-content:center;align-items:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--white-color);background-color:var(--blue-color);border-radius:4px;font-size:var(--li-font-size);transition:all .3s ease-in-out;cursor:pointer}.App dialog .body ul li:hover{background-color:var(--green-color)}.App dialog .body ul li.active{background-color:var(--green-color)}.App dialog .footer{margin:16px 0}.App dialog[open]{--dialog-width: 580px;display:grid;padding:16px;border:2px solid var(--green-color);align-content:flex-start}.App dialog::backdrop{background-color:rgba(var(--block-c-value),.2);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-radius:4px}@media screen and (max-width: 768px){.App{--card-top: 12px;--card-left: calc(100vw - 90px) }.App dialog[open]{--dialog-width: 85vw}.App dialog .header{--font-size: 20px;--close-size: 32px}.App dialog .body ul{--cols: 5;--li-py: 4px;--li-font-size: 10px;gap:4px}}:root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%} ");

(function () {
  'use strict';

  (function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? factory(require("react"), require("react-dom")) : typeof define === "function" && define.amd ? define(["react", "react-dom"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.React, global.ReactDOM));
  })(undefined, function(require$$0, require$$0$1) {
    function getDefaultExportFromCjs(x) {
      return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
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
    var hasRequiredReactJsxRuntime_production_min;
    function requireReactJsxRuntime_production_min() {
      if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
      hasRequiredReactJsxRuntime_production_min = 1;
      var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
      function q(c, a, g) {
        var b, d = {}, e = null, h = null;
        undefined !== g && (e = "" + g);
        undefined !== a.key && (e = "" + a.key);
        undefined !== a.ref && (h = a.ref);
        for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
        if (c && c.defaultProps) for (b in a = c.defaultProps, a) undefined === d[b] && (d[b] = a[b]);
        return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
      }
      reactJsxRuntime_production_min.Fragment = l;
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
    var client = {};
    var hasRequiredClient;
    function requireClient() {
      if (hasRequiredClient) return client;
      hasRequiredClient = 1;
      var m = require$$0$1;
      {
        client.createRoot = m.createRoot;
        client.hydrateRoot = m.hydrateRoot;
      }
      return client;
    }
    var clientExports = requireClient();
    const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(clientExports);
    const _ = {
      getUserAgent: () => window.navigator.userAgent,
      isMobile: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(_.getUserAgent()),
      getPlatfrom: () => _.isMobile() ? "mobile" : "pc",
      getPlatfromEnterprise: () => {
        const arr = ["bilibili", "iqiyi", "le", "mgtv", "qq", "tudou", "youku"];
        return arr.find((item) => location.hostname.includes(item));
      },
      isBoolean: (e) => Object.prototype.toString.call(e) === "[object Boolean]",
      isDate: (e) => Object.prototype.toString.call(e) === "[object Date]",
      isNumber: (e) => Object.prototype.toString.call(e) === "[object Number]",
      isString: (e) => Object.prototype.toString.call(e) === "[object String]",
      isArray: (e) => Array.isArray(e),
      isObject: (e) => Object.prototype.toString.call(e) === "[object Object]",
      isEmpty: (e) => _.isObject(e) && Object.keys(e).length === 0,
      isFn: (e) => Object.prototype.toString.call(e) === "[object Function]",
      getLines: (data) => _.isMobile() ? data.filter((e) => e.mobile) : data,
      waitTime: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
      selector: function(selector, cb, duration = 1500) {
        const parseData = (app) => {
          let lists = cb(app);
          let data = lists.list.flat();
          data = data.filter((e) => e.cid && e.vid);
          data = data.filter((e) => !e.isTrailer && !e.isNoStoreWatchHistory);
          return data;
        };
        const handler = (resolve, reject) => {
          const el = document.querySelector(selector);
          if (el) {
            return resolve(parseData(el) || []);
          }
          const cb2 = (mutations, observer2) => {
            for (const mutation of mutations) {
              if (mutation.type === "childList") {
                const el2 = document.querySelector(selector);
                if (el2) {
                  observer2.disconnect();
                  resolve(parseData(el2) || []);
                  break;
                }
              }
            }
            setTimeout(() => {
              observer2.disconnect();
              reject([]);
            }, 1e3);
          };
          const observer = new MutationObserver(cb2);
          observer.observe(el ?? document.body, { childList: true, subtree: true });
        };
        return new Promise((resolve, reject) => {
          setTimeout(() => handler(resolve, reject), duration);
        });
      }
    };
    function createStyle(id, css, el) {
      const style = document.createElement("style");
      style.id = id;
      style.innerHTML = css;
      el && el.appendChild(style);
      return style;
    }
    function createObserver(el, callback) {
      if (!el) return () => {
      };
      const observer = new MutationObserver((mutationsList, observer2) => {
        console.log("%c Line:345 🍇 mutationsList", "color:#2eafb0", mutationsList);
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            callback(window.__PINIA__);
            break;
          }
        }
      });
      observer.observe(el, { childList: true });
      return observer.disconnect;
    }
    function getQuery(name, url) {
      if (!url && (name == null ? undefined : name.includes("?"))) {
        url = name;
        name = undefined;
      }
      const handle = new URL(url || window.location.href);
      const s = new URLSearchParams(handle.search);
      const o = Object.fromEntries(s.entries());
      return !name ? o : o.hasOwnProperty(name) ? o[name] : undefined;
    }
    const otos = (object) => {
      const result = [];
      for (let k in object) {
        result.push(`${k}:${object[k]}`);
      }
      return result.join(";");
    };
    const toQuery = (obj) => {
      const params = [];
      for (const key in obj) {
        let k = encodeURIComponent(key);
        let v = obj[key];
        if (obj.hasOwnProperty(key) && v !== undefined) {
          if (typeof v === "object" && v !== null) {
            params.push(k + "=" + encodeURIComponent(JSON.stringify(v)));
          } else {
            params.push(k + "=" + encodeURIComponent(v));
          }
        }
      }
      return params.join("&");
    };
    const cookie = {
      write: function(t, e, day = 30) {
        var a = [], r = "/", o = location.hostname, i = location.protocol.startsWith("https");
        a.push(t + "=" + encodeURIComponent(e)), a.push("expires=" + new Date(Date.now() + day * 864e5).toUTCString()), a.push("path=" + r), a.push("domain=" + o), true === i && a.push("secure"), document.cookie = a.join("; ");
      },
      read: function(t, defaultValue) {
        var e = document.cookie.match(new RegExp("(^|;\\s*)(" + t + ")=([^;]*)"));
        if (e && e.length) {
          return decodeURIComponent(e[3]);
        }
        if (defaultValue) {
          this.write(t, defaultValue);
          return defaultValue;
        }
        return null;
      },
      remove: function(t) {
        this.write(t, "", Date.now() - 864e5);
      }
    };
    const lines = [
      { mobile: 0, name: "云解析", url: "//jx.yparse.com/index.php?url=" },
      { mobile: 0, name: "IK9", url: "//yparse.ik9.cc/index.php?url=" },
      { mobile: 0, name: "B站", url: "//jx.playerjy.com/?ads=0&url=" },
      { mobile: 0, name: "M1907", url: "//z1.m1907.top/?jx=" },
      { mobile: 1, name: "乐视云", url: `//ys.lbbb.cc/?url=` },
      { mobile: 1, name: "西瓜云", url: "//pl.a6club.com/player/analysis.php?v=" },
      { mobile: 1, name: "虾米", url: "//jx.xmflv.com/?url=" },
      { mobile: 1, name: "虾米CC", url: "//jx.xmflv.cc/?url=" },
      { mobile: 1, name: "77TV", url: "//jx.77flv.cc/?url=" },
      { mobile: 1, name: "妲觅TV", url: "//jx.dmflv.cc/?url=" },
      { mobile: 1, name: "咸鱼TV", url: "//jx.xymp4.cc/?url=" },
      { mobile: 1, name: "酷狗", url: "//bfq.cddys1.me/youhuanle1/?url=" },
      { mobile: 1, name: "七哥", url: "//jx.nnxv.cn/tv.php?url=" },
      { mobile: 1, name: "WK", url: "//a.wkvip.net/index.php?url=" },
      { mobile: 0, name: "CK播放器", url: "//www.ckplayer.vip/jiexi/?url=" },
      { mobile: 1, name: "znb", url: "//v.znb.me/?url=" },
      { mobile: 1, name: "2S0", url: "//jx.2s0.cn/player/?url=" },
      { mobile: 1, name: "08BK", url: "//2.08bk.com/?url=" },
      { mobile: 1, name: "电影先生", url: "//dyxs20.com/" },
      { mobile: 1, name: "FF", url: "//pl.aszzys.com/player/ec.php?code=ffm3u8&if=1&url=" },
      { mobile: 1, name: "HM", url: "//pl.aszzys.com/player/ec.php?code=heimuer&if=1&url=" },
      { mobile: 1, name: "LZ", url: "//pl.aszzys.com/player/ec.php?code=lzm3u8&if=1&url=" },
      { mobile: 1, name: "IK", url: "//pl.aszzys.com/player/ec.php?code=ikm3u8&if=1&url=" }
    ];
    function toast(message, duration = 3e3) {
      duration = isNaN(duration) ? 3e3 : duration;
      let t = document.createElement("div");
      const style = `padding:8px 16px;min-height:32px;line-height:36px;text-align:center;transform:translate(-50%);border-radius:4px;color:rgb(255, 255, 255);position:fixed;top:15%;left:50%;z-index:202412111018;background-image:linear-gradient(45deg, #F44336, #03A9F4);font-size:15px; font-weight: bold;`;
      t.style.cssText = style;
      t.innerHTML = message;
      document.body.appendChild(t);
      setTimeout(function() {
        var d = 0.5;
        t.style.transition = `transform ${d}s ease-in, opacity ${d}s ease-in`;
        t.style.opacity = "0";
        setTimeout(function() {
          document.body.removeChild(t);
        }, d * 1e3);
      }, duration);
    }
    function logger(message) {
      console.log(
        `%c VIP助手 %c ${message}`,
        "color: #fff; background: #4bc729; padding:4px 8px; border-top-left-radius:3px; border-bottom-left-radius:3px;",
        "color: #fff; background: #f56156; padding:4px 8px; border-top-right-radius:3px; border-bottom-right-radius:3px;"
      );
    }
    const qq = {
      mobile: {
        container: "#player",
        episode: ".pl-episode",
        observer: () => document.querySelector(".pl-episode__container"),
        getParseUrl(e) {
          const { protocol, href } = window.location;
          if (e) {
            return protocol + `//v.qq.com/x/cover/${e.cid}/${e.vid}.html`;
          }
          return href;
        },
        injectCss() {
          return `
        #app .interactive-long{ display: none!important; }
        #app img.gaussian-blur-lcp-img { display: none!important; }
        #app .player .player-tip{ display: none!important; }
        #app .video-desc-long__title{ white-space: normal; }
        #app .pl-episode .b-scroll__scroller .video-item-episode__poster { display: none!important; }
        `;
        },
        async getEpisodeData() {
          let typeName = false;
          const data = await _.selector("#app", (el) => {
            const pinia = el.__vue_app__.config.globalProperties.$pinia;
            const state = pinia.state._rawValue;
            typeName = state.global.videoInfo.type_name === "综艺";
            return state.playlist.playList;
          });
          const excepts = ["预告", "花絮", "采访", "彩蛋", "碎片"];
          let result = data.filter((e) => !excepts.some((t) => e.title.includes(t) || e.playTitle.includes(t)));
          return typeName ? data : result.map(({ pic, ...item }) => ({ ...item, pic: null }));
        },
        selectedDefault(id) {
          const vid = getQuery("vid");
          return id == Number(vid) ? "active" : "";
        },
        getEpisodeData2: function(pinia) {
          var _a, _b;
          const list = pinia == null ? undefined : pinia.playlist.playList.list;
          const triva = ((_b = (_a = pinia == null ? undefined : pinia.playlist.playList.varityTrivas) == null ? undefined : _a.none) == null ? undefined : _b.triva) || [];
          let data = list.concat(triva).flat();
          const excepts = ["预告", "花絮", "采访", "彩蛋"];
          data = data.filter((e) => e.cid && e.vid);
          data = data.filter((e) => !excepts.some((t) => e.title.includes(t) || e.playTitle.includes(t)));
          data = qq.filterData(data);
          const getVideType = (e) => {
            if (!e.uniImgTag && e.videoType === "花絮") return "花絮";
            if (e.uniImgTag.includes("预告")) return "预告";
            if (e.uniImgTag.includes("VIP")) return "VIP";
            return "";
          };
          if (pinia.global.videoInfo.type_name === "综艺") {
            return data.filter((e) => e.videoType !== "花絮").map((e) => {
              const { title, pic, cid, vid, playTitle, duration } = e;
              return {
                cid,
                vid,
                title,
                playTitle,
                videoType: getVideType(e),
                duration,
                pic
              };
            }).reverse();
          }
          return data.map((e) => {
            const { title, cid, vid, playTitle } = e;
            return {
              cid,
              vid,
              title,
              playTitle,
              videoType: getVideType(e)
            };
          });
        },
        downapp() {
          return new Promise((resolve) => {
            const btn = document.querySelector("button.btn_download");
            resolve(btn ? btn : null);
          });
        }
      },
      pc: {
        container: "#player",
        episode: ".page-content__bottom",
        observer: () => document.querySelector(".playlist-rect"),
        getParseUrl(e) {
          if (e) return location.origin + `/x/cover/${e.cid}/${e.vid}.html`;
          return location.href;
        },
        injectCss() {
          return `
        .play-layout .playlist-intro__actions{ display: none!important; }
        .play-layout .playlist-vip-section__vip { display: none!important; }
        .play-layout .panel-tip-pay.panel-tip-pay-video { display: none!important; }
        `;
        },
        async getEpisodeData() {
          const data = await _.selector("#app", (el) => {
            const pinia = el.__vue__.$pinia;
            const state = pinia.state.value;
            return state.episodeMain.listData[0];
          });
          return data.map(({ pic, ...item }) => ({ ...item, pic: null }));
        },
        selectedDefault(id) {
          return location.href.includes("" + id) ? "active" : "";
        },
        getEpisodeData2(pinia) {
          var _a;
          const list = (_a = pinia.episodeMain) == null ? undefined : _a.listData[0].list.flat();
          if (list.length === 0) return;
          const data = list.filter((e) => (e == null ? undefined : e.cid) && (e == null ? undefined : e.vid)).filter((e) => {
            var _a2;
            return !((_a2 = e == null ? undefined : e.imgTagV2) == null ? undefined : _a2.includes("预告"));
          }).filter((e) => e.isNoStoreWatchHistory === false).map(({ title, pic, cid, vid, playTitle }) => {
            return { cid, vid, title, playTitle, videoType: "" };
          });
          return data;
        }
      },
      getEpisodeStyle() {
        return `
        .pl-episode-list {overflow: hidden; margin-right: -16px;}
        .pl-episode-list ul { display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; gap: 8px; margin-right: 16px; margin-bottom: 10px; overflow-x: scroll; padding-bottom: 10px; }
        .pl-episode-list li { position: relative; width: 51px; height: 51px; color: rgba(0,0,0,1); background-color: rgba(200,230,201, 0.5); text-align: center; font-size: 16px; font-weight: 600; border-radius: 4px; flex-shrink: 0; display: grid; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease-in-out; }
        .pl-episode-list li .vip { position: absolute; top: 0; right: 0; background-color: #ffdf89; color: #663d00; font-size: 10px; font-weight: 600; padding: 0 4px; border-bottom-left-radius: 4px; box-shadow: -2px 2px 5px 0px #d2a52e; }
        .pl-episode-list[pc] h2 { font-weight: 500; font-size: 20px; line-height: 28px; padding: 16px 0 10px 0; color: #78E445; text-emphasis: circle open; }
        .pl-episode-list[pc] li:hover,
        .pl-episode-list li.active { background-color: rgba(80, 220, 20, .8); }
      `;
      },
      injectCss() {
        const id = "vplayer-inject-style-css";
        createStyle(id, platfrom.injectCss(), document.head);
        createStyle(id, this.getEpisodeStyle(), document.head);
      },
      ulScorllHandler(r, e) {
        const { scrollLeft } = e;
        const scroller = document.querySelector(".b-scroll__scroller");
        scroller && (scroller.scrollLeft = scrollLeft);
      },
      ulHandler(target) {
        if (target.tagName !== "LI") return;
        const { url, cid, vid, title } = target.dataset;
        renderIframe(url);
        const href = _.isMobile() ? `/x/m/play?cid=${cid}&vid=${vid}` : `/x/cover/${cid}/${vid}.html`;
        history.pushState(null, "", href);
        const el = target.closest("ul");
        selectedLine(el, (e) => e === target, "active");
        let r, t;
        if (_.isMobile()) {
          r = document.querySelector(".video-desc-long__title");
          t = "" + title;
        } else {
          r = el.querySelector("h2");
          t = `VIP助手全集 - ${title}`;
        }
        r.textContent = t;
      },
      async init() {
        this.injectCss();
        await renderEpisode();
        const el = platfrom.observer();
        const handler = async () => await renderEpisode();
        createObserver(el, handler);
        const btn = await this.mobile.downapp();
        if (btn) {
          btn.textContent = "返回";
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            history.go(-1);
          });
        }
      }
    };
    const iqiyi = {
      mobile: {
        container: ".m-video-player",
        injectCss() {
          return `
          /* iqiyi */
          .m-video-player-wrap .m-video-player:before { padding-top: 0;}
        `;
        },
        getParseUrl() {
          return location.href;
        }
      },
      pc: {
        container: ".iqp-player-videolayer-inner",
        episode: ".iqp-player",
        getParseUrl() {
          return location.href;
        },
        injectCss() {
          return `
        /* iqiyi */
        .iqp-loading-layer,
        [class^="covers_cloudCover__"],
        #qy_pca_login_root,
        #full_mask_layer_id { display: none!important; }
        `;
        }
      },
      getEpisodeStyle() {
        return `
        /* iqiyi */
        .iqp-player { height: calc(100% - 60px); }
        .iqp-player .pl-episode-list { weight: 100%; height: 60px; }

        .pl-episode-list {overflow: hidden;}
        .pl-episode-list ul { display: flex; flex-direction: row; flex-wrap: nowrap; align-items: center; gap: 8px; margin-bottom: 10px; overflow-x: scroll; padding-bottom: 10px; }
        .pl-episode-list li { position: relative; width: 51px; height: 51px; color: rgba(0,0,0,1); background-color: rgba(0, 0, 0, 0.1); text-align: center; font-size: 16px; font-weight: 600; border-radius: 4px; flex-shrink: 0; display: grid; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease-in-out; }
        .pl-episode-list li .vip { position: absolute; top: 0; right: 0; background-color: #ffdf89; color: #663d00; font-size: 10px; font-weight: 600; padding: 0 4px; border-bottom-left-radius: 4px; box-shadow: -2px 2px 5px 0px #d2a52e; }
        .pl-episode-list[pc] h2 { font-weight: 500; font-size: 20px; line-height: 28px; padding: 16px 0 10px 0; color: #78E445; text-emphasis: circle open; }
        .pl-episode-list[pc] li { color: rgba(255,255,255,.6); background-color: rgba(255,255,255, 0.2);}
        .pl-episode-list li.active { background-color: rgba(0, 154, 255, 1); }
      `;
      },
      setWrapUrl() {
        const params = {
          ht: 2,
          ischarge: true,
          lt: 2,
          tvname: "冬至第14集",
          vid: "263ffc58c84f3a2f49933e50eba46d73",
          vtype: 0,
          f_block: "selector_bk",
          s2: "wna_tvg_1st",
          s3: "wna_tvg_select",
          s4: 14
        };
        const { origin, pathname } = location;
        const query = toQuery(params);
        return `${origin}${pathname}?${query}`;
      },
      init() {
        const id = "vplayer-inject-style-css";
        createStyle(id, platfrom.injectCss(), document.head);
        createStyle(id, this.getEpisodeStyle(), document.head);
        const container = document.querySelector(".episode-container");
        if (!container) return;
        container.addEventListener("click", function(e) {
          const target = e.target;
          if (target.tagName === "SPAN") {
            logger("🍇 iqiyi episode click");
            console.log("%c Line:171 🍋 target", "color:#465975", target);
            const parseUrl = location.href;
            renderIframe(parseUrl);
          }
        });
      }
    };
    const youku = {
      mobile: {
        container: "#player",
        episode: ".anthologyStageContainer",
        reactHandler: { onClick: () => {
        } },
        reactInstance: { key: "", index: 0 },
        injectCss() {
          return `
        .callEnd_box,
        .h5-detail-info .brief-btm,
        .h5-detail-guide,
        .h5-detail-vip-guide { display: none!important; }
        #app .h5-detail-info .brief-title .module-name h1{ color: #fff; overflow-x: visible; }
        #app .anthologyStageContainer{ margin-bottom: 24px;}
        #app .anthologyContainer .anthologyStageStyle0 { width: 60px; height: 60px; margin: 10px 4px; }
        `;
        },
        setActive(target) {
          var _a, _b, _c;
          const actName = "stageActive";
          const prev = (_a = target.parentElement) == null ? undefined : _a.querySelector(`.${actName}`);
          if (prev) {
            prev.classList.remove(actName);
            let index = prev.dataset.index, sibling = prev.previousElementSibling;
            sibling && (index = sibling.dataset.index);
            const t = document.createTextNode(index);
            (_b = prev.firstChild) == null ? undefined : _b.remove();
            prev.insertBefore(t, prev.firstChild);
          }
          const img = document.createElement("img");
          img.src = "https://gw.alicdn.com/imgextra/i3/O1CN011A7lv81d4P0s7XneB_!!6000000003682-1-tps-72-72.gif";
          img.className = "icon-playing";
          img.alt = "正在播放";
          img.setAttribute("aria-hidden", "true");
          target.classList.add(actName);
          (_c = target.firstChild) == null ? undefined : _c.remove();
          target.insertBefore(img, target.firstChild);
        },
        getEpisodeData() {
          const fn = (e) => e.componentId === "h5-detail-anthology";
          const pinia = window.__INITIAL_DATA__.pinia;
          const dataNode = pinia.componentList.find(fn).dataNode;
          if (!dataNode.length) return;
          const data = dataNode == null ? undefined : dataNode.map((e, i) => ({
            title: "" + (i + 1),
            vid: e.data.action.value
          }));
          return data;
        },
        initReactNode(e) {
          for (let k in e) {
            if (k.startsWith("__reactInternalInstance")) {
              this.reactInstance = e[k];
              e[k].onClick = () => {
              };
            } else if (k.startsWith("__reactEventHandlers")) {
              this.reactHandler = e[k];
            }
          }
        },
        observer() {
          let self2 = this;
          let ul = document.querySelector(this.episode);
          Array.from(ul.children).forEach((e, i) => {
            e.setAttribute("data-index", (i + 1).toString());
            for (let k in e) {
              if (k.startsWith("__reactEventHandlers")) {
                e[k].onClick = () => {
                };
              }
            }
          });
          ul == null ? undefined : ul.addEventListener("click", function(e) {
            e.preventDefault();
            const target = e.target;
            if (target.classList.contains("anthologyStageStyle0")) {
              self2.setActive(target);
              self2.initReactNode(target);
              const data = self2.getEpisodeData();
              const index = Number(target.dataset.index) || 0;
              const { vid } = data[index];
              target.setAttribute("data-index", index.toString());
              const parseUrl = location.origin + `alipay_video/id_${vid}.html`;
              history.pushState(null, "", parseUrl.replace(location.origin, ""));
              renderIframe(parseUrl);
            }
          });
        }
      },
      pc: {
        container: "#ykPlayer",
        episode: ".new-box-anthology-items",
        injectCss() {
          return `
          /* youku */
          #checkout_counter_popup, #checkout_counter_mask,
          .youku-advertise-layer,
          .advertise-layer { display: none!important; }
        `;
        },
        observer() {
          const el = document.querySelector(this.episode);
          el.addEventListener("click", (e) => {
            e.preventDefault();
            let a = e.target;
            if (a.tagName === "SPAN") a = a.parentNode;
            if (a.tagName === "A") {
              renderIframe(a.href);
            }
          });
        }
      },
      init() {
        platfrom.injectCss && platfrom.injectCss();
        platfrom.observer();
        renderIframe(location.href);
      }
    };
    const mgtv = {
      mobile: {
        container: ".mg-video",
        episode: ".swiper-video-list",
        getParseUrl() {
          return location.href;
        },
        observer() {
          const el = document.querySelector(this.episode);
          const ul = el == null ? undefined : el.querySelector("ul");
          ul == null ? undefined : ul.addEventListener("click", function(e) {
            e.preventDefault();
            const target = e.target;
            if (target.tagName === "A") {
              selectedLine(ul, (e2) => e2 === target.parentNode, "current");
              let parseUrl = target.href;
              history.pushState(null, "", parseUrl.replace(location.origin, ""));
              renderIframe(parseUrl);
            }
          });
        },
        injectCss() {
          return `
        .mg-video {display: block!important;}
        .vip-no-try,
        .video-area-bar,
        .ad-banner,
        .video-about,
        .bottom-fixed-functional-bar,
        .open-app-popup { display: none!important; }
        `;
        }
      },
      pc: {
        container: ".mgtv-player-container",
        episode: ".episode",
        observer() {
          const ul = document.querySelector(this.episode);
          ul == null ? undefined : ul.addEventListener("click", function(e) {
            e.preventDefault();
            const target = e.target;
            if (target.tagName === "A") {
              selectedLine(ul, (e2) => e2 === target.parentNode, "focus");
              const parseUrl = target.href;
              logger("pc episode click: " + parseUrl);
              history.pushState(null, "", parseUrl.replace(location.origin, ""));
              renderIframe(parseUrl);
            }
          });
        },
        injectCss() {
          return `
          /* mgtv */
          mango-ad-layer,
          mango-ad-outter-layer,
          .as_stage-item{ display: none!important; }
        `;
        }
      },
      init() {
        platfrom.observer();
        platfrom.injectCss();
      }
    };
    const le = {
      mobile: {
        container: ".video-player"
      },
      pc: {
        container: "#video",
        getParseUrl() {
          return location.href;
        }
      },
      init() {
        platfrom.injectCss && platfrom.injectCss();
      }
    };
    const tudou = {
      mobile: {
        container: ""
      },
      pc: {
        container: ""
      },
      init() {
        toast("本站待开发中...");
      }
    };
    const bilibili = {
      mobile: {
        container: ""
      },
      pc: {
        container: ""
      },
      init() {
        platfrom.injectCss && platfrom.injectCss();
        toast("本站待开发中...");
      }
    };
    const sources = {
      qq,
      iqiyi,
      youku,
      mgtv,
      le,
      tudou,
      bilibili
    };
    let epk = _.getPlatfromEnterprise();
    let epp = sources[epk];
    let platfrom = epp[_.getPlatfrom()];
    let iframe = null;
    _.waitTime(800).then(async () => {
      logger("🔥 VIP助手启动");
      if (!epk) {
        toast("【VIP助手】暂不支持该平台");
        return;
      }
      console.log(epp, platfrom);
      await epp.init();
    });
    function selectedLine(node, filter, active) {
      var _a;
      (_a = node.querySelector(`.${active}`)) == null ? undefined : _a.classList.remove(active);
      Array.from(node.children).forEach((e) => {
        filter(e) && e.classList.add(active);
      });
    }
    function createIframe(url) {
      const iframe2 = document.createElement("iframe");
      iframe2.setAttribute("allowfullscreen", "true");
      iframe2.setAttribute("allowtransparency", "true");
      iframe2.setAttribute("allow", "encrypted-media; picture-in-picture");
      iframe2.src = url;
      const style = {
        position: "absolute",
        "z-index": Date.now().toString(),
        width: "100%",
        height: "100%",
        border: "none"
      };
      iframe2.setAttribute("style", otos(style));
      return iframe2;
    }
    function renderIframe(url, closed) {
      let lineUrl = cookie.read("__lineUrl", "https://jx.xmflv.com/?url=");
      const hybridUrl = `${lineUrl}${url}`;
      if (iframe) {
        iframe.src = hybridUrl;
        closed && closed();
        return;
      }
      iframe = createIframe(hybridUrl);
      const player = document.querySelector(platfrom.container);
      clearChildNodes(player);
      player.parentNode && clearChildNodes(player.parentNode, (e) => e !== player);
      if (platfrom.injectCss) {
        const style = document.createElement("style");
        style.innerHTML = platfrom.injectCss();
        player == null ? undefined : player.appendChild(style);
      }
      player == null ? undefined : player.appendChild(iframe);
      closed && closed();
    }
    function clearChildNodes(node, filter = () => true) {
      while (node.firstChild && filter(node.firstChild)) {
        node.removeChild(node.firstChild);
      }
    }
    function createItemNode(item) {
      const r = [];
      let u = platfrom.getParseUrl(item), t = item.playTitle ? `${item.playTitle}` : item.title, p = item.pic || "", st = item.videoSubtitle || item.playTitle || item.title, on = "";
      if (platfrom.selectedDefault) {
        on = platfrom.selectedDefault(item.vid);
        on && r.push(`class="${on}"`);
      }
      r.push(`data-url="${u}"`);
      r.push(`data-title="${t}"`);
      r.push(`title="${st}"`);
      r.push(`data-cid="${item.cid}"`);
      r.push(`data-vid="${item.vid}"`);
      p && r.push(
        `style="background-image:url(${p});background-size:cover;width:146px;height:84px;font-size:12px;color:#fff;"`
      );
      let v = item.videoType ? `<div class="vip">${item.videoType}</div>` : "";
      return `<li ${r.join(" ")}>${item.title}${v}</li>`;
    }
    async function createEpisodeNode() {
      const cls = "pl-episode-list";
      const clsNode = document.querySelector(`.${cls}`);
      if (clsNode) clsNode.remove();
      const el = document.createElement("div");
      el.setAttribute(_.getPlatfrom(), "");
      el.className = cls;
      if (_.getPlatfrom() === "pc") {
        const h2 = document.createElement("h2");
        h2.textContent = "VIP助手全集";
        el.appendChild(h2);
      }
      const ul = document.createElement("ul");
      const data = await platfrom.getEpisodeData();
      const items = data.reverse().map(createItemNode);
      ul.innerHTML = items.join("");
      el.appendChild(ul);
      ul.addEventListener("click", function({ target }) {
        epp.ulHandler && epp.ulHandler(target);
      });
      if (epp.ulScorllHandler) {
        ul.addEventListener("scroll", async function({ target }) {
          epp.ulScorllHandler(this, target);
        });
      }
      return el;
    }
    async function renderEpisode() {
      const node = document.querySelector(platfrom.episode);
      if (!node) return;
      const el = await createEpisodeNode();
      if (_.isMobile()) {
        node.parentNode.insertBefore(el, node);
      } else {
        node.insertBefore(el, node.firstChild);
      }
    }
    function App() {
      const dialog = require$$0.useRef(null);
      const [cols, setCols] = require$$0.useState(5);
      const onClose = () => {
        var _a;
        return (_a = dialog.current) == null ? undefined : _a.close();
      };
      function onShow() {
        var _a;
        (_a = dialog.current) == null ? undefined : _a.showModal();
        const episodeEl = document.querySelector(".pl-episode-list");
        !episodeEl && Promise.resolve().then(renderEpisode);
        const lineUrl = cookie.read("__lineUrl");
        if (lineUrl) {
          selectedLine(dialog.current, (e) => e.dataset.line === lineUrl, "active");
        }
      }
      function onPlayer(event) {
        const target = event.target;
        const lineUrl = target.dataset.line;
        if (lineUrl.includes("dyxs20.com")) {
          window.open(lineUrl);
          return;
        }
        cookie.write("__lineUrl", lineUrl);
        selectedLine(target.parentElement, (e) => e === target, "active");
        let parseUrl;
        try {
          parseUrl = lineUrl.includes("pl.aszzys.com") ? epp.pc.getParseUrl() : platfrom.getParseUrl();
        } catch (error) {
          parseUrl = location.href;
        }
        if (location.pathname === "/") {
          onClose();
          toast("请在详情页进行播放");
          return;
        }
        renderIframe(parseUrl, onClose);
      }
      const ulStyle = {
        "--cols": cols,
        height: `${_.getLines(lines).length / cols * 50}px`
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "App", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: onShow, children: "VIP助手" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dialog", { ref: dialog, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "解析线路" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "close", onClick: () => onClose(), children: "×" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "body", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { style: ulStyle, children: _.getLines(lines).map((line) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { "data-line": line.url, onClick: onPlayer, children: line.name }, line.name)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "footer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "注意：不要进行任何形式的支付，注意自身财产安全。" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "助手内所有的广告均是解析官方自带，请直接忽略。" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "部分线路可能存在卡顿，解析慢的问题，可以选择【电影先生】线路中观看，可以获得更好的体验。" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "腾讯视频：VIP助手自带集数解析，集数倒序播放，同自带的集数联动。(如未出现请刷新页面)" })
          ] })
        ] })
      ] });
    }
    const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": false, "VITE_HUA_VPLAYER_KEY": "monkey-hua-vplayer-popup", "VITE_START_TIME": "2024-12-21 19:16:37" };
    const { VITE_HUA_VPLAYER_KEY } = __vite_import_meta_env__;
    function getShadowRoot() {
      const shadowApp = (() => {
        const app = document.createElement("div");
        app.id = VITE_HUA_VPLAYER_KEY;
        app.attachShadow({ mode: "open" });
        document.body.parentElement.appendChild(app);
        return app;
      })();
      const shadowRoot = shadowApp.shadowRoot;
      const selector = `style[id=${VITE_HUA_VPLAYER_KEY}-style-css]`;
      const target = document.querySelector(selector);
      if (target) {
        const style = document.createElement("style");
        style.textContent = target.textContent;
        shadowRoot.appendChild(style);
      }
      return shadowRoot;
    }
    ReactDOM.createRoot(getShadowRoot()).render(/* @__PURE__ */ jsxRuntimeExports.jsx(App, {}));
  });

})();