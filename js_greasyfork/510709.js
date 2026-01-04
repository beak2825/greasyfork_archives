// ==UserScript==
// @name     SPB | Интерефейс форум
// @match    https://forum.blackrussia.online/*
// @namespace Скрипт
// @version  0.2
// @license 
// @grant    GM_addStyle
// @description Фон
// @downloadURL https://update.greasyfork.org/scripts/510709/SPB%20%7C%20%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%84%D0%B5%D0%B9%D1%81%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/510709/SPB%20%7C%20%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%84%D0%B5%D0%B9%D1%81%20%D1%84%D0%BE%D1%80%D1%83%D0%BC.meta.js
// ==/UserScript==

//(function() {

//})();
//  https://steamuserimages-a.akamaihd.net/ugc/914665966092621957/D8DF127D5BC426A8089B269FC1902B63C1673063/?imw=512&amp;imh=288&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=true
//    const imageUrl = 'https://steamuserimages-a.akamaihd.net/ugc/955223864109482020/CF92E0AF4E676FDE92024A89A4284E6A95ED6BBA/?imw=512&imh=288&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true'
// https://img.goodfon.ru/original/2560x1440/b/48/forest-nature-forest-forest-angel.jpg
//



(function() {
    // Base64 строка вашего изображенияakamaihd
    const imageUrl = 'https://img.goodfon.ru/original/2560x1440/b/48/forest-nature-forest-forest-angel.jpg'

    // Функция для изменения фона
    function changeBackground() {
        document.body.style.backgroundImage = `url('${imageUrl}')`;
        // Для растяжения изображения на всю страницу можно добавить дополнительные CSS свойства
        document.body.style.backgroundSize = 'cover'; // Растягивание изображения на всю ширину и высоту без искажений
        document.body.style.backgroundRepeat = 'no-repeat'; // Запрет повторения фонового изображения
        document.body.style.backgroundAttachment = 'fixed'; // Фоновое изображение зафиксировано
    }

    // Вызов функции смены фона
    changeBackground();
})();

(function() { //надо для прозр фона
    'use strict';

    GM_addStyle(`
        .structItem.structItem--thread, .block-body, .structItemContainer {
            background-color: rgba(0, 0, 0, 0.1);
        }
    `);
})();

(function() {
    'use strict';

    // Function to extract color from class="structItem-minor"
    function getUserNameColor(element) {
        const minorElement = element.querySelector('.structItem-minor');
        if (minorElement) {
            const style = window.getComputedStyle(minorElement);
            return style.color;
        }
        return '#fff'; // Default color if not found
    }

    GM_addStyle(`
        .structItem-cell.structItem-cell--latest a:not(:hover) {
            text-shadow: 0 0 0px currentColor; /* Glow with the current text color */
        }
    `);

    // Apply styles dynamically
    const elements = document.querySelectorAll('.structItem-cell.structItem-cell--latest a:not(:hover)');
    for (const element of elements) {
        const color = getUserNameColor(element.parentElement);
        element.style.textShadow = `10 3 0px ${color}`;
    }
})();



(function() {   //смена цвета названий тем
    'use strict';

    const colors = ['#ff0000', '#ffff00', '#00ffff']; // Red, yellow, cyan
    let currentColorIndex = 0;

    function changeGlowColor() {
        const elements = document.querySelectorAll('.structItem-title a[id^="js-XFUniqueId"]');
        for (const element of elements) {
            element.style.textShadow = `0 0 0px ${colors[currentColorIndex]}`;
        }
        currentColorIndex = (currentColorIndex + 1) % colors.length;
    }

    setInterval(changeGlowColor, 1000); // Change color every 1 second
})();

(function() {
    'use strict';

    GM_addStyle(`
        .block-container {
            background: #383c4200 !important;
            box-shadow: 0 0 10px #fff; /* White glow with 10px spread */
            animation: glow 2s ease-in-out infinite alternate; /* Animation */
        }

        @keyframes glow {
            from {
                box-shadow: 0 0 0px #fff; /* Smaller glow */
            }
            to {
                box-shadow: 0 0 0px #fff; /* Larger glow */
            }
        }
    `);
})();






(function() { //надо для прозр фона
    'use strict';

    GM_addStyle(`
        .block--messages .message .message-inner .message-cell:first-child, .js-quickReply .message .message-inner .message-cell:first-child, .block--messages .message .message-inner .message-cell:last-child, .js-quickReply .message .message-inner .message-cell:last-child {
            background-color: rgba(0, 0, 0, 0.1);
        }
    `);
})();


(function() {
    'use strict';

    // Function to extract color from class="structItem-minor"
    function getUserNameColor(element) {
        const minorElement = element.querySelector('.structItem-minor');
        if (minorElement) {
            const style = window.getComputedStyle(minorElement);
            return style.color;
        }
        return '#fff'; // Default color if not found
    }

    GM_addStyle(`
        .structItem-cell.structItem-cell--latest a:not(:hover) {
            text-shadow: 0 0 0px currentColor; /* Glow with the current text color */
        }
    `);

})();
(function() {
    'use strict';

    const colors = ['#ff0000', '#ffff00', '#00ffff'];
    let currentColorIndex = 0;

    function changeGlowColor() {
        const elements = document.querySelectorAll('.structItem-title a[id^="js-XFUniqueId"]');
        for (const element of elements) {
            element.style.transition = 'text-shadow 0.5s ease'; // Add transition
            element.style.textShadow = `0 0 5px ${colors[currentColorIndex]}`;
        }
        currentColorIndex = (currentColorIndex + 1) % colors.length;
    }

    setInterval(changeGlowColor, 1500); // Change color every 1.5 seconds
})();

