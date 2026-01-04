// ==UserScript==
// @name         Sukebei Nyaa VR ID Highlighter + Preview
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  高亮Sukebei Nyaa中的番號並預覽圖片
// @author       AI
// @match        *://*.sukebei.nyaa.si/*
// @grant        GM_xmlhttpRequest
// @connect      javdb.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537769/Sukebei%20Nyaa%20VR%20ID%20Highlighter%20%2B%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/537769/Sukebei%20Nyaa%20VR%20ID%20Highlighter%20%2B%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pattern = /\b[A-Z0-9]{3,}-\d{3,}\b/gi;

    // 建立預覽圖容器
    const previewImg = document.createElement('img');
    previewImg.style.position = 'fixed';
    previewImg.style.top = '50%';
    previewImg.style.left = '50%';
    previewImg.style.transform = 'translate(-50%, -50%)';
    previewImg.style.maxHeight = '90vh';
    previewImg.style.objectFit = 'contain';
    previewImg.style.zIndex = '9999';
    previewImg.style.display = 'none';
    previewImg.style.border = '2px solid #333';
    previewImg.style.backgroundColor = '#fff';
    document.body.appendChild(previewImg);

    let showTimeout;

    const rows = document.querySelectorAll('table.torrent-list tbody tr');
    rows.forEach(row => {
        const nameCell = row.querySelector('td[colspan] a');
        if (nameCell) {
            let html = nameCell.innerHTML;
            html = html.replace(pattern, match => `<span class="highlight-vr" data-id="${match}" style="background-color: yellow; font-weight: bold; cursor: pointer;">${match}</span>`);
            nameCell.innerHTML = html;
        }
    });

    document.body.addEventListener('mouseover', e => {
        if (e.target.classList.contains('highlight-vr')) {
            if(document.querySelector(".item .cover img")){
            return; // 防止出现菜单后重复触发, 尤其是margin上移两像素后
        }
            const id = e.target.dataset.id;

            showTimeout = setTimeout(() => {
                clearTimeout(showTimeout);
                const searchUrl = `https://javdb.com/search?q=${encodeURIComponent(id)}&f=all`;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: searchUrl,
                    onload: function(res) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(res.responseText, 'text/html');
                        const img = doc.querySelector('.item .cover img');
                        if (img) {
                            previewImg.src = img.src;
                            previewImg.style.display = 'block';
                        }
                    }
                });
            }, 500); // 緩衝延遲0.7秒
        }
    });

    document.body.addEventListener('mouseenter', e => {
        if (e.target.classList.contains('highlight-vr')) {
            clearTimeout(showTimeout); // 取消延遲任務
            previewImg.style.display = 'none';
        }
    });

    previewImg.addEventListener('mouseleave', () => {
        previewImg.style.display = 'none';
    });
})();
