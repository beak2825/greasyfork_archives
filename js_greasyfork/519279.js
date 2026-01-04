// ==UserScript==
// @name         Crosshair for bridging on miniblox.io
// @namespace    http://tampermonkey.net/
// @description  Adds a crosshair in the form of an arrow in the center of the screen on miniblox.io
// @author       Your Name
// @match        https://miniblox.io/*
// @grant        GM_addStyle
// @license      Redistribution prohibited
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/519279/Crosshair%20for%20bridging%20on%20minibloxio.user.js
// @updateURL https://update.greasyfork.org/scripts/519279/Crosshair%20for%20bridging%20on%20minibloxio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL изображения стрелочки
    const crosshairURL = 'https://static.thenounproject.com/png/344378-200.png';

    // Создаем элемент изображения прицела
    const crosshair = document.createElement('img');
    crosshair.src = crosshairURL;
    crosshair.style.position = 'fixed';
    crosshair.style.top = '50%';
    crosshair.style.left = '50%';
    crosshair.style.width = '30px'; // Установите размер прицела
    crosshair.style.height = '30px'; // Установите размер прицела
    crosshair.style.transform = 'translate(-50%, -50%)';
    crosshair.style.zIndex = '9999'; // Поверх всех элементов

    // Добавляем прицел на страницу
    document.body.appendChild(crosshair);
})();
