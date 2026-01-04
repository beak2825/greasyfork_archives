// ==UserScript==
// @name         Gemini Sidecar Codeblock Styler (Precise)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Style Gemini sidecar codeblocks in Google Workspace (Docs, etc.)
// @author       You
// @match        https://docs.google.com/document/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544299/Gemini%20Sidecar%20Codeblock%20Styler%20%28Precise%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544299/Gemini%20Sidecar%20Codeblock%20Styler%20%28Precise%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css = `
    .tm-gemini-code-block {
      background: #222 !important;
      color: #f8f8f2 !important;
      font-family: "Consolas","Source Code Pro","Fira Mono","Menlo",monospace !important;
      font-size: 0.99em !important;
      border-radius: 6px;
      padding: 14px 24px !important;
      margin: 12px 0 !important;
      overflow-x: auto !important;
      box-shadow: 0 1px 4px rgba(60,60,80,0.12);
      display: block !important;
      line-height: 1.5;
      white-space: pre-wrap;
    }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Optionally, ensure styling always gets applied to dynamically loaded code blocks
    const observer = new MutationObserver(() => {
        document.querySelectorAll('pre.tm-gemini-code-block, code.tm-gemini-code-block').forEach(el=>{
            el.classList.add('tm-gemini-code-block');
        });
    });

    // Observe the whole body as sidecar can change dynamically
    observer.observe(document.body, { childList: true, subtree: true });
})();
