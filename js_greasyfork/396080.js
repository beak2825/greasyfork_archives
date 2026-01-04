// ==UserScript==
// @name        ip.cn
// @namespace   ip.cn
// @include     */ip.cn*
// @include     *.ip.cn*
// @version     2
// @description  try to take over the world!
// @author      cjx82630
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/396080/ipcn.user.js
// @updateURL https://update.greasyfork.org/scripts/396080/ipcn.meta.js
// ==/UserScript==
document.body.innerHTML += document.body.innerHTML.match(/\<div class=\"well\"\>\<p\>.*?\<\/p\>\<\/div\>/);
