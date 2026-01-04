// ==UserScript==
// @name         Save Page as EPUB
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Save the current webpage as an EPUB file
// @author       Your Name
// @match        *://*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/readability/0.5.0/Readability.js

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503263/Save%20Page%20as%20EPUB.user.js
// @updateURL https://update.greasyfork.org/scripts/503263/Save%20Page%20as%20EPUB.meta.js
// ==/UserScript==

    // 创建按钮
    const button = document.createElement('button');
    button.innerHTML = 'Save as EPUB';
    button.style.position = 'fixed';
    button.style.bottom = '10px';  // 调整到页面底部
    button.style.right = '-80px';  // 默认情况下只显示一小部分
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.transition = 'right 0.3s ease';  // 添加平滑过渡效果
    document.body.appendChild(button);

    // 鼠标悬停时显示整个按钮
    button.addEventListener('mouseover', () => {
        button.style.right = '10px'; // 完全显示按钮
    });

    // 鼠标移开时收起按钮
    button.addEventListener('mouseout', () => {
        button.style.right = `-${button.offsetWidth * 0.8}px`; // 只显示部分按钮
    });


    // 按钮点击事件
    button.addEventListener('click', async () => {
        const zip = new JSZip();
        const title = document.title || 'Untitled';
        // 只对电脑版的 woshipm 文章有效
        // const content = document.querySelector('.article--content.grap').outerHTML;


        var documentClone = document.cloneNode(true);
        var article = new Readability(documentClone).parse();
        const content = article.content;

        // 创建EPUB基本结构
        zip.file("mimetype", "application/epub+zip");

        // META-INF
        zip.file("META-INF/container.xml", `<?xml version="1.0" encoding="UTF-8" ?>
            <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
                <rootfiles>
                    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
                </rootfiles>
            </container>`);

        // OEBPS/content.opf
        zip.file("OEBPS/content.opf", `<?xml version="1.0" encoding="UTF-8" ?>
            <package version="2.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid">
                <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
                    <dc:title>${title}</dc:title>
                    <dc:language>en</dc:language>
                    <dc:identifier id="bookid">urn:uuid:${generateUUID()}</dc:identifier>
                    <meta name="generator" content="epub-gen"/>
                </metadata>
                <manifest>
                    <item id="content" href="content.html" media-type="application/xhtml+xml"/>
                </manifest>
                <spine toc="ncx">
                    <itemref idref="content"/>
                </spine>
            </package>`);

        // OEBPS/content.html
        zip.file("OEBPS/content.html", `<?xml version="1.0" encoding="UTF-8" ?>
            <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <title>${title}</title>
                </head>
                <body>
                    <h1>${title}</h1>
                    ${content}
                </body>
            </html>`);

        // 生成并下载EPUB文件
        const blob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([blob], { type: 'application/epub+zip' }));
        link.download = `${title}.epub`;
        link.click();
    });

    // 生成UUID函数
    function generateUUID() {
        let d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }