// ==UserScript==
// @name         🐭️ MouseHunt - Better Lucky Catch Icon
// @version      1.2.0
// @description  Upscales the Lucky Catch icon so it isn't so blurry.
// @license      MIT
// @author       bradp
// @namespace    bradp
// @match        https://www.mousehuntgame.com/*
// @icon         https://i.mouse.rip/mouse.png
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/script-migration@1.1.1
// @downloadURL https://update.greasyfork.org/scripts/449493/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Better%20Lucky%20Catch%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/449493/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20-%20Better%20Lucky%20Catch%20Icon.meta.js
// ==/UserScript==

((function () {
  'use strict';

  const style = document.createElement('style');
  style.innerHTML = `.journal .entry.luckycatchsuccess .journalimage::after {
    top: -5px;
    left: -5px;
    width: 20px;
    height: 20px;
    background: url(https://www.mousehuntgame.com/images/ui/camp/trap/stat_luck.png?asset_cache_version=2);
    background-repeat: no-repeat;
    background-size: cover;
  }

  .journaltext .lucky::after {
    position: relative;
    top: 3px;
    width: 13px;
    height: 13px;
    margin: 0;
    background: url(https://www.mousehuntgame.com/images/ui/camp/trap/stat_luck.png?asset_cache_version=2);
    background-repeat: no-repeat;
    background-size: contain;
  }`;
  document.head.appendChild(style);

  migrateUserscript('🐭️ MouseHunt - Better Lucky Catch Icon', 'https://greasyfork.org/en/scripts/449493-mousehunt-better-lucky-catch-icon');
})());
