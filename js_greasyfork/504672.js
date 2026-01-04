// ==UserScript==
// @name         Yearify
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  //
// @author       //
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/504672/Yearify.user.js
// @updateURL https://update.greasyfork.org/scripts/504672/Yearify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .custom-tooltip {
            position: fixed;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            z-index: 9999;
        }
    `);

    function getCurrentYear() {
        return new Date().getFullYear();
    }

    function getCurrentMonth() {
        return new Date().getMonth() + 1;
    }

    function getMonthYearFromDate(text) {
        const regexYear = /(\d+) years? ago/;
        const regexMonth = /(\d+) months? ago/;
        const regexWeek = /(\d+) weeks? ago/;

        let match, monthsAgo;

        if (match = text.match(regexYear)) {
            const yearsAgo = parseInt(match[1], 10);
            const currentYear = getCurrentYear();
            return `${currentYear - yearsAgo}`;
        } else if (match = text.match(regexMonth)) {
            monthsAgo = parseInt(match[1], 10);
        } else if (match = text.match(regexWeek)) {
            monthsAgo = Math.floor(parseInt(match[1], 10) / 4);
        }

        if (monthsAgo !== undefined) {
            const currentYear = getCurrentYear();
            const currentMonth = getCurrentMonth();
            let targetMonth = currentMonth - monthsAgo;
            let targetYear = currentYear;

            if (targetMonth <= 0) {
                targetMonth += 12;
                targetYear -= 1;
            }

            return `${targetMonth.toString().padStart(2, '0')}/${targetYear}`;
        }

        return null;
    }

    function showTooltip(element, date) {
        let tooltip = document.getElementById('custom-year-tooltip');

        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'custom-year-tooltip';
            tooltip.className = 'custom-tooltip';
            document.body.appendChild(tooltip);
        }

        tooltip.textContent = date;
        tooltip.style.opacity = '1';

        element.addEventListener('mousemove', moveTooltip);
    }

    function moveTooltip(e) {
        const tooltip = document.getElementById('custom-year-tooltip');
        if (tooltip) {
            tooltip.style.left = `${e.clientX + 10}px`;
            tooltip.style.top = `${e.clientY + 10}px`;
        }
    }

    function hideTooltip() {
        const tooltip = document.getElementById('custom-year-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }

        document.removeEventListener('mousemove', moveTooltip);
    }

    function updateCommentDates() {
        const commentDateElements = document.querySelectorAll('a.yt-simple-endpoint.style-scope.ytd-comment-view-model');

        commentDateElements.forEach(element => {
            const originalText = element.textContent.trim();

            if (!element.dataset.tooltipDate) {
                const date = getMonthYearFromDate(originalText);

                if (date) {
                    element.dataset.tooltipDate = date;

                    element.addEventListener('mouseenter', () => showTooltip(element, date));
                    element.addEventListener('mouseleave', hideTooltip);
                }
            }
        });
    }

    window.addEventListener('load', updateCommentDates);

    setInterval(updateCommentDates, 5000);
})();