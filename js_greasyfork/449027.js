// ==UserScript==
// @name         技術評論社(gihyo.jp)のサマリーページを飛ばして本文を開く
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  技術評論社(gihyo.jp)のサマリーページを飛ばして本文を開きます。
// @author       Jakarta Read-only Brothers
// @match        https://gihyo.jp/*?summary
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gihyo.jp
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/449027/%E6%8A%80%E8%A1%93%E8%A9%95%E8%AB%96%E7%A4%BE%28gihyojp%29%E3%81%AE%E3%82%B5%E3%83%9E%E3%83%AA%E3%83%BC%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E9%A3%9B%E3%81%B0%E3%81%97%E3%81%A6%E6%9C%AC%E6%96%87%E3%82%92%E9%96%8B%E3%81%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/449027/%E6%8A%80%E8%A1%93%E8%A9%95%E8%AB%96%E7%A4%BE%28gihyojp%29%E3%81%AE%E3%82%B5%E3%83%9E%E3%83%AA%E3%83%BC%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E9%A3%9B%E3%81%B0%E3%81%97%E3%81%A6%E6%9C%AC%E6%96%87%E3%82%92%E9%96%8B%E3%81%8F.meta.js
// ==/UserScript==

(function() {

    const url = new URL(location.href);
    url.search = "";
    location.replace(url);
})();
