// ==UserScript==
// @name         NSFC_conclusion_2024.2.4
// @namespace    https://blog.rhilip.info/
// @version      24.2.7
// @description  帮助你直接下载国自然结题报告
// @author       Rhilip
// @match        https://kd.nsfc.gov.cn/finalDetails*
// @match        https://kd.nsfc.cn/finalDetails*
// @require      https://unpkg.com/jspdf@2.3.0/dist/jspdf.umd.min.js
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/486834/NSFC_conclusion_202424.user.js
// @updateURL https://update.greasyfork.org/scripts/486834/NSFC_conclusion_202424.meta.js
// ==/UserScript==

/* globals $, jspdf */

// 异步函数，用于加载图片并确保图片完全加载
async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        // 当图片加载成功时解析 Promise
        image.onload = function() {
            resolve(image);
        };

        // 当图片加载失败时拒绝 Promise，并传递错误信息
        image.onerror = function() {
            reject(new Error('Failed to load image.'));
        };

        // 设置图片的 URL，触发加载过程
        image.src = url;
    });
}

// 异步函数，用于加载图片并具备重试机制和检查机制
async function loadImageWithRetryAndCheck(url, maxRetries = 5, delay = 10000, checkInterval = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const image = await loadImage(url);
            return image; // 图片加载成功，解析 Promise
        } catch (error) {
            // 图片加载失败，等待一段时间后再次尝试
            console.error(`Image loading attempt ${attempt} failed. Retrying in ${delay / 1000} seconds. Error: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, delay));

            // 检查图片是否已经加载完成，如果是则立即返回
            try {
                await loadImage(url);
                console.log(`Image loaded after delay during check.`);
                return; // 图片已加载完成，不再等待
            } catch (checkError) {
                // 图片还未加载完成，继续检查
            }
        }
    }

    // 图片加载尝试达到最大次数后，拒绝 Promise
    throw new Error(`Failed to load image after ${maxRetries} attempts.`);
}

// 核心下载循环，使用 loadImageWithRetryAndCheck 函数确保图片完全加载后再添加到 PDF
(async function() {
    'use strict';

    // 准备交互按钮
    const downloadBtn = $('<div class="el-button is-round">下载全文</div>');

    // 点击交互按钮时需要开始下载操作
    downloadBtn.click(async () => {
        downloadBtn.prop('disabled', true).addClass('is-disabled');
        if (!/暂无结题报告全文/.test($('#related').text())) {
            // 获得项目信息： 编号（加密后）、批准号、项目名称
            const urlParams = new URLSearchParams(location.search);
            const dependUintID = urlParams.get('id');
            const projectID = $('.basic_info > div.el-row div:contains("项目批准号：") + div').text();
            const projectName = $('.basic_info > div.el-row div:contains("项目名称：") + div').text();

            // 准备需要的PDF文件，并删除初始页
            const doc = new jspdf.jsPDF();
            doc.deletePage(1);
            doc.setDocumentProperties({
                title: `${projectID} ${projectName}`,
                subject: location.href,
                creator: 'NSFC_conclusion_downloader'
            });

            let has_download_error = 0;

            // 核心下载方法
            for (let i = 1;; i++) {
                downloadBtn.text(`正在下载第 ${i} 页`);

                try {
                    // 获得图片链接
                    const { data: requestData } = await $.post('/api/baseQuery/completeProjectReport', { id: dependUintID, index: i });

                    // 获得Blob形式的imageData，这样可以防止image.src和jsPDF.addImage会产生两次图片请求，浪费带宽
                    // （实际变成了一次请求服务器和两次请求本地blob）
                    const imageDataAsBlob = await $.ajax({
                        url: requestData.url,
                        method: 'GET',
                        xhrFields: { responseType: 'blob' }
                    });

                    // 使用 loadImageWithRetryAndCheck 函数确保图片加载完整
                    await loadImageWithRetryAndCheck(URL.createObjectURL(imageDataAsBlob));

                    // 将图片添加进PDF中
                    const loadedImage = await loadImage(URL.createObjectURL(imageDataAsBlob));
                    doc.addPage([loadedImage.width, loadedImage.height], loadedImage.width < loadedImage.height ? 'p' : 'l');
                    doc.addImage(loadedImage, "PNG", 0, 0, loadedImage.width, loadedImage.height);

                    if (requestData.hasnext === false) {
                        console.log('No more pages to download.');
                        break; // hasnext可能为null，此处应该明确为false才break
                    }
                } catch (e) {
                    // 处理下载图片失败的情况
                    console.error(`Failed to download Page.${i}, Please check and re-download it. Error: ${e.message}`);
                    has_download_error += 1;
                    downloadBtn.prop('disabled', false).removeClass('is-disabled');
                    break; // 增加一行，确保在下载失败时停止下载
                }
            }

            // 我们并没法 await 保存过程，所以直接显示下载完成就好，浏览器处理好会自动显示下载文件
            doc.save(`${projectID} ${projectName}.pdf`);
            downloadBtn.text(has_download_error > 0 ? '下载过程中可能出错，请检查下载文件或尝试重新下载': '下载完成');
        }
    });

    // 将交互按钮插入到页面中
    const observer = new MutationObserver(mutations => {
        const conclusion_another = $('div.link_title:has(div:contains("结题报告"),div:contains("全文"))');
        if (conclusion_another.length > 0 && downloadBtn.is(':hidden')) {
            conclusion_another.find('div.verticalBar_T').after(downloadBtn);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();