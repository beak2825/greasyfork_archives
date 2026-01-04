// ==UserScript==
// @name         Marbex ID
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Wyświetla ID produktu
// @author       Eryk Wróbel
// @match        https://panel.marbex.pl/produkt/*
// @icon         https://www.google.com/s2/favicons?domain=marbex.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442973/Marbex%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/442973/Marbex%20ID.meta.js
// ==/UserScript==

// changelog
// v 0.2 - dodanie wyświetlania się pełnej wersji zdjęć bez watermarka


(function() {
    'use strict';
    var path_to_replace = '/pictures/product/';
    var full_res_image_path = '/media/images/products/';

    //change main photo
    var new_main = $('.main-picture').attr('src').replace(path_to_replace, full_res_image_path);
    $('.main-picture').attr('src', new_main);

    // miniatures
    $('.product-minature, .carousel-picture').each(function(){
        var new_path = $(this).attr('src');
        new_path = new_path.replace(path_to_replace, full_res_image_path);

        $(this).attr('src', new_path);
    });

    $('#details-body > tr').each(function(k,elem){
        $(this).append('<td>' + $('#missing-picture').attr('data-product') + '-'+  $(this).attr('data-id') + '</td>');
    });

})();