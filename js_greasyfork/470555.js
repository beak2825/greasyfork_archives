// ==UserScript==
// @name           Fintual Goal Variation
// @name:es        Fintual variación de objetivos
// @namespace      http://tampermonkey.net/
// @version        0.4
// @description    Easily display profit/loss on the profitability chart.
// @description:es Muestra fácilmente la ganancia/pérdida en el gráfico de rentabilidad.
// @author         IgnaV
// @match          https://fintual.cl/app/goals/*
// @icon           http://fintual.cl/favicon.ico
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/470555/Fintual%20Goal%20Variation.user.js
// @updateURL https://update.greasyfork.org/scripts/470555/Fintual%20Goal%20Variation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const showHistory = false;

    const containerHeightStyle = document.createElement('style');
    document.head.appendChild(containerHeightStyle);
    const updateContainerHeight = elements => {
        containerHeightStyle.textContent = `div.nvtooltip.performance-tooltip { top: -${22 * elements}px !important }`;
    };
    updateContainerHeight(2);

    const history = {};
    let diff, date, clickDiff, clickDate;

    const calculatePercentage = (value, total) => ((value / total) * 100).toFixed(1);

    const getLegendBgColor = value => (value >= 0 ? 'rgb(43, 214, 0)' : 'rgb(214, 0, 0)');

    const formatNumber = number => number.toLocaleString('es-CL', { useGrouping: true });

    const addRowToTable = (tbody, label, percentage, value, color) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="legend-color-guide"><div style="background-color: ${color};"></div></td>
            <td class="key">${label}</td>
            <td class="value">(${percentage}%) $ ${value}</td>`;
        tbody.appendChild(row);
    };

    const updateDateContent = (tdDate, esDateStr, weekDayName) => {
        tdDate.textContent = `${esDateStr} | ${weekDayName}`;
        if (clickDate !== undefined) {
            const betweenDays = Math.round((date - clickDate) / (1000 * 60 * 60 * 24));
            tdDate.textContent += ` | ${betweenDays} ${betweenDays === 1 ? "día" : "días"}`;
        }
    };

    const observeTableChanges = targetElement => {
        const tableObserver = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.tagName === 'TABLE') {
                            const table = node;
                            const tdDate = table.querySelector('thead > tr > td > strong');
                            const tbody = table.querySelector('tbody');
                            const existingRows = tbody.querySelectorAll('tr');
                            const depositAmount = parseFloat(existingRows[0].querySelectorAll('td')[2].textContent.replace(/[^0-9-]+/g, ''));
                            const fintualBalance = parseFloat(existingRows[1].querySelectorAll('td')[2].textContent.replace(/[^0-9-]+/g, ''));
                            diff = fintualBalance - depositAmount;

                            const diffPercentage = calculatePercentage(diff, depositAmount);
                            const legendBgColor = getLegendBgColor(diff);
                            const formattedDiff = formatNumber(diff);

                            addRowToTable(tbody, 'Balance', diffPercentage, formattedDiff, legendBgColor);

                            let [esDateStr, weekDayName] = tdDate.textContent.split(' ');
                            const dateParts = esDateStr.split('/');
                            const year = '20' + dateParts[2];
                            const month = dateParts[1];
                            const day = dateParts[0];
                            const enDateStr = `${year}-${month}-${day}`;

                            if (!weekDayName) {
                                date = new Date(year, month - 1, day);
                                const weekDayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                                weekDayName = weekDayNames[date.getDay()];
                                updateDateContent(tdDate, esDateStr, weekDayName);
                            }

                            history[enDateStr] = diff;

                            if (showHistory) {
                                console.log(Object.keys(history).sort().reduce((acc, key) => (acc[key] = history[key], acc), {}));
                            }

                            const previousDate = Object.keys(history).sort().reverse().find(key => key < enDateStr);
                            if (previousDate !== undefined) {
                                const previousDiff = history[previousDate];
                                const balanceDiff = diff - previousDiff;
                                const balanceDiffPercentage = calculatePercentage(balanceDiff, depositAmount);
                                const balanceLegendBgColor = getLegendBgColor(balanceDiff);
                                const balanceFormattedDiff = formatNumber(balanceDiff);

                                addRowToTable(tbody, 'Diferencia', balanceDiffPercentage, balanceFormattedDiff, balanceLegendBgColor);
                            }

                            if (clickDiff !== undefined) {
                                const balanceDiff = diff - clickDiff;
                                const balanceDiffPercentage = calculatePercentage(balanceDiff, depositAmount);
                                const balanceLegendBgColor = getLegendBgColor(balanceDiff);
                                const balanceFormattedDiff = formatNumber(balanceDiff);

                                addRowToTable(tbody, 'Diferencia click', balanceDiffPercentage, balanceFormattedDiff, balanceLegendBgColor);
                                updateContainerHeight(3);
                            } else {
                                updateContainerHeight(2);
                            }
                        }
                    }
                }
            }
        });

        const tableObserverOptions = {
            childList: true,
            subtree: true
        };
        tableObserver.observe(targetElement, tableObserverOptions);
        return tableObserver;
    };

    let prev;
    const rootObserver = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const targetElement = document.querySelector('div.nvtooltip.performance-tooltip');
                if (targetElement) {
                    if (prev) prev.disconnect();
                    prev = observeTableChanges(targetElement);
                    rootObserver.disconnect();
                }
            }
        }
    });

    const rootObserverOptions = {
        childList: true,
        subtree: true
    };
    rootObserver.observe(document.body, rootObserverOptions);

    const removeLastClick = () => {
        clickDiff = clickDate = undefined;
        const lastClickElement = document.querySelector('.last-click');
        if (lastClickElement) {
            lastClickElement.remove();
        }
    };

    document.addEventListener('click', event => {
        if (event.target.matches('g.nv-focus, g.nv-focus *')) {
            removeLastClick();
            clickDiff = diff;
            clickDate = date;
            const guideLine = document.querySelector('.nv-interactiveGuideLine');
            const clonedGuideLine = guideLine.cloneNode(true);
            clonedGuideLine.classList.add('last-click');
            guideLine.parentNode.insertBefore(clonedGuideLine, guideLine.nextSibling);
        }
    });

    document.addEventListener('dblclick', removeLastClick);
})();
