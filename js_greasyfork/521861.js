// ==UserScript==
// @name         BM-Old
// @namespace    http://tampermonkey.net/
// @version      1
// @description  да
// @author       oleg
// @match        https://black-minecraft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=black-minecraft.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521861/BM-Old.user.js
// @updateURL https://update.greasyfork.org/scripts/521861/BM-Old.meta.js
// ==/UserScript==

(function() {
    'use strict';
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
    window.addEventListener('DOMContentLoaded', () => {

        const images1 = document.querySelectorAll('.menulogo');

    images1.forEach(image => {
        image.src = 'https://png.klev.club/uploads/posts/2024-05/png-klev-club-30ww-p-forum-png-15.png';
    })
    const images = document.querySelectorAll('img');

    images.forEach(image => {
        const originalSrc = image.src;

        // Сделаем картинку невидимой на момент задержки
        image.style.visibility = 'hidden';

        // Используем setTimeout для задержки загрузки
        setTimeout(() => {
            image.src = originalSrc; // восстанавливаем исходный источник изображения
            image.style.visibility = 'visible'; // показываем картинку после задержки
        }, getRandomInt(100, 1500)); // Задержка в 5000 мс (5 секунд)
    });
    })
    // Инжектируем стили
    const style = document.createElement('style');
    style.textContent = `
    img {visibility: hidden;}
        .js-notices {
            display: none !important;
        }
        * {
  animation: none !important;
  transition: none !important;
}
.cyber-button {
transform: none !important;
box-shadow: none !important;
}
.gold-group {
background-image: none !important;
background-color: yellow !important;
}
        * {
            border-radius: 0 !important;
        }
        svg {
        }
        .username--style5 {
            all: unset;
        }

[class^="username--style"] {
  background-image: none !important;
  text-shadow: none !important;
}

* {
font-family: "Times New Roman", Times, serif;
}
bm_fave_previalable a svg {
display: block !important;
}
*:hover {
transform: none !important;
filter: none !important;
}

* {
cursor: default !important;
  background-color: #fff !important;
  color: #0b0b0b !important;
}
    `;
    document.documentElement.appendChild(style);
})();
