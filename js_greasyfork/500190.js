// ==UserScript==
// @name         Virtual Contest Result Highlighter
// @namespace    https://kenkoooo.com/atcoder/
// @version      0.1
// @description  Highlights problem rows in AtCoder Problems' Virtual Contests based on results.
// @author       Bolero
// @license      MIT
// @match        https://kenkoooo.com/atcoder/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500190/Virtual%20Contest%20Result%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/500190/Virtual%20Contest%20Result%20Highlighter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const Config = {
        ResultType: {
            AC: 'AC',
            WA: 'WA',
            None: 'None',
        },
        TabType: {
            Problems: 'Problems',
            Standings: 'Standings',
        },
        Colors: {
            AC: '#9AD59E',
            WA: '#FFDD99',
            None: 'transparent',
        },
        SVGFillColor: {
            AC: '#43A047',
            WA: '#D50000',
        },
        ContestMode: {
            Normal: 'Normal',
            Lockout: 'Lockout',
            Training: 'Training',
            None: 'None',
        },
        Selector: {
            ProblemTable: 'table.table-sm.table-bordered.table-striped',
            ContestModeBadge: 'span.badge.badge-secondary',
            ActiveTab: 'a.nav-link.active',
            Figure: 'svg',
            ProblemStatusRow: 'tbody tr',
            ProblemStatusCell: 'td',
            ProblemStatus: 'p',
            Polygon: 'polygon',
            Path: 'path',
        },
        Attribute: {
            Fill: 'fill'
        },
        virtualContestHashPrefix: '#/contest/show/',
        contestBadgePrefix: 'Mode: ',
        noneAcTime: '-',
        ProblemTableColumnLengthIfJoined: 3,
        NumberOfStatusIfSubmitted: 2,
    };

    function getResultColor(resultType) {
        return Config.Colors[resultType] || Config.Colors.None;
    }

    function isContestPage() {
        return window.location.hash.startsWith(Config.virtualContestHashPrefix);
    }

    function extractContestMode(text) {
        const prefix = Config.contestBadgePrefix;
        const startIndex = text.indexOf(prefix) + prefix.length;
        const modeText = text.slice(startIndex);
        return Config.ContestMode[modeText] || Config.ContestMode.None;
    }

    function getContestMode() {
        const contestModeBadgeElement = document.querySelector(Config.Selector.ContestModeBadge);
        if (!contestModeBadgeElement) { return null; }

        return extractContestMode(contestModeBadgeElement.innerText);
    }

    function getActiveTab() {
        const activeTabElement = document.querySelector(Config.Selector.ActiveTab);
        return activeTabElement?.innerText;
    }

    function hasResultCell(cells) {
        return cells.length !== Config.ProblemTableColumnLengthIfJoined;
    }

    function getFillColor(filledFigure) {
        return filledFigure?.getAttribute(Config.Attribute.Fill)
    };

    function isAcSvg(svg) {
        const polygon = svg.querySelector(Config.Selector.Polygon);
        return getFillColor(polygon) === Config.SVGFillColor.AC;
    };

    function isWaSvg(svg) {
        const path = svg.querySelector(Config.Selector.Path);
        return getFillColor(path) === Config.SVGFillColor.WA;
    };

    function svgToResultType(svg) {
        if (isAcSvg(svg)) {
            return Config.ResultType.AC;
        }
        else if (isWaSvg(svg)) {
            return Config.ResultType.WA;
        }

        return Config.ResultType.None;
    }

    function getResultInProblemsTab(row) {
        const cells = row.querySelectorAll(Config.Selector.ProblemStatusCell);
        if (hasResultCell(cells)) {
            return Config.ResultType.None;
        }

        const resultCell = cells[Config.ProblemTableColumnLengthIfJoined - 1];
        const svg = resultCell.querySelector(Config.Selector.Figure);
        if (!svg) {
            return Config.ResultType.None;
        }

        return svgToResultType(svg);
    }

    function colorizeProblemsRows() {
        const problemsTable = document.querySelector(Config.Selector.ProblemTable);
        if (problemsTable) {
            const rows = problemsTable.querySelectorAll(Config.Selector.ProblemStatusRow);
            rows.forEach((row) => {
                const problemResult = getResultInProblemsTab(row);
                if (problemResult && problemResult != Config.ResultType.None) {
                    row.style.backgroundColor = getResultColor(problemResult);
                }
            });
        }
    }

    function getResultInStandingsTab(cell) {
        const problemStatuses = cell.querySelectorAll(Config.Selector.ProblemStatus);
        if (problemStatuses.length == Config.NumberOfStatusIfSubmitted) {
            const acTime = problemStatuses[1].innerText;
            if (acTime === Config.noneAcTime) {
                return Config.ResultType.WA;
            }
            else {
                return Config.ResultType.AC;
            }
        }

        return Config.ResultType.None;
    }

    function colorizeStandingsRows() {
        const standingsTable = document.querySelector(Config.Selector.ProblemTable);
        if (!standingsTable) {
            return;
        }

        const rows = standingsTable.querySelectorAll(Config.Selector.ProblemStatusRow);
        rows.forEach((row, index) => {
            // 最後の行は最速AC者用の行なので飛ばす
            if (index == rows.length - 1) { return; }

            const cells = row.querySelectorAll(Config.Selector.ProblemStatusCell);
            cells.forEach((cell, index) => {
                // 最初のセルは総スコアなので飛ばす
                if (index == 0) { return; }
                const problemResult = getResultInStandingsTab(cell);
                if (problemResult && problemResult != Config.ResultType.None) {
                    cell.style.backgroundColor = getResultColor(problemResult);
                }
            });
        });
    }

    function ColorizeProblemCells() {
        const contestMode = getContestMode();
        if (contestMode !== Config.ContestMode.Normal) { return; }

        const activeTab = getActiveTab();
        if (activeTab === Config.TabType.Problems) {
            colorizeProblemsRows();
        }
        else if (activeTab === Config.TabType.Standings) {
            colorizeStandingsRows();
        }
    }

    function observePageChanges() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const observer = new MutationObserver(ColorizeProblemCells);
        observer.observe(targetNode, config);
    }

    if (isContestPage()) {
        observePageChanges();
    }
})();
