// ==UserScript==
// @name         kitapyurdu+
// @namespace    http://www.kitapyurdu.com/
// @version      0.1
// @description  Kitapyurdundaki kitapların ve yazarların Goodreads üzerindeki sayfalarına kolayca ulaşılmasını sağlar
// @author       Onur Uslu
// @match        http://kitapyurdu.com/*
// @match        http://www.kitapyurdu.com/*
// @match        https://kitapyurdu.com/*
// @match        https://www.kitapyurdu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378223/kitapyurdu%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/378223/kitapyurdu%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var goodReadsLogo = 'https://s.gr-assets.com/assets/icons/gr-author-badge_23x23.png';

    $('.manufacturers [itemprop=name], .author span[itemprop=name]').each(function(e){
        console.log($(this).html());
       $(this).parent().parent().prepend(
           '<a href="https://www.goodreads.com/search?utf8=%E2%9C%93&q='+
           $(this).text().replace(' ','+')+
           '&search_type=books&search%5Bfield%5D=author"><img src="'+goodReadsLogo+'" style="width: 15px;" alt="G"></a>');
    });
    $('.name').each(function(e){
        if(!$(this).text())
            return;

        $(this).append(
            '<a href="https://www.goodreads.com/search?utf8=%E2%9C%93&q='+
            $(this).text()+
            '&search_type=books&search%5Bfield%5D=title" style="float:right; margin-top: -21px; position:relative;"><img src="'+goodReadsLogo+'" style="width: auto; position: absolute; left:-23px; z-index:999;" alt="G"></a>');
    });

    $('.product-heading').append(
        '<a href="https://www.goodreads.com/search?utf8=%E2%9C%93&q='+
        $('.product-heading').text()+
        '&search_type=books&search%5Bfield%5D=title" style="float:right;"><img src="'+goodReadsLogo+'" alt="G"></a>');


})();
