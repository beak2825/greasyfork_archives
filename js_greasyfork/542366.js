// ==UserScript==
// @name         课程分数信息查看（中南林）-电脑端美化版
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  显示综合成绩信息分配比例与成绩，扩展可点击区域，优化布局。新增提示判断课程是否分对综合成绩进行划分
// @match        http://jwgl.webvpn.csuft.edu.cn/jsxsd/kscj/*
// @match        http://jwgl.csuft.edu.cn/jsxsd/kscj/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/542366/%E8%AF%BE%E7%A8%8B%E5%88%86%E6%95%B0%E4%BF%A1%E6%81%AF%E6%9F%A5%E7%9C%8B%EF%BC%88%E4%B8%AD%E5%8D%97%E6%9E%97%EF%BC%89-%E7%94%B5%E8%84%91%E7%AB%AF%E7%BE%8E%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542366/%E8%AF%BE%E7%A8%8B%E5%88%86%E6%95%B0%E4%BF%A1%E6%81%AF%E6%9F%A5%E7%9C%8B%EF%BC%88%E4%B8%AD%E5%8D%97%E6%9E%97%EF%BC%89-%E7%94%B5%E8%84%91%E7%AB%AF%E7%BE%8E%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加全局样式
    GM_addStyle(`
        .info-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 4px;
        }

        .info-marker {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 4px;
            transition: all 0.2s ease;
            font-size: 0.9em;
            font-weight: bold;
        }

        .info-marker.has-info {
            background-color: rgba(40, 167, 69, 0.1);
            color: #28a745;
        }

        .info-marker.no-info {
            background-color: rgba(220, 53, 69, 0.1);
            color: #dc3545;
        }

        .info-marker:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .info-marker.has-info:hover {
            background-color: rgba(40, 167, 69, 0.2);
        }

        .info-marker.no-info:hover {
            background-color: rgba(220, 53, 69, 0.2);
        }

        .info-loader {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            color: #6c757d;
            font-size: 0.9em;
            margin-top: 4px;
        }

        .info-score {
            font-weight: bold;
            color: #007bff;
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .info-score:hover {
            background-color: rgba(0, 123, 255, 0.1);
            transform: translateY(-1px);
        }
    `);

    // 提取URL的正则表达式
    function extractUrl(jsCode) {
        if (!jsCode) return null;
        try {
            if (jsCode.startsWith('http')) return jsCode;
            var matches = jsCode.match(/openWindow\('([^']+)/);
            return matches && matches[1] ? matches[1] : null;
        } catch (error) {
            console.warn('URL提取错误:', error);
            return null;
        }
    }

    // 创建可点击标记
    function createClickableMarker(cell, hasInfo, url) {
        // 移除旧标记
        var oldMarkers = cell.querySelectorAll('.info-container');
        for (var i = 0; i < oldMarkers.length; i++) {
            var marker = oldMarkers[i];
            if (marker.parentNode === cell) {
                cell.removeChild(marker);
            }
        }

        // 创建容器
        var container = document.createElement('div');
        container.className = 'info-container';

        // 创建成绩显示
        var scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'info-score';

        // 获取原始分数
        var originalScore = cell.querySelector('a font[color="blue"]');
        var scoreValue = originalScore ? originalScore.textContent : '?';

        scoreDisplay.textContent = scoreValue;
        scoreDisplay.addEventListener('click', function(e) {
            e.stopPropagation();
            if (url) openDetailsPage(url);
        });

        // 创建标记
        var marker = document.createElement('div');
        marker.className = 'info-marker ' + (hasInfo ? 'has-info' : 'no-info');

        // 创建图标
        var icon = document.createElement('span');
        icon.textContent = hasInfo ? '✓' : '✕';

        // 创建文本
        var text = document.createElement('span');
        text.textContent = hasInfo ? '有' : '无';

        // 添加点击事件
        if (url) {
            marker.addEventListener('click', function(e) {
                e.stopPropagation();
                openDetailsPage(url);
            });
        }

        // 组装元素
        marker.appendChild(icon);
        marker.appendChild(text);
        container.appendChild(scoreDisplay);
        container.appendChild(marker);
        cell.appendChild(container);

        // 移除原始链接
        var originalLink = cell.querySelector('a');
        if (originalLink) {
            originalLink.style.display = 'none';
        }

        return container;
    }

    // 打开详情页
    function openDetailsPage(url) {
        if (typeof unsafeWindow.openWindow === 'function') {
            unsafeWindow.openWindow(url, 700, 500);
        } else {
            window.open(url, '_blank', 'width=700,height=500');
        }
    }

    // 主处理函数
    function processPage() {
        try {
            // 1. 恢复注释中的成绩链接
            var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_COMMENT, null, false);
            var toRemove = [];
            var node;

            while ((node = walker.nextNode())) {
                try {
                    var content = node.nodeValue.trim();
                    if (content.startsWith('<td') && content.endsWith('</td>')) {
                        content = content.replace(/&amp;/g, '&');

                        var range = document.createRange();
                        range.setStartAfter(node);
                        var frag = range.createContextualFragment(content);

                        node.parentNode.insertBefore(frag, node);
                        toRemove.push(node);
                    }
                } catch (e) {
                    console.warn('恢复注释节点时出错:', e);
                }
            }

            toRemove.forEach(function(n) { n.remove(); });

            // 2. 隐藏原始不可点击的成绩
            var dataTable = document.getElementById('dataList');
            if (!dataTable) return;

            var rows = dataTable.rows;
            for (var i = 0; i < rows.length; i++) {
                try {
                    var cells = rows[i].cells;
                    if (cells.length > 5 && cells[5]) {
                        cells[5].style.display = 'none';
                    }
                } catch (e) {
                    console.warn('处理行时出错:', e);
                }
            }

            // 3. 新增：智能检测信息状态
            detectInfoStatus();
        } catch (error) {
            console.error('主处理函数出错:', error);
        }
    }

    // 修改detectInfoStatus函数
    function detectInfoStatus() {
        try {
            var scoreCells = document.querySelectorAll('#dataList tr td:nth-child(5)');
            var requestQueue = [];

            for (var i = 0; i < scoreCells.length; i++) {
                try {
                    var cell = scoreCells[i];
                    var link = cell.querySelector('a');
                    if (!link || link.dataset.checked) continue;
                    requestQueue.push({ cell: cell, link: link });
                } catch (e) {
                    console.warn('添加请求到队列时出错:', e);
                }
            }

            // 顺序处理队列
            var processNext = function(index) {
                if (index >= requestQueue.length) {
                    return;
                }

                try {
                    var item = requestQueue[index];
                    var cell = item.cell;
                    var link = item.link;

                    if (!document.body.contains(cell)) {
                        setTimeout(function() { processNext(index + 1); }, 300);
                        return;
                    }

                    link.dataset.checked = 'true';

                    // 获取实际URL
                    var jsCode = link.getAttribute('href');
                    var actualUrl = extractUrl(jsCode);

                    // 处理无效URL
                    if (!actualUrl) {
                        createClickableMarker(cell, false);
                        setTimeout(function() { processNext(index + 1); }, 300);
                        return;
                    }

                    // 修正URL
                    var correctedUrl = actualUrl.replace(/&amp;/g, '&');

                    // 发送请求
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: correctedUrl,
                        onload: function(response) {
                            try {
                                if (!document.body.contains(cell)) return;

                                // 检测信息存在性
                                var hasInfo = /(期末成绩|平时成绩比例|成绩分类)/.test(response.responseText);
                                createClickableMarker(cell, hasInfo, correctedUrl);
                                setTimeout(function() { processNext(index + 1); }, 300);
                            } catch (e) {
                                console.error('请求处理错误:', e);
                                createClickableMarker(cell, false);
                                setTimeout(function() { processNext(index + 1); }, 300);
                            }
                        },
                        onerror: function() {
                            createClickableMarker(cell, false);
                            setTimeout(function() { processNext(index + 1); }, 300);
                        },
                        ontimeout: function() {
                            createClickableMarker(cell, false);
                            setTimeout(function() { processNext(index + 1); }, 300);
                        },
                        timeout: 5000
                    });
                } catch (error) {
                    console.error('处理请求队列时出错:', error);
                    setTimeout(function() { processNext(index + 1); }, 300);
                }
            };

            // 启动处理队列
            processNext(0);
        } catch (error) {
            // 不再调用 hideTableLoader
        }
    }

    // 初始执行
    try {
        processPage();
    } catch (error) {
        console.error('脚本初始化错误:', error);
    }

    // 监听动态变化
    var observer = new MutationObserver(function(mutations) {
        var needsUpdate = false;
        for (var i = 0; i < mutations.length; i++) {
            if (mutations[i].addedNodes.length) {
                needsUpdate = true;
                break;
            }
        }
        if (needsUpdate) {
            try {
                processPage();
            } catch (error) {
                console.error('MutationObserver处理错误:', error);
            }
        }
    });

    try {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    } catch (error) {
        console.error('MutationObserver初始化错误:', error);
    }
})();
