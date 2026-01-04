// ==UserScript==
// @name         xhs-pgy 页面hook 优化版
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  优化后的版本，用于更好地监控和调试特定XHR请求
// @author       You_Optimized
// @match        *.pgy.xiaohongshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scriptcat.org
// @grant        GM_xmlhttpRequest
// @connect      open.feishu.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512660/xhs-pgy%20%E9%A1%B5%E9%9D%A2hook%20%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/512660/xhs-pgy%20%E9%A1%B5%E9%9D%A2hook%20%E4%BC%98%E5%8C%96%E7%89%88.meta.js
// ==/UserScript==

let globalCsvData = ''; // 保存CSV格式的数据
let globalCsvDataL = 100000;
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
        if (this._customUrl.includes('api/solar/cooperator/blogger/v2')) {
            let v2_data = JSON.parse(arguments[0]);
            if (v2_data['pageNum'] == 1) {
                globalCsvData = "";
            }
            this.addEventListener('load', function () {
                // 处理响应数据， 提取里面的字段数据
                try {
                    // console.log('XHR Response:', this.status, this.statusText, this.responseText); // 打印更多响应信息，包括状态码和状态文本
                    const response = JSON.parse(this.responseText); // 解析响应数据为JSON格式
                    //console.log('Response Data:', response); // 打印响应数据
                    // 提取字段数据， data.kols里面的list数据，下载成表格数据
                    if (response.data && response.data.kols) {
                        const list = response.data.kols;
                        // 深层次复制
                        const listCopy = JSON.parse(JSON.stringify(list));
                        if (listCopy.length) {
                            if (globalCsvData) {
                                globalCsvData += convertToCSV(listCopy, 0); // 转换为CSV格式
                            } else {
                                globalCsvData = convertToCSV(listCopy, 1); // 转换为CSV格式
                            }
                        }
                    }
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

function findPaginationControl() {
    // 查找完整的嵌套结构并验证path的d属性
    const element = document.querySelector(`
        div.d-pagination-page.d-pagination-page-default.--color-bg-fill-light.--color-text-paragraph.d-clickable > 
        span.d-icon.--color-current.--color-static.--size-icon-default > 
        svg[viewBox="0 0 48 48"] > 
        path[d="M19 12L31 24L19 36"]
    `);

    if (element) {
        return {
            parent: element.parentElement.parentElement.parentElement,  // div
            span: element.parentElement.parentElement,                  // span
            svg: element.parentElement,                                // svg
            path: element                                             // path
        };
    }
    return null;
}
function clickPagination() {
    const control = findPaginationControl();
    if (control) {
        control.parent.click();
        return true;
    }
    return false;
}// 添加新函数：转换为CSV格式
function convertToCSV(list, is_init) {
    const headers = [
        '小红书昵称',
        '等级',
        '粉丝数', // ... 其他所需字段
        '主页链接',
        '蒲公英链接',
        '优效模式(平台可保曝光量)',
        '是否低活跃',
        '内容类目',
        '账号人设',
        '内容特征',
        '小红书id',
        '地区',
        '博主性别',
        '粉丝量变化幅度%',
        '活跃粉丝占比%',
        '互动粉丝占比%',
        '阅读中位数',
        '互动中位数',
        '千赞笔记比例%',
        '百赞笔记比例%',
        '图文阅读中位数',
        '图文互动中位数',
        '预估阅读单价(图文)',
        '千赞笔记比例(图文)%',
        '百赞笔记比例(图文)%',
        '视频阅读中位数',
        '视频互动中位数',
        '视频完播率%',
        '预估阅读单价(视频)',
        '千赞笔记比例(视频)%',
        '百赞笔记比例(视频)%',
        '蒲公英图文价格',
        '蒲公英视频价格',
    ];
    const csvRows = is_init ? [headers.join(',')] : [];
    // 遍历列表数据，没有值的为空，有值的转成sting, 将每条数据转换为CSV格式
    list.forEach(item => {
        const rowData = [
            item.name || '', // 对应 '小红书昵称'
            item.currentLevel, // 对应 '等级'
            item.fansNum, // 对应 '粉丝数'
            `${item.userId ? `https://www.xiaohongshu.com/user/profile/${item.userId}` : ''}`, // 拼接主页链接，如果item.userId不存在则使用空字符串
            `${item.userId ? `https://pgy.xiaohongshu.com/solar/pre-trade/blogger-detail/${item.userId}` : ''}`, // 拼接蒲公英主页链接，如果item.userId不存在则使用空字符串
            item.platformExposure || '', // 对应 '优效模式(平台可保曝光量)'
            (item.lowActive === true ? '是' : '否'), // 对应 '是否低活跃'
            (item.contentTags || []).map(tag => tag.taxonomy1Tag).join(',') || '', // 对应 '内容类目'
            (item.personalTags || []).join(',') || '', // 对应 '账号人设'
            (item.featureTags || []).join(',') || '', // 对应 '内容特征'
            item.redId, // 对应 '小红书id'
            item.location, // 对应 '地区'
            item.gender, // 对应 '博主性别'
            item.fans30GrowthRate, // 对应 '粉丝量变化幅度'
            item.fansActiveIn28dLv, // 对应 '活跃粉丝占比'
            item.fansEngageNum30dLv, // 对应 '互动粉丝占比'
            item.clickMidNum, // 对应 '阅读中位数'
            item.interMidNum, // 对应 '互动中位数'
            item.thousandLikePercent30, // 对应 '千赞笔记比例'
            item.hundredLikePercent30, // 对应 '百赞笔记比例'
            item.pictureClickMidNum, // 对应 '图文阅读中位数'
            item.pictureInterMidNum, // 对应 '图文互动中位数'
            item.pictureReadCost, // 对应 '预估阅读单价(图文)'
            item.pictureThousandLikePercent30, // 对应 '千赞笔记比例(图文)'
            item.pictureHundredLikePercent30, // 对应 '百赞笔记比例(图文)'
            item.videoClickMidNum, // 对应 '视频阅读中位数'
            item.videoInterMidNum, // 对应 '视频互动中位数'
            item.videoFinishRate, // 对应 '完播率'
            item.videoReadCost, // 对应 '预估阅读单价(视频)'
            item.videoThousandLikePercent30, // 对应 '千赞笔记比例(视频)'
            item.videoHundredLikePercent30, // 对应 '百赞笔记比例(视频)'
            item.picturePrice, // 对应 '蒲公英图文价格'
            item.videoPrice, // 对应 '蒲公英视频价格'

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

    return csvRows.join('\n') + "\n"; // 返回完整的CSV字符串
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
    link.download = 'xhs_pgy_data_' + time_str + ".csv";
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
    downloadButton.style.marginTop = '10px'; // 设置按钮距离上方控件 20px\

    function downloadAll() {
        if (downloadButton.textContent != "下载中") {
            downloadButton.textContent = '下载中';
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
                            createDownloadLink(globalCsvData); // 当用户点击按钮时，触发下载功能
                            globalCsvData = "";
                            delButton.textContent = '暂停并导出';
                        });
                }

                if (globalCsvData) {
                    if (globalCsvDataL == globalCsvData.length) {
                        console.log('元素具有 cursor: not-allowed 属性');
                        clearInterval(interval);
                        if (globalCsvData) { // 检查是否有可用的CSV数据
                            createDownloadLink(globalCsvData); // 当用户点击按钮时，触发下载功能
                        } else {
                            alert('当前没有可下载的数据！'); // 如果没有数据可供下载，则提示用户
                        }
                        downloadButton.textContent = '下载全部';
                    } else {
                        clickCount++;
                        globalCsvDataL = globalCsvData.length;
                        clickPagination()
                        setTimeout(() => {
                        }, getRandomNumber(7, 10) * 1000);
                    }
                } else {
                    clearInterval(interval);
                    downloadButton.textContent = '下载全部';
                    alert('当前没有可下载的数据！'); // 如果没有数据可供下载，则提示用户
                }
            }, getRandomNumber(7, 10) * 1000)
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
            createDownloadLink(globalCsvData); // 当用户点击按钮时，触发下载功能
            globalCsvData = "";
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

