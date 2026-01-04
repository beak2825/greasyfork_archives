// ==UserScript==
// @name         Save and Get
// @namespace    none
// @version      0.1
// @description  Yo saveData, getData.
// @author       no
// @match        *://*/*
// @grant        unsafeWindow
// ==/UserScript==
(() => {
    'use strict';

    unsafeWindow.saveData = (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    };

    unsafeWindow.getData = (keysArray) => {
        const data = {};
        keysArray.forEach(key => {
            try {
                const value = localStorage.getItem(key);
                if (value !== null) {
                    data[key] = JSON.parse(value);
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        });
        return data;
    };
})();
