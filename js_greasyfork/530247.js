// ==UserScript==
// @name 豆瓣自动推荐书籍标签
// @namespace http://tampermonkey.net/
// @version 0.1
// @description 提取网页内的推荐标签，放置到书籍详情和标签区域中，支持点击填充到标签输入框
// @author blue-bird
// @match https://book.douban.com/subject/*/
// @icon https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant none
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/530247/%E8%B1%86%E7%93%A3%E8%87%AA%E5%8A%A8%E6%8E%A8%E8%8D%90%E4%B9%A6%E7%B1%8D%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/530247/%E8%B1%86%E7%93%A3%E8%87%AA%E5%8A%A8%E6%8E%A8%E8%8D%90%E4%B9%A6%E7%B1%8D%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待 DOM 完全加载
    window.addEventListener ('load', function () {
        // 从 DoubanAdRequest 对象提取标签字符串
        const criteria = (window.DoubanAdRequest && window.DoubanAdRequest.crtr) || '';
        if (!criteria) {
            console.warn (' 未在 DoubanAdRequest 中找到标签信息！');
            return;
        }

        // 将标签字符串拆分为单独的条目
        const entries = criteria.split ('|');

        // 提取关键词（它们在冒号:后面）
        const keywords = entries.filter (entry => entry.startsWith ('7:')).map (entry => {
            const parts = entry.split (':');
            return parts.length > 1 ? parts [1] : null;
        }).filter (Boolean); // 移除 null/undefined 条目

        if (keywords.length === 0) {
            console.warn (' 未提取到任何关键词标签！');
            return;
        }

        // 创建切换按钮
        const toggleButton = document.createElement ('button');
        toggleButton.textContent = ' 显示 / 隐藏 标签 ';
        toggleButton.style.marginBottom = '10px';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.cursor = 'pointer';

        // 创建关键词容器
        const keywordContainer = document.createElement ('div');
        keywordContainer.style.display = 'none'; // 初始隐藏

        // 为关键词创建链接
        keywords.forEach ((keyword) => {
            const link = document.createElement ('a');
            link.href = `https://book.douban.com/tag/${encodeURIComponent(keyword)}`;
            link.textContent = keyword;
            link.target = '_blank';
            link.style.marginRight = '10px';
            link.style.textDecoration = 'none';
            link.style.color = '#37a';

            // 添加点击事件，填充到输入框
            link.addEventListener('click', function(e) {
                addTagToInput(keyword);
            });

            keywordContainer.appendChild(link);
        });

        // 添加切换功能
        toggleButton.addEventListener ('click', () => {
            if (keywordContainer.style.display === 'none') {
                keywordContainer.style.display = 'block';
                toggleButton.textContent = ' 隐藏 关键词 ';
            } else {
                keywordContainer.style.display = 'none';
                toggleButton.textContent = ' 显示 关键词 ';
            }
        });

        // 找到 id 为 "info" 的元素并添加内容
        const infoElement = document.getElementById ('info');
        if (infoElement) {
            infoElement.appendChild (toggleButton);
            infoElement.appendChild (keywordContainer);
        } else {
            console.warn (' 未找到 id 为 "info" 的元素！');
        }

        // 添加一个标志防止重复执行
        let tagsAdded = false;

        // 新功能：在 populartags 元素中添加标签
        function addTagsToPopularTags () {
            // 如果已经添加过标签，直接返回
            if (tagsAdded) return;

            const popularTags = document.getElementById ('populartags');
            if (popularTags) {
                // 创建自定义标签的 dl 结构
                const dl = document.createElement ('dl');

                // 创建 dt 元素
                const dt = document.createElement ('dt');
                dt.textContent = ' 流行标签:';
                dl.appendChild (dt);

                // 创建 dd 元素
                const dd = document.createElement ('dd');

                // 为每个关键词创建 span 元素
                keywords.forEach ((keyword, index) => {
                    const span = document.createElement ('span');
                    // 交替使用不同的类，使标签样式有所变化
                    span.className = `tagbtn gract`;
                    span.textContent = keyword;
                    // 添加点击事件，点击时将标签添加到输入框
                    span.addEventListener('click', function() {
                        addTagToInput(keyword);
                    });
                    // 添加悬停效果，提示可点击
                    span.style.cursor = 'pointer';

                    // 添加到 dd 元素
                    dd.appendChild (span);

                    // 添加间隔（最后一个标签不需要）
                    if (index < keywords.length - 1) {
                        // 使用 CSS margin 代替文本空格，避免显示问题
                        span.style.marginRight = '8px';
                    }
                });

                dl.appendChild(dd);

                // 将创建的 dl 添加到 populartags 元素
                popularTags.appendChild (dl);

                // 标记为已添加
                tagsAdded = true;
            } else {
                // 如果未找到 populartags 元素，尝试使用 MutationObserver 监听
                const observer = new MutationObserver ((mutations) => {
                    mutations.forEach ((mutation) => {
                        if (document.getElementById ('populartags')) {
                            addTagsToPopularTags ();
                            observer.disconnect (); // 完成后断开观察
                        }
                    });
                });

                // 观察整个文档的变化
                observer.observe (document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }

        // 新增功能：将标签添加到输入框
        function addTagToInput(tag) {
            // 查找标签输入框
            const tagInput = document.querySelector('input[name="tags"]');
            if (!tagInput) {
                console.warn('未找到标签输入框');
                return;
            }

            // 获取当前输入框的值
            let currentValue = tagInput.value.trim();

            // 检查标签是否已存在，避免重复添加
            const existingTags = currentValue.split(/\s+/);
            if (existingTags.includes(tag)) {
                return; // 如果标签已存在，则不添加
            }

            // 构建新的标签值，使用空格分隔
            let newValue = currentValue
            ? `${currentValue} ${tag}`  // 如果已有内容，添加空格和新标签
                : tag;                     // 如果为空，直接设置为标签

            // 更新输入框的值
            tagInput.value = newValue;

            // 触发输入事件，确保页面其他逻辑能感知到变化
            const event = new Event('input', { bubbles: true });
            tagInput.dispatchEvent(event);
        }

        // 执行新功能
        addTagsToPopularTags();
    });
})();
