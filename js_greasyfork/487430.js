// ==UserScript==
// @name         bk
// @version      0.4
// @author       Fructose
// @match        https://wk5.bookan.com.cn/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.1.0.js
// @license      MIT
// @description  用于下载bk的书籍图片，下载下来之后需要自己用pdf软件合并
// @namespace https://greasyfork.org/users/1261551
// @downloadURL https://update.greasyfork.org/scripts/487430/bk.user.js
// @updateURL https://update.greasyfork.org/scripts/487430/bk.meta.js
// ==/UserScript==
'use strict';

/* 用于页面添加下载按钮 */
GM_addStyle(`
    #downloadMain { position: fixed; z-index: 999; right: 0; bottom: 20px; background: #fff; }
    #downloadMain-bd { box-sizing: border-box; height: 60px; padding: 10px; border: 1px solid #ccc; }
    #downloadMainBtn { font-size: 13px; line-height: 39px; display: inline-block; width: 60px; height: 40px; margin-left: -5px; text-align: center; text-decoration: none; color: #fff; background: #4d90fe; }
    #zizhuPopupMainInput { display: inline-block; box-sizing: border-box; width: 210px; height: 40px; padding: 0 10px; border: 1px solid #ccc; outline: none; }
`);

// 添加内容
var smallCnt = `
    <div id="downloadMain">
        <input type="text" name="" placeholder="与真实页面的偏移量，没啥用填0" id="zizhuPopupMainInput" />
        <a href="javascript:void(0);" id="downloadMainBtn">下载</a>
    </div>`;
// 添加到 body
var odom = document.createElement("div");
odom.id = "downloadMain";
odom.innerHTML = smallCnt;
document.body.appendChild(odom);

/* 这是一个封装好的下载文件的函数 */
const downFile = (url, name, type) => {
    return new Promise((resolve, reject) => {
        fileAjax(url, function (xhr) {
            downloadFile(xhr.response, name.concat(type));
            resolve(); // 下载完成后解析Promise
        }, {
            responseType: 'blob'
        }, reject);
    });
};

function fileAjax(url, callback, options, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    if (options.responseType) {
        xhr.responseType = options.responseType;
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr);
        } else if (xhr.readyState === 4) {
            reject(new Error('请求失败'));
        }
    };
    xhr.send();
}

function downloadFile(content, filename) {
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement('a');
    let blob = new Blob([content]);
    // 通过二进制文件创建url
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    // 销毁创建的url
    window.URL.revokeObjectURL(url);
}

/* 实现sleep函数，减慢速度 */
const sleep = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
};

/* 将http链接追加上https */
const http2https = (http) => {
    return http.slice(0, 4).concat("s", http.slice(4));
};

/* 以下为针对本页面的逻辑 */
/* 以下为针对本页面获取 提取该页面的图片地址、页数（不是页码）、#id */
const page = (type) => {
    switch (type) {
        case "src": return document.querySelector("img").src; break;
        case "num": return document.querySelector("img").getAttribute("id").substr(6); break; // 获取到id后用substr取第6个字符以后的内容
        case "id": return document.querySelector("img").id; break;
    }
};

const imgID = document.querySelector("img");

const downloadedFiles = []; // 存储已下载文件名

const downloadStart = async () => {
    const offset = Number(document.getElementById("zizhuPopupMainInput").value);
    let currentPageNum = page("num");

    while (currentPageNum >= 0) {
        const fileName = `${String(currentPageNum - offset)}.jpg`;
        console.log(`处理第 ${currentPageNum - offset} 页，文件名: ${fileName}`);

        if (!downloadedFiles.includes(fileName)) {
            console.log(`准备下载 ${fileName}`);
            try {
                await downFile(http2https(page("src")), fileName, ".jpg");
                downloadedFiles.push(fileName); // 记录已下载的文件名
            } catch (error) {
                console.error("下载失败:", error);
            }
        } else {
            console.log(`${fileName} 已经下载过，跳过`);
        }

        // 翻页
        document.querySelector("div[class='page-wrapper']").click();
        await sleep(4000); // 等待页面加载新的图片

        // 更新当前页码
        currentPageNum = page("num");
    }
};

document.getElementById('downloadMainBtn').addEventListener('click', downloadStart); // 监听按钮是否被点击，如果点击则开始下载