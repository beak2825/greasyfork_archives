// ==UserScript==
// @name         Export Patent Info
// @namespace    http://your.site.com
// @version      0.6
// @description  Export patent information to Excel format with enhanced debugging
// @author       Your Name
// @match        *://*.cpquery.cponline.cnipa.gov.cn/chinesepatent/index
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/489322/Export%20Patent%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/489322/Export%20Patent%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建导出按钮
    const exportButton = document.createElement('button');
    exportButton.textContent = '导出专利信息';
    exportButton.style.position = 'fixed';
    exportButton.style.top = '120px';
    exportButton.style.right = '20px';
    exportButton.style.zIndex = '9999';
    exportButton.style.padding = '10px 20px';
    exportButton.style.fontSize = '16px';
    exportButton.style.backgroundColor = '#3498db';
    exportButton.style.color = 'white';
    exportButton.style.border = 'none';
    exportButton.style.borderRadius = '5px';
    exportButton.style.boxShadow = '2px 2px 8px rgba(0,0,0,0.2)';
    exportButton.style.cursor = 'pointer';
    exportButton.addEventListener('click', exportPatentInfo);
    document.body.appendChild(exportButton);

    // 创建调试按钮
    const debugButton = document.createElement('button');
    debugButton.textContent = '导出Span调试信息';
    debugButton.style.position = 'fixed';
    debugButton.style.top = '170px';
    debugButton.style.right = '20px';
    debugButton.style.zIndex = '9999';
    debugButton.style.padding = '10px 20px';
    debugButton.style.fontSize = '16px';
    debugButton.style.backgroundColor = '#e74c3c';
    debugButton.style.color = 'white';
    debugButton.style.border = 'none';
    debugButton.style.borderRadius = '5px';
    debugButton.style.boxShadow = '2px 2px 8px rgba(0,0,0,0.2)';
    debugButton.style.cursor = 'pointer';
    debugButton.addEventListener('click', exportDebugInfo);
    document.body.appendChild(debugButton);

    // 创建调试面板
    const debugPanel = document.createElement('div');
    debugPanel.style.position = 'fixed';
    debugPanel.style.top = '220px';
    debugPanel.style.right = '20px';
    debugPanel.style.zIndex = '9998';
    debugPanel.style.width = '400px';
    debugPanel.style.maxHeight = '400px';
    debugPanel.style.backgroundColor = '#f8f9fa';
    debugPanel.style.border = '1px solid #ddd';
    debugPanel.style.borderRadius = '5px';
    debugPanel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    debugPanel.style.overflow = 'auto';
    debugPanel.style.padding = '15px';
    debugPanel.style.display = 'none';

    const debugHeader = document.createElement('div');
    debugHeader.textContent = 'Span元素调试信息';
    debugHeader.style.fontSize = '18px';
    debugHeader.style.fontWeight = 'bold';
    debugHeader.style.color = '#e74c3c';
    debugHeader.style.marginBottom = '10px';
    debugHeader.style.paddingBottom = '5px';
    debugHeader.style.borderBottom = '2px solid #eaecef';
    debugPanel.appendChild(debugHeader);

    const debugContent = document.createElement('div');
    debugContent.id = 'tmDebugContent';
    debugContent.style.fontFamily = 'Consolas, Courier New, monospace';
    debugContent.style.fontSize = '14px';
    debugContent.style.lineHeight = '1.5';
    debugPanel.appendChild(debugContent);
    document.body.appendChild(debugPanel);

    // 切换调试面板显示
    debugButton.addEventListener('mouseover', function() {
        debugPanel.style.display = 'block';
        updateDebugInfo();
    });

    debugButton.addEventListener('mouseout', function() {
        debugPanel.style.display = 'none';
    });

    // 导出专利信息
    function exportPatentInfo() {
        let patentsData = [];

        document.querySelectorAll('.table_info').forEach(function(patent) {
            const spans = patent.querySelectorAll('span');
            let Application_OR_Patent_Number = 'CN' + patent.querySelector('.hover_active').textContent.trim();
            Application_OR_Patent_Number = Application_OR_Patent_Number.slice(0, -1) + '.' + Application_OR_Patent_Number.slice(-1);
            const title = patent.querySelector('span span').textContent.trim();

            // 使用调试信息来确定正确的索引
            let Applicant = spans[6].textContent.trim().replace("申请人：", "");
            let PatentType = spans[8].textContent.trim().replace("专利类型：", "");
            let ApplicationDate = spans[10].textContent.trim().replace("申请日：", "");
            let AuthorizationAnnouncementNumber = spans[14].textContent.trim().replace("授权公告号：", "");
            let legalStatus = spans[16].textContent.trim().replace("案件状态：", "");
            let CaseStatus = spans[18].textContent.trim().replace("授权公告日：", "");
            let AuthorizationAnnouncementDate = spans[20].textContent.trim().replace("主分类号：", "");

            patentsData.push({
                '申请号': Application_OR_Patent_Number,
                '发明名称': title,
                '申请（专利权）人': Applicant,
                '专利类型': PatentType,
                '申请日': ApplicationDate,
                '授权公告号': AuthorizationAnnouncementNumber,
                '案件状态': legalStatus,
                '授权公告日': CaseStatus,
                '主分类号': AuthorizationAnnouncementDate
            });
        });

        if (patentsData.length > 0) {
            exportToExcel(patentsData);
        } else {
            alert('没有可导出的专利信息！');
        }
    }

    // 更新调试信息
    function updateDebugInfo() {
        const debugContent = document.getElementById('tmDebugContent');
        debugContent.innerHTML = '';

        document.querySelectorAll('.table_info').forEach(function(patent, index) {
            const patentHeader = document.createElement('div');
            patentHeader.textContent = `专利 ${index + 1} 的Span元素:`;
            patentHeader.style.fontWeight = 'bold';
            patentHeader.style.margin = '10px 0 5px';
            patentHeader.style.color = '#2c3e50';
            debugContent.appendChild(patentHeader);

            const spans = patent.querySelectorAll('span');
            spans.forEach((span, i) => {
                const spanItem = document.createElement('div');
                spanItem.style.display = 'flex';
                spanItem.style.marginBottom = '5px';
                spanItem.style.padding = '5px';
                spanItem.style.backgroundColor = i % 2 === 0 ? '#f8f9fa' : '#ffffff';

                const indexSpan = document.createElement('span');
                indexSpan.textContent = `${i}:`;
                indexSpan.style.fontWeight = 'bold';
                indexSpan.style.minWidth = '40px';
                indexSpan.style.color = '#3498db';
                spanItem.appendChild(indexSpan);

                const contentSpan = document.createElement('span');
                contentSpan.textContent = span.textContent.trim();
                contentSpan.style.flex = '1';
                contentSpan.style.wordBreak = 'break-word';
                spanItem.appendChild(contentSpan);

                debugContent.appendChild(spanItem);
            });
        });
    }

    // 导出调试信息
    function exportDebugInfo() {
        let debugData = [];

        document.querySelectorAll('.table_info').forEach(function(patent) {
            const spans = patent.querySelectorAll('span');
            spans.forEach((span, index) => {
                debugData.push({
                    index: index,
                    content: span.textContent.trim()
                });
            });
        });

        if (debugData.length > 0) {
            let textContent = "Span元素调试信息\n\n";
            textContent += "索引\t内容\n";
            textContent += "--------------------------------\n";

            debugData.forEach(item => {
                textContent += `${item.index}\t${item.content}\n`;
            });

            const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'span_debug_info.txt';
            a.click();
        } else {
            alert('没有找到Span元素！');
        }
    }

    // 导出数据到 Excel 表格 (使用 SheetJS)
    function exportToExcel(data) {
        // 创建工作簿
        const wb = XLSX.utils.book_new();

        // 将数据转换为工作表
        const ws = XLSX.utils.json_to_sheet(data);

        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(wb, ws, "专利信息");

        // 生成Excel文件并下载
        XLSX.writeFile(wb, 'patent_info.xlsx');
    }
})();