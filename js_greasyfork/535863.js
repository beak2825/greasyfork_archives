// ==UserScript==
// @name         ⚙️ Spriters\Models Resource - Enhancer 
// @namespace    GPT
// @version      1.0.6
// @description  Adds download button and model/sprite preview on hover, and widescreen.
// @description:ru  Добавляет кнопку загрузки и предпросмотр моделей/спрайтов при наведении на миниатюры, и широкий формат для сайта.
// @author       Wizzergod
// @match        *://www.models-resource.com/*
// @match        *://www.spriters-resource.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=models-resource.com
// @resource     dicon https://images.icon-icons.com/3456/PNG/32/download_folder_file_icon_219533.png
// @grant        GM_addStyle
// @grant        GM_getResourceURL
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535863/%E2%9A%99%EF%B8%8F%20Spriters%5CModels%20Resource%20-%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/535863/%E2%9A%99%EF%B8%8F%20Spriters%5CModels%20Resource%20-%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🌐 Language definitions
    const LANG = navigator.language.startsWith('ru') ? 'ru' : 'en';

    const i18n = {
        'downloadZip': LANG === 'ru' ? 'Скачать .zip' : 'Download .zip',
        'iconText': '💾'
    };

    // 🎨 Custom styles
    GM_addStyle(`
        .downloadmodel {
            width: 32px;
            height: 32px;
        }
        .preview-image {
            position: fixed;
            pointer-events: none;
            z-index: 1000000;
            max-width: 300px;
            max-height: 300px;
            border: 2px solid #aca443 !important;
            background: #fff;
            display: none;
            border-radius: 10px;
            box-shadow: 0 0 20px #000, inset 0 0 10px #0066cc;
        }
        @media screen and (min-width: 1200px) {
            .wrap {
                padding-left: unset !important;
                padding-right: unset !important;
            }
        }
        .wrap {
            width: unset !important;
            min-width: unset !important;
            max-width: unset !important;
        }
        #body {
            background-color: #444444 !important;
        }
        .rowfooter a[href*="download"], .bigiconheadertext {
            color: #55fd55 !important;
        }
        #sheet-container img {
            max-width: calc(25% - 20px) !important;
        }
        div.updateconsolename {
            background-color: #d86363a3 !important;
        }
        .updatetext {
            background-color: #2a2a2a1c !important;
        }
    `);

    const preview = document.createElement('img');
    preview.className = 'preview-image';
    document.body.appendChild(preview);

    function processModel(iconBody) {
        if (!iconBody || iconBody.dataset.processed) return;
        iconBody.dataset.processed = "true";

        const parentLink = iconBody.closest('a[href*="/model/"], a[href*="/sheet/"]');
        if (!parentLink) return;

        const href = parentLink.getAttribute('href');
        const match = href.match(/\/(model|sheet)\/(\d+)/);
        if (!match) return;

        const type = match[1];
        const modelId = match[2];

        // 📦 Add download button
        if (!iconBody.querySelector('.downloadmodel')) {
            const downloadLink = document.createElement('a');
            downloadLink.href = `${window.location.protocol}//${window.location.hostname}/download/${modelId}/`;
            downloadLink.style = 'position: absolute; bottom: -40px; right: 6px; z-index: 999999;';
            downloadLink.setAttribute("title", i18n.downloadZip);

            const downloadImg = document.createElement('img');
            downloadImg.src = GM_getResourceURL('dicon');
            downloadImg.alt = i18n.downloadZip;
            downloadImg.className = 'downloadmodel';
            downloadImg.setAttribute("loading", "lazy");

            downloadLink.appendChild(downloadImg);
            iconBody.appendChild(downloadLink);
        }

        // 👁️ Add preview on hover
        const sheetImg = iconBody.querySelector('img[src*="/resources/sheet_icons/"]');
        if (sheetImg) {
            const src = sheetImg.getAttribute('src');
            const matchSrc = src.match(/\/resources\/sheet_icons\/(\d+)\//);
            if (!matchSrc) return;
            const modelId1 = matchSrc[1];

            let bigIconUrl = '';
            if (window.location.hostname.includes('models-resource.com')) {
                bigIconUrl = `${window.location.protocol}//${window.location.hostname}/resources/big_icons/${modelId1}/${modelId}.png`;
            } else if (window.location.hostname.includes('spriters-resource.com')) {
                bigIconUrl = `${window.location.protocol}//${window.location.hostname}/resources/sheets/${modelId1}/${modelId}.png`;
            }

            sheetImg.addEventListener('mouseenter', () => {
                preview.src = bigIconUrl;
                preview.style.display = 'block';
            });

sheetImg.addEventListener('mousemove', e => {
    const padding = 20;
    const previewWidth = preview.offsetWidth || 300;
    const previewHeight = preview.offsetHeight || 300;

    let left = e.clientX + padding;
    let top = e.clientY + padding;

    // Если не вмещается справа — показываем слева
    if (left + previewWidth > window.innerWidth) {
        left = e.clientX - previewWidth - padding;
    }

    // Если не вмещается снизу — показываем выше
    if (top + previewHeight > window.innerHeight) {
        top = e.clientY - previewHeight - padding;
    }

    // На всякий случай избегаем отрицательных значений
    preview.style.left = Math.max(0, left) + 'px';
    preview.style.top = Math.max(0, top) + 'px';
});


            sheetImg.addEventListener('mouseleave', () => {
                preview.style.display = 'none';
            });
        }
    }

    function processAll() {
        document.querySelectorAll('a[href*="/model/"] .iconbody, a[href*="/sheet/"] .iconbody')
            .forEach(processModel);
    }

    // 🖼️ Add 💾 icon to download-related text
    document.querySelectorAll('.rowfooter a[href*="download"]').forEach(link => {
        link.textContent = `${i18n.iconText} ${link.textContent}`;
    });
    document.querySelectorAll('.bigiconheadertext').forEach(link => {
        link.textContent = `${i18n.iconText} ${link.textContent}`;
    });

    processAll();

    const observer = new MutationObserver(() => {
        processAll();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
