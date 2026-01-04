// ==UserScript==
// @name         Free Springer Books download
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Free Springer Books Bulk download
// @author       You
// @match        https://docs.google.com/spreadsheets/d/1HzdumNltTj2SHmCv3SRdoub8SvpIEn75fa4Q23x0keU/htmlview
// @match        https://link.springer.com/book*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/399780/Free%20Springer%20Books%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/399780/Free%20Springer%20Books%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function pause(msec) {
        return new Promise(
            (resolve, reject) => {
                setTimeout(resolve, msec || 1000);
            }
        );
    }

    if(window.location.host == 'link.springer.com'){
        var book_window = window
        function download_pdf(url, filename){
            var req = new XMLHttpRequest();
                req.open('GET', url, true);
                req.responseType = 'blob';
                req.onreadystatechange = function () {
                    if (req.readyState === 4 && req.status === 200) {
                        if (typeof window.chrome !== 'undefined') {
                            // Chrome version
                            var link = document.createElement('a');
                            link.href = window.URL.createObjectURL(req.response);
                            link.download = filename;
                            link.click();
                        } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                            // IE version
                            var blob = new Blob([req.response], { type: 'application/pdf' });
                            window.navigator.msSaveBlob(blob, filename);
                        } else {
                            // Firefox version
                            var file = new File([req.response], filename, { type: 'application/force-download' });
                            window.open(URL.createObjectURL(file));
                        }

                    }
                };
                req.send();
        }


        var book_name = $('h1:first').text().trim();
        var book_author = $('span.authors__name').map(function (){
            return $(this).text();
        }).get().join(', ');

        var book_topic = GM_getValue('book_topic');
        var book_url_pdf = $('a.test-bookpdf-link').attr('href');

        download_pdf(book_url_pdf, book_name + ' - ' + book_author + ' (' + book_topic + ').pdf');
        $('h1:first').append(' <span style="color:red">Downloading...</span>')
        GM_setValue('book_topic', '');

        setTimeout(function(){
           book_window.close()
        }, 15000);


    }else{
        async function download(){
            var $books = $('table tbody tr');

            for(var i=0; i<$books.length; i++){
                if(i>1){
                    let book = $($books[i]);
                    GM_setValue('book_topic', book.children('td:eq(2)').text());

                    window.open(book.children('td:last').text());
                    console.log(i);
                    await pause(16000);
                }
            }
        }

        setTimeout(download, 1000);
    }
})();