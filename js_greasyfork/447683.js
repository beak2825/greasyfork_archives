// ==UserScript==
// @name         CTFtime sort events by points
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sort events by points on CTFtime team page.
// @author       SuperFashi
// @match        https://ctftime.org/team/*
// @icon         https://pbs.twimg.com/profile_images/2189766987/ctftime-logo-avatar_400x400.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447683/CTFtime%20sort%20events%20by%20points.user.js
// @updateURL https://update.greasyfork.org/scripts/447683/CTFtime%20sort%20events%20by%20points.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tables = document.querySelectorAll('div[id^="rating_"] table');
    tables.forEach(tab => {
        const events = [...tab.querySelectorAll('tr')].slice(1);
        events.sort((a, b) => parseFloat(b.lastChild.innerText) - parseFloat(a.lastChild.innerText));
        events.forEach((e, i) => {
            if (i < 10) e.style.backgroundColor = 'beige';
            tab.appendChild(e)
        });
    });
})();