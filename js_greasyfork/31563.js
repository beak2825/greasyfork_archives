// ==UserScript==
// @name        KillPooh
// @namespace   ForHuman
// @description プーさんのホームランダービーを殺します
// @include     http://kids.disney.co.jp/etc/disney-game/01_swf/3018/index.html
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31563/KillPooh.user.js
// @updateURL https://update.greasyfork.org/scripts/31563/KillPooh.meta.js
// ==/UserScript==

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

var xpath = '//div'
var ele = getElementByXpath(xpath);
if (ele != null) {ele.remove();}