// ==UserScript==
// @name     vk.com left column advertisements remover
// @namespace mikeos
// @description Removes VK.COM ad panel.
// @version  1
// @grant    none
// @include  *vk.com*
// @downloadURL https://update.greasyfork.org/scripts/370230/vkcom%20left%20column%20advertisements%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/370230/vkcom%20left%20column%20advertisements%20remover.meta.js
// ==/UserScript==

var style = document.createElement("style");
style.innerHTML = "#ads_left{display:none!important}";
document.getElementsByTagName("head")[0].appendChild(style);
