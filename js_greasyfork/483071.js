// ==UserScript==
// @name         Выбрать все права при создании вебхука
// @namespace    http://tampermonkey.net/bitrix
// @description  Хватит тыкать их по одному!
// @version      3.0
// @author       dayanabiliyorum
// @match        https://*/devops/edit/in-hook*
// @match        https://*/devops/edit/application*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitrix24.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483071/%D0%92%D1%8B%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%B2%D1%81%D0%B5%20%D0%BF%D1%80%D0%B0%D0%B2%D0%B0%20%D0%BF%D1%80%D0%B8%20%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B8%20%D0%B2%D0%B5%D0%B1%D1%85%D1%83%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/483071/%D0%92%D1%8B%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D0%B2%D1%81%D0%B5%20%D0%BF%D1%80%D0%B0%D0%B2%D0%B0%20%D0%BF%D1%80%D0%B8%20%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B8%20%D0%B2%D0%B5%D0%B1%D1%85%D1%83%D0%BA%D0%B0.meta.js
// ==/UserScript==

/*
--------История обновлений---------
2.0 Теперь работает на любой домен и на приложения
3.0 Переместил кнопку, теперь она появляется всегда а не через раз
Сделал код более универсальным
*/

(function() {
    'use strict';

    var buttons = document.querySelectorAll('span[data-role="tile-select"], .ui-tile-selector-select-container');

    for (let button of buttons) {
        button.addEventListener('click', function () {
            waitUntilAppears('div[data-role="popup-category-list"]')
                .then((buttonContainer) => {
                console.log(buttonContainer);
                let isCreated = buttonContainer.children['choose-all'];
                if (isCreated == undefined) {
                    const chooseAll = document.createElement("div");
                    chooseAll.setAttribute('id', 'choose-all');
                    chooseAll.classList.add('ui-tile-selector-searcher-sidebar-item', 'ui-tile-selector-searcher-sidebar-item-selected');
                    chooseAll.textContent = 'Выбрать всё';

                    buttonContainer.appendChild(chooseAll);

                    chooseAll.addEventListener('click', function (event) {
                        console.log(event.target);

                        var container = event.target.closest('.ui-tile-selector-searcher-inner').children[0].children[0];

                        console.log(container);

                        for (let child of container.children) {
                            child.click();
                        }
                    });
                }
            });
        });
    }
})();

function waitUntilAppears(selector)
{
    return new Promise((resolve, reject) => {
        let elements = document.querySelectorAll(selector);

        if (elements.length == 0) {
            delay(200).then(() => resolve(waitUntilAppears(selector)));
        }

        console.log(elements);

        let element = elements[elements.length - 1];

        delay(200).then(() => resolve(element))
    });
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}