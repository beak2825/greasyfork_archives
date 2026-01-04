// ==UserScript==
// @name         Planner Cleanup v4
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Remove specific fake tasks by name without freezing
// @match        https://app--school-prep-os-3b4d546f.base44.app/Planner*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546414/Planner%20Cleanup%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/546414/Planner%20Cleanup%20v4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🎯 List of fake task names to remove
    const fakeTasks = [
        "Complete Math Homework",
        "Science Lab Report",
        "History Essay",
        "Read Chapter 8"
    ];

    // 🧹 Cleanup logic — removes matching tasks
    const cleanUp = () => {
        const allElements = document.querySelectorAll('*');
        let removed = 0;

        allElements.forEach(el => {
            const text = el.textContent.trim();
            if (fakeTasks.includes(text)) {
                el.remove();
                removed++;
            }
        });

        if (removed > 0) {
            console.log(`💥 Removed ${removed} fake task(s)`);
        }
    };

    // 🕒 Run once after DOM is ready
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(cleanUp, 500);
    });

    // 🔁 MutationObserver with throttle
    const observer = new MutationObserver(() => {
        clearTimeout(window.__plannerThrottle);
        window.__plannerThrottle = setTimeout(cleanUp, 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
