// ==UserScript==
// @name 💎 Счётчик жалоб by.Soliev💎
// @namespace https://forum.blackrussia.online
// @version 2.3
// @description Best Curators
// @author Botir_Soliev
// @updateversion Основной для КФ
// @match https://forum.blackrussia.online/*
// @include https://forum.blackrussia.online/*
// @grant none
// @license MIT
// @copyright 2024,
// @icon https://forum.blackrussia.online/account/avatar
// @downloadURL https://update.greasyfork.org/scripts/508025/%F0%9F%92%8E%20%D0%A1%D1%87%D1%91%D1%82%D1%87%D0%B8%D0%BA%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%20bySoliev%F0%9F%92%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/508025/%F0%9F%92%8E%20%D0%A1%D1%87%D1%91%D1%82%D1%87%D0%B8%D0%BA%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%20bySoliev%F0%9F%92%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function countOccurrences() {
        const elements = document.querySelectorAll('.username--style17, .username--moderator');
        let count = 0;

        elements.forEach(function(element) {
            if (element.innerText.includes('Botir_Soliev')) {
                count++;
            }
        });


        const countDisplay = document.createElement('div');
        countDisplay.textContent = `Количество ЖБ: ${count}`;
        countDisplay.style.position = 'fixed';
        countDisplay.style.bottom = '310px';
        countDisplay.style.left = '50px';
        countDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        countDisplay.style.color = 'white';
        countDisplay.style.padding = '5px 10px';
        countDisplay.style.borderRadius = '5px';
        countDisplay.style.zIndex = '9999';

        document.body.appendChild(countDisplay);
    }

    countOccurrences();
})();



//-----------------------------------------


// ==UserScript==
// @name     SPB | Интерефейс форум [By.Artem Yadonist]
// @match    https://forum.blackrussia.online/*
// @version  1.1
// @grant    GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .block-minorHeader.uix_threadListSeparator {
            background: #000000de !important;
        }
    `);
})();

(function() {
    'use strict';

    GM_addStyle(`
        .block-filterBar {
            background: #000000de !important;
        }

        .block-minorHeader.uix_threadListSeparator .block-filterBar {
            background: #000000de !important;
        }
    `);
})();

(function() {
    'use strict';

    GM_addStyle(`
        .block-filterBar {
            background: #000000de !important;
        }

        .block-minorHeader.uix_threadListSeparator .block-filterBar {
            background: #000000de !important;
        }
        .structItem-minor .structItem-parts li a.username {
            text-shadow: 0 0 2px #FFFFFF;
        }
                .block-filterBar {
            background: #000000de !important;
        }

        .block-minorHeader.uix_threadListSeparator .block-filterBar {
            background: #000000de !important;
        }
    `);
})();


(function() {
    // Base64 строка вашего изображения
    const imageUrl = 'https://img1.akspic.ru/crops/0/0/0/8/7/178000/178000-legkovyye_avtomobili-oblako-avtomobilnoe_osveshhenie-derevo-sumrak-1920x1080.jpg'

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
            background-color: rgba(0, 0, 0, 0.2);
        }
    `);
})();

(function() { //надо для прозр фона
    'use strict';

    GM_addStyle(`
        .block--messages .message .message-inner .message-cell:first-child, .js-quickReply .message .message-inner .message-cell:first-child, .block--messages .message .message-inner .message-cell:last-child, .js-quickReply .message .message-inner .message-cell:last-child {
            background-color: rgba(0, 0, 0, 0.2);
        }
    `);
})();








(function() {
    'use strict';
    const elements = document.querySelectorAll('.is-prefix14.is-unread');
    const countDisplay = document.createElement('button');
    countDisplay.innerHTML = 'Обжалование';
    countDisplay.style.position = 'fixed';
    countDisplay.style.bottom = '10px';
    countDisplay.style.left = '10px';
    countDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    countDisplay.style.color = 'white';
    countDisplay.style.padding = '5px 10px';
    countDisplay.style.borderRadius = '500px';
    countDisplay.style.zIndex = '9999';
    countDisplay.textContent = `Ждёт ответа: ${elements.length}`;
    document.body.appendChild(countDisplay);
})();

(function() {
    'use strict';

    // Находим все элементы <div> с классом "is-prefix14"
    const elements = document.querySelectorAll('.is-prefix2.is-unread');

    // Создаем кнопку для отображения количества
    const countDisplay = document.createElement('button');
    countDisplay.innerHTML = 'Обжалование';
    countDisplay.style.position = 'fixed';
    countDisplay.style.bottom = '50px';
    countDisplay.style.left = '10px';
    countDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    countDisplay.style.color = 'white';
    countDisplay.style.padding = '5px 10px';
    countDisplay.style.borderRadius = '500px';
    countDisplay.style.zIndex = '9999';

    // Добавляем количество элементов в текст кнопки
    countDisplay.textContent = `На рассмотрение: ${elements.length}`;

    // Добавляем кнопку на страницу
    document.body.appendChild(countDisplay);
})();




//---------------------------------------------------------------


