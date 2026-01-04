// ==UserScript==
// @name         IAI OJ Downloader
// @namespace    iai-sh-cn
// @version      0.2
// @description  Download OJ problems as markdown files
// @license      AGPL-3.0-or-later
// @author       Y.V
// @match        https://iai.sh.cn/*
// @icon         https://iai.sh.cn/images/logo.png
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/470798/IAI%20OJ%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/470798/IAI%20OJ%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------------------------- 常量定义 ----------------------------
    const BUTTON_ID = 'download-button';
    const BUTTON_TEXT_DEFAULT = '下载题目';
    const BUTTON_TEXT_LOADING = '加载中...';
    const BUTTON_STYLE = {
        'position': 'fixed',
        'top': '10px',
        'right': '10px',
        'width': '100px',
        'height': '40px',
        'border': 'none',
        'border-radius': '5px',
        'background': '#00a0e9',
        'color': '#fff',
        'fontSize': '16px',
        'fontWeight': 'bold',
        'cursor': 'pointer'
    };
    const API_ENDPOINT = 'https://api.iai.sh.cn/contest/listProblem';

    // ---------------------------- 函数定义 ----------------------------

    /**
     * 创建下载按钮并添加到页面。
     * @returns {JQuery<HTMLElement>} 下载按钮的 jQuery 对象。
     */
    function createDownloadButton() {
        const button = $(`<button id="${BUTTON_ID}">${BUTTON_TEXT_DEFAULT}</button>`);
        button.css(BUTTON_STYLE);
        $('body').append(button);
        return button;
    }

    /**
     * 从当前 URL 中提取比赛 ID。
     * @returns {string|null} 比赛 ID，如果提取失败则返回 null。
     */
    function getContestIdFromUrl() {
        const urlParts = window.location.href.split('/');
        return urlParts[4] || null;
    }

    /**
     * 从 API 获取题目数据。
     * @param {string} contestId 比赛 ID。
     * @returns {Promise<Array>} 包含题目数据的 Promise。
     * @throws {Error} 如果 API 请求失败。
     */
    async function fetchProblemData(contestId) {
        const apiUrl = `${API_ENDPOINT}?contestId=${contestId}`;
        const response = await axios.get(apiUrl);
        return response.data;
    }

    /**
     * 按等级对题目数据进行分组。
     * @param {Array} problems 题目数据数组。
     * @returns {Object} 按等级分组的题目对象。
     */
    function groupProblemsByLevel(problems) {
        return problems.reduce((groups, problem) => {
            const level = problem.level || '未分类';
            groups[level] = groups[level] || '未分级';
            groups[level].push(problem);
            return groups;
        }, {});
    }

    /**
     * 生成单个题目的 Markdown 内容。
     * @param {Object} problem 题目对象。
     * @param {number} index 题目在当前分组中的索引。
     * @returns {string} 题目的 Markdown 内容。
     */
    function generateProblemMarkdown(problem, index) {
        let md = `### 题目 ${index + 1}\n\n`;
        md += `${problem.title}\n\n`;
        md += `#### 题目描述\n\n${problem.description}\n\n`;
        md += `#### 输入格式\n\n${problem.inputFormat}\n\n`;
        md += `#### 输出格式\n\n${problem.outputFormat}\n\n`;
        md += `#### 数据范围\n\n${problem.dataRange}\n\n`;
        md += `#### 样例数据\n\n`;
        problem.exampleList.forEach(example => {
            const input = example.input.replace(/\n/g, '\n> ');
            const output = example.output.replace(/\n/g, '\n> ');
            md += `**输入**\n\n> ${input}\n\n`;
            md += `**输出**\n\n> ${output}\n\n`;
            if (example.note) {
                md += `**说明**\n\n${example.note}\n\n`;
            }
        });
        md += '\n\n\n'; // 题目之间添加空行
        return md;
    }

    /**
     * 处理下载逻辑。
     * @param {JQuery<HTMLElement>} button 下载按钮的 jQuery 对象。
     */
    async function handleDownload(button) {
        button.prop('disabled', true).text(BUTTON_TEXT_LOADING);

        try {
            const contestId = getContestIdFromUrl();
            if (!contestId) {
                alert('无法从 URL 中获取比赛 ID。');
                return;
            }

            const problemData = await fetchProblemData(contestId);
            const contestTitle = $('h2.ant-typography').text() || '题目';
            const zip = new JSZip();
            const problemsByLevel = groupProblemsByLevel(problemData);

            for (const level in problemsByLevel) {
                let markdownContent = '';
                problemsByLevel[level].forEach((problem, index) => {
                    markdownContent += generateProblemMarkdown(problem, index);
                });
                zip.file(`${level}.md`, markdownContent);
            }

            const blob = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${contestTitle}.zip`;
            link.click();

        } catch (error) {
            console.error('下载题目失败:', error);
            alert('下载题目失败，请检查控制台错误信息。');
        } finally {
            button.prop('disabled', false).text(BUTTON_TEXT_DEFAULT);
        }
    }

    // ---------------------------- 初始化 ----------------------------
    $(document).ready(function() {
        const downloadButton = createDownloadButton();
        downloadButton.click(() => handleDownload(downloadButton));
    });

})();