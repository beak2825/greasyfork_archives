// ==UserScript==
// @name         General Restriction Bypass
// @namespace    https://github.com/symant233/tracker
// @version      1.1
// @description  General JS event restriction bypass
// @author       invobzvr, symant233
// @match        *://*/*
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @grant        GM.deleteValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://mirrors.tuna.tsinghua.edu.cn/static/img/favicon.png
// @homepageURL  https://github.com/invobzvr/invotoys.hidden
// @supportURL   https://github.com/symant233/tracker/issues
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/503302/General%20Restriction%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/503302/General%20Restriction%20Bypass.meta.js
// ==/UserScript==

(async function () {
  function log(msg, styles, ...extra) {
    console.log(
      `%cBP%c ${msg}`,
      "color:#fff;background:#09f;padding:0 3px",
      ...styles,
      ...extra
    );
  }

  async function setupMenu() {
    return await GM.registerMenuCommand(
      `${enabled ? "⭕ Disable" : "🔰 Enable"} for \`${location.host}\``,
      async () => {
        enabled = !enabled;
        GM[enabled ? "setValue" : "deleteValue"](location.host, enabled);
        GM.unregisterMenuCommand(mid);
        mid = await setupMenu();
      }
    );
  }

  let enabled = await GM.getValue(location.host),
    mid = await setupMenu();

  if (!enabled) return;

  [Window, Document, Element].forEach((cls) => {
    cls.prototype.ORI_AEL = cls.prototype.addEventListener;
    cls.prototype.addEventListener = function () {
      if (
        [
          "selectstart",
          "blur",
          "fullscreenchange",
          "visibilitychange",
          "pageshow",
          "pagehide",
          "devtoolschange",
          "copy",
          "keydown",
          "keypress",
          "keyup",
        ].includes(arguments[0])
      ) {
        log("*blocked", ["color:#f00"], [...arguments, this]);
        return;
      }
      log("listened", ["color:#090"], [...arguments, this]);
      return this.ORI_AEL.apply(this, arguments);
    };
    cls.prototype.addEventListener.toString = () =>
      cls.prototype.ORI_AEL.toString();
  });

  Element.prototype.ORI_RF = Element.prototype.requestFullscreen;
  Element.prototype.requestFullscreen = function () {
    log("bypass `Element.requestFullscreen()`", ["color:#f70"], this);
    return Promise.resolve();
  };
  Element.prototype.requestFullscreen.toString = () =>
    Element.prototype.ORI_RF.toString();

  document.ORI_HF = document.hasFocus;
  document.hasFocus = () => (
    log("bypass `document.hasFocus()`", ["color:#f70"]), true
  );
  document.hasFocus.toString = () => document.ORI_HF.toString();

  // https://stackoverflow.com/questions/30086124/how-do-you-use-javascript-to-detect-if-a-user-has-multiple-monitors
  Object.defineProperty(Screen.prototype, "isExtended", {
    get() {
      log("bypass `Screen.isExtended`", ["color:#f70"]);
      return false;
    },
  });

  GM_addStyle(`* {
    user-select: auto !important;
    -webkit-user-select: auto !important;
  }`);

  Object.defineProperties(document, {
    hidden: { get: () => false },
    visibilityState: { get: () => "visible" },
    webkitHidden: { get: () => false },
    webkitVisibilityState: { get: () => "visible" },
  });
})();
