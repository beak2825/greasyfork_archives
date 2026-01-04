// ==UserScript==
// @name         Uiaa Results Visualiser
// @namespace    http://tampermonkey.net/
// @version      2025-01-19
// @description  Plots results achieved by competitors on routes in UIAA competitions.
// @author       agnieszka.kostrzewa@gmail.com
// @match        https://uiaa.results.info/*
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524325/Uiaa%20Results%20Visualiser.user.js
// @updateURL https://update.greasyfork.org/scripts/524325/Uiaa%20Results%20Visualiser.meta.js
// ==/UserScript==

'use strict';


const HEADER_CLASS = 'cr-head-container';
const BIB_INPUT_ID = 'tracked_bib_input';
const CREATE_CHARTS_BUTTON_ID = 'create_charts_button';

let contentDiv = null;
let bibInput = null;
let createChartsSubmitButton = null;
let intervalId = null;
let dataByBib = null;
let resultsPerRoute = null;
let bibToTrack = null;
let presentCharts = [];

let pathname = URL.parse(document.URL).pathname;
let roundId = pathname.split("/")[4];

let resultsApiUrl = 'https://uiaa.results.info/api/v1/category_rounds/' + roundId + '/results'

fetch(resultsApiUrl)
    .then(response => response.json())
    .then(data => { processResultsData(data)});

intervalId = setInterval(function() {
    if (document.getElementsByClassName(HEADER_CLASS).length) {
        contentDiv = document.getElementsByClassName(HEADER_CLASS)[0];
        bibInput = createTrackedBibInput();
        createChartsSubmitButton = createDrawChartsSubmitButton();

        contentDiv.appendChild(bibInput);
        contentDiv.appendChild(createChartsSubmitButton);

        clearInterval(intervalId);
    }
}, 1000);

function createTrackedBibInput() {
    let input = document.createElement('input');
    input.setAttribute('id', BIB_INPUT_ID);
    input.setAttribute('placeholder', 'Bib to track');
    input.required = false;
    input.style['margin-right'] = '15px';
    input.style.width = '30%';
    return input;
}

function createDrawChartsSubmitButton() {
    let button = document.createElement('button');
    let buttonTextNode = document.createTextNode('Show route results distribution');

    button.setAttribute('id', CREATE_CHARTS_BUTTON_ID);
    button.appendChild(buttonTextNode);
    button.addEventListener('click', function() {
        bibToTrack = bibInput.value;
        addCharts();
    }, false);
    return button;
}



function processResultsData(rawResults) {
    let routes = getRoutes(rawResults.routes)
    dataByBib = getResultsByBib(rawResults.ranking);
    resultsPerRoute = getResultsPerRoute(routes, dataByBib)
}

function getRoutes(rawRoutes) {
    let routes = [];
    for(let route in rawRoutes) {
        routes.push(rawRoutes[route].name)
    }
    return routes;
}

function getResultsByBib(ranking) {
    let dataByBib = {};
    for(let index in ranking) {
        let dataForBib = {};
        dataForBib.name = ranking[index].name
        dataForBib.ascents = ascentsForBib(ranking[index]);
        let bib = ranking[index].bib ? ranking[index].bib : ranking[index].athlete_id;
        dataByBib[bib] = dataForBib;
    }
    return dataByBib;
}

function ascentsForBib(onePersonData) {
    let ascents = {}
    for(let r in onePersonData.ascents){
        let routeName = onePersonData.ascents[r].route_name;
        let score = onePersonData.ascents[r].score;
        ascents[routeName] = score;
    }
    return ascents;
}

function getResultsPerRoute(routes, resultsByBib) {
    let resultsPerRoute = {};
    for( let r in routes) {
        resultsPerRoute[routes[r]] = {};
    }

    for( let bib in resultsByBib) {
        for( let route in resultsByBib[bib].ascents){

            let score = resultsByBib[bib].ascents[route];
            let currentTotal = resultsPerRoute[route][score] ? resultsPerRoute[route][score]: 0;
            resultsPerRoute[route][score] = currentTotal + 1;
        }
    }

    return resultsPerRoute;
}

