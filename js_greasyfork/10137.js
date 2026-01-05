// ==UserScript==
// @name        Sport-Express: No autoplay, please!
// @description Выключает автоматическое воспроизведение видео на страницах Спорт-Экспресс.
// @namespace   lainscripts_sportexpress_no_autoplay_please
// @include     http://www.sport-express.ru/*
// @include     https://www.sport-express.ru/*
// @version     4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10137/Sport-Express%3A%20No%20autoplay%2C%20please%21.user.js
// @updateURL https://update.greasyfork.org/scripts/10137/Sport-Express%3A%20No%20autoplay%2C%20please%21.meta.js
// ==/UserScript==

function func1(objs) {
    if (!objs.length) return;
    for(var i=0;i<objs.length;i++)
        objs[i].value = objs[i].value.replace(/&autoplay(=\d)?/,'');
}; func1(document.querySelectorAll('param[name="flashvars"]'));

function func2(objs) {
    if (!objs.length) return;
    for(var i=0;i<objs.length;i++)
        objs[i].src = 'data:text/html;charset=utf-8,' + encodeURI(''+
        '<body style="color:white;background-color:black">Автоматическое воспроизведение видео было приостановлено.'+
        '<br/>Нажмите на <a href=' + objs[i].src + '>эту ссылку</a> для воспроизведения.</body>');
}; func2(document.querySelectorAll('iframe[src*="&autoplay"]'));
