// ==UserScript==
// @name         DLsite Thumbnails Downloader v0.1.1 (20250805)
// @name:ko      DLsite Thumbnails(썸네일) 다운로더 v0.1.1 (20250805)
// @namespace    https://greasyfork.org/users/legnax
// @version      0.1.1
// @description  Download DLsite product thumbnails in .webp or .jpg
// @description:ko DLsite에서 대표 이미지 및 썸네일을 원클릭 다운로드
// @author       legnax
// @license      MIT
// @match        https://www.dlsite.com/*/work/=/product_id/RJ*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544694/DLsite%20Thumbnails%20Downloader%20v011%20%2820250805%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544694/DLsite%20Thumbnails%20Downloader%20v011%20%2820250805%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getRJCode() {
        const match = location.href.match(/RJ\d{6,}/);
        return match ? match[0] : null;
    }

    function getFolderID(rjCode) {
        const num = parseInt(rjCode.slice(2), 10);
        return String(Math.ceil(num / 1000) * 1000).padStart(8, '0');
    }

    function generateImageUrls(rjCode, max = 10, ext = 'webp') {
        const folderID = getFolderID(rjCode);
        const baseUrl = `https://img.dlsite.jp/modpub/images2/work/doujin/RJ${folderID}/`;
        const urls = [{
            url: `${baseUrl}${rjCode}_img_main.${ext}`,
            filename: `${rjCode}_main.${ext}`
        }];
        for (let i = 1; i <= max; i++) {
            urls.push({
                url: `${baseUrl}${rjCode}_img_smp${i}.${ext}`,
                filename: `${rjCode}_smp${i}.${ext}`
            });
        }
        return urls;
    }

    async function downloadWebp({ url, filename }) {
        try {
            const res = await fetch(url);
            if (!res.ok) return false;
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
            return true;
        } catch {
            return false;
        }
    }

    async function downloadAsJpg({ url, filename }) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(blobUrl);
                    resolve(true);
                }, 'image/jpeg', 0.7); // 용량 화질 최적화(0.7 > 용량 약 2배 증가함)
            };
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }

    function addSplitButtons() {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 9999;
            display: flex;
            box-shadow: 0 0 0 1.5px black;
            border-radius: 6px;
            overflow: hidden;
        `;

        const baseStyle = `
            background: #ffc0cb;
            color: #000;
            border: none;
            width: 90px;
            height: 32px;
            text-align: center;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            line-height: 32px;
        `;

        const btnWebp = document.createElement('button');
        btnWebp.textContent = '원본(.webp)';
        btnWebp.style.cssText = baseStyle + 'border-right: 1.5px solid black;';
        btnWebp.onclick = async () => {
            const rj = getRJCode();
            if (!rj) return alert('RJ 코드 인식 실패');
            const files = generateImageUrls(rj, 10, 'webp');
            let count = 0;
            for (const f of files) {
                const ok = await downloadWebp(f);
                if (ok) count++;
                await new Promise(r => setTimeout(r, 400));
            }
            alert(`${count}개 .webp 이미지 다운로드 완료`);
        };

        const btnJpg = document.createElement('button');
        btnJpg.textContent = '변환(.jpg)';
        btnJpg.style.cssText = baseStyle;
        btnJpg.onclick = async () => {
            const rj = getRJCode();
            if (!rj) return alert('RJ 코드 인식 실패');
            const files = generateImageUrls(rj, 10, 'webp');
            let count = 0;
            for (const f of files) {
                const jpgFile = { ...f, filename: f.filename.replace('.webp', '.jpg') };
                const ok = await downloadAsJpg(jpgFile);
                if (ok) count++;
                await new Promise(r => setTimeout(r, 400));
            }
            alert(`${count}개 .jpg 이미지 다운로드 완료`);
        };

        wrapper.appendChild(btnWebp);
        wrapper.appendChild(btnJpg);
        document.body.appendChild(wrapper);
    }

    window.addEventListener('load', () => setTimeout(addSplitButtons, 1000));
})();
