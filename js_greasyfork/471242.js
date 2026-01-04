// ==UserScript==
// @name         Notion timeline item colorizer
// @description  Colorize notion timeline by select tag
// @namespace    haechi.steve
// @version      0.6
// @author       hackurity01
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=notion.so
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471242/Notion%20timeline%20item%20colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/471242/Notion%20timeline%20item%20colorizer.meta.js
// ==/UserScript==

function highlightTicket() {
    const rows = [...document.querySelectorAll('.notion-timeline-item-row')];
    rows.forEach((row) => {
        const tagEl = row.querySelector(
            '.notion-timeline-item-properties > div:last-child > div > div'
        );

        if (tagEl) {
            const timelineItem = row.querySelector('.notion-timeline-item');
            tagEl.style.display = 'none';
            timelineItem.style.background = tagEl.style.background;
            timelineItem.style.boxShadow = '';
        }
    });

    return !!rows.length;
}

let isHighlighted = false;
let intervalCount = 0;
const intervalLimit = 15;
function intervalHightlight() {
    intervalCount++;
    isHighlighted = highlightTicket();

    if(isHighlighted || intervalCount >= intervalLimit) {
        // double check
        setTimeout(() => {
            highlightTicket()
        }, 800);
        return;
    }

    setTimeout(() => {
        intervalHightlight();
    }, 300);
}

window.addEventListener('load', function () {
    intervalCount = 0;
    intervalHightlight();
    document.body.addEventListener('click', (event) => {
        const btnEl = event.target.closest('div[role="button"]');
        const isTicketElement = btnEl ? !!btnEl.ariaExpanded : false;
        if (isTicketElement) {
            setTimeout(() => {
                highlightTicket();
            }, 800);
        }
    });
});

