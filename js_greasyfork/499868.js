// ==UserScript==
// @name         Logo
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  LOGOmania
// @author       ZV
// @match        *://*/Admin/*
// @match        *://*//Admin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499868/Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/499868/Logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // SVG element as a string
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 238.5 238.5" style="width: 30px; vertical-align: middle;"><path fill="#fff" d="M120.5,141.6c-11.8,0-21.4-9.6-21.4-21.4c0-11.8,9.6-21.4,21.4-21.4c11.8,0,21.4,9.6,21.4,21.4  C141.9,132.1,132.4,141.6,120.5,141.6z M120.5,108.2c-6.7,0-12.1,5.4-12.1,12.1c0,6.7,5.4,12.1,12.1,12.1c6.7,0,12.1-5.4,12.1-12.1  C132.6,113.6,127.2,108.2,120.5,108.2z" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #e8e6e3;"></path><path fill="#fff" d="M191,103.3l-7.6,7.7c-6.2-6.1-12.4-12.3-18.6-18.3c-19.5-18.9-48.9-23.3-73.1-10.9c-5.8,3.1-11.2,6.9-15.9,11.4  c-20.2,19.3-40.2,38.7-59.9,58.4c-2.2,2.4-3.6,5.5-3.8,8.7c-0.4,19.2-0.2,38.5,0,57.7c0,7.3,1.5,8.8,9,8.8c19.7,0,39.5,0,59.2-0.3  c3.4-0.2,6.7-1.5,9.3-3.7c8.3-7.4,16.1-15.4,24.1-23.3c3.8-3.9,10-3.9,13.9-0.1l0.1,0.1c8.1,7.9,16,16,24.3,23.6  c2.4,2.2,5.5,3.6,8.8,3.8c20.1,0.4,40.1,0.3,60.2,0.2c6.1,0,8.2-2.1,8.3-8.2v-58.7c-0.3-2.9-1.5-5.7-3.4-7.9  c-4-4.7-8.7-8.8-13.1-13.3l8-8.6c5.7,5.4,11.2,11,16.3,17c2.4,3.4,3.7,7.5,3.8,11.7c0.3,20.2,0,40.5,0,60.7  c0.8,9.5-6.4,17.9-15.9,18.6c-0.9,0.1-1.8,0.1-2.7,0h-62.2c-6.1,0.3-12-2.1-16.1-6.6c-7.7-7.7-15.6-15.3-23.7-23.3  c-7.9,7.6-15.6,14.9-23.3,22.5c-4.1,4.3-9.8,6.7-15.8,6.6c-20.6,0-41.2,0.3-61.7,0.3c-9.7,1-18.5-6-19.5-15.8  c-0.1-1.2-0.1-2.5,0-3.7v-59.2c-0.2-5.8,2.1-11.4,6.4-15.3c20.4-19.7,40.5-39.7,60.9-59.3c29.4-28.9,76.5-28.9,105.9,0  C179.6,91,185.2,97,191,103.3z" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #e8e6e3;"></path><path fill="#fff" d="M122.4,30.3L143.9,7c4.3-4.7,10.4-7.3,16.7-7h60.2c12.9,0,20.1,7.1,20.1,20.1v58.2c0.2,6.1-2.3,12-6.8,16.2  c-20.1,19.4-40,39.1-60.5,58.5c-29.5,29.4-77.3,29.4-106.7-0.1l-0.3-0.3c-4.9-4.7-9.6-9.9-14.8-15.2l8-7.1l1.1-1.7  c4.7,5.3,9.3,10.8,14,15.8c24.4,25.2,64.6,25.8,89.8,1.4c0.5-0.5,0.9-0.9,1.4-1.4c19.5-18.9,38.9-37.9,58.5-56.8  c3.1-2.7,4.8-6.6,4.7-10.6V20.8c0-7.4-1.5-9.3-8.8-9.3h-59.7c-3.1,0.1-6.1,1.3-8.4,3.4c-8.4,7.6-16.3,15.6-24.4,23.5  c-3.7,4-9.9,4.3-13.9,0.6c-0.2-0.2-0.4-0.4-0.6-0.6c-8-7.8-15.8-15.8-24-23.3c-2.4-2.2-5.5-3.5-8.8-3.8C60.6,11,40.7,11,20.8,11  c-6.7,0-8.6,2-8.6,8.9v56.7c-0.3,4.2,1.4,8.3,4.7,11.1c3.5,2.9,6.5,6.3,10.1,9.7l-8,7.4c-5.5-4.7-10.6-9.7-15.4-15  c-2-3.2-2.9-6.9-2.8-10.7C0.5,59,0.5,39,0.4,18.9C-0.3,9.2,7,0.7,16.7,0c0.9,0,1.9,0,2.8,0h61.8c6-0.3,11.8,2.1,15.8,6.6l22.1,23.6  L122.4,30.3z" data-darkreader-inline-fill="" style="--darkreader-inline-fill: #e8e6e3;"></path></svg>`;

    // Создаем новый элемент на основе строки SVG
    const parser = new DOMParser();
    const svgElement = parser.parseFromString(svgString, "image/svg+xml").documentElement;

    // Устанавливаем правый отступ для SVG элемента
    svgElement.style.marginRight = '10px';

    // Находим элементы, которые мы хотим заменить логотипом
    const btnNavbarElement = document.querySelector('a.btn.btn-navbar[data-toggle="collapse"][data-target=".nav-collapse"]');
    const brandElement = document.querySelector('a.brand[href="/"]');

    // Заменяем элементы на SVG лого, если они найдены
    if (btnNavbarElement && brandElement) {
        // Заменяем элемент btnNavbarElement
        btnNavbarElement.innerHTML = '';
        btnNavbarElement.appendChild(svgElement.cloneNode(true));

        // Заменяем элемент brandElement
        brandElement.innerHTML = '';
        brandElement.appendChild(svgElement.cloneNode(true));
        brandElement.style.position = 'relative';
        brandElement.style.top = '-3px'; // Поднимаем на 3 пикселя вверх
    } else {
        console.error('Target elements not found.');
    }
})();