// ==UserScript==
// @name         带预览和下载功能的 SVG 提取器（GlyphWiki 特别版）
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  提取页面中的所有 SVG 和 <symbol> 标签，提供预览并选择下载 SVG 或 PNG（PNG 尺寸根据 SVG 长宽比例调整），增加预览区关闭功能，支持外部 SVG 文件，特别处理 GlyphWiki 的 SVG 移除网格和矩形边界
// @author       般若
// @match        *://*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/523743/%E5%B8%A6%E9%A2%84%E8%A7%88%E5%92%8C%E4%B8%8B%E8%BD%BD%E5%8A%9F%E8%83%BD%E7%9A%84%20SVG%20%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88GlyphWiki%20%E7%89%B9%E5%88%AB%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/523743/%E5%B8%A6%E9%A2%84%E8%A7%88%E5%92%8C%E4%B8%8B%E8%BD%BD%E5%8A%9F%E8%83%BD%E7%9A%84%20SVG%20%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88GlyphWiki%20%E7%89%B9%E5%88%AB%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建预览容器
    const previewContainer = document.createElement('div');
    previewContainer.style.position = 'fixed';
    previewContainer.style.bottom = '20px';
    previewContainer.style.right = '20px';
    previewContainer.style.zIndex = '10000';
    previewContainer.style.backgroundColor = 'white';
    previewContainer.style.padding = '10px';
    previewContainer.style.border = '1px solid #ccc';
    previewContainer.style.borderRadius = '5px';
    previewContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    previewContainer.style.maxHeight = '80vh';
    previewContainer.style.overflowY = 'auto';
    document.body.appendChild(previewContainer);

    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.innerText = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', () => {
        previewContainer.style.display = 'none';
    });
    previewContainer.appendChild(closeButton);

    // 创建提取按钮
    const extractButton = document.createElement('button');
    extractButton.innerText = '提取 SVG';
    extractButton.style.position = 'fixed';
    extractButton.style.bottom = '20px';
    extractButton.style.left = '20px';
    extractButton.style.zIndex = '10000';
    extractButton.style.padding = '10px';
    extractButton.style.backgroundColor = '#007bff';
    extractButton.style.color = 'white';
    extractButton.style.border = 'none';
    extractButton.style.borderRadius = '5px';
    extractButton.style.cursor = 'pointer';
    document.body.appendChild(extractButton);

    // 创建关闭预览区按钮
    const closePreviewButton = document.createElement('button');
    closePreviewButton.innerText = '关闭预览区';
    closePreviewButton.style.position = 'fixed';
    closePreviewButton.style.bottom = '60px';
    closePreviewButton.style.left = '20px';
    closePreviewButton.style.zIndex = '10000';
    closePreviewButton.style.padding = '10px';
    closePreviewButton.style.backgroundColor = '#dc3545';
    closePreviewButton.style.color = 'white';
    closePreviewButton.style.border = 'none';
    closePreviewButton.style.borderRadius = '5px';
    closePreviewButton.style.cursor = 'pointer';
    closePreviewButton.addEventListener('click', () => {
        previewContainer.style.display = 'none';
    });
    document.body.appendChild(closePreviewButton);

    function removeGlyphWikiBackground(svg) {
        const allowedDomains = ['glyphwiki.org', 'zhs.glyphwiki.org', 'zht.glyphwiki.org']; // 添加你需要的网址
        if (allowedDomains.includes(window.location.hostname)) {
            const rects = svg.querySelectorAll('rect.glyph-boundary, rect.glyph-guide');
            rects.forEach(rect => rect.remove());

            const gridLines = svg.querySelectorAll('g.grid-lines');
            gridLines.forEach(grid => grid.remove());

            // 修改 viewBox 和尺寸
            svg.setAttribute('viewBox', '0 0 200 200');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
        }
    }

    // 加载外部 SVG 文件并将其转换为内联 SVG
    async function loadAndInlineExternalSVGs() {
        const imgElements = Array.from(document.querySelectorAll('img[src$=".svg"]'));
        for (const img of imgElements) {
            try {
                const response = await fetch(img.src);
                const svgText = await response.text();
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                const svgElement = svgDoc.querySelector('svg');
                if (svgElement) {
                    img.replaceWith(svgElement);
                    removeGlyphWikiBackground(svgElement); // 移除 GlyphWiki 背景
                }
            } catch (error) {
                console.error('Failed to load and inline SVG:', error);
            }
        }
    }

    // 提取页面中的所有 SVG 元素
    function extractSVGs() {
        const svgs = Array.from(document.querySelectorAll('svg')).map((svg, index) => {
            removeGlyphWikiBackground(svg); // 移除 GlyphWiki 背景
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svg);
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            return { url, name: `svg-${index + 1}.svg`, element: svg };
        });

        // 特别处理字统网动态更新的 SVG
        const dynamicSvgs = Array.from(document.querySelectorAll('svg[id="zusvgimgkage"], svg[style*="position:absolute;left:0;top:0;"]')).map((svg, index) => {
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svg);
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            return { url, name: `dynamic-svg-${index + 1}.svg`, element: svg };
        });

        return svgs.concat(dynamicSvgs);
    }

    // 提取页面中的所有 <symbol> 标签并生成 SVG 文件
    function extractSymbols() {
        const symbols = document.querySelectorAll('symbol');
        const symbolSvgs = [];

        symbols.forEach(symbol => {
            // 创建一个新的 SVG 元素
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', symbol.getAttribute('viewBox'));
            svg.setAttribute('width', '100');
            svg.setAttribute('height', '100');
            //svg.style.border = '1px solid #ccc';
            //svg.style.marginBottom = '10px';

            // 将 <symbol> 的内容复制到新的 SVG 中
            Array.from(symbol.children).forEach(child => {
                svg.appendChild(child.cloneNode(true));
            });

            // 将 SVG 转换为字符串
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svg);

            // 创建一个下载链接
            const blob = new Blob([svgString], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            symbolSvgs.push({ url, name: `${symbol.id}.svg`, element: svg });
        });

        return symbolSvgs;
    }

    // 显示 SVG 预览
    function showSVGPreviews(svgs) {
        previewContainer.innerHTML = '<h3 style="margin: 0 0 10px;">SVG 预览</h3>';
        previewContainer.appendChild(closeButton); // 重新添加关闭按钮
        svgs.forEach((svg, index) => {
            const previewItem = document.createElement('div');
            previewItem.style.marginBottom = '10px';
            previewItem.style.borderBottom = '1px solid #eee';
            previewItem.style.paddingBottom = '10px';

            // 显示 SVG 预览
            const previewImage = document.createElement('img');
            previewImage.src = svg.url;
            previewImage.style.maxWidth = '200px';
            previewImage.style.maxHeight = '100px';
            previewImage.style.display = 'block';
            previewImage.style.marginBottom = '5px';
            previewItem.appendChild(previewImage);

            // 下载 SVG 按钮
            const downloadSvgButton = document.createElement('button');
            downloadSvgButton.innerText = '下载 SVG';
            downloadSvgButton.style.marginRight = '5px';
            downloadSvgButton.style.padding = '5px 10px';
            downloadSvgButton.style.backgroundColor = '#28a745';
            downloadSvgButton.style.color = 'white';
            downloadSvgButton.style.border = 'none';
            downloadSvgButton.style.borderRadius = '5px';
            downloadSvgButton.style.cursor = 'pointer';
            downloadSvgButton.addEventListener('click', () => {
                const link = document.createElement('a');
                link.href = svg.url;
                link.download = svg.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(svg.url);
            });
            previewItem.appendChild(downloadSvgButton);

            // 下载 PNG 按钮（透明背景）
            const downloadPngTransparentButton = document.createElement('button');
            downloadPngTransparentButton.innerText = '下载 PNG (透明)';
            downloadPngTransparentButton.style.marginRight = '5px';
            downloadPngTransparentButton.style.padding = '5px 10px';
            downloadPngTransparentButton.style.backgroundColor = '#17a2b8';
            downloadPngTransparentButton.style.color = 'white';
            downloadPngTransparentButton.style.border = 'none';
            downloadPngTransparentButton.style.borderRadius = '5px';
            downloadPngTransparentButton.style.cursor = 'pointer';
            downloadPngTransparentButton.addEventListener('click', () => {
                downloadPNG(svg, index, false);
            });
            previewItem.appendChild(downloadPngTransparentButton);

            // 下载 PNG 按钮（白色背景）
            const downloadPngWhiteButton = document.createElement('button');
            downloadPngWhiteButton.innerText = '下载 PNG (白色背景)';
            downloadPngWhiteButton.style.padding = '5px 10px';
            downloadPngWhiteButton.style.backgroundColor = '#ffc107';
            downloadPngWhiteButton.style.color = 'black';
            downloadPngWhiteButton.style.border = 'none';
            downloadPngWhiteButton.style.borderRadius = '5px';
            downloadPngWhiteButton.style.cursor = 'pointer';
            downloadPngWhiteButton.addEventListener('click', () => {
                downloadPNG(svg, index, true);
            });
            previewItem.appendChild(downloadPngWhiteButton);

            previewContainer.appendChild(previewItem);
        });
    }

    // 下载 PNG 函数
    function downloadPNG(svg, index, isWhiteBackground) {
        const img = new Image();
        img.src = svg.url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const svgElement = svg.element;

            // 获取 SVG 的实际尺寸
            const svgWidth = svgElement.width.baseVal.value || svgElement.getBoundingClientRect().width;
            const svgHeight = svgElement.height.baseVal.value || svgElement.getBoundingClientRect().height;

            // 如果 SVG 的长宽不相等，则 PNG 尺寸为原 SVG 的 4 倍长 x 4 倍宽
            if (svgWidth !== svgHeight) {
                canvas.width = svgWidth * 4;
                canvas.height = svgHeight * 4;
            } else {
                canvas.width = 2500;
                canvas.height = 2500;
            }

            const ctx = canvas.getContext('2d');

            // 如果选择白色背景，填充白色
            if (isWhiteBackground) {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // 计算缩放比例
            const scale = Math.min(canvas.width / svgWidth, canvas.height / svgHeight);
            const scaledWidth = svgWidth * scale;
            const scaledHeight = svgHeight * scale;

            // 居中绘制
            const offsetX = (canvas.width - scaledWidth) / 2;
            const offsetY = (canvas.height - scaledHeight) / 2;

            ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `png-${index + 1}-${isWhiteBackground ? 'white' : 'transparent'}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 'image/png');
        };
    }

    // 点击按钮提取并显示 SVG 预览
    extractButton.addEventListener('click', async () => {
        await loadAndInlineExternalSVGs(); // 加载并内联外部 SVG
        const svgs = extractSVGs();
        const symbolSvgs = extractSymbols();
        const allSvgs = svgs.concat(symbolSvgs);
        if (allSvgs.length > 0) {
            previewContainer.style.display = 'block'; // 显示预览区
            showSVGPreviews(allSvgs);
        } else {
            previewContainer.innerHTML = '<p>未找到 SVG 元素。</p>';
        }
    });
})();