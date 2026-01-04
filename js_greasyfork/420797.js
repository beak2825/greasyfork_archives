// ==UserScript==
// @name                FreeTP Fast Download
// @name:ru-RU          Быстрое скачивание с FreeTP.org
// @name:ru             Быстрое скачивание с FreeTP.org
// @namespace           https://mjkey.ru/#work
// @version             0.1
// @description         Downloading without waiting and removes fake links
// @description:ru      Скачивание без ожидания и удаляет фейк ссылки!
// @description:ru-RU   Скачивание без ожидания и удаляет фейк ссылки!
// @author              MjKey <goe@mjkey.ru>
// @twitterURL          https://twitter.com/mjkey_life
// @supportURL          https://openuserjs.org/scripts/MjKey/FreeTP_Fast_Download/issues
// @contributionURL     https://www.donationalerts.com/r/mjk3y
// @icon                data:image/png;base64,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
// @match               *://www.freetp.org/*
// @match               *://*.freetp.org/*
// @match               *://*.freetp.org/*.html
// @match               *://*.freetp.org/*.html?*
// @match               *://*.freetp.org/*.htm
// @match               *://*.freetp.org/*.htm?*
// @match               *://*.freetp.org/*/*
// @match               *://*.freetp.org/*/*.html
// @match               *://*.freetp.org/*/*.html?*
// @match               *://*.freetp.org/*/*.htm
// @match               *://*.freetp.org/*/*.htm?*
// @require             https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant               window.close
// @license             GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/420797/FreeTP%20Fast%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/420797/FreeTP%20Fast%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //v2 (RECOMENDATED)
    var a = location.href; //link
    var b; //код файла
    if(a.match('/getfile')){
        $('body').hide();
        b = a.replace(/[^+\d]/g, ''); //получем код из ссылки
        console.log(a+'+'+b);
        window.open('https://freetp.org/engine/download.php?id='+b); //ссылка на скачивание собственно
        $('html').append('<center><h1>Быстрое скачивание by MjKey</h1><br><a href="https://mjkey.ru/" target="_blank"><h2>mjkey.ru</h2></a><p>Если на скачалось, то клик <a href="https://freetp.org/engine/download.php?id='+b+'"><b>СЮДА</b></a></p></center>'); //реклама
        setTimeout(function(){
            window.close(); //закрытие вкладки через 5сек
        }, 5000);
    }
    // убирает лишние кнопки скачать (рекламу)
    $("img[src$='1appwzrd.png']").hide();
    $("a[href*='is.gd']").hide();
    $("table").hide();
    //v1
    /*
    var a;
    var b;
    var d;
    window.onload = function() {
        a = $('.quote p a, .quote span a').attr('href');
        if(a.match('/getfile')){
            d = 0;
            b = a.replace(/[^+\d]/g, '');
        }else{
            d = 1;
            d = atob(a.split('=').pop());
            b = d.replace(/[^+\d]/g, '');
        }
        $('.quote p a, .quote span a').attr('href','//freetp.org/engine/download.php?id='+b);
    };*/
})();