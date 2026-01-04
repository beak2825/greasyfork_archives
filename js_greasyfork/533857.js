// ==UserScript==
// @name         MyTV Super 内容提取工具
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  从MyTV Super网站提取内容，保存图片并生成Excel表格
// @author       Fnyfree/AI
// @match        https://www.mytvsuper.com/*
// @grant        none
// @license      MTT
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/533857/MyTV%20Super%20%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/533857/MyTV%20Super%20%E5%86%85%E5%AE%B9%E6%8F%90%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮按钮
    const floatButton = document.createElement('button');
    floatButton.textContent = '提取数据';
    floatButton.style.position = 'fixed';
    floatButton.style.top = '80px';
    floatButton.style.right = '20px';
    floatButton.style.zIndex = '10000';
    floatButton.style.padding = '10px 15px';
    floatButton.style.backgroundColor = '#FFD200';
    floatButton.style.color = 'black';
    floatButton.style.border = 'none';
    floatButton.style.borderRadius = '5px';
    floatButton.style.cursor = 'pointer';
    floatButton.style.fontWeight = 'bold';
    floatButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    document.body.appendChild(floatButton);
    
    // 添加按钮点击事件
    floatButton.addEventListener('click', extractData);
    
    // 修复的中英文分离函数 - 以第一个空格为界
    function separateChineseEnglish(text) {
        // 使用第一个空格作为分界点
        const spaceIndex = text.indexOf(' ');
        
        // 如果没有空格，全部视为中文
        if (spaceIndex === -1) {
            return {
                chinese: text,
                english: ''
            };
        }
        
        // 空格前为中文，空格后为英文
        const chinese = text.substring(0, spaceIndex).trim();
        const english = text.substring(spaceIndex + 1).trim();
        
        return { chinese, english };
    }
    
    // 修复链接格式
    function getCorrectLink(redirectLink, chineseName, englishName) {
        // 检查是否为重定向链接
        if (!redirectLink.includes('/redirect/programme/')) {
            return redirectLink;
        }
        
        // 提取节目ID
        const match = redirectLink.match(/\/redirect\/programme\/(\d+)\//);
        if (!match) return redirectLink;
        
        const programId = match[1];
        
        // 生成英文Slug (使用英文名或程序ID)
        const englishPart = englishName.trim().toLowerCase()
            .replace(/\s+/g, '') // 移除空格
            .replace(/[^a-z0-9]/g, ''); // 只保留字母和数字
            
        const englishSlug = englishPart || 'show';
        
        // 构建新链接 - 直接使用中文，不进行编码
        return `https://www.mytvsuper.com/tc/programme/${englishSlug}_${programId}/${chineseName}/`;
    }
    
    // 将已加载图片转为Canvas数据
    function imageToCanvas(imgElement) {
        return new Promise((resolve, reject) => {
            try {
                // 如果图片还没加载完，等待加载
                if (!imgElement.complete) {
                    imgElement.onload = () => processImage();
                    imgElement.onerror = () => reject(new Error("图片加载失败"));
                } else {
                    processImage();
                }
                
                function processImage() {
                    try {
                        // 创建canvas
                        const canvas = document.createElement('canvas');
                        canvas.width = imgElement.naturalWidth || 200;
                        canvas.height = imgElement.naturalHeight || 200;
                        
                        // 将图片绘制到canvas
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(imgElement, 0, 0);
                        
                        // 获取canvas数据
                        canvas.toBlob(blob => {
                            resolve(blob);
                        }, 'image/jpeg', 0.95);
                    } catch (err) {
                        reject(err);
                    }
                }
            } catch (err) {
                reject(err);
            }
        });
    }
    
    async function extractData() {
        // 显示进度指示器
        const progress = document.createElement('div');
        progress.style.position = 'fixed';
        progress.style.top = '130px';
        progress.style.right = '20px';
        progress.style.padding = '10px';
        progress.style.backgroundColor = 'rgba(0,0,0,0.7)';
        progress.style.color = 'white';
        progress.style.borderRadius = '5px';
        progress.style.zIndex = '10001';
        progress.textContent = '收集数据中...';
        document.body.appendChild(progress);
        
        try {
            // 获取所有节目项
            const items = document.querySelectorAll('.Row_mulitline_item__QtYhU');
            const rawData = [];
            let unloadedImagesCount = 0;
            
            // 收集数据并使用已缓存的图片
            for (let i = 0; i < items.length; i++) {
                progress.textContent = `处理项目 ${i+1}/${items.length}`;
                
                const item = items[i];
                const container = item.querySelector('.mpm-track-item');
                if (!container) continue;
                
                // 获取图片元素和URL
                const imgElement = container.querySelector('img');
                let imgUrl = 'No image';
                let imgBlob = null;
                
                if (imgElement) {
                    imgUrl = imgElement.getAttribute('src');
                    
                    // 检查是否为懒加载图片
                    if (imgUrl && imgUrl.startsWith('data:image/gif;base64')) {
                        imgUrl = '未加载图片';
                        unloadedImagesCount++;
                    } else if (imgUrl && imgUrl !== 'No image') {
                        // 尝试从已加载的图片获取数据
                        try {
                            imgBlob = await imageToCanvas(imgElement);
                        } catch (err) {
                            console.error('无法捕获图片:', err);
                        }
                    }
                }
                
                // 获取节目名称
                const titleElement = container.querySelector('h3');
                const title = titleElement ? titleElement.textContent : 'No title';
                
                // 获取alt属性（可能包含更完整的名称）
                let altText = title;
                if (imgElement && imgElement.getAttribute('alt')) {
                    altText = imgElement.getAttribute('alt');
                }
                
                // 分离中英文名称 - 使用修复后的函数
                const { chinese, english } = separateChineseEnglish(altText);
                
                // 获取链接
                const linkElement = container.querySelector('a.hidden');
                const linkPath = linkElement ? linkElement.getAttribute('href') : '';
                const redirectLink = linkPath ? 'https://www.mytvsuper.com' + linkPath : 'No link';
                
                // 修复链接格式
                const fullLink = getCorrectLink(redirectLink, chinese, english);
                
                // 添加到数据数组
                rawData.push({
                    "序列号": i + 1,
                    "名称": chinese,
                    "英文名": english,
                    "链接": fullLink,
                    "图片URL": imgUrl,
                    "图片Blob": imgBlob
                });
            }
            
            // 去重处理 - 基于名称
            const data = [];
            const nameSet = new Set();
            
            for (const item of rawData) {
                // 如果名称已存在则跳过
                if (item.名称 && nameSet.has(item.名称)) {
                    continue;
                }
                
                // 添加到去重后的数据
                if (item.名称) {
                    nameSet.add(item.名称);
                }
                data.push(item);
            }
            
            // 检查是否有未加载图片
            if (data.length > 0) {
                if (unloadedImagesCount > 0) {
                    const result = confirm(`检测到${unloadedImagesCount}张图片尚未加载，建议滚动页面加载所有内容后再提取。\n是否仍要继续？`);
                    if (!result) {
                        document.body.removeChild(progress);
                        return;
                    }
                }
                
                // 创建数据预览和下载页面
                createDataPage(data);
                progress.textContent = '完成！页面已生成';
                setTimeout(() => {
                    if (progress.parentNode) {
                        document.body.removeChild(progress);
                    }
                }, 2000);
            } else {
                alert('没有找到数据，请确认页面已完全加载');
                document.body.removeChild(progress);
            }
        } catch (error) {
            console.error('处理出错:', error);
            progress.textContent = '处理出错: ' + error.message;
            setTimeout(() => {
                if (progress.parentNode) {
                    document.body.removeChild(progress);
                }
            }, 3000);
        }
    }
    
    // 创建数据预览和下载页面
    function createDataPage(data) {
        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>MyTV Super 内容</title>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
                th { background-color: #f2f2f2; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                .controls { margin: 20px 0; }
                img { max-width: 150px; max-height: 150px; }
                button { padding: 10px 15px; background-color: #4CAF50; color: white; border: none; 
                  border-radius: 5px; cursor: pointer; font-weight: bold; margin-right: 10px; }
                button:hover { background-color: #45a049; }
                .copy-btn { background-color: #2196F3; padding: 3px 8px; margin-top: 5px; }
                .copy-btn:hover { background-color: #0b7dda; }
                .status { margin-left: 15px; display: inline-block; }
            </style>
        </head>
        <body>
            <h1>MyTV Super 内容提取结果</h1>
            
            <div class="controls">
                <button onclick="downloadAll()">下载全部内容(Excel+图片)</button>
                <button onclick="downloadExcel()">仅下载Excel</button>
                <span class="status" id="status"></span>
            </div>
            
            <h2>内容列表 (共${data.length}项，已去重)</h2>
            <table id="content-table">
                <tr>
                    <th>序号</th>
                    <th>名称</th>
                    <th>英文名</th>
                    <th>链接</th>
                    <th>图片</th>
                </tr>
        `;
        
        // 准备Excel数据
        const excelData = [];
        
        // 图片数据，用于下载
        const imageBlobs = [];
        
        data.forEach(item => {
            const imgFileName = `image_${item.序列号}.jpg`;
            
            // 准备Excel数据
            excelData.push({
                "序列号": item.序列号,
                "名称": item.名称,
                "英文名": item.英文名,
                "链接": item.链接,
                "图片": item.图片Blob ? imgFileName : "无图片"
            });
            
            // 准备图片数据
            if (item.图片Blob) {
                imageBlobs.push({
                    blob: item.图片Blob,
                    fileName: imgFileName
                });
            }
            
            // 为URL创建安全的字符串
            const safeLink = item.链接.replace(/'/g, "\\'").replace(/"/g, '\\"');
            
            // 添加表格行
            html += `
            <tr>
                <td>${item.序列号}</td>
                <td>${item.名称}</td>
                <td>${item.英文名}</td>
                <td>
                    <div>${item.链接}</div>
                    <button class="copy-btn" onclick="copyText('${safeLink}')">复制链接</button>
                </td>
                <td>
                    ${item.图片URL && item.图片URL !== 'No image' && item.图片URL !== '未加载图片' ? 
                      `<img src="${item.图片URL}" alt="${item.名称}">` : 
                      '无图片'}
                </td>
            </tr>
            `;
        });
        
        html += `
            </table>
            
            <script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
            <script>
                // Excel数据
                const excelData = ${JSON.stringify(excelData)};
                
                // 图片数据暂存
                const imageUrls = [];
                
                // 状态显示
                const statusEl = document.getElementById('status');
                
                // 页面加载完成后初始化图片URL
                window.onload = function() {
                    const images = document.querySelectorAll('table img');
                    images.forEach((img, index) => {
                        if (img.complete) {
                            processImage(img, index);
                        } else {
                            img.onload = () => processImage(img, index);
                        }
                    });
                    
                    function processImage(img, index) {
                        try {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0);
                            
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                            imageUrls.push({
                                url: dataUrl,
                                fileName: excelData[index].图片
                            });
                        } catch (e) {
                            console.error('图片处理失败:', e);
                        }
                    }
                };
                
                // 下载Excel文件
                function downloadExcel() {
                    statusEl.textContent = "生成Excel中...";
                    
                    try {
                        const worksheet = XLSX.utils.json_to_sheet(excelData);
                        const workbook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workbook, worksheet, "MyTV内容");
                        
                        // 设置列宽
                        const wscols = [
                            {wch: 8},  // 序列号宽度
                            {wch: 30}, // 名称宽度
                            {wch: 30}, // 英文名宽度
                            {wch: 60}, // 链接宽度
                            {wch: 20}  // 图片文件名宽度
                        ];
                        worksheet['!cols'] = wscols;
                        
                        // 下载Excel文件
                        XLSX.writeFile(workbook, "mytvsuper_content.xlsx");
                        statusEl.textContent = "Excel下载完成！";
                    } catch (error) {
                        console.error("Excel生成失败:", error);
                        statusEl.textContent = "Excel生成失败！";
                    }
                }
                
                // 下载所有内容（Excel+图片）
                async function downloadAll() {
                    statusEl.textContent = "正在准备数据...";
                    
                    try {
                        const zip = new JSZip();
                        const imgFolder = zip.folder("images");
                        
                        // 添加Excel文件
                        const worksheet = XLSX.utils.json_to_sheet(excelData);
                        const workbook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workbook, worksheet, "MyTV内容");
                        
                        // 设置列宽
                        const wscols = [
                            {wch: 8},  // 序列号宽度
                            {wch: 30}, // 名称宽度
                            {wch: 30}, // 英文名宽度
                            {wch: 60}, // 链接宽度
                            {wch: 20}  // 图片文件名宽度
                        ];
                        worksheet['!cols'] = wscols;
                        
                        // 添加Excel到ZIP
                        const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
                        zip.file("mytvsuper_content.xlsx", excelBuffer);
                        
                        // 添加图片到ZIP
                        statusEl.textContent = "正在添加图片...";
                        
                        for (let i = 0; i < imageUrls.length; i++) {
                            statusEl.textContent = \`处理图片 \${i+1}/\${imageUrls.length}...\`;
                            
                            try {
                                // 将Data URL转换为Blob
                                const response = await fetch(imageUrls[i].url);
                                const blob = await response.blob();
                                imgFolder.file(imageUrls[i].fileName, blob);
                            } catch (error) {
                                console.error("图片添加失败:", error);
                            }
                        }
                        
                        statusEl.textContent = "正在创建ZIP文件...";
                        
                        // 生成并下载ZIP
                        const content = await zip.generateAsync({type: 'blob'});
                        saveAs(content, "mytvsuper_content.zip");
                        
                        statusEl.textContent = "下载完成！";
                    } catch (error) {
                        console.error("打包失败:", error);
                        statusEl.textContent = "打包失败，请尝试分别下载！";
                    }
                }
                
                // 复制文本到剪贴板
                function copyText(text) {
                    navigator.clipboard.writeText(text)
                        .then(() => {
                            statusEl.textContent = "链接已复制！";
                            setTimeout(() => {
                                statusEl.textContent = "";
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('复制失败:', err);
                            
                            // 备选复制方法
                            const textarea = document.createElement('textarea');
                            textarea.value = text;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                            statusEl.textContent = "链接已复制！";
                            setTimeout(() => {
                                statusEl.textContent = "";
                            }, 2000);
                        });
                }
            </script>
        </body>
        </html>
        `;
        
        // 创建并打开下载页面
        const blob = new Blob([html], {type: 'text/html'});
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
})();
