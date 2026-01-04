// ==UserScript==
// @name         Semantic Scholar Enhanced Citation Button with BibTeX from Page
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Add a styled button to Semantic Scholar cited and citing papers that fetches BibTeX and copies to clipboard
// @author       Posty
// @match        https://www.semanticscholar.org/paper/*
// @grant        GM_xmlhttpRequest
// @connect      www.semanticscholar.org
// @license      GPL-3.0 License  
// @downloadURL https://update.greasyfork.org/scripts/529784/Semantic%20Scholar%20Enhanced%20Citation%20Button%20with%20BibTeX%20from%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/529784/Semantic%20Scholar%20Enhanced%20Citation%20Button%20with%20BibTeX%20from%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试日志函数（只保留error）
    const debug = {
        error: (...args) => console.error('[CitationButton]', ...args)
    };

    // 检查元素是否存在
    function checkElement(selector, context = document) {
        const element = context.querySelector(selector);
        if (!element) {
            debug.error(`Element not found with selector: ${selector}`);
        }
        return element;
    }

    // 获取 BibTeX 的函数，通过抓取网页
    function fetchBibTeX(fullUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: fullUrl,
                onload: function(response) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');
                        const bibtexElement = doc.querySelector('pre.bibtex-citation[data-nosnippet="true"]');
                        if (bibtexElement) {
                            const bibtex = bibtexElement.textContent.trim();
                            resolve(bibtex);
                        } else {
                            reject(new Error('BibTeX element not found in page'));
                        }
                    } catch (error) {
                        reject(new Error('Failed to parse page HTML: ' + error.message));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Page request failed: ' + error));
                }
            });
        });
    }

    function showCopySuccess() {
        const notification = document.createElement('div');
        notification.textContent = '复制成功';
        Object.assign(notification.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(173, 216, 230, 0.9)',
            padding: '10px 20px',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            fontSize: '16px',
            color: '#000',
            zIndex: '9999'
        });
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 1000);
    }
    // 创建自定义按钮
    function createCustomButton(paperId, fullUrl) {
        try {
            const button = document.createElement('button');
            button.textContent = 'Get BibTeX';
            button.dataset.paperId = paperId;
            Object.assign(button.style, {
                marginLeft: '10px',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#007bff', // 蓝色背景
                color: '#ffffff', // 白色文字
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                textTransform: 'uppercase',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s'
            });

            // 鼠标悬停效果
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#0056b3'; // 深蓝色
            });
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#007bff'; // 恢复原色
            });

            // 点击事件：获取 BibTeX 并复制到剪贴板
            button.addEventListener('click', () => {
                fetchBibTeX(fullUrl)
                    .then(bibtex => {
                    navigator.clipboard.writeText(bibtex)
                        .then(() => {
                        showCopySuccess();
                    })
                        .catch(err => {
                        debug.error('Failed to copy to clipboard:', err);
                    });
                })
                    .catch(error => {
                    debug.error('Error fetching BibTeX:', error);
                });
            });

            return button;
        } catch (error) {
            debug.error('Failed to create button:', error);
            return null;
        }
    }

    // 处理引文条目的通用函数
    function processCitationEntries(container, listSelector, entrySelector, sectionName) {
        try {
            const citationList = checkElement(listSelector, container);
            if (!citationList) {
                debug.error(`${sectionName} citation list container not found`);
                return;
            }

            const citationEntries = citationList.querySelectorAll(entrySelector);

            if (citationEntries.length === 0) {
                return;
            }

            citationEntries.forEach((entry, index) => {
                try {
                    const paperId = entry.dataset.paperId || 'unknown';
                    let fullUrl = '';

                    const linkElement = checkElement('a.link-button--show-visited', entry);
                    if (linkElement) {
                        const href = linkElement.getAttribute('href');
                        fullUrl = `https://www.semanticscholar.org${href}`;
                    } else {
                        debug.error(`Link element not found in ${sectionName} entry ${index + 1}`);
                        return;
                    }

                    const controlContainer = checkElement('div.cl-paper__bulleted-row.cl-paper-controls', entry);
                    let targetContainer;

                    if (controlContainer) {
                        targetContainer = controlContainer;
                    } else {
                        targetContainer = checkElement('.cl-paper__bulleted-row', entry);
                        if (!targetContainer) {
                            debug.error(`No suitable container found in ${sectionName} entry ${index + 1}`);
                            return;
                        }
                    }

                    if (targetContainer.querySelector('.custom-citation-button')) {
                        return;
                    }

                    const button = createCustomButton(paperId, fullUrl);
                    if (button) {
                        button.className = 'custom-citation-button';
                        targetContainer.appendChild(button);
                    }
                } catch (error) {
                    debug.error(`Error processing ${sectionName} entry ${index + 1}:`, error);
                }
            });
        } catch (error) {
            debug.error(`Failed to process ${sectionName} entries:`, error);
        }
    }

    // 主函数
    function initializeButtons() {
        try {
            // 处理 Cited Papers
            const citedContainer = checkElement('#cited-papers');
            if (citedContainer) {
                processCitationEntries(
                    citedContainer,
                    '#cited-papers > div.card-content > div > div.citation-list__citations',
                    '.cl-paper-row.citation-list__paper-row',
                    'Cited Papers'
                );
            }

            // 处理 Citing Papers
            const citingContainer = checkElement('#citing-papers');
            if (citingContainer) {
                processCitationEntries(
                    citingContainer,
                    '#citing-papers > div.card-content > div',
                    '.cl-paper-row.citation-list__paper-row',
                    'Citing Papers'
                );
            }
        } catch (error) {
            debug.error('Initialization failed:', error);
        }
    }

    // 页面加载完成后执行
    function waitForPageLoad() {
        if (document.readyState === 'complete') {
            initializeButtons();
        } else {
            window.addEventListener('load', () => {
                initializeButtons();
            });
        }
    }

    // 处理动态加载内容
    function observeChanges() {
        const observer = new MutationObserver(() => {
            initializeButtons();
        });

        const citedTarget = checkElement('#cited-papers');
        if (citedTarget) {
            observer.observe(citedTarget, { childList: true, subtree: true });
        }

        const citingTarget = checkElement('#citing-papers');
        if (citingTarget) {
            observer.observe(citingTarget, { childList: true, subtree: true });
        }
    }

    try {
        waitForPageLoad();
        observeChanges();
    } catch (error) {
        debug.error('Script startup failed:', error);
    }
})();