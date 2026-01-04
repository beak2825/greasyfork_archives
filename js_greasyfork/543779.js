// ==UserScript==
// @name              報導者優蛇
// @description       報導者網站使用者介面調整
// @version           1.0.0
// @license           MIT
// @author            bootleq
// @namespace         bootleq.com
// @homepageURL       https://github.com/bootleq/user-scripts
//
// @match             https://www.twreporter.org/*
// @run-at            document-idle
// @grant             none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/543779/%E5%A0%B1%E5%B0%8E%E8%80%85%E5%84%AA%E8%9B%87.user.js
// @updateURL https://update.greasyfork.org/scripts/543779/%E5%A0%B1%E5%B0%8E%E8%80%85%E5%84%AA%E8%9B%87.meta.js
// ==/UserScript==

const gSearchBarSelector       = 'input[type="search"][class^="search-bar"]';
const gSearchBarObserveTimeout = 9000; // 偵測搜尋框時，超過此時間即不再偵測 (ms)

// 不要自動 focus 搜尋框
// 相關 PR: https://github.com/twreporter/twreporter-npm-packages/pull/614
const noAutoFocusSearchBar = () => {
  const $active = document.activeElement;

  // 一開始就 focus 的場合，直接 blur 即可
  if ($active.matches(gSearchBarSelector)) {
    $active.blur();
    return;
  }

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const bar = node.matches(gSearchBarSelector) ? node : node.querySelector(gSearchBarSelector);
            if (bar) {
              bar.blur();
            }
          }
        });
      }
    }
  });

  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );

  setTimeout(() => observer.disconnect(), gSearchBarObserveTimeout);
};

noAutoFocusSearchBar();
