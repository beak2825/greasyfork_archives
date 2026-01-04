// ==UserScript==
// @name         IMDb Actor Age
// @namespace    1569049274
// @version      0.1
// @description  Display the actor's age next to birth date. Also Works on the mobile version of IMDb.
// @author       Jenie
// @match        https://www.imdb.com/name/*
// @match        https://m.imdb.com/name/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390355/IMDb%20Actor%20Age.user.js
// @updateURL https://update.greasyfork.org/scripts/390355/IMDb%20Actor%20Age.meta.js
// ==/UserScript==

(() => {
    function start() {
        const timeTag = document.querySelector('#name-born-info > time[datetime]') || document.querySelector('.media-body > span > time[datetime]');
        if (!timeTag || document.getElementById('name-death-info') || (location.host === 'm.imdb.com' && document.querySelector('.media-body').textContent.includes('Died:'))) return;
        const age = Math.floor((new Date() - new Date(timeTag.dateTime)) / 31536000000);
        timeTag.insertAdjacentText('afterend', `(age ${age})`);
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', start) : start();
})();