function addCharts() {

    for(let index in presentCharts) {
        presentCharts[index].remove();
    }
    presentCharts = [];

    for( let route in resultsPerRoute) {
        presentCharts.push(addChartForRoute(route, resultsPerRoute[route]));
    }

}

function addChartForRoute(routeName, resultsForRoute) {

    let div = document.createElement('div');
    let canvas = document.createElement('canvas');
    let canvasId = "resultsChart-" + routeName;
    canvas.setAttribute('id', canvasId);

    div.appendChild(canvas);
    contentDiv.appendChild(div);

    let data = getBarChartDatasets(resultsForRoute);
    let resultForTrackedBib = null;
    if(bibToTrack in dataByBib) {
        resultForTrackedBib = dataByBib[bibToTrack].ascents[routeName];
    }
    if(resultForTrackedBib) {
        data = augmentDatasetsForTrackedBib(bibToTrack, resultForTrackedBib, data);
    }


    var ctx = document.getElementById(canvasId);

    const chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true
                },
                x: {
                    stacked: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: "Result distribution for Route " + routeName
                }
            }
        }
    });

    return div;
}

function augmentDatasetsForTrackedBib(bibToTrack, resultForTrackedBib, datasets) {
    let index = 0;
    let yPosition = 0;
    if(resultForTrackedBib == "TOP") {
        index = datasets.labels.length - 1;
        let values = datasets.datasets[0].data;
        yPosition = values[index];
    }
    else {
        let parsedPoints = resultForTrackedBib.split(".");
        index = parseInt(parsedPoints[0]);
        let topDatasetIndex = parseInt(parsedPoints.length == 2 ? parsedPoints[1][0]: 0);

        for(let i=0; i<=topDatasetIndex; i=i+1) {
            let values = datasets.datasets[i].data;
            yPosition = yPosition + values[index];
        }
    }



    let scatterDataset = {
        type: 'scatter',
        label: 'Result for BIB ' + bibToTrack,
        data: [{x: datasets.labels[index], y: yPosition}],
        backgroundColor: 'rgb(255, 99, 132)',
        pointRadius: 5,
        order: 1
    };

    for(let i=0; i<3; i=i+1) {
        datasets.datasets[i].order=2;
    }

    datasets.datasets.push(scatterDataset);
    return datasets;

}

function getBarChartDatasets(resultsForRoute) {
    /**
    Aiming at output like
    let data = {
             labels: [1,2,3,4,5],
             datasets: [{
                  label: 'n',
                  data: [12, 19, 4, 8, 5],
              },
              {
                  label: 'n.1',
                  data: [0,0,1,2, 6]
              },
         };
    **/
    let numberOfHolds = getNumberOfHolds(resultsForRoute);
    let labels = Array.from((new Array(numberOfHolds)).keys());
    labels.push("TOP");

    let datasets = [
        Array.from((new Array(numberOfHolds+1)).keys(), x => 0),
        Array.from((new Array(numberOfHolds+1)).keys(), x => 0),
        Array.from((new Array(numberOfHolds+1)).keys(), x => 0)
    ];

    for( let key in resultsForRoute) {
        if(key === "DNS") {
            continue;
        }
        if(key === "TOP") {
            datasets[0][numberOfHolds] = resultsForRoute[key];
            continue;
        }

        let parsedPoints = key.split(".");
        let index = parseInt(parsedPoints[0]);
        let datasetIndex = parseInt(parsedPoints.length == 2 ? parsedPoints[1][0]: 0);
        datasets[datasetIndex][index] = resultsForRoute[key];

    }

    return {
        labels: labels,
        datasets: [
            {
                label: "Hold reached",
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                data: datasets[0]
            },
            {
                label: "Next hold touched",
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                data: datasets[1]
            },
            {
                label: "Next hold controlled",
                backgroundColor: 'rgba(153, 102, 255, 0.8)',
                data: datasets[2]
            }
        ]
    }

}

function getNumberOfHolds(resultsForRoute) {
    let max = 0;

    for( let key in resultsForRoute) {
        if(key === "TOP" || key === "DNS") {
            continue;
        }
        let value = parseFloat(key);
        if(value > max) {
            max = value;
        }
    }

    max = max+1; //to account for TOP
    return Math.floor(max);
}


