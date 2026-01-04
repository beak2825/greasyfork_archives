// ==UserScript==
// @name         M站_哔咪动漫脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       Feny
// @description  哔咪动漫｜E站弹幕网｜饭团动漫，快捷键(T)切换线路。
// @license      MIT
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAICAgACAgIAAwMDAAoKCgAAAABZAAAAwgAAAIsAAAAWAAAAAAAAAAAAAAAAAAAAAAICAgABAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAABnAAAAxQAAAH8AAAAOAQEBAAEBAQAGBgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQUFBQICAicDAwM6AQEBSQAAANIAAAD+AAAA7gAAAHgAAAA8AAAAPAAAADwAAAA8AgICPAEBATwAAAA8AAAAPAAAADwAAAA8AAAATwAAAN4AAAD+AAAA6gEBAWgBAQE7AQEBLAoKCgsAAAAAAAAAAAAAAAAAAAAAAQEBAAAAABEAAAByAAAAwQAAAN8AAADmAAAA+wAAAP8AAAD+AAAA7QAAAOIAAADiAAAA4gAAAOIBAQHiAAAA4gAAAOIAAADiAAAA4gAAAOIAAADmAAAA/QAAAP8AAAD+AAAA6gAAAOEAAADKAQEBhAAAAB8AAAAAAAAAAAAAAAABAQEIAAAAgwAAAPIICAj/ISEh/zo6Ov9AQED/PDw8/zw8PP88PDz/Ozs7/zs7O/87Ozv/PDw8/0BAQP88PDz/Ozs7/zs7O/88PDz/PDw8/zw8PP88PDz/PDw8/zw8PP8+Pj7/KSkp/wgICP8BAQH4AAAAmwAAABgHBwcAAAAAAAICAkYAAADjEBAQ/3BwcP/Ozs7/3Nzc/9/f3//d3d3/3d3d/93d3f/d3d3/3d3d/93d3f/d3d3/3t7e/97e3v/d3d3/3d3d/93d3f/d3d3/3d3d/93d3f/d3d3/3Nzc/97e3v/T09P/k5OT/yIiIv8AAAD0AQEBXQQEBAMAAAAAAgICkgkJCfxiYmL/7u7u////////////////////////////////////////////////////////////+fn5///////////////////////////////////////////////////////5+fn/i4uL/woKCv8AAACsAAAADwAAAAAICAi2FBQU/6ysrP/////////////////////////////////+/v7//v7+//7+/v/+/v7///////v7+/+wsLD/1dXV/////////////////////////////v7+//7+/v/+/v7//v7+///////AwMD/Kioq/wAAANYAAAAcAAAAAAAAAL8WFhb/vb29//z8/P///////////////////////v7+//39/f/+/v7//v7+//7+/v//////9PT0/0tLS/+enp7//v7+/////////////v7+//7+/v/+/v7//v7+//7+/v/+/v7//////8/Pz/81NTX/AAAA4AAAACIAAAAAAgICvxUVFf/AwMD//f39///////////////////////8/Pz/+/v7//39/f///////f39//39/f/q6ur/Pj4+/7Kysv/+/v7////////////9/f3//f39//39/f/8/Pz//v7+//7+/v//////y8vL/zAwMP8AAADgAAAAIgAAAAAEBAS/FBQU/8LCwv////////////////////////////7+/v/+/v7/+/v7//r6+v/9/f3//f39/+Dg4P86Ojr/w8PD//////////////////n5+f/7+/v//f39//z8/P/+/v7//v7+///////Ly8v/Ly8v/wAAAOAAAAAiAAAAAAMDA78UFBT/wsLC//////////////////39/f/u7u7/9/f3///////+/v7/9/f3/97e3v/19fX/zs7O/zk5Of/S0tL//v7+//7+/v/8/Pz/wcHB/729vf/+/v7//f39//7+/v/+/v7//////8zMzP8vLy//AAAA4AAAACIAAAAAAwMDvxQUFP/CwsL/////////////////6Ojo/25ubv/Dw8P///////39/f/c3Nz/WVlZ/8HBwf/BwcH/SkpK/97e3v/+/v7//f39//r6+v9oaGj/bW1t//39/f/+/v7/////////////////zMzM/zAwMP8AAADgAAAAIgAAAAADAwO/FBQU/8LCwv/////////////////j4+P/Pj4+/56env///////v7+/+zs7P+jo6P/3t7e/+Dg4P+srKz/7+/v///////+/v7/+/v7/2dnZ/9VVVX/+Pj4///////////////////////MzMz/MTEx/wAAAOAAAAAiAAAAAAMDA78UFBT/wsLC/////////////////93d3f8fHx//fn5+//z8/P/////////////////+/v7//Pz8//7+/v/8/Pz///////39/f/x8fH/RkZG/zExMf/g4OD//////////////////////83Nzf8yMjL/AAAA4AAAACIAAAAAAwMDvxQUFP/CwsL//v7+///////39/f/r6+v/wwMDP8+Pj7/w8PD//39/f/8/Pz///////7+/v/8/Pz//f39//39/f/8/Pz/+/v7/7W1tf8rKyv/Ly8v/4aGhv/29vb/////////////////zMzM/zAwMP8AAADgAAAAIgAAAAADAwO/FBQU/8LCwv/6+vr/7u7u/7W1tf9KSkr/ZmZm/3l5ef9AQED/kZGR/+zs7P/8/Pz/////////////////+/v7/+Xl5f+qqqr/RERE/3x8fP+kpKT/ODg4/3p6ev/e3t7/+/v7///////MzMz/MDAw/wAAAOAAAAAiAAAAAAQEBL8UFBT/xsbG/8vLy/9SUlL/Ghoa/0xMTP/g4OD/6enp/2NjY/8eHh7/tLS0//z8/P/+/v7////////////n5+f/WVlZ/xQUFP9vb2//7e3t//j4+P+ampr/Hh4e/1ZWVv/t7e3//////87Ozv81NTX/AAAA4AEBASIAAAAAAwMDvxQUFP/ExMT/4ODg/5WVlf9eXl7/Ozs7/6+vr/+1tbX/Q0ND/3Jycv/Y2Nj/+/v7//////////////////Dw8P+SkpL/RkZG/1ZWVv/V1dX/xsbG/05OTv9GRkb/qamp//j4+P//////zc3N/zMzM/8AAADgAQEBIgAAAAABAQG/FxcX/8HBwf////////////Pz8/+Ojo7/NDQ0/0ZGRv+EhIT/9/f3///////////////////////////////////////c3Nz/WFhY/1hYWP9ISEj/Z2dn/97e3v/////////////////MzMz/MTEx/wAAAOAAAAAiAAAAAAAAAL4UFBT/vb29//z8/P/9/f3//////+Hh4f8qKir/Nzc3/9PT0////////////////////////////////////////f39//////+wsLD/Ghoa/0lJSf/k5OT//////////////////////8vLy/8wMDD/AQEB3wMDAyEAAAAAAAAAsAsLC/+VlZX/+/v7//7+/v//////6urq/0lJSf9paWn/8fHx///////////////////////////////////////+/v7//f39/8fHx/8tLS3/lpaW////////////////////////////ra2t/xoaGv8CAgLPBQUFGAAAAAAAAAB/BgYG+D09Pf/R0dH/9/f3//v7+//7+/v/4eHh/+jo6P//////////////////////////////////////////////////////8vLy/7i4uP/r6+v//////////////////v7+/93d3f9XV1f/AgIC/wEBAZgBAQELAAAAAAAAAC4EBATRCwsL/z8/P/+cnJz/tbW1/7Kysv+3t7f/t7e3/7e3t/+3t7f/t7e3/7e3t/+3t7f/t7e3/7e3t/+3t7f/t7e3/7e3t/+3t7f/tbW1/7e3t/+3t7f/tra2/7W1tf+np6f/UFBQ/wMDA/8AAADkAQEBRAAAAAEAAAAAAAAAAwMDA1wHBwfaBwcH/wgICP8NDQ3/Dw8P/w4ODv8ODg7/Dg4O/w4ODv8ODg7/Dg4O/w4ODv8ODg7/Dg4O/w4ODv8ODg7/Dg4O/w4ODv8ODg7/Dg4O/w4ODv8MDAz/CgoK/wsLC/8AAAD/AAAA5wAAAHIAAAAMAAAAAAAAAAAAAAAAAAAABQEBAUYDAwORAgICsgEBAbUBAQG1AAAAtQAAALUAAAC2AAAA6AAAAP8AAADzAAAAxAAAALQAAAC0AAAAuwAAAOcAAAD/AAAA9QAAAMAAAAC0AAAAtQEBAbUCAgK1AAAAswAAAJsAAABVAAAADQAAAAAAAAAAAAAAAAAAAAABAQEABAQEAAEBAQwBAQEcBQUFHgMDAx4BAQEeAQEBIQAAAHYAAADrAAAA9AAAAJABAQEnAQEBHgEBAR4BAQEhAQEBZwAAAOMAAAD6AAAAnAEBASsCAgIeBQUFHgkJCR4CAgIdAAAAEQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICAAEBAQAEBAQAAwMDAAAAAAIAAABRAAAA2AAAAPYAAACTAAAAFgEBAQABAQEAAQEBAAEBAQAAAAAHAAAAaQAAAOYAAADuAAAAegAAAAoEBAQABwcHAAICAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANAAAANoAAAD2AAAAlwAAABYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAbQAAAOgAAADvAAAAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAxgAAAJIAAAAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAbQAAAMoAAABsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAArAAAAFQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAALwAAABEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/D/wf8AAAA+AAAAHAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAADgAAAB+AAAB/+B4H//g/A//4P4P/+P/H///////////8=
// @homepage     https://github.com/xFeny/UserScript/tree/main/monkey-bimiacg
// @match        *://*bimiacg*.net/
// @match        *://ppoft.com/play*
// @match        *://acgfta.com/play*
// @match        *://*bimiacg*.net/*/play*
// @match        *://player.ezdmw.com/danmuku/*
// @match        *://player.danmuzf.vip/danmuku/*
// @match        *://www.ezdmw.site/Index/video/*
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/539565/M%E7%AB%99_%E5%93%94%E5%92%AA%E5%8A%A8%E6%BC%AB%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/539565/M%E7%AB%99_%E5%93%94%E5%92%AA%E5%8A%A8%E6%BC%AB%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const n=document.createElement("style");n.textContent=t,document.head.append(n)})(" #zhuXian a{margin:0!important;font-size:12px!important}.nav-area{margin-bottom:20px}#bkcl,.newhd,.ABP-Text,.tuiguang,.play-full,.login-box,.line_button2{width:0!important;height:0!important;display:none!important}.ABP-Unit .ABP-Comment-List{display:none!important}.ABP-Unit,.ABP-Unit .ABP-Player{width:100%!important;height:100%!important} ");

