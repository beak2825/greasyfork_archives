// ==UserScript==
// @name         LolzRB
// @namespace    https://lolz.guru/
// @version      1
// @description  Добавляет кнопку репортов для кураторов.
// @author       Shiny
// @match        https://lolz.guru/*
// @icon         https://lolz.guru/favicon.ico
// @license       MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445296/LolzRB.user.js
// @updateURL https://update.greasyfork.org/scripts/445296/LolzRB.meta.js
// ==/UserScript==

function injectStyle(style) {
    $(document.head).append($(`<style>${style}</style>`));
}

(function() {
    'use strict';
    $(`<li class="navTab ReportButton"><a href="https://lolz.guru/reports/" class="modLink navLink"><div class="counter-container"><img src="https://lolz.guru/styles/header_icons/report.png?2" alt=""></div></a></li>`).appendTo($(".account-links")[0]);
})();