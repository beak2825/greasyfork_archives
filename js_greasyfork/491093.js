// ==UserScript==
// @name         Factorial HR Spanish hours
// @version      1.2.0
// @description  Automate the input of shifts in factorial
// @author       Hector Castelli Zacharias
// @match        https://app.factorialhr.com/attendance/clock-in/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @license      gpl-3.0
// @namespace https://greasyfork.org/users/1280664
// @downloadURL https://update.greasyfork.org/scripts/491093/Factorial%20HR%20Spanish%20hours.user.js
// @updateURL https://update.greasyfork.org/scripts/491093/Factorial%20HR%20Spanish%20hours.meta.js
// ==/UserScript==

const shifts = [
    ["09:00", "13:00"],
    ["14:00", "18:00"]
];


(async function () {
    'use strict';

    console.log("Waiting...");
    await new Promise(r => setTimeout(r, 3000));

    alert("Start shift helper");

    const urlData = document.URL.split("/");
    const month = Number(urlData.pop());
    const year = Number(urlData.pop());

    const employeeId = await getEmployeeId();
    const shiftPeriod = await getShiftPeriodId(employeeId, month, year);

    const today = new Date();

    let shiftDate = new Date();
    shiftDate.setDate(1);

    console.log("Starting to add shifts", shiftDate);

    while (shiftDate.getMonth() === month - 1 && shiftDate.getDate() <= today.getDate()) {
        if (shiftDate.getDay() === 0 || shiftDate.getDay() === 6) {
            console.info("Skipping. Date is a weekend", shiftDate);
            //Day + 1
            shiftDate.setDate(shiftDate.getDate() + 1);
            continue;
        }

        for (let i = 1; i <= 2; i++) {
            const shift = shifts[i - 1];
            console.log("Adding shift", shift, shiftDate);
            await addShift(shift[0], shift[1], shiftPeriod, shiftDate.getDate(), month, year);
        }

        //Day + 1
        shiftDate.setDate(shiftDate.getDate() + 1);
    }

    alert("Finished adding shifts until today");
})();


const headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-factorial-access": "1658959",
    "x-factorial-origin": "web"
};

async function getEmployeeId() {
    const payload = {
        "operationName": "GetCurrent",
        "variables": {},
        "query": `query GetCurrent {
            apiCore {
                currentsConnection {
                    edges {
                        node {
                            employee {
                                id
                            }
                        }
                    }
                }
            }
        }`
    };

    const request = await fetch("https://api.factorialhr.com/graphql", {
        "headers": headers,
        "referrer": "https://app.factorialhr.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify(payload),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    const data = await request.json();
    return data.data.apiCore.currentsConnection.edges[0].node.employee.id
}

async function getShiftPeriodId(employeeId, month, year) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOfMonth = firstDay.toISOString().split('T')[0];
    const endOfMonth = lastDay.toISOString().split('T')[0];

    const request = await fetch(`https://api.factorialhr.com/attendance/periods?year=${year}&month=${month}&employee_id=${employeeId}&start_on=${startOfMonth}&end_on=${endOfMonth}`, {
        "headers": headers,
        "referrer": "https://app.factorialhr.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    const data = await request.json();
    return data[0].id
}


async function addShift(shiftStart, shiftEnd, shiftPeriod, day, month, year) {
    const payload = {
        "clock_in": shiftStart,
        "clock_out": shiftEnd,
        "day": day,
        "period_id": shiftPeriod,
        "workable": true,
        "location_type": null,
        "time_settings_break_configuration_id": null,
        "minutes": null,
        "date": `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
        "source": "desktop"
    };

    return fetch("https://api.factorialhr.com/attendance/shifts", {
        "headers": headers,
        "referrer": "https://app.factorialhr.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify(payload),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
}