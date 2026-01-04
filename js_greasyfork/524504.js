// ==UserScript==
// @name         小薛视频链接提取助手
// @description  A script to scrape video information from Douyin and download it as a CSV file.
// @version      1.1
// @match        *://*.douyin.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @locale       en-US
// @license      MIT
// @namespace https://greasyfork.org/users/1426027
// @downloadURL https://update.greasyfork.org/scripts/524504/%E5%B0%8F%E8%96%9B%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/524504/%E5%B0%8F%E8%96%9B%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


// 创建悬浮窗
function createFloatingWindow() {
    const floatingDiv = document.createElement('div');
    floatingDiv.id = 'video-scraper-status';
    floatingDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 9999;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(floatingDiv);
    return floatingDiv;
}

// 更新悬浮窗信息
function updateStatus(message) {
    let statusDiv = document.getElementById('video-scraper-status');
    if (!statusDiv) {
        statusDiv = createFloatingWindow();
    }
    statusDiv.innerHTML = message;
}

// 移除悬浮窗
function removeStatus() {
    const statusDiv = document.getElementById('video-scraper-status');
    if (statusDiv) {
        statusDiv.remove();
    }
}

// 视频信息提取函数
function extractVideoInfo() {
    const results = new Set(); // 使用Set去重
    updateStatus('正在提取视频信息...');

    // 多种选择器组合以提高匹配成功率
    const videoElements = [
     ...document.querySelectorAll('a.uz1VJwFY.TyuBARdT.IdxE71f8'),
     ...document.querySelectorAll('a[href*="/video/"]')
    ];

    videoElements.forEach(element => {
        try {
            const link = element.href;
            if (!link ||!link.includes('/video/')) return;

            // 向上查找包含完整信息的容器
            const container = element.closest('li') || element.closest('[class*="container"]');
            if (!container) return;

            // 查找点赞数和标题
            const likeElement = container.querySelector('.BgCg_ebQ');
            const titleElement = container.querySelector('.EtttsrEw') ||
                container.querySelector('.eJFBAbdI.H4IE9Xgd');

            // 清理标题文本，移除点赞数和多余空格
            let title = titleElement?.textContent?.trim() || '无标题';
            // 移除标题中的点赞数（通常格式为"数字+万"或纯数字）
            title = title.replace(/\d+\.?\d*万?(?=\s|$|\n)/g, '').trim();
            // 移除可能存在的"置顶"等标记
            title = title.replace(/^(置顶|共创|精选)\s*/g, '').trim();

            const videoInfo = {
                url: link,
                title: title,
                likes: likeElement?.textContent?.trim() || '0'
            };

            // 使用URL作为唯一标识符去重
            results.add(JSON.stringify(videoInfo));

            // 更新悬浮窗显示当前找到的视频数量
            updateStatus(`已找到 ${results.size} 个视频`);
        } catch (err) {
            console.error('提取视频信息时出错:', err);
        }
    });

    return Array.from(results).map(item => JSON.parse(item));
}

// 下载结果为CSV文件
function downloadResults(results) {
    // 添加BOM以支持Excel中文显示
    const BOM = "\uFEFF";
    const csvContent = BOM + "视频标题,点赞数,视频链接\n" +
        results.map(item =>
            `"${item.title.replace(/"/g, '""')}","${item.likes}","${item.url}"`
        ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.setAttribute('href', url);
    link.setAttribute('download', `抖音视频信息_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 主函数
async function main() {
    try {
        console.log('开始抓取视频信息...');
        updateStatus('正在初始化...');

        // 等待页面加载完成
        if (document.readyState!== 'complete') {
            await new Promise(resolve => window.addEventListener('load', resolve));
        }

        // 提取视频信息
        const videos = extractVideoInfo();
        console.log(`共找到 ${videos.length} 个视频`);

        if (videos.length > 0) {
            updateStatus(`完成！共抓取到 ${videos.length} 个视频<br>正在下载CSV文件...`);
            downloadResults(videos);
            setTimeout(() => {
                updateStatus(`✅ 已完成<br>共抓取 ${videos.length} 个视频<br>CSV文件已下载`);
                // 3秒后移除状态窗口
                setTimeout(removeStatus, 3000);
            }, 1000);
        } else {
            updateStatus('❌ 未找到任何视频<br>请确保页面包含视频内容');
            setTimeout(removeStatus, 3000);
        }
    } catch (err) {
        console.error('抓取过程出错:', err);
        updateStatus('❌ 发生错误<br>请查看控制台了解详情');
        setTimeout(removeStatus, 3000);
    }
}

// 监听来自background.js的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractVideos') {
        // 移除可能存在的旧状态窗口
        removeStatus();
        main();
    }
});