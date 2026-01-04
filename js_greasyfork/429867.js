// ==UserScript==
// @name         Удаление рекламных блоков в вк
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Удаляет все рекламу из vk.com, а также группы, которые рекомендуют ваши друзья и возможных знакомых. Чтобы убрать 2 последних пункта, удалите последние два элемента массива elems
// @author       Artem Ugryumov
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?domain=vk.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429867/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%BD%D1%8B%D1%85%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%BE%D0%B2%20%D0%B2%20%D0%B2%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/429867/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%BD%D1%8B%D1%85%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%BE%D0%B2%20%D0%B2%20%D0%B2%D0%BA.meta.js
// ==/UserScript==
// website_author: https://ugryumov.com

(function() {
    'use strict';
    let elems = [
        '#ads_left', // столбик рекламы слева
        '._ads_block_data_w', // рекламные блоки в новостях
        '.feed_groups_recomm_friends', // группы, которые рекомендуют ваши друзья
        '.page_block.feed_friends_recomm', // возможно вы знакомы
        '.page_block.apps_feedRightAppsBlock.apps_feedRightAppsBlock_single_app.apps_feedRightAppsBlock_single_app--' // Удаление блока рекламы игры, в которую играют ваши друзья
    ];

    setInterval(() => {
        elems.forEach(elem => {
            if (document.querySelector(elem)) {
                elem = document.querySelectorAll(elem);

                for (let i=0; i<elem.length;i++) {
                    elem[i].remove();
                }
            }
        })
    },1000)

})();