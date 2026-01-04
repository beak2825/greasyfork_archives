// ==UserScript==
// @name         领星下载物流面单
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键下载物流面单
// @author       zxiaobai
// @match        https://oms.xlwms.com/warehouse/*
// @icon         https://oms.xlwms.com/favicon.ico
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524108/%E9%A2%86%E6%98%9F%E4%B8%8B%E8%BD%BD%E7%89%A9%E6%B5%81%E9%9D%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/524108/%E9%A2%86%E6%98%9F%E4%B8%8B%E8%BD%BD%E7%89%A9%E6%B5%81%E9%9D%A2%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        @import url('https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css');
    `);

    const notyf = new Notyf({
        position: {
            x: 'center',
            y: 'top',
        },
    });

    function downloadPdf(rowid) {
        if (!rowid) notyf.error('获取面单失败, 请联系开发人员')
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none'; // 隐藏 iframe
        iframe.src = 'https://oms.xlwms.com/warehouse/packet/detail/' + rowid;
        document.body.appendChild(iframe); // 将 iframe 添加到页面中

        // 等待 iframe 加载并模拟点击目标按钮
        iframe.onload = function() {
            try {
                let attempts = 0; // 计数器，跟踪检查次数
                const maxAttempts = 10;
                const interval = setInterval(function() {
                    // 查找目标按钮
                    const button = iframe.contentWindow.document.querySelector('.file-item .lx_table_download'); // 替换为目标按钮的选择器
                    if (button) {
                        button.click(); // 模拟点击
                        clearInterval(interval); // 找到按钮后清除轮询
                        setTimeout(function() {
                            document.body.removeChild(iframe);
                        }, 2000); // 等待 2 秒确保操作完成再移除
                    } else if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        notyf.error('面单未找到，请联系开发人员');
                        document.body.removeChild(iframe);
                    } else {
                        attempts++; // 增加检查次数
                    }
                }, 500);
            } catch (error) {
                notyf.error('下载出错了，请联系开发人员');
                document.body.removeChild(iframe)
            }
        };
    }


    // 创建 MutationObserver 来监听 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 如果是新增节点（比如新的一行），则插入按钮
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    // 确保是表格行并且是操作列
                    if (node.nodeType === 1 && node.querySelector('.vxe-body--row .col--operate')) {
                        // 在新增的行中插入“下载面单”按钮
                        const actionCell = node.querySelector('.vxe-body--column.col--operate .vxe-cell .ak-dropdown');
                        if (actionCell && !actionCell.querySelector('.download-btn')) {
                            // 创建新的下载面单按钮
                            const downloadButton = document.createElement('button');
                            downloadButton.type = 'button';
                            downloadButton.classList.add('el-button', 'out-btn', 'single-btn', 'el-button--text', 'el-button--mini', 'is-round', 'download-btn');
                            downloadButton.innerHTML = '<span class="text-wrap"> 下载面单 </span>';
                            // 给按钮添加点击事件
                            downloadButton.addEventListener('click', function() {
                                const rowid = node.getAttribute('rowid')
                                downloadPdf(rowid)
                            });
                            // 将新按钮插入到操作列
                            actionCell.appendChild(downloadButton);
                        }
                    }
                });
            }
        });
    });

    // 配置 MutationObserver 监听整个表格的变化
    const config = { childList: true, subtree: true };

    // 选择目标节点（比如表格的主体部分）
    const targetNode = document.body;

    if (targetNode) {
        // 开始监听目标节点
        observer.observe(targetNode, config);
    }

    // 添加批量下载按钮
    const batchDownloadButton = document.createElement('button');
    batchDownloadButton.type = 'button';
    batchDownloadButton.style.height = '36px';
    batchDownloadButton.classList.add('el-button', 'out-btn', 'single-btn', 'el-button--text', 'el-button--mini', 'is-round', 'batch-download-btn');
    batchDownloadButton.innerHTML = '<span class="text-wrap"> 批量下载面单 </span>';
    setTimeout(function() {
    // 将批量下载按钮添加到页面上方或合适的位置
        const buttonContainer = document.querySelector('.ak-operate-wrapper');
        if (buttonContainer) {
            buttonContainer.appendChild(batchDownloadButton);
        }

        // 批量下载按钮点击事件
        batchDownloadButton.addEventListener('click', function() {
            const rows = Array.from(document.querySelectorAll('.vxe-body--row')); // 查找已勾选的行
            const selectedRows = rows.filter((row) => row.querySelector('.vxe-cell--checkbox.is--checked'))
            notyf.success(`共${selectedRows.length}个面单`)
            setTimeout(function() {
                selectedRows.forEach(function(row) {
                    const rowid = row.getAttribute('rowid')
                    downloadPdf(rowid)
                });
            }, 500)
        });
    }, 1000)
})();
