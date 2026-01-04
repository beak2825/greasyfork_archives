// ==UserScript==
// @name         Kochi University KULAS TimeTable Hint
// @namespace    https://kulas.kochi-u.ac.jp/portal/young
// @version      0.2
// @description  Show Class Time on Hover
// @author       Thomas Young
// @license MIT
// @match        https://kulas.kochi-u.ac.jp/portal/TimeTable
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kochi-u.ac.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533584/Kochi%20University%20KULAS%20TimeTable%20Hint.user.js
// @updateURL https://update.greasyfork.org/scripts/533584/Kochi%20University%20KULAS%20TimeTable%20Hint.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timeMap = {
        1: "08:50 - 10:20",
        2: "10:30 - 12:00",
        // lunch break 12:00 - 13:10
        3: "13:10 - 14:40",
        4: "14:50 - 16:20",
        5: "16:30 - 18:00",
        6: "18:10 - 19:40",
        7: "19:50 - 21:20",
        8: "21:30 - 23:00"
    };

    const style = document.createElement('style');
    style.textContent = `
        #custom-tooltip {
            text-align: left;
            color: #333;
            background: #fff;
            position: absolute;
            z-index: 100;
            padding: 4px 10px;
            border: 1px solid #12887d;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);



    const tooltip = document.createElement('div');
    tooltip.id = 'custom-tooltip';
    tooltip.style.zIndex = 9999;
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    function attachTooltip() {
        const listItems = document.querySelectorAll("#times ol li.time-head");
        if (listItems.length === 0) return false;

        listItems.forEach((li, index) => {
            const span = li.querySelector('span');
            const period = index + 1;
            const time = timeMap[period];
            if (!time) return;

            li.addEventListener('mouseenter', (e) => {
                tooltip.textContent = time;
                tooltip.style.display = 'block';

                const rect = li.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight}px`;
            });

            li.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        });

        return true;
    }

    const interval = setInterval(() => {
        if (attachTooltip()) {
            clearInterval(interval);
        }
    }, 500);
})();