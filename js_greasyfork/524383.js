// ==UserScript==
// @name         方正教务系统成绩分项下载
// @namespace    ikaikail@ikaikail.com
// @version      1.9
// @description  期末成绩不理想？担心被穿小鞋？不用怕！这款脚本让你期末成绩和平时成绩一目了然！支持VPN环境！
// @author       iKaiKail
// @match        *://*/jwglxt/cjcx/*
// @include      *:/*/cjcx/*
// @icon         https://www.zfsoft.com/img/zf.ico
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/524383/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%88%90%E7%BB%A9%E5%88%86%E9%A1%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/524383/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%88%90%E7%BB%A9%E5%88%86%E9%A1%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #score-detail-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 1000px;
            max-height: 80vh;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            display: none;
            flex-direction: column;
            overflow: hidden;
        }
        .score-modal-header {
            padding: 12px 15px;
            background-color: #2587de;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 8px 8px 0 0;
        }
        .score-modal-title {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            color: white;
        }
        .score-modal-close {
            background: none;
            border: none;
            font-size: 24px;
            font-weight: 200;
            opacity: 0.8;
            cursor: pointer;
            color: white;
            padding: 0;
            line-height: 1;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        .score-modal-close:hover {
            opacity: 1;
            background-color: rgba(255,255,255,0.3);
        }
        .score-modal-close span {
            position: relative;
            top: -2px;
        }
        .score-modal-content {
            padding: 20px;
            overflow-y: auto;
            flex-grow: 1;
        }
        .result-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: auto;
        }
        .result-table th, .result-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
            white-space: nowrap;
        }
        .result-table th {
            background-color: #f2f2f2;
            position: sticky;
            top: -1px;
        }
        .col-course-name {
            word-wrap: break-word;
            word-break: break-all;
            text-align: left;
            padding-left: 10px;
            white-space: normal;
            min-width: 180px;
        }
        #loading-spinner {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #28a745;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .sortable-header {
            cursor: pointer;
            user-select: none;
        }
        .sortable-header:hover {
            background-color: #e0e0e0;
        }
        .sort-asc::after {
            content: '';
            display: inline-block;
            margin-left: 5px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid #333;
        }
        .sort-desc::after {
            content: '';
            display: inline-block;
            margin-left: 5px;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #333;
        }
        .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999;
            display: none;
        }
        .score-action-btn {
            background-color: #337ab7 !important;
            color: white !important;
            border: none !important;
        }
        .score-action-btn:hover {
            background-color: #286090 !important;
        }
        #queryScoresBtn {
            margin-left: 12px;
            margin-right: 12px;
        }
        #exportAllScoresBtn {
            margin-left: 0;
            margin-right: 0;
        }
        @media (max-width: 767px) {
            .col-md-4.col-sm-5 button {
                margin-top: 8px;
                margin-left: 0 !important;
                margin-right: 8px !important;
            }
            .col-md-4.col-sm-5 button:last-child {
                margin-right: 0 !important;
            }
        }
    `);

    const createScoreModal = () => {
        const modalHTML = `
            <div id="score-detail-modal">
                <div class="score-modal-header">
                    <h4 class="score-modal-title">成绩分项详情</h4>
                    <button class="score-modal-close" type="button">
                        <span>×</span>
                    </button>
                </div>
                <div class="score-modal-content" id="score-modal-content">
                    <div id="loading-spinner"></div>
                    <p style="text-align:center;">正在加载成绩数据...</p>
                </div>
            </div>
            <div class="modal-backdrop" id="modal-backdrop"></div>
        `;
        $('body').append(modalHTML);
        $('.score-modal-close').click(closeScoreModal);
        $('#modal-backdrop').click(closeScoreModal);
    };

    const openScoreModal = () => {
        $('#score-detail-modal, #modal-backdrop').show();
    };

    const closeScoreModal = () => {
        $('#score-detail-modal, #modal-backdrop').hide();
    };

    const createButtons = () => {
        return {
            $queryButton: $('<button>', {
                type: 'button',
                class: 'btn btn-sm score-action-btn',
                text: '查询分项成绩',
                id: 'queryScoresBtn'
            }),
            $downloadButton: $('<button>', {
                type: 'button',
                class: 'btn btn-sm score-action-btn',
                text: '导出分项成绩',
                id: 'exportAllScoresBtn'
            })
        };
    };

    const downloadFile = (blob, filename = `成绩单_${Date.now()}.xlsx`) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getBasePath = () => {
        const currentPath = window.location.pathname;
        const cjcxIndex = currentPath.indexOf('/cjcx/');
        if (cjcxIndex !== -1) return currentPath.substring(0, cjcxIndex);
        const lastSlashIndex = currentPath.lastIndexOf('/');
        if (lastSlashIndex !== -1) return currentPath.substring(0, lastSlashIndex);
        return '/jwglxt';
    };

    const getStudentId = () => {
        const sessionUserKey_element = document.getElementById('sessionUserKey');
        if (sessionUserKey_element && sessionUserKey_element.value) return sessionUserKey_element.value;
        const xh_id_element = document.getElementById('xh_id');
        if (xh_id_element && xh_id_element.value) return xh_id_element.value;
        try {
            let studentId = new URLSearchParams(window.top.location.search).get('su');
            if (studentId) return studentId;
        } catch (e) {}
        try {
            const userElement = window.top.document.querySelector('#sessionUser .media-body span.ng-binding');
            if (userElement && userElement.textContent) {
                const match = userElement.textContent.match(/\d+/);
                if (match) return match[0];
            }
        } catch (e) {}
        return null;
    };

    const fetchGradeComponentData = async (academicYear, semester) => {
        const studentId = getStudentId();
        if (!studentId) throw new Error('无法获取学号信息');
        const url = `${getBasePath()}/cjcx/cjjdcx_cxXsjdxmcjIndex.html?doType=query&gnmkdm=N305099`;
        const formData = new URLSearchParams({
            'xnm': academicYear,
            'xqm': semester,
            'xh': studentId,
            '_search': 'false',
            'nd': Date.now(),
            'queryModel.showCount': '500',
            'queryModel.currentPage': '1',
            'queryModel.sortName': 'kch',
            'queryModel.sortOrder': 'asc',
            'time': '0'
        });
        const response = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"},
            body: formData
        });
        if (!response.ok) throw new Error(`请求失败: ${response.status}`);
        return await response.json();
    };

    const processAndDisplayScores = (items) => {
        if (!items || items.length === 0) {
            $('#score-modal-content').html('<p style="text-align:center; color: green;">没有找到成绩数据</p>');
            return;
        }
        const componentHeaders = new Set();
        items.forEach(item => { if (item.xmblmc) componentHeaders.add(item.xmblmc); });
        const dynamicHeaders = Array.from(componentHeaders).sort();
        const courses = {};
        items.forEach(item => {
            const key = item.jxb_id || `${item.kch}_${item.jxbmc}`;
            if (!courses[key]) {
                courses[key] = {
                    kcmc: item.kcmc,
                    kch: item.kch,
                    xnmmc: item.xnmc,
                    xqmmc: item.xqmc === '3' ? '第一学期' : (item.xqmc === '12' ? '第二学期' : `第${item.xqmc}学期`),
                    jxbmc: item.jxbmc,
                    xmcj: item.xmcj,
                    components: {}
                };
            }
            courses[key].components[item.xmblmc] = item.xmcj;
        });
        let tableHTML = `<table class="result-table"><thead><tr><th>序号</th><th class="sortable-header" data-sort-key="kcmc">课程名称</th><th class="sortable-header" data-sort-key="xnmmc">学年</th><th class="sortable-header" data-sort-key="xqmmc">学期</th><th class="sortable-header" data-sort-key="kch">课程代码</th><th class="sortable-header" data-sort-key="jxbmc">教学班</th><th class="sortable-header" data-sort-key="xmcj">总成绩</th>`;
        dynamicHeaders.forEach(header => { tableHTML += `<th class="sortable-header" data-sort-key="${header}">${header}</th>`; });
        tableHTML += `</tr></thead><tbody>`;
        let index = 1;
        Object.values(courses).forEach(course => {
            tableHTML += `<tr><td>${index++}</td><td class="col-course-name">${course.kcmc}</td><td>${course.xnmmc}</td><td>${course.xqmmc}</td><td>${course.kch}</td><td>${course.jxbmc}</td><td>${course.xmcj}</td>`;
            dynamicHeaders.forEach(header => { tableHTML += `<td>${course.components[header] || '—'}</td>`; });
            tableHTML += `</tr>`;
        });
        tableHTML += `</tbody></table>`;
        $('#score-modal-content').html(tableHTML);
        $('.sortable-header').click(function() {
            const sortKey = $(this).data('sort-key');
            const $table = $(this).closest('table');
            const $rows = $table.find('tbody > tr').get();
            const isAsc = $(this).hasClass('sort-asc');
            $(this).closest('tr').find('.sort-asc, .sort-desc').removeClass('sort-asc sort-desc');
            $(this).toggleClass('sort-asc', !isAsc).toggleClass('sort-desc', isAsc);
            $rows.sort((a, b) => {
                const columnIndex = $(this).index();
                const aVal = $(a).find(`td:eq(${columnIndex})`).text().trim();
                const bVal = $(b).find(`td:eq(${columnIndex})`).text().trim();
                if (!isNaN(aVal) && !isNaN(bVal) && aVal !== '—' && bVal !== '—') {
                    return isAsc ? parseFloat(aVal) - parseFloat(bVal) : parseFloat(bVal) - parseFloat(aVal);
                }
                return isAsc ? aVal.localeCompare(bVal, 'zh') : bVal.localeCompare(aVal, 'zh');
            });
            $.each($rows, (index, row) => { $table.find('tbody').append(row); });
        });
    };

    const handleQuery = async () => {
        try {
            const xnm = document.getElementById('xnm').value;
            const xqm = document.getElementById('xqm').value;
            if (!xnm || !xqm) throw new Error('请先选择学年和学期');
            openScoreModal();
            $('#score-modal-content').html(`<div id="loading-spinner"></div><p style="text-align:center;">正在查询成绩数据，请稍候...</p>`);
            const response = await fetchGradeComponentData(xnm, xqm);
            if (response && response.items) processAndDisplayScores(response.items);
            else $('#score-modal-content').html('<p style="text-align:center; color: green;">没有找到成绩数据</p>');
        } catch (error) {
            console.error('查询操作失败:', error);
            $('#score-modal-content').html(`<p style="color:red; text-align:center;">查询失败: ${error.message}</p><button class="btn btn-primary" style="display:block; margin: 10px auto;" onclick="location.reload()">刷新重试</button>`);
        }
    };

    const handleExport = async () => {
        try {
            const xnm = document.getElementById('xnm').value;
            const xqm = document.getElementById('xqm').value;
            if (!xnm || !xqm) throw new Error('请先选择学年和学期');
            const params = new URLSearchParams([
                ['gnmkdmKey', 'N305005'],
                ['xnm', xnm],
                ['xqm', xqm],
                ['dcclbh', 'JW_N305005_GLY'],
                ...['kcmc@课程名称','xnmmc@学年','xqmmc@学期','kkbmmc@开课学院','kch@课程代码','jxbmc@教学班','xf@学分','xmcj@成绩','xmblmc@成绩分项'].map(col => ['exportModel.selectCol', col]),
                ['exportModel.exportWjgs', 'xls'],
                ['fileName', '成绩单']
            ]);
            const targetUrl = `${getBasePath()}/cjcx/cjcx_dcXsKccjList.html`;
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: params
            });
            if (!response.ok) throw new Error(`服务器返回异常状态码: ${response.status}`);
            const blob = await response.blob();
            downloadFile(blob);
            const btn = document.getElementById('exportAllScoresBtn');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = ' 导出成功';
                btn.style.backgroundColor = '#218838';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                }, 2000);
            }
        } catch (error) {
            console.error('导出操作失败:', error);
            const btn = document.getElementById('exportAllScoresBtn');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = ' 导出失败';
                btn.style.backgroundColor = '#dc3545';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                }, 2000);
            }
            alert(`导出失败: ${error.message}`);
        }
    };

    const init = () => {
        $('#queryScoresBtn, #exportAllScoresBtn').remove();
        createScoreModal();
        const buttons = createButtons();
        buttons.$queryButton.click(handleQuery);
        buttons.$downloadButton.click(handleExport);
        const $searchButton = $('#search_go');
        if ($searchButton.length) $searchButton.after(buttons.$downloadButton).after(buttons.$queryButton);
        else if ($('.panel-info:has(.panel-body)').length) $('.panel-info:has(.panel-body)').find('.panel-body').append(buttons.$queryButton).append(buttons.$downloadButton);
        else if ($('form:has(#xnm)').length) $('form:has(#xnm)').append(buttons.$queryButton).append(buttons.$downloadButton);
        else $('body').prepend(buttons.$queryButton).prepend(buttons.$downloadButton);
    };

    const checkDOM = () => {
        if ($('#xnm, #xqm').length >= 2) init();
        else setTimeout(checkDOM, 500);
    };

    setTimeout(checkDOM, 1000);
    $(document).ajaxStop(function() {
        if (!$('#queryScoresBtn').length) setTimeout(init, 500);
    });
})();