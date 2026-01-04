// ==UserScript==
// @name         調整さんのデフォルト値を✗にする
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://chouseisan.com/s?h=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381060/%E8%AA%BF%E6%95%B4%E3%81%95%E3%82%93%E3%81%AE%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E5%80%A4%E3%82%92%E2%9C%97%E3%81%AB%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/381060/%E8%AA%BF%E6%95%B4%E3%81%95%E3%82%93%E3%81%AE%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E5%80%A4%E3%82%92%E2%9C%97%E3%81%AB%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (let i = 0; ; i++) {
        const element = document.querySelector("#oax_"+i+"_2");
        if (element == null) break;
        element.click();
    }
})();