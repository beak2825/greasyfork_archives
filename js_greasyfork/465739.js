// ==UserScript==
// @name         Total Gained
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Display total stat gained for selected period on the Log page.
// @author       Caspie [2794025]
// @license      MIT License
// @match        https://www.torn.com/page.php?sid=log&log=5300
// @match        https://www.torn.com/page.php?sid=log&log=5300&*
// @match        https://www.torn.com/page.php?sid=log&log=5301
// @match        https://www.torn.com/page.php?sid=log&log=5301&*
// @match        https://www.torn.com/page.php?sid=log&log=5302
// @match        https://www.torn.com/page.php?sid=log&log=5302&*
// @match        https://www.torn.com/page.php?sid=log&log=5303
// @match        https://www.torn.com/page.php?sid=log&log=5303&*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465739/Total%20Gained.user.js
// @updateURL https://update.greasyfork.org/scripts/465739/Total%20Gained.meta.js
// ==/UserScript==

(function(w, d) {
    'use strict';

    const activityLog = d.querySelector('.activity-log');

    if (activityLog) {
        new MutationObserver((entries) => {
            for (const entry of entries) {
                const el = entry.target;

                if (el.className.includes('logWrapper')) {
                    if (el.className.includes('tableView') && !el.querySelector('[class^=notFoundMsg]')) {
                        setTimeout(updateTotalGained, 100);
                        break;
                    } else {
                        d.querySelector('.total-gained')?.remove();
                    }
                }
            }
        }).observe(activityLog, {subtree: true, childList: true});
    }

    const updateTotalGained = () => {
        const panelContainer = activityLog?.querySelector('.panel');

        if (!d.querySelector('.total-gained')) {
            const totalGainedContainer = createElement(
                {
                    nodeName: 'div',
                    className: 'total-gained info-msg-cont green border-round m-top10 m-bottom10',
                },
                activityLog?.querySelector('div:nth-child(1)'),
                'after'
            );
            const infoMsg = createElement(
                {
                    nodeName: 'div',
                    className: 'info-msg border-round',
                },
                totalGainedContainer
            );
            createElement(
                {
                    nodeName: 'i',
                    className: 'info-icon',
                },
                infoMsg,
                true
            );
            const delimiter = createElement(
                {
                    nodeName: 'div',
                    className: 'delimiter',
                },
                infoMsg
            );
            createElement(
                {
                    nodeName: 'div',
                    className: 'msg right-round',
                    textContent: 'Calculating...'
                },
                delimiter
            );
        }

        const totalGainedStart = panelContainer?.querySelector('tbody tr:last-child td:nth-child(4)')?.textContent;
        const totalGainedEnd = panelContainer?.querySelector('tbody tr:first-child td:nth-child(5)')?.textContent;
        const statName = panelContainer?.querySelector('thead tr:first-child th:nth-child(4)')?.textContent.split('_')[0];
        const totalEnergy = panelContainer?.querySelectorAll('tbody tr td:nth-child(3)');
        const totalHappy = panelContainer?.querySelectorAll('tbody tr td:nth-child(7)');
        const colorMode = d.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const statColors = {
            'dark': {
                'strength': '--default-base-navy-color',
                'speed': '--default-base-royal-color',
                'defense': '--default-base-brown-color',
                'dexterity': '--default-base-purple-color',
                'energy': '--default-green-dark-color',
                'happy': '--default-base-gold-color'
            },
            'light': {
                'strength': '--default-base-royal-color',
                'speed': '--default-base-turq-color',
                'defense': '--default-base-brown-color',
                'dexterity': '--default-base-pink-color',
                'energy': '--default-green-dark-color',
                'happy': '--default-base-gold-color'
            }
        };

        if (totalGainedStart && totalGainedEnd) {
            const totalGained = Math.round(convertToFloat(totalGainedEnd) - convertToFloat(totalGainedStart)).toLocaleString();
            const energyUsed = calculateUsage(totalEnergy);
            const happyUsed = calculateUsage(totalHappy);

            d.querySelector('.total-gained .msg').innerHTML = `You gained a total of <strong style="color:var(${statColors[colorMode][statName]});">${totalGained}</strong> ${statName}.
            To achieve it, you used <strong style="color:var(${statColors[colorMode].energy});">${energyUsed}</strong> energy
            and <strong style="color:var(${statColors[colorMode].happy});">${happyUsed}</strong> happy.
            `;
        }
    };

    const calculateUsage = (items) => {
        return Array.from(items).reduce((total, item) => total + parseInt(item.textContent), 0).toLocaleString();
    }

    const convertToFloat = (number) => {
        if (!number) {
            return number;
        }

        let localeTest = 1000;
        localeTest = localeTest.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

        return parseFloat(number.replaceAll(localeTest[1], '').replace(localeTest[5], '.'))
    }

    const createElement = (el, parent, prepend = false) => {
        const { nodeName = 'div', ...attrs } = el;
        const element = d.createElement(nodeName);

        Object.entries(attrs).forEach(([attr, value]) => {
            element[attr] = value;
        });

        if (prepend == 'after') {
            parent.parentNode.insertBefore(element, parent.nextSibling)
        } else if (prepend == true) {
            parent.prepend(element);
        } else {
            parent.append(element);
        }

        return element;
    };
})(window, document);
