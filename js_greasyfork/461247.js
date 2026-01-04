// ==UserScript==
// @name         萌娘百科去除烦人的 adblock 检测弹窗
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除烦人的 adblock 检测弹窗
// @author       https://github.com/yuzhanglong
// @match        https://zh.moegirl.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moegirl.org.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461247/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%8E%BB%E9%99%A4%E7%83%A6%E4%BA%BA%E7%9A%84%20adblock%20%E6%A3%80%E6%B5%8B%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/461247/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%8E%BB%E9%99%A4%E7%83%A6%E4%BA%BA%E7%9A%84%20adblock%20%E6%A3%80%E6%B5%8B%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
  const mutationObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const adblockDialog = [...mutation.addedNodes].find((node) => {
          return node.className === 'fc-ab-root';
        });

        if (adblockDialog) {
          if (adblockDialog.innerHTML.includes('白名单')) {
            const closeButton = adblockDialog.getElementsByClassName('fc-close')[0];
            if (closeButton) {
              closeButton.click();
            }
          }
        }
      }
    }
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
})();
