// ==UserScript==
// @name         CodePTIT Copier
// @namespace    https://github.com/nvbangg/CodePTIT_Copier
// @version      1.7
// @description  Sửa lỗi dòng trống thừa khi copy Testcase trên CodePTIT
// @author       nvbangg (https://github.com/nvbangg)
// @copyright    Copyright (c) 2025 Nguyễn Văn Bằng (nvbangg, github.com/nvbangg)
// @homepage     https://github.com/nvbangg/CodePTIT_Copier
// @homepage     https://chromewebstore.google.com/detail/codeptit-copier/ncckkgpgiplcmbmobjlffkbaaklohhbo
// @match        https://code.ptit.edu.vn/*
// @icon         https://raw.githubusercontent.com/nvbangg/CodePTIT_Copier/main/src/icon.png
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/536045/CodePTIT%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/536045/CodePTIT%20Copier.meta.js
// ==/UserScript==

//! 📌 Đã ngừng hỗ trợ script này, Cài đặt bản extension để dùng đầy đủ tính năng tại đây:
//! https://chromewebstore.google.com/detail/codeptit-copier/ncckkgpgiplcmbmobjlffkbaaklohhbo

//! 🌐 Xem hướng dẫn chi tiết tại:
//! 🏠 Homepage: https://github.com/nvbangg/CodePTIT_Copier

(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  let LAST_URL = null;
  let processTimer;
  const process = () => {
    const url = location.href;
    if (url === LAST_URL) return;
    LAST_URL = url;

    const { hostname, pathname } = location;
    if (hostname !== "code.ptit.edu.vn") return;
    const isBeta = /\/beta\/problems\/[A-Za-z0-9_]+/.test(pathname);
    const isClassic = /\/student\/question\/[A-Za-z0-9_]+/.test(pathname);
    if (!isBeta && !isClassic) return;

    // thay thẻ p bằng div để Sửa lỗi dòng trống thừa khi copy
    (isBeta ? $$(".problem-container table") : $$(".submit__des table")).forEach((t) => {
      t.querySelectorAll("tbody p").forEach((p) => (p.outerHTML = `<div>${p.innerHTML}</div>`));
    });

    const titleEl = isBeta ? $(".body-header h2") : $(".submit__nav p span a.link--red");
    if (titleEl && !titleEl.dataset.btnAdded) {
      titleEl.dataset.btnAdded = "true";
      const a = document.createElement("a");
      a.textContent = "Cài đặt bản extension";
      a.href = "https://chromewebstore.google.com/detail/codeptit-copier/ncckkgpgiplcmbmobjlffkbaaklohhbo";
      a.target = "_blank";
      a.style.cssText =
        "border:1px solid rgba(30,144,255,.4);color:rgba(30,144,255,.8);background:0;padding:2px 8px;border-radius:8px;cursor:pointer;margin-right:5px;vertical-align:middle;text-decoration:none;display:inline-flex;align-items:center";
      titleEl.insertBefore(a, titleEl.firstChild);
    }
  };

  const start = () => {
    setTimeout(process, 500);
    const observer = new MutationObserver(() => {
      if (location.href !== LAST_URL) {
        clearTimeout(processTimer);
        processTimer = setTimeout(process, 500);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };
  document.readyState !== "loading" ? start() : document.addEventListener("DOMContentLoaded", start);
})();
