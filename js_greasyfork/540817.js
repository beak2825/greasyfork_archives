// ==UserScript==
// @name         教务系统助手 (成绩导出 & 构成查询 & 重修查询 & 成绩汇总)
// @namespace    https://github.com/wzp100/nwu-jwgl-helper
// @version      3.1.0-beta
// @description  在方正/西北大学教务系统页面添加一个统一的助手按钮。内置成绩分项导出、课程成绩构成查询(支持排序)和重修课程查询等功能，并支持汇总查询。
// @author       wzp100 (Gemini 辅助) xumoe-c (维护成绩汇总模块)
// @match        https://jwgl.nwu.edu.cn/jwglxt/*
// @match        *://*/jwglxt/*
// @icon         https://www.zfsoft.com/img/zf.ico
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @connect      jwgl.nwu.edu.cn
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/540817/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B%20%28%E6%88%90%E7%BB%A9%E5%AF%BC%E5%87%BA%20%20%E6%9E%84%E6%88%90%E6%9F%A5%E8%AF%A2%20%20%E9%87%8D%E4%BF%AE%E6%9F%A5%E8%AF%A2%20%20%E6%88%90%E7%BB%A9%E6%B1%87%E6%80%BB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540817/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B%20%28%E6%88%90%E7%BB%A9%E5%AF%BC%E5%87%BA%20%20%E6%9E%84%E6%88%90%E6%9F%A5%E8%AF%A2%20%20%E9%87%8D%E4%BF%AE%E6%9F%A5%E8%AF%A2%20%20%E6%88%90%E7%BB%A9%E6%B1%87%E6%80%BB%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ================================================================================= */
    /* ============================ 全局UI与路由逻辑 ============================ */
    /* ================================================================================= */

    const assistant = {
        // --- 核心UI元素 ---
        elements: {
            assistantBtn: null,
            modal: null,
            modalTitle: null,
            modalContent: null,
            closeBtn: null,
        },

        // --- 全局样式 ---
        addGlobalStyles: () => {
            GM_addStyle(`
                #assistant-btn {
                    position: fixed; top: 10px; right: 150px; z-index: 9998;
                    padding: 8px 15px; background-color: #28a745; color: white;
                    border: none; border-radius: 5px; cursor: pointer; font-size: 14px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                #assistant-btn:hover { background-color: #218838; }
                #assistant-modal {
                    position: fixed; top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 80%; max-width: 950px;
                    max-height: 80vh;
                    background-color: white; border: 1px solid #ccc;
                    border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    z-index: 10000; display: none; flex-direction: column;
                }
                .assistant-header {
                    padding: 15px; background-color: #f7f7f7;
                    border-bottom: 1px solid #ddd;
                    display: flex; justify-content: space-between; align-items: center;
                }
                .assistant-header h2 { margin: 0; font-size: 18px; }
                .header-buttons { display: flex; align-items: center; gap: 10px; }
                .assistant-close-btn, .header-back-btn {
                    padding: 5px 10px; border-radius: 4px; cursor: pointer;
                }
                .assistant-close-btn { background-color: #e0e0e0; border: 1px solid #ccc; }
                .header-back-btn { background-color: #6c757d; color: white; border: 1px solid #5a6268; }
                .header-back-btn:hover { background-color: #5a6268; }

                .assistant-content { padding: 20px; overflow-y: auto; flex-grow: 1; }
                /* 功能选择菜单按钮样式 */
                .function-select-container { display: flex; flex-direction: column; gap: 15px; align-items: center; padding: 20px 0; }
                .function-select-btn {
                    width: 60%; padding: 15px; font-size: 16px; border-radius: 8px;
                    border: none; background-color: #28a745; color: white; cursor: pointer;
                    text-align: center; transition: all 0.2s ease;
                }
                .function-select-btn:hover { background-color: #218838; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                /* 查询控制区域统一样式 */
                .query-controls {
                    padding: 15px; display: flex; align-items: center; gap: 15px;
                    border-bottom: 1px solid #eee; margin-bottom: 15px;
                }
                .query-controls label { font-weight: bold; margin-bottom: 0; }
                .query-controls select, .query-controls button {
                    padding: 5px 10px; border-radius: 4px; border: 1px solid #ccc;
                }
                .query-controls button { background-color: #28a745; color: white; cursor: pointer; }
                .query-controls button:hover { background-color: #218838; }
                /* 结果表格样式 */
                .result-table { width: 100%; border-collapse: collapse; table-layout: auto; }
                .result-table th, .result-table td { border: 1px solid #ddd; padding: 8px; text-align: center; white-space: nowrap; }
                .result-table th { background-color: #f2f2f2; position: sticky; top: -21px; /* 表头吸顶 */ }
                .sortable-header { cursor: pointer; user-select: none; }
                .sortable-header:hover { background-color: #e0e0e0; }
                /* 为课程名称列设置换行和左对齐 */
                .result-table td.col-course-name {
                    word-wrap: break-word; word-break: break-all; text-align: left; padding-left: 10px; white-space: normal; min-width: 180px;
                }
                .sortable-header::after {
                    content: ''; display: inline-block; margin-left: 5px; opacity: 0.5;
                    border-left: 5px solid transparent; border-right: 5px solid transparent;
                }
                .sort-asc::after { border-bottom: 5px solid #333; opacity: 1; border-top: none; }
                .sort-desc::after { border-top: 5px solid #333; opacity: 1; border-bottom: none; }
                #loading-spinner {
                     border: 5px solid #f3f3f3; border-top: 5px solid #28a745;
                     border-radius: 50%; width: 40px; height: 40px;
                     animation: spin 1s linear infinite; margin: 20px auto;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `);
        },

        // --- 创建基础UI框架 ---
        setupUI: () => {
            assistant.addGlobalStyles();
            assistant.elements.assistantBtn = $('<button>', { id: 'assistant-btn', text: '教务助手' }).appendTo('body');
            const modalHTML = `
                <div id="assistant-modal">
                    <div class="assistant-header">
                        <h2 id="assistant-modal-title">教务助手</h2>
                        <div class="header-buttons">
                            <button class="assistant-close-btn">关闭</button>
                        </div>
                    </div>
                    <div id="assistant-modal-content" class="assistant-content"></div>
                </div>`;
            assistant.elements.modal = $(modalHTML).appendTo('body');
            assistant.elements.modalTitle = $('#assistant-modal-title');
            assistant.elements.modalContent = $('#assistant-modal-content');
            assistant.elements.closeBtn = $('.assistant-close-btn');

            assistant.elements.assistantBtn.on('click', assistant.openModal);
            assistant.elements.closeBtn.on('click', assistant.closeModal);
        },

        openModal: () => { assistant.elements.modal.css('display', 'flex'); assistant.route(); },
        closeModal: () => assistant.elements.modal.css('display', 'none'),

        toggleBackButton: (show) => {
            const container = $('.header-buttons');
            container.find('.header-back-btn').remove();
            if (show) {
                const backBtn = $('<button>', { text: '返回', class: 'header-back-btn' });
                backBtn.on('click', assistant.showMainMenu);
                container.prepend(backBtn);
            }
        },

        showMainMenu: () => {
            assistant.toggleBackButton(false);
            const content = `
                <div class="function-select-container">
                    <p>您好，${assistant.getStudentId() ? 'NWU的同学！' : ''}请选择您需要使用的功能：</p>
                    <button id="select-grade-component-query" class="function-select-btn">课程成绩构成查询（没有期末成绩）</button>
                    <button id="select-grade-export" class="function-select-btn">学期成绩导出（可以查询已出成绩分项）</button>
                    <button id="select-retake-query" class="function-select-btn">重修查询（提前查询成绩）</button>
                    <button id="select-about" class="function-select-btn" style="background-color: #6c757d; margin-top: 10px;">关于脚本</button>
                </div>
            `;
            assistant.populateModal('教务系统助手v'+GM_info.script.version, content, () => {
                $('#select-grade-component-query').on('click', gradeComponentQuerier.configureModal);
                $('#select-grade-export').on('click', gradeExporter.configureModal);
                $('#select-retake-query').on('click', retakeQuerier.configureModal);
                $('#select-about').on('click', assistant.showAboutPage);
            });
        },

        showAboutPage: () => {
            assistant.toggleBackButton(true);
            const version = GM_info.script.version;
            const contentHTML = `
                <div style="padding: 10px; font-size: 14px; line-height: 1.8;">
                    <h3 style="text-align: center; margin-bottom: 20px;">教务系统助手 v${version}</h3>
                    <p><strong>简介：</strong></p>
                    <p style="text-indent: 2em;">
                        本脚本旨在为<strong>西北大学（NWU）</strong>新版正方教务系统提供一系列便捷的辅助功能，以增强用户体验，简化常见的查询与数据导出操作。
                    </p>
                    <hr style="margin: 20px 0;">
                    <p><strong>主要功能：</strong></p>
                    <ul>
                        <li><strong>课程成绩构成查询：</strong> 以清晰的表格形式展示每门课程的详细成绩组成（如平时、期中、实验等），并支持全列点击排序。</li>
                        <li><strong>学期成绩导出：</strong> 一键导出指定学年学期或全部学年的成绩单为 Excel (XLS) 文件。</li>
                        <li><strong>重修查询：</strong> 快速查询指定学年需要重修或补考的课程列表。</li>
                        <li><strong>成绩汇总（实验性功能）：</strong> 仍在开发中，结果仅供参考。可汇总成绩分项、总评成绩、重修成绩，并可根据占比计算期末成绩。</li>
                    </ul>
                    <hr style="margin: 20px 0;">
                    <p><strong>项目地址：</strong></p>
                    <p>
                        如果您有任何建议或发现BUG，欢迎通过以下 GitHub 仓库地址提交 Issue 或 Pull Request：<br>
                        <a href="https://github.com/wzp100/nwu-jwgl-helper" target="_blank">https://github.com/wzp100/nwu-jwgl-helper</a>
                    </p>
                     <p style="margin-top: 30px; text-align: right; color: #888;">
                        作者: wzp100 xumoe-c<br>
                        AI 辅助: Gemini、Claude
                    </p>
                </div>
            `;
            assistant.populateModal('关于脚本', contentHTML, null, false);
        },

        populateModal: (title, contentHTML, onReady, addAllYearsOption = undefined) => {
            assistant.elements.modalTitle.text(title);
            assistant.elements.modalContent.html(contentHTML);

            if (addAllYearsOption !== undefined) {
                const yearSelect = assistant.elements.modalContent.find('.year-select');
                if (yearSelect.length) {
                    if (addAllYearsOption) { yearSelect.append(new Option('全部学年', '')); }
                    const studentId = assistant.getStudentId();
                    const entryYear = studentId ? parseInt(studentId.substring(0, 4)) : new Date().getFullYear() - 4;
                    const currentYear = new Date().getFullYear();
                    for (let year = entryYear; year <= currentYear; year++) {
                        yearSelect.append(new Option(`${year}-${year + 1}学年`, year));
                    }
                    if (addAllYearsOption) { yearSelect.val(''); }
                    else { const defaultYear = (new Date().getMonth() < 8) ? currentYear - 1 : currentYear; yearSelect.val(defaultYear); }
                }
            }
            if (onReady && typeof onReady === 'function') { onReady(); }
        },

        getStudentId: () => {
            const sessionUserKey_element = document.getElementById('sessionUserKey');
            if (sessionUserKey_element && sessionUserKey_element.value) return sessionUserKey_element.value;
            const xh_id_element = document.getElementById('xh_id');
            if (xh_id_element && xh_id_element.value) return xh_id_element.value;
            try { let studentId = new URLSearchParams(window.top.location.search).get('su'); if (studentId) return studentId; } catch (e) {}
            try { const userElement = window.top.document.querySelector('#sessionUser .media-body span.ng-binding'); if (userElement && userElement.textContent) { const match = userElement.textContent.match(/\d+/); if (match) return match[0]; } } catch (e) {}
            return null;
        },

        route: () => { assistant.showMainMenu(); },
        init: () => { assistant.setupUI(); }
    };

    /* ================================================================================= */
    /* =================== 功能一: 课程成绩构成查询 (支持排序) ================= */
    /* ================================================================================= */

    const gradeComponentQuerier = {
        processedData: [],
        dynamicHeaders: [],
        sortState: { key: 'xnmc', direction: 'desc' },

        configureModal: () => {
            assistant.toggleBackButton(true);
            const content = `
                <div class="query-controls">
                    <label for="gc-year-select">学年:</label>
                    <select id="gc-year-select" class="year-select"></select>
                    <label for="gc-semester-select">学期:</label>
                    <select id="gc-semester-select">
                        <option value="">全部</option>
                        <option value="3">第一学期</option>
                        <option value="12">第二学期</option>
                    </select>
                    <button id="start-gc-query-btn">查询构成</button>
                </div>
                <div id="gc-result-content"><p style="text-align:center; color:#888;">请选择学年和学期后点击查询。</p></div>`;
            assistant.populateModal('课程成绩构成查询 (点击表头排序)', content, () => {
                if (!assistant.getStudentId()) {
                    $('#gc-result-content').html('<p style="color:red; text-align:center;">错误：无法自动获取到您的学号！</p>');
                    $('#start-gc-query-btn').prop('disabled', true);
                    return;
                }
                $('#start-gc-query-btn').on('click', gradeComponentQuerier.executeQuery);
            }, true);
        },

        executeQuery: async () => {
            const year = $('#gc-year-select').val();
            const semester = $('#gc-semester-select').val();
            const resultContent = $('#gc-result-content');
            resultContent.html('<div id="loading-spinner"></div><p style="text-align:center;">正在查询中...</p>');

            try {
                const responseJson = await gradeComponentQuerier.fetchGradeComponentData(year, semester);
                if (responseJson && responseJson.items && responseJson.items.length > 0) {
                    gradeComponentQuerier.processAndDisplay(responseJson.items);
                } else {
                    resultContent.html('<p style="text-align:center; color: green;">查询完成，未找到相关成绩数据。</p>');
                }
            } catch (error) {
                console.error('成绩构成查询出错:', error);
                resultContent.html(`<p style="color:red; text-align:center;">查询失败，请检查网络或查看浏览器控制台(F12)的错误信息。</p>`);
            }
        },

        fetchGradeComponentData: (academicYear, semester) => {
            const url = '/jwglxt/cjcx/cjjdcx_cxXsjdxmcjIndex.html?doType=query&gnmkdm=N305099';
            const formData = new URLSearchParams({ 'xnm': academicYear, 'xqm': semester, 'xh': '', '_search': 'false', 'nd': Date.now(), 'queryModel.showCount': '500', 'queryModel.currentPage': '1', 'queryModel.sortName': 'kch', 'queryModel.sortOrder': 'asc', 'time': '0' });
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url: url, data: formData.toString(),
                    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", "Accept": "application/json, text/javascript, */*; q=0.01", "X-Requested-With": "XMLHttpRequest" },
                    onload: function(response) {
                        if (response.status === 200) { try { resolve(JSON.parse(response.responseText)); } catch (e) { resolve(null); } }
                        else { reject(new Error(`HTTP status ${response.status}`)); }
                    },
                    onerror: function(error) { reject(error); }
                });
            });
        },

        processAndDisplay: function(items) {
            const componentHeaders = new Set();
            items.forEach(item => { if (item.xmblmc) componentHeaders.add(item.xmblmc); });
            this.dynamicHeaders = Array.from(componentHeaders).sort();

            const courses = {};
            items.forEach(item => {
                const key = item.jxb_id;
                if (!courses[key]) {
                    courses[key] = {
                        kcmc: item.kcmc, kch: item.kch, xnmc: item.xnmc,
                        xqmc: item.xqmc === '3' ? '第一学期' : (item.xqmc === '12' ? '第二学期' : `第${item.xqmc}学期`),
                        components: {}
                    };
                }
                courses[key].components[item.xmblmc] = item.xmcj;
            });
            this.processedData = Object.values(courses);
            this.sortState = { key: 'xnmc', direction: 'desc' }; // 默认按学年降序
            this.sortTable(this.sortState.key, true); // 初始排序和渲染
        },

        sortTable: function(newSortKey, preventFlip = false) {
            if (!preventFlip && this.sortState.key === newSortKey) {
                this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortState.key = newSortKey;
                this.sortState.direction = 'asc';
            }

            const isNumericSort = this.dynamicHeaders.includes(newSortKey);
            const dir = this.sortState.direction === 'asc' ? 1 : -1;

            this.processedData.sort((a, b) => {
                let valA, valB;
                if (isNumericSort) {
                    valA = parseFloat(a.components[newSortKey] || -1);
                    valB = parseFloat(b.components[newSortKey] || -1);
                } else {
                    valA = a[newSortKey] || '';
                    valB = b[newSortKey] || '';
                }

                if (typeof valA === 'string' && typeof valB === 'string') {
                    return valA.localeCompare(valB, 'zh-Hans-CN') * dir;
                }
                return (valA > valB ? 1 : (valA < valB ? -1 : 0)) * dir;
            });
            this.renderTable();
        },

        renderTable: function() {
            const fixedHeaders = { 'kcmc': '课程名称', 'kch': '课程代码', 'xnmc': '学年', 'xqmc': '学期' };
            let tableHTML = `<table class="result-table"><thead><tr><th>序号</th>`;
            // 固定表头
            for (const key in fixedHeaders) {
                tableHTML += `<th class="sortable-header" data-sort-key="${key}">${fixedHeaders[key]}</th>`;
            }
            // 动态成绩分项表头
            this.dynamicHeaders.forEach(header => {
                tableHTML += `<th class="sortable-header" data-sort-key="${header}">${header}</th>`;
            });
            tableHTML += `</tr></thead><tbody>`;

            this.processedData.forEach((course, index) => {
                tableHTML += `<tr>
                                <td>${index + 1}</td>
                                <td class="col-course-name">${course.kcmc}</td>
                                <td>${course.kch}</td>
                                <td>${course.xnmc}</td>
                                <td>${course.xqmc}</td>`;
                this.dynamicHeaders.forEach(header => {
                    const score = course.components[header] || '—';
                    tableHTML += `<td>${score}</td>`;
                });
                tableHTML += `</tr>`;
            });
            tableHTML += '</tbody></table>';

            const resultContent = $('#gc-result-content');
            resultContent.html(tableHTML);
            // 更新排序指示器并重新绑定事件
            resultContent.find('.sortable-header').each((i, header) => {
                const JqHeader = $(header);
                if (JqHeader.data('sort-key') === this.sortState.key) {
                    JqHeader.addClass(this.sortState.direction === 'asc' ? 'sort-asc' : 'sort-desc');
                }
                JqHeader.on('click', () => this.sortTable(JqHeader.data('sort-key')));
            });
        }
    };


    /* ================================================================================= */
    /* =================== 功能二: 学期成绩导出 (支持全部学年) =================== */
    /* ================================================================================= */

    const gradeExporter = {
        configureModal: () => {
            assistant.toggleBackButton(true);
            const content = `
                <div class="query-controls">
                    <label for="grade-year-select">学年:</label>
                    <select id="grade-year-select" class="year-select"></select>
                    <label for="grade-semester-select">学期:</label>
                    <select id="grade-semester-select">
                        <option value="">全部学期</option>
                        <option value="3">第一学期</option>
                        <option value="12">第二学期</option>
                    </select>
                    <button id="start-export-btn">开始导出</button>
                </div>
                <div id="export-status" style="text-align:center; color:#888;">请选择学年学期后点击导出。</div>`;
            assistant.populateModal('学期成绩导出', content, () => {
                $('#start-export-btn').on('click', gradeExporter.handleExport);
            }, true);
        },
        downloadFile: (blob, filename) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        },
        handleExport: async () => {
            const statusDiv = $('#export-status');
            try {
                const xnm = $('#grade-year-select').val();
                const xqm = $('#grade-semester-select').val();
                const yearText = xnm === '' ? '全部学年' : `${xnm}-${parseInt(xnm) + 1}学年`;
                const semesterText = $('#grade-semester-select option:selected').text();
                const fileName = `成绩单-${yearText}-${semesterText}-${Date.now()}.xlsx`;
                statusDiv.html('<div id="loading-spinner"></div><p>正在请求服务器生成文件...</p>');
                const params = new URLSearchParams([
                    ['gnmkdmKey', 'N305005'], ['xnm', xnm], ['xqm', xqm], ['dcclbh', 'JW_N305005_GLY'],
                    ...['kcmc@课程名称', 'xnmmc@学年', 'xqmmc@学期', 'kkbmmc@开课学院', 'kch@课程代码', 'jxbmc@教学班', 'xf@学分', 'xmcj@成绩', 'xmblmc@成绩分项'].map(col => ['exportModel.selectCol', col]),
                    ['exportModel.exportWjgs', 'xls'], ['fileName', '成绩单']
                ]);
                const response = await fetch('/jwglxt/cjcx/cjcx_dcXsKccjList.html', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params
                });
                if (!response.ok) throw new Error(`服务器返回异常: ${response.status}`);
                statusDiv.text('正在下载文件...');
                const blob = await response.blob();
                gradeExporter.downloadFile(blob, fileName);
                statusDiv.html('<p style="color: green;">导出成功！</p>');
            } catch (error) {
                console.error('导出操作失败:', error);
                statusDiv.html(`<p style="color: red;">导出失败: ${error.message}</p>`);
            }
        },
    };


    /* ================================================================================= */
    /* =================== 功能三: 重修查询 (按学年) ================== */
    /* ================================================================================= */
    const retakeQuerier = {
        currentCourseData: [],
        sortState: { key: 'cj', direction: 'asc' },
        configureModal: () => {
            assistant.toggleBackButton(true);
            const content = `
                <div class="query-controls">
                    <label for="retake-year-select">学年:</label>
                    <select id="retake-year-select" class="year-select"></select>
                    <label for="retake-semester-select">学期:</label>
                    <select id="retake-semester-select">
                        <option value="">全部学期</option><option value="3">第一学期</option><option value="12">第二学期</option>
                    </select>
                    <button id="start-query-btn">开始查询</button>
                </div>
                <div id="retake-result-content"><p style="text-align:center; color:#888;">查询指定学年学期的课程。</p></div>`;
            assistant.populateModal('重修查询', content, () => {
                if (!assistant.getStudentId()) {
                    $('#retake-result-content').html('<p style="color:red; text-align:center;">错误：无法自动获取到您的学号！</p>');
                    $('#start-query-btn').prop('disabled', true);
                    return;
                }
                $('#start-query-btn').on('click', retakeQuerier.executeQuery);
            }, false);
        },
        executeQuery: async () => {
            const studentId = assistant.getStudentId();
            const year = $('#retake-year-select').val();
            const semester = $('#retake-semester-select').val();
            const resultContent = $('#retake-result-content');
            resultContent.html('<div id="loading-spinner"></div><p style="text-align:center;">正在查询中...</p>');
            let promises = [];
            if (semester === "") {
                promises.push(retakeQuerier.fetchRetakeData(studentId, year, "3"));
                promises.push(retakeQuerier.fetchRetakeData(studentId, year, "12"));
            } else {
                promises.push(retakeQuerier.fetchRetakeData(studentId, year, semester));
            }
            try {
                const results = await Promise.all(promises);
                let allCourses = [];
                results.forEach(responseJson => {
                    if (responseJson && responseJson.items) {
                        responseJson.items.forEach(item => { if (item.cj && !allCourses.some(c => c.kch_id === item.kch_id && c.kcmc === item.kcmc)) { allCourses.push(item); } });
                    }
                });
                retakeQuerier.sortState = { key: 'cj', direction: 'asc' };
                allCourses.sort((a, b) => parseFloat(a.cj) - parseFloat(b.cj));
                retakeQuerier.currentCourseData = allCourses;
                retakeQuerier.displayResults();
            } catch (error) {
                console.error('查询出错:', error);
                resultContent.html(`<p style="color:red; text-align:center;">查询失败，请检查网络或查看浏览器控制台(F12)的错误信息。</p>`);
            }
        },
        fetchRetakeData: (studentId, academicYear, semester) => {
            const url = `https://jwgl.nwu.edu.cn/jwglxt/cxbm/cxbm_cxXscxbmList.html?gnmkdm=N1056&su=${studentId}`;
            const formData = new URLSearchParams({ "doType": "query", "cxxnm": academicYear, "cxxqm": semester, "_search": "false", "nd": Date.now(), "queryModel.showCount": "1000", "queryModel.currentPage": "1", "queryModel.sortName": "cj", "queryModel.sortOrder": "asc" });
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url: url, data: formData.toString(),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                        "Accept": "application/json, text/javascript, */*; q=0.01",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    onload: function(response) {
                        if (response.status === 200) { try { resolve(JSON.parse(response.responseText)); } catch (e) { resolve(null); } }
                        else { reject(new Error(`HTTP status ${response.status}`)); }
                    },
                    onerror: function(error) { reject(error); }
                });
            });
        },
        sortTable: (newSortKey) => {
            if (retakeQuerier.sortState.key === newSortKey) {
                retakeQuerier.sortState.direction = retakeQuerier.sortState.direction === 'asc' ? 'desc' : 'asc';
            } else {
                retakeQuerier.sortState.key = newSortKey;
                retakeQuerier.sortState.direction = 'asc';
            }
            retakeQuerier.currentCourseData.sort((a, b) => {
                const sortKey = retakeQuerier.sortState.key;
                const sortDir = retakeQuerier.sortState.direction;
                let valA = a[sortKey], valB = b[sortKey];
                if (['cj', 'xf', 'cxcj'].includes(sortKey)) {
                    valA = parseFloat(valA) || -1;
                    valB = parseFloat(valB) || -1;
                    return sortDir === 'asc' ? valA - valB : valB - valA;
                } else {
                    valA = (valA || '').toString();
                    valB = (valB || '').toString();
                    return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }
            });
            retakeQuerier.displayResults();
        },
        displayResults: () => {
            const resultContent = $('#retake-result-content');
            if (!retakeQuerier.currentCourseData || retakeQuerier.currentCourseData.length === 0) {
                resultContent.html('<p style="text-align:center; color: green; font-weight: bold;">查询完毕，该时间段内没有需要重修的课程。</p>');
                return;
            }
            let tableHTML = `<table class="result-table"><thead><tr><th>序号</th><th class="sortable-header" data-sort-key="kcmc">课程名称</th><th class="sortable-header" data-sort-key="xf">学分</th><th>课程属性</th><th class="sortable-header" data-sort-key="cj">原始成绩</th><th class="sortable-header" data-sort-key="cxcj">重修成绩</th></tr></thead><tbody>`;
            retakeQuerier.currentCourseData.forEach((course, index) => {
                tableHTML += `<tr><td>${index + 1}</td><td>${course.kcmc ? course.kcmc.split('<br>')[0] : 'N/A'}</td><td>${course.xf || 'N/A'}</td><td>${course.kcsxmc || 'N/A'}</td><td style="color: red; font-weight: bold;">${course.cj || 'N/A'}</td><td>${course.cxcj || '无'}</td></tr>`;
            });
            tableHTML += '</tbody></table>';
            resultContent.html(tableHTML);
            const sortedHeader = resultContent.find(`.sortable-header[data-sort-key="${retakeQuerier.sortState.key}"]`);
            if(sortedHeader.length) {
                const sortClass = retakeQuerier.sortState.direction === 'asc' ? 'sort-asc' : 'sort-desc';
                sortedHeader.addClass(sortClass);
            }
            resultContent.find('.sortable-header').each((i, header) => {
                $(header).on('click', () => retakeQuerier.sortTable(header.dataset.sortKey));
            });
        }
    };

    /* ================================================================================= */
    /* =================== 功能四: 成绩汇总（实验性功能） ================== */
    /* ================================================================================= */
    
    // 成绩汇总功能实现
    const gradeIntegrator = {
        // 存储查询到的成绩构成和重修数据
        componentData: [],
        retakeData: [],
        dynamicHeaders: [],
        // 配置弹窗
        configureModal: function () {
            assistant.toggleBackButton(true);
            const content = `
                <div class="query-controls">
                    <label for="gi-year-select">学年:</label>
                    <select id="gi-year-select" class="year-select"></select>
                    <label for="gi-semester-select">学期:</label>
                    <select id="gi-semester-select">
                        <option value="">全部</option>
                        <option value="3">第一学期</option>
                        <option value="12">第二学期</option>
                    </select>
                    <button id="start-gi-query-btn">查询汇总</button>
                </div>
                <div id="gi-result-content"><p style="text-align:center; color:#888;">请选择学年和学期后点击查询。</p></div>
            `;
            assistant.populateModal('成绩汇总（实验性功能，结果仅供参考。后续更新将加入期末成绩计算、分项成绩占比展示等功能。）', content, () => {
                $('#start-gi-query-btn').on('click', gradeIntegrator.executeQuery);
            }, true);
        },
        // 执行查询
        executeQuery: async function () {
            const year = $('#gi-year-select').val();
            const semester = $('#gi-semester-select').val();
            const resultContent = $('#gi-result-content');
            resultContent.html('<div id="loading-spinner"></div><p style="text-align:center;">正在查询中...</p>');
    
            try {
                // 1. 查询成绩构成（功能一）
                const compJson = await gradeComponentQuerier.fetchGradeComponentData(year, semester);
                // 2. 查询重修成绩（功能三）
                const studentId = assistant.getStudentId();
                let retakeJsonArr = [];
                if (semester === "") {
                    retakeJsonArr = await Promise.all([
                        retakeQuerier.fetchRetakeData(studentId, year, "3"),
                        retakeQuerier.fetchRetakeData(studentId, year, "12")
                    ]);
                } else {
                    retakeJsonArr = [await retakeQuerier.fetchRetakeData(studentId, year, semester)];
                }
                // 整理重修数据
                let retakeItems = [];
                retakeJsonArr.forEach(json => {
                    if (json && json.items) {
                        json.items.forEach(item => {
                            if (item.kcmc && item.cj) {
                                retakeItems.push({
                                    kcmc: item.kcmc ? item.kcmc.split('<br>')[0] : '',
                                    cj: item.cj,
                                    cxcj: item.cxcj || ''
                                });
                            }
                        });
                    }
                });
    
                // 整理成绩构成数据
                if (!compJson || !compJson.items || compJson.items.length === 0) {
                    resultContent.html('<p style="text-align:center; color: green;">查询完成，未找到相关成绩数据。</p>');
                    return;
                }
                // 复用功能一的处理逻辑
                const componentHeaders = new Set();
                compJson.items.forEach(item => { if (item.xmblmc) componentHeaders.add(item.xmblmc); });
                gradeIntegrator.dynamicHeaders = Array.from(componentHeaders).sort();
    
                // 以课程名称为key聚合
                const courses = {};
                compJson.items.forEach(item => {
                    const key = item.kcmc;
                    if (!courses[key]) {
                        courses[key] = {
                            kcmc: item.kcmc,
                            kch: item.kch,
                            xnmc: item.xnmc,
                            xqmc: item.xqmc === '3' ? '第一学期' : (item.xqmc === '12' ? '第二学期' : `第${item.xqmc}学期`),
                            components: {}
                        };
                    }
                    courses[key].components[item.xmblmc] = item.xmcj;
                });
    
                // 合并重修成绩
                Object.values(courses).forEach(course => {
                    const retake = retakeItems.find(r => r.kcmc === course.kcmc);
                    course.cj = retake ? retake.cj : '';
                    course.cxcj = retake ? retake.cxcj : '';
                });
    
                gradeIntegrator.componentData = Object.values(courses);
                gradeIntegrator.renderTable();
            } catch (error) {
                console.error('成绩汇总查询出错:', error);
                resultContent.html(`<p style="color:red; text-align:center;">查询失败，请检查网络或查看浏览器控制台(F12)的错误信息。</p>`);
            }
        },
        // 渲染表格
        renderTable: function () {
            const fixedHeaders = { 'kcmc': '课程名称', 'kch': '课程代码', 'xnmc': '学年', 'xqmc': '学期' };
            let tableHTML = `<table class="result-table"><thead><tr><th>序号</th>`;
            // 固定表头
            for (const key in fixedHeaders) {
                tableHTML += `<th>${fixedHeaders[key]}</th>`;
            }
            // 动态成绩分项表头
            gradeIntegrator.dynamicHeaders.forEach(header => {
                tableHTML += `<th>${header}</th>`;
            });
            // 重修成绩表头
            tableHTML += `<th>原始成绩</th><th>重修成绩</th>`;
            tableHTML += `</tr></thead><tbody>`;
    
            gradeIntegrator.componentData.forEach((course, index) => {
                tableHTML += `<tr>
                    <td>${index + 1}</td>
                    <td class="col-course-name">${course.kcmc}</td>
                    <td>${course.kch}</td>
                    <td>${course.xnmc}</td>
                    <td>${course.xqmc}</td>`;
                gradeIntegrator.dynamicHeaders.forEach(header => {
                    const score = course.components[header] || '—';
                    tableHTML += `<td>${score}</td>`;
                });
                tableHTML += `<td style="color: red; font-weight: bold;">${course.cj || '—'}</td><td>${course.cxcj || '—'}</td>`;
                tableHTML += `</tr>`;
            });
            tableHTML += '</tbody></table>';
    
            $('#gi-result-content').html(tableHTML);
        }
    };
    
    // 修正按钮调用
    window.gradeIntigrater = gradeIntegrator;
    
    // 在主菜单添加入口
    const oldShowMainMenu = assistant.showMainMenu;
    assistant.showMainMenu = function() {
        oldShowMainMenu();
        // 动态插入按钮
        setTimeout(() => {
            if ($('#select-grade-integrate').length === 0) {
                $('<button id="select-grade-integrate" class="function-select-btn" style="background-color:#007bff;">成绩汇总（实验性功能，结果仅供参考）</button>')
                    .insertBefore('#select-about')
                    .on('click', gradeIntigrater.configureModal);
            }
        }, 0);
    }

    // --- 启动脚本 ---
    $(document).ready(assistant.init);

})();
