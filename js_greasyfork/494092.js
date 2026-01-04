// ==UserScript==
// @name         LOGAV Source Files
// @namespace    nikku
// @license      MIT
// @version      0.2
// @description  Генерирует ссылки для скачивания исходных файлов с сайта ГКУ ЛОГАВ
// @author       nikku
// @match        https://archiveslo.ru/*/imageViewer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveslo.ru
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/494092/LOGAV%20Source%20Files.user.js
// @updateURL https://update.greasyfork.org/scripts/494092/LOGAV%20Source%20Files.meta.js
// ==/UserScript==

/* global saveAs */

(function() {
    'use strict';

    var attr = unsafeWindow.attributeId;
    var srv = unsafeWindow.contextPath;
    var serials = new Set(unsafeWindow.serials);
    var num = serials.size;
    var obj = document.querySelector('.image-viewer-btn-action').getAttribute('href').match(/field_document=(\d+)/)[1];

    var rand = crypto.randomUUID().substring(0, 8);
    var file = 'logav_links-' + num + '_' + rand + '.txt';
    var btnHtml = '<button type="button" title="Ссылки на исходные файлы" class="button btnDownload" id="btn_source" style="box-shadow: 0 0 10px 2px lime;"></button>';

    var url = window.location.origin + srv + '/file?objectId=';
    var text = '';

    if (num) {
        serials.forEach(function (sn) {
            text += url + obj + '&attributeId=' + attr + '&sn=' + sn + '\r\n';
        });
    }

    document.querySelector('.slide_buttons').insertAdjacentHTML('beforeend', btnHtml);
    document.querySelector('#btn_source').addEventListener('click', function() {
        saveAs(new Blob([text], {type: 'text/plain;charset=utf-8'}), file);
    });
})();
