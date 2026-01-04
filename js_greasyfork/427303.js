// ==UserScript==
// @name         GitHub 加速 (Raw)
// @namespace    https://mogeko.me
// @version      0.1.9
// @author       Zheng Junyi
// @description  通过代理为 GitHub Raw Assets 提供加速
// @license      MIT
// @icon         https://besticon.herokuapp.com/icon?size=80..120..200&url=github.com
// @homepage     https://github.com/mogeko/userscripts/tree/master/packages/ghproxy-raw#readme
// @homepageURL  https://github.com/mogeko/userscripts/tree/master/packages/ghproxy-raw#readme
// @source       https://github.com/mogeko/userscripts.git
// @supportURL   https://github.com/mogeko/userscripts/issues
// @match        https://github.com/**
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/427303/GitHub%20%E5%8A%A0%E9%80%9F%20%28Raw%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427303/GitHub%20%E5%8A%A0%E9%80%9F%20%28Raw%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PROXY_URL = "https://ghproxy.com/";
  function agentRaw(proxy) {
    const rawButton = document.querySelector("#raw-url");
    if (rawButton) rawButton.href = proxy + window.location.href;
  }
  agentRaw(PROXY_URL);
  document.addEventListener("pjax:success", () => {
    agentRaw(PROXY_URL);
  });

})();