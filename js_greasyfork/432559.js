// ==UserScript==
// @name         Douban Opener (manual ver.)
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  帮助将豆瓣书籍数据填充到 OpenLibrary 的表格里，提交得您自己来。
// @author       You
// @match        https://book.douban.com/subject/*
// @match        https://openlibrary.org/books/add*
// @match        https://openlibrary.org/books/OL*/edit*
// @match        https://openlibrary.org/account
// @icon         https://www.google.com/s2/favicons?domain=douban.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432559/Douban%20Opener%20%28manual%20ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432559/Douban%20Opener%20%28manual%20ver%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var goodReadsCSVHeader = 'Book Id,Title,Author,Author l-f,Additional Authors,ISBN,ISBN13,My Rating,Average Rating,Publisher,Binding,Number of Pages,Year Published,Original Publication Year,Date Read,Date Added,Bookshelves,Bookshelves with positions,Exclusive Shelf,My Review,Spoiler,Private Notes,Read Count,Recommended For,Recommended By,Owned Copies,Original Purchase Date,Original Purchase Location,Condition,Condition Description,BCID';
    var fromDouban;
    if(window.location.host === 'book.douban.com') {
        var h1 = document.querySelector('h1');
        var button = document.createElement('button');
        button.innerText = '导出';
        button.classList.add('ll');
        button.style.marginRight = '1em';
        button.style.float = 'left';
        button.onclick = function() {
            var infoText = document.querySelector('#info').innerText;
            var infoArray = Object.fromEntries(infoText.replace(
                /(作者|出版社|出品方|副标题|原作名|译者|出版年|页数|定价|装帧|丛书|ISBN)\s*:/g, '\n$1:'
            ).split('\n').map(s => s.split(':').map(ss => ss.trim())).filter(a => a.length === 2));
            var data = {
                title: h1.innerText.trim(),
                image: document.querySelector('#mainpic img')?.src,
                ...infoArray,
            };
            var param = encodeURIComponent(JSON.stringify(data)).replace('=', '-');
            window.open('https://openlibrary.org/books/add?douban=' + param, '_blank');
        };
        var buttonContainer = document.querySelector('#interest_sect_level');
        var afterButton = document.querySelector('#interest_sect_level>.a_stars');
        if(buttonContainer) {
            buttonContainer.insertBefore(button, afterButton);
        } else {
            h1.parentElement.insertBefore(button, h1.nextSibling);
        }
    } else if(window.location.host === 'openlibrary.org' && window.location.pathname.startsWith('/books/add')) {
        var url = new URL(window.location);
        var param = url.searchParams.get('douban');
        if(param) {
            var instruct = document.querySelector('.instruct');
            var data = JSON.parse(decodeURIComponent(param));
            fetch('https://openlibrary.org/isbn/' + data.ISBN + '.json')
                    .then(function(response) {
                        if(response.ok) {
                            return response.json()
                        }
                    }).then(function(json) {
                        if(json) {
                            var duplicateNotice = document.createElement('p');
                            duplicateNotice.innerHTML = '书目已经存在于 OpenLibrary 中：<a href="' + json.key + '">' + json.title + '</a>。';
                            duplicateNotice.style.color = 'red';
                            instruct.appendChild(duplicateNotice);
                        }
                    });
            var filler = document.createElement('button');
            filler.innerText = 'From Douban';
            var year = data['出版年'].match(/\d{4}/)[0];
            filler.onclick = function() {
                document.querySelector('input#title').value = data.title;
                var authors = data['作者'].split('/').map(s => s.trim());
                var fillAuthorField = function() {
                    var authorFields = document.querySelectorAll('input.author');
                    authorFields[authorFields.length - 1].value = authors.shift();
                    if(authors.length !== 0) {
                        newAuthorField();
                    }
                };
                var newAuthorField = function() {
                    var addButtons = document.querySelectorAll('a.add');
                    addButtons[addButtons.length - 1].click();
                    setTimeout(fillAuthorField, 50);
                };
                fillAuthorField();
                var authorNote = document.createElement('p');
                authorNote.innerText = '您可能需要手动编辑作者一栏。英文作者最好使用对应的英文名字，最好使用 OpenLibrary 自动匹配功能校正名字。';
                authorNote.style.color = 'darkred';
                document.querySelector('.multi-input-autocomplete--author').appendChild(authorNote);
                document.querySelector('input#publisher').value = data['出版社'];
                document.querySelector('input#publish_date').value = year;
                if(data.ISBN && data.ISBN.search(/^\d{13}$/) === 0) {
                    document.querySelector('input#id_value').value = data.ISBN;
                    document.querySelector('select#id_name').value = 'isbn_13';
                }
            };

            fromDouban = JSON.parse(localStorage.getItem('fromDouban'));
            if(fromDouban === null) { fromDouban = {}; }
            if(data.ISBN) {
                fromDouban[data.ISBN] = data;
            } else {
                fromDouban[data.title + ' - ' + data['作者'] + ' - ' + year + ' - ' + data['出版社']] = data;
            }
            localStorage.setItem('fromDouban', JSON.stringify(fromDouban));
            instruct.appendChild(filler);
        }
    } else if(window.location.host === 'openlibrary.org' && window.location.pathname.startsWith('/books/OL')) {
        var ISBN = document.querySelector('input[name=edition--identifiers--0--value]').value;
        var afterCoverButton = document.querySelector('form#addWork #tabsAddbook');
        fromDouban = JSON.parse(localStorage.getItem('fromDouban'));
        if(fromDouban !== null && ISBN in fromDouban) {
            var cover = document.querySelector('img.cover');
            var book = fromDouban[ISBN];
            console.log(book, cover.getAttribute('src'));
            if(book.image && (!cover || cover.getAttribute('src') === '')) {
                var coverButton = document.createElement('button');
                coverButton.innerText = '上传封面';
                coverButton.onclick = function() {
                    var path = window.location.pathname.replace(/edit$/, 'add-cover');
                    coverButton.innerText = '上传封面中';
                    var formData = new FormData();
                    formData.append('file', '');
                    formData.append('url', book.image);
                    formData.append('upload', 'Submit');
                    fetch(path, { method: 'POST', body: formData })
                        .then(function(request) {
                            if(request.ok) {
                                coverButton.innerText = '上传封面成功';
                                coverButton.disabled = true;
                                window.location.reload();
                            } else {
                                coverButton.innerText = '上传封面失败';
                            }
                        });
                    return false;
                };
                afterCoverButton.parentElement.insertBefore(coverButton, afterCoverButton);
            }
        }
        var detailButton = document.createElement('button');
        detailButton.innerText = '填充细节';
        detailButton.onclick = function() {
            var info = [];
            if(book['副标题']) {
                info.push('副标题：' + book['副标题']);
                document.querySelector('input#edition-subtitle').value = book['副标题'];
            }
            if(book['页数']) {
                info.push('页数：' + book['页数']);
                document.querySelector('input#edition--number_of_pages').value = book['页数'];
            }
            if(book['译者']) {
                info.push('译者：' + book['译者']);
                document.querySelector('input#role-name').value = book['译者'];
                document.querySelector('select#select-role').value = 'Translator';
                document.querySelector('#roles button[name=add]').click();
            }
            detailButton.innerText = '请确认：填充了：' + info.join(', ');
            return false;
        };
        afterCoverButton.parentElement.insertBefore(detailButton, afterCoverButton);
    } else if(window.location.host === 'openlibrary.org' && window.location.pathname === '/account') {
        var briefInfo = document.createElement('a');
        var object = localStorage.getItem('fromDouban');
        var booksWithoutISBN = [];
        if(!object) { object = {}; } else { object = JSON.parse(object); }
        briefInfo.innerText = 'Douban Opener 导出（GoodReads 格式）';
        briefInfo.target = '_blank';
        briefInfo.href = window.URL.createObjectURL(new Blob([
            '\ufeff' + goodReadsCSVHeader + '\n'
            + Object.entries(object).filter(entry => {
                if(entry[0].search(/^\d{13}$/) === 0) {
                    return true;
                } else {
                    booksWithoutISBN.push(entry[1].title);
                    return false;
                }
            }).map(entry => ',' + entry[1].title + ',' + entry[1]['作者'] + ',,,,' + entry[0].replace(',', '') + ',,,,,,,,,,to-read,to-read (#1),to-read,,').join('\n')], { type: 'text/csv' }));
        if(booksWithoutISBN.length > 0) {
            var div = document.createElement('div');
            div.innerText = '不含有 ISBN13 的书暂不支持导出：《' + booksWithoutISBN.join('》《') + '》';
            document.querySelector('#contentBody').appendChild(div);
        }
        document.querySelector('#contentBody').appendChild(briefInfo);
        var exportButton = document.createElement('button');
        exportButton.innerText = 'Douban Opener: 清空缓存';
        exportButton.onclick = function() {
            localStorage.setItem('fromDouban', '{}');
            return false;
        };
        document.querySelector('#contentBody').appendChild(exportButton);
    }
})();