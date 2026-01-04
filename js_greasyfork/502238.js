// ==UserScript==
// @name         dapanyuntu.better
// @namespace    linux.do/u/io.oi/dapanyuntu.better
// @version      1.0.0
// @author       LINUX.DO
// @description  dapanyuntu better
// @license      MIT
// @icon         https://dapanyuntu.com/favicon.ico
// @match        https://dapanyuntu.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/502238/dapanyuntubetter.user.js
// @updateURL https://update.greasyfork.org/scripts/502238/dapanyuntubetter.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const e=document.createElement("style");e.textContent=t,document.head.append(e)})(" .view{height:64px!important;padding:0!important}.view .view-select{height:100%!important;margin-left:0!important}.view .view-select .column1{height:100%!important;padding:10px!important}.view .fr{height:64px!important;line-height:64px!important;padding-top:0!important}.map-scan .sidebar{height:auto!important;padding:10px!important}.map-scan .sidebar :is(select){width:100%!important} ");

(function () {
  'use strict';

  window.addEventListener("load", () => {
    var _a, _b, _c, _d;
    (_a = document.querySelector("div.view h1")) == null ? void 0 : _a.remove();
    (_b = document.querySelector("div.view h2")) == null ? void 0 : _b.remove();
    (_c = document.querySelector("div.view div.zoom")) == null ? void 0 : _c.remove();
    document.querySelectorAll("div.sidebar3").forEach((el) => el.remove());
    (_d = document.querySelector("div#ss-chat-p")) == null ? void 0 : _d.remove();
  });

})();