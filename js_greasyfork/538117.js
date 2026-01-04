// ==UserScript==
// @name         TORN: Company Trains
// @namespace    dekleinekobini.private.companytrains
// @version      0.2.0
// @description  Manage your requested trains for your company.
// @author       DeKleineKobini [2114440]
// @run-at       document-start
// @match        https://*.torn.com/companies.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538117/TORN%3A%20Company%20Trains.user.js
// @updateURL https://update.greasyfork.org/scripts/538117/TORN%3A%20Company%20Trains.meta.js
// ==/UserScript==

const API_KEY = "";

const TRAIN_REGEX = /.+ <a href ?= ?"?http:\/\/w+\.torn\.com\/profiles\.php\?XID=(\d+)"?>.+<\/a> has been trained by the director/;

GM_addStyle(`
    .employee-list {
        li[data-user] {
            position: relative;
        }
    }

    .company-trains-wrapper {
        position: absolute;
        right: -7em;
        top: 8px;
        display: flex;
        gap: 4px;
    
        input {
            width: 3em;
        }
        
        &[data-state="perfect"] input[disabled] {
            background: gold !important;
        }
        
        &[data-state="over"] input[disabled] {
            background: red !important;
        }
        
        &[data-state="under"] input[disabled] {
            background: blue !important;
        }
    }
`);

(function () {
    "use strict";

    detectPage();
    window.addEventListener("hashchange", detectPage);

    function detectPage() {
        const option = new URLSearchParams(location.hash.substring(2)).get("option");
        if (option !== "employees") return;

        new Promise(async (resolve) => {
            while (!document.querySelector(".employee-list")) {
                await new Promise((r) => setTimeout(r, 100));
            }
            resolve();
        }).then(onEmployeePage);
    }

    async function onEmployeePage() {
        const weeklyTrains = await compileTrains();

        const employeeRows = Array.from(document.querySelectorAll(".employee-list > li[data-user]"));
        employeeRows.forEach((row) => {
            const userId = parseInt(row.dataset.user);
            const outputValue = weeklyTrains[userId] ?? 0;

            row.querySelector(".acc-body").appendChild(createEmployeeField(userId, outputValue));
            highlightEmployee(userId);
        });
    }

    function startOfTheWeek() {
        const time = new Date();

        let daysBack;
        if (time.getUTCDay() === 7) {
            // Sunday
            daysBack = time.getUTCHours() >= 18 ? 0 : 7;
        } else daysBack = time.getUTCDay();

        time.setTime(time.getTime() - 86_400_000 * daysBack);
        time.setUTCHours(18, 0, 0, 0);

        return time;
    }

    async function compileTrains() {
        const news = await fetchNews();

        const allTrains = news.map(({ news }) => TRAIN_REGEX.exec(news)).filter((result) => !!result);

        return allTrains.map(([, id]) => parseInt(id)).reduce((acc, id) => ({ ...acc, [id]: (acc[id] ?? 0) + 1 }), {});
    }

    async function fetchNews() {
        const storedData = JSON.parse(localStorage.getItem("company-trains-data") ?? "{}");
        let news = "news" in storedData ? storedData.news : [];

        const weekStart = startOfTheWeek();
        const oldestFrom = parseInt(weekStart.getTime() / 1000);

        let from = Math.max(oldestFrom, storedData.from ?? 0);
        let latestNews = [];
        do {
            const data = await fetch(`https://api.torn.com/company/?key=${API_KEY}&from=${from}&comment=company-trains&selections=news`).then((x) => x.json());
            if (data.error) {
                console.error("Error fetching company trains: ", data);
                break;
            }

            const fetchedNews = Object.entries(data.news).map(([id, log]) => ({ ...log, id }));
            latestNews = fetchedNews;
            news = [...news, ...fetchedNews.filter(({ id }) => !news.some(({ id: id2 }) => id2 === id))];

            from = Math.max(from, ...latestNews.map(({ timestamp }) => timestamp));
        } while (latestNews.length === 100);

        news = news.filter((entry) => entry.timestamp >= oldestFrom);

        storedData.from = from;
        storedData.news = news;
        localStorage.setItem("company-trains-data", JSON.stringify(storedData));

        return news;
    }

    function createEmployeeField(userId, outputValue) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("company-trains-wrapper");
        wrapper.dataset.provided = outputValue;

        const output = document.createElement("input");
        output.setAttribute("disabled", "");
        output.value = outputValue;
        wrapper.appendChild(output);

        const input = document.createElement("input");
        input.setAttribute("type", "number");
        input.addEventListener("input", (event) => {
            localStorage.setItem(`company-trains-${userId}`, event.target.value);
            wrapper.dataset.requested = event.target.value;
            highlightEmployee(userId);
        });
        input.value = localStorage.getItem(`company-trains-${userId}`) ?? "0";
        wrapper.dataset.requested = localStorage.getItem(`company-trains-${userId}`) ?? "0";
        wrapper.appendChild(input);

        return wrapper;
    }

    function highlightEmployee(userId) {
        const wrapper = document.querySelector(`li[data-user="${userId}"] .company-trains-wrapper`);
        if (!wrapper) return;

        const requested = parseInt(wrapper.dataset.requested);
        const provided = parseInt(wrapper.dataset.provided);

        let state = "";
        if (requested === 0 && provided === 0) state = "zero";
        else if (requested === provided) state = "perfect";
        else if (requested > provided) state = "under";
        else if (requested < provided) state = "over";

        wrapper.dataset.state = state;
    }
})();
