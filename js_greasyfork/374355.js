// ==UserScript==
// @name         findImg in en
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *.en.cx/gameengines/encounter/play/*
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374355/findImg%20in%20en.user.js
// @updateURL https://update.greasyfork.org/scripts/374355/findImg%20in%20en.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('head').append('<style>'+
                     '.imgWrap{position:relative;}'+
                     '.imgWrap .imgLnk{background:#fff;padding:0 5px;position: absolute;z-index: 10000;left: 0;top: 0;opacity: .3;}'+
                     '.imgWrap .imgLnk:hover{opacity: 1;}'+
                     '.imgWrap .imgLnk a{color:#000; font-size:12px;}'+
                     '</style>');
    var intervalID = window.setTimeout(imgLnkAdd, 3000);
    function imgLnkAdd(){
        let arImg=$('.content #task img');
        $.each(arImg, function( index, img ) {
            img=$(img);
            let div='<div class="imgWrap"></div>';
            let src=img.prop('src');
            let block='<div class="imgLnk"  >'+
                '<a href="'+src+'" target="_blank">Ссылка на картинку</a><br>'+
                '<a href="https://www.google.com/searchbyimage?image_url='+(src)+'" target="_blank">Искать в гугле</a><br>'+
                '<a href="https://yandex.ru/images/search?rpt=imageview&cbird=1&img_url='+encodeURIComponent(src).replace(/%20/g,'+')+'" target="_blank">Искать в яндекс</a>'+
                '</div>'
            $(div).insertBefore(img).append(img).append(block);
        });
    }
})();