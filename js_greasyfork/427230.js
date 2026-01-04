// ==UserScript==
// @name         GitHub 加速 (Releases)
// @namespace    https://mogeko.me
// @version      0.2.10
// @author       Zheng Junyi
// @description  通过代理为 GitHub Releases 提供加速
// @license      MIT
// @icon         https://besticon.herokuapp.com/icon?size=80..120..200&url=github.com
// @homepage     https://github.com/mogeko/userscripts/tree/master/packages/ghproxy-releases#readme
// @homepageURL  https://github.com/mogeko/userscripts/tree/master/packages/ghproxy-releases#readme
// @source       https://github.com/mogeko/userscripts.git
// @supportURL   https://github.com/mogeko/userscripts/issues
// @match        https://github.com/**
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/427230/GitHub%20%E5%8A%A0%E9%80%9F%20%28Releases%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427230/GitHub%20%E5%8A%A0%E9%80%9F%20%28Releases%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PROXY_URL = "https://ghproxy.com/";
  function agentReleases(proxy) {
    for (const svg of document.querySelectorAll(
      ".octicon-package, .octicon-file-zip"
    )) {
      const link = svg.parentNode;
      link.href = proxy + link.href;
    }
  }
  agentReleases(PROXY_URL);
  document.addEventListener("pjax:success", () => {
    agentReleases(PROXY_URL);
  });

})();