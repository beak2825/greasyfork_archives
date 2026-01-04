// ==UserScript==
// @name         to-corona-ex 漫画下载
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  从to-corona-ex下载并解密图片，打包成 ZIP 格式下载
// @author       丸玖
// @license      MIT
// @icon         https://avatar.dmzj.com/70/86/7086ff9daebc44bb0555f462ba03c517.png
// @match        https://to-corona-ex.com/episodes/*
// @downloadURL https://update.greasyfork.org/scripts/524157/to-corona-ex%20%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/524157/to-corona-ex%20%E6%BC%AB%E7%94%BB%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js';
    script.onload = init;
    document.body.appendChild(script);

    async function init() {
        const fetchPageData = async () => {
            const res = await fetch(window.location.href);
            const text = await res.text();
            const pages = JSON.parse((text.match(/"pages":\s*(\[[^\]]+\])/)||[])[1] || '[]');
            const title = (text.match(/"episode_title":\s*"([^"]+)"/)||[])[1] || '默认章节';
            return { pages, title };
        };

        const decodeImage = (url, hash, i) => new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const [o, a, ...l] = Array.from(atob(hash)).map(c => c.charCodeAt(0));
                const w = Math.floor(img.width / o), x = Math.floor(img.height / a);
                canvas.width = img.width; canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                l.forEach((v, i) => {
                    const c = v % o, u = Math.floor(v / o);
                    const p = i % o, s = Math.floor(i / o);
                    ctx.drawImage(img, c * w, u * x, w, x, p * w, s * x, w, x);
                });
                resolve({ filename: `${String(i+1).padStart(2, '0')}.png`, dataUrl: canvas.toDataURL('image/png') });
            };
            img.onerror = () => reject(new Error(`加载图像失败: ${url}`));
        });

        const createZip = (images, title) => {
            const zip = new JSZip();
            images.forEach(image => zip.file(image.filename, image.dataUrl.split(',')[1], { base64: true }));
            zip.generateAsync({ type: 'blob' }).then(content => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `${title}.zip`;
                link.click();
            }).catch(console.error);
        };

        // 创建下载按钮
        const btn = document.createElement('button');
        btn.textContent = '下载';
        btn.style = 'position: fixed; top: 20px; right: 20px; padding: 10px 20px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; z-index: 1000;';
        btn.onclick = async () => {
            btn.disabled = true;
            btn.textContent = '下载中...';

            // 获取数据并处理图片
            const { pages, title } = await fetchPageData();
            const images = await Promise.all(pages.map(({ page_image_url, drm_hash }, i) => decodeImage(page_image_url, drm_hash, i)));

            // 创建 ZIP 文件
            createZip(images, title);

            // 恢复按钮
            btn.disabled = false;
            btn.textContent = '下载';
        };

        document.body.appendChild(btn);
    }
})();