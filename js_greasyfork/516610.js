// ==UserScript==
// @name         PornoLab Batch Downloader
// @namespace    copyMister
// @version      1.0
// @description  Batch download all torrents from search results on PornoLab
// @description:ru  Массовое скачивание торрент-файлов из результатов поиска на PornoLab
// @author       copyMister
// @license      MIT
// @match        https://pornolab.net/forum/tracker.php*
// @match        https://pornolab.cc/forum/tracker.php*
// @match        https://pornolab.biz/forum/tracker.php*
// @match        https://pornolab.lib/forum/tracker.php*
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.0/umd/index.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/drag-check-js@2.0.2/dist/dragcheck.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornolab.net
// @grant        none
// @homepageURL  https://pornolab.net/forum/viewtopic.php?t=2714164
// @downloadURL https://update.greasyfork.org/scripts/516610/PornoLab%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/516610/PornoLab%20Batch%20Downloader.meta.js
// ==/UserScript==

/* global fflate, saveAs, DragCheck */

var waitTime = 500; // сколько мс ждать при скачивании очередного торрента (по умолчанию 0.5 сек)
var batchBtn, downBtns, count, files;
var fileArray = {};

function addTorrent(url, total) {
    var torName;
    var torId = url.split('=')[1];
    var xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onloadstart = function() {
        document.querySelector('#batch-down').textContent = 'Загрузка... ' + (total - count);
        count++;
    };
    xhr.onload = function() {
        torName = xhr.getResponseHeader('Content-Disposition').match(/name="([^"]+)"/);
        if (torName && xhr.response) {
            files++;
            torName = decodeURIComponent(torName[1]);
            fileArray[torName] = new Uint8Array(xhr.response);
            console.log('Success: #' + torId + '. ' + torName);
        }
        if (count == total) saveZip();
    };
    xhr.onerror = function() {
        console.log('Error: #' + torId + '. ' + xhr.status + ' ' + xhr.statusText);
        if (count == total) saveZip();
    };
    xhr.ontimeout = function() {
        console.log('Timeout: #' + torId);
        if (count == total) saveZip();
    };
    xhr.onabort = function() {
        console.log('Abort: #' + torId);
        if (count == total) saveZip();
    };
    xhr.send();
}

function saveZip() {
    var fileName, page, archive;
    var add = '';
    var date = new Date().toISOString().substr(2, 8);

    page = document.querySelector('.bottom_info > .nav > p > b');
    if (page) {
        add = ' #' + page.textContent;
    }

    fileName = document.querySelector('#title-search').value || 'torrents';
    fileName = '[plab] [' + date + '] ' + fileName + add + ' [' + files + '].zip';

    console.log('Generating archive...');
    archive = fflate.zipSync(fileArray, {level: 1});
    archive = new Blob([archive]);
    saveAs(archive, fileName);
    batchBtn.textContent = 'Готово!';
    batchBtn.disabled = false;
}

function updateBatchBtnText() {
    var selCount = document.querySelectorAll('.sel-cbox:checked').length;
    downBtns = document.querySelectorAll('#tor-tbl .dl-stub');

    if (selCount) {
        batchBtn.textContent = 'Скачать выдел. ' + selCount;
    } else {
        batchBtn.textContent = 'Скачать все ' + downBtns.length;
    }
}

function toggleRowBackground(cbox, checked) {
    var td;
    if (checked) {
        for (td of cbox.closest('tr').children) {
            td.style.setProperty('background-color', 'rgba(255, 255, 255, .01)', 'important');
        }
    } else {
        for (td of cbox.closest('tr').children) {
            td.style.removeProperty('background-color');
        }
    }
}

