// ==UserScript==
// @name         rustrun
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  vilka
// @author       You
// @match        https://rustrun.ru/
// @icon         https://www.google.com/s2/favicons?domain=rustrun.ru
// @grant        none
// @run-at       document-body
// @require      https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js
// @downloadURL https://update.greasyfork.org/scripts/424197/rustrun.user.js
// @updateURL https://update.greasyfork.org/scripts/424197/rustrun.meta.js
// ==/UserScript==


let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let observer = new MutationObserver((mutationsList, observer) => {
    let lastRun = document.querySelector(".graph-label");
    addDataToChart(lastRun.innerText.substring(-1, lastRun.innerText.length-1), lastRun.style.borderColor);
});


function addDataToChart(value, color) {
    let dataset = window.NES_chart.data.datasets[0];

    if(dataset.backgroundColor.length > 39) dataset.backgroundColor.shift();
    dataset.backgroundColor.push(color);

    if(dataset.data.length > 39) dataset.data.shift();
    dataset.data.push(value);
    window.NES_chart.update();
}


window.addEventListener('load', function() {
    setObserver();

    let NES_chartContainer_el = document.createElement("div");
    NES_chartContainer_el.style.cssText = "background: #1b1f35; border-radius: 6px; overflow: hidden; margin-top: 25px; margin-bottom: 30px;";

    let NES_chart_el = document.createElement("canvas");
    NES_chart_el.setAttribute("id", "NES_chart");
    NES_chart_el.setAttribute("width", "500");
    NES_chart_el.setAttribute("height", "500");
    NES_chartContainer_el.appendChild(NES_chart_el);


    let NES_toggleChartBtn_el = document.createElement("a");
    NES_toggleChartBtn_el.innerText = "ГРАФИК";
    NES_toggleChartBtn_el.style.cssText = "background: #00a9ae; font-size: 13px; font-weight: 500; color: #fff; padding: 10px 15px; cursor: pointer; outline: none; border: none; border-radius: 6px;";
    NES_toggleChartBtn_el.addEventListener("click", ()=> {
        console.log("click");
        if(NES_chartContainer_el.style.height === "0px") {
            NES_chartContainer_el.style.height = "auto";
            document.querySelector("#NES_chart").height = "500px";
            document.querySelector("#NES_chart").style.height = "500px";
        }
        else {
            NES_chartContainer_el.style.height = "0px";
        }
    })


    setTimeout(() => {

        document.querySelector(".nav").appendChild(NES_toggleChartBtn_el);

        let node = document.querySelector(".game");
        node.parentNode.insertBefore(NES_chartContainer_el, node.nextSibling);

        window.NES_chart = new Chart(document.getElementById('NES_chart'), {
            type: 'bar',
            data: {
                labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40"],
                datasets: [{
                    label: '',
                    backgroundColor: [],
                    borderColor: 'black',
                    data: []
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    // "enabled": false
                },
                layout: {
                    padding: {
                        left: 5,
                        right: 5,
                        top: 5,
                        bottom: 5
                    }
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 20,
                            stepSize: 1
                        }
                    }]
                },
                animation: {
                    /* "onComplete": function() {
                        let chartInstance = window.NES_chart,
                            ctx = chartInstance.ctx;

                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.fillStyle = "#ffffff";

                        this.data.datasets.forEach(function(dataset, i) {
                            let meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function(bar, index) {
                                let data = dataset.data[index];
                                // ctx.fillText(data, bar._model.x, bar._model.y - 5);
                                ctx.fillText(data, bar._model.x, 500-14);

                            });
                        });
                    } */
                }
            }
        });



        window.NES_chart.options.legend.display = false;
        window.NES_chart.update();
    }, 5000);
}, false);


function setObserver() {
    var list_el = document.querySelector(".list-games > .graph-label");
    if(!list_el) {
        window.setTimeout(setObserver,1000);
        return;
    }
    observer.observe(list_el, {attributes: true});
    console.log('Я слежу 😎');
}