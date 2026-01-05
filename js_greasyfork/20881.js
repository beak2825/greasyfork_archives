// ==UserScript==
// @name         自动队列
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Lance.Liu
// @match        http://store.steampowered.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20881/%E8%87%AA%E5%8A%A8%E9%98%9F%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/20881/%E8%87%AA%E5%8A%A8%E9%98%9F%E5%88%97.meta.js
// ==/UserScript==
//setTimeOut(100);
a=document.getElementById("next_in_queue_form");
a.submit();