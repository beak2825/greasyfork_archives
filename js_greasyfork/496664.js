// ==UserScript==
// @name         Archyvai.lt Downloader
// @namespace    nikku
// @license      MIT
// @version      0.2
// @description  Генерирует ссылки для скачивания изображений с сайта eais.archyvai.lt
// @author       nikku
// @match        https://eais.archyvai.lt/repo-ext-viewer/?manifest=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eais.archyvai.lt
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/496664/Archyvailt%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/496664/Archyvailt%20Downloader.meta.js
// ==/UserScript==

/* global saveAs */

function processData(d) {
    let text = '';
    const path = '/full/max/0/default.jpg';
    const file = `${d.archiveAbbr}_${d.fondNum}_${d.seriesNum}_${d.fileNum}_${d.title.slice(0, 192)} [${d.items.length}].txt`;

    d.items.forEach(function(item) {
        text += item.items[0].items[0].body.id + path + '\r\n';
    });

    const btnHtml = `
    <button id="down_links" class="MuiButtonBase-root MuiIconButton-root" type="button"
        title="Скачать список ссылок">
        <span class="MuiIconButton-label">
            <svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24">
                <path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z"></path>
            </svg>
        &nbsp;D/L
        </span>
    </button>`;

    let stopObserve = false;
    const observer = new MutationObserver(function (mutList) {
        for (let i = 0; i < mutList.length; i++) {
            for (let j = 0; j < mutList[i].addedNodes.length; j++) {
                const added = mutList[i].addedNodes[j];
                if (added.classList && added.classList.contains('MuiTouchRipple-root')) {
                    document.querySelector('.MuiToolbar-root > h2').insertAdjacentHTML('afterend', btnHtml);
                    document.querySelector('#down_links').addEventListener('click', function() {
                        saveAs(new Blob([text], {type: 'text/plain;charset=utf-8'}), file);
                    });
                    observer.disconnect();
                    stopObserve = true;
                    break;
                }
            }
            if (stopObserve) {
                break;
            }
        }
    });

    observer.observe(document.body, {
        subtree: true, childList: true
    });
}

(function() {
    'use strict';

    const origFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(arg) {
        const res = await origFetch(arg);
        if (arg.endsWith('/manifest')) {
            res.clone().json().then(function(json) {
                processData(json);
            });
        }
        return res;
    }
})();
