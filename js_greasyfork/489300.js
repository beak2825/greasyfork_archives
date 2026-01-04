// ==UserScript==
// @name             Style Fixes for AtCoder
// @name:ja          Style Fixes for AtCoder
// @namespace        https://github.com/roumcha/browser-extensions/tree/main/src/style-fixes-for-atcoder
// @version          2024.7.27
// @description      Forced attempt to fix style issues on the AtCoder web pages.
// @description:ja   AtCoderのウェブサイトの表示崩れを無理やり抑え込む
// @author           Roumcha
// @license          Creative Commons Zero v1.0 Universal
// @match            https://atcoder.jp/*
// @match            https://*.atcoder.jp/*
// @grant            GM.xmlHttpRequest
// @connect          img.atcoder.jp
// @run-at           document-start
// @downloadURL https://update.greasyfork.org/scripts/489300/Style%20Fixes%20for%20AtCoder.user.js
// @updateURL https://update.greasyfork.org/scripts/489300/Style%20Fixes%20for%20AtCoder.meta.js
// ==/UserScript==

"use strict";
(() => {
  // src/style-fixes-for-atcoder/infonav.ts
  function fix() {
    document.addEventListener("DOMContentLoaded", () => {
      if (navigator.userAgent.toLowerCase().includes("mobile")) return;
      const navElement = document.querySelector("#top-editarea header nav");
      const logoDiv = navElement.children[0];
      const hamburgerDiv = navElement.children[1];
      const menuDiv = navElement.children[2];
      hamburgerDiv.remove();
      menuDiv.className = "flex gap-x-12";
    });
  }

  // src/style-fixes-for-atcoder/mediaquery768.ts
  function fix2(fetchFunc) {
    mitigateLayoutShift();
    window.addEventListener("load", () => {
      overwriteStyleElements();
      overrideLinkElements(fetchFunc);
    });
  }
  function mitigateLayoutShift() {
    const styleElement = document.createElement("style");
    styleElement.textContent = `
    @media screen and (767.0px < width < 768.0px){
      .header-logo > img {
        max-width: 40px !important;
      }
      .keyvisual-logo > img {
        max-width: 67px !important;
      }
    }
  `;
    document.head.insertAdjacentElement("afterbegin", styleElement);
  }
  function overwriteStyleElements() {
    for (const styleElement of document.head.getElementsByTagName("style")) {
      if (styleElement.textContent) {
        styleElement.textContent = modifyCss(styleElement.textContent);
      }
    }
  }
  function overrideLinkElements(requestFunc) {
    for (const linkElement of document.head.getElementsByTagName("link")) {
      if (linkElement.rel !== "stylesheet") continue;
      if (!linkElement.href.includes("atcoder")) continue;
      if (linkElement.href.includes("bootstrap")) continue;
      requestFunc(linkElement.href).then((response) => {
        const styleElement = document.createElement("style");
        styleElement.textContent = modifyCss(response);
        linkElement.insertAdjacentElement("afterend", styleElement);
      });
    }
  }
  function modifyCss(css) {
    return css.replace(/(@media[^{]+[0-9]+[13579])()(px[^{]*{)/g, "$1.95$3");
  }

  // src/style-fixes-for-atcoder/multi-line-nav.ts
  function fix3() {
    window.addEventListener("DOMContentLoaded", () => {
      const styleElement = document.createElement("style");
      styleElement.textContent = `
      @media screen and (991px < width){
        .nav .contest-title {
          width: calc((100vw - 80px - 253px) * 0.9);
          text-wrap: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    `;
      document.head.insertAdjacentElement("afterbegin", styleElement);
    });
  }

  // src/style-fixes-for-atcoder/lib.ts
  function fixStyle(options) {
    if (document.head.classList.contains("style-fixed")) return;
    document.head.classList.add("style-fixed");
    if (location.href.startsWith("https://atcoder.jp")) {
      fix2(options.fetchFunc);
    }
    if (location.href.startsWith("https://atcoder.jp/contests/")) {
      fix3();
    }
    if (location.href.startsWith("https://info.atcoder.jp")) {
      fix();
    }
  }

  // src/style-fixes-for-atcoder/user-script.ts
  fixStyle({
    fetchFunc: (url) => GM.xmlHttpRequest({ method: "GET", url }).then(
      (response) => response.responseText
    )
  });
})();
