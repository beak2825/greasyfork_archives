// ==UserScript==
// @name         BachNgocSach Leecher
// @namespace    https://holy-donkey.github.io
// @description  Tải truyện từ bachngocsach.com định dạng html. Sau đó, bạn có thể dùng Mobipocket Creator để tạo ebook prc
// @version      0.1.5
// @icon         http://i.imgur.com/3lomxTC.png
// @author       The Holy Donkey (Thánh Lư Đại Nhân)
// @license      WTFPL
// @include      /^https?:\/\/bachngocsach\.com\/reader\/[^\/]+$/
// @require      https://cdn.jsdelivr.net/jquery/2.2.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/filesaver.js/1.3.3/FileSaver.min.js
// @noframes
// @connect      self
// @supportURL   https://github.com/holy-donkey/UserScripts/issues
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/24735/BachNgocSach%20Leecher.user.js
// @updateURL https://update.greasyfork.org/scripts/24735/BachNgocSach%20Leecher.meta.js
// ==/UserScript==

(function ($, window, document, undefined) {
    'use strict';

    function downloadFail() {
        $download.css({'background': '#e05d59', 'border-color': '#c83e35'});
        titleError.push(title);

        if (debug) console.log('%cError: ' + url, 'color:red;');
    }

    function getContent() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                var $data = $(response.responseText),
                    $chapter = $data.find('#noidung'),
                    $next = $data.find('.page-next.chuong-button:has("span"):first');

                title = $data.find('#chuong-title').text().trim();
                if (count === 0) begin = title;
                end = title;

                $download.html(title);

                if (!$chapter.length) {
                    downloadFail();
                } else {
                    $download.css('background', 'orange');

                    txt += '<h2 class="title">' + title + '</h2>' + $chapter.html();
                    count++;

                    if (debug) console.log('%cComplete: ' + url, 'color:green;');
                }

                document.title = '[' + count + '] ' + pageName;

                if (!$next.text().length) {
                    var fileName = location.pathname.slice(8) + '.html',
                        blob;

                    if (titleError.length) {
                        titleError = '<h4>Các chương lỗi: <font color="gray">' + titleError.join(', ') + '</font></h4>';
                        if (debug) console.log('Các chương lỗi:', titleError);
                    } else {
                        titleError = '';
                    }

                    txt = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head><body><h1><font color="red">' + $('h1').text().trim() + '</font></h1><h3>Tác giả: <font color="blue">' + $('div#tacgia').find('a').text().trim() + '</font></h3><h3>Thể loại: <font color="green">' + $('div#theloai').find('a').text().trim() + '</font></h3><br><h4>Từ <font color="gray">' + begin + '</font> đến <font color="gray">' + end + '</font></h4>' + titleError + '<br><br>' + credits + '<br><br><br>' + txt + '</body></html>';

                    blob = new Blob([txt], {
                        type: 'text/html'
                    });

                    $download.attr({
                        href: window.URL.createObjectURL(blob),
                        download: fileName
                    }).html('✓ Tải xong').css({'background': '#d0ead1', 'border-color': '#abceb7'}).off('click');

                    saveAs(blob, fileName);

                    $(window).off('beforeunload');
                    if (debug) console.log('%cDownload Finished!', 'color:blue;');
                    document.title = '[⇓] ' + pageName;

                    return;
                }

                url = $next.attr('href');
                getContent();
            },
            onerror: function (err) {
                downloadFail();

                setTimeout(function () {
                    getContent();
                }, 3000);
            }
        });
    }


    var pageName = document.title,
        $download = $('<a>', {
            class: 'truyen-button',
            href: '#download',
            css: {
                background: '#f4b759',
                color: '#ffffff !important',
				border: '1px solid #eb813d'
            },
            text: 'Tải xuống'
        }),
        disableClick = false,

        count = 0,
        begin = '',
        end = '',

        txt = '',
        url = $('.truyen-button:contains("Đọc từ đầu")').attr('href'),

        title = '',
        titleError = [],

        credits = '<p>Truyện được tải từ <a href="' + location.href + '">BachNgocSach</a></p><p>Userscript được viết bởi: Thánh Lư Đại Nhân - https://holy-donkey.github.io</p>',

        debug = false;


    $('nav#truyen-nav:last').append($download);

    $download.on('click', function (e) {
        e.preventDefault();
        if (disableClick) return;
        disableClick = true;

        getContent();

        $(window).on('beforeunload', function () {
            return 'Truyện đang được tải xuống...';
        });
    });

})(jQuery, window, document);
