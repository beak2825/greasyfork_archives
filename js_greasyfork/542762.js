// ==UserScript==
// @name         ProcessOn 脑图大纲导出目录为 JSON
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  rocessOn 脑图大纲导出目录，提示用户切换大纲模式并展开所有节点后，导出目录树为 JSON 文件。
// @author       huangpengfei
// @license      MIT
// @match        https://www.processon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542762/ProcessOn%20%E8%84%91%E5%9B%BE%E5%A4%A7%E7%BA%B2%E5%AF%BC%E5%87%BA%E7%9B%AE%E5%BD%95%E4%B8%BA%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/542762/ProcessOn%20%E8%84%91%E5%9B%BE%E5%A4%A7%E7%BA%B2%E5%AF%BC%E5%87%BA%E7%9B%AE%E5%BD%95%E4%B8%BA%20JSON.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const waitForOutline = () => {
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        const outline = document.querySelector("#outline-con");
        if (outline) {
          observer.disconnect();
          resolve(outline);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  };

  const extractTree = (element) => {
    const nodes = [];
    const children = Array.from(element.querySelectorAll(":scope > div.node-element.wider"));

    for (const node of children) {
      const titleEl = node.querySelector(".node-title");
      if (!titleEl) continue;

      const title = titleEl.textContent.trim();
      const font = titleEl.querySelector("font");
      const path = font ? font.textContent.trim() : "";

      const childContainer = node.querySelector(":scope > .node-children.line");
      const childNodes = childContainer ? extractTree(childContainer) : [];

      nodes.push({ title, path, children: childNodes });
    }

    return nodes;
  };

  const saveJson = (data, filename = "processon_outline.json") => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addExportButton = () => {
    const btn = document.createElement("button");
    btn.textContent = "📄 导出目录为 JSON";
    btn.style.position = "fixed";
    btn.style.top = "60px";
    btn.style.right = "20px";
    btn.style.zIndex = 9999;
    btn.style.padding = "8px 12px";
    btn.style.backgroundColor = "#28a745";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "5px";
    btn.style.cursor = "pointer";
    btn.onclick = () => {
      const confirmed = confirm(
        "⚠️ 请确保已切换到“大纲模式”，并手动展开所有节点！\n\n未展开的节点将无法被导出。\n\n是否继续导出？"
      );
      if (!confirmed) return;

      const root = document.querySelector("#outline-con");
      if (!root) {
        alert("❌ 未找到目录结构，请确认已打开大纲面板！");
        return;
      }

      const jsonData = extractTree(root);
      saveJson(jsonData);
    };
    document.body.appendChild(btn);
  };

  waitForOutline().then(() => {
    addExportButton();
  });
})();