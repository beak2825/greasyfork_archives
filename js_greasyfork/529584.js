// ==UserScript==
// @name         导出群成员名单
// @namespace    com.junwe.qgtool
// @version      0.1
// @description  导出 QQ 名单已确定哪些成员没有加群
// @author       jw23
// @match        https://qun.qq.com/*
// @require      https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529584/%E5%AF%BC%E5%87%BA%E7%BE%A4%E6%88%90%E5%91%98%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529584/%E5%AF%BC%E5%87%BA%E7%BE%A4%E6%88%90%E5%91%98%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    let buttonContainer = await waitUtil("._operationSection_1pula_8>div");

    let btnWrapper = document.createElement("div");
    btnWrapper.className = "t-space-item";
    let btn = document.createElement("button");
    btn.textContent = "导出群成员"
    btn.className = "t-button t-button--theme-default t-button--variant-base";
    btnWrapper.appendChild(btn);

    btn.onclick = async () => {
        let group_id = prompt("请输入群号");
        try {
            let mems = await colllectMemebers(parseInt(group_id));
            console.log(mems);
            let csv = Papa.unparse(mems)
            exportJsonFile(csv, `${group_id}-members.csv`);
        } catch (err) {
            console.log("抓取群成员失败: ", err);
        }
    }
    buttonContainer.appendChild(btnWrapper)
})();

function getBkn() {
    let t = document.cookie.match(new RegExp(`(^| )skey=([^;]*)(;|$)`));
    let skey = t ? decodeURIComponent(t[2]) : "";
    let r_ = e => {
        let t = 5381;
        for (let n = 0, r = e.length; n < r; ++n)
            t += (t << 5) + e.charAt(n).charCodeAt(0);
        return String(t & 2147483647)
    }
    return r_(skey);
}
async function getMembers(group_id, start = 0, end = 9) {
    let bkn = getBkn();
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: `https://qun.qq.com/cgi-bin/qun_mgr/search_group_members?bkn=${bkn}&ts=${Date.now()}`,
            method: "POST",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "Referer": "https://qun.qq.com/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            data: `st=${start}&end=${end}&sort=1&gc=${group_id}&group_id=${group_id}&bkn=${bkn}`,
            onload: function (response) {
                console.log("Request successful!");
                let data = JSON.parse(response.responseText);
                resolve({ mems: data.mems, count: data.count });
            },
            onerror: function (response) {
                console.error("Request failed!");
                console.error("Response:", response);
                reject(response);
            },
            ontimeout: function (response) {
                console.error("Request timed out!");
                console.error("Response:", response);
                reject(response);
            }
        });
    })
}
async function waitUtil(cssSelector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        let task = setTimeout(() => {
            let el = document.querySelector(cssSelector);
            if (el) {
                resolve(el);
            }
        }, 500)
        setTimeout(() => {
            clearInterval(task);
            resolve("timeout");
        }, timeout)
    })
}
async function colllectMemebers(group_id) {
    let start = 0;
    let step = 9
    let total = 200;
    let memebers = [];
    while (start <= total) {
        try {
            let { mems, count } = await getMembers(group_id, start, start + step);
            total = count;
            memebers.push(...mems);
            start += step;
            start++;
        } catch (err) {
            throw new Error("请求过程出现异常，请检查代码");
        }

    }
    return memebers;
}
function exportJsonFile(data, filename = 'data.json') {
   

    const blob = new Blob([data], { type: 'application/json' }); // 创建 Blob 对象
    const url = URL.createObjectURL(blob); // 创建 Blob URL

    const downloadLink = document.createElement('a'); // 创建下载链接
    downloadLink.href = url;
    downloadLink.download = filename; // 设置下载文件名
    downloadLink.textContent = '下载 JSON 文件'; // 链接文本 (可选)
    downloadLink.style.display = 'none'; // 隐藏链接 (可选，可以设置为可见)

    document.body.appendChild(downloadLink); // 将链接添加到文档 (必须添加到文档才能触发点击)
    downloadLink.click(); // 模拟点击下载链接
    document.body.removeChild(downloadLink); // 移除链接

    URL.revokeObjectURL(url); // 释放 Blob URL (可选，但建议释放)

    console.log(`JSON 文件 "${filename}" 导出成功！`);
}