// ==UserScript==
// @name         Ups-Training
// @namespace    http://tampermonkey.net/
// @author       Upsilon[3212478]
// @version      1.2.0
// @description  Training management in Torn
// @match        https://www.torn.com/companies.php*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532857/Ups-Training.user.js
// @updateURL https://update.greasyfork.org/scripts/532857/Ups-Training.meta.js
// ==/UserScript==

(() => {
    "use strict";

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector))
                return resolve(document.querySelector(selector));

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    class TrainingManager {
        static STORAGE_KEY = "ups-training-data";
        static API_KEY = "ups-training-api-key";
        static API_ENDPOINT = "https://api.torn.com/company/?selections=news&key=";

        constructor() {
            this.apiKey = localStorage.getItem(TrainingManager.API_KEY) || "###APIKEY###";
            this.loadTrainingData();
            this.currentDate = new Date();
            this.lastRefresh = 0;
            this.init();
        }

        getTrainingColor(count) {
            const colors = ['#ff9999', '#ff7070', '#ff4d4d', '#ff2929', '#ff0000'];
            const index = Math.min(count, 5) - 1;
            return colors[index];
        }

        loadTrainingData() {
            const saved = localStorage.getItem(TrainingManager.STORAGE_KEY);
            this.trainingData = saved ? JSON.parse(saved) : {};
        }

        saveTrainingData() {
            localStorage.setItem(TrainingManager.STORAGE_KEY, JSON.stringify(this.trainingData));
        }

        init() {
            this.injectStyles();
            this.createUI();
            this.setupEventListeners();
        }

        injectStyles() {
            const css = `
        .ups-container {
          margin-top: 15px;
          background: #2a2a2a;
          border-radius: 4px;
          padding: 32px;
        }

        .ups-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .ups-button {
          background: #3a3a3a;
          border: 1px solid #4a4a4a;
          color: #74c0fc;
          padding: 6px 12px;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
          margin: 5px;
        }

        .ups-button:hover {
          filter: brightness(1.2);
        }

        .trained-employee {
          border-right: 2px solid !important;
          border-left: 2px solid !important;
          border-top: 2px solid !important;
          border-bottom: 2px solid !important;
        }

        .untrained-employee {
          border-right: 2px solid #52ff3b !important;
          border-left: 2px solid #52ff3b !important;
          border-top: 2px solid #52ff3b !important;
          border-bottom: 2px solid #52ff3b !important;
        }
        
        .display-employee {
            display: flex;
            justify-content: space-between;
        }

        .ups-employee-list {
          margin-top: 10px;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .employee-entry {
            font-size: 14px;
            color: #fff;
            padding: 5px;
        }
        
        .employee-entry a {
            color: #007bff;
            text-decoration: none;
        }
        
        .employee-entry a:hover {
            text-decoration: underline;
        }
        
        .ups-training-table {
            width: 100%;
            margin-top: 15px;
            border-collapse: collapse;
            font-size: 14px;
        }
        
        .ups-training-table th {
            padding: 5px;
            border: 1px solid #444;
            text-align: center;
        }
        
        .ups-training-table tbody tr td {
            padding: 5px;
            border: 1px solid #444;
            text-align: center;
            background-color: #333;
        }
        
        .ups-training-table th {
            background-color: #333;
        }
        
        .ups-legend {
            margin-top: 15px;
            padding: 10px;
            background: #333;
            border-radius: 4px;
            border: 1px solid #444;
        }

        .ups-legend-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #74c0fc;
        }

        .ups-legend-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 8px;
        }

        .ups-legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .ups-color-box {
            width: 18px;
            height: 18px;
            border-radius: 3px;
            border: 1px solid #000;
        }

        .ups-legend-label {
            font-size: 13px;
            color: #ddd;
        }
        
        @media only screen and (max-width: 800px) {
            .ups-training-table th {
                padding: 1px;
            }
        
            .ups-training-table tbody tr td {
                padding: 1px;
            }
        }
      `;

            document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
        }

        createUI() {
            this.container = document.createElement("div");
            this.container.className = "ups-container";
            this.container.innerHTML = `
        <div class="ups-header">
          <h3>Ups Training Manager</h3>
          <div>
            <button class="ups-button" id="ups-generate-table"> Generate Weekly Table</button>
            <button class="ups-button" id="ups-refresh">↻ Refresh</button>
            <button class="ups-button" id="ups-api">⚙ API Key</button>
          </div>
        </div>
        <div class="ups-dates">
          <div>Time : <span id="ups-from-date"></span> → <span id="ups-to-date"></span></div>
        </div>
        <div class="display-employee">
            <div class="ups-employee-list" id="ups-employees"></div>
            <div class="ups-colors" id="ups-colors"></div>
        </div>
        <div id="ups-history"></div>
      `;

            waitForElm('.company-wrap').then((elm) => {
                elm.prepend(this.container);
                this.fromDateElement = this.container.querySelector("#ups-from-date");
                this.toDateElement = this.container.querySelector("#ups-to-date");
                this.employeesList = this.container.querySelector("#ups-employees");
            });
        }

        createColorLegend() {
            const container = document.getElementById('ups-colors');

            container.innerHTML = `
        <div class="ups-legend">
            <div class="ups-legend-title">Training Legend</div>
            <div class="ups-legend-grid">
                ${[1, 2, 3, 4, 5].map(count => `
                    <div class="ups-legend-item">
                        <div class="ups-color-box" 
                             style="background:${this.getTrainingColor(count)}"></div>
                        <span class="ups-legend-label">
                            ${count} ${count === 5 ? '+' : ''} training${count > 1 ? 's' : ''}
                        </span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
        }

        setupEventListeners() {
            this.container.querySelector("#ups-refresh").addEventListener("click", () => this.refreshData());
            this.container.querySelector("#ups-api").addEventListener("click", () => this.handleApiKey());
            this.container.querySelector("#ups-generate-table").addEventListener("click", () => this.updateHistoryTable());
        }

        updateHistoryTable() {
            const todayIndex = (this.currentDate.getDay() + 6) % 7;
            const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

            let html = `
        <table class="ups-training-table">
            <tr>
                <th>Employee</th>
                ${DAYS.map((day, i) =>
                `<th class="${i === todayIndex ? 'current-day' : ''}">${day}</th>`
            ).join('')}
                <th>Total</th>
            </tr>`;

            Object.entries(this.trainingData).forEach(([xid, data]) => {
                const total = data.days.reduce((sum, count) => sum + (count || 0), 0);

                html += `
            <tr>
                <td>${data.name}</td>
                ${data.days.map((count, i) => {
                    const color = count > 0
                        ? `style="background-color: ${this.getTrainingColor(count)}"`
                        : '';

                    return `<td class="${i === todayIndex ? 'current-day' : ''}" ${color}>
                        ${count || '-'}
                    </td>`;
                    }
                ).join('')}
                <td>${total}</td>
            </tr>`;
            });

            html += "</table>";
            this.container.querySelector("#ups-history").innerHTML = html;
        }

        async refreshData() {
            if (Date.now() - this.lastRefresh < 2000) return;

            this.lastRefresh = Date.now();
            this.updateDateRange();

            try {
                const trained = await this.fetchTrainingData();
                this.updateEmployeeList(trained);
                this.createColorLegend();
                this.highlightEmployees(trained);
            } catch (error) {
                this.showError(error.message);
            }

            setInterval(() => this.refreshData(), 10000);
        }

        updateDateRange() {
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);

            this.fromDateElement.textContent = this.formatDate(yesterday);
            this.toDateElement.textContent = this.formatDate(now);
        }

        formatDate(date) {
            return date.toLocaleDateString("en-UK", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "UTC"
            });
        }

        async fetchTrainingData() {
            if (!this.validateApiKey()) throw new Error("Incorrect API KEY");

            const response = await fetch(TrainingManager.API_ENDPOINT + this.apiKey);
            const data = await response.json();

            if (data.error) throw new Error(`API: ${data.error.error}`);

            return this.processNews(data.news || {});
        }

        processNews(newsItems) {
            const employees = {};
            const now = Date.now() / 1000;

            for (const entry of Object.values(newsItems)) {
                if (this.isValidTrainingEntry(entry, now)) {
                    const {xid, name} = this.extractEmployeeInfo(entry.news);
                    employees[xid] = employees[xid]
                        ? {...employees[xid], count: employees[xid].count + 1}
                        : {name, count: 1};
                }
            }
            return employees;
        }

        isValidTrainingEntry(entry, currentTimestamp) {
            const oneDayAgo = currentTimestamp - 86400;
            return (
                entry.timestamp >= oneDayAgo &&
                entry.news?.includes("trained by the director")
            );
        }

        extractEmployeeInfo(text) {
            return {
                xid: text.match(/XID=(\d+)/)?.[1] || "inconnu",
                name: text.match(/>([^<]+)<\/a>/)?.[1] || "Unknown Employee"
            };
        }

        updateEmployeeList(employees) {
            const todayIndex = (this.currentDate.getDay() + 6) % 7;

            Object.entries(employees).forEach(([xid, {name, count}]) => {
                if (!this.trainingData[xid]) {
                    this.trainingData[xid] = { name, days: Array(7).fill(0) };
                }
                this.trainingData[xid].days[todayIndex] = count;
            });

            this.saveTrainingData();

            this.employeesList.innerHTML = Object.entries(employees)
                .map(([xid, {name, count}]) => `
          <div class="employee-entry">
            <a href="https://www.torn.com/profiles.php?XID=${xid}" target="_blank">
              ${name}
            </a>: ${count} training
          </div>
        `).join("");
        }

        highlightEmployees(employees) {
            document.querySelectorAll(".employee-list li[data-user]").forEach(item => {
                const userId = item.dataset.user;
                const element = item.querySelector(".employee.icons");
                const employeeData = employees[userId];
                const trainingCount = employeeData?.count || 0;

                element?.classList.remove("untrained-employee");
                element?.style.removeProperty('background-color');

                if (trainingCount > 0) {
                    element?.classList.add("trained-employee");
                    element?.style.setProperty('border-color', this.getTrainingColor(trainingCount), 'important');
                } else {
                    element?.classList.add("untrained-employee");
                }
            });
        }

        handleApiKey() {
            const newKey = prompt("Enter your api key (limited)", this.apiKey);

            if (newKey?.length === 16) {
                this.apiKey = newKey;
                localStorage.setItem(TrainingManager.API_KEY, newKey);
                this.refreshData();
            }
        }

        validateApiKey() {
            return this.apiKey?.length === 16 && !this.apiKey.includes("APIKEY");
        }

        showError(message) {
            this.employeesList.innerHTML = `<div class="ups-error">⚠️ Error: ${message}</div>`;
        }
    }

    new TrainingManager();
})();