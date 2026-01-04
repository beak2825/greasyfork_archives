// ==UserScript==
// @name         论文信息提取器 paper info extractor 
// @namespace    http://tampermonkey.net/
// @version      1.0.2.1
// @description  自动提取 Nature、Cell、Science 等期刊论文的DOI、期刊信息(title, DOI, publisher, year) 
// @author       Efficient Lazy Panda
// @match        https://www.molbiolcell.org/*
// @match        https://journals.biologists.com/*
// @match        https://www.nature.com/*
// @match        https://nature.com/*
// @match        https://www.cell.com/*
// @match        https://cell.com/*
// @match        https://www.pnas.org/*
// @match        https://star-protocols.cell.com/*
// @match        https://www.cell-reports.com/*
// @match        https://cell-reports.com/*
// @match        https://www.cell-reports-medicine.com/*
// @match        https://cell-reports-medicine.com/*
// @match        https://www.cell-reports-physical-science.com/*
// @match        https://cell-reports-physical-science.com/*
// @match        https://www.cell-reports-methods.com/*
// @match        https://cell-reports-methods.com/*
// @match        https://www.cell-chemical-biology.com/*
// @match        https://cell-chemical-biology.com/*
// @match        https://www.cell-host-microbe.com/*
// @match        https://cell-host-microbe.com/*
// @match        https://www.cell-metabolism.com/*
// @match        https://cell-metabolism.com/*
// @match        https://www.cell-stem-cell.com/*
// @match        https://cell-stem-cell.com/*
// @match        https://www.developmental-cell.com/*
// @match        https://developmental-cell.com/*
// @match        https://www.molecular-cell.com/*
// @match        https://molecular-cell.com/*
// @match        https://www.immunity.com/*
// @match        https://immunity.com/*
// @match        https://www.cancer-cell.com/*
// @match        https://cancer-cell.com/*
// @match        https://www.neuron.com/*
// @match        https://neuron.com/*
// @match        https://www.structure.com/*
// @match        https://structure.com/*
// @match        https://www.current-biology.com/*
// @match        https://current-biology.com/*
// @match        https://www.science.org/*
// @match        https://science.org/*
// @match        https://www.sciencedirect.com/*
// @match        https://sciencedirect.com/*
// @match        https://doi.org/*
// @match        https://pubmed.ncbi.nlm.nih.gov/*
// @match        https://www.ncbi.nlm.nih.gov/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547413/%E8%AE%BA%E6%96%87%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%99%A8%20paper%20info%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/547413/%E8%AE%BA%E6%96%87%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96%E5%99%A8%20paper%20info%20extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    setTimeout(function() {
        createExtractorUI();
    }, 2000);

    function createExtractorUI() {
        // 避免重复创建
        if (document.getElementById('paper-extractor-btn')) {
            return;
        }

        // 创建浮动按钮
        const floatingButton = document.createElement('div');
        floatingButton.id = 'paper-extractor-btn';
        floatingButton.innerHTML = '📝';
        floatingButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #007acc;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 122, 204, 0.3);
            transition: all 0.3s ease;
        `;

        // 创建信息面板
        const infoPanel = document.createElement('div');
        infoPanel.id = 'paper-extractor-panel';
        infoPanel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 400px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        document.body.appendChild(floatingButton);
        document.body.appendChild(infoPanel);

        // 点击按钮切换面板显示
        floatingButton.addEventListener('click', function() {
            if (infoPanel.style.display === 'none') {
                extractAndDisplayInfo();
                infoPanel.style.display = 'block';
            } else {
                infoPanel.style.display = 'none';
            }
        });

        // 鼠标悬停效果
        floatingButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 6px 16px rgba(0, 122, 204, 0.4)';
        });

        floatingButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 12px rgba(0, 122, 204, 0.3)';
        });
    }

    function extractAndDisplayInfo() {
        const paperInfo = extractPaperInfo();
        displayInfo(paperInfo);
    }

    function extractPaperInfo() {
        const info = {
            title: '',
            doi: '',
            publication: '',
            url: window.location.href
        };

        // 提取标题
        info.title = extractTitle();

        // 提取DOI
        info.doi = extractDOI();

        // 提取期刊信息
        info.publication = extractPublication();

        return info;
    }

    function extractTitle() {
        // 方法1: 从meta标签获取标题
        const titleMeta = document.querySelector('meta[name="citation_title"]') ||
                         document.querySelector('meta[property="og:title"]') ||
                         document.querySelector('meta[name="dc.title"]');

        if (titleMeta) {
            let title = titleMeta.getAttribute('content');
            // 清理标题，移除期刊名称等后缀
            title = title.replace(/\s*[-|]\s*(Nature|Cell|Science|PNAS|The Lancet).*$/, '');
            return title.trim();
        }

        // 方法2: 从页面标题获取
        const pageTitle = document.title;
        if (pageTitle) {
            let title = pageTitle;
            // 清理标题，移除期刊名称等后缀
            title = title.replace(/\s*[-|]\s*(Nature|Cell|Science|PNAS|The Lancet).*$/, '');
            return title.trim();
        }

        // 方法3: 从页面中查找标题元素
        const titleSelectors = [
            'h1[class*="title"]',
            '.article-title',
            '.citation__title',
            'h1.main-title',
            'h1[data-cy="article-title"]',
            '.content-title'
        ];

        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.textContent.trim();
            }
        }

        return '标题未找到';
    }

    function extractDOI() {
        // 方法1: 从URL中提取DOI
        const urlPatterns = [
            /doi\.org\/(.+)$/,
            /\/([0-9]{2}\.[0-9]{4,}\/[^\/\s]+)$/,
            /doi[\/:]([0-9]{2}\.[0-9]{4,}\/[^\/\s]+)/i
        ];

        for (const pattern of urlPatterns) {
            const match = window.location.href.match(pattern);
            if (match) {
                return `https://doi.org/${match[1]}`;
            }
        }

        // 方法2: 从页面元素中查找DOI
        const doiSelectors = [
            '[data-doi]',
            '.doi a',
            '.article-identifiers a[href*="doi.org"]',
            'a[href*="doi.org"]',
            '.citation .doi',
            '[class*="doi"] a',
            '.article__doi a'
        ];

        for (const selector of doiSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                const href = element.getAttribute('href') || element.textContent;
                const doiMatch = href.match(/(?:doi\.org\/|doi:)([0-9]{2}\.[0-9]{4,}\/[^\/\s]+)/i);
                if (doiMatch) {
                    return `https://doi.org/${doiMatch[1]}`;
                }
            }
        }

        // 方法3: 从meta标签中提取
        const metaDoi = document.querySelector('meta[name="citation_doi"]') ||
                       document.querySelector('meta[name="dc.identifier"]') ||
                       document.querySelector('meta[property="citation_doi"]');
        if (metaDoi) {
            const content = metaDoi.getAttribute('content');
            const doiMatch = content.match(/(?:doi:|doi\.org\/)?([0-9]{2}\.[0-9]{4,}\/[^\/\s]+)/i);
            if (doiMatch) {
                return `https://doi.org/${doiMatch[1]}`;
            }
        }

        // 方法4: 从页面文本中查找
        const pageText = document.body.textContent;
        const textMatch = pageText.match(/DOI[:\s]*([0-9]{2}\.[0-9]{4,}\/[^\/\s]+)/i);
        if (textMatch) {
            return `https://doi.org/${textMatch[1]}`;
        }

        return '未找到DOI';
    }

    function extractPublication() {
        const hostname = window.location.hostname;
        const currentYear = new Date().getFullYear();

        // 从meta标签获取期刊名称
        const journalMeta = document.querySelector('meta[name="citation_journal_title"]') ||
                           document.querySelector('meta[name="dc.source"]') ||
                           document.querySelector('meta[property="citation_journal_title"]');

        let journalName = '';
        if (journalMeta) {
            journalName = journalMeta.getAttribute('content');
        }

        // 从页面内容推断期刊名称
        if (!journalName) {
            if (hostname.includes('nature.com')) {
                // 尝试从页面标题或者特定元素获取具体的Nature期刊名称
                const titleElement = document.querySelector('title');
                if (titleElement && titleElement.textContent.includes('Nature Communications')) {
                    journalName = 'Nature Communications';
                } else if (titleElement && titleElement.textContent.includes('Nature Methods')) {
                    journalName = 'Nature Methods';
                } else if (titleElement && titleElement.textContent.includes('Nature Biotechnology')) {
                    journalName = 'Nature Biotechnology';
                } else if (titleElement && titleElement.textContent.includes('Nature Cell Biology')) {
                    journalName = 'Nature Cell Biology';
                } else if (titleElement && titleElement.textContent.includes('Nature Neuroscience')) {
                    journalName = 'Nature Neuroscience';
                } else {
                    journalName = 'Nature';
                }
            } else if (hostname.includes('cell.com')) {
                journalName = 'Cell';
            } else if (hostname.includes('science.org')) {
                journalName = 'Science';
            } else if (hostname.includes('sciencedirect.com')) {
                journalName = '期刊名称需手动确认';
            }
        }

        // 尝试提取发表年份
        let year = '';
        const yearMeta = document.querySelector('meta[name="citation_publication_date"]') ||
                        document.querySelector('meta[name="citation_online_date"]') ||
                        document.querySelector('meta[name="dc.date"]');

        if (yearMeta) {
            const dateContent = yearMeta.getAttribute('content');
            const yearMatch = dateContent.match(/(\d{4})/);
            if (yearMatch) {
                year = yearMatch[1];
            }
        }

        // 如果没有找到年份，尝试从页面内容中提取
        if (!year) {
            const publishedElements = document.querySelectorAll('[class*="published"], [class*="date"], .article-header__publish-date');
            for (const element of publishedElements) {
                const text = element.textContent;
                const yearMatch = text.match(/(\d{4})/);
                if (yearMatch) {
                    year = yearMatch[1];
                    break;
                }
            }
        }

        if (!year) {
            year = currentYear.toString();
        }

        return journalName ? `${journalName} ${year}` : `期刊信息需手动确认 ${year}`;
    }

    function displayInfo(info) {
        const panel = document.getElementById('paper-extractor-panel');

        const template = `${info.title}
DOI：${info.doi}
Publication：${info.publication}
Keywords：`;

        panel.innerHTML = `
            <div style="padding: 20px;">
                <div style="margin-bottom: 15px;">
                    <textarea id="paper-template" style="width: 100%; height: 120px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; resize: vertical;" readonly>${template}</textarea>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button id="copy-info-btn" style="flex: 1; padding: 8px 12px; background: #007acc; color: white; border: none; border-radius: 4px; cursor: pointer;">Copy Paper Info</button>
                    <button id="close-panel-btn" style="flex: 1; padding: 8px 12px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
                </div>
            </div>
        `;

        // 添加事件监听器
        setTimeout(() => {
            const copyInfoBtn = document.getElementById('copy-info-btn');
            const closePanelBtn = document.getElementById('close-panel-btn');

            if (copyInfoBtn) {
                copyInfoBtn.addEventListener('click', () => {
                    copyToClipboard(template, '论文信息已复制');
                });
            }

            if (closePanelBtn) {
                closePanelBtn.addEventListener('click', () => {
                    panel.style.display = 'none';
                });
            }
        }, 100);
    }

    function copyToClipboard(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(message);
        }).catch(() => {
            // 备用复制方法
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast(message);
        });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 10002;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2000);
    }
})();
