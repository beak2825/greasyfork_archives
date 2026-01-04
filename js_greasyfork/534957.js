// ==UserScript==
// @name         8chan Multiboard Catalog
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Adds multiboard catalog support and thread creation
// @author       socko
// @match        *://8chan.moe/*
// @match        *://8chan.se/*
// @match        *://8chan.cc/*
// @match        *://8chan.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=8chan.moe
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        unsafeWindow
// @run-at       document-start
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/534957/8chan%20Multiboard%20Catalog.user.js
// @updateURL https://update.greasyfork.org/scripts/534957/8chan%20Multiboard%20Catalog.meta.js
// ==/UserScript==

// Incorporates code from Aleph
// Source: https://gitgud.io/8chan/Aleph
// License: https://gitgud.io/8chan/Aleph/-/raw/dev/license.txt?ref_type=heads
(function () {
    unsafeWindow.addEventListener('DOMContentLoaded', (function () {
        for (const obj of document.getElementsByClassName('mb-cell-string')) {
            let boards = obj.firstChild.getAttribute('title').replace(/\+/g, '-');
            obj.firstChild.setAttribute('href', `/multiboard/catalog.html?boards=${boards}`);
        }}));
})();


(function () {
    let temp = window.location.search.match(/=([\w+\-]*)/)[1].split('-');
    if (!temp) {
        console.error("No load");
        return;
    }

    Object.defineProperty(unsafeWindow, 'catalog', {
        value: {},
        writeable: false
    });
    Object.defineProperty(unsafeWindow, 'api', {
        value: {},
        writeable: false
    });

    unsafeWindow.catalog.boardArray = temp;
    unsafeWindow.catalog.boardArray = Array.from(new Set(unsafeWindow.catalog.boardArray));

    //START FUNCTION OVERRIDES//
    Object.defineProperty(unsafeWindow.catalog, 'getCatalogData', {
        value: function(callback) {
            console.log(catalog.boardArray);
            catalog.catalogThreads = null;

            if (catalog.loadingData) {
                return;
            }

            catalog.loadingData = true;

            for (let i = 0; i < catalog.boardArray.length; ) {
                api.localRequest('/' + catalog.boardArray[i++] + '/catalog.json', function gotBoardData(
                                 error, data) {
                    catalog.loadingData = false;

                    if (error) {
                        if (callback) {
                            callback(error);
                        } else {
                            console.log(error);
                        }
                        return;
                    }

                    data = JSON.parse(data)

                    let uri = catalog.boardArray[i-1];
                    for (const obj of data) {
                        obj.boardUri = uri;
                        if (catalog.boardArray.length > 1)
                            obj.subject = '/' + uri + '/' + ' - ' + obj.subject;
                    }

                    if (!catalog.catalogThreads) {
                        catalog.catalogThreads = data;
                    } else {
                        catalog.catalogThreads = catalog.catalogThreads.concat(data);
                    }

                    if (callback) {
                        callback();
                    }

                    document.body.classList.add("jsenabled");
                });
            }
        },
        writeable: false,
        configurable: false
    });

    Object.defineProperty(unsafeWindow.catalog, 'setCellThumb', {
        value: function(thumbLink, thread) {
            // replace api with thread here
            thumbLink.href = '/' + thread.boardUri + '/res/' + thread.threadId + '.html';

            if (thread.thumb) {
                var thumbImage = document.createElement('img');

                thumbImage.src = thread.thumb;
                thumbLink.appendChild(thumbImage);
                catalog.checkForFileHiding(thumbImage);
            } else {
                thumbLink.innerText = 'Open';
            }
        },
        writeable: false,
        configurable: false
    });
    //END FUNCTION OVERRIDES

    // adds board selector
    unsafeWindow.addEventListener('DOMContentLoaded', function () {
        var boardSelector = {
            boardList : new Array
        };

        class boardItem {
            constructor(board) {
                this.label = `/${board}/`;
                this.id = board;
            }
        }
        (function () {
            for (const board of catalog.boardArray)
                boardSelector.boardList.push(new boardItem(board));
        })();

        boardSelector.boardUI = function () {
            let insertionPoint = (() => {
                //inserts before Subject row
                let insert = document.getElementById('divOptions').nextSibling.nextSibling;
                if (!insert)
                    return;
                return insert;
            })();

            let row = document.createElement('tr');
            let header = document.createElement('th');
            let record = document.createElement('td');
            let dropdown = document.createElement('select');

            row.setAttribute('id', 'divBoard');
            header.append(document.createTextNode('Board'));

            boardSelector.boardList.forEach((board) => {
                let opt = document.createElement('option');
                opt.innerText = board.label;
                opt.value = board.id;
                dropdown.appendChild(opt);
            });

            row.appendChild(header)
            row.appendChild(record.appendChild(dropdown));
            insertionPoint.parentNode.insertBefore(row, insertionPoint);

            boardSelector.value = () => dropdown.value;
            return row;
        }();

        boardSelector.boardUI.addEventListener('change', () => {
            api.boardUri = boardSelector.value(); });
    });
})();