(function () {
  'use strict';

  const siteConfigs = {
    index(element) {
      const children = Array.from(element?.parentElement?.children ?? []);
      return children.indexOf(element);
    },
    // E站配置
    ezSite: {
      getRoutes: () => Array.from(document.querySelectorAll("div[class*='line_button']")),
      getCurrentRoute: () => document.querySelector("div[class*='line_button'][style*='rgb']"),
      switchRoute: (routes, currentRoute) => routes.find((route) => route !== currentRoute)?.click()
    },
    // 饭团动漫配置
    fanTuan: {
      getCurrentRoute: () => document.querySelector(".anime-episode.active"),
      switchRoute(currentRoute, self) {
        let nextRoute = currentRoute?.nextElementSibling;
        if (!nextRoute) nextRoute = currentRoute.parentElement.firstElementChild;
        const index = self.index(document.querySelector("a[class*='btn-episode active']"));
        nextRoute.children[index].click();
      }
    },
    // 哔咪动漫配置
    bimi: {
      getRoutes: () => Array.from(document.querySelectorAll(".play_box")),
      getCurrentEpisode: () => document.querySelector(`a[href="${location.pathname}"]`)?.parentElement,
      switchRoute(routes, currentEpisode, self) {
        const currentRouteIndex = routes.findIndex((route) => route.classList.contains("show"));
        let nextRouteIndex = currentRouteIndex + 1;
        if (nextRouteIndex >= routes.length) nextRouteIndex = 0;
        const currentEpisodeIndex = self.index(currentEpisode);
        const episodes = routes[nextRouteIndex]?.querySelectorAll("li");
        episodes[currentEpisodeIndex]?.firstElementChild?.click();
      }
    }
  };
  const MSG_SOURCE = "FENY_SCRIPTS_ANIME";
  const settings = { volume: 1, opacity: 0.88, autoPlay: true, defaultWide: true };
  const App = {
    init() {
      this.videoSetting();
      this.setupMutationObserver();
      this.setupKeydownListener();
    },
    setupMutationObserver() {
      const observer = new MutationObserver(() => {
        document.querySelector(".line_button2")?.remove();
        document.querySelector(".ABP-Unit")?.removeAttribute("style");
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 5e3);
    },
    isFanTuan: () => location.host.includes("ft"),
    isEzSite: () => location.host.includes("ezdmw"),
    isBimi: () => location.host.includes("bimiacg"),
    postMessage: (data) => parent?.postMessage({ source: MSG_SOURCE, ...data }, "*"),
    videoSetting() {
      settings.theme = this.isBimi() ? "bilibili" : "YouTube";
      const storage = JSON.parse(localStorage.getItem("html5Settings"));
      localStorage.setItem("html5Settings", JSON.stringify(Object.assign({}, storage, settings)));
    },
    setupKeydownListener() {
      window.addEventListener("keydown", (event) => {
        const hotKey = event.key.toUpperCase();
        if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;
        if (window.top !== window) return this.postMessage({ hotKey }, "*");
        this.execHotKeyActions(hotKey);
      });
      window.addEventListener("message", ({ data }) => {
        if (!data?.source?.includes(MSG_SOURCE)) return;
        if (data?.hotKey) this.execHotKeyActions(data.hotKey);
      });
    },
    execHotKeyActions(key) {
      const actions = this.getKeyMapping();
      if (actions[key]) actions[key]();
    },
    getKeyMapping() {
      return {
        T: () => {
          if (this.isEzSite()) {
            const routes = siteConfigs.ezSite.getRoutes();
            const currentRoute = siteConfigs.ezSite.getCurrentRoute();
            siteConfigs.ezSite.switchRoute(routes, currentRoute);
          }
          if (this.isFanTuan()) {
            const currentRoute = siteConfigs.fanTuan.getCurrentRoute();
            siteConfigs.fanTuan.switchRoute(currentRoute, siteConfigs);
          }
          if (this.isBimi()) {
            const routes = siteConfigs.bimi.getRoutes();
            const currentEpisode = siteConfigs.bimi.getCurrentEpisode();
            siteConfigs.bimi.switchRoute(routes, currentEpisode, siteConfigs);
          }
        }
      };
    }
  };
  App.init();

})();