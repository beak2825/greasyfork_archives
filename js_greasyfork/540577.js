// ==UserScript==
// @name         ShowMeWhen on NodeSeek
// @license      AGPL-3.0
// @namespace    http://tampermonkey.net/
// @version      2025-06-23
// @description  Display the exact create & edit time of posts on NodeSeek
// @author       Casa
// @match        https://www.nodeseek.com/*
// @match        http://www.nodeseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540577/ShowMeWhen%20on%20NodeSeek.user.js
// @updateURL https://update.greasyfork.org/scripts/540577/ShowMeWhen%20on%20NodeSeek.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const overrideStyle = document.createElement('style');
    overrideStyle.innerHTML = `
      .date-created time::after,
      .date-updated::after,
      .info-item.info-last-comment-time time::after {
         content: none !important;
      }
      .date-created time,
      .date-updated,
      .info-item.info-last-comment-time time {
         font-size: inherit !important;
         position: static !important;
      }
    `;
    document.head.appendChild(overrideStyle);

    function getAbsoluteTimeString(el) {
        return el.getAttribute('title') || el.getAttribute('datetime');
    }

    function parseTimeString(timeStr) {
        let isoString = timeStr.includes('T') ? timeStr : timeStr.replace(' ', 'T');
        return new Date(isoString);
    }

    function processTimeElement(el) {
        let rawStr = getAbsoluteTimeString(el);
        if (!rawStr) return;

        let timeForCompare = rawStr;
        if (el.classList.contains('date-updated')) {
            const regex = /(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}(?::\d{2})?)/;
            const match = rawStr.match(regex);
            if (match) {
                timeForCompare = match[1];
            } else {
                return;
            }
        }

        const timeObj = parseTimeString(timeForCompare);
        if (isNaN(timeObj.getTime())) return;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        if (timeObj < todayStart) {
            el.textContent = rawStr;
            el.style.setProperty("font-size", "11px", "important");
            el.style.setProperty("color", "#858585", "important");
            el.style.setProperty("position", "relative", "important");
        }
    }

    function processAllTimeElements() {
        document.querySelectorAll('.date-created time').forEach(processTimeElement);
        document.querySelectorAll('.date-updated').forEach(processTimeElement);
        document.querySelectorAll('.info-item.info-last-comment-time time').forEach(processTimeElement);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", processAllTimeElements);
    } else {
        processAllTimeElements();
    }
})();
