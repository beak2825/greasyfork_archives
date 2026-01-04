// ==UserScript==
// @name         Covid19 TR enhancer
// @namespace    https://gist.github.com/ulasozguler/95d4a081da95e941c2fa3dc672ae624b
// @version      0.7
// @description  New information for official Covid-19 info website for Turkey.
// @author       You
// @match        https://covid19.saglik.gov.tr/
// @match        https://covid19.saglik.gov.tr/TR-66935/genel-koronavirus-tablosu.html?chart=1
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/chart.js@2.8.0
// @downloadURL https://update.greasyfork.org/scripts/410445/Covid19%20TR%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/410445/Covid19%20TR%20enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
#header-top, #header-middle, #main-slider-full, header {
    display: none;
}

header {
    position: initial;
}

.header-bottom {
    border: 0;
}

#vaka_sayilari_home {
    margin-top: 10px;
}

body {
    background-position-y: 0;
}

.clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}

.newinfo {
    background: #3c3c3c;
    color: white;
    font-size: 20px;
    padding: 10px;
    text-align: center;
    line-height: 24px;
    border: 10px solid white;
    box-shadow: 0 0 25px #d4d4d4;
    margin: 10px auto;
    width: 55%;
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
}

.newinfo .column {
    float: left;
    width: 25%;
    min-width: 200px;
    margin: 10px 0;
}

.newinfo b {
    font-size: 48px;
    line-height: 48px;
}

#chartsArea {
    width: 100%;
    height: 1175px;
    border: 0;
}

.chartContainer {
    width: 1120px;
    margin: 10px auto;
    padding: 10px;
}

#post-carosel-2 {
    margin-top: 0px;
    background: none;
    padding-top: 0px;
}

#preloader {
    display: none;
}
    `);

    const DAYS = 30;

    function getNum(strnum) {
        return parseInt(strnum.replaceAll('.', ''));
    }

    function preapareChartsArea() {
        var iframeNode = document.createElement('iframe')
        iframeNode.setAttribute('id', 'chartsArea')
        iframeNode.setAttribute('src', 'https://covid19.saglik.gov.tr/TR-66935/genel-koronavirus-tablosu.html?chart=1')

        var referenceNode = document.querySelector('#post-carosel-2');
        referenceNode.parentNode.insertBefore(iframeNode, referenceNode)
        return iframeNode
    }

    function preapareNewChart() {
        var chartNode = document.createElement('div')
        chartNode.setAttribute('class', 'chartContainer')
        var chartCanvas = document.createElement('canvas')
        chartNode.appendChild(chartCanvas)

        document.body.appendChild(chartNode)
        return chartCanvas.getContext('2d')
    }

    function prepareNewSection() {
        var containerNode = document.createElement('div')
        containerNode.setAttribute('class', 'newinfo clearfix')

        var referenceNode = document.querySelector('#vaka_sayilari_home')
        referenceNode.parentNode.insertBefore(containerNode, referenceNode.nextSibling)
        return containerNode
    }

    function drawLatest(data) {
        data = data[0]
        var total = getNum(data.toplam_hasta)
        var dead = getNum(data.toplam_vefat)
        var recovered = getNum(data.toplam_iyilesen)
        var active = total - (recovered + dead)

        var newtest = getNum(data.gunluk_test)
        var newsick = getNum(data.gunluk_hasta)
        var newdead = getNum(data.gunluk_vefat)
        var newrecover = getNum(data.gunluk_iyilesen)
        var newactive = newsick - (newrecover + newdead)

        var positivetestratio = (newsick / newtest * 100).toFixed(2)
        var deathratio = (dead / total * 100).toFixed(2)

        var html = '';
        html += '<div class="column"><span class="infolabel">' + 'Aktif Hasta Sayısı' + '<br><b>' + active.toLocaleString('tr-TR') + '</b></div>';
        html += '<div class="column"><span class="infolabel">' + 'Hasta Sayısı Değişim' + '<br><b>' + newactive.toLocaleString('tr-TR') + '</b></div>';
        html += '<div class="column"><span class="infolabel">' + 'Pozitif Test Oranı' + '<br><b>%' + positivetestratio.toLocaleString('tr-TR') + '</b></div>';
        html += '<div class="column"><span class="infolabel">' + 'Toplam Ölüm Oranı' + '<br><b>%' + deathratio.toLocaleString('tr-TR') + '</b></div>';

        var section = prepareNewSection()
        section.innerHTML = html;
    }

    function drawCharts(data) {
        var data30d = data.slice(0, DAYS).reverse()

        var datasets = [
            { label: 'Hasta',         fill: false, data: [], backgroundColor: '#358e8c', borderColor: '#358e8c85', },
            { label: 'İyileşen',      fill: false, data: [], backgroundColor: '#349050', borderColor: '#34905085', },
            { label: 'Vefat',         fill: false, data: [], backgroundColor: '#ff5d6c', borderColor: '#ff5d6c85', yAxisID: 'B' },
            { label: 'Test (K)',      fill: false, data: [], backgroundColor: '#757500', borderColor: '#75750085'},
            { label: 'Hasta Değişim', fill: 'origin', data: [], backgroundColor: '#a0379d', borderColor: '#a0379d85'},
        ]

        var labels = []
        for(var row of data30d) {
            labels.push(row.tarih)
            datasets[0].data.push(getNum(row.gunluk_hasta))
            datasets[1].data.push(getNum(row.gunluk_iyilesen))
            datasets[2].data.push(getNum(row.gunluk_vefat))
            datasets[3].data.push(getNum(row.gunluk_test) / 1000)
            datasets[4].data.push(getNum(row.gunluk_hasta) - getNum(row.gunluk_vefat) - getNum(row.gunluk_iyilesen))
        }

        var chart1ctx = preapareNewChart()
        new Chart(chart1ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets.slice(0, 3)
            },
            options: {
                scales: {
                    yAxes: [{
                        id: 'A',
                        position: 'left',
                    }, {
                        id: 'B',
                        position: 'right',
                    }]
                },
                tooltips: {
                    mode: 'index',
                    axis: 'x'
                }
            }
        });

        var chart2ctx = preapareNewChart()
        new Chart(chart2ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets.slice(3, 5)
            },
            options: {
                tooltips: {
                    mode: 'index',
                    axis: 'x'
                }
            },
            plugins: [{
                beforeRender: function (x, options) {
                    var c = x.chart
                    var dataset_index = 1;
                    var dataset = x.data.datasets[dataset_index];
                    var yScale = x.scales['y-axis-0'];
                    var yPos = yScale.getPixelForValue(0);

                    var gradientFill = c.ctx.createLinearGradient(0, 0, 0, c.height);
                    var startColor = '#ff00001a';
                    var endColor = '#00ff001a';
                    gradientFill.addColorStop(0, startColor);
                    gradientFill.addColorStop(yPos / c.height - 0.01, startColor);
                    gradientFill.addColorStop(yPos / c.height + 0.01, endColor);
                    gradientFill.addColorStop(1, endColor);

                    var model = x.data.datasets[dataset_index]._meta[Object.keys(dataset._meta)[0]].dataset._model;
                    model.backgroundColor = gradientFill;
                }
            }]
        });
    }

    if(document.location.pathname == '/') { // homepage
        drawLatest(sondurumjson) // defined in page
        preapareChartsArea()
    } else { // datatable page
        GM_addStyle(`
            body * { display: none; }
            body { background: none; }
            .chartContainer { display: block !important; }
        `)
        drawCharts(geneldurumjson)
    }

})();