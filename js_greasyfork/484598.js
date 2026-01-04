// ==UserScript==
// @name           创意工坊下载（自用）
// @version        1.4
// @license        GNU AGPLv3
// @description    使用官方API下载Steam创意工坊内容
// @author         Owwk
// @match          *steamcommunity.com/sharedfiles/filedetails/?*id=*
// @match          *steamcommunity.com/workshop/filedetails/?*id=*
// @grant          GM_xmlhttpRequest
// @connect        api.steampowered.com
// @namespace      owwk
// @downloadURL https://update.greasyfork.org/scripts/484598/%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E4%B8%8B%E8%BD%BD%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/484598/%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E4%B8%8B%E8%BD%BD%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 脚本初始化
    init();
})();

/**
 * 初始化脚本
 */
function init() {
    try {
        // 添加加载动画样式
        addLoadingStyle();
        // 添加下载按钮
        addDownloadButton();
    } catch (error) {
        console.error('创意工坊下载脚本初始化失败:', error);
    }
}

/**
 * 添加加载动画的CSS样式到页面
 */
function addLoadingStyle() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spinner {
            to { transform: rotate(360deg); }
        }
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 8px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spinner 0.8s linear infinite;
            vertical-align: middle;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 创建加载中的按钮HTML
 * @returns {string} 带加载动画的按钮HTML
 */
function createLoadingButtonHTML() {
    return `<div class="subscribeIcon"></div><span class="subscribeText"><div class="subscribeOption subscribe selected" style="min-width: 70px; text-align: center;"><span class="loading-spinner"></span>获取中</div></span>`;
}

/**
 * 发送HTTP POST请求到Steam API
 * @param {string} url - API端点URL
 * @param {string} modID - 创意工坊物品ID
 * @returns {Promise} 返回API响应的Promise
 */
function fetchWorkshopItemDetails(url, modID) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: `itemcount=1&publishedfileids[0]=${modID}&format=json`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: response => {
                try {
                    const data = JSON.parse(response.responseText);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            },
            onerror: error => {
                reject(error);
            }
        });
    });
}

/**
 * 创建下载按钮的HTML样式
 * @param {string} text - 按钮文本
 * @returns {string} 按钮的HTML内容
 */
function createButtonHTML(text) {
    return `<div class="subscribeIcon"></div><span class="subscribeText"><div class="subscribeOption subscribe selected" style="min-width: 70px; text-align: center;">${text}</div></span>`;
}

/**
 * 从URL中提取创意工坊物品ID
 * @returns {string} 创意工坊物品ID
 */
function getWorkshopItemID() {
    const match = /[0-9]{2,15}/.exec(document.URL);
    return match ? match[0] : null;
}

/**
 * 清理文件名，移除不合法字符
 * @param {string} title - 原始标题
 * @returns {string} 清理后的文件名
 */
function sanitizeFileName(title) {
    return title.trim().replace(/[<>:"/\\|?*]+/g, '_');
}

/**
 * 添加下载按钮到页面
 */
async function addDownloadButton() {
    // 创建下载按钮元素
    const downloadBtn = document.createElement("a");
    downloadBtn.classList.add("btn_darkblue_white_innerfade", "btn_border_2px", "btn_medium");
    // 设置按钮固定宽度
    downloadBtn.style.minWidth = "100px";
    // 使用带加载动画的按钮HTML
    downloadBtn.innerHTML = createLoadingButtonHTML();
    
    // 查找要添加按钮的位置
    const subscribeBtn = document.getElementById("SubscribeItemBtn");
    if (!subscribeBtn) {
        console.error('找不到订阅按钮，无法添加下载按钮');
        return;
    }

    // 定位元素位置
    subscribeBtn.style.right = '3px';
    subscribeBtn.style.top = '3px';
    downloadBtn.style.right = '3px';
    downloadBtn.style.top = '40px';
    subscribeBtn.parentNode.insertBefore(downloadBtn, subscribeBtn.nextSibling);
    
    // 获取创意工坊物品ID
    const itemID = getWorkshopItemID();
    if (!itemID) {
        downloadBtn.innerHTML = createButtonHTML("获取ID失败");
        return;
    }
    
    try {
        // 调用Steam API获取物品详情
        const API_URL = 'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v0001/';
        const data = await fetchWorkshopItemDetails(API_URL, itemID);
        
        // 处理API响应
        const fileDetails = data.response.publishedfiledetails[0];
        const fileUrl = fileDetails.file_url;
        
        if (fileUrl) {
            const cleanTitle = sanitizeFileName(fileDetails.title);
            const filename = `下载\\${cleanTitle}.vpk`;
            
            // 更新按钮状态和数据
            downloadBtn.downloadUrl = fileUrl;
            downloadBtn.downloadFilename = filename;
            downloadBtn.innerHTML = createButtonHTML("下载");
            
            // 添加点击事件
            downloadBtn.onclick = () => {
                if (downloadBtn.downloadUrl) {
                    window.location = downloadBtn.downloadUrl;
                    navigator.clipboard.writeText(downloadBtn.downloadFilename);
                    downloadBtn.innerHTML = createButtonHTML("重新下载");
                    console.log(`下载: ${downloadBtn.downloadUrl}`);
                } else {
                    downloadBtn.innerHTML = createButtonHTML("下载失败");
                }
            };
        } else {
            downloadBtn.innerHTML = createButtonHTML("无下载链接");
        }
    } catch (error) {
        console.error('获取创意工坊物品详情失败:', error);
        downloadBtn.innerHTML = createButtonHTML("获取失败");
    }
}
