// ==UserScript==
// @name         导出百度贴吧楼主帖子
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  将百度贴吧某帖子中楼主的所有发言保存为 HTML 文件，方便离线浏览
// @author       wiiiind
// @match        https://tieba.baidu.com/p/*
// @grant        GM_download
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/518200/%E5%AF%BC%E5%87%BA%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%A5%BC%E4%B8%BB%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/518200/%E5%AF%BC%E5%87%BA%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%A5%BC%E4%B8%BB%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 添加按钮到页面
    function addButton() {
        const button = document.createElement('a');
        button.innerText = '保存楼主发言';
        button.href = 'javascript:;';
        button.className = 'btn-sub btn-small';
        button.onclick = saveTiebaPosts;
        
        // 找到按钮组区域
        const btnGroup = document.querySelector('.core_title_btns');
        if (btnGroup) {
            // 插入到按钮组的第一个位置
            btnGroup.insertBefore(button, btnGroup.firstChild);
        }
    }

    let currentPage = 1;
    let totalPages = 1;
    let posts = [];

    function fetchPosts(page) {
        const url = window.location.href.replace(/&pn=\d+/, '') + '&pn=' + page;
        return fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const postElements = doc.querySelectorAll('.l_post');

                postElements.forEach(post => {
                    try {
                        // 获取IP属地
                        const ipSpan = post.querySelector('.post-tail-wrap span:not([class])');
                        const ip = ipSpan ? ipSpan.innerText.trim().replace(/^IP属地:/, '') : '未知IP';

                        // 获取其他信息
                        const tailInfoSpans = post.querySelectorAll('.post-tail-wrap .tail-info');
                        let deviceInfo = '未知设备';
                        let floor = '未知楼层';
                        let time = '未知时间';

                        // 遍历所有tail-info span，找到包含设备信息、楼层和时间的span
                        tailInfoSpans.forEach(span => {
                            const text = span.innerText.trim();
                            if (span.querySelector('a') && text.includes('来自')) {
                                deviceInfo = span.querySelector('a').innerText.trim();
                            } else if (text.includes('楼')) {
                                floor = text;
                            } else if (text.match(/\d{4}-\d{2}-\d{2}/)) {
                                time = text;
                            }
                        });

                        // 获取内容
                        const contentElement = post.querySelector('.d_post_content');
                        const content = contentElement ? contentElement.innerHTML.trim() : '';

                        // 修改图片获取逻辑，只获取BDE_Image类的图片
                        const images = Array.from(post.querySelectorAll('.d_post_content img.BDE_Image')).map(img => img.src || '');

                        posts.push({
                            ip,
                            deviceInfo,
                            floor,
                            time,
                            content,
                            images
                        });
                    } catch (error) {
                        console.error('处理帖子时出错:', error);
                    }
                });

                return Promise.resolve();
            })
            .catch(error => {
                console.error(`获取第${page}页数据时出错:`, error);
            });
    }

    function savePosts() {
        const title = document.querySelector('.core_title_txt').innerText.trim();
        const date = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const fileName = `${title}_${date.split(' ')[0]}.html`;

        // 获取楼主信息
        const authorElement = document.querySelector('.d_name .p_author_name');
        const authorName = authorElement ? authorElement.innerText : '未知用户';
        const authorLink = authorElement ? authorElement.href : '#';
        const authorAvatar = document.querySelector('.p_author_face img');
        const avatarSrc = authorAvatar ? authorAvatar.src : '';
        const originalLink = window.location.href;

        // 在生成HTML前对posts进行排序
        posts.sort((a, b) => {
            // 从楼层文本中提取数字
            const getFloorNumber = (floor) => {
                const match = floor.match(/(\d+)/);
                return match ? parseInt(match[1], 10) : 0;
            };
            
            return getFloorNumber(a.floor) - getFloorNumber(b.floor);
        });

        let htmlContent = `
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
                <script>
                    // 免责声明弹窗
                    window.onload = function() {
                        const disclaimer = \`1. 本帖子保存时间：${date}
2. 本脚本旨在为用户提供便利，用于个人备份公开访问的内容。请确保您在使用本脚本时遵守相关平台的用户协议及法律法规。
3. 本脚本仅限个人学习、研究或备份用途，禁止用于任何非法行为，包括但不限于：未经授权抓取、复制、传播受版权保护的内容或侵犯他人合法权益。
4. 使用本脚本可能涉及到技术风险，例如账号被限制或封禁等情况。请在使用前充分了解风险，并自行承担因使用脚本所引发的后果。
5. 本脚本的作者不对因脚本使用导致的任何直接或间接后果承担责任，包括但不限于数据丢失、账号封禁或其他法律责任。
6. 作者保留修改、更新或终止维护脚本的权利。\`;

                        window.alert = function(msg) {
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';
                            document.body.appendChild(iframe);
                            const alertFrame = iframe.contentWindow;
                            const result = alertFrame.alert(msg);
                            iframe.parentNode.removeChild(iframe);
                            return result;
                        };
                        
                        alert(disclaimer);
                    }

                    // 跳转楼层的函数
                    function jumpToFloor() {
                        const targetFloor = parseInt(prompt('请输入要跳转的楼层号：'));
                        if (!targetFloor) return;

                        // 获取所有楼层
                        const floors = Array.from(document.querySelectorAll('table[data-floor]'))
                            .map(table => ({
                                element: table,
                                floor: parseInt(table.getAttribute('data-floor'))
                            }))
                            .sort((a, b) => a.floor - b.floor);
                        
                        // 找到目标楼层或最近的前一个楼层
                        let targetElement = null;
                        for (let i = floors.length - 1; i >= 0; i--) {
                            if (floors[i].floor <= targetFloor) {
                                targetElement = floors[i].element;
                                break;
                            }
                        }

                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                            // 如果不是精确匹配，显示提示
                            if (parseInt(targetElement.getAttribute('data-floor')) < targetFloor) {
                                alert('未找到该楼层，已定位到最近的前一个楼层：' + 
                                      targetElement.getAttribute('data-floor') + '楼');
                            }
                        } else {
                            // 如果连第一层都大于目标楼层，就跳转到第一层
                            if (floors.length > 0) {
                                floors[0].element.scrollIntoView({ behavior: 'smooth' });
                                alert('未找到该楼层，已定位到第一个楼层：' + 
                                      floors[0].floor + '楼');
                            }
                        }
                    }
                </script>
                <style>
                    body { 
                        margin: 20px; 
                        font-family: Arial, sans-serif;
                        max-width: 794px;  /* A4 width */
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .header {
                        position: sticky;
                        top: 0;
                        background: white;
                        width: 100%;
                        z-index: 100;
                        padding: 10px 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        border-bottom: 1px solid #eee;
                    }
                    .title {
                        font-size: 24px;
                        font-weight: bold;
                        margin: 10px 0;
                        text-align: center;
                    }
                    .content-wrapper {
                        margin-top: 20px;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .author-info {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                        gap: 10px;
                    }
                    .author-avatar {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                    }
                    .links {
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    .links a {
                        color: #4CAF50;
                        text-decoration: none;
                        margin: 0 10px;
                    }
                    .links a:hover {
                        text-decoration: underline;
                    }
                    table { 
                        border-collapse: collapse; 
                        width: 100%;  /* Use full width of body */
                        margin-bottom: 20px;
                        position: relative; 
                    }
                    tr {
                        display: flex; 
                    }
                    td { 
                        padding: 10px; 
                        vertical-align: top; 
                    }
                    .info-cell { 
                        width: 22%; 
                        border-right: 1px solid #ddd;
                    }
                    .content-cell { 
                        width: 78%;
                        flex: 1; 
                    }
                    .floor-number { 
                        font-size: 18px; 
                        font-weight: bold; 
                        margin-bottom: 10px; 
                    }
                    .info-item { 
                        margin: 5px 0; 
                        color: #666; 
                    }
                    img { 
                        max-width: 100%; 
                        margin: 5px 0; 
                    }
                    .jump-btn {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        z-index: 1000;
                    }
                    
                    .jump-btn:hover {
                        background: #45a049;
                    }
                    
                    /* 让表格有一个data-floor属性用于跳转 */
                    table {
                        scroll-margin-top: 100px; /* 跳转时留出顶部空间 */
                    }
                    
                    /* 添加免责声明的样式 */
                    .disclaimer {
                        white-space: pre-wrap;
                        font-family: monospace;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        color: #666;
                        font-size: 14px;
                        margin-top: 40px;
                        border-top: 1px solid #eee;
                    }
                    .footer a {
                        color: #4CAF50;
                        text-decoration: none;
                    }
                    .footer a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <button class="jump-btn" onclick="jumpToFloor()">跳转到指定楼层</button>
                <div class="header">
                    <div class="title">${title}</div>
                </div>
                <div class="content-wrapper">
                    <div class="author-info">
                        <img class="author-avatar" src="${avatarSrc}" alt="${authorName}">
                        <a href="${authorLink}" target="_blank">${authorName}</a>
                    </div>
                    <div class="links">
                        <a href="${originalLink}" target="_blank">查看原帖</a>
                        <a href="${authorLink}" target="_blank">作者主页</a>
                    </div>
                    <!-- 帖子内容将在这里显示 -->
        `;

        posts.forEach(post => {
            // 从content中移除所有BDE_Image图片
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = post.content;
            tempDiv.querySelectorAll('img.BDE_Image').forEach(img => img.remove());
            const contentWithoutImages = tempDiv.innerHTML;

            htmlContent += `
            <table data-floor="${post.floor.match(/(\d+)/)?.[1] || '0'}">
                <tr>
                    <td class="info-cell">
                        <div class="floor-number">${post.floor}</div>
                        <div class="info-item">IP属地: ${post.ip}</div>
                        <div class="info-item">设备: ${post.deviceInfo}</div>
                        <div class="info-item">时间: ${post.time}</div>
                    </td>
                    <td class="content-cell">
                        <div>${contentWithoutImages}</div>
                        <div>${post.images.map(src => `<img src="${src}" class="BDE_Image">`).join('')}</div>
                    </td>
                </tr>
            </table>
            `;
        });

        // 获取当前登录用户信息
        const userElement = document.querySelector('.u_menu_username a');
        const userName = userElement ? userElement.querySelector('.u_username_title').textContent : '未登录用户';
        const userLink = userElement ? userElement.href : '#';

        htmlContent += `
            <div class="footer">
                帖子由<a href="${userLink}" target="_blank">@${userName}</a>通过<a href="https://greasyfork.org/zh-CN/scripts/518200-tieba-op-posts-saver" target="_blank">此脚本</a>自动抓取生成。
                欲查看于移动设备，请<a href="javascript:void(0)" onclick="printToPDF()">另存为PDF</a>。
            </div>
            <script>
                function printToPDF() {
                    if (confirm('请选择"另存为PDF"打印机进行打印')) {
                        window.print();
                    }
                }
            </script>
        </body>
        </html>
        `;

        // 添加打印样式
        const printStyles = `
            @media print {
                .jump-btn {
                    display: none;  /* 隐藏跳转按钮 */
                }
                
                /* 确保内容完整打印 */
                .content-cell img {
                    break-inside: avoid;
                }
                
                /* 优化打印布局 */
                table {
                    break-inside: avoid;
                    page-break-inside: avoid;
                }
            }
        `;

        // 将打印样式插入到现有样式中
        htmlContent = htmlContent.replace('</style>', printStyles + '</style>');

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    function saveTiebaPosts() {
        console.log('开始保存楼主发言...');
        
        // 检查是否在只看楼主模式
        if (!window.location.href.includes('see_lz=1')) {
            alert('此功能需要在"只看楼主"模式下使用。\n\n请先点击帖子上方的"只看楼主"按钮，然后再次点击"保存楼主发言"。');
            // 找到"只看楼主"按钮并高亮显示
            const lzOnlyBtn = document.querySelector('#lzonly_cntn');
            if (lzOnlyBtn) {
                // 保存原始样式
                const originalBackground = lzOnlyBtn.style.background;
                const originalTransition = lzOnlyBtn.style.transition;
                
                // 添加闪烁效果
                lzOnlyBtn.style.transition = 'background 0.5s';
                lzOnlyBtn.style.background = '#ffd700';
                
                // 1秒后恢复原样
                setTimeout(() => {
                    lzOnlyBtn.style.background = originalBackground;
                    lzOnlyBtn.style.transition = originalTransition;
                }, 1000);
            }
            return;
        }

        // 清空之前的帖子数据
        posts = [];
        currentPage = 1;
        
        // 获取总页数
        const lastPageLink = document.querySelector('.l_pager a[href*="pn="]:last-child');
        if (lastPageLink) {
            const match = lastPageLink.href.match(/pn=(\d+)/);
            if (match) {
                totalPages = parseInt(match[1], 10);
            }
        }

        console.log(`总页数: ${totalPages}`);

        // 创建一个加载提示
        const loadingDiv = document.createElement('div');
        loadingDiv.style.position = 'fixed';
        loadingDiv.style.top = '50%';
        loadingDiv.style.left = '50%';
        loadingDiv.style.transform = 'translate(-50%, -50%)';
        loadingDiv.style.padding = '20px';
        loadingDiv.style.background = 'rgba(0,0,0,0.8)';
        loadingDiv.style.color = 'white';
        loadingDiv.style.borderRadius = '5px';
        loadingDiv.style.zIndex = '10000';
        document.body.appendChild(loadingDiv);

        // 使Promise.all和分批处理来获取所有页面
        const batchSize = 5; // 每批处理5个页面
        const batches = [];
        
        for (let i = 1; i <= totalPages; i += batchSize) {
            const batch = [];
            for (let j = i; j < Math.min(i + batchSize, totalPages + 1); j++) {
                batch.push(fetchPosts(j));
            }
            batches.push(batch);
        }

        // 按批次处理所有页面
        let processedPages = 0;
        const processBatch = async (batchIndex) => {
            if (batchIndex >= batches.length) {
                // 所有批次处理完成，保存文件
                loadingDiv.remove();
                savePosts();
                return;
            }

            await Promise.all(batches[batchIndex]);
            processedPages += batches[batchIndex].length;
            loadingDiv.textContent = `正在获取帖子内容... ${Math.min(processedPages, totalPages)}/${totalPages}`;
            
            // 延迟处理下一批次，避免请求过快
            setTimeout(() => processBatch(batchIndex + 1), 1000);
        };

        loadingDiv.textContent = '正在获取帖子内容... 0/' + totalPages;
        processBatch(0);
    }

    // 初始化
    addButton();
})();