// ==UserScript==
// @name         BlackRussia Forum Auto-Like (Profile Posts)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Автоматически ставит лайки на сообщения профиля на форуме Black Russia
// @author       ChatGPT
// @match        https://forum.blackrussia.online/whats-new/profile-posts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543321/BlackRussia%20Forum%20Auto-Like%20%28Profile%20Posts%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543321/BlackRussia%20Forum%20Auto-Like%20%28Profile%20Posts%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickAllLikeButtons() {
        const likeButtons = document.querySelectorAll('a.js-likeButton');

        likeButtons.forEach(button => {
            const reacted = button.classList.contains('has-reaction');
            if (!reacted) {
                console.log('❤️ Ставлю лайк на сообщение...');
                button.click();
            }
        });
    }

    // Подождать загрузку страницы
    window.addEventListener('load', () => {
        setTimeout(clickAllLikeButtons, 1500); // Немного подождать, чтобы всё точно подгрузилось
    });
})();
