// ==UserScript==
// @name         Adjust Images in tfgames.site
// @version      0.1
// @description  Adjust images inside the element with id "tabs" on tfgames.site
// @match        https://tfgames.site/*
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/484238/Adjust%20Images%20in%20tfgamessite.user.js
// @updateURL https://update.greasyfork.org/scripts/484238/Adjust%20Images%20in%20tfgamessite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для регулировки ширины изображений внутри элемента с id "tabs"
    function adjustImages() {
        const tabsElement = document.getElementById('tabs');
        if (tabsElement) {
            const imgElements = tabsElement.querySelectorAll('img');
            imgElements.forEach(img => {
                // Установите свои предпочтительные стили для изображений здесь
                img.style.width = '100%'; // Пример: растянуть изображение на всю ширину родительского элемента
                img.style.height = 'auto'; // Сохранить соотношение сторон
                img.style.display = 'block'; // Избежать отступов между изображениями
                img.style.marginLeft = 'auto';
                img.style.marginRight = 'auto';
            });
        }
    }

    // Вызовите функцию при загрузке страницы и при изменении размера окна
    window.addEventListener('load', adjustImages);
    window.addEventListener('resize', adjustImages);
})();
