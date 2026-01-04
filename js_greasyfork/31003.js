// ==UserScript==
// @name         Audiokniga.club downloader
// @name:ru	     Audiokniga.club загрузчик книг
// @namespace    http://dimio.org/
// @version      0.1.0
// @description  Adds links for downloading chapters of the current book on audiokniga.club website
// @description:ru  Добавляет ссылки для скачивания глав текущей книги на сайте audiokniga.club
// @author       dimio (dimio@dimio.org)
// @license      MIT
// @homepage     https://greasyfork.org/ru/scripts/31003-audiokniga-club-downloader
// @homepage     https://github.com/dimio/Audiokniga.club-Books-Downloader
// @supportURL   dimio.org
// @encoding     utf-8
// @match        http*://audiokniga.club/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/31003/Audioknigaclub%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/31003/Audioknigaclub%20downloader.meta.js
// ==/UserScript==
//*jshint esversion: 6 */

(function (window) {
    'use strict';

    window.unsafeWindow = window.unsafeWindow || window;
    const w = unsafeWindow;

    let book = {};

    book.name = $('#dle-content > div > div.fullstory > div.info > h1')[0].innerText;
    book.chapters = $("div.item");
    book.chapter_prefix_size = book.chapters.length.toString().length;

    book.chapters.removeClass('item');
    book.chapters.wrap('<div class="item" style="cursor:default">');

    $.each( book.chapters, function(key, value) {
        book.chapter_div = $(value);
        book.chapter_div.css({
            "margin-left": "auto",
            "display": "inline-block",
            "cursor": "pointer",
        });

        book.chapter_name = book.chapter_div[0].innerText;
        //book.chapter_name = book.chapter_div[0].innerText.split('.')[0];
        book.download_link = book.chapter_div[0].outerHTML.split("'")[1];
        book.chapter_prefix = numSizeToFixed( key + 1, book.chapter_prefix_size );

        let file_name = book.chapter_prefix + '-' + book.name + '_' + book.chapter_name;
        let file_ext = book.chapter_div.attr('onclick').split("'")[1].split('.')[1];
        file_name = file_name.replace(/\s/g, '_');
        file_name = file_name.substring(0, 250);
        file_name = file_name + '.' + file_ext;

        let a = $('<a>');
        a.attr("class", "dl-chapter url");
        a.attr("href", w.location.origin + book.download_link);
        a.attr("download", file_name);
        a.text('DL #' + book.chapter_prefix);
        a.attr("title", 'Download chapter ' + parseInt( book.chapter_prefix, 10 ) );

        book.chapter_div[0].innerText = 'Play: ' + book.chapter_div[0].innerText;
        book.chapter_div.parent().prepend(a);

        let dl_div = $('<div>').css({
            "cursor": "default",
            "display": "inline-block",
            "margin-right": "10%",
        });
        dl_div.attr("class", "dl-chapter");

        $(a).wrap(dl_div);
    } ); // end of each

    w.downloadAll = function(){
        const dl_urls = $('a.dl-chapter.url');
        if ( dl_urls && confirm(`Download ${dl_urls.length} files?`) ){
            $.each(dl_urls, function(key, value){
                value.click();
            });
        }
    };

    let dl_all_div = $('<div><a>DownLoad all chapters</a></div>');
    dl_all_div.attr("class", "item");
    dl_all_div.attr("onclick", "downloadAll(); return false;");

    $('div.list').prepend(dl_all_div);

})(window);

function numSizeToFixed( num, num_size ){
    num = num.toString();
    num_size = parseInt( num_size, 10 );

    if ( num.length < num_size ){
        return addLeadingZeros( num, num_size );
    }

    if ( num.length === num_size ){
        return num;
    }

    return num.substring( 0, num_size );
}

function addLeadingZeros( str, str_size ){
    return Array.apply( null, {
        length: str_size - str.length + 1
    } ).join('0') + str;
}
