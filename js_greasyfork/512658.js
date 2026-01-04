// ==UserScript==
// @name         dy_xingtu 页面hook 优化版
// @namespace    http://tampermonkey.net/
// @version      0.1.10
// @description  优化后的版本，用于更好地监控和调试特定XHR请求
// @author       You_Optimized
// @match        *www.xingtu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scriptcat.org
// @grant        GM_xmlhttpRequest
// @connect      open.feishu.cn
// @connect      www.toutiao.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512658/dy_xingtu%20%E9%A1%B5%E9%9D%A2hook%20%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/512658/dy_xingtu%20%E9%A1%B5%E9%9D%A2hook%20%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==


let globalCsvData = ''; // 保存CSV格式的数据
let _page = 1;
let _pages = 0;
let interval;

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 创建下载按钮
const downloadButton = document.createElement('button');

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
        // console.log('open arguments :', arguments); // 打印响应数据
        return originalOpen.apply(this, arguments); // 调用原始方法，保持功能不变
    };

    // 重写 send 方法，监控特定URL的请求并打印响应内容
    XMLHttpRequest.prototype.send = function (data) {
        // 如果URL包含特定字符串，则添加load事件监听器以打印响应内容
        if (this._customUrl.includes('/gw/api/gsearch/search_for_author_square')) {
            this.addEventListener('load', function () {
                // 处理响应数据， 提取里面的字段数据
                try {
                    // console.log('XHR Response:', this.status, this.statusText, this.responseText); // 打印更多响应信息，包括状态码和状态文本
                    const response = JSON.parse(this.responseText); // 解析响应数据为JSON格式
                    // console.log('Response Data:', response); // 打印响应数据
                    // 提取字段数据， data.kols里面的list数据，下载成表格数据
                    if (response.authors) {
                        const list = response.authors;
                        // 深层次复制
                        const listCopy = JSON.parse(JSON.stringify(list));
                        if (response['pagination']) {
                            _page = response['pagination']['page'];
                            _pages = Math.ceil(response['pagination']['total_count'] / response['pagination']['limit']);
                            if (_page == 1) {
                                globalCsvData = "";
                            }
                            // console.log('listCopy :', listCopy); // 打印响应数据
                            if (globalCsvData) {
                                globalCsvData += convertToCSV(listCopy, 0); // 转换为CSV格式
                            } else {
                                globalCsvData = convertToCSV(listCopy, 1); // 转换为CSV格式
                            }
                        }
                    }
                    // 提取整合里面数据
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
        '抖音昵称',
        '达人粉丝',
        '内容类型',
        '星图链接',
        '抖音链接',
        '城市',
        '省份',
        '博主性别',
        '1-20s报价',
        '21-60s报价',
        '60s报价',
        '预期播放数',
        '种草指数',
        '传播指数',
        '转换指数',
        '星图指数',
        '进30天互动率',
        '进30天完播率',
        '1-20s预期cpm',
        '20-60s预期cpm',
        '60s预期cpm',
        '链接用户数',
    ];

    const csvRows = is_init ? [headers.join(',')] : [];

    // 遍历列表数据，没有值的为空，有值的转成sting, 将每条数据转换为CSV格式
    list.forEach(item => {
        item = item.attribute_datas;
        const rowData = [
            item.nick_name || '',
            item.follower,
            Object.keys(JSON.parse(item.tags_relation)).join(',') || "",
            `https://www.xingtu.cn/ad/creator/author/douyin/${item.id}`,
            item.core_user_id,
            item.city,
            item.province,
            item.gender == 1 ? "男" : "女",
            item.price_1_20,
            item.price_20_60,
            item.price_60,
            item.sn_expected_play_num,
            item.link_shopping_index,
            item.link_spread_index,
            item.link_convert_index,
            item.star_index,
            `${item.interact_rate_within_30d * 100}%`,
            `${item.play_over_rate_within_30d * 100}%`,
            item.prospective_1_20_cpm,
            item.prospective_20_60_cpm,
            item.prospective_60_cpm,
            item.link_link_cnt_by_industry,
        ];

        let _url = "https://www.toutiao.com/c/user/" + item.core_user_id + "/"

        const _headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "zh-CN,zh;q=0.9",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": window.navigator.platform,
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "user-agent": window.navigator.userAgent
        };
        GM_xmlhttpRequest({
            method: "GET",
            url: _url,
            headers: _headers,
            onload: function (response) {
                // console.log(item.core_user_id,'https://www.douyin.com/user/' + response.finalUrl.split("?")[0].split("/")[6])
                globalCsvData = globalCsvData.replace(item.core_user_id, 'https://www.douyin.com/user/' + response.finalUrl.split("?")[0].split("/")[6])
            }
        });

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
    link.download = 'douyin_xingtu_data_' + time_str + ".csv";
    link.style.display = 'none';
    document.body.appendChild(link);

    // 模拟点击链接以触发下载
    link.click();

    // 下载完成后从页面上移除链接元素
    document.body.removeChild(link);
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

    downloadButton.textContent = '下载全部';
    downloadButton.style.padding = '8px 15px';
    downloadButton.style.backgroundColor = '#007bff';
    downloadButton.style.color = '#fff';
    downloadButton.style.border = 'none';
    downloadButton.style.borderRadius = '4px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.width = '200px';
    downloadButton.style.marginTop = '10px'; // 设置按钮距离上方控件 20px

    function DownloadData() {
        if (globalCsvData) { // 检查是否有可用的CSV数据
            createDownloadLink(globalCsvData); // 当用户点击按钮时，触发下载功能
        } else {
            alert('当前没有可下载的数据！'); // 如果没有数据可供下载，则提示用户
        }
        downloadButton.textContent = '下载全部';
    }

    function downloadAll() {
        if (downloadButton.textContent != "下载中" && _pages) {
            downloadButton.textContent = '下载中';
            if (_page < _pages) {
                let clickCount = 1;
                interval = setInterval(() => {

                    if (clickCount >= 10) {
                        clearInterval(interval);
                        showAlert()
                            .then(result => {
                                console.log('用户点击了：', result)
                                downloadButton.textContent = '下载全部';
                                downloadAll();
                            })
                            .catch(result => {
                                console.log('用户点击了：', result)
                                delButton.textContent = '导出中...';
                                setTimeout(function () {
                                    createDownloadLink(globalCsvData); // 当用户点击按钮时，触发下载功能
                                    globalCsvData = "";
                                    delButton.textContent = '暂停并导出';
                                }, 4000); // 3000 毫秒即 3 秒后执
                            });
                    }

                    const nextPageButton = document.querySelector('.btn-next');
                    if (nextPageButton && clickCount < _pages - 1) {
                        nextPageButton.click();
                        clickCount++;
                        if (clickCount < _pages) {
                            setTimeout(() => {
                            }, getRandomNumber(7, 10) * 1000);
                        } else {
                            clearInterval(interval);
                            DownloadData();
                        }
                    } else if (!nextPageButton && clickCount === 0) {
                        console.log('Next page button not found.');
                        clearInterval(interval);
                        downloadButton.textContent = '下载全部';
                    } else {
                        clearInterval(interval);
                        DownloadData();
                    }
                }, getRandomNumber(7, 10) * 1000)
            } else {
                DownloadData();
            }
        }
    }


    downloadButton.addEventListener('click', function () {
        downloadAll();
    });

    container.appendChild(downloadButton);

    const delButton = document.createElement('button');
    delButton.textContent = '暂停并导出';
    delButton.style.padding = '8px 15px';
    delButton.style.backgroundColor = '#007bff';
    delButton.style.color = '#fff';
    delButton.style.border = 'none';
    delButton.style.borderRadius = '4px';
    delButton.style.cursor = 'pointer';
    delButton.style.width = '200px';
    delButton.style.marginTop = '10px'; // 设置按钮距离上方控件 20px
    delButton.addEventListener('click', function () {
        if (globalCsvData) { // 检查是否有可用的CSV数据
            clearInterval(interval);
            delButton.textContent = '导出中...';
            setTimeout(function () {
                createDownloadLink(globalCsvData); // 当用户点击按钮时，触发下载功能
                globalCsvData = "";
                delButton.textContent = '暂停并导出';
            }, 4000); // 3000 毫秒即 3 秒后执
        } else {
            alert('当前没有可下载的数据！'); // 如果没有数据可供下载，则提示用户
        }
        downloadButton.textContent = '下载全部';
    })
    container.appendChild(delButton);

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

