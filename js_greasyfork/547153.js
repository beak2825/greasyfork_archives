// ==UserScript==
// @name           电视猫剧集剧情精准复制
// @description    提取剧集标题+完整段落剧情，严格保留原始排版
// @author         自定义
// @version        1.3.1
// @icon           https://www.tvmao.com/favicon.ico
// @grant          GM_addStyle
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include        https://www.tvmao.com/*
// @run-at         document-end
// @license        Apache-2.0
// @namespace https://greasyfork.org/users/967749
// @downloadURL https://update.greasyfork.org/scripts/547153/%E7%94%B5%E8%A7%86%E7%8C%AB%E5%89%A7%E9%9B%86%E5%89%A7%E6%83%85%E7%B2%BE%E5%87%86%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/547153/%E7%94%B5%E8%A7%86%E7%8C%AB%E5%89%A7%E9%9B%86%E5%89%A7%E6%83%85%E7%B2%BE%E5%87%86%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

$(function () {
    // 按钮样式（增强交互感）
    GM_addStyle(`
        .copy-ep-btn {
            padding: 8px 16px;
            background: #36b37e;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 10px 0;
            font-size: 14px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .copy-ep-btn:hover {
            background: #2d9d6b;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px rgba(0,0,0,0.15);
        }
        .copy-ep-btn:active {
            transform: translateY(1px);
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .copy-ep-btn.copying {
            background: #666;
            cursor: wait;
        }
        .copy-status {
            margin-left: 10px;
            font-size: 14px;
            transition: opacity 0.3s ease;
        }
    `);

    // 精准提取标题（适配当前页面结构）
    function getTitle() {
        // 优先从截图中对应标题元素p.epi_t提取
        const epiTitle = $('p.epi_t').text().trim();
        if (epiTitle) return epiTitle;
        
        // 原有适配逻辑，作为降级
        return $('p:contains("第1集")').first().text().trim() ||
               document.title.split('-')[0].trim() ||
               '未知标题';
    }

    // 核心：提取带段落结构的剧情内容
    function getContent() {
        const contentElems = $('article.epi_c p:not(.eptitle), .epi_content p');
        if (!contentElems.length) return '无有效剧情内容';

        // 逐段提取文本，保留原始换行
        let content = '';
        contentElems.each((index, elem) => {
            const paraText = $(elem).text().trim();
            if (paraText) { // 过滤空段落
                content += paraText + '\n\n'; // 段落之间用两个换行分隔
            }
        });
        return content.trim(); // 清理末尾多余换行
    }

    // 复制逻辑（兼容新旧浏览器，增加超时处理）
    function copyText(text) {
        // 增加超时处理，防止复制操作无响应
        const copyPromise = navigator.clipboard 
            ? navigator.clipboard.writeText(text)
            : new Promise((resolve) => {
                const textarea = $('<textarea>').val(text).appendTo('body');
                textarea[0].select();
                document.execCommand('copy');
                textarea.remove();
                resolve();
            });
        
        // 500ms超时限制，避免长时间等待
        return Promise.race([
            copyPromise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('复制超时')), 500)
            )
        ]);
    }

    // 按钮与状态提示（优化交互反馈时长）
    const $status = $('<span class="copy-status"></span>');
    const $btn = $('<button class="copy-ep-btn">复制标题&剧情</button>')
        .prependTo('.epi-main')
        .on('click', async function () {
            // 防止重复点击
            if ($btn.hasClass('copying')) return;
            
            $btn.addClass('copying').text('复制中...');
            $status.text('').css('color', '');
            
            try {
                // 提前获取内容，减少复制阶段的耗时
                const title = getTitle();
                const content = getContent();
                const text = `${title}\n\n${content}`;
                
                await copyText(text);
                $status.text('✓ 复制成功！').css('color', 'green');
            } catch (err) {
                $status.text('✗ 复制失败，请重试').css('color', 'red');
            } finally {
                // 缩短状态显示时间，总时长控制在800ms左右
                setTimeout(() => {
                    $btn.removeClass('copying').text('复制标题+剧情');
                }, 300);
                
                setTimeout(() => {
                    $status.fadeOut(300, () => $status.text('').show());
                }, 600);
            }
        });

    $btn.after($status);
});
