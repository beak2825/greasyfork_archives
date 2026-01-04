// ==UserScript==
// @name         Telegraph 图片导出(含Md格式)+图片打包下载
// @namespace    https://telegra.ph
// @version      1.2
// @description  导出图片URL、Markdown格式，打包所有图片为zip并带打包进度提示，还能跳转到套图频道🔞
// @author       zsonline
// @match        *://telegra.ph/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534281/Telegraph%20%E5%9B%BE%E7%89%87%E5%AF%BC%E5%87%BA%28%E5%90%ABMd%E6%A0%BC%E5%BC%8F%29%2B%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/534281/Telegraph%20%E5%9B%BE%E7%89%87%E5%AF%BC%E5%87%BA%28%E5%90%ABMd%E6%A0%BC%E5%BC%8F%29%2B%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js';
    document.body.appendChild(script);

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    waitForElement('header address', function (box) {
        function createButton(text) {
            var btn = document.createElement('button');
            btn.style.marginLeft = '10px';
            btn.textContent = text;
            btn.style.padding = '5px 10px';
            btn.style.borderRadius = '5px';
            btn.style.cursor = 'pointer';
            return btn;
        }

        var buttons = [
            { text: '导出图片链接', handler: openExportMenu },
            { text: '打包下载', handler: packZip },
            { text: '套图频道🔞', handler: openChannel }
        ];

        buttons.forEach(info => {
            var btn = createButton(info.text);
            btn.addEventListener('click', info.handler);
            box.appendChild(btn);
        });
    });

    function getImages() {
        var imgs = document.querySelectorAll('.ql-editor img');
        if (imgs.length === 0) {
            alert('未找到图片');
            return null;
        }
        return Array.from(imgs);
    }

    function downloadFile(content, filename) {
        var blob = new Blob([content], { type: 'text/plain' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function exportTxt() {
        var imgs = getImages();
        if (!imgs) return;
        var content = imgs.map(img => img.src).join('\n');
        downloadFile(content, `${document.title}.txt`);
    }

    function exportMd() {
        var imgs = getImages();
        if (!imgs) return;
        var title = document.title.trim();
        var mdContent = `# ${title}\n\n` + imgs.map(img => `![](${img.src})`).join('\n\n');
        downloadFile(mdContent, `${title}.md`);
    }

    function openExportMenu() {
        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = '50%';
        menu.style.left = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
        menu.style.background = '#fff';
        menu.style.padding = '20px';
        menu.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        menu.style.zIndex = '10000';
        menu.style.borderRadius = '8px';
        menu.innerHTML = `
            <h3>选择导出格式</h3>
            <button id="export-txt" style="margin:5px;padding:5px 10px;">导出为纯链接(TXT)</button>
            <button id="export-md" style="margin:5px;padding:5px 10px;">导出为Markdown</button>
            <br><br>
            <button id="close-menu" style="margin-top:10px;padding:5px 10px;">取消</button>
        `;
        document.body.appendChild(menu);

        document.getElementById('export-txt').onclick = function () {
            exportTxt();
            menu.remove();
        };
        document.getElementById('export-md').onclick = function () {
            exportMd();
            menu.remove();
        };
        document.getElementById('close-menu').onclick = function () {
            menu.remove();
        };
    }

    async function packZip() {
        var imgs = getImages();
        if (!imgs) return;

        function ensureJSZipLoaded(callback) {
            if (typeof JSZip !== 'undefined') {
                callback();
            } else {
                setTimeout(() => ensureJSZipLoaded(callback), 500);
            }
        }

        ensureJSZipLoaded(async () => {
            const zip = new JSZip();
            const folder = zip.folder(document.title.trim() || 'images');

            const statusDiv = document.createElement('div');
            statusDiv.style.position = 'fixed';
            statusDiv.style.top = '20px';
            statusDiv.style.right = '20px';
            statusDiv.style.padding = '10px 15px';
            statusDiv.style.backgroundColor = '#000';
            statusDiv.style.color = '#fff';
            statusDiv.style.zIndex = '9999';
            statusDiv.style.borderRadius = '5px';
            statusDiv.textContent = '开始打包图片...';
            document.body.appendChild(statusDiv);

            for (let i = 0; i < imgs.length; i++) {
                try {
                    const url = imgs[i].src;
                    statusDiv.textContent = `正在打包第 ${i + 1} / ${imgs.length} 张...`;
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const ext = url.split('.').pop().split(/\#|\?/)[0];
                    folder.file(`image_${i + 1}.${ext}`, blob);
                } catch (e) {
                    console.error(`第${i+1}张图片下载失败:`, e);
                }
            }

            statusDiv.textContent = '打包完成，开始下载...';

            zip.generateAsync({ type: 'blob' }).then(function (content) {
                var link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `${document.title.trim()}.zip`;
                link.click();
                URL.revokeObjectURL(link.href);
                statusDiv.remove();
            }).catch(e => {
                statusDiv.textContent = '打包失败！';
                console.error(e);
            });
        });
    }

    function openChannel() {
        window.open('https://t.me/NSFWPI', '_blank');
    }

})();
