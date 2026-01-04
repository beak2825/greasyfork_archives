// ==UserScript==
// @name         Бот для чёрно зела
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Бот для Кота чёрно зела нужен ему хз зачем .-.
// @author       You
// @match        *://multiplayerpiano.com/*
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441698/%D0%91%D0%BE%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%87%D1%91%D1%80%D0%BD%D0%BE%20%D0%B7%D0%B5%D0%BB%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/441698/%D0%91%D0%BE%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%87%D1%91%D1%80%D0%BD%D0%BE%20%D0%B7%D0%B5%D0%BB%D0%B0.meta.js
// ==/UserScript==

MPP.client.on("a", function(msg) {
    var asgr = msg.a.split(' ');
    var cmd = asgr[0];
    var input = msg.a.substring(cmd.length).trim();

    if (cmd == '!help'){
        MPP.chat.send('Команды: !кот мяукать , !кот скажи , !кот пр , !котпока');
    }
    if (cmd == '!котмяукать'){
        MPP.chat.send('Мяу мяу мяу мяу');
    }
        if (cmd == '!котскажи'){
    MPP.chat.send('Сообщение: ' + msg.a.substring(6).trim());
    }
        if (cmd == '!котпр'){
        MPP.chat.send('Пр');
    }
        if (cmd == '!котпока'){
        MPP.chat.send('пока');
    }
})();