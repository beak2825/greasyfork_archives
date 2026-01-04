// ==UserScript==
// @name        niconico unlimit tabs
// @namespace   https://greasyfork.org/users/737109
// @version     2024.12.21
// @description ニコニコ動画で同時視聴できるタブ数制限をなくします
// @grant       none
// @author      YamaD
// @match       https://www.nicovideo.jp/*
// @run-at      document-start
// @license     WTFPL
// @thanks-to   https://greasyfork.org/scripts/511041/code
// @downloadURL https://update.greasyfork.org/scripts/521355/niconico%20unlimit%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/521355/niconico%20unlimit%20tabs.meta.js
// ==/UserScript==

addEventListener("storage", ev => {
  if (ev.key == "nvpc:watch:tab-sessions") {
    localStorage.removeItem("nvpc:watch:tab-sessions");
  }
});