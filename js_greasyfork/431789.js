// ==UserScript==
// @name         FactorialPls
// @namespace    https://app.factorialhr.com/
// @version      1.8.4800
// @description  Auto-fill factorialhr.com work shifts
// @author       JugadaMestra
// @license      MIT
// @match        https://app.factorialhr.com/*
// @connect      factorialhr.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/431789/FactorialPls.user.js
// @updateURL https://update.greasyfork.org/scripts/431789/FactorialPls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    let access = null;
    let employee = null;

    function delay(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });
    }

    async function request(url, body, dontIncludeAccess) {
        const headers = {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9,es;q=0.8,ca;q=0.7",
            "cache-control": "no-cache",
            "content-type": "application/json;charset=UTF-8",
            "x-factorial-origin": "web",
            ...((access && !dontIncludeAccess) ? {"x-factorial-access": access.id} : {}),
        };

        /*return new Promise((resolve, reject) => GM_xmlhttpRequest({
            "url": url,
            "headers": headers,
            "data": body || undefined,
            "method": body ? "POST" : "GET",
            onerror: err => reject(err),
            onload: res => resolve(JSON.parse(res.responseText)),
        }));*/
        const res = await fetch(url, {
            "headers": headers,
            "referrer": "https://app.factorialhr.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": body || undefined,
            "method": body ? "POST" : "GET",
            "mode": "cors",
            "credentials": "include"
        });
        return res.json();
    }

    async function fetchUserInfo() {
        if (access && employee) {
            return;
        }

        access = null;
        employee = null;
        try {
            const data = await request(`https://api.factorialhr.com/accesses`, undefined, true);
            access = (Array.isArray(data) && data.find(u => u.current)) || null;
            {
                const data = await request(`https://api.factorialhr.com/employees`);
                employee = (Array.isArray(data) && data.find(e => e.access_id === access.id)) || null;
            }
        } catch (err) {
            console.error(err);
        }
        console.log(`[FactorialPls] AccessId = ${access ? access.id : 'NULL'}, EmployeeId = ${employee ? employee.id : 'NULL'}`);
        return !!(access && employee);
    }

    async function getShifts(employeeId, year, month) {
        try {
            const data = await request(`https://api.factorialhr.com/attendance/shifts?employee_id=495204&year=${year}&month=${month}`);
            return data || [];
        } catch (err) {
            return [];
        }
    }

    async function getPeriodId(year, monthNum) {
        try {
            const data = await request(`https://api.factorialhr.com/attendance/periods?year=${year}&month=${monthNum}`);
            if (Array.isArray(data)) {
                const periods = data.filter(p => p.permissions && p.permissions.edit);
                if (periods.length > 0) {
                    if (periods.length > 1) {
                        alert("[FactorialPls] Found multiple editable periods, please complain to the developer");
                    } else {
                        return periods[0].id;
                    }
                }
            }
        } catch (err) {
        }
        return null;
    }

    async function getCalendar(employeeId, year, monthNum) {
        try {
            return await request(`https://api.factorialhr.com/attendance/calendar?id=${employeeId}&year=${year}&month=${monthNum}`);
        } catch (err) {
            console.log(err);
        }
        return null;
    }

    async function fillShifts(day, monthIdx, year, shifts, existingShifts, periodId, onShiftProcessed) {
        if (!periodId) {
            periodId = await getPeriodId(year, monthIdx + 1);
            if (!periodId) {
                console.error("[FactorialPls] unable to get period ID");
                return;
            }
            console.info("[FactorialPls] Period ID for month " + (monthIdx + 1) + ":", periodId);
            console.info("[FactorialPls] Shifts", shifts);
        }

        const currDate = new Date();
        const currDateStr = (new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate())).toISOString();

        const targeDateOnlyStr = `${String(year).padStart(4, '0')}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        for (let i = 0; i < shifts.length; ++i) {
            const shift = shifts[i];
            const clockIn = normalizeHour(shift[0]);
            const clockOut = normalizeHour(shift[1]);

            const existing = existingShifts && existingShifts.find(s => s.day === day && (s.clock_in === clockIn && s.clock_out === clockOut));
            if (existing) {
                console.log("Skipping shift", day, clockIn, clockOut);
                continue;
            }

            console.log("Creating shift", day, clockIn, clockOut);

            //continue; // For debugging

            await request("https://api.factorialhr.com/attendance/shifts",
                           `{\"clock_in\":\"${clockIn}\",\"clock_out\":\"${clockOut}\",\"day\":${day},\"period_id\":${periodId},\"workable\":true,\"location_type\":null,\"time_settings_break_configuration_id\":null,\"minutes\":null,\"date\":\"${targeDateOnlyStr}\",\"source\":\"desktop\"}`
            );

            await delay(500 + ((Math.random()*500)|0));

            if (onShiftProcessed) {
                onShiftProcessed(i);
            }
        }
    }

    function normalizeHour(str, delta) {
        const parts = str.split(":");
        const h = +parts[0] + (delta || 0);
        const m = +parts[1];
        return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m);
    }

    let overlayText = "";
    function updateOverlay(value, text) {
        const hide = (value === null);
        let overlay = document.getElementById("FactorialPlsOverlay");
        if (!overlay && !hide) {
            overlay = document.createElement("div");
            overlay.id = "FactorialPlsOverlay";
            overlay.style = `
                position: fixed;
                z-index: 100;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.75);
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            overlay.innerHTML = `
              <div style="border: 1px solid gray;padding: 1rem;background-color: white; width: 256px;"><div></div><progress style="width: 100%; margin-top: 0.5rem;"></progress></div>
            `;
            document.body.appendChild(overlay);
        }
        if (overlay) {
            if (hide) {
                overlay.style.display = 'none';
            } else {
                overlay.style.display = 'flex';
                const progress = overlay.firstElementChild.lastElementChild;
                progress.value = (typeof value === 'number') ? value : 1;

                if (typeof text !== 'string' && typeof value === 'number') {
                    text = 'Filling shifts...';
                }

                if (text !== overlayText) {
                    overlayText = text;
                    overlay.firstElementChild.firstElementChild.innerHTML = text;
                }
            }
        }
    }

    async function onBtnClicked() {
        let currMatch = location.pathname.match(/attendance\/clock-in\/monthly\/(\d{4})\/(\d{1,2})/);
        let currYear = currMatch ? +currMatch[1] : (new Date()).getFullYear();
        let currMonthIdx = currMatch ? (+currMatch[2]) - 1 : 9;
        let numDaysInMonth = (new Date(currYear, currMonthIdx + 1, 0)).getDate();
        const example = `1-${numDaysInMonth} ${MONTH_NAMES[currMonthIdx]} ${currYear} 9:30-13:30 14:30-18:30`;
        const input = prompt('Input day range, month and year, followed by one or more shifts\n(Example: "' + example + '")', example);
        if (!input) {
            return;
        }

        const match = input.trim().match(/^(\d+)\s*-\s*(\d+)\s+(\w+)\s+(\d+)((?:\s+\d{1,2}:\d{1,2}-\d{1,2}:\d{1,2})+)$/);
        if (!match) {
            return alert("Invalid format");
        }

        const firstDay = +match[1];
        const lastDay = +match[2];
        const month = match[3];
        const year = +match[4];
        const shiftsStr = match[5].trim();

        const monthDate = new Date("1 " + month);
        if (isNaN(monthDate)) {
            return alert('Invalid month "' + month + '"');
        }
        let monthIdx = monthDate.getMonth();

        updateOverlay(0, "Loading data...");

        if (!(await fetchUserInfo())) {
            return alert("Unable to fetch user info (access ID, employee ID)");
        }

        const periodId = await getPeriodId(year, monthIdx + 1);
        console.info("[FactorialPls] Period ID for month " + (monthIdx + 1) + ":", periodId);
        if (!periodId) {
            return alert("Unable to fetch the ID of the period (no editable periods?)");
        }

        const calendar = await getCalendar(employee.id, year, monthIdx + 1);
        if (!calendar) {
            return alert("Unable to fetch the calendar");
        }
        //console.log("[FactorialPls] Calendar", calendar);
        const calendarByDay = {};
        for (const e of calendar) {
            calendarByDay[e.day] = e;
        }

        const isIntensive = [...document.querySelectorAll("td > div > div > div > span[class][style]")].some(span => span.innerText.includes('-7h'));
        console.info("[FactorialPls] Is intensive", isIntensive);

        updateOverlay(0);

        const existingShifts = await getShifts(employee.id, year, monthIdx + 1);
        console.info("[FactorialPls] Existing shifts", existingShifts);

        const shifts = shiftsStr.split(/\s+/g).map(shift => shift.split("-"));
        const numShifts = shifts.length;
        for (let day = firstDay; day <= lastDay; ++day) {
            //const d = new Date(year, monthIdx, day);
            //if (d.getDay() === 0 || d.getDay() === 6) { // Sunday (0), Saturday (6)
                //continue;
            //}
            const meta = calendarByDay[day];
            if (!meta.is_laborable || meta.is_leave) {
                console.log(`Skipping day ${day} (laborable: ${meta.is_laborable ? 1 : 0}, leave: ${meta.is_leave ? 1 : 0})`);
                continue;
            }

            const targetDate = new Date(year, monthIdx, day);
            const dayOfWeek = targetDate.getDay(); // 0 = sunday, 1 = monday, ...

            let targetShifts = shifts;
            if (isIntensive && dayOfWeek === 5 /* friday */) {
                let lastShift = [...shifts.at(-1)];
                lastShift[1] = normalizeHour(lastShift[1], -1);
                targetShifts = [...shifts];
                targetShifts[targetShifts.length - 1] = lastShift;
            }

            const error = await fillShifts(day, monthIdx, year, targetShifts, existingShifts, periodId, (i) => {
                const p = (i + 1 + numShifts*(day - firstDay)) / (numShifts*(lastDay - firstDay + 1));
                updateOverlay(p);
            });

            if (error) {
                return alert(error);
            }
        }

        updateOverlay(1, '<div>Finished! Please reload the page</div><div style="text-align: center"><button onclick="location.reload()" style="margin-top: 0.5rem; padding: 4px 16px; color: white; font-weight: 600; font-size: 14px; white-space: nowrap;  background-color: rgb(105, 94, 232); border-radius: 16px;">Reload Page</button></div>');
    }

    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand("Fill Factorial Shifts...", onBtnClicked);
    }

    function onDomChanged() {
        const btn = document.getElementById("FactorialPlsBtn");
        if (!btn) {
            //const target = document.querySelector('div[class^="status__"]');
            let target = document.querySelector('span[style] + div + span')?.parentElement?.parentElement?.lastElementChild;
            if (target && target.innerText.trim() === 'Expand all') {
                const elem = document.createElement("button");
                elem.id = "FactorialPlsBtn";
                Object.assign(elem.style, {
                    //float: "right",
                    padding: "4px 16px",
                    color: "rgb(81, 81, 100)",
                    fontWeight: "500",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    backgroundColor: "white",
                    border: "2px solid rgb(226, 226, 229)",
                    borderRadius: "16px",
                });
                elem.innerHTML = "FactorialPls™️ AutoFill";
                elem.onclick = onBtnClicked;
                target.insertBefore(elem, target.lastElementChild);
                elem.previousElementSibling.style.flex = '1 1';
            }
        }
    }

    let timeout = null;

    const observer = new MutationObserver(function(mutations) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(onDomChanged, 200);
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();