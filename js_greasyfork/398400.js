// ==UserScript==
// @name         timarques-configs
// @namespace    https://grepolis.com
// @match		 https://*.grepolis.com/game/*
// @version      1.0
// @description  Timarques's Configs
// @author       Tiago Marques
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398400/timarques-configs.user.js
// @updateURL https://update.greasyfork.org/scripts/398400/timarques-configs.meta.js
// ==/UserScript==

const farmTowns = [11836, 11595, 11658, 11784, 10831, 7984, 6479, 3420];
const farmTownsColor = 212121;

//Inative Players flag color
(()=> {
    const css = farmTowns.map(farmTown => (`
        #town_flag_${farmTown}, .info_tab_content_${farmTown} .flag_big { background-color: #${farmTownsColor}!important; }
        #mini_t${farmTown} { color: #${farmTownsColor}!important }
    `)).join(' ');

    const style = document.createElement('style');

    style.type = 'text/css';
    style.id = 'timarques_styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
})();