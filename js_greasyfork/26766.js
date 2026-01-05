// ==UserScript==
// @name         Pikabu seconds
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Сколько секунд?
// @author       hant0508
// @match        http://pikabu.ru/story/*
// @match        https://pikabu.ru/story/*
// @match        https://new.pikabu.ru/story/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/26766/Pikabu%20seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/26766/Pikabu%20seconds.meta.js
// ==/UserScript==

function getTime() {
    var post = document.getElementsByClassName('story__main')[0];
    if (post === undefined)
    {
        window.setTimeout(getTime, 1);
        return;
    }

    var newVersion = (document.getElementsByTagName('html')[0].getAttribute('lang') == 'ru');
    console.log(newVersion);
    var time;
    if (newVersion)
        time = Date.parse(post.getElementsByClassName('story__datetime')[0].getAttribute('datetime'))/1000;
    else
        time = post.getElementsByClassName('story__date')[0].title;

    console.log(time);
    window.addEventListener('load', setTime(time, newVersion), false);
}

function setTime(postTime, newVersion) {
    var comments = (newVersion ? document.getElementsByClassName('comments')[0].getElementsByClassName('comment__datetime') : document.getElementsByClassName('b-comment__time'));
    for (var i = 0; i < comments.length; ++i)
    {
        var time = comments[i].getAttribute('datetime');
        if (newVersion)
            time = Date.parse(time)/1000;
        time -= postTime;

        var sec = ' секунд';
        var elm = document.createElement('span');

        if (time % 100 < 10 || time % 100 > 20) {
            if (time % 10 == 1) sec += "a";
            else if (time % 10 < 5 && time % 10) sec += "ы";
        }
        elm.innerHTML = '&nbsp;(' + time + sec + ')';
        comments[i].parentNode.insertBefore(elm, comments[i].nextSibling);
    }
}

getTime();
