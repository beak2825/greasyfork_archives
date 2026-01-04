// ==UserScript==
// @name         IMG複製大師
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  針對網頁上圖片，點擊就複製其網址
// @author       You
// @match         *://*/*
// @icon         https://www.highcharts.com/demo/highcharts/spline-plot-bands
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477141/IMG%E8%A4%87%E8%A3%BD%E5%A4%A7%E5%B8%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/477141/IMG%E8%A4%87%E8%A3%BD%E5%A4%A7%E5%B8%AB.meta.js
// ==/UserScript==
let isEventActive = false; // 用於跟蹤事件的狀態

// 創建一個鏈接元素並設置其屬性
const toastrCssLink = document.createElement('link');
toastrCssLink.rel = 'stylesheet';
toastrCssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css';

// 創建一個腳本元素並設置其屬性
const toastrScript = document.createElement('script');
toastrScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';

// 創建另一個腳本元素並設置其屬性
const toastrScript2 = document.createElement('script');
toastrScript2.src = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js';

// 將鏈接元素和腳本元素添加到文檔頭部
document.head.appendChild(toastrCssLink);
document.head.appendChild(toastrScript);
document.head.appendChild(toastrScript2);
// 獲取頁面上的所有img元素
const images = document.querySelectorAll('img');

function removeClickHandler(image) {
    image.removeEventListener('click', clickHandler);
}

function toggleEvent() {
    if (isEventActive) {
        // 如果事件已經激活，則關閉事件
        console.log('IMG複製大師關閉ꐦ°᷄д°᷅');
        // 解除事件監聽
        images.forEach(removeClickHandler);
        isEventActive = false;
    } else {
        // 如果事件尚未激活，則打開事件
        console.log('IMG複製大師啟動ฅ^•ﻌ•^ฅ');
        // 遍歷所有img元素
        images.forEach((image) => {
            // 檢查圖像是否已加載
            if (image.complete) {
                // 圖像已加載，直接添加點擊事件處理程序
                addClickHandler(image);
            } else {
                // 圖像尚未加載，等待加載完成後再添加點擊事件處理程序
                image.addEventListener('load', () => {
                    addClickHandler(image);
                });
            }
        });
        isEventActive = true;
    }
}

document.addEventListener('keydown', (event) => {
    if ((event.key === 'q' && event.ctrlKey) || event.key === 'F8') {
        toggleEvent(); // 切換事件的狀態
    }
});

function transformImageUrl(url) {
    // 使用正則表達式匹配URL中的目標部分
    const regex = /https:\/\/cache.ptt.cc\/c\/https\/i.imgur.com\/([^?]+)/;
    const match = url.match(regex);

    if (match) {
        // 如果匹配成功，構建新的URL
        const imgurId = match[1];
        return `https://i.imgur.com/${imgurId}`;
    } else {
        // 如果沒有匹配到目標部分，返回原始URL
        return url;
    }
}

// 創建一個函數，用於添加點擊事件處理程序並處理圖像的src
function addClickHandler(image) {
    image.addEventListener('click', clickHandler);
}

// 創建一個函數，用於處理點擊事件
function clickHandler() {
    let src = this.src;
    src = transformImageUrl(src);
    const textArea = document.createElement('textarea');
    textArea.value = src;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    // 使用 toastr 進行通知
    toastr.success('網址複製完成: ' + src);
}

