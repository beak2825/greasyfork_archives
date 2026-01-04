// ==UserScript==
// @name         Ximalaya Opus Data Collector
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  自动采集喜马拉雅“个人中心”专辑“播放”和“订阅”数据。
// @author       You
// @match        https://studio.ximalaya.com/opus
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529456/Ximalaya%20Opus%20Data%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/529456/Ximalaya%20Opus%20Data%20Collector.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let isCollecting = false;
    let allData = [];
    let timeoutId = null;

    // 创建按钮和输入框
    function createControls() {
        // 停止采集按钮
        const stopButton = createButton('停止采集', '210px', '#dc3545', () => {
            if (isCollecting) {
                isCollecting = false;
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                stopButton.disabled = true;
                stopButton.textContent = '已停止';
                saveAndDownloadCurrentData();
                alert('采集已停止，当前数据已保存为文件！');
                returnToFirstPage();
                setTimeout(() => {
                    stopButton.disabled = false;
                    stopButton.textContent = '停止采集';
                    allData = [];
                }, 2000);
            } else {
                alert('当前未在采集数据！');
            }
        });
        document.body.appendChild(stopButton);

        // 指定页码范围采集区域
        const rangeContainer = document.createElement('div');
        rangeContainer.style.position = 'fixed';
        rangeContainer.style.top = '260px';  // 原230px + 30px
        rangeContainer.style.right = '0px';
        rangeContainer.style.zIndex = '9999';

        const startLabel = document.createElement('label');
        startLabel.textContent = '起始页: ';
        startLabel.style.marginRight = '5px';
        startLabel.style.backgroundColor = '#666';
        startLabel.style.color = 'white';
        startLabel.style.padding = '2px 5px';
        const startInput = document.createElement('input');
        startInput.type = 'number';
        startInput.value = '1';
        startInput.min = '1';
        startInput.id = 'startPage';
        startInput.style.width = '60px';
        startInput.style.marginRight = '10px';
        startInput.style.backgroundColor = '#666';
        startInput.style.color = 'white';

        const endLabel = document.createElement('label');
        endLabel.textContent = '结束页: ';
        endLabel.style.marginRight = '5px';
        endLabel.style.backgroundColor = '#666';
        endLabel.style.color = 'white';
        endLabel.style.padding = '2px 5px';
        const endInput = document.createElement('input');
        endInput.type = 'number';
        endInput.value = '57';
        endInput.min = '1';
        endInput.max = '100';
        endInput.id = 'endPage';
        endInput.style.width = '60px';
        endInput.style.marginRight = '0px';
        endInput.style.backgroundColor = '#666';
        endInput.style.color = 'white';

        const rangeButton = createButton('开始采集', '150px', '#17a2b8', () => {
            // [保持原有逻辑不变]
            const startInputEl = document.getElementById('startPage');
            const endInputEl = document.getElementById('endPage');
            if (!startInputEl || !endInputEl) {
                alert('输入框未找到，请刷新页面重试！');
                return;
            }
            const start = parseInt(startInputEl.value, 10);
            const end = parseInt(endInputEl.value, 10);
            if (isNaN(start) || isNaN(end) || start < 1 || end > 100 || start > end) {
                alert('输入的页码无效！请确保起始页大于等于 1，结束页小于等于 100，且起始页小于等于结束页。');
                return;
            }
            if (!isCollecting) {
                isCollecting = true;
                allData = [];
                rangeButton.textContent = '正在采集';
                rangeButton.disabled = true;
                stopButton.disabled = false;
                collectRangePages(start, end).then(() => {
                    isCollecting = false;
                    rangeButton.textContent = '开始采集';
                    rangeButton.disabled = false;
                    stopButton.disabled = false;
                    checkAndTriggerNextCollection();
                }).catch(err => {
                    isCollecting = false;
                    rangeButton.textContent = '开始采集';
                    rangeButton.disabled = false;
                    console.error(err);
                    alert('采集失败: ' + err.message);
                    stopButton.disabled = false;
                });
            } else {
                alert('正在采集中，请先停止当前任务！');
            }
        });
        rangeContainer.appendChild(startLabel);
        rangeContainer.appendChild(startInput);
        rangeContainer.appendChild(endLabel);
        rangeContainer.appendChild(endInput);
        rangeContainer.appendChild(rangeButton);
        document.body.appendChild(rangeContainer);

        // 循环控制和时间间隔区域
        const loopContainer = document.createElement('div');
        loopContainer.style.position = 'fixed';
        loopContainer.style.top = '300px';  // 原280px + 30px
        loopContainer.style.right = '0px';
        loopContainer.style.zIndex = '9999';

        const loopCheckbox = document.createElement('input');
        loopCheckbox.type = 'checkbox';
        loopCheckbox.id = 'loopEnabled';
        loopCheckbox.checked = false;
        const loopLabel = document.createElement('label');
        loopLabel.textContent = ' 启用循环采集';
        loopLabel.style.marginRight = '10px';
        loopLabel.style.backgroundColor = '#666';
        loopLabel.style.color = 'white';
        loopLabel.style.padding = '2px 5px';
        loopLabel.htmlFor = 'loopEnabled';

        const intervalLabel = document.createElement('label');
        intervalLabel.textContent = '循环间隔 (分钟): ';
        intervalLabel.style.marginRight = '5px';
        intervalLabel.style.backgroundColor = '#666';
        intervalLabel.style.color = 'white';
        intervalLabel.style.padding = '2px 5px';
        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.value = '30';
        intervalInput.min = '1';
        intervalInput.id = 'intervalMinutes';
        intervalInput.style.width = '60px';
        intervalInput.style.backgroundColor = '#666';
        intervalInput.style.color = 'white';
        loopContainer.appendChild(loopCheckbox);
        loopContainer.appendChild(loopLabel);
        loopContainer.appendChild(intervalLabel);
        loopContainer.appendChild(intervalInput);
        document.body.appendChild(loopContainer);
    }

    // 创建按钮的辅助函数
    function createButton(text, top, color, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.top = top;
        button.style.right = '0px';
        button.style.zIndex = '9999';
        button.style.padding = '8px 16px';
        button.style.backgroundColor = color;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', onClick);
        return button;
    }


    // 等待 iframe 加载（3秒超时）
    function waitForIframe(timeout = 3000) {
        return new Promise((resolve, reject) => {
            const iframe = document.getElementById('contentWrapper');
            if (!iframe) {
                reject(new Error('未找到 iframe 元素'));
                return;
            }

            const checkIframe = () => {
                if (iframe.contentDocument && iframe.contentDocument.body) {
                    clearInterval(interval);
                    clearTimeout(timeoutId);
                    resolve(iframe.contentDocument);
                }
            };

            const interval = setInterval(checkIframe, 100);
            const timeoutId = setTimeout(() => {
                clearInterval(interval);
                reject(new Error('等待 iframe 加载超时（3秒）'));
            }, timeout);
        });
    }

    // 采集指定页码范围的数据
    async function collectRangePages(startPage, endPage) {
        console.log(`开始采集从第 ${startPage} 页到第 ${endPage} 页的数据...`);
        allData = []; // 清空之前的数据
        let currentPage = startPage;

        try {
            // 刷新 iframe，确保内容重置但脚本状态不变
            await refreshIframe();
            const iframeDoc = await waitForIframe(3000); // 3 秒等待，确保加载
            let hasNextPage = true;

            while (hasNextPage && currentPage <= endPage && isCollecting) {
                console.log(`正在采集第 ${currentPage} 页...`);
                try {
                    const pageData = await collectPageData(iframeDoc, currentPage);
                    allData = allData.concat(pageData.filter(item => item.plays !== '0')); // 过滤播放数为 0 的数据

                    // 等待 3 秒，确保数据加载完成
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    if (currentPage === endPage) {
                        hasNextPage = false;
                        saveToCsv(allData, 'all');
                        returnToFirstPage();
                    } else {
                        // 检查是否有下一页
                        const nextButton = iframeDoc.querySelector('.ant-pagination-next:not(.ant-pagination-disabled)');
                        const paginationItems = iframeDoc.querySelectorAll('.ant-pagination-item');
                        const lastPageItem = Array.from(paginationItems).pop();
                        const isLastPage = !nextButton || nextButton.getAttribute('aria-disabled') === 'true' ||
                                         (lastPageItem && lastPageItem.textContent.trim() === currentPage.toString());

                        if (isLastPage) {
                            hasNextPage = false;
                            saveToCsv(allData, 'all');
                            returnToFirstPage();
                        } else {
                            // 模拟点击下一页按钮
                            nextButton.click();
                            currentPage++;

                            // 等待 3 秒，确保页面翻转并加载完成
                            await new Promise(resolve => setTimeout(resolve, 3000));
                        }
                    }
                } catch (err) {
                    console.warn(`第 ${currentPage} 页采集失败: ${err.message}，继续下一页`);
                    currentPage++;
                    continue;
                }

                if (!isCollecting) break; // 检查是否需要停止
            }

            if (allData.length === 0) {
                throw new Error('未采集到任何数据，请确保页面已加载专辑列表！');
            }
        } catch (err) {
            throw err;
        }
    }

    // 采集单页数据
    async function collectPageData(iframeDoc, pageNumber) {
        console.log(`采集第 ${pageNumber} 页数据...`);
        const albumItems = iframeDoc.querySelectorAll('[class*="AlbumItem_listItem"]');
        console.log(`找到 ${albumItems.length} 个专辑项`);

        if (albumItems.length === 0) {
            throw new Error(`第 ${pageNumber} 页未找到专辑数据！`);
        }

        const pageData = [];
        const currentTime = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\//g, '-').replace(' ', '-'); // 格式化为 "YYYY-MM-DD-HH:MM"

        albumItems.forEach((item, index) => {
            let title = '未知专辑';
            let episodes = '0';
            let plays = '0';
            let subscribes = '0';

            // 提取标题，增加容错
            const titleEl = item.querySelector('.AlbumItem_title__1q92X, [class*="title"]');
            if (titleEl) {
                title = titleEl.textContent.trim().replace('公开', '') || '未知专辑';
            }

            // 提取集数，增加容错
            const episodeEl = item.querySelector('.AlbumItem_number__2lJS9 span, [class*="number"] span');
            if (episodeEl) {
                episodes = episodeEl.textContent.replace(/[^\d]/g, '').trim() || '0';
            }

            // 提取播放和订阅，增加容错并处理“万”、“亿”格式
            const dataEls = item.querySelectorAll('.AlbumItem_data__upkkX span, [class*="data"] span');
            dataEls.forEach(data => {
                const text = data.textContent.trim();
                if (text.includes('播放')) {
                    plays = convertNumericFormat(text) || '0';
                } else if (text.includes('订阅')) {
                    subscribes = convertNumericFormat(text) || '0';
                }
            });

            pageData.push({ title, episodes, plays, subscribes, time: currentTime });
            console.log(`采集第 ${pageNumber} 页的第 ${index + 1} 个专辑: ${title}, 集数: ${episodes}, 播放: ${plays}, 订阅: ${subscribes}, 时间: ${currentTime}`);
        });

        return pageData;
    }

    // 转换数值格式（如“2.64万”转换为 26400）
    function convertNumericFormat(text) {
        if (!text) return '0';
        const match = text.match(/([\d.]+)(万|亿)?/);
        if (!match) return '0';
        const value = parseFloat(match[1]);
        const unit = match[2];
        if (unit === '亿') {
            return Math.round(value * 100000000).toString(); // 亿 -> 整数
        } else if (unit === '万') {
            return Math.round(value * 10000).toString(); // 万 -> 整数
        } else {
            return Math.round(value).toString(); // 纯数字
        }
    }

    // 保存并下载当前数据
    function saveAndDownloadCurrentData() {
        if (allData.length === 0) return;

        let csvContent = '\ufeff' + '专辑名,集数,播放,订阅,时间\n'; // 确保 UTF-8 BOM 避免中文乱码
        allData.forEach(item => {
            csvContent += `"${item.title}",${item.episodes},${item.plays},${item.subscribes},"${item.time}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const timestamp = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\//g, '-').replace(' ', '-'); // 格式化为 "YYYY-MM-DD-HH:MM"
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', `中心数据${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 保存数据到 CSV 文件
    function saveToCsv(data, pageNumber) {
        let csvContent = '\ufeff' + '专辑名,集数,播放,订阅,时间\n'; // 确保 UTF-8 BOM 避免中文乱码
        data.forEach(item => {
            csvContent += `"${item.title}",${item.episodes},${item.plays},${item.subscribes},"${item.time}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const timestamp = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/\//g, '-').replace(' ', '-'); // 格式化为 "YYYY-MM-DD-HH:MM"
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', `中心数据${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 返回到第 1 页
    function returnToFirstPage() {
        const iframe = document.getElementById('contentWrapper');
        if (iframe && iframe.contentDocument) {
            const firstPageButton = iframe.contentDocument.querySelector('.ant-pagination-item-1:not(.ant-pagination-item-active)');
            if (firstPageButton) {
                firstPageButton.click();
                console.log('已返回到第 1 页');
            }
        }
    }

    // 刷新 iframe
    function refreshIframe() {
        return new Promise((resolve) => {
            const iframe = document.getElementById('contentWrapper');
            if (iframe) {
                iframe.contentWindow.location.reload(); // 仅刷新 iframe
                setTimeout(() => {
                    waitForIframe(3000).then(iframeDoc => {
                        resolve(iframeDoc);
                    }).catch(err => {
                        console.error('刷新 iframe 后等待超时:', err);
                        resolve(null); // 即使超时也继续
                    });
                }, 1000); // 等待 1 秒后检查，总计 3 秒
            } else {
                resolve(waitForIframe(3000)); // 如果 iframe 还未加载，直接等待
            }
        });
    }

    // 检查是否启用循环并触发下一次采集
    function checkAndTriggerNextCollection() {
        const loopCheckbox = document.getElementById('loopEnabled');
        if (loopCheckbox && loopCheckbox.checked) {
            const intervalInput = document.getElementById('intervalMinutes');
            if (!intervalInput) {
                console.error('循环间隔输入框未找到');
                return;
            }
            const intervalMinutes = parseInt(intervalInput.value, 10) || 30; // 默认30分钟
            timeoutId = setTimeout(() => {
                refreshPageAndTriggerCollection();
            }, intervalMinutes * 60 * 1000); // 转换为毫秒
        }
    }

    // 刷新 iframe 并触发下一次采集，增加 5 秒间隔
    function refreshPageAndTriggerCollection() {
        return new Promise((resolve) => {
            const iframe = document.getElementById('contentWrapper');
            if (iframe) {
                iframe.contentWindow.location.reload(); // 仅刷新 iframe
                setTimeout(() => {
                    // 增加 5 秒间隔后模拟按下“开始采集”按钮
                    setTimeout(() => {
                        const rangeButton = document.querySelector('button[style*="top: 0px"][style*="right: 0px"]');
                        if (rangeButton) {
                            rangeButton.click(); // 模拟按下“开始采集”按钮
                            console.log('已模拟按下“开始采集”按钮');
                        } else {
                            console.error('未找到“开始采集”按钮');
                        }
                        resolve();
                    }, 5000); // 5 秒间隔
                }, 3000); // 等待 3 秒确保 iframe 加载
            } else {
                console.error('未找到 iframe 元素');
                resolve();
            }
        });
    }

    // 页面加载完成后添加按钮和输入框
    window.addEventListener('load', () => {
        createControls();
    });
})();
