// ==UserScript==
// @name         西瓜视频按F键全屏
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        *://*.ixigua.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377094/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E6%8C%89F%E9%94%AE%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/377094/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E6%8C%89F%E9%94%AE%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.code === 'KeyF') {
            var elements = document.querySelectorAll('[aria-label="全屏"],[aria-label="退出全屏"]');
            if (elements.length > 0) {
                elements[0].click();
            }
        }
    });
})();