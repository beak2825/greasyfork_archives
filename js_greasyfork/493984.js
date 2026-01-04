// ==UserScript==
// @name        TM Export League Table Copy to Clipboard
// @namespace   
// @match       https://trophymanager.com/league/
// @grant       none
// @version     1.0.2024050605
// @author      太原龙城足球俱乐部
// @description 导出联赛信息复制到剪切板。
// @downloadURL https://update.greasyfork.org/scripts/493984/TM%20Export%20League%20Table%20Copy%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/493984/TM%20Export%20League%20Table%20Copy%20to%20Clipboard.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 添加导出按钮
    $("#overall_table").parent().parent().parent().append("<button id='copyTable'>复制表格到剪切板</button>");

    $('#copyTable').click(function() {
        let data = [];
        let titles = [];

        // 获取表头
        $('#overall_table th').each(function() {
            titles.push($(this).text().trim());
        });

        // 获取数据
        $('#overall_table tbody tr').each(function() {
            let rowData = [];
            $(this).find('td').each(function() {
                rowData.push($(this).text().trim());
            });
            data.push(rowData);
        });

        // 将数据转换为TSV字符串
        let TSVString = prepTSVString(titles, data);

        // 将TSV字符串复制到剪切板
        navigator.clipboard.writeText(TSVString).then(() => {
            alert('联赛结果已复制，粘贴到Excel表格中即可，记得选择“匹配原格式”选项。');
        }, () => {
            console.error('无法复制到剪切板，请检查浏览器权限设置。');
        });
    });

    // 准备TSV字符串
    function prepTSVString(titles, dataRows) {
        let TSVString = prepTSVRow(titles) + '\n';
        dataRows.forEach(function(row) {
            TSVString += prepTSVRow(row) + '\n';
        });
        return TSVString;
    }

    // 准备单行的TSV字符串
    function prepTSVRow(arr) {
        return arr.join('\t');
    }
})();