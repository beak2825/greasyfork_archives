// ==UserScript==
// @name         danmu
// @namespace    npm/vite-plugin-monkey
// @version      0.0.0
// @author       monkey
// @description  将b站弹幕全部变成彩虹弹幕
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.prod.js
// @downloadURL https://update.greasyfork.org/scripts/467792/danmu.user.js
// @updateURL https://update.greasyfork.org/scripts/467792/danmu.meta.js
// ==/UserScript==

(e=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.textContent=e,document.head.append(t)})(" .bpx-player-row-dm-wrap .bili-dm{background:url(http://i0.hdslb.com/bfs/dm/b4f545290caf5a90bd9a96c8d4edefd09bca79bc.png);text-shadow:none;background-clip:text;color:#fff;text-fill-color:#FFFFF;text-stroke:4px transparent;-webkit-background-clip:text;-webkit-text-fill-color:#FFFFF;-webkit-text-stroke:4px transparent;-moz-background-clip:text;-moz-text-fill-color:#FFFFF;-moz-text-stroke:4px transparent;-ms-background-clip:text;-ms-text-fill-color:#FFFFF;-ms-text-stroke:4px transparent}.bpx-player-row-dm-wrap .bili-dm *{background:none!important} ");

(function (vue) {
  'use strict';

  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main = {};
  function _sfc_render(_ctx, _cache) {
    return null;
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
  vue.createApp(App).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );

})(Vue);
