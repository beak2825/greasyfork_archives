// ==UserScript==
// @name         Gemini Code Collapse & Copy
// @namespace    https://google.com/
// @version      1.0
// @description  Collapse code blocks by default with show/hide and copy buttons on Gemini
// @author       3xploiton3
// @match        https://gemini.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543299/Gemini%20Code%20Collapse%20%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/543299/Gemini%20Code%20Collapse%20%20Copy.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CSS = `
    .gm-btn {
      background: #f1f3f4;
      border: 1px solid #dadce0;
      border-radius: 4px;
      padding: 2px 6px;
      margin: 2px 4px 2px 0;
      font-size: 12px;
      cursor: pointer;
    }
    .gm-btn:hover {
      background: #e8eaed;
    }
    .gm-code-container {
      position: relative;
      margin-bottom: 8px;
    }
  `;
  const style = document.createElement("style");
  style.textContent = CSS;
  document.head.append(style);

  function enhance(pre) {
    if (pre.dataset.gmEnhanced) return;
    pre.dataset.gmEnhanced = "1";

    const code = pre.querySelector("code");
    if (!code) return;

    code.style.display = "none";
    pre.classList.add("gm-code-container");

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";

    const btnShow = document.createElement("button");
    btnShow.textContent = "Show code";
    btnShow.className = "gm-btn";
    btnShow.addEventListener("click", () => {
      const visible = code.style.display === "";
      code.style.display = visible ? "none" : "";
      btnShow.textContent = visible ? "Show code" : "Hide code";
    });

    const btnCopy = document.createElement("button");
    btnCopy.textContent = "Copy";
    btnCopy.className = "gm-btn";
    btnCopy.addEventListener("click", () => {
      navigator.clipboard.writeText(code.innerText);
      btnCopy.textContent = "Copied!";
      setTimeout(() => (btnCopy.textContent = "Copy"), 1000);
    });

    wrapper.append(btnShow, btnCopy);
    pre.parentElement.insertBefore(wrapper, pre);
  }

  function scan() {
    document.querySelectorAll("pre").forEach(enhance);
  }

  scan();
  new MutationObserver(scan).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
