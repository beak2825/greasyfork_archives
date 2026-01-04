// ==UserScript==
// @name        二刺螈好耶!
// @namespace   http://tampermonkey.net/
// @include       https://audiences.me/torrents.php*
// @version     1.0
// @author      lovecaibao
// @license MIT
// @description 只看二次元欸
// @downloadURL https://update.greasyfork.org/scripts/470029/%E4%BA%8C%E5%88%BA%E8%9E%88%E5%A5%BD%E8%80%B6%21.user.js
// @updateURL https://update.greasyfork.org/scripts/470029/%E4%BA%8C%E5%88%BA%E8%9E%88%E5%A5%BD%E8%80%B6%21.meta.js
// ==/UserScript==
hide()
function hide() {
  document.querySelector('#torrenttable').querySelectorAll(':scope > tbody > tr').forEach(function hide(node) {
    if (!node.querySelector('.tdh')) {
        node.setAttribute("hidden", "hidden");
        }
  });
}