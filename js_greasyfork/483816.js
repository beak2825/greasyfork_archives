// ==UserScript==
// @name        Redirect cdn discord
// @description Redirect cdn discord del after ?
// @include     *://*cdn.discordapp.com/*
// @version     0.0.1.20210703091838
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/483816/Redirect%20cdn%20discord.user.js
// @updateURL https://update.greasyfork.org/scripts/483816/Redirect%20cdn%20discord.meta.js
// ==/UserScript==

const url = new URL(document.location.href);
const newUrl = url.origin + url.pathname;

// Проверка, чтобы избежать бесконечного перехода
if (document.location.href !== newUrl) {
  window.open(newUrl, "_self");
}
