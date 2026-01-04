// ==UserScript==
// @name        php英文文档跳转中文 - php.net
// @namespace   Violentmonkey Scripts
// @match       https://www.php.net/manual/en/*
// @grant       none
// @version     1.0
// @author      -
// @description 2023/3/21 18:47:27
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462369/php%E8%8B%B1%E6%96%87%E6%96%87%E6%A1%A3%E8%B7%B3%E8%BD%AC%E4%B8%AD%E6%96%87%20-%20phpnet.user.js
// @updateURL https://update.greasyfork.org/scripts/462369/php%E8%8B%B1%E6%96%87%E6%96%87%E6%A1%A3%E8%B7%B3%E8%BD%AC%E4%B8%AD%E6%96%87%20-%20phpnet.meta.js
// ==/UserScript==
if (window.location.href.startsWith("https://www.php.net/manual/en/")) {
  window.location.href = window.location.href.replace("https://www.php.net/manual/en/", "https://www.php.net/manual/zh/");
}
