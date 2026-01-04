// ==UserScript==
// @name         NGA帖子导出EPUB
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  下载NGA帖子所有页面并导出为EPUB文件，每个帖子按顺序命名，并生成目录嵌入到EPUB中。
// @author       none
// @match        *://nga.178.com/read.php?tid=*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/522759/NGA%E5%B8%96%E5%AD%90%E5%AF%BC%E5%87%BAEPUB.user.js
// @updateURL https://update.greasyfork.org/scripts/522759/NGA%E5%B8%96%E5%AD%90%E5%AF%BC%E5%87%BAEPUB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let allPosts = []; // 保存所有抓取的帖子
    let threadTitle = 'NGA帖子'; // 默认文件名
    let currentPage = 0; // 当前抓取页数
    let totalPages = 0; // 总页数
    let progressElement = null; // 显示进度的元素

    function getPostData(document) {
        const posts = [];
        const postElements = document.querySelectorAll('.postbox');
        postElements.forEach((post, index) => {
            const contentElement = post.querySelector('.postcontent');
            const content = contentElement ? convertSpecialTags(contentElement.innerHTML) : '';
            posts.push({ title: `Post ${allPosts.length + index + 1}`, content });
        });
        return posts;
    }

    function getThreadTitle(document) {
        const titleElement = document.querySelector('#currentTopicName');
        return titleElement ? titleElement.textContent.trim() : 'NGA帖子';
    }

    function convertSpecialTags(content) {
        return content
            .replace(/\[b\](.*?)\[\/b\]/gi, '<strong>$1</strong>') // 加粗
            .replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, '<span style="color:$1;">$2</span>') // 颜色
            .replace(/\[size=(\d+%?)\](.*?)\[\/size\]/gi, '<span style="font-size:$1;">$2</span>') // 字号
            .replace(/\[url=(.*?)\](.*?)\[\/url\]/gi, '<a href="$1">$2</a>') // 链接
            .replace(/\[img\](.*?)\[\/img\]/gi, '') // 忽略图片
            .replace(/<img[^>]+>/gi, '') // 移除 HTML 图片标签
            .replace(/\[.*?\]/g, ''); // 移除其他未知标记
    }

    function updateProgress() {
        if (progressElement) {
            progressElement.textContent = `抓取进度: ${currentPage}/${totalPages || '?'}`;
        }
    }

    async function fetchWithGBK(url) {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder('gbk');
        return decoder.decode(buffer);
    }

    async function fetchNextPage(url, resolve) {
        try {
            const html = await fetchWithGBK(url);
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            if (!threadTitle) {
                threadTitle = getThreadTitle(doc);
            }
            if (totalPages === 0) {
                const lastPageLink = doc.querySelector('#pagebtop a[title="最后页"]');
                totalPages = lastPageLink ? parseInt(lastPageLink.textContent, 10) : 1;
            }

            allPosts = allPosts.concat(getPostData(doc));
            currentPage++;
            updateProgress();

            const nextPageLink = doc.querySelector('#pagebtop a[title="下一页"]');
            if (nextPageLink) {
                const nextPageUrl = new URL(nextPageLink.href, window.location.origin).href;
                fetchNextPage(nextPageUrl, resolve);
            } else {
                resolve();
            }
        } catch (err) {
            console.error('抓取页面失败:', err);
            resolve();
        }
    }

    async function createEPUB(posts) {
        const zip = new JSZip();

        const tocItems = posts.map((post, index) => `
      <navPoint id="post${index + 1}" playOrder="${index + 1}">
        <navLabel>
          <text>${post.title}</text>
        </navLabel>
        <content src="content.xhtml#post${index + 1}"/>
      </navPoint>`).join('');

        const tocNCX = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:nga-thread" />
    <meta name="dtb:depth" content="1" />
    <meta name="dtb:totalPageCount" content="0" />
    <meta name="dtb:maxPageNumber" content="0" />
  </head>
  <docTitle>
    <text>${threadTitle}</text>
  </docTitle>
  <navMap>
    ${tocItems}
  </navMap>
</ncx>`;

        const meta = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${threadTitle}</dc:title>
    <dc:creator>Tampermonkey脚本</dc:creator>
    <dc:language>zh</dc:language>
  </metadata>
  <manifest>
    <item id="toc" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="toc">
    <itemref idref="content"/>
  </spine>
</package>`;

        const contentXHTML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${threadTitle}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.5; }
    .post { margin-bottom: 20px; }
  </style>
</head>
<body>
  ${posts.map((post, index) => `
    <div id="post${index + 1}" class="post">
      <h2>${post.title}</h2>
      <div>${post.content}</div>
    </div>`).join('')}
</body>
</html>`;

        zip.file('mimetype', 'application/epub+zip');
        const metaFolder = zip.folder('META-INF');
        metaFolder.file('container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">
  <rootfiles>
    <rootfile full-path="content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);
        zip.file('toc.ncx', tocNCX);
        zip.file('content.opf', meta);
        zip.file('content.xhtml', contentXHTML);

        zip.generateAsync({ type: 'blob' }).then(content => {
            saveAs(content, `${threadTitle}.epub`);
        });
    }

    function init() {
        const button = document.createElement('button');
        button.textContent = '抓取所有页面并导出为EPUB';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';

        progressElement = document.createElement('span');
        progressElement.style.marginLeft = '10px';
        progressElement.style.fontSize = '16px';
        progressElement.style.color = '#333';

        button.onclick = () => {
            allPosts = [];
            threadTitle = '';
            currentPage = 0;
            totalPages = 0;
            updateProgress();
            const currentUrl = window.location.href;
            fetchNextPage(currentUrl, () => createEPUB(allPosts));
        };

        document.body.appendChild(button);
        button.insertAdjacentElement('afterend', progressElement);
    }

    init();
})();
