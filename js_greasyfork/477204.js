// ==UserScript==
// @name         MCKO Autotest
// @namespace    https://greasyfork.org/users/506633
// @version      0.2
// @description  Time saving
// @author       pronin
// @match        https://n06.mcko.ru/test/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mcko.ru
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/477204/MCKO%20Autotest.user.js
// @updateURL https://update.greasyfork.org/scripts/477204/MCKO%20Autotest.meta.js
// ==/UserScript==


if (localStorage.getItem("count") == 1){
    localStorage.setItem("count", 0);
    window.close();
}

if (document.querySelector('h3').textContent == 'Вход в систему на сервере n06.mcko.ru: ') {
    document.getElementById('login').value = 1793;
    document.getElementById('password').value = 60653;
    document.getElementsByTagName('button')[0].click();
}

if (document.querySelector('h3').textContent == 'Шаг 2 - Идентификация тестируемого') {
    document.getElementsByTagName('button')[0].click();
}

if (document.querySelectorAll('h1')[3].textContent == 'Нагрузочное тестирование завершено.') {
    localStorage.setItem("count", 1);
    document.getElementById('exit_button').submit()
}