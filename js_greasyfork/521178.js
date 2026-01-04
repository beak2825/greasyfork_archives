// ==UserScript==
// @name         Nicholas's BetterFanqieNovel|更好的番茄小说
// @namespace    https://fanqienovel.com
// @version      0.1
// @description  让番茄变得更好
// @author       Nicholas_Hao
// @include      https://fanqienovel.com/*
// @license      AGPL-3.0
// @icon         https://p1-tt.byteimg.com/origin/novel-static/a3621391ca2e537045168afda6722ee9
// @downloadURL https://update.greasyfork.org/scripts/521178/Nicholas%27s%20BetterFanqieNovel%7C%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/521178/Nicholas%27s%20BetterFanqieNovel%7C%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4.meta.js
// ==/UserScript==
(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') { // 右箭头触发“下一章”按钮
            var button = document.querySelector('.next'); 
            if (button) {
                button.click();
            }
        }
        if (event.key === 'ArrowLeft') { // 左箭头触发“上一章”按钮
            var button = document.querySelector('.last'); 
            if (button) {
                button.click();
            }
        }
    });
})();