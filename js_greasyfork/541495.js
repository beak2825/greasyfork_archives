// ==UserScript==
// @name         SVG 预览与下载工具
// @version      2.5
// @author       hsopen
// @namespace    hsopenScript
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @require      https://cdn.jsdelivr.net/npm/canvg@3.0.10/lib/umd.min.js
// @license      GPLv3
// @description  轻松预览与下载网页中的 SVG 图像，修复 Edge SVG 预览溢出问题
// @downloadURL https://update.greasyfork.org/scripts/541495/SVG%20%E9%A2%84%E8%A7%88%E4%B8%8E%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/541495/SVG%20%E9%A2%84%E8%A7%88%E4%B8%8E%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    const CONVERSION_TIMEOUT = 10000;
    const MAX_RENDER_SIZE = 4096;
    const CHECKER_SIZE = 12;
    const CHECKER_COLORS = ['#e0e0e0', '#ffffff'];

    GM_registerMenuCommand('预览并下载 SVG', async () => {
        function createCheckerboardStyle() {
            const style = document.createElement('style');
            style.textContent = `
                .checker-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image:
                        linear-gradient(45deg, ${CHECKER_COLORS[0]} 25%, transparent 25%),
                        linear-gradient(-45deg, ${CHECKER_COLORS[0]} 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, ${CHECKER_COLORS[0]} 75%),
                        linear-gradient(-45deg, transparent 75%, ${CHECKER_COLORS[0]} 75%);
                    background-size: ${CHECKER_SIZE * 2}px ${CHECKER_SIZE * 2}px;
                    background-position: 0 0, 0 ${CHECKER_SIZE}px, ${CHECKER_SIZE}px -${CHECKER_SIZE}px, -${CHECKER_SIZE}px 0px;
                    pointer-events: none;
                    user-select: none;
                    z-index: 0;
                }
            `;
            return style;
        }

        // 收集内嵌 SVG
        const embeddedSvgs = Array.from(document.querySelectorAll('svg')).map(svg => {
            const cloned = svg.cloneNode(true);
            cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            return {
                type: 'embedded',
                element: cloned,
                source: '当前页面内嵌'
            };
        });

        // 收集外链 SVG
        const externalUrls = new Set();
        document.querySelectorAll('[src], [data], [href]').forEach(el => {
            const url = el.getAttribute('src') || el.getAttribute('data') || el.getAttribute('href');
            if (!url) return;
            const cleanUrl = url.split('?')[0].split('#')[0].trim();
            if (!cleanUrl.toLowerCase().endsWith('.svg')) return;
            let fullUrl = url.trim();
            if (fullUrl.startsWith('//')) {
                fullUrl = window.location.protocol + fullUrl;
            } else if (!fullUrl.startsWith('http')) {
                fullUrl = new URL(fullUrl, window.location.href).href;
            }
            externalUrls.add(fullUrl);
        });

        // 获取外链 SVG 内容
        const externalSvgs = await Promise.all(
            [...externalUrls].map(async url => {
                try {
                    const response = await fetch(url);
                    const text = await response.text();
                    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
                    const svg = doc.querySelector('svg');
                    if (!svg) return null;
                    const cloned = svg.cloneNode(true);
                    cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    return {
                        type: 'external',
                        element: cloned,
                        source: url,
                        originalUrl: url
                    };
                } catch {
                    return null;
                }
            })
        ).then(svgs => svgs.filter(svg => svg));

        // 合并并反转数组顺序
        const allSvgs = [...embeddedSvgs, ...externalSvgs].reverse();

        if (allSvgs.length === 0) {
            alert('未找到任何 SVG（包括外链、嵌入）');
            return;
        }

        // 创建预览界面
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
        overlay.style.zIndex = '99999';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.overflow = 'hidden';

        const content = document.createElement('div');
        content.style.position = 'relative';
        content.style.width = '95%';
        content.style.maxWidth = '1400px';
        content.style.height = '90vh';
        content.style.backgroundColor = 'white';
        content.style.borderRadius = '10px';
        content.style.padding = '20px';
        content.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.overflow = 'hidden';

        // 添加固定格子背景样式
        const style = createCheckerboardStyle();
        content.appendChild(style);

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '15px';
        header.style.flexShrink = '0';

        const title = document.createElement('h3');
        title.textContent = `SVG 预览 (${allSvgs.length}个)`;
        title.style.margin = '0';
        title.style.color = '#333';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.background = '#e00';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.width = '30px';
        closeBtn.style.height = '30px';
        closeBtn.style.borderRadius = '50%';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '18px';
        closeBtn.style.lineHeight = '30px';

        const containerWrapper = document.createElement('div');
        containerWrapper.style.flexGrow = '1';
        containerWrapper.style.overflowY = 'auto';
        containerWrapper.style.paddingRight = '10px';

        const container = document.createElement('div');
        container.id = 'svg-preview-container';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(6, minmax(150px, 1fr))'; // 修改为6列
        container.style.gap = '15px'; // 缩小间隙以适应更多列
        container.style.alignItems = 'start';

        header.appendChild(title);
        header.appendChild(closeBtn);
        content.appendChild(header);
        containerWrapper.appendChild(container);
        content.appendChild(containerWrapper);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        closeBtn.addEventListener('click', () => {
            document.body.style.overflow = '';
            overlay.remove();
        });

        // 窗口大小改变时调整布局
        function adjustLayout() {
            const width = window.innerWidth;
            if (width < 768) {
                container.style.gridTemplateColumns = 'repeat(3, minmax(100px, 1fr))'; // 小屏幕3列
            } else if (width < 1200) {
                container.style.gridTemplateColumns = 'repeat(4, minmax(120px, 1fr))'; // 中等屏幕4列
            } else {
                container.style.gridTemplateColumns = 'repeat(6, minmax(150px, 1fr))'; // 大屏幕6列
            }
        }

        window.addEventListener('resize', adjustLayout);
        adjustLayout();

        async function convertSvgToPng(svgElement) {
            return new Promise(async (resolve, reject) => {
                const timer = setTimeout(() => {
                    reject(new Error('SVG转换超时'));
                }, CONVERSION_TIMEOUT);

                try {
                    const svg = svgElement.cloneNode(true);
                    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                    const svgStr = new XMLSerializer().serializeToString(svg);

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // 根据svg尺寸设置canvas大小，防止渲染时强制成正方形
                    let width = svg.getAttribute('width') || svg.clientWidth || 300;
                    let height = svg.getAttribute('height') || svg.clientHeight || 150;

                    // 如果宽高带单位，尝试解析数字
                    if (typeof width === 'string') width = parseFloat(width);
                    if (typeof height === 'string') height = parseFloat(height);

                    // 宽高限制，防止太大
                    if (width > MAX_RENDER_SIZE) width = MAX_RENDER_SIZE;
                    if (height > MAX_RENDER_SIZE) height = MAX_RENDER_SIZE;

                    canvas.width = width;
                    canvas.height = height;

                    // canvg 渲染
                    // 这里用的是 canvg 3.x 的调用方式
                    const v = await canvg.Canvg.fromString(ctx, svgStr);
                    await v.render();
                    clearTimeout(timer);
                    canvas.toBlob(resolve, 'image/png', 1.0);
                } catch (e) {
                    clearTimeout(timer);
                    console.error('[SVG转换失败]', e);
                    reject(e);
                }
            });
        }

        allSvgs.forEach((svgObj, index) => {
            const previewDiv = document.createElement('div');
            previewDiv.style.display = 'flex';
            previewDiv.style.flexDirection = 'column';
            previewDiv.style.height = '100%';
            previewDiv.style.padding = '10px'; // 减小内边距以适应更多列
            previewDiv.style.border = '1px solid #ddd';
            previewDiv.style.borderRadius = '8px';
            previewDiv.style.backgroundColor = '#f9f9f9';
            previewDiv.style.boxSizing = 'border-box';

            // 标题
            const title = document.createElement('div');
            title.textContent = svgObj.source;
            title.style.whiteSpace = 'nowrap';
            title.style.overflow = 'hidden';
            title.style.textOverflow = 'ellipsis';
            title.style.fontSize = '12px'; // 减小字体大小
            title.style.marginBottom = '6px';
            title.title = svgObj.source;

            // 预览容器，防止 SVG 溢出
            const previewContainer = document.createElement('div');
            previewContainer.className = 'checker-bg';
            previewContainer.style.flexGrow = '1';
            previewContainer.style.position = 'relative';
            previewContainer.style.overflow = 'hidden';
            previewContainer.style.display = 'flex';
            previewContainer.style.justifyContent = 'center';
            previewContainer.style.alignItems = 'center';
            previewContainer.style.minHeight = '120px'; // 减小最小高度
            previewContainer.style.maxHeight = '180px'; // 减小最大高度
            previewContainer.style.backgroundColor = 'white';

            // 克隆SVG节点并设置样式，确保不溢出且自适应
            const svgClone = svgObj.element.cloneNode(true);
            svgClone.style.maxWidth = '100%';
            svgClone.style.maxHeight = '100%';
            svgClone.style.width = 'auto';
            svgClone.style.height = 'auto';
            svgClone.style.display = 'block';
            svgClone.style.position = 'relative';
            svgClone.style.objectFit = 'contain';
            svgClone.style.overflow = 'hidden';

            previewContainer.appendChild(svgClone);

            // 下载按钮
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = '下载 PNG';
            downloadBtn.style.marginTop = '8px';
            downloadBtn.style.padding = '4px 8px';
            downloadBtn.style.border = 'none';
            downloadBtn.style.borderRadius = '4px';
            downloadBtn.style.backgroundColor = '#1976d2';
            downloadBtn.style.color = 'white';
            downloadBtn.style.cursor = 'pointer';
            downloadBtn.style.fontSize = '12px'; // 减小按钮字体大小

            downloadBtn.addEventListener('click', async () => {
                try {
                    downloadBtn.disabled = true;
                    downloadBtn.textContent = '转换中...';

                    const blob = await convertSvgToPng(svgObj.element);
                    const url = URL.createObjectURL(blob);
                    const safeName = `svg-image-${index + 1}.png`.replace(/[^\w\-\.]/g, '_');

                    // 优先使用 GM_download
                    try {
                        GM_download({
                            url,
                            name: safeName,
                            saveAs: true,
                            onload: () => setTimeout(() => URL.revokeObjectURL(url), 5000),
                            onerror: () => {
                                // 备用下载
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = safeName;
                                a.click();
                                setTimeout(() => URL.revokeObjectURL(url), 5000);
                            }
                        });
                    } catch {
                        // GM_download 不可用或失败时直接 fallback
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = safeName;
                        a.click();
                        setTimeout(() => URL.revokeObjectURL(url), 5000);
                    }
                } catch (e) {
                    alert('转换失败: ' + e.message);
                } finally {
                    downloadBtn.disabled = false;
                    downloadBtn.textContent = '下载 PNG';
                }
            });

            previewDiv.appendChild(title);
            previewDiv.appendChild(previewContainer);
            previewDiv.appendChild(downloadBtn);

            container.appendChild(previewDiv);
        });
    });
})();