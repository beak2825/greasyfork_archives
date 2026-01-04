// ==UserScript==
// @name         qiangua-xhs 页面hook 优化版
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  优化后的版本，用于更好地监控和调试特定XHR请求
// @author       You_Optimized
// @match        *app.qian-gua.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scriptcat.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515711/qiangua-xhs%20%E9%A1%B5%E9%9D%A2hook%20%E4%BC%98%E5%8C%96%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/515711/qiangua-xhs%20%E9%A1%B5%E9%9D%A2hook%20%E4%BC%98%E5%8C%96%E7%89%88.meta.js
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
        if (this._customUrl.includes('/blogger/GetListV2') || this._customUrl.includes('/v1/Note/GetNoteHotList')) {
            _page_url = this._customUrl.includes('/blogger/GetListV2') ? 1 : 0;
            let v2_data = JSON.parse(arguments[0]);
            if (v2_data['pageindex'] == 1) {
                globalCsvData = "";
            }

            this.addEventListener('load', function () {
                let _convertToCSV = _page_url ? convertToCSV : noteConvertToCSV;
                // 处理响应数据， 提取里面的字段数据
                try {
                    //console.log('XHR Response:', this.status, this.statusText, this.responseText); // 打印更多响应信息，包括状态码和状态文本
                    const response = JSON.parse(this.responseText); // 解析响应数据为JSON格式
                    //console.log('Response Data:', response); // 打印响应数据
                    // 提取字段数据， data.kols里面的list数据，下载成表格数据
                    let qg_data = response.Data || {};
                    const list = qg_data.ItemList;
                    if (list) {
                        // 深拷贝
                        const listCopy = JSON.parse(JSON.stringify(list));
                        if (globalCsvData) {
                            globalCsvData += _convertToCSV(listCopy, 0); // 转换为CSV格式
                        } else {
                            globalCsvData = _convertToCSV(listCopy, 1); // 转换为CSV格式
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

// 添加新函数：转换为CSV格式
function noteConvertToCSV(list, is_init) {
    const headers = [
        '笔记标题',
        '内容类型',
        '达人昵称',
        '达人等级',
        '联系方式',
        '小红书号',
        '达人类型',
        '分类',
        '预估阅读',
        '互动量',
        '点赞',
        '收藏',
        '评论',
        '分享',
        '提及品牌',
        '笔记标签',
        '发布时间',
        '数据更新时间',
    ];
    const csvRows = is_init ? [headers.join(',')] : [];

    // 遍历列表数据，没有值的为空，有值的转成sting, 将每条数据转换为CSV格式
    list.forEach(item => {
        const rowData = [
            item.Title || '该笔记未设置标题',
            item.NoteTypeDesc,
            item.BloggerNickName,
            item.BloggerProp,
            item.LinkInfo,
            item.RedId,
            item.VerifyContent,
            item.Tag,
            item.ViewCount,
            item.Lcc,
            item.LikedCount,
            item.CollectedCount,
            item.CommentsCount,
            item.ShareCount,
            item.CooperateBindsName,
            item.BloggerTags,
            item.PublishTime.slice(0, 19).replace("T", " "),
            item.UpdateTime.slice(0, 19).replace("T", " "),
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

// 添加新函数：转换为CSV格式
function convertToCSV(list, is_init) {
    const headers = [
        '博主昵称',
        '千瓜指数',
        '达人类型',
        '粉丝数',
        '赞藏总数',
        '笔记数',
        '平均互动',
        '平均点赞',
        '平均收藏',
        '平均评论',
        '小红书主页',
        '蒲公英主页',
        '小红书号',
        '实时报价-图文',
        '实时报价-图文CPE',
        '实时报价-视频',
        '实时报价-视频CPE',
        '关注数',
        '冠薯',
        '达人等级',
        '标签占比',
        '标签指数',
        '简介',
    ];
    //
    const csvRows = is_init ? [headers.join(',')] : [];

    // 遍历列表数据，没有值的为空，有值的转成sting, 将每条数据转换为CSV格式
    list.forEach(item => {
        let pgy_link = "https://pgy.xiaohongshu.com/solar/pre-trade/blogger-detail/" + item.QRCode.replace("xhsdiscover://user/", "");
        let _TagList = "";
        for (let i = 0; i < item.TagList.length; i++) {
            let _item = item.TagList[i];
            _TagList += _item['TagName'] + ":" + _item['PerDesc'] + "/";
        }
        //console.log(_TagList)
        _TagList = _TagList.slice(0, -1);
        //console.log(_TagList)
        //console.log(item.TagList)

        //console.log(item.BloggerTypes)
        let _BloggerTypes = "";
        for (let i = 0; i < item.BloggerTypes.length; i++) {
            let _item = item.BloggerTypes[i];
            _BloggerTypes += _item['TagName'] + ":" + _item['BloggerIndex'] + "/";
        }
        _BloggerTypes = _BloggerTypes.slice(0, -1);

        const rowData = [
            item.NickName || '',
            item.BloggerIndex,
            item.PersonalLabel,
            item.Fans,
            item.LikeCollect,
            item.NoteCount60,
            item.AvgLccCount60,
            item.AvgLikeCount60,
            item.CollectMedian,
            item.CommentMedian,
            item.BloggerUrl,
            pgy_link,
            item.RedId,
            item.AdPriceText,
            item.TextCPE,
            item.AdPriceVideo,
            item.VideoCPE,
            item.Follow,
            item.LevelName,
            item.BloggerProp,
            _TagList,
            _BloggerTypes,
            `${item.Description.replaceAll("\n", "").replaceAll(",", "")}`,
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
    link.download = 'qiangua_xhs_data_' + time_str + ".csv";
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

    downloadButton.textContent = '下载全部';
    downloadButton.style.padding = '8px 15px';
    downloadButton.style.backgroundColor = '#007bff';
    downloadButton.style.color = '#fff';
    downloadButton.style.border = 'none';
    downloadButton.style.borderRadius = '4px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.width = '200px';
    downloadButton.style.marginTop = '10px'; // 设置按钮距离上方控件 20px

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
                                setTimeout(function () {
                                    createDownloadLink(globalCsvData); // 当用户点击按钮时，触发下载功能
                                    globalCsvData = "";
                                    delButton.textContent = '暂停并导出';
                                }, 4000); // 3000 毫秒即 3 秒后执
                            });
                    }
                    if (globalCsvData) {
                        if (globalCsvDataL == globalCsvData.length) {
                            //console.log('元素具有 cursor: not-allowed 属性');
                            clearInterval(interval);
                            if (globalCsvData) { // 检查是否有可用的CSV数据
                                createDownloadLink(globalCsvData); // 当用户点击按钮时，触发下载功能
                            } else {
                                alert('当前没有可下载的数据！'); // 如果没有数据可供下载，则提示用户
                            }
                            downloadButton.textContent = '下载全部';
                        } else {
                            globalCsvDataL = globalCsvData.length;
                            if (nextPage()) {
                                alert('该页面无法导出或网站更新，需要维护升级！');
                            }else {
                                clickCount++;
                            }
                            setTimeout(() => {
                            }, sleep_time + 100);
                        }
                    } else {
                        clearInterval(interval);
                        downloadButton.textContent = '下载全部';
                        alert('当前没有可下载的数据！'); // 如果没有数据可供下载，则提示用户
                    }
                }
                ,
                sleep_time
            );
        }
    }
    
    let sleep_time = getRandomNumber(5, 10) * 1000;
    // let sleep_time = 2000;
    downloadButton.addEventListener('click', function () {
        downloadAll()
    })
    ;

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

