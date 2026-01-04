// ==UserScript==
// @name         OnlineSequencer Playcount Tracker ChartJS
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Track Playcount Changes on OnlineSequencer and display Chart within users profile page
// @author       Your Name
// @match        https://onlinesequencer.net/members/19045
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      onlinesequencer.net

// @downloadURL https://update.greasyfork.org/scripts/498280/OnlineSequencer%20Playcount%20Tracker%20ChartJS.user.js
// @updateURL https://update.greasyfork.org/scripts/498280/OnlineSequencer%20Playcount%20Tracker%20ChartJS.meta.js
// ==/UserScript==

//add these as @require
//https://cdn.jsdelivr.net/npm/chart.js
//https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns

(function() {
    'use strict';

    // Configuration
    const runOnPageLoad = true;
    const checkForUpdates = true;
    const updateInterval = 7200000;

    let history = GM_getValue('detailsHistorytest', []) || [];
    let lastPlayCount = history.length ? history[0].value : null;
    let nextCheckTime = Date.now() + updateInterval;

    function formatDateWithOffset(date) {
        const pad = (num) => (num < 10 ? '0' : '') + num;
        const tzOffset = -date.getTimezoneOffset();
        const diff = tzOffset >= 0 ? '+' : '-';
        const offset = Math.abs(tzOffset);
        const offsetHours = pad(Math.floor(offset / 60));
        const offsetMinutes = pad(offset % 60);
        const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${diff}${offsetHours}:${offsetMinutes}`;
        return formattedDate;
    }

    function updateDetails() {
        console.log('Fetching details from OnlineSequencer...');
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://onlinesequencer.net/members/19045',
            onload: function(response) {
                console.log('Response received:', response.status, response.statusText);
                if (response.status === 200) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, 'text/html');
                    let detailsElement = doc.querySelector('.details');
                    let playsText = detailsElement.innerHTML.match(/(\d{1,3}(,\d{3})*)(?=\s*plays)/)[0];
                    console.log('Number of plays extracted:', playsText);

                    let message = `Playcount: ${playsText} `;
                    if (playsText !== lastPlayCount) {
                        let newPlays = parseInt(playsText.replace(/,/g, '')) - parseInt(lastPlayCount.replace(/,/g, ''));
                        message += `(${newPlays} new plays found). Chart updated.`;
                        console.log('Play count has changed.');
                        let dateTime = formatDateWithOffset(new Date());
                        history.unshift({
                            dateTime: dateTime,
                            value: playsText
                        });
                        console.log('New entry added to history:', { dateTime, value: playsText });
                        lastPlayCount = playsText;
                        GM_setValue('detailsHistorytest', history);
                        updateChart();
                    } else {
                        message += `has not changed.`;
                        console.log('Play count has not changed.');
                    }
                    document.getElementById('checkStatus').textContent = message;
                } else {
                    console.error('Failed to fetch page:', response.status, response.statusText);
                }
            },
            onerror: function(error) {
                console.error('Error fetching page:', error);
            }
        });
    }

    function updateChart() {
        let existingChart = document.getElementById('playcountChart');
        if (existingChart) {
            existingChart.remove();
        }

        const chartContainer = document.createElement('div');
        chartContainer.id = 'playcountChart';
        chartContainer.style.width = '100%';
        chartContainer.style.height = GM_getValue('chartHeight', '396px');
        chartContainer.style.backgroundColor = '#484f57';

        const ctx = document.createElement('canvas');
        chartContainer.appendChild(ctx);

        const colors = ['#D3D3D3', '#676e7a'];
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: history.map(entry => entry.dateTime),
                datasets: [{
                    label: 'Play Count',
                    data: history.map(entry => parseInt(entry.value.replace(/,/g, ''))),
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    borderColor: '#676e7a00',
                    pointStyle: 'rectRounded',
                    borderWidth: 1,
                    pointRadius: 1,
                    pointBackgroundColor: 'white',
                    pointBorderColor: 'white',
                    pointHoverBackgroundColor: 'white',
                    pointHoverBorderColor: 'white'
                }]
            },
            options: {
                devicePixelRatio: 2,
                animation: false,
                responsive: true,
                maintainAspectRatio: false,
                    interaction: {
                        intersect: false
                    },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        caretPadding: 7,
                        cornerRadius: 0,
                        borderColor: 'rgba(107, 107, 107, 0.65)',
                        borderWidth: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        padding: 7,
                        caretSize: 7,
                        bodyFont: {
                              family: "PT Sans, sans-serif",
                              weight: 'bold',
                              size: 10
                        },
                        titleFont: {
                              family: "PT Sans, sans-serif",
                              weight: 'bold',
                              size: 10
                        },
                        displayColors: false,
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.formattedValue;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        border: {
                            display: false,
                        },
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 20,
                            minRotation: 0,
                            maxRotation: 0,
                            color: (c) => {
                                return colors[c.index % colors.length]
                            },
                            font: {
                              family: "PT Sans, sans-serif",
                              weight: 'bold',
                              size: 10
                            }
                        },
                        grid: {
                            color: '#33373d50',
                            lineWidth: 1,
                            display: true
                        }
                    },
                    y: {
                        border: {
                            display: false,
                        },
                        ticks: {
                            stepSize: 1,
                            color: (c) => {
                                return colors[c.index % colors.length]
                            },
                            font: {
                              family: "PT Sans, sans-serif",
                              weight: 'bold',
                              size: 10
                            },
                            callback: function(value) {
                                   return value.toLocaleString();
                            }
                        },
                        grid: {
                            color: '#33373d50',
                            lineWidth: 1,
                            display: true
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 6,
                        right: 11,
                        top: 14,
                        bottom: 4
                    }
                }
            }
        });

        const existingBtitleDiv = document.querySelector('.btitle[data-custom]');
        if (!existingBtitleDiv) {
            const newBtitleDiv = document.createElement('div');
            newBtitleDiv.className = 'btitle';
            newBtitleDiv.textContent = 'Playchart';
            newBtitleDiv.dataset.custom = 'true';
            newBtitleDiv.style.display = 'flex';
            newBtitleDiv.style.alignItems = 'center';

            const button = document.createElement('button');
            const icon = document.createElement('i');
            icon.className = 'fas fa-cog';
            button.appendChild(icon);
            button.style.marginLeft = '2px';
            button.style.color = 'lightgray';
            button.style.border = '1px solid #3a3c3e00';
            button.style.backgroundColor = '#3a3c3e00';
            button.style.fontSize = '12px';
            button.style.fontFamily = 'PT Sans, sans-serif';
            button.style.cursor = 'pointer';

            const checkStatus = document.createElement('span');
            checkStatus.id = 'checkStatus';
            checkStatus.style.marginLeft = '3px';
            checkStatus.style.color = 'lightgray';
            checkStatus.style.fontSize = '12px';
            checkStatus.style.fontFamily = 'PT Sans, sans-serif';

            const countdownSpan = document.createElement('span');
            countdownSpan.id = 'countdownTimer';
            countdownSpan.style.marginLeft = '3px';
            countdownSpan.style.color = 'lightgray';
            countdownSpan.style.fontSize = '12px';
            countdownSpan.style.fontFamily = 'PT Sans, sans-serif';

            button.addEventListener('click', () => {
                const options = newBtitleDiv.querySelector('.options');
                if (options) {
                    options.remove();
                } else {
                    const newOptions = document.createElement('div');
                    newOptions.className = 'options';
                    newOptions.style.marginLeft = '10px';

                    const smallButton = document.createElement('button');
                    smallButton.textContent = 'Small';
                    smallButton.addEventListener('click', () => {
                        chartContainer.style.height = '148px';
                        GM_setValue('chartHeight', '148px');
                        newOptions.remove();
                        updateChart();
                    });

                    const largeButton = document.createElement('button');
                    largeButton.textContent = 'Large';
                    largeButton.addEventListener('click', () => {
                        chartContainer.style.height = '396px';
                        GM_setValue('chartHeight', '396px');
                        newOptions.remove();
                        updateChart();
                    });

                    const hideButton = document.createElement('button');
                    hideButton.textContent = 'Hide';
                    hideButton.addEventListener('click', () => {
                        chartContainer.style.height = '0px';
                        GM_setValue('chartHeight', '0px');
                        newOptions.remove();
                        updateChart();
                    });

                    [smallButton, largeButton, hideButton].forEach(btn => {
                        btn.style.color = 'white';
                        btn.style.border = '1px solid lightgray';
                        btn.style.backgroundColor = '#3a3c3e00';
                        btn.style.fontSize = '12px';
                        btn.style.fontFamily = 'PT Sans, sans-serif';
                        btn.style.cursor = 'pointer';
                        btn.style.marginLeft = '5px';
                    });

                    newOptions.appendChild(smallButton);
                    newOptions.appendChild(largeButton);
                    newOptions.appendChild(hideButton);
                    newBtitleDiv.appendChild(newOptions);
                }
            });

            newBtitleDiv.appendChild(button);
            newBtitleDiv.appendChild(checkStatus);
            newBtitleDiv.appendChild(countdownSpan);

            const existingBtitle = document.querySelector('.btitle');
            existingBtitle.parentNode.insertBefore(newBtitleDiv, existingBtitle);
        }

        const block = document.querySelector('.block');
        block.insertBefore(chartContainer, document.querySelector('.btitle[data-custom]').nextSibling);
    }

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    function updateCountdown() {
        const countdownTimer = document.getElementById('countdownTimer');
        if (countdownTimer) {
            const remainingTime = nextCheckTime - Date.now();
            if (remainingTime <= 0) {
                countdownTimer.textContent = `Next check in: 0s.`;
            } else {
                countdownTimer.textContent = `Next check in: ${formatTime(remainingTime)}.`;
            }
        }
    }

    function startDetailsTracker() {
        console.log('Starting Details Tracker...');
        updateChart();
        updateDetails();
        if (checkForUpdates) {
            setInterval(updateDetails, updateInterval);
            setInterval(updateCountdown, 1000);
        }
    }

    if (runOnPageLoad) {
        startDetailsTracker();
    }
})();

