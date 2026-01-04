// ==UserScript==
// @name         安全教育平台自动答题
// @description  支持安全课程、专题活动、互动视频
// @namespace    https://greasyfork.org/users/197529
// @version      0.9.4
// @author       kkocdko
// @license      Unlicense
// @match        *://*.xueanquan.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/372426/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/372426/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
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

addFloatButton("自动完成", async function () {
  this.textContent = "正在运行";
  this.style.background = "#ff9800";
  if (document.querySelector(".choseArea")) {
    // interactive video
    while (!document.querySelector(".seminar_nav .finish:not(.normal)")) {
      for (const el of document.querySelectorAll(".choseArea :first-child"))
        el.click();
      for (const el of document.querySelectorAll("video")) {
        el.volume = 0;
        el.currentTime = 2147483647;
        el.play();
      }
      await new Promise((r) => setTimeout(r, 900));
    }
  } else {
    // paper or exam
    const specTopic = location.host.indexOf("huodong.") === 0;
    for (const el of document.querySelectorAll("input:not(:checked)")) {
      if (!specTopic) el.value = 1;
      el.click();
    }
    scroll(0, 9e9);
    scrollBy(0, -0.3 * innerHeight);
  }
  this.textContent = "运行结束";
  this.style.background = "#4caf50";
});
