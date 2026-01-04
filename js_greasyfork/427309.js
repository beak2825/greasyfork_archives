// ==UserScript==
// @name         GitHub 加速 (Gist)
// @namespace    https://mogeko.me
// @version      0.1.7
// @author       Zheng Junyi
// @description  通过代理为 GitHub Gist 的 Raw Assets 提供加速
// @license      MIT
// @icon         https://besticon.herokuapp.com/icon?size=80..120..200&url=github.com
// @homepage     https://github.com/mogeko/userscripts/tree/master/packages/ghproxy-gist-raw#readme
// @homepageURL  https://github.com/mogeko/userscripts/tree/master/packages/ghproxy-gist-raw#readme
// @source       https://github.com/mogeko/userscripts.git
// @supportURL   https://github.com/mogeko/userscripts/issues
// @match        https://gist.github.com/**
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/427309/GitHub%20%E5%8A%A0%E9%80%9F%20%28Gist%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427309/GitHub%20%E5%8A%A0%E9%80%9F%20%28Gist%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PROXY_URL = "https://ghproxy.com/";
  function agentGistRaw(proxy) {
    for (const link of document.querySelectorAll(
      ".file-actions a, .ml-2:nth-last-child(1) a"
    )) {
      link.href = proxy + link.href;
    }
  }
  agentGistRaw(PROXY_URL);
  document.addEventListener("pjax:success", () => {
    agentGistRaw(PROXY_URL);
  });

})();