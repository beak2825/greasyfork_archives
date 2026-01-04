// ==UserScript==
// @name         Плохой попугай Кеша
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Плохая версия попугая Кеши
// @author       You
// @match        *://multiplayerpiano.com/*
// @icon         https://www.google.com/s2/favicons?domain=multiplayerpiano.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441778/%D0%9F%D0%BB%D0%BE%D1%85%D0%BE%D0%B9%20%D0%BF%D0%BE%D0%BF%D1%83%D0%B3%D0%B0%D0%B9%20%D0%9A%D0%B5%D1%88%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/441778/%D0%9F%D0%BB%D0%BE%D1%85%D0%BE%D0%B9%20%D0%BF%D0%BE%D0%BF%D1%83%D0%B3%D0%B0%D0%B9%20%D0%9A%D0%B5%D1%88%D0%B0.meta.js
// ==/UserScript==

MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.length).trim();

    if (cmd == '/помощь'){
    MPP.chat.send('Команды: /скажи , /кешахороший , /кеша , /Бешенство , /Спойчастьпесенки');
    }
    if (cmd == '/скажи'){
    MPP.chat.send('' + msg.a.substring(6).trim());
    }
    if (cmd == '/кешахороший'){
    MPP.chat.send('Да я хороший а ты нет');
    }
    if (cmd == '/кеша'){
    MPP.chat.send('Да пошёл ты , чирик');
    }
    if (cmd == '/Бешенство'){
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    MPP.chat.send('ЧИРИК!!!!!!!!!!');
    }
    if (cmd == '/Спойчастьпесенки') {
    var words = ['Миша и Кеша кричали на крыше,После двух выстрелов стало потише.', 'Девочка Таня у клетки ходила снова не надо кормить крокодила', 'Кладбище, полночь, на небе луна,Вижу, разрыта могила одна,Тихо мертвец протянул ко мне руки,Нет, никогда не помру я от скуки,Никогда.', 'Маленький мальчик по лесу гулял,Из тайника он гранату достал,Вспыхнули спички, треща на морозе,Долго болтались кишки на березе,Кишки на березе,Кишки на березе.']; var random = Math.floor(Math.random() * words.length);
    MPP.chat.send('' + words[random]);
    }
})();