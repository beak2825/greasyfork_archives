// ==UserScript==
// @name         谷歌学术快速导出助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学术快速导出助手是一款专为学者、研究人员和学生设计的浏览器油猴脚本，它能够极大地简化您在使用谷歌学术（Google Scholar）进行文献检索时的引用和文献管理工作。该脚本提供了一种快速、高效的方式，让您可以在浏览学术论文时，一键导出所需的引用数据。
// @author       jishuliu620@gmail.com
// @match        https://scholar.google.com/*
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485317/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E5%BF%AB%E9%80%9F%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/485317/%E8%B0%B7%E6%AD%8C%E5%AD%A6%E6%9C%AF%E5%BF%AB%E9%80%9F%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 添加CSS样式到页面中
    GM_addStyle(`
        .alert-bar {
            display: none;
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px;
            border-radius: 3px;
            color: white;
            z-index: 10000;
            transition: all 0.5s ease;
            box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.2);
            pointer-events: none; /* Avoid blocking clicks */
        }
        .alert-success { background-color: #4CAF50; }
        .alert-error { background-color: #f44336; }
        .alert-warning { background-color: #ff9800; }
        #dataViewerModal {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 80%;
            height: 80%;
            transform: translate(-50%, -50%);
            background-color: white;
            z-index: 10000;
            border: 1px solid #ccc;
            box-shadow: 0 5px 15px rgba(0,0,0,.5);
            padding: 20px;
            overflow: auto;
            display: none;
        }
        #dataViewerModal table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }
        #dataViewerModal table, #dataViewerModal th, #dataViewerModal td {
            border: 1px solid black;
        }
        #dataViewerModal th, #dataViewerModal td {
            padding: 10px;
            text-align: left;
        }
      #closeButton {
        cursor: pointer;
        padding: 5px 10px;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin: 4px 2px;
        transition-duration: 0.4s;
    }

    #closeButton:hover {
        background-color: white;
        color: #f44336;
        border: 1px solid #f44336;
    }

    `);

    // 创建提示条的函数
    function createAlertBar() {
        const alertBar = document.createElement('div');
        alertBar.id = 'alert-bar';
        document.body.appendChild(alertBar);
        return alertBar;
    }

    // 根据类型获取类名
    function getTypeClass(type) {
        const types = {
            'success': 'alert-success',
            'error': 'alert-error',
            'warning': 'alert-warning'
        };
        return types[type] || 'alert-success';
    }

    // 显示提示条的函数
    window.showAlert = function(message, type, duration) {
        let alertBar = document.getElementById('alert-bar') || createAlertBar();

        // 设置提示信息并显示提示条
        alertBar.textContent = message;
        alertBar.className = `alert-bar ${getTypeClass(type)}`; // 设置类名
        alertBar.style.display = 'block';

        // 设置定时器，在duration毫秒后隐藏提示条
        setTimeout(() => {
            alertBar.style.display = 'none';
        }, duration);
    };

        // 创建弹窗和表格
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'dataViewerModal';

        const searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.placeholder = 'Search...';
        searchBox.addEventListener('input', filterTable);

        const table = document.createElement('table');
        table.id = 'dataViewerTable';
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        tbody.id = 'dataViewerTbody';

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download';
        downloadButton.style.marginLeft = '20px';
        downloadButton.style.Background = 'green';
        downloadButton.addEventListener('click', (event) => {
            downloadJSON();
        });

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        downloadButton.style.Background = 'red';
        clearButton.style.marginLeft = '20px';
        clearButton.addEventListener('click', (event) => {
            localStorage.removeItem('all_pages_data');
            window.showAlert(`数据清空成功！`, 'success',5000);
            closeModal();
        });

        const contactMeButton = document.createElement('button');
        contactMeButton.textContent = 'ContactMe';
        contactMeButton.style.marginLeft = '20px';
        contactMeButton.style.Background = 'green';
        contactMeButton.addEventListener('click', (event) => {
            alert("Email: jishuliu620@gmail.com \nWechat: jishuliu620")
        });

        const closeButton = document.createElement('button');
        closeButton.id = 'closeButton';
        closeButton.textContent = 'Close';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.addEventListener('click', closeModal);


        table.appendChild(thead);
        table.appendChild(tbody);
        modal.appendChild(searchBox);
        modal.appendChild(downloadButton);
        modal.appendChild(clearButton);
        modal.appendChild(contactMeButton);
        modal.appendChild(table);
        modal.appendChild(closeButton);


        document.body.appendChild(modal);
    }
    // 筛选表格
    function filterTable(event) {
        const filter = event.target.value.toLowerCase();
        const rows = document.querySelectorAll('#dataViewerTbody tr');

        rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            const matches = Array.from(cells).some(td => td.textContent.toLowerCase().includes(filter));
            row.style.display = matches ? '' : 'none';
        });
    }

    // 填充表格数据
    function populateTable(keysToExclude=['id']) {
        // 获取数据并解析为JSON
        const data = JSON.parse(localStorage.getItem('all_pages_data') || '[]');
        const table = document.getElementById('dataViewerTable');
        const thead = table.createTHead();
        // 如果表头已存在，则清空以重新生成
        thead.innerHTML = '';

        if (data.length > 0) {
            const headerRow = thead.insertRow(); // 在thead中插入一行
            // 确定要包含的键
            let keysToInclude = Object.keys(data[0]).filter(key => !keysToExclude.includes(key));
            // 创建表头
            keysToInclude.forEach(key => {
                const th = document.createElement('th');
                th.textContent = key; // 填充表头标题
                headerRow.appendChild(th);
            });
        }

        const tbody = document.getElementById('dataViewerTbody');
        tbody.innerHTML = ''; // 清空现有数据

        // 遍历数据，创建表格行，排除指定的键
        data.forEach(item => {
            const tr = document.createElement('tr');
            let keysToInclude = Object.keys(item).filter(key => !keysToExclude.includes(key));
            keysToInclude.forEach(key => {
                const td = document.createElement('td');
                td.textContent = item[key] || ''; // 使用空字符串作为默认值
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    }


    // 显示弹窗
    function showModal() {
        populateTable();
        document.getElementById('dataViewerModal').style.display = 'block';
    }
    // 关闭弹窗
    function closeModal() {
        // 关闭模态框
        document.getElementById('dataViewerModal').style.display = 'none';

        // 获取表格
        const table = document.getElementById('dataViewerTable');

        // 如果表格存在，清除其内部的所有行
        if (table) {
            // table.rows 是一个包含表格行的 HTMLCollection
            // 从末尾开始移除，直到只剩下表头行
            while (table.rows.length > 1) {
                table.deleteRow(-1); // -1 表示删除最后一行
            }
        }
    }


    function extractText(str, pattern=/\d+/g, default_value=0) {
        // 使用正则表达式匹配所有数字
        const matches = str.match(pattern);
        // 如果没有匹配到任何数字，返回一个空数组
        if (!matches) {
            return [0, default_value];
        }
        // 将匹配到的结果转换为数字数组
        return matches;
    }

    function findTextInTag(selector, tagName, searchText, defaultValue, callback) {
        // 获取指定选择器的元素
        const elements = selector.querySelectorAll(tagName);
        for (const element of elements) {
            if (element.textContent.includes(searchText)) {
                return callback(element.textContent); // 返回找到的第一个匹配的标签
            }
        }
        return defaultValue; // 如果没有找到匹配的标签，返回默认值
    }
    function generateFilename(){
        const date = new Date();

        // 获取年份、月份、日期、小时、分钟、秒
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // 构建文件名
        const jsonFileName = `data_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.json`;

        return jsonFileName;
    }

    // 你的数据提取规则函数
    function extractData() {
        // 假设我们提取页面中的所有段落文本
        var keyword = document.querySelector('.gs_in_txt.gs_in_ac').value;
        const tagList = document.querySelectorAll('.gs_r.gs_or.gs_scl');
        let regex = /第\s*(\d+)\s*页/;
        var search_text = document.querySelector('#gs_ab_md').textContent;
        var page = Number(extractText(search_text, regex,1)[1]);
        var data_list = []
        for (var tag of tagList) {
            // 获取自定义属性data-cid和data-rp
            var id = tag.getAttribute('data-cid');
            var pos = tag.getAttribute('data-rp');

            // 尝试寻找包含被引用信息的标签
            var citations = Number(findTextInTag(tag, 'a', '被引用', 0, extractText)[0]) || 0; // 如果找不到，默认为0

            // 检查title_tag是否存在，如果不存在则设置默认值
            const title_tag = tag.querySelector('.gs_rt > a');
            var title = title_tag ? title_tag.textContent : '标题不可用';
            var href = title_tag ? title_tag.href : '#';

            // 获取作者、出版年份等信息
            var content = tag.querySelector('.gs_a').textContent;
            var yearMatch = extractText(content, /\b(19|20)\d{2}\b/g,"Nan");
            var year = yearMatch.length > 0 ? yearMatch[0] : '年份不可用';
            var author = content.split('-')[0].trim() || '作者不可用';

            // 创建数据对象
            var data = {
                id: id || 'ID不可用', // 如果id不存在，设置默认值
                pos: pos || '位置不可用', // 如果pos不存在，设置默认值
                author: author,
                year: year,
                citations: citations,
                title: title,
                href: href,
                page: page, // 我假设您可能还想保存完整的内容
                keyword: keyword
            };

            // 将数据对象添加到列表中
            data_list.push(data);
        }
        var existingData = JSON.parse(localStorage.getItem('all_pages_data')) || [];
        // 记录新数据列表的长度
        var totalNewDataCount = data_list.length;

        // 过滤出不包含在现有数据中的新数据项
        var newData = data_list.filter(item => !existingData.some(existingItem => existingItem.id === item.id));

        // 计算成功添加的新数据条目数量
        var successfulAdds = newData.length;

        // 计算重复的数据条目数量
        var duplicates = totalNewDataCount - successfulAdds;

        // 将新数据添加到现有数据中
        existingData = existingData.concat(newData);

        // 将更新后的数据保存回localStorage
        localStorage.setItem('all_pages_data', JSON.stringify(existingData));

        // 显示成功添加和重复条目的数量
        window.showAlert(`${duplicates}条数据重复，成功添加${successfulAdds}条新数据。关键词${keyword}, 第${page}页获取成功！`, 'success', 5000);
    }
    // 翻页函数
    function goToNextPage() {
        // 找到翻页按钮并点击，这里的选择器需要根据实际页面进行调整
        const nextPageButton = document.querySelector('a.pagination__next');
        nextPageButton.click();
    }

    // 下载数据的函数
    function downloadJSON() {
        // 将JSON数据转换为字符串
        const jsonString = localStorage.getItem('all_pages_data') || [];
        // 创建一个Blob对象，并设置其类型为application/json
        const blob = new Blob([jsonString], { type: 'application/json' });
        // 创建一个指向该Blob的URL
        const url = URL.createObjectURL(blob);
        // 创建一个临时的a标签用于下载
        const downLink = document.createElement('a');
        downLink.download = generateFilename();
        downLink.href = url;
        // 将链接插入到页面
        document.body.appendChild(downLink);
        // 触发点击事件
        downLink.click();
        // 移除下载链接并释放blob URL
        setTimeout(() => {
            document.body.removeChild(downLink);
            URL.revokeObjectURL(url);
        }, 100);
    }


    // 等待元素加载的函数
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }


    function insertMenu(targetElement) {
        // 创建菜单容器
        const menuContainer = document.createElement('div');
        menuContainer.id = 'my-custom-menu';
        menuContainer.style.position = 'absolute';
        menuContainer.style.top = '0';
        menuContainer.style.height = '40px';
        menuContainer.style.right = '-300px'; // 根据需要调整位置
        menuContainer.style.display = 'flex'; // 使用flex布局
        menuContainer.style.alignItems = 'center'; // 靠左对齐
        menuContainer.style.justifyContent = 'center';
        menuContainer.style.gap = '10px'; // 按钮之间的间距

        // 创建第一个按钮
        const dataButton = document.createElement('button');
        dataButton.textContent = '获取引用数据';
        dataButton.id = 'data-button';
        // 为第一个按钮添加点击事件
        dataButton.addEventListener('click', function() {
            event.preventDefault();
            extractData();
            // 在这里添加更多你的代码
        });
        const buttonOne = document.createElement('button');
        buttonOne.textContent = '展示数据';
        buttonOne.id = 'show-button';
        // 为第一个按钮添加点击事件
        buttonOne.addEventListener('click', function() {
            event.preventDefault();
            showModal();
            // 在这里添加更多你的代码
        });

        // 将按钮添加到菜单容器中
        menuContainer.appendChild(dataButton);
        menuContainer.appendChild(buttonOne);
        // 插入菜单容器到目标元素旁边
        targetElement.parentNode.insertBefore(menuContainer, targetElement.nextSibling);
    }
    // 初始化函数
    function init() {
        waitForElement('#gs_hdr_tsb', insertMenu);
        createModal();
        // 如果需要自动翻页，去掉下一行注释
        // setInterval(goToNextPage, 5000); // 每5秒尝试翻页
    }

    // 运行初始化
    init();
})();