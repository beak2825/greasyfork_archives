// ==UserScript==
// @name        Jira - Toggle columns
// @description Collapse Jira swimlane columns upon click
// @namespace   jiramod
// @license     MIT
// @version     1.0
// @match       https://*.atlassian.net/jira/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/435961/Jira%20-%20Toggle%20columns.user.js
// @updateURL https://update.greasyfork.org/scripts/435961/Jira%20-%20Toggle%20columns.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function () {
    "use strict";

    const collapsedWidth = 40;
    const toggled = {};

    let board = location.pathname;

    let mainArea = "#ghx-content-main";
    let clickArea = "#ghx-pool";
    let header = ".ghx-column-headers .ghx-column";
    let column = ".ghx-columns .ghx-column";
    let issues = ".ghx-wrap-issue";
    let overlay = ".ghx-zone-overlay-table .ghx-zone-overlay-column";
    let ticketCount = ".ghx-qty";
    let swimlaneHeader = ".ghx-swimlane-header";

    let hasSwimlaneHeaders = false;

    // getComputedStyle(document.querySelector('.ghx-column')).padding
    let columnPadding = "10px";
    let columnPaddingNarrow = columnPadding;
    let columnPaddingXtraNarrow = "5px";

    function rafAsync() {
        return new Promise((resolve) => {
            requestAnimationFrame(resolve); // Faster than setTimeout
        });
    }
    function checkElement(element) {
        if (document.querySelector(element) === null) {
            return rafAsync().then(() => checkElement(element));
        } else {
            return Promise.resolve(true);
        }
    }
    checkElement(mainArea).then((element) => {
        startJiraOverrides();
    });
    checkElement(clickArea).then((element) => {
        startClick();
    });

    function startJiraOverrides() {
        // `GH` functions overwrite Jira's own logic with slight modifications

        // Jira: Ignore collapsed columns when detecting narrow widths
        GH.SwimlaneView.updateIssueLayoutAccording2Size = function (e, firstWidth) {
            var widths = e
                    .map(function () {
                        return AJS.$(this).width();
                    })
                    .get(),
                uncollapsedWidth = widths.find(function (el) {
                    return el > collapsedWidth;
                }),
                i = uncollapsedWidth <= GH.SwimlaneView.NARROW_CARD_WIDTH,
                l = uncollapsedWidth <= GH.SwimlaneView.XTRA_NARROW_CARD_WIDTH;
            e.toggleClass("ghx-narrow-card", i), e.toggleClass("ghx-xtra-narrow-card", l);
        };

        // Jira: Show simple ticket count in header if nonzero
        GH.tpl.rapid.swimlane.renderColumnCount = function (opt_data, opt_ignored) {
            return (
                '<div class="ghx-qty">' +
                (opt_data.column.stats.visible > 0 ? soy.$$escapeHtml(opt_data.column.stats.visible) : "") +
                "</div>"
            );
        };

        // Jira: Add token icons for each issue, to be rendered on collapsed columns
        GH.tpl.rapid.swimlane.renderColumnsHeader = function (opt_data, opt_ignored) {
            var output =
                '<div id="ghx-column-header-group" class="ghx-column-header-group' +
                (opt_data.statistics.fieldConfigured ? " ghx-has-stats" : "") +
                ' ghx-fixed"><ul id="ghx-column-headers" class="ghx-column-headers">';
            var columnList163 = opt_data.columns;
            var columnListLen163 = columnList163.length;
            for (var columnIndex163 = 0; columnIndex163 < columnListLen163; columnIndex163++) {
                var columnData163 = columnList163[columnIndex163];
                output +=
                    '<li class="ghx-column' +
                    (columnData163.minBusted ? " ghx-busted ghx-busted-min" : "") +
                    (columnData163.maxBusted ? " ghx-busted ghx-busted-max" : "") +
                    '" data-id="' +
                    soy.$$escapeHtml(columnData163.id) +
                    '" ><div class="ghx-column-header-flex"><div class="ghx-column-header-flex-1"><h2 data-tooltip="' +
                    soy.$$escapeHtml(columnData163.name) +
                    '" data-tokens="' +
                    "   ■".repeat(soy.$$escapeHtml({ column: columnData163 }.column.stats.visible)) +
                    '">' +
                    soy.$$escapeHtml(columnData163.name) +
                    "</h2>" +
                    (opt_data.statistics.fieldConfigured
                        ? GH.tpl.rapid.swimlane.renderColumnCount({ column: columnData163 })
                        : "") +
                    "</div>" +
                    (opt_data.statistics.fieldConfigured
                        ? '<div class="ghx-limits">' +
                          GH.tpl.rapid.swimlane.renderColumnConstraints({ column: columnData163 }) +
                          "</div>"
                        : "") +
                    "</div></li>";
            }
            output +=
                "</ul>" +
                (!opt_data.isHorizontalScrollEnabled ? '<div id="ghx-swimlane-header-stalker"></div>' : "") +
                "</div>";
            return output;
        };
    }

    function startClick() {
        function toggle(index) {
            console.log("Toggling column", index);

            if (toggled[index] === undefined) {
                GM_addStyle(`
                    body.hidden-${index} ${column}:nth-of-type(${index}),
                    body.hidden-${index} ${header}:nth-of-type(${index}),
                    body.hidden-${index} ${overlay}:nth-of-type(${index}) {
                        width: ${collapsedWidth}px !important;
                    }
                    body.hidden-${index} ${column}:nth-of-type(${index}) ${issues} {
                        display: none;
                    }

                    body.hidden-${index} ${header}:nth-of-type(${index}) {
                        overflow: visible !important;
                    }
                    body.hidden-${index} ${header}:nth-of-type(${index}) h2 {
                        overflow: visible !important;
                        transform: rotate(90deg);
                        transform-origin: left;
                        font-weight: normal;
                        margin-left: calc((${collapsedWidth}px / 2) - ${columnPadding});
                    }
                    body.hidden-${index} ${header}.ghx-narrow-card:nth-of-type(${index}) h2 {
                        margin-left: calc((${collapsedWidth}px / 2) - ${columnPaddingNarrow});
                    }
                    body.hidden-${index} ${header}.ghx-xtra-narrow-card:nth-of-type(${index}) h2 {
                        margin-left: calc((${collapsedWidth}px / 2) - ${columnPaddingXtraNarrow});
                    }
                    body.hidden-${index} ${header}:nth-of-type(${index}) h2::after {
                        content: "  " attr(data-tokens);
                        white-space: pre;
                        opacity: 0.2;
                    }
                    body.hidden-${index} ${header}:nth-of-type(${index}) ${ticketCount} {
                        display: none;
                    }
                `);

                if (hasSwimlaneHeaders) {
                    // Hide column headers until hovered
                    GM_addStyle(`
                        body.hidden-${index} ${header}:nth-of-type(${index}) h2 {
                            font-weight: 600;
                            text-shadow:
                                -1px -1px 0 #fff,
                                -1px 1px 0 #fff,
                                1px -1px 0 #fff,
                                1px 1px 0 #fff,
                                0 0 12px #fff,
                                0 0 12px #fff,
                                0 0 12px #fff,
                                0 0 12px #fff,
                                0 0 12px #fff,
                                0 0 12px #fff,
                                0 0 12px #fff,
                                0 0 12px #fff,
                                0 0 24px #fff,
                                0 0 24px #fff,
                                0 0 24px #fff,
                                0 0 24px #fff,
                                0 0 24px #fff,
                                0 0 24px #fff,
                                0 0 24px #fff,
                                0 0 24px #fff;
                            z-index: 100;
                            visibility: hidden;
                        }
                        body.hidden-${index} ${header}:nth-of-type(${index}):hover h2 {
                            visibility: visible;
                        }
                    `);
                }
            }
            toggled[index] = !toggled[index];

            if (toggled[index]) {
                document.body.classList.add(`hidden-${index}`);
            } else {
                document.body.classList.remove(`hidden-${index}`);
            }

            // Refresh in case it has been updated in another window
            globalToggled = JSON.parse(GM_getValue("globalToggled", "{}"));

            globalToggled[board] = toggled;
            GM_setValue("globalToggled", JSON.stringify(globalToggled));

            // Jira: Redraw issues as wide or narrow or extra-narrow
            GH.SwimlaneView.handleResizeEvent();
        }

        // Toggle columns on click
        document.querySelector(clickArea).addEventListener(
            "click",
            (e) => {
                let target = e.target;

                if (target.matches(column) || (target = target.closest(header))) {
                    let index = [...target.parentElement.children].indexOf(target) + 1;
                    toggle(index);
                }
            },
            true
        );

        // Hide collapsed column headers if swimlane headers are present
        if (document.querySelector(swimlaneHeader)) {
            hasSwimlaneHeaders = true;
        }

        // Collapse previously-toggled columns
        let globalToggled = JSON.parse(GM_getValue("globalToggled", "{}"));
        const loaded = globalToggled[board] === undefined ? {} : globalToggled[board];
        console.log("Previously-toggled columns:", loaded);
        Object.entries(loaded).forEach(([index, collapsed]) => {
            if (collapsed) toggle(index);
        });

        // Style cursor and column headers
        GM_addStyle(`
            ${header}, ${column} { cursor: pointer; }
            ${header} h2 {
                /* Shortened titles look nicer with some space */
                margin-left: 8px;
                margin-right: 8px;
            }
        `);
    }
})();
