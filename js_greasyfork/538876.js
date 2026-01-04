// ==UserScript==
// @name         修復滑鼠懸停的圖片顯示名稱
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  修復懸停圖片的名稱顯示
// @author       Shanlan
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538876/%E4%BF%AE%E5%BE%A9%E6%BB%91%E9%BC%A0%E6%87%B8%E5%81%9C%E7%9A%84%E5%9C%96%E7%89%87%E9%A1%AF%E7%A4%BA%E5%90%8D%E7%A8%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/538876/%E4%BF%AE%E5%BE%A9%E6%BB%91%E9%BC%A0%E6%87%B8%E5%81%9C%E7%9A%84%E5%9C%96%E7%89%87%E9%A1%AF%E7%A4%BA%E5%90%8D%E7%A8%B1.meta.js
// ==/UserScript==

var res = document.evaluate("//area|//img", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var i, el;
for (i=0; el=res.snapshotItem(i); i++) {
    if (''==el.title && ''!=el.alt) el.title=el.alt;
}