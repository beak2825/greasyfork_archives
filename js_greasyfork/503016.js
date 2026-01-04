// ==UserScript==
// @name         Open in Goodreads+ Anna's Archive and LibGen
// @namespace    open-in-goodreads-annas-archive-libgen
// @version      1.2
// @description  Adds buttons to Amazon book pages to redirect to Goodreads, Anna's Archive, or LibGen search pages based on ASIN/ISBN-10/ISBN-13. This has been modified from SirGryphin's code for "Open in Goodreads" using ChatGPT.
// @match        https://*.amazon.com/*
// @match        https://*.amazon.co.uk/*
// @match        https://*.amazon.com.au/*
// @match        https://*.amazon.com.be/*
// @match        https://*.amazon.com.br/*
// @match        https://*.amazon.ca/*
// @match        https://*.amazon.cn/*
// @match        https://*.amazon.eg/*
// @match        https://*.amazon.fr/*
// @match        https://*..amazon.de/*
// @match        https://*.amazon.in/*
// @match        https://*.amazon.it/*
// @match        https://*.amazon.co.jp/*
// @match        https://*.amazon.com.mx/*
// @match        https://*.amazon.nl/*
// @match        https://*.amazon.pl/*
// @match        https://*.amazon.sa/*
// @match        https://*.amazon.sg/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.se/*
// @match        https://*.amazon.com.tr/*
// @match        https://*.amazon.ae/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503016/Open%20in%20Goodreads%2B%20Anna%27s%20Archive%20and%20LibGen.user.js
// @updateURL https://update.greasyfork.org/scripts/503016/Open%20in%20Goodreads%2B%20Anna%27s%20Archive%20and%20LibGen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function redirectToGoodreads() {
        var asin_elements = document.getElementsByName('ASIN');
        if (asin_elements.length == 0) {
            asin_elements = document.getElementsByName('ASIN.0');
        }
        if (asin_elements.length == 0) {
            alert("No ASIN or ISBN Found.");
        } else {
            var asin = asin_elements[0].value;
            var goodreadsUrl = asin.match(/\D/) === null
                ? 'http://www.goodreads.com/review/isbn/' + asin
                : 'https://www.goodreads.com/book/isbn?isbn=' + asin;
            window.open(goodreadsUrl, '_blank');
        }
    }

    function redirectToAnnasArchive() {
        var asin_elements = document.getElementsByName('ASIN');
        if (asin_elements.length == 0) {
            asin_elements = document.getElementsByName('ASIN.0');
        }
        if (asin_elements.length == 0) {
            alert("No ASIN or ISBN Found.");
        } else {
            var asin = asin_elements[0].value;
            var annasArchiveUrl = 'https://annas-archive.org/search?q=' + asin;
            window.open(annasArchiveUrl, '_blank');
        }
    }

    function redirectToLibGen() {
        var asin_elements = document.getElementsByName('ASIN');
        if (asin_elements.length == 0) {
            asin_elements = document.getElementsByName('ASIN.0');
        }
        if (asin_elements.length == 0) {
            alert("No ASIN or ISBN Found.");
        } else {
            var asin = asin_elements[0].value;
            var libgenUrl = 'https://libgen.is/search.php?req=' + asin + '&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=def';
            window.open(libgenUrl, '_blank');
        }
    }

    function addButton(text, redirectFunction, bgColor, prependEmoji = true) {
        var button = document.createElement('button');
        button.innerText = prependEmoji ? '🏴‍☠️ ' + text : text;
        button.style.marginTop = '10px';
        button.style.marginBottom = '10px';
        button.style.display = 'block';
        button.style.marginLeft = 'auto';
        button.style.marginRight = 'auto';
        button.style.color = '#ffffff';
        button.style.backgroundColor = bgColor;
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '8px 12px';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '14px';
        button.style.fontWeight = 'bold';
        button.style.textDecoration = 'none';
        button.style.cursor = 'pointer';

        button.onclick = redirectFunction;

        var centerDiv = document.createElement('div');
        centerDiv.style.textAlign = 'center';
        centerDiv.appendChild(button);

        return centerDiv;
    }

    function insertButtons() {
        var imageBlockNew = document.getElementById('imageBlockNew_feature_div');
        var imageBlock = document.getElementById('imageBlock_feature_div');
        var booksImageBlock = document.getElementById('booksImageBlock_feature_div');
        var askWidgetQuestions = document.getElementById('ask-btf_feature_div');

        if ((imageBlockNew || booksImageBlock || imageBlock) && !askWidgetQuestions) {
            var goodreadsButton = addButton('Open in Goodreads', redirectToGoodreads, '#377458', false);
            var annasArchiveButton = addButton('Open in Anna\'s Archive', redirectToAnnasArchive, '#6447c4');
            var libgenButton = addButton('Open in LibGen', redirectToLibGen, '#de741d');

            if (imageBlockNew) {
                imageBlockNew.parentNode.insertBefore(goodreadsButton, imageBlockNew.nextSibling);
                imageBlockNew.parentNode.insertBefore(annasArchiveButton, imageBlockNew.nextSibling);
                imageBlockNew.parentNode.insertBefore(libgenButton, imageBlockNew.nextSibling);
            } else if (booksImageBlock) {
                booksImageBlock.parentNode.insertBefore(goodreadsButton, booksImageBlock.nextSibling);
                booksImageBlock.parentNode.insertBefore(annasArchiveButton, booksImageBlock.nextSibling);
                booksImageBlock.parentNode.insertBefore(libgenButton, booksImageBlock.nextSibling);
            } else if (imageBlock) {
                imageBlock.parentNode.insertBefore(goodreadsButton, imageBlock.nextSibling);
                imageBlock.parentNode.insertBefore(annasArchiveButton, imageBlock.nextSibling);
                imageBlock.parentNode.insertBefore(libgenButton, imageBlock.nextSibling);
            }
        }
    }

    insertButtons();
})();