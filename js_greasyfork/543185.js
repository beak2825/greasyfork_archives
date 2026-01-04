// ==UserScript==
// @name         Chiphell 高亮关键词及隐藏勋章
// @namespace    https://greasyfork.org/zh-CN/scripts/
// @icon         https://www.chiphell.com///favicon.ico
// @version      0.6
// @description  高亮Chiphell网站上的关键词并隐藏用户勋章
// @author       ddrwin
// @match        https://www.chiphell.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/543185/Chiphell%20%E9%AB%98%E4%BA%AE%E5%85%B3%E9%94%AE%E8%AF%8D%E5%8F%8A%E9%9A%90%E8%97%8F%E5%8B%8B%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/543185/Chiphell%20%E9%AB%98%E4%BA%AE%E5%85%B3%E9%94%AE%E8%AF%8D%E5%8F%8A%E9%9A%90%E8%97%8F%E5%8B%8B%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        highlightEnabled: true,
        highlightColor: '#FFFFCC',
        textColor: '#00cc00',
        keywords: ["nApoleon","ITX", "RTX", "DLSS", "Arrow", "Lake", "英特尔", "intel", "Ultra", "13th", "16th", "13代", "16代", "鸿蒙", "137","AI","某东","狗东","雷电","散热","usb4","显卡坞","PCIe","国补","265","新一代"]
    };

    // 隐藏勋章元素
    GM_addStyle(`
        p.md_ctrl {
            display: none !important;
        }

        .keyword-highlight {
            background-color: ${config.highlightColor} !important;
            color: ${config.textColor} !important;
            font-weight: bold !important;
            padding: 0 2px !important;
            border-radius: 3px !important;
        }
    `);

    console.log('初始加载完成，已隐藏元素');

    // 高亮关键词函数 - 适用于Discuz论坛结构
    function highlightKeywords() {
        if (!config.highlightEnabled) return;

        // 针对Discuz论坛的主要内容区域
        const $container = $('#threadlist, #postlist, .postmessage, .thread_subject');

        config.keywords.forEach(keyword => {
            const $elements = $container.find('a, span, td, th, div, p').not('.keyword-highlight');

            $elements.each(function() {
                const $this = $(this);
                const text = $this.text();

                if (text.includes(keyword) && $this.children().length === 0) {
                    const highlightedText = text.replace(
                        new RegExp(keyword, 'gi'),
                        `<span class="keyword-highlight">$&</span>`
                    );
                    $this.html(highlightedText);
                }
            });
        });
    }

    // 初始化高亮
    $(document).ready(function() {
        highlightKeywords();

        // 处理Discuz论坛的分页和帖子加载
        $(document).on('click', 'a.pg, a.next, a.prev', function() {
            setTimeout(highlightKeywords, 500); // 等待页面加载完成
        });
    });

    // 监测DOM变化以高亮动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                highlightKeywords();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 添加菜单命令以便在需要时切换高亮功能
    GM_registerMenuCommand('切换关键词高亮', function() {
        config.highlightEnabled = !config.highlightEnabled;

        if (config.highlightEnabled) {
            highlightKeywords();
            alert('关键词高亮已启用');
        } else {
            $('.keyword-highlight').each(function() {
                $(this).replaceWith($(this).text());
            });
            alert('关键词高亮已禁用');
        }
    });

    // 添加菜单命令以便修改关键词
    GM_registerMenuCommand('编辑关键词', function() {
        const newKeywords = prompt('请输入关键词，使用英文逗号分隔', config.keywords.join(','));
        if (newKeywords) {
            config.keywords = newKeywords.split(',').map(keyword => keyword.trim());
            // 重新高亮
            $('.keyword-highlight').each(function() {
                $(this).replaceWith($(this).text());
            });
            highlightKeywords();
        }
    });
})();