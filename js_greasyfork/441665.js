// ==UserScript==
// @name         Бот для глеба
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Бот для Глеба
// @author       You
// @match        *://multiplayerpiano.com/*
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441665/%D0%91%D0%BE%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B3%D0%BB%D0%B5%D0%B1%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/441665/%D0%91%D0%BE%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B3%D0%BB%D0%B5%D0%B1%D0%B0.meta.js
// ==/UserScript==


MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.length).trim();

    if (cmd == '/скажи'){
    MPP.chat.send('Сообщение: ' + msg.a.substring(6).trim());
    }
        if (cmd == '/помощь'){
    MPP.chat.send('Команды: /скажи , /Привет , /Пока , /Гартик , /В2г , /помощьадмин , ');
    }
         if (cmd == '/Привет'){
    MPP.chat.send('Здравствуйте');
    }
    if (cmd == '/Пока') {
    var words = ['Пока', 'До скорой встречи', 'До завтра', 'До свидания']; var random = Math.floor(Math.random() * words.length);
    MPP.chat.send('' + words[random]);
    }
    if (cmd == '/Гартик'){
    MPP.chat.send('https://garticphone.com/ru');
    }
    if (cmd == '/Гобатлио'){
    MPP.chat.send('https://gobattle.io/#');
    }
})();