function processTorrentRows(trs) {
    var selHtml = '<td class="row4 sel-td" style="padding: 15px; position: relative;"><label class="sel-label" style="user-select: none; margin: 0; position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"><input class="sel-cbox" type="checkbox" style="margin: 0;"></label></td>';
    var cboxArray = [];
    var tdHtml, hasDown;

    trs.forEach(function(tr) {
        hasDown = tr.querySelector('.dl-stub');
        tdHtml = selHtml;

        if (!hasDown) {
            tdHtml = '<td class="row4" style="padding: 15px; user-select: none;"></td>';
        }
        tr.querySelector('td:last-child').insertAdjacentHTML('afterend', tdHtml);

        if (hasDown) {
            tr.querySelector('.sel-cbox').addEventListener('change', function() {
                toggleRowBackground(this, this.checked);
                updateBatchBtnText();
            });
            cboxArray.push(tr.querySelector('.sel-label'));
        }
    });

    new DragCheck({
        checkboxes: cboxArray,
        getChecked: function(label) {
            return label.firstElementChild.checked;
        },
        setChecked: function(label, state) {
            label.firstElementChild.checked = state;
        },
        onChange: function(label) {
            var cbox = label.firstElementChild;
            toggleRowBackground(cbox, cbox.checked);
            updateBatchBtnText();
        }
    });

    setTimeout(function() {
        updateBatchBtnText();
    }, 100);
}

(function() {
    'use strict';

    var url, td, selBoxes;
    var batchBtnHtml = '<div class="border row2" style="text-align: center; margin-bottom: 6px; padding: 5px 0; border-width: 1px; position: sticky; top: 0; z-index: 1; display: flex; justify-content: center;"><button id="sel-all" title="Выделить все торренты" class="row5 clickable" style="width: 90px; height: 20px; margin-right: 10px; border: 1px solid #999999; font-family: Verdana,sans-serif; font-size: 10px;">☑️ Выдел. всё</button><button id="batch-down" class="row1 clickable" style="width: 140px; height: 20px; border: 1px solid gray; border-radius: 3px; font-family: Verdana,sans-serif; font-size: 11px; font-weight: bold;"></button><button id="unsel-all" title="Снять всё выделение" class="row5 clickable" style="width: 90px; height: 20px; margin-left: 10px; border: 1px solid #999999; font-family: Verdana,sans-serif; font-size: 10px;">✖️ Снять всё</button></div>';

    if (document.querySelector('.dl-stub')) {
        document.querySelector('#search-results').insertAdjacentHTML('afterbegin', batchBtnHtml);
        batchBtn = document.querySelector('#batch-down');

        batchBtn.addEventListener('click', function() {
            batchBtn.disabled = true;
            count = 0;
            files = 0;
            fileArray = {};

            selBoxes = document.querySelectorAll('.sel-cbox:checked');

            if (downBtns.length) {
                if (selBoxes.length) {
                    selBoxes.forEach(function(cbox, ind) {
                        var btn = cbox.closest('tr').querySelector('.dl-stub');
                        setTimeout(function() {
                            addTorrent(btn.href, selBoxes.length);
                        }, waitTime + (ind * waitTime));
                    });
                } else {
                    downBtns.forEach(function(btn, ind) {
                        setTimeout(function() {
                            addTorrent(btn.href, downBtns.length);
                        }, waitTime + (ind * waitTime));
                    });
                }
            }
        });

        document.querySelector('#tor-tbl th:last-child').insertAdjacentHTML('afterend', '<th data-sorter="false"></th>');
        document.querySelector('#tor-tbl > tfoot td').colSpan += 1;

        processTorrentRows(document.querySelectorAll('#tor-tbl > tbody > tr'));

        document.querySelector('#unsel-all').addEventListener('click', function() {
            document.querySelectorAll('.sel-cbox:checked').forEach(function(cbox) {
                cbox.checked = false;
                toggleRowBackground(cbox, false);
            });
            updateBatchBtnText();
        });

        document.querySelector('#sel-all').addEventListener('click', function() {
            document.querySelectorAll('.sel-cbox').forEach(function(cbox) {
                cbox.checked = true;
                toggleRowBackground(cbox, true);
            });
            updateBatchBtnText();
        });

        document.addEventListener('new-torrents', function(e) {
            processTorrentRows(e.detail.querySelectorAll('tr'));
        });
    }
})();