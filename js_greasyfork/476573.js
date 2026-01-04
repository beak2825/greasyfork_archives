// ==UserScript==
// @name         Амням Сквад
// @namespace    https://greasyfork.org/ru/users/1142494-llimonix
// @version      0.1
// @description  Новый логотип форума
// @author       llimonix
// @license      MIT
// @match        https://zelenka.guru/*
// @icon         https://i.imgur.com/tD7jeUS.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476573/%D0%90%D0%BC%D0%BD%D1%8F%D0%BC%20%D0%A1%D0%BA%D0%B2%D0%B0%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/476573/%D0%90%D0%BC%D0%BD%D1%8F%D0%BC%20%D0%A1%D0%BA%D0%B2%D0%B0%D0%B4.meta.js
// ==/UserScript==

(function() {
    $('#lzt-logo').css('background-image', 'url(https://i.imgur.com/tD7jeUS.gif)');
})();