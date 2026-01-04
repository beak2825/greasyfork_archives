// ==UserScript==
// @name         Поставить бота во все ОЛ
// @namespace    http://tampermonkey.net/bitrix
// @description  Раз битрикс не смог, придётся мне!
// @version      1.0
// @author       dayanabiliyorum
// @match        https://*/contact_center/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitrix24.ru
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532416/%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D1%8C%20%D0%B1%D0%BE%D1%82%D0%B0%20%D0%B2%D0%BE%20%D0%B2%D1%81%D0%B5%20%D0%9E%D0%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/532416/%D0%9F%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%D1%8C%20%D0%B1%D0%BE%D1%82%D0%B0%20%D0%B2%D0%BE%20%D0%B2%D1%81%D0%B5%20%D0%9E%D0%9B.meta.js
// ==/UserScript==

/*
--------История обновлений---------

*/

(function() {
    'use strict';
    waitUntilAppears('#bx-connector-user-list')
        .then(() => {
        let isActive = GM_getValue('active');
        let removeActive = GM_getValue('removeActive');

        const button = document.createElement("button");
        button.setAttribute('id', 'setBot');
        button.classList.add('ui-btn', 'ui-btn-light-border');
        button.textContent = 'Выставить бота во всех ОЛ';

        const button2 = document.createElement("button");
        button2.setAttribute('id', 'setBot');
        button2.classList.add('ui-btn', 'ui-btn-light-border');
        button2.textContent = 'Убрать бота во всех ОЛ';

        button.addEventListener('click', function () {
            GM_setValue('active', true);
            let key = GM_getValue('key');
            if (key == undefined) {
                key = -1;
            }

            let items = document.querySelector('#popup-window-content-menu-popup-imconnector-lines-list .menu-popup-items').children;

            key++
            GM_setValue('key', key);
            let item = items[key];

            if (item != undefined && item.className != 'popup-window-delimiter' && item.title != 'Создать открытую линию') {
                click(item);
            }

            delay(6000).then(() => {
                GM_setValue('active', false);
                GM_setValue('key', -1);
            })
        });

        button2.addEventListener('click', function () {
            GM_setValue('removeActive', true);
            let key = GM_getValue('key');
            if (key == undefined) {
                key = -1;
            }

            let items = document.querySelector('#popup-window-content-menu-popup-imconnector-lines-list .menu-popup-items').children;

            key++
            GM_setValue('key', key);
            let item = items[key];

            if (item != undefined && item.className != 'popup-window-delimiter' && item.title != 'Создать открытую линию') {
                click(item);
            }

            delay(6000).then(() => {
                GM_setValue('removeActive', false);
                GM_setValue('key', -1);
            })
        });

        if (isActive == true) {
            click(document.querySelector('.imopenlines-settings-button'))
            .then(() => delay(3000))
            .then(() => click(button))
        }

        if (removeActive == true) {
            click(document.querySelector('.imopenlines-settings-button'))
            .then(() => delay(3000))
            .then(() => click(button2))
        }

        document.querySelector('.imconnector-field-control-box').after(button2);
        document.querySelector('.imconnector-field-control-box').after(button);
    })

    waitUntilAppears('#sidepanelMenu')
        .then((menu) => {
        let isActive = GM_getValue('active');
        let removeActive = GM_getValue('removeActive');

        if (isActive == true) {
            click(menu.children[5].children[0])
            .then(() => {
                let blockClass = document.querySelector('#imol_welcome_bot_block').className;

                if (blockClass == 'invisible') {
                    document.querySelector('#imol_welcome_bot').click();
                    document.querySelector('select[name="CONFIG[WELCOME_BOT_TIME]"]').value = 0;
                    document.querySelector('select[name="CONFIG[WELCOME_BOT_LEFT]"]').value = 'close';
                    click(document.querySelector('#ui-button-panel-save'));
                } else {
                    click(document.querySelector('#ui-button-panel-save'));
                }
            })
        }

        if (removeActive == true) {
            click(menu.children[5].children[0])
            .then(() => {
                let blockClass = document.querySelector('#imol_welcome_bot_block').className;

                if (blockClass != 'invisible') {
                    document.querySelector('#imol_welcome_bot').click();
                    click(document.querySelector('#ui-button-panel-save'));
                } else {
                    click(document.querySelector('#ui-button-panel-save'));
                }
            })
        }
    })
})();

function waitUntilAppears(selector)
{
    return new Promise((resolve, reject) => {
        let elements = document.querySelectorAll(selector);

        if (elements.length == 0) {
            delay(200).then(() => resolve(waitUntilAppears(selector)));
        }

        let element = elements[elements.length - 1];

        delay(200).then(() => resolve(element))
    });
}

function click(item)
{
    return new Promise((resolve, reject) => {
        item.click()
        resolve()
    });
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}