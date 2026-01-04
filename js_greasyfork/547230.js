// ==UserScript==
// @name         Keka Add-ons
// @namespace    https://sundew.keka.com/
// @version      1.0.2
// @description  Show weekly effective hours in the Keka dashboard
// @author       Riju Ghosh
// @match        https://sundew.keka.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keka.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547230/Keka%20Add-ons.user.js
// @updateURL https://update.greasyfork.org/scripts/547230/Keka%20Add-ons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function toHumanHours(hours) {
        let h = Math.floor(hours);
        let m = Math.round((hours - h) * 60);
        if (m === 60) { h += 1; m = 0; }
        return `${h}h ${m}m`;
    }

    function groupByWeekSunSat(data) {
        const weeks = {};

        data.forEach(item => {
            const date = new Date(item.attendanceDate);

            // find Sunday of that week
            const start = new Date(date);
            start.setUTCDate(date.getUTCDate() - date.getUTCDay());

            // find Saturday of that week
            const end = new Date(start);
            end.setUTCDate(start.getUTCDate() + 6);

            const key = `${start.toISOString().split('T')[0]}_${end.toISOString().split('T')[0]}`;

            if (!weeks[key]) {
                weeks[key] = {
                    break: 0,
                    effective: 0,
                    gross: 0,
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0],
                    days: []
                };
            }

            weeks[key].break += item.totalBreakDuration;
            weeks[key].effective += item.totalEffectiveHours;
            weeks[key].gross += item.totalGrossHours;
            weeks[key].days.push(item.attendanceDate);
        });

        return Object.values(weeks).map(totals => ({
            start: totals.start,
            end: totals.end,
            totalBreakHours: totals.break,
            totalEffectiveHours: totals.effective,
            totalGrossHours: totals.gross,
            breakHHMM: toHumanHours(totals.break),
            effectiveHHMM: toHumanHours(totals.effective),
            grossHHMM: toHumanHours(totals.gross),
            days: totals.days
        }));
    }

    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._url = url;
        return open.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener("load", () => {
            try {
                if (this._url.includes('attendance/summary')) {
                    let data;
                    try {
                        data = JSON.parse(this.responseText);
                        console.log("Parsed JSON:", data);
                    } catch {
                        console.log("Not valid JSON, raw response:", this.responseText);
                    }

                    const payload = data.data;

                    const weeklyTotals = groupByWeekSunSat(payload);
                    console.log('Weekly Totals', weeklyTotals);

                    const el = document.querySelector('employee-attendance-list-view');

                    if (!el) {
                        console.log('employee-attendance-list-view missing from DOM');
                    }

                    let output = `<div class="employee-attendance-weekly my-10">`;

                    output += `<div class="card clear-margin">`;

                    // Header
                    output += `<div class="card-header py-8 d-flex">
                        <label class="text-label w-250">Start Date</label>
                        <label class="text-label w-250">End Date</label>
                        <label class="text-label w-250">Total Effective Hours</label>
                        <label class="text-label w-250">Total Break Hours</label>
                        <label class="text-label w-250">Total Gross Hours</label>
                        <label class="text-label w-250">Check</label>
                    </div>`;

                    // Body
                    output += `<div class="card-body clear-padding">`;

                    weeklyTotals.reverse().forEach(wt => {
                        output += `<div class="attendance-logs-row">
                            <div class="d-flex align-items-center px-16 py-12 on-hover border-bottom">
                                <div class="w-250">${wt.start}</div>
                                <div class="w-250">${wt.end}</div>
                                <div class="w-250">${wt.effectiveHHMM}</div>
                                <div class="w-250">${wt.breakHHMM}</div>
                                <div class="w-250">${wt.grossHHMM}</div>
                            </div>
                        </div>`;
                    });

                    output += `</div>`;

                    output += `</div></div>`;

                    const card = el.querySelector('.employee-attendance-weekly');

                    if (card) {
                        card.outerHTML = output;
                    } else {
                        el.insertAdjacentHTML('afterbegin', output);
                    }
                }
            } catch (e) {
                console.error("Error in XHR interception:", e);
            }
        });
        return send.apply(this, arguments);
    };
})();
