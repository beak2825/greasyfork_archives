// ==UserScript==
// @name         Bilibili 分享链接优化
// @namespace    http://tampermonkey.net/
// @version      0.8.0.8
// @description  简化Bilibili分享链接，移除多余的赛博狗屎并优化显示格式。
// @author       0808
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522717/Bilibili%20%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/522717/Bilibili%20%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

/**
 * 简化分享链接
 * @param {string} text 原始分享内容
 * @returns {string} 简化后的内容
 */
function simplifyText(text) {
    // 移除 "share_source" 和 "vd_source" 参数，同时保留 "?t" 和 "?p"
    let cleanedText = text.replace(/([&?])(share_source|vd_source)=[^&]*/g, (match, p1) => {
        return p1 === '?' ? '?' : ''; // 如果是问号，保留问号
    });

    // 修复多余 "&" 和 "?&"
    cleanedText = cleanedText
        .replace(/&+/g, '&') // 合并多余的 "&"
        .replace(/\?&/, '?') // 修复 "?&"
        .replace(/[&?]$/, ''); // 去除末尾 "&"/"?"

    // 提取 URL 部分
    const urlMatch = cleanedText.match(/https?:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : '';

    // 提取 t 和 p 参数
    const tMatch = url.match(/t=(\d+)/);
    const pMatch = url.match(/p=(\d+)/);

    // 构建时间信息
    let timeInfo = '';
    if (tMatch) {
        const seconds = parseInt(tMatch[1], 10);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        // 构建时间字符串，只有小时数大于 0 时才显示小时
        timeInfo = `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // 构建分集信息
    let partInfo = '';
    if (pMatch) {
        partInfo = `P${pMatch[1]}`;
    }

    // 提取标题部分
    const titleElement = document.querySelector('.inner-video-title .title-text');
    let title = titleElement ? titleElement.textContent.trim() : '视频标题';

    // 构建最终标题格式
    let formattedTitle = `【${title}`;
    if (partInfo) formattedTitle += `| ${partInfo}`;
    if (timeInfo) formattedTitle += `| ${timeInfo}`;
    formattedTitle += '】';

    console.log(`title: [${title}]; partInfo:[${partInfo}]; timeInfo:[${timeInfo}]; url:[${url}]`);

    // 返回最终格式
    return `${formattedTitle} ${url}`;
}

    /**
     * 尝试绑定分享按钮事件
     */
    function tryBindShareButton() {
        console.log('尝试绑定分享按钮...');
        const shareButton = document.querySelector('.bar-right .copy-link');

        if (shareButton) {
            console.log('找到分享按钮，绑定事件...');
            shareButton.addEventListener('click', async () => {
                try {
                    // 等待剪贴板内容写入完成
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // 读取剪贴板内容
                    const originalText = await navigator.clipboard.readText();
                    console.log('原始剪贴板内容:', originalText);

                    // 处理并简化内容
                    const simplifiedText = simplifyText(originalText);
                    console.log('简化后的内容:', simplifiedText);

                    // 写入简化内容到剪贴板
                    await navigator.clipboard.writeText(simplifiedText);

                    // 成功
                    console.log('已将简化的分享链接复制到剪贴板：', simplifiedText);
                } catch (error) {
                    console.error('处理剪贴板内容时出错:', error);
                    alert('处理分享链接时出错');
                }
            });
        } else {
            console.log('未找到分享按钮，1秒后重试...');
            setTimeout(tryBindShareButton, 1000); // 1秒后重试
        }
    }

    // 初始化脚本
    console.log('脚本已加载');
    tryBindShareButton();
})();
