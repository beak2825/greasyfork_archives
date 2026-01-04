// ==UserScript==
// @name         TruckersMP Report Page Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Enhances the TruckersMP report page with better visualization and statistics
// @author       NoobFly
// @match        https://truckersmp.com/reports
// @grant        GM_addStyle
// @license      GNU GPLv3
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js
// @downloadURL https://update.greasyfork.org/scripts/528537/TruckersMP%20Report%20Page%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/528537/TruckersMP%20Report%20Page%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS
    GM_addStyle(`
        .tm-enhanced-container {
            margin: 20px 0;
            padding: 20px;
            background-color: #333;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .tm-dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .tm-card {
            background-color: #444;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .tm-card h3 {
            margin-top: 0;
            border-bottom: 1px solid #555;
            padding-bottom: 10px;
            color: #72c02c;
        }

        .tm-stats {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .tm-stat-item {
            background-color: #555;
            border-radius: 4px;
            padding: 10px;
            flex: 1;
            min-width: 120px;
            text-align: center;
        }

        .tm-stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #72c02c;
        }

        .tm-stat-label {
            font-size: 14px;
            color: #ccc;
        }

        .tm-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        .tm-table th, .tm-table td {
            border: 1px solid #555;
            padding: 8px 12px;
            text-align: left;
        }

        .tm-table th {
            background-color: #505050;
            color: #fff;
        }

        .tm-table tr:nth-child(even) {
            background-color: #3a3a3a;
        }

        .tm-chart-container {
            height: 300px;
            margin-top: 15px;
        }

        .tm-loading {
            text-align: center;
            padding: 20px;
            font-size: 18px;
            color: #ccc;
        }

        .tm-filter-bar {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
            flex-wrap: wrap;
        }

        .tm-filter-btn {
            background-color: #444;
            border: 1px solid #555;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
        }

        .tm-filter-btn.active {
            background-color: #72c02c;
            border-color: #72c02c;
        }

        .tm-search {
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid #555;
            background-color: #444;
            color: white;
            margin-left: auto;
        }

        .tm-search::placeholder {
            color: #aaa;
        }

        .tm-status-new { color: #3498db; }
        .tm-status-accepted { color: #2ecc71; }
        .tm-status-declined { color: #e74c3c; }

        .tm-detailed-container {
            margin-top: 20px;
        }

        .tab-button {
            padding: 10px 15px;
            background-color: #444;
            border: none;
            border-radius: 4px 4px 0 0;
            cursor: pointer;
            margin-right: 5px;
            color: white;
        }

        .tab-button.active {
            background-color: #72c02c;
            color: white;
        }

        .tab-content {
            display: none;
            padding: 20px;
            background-color: #333;
            border-radius: 0 0 4px 4px;
        }

        .tab-content.active {
            display: block;
        }

        #tm-new-report-btn .btn-primary {
            background-color: #72c02c;
            border-color: #5ca21c;
        }

        #tm-new-report-btn .btn-primary:hover {
            background-color: #62b21c;
        }
    `);

    // Initialize main variables
    let allReports = [];
    let currentPage = 1;
    let totalPages = 1;
    let isLoading = false;

    // Main function to start the enhancement
    function enhanceReportsPage() {
        // Add container for our enhanced UI
        const container = document.createElement('div');
        container.className = 'tm-enhanced-container';
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #72c02c; margin: 0; font-size: 24px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600;">TruckersMP Report Dashboard</h2>
                <div id="tm-new-report-btn"></div>
            </div>
            <div class="tm-loading">Loading all your reports... This may take a moment.</div>
            <div id="tm-dashboard" class="tm-dashboard" style="display: none;"></div>
            <div id="tm-tabs" style="margin-top: 20px; display: none;">
                <button class="tab-button active" data-tab="reports">All Reports</button>
                <button class="tab-button" data-tab="categories">Categories</button>
                <button class="tab-button" data-tab="repeated-players">Repeated Players</button>
                <button class="tab-button" data-tab="statistics">Statistics</button>
            </div>
            <div id="tm-tab-content" style="display: none;">
                <div id="reports-tab" class="tab-content active">
                    <div class="tm-filter-bar">
                        <button class="tm-filter-btn active" data-filter="all">All</button>
                        <button class="tm-filter-btn" data-filter="new">New</button>
                        <button class="tm-filter-btn" data-filter="accepted">Accepted</button>
                        <button class="tm-filter-btn" data-filter="declined">Declined</button>
                        <input type="text" class="tm-search" placeholder="Search reports...">
                    </div>
                    <div id="tm-all-reports"></div>
                </div>
                <div id="categories-tab" class="tab-content">
                    <div id="tm-categories"></div>
                </div>
                <div id="repeated-players-tab" class="tab-content">
                    <div id="tm-repeated-players"></div>
                </div>
                <div id="statistics-tab" class="tab-content">
                    <div class="tm-dashboard">
                        <div class="tm-card">
                            <h3>Report Status Distribution</h3>
                            <div class="tm-chart-container">
                                <canvas id="status-chart"></canvas>
                            </div>
                        </div>
                        <div class="tm-card">
                            <h3>Categories Distribution</h3>
                            <div class="tm-chart-container">
                                <canvas id="categories-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert after the report summary at the top
        const insertPoint = document.querySelector('.row.padding-top-5');
        insertPoint.parentNode.insertBefore(container, insertPoint);

        // Set up tab switching
        const tabButtons = container.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                container.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                document.getElementById(`${this.dataset.tab}-tab`).classList.add('active');
            });
        });

        // Move the New Report button
        const newReportButton = document.querySelector('a.btn.btn-primary.pull-right');
        if (newReportButton) {
            document.getElementById('tm-new-report-btn').appendChild(newReportButton);
        }

        // Hide the original report listing
        const originalTable = document.querySelector('.row.padding-top-5');
        if (originalTable) {
            originalTable.style.display = 'none';
        }

        // Start fetching reports
        fetchAllReports();
    }

    // Function to fetch all reports from all pages
    async function fetchAllReports() {
        try {
            // Get the total number of pages
            const paginationLinks = document.querySelectorAll('.pagination li a');
            if (paginationLinks.length > 0) {
                const lastPageLink = paginationLinks[paginationLinks.length - 2];
                if (lastPageLink && lastPageLink.href) {
                    const pageMatch = lastPageLink.href.match(/page=(\d+)/);
                    if (pageMatch && pageMatch[1]) {
                        totalPages = parseInt(pageMatch[1]);
                    }
                }
            }

            // Add the current page's reports
            parseReportsFromCurrentPage();

            // Fetch all other pages
            const fetchPromises = [];
            for (let page = 1; page <= totalPages; page++) {
                if (page !== currentPage) { // Skip current page as we already have it
                    fetchPromises.push(fetchReportPage(page));
                }
            }

            await Promise.all(fetchPromises);

            // Process and display the data
            processReportData();

        } catch (error) {
            console.error('Error fetching reports:', error);
            document.querySelector('.tm-loading').innerHTML = 'Error loading reports. Please try refreshing the page.';
        }
    }

    // Function to fetch a specific page of reports
    async function fetchReportPage(page) {
        try {
            const response = await fetch(`https://truckersmp.com/reports?page=${page}`);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Parse reports from this page
            const reportRows = doc.querySelectorAll('table.table tbody tr');
            reportRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 9) {
                    const reportLink = cells[8].querySelector('a').href;
                    const reportId = reportLink.split('/').pop();

                    allReports.push({
                        id: reportId,
                        reporter: cells[0].textContent.trim(),
                        perpetrator: cells[1].textContent.trim(),
                        server: cells[2].textContent.trim(),
                        reason: cells[3].textContent.trim(),
                        language: cells[4].textContent.trim(),
                        isClaimed: cells[5].textContent.trim(),
                        status: cells[6].textContent.trim(),
                        updatedAt: cells[7].textContent.trim(),
                        link: reportLink
                    });
                }
            });
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error);
        }
    }

    // Function to parse reports from the current page
    function parseReportsFromCurrentPage() {
        const reportRows = document.querySelectorAll('table.table tbody tr');
        reportRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 9) {
                const reportLink = cells[8].querySelector('a').href;
                const reportId = reportLink.split('/').pop();

                allReports.push({
                    id: reportId,
                    reporter: cells[0].textContent.trim(),
                    perpetrator: cells[1].textContent.trim(),
                    server: cells[2].textContent.trim(),
                    reason: cells[3].textContent.trim(),
                    language: cells[4].textContent.trim(),
                    isClaimed: cells[5].textContent.trim(),
                    status: cells[6].textContent.trim(),
                    updatedAt: cells[7].textContent.trim(),
                    link: reportLink
                });
            }
        });
    }

    // Process the report data and create visualizations
    function processReportData() {
        // Hide loading indicator and show content
        document.querySelector('.tm-loading').style.display = 'none';
        document.getElementById('tm-dashboard').style.display = 'grid';
        document.getElementById('tm-tabs').style.display = 'block';
        document.getElementById('tm-tab-content').style.display = 'block';

        // Basic statistics summary
        createStatsSummary();

        // Create the all reports table
        createAllReportsTable();

        // Create categories breakdown
        createCategoriesBreakdown();

        // Create repeated players list
        createRepeatedPlayersList();

        // Create charts
        createStatusChart();
        createCategoriesChart();

        // Make sure the original report list stays hidden
        // This is in case anything caused it to show again
        const originalTable = document.querySelector('.row.padding-top-5');
        if (originalTable) {
            originalTable.style.display = 'none';
        }
    }

    // Create statistics summary cards
    function createStatsSummary() {
        const dashboard = document.getElementById('tm-dashboard');

        // Count reports by status
        const statusCounts = {
            'New': 0,
            'Accepted': 0,
            'Declined': 0
        };

        allReports.forEach(report => {
            const status = report.status.trim();
            if (statusCounts.hasOwnProperty(status)) {
                statusCounts[status]++;
            }
        });

        // Get unique categories and languages
        const categories = [...new Set(allReports.map(report => report.reason))];
        const languages = [...new Set(allReports.map(report => report.language))];

        // Count unique reported players
        const uniquePlayers = new Set(allReports.map(report => report.perpetrator)).size;

        dashboard.innerHTML = `
            <div class="tm-card">
                <h3>Report Summary</h3>
                <div class="tm-stats">
                    <div class="tm-stat-item">
                        <div class="tm-stat-value">${allReports.length}</div>
                        <div class="tm-stat-label">Total Reports</div>
                    </div>
                    <div class="tm-stat-item">
                        <div class="tm-stat-value">${statusCounts['New']}</div>
                        <div class="tm-stat-label">New</div>
                    </div>
                    <div class="tm-stat-item">
                        <div class="tm-stat-value">${statusCounts['Accepted']}</div>
                        <div class="tm-stat-label">Accepted</div>
                    </div>
                    <div class="tm-stat-item">
                        <div class="tm-stat-value">${statusCounts['Declined']}</div>
                        <div class="tm-stat-label">Declined</div>
                    </div>
                </div>
            </div>
            <div class="tm-card">
                <h3>Player Statistics</h3>
                <div class="tm-stats">
                    <div class="tm-stat-item">
                        <div class="tm-stat-value">${uniquePlayers}</div>
                        <div class="tm-stat-label">Unique Players</div>
                    </div>
                    <div class="tm-stat-item">
                        <div class="tm-stat-value">${categories.length}</div>
                        <div class="tm-stat-label">Categories</div>
                    </div>
                    <div class="tm-stat-item">
                        <div class="tm-stat-value">${languages.length}</div>
                        <div class="tm-stat-label">Languages</div>
                    </div>
                    <div class="tm-stat-item">
                        <div class="tm-stat-value">${(statusCounts['Accepted'] / (statusCounts['Accepted'] + statusCounts['Declined']) * 100).toFixed(1)}%</div>
                        <div class="tm-stat-label">Acceptance Rate</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Rapor oluşturma fonksiyonunda değişiklik yapacağız
function createAllReportsTable() {
    const container = document.getElementById('tm-all-reports');

    // Gelişmiş tarih çözümleme ve sıralama
    const sortedReports = [...allReports].sort((a, b) => {
        // Tarih formatını dönüştürme
        const dateA = parseDetailedReportDate(a.updatedAt);
        const dateB = parseDetailedReportDate(b.updatedAt);

        // En son güncellenen en üstte olacak şekilde sıralama
        return dateB - dateA;
    });

    // Tabloyu oluşturma
    const tableHTML = `
        <table class="tm-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Perpetrator</th>
                    <th>Server</th>
                    <th>Reason</th>
                    <th>Language</th>
                    <th>Is claimed?</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${sortedReports.map(report => `
                    <tr data-status="${report.status.toLowerCase().trim()}">
                        <td>${report.id}</td>
                        <td>${report.perpetrator}</td>
                        <td>${report.server}</td>
                        <td>${report.reason}</td>
                        <td>${report.language}</td>
                        <td class="${report.isClaimed.includes('Yes') ? 'tm-yes' : 'tm-no'}">${report.isClaimed}</td>
                        <td class="tm-status-${report.status.toLowerCase().trim()}">${report.status}</td>
                        <td>${report.updatedAt}</td>
                        <td><a href="${report.link}" target="_blank">View</a></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;

    // Filtreleme butonları kurulumu
    const filterButtons = document.querySelectorAll('.tm-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktif butonu güncelleme
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filtreyi uygulama
            const filter = this.dataset.filter;
            const rows = container.querySelectorAll('tbody tr');

            rows.forEach(row => {
                if (filter === 'all') {
                    row.style.display = '';
                } else {
                    row.style.display = row.dataset.status === filter ? '' : 'none';
                }
            });
        });
    });

    // Arama kurulumu
    const searchInput = document.querySelector('.tm-search');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = container.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Gelişmiş tarih çözümleme fonksiyonu - tüm farklı tarih formatlarını işler
function parseDetailedReportDate(dateString) {
    const now = new Date();
    const currentYear = now.getFullYear();

    // "Today" formatı işleme (ör: "Today, 17:25")
    if (dateString.includes('Today')) {
        const timeMatch = dateString.match(/(\d{1,2}):(\d{1,2})/);
        if (timeMatch) {
            const hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);
            const today = new Date();
            today.setHours(hours, minutes, 0, 0);
            return today;
        }
        return new Date(); // Sadece "Today" içeriyorsa
    }

    // "Yesterday" formatı işleme (ör: "Yesterday, 15:30")
    if (dateString.includes('Yesterday')) {
        const timeMatch = dateString.match(/(\d{1,2}):(\d{1,2})/);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (timeMatch) {
            const hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);
            yesterday.setHours(hours, minutes, 0, 0);
        }
        return yesterday;
    }

    // "DD Mon HH:MM" formatını işleme (ör: "01 Mar 22:49")
    const shortDateRegex = /(\d{1,2})\s+([A-Za-z]{3})\s+(\d{1,2}):(\d{1,2})/;
    const shortDateMatch = dateString.match(shortDateRegex);
    if (shortDateMatch) {
        const day = parseInt(shortDateMatch[1], 10);
        const month = getMonthNumber(shortDateMatch[2]);
        const hours = parseInt(shortDateMatch[3], 10);
        const minutes = parseInt(shortDateMatch[4], 10);

        return new Date(currentYear, month, day, hours, minutes, 0);
    }

    // "DD Mon YYYY HH:MM" formatını işleme (ör: "10 Dec 2024 19:28")
    const longDateRegex = /(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{1,2}):(\d{1,2})/;
    const longDateMatch = dateString.match(longDateRegex);
    if (longDateMatch) {
        const day = parseInt(longDateMatch[1], 10);
        const month = getMonthNumber(longDateMatch[2]);
        const year = parseInt(longDateMatch[3], 10);
        const hours = parseInt(longDateMatch[4], 10);
        const minutes = parseInt(longDateMatch[5], 10);

        return new Date(year, month, day, hours, minutes, 0);
    }

    // Standart tarih formatını işleme (ör: "23/01/2023 15:30")
    const standardDateRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{1,2})/;
    const standardMatch = dateString.match(standardDateRegex);
    if (standardMatch) {
        const day = parseInt(standardMatch[1], 10);
        const month = parseInt(standardMatch[2], 10) - 1; // Ay 0-11 arasında
        const year = parseInt(standardMatch[3], 10);
        const hours = parseInt(standardMatch[4], 10);
        const minutes = parseInt(standardMatch[5], 10);

        return new Date(year, month, day, hours, minutes, 0);
    }

    // Eğer hiçbir format eşleşmezse, original stringi Date objesine çevirmeyi dene
    return new Date(dateString);
}

// Ay adını sayıya çevirme yardımcı fonksiyonu
function getMonthNumber(monthName) {
    const months = {
        'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5,
        'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
    };

    return months[monthName.toLowerCase().substring(0, 3)] || 0;
}

    // Create categories breakdown
    function createCategoriesBreakdown() {
        const container = document.getElementById('tm-categories');

        // Count categories
        const categoryCounts = {};
        allReports.forEach(report => {
            const category = report.reason;
            if (!categoryCounts[category]) {
                categoryCounts[category] = {
                    total: 0,
                    accepted: 0,
                    declined: 0,
                    new: 0
                };
            }

            categoryCounts[category].total++;

            const status = report.status.toLowerCase().trim();
            if (status === 'accepted') categoryCounts[category].accepted++;
            else if (status === 'declined') categoryCounts[category].declined++;
            else if (status === 'new') categoryCounts[category].new++;
        });

        // Sort categories by total count
        const sortedCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1].total - a[1].total);

        // Create the table
        const tableHTML = `
            <table class="tm-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Total</th>
                        <th>New</th>
                        <th>Accepted</th>
                        <th>Declined</th>
                        <th>Success Rate</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedCategories.map(([category, counts]) => `
                        <tr>
                            <td>${category}</td>
                            <td>${counts.total}</td>
                            <td>${counts.new}</td>
                            <td>${counts.accepted}</td>
                            <td>${counts.declined}</td>
                            <td>${counts.accepted + counts.declined > 0 ?
                                ((counts.accepted / (counts.accepted + counts.declined)) * 100).toFixed(1) + '%' :
                                'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    // Create repeated players list
    function createRepeatedPlayersList() {
        const container = document.getElementById('tm-repeated-players');

        // Count reports per player
        const playerCounts = {};
        allReports.forEach(report => {
            const player = report.perpetrator;
            if (!playerCounts[player]) {
                playerCounts[player] = {
                    total: 0,
                    accepted: 0,
                    declined: 0,
                    new: 0,
                    categories: {}
                };
            }

            playerCounts[player].total++;

            const status = report.status.toLowerCase().trim();
            if (status === 'accepted') playerCounts[player].accepted++;
            else if (status === 'declined') playerCounts[player].declined++;
            else if (status === 'new') playerCounts[player].new++;

            // Count categories for this player
            const category = report.reason;
            if (!playerCounts[player].categories[category]) {
                playerCounts[player].categories[category] = 0;
            }
            playerCounts[player].categories[category]++;
        });

        // Filter players with more than 1 report
        const repeatedPlayers = Object.entries(playerCounts)
            .filter(([_, counts]) => counts.total > 1)
            .sort((a, b) => b[1].total - a[1].total);

        // Create the table
        const tableHTML = `
            <table class="tm-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Total Reports</th>
                        <th>New</th>
                        <th>Accepted</th>
                        <th>Declined</th>
                        <th>Most Common Reason</th>
                    </tr>
                </thead>
                <tbody>
                    ${repeatedPlayers.map(([player, counts]) => {
                        // Find most common category
                        const mostCommonCategory = Object.entries(counts.categories)
                            .sort((a, b) => b[1] - a[1])[0];

                        return `
                        <tr>
                            <td>${player}</td>
                            <td>${counts.total}</td>
                            <td>${counts.new}</td>
                            <td>${counts.accepted}</td>
                            <td>${counts.declined}</td>
                            <td>${mostCommonCategory ? `${mostCommonCategory[0]} (${mostCommonCategory[1]})` : 'N/A'}</td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    // Create status distribution chart
    function createStatusChart() {
        const ctx = document.getElementById('status-chart').getContext('2d');

        // Count status
        const statusCounts = {
            'New': 0,
            'Accepted': 0,
            'Declined': 0
        };

        allReports.forEach(report => {
            const status = report.status.trim();
            if (statusCounts.hasOwnProperty(status)) {
                statusCounts[status]++;
            }
        });

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#3498db',  // Blue for New
                        '#2ecc71',  // Green for Accepted
                        '#e74c3c'   // Red for Declined
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'white'
                        }
                    }
                }
            }
        });
    }

    // Create categories distribution chart
    function createCategoriesChart() {
        const ctx = document.getElementById('categories-chart').getContext('2d');

        // Count categories
        const categoryCounts = {};
        allReports.forEach(report => {
            const category = report.reason;
            if (!categoryCounts[category]) {
                categoryCounts[category] = 0;
            }
            categoryCounts[category]++;
        });

        // Sort and get top 5 categories
        const topCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Calculate 'Other' category
        const totalReports = allReports.length;
        const topCategoriesSum = topCategories.reduce((sum, [_, count]) => sum + count, 0);
        const otherCount = totalReports - topCategoriesSum;

        // Prepare chart data
        const labels = [...topCategories.map(([category, _]) => {
            // Shorten long category names
            return category.length > 20 ? category.substring(0, 17) + '...' : category;
        })];

        if (otherCount > 0) {
            labels.push('Other');
        }

        const data = [...topCategories.map(([_, count]) => count)];

        if (otherCount > 0) {
            data.push(otherCount);
        }

        // Generate colors
        const colors = [
            '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#95a5a6'
        ];

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Reports',
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Start enhancing the page
    enhanceReportsPage();
})();