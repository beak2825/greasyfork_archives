// ==UserScript==
// @name         高考直通车限制解除
// @description  无需下载APP，直接查看试卷/答案
// @namespace    https://greasyfork.org/users/197529
// @version      0.0.4
// @author       kkocdko
// @license      Unlicense
// @match        *://app.gaokaozhitongche.com/newsexam/h/*
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/420594/%E9%AB%98%E8%80%83%E7%9B%B4%E9%80%9A%E8%BD%A6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/420594/%E9%AB%98%E8%80%83%E7%9B%B4%E9%80%9A%E8%BD%A6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==
"use strict";

const { addFloatButton } = {
  addFloatButton(text, onclick) /* 20220324-0950 */ {
    if (!document.addFloatButton) {
      const host = document.body.appendChild(document.createElement("div"));
      const root = host.attachShadow({ mode: "open" });
      root.innerHTML = `<style>:host{position:fixed;top:4px;left:4px;z-index:2147483647;height:0}#i{display:none}*{float:left;padding:1em;margin:4px;line-height:0;color:#fff;user-select:none;background:#28e;border:1px solid #fffa;border-radius:8px;transition:.3s}[for]~:active{background:#4af;transition:0s}:checked~*{opacity:.3;transform:translateY(-3em)}:checked+*{transform:translateY(3em)}</style><input id=i type=checkbox><label for=i>`;
      document.addFloatButton = (text, onclick) => {
        const el = document.createElement("label");
        el.textContent = text;
        el.addEventListener("click", onclick);
        return root.appendChild(el);
      };
    }
    return document.addFloatButton(text, onclick);
  },
};

addFloatButton("直接查看内容", () => {
  document
    .querySelectorAll("img[data-imgsrc]")
    .forEach((e) => (e.src = e.dataset.imgsrc));
  document.body.innerHTML =
    "<style>img{max-width:100%}</style>" +
    document.querySelector("#content-box>.wrap-box").innerHTML;
});
