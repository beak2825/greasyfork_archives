// ==UserScript==
// @name         Tenhou Desktop 4k Unlocker
// @name:ja      天鳳 Desktop4K アンロッカー
// @namespace    http://tampermonkey.net/
// @version      2024-12-11
// @description  Enable Tenhou Desktop 4K version for playing at Advanced & Special. Also removed event info.
// @description:ja 天鳳 Desktop4K バージョンを有効にして、上級＆特上でプレイします。また、イベント情報を削除しました。
// @author       You
// @match        https://tenhou.net/4/
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT
//
// @downloadURL https://update.greasyfork.org/scripts/520423/Tenhou%20Desktop%204k%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/520423/Tenhou%20Desktop%204k%20Unlocker.meta.js
// ==/UserScript==

Object.defineProperties(unsafeWindow, {
  tenhouEventInfo: {
    get: () => {
      return null;
    },
  },
});

unsafeWindow.WebSocket = (function () {
  let originalWebSocket = WebSocket;
  let counter = 0;
  return function (host, ...args) {
    counter++;
    if (counter % 2 == 0) host = host.replace("wss://b-wk.mjv.jp", "wss://b-ww.mjv.jp");
    return new originalWebSocket(host, ...args);
  };
})();
