// ==UserScript==
// @name         音乐解锁批量下载 | MusicUnlock Bulk Downloader
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Add batch download functionality to the music unlock tool, with directory selection support and unlock status. 音乐解锁工具添加批量下载功能，支持目录选择和解锁状态显示。
// @author       Gao + GPT-4 + Claude
// @match        https://um-react.netlify.app/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521134/%E9%9F%B3%E4%B9%90%E8%A7%A3%E9%94%81%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%20%7C%20MusicUnlock%20Bulk%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/521134/%E9%9F%B3%E4%B9%90%E8%A7%A3%E9%94%81%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%20%7C%20MusicUnlock%20Bulk%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedDir = null;

    // 创建状态提示框
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = `
        position: fixed;
        top: 60px;
        right: 20px;
        padding: 8px 16px;
        background: #4a5568;
        color: white;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
    `;
    document.body.appendChild(statusDiv);

    // 创建设置目录按钮
    const selectDirBtn = document.createElement('button');
    selectDirBtn.style.cssText = `
       position: fixed;
       top: 20px;
       right: 120px;
       padding: 8px 16px;
       background: #ea4c89;
       color: white;
       border: none;
       border-radius: 8px;
       cursor: pointer;
       font-size: 14px;
       z-index: 9999;
    `;
    selectDirBtn.textContent = "选择下载目录";
    document.body.appendChild(selectDirBtn);

    // 创建下载按钮
    const downloadAllBtn = document.createElement('button');
    downloadAllBtn.style.cssText = `
       position: fixed;
       top: 20px;
       right: 20px;
       padding: 8px 16px;
       background: #ea4c89;
       color: white;
       border: none;
       border-radius: 8px;
       cursor: pointer;
       font-size: 14px;
       z-index: 9999;
    `;
    downloadAllBtn.textContent = "批量下载";
    document.body.appendChild(downloadAllBtn);

    // 定时检查解锁状态
    setInterval(() => {
        const totalSongs = document.querySelectorAll('.chakra-card').length;
        const unlockedSongs = document.querySelectorAll('.chakra-link[download]').length;
        statusDiv.textContent = `${totalSongs}首中的${unlockedSongs}首已成功解锁`;
    }, 100);

    selectDirBtn.onclick = async function() {
        try {
            selectedDir = await window.showDirectoryPicker();
            const permissionStatus = await selectedDir.requestPermission({ mode: 'readwrite' });
            if (permissionStatus === 'granted') {
                alert('下载目录设置成功，已获得修改权限!');
            } else {
                alert('无法获取修改权限，请重新选择目录并授予写入权限！');
                selectedDir = null;
            }
        } catch (err) {
            console.error('选择目录失败:', err);
            selectedDir = null;
        }
    };

    downloadAllBtn.onclick = function() {
        const downloadLinks = Array.from(document.querySelectorAll('.chakra-wrap__list .chakra-link'))
            .filter(link => link.textContent.includes('下载'));

        if (downloadLinks.length === 0) {
            alert('未找到可下载的文件，请先上传音乐文件');
            return;
        }

        if (confirm(`确认下载${downloadLinks.length}个文件？`)) {
            if (selectedDir) {
                downloadLinks.forEach((link, index) => {
                    setTimeout(async () => {
                        try {
                            const response = await fetch(link.href);
                            const blob = await response.blob();
                            const filename = link.download || link.getAttribute('download') ||
                                          decodeURIComponent(link.href.split('/').pop());

                            const fileHandle = await selectedDir.getFileHandle(filename, { create: true });
                            const writable = await fileHandle.createWritable();
                            await writable.write(blob);
                            await writable.close();
                        } catch (err) {
                            console.error('下载失败:', err);
                            link.click();
                        }
                    }, index * 1000);
                });
            } else {
                downloadLinks.forEach((link, index) => {
                    setTimeout(() => link.click(), index * 1000);
                });
            }
        }
    };
})();