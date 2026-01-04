// ==UserScript==
// @name         1337 MED Logtime Calculator
// @namespace    http://tampermonkey.net/
// @version      0.9.8
// @description  Calculates logtime starting from the 29th of each month.
// @author       You
// @match        https://profile.intra.42.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=42.fr
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      translate.intra.42.fr
// @connect      logtime-med.1337.ma
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/473791/1337%20MED%20Logtime%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/473791/1337%20MED%20Logtime%20Calculator.meta.js
// ==/UserScript==

function formatToTimeStamp(str) {
    let split = str.split(":");
    let hours = Number(split[0]);
    let minutes = Number(split[1]);
    let seconds = Number(split[2].split(".")[0]);
    return hours * 60 + minutes + seconds / 60;
}

function timestampToFormat(timestamp) {
    timestamp = Math.floor(timestamp);
    let hours = Math.floor(timestamp / 60);
    let minutes = timestamp % 60;
    return `${hours}h${minutes}`;
}

(function () {
    'use strict';

    GM_addStyle(`@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');`);
    GM_addStyle(`.App > div:nth-child(3) > div {
        background: black;
    }`)

    const bannerList = document.createElement("div");
    bannerList.setAttribute("style", `
        position: fixed;
        bottom: 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        z-index: 99;
        gap: 5px;
    `);

    new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const INTRAV3LOGIN = document.querySelector('a[href$="/correction_point_historics"]')?.getAttribute("href")?.split("/")[4];
            const INTRAV2LOGIN = document.querySelector(".login")?.getAttribute("data-login");
            if (INTRAV3LOGIN ?? INTRAV2LOGIN) {
                clearInterval(interval);
                resolve(INTRAV3LOGIN ?? INTRAV2LOGIN);
            }
        }, 1000);
    }
    ).then((LOGIN) => {

        const PERIOD_START = 29;
        const HOURS_NEEDED = 120;
        const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const SKIP_DAYS = [] // EXAMPLE: ["Saturday", "Sunday"]
        const SKIP_DATE = [] // EXAMPLE: [27, 28]
        const API_URL = 'https://translate.intra.42.fr/users/' + LOGIN + '/locations_stats.json';
        const NETWORK_URL = "https://logtime-med.1337.ma/api/get_log"

        let monthlyHours = [];
        let daysCounts = [];
        let monthlyRemaining = [];
        let monthlyPeriods = [];
        let currentMonth;
        let currentDay;

        function createBanner(contents, backgroundColor = "rgb(66 78 115)", containerWidth = 800, reservedSize = 20) {
            const newDiv = document.createElement("div");
            newDiv.setAttribute("style", `
                            height: 50px;
                            width: ${containerWidth}px;
                            background-color: ${backgroundColor};
                            z-index: 99;
                            border-top-right-radius: 10px;
                            border-bottom-right-radius: 10px;
                            display: flex;
                            justify-content: flex-end;
                            transform: translateX(-100%);
                            transition: transform 0.5s, scale 0.5s, gap 1s ease-in-out;
                            overflow: hidden;
                            user-select: none;
                            gap: 0px;
                            font-family: 'Poppins', sans-serif;
                    `);

            contents.forEach(([key, hours, fnc]) => {
                const monthDiv = document.createElement("div");
                const width = contents.length == 1 ? 0 : `calc((50% - ${reservedSize}%) / ${contents.length - 1})`;
                const endTime = new Date();
                const remainingHours = HOURS_NEEDED * 60 - hours;
                let appendToHours = ""
                if (key == currentMonth && remainingHours > 0) {
                    endTime.setHours(endTime.getHours() + Math.floor(remainingHours / 60));
                    endTime.setMinutes(endTime.getMinutes() + remainingHours % 60);
                    const endTimeTimeString = endTime.toTimeString().split(" ")[0];
                    if (endTime.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000)
                        appendToHours = `<span style="
                            font-size: 10px;
                            line-height: 10px;
                            font-weight: semi-bold;
                        "> ${endTimeTimeString} </span>`;
                }

                monthDiv.setAttribute("style", `
                        height: 100%;
                        width: ${width};
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        color: white;
                    `);
                monthDiv.innerHTML = `
                        <div style="
                            font-size: 10px;
                            line-height: 10px;
                            ">${key}</div>
                        <div style="
                            font-size: 15px;
                            line-height: 15px;
                            font-weight: bold;
                        ">
                        <span id="hours" >
                        ${timestampToFormat(hours)}
                        </span>
                            ${appendToHours}
                        </div>
                    `
                if (fnc != undefined) {
                    fnc(monthDiv);
                }
                else
                    monthDiv.style.opacity = "0.75";

                newDiv.appendChild(monthDiv);
            });
            bannerList.appendChild(newDiv);

            newDiv.addEventListener("mouseenter", () => {
                newDiv.style.scale = "1.5";
                if (contents.length == 1)
                    newDiv.style.transform = "translateX(-35%) translateY(-15%)";
                else
                    newDiv.style.transform = "translateX(-25%) translateY(-15%)";
                newDiv.style.gap = "15px";
            });

            newDiv.addEventListener("mouseleave", () => {
                newDiv.style.scale = "1";
                newDiv.style.transform = "translateX(-50%)";
                newDiv.style.gap = "0px";
            });

            setTimeout(() => {
                newDiv.style.transform = "translateX(-50%)";
            }, 200);
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: API_URL,
            onload: function (response) {
                const data = JSON.parse(response.responseText);
                const today = new Date();
                const originalToday = new Date();
                let originalTodayHours = 0;

                today.setMonth(today.getMonth() - 4);

                while (today <= originalToday) {
                    const key = today.toISOString().split("T")[0];
                    const month = Number(key.split("-")[1]);
                    const day = Number(key.split("-")[2]);

                    currentMonth = day > PERIOD_START ? MONTHS[month % 12] : MONTHS[month - 1];

                    currentDay = day;
                    monthlyPeriods[currentMonth] = monthlyPeriods[currentMonth] ?? { start: key, end: key };

                    const todayHours = formatToTimeStamp(data[key] ?? "0:0:0.0");

                    if (currentDay == PERIOD_START || (currentDay == 1 && daysCounts[currentMonth] > 20)) {
                        currentMonth = MONTHS[(MONTHS.indexOf(currentMonth) + 1) % 12];
                        monthlyPeriods[currentMonth] = { start: key, end: key };
                    }
                    else
                        monthlyPeriods[currentMonth].end = key;

                    if (monthlyHours[currentMonth] == undefined)
                        monthlyHours[currentMonth] = 0;
                    if (daysCounts[currentMonth] == undefined)
                        daysCounts[currentMonth] = 0;
                    if (monthlyRemaining[currentMonth] == undefined)
                        monthlyRemaining[currentMonth] = HOURS_NEEDED * 60;

                    monthlyHours[currentMonth] += todayHours;
                    monthlyRemaining[currentMonth] -= todayHours;

                    if (today.getTime() === originalToday.getTime())
                        originalTodayHours = todayHours;

                    console.log(today, originalToday, today === originalToday);

                    daysCounts[currentMonth]++;

                    today.setDate(today.getDate() + 1);
                }

                monthlyRemaining[currentMonth] = Math.max(monthlyRemaining[currentMonth], 0);

                const periodStartDate = new Date();
                const periodEndDate = new Date(monthlyPeriods[currentMonth].start);
                periodEndDate.setMonth(periodEndDate.getMonth() + 1);

                const daysSkippedBetweenPeriods = (periodEndDate, periodStartDate) => {
                    let count = 0;
                    while (periodStartDate < periodEndDate) {
                        if (SKIP_DAYS.includes(periodStartDate.toLocaleDateString('en-US', { weekday: 'long' })) || SKIP_DATE.includes(periodStartDate.getDate()))
                            count++;
                        periodStartDate.setDate(periodStartDate.getDate() + 1);
                    }
                    return count;
                }

                console.log("start date", periodStartDate);
                console.log("end date", periodEndDate);

                let daysRemaining = Math.floor((periodEndDate - periodStartDate) / (1000 * 60 * 60 * 24)) + 1 - daysSkippedBetweenPeriods(periodEndDate, periodStartDate);
                let hoursPerDay = Math.max(Math.floor((monthlyRemaining[currentMonth] + originalTodayHours) / daysRemaining), 0);
                console.log("days remaining: " + daysRemaining);
                console.log("hours remaining: " + monthlyRemaining[currentMonth]);
                console.log("hours per day: " + hoursPerDay);

                Object.keys(monthlyHours).forEach((key) => {
                    console.log(key + ": " + timestampToFormat(monthlyHours[key]));
                });

                monthlyHours = Object.keys(monthlyHours).slice(-4).reduce((obj, key) => {
                    obj[key] = monthlyHours[key];
                    return obj;
                }, {});

                createBanner(Object.entries(monthlyHours).map(([key, hours]) => [key, hours, key == currentMonth ? (monthDiv) => {
                    const getMonthlyRemaining = () => {
                        return `${timestampToFormat(monthlyRemaining[currentMonth])} in ${daysRemaining} days -`
                    }

                    monthDiv.style.backgroundColor = "rgba(0,0,0,0.5)";
                    monthDiv.style.width = "20%";
                    if (monthlyRemaining[currentMonth] > 0)
                        monthDiv.innerHTML += `
                            <div style="
                                font-size: 10px;
                                line-height: 10px;
                            ">
                                <span id="remaining" >
                                    ${getMonthlyRemaining()}
                                </span>
                                <span>
                                    ${timestampToFormat(hoursPerDay)}
                                </span>
                                <span
                                    style="
                                        font-size: 8px;
                                        line-height: 8px;
                                    "
                                    >/ day</span>
                            </div>
                        `
                    setTimeout(async () => {
                        const span = monthDiv.querySelector('#hours');
                        const remainingSpan = monthDiv.querySelector('#remaining');
                        setInterval(() => {
                            monthlyHours[currentMonth] += 1;
                            monthlyRemaining[currentMonth] -= 1;
                            if (monthlyRemaining[currentMonth] <= 0)
                                monthlyRemaining[currentMonth] = 0;
                            span.innerHTML = timestampToFormat(monthlyHours[currentMonth]);
                            remainingSpan.innerHTML = getMonthlyRemaining();
                        }, 60000);
                    }, 0);
                } : undefined]));

                var requestData = {
                    login: LOGIN,
                    startDate: monthlyPeriods[currentMonth].start.replaceAll("/","-") + 'T23:00:00.000Z',
                    endDate: monthlyPeriods[currentMonth].end.replaceAll("/","-") + 'T23:00:00.000Z'
                };

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: NETWORK_URL,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify(requestData),
                    onload: function (response) {
                        if (response.status !== 200) {
                            console.error(`HTTP error! Status: ${response.status}`);
                            return;
                        }
                        const responseData = JSON.parse(response.responseText);
                        const hours = responseData["hydra:member"][0].totalHours * 60;
                        const bannerObject = {}
                        const hoursRemaining = HOURS_NEEDED * 60 - hours;
                        hoursPerDay = Math.max(Math.floor(hoursRemaining / daysRemaining), 0);

                        bannerObject[currentMonth] = [currentMonth, hours, (monthDiv) => {
                            monthDiv.style.width = "50%";
                            if (hoursRemaining > 0)
                                monthDiv.innerHTML += `
                                    <div style="
                                        font-size: 10px;
                                        line-height: 10px;
                                    ">
                                        <span>
                                            ${timestampToFormat(hoursRemaining)} in ${daysRemaining} days -
                                        </span>
                                        ${timestampToFormat(hoursPerDay)}<span
                                            style="
                                                font-size: 8px;
                                                line-height: 8px;
                                            "
                                            >/ day</span>
                                    </div>
                                `
                        }];

                        createBanner(Object.values(bannerObject), "rgb(100 30 30)", 500);
                    },
                    onerror: function (error) {
                        console.error(error);
                    },
                });
            }
        });
    });

    document.body.appendChild(bannerList);
})();