// ==UserScript==
// @name        Printable and Readable Books Downloader for Fanfiction and Fictionpress
// @namespace   Azazar's Scripts
// @description Allows generation of printable HTML, that can be fed to e-book readers
// @include     https://www.fanfiction.net/*
// @include     https://www.fictionpress.com/*
// @version     1.5
// @grant       GM_xmlhttpRequest
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/496931/Printable%20and%20Readable%20Books%20Downloader%20for%20Fanfiction%20and%20Fictionpress.user.js
// @updateURL https://update.greasyfork.org/scripts/496931/Printable%20and%20Readable%20Books%20Downloader%20for%20Fanfiction%20and%20Fictionpress.meta.js
// ==/UserScript==

(function() {

    let printFicBtn = null;

    function htmlEntities(str) {
        let e = document.createElement('span');
        e.appendChild(document.createTextNode(str));
        return e.innerHTML;
    }

    function onAllChapters(author, title, chapters) {
        let html = "";

        html += '<!DOCTYPE html><html><head><meta charset="utf-8">';
        html += '<title>' + htmlEntities(title) + '</title>';
        html += '<link rel="canonical" href="' + location.href + '">';
        html += '<style type="text/css">body,* { background-color:#000;color:#fff; }</style>';
        html += '</head><body>';
        html += '<h1>' + htmlEntities(title) + '</h1>';

        html += 'by <a href="' + author.link + '">' + author.name + '</a>';

        html += '<p>';

        for(let chapterNo = 0; chapterNo < chapters.count; chapterNo++) {
            let chapter = chapters[chapterNo];

            html += '<a href="#chapter' + chapter.number + '">' + htmlEntities(chapter.title) + '</a><br>';
        }

        html += '</p>';

        for(let chapterNo = 0; chapterNo < chapters.count; chapterNo++) {
            let chapter = chapters[chapterNo];

            html += '<h2 style="page-break-before: always" id="chapter' + chapter.number + '">' + htmlEntities(chapter.title) + '</h2>';
            html += '<p>' + chapter.html + '</p>';
        }

        html += '</body></html>';

        let blob = new Blob([html], {type: "text/html"});
        let url = window.URL.createObjectURL(blob);

        printFicBtn.href = url;
        printFicBtn.dataset.download = title + '.html';
        printFicBtn.innerHTML = '🔗 Printable Version';
        printFicBtn.onmousedown = function(ev) {
            if (ev.button === 2) {
                printFicBtn.download = title + '.html';
            } else {
                printFicBtn.removeAttribute('download');
            }
        }
    }

    $('<a style="margin-right: 0.3em" id="printfic_btn" class="btn pull-right icon-">⭳ Download Printable Version</a>').insertAfter('#profile_top > button');
    printFicBtn = document.getElementById('printfic_btn');
    printFicBtn.addEventListener('click', function() {
        if (printFicBtn.hasAttribute('href')) {
            return;
        }

        $.ajaxSetup({
            async: false
        });
        let n = 0;
        let chapters = {count: document.getElementById('chap_select').options.length};
        setTimeout(function() {

            for (let i = 1; i <= document.getElementById('chap_select').options.length; i++) {
                let chapTitle = document.getElementById('chap_select').options[i - 1].textContent;
                n++;
                console.log("Downloading " + document.location.pathname.substring(3, 8).replace("/", "") + " chapter " + i + " (" + chapTitle + ")");
                let $div = $('<div>');
                let cn = i - 1;
                chapters[cn] = {number: i, title: chapTitle};
                $div.load('/s/' + document.location.pathname.substring(3, 8).replace("/", "") + '/' + i + ' #storytext', function(content, result, response){
                    if (response.status !== 200) {
                        location.reload();
                        return;
                    }

                    chapters[cn].html = $(this)[0].innerHTML;

                    if (n == chapters.count) {
                        let authorA = null;
                        document.querySelectorAll('#profile_top > a[href]').forEach(function(a) {
                            let h = a.getAttribute('href');
                            if (!h.startsWith('/u/')) {
                                return;
                            }
                            if (a.textContent.trim() === '') {
                                return;
                            }
                            authorA = a;
                        });
                        onAllChapters({
                            link: authorA.href,
                            name: authorA.textContent.trim()
                        }, document.querySelector('#profile_top > b').textContent.trim() + ' by ' + document.querySelector('#profile_top > a[href]').textContent.trim(), chapters);
                    }
                });
            }
        }, 100);
    });
})();
