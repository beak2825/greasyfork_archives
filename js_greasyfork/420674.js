// ==UserScript==
// @name        Disable Sanguosha forbiddenConsole
// @namespace   https://greasyfork.org/zh-CN/users/220174-linepro
// @match       *://web.sanguosha.com/login/index.html
// @match       *://web.sanguosha.com/220/h5/index.php*
// @grant       none
// @version     1.0
// @author      LinePro
// @description Disable Sanguosha forbiddenConsole function
// @icon        https://www.sanguosha.com/favicon.ico
// @run-at      document-start
// @all_frames  true
// @downloadURL https://update.greasyfork.org/scripts/420674/Disable%20Sanguosha%20forbiddenConsole.user.js
// @updateURL https://update.greasyfork.org/scripts/420674/Disable%20Sanguosha%20forbiddenConsole.meta.js
// ==/UserScript==
(function() {
  let mValue = true;
  Object.defineProperty(window, "ActiveXObject", {
    configurable: true,
    enumerable: true,
    set(val) { },
    get() {
      if (mValue && window.getGameOpenTime) {
        mValue = false;
        return true;
      }
      return mValue;
    } 
  });
})();