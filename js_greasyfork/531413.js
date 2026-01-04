// ==UserScript==
// @name         Auto Save Job Details
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  按下Ctrl+Q自动加载所有求职者并顺序保存详情
// @match        *://*/*
// @license      MIT
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/531413/Auto%20Save%20Job%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/531413/Auto%20Save%20Job%20Details.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 工具函数（保持原有实现）
    function saveTextAsFile(text, filename, rdocument) {
        // 创建Blob对象
        const blob = new Blob([text], {type: 'text/plain'});

        // 创建下载链接
        const downloadLink = rdocument.createElement('a');
        downloadLink.download = filename;
        downloadLink.innerHTML = 'Download File';

        // 兼容不同浏览器的URL创建方式
        if (window.webkitURL != null) {
            // Chrome等浏览器
            downloadLink.href = window.webkitURL.createObjectURL(blob);
        } else {
            // Firefox等浏览器
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.onclick = function(event) {
                rdocument.body.removeChild(event.target);
            };
            downloadLink.style.display = 'none';
            rdocument.body.appendChild(downloadLink);
        }

        // 触发点击事件
        const event = new MouseEvent('click');
        downloadLink.dispatchEvent(event);
    }

    /**
     * 等待元素出现的函数
     * @param {string} selector - 要等待的元素选择器
     * @param {number} timeout - 超时时间(毫秒)
     * @returns {Promise<Element>} 返回找到的元素
     */
    function waitForElement(selector, rdocument, options = {}) {
        const {
        timeout = 5000, // 默认5秒超时
        checkInterval = 100, // 检查间隔100ms
        requiredText, // 必须包含的文本
        minLength = 1, // 内容最小长度
        maxChecks = Math.ceil(timeout / checkInterval) // 最大检查次数
    } = options;

    return new Promise((resolve, reject) => {
        let checks = 0;
        const startTime = Date.now();

        const checkContent = () => {
            checks++;
            const element = rdocument.querySelector(selector);

            if (element) {
                const content = element.textContent || element.innerText;
                const hasContent = content.length >= minLength;
                const hasRequiredText = !requiredText || content.includes(requiredText);

                if (hasContent && hasRequiredText) {
                    resolve(element);
                    return;
                }
            }

            if (checks >= maxChecks) {
                reject(new Error(`等待元素"${selector}"内容加载超时 (${Date.now() - startTime}ms)`));
                return;
            }

            setTimeout(checkContent, checkInterval);
        };

        checkContent();
    });
    }

    function generateUniqueID() {
    // 13位时间戳 + 4位随机数
    return Date.now() + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

async function processSingleContainer(rdocument,container, tdocument,name) {
    // 1. 点击容器
    container.click();

    // 2. 等待详情加载
    try {
        const detailBox = await waitForElement('div.resume-detail-wrap', rdocument, {
        requiredText: '**', // 必须包含这个文本（名字屏蔽词)
        timeout: 8000
    });
    } catch (err) {
        throw new Error('等待详情超时');
    }
    let allText = '';
    // 3. 获取数据
    console.log(rdocument.querySelector('div.resume-detail-wrap'))
    const detailText = rdocument.querySelector('div.resume-detail-wrap').textContent;
    /* try {
            // 创建选区
            const range = rdocument.createRange();
            range.selectNode(rdocument.body);

            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            // 获取文本内容
            allText = selection.toString();

            // 清除选区
            selection.removeAllRanges();


        } catch (e) {
            console.error('保存文本失败:', e);
            return null;
        }*/
    const job = tdocument.querySelector('div.search-current-job').textContent;
    const id = generateUniqueID();
    // 4. 保存文件
    const filename = `${job}-${name}-${id}.txt`;
    console.log(detailText);
    saveTextAsFile(detailText, filename,rdocument);

    // 5. 关闭弹窗
    const closeBtn = rdocument.querySelector('div.boss-popup__close');
    if (closeBtn) {
        closeBtn.click();
        await new Promise(resolve => setTimeout(resolve, 500)); // 等待关闭动画
    }
}
async function loadAllItems(tdocument) {
    let attempts = 0;
    const maxAttempts = 20; // 防止无限循环

    while (attempts < maxAttempts) {
        const loadMoreButtons = tdocument.querySelectorAll('p.click-class');
        if (loadMoreButtons.length === 0) break;

        loadMoreButtons[0].click(); // 点击第一个"加载更多"
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
        attempts++;
    }

    if (attempts >= maxAttempts) {
        console.warn('达到最大尝试次数，可能仍有未加载的内容');
    }
}
    async function processAllContainers(rdocument,tdocument) {
        const containers = tdocument.querySelectorAll('div.card-container');
        if (containers.length === 0) {
            alert('未找到求职者！');
            return;
        }

        // 顺序处理每个容器
        for (const container of containers) {
            try {
                const name = container.children[0].children[1].children[0].children[0].children[0].textContent
                await processSingleContainer(rdocument,container, tdocument,name);
            } catch (err) {
                console.error(`处理容器失败:`, err);
                // 即使失败也继续下一个
            }
        }

        alert(`已完成 ${containers.length} 个求职者的保存！`);
    }
    // 新增核心逻辑
    async function main() {
        const mainDocument = window.top.document;
        console.log(`当前页面${mainDocument.baseURI}`);
        const rdocument = mainDocument;
        const tdocument = rdocument.querySelector('div.frame-box').children[0].contentWindow.document;

        await loadAllItems(tdocument);

        // 2. 确认并处理
        const containers = tdocument.querySelectorAll('div.card-container');
        if (!containers.length) return alert('无求职者');

        if (confirm(`找到 ${containers.length} 个求职者，开始保存？`)) {
        await processAllContainers(rdocument,tdocument, containers);

    }
    }

    document.addEventListener('keydown', async (e) => {
        if (e.ctrlKey && e.key === 'q') {
            e.preventDefault();

            main().catch(err => console.error('主流程错误:', err));
        }
    });
    })();