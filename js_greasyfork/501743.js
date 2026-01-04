// ==UserScript==
// @name         Skepdal Board Plans's Timings
// @namespace    http://tampermonkey.net/
// @version      2024-07-24
// @description  https://skedpal-workspace.slack.com/archives/C016P88SUS1/p1721855661565389
// @author       Ilya Gavrilov
// @match        https://app.skedpal.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skedpal.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501743/Skepdal%20Board%20Plans%27s%20Timings.user.js
// @updateURL https://update.greasyfork.org/scripts/501743/Skepdal%20Board%20Plans%27s%20Timings.meta.js
// ==/UserScript==

function formatMinutes(minutes) {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

(function() {
    'use strict';

    function injectMetricHoursIntoPopup(metricRow, popupNode) {
        const titleNode = metricRow.querySelector('.metric--row__title');

        const isHoursNodeExists = titleNode.childNodes[0] instanceof Text;
        const hours = (isHoursNodeExists ? Number.parseInt(titleNode.childNodes[0].textContent, 10) : 0);

        const minutesNode = hours === 0 ? titleNode.childNodes[0] : titleNode.childNodes.length === 2 ? null : titleNode.childNodes[2];
        const minutes = minutesNode === null ? 0 : Number.parseInt(minutesNode.textContent, 10);

        const totalMinutes = hours * 60 + minutes;

        const totalWidth = metricRow.getBoundingClientRect().width;
        const completedWidth = metricRow.querySelectorAll('.metric--progressContainer__row')[0].getBoundingClientRect().width;

        const completedMinutes = Math.ceil((completedWidth / totalWidth) * totalMinutes);

        const popupAlreadyHasTimings = /^.+\([\d/hm ]+\)$/.test(popupNode.textContent);
        if (!popupAlreadyHasTimings) popupNode.textContent = popupNode.textContent + ` (${formatMinutes(completedMinutes)} / ${formatMinutes(totalMinutes)})`;
    }

    addEventListener("load", main)

    function main() {
        new MutationObserver(
            (elements) => elements
                .filter(e => e.oldValue === null)
                .filter(e => e.target instanceof HTMLDivElement && e.target.classList.contains('metric--row'))
                .forEach(e => injectMetricHoursIntoPopup(e.target, document.querySelector(`#${e.target.attributes['aria-describedby'].textContent}`).childNodes[0]))
        ).observe(document, { subtree: true, attributeOldValue: true, attributeFilter: ['aria-describedby'] });
    }

})();