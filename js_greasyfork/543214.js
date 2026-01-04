// ==UserScript==
// @name         Скрыть окно с подарками
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Закрывает окно с подарком
// @author       Jango_Bimba
// @match        https://mangalib.me/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangalib.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543214/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%BE%D0%BA%D0%BD%D0%BE%20%D1%81%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%80%D0%BA%D0%B0%D0%BC%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/543214/%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%BE%D0%BA%D0%BD%D0%BE%20%D1%81%20%D0%BF%D0%BE%D0%B4%D0%B0%D1%80%D0%BA%D0%B0%D0%BC%D0%B8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeGiftPopup() {
        const divs = document.querySelectorAll('div');
        for (let div of divs) {
            const text = div.textContent;
            if (text && text.includes('Вам доступен') && text.includes('подарок')) {
                div.remove();
            }
        }
    }

    removeGiftPopup();

    document.addEventListener('DOMContentLoaded', removeGiftPopup);

    new MutationObserver(removeGiftPopup).observe(document.body, {
        childList: true,
        subtree: true
    });
})();