// ==UserScript==
// @name         AltSoft Links Generator
// @namespace    nikku
// @license      MIT
// @version      0.3
// @description  Генерирует ссылки для скачивания изображений с сайтов на движке КАИСА-Архив (Альт-Софт)
// @author       nikku
// @match        https://archiveslo.ru/*/imageViewer/*
// @match        https://fgurgia.ru/imageViewer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveslo.ru
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/492791/AltSoft%20Links%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/492791/AltSoft%20Links%20Generator.meta.js
// ==/UserScript==

/* global saveAs */

(function() {
    'use strict';

    var urls, pages, ids;
    var page = window.location.pathname;
    var path = unsafeWindow.hostPath;

    if (page.endsWith('/turn')) {
        urls = unsafeWindow.urls;
        pages = unsafeWindow.numberOfPages;
    } else {
        ids = document.querySelector('#btnLast').getAttribute('onclick').match(/\((.*)\./)[1];
        urls = unsafeWindow[ids];
        pages = unsafeWindow.pages.length;
    }

    var rand = crypto.randomUUID().substring(0, 8);
    var file = window.location.hostname + '_links-' + pages + '_' + rand + '.txt';
    var btnHtml = '<button type="button" title="Скачать список ссылок" class="button btnDownload" id="btn_links"></button>';
    var text = '';

    if (urls.length) {
        urls.forEach(function (id) {
           text += path + '/image?url=' + id + '\r\n';
        });
    }

    document.querySelector('.slide_buttons').insertAdjacentHTML('beforeend', btnHtml);
    document.querySelector('#btn_links').addEventListener('click', function() {
        saveAs(new Blob([text], {type: 'text/plain;charset=utf-8'}), file);
    });
})();
