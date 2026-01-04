// ==UserScript==
// @name         Автоответ на секретный вопрос
// @version      0.1
// @description  Остальные полезные скрипты - https://zelenka.guru/threads/5310268/
// @author       Jack
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.guru
// @grant        none
// @namespace https://greasyfork.org/users/1237311
// @downloadURL https://update.greasyfork.org/scripts/483682/%D0%90%D0%B2%D1%82%D0%BE%D0%BE%D1%82%D0%B2%D0%B5%D1%82%20%D0%BD%D0%B0%20%D1%81%D0%B5%D0%BA%D1%80%D0%B5%D1%82%D0%BD%D1%8B%D0%B9%20%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/483682/%D0%90%D0%B2%D1%82%D0%BE%D0%BE%D1%82%D0%B2%D0%B5%D1%82%20%D0%BD%D0%B0%20%D1%81%D0%B5%D0%BA%D1%80%D0%B5%D1%82%D0%BD%D1%8B%D0%B9%20%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81.meta.js
// ==/UserScript==

const secret_answer = '15619740'

let observer = new MutationObserver(function(mutations) {
    var element = document.querySelector('input[name="secret_answer"]');

    if (typeof secret_answer !== 'undefined' && element != null) {
        element.value = secret_answer;
        element.type = 'password';
        observer.disconnect();
    }
});

observer.observe(document.body, { childList: true, subtree: true });