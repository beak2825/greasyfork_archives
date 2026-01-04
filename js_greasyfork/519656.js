// ==UserScript==
// @name         KHABAROVSK | Быстрый доступ
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Быстрый доступ для сервера KHABAROVSK
// @author       Luis Moretti
// @match        https://forum.blackrussia.online/*
// @icon         https://i.postimg.cc/dVF25LZY/JS.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519656/KHABAROVSK%20%7C%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/519656/KHABAROVSK%20%7C%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bg = document.createElement('div');
    bg.style = "background: #42464d;  border-bottom: 1px solid rgba(255, 255, 255, 0.12);";
    const bgButtons = document.createElement('div');
    bg.append(bgButtons);
    bgButtons.style = "margin-left: auto; margin-right: auto; width: 1200px; font-size: 1.3rem; color: #b5b9c0; transition: ease-in .15s all; padding-top: 3px; padding-bottom: 3px; display: flex; justify-content: center;"
    document.querySelector('.p-navSticky').append(bg);

    function createbutton(name, link) {
        const button = document.createElement("button");
        button.classList.add('button')
        button.textContent = name
        button.style = `cursor: pointer; margin-right: 6px; top: -2px; background-color: #212428; width: 100%; border-color: #33383e; border: none; box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);`
        button.addEventListener("click", () => {
            window.location.href = link;
        });
        bgButtons.append(button);
    }
    createbutton('Админ-раздел', 'https://forum.blackrussia.online/forums/%D0%90%D0%B4%D0%BC%D0%B8%D0%BD-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.2180/');
    createbutton('Агенты Поддержки', 'https://forum.blackrussia.online/forums/%D0%A0%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-%D0%B4%D0%BB%D1%8F-%D0%B0%D0%B3%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.2188/');
    createbutton('Лидерский раздел', 'https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.2187/');
    createbutton('Госс. организации', 'https://forum.blackrussia.online/forums/%D0%93%D0%BE%D1%81%D1%83%D0%B4%D0%B0%D1%80%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B5-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.2181/');
    createbutton('Крайм организации', 'https://forum.blackrussia.online/forums/%D0%9A%D1%80%D0%B8%D0%BC%D0%B8%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.2182/');
    createbutton('Жалобы', 'https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.2184/');
    createbutton('Заявки на АП', 'https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3155/');
    createbutton('Заявки на ЛД', 'https://forum.blackrussia.online/forums/%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B.3156/');

    function countElements() {
        const elements1 = document.querySelectorAll('.structItem.structItem--thread.is-prefix14');
        const elements2 = document.querySelectorAll('.structItem.structItem--thread.is-prefix2');

        const count1 = elements1.length;
        const count2 = elements2.length;

        const filterBar = document.querySelector('.filterBar');

        if (filterBar) {
            const countElement1 = document.createElement('div');
            countElement1.className = 'button';
            countElement1.style = "cursor: pointer; margin-right: 6px; top: -2px; background-color: #212428; border-color: #33383e; border: none; box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);"
            countElement1.textContent = 'Темы в ожидании: ' + count1;

            filterBar.insertAdjacentElement('beforebegin', countElement1);

            const countElement2 = document.createElement('div');
            countElement2.className = 'button';
            countElement2.style = "cursor: pointer; margin-right: 6px; top: -2px; background-color: #212428; border-color: #33383e; border: none; box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2);"
            countElement2.textContent = 'Темы на рассмотрении: ' + count2;

            filterBar.insertAdjacentElement('beforebegin', countElement2);
        }
    }

    countElements();


})();
