// ==UserScript==
// @name         supercoloring 批量下载
// @namespace    http://tampermonkey.net/
// @version      2024-06-13
// @description  暂时还没想好
// @author       LS T
// @match        https://www.supercoloring.com/coloring-books/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=supercoloring.com
// @license      GPL-3
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/497774/supercoloring%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/497774/supercoloring%20%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // GM_log('hello world');

    function download(url, filename) {
        let xhr= new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if ( xhr.status === 200 ) {
                var urlObject = window.URL || window.webkitURL || window;
                var export_blob = new Blob([xhr.response]);
                var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
                save_link.href = urlObject.createObjectURL(export_blob);
                save_link.download = filename;
                save_link.click();
            }
        }
        xhr.send();
    };

    function download_one(element) {
        var url, filename;
        url = element.querySelector('img').src;
        url = url.replace('coloring_thumbnail', 'coloring_full');
        filename = url.replace(/^.*\//, '');
        download(url, filename);
    }

    function download_all() {
        var elements = document.getElementsByClassName('field-items');
        Array.from(elements).forEach(function (element) {
            try{
                download_one(element)
            }catch (exception) {
                GM_log(element, exception)
            }
        });
    }

    function inject() {
        var elements = document.getElementById('main-content').querySelectorAll('div[id]');
        elements.forEach( (element) => {
            if ( element.id.startsWith('node-') ) {
                var button = document.createElement('button');
                button.innerHTML = '下载';
                button.onclick = function() { download_one(element) };
                element.querySelector('h4').append(button);
            }
        });

        var button = document.createElement('button');
        button.innerHTML = '下载全部';
        // button.onclick = function() { download_all() };
        button.onclick = download_all;
        document.getElementById('page-title').append(button);
    }

    inject()

})();