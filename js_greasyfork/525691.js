// ==UserScript==
// @name         Stage1 Local Time Replacer
// @name:zh-CN   Stage1本地时间替换
// @namespace    user-NITOUCHE
// @version      1.3.3
// @description  Replace and overwrite China Standard Time with local time on Stage1 forums.
// @description:zh-CN 用本地时间替换覆盖Stage1论坛中的中国时间。
// @author       DS泥头车
// @match        https://*.stage1st.com/2b/*
// @icon         https://bbs.stage1st.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525691/Stage1%20Local%20Time%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/525691/Stage1%20Local%20Time%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加 CSS 样式到页面
    // 使用 GM_addStyle 是为了避免与页面原有 CSS 冲突，并确保样式能被正确应用
    GM_addStyle(`
        .s1-local-time {
            font: inherit !important; /* 继承父元素的字体样式，!important 确保覆盖原有样式 */
        }
        .s1-local-time.blue-replaced {
            color: #000000 !important; /* 替换为蓝色时的时间颜色，!important 确保覆盖原有样式 */
        }
        .s1-local-time.orange-replaced {
            color: #F26C4F !important; /* 替换为橙色时的时间颜色，!important 确保覆盖原有样式 */
        }
    `);

    let isProcessing = false; // 标志变量，防止重复处理，避免 MutationObserver 触发多次处理

    // 获取元素的颜色值 (RGB 格式)
    function getElementColor(el) {
        const color = window.getComputedStyle(el).color; // 获取计算后的颜色值
        const rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i); // 使用正则表达式匹配 RGB 格式
        if (rgb) {
            // 将 RGB 转换为十六进制颜色值 (方便比较)
            return (parseInt(rgb[1]) << 16) | (parseInt(rgb[2]) << 8) | parseInt(rgb[3]);
        }
        return null; // 如果颜色格式不是 RGB，则返回 null
    }

    // 将北京时间转换为本地时间
    function convertBeijingToLocal(beijingTime) {
        try {
            // 创建 Date 对象，并指定时区为 UTC+8 (北京时间)
            const date = new Date(beijingTime + '+08:00');
            // 使用 toLocaleString 格式化为本地时间，并指定中文格式
            return date.toLocaleString('zh-CN', {
                year: 'numeric', // 年份：四位数字
                month: 'numeric', // 月份：数字
                day: 'numeric',   // 日期：数字
                hour: '2-digit',  // 小时：两位数字 (24小时制)
                minute: '2-digit',// 分钟：两位数字
                hour12: false     // 禁用 12 小时制
            }).replace(/(\d+)\/(\d+)\/(\d+)/, '$1-$2-$3'); // 将日期格式中的斜杠替换为短横线，例如：2023/10/26 -> 2023-10-26
        } catch(e) {
            // 如果转换出错 (例如，时间格式不正确)，则返回原始北京时间
            return beijingTime;
        }
    }

    // 处理单个元素及其子元素中的时间字符串
    function processElement(el) {
        if (el.dataset.timeReplaced || el.querySelector('[data-time-replaced]')) return; // 如果元素或其子元素已经被处理过，则跳过，避免重复处理
        let processed = false; // 标记是否在该元素中找到了并处理了时间
        const timeRegex = /(\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2})/; // 匹配 "YYYY-MM-DD HH:MM" 格式的时间字符串的正则表达式
        const treeWalker = document.createTreeWalker(
            el,                                  // 从当前元素开始遍历
            NodeFilter.SHOW_TEXT,                // 只遍历文本节点
            null,                                // 无需自定义过滤器
            false                                // 不需要实体扩展
        );
        let textNode;
        while (textNode = treeWalker.nextNode()) { // 遍历文本节点
            if (textNode.textContent.trim() && timeRegex.test(textNode.textContent)) { // 如果文本节点不为空白，并且包含匹配时间格式的字符串
                const match = textNode.textContent.match(timeRegex); // 匹配时间字符串
                if (!match) continue; // 如果没有匹配到，则继续下一个文本节点
                const originalColor = getElementColor(textNode.parentElement); // 获取时间字符串父元素的颜色，用于判断时间颜色类型
                let colorClass = ''; // 初始化颜色 CSS 类名
                if (originalColor === 0xF26C4F) { // 橙色 (0xF26C4F 是橙色的十六进制 RGB 值)
                    colorClass = 'orange-replaced';
                } else if (originalColor === 0x022C80 || originalColor === 0x22c || originalColor === 0x999999) { // 蓝色 (0x022C80, 0x22c, 0x999999 可能是不同深浅的蓝色或灰色)
                    colorClass = 'blue-replaced';
                }
                const timeSpan = document.createElement('span'); // 创建 span 元素用于包裹转换后的本地时间
                timeSpan.className = `s1-local-time ${colorClass}`.trim(); // 设置 span 的 class，应用样式
                timeSpan.textContent = convertBeijingToLocal(match[0]); // 将北京时间转换为本地时间并设置为 span 的文本内容
                timeSpan.dataset.timeReplaced = "true"; // 标记该 span 已经被时间替换过
                const beforeTimeText = document.createTextNode(textNode.textContent.substring(0, match.index)); // 创建时间字符串前面的文本节点
                const afterTimeText = document.createTextNode(textNode.textContent.substring(match.index + match[0].length)); // 创建时间字符串后面的文本节点
                const parentNode = textNode.parentNode; // 获取文本节点的父元素
                parentNode.replaceChild(timeSpan, textNode); // 将原来的文本节点替换为 span 元素
                if (afterTimeText.textContent) { // 如果时间字符串后面还有文本
                    timeSpan.parentNode.insertBefore(afterTimeText, timeSpan.nextSibling); // 将后面的文本节点插入到 span 后面
                }
                if (beforeTimeText.textContent) { // 如果时间字符串前面还有文本
                    timeSpan.parentNode.insertBefore(beforeTimeText, timeSpan); // 将前面的文本节点插入到 span 前面
                }
                processed = true; // 标记在该元素中找到了并处理了时间
                break; // 找到并处理一个时间后，跳出当前文本节点的遍历，处理下一个文本节点 (TreeWalker 会自动继续遍历)
            }
        }
        if (processed) {
            el.dataset.timeReplaced = "true"; // 标记该元素已经被处理过，即使只替换了一个时间，也避免重复处理
        }
    }

    // 处理页面中所有符合选择器条件的元素
    function processAll() {
        if (isProcessing) return; // 如果正在处理中，则直接返回，避免重复处理
        isProcessing = true; // 设置处理中标志
        document.querySelectorAll(`
            em[id^="authorposton"],   /* Discuz! 帖子发布时间 */
            i.pstatus,                /* Discuz! 可能的状态时间 */
            cite,                     /* 引用内容的时间 */
            td.by em span,             /* Discuz! 回复时间 */
            a[href*="forum.php?mod=redirect"], /* Discuz! 跳转链接中的时间 */
            div.quote font,            /* Discuz! 引用块中的时间 (旧版) */
            div.blockquote font,       /* Discuz! 引用块中的时间 (新版) */
            blockquote font,          /* 通用引用块中的时间 */
            a[href*="forum.php?mod=misc"], /* Discuz! 其他链接中的时间 */
            ul#pbbs li,               /* Discuz! 瀑布流帖子列表时间 */
            table td,                 /* 通用表格单元格，可能包含时间 */
            span.xg1.xw0,             /* Discuz! 一些辅助信息的时间 */
            p span,                   /* 段落中的 span，可能包含时间 */
            li.bbda span.xg1          /* Discuz! 列表项辅助信息时间 */
        `).forEach(processElement); // 遍历选择器匹配到的所有元素，并调用 processElement 函数进行处理
        isProcessing = false; // 清除处理中标志
    }

    processAll(); // 页面加载时立即执行一次，处理页面上已有的时间

    // 创建 MutationObserver 监听 DOM 变化
    new MutationObserver(mutations => {
        mutations.forEach(mut => { // 遍历每个 mutation 记录
            if (mut.type === 'childList') { // 如果 mutation 类型是子节点列表变化 (即有节点被添加或移除)
                mut.addedNodes.forEach(node => { // 遍历所有被添加的节点
                    if (node.nodeType === Node.ELEMENT_NODE) { // 如果添加的节点是元素节点
                        processAll(); // 重新处理所有符合条件的元素，包括新添加的元素
                    }
                });
            }
        });
    }).observe(document.body, { // 监听 document.body 及其子树的 DOM 变化
        childList: true,     // 监听子节点列表变化 (添加或移除节点)
        subtree: true,       // 监听整个子树的变化，包括后代节点
        attributes: false    // 不监听属性变化
    });
})();