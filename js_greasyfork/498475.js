// ==UserScript==
// @name         SpbArchives IAC Downloader
// @namespace    nikku
// @license      MIT
// @version      0.1
// @description  Генерирует ссылки для скачивания изображений, разблокирует правую кнопку мыши
// @author       nikku
// @match        *://spbarchives.ru/infres*
// @match        *://archives.tverreg.ru/infres*
// @match        *://archiv-portal.nobl.ru/infres*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://spbarchives.ru
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @run-at       document-idle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/498475/SpbArchives%20IAC%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/498475/SpbArchives%20IAC%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.oncontextmenu = undefined;

    const origListener = unsafeWindow.EventTarget.prototype.addEventListener;
    unsafeWindow.EventTarget.prototype.addEventListener = function(type) {
        if (type !== 'contextmenu') {
            origListener.apply(this, arguments);
        }
    };

    const btnHtml = `
    <a id="down_links" href="#" class="link-with-icon ml-24">
        <span class="icomoon-download" style="vertical-align: bottom;"></span>
        <span class="ml-1">Скачать список ссылок</span>
    </a>`;

    const helpIcon = document.querySelector('#menu .icon-help');
    const archive = helpIcon.previousElementSibling.textContent.trim();
    const docName = helpIcon.title.trim();
    let fileName = `${archive} - ${docName}`.slice(0, 192).replace(/[/\\?%*:|"<>]/g, '_');
    helpIcon.insertAdjacentHTML('afterend', btnHtml);

    document.querySelector('#down_links').addEventListener('click', function(e) {
        e.preventDefault();

        let text = '';
        const images = unsafeWindow.images;
        const file = `${fileName} [${images.length}].txt`;

        images.forEach(function(item) {
            text += item.imageUrl.replace(':443', '') + '\r\n';
        });

        saveAs(new Blob([text], {type: 'text/plain;charset=utf-8'}), file);
    });
})();
