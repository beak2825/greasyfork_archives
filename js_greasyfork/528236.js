// ==UserScript==
// @name         Rezka UA Auto Cancel Next Episode
// @name:ru      Rezka UA Auto Cancel Next Episode
// @name:uk      Rezka UA Auto Cancel Next Episode
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically disables autoplay of the next episode on rezka-ua.org. The script detects the "Cancel" button during the countdown and clicks it after a 2-second delay, letting you watch series without jumping to the next episode. Perfect for those who want to fall asleep without interruptions. Works with Tampermonkey.
// @description:ru Автоматически отключает автопроигрывание следующей серии на rezka-ua.org. Скрипт находит кнопку "Отменить" при появлении отсчета и нажимает её с задержкой в 2 секунды, чтобы вы могли спокойно смотреть сериалы без перехода к следующему эпизоду. Идеально для тех, кто хочет заснуть, не прерываясь на новые серии. Работает с Tampermonkey.
// @description:uk Автоматично вимикає автовідтворення наступної серії на rezka-ua.org. Скрипт знаходить кнопку "Скасувати" під час появи відліку та натискає її із затримкою у 2 секунди, щоб ви могли спокійно дивитися серіали без переходу до наступного епізоду. Чудово підходить для тих, хто хоче заснути, не відволікаючись на нові серії. Працює з Tampermonkey.
// @author       Grok (with xAI)
// @match        *://rezka-ua.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528236/Rezka%20UA%20Auto%20Cancel%20Next%20Episode.user.js
// @updateURL https://update.greasyfork.org/scripts/528236/Rezka%20UA%20Auto%20Cancel%20Next%20Episode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для поиска и "нажатия" на кнопку "Отменить" с задержкой
    function cancelNextEpisode() {
        const cancelButton = document.querySelector('span[onclick="sof.tv.cancelNextEpisode();"]');
        if (cancelButton) {
            console.log('Кнопка "Отменить" найдена, ждем 2 секунды перед нажатием');
            setTimeout(() => {
                cancelButton.click(); // Эмулируем клик на кнопке после задержки
                console.log('Эмуляция клика на кнопке "Отменить" выполнена после задержки');
            }, 2000); // Задержка 2000 мс (2 секунды)
        }
    }

    // Создаем MutationObserver для отслеживания изменений в DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Проверяем, появилась ли кнопка
            cancelNextEpisode();
        });
    });

    // Настраиваем наблюдение за всем документом
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Проверяем сразу при загрузке страницы, вдруг кнопка уже есть
    cancelNextEpisode();

    // Дополнительная проверка каждые 3000 мс (на случай, если MutationObserver пропустит)
    setInterval(cancelNextEpisode, 3000);
})();