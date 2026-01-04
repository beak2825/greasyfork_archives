// ==UserScript==
// @name         Show absolute time in timeline in bangumi
// @namespace    https://jirehlov.com/
// @version      0.2
// @description  Swap content and data-original-title attributes of span elements within divs of class post_actions date, and monitor for changes in the timeline div
// @author       Jirehlov
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        https://chii.in/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502062/Show%20absolute%20time%20in%20timeline%20in%20bangumi.user.js
// @updateURL https://update.greasyfork.org/scripts/502062/Show%20absolute%20time%20in%20timeline%20in%20bangumi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timelineId = null;

    function swapContentAndTitle() {
        document.querySelectorAll('div.post_actions.date').forEach(function(div) {
            div.querySelectorAll('span.titleTip').forEach(function(span) {
                const currentContent = span.textContent;
                const currentTitle = span.getAttribute('data-original-title');
                span.textContent = currentTitle;
                span.setAttribute('data-original-title', currentContent);
            });
        });
    }

    function checkAndUpdateTimeline() {
        const timelineDiv = document.getElementById('timeline');
        if (timelineDiv) {
            if (timelineId === null) {
                timelineId = timelineDiv;
                swapContentAndTitle();
                observeTimelineChanges();
            } else if (timelineDiv !== timelineId) {
                timelineId = timelineDiv;
                swapContentAndTitle();
            }
        }
    }

    function observeTimelineChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    checkAndUpdateTimeline();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    checkAndUpdateTimeline();
})();