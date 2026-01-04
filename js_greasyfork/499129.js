// ==UserScript==
// @name            X_Twitter_Pinned_List_Open
// @name:ja         X(Twitter)で固定されたリストを開く
// @namespace       https://greasyfork.org/users/1324207
// @match           https://x.com/*
// @version         2.4
// @run-at          document-start
// @author          Lark8037
// @description     Open a pinned list when you visit X(Twitter).
// @description:ja  X(Twitter)を訪れた時に固定されたリストを開きます。
// @license         MIT
// @icon            https://abs.twimg.com/favicons/twitter.3.ico
// @downloadURL https://update.greasyfork.org/scripts/499129/X_Twitter_Pinned_List_Open.user.js
// @updateURL https://update.greasyfork.org/scripts/499129/X_Twitter_Pinned_List_Open.meta.js
// ==/UserScript==
(() => {
  const isSelected = el => el?.getAttribute("aria-selected") === "true";
  let observer;
  const stopObserver = () => {
    if (!observer) return;
    observer.disconnect();
    observer = undefined;
  };
  const startObserver = () => {
    if (!location.pathname.startsWith("/home")) {
      stopObserver();
      return;
    }
    stopObserver();
    observer = new MutationObserver(() => {
      if (!location.pathname.startsWith("/home")) {
        stopObserver();
        return;
      }
      const tabs = document.querySelectorAll('[role="tab"]');
      if (tabs.length < 3) return;
      if (!isSelected(tabs[0]) && !isSelected(tabs[1])) return;
      if (isSelected(tabs[2])) {
        stopObserver();
        return;
      }
      tabs[2].click();
      stopObserver();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };
  startObserver();
  const hook = fn => function () {
    const r = fn.apply(this, arguments);
    queueMicrotask(startObserver);
    return r;
  };
  history.pushState = hook(history.pushState);
  history.replaceState = hook(history.replaceState);
  window.addEventListener("popstate", startObserver);
})();