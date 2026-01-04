// ==UserScript==
// @name         98论坛预览增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在帖子列表显示预览图和磁力链接
// @author       You
// @match        *://*.sehuatang.net/*
// @match        *://*.sehuatang.org/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      sehuatang.net
// @connect      sehuatang.org
// @license MIT
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/519556/98%E8%AE%BA%E5%9D%9B%E9%A2%84%E8%A7%88%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/519556/98%E8%AE%BA%E5%9D%9B%E9%A2%84%E8%A7%88%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof window.jQuery === 'undefined') {
        console.error('jQuery未能正确加载');
        return;
    }

    let $ = window.jQuery.noConflict(true);
    console.log('脚本开始运行');

    // 添加样式
    GM_addStyle(`
        .preview-box {
            padding: 10px;
            background: #f8f8f8;
            margin: 5px 0;
        }
        .preview-images {
            display: flex;
            gap: 10px;
            margin: 10px 0;
        }
        .preview-images img {
            max-width: 200px;
            max-height: 200px;
            border-radius: 4px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .preview-images img:hover {
            transform: scale(1.05);
        }
        .magnet-container {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #fff;
            padding: 8px;
            margin: 5px 0;
            border-radius: 4px;
        }
        .magnet-link {
            flex-grow: 1;
            word-break: break-all;
            font-family: monospace;
            padding: 5px;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        .magnet-link:hover {
            background-color: #f0f0f0;
        }
        .copy-btn {
            padding: 5px 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            white-space: nowrap;
        }
        .copy-btn:hover {
            background: #45a049;
        }
        .image-preview-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
        }
        .image-preview-overlay img {
            max-width: 90%;
            max-height: 90vh;
            object-fit: contain;
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
    `);

    // 添加图片预览功能
    function showImagePreview(imgUrl) {
        const overlay = $('<div class="image-preview-overlay"></div>');
        const img = $('<img>').attr('src', imgUrl);
        overlay.append(img);

        overlay.click(function() {
            overlay.fadeOut(200, function() {
                overlay.remove();
            });
        });

        $('body').append(overlay);
        overlay.fadeIn(200);
    }

    // 添加显示提示的函数
    function showTooltip(message) {
        const tooltip = $('<div class="copy-tooltip"></div>').text(message);
        $('body').append(tooltip);
        setTimeout(() => {
            tooltip.fadeOut(200, function() {
                tooltip.remove();
            });
        }, 1000);
    }

    function addPreview() {
        console.log('开始处理帖子列表');

        $('tbody[id^="normalthread_"]').each(function() {
            const threadBox = $(this);
            if (threadBox.hasClass('processed')) return;

            console.log('处理帖子:', threadBox.attr('id'));

            const threadLink = threadBox.find('a.xst').first();
            if (!threadLink.length) return;

            const threadUrl = threadLink.attr('href');
            const fullUrl = new URL(threadUrl, window.location.origin).href;

            const previewBox = $('<tr><td colspan="6" class="preview-box"></td></tr>');

            GM_xmlhttpRequest({
                method: 'GET',
                url: fullUrl,
                headers: {
                    'Referer': window.location.origin
                },
                onload: function(response) {
                    if (response.status !== 200) {
                        console.error('请求失败:', response.status);
                        return;
                    }

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    const postContent = $(doc).find('td[id^="postmessage_"]').first();
                    if (!postContent.length) {
                        console.log('未找到帖子内容');
                        return;
                    }

                    const images = postContent.find('img[file]').not('[smilieid]');
                    console.log('找到图片数量:', images.length);

                    if (images.length > 0) {
                        const imageBox = $('<div class="preview-images"></div>');
                        images.slice(0, 3).each(function() {
                            const imgUrl = $(this).attr('file');
                            if (imgUrl) {
                                const img = $('<img>').attr('src', imgUrl);
                                img.click(function(e) {
                                    e.preventDefault();
                                    showImagePreview(imgUrl);
                                });
                                imageBox.append(img);
                            }
                        });
                        previewBox.find('td').append(imageBox);
                    }

                    const content = postContent.text();
                    const magnetMatch = content.match(/magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,}/i);
                    if (magnetMatch) {
                        const magnetContainer = $('<div class="magnet-container"></div>');
                        const magnetLink = $('<div class="magnet-link"></div>')
                            .text(magnetMatch[0])
                            .css('cursor', 'pointer')
                            .attr('title', '点击复制磁力链接')
                            .click(function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                GM_setClipboard(magnetMatch[0]);
                                showTooltip('已复制磁力链接');
                                const $this = $(this);
                                $this.css('background-color', '#e6ffe6');
                                setTimeout(() => {
                                    $this.css('background-color', '');
                                }, 500);
                            });

                        const copyBtn = $('<button class="copy-btn">复制链接</button>')
                            .click(function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                GM_setClipboard(magnetMatch[0]);
                                showTooltip('已复制磁力链接');
                                const $this = $(this);
                                $this.text('已复制').css('background-color', '#45a049');
                                setTimeout(() => {
                                    $this.text('复制链接').css('background-color', '#4CAF50');
                                }, 1000);
                            });

                        magnetContainer.append(magnetLink, copyBtn);
                        previewBox.find('td').append(magnetContainer);
                    }

                    if (previewBox.find('td').children().length > 0) {
                        threadBox.find('tr').after(previewBox);
                        console.log('添加预览成功');
                    }
                },
                onerror: function(error) {
                    console.error('获取帖子内容失败:', error);
                }
            });

            threadBox.addClass('processed');
        });
    }

    $(document).ready(function() {
        console.log('页面加载完成，开始处理');
        setTimeout(addPreview, 1000);

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    console.log('检测到页面变化，重新处理');
                    addPreview();
                }
            });
        });

        const threadlist = document.getElementById('threadlisttableid');
        if (threadlist) {
            observer.observe(threadlist, {
                childList: true,
                subtree: true
            });
            console.log('开始监听页面变化');
        }
    });
})();
