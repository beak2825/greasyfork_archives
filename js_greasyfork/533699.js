// ==UserScript==
// @name         Kochi University KULAS Calendar Class Time Period
// @namespace    https://kulas.kochi-u.ac.jp/young
// @version      0.1
// @description  Add Class Time Period to Calendar Tooltips
// @author       Thomas Young
// @license      MIT
// @match        https://kulas.kochi-u.ac.jp/portal/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kochi-u.ac.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533699/Kochi%20University%20KULAS%20Calendar%20Class%20Time%20Period.user.js
// @updateURL https://update.greasyfork.org/scripts/533699/Kochi%20University%20KULAS%20Calendar%20Class%20Time%20Period.meta.js
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

    const observer = new MutationObserver(() => {
        const tooltip = document.getElementById("tooltip");
        if (!tooltip) return;

        const lis = tooltip.querySelectorAll("li");
        lis.forEach(li => {
            const match = li.textContent.match(/^時限：(\d)$/);
            if (match) {
                const time = timeMap[match[1]];
                if (time && !li.textContent.includes("〜")) {
                    li.textContent += `（${time}）`;
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();