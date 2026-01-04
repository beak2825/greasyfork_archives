// ==UserScript==
// @name         Hide GL enemies
// @namespace    nexterot
// @version      1.0.1
// @description  Скрыть кнопки нападения на противника других сложностей
// @author       nexterot
// @match        https://www.heroeswm.ru/leader_guild.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      none
// @homepage     https://greasyfork.org/ru/scripts/531834-hide-gl-enemies
// @downloadURL https://update.greasyfork.org/scripts/531834/Hide%20GL%20enemies.user.js
// @updateURL https://update.greasyfork.org/scripts/531834/Hide%20GL%20enemies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){

        var container = document.querySelector("#set_mobile_max_width > div:nth-child(2) > div.s_art.leader_block_min_width > div > div:nth-child(2)");
        var buttons = container.querySelectorAll('.leader_att_button');
        var dangerous = document.querySelector("#set_mobile_max_width > div:nth-child(2) > div.s_art.leader_block_min_width > div > div.leader_ramka");
        dangerous.style = "display: none;";

        var selectHTML = `<select id="gl_mode">
        <option selected value="0">1 ГЛ</option>
        <option value="1">1.2 ГЛ</option>
        <option value="2">1.5 ГЛ</option>
        </select>`;
        container.insertAdjacentHTML(
            "beforebegin",
            selectHTML,
        );

        var mode = GM_getValue('gl_mode', "0");
        setEnabled();

        var selectElement = document.querySelector('#gl_mode');
        selectElement.value = mode;

        selectElement.addEventListener('change', (event) => {
            mode = event.target.value;
            GM_setValue('gl_mode', mode);
            setEnabled();
        });

        function setEnabled() {
            if (buttons.length != 3) return;
            for (var i = 0; i < 3; i++) {
                buttons[i].style = (i == mode) ? "display: block;" : "display: none;";
            }
        }

    }, 300);
})();