// ==UserScript==
// @name         NSFC_conclusion_downloader
// @namespace    https://blog.rhilip.info/
// @version      1.13
// @description  帮助你直接下载国自然结题报告
// @author       Rhilip
// @match        https://kd.nsfc.gov.cn/finalDetails*
// @match        https://kd.nsfc.cn/finalDetails*
// @require      https://unpkg.com/jspdf@2.3.0/dist/jspdf.umd.min.js
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/421052/NSFC_conclusion_downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/421052/NSFC_conclusion_downloader.meta.js
// ==/UserScript==

/* globals $, jspdf */

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
            const image = new Image();
            for (let i=1;;i++) {
                downloadBtn.text(`正在下载第 ${i} 页`);

                // 随机等待一段时间（2-3秒）防止国自然服务器压力过大
                // await new Promise(resolve => setTimeout(resolve, Math.random() * 1e3 + 2e3));

                try {
                    // 获得图片链接
                    const { data: requestData } = await $.post('/api/baseQuery/completeProjectReport', {id: dependUintID, index: i});

                    // 获得Blob形式的imageData，这样可以防止image.src和jsPDF.addImage会产生两次图片请求，浪费带宽
                    // （实际变成了一次请求服务器和两次请求本地blob）
                    const imageDataAsBlob = await $.ajax({
                        url: requestData.url,
                        method: 'GET',
                        xhrFields: { responseType: 'blob'}
                    });
                    // 加载图片并获得图片的 width, height 属性
                    image.src = URL.createObjectURL(imageDataAsBlob);
                    await image.decode();

                    // 将图片添加进PDF中
                    doc.addPage([image.width, image.height], image.width < image.height ? 'p' : 'l');
                    doc.addImage(image, "PNG", 0, 0, image.width, image.height);

                    if (requestData.hasnext === false) break; // hasnext可能为null，此处应该明确为false才break
                } catch (e) {
                    if (e.status === 404) { // 说明此时已经到了最后一页
                        break;
                    } else { // 其他错误
                        doc.addPage('a4', 'p');
                        doc.text(`Fail to download Page.${i}, Please check and re-download it.`, 10, 10);

                        // 对下载出错的重新启用下载按钮并计数
                        has_download_error += 1;
                        downloadBtn.prop('disabled', false).removeClass('is-disabled');
                    }

                    // 连续5次出错，认为存在网络或者其他问题，需要用户检查
                    if (has_download_error >= 5) {
                        break;
                    }
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