// ==UserScript==
// @name         block xui auto generate path
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  防止某些版本的xui在查看path时自动更改path
// @author       LeiFeng
// @match        http://*/xui/*
// @match        http://*/*/xui/*
// @match        https://*/xui/*
// @match        https://*/*/xui/*
// @license MIT
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/503784/block%20xui%20auto%20generate%20path.user.js
// @updateURL https://update.greasyfork.org/scripts/503784/block%20xui%20auto%20generate%20path.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 在页面解析时立即执行，替换相关代码
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.tagName === "SCRIPT") {
            const scriptContent = node.innerHTML;
            if (
              scriptContent.includes(
                "if (this.oldAllSetting.webBasePath === '/')"
              )
            ) {
              // 替换判断条件为false
              node.innerHTML = scriptContent.replace(
                "if (this.oldAllSetting.webBasePath === '/')",
                "if (false)"
              );
              console.log("判断条件已被替换为false");
            }
          }
        });
      });
    });

    // 开始监听整个文档的变化
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  })();
