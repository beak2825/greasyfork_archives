// ==UserScript==
// @name               GreenWall: View all contribution graphs in GitHub ⬜🟩
// @description        View a graph of users' contributions over the years in GitHub.
// @name:zh-CN         GreenWall - 查看历年 GitHub 的贡献图 ⬜🟩
// @description:zh-CN  在 GitHub 中查看用户历年的贡献图。
// @version            1.2.2
// @namespace          https://green-wall.leoku.dev
// @author             LeoKu(https://leoku.dev)
// @match              https://github.com/*
// @run-at             document-start
// @icon               https://green-wall.leoku.dev/favicon.svg
// @grant              GM.xmlHttpRequest
// @homepageURL        https://github.com/Codennnn/Green-Wall
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/492478/GreenWall%3A%20View%20all%20contribution%20graphs%20in%20GitHub%20%E2%AC%9C%F0%9F%9F%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/492478/GreenWall%3A%20View%20all%20contribution%20graphs%20in%20GitHub%20%E2%AC%9C%F0%9F%9F%A9.meta.js
// ==/UserScript==

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function addHistoryEvent(type) {
    var originalMethod = window.history[type];
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        originalMethod.apply(window.history, args);
        var ev = new Event(type);
        window.dispatchEvent(ev);
    };
}
window.history.replaceState = addHistoryEvent('replaceState');
var handler = function () {
    var _a, _b, _c;
    var githubUserPageRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+(?=\/?$)/;
    var isProfile = githubUserPageRegex.test(window.location.href);
    if (isProfile) {
        var ORIGIN_1 = 'https://green-wall.leoku.dev';
        var produceData_1 = function (_a) {
            var data = _a.data;
            var contributionCalendars = data.contributionCalendars.map(function (cur) {
                var rows = [[], [], [], [], [], [], []];
                var nullDay = { count: 0, date: '', level: 'Null' };
                cur.weeks.forEach(function (_a) {
                    var days = _a.days;
                    if (days.length !== 7) {
                        var newDays = __spreadArray([], days, true);
                        for (var i = 0; i <= 6; i++) {
                            var theDay = newDays.at(i);
                            var weekday = i;
                            if (theDay && typeof theDay.weekday === 'number') {
                                if (theDay.weekday === weekday) {
                                    rows[theDay.weekday].push(theDay);
                                }
                                else {
                                    newDays.splice(i, 0, nullDay);
                                    rows[i].push(nullDay);
                                }
                            }
                            else {
                                rows[i].push(nullDay);
                            }
                        }
                    }
                    else {
                        days.forEach(function (day) {
                            if (typeof day.weekday === 'number') {
                                rows[day.weekday].push(day);
                            }
                        });
                    }
                });
                // calendar
                return {
                    total: cur.total,
                    year: cur.year,
                    rows: rows,
                };
            });
            return {
                contributionCalendars: contributionCalendars,
            };
        };
        var isHalloween_1 = false;
        var createGraph_1 = function (params) {
            var year = params.year, total = params.total, rows = params.rows;
            var table = document.createElement('table');
            table.classList.add('ContributionCalendar-grid');
            table.style.borderSpacing = '3px';
            table.style.overflow = 'hidden';
            table.style.position = 'relative';
            var tbody = document.createElement('tbody');
            var tr = document.createElement('tr');
            tr.style.height = '10px';
            rows.forEach(function (row) {
                var clonedTr = tr.cloneNode();
                var htmlStr = '';
                row.forEach(function (col, idx) {
                    var td = '<td></td>';
                    if (col.level !== "Null" /* ContributionLevel.Null */) {
                        var level = col.level === "NONE" /* ContributionLevel.NONE */
                            ? 0
                            : col.level === "FIRST_QUARTILE" /* ContributionLevel.FIRST_QUARTILE */
                                ? 1
                                : col.level === "SECOND_QUARTILE" /* ContributionLevel.SECOND_QUARTILE */
                                    ? 2
                                    : col.level === "THIRD_QUARTILE" /* ContributionLevel.THIRD_QUARTILE */
                                        ? 3
                                        : 4;
                        td = "\n            <td\n              title=\"".concat(col.count === 0 ? 'No' : col.count, " contributions in ").concat(col.date, "\"\n              tabindex=\"-1\"\n              data-ix=\"").concat(idx, "\"\n              style=\"width: 10px\"\n              data-level=\"").concat(level, "\"\n              class=\"ContributionCalendar-day\"\n              data-date=\"").concat(col.level, "\"\n              aria-selected=\"false\"\n              role=\"gridcell\"\n            ></td>\n            ");
                    }
                    htmlStr += td;
                });
                if (clonedTr instanceof HTMLTableRowElement) {
                    clonedTr.innerHTML = htmlStr;
                    tbody.append(clonedTr);
                }
            });
            table.appendChild(tbody);
            var graphItem = document.createElement('div');
            var countText = document.createElement('div');
            countText.style.marginBottom = '5px';
            countText.textContent = "".concat(total, " contributions in ").concat(year);
            graphItem.append(countText, table);
            if (isHalloween_1) {
                graphItem.classList.add('ContributionCalendar');
                graphItem.setAttribute('data-holiday', 'halloween');
            }
            return { graphItem: graphItem };
        };
        var createDialog = function (params) {
            var username = params.username;
            var dialog = document.createElement('dialog');
            dialog.id = 'green-wall-dialog';
            dialog.classList.add('Overlay', 'Overlay-whenNarrow', 'Overlay--size-medium-portrait', 'Overlay--motion-scaleFadeOverlay', 'Overlay-whenNarrow', 'Overlay--size-medium-portrait', 'Overlay--motion-scaleFade');
            dialog.style.minWidth = '777px';
            dialog.style.maxHeight = 'calc(100vh - 50px)';
            dialog.addEventListener('close', function () {
                document.body.classList.remove('has-modal');
            });
            var mouseDownTarget;
            var mouseDownHandler = function (ev) {
                if (ev.target instanceof HTMLElement) {
                    mouseDownTarget = ev.target;
                }
            };
            var mouseUpHandler = function (ev) {
                if (ev.target instanceof HTMLDialogElement
                    && ev.target === mouseDownTarget
                    && ev.target === dialog) {
                    dialog.close();
                }
            };
            dialog.addEventListener('mousedown', mouseDownHandler);
            dialog.addEventListener('mouseup', mouseUpHandler);
            // ---
            var wrap = document.createElement('div');
            wrap.style.display = 'flex';
            wrap.style.flexDirection = 'column';
            wrap.style.overflow = 'hidden';
            // ---
            var dialogHeader = document.createElement('div');
            dialogHeader.classList.add('Overlay-header');
            var contentWrap = document.createElement('div');
            contentWrap.classList.add('Overlay-headerContentWrap');
            var titleWrap = document.createElement('div');
            titleWrap.classList.add('Overlay-titleWrap');
            var title = document.createElement('h1');
            title.classList.add('Overlay-title');
            title.textContent = "".concat(username, "'s GreenWall");
            var actionWrap = document.createElement('div');
            actionWrap.classList.add('Overlay-actionWrap');
            var actionButton = document.createElement('button');
            actionButton.classList.add('close-button', 'Overlay-closeButton');
            actionButton.setAttribute('type', 'button');
            actionButton.innerHTML = "\n      <svg aria-hidden=\"true\" height=\"16\" viewBox=\"0 0 16 16\" version=\"1.1\" width=\"16\" data-view-component=\"true\" class=\"octicon octicon-x\">\n        <path d=\"M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z\"></path>\n      </svg>\n      ";
            actionButton.addEventListener('click', function (ev) {
                ev.stopPropagation();
                dialog.close();
            });
            // ---
            var dialogBody = document.createElement('div');
            dialogBody.classList.add('Overlay-body');
            dialogBody.style.overflowY = 'auto';
            var dialogContent = document.createElement('div');
            dialogContent.style.display = 'flex';
            dialogContent.style.flexDirection = 'column';
            dialogContent.style.rowGap = '10px';
            dialogContent.style.alignItems = 'center';
            dialogContent.style.padding = 'var(--stack-padding-normal, 1rem)';
            // ---
            var dialogFooter = document.createElement('div');
            dialogFooter.classList.add('Overlay-footer', 'Overlay-footer--alignEnd', 'Overlay-footer--divided');
            var openExtrnalBtn = document.createElement('button');
            var btnContent = document.createElement('span');
            btnContent.classList.add('Button-label');
            btnContent.textContent = 'Open in Green Wall';
            openExtrnalBtn.classList.add('Button', 'Button--primary', 'Button--medium');
            openExtrnalBtn.addEventListener('click', function () {
                window.open("".concat(ORIGIN_1, "/user/").concat(username), '_blank');
            });
            titleWrap.append(title);
            actionWrap.append(actionButton);
            contentWrap.append(titleWrap, actionWrap);
            openExtrnalBtn.append(btnContent);
            dialogHeader.append(contentWrap);
            dialogBody.append(dialogContent);
            dialogFooter.append(openExtrnalBtn);
            wrap.append(dialogHeader, dialogBody, dialogFooter);
            dialog.append(wrap);
            document.body.append(dialog);
            return { dialog: dialog, dialogContent: dialogContent };
        };
        var profileArea = document.querySelector('.Layout-sidebar .h-card .js-profile-editable-replace');
        var refNode = (_b = (_a = document.querySelector('.js-profile-editable-replace > .d-flex.flex-column')) === null || _a === void 0 ? void 0 : _a.nextSibling) === null || _b === void 0 ? void 0 : _b.nextSibling;
        if (profileArea instanceof HTMLElement && refNode instanceof HTMLElement) {
            var username_1 = (_c = document
                .querySelector('meta[name="octolytics-dimension-user_login"]')) === null || _c === void 0 ? void 0 : _c.getAttribute('content');
            if (username_1) {
                var exists = !!document.querySelector('#green-wall-block');
                if (!exists) {
                    var block = document.createElement('div');
                    block.setAttribute('id', 'green-wall-block');
                    block.classList.add('border-top', 'color-border-muted', 'pt-3', 'mt-3', 'clearfix', 'hide-sm', 'hide-md');
                    var title = document.createElement('h2');
                    title.classList.add('h4', 'mb-2');
                    title.textContent = 'Green Wall';
                    var openBtn = document.createElement('button');
                    openBtn.classList.add('btn');
                    openBtn.textContent = ' ⬜🟩 View All Green';
                    block.appendChild(title);
                    block.appendChild(openBtn);
                    profileArea.insertBefore(block, refNode);
                    var _d = createDialog({ username: username_1 }), dialog_1 = _d.dialog, dialogContent_1 = _d.dialogContent;
                    var hasLoaded_1 = false;
                    var handleLoadError_1 = function () {
                        dialogContent_1.innerHTML = '';
                        var errorBlock = document.createElement('div');
                        errorBlock.style.display = 'flex';
                        errorBlock.style.flexDirection = 'column';
                        errorBlock.style.alignItems = 'center';
                        var tip = document.createElement('p');
                        tip.textContent = 'The process of obtaining data has an exception.';
                        var retryBtn = document.createElement('button');
                        retryBtn.classList.add('btn');
                        retryBtn.textContent = 'Retry';
                        retryBtn.addEventListener('click', function () {
                            // eslint-disable-next-line @typescript-eslint/no-use-before-define
                            handleLoadData_1();
                        });
                        errorBlock.append(tip, retryBtn);
                        dialogContent_1.append(errorBlock);
                    };
                    var handleLoadData_1 = function () {
                        // loading
                        dialogContent_1.innerHTML = "\n            <svg aria-label=\"Loading\" style=\"box-sizing: content-box; color: var(--color-icon-primary);\" width=\"32\" height=\"32\" viewBox=\"0 0 16 16\" fill=\"none\" data-view-component=\"true\" class=\"anim-rotate\">\n              <circle cx=\"8\" cy=\"8\" r=\"7\" stroke=\"currentColor\" stroke-opacity=\"0.25\" stroke-width=\"2\" vector-effect=\"non-scaling-stroke\" fill=\"none\"></circle>\n              <path d=\"M15 8a7.002 7.002 0 00-7-7\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" vector-effect=\"non-scaling-stroke\"></path>\n            </svg>\n            ";
                        GM.xmlHttpRequest({
                            method: 'GET',
                            url: "".concat(ORIGIN_1, "/api/contribution/").concat(username_1, "?statistics=true"),
                            onload: function (response) {
                                var _a, _b, _c, _d, _e;
                                try {
                                    dialogContent_1.innerHTML = '';
                                    var data = JSON.parse(response.responseText);
                                    var xData = produceData_1(data);
                                    if (xData.contributionCalendars.length > 0) {
                                        var contributionCalendarsWrapper_1 = document.createElement('div');
                                        contributionCalendarsWrapper_1.classList.add('contribution-calendars-wrapper');
                                        contributionCalendarsWrapper_1.style.width = '100%';
                                        contributionCalendarsWrapper_1.style.display = 'flex';
                                        contributionCalendarsWrapper_1.style.flexDirection = 'column';
                                        contributionCalendarsWrapper_1.style.rowGap = '10px';
                                        contributionCalendarsWrapper_1.style.alignItems = 'center';
                                        contributionCalendarsWrapper_1.style.padding = 'var(--stack-padding-normal, 1rem)';
                                        contributionCalendarsWrapper_1.style.borderRadius = 'var(--borderRadius-medium)';
                                        contributionCalendarsWrapper_1.style.backgroundColor = 'var(--bgColor-default, var(--color-canvas-default))';
                                        dialogContent_1.append(contributionCalendarsWrapper_1);
                                        xData.contributionCalendars.forEach(function (calendar) {
                                            var graphItem = createGraph_1(calendar).graphItem;
                                            contributionCalendarsWrapper_1.append(graphItem);
                                        });
                                    }
                                    var statistics = data.data.statistics;
                                    if (statistics) {
                                        var p = document.createElement('p');
                                        p.textContent = "\u6700\u957F\u8FDE\u7EED\u8D21\u732E\uFF1A".concat(statistics.longestStreak, " \u5929\uFF08").concat((_a = statistics.longestStreakStartDate) !== null && _a !== void 0 ? _a : 'Unknown', " - ").concat((_b = statistics.longestStreakEndDate) !== null && _b !== void 0 ? _b : 'Unknown', "\uFF09");
                                        dialogContent_1.append(p);
                                        var p2 = p.cloneNode();
                                        p2.textContent = "\u6700\u957F\u95F4\u65AD\u8D21\u732E\uFF1A".concat(statistics.longestGap, " \u5929\uFF08").concat((_c = statistics.longestGapStartDate) !== null && _c !== void 0 ? _c : 'Unknown', " - ").concat((_d = statistics.longestGapEndDate) !== null && _d !== void 0 ? _d : 'Unknown', "\uFF09");
                                        dialogContent_1.append(p2);
                                        var p3 = p.cloneNode();
                                        p3.textContent = "\u5E73\u5747\u6BCF\u5929\u8D21\u732E\uFF1A".concat(statistics.averageContributionsPerDay, " \u6B21");
                                        dialogContent_1.append(p3);
                                        var p4 = p.cloneNode();
                                        p4.textContent = "\u5468\u672B\u8D21\u732E\uFF1A".concat(statistics.weekendContributions, " \u6B21\uFF0C\u5360 ").concat(((statistics.weekendContributions / statistics.totalContributions) * 100).toFixed(0), "%");
                                        dialogContent_1.append(p4);
                                        var p5 = p.cloneNode();
                                        p5.textContent = "\u6700\u5927\u5355\u65E5\u8D21\u732E\uFF1A".concat(statistics.maxContributionsInADay, " \u6B21\uFF08").concat((_e = statistics.maxContributionsDate) !== null && _e !== void 0 ? _e : 'Unknown', "\uFF09");
                                        dialogContent_1.append(p5);
                                    }
                                    hasLoaded_1 = true;
                                }
                                catch (_f) {
                                    handleLoadError_1();
                                }
                            },
                            onerror: function (err) {
                                console.error('[Green Wall]: ', err);
                                handleLoadError_1();
                            },
                        });
                    };
                    var handleDialogOpen_1 = function () {
                        var _a;
                        dialog_1.showModal();
                        document.body.classList.add('has-modal');
                        if (!hasLoaded_1) {
                            isHalloween_1
                                = ((_a = document.querySelector('.ContributionCalendar')) === null || _a === void 0 ? void 0 : _a.getAttribute('data-holiday'))
                                    === 'halloween';
                            handleLoadData_1();
                        }
                    };
                    openBtn.addEventListener('click', function () {
                        handleDialogOpen_1();
                    });
                }
            }
        }
        else {
            console.warn('[Green Wall]: Target node not found.');
        }
    }
};
// In order to ensure that the script is still effective when the page is navigated forward and backward, we need to listen to the replaceState event of history to trigger the script.
window.addEventListener('replaceState', handler);

