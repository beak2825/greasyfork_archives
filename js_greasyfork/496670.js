// ==UserScript==
// @name         ePaveldas.lt Downloader
// @namespace    nikku
// @license      MIT
// @version      0.2
// @description  Генерирует ссылки для скачивания изображений с сайта epaveldas.lt
// @author       nikku
// @match        https://www.epaveldas.lt/preview?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epaveldas.lt
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496670/ePaveldaslt%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/496670/ePaveldaslt%20Downloader.meta.js
// ==/UserScript==

/* global saveAs */

function processData(data) {
    let text = '';
    const items = Object.keys(data.resourcesFull);
    let file = `${data.providerCode}_${data.id}_${data.title.slice(0, 160)} [${items.length}].txt`;
    file = file.replace(/[/\\?%*:|"<>]/g, '_');

    items.forEach(function(item) {
        text += item + '\r\n';
    });

    const btn = document.createElement('button');
    btn.id = 'down_links';
    btn.className = 'mat-subheading-2';
    btn.style.width = '100%';
    btn.title = 'Скачать список ссылок';
    btn.textContent = 'Download all page links';
    btn.addEventListener('click', function() {
        saveAs(new Blob([text], {type: 'text/plain;charset=utf-8'}), file);
    });

    let stopObserve = false;
    const observer = new MutationObserver(function (mutList) {
        for (let i = 0; i < mutList.length; i++) {
            for (let j = 0; j < mutList[i].addedNodes.length; j++) {
                if (mutList[i].addedNodes[j].classList.contains('preview')) {
                    mutList[i].addedNodes[j].querySelector('.kpo-details__right').prepend(btn);
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

(function(open) {
    XMLHttpRequest.prototype.open = function() {
        if (arguments[1].includes('findById')) {
            this.addEventListener('load', function() {
                const json = JSON.parse(this.responseText);
                processData(json);
            }, false);
        }

        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);
