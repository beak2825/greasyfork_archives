// ==UserScript==
// @name         ddrk-download
// @namespace    https://github.com/Mrbunker/ddrk-download
// @version      0.0.2
// @author       mission522
// @description  低端影视-下载
// @license      MIT
// @icon         https://ddys.art/favicon-32x32.png
// @match        *://*.ddys.tv/*
// @match        *://*.ddys.art/*
// @match        *://*.ddys.pro/*
// @match        *://*.ddys2.me/*
// @match        *://*.ddys.me/*
// @downloadURL https://update.greasyfork.org/scripts/454713/ddrk-download.user.js
// @updateURL https://update.greasyfork.org/scripts/454713/ddrk-download.meta.js
// ==/UserScript==

(d=>{const o=document.createElement("style");o.dataset.source="vite-plugin-monkey",o.innerText=d,document.head.appendChild(o)})(".ddd-btn{color:#fff;padding:0 15px;cursor:pointer;color:#00b09a}.ddd-btn:hover{color:#006457;text-decoration:underline}.ddd-popup{min-width:100px;min-height:100px;padding:20px;border-radius:20px 0 0;box-shadow:#848484 -1px -1px 8px;background-color:#fff;z-index:998;position:fixed;bottom:0;right:0;transition:all}#afc_sidebar_2842,#iaujwnefhw,#sajdhfbjwhe{position:fixed!important;right:20000px!important}");

(function() {
  "use strict";
  const style = "";
  async function main() {
    var _a;
    const wpScript = (_a = document.querySelector("script.wp-playlist-script")) == null ? void 0 : _a.innerHTML;
    if (!wpScript)
      return;
    const popup = createPopup();
    createBtn(popup, wpScript);
  }
  function createPopup() {
    const popup = document.createElement("div");
    document.body.appendChild(popup);
    popup.classList.add("ddd-popup");
    popup.style.display = "none";
    return popup;
  }
  function createBtn(popup, wpScript) {
    const app = document.createElement("span");
    app.classList.add("ddd-btn");
    app.innerHTML = "下载";
    let firtClick = true;
    app.addEventListener("click", async () => {
      popup.style.display = popup.style.display === "none" ? "block" : "none";
      if (!firtClick)
        return;
      const data = await download(wpScript);
      const popupStr = data.map(
        (item) => `<div><span>${item == null ? void 0 : item.ep}</span> <a href="${(item == null ? void 0 : item.video) ? item == null ? void 0 : item.video : "无"}" >链接</a></div>`
      ).join("");
      popup.innerHTML = popupStr;
      firtClick = false;
    });
    const appWrap = document.querySelector(`.entry>p [style="float:right;"]:not([class])`);
    appWrap.innerHTML = "";
    appWrap == null ? void 0 : appWrap.appendChild(app);
  }
  async function download(wpScript) {
    const tracks = JSON.parse(wpScript).tracks;
    const resources = tracks.map((item) => {
      const regResult = item.src0.match(/^\/v\/((\w*)\/(.*))/);
      return {
        name: regResult ? regResult[1] : "匹配失败",
        ep: item.caption,
        catalog: regResult ? regResult[2] : "匹配失败",
        src1: `${window.location.origin}/getvddr/video?id=${item.src1}&type=mix`
      };
    });
    return await Promise.all(
      resources.map(async (item) => {
        const res = await fetch(item.src1);
        const resJson = await res.json();
        const video = (resJson == null ? void 0 : resJson.url) ? resJson == null ? void 0 : resJson.url.replace("=1", item.name) : void 0;
        return {
          name: item.name,
          ep: item.ep,
          catalog: item.catalog,
          video,
          cache: resJson == null ? void 0 : resJson.cache
        };
      })
    );
  }
  main();
})();
