// ==UserScript==
// @name         Pobieranie zdjęć Meble Elite
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Zostaje dodany przycisk nad nazwą produktu do pobrania wszystkich zdjeć z meble elite w najlepszej jakości.
// @author       Eryk Wróbel
// @match        https://mebelelite.pl/p/*
// @match        https://b2b.mebelelite.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mebelelite.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485161/Pobieranie%20zdj%C4%99%C4%87%20Meble%20Elite.user.js
// @updateURL https://update.greasyfork.org/scripts/485161/Pobieranie%20zdj%C4%99%C4%87%20Meble%20Elite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function downloadImage(imageSrc, name) {
        const image = await fetch(imageSrc)
        const imageBlog = await image.blob()
        const imageURL = URL.createObjectURL(imageBlog)

        const link = document.createElement('a');
        link.href = imageURL;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    $(document).ready(function() {
        let b2b = false;
        if ($('.product-column__content').length) {
            b2b = true;
        }

        if (b2b) {
             $('.h1').prepend('<a href="javascript:void(0);" id="download_images" class="btn btn-info btn-sm" style="border-radius:2em;margin-bottom:10px">Pobierz zdjęcia</a><br>');
        } else {
            $('.h1.page-title').prepend('<a href="javascript:void(0);" id="download_images" class="btn btn-info" style="border-radius:2em;margin-bottom:10px">Pobierz zdjęcia</a>');
        }

        $(document).on('click', '#download_images', function(){
            if (b2b) {
                $('.product-thumbs__img').each(function(k,v) {
                    let el = $(this);
                    let url = el.attr('data-src').replace('-small_default', '');
                    $(this).attr('src', url);
                    let i_url = url.split('.jpg');
                    let final_url = i_url[0] + k + '.jpg';

                    let name = final_url.split('/').findLast((item) => true).replace('.jpg', '');

                    window.open(final_url, '_blank');

                });
            } else {
                $('.thumb.js-thumb').each(function(k,v) {
                    let el = $(this);
                    let url = el.attr('data-image-medium-src').replace('-medium_default', '');
                    let i_url = url.split('.jpg');
                    let final_url = i_url[0] + k + '.jpg';

                    let name = final_url.split('/').findLast((item) => true).replace('.jpg', '');
                    downloadImage(final_url, name);
                });
            }
        })
    });

})();