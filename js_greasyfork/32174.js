// ==UserScript==
// @name         ZielonkaBloker
// @namespace    https://www.wykop.pl/ludzie/tom3k85/
// @version      1.0
// @description  Wszystkie media dodane przez zielonki na Mirko są zakryte dopóki się nie kliknie.
// @author       tom3k85
// @include      https://www.wykop.pl/mikroblog/*
// @include      https://www.wykop.pl/wpis/*
// @include      https://www.wykop.pl/moj/*
// @include      https://www.wykop.pl/tag/*
// @include      https://www.wykop.pl/multimedia-tag/*
// @include      https://www.wykop.pl/ludzie/*
// @downloadURL https://update.greasyfork.org/scripts/32174/ZielonkaBloker.user.js
// @updateURL https://update.greasyfork.org/scripts/32174/ZielonkaBloker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var search = 'a.color-0, a.color-1001, a.color-1002';
    var blokerClass = '.zielonkabloker';
    var listParent = 'div.wblock';
    var galleryParent = 'div.mediaStream';
    var zielonkaBloker = '<div class="zielonkabloker" style="background-color:#dadada; color:#3c3c3c; height: 100%; width: 100%; position: absolute; z-index:19; text-align:center; padding-top:20px;"><span style="font-weight:700; font-size:1em;">ZielonkaBloker</span><br><span style="font-size:0.8em;">kliknij żeby zobaczyć</span></div>';

    function addBloker() {
        $(listParent).each(function() {
            var add1 = $(this).find(search).parent().next('div.text').find('div.media-content');
            if (add1.first().has(blokerClass).length) {
            } else {
                add1.prepend(zielonkaBloker);
            }
        });
    }

    function addBlokerGallery() {
        $(galleryParent).each(function() {
            var add2 = $(this).find(search).closest('div.rel');
            if (add2.first().has(blokerClass).length) {
            } else {
                add2.prepend(zielonkaBloker);
            }
        });
    }

    function removeBloker() {
        var remove1 = $(listParent).find(search).parent().next('div.text').find('div.media-content');
        remove1.click(function() {
            $(this).find(blokerClass).hide();
        });
    }

    function removeBlokerGallery() {
        var remove2 = $(galleryParent).find(search).closest('div.rel');
        remove2.click(function() {
            $(this).find(blokerClass).hide();
        });
    }

    addBloker();
    removeBloker();
    addBlokerGallery();
    removeBlokerGallery();

    $(document).ajaxComplete(function() {
        addBloker();
        removeBloker();
        addBlokerGallery();
        removeBlokerGallery();
    });

})();