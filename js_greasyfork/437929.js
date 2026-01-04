// ==UserScript==
// @name         B站一键三连
// @namespace    https://eliotzhang.cn
// @version      1.0.2
// @description  看视频自动一键三连！
// @author       Dahui2020
// @match        https://www.bilibili.com/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437929/B%E7%AB%99%E4%B8%80%E9%94%AE%E4%B8%89%E8%BF%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/437929/B%E7%AB%99%E4%B8%80%E9%94%AE%E4%B8%89%E8%BF%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function main() {
        var btn = $('.like')
        if (btn.length == 0)
        {
            return
        }
        if (btn[0].className === 'like') {
            btn[0].mousedown(500)
        }
    }
    setInterval(main, 5000)
})();