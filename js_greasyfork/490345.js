// ==UserScript==
// @name         显示可下载资源(仅针对高校网站）
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  在页面顶部显示一个圆圈按钮，中间带数字，表示当前页面上可下载资源的数量（重复链接只计算一次）。点击圆圈后以列表形式展示资源名称，旁边带复选框以便选择多个下载。点击“下载选中项”按钮在新标签页打开选中的链接。
// @author       laisheng
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490345/%E6%98%BE%E7%A4%BA%E5%8F%AF%E4%B8%8B%E8%BD%BD%E8%B5%84%E6%BA%90%28%E4%BB%85%E9%92%88%E5%AF%B9%E9%AB%98%E6%A0%A1%E7%BD%91%E7%AB%99%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/490345/%E6%98%BE%E7%A4%BA%E5%8F%AF%E4%B8%8B%E8%BD%BD%E8%B5%84%E6%BA%90%28%E4%BB%85%E9%92%88%E5%AF%B9%E9%AB%98%E6%A0%A1%E7%BD%91%E7%AB%99%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!location.hostname.includes('.edu')) {
        return;
    }

    const downloadableExtensions = [
        '.zip', '.exe', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
        '.mp3', '.mp4', '.avi', '.mov', '.apk', '.rar', '.7z', '.tar', '.gz', '.tgz'
    ];

    function isDownloadableLink(url) {
        return downloadableExtensions.some(extension => url.endsWith(extension));
    }

    // Initially collect all links
    const links = Array.from(document.querySelectorAll('a'));

    // Use a Map to track unique links based on href
    const uniqueLinksMap = new Map();

    links.forEach(link => {
        if (isDownloadableLink(link.href) && !uniqueLinksMap.has(link.href)) {
            uniqueLinksMap.set(link.href, link);
        }
    });

    // Convert Map values back to an array for further processing
    const downloadableLinks = Array.from(uniqueLinksMap.values());

    if (downloadableLinks.length > 0) {
        let listContainer;
        let isListVisible = false;

        const toggleResourceList = () => {
            if (!listContainer) {
                listContainer = document.createElement('div');
                listContainer.style = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background-color: white;
                    border: 1px solid #007bff;
                    border-radius: 5px;
                    padding: 10px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    z-index: 10001;
                    display: none;
                `;
                // Part of the script where you generate the list of downloadable links

                const resourcesHTML = downloadableLinks.map(link => `
                    <div>
                        <input type="checkbox" class="download-checkbox" data-href="${link.href}">
                        <a href="${link.href}" target="_blank">${link.textContent.trim() || link.href}</a>
                    </div>
                `).join('');
                // Updated the button action description for clarity
                listContainer.innerHTML = `<h4>可下载资源：</h4>${resourcesHTML}<button id="openSelectedUrls">下载选中项</button>`;
                document.body.appendChild(listContainer);

                document.getElementById('openSelectedUrls').addEventListener('click', function() {
                    const selectedUrls = Array.from(document.querySelectorAll('.download-checkbox:checked')).map(cb => cb.dataset.href);
                    if (selectedUrls.length > 0) {
                        // Inform the user that downloads will be initiated sequentially
                        alert('请按提示下载每个文件。点击确定继续。');

                        // Sequentially prompt the user for each download
                        selectedUrls.forEach((url, index) => {
                            setTimeout(() => {
                                // Open a confirm dialog for each download
                                const proceed = confirm(`下载文件 ${index + 1} / ${selectedUrls.length}? 点击确定下载。`);
                                if (proceed) {
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = url.split('/').pop();
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }
                            }, index * 500); // Adjust time delay as needed to avoid pop-up blockers
                        });
                    } else {
                        alert('没有选中的文件！');
                    }
                });


            }

            isListVisible = !isListVisible;
            listContainer.style.display = isListVisible ? 'block' : 'none';
        };

        const circleButton = document.createElement('div');
        circleButton.textContent = downloadableLinks.length.toString();
        circleButton.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background-color: #007bff;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            font-size: 20px;
        `;
        document.body.appendChild(circleButton);
        circleButton.addEventListener('click', toggleResourceList);

        document.addEventListener('click', (e) => {
            if (isListVisible && listContainer && !listContainer.contains(e.target) && !circleButton.contains(e.target)) {
                toggleResourceList();
            }
        }, true);
    }
})();
