// ==UserScript==
// @name         中少快乐阅读平台中少报刊资源下载器
// @namespace    http://tampermonkey.net/
// @version      0.2.6
// @description  在幼儿画报期刊列表页为每一期添加“下载”按钮，自动下载 XML 中的高分辨率图像资源（href2）并打包为 ZIP 文件
// @author       野原新之布
// @license      GPL-3.0-only
// @match        http://202.96.31.36:8888/reading/onemagazine/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download

// @note    2025.05.09-v0.2.6 修复幼儿画报课堂无法下载的bug
// @note    2025.05.09-v0.2.5 监听页面内容变化，确保动态加载的内容也能添加下载按钮
// @note    2025.05.09-v0.2.4 修复嘟嘟熊画报不能正常下载的bug
// @note    2025.05.09-v0.2.3 完善下载按钮的样式
// @note    2025.05.09-v0.2.2 修复被Chrome阻止下载的bug
// @note    2025.05.09-v0.2.1 修复无法下载报纸资源的bug
// @note    2025.05.09-v0.2 完成在期刊展示列表中添加下载按钮进行下载
// @note    2025.05.08-v0.1 完成阅读刊物时自动下载资源
// @downloadURL https://update.greasyfork.org/scripts/535366/%E4%B8%AD%E5%B0%91%E5%BF%AB%E4%B9%90%E9%98%85%E8%AF%BB%E5%B9%B3%E5%8F%B0%E4%B8%AD%E5%B0%91%E6%8A%A5%E5%88%8A%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535366/%E4%B8%AD%E5%B0%91%E5%BF%AB%E4%B9%90%E9%98%85%E8%AF%BB%E5%B9%B3%E5%8F%B0%E4%B8%AD%E5%B0%91%E6%8A%A5%E5%88%8A%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 引入 JSZip 库
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js';
    document.head.appendChild(script);
 
    // 主函数：添加下载按钮
    function addDownloadButtons() {
        // 提取URL前缀
        const origin = window.location.origin;
        // 查找所有的期刊项（排除已包含下载按钮的项）
        const items = document.querySelectorAll('li.col-md-3.col-sm-3.col-xs-6:not(.has-download-btn)');

        items.forEach(item => {
            // 标记已处理的项
            item.classList.add('has-download-btn');
            
            // 提取期号信息
            const imgElement = item.querySelector('img');
            const hrefElement = item.querySelector('a');

            if (imgElement && hrefElement) {
                // 从图片的 src 获取期号
                const imgSrc = imgElement.src;
                // 通过 '/fliphtml5/password/' 将路径分割
                const imgSrcPath = imgSrc.split('/fliphtml5/password/')[1];
                // 分割剩下的路径
                const imgSrcPathParts = imgSrcPath.split('/');

                if (imgSrcPathParts.length >= 7) {
                    // 路径的第三部分，如main、other
                    const channel = imgSrcPathParts[0];
                    // 提取期刊或报纸类别，如qikan、baozhi
                    const categoryPrefix = imgSrcPathParts[1];
                    // 提取具体分类，如wmakx、youerhb
                    const subCategory = imgSrcPathParts[2];
                    // 获取年份
                    const year = imgSrcPathParts[3];
                    // 获取月份
                    const month = imgSrcPathParts[4];
                    // 获取编号部分
                    const number = imgSrcPathParts[5];
                    // 获取 xmlFileName，不包括 "_cover_.jpg"
                    const xmlFileName = imgSrcPathParts[8].split('_cover_')[0] + '.xml';

                    // 获取详情页的 URL
                    const publicationUrl = origin + hrefElement.getAttribute('href');

                    // 获取 publicationTitle
                    fetch(publicationUrl)
                        .then(response => response.text())
                        .then(pageContent => {
                            // 从页面中提取 <title> 标签内容
                            const titleMatch = pageContent.match(/<title>(.*?)<\/title>/);
                            const publicationTitle = titleMatch ? titleMatch[1] : '未找到标题';

                            const xmlUrl = `${origin}/fliphtml5/password/${channel}/${categoryPrefix}/${subCategory}/${year}/${month}/${number}/web/html5/tablet/${xmlFileName}`;

                            // 创建下载按钮
                            const downloadButton = document.createElement('button');
                            downloadButton.textContent = '下载';
                            downloadButton.classList.add('btn', 'btn-primary');
                            downloadButton.style.marginTop = '10px';
                            downloadButton.style.position = 'relative';
                            downloadButton.style.padding = '10px 20px';
                            downloadButton.style.width = '100%';
                            downloadButton.style.border = '2px solid #007bff';
                            downloadButton.style.backgroundColor = '#007bff';
                            downloadButton.style.color = 'white';

                            // 创建进度条的内层 div，初始时不显示进度条
                            const progressBarContainer = document.createElement('div');
                            progressBarContainer.style.position = 'absolute';
                            progressBarContainer.style.top = '0';
                            progressBarContainer.style.left = '0';
                            progressBarContainer.style.width = '0%';
                            progressBarContainer.style.height = '100%';
                            progressBarContainer.style.backgroundColor = '#28a745';
                            progressBarContainer.style.borderRadius = '5px';
                            progressBarContainer.style.transition = 'width 0.3s';
                            progressBarContainer.style.display = 'none';

                            // 将进度条嵌入到按钮内部
                            downloadButton.appendChild(progressBarContainer);

                            // 为按钮添加点击事件
                            downloadButton.addEventListener('click', () => {
                                // 显示进度条并立即开始进度更新
                                progressBarContainer.style.display = 'block';
                                progressBarContainer.style.width = '0%';

                                // 使用 fetch 直接加载 XML 文件
                                fetch(xmlUrl)
                                    .then(response => {
                                        if (!response.ok) throw new Error('XML 加载失败');
                                        // 获取文件的文本内容
                                        return response.text();
                                    })
                                    .then(xmlContent => {
                                        // 解析 XML 内容
                                        const parser = new DOMParser();
                                        const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
                                    
                                        // 获取 manifest 下的所有 item
                                        const itemNodes = Array.from(xmlDoc.getElementsByTagName('item'));
                                        
                                        if (itemNodes.length === 0) {
                                            alert('XML 中没有找到 <item> 元素');
                                            return;
                                        }

                                        const zip = new JSZip();
                                        let completed = 0;
                                        const baseUrl = xmlUrl.replace(/[^/]+\.xml$/, '');

                                        // 下载每个 item 中的资源并打包到 ZIP
                                        itemNodes.forEach((item, index) => {
                                            const href2 = item.getAttribute('href2');
                                            const href = item.getAttribute('href');
                                            const filePath = href2 || href;
                                            if (!filePath) return;

                                            const fileUrl = baseUrl + filePath;
                                            const fileName = filePath.split('/').pop();

                                            fetch(fileUrl)
                                                .then(res => res.arrayBuffer())
                                                .then(data => {
                                                    zip.file(fileName, data);
                                                    completed++;
                                                    const percent = Math.round((completed / itemNodes.length) * 100);
 
                                                    // 更新进度条宽度
                                                    progressBarContainer.style.width = `${percent}%`;

                                                    // 所有文件下载完成后生成 ZIP 文件并触发下载
                                                    if (completed === itemNodes.length) {
                                                        zip.generateAsync({ type: 'blob' }).then(blob => {
                                                            const zipUrl = URL.createObjectURL(blob);
                                                            GM_download({
                                                                url: zipUrl,
                                                                name: `${year}${month}-${publicationTitle}.zip`.replace(/[\\/:*?"<>|]/g, '_'),
                                                                onload: () => URL.revokeObjectURL(zipUrl),
                                                                onerror: err => console.error('下载失败:', err)
                                                            });
                                                        });
                                                    }
                                                })
                                                .catch(err => console.error(`下载失败: ${fileUrl}`, err));
                                        });
                                    })
                                    .catch(err => {
                                        alert('加载 XML 文件失败');
                                        console.error(err);
                                    });
                            });

                            // 将下载按钮添加到期刊项中
                            item.appendChild(downloadButton);
                        })
                        .catch(err => console.error('获取刊物标题失败:', err));
                }
            }
        });
    }

    // 初始运行
    addDownloadButtons();

    // 监听列表区域变化
    const listPanel = document.getElementById('listPanel');
    if (listPanel) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    addDownloadButtons();
                }
            });
        });

        observer.observe(listPanel, {
            childList: true,
            subtree: true
        });
    }

    // 监听年份切换按钮点击
    document.querySelectorAll('.year-grid a.onereadlistlink').forEach(link => {
        link.addEventListener('click', function() {
            // 添加一个小延迟确保新内容加载完成
            setTimeout(addDownloadButtons, 500);
        });
    });
})();