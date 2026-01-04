// ==UserScript==
// @name         jdShell
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  shell 自动登录
// @author       leirensheng
// @match      http://leirensheng.dynv6.net:5678
// @icon         https://www.google.com/s2/favicons?domain=notion.so
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445202/jdShell.user.js
// @updateURL https://update.greasyfork.org/scripts/445202/jdShell.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  let $ = (val) => document.querySelector(val);
  $("[name=username]").value = "admin";
  $("[name=username]").dispatchEvent(new Event("input"));
  $("[name=password]").value = "admin5678";
  $("[name=password]").dispatchEvent(new Event("input"));
  $("[type=submit]").click();
})();
