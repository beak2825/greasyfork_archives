// ==UserScript==
// @name         AGSVPT批量审种助手
// @namespace    https://github.com/yourusername
// @version      1.1
// @description  在AGSVPT种子列表页添加批量勾选与一键审核功能
// @author       YourName
// @match        *://*.agsvpt.com/torrents.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @license      MIT
// @connect      agsvpt.com
// @downloadURL https://update.greasyfork.org/scripts/539868/AGSVPT%E6%89%B9%E9%87%8F%E5%AE%A1%E7%A7%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/539868/AGSVPT%E6%89%B9%E9%87%8F%E5%AE%A1%E7%A7%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.jQuery;
    
    // 配置参数
    const config = {
        apiBaseUrl: 'https://www.agsvpt.com/web/torrent-approval-page',
        timeout: 2000,      // 请求间隔(毫秒)
        maxBatchSize: 20,   // 最大批量处理数量
        autoCloseWindows: true // 自动关闭审核窗口
    };

    // 存储选中的种子ID
    let selectedTorrents = [];
    
    // 初始化页面元素
    function initInterface() {
        // 添加控制面板
        const controlPanel = $(`
        <div id="batch-control" style="
            position: sticky;
            top: 10px;
            background: #f8f9fa;
            padding: 15px;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            z-index: 1000;
            margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        ">
            <h3 style="margin-top:0; color:#2c3e50;">批量种子审核</h3>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                <button id="select-all" class="btn btn-sm btn-outline-primary">全选</button>
                <button id="deselect-all" class="btn btn-sm btn-outline-secondary">取消全选</button>
                <div style="display:flex; align-items:center;">
                    <input type="checkbox" id="auto-close" checked>
                    <label for="auto-close" style="margin:0 10px 0 5px; user-select:none;">自动关闭窗口</label>
                </div>
                <button id="batch-approve" class="btn btn-sm btn-success" style="font-weight:bold;">
                    <i class="fa fa-check-circle"></i> 批量审核通过
                </button>
                <span id="selected-count" style="margin-left:10px; color:#3498db;">已选择: 0个种子</span>
            </div>
            <div id="progress-container" style="margin-top:15px; display:none;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span id="progress-status">准备开始...</span>
                    <span id="progress-percent">0%</span>
                </div>
                <div class="progress" style="height:20px;">
                    <div id="progress-bar" class="progress-bar progress-bar-striped" 
                         role="progressbar" style="width:0%;"></div>
                </div>
            </div>
        </div>`).insertBefore('#content > .box');

        // 为每个种子添加选择框（修复选择器问题）
        $('table.torrents > tbody > tr').each(function() {
            const $link = $(this).find('a[href*="details.php?id="]');
            if ($link.length === 0) return;
            
            const href = $link.attr('href');
            const match = href.match(/id=(\d+)/);
            if (!match) return;
            
            const torrentId = match[1];
            const checkbox = $(`<input type="checkbox" class="torrent-checkbox" 
                data-id="${torrentId}" style="margin-right:8px;">`);
            
            // 在种子标题前插入选择框
            const titleCell = $(this).find('td:nth-child(2)');
            titleCell.prepend(checkbox);
        });

        // 添加行选择功能
        $('table.torrents').on('click', 'tr', function(e) {
            if (e.target.tagName !== 'INPUT' && !$(e.target).closest('a').length) {
                const checkbox = $(this).find('.torrent-checkbox');
                checkbox.prop('checked', !checkbox.prop('checked'));
                checkbox.trigger('change');
            }
        });

        // 为选择框添加事件
        $('.torrent-checkbox').change(updateSelection);

        // 按钮事件绑定
        $('#select-all').click(() => {
            $('.torrent-checkbox').prop('checked', true).trigger('change');
        });
        
        $('#deselect-all').click(() => {
            $('.torrent-checkbox').prop('checked', false).trigger('change');
        });
        
        $('#auto-close').change(function() {
            GM_setValue('autoCloseWindows', this.checked);
        }).prop('checked', GM_getValue('autoCloseWindows', true));
        
        $('#batch-approve').click(startBatchApproval);
    }

    // 更新选中种子计数
    function updateSelection() {
        selectedTorrents = $('.torrent-checkbox:checked').map(function() {
            return $(this).data('id');
        }).get();
        
        $('#selected-count').text(`已选择: ${selectedTorrents.length}个种子`);
        $('#batch-approve').toggle(selectedTorrents.length > 0);
    }

    // 开始批量审核
    function startBatchApproval() {
        if (selectedTorrents.length === 0) {
            GM_notification({ 
                title: '批量审核',
                text: '请至少选择一个种子',
                highlight: true
            });
            return;
        }

        if (selectedTorrents.length > config.maxBatchSize) {
            if (!confirm(`您选择了 ${selectedTorrents.length} 个种子，超过建议批量处理数量(${config.maxBatchSize})。是否继续？`)) {
                return;
            }
        }

        // 显示进度条
        $('#progress-container').show();
        $('#progress-bar').css('width', '0%');
        $('#progress-percent').text('0%');
        $('#progress-status').text('审核准备中...');
        $('#batch-approve').prop('disabled', true);

        // 开始批量处理
        processBatch(0);
    }

    // 处理批量审核任务（优化错误处理）
    function processBatch(index) {
        if (index >= selectedTorrents.length) {
            // 全部完成
            $('#progress-status').html('<span style="color:#27ae60;">✓ 批量审核完成!</span>');
            GM_notification({ 
                title: '批量审核完成',
                text: `成功审核 ${selectedTorrents.length} 个种子`,
                timeout: 3000
            });
            
            // 30秒后重置界面
            setTimeout(() => {
                $('#progress-container').hide();
                $('.torrent-checkbox').prop('checked', false).trigger('change');
                $('#batch-approve').prop('disabled', false);
            }, 30000);
            return;
        }

        const torrentId = selectedTorrents[index];
        const progress = Math.floor((index / selectedTorrents.length) * 100);
        
        // 更新进度
        $('#progress-bar').css('width', `${progress}%`);
        $('#progress-percent').text(`${progress}%`);
        $('#progress-status').text(`审核中: ${index+1}/${selectedTorrents.length} (ID: ${torrentId})`);

        // 发送审核请求
        approveTorrent(torrentId, () => {
            // 处理下一个种子
            setTimeout(() => processBatch(index + 1), config.timeout);
        }, (error) => {
            console.error(`审核失败: ${torrentId}`, error);
            $('#progress-status').html(`<span style="color:#e74c3c;">❌ 审核失败: ID ${torrentId}</span>`);
            // 继续处理下一个种子
            setTimeout(() => processBatch(index + 1), config.timeout);
        });
    }

    // 审核单个种子（增强错误处理）
    function approveTorrent(torrentId, onSuccess, onError) {
        const url = `${config.apiBaseUrl}?torrent_id=${torrentId}`;
        const autoClose = $('#auto-close').prop('checked');

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                try {
                    if (response.status === 200) {
                        // 解析页面获取CSRF令牌
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        
                        // 查找CSRF令牌
                        const tokenInput = doc.querySelector('input[name="_token"]');
                        if (!tokenInput || !tokenInput.value) {
                            throw new Error("未找到CSRF令牌");
                        }
                        
                        // 构建表单数据
                        const formData = {
                            '_token': tokenInput.value,
                            'approval_action': 'approve',
                            'comment': '批量审核通过',
                            'torrent_id': torrentId
                        };

                        // 提交审核请求
                        submitApproval(formData, onSuccess, onError);
                    } else {
                        throw new Error(`HTTP错误: ${response.status}`);
                    }
                } catch (e) {
                    if (onError) onError(e);
                }
            },
            onerror: function(error) {
                if (onError) onError(error);
            }
        });
    }

    // 提交审核表单（增强错误处理）
    function submitApproval(formData, onSuccess, onError) {
        GM_xmlhttpRequest({
            method: "POST",
            url: config.apiBaseUrl,
            data: Object.keys(formData).map(key => 
                `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`
            ).join('&'),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                if (response.status === 200 || response.status === 302) {
                    console.log(`审核成功: ${formData.torrent_id}`);
                    if (onSuccess) onSuccess();
                } else {
                    const error = new Error(`审核失败: ${response.status} ${response.statusText}`);
                    if (onError) onError(error);
                }
            },
            onerror: function(error) {
                if (onError) onError(error);
            }
        });
    }

    // 添加CSS样式
    function addStyles() {
        const css = `
            .torrent-checkbox {
                cursor: pointer;
                transform: scale(1.2);
            }
            .torrent-checkbox:checked {
                accent-color: #3498db;
            }
            #batch-control {
                transition: all 0.3s ease;
            }
            #batch-approve:hover {
                transform: scale(1.03);
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            .progress-bar {
                transition: width 0.5s ease;
            }
            tr:hover {
                background-color: #f8f9fa !important;
            }
            #progress-bar.progress-bar-error {
                background-color: #e74c3c;
            }
        `;
        $('<style>').text(css).appendTo('head');
    }

    // 页面初始化（添加重试机制）
    function init() {
        if ($('table.torrents').length) {
            try {
                addStyles();
                initInterface();
                console.log('AGSVPT批量审种助手已激活');
            } catch (e) {
                console.error('初始化失败，将在2秒后重试', e);
                setTimeout(init, 2000);
            }
        }
    }

    // 页面加载完成后执行
    $(document).ready(function() {
        // 确保在种子列表页面执行
        if (window.location.href.includes('torrents.php')) {
            init();
        }
    });
})();