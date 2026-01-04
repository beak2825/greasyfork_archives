// ==UserScript==
// @name         нет тасков
// @namespace    no tasks
// @version      1.1
// @description  обновление страницы каждых 10 секунд
// @author       ZV
// @match        https://tngadmin.triplenext.net/Admin/MyCurrentTask
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494087/%D0%BD%D0%B5%D1%82%20%D1%82%D0%B0%D1%81%D0%BA%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/494087/%D0%BD%D0%B5%D1%82%20%D1%82%D0%B0%D1%81%D0%BA%D0%BE%D0%B2.meta.js
// ==/UserScript==

// Повторяем проверку и обновление страницы каждые 10 секунд
setInterval(function() {
    // Проверяем, есть ли на странице текст "There are no support tasks for user"
    if (document.body.innerText.includes("There are no support tasks for user")) {
        console.log('Требуется обновление страницы');
        // Обновляем страницу
        location.reload();
    }
}, 10000); // 10000 миллисекунд = 10 секунд
