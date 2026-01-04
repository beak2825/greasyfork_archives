// ==UserScript==
// @name         CSStats Match ADR Trend Chart
// @namespace    http://github.com/dykomenko
// @version      1.0
// @description  Показывает тренд роста ADR с графиком и сглаживанием на csstats.gg/player/*#/matches
// @author       dykomenko
// @match        https://csstats.gg/player/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540887/CSStats%20Match%20ADR%20Trend%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/540887/CSStats%20Match%20ADR%20Trend%20Chart.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement("style");
    style.innerHTML = `
        tbody > tr > td:nth-child(11) {
            background-color: #3d434729 !important;
        }
        #chartContainer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 250px;
            background: #1a1a1a;
            z-index: 9999;
            padding: 10px;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.5);
        }
    `;
    document.head.appendChild(style);

    let chart, chartContainer, canvas;

    function loadChartJs(callback) {
        if (window.Chart) {
            callback();
            return;
        }
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.onload = callback;
        document.body.appendChild(script);
    }

    function movingAverage(data, windowSize = 5) {
        return data.map((_, idx, arr) => {
            const start = Math.max(0, idx - Math.floor(windowSize / 2));
            const end = Math.min(arr.length, idx + Math.ceil(windowSize / 2));
            const subset = arr.slice(start, end);
            return subset.reduce((sum, val) => sum + val, 0) / subset.length;
        });
    }

    function buildChart() {
        const cells = document.querySelectorAll("tbody > tr > td:nth-child(11)");
        const values = Array.from(cells)
            .map(cell => parseInt(cell.textContent.trim()))
            .filter(num => !isNaN(num));

        if (values.length === 0) return;

        const smoothed = movingAverage(values, 10);

        if (!chart) {
            chartContainer = document.createElement("div");
            chartContainer.id = "chartContainer";

            canvas = document.createElement("canvas");
            canvas.id = "chartCanvas";
            chartContainer.appendChild(canvas);

            document.body.appendChild(chartContainer);

            const ctx = canvas.getContext("2d");
            chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: values.map((_, i) => i + 1),
                    datasets: [
                        {
                            label: "ADR (raw)",
                            data: values,
                            borderColor: "lime",
                            backgroundColor: "rgba(0,255,0,0.2)",
                            fill: false,
                            tension: 0.2
                        },
                        {
                            label: "ADR (smoothed)",
                            data: smoothed,
                            borderColor: "dodgerblue",
                            borderWidth: 2,
                            fill: false,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            suggestedMax: 150
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: "#eee"
                            }
                        }
                    }
                }
            });
        } else {
            chart.data.labels = values.map((_, i) => i + 1);
            chart.data.datasets[0].data = values;
            chart.data.datasets[1].data = smoothed;
            chart.update();
        }
    }

    function initChartLogic() {
        loadChartJs(() => {
            setTimeout(() => {
                buildChart();

                const targetNode = document.querySelector("tbody");
                if (!targetNode) return;

                const observer = new MutationObserver(() => {
                    buildChart();
                });

                observer.observe(targetNode, {
                    childList: true,
                    subtree: true
                });
            }, 1000);
        });
    }

    function watchUrlAndInit() {
        let lastPath = "";
        setInterval(() => {
            const hash = location.hash;
            if (hash.includes("/matches") && hash !== lastPath) {
                lastPath = hash;
                chart = null; // сброс графика
                initChartLogic();
            }
        }, 1000);
    }

    watchUrlAndInit();
})();
