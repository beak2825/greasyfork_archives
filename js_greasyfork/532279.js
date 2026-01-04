// ==UserScript==
// @name         Auto Save Job Details with Custom Count
// @namespace    http://tampermonkey.net/
// @version      2.1
// @license      MIT
// @description  自定义下载数量的求职者详情保存工具
// @match        *://*.zhipin.com/web/chat/recommend
// @match        *://*.zhipin.com/web/chat/recommend/*


// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/532279/Auto%20Save%20Job%20Details%20with%20Custom%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/532279/Auto%20Save%20Job%20Details%20with%20Custom%20Count.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const DEFAULT_COUNT = 20;
    const CHECK_INTERVAL = 1000;
    const SCROLL_DELAY = 500;
    const MAX_ATTEMPTS = 20;
    const SAVE_DELAY = 1000;
    const CLICK_INTERVAL = 1000;

    let isRunning = false;
    let attempts = 0;
    let targetCount = DEFAULT_COUNT;
    let saveStartIndex = 0;
    let saveEndIndex = DEFAULT_COUNT;
    let lastClickTime = 0;
    let isRefreshed = false;



    function saveTextAsFile(text, filename, rdocument) {
        const blob = new Blob([text], {type: 'text/plain'});
        const downloadLink = rdocument.createElement('a');
        downloadLink.download = filename;
        downloadLink.innerHTML = 'Download File';

        if (window.webkitURL != null) {
            downloadLink.href = window.webkitURL.createObjectURL(blob);
        } else {
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.onclick = function(event) {
                rdocument.body.removeChild(event.target);
            };
            downloadLink.style.display = 'none';
            rdocument.body.appendChild(downloadLink);
        }

        const event = new MouseEvent('click');
        downloadLink.dispatchEvent(event);
    }

    function waitForElement(selector, tdocument, options = {}) {
        const {
            timeout = 8000,
            checkInterval = 200,
            requiredSection = 'div.resume-section.geek-education-experience-wrap',
            minSections = 1,
            maxChecks = Math.ceil(timeout / checkInterval)
        } = options;

        return new Promise((resolve, reject) => {
            let checks = 0;
            const startTime = Date.now();

            const checkContent = () => {
                checks++;
                const element = tdocument.querySelector(selector);

                if (element) {
                    const sections = element.querySelectorAll(requiredSection);
                    const hasRequiredSections = sections.length >= minSections;
                    let sectionsValid = true;

                    if (hasRequiredSections) {
                        sections.forEach(section => {
                            const text = section.textContent || section.innerText;
                            if (!text || text.length < 10) {
                                sectionsValid = false;
                            }
                        });
                    }

                    if (hasRequiredSections && sectionsValid) {
                        resolve(element);
                    }
                }

                if (checks >= maxChecks) {
                    const elapsed = Date.now() - startTime;
                    const errMsg = element
                        ? `找到元素但未检测到完整教育经历 (${elapsed}ms)`
                        : `未找到元素"${selector}" (${elapsed}ms)`;
                    reject(new Error(errMsg));
                } else {
                    setTimeout(checkContent, checkInterval);
                }
            };

            checkContent();
        });
    }

    function generateUniqueID() {
        return Date.now() + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    }

    async function processSingleContainer(rdocument, container, tdocument, name) {
        try {
            const now = Date.now();
            const timeSinceLastClick = now - lastClickTime;
            if (timeSinceLastClick < CLICK_INTERVAL) {
                await new Promise(resolve => setTimeout(resolve, CLICK_INTERVAL - timeSinceLastClick));
            }

            container.children[0].children[1].children[0].click();
            lastClickTime = Date.now();

            await waitForElement('div.resume-detail-wrap', tdocument, {timeout: 8000});

            const detailText = tdocument.querySelector('div.resume-detail-wrap').textContent;
            const job = tdocument.querySelector('div.ui-dropmenu-label').textContent.trim();
            const id = generateUniqueID();
            const filename = `${job}-${name}-${id}.txt`;
            saveTextAsFile(detailText, filename, rdocument);

            const closeBtn = tdocument.querySelector('div.boss-popup__close');
            if (closeBtn) {
                closeBtn.click();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (err) {
            console.error('处理单个容器时出错:', err);
            throw err;
        }
    }

    function getCandidateCount(tdocument) {
        const containers = tdocument.querySelectorAll('div.candidate-card-wrap');
        return containers.length;
    }

    async function scrollToLoadMore(tdocument) {
        const scrollContainer = tdocument.querySelector('.candidate-list-container') ||
                              tdocument.querySelector('.frame-box-content') ||
                              tdocument.scrollingElement ||
                              tdocument.documentElement;

        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        const scrollEvent = new Event('scroll', { bubbles: true });
        scrollContainer.dispatchEvent(scrollEvent);
        await new Promise(resolve => setTimeout(resolve, SCROLL_DELAY));
    }

    async function loadMoreCandidates(rdocument, tdocument, targetCount) {
        let count = getCandidateCount(tdocument);
        attempts = 0;

        updateButton(`加载更多... (需要${targetCount}个)`, '#FF9800');

        while (count < targetCount && attempts < MAX_ATTEMPTS) {
            await scrollToLoadMore(tdocument);
            count = getCandidateCount(tdocument);
            attempts++;

            if (count >= targetCount) break;
            await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
        }

        if (count < targetCount) {
            throw new Error(`无法加载足够的候选人，当前只有${count}个`);
        }
    }

    async function saveCurrentBatch(rdocument, tdocument, targetCount) {
        const containers = tdocument.querySelectorAll('div.candidate-card-wrap');
        if (containers.length === 0) {
            throw new Error('未找到求职者！');
        }

        const endIndex = Math.min(targetCount, containers.length);

        for (let i = 0; i < endIndex; i++) {
            try {
                const container = containers[i];
                const nameElement = container.children[0].children[1].children[0].children[0];
                const name = nameElement?.textContent?.trim() || '未知姓名';

                await processSingleContainer(rdocument, container, tdocument, name);
                await new Promise(resolve => setTimeout(resolve, SAVE_DELAY));
            } catch (err) {
                console.error(`处理容器 ${i} 失败:`, err);
            }
        }

        alert(`已完成 ${endIndex} 个求职者的保存`);
        isRunning = false;
    }

    function updateButton(text, color) {
        const btn = document.getElementById('tm-auto-load-btn');
        if (btn) {
            btn.textContent = text;
            btn.style.backgroundColor = color;
            btn.disabled = isRunning;
        }
    }



    async function main() {
        if (isRunning) return;

        try {
            isRunning = true;
            updateButton(`处理中... (0-${targetCount-1})`, '#2196F3');

            const mainDocument = window.top.document;
            const rdocument = mainDocument;
            const frameBox = rdocument.querySelector('div.frame-box');

            if (!frameBox) {
                throw new Error('未找到frame-box元素');
            }

            const tdocument = frameBox.children[0].contentWindow.document;
            let count = getCandidateCount(tdocument);

            if (!count) {
                throw new Error('无求职者');
            }

            if (count < targetCount) {
                await loadMoreCandidates(rdocument, tdocument, targetCount);
                count = getCandidateCount(tdocument);
            }

            await saveCurrentBatch(rdocument, tdocument, targetCount);

            updateButton(`准备保存 (${targetCount}个)`, '#4CAF50');

        } catch (err) {
            console.error('出错:', err);
            alert('错误: ' + err.message);
            updateButton(`保存求职者`, '#4CAF50');
        }

        isRunning = false;
    }

    function createControlPanel() {
        const oldContainer = window.top.document.getElementById('tm-button-container');
        if (oldContainer) oldContainer.remove();

        const btnContainer = window.top.document.createElement('div');
        btnContainer.id = 'tm-button-container';
        btnContainer.style.position = 'fixed';
        btnContainer.style.bottom = '20px';
        btnContainer.style.right = '20px';
        btnContainer.style.zIndex = '99999';
        btnContainer.style.display = 'flex';
        btnContainer.style.flexDirection = 'column';
        btnContainer.style.gap = '10px';
        btnContainer.style.backgroundColor = 'rgba(255,255,255,0.9)';
        btnContainer.style.padding = '15px';
        btnContainer.style.borderRadius = '8px';
        btnContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

        // 创建输入框和标签
        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.alignItems = 'center';
        inputContainer.style.gap = '10px';
        inputContainer.style.marginBottom = '10px';

        const countLabel = document.createElement('label');
        countLabel.textContent = '下载数量:';
        countLabel.style.fontWeight = 'bold';

        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.id = 'tm-count-input';
        countInput.value = DEFAULT_COUNT;
        countInput.min = '1';
        countInput.max = '100';
        countInput.style.width = '60px';
        countInput.style.padding = '5px';
        countInput.style.border = '1px solid #ddd';
        countInput.style.borderRadius = '4px';

        inputContainer.appendChild(countLabel);
        inputContainer.appendChild(countInput);



        const btn = document.createElement('button');
        btn.id = 'tm-auto-load-btn';
        btn.textContent = `保存求职者`;
		btn.style.backgroundColor = '#FF9800';

        const style = document.createElement('style');
        style.textContent = `
            #tm-auto-load-btn {
                padding: 8px 16px !important;
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                font-family: Arial, sans-serif !important;
                font-size: 14px !important;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
                min-width: 180px !important;
            }
            #tm-auto-load-btn:disabled {
                opacity: 0.7 !important;
                cursor: not-allowed !important;
            }
        `;
        document.head.appendChild(style);

        btn.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastClickTime < CLICK_INTERVAL) {
                console.log(`点击过快，请等待 ${(CLICK_INTERVAL - (now - lastClickTime))/1000}秒`);
                return;
            }
            lastClickTime = now;

            // 从输入框获取用户设置的数量
            const inputValue = parseInt(countInput.value);
            if (isNaN(inputValue) || inputValue < 1) {
                alert('请输入有效的下载数量！');
                return;
            }

            targetCount = inputValue;
            main().catch(err => console.error('按钮点击出错:', err));
        });


        btnContainer.appendChild(inputContainer);

        btnContainer.appendChild(btn);
        window.top.document.documentElement.appendChild(btnContainer);
    }

    if (document.readyState === 'complete') {
        createControlPanel();
    } else {
        window.addEventListener('load', createControlPanel);
    }
})();