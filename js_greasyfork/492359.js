// ==UserScript==
// @name         跳过推特敏感内容警告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动跳过推特敏感内容警告
// @author       RE
// @match        https://twitter.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492359/%E8%B7%B3%E8%BF%87%E6%8E%A8%E7%89%B9%E6%95%8F%E6%84%9F%E5%86%85%E5%AE%B9%E8%AD%A6%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/492359/%E8%B7%B3%E8%BF%87%E6%8E%A8%E7%89%B9%E6%95%8F%E6%84%9F%E5%86%85%E5%AE%B9%E8%AD%A6%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a counter at the bottom right corner
    var counter = document.createElement('div');
    counter.id = 'tm-counter';
    counter.textContent = '已经跳过警告 0 个';
    document.body.appendChild(counter);

    // Style the counter
    GM_addStyle('#tm-counter { position: fixed; right: 20px; bottom: 20px; background: #000; color: #fff; padding: 5px 10px; border-radius: 5px; }');

    var count = 0;
    var checkAndClick = function() {
        var warningElements = document.querySelectorAll('li[role="listitem"] div[role="button"] span');
        for (var i = 0; i < warningElements.length; i++) {
            var warningElement = warningElements[i];
            if (warningElement.textContent.includes('显示')) {
                warningElement.click();
                count++;
                counter.textContent = '已经跳过警告 ' + count + ' 个';
            }
        }
    };

    // Check every second
    setInterval(checkAndClick, 2000);
})();
