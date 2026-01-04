// ==UserScript==
// @name         Pobieranie zdjęć z Halmar.pl
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Pobieranie wszystkich fotek z halmar.pl
// @author       Eryk Wróbel
// @match        https://halmar.pl/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485499/Pobieranie%20zdj%C4%99%C4%87%20z%20Halmarpl.user.js
// @updateURL https://update.greasyfork.org/scripts/485499/Pobieranie%20zdj%C4%99%C4%87%20z%20Halmarpl.meta.js
// ==/UserScript==

var $jq = jQuery.noConflict();

(function() {
    $jq.getScript('https://meblujdom.pl/js/useful_functions.js?v=0.02', function () {
        $jq(document).ready(function() {
            $jq('h1 > .container').append('<a href="javascript:void(0);" id="download_images" class="btn btn--noArrow btn--small btn--white -active" style="border-radius:2em;margin-bottom:10px">Pobierz zdjęcia</a>');

            $jq(document).on('click', '#download_images', function(){
                $jq('.productFoto__hover').each(function(k,v) {
                    let el = $jq(this);
                    let url = 'https://halmar.pl/' + el.attr('data-fotob');
                    let final_url = url.replace('.htm','.jpg');
                    let product_name = $jq('.ProductInfo__symbol > span').text().replaceAll('/','') + '_' + k;
                    product_name = product_name.replaceAll(' ','');
                    downloadImage(final_url, product_name);
                });
            })
        });
    });
})();