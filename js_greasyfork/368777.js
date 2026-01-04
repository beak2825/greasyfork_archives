// ==UserScript==
// @name     pornhub crack for Russia
// @namespace mikeos
// @description Removes "authorize by VK.COM" panel.
// @version  1
// @grant    none
// @include  *pornhub.com*
// @downloadURL https://update.greasyfork.org/scripts/368777/pornhub%20crack%20for%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/368777/pornhub%20crack%20for%20Russia.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.innerHTML = "#age-verification-container,#age-verification-wrapper,.abAlertShown,#js-abContainterMain{display:none!important}";
document.getElementsByTagName("head")[0].appendChild(style);