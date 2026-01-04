// ==UserScript==
// @name         Javdb爬取BT链接 - 演员页面版
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Extract all magnet links from javdb.com actor page
// @author       You
// @license      MIT
// @match        https://javdb.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      javdb.com
// @downloadURL https://update.greasyfork.org/scripts/498642/Javdb%E7%88%AC%E5%8F%96BT%E9%93%BE%E6%8E%A5%20-%20%E6%BC%94%E5%91%98%E9%A1%B5%E9%9D%A2%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/498642/Javdb%E7%88%AC%E5%8F%96BT%E9%93%BE%E6%8E%A5%20-%20%E6%BC%94%E5%91%98%E9%A1%B5%E9%9D%A2%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false;
    let allLinks = [];
    let ui;

    // 创建主界面
    function createMainUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '70px';
        container.style.right = '10px';
        container.style.width = '300px';
        container.style.backgroundColor = '#fff';
        container.style.border = '1px solid #ddd';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        container.style.zIndex = '9999';

        // 搜索区域
        const searchArea = document.createElement('div');
        searchArea.style.padding = '10px';
        searchArea.style.display = 'flex';
        searchArea.style.gap = '10px';
        searchArea.style.alignItems = 'center';

        const searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = '搜索';
        searchBox.style.flex = '1';
        searchBox.style.padding = '8px';
        searchBox.style.border = '1px solid #ddd';
        searchBox.style.borderRadius = '20px';

        const searchButton = document.createElement('button');
        searchButton.textContent = '搜索';
        searchButton.style.padding = '8px 15px';
        searchButton.style.backgroundColor = '#007bff';
        searchButton.style.color = '#fff';
        searchButton.style.border = 'none';
        searchButton.style.borderRadius = '4px';
        searchButton.style.cursor = 'pointer';

        searchArea.appendChild(searchBox);
        searchArea.appendChild(searchButton);

        // 选项区域
        const optionsArea = document.createElement('div');
        optionsArea.style.padding = '10px';
        optionsArea.style.display = 'flex';
        optionsArea.style.gap = '10px';
        optionsArea.style.alignItems = 'center';

        const allRadio = document.createElement('input');
        allRadio.type = 'radio';
        allRadio.name = 'pageType';
        allRadio.checked = true;
        const allLabel = document.createElement('label');
        allLabel.appendChild(allRadio);
        allLabel.appendChild(document.createTextNode('全部'));

        const customRadio = document.createElement('input');
        customRadio.type = 'radio';
        customRadio.name = 'pageType';
        const customLabel = document.createElement('label');
        customLabel.appendChild(customRadio);
        customLabel.appendChild(document.createTextNode('自定义'));

        const pageInput = document.createElement('input');
        pageInput.type = 'number';
        pageInput.min = '1';
        pageInput.style.width = '50px';
        pageInput.style.display = 'none';

        const grabButton = document.createElement('button');
        grabButton.textContent = '抓取';
        grabButton.style.backgroundColor = '#007bff';
        grabButton.style.color = '#fff';
        grabButton.style.border = 'none';
        grabButton.style.borderRadius = '4px';
        grabButton.style.padding = '5px 15px';
        grabButton.style.cursor = 'pointer';

        const stopButton = document.createElement('button');
        stopButton.textContent = '停止';
        stopButton.style.backgroundColor = '#dc3545';
        stopButton.style.color = '#fff';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '4px';
        stopButton.style.padding = '5px 15px';
        stopButton.style.cursor = 'pointer';
        stopButton.style.display = 'none';

        // 结果区域
        const resultArea = document.createElement('div');
        resultArea.style.padding = '10px';
        resultArea.style.borderTop = '1px solid #ddd';
        resultArea.style.display = 'none';

        const progressText = document.createElement('div');
        progressText.textContent = '显示抓取的数量和总数';

        const magnetList = document.createElement('div');
        magnetList.style.maxHeight = '300px';
        magnetList.style.overflowY = 'auto';
        magnetList.style.marginTop = '10px';

        // 按钮区域
        const buttonArea = document.createElement('div');
        buttonArea.style.display = 'flex';
        buttonArea.style.gap = '10px';
        buttonArea.style.padding = '10px';
        buttonArea.style.borderTop = '1px solid #ddd';

        const copyButton = document.createElement('button');
        copyButton.textContent = '一键复制';
        copyButton.style.flex = '1';
        copyButton.style.padding = '8px';
        copyButton.style.backgroundColor = '#28a745';
        copyButton.style.color = '#fff';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '4px';

        const downloadButton = document.createElement('button');
        downloadButton.textContent = '一键下载';
        downloadButton.style.flex = '1';
        downloadButton.style.padding = '8px';
        downloadButton.style.backgroundColor = '#28a745';
        downloadButton.style.color = '#fff';
        downloadButton.style.border = 'none';
        downloadButton.style.borderRadius = '4px';

        // 组装界面
        optionsArea.appendChild(allLabel);
        optionsArea.appendChild(customLabel);
        optionsArea.appendChild(pageInput);
        optionsArea.appendChild(grabButton);
        optionsArea.appendChild(stopButton);

        resultArea.appendChild(progressText);
        resultArea.appendChild(magnetList);

        buttonArea.appendChild(copyButton);
        buttonArea.appendChild(downloadButton);

        container.appendChild(searchArea);
        container.appendChild(optionsArea);
        container.appendChild(resultArea);
        container.appendChild(buttonArea);

        document.body.appendChild(container);

        return {
            container,
            searchBox,
            searchButton,
            pageInput,
            grabButton,
            stopButton,
            progressText,
            magnetList,
            copyButton,
            downloadButton,
            resultArea,
            allRadio,
            customRadio
        };
    }

    // 获取总页数的逻辑
    function getTotalPages() {
        // 使用正确的选择器获取分页链接
        const paginationLinks = document.querySelectorAll('.pagination .pagination-link');
        if (paginationLinks.length > 0) {
            const pages = Array.from(paginationLinks)
                .map(link => {
                    const num = parseInt(link.textContent.trim());
                    return isNaN(num) ? 0 : num;
                })
                .filter(num => num > 0);

            if (pages.length > 0) {
                return Math.max(...pages);
            }
        }

        // 如果都失败了，返回1
        return 1;
    }

    // 获取指定页面的函数
    async function fetchPage(pageNum) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('page', pageNum);

        const response = await fetch(currentUrl.toString());
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        return Array.from(doc.querySelectorAll('.movie-list .item a.box'));
    }

    // 获取磁力链接的函数
    async function fetchMagnetLinks(link, titleText) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: link,
                onload: async function(response) {
                    if (response.status === 200) {
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(response.responseText, 'text/html');

                        const magnetContent = doc.querySelector('#magnets-content');
                        if (!magnetContent) {
                            console.log(`未找到磁力链接区域: ${link}`);
                            resolve();
                            return;
                        }

                        const magnetLinks = magnetContent.querySelectorAll('a[href^="magnet:"]');
                        console.log(`找到 ${magnetLinks.length} 个磁力链接`);

                        if (magnetLinks.length > 0) {
                            let preferredLink = null;
                            let fallbackLink = null;

                            for (let magnetLink of magnetLinks) {
                                const magnetHref = magnetLink.href;
                                const parentElement = magnetLink.closest('div');
                                const tags = parentElement ? parentElement.querySelectorAll('.tag') : [];

                                let hasHdTag = false;
                                let hasSubtitleTag = false;

                                tags.forEach(tag => {
                                    const tagText = tag.textContent.trim();
                                    if (tagText.includes('高清')) hasHdTag = true;
                                    if (tagText.includes('字幕')) hasSubtitleTag = true;
                                });

                                if (hasHdTag && hasSubtitleTag) {
                                    preferredLink = magnetHref;
                                    break;
                                } else if (hasSubtitleTag && !preferredLink) {
                                    preferredLink = magnetHref;
                                } else if (!fallbackLink) {
                                    fallbackLink = magnetHref;
                                }
                            }

                            const finalLink = preferredLink || fallbackLink || magnetLinks[0].href;
                            if (finalLink) {
                                allLinks.push({title: titleText, link: finalLink});
                                const row = document.createElement('div');
                                row.style.padding = '5px';
                                row.style.borderBottom = '1px solid #eee';
                                row.innerHTML = `
                                    <div style="font-weight: bold;">${titleText}</div>
                                    <div style="word-break: break-all;">
                                        <a href="${finalLink}" style="color: #007bff; text-decoration: none;">
                                            ${finalLink}
                                        </a>
                                    </div>
                                `;
                                ui.magnetList.appendChild(row);
                            }
                        }
                        resolve();
                    } else {
                        reject(new Error('请求失败'));
                    }
                },
                onerror: reject
            });
        });
    }

    // 抓取功能
    async function startGrabbing() {
        if (isProcessing) return;
        isProcessing = true;
        allLinks = [];
        ui.magnetList.innerHTML = '';
        ui.resultArea.style.display = 'block';

        ui.grabButton.style.display = 'none';
        ui.stopButton.style.display = 'inline';

        try {
            let pagesToProcess = [];
            let totalPages;

            if (ui.customRadio.checked) {
                const pageNum = parseInt(ui.pageInput.value);
                if (isNaN(pageNum) || pageNum < 1) {
                    alert('请输入有效的页数！');
                    return;
                }
                pagesToProcess = [pageNum];
                totalPages = 1;
            } else {
                totalPages = getTotalPages();
                console.log(`检测到总页数: ${totalPages}`);
                pagesToProcess = Array.from({length: totalPages}, (_, i) => i + 1);
            }

            ui.progressText.textContent = `共发现 ${totalPages} 页内容`;
            console.log(`准备处理页面: ${pagesToProcess.join(', ')}`);

            for (const pageNum of pagesToProcess) {
                if (!isProcessing) break;

                ui.progressText.textContent = `正在获取第 ${pageNum}/${totalPages} 页的链接...`;
                console.log(`开始处理第 ${pageNum} 页`);

                const links = await fetchPage(pageNum);
                console.log(`第 ${pageNum} 页找到 ${links.length} 个链接`);

                for (let i = 0; i < links.length; i++) {
                    if (!isProcessing) break;

                    const link = links[i];
                    const titleElement = link.querySelector('.video-title');
                    const titleText = titleElement ? titleElement.textContent.trim() : '无标题';

                    ui.progressText.textContent = `正在处理第 ${pageNum}/${totalPages} 页: ${i + 1}/${links.length} | 已获取 ${allLinks.length} 个链接`;

                    try {
                        await fetchMagnetLinks(link.href, titleText);
                        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
                    } catch (error) {
                        console.error(`处理失败: ${link.href}`, error);
                    }
                }
            }

            ui.progressText.textContent = `完成！共获取 ${allLinks.length} 个链接`;
        } catch (error) {
            console.error('抓取过程出错:', error);
            ui.progressText.textContent = '抓取过程出错，请重试';
        } finally {
            isProcessing = false;
            ui.grabButton.style.display = 'inline';
            ui.stopButton.style.display = 'none';
        }
    }

    // 搜索功能
    async function performSearch() {
        const searchTerm = ui.searchBox.value.trim();
        if (!searchTerm) {
            alert('请输入演员名称！');
            return;
        }

        try {
            const searchUrl = `https://javdb.com/search?q=${encodeURIComponent(searchTerm)}&f=actor`;
            const response = await fetch(searchUrl);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            const firstActorLink = doc.querySelector('.actor-box a[href^="/actors/"]');
            if (firstActorLink) {
                const actorUrl = 'https://javdb.com' + firstActorLink.getAttribute('href');
                window.location.href = `${actorUrl}?t=d,c&sort_type=0`;
            } else {
                alert('未找到相关演员！');
            }
        } catch (error) {
            console.error('搜索失败:', error);
            alert('搜索失败，请重试！');
        }
    }

    // 初始化
    ui = createMainUI();

    // 绑定事件
    ui.searchButton.addEventListener('click', performSearch);
    ui.searchBox.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    ui.grabButton.addEventListener('click', startGrabbing);
    ui.stopButton.addEventListener('click', () => {
        isProcessing = false;
        ui.progressText.textContent = '已停止抓取';
        ui.grabButton.style.display = 'inline';
        ui.stopButton.style.display = 'none';
    });

    // 绑定复制按钮事件
    ui.copyButton.addEventListener('click', () => {
        const text = allLinks.map(item => `${item.title}\n${item.link}`).join('\n\n');
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请重试！');
        });
    });

    // 绑定下载按钮事件
    ui.downloadButton.addEventListener('click', () => {
        const text = allLinks.map(item => `${item.title}\n${item.link}`).join('\n\n');
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `javdb_links_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // ... 其他事件绑定代码 ...

})();