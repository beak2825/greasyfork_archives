// ==UserScript==
// @name         Pobieranie zdjęć Meblujdom
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Zostaje dodany przycisk nad nazwą produktu do pobrania wszystkich zdjeć z meblujdom w najlepszej jakości.
// @author       Eryk Wróbel
// @exclude      https://meblujdom.pl/admin*
// @match        https://meblujdom.pl/*.html*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485724/Pobieranie%20zdj%C4%99%C4%87%20Meblujdom.user.js
// @updateURL https://update.greasyfork.org/scripts/485724/Pobieranie%20zdj%C4%99%C4%87%20Meblujdom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $.getScript('https://meblujdom.pl/js/useful_functions.js?v=0.02', function () {
        $(document).ready(function() {
            if (page_name == 'product' && typeof images !== 'undefined') {
                $(document.body).append('<a href="javascript:void(0)" id="download_images" class="btn btn-hollow btn-md" style="border-radius:2em;margin-bottom:10px; position:fixed;bottom:4em;left:2em"><i class="icon-download"></i> Pobierz zdjęcia</a>');

                $(document).on('click', '#download_images', function(){
                   let sorted_images = [];
                     $.each(images, function(k,v){
                        sorted_images.push(v);
                     });

                    // we need to sort this by position in presta
                    sorted_images.sort((a, b) => ((a.position*1) > (b.position*1)) ? 1 : -1);

                    $.each(sorted_images, function(k,v){
                        let thumbnail_url = baseDir+ v.id_image +'/'+ v.link_rewrite + '.jpg';
                        let full_url = baseDir+ v.id_image+'/'+ v.link_rewrite + '.jpg';
                        downloadImage(thumbnail_url, v.link_rewrite+'_'+k);
                    });
                });
            }
        });
    });
})();