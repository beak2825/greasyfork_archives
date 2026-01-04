// ==UserScript==
// @name         mos-ru-theme
// @namespace    http://tampermonkey.net/
// @version      2024-09-06
// @description  school.mos.ru crack
// @author       Diramix
// @match        https://school.mos.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mos.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507201/mos-ru-theme.user.js
// @updateURL https://update.greasyfork.org/scripts/507201/mos-ru-theme.meta.js
// ==/UserScript==

// Оптимизация под смартфон
function updateMarginTop() {
    var wrapperElement = document.querySelector('.diary-emotion-cache-zqw19v-wrapper');

    if (wrapperElement) {
        if (window.matchMedia("(min-width: 640px)").matches) {
            wrapperElement.style.marginTop = '63px';
        } else {
            wrapperElement.style.marginTop = '0px';
        }
    }
}

setInterval(updateMarginTop, 1000);

// ZOV
function replaceText() {
    function walk(node) {
        var child, next;

        switch (node.nodeType) {
            case 1:
            case 9:
            case 11:
                child = node.firstChild;
                while (child) {
                    next = child.nextSibling;
                    walk(child);
                    child = next;
                }
                break;
            case 3:
                if (node.nodeValue.match(/МЭШ/g)) {
                    node.nodeValue = node.nodeValue.replace(/МЭШ/g, 'ZOV');
                }
                break;
        }
    }

    walk(document.body);
}

setInterval(replaceText, 50);

// Замена текста "Дневник"
setInterval(() => {
  const elements = document.getElementsByClassName('diary-emotion-cache-1hn4v0k-title');

  Array.from(elements).forEach(element => {
    if (element.textContent === 'Дневник') {
      element.textContent = 'mos-ru-theme';
    }
  });
}, 50);

// Уроков нет
setInterval(function() {
  const images = document.querySelectorAll('img');

  images.forEach(function(img) {
    if (img.src === 'https://school.mos.ru/diary/assets/images/62c5be8664724f76f324b47945ca9016.png') {
      img.src = 'https://github.com/Diramix/mos-ru-theme/blob/main/assets/urokov-net.jpg?raw=true';
    }
  });
}, 50);


// Здесь пока нет данных
setInterval(function() {
  const images = document.querySelectorAll('img');

  images.forEach(function(img) {
    if (img.src === 'https://school.mos.ru/diary/uikit/assets/images/ad064cd33924e352a98e503230a7f66e.png') {
      img.src = 'https://github.com/Diramix/mos-ru-theme/blob/main/assets/net-dannih.png?raw=true';
    }
  });
}, 50);

// Не удалось загрузить
setInterval(function() {
  const images = document.querySelectorAll('img');

  images.forEach(function(img) {
    if (img.src === 'https://school.mos.ru/diary/uikit/assets/images/44ae9ed513f79fcad9ab91f6041bd5c3.png') {
      img.src = 'https://github.com/Diramix/mos-ru-theme/blob/main/assets/ne-udalos-zagruzit.gif?raw=true';
    }
  });
}, 50);
