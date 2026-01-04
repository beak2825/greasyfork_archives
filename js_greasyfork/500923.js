// ==UserScript==
// @name         TM基100批发
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  谨防诈骗！
// @match        https://trophymanager.com/youth-development/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500923/TM%E5%9F%BA100%E6%89%B9%E5%8F%91.user.js
// @updateURL https://update.greasyfork.org/scripts/500923/TM%E5%9F%BA100%E6%89%B9%E5%8F%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide elements
    function hideHireButtons() {
        const buttons = document.querySelectorAll('span.button.hire_button');
        buttons.forEach(button => {
            button.style.display = 'none';
        });
    }

    function modifyMegastarElements() {
        const divs = document.querySelectorAll('div.rec_stars');
        divs.forEach(div => {
            const spans = div.querySelectorAll('span.megastar');
            spans.forEach(span => {
                span.className = 'megastar recomendation';
            });
        });
    }

    function modifyTdElements() {
        const tds = document.querySelectorAll('td');
        tds.forEach(td => {
            if (!isNaN(td.textContent.trim()) && td.textContent.trim() !== '') {
                td.innerHTML = '<img src="/pics/star.png" alt="20" title="20">';
            }
        });
    }
    modifyMegastarElements()
    hideHireButtons()
    modifyTdElements()

    // Optionally, observe the DOM for changes and hide new buttons
    const observer1 = new MutationObserver(hideHireButtons);
    observer1.observe(document.body, { childList: true, subtree: true });
    const observer2 = new MutationObserver(modifyMegastarElements);
    observer2.observe(document.body, { childList: true, subtree: true });
    const observer3 = new MutationObserver(modifyTdElements);
    observer3.observe(document.body, { childList: true, subtree: true });
})();