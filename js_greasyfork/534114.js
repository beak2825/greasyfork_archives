// ==UserScript==
// @name         HDDolby Less Seeders Highlight
// @namespace    https://www.hddolby.com/
// @version      1.0.2
// @author       JParty
// @description  在 HDDolby torrents.php?mystat=keep 页面，将做种数≤2的行高亮
// @match        https://www.hddolby.com/torrents.php?*mystat=keep*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534114/HDDolby%20Less%20Seeders%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/534114/HDDolby%20Less%20Seeders%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlightLow() {
        // 选择所有 class="rowfollow" 且 align="center" 的 td，内部有 <b>数字</b>
        document.querySelectorAll('td.rowfollow[align="center"] > b').forEach(function(b){
            var n = parseInt(b.textContent.trim(), 10);
            if (!isNaN(n) && n <= 2) {
                // 找到包含该 td 的最外层 tr
                var tr = b.closest('tr');
                if (tr) {
                    // 设置高亮背景色
                    tr.style.backgroundColor = '#fffa8c';
                }
                if (tr) {
                    tr.querySelectorAll('td.embedded').forEach(function(td) {
                        td.style.backgroundColor = '#fffa8c';
                    });
                }
            }
        });
    }

    // 等待 DOM 完全加载后再执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', highlightLow);
    } else {
        highlightLow();
    }
})();