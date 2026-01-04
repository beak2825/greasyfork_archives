// ==UserScript==
// @name         BLACK | Скрипт для форума by C. Stoyn
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Специально для Черной России BLACK RUSSIA | BLACK
// @author       C. Stoyn
// @match        https://forum.blackrussia.online/*
// @icon         https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @collaborator C. Stoyn
// @icon    https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32382-hamburger-icon.png
// @downloadURL https://update.greasyfork.org/scripts/522725/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20C%20Stoyn.user.js
// @updateURL https://update.greasyfork.org/scripts/522725/BLACK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20C%20Stoyn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    'esversion 6';

    $(document).ready(() => {
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        $('.p-body').before(
            `<script src="https://app.embed.im/snow.js" defer></script>`,
        );
    });

})();