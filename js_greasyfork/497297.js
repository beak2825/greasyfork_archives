// ==UserScript==
// @name        RandomList dtf.ru
// @namespace   dtf
// @match       https://dtf.ru/*
// @grant       none
// @version     1.0
// @author      -
// @description 07.06.2024, 16:15:47
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497297/RandomList%20dtfru.user.js
// @updateURL https://update.greasyfork.org/scripts/497297/RandomList%20dtfru.meta.js
// ==/UserScript==
// Функция для генерации случайного числа в заданном диапазоне
function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function startRandomMovement(elements) {
    const container = document.querySelector('.context-list--grid');
    container.style.height = '232px';

    elements.forEach(element => {
        element.style.position = 'absolute';
        let x = randomInRange(0, container.clientWidth - element.offsetWidth);
        let y = randomInRange(0, container.clientHeight - element.offsetHeight);
        let speedX = randomInRange(1, 5);
        let speedY = randomInRange(1, 5);

        function moveElement() {
            x += speedX;
            y += speedY;

            if (x <= 0 || x >= container.clientWidth - element.offsetWidth) {
                speedX *= -1;
            }
            if (y <= 0 || y >= container.clientHeight - element.offsetHeight) {
                speedY *= -1;
            }

            element.style.left = x + 'px';
            element.style.top = y + 'px';
        }

        setInterval(moveElement, 11);
    });
}

function checkAndStartAnimation() {
    const reactionElements = document.querySelectorAll('.icon--reaction_add');
    if (reactionElements.length > 0) {
        reactionElements.forEach(element => {
            element.parentElement.addEventListener('click', () => {
                const gridElements = document.querySelectorAll('.context-list--grid > .context-list-option--with-art');
                if (gridElements.length > 0) {
                    startRandomMovement(gridElements);
                }
            });
        });
        clearInterval(checkInterval);
    }
}

let checkInterval = setInterval(checkAndStartAnimation, 1000);

document.addEventListener('DOMContentLoaded', checkAndStartAnimation);
