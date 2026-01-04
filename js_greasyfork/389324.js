// ==UserScript==
// @name         Manga-Tube Downloader
// @namespace    http://tampermonkey.net/
// @version      3.0.1
// @description  Ein Tampermonkey-Script um Manga-Kapitel von https://onepiece.tube/ als PDF herunterzuladen.
// @author       LoudBomb
// @license      MIT
// @icon         https://i.imgur.com/SAtFjAa.png
// @match        https://onepiece.tube/manga/kapitel-mangaliste*
// @match        https://onepiece.tube/manga/kapitel/*
// @grant        none
// @homepage     https://loudbomb93.github.io/manga-tube-downloader/
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/389324/Manga-Tube%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/389324/Manga-Tube%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /**-----------------------Libraries-------------------
     * JsPDF wird im head eingebunden              */
    $('head').append(
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js" integrity="sha384-NaWTHo/8YCBYJ59830LTz/P4aQZK1sS0SneOgAvhsIl3zBu8r9RevNg5lHCHAuQ/" crossorigin="anonymous"></script>'
    );

    /**------------------set Variables-----------------*/
    window.oChapter = {};
    window.number_of_pages = 0;
    window.filename = '';
    /**Helper function inIframe
     * Checkt ob sich ein element inerhalb eines iFrames befindet oder nicht */
    function inIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    /** ---------------CreatePDF with jsPDF-----------------*/
    function createpdf() {
        var doc = new jsPDF();
        for (var p = 1; p <= Object.keys(window.oChapter).length; p++) {
            if (window.oChapter[p].img_width > window.oChapter[p].img_height) {
                doc.addPage('a4', 'landscape');
                doc.addImage(window.oChapter[p].base64img, 'PNG', 0, 0, 297, 210);
            } else {
                if (p !== 1) {
                    doc.addPage('a4', 'portrait');
                }
                doc.addImage(window.oChapter[p].base64img, 'PNG', 0, 0, 210, 297);
            }
        }
        //doc.save(sDocname + " " + sKapitel + " - " + sName+ ".pdf");
        var oDoc = window.chapter_info;
        doc.save(window.filename + ' ' + oDoc.number + ' - ' + oDoc.name + '.pdf');

        //reset variables
        window.oChapter = {};
        window.number_of_pages = 0;
        var update_button = $('#lb-active')[0];
        update_button.className = 'btn btn-success';
        update_button.innerText = 'Completed';
        update_button.removeAttribute('id');
    }
    //Check ob alle images des chapters da sind -> wenn ja erstell pdf
    function checkFinal(image_info) {
        if (typeof window.oChapter[image_info.page] === 'undefined') {
            window.oChapter[image_info.page] = image_info;
        }
        if (Object.keys(window.oChapter).length === number_of_pages) {
            createpdf();
        }
    }

    /**-------------Convert image to base64 Function-------------------- */
    function getBase64Image(page, img_url) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = img_url;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const base64data = canvas.toDataURL('image/jpeg');
            //console.log("base64: encoded");
            var oIMG = {
                page: page,
                img_width: img.width,
                img_height: img.height,
                base64img: base64data
            };
            checkFinal(oIMG);
        };
    }
    /**------------------------------------------------------------------- */

    /**------------ html5 Postmessage Function iFrame---------------------------*/
    function displayMessage(evt) {
        if (
            typeof evt.data[0] !== 'undefined' &&
            typeof evt.data[0].current_page !== 'undefined' &&
            typeof evt.data[0].number_of_pages !== 'undefined' &&
            typeof evt.data[0].img_source !== 'undefined'
        ) {
            var pagedata = evt.data[0];
            if (typeof pagedata.number_of_pages !== 'undefined' && window.number_of_pages === 0) {
                window.number_of_pages = pagedata.number_of_pages;
            }
            getBase64Image(pagedata.current_page, pagedata.img_source);
            console.log('Converting: ' + pagedata.current_page + '/' + window.number_of_pages);
            if (pagedata.current_page <= window.number_of_pages) {
                var curr_src = $('#lb_info_iframe')[0].src;
                $('#lb_info_iframe')[0].src = curr_src.replace(/\/[^\/]*$/, '/' + (pagedata.current_page + 1));
            }
        }
    }

    if (window.addEventListener) {
        window.addEventListener('message', displayMessage, false);
    } else {
        window.attachEvent('onmessage', displayMessage);
    }
    /**------------------------------------------------------------------- */
    //Get correct img source from iFrame
    if (inIframe()) {
        var ChapterInfo = {
            current_page: parseInt($('.page-item.active')[0].innerText),
            img_source: $('img')[0].src,
            number_of_pages: $('.page-item').length + 1
        };
        //Send Information to parent
        parent.window.postMessage([ChapterInfo], '*');
    } else {
        //Setze filename aufgrund der domain
        var host = document.location.hostname;
        if (host.indexOf('onepiece') !== -1) {
            window.filename = 'One Piece';
        }

        //--------------SETTING Download Button---------------------------
        var headingnames = $('.segment-heading').find('.segment-name');

        for (var i = 0; i < headingnames.length; i++) {
            var dwheading = document.createElement('div');
            dwheading.innerText = 'PDF Download';
            dwheading.className = 'fw-bold';
            headingnames[i].parentNode.insertBefore(dwheading, headingnames[i].nextSibling);
        }

        var bodynames = $('.segment-body').find('.segment-name');

        for (var i = 0; i < bodynames.length; i++) {
            //save href from paren
            var kapitel_href = bodynames[i].parentElement.href;
            //remove href from element
            bodynames[i].parentElement.removeAttribute('href');
            var dwbutton = document.createElement('button');
            dwbutton.innerText = 'Download  ';
            dwbutton.className = 'btn';
            dwbutton.setAttribute('chapter_href', kapitel_href);
            dwbutton.onclick = download_pdf;
            var fa_icon = document.createElement('i');
            fa_icon.className = 'far fa-save';
            //fa_icon.className = "far fa-file-pdf";
            dwbutton.append(fa_icon);
            bodynames[i].parentNode.insertBefore(dwbutton, bodynames[i].nextSibling);
        }

        function download_pdf() {
            var parentrow_elem = $(this).parent();
            window.chapter_info = {
                name: parentrow_elem.find('.segment-name')[0].innerText,
                number: parentrow_elem.find('.segment-number')[0].innerText,
                pages: parentrow_elem.find('.segment-pages')[0].innerText
            };
            if (typeof window.chapter_info.pages !== 'undefined' || window.chapter_info.pages !== null) {
                window.number_of_pages = parseInt(window.chapter_info.pages);
            }
            console.log('Starting Download');
            console.log(window.chapter_info);

            this.className += ' btn-info';
            this.id = 'lb-active';
            this.innerText = 'Converting';

            $('<iframe>', {
                src: this.getAttribute('chapter_href'),
                class: 'LoudBomb-iframe-ID',
                id: 'lb_info_iframe',
                height: 0,
                width: 0,
                frameborder: 0,
                scrolling: 'no'
            }).appendTo(this);
        }
    }
})();
