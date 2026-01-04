// ==UserScript==
// @name         大麦直达二维码一键生成（带文字版）
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  一键生成大麦直达二维码，直接截图用大麦APP扫码就可以
// @author       加入付费更新群：先加作者Q2556106259
// @match        https://m.damai.cn/*
// @grant        GM_addStyle
// @license      白开水
// @downloadURL https://update.greasyfork.org/scripts/472527/%E5%A4%A7%E9%BA%A6%E7%9B%B4%E8%BE%BE%E4%BA%8C%E7%BB%B4%E7%A0%81%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%EF%BC%88%E5%B8%A6%E6%96%87%E5%AD%97%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472527/%E5%A4%A7%E9%BA%A6%E7%9B%B4%E8%BE%BE%E4%BA%8C%E7%BB%B4%E7%A0%81%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%EF%BC%88%E5%B8%A6%E6%96%87%E5%AD%97%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

GM_addStyle(`
#qrcode-button {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 9999;
    width: 120px;
    height: 120px;
    background-color: #007bff;
    color: #fff;
    font-size: 20px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

#update-button {
    position: fixed;
    top: 150px;
    left: 20px;
    z-index: 9999;
    width: 120px;
    height: 120px;
    background-color: #007bff;
    color: #fff;
    font-size: 20px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
`);

function extractIdFromUrl(url) {
    const regex = /Id=(\d+)/;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}

function generateQRCode(url, text) {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=200x200&color=${getRandomColor()}`;

    const qrCodeContainer = document.createElement("div");
    qrCodeContainer.style.position = "fixed";
    qrCodeContainer.style.top = "50%";
    qrCodeContainer.style.left = "50%";
    qrCodeContainer.style.transform = "translate(-50%, -50%)";
    qrCodeContainer.style.backgroundColor = "#fff";
    qrCodeContainer.style.padding = "20px";
    qrCodeContainer.style.borderRadius = "10px";
    qrCodeContainer.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";

    const qrCodeImage = document.createElement("img");
    qrCodeImage.style.width = "200px";
    qrCodeImage.style.height = "200px";
    qrCodeImage.src = qrCodeUrl;
    qrCodeContainer.appendChild(qrCodeImage);

    const textElement = document.createElement("div");
    textElement.style.textAlign = "center";
    textElement.style.marginTop = "10px";
    textElement.textContent = text;
    qrCodeContainer.appendChild(textElement);

    document.body.appendChild(qrCodeContainer);
}

function addButton() {
    const button = document.createElement("button");
    button.id = "qrcode-button";
    button.textContent = "生成二维码";
    button.addEventListener("click", function () {
        const currentUrl = window.location.href;
        const id = extractIdFromUrl(currentUrl);
        if (id) {
            const newUrl = `https://m.damai.cn/damai/cyclops/scan.html?url=https://m.damai.cn/damai/detail/sku.html?id={id}`;

            var elements = document.getElementsByClassName("title-container-title false false");
            if (elements.length > 0) {
                var content = elements[0].textContent;
                generateQRCode(newUrl, content);
            } else {
                alert("未找到符合条件的文本");
            }
        } else {
            alert("无法提取ID");
        }
    });

    document.body.appendChild(button);
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function addUpdateButton() {
    const updateButton = document.createElement("button");
    updateButton.id = "update-button";
    updateButton.textContent = "获取最新版";
    updateButton.addEventListener("click", function () {
    
        const textToCopy = "684011433";
        copyTextToClipboard(textToCopy);

        alert("获取最新版请联系群主加入付费Q群：684011433，已将群号复制到剪切板直接粘贴搜索即可");
    });

    document.body.appendChild(updateButton);
}

function copyTextToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

(function () {
    'use strict';
    addButton();
    addUpdateButton(); // 添加新的“获取最新版”按钮
})();
