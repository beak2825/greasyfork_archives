// ==UserScript==
// @name         B站花火 页面hook 优化版
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  优化后的版本，用于更好地监控和调试特定XHR请求
// @author       You_Optimized
// @match        *huahuo.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scriptcat.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524100/B%E7%AB%99%E8%8A%B1%E7%81%AB%20%E9%A1%B5%E9%9D%A2hook%20%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/524100/B%E7%AB%99%E8%8A%B1%E7%81%AB%20%E9%A1%B5%E9%9D%A2hook%20%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==


let globalCsvData = ''; // 保存CSV格式的数据
let globalCsvDataL = 100000;
let _page = 1;
let _page_url;
let interval;
// 创建下载按钮
const downloadButton = document.createElement('button');

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showAlert() {
    return new Promise((resolve, reject) => {
        const confirmation = window.confirm('已下载10页，需要继续吗？');
        if (confirmation) {
            resolve('继续');
        } else {
            reject('导出');
        }
    });
}


(function () {
    'use strict'; // 启用严谨模式，检查所有错误

    // 保存原始的 XMLHttpRequest.prototype.open 和 send 方法
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    // 重写 open 方法，记录请求方法和URL
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._customMethod = method; // 使用自定义属性以避免潜在冲突
        this._customUrl = url; // 使用自定义属性以避免潜在冲突
        //console.log('open arguments :', arguments); // 打印响应数据
        return originalOpen.apply(this, arguments); // 调用原始方法，保持功能不变
    };


    // 重写 send 方法，监控特定URL的请求并打印响应内容
    XMLHttpRequest.prototype.send = function (data) {
        // 如果URL包含特定字符串，则添加load事件监听器以打印响应内容
        if (this._customUrl.includes('/commercialorder/api/web_api/v1/advertiser/upper_square/search')) {
            // if (this._customUrl.includes('&page=1&')) {
            //     globalCsvData = "";
            // }
            this.addEventListener('load', function () {
                // 处理响应数据， 提取里面的字段数据
                try {
                //     //console.log('XHR Response:', this.status, this.statusText, this.responseText); // 打印更多响应信息，包括状态码和状态文本
                    const response = JSON.parse(this.responseText); // 解析响应数据为JSON格式
                    // console.log('Response Data:', response); // 打印响应数据
                    // 提取字段数据， data.kols里面的list数据，下载成表格数据
                    let result = response['result'] || {data:[]};
                    const list = result.data;
                    if (list) {
                        // 深拷贝
                        const listCopy = JSON.parse(JSON.stringify(list));
                        globalCsvData = convertToCSV(listCopy, 1); // 转换为CSV格式
                    }
                    // console.log(globalCsvData)
                } catch (error) {
                    console.error('Error Parsing Response:', error); // 打印解析错误
                }
            });
            this.addEventListener('error', function () { // 添加错误处理监听器
                console.error('XHR Error:', this.status, this.statusText); // 在控制台打印错误信息
            });
        }
        return originalSend.apply(this, arguments); // 调用原始方法，保持发送数据的功能不变
    };
})();


// 添加新函数：转换为CSV格式
function convertToCSV(list, is_init) {
    const headers = [
        '博主昵称',
        '花火主页链接',
        '主页链接',
        '性别',
        '地区',
        '内容类型',
        '粉丝数',
        '播放中位数30天自然',
        '播放中位数',
        '互动中位数',
        '涨粉率',
        '涨粉量',
        '报价-定制视频',
        '报价-植入视频',
        '报价-直发动态',
        '报价-转发动态',
        'MCN机构',
        'CPM',
        
    ];
    //
    const csvRows = is_init ? [headers.join(',')] : [];

    // 遍历列表数据，没有值的为空，有值的转成sting, 将每条数据转换为CSV格式
    list.forEach(item => {

        
        let hh_link = "https://huahuo.bilibili.com/#/upper/page/" + item.upper_mid;
        let user_link = 'https://space.bilibili.com/'  + item.upper_mid
        for (let index = 0; index < 4; index++) {
            let _item = item.price_infos[index]
            if (!_item){
                item.price_infos[index] = {
                    platform_price:0
                }
            }
        }
        let tags = ""
        try {
            tags = item.tags.toString().slice(1, -1)
        } catch (error) {}
        const rowData = [
            item.nickname || '未获取昵称',
            hh_link,
            user_link,
            item.gender_desc || '未知',
            item.region_desc || '/',
            tags || '/',
            item.fans_num || '/',
            item.average_play_cnt || '/',
            item.play_median || '/',
            item.interactive_rate || '/',
            item.fans_inc_rate || '/',
            item.fans_inc || '/',
            item.price_infos[0].platform_price || '/',
            item.price_infos[1].platform_price || '/',
            item.price_infos[2].platform_price || '/',
            item.price_infos[3].platform_price || '/',
            item.mcn_company_name || '/',
            item.cpm || '/',
        ];

        // 数据中有,分割的数据使用/代替，拼接成字符串， undefined替换为空字符串
        rowData.forEach((data, index) => {
            if (typeof data === 'string' && data.includes(',')) {
                rowData[index] = `"${data.replace(/,/g, '/')}"`; // 替换逗号
            } else if (data === undefined) {
                rowData[index] = ''; // 替换undefined为空字符串
            }
        });
        csvRows.push(rowData.join(','));
    });
    return csvRows.join('\n') + "\n";
}


