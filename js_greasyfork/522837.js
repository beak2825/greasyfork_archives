// ==UserScript==
// @name         浮动上传按钮（支持Excel解析和JSON导出，并附带帮助函数）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在任意网站添加一个可移动的上传按钮，支持上传并解析Excel文件，以及将JSON数据保存为Excel文件，并提供帮助函数
// @author       你的名字
// @match        *://*/*
// @license      MIT
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/522837/%E6%B5%AE%E5%8A%A8%E4%B8%8A%E4%BC%A0%E6%8C%89%E9%92%AE%EF%BC%88%E6%94%AF%E6%8C%81Excel%E8%A7%A3%E6%9E%90%E5%92%8CJSON%E5%AF%BC%E5%87%BA%EF%BC%8C%E5%B9%B6%E9%99%84%E5%B8%A6%E5%B8%AE%E5%8A%A9%E5%87%BD%E6%95%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/522837/%E6%B5%AE%E5%8A%A8%E4%B8%8A%E4%BC%A0%E6%8C%89%E9%92%AE%EF%BC%88%E6%94%AF%E6%8C%81Excel%E8%A7%A3%E6%9E%90%E5%92%8CJSON%E5%AF%BC%E5%87%BA%EF%BC%8C%E5%B9%B6%E9%99%84%E5%B8%A6%E5%B8%AE%E5%8A%A9%E5%87%BD%E6%95%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建上传按钮
    const uploadButton = document.createElement('div');
    uploadButton.style.width = '50px';
    uploadButton.style.height = '50px';
    uploadButton.style.backgroundColor = '#FF5722';
    uploadButton.style.position = 'fixed';
    uploadButton.style.right = '20px';
    uploadButton.style.top = '50%';
    uploadButton.style.transform = 'translateY(-50%)';
    uploadButton.style.cursor = 'move';
    uploadButton.style.zIndex = '10000';
    uploadButton.style.display = 'flex';
    uploadButton.style.justifyContent = 'center';
    uploadButton.style.alignItems = 'center';
    uploadButton.style.borderRadius = '8px';
    uploadButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    uploadButton.title = '点击上传Excel文件';

    // 添加上传图标或文字
    uploadButton.innerHTML = '📁';

    document.body.appendChild(uploadButton);

    // 创建隐藏的文件输入
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // 点击按钮触发文件选择
    uploadButton.addEventListener('click', function(e) {
        // 阻止拖动时触发点击事件
        if (e.target === uploadButton) {
            fileInput.click();
        }
    });

    // 文件选择后处理
    fileInput.addEventListener('change', function() {
        const files = fileInput.files;
        if (files.length > 0) {
            const file = files[0];
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();
            const allowedExtensions = ['xlsx', 'xls'];

            if (!allowedExtensions.includes(fileExtension)) {
                console.warn('上传的文件不是Excel文件。');
                // 可选：显示提示信息
                // alert('请上传Excel文件（.xlsx 或 .xls）。');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, {type: 'array'});

                    const jsonData = {};

                    workbook.SheetNames.forEach(function(sheetName) {
                        const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
                        if(roa.length) jsonData[sheetName] = roa;
                    });

                    console.log('解析后的Excel JSON数据:', jsonData);
                } catch (error) {
                    console.error('解析Excel文件时出错:', error);
                }
            };

            reader.onerror = function(error) {
                console.error('读取文件时出错:', error);
            };

            reader.readAsArrayBuffer(file);
        }
        // 清除选择
        fileInput.value = '';
    });

    // 实现拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    uploadButton.addEventListener('mousedown', function(e) {
        isDragging = true;
        const rect = uploadButton.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none'; // 禁止文本选择
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // 限制在视口内
            const maxX = window.innerWidth - uploadButton.offsetWidth;
            const maxY = window.innerHeight - uploadButton.offsetHeight;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            uploadButton.style.left = `${newX}px`;
            uploadButton.style.top = `${newY}px`;
            uploadButton.style.right = 'auto';
            uploadButton.style.transform = 'none';
        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            document.body.style.userSelect = 'auto'; // 恢复文本选择
        }
    });

    // 全局函数：将JSON保存为Excel文件
    window.jsonToExcel = function(jsonData) {
        if (typeof jsonData !== 'object' || jsonData === null) {
            console.error('传入的参数必须是一个有效的JSON对象。');
            return;
        }

        const filename = prompt('请输入要保存的Excel文件名（不需要扩展名）:', 'data');
        if (!filename) {
            console.warn('未输入文件名，操作取消。');
            return;
        }

        const workbook = XLSX.utils.book_new();

        try {
            for (const sheetName in jsonData) {
                if (Object.prototype.hasOwnProperty.call(jsonData, sheetName)) {
                    const sheetData = jsonData[sheetName];
                    let worksheet;

                    // 判断sheetData是数组的数组还是数组的对象
                    if (Array.isArray(sheetData) && sheetData.length > 0 && Array.isArray(sheetData[0])) {
                        // 数组的数组
                        worksheet = XLSX.utils.aoa_to_sheet(sheetData);
                    } else if (Array.isArray(sheetData) && sheetData.length > 0 && typeof sheetData[0] === 'object') {
                        // 数组的对象
                        worksheet = XLSX.utils.json_to_sheet(sheetData);
                    } else {
                        console.warn(`工作表 "${sheetName}" 的数据格式不支持。`);
                        continue;
                    }

                    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
                }
            }

            const wbout = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

            const blob = new Blob([wbout], {type: 'application/octet-stream'});

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${filename}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log(`Excel文件 "${filename}.xlsx" 已生成并下载。`);
        } catch (error) {
            console.error('将JSON保存为Excel时出错:', error);
        }
    };

    // 全局函数：帮助函数，展示使用示例
    window.help = function() {
        console.log('%c=== 浮动上传按钮脚本使用帮助 ===', 'color: green; font-weight: bold;');
        
        console.group('上传Excel文件并查看JSON输出');
        console.log('1. 点击页面右侧中间的 📁 按钮，选择一个Excel文件（.xlsx 或 .xls）。');
        console.log('2. 上传成功后，解析后的JSON数据会输出到控制台。');
        console.log('   示例输出：');
        console.log('%c解析后的Excel JSON数据:', 'color: blue; font-weight: bold;');
        console.log({
            "Sheet1": [
                ["姓名", "年龄", "城市"],
                ["张三", 28, "北京"],
                ["李四", 34, "上海"],
                ["王五", 23, "广州"]
            ],
            "Sheet2": [
                { "产品": "手机", "价格": 5000 },
                { "产品": "电脑", "价格": 8000 },
                { "产品": "平板", "价格": 3000 }
            ]
        });
        console.groupEnd();

        console.group('将JSON对象保存为Excel文件');
        console.log('1. 在控制台中定义一个JSON对象，结构如下：');
        console.log(`const myData = {
    "Sheet1": [
        ["姓名", "年龄", "城市"],
        ["张三", 28, "北京"],
        ["李四", 34, "上海"],
        ["王五", 23, "广州"]
    ],
    "Sheet2": [
        { "产品": "手机", "价格": 5000 },
        { "产品": "电脑", "价格": 8000 },
        { "产品": "平板", "价格": 3000 }
    ]
};`);
        console.log('2. 调用保存函数：');
        console.log('jsonToExcel(myData);');
        console.log('3. 会弹出提示框，输入文件名（不需要扩展名），例如 "我的数据"。');
        console.log('4. 浏览器将自动下载 "我的数据.xlsx" 文件，包含两个工作表 "Sheet1" 和 "Sheet2"。');
        console.groupEnd();

        console.log('%c=== 结束帮助 ===', 'color: green; font-weight: bold;');
    };

})();
