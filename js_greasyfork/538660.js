// ==UserScript==
// @name         不背单词生词本导出2.0
// @namespace    https://github.com/shiquda/shiquda_UserScript
// @version      0.6.0
// @description  支持随机/顺序排列，可选美式/英式/双语音标，支持TXT/Excel格式
// @author       shiquda
// @match        https://bbdc.cn/newword
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538660/%E4%B8%8D%E8%83%8C%E5%8D%95%E8%AF%8D%E7%94%9F%E8%AF%8D%E6%9C%AC%E5%AF%BC%E5%87%BA20.user.js
// @updateURL https://update.greasyfork.org/scripts/538660/%E4%B8%8D%E8%83%8C%E5%8D%95%E8%AF%8D%E7%94%9F%E8%AF%8D%E6%9C%AC%E5%AF%BC%E5%87%BA20.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let words = [];
    let isLoading = false;
    const SCROLL_DELAY = 1000;

    // 创建UI界面
    function createUI() {
        const container = document.querySelector('.crumb-wrap');
        if (!container) return;

        // 导出按钮
        const exportBtn = document.createElement('button');
        exportBtn.id = 'bbdc-export-btn';
        exportBtn.className = 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-200';
        exportBtn.innerText = '导出单词';
        exportBtn.addEventListener('click', startExport);
        container.appendChild(exportBtn);

        // 选项容器
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'mt-3 grid grid-cols-1 md:grid-cols-3 gap-3';
        container.appendChild(optionsContainer);

        // 排列方式
        const orderGroup = createOptionGroup('排列方式');
        optionsContainer.appendChild(orderGroup);

        const randomOrder = createCheckbox('random-order', '随机排列', false);
        const sequentialOrder = createCheckbox('sequential-order', '按页面顺序', true);
        orderGroup.appendChild(randomOrder);
        orderGroup.appendChild(sequentialOrder);

        // 音标选项
        const phoneticGroup = createOptionGroup('音标选项');
        optionsContainer.appendChild(phoneticGroup);

        const includeUk = createCheckbox('include-uk', '英式音标', true);
        const includeUs = createCheckbox('include-us', '美式音标', true);
        phoneticGroup.appendChild(includeUk);
        phoneticGroup.appendChild(includeUs);

        // 导出格式
        const formatGroup = createOptionGroup('导出格式');
        optionsContainer.appendChild(formatGroup);

        const exportTxt = createCheckbox('export-txt', 'TXT格式', true);
        const exportExcel = createCheckbox('export-excel', 'Excel格式', true);
        formatGroup.appendChild(exportTxt);
        formatGroup.appendChild(exportExcel);

        // 互斥选项逻辑
        randomOrder.addEventListener('change', () => {
            if (randomOrder.checked) sequentialOrder.checked = false;
        });
        sequentialOrder.addEventListener('change', () => {
            if (sequentialOrder.checked) randomOrder.checked = false;
        });
    }

    // 创建选项组容器
    function createOptionGroup(title) {
        const group = document.createElement('div');
        group.className = 'bg-white p-3 rounded shadow-sm';

        const titleEl = document.createElement('h4');
        titleEl.className = 'text-sm font-medium text-gray-700 mb-2';
        titleEl.innerText = title;
        group.appendChild(titleEl);

        return group;
    }

    // 创建复选框
    function createCheckbox(id, labelText, checked = false) {
        const label = document.createElement('label');
        label.className = 'flex items-center space-x-2 cursor-pointer mb-2';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = checked;
        checkbox.className = 'w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded';

        const text = document.createElement('span');
        text.className = 'text-sm text-gray-700';
        text.innerText = labelText;

        label.appendChild(checkbox);
        label.appendChild(text);

        return label;
    }

    // 自动滚动加载所有单词
    function autoScroll() {
        return new Promise(resolve => {
            let lastCount = 0;
            const maxAttempts = 20;
            let attempt = 0;

            function scrollToBottom() {
                window.scrollBy(0, window.innerHeight);

                const currentCount = document.querySelectorAll('.word-item').length;
                if (currentCount > lastCount) {
                    lastCount = currentCount;
                    attempt = 0;
                    setTimeout(scrollToBottom, SCROLL_DELAY);
                } else {
                    attempt++;
                    if (attempt >= maxAttempts) resolve();
                    else setTimeout(scrollToBottom, SCROLL_DELAY);
                }
            }
            scrollToBottom();
        });
    }

    // 提取单词和音标
    function extractWords() {
        return Array.from(document.querySelectorAll('.word-item')).map(item => {
            const wordEl = item.querySelector('.wordlist-word strong');
            const ukPronEl = item.querySelector('.is-uk');
            const usPronEl = item.querySelector('.is-us');

            return {
                word: wordEl.textContent.trim(),
                ukPron: ukPronEl ? ukPronEl.textContent.trim() : '',
                usPron: usPronEl ? usPronEl.textContent.trim() : ''
            };
        });
    }

    // 随机打乱数组
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // 生成音标文本
    function generatePhoneticText(wordItem) {
        const includeUk = document.getElementById('include-uk').checked;
        const includeUs = document.getElementById('include-us').checked;

        if (!includeUk && !includeUs) return '';

        let phoneticText = '';
        if (includeUk && wordItem.ukPron) {
            phoneticText += `英[${wordItem.ukPron}]`;
        }
        if (includeUs && wordItem.usPron) {
            if (phoneticText) phoneticText += ' ';
            phoneticText += `美[${wordItem.usPron}]`;
        }
        return phoneticText;
    }

    // 导出为TXT
    function exportToTXT(words) {
        const includeUk = document.getElementById('include-uk').checked;
        const includeUs = document.getElementById('include-us').checked;

        const content = words.map(item => {
            const phoneticText = generatePhoneticText(item);
            return phoneticText ? `${item.word}\t${phoneticText}` : item.word;
        }).join('\n');

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `不背单词生词本_${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    // 导出为Excel
    function exportToExcel(words) {
        const includeUk = document.getElementById('include-uk').checked;
        const includeUs = document.getElementById('include-us').checked;

        const wb = XLSX.utils.book_new();
        let headers = ['单词'];
        if (includeUk) headers.push('英式音标');
        if (includeUs) headers.push('美式音标');

        const wsData = [
            headers,
            ...words.map(item => {
                let row = [item.word];
                if (includeUk) row.push(item.ukPron);
                if (includeUs) row.push(item.usPron);
                return row;
            })
        ];

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, '生词本');
        XLSX.writeFile(wb, `不背单词生词本_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }

    // 主导出流程
    async function startExport() {
        if (isLoading) return;
        isLoading = true;

        try {
            const exportBtn = document.getElementById('bbdc-export-btn');
            exportBtn.disabled = true;
            exportBtn.innerText = '加载中...';

            // 滚动加载单词
            await autoScroll();

            // 提取单词
            words = extractWords();
            if (words.length === 0) {
                throw new Error('未提取到单词，请检查页面内容');
            }

            // 获取用户选项
            const randomOrder = document.getElementById('random-order').checked;
            const exportTxt = document.getElementById('export-txt').checked;
            const exportExcel = document.getElementById('export-excel').checked;

            // 处理排列方式
            const processedWords = randomOrder ? shuffleArray(words) : words;

            // 执行导出
            if (exportTxt) {
                exportToTXT(processedWords);
            }
            if (exportExcel) {
                exportToExcel(processedWords);
            }

            alert(`成功导出 ${words.length} 个单词`);
        } catch (error) {
            console.error('导出失败:', error);
            alert(`导出失败：${error.message}`);
        } finally {
            isLoading = false;
            const exportBtn = document.getElementById('bbdc-export-btn');
            exportBtn.disabled = false;
            exportBtn.innerText = '重新导出';
        }
    }

    // 初始化
    createUI();
})();