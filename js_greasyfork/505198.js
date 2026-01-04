// ==UserScript==
// @name         remove "Ваши темы" from profile 
// @namespace    http://tampermonkey.net/
// @version      v1
// @description  Удаляет блок 'Ваши темы' с профиля пользователя
// @license      MIT
// @author       molihan (extra)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @match        *://*/*
// @grant        none
// @namespace    https://greasyfork.org/ru/users/1187197
// @downloadURL https://update.greasyfork.org/scripts/505198/remove%20%22%D0%92%D0%B0%D1%88%D0%B8%20%D1%82%D0%B5%D0%BC%D1%8B%22%20from%20profile.user.js
// @updateURL https://update.greasyfork.org/scripts/505198/remove%20%22%D0%92%D0%B0%D1%88%D0%B8%20%D1%82%D0%B5%D0%BC%D1%8B%22%20from%20profile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        var profileThreadsBlock = document.querySelector('.profile_threads_block');
        if (profileThreadsBlock) {
            profileThreadsBlock.remove();
        }
    });
})();