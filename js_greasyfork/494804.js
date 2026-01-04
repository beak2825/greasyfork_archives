// ==UserScript==
// @name         呵呵动漫
// @namespace    https://github.com/wzhjm/
// @version      1.1
// @license      GPL-3.0
// @description  呵呵动漫跳过广告
// @author       wzhjm
// @match        https://www.hehe.la/player/mui-player.php?*
// @match        https://www.hehe.la/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494804/%E5%91%B5%E5%91%B5%E5%8A%A8%E6%BC%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/494804/%E5%91%B5%E5%91%B5%E5%8A%A8%E6%BC%AB.meta.js
// ==/UserScript==
(function () {
    'use strict';
  	let announce_text=document.getElementsByClassName("announce_text")
    if (announce_text.length>0){
      announce_text[0].remove()
    }
    endclose()
})();
