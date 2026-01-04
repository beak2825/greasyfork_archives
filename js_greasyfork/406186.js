// ==UserScript==
// @name        Wider github.com
// @name:zh-CN  更宽的 Github.com
// @namespace   BigWater
// @description Fills the blank between the container and two sides of the browser.
// @description:zh-CN 拉伸 Github 新 UI 的容器, 填满浏览器界面
// @match       https://github.com/*
// @grant       none
// @version     0.1.3
// @author      BigWater
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/406186/Wider%20githubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/406186/Wider%20githubcom.meta.js
// ==/UserScript==

function $(e) {
  return document.querySelector(e);
}

(function () {
    container = $('.container-xl');
    container.className = container.className.replace('container-xl', 'container-xxl');
})();
