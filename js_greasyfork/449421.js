// ==UserScript==
// @name         Terraria Wiki 重定向
// @namespace    https://aaa1115910.dev/
// @version      0.1
// @description  Redirects from terraria.fandom.com to terraria.wiki.gg
// @author       aaa1115910
// @match        terraria.fandom.com/*
// @icon         https://terraria.wiki.gg/zh/images/4/4a/Site-favicon.ico
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449421/Terraria%20Wiki%20%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/449421/Terraria%20Wiki%20%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

window.location.replace(location.href.replace(location.hostname, "terraria.wiki.gg"));