// 添加新函数：创建下载链接
function createDownloadLink(csvData) {
    // 添加 BOM 头
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);

    // 将 CSV 数据转换为 Uint8Array
    const encoder = new TextEncoder();
    const csvDataWithBOM = encoder.encode(csvData);

    // 创建 Blob 对象，并将 BOM 头和 CSV 数据合并
    const blob = new Blob([bom, csvDataWithBOM], {type: 'text/csv;charset=utf-8;'});

    // 创建 a 元素作为下载链接
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    let time_str = new Date().toLocaleString().replaceAll("/", "-").replaceAll(":", "-").replaceAll(" ", "_");
    link.download = 'huahuo_bilibili_data_' + time_str + ".csv";
    link.style.display = 'none';
    document.body.appendChild(link);

    // 模拟点击链接以触发下载
    link.click();

    // 下载完成后从页面上移除链接元素
    document.body.removeChild(link);
}

function nextPage() {
    //console.log(document.location.href, document.location.href.includes("/search/list/blogger"))
    if (document.location.href.includes("/search/list/blogger")) {
        // 达人搜索页面
        try {
            let nextPageButtonClass = '.el-button.pt0.pb0.el-button--primary.el-button--small';
            if (document.querySelector(nextPageButtonClass).textContent == "滚动") {
                document.querySelector('.res-wrapper').scrollTop += 15000;
            } else if (document.querySelector(nextPageButtonClass).textContent == "翻页") {
                const nextPageButton = document.querySelector('.btn-next');
                if (!nextPageButton) return true;
                nextPageButton.click();
            }
        } catch (e) {
            alert('网站更新，需要维护升级！');
        }

    } else if (document.location.href.includes("/material/note")) {
        // 笔记搜索页面
        const nextPageContent = document.querySelector("#content")
        if (!nextPageContent) return true;
        nextPageContent.scrollTop += 15000;
    } else {
        alert('当前页面不支持下载！');
    }
}


// 添加新函数：创建下载按钮
function createDownloadButton() {
    // 创建一个包含输入框和按钮的容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.backgroundColor = '#f9f9f9';
    container.style.padding = '15px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
    container.style.zIndex = '9999';
    container.style.width = '260px'; // 设置容器的宽度为 200 像素，可以根据需要调整
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';

    // 创建提示文本
    const labelBefore = document.createElement('span');
    labelBefore.style.marginTop = '5px';
    labelBefore.style.color = 'red';
    labelBefore.textContent = '下载时请勿操作页面！';
    container.appendChild(labelBefore);

    downloadButton.textContent = '下载当页';
    downloadButton.style.padding = '8px 15px';
    downloadButton.style.backgroundColor = '#007bff';
    downloadButton.style.color = '#fff';
    downloadButton.style.border = 'none';
    downloadButton.style.borderRadius = '4px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.width = '200px';
    downloadButton.style.marginTop = '10px'; // 设置按钮距离上方控件 20px
    downloadButton.addEventListener('click', function () {
        createDownloadLink(globalCsvData); // 当用户点击按钮时，触发下载功能
        globalCsvData = "";
    })


    container.appendChild(downloadButton);

    // const delButton = document.createElement('button');
    // delButton.textContent = '暂停并导出';
    // delButton.style.padding = '8px 15px';
    // delButton.style.backgroundColor = '#007bff';
    // delButton.style.color = '#fff';
    // delButton.style.border = 'none';
    // delButton.style.borderRadius = '4px';
    // delButton.style.cursor = 'pointer';
    // delButton.style.width = '200px';
    // delButton.style.marginTop = '10px'; // 设置按钮距离上方控件 20px

    // delButton.addEventListener('click', function () {
    //     if (globalCsvData) { // 检查是否有可用的CSV数据
    //         clearInterval(interval);
    //         delButton.textContent = '导出中...';
    //         setTimeout(function () {
    //             createDownloadLink(globalCsvData); // 当用户点击按钮时，触发下载功能
    //             globalCsvData = "";
    //             delButton.textContent = '暂停并导出';
    //         }, 4000); // 3000 毫秒即 3 秒后执
    //     } else {
    //         alert('当前没有可下载的数据！'); // 如果没有数据可供下载，则提示用户
    //     }
    //     downloadButton.textContent = '下载全部';
    // })

    // container.appendChild(delButton);


// 将容器添加到页面中
    document.body.appendChild(container);


// 使悬浮窗可移动
    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener('mousedown', (e) => {
        if (e.target !== downloadButton) {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            container.style.left = e.clientX - offsetX + 'px';
            container.style.top = e.clientY - offsetY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

}

createDownloadButton(); // 创建下载按钮并添加到页面中

