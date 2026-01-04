// ==UserScript==
// @name         上传图片到 Cloudinary（右键菜单版）
// @version      1.1
// @description  点击图片后，通过浏览器右键菜单上传到 Cloudinary，并复制链接。
// @author       Phinsin666
// @source       https://github.com/Phinsin666/Uploading-images-to-Cloudinary
// @match        *://*/*
// @namespace https://greasyfork.org/users/385149
// @downloadURL https://update.greasyfork.org/scripts/534677/%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E5%88%B0%20Cloudinary%EF%BC%88%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534677/%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E5%88%B0%20Cloudinary%EF%BC%88%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const cloudName = 'Cloudinary Cloud Name';              // ← 替换为你的 Cloudinary Cloud Name
    const uploadPreset = 'tampermonkey_upload';      // ← 替换为你的 Upload Preset

    let selectedElement = null;

    // 捕获用户点击的元素
    document.addEventListener('click', (e) => {
        selectedElement = e.target;
        console.log('[Cloudinary] 选中元素:', selectedElement);
    });

    // 注册右键菜单命令
    GM_registerMenuCommand('上传选中图片到 Cloudinary', async () => {
        if (!selectedElement) {
            alert('请先点击一张图片或含图的元素。');
            return;
        }

        try {
            const blob = await getImageBlob(selectedElement);
            if (!blob) throw new Error('无法识别或提取图片');

            await uploadBlobToCloudinary(blob);
        } catch (err) {
            alert('❌ 错误：' + err.message);
        }
    });

    // 判断并提取图片 Blob
    async function getImageBlob(el) {
        // 1. <img>
        if (el.tagName === 'IMG' && el.src) {
            return fetchToBlob(el.src);
        }

        // 2. picture > img
        if (el.tagName === 'PICTURE') {
            const img = el.querySelector('img');
            if (img?.src) return fetchToBlob(img.src);
        }

        // 3. background-image
        const bg = getComputedStyle(el).backgroundImage;
        const bgUrlMatch = bg?.match(/url\(["']?(.*?)["']?\)/);
        if (bgUrlMatch && bgUrlMatch[1]) {
            return fetchToBlob(bgUrlMatch[1]);
        }

        // 4. <canvas>
        if (el.tagName === 'CANVAS') {
            const dataUrl = el.toDataURL('image/png');
            return dataURLtoBlob(dataUrl);
        }

        // 5. <svg>
        if (el.tagName === 'SVG' || el instanceof SVGElement) {
            const svgData = new XMLSerializer().serializeToString(el);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });

            // 用 Canvas 转成 PNG
            const imgUrl = URL.createObjectURL(svgBlob);
            const pngBlob = await svgToPngBlob(imgUrl);
            URL.revokeObjectURL(imgUrl);
            return pngBlob;
        }

        return null;
    }

    // 上传图片 Blob 到 Cloudinary
    async function uploadBlobToCloudinary(blob) {
        const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', uploadPreset);

        const res = await fetch(apiUrl, { method: 'POST', body: formData });
        const data = await res.json();

        if (data.secure_url) {
            GM_setClipboard(data.secure_url);
            alert(`✅ 上传成功：\n${data.secure_url}`);
            window.open(data.secure_url, '_blank');
        } else {
            throw new Error(data.error?.message || '上传失败');
        }
    }

    // URL 转 blob
    function fetchToBlob(url) {
        return fetch(url).then(res => res.blob());
    }

    // dataURL 转 blob
    function dataURLtoBlob(dataurl) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) u8arr[n] = bstr.charCodeAt(n);
        return new Blob([u8arr], { type: mime });
    }

    // svg blob url → png blob
    function svgToPngBlob(svgUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(resolve, 'image/png');
            };
            img.onerror = reject;
            img.src = svgUrl;
        });
    }
})();
