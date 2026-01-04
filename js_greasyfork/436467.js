    // ==UserScript==
    // @name         Vk фикс ссылок на музыку и видео
    // @namespace    vk-fix-music-and-videolinks
    // @version      0.3
    // @description  Теперь при переходе в "Мою музыку" будет открываться ваш список аудио, а не список рекомендаций
    // @author       Desu
    // @match        *://vk.com/*
    // @grant        none
    // @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/436467/Vk%20%D1%84%D0%B8%D0%BA%D1%81%20%D1%81%D1%81%D1%8B%D0%BB%D0%BE%D0%BA%20%D0%BD%D0%B0%20%D0%BC%D1%83%D0%B7%D1%8B%D0%BA%D1%83%20%D0%B8%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/436467/Vk%20%D1%84%D0%B8%D0%BA%D1%81%20%D1%81%D1%81%D1%8B%D0%BB%D0%BE%D0%BA%20%D0%BD%D0%B0%20%D0%BC%D1%83%D0%B7%D1%8B%D0%BA%D1%83%20%D0%B8%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE.meta.js
    // ==/UserScript==
    let userId = document.getElementById("top_logout_link").getAttribute('onclick').match(/_[0-9]+/);
    userId = userId[0].substring(1);
    let musicLinksArr = document.querySelectorAll('a[href="/audios'+userId+'"]');
    for (let i = 0; i < musicLinksArr.length; i++) {
        musicLinksArr[i].setAttribute('href', '/audios'+userId+'?section=all');
    }
    let videoLinksArr = document.querySelectorAll('#side_bar a[href="/video"]');
    for (let i = 0; i < videoLinksArr.length; i++) {
        videoLinksArr[i].setAttribute('href', '/video/@'+userId);
    }

