// ==UserScript==
// @name         方正教务系统成绩明细下载
// @namespace    ikaikail@ikaikail.com
// @version      5.7
// @description  期末成绩不理想？担心被穿小鞋？不用怕！这款脚本让你期末成绩和平时成绩一目了然！支持VPN环境！直接显示Excel格式成绩单！
// @author       iKaiKail
// @match        *://*/jwglxt/cjcx/*
// @match        https://*/*
// @match        http://*/*
// @match        file:///*
// @include      *:/*/cjcx/*
// @icon         https://www.zfsoft.com/img/zf.ico
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/524383/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%88%90%E7%BB%A9%E6%98%8E%E7%BB%86%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/524383/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%88%90%E7%BB%A9%E6%98%8E%E7%BB%86%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .score-action-btn {
            background-color: #337ab7 !important;
            color: white !important;
            border: none !important;
        }
        .score-action-btn:hover {
            background-color: #286090 !important;
        }
        #exportAllScoresBtn {
            margin-left: 12px;
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

    // ================== 核心函数定义 ==================

    // 创建按钮
    const createButtons = () => {
        return {
            $downloadButton: $('<button>', {
                type: 'button',
                class: 'btn btn-primary btn-sm',
                text: '导出成绩明细',
                id: 'exportAllScoresBtn'
            })
        };
    };

    // 下载文件
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

    // 获取基础路径
    const getBasePath = () => {
        const currentPath = window.location.pathname;
        const cjcxIndex = currentPath.indexOf('/cjcx/');
        if (cjcxIndex !== -1) return currentPath.substring(0, cjcxIndex);
        const lastSlashIndex = currentPath.lastIndexOf('/');
        if (lastSlashIndex !== -1) return currentPath.substring(0, lastSlashIndex);
        return '/jwglxt';
    };

    // 处理导出
    const handleExport = async () => {
        try {
            const xnm = document.getElementById('xnm').value;
            const xqm = document.getElementById('xqm').value;
            if (!xnm || !xqm) throw new Error('请先选择学年和学期');
            const params = new URLSearchParams([
                ['gnmkdmKey', 'N305005'],
                ['xnm', xnm],
                ['xqm', xqm],
                ['dcclbh', 'JW_N305005_XS'],
                ...['kcmc@课程名称','xnmmc@学年','xqmmc@学期','kkbmmc@开课学院','kch@课程代码','jxbmc@教学班','xf@学分','xmcj@成绩','xmblmc@成绩分项'].map(col => ['exportModel.selectCol', col]),
                ['exportModel.exportWjgs', 'xls'],
                ['fileName', '成绩单']
            ]);
            const targetUrl = `${getBasePath()}/cjcx/cjcx_dcXsKccjList.html`;
            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: params,
                credentials: 'include'
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

    // 初始化
    const init = () => {
        // 移除旧按钮
        $('#queryScoresBtn, #exportAllScoresBtn').remove();

        // 创建按钮
        const buttons = createButtons();
        buttons.$downloadButton.click(handleExport);

        // 将按钮添加到页面
        const $searchButton = $('#search_go');
        if ($searchButton.length) {
            $searchButton.after(buttons.$downloadButton);
        } else {
            const $panelBody = $('.panel-info:has(.panel-body)');
            if ($panelBody.length) $panelBody.find('.panel-body').append(buttons.$downloadButton);
            else if ($('form:has(#xnm)').length) $('form:has(#xnm)').append(buttons.$downloadButton);
            else $('body').prepend(buttons.$downloadButton);
        }
    };

    // 检查DOM是否就绪
    const checkDOM = () => {
        if ($('#xnm, #xqm').length >= 2) {
            init();
        } else {
            setTimeout(checkDOM, 500);
        }
    };

    // 页面加载完成后启动
    $(document).ready(function() {
        checkDOM();
    });
})();
