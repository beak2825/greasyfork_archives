// ==UserScript==
// @name         NOI 表格下载器（CSV）- 优化版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       YungVenuz
// @license      AGPL-3.0-or-later
// @description  在 NOI 相关网站的表格页面右上角添加一个“下载CSV”按钮，方便地将网页表格导出为 CSV 文件，兼容 Excel 打开。
// @match        *.noi.cn/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540736/NOI%20%E8%A1%A8%E6%A0%BC%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88CSV%EF%BC%89-%20%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/540736/NOI%20%E8%A1%A8%E6%A0%BC%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88CSV%EF%BC%89-%20%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 当文档加载完成后，执行初始化操作。
     * 这是脚本的入口点。
     */
    $(document).ready(function () {
        // 创建一个下载按钮，并设置其样式
        const $btn = $('<button>📥 下载CSV</button>').css({
            'position': 'fixed',        // 固定定位，不随页面滚动
            'top': '10px',              // 距离顶部 10px
            'right': '10px',            // 距离右侧 10px
            'z-index': 9999,            // 设置一个较高的层级，确保按钮在最上层
            'padding': '8px 16px',      // 内边距
            'background-color': '#007bff',// 按钮背景色 (Bootstrap 蓝色)
            'color': '#fff',            // 文字颜色
            'border': 'none',           // 无边框
            'border-radius': '5px',     // 圆角
            'cursor': 'pointer',        // 鼠标悬停时显示手型光标
            'font-size': '14px',        // 字体大小
            'font-weight': 'bold',      // 字体加粗
            'box-shadow': '0 2px 5px rgba(0,0,0,0.2)', // 添加细微阴影，增加立体感
            'transition': 'background-color 0.3s ease' // 为背景色变化添加平滑过渡效果
        });

        // 添加鼠标悬停效果
        $btn.hover(
            function() { // 鼠标进入
                $(this).css('background-color', '#0056b3'); // 悬停时加深背景色
            },
            function() { // 鼠标离开
                $(this).css('background-color', '#007bff'); // 恢复原始背景色
            }
        );

        // 为按钮绑定点击事件
        $btn.click(function () {
            downloadCSV(); // 点击时调用下载函数
        });

        // 将按钮添加到页面中
        $('body').append($btn);
    });

    /**
     * 从页面表格的标题行中提取文本，作为下载的文件名。
     * @returns {string} 清理和格式化后的文件名。
     */
    function getFileName() {
        // 尝试查找具有 colspan="8" 属性的单元格，这通常是 NOI 网站表格的标题
        const titleCell = $('td[colspan="8"]').first();

        if (titleCell.length) {
            // 如果找到了标题单元格
            let title = titleCell.text().trim(); // 获取文本并去除首尾空格
            title = title.replace(/\s+/g, ''); // 移除标题内所有空白字符
            title = title.replace(/[\/\\?%*:|"<>]/g, ''); // 移除文件名中的非法字符

            // 确保文件名以 .csv 结尾
            if (!title.endsWith('.csv')) {
                title += '.csv';
            }
            return title;
        }

        // 如果没有找到特定的标题行，返回一个默认的文件名
        return '表格数据.csv';
    }

    /**
     * 遍历页面中的表格，并将其内容转换为 CSV 格式的字符串。
     * @returns {string} CSV 格式的字符串。
     */
    function tableToCSV() {
        const csvRows = [];
        // 选取 tbody 中的所有 tr 元素，这些通常是数据行
        const $rows = $('tbody tr');

        $rows.each(function(index) {
            const rowData = [];

            // 如果当前行包含合并的单元格（通常是小标题或说明），则跳过该行
            if ($(this).find('td[colspan]').length > 0) {
                return true; // continue
            }

            // 遍历当前行的每个单元格 (td)
            $(this).find('td').each(function(cellIndex) {
                let text = $(this).text().trim(); // 获取单元格文本并清理首尾空格

                // 特殊处理：针对第8列（指导教师列），统一斜杠格式
                if (index > 0 && cellIndex === 7) { // index > 0 确保不是表头
                    text = text.replace(/\s*\/\s*/g, '/');
                }

                // CSV 单元格引用规则：如果文本包含逗号或双引号，
                // 则需要用双引号将整个单元格内容包裹起来，并将内容中的双引号替换为两个双引号。
                if (text.includes(',') || text.includes('"')) {
                    text = '"' + text.replace(/"/g, '""') + '"';
                }
                rowData.push(text);
            });

            // 只有当行中有数据时才添加到结果中
            if (rowData.length > 0) {
                csvRows.push(rowData.join(','));
            }
        });

        // 使用换行符将所有行连接成一个完整的 CSV 字符串
        return csvRows.join('\n');
    }

    /**
     * 生成 CSV 内容并触发浏览器下载。
     */
    function downloadCSV() {
        const csvContent = tableToCSV(); // 获取表格转换后的 CSV 数据
        const fileName = getFileName();   // 获取动态生成的文件名

        // 添加 BOM (Byte Order Mark) 头，确保 UTF-8 编码的 CSV 文件能被 Excel 正确识别，避免中文乱码
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        // 创建一个隐藏的 a 标签来触发下载
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';

        // 将链接添加到 DOM，模拟点击，然后移除
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})();
