// ==UserScript==
// @name         Zip images on your article
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Download all images in a article as ZIP
// @license      MIT
// @author       onanymous
// @match        https://kone.gg/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kone.gg
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536740/Zip%20images%20on%20your%20article.user.js
// @updateURL https://update.greasyfork.org/scripts/536740/Zip%20images%20on%20your%20article.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function loadJsZip() {
        return new Promise((resolve) => {
            if (window.JSZip) return resolve();
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
            script.onload = () => {
                window.JSZip = window.JSZip || JSZip;
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    function getImageUrls() {
        return Array.from(document.querySelector('div.overflow-hidden div.prose-container').shadowRoot.querySelectorAll('img'))
            .map(img => img.src)
            .filter(Boolean);
    }

    function sanitizeFilename(name) {
        return name.replace(/[\/\\\:\*\?\"\<\>\|]/g, '').trim();
    }

    function getExtension(url, contentType) {
        let match = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);
        if (match) {
            let ext = match[1].toLowerCase();
            if (["jpg","jpeg","png","gif","webp","bmp"].includes(ext)) return ext === "jpeg" ? "jpg" : ext;
        }
        if (contentType) {
            if (contentType.includes("jpeg")) return "jpg";
            if (contentType.includes("png")) return "png";
            if (contentType.includes("gif")) return "gif";
            if (contentType.includes("webp")) return "webp";
            if (contentType.includes("bmp")) return "bmp";
        }
        return "jpg";
    }

    function downloadImageAsArrayBuffer(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "arraybuffer",
                onload: function(response) {
                    let contentType = "";
                    try {
                        const headers = response.responseHeaders?.split('\n');
                        if (headers) {
                            for (const h of headers) {
                                if (h.toLowerCase().startsWith('content-type:')) {
                                    contentType = h.split(':')[1].trim();
                                    break;
                                }
                            }
                        }
                    } catch {}
                    resolve({ data: new Uint8Array(response.response), contentType });
                },
                onerror: function(err) {
                    console.error('[이미지 다운로드 실패]', url, err);
                    reject(err);
                }
            });
        });
    }

    async function downloadImagesAsZip(imgUrls) {
        await loadJsZip();
        const zip = new window.JSZip();
        for (let i = 0; i < imgUrls.length; i++) {
            const url = imgUrls[i];
            try {
                const { data, contentType } = await downloadImageAsArrayBuffer(url);
                const ext = getExtension(url, contentType);
                const fileName = `image_${(i+1).toString().padStart(3,'0')}.${ext}`;
                zip.file(fileName, data);
            } catch (e) {
                // 실패시만 출력
            }
        }
        let zipName = sanitizeFilename(document.title) || 'images';
        const blob = await zip.generateAsync({ type: 'blob', streamFiles: true, compression: 'STORE' });
        saveBlob(blob, zipName);
    }

    function saveBlob(blob, filename) {
        const file = new File([blob], filename, { type: 'application/zip' });
        const url = URL.createObjectURL(file);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);

        const guard = (e) => {
            const path = e.composedPath ? e.composedPath() : [];
            if (path.includes(a)) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        };
        window.addEventListener('click', guard, true);

        requestAnimationFrame(() => {
            a.click();
            window.removeEventListener('click', guard, true);
        });

        const cleanup = () => {
            try { a.remove(); } catch {}
            try { URL.revokeObjectURL(url); } catch {}
            window.removeEventListener('pagehide', cleanup, true);
            window.removeEventListener('beforeunload', cleanup, true);
        };
        window.addEventListener('pagehide', cleanup, { capture:true });
        window.addEventListener('beforeunload', cleanup, { capture:true });
    }


    function isArticlePage() {
        const path = location.pathname.split('/');
        return path.length === 4 && path[1] === 's';
    }

    function observeShareButton(onFound) {
        const observer = new MutationObserver(() => {
            if (!isArticlePage()) return;
            const shareBtn = Array.from(document.querySelectorAll('button')).find(btn =>
                                                                                  btn.textContent.includes('공유') ||
                                                                                  btn.getAttribute('aria-label') === '공유' ||
                                                                                  (btn.innerHTML && btn.innerHTML.includes('lucide-share2'))
                                                                                 );
            if (!shareBtn) return;
            if (shareBtn.parentNode.querySelector('.tampermonkey-download-btn')) return;
            onFound(shareBtn);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 공유 버튼 옆에 ZIP 버튼 삽입
    function insertDownloadButton(shareBtn) {
        const btn = document.createElement('button');
        btn.innerText = '이미지 ZIP';
        btn.type = 'button';
        btn.setAttribute('data-slot', 'button');
        btn.className = shareBtn.className + ' tampermonkey-download-btn';

        btn.onclick = async function() {
            btn.disabled = true;
            btn.innerText = '다운로드 중...';
            const urls = getImageUrls();
            if (!urls.length) {
                btn.innerText = '이미지 없음';
                return;
            }
            await downloadImagesAsZip(urls);
            btn.disabled = false;
            btn.innerText = '이미지 ZIP';
        };

        shareBtn.parentNode.insertBefore(btn, shareBtn.nextSibling);
    }

    observeShareButton(insertDownloadButton);

})();