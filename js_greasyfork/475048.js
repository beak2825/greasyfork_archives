// ==UserScript==
// @name         AIS Helper
// @namespace    nikku
// @license      MIT
// @version      0.1
// @description  AIS download helper
// @author       nikku
// @match        https://ais.archive74.ru/*
// @match        https://gato.72to.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archive74.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475048/AIS%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/475048/AIS%20Helper.meta.js
// ==/UserScript==

var downPath = window.location.origin + '/Pages/StorageFile.ashx?id=';

function getDownButton(url) {
    var btn = document.createElement('a');
    btn.classList.add('ui-button', 'ui-state-default', 'ui-tabs');
    btn.href = url;
    btn.textContent = 'Скачать';
    return btn;
}

function getCopyButton(arr) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Копировать ссылки';
    btn.onclick = function() {
        navigator.clipboard.writeText(arr.join('\r\n')).then(function() {
            alert('Ссылки скопированы!');
        });
    }
    return btn;
}

function processCart() {
    var isCart = window.location.hash.endsWith('CartList');
    if (isCart) {
        var observer = new MutationObserver(function(mut_list) {
            mut_list.forEach(function(mut) {
                mut.addedNodes.forEach(function(anod) {
                    if(anod.id == 'cartlistitemdetailspanel' && !anod.classList.contains('processed')) {
                        anod.classList.add('processed');
                        console.log('#cartlistitemdetailspanel has been added');
                        var prevArr = anod.querySelectorAll('.preview');
                        var fileArr = [];

                        prevArr.forEach(function(div) {
                            var fileId = div.dataset.url.replace(/.*id=(.*)&.*/, '$1');
                            fileArr.push(downPath + fileId);
                            div.append(getDownButton(downPath + fileId));
                        });

                        if (prevArr.length > 1) {
                            anod.prepend(getCopyButton(fileArr));
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            subtree: true, childList: true
        });
    }
}

function processFileList() {
    var table = document.querySelector('#MainPlaceHolder__storageFilesGridControl__gStorageFiles');
    if (table) {
        var spanArr = table.querySelectorAll('span[guid]');
        var fileArr = [];

        spanArr.forEach(function(span) {
            var fileId = span.getAttribute('guid');
            fileArr.push(downPath + fileId);
            span.parentNode.nextSibling.nextSibling.append(getDownButton(downPath + fileId));
        });

        if (spanArr.length > 1) {
            table.parentNode.prepend(getCopyButton(fileArr));
        }
    }
}

(function() {
    'use strict';

    if (window.location.pathname.endsWith('PersonalSettings.aspx')) {
        processCart();

        window.addEventListener('hashchange', function(event) {
            processCart();
        });
    }

    if (window.location.pathname.endsWith('StorageFilesList.aspx')) {
        processFileList();
    }
})();