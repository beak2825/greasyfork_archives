// ==UserScript==
// @name         屏蔽包含“欧美”的帖子
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  将所有 class="s xst" 中文字包含“欧美”的帖子所在的 tbody 隐藏
// @author       你的名字
// @match        https://fhxy-a.top/forum-2-4.html        // <-- 根据需要修改为实际论坛页面的 URL 匹配，例如 *://example.com/forum.php?mod=forumdisplay*
// @grant        none
// @run-at       document-idle  // 关键：等待页面加载完成

// @license MI
// @downloadURL https://update.greasyfork.org/scripts/538312/%E5%B1%8F%E8%94%BD%E5%8C%85%E5%90%AB%E2%80%9C%E6%AC%A7%E7%BE%8E%E2%80%9D%E7%9A%84%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/538312/%E5%B1%8F%E8%94%BD%E5%8C%85%E5%90%AB%E2%80%9C%E6%AC%A7%E7%BE%8E%E2%80%9D%E7%9A%84%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log('脚本已启动');  // 调试标记
    function hidePosts() {
        // 更健壮的选择器（兼容类名顺序或变化）
        const links = document.querySelectorAll('a.s.xst, a.xst.s');
        console.log(`扫描到 ${links.length} 个链接`);  // 调试输出
        links.forEach(link => {
            if (link.textContent.trim().includes('欧美')) {
                const row = link.closest('tr') || link.closest('tbody');
                if (row) {
                    row.style.display = 'none';
                    console.log('已屏蔽:', link.textContent.trim());
                }
            }
        });
    }
    // 初始执行 + 动态监听
    hidePosts();
    new MutationObserver(hidePosts).observe(document.body, {
        childList: true,
        subtree: true
    });
    // 每 2 秒额外检查一次（应对特殊动态加载）
    setInterval(hidePosts, 2000);
})();