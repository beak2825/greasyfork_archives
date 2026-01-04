// ==UserScript==
// @name         AvoidAddictiontoBangumi
// @namespace    https://jirehlov.com/
// @version      0.4
// @description  Track visits to bangumi domains' root directory and alert after a configurable number of visits in a day
// @author       Jirehlov
// @match        https://bgm.tv/
// @match        https://bangumi.tv/
// @match        https://chii.in/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500690/AvoidAddictiontoBangumi.user.js
// @updateURL https://update.greasyfork.org/scripts/500690/AvoidAddictiontoBangumi.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const keyVisits = 'visits_bangumi';
    const keyLastReset = 'last_reset_bangumi';
    const keyThreshold = 'threshold_bangumi';
    const defaultThreshold = 20;
    function getThreshold() {
        return parseInt(localStorage.getItem(keyThreshold)) || defaultThreshold;
    }
    function setThreshold(value) {
        localStorage.setItem(keyThreshold, value);
    }
    window.setVisitThreshold = setThreshold;
    const currentDate = new Date().toLocaleDateString().split('/').join('-');
    let visits = parseInt(localStorage.getItem(keyVisits)) || 0;
    let lastReset = localStorage.getItem(keyLastReset) || '';
    if (lastReset !== currentDate) {
        visits = 0;
        lastReset = currentDate;
        localStorage.setItem(keyVisits, visits);
        localStorage.setItem(keyLastReset, lastReset);
    }
    visits += 1;
    localStorage.setItem(keyVisits, visits);
    if (visits > getThreshold()) {
        alert(`今天已经访问超过${getThreshold()}次了，不要沉迷哦~`);
    }
})();
