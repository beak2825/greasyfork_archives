// ==UserScript==
// @name         NSFC_conclusion_downloader_Enhanced
// @namespace    https://blog.xianx.info/ // 
// @version      1.1 // 你可以根据需要更新版本号
// @description  帮助你直接下载国自然结题报告 (增强版: 增加延迟和日志)
// @author       xianx (Modified by [你的名字或昵称])
// @license      MIT  // 
// @match        https://kd.nsfc.gov.cn/finalDetails*
// @match        https://kd.nsfc.cn/finalDetails*
// @require      https://unpkg.com/jspdf@2.3.0/dist/jspdf.umd.min.js
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.js
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/537382/NSFC_conclusion_downloader_Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/537382/NSFC_conclusion_downloader_Enhanced.meta.js
// ==/UserScript==

/* globals $, jspdf */

(async function() {
    'use strict';

    // 准备交互按钮
    const downloadBtn = $('<div class="el-button is-round" style="margin-left: 10px;">下载全文</div>'); // 增加一些左边距

    // 点击交互按钮时需要开始下载操作
    downloadBtn.click(async () => {
        downloadBtn.prop('disabled', true).addClass('is-disabled').text('准备下载...');
        if (!/暂无结题报告全文/.test($('#related').text())) {
            // 获得项目信息： 编号（加密后）、批准号、项目名称
            const urlParams = new URLSearchParams(location.search);
            const dependUintID = urlParams.get('id');
            const projectID = $('.basic_info > div.el-row div:contains("项目批准号：") + div').text().trim();
            const projectName = $('.basic_info > div.el-row div:contains("项目名称：") + div').text().trim();

            console.log(`开始下载: ${projectID} ${projectName}`);
            console.log(`项目ID (加密): ${dependUintID}`);

            // 准备需要的PDF文件，并删除初始页
            const doc = new jspdf.jsPDF();
            doc.deletePage(1);
            doc.setDocumentProperties({
                title: `${projectID} ${projectName}`,
                subject: location.href,
                creator: 'NSFC_conclusion_downloader_Enhanced'
            });

            let has_download_error = 0;
            const image = new Image();

            // 核心下载方法
            for (let i = 1; ; i++) {
                downloadBtn.text(`正在下载第 ${i} 页...`);
                console.log(`尝试下载第 ${i} 页...`);

                // 【修改点】增加并启用随机等待时间（3-5秒），防止服务器压力过大或触发限制
                await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 3000));

                try {
                    // 1. 获取图片链接
                    console.log(`请求 API: /api/baseQuery/completeProjectReport, id: ${dependUintID}, index: ${i}`);
                    const { data: requestData } = await $.post('/api/baseQuery/completeProjectReport', { id: dependUintID, index: i });
                    console.log(`第 ${i} 页 API 响应:`, requestData);

                    if (!requestData || !requestData.url) {
                         console.error(`第 ${i} 页 API 响应异常，未包含 URL:`, requestData);
                         throw new Error(`第 ${i} 页 API 响应异常`); // 抛出错误以便捕获
                    }

                    // 2. 获取 Blob 形式的 imageData
                    console.log(`下载图片: ${requestData.url}`);
                    const imageDataAsBlob = await $.ajax({
                        url: requestData.url,
                        method: 'GET',
                        xhrFields: { responseType: 'blob' },
                        timeout: 30000 // 设置 30 秒超时
                    });

                    // 3. 加载图片并获取宽高
                    image.src = URL.createObjectURL(imageDataAsBlob);
                    await image.decode(); // 等待图片解码完成

                    // 4. 将图片添加进 PDF
                    doc.addPage([image.width, image.height], image.width < image.height ? 'p' : 'l');
                    doc.addImage(image, "PNG", 0, 0, image.width, image.height);
                    console.log(`第 ${i} 页下载并添加成功。`);

                    // 释放 Blob URL 资源
                    URL.revokeObjectURL(image.src);

                    // 5. 检查是否还有下一页
                    if (requestData.hasnext === false) {
                        console.log("检测到 hasnext === false，下载结束。");
                        break;
                    }

                } catch (e) {
                    // 【修改点】增加详细错误日志
                    console.error(`下载第 ${i} 页时发生错误!`, e);
                    let errMsg = `Fail to download Page.${i}.`;
                    if (e.status) {
                       console.error(`HTTP 状态码: ${e.status}`);
                       errMsg += ` Status: ${e.status}.`;
                    }
                    if (e.responseText) {
                       console.error("响应文本:", e.responseText);
                    }
                    console.error("请检查浏览器开发者工具的 '网络' 和 '控制台' 标签页获取更多信息。");

                    if (e.status === 404) { // 仍然认为 404 是最后一页（或者 API 找不到该页）
                        console.warn(`收到 404 错误，认为已到达最后一页。`);
                        break;
                    } else { // 其他错误
                        doc.addPage('a4', 'p');
                        doc.text(`${errMsg}\nPlease check and re-download it.`, 10, 10);

                        has_download_error += 1;
                        // 不再自动启用按钮，避免用户在错误状态下重试
                        // downloadBtn.prop('disabled', false).removeClass('is-disabled');
                    }

                    // 连续 5 次出错，认为存在网络或者其他问题，需要用户检查
                    if (has_download_error >= 5) {
                        console.error("连续下载错误达到 5 次，终止下载。");
                        downloadBtn.text('错误过多，已停止');
                        alert("连续下载错误达到 5 次，已停止下载。请检查网络或开发者控制台！");
                        return; // 直接退出点击事件处理函数
                    }
                }
            }

            // 保存 PDF
            try {
                console.log("所有页面处理完毕，开始生成并保存 PDF 文件...");
                doc.save(`${projectID} ${projectName}.pdf`);
                downloadBtn.text(has_download_error > 0 ? '下载完成（有错误，请检查）': '下载完成！');
                // 允许用户再次点击（如果需要）
                downloadBtn.prop('disabled', false).removeClass('is-disabled');
            } catch (saveError) {
                 console.error("保存 PDF 时出错:", saveError);
                 downloadBtn.text('保存 PDF 失败');
                 alert(`保存 PDF 时出错: ${saveError.message}`);
                 downloadBtn.prop('disabled', false).removeClass('is-disabled');
            }

        } else {
             alert("当前页面显示“暂无结题报告全文”，无法下载。");
             downloadBtn.prop('disabled', false).removeClass('is-disabled').text('下载全文');
        }
    });

    // 将交互按钮插入到页面中
    console.log("NSFC Downloader: 正在等待页面元素加载...");
    const observer = new MutationObserver(mutations => {
        const conclusion_another = $('div.link_title:has(div:contains("结题报告"),div:contains("全文"))');
        // 确保按钮存在且未被添加
        if (conclusion_another.length > 0 && downloadBtn.parent().length === 0) {
            console.log("NSFC Downloader: 找到目标位置，正在插入按钮...");
            conclusion_another.find('div.verticalBar_T').after(downloadBtn);
            // 可以选择断开观察，如果按钮只需要插入一次
            // observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();