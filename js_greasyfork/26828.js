// ==UserScript==
// @name         Pikabu current seconds
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Сколько прошло секунд?
// @author       hant0508
// @match        http://pikabu.ru/story/*
// @match        https://pikabu.ru/story/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26828/Pikabu%20current%20seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/26828/Pikabu%20current%20seconds.meta.js
// ==/UserScript==

function setTime(now) {
    for (var i = 0; i < comments.length; ++i)
    {
        var time = now - seconds[i];
        var sec = ' секунд';
        var end = ' назад';

        if (time % 100 < 10 || time % 100 > 20) {
            if (time % 10 == 1) sec += "a";
            else if (time % 10 < 5 && time % 10) sec += "ы";
            else end += '&ensp;';
        }
        else end += '&ensp;';

        comments[i].getElementsByClassName('current_seconds')[0].innerHTML = ' (' + time + sec + end + ')';
    }
    window.setTimeout (function(){setTime(Math.floor(Date.now()/1000));}, 5000);
}

var seconds = [];
var comments = document.getElementsByClassName('b-comment__time');
for (var i = 0; i < comments.length; ++i)
{
    seconds[i] = comments[i].getAttribute('datetime');
    comments[i].appendChild(document.createElement('span')).className='current_seconds';
}

setTime(Math.floor(Date.now()/1000));
