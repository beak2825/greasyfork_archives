// ==UserScript==
// @name         steam评测舔狗脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  如果不是真的喜欢，谁又愿意当个舔狗呢
// @author       You
// @match        https://steamcommunity.com/profiles/*/recommended*
// @match        http://steamcommunity.com/profiles/*/recommended*
// @match        http://steamcommunity.com/id/*/recommended*
// @match        https://steamcommunity.com/id/*/recommended*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373517/steam%E8%AF%84%E6%B5%8B%E8%88%94%E7%8B%97%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/373517/steam%E8%AF%84%E6%B5%8B%E8%88%94%E7%8B%97%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

document.querySelectorAll('#leftContents .thumb_up').forEach(function (node) {
    node.parentNode.parentNode.click();
});