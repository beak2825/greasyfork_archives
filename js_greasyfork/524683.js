// ==UserScript==
// @name         NGA屏蔽关键词脚本清净版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  屏蔽关键词并彻底移除屏蔽后的帖子和空行，清理空的tbody标签，支持连续翻页，自动监听动态加载的内容，最大限度提升屏蔽后的阅读体验。
// @author       cloud_rider
// @match        *://bbs.nga.cn/thread.php?fid=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524683/NGA%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D%E8%84%9A%E6%9C%AC%E6%B8%85%E5%87%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/524683/NGA%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D%E8%84%9A%E6%9C%AC%E6%B8%85%E5%87%80%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 屏蔽关键词列表
    const blockKeywords = ["关键词1", "关键词2", "关键词3"]; // 请自行修改并增加要屏蔽的关键词
    const minVisibleThreads = 20; // 希望页面上保留的最少帖子数
    let totalVisibleThreads = 0; // 当前经过屏蔽的总帖子数
    const loadedPages = new Set(); // 已加载页面记录，避免重复点击加载

    // 屏蔽帖子并清理空行和空的tbody的逻辑
    const filterThreads = () => {
        const threads = document.querySelectorAll('tbody tr'); // 假设帖子以<tbody>和<tr>标签呈现
        let visibleCount = 0;

        threads.forEach(thread => {
            if (thread.dataset.filtered === "true") {
                // 如果已经处理过，跳过
                if (thread.style.display !== "none") visibleCount++;
                return;
            }

            const titleElement = thread.querySelector('.topic'); // 假设标题位于 .topic 类名下
            if (titleElement) {
                const title = titleElement.textContent || titleElement.innerText;
                if (blockKeywords.some(keyword => title.includes(keyword))) {
                    // 彻底删除包含关键词的帖子行
                    thread.remove();
                } else {
                    thread.style.display = ""; // 确保未屏蔽的帖子正常显示
                    visibleCount++;
                }
            } else {
                // 删除没有实际内容的行（即没有标题的行）
                const isEmpty = thread.textContent.trim() === "" || thread.innerHTML.trim() === "";
                if (isEmpty) {
                    thread.remove();
                }
            }

            thread.dataset.filtered = "true"; // 标记为已处理
        });

        // 隐藏 PAGE XX 黑条
        const blackBars = document.querySelectorAll('th[id^="continuepage"]');
        blackBars.forEach(bar => {
            bar.style.display = "none"; // 隐藏黑条
        });

        // 清理空的tbody
        const tbodys = document.querySelectorAll('tbody');
        tbodys.forEach(tbody => {
            if (tbody.children.length === 0) {
                tbody.remove(); // 如果tbody为空，移除它
            }
        });

        return visibleCount;
    };

    // 自动点击“加载下一页”
    const loadNextPage = async () => {
        const nextPageLink = document.querySelector('a[title="加载下一页"]');
        if (nextPageLink) {
            const nextPageHref = nextPageLink.getAttribute('href');
            if (nextPageHref && !loadedPages.has(nextPageHref)) {
                loadedPages.add(nextPageHref); // 记录已加载的页面
                console.log(`正在加载下一页：${nextPageHref}`);

                // 模拟点击“加载下一页”
                nextPageLink.click();
                return new Promise((resolve) => {
                    // 等待页面内容加载完成，设置一个延迟
                    setTimeout(() => {
                        resolve(true);
                    }, 1500); // 假设加载下一页需要1.5秒，可以调整这个时间
                });
            }
        } else {
            console.log("未找到下一页链接，可能已经是最后一页。");
        }
        return false; // 没有下一页
    };

    // 核心逻辑：递归加载直到满足数量
    const ensureSufficientThreads = async () => {
        totalVisibleThreads = filterThreads(); // 更新当前可见帖子数
        console.log(`当前总可见帖子数：${totalVisibleThreads}`);

        while (totalVisibleThreads < minVisibleThreads) {
            const success = await loadNextPage();
            if (!success) {
                console.log("无法加载更多页面，可能已经是最后一页。");
                break;
            }
            totalVisibleThreads = filterThreads(); // 重新计算可见帖子数
        }

        console.log(`最终总可见帖子数：${totalVisibleThreads}`);
    };

    // 监听动态变化的功能
    const setupObserver = () => {
        const observer = new MutationObserver(() => {
            console.log("检测到页面内容发生变化，重新执行屏蔽逻辑...");
            ensureSufficientThreads();
        });

        // 监听整个帖子列表所在的 DOM 节点
        const targetNode = document.body; // 假设整个页面的 body 是动态变化的区域
        const config = { childList: true, subtree: true };

        observer.observe(targetNode, config);
        console.log("MutationObserver 已启动，正在监听动态内容变化...");
    };

    // 初始运行
    ensureSufficientThreads();
    setupObserver();

    console.log("NGA屏蔽关键词+彻底移除被屏蔽行、空行及空tbody脚本已启动！");
})();
