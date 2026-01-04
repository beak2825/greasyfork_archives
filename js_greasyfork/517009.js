// ==UserScript==
// @name         国家中小学智慧教育平台电子课本下载
// @description  在国家中小学智慧教育平台网站中添加电子课本下载按钮，下载电子课本
// @namespace    https://github.com/BaeKey/smartedu
// @version      0.1.1
// @match        https://basic.smartedu.cn/tchMaterial/detail?contentType=assets_document*
// @icon         https://basic.smartedu.cn/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517009/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%AC%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/517009/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E7%94%B5%E5%AD%90%E8%AF%BE%E6%9C%AC%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    function createDownloadButton() {
        // 创建按钮元素
        const button = document.createElement('button');
        button.textContent = '下载文档';

        // 设置按钮样式
        button.style.position = 'fixed';
        button.style.position = 'fixed';
        button.style.top = '13vh';
        button.style.right = '0.2vw';
        button.style.padding = '1em 1em';
        button.style.fontSize = '1rem';
        button.style.backgroundColor = '#ff7d24';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';

        // 按钮点击事件
        button.onclick = main;

        // 将按钮添加到页面中
        document.body.appendChild(button);
    }

    window.onload = function() {
        console.log("Window 加载完成，创建下载按钮...");
        createDownloadButton();
    };

    var main = async function() {
        var params = new URLSearchParams(document.location.search);
        var id = params.get("contentId");

        if (id) {
            // 获取下载地址
            var jsonUrl = `https://s-file-2.ykt.cbern.com.cn/zxx/ndrv2/resources/tch_material/details/${id}.json`;
            try {
                let response = await fetch(jsonUrl);
                if (response.ok) {
                    let data = await response.json();
                    let tiItems = data.ti_items || [];
                    let downUrl = tiItems[1].ti_storages[0];
                    // 获取文件名
                    var fileName = document.querySelector("span.fish-breadcrumb-link").innerText;

                    if (fileName && downUrl) {
                        // 获取认证请求头
                         let authHeader = await authEncrypt(downUrl, 'GET');
                         // 发起下载请求
                         downloadWithHeaders(downUrl, fileName, authHeader);
                    }
                }
            }
             catch (error) {
                console.error('JSON 解析出错：', error);
            }

        }
    }

    // 下载函数，携带认证头
    function downloadWithHeaders(url, fileName, authHeader) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "x-nd-auth": authHeader,
            },
            responseType: "blob",
            onload: function(response) {
                if (response.status === 200) {
                    // 创建一个 Blob 对象，并用来生成下载链接
                    const blob = response.response;
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = fileName + ".pdf";
                    link.click();
                } else {
                    console.error('下载失败，状态码:', response.status);
                }
            },
            onerror: function(error) {
                console.error('请求错误:', error);
            }
        });
    }

    // 生成认证的请求头
    function authEncrypt(url, methodType) {
        // 获取当前时间戳（毫秒）
        const currentTimeMs = Date.now();
        // 生成一个 700 到 900 之间的随机数
        // 将参数 diff 转换为整数
        const diff = Math.floor(Math.random() * (900 - 700 + 1)) + 700;
        const diffInt = parseInt(diff, 10);

        // 生成随机字符串
        const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let randomStr = '';
        for (let i = 0; i < 8; i++) {
            randomStr += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // 拼接时间戳、整数部分和随机字符串
        const nonce = `${currentTimeMs + diffInt}:${randomStr}`;

        // 解析 URL 并构造相对路径
        const urlObj = new URL(url);
        const relativePath = urlObj.pathname + (urlObj.search || "") + (urlObj.hash || "");
        const authority = urlObj.host;

        // 构造签名字符串
        const signatureString = `${nonce}\n${methodType}\n${relativePath}\n${authority}\n`;

        // 获取 accessToken 和 macKey
        let { accessToken, macKey } = getAccessTokenAndMacKeyFromLocalStorage();
        // 计算 HMAC-SHA256
        const macBytes = new TextEncoder().encode(macKey);
        const signatureBytes = new TextEncoder().encode(signatureString);


        return crypto.subtle.importKey(
            "raw",
            macBytes,
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        ).then(key => crypto.subtle.sign("HMAC", key, signatureBytes))
         .then(hmacBuffer => {
            // 转换为 Base64 编码的字符串
            const base64Encoded = btoa(String.fromCharCode(...new Uint8Array(hmacBuffer)));

            // 返回认证签名字符串
            return `MAC id="${accessToken}",nonce="${nonce}",mac="${base64Encoded}"`;
        });
    }

    // 获取access_token
    function getAccessTokenAndMacKeyFromLocalStorage() {
        // 遍历 localStorage 寻找符合条件的键
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            // 检查键是否以 "ND_UC_AUTH" 开头并以 "token" 结尾
            if (key.startsWith("ND_UC_AUTH") && key.endsWith("token")) {
                try {
                    // 获取键对应的值并解析为 JSON 对象
                    const valueJson = JSON.parse(localStorage.getItem(key));

                    // 检查是否存在 "value" 键且对应值也是 JSON
                    if (valueJson && valueJson.value) {
                        const innerValue = JSON.parse(valueJson.value);

                        // 获取 "access_token" 值
                        const accessToken = innerValue.access_token;
                        const macKey = innerValue.mac_key;
                        if (accessToken && macKey) {
                            return { accessToken, macKey };
                        } else {
                            console.warn("access_token 未找到");
                            return null;
                        }
                    } else {
                        console.warn("未找到 value 字段或 JSON 格式错误");
                        return null;
                    }
                } catch (error) {
                    console.error("JSON 解析出错:", error);
                    return null;
                }
            }
        }
        console.warn("未找到符合条件的键");
        return null;
    }
})();