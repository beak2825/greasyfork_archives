// ==UserScript==
// @name         Auto_tactic
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  auto tactic for hwm
// @author       You
// @match        https://my.lordswm.com/war*
// @include      https://my.lordswm.com/war*
// @match        https://my.lordswm.com/pvp_guild.php*
// @include      https://my.lordswm.com/pvp_guild.php*
// @match        https://my.lordswm.com/home.php*
// @include      https://my.lordswm.com/home.php*
// @match        https://my.lordswm.com/home.php*
// @include      https://my.lordswm.com/home.php*
// @match        https://www.heroeswm.ru/war*
// @include      https://www.heroeswm.ru/war*
// @match        https://www.heroeswm.ru/pvp_guild.php*
// @include      https://www.heroeswm.ru/pvp_guild.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508117/Auto_tactic.user.js
// @updateURL https://update.greasyfork.org/scripts/508117/Auto_tactic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const links = ['https://my.lordswm.com', 'https://www.heroeswm.ru'];
    const link = location.href.slice(0, 22) === 'https://my.lordswm.com' ? links[0] : links[1];

    if (location.href === `${link}/pvp_guild.php`) {
        const inputs = [...document.getElementsByTagName('input')];
        const duel = inputs.filter(el => el.value.includes('Вступить в дуэли!'));
        duel[0].click();
    }

if (location.href.includes(`${link}/home.php`)) {
        location.href = `${link}/pvp_guild.php`;
    }


    window.addEventListener("load", () => {
        const ins = document.getElementById('make_ins');
        const conf_ins = document.getElementById('confirm_ins');

        ins.dispatchEvent(new Event('mouseup'));
        setTimeout(() => {
            conf_ins.dispatchEvent(new Event('mouseup'))
        }, 6000);

        setTimeout(() => {document.getElementById('fastbattle_on').dispatchEvent(new Event('mouseup'));}, 9000)

        setInterval(() => {
            if (document.getElementById('win_BattleResult').style.display !== 'none') {
                document.getElementById('btn_continue_WatchBattle').dispatchEvent(new Event('mouseup'));
            }
        }, 60000)
    });

})();