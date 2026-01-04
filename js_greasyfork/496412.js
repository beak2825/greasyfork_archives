// ==UserScript==
// @name         小红书笔记导出
// @namespace    http://www.junxiaopang.com/
// @version      1.3.1
// @description  导出小红书列表数据，方便做数据分析
// @author       俊小胖
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @license      GPL
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/496412/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%AC%94%E8%AE%B0%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/496412/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%AC%94%E8%AE%B0%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let data = [];
    let itemNum = 0 //当前加载笔记的数量
    let excel_title = '小红书数据'
    let likeNumLimit = 100 //导出的数据点赞数要求
    let keywords = ''//过滤的关键词

    // 定义一个函数来抓取数据
    function fetchData() {
        var itemNumElement = document.getElementById('itemNum');

        // 假设列表数据在某个具有特定类名的元素中
        const listElements = document.querySelectorAll('.note-item'); // 需要根据实际页面结构调整选择器
        const domain = 'https://www.xiaohongshu.com'
        listElements.forEach(item => {
            const linkElement = item.querySelector('a.cover.ld.mask');
            //console.log(item.querySelector('.title'));
            if (linkElement) {
                const link = domain + linkElement.getAttribute('href'); // 拼接完整链接
                let title = item.querySelector('.title').textContent; // 需要根据实际页面结构调整选择器
                let author = item.querySelector('.author').textContent; // 需要根据实际页面结构调整选择器
                let likeCount = item.querySelector('.like-wrapper').textContent; // 需要根据实际页面结构调整选择器
                let links = item.querySelector('a').getAttribute('href'); // 需要根据实际页面结构调整选择器

                let itemIndex = item.dataset.index ? item.dataset.index : 0

                likeCount = convertToNumber(likeCount ? likeCount : 0)
                let itemData = [title, author, likeCount, link]
                data[itemIndex] = itemData
            }

        });

        itemNum = data.length

        if (itemNumElement) {
            itemNumElement.textContent = itemNum; // 更新文本内容
        }

    }
    //过滤点赞数限制的数据
    function filterArrayByLikeNum(arr, limit) {
        var newArray = [];
        arr.forEach(function (subArray) {
            if (subArray[2] > limit) {
                newArray.push(subArray);
            }
        });
        return newArray;
    }
    function containsAnyKeyword(str, keywords) {
        const regexPattern = `(${keywords.join('|')})`;
        const regex = new RegExp(regexPattern, 'i'); // 'i' 表示不区分大小写
        return regex.test(str);
    }
    //过滤指定关键词
    function filterArrayByTitle(arr, keywords) {
        var newArray = [];
        arr.forEach(function (subArray) {
            if (!containsAnyKeyword(subArray[0], keywords)) {
                newArray.push(subArray);
            }
        });
        return newArray;
    }
    // 定义点击按钮时执行的函数
    function onButtonClick() {
        // 在这里添加你想要执行的代码
        exportArrayToExcel(data, excel_title);
        // fetchData()

    }

    //自定义页面样式
    function addStyle() {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.export-note{margin: 6px 0 12px 0;}.group-header-title{font-size: 16px;border-bottom: 1px solid #eee;padding: 10px 0;margin-bottom: 10px;color: rgba(51, 51, 51, 0.6);}.group-header-title a{float: right;color: #f6333b;}#itemNum{font-weight: bold;color: red;}.export-data {margin: 6px 0;display: flex;flex-wrap: wrap;flex-direction: row-reverse;border:solid 1px #eee;border-radius: 16px;padding:6px;line-height: 25px;}.export-button{text-align: center;padding:6px;border:border: 1px solid transparent;background-color:#ff2442;color:#ffffff;border-radius:5px;cursor:pointer}.input{margin: 0 4px;padding:2px 4px;border: 1px solid #ccc;border-radius: 4px;background-color: #eee;width: 60px;}';
        document.head.appendChild(style);
    }

    // 动态插入<script>标签
    function loadScript(url, callback) {
        // 创建script元素
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // 绑定事件处理程序
        script.onreadystatechange = script.onload = function () {
            var state = this.readyState;
            if (!callback.done && (!state || /loaded|complete/.test(state))) {
                callback.done = true;
                callback();
            }
        };

        // 插入到DOM中
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    // export-to-excel.js
    function exportArrayToExcel(dataArray, fileName) {
        var newDataArray = dataArray
        var keywordArray = []
        var limit = parseFloat(document.getElementById("likeNumLimit").value);
        var keywords_value = document.getElementById("keywords").value;
        if (limit > 0) {
            newDataArray = filterArrayByLikeNum(dataArray, limit)
            if (keywords_value && keywords_value != '') {
                keywordArray = keywords_value.split(","); // 使用逗号作为分隔符
                newDataArray = filterArrayByTitle(newDataArray, keywordArray)
            }
        }
        newDataArray.unshift(['标题', '作者', '点赞数', '链接']);
        // 创建一个工作簿
        const workbook = XLSX.utils.book_new();
        // 将数组转换为工作表
        const worksheet = XLSX.utils.aoa_to_sheet(newDataArray);
        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        // 导出工作簿
        XLSX.writeFile(workbook, fileName + ".xlsx");
    }

    //转换点赞数为数字
    function convertToNumber(text) {
        // 移除空格
        text = text.replace(/\s+/g, '');
        // 检测单位
        if (text.endsWith('w')) {
            // 移除单位并转换为数字
            return parseFloat(text.slice(0, -1)) * 10000;
        } else {
            // 如果没有单位，直接返回转换后的数字
            return parseFloat(text);
        }
    }

    //监听鼠标滑动更新数据
    document.addEventListener('mousemove', function (event) {
        fetchData()
    });

    // 创建按钮元素
    const button = document.createElement('button');
    button.textContent = '导出excel';
    button.className = 'export-button'

    // 为按钮添加点击事件监听器
    button.addEventListener('click', onButtonClick);

    //载入导出按钮
    function loadExportButton() {
        addStyle()
        // 导出函数到全局
        window.exportArrayToExcel = exportArrayToExcel;
        // 创建一个 URL 对象
        var url = new URL(window.location.href);
        // 使用 URLSearchParams 获取参数
        var keyword = url.searchParams.get('keyword');
        if (keyword) {
            keyword = decodeURIComponent(keyword)

            excel_title = keyword + ' - 小红书数据'
        } else if (document.title) {
            excel_title = document.title;
        }

        // 找到具有特定类名的元素
        var targetElement = document.querySelector('.channel-list');

        // 创建一个新的 div 元素
        var exportDiv = document.createElement('div');
        // 设置 div 的内容
        exportDiv.innerHTML = '<div class="export-note"><div class="group-header-title">红薯笔记导出<a href="http://shang.junxiaopang.com" target="_blank">💰打赏开发者</a></div>支持导出页面上加载过的笔记列表<br>方便运营人员做数据分析提高工作效率<br>当前已加载<span id="itemNum">0</span>条数据<br>上下滑动鼠标可以加载更多<div class="group-header-title">导出设置</div>只导出点赞大于<input name="like-num" id="likeNumLimit" value="' + likeNumLimit + '" class="input" type="number"/>的数据<br>过滤标题中带有<input name="keywords" id="keywords" value="' + keywords + '" class="input" type="text"/>的内容</div>';
        // 添加类名或者样式
        exportDiv.className = 'export-data';
        // 如果要插入到特定位置，比如body的开头，可以直接使用以下代码：
        targetElement.appendChild(exportDiv);
        exportDiv.appendChild(button);

        //页面加载完以后，初始化读取
        fetchData()
    }

    // 等待页面加载完毕再执行
    window.addEventListener('load', loadExportButton);



})();