// ==UserScript==
// @name        下载 pdfjm.cn 里面的pdf
// @namespace   Violentmonkey Scripts
// @match       https://pdfjm.cn/api/pdf/pdf*
// @grant       none
// @version     1.0
// @author      -
// @license MIT
// @description 2025/1/3 13:10:24
// @downloadURL https://update.greasyfork.org/scripts/522665/%E4%B8%8B%E8%BD%BD%20pdfjmcn%20%E9%87%8C%E9%9D%A2%E7%9A%84pdf.user.js
// @updateURL https://update.greasyfork.org/scripts/522665/%E4%B8%8B%E8%BD%BD%20pdfjmcn%20%E9%87%8C%E9%9D%A2%E7%9A%84pdf.meta.js
// ==/UserScript==
(function () {
  'use strict';

  function createDownloadButton(pdfUrl) {
        // 检查是否已经存在按钮，避免重复添加
        if (document.querySelector('#download-pdf-button')) return;

        // 创建按钮
        const button = document.createElement('button');
        button.id = 'download-pdf-button';
        button.textContent = 'PDF 文件';
        button.style.position = 'fixed';
        button.style.bottom = '200px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = '#FFF';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // 按钮点击事件
        button.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'file.pdf'; // 下载时的默认文件名
            link.click();
        });

        // 添加到页面
        document.body.appendChild(button);
    }

    const scripts = document.querySelectorAll('script');
    scripts.forEach((script) => {
        const scriptContent = script.textContent || '';
        const regex = /axios\.get\(['"]([^'"]+)['"]/g;
        let match;
        while ((match = regex.exec(scriptContent)) !== null) {
            const url = match[1];
            console.log('Found Axios URL:', url);

            if (url.startsWith('/api/pdf/uurl')) {
                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        const decodedData = atob(data.data);
                        console.log('PDF链接:', decodedData);
                        createDownloadButton(decodedData);
                    })
                    .catch((error) => {
                        console.error('Error fetching Axios URL:', error);
                    });
            }
        }
    });
})();