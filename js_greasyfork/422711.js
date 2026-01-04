// ==UserScript==
// @name         GMiner Hashrate Chart
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Add a chart to your GMiner API
// @author       Some1Else
// @match        http://localhost:10050/
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/422711/GMiner%20Hashrate%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/422711/GMiner%20Hashrate%20Chart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };


})();

var myChart = null;

window.onload = function() {
    $('body').append('<div style = "text-align:center;"><canvas id="myChart" width="1000" height="450"></canvas></div>')
    var ctx = document.getElementById('myChart').getContext('2d');
    ctx.canvas.width = window.innerWidth;

    myChart = new Chart(ctx, config);

    makeDatasets();
    updateData();
    updateData();
    setInterval(updateData, 600000);
};

var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        responsive: false,
        showLine: true,
        title: {
            display: true,
            text: 'Hash Rates'
        },
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: false,
                    precision: "2"
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Time'
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: false
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Hash Rate (MH/s)'
                }
            }]
        }
    }
};

function roundUp(num, precision) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
}

function makeDatasets() {
    GM.xmlHttpRequest( {
        method: 'GET',
        url: '/stat',
        responseType: "json",
        onload: function(response) {
            var data = window.JSON.parse(response.responseText);
            var devices = data.devices;
            devices.forEach(function(device) {
                var colorNames = Object.keys(window.chartColors);
                var colorName = colorNames[config.data.datasets.length % colorNames.length];
                var newColor = window.chartColors[colorName];
                var newDataset = {
                    label: device.name,
                    backgroundColor: newColor,
                    borderColor: newColor,
                    data: [],
                    fill: false
                };
                config.data.datasets.push(newDataset);
                myChart.update();
            });
        }
    });
}

function getNewTime() {
    var time = new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var roundedHours = "";
    var roundedMinutes = "";

    if (hours < 10) {
        roundedHours = "0" + hours;
    } else roundedHours = hours;
    if (minutes < 10) {
        roundedMinutes = "0" + minutes;
    } else roundedMinutes = minutes;

    var currentTime = roundedHours + ":" + roundedMinutes;
    config.data.labels.push(currentTime);
    if (config.data.labels.length > 144) {
        config.data.labels.shift()
    }
    myChart.update();
};

function updateHashRate(data, device, dataset) {
    var hashRate = device.speed.toFixed(data.speed_rate_precision);
    var roundedHashRate = hashRate / 1000000;
    dataset.data.push(roundUp(roundedHashRate, 2));
    myChart.update();
};

function updateData() {
    getNewTime();
    var data = null
    var devices = new Array();
    GM.xmlHttpRequest( {
        method: 'GET',
        url: '/stat',
        responseType: "json",
        onload: function(response) {
            data = window.JSON.parse(response.responseText);
            devices = data.devices;
            var datasets = config.data.datasets;
            var index = 0
            datasets.forEach(function(dataset) {
                updateHashRate(data, devices[index], dataset);
                index += 1;
            });
        }
    });
};