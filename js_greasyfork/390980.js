// ==UserScript==
// @name         MySoap
// @author       antoz
// @version      0.0.1
// @homepage    https://antoz.ru/
// @namespace    MyShows.me X Soap4.me
// @description  Добавляет немного удобств для просмотра и отслеживания сериалов в основном на MyShows.me и Soap4.me.
// @include      *://*myshows.me/profile/*
// @include      *://*soap4.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390980/MySoap.user.js
// @updateURL https://update.greasyfork.org/scripts/390980/MySoap.meta.js
// ==/UserScript==
(function bettergg() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://antoz.ru/gg/mySoap.js';
    var body = document.getElementsByTagName('body')[0];
    if (!body) return;
    body.appendChild(script);
})();