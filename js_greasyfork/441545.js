// ==UserScript==
// @name         Хороший попугай Кеша
// @name:ru         Хороший попугай Кеша
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Это тот скрипт может повторять текст при помощи команды /скажи  ну и почти всё это тот скрипт довольно маленький
// @author       KOT444
// @match        *://multiplayerpiano.com/*
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @icon         https://www.google.com/s2/favicons?domain=w2g.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441545/%D0%A5%D0%BE%D1%80%D0%BE%D1%88%D0%B8%D0%B9%20%D0%BF%D0%BE%D0%BF%D1%83%D0%B3%D0%B0%D0%B9%20%D0%9A%D0%B5%D1%88%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/441545/%D0%A5%D0%BE%D1%80%D0%BE%D1%88%D0%B8%D0%B9%20%D0%BF%D0%BE%D0%BF%D1%83%D0%B3%D0%B0%D0%B9%20%D0%9A%D0%B5%D1%88%D0%B0.meta.js
// ==/UserScript==

MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.length).trim();

    if (cmd == '/помощь'){
    MPP.chat.send('Команды: /скажи , /кешахороший , /кеша , /Бешенство , /Ярость');
    }
    if (cmd == '/скажи'){
    MPP.chat.send(' ' + msg.a.substring(6).trim());
    }
    if (cmd == '/кешахороший'){
    MPP.chat.send('Кеша хороший');
    }
    if (cmd == '/кеша'){
    MPP.chat.send('Кеша хороший Кеша хороший Кеша хороший Кеша хороший Чирик чирик');
    }
    if (cmd == '/Бешенство'){
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    }
        if (cmd == '/Ярость'){
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
     MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
     MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
     MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
     MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
     MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
     MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
     MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
     MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
     MPP.chat.send('ЧИРИК!!!!!!!!!!');
    }
})();