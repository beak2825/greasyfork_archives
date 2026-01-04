// ==UserScript==
// @name         xhs-pgy 页面hook 初始版
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  优化后的版本，用于更好地监控和调试特定XHR请求
// @author       You_Optimized
// @match        *.pgy.xiaohongshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scriptcat.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518035/xhs-pgy%20%E9%A1%B5%E9%9D%A2hook%20%E5%88%9D%E5%A7%8B%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/518035/xhs-pgy%20%E9%A1%B5%E9%9D%A2hook%20%E5%88%9D%E5%A7%8B%E7%89%88.meta.js
// ==/UserScript==

let globalCsvData = ''; // 保存CSV格式的数据

(function () {
    'use strict'; // 启用严谨模式，检查所有错误

    // 保存原始的 XMLHttpRequest.prototype.open 和 send 方法
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    // 重写 open 方法，记录请求方法和URL
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        this._customMethod = method; // 使用自定义属性以避免潜在冲突
        this._customUrl = url; // 使用自定义属性以避免潜在冲突
        return originalOpen.apply(this, arguments); // 调用原始方法，保持功能不变
    };

    // 重写 send 方法，监控特定URL的请求并打印响应内容
    XMLHttpRequest.prototype.send = function (data) {
        // 如果URL包含特定字符串，则添加load事件监听器以打印响应内容
        if (this._customUrl.includes('api/solar/cooperator/blogger/v2')) {
            this.addEventListener('load', function () {
                // 处理响应数据， 提取里面的字段数据
                try {
                    // console.log('XHR Response:', this.status, this.statusText, this.responseText); // 打印更多响应信息，包括状态码和状态文本
                    const response = JSON.parse(this.responseText); // 解析响应数据为JSON格式
                    // console.log('Response Data:', response); // 打印响应数据
                    // 提取字段数据， data.kols里面的list数据，下载成表格数据
                    if (response.data && response.data.kols) {
                        const list = response.data.kols;
                        // 深层次复制
                        const listCopy = JSON.parse(JSON.stringify(list));
                        globalCsvData = convertToCSV(listCopy); // 转换为CSV格式
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
function convertToCSV(list) {
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
    const csvRows = [headers.join(',')]; // 添加表头作为第一行

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

    return csvRows.join('\n'); // 返回完整的CSV字符串
}


// 添加新函数：创建下载链接
function createDownloadLink(csvData) {
    const blob = new Blob([csvData], {type: 'text/csv;charset=utf-8;'}); // 创建Blob对象
    const link = document.createElement('a'); // 创建a元素作为下载链接
    link.href = URL.createObjectURL(blob); // 设置链接的href属性为Blob对象的URL
    link.download = 'xhs_data.csv'; // 设置下载文件的名称
    link.style.display = 'none'; // 隐藏链接元素
    document.body.appendChild(link); // 将链接元素添加到页面上
    link.click(); // 模拟点击链接以触发下载
    document.body.removeChild(link); // 下载完成后从页面上移除链接元素
}


// 添加新函数：创建下载按钮
function createDownloadButton() {
    // 需要悬浮在页面上的按钮, 页面左侧具中
    const downloadBtn = document.createElement('button');
    downloadBtn.style.width = '100px'; // 设置按钮宽度
    downloadBtn.style.height = '30px'; // 设置按钮高度
    downloadBtn.style.backgroundColor = '#009688'; // 设置按钮背景颜色
    downloadBtn.style.color = 'white'; // 设置按钮文字颜色
    downloadBtn.style.position = 'fixed'; // 固定在页面左侧
    downloadBtn.style.top = '50%'; // 距离顶部10像素
    downloadBtn.style.right = '10px'; // 距离左侧10像素
    downloadBtn.style.zIndex = '9999'; // 设置z-index属性，确保按钮在最上层
    downloadBtn.innerText = '下载本页数据'; // 设置按钮上的文字
    downloadBtn.addEventListener('click', function () {
        if (globalCsvData) { // 检查是否有可用的CSV数据
            createDownloadLink(globalCsvData); // 当用户点击按钮时，触发下载功能
        } else {
            alert('当前没有可下载的数据！'); // 如果没有数据可供下载，则提示用户
        }
    });
    document.body.appendChild(downloadBtn); // 将按钮添加到页面中

}

createDownloadButton(); // 创建下载按钮并添加到页面中
