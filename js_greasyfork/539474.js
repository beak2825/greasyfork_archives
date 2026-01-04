// ==UserScript==
// @name         MTSlash 搜索结果链接清理
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  自动清理 MTSlash 搜索结果页面的帖子链接中的 &highlight 参数
// @author       你的名字
// @match        *://www.mtslash.*/search.php?mod=forum&searchid=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539474/MTSlash%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%93%BE%E6%8E%A5%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/539474/MTSlash%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%93%BE%E6%8E%A5%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保页面加载完成后再执行
    window.addEventListener('load', function() {
        console.log('MTSlash 搜索结果链接清理脚本开始执行...');

        // 选择所有 href 属性包含 "mod=viewthread&tid=" 的 <a> 标签
        // 这是更通用的选择器，因为它不依赖于 class 名
        const postLinks = document.querySelectorAll('a[href*="mod=viewthread&tid="]');

        if (postLinks.length === 0) {
            console.log('未找到任何帖子链接 (a[href*="mod=viewthread&tid="])。请检查页面结构或选择器。');
            return;
        }

        console.log(`找到 ${postLinks.length} 个可能的帖子链接。`);

        postLinks.forEach(link => {
            let originalHref = link.href;

            // 检查链接是否包含 'highlight='
            if (originalHref.includes('&highlight=')) {
                // 使用正则表达式匹配 &highlight 到链接末尾的所有内容
                // 或者简单粗暴地用 split 方法
                const cleanedHref = originalHref.split('&highlight=')[0];

                if (cleanedHref !== originalHref) {
                    link.href = cleanedHref;
                    console.log(`链接已清理: ${originalHref} -> ${cleanedHref}`);
                }
            }
        });

        console.log('MTSlash 搜索结果链接清理脚本执行完毕。');
    });
})();