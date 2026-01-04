// ==UserScript==
// @name         AAO-Kategorien ausblenden
// @namespace    leeSalami.lss
// @version      1.0
// @license      MIT
// @description  Blendet die AAO-Kategorien aus, bis eine ausgewählt wurde
// @author       leeSalami
// @match        https://www.leitstellenspiel.de/missions/*
// @match        https://polizei.leitstellenspiel.de/missions/*
// @downloadURL https://update.greasyfork.org/scripts/483894/AAO-Kategorien%20ausblenden.user.js
// @updateURL https://update.greasyfork.org/scripts/483894/AAO-Kategorien%20ausblenden.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const aaoTabs = document.getElementById('aao-tabs');

    if (!aaoTabs) {
        return;
    }

    addEventListener('DOMContentLoaded', () => {
        aaoTabs.querySelector('.active')?.classList?.remove('active');
        aaoTabs.parentElement.querySelector('[id^=aao_category_].active')?.classList?.remove('active', 'in');
    });
})();
