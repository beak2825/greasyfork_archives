// ==UserScript==
// @name         Atlassian show sprint points
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Shows in each column of the sprint the points by user
// @license      MIT
// @author       You
// @match        https://rexmas.atlassian.net/jira/software/c/projects/REX/boards/*
// @icon         https://www.atlassian.com/favicon.ico
// @grant        none
// @require      https://greasyfork.org/scripts/467272-awaitfor/code/awaitFor.js?version=1196281
// @downloadURL https://update.greasyfork.org/scripts/443767/Atlassian%20show%20sprint%20points.user.js
// @updateURL https://update.greasyfork.org/scripts/443767/Atlassian%20show%20sprint%20points.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let userName;
    awaitFor(() => document.querySelector('meta[name="ajs-remote-user-fullname"]'),
             () => {userName = document.querySelector('meta[name="ajs-remote-user-fullname"]').content});

    const sortFunc = (a, b) => a[1] - b[1];

    const sumObjectsByKey = (...objs) => {
        return objs.reduce((a, b) => {
            for (let key in b) {
                if (b.hasOwnProperty(key)) {
                    a[key] = (a[key] || 0) + b[key];
                }
            }
            return a;
        }, {});
    }

    const getPoints = (task) => {
        return parseFloat(task.querySelector('.ghx-estimate')?.textContent.replace(',', '.')) || 0;
    }
    const getUser = (task) => {
        return task.querySelector('.ghx-avatar-img')?.dataset.tooltip.split(': ').pop();
    }

    const getTotals = (column, showAll) => {
        const weeks = document.querySelectorAll('.ghx-columns');
        const totals = {};
        if (showAll) {
            weeks.forEach((week) => {
                for (const col of week.children) {
                    const tasks = col.firstChild.children;
                    for (const task of tasks) {
                        const user = getUser(task);
                        totals[user] = 0;
                    }
                }
            });
        }

        weeks.forEach((week) => {
            const tasks = week.children[column].firstChild.children;
            for (const task of tasks) {
                const user = getUser(task);
                const points = getPoints(task);
                totals[user] = totals[user] || 0;
                totals[user] += points;
            }
        });
        return totals;
    }

    function showStoryPoints() {
        setTimeout(() => {
            const rowsCount = [];
            const rowTitles = document.querySelectorAll("#ghx-column-headers li.ghx-column div.ghx-column-header-flex h2");
            const rows = document.querySelectorAll("#ghx-column-headers li.ghx-column");
            for (const [index, rowTitle] of rowTitles.entries()) {
                const showAll = rowTitle.innerText === 'LISTO';
                let title = '';
                const colTotals = getTotals(index, showAll);
                rowsCount.push(colTotals);
                Object.entries(colTotals).sort(sortFunc).reverse().forEach(item => {
                    const [name, value] = item;
                    title += `${Object.keys(colTotals).length === 1 ? '' : name === userName ? '->	' : '	'}${value}: ${name}\n`;
                })
                title = title.slice(0, -1) || 'Nada por aquí';
                rowTitle.setAttribute('title', title);
            }
            const rowTotals = [
                sumObjectsByKey(rowsCount[0], rowsCount[1], rowsCount[2], rowsCount[3], rowsCount[4], rowsCount[6]),
                sumObjectsByKey(rowsCount[1], rowsCount[2], rowsCount[3], rowsCount[4], rowsCount[6]),
                sumObjectsByKey(rowsCount[2], rowsCount[3], rowsCount[4], rowsCount[6]),
                sumObjectsByKey(rowsCount[3], rowsCount[4], rowsCount[6]),
                sumObjectsByKey(rowsCount[4], rowsCount[6]),
                sumObjectsByKey(rowsCount[5]),
                sumObjectsByKey(rowsCount[6]),
            ];
            for (const [index, row] of rows.entries()) {
                let title = '';
                const colTotals = rowTotals[index];
                Object.entries(colTotals).sort(sortFunc).reverse().forEach(item => {
                    const [name, value] = item;
                    title += `${Object.keys(colTotals).length === 1 ? '' : name === userName ? '->	' : '	'}${value}: ${name}\n`;
                })
                title = title.slice(0, -1) || 'Nada por aquí';
                row.setAttribute('title', `suma:\n${title}`);
            }

            const titleSpan = document.querySelector("#subnav-title > span");
            if (titleSpan.textContent.slice(-1) !== '.') {
                titleSpan.textContent += '.';
            }
        }, 500);
    }
    const targetElement = document.getElementById('ak-main-content');
    const observer = new MutationObserver((mutationsList, observer) => {
        const hasChanged = document.querySelector('#subnav-title').textContent.slice(-1) !== '.';
        if (hasChanged) {
            showStoryPoints();
        }
    });
    const observerOptions = {childList: true, subtree: true};
    observer.observe(targetElement, observerOptions);

})();