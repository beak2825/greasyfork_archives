// ==UserScript==
// @name         Стань сигмой
// @namespace    http://zelenka.guru/
// @version      1.1
// @description  Удаляет почти все разделы
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @icon https://i1.sndcdn.com/artworks-BXugSxIERNzWqoyd-ZCnyCA-t500x500.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470675/%D0%A1%D1%82%D0%B0%D0%BD%D1%8C%20%D1%81%D0%B8%D0%B3%D0%BC%D0%BE%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/470675/%D0%A1%D1%82%D0%B0%D0%BD%D1%8C%20%D1%81%D0%B8%D0%B3%D0%BC%D0%BE%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElement(element) {
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    const links = document.getElementsByTagName('a');

    for (let i = 0; i < links.length; i++) {
        const link = links[i];

        const href = link.getAttribute('href');
        if (href === 'forums/104/' || href === 'forums/105/' || href === 'forums/arbitrage/' || href === 'forums/585/' || href === 'forums/587/' || href === 'forums/421/' || href === 'forums/82/' || href === 'forums/767/' || href === 'forums/csgo/' || href === 'forums/cs2/' || href === 'forums/435/' || href === 'forums/967/' || href === 'forums/19/' || href === 'forums/790/' || href === 'forums/914/' || href === 'forums/139/' || href === 'forums/760/' || href === 'forums/85/' || href === 'forums/86/' || href === 'forums/88/' || href === 'forums/test-forum/') {
            removeElement(link);
        }
    }
})();

