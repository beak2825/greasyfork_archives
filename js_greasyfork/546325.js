// ==UserScript==
// @name               Ramotion Blog Beautification
// @name:zh-CN         Ramotion 博客美化
// @namespace          https://github.com/qixing-jk/ramotion-beautification
// @version            1.0.2
// @description        Improve reading experience on ramotion.com blog
// @description:zh-CN  优化 ramotion.com 博客的阅读体验
// @icon               https://www.ramotion.com/favicon.ico
// @match              *://www.ramotion.com/blog/*
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/546325/Ramotion%20Blog%20Beautification.user.js
// @updateURL https://update.greasyfork.org/scripts/546325/Ramotion%20Blog%20Beautification.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const IS_ENABLED_KEY = "ramotionBeautifierEnabled";
  const isEnabled = _GM_getValue(IS_ENABLED_KEY, true);
  _GM_registerMenuCommand(`${isEnabled ? "Disable" : "Enable"} Blog Beautifier`, () => {
    _GM_setValue(IS_ENABLED_KEY, !isEnabled);
    window.location.reload();
  });
  if (isEnabled) {
    const css = `
        /* Hide the subscription sidebar */
        #gatsby-focus-wrapper > div > main > div:nth-child(1) > div > aside {
            display: none !important;
        }

        /* Remove max-width from container to allow it to fill space */
        #gatsby-focus-wrapper > div > main > div:nth-child(1) > div > div {
            max-width: none !important;
        }
    `;
    _GM_addStyle(css);
  }

})();