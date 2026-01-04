// ==UserScript==
// @name         知乎移动端修复
// @version      1.0.2
// @description  知乎移动端修复：阻止跳转，自动展开
// @author       Allan Chain
// @homepage     https://github.com/AllanChain/zhihu-mobile
// @namespace    https://github.com/AllanChain/
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @include      https://www.zhihu.com/*
// @include      https://zhuanlan.zhihu.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/431097/%E7%9F%A5%E4%B9%8E%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/431097/%E7%9F%A5%E4%B9%8E%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==
// src/style.css
var style_default = ".DownloadGuide {\n  display: none;\n}\n.OpenInAppButton {\n  display: none;\n}\n.MobileAppHeader-downloadLink {\n  display: none;\n}\n.ModalWrap {\n  display: none;\n}\nhtml, body.ModalWrap-body {\n  overflow: auto !important;\n}\n.ContentItem-expandButton {\n  display: none;\n}\n.RichContent-inner {\n  max-height: unset !important;\n}\n";

// src/index.js
function expandRichContent(node) {
  node.classList.remove("is-collapsed");
}
function expandRichContentRecursive(node) {
  node.querySelectorAll(".RichContent.is-collapsed").forEach(expandRichContent);
}
console.log("\u77E5\u4E4E\u79FB\u52A8\u7AEF\u4FEE\u590D\u6B63\u5728\u8FD0\u884C");
GM_addStyle(style_default);
var observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.target.classList.contains("RichContent") && m.target.classList.contains("is-collapsed")) {
      expandRichContent(m.target);
    } else {
      for (const node in m.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("RichContent")) {
          expandRichContent(node);
        }
      }
    }
  }
});
window.addEventListener("load", function(event) {
  event.stopImmediatePropagation();
  expandRichContentRecursive(document);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
});
document.addEventListener("click", (event) => {
  if (event.target.tagName !== "BUTTON") {
    event.stopImmediatePropagation();
  }
}, false);
