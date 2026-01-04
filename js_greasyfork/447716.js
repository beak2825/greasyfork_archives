// ==UserScript==
// @name         Keylol-autoTheme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  根据设备设置自动切换Keylol主题色
// @author       yuyinws
// @match        https://keylol.com/*
// @icon         https://keylol.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447716/Keylol-autoTheme.user.js
// @updateURL https://update.greasyfork.org/scripts/447716/Keylol-autoTheme.meta.js
// ==/UserScript==

(function() {
  const isDark = getcookie('dark_mode') == 1 ? true : false
  const perferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  if (perferDark && !isDark) {
    setcookie(`dark_mode`, 1, 3600*24*365);location.reload();
  }
  if (!perferDark && isDark) {
    setcookie(`dark_mode`, 0, 3600*24*365);location.reload();
  }
})();
