// ==UserScript==
// @name         4chan European Date Format Hook
// @namespace    https://4chan.org/
// @version      2.0
// @description  Forces DD/MM/YYYY format on 4chan by overriding their internal date function
// @match        *://boards.4chan.org/*
// @match        *://boards.4channel.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541802/4chan%20European%20Date%20Format%20Hook.user.js
// @updateURL https://update.greasyfork.org/scripts/541802/4chan%20European%20Date%20Format%20Hook.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitFor4chan = setInterval(() => {
        if (typeof window.formatDate === 'function') {
            clearInterval(waitFor4chan);

            // Replace 4chan's internal date formatter
            const origFormatDate = window.formatDate;
            window.formatDate = function (date) {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                const weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()];
                const time = [
                    String(date.getHours()).padStart(2, '0'),
                    String(date.getMinutes()).padStart(2, '0'),
                    String(date.getSeconds()).padStart(2, '0')
                ].join(':');

                return `${day}/${month}/${year}(${weekday}) ${time}`;
            };

            // Trigger redraw (optional but helps on some boards)
            if (window.Main && typeof window.Main.init === 'function') {
                window.Main.init();
            }
        }
    }, 100);
})();