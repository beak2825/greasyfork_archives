// ==UserScript==
// @name         NLB E-Lib Helper
// @namespace    nikku
// @license      MIT
// @version      0.3
// @description  Исправляет скачивание файлов на сайте elib.nlb.by, добавляет прогресс загрузки
// @author       nikku
// @match        *://elib.nlb.by/viewer*
// @match        *://elib.nlb.by:8070/viewer*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://elib.nlb.by
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/497749/NLB%20E-Lib%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/497749/NLB%20E-Lib%20Helper.meta.js
// ==/UserScript==

function toMbStr(bytes) {
    return (bytes / 1024 / 1024).toFixed(1) + ' Мб';
}

function addProgress() {
    const progHtml = '<div id="prog-wrap" class="pb-3 white-space-nowrap"><span id="prog-done" class="pr-2"></span>' +
          '<progress id="prog-line" max="100"></progress><span id="prog-size" class="pl-2"></span></div>';

    if (!document.querySelector('#prog-wrap')) {
        document.querySelector('.overlay.download .heading').insertAdjacentHTML('afterend', progHtml);
    }
}

function processManifest(json) {
    const furl = json.rendering[0] ? json.rendering[0].id : `/iiif/file/${window.location.search.split('=')[2]}/bytes`;
    const file = json.items[0].thumbnail[0].id.match(/%2F([^%]+)\.\w+;/)[1];
    const html = `<a href="${furl}?attachmentName=${file}"
                     style="background-color: palegreen; margin-left: 15px; padding: 4px 8px; border: 1px solid #212121; border-radius: 5px;"
                     >Скачать документ — ${file}</a>`;

    document.querySelector('.flex.justify-content-center.align-items-center').insertAdjacentHTML('beforeend', html);

    const observer = new MutationObserver(function (mutList) {
        mutList.forEach(function (mut) {
            mut.addedNodes.forEach(function (anod) {
                if (anod.classList && anod.classList.contains('overlay') && anod.classList.contains('download')) {
                    anod.querySelector('h2').remove();
                    anod.querySelector('button').textContent = 'Текущее изображение';
                }
            });
        });
    });

    observer.observe(document.body, {
        subtree: true, childList: true
    });
}

(function() {
    'use strict';

    const origWindow = unsafeWindow.open;
    unsafeWindow.open = function() {
        if (arguments[0].endsWith('/default.jpg')) {
            arguments[0] = arguments[0].replace(/\/full\/[^/]+/, '/full/max');
        }
        origWindow.apply(this, arguments);
    };

    const origOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function() {
        if (arguments[1].includes('iiif/manifest')) {
            this.addEventListener('load', function() {
                const json = JSON.parse(this.responseText);
                processManifest(json);
            });
        }
        origOpen.apply(this, arguments);
    };

    const origFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function() {
        if (arguments[0] && (arguments[0].includes('bytes?attachmentName') ||
                             arguments[0].includes('pages?pagesPattern'))) {
            addProgress();

            const res = await origFetch.apply(this, arguments);
            const clone = res.clone();
            const cLength = res.headers.get('Content-Length');

            const done = document.querySelector('#prog-done');
            const prog = document.querySelector('#prog-line');
            const size = document.querySelector('#prog-size');

            size.textContent = toMbStr(cLength);

            let total = 0;
            for await (const chunk of clone.body) {
                total += chunk.length;
                done.textContent = toMbStr(total);
                prog.value = Math.round(total / cLength * 100);
            }

            return res;
        } else {
            return origFetch.apply(this, arguments);
        }
    };
})();