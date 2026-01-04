// ==UserScript==
// @name         课堂派PPT保存脚本
// @namespace    https://www.ketangpai.com
// @version      1.0.2
// @description  在点击按钮时保存指定位置的图片，并停止保存最后一张图片。
// @author       废话师
// @match        *://*.ketangpai.com/*
// @require      https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/488079/%E8%AF%BE%E5%A0%82%E6%B4%BEPPT%E4%BF%9D%E5%AD%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/488079/%E8%AF%BE%E5%A0%82%E6%B4%BEPPT%E4%BF%9D%E5%AD%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        setTimeout(mainLogic, 3000);
    });

    function mainLogic() {

        const zip = new JSZip();


        const imageElement = document.querySelector('div.classroom-content img');
        const buttonElement = document.querySelector('i.el-icon-caret-right');


        if (!imageElement || !buttonElement) {
            console.error('页面中不存在指定图片');
            return;
        }


        let previousImageUrl = '';
        let imageCounter = 0;

        // 保存PPT图片到压缩包
        function saveImageToZip(url, fileName) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                onload: function(response) {
                    // 添加到压缩包
                    zip.file(fileName, response.response);
                },
                onerror: function(error) {
                    console.error('获取图片数据时出错：', error);
                }
            });
        }

        // 点击按钮
        function clickButton() {
            buttonElement.click();
        }

        // 循环
        let intervalId = setInterval(() => {
            // 检查，结束
            if (imageElement.src !== previousImageUrl) {
                // 计数
                imageCounter++;
                // 生成文件名
                const fileName = 'image_' + imageCounter + '.png';
                saveImageToZip(imageElement.src, fileName);
                previousImageUrl = imageElement.src;
            } else {
                // 如果相同，停止循环
                clearInterval(intervalId);
                // 生成压缩包并下载
                zip.generateAsync({ type: "blob" })
                    .then(function(content) {
                        // 如果成功生成压缩包
                        if (content) {
                            var link = document.createElement('a');
                            link.href = URL.createObjectURL(content);
                            link.download = "images.zip";

                            link.click();

                            // 删除临时数据
                            URL.revokeObjectURL(link.href);
                            link.remove();

                            // 提示下载成功
                            alert('所有图片已保存为压缩包，现在可以下载！');
                        } else {
                            // 生成压缩包失败
                            console.error('生成压缩包失败！');
                        }
                    })
                    .catch(function(err) {
                        console.error(err);
                    });
            }
            clickButton();
        }, 100);
    }
})();
