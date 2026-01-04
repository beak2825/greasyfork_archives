// ==UserScript==
// @name            mos-kino 2
// @namespace       github.com/a2kolbasov
// @version         0.7
// @description     …
// @author          Aleksandr Kolbasov
// @icon            https://www.google.com/s2/favicons?sz=64&domain=mos-kino.ru
// @match           https://mos-kino.ru/event/*
// @match           https://mos-kino.ru/film/*
// @match           https://mos-kino.ru/schedule/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/478805/mos-kino%202.user.js
// @updateURL https://update.greasyfork.org/scripts/478805/mos-kino%202.meta.js
// ==/UserScript==

/*
 * © 2023-2024 Aleksandr Kolbasov
 */

(() => {
    'use strict';

    const url = new URL(document.URL);

    const cinemas = {
        'Ангара': '/cinema/moskino_angara/',
        'Берёзка': '/cinema/moskino_berezka/',
        'Вымпел': '/cinema/moskino_vympel/',
        'Жуковский': '/cinema/moskino-zhukovskiy-/',
        'Искра': '/cinema/moskino_iskra/',
        'Космос': '/cinema/moskino_kosmos/',
        'Молодёжный': '/cinema/moskino_molodezhnyy/',
        'Музейный': '/cinema/moskino_muzeynyy/',
        'Салют': '/cinema/moskino_salyut/',
        'Сатурн': '/cinema/moskino_saturn/',
        'Сокольники': '/cinema/moskino_sokolniki/',
        'Спутник': '/cinema/moskino_sputnik/',
        'Тула': '/cinema/moskino_tula/',
        'Факел': '/cinema/moskino_fakel/',
        'Кинопарк': '/cinema/moskino_kinopark/',
    };

    if (/^\/film\/[^\?]{1,}/.test(url.pathname)) return film('.schedule-board .title');
    if (/^\/schedule\//.test(url.pathname)) return film('.schedule-board .place-name');
    if (/^\/event\/[^\?]{1,}/.test(url.pathname)) return event();
    return;

    /** @param {string} selector */
    function film(selector) {
        document.querySelectorAll(selector).forEach(cinemaTitleElem => {
            const cinemaTitle = cinemaTitleElem.textContent.trim();
            const cinemaHref = cinemas[cinemaTitle];
            const hrefAttr = cinemaHref ? `href="${cinemaHref}"` : '';
            cinemaTitleElem.innerHTML = `<a ${hrefAttr}>${cinemaTitleElem.innerHTML}</a>`;
        });
    }

    function event() {
        document.querySelectorAll('.info-list .head .label').forEach(titleElem => {
            const cinemaTitleNode = titleElem.childNodes[2];
            const cinemaTitle = cinemaTitleNode.textContent.trim();
            const cinemaHref = cinemas[cinemaTitle];

            const link = document.createElement('a');
            link.textContent = cinemaTitle;
            if (cinemaHref) link.href = cinemaHref;
            cinemaTitleNode.replaceWith(link);
        });
    }
})();
