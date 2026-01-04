// ==UserScript==
// @name         6002255音乐网 点击即下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修改直接点击下载链接即创建下载窗口方便下载
// @author       Tou_taozi
// @match        http://www.6002255.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/526151/6002255%E9%9F%B3%E4%B9%90%E7%BD%91%20%E7%82%B9%E5%87%BB%E5%8D%B3%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/526151/6002255%E9%9F%B3%E4%B9%90%E7%BD%91%20%E7%82%B9%E5%87%BB%E5%8D%B3%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    '6002255音乐网 点击即下载';

    // 获取存储下载地址的元素
    const downloadUrlElement = document.getElementById('j-src');
    const downloadbtnElement = document.getElementById('j-src-btn');
    if (downloadUrlElement&&downloadbtnElement) {
        downloadUrlElement.addEventListener('click', async function(event) {
            event.preventDefault();

            // 获取下载地址
            const downloadUrl = this.value;
            const fileName = downloadbtnElement.dataset.download || downloadbtnElement.getAttribute('download') || '音乐.mp3';
            console.log(downloadUrl);
            console.log(fileName);
                GM_download({
                    url: downloadUrl,
                    name: fileName, // 下载的文件名
                    onload: function() {
                        console.log('下载完成');
                    },
                    onerror: function(error) {
                        console.error('下载失败:', error);
                    }
                });
        });
    }
})();