// ==UserScript==
// @name         动漫花园预览增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在动漫花园种子列表显示预览和磁力链接
// @author       You
// @match        *://dmhy.org/*
// @match        *://share.dmhy.org/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519551/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E9%A2%84%E8%A7%88%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/519551/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E9%A2%84%E8%A7%88%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 确保jQuery加载
    if (typeof window.jQuery === 'undefined') {
        console.error('jQuery未能正确加载');
        return;
    }

    let $ = window.jQuery.noConflict(true);

    // 添加样式
    GM_addStyle(`
        .preview-box {
            padding: 10px;
            background: #f8f8f8;
            margin: 5px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .magnet-container {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #fff;
            padding: 8px;
            margin: 5px 0;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }
        .magnet-link {
            flex-grow: 1;
            word-break: break-all;
            font-family: monospace;
            font-size: 12px;
            padding: 5px;
            border-radius: 4px;
            background: #f5f5f5;
            cursor: pointer;
        }
        .magnet-link:hover {
            background-color: #e8e8e8;
        }
        .copy-btn {
            padding: 5px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .copy-btn:hover {
            background: #45a049;
        }
        .copy-tooltip {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10000;
            pointer-events: none;
        }
        .file-info {
            margin-top: 5px;
            font-size: 12px;
            color: #666;
        }
        .preview-container {
            display: flex;
            gap: 15px;
            align-items: flex-start;
        }
        .preview-image {
            width: 200px;
            height: 150px;
            background: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            overflow: hidden;
        }
        .preview-image img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        .preview-info {
            flex: 1;
        }
        .loading {
            color: #666;
            font-size: 14px;
        }
        .no-image {
            color: #999;
            font-size: 14px;
        }
    `);

    // 显示提示
    function showTooltip(message) {
        const tooltip = $('<div class="copy-tooltip"></div>').text(message);
        $('body').append(tooltip);
        setTimeout(() => {
            tooltip.fadeOut(200, function() {
                tooltip.remove();
            });
        }, 1000);
    }

    // 处理种子列表
    function processTable() {
        $('table.tablesorter tbody tr').each(function() {
            const row = $(this);
            if (row.hasClass('processed')) return;

            // 获取详情页链接
            const detailLink = row.find('td.title a').attr('href');
            if (!detailLink) return;

            // 获取磁力链接并提取哈��值
            const fullMagnetLink = row.find('a[href^="magnet:?"]').attr('href');
            if (!fullMagnetLink) return;

            const hashMatch = fullMagnetLink.match(/magnet:\?xt=urn:btih:([A-Za-z0-9]+)/i);
            if (!hashMatch) return;

            const shortMagnetLink = `magnet:?xt=urn:btih:${hashMatch[1]}`;
            const fileSize = row.find('td:nth-child(5)').text().trim();

            // 创建预览框
            const previewBox = $(`
                <tr>
                    <td colspan="6" class="preview-box">
                        <div class="preview-container">
                            <div class="preview-image">
                                <span class="loading">加载中...</span>
                            </div>
                            <div class="preview-info">
                                <div class="magnet-container">
                                    <div class="magnet-link" title="点击复制磁力链接">${shortMagnetLink}</div>
                                    <button class="copy-btn">复制链接</button>
                                </div>
                                <div class="file-info">
                                    文件大小: ${fileSize}
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            `);

            // 获取预览图
            $.get(detailLink, function(response) {
                const html = $(response);
                const previewImageDiv = previewBox.find('.preview-image');

                // 获取 topic-nfo box ui-corner-all 区域内的图片
                const topicInfo = html.find('div.topic-nfo.box.ui-corner-all');
                if (topicInfo.length) {
                    // 查找所有图片，优先匹配腾讯视频的封面图
                    const contentImages = topicInfo.find('img').filter(function() {
                        const src = $(this).attr('src');
                        // 匹配 puui.qpic.cn 域名的图片
                        return src && (
                            src.includes('puui.qpic.cn/vcover_vt_pic') ||
                            src.includes('puui.qpic.cn/vcover') ||
                            src.includes('qpic.cn')
                        );
                    });

                    if (contentImages.length) {
                        const imgUrl = contentImages.first().attr('src');
                        if (imgUrl) {
                            const fullImgUrl = imgUrl.startsWith('http') ?
                                imgUrl :
                                new URL(imgUrl, window.location.origin).href;

                            previewImageDiv.html(`
                                <img src="${fullImgUrl}" alt="预览图"
                                    onerror="this.parentElement.innerHTML='<span class=\'no-image\'>图片加载失败</span>'"
                                    style="cursor: pointer"
                                    onclick="window.open('${fullImgUrl}', '_blank')"
                                >
                            `);
                        } else {
                            previewImageDiv.html('<span class="no-image">无图</span>');
                        }
                    } else {
                        // 如果没有找到腾讯视频封面，尝试查找其他图片
                        const otherImages = topicInfo.find('img').filter(function() {
                            const src = $(this).attr('src');
                            return src && src.length > 0;
                        }).first();

                        if (otherImages.length) {
                            const imgUrl = otherImages.attr('src');
                            if (imgUrl) {
                                const fullImgUrl = imgUrl.startsWith('http') ?
                                    imgUrl :
                                    new URL(imgUrl, window.location.origin).href;

                                previewImageDiv.html(`
                                    <img src="${fullImgUrl}" alt="预览图"
                                        onerror="this.parentElement.innerHTML='<span class=\'no-image\'>图片加载失败</span>'"
                                        style="cursor: pointer"
                                        onclick="window.open('${fullImgUrl}', '_blank')"
                                    >
                                `);
                            } else {
                                previewImageDiv.html('<span class="no-image">无图</span>');
                            }
                        } else {
                            previewImageDiv.html('<span class="no-image">无图</span>');
                        }
                    }
                } else {
                    previewImageDiv.html('<span class="no-image">无图</span>');
                }
            }).fail(function() {
                previewBox.find('.preview-image').html('<span class="no-image">加载失败</span>');
            });

            // 添加复制功能
            previewBox.find('.magnet-link').click(function() {
                GM_setClipboard(shortMagnetLink);
                showTooltip('已复制磁力链接');
                $(this).css('background-color', '#e6ffe6');
                setTimeout(() => {
                    $(this).css('background-color', '');
                }, 500);
            });

            previewBox.find('.copy-btn').click(function() {
                GM_setClipboard(shortMagnetLink);
                showTooltip('已复制磁力链接');
                const $this = $(this);
                $this.text('已复制').css('background-color', '#45a049');
                setTimeout(() => {
                    $this.text('复制链接').css('background-color', '#4CAF50');
                }, 1000);
            });

            // 插入预览框
            row.after(previewBox);
            row.addClass('processed');
        });
    }

    // 页面加载完成后执行
    $(document).ready(function() {
        setTimeout(processTable, 1000);

        // 监听页面变化
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    processTable();
                }
            });
        });

        const tableContainer = document.querySelector('table.tablesorter');
        if (tableContainer) {
            observer.observe(tableContainer, {
                childList: true,
                subtree: true
            });
        }
    });
})();
