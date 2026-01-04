// ==UserScript==
// @name         Switch520 搜索修复
// @namespace    http://tampermonkey.net/
// @version      2025-07-02
// @description  修复在任意页面搜索导致改为全局搜索而不是特定区。如原搜索表单在switch分区搜索会导致改为全局搜索，而非专区搜索!
// @author       You
// @match        https://www.gamer520.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer520.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541441/Switch520%20%E6%90%9C%E7%B4%A2%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/541441/Switch520%20%E6%90%9C%E7%B4%A2%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const split = location.href.split("/")
    const result = [
        split[0],
        split[1],
        split[2],
        split[3]
    ]
    document.querySelectorAll(".search-form")[0].action = result.join("/")
})();