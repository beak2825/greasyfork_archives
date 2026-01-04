// ==UserScript==
// @name         Url to Pack or Text
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  try to take over the world!
// @author       Yan Gordobin
// @match        https://lcrm.xyz/packs*
// @match        https://lcrm.xyz/texts*
// @exclude      https://lcrm.xyz/texts/*
// @exclude      https://lcrm.xyz/packs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373631/Url%20to%20Pack%20or%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/373631/Url%20to%20Pack%20or%20Text.meta.js
// ==/UserScript==

(function() {
    function createUrlList(elem) {
        for (let i = 0; i < elem.length; i++) {
            let links = elem[i].getElementsByTagName('a');
            let getUrl = function (e) {
                for (let i = 0; i < e.length; i++) {
                    if (e[i].innerHTML === 'Details') {
                        return e[i].href;
                    }
                }
            };
            allUrl[i] = getUrl(links);
        }
    }

    function copy(str) {
        let tmp = document.createElement('INPUT'), // Создаём новый текстовой input
            focus = document.activeElement; // Получаем ссылку на элемент в фокусе (чтобы не терять фокус)

        tmp.value = str; // Временному input вставляем текст для копирования

        document.body.appendChild(tmp); // Вставляем input в DOM
        tmp.select(); // Выделяем весь текст в input
        document.execCommand('copy'); // Магия! Копирует в буфер выделенный текст (см. команду выше)
        document.body.removeChild(tmp); // Удаляем временный input
        focus.focus(); // Возвращаем фокус туда, где был
    }


    function addButton(elem) {
        for (let i = 0; i < elem.length; i++) {
            let newElem = document.createElement('button');
            newElem.innerHTML = 'Copy URL';
            newElem.classList.add("btn", "btn-info");
            newElem.id = 'btn-copy';
            newElem.value = allUrl[i];
            elem[i].appendChild(newElem);
        }
    }

    var allUrl = [];
    var allParams = document.querySelectorAll('.list-group');


    createUrlList(allParams);
    addButton(allParams);

    document.onclick = function (event) {
        let elem = event.target;
        if (elem.id === 'btn-copy') {
            if (elem.value) {
                try {
                    copy(elem.value);

                    elem.innerHTML = 'Скопировано!';
                } catch (e) {
                    elem.innerHTML = 'Ошибка!';
                }
            }
        } else console.log('не тот элемент');
    };
})();