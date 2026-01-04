// ==UserScript==
// @name         Exact Time for Expert Portal
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Replace HH:MM:SS timestamps with a precise, updating "ago" format on expert-portal.com.
// @author       Swiftlyx
// @match        https://*.expert-portal.com/workspace/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540043/Exact%20Time%20for%20Expert%20Portal.user.js
// @updateURL https://update.greasyfork.org/scripts/540043/Exact%20Time%20for%20Expert%20Portal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VISIBLE_UPDATE_FREQUENCY_MS = 1000;
    const INVISIBLE_UPDATE_FREQUENCY_MS = 10000;
    const DEBOUNCE_DELAY_MS = 300;

    function getFormattedTimeDifference(eventTimeDateObj) {
        const eventTime = eventTimeDateObj.getTime();
        const currentTime = new Date().getTime();
        const differenceInSeconds = Math.floor((currentTime - eventTime) / 1000);

        if (differenceInSeconds < 60) {
            return `${differenceInSeconds} seconds ago`;
        }

        if (differenceInSeconds < 3600) {
            const minutes = Math.floor(differenceInSeconds / 60);
            const seconds = differenceInSeconds % 60;
            return `${minutes} min ${seconds} seconds ago`;
        }

        const differenceInMinutes = Math.floor(differenceInSeconds / 60);
        if (differenceInMinutes < 1440) {
            const hours = Math.floor(differenceInMinutes / 60);
            const minutes = differenceInMinutes % 60;
            return `${hours}h ${minutes}m ago`;
        }

        const differenceInDays = Math.floor(differenceInMinutes / 1440);
        if (differenceInDays < 30) {
            return `${differenceInDays}d ago`;
        }

        const differenceInMonths = Math.floor(differenceInDays / 30.44);
        if (differenceInMonths < 12) {
            return `${differenceInMonths}mo ago`;
        }

        const differenceInYears = Math.floor(differenceInDays / 365.25);
        return `${differenceInYears}y ago`;
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const buffer = 100;
        return (
            rect.top >= -buffer &&
            rect.left >= -buffer &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + buffer &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + buffer
        );
    }

    function updateTimestamps(forceUpdateAll = false) {
        const timeContainers = document.querySelectorAll('div[class*="_messageTime_"]');

        timeContainers.forEach((container) => {
            if (!isElementInViewport(container) && !forceUpdateAll) {
                return;
            }

            const timeSpan = container.querySelector('span:last-child');
            if (!timeSpan) return;

            let originalTimeStr = container.dataset.originalTime;
            if (!originalTimeStr) {
                const timeMatch = timeSpan.textContent.match(/^\d{1,2}:\d{2}:\d{2}/);
                if (timeMatch) {
                    originalTimeStr = timeMatch[0];
                    container.dataset.originalTime = originalTimeStr;
                } else {
                    return;
                }
            }

            const now = new Date();
            const [hours, minutes, seconds] = originalTimeStr.split(':').map(Number);
            const eventTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds || 0);

            if (eventTime > now) {
                eventTime.setDate(eventTime.getDate() - 1);
            }

            const timeAgo = getFormattedTimeDifference(eventTime);

            timeSpan.textContent = `${timeAgo} (${originalTimeStr})`;
        });
    }

    let debounceTimer;
    function debouncedUpdate() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            updateTimestamps(true);
        }, DEBOUNCE_DELAY_MS);
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                debouncedUpdate();
                return;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    let scrollTicking = false;
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            window.requestAnimationFrame(function() {
                updateTimestamps(false);
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateTimestamps(true);
        }
    });

    function startUpdaters() {
        setInterval(() => updateTimestamps(false), VISIBLE_UPDATE_FREQUENCY_MS);
        setInterval(() => updateTimestamps(true), INVISIBLE_UPDATE_FREQUENCY_MS);
    }

    setTimeout(() => {
        updateTimestamps(true);
        startUpdaters();
    }, 500);

})();
