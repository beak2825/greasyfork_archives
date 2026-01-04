// ==UserScript==
// @name        Thinner github.com
// @name:zh-CN  更窄的 Github.com
// @namespace   BigWater
// @description Revert the new UI's nav title width to the old one.
// @description:zh-CN 压缩新 UI 的导航条, 看起来更像老界面
// @match       https://github.com/*
// @grant       none
// @version     0.1.1
// @author      BigWater
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/406233/Thinner%20githubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/406233/Thinner%20githubcom.meta.js
// ==/UserScript==

function $(e) {
  return document.querySelector(e);
}

(function () {
  setTimeout(function() {
    $('.pagehead.repohead').className += ' container-xl';
  }, 100);
})();
