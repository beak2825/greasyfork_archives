// ==UserScript==
// @name               Old reddit format date in 24 hours
// @namespace          https://greasyfork.org/users/821661
// @match              https://www.reddit.com/*
// @match              https://old.reddit.com/*
// @grant              none
// @version            1.0
// @author             hdyzen
// @description        Format date in 24 hours for reddit post
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/493552/Old%20reddit%20format%20date%20in%2024%20hours.user.js
// @updateURL https://update.greasyfork.org/scripts/493552/Old%20reddit%20format%20date%20in%2024%20hours.meta.js
// ==/UserScript==
'use strict';

const observer = new MutationObserver(mutations => {
    const times = document.querySelectorAll('time[datetime]:not(:has(+ span.time-24))');
    if (times.length) {
        times.forEach(time => {
            time.setAttribute('hidden', '');
            time.insertAdjacentHTML('afterend', `<span class="time-24" >${time.classList.contains('edited-timestamp') ? 'edited:' : ''}${new Date(time.dateTime).toLocaleString()}</span>`);
        });
    }
});

observer.observe(document.body, { childList: true });
