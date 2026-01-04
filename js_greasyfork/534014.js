// ==UserScript==
// @name          番茄小说下载器
// @author        尘۝醉
// @version       2025.09.07.17
// @description   番茄小说下载
// @description:zh-cn 番茄小说下载
// @description:en    Fanqienovel Downloader
// @license       MIT
// @match         https://fanqienovel.com/page/*
// @match         https://changdunovel.com/*
// @require       https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @icon          https://img.onlinedown.net/download/202102/152723-601ba1db7a29e.jpg
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @namespace     https://github.com/tampermonkey
// @downloadURL https://update.greasyfork.org/scripts/534014/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534014/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 检查是否为书籍信息页面
    let bookId = null;
    // 检查fanqienovel.com的页面
    const fanqienovelMatch = window.location.pathname.match(/^\/page\/(\d+)$/);
    if (fanqienovelMatch) {
        bookId = fanqienovelMatch[1];
    }
    // 检查changdunovel.com的页面
    if (!bookId && window.location.hostname === 'changdunovel.com') {
        const changdunovelMatch = window.location.href.match(/book_id=(\d{19})/);
        if (changdunovelMatch) {
            bookId = changdunovelMatch[1];
        }
    }
    if (!bookId) {
        console.log('番茄小说下载器: 当前页面不是书籍信息页面，不显示下载按钮');
        return;
    }
    // 常量定义
    const BATCH_SIZE = 30; // 批量请求的章节数量
    // EPUB模板
    const EPUB_TEMPLATES = {
        MIMETYPE: 'application/epub+zip',
        CONTAINER: `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
        <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
    </rootfiles>
</container>`
    };

    // 界面样式
    GM_addStyle(`
        .tamper-container {
            position: fixed;
            top: 220px;
            right: 20px;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 15px;
            z-index: 9999;
            width: 200px;
            font-size: 14px;
            line-height: 1.3
        }
        .tamper-button {
            background: #ff6b00;
            color: #fff;
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            margin: 5px 0;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s;
            width: 100%;
            text-align: center
        }
        .tamper-button:hover {
            background: #ff5500
        }
        .tamper-button:disabled {
            background: #ccc;
            cursor: not-allowed
        }
        .tamper-button.txt {
            background: #4CAF50;
        }
        .tamper-button.epub {
            background: #2196F3;
        }
        .stats-container {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            font-size: 12px
        }
        .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            padding: 5px
        }
        .stat-label {
            margin-bottom: 5px;
            color: #666
        }
        .stat-value {
            font-weight: bold;
            font-size: 16px
        }
        .total-value {
            color: #333
        }
        .success-value {
            color: #4CAF50
        }
        .failed-value {
            color: #F44336
        }
        .tamper-notification {
            position: fixed;
            bottom: 40px;
            right: 40px;
            background-color: #4CAF50;
            color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            z-index: 9999;
            font-size: 28px;
            animation: fadeIn 0.5s;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .progress-bar {
            width: 100%;
            height: 10px;
            background-color: #f0f0f0;
            border-radius: 5px;
            margin-top: 10px;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background-color: #4CAF50;
            transition: width 0.3s ease;
        }
    `);

    // 辅助函数
    function decodeHtmlEntities(str) {
        const entities={'&#34;':'"','&#39;':"'",'&amp;':'&','&lt;':'<','&gt;':'>'};
        return str.replace(/&#34;|&#39;|&amp;|&lt;|&gt;/g, match => entities[match]);
    }

    function sanitizeFilename(name) {
        return name.replace(/[\\/*?:"<>|]/g, '').trim();
    }

    function showNotification(message, isSuccess = true) {
        const notification = document.createElement('div');
        notification.className = 'tamper-notification';
        notification.style.cssText = `position:fixed;bottom:40px;right:40px;background-color:${isSuccess ? '#4CAF50' : '#F44336'};color:white;padding:30px;border-radius:10px;box-shadow:0 8px 16px rgba(0,0,0,0.2);z-index:9999;font-size:28px;animation:fadeIn 0.5s`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
        return notification;
    }

    function formatContent(content) {
        let decoded = decodeHtmlEntities(content);
        return decoded.replace(/<p><\/p>/g,'').replace(/<p>/g,'').replace(/<br\/?>/g,'\n').replace(/<\/p>/g,'\n').replace(/<[^>]+>/g,'').replace(/^\s+|\s+$/g,'').replace(/\n{3,}/g, '\n');
    }

    function createDownloadUI() {
        const container = document.createElement('div');
        container.className = 'tamper-container';
        const txtBtn = document.createElement('button');
        txtBtn.className = 'tamper-button txt';
        txtBtn.textContent = '下载TXT';
        container.appendChild(txtBtn);

        const epubBtn = document.createElement('button');
        epubBtn.className = 'tamper-button epub';
        epubBtn.textContent = '下载EPUB';
        epubBtn.style.marginTop = '10px';
        container.appendChild(epubBtn);
        // 添加进度条
        const progressContainer = document.createElement('div');
        progressContainer.style.marginTop = '10px';
        progressContainer.style.display = 'none';
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = '0%';
        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);
        container.appendChild(progressContainer);
        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
        const totalStat = document.createElement('div');
        totalStat.className = 'stat-item';
        totalStat.innerHTML = `
            <div class="stat-label">总章节</div>
            <div class="stat-value total-value">0</div>
        `;
        const successStat = document.createElement('div');
        successStat.className = 'stat-item';
        successStat.innerHTML = `
            <div class="stat-label">成功</div>
            <div class="stat-value success-value">0</div>
        `;
        const failedStat = document.createElement('div');
        failedStat.className = 'stat-item';
        failedStat.innerHTML = `
            <div class="stat-label">失败</div>
            <div class="stat-value failed-value">0</div>
        `;
        statsContainer.appendChild(totalStat);
        statsContainer.appendChild(successStat);
        statsContainer.appendChild(failedStat);
        container.appendChild(statsContainer);
        document.body.appendChild(container);
        return {
            container,
            txtBtn,
            epubBtn,
            progressContainer,
            progressFill,
            updateStats: (total, success, failed) => {
                totalStat.querySelector('.stat-value').textContent = total;
                successStat.querySelector('.stat-value').textContent = success;
                failedStat.querySelector('.stat-value').textContent = failed;
            },
            updateProgress: (percentage) => {
                progressFill.style.width = `${percentage}%`;
            },
            showProgress: () => {
                progressContainer.style.display = 'block';
            },
            hideProgress: () => {
                progressContainer.style.display = 'none';
            }
        };
    }

    async function getBookInfo(bookId) {
        const url = `https://i.snssdk.com/reading/bookapi/multi-detail/v/?aid=1967&book_id=${bookId}`;
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { 'User-Agent': 'okhttp/4.9.3' },
                onload: resolve,
                onerror: reject,
                timeout: 8000
            });
        });
        if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
        const data = JSON.parse(response.responseText);
        if (!data.data || !data.data[0]) throw new Error('未获取到书籍信息');
        const book = data.data[0];
        return {
            title: sanitizeFilename(book.book_name),
            author: sanitizeFilename(book.author),
            abstract: book.abstract,
            wordCount: book.word_number,
            chapterCount: book.serial_count,
            thumb_url: book.thumb_url,
            infoText: `书名：${book.book_name}\n作者：${book.author}\n字数：${parseInt(book.word_number)/10000}万字\n章节数：${book.serial_count}\n简介：${book.abstract}\n免责声明：本小说下载器仅为个人学习、研究或欣赏目的提供便利，下载的小说版权归原作者及版权方所有。若因使用本下载器导致任何版权纠纷或法律问题，使用者需自行承担全部责任。`
        };
    }

    async function getChapters(bookId) {
        const url = `https://fanqienovel.com/api/reader/directory/detail?bookId=${bookId}`;
        const response = await new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { 'User-Agent': 'okhttp/4.9.3' },
                onload: resolve,
                onerror: reject,
                timeout: 8000
            });
        });
        if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
        const text = response.responseText;
        const chapterListMatch = text.match(/"chapterListWithVolume":\[(.*?)\]]/);
        if (!chapterListMatch) throw new Error('未找到章节列表');
        const chapterListStr = chapterListMatch[1];
        const itemIds = chapterListStr.match(/"itemId":"(.*?)"/g).map(m => m.match(/"itemId":"(.*?)"/)[1]);
        const titles = chapterListStr.match(/"title":"(.*?)"/g).map(m => m.match(/"title":"(.*?)"/)[1]);
        return itemIds.map((id, index) => ({
            id: id,
            title: titles[index] || `第${index+1}章`
        }));
    }

    async function downloadChaptersBatch(chapterIds) {
        try {
            const url = `http://localhost:9999/batch_full?item_ids=${chapterIds.join(',')}`;
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: { 'User-Agent': 'okhttp/4.9.3' },
                    onload: resolve,
                    onerror: reject,
                    timeout: 30000 // 增加超时时间，因为批量请求可能更耗时
                });
            });
            if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
            const data = JSON.parse(response.responseText);
            if (!data || !data.data) throw new Error('无效的响应格式');
            return data.data.map(chapter => ({
                title: chapter.title,
                content: formatContent(chapter.content || ''),
                success: true
            }));
        } catch (error) {
            console.error(`批量下载章节失败:`, error);
            // 返回失败的结果
            return chapterIds.map(() => ({
                title: '未知章节',
                content: '[下载失败]',
                success: false
            }));
        }
    }

    /* global JSZip */
    async function generateEPUB(bookInfo, chapters, contents, coverUrl) {
        const zip = new JSZip();
        const uuid = URL.createObjectURL(new Blob([])).split('/').pop();
        const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

        // 1. 必须包含的文件
        zip.file('mimetype', EPUB_TEMPLATES.MIMETYPE, { compression: 'STORE' });

        // 2. 容器文件
        const metaInf = zip.folder('META-INF');
        metaInf.file('container.xml', EPUB_TEMPLATES.CONTAINER);

        // 3. 内容文件夹
        const oebps = zip.folder('OEBPS');

        // 创建Text文件夹
        const textFolder = oebps.folder('Text');

        // 4. CSS样式（增强阅读体验）
        const cssContent = `body { font-family: "Microsoft Yahei", serif; line-height: 1.8; margin: 2em auto; padding: 0 20px; color: #333; text-align: justify; background-color: #f8f4e8; }
h1 { font-size: 1.4em; margin: 1.2em 0; color: #0057BD; }
h2 { font-size: 1.0em; margin: 0.8em 0; color: #0057BD; }
.pic { margin: 50% 30% 0 30%; padding: 2px 2px; border: 1px solid #f5f5dc; background-color: rgba(250,250,250, 0); border-radius: 1px; }
p { text-indent: 2em; margin: 0.8em 0; hyphens: auto; }
.book-info { margin: 1em 0; padding: 1em; background: #f8f8f8; border-radius: 5px; }
.book-info p { text-indent: 0; }`;
        oebps.file('Styles/main.css', cssContent);

        // 5. 封面处理
        let coverImage;
        if (coverUrl) {
            try {
                coverImage = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: coverUrl,
                        responseType: 'blob',
                        onload: (r) => resolve(r.response),
                        onerror: reject
                    });
                });
                oebps.file('Images/cover.jpg', coverImage, { binary: true });

                // 生成封面页面
                const coverHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <title>封面</title>
    <link href="../Styles/main.css" rel="stylesheet"/></head><body><div class="pic"><img src="../Images/cover.jpg" alt="${bookInfo.title}封面" style="max-height: 60vh;"/></div><h1 style="margin-top: 2em;">${bookInfo.title}</h1><h2>${bookInfo.author}</h2>
</body></html>`;
                textFolder.file('cover.html', coverHtml);
            } catch (e) {
                console.warn('封面下载失败:', e);
            }
        }

        // 6. 生成书籍信息页面
        const infoHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <title>书籍信息</title>
    <link href="../Styles/main.css" rel="stylesheet"/></head><body><h1>${bookInfo.title}</h1><div class="book-info"><p><strong>作者：</strong>${bookInfo.author}</p><p><strong>字数：</strong>${parseInt(bookInfo.wordCount)/10000}万字</p><p><strong>章节数：</strong>${bookInfo.chapterCount}</p></div><h2>简介</h2><p>${bookInfo.abstract.replace(/\n/g, '</p><p>')}</p><h2>免责声明</h2><p>本小说下载器仅为个人学习、研究或欣赏目的提供便利，下载的小说版权归原作者及版权方所有。若因使用本下载器导致任何版权纠纷或法律问题，使用者需自行承担全部责任。</p></body></html>`;
        textFolder.file('info.html', infoHtml);

        // 7. 生成章节文件
        const manifestItems = [
            '<item id="css" href="Styles/main.css" media-type="text/css"/>',
            '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',
            coverImage ? '<item id="cover" href="Text/cover.html" media-type="application/xhtml+xml"/>' : '',
            '<item id="info" href="Text/info.html" media-type="application/xhtml+xml"/>',
            coverImage ? '<item id="cover-image" href="Images/cover.jpg" media-type="image/jpeg"/>' : ''
        ].filter(Boolean);

        const spineItems = [
            coverImage ? '<itemref idref="cover"/>' : '',
            '<itemref idref="info"/>'
        ];

        const navPoints = [];

        // 生成章节内容
        chapters.forEach((chapter, index) => {
            const filename = `chapter_${index}.html`;
            const safeContent = contents[index]
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '</p><p>');

            const chapterContent = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html">
<head>
    <title>${chapter.title}</title>
    <link href="../Styles/main.css" rel="stylesheet"/></head><body><h1>${chapter.title}</h1><p>${safeContent}</p></body></html>`;

            textFolder.file(filename, chapterContent);

            manifestItems.push(`<item id="chap${index}" href="Text/${filename}" media-type="application/xhtml+xml"/>`);
            spineItems.push(`<itemref idref="chap${index}"/>`);
            
            // 生成导航点
            navPoints.push(`<navPoint id="navpoint-${index+3}" playOrder="${index+3}">
    <navLabel><text>${chapter.title}</text></navLabel>
    <content src="Text/${filename}"/>
</navPoint>`);
        });

        // 8. 生成toc.ncx文件
        const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
    <head>
        <meta name="dtb:uid" content="urn:uuid:${uuid}"/>
        <meta name="dtb:depth" content="1"/>
        <meta name="dtb:totalPageCount" content="0"/>
        <meta name="dtb:maxPageNumber" content="0"/>
        <meta name="dtb:modified" content="${now}"/>
    </head>
    <docTitle>
        <text>${bookInfo.title}</text>
    </docTitle>
    <navMap>
        <navPoint id="navpoint-1" playOrder="1">
            <navLabel><text>封面</text></navLabel>
            <content src="Text/cover.html"/>
        </navPoint>
        <navPoint id="navpoint-2" playOrder="2">
            <navLabel><text>书籍信息</text></navLabel>
            <content src="Text/info.html"/>
        </navPoint>
        ${navPoints.join('\n        ')}
    </navMap>
</ncx>`;
        oebps.file('toc.ncx', tocNcx);

        // 9. 生成content.opf
        const contentOpf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="uid">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
        <dc:identifier id="uid">urn:uuid:${uuid}</dc:identifier>
        <dc:title>${bookInfo.title}</dc:title>
        <dc:creator>${bookInfo.author}</dc:creator>
        <dc:language>zh-CN</dc:language>
        <meta name="cover" content="cover-image"/>
    </metadata>
    <manifest>
        ${manifestItems.join('\n        ')}
    </manifest>
    <spine toc="ncx">
        ${spineItems.join('\n        ')}
    </spine>
    <guide>
        <reference type="cover" title="封面" href="Text/cover.html"/>
        <reference type="toc" title="目录" href="toc.ncx"/>
    </guide>
</package>`;
        oebps.file('content.opf', contentOpf);

        return await zip.generateAsync({
            type: 'blob',
            mimeType: 'application/epub+zip',
            compression: 'DEFLATE',
            compressionOptions: { level: 9 }
        });
    }

    // 主函数
    async function main() {
        const ui = createDownloadUI();
        let bookInfo, chapters;
        try {
            bookInfo = await getBookInfo(bookId);
            chapters = await getChapters(bookId);
            ui.updateStats(chapters.length, 0, 0);
        } catch (error) {
            showNotification('获取书籍信息失败: ' + error.message, false);
            return;
        }

        let isDownloading = false;
        let successCount = 0;
        let failedCount = 0;
        let contents = [];

        async function startDownload(format) {
            if (isDownloading) return;
            isDownloading = true;
            ui.txtBtn.disabled = true;
            ui.epubBtn.disabled = true;
            ui.showProgress();
            successCount = 0;
            failedCount = 0;
            contents = Array(chapters.length).fill('');
            showNotification('开始批量下载章节内容...');
            // 分批下载章节
            const batchCount = Math.ceil(chapters.length / BATCH_SIZE);
            for (let i = 0; i < batchCount; i++) {
                const startIndex = i * BATCH_SIZE;
                const endIndex = Math.min(startIndex + BATCH_SIZE, chapters.length);
                const batchChapters = chapters.slice(startIndex, endIndex);
                const chapterIds = batchChapters.map(ch => ch.id);
                try {
                    const batchResults = await downloadChaptersBatch(chapterIds);
                    // 处理批量结果 - 使用for循环避免函数作用域问题
                    for (let j = 0; j < batchResults.length; j++) {
                        const result = batchResults[j];
                        const globalIndex = startIndex + j;
                        contents[globalIndex] = result.content;
                        if (result.success) {
                            successCount++;
                        } else {
                            failedCount++;
                        }
                    }
                    // 更新UI
                    ui.updateStats(chapters.length, successCount, failedCount);
                    ui.updateProgress(((i + 1) / batchCount) * 100);
                } catch (error) {
                    console.error(`批量下载第 ${i + 1} 批章节失败:`, error);
                    // 标记这一批章节为失败
                    for (let j = startIndex; j < endIndex; j++) {
                        contents[j] = `[下载失败: ${chapters[j].title}]`;
                        failedCount++;
                    }
                    ui.updateStats(chapters.length, successCount, failedCount);
                }
            }
            if (format === 'txt') {
                // 生成带章节标题的TXT内容
                let txtContent = bookInfo.infoText + '\n\n';
                for (let i = 0; i < chapters.length; i++) {
                    txtContent += `${chapters[i].title}\n`;
                    txtContent += `${contents[i]}\n\n`;
                }
                const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
                saveAs(blob, `${bookInfo.title}.txt`);
            } else if (format === 'epub') {
                try {
                    const epubBlob = await generateEPUB(bookInfo, chapters, contents, bookInfo.thumb_url);
                    /* global saveAs */
                    saveAs(epubBlob, `${bookInfo.title}.epub`);
                } catch (error) {
                    showNotification('生成EPUB失败: ' + error.message, false);
                }
            }
            showNotification(`下载完成！成功: ${successCount}, 失败: ${failedCount}`);
            ui.txtBtn.disabled = false;
            ui.epubBtn.disabled = false;
            ui.hideProgress();
            isDownloading = false;
        }
        ui.txtBtn.addEventListener('click', () => startDownload('txt'));
        ui.epubBtn.addEventListener('click', () => startDownload('epub'));
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();