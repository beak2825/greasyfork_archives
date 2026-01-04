// ==UserScript==
// @name         TM League Progress Charts
// @namespace    https://trophymanager.com
// @version      1.0
// @description  TrophyManager: Visualise progress of league position and total points for each matchday in charts. Available at League Fixtures page.
// @author       UNITE eM (Club ID: 551050)
// @match        https://trophymanager.com/fixtures/league/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449996/TM%20League%20Progress%20Charts.user.js
// @updateURL https://update.greasyfork.org/scripts/449996/TM%20League%20Progress%20Charts.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function getPoint(a, b) {
        if (a > b) {
            return 3;
        } else if (a == b) {
            return 1;
        } else {
            return 0;
        }
    }

    function sumArray(a, b) {
        var c = [];
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
            c.push((a[i] || 0) + (b[i] || 0));
        }
        return c;
    }

    function getDataFromFixtures() {
        var fixtureData = fixture_data;
        var matches = [];
        for (let key in fixtureData) {
            matches = matches.concat(fixtureData[key].matches);
        }

        var names = {};
        for (let i = 0; i < 9; i++) {
            names[matches[i].hometeam] = matches[i].hometeam_name;
            names[matches[i].awayteam] = matches[i].awayteam_name;
        }

        var points = {};
        var league = {};
        var position = {};
        for (let key in names) {
            points[key] = [];
            league[key] = [0, 0, 0, parseInt(key)];
            position[key] = [];
        }

        var isPlayed = false;
        var temp = [];
        for (let i = 0; i < 306; i++) {
            let homeId = matches[i].hometeam;
            let awayId = matches[i].awayteam;

            let result = matches[i].result;
            if (result == null) {
                if (isPlayed) break;

                points[homeId].push(null);
                points[awayId].push(null);

                position[homeId].push(null);
                position[awayId].push(null);
            } else {
                let [homeGoal, awayGoal] = result.split("-").map(Number);

                points[homeId].push(getPoint(homeGoal, awayGoal));
                points[awayId].push(getPoint(awayGoal, homeGoal));

                temp = [
                    getPoint(homeGoal, awayGoal),
                    homeGoal - awayGoal,
                    homeGoal,
                ];
                league[homeId] = sumArray(league[homeId], temp);

                temp = [
                    getPoint(awayGoal, homeGoal),
                    awayGoal - homeGoal,
                    awayGoal,
                ];
                league[awayId] = sumArray(league[awayId], temp);

                if ((i + 1) % 9 == 0) {
                    let array = Object.keys(league).map(function (key) {
                        return league[key];
                    });

                    const sortLeague = (a, b, attrs) =>
                        Object.keys(attrs).reduce(
                            (diff, k) =>
                                diff == 0 ? attrs[k](a[k], b[k]) : diff,
                            0
                        );

                    array.sort((a, b) =>
                        sortLeague(a, b, {
                            0: (a, b) => b - a,
                            1: (a, b) => b - a,
                            2: (a, b) => b - a,
                            3: (a, b) => a - b,
                        })
                    );

                    for (let key in names) {
                        position[key].push(array.indexOf(league[key]) + 1);
                    }
                }

                isPlayed = true;
            }
        }

        var cumulativePoints = {};
        for (let key in points) {
            const cumulativeSum = ((sum) => (value) => (sum += value))(0);
            cumulativePoints[key] = points[key].map(cumulativeSum);
        }

        return [names, cumulativePoints, position];
    }

    function convertToDatasets(names, data) {
        var datasets = [];
        var ids = Object.keys(names);
        var colours = [
            "#FFFF00",
            "#00FFFF",
            "#FF00FF",
            "#FF0000",
            "#00DD00",
            "#0000FF",
            "#FF8800",
            "#6600AA",
            "#0055FF",
            "#AA0066",
            "#222222",
            "#99FF00",
            "#00CC66",
            "#FFFFFF",
            "#CC6633",
            "#FFDD43",
            "#8B0000",
            "#BBC2CC",
        ];

        for (let i = 0; i < ids.length; i++) {
            datasets.push({
                label: names[ids[i]],
                data: data[ids[i]],
                fill: false,
                lineTension: 0.1,
                backgroundColor: colours[i],
                borderColor: colours[i],
                pointBackgroundColor: colours[i],
                pointBorderColor: colours[i],
            });
        }
        datasets.sort((a, b) => a.label.localeCompare(b.label));
        return datasets;
    }

    function buildChart(chartData) {
        let [names, cumulativePoints, position] = chartData;

        let progressChart =
            '<div class="box">' +
            '<div class="box_head">' +
            '<h2 class="std">Progress Charts</h2>' +
            "</div>" +
            '<div class="box_body">' +
            '<div class="box_shadow"></div>' +
            '<div class="background_gradient" style="padding-bottom:10px">' +
            '<div class="chart_header" style="background: url(/pics/content_menu_stats.png) no-repeat 5px center;padding:10px 0 10px 35px;">League Position</div>' +
            '<canvas id="chart_position" width="480" height="400"></canvas>' +
            "</div>" +
            '<div class="background_gradient" style="padding-bottom:10px">' +
            '<div class="chart_header" style="background: url(/pics/content_menu_stats.png) no-repeat 5px center;padding:10px 0 10px 35px;">Total Points</div>' +
            '<canvas id="chart_points" width="480" height="400"></canvas>' +
            "</div>" +
            "</div>" +
            '<div class="box_footer">' +
            "<div></div>" +
            "</div>" +
            "</div>";
        $(".column2_a").append(progressChart);

        var matchday = Array.from(Array(35).keys()).slice(1);
        var datasets = convertToDatasets(names, position);

        var ctxA = document.getElementById("chart_position").getContext("2d");
        var myChartA = (window.myChart = new Chart(ctxA, {
            type: "line",
            data: {
                labels: matchday,
                datasets: datasets,
            },
            options: {
                legend: {
                    position: "bottom",
                    labels: {
                        boxWidth: 5,
                        fontColor: "#ffffff",
                        padding: 6,
                        usePointStyle: true,
                    },
                },
                scales: {
                    xAxes: [
                        {
                            position: "bottom",
                            scaleLabel: {
                                display: true,
                                labelString: "Matchday",
                                fontColor: "#ffffff",
                            },
                            gridLines: {
                                color: "#6C9922",
                                tickMarkLength: 5,
                                zeroLineWidth: 2,
                                zeroLineColor: "#6C9922",
                            },
                            ticks: {
                                min: 1,
                                max: 34,
                                maxRotation: 0,
                                minRotation: 0,
                                fontColor: "#ffffff",
                                maxTicksLimit: 11,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                color: "#6C9922",
                                tickMarkLength: 5,
                                zeroLineWidth: 2,
                                zeroLineColor: "#6C9922",
                            },
                            ticks: {
                                min: 1,
                                max: 18,
                                fontColor: "#ffffff",
                                reverse: true,
                                maxTicksLimit: 18,
                            },
                        },
                    ],
                },
            },
        }));

        datasets = convertToDatasets(names, cumulativePoints);

        var ctxB = document.getElementById("chart_points").getContext("2d");
        var myChartB = (window.myChart = new Chart(ctxB, {
            type: "line",
            data: {
                labels: matchday,
                datasets: datasets,
            },
            options: {
                legend: {
                    position: "bottom",
                    labels: {
                        boxWidth: 5,
                        fontColor: "#ffffff",
                        padding: 6,
                        usePointStyle: true,
                    },
                },
                scales: {
                    xAxes: [
                        {
                            position: "bottom",
                            scaleLabel: {
                                display: true,
                                labelString: "Matchday",
                                fontColor: "#ffffff",
                            },
                            gridLines: {
                                color: "#6C9922",
                                tickMarkLength: 5,
                                zeroLineWidth: 2,
                                zeroLineColor: "#6C9922",
                            },
                            ticks: {
                                min: 1,
                                max: 34,
                                maxRotation: 0,
                                minRotation: 0,
                                fontColor: "#ffffff",
                                maxTicksLimit: 11,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                color: "#6C9922",
                                tickMarkLength: 5,
                                zeroLineWidth: 2,
                                zeroLineColor: "#6C9922",
                            },
                            ticks: {
                                min: 0,
                                precision: 0,
                                fontColor: "#ffffff",
                                reverse: false,
                                maxTicksLimit: 18,
                            },
                        },
                    ],
                },
            },
        }));
    }

    function init(mutationRecord) {
        if (document.querySelector("div#fixtures_content" + " div") === null) {
            return;
        }
        let chartData = getDataFromFixtures();
        buildChart(chartData);
    }

    let observer = new MutationObserver(init);
    observer.observe(document.querySelector("div#fixtures_content"), { childList: true, });

})();
