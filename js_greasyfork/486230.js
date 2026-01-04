// ==UserScript==
// @name         Кнопочки для астрала
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ну кнопочки чо
// @author       Fenion
// @match        https://anichat.ru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anichat.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486230/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BE%D1%87%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%B0%D1%81%D1%82%D1%80%D0%B0%D0%BB%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/486230/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BE%D1%87%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%B0%D1%81%D1%82%D1%80%D0%B0%D0%BB%D0%B0.meta.js
// ==/UserScript==

const process = (cmd) => {
    window.processChatCommand(cmd);
    document.querySelector('.astral_controls').remove();
}

const showMenu = () => {
    const test = document.querySelector('.astral_controls');
    if (test) return test.remove();
    const menu = document.createElement('div');
    const btnRect = document.querySelector('.astral_btn').getBoundingClientRect();
    menu.className = 'log_menu astral_controls add_shadow';
    menu.style = `width: 230px; height: auto; position: absolute; left: ${btnRect.left - 50}px; top: ${btnRect.top - 70}px; z-index: 9999;`;
    const withPlayer = document.createElement('div');
    const withBot = document.createElement('div');
    withPlayer.innerText = 'С игроком';
    withPlayer.className = 'fmenu_item fmenut log_menu_item log_report';
    withPlayer.onclick = () => process('/astral_start');
    withBot.innerText = 'С ботом';
    withBot.className = 'fmenu_item fmenut log_menu_item log_report';
    withBot.onclick = () => process('/astral_bot');
    menu.appendChild(withPlayer);
    menu.appendChild(withBot);
    document.body.appendChild(menu);
}

const initAstralControls = () => {
    const inputs = document.body.querySelector('#main_input_box');
    const controls = document.createElement('div');
    controls.innerHTML = '<i class="fa fa-play-circle" aria-hidden="true"></i>';
    controls.className = 'input_item main_item base_main astral_btn';
    controls.onclick = showMenu;
    inputs.before(controls);
}

(function() {
    'use strict';

    initAstralControls();
})();