// ==UserScript==
// @name         Facebook - Watched photo and then become blue background
// @name:zh-TW   FB - 照片看過背景變藍提示
// @name:ja      Facebook - 写真を見たら背景が青に変わる通知
// @name:ko      Facebook - 사진을 보면 배경이 파란색으로 변하는 알림
// @description:ja 写真を見たら背景が青に変わる通知
// @description:ko 사진을 보면 배경이 파란색으로 변하는 알림.
// @namespace    http://tampermonkey.net/
// @version      7
// @description  Watched photo and then become blue background
// @description:zh-TW 照片看過背景變藍提示
// @author       You
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/502056/Facebook%20-%20Watched%20photo%20and%20then%20become%20blue%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/502056/Facebook%20-%20Watched%20photo%20and%20then%20become%20blue%20background.meta.js
// ==/UserScript==

(async function () {
  const WATCHED = "watched";
  const QUERY_TAG = "div.x6s0dn4.x1ey2m1c.x78zum5.xds687c.x1qughib.x10l6tqk.x17qophe.x13vifvy > div.x1ey2m1c.x9f619.xds687c.x10l6tqk.x17qophe.x13vifvy";
  let oldUrl = "";

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const updateQuick = () => change(false);

  document.addEventListener('click', updateQuick);
  document.addEventListener('keydown', updateQuick);

  change(true);
  setInterval(() => change(true), 500);

  async function change(save) {
    const url = window.location.href.replace(/\//g, "");
    if (oldUrl !== url) {
      oldUrl = url;
      if (url.includes("photo")) {
        const value = localStorage.getItem(url);
        if (save) {
          localStorage.setItem(url, WATCHED);
        }
        const color = (value === WATCHED) ? "blue" : "black";
        document.querySelectorAll(QUERY_TAG).forEach(element => {
          element.style.backgroundColor = color;
        });
      }
    }
  }
})();