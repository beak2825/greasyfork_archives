// ==UserScript==
// @name         小红书app复制链接转换为直接可访问链接
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动将小红书app分享的短链接转换为直接可访问的长链接，支持手动输入、批量转换和导出表格
// @author       You
// @match        *://*/*
// @license      UNLICENSED
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/529570/%E5%B0%8F%E7%BA%A2%E4%B9%A6app%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E4%B8%BA%E7%9B%B4%E6%8E%A5%E5%8F%AF%E8%AE%BF%E9%97%AE%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/529570/%E5%B0%8F%E7%BA%A2%E4%B9%A6app%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E4%B8%BA%E7%9B%B4%E6%8E%A5%E5%8F%AF%E8%AE%BF%E9%97%AE%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 版本更新日志
    const VERSION = '0.4';
    const UPDATE_NOTES = `
    v0.4 更新内容:
    - 添加批量转换功能，支持一次性转换多个链接
    - 优化链接提取算法，支持从文本中提取多个链接
    - 添加批量结果表格展示和导出功能
    - 优化界面布局，添加选项卡切换

    v0.3 更新内容:
    - 修复了状态码200导致无法获取重定向链接的问题
    - 增强了链接提取能力，支持多种重定向方式
    - 添加了备用请求方法，提高成功率
    - 优化了错误处理和调试信息

    v0.2 更新内容:
    - 添加了手动输入功能
    - 添加了导出表格功能
    - 增加了历史记录存储
    `;

    console.log(`小红书链接转换器 v${VERSION} 已加载`);
    console.log(UPDATE_NOTES);

    // 存储转换历史记录
    let linkHistory = GM_getValue('xhs_link_history', []);

    // 保存历史记录
    const saveHistory = (shortUrl, longUrl) => {
        // 检查是否已存在相同的短链接
        const existingIndex = linkHistory.findIndex(item => item.shortUrl === shortUrl);

        if (existingIndex !== -1) {
            // 更新已存在的记录
            linkHistory[existingIndex].longUrl = longUrl;
            linkHistory[existingIndex].timestamp = new Date().toISOString();
        } else {
            // 添加新记录
            linkHistory.push({
                shortUrl: shortUrl,
                longUrl: longUrl,
                timestamp: new Date().toISOString()
            });
        }

        // 限制历史记录数量，最多保存100条
        if (linkHistory.length > 100) {
            linkHistory = linkHistory.slice(-100);
        }

        // 保存到GM存储
        GM_setValue('xhs_link_history', linkHistory);
    };

    // 导出CSV格式
    const exportToCSV = () => {
        if (linkHistory.length === 0) {
            GM_notification({
                text: '没有可导出的链接记录',
                title: '导出失败',
                timeout: 2000
            });
            return;
        }

        // 创建CSV内容
        let csvContent = '序号,原始链接,转换后链接,转换时间\n';

        linkHistory.forEach((item, index) => {
            const formattedDate = new Date(item.timestamp).toLocaleString();
            csvContent += `${index + 1},"${item.shortUrl}","${item.longUrl}","${formattedDate}"\n`;
        });

        // 创建Blob对象
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // 创建下载链接
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `小红书链接转换记录_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.display = 'none';
        document.body.appendChild(link);

        // 触发下载
        link.click();

        // 清理
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    };

    // 创建浮动窗口
    const createFloatingWindow = () => {
        const container = document.createElement('div');
        container.id = 'xhs-link-converter';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            background-color: white;
            border: 1px solid #f5a9ae;
            border-radius: 8px;
            padding: 10px;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
            display: none;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            border-bottom: 1px solid #f5a9ae;
            padding-bottom: 5px;
        `;

        const title = document.createElement('h3');
        title.textContent = '小红书链接转换器';
        title.style.cssText = `
            margin: 0;
            color: #ff2442;
            font-size: 16px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #ff2442;
            cursor: pointer;
            font-size: 16px;
        `;
        closeBtn.onclick = () => {
            container.style.display = 'none';
        };

        header.appendChild(title);
        header.appendChild(closeBtn);
        container.appendChild(header);

        // 添加选项卡
        const tabContainer = document.createElement('div');
        tabContainer.style.cssText = `
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 15px;
        `;

        const singleTab = document.createElement('div');
        singleTab.textContent = '单个转换';
        singleTab.id = 'xhs-single-tab';
        singleTab.style.cssText = `
            padding: 8px 15px;
            cursor: pointer;
            background-color: #ff2442;
            color: white;
            border-radius: 4px 4px 0 0;
            margin-right: 5px;
        `;

        const batchTab = document.createElement('div');
        batchTab.textContent = '批量转换';
        batchTab.id = 'xhs-batch-tab';
        batchTab.style.cssText = `
            padding: 8px 15px;
            cursor: pointer;
            background-color: #f8f8f8;
            border-radius: 4px 4px 0 0;
        `;

        tabContainer.appendChild(singleTab);
        tabContainer.appendChild(batchTab);
        container.appendChild(tabContainer);

        // 单个转换内容区域
        const singleContent = document.createElement('div');
        singleContent.id = 'xhs-single-content';
        singleContent.style.display = 'block';

        // 批量转换内容区域
        const batchContent = document.createElement('div');
        batchContent.id = 'xhs-batch-content';
        batchContent.style.display = 'none';

        // 选项卡切换事件
        singleTab.onclick = () => {
            singleTab.style.backgroundColor = '#ff2442';
            singleTab.style.color = 'white';
            batchTab.style.backgroundColor = '#f8f8f8';
            batchTab.style.color = 'black';
            singleContent.style.display = 'block';
            batchContent.style.display = 'none';
        };

        batchTab.onclick = () => {
            batchTab.style.backgroundColor = '#ff2442';
            batchTab.style.color = 'white';
            singleTab.style.backgroundColor = '#f8f8f8';
            singleTab.style.color = 'black';
            batchContent.style.display = 'block';
            singleContent.style.display = 'none';
        };

        // 单个转换内容
        // 添加输入框
        const inputSection = document.createElement('div');
        inputSection.style.cssText = `
            margin-bottom: 15px;
        `;

        const inputLabel = document.createElement('p');
        inputLabel.textContent = '输入包含小红书链接的文本:';
        inputLabel.style.cssText = `
            margin: 5px 0;
            font-size: 14px;
            font-weight: bold;
        `;
        inputSection.appendChild(inputLabel);

        const textArea = document.createElement('textarea');
        textArea.id = 'xhs-input-text';
        textArea.placeholder = '粘贴包含小红书链接的文本...';
        textArea.style.cssText = `
            width: 100%;
            height: 80px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            resize: vertical;
            box-sizing: border-box;
            margin-bottom: 10px;
        `;
        inputSection.appendChild(textArea);

        const convertBtn = document.createElement('button');
        convertBtn.textContent = '转换链接';
        convertBtn.style.cssText = `
            background-color: #ff2442;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 10px;
        `;
        convertBtn.onclick = () => {
            const inputText = document.getElementById('xhs-input-text').value;
            if (inputText && inputText.includes('xhslink.com')) {
                const shortUrl = extractUrl(inputText);
                if (shortUrl) {
                    // 更新原始链接展示
                    const originalLinkElement = document.getElementById('xhs-original-link');
                    originalLinkElement.textContent = shortUrl;

                    // 获取并显示重定向链接
                    getRedirectUrl(shortUrl, function(redirectUrl) {
                        const convertedLinkElement = document.getElementById('xhs-converted-link');
                        convertedLinkElement.textContent = redirectUrl;

                        // 保存到历史记录
                        saveHistory(shortUrl, redirectUrl);
                    });
                } else {
                    GM_notification({
                        text: '未在输入文本中找到小红书链接',
                        title: '提示',
                        timeout: 2000
                    });
                }
            } else {
                GM_notification({
                    text: '请输入包含小红书链接的文本',
                    title: '提示',
                    timeout: 2000
                });
            }
        };
        inputSection.appendChild(convertBtn);

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清空输入';
        clearBtn.style.cssText = `
            background-color: #888;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
        `;
        clearBtn.onclick = () => {
            document.getElementById('xhs-input-text').value = '';
        };
        inputSection.appendChild(clearBtn);

        singleContent.appendChild(inputSection);

        // 结果显示区域
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = `
            margin-bottom: 15px;
        `;

        const originalLinkLabel = document.createElement('p');
        originalLinkLabel.textContent = '原始链接:';
        originalLinkLabel.style.cssText = `
            margin: 5px 0;
            font-size: 14px;
            font-weight: bold;
        `;
        contentDiv.appendChild(originalLinkLabel);

        const originalLinkText = document.createElement('div');
        originalLinkText.id = 'xhs-original-link';
        originalLinkText.style.cssText = `
            padding: 5px;
            background-color: #f8f8f8;
            border-radius: 4px;
            word-break: break-all;
            font-size: 12px;
            max-height: 60px;
            overflow-y: auto;
            margin-bottom: 10px;
        `;
        contentDiv.appendChild(originalLinkText);

        const convertedLinkLabel = document.createElement('p');
        convertedLinkLabel.textContent = '转换后链接:';
        convertedLinkLabel.style.cssText = `
            margin: 5px 0;
            font-size: 14px;
            font-weight: bold;
        `;
        contentDiv.appendChild(convertedLinkLabel);

        const convertedLinkText = document.createElement('div');
        convertedLinkText.id = 'xhs-converted-link';
        convertedLinkText.style.cssText = `
            padding: 5px;
            background-color: #f8f8f8;
            border-radius: 4px;
            word-break: break-all;
            font-size: 12px;
            max-height: 60px;
            overflow-y: auto;
        `;
        contentDiv.appendChild(convertedLinkText);

        singleContent.appendChild(contentDiv);

        // 批量转换内容
        const batchInputSection = document.createElement('div');
        batchInputSection.style.cssText = `
            margin-bottom: 15px;
        `;

        const batchInputLabel = document.createElement('p');
        batchInputLabel.textContent = '批量输入小红书链接(每行一个):';
        batchInputLabel.style.cssText = `
            margin: 5px 0;
            font-size: 14px;
            font-weight: bold;
        `;
        batchInputSection.appendChild(batchInputLabel);

        const batchTextArea = document.createElement('textarea');
        batchTextArea.id = 'xhs-batch-input';
        batchTextArea.placeholder = '粘贴多个小红书链接，每行一个...\n例如:\nhttp://xhslink.com/abcde\nhttp://xhslink.com/fghij';
        batchTextArea.style.cssText = `
            width: 100%;
            height: 120px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            resize: vertical;
            box-sizing: border-box;
            margin-bottom: 10px;
        `;
        batchInputSection.appendChild(batchTextArea);

        const batchBtnContainer = document.createElement('div');
        batchBtnContainer.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        `;

        const batchConvertBtn = document.createElement('button');
        batchConvertBtn.textContent = '批量转换';
        batchConvertBtn.style.cssText = `
            background-color: #ff2442;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
        `;
        batchConvertBtn.onclick = () => {
            const batchInput = document.getElementById('xhs-batch-input').value;
            if (!batchInput) {
                GM_notification({
                    text: '请输入小红书链接',
                    title: '提示',
                    timeout: 2000
                });
                return;
            }

            // 清空结果表格
            const resultTable = document.getElementById('xhs-batch-results');
            resultTable.innerHTML = `
                <tr>
                    <th>序号</th>
                    <th>原始链接</th>
                    <th>转换后链接</th>
                    <th>状态</th>
                </tr>
            `;

            // 提取所有链接
            const links = [];

            // 处理每行文本
            const lines = batchInput.split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    // 尝试从每行提取所有链接
                    const lineLinks = extractMultipleUrls(line);
                    if (lineLinks.length > 0) {
                        links.push(...lineLinks);
                    } else {
                        // 如果没有找到链接，尝试单个提取
                        const singleLink = extractUrl(line);
                        if (singleLink) {
                            links.push(singleLink);
                        }
                    }
                }
            });

            // 去重
            const uniqueLinks = [...new Set(links)];

            if (uniqueLinks.length === 0) {
                GM_notification({
                    text: '未找到有效的小红书链接',
                    title: '提示',
                    timeout: 2000
                });
                return;
            }

            // 显示进度信息
            const progressInfo = document.getElementById('xhs-batch-progress');
            progressInfo.textContent = `正在转换 0/${uniqueLinks.length}`;
            progressInfo.style.display = 'block';

            // 批量处理链接
            let completedCount = 0;
            uniqueLinks.forEach((link, index) => {
                // 添加一行到表格
                const row = resultTable.insertRow(-1);
                const cellIndex = row.insertCell(0);
                const cellOriginal = row.insertCell(1);
                const cellConverted = row.insertCell(2);
                const cellStatus = row.insertCell(3);

                cellIndex.textContent = index + 1;
                cellOriginal.textContent = link;
                cellConverted.textContent = '转换中...';
                cellStatus.textContent = '处理中';
                cellStatus.style.color = '#ff9800';

                // 转换链接
                getRedirectUrl(link, function(redirectUrl) {
                    completedCount++;

                    // 更新进度
                    progressInfo.textContent = `正在转换 ${completedCount}/${uniqueLinks.length}`;

                    // 更新表格
                    cellConverted.textContent = redirectUrl;

                    if (redirectUrl.startsWith('无法') || redirectUrl.startsWith('请求失败')) {
                        cellStatus.textContent = '失败';
                        cellStatus.style.color = '#f44336';
                    } else {
                        cellStatus.textContent = '成功';
                        cellStatus.style.color = '#4caf50';

                        // 保存到历史记录
                        saveHistory(link, redirectUrl);
                    }

                    // 检查是否全部完成
                    if (completedCount === uniqueLinks.length) {
                        progressInfo.textContent = `转换完成，共 ${uniqueLinks.length} 个链接`;

                        // 显示导出按钮
                        document.getElementById('xhs-batch-export').style.display = 'block';
                    }
                });
            });
        };
        batchBtnContainer.appendChild(batchConvertBtn);

        const batchClearBtn = document.createElement('button');
        batchClearBtn.textContent = '清空输入';
        batchClearBtn.style.cssText = `
            background-color: #888;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
        `;
        batchClearBtn.onclick = () => {
            document.getElementById('xhs-batch-input').value = '';
        };
        batchBtnContainer.appendChild(batchClearBtn);

        batchInputSection.appendChild(batchBtnContainer);
        batchContent.appendChild(batchInputSection);

        // 批量转换进度
        const progressInfo = document.createElement('div');
        progressInfo.id = 'xhs-batch-progress';
        progressInfo.style.cssText = `
            margin: 10px 0;
            font-size: 14px;
            font-weight: bold;
            color: #ff2442;
            display: none;
        `;
        batchContent.appendChild(progressInfo);

        // 批量转换结果表格
        const resultTableContainer = document.createElement('div');
        resultTableContainer.style.cssText = `
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 15px;
        `;

        const resultTable = document.createElement('table');
        resultTable.id = 'xhs-batch-results';
        resultTable.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
        `;
        resultTable.innerHTML = `
            <tr>
                <th>序号</th>
                <th>原始链接</th>
                <th>转换后链接</th>
                <th>状态</th>
            </tr>
        `;

        // 设置表格样式
        const style = document.createElement('style');
        style.textContent = `
            #xhs-batch-results th, #xhs-batch-results td {
                border: 1px solid #ddd;
                padding: 6px;
                text-align: left;
            }
            #xhs-batch-results th {
                background-color: #f2f2f2;
                position: sticky;
                top: 0;
            }
            #xhs-batch-results tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            #xhs-batch-results tr:hover {
                background-color: #f5f5f5;
            }
        `;
        document.head.appendChild(style);

        resultTableContainer.appendChild(resultTable);
        batchContent.appendChild(resultTableContainer);

        // 批量导出按钮
        const batchExportBtn = document.createElement('button');
        batchExportBtn.id = 'xhs-batch-export';
        batchExportBtn.textContent = '导出批量结果';
        batchExportBtn.style.cssText = `
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
            display: none;
            margin-bottom: 10px;
        `;
        batchExportBtn.onclick = () => {
            exportBatchResults();
        };
        batchContent.appendChild(batchExportBtn);

        // 添加内容区域到容器
        container.appendChild(singleContent);
        container.appendChild(batchContent);

        // 按钮容器
        const btnContainer = document.createElement('div');
        btnContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            gap: 10px;
        `;

        // 左侧按钮组
        const leftBtnGroup = document.createElement('div');

        const exportBtn = document.createElement('button');
        exportBtn.textContent = '导出历史记录';
        exportBtn.style.cssText = `
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
        `;
        exportBtn.onclick = exportToCSV;
        leftBtnGroup.appendChild(exportBtn);

        btnContainer.appendChild(leftBtnGroup);

        // 右侧按钮组
        const rightBtnGroup = document.createElement('div');
        rightBtnGroup.style.cssText = `
            display: flex;
            gap: 10px;
        `;

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制链接';
        copyBtn.style.cssText = `
            background-color: #ff2442;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
        `;
        copyBtn.onclick = () => {
            const convertedLink = document.getElementById('xhs-converted-link').textContent;
            if (convertedLink) {
                GM_setClipboard(convertedLink);
                GM_notification({
                    text: '链接已复制到剪贴板',
                    title: '复制成功',
                    timeout: 2000
                });
            }
        };

        const openBtn = document.createElement('button');
        openBtn.textContent = '打开链接';
        openBtn.style.cssText = `
            background-color: #ff2442;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
        `;
        openBtn.onclick = () => {
            const convertedLink = document.getElementById('xhs-converted-link').textContent;
            if (convertedLink) {
                window.open(convertedLink, '_blank');
            }
        };

        rightBtnGroup.appendChild(copyBtn);
        rightBtnGroup.appendChild(openBtn);
        btnContainer.appendChild(rightBtnGroup);

        container.appendChild(btnContainer);

        document.body.appendChild(container);
        return container;
    };

    // 导出批量转换结果
    const exportBatchResults = () => {
        const table = document.getElementById('xhs-batch-results');
        if (!table || table.rows.length <= 1) {
            GM_notification({
                text: '没有可导出的批量转换结果',
                title: '导出失败',
                timeout: 2000
            });
            return;
        }

        // 创建CSV内容
        let csvContent = '序号,原始链接,转换后链接,状态\n';

        // 从第二行开始（跳过表头）
        for (let i = 1; i < table.rows.length; i++) {
            const row = table.rows[i];
            const index = row.cells[0].textContent;
            const original = row.cells[1].textContent;
            const converted = row.cells[2].textContent;
            const status = row.cells[3].textContent;

            csvContent += `${index},"${original}","${converted}","${status}"\n`;
        }

        // 创建Blob对象
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        // 创建下载链接
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `小红书批量链接转换结果_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.display = 'none';
        document.body.appendChild(link);

        // 触发下载
        link.click();

        // 清理
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);

        GM_notification({
            text: '批量转换结果已导出为CSV文件',
            title: '导出成功',
            timeout: 2000
        });
    };

    // 提取URL
    const extractUrl = (text) => {
        const pattern = /http:\/\/xhslink\.com\/\S+/;
        const match = pattern.exec(text);
        if (match) {
            // 去除链接末尾的中文逗号或其他标点符号
            let url = match[0];
            if (url.endsWith('，') || url.endsWith('。') || url.endsWith('!') || url.endsWith('！')) {
                url = url.slice(0, -1);
            }
            return url;
        }
        return null;
    };

    // 提取多个URL
    const extractMultipleUrls = (text) => {
        const pattern = /http:\/\/xhslink\.com\/\S+/g;
        const matches = text.match(pattern);

        if (!matches) return [];

        // 处理每个链接，去除末尾的标点符号
        return matches.map(url => {
            if (url.endsWith('，') || url.endsWith('。') || url.endsWith('!') || url.endsWith('！')) {
                return url.slice(0, -1);
            }
            return url;
        });
    };

    // 获取重定向链接
    const getRedirectUrl = (shortUrl, callback) => {
        // 第一次尝试 - 标准方法
        tryGetRedirectUrl(shortUrl, (result) => {
            // 如果结果包含错误信息，尝试备用方法
            if (result.startsWith('无法') || result.startsWith('请求失败')) {
                console.log('小红书链接转换器 - 第一次尝试失败，使用备用方法');
                tryAlternativeMethod(shortUrl, callback);
            } else {
                callback(result);
            }
        });
    };

    // 标准方法获取重定向链接
    const tryGetRedirectUrl = (shortUrl, callback) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: shortUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Connection": "keep-alive",
                "Referer": "https://www.xiaohongshu.com/"
            },
            followRedirect: false,
            onload: function(response) {
                if (response.status >= 300 && response.status < 400) {
                    // 标准重定向方式
                    const redirectUrl = response.finalUrl || response.responseHeaders.match(/Location:\s*(.*)/i)?.[1];
                    if (redirectUrl) {
                        callback(redirectUrl);
                    } else {
                        callback("无法解析重定向链接");
                    }
                } else if (response.status === 200) {
                    // 处理状态码200的情况
                    // 尝试从响应内容中提取重定向URL

                    // 方法1: 检查meta refresh标签
                    const metaRefreshMatch = response.responseText.match(/<meta[^>]*?url=(.*?)["'\s>]/i) ||
                                            response.responseText.match(/<meta[^>]*?http-equiv=["']?refresh["']?[^>]*?content=["']?\d+;\s*url=(.*?)["'\s>]/i);
                    if (metaRefreshMatch && metaRefreshMatch[1]) {
                        callback(metaRefreshMatch[1]);
                        return;
                    }

                    // 方法2: 检查JavaScript重定向
                    const jsRedirectPatterns = [
                        /window\.location\.(?:href|replace)\s*=\s*["'](https?:\/\/[^"']+)["']/i,
                        /location\.(?:href|replace)\s*=\s*["'](https?:\/\/[^"']+)["']/i,
                        /window\.location\s*=\s*["'](https?:\/\/[^"']+)["']/i,
                        /location\s*=\s*["'](https?:\/\/[^"']+)["']/i,
                        /top\.location\s*=\s*["'](https?:\/\/[^"']+)["']/i,
                        /parent\.location\s*=\s*["'](https?:\/\/[^"']+)["']/i
                    ];

                    for (const pattern of jsRedirectPatterns) {
                        const match = response.responseText.match(pattern);
                        if (match && match[1]) {
                            callback(match[1]);
                            return;
                        }
                    }

                    // 方法3: 尝试查找小红书域名链接
                    const xhsLinkPatterns = [
                        /https:\/\/www\.xiaohongshu\.com\/discovery\/item\/[a-zA-Z0-9]+/i,
                        /https:\/\/www\.xiaohongshu\.com\/explore\/[a-zA-Z0-9]+/i,
                        /https:\/\/www\.xiaohongshu\.com\/[^"'\s)]+/i
                    ];

                    for (const pattern of xhsLinkPatterns) {
                        const match = response.responseText.match(pattern);
                        if (match) {
                            callback(match[0]);
                            return;
                        }
                    }

                    // 方法4: 尝试查找data-url属性
                    const dataUrlMatch = response.responseText.match(/data-url=["'](https?:\/\/[^"']+)["']/i);
                    if (dataUrlMatch && dataUrlMatch[1]) {
                        callback(dataUrlMatch[1]);
                        return;
                    }

                    // 方法5: 尝试查找JSON中的URL
                    const jsonUrlMatch = response.responseText.match(/"url"\s*:\s*"(https?:\/\/[^"]+)"/i);
                    if (jsonUrlMatch && jsonUrlMatch[1]) {
                        callback(jsonUrlMatch[1]);
                        return;
                    }

                    // 如果以上方法都失败，尝试使用完整的响应URL
                    if (response.finalUrl && response.finalUrl !== shortUrl) {
                        callback(response.finalUrl);
                        return;
                    }

                    // 在控制台输出调试信息
                    console.log('小红书链接转换器 - 调试信息:', {
                        status: response.status,
                        url: shortUrl,
                        responseHeaders: response.responseHeaders,
                        // 仅显示响应前1000个字符，避免过长
                        responseTextPreview: response.responseText.substring(0, 1000)
                    });

                    callback("无法提取重定向链接，请尝试手动打开: " + shortUrl);
                } else {
                    callback("无法获取重定向链接，状态码: " + response.status);
                }
            },
            onerror: function(error) {
                callback("请求失败: " + error.message);
            }
        });
    };

    // 备用方法 - 使用不同的请求方式
    const tryAlternativeMethod = (shortUrl, callback) => {
        // 使用移动设备UA和允许重定向
        GM_xmlhttpRequest({
            method: 'GET',
            url: shortUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "zh-CN,zh-Hans;q=0.9",
                "Connection": "keep-alive",
                "Referer": "https://www.xiaohongshu.com/"
            },
            followRedirect: true, // 允许重定向
            onload: function(response) {
                // 检查最终URL是否是小红书域名
                if (response.finalUrl && response.finalUrl.includes('xiaohongshu.com')) {
                    callback(response.finalUrl);
                    return;
                }

                // 尝试从响应内容中提取URL
                const xhsLinkMatch = response.responseText.match(/https:\/\/www\.xiaohongshu\.com\/[^"'\s)]+/i);
                if (xhsLinkMatch) {
                    callback(xhsLinkMatch[0]);
                    return;
                }

                // 如果仍然失败，返回原始错误
                callback("无法获取重定向链接，请尝试手动打开: " + shortUrl);
            },
            onerror: function(error) {
                callback("备用方法请求失败: " + error.message);
            }
        });
    };

    // 添加剪贴板事件监听
    let floatingWindow = null;
    let lastProcessedText = '';

    document.addEventListener('paste', function(e) {
        const clipboardText = e.clipboardData.getData('text');

        // 检查文本是否包含小红书链接且未处理过相同文本
        if (clipboardText && clipboardText !== lastProcessedText && clipboardText.includes('xhslink.com')) {
            lastProcessedText = clipboardText;
            const shortUrl = extractUrl(clipboardText);

            if (shortUrl) {
                // 确保浮动窗口已创建
                if (!floatingWindow) {
                    floatingWindow = createFloatingWindow();
                }

                // 更新原始链接展示
                const originalLinkElement = document.getElementById('xhs-original-link');
                originalLinkElement.textContent = shortUrl;

                // 显示窗口
                floatingWindow.style.display = 'block';

                // 获取并显示重定向链接
                getRedirectUrl(shortUrl, function(redirectUrl) {
                    const convertedLinkElement = document.getElementById('xhs-converted-link');
                    convertedLinkElement.textContent = redirectUrl;

                    // 保存到历史记录
                    saveHistory(shortUrl, redirectUrl);
                });
            }
        }
    });

    // 添加剪贴板监听按钮
    const addClipboardButton = () => {
        const button = document.createElement('button');
        button.textContent = '小红书链接转换';
        button.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background-color: #ff2442;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        `;

        button.onclick = () => {
            // 确保浮动窗口已创建
            if (!floatingWindow) {
                floatingWindow = createFloatingWindow();
            }

            // 显示窗口
            floatingWindow.style.display = 'block';

            // 尝试自动读取剪贴板
            try {
                navigator.clipboard.readText().then(clipboardText => {
                    if (clipboardText && clipboardText.includes('xhslink.com')) {
                        document.getElementById('xhs-input-text').value = clipboardText;
                    }
                }).catch(() => {
                    // 忽略错误，用户可以手动粘贴
                });
            } catch (error) {
                // 忽略错误，用户可以手动粘贴
            }
        };

        document.body.appendChild(button);
    };

    // 页面加载完成后添加按钮
    window.addEventListener('load', function() {
        addClipboardButton();
    });
})();