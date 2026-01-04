// ==UserScript==
// @name         OMG Game Dev-Token Auto Fetcher
// @name:zh-TW   OMG 遊戲開發環境 Token自動產生器
// @namespace       com.sherryyue.omggametokenautofetcher
// @version         0.3
// @description       OMG Game Dev-Token Auto Fetcher.
// @description:zh-TW OMG 遊戲開發環境 Token自動產生器。
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @include         *://*:7456/*
// @exclude         *://localhost:7456/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/504864/OMG%20Game%20Dev-Token%20Auto%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/504864/OMG%20Game%20Dev-Token%20Auto%20Fetcher.meta.js
// ==/UserScript==

(function () {
  if (location.search.indexOf("token") != -1) {
    return;
  }

  const devAPIOrigin = "https://sm-dev.ssgaka.com";
  const openGameAPI = devAPIOrigin + "/api/home/openGamePage";
  const gameId = prompt("輸入Game ID後隨機登入");

  fetch(openGameAPI + "?local=1&lang=en&gameCode=" + gameId)
    .then((res) => res.text())
    .then((res) => {
      const url = new URL(res);
      location.search = url.search;
    });

})();