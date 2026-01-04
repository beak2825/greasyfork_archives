// ==UserScript==
// @name        外链直转
// @namespace   https://github.com/jin-lin0/tampermonkey-demo
// @version     0.7
// @description 2023/9/20 21:55:23
// @author      logyes
// @license     MIT

// @run-at       document-start

// @match       *://link.zhihu.com/*
// @match       *://link.juejin.cn/*
// @match       *://sspai.com/link*
// @match       *://blog.51cto.com/transfer*
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/475750/%E5%A4%96%E9%93%BE%E7%9B%B4%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/475750/%E5%A4%96%E9%93%BE%E7%9B%B4%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function loading() {
    let loadingElement = document.createElement("div");
    loadingElement.classList.add("loading");

    document.body.innerHTML = "";
    document.body.appendChild(loadingElement);

    let styleElement = document.createElement("style");
    styleElement.innerHTML = `
    body{
        height: 100vh;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loading{
        width: 100px;
        height: 100px;
        background: conic-gradient(#2b6ee0, #bf6ee7,#2b6ee0);
        -webkit-mask: radial-gradient( closest-side circle, royalblue 99%, transparent 100%) center top/25% 25% no-repeat,
        radial-gradient( closest-side circle, transparent 50%, red 51% 99%, transparent 100%),
        conic-gradient(transparent 10%, royalblue 90%);
        -webkit-mask-composite: source-over, source-in;
        animation: rotate 1s linear infinite;
    }

    @keyframes rotate{
        to{
            transform: rotate(360deg);
        }
    }
  `;
    document.head.appendChild(styleElement);
  }

  const websiteMap = new Map([
    ["link.zhihu.com/", { searchStr: "target" }],
    ["link.juejin.cn/", { searchStr: "target" }],
    ["blog.51cto.com/transfer", { searchStr: "" }],
    ["sspai.com/link", { searchStr: "target" }],
  ]);

  const hostnameAndPath = window.location.hostname + window.location.pathname;
  const searchParams = Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
  const searchConfig = websiteMap.get(hostnameAndPath);
  let searchUrl =
    searchParams[searchConfig.searchStr] || Object.keys(searchParams)[0];
  window.location.href = decodeURIComponent(searchUrl);
  loading();
})();
